import { useEffect, useState } from 'react'
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { supabase } from '../../lib/supabase'
import { colors, radius, cardShadow, subjectAccent, subjectIcon } from '../../lib/theme'

interface Doc { id: string; title: string; year: number | null; is_premium: boolean }

export default function MatiereDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const [name, setName] = useState('')
  const [icon, setIcon] = useState<string | null>(null)
  const [lessons, setLessons] = useState<Doc[]>([])
  const [quizCount, setQuizCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [{ data: subj }, { data: docs }, { count }] = await Promise.all([
        supabase.from('subjects').select('name, icon').eq('id', id).single(),
        supabase.from('documents').select('id, title, year, is_premium').eq('subject_id', id).eq('type', 'cours').order('created_at', { ascending: false }),
        supabase.from('quizzes').select('id', { count: 'exact', head: true }).eq('subject_id', id),
      ])
      setName((subj as { name?: string })?.name ?? 'Matière')
      setIcon((subj as { icon?: string | null })?.icon ?? null)
      setLessons((docs ?? []) as Doc[])
      setQuizCount(count ?? 0)
      setLoading(false)
    }
    load()
  }, [id])

  if (loading) return <ActivityIndicator style={{ flex: 1, backgroundColor: colors.background }} color={colors.primary} />

  const accent = subjectAccent(name)

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={12}><Text style={styles.back}>←</Text></TouchableOpacity>
        <View style={[styles.iconBox, { backgroundColor: accent + '1A' }]}>
          <Text style={styles.iconText}>{icon || subjectIcon(name)}</Text>
        </View>
        <Text style={styles.title}>{name}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Accès QCM de la matière */}
        <TouchableOpacity style={[styles.quizBanner, { backgroundColor: accent }]} onPress={() => router.push('/quiz/index' as any)}>
          <View>
            <Text style={styles.quizBannerTitle}>QCM chronométrés</Text>
            <Text style={styles.quizBannerSub}>{quizCount} quiz disponible{quizCount > 1 ? 's' : ''} pour t'entraîner</Text>
          </View>
          <Text style={styles.quizBannerArrow}>›</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Leçons</Text>
        {lessons.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Aucune leçon pour cette matière pour le moment.</Text>
          </View>
        ) : (
          lessons.map((d, i) => (
            <TouchableOpacity key={d.id} style={styles.lessonRow} onPress={() => router.push(`/cours/${d.id}` as any)}>
              <View style={[styles.lessonNum, { backgroundColor: accent + '1A' }]}>
                <Text style={[styles.lessonNumText, { color: accent }]}>{i + 1}</Text>
              </View>
              <Text style={styles.lessonTitle} numberOfLines={2}>{d.title}</Text>
              {d.is_premium && <Text style={styles.premium}>⭐</Text>}
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingTop: 56, paddingHorizontal: 16, paddingBottom: 16, alignItems: 'center' },
  back: { position: 'absolute', left: 16, top: 56, fontSize: 24, color: colors.text },
  iconBox: { width: 64, height: 64, borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  iconText: { fontSize: 32 },
  title: { fontSize: 24, fontWeight: '800', color: colors.text },
  content: { padding: 16, gap: 10 },
  quizBanner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderRadius: radius.lg, padding: 18, ...cardShadow },
  quizBannerTitle: { color: '#fff', fontSize: 16, fontWeight: '800' },
  quizBannerSub: { color: '#ffffffcc', fontSize: 13, marginTop: 3 },
  quizBannerArrow: { color: '#fff', fontSize: 28, fontWeight: '300' },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: colors.text, marginTop: 10, marginBottom: 2 },
  lessonRow: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: radius.md,
    padding: 14, borderWidth: 1, borderColor: colors.cardBorder, gap: 12,
  },
  lessonNum: { width: 32, height: 32, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center' },
  lessonNumText: { fontSize: 14, fontWeight: '800' },
  lessonTitle: { flex: 1, fontSize: 15, fontWeight: '600', color: colors.text },
  premium: { fontSize: 14 },
  chevron: { fontSize: 22, color: colors.outlineVariant },
  empty: { backgroundColor: colors.card, borderRadius: radius.md, borderWidth: 1, borderColor: colors.cardBorder, padding: 24, alignItems: 'center' },
  emptyText: { fontSize: 14, color: colors.textMuted, textAlign: 'center' },
})
