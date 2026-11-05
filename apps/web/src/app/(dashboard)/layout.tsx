import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AppShell, type ShellProfile } from '@/components/app-shell'
import { isAllowedAdminEmail } from '@/lib/admin-allowlist'
import { getEntitlements } from '@/lib/subscription/server'

/**
 * Espace connecté. La coque (barre latérale, navigation) vit dans `AppShell`,
 * partagée avec le catalogue public — ici on ne garde que la garde d'accès.
 */
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('users')
    .select('full_name, plan, role')
    .eq('id', user.id)
    .single()

  // Mêmes deux conditions que la garde du back office : liste blanche ET rôle.
  const isAdmin = isAllowedAdminEmail(user.email) && (profile as ShellProfile | null)?.role === 'admin'
  // Formule EFFECTIVE (abonnements en cours), pas le cache `users.plan`.
  const ent = await getEntitlements(user.id)
  const shellProfile = profile ? { ...(profile as ShellProfile), plan: ent.plan } : null

  return (
    <AppShell email={user.email ?? null} profile={shellProfile} isAdmin={isAdmin}>
      {children}
    </AppShell>
  )
}
