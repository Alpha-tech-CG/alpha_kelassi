import type { Context, Next } from 'hono'
import { sendSlackAlert } from '../lib/monitoring.js'

// Compteurs en mémoire (reset au redémarrage — suffisant pour alertes temps réel).
//
// Sécurité : la clé est dérivée de l'URL, donc contrôlée par le client. Sans
// garde-fous, `GET /<uuid-aléatoire>` répété fait grossir ces Map sans limite
// (épuisement mémoire à faible coût pour l'attaquant) et permet d'injecter des
// guillemets/retours à la ligne dans la sortie Prometheus. On borne donc la
// cardinalité (normalisation + plafond + repli `__other__`) et on échappe les
// labels à l'export.
const counters = {
  requests:  new Map<string, number>(),
  errors:    new Map<string, number>(),
  durations: new Map<string, number[]>(),
}

const MAX_ROUTES = 200          // cardinalité maximale des séries exportées
const MAX_DURATIONS = 1000      // échantillons de latence conservés par route
const OTHER_ROUTE = '__other__' // repli une fois le plafond atteint

let lastAlertAt = 0
const ALERT_COOLDOWN_MS = 5 * 60_000  // 1 alerte toutes les 5 min max

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/**
 * Réduit un chemin concret à un gabarit de route : les identifiants (UUID,
 * nombres, tokens longs) deviennent `:id`. Deux requêtes sur deux ressources
 * différentes partagent alors la même série, ce qui borne la cardinalité.
 */
function normalizePath(pathname: string): string {
  const segments = pathname.split('/').slice(0, 12)  // profondeur bornée
  return segments
    .map((seg) => {
      if (!seg) return seg
      if (UUID_RE.test(seg)) return ':id'
      if (/^\d+$/.test(seg)) return ':id'
      if (seg.length > 40) return ':id'
      return seg.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 40)
    })
    .join('/')
}

/** Incrémente une Map en refusant de dépasser `MAX_ROUTES` clés distinctes. */
function bump(map: Map<string, number>, route: string, by = 1): void {
  const key = map.has(route) || map.size < MAX_ROUTES ? route : OTHER_ROUTE
  map.set(key, (map.get(key) ?? 0) + by)
}

/** Clé effectivement utilisée pour la route, en respectant le plafond. */
function boundedKey(route: string): string {
  return counters.requests.has(route) || counters.requests.size < MAX_ROUTES ? route : OTHER_ROUTE
}

/** Échappe une valeur de label Prometheus (`\`, `"` et retour à la ligne). */
function escapeLabel(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n')
}

export function metricsMiddleware() {
  return async (c: Context, next: Next) => {
    let pathname: string
    try { pathname = new URL(c.req.url).pathname } catch { pathname = '/' }
    const route = `${c.req.method} ${normalizePath(pathname)}`
    const start = Date.now()

    await next()

    const duration = Date.now() - start
    const status   = c.res.status
    const key      = boundedKey(route)

    // Incrémente compteurs (cardinalité bornée par MAX_ROUTES)
    bump(counters.requests, key)
    if (status >= 500) bump(counters.errors, key)

    const durs = counters.durations.get(key) ?? []
    durs.push(duration)
    if (durs.length > MAX_DURATIONS) durs.shift()
    if (counters.durations.has(key) || counters.durations.size < MAX_ROUTES) {
      counters.durations.set(key, durs)
    }

    // Alerte Slack si taux d'erreur /ai/chat > 5%
    if (key.includes('/ai/chat')) {
      const total  = counters.requests.get(key) ?? 0
      const errors = counters.errors.get(key) ?? 0
      if (total >= 20 && errors / total > 0.05 && Date.now() - lastAlertAt > ALERT_COOLDOWN_MS) {
        lastAlertAt = Date.now()
        const rate = ((errors / total) * 100).toFixed(1)
        sendSlackAlert(`Taux d'erreur /ai/chat = ${rate}% (${errors}/${total} requêtes)`, 'critical').catch(() => null)
      }
    }
  }
}

export function getMetrics() {
  const lines: string[] = [
    '# HELP http_requests_total Total HTTP requests',
    '# TYPE http_requests_total counter',
    '# HELP http_errors_total Total HTTP 5xx errors',
    '# TYPE http_errors_total counter',
    '# HELP http_request_duration_p50_ms p50 latency ms',
    '# HELP http_request_duration_p95_ms p95 latency ms',
  ]
  for (const [route, count] of counters.requests) {
    const label = escapeLabel(route)
    lines.push(`http_requests_total{route="${label}"} ${count}`)
    lines.push(`http_errors_total{route="${label}"} ${counters.errors.get(route) ?? 0}`)

    const durs = counters.durations.get(route) ?? []
    if (durs.length > 0) {
      const sorted = [...durs].sort((a, b) => a - b)
      const p50 = sorted[Math.floor(sorted.length * 0.5)]
      const p95 = sorted[Math.floor(sorted.length * 0.95)]
      lines.push(`http_request_duration_p50_ms{route="${label}"} ${p50}`)
      lines.push(`http_request_duration_p95_ms{route="${label}"} ${p95}`)
    }
  }
  return lines.join('\n')
}
