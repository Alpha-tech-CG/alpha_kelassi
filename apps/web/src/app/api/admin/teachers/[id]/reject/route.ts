import { NextResponse } from 'next/server'
import { requireAdmin, supabaseAdmin } from '@/lib/admin-guard'

/** POST /api/admin/teachers/:id/reject — rejeter (supprime le profil enseignant, repasse élève). */
export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin()
  if ('error' in guard) return guard.error
  const { id } = await params

  const { error } = await supabaseAdmin.from('teacher_profiles').delete().eq('user_id', id)
  if (error) {
    console.error('[/api/admin/teachers/[id]/reject]', error)
    return NextResponse.json({ error: { code: 'DB_ERROR', message: 'Une erreur est survenue, réessaie plus tard.' } }, { status: 500 })
  }
  await supabaseAdmin.from('users').update({ role: 'student' }).eq('id', id)
  return NextResponse.json({ data: { ok: true } })
}
