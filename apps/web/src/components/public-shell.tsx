import Link from 'next/link'
import { Logo } from '@/components/brand/logo'

/**
 * Coque publique du catalogue de cours — affichée aux visiteurs sans compte.
 *
 * Même navigation et même pied de page que la page d'accueil (charte Cognix
 * bleu / blanc), sans navigation applicative (qui mènerait à des pages
 * protégées), mais avec un accès direct à la création de compte, seule étape
 * nécessaire pour lire les leçons.
 */
export function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-cx-navy flex min-h-screen flex-col bg-white">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-blue-600 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Aller au contenu principal
      </a>

      <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5">
          <Link href="/" aria-label="Cognix, accueil">
            <Logo />
          </Link>
          <nav className="flex items-center gap-2 text-[15px] font-medium" aria-label="Compte">
            <Link href="/cours" className="hidden px-3 py-2 hover:opacity-70 sm:block">
              Cours
            </Link>
            <Link href="/login" className="px-3 py-2 hover:opacity-70">
              Se connecter
            </Link>
            <Link
              href="/register"
              className="btn-lift rounded-full bg-blue-600 px-5 py-2.5 text-white"
            >
              Créer un compte
            </Link>
          </nav>
        </div>
      </header>

      <main id="main-content" className="bg-cx-paper flex-1">
        {children}
      </main>

      <footer className="bg-cx-sky">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-8 text-sm">
          <div className="flex items-center gap-4">
            <Logo size="sm" />
            <p className="text-cx-navy/70 hidden sm:block">Révisions CEPE, BEPC et BAC au Congo</p>
          </div>
          <div className="flex gap-5">
            <Link href="/cgu" className="hover:underline">
              Conditions d’utilisation
            </Link>
            <Link href="/confidentialite" className="hover:underline">
              Confidentialité
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
