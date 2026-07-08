import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { secureHeaders } from 'hono/secure-headers'
import { authRouter } from './routes/auth.js'
import { billingRouter } from './routes/billing.js'
import { webhooksRouter } from './routes/webhooks.js'
import { subjectsRouter } from './routes/subjects.js'
import { documentsRouter } from './routes/documents.js'
import { adminDocumentsRouter } from './routes/admin/documents.js'
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
import { startEmbedWorker } from './jobs/embed-worker.js'
import { startReminderWorker } from './jobs/reminder-worker.js'
import { scheduleDailyReminders } from './jobs/reminder-queue.js'
import { initSentry } from './lib/monitoring.js'
import { metricsMiddleware, getMetrics } from './middleware/metrics.js'
import { chatRateLimit } from './middleware/rate-limit.js'

// Démarre les workers BullMQ uniquement si Redis est configuré
const queueRedisUrl = process.env['QUEUE_REDIS_URL']
if (queueRedisUrl && !queueRedisUrl.includes('xxxx')) {
  startEmbedWorker()
  startReminderWorker()
  scheduleDailyReminders().catch((e) => console.error('[reminders] planification échouée:', e))
}
initSentry().catch(() => null)

const app = new Hono()

app.use('*', logger())
app.use('*', secureHeaders())
app.use('*', metricsMiddleware())
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
  if (token !== process.env['METRICS_TOKEN']) return c.text('Forbidden', 403)
  return c.text(getMetrics(), 200, { 'Content-Type': 'text/plain; version=0.0.4' })
})

app.route('/api/auth', authRouter)
app.route('/api/billing', billingRouter)
app.route('/api/subjects', subjectsRouter)
app.route('/api/documents', documentsRouter)
app.route('/api/admin/documents', adminDocumentsRouter)
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
app.route('/webhooks', webhooksRouter)
app.route('/webhooks/whatsapp', whatsappWebhookRouter)

const port = parseInt(process.env['PORT'] ?? '3001')
serve({ fetch: app.fetch, port }, () => {
  console.log(`🚀 Kelassi API démarrée sur http://localhost:${port}`)
})
