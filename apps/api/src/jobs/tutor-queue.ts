import { Queue } from 'bullmq'
import { ACCEPT_TIMEOUT_MS } from '../lib/tutor.js'

const queueRedisUrl = process.env['QUEUE_REDIS_URL'] ?? ''
const isQueueConfigured = !!queueRedisUrl && !queueRedisUrl.includes('xxxx')

// File unique du système tuteurs (Deliveroo). Chaque job porte un `name`
// que le worker aiguille (dispatch, timeouts, vérif IA, récompense, score).
export const tutorQueue = isQueueConfigured
  ? new Queue('tutor_jobs', {
      connection: { url: queueRedisUrl },
      defaultJobOptions: { attempts: 3, backoff: { type: 'exponential', delay: 5000 }, removeOnComplete: 200, removeOnFail: 200 },
    })
  : null

// ── Helpers d'enqueue (no-op si Redis non configuré : le workflow reste testable
//    manuellement via l'API, on ne fait juste pas de dispatch automatique) ──────

/** Lance la recherche d'un tuteur pour une mission (ordre de score décroissant). */
export async function enqueueDispatch(missionId: string, tried: string[] = []): Promise<void> {
  if (!tutorQueue) return
  await tutorQueue.add('dispatch-mission', { missionId, tried }, { jobId: `dispatch:${missionId}:${tried.length}` })
}

/** Planifie l'expiration du délai d'acceptation (5 min) pour le tuteur sollicité. */
export async function enqueueAcceptTimeout(missionId: string, tried: string[]): Promise<void> {
  if (!tutorQueue) return
  await tutorQueue.add(
    'mission-accept-timeout',
    { missionId, tried },
    { delay: ACCEPT_TIMEOUT_MS, jobId: `accept-timeout:${missionId}:${tried.length}` },
  )
}

/** Planifie l'expiration du délai de rendu (1h30) à échéance `dueAt`. */
export async function enqueueDueTimeout(missionId: string, dueAtIso: string): Promise<void> {
  if (!tutorQueue) return
  const delay = Math.max(0, new Date(dueAtIso).getTime() - Date.now())
  await tutorQueue.add('mission-due-timeout', { missionId }, { delay, jobId: `due-timeout:${missionId}` })
}

/** Déclenche la vérification IA d'une solution soumise par un tuteur. */
export async function enqueueVerify(missionId: string, solutionId: string): Promise<void> {
  if (!tutorQueue) return
  await tutorQueue.add('ai-verify-solution', { missionId, solutionId }, { jobId: `verify:${solutionId}` })
}

/** Force la génération d'une solution IA (après 2 échecs / délai dépassé). */
export async function enqueueForceSolution(missionId: string): Promise<void> {
  if (!tutorQueue) return
  await tutorQueue.add('ai-force-solution', { missionId }, { jobId: `force:${missionId}` })
}

/** Demande à l'IA d'arbitrer un litige élève. */
export async function enqueueResolveDispute(disputeId: string): Promise<void> {
  if (!tutorQueue) return
  await tutorQueue.add('ai-resolve-dispute', { disputeId }, { jobId: `dispute:${disputeId}` })
}

/** Recalcule le score du tuteur après une mission terminée. */
export async function enqueueScore(tutorId: string): Promise<void> {
  if (!tutorQueue) return
  await tutorQueue.add('update-tutor-score', { tutorId })
}
