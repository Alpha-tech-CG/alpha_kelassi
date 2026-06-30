import { Hono } from 'hono'
import type { AppVariables } from '../lib/types.js'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { redis } from '../lib/redis.js'
import { authMiddleware } from '../middleware/auth.js'
import { adminDb, adminStorage, COLLECTIONS } from '../lib/firebase.js'

const router = new Hono<{ Variables: AppVariables }>()
router.use('*', authMiddleware)

// GET /api/documents?subject_id=&type=cours&level=bepc&cursor=&limit=20
router.get('/', zValidator('query', z.object({
  subject_id: z.string().optional(),
  type:       z.enum(['cours', 'examen']).optional(),
  level:      z.enum(['bepc', 'bac_a', 'bac_c', 'bac_d']).optional(),
  year:       z.coerce.number().int().optional(),
  limit:      z.coerce.number().int().min(1).max(50).default(20),
})), async (c) => {
  const { subject_id, type, level, year, limit } = c.req.valid('query')
  const userId = c.get('userId')

  // Vérifie le plan utilisateur
  const userSnap = await adminDb.collection(COLLECTIONS.USERS).doc(userId).get()
  const isPremium = userSnap.data()?.plan === 'premium'

  const cacheKey = `docs:${subject_id}:${type}:${level}:${year}:${limit}:${isPremium}`
  const cached = await redis.get(cacheKey)
  if (cached) return c.json(cached)

  let ref = adminDb.collection(COLLECTIONS.DOCUMENTS)
    .orderBy('created_at', 'desc')
    .limit(limit + 1) as FirebaseFirestore.Query

  if (!isPremium) ref = ref.where('is_premium', '==', false)
  if (subject_id) ref = ref.where('subject_id', '==', subject_id)
  if (type)       ref = ref.where('type', '==', type)
  if (level)      ref = ref.where('level', '==', level)
  if (year)       ref = ref.where('year', '==', year)

  const snap = await ref.get()
  const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
  const hasMore = items.length > limit
  const page = hasMore ? items.slice(0, limit) : items

  const result = { data: page, has_more: hasMore }
  await redis.set(cacheKey, result, { ex: 3600 })
  return c.json(result)
})

// GET /api/documents/:id
router.get('/:id', async (c) => {
  const id     = c.req.param('id')
  const userId = c.get('userId')

  const docSnap = await adminDb.collection(COLLECTIONS.DOCUMENTS).doc(id).get()
  if (!docSnap.exists) {
    return c.json({ error: { code: 'NOT_FOUND', message: 'Document introuvable' } }, 404)
  }
  const doc = { id: docSnap.id, ...docSnap.data() } as Record<string, unknown>

  if (doc['is_premium']) {
    const userSnap = await adminDb.collection(COLLECTIONS.USERS).doc(userId).get()
    if (userSnap.data()?.plan !== 'premium') {
      return c.json({ error: { code: 'FORBIDDEN', message: 'Abonnement premium requis' } }, 403)
    }
  }

  // URL signée Firebase Storage (15 min)
  const bucket   = adminStorage.bucket()
  const filePath = doc['storage_path'] as string
  const [signedUrl] = await bucket.file(filePath).getSignedUrl({
    action:  'read',
    expires: Date.now() + 15 * 60 * 1000,
  })

  // XP + tracking vue en arrière-plan
  const { awardXP, trackDocumentView, checkAndAwardBadges } = await import('../lib/xp.js')
  Promise.allSettled([
    trackDocumentView(userId, id),
    awardXP(userId, 5),
    checkAndAwardBadges(userId),
  ]).then((results) => {
    for (const r of results) {
      if (r.status === 'rejected') console.error('[documents] background task failed:', r.reason)
    }
  })

  return c.json({ data: { ...doc, signed_url: signedUrl } })
})

// GET /api/documents/:id/exercises
router.get('/:id/exercises', async (c) => {
  const id   = c.req.param('id')
  const snap = await adminDb.collection(COLLECTIONS.DOCUMENT_CHUNKS)
    .where('document_id', '==', id)
    .where('is_exercise', '==', true)
    .orderBy('chunk_index')
    .limit(30)
    .get()

  const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
  return c.json({ data })
})

// GET /api/documents/:id/text
router.get('/:id/text', async (c) => {
  const id     = c.req.param('id')
  const userId = c.get('userId')

  const docSnap = await adminDb.collection(COLLECTIONS.DOCUMENTS).doc(id).get()
  if (!docSnap.exists) {
    return c.json({ error: { code: 'NOT_FOUND', message: 'Document introuvable' } }, 404)
  }
  const doc = docSnap.data()!

  if (doc['is_premium']) {
    const userSnap = await adminDb.collection(COLLECTIONS.USERS).doc(userId).get()
    if (userSnap.data()?.plan !== 'premium') {
      return c.json({ error: { code: 'FORBIDDEN', message: 'Abonnement premium requis' } }, 403)
    }
  }

  return c.json({ data: { text_content: doc['text_content'] ?? null } })
})

export { router as documentsRouter }
