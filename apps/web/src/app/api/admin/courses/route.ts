import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin, supabaseAdmin } from '@/lib/admin-guard'
import { z } from 'zod'

/** GET /api/admin/courses — liste les cours (avec matière + nb d'O.G) */
export async function GET(_req: NextRequest) {
  const guard = await requireAdmin()
  if ('error' in guard) return guard.error

  const { data, error } = await supabaseAdmin
    .from('courses')
    .select('id, title, subtitle, level, is_premium, subject_id, subjects(name), course_objectives(count)')
    .order('level', { ascending: true })
    .order('position', { ascending: true })
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: { code: 'DB_ERROR', message: error.message } }, { status: 500 })

  const rows = (data ?? []).map((c: Record<string, unknown>) => ({
    id: c['id'],
    title: c['title'],
    subtitle: c['subtitle'],
    level: c['level'],
    is_premium: c['is_premium'],
    subject_id: c['subject_id'],
    subject_name: (c['subjects'] as { name?: string } | null)?.name ?? null,
    objective_count: (c['course_objectives'] as { count: number }[] | null)?.[0]?.count ?? 0,
  }))

  return NextResponse.json({ data: rows })
}

const schema = z.object({
  subject_id: z.string().uuid(),
  level: z.enum(['bepc', 'bac_a', 'bac_c', 'bac_d']),
  title: z.string().min(3).max(200),
  subtitle: z.string().max(300).optional(),
  is_premium: z.boolean().default(false),
})

/** POST /api/admin/courses — crée un cours (vide, à remplir dans l'éditeur) */
export async function POST(req: NextRequest) {
  const guard = await requireAdmin()
  if ('error' in guard) return guard.error

  let body: z.infer<typeof schema>
  try { body = schema.parse(await req.json()) }
  catch { return NextResponse.json({ error: 'Corps invalide' }, { status: 400 }) }

  const { data, error } = await supabaseAdmin
    .from('courses')
    .insert({
      subject_id: body.subject_id,
      level: body.level,
      title: body.title.trim(),
      subtitle: body.subtitle?.trim() || null,
      is_premium: body.is_premium,
    })
    .select('id')
    .single()

  if (error) return NextResponse.json({ error: { code: 'DB_ERROR', message: error.message } }, { status: 500 })
  return NextResponse.json({ data }, { status: 201 })
}
