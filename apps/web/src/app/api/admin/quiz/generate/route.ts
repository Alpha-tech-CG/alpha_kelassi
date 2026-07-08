import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { GoogleGenAI } from '@google/genai'
import { z } from 'zod'

export const maxDuration = 60

const supabaseAdmin = createAdminClient(
  process.env['NEXT_PUBLIC_SUPABASE_URL']!,
  process.env['SUPABASE_SERVICE_ROLE_KEY']!
)

let _genai: GoogleGenAI | null = null
function getGenai() {
  if (!_genai) _genai = new GoogleGenAI({ apiKey: process.env['GEMINI_API_KEY'] ?? '' })
  return _genai
}

const schema = z.object({
  document_id: z.string().uuid(),
  title:       z.string().min(3).max(200).optional(),
  count:       z.number().int().min(3).max(20).default(10),
  is_premium:  z.boolean().default(false),
  time_limit_sec: z.number().int().min(60).max(3600).default(600),
})

/** POST /api/admin/quiz/generate — génère un QCM IA depuis un document (admin) */
export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const { data: profile } = await supabaseAdmin.from('users').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return NextResponse.json({ error: 'Admin requis' }, { status: 403 })

  let body: z.infer<typeof schema>
  try { body = schema.parse(await req.json()) }
  catch { return NextResponse.json({ error: 'Corps invalide' }, { status: 400 }) }

  // Récupère le document (matière/niveau) + ses chunks
  const { data: doc } = await supabaseAdmin
    .from('documents')
    .select('id, title, subject_id, level')
    .eq('id', body.document_id)
    .single()
  if (!doc) return NextResponse.json({ error: { code: 'NOT_FOUND' } }, { status: 404 })

  const { data: chunks } = await supabaseAdmin
    .from('document_chunks')
    .select('content')
    .eq('document_id', body.document_id)
    .order('chunk_index', { ascending: true })
    .limit(30)

  if (!chunks || chunks.length === 0) {
    return NextResponse.json(
      { error: { code: 'NOT_INDEXED', message: 'Document pas encore indexé.' } },
      { status: 422 }
    )
  }

  const context = chunks.map((c) => c.content).join('\n\n---\n\n').slice(0, 9000)

  const prompt = `Tu es un professeur congolais. À partir du cours ci-dessous, rédige exactement ${body.count} questions à choix multiple (QCM) pour préparer l'examen d'État.

Règles :
- 4 options par question, une seule correcte
- "correct_index" = index (0 à 3) de la bonne option
- "explanation" : corrigé court expliquant POURQUOI (max 200 caractères)
- Questions claires, sans piège inutile, adaptées au niveau ${doc.level}

Retourne UNIQUEMENT un tableau JSON valide, sans markdown :
[{"prompt":"...","options":["A","B","C","D"],"correct_index":0,"explanation":"..."}]

Cours :
${context}`

  const response = await getGenai().models.generateContent({
    model:    'gemini-2.5-flash',
    config:   { thinkingConfig: { thinkingBudget: 0 } },
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
  })
  const raw = response.text ?? ''

  let questions: Array<{ prompt: string; options: string[]; correct_index: number; explanation?: string }>
  try {
    const jsonStr = raw.startsWith('[') ? raw : raw.slice(raw.indexOf('['), raw.lastIndexOf(']') + 1)
    questions = JSON.parse(jsonStr)
    if (!Array.isArray(questions) || questions.length === 0) throw new Error('empty')
  } catch {
    return NextResponse.json({ error: { code: 'GENERATION_ERROR', message: 'Erreur de génération. Réessaie.' } }, { status: 500 })
  }

  // Garde seulement les questions bien formées
  const valid = questions
    .filter((q) => Array.isArray(q.options) && q.options.length >= 2
      && Number.isInteger(q.correct_index) && q.correct_index >= 0 && q.correct_index < q.options.length)
    .slice(0, body.count)

  if (valid.length === 0) {
    return NextResponse.json({ error: { code: 'GENERATION_ERROR', message: 'Aucune question valide générée.' } }, { status: 500 })
  }

  const { data: quiz, error: quizErr } = await supabaseAdmin
    .from('quizzes')
    .insert({
      subject_id:     doc.subject_id,
      document_id:    doc.id,
      title:          body.title ?? `QCM — ${doc.title}`,
      level:          doc.level,
      is_premium:     body.is_premium,
      time_limit_sec: body.time_limit_sec,
    })
    .select()
    .single()

  if (quizErr || !quiz) return NextResponse.json({ error: { code: 'DB_ERROR', message: quizErr?.message } }, { status: 500 })

  const rows = valid.map((q, i) => ({
    quiz_id:       quiz.id,
    position:      i + 1,
    prompt:        q.prompt,
    options:       q.options,
    correct_index: q.correct_index,
    explanation:   q.explanation ?? null,
  }))

  const { error: qErr } = await supabaseAdmin.from('quiz_questions').insert(rows)
  if (qErr) {
    await supabaseAdmin.from('quizzes').delete().eq('id', quiz.id) // rollback best-effort
    return NextResponse.json({ error: { code: 'DB_ERROR', message: qErr.message } }, { status: 500 })
  }

  return NextResponse.json({ data: { quiz, question_count: rows.length } }, { status: 201 })
}
