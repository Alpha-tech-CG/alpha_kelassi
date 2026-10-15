/**
 * Téléchargement du programme (toutes les matières du niveau/filière de
 * l'élève) pour consultation hors-ligne — pas seulement les chapitres déjà
 * visités. Réutilise le même cache que la lecture au fil de l'eau
 * (lib/lessonCache.ts) : une fois la synchronisation terminée, les écrans de
 * chapitre et d'exercices retrouvent les données sans réseau.
 *
 * La synchronisation est **incrémentale** : on ne retélécharge que les
 * chapitres dont le contenu a changé depuis la dernière fois, grâce à la
 * colonne `updated_at` (migration 062). Tant que cette migration n'est pas
 * appliquée, le script le détecte et retombe sur un téléchargement complet.
 *
 * Ce qui est gardé sur l'appareil, par chapitre :
 *   chapter:<id>              le chapitre et ses leçons (images comprises)
 *   exercises:<id>            les énoncés d'exercices
 *   exercise-attempts:<id>    les exercices déjà tentés par l'élève
 *   exercise-solutions:<id>   les corrigés qu'il a débloqués
 */
import { supabase } from './supabase'
import { writeCachedLesson, readCachedLesson, removeCachedLesson, listCachedEntries } from './lessonCache'

export type SyncProgress = { done: number; total: number; label: string }
export interface SyncResult { synced: number; failed: number; total: number; aJour: number; retires: number }

const ETAT_KEY = 'offline-sync:etat'

interface EtatSync {
  lastSyncAt: string | null
  /** La base n'a pas encore la colonne `updated_at` : synchronisation complète. */
  incrementalIndisponible?: boolean
  /** Chapitres du programme lors de la dernière synchronisation (pour le ménage). */
  chapitres?: string[]
}

interface ChapterRow { id: string; title: string; subject_id: string }
interface LessonRow {
  id: string; type: string; title: string; content: string | null
  video_url: string | null; duration_min: number | null; order_index: number; chapter_id: string
}
interface ExerciseRow {
  id: string; title: string; statement: string; difficulty: number; order_index: number; chapter_id: string
}

/** Code d'erreur PostgreSQL d'une colonne inconnue — la migration 062 manque. */
const COLONNE_INCONNUE = '42703'

async function lireEtat(): Promise<EtatSync> {
  try {
    const brut = await readCachedLesson(ETAT_KEY)
    if (brut) return JSON.parse(brut) as EtatSync
  } catch { /* premier téléchargement */ }
  return { lastSyncAt: null }
}

async function ecrireEtat(etat: EtatSync): Promise<void> {
  await writeCachedLesson(ETAT_KEY, 'etat', JSON.stringify(etat))
}

/**
 * Télécharge et met en cache le programme du niveau/filière donnés.
 * `onProgress` est appelé après chaque chapitre traité ; l'échec d'un chapitre
 * n'interrompt pas les suivants.
 */
export async function syncAllForOffline(
  level: string,
  track: string | null,
  onProgress?: (p: SyncProgress) => void,
): Promise<SyncResult> {
  const etat = await lireEtat()
  const debut = new Date().toISOString()
  let depuis = etat.incrementalIndisponible ? null : etat.lastSyncAt
  let incrementalIndisponible = etat.incrementalIndisponible ?? false

  let sq = supabase.from('subjects').select('id, name, parent_subject_id').eq('level', level)
  if (track) sq = sq.eq('track_type', track)
  const { data: subjects, error: subjectsError } = await sq
  if (subjectsError) throw new Error(`Matières : ${subjectsError.message}`)
  const subjectIds = (subjects ?? []).map((s) => s.id)
  if (subjectIds.length === 0) return { synced: 0, failed: 0, total: 0, aJour: 0, retires: 0 }

  const { data: chapters, error: chaptersError } = await supabase
    .from('chapters').select('id, title, subject_id').in('subject_id', subjectIds)
  if (chaptersError) throw new Error(`Chapitres : ${chaptersError.message}`)
  const chapterRows = (chapters ?? []) as ChapterRow[]
  const chapterIds = chapterRows.map((c) => c.id)
  if (chapterIds.length === 0) return { synced: 0, failed: 0, total: 0, aJour: 0, retires: 0 }

  /** Chapitres dont le contenu a changé depuis la dernière synchronisation. */
  async function chapitresAraffraichir(): Promise<Set<string> | null> {
    if (!depuis) return null                      // premier téléchargement : tout
    const changes = new Set<string>()
    const sources: { table: string; colonne: string }[] = [
      { table: 'chapters', colonne: 'id' },
      { table: 'lessons', colonne: 'chapter_id' },
      { table: 'exercises', colonne: 'chapter_id' },
    ]
    for (const { table, colonne } of sources) {
      const requete = supabase.from(table).select(colonne).gt('updated_at', depuis)
      const { data, error } = table === 'chapters'
        ? await requete.in('id', chapterIds)
        : await requete.in('chapter_id', chapterIds)
      if (error) {
        if (error.code === COLONNE_INCONNUE) {    // migration 062 pas encore appliquée
          incrementalIndisponible = true
          depuis = null
          return null
        }
        throw new Error(`${table} : ${error.message}`)
      }
      for (const ligne of (data ?? []) as unknown as Record<string, string>[]) {
        const id = ligne[colonne]
        if (id) changes.add(id)
      }
    }
    return changes
  }

  const aRafraichir = await chapitresAraffraichir()
  const cibles = aRafraichir ? chapterRows.filter((c) => aRafraichir.has(c.id)) : chapterRows
  const aJour = chapterRows.length - cibles.length

  // Leçons des seuls chapitres à rafraîchir : c'est le gros du téléchargement
  // (textes et images), donc la partie qu'il vaut la peine d'éviter.
  const lessonsByChapter = new Map<string, LessonRow[]>()
  if (cibles.length > 0) {
    const { data: lessons, error: lessonsError } = await supabase
      .from('lessons')
      .select('id, type, title, content, video_url, duration_min, order_index, chapter_id')
      .in('chapter_id', cibles.map((c) => c.id))
    if (lessonsError) throw new Error(`Leçons : ${lessonsError.message}`)
    for (const l of (lessons ?? []) as LessonRow[]) {
      const arr = lessonsByChapter.get(l.chapter_id) ?? []
      arr.push(l)
      lessonsByChapter.set(l.chapter_id, arr)
    }
  }

  // Exercices : légers, et les tentatives comme les corrigés débloqués
  // dépendent de l'élève et non du contenu — on les rafraîchit toujours.
  const exercisesByChapter = new Map<string, Omit<ExerciseRow, 'chapter_id'>[]>()
  const solutionsByChapter = new Map<string, Record<string, string>>()
  const attemptsByChapter = new Map<string, Record<string, boolean>>()
  try {
    const { data: exercises } = await supabase
      .from('exercises')
      .select('id, title, statement, difficulty, order_index, chapter_id')
      .in('chapter_id', chapterIds)
      .order('order_index')
    const exerciseRows = (exercises ?? []) as ExerciseRow[]
    const chapitreDeLExercice = new Map(exerciseRows.map((e) => [e.id, e.chapter_id]))
    for (const { chapter_id, ...reste } of exerciseRows) {
      const arr = exercisesByChapter.get(chapter_id) ?? []
      arr.push(reste)
      exercisesByChapter.set(chapter_id, arr)
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

  const total = cibles.length
  let done = 0, synced = 0, failed = 0

  // Par petits lots : assez rapide sans saturer une connexion faible.
  const BATCH = 4
  for (let i = 0; i < cibles.length; i += BATCH) {
    const batch = cibles.slice(i, i + BATCH)
    await Promise.all(batch.map(async (ch) => {
      const ls = (lessonsByChapter.get(ch.id) ?? []).sort((a, b) => a.order_index - b.order_index)
      const ok = ls.length > 0
        ? await writeCachedLesson(`chapter:${ch.id}`, 'chapter', JSON.stringify({ title: ch.title, lessons: ls }))
        : true
      if (ok) synced++; else failed++
      done++
      onProgress?.({ done, total, label: ch.title })
    }))
  }

  // Exercices, tentatives et corrigés : pour tous les chapitres du programme.
  for (const ch of chapterRows) {
    const exs = exercisesByChapter.get(ch.id)
    if (exs?.length) {
      await writeCachedLesson(`exercises:${ch.id}`, 'chapter', JSON.stringify({ title: ch.title, exercises: exs }))
    }
    const attempts = attemptsByChapter.get(ch.id)
    if (attempts) await writeCachedLesson(`exercise-attempts:${ch.id}`, 'chapter', JSON.stringify(attempts))
    const solutions = solutionsByChapter.get(ch.id)
    if (solutions) await writeCachedLesson(`exercise-solutions:${ch.id}`, 'chapter', JSON.stringify(solutions))
  }

  // Ménage : seuls les chapitres qui étaient au programme la fois précédente
  // et n'y sont plus quittent l'appareil. Un chapitre téléchargé par ailleurs
  // (autre matière consultée, changement de série) n'est jamais touché, et les
  // réponses écrites par l'élève sont toujours conservées.
  let retires = 0
  const vivants = new Set(chapterIds)
  const disparus = (etat.chapitres ?? []).filter((id) => !vivants.has(id))
  if (disparus.length > 0) {
    const presents = new Set((await listCachedEntries()).map((e) => e.key))
    for (const id of disparus) {
      for (const prefixe of ['chapter', 'exercises', 'exercise-attempts', 'exercise-solutions']) {
        const cle = `${prefixe}:${id}`
        if (!presents.has(cle)) continue
        await removeCachedLesson(cle)
        retires++
      }
    }
  }

  await ecrireEtat({ lastSyncAt: debut, incrementalIndisponible, chapitres: chapterIds })
  return { synced, failed, total, aJour, retires }
}

/** Date de la dernière synchronisation réussie, pour l'écran « Mes cours hors-ligne ». */
export async function derniereSynchro(): Promise<Date | null> {
  const etat = await lireEtat()
  return etat.lastSyncAt ? new Date(etat.lastSyncAt) : null
}
