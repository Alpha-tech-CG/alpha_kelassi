import { NextRequest, NextResponse } from 'next/server'
import { authenticate } from '@/lib/supabase/api'
import { allowedExamModes, lockedFeatureInfo } from '@alpha-kelassi/types'
import { getEntitlements } from '@/lib/subscription/server'
import { supabaseAdmin } from '@/lib/admin-guard'

/**
 * GET /api/quiz/:id — un QCM et ses questions POUR PASSAGE.
 * Ne renvoie JAMAIS correct_index ni explanation (anti-triche) :
 * le corrigé n'arrive qu'après soumission via la RPC.
 *
 * Si la formule ne donne pas accès aux questions (RLS), le QCM est renvoyé
 * « verrouillé » avec l'explication à afficher, au lieu d'une liste vide.
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { user, supabase } = await authenticate(req)
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const { data: quiz, error } = await supabase
    .from('quizzes')
    .select('id, title, description, level, time_limit_sec, is_premium, is_exam, chapter_id, subjects(name)')
    .eq('id', id)
    .single()

  if (error || !quiz) return NextResponse.json({ error: { code: 'NOT_FOUND' } }, { status: 404 })

  const [{ data: questions }, { count: totalQuestions }, ent] = await Promise.all([
    supabase.from('quiz_questions')
      .select('id, position, prompt, options')
      .eq('quiz_id', id)
      .order('position', { ascending: true }),
    // Compte réel (service role) : distingue « verrouillé » de « pas encore de questions ».
    supabaseAdmin.from('quiz_questions').select('id', { count: 'exact', head: true }).eq('quiz_id', id),
    getEntitlements(user.id),
  ])

  const isExam = (quiz as { is_exam?: boolean }).is_exam === true
  const modes = isExam ? allowedExamModes(ent.plan) : null
  const lockedFeature = isExam ? 'free_exam_mode' : 'chapter_quizzes'
  const hiddenByPlan = (totalQuestions ?? 0) > 0 && (questions ?? []).length === 0
  const locked = hiddenByPlan || (isExam && modes!.length === 0)

  return NextResponse.json({
    data: {
      ...quiz,
      questions: locked ? [] : questions ?? [],
      allowed_modes: modes,
      locked: locked ? lockedFeatureInfo(lockedFeature) : null,
    },
  })
}
