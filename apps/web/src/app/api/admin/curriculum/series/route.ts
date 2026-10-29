import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin, supabaseAdmin } from '@/lib/admin-guard'
import { z } from 'zod'
import { STUDY_LEVELS } from '@alpha-kelassi/types'

/** GET /api/admin/curriculum/series — liste toutes les séries */
export async function GET() {
  const guard = await requireAdmin()
  if ('error' in guard) return guard.error

  const { data, error } = await supabaseAdmin
    .from('series')
    .select('id, code, label, track, level, country_code')
    .order('track').order('code')

  if (error) {

    console.error('[/api/admin/curriculum/series]', error)

    return NextResponse.json({ error: { code: 'DB_ERROR', message: 'Une erreur est survenue, réessaie plus tard.' } }, { status: 500 })

  }
  return NextResponse.json({ data: data ?? [] })
}

const schema = z.object({
  code:         z.string().min(1).max(8),
  label:        z.string().min(3).max(120),
  track:        z.enum(['generale', 'technique', 'professionnel']),
  // Source partagée : la liste était figée sur quatre niveaux généraux, ce qui
  // rejetait toute création de série technique (G2, G3, BG, R…).
  level:        z.enum(STUDY_LEVELS),
  country_code: z.string().length(2).default('CG'),
})

/** POST /api/admin/curriculum/series — crée une série */
export async function POST(req: NextRequest) {
  const guard = await requireAdmin()
  if ('error' in guard) return guard.error

  let body: z.infer<typeof schema>
  try { body = schema.parse(await req.json()) }
  catch { return NextResponse.json({ error: 'Corps invalide' }, { status: 400 }) }

  const { data, error } = await supabaseAdmin.from('series').insert(body).select().single()
  if (error) {
    if (error.code === '23505') return NextResponse.json({ error: { code: 'DUPLICATE', message: 'Cette série existe déjà pour ce niveau.' } }, { status: 409 })
    console.error('[/admin/curriculum/series]', error)
    return NextResponse.json({ error: { code: 'DB_ERROR', message: 'Une erreur est survenue, réessaie plus tard.' } }, { status: 500 })
  }
  return NextResponse.json({ data }, { status: 201 })
}
