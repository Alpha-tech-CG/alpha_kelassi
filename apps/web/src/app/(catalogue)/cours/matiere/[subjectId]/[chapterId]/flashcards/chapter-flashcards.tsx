'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MarkdownRenderer } from '@/components/markdown-renderer'
import { drawCards, SESSION_SIZE, type DeckCard } from '@/lib/flashcards/deck'

export type { DeckCard }

/**
 * Séance de flashcards : 15 cartes tirées au hasard dans le paquet du chapitre.
 * L'élève retourne la carte puis dit s'il savait. À la fin : son score, et au choix
 * « Revoir mes erreurs » ou « 15 autres cartes » (tirage qui évite la séance précédente).
 */
export function ChapterFlashcards({ deck, chapterTitle, subjectName, backHref, locked }: {
  deck: DeckCard[]
  chapterTitle: string
  subjectName: string
  backHref: string
  locked: boolean
}) {
  const [session, setSession] = useState<DeckCard[]>(() => drawCards(deck))
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [missed, setMissed] = useState<DeckCard[]>([])
  const [known, setKnown] = useState(0)

  function start(cards: DeckCard[]) {
    setSession(cards); setIndex(0); setFlipped(false); setMissed([]); setKnown(0)
  }
  function answer(ok: boolean) {
    const card = session[index]!
    if (ok) setKnown((k) => k + 1)
    else setMissed((m) => [...m, card])
    setIndex((i) => i + 1)
    setFlipped(false)
  }

  const header = (
    <nav className="mb-6 flex flex-wrap items-center gap-1.5 text-sm">
      <Link href={backHref} className="font-medium text-blue-600 hover:underline">← {chapterTitle}</Link>
    </nav>
  )

  if (deck.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        {header}
        {locked ? (
          <Link href="/billing" className="block rounded-2xl border border-amber-200 bg-amber-50 px-4 py-6 text-center text-sm font-semibold text-amber-900">
            🔒 Les flashcards de ce chapitre sont incluses dès la formule Starter. Voir les formules ›
          </Link>
        ) : (
          <p className="py-16 text-center text-gray-500">Les flashcards de ce chapitre arrivent bientôt.</p>
        )}
      </div>
    )
  }

  const card = session[index]
  if (!card) {
    const total = session.length
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        {header}
        <div className="rounded-3xl bg-blue-600 p-6 text-white shadow-md">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-100">Séance terminée</p>
          <p className="mt-2 text-4xl font-black">{known} / {total}</p>
          <p className="mt-1 text-blue-50">
            {known === total ? 'Parfait, tu maîtrises ces notions !' : `${total - known} carte${total - known > 1 ? 's' : ''} à revoir.`}
          </p>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {missed.length > 0 && (
            <button onClick={() => start(drawCards(missed, missed.length))}
              className="rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-bold text-white hover:bg-amber-600">
              Revoir mes erreurs ({missed.length})
            </button>
          )}
          {deck.length > SESSION_SIZE && (
            <button onClick={() => start(drawCards(deck, SESSION_SIZE, new Set(session.map((c) => c.id))))}
              className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700">
              {SESSION_SIZE} autres cartes
            </button>
          )}
          <Link href={backHref} className="rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-gray-700 ring-1 ring-gray-200">
            Retour au chapitre
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      {header}
      <div className="mb-3 flex items-center justify-between text-sm">
        <span className="font-semibold text-gray-500">🃏 {subjectName}</span>
        <span className="font-bold text-gray-700">{index + 1} / {session.length}</span>
      </div>
      <div className="mb-5 h-1.5 overflow-hidden rounded-full bg-blue-50">
        <div className="h-full rounded-full bg-blue-600 transition-all" style={{ width: `${(index / session.length) * 100}%` }} />
      </div>

      <button onClick={() => setFlipped((f) => !f)}
        className={`flex min-h-[260px] w-full flex-col items-center justify-center rounded-3xl p-6 text-center shadow-md transition-colors ${flipped ? 'bg-blue-600 text-white' : 'border border-gray-100 bg-white text-gray-900'}`}>
        <span className={`mb-3 text-xs font-bold uppercase tracking-widest ${flipped ? 'text-blue-100' : 'text-blue-600'}`}>
          {flipped ? 'Réponse' : 'Question'}
        </span>
        <MarkdownRenderer content={flipped ? card.back : card.front}
          className={`text-base ${flipped ? '[&_*]:!text-white' : ''}`} />
        {!flipped && <span className="mt-4 text-xs text-gray-400">Clique pour voir la réponse</span>}
      </button>

      {flipped ? (
        <div className="mt-5 grid grid-cols-2 gap-3">
          <button onClick={() => answer(false)} className="rounded-xl bg-amber-500 py-3 font-bold text-white hover:bg-amber-600">À revoir</button>
          <button onClick={() => answer(true)} className="rounded-xl bg-emerald-600 py-3 font-bold text-white hover:bg-emerald-700">Je savais</button>
        </div>
      ) : (
        <button onClick={() => setFlipped(true)} className="mt-5 w-full rounded-xl bg-blue-600 py-3 font-bold text-white hover:bg-blue-700">
          Voir la réponse
        </button>
      )}
    </div>
  )
}
