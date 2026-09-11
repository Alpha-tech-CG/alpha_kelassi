import { NextRequest, NextResponse } from 'next/server'
import { dayPeriodKey, lockedFeatureInfo } from '@alpha-kelassi/types'
import { authenticate } from '@/lib/supabase/api'
import { supabaseAdmin } from '@/lib/admin-guard'
import { rateLimit, tooMany } from '@/lib/rate-limit'
import { getEntitlements, planRequired } from '@/lib/subscription/server'
import { missedQuestions, revisionRecommendations, subjectErrorRates, subjectProgress } from '@/lib/learning/analytics'
import { recurringErrors, subjectCoaching } from '@/lib/learning/ai'

export const maxDuration = 60

/** Lit une analyse IA du jour en cache, ou la génère puis la met en cache. */
async function cachedInsight<T>(userId: string, kind: 'recurring_errors' | 'subject_recommendations', build: () => Promise<T>): Promise<T & { cached: boolean }> {
  const period = dayPeriodKey()
  const { data } = await supabaseAdmin.from('learning_insights')
    .select('content').eq('user_id', userId).eq('kind', kind).eq('scope', 'all').eq('period_key', period).maybeSingle()
  if (data) return { ...((data as { content: T }).content), cached: true }
  const content = await build()
  await supabaseAdmin.from('learning_insights').upsert(
    { user_id: userId, kind, scope: 'all', period_key: period, content },
    { onConflict: 'user_id,kind,scope,period_key' },
  )
  return { ...content, cached: false }
}

/**
 * GET /api/insights — « Mon analyse ».
 *
 * Pro     : analyse des erreurs (par matière + questions le plus souvent
 *           manquées), suivi détaillé par matière, recommandations de révision.
 * Pro Max : + erreurs récurrentes et recommandations personnalisées par
 *           matière, générées par l'IA une fois par jour.
 */
export async function GET(req: NextRequest) {
  const { user } = await authenticate(req)
  if (!user) return NextResponse.json({ error: { code: 'UNAUTHORIZED' } }, { status: 401 })

  const ent = await getEntitlements(user.id)
  if (!ent.can('ai_error_analysis')) return planRequired('ai_error_analysis')
  if (!(await rateLimit(`insights:${user.id}`, 30, 3600))) return tooMany()

  const [errors, missed, progress] = await Promise.all([
    subjectErrorRates(user.id),
    missedQuestions(user.id, 10),
    subjectProgress(user.id),
  ])
  const recommendations = revisionRecommendations(progress)

  const deep = ent.can('recurring_errors')
  const [recurring, coaching] = deep
    ? await Promise.all([
        cachedInsight(user.id, 'recurring_errors', () => recurringErrors(missed)),
        cachedInsight(user.id, 'subject_recommendations', () => subjectCoaching(progress, errors, missed, recommendations)),
      ])
    : [null, null]

  return NextResponse.json({
    data: {
      plan: ent.plan,
      error_analysis: { by_subject: errors, missed_questions: missed },
      detailed_progress: ent.can('detailed_progress') ? progress : null,
      recommendations,
      recurring_errors: recurring,
      subject_recommendations: coaching,
      locked: deep ? null : {
        recurring_errors: lockedFeatureInfo('recurring_errors'),
        subject_recommendations: lockedFeatureInfo('subject_recommendations'),
      },
    },
  })
}
