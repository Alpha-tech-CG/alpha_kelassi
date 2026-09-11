'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  AI_DAILY_LIMITS, PLAN_META, SUBSCRIPTION_PLANS, TUTOR_CORRECTION_MONTHLY_LIMITS, formatFcfa, normalizePlan,
  type SubscriptionPlan,
} from '@alpha-kelassi/types'
import { adminFetch } from '@/lib/admin-fetch'

interface AdminUser {
  id: string; full_name: string | null; email: string | null; phone: string | null; role: string; created_at: string
  plan: SubscriptionPlan; effective_plan: SubscriptionPlan; billing_interval: 'month' | 'year' | null
  expires_at: string | null; source: string | null; suspended: boolean; scheduled: number; plan_review: string | null
  usage: { ai_today: number; ai_bonus: number; corrections_month: number; corrections_bonus: number }
}

interface Detail {
  subscriptions: { id: string; plan: string; status: string; billing_interval: string | null; amount: number | null; started_at: string | null; expires_at: string | null; source: string; notes: string | null; created_at: string }[]
  transactions: { reference: string; product_key: string; amount: number; status: string; failure_reason: string | null; created_at: string }[]
  audit: { id: string; action: string; reason: string; created_at: string; admin: { email: string | null; full_name: string | null } | null; new_value: { detail?: Record<string, unknown> } | null }[]
}

type Filter = 'all' | SubscriptionPlan | 'review'

const ACTION_LABEL: Record<string, string> = {
  set_plan: 'Formule modifiée', extend: 'Prolongation', suspend: 'Suspension', reactivate: 'Réactivation',
  cancel: 'Annulation', grant_quota: 'Quota exceptionnel', resolve_review: 'Vérification close',
}

const dateFr = (d: string | null) => (d ? new Date(d).toLocaleDateString('fr-FR') : '—')

export function AdminUsersClient() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const [selected, setSelected] = useState<AdminUser | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await adminFetch<AdminUser[]>('/api/admin/users')
      if (!res.ok) { setError(res.error); return }
      setUsers(res.data ?? [])
      setError(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const filtered = users.filter((u) => {
    const matchPlan = filter === 'all' || (filter === 'review' ? !!u.plan_review : u.plan === filter)
    const q = search.toLowerCase()
    const matchSearch = !search || [u.full_name, u.email, u.phone].some((v) => (v ?? '').toLowerCase().includes(q))
    return matchPlan && matchSearch
  })

  const count = (p: SubscriptionPlan) => users.filter((u) => u.plan === p).length

  return (
    <div className="px-4 md:px-8 py-6 md:py-8 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">Utilisateurs</h1>
        <p className="text-gray-500 text-sm mt-1">{users.length} compte(s) — formule effective, échéance et usage du jour.</p>
      </div>
      {error && <div role="alert" className="p-3 bg-red-50 text-red-700 rounded-xl text-sm mb-4">{error}</div>}

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        {SUBSCRIPTION_PLANS.map((p) => (
          <div key={p} className="bg-white border border-gray-100 rounded-2xl px-4 py-3">
            <p className="text-2xl font-black text-gray-900">{count(p)}</p>
            <p className="text-sm text-gray-600">{PLAN_META[p].label}</p>
          </div>
        ))}
        <div className="bg-amber-50 border border-amber-100 rounded-2xl px-4 py-3">
          <p className="text-2xl font-black text-amber-900">{users.filter((u) => u.plan_review).length}</p>
          <p className="text-sm text-amber-800">À vérifier</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-3 mb-5">
        <label className="flex-1">
          <span className="sr-only">Rechercher</span>
          <input
            type="search" placeholder="Rechercher par nom, email, téléphone…"
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
          />
        </label>
        <div className="flex flex-wrap bg-gray-100 rounded-xl p-1 gap-1" role="group" aria-label="Filtrer par formule">
          {(['all', ...SUBSCRIPTION_PLANS, 'review'] as Filter[]).map((p) => (
            <button
              key={p}
              type="button"
              aria-pressed={filter === p}
              onClick={() => setFilter(p)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium ${filter === p ? 'bg-white shadow text-gray-900' : 'text-gray-600'}`}
            >
              {p === 'all' ? 'Tous' : p === 'review' ? 'À vérifier' : PLAN_META[p].label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {['Utilisateur', 'Formule', 'Échéance', 'IA aujourd’hui', 'Corrections du mois', 'Rôle', ''].map((h) => (
                <th key={h} scope="col" className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading && <tr><td colSpan={7} className="px-4 py-10 text-center text-gray-400">Chargement…</td></tr>}
            {!loading && filtered.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-900 truncate max-w-[200px]">{u.full_name ?? <span className="text-gray-400 italic">Sans nom</span>}</p>
                  <p className="text-xs text-gray-500">{u.email ?? u.phone ?? '—'}</p>
                </td>
                <td className="px-4 py-3">
                  <p className="font-semibold text-gray-900">{PLAN_META[u.plan].label}{u.billing_interval && <span className="text-xs text-gray-500"> · {u.billing_interval === 'month' ? 'mensuel' : 'annuel'}</span>}</p>
                  {u.role === 'admin' && <p className="text-xs text-gray-500">Accès Pro Max (admin)</p>}
                  {u.suspended && <p className="text-xs font-semibold text-red-700">Suspendu</p>}
                  {u.plan_review && <p className="text-xs font-semibold text-amber-800">À vérifier</p>}
                  {u.source === 'admin' && <p className="text-xs text-gray-500">Accordé manuellement</p>}
                </td>
                <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{u.plan === 'free' ? '—' : u.expires_at ? dateFr(u.expires_at) : 'Sans échéance'}{u.scheduled > 0 && <p className="text-xs">+{u.scheduled} programmé(s)</p>}</td>
                <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{u.usage.ai_today} / {AI_DAILY_LIMITS[u.effective_plan] + u.usage.ai_bonus}</td>
                <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{u.usage.corrections_month} / {TUTOR_CORRECTION_MONTHLY_LIMITS[u.effective_plan] + u.usage.corrections_bonus}</td>
                <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-bold ${u.role === 'admin' ? 'bg-red-100 text-red-700' : 'bg-green-50 text-green-700'}`}>{u.role === 'admin' ? 'Admin' : 'Élève'}</span></td>
                <td className="px-4 py-3">
                  <button type="button" onClick={() => setSelected(u)} className="px-3 py-1.5 bg-gray-900 text-white rounded-lg text-xs font-bold hover:bg-gray-700 whitespace-nowrap">
                    Gérer
                  </button>
                </td>
              </tr>
            ))}
            {!loading && filtered.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-12 text-center text-gray-400">Aucun utilisateur trouvé</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {selected && <ManageDialog user={selected} onClose={() => setSelected(null)} onChanged={load} />}
    </div>
  )
}

function ManageDialog({ user, onClose, onChanged }: { user: AdminUser; onClose: () => void; onChanged: () => Promise<void> }) {
  const [detail, setDetail] = useState<Detail | null>(null)
  const [action, setAction] = useState<'set_plan' | 'extend' | 'suspend' | 'reactivate' | 'grant_quota' | 'resolve_review' | 'role'>('set_plan')
  const [plan, setPlan] = useState<SubscriptionPlan>(user.plan)
  const [interval, setDurationInterval] = useState<'' | 'month' | 'year'>('month')
  const [days, setDays] = useState(30)
  const [usageType, setUsageType] = useState<'ai_questions' | 'tutor_corrections'>('ai_questions')
  const [amount, setAmount] = useState(10)
  const [reason, setReason] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null)

  const loadDetail = useCallback(async () => {
    const res = await adminFetch<Detail>(`/api/admin/users/${user.id}/subscription`)
    if (res.ok) setDetail(res.data)
  }, [user.id])
  useEffect(() => { loadDetail() }, [loadDetail])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true); setMessage(null)
    try {
      const res = action === 'role'
        ? await adminFetch(`/api/admin/users/${user.id}/role`, {
            method: 'PATCH', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ role: user.role === 'admin' ? 'student' : 'admin' }),
          })
        : await adminFetch(`/api/admin/users/${user.id}/subscription`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(
              action === 'set_plan' ? { action, reason, plan, interval: interval || null, duration_days: interval ? null : days }
              : action === 'extend' ? { action, reason, days }
              : action === 'grant_quota' ? { action, reason, usage_type: usageType, amount }
              : { action, reason },
            ),
          })
      if (!res.ok) { setMessage({ ok: false, text: res.error ?? 'Échec de la modification.' }); return }
      setMessage({ ok: true, text: 'Modification enregistrée et journalisée.' })
      setReason('')
      await Promise.all([loadDetail(), onChanged()])
    } finally {
      setSaving(false)
    }
  }

  const needsReason = action !== 'role'

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-black/40 p-4 overflow-y-auto" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-labelledby="manage-title" className="bg-white rounded-2xl shadow-xl w-full max-w-3xl p-5 sm:p-6 my-8" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="manage-title" className="text-lg font-black text-gray-900">{user.full_name ?? user.email ?? 'Utilisateur'}</h2>
            <p className="text-sm text-gray-600">{PLAN_META[user.plan].label}{user.expires_at ? ` jusqu’au ${dateFr(user.expires_at)}` : ''}</p>
            {user.plan_review && <p className="text-sm text-amber-800 mt-1">{user.plan_review}</p>}
          </div>
          <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-900 text-sm font-semibold">Fermer</button>
        </div>

        <form onSubmit={submit} className="mt-5 grid gap-3 sm:grid-cols-2 rounded-xl bg-gray-50 p-4">
          <label className="sm:col-span-2 text-sm font-semibold text-gray-700">
            Action
            <select value={action} onChange={(e) => setAction(e.target.value as typeof action)} className="mt-1 w-full border rounded-lg px-3 py-2 bg-white">
              <option value="set_plan">Changer la formule</option>
              <option value="extend">Prolonger l’abonnement en cours</option>
              <option value="suspend">Suspendre l’abonnement</option>
              <option value="reactivate">Réactiver l’abonnement suspendu</option>
              <option value="grant_quota">Accorder un quota exceptionnel</option>
              {user.plan_review && <option value="resolve_review">Marquer la vérification comme faite</option>}
              <option value="role">{user.role === 'admin' ? 'Retirer le rôle administrateur' : 'Donner le rôle administrateur'}</option>
            </select>
          </label>

          {action === 'set_plan' && (
            <>
              <label className="text-sm font-semibold text-gray-700">Formule
                <select value={plan} onChange={(e) => setPlan(normalizePlan(e.target.value))} className="mt-1 w-full border rounded-lg px-3 py-2 bg-white">
                  {SUBSCRIPTION_PLANS.map((p) => <option key={p} value={p}>{PLAN_META[p].label}</option>)}
                </select>
              </label>
              {plan !== 'free' && (
                <label className="text-sm font-semibold text-gray-700">Durée
                  <select value={interval} onChange={(e) => setDurationInterval(e.target.value as typeof interval)} className="mt-1 w-full border rounded-lg px-3 py-2 bg-white">
                    <option value="month">Un mois</option>
                    <option value="year">Un an</option>
                    <option value="">Nombre de jours…</option>
                  </select>
                </label>
              )}
              {plan !== 'free' && !interval && (
                <label className="text-sm font-semibold text-gray-700">Jours
                  <input type="number" min={1} max={3660} value={days} onChange={(e) => setDays(Number(e.target.value))} className="mt-1 w-full border rounded-lg px-3 py-2" />
                </label>
              )}
            </>
          )}
          {action === 'extend' && (
            <label className="text-sm font-semibold text-gray-700">Jours ajoutés
              <input type="number" min={1} max={3660} value={days} onChange={(e) => setDays(Number(e.target.value))} className="mt-1 w-full border rounded-lg px-3 py-2" />
            </label>
          )}
          {action === 'grant_quota' && (
            <>
              <label className="text-sm font-semibold text-gray-700">Quota
                <select value={usageType} onChange={(e) => setUsageType(e.target.value as typeof usageType)} className="mt-1 w-full border rounded-lg px-3 py-2 bg-white">
                  <option value="ai_questions">Questions Cognix IA (aujourd’hui)</option>
                  <option value="tutor_corrections">Corrections par tuteur (ce mois-ci)</option>
                </select>
              </label>
              <label className="text-sm font-semibold text-gray-700">Unités accordées
                <input type="number" min={1} max={1000} value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="mt-1 w-full border rounded-lg px-3 py-2" />
              </label>
            </>
          )}

          {needsReason && (
            <label className="sm:col-span-2 text-sm font-semibold text-gray-700">Raison (obligatoire, journalisée)
              <textarea required minLength={5} value={reason} onChange={(e) => setReason(e.target.value)} rows={2} className="mt-1 w-full border rounded-lg px-3 py-2" placeholder="Ex. : geste commercial après une panne de paiement" />
            </label>
          )}

          <div className="sm:col-span-2 flex flex-col sm:flex-row sm:items-center gap-3">
            <button type="submit" disabled={saving || (needsReason && reason.trim().length < 5)} className="px-5 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-gray-700 disabled:opacity-50">
              {saving ? 'Enregistrement…' : 'Appliquer'}
            </button>
            {message && <p role="status" className={`text-sm ${message.ok ? 'text-emerald-700' : 'text-red-700'}`}>{message.text}</p>}
          </div>
        </form>

        {detail && (
          <div className="mt-6 grid gap-6">
            <section>
              <h3 className="font-bold text-gray-900 mb-2">Historique des abonnements</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead><tr className="text-left text-gray-500 border-b"><th className="py-1.5 pr-3">Formule</th><th className="py-1.5 pr-3">Statut</th><th className="py-1.5 pr-3">Période</th><th className="py-1.5 pr-3">Montant</th><th className="py-1.5">Origine</th></tr></thead>
                  <tbody>
                    {detail.subscriptions.map((s) => (
                      <tr key={s.id} className="border-b last:border-0 align-top">
                        <td className="py-1.5 pr-3">{PLAN_META[normalizePlan(s.plan)].label}{s.billing_interval ? ` · ${s.billing_interval === 'month' ? 'mensuel' : 'annuel'}` : ''}</td>
                        <td className="py-1.5 pr-3">{s.status}</td>
                        <td className="py-1.5 pr-3 whitespace-nowrap">{dateFr(s.started_at ?? s.created_at)} → {s.expires_at ? dateFr(s.expires_at) : 'sans échéance'}</td>
                        <td className="py-1.5 pr-3 whitespace-nowrap">{s.amount ? formatFcfa(s.amount) : '—'}</td>
                        <td className="py-1.5">{s.source}{s.notes ? ` — ${s.notes}` : ''}</td>
                      </tr>
                    ))}
                    {detail.subscriptions.length === 0 && <tr><td colSpan={5} className="py-3 text-gray-400">Aucun abonnement.</td></tr>}
                  </tbody>
                </table>
              </div>
            </section>
            <section>
              <h3 className="font-bold text-gray-900 mb-2">Transactions</h3>
              {detail.transactions.length === 0 ? <p className="text-xs text-gray-400">Aucune transaction.</p> : (
                <ul className="text-xs space-y-1">
                  {detail.transactions.map((t) => (
                    <li key={t.reference}>{dateFr(t.created_at)} · {t.product_key} · {formatFcfa(t.amount)} · <strong>{t.status}</strong>{t.failure_reason ? ` (${t.failure_reason})` : ''} · <span className="text-gray-400">{t.reference}</span></li>
                  ))}
                </ul>
              )}
            </section>
            <section>
              <h3 className="font-bold text-gray-900 mb-2">Journal des modifications</h3>
              {detail.audit.length === 0 ? <p className="text-xs text-gray-400">Aucune modification manuelle.</p> : (
                <ul className="text-xs space-y-1.5">
                  {detail.audit.map((a) => (
                    <li key={a.id}>
                      {new Date(a.created_at).toLocaleString('fr-FR')} · <strong>{ACTION_LABEL[a.action] ?? a.action}</strong> par {a.admin?.full_name ?? a.admin?.email ?? 'admin'} — « {a.reason} »
                      {a.new_value?.detail && Object.keys(a.new_value.detail).length > 0 && <span className="text-gray-500"> ({JSON.stringify(a.new_value.detail)})</span>}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  )
}
