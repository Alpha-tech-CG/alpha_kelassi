/**
 * Rayons de l'espace « Prépa » (migration 058).
 *
 * Une épreuve d'examen est un QCM `is_exam` rangé dans l'un de ces rayons par
 * `quizzes.exam_kind`. Pour Bac test, Bac blanc et Bac rouge, le rayon fixe le
 * mode de passage ; un ancien bac se passe dans le mode choisi par l'élève.
 * Le rayon « TD » n'est pas un type d'épreuve : ce sont les exercices corrigés
 * des chapitres de la matière.
 *
 * Copie mobile : `apps/mobile/src/lib/prepa.ts`.
 */
export const EXAM_KINDS = ['bac_test', 'bac_blanc', 'bac_rouge', 'ancien_bac'] as const
export type ExamKind = (typeof EXAM_KINDS)[number]

export const EXAM_KIND_META: Record<ExamKind, { label: string; emoji: string; hint: string }> = {
  bac_test:   { label: 'Bac test',   emoji: '⏱️', hint: 'Chronométré, sans note finale' },
  bac_blanc:  { label: 'Bac blanc',  emoji: '📝', hint: 'Chronométré et noté, comme le jour J' },
  bac_rouge:  { label: 'Bac rouge',  emoji: '🔴', hint: 'Difficile : −1 point par erreur' },
  ancien_bac: { label: 'Ancien bac', emoji: '📜', hint: 'Sujets des sessions précédentes' },
}

export const isExamKind = (v: unknown): v is ExamKind =>
  typeof v === 'string' && (EXAM_KINDS as readonly string[]).includes(v)

/** Rayons de la page élève, dans l'ordre d'affichage (« td » = exercices corrigés). */
export type PrepaRayon = ExamKind | 'td'
export const RAYONS: PrepaRayon[] = [...EXAM_KINDS, 'td']
export const isRayon = (v: unknown): v is PrepaRayon =>
  typeof v === 'string' && (RAYONS as string[]).includes(v)

/** Nom de l'examen de la classe : « Bac », « BEPC » ou « CEPE ». */
export function examName(level: string | null | undefined): string {
  if (level === 'cepe') return 'CEPE'
  if (level === 'bepc') return 'BEPC'
  return 'Bac'
}

/** Libellé d'un rayon adapté à la classe (« BEPC blanc », « Anciens CEPE »…) et mode imposé. */
export function rayonMeta(rayon: PrepaRayon, level: string | null | undefined) {
  const exam = examName(level)
  switch (rayon) {
    case 'bac_test':   return { label: `${exam} test`,     emoji: '⏱️', desc: 'Chronométré, pour te tester',               mode: 'bac_test' as const,  plan: 'starter' }
    case 'bac_blanc':  return { label: `${exam} blanc`,    emoji: '📝', desc: 'Chronométré et noté, comme le jour J',     mode: 'bac_blanc' as const, plan: 'pro' }
    case 'bac_rouge':  return { label: `${exam} rouge`,    emoji: '🔴', desc: 'Difficile : −1 point par erreur',         mode: 'bac_rouge' as const, plan: 'pro' }
    case 'ancien_bac': return { label: `Anciens ${exam}`,  emoji: '📜', desc: 'Les sujets des sessions passées',         mode: null,                 plan: 'starter' }
    case 'td':         return { label: 'TD',               emoji: '✏️', desc: 'Exercices corrigés, chapitre par chapitre', mode: null,               plan: null }
  }
}
