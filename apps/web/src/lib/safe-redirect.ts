/**
 * Chemin de redirection sûr après connexion (audit sécurité du 26/10/2026, F1).
 *
 * `next` vient de l'URL : sans contrôle, `next=@evil.com` ou `next=.evil.com`
 * collé derrière l'origine envoie l'élève sur un autre site. On n'accepte qu'un
 * chemin interne (commence par un seul `/`), et on vérifie en plus, après
 * résolution par le navigateur, que l'origine est inchangée (tabulations et
 * retours à la ligne, que les navigateurs suppriment, transforment `/\t/x`
 * en `//x`).
 */
export function safeNextPath(next: string | null | undefined, origin: string, fallback = '/dashboard'): string {
  if (!next || !/^\/(?![\/\\])/.test(next)) return fallback
  try {
    const url = new URL(next, origin)
    if (url.origin !== origin) return fallback
    return `${url.pathname}${url.search}${url.hash}`
  } catch {
    return fallback
  }
}
