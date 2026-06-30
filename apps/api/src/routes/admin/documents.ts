import { Hono } from 'hono'
import type { AppVariables } from '../../lib/types.js'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { authMiddleware, adminMiddleware } from '../../middleware/auth.js'
import { adminDb, adminStorage, COLLECTIONS } from '../../lib/firebase.js'
import { embedQueue } from '../../jobs/embed-queue.js'
import { detectFormat, extractText } from '../../lib/text-extractor.js'
import { FieldValue } from 'firebase-admin/firestore'

const router = new Hono<{ Variables: AppVariables }>()
router.use('*', authMiddleware)
router.use('*', adminMiddleware)

const uploadSchema = z.object({
  subject_id:   z.string(),
  type:         z.enum(['cours', 'examen']),
  title:        z.string().min(3),
  level:        z.enum(['bepc', 'bac_a', 'bac_c', 'bac_d']),
  year:         z.coerce.number().int().min(1990).max(2030).optional(),
  session:      z.enum(['normale', 'rattrapage']).optional(),
  country_code: z.string().length(2).default('CG'),
  is_premium:   z.boolean().default(false),
})

// POST /api/admin/documents — upload PDF/DOCX/TXT
router.post('/', async (c) => {
  const formData = await c.req.formData()
  const file     = formData.get('file') as File | null
  const metaRaw  = formData.get('meta') as string | null

  if (!file || !metaRaw) {
    return c.json({ error: { code: 'BAD_REQUEST', message: 'Fichier et métadonnées requis' } }, 400)
  }

  const meta        = uploadSchema.parse(JSON.parse(metaRaw))
  const arrayBuffer = await file.arrayBuffer()
  const buffer      = Buffer.from(arrayBuffer)

  const headerBytes = new Uint8Array(buffer.slice(0, 4))
  const format      = detectFormat(file.name, file.type, headerBytes)
  if (!format) {
    return c.json({ error: { code: 'INVALID_FILE', message: 'Format non supporté. Utilisez PDF, DOCX ou TXT.' } }, 400)
  }

  let textContent: string | null = null
  try {
    textContent = await extractText(buffer, format)
    if (!textContent || textContent.trim().length < 20) {
      return c.json({ error: { code: 'EMPTY_DOCUMENT', message: 'Document vide ou non extractible (PDF scanné ?)' } }, 422)
    }
  } catch (err) {
    return c.json({ error: { code: 'EXTRACTION_ERROR', message: `Erreur extraction : ${(err as Error).message}` } }, 422)
  }

  const safeName = file.name
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/\.{2,}/g, '_')
    .replace(/^[._]+/, '')
    .slice(0, 100)

  const contentTypeMap: Record<string, string> = {
    pdf:  'application/pdf',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    txt:  'text/plain; charset=utf-8',
  }

  const folder      = meta.is_premium ? 'pdfs-premium' : 'pdfs-public'
  const storagePath = `${folder}/${Date.now()}_${safeName || `document.${format}`}`
  const bucket      = adminStorage.bucket()

  await bucket.file(storagePath).save(buffer, {
    metadata: { contentType: contentTypeMap[format] },
  })

  const docRef = await adminDb.collection(COLLECTIONS.DOCUMENTS).add({
    ...meta,
    year:         meta.year    ?? null,
    session:      meta.session ?? null,
    storage_path: storagePath,
    text_content: textContent,
    synthesized_at: null,
    created_at:   FieldValue.serverTimestamp(),
  })

  if (embedQueue) {
    await embedQueue.add('embed_document', {
      document_id:  docRef.id,
      storage_path: storagePath,
      text_content: textContent,
    })
  }

  const snap = await docRef.get()
  return c.json({ data: { id: snap.id, ...snap.data() } }, 201)
})

// PUT /api/admin/documents/:id — mise à jour métadonnées
router.put('/:id', zValidator('json', uploadSchema.partial()), async (c) => {
  const id      = c.req.param('id')
  const updates = c.req.valid('json')
  const ref     = adminDb.collection(COLLECTIONS.DOCUMENTS).doc(id)
  await ref.update({ ...updates, updated_at: FieldValue.serverTimestamp() })
  const snap = await ref.get()
  return c.json({ data: { id: snap.id, ...snap.data() } })
})

// PATCH /api/admin/documents/:id/corrige — upload du corrigé
router.patch('/:id/corrige', async (c) => {
  const id      = c.req.param('id')
  const docSnap = await adminDb.collection(COLLECTIONS.DOCUMENTS).doc(id).get()
  if (!docSnap.exists) {
    return c.json({ error: { code: 'NOT_FOUND', message: 'Document introuvable' } }, 404)
  }

  const formData = await c.req.formData()
  const file     = formData.get('file') as File | null
  if (!file) return c.json({ error: { code: 'BAD_REQUEST', message: 'Fichier requis' } }, 400)

  const headerBytes = new Uint8Array(await file.slice(0, 4).arrayBuffer())
  if (!String.fromCharCode(...headerBytes).startsWith('%PDF')) {
    return c.json({ error: { code: 'INVALID_FILE', message: 'Le fichier doit être un PDF valide' } }, 400)
  }

  const safeName    = file.name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 100)
  const isPremium   = docSnap.data()?.['is_premium'] as boolean
  const folder      = isPremium ? 'pdfs-premium' : 'pdfs-public'
  const storagePath = `${folder}/corrige_${Date.now()}_${safeName || 'corrige.pdf'}`
  const buffer      = Buffer.from(await file.arrayBuffer())

  await adminStorage.bucket().file(storagePath).save(buffer, {
    metadata: { contentType: 'application/pdf' },
  })

  const ref = adminDb.collection(COLLECTIONS.DOCUMENTS).doc(id)
  await ref.update({ corrige_storage_path: storagePath, updated_at: FieldValue.serverTimestamp() })
  const snap = await ref.get()
  return c.json({ data: { id: snap.id, ...snap.data() } })
})

// DELETE /api/admin/documents/:id
router.delete('/:id', async (c) => {
  const id      = c.req.param('id')
  const docSnap = await adminDb.collection(COLLECTIONS.DOCUMENTS).doc(id).get()
  if (!docSnap.exists) {
    return c.json({ error: { code: 'NOT_FOUND', message: 'Introuvable' } }, 404)
  }

  const storagePath = docSnap.data()?.['storage_path'] as string | null
  if (storagePath) {
    await adminStorage.bucket().file(storagePath).delete().catch(() => null)
  }

  await adminDb.collection(COLLECTIONS.DOCUMENTS).doc(id).delete()
  return c.json({ data: { deleted: true } })
})

export { router as adminDocumentsRouter }
