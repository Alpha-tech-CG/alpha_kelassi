import { Hono } from 'hono'
import { supabaseAdmin as supabase } from '../lib/supabase.js'

export const chaptersRouter = new Hono()

// GET /api/chapters/:documentId — liste des chapitres d'un document
chaptersRouter.get('/:documentId', async (c) => {
  const { documentId } = c.req.param()

  const { data, error } = await supabase
    .from('course_chapters')
    .select('id, chapter_number, title, word_count, status, created_at')
    .eq('document_id', documentId)
    .order('chapter_number')

  if (error) return c.json({ error: error.message }, 500)

  return c.json({ chapters: data ?? [] })
})

// GET /api/chapters/:documentId/:chapterId — détail d'un chapitre avec summary_md
chaptersRouter.get('/:documentId/:chapterId', async (c) => {
  const { documentId, chapterId } = c.req.param()

  const { data, error } = await supabase
    .from('course_chapters')
    .select('id, chapter_number, title, summary_md, word_count, status')
    .eq('document_id', documentId)
    .eq('id', chapterId)
    .single()

  if (error || !data) return c.json({ error: 'Chapitre introuvable' }, 404)

  return c.json({ chapter: data })
})
