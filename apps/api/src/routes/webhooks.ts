import { Hono } from 'hono'
import Stripe from 'stripe'
import { supabaseAdmin as supabase } from '../lib/supabase.js'
import { redis } from '../lib/redis.js'
import { PLAN_AMOUNT } from './billing.js'

const router = new Hono()

// Lazy — évite de faire planter tout le serveur au démarrage si
// STRIPE_SECRET_KEY n'est pas encore configurée (feature optionnelle)
let _stripe: Stripe | null = null
function getStripe(): Stripe {
  if (!_stripe) _stripe = new Stripe(process.env['STRIPE_SECRET_KEY'] || 'sk_test_placeholder')
  return _stripe
}

// POST /webhooks/stripe
router.post('/stripe', async (c) => {
  const sig = c.req.header('stripe-signature')
  const body = await c.req.text()

  let event: Stripe.Event
  try {
    event = getStripe().webhooks.constructEvent(body, sig!, process.env['STRIPE_WEBHOOK_SECRET']!)
  } catch {
    return c.json({ error: 'Invalid signature' }, 400)
  }

  const sub = event.data.object as Stripe.Subscription
  const userId = sub.metadata?.['user_id']
  if (!userId) return c.json({ received: true })

  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const status = sub.status === 'active' || sub.status === 'trialing' ? 'active' : sub.status
      const plan = sub.items.data[0]?.price.id === process.env['STRIPE_PRICE_PREMIUM_YEARLY']
        ? 'premium' : 'premium'

      await supabase.from('subscriptions').upsert({
        user_id: userId,
        stripe_sub_id: sub.id,
        plan,
        status: status as 'active' | 'canceled' | 'past_due' | 'trialing',
        expires_at: new Date(sub.current_period_end * 1000).toISOString(),
      }, { onConflict: 'stripe_sub_id' })

      if (status === 'active') {
        await supabase.from('users').update({ plan: 'premium' }).eq('id', userId)
      }
      break
    }

    case 'customer.subscription.deleted': {
      await supabase
        .from('subscriptions')
        .update({ status: 'canceled' })
        .eq('stripe_sub_id', sub.id)

      await supabase.from('users').update({ plan: 'free' }).eq('id', userId)
      break
    }

    case 'invoice.payment_failed': {
      await supabase
        .from('subscriptions')
        .update({ status: 'past_due' })
        .eq('stripe_sub_id', (event.data.object as Stripe.Invoice).subscription as string)
      break
    }
  }

  return c.json({ received: true })
})

// POST /webhooks/feexpay — notification de paiement Mobile Money
//
// SÉCURITÉ : FeexPay ne signe pas ses callbacks. On ne fait donc AUCUNE
// confiance au corps reçu (un attaquant pourrait poster une fausse notif). Le
// callback ne sert que de déclencheur : on récupère la `reference`, on relit
// l'intention d'achat mémorisée à l'init (Redis, liée au vrai user), puis on
// RE-VÉRIFIE le statut et le montant directement auprès de l'API FeexPay.
router.post('/feexpay', async (c) => {
  const body = await c.req.json<Record<string, unknown>>().catch(() => ({} as Record<string, unknown>))

  // La référence est renvoyée dans `reference` ou dans `callback_info`.
  const reference =
    (typeof body['reference'] === 'string' && body['reference']) ||
    (typeof body['callback_info'] === 'string' && body['callback_info']) ||
    ''
  if (!reference || !/^klsi_[a-f0-9]{18}$/.test(reference)) {
    return c.json({ received: true })
  }

  const token = process.env['FEEXPAY_TOKEN']
  if (!token) return c.json({ received: true })

  // Intention d'achat liée au serveur à l'init — SEULE source fiable du user/plan.
  const raw = await redis.get<string>(`feexpay:intent:${reference}`)
  if (!raw) return c.json({ received: true }) // inconnue / expirée / déjà traitée
  let intent: { user_id?: string; plan?: 'monthly' | 'yearly' }
  try { intent = typeof raw === 'string' ? JSON.parse(raw) : (raw as never) } catch { return c.json({ received: true }) }
  const { user_id: userId, plan } = intent
  if (!userId || !plan) return c.json({ received: true })

  // Re-vérification serveur → serveur du statut réel de la transaction.
  const statusRes = await fetch(
    `https://api.feexpay.me/api/transactions/public/${encodeURIComponent(reference)}`,
    { headers: { Authorization: `Bearer ${token}` } }
  )
  const tx = (await statusRes.json().catch(() => ({}))) as { status?: string; amount?: number | string }

  if (!statusRes.ok || tx.status !== 'SUCCESSFUL') {
    return c.json({ received: true }) // pas (encore) payé — on ne fait rien
  }

  // Le montant réel doit correspondre au prix du plan demandé.
  const expectedAmount = PLAN_AMOUNT[plan]
  if (Number(tx.amount) !== expectedAmount) {
    console.warn(
      `[feexpay-webhook] montant incohérent pour ${reference}: ` +
      `reçu=${tx.amount}, attendu=${expectedAmount} (plan=${plan}) — rejeté`
    )
    return c.json({ error: 'Amount mismatch' }, 400)
  }

  const expiresAt = new Date()
  expiresAt.setMonth(expiresAt.getMonth() + (plan === 'yearly' ? 12 : 1))

  // Idempotent : `feexpay_ref` est unique en base — upsert pour ne jamais créer
  // de doublon ni prolonger indûment si le callback est rejoué.
  const { error: subError } = await supabase.from('subscriptions').upsert({
    user_id: userId,
    feexpay_ref: reference,
    plan: 'premium',
    status: 'active',
    expires_at: expiresAt.toISOString(),
  }, { onConflict: 'feexpay_ref' })

  if (subError) {
    console.error(`[feexpay-webhook] échec upsert abonnement ${reference}:`, subError.message)
    return c.json({ error: 'DB error' }, 500) // FeexPay rejouera
  }

  await supabase.from('users').update({ plan: 'premium' }).eq('id', userId)
  await redis.del(`feexpay:intent:${reference}`) // consommée

  return c.json({ received: true })
})

export { router as webhooksRouter }

