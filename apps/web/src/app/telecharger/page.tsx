import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import Link from 'next/link'
import { SolarIcon } from '@/components/landing/solar-icon'

const heading = Plus_Jakarta_Sans({ subsets: ['latin'], weight: ['600', '700', '800'], variable: '--font-heading', display: 'swap' })

export const metadata: Metadata = {
  title: { absolute: 'Télécharger Cognix sur Android' },
  description:
    "Installe l'application Cognix sur ton téléphone Android pour réviser le CEPE, le BEPC et le BAC, et consulter tes cours même sans connexion.",
  alternates: { canonical: '/telecharger' },
}

/**
 * Lien du fichier d'installation, renseigné après chaque build EAS :
 * NEXT_PUBLIC_ANDROID_APK_URL (et, si on veut l'afficher, VERSION / TAILLE).
 * Tant qu'il est absent, la page l'annonce honnêtement au lieu de proposer
 * un bouton qui ne mène nulle part.
 */
const APK_URL = process.env['NEXT_PUBLIC_ANDROID_APK_URL'] ?? ''
const APK_VERSION = process.env['NEXT_PUBLIC_ANDROID_APK_VERSION'] ?? ''
const APK_TAILLE = process.env['NEXT_PUBLIC_ANDROID_APK_SIZE'] ?? ''

const ETAPES = [
  { titre: 'Télécharge le fichier', texte: 'Appuie sur le bouton ci-dessus. Ton téléphone enregistre un fichier qui se termine par .apk.' },
  { titre: "Autorise l'installation", texte: "Android demande d'autoriser l'installation depuis cette source : accepte, c'est une sécurité normale pour une application installée hors du Play Store." },
  { titre: 'Ouvre le fichier', texte: 'Appuie sur le fichier téléchargé, puis sur « Installer ». L’installation prend moins d’une minute.' },
  { titre: 'Connecte-toi', texte: 'Ouvre Cognix et entre le même compte que sur le site : ta progression te suit d’un appareil à l’autre.' },
]

const ATOUTS: { icone: Parameters<typeof SolarIcon>[0]['name']; titre: string; texte: string }[] = [
  { icone: 'devices-bold-duotone', titre: 'Tes cours hors connexion', texte: 'Télécharge ton programme une fois, puis révise sans réseau : cours, images et exercices. Inclus dès la formule Starter.' },
  { icone: 'magic-stick-3-bold-duotone', titre: 'Cognix IA dans la poche', texte: 'Pose tes questions et obtiens des explications pas à pas, où que tu sois.' },
  { icone: 'checklist-minimalistic-bold-duotone', titre: 'QCM et exercices corrigés', texte: 'Un QCM à la fin de chaque chapitre, et des exercices dont le corrigé s’ouvre après ta réponse.' },
  { icone: 'medal-star-bold-duotone', titre: 'XP, badges et défis', texte: 'De quoi garder le rythme, seul ou en comparant ta progression avec ta classe.' },
]

export default function TelechargerPage() {
  return (
    <main className={`${heading.variable} min-h-screen bg-background text-foreground`}>
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 lg:px-8">
          <Link href="/" aria-label="Cognix, accueil" className="flex items-center gap-2.5">
            <span className="flex size-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary via-secondary to-[#00B4D8] shadow-md shadow-primary/20">
              <SolarIcon name="bolt-bold-duotone" className="text-2xl text-accent" />
            </span>
            <span className="font-heading text-2xl font-extrabold tracking-tight text-primary">Cognix</span>
          </Link>
          <Link href="/register" className="rounded-2xl bg-primary px-4 py-2.5 text-sm font-bold text-white transition hover:bg-secondary">
            Créer un compte
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-4 py-14 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-accent/20 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-amber-900">
              Application Android
            </span>
            <h1 className="mt-4 font-heading text-3xl font-extrabold leading-tight text-primary sm:text-4xl">
              Cognix sur ton téléphone,<br />même sans connexion.
            </h1>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Installe l’application pour réviser partout : tes cours téléchargés restent lisibles quand le
              réseau manque, et tes réponses sont envoyées dès qu’il revient.
            </p>

            {APK_URL ? (
              <>
                <a
                  href={APK_URL}
                  className="mt-8 inline-flex items-center justify-center gap-2.5 rounded-2xl bg-accent px-7 py-4 font-heading text-base font-extrabold text-primary shadow-xl shadow-accent/25 transition hover:-translate-y-0.5 hover:bg-amber-400"
                >
                  <SolarIcon name="rocket-bold-duotone" className="text-xl" />
                  <span>Télécharger pour Android</span>
                </a>
                <p className="mt-3 text-xs text-muted-foreground">
                  Fichier .apk{APK_VERSION ? ` · version ${APK_VERSION}` : ''}{APK_TAILLE ? ` · ${APK_TAILLE}` : ''} · Android 7 ou plus récent
                </p>
              </>
            ) : (
              <div className="mt-8 rounded-3xl border border-border bg-card p-5 shadow-sm">
                <p className="font-heading text-sm font-bold text-primary">Le fichier d’installation arrive</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  La prochaine version de l’application Android est en préparation. En attendant, tout Cognix
                  fonctionne déjà dans le navigateur de ton téléphone, sans rien installer.
                </p>
                <Link
                  href="/register"
                  className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-bold text-white transition hover:bg-secondary"
                >
                  <span>Utiliser Cognix dans le navigateur</span>
                  <SolarIcon name="arrow-right-bold" className="text-accent" />
                </Link>
              </div>
            )}

            <div className="mt-6 flex flex-wrap gap-3 text-xs font-medium text-muted-foreground">
              <span className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-1.5">
                <SolarIcon name="shield-check-bold" className="text-base text-emerald-600" />
                Même compte que sur le site
              </span>
              <span className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-1.5">
                <SolarIcon name="devices-bold" className="text-base text-secondary" />
                iOS pas encore disponible
              </span>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {ATOUTS.map((a) => (
              <div key={a.titre} className="flex items-start gap-3 rounded-3xl border border-border bg-card p-4 shadow-sm">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-secondary">
                  <SolarIcon name={a.icone} className="text-xl" />
                </span>
                <span>
                  <span className="block font-heading text-sm font-bold text-primary">{a.titre}</span>
                  <span className="mt-0.5 block text-xs leading-5 text-muted-foreground">{a.texte}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-slate-100/70 px-4 py-14 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-heading text-2xl font-extrabold text-primary">Installer en quatre étapes</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ETAPES.map((e, i) => (
              <div key={e.titre} className="rounded-3xl border border-border bg-card p-5 shadow-sm">
                <span className="flex size-9 items-center justify-center rounded-2xl bg-primary font-heading text-sm font-extrabold text-white">
                  {i + 1}
                </span>
                <p className="mt-4 font-heading text-sm font-bold text-primary">{e.titre}</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">{e.texte}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-xs text-muted-foreground">
            Un souci pendant l’installation ? Écris à{' '}
            <a href="mailto:support@kelassi.app" className="font-semibold text-secondary hover:underline">support@kelassi.app</a>.
          </p>
        </div>
      </section>

      <footer className="px-4 py-10 text-center text-sm text-muted-foreground lg:px-8">
        <Link href="/" className="font-semibold text-primary hover:underline">Retour à l’accueil</Link>
      </footer>
    </main>
  )
}
