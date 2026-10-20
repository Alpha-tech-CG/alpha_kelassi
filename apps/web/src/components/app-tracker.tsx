'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

/**
 * Suivi d'usage du site (table `app_events`, migration 069), sans service
 * tiers : les élèves sont mineurs, les données restent dans Supabase.
 *
 * Déduit les événements de l'URL pour ne pas toucher aux pages elles-mêmes :
 *   • app_open        — une fois par session de navigation
 *   • chapter_opened  — /cours/matiere/<matière>/<chapitre>
 *   • paywall_viewed  — /billing
 * Visiteur non connecté : seul app_open part (policy anonyme). Toute erreur
 * est avalée, le suivi ne doit jamais gêner la navigation.
 *
 * Inclure dans le layout racine : <AppTracker />
 */

const UUID = '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}'
const CHAPTER_RE = new RegExp(`^/cours/matiere/(${UUID})/(${UUID})/?$`, 'i')

function storage(kind: 'local' | 'session'): Storage | null {
  try {
    return kind === 'local' ? window.localStorage : window.sessionStorage
  } catch {
    return null
  }
}

function deviceId(): string {
  const store = storage('local')
  const saved = store?.getItem('cognix_device_id')
  if (saved) return saved
  const id = crypto.randomUUID()
  store?.setItem('cognix_device_id', id)
  return id
}

async function send(name: string, props: Record<string, string> = {}) {
  try {
    const supabase = createClient()
    const { data } = await supabase.auth.getSession()
    const userId = data.session?.user.id ?? null
    if (!userId && name !== 'app_open') return
    // Table absente des types générés : appel non typé.
    await (supabase as unknown as { from: (t: string) => { insert: (row: object) => Promise<unknown> } })
      .from('app_events')
      .insert({ user_id: userId, device_id: deviceId(), name, platform: 'web', props })
  } catch {
    // no-op
  }
}

export function AppTracker() {
  const pathname = usePathname()

  useEffect(() => {
    if (!pathname || pathname.startsWith('/admin') || pathname.startsWith('/api')) return

    const session = storage('session')
    if (session && !session.getItem('cognix_app_open')) {
      session.setItem('cognix_app_open', '1')
      void send('app_open')
    }

    const chapter = CHAPTER_RE.exec(pathname)
    if (chapter) void send('chapter_opened', { chapter_id: chapter[2]! })
    else if (pathname === '/billing') void send('paywall_viewed')
  }, [pathname])

  return null
}
