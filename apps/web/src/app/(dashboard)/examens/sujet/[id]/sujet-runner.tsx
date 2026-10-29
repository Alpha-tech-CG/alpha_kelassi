'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { MarkdownRenderer } from '@/components/markdown-renderer'
import { originLabel, rayonMeta, type BaremeItem, type ExamKind, type Paper } from '@/lib/prepa'

export interface PastResult { total: number | null; max_total: number | null; created_at: string; mode: string }

interface Props {
  paper: Omit<Paper, 'bareme'> & { bareme: BaremeItem[] }
  statement: string
  subjectId: string
  subjectName: string
  mode: ExamKind
  past: PastResult[]
}

type Phase = 'intro' | 'running' | 'corrige' | 'saved'

const fmt = (sec: number) => {
  const s = Math.max(0, Math.floor(sec))
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), r = s % 60
  return `${h > 0 ? `${h}:` : ''}${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}`
}
const mention = (n: number) =>
  n >= 16 ? 'Très bien' : n >= 14 ? 'Bien' : n >= 12 ? 'Assez bien' : n >= 10 ? 'Passable' : 'Insuffisant'

/**
 * Déroulé d'un sujet rédigé : consignes → épreuve chronométrée (sauf ancien sujet,
 * où le chrono est indicatif) → « Rendre ma copie » enregistre une tentative, ce qui
 * débloque le corrigé (RLS, migration 035) → l'élève se note au barème (Bac rouge :
 * tout ou rien par partie) → la note est enregistrée dans `exam_results`.
 * Le départ du chrono est gardé dans le navigateur pour survivre à un rechargement.
 */
export function SujetRunner({ paper, statement, subjectId, subjectName, mode, past }: Props) {
  const supabase = useMemo(() => createClient(), [])
  const meta = rayonMeta(mode, null)
  const strict = mode === 'bac_rouge'
  const timed = mode !== 'ancien_bac'
  const startKey = `sujet-start:${paper.id}:${mode}`
  const bareme = paper.bareme.length > 0 ? paper.bareme : [{ label: 'Note globale', points: 20 }]
  const maxTotal = bareme.reduce((a, b) => a + b.points, 0)

  const [phase, setPhase] = useState<Phase>('intro')
  const [startedAt, setStartedAt] = useState<number | null>(null)
  const [now, setNow] = useState(() => Date.now())
  const [elapsed, setElapsed] = useState(0)
  const [solution, setSolution] = useState<string | null>(null)
  const [scores, setScores] = useState<number[]>(() => bareme.map(() => 0))
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Reprise d'une épreuve commencée (rechargement de page).
  useEffect(() => {
    try {
      const v = Number(localStorage.getItem(startKey))
      if (v > 0 && Date.now() - v < (paper.duration_min + 60) * 60_000) { setStartedAt(v); setPhase('running') }
    } catch { /* stockage indisponible : on repart de zéro */ }
  }, [startKey, paper.duration_min])

  useEffect(() => {
    if (phase !== 'running') return
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [phase])

  const spent = startedAt ? (now - startedAt) / 1000 : 0
  const remaining = paper.duration_min * 60 - spent
  const timeUp = timed && phase === 'running' && remaining <= 0

  function start() {
    const t = Date.now()
    try { localStorage.setItem(startKey, String(t)) } catch { /* ignoré */ }
    setStartedAt(t); setNow(t); setPhase('running')
    window.scrollTo({ top: 0 })
  }

  async function rendre() {
    if (busy) return
    setBusy(true); setError(null)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setError('Connecte-toi pour rendre ta copie.'); return }
      const { error: attemptError } = await supabase.from('exercise_attempts')
        .upsert({ user_id: user.id, exercise_id: paper.id } as never, { onConflict: 'user_id,exercise_id', ignoreDuplicates: true })
      if (attemptError) { console.error('[sujet] attempt', attemptError); setError('Copie non rendue. Vérifie ta connexion et réessaie.'); return }
      const { data, error: solError } = await supabase.from('exercise_solutions')
        .select('solution').eq('exercise_id', paper.id).maybeSingle()
      if (solError) { console.error('[sujet] solution', solError); setError('Impossible de charger le corrigé. Réessaie.'); return }
      setSolution((data as unknown as { solution?: string } | null)?.solution ?? 'Le corrigé de ce sujet n’est pas encore disponible.')
      setElapsed(Math.round(spent))
      try { localStorage.removeItem(startKey) } catch { /* ignoré */ }
      setPhase('corrige')
      window.scrollTo({ top: 0 })
    } finally { setBusy(false) }
  }

  const total = scores.reduce((a, b) => a + b, 0)
  const sur20 = maxTotal > 0 ? Math.round((total / maxTotal) * 200) / 10 : 0

  async function enregistrer() {
    if (busy) return
    setBusy(true); setError(null)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setError('Connecte-toi pour enregistrer ta note.'); return }
      const { error: e } = await supabase.from('exam_results').insert({
        user_id: user.id, exercise_id: paper.id, mode,
        scores: bareme.map((b, i) => ({ label: b.label, points: scores[i], max: b.points })),
        total, max_total: maxTotal, duration_sec: elapsed,
      } as never)
      if (e) { console.error('[sujet] result', e); setError('Note non enregistrée. Réessaie.'); return }
      setPhase('saved')
    } finally { setBusy(false) }
  }

  const back = `/examens?rayon=${mode}&subject=${subjectId}`

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <nav className="flex items-center gap-1.5 text-sm mb-6 flex-wrap">
        <Link href="/examens" className="text-emerald-700 hover:underline font-medium">Prépa</Link>
        <span className="text-gray-300">›</span>
        <Link href={back} className="text-emerald-700 hover:underline font-medium">{meta.label} — {subjectName}</Link>
      </nav>

      {phase === 'running' && (
        <div className={`sticky top-2 z-10 mb-4 flex items-center justify-between gap-3 rounded-2xl px-4 py-3 shadow-md ${timeUp ? 'bg-red-600 text-white' : 'bg-gray-900 text-white'}`}>
          <span className="font-mono text-xl font-black">
            {timed ? (timeUp ? 'Temps écoulé' : fmt(remaining)) : fmt(spent)}
          </span>
          <button onClick={() => { if (timeUp || confirm('Rendre ta copie maintenant ? Tu verras ensuite le corrigé.')) void rendre() }}
            disabled={busy}
            className="rounded-xl bg-white px-4 py-2 text-sm font-black text-gray-900 hover:bg-gray-100 disabled:opacity-50">
            {busy ? '…' : 'Rendre ma copie'}
          </button>
        </div>
      )}

      <h1 className="text-2xl font-black text-gray-900">{paper.title}</h1>
      <p className="text-sm text-gray-500 mt-1 mb-6">
        {meta.emoji} {meta.label} · {originLabel(paper)} · durée {fmt(paper.duration_min * 60)}
      </p>

      {error && <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p>}

      {phase === 'intro' && (
        <div className="rounded-2xl border border-gray-100 bg-white p-5 space-y-4">
          <div>
            <p className="font-black text-gray-900 mb-2">Consignes</p>
            <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
              <li>Prépare des feuilles, ta calculatrice et ton matériel de géométrie, comme le jour de l&apos;examen.</li>
              {timed
                ? <li>Le chrono démarre dès que tu ouvres le sujet : {fmt(paper.duration_min * 60)}. À la fin, rends ta copie.</li>
                : <li>Ancien sujet : le chrono est indicatif, prends le temps qu&apos;il te faut.</li>}
              <li>Après avoir rendu ta copie, tu verras le corrigé et tu te noteras avec le barème.</li>
              {strict && <li className="font-semibold text-red-700">Bac rouge : correction stricte, une partie incomplète ou fausse vaut 0.</li>}
              {paper.origin === 'genere' && <li>Sujet inédit créé par Cognix sur le modèle des sujets officiels : mêmes notions, questions posées autrement.</li>}
            </ul>
          </div>
          <div>
            <p className="font-black text-gray-900 mb-2">Barème</p>
            <ul className="text-sm text-gray-700 divide-y divide-gray-100">
              {bareme.map((b) => <li key={b.label} className="flex justify-between py-1.5"><span>{b.label}</span><span className="font-bold">{b.points} pts</span></li>)}
            </ul>
          </div>
          {past.length > 0 && (
            <p className="text-xs text-gray-500">
              Déjà fait : {past.map((r) => `${r.max_total ? Math.round(((r.total ?? 0) / r.max_total) * 200) / 10 : '—'}/20 le ${new Date(r.created_at).toLocaleDateString('fr-FR')}`).join(' · ')}
            </p>
          )}
          <button onClick={start} className="w-full rounded-xl bg-emerald-700 py-3 font-black text-white hover:bg-emerald-800">
            Commencer l&apos;épreuve
          </button>
        </div>
      )}

      {phase === 'running' && (
        <article className="rounded-2xl border border-gray-100 bg-white p-5">
          <MarkdownRenderer content={statement} className="text-[15px] text-gray-800" />
        </article>
      )}

      {(phase === 'corrige' || phase === 'saved') && (
        <>
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 mb-4">
            <p className="font-black text-emerald-900 mb-1">Ta note</p>
            <p className="text-sm text-emerald-900 mb-3">
              Compare ta copie au corrigé ci-dessous et attribue-toi les points de chaque partie
              {strict ? ' (Bac rouge : tout ou rien)' : ''}. Temps passé : {fmt(elapsed)}.
            </p>
            <ul className="space-y-2">
              {bareme.map((b, i) => (
                <li key={b.label} className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-gray-800">{b.label}</span>
                  {strict ? (
                    <label className="flex items-center gap-2 font-semibold">
                      <input type="checkbox" disabled={phase === 'saved'} checked={scores[i] === b.points}
                        onChange={(e) => setScores((s) => s.map((v, j) => (j === i ? (e.target.checked ? b.points : 0) : v)))} />
                      {b.points} pts
                    </label>
                  ) : (
                    <span className="flex items-center gap-1">
                      <input type="number" min={0} max={b.points} step={0.25} value={scores[i]} disabled={phase === 'saved'}
                        onChange={(e) => {
                          const v = Math.min(b.points, Math.max(0, Number(e.target.value) || 0))
                          setScores((s) => s.map((x, j) => (j === i ? v : x)))
                        }}
                        className="w-20 rounded-lg border border-gray-200 px-2 py-1 text-right" />
                      <span className="text-gray-500">/ {b.points}</span>
                    </span>
                  )}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-lg font-black text-emerald-900">
              {total} / {maxTotal}{maxTotal !== 20 ? ` — soit ${sur20}/20` : ''} · {mention(sur20)}
            </p>
            {phase === 'corrige' ? (
              <button onClick={() => void enregistrer()} disabled={busy}
                className="mt-3 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-800 disabled:opacity-50">
                {busy ? 'Enregistrement…' : 'Enregistrer ma note'}
              </button>
            ) : (
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-xl bg-white px-3 py-2 text-sm font-bold text-emerald-800">✓ Note enregistrée</span>
                {mode !== 'ancien_bac' && (
                  <Link href={`/examens/simulation?rayon=${mode}&subject=${subjectId}`}
                    className="rounded-xl bg-emerald-700 px-3 py-2 text-sm font-bold text-white hover:bg-emerald-800">Nouvelle simulation</Link>
                )}
                <Link href={back} className="rounded-xl bg-white px-3 py-2 text-sm font-bold text-gray-700">Retour aux sujets</Link>
              </div>
            )}
          </div>

          <article className="rounded-2xl border border-gray-100 bg-white p-5 mb-4">
            <p className="mb-2 text-xs font-extrabold uppercase tracking-wide text-emerald-700">Corrigé</p>
            <MarkdownRenderer content={solution ?? ''} className="text-sm text-gray-800" />
          </article>

          <details className="rounded-2xl border border-gray-100 bg-white p-5">
            <summary className="cursor-pointer font-bold text-gray-700">Revoir l&apos;énoncé</summary>
            <div className="mt-3"><MarkdownRenderer content={statement} className="text-sm text-gray-800" /></div>
          </details>
        </>
      )}
    </div>
  )
}
