import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-guard'
import { admin } from '@/lib/tutor'

/** POST /api/admin/tutors/:id/verify — valider un tuteur. */
export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin()
  if ('error' in guard) return guard.error
  const { id } = await params

  const { data, error } = await admin().from('tutor_profiles')
    .update({ is_verified: true, verified_at: new Date().toISOString(), is_active: true })
    .eq('user_id', id).select('user_id').maybeSingle()
  if (error) return NextResponse.json({ error: { code: 'DB_ERROR', message: error.message } }, { status: 500 })
  if (!data) return NextResponse.json({ error: { code: 'NOT_FOUND' } }, { status: 404 })

  await admin().from('users').update({ role: 'tutor' }).eq('id', id)
  return NextResponse.json({ data: { ok: true } })
}
