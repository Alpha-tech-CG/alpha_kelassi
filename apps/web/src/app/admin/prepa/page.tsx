'use client'

import { Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { STUDY_LEVELS, LEVEL_META, type StudyLevel } from '@alpha-kelassi/types'
import { adminFetch } from '@/lib/admin-fetch'
import { EXAM_KINDS, EXAM_KIND_META, type ExamKind } from '@/lib/prepa'
import { useUndoToast, restoreFromTrash } from '@/app/admin/_components/undo-toast'

/**
 * Back office de l'espace « Prépa » : par classe, puis par matière, les
 * épreuves de chaque rayon (Bac test, Bac blanc, Bac rouge, Ancien bac) et les
 * TD (exercices corrigés des chapitres). C'est exactement ce que l'élève voit
 * en ouvrant « Prépa » dans l'application.
 */

interface Subject { id: string; name: string; level: string }
interface Epreuve { id: string; title: string; exam_kind: ExamKind | null; year: number | null; time_limit_sec: number; is_premium: boolean; question_count: number }
interface Chapter { id: string; title: string; order_index: number; exercise_count: number }
interface Sujet { id: string; title: string; year: number | null; session: string | null; is_premium: boolean; pdf_url: string | null; corrige_url: string | null }
interface PrepaData { epreuves: Epreuve[]; chapters: Chapter[]; sujets: Sujet[] }

type Tab = ExamKind | 'td'
const TABS: Tab[] = [...EXAM_KINDS, 'td']
const tabLabel = (t: Tab) => (t === 'td' ? '✏️ TD' : `${EXAM_KIND_META[t].emoji} ${EXAM_KIND_META[t].label}`)

const EMPTY_FORM = { title: '', year: '', minutes: 60, premium: false }

function PrepaAdmin() {
  const router = useRouter()
  const params = useSearchParams()
  const level = (params.get('level') ?? '') as StudyLevel | ''
  const subjectId = params.get('subject') ?? ''
  const tab = (TABS as string[]).includes(params.get('tab') ?? '') ? (params.get('tab') as Tab) : 'bac_test'

  const [subjects, setSubjects] = useState<Subject[]>([])
  const [data, setData] = useState<PrepaData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [busy, setBusy] = useState<string | null>(null)
  const undo = useUndoToast()

  /** Les sélections vivent dans l'URL : le retour depuis l'éditeur d'épreuve retombe au même endroit. */
  const setParam = useCallback((patch: Record<string, string>) => {
    const next = new URLSearchParams(params.toString())
    for (const [k, v] of Object.entries(patch)) { if (v) next.set(k, v); else next.delete(k) }
    router.replace(`/admin/prepa?${next.toString()}`, { scroll: false })
  }, [params, router])

  useEffect(() => {
    adminFetch<Subject[]>('/api/admin/subjects').then((res) => {
      if (res.ok) setSubjects(res.data ?? [])
      else setError(res.error)
    })
  }, [])

  const levelSubjects = useMemo(
    () => subjects.filter((s) => s.level === level).sort((a, b) => a.name.localeCompare(b.name, 'fr')),
    [subjects, level],
  )
  const subject = subjects.find((s) => s.id === subjectId) ?? null

  const load = useCallback(async () => {
    if (!subjectId) { setData(null); return }
    setLoading(true); setError(null)
    const res = await adminFetch<PrepaData>(`/api/admin/prepa?subjectId=${subjectId}`)
    if (res.ok) setData(res.data)
    else setError(res.error)
    setLoading(false)
  }, [subjectId])
  useEffect(() => { load() }, [load])

  async function create(e: React.FormEvent) {
    e.preventDefault()
    if (!subjectId || tab === 'td') return
    setSaving(true); setError(null)
    try {
      const res = await adminFetch<{ id: string }>('/api/admin/prepa', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject_id: subjectId, exam_kind: tab, title: form.title.trim(),
          year: form.year ? Number(form.year) : null,
          time_limit_sec: Math.round(form.minutes * 60), is_premium: form.premium,
        }),
      })
      if (!res.ok || !res.data) { setError(res.error); return }
      setForm(EMPTY_FORM)
      // Une épreuve sans question n'est pas jouable : on enchaîne sur l'éditeur.
      router.push(`/admin/prepa/epreuve/${res.data.id}`)
    } finally {
      setSaving(false)
    }
  }

  async function trash(ep: Epreuve) {
    setBusy(ep.id); setError(null)
    try {
      const res = await adminFetch(`/api/admin/prepa/${ep.id}`, { method: 'DELETE' })
      if (!res.ok) { setError(res.error); return }
      await load()
      undo.show(`« ${ep.title} » placée dans la corbeille.`, async () => {
        const err = await restoreFromTrash('quiz', ep.id)
        if (!err) await load()
        return err
      })
    } finally {
      setBusy(null)
    }
  }

  const list = (data?.epreuves ?? []).filter((e) => e.exam_kind === tab)
  const countOf = (t: Tab) => t === 'td'
    ? (data?.chapters ?? []).reduce((n, c) => n + c.exercise_count, 0)
    : (data?.epreuves ?? []).filter((e) => e.exam_kind === t).length

  return (
    <div className="px-4 sm:px-8 py-8 max-w-5xl">
      <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Prépa — examens & TD</h1>
          <p className="text-gray-500 text-sm mt-1">Ajoute, modifie ou retire les épreuves de chaque matière. Une épreuve supprimée va dans la corbeille et se restaure.</p>
        </div>
        <Link href="/admin/corbeille" className="text-sm font-semibold text-gray-600 hover:text-gray-900 bg-white border border-gray-200 rounded-xl px-3 py-2">🗑️ Corbeille</Link>
      </div>

      {/* Classe et matière */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase">Classe</label>
          <select value={level} onChange={(e) => setParam({ level: e.target.value, subject: '' })}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm">
            <option value="">Choisir une classe…</option>
            {STUDY_LEVELS.map((l) => <option key={l} value={l}>{LEVEL_META[l].label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase">Matière</label>
          <select value={subjectId} disabled={!level} onChange={(e) => setParam({ subject: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm disabled:bg-gray-50">
            <option value="">{level ? (levelSubjects.length ? 'Choisir une matière…' : 'Aucune matière dans cette classe') : '—'}</option>
            {levelSubjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
      </div>

      {error && <div className="p-3 bg-red-50 text-red-700 rounded-xl text-sm mb-4">{error}</div>}

      {!subject ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400">
          Choisis une classe puis une matière : les épreuves et les TD sont rangés par matière.
        </div>
      ) : (
        <>
          {/* Rayons */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
            {TABS.map((t) => (
              <button key={t} onClick={() => setParam({ tab: t })}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-bold border ${tab === t ? 'bg-green-700 text-white border-green-700' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}>
                {tabLabel(t)} <span className={tab === t ? 'text-green-100' : 'text-gray-400'}>{data ? countOf(t) : ''}</span>
              </button>
            ))}
          </div>

          {loading && !data ? (
            <div className="flex items-center justify-center py-16"><div className="w-6 h-6 border-2 border-green-700 border-t-transparent rounded-full animate-spin" /></div>
          ) : tab === 'td' ? (
            /* ── TD : exercices corrigés, chapitre par chapitre ───────────── */
            <div>
              <p className="text-sm text-gray-500 mb-3">
                Les TD sont les exercices corrigés des chapitres de {subject.name}. L&apos;élève répond d&apos;abord, le corrigé s&apos;ouvre ensuite.
              </p>
              {(data?.chapters ?? []).length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-400 text-sm">
                  Aucun chapitre dans cette matière. <Link className="text-green-700 font-semibold" href={`/admin/curriculum/subject/${subject.id}`}>Créer un chapitre</Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {data!.chapters.map((c) => (
                    <div key={c.id} className="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-3 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{c.title}</p>
                        <p className="text-xs text-gray-400">{c.exercise_count} exercice{c.exercise_count > 1 ? 's' : ''}</p>
                      </div>
                      <Link href={`/admin/curriculum/chapter/${c.id}/exercices`}
                        className="flex-shrink-0 px-3 py-1.5 bg-green-50 text-green-700 rounded-xl text-xs font-bold hover:bg-green-100">
                        Gérer les exercices
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* ── Épreuves d'un rayon ──────────────────────────────────────── */
            <>
              <form onSubmit={create} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 mb-4">
                <p className="font-bold text-gray-900 mb-1">Nouvelle épreuve — {EXAM_KIND_META[tab].label}</p>
                <p className="text-xs text-gray-400 mb-4">{EXAM_KIND_META[tab].hint}. Classe et matière : {LEVEL_META[subject.level as StudyLevel]?.label ?? subject.level} · {subject.name}.</p>
                <div className="grid grid-cols-1 sm:grid-cols-6 gap-3 items-end">
                  <input required minLength={3} value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                    placeholder={tab === 'ancien_bac' ? `ex. Bac 2022 — ${subject.name}` : `ex. ${EXAM_KIND_META[tab].label} n°1 — ${subject.name}`}
                    className="sm:col-span-3 border border-gray-200 rounded-xl px-3 py-2.5 text-sm" />
                  <input type="number" min={1960} max={2100} value={form.year} required={tab === 'ancien_bac'}
                    onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))}
                    placeholder={tab === 'ancien_bac' ? 'Année' : 'Année (option)'}
                    className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm" />
                  <label className="flex items-center gap-2 text-sm text-gray-600">
                    <input type="number" min={1} max={240} value={form.minutes}
                      onChange={(e) => setForm((f) => ({ ...f, minutes: Math.max(1, Math.min(240, Number(e.target.value) || 60)) }))}
                      className="w-20 border border-gray-200 rounded-xl px-3 py-2.5 text-sm" /> min
                  </label>
                  <button disabled={saving} className="bg-green-700 text-white font-bold px-4 py-2.5 rounded-xl text-sm hover:bg-green-800 disabled:opacity-50">
                    {saving ? '…' : 'Créer'}
                  </button>
                </div>
                <label className="flex items-center gap-2 text-sm text-gray-600 mt-3">
                  <input type="checkbox" checked={form.premium} onChange={(e) => setForm((f) => ({ ...f, premium: e.target.checked }))} />
                  Réservée aux abonnés (dès Starter)
                </label>
              </form>

              {list.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-400 text-sm">
                  Aucune épreuve « {EXAM_KIND_META[tab].label} » en {subject.name}.
                </div>
              ) : (
                <div className="space-y-2">
                  {list.map((ep) => (
                    <div key={ep.id} className="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-3 flex items-center justify-between gap-3 flex-wrap">
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900">{ep.title} {ep.is_premium ? '⭐' : ''}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {ep.year ? `${ep.year} · ` : ''}{Math.round(ep.time_limit_sec / 60)} min · {ep.question_count} question{ep.question_count > 1 ? 's' : ''}
                          {ep.question_count === 0 && <span className="text-amber-600 font-semibold"> · pas encore visible (aucune question)</span>}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/prepa/epreuve/${ep.id}`} className="px-3 py-1.5 bg-green-50 text-green-700 rounded-xl text-xs font-bold hover:bg-green-100">Modifier</Link>
                        <button onClick={() => trash(ep)} disabled={busy === ep.id}
                          className="px-3 py-1.5 bg-red-50 text-red-600 rounded-xl text-xs font-bold hover:bg-red-100 disabled:opacity-50">
                          Supprimer
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {tab === 'ancien_bac' && (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-bold text-gray-900 text-sm">Sujets PDF d&apos;anciens examens</p>
                    <Link href="/admin/documents" className="text-xs font-semibold text-green-700 hover:underline">Ajouter un sujet PDF →</Link>
                  </div>
                  {(data?.sujets ?? []).length === 0 ? (
                    <p className="text-sm text-gray-400">Aucun sujet PDF (type « examen ») dans cette matière.</p>
                  ) : (
                    <div className="space-y-2">
                      {data!.sujets.map((d) => (
                        <div key={d.id} className="bg-white rounded-xl border border-gray-100 px-4 py-2.5 text-sm flex items-center justify-between gap-3">
                          <span className="text-gray-800">{d.title} {d.is_premium ? '⭐' : ''}</span>
                          <span className="text-xs text-gray-400 flex-shrink-0">{d.year ?? ''} {d.corrige_url ? '· corrigé' : ''}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </>
      )}
      {undo.node}
    </div>
  )
}

export default function AdminPrepaPage() {
  return <Suspense fallback={<div className="px-8 py-8 text-sm text-gray-400">Chargement…</div>}><PrepaAdmin /></Suspense>
}
