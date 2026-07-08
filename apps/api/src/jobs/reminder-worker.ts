import { Worker } from 'bullmq'
import { supabaseAdmin } from '../lib/supabase.js'
import { notifyUser } from '../lib/messaging.js'

const CONGO_UTC_OFFSET = 1  // WAT (UTC+1), fuseau unique du Congo-Brazzaville

async function processReminderTick() {
  const now = new Date()
  const localHour = (now.getUTCHours() + CONGO_UTC_OFFSET) % 24
  const today = now.toISOString().slice(0, 10)

  // 1. Élèves opt-in dont l'heure de rappel correspond à l'heure locale actuelle
  const { data: users } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('whatsapp_opt_in', true)
    .eq('reminder_hour', localHour)
  if (!users || users.length === 0) return { hour: localHour, notified: 0 }

  // 2. Séances du jour non terminées, pour ces élèves
  const userIds = users.map((u) => u.id)
  const { data: sessions } = await supabaseAdmin
    .from('revision_sessions')
    .select('user_id')
    .in('user_id', userIds)
    .eq('scheduled_date', today)
    .eq('is_done', false)

  const countByUser = new Map<string, number>()
  for (const s of sessions ?? []) countByUser.set(s.user_id, (countByUser.get(s.user_id) ?? 0) + 1)

  // 3. Envoi (notifyUser gère opt-in, repli SMS et idempotence)
  let notified = 0
  for (const [userId, count] of countByUser) {
    const res = await notifyUser({
      userId,
      dedupKey: `reminder:${userId}:${today}`,
      template: { name: 'revision_reminder', lang: 'fr', params: [String(count)] },
      smsBody:  `📚 Kelassi : tu as ${count} révision${count > 1 ? 's' : ''} prévue${count > 1 ? 's' : ''} aujourd'hui. Bon courage !`,
    })
    if (res.status === 'sent') notified++
  }

  return { hour: localHour, notified }
}

export function startReminderWorker() {
  const worker = new Worker('daily_reminders', processReminderTick, {
    connection: { url: process.env['QUEUE_REDIS_URL']! },
    concurrency: 1,
  })
  worker.on('completed', (job, res) => {
    console.log(`[reminder-worker] tick ${job.id} — ${JSON.stringify(res)}`)
  })
  worker.on('failed', (job, err) => {
    console.error(`[reminder-worker] tick ${job?.id} échoué:`, err.message)
  })
  return worker
}
