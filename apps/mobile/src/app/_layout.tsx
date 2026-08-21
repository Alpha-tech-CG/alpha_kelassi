import { useEffect, useState } from 'react'
import { Text as RNText, AppState, AppStateStatus, View, StyleSheet } from 'react-native'
import { Stack, useRouter, useSegments, useRootNavigationState } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import {
  useFonts,
  Nunito_400Regular, Nunito_600SemiBold, Nunito_700Bold, Nunito_800ExtraBold, Nunito_900Black,
} from '@expo-google-fonts/nunito'
import { Poppins_700Bold, Poppins_800ExtraBold, Poppins_900Black } from '@expo-google-fonts/poppins'
import { supabase } from '../lib/supabase'
import { Splash } from '../components/Splash'
import { LockScreen } from '../components/LockScreen'
import { startAppLockTracking, shouldRequireUnlock, clearAppLock } from '../lib/appLock'
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
  const [minSplash, setMinSplash] = useState(false)  // logo Cognix visible ≥ 3s
  const [locked, setLocked] = useState(false)
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
    const t = setTimeout(() => setMinSplash(true), 3000)
    return () => { subscription.unsubscribe(); clearTimeout(t) }
  }, [])

  // Verrouillage biométrique/PIN après inactivité (> 5 min en arrière-plan).
  // Entièrement défensif : toute erreur d'API native est avalée, l'app ne
  // doit jamais planter ni bloquer un utilisateur sans biométrie enrôlée.
  useEffect(() => {
    try {
      startAppLockTracking()
    } catch {
      // no-op
    }

    // Vérifie aussi une fois au montage (cold start). Si l'OS a tué le process JS
    // pendant que l'app était en arrière-plan depuis plus de 5 min, aucun événement
    // AppState 'change' n'est émis au relancement (l'app démarre déjà 'active') :
    // sans ce contrôle initial, le verrouillage serait silencieusement contourné.
    shouldRequireUnlock()
      .then((needsUnlock) => {
        if (needsUnlock) setLocked(true)
      })
      .catch(() => {
        // En cas de doute, on ne verrouille pas — on ne bloque jamais l'accès.
      })

    const onChange = (state: AppStateStatus) => {
      if (state !== 'active') return
      shouldRequireUnlock()
        .then((needsUnlock) => {
          if (needsUnlock) setLocked(true)
        })
        .catch(() => {
          // En cas de doute, on ne verrouille pas — on ne bloque jamais l'accès.
        })
    }

    let sub: { remove: () => void } | null = null
    try {
      sub = AppState.addEventListener('change', onChange)
    } catch {
      // no-op — API AppState indisponible sur cette plateforme/appareil.
    }
    return () => {
      try { sub?.remove() } catch { /* no-op */ }
    }
  }, [])

  function handleUnlock() {
    setLocked(false)
    clearAppLock().catch(() => { /* no-op */ })
  }

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

  if (!fontsLoaded || !ready || !minSplash) return <Splash />

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
      <StatusBar style="dark" backgroundColor="#F4F8FE" />
      {/* Verrouillage biométrique/PIN : overlay plein écran par-dessus la
          navigation existante, affiché seulement quand un déverrouillage est
          requis (retour au premier plan après > 5 min en arrière-plan). */}
      {locked && session ? (
        <View style={StyleSheet.absoluteFill}>
          <LockScreen onUnlock={handleUnlock} />
        </View>
      ) : null}
    </>
  )
}
