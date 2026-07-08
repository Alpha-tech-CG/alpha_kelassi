'use client'

import { useEffect, useState } from 'react'
import { MessageCircle } from 'lucide-react'

interface Prefs { phone: string | null; whatsapp_opt_in: boolean; reminder_hour: number }

export function ReminderSettings() {
  const [prefs, setPrefs] = useState<Prefs | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/reminders', { credentials: 'include' })
      .then((r) => r.json())
      .then((j) => setPrefs(j.data ?? null))
  }, [])

  async function save(patch: Partial<Prefs>) {
    if (!prefs) return
    const next = { ...prefs, ...patch }
    setPrefs(next)
    setSaving(true)
    await fetch('/api/reminders', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
      body: JSON.stringify({ whatsapp_opt_in: next.whatsapp_opt_in, reminder_hour: next.reminder_hour }),
    })
    setSaving(false)
  }

  if (!prefs) return null

  return (
    <section className="bg-white border rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-emerald-600" />
          <h2 className="font-bold text-gray-900">Rappels WhatsApp</h2>
        </div>
        <button
          role="switch"
          aria-checked={prefs.whatsapp_opt_in}
          onClick={() => save({ whatsapp_opt_in: !prefs.whatsapp_opt_in })}
          className={`relative w-11 h-6 rounded-full transition ${prefs.whatsapp_opt_in ? 'bg-emerald-500' : 'bg-gray-300'}`}
        >
          <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${prefs.whatsapp_opt_in ? 'translate-x-5' : ''}`} />
        </button>
      </div>

      {!prefs.phone && (
        <p className="text-xs text-amber-600 mt-2">Ajoute un numéro de téléphone à ton compte pour recevoir les rappels.</p>
      )}

      {prefs.whatsapp_opt_in && (
        <div className="flex items-center gap-2 mt-4 text-sm">
          <span className="text-gray-600">Heure du rappel quotidien</span>
          <select
            value={prefs.reminder_hour}
            onChange={(e) => save({ reminder_hour: Number(e.target.value) })}
            className="border rounded-lg px-2 py-1"
            disabled={saving}
          >
            {Array.from({ length: 24 }, (_, h) => (
              <option key={h} value={h}>{h.toString().padStart(2, '0')}h00</option>
            ))}
          </select>
        </div>
      )}
      <p className="text-xs text-gray-400 mt-3">
        On t&apos;enverra un rappel WhatsApp (ou SMS) quand tu as des révisions prévues. Réponds STOP pour te désabonner.
      </p>
    </section>
  )
}
