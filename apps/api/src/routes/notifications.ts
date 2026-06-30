import { Hono } from 'hono'
import { adminDb, COLLECTIONS } from '../lib/firebase.js'

const router = new Hono()

// GET /api/notifications?plan=free — notifs actives pour le dashboard (endpoint public)
router.get('/', async (c) => {
  const plan = c.req.query('plan') ?? 'free'
  const now  = new Date().toISOString()

  const snap = await adminDb.collection(COLLECTIONS.NOTIFICATIONS)
    .where('is_active', '==', true)
    .orderBy('created_at', 'desc')
    .limit(5)
    .get()

  const data = snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .filter((n: Record<string, unknown>) => {
      const expires = n['expires_at'] as string | null
      const target  = n['target_plan'] as string
      return (
        (!expires || expires > now) &&
        (target === 'all' || target === plan)
      )
    })
    .map(({ id, type, title, message, cta_label, cta_url }) => ({
      id, type, title, message, cta_label, cta_url,
    }))

  return c.json({ data })
})

export { router as notificationsRouter }
