import { notFound } from 'next/navigation'
import { ChapterExercisesPage } from '@/components/curriculum/chapter-exercises-page'

export default async function CourseExercisesPage({
  params,
  searchParams,
}: {
  params: Promise<{ subjectId: string; chapterId: string }>
  searchParams: Promise<{ lessonId?: string }>
}) {
  const [{ subjectId, chapterId }, { lessonId }] = await Promise.all([params, searchParams])

  if (!/^[0-9a-f-]{36}$/i.test(subjectId) || !/^[0-9a-f-]{36}$/i.test(chapterId)) notFound()

  return (
    <ChapterExercisesPage
      chapterId={chapterId}
      lessonId={lessonId}
      returnToCourse
      returnPath={`/cours/matiere/${subjectId}/${chapterId}/exercices${lessonId ? `?lessonId=${encodeURIComponent(lessonId)}` : ''}`}
      expectedSubjectId={subjectId}
    />
  )
}
