import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AdminLayoutClient } from './_components/admin-layout-client'
import { isAllowedAdminEmail } from '@/lib/admin-allowlist'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Deux verrous indépendants : liste blanche d'adresses ET rôle en base.
  if (!isAllowedAdminEmail(user.email)) redirect('/dashboard')

  const { data: profile } = await supabase.from('users').select('role, full_name, email').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/dashboard')

  // Aucune double authentification exigée : l'accès admin repose uniquement sur
  // la liste blanche d'adresses ET le rôle `admin` en base.

  return (
    <AdminLayoutClient name={profile?.full_name ?? profile?.email ?? 'Admin'}>
      {children}
    </AdminLayoutClient>
  )
}
