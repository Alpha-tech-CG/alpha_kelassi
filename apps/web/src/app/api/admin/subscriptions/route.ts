import { NextRequest, NextResponse } from 'next/server'
import { PLAN_META, SUBSCRIPTION_PLANS, normalizePlan } from '@alpha-kelassi/types'
import { requireAdmin, supabaseAdmin } from '@/lib/admin-guard'

/**
 * GET /api/admin/subscriptions?status=&plan=&interval=
 * Abonnements, transactions FeexPay, notifications reçues et revenus par formule.
 */
export async function GET(req: NextRequest) {
  const guard = await requireAdmin()
  if ('error' in guard) return guard.error

  const sp = req.nextUrl.searchParams
  const status = sp.get('status')
  const plan = sp.get('plan')
  const interval = sp.get('interval')

  let query = supabaseAdmin
    .from('subscriptions')
    .select('id, user_id, plan, status, billing_interval, amount, currency, started_at, expires_at, cancelled_at, suspended_at, payment_provider, provider_transaction_id, source, notes, created_at, users(email, full_name, phone)')
    .order('created_at', { ascending: false })
  if (status) query = query.eq('status', status)
  if (plan) query = query.eq('plan', plan)
  if (interval) query = query.eq('billing_interval', interval)

  const since = new Date(Date.now() - 365 * 86_400_000).toISOString()
  const [{ data, error }, { data: txs }, { data: events }] = await Promise.all([
    query.limit(500),
    supabaseAdmin.from('payment_transactions')
      .select('reference, user_id, product_key, plan, billing_interval, amount, currency, status, change_kind, network, phone_last4, provider_status, failure_reason, created_at, processed_at, users(email, full_name)')
      .gte('created_at', since).order('created_at', { ascending: false }).limit(500),
    supabaseAdmin.from('payment_webhook_events')
      .select('reference, known, outcome, detail, received_at').order('received_at', { ascending: false }).limit(50),
  ])
  if (error) {
    console.error('[/api/admin/subscriptions]', error)
    return NextResponse.json({ error: { code: 'DB_ERROR', message: 'Une erreur est survenue, réessaie plus tard.' } }, { status: 500 })
  }

  const now = Date.now()
  const rows = (data ?? []).map((s) => {
    const u = s.users as unknown as { email: string | null; full_name: string | null; phone: string | null } | null
    const daysLeft = s.expires_at ? Math.ceil((new Date(s.expires_at).getTime() - now) / 86_400_000) : null
    return {
      id: s.id, user_id: s.user_id, plan: normalizePlan(s.plan), status: s.status,
      billing_interval: s.billing_interval, amount: s.amount, currency: s.currency,
      provider: s.payment_provider ?? 'inconnu', source: s.source, notes: s.notes,
      started_at: s.started_at, expires_at: s.expires_at, created_at: s.created_at, days_left: daysLeft,
      email: u?.email ?? null, full_name: u?.full_name ?? null, phone: u?.phone ?? null,
    }
  })

  const transactions = (txs ?? []) as { plan: string; billing_interval: string; amount: number; status: string; created_at: string }[]
  const successful = transactions.filter((t) => t.status === 'successful')
  const monthStart = new Date(); monthStart.setUTCDate(1); monthStart.setUTCHours(0, 0, 0, 0)

  const byPlan = SUBSCRIPTION_PLANS.filter((p) => p !== 'free').map((p) => {
    const paid = successful.filter((t) => normalizePlan(t.plan) === p)
    const active = rows.filter((r) => r.plan === p && r.status === 'active' && (r.days_left === null || r.days_left > 0))
    return {
      plan: p,
      label: PLAN_META[p].label,
      active_monthly: active.filter((r) => r.billing_interval === 'month').length,
      active_yearly: active.filter((r) => r.billing_interval === 'year').length,
      active_other: active.filter((r) => !r.billing_interval).length,
      revenue_month_fcfa: paid.filter((t) => new Date(t.created_at) >= monthStart).reduce((s, t) => s + t.amount, 0),
      revenue_12m_fcfa: paid.reduce((s, t) => s + t.amount, 0),
    }
  })

  const active = rows.filter((r) => r.status === 'active' && (r.days_left === null || r.days_left > 0))
  const summary = {
    total: rows.length,
    active: active.length,
    monthly: active.filter((r) => r.billing_interval === 'month').length,
    yearly: active.filter((r) => r.billing_interval === 'year').length,
    expiring_7d: active.filter((r) => r.days_left !== null && r.days_left >= 0 && r.days_left <= 7).length,
    pending_payments: transactions.filter((t) => t.status === 'pending').length,
    failed_payments_30d: transactions.filter((t) => ['failed', 'cancelled', 'expired'].includes(t.status)
      && now - new Date(t.created_at).getTime() < 30 * 86_400_000).length,
    revenue_month_fcfa: byPlan.reduce((s, p) => s + p.revenue_month_fcfa, 0),
    revenue_12m_fcfa: byPlan.reduce((s, p) => s + p.revenue_12m_fcfa, 0),
  }

  return NextResponse.json({ data: rows, summary, by_plan: byPlan, transactions: txs ?? [], webhook_events: events ?? [] })
}
