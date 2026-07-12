import { useEffect, useState, useMemo } from 'react'
import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import { useRouter } from 'expo-router'
import { supabase } from '../../lib/supabase'
import { useLevel } from '../../hooks/useLevel'
import { colors, radius, cardShadow, LEVEL_LABEL, levelBadgeStyle, subjectAccent, subjectIcon } from '../../lib/theme'

interface Subject {
  id: string
  name: string
  level: string
  icon: string | null
  lessons: number
  quizzes: number
  progress: number // 0..100
}

export default function MatieresScreen() {
  const router = useRouter()
  const { level, ready } = useLevel()
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (!ready) return
    async function load() {
      // Matières du niveau de l'élève uniquement
      let sq = supabase.from('subjects').select('id, name, level, icon').order('name')
      if (level) sq = sq.eq('level', level)
      const [{ data: subs }, docs, quiz, prog] = await Promise.all([
        sq,
        supabase.from('courses').select('subject_id').then((r) => r.data ?? []),
        supabase.from('quizzes').select('subject_id').then((r) => r.data ?? []),
        (async () => {
          const { data: { user } } = await supabase.auth.getUser()
          if (!user) return []
          const { data } = await supabase.from('user_progress').select('subject_id, score_avg').eq('user_id', user.id)
          return data ?? []
        })(),
      ])

      const lessonCount = new Map<string, number>()
      for (const d of docs as { subject_id: string }[]) lessonCount.set(d.subject_id, (lessonCount.get(d.subject_id) ?? 0) + 1)
      const quizCount = new Map<string, number>()
      for (const q of quiz as { subject_id: string }[]) quizCount.set(q.subject_id, (quizCount.get(q.subject_id) ?? 0) + 1)
      const progMap = new Map<string, number>()
      for (const p of prog as { subject_id: string; score_avg: number | null }[]) progMap.set(p.subject_id, Math.round((p.score_avg ?? 0) * 100))

      setSubjects((subs ?? []).map((s: any) => ({
        id: s.id, name: s.name, level: s.level, icon: s.icon,
        lessons: lessonCount.get(s.id) ?? 0,
        quizzes: quizCount.get(s.id) ?? 0,
        progress: Math.min(progMap.get(s.id) ?? 0, 100),
      })))
      setLoading(false)
    }
    load()
  }, [ready, level])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return q ? subjects.filter((s) => s.name.toLowerCase().includes(q)) : subjects
  }, [subjects, search])

  if (loading) return <ActivityIndicator style={{ flex: 1, backgroundColor: colors.background }} color={colors.primary} />

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mes Matières</Text>
        {level && <Text style={styles.subtitle}>Programme {LEVEL_LABEL[level]}</Text>}
        <TextInput
          style={styles.search}
          placeholder="Rechercher une matière…"
          value={search}
          onChangeText={setSearch}
          placeholderTextColor={colors.outline}
        />
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        {filtered.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>📚</Text>
            <Text style={styles.emptyText}>
              {level ? 'Aucune matière pour ton niveau pour le moment.' : 'Termine ton inscription pour voir tes matières.'}
            </Text>
          </View>
        ) : (
          filtered.map((s) => {
            const accent = subjectAccent(s.name)
            const badge = levelBadgeStyle(s.level)
            return (
              <TouchableOpacity
                key={s.id}
                activeOpacity={0.85}
                style={styles.card}
                onPress={() => router.push(`/matiere/${s.id}` as any)}
              >
                <View style={[styles.accent, { backgroundColor: accent }]} />
                <View style={styles.cardBody}>
                  <View style={styles.cardTop}>
                    <View style={[styles.iconBox, { backgroundColor: accent + '1A' }]}>
                      <Text style={styles.iconText}>{s.icon || subjectIcon(s.name)}</Text>
                    </View>
                    <View style={[styles.badge, { backgroundColor: badge.bg }]}>
                      <Text style={[styles.badgeText, { color: badge.fg }]}>{LEVEL_LABEL[s.level]}</Text>
                    </View>
                  </View>

                  <Text style={styles.subjectName}>{s.name}</Text>
                  <Text style={styles.counts}>📘 {s.lessons} Cours   ✅ {s.quizzes} Quiz</Text>

                  <View style={styles.progressRow}>
                    <Text style={styles.progressLabel}>Progression</Text>
                    <Text style={[styles.progressPct, { color: accent }]}>{s.progress}%</Text>
                  </View>
                  <View style={styles.progressTrack}>
                    <View style={[styles.progressFill, { width: `${s.progress}%`, backgroundColor: accent }]} />
                  </View>
                </View>
              </TouchableOpacity>
            )
          })
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingTop: 60, paddingHorizontal: 16, paddingBottom: 12 },
  title: { fontSize: 26, fontWeight: '800', color: colors.text },
  subtitle: { fontSize: 13, color: colors.textMuted, marginTop: 2, marginBottom: 12 },
  search: {
    backgroundColor: colors.card, borderWidth: 1, borderColor: colors.cardBorder, borderRadius: radius.md,
    paddingHorizontal: 14, paddingVertical: 11, fontSize: 15, color: colors.text, marginTop: 4,
  },
  list: { padding: 16, paddingTop: 4, gap: 14 },
  card: {
    flexDirection: 'row', backgroundColor: colors.card, borderRadius: radius.lg, overflow: 'hidden',
    borderWidth: 1, borderColor: colors.cardBorder, ...cardShadow,
  },
  accent: { width: 5 },
  cardBody: { flex: 1, padding: 16 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  iconBox: { width: 48, height: 48, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  iconText: { fontSize: 24 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.full },
  badgeText: { fontSize: 11, fontWeight: '800' },
  subjectName: { fontSize: 19, fontWeight: '800', color: colors.text, marginTop: 12 },
  counts: { fontSize: 13, color: colors.textMuted, marginTop: 4 },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 14 },
  progressLabel: { fontSize: 13, color: colors.textMuted },
  progressPct: { fontSize: 15, fontWeight: '800' },
  progressTrack: { height: 8, backgroundColor: colors.primaryTint, borderRadius: radius.full, marginTop: 6, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: radius.full },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyIcon: { fontSize: 40, marginBottom: 12 },
  emptyText: { fontSize: 14, color: colors.textMuted, textAlign: 'center', paddingHorizontal: 30 },
})
