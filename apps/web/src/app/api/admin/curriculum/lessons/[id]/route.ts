import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin, supabaseAdmin } from '@/lib/admin-guard'
import { z } from 'zod'

const schema = z.object({
  type:         z.enum(['cours', 'resume', 'fiche', 'quiz', 'video']),
  title:        z.string().min(2).max(160),
  content:      z.string().nullish(),
  video_url:    z.string().url().nullish(),
  duration_min: z.number().int().min(0).max(600).nullish(),
  is_premium:   z.boolean(),
  order_index:  z.number().int().min(0),
}).partial()

/** PUT /api/admin/curriculum/lessons/:id */
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin()
  if ('error' in guard) return guard.error
  const { id } = await params

  let updates: z.infer<typeof schema>
  try { updates = schema.parse(await req.json()) }
  catch { return NextResponse.json({ error: 'Corps invalide' }, { status: 400 }) }

  const { data, error } = await supabaseAdmin.from('lessons').update(updates).eq('id', id).select().single()
  if (error) return NextResponse.json({ error: { code: 'DB_ERROR', message: error.message } }, { status: 500 })
  return NextResponse.json({ data })
}

/** DELETE /api/admin/curriculum/lessons/:id */
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin()
  if ('error' in guard) return guard.error
  const { id } = await params

  const { error } = await supabaseAdmin.from('lessons').delete().eq('id', id)
  if (error) return NextResponse.json({ error: { code: 'DB_ERROR', message: error.message } }, { status: 500 })
  return NextResponse.json({ data: { deleted: true } })
}
