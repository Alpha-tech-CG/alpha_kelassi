import { NextResponse } from 'next/server'
import { authenticate } from '@/lib/supabase/api'
import { dayPeriodKey } from '@alpha-kelassi/types'
import { getEntitlements, planRequired } from '@/lib/subscription/server'

/**
 * POST /api/planning/adapt — réajuste le plan de révision (Pro Max).
 *
 * Les séances manquées (passées et non faites) ne sont pas perdues : elles
 * sont reportées sur les jours à venir les moins chargés, avant l'examen.
 * Appelé à la demande par l'élève, ou à l'ouverture du planning.
 */
export async function POST(req: Request) {
  const { user, supabase } = await authenticate(req)
  if (!user) return NextResponse.json({ error: { code: 'UNAUTHORIZED' } }, { status: 401 })

  const ent = await getEntitlements(user.id)
  if (!ent.can('adaptive_study_plan')) return planRequired('adaptive_study_plan')

  const { data: plan } = await supabase.from('revision_plans')
    .select('id, exam_date').eq('user_id', user.id).eq('is_active', true)
    .order('created_at', { ascending: false }).limit(1).maybeSingle()
  if (!plan) return NextResponse.json({ data: { moved: 0 } })

  const today = dayPeriodKey()
  const { data: sessions } = await supabase.from('revision_sessions')
    .select('id, scheduled_date, is_done')
    .eq('plan_id', plan.id).eq('user_id', user.id)
    .order('scheduled_date', { ascending: true }).limit(1000)
  const all = (sessions ?? []) as { id: string; scheduled_date: string; is_done: boolean }[]
  const missed = all.filter((s) => !s.is_done && s.scheduled_date < today)
  if (missed.length === 0) return NextResponse.json({ data: { moved: 0 } })

  // Charge par jour à venir (aujourd'hui inclus, veille de l'examen exclue au-delà).
  const load = new Map<string, number>()
  const examDay = String(plan.exam_date)
  for (let t = new Date(`${today}T12:00:00Z`); ; t = new Date(t.getTime() + 86_400_000)) {
    const key = t.toISOString().slice(0, 10)
    if (key >= examDay) break
    load.set(key, 0)
  }
  for (const s of all) if (!s.is_done && load.has(s.scheduled_date)) load.set(s.scheduled_date, load.get(s.scheduled_date)! + 1)
  if (load.size === 0) return NextResponse.json({ data: { moved: 0, reason: 'EXAM_TOO_CLOSE' } })

  let moved = 0
  for (const s of missed) {
    const [day] = [...load.entries()].sort((a, b) => a[1] - b[1] || a[0].localeCompare(b[0]))[0]!
    const { error } = await supabase.from('revision_sessions').update({ scheduled_date: day }).eq('id', s.id).eq('user_id', user.id)
    if (!error) { load.set(day, load.get(day)! + 1); moved++ }
  }

  return NextResponse.json({ data: { moved } })
}
