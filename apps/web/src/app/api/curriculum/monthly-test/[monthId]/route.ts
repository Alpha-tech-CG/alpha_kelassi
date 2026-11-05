import { NextRequest, NextResponse } from 'next/server'
import { authenticate } from '@/lib/supabase/api'

/**
 * GET /api/curriculum/monthly-test/:monthId
 * Renvoie le QCM marqué is_monthly_test pour ce mois (migration 045), s'il existe.
 *
 * NB : contrairement aux compositions trimestrielles (§ term-exam), il n'existe
 * pas de banque de questions par chapitre pour le CEPE — le contenu "quiz" par
 * chapitre est une leçon markdown (lesson.type='quiz'), pas des quiz_questions.
 * Sans quiz dédié créé par un admin (via /admin/quiz, is_monthly_test=true,
 * default_month_id=ce mois), il n'y a donc rien de sérieux à assembler à la
 * volée : on renvoie available=false plutôt que de fabriquer un faux test.
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ monthId: string }> }) {
  const { monthId } = await params
  const { user, supabase } = await authenticate(req)
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const { data: month } = await supabase.from('school_months').select('id, label').eq('id', monthId).maybeSingle()
  if (!month) return NextResponse.json({ error: { code: 'NOT_FOUND' } }, { status: 404 })

  const { data: quiz } = await supabase
    .from('quizzes')
    .select('id, title, description, time_limit_sec, is_premium')
    .eq('is_monthly_test', true)
    .eq('default_month_id', monthId)
    .maybeSingle()

  if (!quiz) return NextResponse.json({ data: { available: false, month, quiz: null } })
  return NextResponse.json({ data: { available: true, month, quiz } })
}
