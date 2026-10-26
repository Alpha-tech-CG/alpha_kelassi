import { NextResponse } from 'next/server'
import { z } from 'zod'
import { authenticate } from '@/lib/supabase/api'
import { admin } from '@/lib/tutor'
import { rateLimitStrict, tooMany } from '@/lib/rate-limit'
import { assertTrustedOrigin } from '@/lib/origin-check'
import { classifyPayoutResponse } from '@/lib/billing/payout-outcome'

const schema = z.object({
  amount:  z.number().int().min(500),                 // retrait minimum 500 FCFA
  phone:   z.string().regex(/^\+?[0-9]{8,15}$/),        // numéro Mobile Money de destination
  network: z.string().regex(/^[A-Z][A-Z _]{1,20}$/),   // opérateur (ex. MTN, AIRTEL)
})

/** POST /api/tutor/withdraw — retrait du wallet tuteur via payout FeexPay (Mobile Money). */
export async function POST(req: Request) {
  if (!assertTrustedOrigin(req)) {
    return NextResponse.json({ error: { code: 'FORBIDDEN', message: 'Origine non autorisée.' } }, { status: 403 })
  }

  const { user } = await authenticate(req)
  if (!user) return NextResponse.json({ error: { code: 'UNAUTHORIZED' } }, { status: 401 })
  if (!(await rateLimitStrict(`withdraw:${user.id}`, 3, 3600))) return tooMany()

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
  if (debitErr) {
    console.error('[/api/tutor/withdraw]', debitErr)
    return NextResponse.json({ error: { code: 'DB_ERROR', message: 'Une erreur est survenue, réessaie plus tard.' } }, { status: 500 })
  }
  if (newBalance === null || newBalance === undefined) {
    return NextResponse.json({ error: { code: 'INSUFFICIENT_FUNDS' } }, { status: 422 })
  }

  // Trace la transaction en 'pending' AVANT le transfert : tout débit est tracé.
  const { data: txn, error } = await admin().from('tutor_wallet_transactions')
    .insert({ tutor_id: user.id, amount_fcfa: body.amount, type: 'withdrawal', status: 'pending' })
    .select('id, amount_fcfa, status, created_at').single()
  if (error) {
    await admin().rpc('increment_tutor_wallet', { p_tutor_id: user.id, p_amount: body.amount }) // remboursement
    console.error('[/api/tutor/withdraw]', error)
    return NextResponse.json({ error: { code: 'DB_ERROR', message: 'Une erreur est survenue, réessaie plus tard.' } }, { status: 500 })
  }

  // Payout FeexPay — FeexPay génère la référence, renvoyée dans la réponse.
  let httpStatus: number | null = null
  let data: { status?: string; reference?: string } | null = null
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
      signal: AbortSignal.timeout(20_000),
    })
    httpStatus = res.status
    data = await res.json().catch(() => null)
  } catch {
    // Pas de réponse : le virement a pu partir quand même (classé « inconnu »).
  }
  const outcome = classifyPayoutResponse(httpStatus, data)
  const ref = typeof data?.reference === 'string' ? data.reference : null

  if (outcome === 'refused') {
    // Refus certain : recrédit atomique, seulement si la transaction est encore 'pending'.
    await admin().rpc('reconcile_failed_payout', { p_txn_id: txn.id })
    return NextResponse.json({ error: { code: 'PAYOUT_FAILED', message: 'Le transfert a échoué. Solde recrédité.' } }, { status: 502 })
  }

  if (outcome === 'unknown') {
    // Issue inconnue : SURTOUT pas de recrédit (risque de double paiement).
    // La transaction reste 'pending' ; la passe planifiée la rapproche si une
    // référence FeexPay est connue, sinon un admin la vérifie à la main.
    console.error('[/api/tutor/withdraw] issue du virement inconnue', { txn: txn.id, httpStatus })
    if (ref) await admin().from('tutor_wallet_transactions').update({ provider_ref: ref }).eq('id', txn.id)
    return NextResponse.json({ data: { ...txn, status: 'pending', provider_ref: ref } }, { status: 201 })
  }

  // SUCCESSFUL → complété ; PENDING → transfert en cours (reste 'pending').
  const finalStatus = data?.status?.toUpperCase() === 'SUCCESSFUL' ? 'completed' : 'pending'
  await admin().from('tutor_wallet_transactions')
    .update({ status: finalStatus, provider_ref: ref ?? null })
    .eq('id', txn.id)

  return NextResponse.json({ data: { ...txn, status: finalStatus, provider_ref: ref ?? null } }, { status: 201 })
}
