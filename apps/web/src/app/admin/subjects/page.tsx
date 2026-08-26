'use client'

import { useEffect, useState, useCallback } from 'react'

interface Subject {
  id: string
  name: string
  level: string
  track_type: 'generale' | 'technique'
  country_code: string
  icon: string | null
  doc_count: number
  video_count: number
}

const TRACK_TYPES = [
  { value: 'generale', label: 'Générale' },
  { value: 'technique', label: 'Technique' },
] as const

type TrackType = 'generale' | 'technique'
type SubjectForm = { name: string; level: string; track_type: TrackType; icon: string }

const EMPTY: SubjectForm = { name: '', level: '', track_type: 'generale', icon: '' }

export default function AdminSubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [form, setForm] = useState<SubjectForm>(EMPTY)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editing, setEditing] = useState<string | null>(null)
  const [editName, setEditName] = useState('')

  const load = useCallback(async () => {
    const res = await fetch('/api/admin/subjects', { credentials: 'include' })
    const json = await res.json()
    setSubjects(json.data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function add(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true); setError(null)
    const res = await fetch('/api/admin/subjects', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
      body: JSON.stringify(form),
    })
    const json = await res.json()
    if (!res.ok) { setError(json.error?.message ?? 'Erreur'); setSaving(false); return }
    setForm((f) => ({ ...EMPTY, level: f.level })); setSaving(false)
    await load()
  }

  async function saveEdit(id: string) {
    const res = await fetch(`/api/admin/subjects/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
      body: JSON.stringify({ name: editName }),
    })
    if (res.ok) {
      const json = await res.json()
      setSubjects((list) => list.map((s) => (s.id === id ? { ...s, name: json.data.name } : s)))
    } else {
      const json = await res.json()
      alert(json.error?.message ?? 'Erreur')
    }
    setEditing(null)
  }

  async function remove(s: Subject) {
    if (!confirm(`Supprimer la matière « ${s.name} » (${s.level.replace('_', ' ').toUpperCase()}) ?`)) return
    const res = await fetch(`/api/admin/subjects/${s.id}`, { method: 'DELETE', credentials: 'include' })
    if (res.ok) {
      setSubjects((list) => list.filter((x) => x.id !== s.id))
    } else {
      const json = await res.json()
      alert(json.error?.message ?? 'Suppression impossible')
    }
  }

  return (
    <div className="px-8 py-8 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">Matières / Parcours</h1>
        <p className="text-gray-500 text-sm mt-1">
          Gère les matières par parcours/classe, en les classant entre filière générale et technique.
        </p>
      </div>

      {/* Formulaire d'ajout */}
      <div className="mb-3">
        <button type="button" className="px-4 py-2 bg-green-700 text-white rounded-xl text-sm font-bold hover:bg-green-800">
          Ajouter un parcours / classe
        </button>
      </div>
      <form onSubmit={add} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        {error && <div className="p-3 bg-red-50 text-red-700 rounded-xl text-sm mb-4">{error}</div>}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="col-span-12 sm:col-span-6 md:col-span-2">
            <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase">Catégorie</label>
            <select value={form.track_type} onChange={(e) => setForm((f) => ({ ...f, track_type: e.target.value as 'generale' | 'technique' }))}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm">
              {TRACK_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div className="col-span-12 sm:col-span-6 md:col-span-2">
            <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase">Parcours / classe</label>
            <input required value={form.level} onChange={(e) => setForm((f) => ({ ...f, level: e.target.value }))}
              placeholder="ex: bac_technique_g2 / bg" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm" />
          </div>
          <div className="col-span-12 sm:col-span-6 md:col-span-2">
            <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase">Icône</label>
            <input value={form.icon} onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))}
              placeholder="📐" maxLength={4} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-center" />
          </div>
          <div className="col-span-12 sm:col-span-6 md:col-span-4">
            <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase">Nom de la matière</label>
            <input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="ex: Mathématiques" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm" />
          </div>
          <div className="col-span-12 md:col-span-2">
            <button type="submit" disabled={saving} className="w-full px-5 py-2.5 bg-green-700 text-white rounded-xl text-sm font-bold hover:bg-green-800 disabled:opacity-50">
              {saving ? 'Ajout…' : 'Ajouter'}
            </button>
          </div>
        </div>
      </form>

      {/* Liste groupée par catégorie puis parcours */}
      {loading ? (
        <div className="flex items-center justify-center py-16"><div className="w-6 h-6 border-2 border-green-700 border-t-transparent rounded-full animate-spin" /></div>
      ) : subjects.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400">Aucune matière.</div>
      ) : (
        <div className="space-y-6">
          {TRACK_TYPES.map((track) => {
            const byTrack = subjects.filter((s) => s.track_type === track.value)
            if (byTrack.length === 0) return null

            const levels = Array.from(new Set(byTrack.map((s) => s.level))).sort()

            return (
              <div key={track.value}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-black text-green-700 bg-green-50 px-2.5 py-1 rounded-full uppercase">{track.label}</span>
                  <span className="text-xs text-gray-400">{byTrack.length} matière{byTrack.length > 1 ? 's' : ''}</span>
                </div>

                <div className="space-y-4">
                  {levels.map((lvl) => {
                    const items = byTrack.filter((s) => s.level === lvl)
                    return (
                      <div key={`${track.value}-${lvl}`}>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-bold text-gray-700 bg-gray-100 px-2 py-1 rounded-lg uppercase">{lvl.replaceAll('_', ' ')}</span>
                          <span className="text-xs text-gray-400">{items.length} matière{items.length > 1 ? 's' : ''}</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {items.map((s) => (
                            <div key={s.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3 flex items-center gap-3">
                              <span className="text-2xl w-9 text-center flex-shrink-0">{s.icon ?? '📘'}</span>
                              <div className="flex-1 min-w-0">
                                {editing === s.id ? (
                                  <input
                                    autoFocus
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    onKeyDown={(e) => { if (e.key === 'Enter') saveEdit(s.id); if (e.key === 'Escape') setEditing(null) }}
                                    onBlur={() => saveEdit(s.id)}
                                    className="w-full border border-green-300 rounded-lg px-2 py-1 text-sm font-semibold"
                                  />
                                ) : (
                                  <p className="font-semibold text-gray-900 truncate">{s.name}</p>
                                )}
                                <p className="text-xs text-gray-400 mt-0.5">
                                  {s.doc_count} cours · {s.video_count} vidéo{s.video_count > 1 ? 's' : ''}
                                </p>
                              </div>
                              <div className="flex items-center gap-1 flex-shrink-0">
                                <button
                                  onClick={() => { setEditing(s.id); setEditName(s.name) }}
                                  className="p-1.5 text-gray-400 hover:text-green-700 hover:bg-green-50 rounded-lg" title="Renommer"
                                >✏️</button>
                                <button
                                  onClick={() => remove(s)}
                                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg" title="Supprimer"
                                >🗑️</button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
