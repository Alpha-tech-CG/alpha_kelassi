import { useEffect, useState, useCallback } from 'react'
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import { useRouter, useFocusEffect, useLocalSearchParams } from 'expo-router'
import { supabase } from '../../lib/supabase'
import { API_URL } from '../../lib/config'
import { useLevel } from '../../hooks/useLevel'
import { colors, radius, cardShadow, fonts, subjectIcon } from '../../lib/theme'

interface Subject { id: string; name: string }
interface ProgChapter {
  id: string
  title: string
  domain_name: string
  month_label: string | null
  total_lessons: number
  completed_lessons: number
  is_completed: boolean
  is_unlocked: boolean
}

async function token() {
  const { data: { session } } = await supabase.auth.getSession()
  return session?.access_token
}

export default function ProgressionScreen() {
  const router = useRouter()
  const { subject: initialSubject, level: levelParam } = useLocalSearchParams<{ subject?: string; level?: string }>()
  const { level: profileLevel, ready: levelReady } = useLevel()
  // Un admin qui consulte une autre classe la transmet en paramètre.
  const level = levelParam ?? profileLevel
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [active, setActive] = useState<string | null>(initialSubject ?? null)
  const [chapters, setChapters] = useState<ProgChapter[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingList, setLoadingList] = useState(false)

  const loadSubjects = useCallback(async () => {
    if (!level) { setLoading(false); return }
    const { data } = await supabase.from('subjects').select('id, name').eq('level', level).is('parent_subject_id', null).order('display_order').order('name')
    const rows = (data ?? []) as Subject[]
    setSubjects(rows)
    setActive((cur) => cur ?? initialSubject ?? rows[0]?.id ?? null)
    setLoading(false)
  }, [initialSubject, level])

  const loadChapters = useCallback(async (subjectId: string) => {
    setLoadingList(true)
    const t = await token()
    const res = await fetch(`${API_URL}/api/curriculum/progression?subject=${subjectId}`, { headers: { Authorization: `Bearer ${t}` } })
    const json = await res.json().catch(() => ({}))
    setChapters(json?.data?.chapters ?? [])
    setLoadingList(false)
  }, [])

  useFocusEffect(useCallback(() => { if (levelReady) loadSubjects() }, [loadSubjects, levelReady]))
  useEffect(() => { if (active) loadChapters(active) }, [active, loadChapters])

  if (loading) return <ActivityIndicator style={{ flex: 1, backgroundColor: colors.background }} color={colors.primary} />

  const nextIndex = chapters.findIndex((c) => c.is_unlocked && !c.is_completed)

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={12}><Text style={styles.back}>←</Text></TouchableOpacity>
        <Text style={styles.title}>Progression</Text>
        <View style={{ width: 20 }} />
      </View>

      <View style={styles.tabs}>
        {subjects.map((s) => (
          <TouchableOpacity key={s.id} style={[styles.tab, active === s.id && styles.tabActive]} onPress={() => setActive(s.id)}>
            <Text style={[styles.tabText, active === s.id && styles.tabTextActive]}>{s.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {loadingList ? (
        <ActivityIndicator style={{ flex: 1 }} color={colors.primary} />
      ) : (
        <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
          {chapters.map((c, i) => {
            const isNext = i === nextIndex
            return (
              <View key={c.id} style={styles.row}>
                <View style={styles.rail}>
                  <View style={[styles.dot, c.is_completed && styles.dotDone, isNext && styles.dotNext]}>
                    <Text style={styles.dotText}>{c.is_completed ? '✓' : !c.is_unlocked ? '🔒' : i + 1}</Text>
                  </View>
                  {i < chapters.length - 1 && <View style={[styles.line, c.is_completed && styles.lineDone]} />}
                </View>
                <TouchableOpacity
                  style={[styles.card, !c.is_unlocked && styles.cardLocked, isNext && styles.cardNext]}
                  activeOpacity={c.is_unlocked ? 0.85 : 1}
                  disabled={!c.is_unlocked}
                  onPress={() => router.push(`/chapitre/${c.id}` as any)}
                >
                  <Text style={{ fontSize: 20 }}>{subjectIcon(c.domain_name)}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.cardTitle, !c.is_unlocked && styles.textLocked]} numberOfLines={1}>{c.title}</Text>
                    <Text style={styles.cardSub} numberOfLines={1}>{c.domain_name}{c.month_label ? ` · ${c.month_label}` : ''}</Text>
                  </View>
                  {c.is_unlocked && c.total_lessons > 0 && (
                    <Text style={styles.cardPct}>{Math.round((c.completed_lessons / c.total_lessons) * 100)}%</Text>
                  )}
                </TouchableOpacity>
              </View>
            )
          })}
          {chapters.length === 0 && <Text style={styles.empty}>Aucun chapitre pour cette matière.</Text>}
        </ScrollView>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 56, paddingBottom: 12 },
  back: { fontSize: 24, color: colors.text },
  title: { fontSize: 20, fontFamily: fonts.headingBlack, color: colors.text },
  tabs: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingBottom: 14 },
  tab: { flex: 1, paddingVertical: 9, borderRadius: radius.full, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.cardBorder, alignItems: 'center' },
  tabActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  tabText: { fontSize: 12, fontWeight: '800', color: colors.textMuted },
  tabTextActive: { color: '#fff' },
  list: { paddingHorizontal: 16, paddingBottom: 40 },
  row: { flexDirection: 'row', gap: 12 },
  rail: { alignItems: 'center', width: 32 },
  dot: { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.card, borderWidth: 2, borderColor: colors.cardBorder, alignItems: 'center', justifyContent: 'center' },
  dotDone: { backgroundColor: colors.primary, borderColor: colors.primary },
  dotNext: { borderColor: colors.primary },
  dotText: { fontSize: 11, fontWeight: '900', color: colors.textMuted },
  line: { width: 2, flex: 1, minHeight: 24, backgroundColor: colors.cardBorder, marginVertical: 2 },
  lineDone: { backgroundColor: colors.primary },
  card: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.card, borderRadius: radius.md, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: colors.cardBorder, ...cardShadow },
  cardLocked: { backgroundColor: '#F1F4F9', borderColor: '#E3E9F2' },
  cardNext: { borderColor: colors.primary, borderWidth: 1.5 },
  cardTitle: { fontSize: 13, fontWeight: '800', color: colors.text },
  cardSub: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  cardPct: { fontSize: 11, fontWeight: '900', color: colors.primary },
  textLocked: { color: colors.textMuted },
  empty: { textAlign: 'center', color: colors.textMuted, paddingTop: 40 },
})
