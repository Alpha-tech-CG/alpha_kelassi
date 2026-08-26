'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { MarkdownEditor } from '@/app/admin/_components/markdown-editor'
import { MarkdownRenderer } from '@/components/markdown-renderer'

/**
 * QCM de fin de chapitre — console admin.
 *
 * Contrairement au bloc « quiz » d'une leçon (simple texte Markdown, sans
 * correction), ce QCM s'appuie sur les tables `quizzes`/`quiz_questions` :
 * l'élève est chronométré, corrigé et noté automatiquement.
 */

interface Question {
  id: string; position: number; prompt: string
  options: string[]; correct_index: number; explanation: string | null
}
interface Quiz {
  id: string; title: string; description: string | null
  time_limit_sec: number; is_premium: boolean; level: string
  quiz_questions: Question[]
}

const EMPTY_OPTIONS = ['', '', '', '']

export default function AdminChapterQuizPage() {
  const { chapterId } = useParams<{ chapterId: string }>()

  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState<string | null>(null)

  // Création du QCM
  const [title, setTitle] = useState('')
  const [minutes, setMinutes] = useState(10)
  const [premium, setPremium] = useState(false)

  // Ajout d'une question
  const [prompt, setPrompt] = useState('')
  const [options, setOptions] = useState<string[]>(EMPTY_OPTIONS)
  const [correct, setCorrect] = useState(0)
  const [explanation, setExplanation] = useState('')
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    const res = await fetch(`/api/admin/curriculum/quiz?chapterId=${chapterId}`, { credentials: 'include' })
    const json = await res.json()
    setQuiz(json.data ?? null)
    setLoading(false)
  }, [chapterId])
  useEffect(() => { load() }, [load])

  async function createQuiz(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true); setError(null)
    const res = await fetch('/api/admin/curriculum/quiz', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
      body: JSON.stringify({ chapter_id: chapterId, title, time_limit_sec: minutes * 60, is_premium: premium }),
    })
    const json = await res.json()
    setSaving(false)
    if (!res.ok) { setError(json.error?.message ?? 'Erreur'); return }
    setTitle(''); await load()
  }

  async function addQuestion(e: React.FormEvent) {
    e.preventDefault()
    if (!quiz) return
    const filled = options.map((o) => o.trim()).filter(Boolean)
    if (filled.length < 2) { setError('Il faut au moins deux options.'); return }
    if (!options[correct]?.trim()) { setError('La bonne réponse ne peut pas être une option vide.'); return }

    // L'index correct doit suivre les options réellement envoyées (les vides sont retirées).
    const kept = options.map((o, i) => ({ o: o.trim(), i })).filter((x) => x.o)
    const newCorrect = kept.findIndex((x) => x.i === correct)

    setSaving(true); setError(null)
    const res = await fetch('/api/admin/curriculum/quiz/questions', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
      body: JSON.stringify({
        quiz_id: quiz.id, prompt, options: kept.map((x) => x.o),
        correct_index: newCorrect, explanation: explanation || null,
      }),
    })
    const json = await res.json()
    setSaving(false)
    if (!res.ok) { setError(json.error?.message ?? 'Erreur'); return }
    setPrompt(''); setOptions(EMPTY_OPTIONS); setCorrect(0); setExplanation(''); await load()
  }

  async function delQuestion(id: string) {
    if (!confirm('Supprimer cette question ?')) return
    setBusy(id)
    const res = await fetch(`/api/admin/curriculum/quiz/questions?id=${id}`, { method: 'DELETE', credentials: 'include' })
    setBusy(null)
    if (res.ok) await load()
    else alert((await res.json()).error?.message ?? 'Erreur')
  }

  async function delQuiz() {
    if (!quiz) return
    if (!confirm(`Supprimer le QCM « ${quiz.title} » et ses ${quiz.quiz_questions.length} question(s) ?`)) return
    setBusy(quiz.id)
    const res = await fetch(`/api/admin/curriculum/quiz?id=${quiz.id}`, { method: 'DELETE', credentials: 'include' })
    setBusy(null)
    if (res.ok) { setQuiz(null); await load() }
    else alert((await res.json()).error?.message ?? 'Erreur')
  }

  if (loading) return <div className="px-8 py-8 text-sm text-gray-400">Chargement…</div>

  return (
    <div className="px-8 py-8 max-w-4xl">
      <Link href={`/admin/curriculum/chapter/${chapterId}`} className="text-sm text-gray-400 hover:text-gray-700">← Leçons du chapitre</Link>
      <h1 className="text-2xl font-black text-gray-900 mt-2 mb-1">QCM de fin de chapitre</h1>
      <p className="text-gray-500 text-sm mb-6">
        Corrigé et noté automatiquement, avec chrono — contrairement au bloc « quiz » d'une leçon, qui n'est qu'un texte.
        L'énoncé et le corrigé acceptent le Markdown : formules $…$, tableaux et schémas. Les options de réponse restent du texte simple.
      </p>

      {error && <div className="p-3 bg-red-50 text-red-700 rounded-xl text-sm mb-4">{error}</div>}

      {!quiz ? (
        /* ── Pas encore de QCM : on le crée ─────────────────────────────── */
        <form onSubmit={createQuiz} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <p className="font-bold text-gray-900 mb-1">Créer le QCM de ce chapitre</p>
          <p className="text-xs text-gray-400 mb-4">La matière et le niveau sont repris automatiquement du chapitre.</p>

          <input required value={title} onChange={(e) => setTitle(e.target.value)}
            placeholder="Titre du QCM (ex. « QCM — Les fractions »)"
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm mb-3" />

          <div className="flex items-center gap-4 mb-4 flex-wrap">
            <label className="flex items-center gap-2 text-sm text-gray-600">
              Durée
              <input type="number" min={1} max={60} value={minutes}
                onChange={(e) => setMinutes(Math.max(1, Math.min(60, Number(e.target.value) || 10)))}
                className="w-20 border border-gray-200 rounded-xl px-3 py-2 text-sm" />
              min
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input type="checkbox" checked={premium} onChange={(e) => setPremium(e.target.checked)} />
              Réservé aux abonnés Premium
            </label>
          </div>

          <button disabled={saving} className="bg-green-600 text-white font-bold px-5 py-2.5 rounded-xl text-sm disabled:opacity-50">
            {saving ? 'Création…' : 'Créer le QCM'}
          </button>
        </form>
      ) : (
        <>
          {/* ── Réglages du QCM ──────────────────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <p className="font-bold text-gray-900">{quiz.title}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {quiz.quiz_questions.length} question{quiz.quiz_questions.length !== 1 ? 's' : ''}
                  {' · '}{Math.round(quiz.time_limit_sec / 60)} min
                  {' · '}{quiz.is_premium ? 'Premium' : 'Gratuit'}
                  {' · '}niveau {quiz.level}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Link href={`/quiz/${quiz.id}`} target="_blank"
                  className="text-sm font-semibold text-blue-600 hover:underline">Aperçu élève ↗</Link>
                <button onClick={delQuiz} disabled={busy === quiz.id}
                  className="text-sm font-semibold text-red-600 hover:underline disabled:opacity-50">Supprimer</button>
              </div>
            </div>
            {quiz.quiz_questions.length === 0 && (
              <p className="mt-4 text-sm text-amber-700 bg-amber-50 rounded-xl px-3 py-2">
                Ce QCM n'a aucune question — il n'est pas encore utilisable par les élèves.
              </p>
            )}
          </div>

          {/* ── Ajout d'une question ─────────────────────────────────────── */}
          <form onSubmit={addQuestion} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
            <p className="font-bold text-gray-900 mb-4">Ajouter une question</p>

            <MarkdownEditor required value={prompt} onChange={setPrompt} rows={3}
              placeholder="Énoncé de la question — tableaux et schémas via la barre d’outils…"
              className="mb-3" />

            <p className="text-xs text-gray-500 mb-2">Coche la bonne réponse. Laisse une option vide pour ne pas l'utiliser.</p>
            {options.map((opt, i) => (
              <div key={i} className="flex items-center gap-3 mb-2">
                <input type="radio" name="correct" checked={correct === i} onChange={() => setCorrect(i)}
                  aria-label={`Bonne réponse : option ${i + 1}`} />
                <input value={opt}
                  onChange={(e) => setOptions((o) => o.map((v, j) => (j === i ? e.target.value : v)))}
                  placeholder={`Option ${String.fromCharCode(65 + i)}`}
                  className={`flex-1 border rounded-xl px-3 py-2 text-sm ${correct === i ? 'border-green-400 bg-green-50' : 'border-gray-200'}`} />
              </div>
            ))}

            <MarkdownEditor value={explanation} onChange={setExplanation} rows={3}
              placeholder="Corrigé affiché après la réponse (optionnel)"
              className="mt-3 mb-4" />

            <button disabled={saving} className="bg-green-600 text-white font-bold px-5 py-2.5 rounded-xl text-sm disabled:opacity-50">
              {saving ? 'Ajout…' : 'Ajouter la question'}
            </button>
          </form>

          {/* ── Liste des questions ──────────────────────────────────────── */}
          <div className="space-y-2">
            {quiz.quiz_questions.map((q) => (
              <div key={q.id} className="bg-white rounded-2xl border border-gray-100 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-start gap-2 font-semibold text-sm text-gray-900">
                      <span className="text-gray-400">{q.position}.</span>
                      <div className="min-w-0"><MarkdownRenderer content={q.prompt} /></div>
                    </div>
                    <ul className="mt-2 space-y-1">
                      {q.options.map((o, i) => (
                        <li key={i} className={`text-xs ${i === q.correct_index ? 'text-green-700 font-semibold' : 'text-gray-500'}`}>
                          {i === q.correct_index ? '✓ ' : '• '}{o}
                        </li>
                      ))}
                    </ul>
                    {q.explanation && (
                      <div className="text-xs text-gray-400 mt-2 italic"><MarkdownRenderer content={q.explanation} /></div>
                    )}
                  </div>
                  <button onClick={() => delQuestion(q.id)} disabled={busy === q.id}
                    className="text-xs font-semibold text-red-600 hover:underline flex-shrink-0 disabled:opacity-50">
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
