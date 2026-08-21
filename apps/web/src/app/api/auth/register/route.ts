import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { rateLimit } from '@/lib/rate-limit'

const schema = z.object({
  fullName: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  level: z.string().min(1),
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
 * POST /api/auth/register — création de compte (email/mot de passe).
 *
 * Passe par le serveur pour appliquer un rate limiting anti-spam. Le seuil
 * est plus permissif qu'au login (une inscription légitime est rare, donc
 * un plafond par IP suffit sans pénaliser les usages normaux).
 */
export async function POST(req: Request) {
  let body: z.infer<typeof schema>
  try {
    body = schema.parse(await req.json())
  } catch {
    return NextResponse.json({ error: { code: 'BAD_REQUEST', message: 'Requête invalide.' } }, { status: 400 })
  }

  const ip = clientIp(req)
  const ok = await rateLimit(`register:${ip}`, 10, 60 * 60)
  if (!ok) return rateLimited()

  const { origin } = new URL(req.url)
  const supabase = await createClient()
  const { error } = await supabase.auth.signUp({
    email: body.email,
    password: body.password,
    options: {
      data: { full_name: body.fullName, study_level: body.level },
      emailRedirectTo: `${origin}/auth/callback`,
    },
  })

  if (error) {
    return NextResponse.json({ error: { code: 'AUTH_ERROR', message: error.message } }, { status: 400 })
  }

  return NextResponse.json({ data: { ok: true } })
}
