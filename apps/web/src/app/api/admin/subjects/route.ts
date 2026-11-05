import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin, supabaseAdmin } from '@/lib/admin-guard'
import { z } from 'zod'

/** GET /api/admin/subjects — liste les matières avec le nombre de contenus rattachés */
export async function GET(_req: NextRequest) {
  const guard = await requireAdmin()
  if ('error' in guard) return guard.error

  const { data, error } = await supabaseAdmin
    .from('subjects')
    .select('id, name, level, track_type, country_code, icon, parent_subject_id, documents(count), videos(count)')
    .order('track_type', { ascending: true })
    .order('level', { ascending: true })
    .order('name', { ascending: true })

  if (error) {

    console.error('[/api/admin/subjects]', error)

    return NextResponse.json({ error: { code: 'DB_ERROR', message: 'Une erreur est survenue, réessaie plus tard.' } }, { status: 500 })

  }

  // Aplatit les compteurs agrégés ([{ count }]) en nombres simples
  const rows = (data ?? []).map((s: Record<string, unknown>) => ({
    id: s['id'],
    name: s['name'],
    level: s['level'],
    country_code: s['country_code'],
    track_type: s['track_type'],
    icon: s['icon'],
    parent_subject_id: s['parent_subject_id'] ?? null,
    doc_count: (s['documents'] as { count: number }[] | null)?.[0]?.count ?? 0,
    video_count: (s['videos'] as { count: number }[] | null)?.[0]?.count ?? 0,
  }))

  return NextResponse.json({ data: rows })
}

const schema = z.object({
  name: z.string().min(2).max(60),
  level: z.string().min(2).max(40).transform((v) => v.trim().toLowerCase().replace(/\s+/g, '_')),
  track_type: z.enum(['generale', 'technique']).default('generale'),
  icon: z.string().max(8).optional(),
  country_code: z.string().length(2).default('CG'),
})

/** POST /api/admin/subjects — crée une matière pour un niveau donné */
export async function POST(req: NextRequest) {
  const guard = await requireAdmin()
  if ('error' in guard) return guard.error

  let body: z.infer<typeof schema>
  try { body = schema.parse(await req.json()) }
  catch { return NextResponse.json({ error: 'Corps invalide' }, { status: 400 }) }

  const { data, error } = await supabaseAdmin
    .from('subjects')
    .insert({
      name: body.name.trim(),
      level: body.level,
      icon: body.icon ?? null,
      track_type: body.track_type,
      country_code: body.country_code.toUpperCase(),
    })
    .select('id, name, level, track_type, country_code, icon')
    .single()

  if (error) {
    // 23505 = violation de contrainte unique(name, level, country_code)
    if (error.code === '23505') {
      return NextResponse.json(
        { error: { code: 'DUPLICATE', message: 'Cette matière existe déjà pour ce niveau.' } },
        { status: 409 }
      )
    }
    console.error('[/admin/subjects]', error)
    return NextResponse.json({ error: { code: 'DB_ERROR', message: 'Une erreur est survenue, réessaie plus tard.' } }, { status: 500 })
  }

  return NextResponse.json({ data: { ...data, doc_count: 0, video_count: 0 } }, { status: 201 })
}
