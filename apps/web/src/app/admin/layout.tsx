import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AdminSidebar } from './_components/sidebar'
import { isAllowedAdminEmail, adminMfaRequired } from '@/lib/admin-allowlist'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Deux verrous indépendants : liste blanche d'adresses ET rôle en base.
  if (!isAllowedAdminEmail(user.email)) redirect('/dashboard')

  const { data: profile } = await supabase.from('users').select('role, full_name, email').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/dashboard')

  // Double authentification : exigée seulement si ADMIN_REQUIRE_MFA=true.
  // Si un facteur est déjà enrôlé, on demande quand même de l'utiliser — sinon
  // l'activer n'aurait aucun effet réel sur la session en cours.
  if (adminMfaRequired()) {
    const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()
    if (aal?.currentLevel !== 'aal2') {
      if (aal?.nextLevel === 'aal2') redirect('/mfa-challenge?next=/admin')
      redirect('/compte/securite?required=admin')
    }
  } else {
    const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()
    if (aal?.currentLevel === 'aal1' && aal?.nextLevel === 'aal2') {
      redirect('/mfa-challenge?next=/admin')
    }
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
