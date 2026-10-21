import { NextRequest, NextResponse } from 'next/server'
import { authenticate } from '@/lib/supabase/api'
import { z } from 'zod'
import { STUDY_LEVELS } from '@alpha-kelassi/types'

const schema = z.object({
  track_type:  z.enum(['generale', 'technique', 'professionnel']).default('generale'),
  // Toutes les classes de l'enum `study_level`, séries techniques comprises :
  // une liste figée ici rejetait en silence tout élève de G2, G3, BG, R…
  level:       z.enum(STUDY_LEVELS),
  // Un parcours peut n'avoir pas encore de matières (créées au fur et à mesure)
  subject_ids: z.array(z.string().uuid()).max(12).default([]),
})

/** POST /api/onboarding/complete — finalise l'onboarding */
export async function POST(req: NextRequest) {
  const { user, supabase } = await authenticate(req)
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  let body: z.infer<typeof schema>
  try { body = schema.parse(await req.json()) }
  catch { return NextResponse.json({ error: 'Corps invalide' }, { status: 400 }) }

  const { track_type, level, subject_ids } = body
  // Cast : les types Supabase générés sont obsolètes (ils ignorent les classes
  // ajoutées par les migrations 028, 054 et 055). Runtime OK.
  const lvl = level as 'bepc' | 'bac_a' | 'bac_c' | 'bac_d'

  // Marque l'onboarding terminé + sauvegarde les préférences (filière + parcours)
  const { error: updateError } = await supabase.from('users').update({
    onboarding_completed: true,
    track_type,
    study_level_pref:    lvl,
    subject_ids_pref:    subject_ids,
  }).eq('id', user.id)
  // Sans ce contrôle, un échec d'écriture passait pour un succès : l'élève
  // repartait sur l'accueil avec son ancien parcours.
  if (updateError) {
    return NextResponse.json({ error: { code: 'UPDATE_FAILED', message: 'Impossible d’enregistrer ton parcours.' } }, { status: 500 })
  }

  // Crée les entrées user_progress pour les matières choisies (si l'élève en a choisi)
  if (subject_ids.length > 0) {
    await supabase.from('user_progress').upsert(
      subject_ids.map((sid) => ({ user_id: user.id, subject_id: sid })),
      { onConflict: 'user_id,subject_id', ignoreDuplicates: true }
    )
  }

  // Trouve un premier document indexé pour suggérer une flashcard
  const { data: doc } = await supabase
    .from('documents')
    .select('id, title')
    .eq('level', lvl)
    .eq('type', 'cours')
    .not('indexed_at', 'is', null)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  return NextResponse.json({
    data: { completed: true, suggested_document: doc ?? null },
  })
}
