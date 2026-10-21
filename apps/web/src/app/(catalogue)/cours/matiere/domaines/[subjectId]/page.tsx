import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { SubjectArtwork } from '@/components/subject-artwork'

/**
 * Domaines d'une épreuve regroupée (migration 044, ex : Français → Grammaire,
 * Conjugaison…). Étape intermédiaire entre "Tes matières" et les chapitres.
 */

async function safe<T>(p: PromiseLike<{ data: T[] | null; error: unknown }>): Promise<T[]> {
  try {
    const { data } = await p
    return data ?? []
  } catch {
    return []
  }
}

export default async function SubjectDomainsPage({
  params,
}: {
  params: Promise<{ subjectId: string }>
}) {
  const { subjectId } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: subject } = await supabase
    .from('subjects')
    .select('id, name, level')
    .eq('id', subjectId)
    .maybeSingle()
  if (!subject) notFound()

  const domains = await safe<{ id: string; name: string }>(
    supabase
      .from('subjects')
      .select('id, name')
      .eq('parent_subject_id', subjectId)
      .order('display_order')
  )
  const domainIds = domains.map((d) => d.id)

  const chapters = await safe<{ id: string; subject_id: string }>(
    domainIds.length
      ? supabase.from('chapters').select('id, subject_id').in('subject_id', domainIds)
      : Promise.resolve({ data: [], error: null })
  )
  const chapterIds = chapters.map((c) => c.id)
  const lessons = await safe<{ id: string; chapter_id: string }>(
    chapterIds.length
      ? supabase.from('lessons').select('id, chapter_id').in('chapter_id', chapterIds)
      : Promise.resolve({ data: [], error: null })
  )
  const lessonIds = lessons.map((l) => l.id)
  const progress = await safe<{ lesson_id: string }>(
    lessonIds.length && user
      ? supabase
          .from('lesson_progress')
          .select('lesson_id')
          .eq('user_id', user.id)
          .eq('completed', true)
          .in('lesson_id', lessonIds)
      : Promise.resolve({ data: [], error: null })
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
    acc[c.subject_id] = (acc[c.subject_id] ?? 0) + 1
    return acc
  }, {})

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <nav className="mb-6 flex flex-wrap items-center gap-1.5 text-sm">
        <Link href="/cours/matiere" className="font-medium text-blue-600 hover:underline">
          Parcours
        </Link>
        <span className="text-gray-300">›</span>
        <span className="font-semibold text-gray-700">{subject.name}</span>
      </nav>

      <div className="mb-8 flex items-center gap-4">
        <SubjectArtwork name={subject.name} className="h-14 w-14 shrink-0 rounded-2xl" />
        <div>
          <h1 className="text-2xl font-black text-gray-900">{subject.name}</h1>
          <p className="text-sm text-gray-400">
            {domains.length} domaine{domains.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {domains.length === 0 ? (
        <div className="py-16 text-center">
          <p className="mb-3 text-4xl">📭</p>
          <p className="text-gray-500">Domaines bientôt disponibles.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {domains.map((d) => {
            const total = totalBySubject.get(d.id) ?? 0
            const done = doneBySubject.get(d.id) ?? 0
            const pct = total ? Math.round((done / total) * 100) : 0
            const chCount = chapterCountBySubject[d.id] ?? 0
            return (
              <Link
                key={d.id}
                href={`/cours/matiere/${d.id}`}
                className="group flex flex-col overflow-hidden rounded-2xl border-2 border-gray-100 bg-white transition-all hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
              >
                <SubjectArtwork name={d.name} className="h-28 sm:h-32">
                  <p className="text-sm font-bold leading-tight text-white">{d.name}</p>
                </SubjectArtwork>
                <div className="border-t border-gray-100 px-3 py-2.5">
                  <p className="mt-0.5 text-xs text-gray-400">
                    {chCount} chapitre{chCount !== 1 ? 's' : ''}
                  </p>
                  {total > 0 && (
                    <div className="mt-2">
                      <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
                        <div className="h-full bg-blue-500" style={{ width: `${pct}%` }} />
                      </div>
                      <p className="mt-1 text-[10px] text-gray-400">{pct}% complété</p>
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
