import { useEffect, useState } from 'react'
import { Stack, useRouter, useSegments } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { DatabaseProvider } from '@nozbe/watermelondb/react'
import { database } from '../db'
import { supabase } from '../lib/supabase'
import type { Session } from '@supabase/supabase-js'

function AuthGuard({ session }: { session: Session | null }) {
  const segments = useSegments()
  const router = useRouter()

  useEffect(() => {
    const inAuth       = segments[0] === '(auth)'
    const inOnboarding = segments[0] === 'onboarding'

    if (!session && !inAuth) {
      router.replace('/(auth)/login')
      return
    }
    if (session && inAuth) {
      // Vérifie si l'onboarding est déjà fait
      supabase.from('users').select('onboarding_completed').eq('id', session.user.id).single()
        .then(({ data }) => {
          if (!data?.onboarding_completed) {
            router.replace('/onboarding' as any)
          } else {
            router.replace('/(tabs)/')
          }
        })
      return
    }
    if (session && !inOnboarding && !inAuth) {
      // Vérifie onboarding seulement au premier rendu (segments[0] === undefined = root)
      if (!segments[0]) {
        supabase.from('users').select('onboarding_completed').eq('id', session.user.id).single()
          .then(({ data }) => {
            if (!data?.onboarding_completed) router.replace('/onboarding' as any)
          })
      }
    }
  }, [session, segments])

  return null
}

export default function RootLayout() {
  const [session, setSession] = useState<Session | null>(null)
  const [ready, setReady] = useState(false)

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

  if (!ready) return null

  return (
    <DatabaseProvider database={database}>
      <AuthGuard session={session} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="cours/[id]" options={{ headerShown: true, title: '' }} />
        <Stack.Screen name="examens/[id]" options={{ headerShown: true, title: '' }} />
        <Stack.Screen name="flashcards/index" options={{ headerShown: true, title: 'Flashcards' }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false, gestureEnabled: false }} />
      </Stack>
      <StatusBar style="dark" backgroundColor="#F7FAF8" />
    </DatabaseProvider>
  )
}
