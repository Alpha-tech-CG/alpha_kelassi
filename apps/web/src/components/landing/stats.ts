import { createClient } from '@supabase/supabase-js'

/**
 * Chiffres réels du catalogue affichés sur la page d'accueil (leçons,
 * chapitres). Lus avec la clé publique, sans cookies, pour que la page reste
 * statique (revalidée toutes les heures). En cas d'échec, valeurs de repli
 * prudentes plutôt qu'une erreur.
 */
export async function getCatalogueStats(): Promise<{ lessons: number; chapters: number }> {
  const fallback = { lessons: 900, chapters: 300 }
  const url = process.env['NEXT_PUBLIC_SUPABASE_URL']
  const key = process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY']
  if (!url || !key) return fallback
  try {
    const supabase = createClient(url, key, { auth: { persistSession: false } })
    const [lessons, chapters] = await Promise.all([
      supabase.from('lessons').select('id', { count: 'exact', head: true }),
      supabase.from('chapters').select('id', { count: 'exact', head: true }),
    ])
    return {
      lessons: lessons.count ?? fallback.lessons,
      chapters: chapters.count ?? fallback.chapters,
    }
  } catch {
    return fallback
  }
}
