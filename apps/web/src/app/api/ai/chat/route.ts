import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { GoogleGenAI } from '@google/genai'
import { z } from 'zod'
import { createHash } from 'crypto'
import { redis } from '@/lib/redis'
import { searchRelevantChunks } from '@/lib/ai/vector-search'
import { checkAndIncrementQuota } from '@/lib/ai/quota'

export const maxDuration = 60

// ── Clients lazy (jamais instanciés au build time) ──────────────────────────

let _genai: GoogleGenAI | null = null
function getGenai(): GoogleGenAI {
  if (!_genai) _genai = new GoogleGenAI({ apiKey: process.env['GEMINI_API_KEY'] ?? '' })
  return _genai
}

let _admin: ReturnType<typeof createAdminClient> | null = null
function getAdmin() {
  if (!_admin) {
    _admin = createAdminClient(
      process.env['NEXT_PUBLIC_SUPABASE_URL']!,
      process.env['SUPABASE_SERVICE_ROLE_KEY']!
    )
  }
  return _admin
}

// ── Validation ───────────────────────────────────────────────────────────────

const chatSchema = z.object({
  question:    z.string().min(1).max(2000),
  session_id:  z.string().uuid().optional(),
  document_id: z.string().uuid().optional(),
})

// ── Prompt système ───────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `Tu es Kelassi, tuteur pédagogique pour élèves congolais préparant le BEPC et le BAC au Congo Brazzaville.

⚠️ RÈGLE ABSOLUE — JAMAIS D'INVENTION :
Tu réponds UNIQUEMENT à partir du CONTEXTE DU COURS fourni dans chaque message.
Si l'information n'est PAS dans le contexte fourni, réponds EXACTEMENT :
"📚 Cette information ne figure pas dans le document fourni. Consulte ton manuel ou demande à ton professeur."
Ne complète JAMAIS avec tes connaissances générales si le contexte est vide ou insuffisant.

QUAND LE CONTEXTE EST DISPONIBLE — MÉTHODE FEYNMAN :
1. Cite la source : "D'après le document [page X si disponible]…"
2. Reformule simplement, comme à un élève de 14 ans
3. Utilise des analogies de la vie congolaise (marché, fleuve Congo, manioc, football local…)
4. Numérotechaque étape du raisonnement (Étape 1, Étape 2…)
5. Identifie les erreurs de compréhension fréquentes
6. Termine TOUJOURS par : "✅ Pour vérifier ta compréhension : [question simple]"
7. Propose : "🃏 **Flashcard** : [Question courte] → [Réponse courte]"

FORMAT :
- Français uniquement
- Maths : LaTeX inline \`$...$\` et bloc \`$$...$$\`
- Markdown : titres ##, **gras**, listes à puces
- Maximum 400 mots
- Cite TOUJOURS la page si disponible dans le contexte`

function sanitize(text: string): string {
  return text.replace(/<(?:.|\n)*?>/gm, '').trim()
}

// ── Handler principal ────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  // Vérifie la clé Gemini avant tout
  if (!process.env['GEMINI_API_KEY']) {
    return NextResponse.json(
      { error: { code: 'MISCONFIGURED', message: 'GEMINI_API_KEY non configurée sur le serveur.' } },
      { status: 503 }
    )
  }

  // Auth via cookie Supabase SSR
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  // Validation du body
  let body: z.infer<typeof chatSchema>
  try {
    body = chatSchema.parse(await req.json())
  } catch {
    return NextResponse.json({ error: 'Corps invalide' }, { status: 400 })
  }

  // Plan + quota
  const { data: profile } = await getAdmin()
    .from('users').select('plan').eq('id', user.id).single()
  const plan  = profile?.plan ?? 'free'
  const quota = await checkAndIncrementQuota(user.id, plan)

  if (!quota.allowed) {
    return NextResponse.json({
      error: {
        code: 'QUOTA_EXCEEDED',
        message: `Limite journalière atteinte (${plan === 'free' ? '5' : '200'} questions/jour).${
          plan === 'free' ? ' Passe à Premium pour continuer.' : ' Réessaie demain.'
        }`,
        remaining: 0,
      },
    }, { status: 429 })
  }

  const question = sanitize(body.question)

  // Session : crée ou récupère
  let sessionId = body.session_id
  if (!sessionId) {
    const { data: session } = await supabase
      .from('chat_sessions')
      .insert({ user_id: user.id, document_id: body.document_id ?? null })
      .select('id')
      .single()
    sessionId = session!.id
  }

  // Cache Redis
  const cacheKey = `cache:chat:${createHash('sha256').update(question.toLowerCase()).digest('hex')}`
  const cached = await redis.get<string>(cacheKey)
  if (cached) {
    saveChatMessages(getAdmin(), sessionId, question, cached).catch(() => {})
    return new Response(cached, {
      headers: {
        'Content-Type':      'text/event-stream',
        'Cache-Control':     'no-cache',
        'X-Session-Id':      sessionId,
        'X-Quota-Remaining': String(quota.remaining),
        'X-Cache':           'HIT',
      },
    })
  }

  // Titre du document (si fourni) pour ancrer Kelassi dans ce document précis
  let documentTitle: string | null = null
  if (body.document_id) {
    const { data: doc } = await getAdmin()
      .from('documents')
      .select('title')
      .eq('id', body.document_id)
      .single()
    documentTitle = doc?.title ?? null
  }

  // Recherche vectorielle RAG — seuil abaissé à 0.45 quand un document est ciblé
  const chunks = await searchRelevantChunks(question, {
    matchCount:    8,
    minSimilarity: 0.72,
    documentId:    body.document_id,
  })

  // Historique des 5 derniers tours
  const { data: history } = await supabase
    .from('chat_messages')
    .select('role, content')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: false })
    .limit(10)

  const historyText = (history ?? [])
    .reverse()
    .map((m) => `${m.role === 'user' ? 'Élève' : 'Kelassi'}: ${m.content}`)
    .join('\n')

  // Prompt enrichi avec contexte RAG
  const contextText = chunks.length > 0
    ? chunks.map((c, i) =>
        `[Source ${i + 1}${c.page_number ? `, page ${c.page_number}` : ''}]\n${c.content}`
      ).join('\n\n---\n\n')
    : documentTitle
      ? `Aucun passage pertinent trouvé dans "${documentTitle}" pour cette question. Ne réponds pas avec des connaissances générales — dis à l'élève que tu ne trouves pas dans ce document.`
      : 'Aucun document de cours fourni. Réponds uniquement si tu as le contexte nécessaire, sinon oriente vers le manuel.'

  const userPrompt = [
    documentTitle ? `DOCUMENT EN COURS D'ÉTUDE : "${documentTitle}"` : null,
    `CONTEXTE EXTRAIT DU DOCUMENT :\n${contextText}`,
    historyText ? `HISTORIQUE RÉCENT :\n${historyText}` : null,
    `QUESTION DE L'ÉLÈVE :\n${question}`,
  ].filter(Boolean).join('\n\n===\n\n')

  // Streaming Gemini 2.5 Flash
  const stream = await getGenai().models.generateContentStream({
    model:    'gemini-2.5-flash',
    config:   { systemInstruction: SYSTEM_PROMPT },
    contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
  })

  let fullResponse = ''

  const readable = new ReadableStream({
    async start(controller) {
      const enc = new TextEncoder()

      try {
        // Métadonnées en premier
        controller.enqueue(enc.encode(
          `event: meta\ndata: ${JSON.stringify({
            session_id:      sessionId,
            quota_remaining: quota.remaining,
            sources_count:   chunks.length,
          })}\n\n`
        ))

        for await (const chunk of stream) {
          const text = chunk.text
          if (text) {
            fullResponse += text
            controller.enqueue(enc.encode(`data: ${JSON.stringify({ text })}\n\n`))
          }
        }

        controller.enqueue(enc.encode('event: done\ndata: {}\n\n'))
        controller.close()

        // Sauvegarde asynchrone via admin client (le client cookié peut expirer dans le callback)
        Promise.all([
          saveChatMessages(getAdmin(), sessionId!, question, fullResponse),
          redis.set(cacheKey, fullResponse, { ex: 86400 }),
        ]).catch(console.error)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erreur Gemini inconnue'
        console.error('[chat/stream] error:', message)
        try {
          controller.enqueue(enc.encode(`data: ${JSON.stringify({ error: message })}\n\n`))
          controller.close()
        } catch {}
      }
    },
  })

  return new Response(readable, {
    headers: {
      'Content-Type':      'text/event-stream',
      'Cache-Control':     'no-cache',
      'Connection':        'keep-alive',
      'X-Session-Id':      sessionId,
      'X-Quota-Remaining': String(quota.remaining),
    },
  })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function saveChatMessages(supabase: any, sessionId: string, question: string, answer: string) {
  await supabase.from('chat_messages').insert([
    { session_id: sessionId, role: 'user',      content: question },
    { session_id: sessionId, role: 'assistant', content: answer   },
  ])
}
