import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

type Level = 'bepc' | 'bac_a' | 'bac_c' | 'bac_d' | null

/**
 * Niveau d'examen choisi par l'élève à l'inscription (users.study_level_pref).
 * Sert à scoper TOUT le contenu : un élève Bac C ne voit que du Bac C.
 */
export function useLevel() {
  const [level, setLevel] = useState<Level>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let active = true
    ;(async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { if (active) setReady(true); return }
      const { data } = await supabase
        .from('users')
        .select('study_level_pref')
        .eq('id', user.id)
        .single()
      if (active) {
        setLevel(((data as { study_level_pref?: Level })?.study_level_pref ?? null))
        setReady(true)
      }
    })()
    return () => { active = false }
  }, [])

  return { level, ready }
}
