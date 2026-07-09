import { NextRequest, NextResponse } from 'next/server'
import { authenticate } from '@/lib/supabase/api'

/**
 * GET /api/quiz/:id — un QCM et ses questions POUR PASSAGE.
 * Ne renvoie JAMAIS correct_index ni explanation (anti-triche) :
 * le corrigé n'arrive qu'après soumission via la RPC.
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { user, supabase } = await authenticate(req)
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const { data: quiz, error } = await supabase
    .from('quizzes')
    .select('id, title, description, level, time_limit_sec, is_premium, subjects(name)')
    .eq('id', id)
    .single()

  if (error || !quiz) return NextResponse.json({ error: { code: 'NOT_FOUND' } }, { status: 404 })

  const { data: questions } = await supabase
    .from('quiz_questions')
    .select('id, position, prompt, options')
    .eq('quiz_id', id)
    .order('position', { ascending: true })

  return NextResponse.json({ data: { ...quiz, questions: questions ?? [] } })
}
