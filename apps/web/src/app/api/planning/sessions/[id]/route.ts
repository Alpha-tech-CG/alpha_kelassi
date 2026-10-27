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

  // Mise à jour conditionnelle : on ne modifie que si l'état change vraiment. Une
  // séance déjà cochée ne repasse pas par ici et ne redonne pas d'XP
  // (test d'intrusion du 27/10, P1).
  const { data: changed, error } = await supabase
    .from('revision_sessions')
    .update({ is_done: body.is_done, done_at: body.is_done ? new Date().toISOString() : null })
    .eq('id', id)
    .eq('user_id', user.id)
    .eq('is_done', !body.is_done)
    .select('id, is_done')
    .maybeSingle()

  if (error) {

    console.error('[/api/planning/sessions/[id]]', error)

    return NextResponse.json({ error: { code: 'DB_ERROR', message: 'Une erreur est survenue, réessaie plus tard.' } }, { status: 500 })

  }

  if (!changed) {
    // Déjà dans l'état demandé (ou séance introuvable / d'un autre élève).
    const { data: current } = await supabase
      .from('revision_sessions').select('id, is_done').eq('id', id).eq('user_id', user.id).maybeSingle()
    if (!current) return NextResponse.json({ error: { code: 'NOT_FOUND' } }, { status: 404 })
    return NextResponse.json({ data: current })
  }

  // +5 XP quand une séance passe à "faite" (best-effort, via service role)
  if (body.is_done) {
    supabaseAdmin.rpc('increment_xp', { p_user_id: user.id, p_amount: 5 }).then(() => {}, () => {})
  }

  return NextResponse.json({ data: changed })
}

/** DELETE /api/planning/sessions/:id */
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { user, supabase } = await authenticate(req)
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  await supabase.from('revision_sessions').delete().eq('id', id).eq('user_id', user.id)
  return NextResponse.json({ data: { deleted: true } })
}
