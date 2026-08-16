import { useEffect, useState, useCallback } from 'react'
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native'
import { useRouter, useFocusEffect } from 'expo-router'
import { supabase } from '../../lib/supabase'
import { API_URL } from '../../lib/config'
import { colors, radius, cardShadow, fonts, subjectIcon } from '../../lib/theme'

interface CalItem {
  id: string
  chapter_id: string
  subject_id: string
  chapters: { id: string; title: string } | null
  subjects: { id: string; name: string; parent_subject_id: string | null } | null
  weakness_score?: number
  overdue_days?: number
}
interface CalendarState {
  year: { label: string } | null
  term: { id: string; label: string; term_number: number } | null
  month: { id: string; label: string } | null
  is_holiday: boolean
}
interface ExamSuggestion {
  available: boolean
  is_dedicated: boolean
  is_suggested_fallback: boolean
  quiz: { id: string; title: string } | null
}

async function token() {
  const { data: { session } } = await supabase.auth.getSession()
  return session?.access_token
}

export default function CalendrierScreen() {
  const router = useRouter()
  const [calendar, setCalendar] = useState<CalendarState | null>(null)
  const [thisMonth, setThisMonth] = useState<CalItem[]>([])
  const [revision, setRevision] = useState<CalItem[]>([])
  const [exam, setExam] = useState<ExamSuggestion | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const load = useCallback(async () => {
    const t = await token()
    const headers = { Authorization: `Bearer ${t}` }

    const [calRes, unlockedRes, revRes] = await Promise.all([
      fetch(`${API_URL}/api/curriculum/calendar/current`, { headers }).then((r) => r.json()).catch(() => ({})),
      fetch(`${API_URL}/api/curriculum/unlocked`, { headers }).then((r) => r.json()).catch(() => ({})),
      fetch(`${API_URL}/api/curriculum/revision-session?limit=8`, { headers }).then((r) => r.json()).catch(() => ({})),
    ])

    const cal: CalendarState | null = calRes?.data ?? null
    setCalendar(cal)

    const allUnlocked: CalItem[] = unlockedRes?.data?.items ?? []
    setThisMonth(cal?.month ? allUnlocked.filter((it: any) => it.school_month_id === cal.month!.id) : [])
    setRevision(revRes?.data?.items ?? [])

    if (cal?.term?.id) {
      const termRes = await fetch(`${API_URL}/api/curriculum/term-exam/${cal.term.id}`, { headers }).then((r) => r.json()).catch(() => ({}))
      setExam(termRes?.data ?? null)
    } else {
      setExam(null)
    }

    setLoading(false)
    setRefreshing(false)
  }, [])

  useFocusEffect(useCallback(() => { load() }, [load]))

  const onRefresh = () => { setRefreshing(true); load() }

  if (loading) return <ActivityIndicator style={{ flex: 1, backgroundColor: colors.background }} color={colors.primary} />

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={12}><Text style={styles.back}>←</Text></TouchableOpacity>
        <Text style={styles.title}>Calendrier scolaire</Text>
        <View style={{ width: 20 }} />
      </View>

      <View style={styles.banner}>
        <Text style={styles.bannerMonth}>{calendar?.month?.label ?? 'Calendrier CEPE'}</Text>
        <Text style={styles.bannerTerm}>{calendar?.term?.label ?? ''}{calendar?.year?.label ? ` · ${calendar.year.label}` : ''}</Text>
        {calendar?.is_holiday && <Text style={styles.bannerHoliday}>🏖️ Hors période scolaire — dernier mois affiché</Text>}
      </View>

      <Section title="Ce mois-ci" emptyText="Rien de programmé pour ce mois.">
        {thisMonth.map((it) => (
          <ChapterRow key={it.id} item={it} onPress={() => router.push(`/chapitre/${it.chapter_id}` as any)} />
        ))}
      </Section>

      <Section title="À réviser" emptyText="Rien à réviser pour l'instant — continue comme ça !">
        {revision.map((it) => (
          <ChapterRow
            key={it.id}
            item={it}
            onPress={() => router.push(`/chapitre/${it.chapter_id}` as any)}
            badge={it.weakness_score !== undefined ? (it.weakness_score >= 50 ? '⚠️ À revoir' : '🔁 Entretien') : undefined}
          />
        ))}
      </Section>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Prochain examen</Text>
        {exam?.available && exam.quiz ? (
          <TouchableOpacity style={styles.examCard} onPress={() => router.push(`/quiz/${exam.quiz!.id}` as any)} activeOpacity={0.85}>
            <Text style={styles.examIcon}>📝</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.examTitle} numberOfLines={2}>{exam.quiz.title}</Text>
              <Text style={styles.examSub}>{exam.is_dedicated ? 'Composition du trimestre' : 'Annale suggérée'}</Text>
            </View>
            <Text style={styles.examArrow}>→</Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.empty}>Pas encore de composition programmée ce trimestre.</Text>
        )}
      </View>
    </ScrollView>
  )
}

function Section({ title, emptyText, children }: { title: string; emptyText: string; children: React.ReactNode }) {
  const items = Array.isArray(children) ? children : [children]
  const hasItems = items.some((c) => c)
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {hasItems ? <View style={{ gap: 10 }}>{children}</View> : <Text style={styles.empty}>{emptyText}</Text>}
    </View>
  )
}

function ChapterRow({ item, onPress, badge }: { item: CalItem; onPress: () => void; badge?: string | undefined }) {
  const subjectName = item.subjects?.name ?? ''
  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.rowIcon}><Text style={{ fontSize: 20 }}>{subjectIcon(subjectName)}</Text></View>
      <View style={{ flex: 1 }}>
        <Text style={styles.rowTitle} numberOfLines={1}>{item.chapters?.title ?? '—'}</Text>
        <Text style={styles.rowSub} numberOfLines={1}>{subjectName}</Text>
      </View>
      {badge && <Text style={styles.rowBadge}>{badge}</Text>}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, paddingTop: 56, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  back: { fontSize: 24, color: colors.text },
  title: { fontSize: 20, fontFamily: fonts.headingBlack, color: colors.text },
  banner: { backgroundColor: colors.primary, borderRadius: radius.xl, padding: 20, marginBottom: 20, ...cardShadow },
  bannerMonth: { color: '#fff', fontSize: 22, fontFamily: fonts.headingBlack },
  bannerTerm: { color: '#E7F0FD', fontSize: 13, fontWeight: '700', marginTop: 4 },
  bannerHoliday: { color: '#FFE9A8', fontSize: 12, fontWeight: '700', marginTop: 10 },
  section: { marginBottom: 26 },
  sectionTitle: { fontSize: 17, fontFamily: fonts.heading, color: colors.text, marginBottom: 12 },
  empty: { color: colors.textMuted, fontSize: 13, fontWeight: '600', paddingVertical: 8 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.card, borderRadius: radius.md, padding: 12, borderWidth: 1, borderColor: colors.cardBorder },
  rowIcon: { width: 40, height: 40, borderRadius: radius.sm, backgroundColor: colors.primaryTint, alignItems: 'center', justifyContent: 'center' },
  rowTitle: { fontSize: 14, fontWeight: '800', color: colors.text },
  rowSub: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  rowBadge: { fontSize: 11, fontWeight: '800', color: colors.primary },
  examCard: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: colors.card, borderRadius: radius.lg, padding: 16, borderWidth: 1, borderColor: colors.cardBorder, ...cardShadow },
  examIcon: { fontSize: 28 },
  examTitle: { fontSize: 14, fontWeight: '800', color: colors.text },
  examSub: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  examArrow: { fontSize: 18, color: colors.primary, fontWeight: '900' },
})
