/**
 * Rayons de l'espace « Prépa » (migration 058). Copie de `apps/web/src/lib/prepa.ts`
 * (le mobile n'importe pas les paquets du monorepo).
 *
 * Bac test, Bac blanc et Bac rouge fixent le mode de passage de l'épreuve ;
 * un ancien bac se passe dans le mode que l'élève choisit. « TD » regroupe
 * les exercices corrigés des chapitres de la matière.
 */
export type ExamKind = 'bac_test' | 'bac_blanc' | 'bac_rouge' | 'ancien_bac'
export type PrepaRayon = ExamKind | 'td'
export type ExamMode = 'entrainement' | 'bac_test' | 'bac_blanc' | 'bac_rouge'

export const RAYONS: PrepaRayon[] = ['bac_test', 'bac_blanc', 'bac_rouge', 'ancien_bac', 'td']

/** Nom de l'examen de la classe : « Bac », « BEPC » ou « CEPE ». */
export function examName(level: string | null): string {
  if (level === 'cepe') return 'CEPE'
  if (level === 'bepc') return 'BEPC'
  return 'Bac'
}

export function rayonMeta(rayon: PrepaRayon, level: string | null) {
  const exam = examName(level)
  switch (rayon) {
    case 'bac_test':   return { label: `${exam} test`,  emoji: '⏱️', desc: 'Chronométré, pour te tester',            mode: 'bac_test' as ExamMode,  plan: 'starter', planLabel: 'Starter' }
    case 'bac_blanc':  return { label: `${exam} blanc`, emoji: '📝', desc: 'Chronométré et noté, comme le jour J',  mode: 'bac_blanc' as ExamMode, plan: 'pro',     planLabel: 'Pro' }
    case 'bac_rouge':  return { label: `${exam} rouge`, emoji: '🔴', desc: 'Difficile : −1 point par erreur',      mode: 'bac_rouge' as ExamMode, plan: 'pro',     planLabel: 'Pro' }
    case 'ancien_bac': return { label: `Anciens ${exam}`, emoji: '📜', desc: 'Les sujets des sessions passées',   mode: null,                    plan: 'starter', planLabel: 'Starter' }
    case 'td':         return { label: 'TD',            emoji: '✏️', desc: 'Exercices corrigés, chapitre par chapitre', mode: null,             plan: null,      planLabel: '' }
  }
}

export const MODE_LABEL: Record<ExamMode, { label: string; emoji: string; plan: 'starter' | 'pro'; planLabel: string }> = {
  entrainement: { label: 'Entraînement libre', emoji: '🎯', plan: 'starter', planLabel: 'Starter' },
  bac_test:     { label: 'Test chronométré',   emoji: '⏱️', plan: 'starter', planLabel: 'Starter' },
  bac_blanc:    { label: 'Blanc (noté)',       emoji: '📝', plan: 'pro',     planLabel: 'Pro' },
  bac_rouge:    { label: 'Rouge (−1/erreur)',  emoji: '🔴', plan: 'pro',     planLabel: 'Pro' },
}

export const isRayon = (v: unknown): v is PrepaRayon =>
  typeof v === 'string' && (RAYONS as string[]).includes(v)
