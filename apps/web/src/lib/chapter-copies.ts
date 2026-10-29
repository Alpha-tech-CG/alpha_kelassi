import { supabaseAdmin } from '@/lib/admin-guard'

/**
 * Copies liées d'un cours publié dans plusieurs séries (migration 060).
 *
 * Après chaque modification d'un chapitre ORIGINAL (leçons, exercices, QCM),
 * la console appelle `syncAfterChange` : les copies des autres séries sont
 * remises à l'image de l'original. Une modification faite directement dans une
 * copie ne déclenche rien — synchroniser depuis l'original l'écraserait.
 *
 * Toujours sans échec : une synchro ratée ne doit pas faire échouer
 * l'enregistrement, et le bouton « Synchroniser » de la console permet de
 * rattraper.
 */
export async function syncAfterChange(ref: { chapterId?: string | null; lessonId?: string; exerciseId?: string; quizId?: string }) {
  try {
    let chapterId = ref.chapterId ?? null
    if (!chapterId && ref.lessonId) {
      const { data } = await supabaseAdmin.from('lessons').select('chapter_id').eq('id', ref.lessonId).maybeSingle()
      chapterId = data?.chapter_id ?? null
    }
    if (!chapterId && ref.exerciseId) {
      const { data } = await supabaseAdmin.from('exercises').select('chapter_id').eq('id', ref.exerciseId).maybeSingle()
      chapterId = data?.chapter_id ?? null
    }
    if (!chapterId && ref.quizId) {
      const { data } = await supabaseAdmin.from('quizzes').select('chapter_id').eq('id', ref.quizId).maybeSingle()
      chapterId = data?.chapter_id ?? null
    }
    if (!chapterId) return

    const { data: chapter } = await supabaseAdmin.from('chapters').select('source_chapter_id').eq('id', chapterId).maybeSingle()
    if (!chapter || chapter.source_chapter_id) return   // introuvable, ou c'est une copie

    const { count } = await supabaseAdmin.from('chapters').select('id', { count: 'exact', head: true }).eq('source_chapter_id', chapterId)
    if (!count) return

    const { error } = await supabaseAdmin.rpc('sync_chapter_copies', { p_chapter: chapterId })
    if (error) console.error('[chapter-copies] synchro', chapterId, error)
  } catch (e) {
    console.error('[chapter-copies] synchro', e)
  }
}
