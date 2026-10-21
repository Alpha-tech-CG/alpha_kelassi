import { NextRequest, NextResponse } from 'next/server'
import { authenticate } from '@/lib/supabase/api'
import { z } from 'zod'
import { getEntitlements, planRequired } from '@/lib/subscription/server'
import { subjectErrorRates } from '@/lib/learning/analytics'

const schema = z.object({
  plan_id:         z.string().uuid(),
  subject_ids:     z.array(z.string().uuid()).min(1).max(15),
  sessions_per_day: z.number().int().min(1).max(5).default(2),
  duration_min:    z.number().int().min(15).max(180).default(30),
})

/**
 * Répartition pondérée « lisse » (smooth weighted round-robin) : chaque
 * matière revient proportionnellement à son poids, sans paquets consécutifs.
 */
function weightedSequence(ids: string[], weights: Map<string, number>, length: number): string[] {
  const current = new Map(ids.map((id) => [id, 0]))
  const total = ids.reduce((s, id) => s + (weights.get(id) ?? 1), 0)
  const out: string[] = []
  for (let i = 0; i < length; i++) {
    let best = ids[0]!
    for (const id of ids) {
      current.set(id, current.get(id)! + (weights.get(id) ?? 1))
      if (current.get(id)! > current.get(best)!) best = id
    }
    current.set(best, current.get(best)! - total)
    out.push(best)
  }
  return out
}

/**
 * POST /api/planning/generate — génère l'emploi du temps de révision (Starter).
 * Réparti les matières de demain jusqu'à la veille de l'examen.
 * Pro Max : plan ADAPTATIF — les matières où l'élève se trompe le plus
 * reviennent plus souvent (poids 1 à 3 selon le taux d'erreur).
 * Régénère : supprime d'abord les séances existantes non faites du plan.
 */
export async function POST(req: NextRequest) {
  const { user, supabase } = await authenticate(req)
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const ent = await getEntitlements(user.id)
  if (!ent.can('personalized_study_plan')) return planRequired('personalized_study_plan')

  let body: z.infer<typeof schema>
  try { body = schema.parse(await req.json()) }
  catch { return NextResponse.json({ error: 'Corps invalide' }, { status: 400 }) }

  // Récupère le plan (et vérifie qu'il appartient bien à l'élève via RLS)
  const { data: plan } = await supabase
    .from('revision_plans')
    .select('id, exam_date')
    .eq('id', body.plan_id)
    .eq('user_id', user.id)
    .single()
  if (!plan) return NextResponse.json({ error: { code: 'NOT_FOUND' } }, { status: 404 })

  // Noms des matières (pour les titres)
  const { data: subjects } = await supabase
    .from('subjects')
    .select('id, name')
    .in('id', body.subject_ids)
  const nameById = new Map((subjects ?? []).map((s) => [s.id, s.name]))
  const ids = body.subject_ids.filter((id) => nameById.has(id))
  if (ids.length === 0) return NextResponse.json({ error: { code: 'NO_SUBJECT' } }, { status: 422 })

  // Fenêtre : de demain jusqu'à la veille de l'examen
  const start = new Date(); start.setDate(start.getDate() + 1); start.setHours(0, 0, 0, 0)
  const exam = new Date(plan.exam_date + 'T00:00:00')
  const dayMs = 86400000
  const totalDays = Math.floor((exam.getTime() - start.getTime()) / dayMs)
  if (totalDays <= 0) {
    return NextResponse.json({ error: { code: 'EXAM_PASSED', message: 'La date d\'examen est trop proche ou passée.' } }, { status: 422 })
  }

  const MAX = 500
  const slots = Math.min(MAX, totalDays * body.sessions_per_day)

  const adaptive = ent.can('adaptive_study_plan')
  const weights = new Map<string, number>()
  if (adaptive) {
    const errors = new Map((await subjectErrorRates(user.id)).map((e) => [e.subject_id, e.error_rate]))
    for (const id of ids) weights.set(id, 1 + Math.round(((errors.get(id) ?? 0) / 50) * 10) / 10)
  }
  const sequence = adaptive
    ? weightedSequence(ids, weights, slots)
    : Array.from({ length: slots }, (_, i) => ids[i % ids.length]!)

  const rows: Array<{
    user_id: string; plan_id: string; subject_id: string; title: string
    scheduled_date: string; duration_min: number
  }> = sequence.map((subjectId, i) => ({
    user_id:        user.id,
    plan_id:        plan.id,
    subject_id:     subjectId,
    title:          `Réviser ${nameById.get(subjectId)}`,
    scheduled_date: new Date(start.getTime() + Math.floor(i / body.sessions_per_day) * dayMs).toISOString().slice(0, 10),
    duration_min:   body.duration_min,
  }))

  // Régénère : on supprime les séances non faites du plan avant d'insérer
  await supabase.from('revision_sessions')
    .delete()
    .eq('plan_id', plan.id)
    .eq('user_id', user.id)
    .eq('is_done', false)

  const { error } = await supabase.from('revision_sessions').insert(rows)
  if (error) {
    console.error('[/api/planning/generate]', error)
    return NextResponse.json({ error: { code: 'DB_ERROR', message: 'Une erreur est survenue, réessaie plus tard.' } }, { status: 500 })
  }

  return NextResponse.json({
    data: {
      created: rows.length,
      days: totalDays,
      adaptive,
      weights: adaptive ? Object.fromEntries([...weights].map(([id, w]) => [nameById.get(id) ?? id, w])) : null,
    },
  }, { status: 201 })
}
