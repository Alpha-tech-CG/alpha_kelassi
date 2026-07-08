'use client'

import { useEffect, useState, useCallback } from 'react'

interface Sub {
  id: string; plan: string; status: string; provider: string
  expires_at: string | null; created_at: string; days_left: number | null
  email: string | null; full_name: string | null; phone: string | null
}
interface Summary {
  total: number; active: number; stripe: number; cinetpay: number
  expiring_7d: number; monthly_revenue_fcfa: number
}

const STATUS_STYLE: Record<string, string> = {
  active:   'bg-emerald-100 text-emerald-700',
  trialing: 'bg-blue-100 text-blue-700',
  past_due: 'bg-amber-100 text-amber-700',
  canceled: 'bg-gray-100 text-gray-500',
}

export default function AdminSubscriptionsPage() {
  const [subs, setSubs] = useState<Sub[]>([])
  const [summary, setSummary] = useState<Summary | null>(null)
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    const qs = status ? `?status=${status}` : ''
    const res = await fetch(`/api/admin/subscriptions${qs}`, { credentials: 'include' })
    const json = await res.json()
    setSubs(json.data ?? [])
    setSummary(json.summary ?? null)
    setLoading(false)
  }, [status])

  useEffect(() => { load() }, [load])

  const cards = summary ? [
    { label: 'Abonnés actifs', value: summary.active, icon: '⭐', color: 'from-amber-500 to-orange-500' },
    { label: 'Revenus / mois', value: `${summary.monthly_revenue_fcfa.toLocaleString('fr')} FCFA`, icon: '💰', color: 'from-emerald-500 to-teal-600' },
    { label: 'Mobile Money', value: summary.cinetpay, icon: '📱', color: 'from-violet-500 to-purple-600' },
    { label: 'Expirent < 7j', value: summary.expiring_7d, icon: '⏳', color: 'from-red-500 to-rose-600' },
  ] : []

  return (
    <div className="px-8 py-8 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">Abonnements</h1>
        <p className="text-gray-500 text-sm mt-1">Suivi des abonnements Premium (Stripe + Mobile Money)</p>
      </div>

      {/* KPIs */}
      {summary && (
        <div className="grid grid-cols-4 gap-5 mb-6">
          {cards.map((c) => (
            <div key={c.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className={`w-10 h-10 bg-gradient-to-br ${c.color} rounded-xl flex items-center justify-center text-xl mb-3`}>{c.icon}</div>
              <p className="text-2xl font-black text-gray-900 mb-0.5">{c.value}</p>
              <p className="text-xs text-gray-500 font-medium">{c.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Filtres */}
      <div className="flex gap-2 mb-4">
        {['', 'active', 'trialing', 'past_due', 'canceled'].map((s) => (
          <button
            key={s || 'all'}
            onClick={() => setStatus(s)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium ${status === s ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
          >
            {s === '' ? 'Tous' : s === 'active' ? 'Actifs' : s === 'trialing' ? 'Essai' : s === 'past_due' ? 'Impayés' : 'Annulés'}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : subs.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-12">Aucun abonnement.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-400 uppercase border-b border-gray-100">
                <th className="px-5 py-3 font-semibold">Utilisateur</th>
                <th className="px-5 py-3 font-semibold">Statut</th>
                <th className="px-5 py-3 font-semibold">Canal</th>
                <th className="px-5 py-3 font-semibold">Expire</th>
              </tr>
            </thead>
            <tbody>
              {subs.map((s) => (
                <tr key={s.id} className="border-b border-gray-50 last:border-0">
                  <td className="px-5 py-3">
                    <p className="font-medium text-gray-900">{s.full_name ?? '—'}</p>
                    <p className="text-xs text-gray-400">{s.email ?? s.phone ?? '—'}</p>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${STATUS_STYLE[s.status] ?? 'bg-gray-100 text-gray-500'}`}>{s.status}</span>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-gray-600">{s.provider === 'stripe' ? '💳 Stripe' : s.provider === 'cinetpay' ? '📱 Mobile Money' : '—'}</span>
                  </td>
                  <td className="px-5 py-3">
                    {s.expires_at ? (
                      <span className={s.days_left !== null && s.days_left <= 7 ? 'text-red-600 font-medium' : 'text-gray-600'}>
                        {new Date(s.expires_at).toLocaleDateString('fr-FR')}
                        {s.days_left !== null && s.days_left >= 0 && <span className="text-xs text-gray-400"> · {s.days_left}j</span>}
                      </span>
                    ) : <span className="text-gray-400">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
