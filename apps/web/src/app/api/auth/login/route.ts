import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { rateLimitStrict } from '@/lib/rate-limit'
import { authErrorMessage } from '@/lib/auth-errors'

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
  const email = body.email.toLowerCase()
  // Par IP + compte, puis par compte seul (changer d'IP ne relance pas les essais).
  const ok = await rateLimitStrict(`login:${ip}:${email}`, 5, 15 * 60)
    && await rateLimitStrict(`login-account:${email}`, 20, 60 * 60)
  if (!ok) return rateLimited()

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({
    email: body.email,
    password: body.password,
  })

  if (error) {
    // Compte jamais confirmé : la page de connexion bascule sur la saisie du code.
    const code = error.code === 'email_not_confirmed' ? 'EMAIL_NOT_CONFIRMED' : 'AUTH_ERROR'
    return NextResponse.json({ error: { code, message: authErrorMessage(error) } }, { status: 400 })
  }

  return NextResponse.json({ data: { redirectTo: '/dashboard' } })
}
