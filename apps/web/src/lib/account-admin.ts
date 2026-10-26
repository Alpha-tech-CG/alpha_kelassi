import { randomInt } from 'node:crypto'

/**
 * Règles des actions de la console sur les comptes (création, aide à la
 * connexion, bannissement). Sans accès à la base : testées dans
 * test/account-admin.test.ts, appliquées par les routes /api/admin/users.
 */

/** Durée de bannissement transmise à Supabase Auth : ~100 ans, levée par « Débannir ». */
export const BAN_DURATION = '876000h'

// Sans caractères ambigus à la lecture ou dictés au téléphone (0/O, 1/l/I).
const LOWER = 'abcdefghijkmnpqrstuvwxyz'
const UPPER = 'ABCDEFGHJKLMNPQRSTUVWXYZ'
const DIGITS = '23456789'

const pick = (set: string) => set[randomInt(set.length)]!

/**
 * Mot de passe provisoire à transmettre à l'élève : 10 caractères, au moins
 * une minuscule, une majuscule et un chiffre (règles de Supabase Auth, voir
 * lib/password.ts), tirés au hasard cryptographique.
 */
export function generateTempPassword(): string {
  const all = LOWER + UPPER + DIGITS
  const chars = [pick(LOWER), pick(UPPER), pick(DIGITS), ...Array.from({ length: 7 }, () => pick(all))]
  // Mélange de Fisher-Yates, pour que les trois premiers ne soient pas prévisibles.
  for (let i = chars.length - 1; i > 0; i--) {
    const j = randomInt(i + 1)
    ;[chars[i], chars[j]] = [chars[j]!, chars[i]!]
  }
  // Une minuscule, une majuscule et un chiffre garantis : conforme par construction.
  return chars.join('')
}

/**
 * Peut-on bannir ce compte ? Jamais soi-même, jamais un administrateur (lui
 * retirer d'abord son rôle, action distincte et visible).
 */
export function banRefusal(target: { id: string; role: string | null }, adminId: string): string | null {
  if (target.id === adminId) return 'Tu ne peux pas bannir ton propre compte.'
  if (target.role === 'admin') return 'Impossible de bannir un administrateur : retire-lui d’abord ce rôle.'
  return null
}

export interface AuthUserLike {
  email_confirmed_at?: string | null
  phone_confirmed_at?: string | null
  banned_until?: string | null
  last_sign_in_at?: string | null
}

export interface AccountState {
  banned: boolean
  banned_until: string | null
  email_confirmed: boolean
  last_sign_in_at: string | null
}

/** État d'un compte tel que Supabase Auth l'applique, à un instant donné. */
export function accountState(u: AuthUserLike | undefined, now: Date = new Date()): AccountState {
  const bannedUntil = u?.banned_until ?? null
  return {
    banned: !!bannedUntil && new Date(bannedUntil) > now,
    banned_until: bannedUntil,
    email_confirmed: !!(u?.email_confirmed_at || u?.phone_confirmed_at),
    last_sign_in_at: u?.last_sign_in_at ?? null,
  }
}

/** Inscription inachevée : e-mail non confirmé ou parcours jamais choisi. */
export function isSignupIncomplete(state: AccountState, onboardingCompleted: boolean | null): boolean {
  return !state.email_confirmed || !onboardingCompleted
}
