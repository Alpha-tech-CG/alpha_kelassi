import { redis, rawRedis } from './redis'
import { checkLimit, type Counter } from './rate-limit-core'

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

/**
 * Variante « fail-closed » pour les routes sensibles (connexion, OTP,
 * inscription, retrait) : en production, si Redis n'est pas configuré ou ne
 * répond pas, la requête est REFUSÉE — sinon une panne Upstash suffirait à
 * lever toute protection contre la force brute. En local, sans Redis, on laisse
 * passer pour ne pas bloquer le développement.
 */
export async function rateLimitStrict(key: string, limit: number, windowSec: number): Promise<boolean> {
  return checkLimit(rawRedis() as Counter | null, key, limit, windowSec, process.env.NODE_ENV === 'production')
}

/** Réponse 429 standardisée. */
export function tooMany() {
  return Response.json(
    { error: { code: 'RATE_LIMITED', message: 'Trop de requêtes. Réessaie dans un moment.' } },
    { status: 429 },
  )
}
