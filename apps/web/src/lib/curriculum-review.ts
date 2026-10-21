import type { SupabaseClient } from '@supabase/supabase-js'

/**
 * Met à jour le suivi de révision (curriculum_item_review, migration 045)
 * pour le chapitre d'une leçon de type 'quiz' après complétion.
 *
 * Portée v1 : seules les leçons-quiz alimentent ce suivi (signal non-ambigu :
 * une leçon appartient à exactement un chapitre = un curriculum_item). Les
 * exercices (pas de score, juste "tenté") et les QCM de la banque examen (liés
 * à une matière, pas à un chapitre précis) n'y contribuent pas encore.
 *
 * SM-2 simplifié, sans colonne d'intervalle dédiée : l'intervalle précédent
 * est approximé par le nombre de jours écoulés depuis last_reviewed_at.
 *   - réussite (score >= 80)  → prochain intervalle = jours_écoulés × ease_factor
 *   - échec                   → intervalle réinitialisé à 1 jour, ease_factor -0.2 (plancher 1.3)
 */
export async function recordChapterReview(
  supabase: SupabaseClient,
  userId: string,
  chapterId: string,
  score: number
): Promise<void> {
  const { data: item } = await supabase
    .from('curriculum_items')
    .select('id')
    .eq('chapter_id', chapterId)
    .eq('item_type', 'chapter')
    .maybeSingle()
  if (!item) return // chapitre hors calendrier scolaire (BEPC/BAC, ou pas encore planifié)

  const { data: prev } = await supabase
    .from('curriculum_item_review')
    .select('score_best, attempts_count, ease_factor, last_reviewed_at')
    .eq('user_id', userId)
    .eq('curriculum_item_id', item.id)
    .maybeSingle()

  const passed = score >= 80
  let easeFactor: number = prev?.ease_factor ?? 2.5
  let intervalDays: number

  if (passed) {
    const daysSinceLast = prev?.last_reviewed_at
      ? Math.max(1, Math.round((Date.now() - new Date(prev.last_reviewed_at).getTime()) / 86_400_000))
      : 1
    easeFactor = Math.min(2.8, easeFactor + 0.05)
    intervalDays = Math.round(daysSinceLast * easeFactor)
  } else {
    easeFactor = Math.max(1.3, easeFactor - 0.2)
    intervalDays = 1
  }

  const nowIso = new Date().toISOString()
  const nextReviewAt = new Date(Date.now() + intervalDays * 86_400_000).toISOString()

  await supabase.from('curriculum_item_review').upsert(
    {
      user_id: userId,
      curriculum_item_id: item.id,
      score_best: Math.max(prev?.score_best ?? 0, score),
      attempts_count: (prev?.attempts_count ?? 0) + 1,
      last_reviewed_at: nowIso,
      next_review_at: nextReviewAt,
      ease_factor: easeFactor,
    },
    { onConflict: 'user_id,curriculum_item_id' }
  )
}
