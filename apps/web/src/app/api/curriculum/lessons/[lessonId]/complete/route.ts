import { NextRequest, NextResponse } from 'next/server'
import { authenticate } from '@/lib/supabase/api'
import { XP, awardXP, awardBadges, checkAndAwardBadges } from '@/lib/xp'
import { recordChapterReview } from '@/lib/curriculum-review'
import { z } from 'zod'

const schema = z.object({ score: z.number().int().min(0).max(100).optional() })

/**
 * POST /api/curriculum/lessons/:lessonId/complete
 * Marque une leçon comme complétée, attribue l'XP (1ʳᵉ complétion uniquement),
 * et le bonus + badge chapter_master si le chapitre passe à 100 %.
 * Appelable web (cookies) et mobile (Bearer) via authenticate().
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  const { lessonId } = await params
  const { user, supabase } = await authenticate(req)
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  let body: z.infer<typeof schema>
  try { body = schema.parse(await req.json().catch(() => ({}))) }
  catch { return NextResponse.json({ error: 'Corps invalide' }, { status: 400 }) }
  const { score } = body

  // Lecture via client scopé → RLS bloque l'accès aux leçons premium non autorisées
  const { data: lesson, error: lErr } = await supabase
    .from('lessons')
    .select('id, type, chapter_id')
    .eq('id', lessonId)
    .maybeSingle()
  if (lErr) return NextResponse.json({ error: { code: 'DB_ERROR', message: lErr.message } }, { status: 500 })
  if (!lesson) return NextResponse.json({ error: { code: 'NOT_FOUND', message: 'Leçon introuvable ou réservée aux abonnés Premium.' } }, { status: 404 })

  // État précédent (idempotence XP)
  const { data: prev } = await supabase
    .from('lesson_progress')
    .select('completed, score')
    .eq('user_id', user.id)
    .eq('lesson_id', lessonId)
    .maybeSingle()
  const wasCompleted  = prev?.completed === true
  const wasQuizPassed = wasCompleted && (prev?.score ?? 0) >= 80

  let xp = 0
  if (lesson.type === 'quiz') {
    if ((score ?? 0) >= 80 && !wasQuizPassed) xp += XP.LESSON_QUIZ_PASS
  } else if (!wasCompleted) {
    if (lesson.type === 'cours')  xp += XP.LESSON_COURS
    if (lesson.type === 'resume') xp += XP.LESSON_RESUME
    if (lesson.type === 'video')  xp += XP.LESSON_VIDEO
  }

  const { error: upErr } = await supabase.from('lesson_progress').upsert({
    user_id:      user.id,
    lesson_id:    lessonId,
    completed:    true,
    score:        lesson.type === 'quiz' ? (score ?? 0) : null,
    completed_at: new Date().toISOString(),
  }, { onConflict: 'user_id,lesson_id' })
  if (upErr) return NextResponse.json({ error: { code: 'DB_ERROR', message: upErr.message } }, { status: 500 })

  // Chapitre complété à 100 % ? (leçons accessibles seulement)
  let chapterCompleted = false
  const { data: siblings } = await supabase.from('lessons').select('id').eq('chapter_id', lesson.chapter_id)
  const siblingIds = (siblings ?? []).map((s) => s.id)
  if (siblingIds.length > 0) {
    const { count } = await supabase
      .from('lesson_progress')
      .select('lesson_id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('completed', true)
      .in('lesson_id', siblingIds)
    if ((count ?? 0) >= siblingIds.length && !wasCompleted) {
      chapterCompleted = true
      xp += XP.CHAPTER_COMPLETE
    }
  }

  if (xp > 0) await awardXP(user.id, xp)
  if (chapterCompleted) await awardBadges(user.id, ['chapter_master'])
  await checkAndAwardBadges(user.id)

  // Calendrier scolaire (migr. 045) : alimente le suivi de révision du chapitre.
  if (lesson.type === 'quiz' && score !== undefined) {
    recordChapterReview(supabase, user.id, lesson.chapter_id, score).catch(() => {})
  }

  return NextResponse.json({ data: { completed: true, xp_awarded: xp, chapter_completed: chapterCompleted } })
}
