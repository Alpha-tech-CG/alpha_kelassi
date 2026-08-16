import { NextRequest, NextResponse } from 'next/server'
import { authenticate } from '@/lib/supabase/api'

/**
 * GET /api/curriculum/term-exam/:termId
 * Renvoie le QCM marqué is_term_exam pour ce trimestre (migration 045), s'il existe.
 *
 * À défaut (aucun admin n'a encore créé de composition dédiée), on suggère une
 * annale CEPE existante (is_exam=true) non encore tentée par l'élève — le
 * contenu "composition trimestrielle" le plus proche disponible aujourd'hui.
 * La réponse distingue clairement is_dedicated (vrai QCM du trimestre) de
 * is_suggested_fallback (annale suggérée à la place).
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ termId: string }> }) {
  const { termId } = await params
  const { user, supabase } = await authenticate(req)
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const { data: term } = await supabase.from('terms').select('id, label').eq('id', termId).maybeSingle()
  if (!term) return NextResponse.json({ error: { code: 'NOT_FOUND' } }, { status: 404 })

  const { data: dedicated } = await supabase
    .from('quizzes')
    .select('id, title, description, time_limit_sec, is_premium')
    .eq('is_term_exam', true)
    .eq('default_term_id', termId)
    .maybeSingle()

  if (dedicated) {
    return NextResponse.json({ data: { available: true, is_dedicated: true, is_suggested_fallback: false, term, quiz: dedicated } })
  }

  const { data: attempted } = await supabase.from('quiz_attempts').select('quiz_id').eq('user_id', user.id)
  const attemptedIds = new Set((attempted ?? []).map((a) => a.quiz_id))

  const { data: annales } = await supabase
    .from('quizzes')
    .select('id, title, description, time_limit_sec, is_premium')
    .eq('level', 'cepe')
    .eq('is_exam', true)
  const candidates = (annales ?? []).filter((q) => !attemptedIds.has(q.id))
  const pool = candidates.length > 0 ? candidates : (annales ?? [])
  const suggestion = pool.length > 0 ? pool[Math.floor(Math.random() * pool.length)] : null

  if (!suggestion) return NextResponse.json({ data: { available: false, is_dedicated: false, is_suggested_fallback: false, term, quiz: null } })
  return NextResponse.json({ data: { available: true, is_dedicated: false, is_suggested_fallback: true, term, quiz: suggestion } })
}
