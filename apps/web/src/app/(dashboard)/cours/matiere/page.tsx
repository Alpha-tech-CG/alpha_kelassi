import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

/**
 * Parcours structuré — entrée en 3 étapes : Filière → Série → Matière.
 * Piloté par les query params ?track= et ?series= (server component).
 * Défensif : si les tables 027 (series/chapters/lessons) n'existent pas encore,
 * la page dégrade proprement (étape série sautée, 0 chapitre).
 */

interface SearchParams { track?: string; series?: string }

const TRACKS = [
  { value: 'generale',      emoji: '🎓', title: 'Enseignement général',      desc: 'BEPC, BAC A / C / D',        color: 'border-blue-300 bg-blue-50 hover:border-blue-500' },
  { value: 'technique',     emoji: '🔧', title: 'Enseignement technique',    desc: 'BAC G1, G2, F3…',            color: 'border-slate-300 bg-slate-50 hover:border-slate-500' },
  { value: 'professionnel', emoji: '🛠️', title: 'Enseignement professionnel', desc: 'Filières pro (à venir)',     color: 'border-amber-300 bg-amber-50 hover:border-amber-500' },
] as const

/** Exécute une requête qui peut viser une table absente ; renvoie [] en cas d'erreur. */
async function safe<T>(p: PromiseLike<{ data: T[] | null; error: unknown }>): Promise<T[]> {
  try { const { data } = await p; return data ?? [] } catch { return [] }
}

export default async function ParcoursPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const { track, series } = await searchParams
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase
    .from('users').select('study_level_pref').eq('id', user!.id).maybeSingle()
  const userLevel = (profile?.study_level_pref as string | null) ?? null
  const isBepc = userLevel === 'bepc'

  /* ── Étape 1 — Filière ─────────────────────────────────────────────────── */
  if (!track) {
    return (
      <Shell step={0}>
        <h1 className="text-2xl font-black text-gray-900 mb-1">Choisis ta filière</h1>
        <p className="text-gray-400 text-sm mb-8">Quel type d'enseignement suis-tu ?</p>
        <div className="grid gap-3">
          {TRACKS.map((t) => (
            <Link key={t.value} href={`/cours/matiere?track=${t.value}`}
              className={`border-2 rounded-2xl p-5 transition-all hover:scale-[1.01] ${t.color}`}>
              <p className="text-3xl mb-2">{t.emoji}</p>
              <p className="font-bold text-lg text-gray-900">{t.title}</p>
              <p className="text-sm text-gray-500">{t.desc}</p>
            </Link>
          ))}
        </div>
      </Shell>
    )
  }

  /* ── Étape 2 — Série (sautée si BEPC ou si aucune série dispo) ──────────── */
  const seriesRows = await safe<{ id: string; code: string; label: string; level: string }>(
    supabase.from('series').select('id, code, label, level').eq('track', track)
      .match(userLevel ? { level: userLevel } : {}).order('code')
  )

  if (!series && !isBepc && seriesRows.length > 0) {
    return (
      <Shell step={1} track={track}>
        <h1 className="text-2xl font-black text-gray-900 mb-1">Choisis ta série</h1>
        <p className="text-gray-400 text-sm mb-8">Sélectionne ta série / spécialité.</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {seriesRows.map((s) => (
            <Link key={s.id} href={`/cours/matiere?track=${track}&series=${s.id}`}
              className="border-2 border-gray-200 rounded-xl p-4 text-center hover:border-blue-500 hover:bg-blue-50 transition-all">
              <p className="text-2xl font-black text-blue-700">{s.code}</p>
              <p className="text-[11px] text-gray-500 leading-tight mt-1 line-clamp-2">{s.label}</p>
            </Link>
          ))}
        </div>
      </Shell>
    )
  }

  /* ── Étape 3 — Matières ────────────────────────────────────────────────── */
  let subjQuery = supabase.from('subjects')
    .select('id, name, level, icon, track_type, parent_subject_id')
    .order('name')
  if (userLevel) subjQuery = subjQuery.eq('level', userLevel)
  subjQuery = subjQuery.eq('track_type', track)
  const { data: subjects } = await subjQuery
  const allRows = subjects ?? []
  const subjectIds = allRows.map((s) => s.id)

  // Regroupement en domaines (migration 044) : seules les matières sans parent
  // apparaissent dans la grille ; leurs enfants alimentent leurs stats agrégées.
  const childrenByParent = new Map<string, typeof allRows>()
  for (const r of allRows) {
    if (!r.parent_subject_id) continue
    const arr = childrenByParent.get(r.parent_subject_id) ?? []
    arr.push(r)
    childrenByParent.set(r.parent_subject_id, arr)
  }
  const subjectRows = allRows.filter((r) => !r.parent_subject_id)

  // Progression par matière (défensif : tables 027)
  const chapters = await safe<{ id: string; subject_id: string }>(
    subjectIds.length ? supabase.from('chapters').select('id, subject_id').in('subject_id', subjectIds) : Promise.resolve({ data: [], error: null })
  )
  const chapterIds = chapters.map((c) => c.id)
  const lessons = await safe<{ id: string; chapter_id: string }>(
    chapterIds.length ? supabase.from('lessons').select('id, chapter_id').in('chapter_id', chapterIds) : Promise.resolve({ data: [], error: null })
  )
  const lessonIds = lessons.map((l) => l.id)
  const progress = await safe<{ lesson_id: string }>(
    lessonIds.length ? supabase.from('lesson_progress').select('lesson_id').eq('user_id', user!.id).eq('completed', true).in('lesson_id', lessonIds) : Promise.resolve({ data: [], error: null })
  )
  const doneLessons = new Set(progress.map((p) => p.lesson_id))
  const chapterToSubject = new Map(chapters.map((c) => [c.id, c.subject_id]))
  const totalBySubject = new Map<string, number>()
  const doneBySubject = new Map<string, number>()
  for (const l of lessons) {
    const sid = chapterToSubject.get(l.chapter_id)
    if (!sid) continue
    totalBySubject.set(sid, (totalBySubject.get(sid) ?? 0) + 1)
    if (doneLessons.has(l.id)) doneBySubject.set(sid, (doneBySubject.get(sid) ?? 0) + 1)
  }
  const chapterCountBySubject = chapters.reduce<Record<string, number>>((acc, c) => {
    acc[c.subject_id] = (acc[c.subject_id] ?? 0) + 1; return acc
  }, {})

  return (
    <Shell step={isBepc || seriesRows.length === 0 ? 1 : 2} track={track}>
      <h1 className="text-2xl font-black text-gray-900 mb-1">Tes matières</h1>
      <p className="text-gray-400 text-sm mb-8">Choisis une matière pour accéder aux chapitres.</p>
      {subjectRows.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">📭</p>
          <p className="text-gray-500">Aucune matière pour ce parcours pour l'instant.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {subjectRows.map((s) => {
            const children = childrenByParent.get(s.id) ?? []
            const ids = children.length ? [s.id, ...children.map((c) => c.id)] : [s.id]
            const total = ids.reduce((a, id) => a + (totalBySubject.get(id) ?? 0), 0)
            const done = ids.reduce((a, id) => a + (doneBySubject.get(id) ?? 0), 0)
            const pct = total ? Math.round((done / total) * 100) : 0
            const chCount = ids.reduce((a, id) => a + (chapterCountBySubject[id] ?? 0), 0)
            const hasCalendar = s.level === 'cepe' || s.level === 'bepc'
            const href = hasCalendar ? `/progression-cepe?subject=${s.id}` : `/cours/matiere/${s.id}`
            return (
              <Link key={s.id} href={href}
                className="group flex flex-col rounded-2xl border-2 border-gray-100 bg-white overflow-hidden hover:border-blue-200 hover:shadow-lg hover:-translate-y-1 transition-all">
                <div className="flex-1 flex items-center justify-center py-6 bg-blue-50 text-3xl">
                  {s.icon ?? '📘'}
                </div>
                <div className="px-3 py-2.5 border-t border-gray-100">
                  <p className="text-sm font-bold text-gray-800 leading-tight line-clamp-2">{s.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {children.length ? `${children.length} domaine${children.length !== 1 ? 's' : ''} · ${chCount} chapitre${chCount !== 1 ? 's' : ''}` : `${chCount} chapitre${chCount !== 1 ? 's' : ''}`}
                  </p>
                  {total > 0 && (
                    <div className="mt-2">
                      <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                        <div className="h-full bg-blue-500" style={{ width: `${pct}%` }} />
                      </div>
                      <p className="text-[10px] text-gray-400 mt-1">{pct}% complété</p>
                    </div>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </Shell>
  )
}

/* ── Layout commun : progress steps + fil d'Ariane ───────────────────────── */
function Shell({ children, step, track }: { children: React.ReactNode; step: number; track?: string }) {
  const STEPS = ['Filière', 'Série', 'Matière']
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <nav className="flex items-center gap-1.5 text-sm mb-6 flex-wrap">
        <Link href="/cours" className="text-blue-600 hover:underline font-medium">Cours</Link>
        <span className="text-gray-300">›</span>
        <span className="text-gray-700 font-semibold">Parcours structuré</span>
      </nav>
      <div className="flex items-center gap-2 mb-8">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-bold ${
              i < step ? 'bg-blue-600 text-white' : i === step ? 'bg-blue-600 text-white ring-4 ring-blue-100' : 'bg-gray-200 text-gray-400'
            }`}>{i < step ? '✓' : i + 1}</div>
            <span className={`text-xs ${i === step ? 'text-gray-900 font-semibold' : 'text-gray-400'}`}>{s}</span>
            {i < STEPS.length - 1 && <div className={`h-0.5 w-5 ${i < step ? 'bg-blue-600' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>
      {track && (
        <Link href="/cours/matiere" className="inline-block mb-4 text-xs text-gray-400 hover:text-blue-600">← Changer de filière</Link>
      )}
      {children}
    </div>
  )
}
