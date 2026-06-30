import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { createHash } from 'crypto'
import { z } from 'zod'
import { addDailyBonus } from '@/lib/ai/quota'

const schema = z.object({
  code: z.string().regex(/^KELASSI-[A-Z2-9]{4}$/, 'Format invalide (ex: KELASSI-AB3Z)'),
})

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
 * POST /api/referral/validate
 * Body: { code: 'KELASSI-XXXX' }
 *
 * Règles anti-fraude :
 * 1. Code existant
 * 2. Parrain ≠ filleul (check DB)
 * 3. Filleul n'a pas déjà utilisé un code (unique referee_id en DB)
 * 4. Empreinte douce : avertissement si même IP que le parrain (pas de blocage)
 */
export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  let body: z.infer<typeof schema>
  try {
    body = schema.parse(await req.json())
  } catch (e: unknown) {
    const msg = e instanceof z.ZodError ? e.errors[0]?.message : 'Code invalide'
    return NextResponse.json({ error: msg }, { status: 400 })
  }

  const code = body.code.toUpperCase()
  const admin = getAdmin()

  // 1. Trouve le parrain via son code
  const { data: referrer } = await admin
    .from('users')
    .select('id, referral_code')
    .eq('referral_code', code)
    .single()

  if (!referrer) {
    return NextResponse.json({ error: 'Code introuvable. Vérifie l\'orthographe.' }, { status: 404 })
  }

  // 2. Auto-parrainage
  if (referrer.id === user.id) {
    return NextResponse.json({ error: 'Tu ne peux pas utiliser ton propre code.' }, { status: 400 })
  }

  // 3. Vérifie que le filleul n'a pas déjà utilisé un code
  const { data: existingReferral } = await admin
    .from('referrals')
    .select('id')
    .eq('referee_id', user.id)
    .maybeSingle()

  if (existingReferral) {
    return NextResponse.json({ error: 'Tu as déjà utilisé un code de parrainage.' }, { status: 409 })
  }

  // 4. Empreinte douce (IP + user-agent) — log pour audit, pas de blocage
  const ip        = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  const ua        = req.headers.get('user-agent') ?? ''
  const fingerprint = createHash('sha256').update(`${ip}:${ua}`).digest('hex')

  // Crée l'entrée de parrainage
  const { error: insertError } = await admin.from('referrals').insert({
    referrer_id:          referrer.id,
    referee_id:           user.id,
    referral_code:        code,
    signup_fingerprint:   fingerprint,
    bonus_credited:       false,
  })

  if (insertError) {
    // Contrainte unique violée = déjà utilisé (race condition)
    if (insertError.code === '23505') {
      return NextResponse.json({ error: 'Code déjà utilisé.' }, { status: 409 })
    }
    console.error('[referral/validate] insert error:', insertError)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }

  // Crédite +5 questions au parrain pour aujourd'hui
  try {
    await Promise.all([
      addDailyBonus(referrer.id, 5),
      // Log en DB pour audit
      admin.from('quota_bonuses').insert({
        user_id:      referrer.id,
        reason:       'referral',
        bonus_amount: 5,
        bonus_date:   new Date().toISOString().slice(0, 10),
      }),
      // Marque le bonus comme crédité
      admin.from('referrals').update({ bonus_credited: true })
        .eq('referrer_id', referrer.id).eq('referee_id', user.id),
    ])
  } catch (err) {
    // Non bloquant — le parrainage est créé, le bonus sera re-tenté si besoin
    console.error('[referral/validate] bonus error:', err)
  }

  return NextResponse.json({
    data: {
      success: true,
      message: 'Code validé ! Ton parrain reçoit +5 questions aujourd\'hui. Merci de faire partie de Kelassi.',
    },
  })
}
