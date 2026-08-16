import { NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAdmin, supabaseAdmin } from '@/lib/admin-guard'

const schema = z.object({
  action: z.enum(['reviewed', 'dismissed']),
  delete_message: z.boolean().default(false),
})

/** POST /api/admin/moderation/:id — traiter un signalement (+ supprimer le message si demandé). */
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin()
  if ('error' in guard) return guard.error
  const { id } = await params

  let body: z.infer<typeof schema>
  try { body = schema.parse(await req.json()) }
  catch { return NextResponse.json({ error: { code: 'BAD_REQUEST' } }, { status: 400 }) }

  const { data: flag, error } = await supabaseAdmin.from('moderation_flags')
    .update({ status: body.action }).eq('id', id).select('message_id').maybeSingle()
  if (error) return NextResponse.json({ error: { code: 'DB_ERROR', message: error.message } }, { status: 500 })
  if (!flag) return NextResponse.json({ error: { code: 'NOT_FOUND' } }, { status: 404 })

  // Suppression du message signalé (masquage définitif) si l'admin le décide.
  if (body.delete_message && flag.message_id) {
    await supabaseAdmin.from('group_messages').update({ ai_blocked: true }).eq('id', flag.message_id)
  }
  return NextResponse.json({ data: { ok: true } })
}
