import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import Link from 'next/link'
import { SolarIcon } from '@/components/landing/solar-icon'

// Même police de titres que la page d'accueil (la variable n'est posée que là).
const heading = Plus_Jakarta_Sans({ subsets: ['latin'], weight: ['600', '700', '800'], variable: '--font-heading', display: 'swap' })

export const metadata: Metadata = {
  title: { absolute: 'Page introuvable — Cognix' },
  robots: { index: false, follow: true },
}

/** Quelques portes de sortie utiles plutôt qu'un cul-de-sac. */
const PISTES: { href: string; icone: Parameters<typeof SolarIcon>[0]['name']; titre: string; texte: string }[] = [
  { href: '/cours', icone: 'book-bookmark-bold-duotone', titre: 'Le catalogue des cours', texte: 'Toutes les classes, du CEPE au BAC, séries générales et techniques.' },
  { href: '/dashboard', icone: 'medal-star-bold-duotone', titre: 'Mon espace', texte: 'Reprendre ma progression, mes révisions et mes résultats.' },
  { href: '/#tarifs', icone: 'diploma-bold-duotone', titre: 'Les formules', texte: 'Gratuit, Starter, Pro et Pro Max : ce que comprend chacune.' },
  { href: '/telecharger', icone: 'devices-bold-duotone', titre: "L'application Android", texte: 'Réviser hors connexion, une fois les cours téléchargés.' },
]

export default function PageIntrouvable() {
  return (
    <main className={`${heading.variable} min-h-screen bg-background px-4 py-16 text-foreground lg:px-8`}>
      <div className="mx-auto max-w-3xl">
        <Link href="/" aria-label="Cognix, accueil" className="mb-10 inline-flex items-center gap-2.5">
          <span className="flex size-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary via-secondary to-[#00B4D8] shadow-md shadow-primary/20">
            <SolarIcon name="bolt-bold-duotone" className="text-2xl text-accent" />
          </span>
          <span className="font-heading text-2xl font-extrabold tracking-tight text-primary">Cognix</span>
        </Link>

        <div className="rounded-[2rem] border border-border bg-card p-8 shadow-sm sm:p-12">
          <p className="font-heading text-6xl font-extrabold text-primary sm:text-7xl">404</p>
          <h1 className="mt-4 font-heading text-2xl font-extrabold text-primary sm:text-3xl">
            Cette page n’existe pas (ou plus).
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Le lien est peut-être incomplet, ou la page a changé d’adresse. Rien n’est perdu : voici par où
            continuer.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {PISTES.map((p) => (
              <Link
                key={p.href}
                href={p.href}
                className="group flex items-start gap-3 rounded-3xl border border-border bg-background p-4 transition hover:border-secondary/40 hover:shadow-sm"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-secondary">
                  <SolarIcon name={p.icone} className="text-xl" />
                </span>
                <span>
                  <span className="block font-heading text-sm font-bold text-primary">{p.titre}</span>
                  <span className="mt-0.5 block text-xs leading-5 text-muted-foreground">{p.texte}</span>
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-secondary px-6 py-3.5 font-heading text-sm font-bold text-white shadow-lg shadow-primary/25 transition hover:-translate-y-0.5"
            >
              <span>Retour à l’accueil</span>
              <SolarIcon name="arrow-right-bold" className="text-accent" />
            </Link>
            <a
              href="mailto:support@kelassi.app?subject=Lien%20introuvable%20sur%20Cognix"
              className="inline-flex items-center justify-center rounded-2xl border border-border px-6 py-3.5 text-sm font-bold text-primary transition hover:bg-muted"
            >
              Signaler ce lien cassé
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}
