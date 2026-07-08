import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin, supabaseAdmin } from '@/lib/admin-guard'

/** DELETE /api/admin/documents/:id — supprime le document + son fichier storage */
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin()
  if ('error' in guard) return guard.error
  const { id } = await params

  const { data: doc } = await supabaseAdmin
    .from('documents')
    .select('pdf_url, is_premium')
    .eq('id', id)
    .single()
  if (!doc) return NextResponse.json({ error: { code: 'NOT_FOUND', message: 'Introuvable' } }, { status: 404 })

  // Supprime le fichier du storage si présent
  const bucket = (doc as { is_premium: boolean }).is_premium ? 'pdfs-premium' : 'pdfs-public'
  const pdfUrl = (doc as { pdf_url: string | null }).pdf_url
  if (pdfUrl) {
    const fileName = pdfUrl.split('/').pop() ?? ''
    if (fileName) await supabaseAdmin.storage.from(bucket).remove([fileName])
  }

  const { error } = await supabaseAdmin.from('documents').delete().eq('id', id)
  if (error) return NextResponse.json({ error: { code: 'DB_ERROR', message: error.message } }, { status: 500 })
  return NextResponse.json({ data: { deleted: true } })
}
