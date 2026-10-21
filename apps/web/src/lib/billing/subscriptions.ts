import {
  addInterval, computeSubscriptionChange, decidePayment, normalizePlan, PLAN_LEVELS,
  type BillingInterval, type CurrentSubscription, type PaidPlan, type PaymentStatus,
} from '@alpha-kelassi/types'
import { supabaseAdmin } from '@/lib/admin-guard'
import { fetchTransactionStatus } from './feexpay'

/**
 * Cycle de vie des abonnements payés.
 *
 * Invariants :
 *   • Un abonnement n'est JAMAIS activé sur la foi du client : seule une
 *     transaction relue auprès de FeexPay, au bon montant, l'active.
 *   • Une transaction ne peut activer qu'une fois : on la « réclame » par une
 *     mise à jour conditionnelle (pending → successful) avant de créer
 *     l'abonnement, et l'index unique (fournisseur, référence) empêche tout
 *     doublon même en cas de notifications simultanées.
 *   • Rien n'est supprimé : un abonnement remplacé passe à `canceled`, un
 *     abonnement terminé à `expired`, l'historique reste consultable.
 */

export interface TransactionRow {
  id: string
  reference: string
  user_id: string | null
  product_key: string
  plan: string
  billing_interval: BillingInterval
  amount: number
  currency: string
  status: PaymentStatus
  provider_reference: string | null
  created_at: string
}

const TX_COLUMNS = 'id, reference, user_id, product_key, plan, billing_interval, amount, currency, status, provider_reference, created_at'

export async function logWebhookEvent(reference: string | null, known: boolean, outcome: string, detail?: string) {
  await supabaseAdmin.from('payment_webhook_events').insert({
    provider: 'feexpay', reference, known, outcome, detail: detail?.slice(0, 500) ?? null,
  }).then(({ error }) => { if (error) console.error('[billing] journal de notification', error.message) })
}

/** Abonnement en cours le plus élevé (celui qu'une montée remplace). */
export async function currentSubscription(userId: string): Promise<(CurrentSubscription & { id: string }) | null> {
  const nowIso = new Date().toISOString()
  const { data } = await supabaseAdmin.from('subscriptions')
    .select('id, plan, billing_interval, started_at, expires_at, status, created_at')
    .eq('user_id', userId).in('status', ['active', 'pending'])
    .or(`expires_at.is.null,expires_at.gt.${nowIso}`)
  const rows = ((data ?? []) as { id: string; plan: string; billing_interval: BillingInterval | null; started_at: string | null; expires_at: string | null; created_at: string }[])
    .filter((s) => (s.started_at ?? s.created_at) <= nowIso)
    .sort((a, b) => PLAN_LEVELS[normalizePlan(b.plan)] - PLAN_LEVELS[normalizePlan(a.plan)])
  const top = rows[0]
  if (!top) return null
  return {
    id: top.id,
    plan: normalizePlan(top.plan),
    interval: top.billing_interval,
    // Sans échéance (abonnement accordé à la main) : aucune date de fin à prolonger.
    expiresAt: top.expires_at ? new Date(top.expires_at) : null,
  }
}

/** Dernière échéance déjà payée (pour enchaîner renouvellements et descentes). */
async function latestPaidExpiry(userId: string): Promise<Date | null> {
  const { data } = await supabaseAdmin.from('subscriptions')
    .select('expires_at').eq('user_id', userId).in('status', ['active', 'pending'])
    .not('expires_at', 'is', null).order('expires_at', { ascending: false }).limit(1).maybeSingle()
  const exp = (data as { expires_at?: string } | null)?.expires_at
  return exp ? new Date(exp) : null
}

async function activate(tx: TransactionRow) {
  if (!tx.user_id) throw new Error('Transaction sans utilisateur')
  const plan = normalizePlan(tx.plan) as PaidPlan
  const now = new Date()

  // Réclamation atomique : une seule exécution passe.
  const { data: claimed } = await supabaseAdmin.from('payment_transactions')
    .update({ status: 'successful', processed_at: now.toISOString(), updated_at: now.toISOString() })
    .eq('id', tx.id).eq('status', 'pending')
    .select('id')
  if (!claimed || claimed.length === 0) return { outcome: 'already_processed' as const }

  try {
    const current = await currentSubscription(tx.user_id)
    const change = computeSubscriptionChange(current, { plan, interval: tx.billing_interval }, now)

    // Renouvellement ou descente : on enchaîne après la DERNIÈRE période déjà
    // payée (plusieurs renouvellements d'avance ne se chevauchent pas).
    if (change.kind === 'renewal' || change.kind === 'downgrade') {
      const last = await latestPaidExpiry(tx.user_id)
      if (last && last.getTime() > change.startsAt.getTime()) {
        change.startsAt = last
        change.expiresAt = addInterval(last, tx.billing_interval)
      }
    }

    const { data: inserted, error } = await supabaseAdmin.from('subscriptions').insert({
      user_id: tx.user_id,
      plan,
      status: change.kind === 'new' || change.kind === 'upgrade' ? 'active' : 'pending',
      billing_interval: tx.billing_interval,
      amount: tx.amount,
      currency: tx.currency,
      started_at: change.startsAt.toISOString(),
      expires_at: change.expiresAt.toISOString(),
      payment_provider: 'feexpay',
      provider_transaction_id: tx.reference,
      feexpay_ref: tx.reference,
      product_key: tx.product_key,
      source: 'payment',
      notes: change.creditDays > 0 ? `Montée de formule : ${change.creditDays} jour(s) de crédit reporté(s).` : null,
    }).select('id').single()

    let subscriptionId = (inserted as { id: string } | null)?.id ?? null
    if (error) {
      // Doublon (index unique) : l'abonnement existe déjà pour cette transaction.
      const { data: existing } = await supabaseAdmin.from('subscriptions')
        .select('id').eq('payment_provider', 'feexpay').eq('provider_transaction_id', tx.reference).maybeSingle()
      if (!existing) throw error
      subscriptionId = (existing as { id: string }).id
    }

    // Montée : la formule en cours est remplacée (son reste a été crédité) ;
    // les périodes déjà payées d'avance sont décalées après la nouvelle
    // échéance, sans perte de durée.
    if (change.kind === 'upgrade' && current) {
      await supabaseAdmin.from('subscriptions')
        .update({ status: 'canceled', cancelled_at: now.toISOString(), notes: 'Remplacé par une montée de formule (crédit reporté).' })
        .eq('id', current.id)

      const { data: queued } = await supabaseAdmin.from('subscriptions')
        .select('id, started_at, expires_at').eq('user_id', tx.user_id).eq('status', 'pending')
        .neq('id', subscriptionId!).gt('started_at', now.toISOString()).order('started_at', { ascending: true })
      let cursor = change.expiresAt.getTime()
      for (const q of (queued ?? []) as { id: string; started_at: string; expires_at: string | null }[]) {
        if (!q.expires_at) continue
        const duration = new Date(q.expires_at).getTime() - new Date(q.started_at).getTime()
        await supabaseAdmin.from('subscriptions').update({
          started_at: new Date(cursor).toISOString(), expires_at: new Date(cursor + duration).toISOString(),
        }).eq('id', q.id)
        cursor += duration
      }
    }

    await supabaseAdmin.from('payment_transactions')
      .update({ subscription_id: subscriptionId, change_kind: change.kind, updated_at: new Date().toISOString() })
      .eq('id', tx.id)
    await supabaseAdmin.rpc('refresh_user_plan', { p_user_id: tx.user_id })

    return { outcome: 'activated' as const, change, subscriptionId }
  } catch (err) {
    // Échec après réclamation : on rend la transaction retraitable.
    await supabaseAdmin.from('payment_transactions')
      .update({ status: 'pending', processed_at: null, updated_at: new Date().toISOString() })
      .eq('id', tx.id).eq('status', 'successful').is('subscription_id', null)
    throw err
  }
}

export type ProcessOutcome =
  | 'activated' | 'already_processed' | 'still_pending' | 'closed' | 'unknown_transaction' | 'rejected'

/**
 * Traite une notification (webhook), une vérification demandée par l'élève
 * ou la passe planifiée — même règle dans les trois cas.
 */
export async function processPayment(reference: string, source: 'webhook' | 'poll' | 'cron'): Promise<{ outcome: ProcessOutcome; transaction: TransactionRow | null }> {
  const { data } = await supabaseAdmin.from('payment_transactions').select(TX_COLUMNS).eq('reference', reference).maybeSingle()
  const tx = (data ?? null) as TransactionRow | null

  if (!tx) {
    await logWebhookEvent(reference, false, 'unknown_transaction', source)
    return { outcome: 'unknown_transaction', transaction: null }
  }
  if (tx.status !== 'pending') {
    if (source === 'webhook') await logWebhookEvent(reference, true, 'already_processed', tx.status)
    return { outcome: 'already_processed', transaction: tx }
  }

  const provider = await fetchTransactionStatus(tx.provider_reference ?? tx.reference)
  const decision = decidePayment(tx, provider)

  await supabaseAdmin.from('payment_transactions')
    .update({ provider_status: provider.rawStatus, updated_at: new Date().toISOString() }).eq('id', tx.id)

  switch (decision.action) {
    case 'activate': {
      const r = await activate(tx)
      await logWebhookEvent(reference, true, r.outcome, source)
      return { outcome: r.outcome, transaction: { ...tx, status: 'successful' } }
    }
    case 'close': {
      await supabaseAdmin.from('payment_transactions')
        .update({ status: decision.status, processed_at: new Date().toISOString(), failure_reason: provider.rawStatus })
        .eq('id', tx.id).eq('status', 'pending')
      await logWebhookEvent(reference, true, `closed_${decision.status}`, source)
      return { outcome: 'closed', transaction: { ...tx, status: decision.status } }
    }
    case 'reject': {
      await supabaseAdmin.from('payment_transactions')
        .update({ status: 'failed', processed_at: new Date().toISOString(), failure_reason: decision.reason })
        .eq('id', tx.id).eq('status', 'pending')
      await logWebhookEvent(reference, true, `rejected_${decision.reason}`, `${source} ; reçu=${provider.amount} ${provider.currency ?? ''}, attendu=${tx.amount} ${tx.currency}`)
      console.warn(`[billing] transaction ${reference} rejetée : ${decision.reason}`)
      return { outcome: 'rejected', transaction: { ...tx, status: 'failed' } }
    }
    default:
      return { outcome: 'still_pending', transaction: tx }
  }
}
