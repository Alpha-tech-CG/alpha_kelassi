import { initializeApp, cert, getApps, type App } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'
import { getStorage } from 'firebase-admin/storage'

function initFirebaseAdmin(): App {
  if (getApps().length > 0) return getApps()[0]!

  const projectId   = process.env['FIREBASE_PROJECT_ID']!
  const clientEmail = process.env['FIREBASE_CLIENT_EMAIL']!
  // La clé privée est stockée avec des \n littéraux dans les env vars
  const privateKey  = process.env['FIREBASE_PRIVATE_KEY']!.replace(/\\n/g, '\n')

  return initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
    storageBucket: process.env['FIREBASE_STORAGE_BUCKET']!,
  })
}

const app = initFirebaseAdmin()

export const adminAuth    = getAuth(app)
export const adminDb      = getFirestore(app)
export const adminStorage = getStorage(app)

// Noms de collections centralisés (même liste que côté web)
export const COLLECTIONS = {
  USERS:           'users',
  SUBJECTS:        'subjects',
  DOCUMENTS:       'documents',
  DOCUMENT_CHUNKS: 'document_chunks',
  DOCUMENT_VIEWS:  'document_views',
  FLASHCARDS:      'flashcards',
  CHAT_SESSIONS:   'chat_sessions',
  CHAT_MESSAGES:   'chat_messages',
  USER_PROGRESS:   'user_progress',
  USER_BADGES:     'user_badges',
  SUBSCRIPTIONS:   'subscriptions',
  NOTIFICATIONS:   'notifications',
  COURSE_CHAPTERS: 'course_chapters',
  FEEDBACK:        'feedback',
} as const
