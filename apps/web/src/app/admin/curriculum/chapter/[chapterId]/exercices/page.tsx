'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

interface Exercise {
  id: string; title: string; statement: string; difficulty: number; is_premium: boolean; order_index: number
  exercise_solutions: { solution: string }[] | { solution: string } | null
}

const DIFF: Record<number, { label: string; cls: string }> = {
  1: { label: 'Facile',    cls: 'bg-green-50 text-green-700' },
  2: { label: 'Moyen',     cls: 'bg-amber-50 text-amber-700' },
  3: { label: 'Difficile', cls: 'bg-red-50 text-red-700' },
}
const solOf = (e: Exercise) => Array.isArray(e.exercise_solutions) ? (e.exercise_solutions[0]?.solution ?? '') : (e.exercise_solutions?.solution ?? '')

export default function AdminExercisesPage() {
  const { chapterId } = useParams<{ chapterId: string }>()
  const [rows, setRows] = useState<Exercise[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState<string | null>(null)

  const [title, setTitle] = useState('')
  const [statement, setStatement] = useState('')
  const [solution, setSolution] = useState('')
  const [difficulty, setDifficulty] = useState(1)
  const [premium, setPremium] = useState(false)

  const load = useCallback(async () => {
    const res = await fetch(`/api/admin/curriculum/exercises?chapterId=${chapterId}`, { credentials: 'include' })
    const json = await res.json()
    setRows(json.data ?? []); setLoading(false)
  }, [chapterId])
  useEffect(() => { load() }, [load])

  async function add(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true); setError(null)
    const res = await fetch('/api/admin/curriculum/exercises', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
      body: JSON.stringify({ chapter_id: chapterId, title, statement, solution, difficulty, is_premium: premium, order_index: rows.length }),
    })
    const json = await res.json()
    if (!res.ok) { setError(json.error?.message ?? 'Erreur'); setSaving(false); return }
    setTitle(''); setStatement(''); setSolution(''); setDifficulty(1); setPremium(false); setSaving(false); await load()
  }

  async function del(id: string) {
    if (!confirm('Supprimer cet exercice et son corrigé ?')) return
    setBusy(id)
    const res = await fetch(`/api/admin/curriculum/exercises/${id}`, { method: 'DELETE', credentials: 'include' })
    setBusy(null)
    if (res.ok) setRows((list) => list.filter((x) => x.id !== id))
    else alert((await res.json()).error?.message ?? 'Erreur')
  }

  return (
    <div className="px-8 py-8 max-w-4xl">
      <Link href={`/admin/curriculum/chapter/${chapterId}`} className="text-sm text-gray-400 hover:text-gray-700">← Leçons du chapitre</Link>
      <h1 className="text-2xl font-black text-gray-900 mt-2 mb-1">Exercices & corrigés</h1>
      <p className="text-gray-500 text-sm mb-6">Énoncé et corrigé en Markdown (formules $…$). Le corrigé se débloque côté élève après une tentative.</p>

      <form onSubmit={add} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        {error && <div className="p-3 bg-red-50 text-red-700 rounded-xl text-sm mb-4">{error}</div>}
        <input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Titre de l'exercice"
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm mb-3" />
        <div className="flex gap-2 mb-3">
          {[1, 2, 3].map((d) => (
            <button key={d} type="button" onClick={() => setDifficulty(d)}
              className={`px-3 py-2 rounded-xl text-sm font-bold border-2 ${difficulty === d ? 'border-green-600 bg-green-50 text-green-700' : 'border-gray-200 text-gray-500'}`}>
              {DIFF[d]!.label}
            </button>
          ))}
        </div>
        <textarea required value={statement} onChange={(e) => setStatement(e.target.value)} rows={5}
          placeholder="Énoncé de l'exercice (Markdown)…" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-mono mb-3" />
        <textarea required value={solution} onChange={(e) => setSolution(e.target.value)} rows={6}
          placeholder="Corrigé détaillé, étape par étape (Markdown)…" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-mono mb-3" />
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input type="checkbox" checked={premium} onChange={(e) => setPremium(e.target.checked)} /> Premium ⭐
          </label>
          <button type="submit" disabled={saving} className="px-5 py-2.5 bg-green-700 text-white rounded-xl text-sm font-bold hover:bg-green-800 disabled:opacity-50">
            {saving ? 'Ajout…' : 'Ajouter l\'exercice'}
          </button>
        </div>
      </form>

      {loading ? (
        <div className="flex justify-center py-16"><div className="w-6 h-6 border-2 border-green-700 border-t-transparent rounded-full animate-spin" /></div>
      ) : rows.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400">Aucun exercice.</div>
      ) : (
        <div className="space-y-3">
          {rows.map((ex, i) => (
            <div key={ex.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xs font-black text-gray-400 uppercase">Exercice {i + 1}</span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${(DIFF[ex.difficulty] ?? DIFF[1]!).cls}`}>{(DIFF[ex.difficulty] ?? DIFF[1]!).label}</span>
                {ex.is_premium && <span className="text-xs">⭐</span>}
                <button onClick={() => del(ex.id)} disabled={busy === ex.id} className="ml-auto text-red-500 text-sm hover:text-red-700 disabled:opacity-50">Supprimer</button>
              </div>
              {ex.title && <p className="font-semibold text-gray-900 mb-1">{ex.title}</p>}
              <p className="text-sm text-gray-600 whitespace-pre-wrap line-clamp-3">{ex.statement}</p>
              <p className="text-xs text-green-700 mt-2 whitespace-pre-wrap line-clamp-2">✅ {solOf(ex)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
