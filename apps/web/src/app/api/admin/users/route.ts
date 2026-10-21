import { NextRequest, NextResponse } from 'next/server'
import { PLAN_LEVELS, dayPeriodKey, isSubscriptionPlan, monthPeriodKey, normalizePlan, type SubscriptionPlan } from '@alpha-kelassi/types'
import { requireAdmin, supabaseAdmin } from '@/lib/admin-guard'

interface SubRow { user_id: string; plan: string; status: string; billing_interval: string | null; started_at: string | null; expires_at: string | null; source: string; created_at: string }

/**
 * GET /api/admin/users?plan=&q= — comptes avec leur formule EFFECTIVE,
 * l'échéance, l'intervalle, le point de vérification éventuel et l'usage
 * du jour (IA) et du mois (corrections).
 */
export async function GET(req: NextRequest) {
  const guard = await requireAdmin()
  if ('error' in guard) return guard.error

  const sp = req.nextUrl.searchParams
  const planFilter = sp.get('plan')
  const q = (sp.get('q') ?? '').trim().toLowerCase()

  const { data: users, error } = await supabaseAdmin.from('users')
    .select('*').order('created_at', { ascending: false }).limit(1000)
  if (error) {
    console.error('[/api/admin/users]', error)
    return NextResponse.json({ error: { code: 'DB_ERROR', message: 'Une erreur est survenue, réessaie plus tard.' } }, { status: 500 })
  }
  const rows = (users ?? []) as { id: string; full_name: string | null; email: string | null; phone: string | null; role: string; plan: string; plan_review?: string | null; created_at: string }[]
  const ids = rows.map((u) => u.id)

  const now = new Date().toISOString()
  const [{ data: subs }, { data: usage }] = await Promise.all([
    ids.length ? supabaseAdmin.from('subscriptions')
      .select('user_id, plan, status, billing_interval, started_at, expires_at, source, created_at')
      .in('user_id', ids).in('status', ['active', 'pending', 'suspended']) : Promise.resolve({ data: [] }),
    ids.length ? supabaseAdmin.from('usage_counters')
      .select('user_id, usage_type, period_key, used, bonus')
      .in('user_id', ids).in('period_key', [dayPeriodKey(), monthPeriodKey()]) : Promise.resolve({ data: [] }),
  ])

  const subsByUser = new Map<string, SubRow[]>()
  for (const s of (subs ?? []) as SubRow[]) subsByUser.set(s.user_id, [...(subsByUser.get(s.user_id) ?? []), s])
  const usageByUser = new Map<string, { ai_today: number; ai_bonus: number; corrections_month: number; corrections_bonus: number }>()
  for (const u of (usage ?? []) as { user_id: string; usage_type: string; period_key: string; used: number; bonus: number }[]) {
    const e = usageByUser.get(u.user_id) ?? { ai_today: 0, ai_bonus: 0, corrections_month: 0, corrections_bonus: 0 }
    if (u.usage_type === 'ai_questions' && u.period_key === dayPeriodKey()) { e.ai_today = u.used; e.ai_bonus = u.bonus }
    if (u.usage_type === 'tutor_corrections' && u.period_key === monthPeriodKey()) { e.corrections_month = u.used; e.corrections_bonus = u.bonus }
    usageByUser.set(u.user_id, e)
  }

  const result = rows.map((u) => {
    const userSubs = subsByUser.get(u.id) ?? []
    const current = userSubs
      .filter((s) => s.status !== 'suspended' && (s.started_at ?? s.created_at) <= now && (!s.expires_at || s.expires_at > now))
      .sort((a, b) => PLAN_LEVELS[normalizePlan(b.plan)] - PLAN_LEVELS[normalizePlan(a.plan)])[0] ?? null
    const subscriptionPlan: SubscriptionPlan = current ? normalizePlan(current.plan) : 'free'
    return {
      id: u.id, full_name: u.full_name, email: u.email, phone: u.phone, role: u.role, created_at: u.created_at,
      plan: subscriptionPlan,
      effective_plan: u.role === 'admin' ? 'pro_max' : subscriptionPlan,
      billing_interval: current?.billing_interval ?? null,
      expires_at: current?.expires_at ?? null,
      source: current?.source ?? null,
      suspended: userSubs.some((s) => s.status === 'suspended'),
      scheduled: userSubs.filter((s) => s.status === 'pending' && (s.started_at ?? '') > now).length,
      plan_review: u.plan_review ?? null,
      usage: usageByUser.get(u.id) ?? { ai_today: 0, ai_bonus: 0, corrections_month: 0, corrections_bonus: 0 },
    }
  }).filter((u) =>
    (!planFilter || (isSubscriptionPlan(planFilter) ? u.plan === planFilter : planFilter === 'review' ? !!u.plan_review : true))
    && (!q || [u.full_name, u.email, u.phone].some((v) => (v ?? '').toLowerCase().includes(q))))

  return NextResponse.json({ data: result })
}
