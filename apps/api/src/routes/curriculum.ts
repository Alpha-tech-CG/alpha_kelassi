import { Hono } from 'hono'
import type { AppVariables } from '../lib/types.js'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'

import { redis } from '../lib/redis.js'
import { authMiddleware } from '../middleware/auth.js'
import { XP, awardXP, awardBadges, checkAndAwardBadges } from '../lib/xp.js'
import type { LessonType } from '@alpha-kelassi/types'

const router = new Hono<{ Variables: AppVariables }>()

router.use('*', authMiddleware)

/* ── GET /api/curriculum/series ──────────────────────────────────────────────
 * Liste des séries, filtrable par ?level= et ?track=. Référentiel public → cache. */
router.get('/series', zValidator('query', z.object({
  level:   z.enum(['bepc', 'bac_a', 'bac_c', 'bac_d']).optional(),
  track:   z.enum(['generale', 'technique', 'professionnel']).optional(),
  country: z.string().length(2).default('CG'),
})), async (c) => {
  const { level, track, country } = c.req.valid('query')
  const cacheKey = `series:${level ?? 'all'}:${track ?? 'all'}:${country}`

  const cached = await redis.get(cacheKey)
  if (cached) return c.json({ data: cached })

  let query = c.get('supabase')
    .from('series')
    .select('id, code, label, track, level, country_code')
    .eq('country_code', country)
    .order('track')
    .order('code')
  if (level) query = query.eq('level', level)
  if (track) query = query.eq('track', track)

  const { data, error } = await query
  if (error) return c.json({ error: { code: 'DB_ERROR', message: error.message } }, 500)

  await redis.set(cacheKey, data, { ex: 3600 })
  return c.json({ data })
})

/* ── GET /api/curriculum/chapters/:subjectId ─────────────────────────────────
 * Chapitres d'une matière (?seriesId= optionnel), avec le nombre de leçons
 * par type. Contenu de référence non premium → cache. */
router.get('/chapters/:subjectId', zValidator('query', z.object({
  seriesId: z.string().uuid().optional(),
})), async (c) => {
  const subjectId = c.req.param('subjectId')
  const { seriesId } = c.req.valid('query')
  const cacheKey = `chapters:${subjectId}:${seriesId ?? 'all'}`

  const cached = await redis.get(cacheKey)
  if (cached) return c.json({ data: cached })

  let query = c.get('supabase')
    .from('chapters')
    .select('id, subject_id, series_id, title, order_index, description, lessons(type)')
    .eq('subject_id', subjectId)
    .order('order_index')
  if (seriesId) query = query.eq('series_id', seriesId)

  const { data, error } = await query
  if (error) return c.json({ error: { code: 'DB_ERROR', message: error.message } }, 500)

  // Aplatit lessons(type) en compteurs { cours, resume, quiz, video }
  const rows = (data ?? []).map((ch) => {
    const lessons = (ch.lessons as { type: LessonType }[] | null) ?? []
    const counts: Record<LessonType, number> = { cours: 0, resume: 0, quiz: 0, video: 0 }
    for (const l of lessons) counts[l.type] = (counts[l.type] ?? 0) + 1
    const { lessons: _omit, ...rest } = ch
    return { ...rest, lesson_counts: counts, total_lessons: lessons.length }
  })

  await redis.set(cacheKey, rows, { ex: 1800 })
  return c.json({ data: rows })
})

/* ── GET /api/curriculum/chapters/:chapterId/lessons ─────────────────────────
 * Leçons d'un chapitre. Le gating premium est appliqué par la RLS (client
 * scopé au JWT). Le `content` des quiz n'est PAS exposé ici pour ne pas fuiter
 * les réponses — il sera servi par le futur endpoint de passage de quiz. */
router.get('/chapters/:chapterId/lessons', async (c) => {
  const chapterId = c.req.param('chapterId')

  const { data, error } = await c.get('supabase')
    .from('lessons')
    .select('id, chapter_id, type, title, content, video_url, duration_min, is_premium, order_index')
    .eq('chapter_id', chapterId)
    .order('order_index')

  if (error) return c.json({ error: { code: 'DB_ERROR', message: error.message } }, 500)

  const rows = (data ?? []).map((l) =>
    l.type === 'quiz' ? { ...l, content: null } : l
  )

  return c.json({ data: rows })
})

/* ── GET /api/curriculum/lessons/:lessonId ───────────────────────────────────
 * Détail d'une leçon (gating premium via RLS). */
router.get('/lessons/:lessonId', async (c) => {
  const lessonId = c.req.param('lessonId')

  const { data, error } = await c.get('supabase')
    .from('lessons')
    .select('id, chapter_id, type, title, content, video_url, duration_min, is_premium, order_index')
    .eq('id', lessonId)
    .maybeSingle()

  if (error) return c.json({ error: { code: 'DB_ERROR', message: error.message } }, 500)
  if (!data) return c.json({ error: { code: 'NOT_FOUND', message: 'Leçon introuvable ou réservée aux abonnés Premium.' } }, 404)

  return c.json({ data })
})

/* ── GET /api/curriculum/progress ────────────────────────────────────────────
 * Progression globale de l'élève authentifié, agrégée par matière.
 * On ignore volontairement tout userId fourni par le client : la source de
 * vérité est le JWT (c.get('userId')), et la RLS scope déjà lesson_progress. */
router.get('/progress', async (c) => {
  const supabase = c.get('supabase')

  const [{ data: lessons, error: lErr }, { data: progress, error: pErr }] = await Promise.all([
    supabase.from('lessons').select('id, type, chapter_id, chapters(subject_id)'),
    supabase.from('lesson_progress').select('lesson_id, completed, score'),
  ])
  if (lErr) return c.json({ error: { code: 'DB_ERROR', message: lErr.message } }, 500)
  if (pErr) return c.json({ error: { code: 'DB_ERROR', message: pErr.message } }, 500)

  const progByLesson = new Map(
    (progress ?? []).map((p) => [p.lesson_id, p])
  )

  type Acc = { total: number; completed: number; quizScores: number[] }
  const bySubject = new Map<string, Acc>()

  for (const l of lessons ?? []) {
    const subjectId = (l.chapters as { subject_id: string } | null)?.subject_id
    if (!subjectId) continue
    const acc = bySubject.get(subjectId) ?? { total: 0, completed: 0, quizScores: [] }
    acc.total += 1
    const p = progByLesson.get(l.id)
    if (p?.completed) {
      acc.completed += 1
      if (l.type === 'quiz' && typeof p.score === 'number') acc.quizScores.push(p.score)
    }
    bySubject.set(subjectId, acc)
  }

  const data = [...bySubject.entries()].map(([subject_id, acc]) => ({
    subject_id,
    total_lessons: acc.total,
    completed_lessons: acc.completed,
    percent: acc.total ? Math.round((acc.completed / acc.total) * 100) : 0,
    quiz_avg_score: acc.quizScores.length
      ? Math.round(acc.quizScores.reduce((a, b) => a + b, 0) / acc.quizScores.length)
      : null,
  }))

  return c.json({ data })
})

/* ── POST /api/curriculum/lessons/:lessonId/complete ─────────────────────────
 * Marque une leçon comme complétée, attribue l'XP correspondant, et si le
 * chapitre passe à 100 %, attribue le bonus + le badge chapter_master.
 * L'XP n'est attribué qu'à la PREMIÈRE complétion (pas de farm en refaisant). */
router.post('/lessons/:lessonId/complete', zValidator('json', z.object({
  score: z.number().int().min(0).max(100).optional(),
})), async (c) => {
  const userId = c.get('userId')
  const supabase = c.get('supabase')
  const lessonId = c.req.param('lessonId')
  const { score } = c.req.valid('json')

  // Lecture via client scopé → la RLS bloque l'accès aux leçons premium non autorisées
  const { data: lesson, error: lErr } = await supabase
    .from('lessons')
    .select('id, type, chapter_id')
    .eq('id', lessonId)
    .maybeSingle()
  if (lErr) return c.json({ error: { code: 'DB_ERROR', message: lErr.message } }, 500)
  if (!lesson) return c.json({ error: { code: 'NOT_FOUND', message: 'Leçon introuvable ou réservée aux abonnés Premium.' } }, 404)

  // État précédent (pour l'idempotence de l'XP)
  const { data: prev } = await supabase
    .from('lesson_progress')
    .select('completed, score')
    .eq('user_id', userId)
    .eq('lesson_id', lessonId)
    .maybeSingle()
  const wasCompleted   = prev?.completed === true
  const wasQuizPassed  = wasCompleted && (prev?.score ?? 0) >= 80

  // XP de la leçon (première complétion uniquement)
  let xp = 0
  if (lesson.type === 'quiz') {
    // le badge "pass" se déclenche au premier franchissement du seuil 80
    if ((score ?? 0) >= 80 && !wasQuizPassed) xp += XP.LESSON_QUIZ_PASS
  } else if (!wasCompleted) {
    if (lesson.type === 'cours')  xp += XP.LESSON_COURS
    if (lesson.type === 'resume') xp += XP.LESSON_RESUME
    if (lesson.type === 'video')  xp += XP.LESSON_VIDEO
  }

  // Enregistre la progression (RLS : uniquement la sienne)
  const { error: upErr } = await supabase.from('lesson_progress').upsert({
    user_id:      userId,
    lesson_id:    lessonId,
    completed:    true,
    score:        lesson.type === 'quiz' ? (score ?? 0) : null,
    completed_at: new Date().toISOString(),
  }, { onConflict: 'user_id,lesson_id' })
  if (upErr) return c.json({ error: { code: 'DB_ERROR', message: upErr.message } }, 500)

  // Le chapitre est-il désormais complété à 100 % (parmi les leçons accessibles) ?
  let chapterCompleted = false
  const { data: siblings } = await supabase
    .from('lessons').select('id').eq('chapter_id', lesson.chapter_id)
  const siblingIds = (siblings ?? []).map((s) => s.id)
  if (siblingIds.length > 0) {
    const { count } = await supabase
      .from('lesson_progress')
      .select('lesson_id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('completed', true)
      .in('lesson_id', siblingIds)
    // On ne compte le chapitre "complété" (et le bonus) que lors de la transition
    // finale — donc seulement quand la leçon courante ne l'était pas déjà.
    if ((count ?? 0) >= siblingIds.length && !wasCompleted) {
      chapterCompleted = true
      xp += XP.CHAPTER_COMPLETE
    }
  }

  if (xp > 0) await awardXP(userId, xp)
  if (chapterCompleted) await awardBadges(userId, ['chapter_master'])
  await checkAndAwardBadges(userId)

  return c.json({ data: { completed: true, xp_awarded: xp, chapter_completed: chapterCompleted } })
})

export { router as curriculumRouter }
