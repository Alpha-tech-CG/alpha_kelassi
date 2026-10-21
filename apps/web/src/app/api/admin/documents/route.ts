import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { z } from 'zod'
import { STUDY_LEVELS } from '@alpha-kelassi/types'
import { chunkText } from '@/lib/ai/chunker'
import { embedTexts } from '@/lib/ai/embeddings'

export const maxDuration = 300 // secondes — extraction PDF + indexation RAG (chunks + embeddings)

// Client admin (bypass RLS)
const supabaseAdmin = createAdminClient(
  process.env['NEXT_PUBLIC_SUPABASE_URL']!,
  process.env['SUPABASE_SERVICE_ROLE_KEY']!
)

const saveSchema = z.object({
  storagePath: z.string().min(1),
  bucket: z.enum(['pdfs-premium', 'pdfs-public']),
  meta: z.object({
    subject_id: z.string().uuid(),
    type: z.enum(['cours', 'examen']),
    title: z.string().min(3),
    level: z.enum(STUDY_LEVELS),
    year: z.coerce.number().int().min(1990).max(2030).optional(),
    session: z.enum(['normale', 'rattrapage']).optional(),
    country_code: z.string().length(2).default('CG'),
    is_premium: z.boolean().default(false),
  }),
})

function detectFormat(filename: string): 'pdf' | 'docx' | 'txt' | null {
  const ext = filename.split('.').pop()?.toLowerCase()
  if (ext === 'pdf') return 'pdf'
  if (ext === 'docx') return 'docx'
  if (ext === 'txt') return 'txt'
  return null
}

async function extractText(buffer: Buffer, format: 'pdf' | 'docx' | 'txt'): Promise<string> {
  if (format === 'txt') return buffer.toString('utf-8')
  if (format === 'pdf') {
    // pdfjs-dist v4 est ESM-only : on ne peut pas utiliser require.resolve()
    // sur les fichiers .mjs (webpack essaie de les bundler et échoue).
    // Solution : createRequire() depuis le module Node.js natif 'module'
    // crée une fonction require dynamique que webpack n'analyse PAS statiquement.
    // Au runtime, Node.js résout correctement le chemin absolu du worker .mjs.
    const pdfjs = await import('pdfjs-dist')
    const { createRequire } = await import('module')
    const _require = createRequire(process.cwd() + '/package.json')
    pdfjs.GlobalWorkerOptions.workerSrc = _require.resolve(
      'pdfjs-dist/build/pdf.worker.min.mjs'
    )

    const doc = await pdfjs.getDocument({
      data: new Uint8Array(buffer),
      useWorkerFetch: false,
      isEvalSupported: false,
      useSystemFonts: true,
      disableFontFace: true,
    }).promise

    const pages: string[] = []
    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i)
      const content = await page.getTextContent()
      const text = content.items
        .map((item) => ('str' in item ? (item as { str: string }).str : ''))
        .join(' ')
      pages.push(text)
    }
    await doc.destroy()
    return pages.join('\n')
  }
  if (format === 'docx') {
    const mammoth = await import('mammoth')
    const result = await mammoth.extractRawText({ buffer })
    return result.value
  }
  return ''
}

function cleanText(raw: string): string {
  return raw
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[^\S\n]+/g, ' ')
    .trim()
}

export async function POST(req: NextRequest) {
  // Auth
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  // Vérif admin
  const { data: profile } = await supabaseAdmin
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()
  if (profile?.role !== 'admin') {
    return NextResponse.json({ error: 'Admin requis' }, { status: 403 })
  }

  // Parse JSON body
  let body: z.infer<typeof saveSchema>
  try {
    const raw = await req.json()
    body = saveSchema.parse(raw)
  } catch {
    return NextResponse.json({ error: 'Corps de requête invalide' }, { status: 400 })
  }

  const { storagePath, bucket, meta } = body

  // Télécharge le fichier depuis Supabase Storage pour extraire le texte
  const { data: fileData, error: downloadError } = await supabaseAdmin.storage
    .from(bucket)
    .download(storagePath)

  if (downloadError || !fileData) {
    return NextResponse.json({ error: `Fichier introuvable en storage : ${downloadError?.message}` }, { status: 404 })
  }

  const arrayBuffer = await fileData.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  const format = detectFormat(storagePath)
  if (!format) {
    return NextResponse.json({ error: 'Format non supporté. Utilisez PDF, DOCX ou TXT.' }, { status: 400 })
  }

  // Extraction texte
  let textContent: string | null = null
  try {
    const raw = await extractText(buffer, format)
    textContent = cleanText(raw)
    if (!textContent || textContent.length < 20) {
      return NextResponse.json({ error: 'Document vide ou non extractible (PDF scanné ?)' }, { status: 422 })
    }
  } catch (err) {
    return NextResponse.json({ error: `Erreur extraction : ${(err as Error).message}` }, { status: 422 })
  }

  // URL publique
  const { data: { publicUrl } } = supabaseAdmin.storage.from(bucket).getPublicUrl(storagePath)

  // Insert en base
  const { data: doc, error: dbError } = await supabaseAdmin
    .from('documents')
    .insert({
      ...meta,
      year: meta.year ?? null,
      session: meta.session ?? null,
      pdf_url: publicUrl,
      text_content: textContent,
    })
    .select()
    .single()

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 })
  }

  // Indexation RAG : chunking sémantique + embeddings Gemini -> document_chunks.
  // Remplace l'ancien worker BullMQ (supprimé avec apps/api). Résilient : si
  // l'embedding échoue, le document reste enregistré et pourra être réindexé.
  let indexedChunks = 0
  try {
    const chunks = chunkText(textContent)
    if (chunks.length > 0) {
      const vectors = await embedTexts(chunks.map((c) => c.content))
      await supabaseAdmin.from('document_chunks').delete().eq('document_id', doc.id)
      const rows = chunks.map((chunk, i) => ({
        document_id: doc.id,
        content: chunk.content,
        embedding: JSON.stringify(vectors[i] ?? []), // pgvector attend un tableau JSON
        chunk_index: chunk.chunkIndex,
        page_number: chunk.pageNumber,
        metadata: { is_exercise: chunk.isExercise, char_count: chunk.content.length },
      }))
      for (let i = 0; i < rows.length; i += 50) {
        const { error } = await supabaseAdmin.from('document_chunks').insert(rows.slice(i, i + 50))
        if (error) throw new Error(error.message)
      }
      await supabaseAdmin
        .from('documents')
        .update({ indexed_at: new Date().toISOString() })
        .eq('id', doc.id)
      indexedChunks = chunks.length
    }
  } catch (err) {
    console.error('[admin/documents] indexation RAG échouée:', (err as Error).message)
  }

  // On ne renvoie pas text_content (peut contenir des séquences Unicode invalides)
  const { text_content: _, ...docSafe } = doc as Record<string, unknown>
  return NextResponse.json({ data: docSafe, indexed_chunks: indexedChunks }, { status: 201 })
}
