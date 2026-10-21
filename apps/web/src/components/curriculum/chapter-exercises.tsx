'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { MarkdownRenderer } from '@/components/markdown-renderer'

interface Exercise {
  id: string
  title: string
  statement: string
  difficulty: number
  order_index: number
}

interface Props {
  chapterId: string
  chapterTitle: string
  subjectId: string
  subjectName: string
  courseLessonId?: string
  courseLessonTitle?: string
  returnToCourse: boolean
}

const DIFFICULTIES: Record<number, { label: string; className: string }> = {
  1: { label: 'Facile', className: 'bg-green-50 text-green-700' },
  2: { label: 'Moyen', className: 'bg-amber-50 text-amber-700' },
  3: { label: 'Difficile', className: 'bg-red-50 text-red-700' },
}
const MIN_ANSWER = 2

export function ChapterExercises({
  chapterId,
  chapterTitle,
  subjectId,
  subjectName,
  courseLessonId,
  courseLessonTitle,
  returnToCourse,
}: Props) {
  const supabase = useMemo(() => createClient(), [])
  const storageKey = `exercise-answers:${chapterId}`

  const [loading, setLoading] = useState(true)
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [drafts, setDrafts] = useState<Record<string, string>>({})
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [attempted, setAttempted] = useState<Record<string, boolean>>({})
  const [solutions, setSolutions] = useState<Record<string, string>>({})
  const [busy, setBusy] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    async function load() {
      setLoading(true)
      setError(null)

      const [{ data: rows, error: exercisesError }, { data: auth, error: authError }] =
        await Promise.all([
          supabase
            .from('exercises')
            .select('id, title, statement, difficulty, order_index')
            .eq('chapter_id', chapterId)
            .is('deleted_at', null)
            .order('order_index'),
          supabase.auth.getUser(),
        ])

      if (!active) return
      if (exercisesError) {
        console.error('[chapter-exercises] exercise lookup failed', exercisesError)
        setError('Impossible de charger les exercices. Réessaie dans un instant.')
        setLoading(false)
        return
      }
      if (authError) {
        console.error('[chapter-exercises] user lookup failed', authError)
        setError('Impossible de vérifier ta session. Reconnecte-toi puis réessaie.')
        setLoading(false)
        return
      }

      const list = (rows ?? []) as unknown as Exercise[]
      let done: Record<string, boolean> = {}
      if (auth.user && list.length > 0) {
        const { data: attempts, error: attemptsError } = await supabase
          .from('exercise_attempts')
          .select('exercise_id')
          .eq('user_id', auth.user.id)
          .in(
            'exercise_id',
            list.map((exercise) => exercise.id)
          )

        if (!active) return
        if (attemptsError) {
          console.error('[chapter-exercises] attempts lookup failed', attemptsError)
          setError('Impossible de charger tes tentatives. Réessaie dans un instant.')
          setLoading(false)
          return
        }
        done = Object.fromEntries(
          ((attempts ?? []) as unknown as { exercise_id: string }[]).map((attempt) => [
            attempt.exercise_id,
            true,
          ])
        )
      }

      let saved: Record<string, string> = {}
      try {
        const value: unknown = JSON.parse(localStorage.getItem(storageKey) ?? '{}')
        if (value && typeof value === 'object' && !Array.isArray(value)) {
          saved = Object.fromEntries(
            Object.entries(value).filter(
              (entry): entry is [string, string] => typeof entry[1] === 'string'
            )
          )
        }
      } catch {
        saved = {}
      }

      if (!active) return
      setExercises(list)
      setAttempted(done)
      setAnswers(saved)
      setLoading(false)
    }

    void load()
    return () => {
      active = false
    }
  }, [chapterId, storageKey, supabase])

  async function submit(exercise: Exercise) {
    const answer = (drafts[exercise.id] ?? '').trim()
    if (answer.length < MIN_ANSWER || busy) return
    setBusy(exercise.id)
    setError(null)
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()
      if (authError) {
        console.error('[chapter-exercises] user lookup failed', authError)
        setError('Impossible de vérifier ta session. Reconnecte-toi puis réessaie.')
        return
      }
      if (!user) {
        setError('Connecte-toi pour enregistrer ta réponse.')
        return
      }

      const { error: attemptError } = await supabase
        .from('exercise_attempts')
        .upsert({ user_id: user.id, exercise_id: exercise.id } as never, {
          onConflict: 'user_id,exercise_id',
          ignoreDuplicates: true,
        })
      if (attemptError) {
        console.error('[chapter-exercises] attempt save failed', attemptError)
        setError('Réponse non enregistrée. Vérifie ta connexion et réessaie.')
        return
      }

      const next = { ...answers, [exercise.id]: answer }
      setAnswers(next)
      setAttempted((current) => ({ ...current, [exercise.id]: true }))
      try {
        localStorage.setItem(storageKey, JSON.stringify(next))
      } catch {
        setError('Réponse enregistrée, mais impossible de la conserver dans ce navigateur.')
      }
    } finally {
      setBusy(null)
    }
  }

  async function openSolution(exercise: Exercise) {
    setBusy(exercise.id)
    setError(null)
    try {
      const { data, error: solutionError } = await supabase
        .from('exercise_solutions')
        .select('solution')
        .eq('exercise_id', exercise.id)
        .maybeSingle()
      const solution = (data as unknown as { solution?: string } | null)?.solution
      if (solutionError) {
        console.error('[chapter-exercises] solution lookup failed', solutionError)
        setError('Impossible de charger le corrigé. Réessaie dans un instant.')
        return
      }
      if (!solution) {
        setError('Le corrigé détaillé de cet exercice n’est pas encore disponible.')
        return
      }
      setSolutions((current) => ({ ...current, [exercise.id]: solution }))
    } finally {
      setBusy(null)
    }
  }

  if (loading)
    return <div className="px-4 py-12 text-center text-gray-500">Chargement des exercices…</div>

  const backHref = returnToCourse
    ? courseLessonId
      ? `/cours/matiere/${subjectId}/${chapterId}#lesson-${courseLessonId}`
      : `/cours/matiere/${subjectId}/${chapterId}`
    : `/examens?rayon=td&subject=${subjectId}`

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <nav className="mb-6 flex flex-wrap items-center gap-1.5 text-sm">
        {returnToCourse ? (
          <>
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
            <Link
              href={`/cours/matiere/${subjectId}/${chapterId}`}
              className="font-medium text-blue-600 hover:underline"
            >
              {chapterTitle}
            </Link>
            <span className="text-gray-300">›</span>
            <span className="font-semibold text-gray-700">Exercices d’application</span>
          </>
        ) : (
          <>
            <Link href="/examens" className="font-medium text-emerald-700 hover:underline">
              Prépa
            </Link>
            <span className="text-gray-300">›</span>
            <Link
              href={`/examens?rayon=td&subject=${subjectId}`}
              className="font-medium text-emerald-700 hover:underline"
            >
              TD
            </Link>
            <span className="text-gray-300">›</span>
            <span className="font-semibold text-gray-700">{chapterTitle}</span>
          </>
        )}
      </nav>

      <Link
        href={backHref}
        className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-blue-700 hover:underline"
      >
        {returnToCourse
          ? `← Retour au cours${courseLessonTitle ? ` : ${courseLessonTitle}` : ''}`
          : '← Retour aux TD'}
      </Link>
      <div className="mb-6">
        <p className="mb-1 text-sm font-bold text-emerald-700">
          {subjectName} · {chapterTitle}
        </p>
        <h1 className="text-2xl font-black text-gray-900">Exercices d’application</h1>
        <p className="mt-2 text-sm leading-6 text-gray-600">
          Réponds aux exercices du chapitre. Après avoir validé ta réponse, tu pourras consulter le
          corrigé détaillé préparé à partir des notions du cours.
        </p>
      </div>

      {courseLessonTitle && (
        <div className="mb-5 rounded-2xl border border-blue-100 bg-blue-50/80 p-4">
          <p className="text-xs font-extrabold uppercase tracking-wide text-blue-700">
            Cours associé
          </p>
          <p className="mt-1 font-bold text-blue-950">{courseLessonTitle}</p>
          <p className="mt-1 text-sm text-blue-800">
            Appuie-toi sur les notions vues dans ce cours pour résoudre les exercices.
          </p>
        </div>
      )}

      {error && (
        <div role="alert" className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {exercises.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-gray-200 py-16 text-center text-gray-500">
          Aucun exercice n’est encore disponible pour ce chapitre.
        </p>
      ) : (
        <div className="space-y-5">
          {exercises.map((exercise, index) => {
            const difficulty = DIFFICULTIES[exercise.difficulty] ?? DIFFICULTIES[1]!
            const answer = answers[exercise.id]
            return (
              <article
                key={exercise.id}
                className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h2 className="font-black text-gray-900">
                    {index + 1}. {exercise.title}
                  </h2>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${difficulty.className}`}
                  >
                    {difficulty.label}
                  </span>
                </div>
                <MarkdownRenderer content={exercise.statement} className="text-sm text-gray-800" />

                {answer ? (
                  <div className="mt-4 rounded-xl bg-gray-50 p-3">
                    <p className="mb-1 text-xs font-bold text-gray-500">Ta réponse</p>
                    <p className="whitespace-pre-wrap text-sm text-gray-800">{answer}</p>
                  </div>
                ) : (
                  <div className="mt-4">
                    <label
                      htmlFor={`answer-${exercise.id}`}
                      className="mb-1.5 block text-sm font-semibold text-gray-700"
                    >
                      Ta réponse
                    </label>
                    <textarea
                      id={`answer-${exercise.id}`}
                      value={drafts[exercise.id] ?? ''}
                      onChange={(event) =>
                        setDrafts((current) => ({
                          ...current,
                          [exercise.id]: event.target.value,
                        }))
                      }
                      rows={4}
                      placeholder="Écris ta réponse ici…"
                      className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                    />
                    <button
                      onClick={() => void submit(exercise)}
                      disabled={
                        busy === exercise.id ||
                        (drafts[exercise.id] ?? '').trim().length < MIN_ANSWER
                      }
                      className="mt-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {busy === exercise.id ? 'Enregistrement…' : 'Valider ma réponse'}
                    </button>
                  </div>
                )}

                {solutions[exercise.id] ? (
                  <div className="mt-4 border-t border-gray-100 pt-4">
                    <p className="mb-2 text-xs font-extrabold uppercase tracking-wide text-emerald-700">
                      Justification et corrigé détaillé
                    </p>
                    <MarkdownRenderer
                      content={solutions[exercise.id]}
                      className="text-sm text-gray-800"
                    />
                  </div>
                ) : attempted[exercise.id] || answer ? (
                  <button
                    onClick={() => void openSolution(exercise)}
                    disabled={busy === exercise.id}
                    className="mt-3 text-sm font-bold text-emerald-700 hover:underline disabled:opacity-50"
                  >
                    {busy === exercise.id ? 'Chargement du corrigé…' : 'Voir la justification'}
                  </button>
                ) : null}
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
