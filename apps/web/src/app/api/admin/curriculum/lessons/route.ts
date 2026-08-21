import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin, supabaseAdmin } from '@/lib/admin-guard'
import { z } from 'zod'

/** GET /api/admin/curriculum/lessons?chapterId= — leçons d'un chapitre */
export async function GET(req: NextRequest) {
  const guard = await requireAdmin()
  if ('error' in guard) return guard.error

  const chapterId = req.nextUrl.searchParams.get('chapterId')
  if (!chapterId) return NextResponse.json({ error: 'chapterId requis' }, { status: 400 })

  const { data, error } = await supabaseAdmin
    .from('lessons')
    .select('id, chapter_id, type, title, content, video_url, duration_min, is_premium, order_index')
    .eq('chapter_id', chapterId)
    .order('order_index')

  if (error) {

    console.error('[/api/admin/curriculum/lessons]', error)

    return NextResponse.json({ error: { code: 'DB_ERROR', message: 'Une erreur est survenue, réessaie plus tard.' } }, { status: 500 })

  }
  return NextResponse.json({ data: data ?? [] })
}

const schema = z.object({
  chapter_id:   z.string().uuid(),
  type:         z.enum(['cours', 'resume', 'fiche', 'quiz', 'video']),
  title:        z.string().min(2).max(160),
  content:      z.string().nullish(),
  video_url:    z.string().url().nullish(),
  duration_min: z.number().int().min(0).max(600).nullish(),
  is_premium:   z.boolean().default(false),
  order_index:  z.number().int().min(0).default(0),
})

/** POST /api/admin/curriculum/lessons — crée une leçon */
export async function POST(req: NextRequest) {
  const guard = await requireAdmin()
  if ('error' in guard) return guard.error

  let b: z.infer<typeof schema>
  try { b = schema.parse(await req.json()) }
  catch { return NextResponse.json({ error: 'Corps invalide' }, { status: 400 }) }

  const { data, error } = await supabaseAdmin.from('lessons').insert({
    chapter_id: b.chapter_id, type: b.type, title: b.title,
    content: b.content ?? null, video_url: b.video_url ?? null,
    duration_min: b.duration_min ?? null, is_premium: b.is_premium, order_index: b.order_index,
  }).select().single()

  if (error) {

    console.error('[/api/admin/curriculum/lessons]', error)

    return NextResponse.json({ error: { code: 'DB_ERROR', message: 'Une erreur est survenue, réessaie plus tard.' } }, { status: 500 })

  }
  return NextResponse.json({ data }, { status: 201 })
}
