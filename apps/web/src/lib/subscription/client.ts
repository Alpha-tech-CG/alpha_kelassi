'use client'

import { useCallback, useEffect, useState } from 'react'
import type { FeatureKey, LockedFeatureInfo, PaidPlan, SubscriptionPlan, UsageType } from '@alpha-kelassi/types'

/** Erreur « formule requise » ou « quota atteint » renvoyée par l'API. */
export interface PlanError {
  code: 'PLAN_REQUIRED' | 'QUOTA_EXCEEDED'
  message: string
  info: LockedFeatureInfo | null
}

export function planErrorOf(json: unknown): PlanError | null {
  const err = (json as { error?: Record<string, unknown> } | null)?.error
  if (!err || typeof err !== 'object') return null
  if (err['code'] === 'PLAN_REQUIRED') {
    return {
      code: 'PLAN_REQUIRED',
      message: String(err['message'] ?? ''),
      info: {
        feature: err['feature'] as FeatureKey,
        requiredPlan: err['required_plan'] as PaidPlan,
        title: String(err['title'] ?? ''),
        body: String(err['body'] ?? ''),
        price: String(err['price'] ?? ''),
      },
    }
  }
  if (err['code'] === 'QUOTA_EXCEEDED') return { code: 'QUOTA_EXCEEDED', message: String(err['message'] ?? ''), info: null }
  return null
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
  cancelled_at?: string | null
  source: string
  created_at: string
}

export interface BillingMe {
  plan: SubscriptionPlan
  plan_label: string
  level: number
  is_admin: boolean
  current_subscription: SubscriptionView | null
  days_left: number | null
  expiring_soon: boolean
  scheduled: SubscriptionView[]
  history: SubscriptionView[]
  transactions: { reference: string; product_key: string; plan: string; billing_interval: string; amount: number; status: string; change_kind: string | null; created_at: string }[]
  features: Record<FeatureKey, boolean>
  exam_modes: string[]
  usage: Record<UsageType, UsageView | null>
}

/** Formule effective, quotas et historique de l'élève connecté. */
export function useBillingMe() {
  const [data, setData] = useState<BillingMe | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const reload = useCallback(async () => {
    try {
      const res = await fetch('/api/billing/me', { credentials: 'include' })
      const json = await res.json().catch(() => null)
      if (res.ok && json?.data) { setData(json.data); setError(null) }
      else setError(json?.error?.message ?? 'Impossible de charger ta formule.')
    } catch {
      setError('Connexion impossible. Vérifie ta connexion et réessaie.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { reload() }, [reload])
  return { data, loading, error, reload }
}

/** Clé d'idempotence d'une requête : à réutiliser telle quelle en cas de nouvelle tentative. */
export function newRequestKey(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`
}
