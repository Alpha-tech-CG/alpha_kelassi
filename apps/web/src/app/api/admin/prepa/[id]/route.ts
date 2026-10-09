import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin, supabaseAdmin } from '@/lib/admin-guard'
import { z } from 'zod'
import { EXAM_KINDS } from '@/lib/prepa'

const DB_ERROR = { code: 'DB_ERROR', message: 'Une erreur est survenue, réessaie plus tard.' }

/** GET /api/admin/prepa/:id — une épreuve, sa matière et ses questions. */
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin()
  if ('error' in guard) return guard.error
  const { id } = await params

  const { data, error } = await supabaseAdmin.from('quizzes')
    .select('id, title, description, exam_kind, year, time_limit_sec, is_premium, level, is_exam, deleted_at, subject_id, subjects(name, level), quiz_questions(id, position, prompt, options, correct_index, explanation)')
    .eq('id', id).maybeSingle()

  if (error) {
    console.error('[/api/admin/prepa/[id] GET]', error)
    return NextResponse.json({ error: DB_ERROR }, { status: 500 })
  }
  if (!data) return NextResponse.json({ error: { code: 'NOT_FOUND', message: 'Épreuve introuvable' } }, { status: 404 })

  const qs = (data.quiz_questions ?? []) as unknown as Array<{ position: number }>
  qs.sort((a, b) => a.position - b.position)
  return NextResponse.json({ data })
}

const patchSchema = z.object({
  exam_kind:      z.enum(EXAM_KINDS),
  title:          z.string().trim().min(3).max(200),
  description:    z.string().max(1000).nullable(),
  year:           z.number().int().min(1960).max(2100).nullable(),
  time_limit_sec: z.number().int().min(60).max(4 * 3600),
  is_premium:     z.boolean(),
}).partial()

/** PATCH /api/admin/prepa/:id — modifie les réglages d'une épreuve. */
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin()
  if ('error' in guard) return guard.error
  const { id } = await params

  let b: z.infer<typeof patchSchema>
  try { b = patchSchema.parse(await req.json()) }
  catch { return NextResponse.json({ error: { code: 'BAD_REQUEST', message: 'Champs invalides : vérifie le titre, l\'année et la durée.' } }, { status: 400 }) }

  const patch = Object.fromEntries(Object.entries(b).filter(([, v]) => v !== undefined))
  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: { code: 'BAD_REQUEST', message: 'Aucun champ à modifier' } }, { status: 400 })
  }

  const { error } = await supabaseAdmin.from('quizzes').update(patch).eq('id', id).eq('is_exam', true)
  if (error) {
    console.error('[/api/admin/prepa/[id] PATCH]', error)
    return NextResponse.json({ error: DB_ERROR }, { status: 500 })
  }
  return NextResponse.json({ data: { id } })
}

/** DELETE /api/admin/prepa/:id — place l'épreuve dans la corbeille (restaurable). */
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin()
  if ('error' in guard) return guard.error
  const { id } = await params

  const { error } = await supabaseAdmin.from('quizzes')
    .update({ deleted_at: new Date().toISOString() }).eq('id', id).is('deleted_at', null)
  if (error) {
    console.error('[/api/admin/prepa/[id] DELETE]', error)
    return NextResponse.json({ error: DB_ERROR }, { status: 500 })
  }
  return NextResponse.json({ data: { id, trashed: true } })
}
