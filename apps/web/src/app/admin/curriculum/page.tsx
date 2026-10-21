import Link from 'next/link'
import { supabaseAdmin } from '@/lib/admin-guard'
import { selectAll } from '@/lib/supabase/select-all'
import { CYCLES, CYCLE_ORDER, LEVEL_META, levelsOfCycle, type StudyLevel } from '@alpha-kelassi/types'
import { PublishToggle } from './publish-toggle'

/**
 * Curriculum — étape 1 : les classes, rangées par cycle.
 *
 * Primaire (→ CEPE), Collège (→ BEPC), Lycée (Seconde, Première, Terminales
 * → BAC). On choisit une classe, puis une matière, puis on y ajoute des
 * chapitres. Chaque classe porte un interrupteur : les classes intermédiaires
 * sont préparées ici, fermées aux élèves, jusqu'à ce que leur programme soit
 * complet.
 */

async function safe<T>(p: PromiseLike<{ data: T[] | null; error?: unknown }>): Promise<{ rows: T[]; failed: boolean }> {
  try { const { data, error } = await p; return { rows: data ?? [], failed: !!error } } catch { return { rows: [], failed: true } }
}

/** Toutes les pages d'une requête, au format attendu par `safe` (une erreur la fait échouer). */
function all<T>(page: Parameters<typeof selectAll<T>>[0]) {
  return selectAll(page).then((data) => ({ data, error: null }))
}

/** Couleur des classes d'examen ; les classes intermédiaires prennent celle de leur cycle. */
const COLORS: Record<string, string> = {
  cepe: 'from-rose-500 to-rose-600',
  bepc: 'from-blue-500 to-blue-600',
  bac_bg: 'from-cyan-500 to-cyan-600',
  bac_a: 'from-amber-500 to-amber-600',
  bac_c: 'from-violet-500 to-violet-600',
  bac_d: 'from-emerald-500 to-emerald-600',
  bac_e: 'from-orange-500 to-orange-600',
  bac_f3: 'from-slate-500 to-slate-600',
  bac_g2: 'from-teal-500 to-teal-600',
  bac_g3: 'from-lime-600 to-lime-700',
  bac_h: 'from-indigo-500 to-indigo-600',
  bac_r: 'from-fuchsia-500 to-fuchsia-600',
}
const CYCLE_COLOR = {
  primaire: 'from-rose-300 to-rose-400',
  college: 'from-blue-300 to-blue-400',
  lycee: 'from-slate-400 to-slate-500',
} as const
const GRADES = [
  { grade: 'seconde', label: 'Seconde' },
  { grade: 'premiere', label: 'Première' },
  { grade: 'terminale', label: 'Terminale' },
] as const

type Stats = { subjects: number; chapters: number; lessons: number }

export default async function CurriculumHubPage() {
  const [subjects, chapters, lessons, series, settings] = await Promise.all([
    safe<{ id: string; level: string }>(supabaseAdmin.from('subjects').select('id, level')),
    // Paginé : PostgREST tronque à 1000 lignes (lessons en compte davantage).
    safe(all<{ id: string; subject_id: string }>((from, to) =>
      supabaseAdmin.from('chapters').select('id, subject_id').order('id').range(from, to))),
    safe(all<{ chapter_id: string }>((from, to) =>
      supabaseAdmin.from('lessons').select('chapter_id').order('id').range(from, to))),
    safe<{ id: string }>(supabaseAdmin.from('series').select('id')),
    safe<{ level: string; published: boolean }>(supabaseAdmin.from('study_level_settings').select('level, published')),
  ])

  // Avant la migration 064, seules les classes d'examen existent pour les élèves.
  const migrationPending = settings.failed
  const published = new Map(settings.rows.map((r) => [r.level, r.published]))
  const isPublished = (l: StudyLevel) => (migrationPending ? !!LEVEL_META[l].exam : published.get(l) ?? true)

  const levelOf = new Map(subjects.rows.map((s) => [s.id, s.level]))
  const chapterLevel = new Map(chapters.rows.map((c) => [c.id, levelOf.get(c.subject_id)]))
  const stats = new Map<string, Stats>()
  const bump = (lvl: string | undefined, key: keyof Stats) => {
    if (!lvl) return
    const cur = stats.get(lvl) ?? { subjects: 0, chapters: 0, lessons: 0 }
    cur[key] += 1
    stats.set(lvl, cur)
  }
  for (const s of subjects.rows) bump(s.level, 'subjects')
  for (const c of chapters.rows) bump(levelOf.get(c.subject_id), 'chapters')
  for (const l of lessons.rows) bump(chapterLevel.get(l.chapter_id), 'lessons')

  const card = (level: StudyLevel) => {
    const m = LEVEL_META[level]
    const st = stats.get(level) ?? { subjects: 0, chapters: 0, lessons: 0 }
    const pub = isPublished(level)
    const color = COLORS[level] ?? CYCLE_COLOR[m.cycle]
    const badge = m.exam ? m.label.replace('BAC ', '') : m.label.replace('1ère ', '1').replace('2nde ', '2')
    return (
      <div key={level} className={`bg-white rounded-2xl border-2 shadow-sm p-4 flex items-center gap-4 transition-all hover:shadow-md ${pub ? 'border-gray-100' : 'border-dashed border-gray-200'}`}>
        <Link href={`/admin/curriculum/classe/${level}`} className="flex items-center gap-4 flex-1 min-w-0">
          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-white font-black text-sm flex-shrink-0`}>
            {badge}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-black text-gray-900 truncate">
              {m.classe}
              {m.exam && <span className="ml-2 text-[10px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded-full align-middle">{m.label}</span>}
              {m.track === 'technique' && (
                <span className="ml-1.5 text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full align-middle">technique</span>
              )}
            </p>
            {m.description && <p className="text-xs text-gray-400 truncate">{m.description}</p>}
            <p className="text-xs text-gray-500 mt-1">
              {st.subjects} matière{st.subjects !== 1 ? 's' : ''}
              {' · '}{st.chapters} chapitre{st.chapters !== 1 ? 's' : ''}
              {' · '}{st.lessons} leçon{st.lessons !== 1 ? 's' : ''}
            </p>
          </div>
        </Link>
        <PublishToggle level={level} label={m.classe} published={pub} disabled={migrationPending} />
      </div>
    )
  }

  return (
    <div className="px-8 py-8 max-w-6xl">
      <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Cours &amp; chapitres</h1>
          <p className="text-gray-500 text-sm mt-1">
            Choisis une classe, puis une matière, pour gérer ses chapitres. Une classe « admin seulement » se prépare
            ici sans être visible des élèves.
          </p>
        </div>
        <Link href="/admin/curriculum/series" className="px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-gray-800">
          Gérer les séries ({series.rows.length})
        </Link>
      </div>

      {migrationPending && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Les classes intermédiaires ne sont pas encore en base : applique les migrations
          <code className="mx-1 bg-amber-100 px-1 rounded">063_classes_intermediaires.sql</code>puis
          <code className="mx-1 bg-amber-100 px-1 rounded">064_classes_publication.sql</code>. D’ici là, seules les classes
          d’examen sont utilisables.
        </div>
      )}

      <div className="space-y-10">
        {CYCLE_ORDER.map((cycle) => {
          const levels = levelsOfCycle(cycle)
          const open = levels.filter(isPublished).length
          return (
            <section key={cycle}>
              <div className="flex items-baseline gap-3 mb-3 border-b border-gray-100 pb-2">
                <h2 className="text-lg font-black text-gray-900">{CYCLES[cycle].label}</h2>
                <span className="text-xs font-bold text-gray-500">Examen : {CYCLES[cycle].exam}</span>
                <span className="ml-auto text-xs text-gray-400">{open} / {levels.length} classe{levels.length > 1 ? 's' : ''} ouverte{open > 1 ? 's' : ''}</span>
              </div>
              {cycle === 'lycee' ? (
                <div className="space-y-5">
                  {GRADES.map(({ grade, label }) => (
                    <div key={grade}>
                      <p className="text-xs font-black uppercase tracking-wide text-gray-400 mb-2">{label}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                        {levels.filter((l) => LEVEL_META[l].grade === grade).map(card)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">{levels.map(card)}</div>
              )}
            </section>
          )
        })}
      </div>

      <p className="mt-8 text-xs text-gray-400 leading-relaxed">
        Les classes sont figées dans le schéma de la base (type <code className="bg-gray-100 px-1 rounded">study_level</code>) :
        en ajouter une demande une migration, et PostgreSQL ne permet pas d’en retirer. Les matières et les chapitres, eux,
        s’ajoutent et se suppriment librement depuis chaque classe. Une classe fermée est cachée aux élèves par la base
        elle-même (inscription, matières, chapitres), sur le web comme dans l’appli.
      </p>
    </div>
  )
}
