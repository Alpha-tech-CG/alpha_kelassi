import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin, supabaseAdmin } from '@/lib/admin-guard'
import { z } from 'zod'
import { isUuid } from '@/lib/query-validation'
import { syncAfterChange } from '@/lib/chapter-copies'

/**
 * Questions d'un QCM de chapitre.
 *
 * Les questions sont gérées une par une (et non remplacées en bloc) : les
 * réponses déjà données par les élèves (`quiz_attempt_answers`) référencent
 * `quiz_questions.id` en cascade — tout réécrire à chaque sauvegarde effacerait
 * leur historique.
 */

const DB_ERROR = { code: 'DB_ERROR', message: 'Une erreur est survenue, réessaie plus tard.' }

const fields = {
  prompt:        z.string().min(3).max(4000),
  options:       z.array(z.string().min(1).max(300)).min(2).max(6),
  correct_index: z.number().int().min(0),
  explanation:   z.string().max(2000).nullish(),
}

const schema = z.object({
  quiz_id:  z.string().uuid(),
  ...fields,
  /** Remise en place d'une question supprimée (« Annuler ») : sa position d'origine. */
  position: z.number().int().min(1).optional(),
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

  let position = (last?.position ?? 0) + 1
  if (b.position) {
    // Position d'origine encore libre ? On la reprend, sinon la question va à la fin.
    const { data: taken } = await supabaseAdmin.from('quiz_questions').select('id')
      .eq('quiz_id', b.quiz_id).eq('position', b.position).maybeSingle()
    if (!taken) position = b.position
  }

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
  await syncAfterChange({ quizId: b.quiz_id })
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

  // La question supprimée est renvoyée : la console s'en sert pour « Annuler ».
  const { data: deleted, error } = await supabaseAdmin.from('quiz_questions').delete().eq('id', id)
    .select('quiz_id, position, prompt, options, correct_index, explanation').maybeSingle()
  if (error) {
    console.error('[/api/admin/curriculum/quiz/questions DELETE]', error)
    return NextResponse.json({ error: DB_ERROR }, { status: 500 })
  }
  if (deleted) await syncAfterChange({ quizId: deleted.quiz_id })
  return NextResponse.json({ data: { id, deleted } })
}

const patchSchema = z.object({ id: z.string().uuid(), ...fields }).refine(
  (v) => v.correct_index < v.options.length,
  { message: 'correct_index doit désigner une option existante', path: ['correct_index'] },
)

/**
 * PATCH /api/admin/curriculum/quiz/questions — modifie une question en place
 * (même id : les réponses déjà données par les élèves restent rattachées).
 */
export async function PATCH(req: NextRequest) {
  const guard = await requireAdmin()
  if ('error' in guard) return guard.error

  let b: z.infer<typeof patchSchema>
  try { b = patchSchema.parse(await req.json()) }
  catch { return NextResponse.json({ error: { code: 'BAD_REQUEST', message: 'Corps invalide' } }, { status: 400 }) }

  const { error } = await supabaseAdmin.from('quiz_questions').update({
    prompt: b.prompt, options: b.options, correct_index: b.correct_index, explanation: b.explanation ?? null,
  }).eq('id', b.id)
  if (error) {
    console.error('[/api/admin/curriculum/quiz/questions PATCH]', error)
    return NextResponse.json({ error: DB_ERROR }, { status: 500 })
  }
  const { data: q } = await supabaseAdmin.from('quiz_questions').select('quiz_id').eq('id', b.id).maybeSingle()
  if (q) await syncAfterChange({ quizId: q.quiz_id })
  return NextResponse.json({ data: { id: b.id } })
}
