import { NextResponse } from 'next/server'
import { randomBytes } from 'crypto'
import { z } from 'zod'
import { authenticate } from '@/lib/supabase/api'
import { redis } from '@/lib/redis'
import { rateLimit, tooMany } from '@/lib/rate-limit'
import { assertTrustedOrigin } from '@/lib/origin-check'

// Prix serveur de référence (XAF). Doit rester synchronisé avec le webhook
// (apps/api/src/routes/webhooks.ts → PLAN_AMOUNT).
const PLAN_AMOUNT: Record<'monthly' | 'yearly', number> = { monthly: 2000, yearly: 20000 }

const schema = z.object({
  plan: z.enum(['monthly', 'yearly']),
  phone: z.string().regex(/^\+?[0-9]{8,15}$/),
  network: z.string().regex(/^[A-Z][A-Z _]{1,20}$/),
})

/**
 * POST /api/billing/feexpay — initie un paiement FeexPay Mobile Money (push).
 *
 * FeexPay envoie une invite Mobile Money sur le téléphone. On mémorise le lien
 * reference → {user_id, plan} côté serveur (Redis, TTL 1h), seule source fiable
 * au webhook `/webhooks/feexpay` (hébergé par apps/api, même Redis + même DB).
 */
export async function POST(req: Request) {
  if (!assertTrustedOrigin(req)) {
    return NextResponse.json({ error: { code: 'FORBIDDEN', message: 'Origine non autorisée.' } }, { status: 403 })
  }

  const { user } = await authenticate(req)
  if (!user) return NextResponse.json({ error: { code: 'UNAUTHORIZED' } }, { status: 401 })
  if (!(await rateLimit(`feexpay:${user.id}`, 5, 3600))) return tooMany()

  let body: z.infer<typeof schema>
  try { body = schema.parse(await req.json()) }
  catch { return NextResponse.json({ error: { code: 'BAD_REQUEST' } }, { status: 400 }) }

  const token = process.env['FEEXPAY_TOKEN']
  const shop = process.env['FEEXPAY_SHOP']
  if (!token || !shop) {
    return NextResponse.json({ error: { code: 'FEEXPAY_NOT_CONFIGURED', message: 'Paiement indisponible' } }, { status: 503 })
  }

  const amount = PLAN_AMOUNT[body.plan]
  const reference = `klsi_${randomBytes(9).toString('hex')}`

  // Lien serveur reference → intention d'achat (seule source fiable au webhook).
  await redis.set(
    `feexpay:intent:${reference}`,
    JSON.stringify({ user_id: user.id, plan: body.plan }),
    { ex: 3600 }
  )

  const localDigits = body.phone.replace(/[^0-9]/g, '')
  const res = await fetch('https://api.feexpay.me/api/transactions/requesttopay/integration', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      phoneNumber: `242${localDigits}`,
      amount,
      reseau: body.network,
      token,
      shop,
      first_name: user.user_metadata?.['full_name'] ?? 'Client',
      email: user.email ?? '',
      reference,
      callback_info: reference,
      callback_url: process.env['FEEXPAY_CALLBACK_URL'] ?? '',
      description: `Kelassi Premium — ${body.plan === 'monthly' ? 'Mensuel' : 'Annuel'}`,
    }),
  })

  const data = (await res.json().catch(() => ({}))) as { status?: string; message?: string }
  if (!res.ok || data.status === 'FAILED') {
    await redis.del(`feexpay:intent:${reference}`)
    return NextResponse.json({ error: { code: 'FEEXPAY_ERROR', message: data.message ?? 'Erreur paiement' } }, { status: 502 })
  }

  return NextResponse.json({ data: { reference, status: data.status ?? 'PENDING' } }, { status: 201 })
}
