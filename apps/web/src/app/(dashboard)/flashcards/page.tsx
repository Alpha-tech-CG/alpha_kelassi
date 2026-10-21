'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { FREE_TIER } from '@alpha-kelassi/types'
import { useBillingMe } from '@/lib/subscription/client'
import { MarkdownRenderer } from '@/components/markdown-renderer'

interface Flashcard {
  id: string
  front: string
  back: string
  ease_factor: number
  interval: number
  reps: number
  next_review: string
  documents: { title: string; subjects: { name: string } | null } | null
  lessons: {
    title: string
    chapters: { title: string; subjects: { name: string } | null } | null
  } | null
}

interface FlashcardSource {
  id: string
  title: string
  chapter_title: string
  subject_name: string
  has_cards: boolean
}

const API_URL = '' // routes Next.js locales — pas de serveur externe

/** Texte d'une carte → Markdown : chaque ligne (puces « • ») reste une ligne. */
function cardMarkdown(text: string): string {
  return text.replace(/\n+/g, '\n\n')
}

const QUALITY_LABELS = [
  { q: 0, label: 'Oublié', emoji: '😰', bg: 'bg-red-500 hover:bg-red-600 active:bg-red-700' },
  {
    q: 2,
    label: 'Difficile',
    emoji: '😅',
    bg: 'bg-orange-500 hover:bg-orange-600 active:bg-orange-700',
  },
  {
    q: 3,
    label: 'Correct',
    emoji: '🙂',
    bg: 'bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700',
  },
  {
    q: 5,
    label: 'Parfait',
    emoji: '🎯',
    bg: 'bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700',
  },
]

export default function FlashcardsPage() {
  const [dueCards, setDueCards] = useState<Flashcard[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [reviewing, setReviewing] = useState(false)
  const [reviewError, setReviewError] = useState('')
  const [sessionDone, setSessionDone] = useState(false)
  const [stats, setStats] = useState({ reviewed: 0, correct: 0 })
  const [sources, setSources] = useState<FlashcardSource[]>([])
  const [sourcesLoading, setSourcesLoading] = useState(true)
  const [showGenerator, setShowGenerator] = useState(false)
  const [selectedSourceId, setSelectedSourceId] = useState('')
  const [generating, setGenerating] = useState(false)
  const [generationError, setGenerationError] = useState('')
  const [generationMessage, setGenerationMessage] = useState('')
  const [remaining, setRemaining] = useState<number | null>(null)
  const [limit, setLimit] = useState<number | null>(null)
  // Gratuit : jusqu'à 20 flashcards (limite appliquée par le serveur et la base) ;
  // Starter et plus : sans limite.
  const { data: me } = useBillingMe()
  const supabase = createClient()

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        if (!session) {
          setLoadError('Connecte-toi pour accéder à tes flashcards.')
          setLoading(false)
          setSourcesLoading(false)
          return
        }
        void loadDueCards()
        void loadSources()
      })
      .catch(() => {
        setLoadError('Impossible de vérifier ta session. Recharge la page.')
        setLoading(false)
        setSourcesLoading(false)
      })
  }, [])

  async function loadDueCards() {
    setLoading(true)
    setLoadError('')
    try {
      const res = await fetch(`${API_URL}/api/flashcards/due?limit=20`, { credentials: 'include' })
      const json = await res.json().catch(() => null)
      if (!res.ok || !Array.isArray(json?.data)) {
        throw new Error(
          json?.error?.message ?? `Impossible de charger les cartes (HTTP ${res.status}).`
        )
      }
      setDueCards(json.data)
      setCurrentIndex(0)
      setFlipped(false)
      setSessionDone(json.data.length === 0)
      setStats({ reviewed: 0, correct: 0 })
    } catch (error) {
      setLoadError(
        error instanceof Error ? error.message : 'Impossible de charger les cartes. Réessaie.'
      )
    } finally {
      setLoading(false)
    }
  }

  async function loadSources() {
    setSourcesLoading(true)
    setGenerationError('')
    try {
      const res = await fetch(`${API_URL}/api/flashcards/sources`, { credentials: 'include' })
      const json = await res.json().catch(() => null)
      if (!res.ok || !Array.isArray(json?.data)) {
        throw new Error(
          json?.error?.message ?? `Impossible de charger les cours (HTTP ${res.status}).`
        )
      }
      setSources(json.data)
      setRemaining(typeof json.remaining === 'number' ? json.remaining : null)
      setLimit(typeof json.limit === 'number' ? json.limit : null)
      // Arrivée depuis un cours (« Créer des flashcards ») : /flashcards?lesson=<id>
      const wanted = new URLSearchParams(window.location.search).get('lesson')
      if (wanted && json.data.some((source: FlashcardSource) => source.id === wanted))
        setShowGenerator(true)
      setSelectedSourceId(
        (current) =>
          json.data.find((source: FlashcardSource) => source.id === wanted)?.id ||
          json.data.find((source: FlashcardSource) => source.id === current && !source.has_cards)
            ?.id ||
          json.data.find((source: FlashcardSource) => !source.has_cards)?.id ||
          json.data[0]?.id ||
          ''
      )
    } catch (error) {
      setGenerationError(
        error instanceof Error ? error.message : 'Impossible de charger les cours. Réessaie.'
      )
    } finally {
      setSourcesLoading(false)
    }
  }

  const currentCard = dueCards[currentIndex]

  const handleReview = useCallback(
    async (quality: number) => {
      if (!currentCard || reviewing) return
      setReviewing(true)
      setReviewError('')

      try {
        const res = await fetch(`${API_URL}/api/flashcards/review`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ flashcard_id: currentCard.id, quality }),
        })
        const json = await res.json().catch(() => null)
        if (!res.ok || !json?.data) {
          throw new Error(
            json?.error?.message ?? `La révision n’a pas été enregistrée (HTTP ${res.status}).`
          )
        }

        setStats((s) => ({ reviewed: s.reviewed + 1, correct: s.correct + (quality >= 3 ? 1 : 0) }))

        const next = currentIndex + 1
        if (next >= dueCards.length) setSessionDone(true)
        else {
          setCurrentIndex(next)
          setFlipped(false)
        }
      } catch (error) {
        setReviewError(
          error instanceof Error ? error.message : 'La révision n’a pas été enregistrée. Réessaie.'
        )
      } finally {
        setReviewing(false)
      }
    },
    [currentCard, currentIndex, dueCards.length, reviewing]
  )

  async function generateCards() {
    if (!selectedSourceId || generating) return
    setGenerating(true)
    setGenerationError('')
    setGenerationMessage('')
    try {
      const res = await fetch(`${API_URL}/api/flashcards/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ lesson_id: selectedSourceId, count: 10 }),
      })
      const json = await res.json().catch(() => null)
      if (!res.ok || !Array.isArray(json?.data)) {
        throw new Error(json?.error?.message ?? `La génération a échoué (HTTP ${res.status}).`)
      }
      setGenerationMessage(
        `${json.count ?? json.data.length} cartes créées. Elles sont prêtes à réviser.`
      )
      await Promise.all([loadDueCards(), loadSources()])
    } catch (error) {
      setGenerationError(
        error instanceof Error ? error.message : 'La génération a échoué. Réessaie.'
      )
    } finally {
      setGenerating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 animate-bounce text-5xl">🃏</div>
          <p className="font-medium text-gray-500">Chargement des cartes…</p>
        </div>
      </div>
    )
  }

  const freeNotice = me && !me.features.flashcards && (
    <p className="mx-auto mb-4 max-w-sm rounded-xl border border-blue-100 bg-blue-50 px-4 py-2.5 text-center text-xs text-blue-800">
      Formule Gratuit : jusqu’à {FREE_TIER.maxFlashcards} flashcards.{' '}
      <a href="/billing?plan=starter" className="font-bold underline">
        Starter les rend illimitées
      </a>
      .
    </p>
  )

  const generatorPanel = (
    <section className="mb-5 rounded-2xl border border-blue-100 bg-white p-4 shadow-sm">
      <button
        type="button"
        onClick={() => setShowGenerator((value) => !value)}
        aria-expanded={showGenerator}
        className="flex w-full items-center justify-between text-left"
      >
        <span>
          <span className="block font-bold text-gray-900">Créer des cartes depuis un cours</span>
          <span className="block text-xs text-gray-500">
            Choisis une leçon : les cartes sont tirées de ton cours, en un instant.
          </span>
        </span>
        <span aria-hidden="true" className="text-xl font-bold text-blue-600">
          {showGenerator ? '−' : '+'}
        </span>
      </button>
      {showGenerator && (
        <div className="mt-4 space-y-3">
          {limit !== null && (
            <p className="text-xs text-gray-500">
              {remaining} carte{remaining === 1 ? '' : 's'} restante{remaining === 1 ? '' : 's'} sur{' '}
              {limit} en formule gratuite.
            </p>
          )}
          {sourcesLoading ? (
            <p className="text-sm text-gray-500">Chargement des cours…</p>
          ) : sources.length === 0 ? (
            <p className="text-sm text-gray-600">
              Aucun cours avec contenu n’est disponible pour ton parcours.
            </p>
          ) : (
            <>
              <label className="block">
                <span className="sr-only">Cours à réviser</span>
                <select
                  value={selectedSourceId}
                  onChange={(event) => setSelectedSourceId(event.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm text-gray-800"
                >
                  {[...new Set(sources.map((source) => source.subject_name))].map((subject) => (
                    <optgroup key={subject} label={subject}>
                      {sources
                        .filter((source) => source.subject_name === subject)
                        .map((source) => (
                          <option key={source.id} value={source.id} disabled={source.has_cards}>
                            {source.chapter_title === source.title
                              ? source.title
                              : `${source.chapter_title} — ${source.title}`}
                            {source.has_cards ? ' (cartes déjà créées)' : ''}
                          </option>
                        ))}
                    </optgroup>
                  ))}
                </select>
              </label>
              <button
                type="button"
                onClick={() => void generateCards()}
                disabled={
                  generating ||
                  !selectedSourceId ||
                  sources.find((source) => source.id === selectedSourceId)?.has_cards ||
                  remaining === 0
                }
                className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {generating ? 'Génération…' : 'Générer mes cartes'}
              </button>
            </>
          )}
          {generationError && (
            <div className="flex items-center justify-between gap-3">
              <p role="alert" className="text-sm font-medium text-red-700">
                {generationError}
              </p>
              {sources.length === 0 && (
                <button
                  type="button"
                  onClick={() => void loadSources()}
                  className="shrink-0 text-sm font-bold text-blue-700 underline"
                >
                  Recharger
                </button>
              )}
            </div>
          )}
          {generationMessage && (
            <p role="status" className="text-sm font-medium text-emerald-700">
              {generationMessage}
            </p>
          )}
          {remaining === 0 && (
            <p className="text-sm text-blue-700">
              Ton quota gratuit est atteint. Passe à Starter pour créer plus de cartes.
            </p>
          )}
        </div>
      )}
    </section>
  )

  if (loadError && !loading) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-12">
        <div className="mx-auto max-w-lg rounded-2xl border border-red-100 bg-white p-6 text-center shadow-sm">
          <p role="alert" className="mb-4 text-sm text-red-700">
            {loadError}
          </p>
          <button
            onClick={() => void loadDueCards()}
            className="rounded-full bg-blue-600 px-5 py-3 font-bold text-white"
          >
            Réessayer
          </button>
        </div>
      </div>
    )
  }

  if (sessionDone) {
    const pct = stats.reviewed > 0 ? Math.round((stats.correct / stats.reviewed) * 100) : 0
    const emoji = pct >= 80 ? '🎉' : pct >= 50 ? '👍' : '💪'
    const color =
      pct >= 80
        ? 'from-emerald-500 to-teal-600'
        : pct >= 50
          ? 'from-blue-500 to-blue-600'
          : 'from-orange-500 to-orange-600'

    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="w-full max-w-sm text-center">
          <div
            className={`h-24 w-24 bg-gradient-to-br ${color} mx-auto mb-6 flex items-center justify-center rounded-3xl text-4xl shadow-lg`}
          >
            {emoji}
          </div>
          {freeNotice}
          {generatorPanel}
          <h2 className="mb-2 text-2xl font-black text-gray-900">Session terminée !</h2>
          {stats.reviewed > 0 ? (
            <>
              <p className="mb-4 text-gray-500">
                {stats.reviewed} carte{stats.reviewed > 1 ? 's' : ''} révisée
                {stats.reviewed > 1 ? 's' : ''}
              </p>
              <div className="mb-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <p className="mb-1 text-5xl font-black text-gray-900">{pct}%</p>
                <p className="text-sm text-gray-500">de réussite</p>
                <div className="mt-4 h-2.5 w-full rounded-full bg-gray-100">
                  <div
                    className={`h-2.5 rounded-full bg-gradient-to-r ${color} transition-all`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="mb-6 rounded-2xl border border-emerald-100 bg-emerald-50 p-6">
              <p className="font-semibold text-emerald-700">Aucune carte à réviser aujourd'hui.</p>
              <p className="mt-1 text-sm text-emerald-600">
                Reviens demain pour la prochaine session !
              </p>
            </div>
          )}
          <button
            onClick={() => {
              setStats({ reviewed: 0, correct: 0 })
              loadDueCards()
            }}
            className="w-full rounded-2xl bg-blue-600 py-3.5 font-bold text-white shadow-sm transition-colors hover:bg-blue-700"
          >
            Recommencer la session
          </button>
        </div>
      </div>
    )
  }

  const progress = Math.round((currentIndex / dueCards.length) * 100)

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-lg">
        {freeNotice}
        {generatorPanel}
        {reviewError && (
          <p
            role="alert"
            className="mb-4 rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-700"
          >
            {reviewError}
          </p>
        )}

        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-gray-900">Flashcards</h1>
            <p className="mt-0.5 text-sm text-gray-500">
              {dueCards.length - currentIndex} carte{dueCards.length - currentIndex > 1 ? 's' : ''}{' '}
              restante{dueCards.length - currentIndex > 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-xl border border-gray-100 bg-white px-3 py-1.5 text-xs font-bold text-gray-400 shadow-sm">
              {currentIndex + 1} / {dueCards.length}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-6 h-2 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-[#35C0F0] transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Context */}
        {(currentCard.documents || currentCard.lessons) && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-3 py-2">
            <span className="text-sm text-blue-500">📚</span>
            <p className="truncate text-xs font-medium text-blue-700">
              {currentCard.lessons
                ? `${currentCard.lessons.chapters?.subjects?.name ?? ''} · ${currentCard.lessons.chapters?.title ?? ''} — ${currentCard.lessons.title}`
                : `${currentCard.documents?.subjects?.name ? `${currentCard.documents.subjects.name} · ` : ''}${currentCard.documents?.title ?? ''}`}
            </p>
          </div>
        )}

        {/* Card */}
        <div className="mb-6" style={{ perspective: '1200px' }}>
          <div
            className="relative w-full cursor-pointer select-none"
            style={{
              height: '280px',
              transformStyle: 'preserve-3d',
              transition: 'transform 0.55s cubic-bezier(0.4, 0, 0.2, 1)',
              transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            }}
            onClick={() => setFlipped((f) => !f)}
          >
            {/* Front */}
            <div
              className="absolute inset-0 flex flex-col items-center justify-center rounded-3xl border border-gray-100 bg-white p-8 shadow-lg"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <span className="mb-5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-blue-500">
                Question
              </span>
              <div className="max-h-[170px] w-full overflow-y-auto text-center text-xl font-bold leading-relaxed text-gray-900">
                <MarkdownRenderer content={cardMarkdown(currentCard.front)} sections={false} />
              </div>
              <p className="mt-6 text-xs text-gray-300">Appuie pour révéler la réponse</p>
            </div>

            {/* Back */}
            <div
              className="absolute inset-0 flex flex-col items-center justify-center rounded-3xl bg-gradient-to-br from-blue-600 to-[#35C0F0] p-8 shadow-lg"
              style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
            >
              <span className="mb-5 rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-widest text-blue-200">
                Réponse
              </span>
              <div className="max-h-[190px] w-full overflow-y-auto text-center text-base font-semibold leading-relaxed text-white">
                <MarkdownRenderer content={cardMarkdown(currentCard.back)} sections={false} />
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        {flipped ? (
          <div>
            <p className="mb-4 text-center text-sm font-medium text-gray-600">
              Comment tu as répondu ?
            </p>
            <div className="mb-3 grid grid-cols-4 gap-2">
              {QUALITY_LABELS.map(({ q, label, emoji, bg }) => (
                <button
                  key={q}
                  onClick={() => handleReview(q)}
                  disabled={reviewing}
                  className={`${bg} flex flex-col items-center gap-1 rounded-2xl py-3 text-xs font-bold text-white shadow-sm transition-all disabled:opacity-50`}
                >
                  <span className="text-lg">{emoji}</span>
                  {label}
                </button>
              ))}
            </div>
            <p className="text-center text-xs text-gray-400">
              Intervalle actuel : {currentCard.interval} jour{currentCard.interval > 1 ? 's' : ''} ·
              Facilité {currentCard.ease_factor.toFixed(2)}
            </p>
          </div>
        ) : (
          <button
            onClick={() => setFlipped(true)}
            className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-[#35C0F0] py-4 font-bold text-white shadow-md transition-opacity hover:opacity-90"
          >
            Voir la réponse →
          </button>
        )}
      </div>
    </div>
  )
}
