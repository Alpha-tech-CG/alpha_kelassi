import { Hono } from 'hono'
import { randomBytes } from 'node:crypto'
import type { AppVariables } from '../lib/types.js'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import Stripe from 'stripe'

import { authMiddleware } from '../middleware/auth.js'
import { redis } from '../lib/redis.js'

// Prix serveur de référence (XAF) — source de vérité, revalidée au webhook.
export const PLAN_AMOUNT: Record<'monthly' | 'yearly', number> = { monthly: 2000, yearly: 20000 }

const router = new Hono<{ Variables: AppVariables }>()

// Lazy — évite de faire planter tout le serveur au démarrage si
// STRIPE_SECRET_KEY n'est pas encore configurée (feature optionnelle)
let _stripe: Stripe | null = null
function getStripe(): Stripe {
  if (!_stripe) _stripe = new Stripe(process.env['STRIPE_SECRET_KEY'] || 'sk_test_placeholder')
  return _stripe
}

router.use('*', authMiddleware)

// POST /api/billing/checkout â€” crÃ©e une session Stripe Checkout
router.post(
  '/checkout',
  zValidator('json', z.object({ plan: z.enum(['monthly', 'yearly']) })),
  async (c) => {
    const userId = c.get('userId') as string
    const { plan } = c.req.valid('json')

    const priceId =
      plan === 'monthly'
        ? process.env['STRIPE_PRICE_PREMIUM_MONTHLY']!
        : process.env['STRIPE_PRICE_PREMIUM_YEARLY']!

    // RÃ©cupÃ¨re ou crÃ©e le customer Stripe
    const { data: user } = await c.get('supabase').from('users')
      .select('email')
      .eq('id', userId)
      .single()

    const session = await getStripe().checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      ...(user?.email ? { customer_email: user.email } : {}),
      subscription_data: { trial_period_days: 14 },
      metadata: { user_id: userId },
      success_url: `${process.env['NEXT_PUBLIC_SITE_URL']}/billing?success=true`,
      cancel_url: `${process.env['NEXT_PUBLIC_SITE_URL']}/billing?canceled=true`,
    })

    return c.json({ data: { url: session.url } })
  }
)

// POST /api/billing/feexpay — initie un paiement FeexPay Mobile Money (push)
//
// FeexPay envoie une invite Mobile Money sur le téléphone de l'utilisateur
// (« requesttopay »). On génère notre propre `reference`, on mémorise le lien
// reference → {user_id, plan} côté serveur (Redis, TTL 1h), puis le webhook
// FeexPay confirmera en re-vérifiant le statut. Le `callback_info` du callback
// n'est JAMAIS considéré comme fiable — l'intention d'achat est liée ici.
router.post(
  '/feexpay',
  zValidator(
    'json',
    z.object({
      plan: z.enum(['monthly', 'yearly']),
      phone: z.string().regex(/^\+?[0-9]{8,15}$/),
      // Réseau Mobile Money — doit correspondre à un opérateur activé sur la
      // boutique FeexPay (ex. Congo : MTN, AIRTEL). Validé en format simple.
      network: z.string().regex(/^[A-Z][A-Z _]{1,20}$/),
    })
  ),
  async (c) => {
    // Remplacé par apps/web (/api/billing/feexpay) : formules Starter, Pro et
    // Pro Max, transactions en base, webhook idempotent. Cette route, restée à
    // l'ancienne offre Premium unique, ne doit plus jamais encaisser.
    if (process.env['LEGACY_HONO_BILLING'] !== 'enabled') {
      return c.json({ error: { code: 'MOVED', message: 'Paiement déplacé vers /api/billing/feexpay (apps/web).' } }, 410)
    }
    const userId = c.get('userId') as string
    const { plan, phone, network } = c.req.valid('json')

    const token = process.env['FEEXPAY_TOKEN']
    const shop = process.env['FEEXPAY_SHOP']
    if (!token || !shop) {
      return c.json({ error: { code: 'FEEXPAY_NOT_CONFIGURED', message: 'Paiement indisponible' } }, 503)
    }

    const amount = PLAN_AMOUNT[plan]

    // Coordonnées client (facultatives pour FeexPay mais recommandées)
    const { data: user } = await c.get('supabase').from('users')
      .select('email, full_name')
      .eq('id', userId)
      .single()

    // Référence unique de transaction (aussi clé d'idempotence en base)
    const reference = `klsi_${randomBytes(9).toString('hex')}`

    // Lien serveur reference → intention d'achat, seule source fiable au webhook.
    await redis.set(
      `feexpay:intent:${reference}`,
      JSON.stringify({ user_id: userId, plan }),
      { ex: 3600 }
    )

    const response = await fetch('https://api.feexpay.me/api/transactions/requesttopay/integration', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phoneNumber: phone,
        amount,
        reseau: network,
        token,
        shop,
        first_name: user?.full_name ?? 'Client',
        email: user?.email ?? '',
        reference,
        callback_info: reference,
        callback_url: process.env['FEEXPAY_CALLBACK_URL'] ?? '',
        description: `Kelassi Premium — ${plan === 'monthly' ? 'Mensuel' : 'Annuel'}`,
      }),
    })

    const data = (await response.json().catch(() => ({}))) as {
      reference?: string
      status?: string
      message?: string
    }

    if (!response.ok || data.status === 'FAILED') {
      await redis.del(`feexpay:intent:${reference}`)
      return c.json({ error: { code: 'FEEXPAY_ERROR', message: data.message ?? 'Erreur paiement' } }, 502)
    }

    // On renvoie la référence : le client affiche « confirmez sur votre
    // téléphone » et interroge /billing/subscription jusqu'à activation.
    return c.json({ data: { reference, status: data.status ?? 'PENDING' } })
  }
)

// GET /api/billing/subscription â€” statut abonnement courant
router.get('/subscription', async (c) => {
  const userId = c.get('userId') as string

  const { data } = await c.get('supabase').from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  return c.json({ data })
})

// POST /api/billing/cancel â€” annule l'abonnement Stripe
router.post('/cancel', async (c) => {
  const userId = c.get('userId') as string

  const { data: sub } = await c.get('supabase').from('subscriptions')
    .select('stripe_sub_id')
    .eq('user_id', userId)
    .eq('status', 'active')
    .maybeSingle()

  if (!sub?.stripe_sub_id) {
    return c.json({ error: { code: 'NO_SUBSCRIPTION', message: 'Aucun abonnement actif' } }, 404)
  }

  await getStripe().subscriptions.update(sub.stripe_sub_id, { cancel_at_period_end: true })

  return c.json({ data: { canceled: true } })
})

export { router as billingRouter }


