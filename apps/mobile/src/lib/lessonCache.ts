/**
 * Cache offline des leçons (cours / résumé / fiche / quiz) — contenu texte
 * lisible sans connexion après une première visite en ligne.
 *
 * Implémenté avec expo-file-system (déjà utilisé ailleurs dans l'app pour les
 * uploads, donc éprouvé dans ce build EAS) plutôt que WatermelonDB : la
 * version précédente basée sur WatermelonDB provoquait un crash natif au
 * démarrage non rattrapable par try/catch, et avait dû être désactivée. Un
 * simple fichier JSON par leçon/chapitre évite toute dépendance native
 * supplémentaire.
 */
import * as FileSystem from 'expo-file-system'

const CACHE_DIR = `${FileSystem.documentDirectory}lesson-cache/`

function safeKey(key: string): string {
  return key.replace(/[^a-zA-Z0-9_-]/g, '_')
}

async function ensureDir(): Promise<void> {
  const info = await FileSystem.getInfoAsync(CACHE_DIR)
  if (!info.exists) await FileSystem.makeDirectoryAsync(CACHE_DIR, { intermediates: true })
}

/** Lit le contenu en cache d'une leçon/chapitre, ou null si absent. */
export async function readCachedLesson(lessonId: string): Promise<string | null> {
  try {
    const path = `${CACHE_DIR}${safeKey(lessonId)}.json`
    const info = await FileSystem.getInfoAsync(path)
    if (!info.exists) return null
    const raw = await FileSystem.readAsStringAsync(path)
    const parsed = JSON.parse(raw) as { content?: string }
    return parsed.content ?? null
  } catch {
    return null
  }
}

/** Met en cache (écrase) le contenu d'une leçon/chapitre. */
export async function writeCachedLesson(lessonId: string, type: string, content: string): Promise<void> {
  if (!content) return
  try {
    await ensureDir()
    const path = `${CACHE_DIR}${safeKey(lessonId)}.json`
    await FileSystem.writeAsStringAsync(path, JSON.stringify({ type, content, cachedAt: Date.now() }))
  } catch {
    /* stockage indisponible (espace disque, permissions...) — on continue en ligne uniquement */
  }
}
