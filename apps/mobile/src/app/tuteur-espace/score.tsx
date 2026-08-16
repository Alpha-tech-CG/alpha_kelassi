import { useState, useCallback } from 'react'
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import { useRouter, useFocusEffect } from 'expo-router'
import { supabase } from '../../lib/supabase'
import { API_URL } from '../../lib/config'
import { colors, radius, cardShadow, fonts } from '../../lib/theme'

interface Rating { clarity: number; quality: number; comment: string | null; created_at: string }

async function token() {
  const { data: { session } } = await supabase.auth.getSession()
  return session?.access_token
}

function Stars({ n }: { n: number }) {
  return <Text style={{ color: colors.yellow, fontSize: 14, letterSpacing: 1 }}>{'★'.repeat(n)}<Text style={{ color: colors.cardBorder }}>{'★'.repeat(5 - n)}</Text></Text>
}

export default function ScoreScreen() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [score, setScore] = useState(0)
  const [ratings, setRatings] = useState<Rating[]>([])

  const load = useCallback(async () => {
    const t = await token()
    const res = await fetch(`${API_URL}/api/tutor/score`, { headers: { Authorization: `Bearer ${t}` } })
    const json = await res.json().catch(() => ({}))
    setScore(json.data?.score ?? 0)
    setRatings(json.data?.ratings ?? [])
    setLoading(false)
  }, [])
  useFocusEffect(useCallback(() => { load() }, [load]))

  if (loading) return <ActivityIndicator style={{ flex: 1, backgroundColor: colors.background }} color={colors.primary} />

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Text style={styles.back}>←</Text></TouchableOpacity>
        <Text style={styles.title}>Score & avis</Text>
        <View style={{ width: 20 }} />
      </View>

      <View style={styles.scoreCard}>
        <Text style={styles.scoreValue}>{score.toFixed(1)}<Text style={styles.scoreUnit}> /5</Text></Text>
        <Text style={styles.scoreLabel}>Score global · {ratings.length} avis</Text>
      </View>

      <Text style={styles.sectionTitle}>Avis des élèves</Text>
      {ratings.length === 0 ? (
        <Text style={styles.empty}>Pas encore d’avis. Ils apparaîtront après tes premières corrections notées.</Text>
      ) : (
        ratings.map((r, i) => (
          <View key={i} style={styles.ratingCard}>
            <View style={styles.ratingHead}>
              <View style={styles.ratingRow}><Text style={styles.ratingCrit}>Clarté</Text><Stars n={r.clarity} /></View>
              <View style={styles.ratingRow}><Text style={styles.ratingCrit}>Qualité</Text><Stars n={r.quality} /></View>
            </View>
            {r.comment ? <Text style={styles.comment}>“{r.comment}”</Text> : null}
            <Text style={styles.ratingDate}>{new Date(r.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}</Text>
          </View>
        ))
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingTop: 56, paddingBottom: 50 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 },
  back: { fontSize: 24, color: colors.text },
  title: { fontSize: 20, fontFamily: fonts.headingBlack, color: colors.text },
  scoreCard: { backgroundColor: colors.card, borderRadius: radius.xl, padding: 26, alignItems: 'center', borderWidth: 1, borderColor: colors.cardBorder, ...cardShadow },
  scoreValue: { fontSize: 46, fontWeight: '900', color: colors.primary },
  scoreUnit: { fontSize: 20, color: colors.textMuted, fontWeight: '700' },
  scoreLabel: { fontSize: 13, color: colors.textMuted, fontWeight: '700', marginTop: 4 },
  sectionTitle: { fontSize: 16, fontWeight: '900', color: colors.text, marginTop: 26, marginBottom: 12 },
  empty: { fontSize: 13, color: colors.textMuted, lineHeight: 19 },
  ratingCard: { backgroundColor: colors.card, borderRadius: radius.lg, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: colors.cardBorder, ...cardShadow },
  ratingHead: { gap: 6 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  ratingCrit: { fontSize: 13, color: colors.textMuted, fontWeight: '700' },
  comment: { fontSize: 14, color: colors.text, fontStyle: 'italic', marginTop: 10, lineHeight: 20 },
  ratingDate: { fontSize: 11, color: colors.textMuted, marginTop: 10 },
})
