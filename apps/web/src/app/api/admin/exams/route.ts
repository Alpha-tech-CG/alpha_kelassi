import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin, supabaseAdmin } from '@/lib/admin-guard'
import { z } from 'zod'

/** GET /api/admin/exams — toutes les dates d'examen */
export async function GET() {
  const guard = await requireAdmin()
  if ('error' in guard) return guard.error
  const { data, error } = await supabaseAdmin
    .from('exam_events')
    .select('id, level, label, exam_date')
    .order('exam_date', { ascending: true })
  if (error) return NextResponse.json({ error: { code: 'DB_ERROR', message: error.message } }, { status: 500 })
  return NextResponse.json({ data: data ?? [] })
}

const schema = z.object({
  level:     z.enum(['bepc', 'bac_a', 'bac_c', 'bac_d']),
  label:     z.string().min(3).max(120),
  exam_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
})

/** POST /api/admin/exams — ajoute une date d'examen officielle */
export async function POST(req: NextRequest) {
  const guard = await requireAdmin()
  if ('error' in guard) return guard.error
  let body: z.infer<typeof schema>
  try { body = schema.parse(await req.json()) }
  catch { return NextResponse.json({ error: 'Corps invalide' }, { status: 400 }) }

  const { data, error } = await supabaseAdmin.from('exam_events').insert(body).select().single()
  if (error) return NextResponse.json({ error: { code: 'DB_ERROR', message: error.message } }, { status: 500 })
  return NextResponse.json({ data }, { status: 201 })
}
