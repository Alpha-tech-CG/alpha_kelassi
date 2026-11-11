import { NextRequest, NextResponse } from 'next/server'
import { authenticate } from '@/lib/supabase/api'
import { supabaseAdmin } from '@/lib/admin-guard'
import { z } from 'zod'
import { getEntitlements } from '@/lib/subscription/server'

const schema = z.object({
  kind:        z.enum(['feedback', 'support']).default('feedback'),
  rating:      z.number().int().min(1).max(5).optional(),
  comment:     z.string().max(2000).optional(),
  page:        z.string().max(100).optional(),
  app_version: z.string().max(20).optional(),
}).refine((b) => b.kind === 'support' ? !!b.comment?.trim() : b.rating !== undefined, {
  message: 'Une demande de support doit décrire le problème ; un avis doit comporter une note.',
})

/**
 * POST /api/feedback — avis beta ou demande de support.
 * La priorité de traitement suit la formule au moment de l'envoi :
 * 0 = standard, 1 = support prioritaire (Pro), 2 = prioritaire renforcé (Pro Max).
 */
export async function POST(req: NextRequest) {
  const { user } = await authenticate(req)
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  let body: z.infer<typeof schema>
  try { body = schema.parse(await req.json()) }
  catch { return NextResponse.json({ error: 'Corps invalide' }, { status: 400 }) }

  const ent = await getEntitlements(user.id)
  const priority = ent.can('enhanced_priority_support') ? 2 : ent.can('priority_support') ? 1 : 0

  const { error } = await supabaseAdmin.from('beta_feedback').insert({
    user_id:     user.id,
    kind:        body.kind,
    rating:      body.rating ?? 3,
    comment:     body.comment ?? null,
    page:        body.page ?? null,
    app_version: body.app_version ?? null,
    plan:        ent.plan,
    priority,
  })

  if (error) {
    console.error('[/api/feedback]', error)
    return NextResponse.json({ error: { code: 'DB_ERROR', message: 'Une erreur est survenue, réessaie plus tard.' } }, { status: 500 })
  }
  return NextResponse.json({
    data: {
      submitted: true,
      priority,
      message: priority === 2
        ? 'Demande reçue : elle est traitée en priorité renforcée.'
        : priority === 1 ? 'Demande reçue : elle est traitée en priorité.' : 'Demande reçue, merci !',
    },
  }, { status: 201 })
}
