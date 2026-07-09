import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin, supabaseAdmin } from '@/lib/admin-guard'
import { z } from 'zod'

const patchSchema = z.object({
  name: z.string().min(2).max(60).optional(),
  icon: z.string().max(8).nullable().optional(),
})

/** PATCH /api/admin/subjects/:id — renomme / change l'icône d'une matière */
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin()
  if ('error' in guard) return guard.error
  const { id } = await params

  let body: z.infer<typeof patchSchema>
  try { body = patchSchema.parse(await req.json()) }
  catch { return NextResponse.json({ error: 'Corps invalide' }, { status: 400 }) }

  const patch: Record<string, unknown> = {}
  if (body.name !== undefined) patch['name'] = body.name.trim()
  if (body.icon !== undefined) patch['icon'] = body.icon
  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: 'Rien à modifier' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from('subjects')
    .update(patch)
    .eq('id', id)
    .select('id, name, level, country_code, icon')
    .single()

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json(
        { error: { code: 'DUPLICATE', message: 'Une matière porte déjà ce nom à ce niveau.' } },
        { status: 409 }
      )
    }
    return NextResponse.json({ error: { code: 'DB_ERROR', message: error.message } }, { status: 500 })
  }

  return NextResponse.json({ data })
}

/**
 * DELETE /api/admin/subjects/:id
 * Refuse si des cours/vidéos sont rattachés (la suppression cascaderait
 * et effacerait tout le contenu). L'admin doit d'abord retirer le contenu.
 */
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin()
  if ('error' in guard) return guard.error
  const { id } = await params

  const [{ count: docCount }, { count: vidCount }] = await Promise.all([
    supabaseAdmin.from('documents').select('id', { count: 'exact', head: true }).eq('subject_id', id),
    supabaseAdmin.from('videos').select('id', { count: 'exact', head: true }).eq('subject_id', id),
  ])

  if ((docCount ?? 0) > 0 || (vidCount ?? 0) > 0) {
    return NextResponse.json(
      {
        error: {
          code: 'HAS_CONTENT',
          message: `Impossible de supprimer : ${docCount ?? 0} document(s) et ${vidCount ?? 0} vidéo(s) sont rattachés. Retire-les d'abord.`,
        },
      },
      { status: 409 }
    )
  }

  const { error } = await supabaseAdmin.from('subjects').delete().eq('id', id)
  if (error) return NextResponse.json({ error: { code: 'DB_ERROR', message: error.message } }, { status: 500 })
  return NextResponse.json({ data: { deleted: true } })
}
