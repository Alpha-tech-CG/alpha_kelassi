import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getEntitlements } from '@/lib/subscription/server'
import { allowedExamModes } from '@alpha-kelassi/types'
import { isExamKind, pickSimulationPaper, type PaperOrigin } from '@/lib/prepa'

/**
 * Simulation d'examen : choisit un sujet rédigé de la matière et y redirige.
 * Alternance sujet réel / sujet créé par Cognix d'après les copies déjà rendues
 * (`exam_results`) — voir `pickSimulationPaper`.
 */
export default async function SimulationPage({ searchParams }: { searchParams: Promise<{ rayon?: string; subject?: string }> }) {
  const { rayon, subject } = await searchParams
  const back = `/examens?rayon=${rayon ?? ''}&subject=${subject ?? ''}`
  if (!isExamKind(rayon) || rayon === 'ancien_bac' || !subject) redirect('/examens')

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/login?next=${encodeURIComponent(back)}`)
  const ent = await getEntitlements(user.id)
  if (!(allowedExamModes(ent.plan) as string[]).includes(rayon)) redirect('/billing')

  const { data: rows } = await supabase.from('exercises')
    .select('id, origin, chapters!inner(subject_id)')
    .not('exam_kind', 'is', null).is('deleted_at', null).eq('chapters.subject_id', subject)
  const papers = (rows ?? []) as unknown as { id: string; origin: PaperOrigin }[]
  if (papers.length === 0) redirect(back)

  const { data: res } = await supabase.from('exam_results')
    .select('exercise_id, created_at').eq('user_id', user.id).in('exercise_id', papers.map((p) => p.id))
  const id = pickSimulationPaper(papers, (res ?? []) as unknown as { exercise_id: string; created_at: string }[])
  redirect(id ? `/examens/sujet/${id}?mode=${rayon}` : back)
}
