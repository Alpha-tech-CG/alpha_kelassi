'use client'

import { useCallback, useEffect, useState } from 'react'
import { PLAN_META, normalizePlan } from '@alpha-kelassi/types'
import { adminFetch } from '@/lib/admin-fetch'

interface Ticket {
  id: string; kind: 'feedback' | 'support'; rating: number; comment: string | null; page: string | null
  plan: string | null; priority: number; status: 'open' | 'answered' | 'closed'; created_at: string
  users: { email: string | null; full_name: string | null } | null
}

const PRIORITY_LABEL = ['Standard', 'Prioritaire (Pro)', 'Prioritaire renforcé (Pro Max)']
const PRIORITY_STYLE = ['bg-gray-100 text-gray-700', 'bg-blue-100 text-blue-800', 'bg-violet-100 text-violet-800']

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [status, setStatus] = useState<'open' | 'answered' | 'closed' | 'all'>('open')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    const res = await adminFetch<Ticket[]>(`/api/admin/support?status=${status}`)
    if (res.ok) { setTickets(res.data ?? []); setError(null) } else setError(res.error)
    setLoading(false)
  }, [status])
  useEffect(() => { load() }, [load])

  async function update(id: string, next: Ticket['status']) {
    const res = await adminFetch('/api/admin/support', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status: next }),
    })
    if (!res.ok) { setError(res.error); return }
    await load()
  }

  return (
    <div className="px-4 md:px-8 py-6 md:py-8 max-w-5xl">
      <h1 className="text-2xl font-black text-gray-900">Support</h1>
      <p className="text-gray-500 text-sm mt-1 mb-5">Demandes et avis, traités par priorité : Pro Max, puis Pro, puis standard.</p>
      {error && <div role="alert" className="p-3 bg-red-50 text-red-700 rounded-xl text-sm mb-4">{error}</div>}

      <div className="flex gap-2 mb-4" role="group" aria-label="Statut">
        {(['open', 'answered', 'closed', 'all'] as const).map((s) => (
          <button key={s} type="button" aria-pressed={status === s} onClick={() => setStatus(s)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium ${status === s ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-600'}`}>
            {s === 'open' ? 'Ouvertes' : s === 'answered' ? 'Répondues' : s === 'closed' ? 'Closes' : 'Toutes'}
          </button>
        ))}
      </div>

      {loading ? <p className="text-gray-400">Chargement…</p> : tickets.length === 0 ? (
        <p className="text-gray-400 bg-white border rounded-2xl p-10 text-center">Aucune demande.</p>
      ) : (
        <ul className="space-y-3">
          {tickets.map((t) => (
            <li key={t.id} className="bg-white border border-gray-100 rounded-2xl p-4">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className={`px-2 py-0.5 rounded-full font-bold ${PRIORITY_STYLE[t.priority] ?? PRIORITY_STYLE[0]}`}>{PRIORITY_LABEL[t.priority] ?? PRIORITY_LABEL[0]}</span>
                <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 font-semibold">{t.kind === 'support' ? 'Demande de support' : `Avis ${t.rating}/5`}</span>
                <span className="text-gray-500">{t.users?.full_name ?? t.users?.email ?? 'Anonyme'} · {PLAN_META[normalizePlan(t.plan)].label} · {new Date(t.created_at).toLocaleString('fr-FR')}</span>
              </div>
              {t.comment && <p className="text-sm text-gray-800 mt-2 whitespace-pre-wrap">{t.comment}</p>}
              {t.page && <p className="text-xs text-gray-400 mt-1">Page : {t.page}</p>}
              <div className="flex gap-2 mt-3">
                {t.status !== 'answered' && <button type="button" onClick={() => update(t.id, 'answered')} className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-bold">Marquer répondue</button>}
                {t.status !== 'closed' && <button type="button" onClick={() => update(t.id, 'closed')} className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 text-xs font-bold">Clore</button>}
                {t.status !== 'open' && <button type="button" onClick={() => update(t.id, 'open')} className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-800 text-xs font-bold">Rouvrir</button>}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
