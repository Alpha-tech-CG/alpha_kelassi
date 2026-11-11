import { ChapterExercisesPage } from '@/components/curriculum/chapter-exercises-page'

export default async function TdChapterPage({
  params,
}: {
  params: Promise<{ chapterId: string }>
}) {
  const { chapterId } = await params
  return (
    <ChapterExercisesPage
      chapterId={chapterId}
      returnToCourse={false}
      returnPath={`/examens/td/${chapterId}`}
    />
  )
}
