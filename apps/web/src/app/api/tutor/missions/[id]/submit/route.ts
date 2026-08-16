import { NextResponse } from 'next/server'
import { z } from 'zod'
import { authenticate } from '@/lib/supabase/api'
import { admin, aiVerifySolution, aiGenerateSolution, creditTutor, recomputeTutorScore, rewardForAttempt, MAX_ATTEMPTS } from '@/lib/tutor'
import { rateLimit, tooMany } from '@/lib/rate-limit'

export const maxDuration = 60

const ownsPath = (userId: string, path: string) => path.split('/')[0] === userId
const schema = z.object({ photo_url: z.string().min(3).max(512) })

/** POST /api/tutor/missions/:id/submit — soumet la correction ; vérif IA SYNCHRONE. */
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { user } = await authenticate(req)
  if (!user) return NextResponse.json({ error: { code: 'UNAUTHORIZED' } }, { status: 401 })
  if (!(await rateLimit(`tutor-submit:${user.id}`, 20, 3600))) return tooMany()

  let body: z.infer<typeof schema>
  try { body = schema.parse(await req.json()) }
  catch { return NextResponse.json({ error: { code: 'BAD_REQUEST' } }, { status: 400 }) }
  if (!ownsPath(user.id, body.photo_url)) return NextResponse.json({ error: { code: 'FORBIDDEN' } }, { status: 403 })

  const { data: mission } = await admin().from('correction_missions')
    .select('id, status, student_id, exercise_url, work_url').eq('id', id).eq('tutor_id', user.id).maybeSingle()
  if (!mission) return NextResponse.json({ error: { code: 'NOT_FOUND' } }, { status: 404 })
  if (mission.status !== 'assigned') return NextResponse.json({ error: { code: 'NOT_ASSIGNED', message: 'Mission non modifiable.' } }, { status: 422 })

  const { count } = await admin().from('correction_solutions')
    .select('id', { count: 'exact', head: true }).eq('mission_id', id)
  const attempt = (count ?? 0) + 1

  const { data: sol, error } = await admin().from('correction_solutions')
    .insert({ mission_id: id, attempt, photo_url: body.photo_url }).select('id').single()
  if (error) return NextResponse.json({ error: { code: 'DB_ERROR', message: error.message } }, { status: 500 })
  await admin().from('correction_missions').update({ status: 'submitted' }).eq('id', id)

  // ── Vérification IA synchrone ──
  const verdict = await aiVerifySolution({ exercise_url: mission.exercise_url, work_url: mission.work_url, photo_url: body.photo_url })

  if (verdict.ok) {
    const reward = rewardForAttempt(attempt)
    await admin().from('correction_solutions').update({ ai_status: 'ok', ai_feedback: verdict.feedback }).eq('id', sol.id)
    await admin().from('correction_missions').update({
      status: 'delivered', delivered_at: new Date().toISOString(), attempts: attempt, reward_fcfa: reward, ai_verdict: 'ok',
    }).eq('id', id)
    await creditTutor(user.id, id, reward)
    await recomputeTutorScore(user.id)
    return NextResponse.json({ data: { status: 'delivered', reward_fcfa: reward } }, { status: 201 })
  }

  await admin().from('correction_solutions').update({ ai_status: 'error', ai_feedback: verdict.feedback }).eq('id', sol.id)

  if (attempt < MAX_ATTEMPTS) {
    await admin().from('correction_missions').update({ status: 'assigned' }).eq('id', id)
    return NextResponse.json({ data: { status: 'retry', ai_feedback: verdict.feedback, attempt } }, { status: 201 })
  }

  // 2e échec → l'IA génère la correction (tuteur payé 0).
  const solutionText = await aiGenerateSolution({ exercise_url: mission.exercise_url, work_url: mission.work_url })
  await admin().from('correction_missions').update({
    status: 'delivered', delivered_at: new Date().toISOString(), attempts: attempt, reward_fcfa: 0, ai_verdict: solutionText,
  }).eq('id', id)
  return NextResponse.json({ data: { status: 'delivered_ai', ai_feedback: verdict.feedback } }, { status: 201 })
}
