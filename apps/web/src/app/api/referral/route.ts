import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'

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

/** GET /api/referral — retourne le code de parrainage + stats du parrain */
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const [{ data: profile }, { data: referrals }] = await Promise.all([
    getAdmin().from('users').select('referral_code').eq('id', user.id).single(),
    getAdmin()
      .from('referrals')
      .select('id, created_at, bonus_credited')
      .eq('referrer_id', user.id)
      .order('created_at', { ascending: false }),
  ])

  return NextResponse.json({
    data: {
      referral_code:  profile?.referral_code ?? null,
      total_referrals: referrals?.length ?? 0,
      credited:        referrals?.filter((r) => r.bonus_credited).length ?? 0,
      referrals:       referrals ?? [],
    },
  })
}
