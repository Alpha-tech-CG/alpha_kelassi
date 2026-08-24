import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { STUDY_LEVELS } from '@alpha-kelassi/types'
import {
  Calculator, FlaskConical, Leaf, BookOpen, Globe, Brain,
  Languages, TrendingUp, Monitor, Activity, BookMarked, Sparkles,
  type LucideIcon,
} from 'lucide-react'

/**
 * Catalogue des cours — construit sur le programme structuré
 * (subjects → chapters → lessons), la seule source de contenu réellement
 * alimentée.
 *
 * Cette page listait auparavant la table `documents` (PDF importés), restée
 * vide : toutes les matières s'affichaient donc à « 0 cours » alors que 440
 * leçons existaient, invisibles, dans le programme structuré. On lit désormais
 * directement ce programme.
 *
 * Les matières regroupées (migration 044 — ex. Français CEPE → Grammaire,
 * Conjugaison…) portent leur contenu sur leurs sous-domaines : leurs compteurs
 * agrègent donc ceux des enfants, et le lien pointe vers l'étape « domaines ».
 */

interface SearchParams { level?: string }

/* ── Config niveaux ─────────────────────────────────────────────────────── */
const LEVEL_CONFIG: Record<string, {
  label: string; color: string; bg: string; border: string
  headerBg: string; dot: string
}> = {
  cepe:   { label: 'CEPE',   color: 'text-rose-700',    bg: 'bg-rose-50',    border: 'border-rose-300',    headerBg: 'bg-rose-500',    dot: 'bg-rose-500'    },
  bepc:   { label: 'BEPC',   color: 'text-blue-700',    bg: 'bg-blue-50',    border: 'border-blue-300',    headerBg: 'bg-blue-500',    dot: 'bg-blue-500'    },
  bac_bg: { label: 'BAC BG', color: 'text-cyan-700',    bg: 'bg-cyan-50',    border: 'border-cyan-300',    headerBg: 'bg-cyan-600',    dot: 'bg-cyan-600'    },
  bac_a:  { label: 'BAC A',  color: 'text-amber-700',   bg: 'bg-amber-50',   border: 'border-amber-300',   headerBg: 'bg-amber-500',   dot: 'bg-amber-500'   },
  bac_c:  { label: 'BAC C',  color: 'text-violet-700',  bg: 'bg-violet-50',  border: 'border-violet-300',  headerBg: 'bg-violet-500',  dot: 'bg-violet-500'  },
  bac_d:  { label: 'BAC D',  color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-300', headerBg: 'bg-emerald-500', dot: 'bg-emerald-500' },
  bac_e:  { label: 'BAC E',  color: 'text-orange-700',  bg: 'bg-orange-50',  border: 'border-orange-300',  headerBg: 'bg-orange-500',  dot: 'bg-orange-500'  },
  bac_f3: { label: 'BAC F3', color: 'text-slate-700',   bg: 'bg-slate-50',   border: 'border-slate-300',   headerBg: 'bg-slate-600',   dot: 'bg-slate-600'   },
  bac_g2: { label: 'BAC G2', color: 'text-teal-700',    bg: 'bg-teal-50',    border: 'border-teal-300',    headerBg: 'bg-teal-600',    dot: 'bg-teal-600'    },
  bac_g3: { label: 'BAC G3', color: 'text-lime-700',    bg: 'bg-lime-50',    border: 'border-lime-300',    headerBg: 'bg-lime-600',    dot: 'bg-lime-600'    },
  bac_h:  { label: 'BAC H',  color: 'text-indigo-700',  bg: 'bg-indigo-50',  border: 'border-indigo-300',  headerBg: 'bg-indigo-500',  dot: 'bg-indigo-500'  },
}

// Ordre d'affichage aligné sur la source partagée (packages/types/src/levels.ts).
const LEVEL_ORDER = STUDY_LEVELS

/* ── Icônes par matière ──────────────────────────────────────────────────── */
function SubjectIcon({ name, className }: { name: string; className?: string }) {
  const n = name.toLowerCase()
  let Icon: LucideIcon = BookMarked
  if (n.includes('math') || n.includes('numération') || n.includes('calcul')) Icon = Calculator
  else if (n.includes('physique') || n.includes('chimie'))                    Icon = FlaskConical
  else if (n.includes('svt') || n.includes('biolog') || n.includes('vie') || n.includes('éveil')) Icon = Leaf
  else if (n.includes('français') || n.includes('litt') || n.includes('lecture') || n.includes('grammaire') || n.includes('conjugaison') || n.includes('orthographe') || n.includes('vocabulaire') || n.includes('expression')) Icon = BookOpen
  else if (n.includes('histoire') || n.includes('géo'))                       Icon = Globe
  else if (n.includes('philo'))                                               Icon = Brain
  else if (n.includes('anglais') || n.includes('espagnol') || n.includes('latin') || n.includes('langue')) Icon = Languages
  else if (n.includes('économ') || n.includes('gestion') || n.includes('production')) Icon = TrendingUp
  else if (n.includes('info') || n.includes('technolog'))                      Icon = Monitor
  else if (n.includes('sport') || n.includes('eps'))                           Icon = Activity
  return <Icon className={className ?? 'w-8 h-8'} strokeWidth={1.5} />
}

/** Exécute une requête qui peut viser une table absente ; renvoie [] en cas d'erreur. */
async function safe<T>(p: PromiseLike<{ data: T[] | null; error: unknown }>): Promise<T[]> {
  try { const { data } = await p; return data ?? [] } catch { return [] }
}

interface SubjectRow { id: string; name: string; level: string; parent_subject_id: string | null }
interface SubjectCard {
  id: string; name: string; level: string
  chapters: number; lessons: number; domains: number
  href: string
}

export default async function CoursPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const { level } = await searchParams
  const supabase = await createClient()

  const [{ data: { user } }, subjects, chapters, lessons] = await Promise.all([
    supabase.auth.getUser(),
    safe<SubjectRow>(supabase.from('subjects').select('id, name, level, parent_subject_id').order('name')),
    safe<{ id: string; subject_id: string }>(supabase.from('chapters').select('id, subject_id')),
    safe<{ chapter_id: string }>(supabase.from('lessons').select('chapter_id')),
  ])

  /* ── Agrégation des compteurs ───────────────────────────────────────────
     Les leçons pendent des chapitres, eux-mêmes rattachés à une matière —
     éventuellement un sous-domaine. On remonte donc les compteurs jusqu'à la
     matière racine pour que « Français » affiche le total de ses domaines. */
  const lessonsByChapter = new Map<string, number>()
  for (const l of lessons) lessonsByChapter.set(l.chapter_id, (lessonsByChapter.get(l.chapter_id) ?? 0) + 1)

  const own = new Map<string, { chapters: number; lessons: number }>()
  for (const c of chapters) {
    const cur = own.get(c.subject_id) ?? { chapters: 0, lessons: 0 }
    cur.chapters += 1
    cur.lessons += lessonsByChapter.get(c.id) ?? 0
    own.set(c.subject_id, cur)
  }

  const childrenOf = new Map<string, SubjectRow[]>()
  for (const s of subjects) {
    if (!s.parent_subject_id) continue
    const arr = childrenOf.get(s.parent_subject_id) ?? []
    arr.push(s)
    childrenOf.set(s.parent_subject_id, arr)
  }

  const roots = subjects.filter((s) => !s.parent_subject_id)
  const cards: SubjectCard[] = roots.map((s) => {
    const kids = childrenOf.get(s.id) ?? []
    const mine = own.get(s.id) ?? { chapters: 0, lessons: 0 }
    let chaptersTotal = mine.chapters
    let lessonsTotal = mine.lessons
    for (const k of kids) {
      const kc = own.get(k.id) ?? { chapters: 0, lessons: 0 }
      chaptersTotal += kc.chapters
      lessonsTotal += kc.lessons
    }
    return {
      id: s.id,
      name: s.name,
      level: s.level,
      chapters: chaptersTotal,
      lessons: lessonsTotal,
      domains: kids.length,
      // Une matière regroupée passe par l'étape « domaines » ; sinon accès direct aux chapitres.
      href: kids.length > 0 ? `/cours/matiere/domaines/${s.id}` : `/cours/matiere/${s.id}`,
    }
  })

  const activeLevel = level && LEVEL_CONFIG[level] ? level : ''
  const visible = activeLevel ? cards.filter((c) => c.level === activeLevel) : cards
  const totalLessons = visible.reduce((a, c) => a + c.lessons, 0)
  const withContent = visible.filter((c) => c.lessons > 0).length

  const levelTabs = [{ value: '', label: 'Tous les niveaux' }, ...LEVEL_ORDER.map((v) => ({ value: v, label: LEVEL_CONFIG[v]!.label }))]

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-black text-gray-900">Cours &amp; Révisions</h1>
        <p className="text-gray-500 mt-1 text-sm">
          {totalLessons} leçon{totalLessons !== 1 ? 's' : ''} · {withContent} matière{withContent !== 1 ? 's' : ''} avec du contenu
          {activeLevel ? ` · ${LEVEL_CONFIG[activeLevel]!.label}` : ' · CEPE, BEPC et BAC'}
        </p>
      </div>

      {/* Onglets niveau */}
      <div className="flex gap-2 mb-8 flex-wrap">
        {levelTabs.map((tab) => {
          const cfg = LEVEL_CONFIG[tab.value]
          const isActive = activeLevel === tab.value
          return (
            <Link
              key={tab.value || 'all'}
              href={tab.value ? `/cours?level=${tab.value}` : '/cours'}
              className={`px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all ${
                isActive
                  ? cfg
                    ? `${cfg.headerBg} text-white border-transparent shadow-md`
                    : 'bg-gray-900 text-white border-transparent shadow-md'
                  : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </Link>
          )
        })}
      </div>

      {/* Grille */}
      {visible.length === 0 ? (
        /* Un visiteur sans compte qui ne voit aucune matière signifie presque
           toujours que la lecture publique n'est pas encore ouverte en base
           (migration 052) : on l'oriente vers la connexion plutôt que de lui
           affirmer à tort que le catalogue est vide. */
        !user ? (
          <div className="text-center py-16 rounded-2xl border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-violet-50 px-6">
            <p className="text-4xl mb-3">🔐</p>
            <p className="font-black text-gray-900 text-lg mb-1">Connecte-toi pour voir les cours</p>
            <p className="text-sm text-gray-600 mb-5">Le catalogue complet — CEPE, BEPC et BAC — t'attend derrière un compte gratuit.</p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Link href="/register" className="bg-[#172554] text-white font-bold px-5 py-2.5 rounded-xl hover:brightness-125 transition-all">
                Créer un compte gratuit
              </Link>
              <Link href="/login" className="text-blue-700 font-semibold px-4 py-2.5 hover:underline">
                J'ai déjà un compte
              </Link>
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-gray-500">Aucune matière pour ce niveau.</p>
          </div>
        )
      ) : activeLevel ? (
        <SubjectGrid cards={visible} />
      ) : (
        <div className="space-y-10">
          {LEVEL_ORDER.map((lvlKey) => {
            const lvlCards = visible.filter((c) => c.level === lvlKey)
            if (lvlCards.length === 0) return null
            const cfg = LEVEL_CONFIG[lvlKey]!
            const lvlLessons = lvlCards.reduce((a, c) => a + c.lessons, 0)
            return (
              <div key={lvlKey}>
                <div className="flex items-center gap-3 mb-4">
                  <span className={`px-3 py-1 rounded-lg text-sm font-black ${cfg.headerBg} text-white`}>
                    {cfg.label}
                  </span>
                  <span className="text-xs text-gray-400">
                    {lvlCards.length} matière{lvlCards.length !== 1 ? 's' : ''}
                    {lvlLessons > 0 && ` · ${lvlLessons} leçon${lvlLessons !== 1 ? 's' : ''}`}
                  </span>
                </div>
                <SubjectGrid cards={lvlCards} />
              </div>
            )
          })}
        </div>
      )}

      {/* Entrée alternative : parcours par filière → série */}
      <Link
        href="/cours/matiere"
        className="flex items-center gap-3 mt-10 rounded-2xl border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-violet-50 px-5 py-4 hover:border-blue-400 hover:shadow-md transition-all"
      >
        <Sparkles className="w-6 h-6 text-blue-600 flex-shrink-0" strokeWidth={1.5} />
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-900 text-sm">Parcours guidé</p>
          <p className="text-xs text-gray-500">Naviguer par filière et série plutôt que par matière</p>
        </div>
        <span className="text-blue-600 font-bold">→</span>
      </Link>
    </div>
  )
}

/* ── Grille de cartes matières ─────────────────────────────────────────── */
function SubjectGrid({ cards }: { cards: SubjectCard[] }) {
  // Les matières alimentées d'abord — une matière vide ne doit pas occuper le haut de la grille.
  const sorted = [...cards].sort((a, b) => b.lessons - a.lessons || a.name.localeCompare(b.name))

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {sorted.map((s) => {
        const cfg = LEVEL_CONFIG[s.level] ?? LEVEL_CONFIG['bepc']!
        const empty = s.lessons === 0

        /* Une matière sans leçon n'est pas cliquable : mieux vaut l'annoncer
           comme « bientôt » que de mener à une page vide. */
        if (empty) {
          return (
            <div
              key={s.id}
              className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/60 p-4 flex flex-col gap-3"
            >
              <div className="w-12 h-12 rounded-xl bg-white border border-gray-200 text-gray-300 flex items-center justify-center">
                <SubjectIcon name={s.name} className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-gray-400 leading-tight">{s.name}</h3>
                <p className="text-[11px] text-gray-400 mt-1">Bientôt disponible</p>
              </div>
            </div>
          )
        }

        return (
          <Link
            key={s.id}
            href={s.href}
            className={`group rounded-2xl border-2 ${cfg.border} bg-white p-4 flex flex-col gap-3 hover:shadow-md hover:-translate-y-0.5 transition-all`}
          >
            <div className={`w-12 h-12 rounded-xl ${cfg.bg} ${cfg.color} flex items-center justify-center`}>
              <SubjectIcon name={s.name} className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-sm text-gray-900 leading-tight">{s.name}</h3>
              <p className="text-[11px] text-gray-500 mt-1">
                {s.lessons} leçon{s.lessons !== 1 ? 's' : ''}
                {s.domains > 0 && ` · ${s.domains} domaines`}
                {s.domains === 0 && s.chapters > 0 && ` · ${s.chapters} chapitre${s.chapters !== 1 ? 's' : ''}`}
              </p>
            </div>
            <span className={`text-xs font-bold ${cfg.color} opacity-0 group-hover:opacity-100 transition-opacity self-end`}>
              Ouvrir →
            </span>
          </Link>
        )
      })}
    </div>
  )
}
