import { createClient } from '@supabase/supabase-js'
import { embedQuery } from './embeddings'

// Lazy — jamais instancié au build time
let _admin: ReturnType<typeof createClient> | null = null
function getAdmin() {
  if (!_admin) {
    _admin = createClient(
      process.env['NEXT_PUBLIC_SUPABASE_URL']!,
      process.env['SUPABASE_SERVICE_ROLE_KEY']!
    )
  }
  return _admin
}

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
 * `isPremium` doit refléter le plan RÉEL de l'élève (déterminé par
 * l'appelant via sa propre session) — search_chunks() filtre le contenu
 * premium sur ce paramètre explicite, car cet appel utilise le client
 * service role (getAdmin) qui ne porte pas l'identité de l'utilisateur.
 */
export async function searchRelevantChunks(
  question: string,
  options: { matchCount?: number; minSimilarity?: number; documentId?: string; isPremium?: boolean } = {}
): Promise<ChunkResult[]> {
  const { matchCount = 5, minSimilarity = 0.72, documentId, isPremium = false } = options

  // Quand on a un document précis, on abaisse le seuil et on prend plus de chunks
  // pour ne pas passer à côté du contexte pertinent
  const effectiveSimilarity = documentId ? Math.min(minSimilarity, 0.45) : minSimilarity
  const effectiveCount      = documentId ? Math.max(matchCount, 8)      : matchCount

  let embedding: number[]
  try {
    embedding = await embedQuery(question)
  } catch (err) {
    console.warn('[vector-search] Embeddings unavailable, fallback direct chunks:', (err as Error).message)
    if (documentId) return fetchFirstChunks(documentId, effectiveCount, isPremium)
    return []
  }

  const { data, error } = await getAdmin().rpc('search_chunks', {
    query_embedding:  embedding,
    match_count:      effectiveCount,
    min_similarity:   effectiveSimilarity,
    filter_document:  documentId ?? null,
    p_include_premium: isPremium,
  })

  if (error) {
    console.warn('[vector-search] RPC error:', error.message)
    if (documentId) return fetchFirstChunks(documentId, effectiveCount, isPremium)
    return []
  }

  const results = (data ?? []) as ChunkResult[]

  // Moins de 2 résultats pour ce document → fallback sur les premiers chunks
  if (documentId && results.length < 2) {
    return fetchFirstChunks(documentId, effectiveCount, isPremium)
  }

  return results
}

/**
 * Fallback : premiers chunks du document par ordre, quand la recherche
 * vectorielle échoue. Utilise getAdmin() (bypass RLS) donc DOIT revérifier
 * manuellement le statut premium du document ciblé avant de renvoyer quoi
 * que ce soit — sinon ce repli devient une fuite de contenu payant.
 */
async function fetchFirstChunks(documentId: string, limit: number, isPremium: boolean): Promise<ChunkResult[]> {
  if (!isPremium) {
    const { data: doc } = await getAdmin()
      .from('documents')
      .select('is_premium')
      .eq('id', documentId)
      .single()
    if ((doc as { is_premium?: boolean } | null)?.is_premium) return []
  }

  const { data } = await getAdmin()
    .from('document_chunks')
    .select('id, document_id, content, chunk_index, page_number, metadata')
    .eq('document_id', documentId)
    .order('chunk_index')
    .limit(limit)

  return (data ?? []).map((c) => ({ ...c, similarity: 1 }))
}
