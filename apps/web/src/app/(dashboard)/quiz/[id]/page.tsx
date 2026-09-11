'use client'

import { useEffect, useState, useRef, useCallback, use } from 'react'
import Link from 'next/link'
import { Clock, ChevronLeft, ChevronRight, CheckCircle2, XCircle, Trophy } from 'lucide-react'
import { MarkdownRenderer } from '@/components/markdown-renderer'
import type { LockedFeatureInfo } from '@alpha-kelassi/types'
import { LockedFeature } from '@/components/subscription/locked-feature'
import { planErrorOf } from '@/lib/subscription/client'

interface Question {
  id: string
  position: number
  prompt: string
  options: string[]
}
interface Quiz {
  id: string
  title: string
  time_limit_sec: number
  is_premium: boolean
  subjects: { name: string } | null
  questions: Question[]
  is_exam?: boolean
  allowed_modes?: string[] | null
  locked?: LockedFeatureInfo | null
}
interface Correction {
  question_id: string
  correct_index: number
  explanation: string | null
}
interface Result {
  attempt_id: string
  score: number
  penalized_score?: number
  total: number
  corrections: Correction[]
  /** Résultats détaillés (formule Pro). */
  details?: {
    success_rate: number; correct: number; wrong: number; blank: number; penalty: number
    seconds_per_question: number | null; previous_attempts: number; best_rate: number
    delta_vs_last: number | null; advice: string
  } | null
}

function fmt(sec: number) {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function QuizTakePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [current, setCurrent] = useState(0)
  const [remaining, setRemaining] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<Result | null>(null)

  const startRef = useRef<number>(Date.now())

  useEffect(() => {
    fetch(`/api/quiz/${id}`, { credentials: 'include' })
      .then((r) => r.json())
      .then((j) => {
        if (j.error || !j.data) { setError('QCM introuvable.'); setLoading(false); return }
        setQuiz(j.data)
        setRemaining(j.data.time_limit_sec)
        startRef.current = Date.now()
        setLoading(false)
      })
  }, [id])

  const submit = useCallback(async () => {
    if (!quiz || submitting || result) return
    setSubmitting(true)
    const duration_sec = Math.round((Date.now() - startRef.current) / 1000)
    const payload = quiz.questions.map((q) => ({
      question_id:    q.id,
      selected_index: q.id in answers ? answers[q.id] : null,
    }))
    const res = await fetch(`/api/quiz/${id}/submit`, {
      method:      'POST',
      headers:     { 'Content-Type': 'application/json' },
      credentials: 'include',
      // Annale : premier mode ouvert par la formule (Entraînement libre sur le web).
      body:        JSON.stringify({ answers: payload, duration_sec, mode: quiz.allowed_modes?.[0] ?? 'entrainement' }),
    })
    const json = await res.json().catch(() => null)
    const planErr = planErrorOf(json)
    if (planErr?.info) { setQuiz((qz) => qz && { ...qz, locked: planErr.info }); setSubmitting(false); return }
    if (!json || json.error) { setError(json?.error?.message ?? 'Erreur à la soumission.'); setSubmitting(false); return }
    setResult(json.data)
    setSubmitting(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [quiz, submitting, result, answers, id])

  // Chrono
  useEffect(() => {
    if (loading || result || !quiz || quiz.locked || quiz.questions.length === 0) return
    if (remaining <= 0) { submit(); return }
    const t = setTimeout(() => setRemaining((r) => r - 1), 1000)
    return () => clearTimeout(t)
  }, [remaining, loading, result, quiz, submit])

  if (loading) return <div className="p-6 text-gray-500">Chargement du QCM…</div>
  if (error && !quiz) return <div className="p-6 text-red-600">{error}</div>
  if (!quiz) return null

  // QCM hors de la formule : explication plutôt qu'un questionnaire vide.
  if (quiz.locked) {
    return (
      <div className="max-w-2xl mx-auto p-4 sm:p-10">
        <p className="text-sm text-gray-500 mb-4 text-center">{quiz.title}</p>
        <LockedFeature info={quiz.locked} backHref="/quiz" backLabel="← Retour aux QCM" />
      </div>
    )
  }
  if (quiz.questions.length === 0) return <div className="p-6 text-gray-500">Ce QCM n’a pas encore de questions.</div>

  // ---------- Écran résultat ----------
  if (result) {
    const pct = result.total > 0 ? Math.round((100 * result.score) / result.total) : 0
    const byId = new Map(result.corrections.map((c) => [c.question_id, c]))
    return (
      <div className="max-w-2xl mx-auto p-4 sm:p-6 space-y-6">
        <div className="bg-white border rounded-2xl p-6 text-center">
          <Trophy className={`w-12 h-12 mx-auto mb-3 ${pct >= 50 ? 'text-amber-500' : 'text-gray-300'}`} />
          <h1 className="text-3xl font-black text-gray-900">{result.score}/{result.total}</h1>
          <p className="text-gray-500 mt-1">{pct}% de bonnes réponses</p>
          {result.score > 0 && <p className="text-sm text-emerald-600 mt-2 font-semibold">+{result.score * 5} XP gagnés</p>}
        </div>

        {result.details ? (
          <section aria-labelledby="details" className="bg-white border rounded-2xl p-5">
            <h2 id="details" className="font-black text-gray-900 mb-3">Résultats détaillés</h2>
            <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="rounded-xl bg-emerald-50 p-3"><dt className="text-xs text-emerald-800">Bonnes réponses</dt><dd className="text-xl font-black text-emerald-900">{result.details.correct}</dd></div>
              <div className="rounded-xl bg-red-50 p-3"><dt className="text-xs text-red-800">Erreurs</dt><dd className="text-xl font-black text-red-900">{result.details.wrong}</dd></div>
              <div className="rounded-xl bg-gray-50 p-3"><dt className="text-xs text-gray-700">Sans réponse</dt><dd className="text-xl font-black text-gray-900">{result.details.blank}</dd></div>
              <div className="rounded-xl bg-blue-50 p-3"><dt className="text-xs text-blue-800">Temps / question</dt><dd className="text-xl font-black text-blue-900">{result.details.seconds_per_question ?? '—'} s</dd></div>
            </dl>
            <p className="text-sm text-gray-700 mt-3">
              Meilleur résultat sur ce sujet : {result.details.best_rate} %.
              {result.details.delta_vs_last !== null && ` Par rapport à ta tentative précédente : ${result.details.delta_vs_last >= 0 ? '+' : ''}${result.details.delta_vs_last} points.`}
              {result.details.penalty > 0 && ` Pénalité Bac rouge : −${result.details.penalty}.`}
            </p>
            <p className="text-sm font-semibold text-gray-900 mt-2">{result.details.advice}</p>
          </section>
        ) : (
          <p className="text-sm text-center text-gray-500">
            Les résultats détaillés (erreurs, rythme, évolution) sont inclus dans la formule Pro. <Link href="/billing?plan=pro" className="underline font-semibold">Voir la formule</Link>
          </p>
        )}

        <div className="space-y-3">
          {quiz.questions.map((q) => {
            const corr = byId.get(q.id)
            const picked = answers[q.id]
            const isCorrect = corr && picked === corr.correct_index
            return (
              <div key={q.id} className="bg-white border rounded-2xl p-4">
                <div className="flex items-start gap-2">
                  {isCorrect
                    ? <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    : <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />}
                  <div className="flex items-start gap-1.5 font-semibold text-gray-900 min-w-0">
                    <span>{q.position}.</span>
                    <MarkdownRenderer content={q.prompt} className="min-w-0" />
                  </div>
                </div>
                <ul className="mt-3 space-y-1.5 pl-7">
                  {q.options.map((opt, i) => {
                    const isRight = corr?.correct_index === i
                    const isPicked = picked === i
                    return (
                      <li
                        key={i}
                        className={`text-sm px-3 py-1.5 rounded-lg border ${
                          isRight ? 'border-emerald-300 bg-emerald-50 text-emerald-800 font-medium'
                          : isPicked ? 'border-red-300 bg-red-50 text-red-700'
                          : 'border-transparent text-gray-600'
                        }`}
                      >
                        {opt}
                      </li>
                    )
                  })}
                </ul>
                {corr?.explanation && (
                  <div className="mt-2 ml-7 text-sm text-gray-500 italic flex items-start gap-1.5">
                    <span>💡</span>
                    <MarkdownRenderer content={corr.explanation} className="min-w-0" />
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <Link href="/quiz" className="block text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl">
          Retour aux QCM
        </Link>
      </div>
    )
  }

  // ---------- Écran passage ----------
  const q = quiz.questions[current]
  const answeredCount = Object.keys(answers).length
  const lowTime = remaining <= 30

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6">
      {/* Barre chrono + progression */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-500">Question {current + 1}/{quiz.questions.length}</span>
        <span className={`flex items-center gap-1.5 font-mono font-bold ${lowTime ? 'text-red-600 animate-pulse' : 'text-gray-900'}`}>
          <Clock className="w-4 h-4" /> {fmt(remaining)}
        </span>
      </div>
      <div className="h-1.5 bg-gray-200 rounded-full mb-6 overflow-hidden">
        <div className="h-full bg-blue-600 transition-all" style={{ width: `${(answeredCount / quiz.questions.length) * 100}%` }} />
      </div>

      {/* Question */}
      <div className="bg-white border rounded-2xl p-5">
        <div className="font-bold text-gray-900 text-lg mb-4">
          <MarkdownRenderer content={q.prompt} />
        </div>
        <div className="space-y-2">
          {q.options.map((opt, i) => {
            const selected = answers[q.id] === i
            return (
              <button
                key={i}
                onClick={() => setAnswers((a) => ({ ...a, [q.id]: i }))}
                className={`w-full text-left px-4 py-3 rounded-xl border transition ${
                  selected ? 'border-blue-500 bg-blue-50 text-blue-900 font-medium' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="inline-flex items-center justify-center w-6 h-6 mr-2 rounded-full border text-xs font-bold">
                  {String.fromCharCode(65 + i)}
                </span>
                {opt}
              </button>
            )
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6">
        <button
          onClick={() => setCurrent((c) => Math.max(0, c - 1))}
          disabled={current === 0}
          className="flex items-center gap-1 px-4 py-2 text-sm text-gray-600 disabled:opacity-40"
        >
          <ChevronLeft className="w-4 h-4" /> Précédent
        </button>

        {current < quiz.questions.length - 1 ? (
          <button
            onClick={() => setCurrent((c) => Math.min(quiz.questions.length - 1, c + 1))}
            className="flex items-center gap-1 px-5 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-xl"
          >
            Suivant <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={submit}
            disabled={submitting}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl disabled:opacity-60"
          >
            {submitting ? 'Correction…' : 'Terminer le QCM'}
          </button>
        )}
      </div>

      {error && <p className="mt-4 text-sm text-red-600 text-center">{error}</p>}
    </div>
  )
}
