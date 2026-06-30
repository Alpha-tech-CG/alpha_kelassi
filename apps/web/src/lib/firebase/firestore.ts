/**
 * Helpers Firestore côté client (web).
 * Les noms de collections sont centralisés ici.
 */
import {
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  type DocumentData,
  type QueryConstraint,
} from 'firebase/firestore'
import { db } from './client'

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

// ── Helpers génériques ─────────────────────────────────────────────

export async function getDocument<T = DocumentData>(
  collectionName: string,
  id: string
): Promise<T | null> {
  const snap = await getDoc(doc(db, collectionName, id))
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() } as T
}

export async function queryDocuments<T = DocumentData>(
  collectionName: string,
  constraints: QueryConstraint[]
): Promise<T[]> {
  const q = query(collection(db, collectionName), ...constraints)
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as T)
}

export async function setDocument(
  collectionName: string,
  id: string,
  data: DocumentData
): Promise<void> {
  await setDoc(doc(db, collectionName, id), { ...data, updated_at: serverTimestamp() })
}

export async function updateDocument(
  collectionName: string,
  id: string,
  data: Partial<DocumentData>
): Promise<void> {
  await updateDoc(doc(db, collectionName, id), { ...data, updated_at: serverTimestamp() })
}

export async function deleteDocument(collectionName: string, id: string): Promise<void> {
  await deleteDoc(doc(db, collectionName, id))
}

// ── Re-exports utiles ──────────────────────────────────────────────
export { where, orderBy, limit, onSnapshot, serverTimestamp, collection, doc, db }
