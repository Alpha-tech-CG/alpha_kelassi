import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { isAllowedAdminEmail } from '@/lib/admin-allowlist'

// Client service role partagé (bypass RLS) pour les opérations admin
export const supabaseAdmin = createAdminClient(
  process.env['NEXT_PUBLIC_SUPABASE_URL']!,
  process.env['SUPABASE_SERVICE_ROLE_KEY']!
)

/**
 * Vérifie que l'appelant est un admin authentifié.
 * Retourne { userId } si OK, sinon une NextResponse d'erreur à renvoyer tel quel.
 */
export async function requireAdmin(): Promise<{ userId: string } | { error: NextResponse }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: NextResponse.json({ error: 'Non authentifié' }, { status: 401 }) }

  // Deux verrous indépendants : la liste blanche d'adresses ET le rôle en base.
  // Un rôle `admin` accordé par erreur ne suffit donc pas à entrer.
  if (!isAllowedAdminEmail(user.email)) {
    return { error: NextResponse.json({ error: 'Admin requis' }, { status: 403 }) }
  }

  const { data: profile } = await supabaseAdmin.from('users').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return { error: NextResponse.json({ error: 'Admin requis' }, { status: 403 }) }

  // Aucune double authentification exigée : l'accès admin repose sur la liste
  // blanche d'adresses ET le rôle `admin` en base, jugés suffisants.
  return { userId: user.id }
}
