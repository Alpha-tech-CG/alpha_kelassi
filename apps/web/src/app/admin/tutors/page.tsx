'use client'

import { useEffect, useState, useCallback } from 'react'

interface Pending {
  user_id: string; bio: string | null; created_at: string
  users: { full_name: string | null; email: string | null; phone: string | null } | null
  id_doc_signed: string | null; bac_doc_signed: string | null
}

export default function AdminTutorsPage() {
  const [rows, setRows] = useState<Pending[]>([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState<string | null>(null)

  const load = useCallback(async () => {
    const res = await fetch('/api/admin/tutors/pending', { credentials: 'include' })
    const json = await res.json()
    setRows(json.data ?? []); setLoading(false)
  }, [])
  useEffect(() => { load() }, [load])

  async function verify(id: string) {
    setBusy(id)
    const res = await fetch(`/api/admin/tutors/${id}/verify`, { method: 'POST', credentials: 'include' })
    setBusy(null)
    if (res.ok) setRows((r) => r.filter((x) => x.user_id !== id)); else alert('Erreur')
  }
  async function reject(id: string) {
    const reason = prompt('Motif du rejet ?')
    if (!reason) return
    setBusy(id)
    const res = await fetch(`/api/admin/tutors/${id}/reject`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
      body: JSON.stringify({ reason }),
    })
    setBusy(null)
    if (res.ok) setRows((r) => r.filter((x) => x.user_id !== id)); else alert('Erreur')
  }

  return (
    <div className="px-8 py-8 max-w-4xl">
      <h1 className="text-2xl font-black text-gray-900 mb-1">Validation des tuteurs</h1>
      <p className="text-gray-500 text-sm mb-6">Vérifie la pièce d&apos;identité et le diplôme BAC avant de valider (délai cible : 24h).</p>

      {loading ? (
        <div className="flex justify-center py-16"><div className="w-6 h-6 border-2 border-green-700 border-t-transparent rounded-full animate-spin" /></div>
      ) : rows.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400">Aucun tuteur en attente 🎉</div>
      ) : (
        <div className="space-y-4">
          {rows.map((t) => (
            <div key={t.user_id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-bold text-gray-900">{t.users?.full_name ?? 'Sans nom'}</p>
                  <p className="text-sm text-gray-500">{t.users?.email ?? '—'}{t.users?.phone ? ` · ${t.users.phone}` : ''}</p>
                  {t.bio && <p className="text-sm text-gray-600 mt-2 italic">“{t.bio}”</p>}
                  <div className="flex gap-3 mt-3">
                    {t.id_doc_signed && <a href={t.id_doc_signed} target="_blank" rel="noreferrer" className="text-sm text-green-700 font-semibold underline">📄 CNI</a>}
                    {t.bac_doc_signed && <a href={t.bac_doc_signed} target="_blank" rel="noreferrer" className="text-sm text-green-700 font-semibold underline">🎓 Diplôme BAC</a>}
                  </div>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <button onClick={() => verify(t.user_id)} disabled={busy === t.user_id} className="px-4 py-2 bg-green-700 text-white rounded-xl text-sm font-bold hover:bg-green-800 disabled:opacity-50">Valider</button>
                  <button onClick={() => reject(t.user_id)} disabled={busy === t.user_id} className="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-bold hover:bg-red-100 disabled:opacity-50">Rejeter</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
