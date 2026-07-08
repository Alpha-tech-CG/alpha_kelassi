import { Hono } from 'hono'
import type { AppVariables } from '../lib/types.js'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { authMiddleware } from '../middleware/auth.js'

const router = new Hono<{ Variables: AppVariables }>()
router.use('*', authMiddleware)

// GET /reminders — préférences de rappel de l'élève
router.get('/', async (c) => {
  const userId = c.get('userId') as string
  const { data, error } = await c.get('supabase').from('users')
    .select('phone, whatsapp_opt_in, reminder_hour')
    .eq('id', userId).single()
  if (error) return c.json({ error: { code: 'DB_ERROR', message: error.message } }, 500)
  return c.json({ data })
})

// PATCH /reminders — active/désactive et règle l'heure
router.patch('/', zValidator('json', z.object({
  whatsapp_opt_in: z.boolean().optional(),
  reminder_hour:   z.number().int().min(0).max(23).optional(),
})), async (c) => {
  const userId = c.get('userId') as string
  const body = c.req.valid('json')
  const { data, error } = await c.get('supabase').from('users')
    .update(body).eq('id', userId)
    .select('whatsapp_opt_in, reminder_hour').single()
  if (error) return c.json({ error: { code: 'DB_ERROR', message: error.message } }, 500)
  return c.json({ data })
})

export { router as remindersRouter }
