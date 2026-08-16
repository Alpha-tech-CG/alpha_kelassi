import { NextResponse } from 'next/server'
import { authenticate } from '@/lib/supabase/api'
import { admin, signedUrl, DUE_MS } from '@/lib/tutor'

/** POST /api/tutor/missions/:id/accept — acceptation atomique (premier arrivé). */
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { user } = await authenticate(req)
  if (!user) return NextResponse.json({ error: { code: 'UNAUTHORIZED' } }, { status: 401 })

  const { data: profile } = await admin().from('tutor_profiles')
    .select('is_verified, is_active').eq('user_id', user.id).maybeSingle()
  if (!profile?.is_verified || !profile.is_active) return NextResponse.json({ error: { code: 'NOT_ELIGIBLE' } }, { status: 403 })

  const { data: mission } = await admin().from('correction_missions')
    .select('id, subject_id, status').eq('id', id).maybeSingle()
  if (!mission) return NextResponse.json({ error: { code: 'NOT_FOUND' } }, { status: 404 })

  const { data: sub } = await admin().from('tutor_subjects')
    .select('subject_id').eq('tutor_id', user.id).eq('subject_id', mission.subject_id).maybeSingle()
  if (!sub) return NextResponse.json({ error: { code: 'WRONG_SUBJECT' } }, { status: 403 })

  const dueAt = new Date(Date.now() + DUE_MS).toISOString()
  const { data: updated, error } = await admin().from('correction_missions')
    .update({ status: 'assigned', tutor_id: user.id, accepted_at: new Date().toISOString(), due_at: dueAt })
    .eq('id', id).eq('status', 'pending')
    .select('id, exercise_url, work_url, due_at').maybeSingle()
  if (error) return NextResponse.json({ error: { code: 'DB_ERROR', message: error.message } }, { status: 500 })
  if (!updated) return NextResponse.json({ error: { code: 'ALREADY_TAKEN', message: 'Mission déjà prise ou expirée.' } }, { status: 409 })

  const [exercise_url, work_url] = await Promise.all([
    signedUrl('exercise-photos', updated.exercise_url),
    signedUrl('student-work', updated.work_url),
  ])
  return NextResponse.json({ data: { id, due_at: updated.due_at, exercise_url, work_url } })
}
