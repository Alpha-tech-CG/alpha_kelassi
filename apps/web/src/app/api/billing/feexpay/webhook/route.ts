import { NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rate-limit'
import { logWebhookEvent, processPayment } from '@/lib/billing/subscriptions'

export const maxDuration = 30

/**
 * POST /api/billing/feexpay/webhook — notification de paiement FeexPay.
 * À déclarer dans FeexPay comme URL de rappel (FEEXPAY_CALLBACK_URL).
 *
 * SÉCURITÉ : FeexPay ne signe pas ses notifications. Le corps reçu ne sert
 * qu'à extraire la référence ; le statut et le montant sont RELUS auprès de
 * FeexPay, et la transaction doit exister en base. Une référence inconnue est
 * journalisée et n'active rien. Idempotent : une notification rejouée est
 * reconnue et ignorée.
 *
 * Réponses : 200 dès que la notification est prise en compte (même ignorée),
 * pour que FeexPay cesse de la renvoyer ; 500 seulement si un traitement
 * légitime a échoué et doit être retenté.
 */
export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'inconnu'
  if (!(await rateLimit(`feexpay-webhook:${ip}`, 120, 60))) {
    return NextResponse.json({ received: false }, { status: 429 })
  }

  const body = await req.json().catch(() => ({})) as Record<string, unknown>
  const reference =
    (typeof body['reference'] === 'string' && body['reference']) ||
    (typeof body['callback_info'] === 'string' && body['callback_info']) ||
    ''

  if (!/^klsi_[a-f0-9]{18}$/.test(reference)) {
    await logWebhookEvent(reference ? reference.slice(0, 64) : null, false, 'invalid_reference')
    return NextResponse.json({ received: true })
  }

  try {
    const { outcome } = await processPayment(reference, 'webhook')
    return NextResponse.json({ received: true, outcome })
  } catch (err) {
    console.error('[feexpay-webhook] traitement impossible', reference, err)
    await logWebhookEvent(reference, true, 'processing_error', err instanceof Error ? err.message : String(err))
    return NextResponse.json({ received: false }, { status: 500 })
  }
}
