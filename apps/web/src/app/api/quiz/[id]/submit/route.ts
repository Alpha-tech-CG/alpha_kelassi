import { NextRequest, NextResponse } from 'next/server'
import { authenticate } from '@/lib/supabase/api'
import { supabaseAdmin } from '@/lib/admin-guard'
import { z } from 'zod'
import { getEntitlements, planRequired, planRequiredFromDbError } from '@/lib/subscription/server'

const schema = z.object({
  answers: z.array(z.object({
    question_id:    z.string().uuid(),
    selected_index: z.number().int().min(0).nullable(),
  })),
  duration_sec: z.number().int().min(0).max(86400),
  mode: z.enum(['entrainement', 'bac_test', 'bac_blanc', 'bac_rouge']).default('entrainement'),
})

interface RpcResult {
  attempt_id: string
  score: number
  penalized_score: number
  wrong: number
  total: number
  mode: string
  corrections: { question_id: string; correct_index: number; explanation: string | null }[]
}

/**
 * POST /api/quiz/:id/submit — soumet les réponses.
 * Le score est calculé côté serveur par la RPC submit_quiz_attempt
 * (security definer), qui vérifie aussi que la formule ouvre le mode choisi.
 * Le client n'envoie jamais le score.
 */
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { user, supabase } = await authenticate(req)
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  let body: z.infer<typeof schema>
  try { body = schema.parse(await req.json()) }
  catch { return NextResponse.json({ error: 'Corps invalide' }, { status: 400 }) }

  const { data, error } = await supabase.rpc('submit_quiz_attempt', {
    p_quiz_id:      id,
    p_answers:      body.answers,
    p_duration_sec: body.duration_sec,
    p_mode:         body.mode,
  })

  if (error) {
    const msg = error.message
    const locked = planRequiredFromDbError(msg)
    if (locked) return locked
    if (msg.includes('PREMIUM_REQUIRED')) return planRequired('full_courses')
    if (msg.includes('QUIZ_NOT_FOUND'))
      return NextResponse.json({ error: { code: 'NOT_FOUND' } }, { status: 404 })
    console.error('[/quiz/[id]/submit]', error)
    return NextResponse.json({ error: { code: 'DB_ERROR', message: 'Une erreur est survenue, réessaie plus tard.' } }, { status: 500 })
  }

  const result = data as unknown as RpcResult
  const ent = await getEntitlements(user.id)

  // XP : 5 par bonne réponse (non bloquant, best-effort).
  // Via le client admin : la RPC increment_xp n'est plus exposée aux clients.
  if (result.score > 0) {
    supabaseAdmin.rpc('increment_xp', { p_user_id: user.id, p_amount: result.score * 5 }).then(() => {}, () => {})
  }

  // L'explication des réponses est une fonction Starter : en Gratuit, on
  // indique la bonne réponse sans le raisonnement.
  const corrections = ent.can('quiz_explanations')
    ? result.corrections
    : result.corrections.map((c) => ({ ...c, explanation: null }))

  // Résultats détaillés (Pro) : répartition, rythme et évolution sur ce sujet.
  let details: Record<string, unknown> | null = null
  if (ent.can('detailed_exam_results')) {
    const { data: history } = await supabaseAdmin.from('quiz_attempts')
      .select('score, total, mode, completed_at')
      .eq('user_id', user.id).eq('quiz_id', id)
      .order('completed_at', { ascending: false }).limit(6)
    const previous = (history ?? []).slice(1)
    const pct = (s: number, t: number) => (t ? Math.round((100 * s) / t) : 0)
    const current = pct(result.penalized_score, result.total)
    const last = previous[0] ? pct(previous[0].score, previous[0].total) : null
    details = {
      success_rate: current,
      correct: result.score,
      wrong: result.wrong,
      blank: Math.max(0, result.total - result.score - result.wrong),
      penalty: result.score - result.penalized_score,
      seconds_per_question: result.total ? Math.round(body.duration_sec / result.total) : null,
      previous_attempts: previous.length,
      best_rate: Math.max(current, ...previous.map((a) => pct(a.score, a.total))),
      delta_vs_last: last === null ? null : current - last,
      advice: result.wrong > result.score
        ? 'Plus d’erreurs que de bonnes réponses : en Bac rouge, laisse une question vide plutôt que de répondre au hasard.'
        : current >= 80
          ? 'Très bon niveau sur ce sujet : passe à une annale plus récente ou au mode supérieur.'
          : 'Revois les explications des questions manquées, puis refais ce sujet dans quelques jours.',
    }
  }

  return NextResponse.json({ data: { ...result, corrections, details } })
}
