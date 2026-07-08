import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/** GET /api/quiz/weak-areas — matières où l'élève rate le plus (RLS filtre par user) */
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const { data, error } = await supabase
    .from('quiz_weak_areas')
    .select('subject_id, subject_name, answered, wrong, error_rate')
    .eq('user_id', user.id)
    .gte('answered', 3)
    .order('error_rate', { ascending: false })
    .limit(10)

  if (error) return NextResponse.json({ error: { code: 'DB_ERROR', message: error.message } }, { status: 500 })
  return NextResponse.json({ data: data ?? [] })
}
