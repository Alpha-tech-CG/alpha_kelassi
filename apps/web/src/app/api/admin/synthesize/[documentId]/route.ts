import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'

export const maxDuration = 10

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ documentId: string }> },
) {
  const { documentId } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  // Vérifie rôle admin
  const admin = createAdminClient(
    process.env['NEXT_PUBLIC_SUPABASE_URL']!,
    process.env['SUPABASE_SERVICE_ROLE_KEY']!,
  )
  const { data: profile } = await admin
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
  }

  const body   = await req.json().catch(() => ({}))
  const apiUrl = process.env['INTERNAL_API_URL'] ?? 'http://localhost:3001'
  const secret = process.env['INTERNAL_API_SECRET'] ?? ''

  const res = await fetch(`${apiUrl}/api/admin/synthesize/${documentId}`, {
    method:  'POST',
    headers: {
      'Content-Type':      'application/json',
      'x-internal-token':  secret,
    },
    body: JSON.stringify({ level: body.level }),
  })

  const data = await res.json()
  if (!res.ok) return NextResponse.json(data, { status: res.status })

  return NextResponse.json(data)
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ documentId: string }> },
) {
  const { documentId } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  // Lit le statut directement depuis Supabase (pas besoin de passer par l'API)
  const { data: chapters } = await supabase
    .from('course_chapters')
    .select('id, chapter_number, title, status')
    .eq('document_id', documentId)
    .order('chapter_number')

  const total  = chapters?.length ?? 0
  const done   = chapters?.filter((c) => c.status === 'done').length ?? 0
  const errors = chapters?.filter((c) => c.status === 'error').length ?? 0

  return NextResponse.json({ chapters: chapters ?? [], stats: { total, done, errors } })
}
