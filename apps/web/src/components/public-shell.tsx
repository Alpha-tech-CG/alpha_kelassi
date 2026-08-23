import Link from 'next/link'
import { BookOpen } from 'lucide-react'

/**
 * Coque publique du catalogue de cours — affichée aux visiteurs sans compte.
 *
 * Volontairement plus légère que la coque connectée : pas de navigation
 * applicative (qui mènerait à des pages protégées), mais un accès direct à la
 * création de compte, seule étape nécessaire pour lire les leçons.
 */
export function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#fcfbf9]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg focus:text-sm focus:font-semibold"
      >
        Aller au contenu principal
      </a>

      <header className="bg-[#172554] text-white">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2" aria-label="Alpha Kelassi — Accueil">
            <div className="w-8 h-8 bg-[#f5a623] rounded-lg flex items-center justify-center" aria-hidden="true">
              <BookOpen className="h-4 w-4 text-[#172554]" />
            </div>
            <span className="text-lg font-black">Alpha Kelassi</span>
          </Link>

          <nav className="flex items-center gap-3 text-sm" aria-label="Compte">
            <Link href="/login" className="text-blue-100 hover:text-white transition-colors font-medium">
              Se connecter
            </Link>
            <Link
              href="/register"
              className="bg-[#f5a623] text-[#172554] font-bold px-3 py-1.5 rounded-lg hover:brightness-105 transition-all"
            >
              Créer un compte
            </Link>
          </nav>
        </div>
      </header>

      <main id="main-content" className="flex-1">{children}</main>

      <footer className="border-t border-gray-200 bg-white">
        <div className="max-w-5xl mx-auto px-4 py-6 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-400">
          <p>Alpha Kelassi — révisions CEPE, BEPC &amp; BAC, Congo-Brazzaville</p>
          <div className="flex gap-4">
            <Link href="/cgu" className="hover:text-gray-600 transition-colors">CGU</Link>
            <Link href="/confidentialite" className="hover:text-gray-600 transition-colors">Confidentialité</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
