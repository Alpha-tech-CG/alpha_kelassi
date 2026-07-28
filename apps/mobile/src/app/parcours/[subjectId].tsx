import { useEffect, useState } from 'react'
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { supabase } from '../../lib/supabase'
import { colors, radius, cardShadow, subjectIcon } from '../../lib/theme'

interface ChapterVM { id: string; title: string; description: string | null; pct: number; total: number; done: number }

async function safe<T>(p: PromiseLike<{ data: T[] | null }>): Promise<T[]> {
  try { const { data } = await p; return data ?? [] } catch { return [] }
}

export default function ParcoursSubjectScreen() {
  const { subjectId } = useLocalSearchParams<{ subjectId: string }>()
  const router = useRouter()
  const [name, setName] = useState('Matière')
  const [icon, setIcon] = useState<string | null>(null)
  const [chapters, setChapters] = useState<ChapterVM[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: subj } = await supabase.from('subjects').select('name, icon').eq('id', subjectId).maybeSingle()
      setName((subj as { name?: string } | null)?.name ?? 'Matière')
      setIcon((subj as { icon?: string | null } | null)?.icon ?? null)

      const chs = await safe<{ id: string; title: string; description: string | null; order_index: number }>(
        supabase.from('chapters').select('id, title, description, order_index').eq('subject_id', subjectId).order('order_index')
      )
      const chIds = chs.map((c) => c.id)
      const lessons = await safe<{ id: string; chapter_id: string }>(
        chIds.length ? supabase.from('lessons').select('id, chapter_id').in('chapter_id', chIds) : Promise.resolve({ data: [] })
      )
      const lIds = lessons.map((l) => l.id)
      const { data: { user } } = await supabase.auth.getUser()
      const prog = await safe<{ lesson_id: string }>(
        lIds.length && user ? supabase.from('lesson_progress').select('lesson_id').eq('user_id', user.id).eq('completed', true).in('lesson_id', lIds) : Promise.resolve({ data: [] })
      )
      const doneSet = new Set(prog.map((p) => p.lesson_id))
      setChapters(chs.map((ch) => {
        const own = lessons.filter((l) => l.chapter_id === ch.id)
        const done = own.filter((l) => doneSet.has(l.id)).length
        return { id: ch.id, title: ch.title, description: ch.description, total: own.length, done, pct: own.length ? Math.round((done / own.length) * 100) : 0 }
      }))
      setLoading(false)
    }
    load()
  }, [subjectId])

  if (loading) return <ActivityIndicator style={{ flex: 1, backgroundColor: colors.background }} color={colors.primary} />

  const totalLessons = chapters.reduce((a, c) => a + c.total, 0)
  const doneLessons = chapters.reduce((a, c) => a + c.done, 0)
  const overall = totalLessons ? Math.round((doneLessons / totalLessons) * 100) : 0

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.hbtn} onPress={() => router.back()}><Text style={styles.hbtnText}>←</Text></TouchableOpacity>
        <Text style={styles.htitle} numberOfLines={1}>{icon ?? subjectIcon(name)} {name}</Text>
        <View style={styles.hbtn} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        {/* Hero progression */}
        <View style={styles.hero}>
          <View style={styles.heroIcon}><Text style={{ fontSize: 34 }}>{icon ?? subjectIcon(name)}</Text></View>
          <View style={{ flex: 1 }}>
            <View style={styles.heroTop}>
              <Text style={styles.heroLabel}>PROGRESSION</Text>
              <Text style={styles.heroPct}>{overall}%</Text>
            </View>
            <View style={styles.heroTrack}><View style={[styles.heroFill, { width: `${overall}%` }]} /></View>
            <Text style={styles.heroSub}>🏆 {doneLessons} leçons complétées sur {totalLessons}</Text>
          </View>
        </View>

        <View style={styles.sectionHead}>
          <Text style={styles.sectionTitle}>Chapitres</Text>
          <View style={styles.badge}><Text style={styles.badgeText}>{chapters.length} chapitres</Text></View>
        </View>

        {chapters.length === 0 ? (
          <Text style={styles.empty}>Chapitres bientôt disponibles.</Text>
        ) : chapters.map((ch) => {
          const status = ch.pct === 100 ? 'done' : ch.pct > 0 ? 'progress' : 'todo'
          const box = status === 'done' ? styles.boxDone : status === 'progress' ? styles.boxProgress : styles.boxTodo
          const emoji = status === 'done' ? '✅' : status === 'progress' ? '▶️' : '📖'
          const label = status === 'done' ? 'Terminé' : status === 'progress' ? `En cours · ${ch.pct}%` : 'À commencer'
          return (
            <TouchableOpacity key={ch.id} style={[styles.row, status === 'progress' && styles.rowActive]} activeOpacity={0.85}
              onPress={() => router.push(`/chapitre/${ch.id}` as any)}>
              <View style={[styles.rowIcon, box]}><Text style={{ fontSize: 22 }}>{emoji}</Text></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.rowTitle} numberOfLines={2}>{ch.title}</Text>
                <Text style={[styles.rowStatus, status === 'done' && { color: colors.primary }, status === 'progress' && { color: colors.primary }]}>{label}</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          )
        })}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#fff', paddingTop: 48, paddingBottom: 14, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: colors.cardBorder },
  hbtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.primaryTint, alignItems: 'center', justifyContent: 'center' },
  hbtnText: { fontSize: 20, color: colors.text, fontWeight: '800' },
  htitle: { flex: 1, textAlign: 'center', fontSize: 18, fontWeight: '900', color: colors.text },
  hero: { flexDirection: 'row', alignItems: 'center', gap: 16, backgroundColor: colors.primary, borderRadius: 28, padding: 18, ...cardShadow },
  heroIcon: { width: 66, height: 66, borderRadius: 20, backgroundColor: '#ffffffee', alignItems: 'center', justifyContent: 'center' },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  heroLabel: { color: '#ffffffcc', fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  heroPct: { color: colors.yellow, fontSize: 15, fontWeight: '900' },
  heroTrack: { height: 10, backgroundColor: '#ffffff33', borderRadius: radius.full, padding: 2, overflow: 'hidden' },
  heroFill: { height: '100%', backgroundColor: colors.yellow, borderRadius: radius.full },
  heroSub: { color: '#ffffffe6', fontSize: 11, fontWeight: '700', marginTop: 10 },
  sectionHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 26, marginBottom: 14 },
  sectionTitle: { fontSize: 18, fontWeight: '900', color: colors.text },
  badge: { backgroundColor: colors.primaryTint, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  badgeText: { fontSize: 10, fontWeight: '900', color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 },
  empty: { color: colors.textMuted, textAlign: 'center', paddingVertical: 24 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: '#fff', borderRadius: 24, padding: 16, borderWidth: 1, borderColor: colors.cardBorder, marginBottom: 12, ...cardShadow },
  rowActive: { borderWidth: 2, borderColor: colors.primary },
  rowIcon: { width: 54, height: 54, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  boxDone: { backgroundColor: colors.primaryTint },
  boxProgress: { backgroundColor: colors.primary },
  boxTodo: { backgroundColor: colors.primaryTint },
  rowTitle: { fontSize: 15, fontWeight: '900', color: colors.text },
  rowStatus: { fontSize: 11, fontWeight: '800', color: colors.textMuted, marginTop: 3, textTransform: 'uppercase', letterSpacing: 0.3 },
  chevron: { fontSize: 26, color: colors.outlineVariant },
})
