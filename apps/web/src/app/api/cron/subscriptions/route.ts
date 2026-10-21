import { NextResponse } from 'next/server'
import { timingSafeEqual } from 'crypto'
import { supabaseAdmin } from '@/lib/admin-guard'
import { processPayment } from '@/lib/billing/subscriptions'

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

  return NextResponse.json({ data: { subscriptions_refreshed: refreshed ?? null, transactions: outcomes } })
}
