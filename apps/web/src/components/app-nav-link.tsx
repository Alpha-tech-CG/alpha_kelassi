'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

/**
 * Lien de navigation de l'espace élève qui se met en surbrillance (pilule
 * bleue) quand on est sur sa page ou une sous-page.
 */
export function AppNavLink({
  href,
  children,
  variant = 'side',
}: {
  href: string
  children: ReactNode
  variant?: 'side' | 'bottom'
}) {
  const pathname = usePathname() ?? ''
  const active = pathname === href || pathname.startsWith(`${href}/`)

  if (variant === 'bottom') {
    return (
      <Link
        href={href}
        aria-current={active ? 'page' : undefined}
        className={`flex flex-col items-center gap-0.5 rounded-2xl px-3 py-1.5 transition-colors ${
          active ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'
        }`}
      >
        {children}
      </Link>
    )
  }

  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={`flex items-center gap-3 rounded-full px-4 py-2.5 text-sm font-medium transition-colors ${
        active ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700'
      }`}
    >
      {children}
    </Link>
  )
}
