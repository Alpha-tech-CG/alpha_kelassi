import { useEffect, useState } from 'react'
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import { useRouter } from 'expo-router'
import { supabase } from '../../lib/supabase'

interface Quiz {
  id: string
  title: string
  level: string
  time_limit_sec: number
  is_premium: boolean
  subjects: { name: string } | null
}
interface WeakArea { subject_id: string; subject_name: string; error_rate: number }

const API_URL = process.env['EXPO_PUBLIC_API_URL'] ?? 'http://localhost:3001'

export default function QuizListScreen() {
  const router = useRouter()
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [weak, setWeak] = useState<WeakArea[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token
      const headers = { Authorization: `Bearer ${token}` }
      const [q, w] = await Promise.all([
        fetch(`${API_URL}/api/quiz`, { headers }).then((r) => r.json()),
        fetch(`${API_URL}/api/quiz/weak-areas`, { headers }).then((r) => r.json()),
      ])
      setQuizzes(q.data ?? [])
      setWeak(w.data ?? [])
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <ActivityIndicator style={{ flex: 1 }} color="#2563eb" />

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Text style={styles.back}>←</Text></TouchableOpacity>
        <Text style={styles.title}>QCM chronométrés</Text>
        <View style={{ width: 20 }} />
      </View>

      {weak.length > 0 && (
        <View style={styles.weakCard}>
          <Text style={styles.weakTitle}>⚠️ Tes points faibles</Text>
          {weak.map((w) => (
            <View key={w.subject_id} style={styles.weakRow}>
              <Text style={styles.weakSubject}>{w.subject_name}</Text>
              <Text style={styles.weakRate}>{w.error_rate}% d'erreurs</Text>
            </View>
          ))}
        </View>
      )}

      {quizzes.length === 0 ? (
        <Text style={styles.empty}>Aucun QCM disponible pour le moment.</Text>
      ) : (
        quizzes.map((quiz) => (
          <TouchableOpacity
            key={quiz.id}
            style={styles.quizCard}
            onPress={() => router.push(`/quiz/${quiz.id}` as any)}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.quizTitle} numberOfLines={1}>
                {quiz.title} {quiz.is_premium ? '⭐' : ''}
              </Text>
              <Text style={styles.quizMeta}>
                {quiz.subjects?.name ? `${quiz.subjects.name} · ` : ''}
                {quiz.level.replace('_', ' ').toUpperCase()} · {Math.round(quiz.time_limit_sec / 60)} min
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
  container: { flex: 1, backgroundColor: '#f9fafb' },
  content: { padding: 20, paddingTop: 60 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  back: { fontSize: 22, color: '#6b7280' },
  title: { fontSize: 18, fontWeight: '700', color: '#111827' },
  weakCard: { backgroundColor: '#fffbeb', borderWidth: 1, borderColor: '#fde68a', borderRadius: 14, padding: 14, marginBottom: 16 },
  weakTitle: { fontSize: 13, fontWeight: '700', color: '#92400e', marginBottom: 8 },
  weakRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  weakSubject: { fontSize: 13, color: '#92400e' },
  weakRate: { fontSize: 13, fontWeight: '600', color: '#b45309' },
  empty: { textAlign: 'center', color: '#9ca3af', marginTop: 40 },
  quizCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 14, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: '#f3f4f6' },
  quizTitle: { fontSize: 15, fontWeight: '600', color: '#111827' },
  quizMeta: { fontSize: 12, color: '#9ca3af', marginTop: 3 },
  chevron: { fontSize: 24, color: '#d1d5db' },
})
