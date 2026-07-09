import { useEffect, useState } from 'react'
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import { useRouter } from 'expo-router'
import { supabase } from '../../lib/supabase'
import { useLevel } from '../../hooks/useLevel'
import { colors, radius, cardShadow, LEVEL_LABEL, subjectAccent, subjectIcon } from '../../lib/theme'

interface Progress { id: string; subjects: { name: string } | null; score_avg: number; streak_days: number }
interface Subject { id: string; name: string; icon: string | null }

const SHORTCUTS = [
  { label: 'Matières', icon: '📚', route: '/(tabs)/cours' },
  { label: 'Examens', icon: '📝', route: '/(tabs)/examens' },
  { label: 'Kelassi IA', icon: '🤖', route: '/(tabs)/tuteur' },
  { label: 'Flashcards', icon: '🃏', route: '/flashcards/index' },
  { label: 'QCM', icon: '✅', route: '/quiz/index' },
  { label: 'Planning', icon: '📅', route: '/planning/index' },
  { label: 'Vidéos', icon: '🎬', route: '/videos/index' },
]

export default function HomeScreen() {
  const router = useRouter()
  const { level, ready } = useLevel()
  const [name, setName] = useState('')
  const [plan, setPlan] = useState('free')
  const [progress, setProgress] = useState<Progress[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!ready) return
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }
      let sq = supabase.from('subjects').select('id, name, icon').order('name').limit(6)
      if (level) sq = sq.eq('level', level)
      const [{ data: profile }, { data: prog }, { data: subs }] = await Promise.all([
        supabase.from('users').select('full_name, plan').eq('id', user.id).single(),
        supabase.from('user_progress').select('*, subjects(name)').eq('user_id', user.id).limit(3),
        sq,
      ])
      setName((profile as { full_name?: string })?.full_name?.split(' ')[0] ?? 'Élève')
      setPlan((profile as { plan?: string })?.plan ?? 'free')
      setProgress((prog ?? []) as Progress[])
      setSubjects((subs ?? []) as Subject[])
      setLoading(false)
    }
    load()
  }, [ready, level])

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir'

  if (loading) return <ActivityIndicator style={{ flex: 1, backgroundColor: colors.background }} color={colors.primary} />

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.greeting}>{greeting}, {name} 👋</Text>
        <Text style={styles.subGreeting}>
          Prêt à réviser ?{level ? `  ·  Programme ${LEVEL_LABEL[level]}` : ''}
        </Text>
      </View>

      <View style={styles.shortcuts}>
        {SHORTCUTS.map((s) => (
          <TouchableOpacity key={s.label} style={styles.shortcut} onPress={() => router.push(s.route as any)}>
            <Text style={styles.shortcutIcon}>{s.icon}</Text>
            <Text style={styles.shortcutLabel}>{s.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {progress.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Ma progression</Text>
          {progress.map((item) => (
            <View key={item.id} style={styles.progressRow}>
              <Text style={styles.progressSubject} numberOfLines={1}>{item.subjects?.name}</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${Math.min(item.score_avg * 100, 100)}%` }]} />
              </View>
              <Text style={styles.streak}>{item.streak_days}🔥</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Mes matières</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/cours')}>
            <Text style={styles.seeAll}>Voir tout</Text>
          </TouchableOpacity>
        </View>
        {subjects.length === 0 ? (
          <Text style={styles.emptyText}>Tes matières apparaîtront ici.</Text>
        ) : (
          subjects.map((s, i) => {
            const accent = subjectAccent(s.name)
            return (
              <TouchableOpacity
                key={s.id}
                style={[styles.subjectRow, i > 0 && styles.subjectRowBorder]}
                onPress={() => router.push(`/matiere/${s.id}` as any)}
              >
                <View style={[styles.subjectIcon, { backgroundColor: accent + '1A' }]}>
                  <Text style={{ fontSize: 18 }}>{s.icon || subjectIcon(s.name)}</Text>
                </View>
                <Text style={styles.subjectName}>{s.name}</Text>
                <Text style={styles.chevron}>›</Text>
              </TouchableOpacity>
            )
          })
        )}
      </View>

      {plan === 'free' && (
        <TouchableOpacity style={styles.premiumBanner} onPress={() => router.push('/(tabs)/profil')}>
          <Text style={styles.premiumTitle}>Passe à Premium ⭐</Text>
          <Text style={styles.premiumSub}>IA illimitée · Tous les examens · Révisions guidées</Text>
          <View style={styles.premiumButton}>
            <Text style={styles.premiumButtonText}>2 000 FCFA/mois</Text>
          </View>
        </TouchableOpacity>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingTop: 60 },
  header: { marginBottom: 22 },
  greeting: { fontSize: 24, fontWeight: '800', color: colors.text },
  subGreeting: { fontSize: 14, color: colors.textMuted, marginTop: 4 },
  shortcuts: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 22 },
  shortcut: {
    width: '47%', borderRadius: radius.md, padding: 16, alignItems: 'center',
    backgroundColor: colors.card, borderWidth: 1, borderColor: colors.cardBorder, ...cardShadow,
  },
  shortcutIcon: { fontSize: 26, marginBottom: 6 },
  shortcutLabel: { fontSize: 13, fontWeight: '700', color: colors.text },
  card: { backgroundColor: colors.card, borderRadius: radius.lg, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: colors.cardBorder, ...cardShadow },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  cardTitle: { fontSize: 16, fontWeight: '800', color: colors.text, marginBottom: 12 },
  seeAll: { fontSize: 13, color: colors.primary, fontWeight: '700' },
  progressRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  progressSubject: { fontSize: 13, color: colors.text, width: 96 },
  progressBar: { flex: 1, height: 8, backgroundColor: colors.primaryTint, borderRadius: radius.full, marginHorizontal: 8, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: colors.primary, borderRadius: radius.full },
  streak: { fontSize: 12, color: colors.textMuted, width: 40, textAlign: 'right' },
  subjectRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 11, gap: 12 },
  subjectRowBorder: { borderTopWidth: 1, borderTopColor: colors.background },
  subjectIcon: { width: 36, height: 36, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center' },
  subjectName: { flex: 1, fontSize: 15, fontWeight: '600', color: colors.text },
  chevron: { fontSize: 22, color: colors.outlineVariant },
  emptyText: { fontSize: 13, color: colors.textMuted, paddingVertical: 8 },
  premiumBanner: { borderRadius: radius.lg, padding: 20, backgroundColor: colors.primary, marginBottom: 16, ...cardShadow },
  premiumTitle: { fontSize: 17, fontWeight: '800', color: '#fff' },
  premiumSub: { fontSize: 13, color: '#EAF5EC', marginTop: 4, marginBottom: 14 },
  premiumButton: { backgroundColor: '#fff', borderRadius: radius.md, paddingVertical: 11, alignItems: 'center' },
  premiumButtonText: { color: colors.primary, fontWeight: '800', fontSize: 14 },
})
