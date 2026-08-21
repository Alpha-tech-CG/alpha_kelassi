// Configuration Sentry côté navigateur (client bundle).
// Chargé automatiquement par le plugin Sentry injecté via withSentryConfig
// dans next.config.ts — voir aussi sentry.server.config.ts / sentry.edge.config.ts
// et src/instrumentation.ts pour les runtimes serveur et edge.
import * as Sentry from '@sentry/nextjs'

const dsn = process.env['NEXT_PUBLIC_SENTRY_DSN']

Sentry.init({
  dsn,
  // Désactive Sentry proprement si aucun DSN n'est configuré (dev local, previews sans clé, etc.)
  enabled: !!dsn,
  environment: process.env['NEXT_PUBLIC_VERCEL_ENV'] ?? 'development',
  tracesSampleRate: 0.1,
})
