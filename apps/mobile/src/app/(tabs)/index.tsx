import { useEffect, useState } from 'react'
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import { useRouter } from 'expo-router'
import { supabase } from '../../lib/supabase'
import { courses, levelLabels } from '../../content/courses'

interface Progress { id: string; subjects: { name: string } | null; score_avg: number; streak_days: number }

export default function HomeScreen() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [plan, setPlan] = useState<string>('free')
  const [progress, setProgress] = useState<Progress[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const [{ data: profile }, { data: prog }] = await Promise.all([
        supabase.from('users').select('full_name, plan').eq('id', user.id).single(),
        supabase.from('user_progress').select('*, subjects(name)').eq('user_id', user.id).limit(3),
      ])
      setName(profile?.full_name?.split(' ')[0] ?? 'Eleve')
      setPlan(profile?.plan ?? 'free')
      setProgress((prog ?? []) as Progress[])
      setLoading(false)
    }
    load()
  }, [])

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon apres-midi' : 'Bonsoir'

  if (loading) return <ActivityIndicator style={{ flex: 1 }} color="#0F8F4F" />

  const shortcuts = [
    { label: 'Cours', icon: '--', color: '#EAF5EC', route: '/(tabs)/cours' },
    { label: 'Examens', icon: '--', color: '#F0ECFA', route: '/(tabs)/examens' },
    { label: 'Kelassi IA', icon: 'IA', color: '#EAF5EC', route: '/(tabs)/tuteur' },
    { label: 'Flashcards', icon: '--', color: '#FFF7CC', route: '/flashcards/index' },
    { label: 'QCM', icon: '--', color: '#EEF8F4', route: '/quiz/index' },
    { label: 'Planning', icon: '--', color: '#EAF5EC', route: '/planning/index' },
    { label: 'Videos', icon: '--', color: '#FCE9E8', route: '/videos/index' },
  ]

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.greeting}>{greeting}, {name}</Text>
        <Text style={styles.subGreeting}>Pret a reviser aujourd'hui ?</Text>
      </View>

      <View style={styles.shortcuts}>
        {shortcuts.map((shortcut) => (
          <TouchableOpacity
            key={shortcut.label}
            style={[styles.shortcut, { backgroundColor: shortcut.color }]}
            onPress={() => router.push(shortcut.route as any)}
          >
            <Text style={styles.shortcutIcon}>{shortcut.icon}</Text>
            <Text style={styles.shortcutLabel}>{shortcut.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {progress.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Ma progression</Text>
          {progress.map((item) => (
            <View key={item.id} style={styles.progressRow}>
              <Text style={styles.progressSubject}>{item.subjects?.name}</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${Math.min(item.score_avg * 100, 100)}%` }]} />
              </View>
              <Text style={styles.streak}>{item.streak_days} j</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Cours integres</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/cours')}>
            <Text style={styles.seeAll}>Voir tout</Text>
          </TouchableOpacity>
        </View>
        {courses.slice(0, 4).map((course) => (
          <TouchableOpacity
            key={course.id}
            style={styles.docRow}
            onPress={() => router.push(`/cours/${course.id}` as any)}
          >
            <Text style={styles.docIcon}>--</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.docTitle} numberOfLines={1}>{course.title}</Text>
              <Text style={styles.docLevel}>{levelLabels[course.level]} · {course.subject}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {plan === 'free' && (
        <TouchableOpacity style={styles.premiumBanner} onPress={() => router.push('/(tabs)/profil')}>
          <Text style={styles.premiumTitle}>Passe a Premium</Text>
          <Text style={styles.premiumSub}>IA illimitee · Tous les examens · Revisions guidees</Text>
          <View style={styles.premiumButton}>
            <Text style={styles.premiumButtonText}>2 000 FCFA/mois</Text>
          </View>
        </TouchableOpacity>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7FAF8' },
  content: { padding: 20, paddingTop: 60 },
  header: { marginBottom: 24 },
  greeting: { fontSize: 22, fontWeight: '700', color: '#1F2A24' },
  subGreeting: { fontSize: 14, color: '#6D7A72', marginTop: 4 },
  shortcuts: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 },
  shortcut: { width: '47%', borderRadius: 14, padding: 16, alignItems: 'center' },
  shortcutIcon: { fontSize: 20, fontWeight: '800', color: '#0B6B3A', marginBottom: 6 },
  shortcutLabel: { fontSize: 13, fontWeight: '600', color: '#1F2A24' },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#DDE8E1' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  cardTitle: { fontSize: 15, fontWeight: '600', color: '#1F2A24', marginBottom: 12 },
  seeAll: { fontSize: 12, color: '#0F8F4F' },
  progressRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  progressSubject: { fontSize: 13, color: '#1F2A24', width: 100 },
  progressBar: { flex: 1, height: 6, backgroundColor: '#EEF8F4', borderRadius: 3, marginHorizontal: 8, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#0F8F4F', borderRadius: 3 },
  streak: { fontSize: 12, color: '#6D7A72', width: 36, textAlign: 'right' },
  docRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 9, borderTopWidth: 1, borderTopColor: '#F7FAF8' },
  docIcon: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#EAF5EC', color: '#0B6B3A', textAlign: 'center', lineHeight: 28, fontWeight: '800', marginRight: 12 },
  docTitle: { fontSize: 13, fontWeight: '600', color: '#1F2A24' },
  docLevel: { fontSize: 11, color: '#6D7A72', marginTop: 2 },
  premiumBanner: { borderRadius: 16, padding: 20, backgroundColor: '#0F8F4F', marginBottom: 16 },
  premiumTitle: { fontSize: 16, fontWeight: '700', color: '#fff' },
  premiumSub: { fontSize: 13, color: '#EAF5EC', marginTop: 4, marginBottom: 12 },
  premiumButton: { backgroundColor: '#fff', borderRadius: 10, paddingVertical: 10, alignItems: 'center' },
  premiumButtonText: { color: '#0B6B3A', fontWeight: '700', fontSize: 14 },
})
