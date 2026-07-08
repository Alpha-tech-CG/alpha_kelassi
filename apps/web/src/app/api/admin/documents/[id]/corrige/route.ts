import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin, supabaseAdmin } from '@/lib/admin-guard'

export const maxDuration = 60

/** PATCH /api/admin/documents/:id/corrige — attache un PDF de corrigé au document */
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin()
  if ('error' in guard) return guard.error
  const { id } = await params

  const { data: doc } = await supabaseAdmin
    .from('documents')
    .select('id, is_premium')
    .eq('id', id)
    .single()
  if (!doc) return NextResponse.json({ error: { code: 'NOT_FOUND', message: 'Document introuvable' } }, { status: 404 })

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  if (!file) return NextResponse.json({ error: { code: 'BAD_REQUEST', message: 'Fichier requis' } }, { status: 400 })

  // Vérifie les magic bytes PDF (%PDF)
  const headerBytes = new Uint8Array(await file.slice(0, 4).arrayBuffer())
  if (!String.fromCharCode(...headerBytes).startsWith('%PDF')) {
    return NextResponse.json({ error: { code: 'INVALID_FILE', message: 'Le fichier doit être un PDF valide' } }, { status: 400 })
  }

  const safeName = file.name
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/\.{2,}/g, '_')
    .replace(/^[._]+/, '')
    .slice(0, 100)

  const bucket = (doc as { is_premium: boolean }).is_premium ? 'pdfs-premium' : 'pdfs-public'
  const fileName = `corrige_${Date.now()}_${safeName || 'corrige.pdf'}`
  const arrayBuffer = await file.arrayBuffer()

  const { error: storageError } = await supabaseAdmin.storage
    .from(bucket)
    .upload(fileName, arrayBuffer, { contentType: 'application/pdf', upsert: false })
  if (storageError) return NextResponse.json({ error: { code: 'UPLOAD_ERROR', message: storageError.message } }, { status: 500 })

  const { data: { publicUrl } } = supabaseAdmin.storage.from(bucket).getPublicUrl(fileName)

  const { data, error } = await supabaseAdmin
    .from('documents')
    .update({ corrige_url: publicUrl })
    .eq('id', id)
    .select()
    .single()
  if (error) return NextResponse.json({ error: { code: 'DB_ERROR', message: error.message } }, { status: 500 })
  return NextResponse.json({ data })
}
