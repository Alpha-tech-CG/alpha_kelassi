import { useEffect, useState } from 'react'
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { supabase } from '../../lib/supabase'
import { colors, radius, cardShadow, subjectAccent, subjectIcon } from '../../lib/theme'

type LessonType = 'cours' | 'resume' | 'quiz' | 'video'
const BLOCKS: { type: LessonType; icon: string }[] = [
  { type: 'cours', icon: '📖' }, { type: 'resume', icon: '📝' },
  { type: 'quiz', icon: '✅' }, { type: 'video', icon: '🎥' },
]

interface ChapterVM {
  id: string; title: string; description: string | null
  pct: number; typeDone: Record<LessonType, boolean>; typeHas: Record<LessonType, boolean>
}

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
      const lessons = await safe<{ id: string; chapter_id: string; type: LessonType }>(
        chIds.length ? supabase.from('lessons').select('id, chapter_id, type').in('chapter_id', chIds) : Promise.resolve({ data: [] })
      )
      const lIds = lessons.map((l) => l.id)
      const { data: { user } } = await supabase.auth.getUser()
      const prog = await safe<{ lesson_id: string; completed: boolean }>(
        lIds.length && user ? supabase.from('lesson_progress').select('lesson_id, completed').eq('user_id', user.id).in('lesson_id', lIds) : Promise.resolve({ data: [] })
      )
      const doneSet = new Set(prog.filter((p) => p.completed).map((p) => p.lesson_id))

      const vm: ChapterVM[] = chs.map((ch) => {
        const own = lessons.filter((l) => l.chapter_id === ch.id)
        const typeHas: Record<LessonType, boolean> = { cours: false, resume: false, quiz: false, video: false }
        const typeDone: Record<LessonType, boolean> = { cours: true, resume: true, quiz: true, video: true }
        let done = 0
        for (const l of own) {
          typeHas[l.type] = true
          if (doneSet.has(l.id)) done++
          else typeDone[l.type] = false
        }
        return { id: ch.id, title: ch.title, description: ch.description, pct: own.length ? Math.round((done / own.length) * 100) : 0, typeDone, typeHas }
      })
      setChapters(vm)
      setLoading(false)
    }
    load()
  }, [subjectId])

  if (loading) return <ActivityIndicator style={{ flex: 1, backgroundColor: colors.background }} color={colors.primary} />
  const accent = subjectAccent(name)

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={12}><Text style={styles.back}>←</Text></TouchableOpacity>
        <View style={[styles.iconBox, { backgroundColor: accent + '1A' }]}><Text style={styles.iconText}>{icon || subjectIcon(name)}</Text></View>
        <Text style={styles.title}>{name}</Text>
        <Text style={styles.subtitle}>{chapters.length} chapitre{chapters.length !== 1 ? 's' : ''}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {chapters.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🏗️</Text>
            <Text style={styles.emptyText}>Chapitres structurés bientôt disponibles pour cette matière.</Text>
          </View>
        ) : chapters.map((ch) => (
          <TouchableOpacity key={ch.id} style={styles.card} activeOpacity={0.85} onPress={() => router.push(`/chapitre/${ch.id}` as any)}>
            <View style={styles.cardTop}>
              <Text style={styles.cardTitle} numberOfLines={2}>{ch.title}</Text>
              <Text style={[styles.pct, { color: accent }]}>{ch.pct}%</Text>
            </View>
            {ch.description ? <Text style={styles.cardDesc} numberOfLines={2}>{ch.description}</Text> : null}
            <View style={styles.track}><View style={[styles.fill, { width: `${ch.pct}%`, backgroundColor: accent }]} /></View>
            <View style={styles.icons}>
              {BLOCKS.map((b) => {
                const done = ch.typeHas[b.type] && ch.typeDone[b.type]
                return <Text key={b.type} style={[styles.blockIcon, !done && styles.blockIconOff]}>{b.icon}</Text>
              })}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingTop: 56, paddingHorizontal: 16, paddingBottom: 12, alignItems: 'center' },
  back: { position: 'absolute', left: 16, top: 56, fontSize: 24, color: colors.text },
  iconBox: { width: 60, height: 60, borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  iconText: { fontSize: 30 },
  title: { fontSize: 22, fontWeight: '800', color: colors.text },
  subtitle: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
  content: { padding: 16, gap: 12 },
  card: { backgroundColor: colors.card, borderRadius: radius.lg, padding: 16, borderWidth: 1, borderColor: colors.cardBorder, ...cardShadow },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 },
  cardTitle: { flex: 1, fontSize: 16, fontWeight: '700', color: colors.text },
  pct: { fontSize: 15, fontWeight: '800' },
  cardDesc: { fontSize: 12, color: colors.textMuted, marginTop: 4 },
  track: { height: 7, backgroundColor: colors.primaryTint, borderRadius: radius.full, marginTop: 12, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: radius.full },
  icons: { flexDirection: 'row', gap: 14, marginTop: 12 },
  blockIcon: { fontSize: 18 },
  blockIconOff: { opacity: 0.25 },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyIcon: { fontSize: 40, marginBottom: 12 },
  emptyText: { fontSize: 14, color: colors.textMuted, textAlign: 'center', paddingHorizontal: 30 },
})
