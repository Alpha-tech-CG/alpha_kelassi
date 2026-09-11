import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAdmin, supabaseAdmin } from '@/lib/admin-guard'
import { isUuid } from '@/lib/query-validation'

const schema = z.object({ role: z.enum(['student', 'admin']) })

/**
 * PATCH /api/admin/users/:id/role — change le rôle d'un compte.
 * Remplace l'écriture directe depuis le navigateur (policy supprimée par la
 * migration 057). Un administrateur ne peut pas retirer son propre rôle.
 */
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin()
  if ('error' in guard) return guard.error
  const { id } = await params
  if (!isUuid(id)) return NextResponse.json({ error: { code: 'BAD_REQUEST' } }, { status: 400 })

  const parsed = schema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ error: { code: 'BAD_REQUEST', message: 'Rôle invalide.' } }, { status: 400 })
  if (id === guard.userId && parsed.data.role !== 'admin') {
    return NextResponse.json({ error: { code: 'FORBIDDEN', message: 'Tu ne peux pas retirer ton propre rôle d’administrateur.' } }, { status: 403 })
  }

  const { data, error } = await supabaseAdmin.from('users').update({ role: parsed.data.role }).eq('id', id).select('id, role').single()
  if (error) {
    console.error('[/api/admin/users/[id]/role]', error)
    return NextResponse.json({ error: { code: 'DB_ERROR', message: 'Une erreur est survenue, réessaie plus tard.' } }, { status: 500 })
  }
  return NextResponse.json({ data })
}
