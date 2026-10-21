import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin, supabaseAdmin } from '@/lib/admin-guard'
import { z } from 'zod'
import { STUDY_LEVELS, LEVEL_META } from '@alpha-kelassi/types'
import { isUuid } from '@/lib/query-validation'

/**
 * Un même cours dans plusieurs séries (migration 060).
 *
 * Un chapitre « original » peut être publié dans la matière correspondante
 * d'autres séries : chaque série reçoit une copie liée, que la console tient à
 * jour automatiquement à chaque modification de l'original.
 */

const DB_ERROR = { code: 'DB_ERROR', message: 'Une erreur est survenue, réessaie plus tard.' }

interface Member { id: string; subject_id: string; source_chapter_id: string | null; subjects: { name: string; level: string } | null; lessons: { count: number }[] | null }

/** Racine du groupe : l'original si le chapitre est une copie. */
async function rootOf(id: string) {
  const { data } = await supabaseAdmin.from('chapters').select('id, title, subject_id, source_chapter_id').eq('id', id).maybeSingle()
  if (!data) return null
  return { chapter: data, rootId: (data.source_chapter_id as string | null) ?? (data.id as string) }
}

/** GET — l'original et toutes ses copies, avec leur série. */
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin()
  if ('error' in guard) return guard.error
  const { id } = await params

  const r = await rootOf(id)
  if (!r) return NextResponse.json({ error: { code: 'NOT_FOUND', message: 'Chapitre introuvable' } }, { status: 404 })

  const { data, error } = await supabaseAdmin.from('chapters')
    .select('id, subject_id, source_chapter_id, subjects(name, level), lessons(count)')
    .or(`id.eq.${r.rootId},source_chapter_id.eq.${r.rootId}`)
  if (error) {
    console.error('[/api/admin/curriculum/chapters/[id]/copies GET]', error)
    return NextResponse.json({ error: DB_ERROR }, { status: 500 })
  }

  const members = ((data ?? []) as unknown as Member[]).map((m) => ({
    chapter_id: m.id, subject_id: m.subject_id, is_original: m.id === r.rootId,
    subject_name: m.subjects?.name ?? '', level: m.subjects?.level ?? '',
    lesson_count: m.lessons?.[0]?.count ?? 0,
  })).sort((a, b) => Number(b.is_original) - Number(a.is_original) || a.level.localeCompare(b.level))

  return NextResponse.json({ data: { root_id: r.rootId, is_copy: r.chapter.id !== r.rootId, members } })
}

const postSchema = z.object({
  targets: z.array(z.union([
    z.object({ subject_id: z.string().uuid() }),
    // Matière absente de la série : créée avec ce nom.
    z.object({ level: z.enum(STUDY_LEVELS), subject_name: z.string().trim().min(2).max(120) }),
  ])).min(1).max(20),
})

/** POST — publie le cours dans d'autres séries (une copie liée par matière cible). */
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin()
  if ('error' in guard) return guard.error
  const { id } = await params

  let b: z.infer<typeof postSchema>
  try { b = postSchema.parse(await req.json()) }
  catch { return NextResponse.json({ error: { code: 'BAD_REQUEST', message: 'Choisis au moins une série.' } }, { status: 400 }) }

  const r = await rootOf(id)
  if (!r) return NextResponse.json({ error: { code: 'NOT_FOUND', message: 'Chapitre introuvable' } }, { status: 404 })

  const { data: srcSubject } = await supabaseAdmin.from('subjects')
    .select('id, name, level, country_code, icon, track_type').eq('id', r.chapter.subject_id).maybeSingle()

  const created: { level: string; subject_name: string; chapter_id: string }[] = []
  const failed: string[] = []

  for (const t of b.targets) {
    let subjectId: string | null = 'subject_id' in t ? t.subject_id : null
    let label = ''

    if (!subjectId && 'level' in t) {
      label = `${t.subject_name} (${t.level})`
      // Même nom déjà présent dans la série ? On le réutilise plutôt que de créer un doublon.
      const { data: existing } = await supabaseAdmin.from('subjects').select('id')
        .eq('level', t.level).ilike('name', t.subject_name).limit(1).maybeSingle()
      if (existing) subjectId = existing.id
      else {
        // Filière : celle de la série (générale ou technique), pas celle de la matière d'origine.
        const { data: ns, error: nsErr } = await supabaseAdmin.from('subjects').insert({
          name: t.subject_name, level: t.level,
          country_code: srcSubject?.country_code ?? 'CG', icon: srcSubject?.icon ?? null,
          track_type: LEVEL_META[t.level].track,
        }).select('id').single()
        if (nsErr || !ns) { console.error('[copies] création matière', nsErr); failed.push(label); continue }
        subjectId = ns.id
      }
    }
    if (!subjectId) continue

    const { data: newId, error } = await supabaseAdmin.rpc('copy_chapter_to_subject', { p_chapter: r.rootId, p_subject: subjectId })
    if (error) { console.error('[copies] copie', error); failed.push(label || subjectId); continue }

    const { data: sub } = await supabaseAdmin.from('subjects').select('name, level').eq('id', subjectId).maybeSingle()
    created.push({ level: sub?.level ?? '', subject_name: sub?.name ?? '', chapter_id: newId as string })
  }

  if (created.length === 0) {
    return NextResponse.json({ error: { code: 'COPY_FAILED', message: `Publication impossible${failed.length ? ` : ${failed.join(', ')}` : ''}.` } }, { status: 500 })
  }
  return NextResponse.json({ data: { created, failed } }, { status: 201 })
}

/** PUT — resynchronise toutes les copies depuis l'original. */
export async function PUT(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin()
  if ('error' in guard) return guard.error
  const { id } = await params

  const r = await rootOf(id)
  if (!r) return NextResponse.json({ error: { code: 'NOT_FOUND', message: 'Chapitre introuvable' } }, { status: 404 })

  const { data, error } = await supabaseAdmin.rpc('sync_chapter_copies', { p_chapter: r.rootId })
  if (error) {
    console.error('[/api/admin/curriculum/chapters/[id]/copies PUT]', error)
    return NextResponse.json({ error: DB_ERROR }, { status: 500 })
  }
  return NextResponse.json({ data: { synced: data ?? 0 } })
}

/** DELETE ?copyId= — délie une copie : elle devient un cours indépendant de sa série. */
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin()
  if ('error' in guard) return guard.error
  const { id } = await params
  const copyId = req.nextUrl.searchParams.get('copyId')
  if (!isUuid(copyId)) return NextResponse.json({ error: { code: 'BAD_REQUEST', message: 'copyId requis' } }, { status: 400 })

  const r = await rootOf(id)
  if (!r) return NextResponse.json({ error: { code: 'NOT_FOUND', message: 'Chapitre introuvable' } }, { status: 404 })

  const { error } = await supabaseAdmin.from('chapters').update({ source_chapter_id: null })
    .eq('id', copyId).eq('source_chapter_id', r.rootId)
  if (error) {
    console.error('[/api/admin/curriculum/chapters/[id]/copies DELETE]', error)
    return NextResponse.json({ error: DB_ERROR }, { status: 500 })
  }
  return NextResponse.json({ data: { detached: copyId } })
}
