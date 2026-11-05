import { ContentSection } from '../_components/sections'
import { StatsError, StatsPageHeader } from '../_components/page-header'
import { loadAppStats, parseDays } from '../_lib'

export const dynamic = 'force-dynamic'

/** Statistiques → Contenus consultés : chapitres et leçons les plus ouverts. */
export default async function Page({ searchParams }: { searchParams: Promise<{ days?: string }> }) {
  const days = parseDays((await searchParams).days)
  const { stats, error } = await loadAppStats(days)

  return (
    <div className="px-4 md:px-8 py-6 md:py-8 max-w-6xl">
      <StatsPageHeader
        title="Contenus consultés"
        description="Chapitres et leçons les plus ouverts par les élèves."
        days={days}
        basePath="/admin/stats/contenus"
        current="contenus"
      />
      {error || !stats ? <StatsError message={error ?? 'réponse vide'} /> : <ContentSection s={stats} />}
    </div>
  )
}
