import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-guard'
import { createClient as createAdminClient } from '@supabase/supabase-js'

const supabaseAdmin = createAdminClient(
  process.env['NEXT_PUBLIC_SUPABASE_URL']!,
  process.env['SUPABASE_SERVICE_ROLE_KEY']!
)

export async function GET(req: NextRequest) {
  const guard = await requireAdmin()   // liste blanche d'e-mails + rôle admin
  if ('error' in guard) return guard.error

  const { searchParams } = new URL(req.url)
  const filename = searchParams.get('filename') ?? 'document.pdf'
  const isPremium = searchParams.get('premium') === 'true'

  if (filename.length > 200) {
    return NextResponse.json({ error: 'Nom de fichier trop long' }, { status: 400 })
  }

  // Liste blanche d'extensions : l'URL pré-signée ne doit jamais permettre
  // de déposer un type exécutable ou rendu (html, svg…) dans un bucket public.
  const ALLOWED_EXT = ['pdf', 'docx', 'txt'] as const
  const ext = (filename.split('.').pop() ?? '').toLowerCase()
  if (!(ALLOWED_EXT as readonly string[]).includes(ext)) {
    return NextResponse.json(
      { error: 'Extension non autorisée (pdf, docx ou txt uniquement)' },
      { status: 422 },
    )
  }

  const safeName = filename
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/\.{2,}/g, '_')
    .replace(/^[._]+/, '')
    .slice(0, 100)

  const bucket = isPremium ? 'pdfs-premium' : 'pdfs-public'
  const storagePath = `${Date.now()}_${safeName}`

  const { data, error } = await supabaseAdmin.storage
    .from(bucket)
    .createSignedUploadUrl(storagePath)

  if (error || !data) {
    console.error('[/api/admin/documents/presign]', error?.message)
    return NextResponse.json({ error: 'Préparation du téléversement impossible.' }, { status: 500 })
  }

  return NextResponse.json({ signedUrl: data.signedUrl, path: storagePath, bucket })
}
