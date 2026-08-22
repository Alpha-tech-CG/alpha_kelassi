import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin, supabaseAdmin } from '@/lib/admin-guard'
import { z } from 'zod'
import { isUuid } from '@/lib/query-validation'

/** GET /api/admin/curriculum/chapters?subjectId= — chapitres d'une matière */
export async function GET(req: NextRequest) {
  const guard = await requireAdmin()
  if ('error' in guard) return guard.error

  const subjectId = req.nextUrl.searchParams.get('subjectId')
  if (!isUuid(subjectId)) {
    return NextResponse.json({ error: 'subjectId requis (UUID valide)' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from('chapters')
    .select('id, subject_id, series_id, title, description, order_index, lessons(count)')
    .eq('subject_id', subjectId)
    .order('order_index')

  if (error) {

    console.error('[/api/admin/curriculum/chapters]', error)

    return NextResponse.json({ error: { code: 'DB_ERROR', message: 'Une erreur est survenue, réessaie plus tard.' } }, { status: 500 })

  }

  const rows = (data ?? []).map((c: Record<string, unknown>) => ({
    id: c['id'], subject_id: c['subject_id'], series_id: c['series_id'],
    title: c['title'], description: c['description'], order_index: c['order_index'],
    lesson_count: (c['lessons'] as { count: number }[] | null)?.[0]?.count ?? 0,
  }))
  return NextResponse.json({ data: rows })
}

const schema = z.object({
  subject_id:  z.string().uuid(),
  series_id:   z.string().uuid().nullish(),
  title:       z.string().min(2).max(160),
  order_index: z.number().int().min(0).default(0),
  description: z.string().max(500).nullish(),
})

/** POST /api/admin/curriculum/chapters — crée un chapitre */
export async function POST(req: NextRequest) {
  const guard = await requireAdmin()
  if ('error' in guard) return guard.error

  let b: z.infer<typeof schema>
  try { b = schema.parse(await req.json()) }
  catch { return NextResponse.json({ error: 'Corps invalide' }, { status: 400 }) }

  const { data, error } = await supabaseAdmin.from('chapters').insert({
    subject_id: b.subject_id, series_id: b.series_id ?? null, title: b.title,
    order_index: b.order_index, description: b.description ?? null,
  }).select().single()

  if (error) {

    console.error('[/api/admin/curriculum/chapters]', error)

    return NextResponse.json({ error: { code: 'DB_ERROR', message: 'Une erreur est survenue, réessaie plus tard.' } }, { status: 500 })

  }
  return NextResponse.json({ data: { ...data, lesson_count: 0 } }, { status: 201 })
}
