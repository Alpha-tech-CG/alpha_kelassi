import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin, supabaseAdmin } from '@/lib/admin-guard'
import { z } from 'zod'

/**
 * Corbeille de la console (migration 058).
 *
 * Supprimer une épreuve, un QCM ou un exercice ne fait que poser `deleted_at` :
 * l'élément disparaît pour les élèves (RLS) mais se restaure ici, avec ses
 * questions, son corrigé et l'historique des élèves. La suppression définitive
 * — qui, elle, efface tout en cascade — ne se fait que depuis la corbeille.
 */

const DB_ERROR = { code: 'DB_ERROR', message: 'Une erreur est survenue, réessaie plus tard.' }

/** GET /api/admin/corbeille — éléments supprimés, du plus récent au plus ancien. */
export async function GET() {
  const guard = await requireAdmin()
  if ('error' in guard) return guard.error

  const [quizzes, exercises] = await Promise.all([
    supabaseAdmin.from('quizzes')
      .select('id, title, level, is_exam, exam_kind, year, chapter_id, deleted_at, subjects(name), quiz_questions(count)')
      .not('deleted_at', 'is', null).order('deleted_at', { ascending: false }).limit(300),
    supabaseAdmin.from('exercises')
      .select('id, title, deleted_at, chapters(title, subjects(name, level))')
      .not('deleted_at', 'is', null).order('deleted_at', { ascending: false }).limit(300),
  ])
  const err = quizzes.error ?? exercises.error
  if (err) {
    console.error('[/api/admin/corbeille GET]', err)
    return NextResponse.json({ error: DB_ERROR }, { status: 500 })
  }

  const items = [
    ...(quizzes.data ?? []).map((q) => ({
      kind: 'quiz' as const, id: q.id, title: q.title, deleted_at: q.deleted_at,
      type_label: q.is_exam ? 'Épreuve' : q.chapter_id ? 'QCM de chapitre' : 'QCM',
      exam_kind: q.exam_kind, year: q.year, level: q.level,
      subject: (q.subjects as unknown as { name: string } | null)?.name ?? null,
      detail: `${(q.quiz_questions as unknown as { count: number }[] | null)?.[0]?.count ?? 0} question(s)`,
    })),
    ...(exercises.data ?? []).map((e) => {
      const ch = e.chapters as unknown as { title: string; subjects: { name: string; level: string } | null } | null
      return {
        kind: 'exercise' as const, id: e.id, title: e.title, deleted_at: e.deleted_at,
        type_label: 'Exercice (TD)', exam_kind: null, year: null, level: ch?.subjects?.level ?? null,
        subject: ch?.subjects?.name ?? null, detail: ch ? `Chapitre « ${ch.title} »` : '',
      }
    }),
  ].sort((a, b) => String(b.deleted_at).localeCompare(String(a.deleted_at)))

  return NextResponse.json({ data: items })
}

const actionSchema = z.object({
  kind:   z.enum(['quiz', 'exercise']),
  id:     z.string().uuid(),
  action: z.enum(['restore', 'purge']),
})

/** POST /api/admin/corbeille — restaure ou supprime définitivement un élément. */
export async function POST(req: NextRequest) {
  const guard = await requireAdmin()
  if ('error' in guard) return guard.error

  let b: z.infer<typeof actionSchema>
  try { b = actionSchema.parse(await req.json()) }
  catch { return NextResponse.json({ error: { code: 'BAD_REQUEST', message: 'Corps invalide' } }, { status: 400 }) }

  const table = b.kind === 'quiz' ? 'quizzes' : 'exercises'

  if (b.action === 'restore') {
    const { error } = await supabaseAdmin.from(table).update({ deleted_at: null }).eq('id', b.id)
    if (error) {
      // 23505 : le chapitre a reçu un nouveau QCM entre-temps (un seul par chapitre).
      if ((error as { code?: string }).code === '23505') {
        return NextResponse.json({ error: { code: 'CONFLICT', message: 'Ce chapitre a déjà un autre QCM : supprime-le d\'abord pour restaurer celui-ci.' } }, { status: 409 })
      }
      console.error('[/api/admin/corbeille restore]', error)
      return NextResponse.json({ error: DB_ERROR }, { status: 500 })
    }
    return NextResponse.json({ data: { id: b.id, restored: true } })
  }

  // Suppression définitive : uniquement ce qui est déjà dans la corbeille.
  const { error } = await supabaseAdmin.from(table).delete().eq('id', b.id).not('deleted_at', 'is', null)
  if (error) {
    console.error('[/api/admin/corbeille purge]', error)
    return NextResponse.json({ error: DB_ERROR }, { status: 500 })
  }
  return NextResponse.json({ data: { id: b.id, purged: true } })
}
