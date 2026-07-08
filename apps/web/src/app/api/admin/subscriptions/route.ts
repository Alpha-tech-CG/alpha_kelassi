import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin, supabaseAdmin } from '@/lib/admin-guard'

/**
 * GET /api/admin/subscriptions?status=&plan=&q=
 * Liste les abonnements + infos utilisateur pour le suivi admin.
 */
export async function GET(req: NextRequest) {
  const guard = await requireAdmin()
  if ('error' in guard) return guard.error

  const sp = req.nextUrl.searchParams
  const status = sp.get('status')   // active | canceled | past_due | trialing
  const plan = sp.get('plan')       // free | premium

  let query = supabaseAdmin
    .from('subscriptions')
    .select('id, user_id, plan, status, stripe_sub_id, cinetpay_ref, expires_at, created_at, users(email, full_name, phone)')
    .order('created_at', { ascending: false })

  if (status) query = query.eq('status', status)
  if (plan) query = query.eq('plan', plan)

  const { data, error } = await query.limit(500)
  if (error) return NextResponse.json({ error: { code: 'DB_ERROR', message: error.message } }, { status: 500 })

  const rows = (data ?? []).map((s) => {
    const u = s.users as unknown as { email: string | null; full_name: string | null; phone: string | null } | null
    const provider = s.stripe_sub_id ? 'stripe' : s.cinetpay_ref ? 'cinetpay' : 'inconnu'
    const daysLeft = s.expires_at ? Math.ceil((new Date(s.expires_at).getTime() - Date.now()) / 86400000) : null
    return {
      id: s.id, user_id: s.user_id, plan: s.plan, status: s.status,
      provider, expires_at: s.expires_at, created_at: s.created_at,
      days_left: daysLeft,
      email: u?.email ?? null, full_name: u?.full_name ?? null, phone: u?.phone ?? null,
    }
  })

  // Synthèse
  const active = rows.filter((r) => r.status === 'active')
  const summary = {
    total: rows.length,
    active: active.length,
    stripe: active.filter((r) => r.provider === 'stripe').length,
    cinetpay: active.filter((r) => r.provider === 'cinetpay').length,
    expiring_7d: active.filter((r) => r.days_left !== null && r.days_left >= 0 && r.days_left <= 7).length,
    monthly_revenue_fcfa: active.length * 2000,
  }

  return NextResponse.json({ data: rows, summary })
}
