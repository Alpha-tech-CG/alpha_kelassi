import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-guard'
import { admin, signedUrl } from '@/lib/tutor'

/** GET /api/admin/tutors/pending — tuteurs en attente + pièces (URLs signées). */
export async function GET() {
  const guard = await requireAdmin()
  if ('error' in guard) return guard.error

  const { data: profiles, error } = await admin().from('tutor_profiles')
    .select('user_id, bio, id_doc_url, bac_doc_url, created_at, users(full_name, email, phone)')
    .eq('is_verified', false).order('created_at', { ascending: true }).limit(100)
  if (error) {
    console.error('[/api/admin/tutors/pending]', error)
    return NextResponse.json({ error: { code: 'DB_ERROR', message: 'Une erreur est survenue, réessaie plus tard.' } }, { status: 500 })
  }

  const data = await Promise.all((profiles ?? []).map(async (p) => ({
    ...p,
    id_doc_signed:  p.id_doc_url ? await signedUrl('tutor-documents', p.id_doc_url) : null,
    bac_doc_signed: p.bac_doc_url ? await signedUrl('tutor-documents', p.bac_doc_url) : null,
  })))
  return NextResponse.json({ data })
}
