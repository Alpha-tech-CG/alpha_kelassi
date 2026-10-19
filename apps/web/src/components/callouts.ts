/**
 * Encadrés de cours : un blockquote dont la première ligne commence par un de ces
 * emojis devient un encadré coloré (définition, théorème, formule…).
 *
 *   > **🏛️ Théorème — Dérivée de l'exponentielle**
 *   > Pour tout réel $x$, $(e^x)' = e^x$.
 *
 * Sans ce style (ancienne version de l'appli), il reste un simple cadre avec son
 * titre en gras : le contenu ne casse jamais.
 * Même liste dans l'appli mobile : apps/mobile/src/components/MathLessonView.tsx.
 */
export const CALLOUTS = [
  { emoji: '📘', kind: 'definition' },
  { emoji: '🏛', kind: 'theoreme' },
  { emoji: '📐', kind: 'formule' },
  { emoji: '💡', kind: 'comprendre' },
  { emoji: '✏', kind: 'exemple' },
  { emoji: '🧭', kind: 'methode' },
  { emoji: '⚠', kind: 'attention' },
  { emoji: '🎯', kind: 'retenir' },
] as const

export type CalloutKind = (typeof CALLOUTS)[number]['kind']

export function calloutKind(text: string): CalloutKind | undefined {
  const t = text.trimStart()
  return CALLOUTS.find((c) => t.startsWith(c.emoji))?.kind
}
