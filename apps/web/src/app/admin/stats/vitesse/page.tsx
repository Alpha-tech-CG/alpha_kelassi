import { VitalsCard } from '../_components/sections'
import { StatsPageHeader } from '../_components/page-header'
import { loadWebVitals, parseDays } from '../_lib'

export const dynamic = 'force-dynamic'

/** Statistiques → Vitesse du site : web vitals des élèves connectés (migration 076). */
export default async function Page({ searchParams }: { searchParams: Promise<{ days?: string }> }) {
  const days = parseDays((await searchParams).days)
  const { vitals } = await loadWebVitals(days)

  return (
    <div className="px-4 md:px-8 py-6 md:py-8 max-w-6xl">
      <StatsPageHeader
        title="Vitesse du site"
        description="Temps d’affichage et de réponse ressentis par les élèves connectés sur le site web."
        days={days}
        basePath="/admin/stats/vitesse"
        current="vitesse"
      />
      <VitalsCard v={vitals} />
    </div>
  )
}
