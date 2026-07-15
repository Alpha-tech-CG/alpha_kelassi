import { NextRequest, NextResponse } from 'next/server'
import { authenticate } from '@/lib/supabase/api'
import { supabaseAdmin } from '@/lib/admin-guard'
import { z } from 'zod'

const schema = z.object({ is_done: z.boolean() })

/** PATCH /api/planning/sessions/:id — coche/décoche une séance (award XP si faite) */
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { user, supabase } = await authenticate(req)
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  let body: z.infer<typeof schema>
  try { body = schema.parse(await req.json()) }
  catch { return NextResponse.json({ error: 'Corps invalide' }, { status: 400 }) }

  const { data, error } = await supabase
    .from('revision_sessions')
    .update({ is_done: body.is_done, done_at: body.is_done ? new Date().toISOString() : null })
    .eq('id', id)
    .eq('user_id', user.id)
    .select('id, is_done')
    .single()

  if (error) return NextResponse.json({ error: { code: 'DB_ERROR', message: error.message } }, { status: 500 })

  // +5 XP quand une séance passe à "faite" (best-effort, via service role)
  if (body.is_done) {
    supabaseAdmin.rpc('increment_xp', { p_user_id: user.id, p_amount: 5 }).then(() => {}, () => {})
  }

  return NextResponse.json({ data })
}

/** DELETE /api/planning/sessions/:id */
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { user, supabase } = await authenticate(req)
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  await supabase.from('revision_sessions').delete().eq('id', id).eq('user_id', user.id)
  return NextResponse.json({ data: { deleted: true } })
}
