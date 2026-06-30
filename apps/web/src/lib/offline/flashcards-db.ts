// IndexedDB pour les flashcards hors-ligne
// Deux stores : 'flashcards' (cache serveur) + 'pending_reviews' (à synchroniser)

const DB_NAME    = 'kelassi-offline'
const DB_VERSION = 1
const STORE_CARDS   = 'flashcards'
const STORE_PENDING = 'pending_reviews'

export interface OfflineFlashcard {
  id:          string
  front:       string
  back:        string
  ease_factor: number
  interval:    number
  reps:        number
  next_review: string
  cached_at:   number
  documents:   { title: string; subjects: { name: string } | null } | null
}

export interface PendingReview {
  flashcard_id: string
  quality:      number
  reviewed_at:  string
}

let _db: IDBDatabase | null = null

function openDB(): Promise<IDBDatabase> {
  if (_db) return Promise.resolve(_db)
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains(STORE_CARDS))
        db.createObjectStore(STORE_CARDS, { keyPath: 'id' })
      if (!db.objectStoreNames.contains(STORE_PENDING))
        db.createObjectStore(STORE_PENDING, { keyPath: 'flashcard_id' })
    }
    req.onsuccess = (e) => { _db = (e.target as IDBOpenDBRequest).result; resolve(_db) }
    req.onerror   = ()  => reject(req.error)
  })
}

function idbReq<T>(store: string, mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  return openDB().then(
    (db) => new Promise((resolve, reject) => {
      const req = fn(db.transaction(store, mode).objectStore(store))
      req.onsuccess = () => resolve(req.result)
      req.onerror   = () => reject(req.error)
    })
  )
}

export const flashcardsDB = {
  /** Sauvegarde un batch de cartes (cache du serveur) */
  saveCards: async (cards: OfflineFlashcard[]): Promise<void> => {
    const db  = await openDB()
    const now = Date.now()
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_CARDS, 'readwrite')
      const s  = tx.objectStore(STORE_CARDS)
      for (const card of cards) s.put({ ...card, cached_at: now })
      tx.oncomplete = () => resolve()
      tx.onerror    = () => reject(tx.error)
    })
  },

  /** Retourne toutes les cartes dont next_review ≤ maintenant */
  getDueCards: async (): Promise<OfflineFlashcard[]> => {
    const all  = await idbReq<OfflineFlashcard[]>(STORE_CARDS, 'readonly', (s) => s.getAll() as IDBRequest<OfflineFlashcard[]>)
    const now  = new Date().toISOString()
    return all.filter((c) => c.next_review <= now)
  },

  /** Met à jour une carte localement après révision (calcul SM2 côté client) */
  updateCard: async (id: string, updates: Partial<OfflineFlashcard>): Promise<void> => {
    const db = await openDB()
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_CARDS, 'readwrite')
      const s  = tx.objectStore(STORE_CARDS)
      const getReq = s.get(id)
      getReq.onsuccess = () => {
        const card = getReq.result as OfflineFlashcard | undefined
        if (card) s.put({ ...card, ...updates })
        tx.oncomplete = () => resolve()
        tx.onerror    = () => reject(tx.error)
      }
      getReq.onerror = () => reject(getReq.error)
    })
  },

  /** Enregistre une révision en attente de synchro */
  savePendingReview: (review: PendingReview): Promise<unknown> =>
    idbReq(STORE_PENDING, 'readwrite', (s) => s.put(review)),

  /** Retourne toutes les révisions en attente */
  getPendingReviews: (): Promise<PendingReview[]> =>
    idbReq<PendingReview[]>(STORE_PENDING, 'readonly', (s) => s.getAll() as IDBRequest<PendingReview[]>),

  /** Supprime une révision après synchro réussie */
  removePendingReview: (flashcardId: string): Promise<unknown> =>
    idbReq(STORE_PENDING, 'readwrite', (s) => s.delete(flashcardId)),
}
