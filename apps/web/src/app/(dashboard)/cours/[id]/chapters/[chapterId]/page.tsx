'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'

interface Chapter {
  id:             string
  chapter_number: number
  title:          string
  summary_md:     string | null
  word_count:     number | null
  status:         string
}

export default function ChapterReaderPage() {
  const params    = useParams<{ id: string; chapterId: string }>()
  const router    = useRouter()
  const [chapter,      setChapter]      = useState<Chapter | null>(null)
  const [allChapters,  setAllChapters]  = useState<{ id: string; chapter_number: number; title: string }[]>([])
  const [loading,      setLoading]      = useState(true)
  const [flashLoading, setFlashLoading] = useState(false)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const [chRes, listRes] = await Promise.all([
        fetch(`/api/documents/${params.id}/chapters/${params.chapterId}`),
        fetch(`/api/documents/${params.id}/chapters`),
      ])
      if (chRes.ok) {
        const d = await chRes.json()
        setChapter(d.chapter)
      }
      if (listRes.ok) {
        const d = await listRes.json()
        setAllChapters(d.chapters ?? [])
      }
      setLoading(false)
    }
    load()
  }, [params.id, params.chapterId])

  async function generateFlashcards() {
    setFlashLoading(true)
    try {
      const res = await fetch('/api/flashcards/generate', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ document_id: params.id, chapter_id: params.chapterId, count: 5 }),
      })
      if (res.ok) router.push('/flashcards')
    } finally {
      setFlashLoading(false)
    }
  }

  const currentIdx = allChapters.findIndex((c) => c.id === params.chapterId)
  const prevChapter = currentIdx > 0 ? allChapters[currentIdx - 1] : null
  const nextChapter = currentIdx < allChapters.length - 1 ? allChapters[currentIdx + 1] : null

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="space-y-3 animate-pulse">
          <div className="h-4 bg-gray-100 rounded w-48" />
          <div className="h-8 bg-gray-100 rounded w-3/4" />
          <div className="h-64 bg-gray-100 rounded-2xl" />
        </div>
      </div>
    )
  }

  if (!chapter) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-4xl mb-4">😕</p>
        <p className="text-gray-600 font-semibold">Fiche introuvable</p>
        <Link href={`/cours/${params.id}/chapters`} className="inline-block mt-4 text-blue-600 text-sm hover:underline">
          ← Retour aux fiches
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-400 mb-5 flex-wrap">
        <Link href="/cours" className="hover:text-gray-600 font-medium">Cours</Link>
        <span>›</span>
        <Link href={`/cours/${params.id}`} className="hover:text-gray-600">Document</Link>
        <span>›</span>
        <Link href={`/cours/${params.id}/chapters`} className="hover:text-gray-600">Fiches</Link>
        <span>›</span>
        <span className="text-gray-700 truncate max-w-[120px]">{chapter.title}</span>
      </div>

      {/* Header chapitre */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center text-sm font-black text-violet-700 flex-shrink-0">
            {chapter.chapter_number}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-violet-600 font-semibold uppercase tracking-wider mb-1">Fiche de révision</p>
            <h1 className="text-xl font-black text-gray-900 leading-snug">{chapter.title}</h1>
            {chapter.word_count && (
              <p className="text-xs text-gray-400 mt-1">
                ~{Math.round(chapter.word_count / 200)} min · {chapter.word_count} mots
              </p>
            )}
          </div>
        </div>

        {/* CTA flashcards */}
        <button
          onClick={generateFlashcards}
          disabled={flashLoading}
          className="mt-4 w-full py-3 bg-gradient-to-r from-violet-600 to-blue-600 text-white rounded-xl text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-50 shadow-sm"
        >
          {flashLoading ? 'Génération en cours…' : '🃏 Lancer les Flashcards de ce chapitre'}
        </button>
      </div>

      {/* Contenu Markdown */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-7">
        {chapter.summary_md ? (
          <div className="prose prose-sm max-w-none prose-headings:font-black prose-h1:text-xl prose-h2:text-base prose-h2:text-violet-800 prose-h2:border-b prose-h2:border-violet-100 prose-h2:pb-1 prose-table:text-xs prose-td:py-1 prose-th:bg-gray-50">
            <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
              {chapter.summary_md}
            </ReactMarkdown>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-violet-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500 text-sm">Génération de la fiche en cours…</p>
          </div>
        )}
      </div>

      {/* Navigation entre chapitres */}
      <div className="mt-6 flex gap-3">
        {prevChapter ? (
          <Link
            href={`/cours/${params.id}/chapters/${prevChapter.id}`}
            className="flex-1 py-3 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium text-center hover:bg-gray-50 transition-colors truncate px-3"
          >
            ← {prevChapter.title}
          </Link>
        ) : (
          <Link
            href={`/cours/${params.id}/chapters`}
            className="flex-1 py-3 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium text-center hover:bg-gray-50 transition-colors"
          >
            ← Toutes les fiches
          </Link>
        )}
        {nextChapter && (
          <Link
            href={`/cours/${params.id}/chapters/${nextChapter.id}`}
            className="flex-1 py-3 bg-violet-600 text-white rounded-xl text-sm font-bold text-center hover:bg-violet-700 transition-colors truncate px-3"
          >
            {nextChapter.title} →
          </Link>
        )}
      </div>
    </div>
  )
}
