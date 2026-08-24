import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin, supabaseAdmin } from '@/lib/admin-guard'
import { z } from 'zod'
import { isUuid } from '@/lib/query-validation'

/**
 * Questions d'un QCM de chapitre.
 *
 * Les questions sont gérées une par une (et non remplacées en bloc) : les
 * réponses déjà données par les élèves (`quiz_attempt_answers`) référencent
 * `quiz_questions.id` en cascade — tout réécrire à chaque sauvegarde effacerait
 * leur historique.
 */

const DB_ERROR = { code: 'DB_ERROR', message: 'Une erreur est survenue, réessaie plus tard.' }

const schema = z.object({
  quiz_id:       z.string().uuid(),
  prompt:        z.string().min(3).max(1000),
  options:       z.array(z.string().min(1).max(300)).min(2).max(6),
  correct_index: z.number().int().min(0),
  explanation:   z.string().max(600).nullish(),
}).refine((v) => v.correct_index < v.options.length, {
  message: 'correct_index doit désigner une option existante',
  path: ['correct_index'],
})

/** POST /api/admin/curriculum/quiz/questions — ajoute une question à la fin du QCM. */
export async function POST(req: NextRequest) {
  const guard = await requireAdmin()
  if ('error' in guard) return guard.error

  let b: z.infer<typeof schema>
  try { b = schema.parse(await req.json()) }
  catch { return NextResponse.json({ error: { code: 'BAD_REQUEST', message: 'Corps invalide' } }, { status: 400 }) }

  // `position` est unique par QCM : on prend la suivante après la dernière.
  const { data: last } = await supabaseAdmin
    .from('quiz_questions')
    .select('position')
    .eq('quiz_id', b.quiz_id)
    .order('position', { ascending: false })
    .limit(1)
    .maybeSingle()

  const position = (last?.position ?? 0) + 1

  const { data, error } = await supabaseAdmin
    .from('quiz_questions')
    .insert({
      quiz_id:       b.quiz_id,
      position,
      prompt:        b.prompt,
      options:       b.options,
      correct_index: b.correct_index,
      explanation:   b.explanation ?? null,
    })
    .select('id, position')
    .single()

  if (error) {
    console.error('[/api/admin/curriculum/quiz/questions POST]', error)
    return NextResponse.json({ error: DB_ERROR }, { status: 500 })
  }
  return NextResponse.json({ data }, { status: 201 })
}

/** DELETE /api/admin/curriculum/quiz/questions?id= — supprime une question. */
export async function DELETE(req: NextRequest) {
  const guard = await requireAdmin()
  if ('error' in guard) return guard.error

  const id = req.nextUrl.searchParams.get('id')
  if (!isUuid(id)) {
    return NextResponse.json({ error: { code: 'BAD_REQUEST', message: 'id requis (UUID valide)' } }, { status: 400 })
  }

  const { error } = await supabaseAdmin.from('quiz_questions').delete().eq('id', id)
  if (error) {
    console.error('[/api/admin/curriculum/quiz/questions DELETE]', error)
    return NextResponse.json({ error: DB_ERROR }, { status: 500 })
  }
  return NextResponse.json({ data: { id } })
}
