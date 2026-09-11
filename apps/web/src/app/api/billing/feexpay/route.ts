import { NextResponse } from 'next/server'
import { randomBytes } from 'crypto'
import { z } from 'zod'
import {
  PLAN_META, SUBSCRIPTION_PRODUCTS, computeSubscriptionChange, formatFcfa, isProductKey,
} from '@alpha-kelassi/types'
import { authenticate } from '@/lib/supabase/api'
import { supabaseAdmin } from '@/lib/admin-guard'
import { rateLimit, tooMany } from '@/lib/rate-limit'
import { assertTrustedOrigin } from '@/lib/origin-check'
import { feexpayConfig, requestToPay } from '@/lib/billing/feexpay'
import { currentSubscription } from '@/lib/billing/subscriptions'

const schema = z.object({
  product: z.string().refine(isProductKey, 'Formule inconnue'),
  phone: z.string().regex(/^\+?[0-9]{8,15}$/),
  network: z.string().regex(/^[A-Z][A-Z _]{1,20}$/),
})

/**
 * POST /api/billing/feexpay — lance un paiement Mobile Money pour une formule.
 *
 * Le prix vient du serveur (jamais du client). La transaction est enregistrée
 * EN BASE avant l'appel à FeexPay : c'est elle qui relie la référence à
 * l'élève et à la formule, sans expiration (l'ancien lien Redis disparaissait
 * au bout d'une heure, et avec lui un paiement confirmé tardivement).
 * L'abonnement ne sera activé qu'après vérification serveur du paiement.
 */
export async function POST(req: Request) {
  if (!assertTrustedOrigin(req)) {
    return NextResponse.json({ error: { code: 'FORBIDDEN', message: 'Origine non autorisée.' } }, { status: 403 })
  }

  const { user } = await authenticate(req)
  if (!user) return NextResponse.json({ error: { code: 'UNAUTHORIZED' } }, { status: 401 })
  if (!(await rateLimit(`feexpay:${user.id}`, 5, 3600))) return tooMany()

  const raw = await req.json().catch(() => null) as Record<string, unknown> | null
  // Anciennes versions de l'application (offre Premium unique) : on refuse
  // plutôt que de facturer une formule ambiguë.
  if (raw && typeof raw['plan'] === 'string' && !raw['product']) {
    return NextResponse.json({
      error: { code: 'APP_UPDATE_REQUIRED', message: 'Les formules ont changé. Mets à jour l’application pour choisir ta formule.' },
    }, { status: 426 })
  }

  const parsed = schema.safeParse(raw)
  if (!parsed.success) return NextResponse.json({ error: { code: 'BAD_REQUEST', message: 'Formule, numéro ou opérateur invalide.' } }, { status: 400 })
  const body = parsed.data

  if (!feexpayConfig()) {
    return NextResponse.json({ error: { code: 'FEEXPAY_NOT_CONFIGURED', message: 'Le paiement est momentanément indisponible.' } }, { status: 503 })
  }

  const product = SUBSCRIPTION_PRODUCTS[body.product as keyof typeof SUBSCRIPTION_PRODUCTS]
  const current = await currentSubscription(user.id)
  const change = computeSubscriptionChange(current, { plan: product.plan, interval: product.interval })

  const reference = `klsi_${randomBytes(9).toString('hex')}`
  const localDigits = body.phone.replace(/[^0-9]/g, '').replace(/^242/, '')

  const { data: tx, error: txError } = await supabaseAdmin.from('payment_transactions').insert({
    reference,
    user_id: user.id,
    provider: 'feexpay',
    product_key: body.product,
    plan: product.plan,
    billing_interval: product.interval,
    amount: product.amount,
    currency: product.currency,
    status: 'pending',
    change_kind: change.kind,
    network: body.network,
    phone_last4: localDigits.slice(-4),
  }).select('id').single()
  if (txError || !tx) {
    console.error('[/api/billing/feexpay] transaction', txError)
    return NextResponse.json({ error: { code: 'DB_ERROR', message: 'Le paiement n’a pas pu être préparé. Réessaie.' } }, { status: 500 })
  }

  const label = `${PLAN_META[product.plan].label} ${product.interval === 'month' ? 'mensuel' : 'annuel'}`
  const pay = await requestToPay({
    amount: product.amount,
    phoneLocalDigits: localDigits,
    network: body.network,
    reference,
    description: `Cognix ${label}`,
    email: user.email ?? '',
    firstName: (user.user_metadata?.['full_name'] as string | undefined) ?? 'Client',
  })

  if (!pay.ok) {
    await supabaseAdmin.from('payment_transactions')
      .update({ status: 'failed', failure_reason: pay.message ?? 'Refus FeexPay', processed_at: new Date().toISOString() })
      .eq('id', (tx as { id: string }).id)
    return NextResponse.json({ error: { code: 'FEEXPAY_ERROR', message: pay.message ?? 'Le paiement n’a pas pu être lancé.' } }, { status: 502 })
  }

  if (pay.providerReference) {
    await supabaseAdmin.from('payment_transactions').update({ provider_reference: pay.providerReference }).eq('id', (tx as { id: string }).id)
  }

  return NextResponse.json({
    data: {
      reference,
      status: 'pending',
      product: body.product,
      amount: product.amount,
      amount_label: formatFcfa(product.amount),
      change: {
        kind: change.kind,
        starts_at: change.startsAt.toISOString(),
        expires_at: change.expiresAt.toISOString(),
        credit_days: change.creditDays,
      },
    },
  }, { status: 201 })
}
