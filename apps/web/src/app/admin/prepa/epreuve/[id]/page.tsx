'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { MarkdownEditor } from '@/app/admin/_components/markdown-editor'
import { MarkdownRenderer } from '@/components/markdown-renderer'
import { adminFetch } from '@/lib/admin-fetch'
import { EXAM_KINDS, EXAM_KIND_META, type ExamKind } from '@/lib/prepa'
import { useUndoToast, restoreFromTrash } from '@/app/admin/_components/undo-toast'

/**
 * Éditeur d'une épreuve de l'espace Prépa : réglages (rayon, année, durée…),
 * questions (ajout, modification, suppression avec « Annuler ») et génération
 * de questions par IA à partir d'un document indexé de la matière.
 */

interface Question { id: string; position: number; prompt: string; options: string[]; correct_index: number; explanation: string | null }
interface Epreuve {
  id: string; title: string; description: string | null; exam_kind: ExamKind | null; year: number | null
  time_limit_sec: number; is_premium: boolean; level: string; deleted_at: string | null; subject_id: string
  subjects: { name: string; level: string } | null
  quiz_questions: Question[]
}
interface Draft { prompt: string; options: string[]; correct: number; explanation: string }
interface Doc { id: string; title: string; type: string; year: number | null }

const EMPTY_DRAFT: Draft = { prompt: '', options: ['', '', '', ''], correct: 0, explanation: '' }

/** Retire les options vides et recale l'index de la bonne réponse. */
function toPayload(d: Draft): { prompt: string; options: string[]; correct_index: number; explanation: string | null } | string {
  const kept = d.options.map((o, i) => ({ o: o.trim(), i })).filter((x) => x.o)
  if (kept.length < 2) return 'Il faut au moins deux options.'
  const correct_index = kept.findIndex((x) => x.i === d.correct)
  if (correct_index < 0) return 'La bonne réponse ne peut pas être une option vide.'
  if (d.prompt.trim().length < 3) return 'L\'énoncé est trop court.'
  return { prompt: d.prompt, options: kept.map((x) => x.o), correct_index, explanation: d.explanation.trim() || null }
}

function QuestionForm({ draft, onChange, onSubmit, onCancel, saving, submitLabel, radioName }: {
  draft: Draft; onChange: (d: Draft) => void; onSubmit: () => void; onCancel?: () => void
  saving: boolean; submitLabel: string; radioName: string
}) {
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit() }}>
      <MarkdownEditor required value={draft.prompt} onChange={(v) => onChange({ ...draft, prompt: v })} rows={3}
        placeholder="Énoncé — formules $…$, tableaux et schémas via la barre d’outils…" className="mb-3" />
      <p className="text-xs text-gray-500 mb-2">Coche la bonne réponse. Laisse une option vide pour ne pas l&apos;utiliser.</p>
      {draft.options.map((opt, i) => (
        <div key={i} className="flex items-center gap-3 mb-2">
          <input type="radio" name={radioName} checked={draft.correct === i} onChange={() => onChange({ ...draft, correct: i })}
            aria-label={`Bonne réponse : option ${i + 1}`} />
          <input value={opt} onChange={(e) => onChange({ ...draft, options: draft.options.map((v, j) => (j === i ? e.target.value : v)) })}
            placeholder={`Option ${String.fromCharCode(65 + i)}`}
            className={`flex-1 border rounded-xl px-3 py-2 text-sm ${draft.correct === i ? 'border-green-400 bg-green-50' : 'border-gray-200'}`} />
        </div>
      ))}
      {draft.options.length < 6 && (
        <button type="button" onClick={() => onChange({ ...draft, options: [...draft.options, ''] })}
          className="text-xs font-semibold text-gray-500 hover:text-gray-800 mb-2">+ option</button>
      )}
      <MarkdownEditor value={draft.explanation} onChange={(v) => onChange({ ...draft, explanation: v })} rows={3}
        placeholder="Corrigé affiché après la réponse (optionnel)" className="mt-2 mb-4" />
      <div className="flex items-center gap-3">
        <button disabled={saving} className="bg-green-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm disabled:opacity-50">
          {saving ? '…' : submitLabel}
        </button>
        {onCancel && <button type="button" onClick={onCancel} className="text-sm text-gray-500 hover:text-gray-800">Annuler</button>}
      </div>
    </form>
  )
}

export default function AdminEpreuvePage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const supabase = createClient()
  const undo = useUndoToast()

  const [ep, setEp] = useState<Epreuve | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  // Réglages
  const [meta, setMeta] = useState({ title: '', exam_kind: 'bac_test' as ExamKind, year: '', minutes: 60, premium: false, description: '' })
  const [savingMeta, setSavingMeta] = useState(false)

  // Questions
  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT)
  const [editing, setEditing] = useState<{ id: string; draft: Draft } | null>(null)
  const [saving, setSaving] = useState(false)
  const [busy, setBusy] = useState<string | null>(null)

  // Génération IA
  const [docs, setDocs] = useState<Doc[]>([])
  const [docId, setDocId] = useState('')
  const [count, setCount] = useState(10)
  const [generating, setGenerating] = useState(false)

  const load = useCallback(async () => {
    const res = await adminFetch<Epreuve>(`/api/admin/prepa/${id}`)
    if (res.ok && res.data) {
      const d = res.data
      setEp(d)
      setMeta({
        title: d.title, exam_kind: d.exam_kind ?? 'bac_test', year: d.year ? String(d.year) : '',
        minutes: Math.round(d.time_limit_sec / 60), premium: d.is_premium, description: d.description ?? '',
      })
    } else setError(res.error)
    setLoading(false)
  }, [id])
  useEffect(() => { load() }, [load])

  // Documents indexés de la matière : sources possibles pour la génération IA.
  useEffect(() => {
    if (!ep?.subject_id) return
    supabase.from('documents').select('id, title, type, year').eq('subject_id', ep.subject_id)
      .not('indexed_at', 'is', null).order('created_at', { ascending: false }).limit(100)
      .then(({ data }) => setDocs((data ?? []) as Doc[]))
  }, [ep?.subject_id, supabase])

  const backHref = ep ? `/admin/prepa?level=${ep.subjects?.level ?? ep.level}&subject=${ep.subject_id}&tab=${ep.exam_kind ?? 'bac_test'}` : '/admin/prepa'

  async function saveMeta(e: React.FormEvent) {
    e.preventDefault()
    setSavingMeta(true); setError(null); setNotice(null)
    try {
      const res = await adminFetch(`/api/admin/prepa/${id}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: meta.title.trim(), exam_kind: meta.exam_kind, year: meta.year ? Number(meta.year) : null,
          time_limit_sec: Math.round(meta.minutes * 60), is_premium: meta.premium, description: meta.description.trim() || null,
        }),
      })
      if (!res.ok) { setError(res.error); return }
      setNotice('Réglages enregistrés.')
      await load()
    } finally {
      setSavingMeta(false)
    }
  }

  async function addQuestion() {
    const p = toPayload(draft)
    if (typeof p === 'string') { setError(p); return }
    setSaving(true); setError(null)
    try {
      const res = await adminFetch('/api/admin/curriculum/quiz/questions', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quiz_id: id, ...p }),
      })
      if (!res.ok) { setError(res.error); return }
      setDraft(EMPTY_DRAFT)
      await load()
    } finally {
      setSaving(false)
    }
  }

  async function saveEdit() {
    if (!editing) return
    const p = toPayload(editing.draft)
    if (typeof p === 'string') { setError(p); return }
    setSaving(true); setError(null)
    try {
      const res = await adminFetch('/api/admin/curriculum/quiz/questions', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editing.id, ...p }),
      })
      if (!res.ok) { setError(res.error); return }
      setEditing(null)
      await load()
    } finally {
      setSaving(false)
    }
  }

  async function delQuestion(q: Question) {
    setBusy(q.id); setError(null)
    try {
      const res = await adminFetch<{ deleted: Omit<Question, 'id'> & { quiz_id: string } | null }>(
        `/api/admin/curriculum/quiz/questions?id=${q.id}`, { method: 'DELETE' })
      if (!res.ok) { setError(res.error); return }
      await load()
      const row = res.data?.deleted
      if (row) {
        undo.show(`Question ${q.position} supprimée.`, async () => {
          const r = await adminFetch('/api/admin/curriculum/quiz/questions', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(row),
          })
          if (r.ok) await load()
          return r.ok ? null : (r.error ?? 'Impossible de remettre la question.')
        })
      }
    } finally {
      setBusy(null)
    }
  }

  async function trashEpreuve() {
    if (!ep) return
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

  async function generate(e: React.FormEvent) {
    e.preventDefault()
    if (!docId) return
    setGenerating(true); setError(null); setNotice(null)
    try {
      const res = await adminFetch<{ question_count?: number }>('/api/admin/quiz/generate', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ document_id: docId, count, quiz_id: id }),
      })
      if (!res.ok) { setError(res.error ?? 'Génération impossible.'); return }
      setNotice(`✅ ${res.data?.question_count ?? 0} questions ajoutées — relis-les avant de publier.`)
      await load()
    } finally {
      setGenerating(false)
    }
  }

  if (loading) return <div className="px-8 py-8 text-sm text-gray-400">Chargement…</div>
  if (!ep) return <div className="px-8 py-8 text-sm text-red-600">{error ?? 'Épreuve introuvable.'}</div>

  const questions = ep.quiz_questions

  return (
    <div className="px-4 sm:px-8 py-8 max-w-4xl">
      <Link href={backHref} className="text-sm text-gray-400 hover:text-gray-700">← Prépa · {ep.subjects?.name ?? 'matière'}</Link>
      <div className="flex items-start justify-between gap-4 flex-wrap mt-2 mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">{ep.title}</h1>
          <p className="text-gray-500 text-sm mt-1">
            {ep.exam_kind ? `${EXAM_KIND_META[ep.exam_kind].emoji} ${EXAM_KIND_META[ep.exam_kind].label}` : 'Épreuve'} · {ep.subjects?.name} · {questions.length} question{questions.length > 1 ? 's' : ''}
          </p>
        </div>
        {!ep.deleted_at && (
          <div className="flex items-center gap-3">
            <Link href={`/quiz/${ep.id}`} target="_blank" className="text-sm font-semibold text-blue-600 hover:underline">Aperçu élève ↗</Link>
            <button onClick={trashEpreuve} disabled={busy === ep.id} className="text-sm font-semibold text-red-600 hover:underline disabled:opacity-50">Supprimer l&apos;épreuve</button>
          </div>
        )}
      </div>

      {ep.deleted_at && (
        <div className="p-3 bg-amber-50 text-amber-800 rounded-xl text-sm mb-4 flex items-center justify-between gap-3 flex-wrap">
          <span>Cette épreuve est dans la corbeille : les élèves ne la voient plus.</span>
          <button onClick={async () => { const err = await restoreFromTrash('quiz', ep.id); if (err) setError(err); else await load() }}
            className="font-bold text-amber-900 hover:underline">Restaurer</button>
        </div>
      )}
      {error && <div className="p-3 bg-red-50 text-red-700 rounded-xl text-sm mb-4">{error}</div>}
      {notice && <div className="p-3 bg-green-50 text-green-800 rounded-xl text-sm mb-4">{notice}</div>}

      {/* ── Réglages ─────────────────────────────────────────────────────── */}
      <form onSubmit={saveMeta} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 mb-6">
        <p className="font-bold text-gray-900 mb-4">Réglages</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <input required minLength={3} value={meta.title} onChange={(e) => setMeta((m) => ({ ...m, title: e.target.value }))}
            placeholder="Titre" className="sm:col-span-2 border border-gray-200 rounded-xl px-3 py-2.5 text-sm" />
          <label className="text-xs font-bold text-gray-600 uppercase">Rayon
            <select value={meta.exam_kind} onChange={(e) => setMeta((m) => ({ ...m, exam_kind: e.target.value as ExamKind }))}
              className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-normal normal-case">
              {EXAM_KINDS.map((k) => <option key={k} value={k}>{EXAM_KIND_META[k].emoji} {EXAM_KIND_META[k].label}</option>)}
            </select>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="text-xs font-bold text-gray-600 uppercase">Année
              <input type="number" min={1960} max={2100} value={meta.year} onChange={(e) => setMeta((m) => ({ ...m, year: e.target.value }))}
                className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-normal" />
            </label>
            <label className="text-xs font-bold text-gray-600 uppercase">Durée (min)
              <input type="number" min={1} max={240} value={meta.minutes}
                onChange={(e) => setMeta((m) => ({ ...m, minutes: Math.max(1, Math.min(240, Number(e.target.value) || 60)) }))}
                className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-normal" />
            </label>
          </div>
          <textarea value={meta.description} onChange={(e) => setMeta((m) => ({ ...m, description: e.target.value }))} rows={2}
            placeholder="Consignes affichées à l'élève (optionnel)" className="sm:col-span-2 border border-gray-200 rounded-xl px-3 py-2.5 text-sm" />
        </div>
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input type="checkbox" checked={meta.premium} onChange={(e) => setMeta((m) => ({ ...m, premium: e.target.checked }))} />
            Réservée aux abonnés (dès Starter)
          </label>
          <button disabled={savingMeta} className="bg-gray-900 text-white font-bold px-5 py-2.5 rounded-xl text-sm disabled:opacity-50">
            {savingMeta ? '…' : 'Enregistrer'}
          </button>
        </div>
      </form>

      {/* ── Génération IA ────────────────────────────────────────────────── */}
      <form onSubmit={generate} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 mb-6">
        <p className="font-bold text-gray-900 mb-1">✨ Générer des questions par IA</p>
        <p className="text-xs text-gray-400 mb-3">À partir d&apos;un document indexé de la matière (cours ou sujet). Les questions s&apos;ajoutent à la suite.</p>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <select value={docId} onChange={(e) => setDocId(e.target.value)} className="sm:col-span-2 border border-gray-200 rounded-xl px-3 py-2.5 text-sm">
            <option value="">{docs.length ? 'Choisir un document…' : 'Aucun document indexé dans cette matière'}</option>
            {docs.map((d) => <option key={d.id} value={d.id}>{d.title}{d.year ? ` (${d.year})` : ''}</option>)}
          </select>
          <select value={count} onChange={(e) => setCount(Number(e.target.value))} className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm">
            {[5, 10, 15, 20].map((n) => <option key={n} value={n}>{n} questions</option>)}
          </select>
          <button disabled={generating || !docId} className="bg-green-700 text-white font-bold px-4 py-2.5 rounded-xl text-sm disabled:opacity-50">
            {generating ? 'Génération…' : 'Générer'}
          </button>
        </div>
      </form>

      {/* ── Ajout manuel ─────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 mb-6">
        <p className="font-bold text-gray-900 mb-4">Ajouter une question</p>
        <QuestionForm draft={draft} onChange={setDraft} onSubmit={addQuestion} saving={saving} submitLabel="Ajouter la question" radioName="new-correct" />
      </div>

      {/* ── Questions ────────────────────────────────────────────────────── */}
      {questions.length === 0 ? (
        <p className="text-sm text-amber-700 bg-amber-50 rounded-xl px-3 py-2">Aucune question : l&apos;épreuve n&apos;apparaît pas encore chez les élèves.</p>
      ) : (
        <div className="space-y-2">
          {questions.map((q) => (
            <div key={q.id} className="bg-white rounded-2xl border border-gray-100 p-4">
              {editing?.id === q.id ? (
                <QuestionForm draft={editing.draft} onChange={(d) => setEditing({ id: q.id, draft: d })} onSubmit={saveEdit}
                  onCancel={() => setEditing(null)} saving={saving} submitLabel="Enregistrer la question" radioName={`edit-${q.id}`} />
              ) : (
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-start gap-2 font-semibold text-sm text-gray-900">
                      <span className="text-gray-400">{q.position}.</span>
                      <div className="min-w-0"><MarkdownRenderer content={q.prompt} /></div>
                    </div>
                    <ul className="mt-2 space-y-1">
                      {q.options.map((o, i) => (
                        <li key={i} className={`text-xs ${i === q.correct_index ? 'text-green-700 font-semibold' : 'text-gray-500'}`}>
                          {i === q.correct_index ? '✓ ' : '• '}{o}
                        </li>
                      ))}
                    </ul>
                    {q.explanation && <div className="text-xs text-gray-400 mt-2 italic"><MarkdownRenderer content={q.explanation} /></div>}
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <button onClick={() => setEditing({ id: q.id, draft: {
                      prompt: q.prompt, options: [...q.options, ...Array(Math.max(0, 4 - q.options.length)).fill('')],
                      correct: q.correct_index, explanation: q.explanation ?? '',
                    } })} className="text-xs font-semibold text-green-700 hover:underline">Modifier</button>
                    <button onClick={() => delQuestion(q)} disabled={busy === q.id}
                      className="text-xs font-semibold text-red-600 hover:underline disabled:opacity-50">Supprimer</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-8">
        <button onClick={() => router.push(backHref)} className="text-sm text-gray-500 hover:text-gray-800">← Retour aux épreuves</button>
      </div>
      {undo.node}
    </div>
  )
}
