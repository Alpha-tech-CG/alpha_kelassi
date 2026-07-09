'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Video {
  id: string; title: string; level: string; provider: string; url: string
  is_premium: boolean; thumbnail_url: string | null; subjects: { name: string } | null
}
interface Subject { id: string; name: string; level: string }

const EMPTY = { subject_id: '', title: '', level: 'bepc', url: '', is_premium: false }

export default function AdminVideosPage() {
  const supabase = createClient()
  const [videos, setVideos] = useState<Video[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [form, setForm] = useState(EMPTY)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    const [vids, { data: subs }] = await Promise.all([
      fetch('/api/admin/videos', { credentials: 'include' }).then((r) => r.json()),
      supabase.from('subjects').select('id, name, level').order('name'),
    ])
    setVideos(vids.data ?? [])
    setSubjects((subs ?? []) as Subject[])
    setLoading(false)
  }, [supabase])

  useEffect(() => { load() }, [load])

  async function add(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true); setError(null)
    const res = await fetch('/api/admin/videos', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
      body: JSON.stringify(form),
    })
    const json = await res.json()
    if (!res.ok) { setError(json.error?.message ?? 'Erreur'); setSaving(false); return }
    setForm(EMPTY); setSaving(false)
    await load()
  }

  async function remove(id: string) {
    if (!confirm('Supprimer cette vidéo ?')) return
    await fetch(`/api/admin/videos/${id}`, { method: 'DELETE', credentials: 'include' })
    setVideos((v) => v.filter((x) => x.id !== id))
  }

  return (
    <div className="px-8 py-8 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">Cours vidéo</h1>
        <p className="text-gray-500 text-sm mt-1">Ajoute des vidéos YouTube / Vimeo par simple lien</p>
      </div>

      {/* Form ajout */}
      <form onSubmit={add} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6 space-y-4">
        {error && <div className="p-3 bg-red-50 text-red-700 rounded-xl text-sm">{error}</div>}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase">Matière</label>
            <select required value={form.subject_id} onChange={(e) => setForm((f) => ({ ...f, subject_id: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm">
              <option value="">Choisir…</option>
              {subjects.map((s) => <option key={s.id} value={s.id}>{s.name} ({s.level.replace('_', ' ')})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase">Niveau</label>
            <select value={form.level} onChange={(e) => setForm((f) => ({ ...f, level: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm">
              {['bepc', 'bac_a', 'bac_c', 'bac_d'].map((l) => <option key={l} value={l}>{l.replace('_', ' ').toUpperCase()}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase">Titre</label>
          <input required value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            placeholder="ex: Les équations du second degré" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase">Lien YouTube / Vimeo</label>
          <input required type="url" value={form.url} onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
            placeholder="https://youtube.com/watch?v=…" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm" />
        </div>
        <div className="flex items-center justify-between pt-2">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input type="checkbox" checked={form.is_premium} onChange={(e) => setForm((f) => ({ ...f, is_premium: e.target.checked }))} className="w-4 h-4" />
            <span className="text-sm text-gray-700 font-medium">Réservé aux abonnés Premium</span>
          </label>
          <button type="submit" disabled={saving} className="px-6 py-2.5 bg-green-700 text-white rounded-xl text-sm font-bold hover:bg-green-800 disabled:opacity-50">
            {saving ? 'Ajout…' : 'Ajouter la vidéo'}
          </button>
        </div>
      </form>

      {/* Liste */}
      {loading ? (
        <div className="flex items-center justify-center py-16"><div className="w-6 h-6 border-2 border-green-700 border-t-transparent rounded-full animate-spin" /></div>
      ) : videos.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400">Aucune vidéo.</div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {videos.map((v) => (
            <div key={v.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex gap-3">
              {v.thumbnail_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={v.thumbnail_url} alt="" className="w-24 h-16 object-cover rounded-lg flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-sm line-clamp-2">{v.title} {v.is_premium ? '⭐' : ''}</p>
                <p className="text-xs text-gray-400 mt-1">{v.subjects?.name ? `${v.subjects.name} · ` : ''}{v.level.replace('_', ' ').toUpperCase()} · {v.provider}</p>
                <button onClick={() => remove(v.id)} className="mt-2 text-xs text-red-600 hover:underline">Supprimer</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
