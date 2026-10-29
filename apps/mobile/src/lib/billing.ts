import { supabase } from './supabase'
import { API_URL } from './config'

/**
 * Formules et droits côté application. Les règles, les prix et les limites
 * viennent du serveur (/api/billing/plans et /api/billing/me) : l'application
 * n'en décide rien, elle affiche et explique.
 */

export type PlanId = 'free' | 'starter' | 'pro' | 'pro_max'

export const PLAN_LABEL: Record<PlanId, string> = {
  free: 'Gratuit',
  starter: 'Starter',
  pro: 'Pro',
  pro_max: 'Pro Max',
}

export function planLabel(plan: string | null | undefined): string {
  if (plan === 'premium') return PLAN_LABEL.pro
  return PLAN_LABEL[(plan as PlanId) ?? 'free'] ?? PLAN_LABEL.free
}

export interface LockedInfo {
  feature: string
  requiredPlan: PlanId
  title: string
  body: string
  price: string
}

export interface PlanError {
  code: 'PLAN_REQUIRED' | 'QUOTA_EXCEEDED' | 'APP_UPDATE_REQUIRED'
  message: string
  info: LockedInfo | null
}

/** Reconnaît une réponse « formule requise », « quota atteint » ou « mise à jour requise ». */
export function planErrorOf(json: unknown): PlanError | null {
  const err = (json as { error?: Record<string, unknown> } | null)?.error
  if (!err || typeof err !== 'object') return null
  const code = err['code']
  if (code === 'PLAN_REQUIRED') {
    return {
      code,
      message: String(err['message'] ?? ''),
      info: {
        feature: String(err['feature'] ?? ''),
        requiredPlan: (err['required_plan'] as PlanId) ?? 'starter',
        title: String(err['title'] ?? ''),
        body: String(err['body'] ?? ''),
        price: String(err['price'] ?? ''),
      },
    }
  }
  if (code === 'QUOTA_EXCEEDED' || code === 'APP_UPDATE_REQUIRED') {
    return { code, message: String(err['message'] ?? ''), info: null }
  }
  return null
}

export async function accessToken(): Promise<string | undefined> {
  const { data } = await supabase.auth.getSession()
  if (data.session?.access_token) return data.session.access_token
  const { data: refreshed } = await supabase.auth.refreshSession().catch(() => ({ data: { session: null } }))
  return refreshed.session?.access_token
}

/** Appel authentifié à l'API ; ne lève jamais (réseau coupé → ok: false, status 0). */
export async function api<T = any>(path: string, init: RequestInit = {}): Promise<{ ok: boolean; status: number; json: { data?: T; error?: any } & Record<string, any> }> {
  try {
    const token = await accessToken()
    const res = await fetch(`${API_URL}${path}`, {
      ...init,
      headers: {
        ...(init.body ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(init.headers as Record<string, string> | undefined),
      },
    })
    const json = await res.json().catch(() => ({}))
    return { ok: res.ok, status: res.status, json }
  } catch {
    return { ok: false, status: 0, json: { error: { message: 'Connexion impossible. Vérifie ta connexion et réessaie.' } } }
  }
}

/**
 * Clé d'idempotence d'une requête : générée une fois, puis réutilisée telle
 * quelle si l'envoi doit être retenté, pour ne jamais décompter deux fois.
 */
export function newRequestKey(): string {
  const hex = () => Math.floor(Math.random() * 0x10000).toString(16).padStart(4, '0')
  return `app-${Date.now().toString(16)}-${hex()}${hex()}${hex()}${hex()}`
}

export interface UsageView {
  used: number
  bonus: number
  limit: number | null
  remaining: number | null
  message: { summary: string; detail: string; reached: boolean }
}

export interface SubscriptionView {
  id: string
  plan: string
  status: string
  billing_interval: 'month' | 'year' | null
  amount: number | null
  started_at: string | null
  expires_at: string | null
  source: string
  created_at: string
}

export interface BillingMe {
  plan: PlanId
  plan_label: string
  level: number
  is_admin: boolean
  current_subscription: SubscriptionView | null
  days_left: number | null
  expiring_soon: boolean
  scheduled: SubscriptionView[]
  history: SubscriptionView[]
  transactions: { reference: string; product_key: string; plan: string; billing_interval: string; amount: number; status: string; created_at: string }[]
  features: Record<string, boolean>
  exam_modes: string[]
  usage: { ai_questions: UsageView | null; tutor_corrections: UsageView | null; priority_group_questions: UsageView | null }
}

export interface PlanOffer {
  id: PlanId
  level: number
  label: string
  highlight: string | null
  tagline: string
  monthly: { product: string; amount: number; label: string } | null
  yearly: { product: string; amount: number; label: string } | null
  yearly_savings: number
  yearly_savings_label: string | null
  ai_daily_limit: number
  tutor_corrections_monthly: number
  exam_modes: string[]
  features: string[]
  exclusions: string[]
}

export const formatFcfa = (n: number) => `${Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} FCFA`

export const dateFr = (iso: string | null | undefined) =>
  iso ? new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'
