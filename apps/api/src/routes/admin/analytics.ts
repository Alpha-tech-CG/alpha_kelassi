import { Hono } from 'hono'
import type { AppVariables } from '../../lib/types.js'
import { authMiddleware, adminMiddleware } from '../../middleware/auth.js'
import { adminDb, COLLECTIONS } from '../../lib/firebase.js'

const router = new Hono<{ Variables: AppVariables }>()
router.use('*', authMiddleware)
router.use('*', adminMiddleware)

// GET /api/admin/analytics
router.get('/', async (c) => {
  const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString()
  const sixDaysAgo   = new Date(Date.now() - 6 * 86400000).toISOString().slice(0, 10)

  const [viewsSnap, progressSnap, subsSnap, recentMsgsSnap, usersSnap] = await Promise.all([
    // Vues des 7 derniers jours
    adminDb.collection(COLLECTIONS.DOCUMENT_VIEWS)
      .where('viewed_at', '>=', sevenDaysAgo)
      .get(),

    // Utilisateurs actifs (7 jours)
    adminDb.collection(COLLECTIONS.USER_PROGRESS)
      .where('last_active', '>=', sixDaysAgo)
      .get(),

    // Abonnements actifs
    adminDb.collection(COLLECTIONS.SUBSCRIPTIONS)
      .where('status', '==', 'active')
      .get(),

    // Questions récentes
    adminDb.collection(COLLECTIONS.CHAT_MESSAGES)
      .where('role', '==', 'user')
      .orderBy('created_at', 'desc')
      .limit(50)
      .get(),

    // Total utilisateurs
    adminDb.collection(COLLECTIONS.USERS).select().get(),
  ])

  // Agrégation côté JS (Firestore n'a pas de GROUP BY)
  const viewsByDoc = new Map<string, { count: number; document_id: string }>()
  for (const d of viewsSnap.docs) {
    const docId = d.data()['document_id'] as string
    const cur   = viewsByDoc.get(docId) ?? { count: 0, document_id: docId }
    viewsByDoc.set(docId, { ...cur, count: cur.count + 1 })
  }

  // Récupère les titres des top 10 documents
  const topRaw = [...viewsByDoc.values()].sort((a, b) => b.count - a.count).slice(0, 10)
  const topDocsWithMeta = await Promise.all(
    topRaw.map(async ({ document_id, count }) => {
      const snap = await adminDb.collection(COLLECTIONS.DOCUMENTS).doc(document_id).get()
      const d    = snap.data() ?? {}
      return { document_id, view_count: count, title: d['title'] ?? '', type: d['type'] ?? '', level: d['level'] ?? '' }
    })
  )

  // Utilisateurs actifs par jour
  const activeByDay = new Map<string, Set<string>>()
  for (const d of progressSnap.docs) {
    const row = d.data() as { user_id: string; last_active: string }
    if (!activeByDay.has(row.last_active)) activeByDay.set(row.last_active, new Set())
    activeByDay.get(row.last_active)!.add(row.user_id)
  }
  const activeChart = [...activeByDay.entries()]
    .map(([day, users]) => ({ day, active_users: users.size }))
    .sort((a, b) => a.day.localeCompare(b.day))

  // Revenus estimés
  const subs         = subsSnap.docs.map((d) => d.data())
  const stripeCount  = subs.filter((s) => s['stripe_sub_id']).length
  const cinetCount   = subs.filter((s) => s['cinetpay_ref']).length

  return c.json({
    data: {
      top_documents:      topDocsWithMeta,
      active_users_chart: activeChart,
      revenue: {
        active_subscriptions: subs.length,
        stripe_count:         stripeCount,
        cinetpay_count:       cinetCount,
        monthly_revenue_fcfa: (stripeCount + cinetCount) * 2000,
      },
      recent_questions: recentMsgsSnap.docs.slice(0, 20).map((d) => ({
        content:  (d.data()['content'] as string).slice(0, 120),
        asked_at: d.data()['created_at'],
      })),
      totals: {
        users:       usersSnap.size,
        active_subs: subs.length,
      },
    },
  })
})

export { router as adminAnalyticsRouter }
