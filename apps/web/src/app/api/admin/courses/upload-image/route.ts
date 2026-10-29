import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin, supabaseAdmin } from '@/lib/admin-guard'

export const maxDuration = 30

/** POST /api/admin/courses/upload-image — upload une image dans le bucket public course-images */
export async function POST(req: NextRequest) {
  const guard = await requireAdmin()
  if ('error' in guard) return guard.error

  const form = await req.formData().catch(() => null)
  const file = form?.get('file')
  if (!(file instanceof File)) {
    return NextResponse.json({ error: { code: 'NO_FILE', message: 'Aucun fichier.' } }, { status: 400 })
  }
  // Liste blanche stricte : `image/*` laisserait passer image/svg+xml, qui est
  // rendu comme du HTML depuis un bucket public (XSS stockée).
  const ALLOWED = {
    'image/jpeg': 'jpg',
    'image/png':  'png',
    'image/webp': 'webp',
    'image/gif':  'gif',
  } as const
  const ext = ALLOWED[file.type as keyof typeof ALLOWED]
  if (!ext) {
    return NextResponse.json(
      { error: { code: 'BAD_TYPE', message: 'Formats acceptés : JPEG, PNG, WebP, GIF.' } },
      { status: 422 },
    )
  }
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: { code: 'TOO_BIG', message: 'Image trop lourde (max 5 Mo).' } }, { status: 422 })
  }

  // L'extension vient de la liste blanche, jamais du nom fourni par le client.
  const path = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`
  const buffer = Buffer.from(await file.arrayBuffer())

  const { error } = await supabaseAdmin.storage
    .from('course-images')
    .upload(path, buffer, { contentType: file.type, upsert: false })

  if (error) {

    console.error('[/api/admin/courses/upload-image]', error)

    return NextResponse.json({ error: { code: 'UPLOAD_ERROR', message: "Échec de l'envoi du fichier, réessaie plus tard." } }, { status: 500 })

  }

  const { data } = supabaseAdmin.storage.from('course-images').getPublicUrl(path)
  return NextResponse.json({ data: { url: data.publicUrl } }, { status: 201 })
}
