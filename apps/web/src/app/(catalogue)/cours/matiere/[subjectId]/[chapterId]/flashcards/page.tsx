import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getEntitlements } from '@/lib/subscription/server'
import { ChapterFlashcards, type DeckCard } from './chapter-flashcards'

/** Flashcards du chapitre : 15 cartes tirées au hasard dans son paquet (migration 075). */
export default async function ChapterFlashcardsPage({
  params,
}: {
  params: Promise<{ subjectId: string; chapterId: string }>
}) {
  const { subjectId, chapterId } = await params
  if (!/^[0-9a-f-]{36}$/i.test(subjectId) || !/^[0-9a-f-]{36}$/i.test(chapterId)) notFound()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const back = `/cours/matiere/${subjectId}/${chapterId}`
  if (!user) redirect(`/login?next=${encodeURIComponent(`${back}/flashcards`)}`)

  const [{ data: chapter }, { data: cards, error }, ent] = await Promise.all([
    supabase.from('chapters').select('id, title, subject_id, subjects(name)').eq('id', chapterId).maybeSingle(),
    supabase.from('chapter_flashcards').select('id, front, back').eq('chapter_id', chapterId).order('order_index'),
    getEntitlements(user.id),
  ])
  if (!chapter || chapter.subject_id !== subjectId) notFound()
  if (error) {
    console.error('[chapter-flashcards] deck lookup failed', error)
    throw new Error('Impossible de charger les flashcards du chapitre.')
  }

  return (
    <ChapterFlashcards
      deck={(cards ?? []) as DeckCard[]}
      chapterTitle={chapter.title}
      subjectName={(chapter.subjects as { name?: string } | null)?.name ?? ''}
      backHref={back}
      // Paquet vide en Gratuit : le chapitre est sans doute fermé (RLS, comme ses leçons).
      locked={ent.plan === 'free'}
    />
  )
}
