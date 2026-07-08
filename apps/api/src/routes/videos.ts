import { Hono } from 'hono'
import type { AppVariables } from '../lib/types.js'
import { authMiddleware } from '../middleware/auth.js'

const router = new Hono<{ Variables: AppVariables }>()
router.use('*', authMiddleware)

// GET /videos?subject_id=&level= — liste des cours vidéo accessibles
router.get('/', async (c) => {
  const subjectId = c.req.query('subject_id')
  const level = c.req.query('level')

  let query = c.get('supabase').from('videos')
    .select('id, title, description, level, provider, external_id, url, duration_sec, thumbnail_url, is_premium, subjects(name)')
    .order('created_at', { ascending: false })

  if (subjectId) query = query.eq('subject_id', subjectId)
  if (level) query = query.eq('level', level)

  const { data, error } = await query.limit(100)
  if (error) return c.json({ error: { code: 'DB_ERROR', message: error.message } }, 500)
  return c.json({ data: data ?? [] })
})

export { router as videosRouter }
