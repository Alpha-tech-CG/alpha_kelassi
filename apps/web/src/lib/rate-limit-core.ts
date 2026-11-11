/**
 * Décompte par fenêtre fixe, indépendant du client Redis (testable seul).
 * Voir rate-limit.ts pour les deux variantes branchées sur Upstash.
 */
export type Counter = {
  incr(key: string): Promise<number>
  expire(key: string, seconds: number): Promise<unknown>
}

/**
 * Renvoie true si la requête passe. Sans compteur (Redis non configuré) ou si
 * une commande échoue, `failClosed` décide : true → refus, false → passage.
 */
export async function checkLimit(
  counter: Counter | null,
  key: string,
  limit: number,
  windowSec: number,
  failClosed: boolean,
): Promise<boolean> {
  if (!counter) return !failClosed
  try {
    const k = `rl:${key}`
    const n = await counter.incr(k)
    if (n === 1) await counter.expire(k, windowSec)
    return n <= limit
  } catch (e) {
    console.error('[rate-limit] Redis indisponible', (e as Error)?.message)
    return !failClosed
  }
}
