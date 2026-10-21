import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Lesson, LessonType } from '@alpha-kelassi/types'
import { LessonBlocks } from './lesson-blocks'
import { BookOpen, Lock } from 'lucide-react'

const BLOCK_LABEL: Record<string, { icon: string; label: string }> = {
  cours: { icon: '📖', label: 'Cours' },
  resume: { icon: '📝', label: 'Résumé' },
  fiche: { icon: '🗂️', label: 'Fiche' },
  quiz: { icon: '✅', label: 'Quiz' },
  video: { icon: '🎥', label: 'Vidéo' },
}

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ subjectId: string; chapterId: string }>
}) {
  const { subjectId, chapterId } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: chapter } = await supabase
    .from('chapters')
    .select('id, title, description, subject_id, subjects(name)')
    .eq('id', chapterId)
    .maybeSingle()
  if (!chapter || chapter.subject_id !== subjectId) notFound()

  /* Le rôle anonyme n'a de privilège que sur les colonnes de métadonnées
     (migration 052) : lui demander `content` ferait échouer toute la requête.
     On sélectionne donc strictement ce à quoi le visiteur a droit. */
  const METADATA_COLS = 'id, chapter_id, type, title, duration_min, is_premium, order_index'
  const FULL_COLS = `${METADATA_COLS}, content, video_url`

  const { data: lessons } = await supabase
    .from('lessons')
    .select(user ? FULL_COLS : METADATA_COLS)
    .eq('chapter_id', chapterId)
    .order('order_index')

  const subjectName = (chapter.subjects as { name?: string } | null)?.name ?? 'Matière'
  const lessonList = (lessons ?? []) as unknown as (Lesson & { type: LessonType })[]

  const breadcrumb = (
    <nav className="mb-6 flex flex-wrap items-center gap-1.5 text-sm">
      <Link href="/cours" className="font-medium text-blue-600 hover:underline">
        Cours
      </Link>
      <span className="text-gray-300">›</span>
      <Link
        href={`/cours/matiere/${subjectId}`}
        className="font-medium text-blue-600 hover:underline"
      >
        {subjectName}
      </Link>
      <span className="text-gray-300">›</span>
      <span className="font-semibold text-gray-700">{chapter.title}</span>
    </nav>
  )

  const chapterHero = (
    <div className="relative mb-8 overflow-hidden rounded-[2rem] border border-amber-200/70 bg-gradient-to-br from-[#fff8e8] via-white to-[#edf7ef] px-6 py-7 shadow-sm sm:px-9 sm:py-9">
      <div
        className="absolute -right-10 -top-12 h-48 w-48 rounded-full bg-amber-200/25 blur-2xl"
        aria-hidden="true"
      />
      <div className="relative">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white/80 px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.16em] text-amber-800">
          <BookOpen className="h-4 w-4" aria-hidden="true" />
          Parcours d’apprentissage
        </div>
        <h1 className="max-w-3xl text-2xl font-black leading-tight text-[#183b32] sm:text-3xl">
          {chapter.title}
        </h1>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-[#e6f2e9] px-3 py-1.5 text-sm font-bold text-[#286349]">
            {subjectName}
          </span>
          <span className="rounded-full bg-white/80 px-3 py-1.5 text-sm font-semibold text-[#776b54]">
            {lessonList.length} étape{lessonList.length !== 1 ? 's' : ''} pour apprendre
          </span>
        </div>
        {chapter.description && (
          <p className="mt-5 max-w-2xl text-base leading-7 text-[#615d51]">{chapter.description}</p>
        )}
      </div>
    </div>
  )

  /* ── Visiteur sans compte : sommaire visible, lecture après inscription ──
     On montre ce que contient le chapitre (nombre et nature des blocs) pour
     que la valeur soit tangible avant de demander la création d'un compte. */
  if (!user) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        {breadcrumb}
        {chapterHero}

        <div className="mb-8 space-y-2">
          {lessonList.map((l) => {
            const meta = BLOCK_LABEL[l.type] ?? { icon: '📄', label: l.type }
            return (
              <div
                key={l.id}
                className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4"
              >
                <span className="text-xl" aria-hidden="true">
                  {meta.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-gray-800">{l.title}</p>
                  <p className="mt-0.5 text-xs text-gray-400">
                    {meta.label}
                    {l.duration_min ? ` · ${l.duration_min} min` : ''}
                  </p>
                </div>
                <Lock
                  className="h-4 w-4 flex-shrink-0 text-gray-300"
                  strokeWidth={2}
                  aria-hidden="true"
                />
              </div>
            )
          })}
          {lessonList.length === 0 && (
            <p className="text-sm text-gray-400">Ce chapitre n'a pas encore de contenu.</p>
          )}
        </div>

        <div className="rounded-2xl border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-violet-50 p-6 text-center">
          <p className="mb-1 text-lg font-black text-gray-900">Lis ce chapitre gratuitement</p>
          <p className="mb-5 text-sm text-gray-600">
            Crée un compte gratuit pour ouvrir les leçons, suivre ta progression et t'entraîner sur
            les exercices.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href={`/register?next=${encodeURIComponent(`/cours/matiere/${subjectId}/${chapterId}`)}`}
              className="rounded-xl bg-[#172554] px-5 py-2.5 font-bold text-white transition-all hover:brightness-125"
            >
              Créer un compte gratuit
            </Link>
            <Link
              href={`/login?next=${encodeURIComponent(`/cours/matiere/${subjectId}/${chapterId}`)}`}
              className="px-4 py-2.5 font-semibold text-blue-700 hover:underline"
            >
              J'ai déjà un compte
            </Link>
          </div>
        </div>
      </div>
    )
  }

  /* Le QCM de fin de chapitre (migration 053) n'est interrogé que pour un
     utilisateur connecté : le rôle anonyme n'a pas de privilège sur `quizzes`. */
  const [{ data: progress }, { data: chapterQuiz }] = await Promise.all([
    supabase.from('lesson_progress').select('lesson_id, completed, score').eq('user_id', user.id),
    supabase
      .from('quizzes')
      .select('id, title, time_limit_sec, quiz_questions(count)')
      .eq('chapter_id', chapterId)
      .maybeSingle(),
  ])

  const initialDone: Record<string, { completed: boolean; score: number | null }> = {}
  for (const p of progress ?? [])
    initialDone[p.lesson_id] = { completed: p.completed, score: p.score }

  // Un QCM sans question n'est pas proposé — il mènerait à un écran vide.
  const quizCount =
    (chapterQuiz?.quiz_questions as unknown as Array<{ count: number }> | null)?.[0]?.count ?? 0
  const quiz = chapterQuiz && quizCount > 0 ? { ...chapterQuiz, count: quizCount } : null

  return (
    <div className="min-h-screen bg-[#fffdf8] px-4 py-8">
      <div className="mx-auto max-w-4xl">
        {breadcrumb}
        {chapterHero}

        <LessonBlocks
          lessons={lessonList}
          initialDone={initialDone}
          subjectId={subjectId}
          chapterId={chapterId}
        />

        {quiz && (
          <Link
            href={`/quiz/${quiz.id}`}
            className="mt-8 flex items-center gap-4 rounded-2xl border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-violet-50 px-5 py-4 transition-all hover:border-blue-400 hover:shadow-md"
          >
            <span className="text-2xl" aria-hidden="true">
              ✅
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-gray-900">{quiz.title}</p>
              <p className="text-xs text-gray-500">
                {quiz.count} question{quiz.count !== 1 ? 's' : ''} ·{' '}
                {Math.round(quiz.time_limit_sec / 60)} min · corrigé automatiquement
              </p>
            </div>
            <span className="font-bold text-blue-600">→</span>
          </Link>
        )}
      </div>
    </div>
  )
}
