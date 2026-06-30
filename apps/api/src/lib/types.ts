import type { Firestore } from 'firebase-admin/firestore'
import type { COLLECTIONS } from './firebase.js'

export type AppVariables = {
  userId: string
  db: Firestore
  collections: typeof COLLECTIONS
}
