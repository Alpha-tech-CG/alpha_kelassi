import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { z } from 'zod'

const supabaseAdmin = createAdminClient(
  process.env['NEXT_PUBLIC_SUPABASE_URL']!,
  process.env['SUPABASE_SERVICE_ROLE_KEY']!
)

/** Extrait le provider + l'ID externe d'une URL YouTube ou Vimeo */
function parseVideoUrl(url: string): { provider: 'youtube' | 'vimeo'; external_id: string } | null {
  try {
    const u = new URL(url)
    const host = u.hostname.replace(/^www\./, '')
    if (host === 'youtu.be') {
      const id = u.pathname.slice(1)
      return id ? { provider: 'youtube', external_id: id } : null
    }
    if (host === 'youtube.com' || host === 'm.youtube.com') {
      const id = u.searchParams.get('v') ?? (u.pathname.startsWith('/shorts/') ? u.pathname.split('/')[2] : null)
      return id ? { provider: 'youtube', external_id: id } : null
    }
    if (host === 'vimeo.com') {
      const id = u.pathname.split('/').filter(Boolean)[0]
      return id && /^\d+$/.test(id) ? { provider: 'vimeo', external_id: id } : null
    }
    return null
  } catch { return null }
}

const schema = z.object({
  subject_id:   z.string().uuid(),
  title:        z.string().min(3).max(200),
  description:  z.string().max(1000).optional(),
  level:        z.enum(['bepc', 'bac_a', 'bac_c', 'bac_d']),
  url:          z.string().url(),
  duration_sec: z.number().int().positive().optional(),
  is_premium:   z.boolean().default(false),
})

/** POST /api/admin/videos — ajoute un cours vidéo depuis une URL YouTube/Vimeo (admin) */
export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const { data: profile } = await supabaseAdmin.from('users').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return NextResponse.json({ error: 'Admin requis' }, { status: 403 })

  let body: z.infer<typeof schema>
  try { body = schema.parse(await req.json()) }
  catch { return NextResponse.json({ error: 'Corps invalide' }, { status: 400 }) }

  const parsed = parseVideoUrl(body.url)
  if (!parsed) {
    return NextResponse.json(
      { error: { code: 'BAD_URL', message: 'URL non reconnue. Utilise un lien YouTube ou Vimeo.' } },
      { status: 422 }
    )
  }

  const thumbnail = parsed.provider === 'youtube'
    ? `https://i.ytimg.com/vi/${parsed.external_id}/hqdefault.jpg`
    : null

  const { data, error } = await supabaseAdmin
    .from('videos')
    .insert({
      subject_id:    body.subject_id,
      title:         body.title,
      description:   body.description ?? null,
      level:         body.level,
      provider:      parsed.provider,
      external_id:   parsed.external_id,
      url:           body.url,
      duration_sec:  body.duration_sec ?? null,
      thumbnail_url: thumbnail,
      is_premium:    body.is_premium,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: { code: 'DB_ERROR', message: error.message } }, { status: 500 })
  return NextResponse.json({ data }, { status: 201 })
}
