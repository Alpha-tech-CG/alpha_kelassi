/**
 * PostgREST plafonne chaque réponse (1000 lignes par défaut sur Supabase) :
 * un `select` sans `.range()` sur une table plus grosse est tronqué
 * silencieusement. Ce helper enchaîne les pages jusqu'à la dernière.
 *
 * `page(from, to)` doit construire la requête complète (filtres compris) et
 * se terminer par `.order(<colonne unique>).range(from, to)` : sans ordre
 * stable, deux pages peuvent se chevaucher ou sauter des lignes.
 *
 *   const lessons = await selectAll((from, to) =>
 *     supabase.from('lessons').select('id, chapter_id').order('id').range(from, to))
 *
 * Une erreur sur une page est levée : à l'appelant de la rattraper.
 */
export const PAGE_SIZE = 1000

export async function selectAll<T>(
  page: (from: number, to: number) => PromiseLike<{ data: T[] | null; error: unknown }>,
  pageSize = PAGE_SIZE
): Promise<T[]> {
  const rows: T[] = []
  for (let from = 0; ; from += pageSize) {
    const { data, error } = await page(from, from + pageSize - 1)
    if (error) throw error
    const batch = data ?? []
    rows.push(...batch)
    if (batch.length < pageSize) return rows
  }
}
