import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin, supabaseAdmin } from '@/lib/admin-guard'
import { z } from 'zod'

/** GET /api/admin/notifications — toutes les annonces (admin) */
export async function GET() {
  const guard = await requireAdmin()
  if ('error' in guard) return guard.error

  const { data, error } = await supabaseAdmin
    .from('notifications')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)

  if (error) return NextResponse.json({ error: { code: 'DB_ERROR', message: error.message } }, { status: 500 })
  return NextResponse.json({ data: data ?? [] })
}

const schema = z.object({
  type:        z.enum(['annonce', 'promo', 'pub', 'alerte']).default('annonce'),
  title:       z.string().min(2).max(120),
  message:     z.string().min(5).max(500),
  cta_label:   z.string().max(60).nullable().optional(),
  cta_url:     z.string().url().nullable().optional(),
  is_active:   z.boolean().default(true),
  target_plan: z.enum(['all', 'free', 'premium']).default('all'),
  expires_at:  z.string().datetime().nullable().optional(),
})

/** POST /api/admin/notifications — publie une annonce affichée aux utilisateurs */
export async function POST(req: NextRequest) {
  const guard = await requireAdmin()
  if ('error' in guard) return guard.error

  let body: z.infer<typeof schema>
  try { body = schema.parse(await req.json()) }
  catch { return NextResponse.json({ error: 'Corps invalide' }, { status: 400 }) }

  const { data, error } = await supabaseAdmin.from('notifications').insert(body).select().single()
  if (error) return NextResponse.json({ error: { code: 'DB_ERROR', message: error.message } }, { status: 500 })
  return NextResponse.json({ data }, { status: 201 })
}
