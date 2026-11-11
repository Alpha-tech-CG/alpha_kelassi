/**
 * Verrouillage biométrique/PIN après inactivité.
 *
 * L'app gère des paiements (FeexPay) et un espace tuteur/enseignant : on ne
 * peut pas laisser la session Supabase utilisable indéfiniment simplement
 * parce que le token n'a pas expiré. Ce module mémorise l'instant où l'app
 * passe en arrière-plan (persisté dans expo-secure-store pour survivre à un
 * kill du process JS, pas seulement en mémoire) et expose une fonction qui
 * dit si un déverrouillage est requis au retour au premier plan.
 *
 * Tout est défensif : si expo-secure-store échoue pour une raison quelconque
 * (device sans Keystore correctement configuré, etc.), on ne bloque jamais
 * l'utilisateur — on considère simplement qu'aucun verrouillage n'est requis.
 */
import { AppState, AppStateStatus } from 'react-native'
import * as SecureStore from 'expo-secure-store'

const BACKGROUND_TS_KEY = 'app_lock_background_ts'

/** Seuil au-delà duquel un retour au premier plan exige un déverrouillage. */
export const LOCK_TIMEOUT_MS = 5 * 60 * 1000

let appStateSub: { remove: () => void } | null = null
let currentState: AppStateStatus = AppState.currentState

async function persistBackgroundTimestamp(ts: number | null): Promise<void> {
  try {
    if (ts === null) {
      await SecureStore.deleteItemAsync(BACKGROUND_TS_KEY)
    } else {
      await SecureStore.setItemAsync(BACKGROUND_TS_KEY, String(ts))
    }
  } catch {
    // Best-effort : si le stockage sécurisé n'est pas disponible, on ne
    // fait pas planter l'app — le pire cas est un verrouillage non déclenché.
  }
}

async function readBackgroundTimestamp(): Promise<number | null> {
  try {
    const raw = await SecureStore.getItemAsync(BACKGROUND_TS_KEY)
    if (!raw) return null
    const n = Number(raw)
    return Number.isFinite(n) ? n : null
  } catch {
    return null
  }
}

function handleAppStateChange(next: AppStateStatus) {
  const wasActive = currentState === 'active'
  const goingBackground = next === 'background' || next === 'inactive'

  if (wasActive && goingBackground) {
    void persistBackgroundTimestamp(Date.now())
  }

  currentState = next
}

/**
 * Démarre l'écoute d'AppState. Idempotent — un second appel est un no-op.
 * À appeler une seule fois, typiquement dans le layout racine.
 */
export function startAppLockTracking(): void {
  if (appStateSub) return
  try {
    currentState = AppState.currentState
    appStateSub = AppState.addEventListener('change', handleAppStateChange)
  } catch {
    // Défensif : ne doit jamais empêcher l'app de démarrer.
  }
}

/** Arrête l'écoute (utile pour les tests / démontage propre, rarement nécessaire). */
export function stopAppLockTracking(): void {
  try {
    appStateSub?.remove()
  } catch {
    // no-op
  } finally {
    appStateSub = null
  }
}

/**
 * Retourne true si l'app était en arrière-plan depuis plus de LOCK_TIMEOUT_MS
 * et qu'un déverrouillage doit donc être exigé. Ne lève jamais — en cas de
 * doute (erreur de lecture), retourne false pour ne pas bloquer l'utilisateur.
 */
export async function shouldRequireUnlock(): Promise<boolean> {
  try {
    const ts = await readBackgroundTimestamp()
    if (ts === null) return false
    return Date.now() - ts >= LOCK_TIMEOUT_MS
  } catch {
    return false
  }
}

/** À appeler une fois le déverrouillage réussi (ou explicitement passé). */
export async function clearAppLock(): Promise<void> {
  await persistBackgroundTimestamp(null)
}
