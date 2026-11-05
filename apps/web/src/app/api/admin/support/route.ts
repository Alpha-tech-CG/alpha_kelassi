import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAdmin, supabaseAdmin } from '@/lib/admin-guard'
import { isUuid } from '@/lib/query-validation'

/**
 * GET /api/admin/support?status=open — demandes de support et avis, triés par
 * priorité (Pro Max, puis Pro, puis standard) puis ancienneté.
 */
export async function GET(req: NextRequest) {
  const guard = await requireAdmin()
  if ('error' in guard) return guard.error

  const status = req.nextUrl.searchParams.get('status') ?? 'open'
  let query = supabaseAdmin.from('beta_feedback')
    .select('id, user_id, kind, rating, comment, page, app_version, plan, priority, status, created_at, users(email, full_name)')
    .order('priority', { ascending: false }).order('created_at', { ascending: true }).limit(300)
  if (status !== 'all') query = query.eq('status', status)

  const { data, error } = await query
  if (error) {
    console.error('[/api/admin/support]', error)
    return NextResponse.json({ error: { code: 'DB_ERROR', message: 'Une erreur est survenue, réessaie plus tard.' } }, { status: 500 })
  }
  return NextResponse.json({ data: data ?? [] })
}

const patchSchema = z.object({ id: z.string().uuid(), status: z.enum(['open', 'answered', 'closed']) })

/** PATCH /api/admin/support — change le statut d'une demande. */
export async function PATCH(req: NextRequest) {
  const guard = await requireAdmin()
  if ('error' in guard) return guard.error
  const parsed = patchSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success || !isUuid(parsed.data.id)) return NextResponse.json({ error: { code: 'BAD_REQUEST' } }, { status: 400 })

  const { error } = await supabaseAdmin.from('beta_feedback').update({ status: parsed.data.status }).eq('id', parsed.data.id)
  if (error) {
    console.error('[/api/admin/support]', error)
    return NextResponse.json({ error: { code: 'DB_ERROR', message: 'Une erreur est survenue, réessaie plus tard.' } }, { status: 500 })
  }
  return NextResponse.json({ data: { id: parsed.data.id, status: parsed.data.status } })
}
