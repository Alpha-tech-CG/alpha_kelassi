import { Hono } from 'hono'
import type { AppVariables } from '../../lib/types.js'
import { supabaseAdmin as supabase } from '../../lib/supabase.js'
import { authMiddleware } from '../../middleware/auth.js'

const router = new Hono<{ Variables: AppVariables }>()
router.use('*', authMiddleware)

router.use('*', async (c, next) => {
  const userId = c.get('userId') as string
  const { data: user } = await supabase.from('users').select('role').eq('id', userId).single()
  if (user?.role !== 'admin') return c.json({ error: { code: 'FORBIDDEN' } }, 403)
  await next()
})

// GET /api/admin/analytics
router.get('/', async (c) => {
  const since7d = new Date(Date.now() - 7 * 86400000).toISOString()
  const since6d = new Date(Date.now() - 6 * 86400000).toISOString().slice(0, 10)

  const [
    { data: topDocs },
    { data: activeStats },
    { data: activeSubs },
    { data: recentQuestions },
    { count: totalUsers },
    // ── Nouvelles métriques ──
    { data: topPages },
    { data: loginFrequency },
    { data: promoStats },
    { data: errorHotspots },
    { count: usersWithPromo },
    { data: recentErrors },
    { data: registrationsByDay },
  ] = await Promise.all([
    // Documents les plus vus sur 7 jours
    supabase
      .from('document_views')
      .select('document_id, documents(title, type, level)')
      .gte('viewed_at', since7d)
      .limit(500),

    // Utilisateurs actifs par jour (7 derniers jours)
    supabase
      .from('user_progress')
      .select('user_id, last_active')
      .gte('last_active', since6d),

    // Abonnements actifs
    supabase
      .from('subscriptions')
      .select('plan, status, stripe_sub_id, cinetpay_ref, expires_at, created_at')
      .eq('status', 'active'),

    // Questions récentes (pour cache prioritaire)
    supabase
      .from('chat_messages')
      .select('content, created_at')
      .eq('role', 'user')
      .order('created_at', { ascending: false })
      .limit(50),

    // Total utilisateurs
    supabase.from('users').select('id', { count: 'exact', head: true }),

    // Top pages visitées sur 7 jours
    supabase
      .from('page_views')
      .select('page_path, user_id, duration_s, viewed_at')
      .gte('viewed_at', since7d)
      .limit(2000),

    // Fréquence de connexion — dernières 30 sessions par user
    supabase
      .from('login_sessions')
      .select('user_id, logged_in_at, platform, device')
      .gte('logged_in_at', new Date(Date.now() - 30 * 86400000).toISOString())
      .order('logged_in_at', { ascending: false })
      .limit(5000),

    // Stats codes promo
    supabase
      .from('users')
      .select('promo_code, created_at')
      .not('promo_code', 'is', null)
      .order('created_at', { ascending: false }),

    // Pages qui bug le plus (7 jours)
    supabase
      .from('client_errors')
      .select('page_path, error_type, error_message, occurred_at')
      .gte('occurred_at', since7d)
      .order('occurred_at', { ascending: false })
      .limit(500),

    // Nombre d'inscrits avec code promo
    supabase
      .from('users')
      .select('id', { count: 'exact', head: true })
      .not('promo_code', 'is', null),

    // Dernières erreurs client (20 plus récentes)
    supabase
      .from('client_errors')
      .select('page_path, error_type, error_message, occurred_at')
      .order('occurred_at', { ascending: false })
      .limit(20),

    // Inscriptions par jour sur 30 jours
    supabase
      .from('users')
      .select('created_at')
      .gte('created_at', new Date(Date.now() - 30 * 86400000).toISOString())
      .order('created_at', { ascending: true }),
  ])

  // ── Documents les plus vus ──────────────────────────────────────────────────
  const viewsByDoc = new Map<string, { count: number; title: string; type: string; level: string }>()
  for (const row of topDocs ?? []) {
    const doc = row.documents as { title: string; type: string; level: string } | null
    const cur = viewsByDoc.get(row.document_id) ?? { count: 0, title: doc?.title ?? '', type: doc?.type ?? '', level: doc?.level ?? '' }
    viewsByDoc.set(row.document_id, { ...cur, count: cur.count + 1 })
  }
  const topDocsSorted = [...viewsByDoc.entries()]
    .map(([id, v]) => ({ document_id: id, ...v }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)

  // ── Utilisateurs actifs par jour ────────────────────────────────────────────
  const activeByDay = new Map<string, Set<string>>()
  for (const row of activeStats ?? []) {
    const day = row.last_active
    if (!day) continue
    if (!activeByDay.has(day)) activeByDay.set(day, new Set())
    activeByDay.get(day)!.add(row.user_id)
  }
  const activeChart = [...activeByDay.entries()]
    .map(([day, users]) => ({ day, active_users: users.size }))
    .sort((a, b) => a.day.localeCompare(b.day))

  // ── Revenus estimés ─────────────────────────────────────────────────────────
  const stripeCount = (activeSubs ?? []).filter((s) => s.stripe_sub_id).length
  const cinetpayCount = (activeSubs ?? []).filter((s) => s.cinetpay_ref).length
  const revenueEstimate = {
    active_subscriptions: (activeSubs ?? []).length,
    stripe_count: stripeCount,
    cinetpay_count: cinetpayCount,
    monthly_revenue_fcfa: stripeCount * 2000 + cinetpayCount * 2000,
  }

  // ── Top pages (agrégé côté JS) ──────────────────────────────────────────────
  const pageMap = new Map<string, { views: number; users: Set<string>; total_duration: number }>()
  for (const row of topPages ?? []) {
    const cur = pageMap.get(row.page_path) ?? { views: 0, users: new Set(), total_duration: 0 }
    cur.views++
    if (row.user_id) cur.users.add(row.user_id)
    if (row.duration_s) cur.total_duration += row.duration_s
    pageMap.set(row.page_path, cur)
  }
  const topPagesSorted = [...pageMap.entries()]
    .map(([path, v]) => ({
      page_path: path,
      view_count: v.views,
      unique_users: v.users.size,
      avg_duration_s: v.views > 0 ? Math.round(v.total_duration / v.views) : 0,
    }))
    .sort((a, b) => b.view_count - a.view_count)
    .slice(0, 15)

  // ── Fréquence de connexion par user ────────────────────────────────────────
  const loginByUser = new Map<string, number>()
  for (const row of loginFrequency ?? []) {
    loginByUser.set(row.user_id, (loginByUser.get(row.user_id) ?? 0) + 1)
  }
  const loginStats = {
    total_logins_30d: (loginFrequency ?? []).length,
    avg_logins_per_user: loginByUser.size > 0
      ? Math.round([...loginByUser.values()].reduce((a, b) => a + b, 0) / loginByUser.size)
      : 0,
    // Connexions par jour sur 30 jours
    by_day: (() => {
      const dayMap = new Map<string, number>()
      for (const row of loginFrequency ?? []) {
        const day = row.logged_in_at.slice(0, 10)
        dayMap.set(day, (dayMap.get(day) ?? 0) + 1)
      }
      return [...dayMap.entries()]
        .map(([day, count]) => ({ day, count }))
        .sort((a, b) => a.day.localeCompare(b.day))
    })(),
    by_platform: {
      web: (loginFrequency ?? []).filter((r) => r.platform === 'web').length,
      mobile: (loginFrequency ?? []).filter((r) => r.platform === 'mobile').length,
    },
  }

  // ── Codes promo ─────────────────────────────────────────────────────────────
  const promoMap = new Map<string, number>()
  for (const row of promoStats ?? []) {
    if (row.promo_code) promoMap.set(row.promo_code, (promoMap.get(row.promo_code) ?? 0) + 1)
  }
  const promoCodes = [...promoMap.entries()]
    .map(([code, count]) => ({ code, user_count: count }))
    .sort((a, b) => b.user_count - a.user_count)

  // ── Pages qui bug le plus ───────────────────────────────────────────────────
  const errorMap = new Map<string, { count: number; types: Set<string>; last_seen: string }>()
  for (const row of errorHotspots ?? []) {
    const key = row.page_path ?? 'unknown'
    const cur = errorMap.get(key) ?? { count: 0, types: new Set(), last_seen: '' }
    cur.count++
    if (row.error_type) cur.types.add(row.error_type)
    if (!cur.last_seen || row.occurred_at > cur.last_seen) cur.last_seen = row.occurred_at
    errorMap.set(key, cur)
  }
  const errorHotspotsAgg = [...errorMap.entries()]
    .map(([page, v]) => ({
      page_path: page,
      error_count: v.count,
      error_types: [...v.types],
      last_seen: v.last_seen,
    }))
    .sort((a, b) => b.error_count - a.error_count)
    .slice(0, 10)

  // ── Inscriptions par jour ───────────────────────────────────────────────────
  const regByDay = new Map<string, number>()
  for (const row of registrationsByDay ?? []) {
    const day = row.created_at.slice(0, 10)
    regByDay.set(day, (regByDay.get(day) ?? 0) + 1)
  }
  const registrationsChart = [...regByDay.entries()]
    .map(([day, count]) => ({ day, count }))
    .sort((a, b) => a.day.localeCompare(b.day))

  return c.json({
    data: {
      // ── Existant ──
      top_documents: topDocsSorted,
      active_users_chart: activeChart,
      revenue: revenueEstimate,
      recent_questions: (recentQuestions ?? []).slice(0, 20).map((q) => ({
        content: q.content.slice(0, 120),
        asked_at: q.created_at,
      })),
      totals: {
        users: totalUsers ?? 0,
        active_subs: (activeSubs ?? []).length,
        users_with_promo: usersWithPromo ?? 0,
      },
      // ── Nouveau ──
      top_pages: topPagesSorted,
      login_stats: loginStats,
      promo_codes: promoCodes,
      error_hotspots: errorHotspotsAgg,
      recent_errors: (recentErrors ?? []).map((e) => ({
        page_path: e.page_path,
        error_type: e.error_type,
        error_message: e.error_message?.slice(0, 200),
        occurred_at: e.occurred_at,
      })),
      registrations_chart: registrationsChart,
    },
  })
})

export { router as adminAnalyticsRouter }
