import Link from 'next/link'
import { supabaseAdmin } from '@/lib/admin-guard'

/**
 * Curriculum — étape 1 : les classes.
 *
 * Le parcours suit la logique du terrain : on choisit d'abord une classe, puis
 * une matière de cette classe, puis on y ajoute des chapitres. La page listait
 * auparavant toutes les matières de tous les niveaux à plat, ce qui obligeait
 * à chercher visuellement la bonne parmi une cinquantaine.
 */

async function safe<T>(p: PromiseLike<{ data: T[] | null }>): Promise<T[]> {
  try { const { data } = await p; return data ?? [] } catch { return [] }
}

/** Les niveaux sont un enum PostgreSQL (`study_level`) : cette liste le reflète. */
const CLASSES = [
  { level: 'cepe',  label: 'CEPE',  classe: 'CM2',          color: 'from-rose-500 to-rose-600',       ring: 'hover:border-rose-300'   },
  { level: 'bepc',  label: 'BEPC',  classe: '3e',           color: 'from-blue-500 to-blue-600',       ring: 'hover:border-blue-300'   },
  { level: 'bac_a', label: 'BAC A', classe: 'Terminale A',  color: 'from-amber-500 to-amber-600',     ring: 'hover:border-amber-300'  },
  { level: 'bac_c', label: 'BAC C', classe: 'Terminale C',  color: 'from-violet-500 to-violet-600',   ring: 'hover:border-violet-300' },
  { level: 'bac_d', label: 'BAC D', classe: 'Terminale D',  color: 'from-emerald-500 to-emerald-600', ring: 'hover:border-emerald-300'},
] as const

export default async function CurriculumHubPage() {
  const [subjects, chapters, lessons, series] = await Promise.all([
    safe<{ id: string; level: string }>(supabaseAdmin.from('subjects').select('id, level')),
    safe<{ id: string; subject_id: string }>(supabaseAdmin.from('chapters').select('id, subject_id')),
    safe<{ chapter_id: string }>(supabaseAdmin.from('lessons').select('chapter_id')),
    safe<{ id: string }>(supabaseAdmin.from('series').select('id')),
  ])

  const levelOf = new Map(subjects.map((s) => [s.id, s.level]))
  const chapterLevel = new Map(chapters.map((c) => [c.id, levelOf.get(c.subject_id)]))

  const stats = new Map<string, { subjects: number; chapters: number; lessons: number }>()
  const bump = (lvl: string | undefined, key: 'subjects' | 'chapters' | 'lessons') => {
    if (!lvl) return
    const cur = stats.get(lvl) ?? { subjects: 0, chapters: 0, lessons: 0 }
    cur[key] += 1
    stats.set(lvl, cur)
  }
  for (const s of subjects) bump(s.level, 'subjects')
  for (const c of chapters) bump(levelOf.get(c.subject_id), 'chapters')
  for (const l of lessons) bump(chapterLevel.get(l.chapter_id), 'lessons')

  return (
    <div className="px-8 py-8 max-w-5xl">
      <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Cours &amp; chapitres</h1>
          <p className="text-gray-500 text-sm mt-1">Choisis une classe, puis une matière, pour gérer ses chapitres.</p>
        </div>
        <Link href="/admin/curriculum/series" className="px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-gray-800">
          Gérer les séries ({series.length})
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {CLASSES.map((c) => {
          const st = stats.get(c.level) ?? { subjects: 0, chapters: 0, lessons: 0 }
          return (
            <Link
              key={c.level}
              href={`/admin/curriculum/classe/${c.level}`}
              className={`bg-white rounded-2xl border-2 border-gray-100 shadow-sm p-5 flex items-center gap-4 transition-all ${c.ring} hover:shadow-md`}
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${c.color} flex items-center justify-center text-white font-black text-sm flex-shrink-0`}>
                {c.label.replace('BAC ', '')}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-black text-gray-900">{c.label}</p>
                <p className="text-xs text-gray-400">{c.classe}</p>
                <p className="text-xs text-gray-500 mt-1.5">
                  {st.subjects} matière{st.subjects !== 1 ? 's' : ''}
                  {' · '}{st.chapters} chapitre{st.chapters !== 1 ? 's' : ''}
                  {' · '}{st.lessons} leçon{st.lessons !== 1 ? 's' : ''}
                </p>
              </div>
              <span className="text-gray-300 text-xl">›</span>
            </Link>
          )
        })}
      </div>

      <p className="mt-6 text-xs text-gray-400 leading-relaxed">
        Les classes correspondent aux examens d'État et sont figées dans le schéma de la base
        (type <code className="bg-gray-100 px-1 rounded">study_level</code>). En ajouter une demande une
        migration — PostgreSQL ne permet pas non plus d'en retirer. Les matières et les chapitres, eux,
        s'ajoutent et se suppriment librement depuis chaque classe.
      </p>
    </div>
  )
}
