'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { PDFViewerLazy as PDFViewer } from '../../cours/[id]/pdf-viewer-lazy'
import { saveExamHistorique } from '../examens-historique'
import { MarkdownRenderer } from '@/components/markdown-renderer'

interface ExerciseChunk {
  id: string
  content: string
  chunk_index: number
  page_number: number | null
  metadata: Record<string, unknown>
}

interface ContextChunk {
  chunk_index: number
  content: string
}

interface Props {
  docId: string
  title: string
  level: string
  year: number | null
  enonceUrl: string
  corrigeUrl: string | null
  corrigeIsPremium: boolean
  exercises: ExerciseChunk[]
  contextChunks: ContextChunk[]
}

interface ExerciseGroup {
  chapter: string | null  // null = pas de chapitre détecté
  color: string           // couleur du badge chapitre
  exercises: ExerciseChunk[]
}

type Panel = 'enonce' | 'corrige'

/* ─── Couleurs cycliques pour les chapitres ─── */
const CHAPTER_COLORS = [
  'bg-violet-100 text-violet-800 border-violet-200',
  'bg-blue-100 text-blue-800 border-blue-200',
  'bg-emerald-100 text-emerald-800 border-emerald-200',
  'bg-amber-100 text-amber-800 border-amber-200',
  'bg-rose-100 text-rose-800 border-rose-200',
  'bg-cyan-100 text-cyan-800 border-cyan-200',
]

/* ─── Détection de titre de chapitre dans un contenu de chunk ─── */
function extractChapterTitle(content: string): string | null {
  const firstLine = content.split('\n')[0].trim()

  // "Partie A", "Partie I", "Partie 1" — motif très courant dans les examens
  if (/^Partie\s+[A-Z0-9IVX]+/i.test(firstLine)) {
    return firstLine.replace(/[:\-–—]+$/, '').trim()
  }
  // "Chapitre 1 — ...", "Chapitre I : ..."
  if (/^Chapitre\s+\w+/i.test(firstLine)) {
    return firstLine.slice(0, 60).replace(/[:\-–—]+$/, '').trim()
  }
  // Numérotation romaine : "I. Algèbre", "II. Géométrie"
  if (/^(I{1,3}|IV|V?I{0,3}|IX|X{0,3})\.\s+\S/i.test(firstLine) && firstLine.length > 5) {
    return firstLine.slice(0, 60).trim()
  }
  // Tout en MAJUSCULES ≥ 6 chars (titre de section)
  if (
    firstLine.length >= 6 &&
    firstLine === firstLine.toUpperCase() &&
    /[A-ZÀÂÉÊÈÙÛÎÏŒ]{4,}/.test(firstLine) &&
    !firstLine.includes('$')
  ) {
    return firstLine.slice(0, 60)
  }
  return null
}

/* ─── Groupe les exercices par leur chapitre précédent le plus proche ─── */
function groupExercises(
  exercises: ExerciseChunk[],
  contextChunks: ContextChunk[]
): ExerciseGroup[] {
  // Repère les chunks de contexte qui sont des titres de chapitre
  const chapterMarkers: { chunkIndex: number; title: string }[] = contextChunks
    .map((c) => {
      const title = extractChapterTitle(c.content)
      return title ? { chunkIndex: c.chunk_index, title } : null
    })
    .filter((x): x is { chunkIndex: number; title: string } => x !== null)
    .sort((a, b) => a.chunkIndex - b.chunkIndex)

  if (chapterMarkers.length === 0) {
    // Aucun chapitre détecté : une seule liste
    return [{ chapter: null, color: CHAPTER_COLORS[0], exercises }]
  }

  // Associe chaque exercice au dernier chapitre qui le précède
  const map = new Map<string, ExerciseChunk[]>()
  for (const ex of exercises) {
    const preceding = [...chapterMarkers]
      .reverse()
      .find((m) => m.chunkIndex < ex.chunk_index)
    const key = preceding?.title ?? '—'
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(ex)
  }

  return Array.from(map.entries()).map(([chapter, exs], i) => ({
    chapter: chapter === '—' ? null : chapter,
    color: CHAPTER_COLORS[i % CHAPTER_COLORS.length],
    exercises: exs,
  }))
}

interface SolutionState {
  content:   string
  streaming: boolean
  shown:     boolean
}

export function ExamenViewer({
  docId, title, level, year,
  enonceUrl, corrigeUrl, corrigeIsPremium,
  exercises, contextChunks,
}: Props) {
  const [activePanel,      setActivePanel]      = useState<Panel>('enonce')
  const [expandedExercise, setExpandedExercise] = useState<string | null>(null)
  const [copiedId,         setCopiedId]         = useState<string | null>(null)
  const [solutions,        setSolutions]        = useState<Record<string, SolutionState>>({})

  useEffect(() => {
    saveExamHistorique({ id: docId, title, level, year })
  }, [docId, title, level, year])

  // Auto-scroll vers un exercice si ancre dans l'URL
  useEffect(() => {
    const hash = window.location.hash
    if (hash.startsWith('#ex-')) {
      const exId = hash.slice(4)
      setExpandedExercise(exId)
      setTimeout(() => {
        document.getElementById(`ex-${exId}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 400)
    }
  }, [])

  // Groupement par chapitre calculé une seule fois
  const groups = useMemo(
    () => groupExercises(exercises, contextChunks),
    [exercises, contextChunks]
  )

  const totalExercises = exercises.length
  const isGrouped = groups.length > 1 || groups[0]?.chapter !== null

  function buildTuteurUrl(exercise: ExerciseChunk) {
    const preview = exercise.content.slice(0, 200).replace(/\s+/g, ' ').trim()
    const q = encodeURIComponent(`Explique-moi cet exercice :\n\n${preview}…`)
    return `/tuteur?document=${docId}&exercise=${exercise.id}&q=${q}`
  }

  /* ── Stream de la solution complète ────────────────────────────────── */
  const getSolution = useCallback(async (exercise: ExerciseChunk) => {
    const exId = exercise.id

    // Si déjà visible, juste masquer/afficher
    if (solutions[exId]?.content && !solutions[exId]?.streaming) {
      setSolutions((prev) => ({
        ...prev,
        [exId]: { ...prev[exId], shown: !prev[exId].shown },
      }))
      return
    }

    // Initialise l'état de streaming
    setSolutions((prev) => ({ ...prev, [exId]: { content: '', streaming: true, shown: true } }))

    const question = `Donne-moi la solution complète et détaillée de cet exercice avec toutes les étapes expliquées. Je veux comprendre chaque étape du raisonnement.\n\nExercice :\n${exercise.content}`

    try {
      const body: Record<string, string> = { question, document_id: docId }
      const res = await fetch('/api/ai/chat', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(body),
      })

      if (!res.ok) {
        setSolutions((prev) => ({
          ...prev,
          [exId]: { content: '❌ Impossible d\'obtenir la solution. Réessaie.', streaming: false, shown: true },
        }))
        return
      }

      const reader  = res.body!.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''
        for (const line of lines) {
          if (!line.trim() || line.startsWith('event:')) continue
          if (line.startsWith('data: ')) {
            try {
              const payload = JSON.parse(line.slice(6))
              if (typeof payload.text === 'string' && payload.text.length > 0) {
                setSolutions((prev) => ({
                  ...prev,
                  [exId]: { ...prev[exId], content: (prev[exId]?.content ?? '') + payload.text },
                }))
              }
            } catch { /* non-JSON */ }
          }
        }
      }
    } catch {
      setSolutions((prev) => ({
        ...prev,
        [exId]: { content: '❌ Erreur de connexion. Réessaie.', streaming: false, shown: true },
      }))
    } finally {
      setSolutions((prev) => ({
        ...prev,
        [exId]: { ...prev[exId], streaming: false },
      }))
    }
  }, [docId, solutions])

  const copyLink = useCallback(async (exId: string) => {
    const url = `${window.location.origin}/examens/${docId}#ex-${exId}`
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      const el = Object.assign(document.createElement('textarea'), { value: url })
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
    }
    setCopiedId(exId)
    setTimeout(() => setCopiedId(null), 2000)
  }, [docId])

  return (
    <div className="flex flex-col gap-4">

      {/* Toggle mobile énoncé / corrigé */}
      {corrigeUrl && (
        <div className="flex lg:hidden rounded-xl border overflow-hidden self-start">
          {(['enonce', 'corrige'] as Panel[]).map((panel) => (
            <button
              key={panel}
              onClick={() => setActivePanel(panel)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activePanel === panel
                  ? panel === 'enonce' ? 'bg-purple-600 text-white' : 'bg-green-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {panel === 'enonce'
                ? '📄 Énoncé'
                : corrigeIsPremium ? '⭐ Corrigé' : '✅ Corrigé'}
            </button>
          ))}
        </div>
      )}

      {/* Visionneuse PDF côte-à-côte */}
      <div className={`flex gap-4 ${corrigeUrl ? 'lg:grid lg:grid-cols-2' : ''}`}>
        <div className={`flex-1 min-w-0 ${corrigeUrl && activePanel !== 'enonce' ? 'hidden lg:block' : ''}`}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
              📄 Énoncé
            </span>
          </div>
          <PDFViewer url={enonceUrl} />
        </div>

        {corrigeUrl && (
          <div className={`flex-1 min-w-0 ${activePanel !== 'corrige' ? 'hidden lg:block' : ''}`}>
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-xs font-semibold uppercase tracking-wide px-2 py-1 rounded-full ${
                corrigeIsPremium ? 'text-amber-700 bg-amber-50' : 'text-green-700 bg-green-50'
              }`}>
                {corrigeIsPremium ? '⭐ Corrigé Premium' : '✅ Corrigé'}
              </span>
            </div>
            <PDFViewer url={corrigeUrl} />
          </div>
        )}
      </div>

      {/* ─── Exercices groupés par chapitre ─── */}
      {totalExercises > 0 && (
        <div className="mt-2 space-y-5">

          {/* En-tête */}
          <div className="flex items-center gap-3 flex-wrap">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <span className="text-base">📋</span>
              {totalExercises} exercice{totalExercises > 1 ? 's' : ''} détecté{totalExercises > 1 ? 's' : ''}
            </h3>
            {isGrouped && (
              <span className="text-xs text-violet-600 bg-violet-50 border border-violet-100 px-2 py-0.5 rounded-full font-medium">
                {groups.length} chapitre{groups.length > 1 ? 's' : ''}
              </span>
            )}
            <span className="text-xs text-gray-400">— Clique sur un exercice pour l'expliquer avec Kelassi</span>
          </div>

          {/* Groupes */}
          {groups.map((group, gi) => (
            <div key={gi} className="space-y-2">

              {/* Titre du chapitre */}
              {group.chapter && (
                <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${group.color}`}>
                  <span className="text-sm font-bold">{group.chapter}</span>
                  <span className="text-xs opacity-70">
                    · {group.exercises.length} exercice{group.exercises.length > 1 ? 's' : ''}
                  </span>
                </div>
              )}

              {/* Liste des exercices du groupe */}
              {group.exercises.map((ex, idx) => {
                const isOpen   = expandedExercise === ex.id
                const isCopied = copiedId === ex.id
                // Numéro global de l'exercice
                const globalIdx = exercises.indexOf(ex)

                return (
                  <div
                    key={ex.id}
                    id={`ex-${ex.id}`}
                    className={`border rounded-xl overflow-hidden bg-white scroll-mt-20 transition-shadow ${
                      isOpen ? 'shadow-md border-violet-200' : 'hover:border-gray-200'
                    }`}
                  >
                    {/* Accordéon header */}
                    <button
                      onClick={() => setExpandedExercise(isOpen ? null : ex.id)}
                      className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50/80 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className={`flex-shrink-0 w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center
                          ${group.chapter ? group.color : 'bg-purple-100 text-purple-700'}`}
                        >
                          {group.chapter ? idx + 1 : globalIdx + 1}
                        </span>
                        <span className="text-sm text-gray-600 leading-snug line-clamp-2">
                          {ex.content.slice(0, 140).replace(/\s+/g, ' ').trim()}…
                        </span>
                      </div>
                      <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                        {ex.page_number && (
                          <span className="hidden sm:inline text-xs text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">
                            p.{ex.page_number}
                          </span>
                        )}
                        <button
                          onClick={(e) => { e.stopPropagation(); copyLink(ex.id) }}
                          title="Copier le lien"
                          className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs transition-colors ${
                            isCopied
                              ? 'bg-green-100 text-green-600'
                              : 'bg-gray-100 text-gray-400 hover:bg-violet-100 hover:text-violet-600'
                          }`}
                        >
                          {isCopied ? '✓' : '🔗'}
                        </button>
                        <span className="text-gray-400 text-xs">{isOpen ? '▲' : '▼'}</span>
                      </div>
                    </button>

                    {/* Contenu déplié */}
                    {isOpen && (
                      <div className="border-t bg-gray-50/60 px-4 pb-4">
                        {/* Rendu Markdown + LaTeX du contenu */}
                        <div className="mt-3 mb-4 bg-white rounded-xl border border-gray-100 p-4 max-h-64 overflow-y-auto text-sm">
                          <MarkdownRenderer content={ex.content} prose={false} />
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 flex-wrap mb-3">
                          {ex.page_number && (
                            <span className="sm:hidden text-xs text-gray-400 bg-white px-2 py-1 rounded-lg border border-gray-100">
                              📄 p. {ex.page_number}
                            </span>
                          )}
                          {/* Bouton solution complète */}
                          <button
                            onClick={() => getSolution(ex)}
                            disabled={solutions[ex.id]?.streaming}
                            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border-2 transition-all shadow-sm ${
                              solutions[ex.id]?.shown && solutions[ex.id]?.content
                                ? 'bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100'
                                : 'bg-amber-500 text-white border-amber-500 hover:bg-amber-600'
                            } disabled:opacity-60 disabled:cursor-not-allowed`}
                          >
                            {solutions[ex.id]?.streaming ? (
                              <><span className="animate-spin">⏳</span> Génération…</>
                            ) : solutions[ex.id]?.shown && solutions[ex.id]?.content ? (
                              '🔼 Masquer la solution'
                            ) : solutions[ex.id]?.content ? (
                              '💡 Afficher la solution'
                            ) : (
                              '💡 Solution complète'
                            )}
                          </button>

                          <Link
                            href={buildTuteurUrl(ex)}
                            className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-colors shadow-sm"
                          >
                            🤖 Me faire guider
                          </Link>
                          <button
                            onClick={() => copyLink(ex.id)}
                            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
                              isCopied
                                ? 'bg-green-50 text-green-700 border-green-200'
                                : 'bg-white text-gray-600 border-gray-200 hover:border-violet-200 hover:text-violet-600'
                            }`}
                          >
                            {isCopied ? '✓ Lien copié !' : '🔗 Partager'}
                          </button>
                        </div>

                        {/* Solution complète streamée */}
                        {solutions[ex.id]?.shown && (solutions[ex.id]?.content || solutions[ex.id]?.streaming) && (
                          <div className="rounded-xl border-2 border-amber-200 bg-amber-50/60 overflow-hidden">
                            <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-100 border-b border-amber-200">
                              <span className="text-base">💡</span>
                              <p className="text-xs font-bold text-amber-800 uppercase tracking-wide">Solution complète · Kelassi IA</p>
                              {solutions[ex.id]?.streaming && (
                                <span className="ml-auto inline-flex gap-0.5">
                                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </span>
                              )}
                            </div>
                            <div className="px-4 py-4 text-sm">
                              <MarkdownRenderer content={solutions[ex.id].content} prose={false} />
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      )}

      {/* CTA si pas d'exercices indexés */}
      {totalExercises === 0 && (
        <div className="mt-2 flex items-center gap-3 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
          <span className="text-2xl">🤖</span>
          <div className="flex-1">
            <p className="text-sm font-medium text-emerald-800">Poser une question à Kelassi</p>
            <p className="text-xs text-emerald-600 mt-0.5">
              Le tuteur IA connaît ce document et peut t'expliquer n'importe quel exercice.
            </p>
          </div>
          <Link
            href={`/tuteur?document=${docId}`}
            className="flex-shrink-0 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700"
          >
            Demander →
          </Link>
        </div>
      )}
    </div>
  )
}
