import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAdmin, supabaseAdmin } from '@/lib/admin-guard'
import { isUuid } from '@/lib/query-validation'
import { BAN_DURATION, accountState, banRefusal, generateTempPassword, type AuthUserLike } from '@/lib/account-admin'

const schema = z.object({
  action: z.enum(['ban', 'unban', 'confirm_email', 'reset_password']),
  reason: z.string().trim().min(5, 'Indique la raison (5 caractères minimum).').max(500),
})

const failed = (message: string, status = 500) =>
  NextResponse.json({ error: { code: status === 500 ? 'AUTH_ERROR' : 'BAD_REQUEST', message } }, { status })

async function loadTarget(id: string) {
  const [{ data: profile }, { data: auth, error }] = await Promise.all([
    supabaseAdmin.from('users').select('id, email, role, onboarding_completed').eq('id', id).maybeSingle(),
    supabaseAdmin.auth.admin.getUserById(id),
  ])
  if (error || !auth.user) return null
  return { profile, auth: auth.user }
}

/**
 * GET /api/admin/users/:id/account — état du compte dans Supabase Auth et
 * journal des actions de la console sur ce compte (migration 077).
 */
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin()
  if ('error' in guard) return guard.error
  const { id } = await params
  if (!isUuid(id)) return failed('Identifiant invalide.', 400)

  const target = await loadTarget(id)
  if (!target) return failed('Compte introuvable.', 404)

  const { data: audit } = await supabaseAdmin.from('account_admin_audit')
    .select('id, action, reason, created_at, admin:users!account_admin_audit_admin_id_fkey(email, full_name)')
    .eq('user_id', id).order('created_at', { ascending: false }).limit(50)

  return NextResponse.json({
    data: {
      state: accountState(target.auth as AuthUserLike),
      onboarding_completed: !!target.profile?.onboarding_completed,
      audit: audit ?? [],
    },
  })
}

/**
 * POST /api/admin/users/:id/account — aide à la connexion et bannissement.
 *   • ban / unban      : bannissement appliqué par Supabase Auth (connexion et
 *                        renouvellement de session refusés ; une session ouverte
 *                        tombe à l'expiration de son jeton, 1 h au plus) ;
 *   • confirm_email    : confirme l'adresse à la place de l'élève ;
 *   • reset_password   : mot de passe provisoire, renvoyé une seule fois.
 * Motif obligatoire, action journalisée.
 */
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin()
  if ('error' in guard) return guard.error
  const { id } = await params
  if (!isUuid(id)) return failed('Identifiant invalide.', 400)

  const parsed = schema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return failed(parsed.error.issues[0]?.message ?? 'Requête invalide.', 400)
  const { action, reason } = parsed.data

  const target = await loadTarget(id)
  if (!target) return failed('Compte introuvable.', 404)

  if (action === 'ban') {
    const refusal = banRefusal({ id, role: target.profile?.role ?? null }, guard.userId)
    if (refusal) return NextResponse.json({ error: { code: 'FORBIDDEN', message: refusal } }, { status: 403 })
  }

  let tempPassword: string | null = null
  const update =
    action === 'ban' ? { ban_duration: BAN_DURATION }
    : action === 'unban' ? { ban_duration: 'none' }
    : action === 'confirm_email' ? { email_confirm: true }
    : { password: (tempPassword = generateTempPassword()) }

  const { data, error } = await supabaseAdmin.auth.admin.updateUserById(id, update)
  if (error || !data.user) {
    console.error('[/api/admin/users/[id]/account]', action, error?.message)
    return failed('L’action a échoué côté Supabase Auth, réessaie plus tard.')
  }

  const { error: auditError } = await supabaseAdmin.from('account_admin_audit').insert({
    admin_id: guard.userId, user_id: id, user_email: target.auth.email ?? null, action, reason,
  })
  if (auditError) console.error('[/api/admin/users/[id]/account] journal', auditError.message)

  return NextResponse.json({
    data: { state: accountState(data.user as AuthUserLike), temp_password: tempPassword },
  })
}
