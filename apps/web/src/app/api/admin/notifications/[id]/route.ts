import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin, supabaseAdmin } from '@/lib/admin-guard'
import { z } from 'zod'

const patchSchema = z.object({
  type:        z.enum(['annonce', 'promo', 'pub', 'alerte']).optional(),
  title:       z.string().min(2).max(120).optional(),
  message:     z.string().min(5).max(500).optional(),
  cta_label:   z.string().max(60).nullable().optional(),
  cta_url:     z.string().url().nullable().optional(),
  is_active:   z.boolean().optional(),
  target_plan: z.enum(['all', 'free', 'premium']).optional(),
  expires_at:  z.string().datetime().nullable().optional(),
})

/** PATCH /api/admin/notifications/:id — active/désactive ou édite une annonce */
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin()
  if ('error' in guard) return guard.error
  const { id } = await params

  let body: z.infer<typeof patchSchema>
  try { body = patchSchema.parse(await req.json()) }
  catch { return NextResponse.json({ error: 'Corps invalide' }, { status: 400 }) }

  const { data, error } = await supabaseAdmin.from('notifications').update(body).eq('id', id).select().single()
  if (error) return NextResponse.json({ error: { code: 'DB_ERROR', message: error.message } }, { status: 500 })
  return NextResponse.json({ data })
}

/** DELETE /api/admin/notifications/:id */
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin()
  if ('error' in guard) return guard.error
  const { id } = await params
  const { error } = await supabaseAdmin.from('notifications').delete().eq('id', id)
  if (error) return NextResponse.json({ error: { code: 'DB_ERROR', message: error.message } }, { status: 500 })
  return NextResponse.json({ data: { deleted: true } })
}
