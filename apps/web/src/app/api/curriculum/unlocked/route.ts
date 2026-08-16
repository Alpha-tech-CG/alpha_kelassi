import { NextRequest, NextResponse } from 'next/server'
import { authenticate } from '@/lib/supabase/api'
import { getCurrentCalendarState } from '@/lib/academic-calendar'

/**
 * GET /api/curriculum/unlocked
 * Chapitres CEPE débloqués : mois passés + mois courant. Les mois futurs
 * restent verrouillés (simplement absents du résultat) — migration 045.
 */
export async function GET(req: NextRequest) {
  const { user, supabase } = await authenticate(req)
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const state = await getCurrentCalendarState(supabase, 'cepe', 'CG')
  if (!state?.month) return NextResponse.json({ data: { calendar: state, items: [] } })

  const { data: months } = await supabase
    .from('school_months')
    .select('id, label, order_index, end_date')
    .lte('end_date', state.month.end_date)
    .order('order_index')
  const unlockedMonthIds = (months ?? []).map((m) => m.id)
  if (unlockedMonthIds.length === 0) return NextResponse.json({ data: { calendar: state, items: [] } })

  const { data: items, error } = await supabase
    .from('curriculum_items')
    .select('id, order_index, is_core, school_month_id, subject_id, chapter_id, chapters(id, title), subjects(id, name, parent_subject_id)')
    .eq('item_type', 'chapter')
    .in('school_month_id', unlockedMonthIds)
    .order('order_index')
  if (error) return NextResponse.json({ error: { code: 'DB_ERROR', message: error.message } }, { status: 500 })

  const monthById = new Map((months ?? []).map((m) => [m.id, m]))
  const enriched = (items ?? []).map((it) => ({
    ...it,
    month: monthById.get(it.school_month_id) ?? null,
  }))

  return NextResponse.json({ data: { calendar: state, items: enriched } })
}
