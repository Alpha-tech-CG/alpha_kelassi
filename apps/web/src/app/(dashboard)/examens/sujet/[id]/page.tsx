import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getEntitlements } from '@/lib/subscription/server'
import { allowedExamModes } from '@alpha-kelassi/types'
import { isExamKind, parseBareme, PAPER_COLUMNS, type ExamKind, type Paper } from '@/lib/prepa'
import { SujetRunner, type PastResult } from './sujet-runner'

/** Un sujet rédigé de la Prépa : énoncé chronométré, puis corrigé et auto-notation au barème. */
export default async function SujetPage({ params, searchParams }: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ mode?: string }>
}) {
  const [{ id }, sp] = await Promise.all([params, searchParams])
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/login?next=${encodeURIComponent(`/examens/sujet/${id}`)}`)

  // Bac test / blanc / rouge : mode réservé à certaines formules (un sujet de Bac blanc
  // est en plus masqué par RLS sous la formule Pro).
  const mode: ExamKind = isExamKind(sp.mode) ? sp.mode : 'ancien_bac'
  if (mode !== 'ancien_bac') {
    const ent = await getEntitlements(user.id)
    if (!(allowedExamModes(ent.plan) as string[]).includes(mode)) redirect('/billing')
  }

  const { data } = await supabase.from('exercises')
    .select(`${PAPER_COLUMNS}, statement, chapters!inner(subject_id, subjects(name))`)
    .eq('id', id).not('exam_kind', 'is', null).maybeSingle()
  if (!data) notFound()
  const row = data as unknown as Paper & { statement: string; chapters: { subject_id: string; subjects: { name: string } | null } }

  const { data: res } = await supabase.from('exam_results')
    .select('total, max_total, created_at, mode').eq('user_id', user.id).eq('exercise_id', id)
    .order('created_at', { ascending: false }).limit(5)

  return (
    <SujetRunner
      paper={{ ...row, bareme: parseBareme(row.bareme) }}
      statement={row.statement}
      subjectId={row.chapters.subject_id}
      subjectName={row.chapters.subjects?.name ?? ''}
      mode={mode}
      past={(res ?? []) as unknown as PastResult[]}
    />
  )
}
