import { Hono } from 'hono'
import { type AppVariables, parseStudyLevel } from '../lib/types.js'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { authMiddleware } from '../middleware/auth.js'

const router = new Hono<{ Variables: AppVariables }>()
router.use('*', authMiddleware)

// GET /planning/exams?level= — dates d'examen à venir
router.get('/exams', async (c) => {
  const level = parseStudyLevel(c.req.query('level'))
  const today = new Date().toISOString().slice(0, 10)
  let q = c.get('supabase').from('exam_events')
    .select('id, level, label, exam_date')
    .gte('exam_date', today)
    .order('exam_date', { ascending: true })
  if (level) q = q.eq('level', level)
  const { data, error } = await q.limit(20)
  if (error) return c.json({ error: { code: 'DB_ERROR', message: error.message } }, 500)
  return c.json({ data: data ?? [] })
})

// GET /planning/plan — plan actif + compte à rebours
router.get('/plan', async (c) => {
  const userId = c.get('userId') as string
  const { data: plan } = await c.get('supabase').from('revision_plans')
    .select('id, level, title, exam_date, created_at')
    .eq('user_id', userId).eq('is_active', true)
    .order('created_at', { ascending: false }).limit(1).maybeSingle()

  if (!plan) return c.json({ data: null })
  const days = Math.ceil((new Date(plan.exam_date).getTime() - Date.now()) / 86400000)
  return c.json({ data: { ...plan, days_remaining: Math.max(days, 0) } })
})

// POST /planning/plan — crée/remplace le plan actif
router.post('/plan', zValidator('json', z.object({
  level:     z.enum(['bepc', 'bac_a', 'bac_c', 'bac_d']),
  title:     z.string().min(3).max(120),
  exam_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
})), async (c) => {
  const userId = c.get('userId') as string
  const body = c.req.valid('json')
  await c.get('supabase').from('revision_plans').update({ is_active: false }).eq('user_id', userId).eq('is_active', true)
  const { data, error } = await c.get('supabase').from('revision_plans')
    .insert({ user_id: userId, level: body.level, title: body.title, exam_date: body.exam_date, is_active: true })
    .select('id, level, title, exam_date').single()
  if (error) return c.json({ error: { code: 'DB_ERROR', message: error.message } }, 500)
  return c.json({ data }, 201)
})

// POST /planning/generate — génère l'emploi du temps
router.post('/generate', zValidator('json', z.object({
  plan_id:          z.string().uuid(),
  subject_ids:      z.array(z.string().uuid()).min(1).max(15),
  sessions_per_day: z.number().int().min(1).max(5).default(2),
  duration_min:     z.number().int().min(15).max(180).default(30),
})), async (c) => {
  const userId = c.get('userId') as string
  const body = c.req.valid('json')

  const { data: plan } = await c.get('supabase').from('revision_plans')
    .select('id, exam_date').eq('id', body.plan_id).eq('user_id', userId).single()
  if (!plan) return c.json({ error: { code: 'NOT_FOUND' } }, 404)

  const { data: subjects } = await c.get('supabase').from('subjects').select('id, name').in('id', body.subject_ids)
  const nameById = new Map((subjects ?? []).map((s) => [s.id, s.name]))
  const ids = body.subject_ids.filter((id) => nameById.has(id))
  if (ids.length === 0) return c.json({ error: { code: 'NO_SUBJECT' } }, 422)

  const start = new Date(); start.setDate(start.getDate() + 1); start.setHours(0, 0, 0, 0)
  const exam = new Date(plan.exam_date + 'T00:00:00')
  const dayMs = 86400000
  const totalDays = Math.floor((exam.getTime() - start.getTime()) / dayMs)
  if (totalDays <= 0) return c.json({ error: { code: 'EXAM_PASSED', message: 'Date d\'examen trop proche ou passée.' } }, 422)

  const MAX = 500
  const rows: Array<{ user_id: string; plan_id: string; subject_id: string; title: string; scheduled_date: string; duration_min: number }> = []
  let rr = 0
  for (let d = 0; d < totalDays && rows.length < MAX; d++) {
    const date = new Date(start.getTime() + d * dayMs).toISOString().slice(0, 10)
    for (let s = 0; s < body.sessions_per_day && rows.length < MAX; s++) {
      const subjectId = ids[rr % ids.length]!; rr++  // ids.length >= 1 garanti
      rows.push({
        user_id: userId, plan_id: plan.id, subject_id: subjectId,
        title: `Réviser ${nameById.get(subjectId)}`, scheduled_date: date, duration_min: body.duration_min,
      })
    }
  }

  await c.get('supabase').from('revision_sessions').delete()
    .eq('plan_id', plan.id).eq('user_id', userId).eq('is_done', false)
  const { error } = await c.get('supabase').from('revision_sessions').insert(rows)
  if (error) return c.json({ error: { code: 'DB_ERROR', message: error.message } }, 500)
  return c.json({ data: { created: rows.length, days: totalDays } }, 201)
})

// GET /planning/sessions?scope=today|upcoming
router.get('/sessions', async (c) => {
  const userId = c.get('userId') as string
  const scope = c.req.query('scope')
  const today = new Date().toISOString().slice(0, 10)
  let from = today, to = today
  if (scope === 'upcoming') { from = today; to = new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10) }

  const { data, error } = await c.get('supabase').from('revision_sessions')
    .select('id, subject_id, title, scheduled_date, duration_min, is_done, subjects(name)')
    .eq('user_id', userId).gte('scheduled_date', from).lte('scheduled_date', to)
    .order('scheduled_date', { ascending: true }).limit(200)
  if (error) return c.json({ error: { code: 'DB_ERROR', message: error.message } }, 500)
  return c.json({ data: data ?? [] })
})

// PATCH /planning/sessions/:id — coche/décoche (+ XP)
router.patch('/sessions/:id', zValidator('json', z.object({ is_done: z.boolean() })), async (c) => {
  const userId = c.get('userId') as string
  const id = c.req.param('id')
  const { is_done } = c.req.valid('json')
  const { data, error } = await c.get('supabase').from('revision_sessions')
    .update({ is_done, done_at: is_done ? new Date().toISOString() : null })
    .eq('id', id).eq('user_id', userId).select('id, is_done').single()
  if (error) return c.json({ error: { code: 'DB_ERROR', message: error.message } }, 500)
  if (is_done) {
    const { awardXP } = await import('../lib/xp.js')
    awardXP(userId, 5).catch(() => null)
  }
  return c.json({ data })
})

export { router as planningRouter }
