import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {
  AI_DAILY_LIMITS,
  PLAN_FEATURE_LINES,
  PLAN_META,
  SUBSCRIPTION_PLANS,
  TUTOR_CORRECTION_MONTHLY_LIMITS,
  annualSavings,
  formatFcfa,
  planPrice,
  type SubscriptionPlan,
} from '@alpha-kelassi/types'
import {
  Appear,
  NavDrop,
  NotificationStack,
  ProgressLine,
  StackCards,
} from '@/components/landing/gb-motion'
import { Logo, LogoMark } from '@/components/brand/logo'
import { MobileMenu } from '@/components/landing/mobile-menu'
import { PricingToggle } from '@/components/landing/pricing-toggle'
import { Phone, type ShotName } from '@/components/landing/screenshots'
import { SolarIcon, type SolarIconName } from '@/components/landing/solar-icon'
import { getCatalogueStats } from '@/components/landing/stats'


/** Chiffres du catalogue relus toutes les heures. */
export const revalidate = 3600

const DESCRIPTION =
  'L’application de révision des élèves du Congo, du CEPE au BAC : cours du programme, exercices corrigés, annales, simulations d’examen, Cognix IA et corrections par des tuteurs vérifiés.'

export const metadata: Metadata = {
  title: { absolute: 'Cognix — Révise mieux. Réussis du CEPE au BAC.' },
  description: DESCRIPTION,
  openGraph: {
    title: 'Cognix — Révise mieux. Réussis avec Cognix.',
    description: DESCRIPTION,
    locale: 'fr_CG',
    type: 'website',
    siteName: 'Cognix',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Cognix' }],
  },
  twitter: {
    card: 'summary',
    images: ['/og.png'],
    title: 'Cognix — Révise mieux. Réussis avec Cognix.',
    description: DESCRIPTION,
  },
}

const CONTACT_EMAIL = 'support@kelassi.app'

/* ── Contenus ──────────────────────────────────────────────────────────────── */

const NAV = [
  { href: '#fonctionnalites', label: 'Fonctionnalités' },
  { href: '#etapes', label: 'Comment ça marche' },
  { href: '#tarifs', label: 'Tarifs' },
  { href: '#faq', label: 'FAQ' },
]

const SERIES = ['CEPE', 'BEPC', 'BAC A', 'BAC C', 'BAC D', 'G2', 'G3', 'BG', 'R', 'E', 'F3', 'H']

const FEATURES: {
  title: string
  text: string
  shot: ShotName
  alt: string
  light?: boolean
  tilt?: boolean
}[] = [
  {
    title: 'Tout Le Programme, Leçon Par Leçon.',
    text: 'Chaque chapitre du programme officiel est découpé en leçons courtes, avec les théorèmes, les formules et des exemples. Ta progression avance à chaque leçon terminée.',
    shot: 'mobile-lecon-formules',
    alt: 'Une leçon sur la fonction logarithme népérien, avec théorème et formules',
    light: true,
  },
  {
    title: 'Un Tuteur IA Disponible 24h/24.',
    text: 'Quand tu bloques, Cognix t’explique pas à pas, avec des exemples, jusqu’à ce que ce soit clair. Une notion, un exercice, une méthode : pose ta question à toute heure.',
    shot: 'mobile-cognix',
    alt: 'L’écran Cognix IA, avec des questions suggérées par matière',
    light: true,
  },
  {
    title: 'Prépare-Toi Comme Le Jour J.',
    text: 'Bac test chronométré, Bac blanc noté sur 20, Bac rouge où chaque erreur coûte un point, anciens sujets et TD corrigés : tu arrives à l’examen en l’ayant déjà vécu.',
    shot: 'mobile-prepa',
    alt: 'L’onglet Prépa : Bac test, Bac blanc, Bac rouge, anciens sujets et TD',
    tilt: true,
  },
]

const DIFFERENCES: { title: string; text: string; art: 'scan' | 'shield' | 'chart' }[] = [
  {
    title: 'Correction Par Un Tuteur',
    text: 'Photographie ta copie : un tuteur vérifié par l’équipe Cognix te renvoie une correction détaillée.',
    art: 'scan',
  },
  {
    title: 'Espace Parent Sécurisé',
    text: 'Les parents suivent la progression et les résultats, jamais les messages privés de l’enfant.',
    art: 'shield',
  },
  {
    title: 'Progression Suivie',
    text: 'Chaque leçon, chaque QCM et chaque simulation nourrit ta courbe, matière par matière.',
    art: 'chart',
  },
]

const SUBJECTS: { name: string; img: string }[] = [
  { name: 'Mathématiques', img: '/subjects/mathematics.jpg' },
  { name: 'Physique-Chimie', img: '/subjects/sciences.jpg' },
  { name: 'SVT', img: '/subjects/life-sciences.jpg' },
  { name: 'Français', img: '/subjects/literature.jpg' },
  { name: 'Anglais', img: '/subjects/languages.jpg' },
  { name: 'Histoire-Géo', img: '/subjects/humanities.jpg' },
  { name: 'Économie', img: '/subjects/economics.jpg' },
  { name: 'Technologie', img: '/subjects/technology.jpg' },
  { name: 'Éducation civique', img: '/subjects/civics.jpg' },
  { name: 'Philosophie', img: '/subjects/general.jpg' },
  { name: 'EPS', img: '/subjects/sport.jpg' },
]

const AUDIENCES: {
  icon: SolarIconName
  label: string
  text: string
  who: string
  meta: string
  bg: string
}[] = [
  {
    icon: 'user-bold-duotone',
    label: 'Élèves',
    text: 'Des cours rédigés pour ton programme, des exercices corrigés, des simulations d’examen et un tuteur IA, sur ton téléphone. Tu révises à ton rythme et tu vois ta progression avancer.',
    who: 'Pour les élèves',
    meta: 'CEPE · BEPC · BAC',
    bg: 'bg-cx-paper',
  },
  {
    icon: 'shield-check-bold',
    label: 'Parents',
    text: 'Le parent relie son compte à celui de l’enfant avec un code et suit sa progression par matière, ses résultats et sa régularité, avec des alertes quand une matière décroche.',
    who: 'Pour les parents',
    meta: 'Suivi sans surveillance',
    bg: 'bg-cx-blue text-white',
  },
  {
    icon: 'presentation-graph-bold',
    label: 'Enseignants',
    text: 'Après validation du profil, un tableau de bord dédié pour suivre les progrès de ses élèves et proposer un soutien ciblé. Les écoles peuvent équiper toute une promotion.',
    who: 'Pour les écoles',
    meta: 'Enseignants et établissements',
    bg: 'bg-cx-sky',
  },
]

const FAQ: { q: string; a: string }[] = [
  {
    q: 'Cognix est-il vraiment gratuit ?',
    a: `Oui. La formule Gratuit est sans limite de durée et sans carte : le premier chapitre de chaque matière, une annale par matière et ${AI_DAILY_LIMITS.free} questions Cognix IA par jour.`,
  },
  {
    q: 'Comment payer mon abonnement ?',
    a: 'Par Mobile Money (MTN MoMo ou Airtel Money) via FeexPay, depuis la page Formules de ton compte. Ta formule est activée dès la confirmation du paiement.',
  },
  {
    q: 'Y a-t-il un prélèvement automatique ?',
    a: 'Non. Chaque abonnement couvre un mois ou un an payé d’avance. À l’échéance, tu choisis de renouveler ou non.',
  },
  {
    q: 'Quelles classes et quelles séries sont couvertes ?',
    a: 'Le CEPE, le BEPC, le BAC en séries générales (A, C, D) et techniques (G2, G3, BG, R, E, F3, H). Les contenus varient selon la classe et la série, et de nouveaux cours arrivent régulièrement.',
  },
  {
    q: 'Comment fonctionne la correction par un tuteur ?',
    a: `Tu photographies l’énoncé et ta copie, un tuteur vérifié te renvoie une correction détaillée. ${TUTOR_CORRECTION_MONTHLY_LIMITS.pro} corrections par mois avec Pro, ${TUTOR_CORRECTION_MONTHLY_LIMITS.pro_max} avec Pro Max.`,
  },
  {
    q: 'Que voient les parents ?',
    a: 'L’activité, les résultats et la progression de l’enfant, avec plus ou moins de détails selon sa formule. Jamais ses messages privés.',
  },
]

const PLAN_CTA: Record<SubscriptionPlan, { cta: string; href: string }> = {
  free: { cta: 'Commencer gratuitement', href: '/register' },
  starter: { cta: 'Choisir Starter', href: '/billing?plan=starter' },
  pro: { cta: 'Choisir Pro', href: '/billing?plan=pro' },
  pro_max: { cta: 'Choisir Pro Max', href: '/billing?plan=pro_max' },
}

/* ── Petits composants ─────────────────────────────────────────────────────── */

function Button({
  href,
  children,
  className = '',
}: {
  href: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <Link
      href={href}
      className={`btn-lift bg-cx-blue text-white inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-[15px] font-medium ${className}`}
    >
      {children}
    </Link>
  )
}

function AndroidIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true" fill="currentColor">
      <path d="M17.6 9.48l1.84-3.18a.38.38 0 0 0-.66-.38l-1.86 3.22a11.4 11.4 0 0 0-9.84 0L5.22 5.92a.38.38 0 0 0-.66.38L6.4 9.48A10.7 10.7 0 0 0 1 18h22a10.7 10.7 0 0 0-5.4-8.52ZM7 15.25a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5Zm10 0a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5Z" />
    </svg>
  )
}

/** Titre de section centré, avec un mot en menthe. */
function SectionHead({ before, accent, text }: { before: string; accent: string; text: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <Appear y={30}>
        <h2 className="text-cx-navy text-4xl font-semibold leading-tight sm:text-[46px]">
          {before} <span className="text-cx-blue">{accent}</span>
        </h2>
      </Appear>
      <Appear delay={0.1}>
        <p className="text-cx-navy/90 mt-5 text-lg leading-relaxed">{text}</p>
      </Appear>
    </div>
  )
}

function DifferenceArt({ art }: { art: 'scan' | 'shield' | 'chart' }) {
  if (art === 'scan')
    return (
      <div className="relative h-[150px] w-[150px] overflow-hidden rounded-2xl bg-white p-4 shadow-sm">
        <div className="space-y-2.5">
          <div className="bg-cx-navy/80 h-2 w-1/2 rounded" />
          {[90, 75, 85, 60, 80, 70].map((w, i) => (
            <div key={i} className="bg-cx-navy/15 h-1.5 rounded" style={{ width: `${w}%` }} />
          ))}
          <div className="text-cx-navy/70 pt-1 font-serif text-[13px] italic">ln a + ln b = ln ab</div>
        </div>
        <span className="gb-scan bg-cx-blue absolute inset-x-3 top-5 h-[3px] rounded-full shadow-[0_0_12px_#1E74E8]" />
      </div>
    )
  if (art === 'shield')
    return (
      <div className="flex size-[150px] items-center justify-center rounded-full bg-white shadow-sm">
        <SolarIcon name="shield-check-bold" className="text-[72px] text-cx-blue" />
      </div>
    )
  return (
    <div className="h-[150px] w-[85%] rounded-2xl bg-white p-4 shadow-sm">
      <ProgressLine />
    </div>
  )
}

/** Prix d'une formule : montant seul, l'unité étant affichée à part. */
const amount = (value: number) => formatFcfa(value).replace(/\s*FCFA$/, '')

/* ── Page ──────────────────────────────────────────────────────────────────── */

export default async function LandingPage() {
  const stats = await getCatalogueStats()
  const monthsOffered = Math.round(annualSavings('starter') / planPrice('starter', 'month'))
  const lessons = stats.lessons.toLocaleString('fr-FR')

  return (
    <div
      className={`font-display text-cx-navy selection:bg-cx-blue selection:text-white min-h-screen overflow-x-clip bg-white antialiased`}
    >
      {/* Le contenu glisse au-dessus du pied de page, révélé en fin de défilement. */}
      <div className="relative z-10 rounded-b-[60px] bg-white sm:rounded-b-[80px]">
        {/* ── Navigation ── */}
        <NavDrop className="fixed inset-x-0 top-0 z-50">
          <div className="bg-white/80 backdrop-blur-md">
            <nav
              className="mx-auto flex max-w-[1280px] items-center justify-between px-5 py-3.5 lg:px-20"
              aria-label="Navigation principale"
            >
              <Link href="/" aria-label="Cognix, accueil">
                <Logo />
              </Link>
              <div className="hidden items-center gap-4 text-[15px] font-medium md:flex">
                {NAV.map((item) => (
                  <a key={item.href} href={item.href} className="hover:text-cx-navy/70 px-1 transition-colors">
                    {item.label}
                  </a>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="hidden px-3 text-[15px] font-medium transition-colors hover:opacity-70 sm:block"
                >
                  Se connecter
                </Link>
                <Button href="/register" className="hidden !py-2.5 sm:inline-flex">
                  Commencer gratuitement
                </Button>
                <div className="md:hidden">
                  <MobileMenu icon={<SolarIcon name="hamburger-menu-linear" className="text-xl" />}>
                    <div className="mx-auto flex max-w-7xl flex-col gap-1 text-[15px] font-medium">
                      {NAV.map((item) => (
                        <a key={item.href} href={item.href} className="hover:bg-cx-sky rounded-xl px-3 py-2.5">
                          {item.label}
                        </a>
                      ))}
                      <div className="border-cx-navy/10 mt-2 grid grid-cols-2 gap-2 border-t pt-3">
                        <Link href="/login" className="border-cx-navy/20 rounded-full border px-3 py-2.5 text-center">
                          Se connecter
                        </Link>
                        <Link href="/register" className="bg-cx-blue rounded-full px-3 py-2.5 text-center text-white">
                          Créer un compte
                        </Link>
                      </div>
                    </div>
                  </MobileMenu>
                </div>
              </div>
            </nav>
          </div>
        </NavDrop>

        <main id="top">
          {/* ── Hero ── */}
          <section className="from-cx-paper via-cx-paper relative to-[#BFD9FB] overflow-hidden rounded-b-[50px] bg-gradient-to-b via-40% px-5 pt-28 lg:rounded-b-[80px] lg:px-20 lg:pt-36">
            <div className="mx-auto grid max-w-[1120px] items-start gap-12 lg:grid-cols-[1fr_400px] lg:gap-8">
              <div className="pb-4 lg:pb-32 lg:pt-4">
                <Appear onLoad delay={0.1}>
                  <a
                    href="#fonctionnalites"
                    className="bg-cx-paper inline-flex items-center gap-3 rounded-full border border-[#f1ecd2] p-1 pr-4 text-[15px] font-medium shadow-sm"
                  >
                    <span className="rounded-full bg-white px-4 py-1.5">Nouveau</span>
                    Cognix IA, ton tuteur 24h/24
                    <SolarIcon name="arrow-right-linear" className="text-lg" />
                  </a>
                </Appear>
                <Appear onLoad delay={0.2}>
                  <h1 className="mt-6 text-[40px] font-semibold leading-[1.25] sm:text-[56px] sm:leading-[1.3]">
                    Révise Mieux, <span className="text-cx-blue">Réussis</span>
                    <br className="hidden sm:block" /> Du CEPE Au BAC.
                  </h1>
                </Appear>
                <Appear onLoad delay={0.3}>
                  <p className="mt-4 max-w-[560px] text-lg font-medium leading-relaxed">
                    Les cours du programme officiel, des exercices corrigés, des simulations
                    d’examen et un tuteur IA. Tout pour réussir, dans ton téléphone.
                  </p>
                </Appear>
                <Appear onLoad delay={0.4}>
                  <Button href="/telecharger" className="mt-8">
                    <AndroidIcon />
                    Télécharger l’app
                  </Button>
                </Appear>
                <Appear onLoad delay={0.5}>
                  <div className="mt-8 flex items-center gap-4">
                    <div className="flex -space-x-3">
                      {SUBJECTS.slice(0, 3).map((s) => (
                        <span key={s.name} className="relative size-11 overflow-hidden rounded-full border-2 border-white">
                          <Image src={s.img} alt="" fill sizes="44px" className="object-cover" />
                        </span>
                      ))}
                    </div>
                    <p className="text-lg font-medium">{lessons} leçons rédigées</p>
                  </div>
                </Appear>
              </div>
              <Appear onLoad delay={0.3} y={60} className="relative mx-auto -mb-28 w-[300px] sm:w-[360px] lg:-mb-40 lg:w-[400px]">
                <Phone
                  name="mobile-accueil"
                  alt="L’écran d’accueil de l’application Cognix"
                  priority
                  statusLight
                  sizes="400px"
                />
              </Appear>
            </div>
          </section>

          {/* ── Séries couvertes (défilé) ── */}
          <section className="mx-auto flex max-w-[1280px] flex-col items-center gap-8 px-5 py-16 lg:flex-row lg:px-20">
            <Appear className="shrink-0 lg:w-[340px]">
              <p className="text-center text-[15px] font-medium uppercase leading-snug tracking-wide lg:text-left">
                Le programme officiel de {SERIES.length} examens et séries du Congo.
              </p>
            </Appear>
            <div className="gb-fade-x relative w-full overflow-hidden">
              <div className="gb-marquee flex w-max gap-14">
                {[...SERIES, ...SERIES].map((s, i) => (
                  <span key={i} className="text-cx-navy/90 whitespace-nowrap text-3xl font-bold tracking-tight">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* ── Fonctionnalités : cartes empilées ── */}
          <section id="fonctionnalites" className="scroll-mt-10 px-5 pt-10 lg:px-20">
            <SectionHead
              before="Découvre Ce Que Cognix"
              accent="T’offre"
              text="Tout ce qu’il faut pour apprendre, s’entraîner et arriver prêt le jour de l’examen."
            />
            <div className="mx-auto mt-6 max-w-[1120px] pb-24">
              <StackCards
                className="bg-cx-sky ring-cx-navy/[0.06] relative grid min-h-[476px] items-center overflow-visible rounded-[40px] px-8 py-10 shadow-[0_-28px_60px_-30px_rgba(15,27,45,0.28)] ring-1 md:grid-cols-[1fr_300px] md:px-12"
                items={FEATURES.map((f) => ({
                  content: (
                    <div className="max-w-[440px]">
                      <h3 className="text-[28px] font-semibold leading-tight sm:text-[32px]">
                        {f.title}
                      </h3>
                      <p className="mt-4 text-[16px] leading-relaxed">{f.text}</p>
                    </div>
                  ),
                  phone: (
                    <div
                      className={`mx-auto mt-8 w-[210px] md:absolute md:-top-[96px] md:right-20 md:mt-0 md:w-[220px] ${f.tilt ? 'md:rotate-[8deg]' : ''}`}
                    >
                      <Phone name={f.shot} alt={f.alt} statusLight={!f.light} sizes="220px" />
                    </div>
                  ),
                }))}
              />
            </div>
          </section>

          {/* ── 3 étapes ── */}
          <section id="etapes" className="bg-cx-blue scroll-mt-10 px-5 py-20 text-white lg:px-20">
            <div className="mx-auto grid max-w-[1120px] gap-12 lg:grid-cols-[1fr_640px]">
              <div className="lg:sticky lg:top-[120px] lg:h-fit">
                <Appear y={30}>
                  <h2 className="text-4xl font-semibold leading-tight sm:text-[46px]">
                    Commence En Seulement
                    <br />
                    <span className="text-cx-navy">3 Étapes Simples.</span>
                  </h2>
                </Appear>
                <Appear delay={0.1}>
                  <p className="mt-6 max-w-sm text-lg leading-relaxed">
                    En moins de deux minutes, ton espace est prêt et tu peux réviser.
                  </p>
                </Appear>
              </div>
              <div className="space-y-7">
                {/* Étape 1 */}
                <Appear className="bg-cx-paper text-cx-navy rounded-[40px] p-8">
                  <span className="bg-cx-blue rounded-full px-3.5 py-1 text-sm font-medium text-white">Étape 1</span>
                  <h3 className="mt-5 text-[28px] font-semibold">Crée Ton Compte</h3>
                  <p className="mt-3 text-lg leading-relaxed">
                    Inscris-toi gratuitement depuis l’app ou le site, sans carte bancaire.
                  </p>
                  <Appear delay={0.15} className="mx-auto mt-8 w-[230px] rounded-2xl bg-white p-4 shadow-[0_10px_40px_rgba(15,27,45,0.12)]">
                    <LogoMark className="size-7 text-base" />
                    <p className="mt-3 text-sm font-semibold">Créer un compte</p>
                    <p className="text-cx-navy/60 text-[11px]">Quelques infos et c’est parti.</p>
                    <div className="border-cx-navy/15 text-cx-navy/40 mt-3 rounded-md border px-2.5 py-2 text-[11px]">
                      Ton e-mail
                    </div>
                    <div className="bg-cx-blue text-white mt-2 rounded-md py-2 text-center text-[11px] font-semibold">
                      Commencer
                    </div>
                  </Appear>
                </Appear>
                {/* Étape 2 */}
                <Appear className="bg-cx-paper text-cx-navy rounded-[40px] p-8">
                  <span className="bg-cx-blue rounded-full px-3.5 py-1 text-sm font-medium text-white">Étape 2</span>
                  <h3 className="mt-5 text-[28px] font-semibold">Choisis Ta Classe</h3>
                  <p className="mt-3 text-lg leading-relaxed">
                    CEPE, BEPC ou BAC, série générale ou technique : Cognix prépare ton parcours.
                  </p>
                  <div className="relative mx-auto mt-8 flex h-[150px] max-w-[340px] items-center justify-between">
                    <div
                      aria-hidden="true"
                      className="absolute inset-x-16 inset-y-0 bg-[linear-gradient(#0047371a_1px,transparent_1px),linear-gradient(90deg,#0047371a_1px,transparent_1px)] bg-[size:18px_18px] [mask-image:radial-gradient(circle,#000_40%,transparent_75%)]"
                    />
                    {['BAC C', null].map((label, i) => (
                      <div key={i} className="relative size-[86px]">
                        <span className="gb-pulse bg-cx-blue/40 absolute left-1/2 top-1/2 size-[100px] rounded-3xl" />
                        <div className="relative flex size-full items-center justify-center rounded-3xl bg-white shadow-sm">
                          {label ? (
                            <span className="text-lg font-bold">{label}</span>
                          ) : (
                            <LogoMark className="size-12 text-3xl" />
                          )}
                        </div>
                      </div>
                    ))}
                    <span className="gb-travel bg-cx-blue text-white absolute left-1/2 top-1/2 -ml-4 -mt-4 flex size-8 items-center justify-center rounded-full text-xs font-bold shadow">
                      ✓
                    </span>
                  </div>
                </Appear>
                {/* Étape 3 */}
                <Appear className="bg-cx-paper text-cx-navy rounded-[40px] p-8">
                  <span className="bg-cx-blue rounded-full px-3.5 py-1 text-sm font-medium text-white">Étape 3</span>
                  <h3 className="mt-5 text-[28px] font-semibold">Révise Et Progresse</h3>
                  <p className="mt-3 text-lg leading-relaxed">
                    Lis tes leçons, fais tes QCM, passe des simulations et regarde ta progression
                    avancer.
                  </p>
                  <div className="mt-6">
                    <NotificationStack
                      items={[
                        { title: 'Leçon terminée', meta: 'Logarithme népérien', value: '+20 XP', tone: 'good' },
                        { title: 'QCM réussi', meta: 'Suites numériques', value: '8/10', tone: 'good' },
                        { title: 'Bac blanc corrigé', meta: 'SVT · Terminale D', value: '14/20', tone: 'gold' },
                      ]}
                    />
                  </div>
                </Appear>
              </div>
            </div>
          </section>

          {/* ── La différence ── */}
          <section className="px-5 py-24 lg:px-20">
            <SectionHead
              before="La Différence"
              accent="Cognix"
              text="Plus qu’une appli de cours : un accompagnement complet, pour l’élève comme pour sa famille."
            />
            <div className="mx-auto mt-14 grid max-w-[1120px] gap-5 md:grid-cols-3">
              {DIFFERENCES.map((d, i) => (
                <Appear key={d.title} delay={i * 0.08} className="card-lift border-cx-blue/60 overflow-hidden rounded-[40px] border">
                  <div className="bg-cx-sky flex h-[190px] items-center justify-center">
                    <DifferenceArt art={d.art} />
                  </div>
                  <div className="p-7">
                    <h3 className="text-[22px] font-semibold">{d.title}</h3>
                    <p className="mt-3 leading-relaxed">{d.text}</p>
                  </div>
                </Appear>
              ))}
            </div>
          </section>

          {/* ── Matières (fond forêt, défilés verticaux) ── */}
          <section className="bg-cx-navy overflow-hidden px-5 text-white lg:px-20">
            <div className="mx-auto grid max-w-[1120px] items-center gap-10 py-16 lg:grid-cols-[1fr_560px] lg:py-0">
              <div className="lg:py-24">
                <Appear y={30}>
                  <h2 className="text-4xl font-semibold leading-tight sm:text-[46px]">
                    Toutes Les Matières
                    <br />
                    <span className="text-cx-cyan">Du Programme.</span>
                  </h2>
                </Appear>
                <Appear delay={0.1}>
                  <p className="mt-6 max-w-md text-lg leading-relaxed text-white/90">
                    {lessons} leçons et {stats.chapters.toLocaleString('fr-FR')} chapitres,
                    rédigés pour les élèves du Congo, et de nouveaux cours chaque semaine.
                  </p>
                </Appear>
              </div>
              <div className="gb-fade-y grid h-[380px] grid-cols-3 gap-4 overflow-hidden lg:h-[460px]">
                {[0, 1, 2].map((col) => {
                  const list = SUBJECTS.filter((_, i) => i % 3 === col)
                  return (
                    <div key={col} className={col === 1 ? 'gb-ticker-down' : 'gb-ticker-up'}>
                      {[...list, ...list, ...list, ...list].map((s, i) => (
                        <div key={i} className="mb-4 overflow-hidden rounded-2xl bg-white/10">
                          <div className="relative h-[84px]">
                            <Image src={s.img} alt="" fill sizes="180px" className="object-cover" />
                          </div>
                          <p className="px-3 py-2 text-sm font-semibold">{s.name}</p>
                        </div>
                      ))}
                    </div>
                  )
                })}
              </div>
            </div>
          </section>

          {/* ── Pour qui ── */}
          <section className="px-5 py-24 lg:px-20">
            <SectionHead
              before="Pensé Pour"
              accent="Chacun"
              text="Les élèves révisent, les parents suivent, les enseignants accompagnent."
            />
            <div className="mx-auto mt-14 grid max-w-[1120px] gap-4 md:grid-cols-3">
              {AUDIENCES.map((a, i) => (
                <Appear key={a.label} delay={i * 0.08} className={`card-lift flex flex-col rounded-[40px] p-7 ${a.bg}`}>
                  <p className="flex items-center gap-2 text-xl font-bold">
                    <SolarIcon name={a.icon} className="text-2xl" />
                    {a.label}
                  </p>
                  <p className="mt-8 flex-1 text-[15px] leading-relaxed">{a.text}</p>
                  <p className="mt-10 text-[26px] font-semibold uppercase leading-tight">{a.who}</p>
                  <p className="mt-2 text-xs font-medium uppercase tracking-[0.15em]">{a.meta}</p>
                </Appear>
              ))}
            </div>
          </section>

          {/* ── Tarifs ── */}
          <section id="tarifs" className="bg-cx-paper scroll-mt-10 px-5 py-24 lg:px-20">
            <SectionHead
              before="Des Formules"
              accent="Pour Tous"
              text="Commence gratuitement, sans carte. Passe à une formule payante par Mobile Money, seulement si tu en as besoin."
            />
            <PricingToggle savingsLabel={`-${monthsOffered} mois offerts`}>
              <div className="mx-auto mt-12 grid max-w-[1120px] gap-4 md:grid-cols-2 xl:grid-cols-4">
                {SUBSCRIPTION_PLANS.map((plan, i) => {
                  const featured = plan === 'pro'
                  const [first, ...rest] = PLAN_FEATURE_LINES[plan]
                  const inherits = plan === 'pro' || plan === 'pro_max'
                  const lines = (inherits ? rest : PLAN_FEATURE_LINES[plan]).slice(0, 6)
                  return (
                    <Appear key={plan} delay={i * 0.06} className={`card-lift flex flex-col rounded-[40px] p-7 ${featured ? 'bg-cx-navy text-white' : 'bg-white'}`}>
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold">{PLAN_META[plan].label}</h3>
                        {featured && (
                          <span className="bg-cx-cyan text-cx-navy rounded-full px-3 py-0.5 text-xs font-semibold">
                            {PLAN_META.pro.highlight}
                          </span>
                        )}
                      </div>
                      <div className="mt-5 grid min-h-[64px]">
                        {plan === 'free' ? (
                          <p className="whitespace-nowrap text-[32px] font-bold">
                            0 <span className="text-base font-medium opacity-60">FCFA</span>
                          </p>
                        ) : (
                          <>
                            <p className="price-swap whitespace-nowrap text-[32px] font-bold [grid-area:1/1] group-data-[interval=year]:invisible group-data-[interval=year]:opacity-0">
                              {amount(planPrice(plan, 'month'))}{' '}
                              <span className="text-base font-medium opacity-60">FCFA/mois</span>
                            </p>
                            <p className="price-swap invisible text-4xl font-bold opacity-0 [grid-area:1/1] group-data-[interval=year]:visible group-data-[interval=year]:opacity-100">
                              {amount(planPrice(plan, 'year'))}{' '}
                              <span className="text-base font-medium opacity-60">FCFA/an</span>
                            </p>
                          </>
                        )}
                      </div>
                      <ul className={`mt-4 flex-1 space-y-2.5 border-t pt-5 text-[14px] ${featured ? 'border-white/15' : 'border-cx-navy/10'}`}>
                        {inherits && (
                          <li className="font-semibold">
                            {first === 'Tout Starter' ? 'Tout Starter, plus :' : 'Tout Pro, plus :'}
                          </li>
                        )}
                        {lines.map((l) => (
                          <li key={l} className="flex gap-2">
                            <span className={featured ? 'text-cx-cyan' : 'text-cx-blue'}>✓</span>
                            {l}
                          </li>
                        ))}
                      </ul>
                      <Link
                        href={PLAN_CTA[plan].href}
                        className={`btn-lift mt-7 rounded-full py-3 text-center text-[15px] font-medium ${featured ? 'bg-cx-blue text-white' : 'border-cx-navy/20 hover:bg-cx-sky border'}`}
                      >
                        {PLAN_CTA[plan].cta}
                      </Link>
                    </Appear>
                  )
                })}
              </div>
            </PricingToggle>
          </section>

          {/* ── FAQ ── */}
          <section id="faq" className="scroll-mt-10 px-5 py-24 lg:px-20">
            <div className="mx-auto grid max-w-[1120px] gap-10 lg:grid-cols-[1fr_620px]">
              <div>
                <Appear y={30}>
                  <h2 className="text-4xl font-semibold leading-tight sm:text-[46px]">
                    Réponses À Tes
                    <br />
                    <span className="text-cx-blue">Questions</span>
                  </h2>
                </Appear>
                <Appear delay={0.1}>
                  <p className="mt-5 max-w-sm text-lg leading-relaxed">
                    Tout ce qu’il faut savoir sur Cognix, ses formules et son fonctionnement.
                  </p>
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="btn-lift bg-cx-blue mt-6 inline-flex rounded-full text-white px-6 py-3 text-[15px] font-medium"
                  >
                    Nous contacter
                  </a>
                </Appear>
              </div>
              <div className="space-y-3">
                {FAQ.map((item, i) => (
                  <Appear key={item.q} delay={i * 0.05}>
                    <details className="group rounded-xl border border-[#e3e3e3] bg-white px-5 py-4">
                      <summary className="flex cursor-pointer list-none items-start gap-4 text-[17px] font-medium [&::-webkit-details-marker]:hidden">
                        <svg viewBox="0 0 24 24" className="mt-1 size-4 shrink-0 transition-transform duration-300 group-open:rotate-45" aria-hidden="true">
                          <path d="M12 4v16M4 12h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        {item.q}
                      </summary>
                      <p className="text-cx-navy/85 mt-3 pl-8 leading-relaxed">{item.a}</p>
                    </details>
                  </Appear>
                ))}
              </div>
            </div>
          </section>

          {/* ── Défilé final ── */}
          <section className="gb-fade-x overflow-hidden py-20">
            <Link href="/telecharger" className="gb-marquee-slow text-cx-blue flex w-max items-center gap-12 text-6xl font-semibold sm:text-[88px]">
              {Array.from({ length: 6 }).map((_, i) => (
                <span key={i} className="flex items-center gap-12 whitespace-nowrap">
                  Télécharge L’app Cognix
                  <span className="bg-cx-blue size-4 rounded-full" />
                </span>
              ))}
            </Link>
          </section>
        </main>
      </div>

      {/* ── Pied de page révélé ── */}
      <footer className="bg-cx-sky sticky bottom-0 z-0 -mt-20 px-5 pb-8 pt-36 lg:px-20">
        <div className="mx-auto max-w-[1120px]">
          <div className="flex flex-col justify-between gap-10 md:flex-row md:items-start">
            <Logo />
            <div className="max-w-[420px]">
              <p className="text-2xl font-medium leading-snug">
                Accompagner chaque élève du Congo, du CEPE au BAC.
              </p>
              <Button href="/register" className="mt-6">
                Commencer gratuitement
              </Button>
            </div>
          </div>
          <div className="border-cx-navy/10 mt-16 flex flex-col gap-4 border-t pt-6 text-sm md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <Link href="/cours" className="hover:underline">
                Catalogue des cours
              </Link>
              <Link href="/cgu" className="hover:underline">
                Conditions d’utilisation
              </Link>
              <Link href="/confidentialite" className="hover:underline">
                Confidentialité
              </Link>
              <a href={`mailto:${CONTACT_EMAIL}`} className="hover:underline">
                {CONTACT_EMAIL}
              </a>
            </div>
            <p className="text-cx-navy/70">© {new Date().getFullYear()} Cognix — Alpha Kelassi.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
