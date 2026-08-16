import { NextResponse } from 'next/server'
import { z } from 'zod'
import { authenticate } from '@/lib/supabase/api'
import { admin } from '@/lib/tutor'

const schema = z.object({ amount: z.number().int().min(500) })

/** POST /api/tutor/withdraw — demande de retrait (CinetPay en prod ; débit + trace). */
export async function POST(req: Request) {
  const { user } = await authenticate(req)
  if (!user) return NextResponse.json({ error: { code: 'UNAUTHORIZED' } }, { status: 401 })

  let body: z.infer<typeof schema>
  try { body = schema.parse(await req.json()) }
  catch { return NextResponse.json({ error: { code: 'BAD_REQUEST' } }, { status: 400 }) }

  const { data: profile } = await admin().from('tutor_profiles').select('wallet_balance').eq('user_id', user.id).maybeSingle()
  if (!profile) return NextResponse.json({ error: { code: 'NOT_TUTOR' } }, { status: 403 })
  if (profile.wallet_balance < body.amount) return NextResponse.json({ error: { code: 'INSUFFICIENT_FUNDS' } }, { status: 422 })

  await admin().rpc('increment_tutor_wallet', { p_tutor_id: user.id, p_amount: -body.amount })
  const { data: txn, error } = await admin().from('tutor_wallet_transactions')
    .insert({ tutor_id: user.id, amount_fcfa: body.amount, type: 'withdrawal', status: 'pending' })
    .select('id, amount_fcfa, status, created_at').single()
  if (error) {
    await admin().rpc('increment_tutor_wallet', { p_tutor_id: user.id, p_amount: body.amount })
    return NextResponse.json({ error: { code: 'DB_ERROR', message: error.message } }, { status: 500 })
  }
  return NextResponse.json({ data: txn }, { status: 201 })
}
