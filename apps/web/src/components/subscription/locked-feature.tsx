import Link from 'next/link'
import { PLAN_META, lockedFeatureInfo, type FeatureKey, type LockedFeatureInfo } from '@alpha-kelassi/types'

/**
 * Explication d'une fonctionnalité verrouillée : ce qui manque, la formule
 * minimale, son prix, et un lien vers les offres. Jamais une erreur technique.
 */
export function LockedFeature({
  feature,
  info,
  backHref,
  backLabel = 'Retour',
  compact = false,
}: {
  feature?: FeatureKey
  info?: LockedFeatureInfo | null
  backHref?: string
  backLabel?: string
  compact?: boolean
}) {
  const i = info ?? (feature ? lockedFeatureInfo(feature) : null)
  if (!i) return null
  const label = PLAN_META[i.requiredPlan].label
  const headingId = `locked-${i.feature}`

  return (
    <section
      aria-labelledby={headingId}
      className={`rounded-2xl border border-amber-200 bg-amber-50 text-center ${compact ? 'p-4' : 'p-6 sm:p-8 max-w-md mx-auto'}`}
    >
      <p className={compact ? 'text-2xl mb-1' : 'text-4xl mb-3'} aria-hidden="true">🔒</p>
      <h2 id={headingId} className={`font-black text-gray-900 ${compact ? 'text-sm' : 'text-lg'} mb-2`}>{i.title}</h2>
      <p className="text-sm text-gray-600 leading-relaxed">{i.body}</p>
      <p className="text-sm font-semibold text-amber-800 mt-3">
        Formule requise : {label} — à partir de {i.price}
      </p>
      <div className={`flex flex-col sm:flex-row gap-2 justify-center ${compact ? 'mt-3' : 'mt-5'}`}>
        <Link
          href={`/billing?plan=${i.requiredPlan}`}
          className="inline-block px-5 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-gray-700 transition-colors"
        >
          Voir la formule {label}
        </Link>
        {backHref && (
          <Link href={backHref} className="inline-block px-5 py-2.5 text-sm font-semibold text-gray-600 hover:text-gray-900">
            {backLabel}
          </Link>
        )}
      </div>
    </section>
  )
}
