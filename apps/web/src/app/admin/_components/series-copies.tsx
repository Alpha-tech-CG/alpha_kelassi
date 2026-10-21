'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { STUDY_LEVELS, LEVEL_META, type StudyLevel } from '@alpha-kelassi/types'
import { adminFetch } from '@/lib/admin-fetch'

/**
 * Un même cours dans plusieurs séries (migration 060) — composants de console.
 *
 * Chaque série reçoit une copie liée du chapitre, rangée dans la matière du même
 * nom (créée si elle n'existe pas). Les modifications de l'original sont
 * recopiées automatiquement ; on n'édite donc le cours qu'à un seul endroit.
 */

export interface SubjectRow { id: string; name: string; level: string }
export type CopyTarget = { subject_id: string } | { level: StudyLevel; subject_name: string }

/** Comparaison de noms de matières sans casse ni accents (« Économie » = « ECONOMIE »). */
const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[’']/g, "'").trim().toLowerCase()

export function matchSubject(subjects: SubjectRow[], level: string, name: string): SubjectRow | null {
  return subjects.find((s) => s.level === level && norm(s.name) === norm(name)) ?? null
}

/**
 * Choix des séries cibles. Pour chaque série cochée, la matière du même nom est
 * proposée d'office ; l'admin peut en choisir une autre ou en créer une.
 */
export function SeriesTargetPicker({ subjects, sourceName, exclude, value, onChange }: {
  subjects: SubjectRow[]
  sourceName: string
  /** Séries déjà servies (la série d'origine, les copies existantes). */
  exclude: string[]
  value: Record<string, string>   // level → subject_id, ou '' pour « créer »
  onChange: (v: Record<string, string>) => void
}) {
  const levels = STUDY_LEVELS.filter((l) => !exclude.includes(l))

  function toggle(level: StudyLevel) {
    const next = { ...value }
    if (level in next) delete next[level]
    else next[level] = matchSubject(subjects, level, sourceName)?.id ?? ''
    onChange(next)
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {levels.map((l) => (
          <button key={l} type="button" onClick={() => toggle(l)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${l in value ? 'bg-green-700 text-white border-green-700' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}>
            {l in value ? '✓ ' : ''}{LEVEL_META[l].label}
          </button>
        ))}
      </div>
      {Object.keys(value).length > 0 && (
        <div className="space-y-1.5 pt-1">
          {Object.entries(value).map(([level, subjectId]) => {
            const options = subjects.filter((s) => s.level === level).sort((a, b) => a.name.localeCompare(b.name, 'fr'))
            return (
              <div key={level} className="flex items-center gap-2 text-sm flex-wrap">
                <span className="w-20 font-bold text-gray-700">{LEVEL_META[level as StudyLevel]?.label ?? level}</span>
                <span className="text-gray-400">→</span>
                <select value={subjectId} onChange={(e) => onChange({ ...value, [level]: e.target.value })}
                  className="flex-1 min-w-[12rem] border border-gray-200 rounded-lg px-2 py-1.5 text-sm">
                  <option value="">➕ Créer la matière « {sourceName} »</option>
                  {options.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export function toTargets(value: Record<string, string>, sourceName: string): CopyTarget[] {
  return Object.entries(value).map(([level, subjectId]) =>
    subjectId ? { subject_id: subjectId } : { level: level as StudyLevel, subject_name: sourceName })
}

interface Member { chapter_id: string; subject_id: string; is_original: boolean; subject_name: string; level: string; lesson_count: number }
interface CopiesInfo { root_id: string; is_copy: boolean; members: Member[] }

/** Panneau « Séries » de la page d'un chapitre. */
export function SeriesCopiesPanel({ chapterId }: { chapterId: string }) {
  const [info, setInfo] = useState<CopiesInfo | null>(null)
  const [subjects, setSubjects] = useState<SubjectRow[]>([])
  const [picked, setPicked] = useState<Record<string, string>>({})
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  const load = useCallback(async () => {
    const [c, s] = await Promise.all([
      adminFetch<CopiesInfo>(`/api/admin/curriculum/chapters/${chapterId}/copies`),
      adminFetch<SubjectRow[]>('/api/admin/subjects'),
    ])
    if (c.ok) setInfo(c.data); else setError(c.error)
    if (s.ok) setSubjects(s.data ?? [])
  }, [chapterId])
  useEffect(() => { load() }, [load])

  const original = info?.members.find((m) => m.is_original) ?? null
  const copies = useMemo(() => (info?.members ?? []).filter((m) => !m.is_original), [info])
  const exclude = (info?.members ?? []).map((m) => m.level)
  const sourceName = original?.subject_name ?? ''

  async function publish() {
    if (Object.keys(picked).length === 0) return
    setBusy('publish'); setError(null); setNotice(null)
    try {
      const res = await adminFetch<{ created: { level: string }[]; failed: string[] }>(`/api/admin/curriculum/chapters/${chapterId}/copies`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targets: toTargets(picked, sourceName) }),
      })
      if (!res.ok) { setError(res.error); return }
      const n = res.data?.created.length ?? 0
      setNotice(`✅ Cours publié dans ${n} autre${n > 1 ? 's' : ''} série${n > 1 ? 's' : ''}.${res.data?.failed.length ? ` Échec : ${res.data.failed.join(', ')}.` : ''}`)
      setPicked({}); setOpen(false)
      await load()
    } finally {
      setBusy(null)
    }
  }

  async function syncNow() {
    setBusy('sync'); setError(null); setNotice(null)
    try {
      const res = await adminFetch<{ synced: number }>(`/api/admin/curriculum/chapters/${chapterId}/copies`, { method: 'PUT' })
      if (!res.ok) { setError(res.error); return }
      setNotice(`✅ ${res.data?.synced ?? 0} copie(s) mise(s) à jour.`)
      await load()
    } finally {
      setBusy(null)
    }
  }

  async function detach(m: Member) {
    if (!confirm(`Délier la copie de ${LEVEL_META[m.level as StudyLevel]?.label ?? m.level} ?\n\nElle reste en ligne mais ne suivra plus les modifications de l'original.`)) return
    setBusy(m.chapter_id); setError(null)
    try {
      const res = await adminFetch(`/api/admin/curriculum/chapters/${chapterId}/copies?copyId=${m.chapter_id}`, { method: 'DELETE' })
      if (!res.ok) { setError(res.error); return }
      await load()
    } finally {
      setBusy(null)
    }
  }

  if (!info) return null
  const label = (m: Member) => `${LEVEL_META[m.level as StudyLevel]?.label ?? m.level} · ${m.subject_name}`

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5 mb-6">
      {info.is_copy && original && (
        <div className="p-3 bg-amber-50 text-amber-900 rounded-xl text-sm mb-3">
          Ce cours est une <b>copie liée</b> de l&apos;original en {label(original)}. Modifie l&apos;original : les changements arrivent ici
          automatiquement (ce que tu modifies directement ici serait écrasé à la prochaine mise à jour).{' '}
          <Link href={`/admin/curriculum/chapter/${original.chapter_id}`} className="font-bold underline">Ouvrir l&apos;original</Link>
        </div>
      )}
      {error && <div className="p-3 bg-red-50 text-red-700 rounded-xl text-sm mb-3">{error}</div>}
      {notice && <div className="p-3 bg-green-50 text-green-800 rounded-xl text-sm mb-3">{notice}</div>}

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="min-w-0">
          <p className="font-bold text-gray-900 text-sm">🔗 Séries</p>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {info.members.map((m) => (
              <span key={m.chapter_id} className={`inline-flex items-center gap-1.5 text-xs rounded-full px-2.5 py-1 ${m.is_original ? 'bg-green-50 text-green-800 font-bold' : 'bg-gray-100 text-gray-700'}`}>
                {m.chapter_id === chapterId ? '● ' : ''}{label(m)}{m.is_original && info.members.length > 1 ? ' (original)' : ''}
                {!m.is_original && !info.is_copy && (
                  <button onClick={() => detach(m)} disabled={busy === m.chapter_id} title="Délier cette copie"
                    className="text-gray-400 hover:text-red-600 disabled:opacity-50">✕</button>
                )}
              </span>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {copies.length > 0 && (
            <button onClick={syncNow} disabled={busy === 'sync'}
              className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-bold text-gray-700 disabled:opacity-50">
              {busy === 'sync' ? '…' : '↻ Mettre à jour les copies'}
            </button>
          )}
          {!info.is_copy && (
            <button onClick={() => setOpen((o) => !o)}
              className="px-3 py-1.5 bg-green-50 hover:bg-green-100 rounded-lg text-xs font-bold text-green-700">
              {open ? 'Fermer' : '➕ Ajouter à d’autres séries'}
            </button>
          )}
        </div>
      </div>

      {open && !info.is_copy && (
        <div className="mt-4 border-t border-gray-100 pt-4">
          <p className="text-xs text-gray-500 mb-2">
            Coche les séries qui suivent aussi ce cours. Leçons, exercices et QCM y sont copiés, puis tenus à jour automatiquement.
          </p>
          <SeriesTargetPicker subjects={subjects} sourceName={sourceName} exclude={exclude} value={picked} onChange={setPicked} />
          <button onClick={publish} disabled={busy === 'publish' || Object.keys(picked).length === 0}
            className="mt-3 px-4 py-2 bg-green-700 text-white rounded-xl text-sm font-bold hover:bg-green-800 disabled:opacity-50">
            {busy === 'publish' ? 'Publication…' : `Publier dans ${Object.keys(picked).length || ''} série${Object.keys(picked).length > 1 ? 's' : ''}`}
          </button>
        </div>
      )}
    </div>
  )
}
