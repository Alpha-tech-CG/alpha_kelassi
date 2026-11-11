import { RevenueSection } from '../stats/_components/sections'
import { StatsError, StatsPageHeader } from '../stats/_components/page-header'
import { loadAppStats, parseDays } from '../stats/_lib'

export const dynamic = 'force-dynamic'

/**
 * Finances → Revenus & conversions : statistiques de paiement (FeexPay) et de
 * passage au payant. La gestion des abonnements reste sur /admin/subscriptions.
 */
export default async function Page({ searchParams }: { searchParams: Promise<{ days?: string }> }) {
  const days = parseDays((await searchParams).days)
  const { stats, error } = await loadAppStats(days)

  return (
    <div className="px-4 md:px-8 py-6 md:py-8 max-w-6xl">
      <StatsPageHeader
        title="Revenus & conversions"
        description="Abonnés payants, passage gratuit → payant et paiements Mobile Money (FeexPay)."
        days={days}
        basePath="/admin/revenus"
      />
      {error || !stats ? <StatsError message={error ?? 'réponse vide'} /> : <RevenueSection s={stats} />}
    </div>
  )
}
