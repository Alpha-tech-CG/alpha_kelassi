import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Lesson, LessonType } from '@alpha-kelassi/types'
import { LessonBlocks } from './lesson-blocks'
import { Lock } from 'lucide-react'

const BLOCK_LABEL: Record<string, { icon: string; label: string }> = {
  cours:  { icon: '📖', label: 'Cours'   },
  resume: { icon: '📝', label: 'Résumé'  },
  fiche:  { icon: '🗂️', label: 'Fiche'   },
  quiz:   { icon: '✅', label: 'Quiz'    },
  video:  { icon: '🎥', label: 'Vidéo'   },
}

export default async function ChapterPage({ params }: { params: Promise<{ subjectId: string; chapterId: string }> }) {
  const { subjectId, chapterId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: chapter } = await supabase
    .from('chapters').select('id, title, description, subject_id, subjects(name)')
    .eq('id', chapterId).maybeSingle()
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
    <nav className="flex items-center gap-1.5 text-sm mb-6 flex-wrap">
      <Link href="/cours" className="text-blue-600 hover:underline font-medium">Cours</Link>
      <span className="text-gray-300">›</span>
      <Link href={`/cours/matiere/${subjectId}`} className="text-blue-600 hover:underline font-medium">{subjectName}</Link>
      <span className="text-gray-300">›</span>
      <span className="text-gray-700 font-semibold">{chapter.title}</span>
    </nav>
  )

  /* ── Visiteur sans compte : sommaire visible, lecture après inscription ──
     On montre ce que contient le chapitre (nombre et nature des blocs) pour
     que la valeur soit tangible avant de demander la création d'un compte. */
  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        {breadcrumb}
        <h1 className="text-2xl font-black text-gray-900 mb-1">{chapter.title}</h1>
        {chapter.description && <p className="text-gray-400 text-sm mb-8">{chapter.description}</p>}

        <div className="space-y-2 mb-8">
          {lessonList.map((l) => {
            const meta = BLOCK_LABEL[l.type] ?? { icon: '📄', label: l.type }
            return (
              <div key={l.id} className="flex items-center gap-3 bg-white rounded-2xl border border-gray-100 p-4">
                <span className="text-xl" aria-hidden="true">{meta.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-gray-800">{l.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {meta.label}
                    {l.duration_min ? ` · ${l.duration_min} min` : ''}
                  </p>
                </div>
                <Lock className="w-4 h-4 text-gray-300 flex-shrink-0" strokeWidth={2} aria-hidden="true" />
              </div>
            )
          })}
          {lessonList.length === 0 && (
            <p className="text-sm text-gray-400">Ce chapitre n'a pas encore de contenu.</p>
          )}
        </div>

        <div className="rounded-2xl border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-violet-50 p-6 text-center">
          <p className="font-black text-gray-900 text-lg mb-1">Lis ce chapitre gratuitement</p>
          <p className="text-sm text-gray-600 mb-5">
            Crée un compte gratuit pour ouvrir les leçons, suivre ta progression et t'entraîner sur les exercices.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link
              href={`/register?next=${encodeURIComponent(`/cours/matiere/${subjectId}/${chapterId}`)}`}
              className="bg-[#172554] text-white font-bold px-5 py-2.5 rounded-xl hover:brightness-125 transition-all"
            >
              Créer un compte gratuit
            </Link>
            <Link
              href={`/login?next=${encodeURIComponent(`/cours/matiere/${subjectId}/${chapterId}`)}`}
              className="text-blue-700 font-semibold px-4 py-2.5 hover:underline"
            >
              J'ai déjà un compte
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const { data: progress } = await supabase
    .from('lesson_progress')
    .select('lesson_id, completed, score')
    .eq('user_id', user.id)

  const initialDone: Record<string, { completed: boolean; score: number | null }> = {}
  for (const p of progress ?? []) initialDone[p.lesson_id] = { completed: p.completed, score: p.score }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {breadcrumb}
      <h1 className="text-2xl font-black text-gray-900 mb-1">{chapter.title}</h1>
      {chapter.description && <p className="text-gray-400 text-sm mb-8">{chapter.description}</p>}

      <LessonBlocks lessons={lessonList} initialDone={initialDone} />
    </div>
  )
}
