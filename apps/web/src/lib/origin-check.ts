/**
 * Vérification d'origine (mitigation CSRF explicite).
 *
 * Complète le SameSite=Lax implicite des cookies Supabase SSR sur les routes
 * mutatives les plus sensibles (paiement, retrait) : on compare l'en-tête
 * `Origin` (ou à défaut `Referer`) de la requête aux domaines de confiance du
 * projet (NEXT_PUBLIC_SITE_URL / VERCEL_URL / domaines connus).
 *
 * Tolérant par construction :
 * - Si `Origin` est absent mais que `Referer` correspond → OK (certains
 *   navigateurs/clients n'envoient pas Origin sur les requêtes same-site).
 * - Si NI `Origin` NI `Referer` ne sont présents → OK. L'app mobile (Expo)
 *   appelle ces mêmes routes avec un Bearer token et n'envoie généralement
 *   aucun des deux en-têtes ; les bloquer casserait le paiement/retrait
 *   légitimes depuis le mobile. Cette vérification est une défense en
 *   profondeur en plus de l'auth Bearer/cookie — pas la seule ligne de
 *   défense.
 * - On bloque uniquement quand un en-tête DE PROVENANCE est présent et ne
 *   correspond à AUCUN domaine de confiance.
 */

function trustedHosts(extraHosts: string[] = []): Set<string> {
  const hosts = new Set<string>()
  const add = (value?: string | null) => {
    if (!value) return
    try {
      hosts.add(new URL(value.includes('://') ? value : `https://${value}`).host)
    } catch {
      // valeur mal formée dans l'env — on l'ignore plutôt que de faire planter la route
    }
  }

  add(process.env['NEXT_PUBLIC_SITE_URL'])
  add(process.env['VERCEL_URL'])
  // Domaines de prod connus (cf. NEXT_PUBLIC_SITE_URL fallback dans layout.tsx / README).
  add('https://kelassi.app')
  add('https://alpha-kelassi-web.vercel.app')
  if (process.env['NODE_ENV'] !== 'production') add('http://localhost:3000')
  extraHosts.forEach(add)

  return hosts
}

/**
 * Renvoie `true` si la requête peut être considérée comme provenant d'une
 * origine de confiance (ou si aucun en-tête de provenance n'est disponible
 * pour trancher). Renvoie `false` uniquement si Origin/Referer est présent
 * et pointe vers un domaine inconnu.
 */
export function assertTrustedOrigin(request: Request, extraHosts: string[] = []): boolean {
  const allowed = trustedHosts(extraHosts)

  const origin = request.headers.get('origin')
  if (origin) {
    try {
      return allowed.has(new URL(origin).host)
    } catch {
      return false
    }
  }

  const referer = request.headers.get('referer')
  if (referer) {
    try {
      return allowed.has(new URL(referer).host)
    } catch {
      return false
    }
  }

  // Ni Origin ni Referer (typiquement l'app mobile) — on ne bloque pas.
  return true
}
