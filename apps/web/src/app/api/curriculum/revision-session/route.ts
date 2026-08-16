import { NextRequest, NextResponse } from 'next/server'
import { authenticate } from '@/lib/supabase/api'
import { getCurrentCalendarState } from '@/lib/academic-calendar'

/**
 * GET /api/curriculum/revision-session?limit=15
 * Sélection pondérée de chapitres à réviser parmi les chapitres débloqués
 * (migration 045) : 60% priorité aux points faibles (score_best), 40% à
 * l'ancienneté de révision (next_review_at), plafonnée à 30 jours de retard.
 * Jamais tenté = priorité maximale sur les deux axes.
 *
 * Tirage pondéré sans remise (algorithme d'Efraimidis-Spirakis) : chaque
 * chapitre reçoit une clé aléatoire^(1/poids), on garde les N plus grandes.
 */
export async function GET(req: NextRequest) {
  const { user, supabase } = await authenticate(req)
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const limit = Math.min(30, Math.max(1, Number(req.nextUrl.searchParams.get('limit') ?? 15)))

  const state = await getCurrentCalendarState(supabase, 'cepe', 'CG')
  if (!state?.month) return NextResponse.json({ data: { calendar: state, items: [] } })

  const { data: months } = await supabase
    .from('school_months')
    .select('id, end_date')
    .lte('end_date', state.month.end_date)
  const unlockedMonthIds = (months ?? []).map((m) => m.id)
  if (unlockedMonthIds.length === 0) return NextResponse.json({ data: { calendar: state, items: [] } })

  const { data: items, error } = await supabase
    .from('curriculum_items')
    .select('id, chapter_id, subject_id, chapters(id, title), subjects(id, name, parent_subject_id)')
    .eq('item_type', 'chapter')
    .in('school_month_id', unlockedMonthIds)
  if (error) return NextResponse.json({ error: { code: 'DB_ERROR', message: error.message } }, { status: 500 })
  const candidates = items ?? []
  if (candidates.length === 0) return NextResponse.json({ data: { calendar: state, items: [] } })

  const { data: reviews } = await supabase
    .from('curriculum_item_review')
    .select('curriculum_item_id, score_best, next_review_at')
    .eq('user_id', user.id)
    .in('curriculum_item_id', candidates.map((c) => c.id))
  const reviewByItem = new Map((reviews ?? []).map((r) => [r.curriculum_item_id, r]))

  const now = Date.now()
  const scored = candidates.map((item) => {
    const r = reviewByItem.get(item.id)
    const overdueDays = r?.next_review_at ? Math.max(0, (now - new Date(r.next_review_at).getTime()) / 86_400_000) : 999
    const weakness = r?.score_best != null ? 100 - r.score_best : 80
    const weight = weakness * 0.6 + Math.min(overdueDays, 30) * (100 / 30) * 0.4
    return { item, weakness, overdueDays: Math.round(Math.min(overdueDays, 999)), weight: Math.max(weight, 0.01) }
  })

  // Efraimidis-Spirakis : clé = random()^(1/poids), on garde les N plus grandes clés.
  const keyed = scored.map((s) => ({ ...s, key: Math.pow(Math.random(), 1 / s.weight) }))
  keyed.sort((a, b) => b.key - a.key)
  const picked = keyed.slice(0, limit).map(({ item, weakness, overdueDays }) => ({
    ...item,
    weakness_score: Math.round(weakness),
    overdue_days: overdueDays,
  }))

  return NextResponse.json({ data: { calendar: state, items: picked } })
}
