import { Hono } from 'hono'
import type { AppVariables } from '../lib/types.js'
import { authMiddleware } from '../middleware/auth.js'
import { adminDb, COLLECTIONS } from '../lib/firebase.js'
import { computeLevel, BADGES } from '../lib/xp.js'

const router = new Hono<{ Variables: AppVariables }>()
router.use('*', authMiddleware)

// GET /api/progress/dashboard — toutes les données de progression élève
router.get('/dashboard', async (c) => {
  const userId = c.get('userId')
  const now    = new Date().toISOString()

  const [userSnap, badgesSnap, progressSnap, nextCardSnap, sessionsSnap, viewsSnap] = await Promise.all([
    adminDb.collection(COLLECTIONS.USERS).doc(userId).get(),
    adminDb.collection(COLLECTIONS.USER_BADGES).where('user_id', '==', userId).orderBy('earned_at').get(),
    adminDb.collection(COLLECTIONS.USER_PROGRESS).where('user_id', '==', userId).get(),
    adminDb.collection(COLLECTIONS.FLASHCARDS)
      .where('user_id', '==', userId)
      .where('next_review', '<=', now)
      .orderBy('next_review', 'asc')
      .limit(1)
      .get(),
    adminDb.collection(COLLECTIONS.CHAT_SESSIONS).where('user_id', '==', userId).get(),
    adminDb.collection(COLLECTIONS.DOCUMENT_VIEWS).where('user_id', '==', userId)
      .select() // compte seulement
      .get(),
  ])

  // Compte les messages utilisateur dans toutes les sessions
  const sessionIds  = sessionsSnap.docs.map((d) => d.id)
  let questionsCount = 0
  if (sessionIds.length > 0) {
    // Firestore limite les `in` à 30 éléments — on fait par batch
    const batches = []
    for (let i = 0; i < sessionIds.length; i += 30) {
      batches.push(
        adminDb.collection(COLLECTIONS.CHAT_MESSAGES)
          .where('session_id', 'in', sessionIds.slice(i, i + 30))
          .where('role', '==', 'user')
          .select()
          .get()
      )
    }
    const results = await Promise.all(batches)
    questionsCount = results.reduce((sum, snap) => sum + snap.size, 0)
  }

  const user         = userSnap.data() ?? {}
  const xp           = (user['xp'] as number) ?? 0
  const levelInfo    = computeLevel(xp)
  const progressRows = progressSnap.docs.map((d) => ({ id: d.id, ...d.data() }))
  const maxStreak    = Math.max(...progressRows.map((p) => (p as Record<string, unknown>)['streak_days'] as number ?? 0), 0)

  const badgesWithMeta = badgesSnap.docs.map((d) => {
    const b = d.data() as { badge_code: string; earned_at: string }
    return {
      code:      b.badge_code,
      earned_at: b.earned_at,
      ...BADGES[b.badge_code as keyof typeof BADGES],
    }
  })

  const nextCard = nextCardSnap.empty ? null : { id: nextCardSnap.docs[0]!.id, ...nextCardSnap.docs[0]!.data() }

  return c.json({
    data: {
      xp,
      level:          levelInfo.level,
      level_label:    levelInfo.label,
      next_level_xp:  levelInfo.nextXp,
      streak:         maxStreak,
      badges:         badgesWithMeta,
      progress:       progressRows,
      next_review:    nextCard,
      stats: {
        questions_asked:     questionsCount,
        documents_viewed:    viewsSnap.size,
        flashcards_reviewed: progressRows.reduce((s, p) => s + ((p as Record<string, unknown>)['flashcards_reviewed'] as number ?? 0), 0),
      },
    },
  })
})

export { router as progressRouter }
