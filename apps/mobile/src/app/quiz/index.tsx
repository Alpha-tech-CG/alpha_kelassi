import { useEffect, useState } from 'react'
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import { useRouter } from 'expo-router'
import { supabase } from '../../lib/supabase'
import { API_URL } from '../../lib/config'
import { useLevel } from '../../hooks/useLevel'
import { colors, radius, cardShadow } from '../../lib/theme'

interface Quiz {
  id: string
  title: string
  level: string
  time_limit_sec: number
  is_premium: boolean
  subjects: { name: string } | null
}
interface WeakArea { subject_id: string; subject_name: string; error_rate: number }

export default function QuizListScreen() {
  const router = useRouter()
  const { level, ready } = useLevel()
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [weak, setWeak] = useState<WeakArea[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!ready) return
    async function load() {
      const { data: { session } } = await supabase.auth.getSession()
      const headers = { Authorization: `Bearer ${session?.access_token}` }
      const q = level ? `?level=${level}` : ''
      const [quizRes, weakRes] = await Promise.all([
        fetch(`${API_URL}/api/quiz${q}`, { headers }).then((r) => r.json()),
        fetch(`${API_URL}/api/quiz/weak-areas`, { headers }).then((r) => r.json()),
      ])
      setQuizzes(quizRes.data ?? [])
      setWeak(weakRes.data ?? [])
      setLoading(false)
    }
    load()
  }, [ready, level])

  if (loading) return <ActivityIndicator style={{ flex: 1, backgroundColor: colors.background }} color={colors.primary} />

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={12}><Text style={styles.back}>←</Text></TouchableOpacity>
        <Text style={styles.title}>QCM chronométrés</Text>
        <View style={{ width: 24 }} />
      </View>

      {weak.length > 0 && (
        <View style={styles.weakCard}>
          <Text style={styles.weakTitle}>⚠️  Tes points faibles</Text>
          {weak.map((w) => (
            <View key={w.subject_id} style={styles.weakRow}>
              <Text style={styles.weakSubject}>{w.subject_name}</Text>
              <Text style={styles.weakRate}>{w.error_rate}% d'erreurs</Text>
            </View>
          ))}
        </View>
      )}

      {quizzes.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>✅</Text>
          <Text style={styles.emptyText}>Aucun QCM disponible pour le moment.</Text>
        </View>
      ) : (
        quizzes.map((quiz) => (
          <TouchableOpacity key={quiz.id} style={styles.quizCard} onPress={() => router.push(`/quiz/${quiz.id}` as any)}>
            <View style={styles.quizIcon}><Text style={{ fontSize: 20 }}>✅</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.quizTitle} numberOfLines={1}>{quiz.title} {quiz.is_premium ? '⭐' : ''}</Text>
              <Text style={styles.quizMeta}>
                {quiz.subjects?.name ? `${quiz.subjects.name} · ` : ''}{Math.round(quiz.time_limit_sec / 60)} min
              </Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, paddingTop: 56 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 },
  back: { fontSize: 24, color: colors.text },
  title: { fontSize: 20, fontWeight: '800', color: colors.text },
  weakCard: { backgroundColor: '#FFFBEB', borderWidth: 1, borderColor: colors.yellow, borderRadius: radius.lg, padding: 16, marginBottom: 16 },
  weakTitle: { fontSize: 14, fontWeight: '800', color: colors.onYellow, marginBottom: 8 },
  weakRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  weakSubject: { fontSize: 13, color: colors.text },
  weakRate: { fontSize: 13, fontWeight: '700', color: '#B45309' },
  empty: { alignItems: 'center', paddingTop: 50 },
  emptyIcon: { fontSize: 40, marginBottom: 12 },
  emptyText: { fontSize: 14, color: colors.textMuted, textAlign: 'center' },
  quizCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: radius.md, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: colors.cardBorder, gap: 12, ...cardShadow },
  quizIcon: { width: 44, height: 44, borderRadius: radius.sm, backgroundColor: colors.primaryTint, alignItems: 'center', justifyContent: 'center' },
  quizTitle: { fontSize: 15, fontWeight: '700', color: colors.text },
  quizMeta: { fontSize: 12, color: colors.textMuted, marginTop: 3 },
  chevron: { fontSize: 24, color: colors.outlineVariant },
})
