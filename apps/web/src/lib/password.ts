/**
 * Règles du mot de passe à l'inscription. Elles doublent le réglage serveur de
 * Supabase Auth (« Lowercase, uppercase letters and digits », 8 caractères
 * minimum) : seul ce dernier fait foi, ce contrôle-ci guide l'élève.
 * Même liste côté app : apps/mobile/src/lib/password.ts.
 */
export const PASSWORD_RULES: { label: string; test: (p: string) => boolean }[] = [
  { label: '8 caractères minimum', test: (p) => p.length >= 8 },
  { label: 'Une minuscule', test: (p) => /[a-z]/.test(p) },
  { label: 'Une majuscule', test: (p) => /[A-Z]/.test(p) },
  { label: 'Un chiffre', test: (p) => /\d/.test(p) },
]

export const isPasswordValid = (p: string) => PASSWORD_RULES.every((r) => r.test(p))
