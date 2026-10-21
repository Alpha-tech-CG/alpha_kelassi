import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { rateLimit } from '@/lib/rate-limit'

const schema = z.object({
  phone: z.string().regex(/^\+[0-9]{8,15}$/),
  token: z.string().min(4).max(10),
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
 * POST /api/auth/otp/verify — vérifie le code SMS et ouvre la session.
 *
 * Passe par le serveur pour appliquer un rate limiting anti-bruteforce sur
 * le code à 6 chiffres, et pose la session dans les cookies via le client
 * Supabase SSR (au lieu d'un appel direct navigateur).
 */
export async function POST(req: Request) {
  let body: z.infer<typeof schema>
  try {
    body = schema.parse(await req.json())
  } catch {
    return NextResponse.json({ error: { code: 'BAD_REQUEST', message: 'Requête invalide.' } }, { status: 400 })
  }

  const ip = clientIp(req)
  const ok = await rateLimit(`otp-verify:${ip}:${body.phone}`, 5, 15 * 60)
  if (!ok) return rateLimited()

  const supabase = await createClient()
  const { error } = await supabase.auth.verifyOtp({
    phone: body.phone,
    token: body.token,
    type: 'sms',
  })

  if (error) {
    return NextResponse.json(
      { error: { code: 'AUTH_ERROR', message: 'Code invalide ou expiré. Réessaie.' } },
      { status: 400 }
    )
  }

  return NextResponse.json({ data: { redirectTo: '/dashboard' } })
}
