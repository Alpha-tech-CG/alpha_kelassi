import { AI_DAILY_LIMITS, dayPeriodKey, normalizePlan } from '@alpha-kelassi/types'
import { redis } from '@/lib/redis'

/**
 * Ancien compteur Redis des questions IA, conservé UNIQUEMENT comme repli
 * tant que la migration 057 (compteurs en base, idempotents) n'est pas
 * appliquée. Les limites sont celles des nouvelles formules.
 *
 * Défauts connus du repli : Redis « fail-open » (panne = pas de limite) et
 * aucune protection contre le double comptage d'une nouvelle tentative —
 * d'où la bascule sur `consume_usage` dès que la base le permet.
 */

function quotaKey(userId: string): string {
  return `quota:chat:${userId}:${dayPeriodKey()}`
}

export async function checkAndIncrementQuota(
  userId: string,
  plan: string
): Promise<{ allowed: boolean; remaining: number; used: number; limit: number }> {
  const limit = AI_DAILY_LIMITS[normalizePlan(plan)]
  const key   = quotaKey(userId)

  const used = await redis.incr(key)
  if (used === 1) await redis.expire(key, 26 * 3600)

  if (used > limit) {
    await redis.decr(key)
    return { allowed: false, remaining: 0, used: limit, limit }
  }
  return { allowed: true, remaining: limit - used, used, limit }
}

export async function refundLegacyQuota(userId: string): Promise<void> {
  await redis.decr(quotaKey(userId))
}
