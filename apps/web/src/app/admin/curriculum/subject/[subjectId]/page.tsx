'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

interface Chapter { id: string; title: string; description: string | null; order_index: number; series_id: string | null; lesson_count: number }
interface Series { id: string; code: string; label: string }

export default function AdminChaptersPage() {
  const { subjectId } = useParams<{ subjectId: string }>()
  const [rows, setRows] = useState<Chapter[]>([])
  const [series, setSeries] = useState<Series[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [seriesId, setSeriesId] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    const [c, s] = await Promise.all([
      fetch(`/api/admin/curriculum/chapters?subjectId=${subjectId}`, { credentials: 'include' }).then((r) => r.json()),
      fetch('/api/admin/curriculum/series', { credentials: 'include' }).then((r) => r.json()),
    ])
    setRows(c.data ?? []); setSeries(s.data ?? []); setLoading(false)
  }, [subjectId])
  useEffect(() => { load() }, [load])

  async function add(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true); setError(null)
    const res = await fetch('/api/admin/curriculum/chapters', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
      body: JSON.stringify({ subject_id: subjectId, title, description: description || null, series_id: seriesId || null, order_index: rows.length }),
    })
    const json = await res.json()
    if (!res.ok) { setError(json.error?.message ?? 'Erreur'); setSaving(false); return }
    setTitle(''); setDescription(''); setSeriesId(''); setSaving(false); await load()
  }

  async function remove(ch: Chapter) {
    if (!confirm(`Supprimer le chapitre « ${ch.title} » et ses leçons ?`)) return
    const res = await fetch(`/api/admin/curriculum/chapters/${ch.id}`, { method: 'DELETE', credentials: 'include' })
    if (res.ok) setRows((l) => l.filter((x) => x.id !== ch.id))
    else alert((await res.json()).error?.message ?? 'Erreur')
  }

  async function move(ch: Chapter, dir: -1 | 1) {
    const next = ch.order_index + dir
    const res = await fetch(`/api/admin/curriculum/chapters/${ch.id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
      body: JSON.stringify({ order_index: Math.max(0, next) }),
    })
    if (res.ok) await load()
  }

  return (
    <div className="px-8 py-8 max-w-4xl">
      <Link href="/admin/curriculum" className="text-sm text-gray-400 hover:text-gray-700">← Curriculum</Link>
      <h1 className="text-2xl font-black text-gray-900 mt-2 mb-1">Chapitres</h1>
      <p className="text-gray-500 text-sm mb-6">Organise la matière en chapitres. Chaque chapitre contient 4 blocs (cours, résumé, quiz, vidéo).</p>

      <form onSubmit={add} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        {error && <div className="p-3 bg-red-50 text-red-700 rounded-xl text-sm mb-4">{error}</div>}
        <div className="grid grid-cols-12 gap-3 items-end">
          <div className="col-span-5">
            <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase">Titre</label>
            <input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Chapitre 1 — Les limites" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm" />
          </div>
          <div className="col-span-4">
            <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase">Description (option.)</label>
            <input value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm" />
          </div>
          <div className="col-span-3">
            <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase">Série (option.)</label>
            <select value={seriesId} onChange={(e) => setSeriesId(e.target.value)} className="w-full border border-gray-200 rounded-xl px-2 py-2.5 text-sm">
              <option value="">Toutes</option>
              {series.map((s) => <option key={s.id} value={s.id}>{s.code} — {s.label}</option>)}
            </select>
          </div>
          <div className="col-span-12">
            <button type="submit" disabled={saving} className="px-5 py-2.5 bg-green-700 text-white rounded-xl text-sm font-bold hover:bg-green-800 disabled:opacity-50">
              {saving ? 'Ajout…' : 'Ajouter le chapitre'}
            </button>
          </div>
        </div>
      </form>

      {loading ? (
        <div className="flex justify-center py-16"><div className="w-6 h-6 border-2 border-green-700 border-t-transparent rounded-full animate-spin" /></div>
      ) : rows.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400">Aucun chapitre.</div>
      ) : (
        <div className="space-y-2">
          {rows.map((ch, i) => (
            <div key={ch.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3 flex items-center gap-3">
              <div className="flex flex-col">
                <button onClick={() => move(ch, -1)} disabled={i === 0} className="text-gray-300 hover:text-gray-600 disabled:opacity-30 text-xs">▲</button>
                <button onClick={() => move(ch, 1)} disabled={i === rows.length - 1} className="text-gray-300 hover:text-gray-600 disabled:opacity-30 text-xs">▼</button>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">{ch.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">{ch.lesson_count} leçon{ch.lesson_count > 1 ? 's' : ''}{ch.description ? ` · ${ch.description}` : ''}</p>
              </div>
              <Link href={`/admin/curriculum/chapter/${ch.id}`} className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-bold text-gray-700">Leçons →</Link>
              <button onClick={() => remove(ch)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg" title="Supprimer">🗑️</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
