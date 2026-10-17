'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { STUDY_LEVELS, type StudyLevel } from '@alpha-kelassi/types'

const API_URL = '' // routes Next.js locales

type Track = 'generale' | 'technique'
interface Series {
  id: string
  code: string
  label: string
  level: string
}

const TRACKS: { value: Track; emoji: string; title: string; desc: string; color: string }[] = [
  {
    value: 'generale',
    emoji: '🎓',
    title: 'Enseignement général',
    desc: 'CEPE, BEPC, BAC A / C / D',
    color: 'border-blue-500 bg-blue-50 hover:border-blue-600',
  },
  {
    value: 'technique',
    emoji: '🔧',
    title: 'Enseignement technique',
    desc: 'Séries G1, G2, F3…',
    color: 'border-slate-500 bg-slate-50 hover:border-slate-600',
  },
]

// Ordre d'affichage des parcours généraux (du plus jeune au plus avancé)
// Ordre scolaire, par cycle. Seules les classes ouvertes aux élèves reviennent
// de la base (RLS sur `series`, migration 064).
const LEVEL_ORDER: Record<string, number> = Object.fromEntries(STUDY_LEVELS.map((l, i) => [l, i]))

const TIPS = [
  {
    icon: '🎯',
    title: 'Sois précis',
    desc: 'Indique la matière et le sujet. Ex : "Explique la dérivée en Maths BAC C"',
  },
  {
    icon: '🔍',
    title: 'Demande des exemples',
    desc: '"Donne-moi un exemple" → Kelassi adapte sa réponse à ton niveau.',
  },
  {
    icon: '🔄',
    title: 'Reformule si besoin',
    desc: '"Je n\'ai pas compris, explique autrement" → Kelassi réessaie.',
  },
]

export default function OnboardingPage() {
  const router = useRouter()
  const supabase = createClient()
  const [step, setStep] = useState(0)
  const [track, setTrack] = useState<Track | null>(null)
  const [seriesList, setSeriesList] = useState<Series[]>([])
  const [level, setLevel] = useState<string | null>(null)
  const [subjects, setSubjects] = useState<{ id: string; name: string }[]>([])
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  async function handleTrackSelect(t: Track) {
    setTrack(t)
    const { data } = await supabase.from('series').select('id, code, label, level').eq('track', t)
    const rows = (data ?? []) as Series[]
    rows.sort(
      (a, b) =>
        (LEVEL_ORDER[a.level] ?? 99) - (LEVEL_ORDER[b.level] ?? 99) || a.code.localeCompare(b.code)
    )
    setSeriesList(rows)
    setStep(1)
  }

  async function handleParcoursSelect(s: Series) {
    setLevel(s.level)
    const { data } = await supabase
      .from('subjects')
      .select('id, name')
      .eq('level', s.level as StudyLevel)
      .eq('track_type', track! as 'generale' | 'technique' | 'professionnel')
      .order('name')
    setSubjects(data ?? [])
    setSelectedSubjects([])
    setStep(2)
  }

  function toggleSubject(id: string) {
    setSelectedSubjects((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  async function handleComplete() {
    if (!track || !level) return
    setLoading(true)
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session) return
      const res = await fetch(`${API_URL}/api/onboarding/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ track_type: track, level, subject_ids: selectedSubjects }),
      })
      const json = await res.json()
      router.replace('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  const STEPS = ['Filière', 'Parcours', 'Matières', 'Tutoriel', "C'est parti"]

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-lg">
        {/* Progress */}
        <div className="mb-8 flex items-center justify-center gap-2">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                  i < step
                    ? 'bg-blue-600 text-white'
                    : i === step
                      ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                      : 'bg-gray-200 text-gray-400'
                }`}
              >
                {i < step ? '✓' : i + 1}
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={`h-0.5 w-6 transition-colors ${i < step ? 'bg-blue-600' : 'bg-gray-200'}`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="rounded-2xl border bg-white p-8 shadow-sm">
          {/* Étape 0 — Filière */}
          {step === 0 && (
            <div>
              <p className="mb-4 text-center text-4xl">👋</p>
              <h1 className="mb-2 text-center text-2xl font-bold">Bienvenue sur Kelassi !</h1>
              <p className="mb-8 text-center text-sm text-gray-500">
                Quel type d'enseignement suis-tu ?
              </p>
              <div className="grid gap-3">
                {TRACKS.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => handleTrackSelect(t.value)}
                    className={`rounded-xl border-2 p-5 text-left transition-all hover:scale-[1.01] ${t.color}`}
                  >
                    <p className="mb-1 text-3xl">{t.emoji}</p>
                    <p className="text-lg font-bold text-gray-900">{t.title}</p>
                    <p className="text-xs text-gray-500">{t.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Étape 1 — Parcours */}
          {step === 1 && (
            <div>
              <button
                onClick={() => setStep(0)}
                className="mb-3 text-xs text-gray-400 hover:text-blue-600"
              >
                ← Changer de filière
              </button>
              <p className="mb-4 text-center text-4xl">🧭</p>
              <h2 className="mb-2 text-center text-xl font-bold">Ton parcours</h2>
              <p className="mb-6 text-center text-sm text-gray-500">
                Sélectionne ton examen / ta série.
              </p>
              {seriesList.length === 0 ? (
                <p className="py-8 text-center text-sm text-gray-400">
                  Aucun parcours disponible pour cette filière pour l'instant.
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {seriesList.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => handleParcoursSelect(s)}
                      className="rounded-xl border-2 border-gray-200 p-4 text-center transition-all hover:border-blue-500 hover:bg-blue-50"
                    >
                      <p className="text-lg font-black text-blue-700">{s.code}</p>
                      <p className="mt-1 line-clamp-2 text-[11px] leading-tight text-gray-500">
                        {s.label}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Étape 2 — Matières */}
          {step === 2 && (
            <div>
              <button
                onClick={() => setStep(1)}
                className="mb-3 text-xs text-gray-400 hover:text-blue-600"
              >
                ← Changer de parcours
              </button>
              <p className="mb-4 text-center text-4xl">📚</p>
              <h2 className="mb-2 text-center text-xl font-bold">Tes matières prioritaires</h2>
              <p className="mb-6 text-center text-sm text-gray-500">
                Sélectionne celles que tu veux réviser (optionnel).
              </p>
              {subjects.length === 0 ? (
                <p className="py-6 text-center text-sm text-gray-400">
                  Les matières de ce parcours arrivent bientôt. Tu peux continuer.
                </p>
              ) : (
                <div className="mb-6 flex max-h-52 flex-wrap gap-2 overflow-y-auto">
                  {subjects.map((s) => {
                    const sel = selectedSubjects.includes(s.id)
                    return (
                      <button
                        key={s.id}
                        onClick={() => toggleSubject(s.id)}
                        className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                          sel
                            ? 'border-blue-600 bg-blue-600 text-white'
                            : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        {s.name}
                      </button>
                    )
                  })}
                </div>
              )}
              <button
                onClick={() => setStep(3)}
                className="w-full rounded-xl bg-blue-600 py-3 text-sm font-medium text-white hover:bg-blue-700"
              >
                Continuer{selectedSubjects.length > 0 ? ` (${selectedSubjects.length})` : ''}
              </button>
            </div>
          )}

          {/* Étape 3 — Tuto */}
          {step === 3 && (
            <div>
              <p className="mb-4 text-center text-4xl">🤖</p>
              <h2 className="mb-2 text-center text-xl font-bold">Comment utiliser Kelassi ?</h2>
              <div className="my-6 space-y-3">
                {TIPS.map((t) => (
                  <div key={t.title} className="flex items-start gap-3 rounded-xl bg-gray-50 p-3">
                    <span className="text-xl">{t.icon}</span>
                    <div>
                      <p className="text-sm font-semibold">{t.title}</p>
                      <p className="mt-0.5 text-xs text-gray-500">{t.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setStep(4)}
                className="w-full rounded-xl bg-blue-600 py-3 text-sm font-medium text-white hover:bg-blue-700"
              >
                J'ai compris !
              </button>
            </div>
          )}

          {/* Étape 4 — Lancement */}
          {step === 4 && (
            <div>
              <p className="mb-4 text-center text-4xl">🚀</p>
              <h2 className="mb-2 text-center text-xl font-bold">Tout est prêt !</h2>
              <p className="mb-6 text-center text-sm text-gray-500">
                Ton espace est configuré pour ton parcours. Bonne révision avec Kelassi !
              </p>
              <button
                onClick={handleComplete}
                disabled={loading}
                className="w-full rounded-xl bg-blue-600 py-3 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Préparation...' : "C'est parti ! 🚀"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
