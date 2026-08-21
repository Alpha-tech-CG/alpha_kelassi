import { NextResponse } from 'next/server'
import { authenticate } from '@/lib/supabase/api'
import { signedUrl } from '@/lib/tutor'

/** GET /api/corrections/:id — statut détaillé + correction si livrée (élève). */
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { user, supabase } = await authenticate(req)
  if (!user) return NextResponse.json({ error: { code: 'UNAUTHORIZED' } }, { status: 401 })

  const { data: mission, error } = await supabase.from('correction_missions')
    .select('id, subject_id, status, accepted_at, due_at, delivered_at, attempts, reward_fcfa, ai_verdict, created_at, subjects(name)')
    .eq('id', id).eq('student_id', user.id).maybeSingle()
  if (error) {
    console.error('[/api/corrections/[id]]', error)
    return NextResponse.json({ error: { code: 'DB_ERROR', message: 'Une erreur est survenue, réessaie plus tard.' } }, { status: 500 })
  }
  if (!mission) return NextResponse.json({ error: { code: 'NOT_FOUND' } }, { status: 404 })

  let solution_url: string | null = null
  if (mission.status === 'delivered') {
    const { data: sol } = await supabase.from('correction_solutions')
      .select('photo_url, ai_status').eq('mission_id', id).eq('ai_status', 'ok')
      .order('attempt', { ascending: false }).limit(1).maybeSingle()
    if (sol) solution_url = await signedUrl('tutor-solutions', sol.photo_url)
  }
  return NextResponse.json({ data: { ...mission, solution_url } })
}
