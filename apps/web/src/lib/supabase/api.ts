import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { createClient as createSupabaseClient, type SupabaseClient, type User } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import type { Database } from '@alpha-kelassi/types'

const SUPABASE_URL = process.env['NEXT_PUBLIC_SUPABASE_URL']!
const ANON_KEY = process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY']!

async function cookieClient(): Promise<SupabaseClient<Database>> {
  const cookieStore = await cookies()
  return createServerClient<Database>(SUPABASE_URL, ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {
          // appelé depuis un contexte en lecture seule — ignoré
        }
      },
    },
  })
}

/**
 * Authentifie l'appelant qu'il provienne :
 *  - du **web** (session Supabase via cookies SSR), ou
 *  - du **mobile** (en-tête `Authorization: Bearer <access_token>`).
 *
 * Renvoie l'utilisateur (ou null) et un client Supabase scellé à ce user,
 * si bien que la RLS s'applique de la même façon dans les deux cas.
 *
 * À utiliser dans toute route API appelée à la fois par le web et l'app mobile.
 */
export async function authenticate(
  req: Request
): Promise<{ user: User | null; supabase: SupabaseClient<Database> }> {
  const authHeader = req.headers.get('authorization') ?? req.headers.get('Authorization')

  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7)
    const supabase = createSupabaseClient<Database>(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
      auth: { persistSession: false, autoRefreshToken: false },
    })
    const {
      data: { user },
    } = await supabase.auth.getUser(token)
    return { user, supabase }
  }

  const supabase = await cookieClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return { user, supabase }
}
