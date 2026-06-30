import type { Context, Next } from 'hono'
import type { AppVariables } from '../lib/types.js'
import { adminAuth, adminDb, COLLECTIONS } from '../lib/firebase.js'

export async function authMiddleware(c: Context<{ Variables: AppVariables }>, next: Next) {
  const authorization = c.req.header('Authorization')
  if (!authorization?.startsWith('Bearer ')) {
    return c.json({ error: { code: 'UNAUTHORIZED', message: 'Token manquant' } }, 401)
  }

  const token = authorization.slice(7)

  let decodedToken: Awaited<ReturnType<typeof adminAuth.verifyIdToken>>
  try {
    decodedToken = await adminAuth.verifyIdToken(token)
  } catch {
    return c.json({ error: { code: 'UNAUTHORIZED', message: 'Token invalide ou expiré' } }, 401)
  }

  const userId = decodedToken.uid

  // Injecte l'UID et le client Firestore dans le contexte Hono
  c.set('userId', userId)
  c.set('db', adminDb)
  c.set('collections', COLLECTIONS)

  await next()
}

/**
 * Vérifie que l'utilisateur a le rôle admin dans Firestore.
 * À utiliser en chaîne après authMiddleware.
 */
export async function adminMiddleware(c: Context<{ Variables: AppVariables }>, next: Next) {
  const userId = c.get('userId') as string
  const db     = c.get('db') as typeof adminDb

  const userSnap = await db.collection(COLLECTIONS.USERS).doc(userId).get()
  if (!userSnap.exists || userSnap.data()?.role !== 'admin') {
    return c.json({ error: { code: 'FORBIDDEN', message: 'Accès admin requis' } }, 403)
  }

  await next()
}
