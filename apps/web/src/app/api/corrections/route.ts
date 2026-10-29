import { NextResponse } from 'next/server'
import { createHash } from 'crypto'
import { z } from 'zod'
import { authenticate } from '@/lib/supabase/api'
import { admin } from '@/lib/tutor'
import { rateLimit, tooMany } from '@/lib/rate-limit'
import {
  consumeUsage, getEntitlements, planRequired, quotaExceeded, readUsage, refundUsage, requestKeyOf, UsageUnavailableError,
} from '@/lib/subscription/server'

const ownsPath = (userId: string, path: string) => path.split('/')[0] === userId

const createSchema = z.object({
  subject_id:   z.string().uuid(),
  exercise_url: z.string().min(3).max(512),
  work_url:     z.string().min(3).max(512),
})

/** GET /api/corrections — mes missions (élève) + quota mensuel de corrections. */
export async function GET(req: Request) {
  const { user, supabase } = await authenticate(req)
  if (!user) return NextResponse.json({ error: { code: 'UNAUTHORIZED' } }, { status: 401 })

  const [{ data, error }, ent] = await Promise.all([
    supabase.from('correction_missions')
      .select('id, subject_id, status, reward_fcfa, due_at, delivered_at, created_at, subjects(name)')
      .eq('student_id', user.id).order('created_at', { ascending: false }).limit(50),
    getEntitlements(user.id),
  ])
  if (error) {
    console.error('[/api/corrections]', error)
    return NextResponse.json({ error: { code: 'DB_ERROR', message: 'Une erreur est survenue, réessaie plus tard.' } }, { status: 500 })
  }
  const usage = await readUsage(ent, 'tutor_corrections').catch(() => null)
  return NextResponse.json({ data: data ?? [], quota: usage && { plan: ent.plan, ...usage } })
}

/**
 * POST /api/corrections — soumettre un exercice à corriger.
 * Formule Pro minimum ; 2 corrections par mois en Pro, 6 en Pro Max.
 *
 * Règles métier :
 *   • Une correction est décomptée à la création de la demande. Elle est
 *     rendue si la demande n'a pas pu être enregistrée.
 *   • Une correction livrée par l'IA après deux échecs du tuteur reste
 *     décomptée : l'élève a bien reçu sa correction.
 *   • Soumettre deux fois les mêmes photos ne crée pas une seconde demande
 *     (clé d'idempotence dérivée des fichiers) et ne décompte rien de plus.
 */
export async function POST(req: Request) {
  const { user } = await authenticate(req)
  if (!user) return NextResponse.json({ error: { code: 'UNAUTHORIZED' } }, { status: 401 })
  if (!(await rateLimit(`corrections:${user.id}`, 15, 3600))) return tooMany()

  let body: z.infer<typeof createSchema>
  try { body = createSchema.parse(await req.json()) }
  catch { return NextResponse.json({ error: { code: 'BAD_REQUEST' } }, { status: 400 }) }

  if (!ownsPath(user.id, body.exercise_url) || !ownsPath(user.id, body.work_url)) {
    return NextResponse.json({ error: { code: 'FORBIDDEN', message: 'Fichier hors de votre dossier.' } }, { status: 403 })
  }

  const ent = await getEntitlements(user.id)
  if (!ent.can('tutor_correction')) return planRequired('tutor_correction')

  const { data: subject } = await admin().from('subjects').select('id').eq('id', body.subject_id).maybeSingle()
  if (!subject) return NextResponse.json({ error: { code: 'NO_SUBJECT', message: 'Matière inconnue.' } }, { status: 422 })

  const requestKey = requestKeyOf(
    req,
    `corr-${createHash('sha256').update(`${body.exercise_url}|${body.work_url}`).digest('hex').slice(0, 40)}`,
  )

  // Double soumission : on renvoie la demande déjà créée.
  const { data: existing } = await admin().from('correction_missions')
    .select('id, status, created_at').eq('student_id', user.id).eq('request_key', requestKey).maybeSingle()
  if (existing) return NextResponse.json({ data: existing, duplicate: true }, { status: 200 })

  let usage
  try {
    usage = await consumeUsage(ent, 'tutor_corrections', requestKey)
  } catch (err) {
    if (err instanceof UsageUnavailableError) {
      return NextResponse.json({ error: { code: 'QUOTA_UNAVAILABLE', message: 'Les demandes de correction sont momentanément indisponibles. Réessaie plus tard.' } }, { status: 503 })
    }
    throw err
  }
  if (!usage.allowed) return quotaExceeded('tutor_corrections', usage)

  const { data: mission, error } = await admin().from('correction_missions').insert({
    student_id: user.id, subject_id: body.subject_id, exercise_url: body.exercise_url, work_url: body.work_url,
    status: 'pending', request_key: requestKey,
    // Pro Max : traitement prioritaire dans la file des tuteurs.
    priority: ent.can('priority_tutor_corrections') ? 1 : 0,
  }).select('id, status, created_at').single()
  if (error) {
    await refundUsage(user.id, 'tutor_corrections', requestKey)
    console.error('[/api/corrections]', error)
    return NextResponse.json({ error: { code: 'DB_ERROR', message: 'Ta demande n’a pas pu être enregistrée. Elle n’a pas été décomptée, réessaie.' } }, { status: 500 })
  }

  // La mission apparaît dans le pool des tuteurs (GET /api/tutor/missions).
  return NextResponse.json({ data: mission, quota: usage }, { status: 201 })
}
