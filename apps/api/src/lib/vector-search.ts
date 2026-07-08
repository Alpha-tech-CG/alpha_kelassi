import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@alpha-kelassi/types'
import { embedQuery } from './embeddings.js'

export interface ChunkResult {
  id: string
  document_id: string
  content: string
  chunk_index: number
  page_number: number | null
  metadata: Record<string, unknown>
  similarity: number
}

/**
 * Recherche vectorielle RAG.
 * `isPremium` doit refléter le plan RÉEL de l'élève qui pose la question
 * (déterminé par l'appelant via sa propre session, pas déduit ici) — la
 * fonction SQL search_chunks() filtre le contenu premium sur ce paramètre
 * explicite plutôt que via auth.uid(), car cet appel serveur ne porte pas
 * toujours l'identité de l'utilisateur au niveau du rôle Postgres.
 */
export async function searchRelevantChunks(
  supabase: SupabaseClient<Database>,
  question: string,
  options: { matchCount?: number; minSimilarity?: number; documentId?: string; isPremium?: boolean } = {}
): Promise<ChunkResult[]> {
  const { matchCount = 5, minSimilarity = 0.72, documentId, isPremium = false } = options

  let embedding: number[]
  try {
    embedding = await embedQuery(question)
  } catch (err) {
    // Si les embeddings ne sont pas disponibles (pas de cours indexés ou modèle indisponible),
    // retourner un tableau vide — Kelassi répondra sans contexte de cours
    console.warn('[vector-search] Embeddings unavailable, skipping RAG:', (err as Error).message)
    return []
  }

  const { data, error } = await supabase.rpc('search_chunks', {
    query_embedding: embedding,
    match_count: matchCount,
    min_similarity: minSimilarity,
    filter_document: documentId ?? null,
    p_include_premium: isPremium,
  })

  if (error) {
    console.warn('[vector-search] RPC error:', error.message)
    return []
  }
  return (data ?? []) as ChunkResult[]
}
