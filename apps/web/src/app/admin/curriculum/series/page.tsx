'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { STUDY_LEVELS, LEVEL_META } from '@alpha-kelassi/types'
import { adminFetch } from '@/lib/admin-fetch'

interface Series { id: string; code: string; label: string; track: string; level: string; country_code: string }

const TRACKS = [
  { value: 'generale', label: 'Générale' },
  { value: 'technique', label: 'Technique' },
  { value: 'professionnel', label: 'Professionnel' },
] as const
// Toutes les classes d'examen, depuis la source partagée : la liste était
// figée sur quatre niveaux généraux, ce qui rendait impossible la création
// d'une série technique (G2, G3, BG, R…) depuis la console.
const LEVELS = STUDY_LEVELS

type Form = { code: string; label: string; track: string; level: string }
const EMPTY: Form = { code: '', label: '', track: 'generale', level: 'bac_c' }

export default function AdminSeriesPage() {
  const [rows, setRows] = useState<Series[]>([])
  const [form, setForm] = useState<Form>(EMPTY)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    const res = await adminFetch<Series[]>('/api/admin/curriculum/series')
    if (res.ok) setRows(res.data ?? [])
    else setError(res.error)
    setLoading(false)
  }, [])
  useEffect(() => { load() }, [load])

  async function add(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true); setError(null)
    // `finally` : sans lui, une réponse inattendue laissait le bouton bloqué.
    try {
      const res = await adminFetch('/api/admin/curriculum/series', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) { setError(res.error); return }
      setForm(EMPTY)
      await load()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="px-8 py-8 max-w-4xl">
      <Link href="/admin/curriculum" className="text-sm text-gray-400 hover:text-gray-700">← Curriculum</Link>
      <h1 className="text-2xl font-black text-gray-900 mt-2 mb-1">Séries / filières</h1>
      <p className="text-gray-500 text-sm mb-6">Séries A/C/D (générale), G1/G2/F3… (technique).</p>

      <form onSubmit={add} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        {error && <div className="p-3 bg-red-50 text-red-700 rounded-xl text-sm mb-4">{error}</div>}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
          <div className="col-span-12 sm:col-span-6 md:col-span-2">
            <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase">Code</label>
            <input required value={form.code} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))}
              placeholder="C / G1" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm" />
          </div>
          <div className="col-span-12 sm:col-span-6 md:col-span-2">
            <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase">Filière</label>
            <select value={form.track} onChange={(e) => setForm((f) => ({ ...f, track: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-2 py-2.5 text-sm">
              {TRACKS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div className="col-span-12 sm:col-span-6 md:col-span-2">
            <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase">Niveau</label>
            <select value={form.level} onChange={(e) => setForm((f) => ({ ...f, level: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-2 py-2.5 text-sm">
              {LEVELS.map((l) => <option key={l} value={l}>{LEVEL_META[l].label}</option>)}
            </select>
          </div>
          <div className="col-span-12 sm:col-span-6 md:col-span-4">
            <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase">Libellé</label>
            <input required value={form.label} onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
              placeholder="Série C — Maths-Sciences" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm" />
          </div>
          <div className="col-span-12 md:col-span-2">
            <button type="submit" disabled={saving} className="w-full px-4 py-2.5 bg-green-700 text-white rounded-xl text-sm font-bold hover:bg-green-800 disabled:opacity-50">
              {saving ? '…' : 'Ajouter'}
            </button>
          </div>
        </div>
      </form>

      {loading ? (
        <div className="flex justify-center py-16"><div className="w-6 h-6 border-2 border-green-700 border-t-transparent rounded-full animate-spin" /></div>
      ) : rows.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400">Aucune série.</div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y">
          {rows.map((s) => (
            <div key={s.id} className="flex items-center gap-3 px-4 py-3">
              <span className="text-sm font-black text-green-700 w-10">{s.code}</span>
              <span className="flex-1 text-sm text-gray-800">{s.label}</span>
              <span className="text-xs text-gray-400">{s.track} · {s.level.replace('_', ' ')}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
