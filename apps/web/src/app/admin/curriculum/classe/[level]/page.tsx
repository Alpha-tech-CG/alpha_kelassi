'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

/**
 * Curriculum — étape 2 : les matières d'une classe.
 *
 * L'ajout d'une matière se fait ici, avec le niveau déjà fixé par la classe
 * ouverte : impossible de créer par mégarde une matière rattachée au mauvais
 * examen, ce que permettait la page « Matières » globale.
 */

interface Subject {
  id: string; name: string; level: string; track_type: string
  icon: string | null; parent_subject_id?: string | null
  doc_count: number; video_count: number
}

const CLASS_LABEL: Record<string, { label: string; classe: string }> = {
  cepe:  { label: 'CEPE',  classe: 'CM2' },
  bepc:  { label: 'BEPC',  classe: '3e' },
  bac_a: { label: 'BAC A', classe: 'Terminale A' },
  bac_c: { label: 'BAC C', classe: 'Terminale C' },
  bac_d: { label: 'BAC D', classe: 'Terminale D' },
}

export default function AdminClassSubjectsPage() {
  const { level } = useParams<{ level: string }>()
  const meta = CLASS_LABEL[level] ?? { label: level?.toUpperCase() ?? '?', classe: '' }

  const [rows, setRows] = useState<Subject[]>([])
  const [chapCount, setChapCount] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState<string | null>(null)

  const [name, setName] = useState('')
  const [icon, setIcon] = useState('')
  const [track, setTrack] = useState<'generale' | 'technique'>('generale')

  const load = useCallback(async () => {
    const [s, c] = await Promise.all([
      fetch('/api/admin/subjects', { credentials: 'include' }).then((r) => r.json()),
      fetch(`/api/admin/curriculum/chapters/count?level=${level}`, { credentials: 'include' })
        .then((r) => r.json()).catch(() => ({ data: {} })),
    ])
    setRows(((s.data ?? []) as Subject[]).filter((x) => x.level === level))
    setChapCount(c.data ?? {})
    setLoading(false)
  }, [level])
  useEffect(() => { load() }, [load])

  async function add(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true); setError(null)
    const res = await fetch('/api/admin/subjects', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
      // Le niveau vient de la classe ouverte, pas d'un choix de l'utilisateur.
      body: JSON.stringify({ name, level, track_type: track, icon: icon || undefined }),
    })
    const json = await res.json()
    setSaving(false)
    if (!res.ok) { setError(json.error?.message ?? 'Erreur'); return }
    setName(''); setIcon(''); await load()
  }

  async function remove(s: Subject) {
    const chapters = chapCount[s.id] ?? 0
    const warning = chapters > 0
      ? `Supprimer « ${s.name} » ? Ses ${chapters} chapitre(s) et toutes leurs leçons seront supprimés aussi.`
      : `Supprimer la matière « ${s.name} » ?`
    if (!confirm(warning)) return
    setBusy(s.id)
    const res = await fetch(`/api/admin/subjects/${s.id}`, { method: 'DELETE', credentials: 'include' })
    setBusy(null)
    if (res.ok) await load()
    else alert((await res.json()).error?.message ?? 'Erreur')
  }

  const byId = new Map(rows.map((r) => [r.id, r]))

  return (
    <div className="px-8 py-8 max-w-4xl">
      <Link href="/admin/curriculum" className="text-sm text-gray-400 hover:text-gray-700">← Classes</Link>
      <h1 className="text-2xl font-black text-gray-900 mt-2 mb-1">
        Matières — {meta.label}
        {meta.classe && <span className="text-gray-400 font-bold text-lg ml-2">{meta.classe}</span>}
      </h1>
      <p className="text-gray-500 text-sm mb-6">Ouvre une matière pour gérer ses chapitres.</p>

      {/* Ajout d'une matière */}
      <form onSubmit={add} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        {error && <div className="p-3 bg-red-50 text-red-700 rounded-xl text-sm mb-4">{error}</div>}
        <div className="grid grid-cols-12 gap-3 items-end">
          <div className="col-span-5">
            <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase">Nom de la matière</label>
            <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Mathématiques"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm" />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase">Icône</label>
            <input value={icon} onChange={(e) => setIcon(e.target.value)} placeholder="📐" maxLength={4}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-center" />
          </div>
          <div className="col-span-3">
            <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase">Filière</label>
            <select value={track} onChange={(e) => setTrack(e.target.value as 'generale' | 'technique')}
              className="w-full border border-gray-200 rounded-xl px-2 py-2.5 text-sm">
              <option value="generale">Générale</option>
              <option value="technique">Technique</option>
            </select>
          </div>
          <div className="col-span-2">
            <button type="submit" disabled={saving}
              className="w-full px-4 py-2.5 bg-green-700 text-white rounded-xl text-sm font-bold hover:bg-green-800 disabled:opacity-50">
              {saving ? '…' : 'Ajouter'}
            </button>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-3">La matière sera créée pour la classe {meta.label}.</p>
      </form>

      {/* Liste */}
      {loading ? (
        <div className="flex justify-center py-16"><div className="w-6 h-6 border-2 border-green-700 border-t-transparent rounded-full animate-spin" /></div>
      ) : rows.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400">
          Aucune matière pour cette classe. Ajoute la première ci-dessus.
        </div>
      ) : (
        <div className="space-y-2">
          {rows.map((s) => {
            const parent = s.parent_subject_id ? byId.get(s.parent_subject_id) : null
            const chapters = chapCount[s.id] ?? 0
            return (
              <div key={s.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3 flex items-center gap-3">
                <span className="text-2xl w-9 text-center flex-shrink-0" aria-hidden="true">{s.icon ?? '📘'}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">
                    {s.name}
                    {parent && (
                      <span className="ml-2 text-[10px] font-bold text-violet-700 bg-violet-50 px-2 py-0.5 rounded-full align-middle">
                        domaine de {parent.name}
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {chapters} chapitre{chapters !== 1 ? 's' : ''}
                    {s.track_type === 'technique' && ' · filière technique'}
                  </p>
                </div>
                <Link href={`/admin/curriculum/subject/${s.id}`}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-bold text-gray-700 flex-shrink-0">
                  Chapitres →
                </Link>
                <button onClick={() => remove(s)} disabled={busy === s.id}
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-40"
                  title="Supprimer la matière">🗑️</button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
