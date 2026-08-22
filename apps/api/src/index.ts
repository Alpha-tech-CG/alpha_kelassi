import { timingSafeEqual } from 'node:crypto'
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { secureHeaders } from 'hono/secure-headers'
import { bodyLimit } from 'hono/body-limit'
import { authRouter } from './routes/auth.js'
import { billingRouter } from './routes/billing.js'
import { webhooksRouter } from './routes/webhooks.js'
import { subjectsRouter } from './routes/subjects.js'
import { curriculumRouter } from './routes/curriculum.js'
import { documentsRouter } from './routes/documents.js'
import { adminDocumentsRouter } from './routes/admin/documents.js'
import { adminCurriculumRouter } from './routes/admin/curriculum.js'
import { aiRouter } from './routes/ai.js'
import { flashcardsRouter } from './routes/flashcards.js'
import { quizRouter } from './routes/quiz.js'
import { planningRouter } from './routes/planning.js'
import { videosRouter } from './routes/videos.js'
import { progressRouter } from './routes/progress.js'
import { adminAnalyticsRouter } from './routes/admin/analytics.js'
import { accountRouter } from './routes/account.js'
import { onboardingRouter } from './routes/onboarding.js'
import { feedbackRouter } from './routes/feedback.js'
import { adminNotificationsRouter } from './routes/admin/notifications.js'
import { notificationsRouter } from './routes/notifications.js'
import { remindersRouter } from './routes/reminders.js'
import { whatsappWebhookRouter } from './routes/whatsapp-webhook.js'
import { trackRouter } from './routes/track.js'
import { correctionsRouter } from './routes/corrections.js'
import { tutorRouter } from './routes/tutor.js'
import { adminTutorsRouter } from './routes/admin/tutors.js'
import { startEmbedWorker } from './jobs/embed-worker.js'
import { startReminderWorker } from './jobs/reminder-worker.js'
import { startTutorWorker } from './jobs/tutor-worker.js'
import { scheduleDailyReminders } from './jobs/reminder-queue.js'
import { initSentry } from './lib/monitoring.js'
import { metricsMiddleware, getMetrics } from './middleware/metrics.js'
import { chatRateLimit } from './middleware/rate-limit.js'

// Démarre les workers BullMQ uniquement si Redis est configuré
const queueRedisUrl = process.env['QUEUE_REDIS_URL']
if (queueRedisUrl && !queueRedisUrl.includes('xxxx')) {
  const embedWorker = startEmbedWorker()
  const reminderWorker = startReminderWorker()
  const tutorWorker = startTutorWorker()
  scheduleDailyReminders().catch((e) => console.error('[reminders] planification échouée:', e))

  // Arrêt propre : ferme les workers (et leurs listeners/connexions Redis)
  // au lieu de laisser le process les tuer brutalement.
  async function shutdown(signal: string) {
    console.log(`[api] ${signal} reçu, arrêt des workers…`)
    await Promise.allSettled([embedWorker.close(), reminderWorker.close(), tutorWorker.close()])
    process.exit(0)
  }
  process.on('SIGTERM', () => void shutdown('SIGTERM'))
  process.on('SIGINT', () => void shutdown('SIGINT'))
}
initSentry().catch(() => null)

const app = new Hono()

app.use('*', logger())
app.use('*', secureHeaders())
app.use('*', metricsMiddleware())

// Plafond global de taille de corps : sans lui, n'importe quel POST peut faire
// grossir la mémoire du process sans limite. Les routes d'upload admin ont
// leur propre plafond plus fin (20 Mo par fichier).
app.use(
  '*',
  bodyLimit({
    maxSize: 25 * 1024 * 1024,  // 25 Mo
    onError: (c) =>
      c.json({ error: { code: 'PAYLOAD_TOO_LARGE', message: 'Requête trop volumineuse (max 25 Mo).' } }, 413),
  }),
)

// Plafond plus strict pour les routes JSON — aucune d'entre elles n'a besoin
// de plus de 1 Mo. Seules les routes d'upload admin gardent les 20 Mo.
const UPLOAD_PREFIXES = ['/api/admin/documents']
const jsonBodyLimit = bodyLimit({
  maxSize: 1024 * 1024,  // 1 Mo
  onError: (c) =>
    c.json({ error: { code: 'PAYLOAD_TOO_LARGE', message: 'Requête trop volumineuse (max 1 Mo).' } }, 413),
})
app.use('/api/*', async (c, next) => {
  const path = new URL(c.req.url).pathname
  if (UPLOAD_PREFIXES.some((p) => path.startsWith(p))) return next()
  return jsonBodyLimit(c, next)
})
app.use(
  '/api/*',
  cors({
    origin: [process.env['NEXT_PUBLIC_SITE_URL'] ?? 'http://localhost:3000'],
    credentials: true,
  })
)

app.get('/health', (c) => c.json({ status: 'ok', service: 'alpha-kelassi-api' }))

// Endpoint Prometheus — accès restreint par IP ou token interne
app.get('/metrics', (c) => {
  const token = c.req.header('x-metrics-token')
  const expected = process.env['METRICS_TOKEN']
  // Fail-closed + comparaison à temps constant du jeton interne.
  if (!expected || !token) return c.text('Forbidden', 403)
  const a = Buffer.from(token)
  const b = Buffer.from(expected)
  if (a.length !== b.length || !timingSafeEqual(a, b)) return c.text('Forbidden', 403)
  return c.text(getMetrics(), 200, { 'Content-Type': 'text/plain; version=0.0.4' })
})

app.route('/api/auth', authRouter)
app.route('/api/billing', billingRouter)
app.route('/api/subjects', subjectsRouter)
app.route('/api/curriculum', curriculumRouter)
app.route('/api/documents', documentsRouter)
app.route('/api/admin/documents', adminDocumentsRouter)
app.route('/api/admin/curriculum', adminCurriculumRouter)
app.route('/api/ai', aiRouter)
app.route('/api/flashcards', flashcardsRouter)
app.route('/api/quiz', quizRouter)
app.route('/api/planning', planningRouter)
app.route('/api/videos', videosRouter)
app.route('/api/progress', progressRouter)
app.route('/api/admin/analytics', adminAnalyticsRouter)
app.route('/api/account', accountRouter)
app.route('/api/onboarding', onboardingRouter)
app.route('/api/feedback', feedbackRouter)
app.route('/api/admin/notifications', adminNotificationsRouter)
app.route('/api/notifications', notificationsRouter)
app.route('/api/reminders', remindersRouter)
app.use('/api/ai/chat', chatRateLimit)
app.route('/api/track', trackRouter)
app.route('/api/corrections', correctionsRouter)
app.route('/api/tutor', tutorRouter)
app.route('/api/admin/tutors', adminTutorsRouter)
app.route('/webhooks', webhooksRouter)
app.route('/webhooks/whatsapp', whatsappWebhookRouter)

const port = parseInt(process.env['PORT'] ?? '3001')
serve({ fetch: app.fetch, port }, () => {
  console.log(`🚀 Kelassi API démarrée sur http://localhost:${port}`)
})
