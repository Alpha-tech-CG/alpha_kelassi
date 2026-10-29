import { NextResponse } from 'next/server'
import { timingSafeEqual } from 'crypto'
import { supabaseAdmin } from '@/lib/admin-guard'
import { processPayment } from '@/lib/billing/subscriptions'
import { fetchPayoutStatus } from '@/lib/billing/feexpay'

export const maxDuration = 60

function authorized(req: Request): boolean {
  const secret = process.env['CRON_SECRET']
  const header = req.headers.get('authorization') ?? ''
  if (!secret) return false
  const expected = Buffer.from(`Bearer ${secret}`)
  const received = Buffer.from(header)
  return expected.length === received.length && timingSafeEqual(expected, received)
}

/**
 * GET /api/cron/subscriptions — passe planifiée (Vercel Cron, voir vercel.json).
 *
 *   1. Expire les abonnements arrivés à terme et démarre les renouvellements
 *      ou descentes programmés, puis rafraîchit le cache `users.plan`.
 *      (Les DROITS, eux, sont déjà calculés en temps réel par la base.)
 *   2. Relit auprès de FeexPay les paiements restés en attente (webhook perdu) ;
 *      au-delà de 24 h sans confirmation, la transaction est close « expirée ».
 *   3. Rapproche les retraits tuteurs en attente (voir reconcilePendingPayouts).
 */
export async function GET(req: Request) {
  if (!authorized(req)) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { data: refreshed, error } = await supabaseAdmin.rpc('refresh_due_subscriptions')
  if (error) console.error('[cron/subscriptions] refresh_due_subscriptions', error.message)

  const tenMinutesAgo = new Date(Date.now() - 10 * 60_000).toISOString()
  const { data: pending } = await supabaseAdmin.from('payment_transactions')
    .select('reference, created_at').eq('status', 'pending').lt('created_at', tenMinutesAgo)
    .order('created_at', { ascending: true }).limit(50)

  const outcomes: Record<string, number> = {}
  for (const tx of (pending ?? []) as { reference: string; created_at: string }[]) {
    try {
      const { outcome } = await processPayment(tx.reference, 'cron')
      outcomes[outcome] = (outcomes[outcome] ?? 0) + 1
      if (outcome === 'still_pending' && Date.now() - new Date(tx.created_at).getTime() > 24 * 3_600_000) {
        await supabaseAdmin.from('payment_transactions')
          .update({ status: 'expired', processed_at: new Date().toISOString(), failure_reason: 'Sans confirmation après 24 h' })
          .eq('reference', tx.reference).eq('status', 'pending')
        outcomes['expired'] = (outcomes['expired'] ?? 0) + 1
      }
    } catch (err) {
      console.error('[cron/subscriptions] transaction', tx.reference, err)
      outcomes['error'] = (outcomes['error'] ?? 0) + 1
    }
  }

  const payouts = await reconcilePendingPayouts(tenMinutesAgo)

  return NextResponse.json({ data: { subscriptions_refreshed: refreshed ?? null, transactions: outcomes, payouts } })
}

/**
 * 3. Rapproche les retraits tuteurs restés en attente : FeexPay dit
 *    SUCCESSFUL → complété ; FAILED → recrédit atomique (reconcile_failed_payout).
 *    Sans référence FeexPay, l'issue ne peut pas être relue : on la compte
 *    en « needs_review » pour une vérification manuelle, sans jamais recréditer.
 */
async function reconcilePendingPayouts(olderThanIso: string): Promise<Record<string, number>> {
  const { data: pending } = await supabaseAdmin.from('tutor_wallet_transactions')
    .select('id, provider_ref').eq('type', 'withdrawal').eq('status', 'pending').lt('created_at', olderThanIso)
    .order('created_at', { ascending: true }).limit(50)

  const outcomes: Record<string, number> = {}
  const count = (k: string) => { outcomes[k] = (outcomes[k] ?? 0) + 1 }
  for (const p of (pending ?? []) as { id: string; provider_ref: string | null }[]) {
    if (!p.provider_ref) { count('needs_review'); continue }
    const status = await fetchPayoutStatus(p.provider_ref)
    if (status === 'successful') {
      await supabaseAdmin.from('tutor_wallet_transactions').update({ status: 'completed' }).eq('id', p.id).eq('status', 'pending')
      count('completed')
    } else if (status === 'failed') {
      await supabaseAdmin.rpc('reconcile_failed_payout', { p_txn_id: p.id })
      count('refunded')
    } else {
      count(status ?? 'unreachable')
    }
  }
  return outcomes
}
