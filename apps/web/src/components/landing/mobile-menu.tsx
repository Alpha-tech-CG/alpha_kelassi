'use client'

import { useEffect, useState, type ReactNode } from 'react'

/**
 * Menu de navigation mobile de la page d'accueil. Le contenu (liens, icônes)
 * est rendu côté serveur et passé en enfants ; ce composant ne gère que
 * l'ouverture, la fermeture au clic sur un lien et la touche Échap.
 */
export function MobileMenu({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="menu-mobile"
        aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
        className="flex size-9 items-center justify-center rounded-xl border border-border bg-card text-foreground"
      >
        {icon}
      </button>
      <div
        id="menu-mobile"
        hidden={!open}
        onClick={(e) => (e.target as HTMLElement).closest('a') && setOpen(false)}
        className="absolute inset-x-0 top-full border-b border-border bg-card px-4 py-4 shadow-lg"
      >
        {children}
      </div>
    </>
  )
}
