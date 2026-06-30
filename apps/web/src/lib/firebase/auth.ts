'use client'

import {
  signInWithPhoneNumber,
  RecaptchaVerifier,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
  type ConfirmationResult,
} from 'firebase/auth'
import { auth } from './client'

export type { User, ConfirmationResult }

/**
 * Initialise le reCAPTCHA invisible et envoie un OTP par SMS.
 * containerOrId : ID du div DOM qui recevra le widget invisible.
 */
export async function sendPhoneOtp(
  phone: string,
  containerOrId: string
): Promise<ConfirmationResult> {
  const verifier = new RecaptchaVerifier(auth, containerOrId, { size: 'invisible' })
  const formatted = phone.startsWith('+') ? phone : `+242${phone}`
  return signInWithPhoneNumber(auth, formatted, verifier)
}

/** Vérifie l'OTP et retourne le token Firebase */
export async function verifyPhoneOtp(
  confirmation: ConfirmationResult,
  otp: string
): Promise<string> {
  const result = await confirmation.confirm(otp)
  return result.user.getIdToken()
}

export async function signOut(): Promise<void> {
  await firebaseSignOut(auth)
}

/** Retourne l'ID token courant (refresh auto si expiré) */
export async function getIdToken(): Promise<string | null> {
  const user = auth.currentUser
  if (!user) return null
  return user.getIdToken()
}

/** Abonne un callback aux changements d'état d'auth */
export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback)
}
