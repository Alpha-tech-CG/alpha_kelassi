// Logique métier partagée du système de correction par tuteurs (BLOC B).
// Toutes les fonctions ci-dessous s'exécutent côté serveur avec le service role
// et scopent leurs écritures par des identifiants validés en amont (JWT / DB).
import { supabaseAdmin as supabase } from './supabase.js'

/** Récompense en FCFA selon la tentative validée (cf. B.2 du cahier des charges). */
export const REWARD_FCFA = { FIRST: 250, SECOND: 150, FAIL: 0 } as const

/** Délai d'acceptation d'une mission (dispatch Deliveroo, B.3). */
export const ACCEPT_TIMEOUT_MS = 5 * 60 * 1000       // 5 min
/** Délai de rendu après acceptation (B.3). */
export const DUE_MS            = 90 * 60 * 1000       // 1h30
/** Nombre maximal de tentatives tuteur avant relais IA (B.2). */
export const MAX_ATTEMPTS = 2

export function rewardForAttempt(attempt: number): number {
  if (attempt <= 1) return REWARD_FCFA.FIRST
  if (attempt === 2) return REWARD_FCFA.SECOND
  return REWARD_FCFA.FAIL
}

/**
 * Crédite le portefeuille du tuteur de façon atomique et journalise la
 * transaction. Idempotent par mission : ne crédite pas deux fois la même mission.
 */
export async function creditTutor(tutorId: string, missionId: string, amount: number): Promise<void> {
  if (amount <= 0) return
  const { data: existing } = await supabase
    .from('tutor_wallet_transactions')
    .select('id')
    .eq('mission_id', missionId)
    .eq('type', 'credit')
    .maybeSingle()
  if (existing) return  // déjà crédité

  await supabase.from('tutor_wallet_transactions').insert({
    tutor_id: tutorId, mission_id: missionId, amount_fcfa: amount, type: 'credit', status: 'completed',
  })
  await supabase.rpc('increment_tutor_wallet', { p_tutor_id: tutorId, p_amount: amount })
}

/**
 * Recalcule le score du tuteur : (moyenne des notes × 0.6) + (taux de
 * validation en 1re tentative × 0.4), le tout ramené sur 5.
 */
export async function recomputeTutorScore(tutorId: string): Promise<number> {
  const [{ data: ratings }, { data: missions }] = await Promise.all([
    supabase.from('tutor_ratings').select('clarity, quality').eq('tutor_id', tutorId),
    supabase.from('correction_missions').select('id, attempts, status').eq('tutor_id', tutorId).eq('status', 'delivered'),
  ])

  const rated = ratings ?? []
  const avgRating = rated.length
    ? rated.reduce((s, r) => s + (r.clarity + r.quality) / 2, 0) / rated.length
    : 0  // /5

  const delivered = missions ?? []
  const firstTry = delivered.filter((m) => m.attempts <= 1).length
  const firstTryRate = delivered.length ? firstTry / delivered.length : 0  // 0..1

  const score = Math.round((avgRating * 0.6 + firstTryRate * 5 * 0.4) * 100) / 100
  await supabase.from('tutor_profiles').update({ score }).eq('user_id', tutorId)
  return score
}

/** Génère une URL signée (par défaut 15 min) pour un fichier d'un bucket privé. */
export async function signedUrl(bucket: string, path: string, expiresIn = 900): Promise<string | null> {
  const { data } = await supabase.storage.from(bucket).createSignedUrl(path, expiresIn)
  return data?.signedUrl ?? null
}
