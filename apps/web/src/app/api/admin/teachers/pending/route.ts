import { NextResponse } from 'next/server'
import { requireAdmin, supabaseAdmin } from '@/lib/admin-guard'
import { signedUrl } from '@/lib/tutor'

/** GET /api/admin/teachers/pending — enseignants en attente + pièces (URLs signées). */
export async function GET() {
  const guard = await requireAdmin()
  if ('error' in guard) return guard.error

  const { data: profiles, error } = await supabaseAdmin.from('teacher_profiles')
    .select('user_id, school, id_doc_url, teaching_certificate_url, created_at, users(full_name, email, phone)')
    .eq('is_verified', false).order('created_at', { ascending: true }).limit(100)
  if (error) {
    console.error('[/api/admin/teachers/pending]', error)
    return NextResponse.json({ error: { code: 'DB_ERROR', message: 'Une erreur est survenue, réessaie plus tard.' } }, { status: 500 })
  }

  const data = await Promise.all((profiles ?? []).map(async (p: Record<string, unknown>) => ({
    ...p,
    id_doc_signed:   p['id_doc_url'] ? await signedUrl('teacher-documents', p['id_doc_url'] as string) : null,
    cert_doc_signed: p['teaching_certificate_url'] ? await signedUrl('teacher-documents', p['teaching_certificate_url'] as string) : null,
  })))
  return NextResponse.json({ data })
}
