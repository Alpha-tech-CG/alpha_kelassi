import { Worker, type Job } from 'bullmq'
import { GoogleGenAI } from '@google/genai'
import { supabaseAdmin as supabase } from '../lib/supabase.js'
import { notifyUser } from '../lib/messaging.js'
import {
  rewardForAttempt, recomputeTutorScore, creditTutor, signedUrl, MAX_ATTEMPTS, DUE_MS,
} from '../lib/tutor.js'
import {
  enqueueDispatch, enqueueAcceptTimeout, enqueueForceSolution, enqueueScore,
} from './tutor-queue.js'

// Buckets par colonne (cf. migration 033). Les colonnes stockent le CHEMIN objet.
const BUCKET = { exercise: 'exercise-photos', work: 'student-work', solution: 'tutor-solutions' } as const

// ── Gemini (lazy, tolérant à l'absence de clé) ────────────────────────────────
let _genai: GoogleGenAI | null = null
function getGenai(): GoogleGenAI | null {
  const key = process.env['GEMINI_API_KEY']
  if (!key) return null
  if (!_genai) _genai = new GoogleGenAI({ apiKey: key })
  return _genai
}

/** Construit une part `inlineData` Gemini à partir d'un fichier de bucket privé. */
async function imagePart(bucket: string, path: string) {
  const url = await signedUrl(bucket, path, 300)
  if (!url) return null
  const res = await fetch(url)
  if (!res.ok) return null
  const buf = Buffer.from(await res.arrayBuffer())
  const mimeType = path.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg'
  return { inlineData: { mimeType, data: buf.toString('base64') } }
}

// ── dispatch-mission : trouve le meilleur tuteur dispo, le sollicite ──────────
async function processDispatch(missionId: string, tried: string[]) {
  const { data: m } = await supabase
    .from('correction_missions').select('id, status, subject_id').eq('id', missionId).single()
  if (!m || m.status !== 'pending') return { skipped: m?.status ?? 'missing' }

  const { data: rows } = await supabase
    .from('tutor_subjects')
    .select('tutor_id, tutor_profiles!inner(score, is_verified, is_active)')
    .eq('subject_id', m.subject_id)
    .eq('tutor_profiles.is_verified', true)
    .eq('tutor_profiles.is_active', true)

  const candidates = (rows ?? [])
    .map((r) => ({ id: r.tutor_id as string, score: (r as any).tutor_profiles?.score ?? 0 }))
    .filter((t) => !tried.includes(t.id))
    .sort((a, b) => b.score - a.score)

  if (candidates.length === 0) {
    // Plus aucun tuteur disponible → l'IA prend le relais (B.2).
    await enqueueForceSolution(missionId)
    return { forced: true }
  }

  const next = candidates[0]!
  await notifyUser({
    userId: next.id,
    dedupKey: `mission-offer:${missionId}:${next.id}`,
    template: { name: 'tutor_mission_offer', lang: 'fr', params: [] },
    smsBody: '📩 Kelassi Tuteur : une nouvelle mission de correction est disponible. Tu as 5 min pour l’accepter dans l’app.',
  })
  await enqueueAcceptTimeout(missionId, [...tried, next.id])
  return { offeredTo: next.id }
}

// ── mission-accept-timeout : 5 min écoulées sans acceptation → tuteur suivant ──
async function processAcceptTimeout(missionId: string, tried: string[]) {
  const { data: m } = await supabase.from('correction_missions').select('status').eq('id', missionId).single()
  if (!m || m.status !== 'pending') return { skipped: m?.status ?? 'missing' }
  await enqueueDispatch(missionId, tried)  // relance vers le tuteur suivant
  return { reDispatched: true }
}

// ── mission-due-timeout : 1h30 écoulées sans rendu → échec, relais IA ─────────
async function processDueTimeout(missionId: string) {
  const { data: m } = await supabase
    .from('correction_missions').select('status, tutor_id').eq('id', missionId).single()
  if (!m || m.status !== 'assigned') return { skipped: m?.status ?? 'missing' }

  await supabase.from('correction_missions')
    .update({ status: 'failed', ai_verdict: 'Délai de rendu (1h30) dépassé — relais IA.' })
    .eq('id', missionId).eq('status', 'assigned')

  if (m.tutor_id) await recomputeTutorScore(m.tutor_id)  // pénalise (mission non livrée)
  await enqueueForceSolution(missionId)
  return { failed: true }
}

// ── ai-verify-solution : OCR + vérification Gemini de la solution du tuteur ────
async function processVerify(missionId: string, solutionId: string) {
  const [{ data: mission }, { data: sol }] = await Promise.all([
    supabase.from('correction_missions')
      .select('id, status, tutor_id, student_id, exercise_url, work_url').eq('id', missionId).single(),
    supabase.from('correction_solutions').select('id, attempt, photo_url').eq('id', solutionId).single(),
  ])
  if (!mission || !sol) return { skipped: 'missing' }
  if (mission.status !== 'submitted') return { skipped: mission.status }

  const genai = getGenai()
  let ok = true
  let feedback = 'Vérification IA non configurée — validation automatique (dev).'

  if (genai) {
    const parts = (await Promise.all([
      imagePart(BUCKET.exercise, mission.exercise_url),
      imagePart(BUCKET.work, mission.work_url),
      imagePart(BUCKET.solution, sol.photo_url),
    ])).filter(Boolean)

    const prompt =
      'Tu es correcteur en chef. Voici 3 images : (1) l’énoncé de l’exercice, ' +
      '(2) le travail manuscrit de l’élève, (3) la correction manuscrite proposée par un tuteur. ' +
      'Vérifie que la correction du tuteur est mathématiquement/logiquement JUSTE, complète et lisible. ' +
      'Réponds STRICTEMENT en JSON : {"ok": true|false, "feedback": "<explication courte en français>"}. ' +
      'Si une erreur existe, localise-la précisément dans "feedback".'

    try {
      const resp = await genai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ role: 'user', parts: [{ text: prompt }, ...(parts as any[])] }],
      })
      const text = resp.text ?? ''
      const json = JSON.parse(text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1))
      ok = json.ok === true
      feedback = String(json.feedback ?? '').slice(0, 1000)
    } catch (e) {
      // En cas d'échec d'analyse, on ne bloque pas le tuteur : nouvelle tentative possible.
      ok = false
      feedback = 'Analyse IA impossible pour le moment. Merci de renvoyer une photo plus nette.'
    }
  }

  if (ok) {
    const reward = rewardForAttempt(sol.attempt)
    await supabase.from('correction_solutions').update({ ai_status: 'ok', ai_feedback: feedback }).eq('id', sol.id)
    await supabase.from('correction_missions').update({
      status: 'delivered', delivered_at: new Date().toISOString(),
      attempts: sol.attempt, reward_fcfa: reward, ai_verdict: 'ok',
    }).eq('id', missionId)
    if (mission.tutor_id) {
      await creditTutor(mission.tutor_id, missionId, reward)  // send-reward (inline, atomique)
      await enqueueScore(mission.tutor_id)
    }
    await notifyUser({
      userId: mission.student_id,
      dedupKey: `correction-ready:${missionId}`,
      template: { name: 'correction_ready', lang: 'fr', params: [] },
      smsBody: '✅ Kelassi : ta correction est prête ! Ouvre l’app pour la consulter.',
    })
    return { delivered: true, reward }
  }

  // Échec de vérification
  await supabase.from('correction_solutions').update({ ai_status: 'error', ai_feedback: feedback }).eq('id', sol.id)

  if (sol.attempt < MAX_ATTEMPTS) {
    // Le tuteur peut retenter : la mission repasse en cours.
    await supabase.from('correction_missions').update({ status: 'assigned' }).eq('id', missionId)
    if (mission.tutor_id) {
      await notifyUser({
        userId: mission.tutor_id,
        dedupKey: `retry:${missionId}:${sol.attempt}`,
        template: { name: 'tutor_retry', lang: 'fr', params: [] },
        smsBody: '⚠️ Kelassi Tuteur : une erreur a été détectée dans ta correction. Corrige et renvoie (2e essai).',
      })
    }
    return { retry: true }
  }

  // 2e échec → l'IA prend le relais, tuteur payé 0 (B.2).
  await enqueueForceSolution(missionId)
  return { forced: true }
}

// ── ai-force-solution : l'IA génère la correction complète (reward tuteur = 0) ─
async function processForce(missionId: string) {
  const { data: m } = await supabase
    .from('correction_missions').select('id, status, tutor_id, student_id, exercise_url, work_url').eq('id', missionId).single()
  if (!m || m.status === 'delivered') return { skipped: m?.status ?? 'missing' }

  const genai = getGenai()
  let solutionText = 'Correction générée automatiquement (service IA non configuré).'
  if (genai) {
    const parts = (await Promise.all([
      imagePart(BUCKET.exercise, m.exercise_url),
      imagePart(BUCKET.work, m.work_url),
    ])).filter(Boolean)
    try {
      const resp = await genai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ role: 'user', parts: [
          { text: 'Voici l’énoncé (1) et le travail de l’élève (2). Rédige une correction complète, ' +
            'claire et pédagogique en français, étape par étape, adaptée à un lycéen congolais (BEPC/BAC).' },
          ...(parts as any[]),
        ] }],
      })
      solutionText = (resp.text ?? solutionText).slice(0, 8000)
    } catch { /* on garde le texte de repli */ }
  }

  await supabase.from('correction_missions').update({
    status: 'delivered', delivered_at: new Date().toISOString(),
    reward_fcfa: 0, ai_verdict: solutionText,
  }).eq('id', missionId)

  await notifyUser({
    userId: m.student_id,
    dedupKey: `correction-ai:${missionId}`,
    template: { name: 'correction_ready', lang: 'fr', params: [] },
    smsBody: '✅ Kelassi : ta correction est prête (corrigée par notre IA). Ouvre l’app.',
  })
  return { delivered: 'ai' }
}

// ── ai-resolve-dispute : arbitrage IA d'un litige élève ───────────────────────
async function processResolveDispute(disputeId: string) {
  const { data: d } = await supabase
    .from('correction_disputes').select('id, mission_id, description').eq('id', disputeId).single()
  if (!d) return { skipped: 'missing' }

  const { data: mission } = await supabase
    .from('correction_missions').select('exercise_url, work_url, ai_verdict').eq('id', d.mission_id).single()
  const { data: sol } = await supabase
    .from('correction_solutions').select('photo_url').eq('mission_id', d.mission_id)
    .order('attempt', { ascending: false }).limit(1).maybeSingle()

  const genai = getGenai()
  let explanation = 'Arbitrage IA non configuré — un modérateur Cognix examinera ta contestation.'
  if (genai && mission) {
    const parts = (await Promise.all([
      imagePart(BUCKET.exercise, mission.exercise_url),
      imagePart(BUCKET.work, mission.work_url),
      sol ? imagePart(BUCKET.solution, sol.photo_url) : null,
    ])).filter(Boolean)
    try {
      const resp = await genai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ role: 'user', parts: [
          { text: `L’élève conteste sa correction. Sa remarque : « ${d.description} ». ` +
            'Analyse l’énoncé, le travail et la correction fournie, puis rends un arbitrage détaillé et ' +
            'pédagogique en français : la correction était-elle juste ? Explique clairement.' },
          ...(parts as any[]),
        ] }],
      })
      explanation = (resp.text ?? explanation).slice(0, 8000)
    } catch { /* repli */ }
  }

  await supabase.from('correction_disputes')
    .update({ ai_explanation: explanation, resolved_at: new Date().toISOString() }).eq('id', disputeId)
  return { resolved: true }
}

// ── Aiguillage ────────────────────────────────────────────────────────────────
async function handleJob(job: Job) {
  const d = job.data as Record<string, any>
  switch (job.name) {
    case 'dispatch-mission':        return processDispatch(d['missionId'], d['tried'] ?? [])
    case 'mission-accept-timeout':  return processAcceptTimeout(d['missionId'], d['tried'] ?? [])
    case 'mission-due-timeout':     return processDueTimeout(d['missionId'])
    case 'ai-verify-solution':      return processVerify(d['missionId'], d['solutionId'])
    case 'ai-force-solution':       return processForce(d['missionId'])
    case 'ai-resolve-dispute':      return processResolveDispute(d['disputeId'])
    case 'update-tutor-score':      return recomputeTutorScore(d['tutorId'])
    default:                        return { ignored: job.name }
  }
}

export function startTutorWorker() {
  const worker = new Worker('tutor_jobs', handleJob, {
    connection: { url: process.env['QUEUE_REDIS_URL']! },
    concurrency: 4,
  })

  const onCompleted = (job: Job, res: unknown) =>
    console.log(`[tutor-worker] ${job.name} ${job.id} — ${JSON.stringify(res)}`)
  const onFailed = (job: Job | undefined, err: Error) =>
    console.error(`[tutor-worker] ${job?.name} ${job?.id} échoué:`, err.message)

  worker.on('completed', onCompleted)
  worker.on('failed', onFailed)

  // Teardown : chaque .on() a son .off() à la fermeture du worker.
  worker.once('closed', () => {
    worker.off('completed', onCompleted)
    worker.off('failed', onFailed)
    worker.removeAllListeners()
  })

  return worker
}

// Ré-exporté pour usage éventuel ailleurs.
export { DUE_MS }
