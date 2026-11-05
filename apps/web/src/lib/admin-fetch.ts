/**
 * Appel d'une route d'administration, à l'épreuve des réponses inattendues.
 *
 * Les formulaires de la console faisaient jusqu'ici `await res.json()` sans
 * filet. Or une coupure réseau, un délai dépassé ou une page d'erreur HTML
 * font lever cette ligne : l'exception interrompt le gestionnaire AVANT le
 * `setSaving(false)`, et le bouton reste désactivé jusqu'au rechargement de la
 * page. C'est exactement le symptôme « le bouton ne fonctionne plus ».
 *
 * Cette fonction ne lève jamais. Elle renvoie toujours un résultat exploitable,
 * et normalise au passage la forme de l'erreur : les routes répondent tantôt
 * `{ error: "Corps invalide" }`, tantôt `{ error: { code, message } }`, ce qui
 * faisait afficher un « Erreur » sans information à l'utilisateur.
 */
export interface AdminResult<T = unknown> {
  ok: boolean
  status: number
  /** Le champ `data` de la réponse, ou le corps entier s'il n'y en a pas. */
  data: T | null
  /** Corps complet : utile aux routes qui renvoient plus que `data`. */
  body: unknown
  /** Message prêt à afficher ; `null` quand tout s'est bien passé. */
  error: string | null
}

export async function adminFetch<T = unknown>(
  url: string,
  init?: RequestInit,
): Promise<AdminResult<T>> {
  let res: Response
  try {
    res = await fetch(url, { credentials: 'include', ...init })
  } catch {
    return { ok: false, status: 0, data: null, body: null, error: 'Connexion impossible. Vérifie ta connexion et réessaie.' }
  }

  const raw = await res.text().catch(() => '')
  let json: unknown = null
  if (raw) { try { json = JSON.parse(raw) } catch { /* réponse non JSON */ } }

  if (res.ok) {
    return { ok: true, status: res.status, data: (json as { data?: T })?.data ?? (json as T), body: json, error: null }
  }
  return { ok: false, status: res.status, data: null, body: json, error: messageOf(json, res.status) }
}

/** Extrait un message lisible, quelle que soit la forme renvoyée par la route. */
function messageOf(json: unknown, status: number): string {
  const err = (json as { error?: unknown })?.error
  if (typeof err === 'string' && err.trim()) return err
  if (err && typeof err === 'object') {
    const m = (err as { message?: unknown }).message
    if (typeof m === 'string' && m.trim()) return m
  }
  // Sans corps exploitable, le code HTTP est ce qu'on peut dire de plus utile.
  if (status === 401) return 'Session expirée. Reconnecte-toi puis réessaie.'
  if (status === 403) return 'Accès refusé : compte administrateur requis.'
  if (status === 413) return 'Contenu trop volumineux.'
  if (status >= 500) return 'Le serveur a rencontré une erreur. Réessaie dans un instant.'
  return `Échec de la requête (HTTP ${status}).`
}
