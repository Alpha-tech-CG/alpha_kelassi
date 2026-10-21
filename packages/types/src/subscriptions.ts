/**
 * Formules d'abonnement Cognix — source de vérité partagée (web, API, mobile).
 *
 * Quatre niveaux hiérarchisés : Gratuit < Starter < Pro < Pro Max. Un droit
 * est TOUJOURS décidé par comparaison de niveaux numériques, jamais par le nom
 * affiché d'une formule : un abonné Pro Max possède donc automatiquement tout
 * ce que donnent Pro, Starter et Gratuit.
 *
 * Ce fichier est autonome (aucun import) pour pouvoir être testé tel quel par
 * `node --test`. Le miroir SQL de la hiérarchie vit dans la migration 057
 * (`public.plan_level`) : les deux doivent rester alignés.
 */

/* ── Formules ─────────────────────────────────────────────────────────────── */

export const SUBSCRIPTION_PLANS = ['free', 'starter', 'pro', 'pro_max'] as const
export type SubscriptionPlan = (typeof SUBSCRIPTION_PLANS)[number]

export const PLAN_LEVELS: Record<SubscriptionPlan, number> = {
  free: 0,
  starter: 1,
  pro: 2,
  pro_max: 3,
}

/**
 * Anciennes valeurs encore possibles en base ou dans une vieille version de
 * l'application. `premium` (l'unique offre payante d'avant) correspond à Pro :
 * c'est la formule la plus proche de ce qu'il donnait (tout le contenu,
 * beaucoup d'IA, corrections), sans offrir Pro Max sans justification.
 */
export const LEGACY_PLAN_MAP: Readonly<Record<string, SubscriptionPlan>> = {
  premium: 'pro',
}

export function isSubscriptionPlan(value: unknown): value is SubscriptionPlan {
  return typeof value === 'string' && (SUBSCRIPTION_PLANS as readonly string[]).includes(value)
}

/** Ramène n'importe quelle valeur de plan à une formule connue ; inconnu → Gratuit. */
export function normalizePlan(value: string | null | undefined): SubscriptionPlan {
  if (isSubscriptionPlan(value)) return value
  if (value && LEGACY_PLAN_MAP[value]) return LEGACY_PLAN_MAP[value]
  return 'free'
}

export function planLevel(plan: string | null | undefined): number {
  return PLAN_LEVELS[normalizePlan(plan)]
}

/** L'utilisateur a-t-il au moins la formule demandée ? (droits hérités) */
export function hasPlanAccess(userPlan: string | null | undefined, requiredPlan: SubscriptionPlan): boolean {
  return planLevel(userPlan) >= PLAN_LEVELS[requiredPlan]
}

/**
 * Formule effective d'un utilisateur : les administrateurs accèdent à tout
 * (décision produit), sans que `pro_max` soit écrit en base ni ne fausse les
 * statistiques d'abonnés. Une formule payante expirée retombe à Gratuit.
 */
export function effectivePlan(input: {
  plan: string | null | undefined
  role?: string | null
  planExpiresAt?: string | Date | null
  now?: Date
}): SubscriptionPlan {
  if (input.role === 'admin') return 'pro_max'
  const plan = normalizePlan(input.plan)
  if (plan === 'free' || !input.planExpiresAt) return plan
  const expires = new Date(input.planExpiresAt).getTime()
  return expires > (input.now ?? new Date()).getTime() ? plan : 'free'
}

export interface PlanMeta {
  label: string
  /** Mention affichée sur la carte (texte, jamais uniquement une couleur). */
  highlight?: string
  tagline: string
}

export const PLAN_META: Record<SubscriptionPlan, PlanMeta> = {
  free:    { label: 'Gratuit', tagline: 'Pour découvrir Cognix' },
  starter: { label: 'Starter', tagline: 'Tout le programme de ta classe' },
  pro:     { label: 'Pro', highlight: 'Le plus populaire', tagline: 'Simulations avancées et corrections' },
  pro_max: { label: 'Pro Max', highlight: 'Préparation intensive', tagline: 'Suivi personnalisé complet' },
}

/* ── Fonctionnalités contrôlées ───────────────────────────────────────────── */

/**
 * Plan minimum de chaque fonctionnalité. Les clés du cahier des charges sont
 * reprises telles quelles ; les suivantes détaillent des promesses des offres
 * qui n'avaient pas de clé : quiz_explanations, parent_standard_tracking,
 * detailed_exam_results, revision_recommendations, priority_tutor_corrections,
 * deep_copy_analysis, recurring_errors, subject_recommendations,
 * enhanced_priority_support.
 */
export const FEATURE_REQUIRED_PLANS = {
  full_courses: 'starter',
  full_annals: 'starter',
  offline_downloads: 'starter',
  corrected_exercises: 'starter',
  chapter_quizzes: 'starter',
  quiz_explanations: 'starter',
  free_exam_mode: 'starter',
  bac_test_mode: 'starter',
  bac_blanc_mode: 'pro',
  bac_rouge_mode: 'pro',
  flashcards: 'starter',
  personalized_study_plan: 'starter',
  whatsapp_reminders: 'starter',
  study_groups: 'starter',
  parent_standard_tracking: 'starter',
  ai_error_analysis: 'pro',
  ai_document_analysis: 'pro',
  tutor_correction: 'pro',
  detailed_progress: 'pro',
  detailed_exam_results: 'pro',
  revision_recommendations: 'pro',
  parent_enriched_tracking: 'pro',
  priority_study_groups: 'pro',
  priority_support: 'pro',
  priority_tutor_corrections: 'pro_max',
  deep_copy_analysis: 'pro_max',
  recurring_errors: 'pro_max',
  adaptive_study_plan: 'pro_max',
  subject_recommendations: 'pro_max',
  progress_reports: 'pro_max',
  enhanced_priority_support: 'pro_max',
  early_access: 'pro_max',
} as const satisfies Record<string, SubscriptionPlan>

export type FeatureKey = keyof typeof FEATURE_REQUIRED_PLANS
export const FEATURE_KEYS = Object.keys(FEATURE_REQUIRED_PLANS) as FeatureKey[]

export function isFeatureKey(value: unknown): value is FeatureKey {
  return typeof value === 'string' && value in FEATURE_REQUIRED_PLANS
}

export function requiredPlanFor(feature: FeatureKey): SubscriptionPlan {
  return FEATURE_REQUIRED_PLANS[feature]
}

export function canAccessFeature(userPlan: string | null | undefined, feature: FeatureKey): boolean {
  return hasPlanAccess(userPlan, FEATURE_REQUIRED_PLANS[feature])
}

/** Intitulés lisibles, utilisés dans les messages de verrouillage. */
export const FEATURE_LABELS: Record<FeatureKey, string> = {
  full_courses: 'L’accès complet aux cours',
  full_annals: 'L’accès complet aux annales',
  offline_downloads: 'Le téléchargement hors connexion',
  corrected_exercises: 'Les exercices corrigés',
  chapter_quizzes: 'Les QCM par chapitre',
  quiz_explanations: 'L’explication des réponses aux QCM',
  free_exam_mode: 'Le mode Entraînement libre',
  bac_test_mode: 'Le mode Bac test',
  bac_blanc_mode: 'Le mode Bac blanc',
  bac_rouge_mode: 'Le mode Bac rouge',
  flashcards: 'Les flashcards avec répétition espacée',
  personalized_study_plan: 'Le planning de révision personnalisé',
  whatsapp_reminders: 'Les rappels WhatsApp',
  study_groups: 'La participation aux groupes d’étude',
  parent_standard_tracking: 'Le suivi parental',
  ai_error_analysis: 'L’analyse des erreurs',
  ai_document_analysis: 'L’analyse IA des photos d’énoncés',
  tutor_correction: 'La correction par un tuteur',
  detailed_progress: 'Le suivi détaillé par matière',
  detailed_exam_results: 'Les résultats détaillés des simulations',
  revision_recommendations: 'Les recommandations de révision',
  parent_enriched_tracking: 'Le suivi parental enrichi',
  priority_study_groups: 'Les questions prioritaires dans les groupes',
  priority_support: 'Le support prioritaire',
  priority_tutor_corrections: 'Le traitement prioritaire des corrections',
  deep_copy_analysis: 'L’analyse approfondie des copies',
  recurring_errors: 'L’identification des erreurs récurrentes',
  adaptive_study_plan: 'Le plan de révision adaptatif',
  subject_recommendations: 'Les recommandations personnalisées par matière',
  progress_reports: 'Les rapports de progression',
  enhanced_priority_support: 'Le support prioritaire renforcé',
  early_access: 'L’accès anticipé aux nouveautés',
}

/* ── Limites ──────────────────────────────────────────────────────────────── */

export const AI_DAILY_LIMITS: Record<SubscriptionPlan, number> = {
  free: 5,
  starter: 30,
  pro: 100,
  pro_max: 250,
}

export const TUTOR_CORRECTION_MONTHLY_LIMITS: Record<SubscriptionPlan, number> = {
  free: 0,
  starter: 0,
  pro: 2,
  pro_max: 6,
}

/** Questions prioritaires par jour dans les groupes ; null = sans limite. */
export const PRIORITY_GROUP_QUESTIONS_DAILY: Record<SubscriptionPlan, number | null> = {
  free: 0,
  starter: 0,
  pro: 3,
  pro_max: null,
}

/** Limites de découverte du plan Gratuit (appliquées aussi en base). */
export const FREE_TIER = {
  /** Chapitres entièrement ouverts par matière (le premier, dans l'ordre du programme). */
  openChaptersPerSubject: 1,
  /** Annales consultables par matière (la plus récente). */
  openAnnalsPerSubject: 1,
  /** Flashcards conservées au maximum. */
  maxFlashcards: 20,
} as const

export const USAGE_TYPES = ['ai_questions', 'tutor_corrections', 'priority_group_questions'] as const
export type UsageType = (typeof USAGE_TYPES)[number]

export const USAGE_PERIOD: Record<UsageType, 'day' | 'month'> = {
  ai_questions: 'day',
  tutor_corrections: 'month',
  priority_group_questions: 'day',
}

/** Limite applicable (null = illimité). */
export function usageLimit(type: UsageType, plan: string | null | undefined): number | null {
  const p = normalizePlan(plan)
  if (type === 'ai_questions') return AI_DAILY_LIMITS[p]
  if (type === 'tutor_corrections') return TUTOR_CORRECTION_MONTHLY_LIMITS[p]
  return PRIORITY_GROUP_QUESTIONS_DAILY[p]
}

/* ── Périodes (fuseau du Congo) ───────────────────────────────────────────── */

/**
 * Fuseau de référence : les rappels du projet sont déjà calés sur l'heure du
 * Congo (UTC+1, sans heure d'été). Un quota se renouvelle donc à minuit à
 * Brazzaville, pas à minuit UTC.
 */
export const APP_TIME_ZONE = 'Africa/Brazzaville'

function localParts(date: Date, timeZone: string): { y: string; m: string; d: string } {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' })
    .formatToParts(date)
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? ''
  return { y: get('year'), m: get('month'), d: get('day') }
}

/** Clé de période quotidienne, ex. `2026-09-11`. */
export function dayPeriodKey(date = new Date(), timeZone = APP_TIME_ZONE): string {
  const { y, m, d } = localParts(date, timeZone)
  return `${y}-${m}-${d}`
}

/** Clé de période mensuelle, ex. `2026-09`. */
export function monthPeriodKey(date = new Date(), timeZone = APP_TIME_ZONE): string {
  const { y, m } = localParts(date, timeZone)
  return `${y}-${m}`
}

export function periodKeyFor(type: UsageType, date = new Date(), timeZone = APP_TIME_ZONE): string {
  return USAGE_PERIOD[type] === 'day' ? dayPeriodKey(date, timeZone) : monthPeriodKey(date, timeZone)
}

/* ── Produits et prix ─────────────────────────────────────────────────────── */

export const BILLING_INTERVALS = ['month', 'year'] as const
export type BillingInterval = (typeof BILLING_INTERVALS)[number]
export type PaidPlan = Exclude<SubscriptionPlan, 'free'>

/**
 * Devise des paiements : XAF (franc CFA d'Afrique centrale), déjà celle de
 * l'intégration FeexPay existante. Affichée « FCFA » aux utilisateurs.
 */
export const SUBSCRIPTION_CURRENCY = 'XAF'

export const SUBSCRIPTION_PRODUCTS = {
  starter_monthly: { plan: 'starter', interval: 'month', amount: 4000, currency: SUBSCRIPTION_CURRENCY },
  starter_yearly:  { plan: 'starter', interval: 'year',  amount: 40000, currency: SUBSCRIPTION_CURRENCY },
  pro_monthly:     { plan: 'pro',     interval: 'month', amount: 6000, currency: SUBSCRIPTION_CURRENCY },
  pro_yearly:      { plan: 'pro',     interval: 'year',  amount: 60000, currency: SUBSCRIPTION_CURRENCY },
  pro_max_monthly: { plan: 'pro_max', interval: 'month', amount: 10000, currency: SUBSCRIPTION_CURRENCY },
  pro_max_yearly:  { plan: 'pro_max', interval: 'year',  amount: 100000, currency: SUBSCRIPTION_CURRENCY },
} as const satisfies Record<string, { plan: PaidPlan; interval: BillingInterval; amount: number; currency: string }>

export type ProductKey = keyof typeof SUBSCRIPTION_PRODUCTS
export const PRODUCT_KEYS = Object.keys(SUBSCRIPTION_PRODUCTS) as ProductKey[]

export function isProductKey(value: unknown): value is ProductKey {
  return typeof value === 'string' && value in SUBSCRIPTION_PRODUCTS
}

export function productKeyFor(plan: PaidPlan, interval: BillingInterval): ProductKey {
  return `${plan}_${interval === 'month' ? 'monthly' : 'yearly'}` as ProductKey
}

export function planPrice(plan: SubscriptionPlan, interval: BillingInterval): number {
  if (plan === 'free') return 0
  return SUBSCRIPTION_PRODUCTS[productKeyFor(plan, interval)].amount
}

/** Économie annuelle par rapport à douze mensualités. */
export function annualSavings(plan: SubscriptionPlan): number {
  if (plan === 'free') return 0
  return planPrice(plan, 'month') * 12 - planPrice(plan, 'year')
}

/** Montant en FCFA avec séparateur de milliers, ex. `40 000 FCFA`. */
export function formatFcfa(amount: number): string {
  const grouped = Math.round(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  return `${grouped} FCFA`
}

/* ── Durées, montées et descentes de formule ──────────────────────────────── */

const DAY_MS = 86_400_000
/** Jours de référence pour convertir un crédit restant (prorata). */
const INTERVAL_DAYS: Record<BillingInterval, number> = { month: 30, year: 365 }

/** Ajoute une période calendaire (fin de mois conservée : 31 janv. + 1 mois = 28/29 févr.). */
export function addInterval(date: Date, interval: BillingInterval): Date {
  const months = interval === 'month' ? 1 : 12
  const out = new Date(date.getTime())
  const day = out.getUTCDate()
  out.setUTCDate(1)
  out.setUTCMonth(out.getUTCMonth() + months)
  const lastDay = new Date(Date.UTC(out.getUTCFullYear(), out.getUTCMonth() + 1, 0)).getUTCDate()
  out.setUTCDate(Math.min(day, lastDay))
  return out
}

export interface CurrentSubscription {
  plan: SubscriptionPlan
  interval: BillingInterval | null
  expiresAt: Date | null
}

export interface SubscriptionChange {
  kind: 'new' | 'upgrade' | 'renewal' | 'downgrade'
  /** Début effectif des droits de la nouvelle formule. */
  startsAt: Date
  expiresAt: Date
  /** Jours offerts au titre du crédit de l'ancienne formule (montée uniquement). */
  creditDays: number
}

/**
 * Règle validée : une MONTÉE est immédiate et les jours restants de l'ancienne
 * formule sont convertis en jours de la nouvelle, au prorata du prix ; un
 * RENOUVELLEMENT ou une DESCENTE démarre à l'échéance en cours, sans perte.
 */
export function computeSubscriptionChange(
  current: CurrentSubscription | null,
  next: { plan: PaidPlan; interval: BillingInterval },
  now = new Date(),
): SubscriptionChange {
  const active = current && current.plan !== 'free' && current.expiresAt && current.expiresAt.getTime() > now.getTime()
  if (!active) {
    return { kind: 'new', startsAt: now, expiresAt: addInterval(now, next.interval), creditDays: 0 }
  }

  const currentLevel = PLAN_LEVELS[current.plan]
  const nextLevel = PLAN_LEVELS[next.plan]
  const currentExpiry = current.expiresAt as Date

  if (nextLevel > currentLevel) {
    const remainingDays = (currentExpiry.getTime() - now.getTime()) / DAY_MS
    const currentInterval = current.interval ?? 'month'
    const currentDaily = planPrice(current.plan, currentInterval) / INTERVAL_DAYS[currentInterval]
    const nextDaily = planPrice(next.plan, next.interval) / INTERVAL_DAYS[next.interval]
    const creditDays = nextDaily > 0 ? Math.floor((remainingDays * currentDaily) / nextDaily) : 0
    const base = addInterval(now, next.interval)
    return { kind: 'upgrade', startsAt: now, expiresAt: new Date(base.getTime() + creditDays * DAY_MS), creditDays }
  }

  return {
    kind: nextLevel === currentLevel ? 'renewal' : 'downgrade',
    startsAt: currentExpiry,
    expiresAt: addInterval(currentExpiry, next.interval),
    creditDays: 0,
  }
}

/* ── Paiements : issue d'une notification ─────────────────────────────────── */

export const PAYMENT_STATUSES = ['pending', 'successful', 'failed', 'cancelled', 'expired'] as const
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number]

/** Traduit le statut renvoyé par FeexPay (vérifié serveur → serveur). */
export function mapProviderStatus(raw: string | null | undefined): PaymentStatus {
  switch ((raw ?? '').toUpperCase()) {
    case 'SUCCESSFUL':
    case 'SUCCESS':
      return 'successful'
    case 'FAILED':
    case 'ERROR':
      return 'failed'
    case 'CANCELED':
    case 'CANCELLED':
    case 'REJECTED':
      return 'cancelled'
    case 'EXPIRED':
    case 'TIMEOUT':
      return 'expired'
    default:
      return 'pending'
  }
}

export type PaymentDecision =
  | { action: 'activate' }
  | { action: 'ignore'; reason: 'already_processed' | 'still_pending' }
  | { action: 'close'; status: Exclude<PaymentStatus, 'pending' | 'successful'> }
  | { action: 'reject'; reason: 'unknown_transaction' | 'amount_mismatch' | 'currency_mismatch' }

/**
 * Décide quoi faire d'une notification de paiement. Pure et déterministe :
 * le webhook et l'endpoint de vérification appliquent la même règle, et une
 * notification rejouée ne peut jamais réactiver un abonnement.
 */
export function decidePayment(
  transaction: { status: PaymentStatus; amount: number; currency: string } | null,
  provider: { status: PaymentStatus; amount: number | null; currency?: string | null },
): PaymentDecision {
  if (!transaction) return { action: 'reject', reason: 'unknown_transaction' }
  if (transaction.status !== 'pending') return { action: 'ignore', reason: 'already_processed' }
  if (provider.status === 'pending') return { action: 'ignore', reason: 'still_pending' }
  if (provider.status !== 'successful') return { action: 'close', status: provider.status }
  if (provider.amount === null || Number(provider.amount) !== transaction.amount) {
    return { action: 'reject', reason: 'amount_mismatch' }
  }
  if (provider.currency && provider.currency.toUpperCase() !== transaction.currency.toUpperCase()) {
    return { action: 'reject', reason: 'currency_mismatch' }
  }
  return { action: 'activate' }
}

/* ── Messages ─────────────────────────────────────────────────────────────── */

function plural(n: number, singular: string, pluralForm: string): string {
  return n > 1 ? pluralForm : singular
}

/** Prochaine formule qui augmente une limite, ou null si déjà au maximum. */
export function nextPlanWithMore(type: UsageType, plan: string | null | undefined): PaidPlan | null {
  const current = usageLimit(type, plan)
  for (const p of SUBSCRIPTION_PLANS) {
    if (p === 'free' || PLAN_LEVELS[p] <= planLevel(plan)) continue
    const limit = usageLimit(type, p)
    if (limit === null || current === null || limit > current) return p
  }
  return null
}

export interface QuotaMessage { summary: string; detail: string; reached: boolean }

/** Messages de quota affichés à l'élève (tutoiement, comme le reste de l'application). */
export function quotaMessage(type: UsageType, plan: string | null | undefined, used: number, bonus = 0): QuotaMessage {
  const base = usageLimit(type, plan)
  if (base === null) {
    return { summary: 'Sans limite avec ta formule.', detail: '', reached: false }
  }
  const limit = base + bonus
  const remaining = Math.max(0, limit - used)
  const upgrade = nextPlanWithMore(type, plan)

  if (type === 'tutor_corrections') {
    if (limit === 0) {
      return {
        summary: 'La correction par un tuteur n’est pas incluse dans ta formule.',
        detail: `Elle est disponible avec la formule ${PLAN_META.pro.label} (2 corrections par mois).`,
        reached: true,
      }
    }
    if (remaining === 0) {
      return {
        summary: 'Ton quota mensuel de corrections est atteint.',
        detail: upgrade
          ? `Attends le renouvellement le mois prochain, ou passe à ${PLAN_META[upgrade].label} pour ${TUTOR_CORRECTION_MONTHLY_LIMITS[upgrade]} corrections par mois.`
          : 'Ton quota sera renouvelé le mois prochain.',
        reached: true,
      }
    }
    return {
      summary: `Tu as utilisé ${used} ${plural(used, 'correction', 'corrections')} sur ${limit} ce mois-ci.`,
      detail: `Il te reste ${remaining} ${plural(remaining, 'correction incluse', 'corrections incluses')}.`,
      reached: false,
    }
  }

  const noun = type === 'ai_questions' ? 'questions Cognix IA' : 'questions prioritaires'
  if (remaining === 0) {
    return {
      summary: type === 'ai_questions'
        ? `Tu as utilisé ${used} questions sur ${limit} aujourd’hui. Ton quota quotidien Cognix IA est atteint.`
        : 'Ton quota quotidien de questions prioritaires est atteint.',
      detail: upgrade
        ? `Ton quota sera renouvelé demain. Passe à ${PLAN_META[upgrade].label} pour obtenir davantage de ${noun}.`
        : 'Ton quota sera renouvelé demain.',
      reached: true,
    }
  }
  return {
    summary: `Tu as utilisé ${used} ${plural(used, 'question', 'questions')} sur ${limit} aujourd’hui.`,
    detail: `Il te reste ${remaining} ${noun}.`,
    reached: false,
  }
}

/** Ce que la formule requise apporte en plus, pour convaincre sans jargon. */
const PLAN_PITCH: Record<PaidPlan, string> = {
  starter: 'accéder à tout le programme de ta classe et aux annales, et obtenir 30 questions Cognix IA par jour',
  pro: 'accéder aux simulations avancées, obtenir 2 corrections par tuteur par mois et 100 questions Cognix IA par jour',
  pro_max: 'bénéficier du suivi personnalisé complet, de 6 corrections par mois et de 250 questions Cognix IA par jour',
}

export interface LockedFeatureInfo {
  feature: FeatureKey
  requiredPlan: PaidPlan
  title: string
  body: string
  /** Prix mensuel de la formule requise, ex. `6 000 FCFA / mois`. */
  price: string
}

/** Explication affichée quand l'élève touche une fonctionnalité verrouillée. */
export function lockedFeatureInfo(feature: FeatureKey): LockedFeatureInfo {
  const required = requiredPlanFor(feature) as PaidPlan
  const label = PLAN_META[required].label
  const subject = FEATURE_LABELS[feature]
  const verb = subject.startsWith('Les ') ? 'sont disponibles' : 'est disponible'
  return {
    feature,
    requiredPlan: required,
    title: `${subject} ${verb} avec la formule ${label}.`,
    body: `Passe à ${label} pour ${PLAN_PITCH[required]}.`,
    price: `${formatFcfa(planPrice(required, 'month'))} / mois`,
  }
}

/* ── Accès anticipé (Pro Max) ─────────────────────────────────────────────── */

export interface EarlyAccessPreview {
  key: string
  title: string
  description: string
  /** Date à laquelle la fonctionnalité sort de l'accès anticipé, si connue. */
  generalAvailability: string | null
}

/**
 * Nouveautés pédagogiques ouvertes en avant-première aux abonnés Pro Max.
 * Ajouter une entrée ici suffit à l'afficher dans « Mon analyse » ; la route
 * de la fonctionnalité vérifie `ent.can('early_access')` (sinon
 * `planRequired('early_access')`) jusqu'à sa date de disponibilité générale.
 */
export const EARLY_ACCESS_PREVIEWS: readonly EarlyAccessPreview[] = []

/* ── Contenu des offres (page de présentation) ────────────────────────────── */

export const EXAM_MODES = ['entrainement', 'bac_test', 'bac_blanc', 'bac_rouge'] as const
export type ExamMode = (typeof EXAM_MODES)[number]

export const EXAM_MODE_FEATURE: Record<ExamMode, FeatureKey> = {
  entrainement: 'free_exam_mode',
  bac_test: 'bac_test_mode',
  bac_blanc: 'bac_blanc_mode',
  bac_rouge: 'bac_rouge_mode',
}

export const EXAM_MODE_LABELS: Record<ExamMode, string> = {
  entrainement: 'Entraînement libre',
  bac_test: 'Bac test',
  bac_blanc: 'Bac blanc',
  bac_rouge: 'Bac rouge',
}

export function allowedExamModes(plan: string | null | undefined): ExamMode[] {
  return EXAM_MODES.filter((m) => canAccessFeature(plan, EXAM_MODE_FEATURE[m]))
}

/** Lignes de chaque offre, dans l'ordre du cahier des charges. */
export const PLAN_FEATURE_LINES: Record<SubscriptionPlan, readonly string[]> = {
  free: [
    'Premier chapitre de chaque matière',
    'Une annale par matière',
    'Exercices et QCM du premier chapitre',
    '5 questions Cognix IA par jour',
    'Progression basique',
    `Jusqu’à ${FREE_TIER.maxFlashcards} flashcards`,
    'Badges, XP et classements',
    'Groupes d’étude en lecture seule',
  ],
  starter: [
    'Tous les cours de ta classe et de ta série',
    'Toutes les annales disponibles',
    'Téléchargement des cours hors connexion',
    'Exercices corrigés et QCM par chapitre, avec explications',
    'Simulations Entraînement libre et Bac test',
    'Flashcards avec répétition espacée',
    'Planning de révision personnalisé',
    '30 questions Cognix IA par jour',
    'Rappels WhatsApp',
    'Groupes d’étude',
    'Suivi parental standard',
  ],
  pro: [
    'Tout Starter',
    'Simulations Bac blanc et Bac rouge',
    '100 questions Cognix IA par jour',
    'Analyse des erreurs et recommandations de révision',
    'Suivi détaillé de la progression par matière',
    'Analyse IA des photos d’énoncés',
    '2 corrections par tuteur par mois',
    'Résultats détaillés après les simulations',
    'Questions prioritaires dans les groupes (3 par jour)',
    'Suivi parental enrichi',
    'Support prioritaire',
  ],
  pro_max: [
    'Tout Pro',
    '250 questions Cognix IA par jour',
    '6 corrections par tuteur par mois, traitées en priorité',
    'Analyse approfondie des copies',
    'Identification des erreurs récurrentes',
    'Plan de révision adaptatif',
    'Recommandations personnalisées par matière',
    'Rapports de progression pour l’élève et le parent',
    'Questions prioritaires illimitées dans les groupes',
    'Support prioritaire renforcé',
    'Accès anticipé aux nouvelles fonctionnalités',
  ],
}

/** Formules absentes de la ligne « non inclus », pour une comparaison honnête. */
export const PLAN_EXCLUSIONS: Record<SubscriptionPlan, readonly string[]> = {
  free: ['Aucun téléchargement hors connexion', 'Aucune correction par tuteur', 'Pas de Bac blanc ni de Bac rouge'],
  starter: ['Pas de Bac blanc ni de Bac rouge', 'Aucune correction par tuteur incluse'],
  pro: [],
  pro_max: [],
}
