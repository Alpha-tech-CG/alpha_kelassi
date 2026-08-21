import { NextResponse } from 'next/server'
import { authenticate } from '@/lib/supabase/api'

/** GET /api/billing/subscription — abonnement actif de l'utilisateur (pour le polling). */
export async function GET(req: Request) {
  const { user, supabase } = await authenticate(req)
  if (!user) return NextResponse.json({ error: { code: 'UNAUTHORIZED' } }, { status: 401 })

  const { data } = await supabase
    .from('subscriptions')
    .select('id, plan, status, expires_at, created_at')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  return NextResponse.json({ data: data ?? null })
}
