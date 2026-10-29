import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { LEVEL_META, PLAN_LEVELS, dayPeriodKey, isSubscriptionPlan, monthPeriodKey, normalizePlan, type SubscriptionPlan } from '@alpha-kelassi/types'
import { requireAdmin, supabaseAdmin } from '@/lib/admin-guard'
import { accountState, generateTempPassword, isSignupIncomplete, type AuthUserLike } from '@/lib/account-admin'

interface SubRow { user_id: string; plan: string; status: string; billing_interval: string | null; started_at: string | null; expires_at: string | null; source: string; created_at: string }

/**
 * GET /api/admin/users?plan=&q= — comptes avec leur formule EFFECTIVE,
 * l'échéance, l'intervalle, le point de vérification éventuel, l'usage
 * du jour (IA) et du mois (corrections), et l'état du compte dans Supabase
 * Auth (banni, e-mail confirmé, dernière connexion). `plan=incomplete` ou
 * `plan=banned` filtrent les inscriptions inachevées ou les comptes bannis.
 */
export async function GET(req: NextRequest) {
  const guard = await requireAdmin()
  if ('error' in guard) return guard.error

  const sp = req.nextUrl.searchParams
  const planFilter = sp.get('plan')
  const q = (sp.get('q') ?? '').trim().toLowerCase()

  const { data: users, error } = await supabaseAdmin.from('users')
    .select('*').order('created_at', { ascending: false }).limit(1000)
  if (error) {
    console.error('[/api/admin/users]', error)
    return NextResponse.json({ error: { code: 'DB_ERROR', message: 'Une erreur est survenue, réessaie plus tard.' } }, { status: 500 })
  }
  const rows = (users ?? []) as { id: string; full_name: string | null; email: string | null; phone: string | null; role: string; plan: string; plan_review?: string | null; onboarding_completed?: boolean | null; created_at: string }[]
  const ids = rows.map((u) => u.id)

  const now = new Date().toISOString()
  const [{ data: subs }, { data: usage }, authList] = await Promise.all([
    ids.length ? supabaseAdmin.from('subscriptions')
      .select('user_id, plan, status, billing_interval, started_at, expires_at, source, created_at')
      .in('user_id', ids).in('status', ['active', 'pending', 'suspended']) : Promise.resolve({ data: [] }),
    ids.length ? supabaseAdmin.from('usage_counters')
      .select('user_id, usage_type, period_key, used, bonus')
      .in('user_id', ids).in('period_key', [dayPeriodKey(), monthPeriodKey()]) : Promise.resolve({ data: [] }),
    // État de connexion : bannissement, confirmation, dernière connexion.
    supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 }),
  ])
  if (authList.error) console.error('[/api/admin/users] auth', authList.error.message)
  const authById = new Map<string, AuthUserLike>((authList.data?.users ?? []).map((u) => [u.id, u as AuthUserLike]))

  const subsByUser = new Map<string, SubRow[]>()
  for (const s of (subs ?? []) as SubRow[]) subsByUser.set(s.user_id, [...(subsByUser.get(s.user_id) ?? []), s])
  const usageByUser = new Map<string, { ai_today: number; ai_bonus: number; corrections_month: number; corrections_bonus: number }>()
  for (const u of (usage ?? []) as { user_id: string; usage_type: string; period_key: string; used: number; bonus: number }[]) {
    const e = usageByUser.get(u.user_id) ?? { ai_today: 0, ai_bonus: 0, corrections_month: 0, corrections_bonus: 0 }
    if (u.usage_type === 'ai_questions' && u.period_key === dayPeriodKey()) { e.ai_today = u.used; e.ai_bonus = u.bonus }
    if (u.usage_type === 'tutor_corrections' && u.period_key === monthPeriodKey()) { e.corrections_month = u.used; e.corrections_bonus = u.bonus }
    usageByUser.set(u.user_id, e)
  }

  const result = rows.map((u) => {
    const userSubs = subsByUser.get(u.id) ?? []
    const current = userSubs
      .filter((s) => s.status !== 'suspended' && (s.started_at ?? s.created_at) <= now && (!s.expires_at || s.expires_at > now))
      .sort((a, b) => PLAN_LEVELS[normalizePlan(b.plan)] - PLAN_LEVELS[normalizePlan(a.plan)])[0] ?? null
    const subscriptionPlan: SubscriptionPlan = current ? normalizePlan(current.plan) : 'free'
    const account = accountState(authById.get(u.id))
    return {
      id: u.id, full_name: u.full_name, email: u.email, phone: u.phone, role: u.role, created_at: u.created_at,
      account,
      onboarding_completed: !!u.onboarding_completed,
      signup_incomplete: isSignupIncomplete(account, u.onboarding_completed ?? null),
      plan: subscriptionPlan,
      effective_plan: u.role === 'admin' ? 'pro_max' : subscriptionPlan,
      billing_interval: current?.billing_interval ?? null,
      expires_at: current?.expires_at ?? null,
      source: current?.source ?? null,
      suspended: userSubs.some((s) => s.status === 'suspended'),
      scheduled: userSubs.filter((s) => s.status === 'pending' && (s.started_at ?? '') > now).length,
      plan_review: u.plan_review ?? null,
      usage: usageByUser.get(u.id) ?? { ai_today: 0, ai_bonus: 0, corrections_month: 0, corrections_bonus: 0 },
    }
  }).filter((u) =>
    (!planFilter || (isSubscriptionPlan(planFilter) ? u.plan === planFilter
      : planFilter === 'review' ? !!u.plan_review
      : planFilter === 'incomplete' ? u.signup_incomplete
      : planFilter === 'banned' ? u.account.banned
      : true))
    && (!q || [u.full_name, u.email, u.phone].some((v) => (v ?? '').toLowerCase().includes(q))))

  return NextResponse.json({ data: result })
}

const createSchema = z.object({
  first_name: z.string().trim().min(1, 'Prénom manquant.').max(60),
  last_name: z.string().trim().min(1, 'Nom manquant.').max(60),
  email: z.string().trim().toLowerCase().email('Adresse e-mail invalide.').max(254),
  study_level: z.string().refine((l) => l in LEVEL_META, 'Classe inconnue.'),
  phone: z.string().trim().regex(/^\+?[0-9 ]{6,20}$/, 'Téléphone invalide.').optional().or(z.literal('')),
  school: z.string().trim().max(120).optional(),
  city: z.string().trim().max(80).optional(),
  reason: z.string().trim().min(5, 'Indique pourquoi tu crées ce compte (5 caractères minimum).').max(500),
})

/**
 * POST /api/admin/users — crée un compte élève pour l'aider à s'inscrire.
 *
 * Le compte est créé confirmé, avec un mot de passe provisoire renvoyé UNE
 * seule fois (à transmettre à l'élève, qui le change ensuite). Le trigger
 * d'inscription (migrations 066-067) crée le profil comme pour une
 * inscription normale. L'action est journalisée (migration 077).
 */
export async function POST(req: NextRequest) {
  const guard = await requireAdmin()
  if ('error' in guard) return guard.error

  const parsed = createSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: { code: 'BAD_REQUEST', message: parsed.error.issues[0]?.message ?? 'Requête invalide.' } }, { status: 400 })
  }
  const b = parsed.data
  const password = generateTempPassword()

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email: b.email,
    password,
    email_confirm: true,
    user_metadata: {
      first_name: b.first_name, last_name: b.last_name, full_name: `${b.first_name} ${b.last_name}`,
      study_level: b.study_level, school: b.school || undefined, city: b.city || undefined,
      created_by_admin: true,
    },
  })
  if (error || !data.user) {
    const taken = /already|registered|exists/i.test(error?.message ?? '')
    if (!taken) console.error('[/api/admin/users] create', error?.message)
    return NextResponse.json(
      { error: { code: taken ? 'CONFLICT' : 'AUTH_ERROR', message: taken ? 'Un compte existe déjà avec cette adresse : cherche-le dans la liste.' : 'Création du compte impossible, réessaie plus tard.' } },
      { status: taken ? 409 : 500 },
    )
  }

  if (b.phone) await supabaseAdmin.from('users').update({ phone: b.phone.replace(/\s+/g, '') }).eq('id', data.user.id)

  const { error: auditError } = await supabaseAdmin.from('account_admin_audit').insert({
    admin_id: guard.userId, user_id: data.user.id, user_email: b.email, action: 'create', reason: b.reason,
    detail: { study_level: b.study_level },
  })
  if (auditError) console.error('[/api/admin/users] journal', auditError.message)

  return NextResponse.json({ data: { id: data.user.id, email: b.email, temp_password: password } }, { status: 201 })
}
