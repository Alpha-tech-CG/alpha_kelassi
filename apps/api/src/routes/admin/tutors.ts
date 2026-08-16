import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import type { AppVariables } from '../../lib/types.js'
import { authMiddleware } from '../../middleware/auth.js'
import { supabaseAdmin as supabase } from '../../lib/supabase.js'
import { signedUrl } from '../../lib/tutor.js'
import { notifyUser } from '../../lib/messaging.js'

// Panel admin Cognix — validation des comptes tuteurs.
const router = new Hono<{ Variables: AppVariables }>()
router.use('*', authMiddleware)
router.use('*', async (c, next) => {
  const { data: user } = await supabase.from('users').select('role').eq('id', c.get('userId')).single()
  if (user?.role !== 'admin') return c.json({ error: { code: 'FORBIDDEN', message: 'Admin requis' } }, 403)
  await next()
})

// GET /admin/tutors/pending — tuteurs en attente + pièces justificatives (URLs signées).
router.get('/pending', async (c) => {
  const { data: profiles, error } = await supabase.from('tutor_profiles')
    .select('user_id, bio, id_doc_url, bac_doc_url, created_at, users(full_name, email, phone)')
    .eq('is_verified', false).order('created_at', { ascending: true }).limit(100)
  if (error) return c.json({ error: { code: 'DB_ERROR', message: error.message } }, 500)

  const data = await Promise.all((profiles ?? []).map(async (p) => ({
    ...p,
    id_doc_signed:  p.id_doc_url ? await signedUrl('tutor-documents', p.id_doc_url) : null,
    bac_doc_signed: p.bac_doc_url ? await signedUrl('tutor-documents', p.bac_doc_url) : null,
  })))
  return c.json({ data })
})

// POST /admin/tutors/:id/verify — valider un tuteur.
router.post('/:id/verify', async (c) => {
  const id = c.req.param('id')
  const { data, error } = await supabase.from('tutor_profiles')
    .update({ is_verified: true, verified_at: new Date().toISOString(), is_active: true })
    .eq('user_id', id).select('user_id').maybeSingle()
  if (error) return c.json({ error: { code: 'DB_ERROR', message: error.message } }, 500)
  if (!data) return c.json({ error: { code: 'NOT_FOUND' } }, 404)

  await supabase.from('users').update({ role: 'tutor' }).eq('id', id)
  await notifyUser({
    userId: id, dedupKey: `tutor-verified:${id}`,
    template: { name: 'tutor_verified', lang: 'fr', params: [] },
    smsBody: '🎉 Kelassi : ton compte tuteur est validé ! Tu peux commencer à recevoir des missions.',
  })
  return c.json({ data: { ok: true } })
})

// POST /admin/tutors/:id/reject — rejeter avec motif.
router.post('/:id/reject', zValidator('json', z.object({
  reason: z.string().min(3).max(300),
})), async (c) => {
  const id = c.req.param('id')
  const { reason } = c.req.valid('json')
  const { data, error } = await supabase.from('tutor_profiles')
    .update({ is_verified: false, is_active: false }).eq('user_id', id).select('user_id').maybeSingle()
  if (error) return c.json({ error: { code: 'DB_ERROR', message: error.message } }, 500)
  if (!data) return c.json({ error: { code: 'NOT_FOUND' } }, 404)

  await notifyUser({
    userId: id, dedupKey: `tutor-rejected:${id}:${Date.now()}`,
    template: { name: 'tutor_rejected', lang: 'fr', params: [reason] },
    smsBody: `Kelassi : ta candidature tuteur n’a pas été retenue. Motif : ${reason}`,
  })
  return c.json({ data: { ok: true } })
})

export { router as adminTutorsRouter }
