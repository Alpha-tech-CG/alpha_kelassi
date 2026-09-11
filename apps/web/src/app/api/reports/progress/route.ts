import { NextRequest, NextResponse } from 'next/server'
import { dayPeriodKey } from '@alpha-kelassi/types'
import { authenticate } from '@/lib/supabase/api'
import { supabaseAdmin } from '@/lib/admin-guard'
import { rateLimit, tooMany } from '@/lib/rate-limit'
import { getEntitlements, planRequired } from '@/lib/subscription/server'
import { revisionRecommendations, subjectErrorRates, subjectProgress } from '@/lib/learning/analytics'
import { reportSummary } from '@/lib/learning/ai'

export const maxDuration = 60

/** GET /api/reports/progress — mes rapports de progression (Pro Max). */
export async function GET(req: NextRequest) {
  const { user } = await authenticate(req)
  if (!user) return NextResponse.json({ error: { code: 'UNAUTHORIZED' } }, { status: 401 })
  const ent = await getEntitlements(user.id)
  if (!ent.can('progress_reports')) return planRequired('progress_reports')

  const { data } = await supabaseAdmin.from('progress_reports')
    .select('id, period_start, period_end, summary, content, created_at')
    .eq('user_id', user.id).order('period_end', { ascending: false }).limit(12)
  return NextResponse.json({ data: data ?? [] })
}

/**
 * POST /api/reports/progress — génère le rapport des 7 derniers jours
 * (Pro Max). Le même rapport est visible par le parent lié, depuis son
 * tableau de bord. Régénérer le même jour remplace le rapport du jour.
 */
export async function POST(req: NextRequest) {
  const { user } = await authenticate(req)
  if (!user) return NextResponse.json({ error: { code: 'UNAUTHORIZED' } }, { status: 401 })
  const ent = await getEntitlements(user.id)
  if (!ent.can('progress_reports')) return planRequired('progress_reports')
  if (!(await rateLimit(`report:${user.id}`, 5, 86_400))) return tooMany()

  const end = dayPeriodKey()
  const start = dayPeriodKey(new Date(Date.now() - 6 * 86_400_000))
  const fromIso = `${start}T00:00:00+01:00`

  const [{ data: lessons }, { data: quizzes }, { data: corrections }, { data: aiUsage }, progress, errors] = await Promise.all([
    supabaseAdmin.from('lesson_progress').select('completed_at').eq('user_id', user.id).eq('completed', true).gte('completed_at', fromIso),
    supabaseAdmin.from('quiz_attempts').select('score, total, mode, completed_at').eq('user_id', user.id).gte('completed_at', fromIso),
    supabaseAdmin.from('correction_missions').select('status').eq('student_id', user.id).gte('created_at', fromIso),
    supabaseAdmin.from('usage_counters').select('used').eq('user_id', user.id).eq('usage_type', 'ai_questions').gte('period_key', start).lte('period_key', end),
    subjectProgress(user.id),
    subjectErrorRates(user.id, 7),
  ])

  const lessonRows = (lessons ?? []) as { completed_at: string }[]
  const quizRows = (quizzes ?? []) as { score: number; total: number; mode: string | null; completed_at: string }[]
  const activeDays = new Set([...lessonRows.map((l) => l.completed_at), ...quizRows.map((q) => q.completed_at)]
    .map((d) => dayPeriodKey(new Date(d)))).size
  const quizAverage = quizRows.length
    ? Math.round(quizRows.reduce((s, q) => s + (q.total ? (100 * q.score) / q.total : 0), 0) / quizRows.length)
    : null
  const recommendations = revisionRecommendations(progress).slice(0, 3)

  const content = {
    period: { start, end },
    active_days: activeDays,
    lessons_completed: lessonRows.length,
    quizzes_taken: quizRows.length,
    quiz_average: quizAverage,
    simulations: quizRows.filter((q) => q.mode && q.mode !== 'entrainement').length,
    ai_questions: ((aiUsage ?? []) as { used: number }[]).reduce((s, r) => s + r.used, 0),
    corrections_requested: (corrections ?? []).length,
    weakest_subjects: errors.slice(0, 3),
    subjects: progress.map((p) => ({ subject_name: p.subject_name, completion: p.completion, quiz_average: p.quiz_average })),
    recommendations,
    top_priority: recommendations[0] ? `${recommendations[0].subject_name} (${recommendations[0].reason})` : null,
  }
  const summary = await reportSummary(content)

  const { data, error } = await supabaseAdmin.from('progress_reports').upsert(
    { user_id: user.id, period_start: start, period_end: end, content, summary },
    { onConflict: 'user_id,period_start,period_end' },
  ).select('id, period_start, period_end, summary, content, created_at').single()
  if (error) {
    console.error('[/api/reports/progress]', error)
    return NextResponse.json({ error: { code: 'DB_ERROR', message: 'Le rapport n’a pas pu être enregistré. Réessaie.' } }, { status: 500 })
  }
  return NextResponse.json({ data }, { status: 201 })
}
