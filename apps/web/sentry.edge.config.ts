// Configuration Sentry côté edge runtime (middleware, routes edge).
// Chargée par src/instrumentation.ts quand NEXT_RUNTIME === 'edge'.
import * as Sentry from '@sentry/nextjs'

const dsn = process.env['NEXT_PUBLIC_SENTRY_DSN']

Sentry.init({
  dsn,
  enabled: !!dsn,
  environment: process.env['VERCEL_ENV'] ?? 'development',
  tracesSampleRate: 0.1,
})
