'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface Course {
  id: string; title: string; subtitle: string | null; level: string
  is_premium: boolean; subject_name: string | null; objective_count: number
}
interface Subject { id: string; name: string; level: string }

const LEVELS = [
  { value: 'bepc', label: 'BEPC' },
  { value: 'bac_a', label: 'BAC A' },
  { value: 'bac_c', label: 'BAC C' },
  { value: 'bac_d', label: 'BAC D' },
]

export default function AdminCoursesPage() {
  const router = useRouter()
  const supabase = createClient()
  const [courses, setCourses] = useState<Course[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ subject_id: '', level: 'bepc', title: '', subtitle: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    const [res, { data: subs }] = await Promise.all([
      fetch('/api/admin/courses', { credentials: 'include' }).then((r) => r.json()),
      supabase.from('subjects').select('id, name, level').order('name'),
    ])
    setCourses(res.data ?? [])
    setSubjects((subs ?? []) as Subject[])
    setLoading(false)
  }, [supabase])

  useEffect(() => { load() }, [load])

  const subjectsForLevel = subjects.filter((s) => s.level === form.level)

  async function create(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true); setError(null)
    const res = await fetch('/api/admin/courses', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
      body: JSON.stringify(form),
    })
    const json = await res.json()
    setSaving(false)
    if (!res.ok) { setError(json.error?.message ?? 'Erreur'); return }
    router.push(`/admin/courses/${json.data.id}`)
  }

  return (
    <div className="px-8 py-8 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">Cours</h1>
        <p className="text-gray-500 text-sm mt-1">Rédige des cours structurés (titre, objectifs, contenu, images) — synchronisés avec l&apos;app.</p>
      </div>

      {/* Création */}
      <form onSubmit={create} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        {error && <div className="p-3 bg-red-50 text-red-700 rounded-xl text-sm mb-4">{error}</div>}
        <div className="grid grid-cols-12 gap-4 items-end">
          <div className="col-span-2">
            <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase">Niveau</label>
            <select value={form.level} onChange={(e) => setForm((f) => ({ ...f, level: e.target.value, subject_id: '' }))}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm">
              {LEVELS.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
            </select>
          </div>
          <div className="col-span-3">
            <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase">Matière</label>
            <select required value={form.subject_id} onChange={(e) => setForm((f) => ({ ...f, subject_id: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm">
              <option value="">Choisir…</option>
              {subjectsForLevel.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div className="col-span-5">
            <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase">Titre du cours</label>
            <input required value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="ex: Les fonctions dérivées" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm" />
          </div>
          <div className="col-span-2">
            <button type="submit" disabled={saving} className="w-full px-4 py-2.5 bg-green-700 text-white rounded-xl text-sm font-bold hover:bg-green-800 disabled:opacity-50">
              {saving ? '…' : 'Créer'}
            </button>
          </div>
        </div>
      </form>

      {/* Liste groupée par niveau */}
      {loading ? (
        <div className="flex items-center justify-center py-16"><div className="w-6 h-6 border-2 border-green-700 border-t-transparent rounded-full animate-spin" /></div>
      ) : courses.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400">Aucun cours. Crée le premier ci-dessus.</div>
      ) : (
        <div className="space-y-6">
          {LEVELS.map((lvl) => {
            const items = courses.filter((c) => c.level === lvl.value)
            if (items.length === 0) return null
            return (
              <div key={lvl.value}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-black text-green-700 bg-green-50 px-2.5 py-1 rounded-full uppercase">{lvl.label}</span>
                  <span className="text-xs text-gray-400">{items.length} cours</span>
                </div>
                <div className="space-y-2">
                  {items.map((c) => (
                    <button key={c.id} onClick={() => router.push(`/admin/courses/${c.id}`)}
                      className="w-full text-left bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 flex items-center gap-3 hover:border-green-300 transition-colors">
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 truncate">{c.title} {c.is_premium ? '⭐' : ''}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {c.subject_name ? `${c.subject_name} · ` : ''}{c.objective_count} objectif{c.objective_count > 1 ? 's' : ''} général{c.objective_count > 1 ? 'aux' : ''}
                        </p>
                      </div>
                      <span className="text-green-700 text-sm font-bold">Éditer →</span>
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
