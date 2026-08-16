import { useEffect, useState, useMemo } from 'react'
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { supabase } from '../../lib/supabase'
import { useLevel } from '../../hooks/useLevel'
import { colors, radius, cardShadow, fonts, subjectIcon } from '../../lib/theme'

interface ExamQuiz {
  id: string; title: string; year: number | null; time_limit_sec: number; is_premium: boolean
  subjects: { name: string } | null
}

const MODES: { key: string; label: string; desc: string; emoji: string }[] = [
  { key: 'entrainement', label: 'Entraînement libre', desc: 'Sans chrono, sans pression',    emoji: '🎯' },
  { key: 'bac_test',     label: 'Bac test',           desc: 'Chronométré, comme le vrai',    emoji: '⏱️' },
  { key: 'bac_blanc',    label: 'Bac blanc',          desc: 'Chronométré + note',            emoji: '📝' },
  { key: 'bac_rouge',    label: 'Bac rouge',          desc: 'Difficile : −1 par erreur',     emoji: '🔴' },
]

export default function SimulationsScreen() {
  const router = useRouter()
  const { level, ready } = useLevel()
  const [quizzes, setQuizzes] = useState<ExamQuiz[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!ready) return
    let q = supabase.from('quizzes')
      .select('id, title, year, time_limit_sec, is_premium, subjects(name)')
      .eq('is_exam', true).order('year', { ascending: false }).limit(200)
    if (level) q = q.eq('level', level)
    q.then(({ data }) => {
      setQuizzes((data ?? []).map((row: any) => ({
        ...row, subjects: Array.isArray(row.subjects) ? (row.subjects[0] ?? null) : row.subjects,
      })) as ExamQuiz[])
      setLoading(false)
    })
  }, [ready, level])

  const byYear = useMemo(() => {
    const map = new Map<string, ExamQuiz[]>()
    for (const qz of quizzes) {
      const y = qz.year ? String(qz.year) : 'Autres'
      if (!map.has(y)) map.set(y, [])
      map.get(y)!.push(qz)
    }
    return [...map.entries()].sort((a, b) => b[0].localeCompare(a[0]))
  }, [quizzes])

  function chooseMode(qz: ExamQuiz) {
    Alert.alert(qz.title, 'Choisis ton mode de simulation', [
      ...MODES.map((m) => ({ text: `${m.emoji}  ${m.label}`, onPress: () => router.push(`/quiz/${qz.id}?mode=${m.key}`) })),
      { text: 'Annuler', style: 'cancel' as const },
    ])
  }

  if (loading) return <ActivityIndicator style={{ flex: 1, backgroundColor: colors.background }} color={colors.primary} />

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={12}><Text style={styles.back}>←</Text></TouchableOpacity>
        <Text style={styles.title}>Simulations d'examen</Text>
      </View>

      {/* Légende des modes */}
      <View style={styles.legend}>
        {MODES.map((m) => (
          <View key={m.key} style={styles.legendItem}>
            <Text style={styles.legendEmoji}>{m.emoji}</Text>
            <Text style={styles.legendLabel}>{m.label}</Text>
          </View>
        ))}
      </View>

      {quizzes.length === 0 ? (
        <View style={styles.empty}><Text style={styles.emptyText}>Aucune annale disponible pour ton niveau pour l'instant.</Text></View>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          {byYear.map(([year, list]) => (
            <View key={year} style={{ marginBottom: 20 }}>
              <Text style={styles.yearTitle}>Session {year}</Text>
              {list.map((qz) => (
                <TouchableOpacity key={qz.id} style={styles.card} onPress={() => chooseMode(qz)} activeOpacity={0.9}>
                  <View style={styles.cardIcon}><Text style={{ fontSize: 22 }}>{subjectIcon(qz.subjects?.name ?? '')}</Text></View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardTitle} numberOfLines={2}>{qz.title} {qz.is_premium ? '⭐' : ''}</Text>
                    <Text style={styles.cardSub}>{qz.subjects?.name ?? 'Examen'} · {Math.round(qz.time_limit_sec / 60)} min</Text>
                  </View>
                  <Text style={styles.chevron}>›</Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingTop: 56, paddingHorizontal: 16, paddingBottom: 8 },
  back: { fontSize: 24, color: colors.text, marginBottom: 8 },
  title: { fontSize: 22, fontFamily: fonts.headingBlack, color: colors.text },
  legend: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 16, marginBottom: 8 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.cardBorder, borderRadius: radius.full, paddingHorizontal: 10, paddingVertical: 5 },
  legendEmoji: { fontSize: 12 },
  legendLabel: { fontSize: 11, fontWeight: '700', color: colors.textMuted },
  content: { padding: 16, paddingBottom: 40 },
  yearTitle: { fontSize: 15, fontWeight: '900', color: colors.text, marginBottom: 10 },
  card: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.card, borderRadius: radius.lg, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: colors.cardBorder, ...cardShadow },
  cardIcon: { width: 46, height: 46, borderRadius: 14, backgroundColor: colors.primaryTint, alignItems: 'center', justifyContent: 'center' },
  cardTitle: { fontSize: 15, fontWeight: '800', color: colors.text },
  cardSub: { fontSize: 12, color: colors.textMuted, marginTop: 3 },
  chevron: { fontSize: 22, color: colors.primary },
  empty: { alignItems: 'center', paddingTop: 60, paddingHorizontal: 40 },
  emptyText: { fontSize: 14, color: colors.textMuted, textAlign: 'center' },
})
