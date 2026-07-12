'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'

type Block =
  | { type: 'subtitle'; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'image'; url: string; caption?: string }

interface Lesson { title: string; content: Block[] }
interface Objective { title: string; lessons: Lesson[] }

// Déplace un élément dans un tableau (immutable)
function move<T>(arr: T[], from: number, to: number): T[] {
  if (to < 0 || to >= arr.length) return arr
  const copy = [...arr]
  const [item] = copy.splice(from, 1)
  copy.splice(to, 0, item!)
  return copy
}

export default function CourseEditorPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [isPremium, setIsPremium] = useState(false)
  const [subjectName, setSubjectName] = useState('')
  const [level, setLevel] = useState('')
  const [objectives, setObjectives] = useState<Objective[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  const load = useCallback(async () => {
    const res = await fetch(`/api/admin/courses/${id}`, { credentials: 'include' })
    const json = await res.json()
    if (json.data) {
      setTitle(json.data.title ?? '')
      setSubtitle(json.data.subtitle ?? '')
      setIsPremium(!!json.data.is_premium)
      setSubjectName(json.data.subject_name ?? '')
      setLevel(json.data.level ?? '')
      setObjectives(json.data.objectives ?? [])
    }
    setLoading(false)
  }, [id])

  useEffect(() => { load() }, [load])

  // ── Mutations O.G ──────────────────────────────────────────────────────────
  const updateOG = (oi: number, patch: Partial<Objective>) =>
    setObjectives((prev) => prev.map((o, i) => (i === oi ? { ...o, ...patch } : o)))
  const addOG = () => setObjectives((prev) => [...prev, { title: '', lessons: [] }])
  const removeOG = (oi: number) => setObjectives((prev) => prev.filter((_, i) => i !== oi))
  const moveOG = (oi: number, dir: -1 | 1) => setObjectives((prev) => move(prev, oi, oi + dir))

  // ── Mutations O.S ──────────────────────────────────────────────────────────
  const setLessons = (oi: number, lessons: Lesson[]) => updateOG(oi, { lessons })
  const addOS = (oi: number) => setLessons(oi, [...objectives[oi]!.lessons, { title: '', content: [] }])
  const updateOS = (oi: number, li: number, patch: Partial<Lesson>) =>
    setLessons(oi, objectives[oi]!.lessons.map((l, i) => (i === li ? { ...l, ...patch } : l)))
  const removeOS = (oi: number, li: number) =>
    setLessons(oi, objectives[oi]!.lessons.filter((_, i) => i !== li))
  const moveOS = (oi: number, li: number, dir: -1 | 1) =>
    setLessons(oi, move(objectives[oi]!.lessons, li, li + dir))

  // ── Mutations blocs ────────────────────────────────────────────────────────
  const setBlocks = (oi: number, li: number, content: Block[]) => updateOS(oi, li, { content })
  const addBlock = (oi: number, li: number, block: Block) =>
    setBlocks(oi, li, [...objectives[oi]!.lessons[li]!.content, block])
  const updateBlock = (oi: number, li: number, bi: number, patch: Partial<Block>) =>
    setBlocks(oi, li, objectives[oi]!.lessons[li]!.content.map((b, i) => (i === bi ? { ...b, ...patch } as Block : b)))
  const removeBlock = (oi: number, li: number, bi: number) =>
    setBlocks(oi, li, objectives[oi]!.lessons[li]!.content.filter((_, i) => i !== bi))
  const moveBlock = (oi: number, li: number, bi: number, dir: -1 | 1) =>
    setBlocks(oi, li, move(objectives[oi]!.lessons[li]!.content, bi, bi + dir))

  async function save() {
    setSaving(true); setMsg(null)
    const res = await fetch(`/api/admin/courses/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
      body: JSON.stringify({ title, subtitle, is_premium: isPremium, objectives }),
    })
    const json = await res.json()
    setSaving(false)
    setMsg(res.ok ? '✅ Enregistré' : `❌ ${json.error?.message ?? 'Erreur'}`)
  }

  async function del() {
    if (!confirm('Supprimer définitivement ce cours ?')) return
    await fetch(`/api/admin/courses/${id}`, { method: 'DELETE', credentials: 'include' })
    router.push('/admin/courses')
  }

  if (loading) return (
    <div className="flex items-center justify-center py-24"><div className="w-6 h-6 border-2 border-green-700 border-t-transparent rounded-full animate-spin" /></div>
  )

  return (
    <div className="px-8 py-8 max-w-4xl pb-32">
      <button onClick={() => router.push('/admin/courses')} className="text-sm text-gray-500 hover:text-gray-800 mb-4">← Tous les cours</button>

      {/* En-tête du cours */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs font-black text-green-700 bg-green-50 px-2.5 py-1 rounded-full uppercase">{level.replace('_', ' ')}</span>
          {subjectName && <span className="text-xs text-gray-400">{subjectName}</span>}
        </div>
        <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase">Titre</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Titre du cours"
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-lg font-bold mb-3" />
        <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase">Sous-titre</label>
        <input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="Sous-titre (optionnel)"
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm mb-3" />
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input type="checkbox" checked={isPremium} onChange={(e) => setIsPremium(e.target.checked)} className="w-4 h-4" />
          <span className="text-sm text-gray-700 font-medium">Réservé aux abonnés Premium</span>
        </label>
      </div>

      {/* Objectifs généraux */}
      <div className="space-y-5">
        {objectives.map((og, oi) => (
          <div key={oi} className="bg-white rounded-2xl border-2 border-green-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-black text-white bg-green-700 px-2 py-1 rounded-lg">O.G {oi + 1}</span>
              <input value={og.title} onChange={(e) => updateOG(oi, { title: e.target.value })}
                placeholder="Objectif général…" className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm font-bold" />
              <button onClick={() => moveOG(oi, -1)} className="px-2 py-1 text-gray-400 hover:text-gray-700" title="Monter">↑</button>
              <button onClick={() => moveOG(oi, 1)} className="px-2 py-1 text-gray-400 hover:text-gray-700" title="Descendre">↓</button>
              <button onClick={() => removeOG(oi)} className="px-2 py-1 text-gray-400 hover:text-red-600" title="Supprimer">🗑️</button>
            </div>

            {/* Objectifs spécifiques */}
            <div className="space-y-3 pl-3 border-l-2 border-green-100">
              {og.lessons.map((os, li) => (
                <LessonEditor
                  key={li} oi={oi} li={li} lesson={os}
                  onTitle={(t) => updateOS(oi, li, { title: t })}
                  onRemove={() => removeOS(oi, li)}
                  onMove={(d) => moveOS(oi, li, d)}
                  addBlock={(b) => addBlock(oi, li, b)}
                  updateBlock={(bi, p) => updateBlock(oi, li, bi, p)}
                  removeBlock={(bi) => removeBlock(oi, li, bi)}
                  moveBlock={(bi, d) => moveBlock(oi, li, bi, d)}
                />
              ))}
              <button onClick={() => addOS(oi)} className="text-sm text-green-700 font-bold hover:underline">+ Ajouter un objectif spécifique (O.S)</button>
            </div>
          </div>
        ))}
        <button onClick={addOG} className="w-full py-3 border-2 border-dashed border-green-300 rounded-2xl text-green-700 font-bold hover:bg-green-50">
          + Ajouter un objectif général (O.G)
        </button>
      </div>

      {/* Barre d'action fixe */}
      <div className="fixed bottom-0 left-64 right-0 bg-white border-t border-gray-200 px-8 py-4 flex items-center justify-between z-40">
        <button onClick={del} className="text-sm text-red-600 hover:underline">Supprimer le cours</button>
        <div className="flex items-center gap-4">
          {msg && <span className="text-sm font-medium">{msg}</span>}
          <button onClick={save} disabled={saving} className="px-8 py-2.5 bg-green-700 text-white rounded-xl text-sm font-bold hover:bg-green-800 disabled:opacity-50">
            {saving ? 'Enregistrement…' : 'Enregistrer'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Éditeur d'un O.S (titre + blocs de contenu) ──────────────────────────────
function LessonEditor(props: {
  oi: number; li: number; lesson: Lesson
  onTitle: (t: string) => void
  onRemove: () => void
  onMove: (dir: -1 | 1) => void
  addBlock: (b: Block) => void
  updateBlock: (bi: number, patch: Partial<Block>) => void
  removeBlock: (bi: number) => void
  moveBlock: (bi: number, dir: -1 | 1) => void
}) {
  const { lesson } = props
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  async function onPickImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/admin/courses/upload-image', { method: 'POST', credentials: 'include', body: fd })
    const json = await res.json()
    setUploading(false)
    if (res.ok) props.addBlock({ type: 'image', url: json.data.url, caption: '' })
    else alert(json.error?.message ?? 'Échec upload')
    if (fileRef.current) fileRef.current.value = ''
  }

  return (
    <div className="bg-green-50/40 rounded-xl border border-green-100 p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-black text-green-800 bg-green-100 px-2 py-0.5 rounded">O.S {props.li + 1}</span>
        <input value={lesson.title} onChange={(e) => props.onTitle(e.target.value)}
          placeholder="Objectif spécifique…" className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm font-semibold bg-white" />
        <button onClick={() => props.onMove(-1)} className="px-1.5 text-gray-400 hover:text-gray-700" title="Monter">↑</button>
        <button onClick={() => props.onMove(1)} className="px-1.5 text-gray-400 hover:text-gray-700" title="Descendre">↓</button>
        <button onClick={props.onRemove} className="px-1.5 text-gray-400 hover:text-red-600" title="Supprimer">🗑️</button>
      </div>

      {/* Blocs de contenu */}
      <div className="space-y-2">
        {lesson.content.map((b, bi) => (
          <div key={bi} className="flex items-start gap-2 bg-white rounded-lg border border-gray-100 p-2">
            <div className="flex flex-col text-gray-300">
              <button onClick={() => props.moveBlock(bi, -1)} className="hover:text-gray-600 leading-none" title="Monter">▲</button>
              <button onClick={() => props.moveBlock(bi, 1)} className="hover:text-gray-600 leading-none" title="Descendre">▼</button>
            </div>
            <div className="flex-1 min-w-0">
              {b.type === 'subtitle' && (
                <input value={b.text} onChange={(e) => props.updateBlock(bi, { text: e.target.value })}
                  placeholder="Sous-titre" className="w-full border-0 border-b border-gray-200 px-1 py-1 text-base font-bold focus:outline-none" />
              )}
              {b.type === 'paragraph' && (
                <textarea value={b.text} onChange={(e) => props.updateBlock(bi, { text: e.target.value })}
                  placeholder="Paragraphe…" rows={3} className="w-full border border-gray-100 rounded px-2 py-1 text-sm focus:outline-none resize-y" />
              )}
              {b.type === 'image' && (
                <div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={b.url} alt="" className="max-h-40 rounded-lg border border-gray-100" />
                  <input value={b.caption ?? ''} onChange={(e) => props.updateBlock(bi, { caption: e.target.value })}
                    placeholder="Légende (optionnel)" className="w-full mt-1 border-0 border-b border-gray-100 px-1 py-0.5 text-xs text-gray-500 focus:outline-none" />
                </div>
              )}
            </div>
            <span className="text-[10px] uppercase font-bold text-gray-300">{b.type === 'subtitle' ? 'S-titre' : b.type === 'paragraph' ? 'Texte' : 'Image'}</span>
            <button onClick={() => props.removeBlock(bi)} className="text-gray-300 hover:text-red-600" title="Supprimer">✕</button>
          </div>
        ))}
      </div>

      {/* Ajout de blocs */}
      <div className="flex items-center gap-2 mt-3">
        <button onClick={() => props.addBlock({ type: 'subtitle', text: '' })} className="text-xs font-bold text-green-700 bg-white border border-green-200 rounded-lg px-2.5 py-1 hover:bg-green-50">+ Sous-titre</button>
        <button onClick={() => props.addBlock({ type: 'paragraph', text: '' })} className="text-xs font-bold text-green-700 bg-white border border-green-200 rounded-lg px-2.5 py-1 hover:bg-green-50">+ Paragraphe</button>
        <button onClick={() => fileRef.current?.click()} disabled={uploading} className="text-xs font-bold text-green-700 bg-white border border-green-200 rounded-lg px-2.5 py-1 hover:bg-green-50 disabled:opacity-50">
          {uploading ? 'Upload…' : '+ Image'}
        </button>
        <input ref={fileRef} type="file" accept="image/*" onChange={onPickImage} className="hidden" />
      </div>
    </div>
  )
}
