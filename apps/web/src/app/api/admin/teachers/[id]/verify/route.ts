import { NextResponse } from 'next/server'
import { requireAdmin, supabaseAdmin } from '@/lib/admin-guard'

/** POST /api/admin/teachers/:id/verify — valider un enseignant. */
export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin()
  if ('error' in guard) return guard.error
  const { id } = await params

  const { data, error } = await supabaseAdmin.from('teacher_profiles')
    .update({ is_verified: true, verified_at: new Date().toISOString() })
    .eq('user_id', id).select('user_id').maybeSingle()
  if (error) {
    console.error('[/api/admin/teachers/[id]/verify]', error)
    return NextResponse.json({ error: { code: 'DB_ERROR', message: 'Une erreur est survenue, réessaie plus tard.' } }, { status: 500 })
  }
  if (!data) return NextResponse.json({ error: { code: 'NOT_FOUND' } }, { status: 404 })

  await supabaseAdmin.from('users').update({ role: 'teacher' }).eq('id', id)
  return NextResponse.json({ data: { ok: true } })
}
