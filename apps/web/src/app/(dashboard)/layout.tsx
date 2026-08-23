import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AppShell, type ShellProfile } from '@/components/app-shell'

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

  return (
    <AppShell email={user.email ?? null} profile={(profile as ShellProfile | null) ?? null}>
      {children}
    </AppShell>
  )
}
