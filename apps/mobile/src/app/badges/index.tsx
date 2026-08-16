import { useEffect, useState } from 'react'
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import { useRouter } from 'expo-router'
import { supabase } from '../../lib/supabase'
import { colors, radius, cardShadow, fonts } from '../../lib/theme'

// Catalogue miroir de apps/web|api/src/lib/xp.ts (BADGES).
const CATALOG: { code: string; label: string; icon: string; description: string }[] = [
  { code: 'first_steps',       label: 'Premiers pas',       icon: '🌱', description: 'Premier cours consulté' },
  { code: 'streak_3',          label: '3 jours consécutifs', icon: '🔥', description: 'Révise 3 jours d’affilée' },
  { code: 'streak_7',          label: 'Une semaine !',       icon: '💪', description: 'Révise 7 jours d’affilée' },
  { code: 'flashcard_veteran', label: 'Flashcard vétéran',   icon: '🃏', description: '50 flashcards révisées' },
  { code: 'curious_mind',      label: 'Esprit curieux',      icon: '🤔', description: '10 questions posées à Cognix' },
  { code: 'chapter_master',    label: 'Maître de chapitre',  icon: '🎓', description: 'Premier chapitre complété à 100%' },
]

export default function BadgesScreen() {
  const router = useRouter()
  const [earned, setEarned] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase.from('user_badges').select('badge_code').eq('user_id', user.id)
        setEarned(new Set((data ?? []).map((b: any) => b.badge_code)))
      }
      setLoading(false)
    })()
  }, [])

  if (loading) return <ActivityIndicator style={{ flex: 1, backgroundColor: colors.background }} color={colors.primary} />

  const earnedCount = CATALOG.filter((b) => earned.has(b.code)).length

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={12}><Text style={styles.back}>←</Text></TouchableOpacity>
        <Text style={styles.title}>Mes badges</Text>
        <View style={{ width: 20 }} />
      </View>

      <View style={styles.counter}>
        <Text style={styles.counterValue}>{earnedCount}<Text style={styles.counterTotal}> / {CATALOG.length}</Text></Text>
        <Text style={styles.counterLabel}>badges débloqués</Text>
      </View>

      <View style={styles.grid}>
        {CATALOG.map((b) => {
          const has = earned.has(b.code)
          return (
            <View key={b.code} style={[styles.badge, !has && styles.badgeLocked]}>
              <Text style={[styles.badgeIcon, !has && styles.iconLocked]}>{has ? b.icon : '🔒'}</Text>
              <Text style={[styles.badgeLabel, !has && styles.textLocked]}>{b.label}</Text>
              <Text style={[styles.badgeDesc, !has && styles.textLocked]}>{b.description}</Text>
            </View>
          )
        })}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, paddingTop: 56, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  back: { fontSize: 24, color: colors.text },
  title: { fontSize: 20, fontFamily: fonts.headingBlack, color: colors.text },
  counter: { backgroundColor: colors.primary, borderRadius: radius.xl, padding: 22, alignItems: 'center', marginBottom: 18, ...cardShadow },
  counterValue: { fontSize: 40, fontWeight: '900', color: '#fff' },
  counterTotal: { fontSize: 20, color: '#E7F0FD' },
  counterLabel: { fontSize: 13, color: '#E7F0FD', fontWeight: '700', marginTop: 2 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  badge: { width: '47%', flexGrow: 1, backgroundColor: colors.card, borderRadius: radius.lg, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: colors.cardBorder, ...cardShadow },
  badgeLocked: { backgroundColor: '#F1F4F9', borderColor: '#E3E9F2' },
  badgeIcon: { fontSize: 40, marginBottom: 8 },
  iconLocked: { opacity: 0.5 },
  badgeLabel: { fontSize: 14, fontWeight: '800', color: colors.text, textAlign: 'center' },
  badgeDesc: { fontSize: 11, color: colors.textMuted, textAlign: 'center', marginTop: 4, lineHeight: 15 },
  textLocked: { color: '#9AA6B5' },
})
