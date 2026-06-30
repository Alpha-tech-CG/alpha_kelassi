/**
 * Remplacé par Firebase Admin SDK.
 * Ce fichier expose un helper pour récupérer l'utilisateur courant côté serveur
 * via le cookie de session Firebase.
 */
import { cookies } from 'next/headers'
import { adminAuth } from '@/lib/firebase/admin'

export async function getServerUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get('firebase-token')?.value
  if (!token) return null
  try {
    const decoded = await adminAuth.verifyIdToken(token)
    return { id: decoded.uid, ...decoded }
  } catch {
    return null
  }
}

// Alias pour la compatibilité avec l'ancien code
export const createClient = () => {
  throw new Error('createClient Supabase supprimé — utilise getServerUser() ou le Firebase Admin SDK directement')
}
