'use client'

import { useEffect, useState, useCallback } from 'react'
import { PLAN_META, SUBSCRIPTION_PLANS, formatFcfa, normalizePlan } from '@alpha-kelassi/types'
import { adminFetch } from '@/lib/admin-fetch'

interface Sub {
  id: string; user_id: string; plan: string; status: string; billing_interval: 'month' | 'year' | null
  amount: number | null; provider: string; source: string; notes: string | null
  started_at: string | null; expires_at: string | null; created_at: string; days_left: number | null
  email: string | null; full_name: string | null; phone: string | null
}
interface Summary {
  total: number; active: number; monthly: number; yearly: number; expiring_7d: number
  pending_payments: number; failed_payments_30d: number; revenue_month_fcfa: number; revenue_12m_fcfa: number
}
interface ByPlan { plan: string; label: string; active_monthly: number; active_yearly: number; active_other: number; revenue_month_fcfa: number; revenue_12m_fcfa: number }
interface Tx { reference: string; product_key: string; plan: string; amount: number; status: string; change_kind: string | null; network: string | null; phone_last4: string | null; failure_reason: string | null; created_at: string; users: { email: string | null; full_name: string | null } | null }
interface WebhookEvent { reference: string | null; known: boolean; outcome: string; detail: string | null; received_at: string }
interface Payload { data: Sub[]; summary: Summary; by_plan: ByPlan[]; transactions: Tx[]; webhook_events: WebhookEvent[] }

const STATUS_LABEL: Record<string, string> = {
  active: 'Active', pending: 'Programmée', expired: 'Expirée', canceled: 'Annulée', suspended: 'Suspendue',
  past_due: 'Impayée', trialing: 'Essai', successful: 'Réussi', failed: 'Échoué', cancelled: 'Annulé',
}
const STATUS_STYLE: Record<string, string> = {
  active: 'bg-emerald-100 text-emerald-800', successful: 'bg-emerald-100 text-emerald-800',
  pending: 'bg-blue-100 text-blue-800', suspended: 'bg-red-100 text-red-800', failed: 'bg-red-100 text-red-800',
  expired: 'bg-gray-100 text-gray-600', canceled: 'bg-gray-100 text-gray-600', cancelled: 'bg-gray-100 text-gray-600',
}
const dateFr = (d: string | null) => (d ? new Date(d).toLocaleDateString('fr-FR') : '—')

export default function AdminSubscriptionsPage() {
  const [payload, setPayload] = useState<Payload | null>(null)
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('active')
  const [plan, setPlan] = useState('')
  const [interval, setBillingInterval] = useState('')
  const [tab, setTab] = useState<'subscriptions' | 'transactions' | 'webhooks'>('subscriptions')
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    const qs = new URLSearchParams()
    if (status) qs.set('status', status)
    if (plan) qs.set('plan', plan)
    if (interval) qs.set('interval', interval)
    const res = await adminFetch<Sub[]>(`/api/admin/subscriptions?${qs}`)
    if (res.ok) { setPayload(res.body as Payload); setError(null) }
    else setError(res.error)
    setLoading(false)
  }, [status, plan, interval])

  useEffect(() => { load() }, [load])

  const s = payload?.summary
  const cards = s ? [
    { label: 'Abonnements actifs', value: `${s.active}`, hint: `${s.monthly} mensuels · ${s.yearly} annuels` },
    { label: 'Revenus du mois', value: formatFcfa(s.revenue_month_fcfa), hint: `12 mois : ${formatFcfa(s.revenue_12m_fcfa)}` },
    { label: 'Expirent sous 7 jours', value: `${s.expiring_7d}`, hint: 'À relancer' },
    { label: 'Paiements', value: `${s.pending_payments} en attente`, hint: `${s.failed_payments_30d} échec(s) sur 30 jours` },
  ] : []

  return (
    <div className="px-4 md:px-8 py-6 md:py-8 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">Abonnements</h1>
        <p className="text-gray-500 text-sm mt-1">Formules Cognix, paiements FeexPay et revenus par formule.</p>
      </div>
      {error && <div role="alert" className="p-3 bg-red-50 text-red-700 rounded-xl text-sm mb-4">{error}</div>}

      {s && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {cards.map((c) => (
            <div key={c.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <p className="text-xs text-gray-500 font-semibold uppercase">{c.label}</p>
              <p className="text-2xl font-black text-gray-900 mt-1">{c.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{c.hint}</p>
            </div>
          ))}
        </div>
      )}

      {payload && (
        <section aria-labelledby="par-formule" className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
          <h2 id="par-formule" className="font-bold text-gray-900 mb-3">Par formule</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-left text-xs text-gray-500 uppercase border-b">
                <th scope="col" className="py-2 pr-4">Formule</th><th scope="col" className="py-2 pr-4">Mensuels</th><th scope="col" className="py-2 pr-4">Annuels</th><th scope="col" className="py-2 pr-4">Autres (manuels)</th><th scope="col" className="py-2 pr-4">Revenus du mois</th><th scope="col" className="py-2">Revenus 12 mois</th>
              </tr></thead>
              <tbody>
                {payload.by_plan.map((p) => (
                  <tr key={p.plan} className="border-b last:border-0">
                    <td className="py-2 pr-4 font-semibold">{p.label}</td>
                    <td className="py-2 pr-4">{p.active_monthly}</td>
                    <td className="py-2 pr-4">{p.active_yearly}</td>
                    <td className="py-2 pr-4">{p.active_other}</td>
                    <td className="py-2 pr-4 whitespace-nowrap">{formatFcfa(p.revenue_month_fcfa)}</td>
                    <td className="py-2 whitespace-nowrap">{formatFcfa(p.revenue_12m_fcfa)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500 mt-2">Revenus calculés sur les paiements FeexPay confirmés (hors formules accordées manuellement).</p>
        </section>
      )}

      <div className="flex flex-wrap gap-2 mb-4" role="tablist" aria-label="Vue">
        {([['subscriptions', 'Abonnements'], ['transactions', 'Transactions'], ['webhooks', 'Notifications FeexPay']] as const).map(([k, label]) => (
          <button key={k} type="button" role="tab" aria-selected={tab === k} onClick={() => setTab(k)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold ${tab === k ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            {label}
          </button>
        ))}
      </div>

      {tab === 'subscriptions' && (
        <>
          <div className="flex flex-wrap gap-2 mb-4">
            <select aria-label="Statut" value={status} onChange={(e) => setStatus(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white">
              <option value="">Tous les statuts</option>
              {['active', 'pending', 'suspended', 'expired', 'canceled'].map((st) => <option key={st} value={st}>{STATUS_LABEL[st]}</option>)}
            </select>
            <select aria-label="Formule" value={plan} onChange={(e) => setPlan(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white">
              <option value="">Toutes les formules</option>
              {SUBSCRIPTION_PLANS.filter((p) => p !== 'free').map((p) => <option key={p} value={p}>{PLAN_META[p].label}</option>)}
            </select>
            <select aria-label="Périodicité" value={interval} onChange={(e) => setBillingInterval(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white">
              <option value="">Mensuels et annuels</option>
              <option value="month">Mensuels</option>
              <option value="year">Annuels</option>
            </select>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
            {loading ? <p className="text-gray-400 text-sm text-center py-12">Chargement…</p> : !payload?.data.length ? (
              <p className="text-gray-400 text-sm text-center py-12">Aucun abonnement.</p>
            ) : (
              <table className="w-full text-sm">
                <thead><tr className="text-left text-xs text-gray-500 uppercase border-b border-gray-100">
                  <th scope="col" className="px-5 py-3">Utilisateur</th><th scope="col" className="px-5 py-3">Formule</th><th scope="col" className="px-5 py-3">Statut</th><th scope="col" className="px-5 py-3">Période</th><th scope="col" className="px-5 py-3">Montant</th><th scope="col" className="px-5 py-3">Origine</th>
                </tr></thead>
                <tbody>
                  {payload.data.map((row) => (
                    <tr key={row.id} className="border-b border-gray-50 last:border-0 align-top">
                      <td className="px-5 py-3"><p className="font-medium text-gray-900">{row.full_name ?? '—'}</p><p className="text-xs text-gray-500">{row.email ?? row.phone ?? '—'}</p></td>
                      <td className="px-5 py-3">{PLAN_META[normalizePlan(row.plan)].label}{row.billing_interval && <span className="text-xs text-gray-500"> · {row.billing_interval === 'month' ? 'mensuel' : 'annuel'}</span>}</td>
                      <td className="px-5 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-bold ${STATUS_STYLE[row.status] ?? 'bg-gray-100 text-gray-600'}`}>{STATUS_LABEL[row.status] ?? row.status}</span></td>
                      <td className="px-5 py-3 whitespace-nowrap">
                        {dateFr(row.started_at ?? row.created_at)} → {row.expires_at ? dateFr(row.expires_at) : 'sans échéance'}
                        {row.days_left !== null && row.days_left >= 0 && <span className={`block text-xs ${row.days_left <= 7 ? 'text-red-700 font-semibold' : 'text-gray-500'}`}>{row.days_left} jour(s) restant(s)</span>}
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap">{row.amount ? formatFcfa(row.amount) : '—'}</td>
                      <td className="px-5 py-3 text-xs text-gray-600">{row.source === 'payment' ? `Paiement ${row.provider}` : row.source === 'admin' ? 'Manuel (admin)' : 'Ancien Premium'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}

      {tab === 'transactions' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
          {!payload?.transactions.length ? <p className="text-gray-400 text-sm text-center py-12">Aucune transaction.</p> : (
            <table className="w-full text-sm">
              <thead><tr className="text-left text-xs text-gray-500 uppercase border-b">
                <th scope="col" className="px-5 py-3">Date</th><th scope="col" className="px-5 py-3">Utilisateur</th><th scope="col" className="px-5 py-3">Produit</th><th scope="col" className="px-5 py-3">Montant</th><th scope="col" className="px-5 py-3">Statut</th><th scope="col" className="px-5 py-3">Référence</th>
              </tr></thead>
              <tbody>
                {payload.transactions.map((t) => (
                  <tr key={t.reference} className="border-b last:border-0 align-top">
                    <td className="px-5 py-3 whitespace-nowrap">{new Date(t.created_at).toLocaleString('fr-FR')}</td>
                    <td className="px-5 py-3">{t.users?.full_name ?? t.users?.email ?? '—'}<span className="block text-xs text-gray-500">{t.network ?? ''}{t.phone_last4 ? ` ···${t.phone_last4}` : ''}</span></td>
                    <td className="px-5 py-3">{t.product_key}{t.change_kind && <span className="block text-xs text-gray-500">{t.change_kind}</span>}</td>
                    <td className="px-5 py-3 whitespace-nowrap">{formatFcfa(t.amount)}</td>
                    <td className="px-5 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-bold ${STATUS_STYLE[t.status] ?? 'bg-gray-100 text-gray-600'}`}>{STATUS_LABEL[t.status] ?? t.status}</span>{t.failure_reason && <span className="block text-xs text-gray-500">{t.failure_reason}</span>}</td>
                    <td className="px-5 py-3 text-xs text-gray-500">{t.reference}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {tab === 'webhooks' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
          {!payload?.webhook_events.length ? <p className="text-gray-400 text-sm text-center py-12">Aucune notification reçue.</p> : (
            <table className="w-full text-sm">
              <thead><tr className="text-left text-xs text-gray-500 uppercase border-b">
                <th scope="col" className="px-5 py-3">Reçue le</th><th scope="col" className="px-5 py-3">Référence</th><th scope="col" className="px-5 py-3">Connue</th><th scope="col" className="px-5 py-3">Issue</th><th scope="col" className="px-5 py-3">Détail</th>
              </tr></thead>
              <tbody>
                {payload.webhook_events.map((e, i) => (
                  <tr key={`${e.reference}-${i}`} className="border-b last:border-0">
                    <td className="px-5 py-3 whitespace-nowrap">{new Date(e.received_at).toLocaleString('fr-FR')}</td>
                    <td className="px-5 py-3 text-xs">{e.reference ?? '—'}</td>
                    <td className="px-5 py-3">{e.known ? 'Oui' : <span className="font-semibold text-red-700">Non</span>}</td>
                    <td className="px-5 py-3">{e.outcome}</td>
                    <td className="px-5 py-3 text-xs text-gray-500">{e.detail ?? ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  )
}
