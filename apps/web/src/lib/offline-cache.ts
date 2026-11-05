/**
 * Vide les caches hors connexion du service worker (public/sw.js).
 *
 * Appelé à la déconnexion et à la suppression du compte : sur un appareil
 * partagé, la personne suivante ne doit rien retrouver de la session
 * précédente. Ne lève jamais d'erreur — la déconnexion passe avant tout.
 */
export async function clearOfflineCaches(): Promise<void> {
  try {
    if (typeof caches === 'undefined') return
    const keys = await caches.keys()
    await Promise.all(keys.filter((k) => k.startsWith('kelassi-')).map((k) => caches.delete(k)))
  } catch {
    // Stockage indisponible (navigation privée, quota…) : rien à vider.
  }
}
