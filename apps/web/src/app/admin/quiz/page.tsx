'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Quiz { id: string; title: string; level: string; is_premium: boolean; subject_name: string | null; question_count: number }
interface Doc { id: string; title: string; level: string }

export default function AdminQuizPage() {
  const supabase = createClient()
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [docs, setDocs] = useState<Doc[]>([])
  const [documentId, setDocumentId] = useState('')
  const [count, setCount] = useState(10)
  const [isPremium, setIsPremium] = useState(false)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  const load = useCallback(async () => {
    const [qz, { data: documents }] = await Promise.all([
      fetch('/api/admin/quiz', { credentials: 'include' }).then((r) => r.json()),
      supabase.from('documents').select('id, title, level').eq('type', 'cours').order('created_at', { ascending: false }).limit(200),
    ])
    setQuizzes(qz.data ?? [])
    setDocs((documents ?? []) as Doc[])
    setLoading(false)
  }, [supabase])

  useEffect(() => { load() }, [load])

  async function generate(e: React.FormEvent) {
    e.preventDefault()
    if (!documentId) return
    setGenerating(true); setMsg(null)
    const res = await fetch('/api/admin/quiz/generate', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
      body: JSON.stringify({ document_id: documentId, count, is_premium: isPremium }),
    })
    const json = await res.json()
    if (!res.ok) setMsg(json.error?.message ?? 'Erreur de génération')
    else { setMsg(`✅ QCM créé — ${json.data?.question_count ?? 0} questions`); await load() }
    setGenerating(false)
  }

  async function remove(id: string) {
    if (!confirm('Supprimer ce QCM ?')) return
    await fetch(`/api/admin/quiz/${id}`, { method: 'DELETE', credentials: 'include' })
    setQuizzes((q) => q.filter((x) => x.id !== id))
  }

  return (
    <div className="px-8 py-8 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">QCM</h1>
        <p className="text-gray-500 text-sm mt-1">Génère des QCM par IA à partir d&apos;un cours indexé</p>
      </div>

      {/* Générateur */}
      <form onSubmit={generate} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6 space-y-4">
        {msg && <div className="p-3 bg-blue-50 text-blue-700 rounded-xl text-sm">{msg}</div>}
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase">Cours source</label>
            <select required value={documentId} onChange={(e) => setDocumentId(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm">
              <option value="">Choisir un cours…</option>
              {docs.map((d) => <option key={d.id} value={d.id}>{d.title} ({d.level.replace('_', ' ')})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase">Nb questions</label>
            <select value={count} onChange={(e) => setCount(Number(e.target.value))}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm">
              {[5, 10, 15, 20].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
        </div>
        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input type="checkbox" checked={isPremium} onChange={(e) => setIsPremium(e.target.checked)} className="w-4 h-4" />
            <span className="text-sm text-gray-700 font-medium">Réservé aux abonnés Premium</span>
          </label>
          <button type="submit" disabled={generating || !documentId} className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 disabled:opacity-50">
            {generating ? 'Génération IA…' : '✨ Générer le QCM'}
          </button>
        </div>
      </form>

      {/* Liste */}
      {loading ? (
        <div className="flex items-center justify-center py-16"><div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>
      ) : quizzes.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400">Aucun QCM.</div>
      ) : (
        <div className="space-y-3">
          {quizzes.map((q) => (
            <div key={q.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900">{q.title} {q.is_premium ? '⭐' : ''}</p>
                <p className="text-xs text-gray-400 mt-0.5">{q.subject_name ? `${q.subject_name} · ` : ''}{q.level.replace('_', ' ').toUpperCase()} · {q.question_count} questions</p>
              </div>
              <button onClick={() => remove(q.id)} className="px-3 py-1.5 bg-red-50 text-red-600 rounded-xl text-xs font-bold hover:bg-red-100">Supprimer</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
