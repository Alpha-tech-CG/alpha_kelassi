'use client'

import { useState, type ReactNode } from 'react'

/**
 * Bascule mensuel / annuel des tarifs. Les deux prix sont déjà rendus côté
 * serveur ; on se contente de poser `data-interval` sur le conteneur et les
 * cartes affichent l'un ou l'autre via `group-data-[interval=year]:`.
 */
export function PricingToggle({ savingsLabel, children }: { savingsLabel: string; children: ReactNode }) {
  const [interval, setBillingInterval] = useState<'month' | 'year'>('month')
  const option = (value: 'month' | 'year', label: ReactNode) => (
    <button
      type="button"
      role="radio"
      aria-checked={interval === value}
      onClick={() => setBillingInterval(value)}
      className={`flex items-center gap-1.5 rounded-xl px-5 py-2 text-xs transition ${
        interval === value ? 'bg-primary font-extrabold text-white shadow' : 'font-bold text-slate-700 hover:text-primary'
      }`}
    >
      {label}
    </button>
  )

  return (
    <div data-interval={interval} className="group">
      <div className="mt-8 flex justify-center">
        <div
          role="radiogroup"
          aria-label="Période de facturation"
          className="inline-flex items-center rounded-2xl border border-border bg-slate-100 p-1.5 shadow-inner"
        >
          {option('month', 'Forfait Mensuel')}
          {option(
            'year',
            <>
              <span>Forfait Annuel</span>
              <span className="rounded-md bg-accent px-1.5 py-0.5 text-[10px] font-black text-primary">{savingsLabel}</span>
            </>,
          )}
        </div>
      </div>
      {children}
    </div>
  )
}
