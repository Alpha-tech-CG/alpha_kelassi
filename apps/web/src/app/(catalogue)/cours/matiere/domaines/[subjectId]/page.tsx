import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'

/**
 * Domaines d'une épreuve regroupée (migration 044, ex : Français → Grammaire,
 * Conjugaison…). Étape intermédiaire entre "Tes matières" et les chapitres.
 */

async function safe<T>(p: PromiseLike<{ data: T[] | null; error: unknown }>): Promise<T[]> {
  try { const { data } = await p; return data ?? [] } catch { return [] }
}

export default async function SubjectDomainsPage({ params }: { params: Promise<{ subjectId: string }> }) {
  const { subjectId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: subject } = await supabase
    .from('subjects').select('id, name, level, icon').eq('id', subjectId).maybeSingle()
  if (!subject) notFound()

  const domains = await safe<{ id: string; name: string; icon: string | null }>(
    supabase.from('subjects').select('id, name, icon').eq('parent_subject_id', subjectId).order('display_order')
  )
  const domainIds = domains.map((d) => d.id)

  const chapters = await safe<{ id: string; subject_id: string }>(
    domainIds.length ? supabase.from('chapters').select('id, subject_id').in('subject_id', domainIds) : Promise.resolve({ data: [], error: null })
  )
  const chapterIds = chapters.map((c) => c.id)
  const lessons = await safe<{ id: string; chapter_id: string }>(
    chapterIds.length ? supabase.from('lessons').select('id, chapter_id').in('chapter_id', chapterIds) : Promise.resolve({ data: [], error: null })
  )
  const lessonIds = lessons.map((l) => l.id)
  const progress = await safe<{ lesson_id: string }>(
    lessonIds.length && user ? supabase.from('lesson_progress').select('lesson_id').eq('user_id', user.id).eq('completed', true).in('lesson_id', lessonIds) : Promise.resolve({ data: [], error: null })
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
    <div className="max-w-3xl mx-auto px-4 py-8">
      <nav className="flex items-center gap-1.5 text-sm mb-6 flex-wrap">
        <Link href="/cours/matiere" className="text-blue-600 hover:underline font-medium">Parcours</Link>
        <span className="text-gray-300">›</span>
        <span className="text-gray-700 font-semibold">{subject.name}</span>
      </nav>

      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-blue-50 text-3xl">{subject.icon ?? '📘'}</div>
        <div>
          <h1 className="text-2xl font-black text-gray-900">{subject.name}</h1>
          <p className="text-sm text-gray-400">{domains.length} domaine{domains.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {domains.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">📭</p>
          <p className="text-gray-500">Domaines bientôt disponibles.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {domains.map((d) => {
            const total = totalBySubject.get(d.id) ?? 0
            const done = doneBySubject.get(d.id) ?? 0
            const pct = total ? Math.round((done / total) * 100) : 0
            const chCount = chapterCountBySubject[d.id] ?? 0
            return (
              <Link key={d.id} href={`/cours/matiere/${d.id}`}
                className="group flex flex-col rounded-2xl border-2 border-gray-100 bg-white overflow-hidden hover:border-blue-200 hover:shadow-lg hover:-translate-y-1 transition-all">
                <div className="flex-1 flex items-center justify-center py-6 bg-blue-50 text-3xl">
                  {d.icon ?? '📘'}
                </div>
                <div className="px-3 py-2.5 border-t border-gray-100">
                  <p className="text-sm font-bold text-gray-800 leading-tight line-clamp-2">{d.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{chCount} chapitre{chCount !== 1 ? 's' : ''}</p>
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
    </div>
  )
}
