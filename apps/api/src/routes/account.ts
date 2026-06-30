import { Hono } from 'hono'
import type { AppVariables } from '../lib/types.js'
import { authMiddleware } from '../middleware/auth.js'
import { adminAuth, adminDb, COLLECTIONS } from '../lib/firebase.js'

const router = new Hono<{ Variables: AppVariables }>()
router.use('*', authMiddleware)

// GET /api/account/export — export RGPD
router.get('/export', async (c) => {
  const userId = c.get('userId')
  const db     = adminDb

  const [userSnap, subsSnap, progressSnap, flashcardsSnap, sessionsSnap, badgesSnap] = await Promise.all([
    db.collection(COLLECTIONS.USERS).doc(userId).get(),
    db.collection(COLLECTIONS.SUBSCRIPTIONS).where('user_id', '==', userId).get(),
    db.collection(COLLECTIONS.USER_PROGRESS).where('user_id', '==', userId).get(),
    db.collection(COLLECTIONS.FLASHCARDS).where('user_id', '==', userId).limit(500).get(),
    db.collection(COLLECTIONS.CHAT_SESSIONS).where('user_id', '==', userId).limit(100).get(),
    db.collection(COLLECTIONS.USER_BADGES).where('user_id', '==', userId).get(),
  ])

  const exportData = {
    generated_at:  new Date().toISOString(),
    user:          userSnap.exists ? { id: userSnap.id, ...userSnap.data() } : null,
    subscriptions: subsSnap.docs.map((d) => ({ id: d.id, ...d.data() })),
    progress:      progressSnap.docs.map((d) => ({ id: d.id, ...d.data() })),
    flashcards:    flashcardsSnap.docs.map((d) => ({ id: d.id, ...d.data() })),
    chat_sessions: sessionsSnap.docs.map((d) => ({ id: d.id, ...d.data() })),
    badges:        badgesSnap.docs.map((d) => ({ id: d.id, ...d.data() })),
  }

  return new Response(JSON.stringify(exportData, null, 2), {
    headers: {
      'Content-Type':        'application/json',
      'Content-Disposition': `attachment; filename="kelassi-data-${userId.slice(0, 8)}.json"`,
    },
  })
})

// DELETE /api/account — suppression du compte (RGPD)
router.delete('/', async (c) => {
  const userId = c.get('userId')
  const db     = adminDb

  // Supprime toutes les collections liées (Firestore n'a pas de cascade automatique)
  const collections = [
    COLLECTIONS.SUBSCRIPTIONS,
    COLLECTIONS.USER_PROGRESS,
    COLLECTIONS.USER_BADGES,
    COLLECTIONS.DOCUMENT_VIEWS,
    COLLECTIONS.CHAT_SESSIONS,
    COLLECTIONS.CHAT_MESSAGES,
  ]

  await Promise.all(
    collections.map(async (col) => {
      const snap = await db.collection(col).where('user_id', '==', userId).get()
      const batch = db.batch()
      snap.docs.forEach((d) => batch.delete(d.ref))
      return batch.commit()
    })
  )

  // Flashcards
  const flashSnap = await db.collection(COLLECTIONS.FLASHCARDS).where('user_id', '==', userId).get()
  const flashBatch = db.batch()
  flashSnap.docs.forEach((d) => flashBatch.delete(d.ref))
  await flashBatch.commit()

  // Supprime le document utilisateur et le compte Firebase Auth
  await db.collection(COLLECTIONS.USERS).doc(userId).delete()
  await adminAuth.deleteUser(userId)

  return c.json({ data: { deleted: true } })
})

export { router as accountRouter }
