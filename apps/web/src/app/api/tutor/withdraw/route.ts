import { NextResponse } from 'next/server'
import { z } from 'zod'
import { authenticate } from '@/lib/supabase/api'
import { admin } from '@/lib/tutor'

const schema = z.object({
  amount:  z.number().int().min(500),                 // retrait minimum 500 FCFA
  phone:   z.string().regex(/^\+?[0-9]{8,15}$/),        // numéro Mobile Money de destination
  network: z.string().regex(/^[A-Z][A-Z _]{1,20}$/),   // opérateur (ex. MTN, AIRTEL)
})

/** POST /api/tutor/withdraw — retrait du wallet tuteur via payout FeexPay (Mobile Money). */
export async function POST(req: Request) {
  const { user } = await authenticate(req)
  if (!user) return NextResponse.json({ error: { code: 'UNAUTHORIZED' } }, { status: 401 })

  let body: z.infer<typeof schema>
  try { body = schema.parse(await req.json()) }
  catch { return NextResponse.json({ error: { code: 'BAD_REQUEST' } }, { status: 400 }) }

  const token = process.env['FEEXPAY_TOKEN']
  const shop  = process.env['FEEXPAY_SHOP']
  if (!token || !shop) {
    return NextResponse.json({ error: { code: 'FEEXPAY_NOT_CONFIGURED', message: 'Retraits indisponibles' } }, { status: 503 })
  }

  const { data: profile } = await admin().from('tutor_profiles').select('user_id').eq('user_id', user.id).maybeSingle()
  if (!profile) return NextResponse.json({ error: { code: 'NOT_TUTOR' } }, { status: 403 })

  // Débit ATOMIQUE avec plancher (anti-TOCTOU) : renvoie le nouveau solde, ou
  // null si le solde est insuffisant — aucun débit n'a alors eu lieu.
  const { data: newBalance, error: debitErr } = await admin()
    .rpc('debit_tutor_wallet', { p_tutor_id: user.id, p_amount: body.amount })
  if (debitErr) return NextResponse.json({ error: { code: 'DB_ERROR', message: debitErr.message } }, { status: 500 })
  if (newBalance === null || newBalance === undefined) {
    return NextResponse.json({ error: { code: 'INSUFFICIENT_FUNDS' } }, { status: 422 })
  }

  // Trace la transaction en 'pending' AVANT le transfert : tout débit est tracé.
  const { data: txn, error } = await admin().from('tutor_wallet_transactions')
    .insert({ tutor_id: user.id, amount_fcfa: body.amount, type: 'withdrawal', status: 'pending' })
    .select('id, amount_fcfa, status, created_at').single()
  if (error) {
    await admin().rpc('increment_tutor_wallet', { p_tutor_id: user.id, p_amount: body.amount }) // remboursement
    return NextResponse.json({ error: { code: 'DB_ERROR', message: error.message } }, { status: 500 })
  }

  // Payout FeexPay — FeexPay génère la référence, renvoyée dans la réponse.
  let status: string | undefined
  let ref: string | undefined
  try {
    const res = await fetch('https://api.feexpay.me/api/payouts/public/transfer/global', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        phoneNumber: `242${body.phone.replace(/[^0-9]/g, '')}`,
        amount: body.amount,
        shop,
        network: body.network,
        motif: 'Retrait Kelassi tuteur',
      }),
    })
    const data = (await res.json().catch(() => ({}))) as { status?: string; reference?: string }
    status = res.ok ? (data.status ?? 'PENDING') : 'FAILED'
    ref = data.reference
  } catch {
    status = 'FAILED'
  }

  if (status === 'FAILED') {
    // Échec du transfert : on recrédite le wallet et on marque la transaction rejetée.
    await admin().rpc('increment_tutor_wallet', { p_tutor_id: user.id, p_amount: body.amount })
    await admin().from('tutor_wallet_transactions').update({ status: 'rejected' }).eq('id', txn.id)
    return NextResponse.json({ error: { code: 'PAYOUT_FAILED', message: 'Le transfert a échoué. Solde recrédité.' } }, { status: 502 })
  }

  // SUCCESSFUL → complété ; PENDING → transfert en cours (reste 'pending').
  const finalStatus = status === 'SUCCESSFUL' ? 'completed' : 'pending'
  await admin().from('tutor_wallet_transactions')
    .update({ status: finalStatus, provider_ref: ref ?? null })
    .eq('id', txn.id)

  return NextResponse.json({ data: { ...txn, status: finalStatus, provider_ref: ref ?? null } }, { status: 201 })
}
