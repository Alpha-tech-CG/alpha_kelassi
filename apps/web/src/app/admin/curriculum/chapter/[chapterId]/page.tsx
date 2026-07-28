'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

type LessonType = 'cours' | 'resume' | 'quiz' | 'video'
interface Lesson {
  id: string; type: LessonType; title: string; content: string | null
  video_url: string | null; duration_min: number | null; is_premium: boolean; order_index: number
}

const TYPES: { value: LessonType; label: string; icon: string }[] = [
  { value: 'cours', label: 'Cours', icon: '📖' }, { value: 'resume', label: 'Résumé', icon: '📝' },
  { value: 'quiz', label: 'Quiz', icon: '✅' }, { value: 'video', label: 'Vidéo', icon: '🎥' },
]

export default function AdminLessonsPage() {
  const { chapterId } = useParams<{ chapterId: string }>()
  const [rows, setRows] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState<string | null>(null)
  // Formulaire d'ajout
  const [type, setType] = useState<LessonType>('cours')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [premium, setPremium] = useState(false)
  // Édition inline du contenu
  const [drafts, setDrafts] = useState<Record<string, string>>({})

  const load = useCallback(async () => {
    const res = await fetch(`/api/admin/curriculum/lessons?chapterId=${chapterId}`, { credentials: 'include' })
    const json = await res.json()
    setRows(json.data ?? []); setLoading(false)
  }, [chapterId])
  useEffect(() => { load() }, [load])

  async function add(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true); setError(null)
    const body: Record<string, unknown> = { chapter_id: chapterId, type, title, is_premium: premium, order_index: rows.length }
    if (type === 'video') body['video_url'] = videoUrl || null
    else body['content'] = content || null
    const res = await fetch('/api/admin/curriculum/lessons', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(body),
    })
    const json = await res.json()
    if (!res.ok) { setError(json.error?.message ?? 'Erreur'); setSaving(false); return }
    setTitle(''); setContent(''); setVideoUrl(''); setPremium(false); setSaving(false); await load()
  }

  async function saveContent(l: Lesson) {
    setBusy(l.id)
    const res = await fetch(`/api/admin/curriculum/lessons/${l.id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
      body: JSON.stringify({ content: drafts[l.id] ?? '' }),
    })
    setBusy(null)
    if (res.ok) { await load(); setDrafts((d) => { const n = { ...d }; delete n[l.id]; return n }) }
    else alert((await res.json()).error?.message ?? 'Erreur')
  }

  async function generateResume(l: Lesson) {
    setBusy(l.id)
    const res = await fetch(`/api/admin/curriculum/lessons/${l.id}/generate-resume`, { method: 'POST', credentials: 'include' })
    setBusy(null)
    if (res.ok) await load()
    else alert((await res.json()).error?.message ?? 'Génération impossible')
  }

  async function remove(l: Lesson) {
    if (!confirm(`Supprimer la leçon « ${l.title} » ?`)) return
    const res = await fetch(`/api/admin/curriculum/lessons/${l.id}`, { method: 'DELETE', credentials: 'include' })
    if (res.ok) setRows((list) => list.filter((x) => x.id !== l.id))
  }

  return (
    <div className="px-8 py-8 max-w-4xl">
      <Link href="/admin/curriculum" className="text-sm text-gray-400 hover:text-gray-700">← Curriculum</Link>
      <h1 className="text-2xl font-black text-gray-900 mt-2 mb-1">Leçons du chapitre</h1>
      <p className="text-gray-500 text-sm mb-6">4 blocs : cours & résumé en Markdown (formules $…$ supportées côté élève), quiz, vidéo.</p>

      {/* Ajout */}
      <form onSubmit={add} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        {error && <div className="p-3 bg-red-50 text-red-700 rounded-xl text-sm mb-4">{error}</div>}
        <div className="flex gap-2 mb-4">
          {TYPES.map((t) => (
            <button key={t.value} type="button" onClick={() => setType(t.value)}
              className={`px-3 py-2 rounded-xl text-sm font-bold border-2 ${type === t.value ? 'border-green-600 bg-green-50 text-green-700' : 'border-gray-200 text-gray-500'}`}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>
        <input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Titre de la leçon"
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm mb-3" />
        {type === 'video' ? (
          <input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="URL vidéo (YouTube ou .mp4)"
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm mb-3" />
        ) : (
          <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={type === 'quiz' ? 4 : 8}
            placeholder={type === 'quiz' ? 'Énoncé du quiz (Markdown)…' : 'Contenu en Markdown…'}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-mono mb-3" />
        )}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input type="checkbox" checked={premium} onChange={(e) => setPremium(e.target.checked)} /> Premium ⭐
          </label>
          <button type="submit" disabled={saving} className="px-5 py-2.5 bg-green-700 text-white rounded-xl text-sm font-bold hover:bg-green-800 disabled:opacity-50">
            {saving ? 'Ajout…' : 'Ajouter la leçon'}
          </button>
        </div>
      </form>

      {/* Liste */}
      {loading ? (
        <div className="flex justify-center py-16"><div className="w-6 h-6 border-2 border-green-700 border-t-transparent rounded-full animate-spin" /></div>
      ) : rows.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400">Aucune leçon.</div>
      ) : (
        <div className="space-y-3">
          {rows.map((l) => {
            const meta = TYPES.find((t) => t.value === l.type)!
            const editing = l.id in drafts
            return (
              <div key={l.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{meta.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{l.title} {l.is_premium && '⭐'}</p>
                    <p className="text-xs text-gray-400">{meta.label}{l.video_url ? ` · ${l.video_url}` : ''}</p>
                  </div>
                  {l.type === 'resume' && (
                    <button onClick={() => generateResume(l)} disabled={busy === l.id}
                      className="px-3 py-1.5 bg-violet-100 text-violet-700 rounded-lg text-xs font-bold hover:bg-violet-200 disabled:opacity-50">
                      {busy === l.id ? '…' : '✨ Générer IA'}
                    </button>
                  )}
                  {l.type !== 'video' && (
                    <button onClick={() => setDrafts((d) => editing ? (() => { const n = { ...d }; delete n[l.id]; return n })() : { ...d, [l.id]: l.content ?? '' })}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-bold text-gray-700">
                      {editing ? 'Fermer' : 'Éditer'}
                    </button>
                  )}
                  <button onClick={() => remove(l)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg" title="Supprimer">🗑️</button>
                </div>
                {editing && (
                  <div className="mt-3">
                    <textarea value={drafts[l.id]} onChange={(e) => setDrafts((d) => ({ ...d, [l.id]: e.target.value }))}
                      rows={10} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-mono" />
                    <button onClick={() => saveContent(l)} disabled={busy === l.id}
                      className="mt-2 px-4 py-2 bg-green-700 text-white rounded-xl text-sm font-bold hover:bg-green-800 disabled:opacity-50">
                      {busy === l.id ? 'Enregistrement…' : 'Enregistrer'}
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
