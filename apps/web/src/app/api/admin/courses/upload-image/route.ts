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
  if (!file.type.startsWith('image/')) {
    return NextResponse.json({ error: { code: 'BAD_TYPE', message: 'Le fichier doit être une image.' } }, { status: 422 })
  }
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: { code: 'TOO_BIG', message: 'Image trop lourde (max 5 Mo).' } }, { status: 422 })
  }

  const ext = (file.name.split('.').pop() ?? 'jpg').replace(/[^a-zA-Z0-9]/g, '').slice(0, 5) || 'jpg'
  const path = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`
  const buffer = Buffer.from(await file.arrayBuffer())

  const { error } = await supabaseAdmin.storage
    .from('course-images')
    .upload(path, buffer, { contentType: file.type, upsert: false })

  if (error) return NextResponse.json({ error: { code: 'UPLOAD_ERROR', message: error.message } }, { status: 500 })

  const { data } = supabaseAdmin.storage.from('course-images').getPublicUrl(path)
  return NextResponse.json({ data: { url: data.publicUrl } }, { status: 201 })
}
