import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import {
  BILLING_INTERVALS, SUBSCRIPTION_PLANS, USAGE_TYPES, addInterval, planPrice, periodKeyFor,
} from '@alpha-kelassi/types'
import { requireAdmin, supabaseAdmin } from '@/lib/admin-guard'
import { isUuid } from '@/lib/query-validation'

const reason = z.string().trim().min(5, 'Indique la raison de la modification (5 caractères minimum).').max(500)

const schema = z.discriminatedUnion('action', [
  z.object({
    action: z.literal('set_plan'), reason,
    plan: z.enum(SUBSCRIPTION_PLANS),
    interval: z.enum(BILLING_INTERVALS).nullable().default(null),
    /** Durée en jours ; null = selon l'intervalle, ou sans échéance si aucun intervalle. */
    duration_days: z.number().int().min(1).max(3660).nullable().default(null),
  }),
  z.object({ action: z.literal('extend'), reason, days: z.number().int().min(1).max(3660) }),
  z.object({ action: z.literal('suspend'), reason }),
  z.object({ action: z.literal('reactivate'), reason }),
  z.object({ action: z.literal('cancel'), reason, subscription_id: z.string().uuid() }),
  z.object({ action: z.literal('grant_quota'), reason, usage_type: z.enum(USAGE_TYPES), amount: z.number().int().min(1).max(1000) }),
  z.object({ action: z.literal('resolve_review'), reason }),
])

type Body = z.infer<typeof schema>

async function snapshot(userId: string) {
  const [{ data: user }, { data: subs }] = await Promise.all([
    supabaseAdmin.from('users').select('*').eq('id', userId).maybeSingle(),
    supabaseAdmin.from('subscriptions')
      .select('id, plan, status, billing_interval, started_at, expires_at, suspended_at, cancelled_at, source')
      .eq('user_id', userId).in('status', ['active', 'pending', 'suspended']).order('created_at', { ascending: false }),
  ])
  const u = user as { plan?: string; plan_expires_at?: string | null; plan_review?: string | null } | null
  return { plan: u?.plan ?? null, plan_expires_at: u?.plan_expires_at ?? null, plan_review: u?.plan_review ?? null, subscriptions: subs ?? [] }
}

/**
 * POST /api/admin/users/:id/subscription — modification manuelle.
 * Toute action exige une raison et est journalisée (administrateur, ancienne
 * et nouvelle valeur, date, raison). Rien n'est supprimé : les abonnements
 * remplacés passent à `canceled`, l'historique reste intact.
 */
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin()
  if ('error' in guard) return guard.error

  const { id } = await params
  if (!isUuid(id)) return NextResponse.json({ error: { code: 'BAD_REQUEST', message: 'Identifiant invalide.' } }, { status: 400 })

  let body: Body
  try { body = schema.parse(await req.json()) }
  catch (err) {
    const message = err instanceof z.ZodError ? err.issues[0]?.message ?? 'Requête invalide.' : 'Requête invalide.'
    return NextResponse.json({ error: { code: 'BAD_REQUEST', message } }, { status: 400 })
  }

  const { data: target } = await supabaseAdmin.from('users').select('id').eq('id', id).maybeSingle()
  if (!target) return NextResponse.json({ error: { code: 'NOT_FOUND', message: 'Utilisateur introuvable.' } }, { status: 404 })

  const before = await snapshot(id)
  const now = new Date()
  const nowIso = now.toISOString()
  let detail: Record<string, unknown> = {}

  switch (body.action) {
    case 'set_plan': {
      // La formule accordée remplace toute formule en cours.
      await supabaseAdmin.from('subscriptions')
        .update({ status: 'canceled', cancelled_at: nowIso, notes: `Remplacé manuellement : ${body.reason}` })
        .eq('user_id', id).in('status', ['active', 'pending', 'suspended'])
      if (body.plan !== 'free') {
        const expires = body.duration_days
          ? new Date(now.getTime() + body.duration_days * 86_400_000)
          : body.interval ? addInterval(now, body.interval) : null
        const { error } = await supabaseAdmin.from('subscriptions').insert({
          user_id: id, plan: body.plan, status: 'active', source: 'admin', payment_provider: 'admin',
          billing_interval: body.interval, amount: body.interval ? 0 : null, currency: 'XAF',
          started_at: nowIso, expires_at: expires?.toISOString() ?? null,
          notes: `Accordé par un administrateur : ${body.reason}${body.interval ? ` (valeur ${planPrice(body.plan, body.interval)} XAF offerte)` : ''}`,
        })
        if (error) throw error
      }
      detail = { plan: body.plan, interval: body.interval, duration_days: body.duration_days }
      break
    }
    case 'extend': {
      const { data: cur } = await supabaseAdmin.from('subscriptions')
        .select('id, expires_at').eq('user_id', id).eq('status', 'active').not('expires_at', 'is', null)
        .order('expires_at', { ascending: false }).limit(1).maybeSingle()
      if (!cur) return NextResponse.json({ error: { code: 'NO_SUBSCRIPTION', message: 'Aucun abonnement daté à prolonger.' } }, { status: 422 })
      const row = cur as { id: string; expires_at: string }
      const base = Math.max(new Date(row.expires_at).getTime(), now.getTime())
      await supabaseAdmin.from('subscriptions').update({ expires_at: new Date(base + body.days * 86_400_000).toISOString() }).eq('id', row.id)
      detail = { subscription_id: row.id, days: body.days }
      break
    }
    case 'suspend': {
      const { data: rows } = await supabaseAdmin.from('subscriptions')
        .update({ status: 'suspended', suspended_at: nowIso }).eq('user_id', id).in('status', ['active', 'pending']).select('id')
      if (!rows?.length) return NextResponse.json({ error: { code: 'NO_SUBSCRIPTION', message: 'Aucun abonnement en cours à suspendre.' } }, { status: 422 })
      detail = { suspended: rows.length }
      break
    }
    case 'reactivate': {
      const { data: rows } = await supabaseAdmin.from('subscriptions')
        .update({ status: 'active', suspended_at: null }).eq('user_id', id).eq('status', 'suspended')
        .or(`expires_at.is.null,expires_at.gt.${nowIso}`).select('id')
      if (!rows?.length) return NextResponse.json({ error: { code: 'NO_SUBSCRIPTION', message: 'Aucun abonnement suspendu et encore valide.' } }, { status: 422 })
      detail = { reactivated: rows.length }
      break
    }
    case 'cancel': {
      const { data: rows } = await supabaseAdmin.from('subscriptions')
        .update({ status: 'canceled', cancelled_at: nowIso }).eq('id', body.subscription_id).eq('user_id', id)
        .in('status', ['active', 'pending', 'suspended']).select('id')
      if (!rows?.length) return NextResponse.json({ error: { code: 'NOT_FOUND', message: 'Abonnement introuvable ou déjà terminé.' } }, { status: 404 })
      detail = { subscription_id: body.subscription_id }
      break
    }
    case 'grant_quota': {
      const period = periodKeyFor(body.usage_type)
      await supabaseAdmin.from('usage_counters').upsert(
        { user_id: id, usage_type: body.usage_type, period_key: period },
        { onConflict: 'user_id,usage_type,period_key', ignoreDuplicates: true },
      )
      const { data: counter } = await supabaseAdmin.from('usage_counters')
        .select('bonus').eq('user_id', id).eq('usage_type', body.usage_type).eq('period_key', period).single()
      const bonus = ((counter as { bonus: number } | null)?.bonus ?? 0) + body.amount
      await supabaseAdmin.from('usage_counters').update({ bonus, updated_at: nowIso })
        .eq('user_id', id).eq('usage_type', body.usage_type).eq('period_key', period)
      detail = { usage_type: body.usage_type, period, amount: body.amount, bonus }
      break
    }
    case 'resolve_review': {
      await supabaseAdmin.from('users').update({ plan_review: null }).eq('id', id)
      break
    }
  }

  await supabaseAdmin.rpc('refresh_user_plan', { p_user_id: id })
  const after = await snapshot(id)

  const { error: auditError } = await supabaseAdmin.from('subscription_admin_audit').insert({
    admin_id: guard.userId, user_id: id, action: body.action,
    old_value: before, new_value: { ...after, detail }, reason: body.reason,
  })
  if (auditError) console.error('[admin/subscription] journal', auditError.message)

  return NextResponse.json({ data: after })
}

/** GET /api/admin/users/:id/subscription — historique complet et journal. */
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin()
  if ('error' in guard) return guard.error
  const { id } = await params
  if (!isUuid(id)) return NextResponse.json({ error: { code: 'BAD_REQUEST' } }, { status: 400 })

  const [{ data: subs }, { data: txs }, { data: audit }, { data: usage }] = await Promise.all([
    supabaseAdmin.from('subscriptions').select('*').eq('user_id', id).order('created_at', { ascending: false }).limit(50),
    supabaseAdmin.from('payment_transactions').select('*').eq('user_id', id).order('created_at', { ascending: false }).limit(50),
    supabaseAdmin.from('subscription_admin_audit').select('id, admin_id, action, old_value, new_value, reason, created_at, admin:users!subscription_admin_audit_admin_id_fkey(email, full_name)')
      .eq('user_id', id).order('created_at', { ascending: false }).limit(50),
    supabaseAdmin.from('usage_counters').select('usage_type, period_key, used, bonus').eq('user_id', id).order('period_key', { ascending: false }).limit(60),
  ])
  return NextResponse.json({ data: { subscriptions: subs ?? [], transactions: txs ?? [], audit: audit ?? [], usage: usage ?? [] } })
}
