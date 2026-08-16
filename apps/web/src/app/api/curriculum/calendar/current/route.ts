import { NextRequest, NextResponse } from 'next/server'
import { authenticate } from '@/lib/supabase/api'
import { getCurrentCalendarState } from '@/lib/academic-calendar'

/**
 * GET /api/curriculum/calendar/current
 * Année scolaire / trimestre / mois courants (migration 045).
 * Seul le niveau CEPE a un calendrier peuplé pour l'instant.
 */
export async function GET(req: NextRequest) {
  const { user, supabase } = await authenticate(req)
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const state = await getCurrentCalendarState(supabase, 'cepe', 'CG')
  return NextResponse.json({ data: state })
}
