import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Lesson, LessonType } from '@alpha-kelassi/types'
import { LessonBlocks } from './lesson-blocks'

export default async function ChapterPage({ params }: { params: Promise<{ subjectId: string; chapterId: string }> }) {
  const { subjectId, chapterId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: chapter } = await supabase
    .from('chapters').select('id, title, description, subject_id, subjects(name)')
    .eq('id', chapterId).maybeSingle()
  if (!chapter || chapter.subject_id !== subjectId) notFound()

  // Leçons accessibles (RLS gère le premium) — content inclus (server-side)
  const { data: lessons } = await supabase
    .from('lessons')
    .select('id, chapter_id, type, title, content, video_url, duration_min, is_premium, order_index')
    .eq('chapter_id', chapterId)
    .order('order_index')

  const { data: progress } = await supabase
    .from('lesson_progress')
    .select('lesson_id, completed, score')
    .eq('user_id', user!.id)

  const initialDone: Record<string, { completed: boolean; score: number | null }> = {}
  for (const p of progress ?? []) initialDone[p.lesson_id] = { completed: p.completed, score: p.score }

  const subjectName = (chapter.subjects as { name?: string } | null)?.name ?? 'Matière'

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <nav className="flex items-center gap-1.5 text-sm mb-6 flex-wrap">
        <Link href="/cours/matiere" className="text-blue-600 hover:underline font-medium">Parcours</Link>
        <span className="text-gray-300">›</span>
        <Link href={`/cours/matiere/${subjectId}`} className="text-blue-600 hover:underline font-medium">{subjectName}</Link>
        <span className="text-gray-300">›</span>
        <span className="text-gray-700 font-semibold">{chapter.title}</span>
      </nav>

      <h1 className="text-2xl font-black text-gray-900 mb-1">{chapter.title}</h1>
      {chapter.description && <p className="text-gray-400 text-sm mb-8">{chapter.description}</p>}

      <LessonBlocks
        lessons={(lessons ?? []) as (Lesson & { type: LessonType })[]}
        initialDone={initialDone}
      />
    </div>
  )
}
