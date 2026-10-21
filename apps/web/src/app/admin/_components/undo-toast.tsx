'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { adminFetch } from '@/lib/admin-fetch'

/**
 * Bandeau « Annuler » affiché après une suppression.
 *
 * Une suppression dans la console part en corbeille (migration 058) : on peut
 * toujours restaurer depuis /admin/corbeille, mais le geste le plus naturel
 * après un clic malheureux est un « Annuler » immédiat, à portée de main.
 */
interface Pending { message: string; undo: () => Promise<string | null> }

const DURATION_MS = 10_000

export function useUndoToast() {
  const [pending, setPending] = useState<Pending | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clear = useCallback(() => {
    if (timer.current) clearTimeout(timer.current)
    timer.current = null
    setPending(null); setError(null)
  }, [])

  /** `undo` renvoie `null` si l'annulation a réussi, sinon le message d'erreur. */
  const show = useCallback((message: string, undo: () => Promise<string | null>) => {
    if (timer.current) clearTimeout(timer.current)
    setError(null)
    setPending({ message, undo })
    timer.current = setTimeout(() => setPending(null), DURATION_MS)
  }, [])

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current) }, [])

  async function runUndo() {
    if (!pending || busy) return
    setBusy(true)
    try {
      const err = await pending.undo()
      if (err) setError(err)
      else clear()
    } finally {
      setBusy(false)
    }
  }

  const node = pending ? (
    <div role="status" className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[60] w-[calc(100%-2rem)] max-w-lg bg-gray-900 text-white rounded-2xl shadow-xl px-4 py-3 flex items-center gap-3">
      <span className="text-sm flex-1 min-w-0">
        {error ? <span className="text-red-300">{error}</span> : pending.message}
      </span>
      <button onClick={runUndo} disabled={busy}
        className="text-sm font-bold text-green-300 hover:text-green-200 disabled:opacity-50 flex-shrink-0">
        {busy ? '…' : 'Annuler'}
      </button>
      <button onClick={clear} aria-label="Fermer" className="text-gray-400 hover:text-white flex-shrink-0">✕</button>
    </div>
  ) : null

  return { show, node }
}

/** Restaure un élément de la corbeille ; renvoie `null` si tout va bien. */
export async function restoreFromTrash(kind: 'quiz' | 'exercise', id: string): Promise<string | null> {
  const res = await adminFetch('/api/admin/corbeille', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ kind, id, action: 'restore' }),
  })
  return res.ok ? null : (res.error ?? 'Restauration impossible. Réessaie depuis la corbeille.')
}
