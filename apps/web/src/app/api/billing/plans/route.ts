import { NextResponse } from 'next/server'
import {
  AI_DAILY_LIMITS, EXAM_MODE_LABELS, PLAN_EXCLUSIONS, PLAN_FEATURE_LINES, PLAN_LEVELS, PLAN_META,
  SUBSCRIPTION_CURRENCY, SUBSCRIPTION_PLANS, TUTOR_CORRECTION_MONTHLY_LIMITS,
  allowedExamModes, annualSavings, formatFcfa, planPrice, productKeyFor,
} from '@alpha-kelassi/types'

/**
 * GET /api/billing/plans — catalogue des formules (public).
 * L'application mobile l'affiche tel quel : les prix et les droits n'existent
 * qu'à un seul endroit (packages/types/src/subscriptions.ts).
 */
export function GET() {
  const plans = SUBSCRIPTION_PLANS.map((id) => ({
    id,
    level: PLAN_LEVELS[id],
    label: PLAN_META[id].label,
    highlight: PLAN_META[id].highlight ?? null,
    tagline: PLAN_META[id].tagline,
    currency: SUBSCRIPTION_CURRENCY,
    monthly: id === 'free' ? null : { product: productKeyFor(id, 'month'), amount: planPrice(id, 'month'), label: `${formatFcfa(planPrice(id, 'month'))} / mois` },
    yearly: id === 'free' ? null : { product: productKeyFor(id, 'year'), amount: planPrice(id, 'year'), label: `${formatFcfa(planPrice(id, 'year'))} / an` },
    yearly_savings: annualSavings(id),
    yearly_savings_label: id === 'free' ? null : `Économise ${formatFcfa(annualSavings(id))} par an`,
    ai_daily_limit: AI_DAILY_LIMITS[id],
    tutor_corrections_monthly: TUTOR_CORRECTION_MONTHLY_LIMITS[id],
    exam_modes: allowedExamModes(id).map((m) => EXAM_MODE_LABELS[m]),
    features: PLAN_FEATURE_LINES[id],
    exclusions: PLAN_EXCLUSIONS[id],
  }))
  return NextResponse.json({ data: plans }, { headers: { 'Cache-Control': 'public, max-age=300' } })
}
