import { NextResponse } from 'next/server'
import { timingSafeEqual } from 'crypto'
import { supabaseAdmin } from '@/lib/admin-guard'
import { notifyUser } from '@/lib/messaging'

export const maxDuration = 60

// Congo-Brazzaville : fuseau unique WAT (UTC+1).
const CONGO_UTC_OFFSET = 1

function authorized(req: Request): boolean {
  const secret = process.env['CRON_SECRET']
  const header = req.headers.get('authorization') ?? ''
  if (!secret) return false
  const expected = Buffer.from(`Bearer ${secret}`)
  const received = Buffer.from(header)
  return expected.length === received.length && timingSafeEqual(expected, received)
}

/**
 * GET /api/cron/reminders — passe horaire (Vercel Cron, voir vercel.json).
 *
 * Envoie un rappel WhatsApp (repli SMS) aux élèves qui ont activé les rappels
 * et dont l'heure choisie correspond à l'heure locale courante, s'il leur reste
 * des séances de révision non terminées aujourd'hui. Idempotent par jour et par
 * élève (dedup_key), donc rejouer la passe ne crée pas de doublon.
 */
export async function GET(req: Request) {
  if (!authorized(req)) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const now = new Date()
  const localHour = (now.getUTCHours() + CONGO_UTC_OFFSET) % 24
  const today = now.toISOString().slice(0, 10)

  // 1. Élèves opt-in dont l'heure de rappel correspond à l'heure locale actuelle
  const { data: users, error: usersErr } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('whatsapp_opt_in', true)
    .eq('reminder_hour', localHour)
  if (usersErr) {
    console.error('[cron/reminders] users', usersErr.message)
    return NextResponse.json({ error: { code: 'DB_ERROR' } }, { status: 500 })
  }
  if (!users || users.length === 0) {
    return NextResponse.json({ data: { hour: localHour, notified: 0 } })
  }

  // 2. Séances du jour non terminées, pour ces élèves
  const userIds = users.map((u) => u.id)
  const { data: sessions, error: sessErr } = await supabaseAdmin
    .from('revision_sessions')
    .select('user_id')
    .in('user_id', userIds)
    .eq('scheduled_date', today)
    .eq('is_done', false)
  if (sessErr) {
    console.error('[cron/reminders] sessions', sessErr.message)
    return NextResponse.json({ error: { code: 'DB_ERROR' } }, { status: 500 })
  }

  const countByUser = new Map<string, number>()
  for (const s of sessions ?? []) {
    countByUser.set(s.user_id, (countByUser.get(s.user_id) ?? 0) + 1)
  }

  // 3. Envoi (notifyUser gère opt-in, repli SMS et idempotence)
  let notified = 0
  for (const [userId, count] of countByUser) {
    const res = await notifyUser({
      userId,
      dedupKey: `reminder:${userId}:${today}`,
      template: { name: 'revision_reminder', lang: 'fr', params: [String(count)] },
      smsBody: `📚 Kelassi : tu as ${count} révision${count > 1 ? 's' : ''} prévue${count > 1 ? 's' : ''} aujourd'hui. Bon courage !`,
    })
    if (res.status === 'sent') notified++
  }

  return NextResponse.json({ data: { hour: localHour, notified } })
}
