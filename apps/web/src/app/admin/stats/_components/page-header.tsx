import Link from 'next/link'
import { PERIODS } from '../_lib'

/** Pages de la rubrique Statistiques, dans l'ordre des onglets. */
export const STATS_TABS = [
  { slug: 'activite', label: 'Activité' },
  { slug: 'inscriptions', label: 'Inscriptions' },
  { slug: 'contenus', label: 'Contenus consultés' },
  { slug: 'vitesse', label: 'Vitesse du site' },
  { slug: 'evenements', label: 'Journal d’événements' },
] as const

export type StatsSlug = (typeof STATS_TABS)[number]['slug']

/**
 * En-tête commun : titre, description, sélecteur de période et, pour la
 * rubrique Statistiques, les onglets vers les pages sœurs (la période suit).
 */
export function StatsPageHeader({ title, description, days, basePath, current }: {
  title: string
  description: string
  days: number
  /** Adresse de la page, pour le sélecteur de période. */
  basePath: string
  /** Onglet actif, si la page fait partie de la rubrique Statistiques. */
  current?: StatsSlug
}) {
  return (
    <div className="mb-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">{title}</h1>
          <p className="text-gray-500 text-sm mt-1">{description}</p>
        </div>
        <nav className="flex gap-1 bg-gray-100 rounded-xl p-1" aria-label="Période">
          {PERIODS.map((p) => (
            <Link
              key={p}
              href={`${basePath}?days=${p}`}
              aria-current={p === days ? 'true' : undefined}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${p === days ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-800'}`}
            >
              {p} jours
            </Link>
          ))}
        </nav>
      </div>

      {current && (
        <nav className="mt-5 flex gap-1 overflow-x-auto overflow-y-hidden [scrollbar-width:none] border-b border-gray-200" aria-label="Statistiques">
          {STATS_TABS.map((t) => (
            <Link
              key={t.slug}
              href={`/admin/stats/${t.slug}?days=${days}`}
              aria-current={t.slug === current ? 'page' : undefined}
              className={`px-3 py-2 -mb-px text-sm font-semibold whitespace-nowrap border-b-2 ${
                t.slug === current ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              {t.label}
            </Link>
          ))}
        </nav>
      )}
    </div>
  )
}

/** Encadré d'erreur quand les agrégats ne se chargent pas. */
export function StatsError({ message }: { message: string }) {
  return (
    <div className="bg-red-50 border border-red-200 text-red-800 rounded-2xl p-5 text-sm">
      Statistiques indisponibles : {message}.
    </div>
  )
}
