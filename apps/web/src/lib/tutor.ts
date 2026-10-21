import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { GoogleGenAI } from '@google/genai'
import type { Database } from '@alpha-kelassi/types'

// Client service-role dédié au système tuteurs (bypass RLS après validation
// serveur du userId). Les tables tuteurs sont en RLS SELECT-only pour les
// clients ; toutes les écritures passent ici. Sur Vercel, les jobs BullMQ ne
// tournent pas : la vérification IA est exécutée SYNCHRONEMENT dans la route
// de soumission (cf. aiVerifySolution).
let _admin: SupabaseClient<Database> | null = null
export function admin(): SupabaseClient<Database> {
  if (!_admin) {
    _admin = createClient<Database>(
      process.env['NEXT_PUBLIC_SUPABASE_URL']!,
      process.env['SUPABASE_SERVICE_ROLE_KEY']!,
      { auth: { persistSession: false } },
    )
  }
  return _admin
}

export const REWARD_FCFA = { FIRST: 250, SECOND: 150, FAIL: 0 } as const
export const DUE_MS = 90 * 60 * 1000
export const MAX_ATTEMPTS = 2
export const BUCKET = { exercise: 'exercise-photos', work: 'student-work', solution: 'tutor-solutions' } as const

export function rewardForAttempt(attempt: number): number {
  if (attempt <= 1) return REWARD_FCFA.FIRST
  if (attempt === 2) return REWARD_FCFA.SECOND
  return REWARD_FCFA.FAIL
}

export async function signedUrl(bucket: string, path: string, expiresIn = 900): Promise<string | null> {
  const { data } = await admin().storage.from(bucket).createSignedUrl(path, expiresIn)
  return data?.signedUrl ?? null
}

/** Crédite le portefeuille du tuteur (idempotent par mission). */
export async function creditTutor(tutorId: string, missionId: string, amount: number): Promise<void> {
  if (amount <= 0) return
  const { data: existing } = await admin()
    .from('tutor_wallet_transactions').select('id').eq('mission_id', missionId).eq('type', 'credit').maybeSingle()
  if (existing) return
  await admin().from('tutor_wallet_transactions').insert({
    tutor_id: tutorId, mission_id: missionId, amount_fcfa: amount, type: 'credit', status: 'completed',
  })
  await admin().rpc('increment_tutor_wallet', { p_tutor_id: tutorId, p_amount: amount })
}

/** Recalcule le score : (moyenne notes ×0.6) + (taux 1re tentative ×0.4), sur 5. */
export async function recomputeTutorScore(tutorId: string): Promise<number> {
  const [{ data: ratings }, { data: missions }] = await Promise.all([
    admin().from('tutor_ratings').select('clarity, quality').eq('tutor_id', tutorId),
    admin().from('correction_missions').select('attempts, status').eq('tutor_id', tutorId).eq('status', 'delivered'),
  ])
  const rated = ratings ?? []
  const avgRating = rated.length ? rated.reduce((s, r) => s + (r.clarity + r.quality) / 2, 0) / rated.length : 0
  const delivered = missions ?? []
  const firstTryRate = delivered.length ? delivered.filter((m) => m.attempts <= 1).length / delivered.length : 0
  const score = Math.round((avgRating * 0.6 + firstTryRate * 5 * 0.4) * 100) / 100
  await admin().from('tutor_profiles').update({ score }).eq('user_id', tutorId)
  return score
}

// ── Gemini (lazy) ─────────────────────────────────────────────────────────────
let _genai: GoogleGenAI | null = null
function getGenai(): GoogleGenAI | null {
  const key = process.env['GEMINI_API_KEY']
  if (!key) return null
  if (!_genai) _genai = new GoogleGenAI({ apiKey: key })
  return _genai
}

async function imagePart(bucket: string, path: string) {
  const url = await signedUrl(bucket, path, 300)
  if (!url) return null
  const res = await fetch(url)
  if (!res.ok) return null
  const buf = Buffer.from(await res.arrayBuffer())
  const mimeType = path.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg'
  return { inlineData: { mimeType, data: buf.toString('base64') } }
}

/** Images d'une mission pour l'IA : énoncé, copie de l'élève, correction du tuteur (si fournie). */
export async function missionImageParts(m: { exercise_url: string; work_url: string; solution_url?: string | null }): Promise<object[]> {
  const parts = await Promise.all([
    imagePart(BUCKET.exercise, m.exercise_url), imagePart(BUCKET.work, m.work_url),
    m.solution_url ? imagePart(BUCKET.solution, m.solution_url) : null,
  ])
  return parts.filter(Boolean) as object[]
}

/** Vérifie une correction tuteur (énoncé + travail + solution). */
export async function aiVerifySolution(m: { exercise_url: string; work_url: string; photo_url: string }): Promise<{ ok: boolean; feedback: string }> {
  const genai = getGenai()
  if (!genai) return { ok: true, feedback: 'Vérification IA non configurée — validation automatique.' }
  const parts = (await Promise.all([
    imagePart(BUCKET.exercise, m.exercise_url), imagePart(BUCKET.work, m.work_url), imagePart(BUCKET.solution, m.photo_url),
  ])).filter(Boolean)
  const prompt =
    'Tu es correcteur en chef. Images : (1) énoncé, (2) travail de l’élève, (3) correction manuscrite d’un tuteur. ' +
    'Vérifie que la correction est JUSTE, complète et lisible. Réponds STRICTEMENT en JSON : ' +
    '{"ok": true|false, "feedback": "<explication courte en français, localise l’erreur si présente>"}.'
  try {
    const resp = await genai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }, ...(parts as object[])] }],
    })
    const text = resp.text ?? ''
    const json = JSON.parse(text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1))
    return { ok: json.ok === true, feedback: String(json.feedback ?? '').slice(0, 1000) }
  } catch {
    return { ok: false, feedback: 'Analyse IA impossible. Merci de renvoyer une photo plus nette.' }
  }
}

/** Génère une correction complète par IA (relais après 2 échecs / délai). */
export async function aiGenerateSolution(m: { exercise_url: string; work_url: string }): Promise<string> {
  const genai = getGenai()
  if (!genai) return 'Correction générée automatiquement (service IA non configuré).'
  const parts = (await Promise.all([imagePart(BUCKET.exercise, m.exercise_url), imagePart(BUCKET.work, m.work_url)])).filter(Boolean)
  try {
    const resp = await genai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [
        { text: 'Voici l’énoncé (1) et le travail de l’élève (2). Rédige une correction complète, claire et pédagogique en français, étape par étape, pour un lycéen congolais.' },
        ...(parts as object[]),
      ] }],
    })
    return (resp.text ?? '').slice(0, 8000) || 'Correction indisponible.'
  } catch {
    return 'Correction indisponible pour le moment.'
  }
}

/** Arbitrage IA d’un litige élève. */
export async function aiResolveDispute(m: { exercise_url: string; work_url: string; solution_url: string | null; description: string }): Promise<string> {
  const genai = getGenai()
  if (!genai) return 'Arbitrage IA non configuré — un modérateur examinera ta contestation.'
  const parts = (await Promise.all([
    imagePart(BUCKET.exercise, m.exercise_url), imagePart(BUCKET.work, m.work_url),
    m.solution_url ? imagePart(BUCKET.solution, m.solution_url) : null,
  ])).filter(Boolean)
  try {
    const resp = await genai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [
        { text: `L’élève conteste sa correction. Remarque : « ${m.description} ». Analyse énoncé, travail et correction, puis rends un arbitrage détaillé et pédagogique en français.` },
        ...(parts as object[]),
      ] }],
    })
    return (resp.text ?? '').slice(0, 8000) || 'Arbitrage indisponible.'
  } catch {
    return 'Arbitrage indisponible pour le moment.'
  }
}
