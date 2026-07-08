import { Hono } from 'hono'
import { type AppVariables, parseStudyLevel } from '../lib/types.js'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { authMiddleware } from '../middleware/auth.js'

const router = new Hono<{ Variables: AppVariables }>()

router.use('*', authMiddleware)

// GET /quiz?subject_id=&level= — liste des QCM
router.get('/', async (c) => {
  const subjectId = c.req.query('subject_id')
  const level = parseStudyLevel(c.req.query('level'))

  let query = c.get('supabase').from('quizzes')
    .select('id, title, description, level, time_limit_sec, is_premium, subjects(name)')
    .order('created_at', { ascending: false })

  if (subjectId) query = query.eq('subject_id', subjectId)
  if (level) query = query.eq('level', level)

  const { data, error } = await query.limit(100)
  if (error) return c.json({ error: { code: 'DB_ERROR', message: error.message } }, 500)
  return c.json({ data: data ?? [] })
})

// GET /quiz/weak-areas — points faibles de l'élève
router.get('/weak-areas', async (c) => {
  const userId = c.get('userId') as string
  const { data, error } = await c.get('supabase').from('quiz_weak_areas')
    .select('subject_id, subject_name, answered, wrong, error_rate')
    .eq('user_id', userId)
    .gte('answered', 3)
    .order('error_rate', { ascending: false })
    .limit(10)

  if (error) return c.json({ error: { code: 'DB_ERROR', message: error.message } }, 500)
  return c.json({ data: data ?? [] })
})

// GET /quiz/:id — QCM + questions POUR PASSAGE (sans correct_index/explanation)
router.get('/:id', async (c) => {
  const id = c.req.param('id')

  const { data: quiz, error } = await c.get('supabase').from('quizzes')
    .select('id, title, description, level, time_limit_sec, is_premium, subjects(name)')
    .eq('id', id)
    .single()

  if (error || !quiz) return c.json({ error: { code: 'NOT_FOUND' } }, 404)

  const { data: questions } = await c.get('supabase').from('quiz_questions')
    .select('id, position, prompt, options')
    .eq('quiz_id', id)
    .order('position', { ascending: true })

  return c.json({ data: { ...quiz, questions: questions ?? [] } })
})

// POST /quiz/:id/submit — soumission (score calculé côté serveur via RPC)
router.post(
  '/:id/submit',
  zValidator('json', z.object({
    answers: z.array(z.object({
      question_id:    z.string().uuid(),
      selected_index: z.number().int().min(0).nullable(),
    })),
    duration_sec: z.number().int().min(0).max(86400),
  })),
  async (c) => {
    const userId = c.get('userId') as string
    const id = c.req.param('id')
    const { answers, duration_sec } = c.req.valid('json')

    const { data, error } = await c.get('supabase').rpc('submit_quiz_attempt', {
      p_quiz_id:      id,
      p_answers:      answers,
      p_duration_sec: duration_sec,
    })

    if (error) {
      if (error.message.includes('PREMIUM_REQUIRED'))
        return c.json({ error: { code: 'PREMIUM_REQUIRED', message: 'QCM réservé aux abonnés premium.' } }, 403)
      if (error.message.includes('QUIZ_NOT_FOUND'))
        return c.json({ error: { code: 'NOT_FOUND' } }, 404)
      return c.json({ error: { code: 'DB_ERROR', message: error.message } }, 500)
    }

    const score = (data as { score?: number })?.score ?? 0
    if (score > 0) {
      const { awardXP, checkAndAwardBadges } = await import('../lib/xp.js')
      awardXP(userId, score * 5).catch(() => null)
      checkAndAwardBadges(userId).catch(() => null)
    }

    return c.json({ data })
  }
)

export { router as quizRouter }
