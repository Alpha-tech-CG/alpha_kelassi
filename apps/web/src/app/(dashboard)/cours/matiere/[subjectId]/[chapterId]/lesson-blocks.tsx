'use client'

import { useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { MarkdownRenderer } from '@/components/markdown-renderer'
import type { Lesson, LessonType } from '@alpha-kelassi/types'

interface Props {
  lessons: (Lesson & { type: LessonType })[]
  initialDone: Record<string, { completed: boolean; score: number | null }>
}

const ORDER: { type: LessonType; icon: string; label: string }[] = [
  { type: 'cours',  icon: '📖', label: 'Cours complet' },
  { type: 'resume', icon: '📝', label: 'Résumé' },
  { type: 'quiz',   icon: '✅', label: 'Quiz' },
  { type: 'video',  icon: '🎥', label: 'Vidéo' },
]

function youtubeEmbed(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/)
  return m ? `https://www.youtube.com/embed/${m[1]}` : null
}

export function LessonBlocks({ lessons, initialDone }: Props) {
  const supabase = createClient()
  const [done, setDone] = useState(initialDone)
  const [busy, setBusy] = useState<string | null>(null)
  const [flash, setFlash] = useState<string | null>(null)
  const [quizScores, setQuizScores] = useState<Record<string, number>>({})

  const grouped = useMemo(() => {
    const g: Record<LessonType, (Lesson & { type: LessonType })[]> = { cours: [], resume: [], quiz: [], video: [] }
    for (const l of [...lessons].sort((a, b) => a.order_index - b.order_index)) g[l.type].push(l)
    return g
  }, [lessons])

  const nothingDone = Object.values(done).every((d) => !d?.completed) && lessons.length > 0

  async function complete(lessonId: string, score?: number) {
    setBusy(lessonId)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const res = await fetch(`/api/curriculum/lessons/${lessonId}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(session ? { Authorization: `Bearer ${session.access_token}` } : {}) },
        credentials: 'include',
        body: JSON.stringify(score !== undefined ? { score } : {}),
      })
      const json = await res.json()
      if (!res.ok) { setFlash(json?.error?.message ?? 'Erreur, réessaie.'); return }
      setDone((prev) => ({ ...prev, [lessonId]: { completed: true, score: score ?? null } }))
      const xp = json?.data?.xp_awarded ?? 0
      setFlash(json?.data?.chapter_completed ? '🎓 Chapitre complété à 100 % ! +' + xp + ' XP' : xp > 0 ? `+${xp} XP` : 'Enregistré ✓')
    } catch {
      setFlash('Connexion impossible. Réessaie.')
    } finally {
      setBusy(null)
      setTimeout(() => setFlash(null), 3000)
    }
  }

  if (lessons.length === 0) {
    return <p className="text-center text-gray-400 py-12">Contenu de ce chapitre bientôt disponible.</p>
  }

  return (
    <div className="space-y-6">
      {nothingDone && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-sm text-blue-700">
          👉 Commence par le <strong>cours</strong>, puis enchaîne résumé, quiz et vidéo.
        </div>
      )}
      {flash && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-full shadow-lg">
          {flash}
        </div>
      )}

      {ORDER.map(({ type, icon, label }) => {
        const items = grouped[type]
        if (items.length === 0) return null
        return (
          <section key={type} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <header className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 bg-gray-50">
              <span className="text-lg">{icon}</span>
              <h2 className="font-bold text-gray-800">{label}</h2>
            </header>
            <div className="p-4 space-y-6">
              {items.map((l) => {
                const isDone = done[l.id]?.completed
                const embed = l.video_url ? youtubeEmbed(l.video_url) : null
                return (
                  <div key={l.id}>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-gray-800">{l.title}</h3>
                      {l.duration_min ? <span className="text-xs text-gray-400 shrink-0">{l.duration_min} min</span> : null}
                    </div>

                    {/* Contenu cours / résumé */}
                    {(type === 'cours' || type === 'resume') && l.content && (
                      <MarkdownRenderer content={l.content} prose />
                    )}

                    {/* Vidéo */}
                    {type === 'video' && l.video_url && (
                      embed
                        ? <div className="aspect-video rounded-xl overflow-hidden bg-black">
                            <iframe src={embed} className="w-full h-full" allowFullScreen title={l.title} />
                          </div>
                        : <video src={l.video_url} controls className="w-full rounded-xl" />
                    )}

                    {/* Quiz (schéma texte — voir note) */}
                    {type === 'quiz' && (
                      <div className="space-y-3">
                        {l.content && <MarkdownRenderer content={l.content} prose />}
                        {!isDone && (
                          <div className="flex items-center gap-2">
                            <label className="text-sm text-gray-500">Ton score :</label>
                            <input type="number" min={0} max={100}
                              value={quizScores[l.id] ?? ''}
                              onChange={(e) => setQuizScores((p) => ({ ...p, [l.id]: Math.max(0, Math.min(100, Number(e.target.value))) }))}
                              className="w-20 border rounded-lg px-2 py-1 text-sm" placeholder="0-100" />
                            <span className="text-sm text-gray-400">/ 100</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Action complétion */}
                    <div className="mt-3">
                      {isDone ? (
                        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-green-600">
                          ✅ Complété{type === 'quiz' && done[l.id]?.score != null ? ` — ${done[l.id]?.score}%` : ''}
                        </span>
                      ) : (
                        <button
                          onClick={() => complete(l.id, type === 'quiz' ? (quizScores[l.id] ?? 0) : undefined)}
                          disabled={busy === l.id}
                          className="inline-flex items-center gap-1.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-4 py-2 rounded-xl transition-colors">
                          {busy === l.id ? '…' :
                            type === 'cours' ? 'Marquer comme lu' :
                            type === 'video' ? 'Marquer comme visionné' :
                            type === 'quiz'  ? 'Valider le quiz' : 'Marquer comme fait'}
                        </button>
                      )}
                    </div>
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
