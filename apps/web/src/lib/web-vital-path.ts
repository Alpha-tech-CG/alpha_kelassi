const UUID = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi

/**
 * Chemin regroupé pour les mesures de vitesse : les identifiants (UUID,
 * nombres) deviennent `:id`, pour comparer les pages d'un même type. Renvoie
 * null pour ce qui ne se mesure pas (console admin, API).
 */
export function webVitalPath(pathname: string): string | null {
  if (pathname.startsWith('/admin') || pathname.startsWith('/api')) return null
  const path = pathname
    .replace(UUID, ':id')
    .replace(/\/\d+(?=\/|$)/g, '/:id')
    .replace(/\/+$/, '')
  return (path || '/').slice(0, 120)
}
