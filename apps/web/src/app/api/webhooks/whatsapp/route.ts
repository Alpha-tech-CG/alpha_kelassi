import { NextResponse, type NextRequest } from 'next/server'
import { createHmac, timingSafeEqual } from 'crypto'
import { supabaseAdmin } from '@/lib/admin-guard'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** Comparaison à temps constant de deux secrets (évite les attaques temporelles). */
function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a)
  const bb = Buffer.from(b)
  return ab.length === bb.length && timingSafeEqual(ab, bb)
}

// Signature Meta X-Hub-Signature-256 = "sha256=" + HMAC-SHA256(app secret, corps brut).
// Fail-closed : sans WHATSAPP_APP_SECRET configuré ou signature invalide → rejet.
function verifySignature(rawBody: string, header: string | null): boolean {
  const secret = process.env['WHATSAPP_APP_SECRET']
  if (!secret || !header) return false
  const expected = 'sha256=' + createHmac('sha256', secret).update(rawBody).digest('hex')
  const received = Buffer.from(header)
  const digest = Buffer.from(expected)
  return received.length === digest.length && timingSafeEqual(received, digest)
}

// GET /api/webhooks/whatsapp — vérification de l'abonnement (handshake Meta)
export function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams
  const mode = sp.get('hub.mode')
  const token = sp.get('hub.verify_token')
  const challenge = sp.get('hub.challenge')
  const expected = process.env['WHATSAPP_VERIFY_TOKEN']

  // Fail-closed : sans token configuré, aucun handshake n'est accepté.
  if (!expected || mode !== 'subscribe' || !token || !safeEqual(token, expected)) {
    return new NextResponse('Forbidden', { status: 403 })
  }
  // Le challenge est renvoyé tel quel : on le contraint à un jeton court et
  // alphanumérique (format Meta) pour ne rien refléter d'arbitraire.
  if (!challenge || !/^[A-Za-z0-9_-]{1,128}$/.test(challenge)) {
    return new NextResponse('Bad Request', { status: 400 })
  }
  return new NextResponse(challenge, {
    status: 200,
    headers: { 'Content-Type': 'text/plain' },
  })
}

interface WhatsAppMessage {
  from?: string
  text?: { body?: string }
}
interface WhatsAppStatus {
  id?: string
  status?: string
}
interface WhatsAppChange {
  value?: { messages?: WhatsAppMessage[]; statuses?: WhatsAppStatus[] }
}

// POST /api/webhooks/whatsapp — messages entrants + statuts de livraison
export async function POST(req: NextRequest) {
  // Corps brut requis pour valider la signature avant tout traitement.
  const raw = await req.text()
  if (!verifySignature(raw, req.headers.get('x-hub-signature-256'))) {
    return new NextResponse('Forbidden', { status: 403 })
  }

  let payload: { entry?: Array<{ changes?: WhatsAppChange[] }> }
  try {
    payload = JSON.parse(raw)
  } catch {
    return NextResponse.json({ ok: true })
  }

  try {
    const changes = payload?.entry?.[0]?.changes ?? []
    for (const change of changes) {
      const value = change?.value ?? {}

      // 1. Messages entrants : gérer le désabonnement « STOP »
      for (const msg of value.messages ?? []) {
        // msg.from vient de l'expéditeur : on le réduit aux chiffres pour éviter
        // toute injection dans le filtre PostgREST, puis on requête via .in().
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
        const providerId = st.id
        const deliveryStatus = DELIVERY_STATUSES.find((s) => s === st.status)
        if (providerId && deliveryStatus) {
          await supabaseAdmin
            .from('message_log')
            .update({ status: deliveryStatus })
            .eq('provider_id', providerId)
        }
      }
    }
  } catch (e) {
    console.error('[webhooks/whatsapp] erreur de traitement:', e instanceof Error ? e.message : e)
  }

  // Toujours 200 pour éviter les redéclenchements Meta.
  return NextResponse.json({ ok: true })
}
