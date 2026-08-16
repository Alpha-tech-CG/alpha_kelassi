import { createClient } from '@/lib/supabase/server'
import { getCurrentCalendarState } from '@/lib/academic-calendar'
import Link from 'next/link'
import { redirect } from 'next/navigation'

/**
 * Calendrier scolaire CEPE (migration 045) : mois courant, chapitres du mois,
 * session de révision pondérée, et composition du trimestre.
 */

interface ChapterRow {
  id: string
  chapter_id: string
  subject_id: string
  chapters: { id: string; title: string } | null
  subjects: { id: string; name: string } | null
}

async function safe<T>(p: PromiseLike<{ data: T[] | null; error: unknown }>): Promise<T[]> {
  try { const { data } = await p; return data ?? [] } catch { return [] }
}

export default async function CalendrierPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('users').select('study_level_pref').eq('id', user.id).maybeSingle()
  if (profile?.study_level_pref !== 'cepe') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-4xl mb-3">📅</p>
        <h1 className="text-xl font-bold text-gray-900 mb-2">Calendrier scolaire</h1>
        <p className="text-gray-500">Le calendrier scolaire n'est disponible que pour le niveau CEPE pour l'instant.</p>
      </div>
    )
  }

  const calendar = await getCurrentCalendarState(supabase, 'cepe', 'CG')

  let thisMonth: ChapterRow[] = []
  let unlockedIds: string[] = []
  if (calendar?.month) {
    const { data: months } = await supabase
      .from('school_months').select('id, end_date').lte('end_date', calendar.month.end_date)
    unlockedIds = (months ?? []).map((m) => m.id)

    thisMonth = await safe<ChapterRow>(
      supabase.from('curriculum_items')
        .select('id, chapter_id, subject_id, chapters(id, title), subjects(id, name)')
        .eq('item_type', 'chapter').eq('school_month_id', calendar.month.id).order('order_index')
    )
  }

  // Session de révision : mêmes calculs que l'API, en direct (server component).
  let revision: (ChapterRow & { weakness_score: number })[] = []
  if (unlockedIds.length > 0) {
    const candidates = await safe<ChapterRow>(
      supabase.from('curriculum_items')
        .select('id, chapter_id, subject_id, chapters(id, title), subjects(id, name)')
        .eq('item_type', 'chapter').in('school_month_id', unlockedIds)
    )
    const reviews = await safe<{ curriculum_item_id: string; score_best: number | null; next_review_at: string | null }>(
      candidates.length
        ? supabase.from('curriculum_item_review').select('curriculum_item_id, score_best, next_review_at')
            .eq('user_id', user.id).in('curriculum_item_id', candidates.map((c) => c.id))
        : Promise.resolve({ data: [], error: null })
    )
    const reviewByItem = new Map(reviews.map((r) => [r.curriculum_item_id, r]))
    const now = Date.now()
    const scored = candidates.map((item) => {
      const r = reviewByItem.get(item.id)
      const overdueDays = r?.next_review_at ? Math.max(0, (now - new Date(r.next_review_at).getTime()) / 86_400_000) : 999
      const weakness = r?.score_best != null ? 100 - r.score_best : 80
      const weight = weakness * 0.6 + Math.min(overdueDays, 30) * (100 / 30) * 0.4
      return { item, weakness, key: Math.pow(Math.random(), 1 / Math.max(weight, 0.01)) }
    })
    scored.sort((a, b) => b.key - a.key)
    revision = scored.slice(0, 8).map((s) => ({ ...s.item, weakness_score: Math.round(s.weakness) }))
  }

  // Composition du trimestre : QCM dédié, sinon annale CEPE suggérée.
  let examSuggestion: { id: string; title: string; is_dedicated: boolean } | null = null
  if (calendar?.term) {
    const { data: dedicated } = await supabase
      .from('quizzes').select('id, title').eq('is_term_exam', true).eq('default_term_id', calendar.term.id).maybeSingle()
    if (dedicated) {
      examSuggestion = { ...dedicated, is_dedicated: true }
    } else {
      const { data: attempted } = await supabase.from('quiz_attempts').select('quiz_id').eq('user_id', user.id)
      const attemptedIds = new Set((attempted ?? []).map((a) => a.quiz_id))
      const annales = await safe<{ id: string; title: string }>(
        supabase.from('quizzes').select('id, title').eq('level', 'cepe').eq('is_exam', true)
      )
      const pool = annales.filter((q) => !attemptedIds.has(q.id))
      const chosen = (pool.length > 0 ? pool : annales)[Math.floor(Math.random() * Math.max(1, (pool.length > 0 ? pool : annales).length))]
      if (chosen) examSuggestion = { ...chosen, is_dedicated: false }
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-black text-gray-900 mb-1">Calendrier scolaire</h1>
      <p className="text-gray-400 text-sm mb-6">Programme CEPE {calendar?.year?.label ?? ''}</p>

      <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl px-6 py-5 mb-8 shadow-sm">
        <p className="text-white text-xl font-black">{calendar?.month?.label ?? '—'}</p>
        <p className="text-blue-100 text-sm mt-1">{calendar?.term?.label ?? ''}</p>
        {calendar?.is_holiday && <p className="text-blue-200 text-xs mt-3">🏖️ Hors période scolaire — dernier mois affiché</p>}
      </div>

      <Section title="Ce mois-ci" empty="Rien de programmé pour ce mois.">
        {thisMonth.map((it) => <ChapterCard key={it.id} item={it} />)}
      </Section>

      <Section title="À réviser" empty="Rien à réviser pour l'instant — continue comme ça !">
        {revision.map((it) => (
          <ChapterCard key={it.id} item={it} badge={it.weakness_score >= 50 ? '⚠️ À revoir' : '🔁 Entretien'} />
        ))}
      </Section>

      <div className="mb-8">
        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Prochain examen</h2>
        {examSuggestion ? (
          <Link
            href={`/quiz/${examSuggestion.id}`}
            className="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:border-blue-200 hover:shadow-md transition-all"
          >
            <span className="text-2xl">📝</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">{examSuggestion.title}</p>
              <p className="text-xs text-gray-400 mt-0.5">{examSuggestion.is_dedicated ? 'Composition du trimestre' : 'Annale suggérée'}</p>
            </div>
            <span className="text-gray-300">→</span>
          </Link>
        ) : (
          <p className="text-sm text-gray-400">Pas encore de composition programmée ce trimestre.</p>
        )}
      </div>
    </div>
  )
}

function Section({ title, empty, children }: { title: string; empty: string; children: React.ReactNode }) {
  const items = Array.isArray(children) ? children : [children]
  const hasItems = items.some(Boolean) && items.flat().length > 0
  return (
    <div className="mb-8">
      <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">{title}</h2>
      {hasItems ? <div className="grid sm:grid-cols-2 gap-3">{children}</div> : <p className="text-sm text-gray-400">{empty}</p>}
    </div>
  )
}

function ChapterCard({ item, badge }: { item: ChapterRow; badge?: string }) {
  return (
    <Link
      href={`/cours/matiere/${item.subject_id}/${item.chapter_id}`}
      className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 p-4 hover:border-blue-200 hover:shadow-sm transition-all"
    >
      <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 text-lg">
        📘
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-gray-900 truncate">{item.chapters?.title ?? '—'}</p>
        <p className="text-xs text-gray-400 truncate">{item.subjects?.name ?? ''}</p>
      </div>
      {badge && <span className="text-xs font-bold text-blue-600 flex-shrink-0">{badge}</span>}
    </Link>
  )
}
