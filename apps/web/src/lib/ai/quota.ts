import { redis } from '@/lib/redis'

const FREE_DAILY_LIMIT    = 5
const PREMIUM_DAILY_LIMIT = 200

function todayStr(): string {
  return new Date().toISOString().slice(0, 10)
}

export function quotaKey(userId: string): string {
  return `quota:chat:${userId}:${todayStr()}`
}

function bonusKey(userId: string): string {
  return `quota:bonus:${userId}:${todayStr()}`
}

function ttlToMidnight(): number {
  const now = new Date()
  const midnight = new Date(now)
  midnight.setUTCHours(24, 0, 0, 0)
  return Math.floor((midnight.getTime() - now.getTime()) / 1000) + 3600
}

/** Crédite un bonus de questions pour la journée en cours (parrainage, promo…) */
export async function addDailyBonus(userId: string, amount: number): Promise<void> {
  const key = bonusKey(userId)
  await redis.incrby(key, amount)
  await redis.expire(key, ttlToMidnight())
}

async function getEffectiveLimit(userId: string, plan: string): Promise<number> {
  const base  = plan === 'premium' ? PREMIUM_DAILY_LIMIT : FREE_DAILY_LIMIT
  const bonus = parseInt((await redis.get<string>(bonusKey(userId))) ?? '0', 10)
  return base + bonus
}

export async function checkAndIncrementQuota(
  userId: string,
  plan: string,
  mode: 'socratic' | 'solution' = 'socratic'
): Promise<{ allowed: boolean; remaining: number; used: number; creditsCost: number }> {
  const limit = await getEffectiveLimit(userId, plan)
  const key   = quotaKey(userId)
  const ttl   = ttlToMidnight()

  // ── Mode Solution Directe (free) : consomme TOUS les crédits restants ──
  if (mode === 'solution' && plan !== 'premium') {
    const currentUsed = parseInt((await redis.get<string>(key)) ?? '0', 10)
    const remaining   = Math.max(0, limit - currentUsed)
    if (remaining <= 0) {
      return { allowed: false, remaining: 0, used: currentUsed, creditsCost: 0 }
    }
    // Atomic: SET directement à la limite (pire cas race → 1 dépassement, acceptable)
    await redis.set(key, limit, { ex: ttl })
    return { allowed: true, remaining: 0, used: limit, creditsCost: remaining }
  }

  // ── Mode normal (socratic, ou solution premium) : 1 crédit ──
  const used = await redis.incr(key)
  if (used === 1) await redis.expire(key, ttl)

  if (used > limit) {
    await redis.decr(key)
    return { allowed: false, remaining: 0, used: limit, creditsCost: 1 }
  }

  return { allowed: true, remaining: limit - used, used, creditsCost: 1 }
}

export async function getQuotaStatus(userId: string, plan: string) {
  const limit = await getEffectiveLimit(userId, plan)
  const key   = quotaKey(userId)
  const used  = parseInt((await redis.get<string>(key)) ?? '0', 10)
  return { used, remaining: Math.max(0, limit - used), limit }
}
