import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import Image from 'next/image'
import Link from 'next/link'
import {
  AI_DAILY_LIMITS,
  FEATURE_REQUIRED_PLANS,
  PLAN_FEATURE_LINES,
  PLAN_META,
  SUBSCRIPTION_PLANS,
  TUTOR_CORRECTION_MONTHLY_LIMITS,
  annualSavings,
  formatFcfa,
  planPrice,
  type SubscriptionPlan,
} from '@alpha-kelassi/types'
import { MobileMenu } from '@/components/landing/mobile-menu'
import { PricingToggle } from '@/components/landing/pricing-toggle'
import { SolarIcon, type SolarIconName } from '@/components/landing/solar-icon'

const heading = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-heading',
  display: 'swap',
})

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
  { href: '#cognix-ia', label: 'Cognix IA', badge: 'Nouveau' },
  { href: '#simulations', label: 'Simulations' },
  { href: '#parents', label: 'Pour les parents' },
  { href: '#tarifs', label: 'Tarifs' },
  { href: '#faq', label: 'FAQ' },
]

const STATS: { icon: SolarIconName; box: string; tint: string; title: string; text: string }[] = [
  { icon: 'diploma-bold-duotone', box: 'bg-primary/10', tint: 'text-secondary', title: 'Du CEPE au BAC', text: 'Tous cycles scolaires' },
  { icon: 'notebook-bold-duotone', box: 'bg-accent/20', tint: 'text-amber-700', title: 'Séries A, C, D & Techniques', text: 'Générales et spécialisées' },
  { icon: 'map-point-wave-bold-duotone', box: 'bg-emerald-100', tint: 'text-emerald-600', title: 'Programme officiel', text: 'Adapté au Congo' },
  { icon: 'devices-bold-duotone', box: 'bg-cyan-100', tint: 'text-[#00B4D8]', title: 'Multi-supports', text: 'Mobile et ordinateur' },
]

const BEFORE = [
  ['Recherches dispersées', 'Cahiers incomplets, photocopies perdues et groupes WhatsApp confus.'],
  ['Documents difficiles à retrouver', 'Impossibilité de mettre la main sur les bonnes annales officielles corrigées.'],
  ['Révisions sans plan structuré', 'Stress intense à l’approche des épreuves sans savoir par où commencer.'],
  ['Erreurs non expliquées & blocages', 'Personne à qui poser ses questions tard le soir quand on bloque sur un exercice.'],
]

const AFTER = [
  ['Parcours personnalisé', 'Un programme adapté à ta classe (CEPE, BEPC, BAC A, C, D ou technique).'],
  ['Contenus organisés au même endroit', 'Cours, résumés, fiches formules et annales complètes accessibles en 1 clic.'],
  ['Entraînement progressif & simulations', 'QCM, Bac test, Bac blanc et Bac rouge pour être prêt dans les conditions réelles.'],
  ['Suivi & aide instantanée 24h/24', 'Cognix IA t’explique pas à pas et des tuteurs vérifiés corrigent tes devoirs.'],
]

const FEATURES: { icon: SolarIconName; box: string; hover: string; title: string; text: string; highlight?: string }[] = [
  { icon: 'book-bookmark-bold-duotone', box: 'bg-blue-50 text-secondary', hover: 'group-hover:bg-primary group-hover:text-accent', title: 'Cours du programme', text: 'Retrouve tes cours, résumés, fiches, schémas, tableaux et formules organisés par classe, série, matière et chapitre.' },
  { icon: 'checklist-minimalistic-bold-duotone', box: 'bg-amber-50 text-amber-600', hover: 'group-hover:bg-accent group-hover:text-primary', title: 'Exercices et QCM', text: 'Entraîne-toi avec des exercices corrigés et des QCM accompagnés d’explications détaillées pour comprendre tes erreurs.' },
  { icon: 'documents-bold-duotone', box: 'bg-emerald-50 text-emerald-600', hover: 'group-hover:bg-emerald-600 group-hover:text-white', title: 'Annales d’examens', text: 'Accède aux sujets des examens précédents et prépare-toi avec des documents officiels adaptés à ton niveau.' },
  { icon: 'stopwatch-play-bold-duotone', box: 'bg-purple-50 text-purple-600', hover: 'group-hover:bg-purple-600 group-hover:text-white', title: 'Simulations d’examen', text: 'Entraîne-toi librement ou retrouve les conditions du vrai examen avec le Bac test, le Bac blanc et le Bac rouge.' },
  { icon: 'magic-stick-3-bold-duotone', box: 'bg-cyan-100 text-cyan-700', hover: 'group-hover:bg-[#00B4D8] group-hover:text-white', title: 'Cognix IA', text: 'Pose tes questions à ton tuteur virtuel et obtiens des explications claires et pédagogiques en temps réel.', highlight: 'Tuteur 24h/24' },
  { icon: 'user-check-bold-duotone', box: 'bg-rose-50 text-rose-600', hover: 'group-hover:bg-rose-600 group-hover:text-white', title: 'Correction par un tuteur', text: 'Envoie une photo de ton énoncé et de ta copie manuscrite pour recevoir une correction réalisée par un tuteur vérifié.' },
  { icon: 'calendar-mark-bold-duotone', box: 'bg-indigo-50 text-indigo-600', hover: 'group-hover:bg-indigo-600 group-hover:text-white', title: 'Planning de révision', text: 'Organise tes révisions à partir de la date de ton examen et avance avec un programme adapté et des rappels.' },
  { icon: 'card-2-bold-duotone', box: 'bg-teal-50 text-teal-600', hover: 'group-hover:bg-teal-600 group-hover:text-white', title: 'Flashcards intelligentes', text: 'Mémorise plus efficacement grâce à la répétition espacée et révise les notions au moment optimal.' },
  { icon: 'medal-star-bold-duotone', box: 'bg-yellow-50 text-yellow-600', hover: 'group-hover:bg-amber-500 group-hover:text-white', title: 'Progression & Motivation', text: 'Gagne des XP, débloque des badges, relève des défis et compare ta progression avec les élèves de ta classe.' },
]

const AI_BENEFITS: { icon: SolarIconName; box: string; title: string; text: string }[] = [
  { icon: 'user-hands-bold', box: 'bg-cyan-100 text-cyan-700', title: 'Explications adaptées à ton niveau', text: 'L’IA vulgarise les concepts complexes selon ta filière et ton rythme d’apprentissage.' },
  { icon: 'bolt-circle-bold', box: 'bg-accent/20 text-amber-800', title: 'Réponses instantanées en temps réel', text: 'Pas besoin d’attendre le cours du lendemain pour débloquer ton devoir.' },
  { icon: 'clock-circle-bold', box: 'bg-emerald-100 text-emerald-700', title: 'Aide disponible à toute heure', text: 'Tard le soir ou tôt le matin, ton tuteur Cognix reste disponible 24h/24 et 7j/7.' },
]

/** Formule minimale d'un mode d'examen, lue dans les règles d'abonnement partagées. */
const fromPlan = (feature: keyof typeof FEATURE_REQUIRED_PLANS) => `${PLAN_META[FEATURE_REQUIRED_PLANS[feature]].label} & +`

const PARENT_ITEMS: { icon: SolarIconName; tint: string; label: string }[] = [
  { icon: 'chart-square-bold-duotone', tint: 'text-secondary', label: 'Progression par matière' },
  { icon: 'diploma-verified-bold-duotone', tint: 'text-emerald-600', label: 'Résultats aux exercices et QCM' },
  { icon: 'history-bold-duotone', tint: 'text-[#00B4D8]', label: 'Activité de révision de la semaine' },
  { icon: 'calendar-bold-duotone', tint: 'text-purple-600', label: 'Régularité & assiduité' },
  { icon: 'bell-bing-bold-duotone', tint: 'text-amber-600', label: 'Réglages parentaux' },
  { icon: 'document-text-bold-duotone', tint: 'text-rose-600', label: 'Rapports de progression' },
]

const AUDIENCES: { icon: SolarIconName; box: string; foot: string; title: string; text: string; tag: string }[] = [
  { icon: 'user-bold-duotone', box: 'bg-blue-50 text-secondary', foot: 'text-secondary', title: 'Pour les élèves', text: 'Des ressources complètes et un accompagnement pédagogique adaptés à chaque classe et série scolaire pour progresser sans stress.', tag: 'Autonomie & progression' },
  { icon: 'presentation-graph-bold', box: 'bg-emerald-50 text-emerald-600', foot: 'text-emerald-700', title: 'Pour les enseignants', text: 'Un tableau de bord dédié pour suivre les progrès des élèves après validation du profil et proposer un soutien ciblé.', tag: 'Profil vérifié par l’équipe' },
  { icon: 'buildings-bold-duotone', box: 'bg-purple-50 text-purple-600', foot: 'text-purple-700', title: 'Pour les écoles', text: 'Une solution numérique pour structurer la préparation aux examens, équiper vos promotions et valoriser les taux d’admission.', tag: 'Déploiement institutionnel' },
]

const STEPS: { n: string; badge: string; icon: SolarIconName; tint: string; title: string; text: string }[] = [
  { n: '01', badge: 'bg-primary text-white shadow-primary/30', icon: 'user-plus-bold-duotone', tint: 'text-secondary', title: 'Crée ton compte', text: 'Inscris-toi gratuitement depuis l’application mobile ou le site web en quelques clics.' },
  { n: '02', badge: 'bg-secondary text-white shadow-secondary/30', icon: 'tuning-square-2-bold-duotone', tint: 'text-amber-500', title: 'Choisis ton parcours', text: 'Sélectionne ta classe et ton examen (CEPE, BEPC, BAC), en série générale ou technique.' },
  { n: '03', badge: 'bg-accent text-primary shadow-accent/30', icon: 'cup-star-bold-duotone', tint: 'text-emerald-600', title: 'Apprends et progresse', text: 'Consulte tes cours, entraîne-toi avec des QCM, pose tes questions à l’IA et suis tes résultats en temps réel.' },
]

const TECH_SERIES = ['G2', 'G3', 'BG', 'R', 'E', 'F3', 'H']

type PlanCard = {
  chip: string
  chipClass: string
  pitch: string
  cta: string
  href: string
  card: string
  check: string
  button: string
  annualTint: string
  ribbon?: string
}

const PLAN_CARDS: Record<SubscriptionPlan, PlanCard> = {
  free: {
    chip: 'Découverte', chipClass: 'bg-slate-100 text-slate-600',
    pitch: 'Pour découvrir Cognix et commencer à réviser en toute liberté.',
    cta: 'Commencer gratuitement', href: '/register',
    card: 'border border-border bg-card shadow-sm hover:shadow-xl hover:border-slate-300',
    check: 'text-emerald-500', annualTint: 'text-secondary',
    button: 'border border-primary bg-transparent text-primary hover:bg-primary hover:text-white',
  },
  starter: {
    chip: 'Essentiel', chipClass: 'bg-blue-50 text-secondary',
    pitch: 'Pour réviser en autonomie avec tous les contenus essentiels.',
    cta: 'Choisir Starter', href: '/billing?plan=starter',
    card: 'border border-border bg-card shadow-sm hover:shadow-xl hover:border-secondary',
    check: 'text-emerald-500', annualTint: 'text-secondary',
    button: 'border border-secondary bg-secondary/5 text-secondary hover:bg-secondary hover:text-white',
  },
  pro: {
    chip: 'Recommandé', chipClass: 'bg-accent/20 text-amber-900',
    pitch: 'Pour se préparer sérieusement aux examens avec un accompagnement renforcé.',
    cta: 'Choisir Pro', href: '/billing?plan=pro',
    card: 'border-2 border-primary bg-gradient-to-b from-primary/[0.03] to-card shadow-xl shadow-primary/15 ring-1 ring-primary/20',
    check: 'text-accent', annualTint: 'text-secondary',
    button: 'bg-gradient-to-r from-primary to-secondary py-3.5 text-white shadow-lg shadow-primary/25 hover:shadow-xl hover:opacity-95',
    ribbon: PLAN_META.pro.highlight,
  },
  pro_max: {
    chip: 'Excellence', chipClass: 'bg-amber-100 text-amber-900',
    pitch: 'Pour une préparation intensive, haut de gamme et ultra personnalisée.',
    cta: 'Choisir Pro Max', href: '/billing?plan=pro_max',
    card: 'border border-border bg-card shadow-sm hover:shadow-xl hover:border-amber-400',
    check: 'text-amber-500', annualTint: 'text-amber-700',
    button: 'border-2 border-primary bg-primary text-white hover:bg-secondary',
  },
}

const FAQ: { q: string; a: string }[] = [
  {
    q: 'Cognix est-il vraiment gratuit ?',
    a: `Oui. La formule Gratuit est sans limite de durée et sans carte : le premier chapitre de chaque matière, une annale par matière et ${AI_DAILY_LIMITS.free} questions Cognix IA par jour. Tu passes à une formule payante seulement si tu en as besoin.`,
  },
  {
    q: 'Comment payer mon abonnement ?',
    a: 'Par Mobile Money (MTN MoMo ou Airtel Money) via FeexPay, depuis la page Formules de ton compte. Tu valides le paiement sur ton téléphone et ta formule est activée dès sa confirmation.',
  },
  {
    q: 'Y a-t-il un prélèvement automatique ?',
    a: 'Non. Chaque abonnement couvre un mois ou un an payé d’avance. Rien n’est prélevé sans ton accord : à l’échéance, tu choisis de renouveler ou non.',
  },
  {
    q: 'Puis-je changer de formule en cours de route ?',
    a: 'Oui. Une montée en gamme est immédiate et le temps restant de ta formule actuelle est déduit au prorata. Un passage à une formule inférieure prend effet à la fin de la période déjà payée.',
  },
  {
    q: 'Quelles classes et quelles séries sont couvertes ?',
    a: 'Le CEPE, le BEPC, le BAC en séries générales (A, C, D) et les séries techniques (G2, G3, BG, R, E, F3, H). Les contenus disponibles varient selon la classe et la série, et de nouveaux cours sont ajoutés régulièrement.',
  },
  {
    q: 'Comment fonctionne la correction par un tuteur ?',
    a: `Tu photographies l’énoncé et ta copie, puis un tuteur vérifié par l’équipe Cognix te renvoie une correction détaillée. La formule Pro inclut ${TUTOR_CORRECTION_MONTHLY_LIMITS.pro} corrections par mois, la formule Pro Max ${TUTOR_CORRECTION_MONTHLY_LIMITS.pro_max}, traitées en priorité.`,
  },
  {
    q: 'Que voient les parents ?',
    a: 'Le parent relie son compte à celui de l’enfant avec un code. Il suit l’activité, les résultats et la progression — avec plus ou moins de détails selon la formule de l’enfant — mais n’a jamais accès à ses messages privés.',
  },
]

/* ── Petits composants ─────────────────────────────────────────────────────── */

function Eyebrow({ className, children }: { className: string; children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-bold uppercase tracking-wider ${className}`}>
      {children}
    </span>
  )
}

function SectionTitle({ eyebrow, eyebrowClass, title, text, dark = false }: {
  eyebrow: string
  eyebrowClass: string
  title: string
  text: string
  dark?: boolean
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <Eyebrow className={eyebrowClass}>{eyebrow}</Eyebrow>
      <h2 className={`mt-4 font-heading text-3xl font-extrabold sm:text-4xl lg:text-5xl ${dark ? 'text-white' : 'text-primary'}`}>{title}</h2>
      <p className={`mt-4 text-base ${dark ? 'text-slate-300 sm:text-lg' : 'text-muted-foreground'}`}>{text}</p>
    </div>
  )
}

function Logo() {
  return (
    <span className="group flex items-center gap-2.5">
      <span className="flex size-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary via-secondary to-[#00B4D8] shadow-md shadow-primary/20 transition group-hover:scale-105">
        <SolarIcon name="bolt-bold-duotone" className="text-2xl text-accent" />
      </span>
      <span className="flex flex-col">
        <span className="font-heading text-2xl font-extrabold leading-none tracking-tight text-primary">Cognix</span>
        <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Réussite scolaire</span>
      </span>
    </span>
  )
}

/** Prix d'une formule : montant seul, l'unité étant affichée à part. */
const amount = (value: number) => formatFcfa(value).replace(/\s*FCFA$/, '')

/* ── Page ──────────────────────────────────────────────────────────────────── */

export default function LandingPage() {
  const monthsOffered = Math.round(annualSavings('starter') / planPrice('starter', 'month'))

  return (
    <div className={`${heading.variable} min-h-screen overflow-x-clip bg-background font-sans text-foreground antialiased selection:bg-accent selection:text-primary`}>
      {/* Bandeau d'annonce */}
      <div className="border-b border-white/10 bg-gradient-to-r from-primary via-secondary to-primary px-4 py-2 text-center text-xs font-medium text-white sm:text-sm">
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block size-2 shrink-0 rounded-full bg-accent motion-safe:animate-pulse" />
          <span><span className="font-bold text-accent">Nouveau :</span> Prépare tes examens d’État du Congo (CEPE, BEPC, BAC) avec l’assistant Cognix IA !</span>
        </span>
      </div>

      <header className="sticky top-0 z-50 border-b border-border/80 bg-card/85 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8" aria-label="Navigation principale">
          <Link href="/" aria-label="Cognix, accueil"><Logo /></Link>
          <div className="hidden items-center gap-7 text-sm font-semibold text-muted-foreground lg:flex">
            {NAV.map((item) => (
              <a key={item.href} href={item.href} className="flex items-center gap-1.5 transition hover:text-primary">
                <span>{item.label}</span>
                {item.badge && <span className="rounded-full bg-accent/20 px-2 py-0.5 text-[10px] font-bold text-amber-900">{item.badge}</span>}
              </a>
            ))}
          </div>
          <div className="hidden items-center gap-3 sm:flex">
            <Link href="/login" className="rounded-2xl px-4 py-2.5 text-sm font-bold text-primary transition hover:bg-muted">Se connecter</Link>
            <Link href="/register" className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-secondary px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/25 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/35 active:translate-y-0">
              <span>Commencer gratuitement</span>
              <SolarIcon name="arrow-right-bold" className="text-accent" />
            </Link>
          </div>
          <div className="flex items-center gap-2 lg:hidden">
            <Link href="/register" className="rounded-xl bg-primary px-3 py-2 text-xs font-bold text-white shadow-sm sm:hidden">Commencer</Link>
            <MobileMenu icon={<SolarIcon name="hamburger-menu-linear" className="text-xl" />}>
              <div className="mx-auto flex max-w-7xl flex-col gap-1 text-sm font-semibold text-slate-700">
                {NAV.map((item) => (
                  <a key={item.href} href={item.href} className="flex items-center justify-between rounded-xl px-3 py-2.5 hover:bg-muted hover:text-primary">
                    <span>{item.label}</span>
                    {item.badge && <span className="rounded-full bg-accent/20 px-2 py-0.5 text-[10px] font-bold text-amber-900">{item.badge}</span>}
                  </a>
                ))}
                <div className="mt-2 grid grid-cols-2 gap-2 border-t border-border pt-3">
                  <Link href="/login" className="rounded-xl border border-border px-3 py-2.5 text-center font-bold text-primary">Se connecter</Link>
                  <Link href="/register" className="rounded-xl bg-primary px-3 py-2.5 text-center font-bold text-white">Créer un compte</Link>
                </div>
              </div>
            </MobileMenu>
          </div>
        </nav>
      </header>

      <main id="top">
        {/* ── Hero ── */}
        <section className="relative overflow-hidden bg-gradient-to-b from-primary via-[#162258] to-primary px-4 pb-24 pt-16 text-white lg:px-8 lg:pb-32 lg:pt-24">
          <div className="pointer-events-none absolute -top-40 right-0 size-[500px] rounded-full bg-[#00B4D8]/20 blur-[120px]" />
          <div className="pointer-events-none absolute bottom-0 left-0 size-[450px] rounded-full bg-accent/15 blur-[100px]" />
          <div className="relative mx-auto max-w-7xl">
            <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
              <div className="lg:col-span-7">
                <div className="inline-flex flex-wrap items-center gap-2.5 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold backdrop-blur-md">
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex size-full rounded-full bg-accent opacity-75 motion-safe:animate-ping" />
                    <span className="relative inline-flex size-2 rounded-full bg-accent" />
                  </span>
                  <span className="text-white/90">Pensée pour les élèves du Congo</span>
                  <span className="text-white/40">•</span>
                  <span className="font-bold text-accent">Du CEPE au BAC</span>
                </div>
                <h1 className="mt-6 font-heading text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl lg:leading-[1.15]">
                  Révise mieux.<br />
                  <span className="bg-gradient-to-r from-accent via-amber-300 to-[#00B4D8] bg-clip-text text-transparent">Réussis avec Cognix.</span>
                </h1>
                <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-200 sm:text-lg sm:leading-8">
                  L’application de révision conçue pour les élèves du Congo, du CEPE au BAC. Cours complets, exercices corrigés, annales, simulations d’examen, assistant IA et tuteurs vérifiés réunis au même endroit.
                </p>
                <div className="mt-8 flex flex-col gap-3.5 sm:flex-row sm:items-center">
                  <Link href="/register" className="inline-flex items-center justify-center gap-2.5 rounded-2xl bg-accent px-7 py-4 text-center font-heading text-base font-extrabold text-primary shadow-xl shadow-accent/25 transition hover:-translate-y-0.5 hover:bg-amber-400 hover:shadow-2xl hover:shadow-accent/35">
                    <SolarIcon name="rocket-bold-duotone" className="text-xl" />
                    <span>Commencer gratuitement</span>
                  </Link>
                  <a href="#fonctionnalites" className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/25 bg-white/10 px-6 py-4 text-center font-heading text-base font-bold text-white backdrop-blur-md transition hover:bg-white/20">
                    <SolarIcon name="play-circle-bold-duotone" className="text-xl text-[#00B4D8]" />
                    <span>Découvrir Cognix</span>
                  </a>
                </div>
                <div className="mt-8 flex flex-wrap items-center gap-4 text-xs font-medium text-slate-300">
                  <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-3 py-1.5 backdrop-blur">
                    <SolarIcon name="devices-bold" className="text-base text-accent" />
                    <span>Disponible sur Android et sur le web</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-3 py-1.5 backdrop-blur">
                    <SolarIcon name="shield-check-bold" className="text-base text-emerald-400" />
                    <span>Conforme aux programmes officiels</span>
                  </div>
                </div>
                <div className="mt-10 flex items-center gap-4 border-t border-white/10 pt-6">
                  <div className="flex -space-x-2">
                    {[['CEPE', 'bg-emerald-500 text-white'], ['BEPC', 'bg-[#00B4D8] text-white'], ['G2', 'bg-secondary text-white']].map(([label, tone]) => (
                      <span key={label} className={`inline-flex size-10 items-center justify-center rounded-full text-[10px] font-extrabold ring-2 ring-primary ${tone}`}>{label}</span>
                    ))}
                    <span className="flex size-10 items-center justify-center rounded-full bg-accent text-xs font-bold text-primary ring-2 ring-primary">BAC</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Pour chaque niveau scolaire au Congo</p>
                    <p className="text-xs text-slate-300">Du primaire au secondaire, séries générales &amp; techniques</p>
                  </div>
                </div>
              </div>

              {/* Maquette de téléphone */}
              <div className="relative flex justify-center lg:col-span-5" aria-hidden="true">
                <div className="absolute -left-2 top-8 z-30 flex items-center gap-2.5 rounded-2xl border border-white/20 bg-card/95 p-3.5 text-primary shadow-2xl shadow-black/20 backdrop-blur-md motion-safe:animate-bounce sm:-left-6">
                  <div className="flex size-9 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                    <SolarIcon name="cup-star-bold" className="text-xl" />
                  </div>
                  <div>
                    <div className="text-xs font-black text-primary">+250 XP gagnés !</div>
                    <div className="text-[10px] text-muted-foreground">Série QCM complétée</div>
                  </div>
                </div>
                <div className="absolute -right-2 bottom-20 z-30 flex items-center gap-2.5 rounded-2xl border border-emerald-500/30 bg-emerald-950/90 p-3.5 text-white shadow-2xl backdrop-blur-md sm:-right-4">
                  <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-500 text-white">
                    <SolarIcon name="check-read-bold" className="text-xl" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-emerald-300">Correction reçue</div>
                    <div className="text-[10px] text-emerald-100">Par Tuteur M. Samba (Physique)</div>
                  </div>
                </div>
                <div className="relative w-full max-w-[320px] rounded-[2.8rem] border-[10px] border-slate-900 bg-card p-3.5 shadow-2xl shadow-black/60 ring-1 ring-white/20">
                  <div className="mx-auto mb-3 flex h-4 w-28 items-center justify-center rounded-full bg-slate-900">
                    <div className="size-2 rounded-full bg-slate-800" />
                  </div>
                  <div className="space-y-3.5 overflow-hidden rounded-[2rem] bg-slate-50 p-3 text-slate-800">
                    <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="flex size-8 items-center justify-center rounded-full border border-primary bg-secondary text-xs font-bold text-white">C</span>
                        <div>
                          <p className="text-[10px] font-medium leading-none text-slate-500">Bonjour Christian</p>
                          <span className="text-xs font-extrabold leading-tight text-primary">Terminale D</span>
                        </div>
                      </div>
                      <span className="rounded-full bg-accent/20 px-2.5 py-0.5 text-[10px] font-black text-amber-900">1 420 XP</span>
                    </div>
                    <div className="rounded-2xl bg-gradient-to-br from-primary via-[#1D2B64] to-secondary p-3.5 text-white shadow-md">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-slate-200">Progression globale</span>
                        <span className="rounded-md bg-white/20 px-1.5 py-0.5 text-[10px] font-bold text-accent">BAC 2027</span>
                      </div>
                      <div className="mt-2 flex items-baseline justify-between">
                        <span className="font-heading text-3xl font-extrabold text-white">68%</span>
                        <span className="text-[11px] font-medium text-slate-300">18 / 24 chapitres</span>
                      </div>
                      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/20">
                        <div className="h-full w-[68%] rounded-full bg-gradient-to-r from-accent to-amber-300" />
                      </div>
                    </div>
                    <div>
                      <div className="mb-1.5 flex items-center justify-between text-[11px] font-bold text-slate-700">
                        <span>Matières clés</span>
                        <span className="font-bold text-[#00B4D8]">Voir tout</span>
                      </div>
                      <div className="space-y-2">
                        {([
                          ['calculator-bold', 'bg-blue-100 text-blue-700', 'Mathématiques', 'Fonctions & Dérivées', '74%', 'bg-blue-50 text-blue-700'],
                          ['atom-bold', 'bg-emerald-100 text-emerald-700', 'Sciences physiques', 'Électromagnétisme', '61%', 'bg-emerald-50 text-emerald-700'],
                        ] as const).map(([icon, box, name, chapter, score, scoreTone]) => (
                          <div key={name} className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-2.5 shadow-sm">
                            <div className="flex items-center gap-2">
                              <div className={`flex size-7 items-center justify-center rounded-lg ${box}`}>
                                <SolarIcon name={icon} className="text-sm" />
                              </div>
                              <div>
                                <div className="text-xs font-bold leading-tight text-slate-900">{name}</div>
                                <div className="text-[9px] text-slate-500">{chapter}</div>
                              </div>
                            </div>
                            <span className={`rounded px-2 py-0.5 text-[11px] font-extrabold ${scoreTone}`}>{score}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-xl border border-cyan-200 bg-gradient-to-r from-cyan-50 to-blue-50 p-2.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <SolarIcon name="magic-stick-3-bold" className="text-sm text-cyan-700" />
                          <span className="text-[11px] font-black text-cyan-900">Cognix IA</span>
                        </div>
                        <span className="rounded-full bg-cyan-200/60 px-2 py-0.5 text-[9px] font-bold text-cyan-800">82 questions restantes</span>
                      </div>
                      <p className="mt-1 text-[10px] font-medium text-slate-600">« Explique-moi le théorème des valeurs intermédiaires »</p>
                    </div>
                    <div className="flex items-center justify-between rounded-xl bg-primary/10 px-3 py-2 text-primary">
                      <div className="flex items-center gap-1.5">
                        <SolarIcon name="calendar-bold" className="text-secondary" />
                        <span className="text-[10px] font-bold">Prochaine révision : Aujourd’hui 17h</span>
                      </div>
                      <SolarIcon name="arrow-right-linear" className="text-xs" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Chiffres clés ── */}
        <section className="border-y border-border bg-card shadow-sm">
          <div className="mx-auto grid max-w-7xl grid-cols-1 px-4 py-6 min-[420px]:grid-cols-2 sm:grid-cols-4 sm:divide-x sm:divide-border lg:px-8">
            {STATS.map((s) => (
              <div key={s.title} className="flex items-center gap-3.5 p-3">
                <div className={`flex size-12 shrink-0 items-center justify-center rounded-3xl ${s.box}`}>
                  <SolarIcon name={s.icon} className={`text-2xl ${s.tint}`} />
                </div>
                <div>
                  <div className="font-heading text-sm font-extrabold text-primary sm:text-base">{s.title}</div>
                  <div className="text-xs text-muted-foreground">{s.text}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Avant / avec Cognix ── */}
        <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Eyebrow className="bg-secondary/10 text-secondary">La méthode classique vs Cognix</Eyebrow>
            <h2 className="mt-4 font-heading text-3xl font-extrabold text-primary sm:text-4xl lg:text-5xl">Réviser ne devrait pas être compliqué.</h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
              Cognix rassemble les ressources essentielles dans un seul espace afin que l’élève puisse apprendre, s’entraîner et progresser avec une méthode claire.
            </p>
          </div>
          <div className="mt-14 grid items-stretch gap-8 md:grid-cols-2">
            <div className="relative flex flex-col justify-between rounded-[2rem] border-2 border-red-200/80 bg-gradient-to-b from-red-50/60 to-white p-7 shadow-sm sm:p-9">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-red-100 pb-6">
                  <div className="flex items-center gap-3">
                    <div className="flex size-11 items-center justify-center rounded-3xl bg-red-100 text-red-600">
                      <SolarIcon name="close-circle-bold" className="text-2xl" />
                    </div>
                    <div>
                      <h3 className="font-heading text-xl font-extrabold text-red-950">Avant Cognix</h3>
                      <p className="text-xs text-red-700/80">Le calvaire des révisions désorganisées</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">Frustration</span>
                </div>
                <ul className="mt-6 space-y-4">
                  {BEFORE.map(([title, text]) => (
                    <li key={title} className="flex items-start gap-3">
                      <SolarIcon name="danger-triangle-bold" className="mt-1 shrink-0 text-lg text-red-500" />
                      <div>
                        <strong className="text-sm font-bold text-slate-800">{title}</strong>
                        <p className="mt-0.5 text-xs text-slate-600">{text}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-8 rounded-3xl bg-red-100/70 p-3.5 text-center text-xs font-bold text-red-900">
                Résultat : Perte de temps, lacunes accumulées et anxiété le jour de l’examen.
              </div>
            </div>
            <div className="relative flex flex-col justify-between rounded-[2rem] border-2 border-emerald-300 bg-gradient-to-b from-emerald-50/60 to-white p-7 shadow-lg shadow-emerald-500/10 sm:p-9">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-100 pb-6">
                  <div className="flex items-center gap-3">
                    <div className="flex size-11 items-center justify-center rounded-3xl bg-emerald-500 text-white shadow-md shadow-emerald-500/20">
                      <SolarIcon name="check-circle-bold" className="text-2xl" />
                    </div>
                    <div>
                      <h3 className="font-heading text-xl font-extrabold text-emerald-950">Avec Cognix</h3>
                      <p className="text-xs text-emerald-700">L’écosystème intelligent complet</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">Sérénité &amp; Clarté</span>
                </div>
                <ul className="mt-6 space-y-4">
                  {AFTER.map(([title, text]) => (
                    <li key={title} className="flex items-start gap-3">
                      <SolarIcon name="check-read-bold" className="mt-1 shrink-0 text-lg text-emerald-600" />
                      <div>
                        <strong className="text-sm font-bold text-slate-900">{title}</strong>
                        <p className="mt-0.5 text-xs text-slate-600">{text}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-8 rounded-3xl bg-emerald-100 p-3.5 text-center text-xs font-bold text-emerald-950">
                Résultat : Confiance, méthode claire et meilleures chances de réussite aux examens.
              </div>
            </div>
          </div>
        </section>

        {/* ── Fonctionnalités ── */}
        <section id="fonctionnalites" className="scroll-mt-20 border-y border-border bg-slate-100/80 px-4 py-20 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionTitle
              eyebrow="Tout pour réussir"
              eyebrowClass="bg-primary/10 text-primary"
              title="Un espace complet pour chaque étape de la révision"
              text="Découvre l’ensemble des modules pensés pour accompagner l’élève à son rythme jusqu’au diplôme."
            />
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((f) => (
                <article
                  key={f.title}
                  className={`group relative rounded-[2rem] p-7 transition duration-300 hover:-translate-y-1.5 hover:shadow-xl ${
                    f.highlight
                      ? 'border-2 border-cyan-300 bg-gradient-to-b from-cyan-50/50 to-card shadow-md'
                      : 'border border-border bg-card shadow-sm hover:border-secondary/40'
                  }`}
                >
                  {f.highlight && (
                    <span className="absolute -top-3 right-6 rounded-full bg-cyan-600 px-3 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white shadow">{f.highlight}</span>
                  )}
                  <div className={`flex size-[3.25rem] items-center justify-center rounded-3xl transition group-hover:scale-110 ${f.box} ${f.hover}`}>
                    <SolarIcon name={f.icon} className="text-3xl" />
                  </div>
                  <h3 className="mt-6 font-heading text-xl font-bold text-primary">{f.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── Cognix IA ── */}
        <section id="cognix-ia" className="relative scroll-mt-20 overflow-hidden bg-gradient-to-b from-card via-slate-50 to-card px-4 py-20 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid items-center gap-12 lg:grid-cols-12">
              <div className="lg:col-span-6">
                <Eyebrow className="bg-cyan-100 text-cyan-800">
                  <SolarIcon name="magic-stick-3-bold" className="text-sm" />
                  Intelligence Artificielle Pédagogique
                </Eyebrow>
                <h2 className="mt-4 font-heading text-3xl font-extrabold leading-tight text-primary sm:text-4xl lg:text-5xl">
                  Quand tu bloques,<br /><span className="text-[#00B4D8]">Cognix t’explique.</span>
                </h2>
                <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
                  Cognix IA est un tuteur virtuel disponible à tout moment pour t’aider à comprendre une notion, résoudre un exercice pas à pas ou préparer un examen.
                </p>
                <div className="mt-8 space-y-4">
                  {AI_BENEFITS.map((b) => (
                    <div key={b.title} className="flex items-start gap-3.5 rounded-3xl border border-border bg-card p-4 shadow-sm">
                      <div className={`flex size-9 shrink-0 items-center justify-center rounded-2xl ${b.box}`}>
                        <SolarIcon name={b.icon} className="text-xl" />
                      </div>
                      <div>
                        <h3 className="font-heading text-sm font-bold text-primary">{b.title}</h3>
                        <p className="mt-0.5 text-xs text-muted-foreground">{b.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-100/80 p-3.5 text-xs leading-relaxed text-slate-600">
                  <strong className="font-semibold text-slate-800">Note pédagogique :</strong> L’IA accompagne l’élève dans son apprentissage. Elle ne remplace pas le travail personnel ni l’accompagnement des enseignants.
                </div>
                <div className="mt-8">
                  <a href="#tarifs" className="inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3.5 font-heading text-sm font-bold text-white shadow-lg shadow-primary/20 transition hover:bg-secondary">
                    <span>Découvrir Cognix IA</span>
                    <SolarIcon name="arrow-right-bold" className="text-accent" />
                  </a>
                </div>
              </div>

              {/* Maquette de conversation */}
              <div className="lg:col-span-6" aria-hidden="true">
                <div className="overflow-hidden rounded-[2rem] border-2 border-primary/20 bg-primary shadow-2xl shadow-primary/30">
                  <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-slate-900/50 p-4 px-6 text-white">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="flex size-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-accent to-amber-300 font-black text-primary">
                          <SolarIcon name="magic-stick-3-bold" className="text-xl" />
                        </div>
                        <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full bg-emerald-500 ring-2 ring-slate-900" />
                      </div>
                      <div>
                        <p className="font-heading text-sm font-extrabold text-white">Cognix IA — Tuteur Virtuel</p>
                        <p className="text-xs text-emerald-400">En ligne • Spécialiste Programme Congolais</p>
                      </div>
                    </div>
                    <span className="shrink-0 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white/80">Terminale D</span>
                  </div>
                  <div className="space-y-4 bg-gradient-to-b from-primary to-[#0c153d] p-5 sm:p-6">
                    <div className="flex items-start justify-end gap-2.5">
                      <div className="max-w-[85%] rounded-3xl rounded-tr-sm bg-secondary p-4 text-sm leading-relaxed text-white shadow-md">
                        <div className="mb-1 text-[10px] font-bold text-accent">Toi (Élève)</div>
                        « Peux-tu m’expliquer la dérivée d’une fonction comme si j’étais débutant ? »
                      </div>
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-white/40 bg-[#00B4D8] text-xs font-bold text-white">C</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-primary">
                        <SolarIcon name="magic-stick-3-bold" />
                      </div>
                      <div className="max-w-[90%] rounded-3xl rounded-tl-sm border border-white/15 bg-white p-4 text-sm leading-relaxed text-slate-800 shadow-xl">
                        <div className="mb-1 text-[10px] font-black uppercase tracking-wider text-secondary">Cognix IA</div>
                        <p>Bien sûr ! Imagine que tu conduis une voiture sur le boulevard Denis Sassou Nguesso.</p>
                        <p className="mt-2 text-slate-700">
                          • La <strong>fonction</strong> te donne ta <em>position</em> totale parcourue.<br />
                          • La <strong>dérivée</strong>, c’est simplement le <em>compteur de vitesse</em> qui indique à quelle vitesse ta position change exactement à cet instant donné !
                        </p>
                        <div className="mt-3 rounded-2xl border border-blue-100 bg-blue-50 p-2.5 text-xs font-medium text-blue-900">
                          💡 En mathématiques : si <span className="whitespace-nowrap font-serif italic">f(x) = x²</span>, alors sa vitesse d’évolution est <span className="whitespace-nowrap font-serif italic">f′(x) = 2x</span>. Veux-tu un exemple avec un exercice du BAC ?
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-2">
                      <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs text-white/90">« Donne-moi un exercice d’application »</span>
                      <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs text-white/90">« Montre-moi la formule générale »</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 border-t border-white/10 bg-slate-900/60 p-3 px-4 text-xs text-white/50">
                    <SolarIcon name="paperclip-linear" className="text-base text-white/70" />
                    <div className="flex-1 rounded-2xl bg-white/10 px-3 py-2 text-white/60">Pose ta question sur ton cours ou ton devoir...</div>
                    <span className="flex size-8 items-center justify-center rounded-xl bg-accent text-primary">
                      <SolarIcon name="plain-bold" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Simulations ── */}
        <section id="simulations" className="relative scroll-mt-20 overflow-hidden bg-primary px-4 py-20 text-white lg:px-8">
          <div className="pointer-events-none absolute right-1/4 top-0 size-96 rounded-full bg-secondary/30 blur-3xl" />
          <div className="relative mx-auto max-w-7xl">
            <SectionTitle
              dark
              eyebrow="Conditions Réelles d’Épreuve"
              eyebrowClass="bg-accent/20 text-accent"
              title="Prépare-toi comme le jour de l’examen"
              text="Quatre modes progressifs pour dompter le stress, gérer le chronomètre et maximiser tes points."
            />
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col justify-between rounded-[2rem] border border-white/15 bg-white/5 p-6 backdrop-blur-sm transition duration-300 hover:border-white/30 hover:bg-white/10">
                <div>
                  <div className="flex size-12 items-center justify-center rounded-3xl bg-white/10 text-accent">
                    <SolarIcon name="play-circle-bold-duotone" className="text-3xl" />
                  </div>
                  <h3 className="mt-5 font-heading text-xl font-bold text-white">Entraînement libre</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-300">Révise sans chronomètre et avance à ton rythme pour assimiler chaque concept pas à pas.</p>
                </div>
                <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-xs text-slate-400">
                  <span>Rythme libre</span>
                  <span className="font-bold text-emerald-400">{fromPlan('free_exam_mode')}</span>
                </div>
              </div>
              <div className="flex flex-col justify-between rounded-[2rem] border border-white/15 bg-white/5 p-6 backdrop-blur-sm transition duration-300 hover:border-white/30 hover:bg-white/10">
                <div>
                  <div className="flex size-12 items-center justify-center rounded-3xl bg-blue-500/20 text-[#00B4D8]">
                    <SolarIcon name="stopwatch-bold-duotone" className="text-3xl" />
                  </div>
                  <h3 className="mt-5 font-heading text-xl font-bold text-white">Bac test</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-300">Entraîne-toi avec un chronomètre officiel comme dans les conditions réelles de salle d’examen.</p>
                </div>
                <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-xs text-slate-400">
                  <span>Chronométré</span>
                  <span className="font-bold text-blue-300">{fromPlan('bac_test_mode')}</span>
                </div>
              </div>
              <div className="relative flex flex-col justify-between rounded-[2rem] border-2 border-accent bg-gradient-to-b from-white/15 to-white/5 p-6 shadow-xl shadow-accent/10 backdrop-blur-sm">
                <span className="absolute -top-3 right-5 rounded-full bg-accent px-2.5 py-0.5 text-[10px] font-black uppercase text-primary">Plan Pro &amp; Max</span>
                <div>
                  <div className="flex size-12 items-center justify-center rounded-3xl bg-accent text-primary">
                    <SolarIcon name="clipboard-check-bold" className="text-3xl" />
                  </div>
                  <h3 className="mt-5 font-heading text-xl font-bold text-white">Bac blanc</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-200">Passe une simulation notée avec barème officiel et mesure précisément ton niveau prévisionnel.</p>
                </div>
                <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-xs text-slate-300">
                  <span>Noté /20</span>
                  <span className="font-bold text-accent">{fromPlan('bac_blanc_mode')}</span>
                </div>
              </div>
              <div className="relative flex flex-col justify-between rounded-[2rem] border-2 border-rose-500/70 bg-gradient-to-b from-rose-950/40 to-white/5 p-6 shadow-xl backdrop-blur-sm">
                <span className="absolute -top-3 right-5 rounded-full bg-rose-500 px-2.5 py-0.5 text-[10px] font-black uppercase text-white">Plan Pro &amp; Max</span>
                <div>
                  <div className="flex size-12 items-center justify-center rounded-3xl bg-rose-500 text-white">
                    <SolarIcon name="flame-bold" className="text-3xl" />
                  </div>
                  <h3 className="mt-5 font-heading text-xl font-bold text-white">Bac rouge</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-200">Relève un défi intensif avec pénalité en cas d’erreur pour viser les mentions Très Bien.</p>
                </div>
                <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-xs text-slate-300">
                  <span>Mode expert</span>
                  <span className="font-bold text-rose-300">Défi Ultime</span>
                </div>
              </div>
            </div>
            <p className="mt-10 text-center text-xs text-slate-300">
              * Les modes <span className="font-semibold text-accent">Bac blanc</span> et <span className="font-semibold text-rose-400">Bac rouge</span> sont disponibles à partir du plan {PLAN_META[FEATURE_REQUIRED_PLANS.bac_blanc_mode].label}.
            </p>
          </div>
        </section>

        {/* ── Parents ── */}
        <section id="parents" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-20 lg:px-8">
          <div className="overflow-hidden rounded-[2rem] border border-border bg-gradient-to-br from-amber-50/70 via-white to-blue-50/50 p-6 shadow-sm sm:p-8 lg:p-14">
            <div className="grid items-center gap-12 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <Eyebrow className="bg-accent/20 text-amber-900">Espace Famille Sécurisé</Eyebrow>
                <h2 className="mt-4 font-heading text-3xl font-extrabold text-primary sm:text-4xl">Les parents peuvent suivre sans surveiller.</h2>
                <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
                  Avec Cognix, les parents disposent d’une vision claire de la progression de leur enfant tout en respectant son espace personnel et son autonomie d’apprentissage.
                </p>
                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  {PARENT_ITEMS.map((item) => (
                    <div key={item.label} className="flex items-center gap-3 rounded-3xl border border-border/80 bg-card p-3.5 shadow-sm">
                      <SolarIcon name={item.icon} className={`shrink-0 text-2xl ${item.tint}`} />
                      <span className="text-xs font-bold text-slate-800">{item.label}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex items-start gap-2.5 text-xs text-muted-foreground">
                  <SolarIcon name="shield-warning-bold" className="mt-0.5 shrink-0 text-base text-secondary" />
                  <span>
                    <strong>Respect de la vie privée :</strong> Les parents suivent les résultats et l’activité de révision, mais n’ont pas accès aux messages privés de leur enfant. Le niveau de détail dépend de la formule de l’enfant.
                  </span>
                </div>
                <div className="mt-8">
                  <Link href="/register" className="inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3.5 font-heading text-sm font-bold text-white shadow-md transition hover:bg-secondary">
                    <span>Découvrir l’espace parent</span>
                    <SolarIcon name="arrow-right-bold" className="text-accent" />
                  </Link>
                </div>
              </div>
              <div className="lg:col-span-5">
                <div className="relative overflow-hidden rounded-[2rem] border border-border shadow-xl">
                  <Image
                    src="/kelassi/parent-student.jpeg"
                    alt="Un parent et son enfant suivent la progression sur Cognix"
                    width={1264}
                    height={832}
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    className="h-80 w-full object-cover lg:h-96"
                  />
                  <div className="absolute inset-0 flex items-end bg-gradient-to-t from-primary/80 via-transparent to-transparent p-6">
                    <div className="text-white">
                      <div className="text-xs font-bold text-accent">Rassurant &amp; Transparent</div>
                      <div className="text-sm font-extrabold">Gardez le contact avec sa scolarité en toute sérénité.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Communauté éducative ── */}
        <section className="border-y border-border bg-slate-100/70 px-4 py-20 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionTitle
              eyebrow="Écosystème Partenaire"
              eyebrowClass="bg-secondary/10 text-secondary"
              title="Une solution pour toute la communauté éducative"
              text="Cognix fédère élèves, corps professoral et établissements scolaires au service de l’excellence académique."
            />
            <div className="mt-14 grid gap-8 md:grid-cols-3">
              {AUDIENCES.map((a) => (
                <div key={a.title} className="flex flex-col justify-between rounded-[2rem] border border-border bg-card p-8 shadow-sm">
                  <div>
                    <div className={`flex size-14 items-center justify-center rounded-3xl ${a.box}`}>
                      <SolarIcon name={a.icon} className="text-3xl" />
                    </div>
                    <h3 className="mt-6 font-heading text-2xl font-extrabold text-primary">{a.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{a.text}</p>
                  </div>
                  <div className={`mt-6 flex items-center border-t border-slate-100 pt-4 text-xs font-bold ${a.foot}`}>
                    <span>{a.tag}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-12 text-center">
              <a
                href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Demande de présentation Cognix')}`}
                className="inline-flex items-center gap-2 rounded-2xl bg-primary px-8 py-4 font-heading text-sm font-bold text-white shadow-lg shadow-primary/20 transition hover:bg-secondary"
              >
                <SolarIcon name="presentation-graph-bold" className="text-lg text-accent" />
                <span>Demander une présentation</span>
              </a>
            </div>
          </div>
        </section>

        {/* ── Trois étapes ── */}
        <section id="fonctionnement" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-20 lg:px-8">
          <SectionTitle
            eyebrow="Prise en main rapide"
            eyebrowClass="bg-accent/20 text-amber-900"
            title="Commencer avec Cognix en trois étapes"
            text="En moins de 2 minutes, configure ton espace et commence à réviser immédiatement."
          />
          <div className="relative mt-14 grid gap-8 md:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.n} className="relative rounded-[2rem] border border-border bg-card p-8 text-center shadow-sm">
                <div className={`mx-auto flex size-16 items-center justify-center rounded-3xl font-heading text-2xl font-extrabold shadow-lg ${s.badge}`}>{s.n}</div>
                <div className="my-6 flex justify-center">
                  <SolarIcon name={s.icon} className={`text-4xl ${s.tint}`} />
                </div>
                <h3 className="font-heading text-xl font-bold text-primary">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Niveaux ── */}
        <section className="border-y border-border bg-gradient-to-b from-slate-100/70 to-slate-200/50 px-4 py-20 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionTitle
              eyebrow="Couverture Pédagogique"
              eyebrowClass="bg-primary/10 text-primary"
              title="Un parcours adapté à ton niveau"
              text="Que tu sois au collège, au lycée général ou en filière technique, retrouve un programme taillé pour tes examens."
            />
            <div className="mt-14 grid gap-6 md:grid-cols-3">
              <div className="rounded-[2rem] border border-border bg-card p-7 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-2xl bg-primary text-white">
                    <SolarIcon name="diploma-bold" className="text-xl" />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-extrabold text-primary">Niveaux et examens</h3>
                    <p className="text-xs text-muted-foreground">Les grandes étapes scolaires</p>
                  </div>
                </div>
                <div className="mt-6 flex flex-wrap gap-2.5">
                  {[['CEPE', 'Primaire'], ['BEPC', 'Collège']].map(([exam, cycle]) => (
                    <div key={exam} className="flex items-center gap-2 rounded-2xl bg-primary px-4 py-2.5 text-sm font-extrabold text-white shadow-sm">
                      <span>{exam}</span>
                      <span className="rounded bg-white/20 px-1.5 py-0.5 text-[10px]">{cycle}</span>
                    </div>
                  ))}
                  <div className="flex items-center gap-2 rounded-2xl bg-primary px-4 py-2.5 text-sm font-extrabold text-white shadow-sm">
                    <span>BAC</span>
                    <span className="rounded bg-accent px-1.5 py-0.5 text-[10px] font-black text-primary">Lycée</span>
                  </div>
                </div>
              </div>
              <div className="rounded-[2rem] border border-border bg-card p-7 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-2xl bg-secondary text-white">
                    <SolarIcon name="book-2-bold" className="text-xl" />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-extrabold text-primary">Séries générales</h3>
                    <p className="text-xs text-muted-foreground">Lycée d’enseignement général</p>
                  </div>
                </div>
                <div className="mt-6 flex flex-wrap gap-2.5">
                  {[['BAC A', 'Littéraire'], ['BAC C', 'Maths & Physiques'], ['BAC D', 'Sciences Naturelles']].map(([serie, label]) => (
                    <span key={serie} className="rounded-2xl border border-secondary/20 bg-secondary/10 px-4 py-2.5 text-sm font-extrabold text-secondary">
                      {serie} <span className="block text-xs font-normal text-slate-600 sm:ml-1 sm:inline">({label})</span>
                    </span>
                  ))}
                </div>
              </div>
              <div className="rounded-[2rem] border border-border bg-card p-7 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-2xl bg-amber-500 text-white">
                    <SolarIcon name="tuning-bold" className="text-xl" />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-extrabold text-primary">Séries techniques</h3>
                    <p className="text-xs text-muted-foreground">Lycées techniques &amp; commerciaux</p>
                  </div>
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                  {TECH_SERIES.map((serie) => (
                    <span
                      key={serie}
                      className={
                        serie === 'G2'
                          ? 'rounded-xl border border-amber-400 bg-accent/30 px-3 py-1.5 text-xs font-black text-amber-950 ring-1 ring-amber-400'
                          : 'rounded-xl border border-amber-300 bg-accent/20 px-3 py-1.5 text-xs font-black text-amber-900'
                      }
                    >
                      {serie === 'G2' ? 'G2 (Populaire)' : serie}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="mx-auto mt-8 max-w-4xl rounded-3xl border border-slate-200 bg-card p-4 text-center text-xs text-muted-foreground">
              ℹ️ <strong className="text-slate-800">Information importante :</strong> La disponibilité des matières et des ressources peut varier selon la classe et la série. Parmi les séries techniques, la G2 est actuellement la mieux fournie et de nouveaux contenus sont régulièrement ajoutés.
            </div>
          </div>
        </section>

        {/* ── Tarifs ── */}
        <section id="tarifs" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-20 lg:px-8">
          <SectionTitle
            eyebrow="Tarification Transparente"
            eyebrowClass="bg-secondary/10 text-secondary"
            title="Choisis la formule qui correspond à tes objectifs"
            text="Sans engagement. Démarre gratuitement ou choisis un forfait adapté à ton ambition scolaire."
          />
          <PricingToggle savingsLabel={`-${monthsOffered} mois offerts`}>
            <div className="mt-14 grid items-stretch gap-6 md:grid-cols-2 xl:grid-cols-4">
              {SUBSCRIPTION_PLANS.map((plan) => {
                const c = PLAN_CARDS[plan]
                const [first, ...rest] = PLAN_FEATURE_LINES[plan]
                const inherits = plan === 'pro' || plan === 'pro_max'
                const lines = inherits ? rest : PLAN_FEATURE_LINES[plan]
                return (
                  <article key={plan} className={`relative flex flex-col justify-between rounded-[2rem] p-7 transition ${c.card}`}>
                    {c.ribbon && (
                      <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-accent px-4 py-1 text-xs font-black uppercase tracking-wide text-primary shadow-md">
                        {c.ribbon} ⭐
                      </span>
                    )}
                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="font-heading text-xl font-extrabold text-primary">{PLAN_META[plan].label}</h3>
                        <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${c.chipClass}`}>{c.chip}</span>
                      </div>
                      <div className="mt-5 min-h-[3.75rem]">
                        {plan === 'free' ? (
                          <>
                            <div className="font-heading text-3xl font-extrabold text-primary">{formatFcfa(0)}</div>
                            <div className="mt-1 text-xs text-muted-foreground">Accès permanent sans carte</div>
                          </>
                        ) : (
                          <>
                            <div className="group-data-[interval=year]:hidden">
                              <div className="font-heading text-3xl font-extrabold text-primary">
                                {amount(planPrice(plan, 'month'))} <span className="text-sm font-semibold text-muted-foreground">FCFA / mois</span>
                              </div>
                              <div className={`mt-1 text-xs font-semibold ${c.annualTint}`}>
                                {formatFcfa(planPrice(plan, 'year'))} / an{' '}
                                <span className="text-[10px] text-muted-foreground line-through">{formatFcfa(planPrice(plan, 'month') * 12)}</span>
                              </div>
                            </div>
                            <div className="hidden group-data-[interval=year]:block">
                              <div className="font-heading text-3xl font-extrabold text-primary">
                                {amount(planPrice(plan, 'year'))} <span className="text-sm font-semibold text-muted-foreground">FCFA / an</span>
                              </div>
                              <div className={`mt-1 text-xs font-semibold ${c.annualTint}`}>
                                au lieu de <span className="line-through">{formatFcfa(planPrice(plan, 'month') * 12)}</span> · {formatFcfa(annualSavings(plan))} économisés
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                      <p className="mt-4 border-t border-slate-100 pt-4 text-xs leading-relaxed text-muted-foreground">{c.pitch}</p>
                      <ul className={`mt-6 space-y-3 text-xs font-medium ${plan === 'pro' ? 'text-slate-800' : 'text-slate-700'}`}>
                        {inherits && (
                          <li className="flex items-center gap-2 font-bold text-primary">
                            <SolarIcon name="check-circle-bold" className={`shrink-0 text-base ${c.check}`} />
                            <span>{first === 'Tout Starter' ? 'Toutes les fonctionnalités Starter' : 'Toutes les fonctionnalités Pro'}</span>
                          </li>
                        )}
                        {lines.map((line) => (
                          <li key={line} className="flex items-start gap-2">
                            <SolarIcon name="check-circle-bold" className={`shrink-0 text-base ${c.check}`} />
                            <span>{line}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="mt-8">
                      <Link href={c.href} className={`block w-full rounded-2xl px-4 py-3 text-center text-xs font-extrabold transition ${c.button}`}>{c.cta}</Link>
                    </div>
                  </article>
                )
              })}
            </div>
          </PricingToggle>
          <div className="mt-12 rounded-3xl border border-slate-200 bg-slate-50 p-6 text-center">
            <div className="flex flex-wrap items-center justify-center gap-2 text-sm font-semibold text-slate-800">
              <SolarIcon name="shield-check-bold" className="text-lg text-emerald-600" />
              <span>Paiement 100% sécurisé par Mobile Money avec <strong>FeexPay</strong> (MTN Mobile Money &amp; Airtel Money).</span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Les fonctionnalités peuvent varier selon la classe, la série et la disponibilité des contenus.</p>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section id="faq" className="scroll-mt-20 border-t border-border bg-slate-100/70 px-4 py-20 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <SectionTitle
              eyebrow="Questions fréquentes"
              eyebrowClass="bg-primary/10 text-primary"
              title="Tout ce qu’il faut savoir"
              text="Les réponses aux questions que se posent le plus souvent les élèves et les parents."
            />
            <div className="mt-12 space-y-3">
              {FAQ.map((item) => (
                <details key={item.q} className="group rounded-3xl border border-border bg-card p-5 shadow-sm open:shadow-md">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-heading text-base font-bold text-primary [&::-webkit-details-marker]:hidden">
                    {item.q}
                    <SolarIcon name="arrow-right-linear" className="shrink-0 text-lg text-secondary transition group-open:rotate-90" />
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── Appel final ── */}
        <section className="relative overflow-hidden bg-gradient-to-b from-primary via-[#162258] to-primary px-4 py-20 text-center text-white lg:px-8">
          <div className="pointer-events-none absolute -top-32 left-1/2 size-[420px] -translate-x-1/2 rounded-full bg-[#00B4D8]/15 blur-[110px]" />
          <div className="relative mx-auto max-w-3xl">
            <h2 className="font-heading text-3xl font-extrabold sm:text-4xl lg:text-5xl">
              Prêt à <span className="bg-gradient-to-r from-accent via-amber-300 to-[#00B4D8] bg-clip-text text-transparent">réussir tes examens</span> ?
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-200 sm:text-lg">
              Crée ton compte gratuitement et commence à réviser dès aujourd’hui, du CEPE au BAC.
            </p>
            <Link href="/register" className="mt-8 inline-flex items-center justify-center gap-2.5 rounded-2xl bg-accent px-8 py-4 font-heading text-base font-extrabold text-primary shadow-xl shadow-accent/25 transition hover:-translate-y-0.5 hover:bg-amber-400">
              <SolarIcon name="rocket-bold-duotone" className="text-xl" />
              <span>Commencer gratuitement</span>
            </Link>
          </div>
        </section>
      </main>

      <footer id="contact" className="scroll-mt-20 bg-[#0B1233] px-4 py-14 text-slate-400 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <span className="flex items-center gap-2.5">
              <span className="flex size-10 items-center justify-center rounded-2xl bg-white/10">
                <SolarIcon name="bolt-bold-duotone" className="text-2xl text-accent" />
              </span>
              <span className="font-heading text-2xl font-extrabold text-white">Cognix</span>
            </span>
            <p className="mt-5 max-w-sm text-sm leading-6">L’application de révision des élèves du Congo, du CEPE au BAC.</p>
            <a href={`mailto:${CONTACT_EMAIL}`} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-accent">
              {CONTACT_EMAIL}
            </a>
          </div>
          <div>
            <p className="font-bold text-white">Cognix</p>
            <div className="mt-4 flex flex-col gap-3 text-sm">
              <a href="#fonctionnalites" className="hover:text-white">Fonctionnalités</a>
              <a href="#tarifs" className="hover:text-white">Tarifs</a>
              <Link href="/cours" className="hover:text-white">Catalogue des cours</Link>
              <a href="#faq" className="hover:text-white">FAQ</a>
            </div>
          </div>
          <div>
            <p className="font-bold text-white">Informations</p>
            <div className="mt-4 flex flex-col gap-3 text-sm">
              <Link href="/cgu" className="hover:text-white">Conditions d’utilisation</Link>
              <Link href="/confidentialite" className="hover:text-white">Confidentialité</Link>
              <Link href="/login" className="hover:text-white">Se connecter</Link>
              <Link href="/register" className="hover:text-white">Créer un compte</Link>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-12 max-w-7xl border-t border-white/10 pt-6 text-xs">© {new Date().getFullYear()} Cognix — Alpha Kelassi. Tous droits réservés.</div>
      </footer>
    </div>
  )
}
