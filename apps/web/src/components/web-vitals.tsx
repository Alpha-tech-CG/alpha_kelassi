'use client'

import { useReportWebVitals } from 'next/web-vitals'
import { send } from '@/components/app-tracker'
import { webVitalPath } from '@/lib/web-vital-path'

/** Mesures gardées : affichage du contenu, réactivité, temps de réponse du serveur. */
const TRACKED = new Set(['LCP', 'INP', 'TTFB'])

/**
 * Rapporte les Core Web Vitals : dans la console en dev, et en prod dans
 * `app_events` (événement `web_vital`, élèves connectés seulement — policy de
 * la migration 069). La console admin les agrège par `admin_web_vitals()`
 * (migration 076), carte « Vitesse » de /admin/suivi.
 *
 * Inclure dans le layout racine : <WebVitals />
 */
export function WebVitals() {
  useReportWebVitals((metric) => {
    // Log en dev pour debugging
    if (process.env.NODE_ENV === 'development') {
      const color = metric.rating === 'good' ? '✅' : metric.rating === 'needs-improvement' ? '⚠️' : '❌'
      console.debug(`[CWV] ${color} ${metric.name}: ${Math.round(metric.value)}ms (${metric.rating})`)
    }

    if (process.env.NODE_ENV !== 'production' || !TRACKED.has(metric.name)) return
    const path = webVitalPath(window.location.pathname)
    if (!path) return
    // Toutes les notes, pas seulement les mauvaises : il faut la distribution
    // entière pour calculer le 75e centile.
    void send('web_vital', {
      metric: metric.name,
      value: Math.round(metric.value),
      rating: metric.rating,
      path,
    })
  })

  return null
}
