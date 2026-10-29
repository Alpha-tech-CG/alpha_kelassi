/**
 * Cache offline des leçons (cours / résumé / fiche / quiz) — texte ET images
 * consultables sans connexion après une première visite en ligne.
 *
 * Implémenté avec expo-file-system (déjà utilisé ailleurs dans l'app pour les
 * uploads, donc éprouvé dans ce build EAS) plutôt que WatermelonDB : la
 * version précédente basée sur WatermelonDB provoquait un crash natif au
 * démarrage non rattrapable par try/catch, et avait dû être désactivée.
 *
 * Fonctionnement : à l'écriture, chaque image référencée dans le contenu
 * (`![légende](https://...)`) est téléchargée une fois dans le stockage local
 * de l'app, et son URL distante est remplacée par le chemin local avant
 * sauvegarde. Le JSON mis en cache contient donc directement des chemins
 * `file://...` — à la lecture hors-ligne, aucune requête réseau n'est
 * nécessaire pour afficher texte et images. En ligne, l'écran continue
 * d'afficher le contenu tel que reçu de Supabase (URLs distantes) : la mise
 * en cache se fait en tâche de fond, sans bloquer l'affichage.
 */
import * as FileSystem from 'expo-file-system/legacy'

const CACHE_DIR = `${FileSystem.documentDirectory}lesson-cache/`
const IMAGES_DIR = `${CACHE_DIR}images/`

function safeKey(key: string): string {
  return key.replace(/[^a-zA-Z0-9_-]/g, '_')
}

async function ensureDir(dir: string): Promise<void> {
  const info = await FileSystem.getInfoAsync(dir)
  if (!info.exists) await FileSystem.makeDirectoryAsync(dir, { intermediates: true })
}

/** Hash simple (non cryptographique) pour nommer les fichiers image en cache. */
function hashString(s: string): string {
  let h = 5381
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0
  return Math.abs(h).toString(36)
}

/** Télécharge une image distante vers le cache local si absente, renvoie le chemin local. */
async function ensureImageCached(url: string): Promise<string> {
  await ensureDir(IMAGES_DIR)
  const extMatch = url.split('?')[0]?.match(/\.([a-z0-9]{2,5})$/i)
  const ext = extMatch?.[1] ?? 'jpg'
  const localPath = `${IMAGES_DIR}${hashString(url)}.${ext}`
  const info = await FileSystem.getInfoAsync(localPath)
  if (info.exists) return localPath
  const result = await FileSystem.downloadAsync(url, localPath)
  return result.uri
}

/**
 * Remplace, dans un texte, chaque URL d'image distante par son chemin local
 * mis en cache (téléchargement si nécessaire). Fonctionne directement sur le
 * blob JSON stringifié d'un chapitre (titre + leçons) sans avoir besoin de le
 * reparser : les URLs n'y sont jamais échappées de façon à échapper au motif.
 */
async function cacheImagesInText(text: string): Promise<string> {
  const urlRegex = /https?:\/\/[^\s"')]+\.(?:png|jpe?g|gif|webp)/gi
  const urls = [...new Set(text.match(urlRegex) ?? [])]
  if (urls.length === 0) return text
  let result = text
  await Promise.all(urls.map(async (url) => {
    try {
      const localUri = await ensureImageCached(url)
      result = result.split(url).join(localUri)
    } catch {
      /* téléchargement échoué — l'URL distante reste ; cette image ne s'affichera pas hors-ligne */
    }
  }))
  return result
}

/** Lit le contenu en cache d'une leçon/chapitre (texte + chemins d'images locaux), ou null si absent. */
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

/**
 * Met en cache (écrase) le contenu d'une leçon/chapitre, images comprises.
 * Renvoie true si l'écriture a réussi — false si le stockage était
 * indisponible (espace disque, permissions...), pour que les appelants qui
 * ont besoin de le savoir (ex. téléchargement complet) puissent le détecter ;
 * les appelants en tâche de fond peuvent ignorer la valeur de retour sans
 * risque (aucune exception n'est jamais levée).
 */
/** Supprime une entrée du cache (contenu retiré du programme, ou ménage demandé par l'élève). */
export async function removeCachedLesson(lessonId: string): Promise<void> {
  try {
    await FileSystem.deleteAsync(`${CACHE_DIR}${safeKey(lessonId)}.json`, { idempotent: true })
  } catch { /* rien à supprimer */ }
}

export interface CachedEntry { key: string; fileName: string; size: number; cachedAt: number }

/**
 * Entrées présentes sur l'appareil, avec leur taille. La clé d'origine est
 * relue dans le fichier : `safeKey` remplace les caractères interdits, donc le
 * nom de fichier seul ne permet pas de la reconstituer.
 */
export async function listCachedEntries(): Promise<CachedEntry[]> {
  try {
    const info = await FileSystem.getInfoAsync(CACHE_DIR)
    if (!info.exists) return []
    const fichiers = (await FileSystem.readDirectoryAsync(CACHE_DIR)).filter((f) => f.endsWith('.json'))
    const entries = await Promise.all(fichiers.map(async (fileName) => {
      const chemin = `${CACHE_DIR}${fileName}`
      const stat = await FileSystem.getInfoAsync(chemin)
      let key = fileName.replace(/\.json$/, '')
      let cachedAt = 0
      try {
        const brut = await FileSystem.readAsStringAsync(chemin)
        const parsed = JSON.parse(brut) as { key?: string; cachedAt?: number }
        key = parsed.key ?? key
        cachedAt = parsed.cachedAt ?? 0
      } catch { /* fichier illisible : on garde ce que le nom indique */ }
      return { key, fileName, size: stat.exists && 'size' in stat ? (stat.size ?? 0) : 0, cachedAt }
    }))
    return entries
  } catch {
    return []
  }
}

/** Place occupée par le cache, images comprises (octets). */
export async function cacheSize(): Promise<number> {
  const somme = async (dir: string): Promise<number> => {
    try {
      const info = await FileSystem.getInfoAsync(dir)
      if (!info.exists) return 0
      const noms = await FileSystem.readDirectoryAsync(dir)
      const tailles = await Promise.all(noms.map(async (n) => {
        const stat = await FileSystem.getInfoAsync(`${dir}${n}`)
        if (stat.exists && stat.isDirectory) return somme(`${dir}${n}/`)
        return stat.exists && 'size' in stat ? (stat.size ?? 0) : 0
      }))
      return tailles.reduce((a, b) => a + b, 0)
    } catch {
      return 0
    }
  }
  return somme(CACHE_DIR)
}

/** Vide tout le cache hors-ligne, images comprises. */
export async function clearCache(): Promise<void> {
  try {
    await FileSystem.deleteAsync(CACHE_DIR, { idempotent: true })
  } catch { /* rien à supprimer */ }
}

export async function writeCachedLesson(lessonId: string, type: string, content: string): Promise<boolean> {
  if (!content) return false
  try {
    await ensureDir(CACHE_DIR)
    const withLocalImages = await cacheImagesInText(content)
    const path = `${CACHE_DIR}${safeKey(lessonId)}.json`
    await FileSystem.writeAsStringAsync(path, JSON.stringify({ key: lessonId, type, content: withLocalImages, cachedAt: Date.now() }))
    return true
  } catch {
    return false
  }
}
