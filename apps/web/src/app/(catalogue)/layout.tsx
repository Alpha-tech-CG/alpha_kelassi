import { createClient } from '@/lib/supabase/server'
import { AppShell, type ShellProfile } from '@/components/app-shell'
import { PublicShell } from '@/components/public-shell'
import { isAllowedAdminEmail } from '@/lib/admin-allowlist'
import { getEntitlements } from '@/lib/subscription/server'

/**
 * Catalogue de cours — accessible sans compte.
 *
 * Contrairement à l'espace connecté, ce groupe ne redirige pas vers la
 * connexion : un visiteur peut parcourir les matières, les chapitres et les
 * titres de leçons. La lecture du contenu d'une leçon, elle, demande un compte
 * (garde posée dans la page de chapitre).
 *
 * Un visiteur déjà connecté retrouve la navigation habituelle ; un visiteur
 * anonyme voit une coque publique avec un accès direct à l'inscription.
 */
export default async function CatalogueLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return <PublicShell>{children}</PublicShell>

  const { data: profile } = await supabase
    .from('users')
    .select('full_name, plan, role')
    .eq('id', user.id)
    .maybeSingle()

  const isAdmin = isAllowedAdminEmail(user.email) && (profile as ShellProfile | null)?.role === 'admin'
  const ent = await getEntitlements(user.id)
  const shellProfile = profile ? { ...(profile as ShellProfile), plan: ent.plan } : null

  return (
    <AppShell email={user.email ?? null} profile={shellProfile} isAdmin={isAdmin}>
      {children}
    </AppShell>
  )
}
