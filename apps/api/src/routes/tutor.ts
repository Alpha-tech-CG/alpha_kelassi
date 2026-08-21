import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import type { AppVariables } from '../lib/types.js'
import { authMiddleware } from '../middleware/auth.js'
import { supabaseAdmin } from '../lib/supabase.js'
import { signedUrl, DUE_MS } from '../lib/tutor.js'
import { enqueueDueTimeout, enqueueVerify } from '../jobs/tutor-queue.js'

// Côté TUTEUR : inscription, missions disponibles, acceptation, soumission, wallet.
const router = new Hono<{ Variables: AppVariables }>()
router.use('*', authMiddleware)

const ownsPath = (userId: string, path: string) => path.split('/')[0] === userId

/** Charge le profil tuteur (service role). Renvoie null si non-tuteur. */
async function loadProfile(userId: string) {
  const { data } = await supabaseAdmin.from('tutor_profiles')
    .select('user_id, is_verified, is_active, score, wallet_balance').eq('user_id', userId).maybeSingle()
  return data
}

// POST /tutor/register — devenir tuteur (statut: en attente de validation).
router.post('/register', zValidator('json', z.object({
  bio:         z.string().max(500).optional(),
  subject_ids: z.array(z.string().uuid()).min(1).max(15),
  id_doc_url:  z.string().min(3).max(512),   // chemin dans tutor-documents/<uid>/...
  bac_doc_url: z.string().min(3).max(512),
})), async (c) => {
  const userId = c.get('userId') as string
  const body = c.req.valid('json')
  if (!ownsPath(userId, body.id_doc_url) || !ownsPath(userId, body.bac_doc_url)) {
    return c.json({ error: { code: 'FORBIDDEN', message: 'Document hors de votre dossier.' } }, 403)
  }

  const existing = await loadProfile(userId)
  if (existing) return c.json({ error: { code: 'ALREADY_TUTOR', message: 'Profil tuteur déjà créé.' } }, 409)

  const { error: pErr } = await supabaseAdmin.from('tutor_profiles').insert({
    user_id: userId, bio: body.bio ?? null,
    id_doc_url: body.id_doc_url, bac_doc_url: body.bac_doc_url, is_verified: false,
  })
  if (pErr) return c.json({ error: { code: 'DB_ERROR', message: pErr.message } }, 500)

  await supabaseAdmin.from('tutor_subjects').insert(
    body.subject_ids.map((subject_id) => ({ tutor_id: userId, subject_id })),
  )
  // Rôle tuteur → Cognix redirige vers l'espace tuteur (écran "en attente" tant que non vérifié).
  await supabaseAdmin.from('users').update({ role: 'tutor' }).eq('id', userId)

  return c.json({ data: { status: 'pending_verification' } }, 201)
})

// GET /tutor/me — profil + statut de vérification.
router.get('/me', async (c) => {
  const userId = c.get('userId') as string
  const profile = await loadProfile(userId)
  if (!profile) return c.json({ data: null })
  const { data: subjects } = await supabaseAdmin.from('tutor_subjects')
    .select('subject_id, subjects(name)').eq('tutor_id', userId)
  return c.json({ data: { ...profile, subjects: subjects ?? [] } })
})

// PATCH /tutor/me — disponibilité (en ligne/hors ligne) + bio.
router.patch('/me', zValidator('json', z.object({
  is_active: z.boolean().optional(),
  bio:       z.string().max(500).optional(),
})), async (c) => {
  const userId = c.get('userId') as string
  const profile = await loadProfile(userId)
  if (!profile) return c.json({ error: { code: 'NOT_TUTOR' } }, 403)
  const raw = c.req.valid('json')
  // Construit le patch sans clés `undefined` (exactOptionalPropertyTypes).
  const patch: { is_active?: boolean; bio?: string } = {}
  if (raw.is_active !== undefined) patch.is_active = raw.is_active
  if (raw.bio !== undefined) patch.bio = raw.bio
  if (Object.keys(patch).length === 0) return c.json({ data: { ok: true } })
  const { error } = await supabaseAdmin.from('tutor_profiles').update(patch).eq('user_id', userId)
  if (error) return c.json({ error: { code: 'DB_ERROR', message: error.message } }, 500)
  return c.json({ data: { ok: true } })
})

// GET /tutor/missions — missions disponibles sur mes matières (vérifié + actif requis).
router.get('/missions', async (c) => {
  const userId = c.get('userId') as string
  const profile = await loadProfile(userId)
  if (!profile?.is_verified) return c.json({ error: { code: 'NOT_VERIFIED' } }, 403)
  if (!profile.is_active) return c.json({ data: [] })

  const { data: subs } = await supabaseAdmin.from('tutor_subjects').select('subject_id').eq('tutor_id', userId)
  const subjectIds = (subs ?? []).map((s) => s.subject_id)
  if (subjectIds.length === 0) return c.json({ data: [] })

  const { data, error } = await supabaseAdmin.from('correction_missions')
    .select('id, subject_id, created_at, subjects(name)')
    .eq('status', 'pending').in('subject_id', subjectIds)
    .order('created_at', { ascending: true }).limit(30)
  if (error) return c.json({ error: { code: 'DB_ERROR', message: error.message } }, 500)
  return c.json({ data: data ?? [] })
})

// POST /tutor/missions/:id/accept — acceptation atomique (premier arrivé).
router.post('/missions/:id/accept', async (c) => {
  const userId = c.get('userId') as string
  const id = c.req.param('id')
  const profile = await loadProfile(userId)
  if (!profile?.is_verified || !profile.is_active) return c.json({ error: { code: 'NOT_ELIGIBLE' } }, 403)

  // Vérifie que la matière fait partie des matières validées du tuteur.
  const { data: mission } = await supabaseAdmin.from('correction_missions')
    .select('id, subject_id, status').eq('id', id).maybeSingle()
  if (!mission) return c.json({ error: { code: 'NOT_FOUND' } }, 404)
  const { data: sub } = await supabaseAdmin.from('tutor_subjects')
    .select('subject_id').eq('tutor_id', userId).eq('subject_id', mission.subject_id).maybeSingle()
  if (!sub) return c.json({ error: { code: 'WRONG_SUBJECT' } }, 403)

  const dueAt = new Date(Date.now() + DUE_MS).toISOString()
  // Update conditionnel : ne réussit QUE si la mission est encore 'pending' → anti-course.
  const { data: updated, error } = await supabaseAdmin.from('correction_missions')
    .update({ status: 'assigned', tutor_id: userId, accepted_at: new Date().toISOString(), due_at: dueAt })
    .eq('id', id).eq('status', 'pending')
    .select('id, exercise_url, work_url, due_at').maybeSingle()
  if (error) return c.json({ error: { code: 'DB_ERROR', message: error.message } }, 500)
  if (!updated) return c.json({ error: { code: 'ALREADY_TAKEN', message: 'Mission déjà prise ou expirée.' } }, 409)

  await enqueueDueTimeout(id, dueAt)  // relais IA si non rendu à temps
  const [exercise_url, work_url] = await Promise.all([
    signedUrl('exercise-photos', updated.exercise_url),
    signedUrl('student-work', updated.work_url),
  ])
  return c.json({ data: { id, due_at: updated.due_at, exercise_url, work_url } })
})

// GET /tutor/missions/:id — détail d'une mission assignée (photos signées + dernier retour IA).
router.get('/missions/:id', async (c) => {
  const userId = c.get('userId') as string
  const id = c.req.param('id')
  const { data: mission } = await supabaseAdmin.from('correction_missions')
    .select('id, status, due_at, attempts, exercise_url, work_url').eq('id', id).eq('tutor_id', userId).maybeSingle()
  if (!mission) return c.json({ error: { code: 'NOT_FOUND' } }, 404)

  const { data: lastSol } = await supabaseAdmin.from('correction_solutions')
    .select('attempt, ai_status, ai_feedback').eq('mission_id', id)
    .order('attempt', { ascending: false }).limit(1).maybeSingle()
  const [exercise_url, work_url] = await Promise.all([
    signedUrl('exercise-photos', mission.exercise_url),
    signedUrl('student-work', mission.work_url),
  ])
  return c.json({ data: { ...mission, exercise_url, work_url, last_solution: lastSol ?? null } })
})

// POST /tutor/missions/:id/submit — soumettre la photo de correction.
router.post('/missions/:id/submit', zValidator('json', z.object({
  photo_url: z.string().min(3).max(512),   // chemin dans tutor-solutions/<uid>/...
})), async (c) => {
  const userId = c.get('userId') as string
  const id = c.req.param('id')
  const { photo_url } = c.req.valid('json')
  if (!ownsPath(userId, photo_url)) return c.json({ error: { code: 'FORBIDDEN' } }, 403)

  const { data: mission } = await supabaseAdmin.from('correction_missions')
    .select('id, status').eq('id', id).eq('tutor_id', userId).maybeSingle()
  if (!mission) return c.json({ error: { code: 'NOT_FOUND' } }, 404)
  if (mission.status !== 'assigned') return c.json({ error: { code: 'NOT_ASSIGNED', message: 'Mission non modifiable.' } }, 422)

  // Numéro de tentative = nombre de solutions déjà soumises + 1.
  const { count } = await supabaseAdmin.from('correction_solutions')
    .select('id', { count: 'exact', head: true }).eq('mission_id', id)
  const attempt = (count ?? 0) + 1

  const { data: sol, error } = await supabaseAdmin.from('correction_solutions')
    .insert({ mission_id: id, attempt, photo_url }).select('id').single()
  if (error) return c.json({ error: { code: 'DB_ERROR', message: error.message } }, 500)

  await supabaseAdmin.from('correction_missions').update({ status: 'submitted' }).eq('id', id)
  await enqueueVerify(id, sol.id)  // vérification IA
  return c.json({ data: { solution_id: sol.id, attempt, status: 'submitted' } }, 201)
})

// GET /tutor/wallet — solde + historique.
router.get('/wallet', async (c) => {
  const userId = c.get('userId') as string
  const profile = await loadProfile(userId)
  if (!profile) return c.json({ error: { code: 'NOT_TUTOR' } }, 403)
  const { data: txns } = await supabaseAdmin.from('tutor_wallet_transactions')
    .select('id, mission_id, amount_fcfa, type, status, created_at')
    .eq('tutor_id', userId).order('created_at', { ascending: false }).limit(50)
  return c.json({ data: { balance: profile.wallet_balance, transactions: txns ?? [] } })
})

// POST /tutor/withdraw — demande de retrait (FeexPay payout en prod ; ici on débite + trace).
router.post('/withdraw', zValidator('json', z.object({
  amount: z.number().int().min(500),   // retrait minimum 500 FCFA
})), async (c) => {
  const userId = c.get('userId') as string
  const { amount } = c.req.valid('json')
  const profile = await loadProfile(userId)
  if (!profile) return c.json({ error: { code: 'NOT_TUTOR' } }, 403)
  if (profile.wallet_balance < amount) return c.json({ error: { code: 'INSUFFICIENT_FUNDS' } }, 422)

  // Débit atomique via l'incrément négatif (réutilise la fonction de wallet).
  await supabaseAdmin.rpc('increment_tutor_wallet', { p_tutor_id: userId, p_amount: -amount })
  const { data: txn, error } = await supabaseAdmin.from('tutor_wallet_transactions')
    .insert({ tutor_id: userId, amount_fcfa: amount, type: 'withdrawal', status: 'pending' })
    .select('id, amount_fcfa, status, created_at').single()
  if (error) {
    await supabaseAdmin.rpc('increment_tutor_wallet', { p_tutor_id: userId, p_amount: amount })  // rollback
    return c.json({ error: { code: 'DB_ERROR', message: error.message } }, 500)
  }
  // TODO(prod) : appeler FeexPay payout ici, puis passer la transaction à 'completed'/'rejected'.
  return c.json({ data: txn }, 201)
})

// GET /tutor/score — score global + avis récents des élèves.
router.get('/score', async (c) => {
  const userId = c.get('userId') as string
  const profile = await loadProfile(userId)
  if (!profile) return c.json({ error: { code: 'NOT_TUTOR' } }, 403)
  const { data: ratings } = await supabaseAdmin.from('tutor_ratings')
    .select('clarity, quality, comment, created_at').eq('tutor_id', userId)
    .order('created_at', { ascending: false }).limit(30)
  return c.json({ data: { score: profile.score, ratings: ratings ?? [] } })
})

export { router as tutorRouter }
