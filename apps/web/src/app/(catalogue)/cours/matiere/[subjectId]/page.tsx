import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { SubjectArtwork } from '@/components/subject-artwork'
import type { LessonType } from '@alpha-kelassi/types'

/** Chapitres d'une matière, avec l'état des 4 blocs et la progression par chapitre. */

async function safe<T>(p: PromiseLike<{ data: T[] | null; error: unknown }>): Promise<T[]> {
  try {
    const { data } = await p
    return data ?? []
  } catch {
    return []
  }
}

const BLOCKS: { type: LessonType; icon: string; label: string }[] = [
  { type: 'cours', icon: '📖', label: 'Cours' },
  { type: 'resume', icon: '📝', label: 'Résumé' },
  { type: 'quiz', icon: '✅', label: 'Quiz' },
  { type: 'video', icon: '🎥', label: 'Vidéo' },
]

export default async function SubjectChaptersPage({
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

  const chapters = await safe<{
    id: string
    title: string
    description: string | null
    order_index: number
  }>(
    supabase
      .from('chapters')
      .select('id, title, description, order_index')
      .eq('subject_id', subjectId)
      .order('order_index')
  )
  const chapterIds = chapters.map((c) => c.id)

  const lessons = await safe<{ id: string; chapter_id: string; type: LessonType }>(
    chapterIds.length
      ? supabase.from('lessons').select('id, chapter_id, type').in('chapter_id', chapterIds)
      : Promise.resolve({ data: [], error: null })
  )
  const lessonIds = lessons.map((l) => l.id)
  const progress = await safe<{ lesson_id: string; score: number | null; completed: boolean }>(
    lessonIds.length && user
      ? supabase
          .from('lesson_progress')
          .select('lesson_id, score, completed')
          .eq('user_id', user.id)
          .in('lesson_id', lessonIds)
      : Promise.resolve({ data: [], error: null })
  )
  const progByLesson = new Map(progress.map((p) => [p.lesson_id, p]))

  // Documents PDF hérités (coexistence — section 9)
  const documents = await safe<{ id: string; title: string }>(
    supabase
      .from('documents')
      .select('id, title')
      .eq('subject_id', subjectId)
      .eq('type', 'cours')
      .order('created_at', { ascending: false })
  )

  // Agrégats par chapitre
  const byChapter = new Map<
    string,
    {
      total: number
      done: number
      typeDone: Record<LessonType, boolean>
      typeHas: Record<LessonType, boolean>
      quizScores: number[]
    }
  >()
  for (const ch of chapters)
    byChapter.set(ch.id, {
      total: 0,
      done: 0,
      typeDone: { cours: true, resume: true, quiz: true, video: true },
      typeHas: { cours: false, resume: false, quiz: false, video: false },
      quizScores: [],
    })
  for (const l of lessons) {
    const agg = byChapter.get(l.chapter_id)
    if (!agg) continue
    agg.total += 1
    agg.typeHas[l.type] = true
    const p = progByLesson.get(l.id)
    const done = p?.completed === true
    if (done) {
      agg.done += 1
      if (l.type === 'quiz' && typeof p?.score === 'number') agg.quizScores.push(p.score)
    } else agg.typeDone[l.type] = false
  }

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
            {chapters.length} chapitre{chapters.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {chapters.length === 0 ? (
        <div className="mb-8 py-16 text-center">
          <p className="mb-3 text-4xl">🏗️</p>
          <p className="font-medium text-gray-500">
            Chapitres structurés bientôt disponibles pour cette matière.
          </p>
        </div>
      ) : (
        <div className="mb-10 space-y-3">
          {chapters.map((ch) => {
            const agg = byChapter.get(ch.id)!
            const pct = agg.total ? Math.round((agg.done / agg.total) * 100) : 0
            const quizAvg = agg.quizScores.length
              ? Math.round(agg.quizScores.reduce((a, b) => a + b, 0) / agg.quizScores.length)
              : null
            return (
              <Link
                key={ch.id}
                href={`/cours/matiere/${subjectId}/${ch.id}`}
                className="block rounded-2xl border border-gray-100 bg-white p-4 transition-all hover:border-blue-200 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-bold text-gray-800">{ch.title}</h3>
                    {ch.description && (
                      <p className="mt-0.5 line-clamp-2 text-xs text-gray-400">{ch.description}</p>
                    )}
                  </div>
                  <span className="shrink-0 text-sm font-bold text-blue-600">{pct}%</span>
                </div>
                <div className="my-3 h-1.5 overflow-hidden rounded-full bg-gray-100">
                  <div className="h-full bg-blue-500" style={{ width: `${pct}%` }} />
                </div>
                <div className="flex items-center gap-3">
                  {BLOCKS.map((b) => {
                    const has = agg.typeHas[b.type]
                    const done = has && agg.typeDone[b.type]
                    return (
                      <span
                        key={b.type}
                        title={b.label}
                        className={`text-lg ${done ? '' : 'opacity-30 grayscale'}`}
                      >
                        {b.icon}
                      </span>
                    )
                  })}
                  {quizAvg !== null && (
                    <span className="ml-auto text-xs text-gray-400">Quiz : {quizAvg}%</span>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      )}

      {/* Repli : anciens documents PDF (coexistence) */}
      {documents.length > 0 && (
        <div className="border-t border-gray-100 pt-6">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-gray-400">
            📄 Documents PDF
          </h2>
          <div className="space-y-1.5">
            {documents.map((d) => (
              <Link
                key={d.id}
                href={`/cours/${d.id}`}
                className="block text-sm text-gray-600 hover:text-blue-600 hover:underline"
              >
                {d.title}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
