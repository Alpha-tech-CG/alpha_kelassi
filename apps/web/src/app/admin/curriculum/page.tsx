import Link from 'next/link'
import { supabaseAdmin } from '@/lib/admin-guard'

/** Hub curriculum : matières → chapitres, + accès gestion des séries. (Layout admin déjà protégé.) */

async function safe<T>(p: PromiseLike<{ data: T[] | null }>): Promise<T[]> {
  try { const { data } = await p; return data ?? [] } catch { return [] }
}

const TRACKS = [
  { value: 'generale', label: 'Générale' },
  { value: 'technique', label: 'Technique' },
  { value: 'professionnel', label: 'Professionnel' },
] as const

export default async function CurriculumHubPage() {
  const [subjects, chapters, series] = await Promise.all([
    safe<{ id: string; name: string; level: string; track_type: string; icon: string | null }>(
      supabaseAdmin.from('subjects').select('id, name, level, track_type, icon').order('name')),
    safe<{ id: string; subject_id: string }>(supabaseAdmin.from('chapters').select('id, subject_id')),
    safe<{ id: string }>(supabaseAdmin.from('series').select('id')),
  ])

  const chapCount = chapters.reduce<Record<string, number>>((a, c) => { a[c.subject_id] = (a[c.subject_id] ?? 0) + 1; return a }, {})

  return (
    <div className="px-8 py-8 max-w-5xl">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Curriculum structuré</h1>
          <p className="text-gray-500 text-sm mt-1">Chapitres et leçons (cours · résumé · quiz · vidéo) par matière.</p>
        </div>
        <Link href="/admin/curriculum/series" className="px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-gray-800">
          Gérer les séries ({series.length})
        </Link>
      </div>

      {subjects.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400">
          Aucune matière. Crée d'abord des matières dans « Matières ».
        </div>
      ) : (
        <div className="space-y-6">
          {TRACKS.map((track) => {
            const byTrack = subjects.filter((s) => s.track_type === track.value)
            if (byTrack.length === 0) return null
            return (
              <div key={track.value}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-black text-green-700 bg-green-50 px-2.5 py-1 rounded-full uppercase">{track.label}</span>
                  <span className="text-xs text-gray-400">{byTrack.length} matière{byTrack.length > 1 ? 's' : ''}</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {byTrack.map((s) => (
                    <Link key={s.id} href={`/admin/curriculum/subject/${s.id}`}
                      className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3 flex items-center gap-3 hover:border-green-300 transition-all">
                      <span className="text-2xl w-9 text-center">{s.icon ?? '📘'}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{s.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{s.level.replaceAll('_', ' ')} · {chapCount[s.id] ?? 0} chapitre{(chapCount[s.id] ?? 0) > 1 ? 's' : ''}</p>
                      </div>
                      <span className="text-gray-300">›</span>
                    </Link>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
