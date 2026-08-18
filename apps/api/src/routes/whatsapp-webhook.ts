import { Hono } from 'hono'
import { createHmac, timingSafeEqual } from 'node:crypto'
import { supabaseAdmin } from '../lib/supabase.js'

const router = new Hono()

// Vérifie la signature Meta X-Hub-Signature-256 = "sha256=" + HMAC-SHA256(app secret, corps brut).
// Fail-closed : sans WHATSAPP_APP_SECRET configuré ou signature invalide → rejet.
function verifySignature(rawBody: string, header: string | undefined): boolean {
  const secret = process.env['WHATSAPP_APP_SECRET']
  if (!secret || !header) return false
  const expected = 'sha256=' + createHmac('sha256', secret).update(rawBody).digest('hex')
  const received = Buffer.from(header)
  const digest = Buffer.from(expected)
  return received.length === digest.length && timingSafeEqual(received, digest)
}

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
  // Corps brut requis pour valider la signature avant tout traitement.
  const raw = await c.req.text()
  if (!verifySignature(raw, c.req.header('x-hub-signature-256'))) {
    return c.text('Forbidden', 403)
  }

  let payload: any
  try { payload = JSON.parse(raw) } catch { return c.json({ ok: true }) }

  try {
    const changes = payload?.entry?.[0]?.changes ?? []
    for (const change of changes) {
      const value = change?.value ?? {}

      // 1. Messages entrants : gérer le désabonnement "STOP"
      for (const msg of value.messages ?? []) {
        // msg.from est fourni par l'expéditeur : on le réduit aux chiffres pour
        // éviter toute injection dans le filtre PostgREST, puis on requête via .in().
        const from = typeof msg.from === 'string' ? msg.from.replace(/[^0-9]/g, '') : ''
        const text = (msg.text?.body ?? '').trim().toUpperCase()
        if (from && ['STOP', 'ARRET', 'ARRÊT'].includes(text)) {
          await supabaseAdmin
            .from('users')
            .update({ whatsapp_opt_in: false })
            .in('phone', [`+${from}`, from])
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
