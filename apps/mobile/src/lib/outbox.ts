/**
 * File d'écriture hors-ligne.
 *
 * Lire un cours sans réseau ne sert à rien si l'élève ne peut rien faire :
 * jusqu'ici, une leçon terminée ou une réponse d'exercice validée sans
 * connexion était simplement perdue. Les actions sont désormais enregistrées
 * sur l'appareil, l'interface les considère comme faites, et elles sont
 * rejouées dès que le réseau revient.
 *
 * Seules les actions **idempotentes** passent par cette file : marquer une
 * leçon terminée et enregistrer une tentative d'exercice peuvent être rejouées
 * sans effet de bord (upsert). Les actions qui dépendent d'un calcul serveur
 * — la soumission d'un QCM, qui produit une note — n'y ont pas leur place.
 */
import { supabase } from './supabase'
import { readCachedLesson, writeCachedLesson } from './lessonCache'

const CLE = 'outbox:actions'

export type ActionEnAttente =
  | { type: 'lesson_progress'; lessonId: string; completed: boolean; score: number | null; at: number }
  | { type: 'exercise_attempt'; exerciseId: string; at: number }

async function lire(): Promise<ActionEnAttente[]> {
  try {
    const brut = await readCachedLesson(CLE)
    if (!brut) return []
    const parsed = JSON.parse(brut) as ActionEnAttente[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

async function ecrire(actions: ActionEnAttente[]): Promise<void> {
  await writeCachedLesson(CLE, 'outbox', JSON.stringify(actions))
}

/** Met une action de côté ; une même cible n'est gardée qu'une fois (la plus récente). */
export async function enfiler(action: ActionEnAttente): Promise<void> {
  const actions = await lire()
  const memeCible = (a: ActionEnAttente) =>
    a.type === action.type &&
    (action.type === 'lesson_progress'
      ? a.type === 'lesson_progress' && a.lessonId === action.lessonId
      : a.type === 'exercise_attempt' && a.exerciseId === action.exerciseId)
  await ecrire([...actions.filter((a) => !memeCible(a)), action])
}

/** Nombre d'actions encore en attente d'envoi. */
export async function enAttente(): Promise<number> {
  return (await lire()).length
}

/** Rejoue une action ; renvoie false si elle doit rester en attente. */
async function rejouer(action: ActionEnAttente, userId: string): Promise<boolean> {
  try {
    if (action.type === 'lesson_progress') {
      const { error } = await supabase.from('lesson_progress').upsert(
        {
          user_id: userId,
          lesson_id: action.lessonId,
          completed: action.completed,
          score: action.score,
          completed_at: new Date(action.at).toISOString(),
        },
        { onConflict: 'user_id,lesson_id' },
      )
      return !error
    }
    const { error } = await supabase.from('exercise_attempts').upsert(
      { user_id: userId, exercise_id: action.exerciseId },
      { onConflict: 'user_id,exercise_id', ignoreDuplicates: true },
    )
    return !error
  } catch {
    return false
  }
}

/**
 * Tente d'envoyer tout ce qui attend. Sans réseau ou sans session, rien n'est
 * perdu : les actions restent en file pour la prochaine occasion.
 */
export async function viderLaFile(): Promise<{ envoyees: number; restantes: number }> {
  const actions = await lire()
  if (actions.length === 0) return { envoyees: 0, restantes: 0 }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { envoyees: 0, restantes: actions.length }

  const restantes: ActionEnAttente[] = []
  let envoyees = 0
  for (const action of actions) {
    if (await rejouer(action, user.id)) envoyees++
    else restantes.push(action)
  }
  await ecrire(restantes)
  return { envoyees, restantes: restantes.length }
}
