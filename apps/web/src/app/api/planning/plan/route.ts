import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

/** GET /api/planning/plan — plan actif de l'élève + compte à rebours */
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const { data: plan } = await supabase
    .from('revision_plans')
    .select('id, level, title, exam_date, created_at')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (!plan) return NextResponse.json({ data: null })

  const days = Math.ceil((new Date(plan.exam_date).getTime() - Date.now()) / 86400000)
  return NextResponse.json({ data: { ...plan, days_remaining: Math.max(days, 0) } })
}

const schema = z.object({
  level:     z.enum(['bepc', 'bac_a', 'bac_c', 'bac_d']),
  title:     z.string().min(3).max(120),
  exam_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
})

/** POST /api/planning/plan — crée (ou remplace) le plan actif */
export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  let body: z.infer<typeof schema>
  try { body = schema.parse(await req.json()) }
  catch { return NextResponse.json({ error: 'Corps invalide' }, { status: 400 }) }

  // Désactive les plans précédents (un seul plan actif à la fois)
  await supabase.from('revision_plans').update({ is_active: false }).eq('user_id', user.id).eq('is_active', true)

  const { data, error } = await supabase
    .from('revision_plans')
    .insert({ user_id: user.id, level: body.level, title: body.title, exam_date: body.exam_date, is_active: true })
    .select('id, level, title, exam_date')
    .single()

  if (error) return NextResponse.json({ error: { code: 'DB_ERROR', message: error.message } }, { status: 500 })
  return NextResponse.json({ data }, { status: 201 })
}
