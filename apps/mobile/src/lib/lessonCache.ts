/**
 * Cache offline des leçons (résumé / cours) — migr. 027.
 *
 * ⚠️ DÉSACTIVÉ pour l'instant (OFFLINE_CACHE_ENABLED = false).
 * WatermelonDB est retiré du chemin de démarrage à cause d'un crash natif EAS
 * (non rattrapable par try/catch). Tant que ce crash n'est pas corrigé, on
 * n'invoque PAS WatermelonDB au runtime : les écrans restent 100 % en ligne,
 * sans aucun risque de crash dans l'APK.
 *
 * L'infrastructure (db/schema `lesson_cache` v2 + migration + LessonCacheModel)
 * reste en place. Pour réactiver l'offline une fois WatermelonDB stabilisé :
 * passer OFFLINE_CACHE_ENABLED à true.
 */

const OFFLINE_CACHE_ENABLED = false

async function getDb() {
  const [{ database }, { Q }] = await Promise.all([
    import('../db'),
    import('@nozbe/watermelondb'),
  ])
  return { database, Q }
}

/** Lit le contenu en cache d'une leçon, ou null si absent/désactivé. */
export async function readCachedLesson(lessonId: string): Promise<string | null> {
  if (!OFFLINE_CACHE_ENABLED) return null
  try {
    const { database, Q } = await getDb()
    const rows = await database.get('lesson_cache').query(Q.where('lesson_id', lessonId)).fetch()
    const row = rows[0] as unknown as { content?: string } | undefined
    return row?.content ?? null
  } catch {
    return null
  }
}

/** Met en cache (upsert) le contenu d'une leçon. No-op tant que désactivé. */
export async function writeCachedLesson(lessonId: string, type: string, content: string): Promise<void> {
  if (!OFFLINE_CACHE_ENABLED || !content) return
  try {
    const { database, Q } = await getDb()
    await database.write(async () => {
      const coll = database.get('lesson_cache')
      const existing = await coll.query(Q.where('lesson_id', lessonId)).fetch()
      if (existing[0]) {
        await existing[0].update((r: any) => { r.content = content; r.type = type; r.cachedAt = Date.now() })
      } else {
        await coll.create((r: any) => {
          r.lessonId = lessonId; r.type = type; r.content = content; r.cachedAt = Date.now()
        })
      }
    })
  } catch {
    /* offline cache indisponible — ignoré */
  }
}
