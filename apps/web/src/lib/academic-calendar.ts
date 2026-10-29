import type { SupabaseClient } from '@supabase/supabase-js'

/**
 * État calendaire courant (migration 045). Un seul niveau supporté pour
 * l'instant : CEPE (seul niveau avec un calendrier scolaire peuplé).
 * Renvoie null si aucune année scolaire ne couvre la date du jour
 * (ex: avant la rentrée / juillet-septembre).
 */
export interface CalendarState {
  year: { id: string; label: string; start_date: string; end_date: string }
  term: { id: string; label: string; term_number: number; start_date: string; end_date: string } | null
  month: { id: string; label: string; order_index: number; start_date: string; end_date: string; term_id: string } | null
  is_holiday: boolean // hors couverture stricte d'un mois (grandes vacances / avant la rentrée)
}

export async function getCurrentCalendarState(
  supabase: SupabaseClient,
  level: string = 'cepe',
  countryCode: string = 'CG'
): Promise<CalendarState | null> {
  const today = new Date().toISOString().slice(0, 10)

  const { data: years } = await supabase
    .from('academic_years')
    .select('id, label, start_date, end_date')
    .eq('level', level)
    .eq('country_code', countryCode)
    .order('start_date')
  const yearRows = years ?? []
  if (yearRows.length === 0) return null

  // Année en cours, sinon la plus proche : la prochaine à venir, sinon la dernière déjà terminée.
  const year =
    yearRows.find((y) => y.start_date <= today && y.end_date >= today) ??
    yearRows.find((y) => y.start_date > today) ??
    yearRows[yearRows.length - 1]!
  const isHolidayYear = !(year.start_date <= today && year.end_date >= today)

  const { data: terms } = await supabase
    .from('terms')
    .select('id, label, term_number, start_date, end_date')
    .eq('academic_year_id', year.id)
    .order('term_number')
  const termRows = terms ?? []
  const termIds = termRows.map((t) => t.id)

  let month = null as CalendarState['month']
  let term = null as CalendarState['term']
  let isHoliday = isHolidayYear

  if (termIds.length > 0) {
    const { data: months } = await supabase
      .from('school_months')
      .select('id, label, order_index, start_date, end_date, term_id')
      .in('term_id', termIds)
      .order('order_index')
    const monthRows = months ?? []

    // Mois courant, sinon le plus proche : le dernier déjà écoulé (fin de trimestre/année),
    // sinon le premier à venir (avant la rentrée).
    const inMonth = monthRows.find((m) => m.start_date <= today && m.end_date >= today)
    month = inMonth ?? [...monthRows].reverse().find((m) => m.end_date < today) ?? monthRows[0] ?? null
    if (!inMonth) isHoliday = true

    if (month) term = termRows.find((t) => t.id === month!.term_id) ?? null
  }

  return { year, term, month, is_holiday: isHoliday }
}
