/**
 * Firebase Admin SDK côté serveur Next.js (Server Components, Route Handlers).
 *
 * Initialisation LAZY via Proxy : Firebase Admin n'est initialisé qu'au
 * premier accès effectif (ex: adminDb.collection(...)), jamais au chargement
 * du module. Cela évite le crash "project_id missing" pendant le build Vercel
 * où les env vars ne sont pas disponibles lors de la phase "Collecting page data".
 */
import { initializeApp, cert, getApps, type App } from 'firebase-admin/app'
import { getAuth, type Auth } from 'firebase-admin/auth'
import { getFirestore, type Firestore } from 'firebase-admin/firestore'
import { getStorage, type Storage } from 'firebase-admin/storage'

let _app: App | undefined

function getAdminApp(): App {
  if (_app) return _app
  if (getApps().length > 0) {
    _app = getApps()[0]!
    return _app
  }
  const rawKey = process.env['FIREBASE_PRIVATE_KEY'] ?? ''
  const privateKey = rawKey.replace(/\n/g, '\n')
  _app = initializeApp({
    credential: cert({
      projectId:   process.env['FIREBASE_PROJECT_ID']!,
      clientEmail: process.env['FIREBASE_CLIENT_EMAIL']!,
      privateKey,
    }),
    storageBucket: process.env['FIREBASE_STORAGE_BUCKET'] ?? '',
  })
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

export const adminAuth: Auth = makeLazy(() => getAuth(getAdminApp()))
export const adminDb: Firestore = makeLazy(() => getFirestore(getAdminApp()))
export const adminStorage: Storage = makeLazy(() => getStorage(getAdminApp()))
