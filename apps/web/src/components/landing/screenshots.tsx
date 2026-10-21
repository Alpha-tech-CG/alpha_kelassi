import { existsSync } from 'node:fs'
import path from 'node:path'
import Image from 'next/image'
import type { ReactNode } from 'react'

/*
 * Captures réelles de l'app pour la page d'accueil, dans
 * apps/web/public/screenshots/ (png, webp ou jpg). Remplacer un fichier par
 * une capture plus nette suffit : la page la prend au prochain build.
 *   mobile-accueil          → hero
 *   mobile-lecon-formules   → section Cours
 *   mobile-matiere          → section Cours (second téléphone)
 *   mobile-cognix           → section Cognix IA
 *   mobile-prepa            → section Prépa
 *   mobile-parent           → section Parents (sinon photo seule)
 * Format conseillé : capture de téléphone, ratio ~9:19,5.
 */

export type ShotName =
  | 'mobile-accueil'
  | 'mobile-lecon-formules'
  | 'mobile-matiere'
  | 'mobile-cognix'
  | 'mobile-prepa'
  | 'mobile-parent'

const EXTENSIONS = ['webp', 'png', 'jpg', 'jpeg']

/** Chemin public de la capture si le fichier existe, sinon null. */
export function findShot(name: ShotName): string | null {
  const dir = path.join(process.cwd(), 'public', 'screenshots')
  for (const ext of EXTENSIONS) {
    if (existsSync(path.join(dir, `${name}.${ext}`))) return `/screenshots/${name}.${ext}`
  }
  return null
}

/** Icônes de barre d'état (réseau, wifi, batterie) dessinées en SVG. */
function StatusIcons() {
  return (
    <svg viewBox="0 0 54 12" className="h-[10px] w-auto" aria-hidden="true">
      <g fill="currentColor">
        <rect x="0" y="8" width="3" height="4" rx="0.8" />
        <rect x="4.5" y="6" width="3" height="6" rx="0.8" />
        <rect x="9" y="3.5" width="3" height="8.5" rx="0.8" />
        <rect x="13.5" y="1" width="3" height="11" rx="0.8" />
        <path d="M27 2.2c2.3 0 4.4.9 6 2.3l-1.2 1.3A6.9 6.9 0 0 0 27 4a6.9 6.9 0 0 0-4.8 1.8L21 4.5a8.8 8.8 0 0 1 6-2.3Zm0 3.6c1.3 0 2.5.5 3.4 1.3L29.2 8.4a3.3 3.3 0 0 0-4.4 0L23.6 7.1c.9-.8 2.1-1.3 3.4-1.3Zm0 3.5 1.3 1.4-1.3 1.3-1.3-1.3L27 9.3Z" />
        <rect x="37" y="1.5" width="14" height="9" rx="2.4" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.45" />
        <rect x="38.6" y="3.1" width="10.8" height="5.8" rx="1.3" />
        <rect x="52" y="4.5" width="1.6" height="3" rx="0.6" opacity="0.45" />
      </g>
    </svg>
  )
}

/**
 * Téléphone réaliste : cadre titane, Dynamic Island, barre d'état 9:41
 * (qui recouvre la zone vide en haut des captures) et boutons latéraux.
 * `statusLight` : texte de barre d'état blanc, pour une capture à fond sombre.
 */
export function Phone({
  name,
  alt,
  priority = false,
  fallback = null,
  className = '',
  sizes = '(min-width: 1024px) 300px, 70vw',
  statusLight = false,
}: {
  name: ShotName
  alt: string
  priority?: boolean
  fallback?: ReactNode
  className?: string
  sizes?: string
  statusLight?: boolean
}) {
  const src = findShot(name)
  if (!src) return <>{fallback}</>
  return (
    <div className={`relative ${className}`}>
      {/* boutons latéraux */}
      <span aria-hidden="true" className="absolute -left-[3px] top-[18%] h-[7%] w-[3px] rounded-l bg-[#2b2f36]" />
      <span aria-hidden="true" className="absolute -left-[3px] top-[28%] h-[11%] w-[3px] rounded-l bg-[#2b2f36]" />
      <span aria-hidden="true" className="absolute -right-[3px] top-[24%] h-[14%] w-[3px] rounded-r bg-[#2b2f36]" />
      <div className="relative rounded-[3rem] bg-gradient-to-b from-[#3a3f47] via-[#1c1f24] to-[#3a3f47] p-[3px] shadow-[0_50px_100px_-30px_rgba(15,27,45,0.45)]">
        <div className="rounded-[2.85rem] bg-black p-[9px]">
          <div className="relative aspect-[373/806] overflow-hidden rounded-[2.3rem] bg-white">
            <Image
              src={src}
              alt={alt}
              fill
              priority={priority}
              sizes={sizes}
              className="object-cover object-top"
            />
            <div
              aria-hidden="true"
              className={`absolute inset-x-0 top-0 flex h-[42px] items-center justify-between px-[9%] text-[12px] font-semibold ${statusLight ? 'text-white' : 'text-black'}`}
            >
              <span className="tracking-tight">9:41</span>
              <StatusIcons />
            </div>
            <span
              aria-hidden="true"
              className="absolute left-1/2 top-[9px] h-[25px] w-[31%] -translate-x-1/2 rounded-full bg-black"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
