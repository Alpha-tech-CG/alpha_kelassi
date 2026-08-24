import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin, supabaseAdmin } from '@/lib/admin-guard'
import { z } from 'zod'
import { isUuid } from '@/lib/query-validation'

/**
 * QCM de fin de chapitre (console admin).
 *
 * `quizzes.subject_id` et `quizzes.level` sont NOT NULL : ils ne sont pas
 * demandés à l'admin mais déduits du chapitre, pour qu'un QCM de chapitre soit
 * toujours cohérent avec la matière à laquelle il appartient.
 */

const DB_ERROR = { code: 'DB_ERROR', message: 'Une erreur est survenue, réessaie plus tard.' }

/** GET /api/admin/curriculum/quiz?chapterId= — le QCM du chapitre et ses questions. */
export async function GET(req: NextRequest) {
  const guard = await requireAdmin()
  if ('error' in guard) return guard.error

  const chapterId = req.nextUrl.searchParams.get('chapterId')
  if (!isUuid(chapterId)) {
    return NextResponse.json({ error: { code: 'BAD_REQUEST', message: 'chapterId requis (UUID valide)' } }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from('quizzes')
    .select('id, title, description, time_limit_sec, is_premium, level, quiz_questions(id, position, prompt, options, correct_index, explanation)')
    .eq('chapter_id', chapterId)
    .maybeSingle()

  if (error) {
    console.error('[/api/admin/curriculum/quiz GET]', error)
    return NextResponse.json({ error: DB_ERROR }, { status: 500 })
  }

  if (data) {
    const qs = (data.quiz_questions ?? []) as unknown as Array<{ position: number }>
    qs.sort((a, b) => a.position - b.position)
  }
  return NextResponse.json({ data: data ?? null })
}

const createSchema = z.object({
  chapter_id:     z.string().uuid(),
  title:          z.string().min(2).max(200),
  description:    z.string().max(500).nullish(),
  time_limit_sec: z.number().int().min(60).max(3600).default(600),
  is_premium:     z.boolean().default(false),
})

/** POST /api/admin/curriculum/quiz — crée le QCM du chapitre (sans questions). */
export async function POST(req: NextRequest) {
  const guard = await requireAdmin()
  if ('error' in guard) return guard.error

  let b: z.infer<typeof createSchema>
  try { b = createSchema.parse(await req.json()) }
  catch { return NextResponse.json({ error: { code: 'BAD_REQUEST', message: 'Corps invalide' } }, { status: 400 }) }

  // Matière et niveau déduits du chapitre — jamais fournis par le client.
  const { data: chapter } = await supabaseAdmin
    .from('chapters')
    .select('id, subject_id, subjects(level)')
    .eq('id', b.chapter_id)
    .maybeSingle()

  if (!chapter) {
    return NextResponse.json({ error: { code: 'NOT_FOUND', message: 'Chapitre introuvable' } }, { status: 404 })
  }
  const level = (chapter.subjects as unknown as { level?: string } | null)?.level
  if (!level) {
    return NextResponse.json({ error: { code: 'BAD_REQUEST', message: 'La matière du chapitre n\'a pas de niveau.' } }, { status: 422 })
  }

  const { data, error } = await supabaseAdmin
    .from('quizzes')
    .insert({
      chapter_id:     b.chapter_id,
      subject_id:     chapter.subject_id,
      level,
      title:          b.title,
      description:    b.description ?? null,
      time_limit_sec: b.time_limit_sec,
      is_premium:     b.is_premium,
    })
    .select('id')
    .single()

  if (error) {
    // 23505 = doublon sur l'index unique « un QCM par chapitre »
    if ((error as { code?: string }).code === '23505') {
      return NextResponse.json({ error: { code: 'ALREADY_EXISTS', message: 'Ce chapitre a déjà un QCM.' } }, { status: 409 })
    }
    console.error('[/api/admin/curriculum/quiz POST]', error)
    return NextResponse.json({ error: DB_ERROR }, { status: 500 })
  }
  return NextResponse.json({ data: { id: data.id } }, { status: 201 })
}

const patchSchema = z.object({
  id:             z.string().uuid(),
  title:          z.string().min(2).max(200).optional(),
  description:    z.string().max(500).nullish(),
  time_limit_sec: z.number().int().min(60).max(3600).optional(),
  is_premium:     z.boolean().optional(),
})

/** PATCH /api/admin/curriculum/quiz — met à jour les réglages du QCM. */
export async function PATCH(req: NextRequest) {
  const guard = await requireAdmin()
  if ('error' in guard) return guard.error

  let b: z.infer<typeof patchSchema>
  try { b = patchSchema.parse(await req.json()) }
  catch { return NextResponse.json({ error: { code: 'BAD_REQUEST', message: 'Corps invalide' } }, { status: 400 }) }

  const { id, ...fields } = b
  const patch = Object.fromEntries(Object.entries(fields).filter(([, v]) => v !== undefined))
  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: { code: 'BAD_REQUEST', message: 'Aucun champ à modifier' } }, { status: 400 })
  }

  const { error } = await supabaseAdmin.from('quizzes').update(patch).eq('id', id)
  if (error) {
    console.error('[/api/admin/curriculum/quiz PATCH]', error)
    return NextResponse.json({ error: DB_ERROR }, { status: 500 })
  }
  return NextResponse.json({ data: { id } })
}

/** DELETE /api/admin/curriculum/quiz?id= — supprime le QCM et ses questions. */
export async function DELETE(req: NextRequest) {
  const guard = await requireAdmin()
  if ('error' in guard) return guard.error

  const id = req.nextUrl.searchParams.get('id')
  if (!isUuid(id)) {
    return NextResponse.json({ error: { code: 'BAD_REQUEST', message: 'id requis (UUID valide)' } }, { status: 400 })
  }

  const { error } = await supabaseAdmin.from('quizzes').delete().eq('id', id)
  if (error) {
    console.error('[/api/admin/curriculum/quiz DELETE]', error)
    return NextResponse.json({ error: DB_ERROR }, { status: 500 })
  }
  return NextResponse.json({ data: { id } })
}
