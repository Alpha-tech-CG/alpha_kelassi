import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

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

  if (error) return NextResponse.json({ error: { code: 'DB_ERROR', message: error.message } }, { status: 500 })
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

  const { data, error } = await supabase
    .from('users')
    .update(body)
    .eq('id', user.id)
    .select('whatsapp_opt_in, reminder_hour')
    .single()

  if (error) return NextResponse.json({ error: { code: 'DB_ERROR', message: error.message } }, { status: 500 })
  return NextResponse.json({ data })
}
