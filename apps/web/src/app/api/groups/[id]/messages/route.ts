import { NextRequest, NextResponse } from 'next/server'
import { authenticate } from '@/lib/supabase/api'
import { supabaseAdmin } from '@/lib/admin-guard'
import { moderateMessage } from '@/lib/moderation'
import { rateLimit, tooMany } from '@/lib/rate-limit'
import { z } from 'zod'

export const maxDuration = 30

const schema = z.object({ content: z.string().min(1).max(2000) })

/**
 * POST /api/groups/:id/messages — envoie un message dans un groupe.
 * Le message est MODÉRÉ par l'IA avant publication (BLOC D) : un message
 * refusé n'est jamais visible (ai_blocked=true, masqué par RLS) et l'auteur
 * reçoit l'explication. Contenu grave (sexuel/harcèlement) → signalement auto.
 * L'insertion passe par le service role (les clients n'ont pas de droit insert).
 */
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { user } = await authenticate(req)
  if (!user) return NextResponse.json({ error: { code: 'UNAUTHORIZED' } }, { status: 401 })
  if (!(await rateLimit(`group-msg:${user.id}`, 20, 60))) return tooMany()

  let body: z.infer<typeof schema>
  try { body = schema.parse(await req.json()) }
  catch { return NextResponse.json({ error: { code: 'BAD_REQUEST' } }, { status: 400 }) }

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

  const { data: msg, error } = await supabaseAdmin.from('group_messages')
    .insert({ group_id: id, sender_id: user.id, content: body.content, ai_blocked: false })
    .select('id, group_id, sender_id, content, created_at').single()
  if (error) return NextResponse.json({ error: { code: 'DB_ERROR', message: error.message } }, { status: 500 })

  return NextResponse.json({ data: msg }, { status: 201 })
}
