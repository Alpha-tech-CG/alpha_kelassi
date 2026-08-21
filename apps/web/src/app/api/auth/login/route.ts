import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { rateLimit } from '@/lib/rate-limit'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
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
 * POST /api/auth/login — connexion par email/mot de passe.
 *
 * Passe par le serveur (au lieu d'un appel Supabase direct depuis le
 * navigateur) pour pouvoir appliquer un rate limiting anti-bruteforce, et
 * pose la session dans les cookies via le client Supabase SSR.
 */
export async function POST(req: Request) {
  let body: z.infer<typeof schema>
  try {
    body = schema.parse(await req.json())
  } catch {
    return NextResponse.json({ error: { code: 'BAD_REQUEST', message: 'Requête invalide.' } }, { status: 400 })
  }

  const ip = clientIp(req)
  const ok = await rateLimit(`login:${ip}:${body.email.toLowerCase()}`, 5, 15 * 60)
  if (!ok) return rateLimited()

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({
    email: body.email,
    password: body.password,
  })

  if (error) {
    return NextResponse.json({ error: { code: 'AUTH_ERROR', message: error.message } }, { status: 400 })
  }

  return NextResponse.json({ data: { redirectTo: '/dashboard' } })
}
