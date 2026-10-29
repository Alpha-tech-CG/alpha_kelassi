'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { adminFetch } from '@/lib/admin-fetch'

/** Ouvre ou ferme une classe aux élèves (la console, elle, la voit toujours). */
export function PublishToggle({ level, label, published, disabled }: {
  level: string
  label: string
  published: boolean
  disabled?: boolean
}) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)

  async function toggle() {
    const next = !published
    const question = next
      ? `Ouvrir ${label} aux élèves ?\n\nLes élèves pourront choisir cette classe à l'inscription et verront ses matières et chapitres.`
      : `Fermer ${label} aux élèves ?\n\nLes élèves déjà inscrits dans cette classe ne verront plus ses cours.`
    if (!confirm(question)) return
    setBusy(true)
    try {
      const res = await adminFetch('/api/admin/curriculum/levels', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ level, published: next }),
      })
      if (!res.ok) { alert(res.error ?? 'Erreur, réessaie.'); return }
      router.refresh()
    } finally {
      setBusy(false)
    }
  }

  return (
    <button
      type="button" onClick={toggle} disabled={busy || disabled}
      title={disabled ? 'Applique d’abord les migrations 063 et 064' : undefined}
      className={`text-[11px] font-bold px-2.5 py-1 rounded-full border transition-colors disabled:opacity-50 ${
        published
          ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
          : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
      }`}
    >
      {busy ? '…' : published ? '● Ouverte aux élèves' : '○ Admin seulement'}
    </button>
  )
}
