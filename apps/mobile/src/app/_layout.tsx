import { useEffect, useState } from 'react'
import { Text as RNText } from 'react-native'
import { Stack, useRouter, useSegments, useRootNavigationState } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import {
  useFonts,
  Nunito_400Regular, Nunito_600SemiBold, Nunito_700Bold, Nunito_800ExtraBold, Nunito_900Black,
} from '@expo-google-fonts/nunito'
import { Poppins_700Bold, Poppins_800ExtraBold, Poppins_900Black } from '@expo-google-fonts/poppins'
import { supabase } from '../lib/supabase'
import { Splash } from '../components/Splash'
import type { Session } from '@supabase/supabase-js'

// Police par défaut de toute l'app = Nunito (design final). Les titres passent
// en Poppins via `fonts.heading` dans les styles.
const RNTextAny = RNText as unknown as { defaultProps?: { style?: unknown } }
RNTextAny.defaultProps = RNTextAny.defaultProps || {}
RNTextAny.defaultProps.style = { fontFamily: 'Nunito_700Bold' }

// NOTE : WatermelonDB (cache offline) est temporairement retiré du chemin de
// démarrage. Il s'initialisait ici (`jsi: true` + décorateurs sans babel config
// legacy) et faisait planter l'app entière au lancement, alors qu'aucun écran ne
// l'utilise encore. Les fichiers src/db/ restent en place ; à re-brancher
// proprement (setup natif JSI + babel legacy decorators) quand la vraie feature
// offline-first sera implémentée.

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Nunito_400Regular, Nunito_600SemiBold, Nunito_700Bold, Nunito_800ExtraBold, Nunito_900Black,
    Poppins_700Bold, Poppins_800ExtraBold, Poppins_900Black,
  })
  const [session, setSession] = useState<Session | null>(null)
  const [ready, setReady] = useState(false)
  const segments = useSegments()
  const router = useRouter()
  const navState = useRootNavigationState()

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setReady(true)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s)
    })
    return () => subscription.unsubscribe()
  }, [])

  // Redirection selon l'état d'auth — UNIQUEMENT une fois la session connue ET le
  // navigateur racine monté (navState?.key). Sans ce garde, router.replace() était
  // appelé avant le montage du Stack → crash "Attempted to navigate before
  // mounting the Root Layout component".
  useEffect(() => {
    if (!ready || !navState?.key) return

    const inAuth = segments[0] === '(auth)'

    if (!session && !inAuth) {
      router.replace('/(auth)/login')
      return
    }
    if (session && inAuth) {
      supabase.from('users').select('onboarding_completed').eq('id', session.user.id).single()
        .then(({ data }) => {
          router.replace(data?.onboarding_completed ? '/(tabs)' : ('/onboarding' as any))
        })
    }
  }, [ready, navState?.key, session, segments, router])

  if (!fontsLoaded || !ready) return <Splash />

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="cours/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="examens/[id]" options={{ headerShown: true, title: '' }} />
        <Stack.Screen name="flashcards/index" options={{ headerShown: true, title: 'Flashcards' }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false, gestureEnabled: false }} />
      </Stack>
      <StatusBar style="dark" backgroundColor="#F7FAF8" />
    </>
  )
}
