import { NextRequest, NextResponse } from 'next/server'
import { authenticate } from '@/lib/supabase/api'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { GoogleGenAI } from '@google/genai'
import { z } from 'zod'
import { createHash } from 'crypto'
import { redis } from '@/lib/redis'
import { searchRelevantChunks } from '@/lib/ai/vector-search'
import { checkAndIncrementQuota, refundLegacyQuota } from '@/lib/ai/quota'
import {
  consumeUsage, getEntitlements, planRequired, quotaExceeded, refundUsage, requestKeyOf, UsageUnavailableError,
} from '@/lib/subscription/server'
import { rateLimit, tooMany } from '@/lib/rate-limit'
import { detectInjectionAttempt } from '@/lib/ai/prompt-guard'

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
  session_id:  z.string().uuid().nullish().transform((v) => v ?? undefined),
  document_id: z.string().uuid().nullish().transform((v) => v ?? undefined),
  image: z.object({
    data:     z.string().min(1),   // base64
    mimeType: z.string().min(1),   // 'image/jpeg' etc.
  }).optional(),
})

// ── Prompt système ───────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `Tu es Kelassi, tuteur pédagogique pour élèves congolais préparant le BEPC et le BAC au Congo Brazzaville.

Ta philosophie : un bon professeur ne donne pas la réponse — il guide l'élève pour qu'il la trouve lui-même. C'est ainsi que la connaissance devient durable.

── RÈGLE D'OR : MÉTHODE SOCRATIQUE ──
Ne donne JAMAIS la réponse directement. À la place :
1. **Analyse** ce que l'élève a déjà compris ou tenté
2. **Pose une question de relance** qui oriente sa réflexion vers la bonne piste
3. **Décompose** le problème en petites étapes que l'élève peut franchir une à une
4. **Donne un indice** si l'élève bloque, jamais la solution complète
5. **Valide** chaque bonne étape avec encouragement ("Exactement !", "Tu es sur la bonne voie !")
6. Si l'élève a trouvé la bonne réponse → **confirme et approfondis**

── EXEMPLES DE COMPORTEMENT ──
❌ Mauvais : "La réponse est x = 3"
✅ Bon : "Tu as déjà isolé x d'un côté, c'est bien ! Maintenant, que se passe-t-il si tu divises les deux membres par 2 ?"

❌ Mauvais : "La photosynthèse est le processus par lequel…"
✅ Bon : "Avant de t'expliquer, dis-moi : selon toi, pourquoi les plantes ont-elles besoin de lumière ?"

── STRUCTURE DE CHAQUE RÉPONSE ──
1. 🔍 **Ce que tu as bien compris** (valorise ce que l'élève sait déjà)
2. 💡 **Question ou indice** pour avancer (jamais la réponse complète)
3. 🔢 Si calcul : montre la MÉTHODE de la première étape, laisse l'élève faire les suivantes
4. ✅ **Question de vérification** à la fin : "Maintenant essaie : [exercice similaire simple]"
5. 🃏 **Flashcard** (uniquement quand le concept est maîtrisé) : [Question] → [Réponse]

── QUAND L'ÉLÈVE ENVOIE UNE IMAGE ──
1. Décris brièvement ce que tu vois (type d'exercice, matière, niveau apparent)
2. Ne résous PAS l'exercice directement
3. Identifie l'étape clé qui bloque probablement l'élève
4. Pose une première question ciblée pour l'orienter
Exemple : "Je vois un système de deux équations. Quelle méthode as-tu essayée jusqu'ici ?"

── EXCEPTIONS ──
- Si l'élève demande explicitement "donne-moi la réponse" ou "je n'y arrive vraiment pas après plusieurs essais" → donne la réponse complète en expliquant chaque étape
- Pour les définitions pures (pas de raisonnement) → donne directement

── FORMAT ──
- Français uniquement
- Maths : LaTeX inline \`$...$\` et bloc \`$$...$$\`
- Markdown : **gras**, listes, ## titres si nécessaire
- Maximum 300 mots — sois concis, l'élève doit agir, pas lire
- Si contexte document : cite "D'après le document, page X…"
- Si connaissances générales : précise "D'après le programme BEPC/BAC…"
- Utilise des analogies congolaises (marché, fleuve Congo, manioc, saison des pluies…) pour illustrer`

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

  // Auth : cookies (web) ou Bearer token (mobile)
  const { user, supabase } = await authenticate(req)
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  // Rate limit court terme (anti-burst) — vérifié AVANT le quota journalier
  // pour économiser l'appel Gemini si l'utilisateur spam le endpoint.
  const withinBurstLimit = await rateLimit(`ai-chat:${user.id}`, 5, 60)
  if (!withinBurstLimit) return tooMany()

  // Validation du body
  let body: z.infer<typeof chatSchema>
  try {
    body = chatSchema.parse(await req.json())
  } catch {
    return NextResponse.json({ error: 'Corps invalide' }, { status: 400 })
  }

  const question = sanitize(body.question)

  // Détection basique de tentative de prompt injection (override du system
  // prompt). On reste bienveillant : ce sont des élèves, pas des attaquants
  // professionnels — objectif = filtrer les tentatives évidentes, pas
  // bloquer agressivement des questions légitimes. Placée AVANT
  // checkAndIncrementQuota (qui incrémente inconditionnellement, cf.
  // lib/ai/quota.ts) pour ne pas consommer le quota journalier de l'élève
  // sur une requête qui de toute façon n'appellera jamais Gemini.
  if (detectInjectionAttempt(question)) {
    return NextResponse.json({
      error: {
        code: 'INJECTION_BLOCKED',
        message: 'Je ne peux pas traiter cette demande. Reformule ta question sur le cours et je serai ravi de t’aider !',
      },
    }, { status: 400 })
  }

  // Formule effective (serveur) — l'analyse d'une photo d'énoncé est une fonction Pro.
  const ent = await getEntitlements(user.id)
  if (body.image && !ent.can('ai_document_analysis')) return planRequired('ai_document_analysis')

  // Quota quotidien : consommé AVANT l'appel Gemini, rendu si la requête échoue.
  // La clé d'idempotence (en-tête Idempotency-Key) évite qu'une nouvelle
  // tentative après une coupure réseau compte deux fois.
  const requestKey = requestKeyOf(req)
  let refund: () => Promise<void>
  let quota: { remaining: number; used: number; limit: number; summary?: string; detail?: string }
  try {
    const usage = await consumeUsage(ent, 'ai_questions', requestKey)
    if (!usage.allowed) return quotaExceeded('ai_questions', usage)
    quota = {
      remaining: usage.remaining ?? 0, used: usage.used, limit: (usage.limit ?? 0) + usage.bonus,
      summary: usage.message.summary, detail: usage.message.detail,
    }
    refund = () => refundUsage(user.id, 'ai_questions', requestKey)
  } catch (err) {
    if (!(err instanceof UsageUnavailableError)) throw err
    // Repli tant que la migration 057 n'est pas appliquée.
    const legacy = await checkAndIncrementQuota(user.id, ent.plan)
    if (!legacy.allowed) {
      return NextResponse.json({
        error: { code: 'QUOTA_EXCEEDED', usage_type: 'ai_questions', message: `Ton quota quotidien Cognix IA est atteint (${legacy.limit} questions). Il sera renouvelé demain.`, remaining: 0 },
      }, { status: 429 })
    }
    quota = legacy
    refund = () => refundLegacyQuota(user.id)
  }

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

  // Cache Redis (clé incluant le plan — une réponse construite avec du
  // contenu premium ne doit jamais être servie depuis le cache à un élève
  // gratuit posant la même question)
  const cacheKey = `cache:chat:${ent.level >= 1 ? 'paid' : 'free'}:${createHash('sha256').update(question.toLowerCase()).digest('hex')}`
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
    isPremium:     ent.level >= 1,
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
      ? `Aucun passage spécifique trouvé dans "${documentTitle}" pour cette question. Réponds en t'appuyant sur tes connaissances du programme BEPC/BAC et indique que la réponse vient du programme général, pas du document.`
      : 'Pas de document spécifique — réponds en tuteur BEPC/BAC en utilisant tes connaissances du programme congolais.'

  const userPrompt = [
    documentTitle ? `DOCUMENT EN COURS D'ÉTUDE : "${documentTitle}"` : null,
    `CONTEXTE EXTRAIT DU DOCUMENT :\n${contextText}`,
    historyText ? `HISTORIQUE RÉCENT :\n${historyText}` : null,
    `QUESTION DE L'ÉLÈVE :\n${question}`,
  ].filter(Boolean).join('\n\n===\n\n')

  // Construction des parts : texte + image optionnelle
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const parts: any[] = [{ text: userPrompt }]
  if (body.image) {
    parts.push({ inlineData: { mimeType: body.image.mimeType, data: body.image.data } })
  }

  // thinkingBudget:0 — désactive le mode "réflexion" de Gemini 2.5 Flash
  let stream: Awaited<ReturnType<GoogleGenAI['models']['generateContentStream']>>
  try {
    stream = await getGenai().models.generateContentStream({
      model:    'gemini-2.5-flash',
      config:   {
        systemInstruction: SYSTEM_PROMPT,
        thinkingConfig:    { thinkingBudget: 0 },
      },
      contents: [{ role: 'user', parts }],
    })
  } catch (err) {
    // Une requête qui n'aboutit pas ne consomme pas de quota.
    await refund()
    console.error('[chat] Gemini indisponible:', err instanceof Error ? err.message : err)
    return NextResponse.json({
      error: { code: 'AI_UNAVAILABLE', message: 'Cognix IA ne répond pas pour le moment. Ta question n’a pas été décomptée, réessaie.' },
    }, { status: 502 })
  }

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
            quota:           { used: quota.used, limit: quota.limit, remaining: quota.remaining, summary: quota.summary, detail: quota.detail },
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
        // Réponse interrompue avant tout contenu : la question n'est pas décomptée.
        if (!fullResponse) await refund().catch(() => {})
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
