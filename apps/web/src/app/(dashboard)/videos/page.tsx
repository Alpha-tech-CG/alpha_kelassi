'use client'

import { useEffect, useState } from 'react'
import { PlayCircle, Crown, X } from 'lucide-react'

interface Video {
  id: string
  title: string
  description: string | null
  level: string
  provider: 'youtube' | 'vimeo'
  external_id: string
  url: string
  duration_sec: number | null
  thumbnail_url: string | null
  is_premium: boolean
  subjects: { name: string } | null
}

function embedUrl(v: Video): string {
  return v.provider === 'youtube'
    ? `https://www.youtube-nocookie.com/embed/${v.external_id}?rel=0`
    : `https://player.vimeo.com/video/${v.external_id}`
}

function fmtDuration(sec: number | null): string {
  if (!sec) return ''
  const m = Math.floor(sec / 60)
  return `${m} min`
}

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [active, setActive] = useState<Video | null>(null)

  useEffect(() => {
    fetch('/api/videos', { credentials: 'include' })
      .then((r) => r.json())
      .then((j) => { setVideos(j.data ?? []); setLoading(false) })
  }, [])

  if (loading) return <div className="p-6 text-gray-500">Chargement des vidéos…</div>

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      <header className="flex items-center gap-3">
        <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center">
          <PlayCircle className="w-5 h-5 text-white" strokeWidth={2} />
        </div>
        <div>
          <h1 className="text-2xl font-black text-gray-900">Cours vidéo</h1>
          <p className="text-sm text-gray-500">Regarde, révise, à ton rythme.</p>
        </div>
      </header>

      {videos.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <PlayCircle className="w-10 h-10 mx-auto mb-3" strokeWidth={1.5} />
          <p>Aucune vidéo disponible pour le moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map((v) => (
            <button
              key={v.id}
              onClick={() => setActive(v)}
              className="text-left bg-white border rounded-2xl overflow-hidden hover:border-red-300 hover:shadow-sm transition"
            >
              <div className="relative aspect-video bg-gray-100">
                {v.thumbnail_url
                  // eslint-disable-next-line @next/next/no-img-element
                  ? <img src={v.thumbnail_url} alt="" className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center"><PlayCircle className="w-10 h-10 text-gray-300" /></div>}
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition">
                  <PlayCircle className="w-12 h-12 text-white" strokeWidth={1.5} />
                </div>
                {v.duration_sec && (
                  <span className="absolute bottom-2 right-2 text-xs bg-black/70 text-white px-1.5 py-0.5 rounded">{fmtDuration(v.duration_sec)}</span>
                )}
              </div>
              <div className="p-3">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 flex-1">{v.title}</h3>
                  {v.is_premium && <Crown className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {v.subjects?.name ? `${v.subjects.name} · ` : ''}{v.level.replace('_', ' ').toUpperCase()}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Lecteur modal */}
      {active && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setActive(null)}
        >
          <div className="w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-white font-semibold truncate pr-4">{active.title}</h2>
              <button onClick={() => setActive(null)} aria-label="Fermer" className="text-white/80 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="aspect-video bg-black rounded-xl overflow-hidden">
              <iframe
                src={embedUrl(active)}
                title={active.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            {active.description && <p className="text-sm text-gray-300 mt-3">{active.description}</p>}
          </div>
        </div>
      )}
    </div>
  )
}
