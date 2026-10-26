import { ActivitySection } from '../_components/sections'
import { StatsError, StatsPageHeader } from '../_components/page-header'
import { loadAppStats, parseDays } from '../_lib'

export const dynamic = 'force-dynamic'

/** Statistiques → Activité : élèves actifs, courbes, rétention, plateformes. */
export default async function Page({ searchParams }: { searchParams: Promise<{ days?: string }> }) {
  const days = parseDays((await searchParams).days)
  const { stats, error } = await loadAppStats(days)

  return (
    <div className="px-4 md:px-8 py-6 md:py-8 max-w-6xl">
      <StatsPageHeader
        title="Activité des élèves"
        description="Élèves actifs, inscriptions par jour, rétention et plateformes."
        days={days}
        basePath="/admin/stats/activite"
        current="activite"
      />
      {error || !stats ? <StatsError message={error ?? 'réponse vide'} /> : <ActivitySection s={stats} />}
    </div>
  )
}
