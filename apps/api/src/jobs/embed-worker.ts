import { Worker, Job } from 'bullmq'
import pdfParse from 'pdf-parse'
import { supabaseAdmin as supabase } from '../lib/supabase.js'
import { chunkText } from '../lib/chunker.js'
import { embedTexts } from '../lib/embeddings.js'

interface EmbedJobData {
  document_id: string
  pdf_url: string
  text_content?: string  // pré-extrait à l'upload si disponible
}

const ALLOWED_PDF_HOSTS = [
  process.env['SUPABASE_URL'] ? new URL(process.env['SUPABASE_URL']!).hostname : null,
].filter(Boolean) as string[]

function assertSafeStorageUrl(url: string): void {
  let parsed: URL
  try { parsed = new URL(url) } catch { throw new Error('pdf_url invalide') }
  if (parsed.protocol !== 'https:') throw new Error('pdf_url doit utiliser HTTPS')
  if (!ALLOWED_PDF_HOSTS.some((h) => parsed.hostname === h || parsed.hostname.endsWith(`.${h}`))) {
    throw new Error(`pdf_url pointe vers un hÃ´te non autorisÃ© : ${parsed.hostname}`)
  }
}

async function processEmbedJob(job: Job<EmbedJobData>) {
  const { document_id, pdf_url, text_content: preExtracted } = job.data
  await job.updateProgress(5)

  let rawText: string

  if (preExtracted && preExtracted.trim().length >= 50) {
    // Texte déjà extrait à l'upload (DOCX, TXT, ou PDF) — évite un re-téléchargement
    rawText = preExtracted
    await job.updateProgress(35)
  } else {
    // Fallback : re-télécharge et extrait depuis le PDF
    assertSafeStorageUrl(pdf_url)
    const response = await fetch(pdf_url)
    if (!response.ok) throw new Error(`Impossible de télécharger le PDF : ${response.status}`)
    const buffer = Buffer.from(await response.arrayBuffer())
    await job.updateProgress(20)

    const parsed = await pdfParse(buffer)
    rawText = parsed.text
    if (!rawText || rawText.trim().length < 50) {
      throw new Error('PDF vide ou non-extractible (probablement scanné)')
    }

    // Sauvegarde text_content si ce n'était pas encore fait
    await supabase.from('documents').update({ text_content: rawText }).eq('id', document_id)
    await job.updateProgress(35)
  }

  // 3. Chunking sÃ©mantique
  const chunks = chunkText(rawText)
  if (chunks.length === 0) throw new Error('Aucun chunk produit')
  await job.updateProgress(50)

  // 4. Embeddings Gemini (batches de 100)
  const texts = chunks.map((c) => c.content)
  const vectors = await embedTexts(texts)
  await job.updateProgress(80)

  // 5. Upsert dans document_chunks
  // Supprime d'abord les anciens chunks (re-indexation possible)
  await supabase.from('document_chunks').delete().eq('document_id', document_id)

  const rows = chunks.map((chunk, i) => ({
    document_id,
    content: chunk.content,
    embedding: JSON.stringify(vectors[i]),  // pgvector attend un vecteur JSON
    chunk_index: chunk.chunkIndex,
    page_number: chunk.pageNumber,
    metadata: { is_exercise: chunk.isExercise, char_count: chunk.content.length },
  }))

  // InsÃ¨re en batches de 50 pour Ã©viter les timeouts Supabase
  for (let i = 0; i < rows.length; i += 50) {
    const batch = rows.slice(i, i + 50)
    const { error } = await supabase.from('document_chunks').insert(batch)
    if (error) throw new Error(`Erreur insertion chunks ${i}-${i + batch.length}: ${error.message}`)
  }
  await job.updateProgress(95)

  // 6. Marque le document comme indexÃ©
  await supabase
    .from('documents')
    .update({ indexed_at: new Date().toISOString() })
    .eq('id', document_id)

  await job.updateProgress(100)
  console.log(`[embed-worker] Document ${document_id} indexÃ© â€” ${chunks.length} chunks`)
  return { document_id, chunks_count: chunks.length }
}

export function startEmbedWorker() {
  const worker = new Worker<EmbedJobData>('embed_document', processEmbedJob, {
    connection: { url: process.env['QUEUE_REDIS_URL']! },
    concurrency: 2,
  })

  const onCompleted = (job: Job<EmbedJobData>) => {
    console.log(`[embed-worker] Job ${job.id} terminé`)
  }
  const onFailed = (job: Job<EmbedJobData> | undefined, err: Error) => {
    console.error(`[embed-worker] Job ${job?.id} échoué:`, err.message)
  }
  const onProgress = (job: Job<EmbedJobData>, progress: unknown) => {
    console.log(`[embed-worker] Job ${job.id} — ${progress}%`)
  }

  worker.on('completed', onCompleted)
  worker.on('failed', onFailed)
  worker.on('progress', onProgress)

  // Teardown : chaque .on() a son .off() à la fermeture du worker, sinon les
  // handlers (et le closure qu'ils retiennent) survivent à l'instance.
  worker.once('closed', () => {
    worker.off('completed', onCompleted)
    worker.off('failed', onFailed)
    worker.off('progress', onProgress)
    worker.removeAllListeners()
  })

  return worker
}
