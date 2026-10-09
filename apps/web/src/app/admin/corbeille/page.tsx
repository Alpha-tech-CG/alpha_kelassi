'use client'

import { useCallback, useEffect, useState } from 'react'
import { LEVEL_META, type StudyLevel } from '@alpha-kelassi/types'
import { adminFetch } from '@/lib/admin-fetch'
import { EXAM_KIND_META, isExamKind } from '@/lib/prepa'

/**
 * Corbeille : épreuves, QCM et exercices supprimés depuis la console. Ils sont
 * invisibles pour les élèves mais intacts (questions, corrigés, historique) :
 * « Restaurer » les remet en ligne tels quels.
 */

interface Item {
  kind: 'quiz' | 'exercise'; id: string; title: string; deleted_at: string
  type_label: string; exam_kind: string | null; year: number | null; level: string | null
  subject: string | null; detail: string
}

export default function AdminTrashPage() {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [busy, setBusy] = useState<string | null>(null)

  const load = useCallback(async () => {
    const res = await adminFetch<Item[]>('/api/admin/corbeille')
    if (res.ok) setItems(res.data ?? [])
    else setError(res.error)
    setLoading(false)
  }, [])
  useEffect(() => { load() }, [load])

  async function act(item: Item, action: 'restore' | 'purge') {
    if (action === 'purge' && !confirm(`Supprimer DÉFINITIVEMENT « ${item.title} » ?\n\nQuestions, corrigé et résultats des élèves seront effacés. Cette action est irréversible.`)) return
    setBusy(item.id); setError(null); setNotice(null)
    try {
      const res = await adminFetch('/api/admin/corbeille', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kind: item.kind, id: item.id, action }),
      })
      if (!res.ok) { setError(res.error); return }
      setNotice(action === 'restore' ? `« ${item.title} » est de nouveau en ligne.` : `« ${item.title} » a été supprimé définitivement.`)
      setItems((xs) => xs.filter((x) => x.id !== item.id))
    } finally {
      setBusy(null)
    }
  }

  return (
    <div className="px-4 sm:px-8 py-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">Corbeille</h1>
        <p className="text-gray-500 text-sm mt-1">
          Épreuves, QCM et exercices supprimés. Ils ne sont plus visibles par les élèves mais restent intacts : tu peux les restaurer à tout moment.
        </p>
      </div>

      {error && <div className="p-3 bg-red-50 text-red-700 rounded-xl text-sm mb-4">{error}</div>}
      {notice && <div className="p-3 bg-green-50 text-green-800 rounded-xl text-sm mb-4">{notice}</div>}

      {loading ? (
        <div className="flex items-center justify-center py-16"><div className="w-6 h-6 border-2 border-green-700 border-t-transparent rounded-full animate-spin" /></div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400">La corbeille est vide.</div>
      ) : (
        <div className="space-y-2">
          {items.map((it) => (
            <div key={it.id} className="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-3 flex items-center justify-between gap-3 flex-wrap">
              <div className="min-w-0">
                <p className="font-semibold text-gray-900">{it.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {isExamKind(it.exam_kind) ? `${EXAM_KIND_META[it.exam_kind].label}` : it.type_label}
                  {it.subject ? ` · ${it.subject}` : ''}
                  {it.level ? ` · ${LEVEL_META[it.level as StudyLevel]?.label ?? it.level}` : ''}
                  {it.detail ? ` · ${it.detail}` : ''}
                  {' · supprimé le '}{new Date(it.deleted_at).toLocaleString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => act(it, 'restore')} disabled={busy === it.id}
                  className="px-3 py-1.5 bg-green-50 text-green-700 rounded-xl text-xs font-bold hover:bg-green-100 disabled:opacity-50">↩︎ Restaurer</button>
                <button onClick={() => act(it, 'purge')} disabled={busy === it.id}
                  className="px-3 py-1.5 text-red-600 rounded-xl text-xs font-bold hover:bg-red-50 disabled:opacity-50">Supprimer définitivement</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
