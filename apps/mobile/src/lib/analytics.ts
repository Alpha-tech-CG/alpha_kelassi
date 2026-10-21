import { Platform } from 'react-native'
import Constants from 'expo-constants'
import * as SecureStore from 'expo-secure-store'
import { supabase } from './supabase'

/**
 * Suivi d'usage maison : les événements vont dans `app_events` (Supabase,
 * migration 069), sans service tiers — les élèves sont mineurs.
 *
 * On n'envoie que des faits et des identifiants de contenu, jamais un texte
 * saisi par l'élève. Tout est « fire and forget » : une erreur réseau ou RLS
 * est avalée, le suivi ne doit jamais gêner l'app.
 *
 * Avant connexion, seuls les événements d'inscription passent (policy anonyme) ;
 * l'identifiant d'installation `device_id` relie ces étapes au compte créé.
 */

export type AppEventName =
  | 'app_open'
  | 'register_step'
  | 'register_submitted'
  | 'register_completed'
  | 'onboarding_completed'
  | 'chapter_opened'
  | 'lesson_opened'
  | 'quiz_completed'
  | 'paywall_viewed'

const ANON_EVENTS: ReadonlySet<AppEventName> = new Set(['app_open', 'register_step', 'register_submitted'])
const DEVICE_KEY = 'cognix_device_id'
const APP_VERSION = (Constants.expoConfig?.version ?? '').slice(0, 20) || null

let deviceIdPromise: Promise<string> | null = null

function randomId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })
}

function getDeviceId(): Promise<string> {
  deviceIdPromise ??= (async () => {
    try {
      const saved = await SecureStore.getItemAsync(DEVICE_KEY)
      if (saved) return saved
      const id = randomId()
      await SecureStore.setItemAsync(DEVICE_KEY, id)
      return id
    } catch {
      return randomId()
    }
  })()
  return deviceIdPromise
}

export function track(name: AppEventName, props: Record<string, string | number | boolean | null> = {}): void {
  void (async () => {
    try {
      const [{ data }, deviceId] = await Promise.all([supabase.auth.getSession(), getDeviceId()])
      const userId = data.session?.user.id ?? null
      if (!userId && !ANON_EVENTS.has(name)) return
      await supabase.from('app_events').insert({
        user_id: userId,
        device_id: deviceId,
        name,
        platform: Platform.OS === 'ios' || Platform.OS === 'web' ? Platform.OS : 'android',
        app_version: APP_VERSION,
        props,
      })
    } catch {
      // no-op — le suivi ne doit jamais casser l'app.
    }
  })()
}

/** Ouverture d'app : au démarrage, puis au retour après 30 min d'arrière-plan. */
const SESSION_GAP_MS = 30 * 60 * 1000
let lastOpenAt = 0
export function trackAppOpen(): void {
  const now = Date.now()
  if (now - lastOpenAt < SESSION_GAP_MS) return
  lastOpenAt = now
  track('app_open')
}
