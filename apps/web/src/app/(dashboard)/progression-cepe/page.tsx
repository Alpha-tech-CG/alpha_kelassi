'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

/**
 * Progression : liste ordonnée (calendrier, migration 045) des chapitres
 * d'une matière, déblocage séquentiel. Fonctionne pour tout niveau ayant un
 * calendrier peuplé (CEPE, BEPC) — la matière affichée dépend du niveau réel
 * de l'élève (study_level_pref), pas d'un niveau figé.
 */

interface Subject { id: string; name: string }
interface ProgChapter {
  id: string; title: string; domain_id: string; domain_name: string; month_label: string | null
  total_lessons: number; completed_lessons: number; is_completed: boolean; is_unlocked: boolean
}

export default function ProgressionCepePage() {
  const router = useRouter()
  const supabase = createClient()
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [active, setActive] = useState<string | null>(null)
  const [chapters, setChapters] = useState<ProgChapter[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingList, setLoadingList] = useState(false)

  useEffect(() => {
    const initialSubject = new URLSearchParams(window.location.search).get('subject')
    ;(async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }
      const { data: profile } = await supabase.from('users').select('study_level_pref').eq('id', user.id).maybeSingle()
      const level = profile?.study_level_pref
      if (!level) { setLoading(false); return }
      const { data } = await supabase.from('subjects').select('id, name').eq('level', level).is('parent_subject_id', null).order('display_order').order('name')
      const rows = (data ?? []) as Subject[]
      setSubjects(rows)
      setActive(initialSubject ?? rows[0]?.id ?? null)
      setLoading(false)
    })()
  }, [supabase])

  const loadChapters = useCallback(async (subjectId: string) => {
    setLoadingList(true)
    const { data: { session } } = await supabase.auth.getSession()
    const res = await fetch(`/api/curriculum/progression?subject=${subjectId}`, { headers: { Authorization: `Bearer ${session?.access_token}` } })
    const json = await res.json().catch(() => ({}))
    setChapters(json?.data?.chapters ?? [])
    setLoadingList(false)
  }, [supabase])

  useEffect(() => { if (active) loadChapters(active) }, [active, loadChapters])

  if (loading) return <div className="flex justify-center py-20 text-gray-400">Chargement…</div>

  const nextIndex = chapters.findIndex((c) => c.is_unlocked && !c.is_completed)

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-black text-gray-900 mb-1">Progression</h1>
      <p className="text-gray-400 text-sm mb-6">Débloque les chapitres un par un, dans l&apos;ordre du programme.</p>

      <div className="flex gap-2 mb-6">
        {subjects.map((s) => (
          <button
            key={s.id}
            onClick={() => setActive(s.id)}
            className={`flex-1 py-2.5 rounded-full text-sm font-bold border transition-colors ${
              active === s.id ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-200 text-gray-600 hover:border-blue-200'
            }`}
          >
            {s.name}
          </button>
        ))}
      </div>

      {loadingList ? (
        <div className="text-center py-16 text-gray-400">Chargement…</div>
      ) : (
        <div className="space-y-0">
          {chapters.map((c, i) => {
            const isNext = i === nextIndex
            const pct = c.total_lessons ? Math.round((c.completed_lessons / c.total_lessons) * 100) : 0
            return (
              <div key={c.id} className="flex gap-3">
                <div className="flex flex-col items-center w-8 flex-shrink-0">
                  <div
                    className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-[11px] font-black ${
                      c.is_completed ? 'bg-blue-600 border-blue-600 text-white'
                      : isNext ? 'border-blue-600 text-blue-600 bg-white'
                      : 'border-gray-200 text-gray-400 bg-white'
                    }`}
                  >
                    {c.is_completed ? '✓' : !c.is_unlocked ? '🔒' : i + 1}
                  </div>
                  {i < chapters.length - 1 && <div className={`w-0.5 flex-1 min-h-[24px] my-0.5 ${c.is_completed ? 'bg-blue-600' : 'bg-gray-200'}`} />}
                </div>
                <button
                  disabled={!c.is_unlocked}
                  onClick={() => router.push(`/cours/matiere/${c.domain_id}/${c.id}`)}
                  className={`flex-1 flex items-center gap-3 rounded-xl border p-3 mb-3 text-left transition-all ${
                    !c.is_unlocked ? 'bg-gray-50 border-gray-100 cursor-not-allowed'
                    : isNext ? 'bg-white border-blue-300 shadow-sm hover:border-blue-400'
                    : 'bg-white border-gray-100 hover:border-blue-200 hover:shadow-sm'
                  }`}
                >
                  <span className="text-lg flex-shrink-0">📘</span>
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm font-semibold truncate ${!c.is_unlocked ? 'text-gray-400' : 'text-gray-900'}`}>{c.title}</p>
                    <p className="text-xs text-gray-400 truncate">
                      {c.domain_name}{c.month_label ? ` · ${c.month_label}` : ''}
                    </p>
                  </div>
                  {c.is_unlocked && c.total_lessons > 0 && <span className="text-xs font-bold text-blue-600 flex-shrink-0">{pct}%</span>}
                </button>
              </div>
            )
          })}
          {chapters.length === 0 && <p className="text-center text-gray-400 py-16">Aucun chapitre pour cette matière.</p>}
        </div>
      )}
    </div>
  )
}
