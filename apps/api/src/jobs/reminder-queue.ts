import { Queue } from 'bullmq'

const queueRedisUrl = process.env['QUEUE_REDIS_URL'] ?? ''
const isQueueConfigured = !!queueRedisUrl && !queueRedisUrl.includes('xxxx')

// Queue des rappels de révision quotidiens (WhatsApp/SMS)
export const reminderQueue = isQueueConfigured
  ? new Queue('daily_reminders', {
      connection: { url: queueRedisUrl },
      defaultJobOptions: { attempts: 2, removeOnComplete: 50, removeOnFail: 50 },
    })
  : null

/**
 * Planifie le job répétable : toutes les heures.
 * Le worker n'envoie qu'aux élèves dont reminder_hour == heure locale (Congo, UTC+1),
 * ce qui respecte l'heure choisie par chacun avec un seul cron.
 */
export async function scheduleDailyReminders(): Promise<void> {
  if (!reminderQueue) return
  await reminderQueue.add('tick', {}, {
    repeat: { pattern: '0 * * * *' },  // au début de chaque heure
    jobId:  'daily-reminders-hourly',
  })
}
