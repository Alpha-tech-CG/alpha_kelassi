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

/**
 * Étiquettes écrites en gras au début d'un paragraphe dans les cours des autres
 * matières (« **💡 Je retiens :** … », « **Remarque :** … », « **2) Définition** »).
 * Le paragraphe prend alors le style de l'encadré correspondant, sans réécrire le cours.
 * Même liste dans l'appli mobile : apps/mobile/src/components/MathLessonView.tsx.
 */
export const LABELS: ReadonlyArray<readonly [RegExp, CalloutKind]> = [
  [/^(d[ée]finitions?|vocabulaire|mots?[ -]cl[ée]s|notions?[ -]cl[ée]s)\b/, 'definition'],
  [/^(th[ée]or[èe]mes?|propri[ée]t[ée]s?|r[èe]gles?|lois?)\b/, 'theoreme'],
  [/^formules?\b/, 'formule'],
  [/^(remarques?|nb\b|n\.b|id[ée]e centrale|pour bien comprendre|explication|astuce|le savais-tu)/, 'comprendre'],
  [/^(exemples?|exercices? r[ée]solus?|probl[èe]mes? r[ée]solus?|exercices? d'application|application)\b/, 'exemple'],
  [/^(m[ée]thodes?|d[ée]marche|conseils?|comment faire)\b/, 'methode'],
  [/^(attention|important|pi[èe]ges?|erreurs? fr[ée]quentes?)\b/, 'attention'],
  [/^(je retiens|[àa] retenir|l'essentiel|l’essentiel|objectifs?)\b/, 'retenir'],
]

/** Type d'encadré d'après le texte d'un intitulé en gras (`undefined` si ce n'en est pas un). */
export function labelKind(label: string): CalloutKind | undefined {
  if (label.length > 60) return undefined
  // Retire emoji, numérotation (« 2) », « A. ») et ponctuation de tête.
  const t = label
    .toLocaleLowerCase('fr')
    .replace(/^[^\p{L}]*(?:[a-z0-9]{1,2}[).]\s+)?/u, '')
    .trim()
  return LABELS.find(([re]) => re.test(t))?.[1] ?? calloutKind(label)
}
