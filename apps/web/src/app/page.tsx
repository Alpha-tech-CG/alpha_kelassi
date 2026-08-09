import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight, BarChart3, BookOpen, Bot, CalendarDays, Check, Clock3, CloudDownload,
  FileCheck2, GraduationCap, Layers3, Medal, Menu, MessageCircle, Play, Search,
  ShieldCheck, Sparkles, Smartphone, Star, TrendingUp, Trophy,
  UserRoundCheck, UsersRound, WifiOff,
} from 'lucide-react'

const services = [
  { Icon: BookOpen, title: 'Cours & fiches', text: 'Des leçons claires, structurées par niveau et adaptées au programme congolais.', tone: 'navy' },
  { Icon: GraduationCap, title: 'Prépa examens', text: 'Annales BEPC et BAC, simulations chronométrées et corrigés détaillés.', tone: 'violet' },
  { Icon: Bot, title: 'Tuteur IA', text: 'Des explications simples et personnalisées, disponibles à tout moment.', tone: 'amber' },
  { Icon: CloudDownload, title: 'Mode hors ligne', text: 'Télécharge tes cours et continue de réviser même sans Internet.', tone: 'green' },
]

const reasons = [
  ['100% adapté au Congo', 'Des contenus alignés sur les réalités et programmes scolaires congolais.'],
  ['IA + accompagnement humain', 'Une aide rapide avec Kelassi IA, renforcée par des tuteurs qualifiés.'],
  ['Motivation quotidienne', 'Des objectifs, des XP et des badges pour progresser un peu chaque jour.'],
]

function Brand({ light = false }: { light?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2.5 font-black tracking-tight ${light ? 'text-white' : 'text-[#172554]'}`}>
      <span className={`grid h-10 w-10 place-items-center rounded-2xl ${light ? 'bg-white/10 text-[#f5a623]' : 'bg-[#172554] text-white'}`}>
        <BookOpen className="h-5 w-5" strokeWidth={2.4} />
      </span>
      <span className="text-xl">Cognix <span className="font-semibold text-zinc-400">/ Kelassi</span></span>
    </span>
  )
}

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#fcfbf9] text-zinc-900">
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-zinc-200/70 bg-[#fcfbf9]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
          <Link href="/" aria-label="Accueil Alpha Kelassi"><Brand /></Link>
          <div className="hidden items-center gap-8 text-sm font-semibold text-zinc-600 md:flex">
            <a href="#services" className="transition hover:text-[#1e3a8a]">Nos services</a>
            <a href="#apercus" className="transition hover:text-[#1e3a8a]">L’application</a>
            <a href="#parents" className="transition hover:text-[#1e3a8a]">Parents</a>
            <Link href="/cours" className="transition hover:text-[#1e3a8a]">Découvrir l’application</Link>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/login" className="hidden rounded-full px-4 py-2 text-sm font-bold text-zinc-600 hover:bg-white sm:inline-flex">Connexion</Link>
            <Link href="/register" className="rounded-full bg-[#1e3a8a] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#172554]">S’inscrire</Link>
            <Menu className="h-5 w-5 text-[#1e3a8a] md:hidden" />
          </div>
        </div>
      </nav>

      <header className="relative px-5 pb-20 pt-32 lg:px-8 lg:pb-28 lg:pt-40">
        <div className="pointer-events-none absolute -right-36 top-20 h-96 w-96 rounded-full bg-amber-200/30 blur-3xl" />
        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.03fr_.97fr]">
          <div className="relative z-10">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full bg-[#fef3c7] px-4 py-2 text-xs font-black uppercase tracking-[.14em] text-amber-800">
              <Sparkles className="h-4 w-4" /> Premier assistant scolaire au Congo
            </div>
            <h1 className="max-w-3xl text-5xl font-black leading-[1.04] tracking-[-.045em] text-zinc-950 sm:text-6xl lg:text-7xl">
              Ta réussite, <span className="text-[#1e3a8a]">notre mission</span> au Congo-Brazzaville.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-zinc-600 sm:text-xl">
              Cognix réunit cours, entraînements, intelligence artificielle et suivi personnalisé dans Alpha Kelassi, l’application pensée pour la réussite du BEPC et du BAC.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/register" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#f5a623] px-7 py-4 text-base font-black text-zinc-950 shadow-lg shadow-amber-200/50 transition hover:-translate-y-0.5 hover:bg-amber-400">
                Commence ta révision gratuite <ArrowRight className="h-5 w-5" />
              </Link>
              <Link href="/dashboard" className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-zinc-200 bg-white px-7 py-4 text-base font-black text-zinc-800 transition hover:border-[#1e3a8a]/30">
                <Smartphone className="h-5 w-5 text-[#1e3a8a]" /> Voir l’application
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-zinc-500">
              <span className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> Sans carte bancaire</span>
              <span className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> BEPC & BAC</span>
              <span className="flex items-center gap-2"><WifiOff className="h-4 w-4 text-emerald-600" /> Accessible hors ligne</span>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 rotate-2 rounded-[2.5rem] bg-[#1e3a8a]" />
            <div className="relative overflow-hidden rounded-[2.2rem] border-8 border-white bg-white shadow-2xl">
              <Image src="/kelassi/students-library.jpeg" alt="Deux élèves congolais révisent avec Alpha Kelassi" width={1264} height={832} priority className="aspect-[1.16] w-full object-cover" />
              <div className="absolute inset-x-4 bottom-4 rounded-2xl bg-white/95 p-4 shadow-lg backdrop-blur sm:inset-x-6 sm:bottom-6">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-100 text-emerald-700"><TrendingUp className="h-5 w-5" /></span>
                  <div className="min-w-0 flex-1"><p className="text-xs font-bold text-zinc-400">Ta progression cette semaine</p><p className="font-black text-zinc-900">Excellent travail, continue !</p></div>
                  <strong className="text-xl text-emerald-600">+24%</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="px-5 pb-20 lg:px-8">
        <div className="mx-auto grid max-w-5xl grid-cols-1 overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm sm:grid-cols-3">
          {[["150+", "cours du programme"], ["24h/24", "tuteur IA disponible"], ["100%", "pensé pour le Congo"]].map(([value, label], i) => (
            <div key={label} className={`p-7 text-center ${i ? 'border-t border-zinc-200 sm:border-l sm:border-t-0' : ''}`}><p className={`text-4xl font-black ${i === 1 ? 'text-[#f5a623]' : i === 2 ? 'text-emerald-600' : 'text-[#1e3a8a]'}`}>{value}</p><p className="mt-1 text-sm font-semibold text-zinc-500">{label}</p></div>
          ))}
        </div>
      </section>

      <section id="services" className="bg-[#f4f4f5]/65 px-5 py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl"><p className="text-sm font-black uppercase tracking-[.2em] text-[#1e3a8a]">Nos services</p><h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">Tout ce qu’il te faut pour réussir.</h2><p className="mt-4 text-lg leading-7 text-zinc-600">Apprends, entraîne-toi et mesure tes progrès dans une seule application.</p></div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {services.map(({ Icon, title, text, tone }) => {
              const styles = tone === 'navy' ? 'bg-blue-50 text-[#1e3a8a]' : tone === 'violet' ? 'bg-violet-50 text-violet-700' : tone === 'amber' ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'
              return <Link href={title.includes('Cours') ? '/cours' : title.includes('examens') ? '/examens' : title.includes('IA') ? '/tuteur' : '/register'} key={title} className="group rounded-3xl border border-white bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"><span className={`grid h-14 w-14 place-items-center rounded-2xl ${styles}`}><Icon className="h-7 w-7" /></span><h3 className="mt-6 text-xl font-black">{title}</h3><p className="mt-2 text-sm leading-6 text-zinc-500">{text}</p><span className="mt-6 inline-flex items-center gap-1 text-sm font-bold text-[#1e3a8a]">Découvrir <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span></Link>
            })}
          </div>
        </div>
      </section>

      <section id="apercus" className="relative overflow-hidden bg-[#0b1739] px-5 py-24 text-white lg:px-8">
        <div className="pointer-events-none absolute -right-40 top-12 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-48 bottom-0 h-80 w-80 rounded-full bg-amber-400/10 blur-3xl" />
        <div className="relative mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-black uppercase tracking-[.2em] text-amber-300">Dans l’application</p>
            <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">Une expérience simple pour avancer chaque jour.</h2>
            <p className="mt-5 text-lg leading-8 text-blue-100/75">Découvre les principaux espaces de Cognix, conçus pour rester clairs sur téléphone comme sur ordinateur.</p>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-[1.35fr_.65fr]">
            <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#f8f7f3] p-3 shadow-2xl shadow-black/30 sm:p-5">
              <div className="rounded-[1.5rem] bg-white p-5 text-zinc-900 sm:p-7">
                <div className="flex items-center justify-between border-b border-zinc-100 pb-5">
                  <Brand />
                  <div className="flex items-center gap-3"><span className="hidden rounded-full bg-amber-50 px-3 py-1.5 text-xs font-black text-amber-700 sm:inline">🔥 Série de 7 jours</span><span className="grid h-9 w-9 place-items-center rounded-full bg-[#1e3a8a] text-xs font-black text-white">G</span></div>
                </div>
                <div className="mt-6 grid gap-5 md:grid-cols-[1.35fr_.65fr]">
                  <div className="rounded-3xl bg-[#1e3a8a] p-6 text-white">
                    <p className="text-sm font-semibold text-blue-200">Bonjour Grâce 👋</p>
                    <h3 className="mt-1 text-2xl font-black">Continue sur ta lancée !</h3>
                    <p className="mt-2 text-sm text-blue-100/75">Tu as déjà atteint 68% de ton objectif de la semaine.</p>
                    <div className="mt-7 h-2 overflow-hidden rounded-full bg-white/15"><div className="h-full w-[68%] rounded-full bg-[#f5a623]" /></div>
                    <div className="mt-3 flex justify-between text-xs font-bold text-blue-100"><span>340 XP gagnés</span><span>500 XP</span></div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-1">
                    <div className="rounded-2xl bg-amber-50 p-4"><Trophy className="h-6 w-6 text-amber-600"/><p className="mt-3 text-2xl font-black">1 240</p><p className="text-xs font-semibold text-zinc-500">XP au total</p></div>
                    <div className="rounded-2xl bg-emerald-50 p-4"><BarChart3 className="h-6 w-6 text-emerald-600"/><p className="mt-3 text-2xl font-black">78%</p><p className="text-xs font-semibold text-zinc-500">Progression</p></div>
                  </div>
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-zinc-100 p-4"><div className="flex items-center justify-between"><span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-50 text-[#1e3a8a]"><BookOpen className="h-5 w-5"/></span><span className="text-xs font-bold text-zinc-400">68%</span></div><p className="mt-4 font-black">Mathématiques</p><p className="text-xs text-zinc-500">Fonctions numériques</p></div>
                  <div className="rounded-2xl border border-zinc-100 p-4"><div className="flex items-center justify-between"><span className="grid h-9 w-9 place-items-center rounded-xl bg-violet-50 text-violet-700"><FileCheck2 className="h-5 w-5"/></span><span className="text-xs font-bold text-emerald-600">14/20</span></div><p className="mt-4 font-black">BAC blanc</p><p className="text-xs text-zinc-500">Physique · Série D</p></div>
                  <div className="rounded-2xl border border-zinc-100 p-4"><div className="flex items-center justify-between"><span className="grid h-9 w-9 place-items-center rounded-xl bg-amber-50 text-amber-700"><Bot className="h-5 w-5"/></span><span className="h-2 w-2 rounded-full bg-emerald-500" /></div><p className="mt-4 font-black">Kelassi IA</p><p className="text-xs text-zinc-500">Prêt à t’expliquer</p></div>
                </div>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5 backdrop-blur">
                <div className="rounded-[1.4rem] bg-white p-5 text-zinc-900 shadow-xl">
                  <div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-wider text-[#1e3a8a]">Cours</p><h3 className="mt-1 text-xl font-black">Mes matières</h3></div><Search className="h-5 w-5 text-zinc-400"/></div>
                  <div className="mt-5 space-y-3">{[['Mathématiques','12 chapitres','bg-blue-50 text-blue-700'],['Sciences de la vie','9 chapitres','bg-emerald-50 text-emerald-700'],['Français','11 chapitres','bg-amber-50 text-amber-700']].map(([name,count,tone],i)=><div key={name} className="flex items-center gap-3 rounded-2xl border border-zinc-100 p-3"><span className={`grid h-10 w-10 place-items-center rounded-xl ${tone}`}>{i===0?<Layers3 className="h-5 w-5"/>:i===1?<Sparkles className="h-5 w-5"/>:<BookOpen className="h-5 w-5"/>}</span><div className="min-w-0 flex-1"><p className="truncate text-sm font-black">{name}</p><p className="text-xs text-zinc-400">{count}</p></div><ArrowRight className="h-4 w-4 text-zinc-300"/></div>)}</div>
                </div>
              </div>
              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5 backdrop-blur">
                <div className="rounded-[1.4rem] bg-white p-5 text-zinc-900 shadow-xl">
                  <div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-wider text-violet-700">Examens</p><h3 className="mt-1 text-xl font-black">Prochaine simulation</h3></div><CalendarDays className="h-5 w-5 text-violet-600"/></div>
                  <div className="mt-5 rounded-2xl bg-violet-50 p-4"><div className="flex items-center justify-between"><span className="rounded-full bg-white px-3 py-1 text-xs font-black text-violet-700">BAC D</span><span className="flex items-center gap-1 text-xs font-bold text-zinc-500"><Clock3 className="h-3.5 w-3.5"/> 3h</span></div><p className="mt-4 font-black">Mathématiques · Session 2024</p><p className="mt-1 text-xs text-zinc-500">Sujet officiel avec corrigé détaillé</p><button className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-violet-700 py-3 text-sm font-black text-white"><Play className="h-4 w-4 fill-current"/> Commencer</button></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-24 lg:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
          <div className="relative mx-auto w-full max-w-xl rounded-[2.2rem] bg-[#172554] p-5 shadow-xl">
            <div className="rounded-[1.6rem] bg-[#fcfbf9] p-5 sm:p-7">
              <div className="flex items-center justify-between"><Brand /><span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-700">🔥 7 jours</span></div>
              <div className="mt-8 rounded-3xl bg-[#1e3a8a] p-6 text-white"><p className="text-sm text-blue-200">Bonjour Grâce 👋</p><p className="mt-1 text-2xl font-black">Prête à avancer aujourd’hui ?</p><div className="mt-5 h-2 overflow-hidden rounded-full bg-white/20"><div className="h-full w-2/3 rounded-full bg-[#f5a623]" /></div><p className="mt-2 text-xs text-blue-200">Objectif hebdomadaire · 68%</p></div>
              <div className="mt-4 grid grid-cols-2 gap-3"><div className="rounded-2xl bg-blue-50 p-4"><BookOpen className="h-6 w-6 text-[#1e3a8a]"/><p className="mt-3 font-black">Continuer le cours</p><p className="text-xs text-zinc-500">Fonctions numériques</p></div><div className="rounded-2xl bg-amber-50 p-4"><Bot className="h-6 w-6 text-amber-600"/><p className="mt-3 font-black">Demander à l’IA</p><p className="text-xs text-zinc-500">Disponible maintenant</p></div></div>
            </div>
          </div>
          <div><p className="text-sm font-black uppercase tracking-[.2em] text-[#1e3a8a]">Une app qui te comprend</p><h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">Le bon accompagnement, au bon moment.</h2><div className="mt-8 space-y-6">{reasons.map(([title, text]) => <div key={title} className="flex gap-4"><span className="mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-700"><Check className="h-5 w-5" /></span><div><h3 className="text-lg font-black">{title}</h3><p className="mt-1 leading-7 text-zinc-600">{text}</p></div></div>)}</div></div>
        </div>
      </section>

      <section id="parents" className="bg-[#172554] px-5 py-24 text-white lg:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <div><div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-amber-300"><UsersRound className="h-4 w-4" /> Parents & tuteurs</div><h2 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl">Accompagnez leur réussite en toute sérénité.</h2><p className="mt-5 max-w-xl text-lg leading-8 text-blue-100">Suivez les efforts, célébrez les progrès et offrez un environnement d’apprentissage sécurisé à votre enfant.</p><div className="mt-8 grid gap-4 sm:grid-cols-3">{[[TrendingUp,'Suivi des performances'],[ShieldCheck,'Espace sécurisé'],[UserRoundCheck,'Soutien structuré']].map(([I,label]) => { const Icon = I as typeof TrendingUp; return <div key={label as string} className="rounded-2xl border border-white/10 bg-white/5 p-4"><Icon className="h-6 w-6 text-amber-300"/><p className="mt-3 text-sm font-bold">{label as string}</p></div>})}</div><Link href="/register" className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3.5 font-black text-[#172554]">Découvrir l’espace parent <ArrowRight className="h-5 w-5" /></Link></div>
          <Image src="/kelassi/parent-student.jpeg" alt="Une mère accompagne son enfant dans ses révisions" width={1264} height={832} className="aspect-[1.25] w-full rounded-[2rem] object-cover shadow-2xl" />
        </div>
      </section>

      <section className="px-5 py-24 text-center lg:px-8"><div className="mx-auto max-w-3xl"><span className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-amber-100 text-[#f5a623]"><Medal className="h-10 w-10" /></span><h2 className="mt-7 text-4xl font-black tracking-tight sm:text-5xl">Prêt à décrocher ton diplôme ?</h2><p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-zinc-600">Révise à ton rythme, comprends réellement tes cours et avance chaque jour vers la réussite de ton BEPC ou de ton BAC.</p><Link href="/register" className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-[#f5a623] px-8 py-4 text-lg font-black text-zinc-950 shadow-lg shadow-amber-200/50">Je crée mon compte gratuit <ArrowRight className="h-5 w-5" /></Link></div></section>

      <footer className="bg-zinc-950 px-5 py-14 text-zinc-400 lg:px-8"><div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1.5fr_1fr_1fr]"><div><Brand light /><p className="mt-5 max-w-sm text-sm leading-6">L’assistant scolaire créé avec passion pour la jeunesse congolaise.</p><div className="mt-5 flex gap-3"><MessageCircle className="h-5 w-5"/><Star className="h-5 w-5"/></div></div><div><p className="font-bold text-white">Alpha Kelassi</p><div className="mt-4 flex flex-col gap-3 text-sm"><a href="#services">Nos services</a><Link href="/billing">Nos formules</Link><Link href="/tuteur">Tuteur IA</Link></div></div><div><p className="font-bold text-white">Informations</p><div className="mt-4 flex flex-col gap-3 text-sm"><Link href="/cgu">Conditions d’utilisation</Link><Link href="/confidentialite">Confidentialité</Link><Link href="/register">Créer un compte</Link></div></div></div><div className="mx-auto mt-12 max-w-7xl border-t border-white/10 pt-6 text-xs">© 2026 Alpha Kelassi. Tous droits réservés.</div></footer>
    </main>
  )
}
