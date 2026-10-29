import { EventsSection } from '../_components/sections'
import { StatsError, StatsPageHeader } from '../_components/page-header'
import { loadAppStats, parseDays } from '../_lib'

export const dynamic = 'force-dynamic'

/** Statistiques → Journal d'événements : volume par type d'événement. */
export default async function Page({ searchParams }: { searchParams: Promise<{ days?: string }> }) {
  const days = parseDays((await searchParams).days)
  const { stats, error } = await loadAppStats(days)

  return (
    <div className="px-4 md:px-8 py-6 md:py-8 max-w-6xl">
      <StatsPageHeader
        title="Journal d’événements"
        description="Détail technique des événements envoyés par l’app et le site."
        days={days}
        basePath="/admin/stats/evenements"
        current="evenements"
      />
      {error || !stats ? <StatsError message={error ?? 'réponse vide'} /> : <EventsSection s={stats} />}
    </div>
  )
}
