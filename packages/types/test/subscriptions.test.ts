/**
 * Tests des règles d'abonnement partagées. Exécution : `pnpm --filter @alpha-kelassi/types test`
 * (Node ≥ 22.6 lit le TypeScript directement, sans dépendance supplémentaire).
 */
import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  AI_DAILY_LIMITS, FEATURE_KEYS, FEATURE_REQUIRED_PLANS, PLAN_LEVELS, SUBSCRIPTION_PLANS, SUBSCRIPTION_PRODUCTS,
  TUTOR_CORRECTION_MONTHLY_LIMITS, addInterval, allowedExamModes, annualSavings, canAccessFeature,
  computeSubscriptionChange, dayPeriodKey, decidePayment, effectivePlan, formatFcfa, hasPlanAccess,
  lockedFeatureInfo, mapProviderStatus, monthPeriodKey, normalizePlan, planPrice, productKeyFor, quotaMessage,
  usageLimit,
} from '../src/subscriptions.ts'

const NBSP = ' '

describe('Formules et droits hérités', () => {
  it('ordonne Gratuit < Starter < Pro < Pro Max', () => {
    assert.deepEqual(SUBSCRIPTION_PLANS.map((p) => PLAN_LEVELS[p]), [0, 1, 2, 3])
  })

  it('un utilisateur gratuit ne peut accéder à aucune fonctionnalité Starter', () => {
    for (const f of FEATURE_KEYS.filter((k) => FEATURE_REQUIRED_PLANS[k] === 'starter')) {
      assert.equal(canAccessFeature('free', f), false, f)
    }
  })

  it('Starter accède aux cours complets mais pas au Bac blanc ni au Bac rouge', () => {
    assert.equal(canAccessFeature('starter', 'full_courses'), true)
    assert.equal(canAccessFeature('starter', 'bac_blanc_mode'), false)
    assert.equal(canAccessFeature('starter', 'bac_rouge_mode'), false)
  })

  it('Pro accède au Bac blanc et au Bac rouge', () => {
    assert.equal(canAccessFeature('pro', 'bac_blanc_mode'), true)
    assert.equal(canAccessFeature('pro', 'bac_rouge_mode'), true)
  })

  it('Pro Max accède à toutes les fonctionnalités', () => {
    for (const f of FEATURE_KEYS) assert.equal(canAccessFeature('pro_max', f), true, f)
  })

  it('les droits sont hérités : toute fonctionnalité d’un plan est ouverte aux plans supérieurs', () => {
    for (const f of FEATURE_KEYS) {
      const required = PLAN_LEVELS[FEATURE_REQUIRED_PLANS[f]]
      for (const p of SUBSCRIPTION_PLANS) {
        assert.equal(canAccessFeature(p, f), PLAN_LEVELS[p] >= required, `${p} / ${f}`)
      }
    }
    assert.equal(hasPlanAccess('pro', 'starter'), true)
    assert.equal(hasPlanAccess('starter', 'pro'), false)
  })

  it('décide sur l’identifiant stable, jamais sur un libellé', () => {
    assert.equal(normalizePlan('Pro'), 'free')
    assert.equal(normalizePlan('premium'), 'pro')
    assert.equal(normalizePlan(null), 'free')
    assert.equal(normalizePlan('inconnu'), 'free')
  })

  it('modes de simulation par formule', () => {
    assert.deepEqual(allowedExamModes('free'), [])
    assert.deepEqual(allowedExamModes('starter'), ['entrainement', 'bac_test'])
    assert.deepEqual(allowedExamModes('pro'), ['entrainement', 'bac_test', 'bac_blanc', 'bac_rouge'])
  })

  it('formule effective : admin = Pro Max, formule expirée = Gratuit', () => {
    const now = new Date('2026-09-11T10:00:00Z')
    assert.equal(effectivePlan({ plan: 'free', role: 'admin' }), 'pro_max')
    assert.equal(effectivePlan({ plan: 'pro', planExpiresAt: '2026-09-12T00:00:00Z', now }), 'pro')
    assert.equal(effectivePlan({ plan: 'pro', planExpiresAt: '2026-09-11T09:59:59Z', now }), 'free')
    assert.equal(effectivePlan({ plan: 'starter', planExpiresAt: null, now }), 'starter')
  })
})

describe('Quotas Cognix IA', () => {
  it('limites quotidiennes : 5 / 30 / 100 / 250', () => {
    assert.deepEqual(AI_DAILY_LIMITS, { free: 5, starter: 30, pro: 100, pro_max: 250 })
    assert.equal(usageLimit('ai_questions', 'free'), 5)
    assert.equal(usageLimit('ai_questions', 'starter'), 30)
    assert.equal(usageLimit('ai_questions', 'pro'), 100)
    assert.equal(usageLimit('ai_questions', 'pro_max'), 250)
  })

  it('le compteur change de période à minuit, heure du Congo (UTC+1)', () => {
    assert.equal(dayPeriodKey(new Date('2026-09-11T22:59:59Z')), '2026-09-11')
    assert.equal(dayPeriodKey(new Date('2026-09-11T23:00:00Z')), '2026-09-12')
  })

  it('messages de quota consommé, restant et atteint', () => {
    const m = quotaMessage('ai_questions', 'starter', 12)
    assert.equal(m.summary, 'Tu as utilisé 12 questions sur 30 aujourd’hui.')
    assert.equal(m.detail, 'Il te reste 18 questions Cognix IA.')
    assert.equal(m.reached, false)

    const full = quotaMessage('ai_questions', 'starter', 30)
    assert.equal(full.reached, true)
    assert.match(full.summary, /30 questions sur 30/)
    assert.match(full.detail, /renouvelé demain/)
    assert.match(full.detail, /Pro/)

    assert.doesNotMatch(quotaMessage('ai_questions', 'pro_max', 250).detail, /Passe à/)
  })

  it('un quota accordé par un admin s’ajoute à la limite', () => {
    const m = quotaMessage('ai_questions', 'free', 5, 10)
    assert.equal(m.reached, false)
    assert.equal(m.detail, 'Il te reste 10 questions Cognix IA.')
  })
})

describe('Corrections par tuteur', () => {
  it('limites mensuelles : 0 / 0 / 2 / 6', () => {
    assert.deepEqual(TUTOR_CORRECTION_MONTHLY_LIMITS, { free: 0, starter: 0, pro: 2, pro_max: 6 })
  })

  it('le compteur change de période au début du mois (heure du Congo)', () => {
    assert.equal(monthPeriodKey(new Date('2026-09-30T22:59:59Z')), '2026-09')
    assert.equal(monthPeriodKey(new Date('2026-09-30T23:00:00Z')), '2026-10')
  })

  it('messages', () => {
    const m = quotaMessage('tutor_corrections', 'pro', 1)
    assert.equal(m.summary, 'Tu as utilisé 1 correction sur 2 ce mois-ci.')
    assert.equal(m.detail, 'Il te reste 1 correction incluse.')
    const full = quotaMessage('tutor_corrections', 'pro', 2)
    assert.equal(full.reached, true)
    assert.match(full.detail, /Pro Max/)
    assert.equal(quotaMessage('tutor_corrections', 'starter', 0).reached, true)
  })
})

describe('Produits et prix', () => {
  it('montants mensuels et annuels en XAF', () => {
    assert.equal(SUBSCRIPTION_PRODUCTS.starter_monthly.amount, 4000)
    assert.equal(SUBSCRIPTION_PRODUCTS.starter_yearly.amount, 40000)
    assert.equal(SUBSCRIPTION_PRODUCTS.pro_monthly.amount, 6000)
    assert.equal(SUBSCRIPTION_PRODUCTS.pro_yearly.amount, 60000)
    assert.equal(SUBSCRIPTION_PRODUCTS.pro_max_monthly.amount, 10000)
    assert.equal(SUBSCRIPTION_PRODUCTS.pro_max_yearly.amount, 100000)
    for (const p of Object.values(SUBSCRIPTION_PRODUCTS)) assert.equal(p.currency, 'XAF')
    assert.equal(productKeyFor('pro_max', 'year'), 'pro_max_yearly')
    assert.equal(planPrice('free', 'month'), 0)
  })

  it('économie annuelle = 2 mois offerts', () => {
    assert.equal(annualSavings('starter'), 8000)
    assert.equal(annualSavings('pro'), 12000)
    assert.equal(annualSavings('pro_max'), 20000)
  })

  it('prix affichés en FCFA', () => {
    assert.equal(formatFcfa(40000), `40${NBSP}000${NBSP}FCFA`)
    assert.equal(formatFcfa(0), `0${NBSP}FCFA`)
  })

  it('message de fonctionnalité verrouillée : formule minimale et prix', () => {
    const info = lockedFeatureInfo('bac_rouge_mode')
    assert.equal(info.requiredPlan, 'pro')
    assert.equal(info.title, 'Le mode Bac rouge est disponible avec la formule Pro.')
    assert.match(info.body, /100 questions Cognix IA par jour/)
    assert.equal(info.price, `6${NBSP}000${NBSP}FCFA / mois`)
  })
})

describe('Montée et descente de formule', () => {
  const now = new Date('2026-09-11T00:00:00Z')

  it('première souscription : démarre maintenant pour la période payée', () => {
    const c = computeSubscriptionChange(null, { plan: 'starter', interval: 'month' }, now)
    assert.equal(c.kind, 'new')
    assert.equal(c.startsAt.toISOString(), now.toISOString())
    assert.equal(c.expiresAt.toISOString(), '2026-10-11T00:00:00.000Z')
  })

  it('montée immédiate avec crédit des jours restants au prorata', () => {
    // Starter mensuel (4 000) avec 15 jours restants → crédit 2 000 → 10 jours de Pro mensuel (200/jour).
    const current = { plan: 'starter' as const, interval: 'month' as const, expiresAt: new Date('2026-09-26T00:00:00Z') }
    const c = computeSubscriptionChange(current, { plan: 'pro', interval: 'month' }, now)
    assert.equal(c.kind, 'upgrade')
    assert.equal(c.startsAt.toISOString(), now.toISOString())
    assert.equal(c.creditDays, 10)
    assert.equal(c.expiresAt.toISOString(), '2026-10-21T00:00:00.000Z')
  })

  it('renouvellement et descente démarrent à l’échéance en cours', () => {
    const current = { plan: 'pro' as const, interval: 'month' as const, expiresAt: new Date('2026-09-30T00:00:00Z') }
    const renewal = computeSubscriptionChange(current, { plan: 'pro', interval: 'month' }, now)
    assert.equal(renewal.kind, 'renewal')
    assert.equal(renewal.startsAt.toISOString(), '2026-09-30T00:00:00.000Z')
    const down = computeSubscriptionChange(current, { plan: 'starter', interval: 'year' }, now)
    assert.equal(down.kind, 'downgrade')
    assert.equal(down.expiresAt.toISOString(), '2027-09-30T00:00:00.000Z')
  })

  it('un abonnement expiré est traité comme une nouvelle souscription', () => {
    const current = { plan: 'pro_max' as const, interval: 'year' as const, expiresAt: new Date('2026-09-01T00:00:00Z') }
    assert.equal(computeSubscriptionChange(current, { plan: 'starter', interval: 'month' }, now).kind, 'new')
  })

  it('fin de mois conservée', () => {
    assert.equal(addInterval(new Date('2027-01-31T08:00:00Z'), 'month').toISOString(), '2027-02-28T08:00:00.000Z')
  })
})

describe('Notifications de paiement', () => {
  const pending = { status: 'pending' as const, amount: 6000, currency: 'XAF' }

  it('un paiement réussi et conforme active la formule', () => {
    assert.deepEqual(decidePayment(pending, { status: 'successful', amount: 6000, currency: 'XAF' }), { action: 'activate' })
  })

  it('un paiement échoué, annulé ou expiré n’active rien', () => {
    assert.deepEqual(decidePayment(pending, { status: 'failed', amount: 6000 }), { action: 'close', status: 'failed' })
    assert.deepEqual(decidePayment(pending, { status: 'cancelled', amount: 6000 }), { action: 'close', status: 'cancelled' })
    assert.deepEqual(decidePayment(pending, { status: 'expired', amount: null }), { action: 'close', status: 'expired' })
  })

  it('une notification rejouée ne crée pas de doublon', () => {
    const done = { ...pending, status: 'successful' as const }
    assert.deepEqual(decidePayment(done, { status: 'successful', amount: 6000 }), { action: 'ignore', reason: 'already_processed' })
  })

  it('une transaction inconnue est rejetée', () => {
    assert.deepEqual(decidePayment(null, { status: 'successful', amount: 6000 }), { action: 'reject', reason: 'unknown_transaction' })
  })

  it('un montant ou une devise incohérents sont rejetés', () => {
    assert.deepEqual(decidePayment(pending, { status: 'successful', amount: 4000 }), { action: 'reject', reason: 'amount_mismatch' })
    assert.deepEqual(decidePayment(pending, { status: 'successful', amount: 6000, currency: 'EUR' }), { action: 'reject', reason: 'currency_mismatch' })
  })

  it('traduit les statuts FeexPay', () => {
    assert.equal(mapProviderStatus('SUCCESSFUL'), 'successful')
    assert.equal(mapProviderStatus('FAILED'), 'failed')
    assert.equal(mapProviderStatus('PENDING'), 'pending')
    assert.equal(mapProviderStatus(undefined), 'pending')
  })
})
