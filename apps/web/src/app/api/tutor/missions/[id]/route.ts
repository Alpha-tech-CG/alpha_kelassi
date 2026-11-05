import { NextResponse } from 'next/server'
import { authenticate } from '@/lib/supabase/api'
import { admin, signedUrl } from '@/lib/tutor'

/** GET /api/tutor/missions/:id — détail d'une mission assignée (photos signées + retour IA). */
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { user } = await authenticate(req)
  if (!user) return NextResponse.json({ error: { code: 'UNAUTHORIZED' } }, { status: 401 })

  const { data: mission } = await admin().from('correction_missions')
    .select('id, status, due_at, attempts, exercise_url, work_url').eq('id', id).eq('tutor_id', user.id).maybeSingle()
  if (!mission) return NextResponse.json({ error: { code: 'NOT_FOUND' } }, { status: 404 })

  const { data: lastSol } = await admin().from('correction_solutions')
    .select('attempt, ai_status, ai_feedback').eq('mission_id', id)
    .order('attempt', { ascending: false }).limit(1).maybeSingle()
  const [exercise_url, work_url] = await Promise.all([
    signedUrl('exercise-photos', mission.exercise_url),
    signedUrl('student-work', mission.work_url),
  ])
  return NextResponse.json({ data: { ...mission, exercise_url, work_url, last_solution: lastSol ?? null } })
}
