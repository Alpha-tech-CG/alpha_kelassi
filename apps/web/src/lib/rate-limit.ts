import { redis } from './redis'

/**
 * Limiteur de débit simple par fenêtre fixe (Upstash Redis).
 * Fail-open : si Redis est indisponible, `incr` renvoie 1 (cf. redis.ts) → on
 * autorise plutôt que de casser le service. Renvoie true si la requête passe.
 */
export async function rateLimit(key: string, limit: number, windowSec: number): Promise<boolean> {
  const k = `rl:${key}`
  const n = (await redis.incr(k)) as number
  if (n === 1) await redis.expire(k, windowSec)
  return n <= limit
}

/** Réponse 429 standardisée. */
export function tooMany() {
  return Response.json(
    { error: { code: 'RATE_LIMITED', message: 'Trop de requêtes. Réessaie dans un moment.' } },
    { status: 429 },
  )
}
