import { useEffect, useState } from 'react'
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import { useRouter } from 'expo-router'
import { supabase } from '../../lib/supabase'
import { useLevel } from '../../hooks/useLevel'
import { colors, radius, cardShadow, LEVEL_LABEL } from '../../lib/theme'

const SHORTCUTS = [
  { label: 'Matières', icon: '📚', route: '/(tabs)/cours' },
  { label: 'Examens', icon: '📝', route: '/(tabs)/examens' },
  { label: 'Kelassi IA', icon: '🤖', route: '/(tabs)/tuteur' },
  { label: 'Flashcards', icon: '🃏', route: '/flashcards' },
  { label: 'QCM', icon: '✅', route: '/quiz' },
  { label: 'Planning', icon: '📅', route: '/planning' },
  { label: 'Vidéos', icon: '🎬', route: '/videos' },
]

const DAY_LABELS = ['L', 'M', 'M', 'J', 'V', 'S', 'D']

function startOfWeek(): Date {
  const d = new Date()
  const day = (d.getDay() + 6) % 7
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() - day)
  return d
}

interface Countdown { label: string; days: number; hours: number; mins: number }

export default function HomeScreen() {
  const router = useRouter()
  const { level, ready } = useLevel()
  const [name, setName] = useState('')
  const [countdown, setCountdown] = useState<Countdown | null>(null)
  const [weekPct, setWeekPct] = useState(0)
  const [weekBars, setWeekBars] = useState<number[]>([0, 0, 0, 0, 0, 0, 0])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!ready) return
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }
      const today = new Date().toISOString().slice(0, 10)
      const wkStart = startOfWeek()

      let examQ = supabase.from('exam_events').select('label, exam_date').gte('exam_date', today).order('exam_date', { ascending: true }).limit(1)
      if (level) examQ = examQ.eq('level', level)

      const [{ data: profile }, { data: exams }, { data: sessions }] = await Promise.all([
        supabase.from('users').select('full_name').eq('id', user.id).single(),
        examQ,
        supabase.from('revision_sessions').select('scheduled_date, is_done')
          .eq('user_id', user.id)
          .gte('scheduled_date', wkStart.toISOString().slice(0, 10)),
      ])

      setName((profile as { full_name?: string })?.full_name?.split(' ')[0] ?? 'Élève')

      // Compte à rebours
      const ex = (exams ?? [])[0] as { label: string; exam_date: string } | undefined
      if (ex) {
        const ms = new Date(ex.exam_date + 'T08:00:00').getTime() - Date.now()
        if (ms > 0) {
          setCountdown({
            label: ex.label,
            days: Math.floor(ms / 86400000),
            hours: Math.floor((ms % 86400000) / 3600000),
            mins: Math.floor((ms % 3600000) / 60000),
          })
        }
      }

      // Progression de la semaine (séances de révision du planning)
      const bars = [0, 0, 0, 0, 0, 0, 0]
      let done = 0, tot = 0
      for (const s of (sessions ?? []) as { scheduled_date: string; is_done: boolean }[]) {
        tot++
        if (s.is_done) {
          done++
          const idx = (new Date(s.scheduled_date + 'T00:00:00').getDay() + 6) % 7
          bars[idx]!++
        }
      }
      setWeekBars(bars)
      setWeekPct(tot > 0 ? Math.round((done / tot) * 100) : 0)
      setLoading(false)
    }
    load()
  }, [ready, level])

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir'
  const maxBar = Math.max(1, ...weekBars)

  if (loading) return <ActivityIndicator style={{ flex: 1, backgroundColor: colors.background }} color={colors.primary} />

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.greeting}>{greeting}, {name} 👋</Text>
          <Text style={styles.subGreeting}>Prêt à réviser aujourd'hui ?</Text>
        </View>
        <TouchableOpacity style={styles.avatar} onPress={() => router.push('/(tabs)/profil')}>
          <Text style={styles.avatarText}>{name[0]?.toUpperCase()}</Text>
        </TouchableOpacity>
      </View>

      {/* Compte à rebours */}
      {countdown ? (
        <View style={styles.countdownCard}>
          <View style={styles.examBadge}><Text style={styles.examBadgeText}>{countdown.label.toUpperCase()}</Text></View>
          <View style={styles.countdownRow}>
            {[
              { n: countdown.days, l: 'JOURS' },
              { n: countdown.hours, l: 'HEURES' },
              { n: countdown.mins, l: 'MIN' },
            ].map((c, i) => (
              <View key={c.l} style={styles.countdownCol}>
                {i > 0 && <View style={styles.countdownSep} />}
                <Text style={styles.countdownNum}>{String(c.n).padStart(2, '0')}</Text>
                <Text style={styles.countdownLabel}>{c.l}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.quote}>« L'éducation est l'arme la plus puissante pour changer le monde. »</Text>
        </View>
      ) : (
        <View style={styles.countdownCard}>
          <Text style={styles.quote}>{level ? `Objectif ${LEVEL_LABEL[level]} — reste concentré, chaque jour compte.` : 'Termine ton inscription pour activer le compte à rebours.'}</Text>
        </View>
      )}

      {/* Progression hebdomadaire */}
      <View style={styles.card}>
        <View style={styles.progHeader}>
          <Text style={styles.cardTitle}>Ta progression cette semaine</Text>
          <Text style={styles.progPct}>{weekPct}%</Text>
        </View>
        <View style={styles.progTrack}><View style={[styles.progFill, { width: `${weekPct}%` }]} /></View>
        <View style={styles.chart}>
          {weekBars.map((v, i) => (
            <View key={i} style={styles.chartCol}>
              <View style={[styles.chartBar, { height: 8 + (v / maxBar) * 56, backgroundColor: v > 0 ? colors.primary : colors.primaryTint }]} />
              <Text style={styles.chartLabel}>{DAY_LABELS[i]}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Raccourcis */}
      <View style={styles.shortcuts}>
        {SHORTCUTS.map((s) => (
          <TouchableOpacity key={s.label} style={styles.shortcut} onPress={() => router.push(s.route as any)}>
            <Text style={styles.shortcutIcon}>{s.icon}</Text>
            <Text style={styles.shortcutLabel}>{s.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, paddingTop: 56 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  greeting: { fontSize: 24, fontWeight: '800', color: colors.text },
  subGreeting: { fontSize: 14, color: colors.textMuted, marginTop: 2 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontSize: 18, fontWeight: '800' },
  countdownCard: { backgroundColor: colors.primary, borderRadius: radius.lg, padding: 22, marginBottom: 16, ...cardShadow },
  examBadge: { alignSelf: 'flex-start', backgroundColor: colors.yellow, paddingHorizontal: 12, paddingVertical: 5, borderRadius: radius.full, marginBottom: 16 },
  examBadgeText: { color: colors.onYellow, fontSize: 12, fontWeight: '800', letterSpacing: 0.5 },
  countdownRow: { flexDirection: 'row', justifyContent: 'space-around' },
  countdownCol: { flex: 1, alignItems: 'center', position: 'relative' },
  countdownSep: { position: 'absolute', left: 0, top: 6, bottom: 18, width: 1, backgroundColor: '#ffffff33' },
  countdownNum: { color: '#fff', fontSize: 46, fontWeight: '800', lineHeight: 50 },
  countdownLabel: { color: '#ffffffcc', fontSize: 12, fontWeight: '700', letterSpacing: 1, marginTop: 2 },
  quote: { color: '#ffffffe6', fontSize: 14, fontStyle: 'italic', lineHeight: 21, marginTop: 18 },
  card: { backgroundColor: colors.card, borderRadius: radius.lg, padding: 18, marginBottom: 16, borderWidth: 1, borderColor: colors.cardBorder, ...cardShadow },
  progHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 16, fontWeight: '800', color: colors.text, flex: 1 },
  progPct: { fontSize: 26, fontWeight: '800', color: colors.primary },
  progTrack: { height: 8, backgroundColor: colors.primaryTint, borderRadius: radius.full, marginTop: 12, overflow: 'hidden' },
  progFill: { height: '100%', backgroundColor: colors.primary, borderRadius: radius.full },
  chart: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 18, height: 84 },
  chartCol: { flex: 1, alignItems: 'center', justifyContent: 'flex-end' },
  chartBar: { width: 22, borderRadius: 6 },
  chartLabel: { fontSize: 12, color: colors.outline, marginTop: 6 },
  shortcuts: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  shortcut: { width: '47%', borderRadius: radius.md, padding: 16, alignItems: 'center', backgroundColor: colors.card, borderWidth: 1, borderColor: colors.cardBorder, ...cardShadow },
  shortcutIcon: { fontSize: 26, marginBottom: 6 },
  shortcutLabel: { fontSize: 13, fontWeight: '700', color: colors.text },
})
