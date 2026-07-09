import { NextRequest, NextResponse } from 'next/server'
import { authenticate } from '@/lib/supabase/api'

/** GET /api/planning/exams?level= — dates d'examen officielles (à venir) */
export async function GET(req: NextRequest) {
  const { user, supabase } = await authenticate(req)
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const level = req.nextUrl.searchParams.get('level')
  const today = new Date().toISOString().slice(0, 10)

  let query = supabase
    .from('exam_events')
    .select('id, level, label, exam_date')
    .gte('exam_date', today)
    .order('exam_date', { ascending: true })

  if (level) query = query.eq('level', level)

  const { data, error } = await query.limit(20)
  if (error) return NextResponse.json({ error: { code: 'DB_ERROR', message: error.message } }, { status: 500 })
  return NextResponse.json({ data: data ?? [] })
}
