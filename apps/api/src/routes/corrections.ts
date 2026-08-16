import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import type { AppVariables } from '../lib/types.js'
import { authMiddleware } from '../middleware/auth.js'
import { supabaseAdmin } from '../lib/supabase.js'
import { signedUrl } from '../lib/tutor.js'
import { enqueueDispatch, enqueueResolveDispute, enqueueScore } from '../jobs/tutor-queue.js'

// Côté ÉLÈVE : soumettre un exercice à corriger, suivre la mission, noter, contester.
// Convention d'upload : l'élève téléverse ses 2 photos dans les buckets privés
// `exercise-photos` et `student-work`, sous son propre dossier `<uid>/...`,
// puis transmet ces CHEMINS ici. On valide que le chemin appartient bien à l'élève.
const router = new Hono<{ Variables: AppVariables }>()
router.use('*', authMiddleware)

const ownsPath = (userId: string, path: string) => path.split('/')[0] === userId

// POST /corrections — crée une mission (Premium requis) et lance le dispatch.
router.post('/', zValidator('json', z.object({
  subject_id:   z.string().uuid(),
  exercise_url: z.string().min(3).max(512),   // chemin dans exercise-photos
  work_url:     z.string().min(3).max(512),   // chemin dans student-work
})), async (c) => {
  const userId = c.get('userId') as string
  const body = c.req.valid('json')

  if (!ownsPath(userId, body.exercise_url) || !ownsPath(userId, body.work_url)) {
    return c.json({ error: { code: 'FORBIDDEN', message: 'Fichier hors de votre dossier.' } }, 403)
  }

  // Correction humaine réservée au Premium (décision B / Décisions confirmées).
  const { data: me } = await supabaseAdmin.from('users').select('plan').eq('id', userId).single()
  if (me?.plan !== 'premium') {
    return c.json({ error: { code: 'PREMIUM_REQUIRED', message: 'La correction par un tuteur est réservée au Premium.' } }, 403)
  }

  // Vérifie l'existence de la matière (évite une mission orpheline).
  const { data: subject } = await supabaseAdmin.from('subjects').select('id').eq('id', body.subject_id).maybeSingle()
  if (!subject) return c.json({ error: { code: 'NO_SUBJECT', message: 'Matière inconnue.' } }, 422)

  const { data: mission, error } = await supabaseAdmin.from('correction_missions').insert({
    student_id: userId, subject_id: body.subject_id,
    exercise_url: body.exercise_url, work_url: body.work_url, status: 'pending',
  }).select('id, status, created_at').single()
  if (error) return c.json({ error: { code: 'DB_ERROR', message: error.message } }, 500)

  await enqueueDispatch(mission.id)  // recherche d'un tuteur (Deliveroo)
  return c.json({ data: mission }, 201)
})

// GET /corrections — mes missions (récentes d'abord).
router.get('/', async (c) => {
  const userId = c.get('userId') as string
  const { data, error } = await c.get('supabase').from('correction_missions')
    .select('id, subject_id, status, reward_fcfa, due_at, delivered_at, created_at, subjects(name)')
    .eq('student_id', userId).order('created_at', { ascending: false }).limit(50)
  if (error) return c.json({ error: { code: 'DB_ERROR', message: error.message } }, 500)
  return c.json({ data: data ?? [] })
})

// GET /corrections/:id — statut détaillé + correction si livrée.
router.get('/:id', async (c) => {
  const userId = c.get('userId') as string
  const id = c.req.param('id')
  const { data: mission, error } = await c.get('supabase').from('correction_missions')
    .select('id, subject_id, status, accepted_at, due_at, delivered_at, attempts, reward_fcfa, ai_verdict, created_at, subjects(name)')
    .eq('id', id).eq('student_id', userId).maybeSingle()
  if (error) return c.json({ error: { code: 'DB_ERROR', message: error.message } }, 500)
  if (!mission) return c.json({ error: { code: 'NOT_FOUND' } }, 404)

  // Si livrée, on renvoie l'URL signée de la photo-solution du tuteur (ou le texte IA).
  let solution_url: string | null = null
  if (mission.status === 'delivered') {
    const { data: sol } = await c.get('supabase').from('correction_solutions')
      .select('photo_url, ai_status').eq('mission_id', id).eq('ai_status', 'ok')
      .order('attempt', { ascending: false }).limit(1).maybeSingle()
    if (sol) solution_url = await signedUrl('tutor-solutions', sol.photo_url)
  }
  return c.json({ data: { ...mission, solution_url } })
})

// POST /corrections/:id/rate — noter le tuteur (visible côté tuteur après coup).
router.post('/:id/rate', zValidator('json', z.object({
  clarity: z.number().int().min(1).max(5),
  quality: z.number().int().min(1).max(5),
  comment: z.string().max(500).optional(),
})), async (c) => {
  const userId = c.get('userId') as string
  const id = c.req.param('id')
  const body = c.req.valid('json')

  const { data: mission } = await supabaseAdmin.from('correction_missions')
    .select('id, tutor_id, status').eq('id', id).eq('student_id', userId).maybeSingle()
  if (!mission) return c.json({ error: { code: 'NOT_FOUND' } }, 404)
  if (!mission.tutor_id) return c.json({ error: { code: 'NO_TUTOR', message: 'Cette correction a été faite par l’IA.' } }, 422)
  if (mission.status !== 'delivered') return c.json({ error: { code: 'NOT_DELIVERED' } }, 422)

  const { error } = await supabaseAdmin.from('tutor_ratings').insert({
    mission_id: id, student_id: userId, tutor_id: mission.tutor_id,
    clarity: body.clarity, quality: body.quality, comment: body.comment ?? null,
  })
  if (error) {
    if (error.code === '23505') return c.json({ error: { code: 'ALREADY_RATED' } }, 409)
    return c.json({ error: { code: 'DB_ERROR', message: error.message } }, 500)
  }
  await enqueueScore(mission.tutor_id)  // recalcule le score du tuteur
  return c.json({ data: { ok: true } }, 201)
})

// POST /corrections/:id/dispute — contester la correction (arbitrage IA).
router.post('/:id/dispute', zValidator('json', z.object({
  description: z.string().min(10).max(1000),
})), async (c) => {
  const userId = c.get('userId') as string
  const id = c.req.param('id')
  const { description } = c.req.valid('json')

  const { data: mission } = await supabaseAdmin.from('correction_missions')
    .select('id, status').eq('id', id).eq('student_id', userId).maybeSingle()
  if (!mission) return c.json({ error: { code: 'NOT_FOUND' } }, 404)
  if (mission.status !== 'delivered') return c.json({ error: { code: 'NOT_DELIVERED' } }, 422)

  const { data: dispute, error } = await supabaseAdmin.from('correction_disputes')
    .insert({ mission_id: id, student_id: userId, description }).select('id').single()
  if (error) return c.json({ error: { code: 'DB_ERROR', message: error.message } }, 500)

  await supabaseAdmin.from('correction_missions').update({ status: 'disputed' }).eq('id', id)
  await enqueueResolveDispute(dispute.id)
  return c.json({ data: { id: dispute.id, status: 'disputed' } }, 201)
})

export { router as correctionsRouter }
