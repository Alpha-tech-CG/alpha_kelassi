'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { CalendarClock, Sparkles, CheckCircle2, Circle, Target } from 'lucide-react'
import { ReminderSettings } from './reminder-settings'

interface Plan { id: string; level: string; title: string; exam_date: string; days_remaining: number }
interface ExamEvent { id: string; level: string; label: string; exam_date: string }
interface Subject { id: string; name: string }
interface Session {
  id: string; subject_id: string | null; title: string
  scheduled_date: string; duration_min: number; is_done: boolean
  subjects: { name: string } | null
}

export default function PlanningPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [level, setLevel] = useState<string | null>(null)
  const [plan, setPlan] = useState<Plan | null>(null)
  const [exams, setExams] = useState<ExamEvent[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [sessions, setSessions] = useState<Session[]>([])

  // Contrôles du générateur
  const [picked, setPicked] = useState<Set<string>>(new Set())
  const [perDay, setPerDay] = useState(2)
  const [duration, setDuration] = useState(30)
  const [generating, setGenerating] = useState(false)

  const loadSessions = useCallback(async () => {
    const res = await fetch('/api/planning/sessions?scope=upcoming', { credentials: 'include' })
    const json = await res.json()
    setSessions(json.data ?? [])
  }, [])

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }

      const { data: profile } = await supabase.from('users').select('study_level_pref').eq('id', user.id).single()
      const lvl = (profile as unknown as { study_level_pref?: string } | null)?.study_level_pref ?? null
      setLevel(lvl)

      const planRes = await fetch('/api/planning/plan', { credentials: 'include' }).then((r) => r.json())
      setPlan(planRes.data)

      const examRes = await fetch(`/api/planning/exams${lvl ? `?level=${lvl}` : ''}`, { credentials: 'include' }).then((r) => r.json())
      setExams(examRes.data ?? [])

      let sq = supabase.from('subjects').select('id, name').order('name')
      if (lvl) sq = sq.eq('level', lvl)
      const { data: subs } = await sq
      setSubjects((subs ?? []) as Subject[])

      if (planRes.data) await loadSessions()
      setLoading(false)
    }
    load()
  }, [loadSessions, supabase])

  async function createPlan(exam: ExamEvent) {
    const res = await fetch('/api/planning/plan', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
      body: JSON.stringify({ level: exam.level, title: exam.label, exam_date: exam.exam_date }),
    })
    if (res.ok) {
      const planRes = await fetch('/api/planning/plan', { credentials: 'include' }).then((r) => r.json())
      setPlan(planRes.data)
    }
  }

  async function generate() {
    if (!plan || picked.size === 0 || generating) return
    setGenerating(true)
    const res = await fetch('/api/planning/generate', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
      body: JSON.stringify({ plan_id: plan.id, subject_ids: [...picked], sessions_per_day: perDay, duration_min: duration }),
    })
    const json = await res.json()
    if (json.error) alert(json.error.message ?? 'Erreur de génération')
    else await loadSessions()
    setGenerating(false)
  }

  async function toggle(session: Session) {
    setSessions((list) => list.map((s) => s.id === session.id ? { ...s, is_done: !s.is_done } : s))
    await fetch(`/api/planning/sessions/${session.id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
      body: JSON.stringify({ is_done: !session.is_done }),
    })
  }

  if (loading) return <div className="p-6 text-gray-500">Chargement du planning…</div>

  const today = new Date().toISOString().slice(0, 10)
  const todaySessions = sessions.filter((s) => s.scheduled_date === today)
  const laterSessions = sessions.filter((s) => s.scheduled_date > today)

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 space-y-6">
      <header className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
          <CalendarClock className="w-5 h-5 text-white" strokeWidth={2} />
        </div>
        <div>
          <h1 className="text-2xl font-black text-gray-900">Mon planning de révision</h1>
          <p className="text-sm text-gray-500">Organise-toi jusqu&apos;au jour J.</p>
        </div>
      </header>

      {/* Pas de plan : choisir l'examen cible */}
      {!plan ? (
        <section className="bg-white border rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-4 h-4 text-blue-600" />
            <h2 className="font-bold text-gray-900">Choisis ton examen</h2>
          </div>
          {exams.length === 0 ? (
            <p className="text-sm text-gray-400">Aucune date d&apos;examen disponible pour ton niveau. Reviens bientôt.</p>
          ) : (
            <ul className="space-y-2">
              {exams.map((e) => (
                <li key={e.id}>
                  <button
                    onClick={() => createPlan(e)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl border hover:border-blue-400 transition text-left"
                  >
                    <span className="font-semibold text-gray-900">{e.label}</span>
                    <span className="text-sm text-gray-500">
                      {new Date(e.exam_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : (
        <>
          {/* Compte à rebours */}
          <section className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-6 text-white text-center">
            <p className="text-sm text-blue-100">{plan.title}</p>
            <p className="text-5xl font-black my-2">{plan.days_remaining}</p>
            <p className="text-sm text-blue-100">
              jour{plan.days_remaining > 1 ? 's' : ''} avant l&apos;examen ·{' '}
              {new Date(plan.exam_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </section>

          <ReminderSettings />

          {/* Générateur */}
          <section className="bg-white border rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h2 className="font-bold text-gray-900">Générer mon emploi du temps</h2>
            </div>

            <p className="text-xs text-gray-500 mb-2">Matières à réviser</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {subjects.map((s) => {
                const on = picked.has(s.id)
                return (
                  <button
                    key={s.id}
                    onClick={() => setPicked((p) => { const n = new Set(p); n.has(s.id) ? n.delete(s.id) : n.add(s.id); return n })}
                    className={`px-3 py-1.5 rounded-full text-sm border transition ${on ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 text-gray-600 hover:border-gray-400'}`}
                  >
                    {s.name}
                  </button>
                )
              })}
            </div>

            <div className="flex flex-wrap gap-4 mb-4 text-sm">
              <label className="flex items-center gap-2">
                Séances/jour
                <select value={perDay} onChange={(e) => setPerDay(Number(e.target.value))} className="border rounded-lg px-2 py-1">
                  {[1, 2, 3, 4].map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
              </label>
              <label className="flex items-center gap-2">
                Durée
                <select value={duration} onChange={(e) => setDuration(Number(e.target.value))} className="border rounded-lg px-2 py-1">
                  {[20, 30, 45, 60].map((n) => <option key={n} value={n}>{n} min</option>)}
                </select>
              </label>
            </div>

            <button
              onClick={generate}
              disabled={picked.size === 0 || generating}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl"
            >
              {generating ? 'Génération…' : 'Générer mon planning'}
            </button>
            {sessions.length > 0 && (
              <p className="text-xs text-amber-600 mt-2 text-center">Régénérer remplacera les séances non terminées.</p>
            )}
          </section>

          {/* Révisions du jour */}
          <section>
            <h2 className="font-bold text-gray-900 mb-3">Aujourd&apos;hui</h2>
            {todaySessions.length === 0 ? (
              <p className="text-sm text-gray-400">Aucune révision prévue aujourd&apos;hui.</p>
            ) : (
              <ul className="space-y-2">
                {todaySessions.map((s) => (
                  <li key={s.id}>
                    <button onClick={() => toggle(s)} className="w-full flex items-center gap-3 bg-white border rounded-xl px-4 py-3 text-left hover:border-gray-300">
                      {s.is_done ? <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" /> : <Circle className="w-5 h-5 text-gray-300 flex-shrink-0" />}
                      <span className={`flex-1 ${s.is_done ? 'line-through text-gray-400' : 'text-gray-900'}`}>{s.title}</span>
                      <span className="text-xs text-gray-400">{s.duration_min} min</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* 7 prochains jours */}
          {laterSessions.length > 0 && (
            <section>
              <h2 className="font-bold text-gray-900 mb-3">Cette semaine</h2>
              <ul className="space-y-1.5">
                {laterSessions.map((s) => (
                  <li key={s.id} className="flex items-center gap-3 text-sm px-4 py-2 bg-white border rounded-lg">
                    <span className="text-gray-400 w-16 flex-shrink-0">
                      {new Date(s.scheduled_date + 'T00:00:00').toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' })}
                    </span>
                    <span className="flex-1 text-gray-700">{s.title}</span>
                    <span className="text-xs text-gray-400">{s.duration_min} min</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}
    </div>
  )
}
