import { createClient } from '@/lib/supabase/server'
import { selectAll } from '@/lib/supabase/select-all'
import Link from 'next/link'
import { SubjectArtwork } from '@/components/subject-artwork'
import { STUDY_LEVELS } from '@alpha-kelassi/types'
import { Sparkles } from 'lucide-react'

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

interface SearchParams {
  level?: string
}

/* ── Config niveaux ─────────────────────────────────────────────────────── */
const LEVEL_CONFIG: Record<
  string,
  {
    label: string
    color: string
    bg: string
    border: string
    headerBg: string
    dot: string
  }
> = {
  cepe: {
    label: 'CEPE',
    color: 'text-rose-700',
    bg: 'bg-rose-50',
    border: 'border-rose-300',
    headerBg: 'bg-rose-500',
    dot: 'bg-rose-500',
  },
  bepc: {
    label: 'BEPC',
    color: 'text-blue-700',
    bg: 'bg-blue-50',
    border: 'border-blue-300',
    headerBg: 'bg-blue-500',
    dot: 'bg-blue-500',
  },
  bac_bg: {
    label: 'BAC BG',
    color: 'text-cyan-700',
    bg: 'bg-cyan-50',
    border: 'border-cyan-300',
    headerBg: 'bg-cyan-600',
    dot: 'bg-cyan-600',
  },
  bac_a: {
    label: 'BAC A',
    color: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-300',
    headerBg: 'bg-amber-500',
    dot: 'bg-amber-500',
  },
  bac_c: {
    label: 'BAC C',
    color: 'text-blue-700',
    bg: 'bg-blue-50',
    border: 'border-blue-300',
    headerBg: 'bg-blue-500',
    dot: 'bg-blue-500',
  },
  bac_d: {
    label: 'BAC D',
    color: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-300',
    headerBg: 'bg-emerald-500',
    dot: 'bg-emerald-500',
  },
  bac_e: {
    label: 'BAC E',
    color: 'text-orange-700',
    bg: 'bg-orange-50',
    border: 'border-orange-300',
    headerBg: 'bg-orange-500',
    dot: 'bg-orange-500',
  },
  bac_f3: {
    label: 'BAC F3',
    color: 'text-slate-700',
    bg: 'bg-slate-50',
    border: 'border-slate-300',
    headerBg: 'bg-slate-600',
    dot: 'bg-slate-600',
  },
  bac_g2: {
    label: 'BAC G2',
    color: 'text-teal-700',
    bg: 'bg-teal-50',
    border: 'border-teal-300',
    headerBg: 'bg-teal-600',
    dot: 'bg-teal-600',
  },
  bac_g3: {
    label: 'BAC G3',
    color: 'text-lime-700',
    bg: 'bg-lime-50',
    border: 'border-lime-300',
    headerBg: 'bg-lime-600',
    dot: 'bg-lime-600',
  },
  bac_h: {
    label: 'BAC H',
    color: 'text-blue-700',
    bg: 'bg-blue-50',
    border: 'border-blue-300',
    headerBg: 'bg-blue-500',
    dot: 'bg-blue-500',
  },
  bac_r: {
    label: 'BAC R',
    color: 'text-fuchsia-700',
    bg: 'bg-fuchsia-50',
    border: 'border-fuchsia-300',
    headerBg: 'bg-fuchsia-600',
    dot: 'bg-fuchsia-600',
  },
}

// Ordre d'affichage aligné sur la source partagée (packages/types/src/levels.ts).
// Les classes sans habillage ici (classes intermédiaires, fermées aux élèves par
// la base tant que l'administration ne les ouvre pas) ne sont pas listées.
const LEVEL_ORDER = STUDY_LEVELS.filter((l) => l in LEVEL_CONFIG)

/** Exécute une requête qui peut viser une table absente ; renvoie [] en cas d'erreur. */
async function safe<T>(p: PromiseLike<{ data: T[] | null; error: unknown }>): Promise<T[]> {
  try {
    const { data } = await p
    return data ?? []
  } catch {
    return []
  }
}

/** Comme `safe`, mais lit toutes les pages (voir selectAll). */
async function safeAll<T>(page: Parameters<typeof selectAll<T>>[0]): Promise<T[]> {
  try {
    return await selectAll(page)
  } catch {
    return []
  }
}

interface SubjectRow {
  id: string
  name: string
  level: string
  parent_subject_id: string | null
}
interface SubjectCard {
  id: string
  name: string
  level: string
  chapters: number
  lessons: number
  domains: number
  href: string
}

export default async function CoursPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const { level } = await searchParams
  const supabase = await createClient()

  const [
    {
      data: { user },
    },
    subjects,
    chapters,
    lessons,
  ] = await Promise.all([
    supabase.auth.getUser(),
    safe<SubjectRow>(
      supabase.from('subjects').select('id, name, level, parent_subject_id').order('name')
    ),
    // chapters et lessons dépassent (ou approchent) la limite de 1000 lignes
    // de PostgREST : sans pagination, les compteurs étaient tronqués.
    safeAll<{ id: string; subject_id: string }>((from, to) =>
      supabase.from('chapters').select('id, subject_id').order('id').range(from, to)),
    safeAll<{ chapter_id: string }>((from, to) =>
      supabase.from('lessons').select('chapter_id').order('id').range(from, to)),
  ])

  /* ── Agrégation des compteurs ───────────────────────────────────────────
     Les leçons pendent des chapitres, eux-mêmes rattachés à une matière —
     éventuellement un sous-domaine. On remonte donc les compteurs jusqu'à la
     matière racine pour que « Français » affiche le total de ses domaines. */
  const lessonsByChapter = new Map<string, number>()
  for (const l of lessons)
    lessonsByChapter.set(l.chapter_id, (lessonsByChapter.get(l.chapter_id) ?? 0) + 1)

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

  const levelTabs = [
    { value: '', label: 'Tous les niveaux' },
    ...LEVEL_ORDER.map((v) => ({ value: v, label: LEVEL_CONFIG[v]!.label })),
  ]

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-black text-gray-900">Cours &amp; Révisions</h1>
        <p className="mt-1 text-sm text-gray-500">
          {totalLessons} leçon{totalLessons !== 1 ? 's' : ''} · {withContent} matière
          {withContent !== 1 ? 's' : ''} avec du contenu
          {activeLevel ? ` · ${LEVEL_CONFIG[activeLevel]!.label}` : ' · CEPE, BEPC et BAC'}
        </p>
      </div>

      {/* Onglets niveau */}
      <div className="mb-8 flex flex-wrap gap-2">
        {levelTabs.map((tab) => {
          const cfg = LEVEL_CONFIG[tab.value]
          const isActive = activeLevel === tab.value
          return (
            <Link
              key={tab.value || 'all'}
              href={tab.value ? `/cours?level=${tab.value}` : '/cours'}
              className={`rounded-xl border-2 px-4 py-2 text-sm font-bold transition-all ${
                isActive
                  ? cfg
                    ? `${cfg.headerBg} border-transparent text-white shadow-md`
                    : 'border-transparent bg-gray-900 text-white shadow-md'
                  : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
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
          <div className="rounded-2xl border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-blue-50 px-6 py-16 text-center">
            <p className="mb-3 text-4xl">🔐</p>
            <p className="mb-1 text-lg font-black text-gray-900">
              Connecte-toi pour voir les cours
            </p>
            <p className="mb-5 text-sm text-gray-600">
              Le catalogue complet — CEPE, BEPC et BAC — t'attend derrière un compte gratuit.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/register"
                className="rounded-xl bg-[#0F1B2D] px-5 py-2.5 font-bold text-white transition-all hover:brightness-125"
              >
                Créer un compte gratuit
              </Link>
              <Link
                href="/login"
                className="px-4 py-2.5 font-semibold text-blue-700 hover:underline"
              >
                J'ai déjà un compte
              </Link>
            </div>
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="mb-3 text-4xl">📭</p>
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
                <div className="mb-4 flex items-center gap-3">
                  <span
                    className={`rounded-lg px-3 py-1 text-sm font-black ${cfg.headerBg} text-white`}
                  >
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
        className="mt-10 flex items-center gap-3 rounded-2xl border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-blue-50 px-5 py-4 transition-all hover:border-blue-400 hover:shadow-md"
      >
        <Sparkles className="h-6 w-6 flex-shrink-0 text-blue-600" strokeWidth={1.5} />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-gray-900">Parcours guidé</p>
          <p className="text-xs text-gray-500">
            Naviguer par filière et série plutôt que par matière
          </p>
        </div>
        <span className="font-bold text-blue-600">→</span>
      </Link>
    </div>
  )
}

/* ── Grille de cartes matières ─────────────────────────────────────────── */
function SubjectGrid({ cards }: { cards: SubjectCard[] }) {
  // Les matières alimentées d'abord — une matière vide ne doit pas occuper le haut de la grille.
  const sorted = [...cards].sort((a, b) => b.lessons - a.lessons || a.name.localeCompare(b.name))

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {sorted.map((s) => {
        const cfg = LEVEL_CONFIG[s.level] ?? LEVEL_CONFIG['bepc']!
        const empty = s.lessons === 0

        /* Une matière sans leçon n'est pas cliquable : mieux vaut l'annoncer
           comme « bientôt » que de mener à une page vide. */
        if (empty) {
          return (
            <div
              key={s.id}
              className="overflow-hidden rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/60 opacity-75"
            >
              <SubjectArtwork name={s.name} className="h-28 sm:h-32">
                <h3 className="text-sm font-bold leading-tight text-white">{s.name}</h3>
              </SubjectArtwork>
              <div className="px-3 py-2.5">
                <p className="text-[11px] text-gray-400">Bientôt disponible</p>
              </div>
            </div>
          )
        }

        return (
          <Link
            key={s.id}
            href={s.href}
            className={`group overflow-hidden rounded-2xl border-2 ${cfg.border} bg-white transition-all hover:-translate-y-0.5 hover:shadow-md`}
          >
            <SubjectArtwork name={s.name} className="h-28 sm:h-32">
              <h3 className="text-sm font-bold leading-tight text-white">{s.name}</h3>
            </SubjectArtwork>
            <div className="flex min-h-16 items-center justify-between gap-2 px-3 py-2.5">
              <p className="min-w-0 text-[11px] text-gray-500">
                {s.lessons} leçon{s.lessons !== 1 ? 's' : ''}
                {s.domains > 0 && ` · ${s.domains} domaines`}
                {s.domains === 0 &&
                  s.chapters > 0 &&
                  ` · ${s.chapters} chapitre${s.chapters !== 1 ? 's' : ''}`}
              </p>
              <span
                className={`shrink-0 text-xs font-bold ${cfg.color} opacity-0 transition-opacity group-hover:opacity-100`}
              >
                →
              </span>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
