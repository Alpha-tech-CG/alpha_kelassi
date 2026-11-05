import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ChapterExercises } from './chapter-exercises'

interface ChapterRow {
  id: string
  title: string
  subject_id: string
}

export async function ChapterExercisesPage({
  chapterId,
  lessonId,
  returnToCourse,
  returnPath,
  expectedSubjectId,
}: {
  chapterId: string
  lessonId?: string
  returnToCourse: boolean
  returnPath: string
  expectedSubjectId?: string
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/login?next=${encodeURIComponent(returnPath)}`)
  }

  const { data: chapterData, error: chapterError } = await supabase
    .from('chapters')
    .select('id, title, subject_id')
    .eq('id', chapterId)
    .maybeSingle()
  const chapter = chapterData as ChapterRow | null

  if (chapterError) {
    console.error('[chapter-exercises-page] chapter lookup failed', chapterError)
    throw new Error('Impossible de charger le chapitre.')
  }
  if (!chapter || (expectedSubjectId && chapter.subject_id !== expectedSubjectId)) notFound()

  const { data: subjectData, error: subjectError } = await supabase
    .from('subjects')
    .select('name')
    .eq('id', chapter.subject_id)
    .maybeSingle()
  const subject = subjectData as { name: string } | null

  if (subjectError) {
    console.error('[chapter-exercises-page] subject lookup failed', subjectError)
    throw new Error('Impossible de charger la matière du chapitre.')
  }
  if (!subject) notFound()

  let courseLesson: { id: string; title: string } | null = null
  if (lessonId) {
    const { data: lessonData, error } = await supabase
      .from('lessons')
      .select('id, title')
      .eq('id', lessonId)
      .eq('chapter_id', chapterId)
      .eq('type', 'cours')
      .maybeSingle()
    const data = lessonData as { id: string; title: string } | null

    if (error) {
      console.error('[chapter-exercises-page] course lesson lookup failed', error)
      throw new Error('Impossible de charger le cours associé.')
    }
    if (!data) notFound()
    courseLesson = data
  }

  return (
    <ChapterExercises
      chapterId={chapter.id}
      chapterTitle={chapter.title}
      subjectId={chapter.subject_id}
      subjectName={subject.name}
      courseLessonId={courseLesson?.id}
      courseLessonTitle={courseLesson?.title}
      returnToCourse={returnToCourse}
    />
  )
}
