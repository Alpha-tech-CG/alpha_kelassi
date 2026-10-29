/**
 * Séance de flashcards d'un chapitre : le paquet préparé (table chapter_flashcards,
 * une cinquantaine de cartes) est commun à tous ; chaque séance en montre 15, tirées
 * au hasard. Copie de `apps/web/src/lib/flashcards/deck.ts` (le mobile n'importe pas le web).
 */
export const SESSION_SIZE = 15

export interface DeckCard { id: string; front: string; back: string }

/**
 * Tire `n` cartes au hasard (Fisher-Yates partiel), en évitant si possible celles de
 * la séance précédente (`exclude`) pour que « 15 autres cartes » en montre vraiment d'autres.
 */
export function drawCards<T extends { id: string }>(
  deck: T[],
  n: number = SESSION_SIZE,
  exclude: ReadonlySet<string> = new Set(),
  rand: () => number = Math.random,
): T[] {
  const fresh = deck.filter((c) => !exclude.has(c.id))
  const pool = fresh.length >= n ? fresh : deck
  const a = [...pool]
  const k = Math.min(n, a.length)
  for (let i = 0; i < k; i++) {
    const j = i + Math.floor(rand() * (a.length - i))
    ;[a[i], a[j]] = [a[j]!, a[i]!]
  }
  return a.slice(0, k)
}
