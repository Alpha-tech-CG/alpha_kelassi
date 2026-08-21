import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin, supabaseAdmin } from '@/lib/admin-guard'
import { z } from 'zod'

const schema = z.object({
  title:       z.string().min(2).max(200),
  statement:   z.string().min(2),
  solution:    z.string().min(2),
  difficulty:  z.number().int().min(1).max(3),
  is_premium:  z.boolean(),
  order_index: z.number().int().min(0),
}).partial()

/** PATCH /api/admin/curriculum/exercises/:id — met à jour l'exercice et/ou son corrigé. */
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin()
  if ('error' in guard) return guard.error
  const { id } = await params

  let b: z.infer<typeof schema>
  try { b = schema.parse(await req.json()) }
  catch { return NextResponse.json({ error: 'Corps invalide' }, { status: 400 }) }

  const { solution, ...exFields } = b
  if (Object.keys(exFields).length > 0) {
    const { error } = await supabaseAdmin.from('exercises').update(exFields).eq('id', id)
    if (error) {
      console.error('[/api/admin/curriculum/exercises/[id]]', error)
      return NextResponse.json({ error: { code: 'DB_ERROR', message: 'Une erreur est survenue, réessaie plus tard.' } }, { status: 500 })
    }
  }
  if (solution !== undefined) {
    const { error } = await supabaseAdmin.from('exercise_solutions')
      .upsert({ exercise_id: id, solution }, { onConflict: 'exercise_id' })
    if (error) {
      console.error('[/api/admin/curriculum/exercises/[id]]', error)
      return NextResponse.json({ error: { code: 'DB_ERROR', message: 'Une erreur est survenue, réessaie plus tard.' } }, { status: 500 })
    }
  }
  return NextResponse.json({ data: { ok: true } })
}

/** DELETE /api/admin/curriculum/exercises/:id — supprime l'exercice (corrigé en cascade). */
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin()
  if ('error' in guard) return guard.error
  const { id } = await params

  const { error } = await supabaseAdmin.from('exercises').delete().eq('id', id)
  if (error) {
    console.error('[/api/admin/curriculum/exercises/[id]]', error)
    return NextResponse.json({ error: { code: 'DB_ERROR', message: 'Une erreur est survenue, réessaie plus tard.' } }, { status: 500 })
  }
  return NextResponse.json({ data: { ok: true } })
}
