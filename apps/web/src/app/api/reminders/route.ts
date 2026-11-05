import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { getEntitlements, planRequired, planRequiredFromDbError } from '@/lib/subscription/server'

/** GET /api/reminders — préférences de rappel de l'élève */
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const { data, error } = await supabase
    .from('users')
    .select('phone, whatsapp_opt_in, reminder_hour')
    .eq('id', user.id)
    .single()

  if (error) {

    console.error('[/api/reminders]', error)

    return NextResponse.json({ error: { code: 'DB_ERROR', message: 'Une erreur est survenue, réessaie plus tard.' } }, { status: 500 })

  }
  return NextResponse.json({ data })
}

const schema = z.object({
  whatsapp_opt_in: z.boolean().optional(),
  reminder_hour:   z.number().int().min(0).max(23).optional(),
})

/** PATCH /api/reminders — active/désactive les rappels WhatsApp + règle l'heure */
export async function PATCH(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  let body: z.infer<typeof schema>
  try { body = schema.parse(await req.json()) }
  catch { return NextResponse.json({ error: 'Corps invalide' }, { status: 400 }) }

  // Activer les rappels WhatsApp est une fonction Starter (désactiver reste libre).
  if (body.whatsapp_opt_in === true) {
    const ent = await getEntitlements(user.id)
    if (!ent.can('whatsapp_reminders')) return planRequired('whatsapp_reminders')
  }

  const { data, error } = await supabase
    .from('users')
    .update(body)
    .eq('id', user.id)
    .select('whatsapp_opt_in, reminder_hour')
    .single()

  if (error) {
    const locked = planRequiredFromDbError(error.message)
    if (locked) return locked

    console.error('[/api/reminders]', error)

    return NextResponse.json({ error: { code: 'DB_ERROR', message: 'Une erreur est survenue, réessaie plus tard.' } }, { status: 500 })

  }
  return NextResponse.json({ data })
}
