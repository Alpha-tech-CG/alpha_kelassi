import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const type = searchParams.get('type')
  // Si aucun `next` explicite n'est fourni mais que Supabase indique un flux
  // de récupération de mot de passe (type=recovery), on route vers la page dédiée.
  const next = searchParams.get('next') ?? (type === 'recovery' ? '/update-password' : '/dashboard')

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_error`)
}
