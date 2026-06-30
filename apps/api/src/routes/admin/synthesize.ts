import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { supabaseAdmin as supabase } from '../../lib/supabase.js'
import { synthesizeQueue } from '../../jobs/synthesize-queue.js'

export const adminSynthesizeRouter = new Hono()

const bodySchema = z.object({
  level: z.string().optional(),
})

// POST /api/admin/synthesize/:documentId  — déclenche la synthèse d'un document
adminSynthesizeRouter.post(
  '/:documentId',
  zValidator('json', bodySchema),
  async (c) => {
    // Auth interne : vérifie le secret partagé
    const token = c.req.header('x-internal-token')
    if (!token || token !== process.env['INTERNAL_API_SECRET']) {
      return c.json({ error: 'Non autorisé' }, 403)
    }

    const { documentId } = c.req.param()
    const { level } = c.req.valid('json')

    const { data: doc, error } = await supabase
      .from('documents')
      .select('id, title, text_content')
      .eq('id', documentId)
      .single()

    if (error || !doc) {
      return c.json({ error: 'Document introuvable' }, 404)
    }

    if (!doc.text_content || doc.text_content.trim().length < 100) {
      return c.json({ error: 'Document sans texte — indexe-le d\'abord' }, 422)
    }

    if (!synthesizeQueue) {
      return c.json({ error: 'Queue Redis non configurée' }, 503)
    }

    const job = await synthesizeQueue.add(
      `synthesize:${documentId}`,
      { document_id: documentId, title: doc.title, level },
      { jobId: `synthesize:${documentId}` }  // évite les doublons
    )

    return c.json({ ok: true, job_id: job.id, document_id: documentId })
  }
)

// GET /api/admin/synthesize/:documentId/status — état de la synthèse
adminSynthesizeRouter.get('/:documentId/status', async (c) => {
  const token = c.req.header('x-internal-token')
  if (!token || token !== process.env['INTERNAL_API_SECRET']) {
    return c.json({ error: 'Non autorisé' }, 403)
  }

  const { documentId } = c.req.param()

  const { data: chapters } = await supabase
    .from('course_chapters')
    .select('id, chapter_number, title, status')
    .eq('document_id', documentId)
    .order('chapter_number')

  const { data: doc } = await supabase
    .from('documents')
    .select('synthesized_at')
    .eq('id', documentId)
    .single()

  const total      = chapters?.length ?? 0
  const done       = chapters?.filter((c) => c.status === 'done').length ?? 0
  const errors     = chapters?.filter((c) => c.status === 'error').length ?? 0
  const processing = chapters?.filter((c) => c.status === 'processing').length ?? 0

  return c.json({
    document_id:    documentId,
    synthesized_at: doc?.synthesized_at ?? null,
    chapters:       chapters ?? [],
    stats:          { total, done, errors, processing, pending: total - done - errors - processing },
  })
})
