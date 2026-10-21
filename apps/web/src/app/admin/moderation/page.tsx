'use client'

import { useEffect, useState, useCallback } from 'react'
import { adminFetch } from '@/lib/admin-fetch'

interface Flag {
  id: string; reason: string; created_at: string
  content: string | null; ai_blocked: boolean | null
  flagged_name: string | null; reporter_name: string | null
}

export default function AdminModerationPage() {
  const [rows, setRows] = useState<Flag[]>([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    const res = await adminFetch<Flag[]>('/api/admin/moderation')
    if (res.ok) setRows(res.data ?? [])
    else setError(res.error)
    setLoading(false)
  }, [])
  useEffect(() => { load() }, [load])

  async function resolve(id: string, action: 'reviewed' | 'dismissed', deleteMsg = false) {
    setBusy(id); setError(null)
    // `finally` : sans lui, une réponse inattendue laissait le bouton bloqué.
    try {
      const res = await adminFetch(`/api/admin/moderation/${id}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, delete_message: deleteMsg }),
      })
      if (res.ok) setRows((r) => r.filter((x) => x.id !== id))
      else setError(res.error)
    } finally {
      setBusy(null)
    }
  }

  return (
    <div className="px-8 py-8 max-w-4xl">
      <h1 className="text-2xl font-black text-gray-900 mb-1">Modération</h1>
      {error && <div className="p-3 bg-red-50 text-red-700 rounded-xl text-sm my-3">{error}</div>}
      <p className="text-gray-500 text-sm mb-6">Signalements ouverts (messages de groupe signalés ou bloqués automatiquement par l&apos;IA).</p>

      {loading ? (
        <div className="flex justify-center py-16"><div className="w-6 h-6 border-2 border-green-700 border-t-transparent rounded-full animate-spin" /></div>
      ) : rows.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400">Aucun signalement ouvert 🛡️</div>
      ) : (
        <div className="space-y-4">
          {rows.map((f) => (
            <div key={f.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700">{f.reason}</span>
                {f.ai_blocked && <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700">Bloqué IA</span>}
                <span className="text-xs text-gray-400 ml-auto">{new Date(f.created_at).toLocaleString('fr-FR')}</span>
              </div>
              {f.content && <p className="text-sm text-gray-800 bg-gray-50 rounded-xl p-3 whitespace-pre-wrap">“{f.content}”</p>}
              <p className="text-xs text-gray-500 mt-2">Auteur : {f.flagged_name ?? '—'} · Signalé par : {f.reporter_name ?? '—'}</p>
              <div className="flex gap-2 mt-4">
                <button onClick={() => resolve(f.id, 'reviewed', true)} disabled={busy === f.id} className="px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 disabled:opacity-50">Supprimer le message</button>
                <button onClick={() => resolve(f.id, 'dismissed')} disabled={busy === f.id} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-200 disabled:opacity-50">Ignorer</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
