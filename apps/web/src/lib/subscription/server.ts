import { NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import {
  canAccessFeature, effectivePlan, lockedFeatureInfo, periodKeyFor, quotaMessage, usageLimit,
  type FeatureKey, type QuotaMessage, type SubscriptionPlan, type UsageType,
} from '@alpha-kelassi/types'
import { supabaseAdmin } from '@/lib/admin-guard'

/**
 * Droits et quotas côté serveur — seule couche habilitée à décider.
 *
 * Le niveau effectif vient de la base (`user_plan_level`, migration 057), qui
 * lit les abonnements en cours : ni le client ni un nom de formule ne peuvent
 * l'influencer. Tant que 057 n'est pas appliquée, on retombe sur l'ancien
 * champ `users.plan`, normalisé (premium → pro), pour ne rien casser pendant
 * la transition.
 */

const LEVEL_TO_PLAN: readonly SubscriptionPlan[] = ['free', 'starter', 'pro', 'pro_max']

export interface Entitlements {
  userId: string
  plan: SubscriptionPlan
  level: number
  role: string
  isAdmin: boolean
  /** Formule enregistrée (cache d'affichage), distincte de la formule effective. */
  storedPlan: string
  expiresAt: string | null
  can: (feature: FeatureKey) => boolean
}

export async function getEntitlements(userId: string): Promise<Entitlements> {
  const [{ data: profile }, levelRes] = await Promise.all([
    supabaseAdmin.from('users').select('*').eq('id', userId).maybeSingle(),
    supabaseAdmin.rpc('user_plan_level', { p_user_id: userId }),
  ])
  const row = (profile ?? {}) as { plan?: string; role?: string; plan_expires_at?: string | null }
  const role = row.role ?? 'student'

  const plan: SubscriptionPlan = !levelRes.error && typeof levelRes.data === 'number'
    ? LEVEL_TO_PLAN[levelRes.data] ?? 'free'
    : effectivePlan({ plan: row.plan, role, planExpiresAt: row.plan_expires_at ?? null })

  return {
    userId,
    plan,
    level: LEVEL_TO_PLAN.indexOf(plan),
    role,
    isAdmin: role === 'admin',
    storedPlan: row.plan ?? 'free',
    expiresAt: row.plan_expires_at ?? null,
    can: (feature) => canAccessFeature(plan, feature),
  }
}

/** Réponse standard d'une fonctionnalité verrouillée : jamais une erreur technique. */
export function planRequired(feature: FeatureKey) {
  const info = lockedFeatureInfo(feature)
  return NextResponse.json({
    error: {
      code: 'PLAN_REQUIRED',
      message: `${info.title} ${info.body}`,
      feature,
      required_plan: info.requiredPlan,
      title: info.title,
      body: info.body,
      price: info.price,
    },
  }, { status: 403 })
}

/** Traduit une erreur `PLAN_REQUIRED:<feature>` levée par la base. */
export function planRequiredFromDbError(message: string | undefined) {
  const match = /PLAN_REQUIRED:([a-z_]+)/.exec(message ?? '')
  if (!match) return null
  const feature = match[1] as FeatureKey
  return planRequired(feature)
}

/* ── Quotas ────────────────────────────────────────────────────────────────── */

export interface UsageResult {
  allowed: boolean
  duplicate: boolean
  used: number
  bonus: number
  limit: number | null
  remaining: number | null
  period: string
  message: QuotaMessage
}

export class UsageUnavailableError extends Error {}

function toResult(type: UsageType, plan: SubscriptionPlan, period: string, raw: { allowed?: boolean; duplicate?: boolean; used?: number; bonus?: number }): UsageResult {
  const limit = usageLimit(type, plan)
  const used = Number(raw.used ?? 0)
  const bonus = Number(raw.bonus ?? 0)
  return {
    allowed: raw.allowed !== false,
    duplicate: raw.duplicate === true,
    used,
    bonus,
    limit,
    remaining: limit === null ? null : Math.max(0, limit + bonus - used),
    period,
    message: quotaMessage(type, plan, used, bonus),
  }
}

/**
 * Clé d'idempotence d'une requête consommatrice : en-tête `Idempotency-Key`
 * (l'application la réutilise lors d'une nouvelle tentative), sinon une clé
 * dérivée fournie par l'appelant, sinon une clé neuve (pas de dédoublonnage).
 */
export function requestKeyOf(req: Request, derived?: string): string {
  const header = req.headers.get('idempotency-key')
  if (header && /^[A-Za-z0-9_.:-]{8,120}$/.test(header)) return header
  return derived ?? randomUUID()
}

/** Consomme une unité de quota de façon atomique et idempotente. */
export async function consumeUsage(ent: Entitlements, type: UsageType, requestKey: string): Promise<UsageResult> {
  const period = periodKeyFor(type)
  const { data, error } = await supabaseAdmin.rpc('consume_usage', {
    p_user_id: ent.userId,
    p_type: type,
    p_period_key: period,
    p_limit: usageLimit(type, ent.plan),
    p_request_key: requestKey,
  })
  if (error) throw new UsageUnavailableError(error.message)
  return toResult(type, ent.plan, period, (data ?? {}) as Record<string, never>)
}

/** Rend l'unité consommée par une requête qui a échoué. Sans effet si déjà rendue. */
export async function refundUsage(userId: string, type: UsageType, requestKey: string): Promise<void> {
  const { error } = await supabaseAdmin.rpc('refund_usage', { p_user_id: userId, p_type: type, p_request_key: requestKey })
  if (error) console.error(`[usage] remboursement impossible (${type})`, error.message)
}

/** État du quota sans rien consommer, pour l'affichage. */
export async function readUsage(ent: Entitlements, type: UsageType): Promise<UsageResult> {
  const period = periodKeyFor(type)
  const { data } = await supabaseAdmin.from('usage_counters')
    .select('used, bonus')
    .eq('user_id', ent.userId).eq('usage_type', type).eq('period_key', period)
    .maybeSingle()
  const row = (data ?? { used: 0, bonus: 0 }) as { used: number; bonus: number }
  const limit = usageLimit(type, ent.plan)
  return toResult(type, ent.plan, period, {
    used: row.used, bonus: row.bonus,
    allowed: limit === null || row.used < limit + row.bonus,
  })
}

export function quotaExceeded(type: UsageType, usage: UsageResult) {
  return NextResponse.json({
    error: {
      code: 'QUOTA_EXCEEDED',
      usage_type: type,
      message: `${usage.message.summary} ${usage.message.detail}`.trim(),
      used: usage.used,
      limit: usage.limit === null ? null : usage.limit + usage.bonus,
      remaining: 0,
    },
  }, { status: 429 })
}
