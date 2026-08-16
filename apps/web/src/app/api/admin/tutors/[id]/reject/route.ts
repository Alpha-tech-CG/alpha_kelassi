import { NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAdmin } from '@/lib/admin-guard'
import { admin } from '@/lib/tutor'

const schema = z.object({ reason: z.string().min(3).max(300) })

/** POST /api/admin/tutors/:id/reject — rejeter avec motif. */
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin()
  if ('error' in guard) return guard.error
  const { id } = await params

  try { schema.parse(await req.json()) }
  catch { return NextResponse.json({ error: { code: 'BAD_REQUEST' } }, { status: 400 }) }

  const { data, error } = await admin().from('tutor_profiles')
    .update({ is_verified: false, is_active: false }).eq('user_id', id).select('user_id').maybeSingle()
  if (error) return NextResponse.json({ error: { code: 'DB_ERROR', message: error.message } }, { status: 500 })
  if (!data) return NextResponse.json({ error: { code: 'NOT_FOUND' } }, { status: 404 })

  return NextResponse.json({ data: { ok: true } })
}
