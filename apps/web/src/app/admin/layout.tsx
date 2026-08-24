import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AdminSidebar } from './_components/sidebar'
import { isAllowedAdminEmail } from '@/lib/admin-allowlist'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Deux verrous indépendants : liste blanche d'adresses ET rôle en base.
  if (!isAllowedAdminEmail(user.email)) redirect('/dashboard')

  const { data: profile } = await supabase.from('users').select('role, full_name, email').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/dashboard')

  // Les comptes admin doivent avoir une session élevée en AAL2 (double
  // authentification TOTP vérifiée) pour accéder à la console admin.
  const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()
  if (aal?.currentLevel !== 'aal2') {
    if (aal?.nextLevel === 'aal2') {
      // Un facteur MFA est déjà enrôlé mais pas encore vérifié sur cette session.
      redirect('/mfa-challenge?next=/admin')
    }
    // Aucun facteur MFA enrôlé : bloque l'accès admin tant que ce n'est pas fait.
    redirect('/compte/securite?required=admin')
  }

  return (
    <div className="min-h-screen bg-gray-950 flex">
      <AdminSidebar name={profile?.full_name ?? profile?.email ?? 'Admin'} />
      <main className="flex-1 ml-64 min-h-screen bg-gray-50">
        {children}
      </main>
    </div>
  )
}
