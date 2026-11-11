/**
 * Règles du mot de passe (inscription, nouveau mot de passe). Elles doublent le
 * réglage serveur de Supabase Auth (« Password requirements » : minuscule,
 * majuscule, chiffre ET symbole, 8 caractères minimum ; constaté le
 * 27/10/2026) : seul ce dernier fait foi, ce contrôle-ci guide l'élève.
 * Même liste côté web : apps/web/src/lib/password.ts.
 */

/** Symboles acceptés par Supabase Auth — un é ou une espace ne comptent pas. */
export const PASSWORD_SYMBOLS = '!@#$%^&*()_+-=[]{};\'\\:"|<>?,./`~'

export const PASSWORD_RULES: { label: string; test: (p: string) => boolean }[] = [
  { label: '8 caractères minimum', test: (p) => p.length >= 8 },
  { label: 'Une minuscule', test: (p) => /[a-z]/.test(p) },
  { label: 'Une majuscule', test: (p) => /[A-Z]/.test(p) },
  { label: 'Un chiffre', test: (p) => /\d/.test(p) },
  { label: 'Un symbole (! @ # …)', test: (p) => [...p].some((c) => PASSWORD_SYMBOLS.includes(c)) },
]

export const isPasswordValid = (p: string) => PASSWORD_RULES.every((r) => r.test(p))

/** Message unique quand le mot de passe ne respecte pas les règles. */
export const WEAK_PASSWORD_MESSAGE =
  'Mot de passe trop faible : 8 caractères minimum, avec une minuscule, une majuscule, un chiffre et un symbole (! @ # …).'
