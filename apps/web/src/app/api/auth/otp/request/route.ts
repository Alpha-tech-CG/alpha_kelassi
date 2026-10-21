import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { rateLimit } from '@/lib/rate-limit'

const schema = z.object({
  phone: z.string().regex(/^\+[0-9]{8,15}$/),
})

function rateLimited() {
  return NextResponse.json(
    { error: { code: 'RATE_LIMITED', message: 'Trop de tentatives, réessaie dans quelques minutes.' } },
    { status: 429 }
  )
}

function clientIp(req: Request): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
}

/**
 * POST /api/auth/otp/request — envoie un code SMS pour la connexion par
 * téléphone.
 *
 * Passe par le serveur pour appliquer un rate limiting anti-spam SMS
 * (un attaquant sans frein pourrait spammer l'envoi d'OTP à volonté).
 */
export async function POST(req: Request) {
  let body: z.infer<typeof schema>
  try {
    body = schema.parse(await req.json())
  } catch {
    return NextResponse.json({ error: { code: 'BAD_REQUEST', message: 'Requête invalide.' } }, { status: 400 })
  }

  const ip = clientIp(req)
  const ok = await rateLimit(`otp:${ip}:${body.phone}`, 5, 15 * 60)
  if (!ok) return rateLimited()

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithOtp({ phone: body.phone })

  if (error) {
    return NextResponse.json({ error: { code: 'AUTH_ERROR', message: error.message } }, { status: 400 })
  }

  return NextResponse.json({ data: { ok: true } })
}
