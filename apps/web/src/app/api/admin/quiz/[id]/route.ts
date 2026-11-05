import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin, supabaseAdmin } from '@/lib/admin-guard'
import { syncAfterChange } from '@/lib/chapter-copies'

/** DELETE /api/admin/quiz/:id — place le QCM dans la corbeille (restaurable, migration 058) */
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin()
  if ('error' in guard) return guard.error
  const { id } = await params
  const { error } = await supabaseAdmin.from('quizzes').update({ deleted_at: new Date().toISOString() }).eq('id', id).is('deleted_at', null)
  if (error) {
    console.error('[/api/admin/quiz/[id]]', error)
    return NextResponse.json({ error: { code: 'DB_ERROR', message: 'Une erreur est survenue, réessaie plus tard.' } }, { status: 500 })
  }
  await syncAfterChange({ quizId: id })
  return NextResponse.json({ data: { deleted: true } })
}
