import { NextRequest, NextResponse } from 'next/server'
import { PLAN_META, normalizePlan } from '@alpha-kelassi/types'
import { authenticate } from '@/lib/supabase/api'
import { supabaseAdmin } from '@/lib/admin-guard'
import { rateLimit, tooMany } from '@/lib/rate-limit'
import { processPayment } from '@/lib/billing/subscriptions'

/**
 * GET /api/billing/feexpay/status?reference=klsi_… — suivi d'un paiement.
 *
 * Appelé en boucle par l'application pendant que l'élève confirme sur son
 * téléphone. Si la transaction est encore en attente, on relit son statut
 * auprès de FeexPay : l'abonnement s'active même si le webhook n'arrive pas.
 */
export async function GET(req: NextRequest) {
  const { user } = await authenticate(req)
  if (!user) return NextResponse.json({ error: { code: 'UNAUTHORIZED' } }, { status: 401 })
  if (!(await rateLimit(`feexpay-status:${user.id}`, 60, 300))) return tooMany()

  const reference = req.nextUrl.searchParams.get('reference') ?? ''
  if (!/^klsi_[a-f0-9]{18}$/.test(reference)) {
    return NextResponse.json({ error: { code: 'BAD_REQUEST' } }, { status: 400 })
  }

  const { data: owned } = await supabaseAdmin.from('payment_transactions')
    .select('id, status').eq('reference', reference).eq('user_id', user.id).maybeSingle()
  if (!owned) return NextResponse.json({ error: { code: 'NOT_FOUND' } }, { status: 404 })

  const result = (owned as { status: string }).status === 'pending'
    ? await processPayment(reference, 'poll')
    : null

  const { data: tx } = await supabaseAdmin.from('payment_transactions')
    .select('reference, plan, billing_interval, amount, status, change_kind, failure_reason, processed_at')
    .eq('reference', reference).single()
  const row = tx as { plan: string; status: string; change_kind: string | null } & Record<string, unknown>

  const messages: Record<string, string> = {
    pending: 'Confirme le paiement sur ton téléphone (code Mobile Money)…',
    successful: row.change_kind === 'renewal' || row.change_kind === 'downgrade'
      ? `Paiement reçu. Ta formule ${PLAN_META[normalizePlan(row.plan)].label} démarrera à la fin de ta période en cours.`
      : `Paiement reçu. Ta formule ${PLAN_META[normalizePlan(row.plan)].label} est active.`,
    failed: 'Le paiement a échoué. Aucun montant n’a été validé ; tu peux réessayer.',
    cancelled: 'Le paiement a été annulé.',
    expired: 'La demande de paiement a expiré. Relance-la quand tu es prêt.',
  }

  return NextResponse.json({ data: { ...row, outcome: result?.outcome ?? null, message: messages[row.status] ?? '' } })
}
