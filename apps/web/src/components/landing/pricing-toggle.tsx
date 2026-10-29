'use client'

import { useState, type ReactNode } from 'react'
import { motion } from 'motion/react'

/**
 * Bascule mensuel / annuel des tarifs. Les deux prix sont déjà rendus côté
 * serveur ; on se contente de poser `data-interval` sur le conteneur et les
 * cartes affichent l'un ou l'autre via `group-data-[interval=year]:`.
 * La pastille active glisse d'une option à l'autre (layoutId).
 */
export function PricingToggle({ savingsLabel, children }: { savingsLabel: string; children: ReactNode }) {
  const [interval, setBillingInterval] = useState<'month' | 'year'>('month')
  const option = (value: 'month' | 'year', label: ReactNode) => (
    <button
      type="button"
      role="radio"
      aria-checked={interval === value}
      onClick={() => setBillingInterval(value)}
      className={`relative flex items-center gap-1.5 rounded-full px-5 py-2 text-sm transition-colors duration-300 ${
        interval === value ? 'font-semibold text-white' : 'font-medium text-cx-navy hover:opacity-70'
      }`}
    >
      {interval === value && (
        <motion.span
          layoutId="pricing-pill"
          data-motion
          className="absolute inset-0 rounded-full bg-cx-navy shadow"
          transition={{ type: 'spring', stiffness: 420, damping: 34 }}
        />
      )}
      <span className="relative flex items-center gap-1.5">{label}</span>
    </button>
  )

  return (
    <div data-interval={interval} className="group">
      <div className="mt-8 flex justify-center">
        <div
          role="radiogroup"
          aria-label="Période de facturation"
          className="inline-flex items-center rounded-full border border-cx-navy/10 bg-white p-1.5"
        >
          {option('month', 'Mensuel')}
          {option(
            'year',
            <>
              <span>Annuel</span>
              <span className="rounded-full bg-cx-blue px-2 py-0.5 text-[11px] font-semibold text-white">{savingsLabel}</span>
            </>,
          )}
        </div>
      </div>
      {children}
    </div>
  )
}
