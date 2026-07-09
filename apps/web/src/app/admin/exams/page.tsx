'use client'

import { useEffect, useState, useCallback } from 'react'

interface Exam { id: string; level: string; label: string; exam_date: string }

const EMPTY = { level: 'bepc', label: '', exam_date: '' }

export default function AdminExamsPage() {
  const [exams, setExams] = useState<Exam[]>([])
  const [form, setForm] = useState(EMPTY)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    const res = await fetch('/api/admin/exams', { credentials: 'include' })
    const json = await res.json()
    setExams(json.data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function add(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true); setError(null)
    const res = await fetch('/api/admin/exams', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
      body: JSON.stringify(form),
    })
    const json = await res.json()
    if (!res.ok) { setError(json.error?.message ?? json.error ?? 'Erreur'); setSaving(false); return }
    setForm(EMPTY); setSaving(false)
    await load()
  }

  async function remove(id: string) {
    if (!confirm('Supprimer cette date d\'examen ?')) return
    await fetch(`/api/admin/exams/${id}`, { method: 'DELETE', credentials: 'include' })
    setExams((x) => x.filter((e) => e.id !== id))
  }

  return (
    <div className="px-8 py-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">Dates d&apos;examen</h1>
        <p className="text-gray-500 text-sm mt-1">Alimente le compte à rebours et les plannings de révision des élèves</p>
      </div>

      <form onSubmit={add} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        {error && <div className="p-3 bg-red-50 text-red-700 rounded-xl text-sm mb-4">{error}</div>}
        <div className="grid grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase">Niveau</label>
            <select value={form.level} onChange={(e) => setForm((f) => ({ ...f, level: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm">
              {['bepc', 'bac_a', 'bac_c', 'bac_d'].map((l) => <option key={l} value={l}>{l.replace('_', ' ').toUpperCase()}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase">Libellé</label>
            <input required value={form.label} onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
              placeholder="ex: BEPC 2027" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase">Date</label>
            <input required type="date" value={form.exam_date} onChange={(e) => setForm((f) => ({ ...f, exam_date: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm" />
          </div>
          <button type="submit" disabled={saving} className="px-5 py-2.5 bg-green-700 text-white rounded-xl text-sm font-bold hover:bg-green-800 disabled:opacity-50">
            {saving ? '…' : 'Ajouter'}
          </button>
        </div>
      </form>

      {loading ? (
        <div className="flex items-center justify-center py-16"><div className="w-6 h-6 border-2 border-green-700 border-t-transparent rounded-full animate-spin" /></div>
      ) : exams.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400">Aucune date d&apos;examen.</div>
      ) : (
        <div className="space-y-2">
          {exams.map((e) => (
            <div key={e.id} className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full uppercase">{e.level.replace('_', ' ')}</span>
                <span className="font-semibold text-gray-900">{e.label}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">{new Date(e.exam_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                <button onClick={() => remove(e.id)} className="text-xs text-red-600 hover:underline">Supprimer</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
