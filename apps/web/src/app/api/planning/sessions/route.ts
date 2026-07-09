import { NextRequest, NextResponse } from 'next/server'
import { authenticate } from '@/lib/supabase/api'

/**
 * GET /api/planning/sessions?from=&to=&scope=today|upcoming
 * Renvoie les séances de révision de l'élève sur une fenêtre de dates.
 */
export async function GET(req: NextRequest) {
  const { user, supabase } = await authenticate(req)
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const sp = req.nextUrl.searchParams
  const scope = sp.get('scope')
  const today = new Date().toISOString().slice(0, 10)

  let from = sp.get('from') ?? today
  let to = sp.get('to') ?? today
  if (scope === 'today') { from = today; to = today }
  if (scope === 'upcoming') { from = today; to = new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10) }

  const { data, error } = await supabase
    .from('revision_sessions')
    .select('id, subject_id, title, scheduled_date, duration_min, is_done, subjects(name)')
    .eq('user_id', user.id)
    .gte('scheduled_date', from)
    .lte('scheduled_date', to)
    .order('scheduled_date', { ascending: true })
    .limit(200)

  if (error) return NextResponse.json({ error: { code: 'DB_ERROR', message: error.message } }, { status: 500 })
  return NextResponse.json({ data: data ?? [] })
}
