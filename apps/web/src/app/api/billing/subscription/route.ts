import { NextResponse } from 'next/server'
import { authenticate } from '@/lib/supabase/api'

/**
 * GET /api/billing/subscription — abonnement en cours de l'utilisateur.
 * Conservé pour les versions précédentes de l'application (sondage après
 * paiement). Les nouvelles versions utilisent /api/billing/me et
 * /api/billing/feexpay/status.
 */
export async function GET(req: Request) {
  const { user, supabase } = await authenticate(req)
  if (!user) return NextResponse.json({ error: { code: 'UNAUTHORIZED' } }, { status: 401 })

  const now = new Date().toISOString()
  const { data } = await supabase
    .from('subscriptions')
    .select('id, plan, status, expires_at, created_at')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .or(`expires_at.is.null,expires_at.gt.${now}`)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  return NextResponse.json({ data: data ?? null })
}
