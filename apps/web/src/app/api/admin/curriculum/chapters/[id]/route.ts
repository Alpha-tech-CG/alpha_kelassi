import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin, supabaseAdmin } from '@/lib/admin-guard'
import { z } from 'zod'

const schema = z.object({
  series_id:   z.string().uuid().nullish(),
  title:       z.string().min(2).max(160),
  order_index: z.number().int().min(0),
  description: z.string().max(500).nullish(),
}).partial()

/** PUT /api/admin/curriculum/chapters/:id */
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin()
  if ('error' in guard) return guard.error
  const { id } = await params

  let updates: z.infer<typeof schema>
  try { updates = schema.parse(await req.json()) }
  catch { return NextResponse.json({ error: 'Corps invalide' }, { status: 400 }) }

  const { data, error } = await supabaseAdmin.from('chapters').update(updates).eq('id', id).select().single()
  if (error) return NextResponse.json({ error: { code: 'DB_ERROR', message: error.message } }, { status: 500 })
  return NextResponse.json({ data })
}

/** DELETE /api/admin/curriculum/chapters/:id (cascade sur les leçons) */
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin()
  if ('error' in guard) return guard.error
  const { id } = await params

  const { error } = await supabaseAdmin.from('chapters').delete().eq('id', id)
  if (error) return NextResponse.json({ error: { code: 'DB_ERROR', message: error.message } }, { status: 500 })
  return NextResponse.json({ data: { deleted: true } })
}
