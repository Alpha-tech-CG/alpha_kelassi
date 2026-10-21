import { NextResponse } from 'next/server'
import { requireAdmin, supabaseAdmin } from '@/lib/admin-guard'

/** GET /api/admin/moderation — signalements ouverts (message + motif + auteurs). */
export async function GET() {
  const guard = await requireAdmin()
  if ('error' in guard) return guard.error

  const { data: flags, error } = await supabaseAdmin.from('moderation_flags')
    .select('id, reason, status, created_at, message_id, flagged_user_id, reporter_id, group_messages(content, ai_blocked, group_id)')
    .eq('status', 'open').order('created_at', { ascending: false }).limit(200)
  if (error) {
    console.error('[/api/admin/moderation]', error)
    return NextResponse.json({ error: { code: 'DB_ERROR', message: 'Une erreur est survenue, réessaie plus tard.' } }, { status: 500 })
  }

  // Résout les noms (service role → bypass RLS).
  const ids = Array.from(new Set((flags ?? []).flatMap((f: Record<string, unknown>) =>
    [f['flagged_user_id'], f['reporter_id']].filter(Boolean) as string[])))
  const nameById = new Map<string, string>()
  if (ids.length) {
    const { data: users } = await supabaseAdmin.from('users').select('id, full_name').in('id', ids)
    for (const u of (users ?? []) as { id: string; full_name: string | null }[]) nameById.set(u.id, u.full_name ?? '—')
  }

  const data = (flags ?? []).map((f: Record<string, unknown>) => {
    const gm = f['group_messages'] as { content?: string; ai_blocked?: boolean } | null
    return {
      id: f['id'], reason: f['reason'], created_at: f['created_at'],
      content: gm?.content ?? null, ai_blocked: gm?.ai_blocked ?? null,
      flagged_name: f['flagged_user_id'] ? (nameById.get(f['flagged_user_id'] as string) ?? '—') : null,
      reporter_name: f['reporter_id'] ? (nameById.get(f['reporter_id'] as string) ?? '—') : null,
    }
  })
  return NextResponse.json({ data })
}
