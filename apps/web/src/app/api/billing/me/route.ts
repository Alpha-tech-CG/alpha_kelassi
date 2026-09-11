import { NextResponse } from 'next/server'
import { FEATURE_KEYS, PLAN_META, allowedExamModes, canAccessFeature } from '@alpha-kelassi/types'
import { authenticate } from '@/lib/supabase/api'
import { supabaseAdmin } from '@/lib/admin-guard'
import { getEntitlements, readUsage } from '@/lib/subscription/server'

/**
 * GET /api/billing/me — formule effective, quotas et abonnement de l'élève.
 * Source d'affichage de toutes les pages d'offres, de gestion et de quota.
 */
export async function GET(req: Request) {
  const { user } = await authenticate(req)
  if (!user) return NextResponse.json({ error: { code: 'UNAUTHORIZED' } }, { status: 401 })

  const ent = await getEntitlements(user.id)
  const [ai, corrections, priority, subs, txs] = await Promise.all([
    readUsage(ent, 'ai_questions').catch(() => null),
    readUsage(ent, 'tutor_corrections').catch(() => null),
    readUsage(ent, 'priority_group_questions').catch(() => null),
    supabaseAdmin.from('subscriptions')
      .select('id, plan, status, billing_interval, amount, currency, started_at, expires_at, cancelled_at, source, created_at')
      .eq('user_id', user.id).order('created_at', { ascending: false }).limit(20),
    supabaseAdmin.from('payment_transactions')
      .select('reference, product_key, plan, billing_interval, amount, currency, status, change_kind, created_at, processed_at')
      .eq('user_id', user.id).order('created_at', { ascending: false }).limit(10),
  ])

  const now = new Date().toISOString()
  const history = (subs.data ?? []) as { id: string; plan: string; status: string; started_at: string | null; expires_at: string | null; created_at: string }[]
  const current = history.find((s) => ['active', 'pending'].includes(s.status)
    && (s.started_at ?? s.created_at) <= now && (!s.expires_at || s.expires_at > now)) ?? null
  const scheduled = history.filter((s) => s.status === 'pending' && (s.started_at ?? '') > now)
  const daysLeft = current?.expires_at ? Math.ceil((new Date(current.expires_at).getTime() - Date.now()) / 86_400_000) : null

  return NextResponse.json({
    data: {
      plan: ent.plan,
      plan_label: PLAN_META[ent.plan].label,
      level: ent.level,
      is_admin: ent.isAdmin,
      current_subscription: current,
      days_left: daysLeft,
      expiring_soon: daysLeft !== null && daysLeft <= 7,
      scheduled,
      history,
      transactions: txs.data ?? [],
      features: Object.fromEntries(FEATURE_KEYS.map((f) => [f, canAccessFeature(ent.plan, f)])),
      exam_modes: allowedExamModes(ent.plan),
      usage: { ai_questions: ai, tutor_corrections: corrections, priority_group_questions: priority },
    },
  })
}
