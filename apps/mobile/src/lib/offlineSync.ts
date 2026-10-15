/**
 * Téléchargement complet du programme (toutes les matières du niveau/filière
 * de l'élève) pour consultation hors-ligne — pas seulement les chapitres déjà
 * visités. Réutilise exactement le même cache que la lecture au fil de l'eau
 * (lib/lessonCache.ts, clé `chapter:${chapterId}`) : une fois la synchro
 * terminée, l'écran de chapitre (app/chapitre/[chapterId].tsx) retrouve les
 * données en cache sans aucune modification de son côté.
 */
import { supabase } from './supabase'
import { writeCachedLesson } from './lessonCache'

export type SyncProgress = { done: number; total: number; label: string }

interface ChapterRow { id: string; title: string; subject_id: string }
interface LessonRow {
  id: string; type: string; title: string; content: string | null
  video_url: string | null; duration_min: number | null; order_index: number; chapter_id: string
}

/**
 * Télécharge et met en cache localement tous les chapitres du niveau/filière
 * donnés. `onProgress` est appelé après chaque chapitre traité (succès ou
 * échec individuel n'interrompt pas le reste).
 */
export async function syncAllForOffline(
  level: string,
  track: string | null,
  onProgress?: (p: SyncProgress) => void,
): Promise<{ synced: number; failed: number; total: number }> {
  let sq = supabase.from('subjects').select('id, name, parent_subject_id').eq('level', level)
  if (track) sq = sq.eq('track_type', track)
  const { data: subjects, error: subjectsError } = await sq
  if (subjectsError) throw new Error(`Matières : ${subjectsError.message}`)
  const subjectIds = (subjects ?? []).map((s) => s.id)
  if (subjectIds.length === 0) return { synced: 0, failed: 0, total: 0 }

  const { data: chapters, error: chaptersError } = await supabase
    .from('chapters').select('id, title, subject_id').in('subject_id', subjectIds)
  if (chaptersError) throw new Error(`Chapitres : ${chaptersError.message}`)
  const chapterRows = (chapters ?? []) as ChapterRow[]
  const chapterIds = chapterRows.map((c) => c.id)
  if (chapterIds.length === 0) return { synced: 0, failed: 0, total: 0 }

  const { data: lessons, error: lessonsError } = await supabase
    .from('lessons')
    .select('id, type, title, content, video_url, duration_min, order_index, chapter_id')
    .in('chapter_id', chapterIds)
  if (lessonsError) throw new Error(`Leçons : ${lessonsError.message}`)
  const lessonRows = (lessons ?? []) as LessonRow[]
  const lessonsByChapter = new Map<string, LessonRow[]>()
  for (const l of lessonRows) {
    const arr = lessonsByChapter.get(l.chapter_id) ?? []
    arr.push(l)
    lessonsByChapter.set(l.chapter_id, arr)
  }

  // Exercices : énoncés de tous les chapitres, tentatives de l'élève et
  // corrigés qu'il a déjà débloqués (la base n'en renvoie pas d'autres).
  const exercisesByChapter = new Map<string, unknown[]>()
  const solutionsByChapter = new Map<string, Record<string, string>>()
  const attemptsByChapter = new Map<string, Record<string, boolean>>()
  try {
    const { data: exercises } = await supabase
      .from('exercises')
      .select('id, title, statement, difficulty, order_index, chapter_id')
      .in('chapter_id', chapterIds)
      .order('order_index')
    const exerciseRows = (exercises ?? []) as ({ id: string; chapter_id: string } & Record<string, unknown>)[]
    const chapitreDeLExercice = new Map(exerciseRows.map((e) => [e.id, e.chapter_id]))
    for (const e of exerciseRows) {
      const arr = exercisesByChapter.get(e.chapter_id) ?? []
      const { chapter_id: _ignore, ...sansChapitre } = e
      arr.push(sansChapitre)
      exercisesByChapter.set(e.chapter_id, arr)
    }

    if (exerciseRows.length > 0) {
      const exerciseIds = exerciseRows.map((e) => e.id)
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: attempts } = await supabase
          .from('exercise_attempts').select('exercise_id').eq('user_id', user.id).in('exercise_id', exerciseIds)
        for (const a of (attempts ?? []) as { exercise_id: string }[]) {
          const ch = chapitreDeLExercice.get(a.exercise_id)
          if (!ch) continue
          const map = attemptsByChapter.get(ch) ?? {}
          map[a.exercise_id] = true
          attemptsByChapter.set(ch, map)
        }
      }
      const { data: solutions } = await supabase
        .from('exercise_solutions').select('exercise_id, solution').in('exercise_id', exerciseIds)
      for (const s of (solutions ?? []) as { exercise_id: string; solution: string }[]) {
        const ch = chapitreDeLExercice.get(s.exercise_id)
        if (!ch) continue
        const map = solutionsByChapter.get(ch) ?? {}
        map[s.exercise_id] = s.solution
        solutionsByChapter.set(ch, map)
      }
    }
  } catch {
    /* les exercices ne bloquent pas la synchronisation des cours */
  }

  const total = chapterRows.length
  let done = 0, synced = 0, failed = 0

  // Traitement par petits lots (4 chapitres en parallèle) : assez rapide sans
  // saturer une connexion faible avec trop de téléchargements simultanés.
  const BATCH = 4
  for (let i = 0; i < chapterRows.length; i += BATCH) {
    const batch = chapterRows.slice(i, i + BATCH)
    await Promise.all(batch.map(async (ch) => {
      const ls = (lessonsByChapter.get(ch.id) ?? []).sort((a, b) => a.order_index - b.order_index)
      const ok = await writeCachedLesson(`chapter:${ch.id}`, 'chapter', JSON.stringify({ title: ch.title, lessons: ls }))

      const exs = exercisesByChapter.get(ch.id)
      if (exs?.length) {
        await writeCachedLesson(`exercises:${ch.id}`, 'chapter', JSON.stringify({ title: ch.title, exercises: exs }))
      }
      const attempts = attemptsByChapter.get(ch.id)
      if (attempts) await writeCachedLesson(`exercise-attempts:${ch.id}`, 'chapter', JSON.stringify(attempts))
      const solutions = solutionsByChapter.get(ch.id)
      if (solutions) await writeCachedLesson(`exercise-solutions:${ch.id}`, 'chapter', JSON.stringify(solutions))

      if (ok) synced++; else failed++
      done++
      onProgress?.({ done, total, label: ch.title })
    }))
  }

  return { synced, failed, total }
}
