import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { z } from 'zod'

// Client admin (bypass RLS)
const supabaseAdmin = createAdminClient(
  process.env['NEXT_PUBLIC_SUPABASE_URL']!,
  process.env['SUPABASE_SERVICE_ROLE_KEY']!
)

const uploadSchema = z.object({
  subject_id: z.string().uuid(),
  type: z.enum(['cours', 'examen']),
  title: z.string().min(3),
  level: z.enum(['bepc', 'bac_a', 'bac_c', 'bac_d']),
  year: z.coerce.number().int().min(1990).max(2030).optional(),
  session: z.enum(['normale', 'rattrapage']).optional(),
  country_code: z.string().length(2).default('CG'),
  is_premium: z.boolean().default(false),
})

// Détection du format
function detectFormat(filename: string, mime: string, header: Uint8Array): 'pdf' | 'docx' | 'txt' | null {
  const ext = filename.split('.').pop()?.toLowerCase()
  const isPdf = header[0] === 0x25 && header[1] === 0x50 && header[2] === 0x44 && header[3] === 0x46
  const isDocx = header[0] === 0x50 && header[1] === 0x4B && header[2] === 0x03 && header[3] === 0x04

  if (isPdf || ext === 'pdf') return 'pdf'
  if (isDocx || ext === 'docx' || mime.includes('wordprocessingml')) return 'docx'
  if (ext === 'txt' || mime.startsWith('text/')) return 'txt'
  return null
}

// Extraction de texte
async function extractText(buffer: Buffer, format: 'pdf' | 'docx' | 'txt'): Promise<string> {
  if (format === 'txt') {
    return buffer.toString('utf-8')
  }
  if (format === 'pdf') {
    const pdfParse = (await import('pdf-parse')).default
    const result = await pdfParse(buffer)
    return result.text
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

  // Parse form data
  const formData = await req.formData()
  const file = formData.get('file') as File | null
  const metaRaw = formData.get('meta') as string | null

  if (!file || !metaRaw) {
    return NextResponse.json({ error: 'Fichier et métadonnées requis' }, { status: 400 })
  }

  let meta: z.infer<typeof uploadSchema>
  try {
    meta = uploadSchema.parse(JSON.parse(metaRaw))
  } catch {
    return NextResponse.json({ error: 'Métadonnées invalides' }, { status: 400 })
  }

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  const header = new Uint8Array(buffer.slice(0, 4))
  const format = detectFormat(file.name, file.type, header)

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

  // Nom de fichier sécurisé
  const safeName = file.name
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/\.{2,}/g, '_')
    .replace(/^[._]+/, '')
    .slice(0, 100)

  const contentTypeMap: Record<string, string> = {
    pdf: 'application/pdf',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    txt: 'text/plain; charset=utf-8',
  }

  const bucket = meta.is_premium ? 'pdfs-premium' : 'pdfs-public'
  const fileName = `${Date.now()}_${safeName || `document.${format}`}`

  // Upload Supabase Storage
  const { error: storageError } = await supabaseAdmin.storage
    .from(bucket)
    .upload(fileName, arrayBuffer, { contentType: contentTypeMap[format], upsert: false })

  if (storageError) {
    return NextResponse.json({ error: storageError.message }, { status: 500 })
  }

  const { data: { publicUrl } } = supabaseAdmin.storage.from(bucket).getPublicUrl(fileName)

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

  return NextResponse.json({ data: doc }, { status: 201 })
}
