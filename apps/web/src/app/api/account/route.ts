import { NextResponse } from 'next/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { authenticate } from '@/lib/supabase/api'

let _admin: ReturnType<typeof createAdminClient> | null = null
function getAdmin() {
  if (!_admin) {
    _admin = createAdminClient(
      process.env['NEXT_PUBLIC_SUPABASE_URL']!,
      process.env['SUPABASE_SERVICE_ROLE_KEY']!
    )
  }
  return _admin
}

/**
 * DELETE /api/account — suppression RGPD du compte (web par cookie, mobile par Bearer).
 * On supprime l'utilisateur Auth : public.users et toutes les données liées suivent en
 * cascade. Un delete direct sur public.users ne ferait rien (aucune policy DELETE).
 */
export async function DELETE(req: Request) {
  const { user } = await authenticate(req)
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const { error } = await getAdmin().auth.admin.deleteUser(user.id)
  if (error) {
    console.error('[/api/account]', error)
    return NextResponse.json({ error: { code: 'DB_ERROR', message: 'Une erreur est survenue, réessaie plus tard.' } }, { status: 500 })
  }

  return NextResponse.json({ data: { deleted: true } })
}
