import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import type { AppVariables } from '../lib/types.js'
import { supabaseAdmin } from '../lib/supabase.js'
import { authMiddleware } from '../middleware/auth.js'

const router = new Hono<{ Variables: AppVariables }>()

// Auth requise sur toutes les routes de tracking
router.use('*', authMiddleware)

// ─── Schémas de validation ────────────────────────────────────────────────────

const pageViewSchema = z.object({
  page_path: z.string().max(500),
  duration_s: z.number().int().min(0).max(86400).optional(),
  platform: z.enum(['web', 'mobile']).default('web'),
})

const loginSchema = z.object({
  device: z.enum(['mobile', 'desktop', 'tablet']).optional(),
  platform: z.enum(['web', 'mobile']).default('web'),
})

const errorSchema = z.object({
  page_path: z.string().max(500).optional(),
  error_type: z.string().max(100).optional(),
  error_message: z.string().max(2000).optional(),
  stack_trace: z.string().max(10000).optional(),
  browser: z.string().max(200).optional(),
  os: z.string().max(100).optional(),
  platform: z.enum(['web', 'mobile']).default('web'),
})

// ─── POST /api/track/pageview ──────────────────────────────────────────────────
router.post('/pageview', zValidator('json', pageViewSchema), async (c) => {
  const userId = c.get('userId')
  const { page_path, duration_s, platform } = c.req.valid('json')

  const { error } = await supabaseAdmin
    .from('page_views')
    .insert({ user_id: userId, page_path, duration_s, platform })

  if (error) {
    console.error('[track/pageview]', error.message)
    return c.json({ error: { code: 'TRACKING_FAILED' } }, 500)
  }

  return c.json({ data: { tracked: true } }, 201)
})

// ─── POST /api/track/login ────────────────────────────────────────────────────
// Appelé après chaque connexion réussie (Supabase Auth sign-in)
router.post('/login', zValidator('json', loginSchema), async (c) => {
  const userId = c.get('userId')
  const { device, platform } = c.req.valid('json')

  // Récupère l'IP depuis les headers Cloudflare / standard
  const ip =
    c.req.header('cf-connecting-ip') ??
    c.req.header('x-forwarded-for')?.split(',')[0]?.trim() ??
    null

  const { error } = await supabaseAdmin
    .from('login_sessions')
    .insert({ user_id: userId, ip_address: ip, device, platform })

  if (error) {
    console.error('[track/login]', error.message)
    return c.json({ error: { code: 'TRACKING_FAILED' } }, 500)
  }

  return c.json({ data: { tracked: true } }, 201)
})

// ─── POST /api/track/error ────────────────────────────────────────────────────
router.post('/error', zValidator('json', errorSchema), async (c) => {
  const userId = c.get('userId')
  const { page_path, error_type, error_message, stack_trace, browser, os, platform } =
    c.req.valid('json')

  const { error } = await supabaseAdmin.from('client_errors').insert({
    user_id: userId,
    page_path,
    error_type,
    error_message,
    stack_trace,
    browser,
    os,
    platform,
  })

  if (error) {
    console.error('[track/error]', error.message)
    return c.json({ error: { code: 'TRACKING_FAILED' } }, 500)
  }

  return c.json({ data: { tracked: true } }, 201)
})

export { router as trackRouter }
