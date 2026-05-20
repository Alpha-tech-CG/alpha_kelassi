import type { Context, Next } from 'hono'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@alpha-kelassi/types'

export async function authMiddleware(c: Context, next: Next) {
  const authorization = c.req.header('Authorization')
  if (!authorization?.startsWith('Bearer ')) {
    return c.json({ error: { code: 'UNAUTHORIZED', message: 'Missing token' } }, 401)
  }

  const token = authorization.slice(7)
  const supabase = createClient<Database>(
    process.env['SUPABASE_URL']!,
    process.env['SUPABASE_SERVICE_ROLE_KEY']!,
    { auth: { persistSession: false } }
  )

  const { data: { user }, error } = await supabase.auth.getUser(token)
  if (error || !user) {
    return c.json({ error: { code: 'UNAUTHORIZED', message: 'Invalid token' } }, 401)
  }

  c.set('userId', user.id)
  await next()
}
