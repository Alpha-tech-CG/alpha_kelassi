import { redirect } from 'next/navigation'

/**
 * Ancienne page « Suivi de l'app », découpée le 26/10/2026 en pages séparées
 * (Statistiques et Finances → Revenus). L'adresse reste valable.
 */
export default async function Page({ searchParams }: { searchParams: Promise<{ days?: string }> }) {
  const { days } = await searchParams
  redirect(`/admin/stats/activite${days ? `?days=${encodeURIComponent(days)}` : ''}`)
}
