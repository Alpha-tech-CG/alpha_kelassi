// Point d'entrée Next.js (App Router) pour l'instrumentation au démarrage.
// Charge la config Sentry adaptée au runtime en cours d'exécution.
// Doc Sentry Next.js : https://docs.sentry.io/platforms/javascript/guides/nextjs/
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('../sentry.server.config')
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('../sentry.edge.config')
  }
}
