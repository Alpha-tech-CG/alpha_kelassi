import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

type Level = 'cepe' | 'bepc' | 'bac_a' | 'bac_c' | 'bac_d' | null
type Track = 'generale' | 'technique' | 'professionnel' | null

/**
 * Profil scolaire choisi à l'inscription :
 *  - level = parcours/examen (users.study_level_pref)
 *  - track = filière (users.track_type)
 * Sert à scoper TOUT le contenu : un élève ne voit que son parcours ET sa filière.
 */
export function useLevel() {
  const [level, setLevel] = useState<Level>(null)
  const [track, setTrack] = useState<Track>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let active = true
    ;(async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { if (active) setReady(true); return }
      const { data } = await supabase
        .from('users')
        .select('study_level_pref, track_type')
        .eq('id', user.id)
        .single()
      if (active) {
        const row = data as { study_level_pref?: Level; track_type?: Track } | null
        setLevel(row?.study_level_pref ?? null)
        setTrack(row?.track_type ?? null)
        setReady(true)
      }
    })()
    return () => { active = false }
  }, [])

  return { level, track, ready }
}
