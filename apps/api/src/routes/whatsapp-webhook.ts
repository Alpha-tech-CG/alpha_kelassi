import { Hono } from 'hono'
import { supabaseAdmin } from '../lib/supabase.js'

const router = new Hono()

// GET /webhooks/whatsapp — vérification de l'abonnement (handshake Meta)
router.get('/', (c) => {
  const mode = c.req.query('hub.mode')
  const token = c.req.query('hub.verify_token')
  const challenge = c.req.query('hub.challenge')
  if (mode === 'subscribe' && token === process.env['WHATSAPP_VERIFY_TOKEN']) {
    return c.text(challenge ?? '', 200)
  }
  return c.text('Forbidden', 403)
})

// POST /webhooks/whatsapp — messages entrants + statuts de livraison
router.post('/', async (c) => {
  let payload: any
  try { payload = await c.req.json() } catch { return c.json({ ok: true }) }

  try {
    const changes = payload?.entry?.[0]?.changes ?? []
    for (const change of changes) {
      const value = change?.value ?? {}

      // 1. Messages entrants : gérer le désabonnement "STOP"
      for (const msg of value.messages ?? []) {
        const from = msg.from as string | undefined
        const text = (msg.text?.body ?? '').trim().toUpperCase()
        if (from && ['STOP', 'ARRET', 'ARRÊT'].includes(text)) {
          await supabaseAdmin
            .from('users')
            .update({ whatsapp_opt_in: false })
            .or(`phone.eq.+${from},phone.eq.${from}`)
        }
      }

      // 2. Statuts de livraison : mettre à jour message_log
      const DELIVERY_STATUSES = ['delivered', 'read', 'failed'] as const
      for (const st of value.statuses ?? []) {
        const providerId = st.id as string | undefined
        const status = st.status as string | undefined  // sent | delivered | read | failed
        const deliveryStatus = DELIVERY_STATUSES.find((s) => s === status)
        if (providerId && deliveryStatus) {
          await supabaseAdmin.from('message_log').update({ status: deliveryStatus }).eq('provider_id', providerId)
        }
      }
    }
  } catch (e) {
    console.error('[whatsapp-webhook] erreur de traitement:', e instanceof Error ? e.message : e)
  }

  // Toujours 200 pour éviter les redéclenchements Meta
  return c.json({ ok: true })
})

export { router as whatsappWebhookRouter }
