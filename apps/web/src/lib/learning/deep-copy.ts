import { admin, missionImageParts } from '@/lib/tutor'
import { getEntitlements } from '@/lib/subscription/server'
import { deepCopyAnalysis } from './ai'

/**
 * Analyse approfondie de la copie (Pro Max), lancée après la livraison d'une
 * correction. Hors du temps de réponse du tuteur : appelée via `after()`.
 * Sans effet si l'élève n'a pas la formule, ou si l'analyse existe déjà.
 */
export async function runDeepCopyAnalysis(missionId: string): Promise<void> {
  const { data } = await admin().from('correction_missions')
    .select('id, student_id, exercise_url, work_url, status, deep_analysis')
    .eq('id', missionId).maybeSingle()
  const mission = data as { student_id: string; exercise_url: string; work_url: string; status: string; deep_analysis: unknown } | null
  if (!mission || mission.status !== 'delivered' || mission.deep_analysis) return

  const ent = await getEntitlements(mission.student_id)
  if (!ent.can('deep_copy_analysis')) return

  const { data: sol } = await admin().from('correction_solutions')
    .select('photo_url').eq('mission_id', missionId).eq('ai_status', 'ok')
    .order('attempt', { ascending: false }).limit(1).maybeSingle()
  const solutionUrl = (sol as { photo_url?: string } | null)?.photo_url ?? null

  const images = await missionImageParts({ exercise_url: mission.exercise_url, work_url: mission.work_url, solution_url: solutionUrl })
  const analysis = await deepCopyAnalysis(images, !!solutionUrl)
  if (!analysis) return

  await admin().from('correction_missions')
    .update({ deep_analysis: { ...analysis, generated_at: new Date().toISOString() } })
    .eq('id', missionId)
}
