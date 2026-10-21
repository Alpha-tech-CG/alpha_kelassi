'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { MarkdownRenderer } from '@/components/markdown-renderer'
import type { Lesson, LessonType } from '@alpha-kelassi/types'

interface Props {
  lessons: (Lesson & { type: LessonType })[]
  initialDone: Record<string, { completed: boolean; score: number | null }>
  subjectId: string
  chapterId: string
}

const ORDER: { type: LessonType; icon: string; label: string }[] = [
  { type: 'cours', icon: '📖', label: 'Cours complet' },
  { type: 'resume', icon: '📝', label: 'Résumé' },
  { type: 'quiz', icon: '✅', label: 'Quiz' },
  { type: 'video', icon: '🎥', label: 'Vidéo' },
]

function youtubeEmbed(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/)
  return m ? `https://www.youtube.com/embed/${m[1]}` : null
}

export function LessonBlocks({ lessons, initialDone, subjectId, chapterId }: Props) {
  const supabase = createClient()
  const [done, setDone] = useState(initialDone)
  const [busy, setBusy] = useState<string | null>(null)
  const [flash, setFlash] = useState<string | null>(null)
  const [quizScores, setQuizScores] = useState<Record<string, number>>({})
  const [openSub, setOpenSub] = useState<string | null>(null) // sous-chapitre ouvert (drill-down)

  const grouped = useMemo(() => {
    const g: Record<LessonType, (Lesson & { type: LessonType })[]> = {
      cours: [],
      resume: [],
      quiz: [],
      video: [],
    }
    for (const l of [...lessons].sort((a, b) => a.order_index - b.order_index)) g[l.type].push(l)
    return g
  }, [lessons])

  const nothingDone = Object.values(done).every((d) => !d?.completed) && lessons.length > 0

  async function complete(lessonId: string, score?: number) {
    setBusy(lessonId)
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      const res = await fetch(`/api/curriculum/lessons/${lessonId}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session ? { Authorization: `Bearer ${session.access_token}` } : {}),
        },
        credentials: 'include',
        body: JSON.stringify(score !== undefined ? { score } : {}),
      })
      const json = await res.json()
      if (!res.ok) {
        setFlash(json?.error?.message ?? 'Erreur, réessaie.')
        return
      }
      setDone((prev) => ({ ...prev, [lessonId]: { completed: true, score: score ?? null } }))
      const xp = json?.data?.xp_awarded ?? 0
      setFlash(
        json?.data?.chapter_completed
          ? '🎓 Chapitre complété à 100 % ! +' + xp + ' XP'
          : xp > 0
            ? `+${xp} XP`
            : 'Enregistré ✓'
      )
    } catch {
      setFlash('Connexion impossible. Réessaie.')
    } finally {
      setBusy(null)
      setTimeout(() => setFlash(null), 3000)
    }
  }

  if (lessons.length === 0) {
    return (
      <p className="py-12 text-center text-gray-400">Contenu de ce chapitre bientôt disponible.</p>
    )
  }

  // Mode drill-down : plusieurs cours = plusieurs sous-chapitres (ex. Maths Terminale)
  const coursList = [...lessons]
    .filter((l) => l.type === 'cours')
    .sort((a, b) => a.order_index - b.order_index)
  const subMode = coursList.length > 1
  const openLesson = openSub ? (lessons.find((l) => l.id === openSub) ?? null) : null

  function exerciseHref(lessonId: string) {
    return `/cours/matiere/${subjectId}/${chapterId}/exercices?lessonId=${encodeURIComponent(lessonId)}`
  }

  function exercisesLink(lesson: Lesson) {
    return (
      <Link
        href={exerciseHref(lesson.id)}
        className="mt-5 flex items-center justify-between gap-4 rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 p-4 transition-all hover:border-emerald-400 hover:shadow-sm"
      >
        <span className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-xl shadow-sm">
            ✍️
          </span>
          <span>
            <span className="block font-bold text-emerald-950">Exercices d’application</span>
            <span className="mt-0.5 block text-xs leading-5 text-emerald-800">
              Mets en pratique les notions de ce cours et consulte le corrigé détaillé.
            </span>
          </span>
        </span>
        <span aria-hidden="true" className="shrink-0 text-xl font-bold text-emerald-700">
          →
        </span>
      </Link>
    )
  }

  if (subMode) {
    return (
      <div className="space-y-4">
        {flash && (
          <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-lg">
            {flash}
          </div>
        )}
        {openLesson ? (
          <div className="space-y-4">
            <button
              onClick={() => setOpenSub(null)}
              className="text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              ← Sous-chapitres
            </button>
            <section
              id={`lesson-${openLesson.id}`}
              className="rounded-[1.75rem] border border-amber-100 bg-white p-5 shadow-[0_12px_40px_-30px_rgba(73,57,25,0.35)] sm:p-8"
            >
              <h2 className="mb-5 border-b border-amber-100 pb-4 text-lg font-extrabold leading-snug text-[#24483b]">
                {openLesson.title}
              </h2>
              {openLesson.content && (
                <MarkdownRenderer content={openLesson.content} prose className="course-prose" />
              )}
              <div className="mt-4">
                {done[openLesson.id]?.completed ? (
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-green-600">
                    ✅ Complété
                  </span>
                ) : (
                  <button
                    onClick={() => complete(openLesson.id)}
                    disabled={busy === openLesson.id}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                  >
                    {busy === openLesson.id ? '…' : 'Marquer comme lu'}
                  </button>
                )}
              </div>
              {openLesson.type === 'cours' && exercisesLink(openLesson)}
            </section>
          </div>
        ) : (
          <div className="space-y-3">
            {coursList.map((l) => (
              <button
                key={l.id}
                onClick={() => setOpenSub(l.id)}
                className="group flex w-full items-center justify-between gap-3 rounded-2xl border border-amber-100 bg-white px-5 py-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md"
              >
                <span className="font-bold text-[#24483b]">{l.title}</span>
                <span className="shrink-0 text-xl text-emerald-700 transition-transform group-hover:translate-x-0.5">
                  {done[l.id]?.completed ? '✅' : '›'}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {nothingDone && (
        <div className="rounded-xl border border-blue-100 bg-blue-50 p-3 text-sm text-blue-700">
          👉 Commence par le <strong>cours</strong>, puis enchaîne résumé, quiz et vidéo.
        </div>
      )}
      {flash && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-lg">
          {flash}
        </div>
      )}

      {ORDER.map(({ type, icon, label }) => {
        const items = grouped[type]
        if (items.length === 0) return null
        return (
          <section
            key={type}
            className="overflow-hidden rounded-[1.75rem] border border-amber-100 bg-white shadow-[0_12px_40px_-30px_rgba(73,57,25,0.35)]"
          >
            <header className="flex items-center gap-3 border-b border-amber-100 bg-gradient-to-r from-[#fff8e8] to-[#f3f8ed] px-5 py-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-xl shadow-sm">
                {icon}
              </span>
              <h2 className="font-extrabold text-[#24483b]">{label}</h2>
            </header>
            <div className="space-y-7 p-5 sm:p-7">
              {items.map((l) => {
                const isDone = done[l.id]?.completed
                const embed = l.video_url ? youtubeEmbed(l.video_url) : null
                return (
                  <div key={l.id} id={`lesson-${l.id}`}>
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <h3 className="font-bold leading-snug text-[#355348]">{l.title}</h3>
                      {l.duration_min ? (
                        <span className="shrink-0 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800">
                          {l.duration_min} min
                        </span>
                      ) : null}
                    </div>

                    {/* Contenu cours / résumé */}
                    {(type === 'cours' || type === 'resume') && l.content && (
                      <MarkdownRenderer content={l.content} prose className="course-prose" />
                    )}

                    {/* Vidéo */}
                    {type === 'video' &&
                      l.video_url &&
                      (embed ? (
                        <div className="aspect-video overflow-hidden rounded-xl bg-black">
                          <iframe
                            src={embed}
                            className="h-full w-full"
                            allowFullScreen
                            title={l.title}
                          />
                        </div>
                      ) : (
                        <video src={l.video_url} controls className="w-full rounded-xl" />
                      ))}

                    {/* Quiz (schéma texte — voir note) */}
                    {type === 'quiz' && (
                      <div className="space-y-3">
                        {l.content && (
                          <MarkdownRenderer content={l.content} prose className="course-prose" />
                        )}
                        {!isDone && (
                          <div className="flex items-center gap-2">
                            <label className="text-sm text-gray-500">Ton score :</label>
                            <input
                              type="number"
                              min={0}
                              max={100}
                              value={quizScores[l.id] ?? ''}
                              onChange={(e) =>
                                setQuizScores((p) => ({
                                  ...p,
                                  [l.id]: Math.max(0, Math.min(100, Number(e.target.value))),
                                }))
                              }
                              className="w-20 rounded-lg border px-2 py-1 text-sm"
                              placeholder="0-100"
                            />
                            <span className="text-sm text-gray-400">/ 100</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Action complétion */}
                    <div className="mt-3">
                      {isDone ? (
                        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-green-600">
                          ✅ Complété
                          {type === 'quiz' && done[l.id]?.score != null
                            ? ` — ${done[l.id]?.score}%`
                            : ''}
                        </span>
                      ) : (
                        <button
                          onClick={() =>
                            complete(l.id, type === 'quiz' ? (quizScores[l.id] ?? 0) : undefined)
                          }
                          disabled={busy === l.id}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                        >
                          {busy === l.id
                            ? '…'
                            : type === 'cours'
                              ? 'Marquer comme lu'
                              : type === 'video'
                                ? 'Marquer comme visionné'
                                : type === 'quiz'
                                  ? 'Valider le quiz'
                                  : 'Marquer comme fait'}
                        </button>
                      )}
                    </div>
                    {type === 'cours' && exercisesLink(l)}
                  </div>
                )
              })}
            </div>
          </section>
        )
      })}
    </div>
  )
}
