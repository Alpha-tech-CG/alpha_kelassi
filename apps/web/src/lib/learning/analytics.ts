import { supabaseAdmin } from '@/lib/admin-guard'

/**
 * Statistiques d'apprentissage d'un élève, calculées côté serveur à partir des
 * tentatives de QCM et de la progression des leçons. Base commune de l'analyse
 * des erreurs (Pro), du suivi détaillé (Pro), du plan adaptatif (Pro Max) et
 * des rapports de progression (Pro Max).
 *
 * Toutes les lectures passent par le service role APRÈS authentification de
 * l'appelant : chaque fonction prend l'identifiant de l'élève concerné.
 */

export interface SubjectErrorStat {
  subject_id: string
  subject_name: string
  answered: number
  wrong: number
  error_rate: number
}

export interface MissedQuestion {
  question_id: string
  prompt: string
  explanation: string | null
  subject_name: string
  chapter_title: string | null
  times_wrong: number
  times_answered: number
}

export interface SubjectProgress {
  subject_id: string
  subject_name: string
  lessons_total: number
  lessons_done: number
  completion: number
  quiz_attempts: number
  quiz_average: number | null
  error_rate: number | null
  last_activity: string | null
}

interface AnswerRow { attempt_id: string; question_id: string; is_correct: boolean; selected_index: number | null }
interface QuestionRow { id: string; quiz_id: string; prompt: string; explanation: string | null }
interface QuizRow { id: string; subject_id: string | null; chapter_id: string | null }

const since = (days: number) => new Date(Date.now() - days * 86_400_000).toISOString()

/** Réponses récentes avec leur matière et leur chapitre. */
async function loadAnswers(userId: string, days: number) {
  const { data: attempts } = await supabaseAdmin.from('quiz_attempts')
    .select('id, quiz_id, score, total, completed_at')
    .eq('user_id', userId).gte('completed_at', since(days))
    .order('completed_at', { ascending: false }).limit(300)
  const attemptRows = (attempts ?? []) as { id: string; quiz_id: string; score: number; total: number; completed_at: string }[]
  if (attemptRows.length === 0) return { attempts: attemptRows, answers: [], questions: new Map(), quizzes: new Map(), subjects: new Map(), chapters: new Map() }

  const { data: answers } = await supabaseAdmin.from('quiz_attempt_answers')
    .select('attempt_id, question_id, is_correct, selected_index')
    .in('attempt_id', attemptRows.map((a) => a.id)).limit(5000)
  const answerRows = (answers ?? []) as AnswerRow[]

  const questionIds = [...new Set(answerRows.map((a) => a.question_id))]
  const { data: questions } = questionIds.length
    ? await supabaseAdmin.from('quiz_questions').select('id, quiz_id, prompt, explanation').in('id', questionIds)
    : { data: [] }
  const questionMap = new Map(((questions ?? []) as QuestionRow[]).map((q) => [q.id, q]))

  const quizIds = [...new Set(attemptRows.map((a) => a.quiz_id))]
  const { data: quizzes } = await supabaseAdmin.from('quizzes').select('id, subject_id, chapter_id').in('id', quizIds)
  const quizMap = new Map(((quizzes ?? []) as QuizRow[]).map((q) => [q.id, q]))

  const chapterIds = [...new Set([...quizMap.values()].map((q) => q.chapter_id).filter(Boolean))] as string[]
  const { data: chapters } = chapterIds.length
    ? await supabaseAdmin.from('chapters').select('id, title, subject_id').in('id', chapterIds)
    : { data: [] }
  const chapterMap = new Map(((chapters ?? []) as { id: string; title: string; subject_id: string }[]).map((c) => [c.id, c]))

  const subjectIds = [...new Set([...quizMap.values()].map((q) => q.subject_id ?? (q.chapter_id ? chapterMap.get(q.chapter_id)?.subject_id : null)).filter(Boolean))] as string[]
  const { data: subjects } = subjectIds.length
    ? await supabaseAdmin.from('subjects').select('id, name').in('id', subjectIds)
    : { data: [] }
  const subjectMap = new Map(((subjects ?? []) as { id: string; name: string }[]).map((s) => [s.id, s.name]))

  return { attempts: attemptRows, answers: answerRows, questions: questionMap, quizzes: quizMap, subjects: subjectMap, chapters: chapterMap }
}

function subjectOf(quiz: QuizRow | undefined, chapters: Map<string, { subject_id: string }>): string | null {
  if (!quiz) return null
  return quiz.subject_id ?? (quiz.chapter_id ? chapters.get(quiz.chapter_id)?.subject_id ?? null : null)
}

/** Taux d'erreur par matière (réponses données ou laissées vides). */
export async function subjectErrorRates(userId: string, days = 90): Promise<SubjectErrorStat[]> {
  const d = await loadAnswers(userId, days)
  const attemptQuiz = new Map(d.attempts.map((a) => [a.id, a.quiz_id]))
  const stats = new Map<string, { answered: number; wrong: number }>()
  for (const a of d.answers) {
    const sid = subjectOf(d.quizzes.get(attemptQuiz.get(a.attempt_id) ?? ''), d.chapters)
    if (!sid) continue
    const s = stats.get(sid) ?? { answered: 0, wrong: 0 }
    s.answered++
    if (!a.is_correct) s.wrong++
    stats.set(sid, s)
  }
  return [...stats.entries()]
    .map(([subject_id, s]) => ({
      subject_id,
      subject_name: d.subjects.get(subject_id) ?? 'Matière',
      answered: s.answered,
      wrong: s.wrong,
      error_rate: Math.round((100 * s.wrong) / s.answered),
    }))
    .sort((a, b) => b.error_rate - a.error_rate)
}

/** Questions le plus souvent manquées, avec leur explication. */
export async function missedQuestions(userId: string, limit = 10, days = 90): Promise<MissedQuestion[]> {
  const d = await loadAnswers(userId, days)
  const counts = new Map<string, { wrong: number; answered: number }>()
  for (const a of d.answers) {
    const c = counts.get(a.question_id) ?? { wrong: 0, answered: 0 }
    c.answered++
    if (!a.is_correct) c.wrong++
    counts.set(a.question_id, c)
  }
  return [...counts.entries()]
    .filter(([, c]) => c.wrong > 0)
    .sort((a, b) => b[1].wrong - a[1].wrong || b[1].answered - a[1].answered)
    .slice(0, limit)
    .map(([qid, c]) => {
      const q = d.questions.get(qid)
      const quiz = q ? d.quizzes.get(q.quiz_id) : undefined
      const sid = subjectOf(quiz, d.chapters)
      return {
        question_id: qid,
        prompt: q?.prompt ?? '',
        explanation: q?.explanation ?? null,
        subject_name: sid ? d.subjects.get(sid) ?? 'Matière' : 'Matière',
        chapter_title: quiz?.chapter_id ? d.chapters.get(quiz.chapter_id)?.title ?? null : null,
        times_wrong: c.wrong,
        times_answered: c.answered,
      }
    })
}

/** Progression détaillée par matière de la classe de l'élève. */
export async function subjectProgress(userId: string): Promise<SubjectProgress[]> {
  const { data: profile } = await supabaseAdmin.from('users').select('study_level_pref').eq('id', userId).maybeSingle()
  const level = (profile as { study_level_pref?: string } | null)?.study_level_pref
  if (!level) return []

  const { data: subjects } = await supabaseAdmin.from('subjects').select('id, name').eq('level', level).order('name')
  const subjectRows = (subjects ?? []) as { id: string; name: string }[]
  if (subjectRows.length === 0) return []

  const { data: chapters } = await supabaseAdmin.from('chapters').select('id, subject_id').in('subject_id', subjectRows.map((s) => s.id))
  const chapterRows = (chapters ?? []) as { id: string; subject_id: string }[]
  const { data: lessons } = chapterRows.length
    ? await supabaseAdmin.from('lessons').select('id, chapter_id').in('chapter_id', chapterRows.map((c) => c.id))
    : { data: [] }
  const lessonRows = (lessons ?? []) as { id: string; chapter_id: string }[]
  const { data: progress } = lessonRows.length
    ? await supabaseAdmin.from('lesson_progress').select('lesson_id, completed, completed_at').eq('user_id', userId).in('lesson_id', lessonRows.map((l) => l.id))
    : { data: [] }
  const progressRows = (progress ?? []) as { lesson_id: string; completed: boolean; completed_at: string | null }[]

  const chapterSubject = new Map(chapterRows.map((c) => [c.id, c.subject_id]))
  const lessonSubject = new Map(lessonRows.map((l) => [l.id, chapterSubject.get(l.chapter_id)]))
  const errors = new Map((await subjectErrorRates(userId, 365)).map((e) => [e.subject_id, e]))

  const d = await loadAnswers(userId, 365)
  const quizAttempts = new Map<string, { n: number; pctSum: number }>()
  for (const a of d.attempts) {
    const sid = subjectOf(d.quizzes.get(a.quiz_id), d.chapters)
    if (!sid) continue
    const s = quizAttempts.get(sid) ?? { n: 0, pctSum: 0 }
    s.n++
    s.pctSum += a.total ? (100 * a.score) / a.total : 0
    quizAttempts.set(sid, s)
  }

  return subjectRows.map((s) => {
    const total = lessonRows.filter((l) => lessonSubject.get(l.id) === s.id).length
    const done = progressRows.filter((p) => p.completed && lessonSubject.get(p.lesson_id) === s.id)
    const last = done.map((p) => p.completed_at).filter(Boolean).sort().pop() ?? null
    const qa = quizAttempts.get(s.id)
    return {
      subject_id: s.id,
      subject_name: s.name,
      lessons_total: total,
      lessons_done: done.length,
      completion: total ? Math.round((100 * done.length) / total) : 0,
      quiz_attempts: qa?.n ?? 0,
      quiz_average: qa ? Math.round(qa.pctSum / qa.n) : null,
      error_rate: errors.get(s.id)?.error_rate ?? null,
      last_activity: last,
    }
  })
}

export interface RevisionRecommendation {
  subject_id: string
  subject_name: string
  priority: 'haute' | 'moyenne' | 'basse'
  reason: string
  action: string
}

/**
 * Recommandations de révision (Pro) : règles transparentes, sans IA, pour que
 * l'élève comprenne pourquoi une matière lui est proposée.
 */
export function revisionRecommendations(progress: SubjectProgress[]): RevisionRecommendation[] {
  return progress
    .map((p): RevisionRecommendation & { score: number } => {
      if (p.error_rate !== null && p.error_rate >= 50) {
        return { ...base(p), priority: 'haute', score: 300 + p.error_rate,
          reason: `${p.error_rate} % d’erreurs aux QCM`,
          action: 'Relis les explications des questions manquées puis refais le QCM du chapitre.' }
      }
      if (p.lessons_total > 0 && p.completion < 30) {
        return { ...base(p), priority: 'haute', score: 200 + (30 - p.completion),
          reason: `seulement ${p.completion} % des leçons terminées`,
          action: 'Planifie deux séances cette semaine sur les premiers chapitres non terminés.' }
      }
      if (p.error_rate !== null && p.error_rate >= 30) {
        return { ...base(p), priority: 'moyenne', score: 100 + p.error_rate,
          reason: `${p.error_rate} % d’erreurs aux QCM`,
          action: 'Entraîne-toi sur une annale en mode Entraînement libre.' }
      }
      if (p.quiz_attempts === 0 && p.lessons_done > 0) {
        return { ...base(p), priority: 'moyenne', score: 90,
          reason: 'leçons lues mais aucun QCM passé',
          action: 'Vérifie tes acquis avec le QCM de fin de chapitre.' }
      }
      return { ...base(p), priority: 'basse', score: p.completion ? 100 - p.completion : 0,
        reason: p.completion >= 80 ? `${p.completion} % du programme terminé` : 'progression régulière',
        action: 'Maintiens le rythme avec les flashcards et une simulation par semaine.' }
    })
    .sort((a, b) => b.score - a.score)
    .map(({ score: _score, ...r }) => r)
}

function base(p: SubjectProgress) {
  return { subject_id: p.subject_id, subject_name: p.subject_name }
}
