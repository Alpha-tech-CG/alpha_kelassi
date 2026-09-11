'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { EARLY_ACCESS_PREVIEWS, lockedFeatureInfo, type LockedFeatureInfo } from '@alpha-kelassi/types'
import { LockedFeature } from '@/components/subscription/locked-feature'
import { MarkdownRenderer } from '@/components/markdown-renderer'
import { planErrorOf, useBillingMe } from '@/lib/subscription/client'

interface SubjectError { subject_id: string; subject_name: string; answered: number; wrong: number; error_rate: number }
interface Missed { question_id: string; prompt: string; explanation: string | null; subject_name: string; chapter_title: string | null; times_wrong: number; times_answered: number }
interface Progress { subject_id: string; subject_name: string; lessons_total: number; lessons_done: number; completion: number; quiz_attempts: number; quiz_average: number | null; error_rate: number | null; last_activity: string | null }
interface Reco { subject_id: string; subject_name: string; priority: 'haute' | 'moyenne' | 'basse'; reason: string; action: string }
interface Recurring { pattern: string; subject: string; evidence: string; remedy: string }
interface Coaching { subject_id: string; subject_name: string; diagnosis: string; steps: string[]; weekly_goal: string }
interface Insights {
  error_analysis: { by_subject: SubjectError[]; missed_questions: Missed[] }
  detailed_progress: Progress[] | null
  recommendations: Reco[]
  recurring_errors: { items: Recurring[]; generated: boolean } | null
  subject_recommendations: { items: Coaching[]; generated: boolean } | null
  locked: Record<string, LockedFeatureInfo> | null
}
interface Report { id: string; period_start: string; period_end: string; summary: string | null; content: Record<string, unknown>; created_at: string }

const PRIORITY_STYLE: Record<Reco['priority'], string> = {
  haute: 'bg-red-50 text-red-800 border-red-200',
  moyenne: 'bg-amber-50 text-amber-900 border-amber-200',
  basse: 'bg-emerald-50 text-emerald-800 border-emerald-200',
}

const dateFr = (d: string) => new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })

export default function AnalysePage() {
  const { data: me } = useBillingMe()
  const [data, setData] = useState<Insights | null>(null)
  const [locked, setLocked] = useState<LockedFeatureInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reports, setReports] = useState<Report[] | null>(null)
  const [generating, setGenerating] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/insights', { credentials: 'include' })
      const json = await res.json().catch(() => null)
      const planErr = planErrorOf(json)
      if (planErr?.info) setLocked(planErr.info)
      else if (!res.ok) setError(json?.error?.message ?? 'L’analyse n’a pas pu être chargée.')
      else setData(json.data)
    } catch {
      setError('Connexion impossible. Vérifie ta connexion et réessaie.')
    } finally {
      setLoading(false)
    }
  }, [])

  const loadReports = useCallback(async () => {
    const res = await fetch('/api/reports/progress', { credentials: 'include' })
    if (res.ok) setReports((await res.json()).data ?? [])
  }, [])

  useEffect(() => { load() }, [load])
  useEffect(() => { if (me?.features.progress_reports) loadReports() }, [me, loadReports])

  async function generateReport() {
    setGenerating(true)
    try {
      const res = await fetch('/api/reports/progress', { method: 'POST', credentials: 'include' })
      const json = await res.json().catch(() => null)
      if (res.ok) await loadReports()
      else setError(json?.error?.message ?? 'Le rapport n’a pas pu être généré.')
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-8">
      <header>
        <h1 className="text-2xl font-black text-gray-900">Mon analyse</h1>
        <p className="text-sm text-gray-500">Tes erreurs, ta progression par matière et quoi réviser en priorité.</p>
      </header>

      {loading && <p className="text-gray-500">Analyse de tes résultats…</p>}
      {error && <p role="alert" className="rounded-xl bg-red-50 text-red-700 p-3 text-sm">{error}</p>}
      {locked && <LockedFeature info={locked} />}

      {data && (
        <>
          {/* Recommandations */}
          <section aria-labelledby="recos">
            <h2 id="recos" className="text-lg font-black text-gray-900 mb-3">Quoi réviser en priorité</h2>
            {data.recommendations.length === 0 ? (
              <p className="text-sm text-gray-500">Passe quelques QCM pour obtenir des recommandations.</p>
            ) : (
              <ul className="space-y-2">
                {data.recommendations.slice(0, 6).map((r) => (
                  <li key={r.subject_id} className={`rounded-xl border p-4 ${PRIORITY_STYLE[r.priority]}`}>
                    <p className="font-bold">{r.subject_name} <span className="text-xs font-semibold">— priorité {r.priority}</span></p>
                    <p className="text-sm mt-0.5">Constat : {r.reason}.</p>
                    <p className="text-sm mt-0.5">À faire : {r.action}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Analyse des erreurs */}
          <section aria-labelledby="erreurs">
            <h2 id="erreurs" className="text-lg font-black text-gray-900 mb-3">Analyse des erreurs</h2>
            {data.error_analysis.by_subject.length === 0 ? (
              <p className="text-sm text-gray-500">Aucune réponse de QCM sur les 90 derniers jours.</p>
            ) : (
              <div className="overflow-x-auto bg-white border rounded-2xl">
                <table className="w-full text-sm">
                  <caption className="sr-only">Taux d’erreur par matière</caption>
                  <thead><tr className="text-left text-xs text-gray-500 uppercase border-b">
                    <th scope="col" className="p-3">Matière</th><th scope="col" className="p-3">Réponses</th><th scope="col" className="p-3">Erreurs</th><th scope="col" className="p-3">Taux d’erreur</th>
                  </tr></thead>
                  <tbody>
                    {data.error_analysis.by_subject.map((s) => (
                      <tr key={s.subject_id} className="border-b last:border-0">
                        <td className="p-3 font-semibold text-gray-900">{s.subject_name}</td>
                        <td className="p-3">{s.answered}</td>
                        <td className="p-3">{s.wrong}</td>
                        <td className="p-3 font-bold">{s.error_rate} %</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {data.error_analysis.missed_questions.length > 0 && (
              <div className="mt-4 space-y-2">
                <h3 className="font-bold text-gray-900">Questions le plus souvent manquées</h3>
                {data.error_analysis.missed_questions.map((m) => (
                  <details key={m.question_id} className="bg-white border rounded-xl p-3">
                    <summary className="cursor-pointer text-sm">
                      <span className="font-semibold">{m.subject_name}{m.chapter_title ? ` — ${m.chapter_title}` : ''}</span>
                      <span className="text-gray-500"> · ratée {m.times_wrong} fois sur {m.times_answered}</span>
                    </summary>
                    <div className="mt-2 text-sm text-gray-800"><MarkdownRenderer content={m.prompt} /></div>
                    {m.explanation && <div className="mt-2 text-sm text-gray-600 border-t pt-2"><MarkdownRenderer content={m.explanation} /></div>}
                  </details>
                ))}
              </div>
            )}
          </section>

          {/* Suivi détaillé */}
          {data.detailed_progress && (
            <section aria-labelledby="progression">
              <h2 id="progression" className="text-lg font-black text-gray-900 mb-3">Progression par matière</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {data.detailed_progress.map((p) => (
                  <div key={p.subject_id} className="bg-white border rounded-2xl p-4">
                    <p className="font-bold text-gray-900">{p.subject_name}</p>
                    <p className="text-sm text-gray-600">{p.lessons_done} leçon{p.lessons_done > 1 ? 's' : ''} sur {p.lessons_total} ({p.completion} %)</p>
                    <div role="progressbar" aria-label={`Progression en ${p.subject_name}`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={p.completion} className="h-2 bg-gray-100 rounded-full mt-2 overflow-hidden">
                      <div className="h-full bg-emerald-500" style={{ width: `${p.completion}%` }} />
                    </div>
                    <p className="text-xs text-gray-600 mt-2">
                      QCM : {p.quiz_attempts} · moyenne {p.quiz_average ?? '—'} % · erreurs {p.error_rate ?? '—'} %
                      {p.last_activity && ` · dernière activité le ${dateFr(p.last_activity)}`}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Pro Max */}
          {data.locked ? (
            <section aria-labelledby="promax" className="space-y-3">
              <h2 id="promax" className="text-lg font-black text-gray-900">Erreurs récurrentes et coaching par matière</h2>
              <LockedFeature info={data.locked['recurring_errors'] ?? lockedFeatureInfo('recurring_errors')} compact />
            </section>
          ) : (
            <>
              <section aria-labelledby="recurrentes">
                <h2 id="recurrentes" className="text-lg font-black text-gray-900 mb-3">Mes erreurs récurrentes</h2>
                {!data.recurring_errors?.items.length ? (
                  <p className="text-sm text-gray-500">Pas encore assez d’erreurs répétées pour dégager une tendance.</p>
                ) : (
                  <ul className="space-y-2">
                    {data.recurring_errors.items.map((r, i) => (
                      <li key={i} className="bg-white border rounded-xl p-4">
                        <p className="font-bold text-gray-900">{r.pattern}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{r.subject} · {r.evidence}</p>
                        <p className="text-sm text-gray-800 mt-2">{r.remedy}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              <section aria-labelledby="coaching">
                <h2 id="coaching" className="text-lg font-black text-gray-900 mb-3">Recommandations personnalisées par matière</h2>
                {!data.subject_recommendations?.items.length ? (
                  <p className="text-sm text-gray-500">Toutes tes matières avancent bien : continue ainsi.</p>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-3">
                    {data.subject_recommendations.items.map((c) => (
                      <div key={c.subject_id} className="bg-white border rounded-2xl p-4">
                        <p className="font-bold text-gray-900">{c.subject_name}</p>
                        <p className="text-sm text-gray-700 mt-1">{c.diagnosis}</p>
                        <ol className="list-decimal pl-5 text-sm text-gray-800 mt-2 space-y-1">{c.steps.map((s, i) => <li key={i}>{s}</li>)}</ol>
                        <p className="text-sm font-semibold text-gray-900 mt-2">Objectif de la semaine : {c.weekly_goal}</p>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </>
          )}
        </>
      )}

      {/* Rapports de progression */}
      {me && (
        <section aria-labelledby="rapports">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
            <h2 id="rapports" className="text-lg font-black text-gray-900">Rapports de progression</h2>
            {me.features.progress_reports && (
              <button type="button" onClick={generateReport} disabled={generating} className="px-4 py-2 rounded-xl bg-gray-900 text-white text-sm font-bold hover:bg-gray-700 disabled:opacity-50">
                {generating ? 'Rédaction du rapport…' : 'Générer le rapport de la semaine'}
              </button>
            )}
          </div>
          {!me.features.progress_reports ? (
            <LockedFeature feature="progress_reports" compact />
          ) : !reports?.length ? (
            <p className="text-sm text-gray-500">Aucun rapport pour l’instant. Il sera aussi visible par ton parent lié.</p>
          ) : (
            <ul className="space-y-3">
              {reports.map((r) => (
                <li key={r.id} className="bg-white border rounded-2xl p-4">
                  <p className="text-xs font-bold text-gray-500 uppercase">Du {dateFr(r.period_start)} au {dateFr(r.period_end)}</p>
                  <p className="text-sm text-gray-800 mt-1 leading-relaxed">{r.summary}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {/* Accès anticipé */}
      {me?.features.early_access && (
        <section aria-labelledby="anticipe">
          <h2 id="anticipe" className="text-lg font-black text-gray-900 mb-3">Accès anticipé</h2>
          {EARLY_ACCESS_PREVIEWS.length === 0 ? (
            <p className="text-sm text-gray-500">Aucune nouveauté en avant-première en ce moment. Tu seras parmi les premiers prévenus.</p>
          ) : (
            <ul className="space-y-2">
              {EARLY_ACCESS_PREVIEWS.map((p) => (
                <li key={p.key} className="bg-white border rounded-xl p-4">
                  <p className="font-bold text-gray-900">{p.title}</p>
                  <p className="text-sm text-gray-600">{p.description}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      <p className="text-xs text-gray-500">
        Une question ? Le support répond en priorité aux abonnés Pro et Pro Max. <Link href="/billing" className="underline">Voir ma formule</Link>
      </p>
    </div>
  )
}
