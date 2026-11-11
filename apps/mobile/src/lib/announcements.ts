import * as SecureStore from 'expo-secure-store'
import { API_URL } from './config'

/**
 * Annonces de la console admin (/admin/notifications), lues sur la même route
 * publique que le site : GET /api/notifications?plan=free|premium.
 */

export type AnnouncementType = 'annonce' | 'promo' | 'pub' | 'alerte'

export interface Announcement {
  id: string
  type: AnnouncementType
  title: string
  message: string
  cta_label: string | null
  cta_url: string | null
}

const DISMISSED_KEY = 'cognix_dismissed_announcements'
// SecureStore limite chaque valeur à ~2 Ko : on ne garde que les plus récentes.
const MAX_DISMISSED = 30

export async function fetchAnnouncements(plan: string | null | undefined): Promise<Announcement[]> {
  const audience = !plan || plan === 'free' ? 'free' : 'premium'
  try {
    const res = await fetch(`${API_URL}/api/notifications?plan=${audience}`)
    if (!res.ok) return []
    const json = (await res.json()) as { data?: Announcement[] }
    return json.data ?? []
  } catch {
    return []
  }
}

export async function dismissedAnnouncements(): Promise<string[]> {
  try {
    return JSON.parse((await SecureStore.getItemAsync(DISMISSED_KEY)) ?? '[]') as string[]
  } catch {
    return []
  }
}

export async function dismissAnnouncement(id: string): Promise<void> {
  try {
    const next = [...(await dismissedAnnouncements()).filter((x) => x !== id), id].slice(-MAX_DISMISSED)
    await SecureStore.setItemAsync(DISMISSED_KEY, JSON.stringify(next))
  } catch {
    // Stockage indisponible : l'annonce reviendra au prochain lancement, sans gravité.
  }
}

/** Pages du site qui ont un écran équivalent dans l'app. */
const APP_SCREENS: [prefix: string, route: string][] = [
  ['/billing', '/abonnement'],
  ['/abonnement', '/abonnement'],
  ['/tarifs', '/abonnement'],
  ['/cours', '/(tabs)/cours'],
  ['/examens', '/(tabs)/examens'],
  ['/prepa', '/(tabs)/examens'],
  ['/dashboard', '/(tabs)'],
]

/**
 * Où mène le bouton d'une annonce : un écran de l'app si le lien pointe vers
 * une page du site qui en a un, sinon le navigateur.
 */
export function announcementTarget(url: string): { kind: 'screen'; route: string } | { kind: 'browser'; url: string } | null {
  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    return null
  }
  if (parsed.protocol !== 'https:') return null
  if (parsed.origin === new URL(API_URL).origin) {
    const hit = APP_SCREENS.find(([p]) => parsed.pathname === p || parsed.pathname.startsWith(`${p}/`))
    if (hit) return { kind: 'screen', route: hit[1] }
  }
  return { kind: 'browser', url: parsed.toString() }
}
