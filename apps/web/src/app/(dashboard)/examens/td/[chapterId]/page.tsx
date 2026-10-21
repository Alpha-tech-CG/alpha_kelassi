'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { MarkdownRenderer } from '@/components/markdown-renderer'

/**
 * TD d'un chapitre (espace Prépa, version web de `apps/mobile/src/app/exercices`).
 *
 * L'élève ne voit que l'énoncé. Il écrit et valide sa réponse : la tentative
 * enregistrée rend le corrigé lisible (RLS), mais celui-ci ne s'ouvre que s'il
 * le demande — jamais automatiquement. La réponse écrite reste dans ce navigateur.
 */

interface Exercise { id: string; title: string; statement: string; difficulty: number; order_index: number }

const DIFF: Record<number, { label: string; cls: string }> = {
  1: { label: 'Facile',    cls: 'bg-green-50 text-green-700' },
  2: { label: 'Moyen',     cls: 'bg-amber-50 text-amber-700' },
  3: { label: 'Difficile', cls: 'bg-red-50 text-red-700' },
}
const MIN_ANSWER = 2

export default function TdChapterPage({ params }: { params: Promise<{ chapterId: string }> }) {
  const { chapterId } = use(params)
  const supabase = createClient()
  const storageKey = `exercise-answers:${chapterId}`

  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState('Exercices')
  const [subjectId, setSubjectId] = useState<string | null>(null)
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [drafts, setDrafts] = useState<Record<string, string>>({})
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [attempted, setAttempted] = useState<Record<string, boolean>>({})
  const [solutions, setSolutions] = useState<Record<string, string>>({})
  const [busy, setBusy] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    ;(async () => {
      const [{ data: chapter }, { data: rows }, { data: { user } }] = await Promise.all([
        supabase.from('chapters').select('title, subject_id').eq('id', chapterId).maybeSingle(),
        supabase.from('exercises').select('id, title, statement, difficulty, order_index')
          .eq('chapter_id', chapterId).is('deleted_at', null).order('order_index'),
        supabase.auth.getUser(),
      ])
      const list = (rows ?? []) as unknown as Exercise[]
      const ch = chapter as unknown as { title?: string; subject_id?: string } | null
      let done: Record<string, boolean> = {}
      if (user && list.length > 0) {
        const { data: att } = await supabase.from('exercise_attempts').select('exercise_id')
          .eq('user_id', user.id).in('exercise_id', list.map((e) => e.id))
        done = Object.fromEntries(((att ?? []) as unknown as { exercise_id: string }[]).map((a) => [a.exercise_id, true]))
      }
      let saved: Record<string, string> = {}
      try { saved = JSON.parse(localStorage.getItem(storageKey) ?? '{}') as Record<string, string> } catch { /* rien de gardé */ }
      if (!active) return
      setTitle(ch?.title ?? 'Exercices')
      setSubjectId(ch?.subject_id ?? null)
      setExercises(list)
      setAttempted(done)
      setAnswers(saved)
      setLoading(false)
    })()
    return () => { active = false }
  }, [chapterId, storageKey, supabase])

  async function submit(ex: Exercise) {
    const answer = (drafts[ex.id] ?? '').trim()
    if (answer.length < MIN_ANSWER || busy) return
    setBusy(ex.id); setError(null)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setError('Connecte-toi pour enregistrer ta réponse.'); return }
      const { error: err } = await supabase.from('exercise_attempts')
        .upsert({ user_id: user.id, exercise_id: ex.id } as never, { onConflict: 'user_id,exercise_id', ignoreDuplicates: true })
      if (err) { setError('Réponse non enregistrée. Vérifie ta connexion et réessaie.'); return }
      const next = { ...answers, [ex.id]: answer }
      setAnswers(next)
      setAttempted((a) => ({ ...a, [ex.id]: true }))
      try { localStorage.setItem(storageKey, JSON.stringify(next)) } catch { /* stockage indisponible */ }
    } finally {
      setBusy(null)
    }
  }

  async function openSolution(ex: Exercise) {
    setBusy(ex.id); setError(null)
    try {
      const { data, error: err } = await supabase.from('exercise_solutions').select('solution').eq('exercise_id', ex.id).maybeSingle()
      const sol = (data as unknown as { solution?: string } | null)?.solution
      if (err || !sol) { setError('Corrigé indisponible pour le moment (il peut être réservé aux abonnés).'); return }
      setSolutions((s) => ({ ...s, [ex.id]: sol }))
    } finally {
      setBusy(null)
    }
  }

  if (loading) return <div className="p-6 text-gray-500">Chargement des exercices…</div>

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <nav className="flex items-center gap-1.5 text-sm mb-6 flex-wrap">
        <Link href="/examens" className="text-emerald-700 hover:underline font-medium">Prépa</Link>
        <span className="text-gray-300">›</span>
        <Link href={subjectId ? `/examens?rayon=td&subject=${subjectId}` : '/examens?rayon=td'} className="text-emerald-700 hover:underline font-medium">TD</Link>
        <span className="text-gray-300">›</span>
        <span className="text-gray-700 font-semibold">{title}</span>
      </nav>
      <h1 className="text-2xl font-black text-gray-900 mb-1">{title}</h1>
      <p className="text-gray-500 text-sm mb-6">Écris ta réponse et valide-la : tu pourras ensuite ouvrir le corrigé pour comparer.</p>

      {error && <div className="p-3 bg-red-50 text-red-700 rounded-xl text-sm mb-4">{error}</div>}

      {exercises.length === 0 ? (
        <p className="text-center text-gray-400 py-16">Pas d&apos;exercice accessible dans ce chapitre.</p>
      ) : (
        <div className="space-y-5">
          {exercises.map((ex, i) => {
            const d = DIFF[ex.difficulty] ?? DIFF[1]
            const answered = answers[ex.id]
            return (
              <article key={ex.id} className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <h2 className="font-black text-gray-900">{i + 1}. {ex.title}</h2>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${d.cls}`}>{d.label}</span>
                </div>
                <MarkdownRenderer content={ex.statement} className="text-sm text-gray-800" />

                {answered ? (
                  <div className="mt-4 bg-gray-50 rounded-xl p-3">
                    <p className="text-xs font-bold text-gray-500 mb-1">Ta réponse</p>
                    <p className="text-sm text-gray-800 whitespace-pre-wrap">{answered}</p>
                  </div>
                ) : (
                  <div className="mt-4">
                    <textarea value={drafts[ex.id] ?? ''} onChange={(e) => setDrafts((x) => ({ ...x, [ex.id]: e.target.value }))}
                      rows={4} placeholder="Écris ta réponse ici…"
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm" />
                    <button onClick={() => submit(ex)} disabled={busy === ex.id || (drafts[ex.id] ?? '').trim().length < MIN_ANSWER}
                      className="mt-2 bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-sm disabled:opacity-50">
                      {busy === ex.id ? '…' : 'Valider ma réponse'}
                    </button>
                  </div>
                )}

                {solutions[ex.id] ? (
                  <div className="mt-4 border-t border-gray-100 pt-4">
                    <p className="text-xs font-bold text-emerald-700 mb-2">Corrigé</p>
                    <MarkdownRenderer content={solutions[ex.id]} className="text-sm text-gray-800" />
                  </div>
                ) : (attempted[ex.id] || answered) && (
                  <button onClick={() => openSolution(ex)} disabled={busy === ex.id}
                    className="mt-3 text-sm font-bold text-emerald-700 hover:underline disabled:opacity-50">
                    Voir le corrigé
                  </button>
                )}
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
