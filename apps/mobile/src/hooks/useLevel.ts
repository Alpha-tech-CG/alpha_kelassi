import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

// Valeur de l'enum `study_level` : cepe, bepc, bac_a/c/d et les séries techniques.
type Level = string | null
type Track = 'generale' | 'technique' | 'professionnel' | null

/**
 * Profil scolaire choisi à l'inscription :
 *  - level = parcours/examen (users.study_level_pref)
 *  - track = filière (users.track_type)
 * Sert à scoper TOUT le contenu : un élève ne voit que son parcours ET sa filière.
 * `isAdmin` permet aux écrans de proposer la consultation des autres classes.
 */
export function useLevel() {
  const [level, setLevel] = useState<Level>(null)
  const [track, setTrack] = useState<Track>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let active = true
    ;(async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { if (active) setReady(true); return }
      const { data } = await supabase
        .from('users')
        .select('study_level_pref, track_type, role')
        .eq('id', user.id)
        .single()
      if (active) {
        const row = data as { study_level_pref?: Level; track_type?: Track; role?: string } | null
        setLevel(row?.study_level_pref ?? null)
        setTrack(row?.track_type ?? null)
        setIsAdmin(row?.role === 'admin')
        setReady(true)
      }
    })()
    return () => { active = false }
  }, [])

  return { level, track, isAdmin, ready }
}
