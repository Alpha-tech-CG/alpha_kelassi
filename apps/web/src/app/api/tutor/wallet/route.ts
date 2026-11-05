import { NextResponse } from 'next/server'
import { authenticate } from '@/lib/supabase/api'
import { admin } from '@/lib/tutor'

/** GET /api/tutor/wallet — solde + historique des transactions. */
export async function GET(req: Request) {
  const { user } = await authenticate(req)
  if (!user) return NextResponse.json({ error: { code: 'UNAUTHORIZED' } }, { status: 401 })

  const { data: profile } = await admin().from('tutor_profiles').select('wallet_balance').eq('user_id', user.id).maybeSingle()
  if (!profile) return NextResponse.json({ error: { code: 'NOT_TUTOR' } }, { status: 403 })

  const { data: txns } = await admin().from('tutor_wallet_transactions')
    .select('id, mission_id, amount_fcfa, type, status, created_at')
    .eq('tutor_id', user.id).order('created_at', { ascending: false }).limit(50)
  return NextResponse.json({ data: { balance: profile.wallet_balance, transactions: txns ?? [] } })
}
