import { NextRequest, NextResponse } from 'next/server'
import { authenticate } from '@/lib/supabase/api'

/** GET /api/flashcards/due?limit=20 — cartes à réviser aujourd'hui */
export async function GET(req: NextRequest) {
  const { user, supabase } = await authenticate(req)
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const rawLimit = parseInt(req.nextUrl.searchParams.get('limit') ?? '20', 10)
  const limit = Number.isFinite(rawLimit) ? Math.min(50, Math.max(1, rawLimit)) : 20

  const { data, error } = await supabase
    .from('flashcards')
    .select('*, documents(title, subjects(name))')
    .eq('user_id', user.id)
    .lte('next_review', new Date().toISOString())
    .order('next_review', { ascending: true })
    .limit(limit)

  if (error) {


    console.error('[/api/flashcards/due]', error)


    return NextResponse.json({ error: { code: 'DB_ERROR', message: 'Une erreur est survenue, réessaie plus tard.' } }, { status: 500 })


  }
  return NextResponse.json({ data: data ?? [], count: data?.length ?? 0 })
}
