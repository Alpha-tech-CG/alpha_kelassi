import { Linking } from 'react-native'
import type { ShouldStartLoadRequest } from 'react-native-webview/lib/WebViewTypes'

/** baseUrl des WebView de leçons : le HTML est chargé « depuis » cette adresse. */
export const LESSON_BASE_URL = 'https://kelassi.app/'

/**
 * `onShouldStartLoadWithRequest` des WebView de leçons (audit du 27/10/2026, F4).
 *
 * La WebView n'affiche que le HTML de la leçon : un lien du contenu ne doit pas
 * la faire naviguer ailleurs (page externe affichée comme si elle faisait partie
 * de l'app). Les liens http(s) s'ouvrent dans le navigateur du téléphone, tout
 * le reste (javascript:, intent:, file:…) est ignoré.
 */
export function keepLessonInWebView(req: ShouldStartLoadRequest): boolean {
  const url = req.url ?? ''
  // Chargement initial du HTML (iOS le signale) et ancres internes.
  if (url.startsWith('about:') || url === LESSON_BASE_URL || url.startsWith(`${LESSON_BASE_URL}#`)) return true
  if (/^https?:\/\//i.test(url)) Linking.openURL(url).catch(() => {})
  return false
}
