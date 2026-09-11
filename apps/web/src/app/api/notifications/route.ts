import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { normalizePlan } from '@alpha-kelassi/types'

// Client admin pour une lecture publique sans cookie
let _admin: ReturnType<typeof createClient> | null = null
function getAdmin() {
  if (!_admin) {
    _admin = createClient(
      process.env['NEXT_PUBLIC_SUPABASE_URL']!,
      process.env['SUPABASE_SERVICE_ROLE_KEY']!
    )
  }
  return _admin
}

/**
 * GET /api/notifications?plan=free — notifs actives affichées dans le dashboard.
 * Ciblage des annonces : `free` (non abonnés) ou `premium` (tous les abonnés,
 * quelle que soit leur formule payante). Le paramètre est ramené à l'une de
 * ces deux valeurs — jamais interpolé tel quel dans le filtre PostgREST.
 */
export async function GET(req: NextRequest) {
  const rawPlan = req.nextUrl.searchParams.get('plan') ?? 'free'
  const plan = normalizePlan(rawPlan) === 'free' ? 'free' : 'premium'

  const { data } = await getAdmin()
    .from('notifications')
    .select('id, type, title, message, cta_label, cta_url')
    .eq('is_active', true)
    .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
    .or(`target_plan.eq.all,target_plan.eq.${plan}`)
    .order('created_at', { ascending: false })
    .limit(5)

  return NextResponse.json({ data: data ?? [] })
}
