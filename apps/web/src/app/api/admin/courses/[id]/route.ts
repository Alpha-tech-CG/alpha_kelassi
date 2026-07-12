import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin, supabaseAdmin } from '@/lib/admin-guard'
import { z } from 'zod'

/** GET /api/admin/courses/:id — cours complet avec O.G → O.S → contenu */
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin()
  if ('error' in guard) return guard.error
  const { id } = await params

  const { data: course, error } = await supabaseAdmin
    .from('courses')
    .select('id, subject_id, level, title, subtitle, is_premium, subjects(name)')
    .eq('id', id)
    .single()
  if (error) return NextResponse.json({ error: { code: 'NOT_FOUND', message: error.message } }, { status: 404 })

  const { data: objectives } = await supabaseAdmin
    .from('course_objectives')
    .select('id, title, position, course_lessons(id, title, content, position)')
    .eq('course_id', id)
    .order('position', { ascending: true })

  const og = (objectives ?? []).map((o: Record<string, unknown>) => ({
    id: o['id'],
    title: o['title'],
    position: o['position'],
    lessons: ((o['course_lessons'] as Record<string, unknown>[] | null) ?? [])
      .sort((a, b) => (a['position'] as number) - (b['position'] as number))
      .map((l) => ({ id: l['id'], title: l['title'], content: l['content'] ?? [], position: l['position'] })),
  }))

  return NextResponse.json({
    data: {
      ...course,
      subject_name: (course as { subjects?: { name?: string } }).subjects?.name ?? null,
      objectives: og,
    },
  })
}

// ── Sauvegarde de l'arbre complet ────────────────────────────────────────────
const blockSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('subtitle'), text: z.string().max(300) }),
  z.object({ type: z.literal('paragraph'), text: z.string().max(20000) }),
  z.object({ type: z.literal('image'), url: z.string().url(), caption: z.string().max(300).optional() }),
])

const saveSchema = z.object({
  title: z.string().min(3).max(200),
  subtitle: z.string().max(300).nullish(),
  is_premium: z.boolean().optional(),
  objectives: z.array(z.object({
    title: z.string().min(1).max(300),
    lessons: z.array(z.object({
      title: z.string().min(1).max(300),
      content: z.array(blockSchema).default([]),
    })).default([]),
  })).default([]),
})

/**
 * PUT /api/admin/courses/:id — remplace tout l'arbre du cours.
 * Stratégie simple : on met à jour le cours, on supprime les O.G existants
 * (cascade sur les O.S) puis on réinsère depuis le payload.
 */
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin()
  if ('error' in guard) return guard.error
  const { id } = await params

  let body: z.infer<typeof saveSchema>
  try { body = saveSchema.parse(await req.json()) }
  catch (e) { return NextResponse.json({ error: { code: 'BAD_BODY', message: (e as Error).message } }, { status: 400 }) }

  const { error: upErr } = await supabaseAdmin
    .from('courses')
    .update({
      title: body.title.trim(),
      subtitle: body.subtitle?.trim() || null,
      ...(body.is_premium !== undefined ? { is_premium: body.is_premium } : {}),
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
  if (upErr) return NextResponse.json({ error: { code: 'DB_ERROR', message: upErr.message } }, { status: 500 })

  // Purge des O.G existants (cascade → O.S)
  await supabaseAdmin.from('course_objectives').delete().eq('course_id', id)

  // Réinsertion
  for (let oi = 0; oi < body.objectives.length; oi++) {
    const o = body.objectives[oi]!
    const { data: og, error: ogErr } = await supabaseAdmin
      .from('course_objectives')
      .insert({ course_id: id, title: o.title.trim(), position: oi })
      .select('id')
      .single()
    if (ogErr || !og) return NextResponse.json({ error: { code: 'DB_ERROR', message: ogErr?.message } }, { status: 500 })

    if (o.lessons.length > 0) {
      const rows = o.lessons.map((l, li) => ({
        objective_id: (og as { id: string }).id,
        title: l.title.trim(),
        content: l.content,
        position: li,
      }))
      const { error: lErr } = await supabaseAdmin.from('course_lessons').insert(rows)
      if (lErr) return NextResponse.json({ error: { code: 'DB_ERROR', message: lErr.message } }, { status: 500 })
    }
  }

  return NextResponse.json({ data: { saved: true } })
}

/** DELETE /api/admin/courses/:id */
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin()
  if ('error' in guard) return guard.error
  const { id } = await params
  const { error } = await supabaseAdmin.from('courses').delete().eq('id', id)
  if (error) return NextResponse.json({ error: { code: 'DB_ERROR', message: error.message } }, { status: 500 })
  return NextResponse.json({ data: { deleted: true } })
}
