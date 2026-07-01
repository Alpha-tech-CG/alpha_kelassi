/**
 * Firebase Client SDK (navigateur uniquement).
 *
 * Initialisation LAZY via Proxy : Firebase n'est initialisé qu'au premier
 * accès effectif (auth.currentUser, db.collection(...), etc.), jamais au
 * chargement du module. Cela évite le crash "invalid-api-key" pendant le
 * prerendering Next.js où les NEXT_PUBLIC_* vars peuvent être absentes.
 */
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'
import { getStorage, type FirebaseStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey:            process.env['NEXT_PUBLIC_FIREBASE_API_KEY']            ?? '',
  authDomain:        process.env['NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN']        ?? '',
  projectId:         process.env['NEXT_PUBLIC_FIREBASE_PROJECT_ID']         ?? '',
  storageBucket:     process.env['NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET']     ?? '',
  messagingSenderId: process.env['NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'] ?? '',
  appId:             process.env['NEXT_PUBLIC_FIREBASE_APP_ID']              ?? '',
}

let _app: FirebaseApp | undefined

function getApp(): FirebaseApp {
  if (_app) return _app
  if (getApps().length > 0) {
    _app = getApps()[0]!
    return _app
  }
  _app = initializeApp(firebaseConfig)
  return _app
}

function makeLazy<T extends object>(factory: () => T): T {
  return new Proxy({} as T, {
    get(_, prop: string | symbol) {
      const instance = factory()
      const val = (instance as Record<string | symbol, unknown>)[prop]
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return typeof val === 'function' ? (val as any).bind(instance) : val
    },
  })
}

export const auth: Auth = makeLazy(() => getAuth(getApp()))
export const db: Firestore = makeLazy(() => getFirestore(getApp()))
export const storage: FirebaseStorage = makeLazy(() => getStorage(getApp()))
export default getApp
