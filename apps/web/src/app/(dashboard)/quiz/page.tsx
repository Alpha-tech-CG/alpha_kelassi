'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ListChecks, Clock, Crown, AlertTriangle, ChevronRight } from 'lucide-react'

interface Quiz {
  id: string
  title: string
  description: string | null
  level: string
  time_limit_sec: number
  is_premium: boolean
  subjects: { name: string } | null
}

interface WeakArea {
  subject_id: string
  subject_name: string
  answered: number
  wrong: number
  error_rate: number
}

export default function QuizListPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [weakAreas, setWeakAreas] = useState<WeakArea[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/quiz', { credentials: 'include' }).then((r) => r.json()),
      fetch('/api/quiz/weak-areas', { credentials: 'include' }).then((r) => r.json()),
    ]).then(([q, w]) => {
      setQuizzes(q.data ?? [])
      setWeakAreas(w.data ?? [])
      setLoading(false)
    })
  }, [])

  if (loading) {
    return <div className="p-6 text-gray-500">Chargement des QCM…</div>
  }

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 space-y-6">
      <header className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
          <ListChecks className="w-5 h-5 text-white" strokeWidth={2} />
        </div>
        <div>
          <h1 className="text-2xl font-black text-gray-900">QCM chronométrés</h1>
          <p className="text-sm text-gray-500">Teste-toi comme le jour de l&apos;examen.</p>
        </div>
      </header>

      {/* Points faibles */}
      {weakAreas.length > 0 && (
        <section className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-amber-600" strokeWidth={2} />
            <h2 className="text-sm font-bold text-amber-900">Tes points faibles</h2>
          </div>
          <ul className="space-y-2">
            {weakAreas.map((w) => (
              <li key={w.subject_id} className="flex items-center justify-between text-sm">
                <span className="text-amber-900">{w.subject_name}</span>
                <span className="font-semibold text-amber-700">{w.error_rate}% d&apos;erreurs</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Liste des QCM */}
      {quizzes.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <ListChecks className="w-10 h-10 mx-auto mb-3" strokeWidth={1.5} />
          <p>Aucun QCM disponible pour le moment.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {quizzes.map((quiz) => (
            <li key={quiz.id}>
              <Link
                href={`/quiz/${quiz.id}`}
                className="flex items-center gap-4 bg-white border rounded-2xl p-4 hover:border-blue-400 hover:shadow-sm transition"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-gray-900 truncate">{quiz.title}</h3>
                    {quiz.is_premium && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                        <Crown className="w-3 h-3" /> Premium
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                    {quiz.subjects?.name && <span>{quiz.subjects.name}</span>}
                    <span className="uppercase">{quiz.level.replace('_', ' ')}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {Math.round(quiz.time_limit_sec / 60)} min
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
