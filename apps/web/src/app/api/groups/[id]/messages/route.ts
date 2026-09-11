import { NextRequest, NextResponse } from 'next/server'
import { authenticate } from '@/lib/supabase/api'
import { supabaseAdmin } from '@/lib/admin-guard'
import { moderateMessage } from '@/lib/moderation'
import { rateLimit, tooMany } from '@/lib/rate-limit'
import { z } from 'zod'
import {
  consumeUsage, getEntitlements, planRequired, quotaExceeded, refundUsage, requestKeyOf, UsageUnavailableError,
} from '@/lib/subscription/server'

export const maxDuration = 30

const schema = z.object({
  content: z.string().min(1).max(2000),
  /** Question prioritaire : mise en avant pour les enseignants et tuteurs du groupe (Pro). */
  priority: z.boolean().optional().default(false),
})

/**
 * POST /api/groups/:id/messages — envoie un message dans un groupe.
 * Le message est MODÉRÉ par l'IA avant publication (BLOC D) : un message
 * refusé n'est jamais visible (ai_blocked=true, masqué par RLS) et l'auteur
 * reçoit l'explication. Contenu grave (sexuel/harcèlement) → signalement auto.
 * L'insertion passe par le service role (les clients n'ont pas de droit insert).
 *
 * Formules : en Gratuit, les groupes sont en lecture seule ; écrire demande
 * Starter. Les questions prioritaires sont Pro (3 par jour) et illimitées en Pro Max.
 */
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { user } = await authenticate(req)
  if (!user) return NextResponse.json({ error: { code: 'UNAUTHORIZED' } }, { status: 401 })
  if (!(await rateLimit(`group-msg:${user.id}`, 20, 60))) return tooMany()

  let body: z.infer<typeof schema>
  try { body = schema.parse(await req.json()) }
  catch { return NextResponse.json({ error: { code: 'BAD_REQUEST' } }, { status: 400 }) }

  const ent = await getEntitlements(user.id)
  if (!ent.can('study_groups')) return planRequired('study_groups')
  if (body.priority && !ent.can('priority_study_groups')) return planRequired('priority_study_groups')

  // Membre du groupe ?
  const { data: member } = await supabaseAdmin.from('group_members')
    .select('user_id').eq('group_id', id).eq('user_id', user.id).maybeSingle()
  if (!member) return NextResponse.json({ error: { code: 'NOT_MEMBER', message: 'Rejoins le groupe pour écrire.' } }, { status: 403 })

  const verdict = await moderateMessage(body.content)

  if (!verdict.ok) {
    // Trace le message bloqué (audit, invisible via RLS) + escalade si grave.
    const { data: blocked } = await supabaseAdmin.from('group_messages')
      .insert({ group_id: id, sender_id: user.id, content: body.content, ai_blocked: true }).select('id').single()
    if (blocked && (verdict.category === 'sexuel' || verdict.category === 'harcelement')) {
      await supabaseAdmin.from('moderation_flags').insert({
        message_id: blocked.id, flagged_user_id: user.id, reporter_id: user.id,
        reason: `auto (${verdict.category}) : ${verdict.reason ?? ''}`.slice(0, 300),
      })
    }
    return NextResponse.json({ error: { code: 'BLOCKED', message: verdict.reason ?? 'Message bloqué.', category: verdict.category } }, { status: 422 })
  }

  // Quota de questions prioritaires, décompté seulement pour un message publié.
  const requestKey = requestKeyOf(req)
  if (body.priority) {
    try {
      const usage = await consumeUsage(ent, 'priority_group_questions', requestKey)
      if (!usage.allowed) return quotaExceeded('priority_group_questions', usage)
    } catch (err) {
      if (!(err instanceof UsageUnavailableError)) throw err
      body.priority = false   // service de quota indisponible : publié comme message normal
    }
  }

  const { data: msg, error } = await supabaseAdmin.from('group_messages')
    .insert({ group_id: id, sender_id: user.id, content: body.content, ai_blocked: false, is_priority: body.priority })
    .select('id, group_id, sender_id, content, is_priority, created_at').single()
  if (error) {
    if (body.priority) await refundUsage(user.id, 'priority_group_questions', requestKey)
    console.error('[/api/groups/[id]/messages]', error)
    return NextResponse.json({ error: { code: 'DB_ERROR', message: 'Une erreur est survenue, réessaie plus tard.' } }, { status: 500 })
  }

  return NextResponse.json({ data: msg }, { status: 201 })
}
