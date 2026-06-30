import { adminDb, COLLECTIONS } from './firebase.js'
import { FieldValue } from 'firebase-admin/firestore'

export const XP = {
  DOCUMENT_VIEW:     5,
  CHAT_QUESTION:     2,
  FLASHCARD_PASS:    2,
  FLASHCARD_PERFECT: 3,
  STREAK_DAILY:      5,
} as const

export const BADGES = {
  first_steps:       { label: 'Premiers pas',       description: 'Premier cours consulté' },
  streak_3:          { label: '3 jours consécutifs', description: 'Révise 3 jours d\'affilée' },
  streak_7:          { label: 'Une semaine !',        description: 'Révise 7 jours d\'affilée' },
  flashcard_veteran: { label: 'Flashcard veteran',   description: '50 flashcards révisées' },
  curious_mind:      { label: 'Esprit curieux',      description: '10 questions posées à Kelassi' },
} as const

export type BadgeCode = keyof typeof BADGES

export function computeLevel(xp: number): { level: number; label: string; nextXp: number } {
  if (xp < 100)  return { level: 1, label: 'Débutant', nextXp: 100 }
  if (xp < 300)  return { level: 2, label: 'Apprenti', nextXp: 300 }
  if (xp < 600)  return { level: 3, label: 'Élève',    nextXp: 600 }
  if (xp < 1000) return { level: 4, label: 'Avancé',   nextXp: 1000 }
  return           { level: 5, label: 'Expert',    nextXp: Infinity }
}

const MAX_XP_PER_CALL = 1000

export async function awardXP(userId: string, amount: number): Promise<void> {
  if (amount <= 0 || amount > MAX_XP_PER_CALL) {
    console.error(`[xp] montant invalide: ${amount}`)
    return
  }
  const userRef = adminDb.collection(COLLECTIONS.USERS).doc(userId)
  await userRef.update({ xp: FieldValue.increment(amount) })
}

export async function updateStreak(userId: string, subjectId: string): Promise<number> {
  const progressId  = `${userId}_${subjectId}`
  const progressRef = adminDb.collection(COLLECTIONS.USER_PROGRESS).doc(progressId)
  const snap        = await progressRef.get()

  if (!snap.exists) return 0

  const prog      = snap.data()!
  const today     = new Date().toISOString().slice(0, 10)
  const lastActive = prog['last_active'] as string

  if (lastActive === today) return prog['streak_days'] as number

  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
  const newStreak = lastActive === yesterday ? (prog['streak_days'] as number) + 1 : 1

  await progressRef.update({ streak_days: newStreak, last_active: today })
  return newStreak
}

export async function checkAndAwardBadges(userId: string): Promise<void> {
  const now = new Date().toISOString().slice(0, 10)

  const [userSnap, existingSnap, progressSnap, flashcardSnap, sessionsSnap] = await Promise.all([
    adminDb.collection(COLLECTIONS.USERS).doc(userId).get(),
    adminDb.collection(COLLECTIONS.USER_BADGES).where('user_id', '==', userId).get(),
    adminDb.collection(COLLECTIONS.USER_PROGRESS).where('user_id', '==', userId).get(),
    adminDb.collection(COLLECTIONS.FLASHCARDS).where('user_id', '==', userId).where('reps', '>=', 1).select().get(),
    adminDb.collection(COLLECTIONS.CHAT_SESSIONS).where('user_id', '==', userId).select().get(),
  ])

  const earned    = new Set(existingSnap.docs.map((d) => d.data()['badge_code'] as string))
  const xp        = (userSnap.data()?.['xp'] as number) ?? 0
  const maxStreak = Math.max(...progressSnap.docs.map((d) => (d.data()['streak_days'] as number) ?? 0), 0)
  const totalFlashcards = flashcardSnap.size

  // Compte des messages utilisateur
  const sessionIds = sessionsSnap.docs.map((d) => d.id)
  let totalQuestions = 0
  if (sessionIds.length > 0) {
    const msgsSnap = await adminDb.collection(COLLECTIONS.CHAT_MESSAGES)
      .where('session_id', 'in', sessionIds.slice(0, 30))
      .where('role', '==', 'user')
      .select()
      .get()
    totalQuestions = msgsSnap.size
  }

  const toAward: BadgeCode[] = []
  if (xp >= 0          && !earned.has('first_steps'))       toAward.push('first_steps')
  if (maxStreak >= 3   && !earned.has('streak_3'))          toAward.push('streak_3')
  if (maxStreak >= 7   && !earned.has('streak_7'))          toAward.push('streak_7')
  if (totalFlashcards >= 50 && !earned.has('flashcard_veteran')) toAward.push('flashcard_veteran')
  if (totalQuestions >= 10  && !earned.has('curious_mind'))  toAward.push('curious_mind')

  if (toAward.length === 0) return

  const batch = adminDb.batch()
  for (const badge_code of toAward) {
    const ref = adminDb.collection(COLLECTIONS.USER_BADGES).doc(`${userId}_${badge_code}`)
    batch.set(ref, { user_id: userId, badge_code, earned_at: now }, { merge: true })
  }
  await batch.commit()
}

export async function trackDocumentView(userId: string, documentId: string): Promise<void> {
  await adminDb.collection(COLLECTIONS.DOCUMENT_VIEWS).add({
    user_id:     userId,
    document_id: documentId,
    viewed_at:   new Date().toISOString(),
  })
}
