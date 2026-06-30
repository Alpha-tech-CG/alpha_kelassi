import { Hono } from 'hono'
import type { AppVariables } from '../../lib/types.js'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { authMiddleware, adminMiddleware } from '../../middleware/auth.js'
import { adminDb, COLLECTIONS } from '../../lib/firebase.js'
import { FieldValue } from 'firebase-admin/firestore'

const router = new Hono<{ Variables: AppVariables }>()
router.use('*', authMiddleware)
router.use('*', adminMiddleware)

const notifSchema = z.object({
  type:        z.enum(['annonce', 'promo', 'pub', 'alerte']).default('annonce'),
  title:       z.string().min(2).max(120),
  message:     z.string().min(5).max(500),
  cta_label:   z.string().max(60).optional().nullable(),
  cta_url:     z.string().url().optional().nullable(),
  is_active:   z.boolean().default(true),
  target_plan: z.enum(['all', 'free', 'premium']).default('all'),
  expires_at:  z.string().datetime().optional().nullable(),
})

// GET /api/admin/notifications
router.get('/', async (c) => {
  const snap = await adminDb.collection(COLLECTIONS.NOTIFICATIONS)
    .orderBy('created_at', 'desc')
    .get()
  return c.json({ data: snap.docs.map((d) => ({ id: d.id, ...d.data() })) })
})

// POST /api/admin/notifications
router.post('/', zValidator('json', notifSchema), async (c) => {
  const body = c.req.valid('json')
  const ref  = await adminDb.collection(COLLECTIONS.NOTIFICATIONS).add({
    ...body,
    created_at: FieldValue.serverTimestamp(),
  })
  const snap = await ref.get()
  return c.json({ data: { id: snap.id, ...snap.data() } }, 201)
})

// PATCH /api/admin/notifications/:id
router.patch('/:id', zValidator('json', notifSchema.partial()), async (c) => {
  const id   = c.req.param('id')
  const body = c.req.valid('json')
  const ref  = adminDb.collection(COLLECTIONS.NOTIFICATIONS).doc(id)
  await ref.update({ ...body, updated_at: FieldValue.serverTimestamp() })
  const snap = await ref.get()
  return c.json({ data: { id: snap.id, ...snap.data() } })
})

// DELETE /api/admin/notifications/:id
router.delete('/:id', async (c) => {
  await adminDb.collection(COLLECTIONS.NOTIFICATIONS).doc(c.req.param('id')).delete()
  return c.json({ data: { deleted: true } })
})

export { router as adminNotificationsRouter }
