import { useEffect, useState } from 'react'
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { supabase } from '../../../lib/supabase'
import { colors, radius, cardShadow, subjectAccent, subjectIcon } from '../../../lib/theme'

interface Domain {
  id: string
  name: string
  icon: string | null
  chapters: number
  quizzes: number
  progress: number
}

export default function ParcoursDomainesScreen() {
  const { subjectId } = useLocalSearchParams<{ subjectId: string }>()
  const router = useRouter()
  const [name, setName] = useState('Matière')
  const [icon, setIcon] = useState<string | null>(null)
  const [domains, setDomains] = useState<Domain[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: subj } = await supabase.from('subjects').select('name, icon').eq('id', subjectId).maybeSingle()
      setName((subj as { name?: string } | null)?.name ?? 'Matière')
      setIcon((subj as { icon?: string | null } | null)?.icon ?? null)

      const { data: children } = await supabase
        .from('subjects').select('id, name, icon')
        .eq('parent_subject_id', subjectId).order('display_order')
      const rows = (children ?? []) as any[]
      const childIds = rows.map((c) => c.id)

      const chapters = childIds.length
        ? ((await supabase.from('chapters').select('id, subject_id').in('subject_id', childIds)).data ?? []) as any[]
        : []
      const chapterIds = chapters.map((c) => c.id)
      const lessons = chapterIds.length
        ? ((await supabase.from('lessons').select('id, chapter_id, type').in('chapter_id', chapterIds)).data ?? []) as any[]
        : []
      const lessonIds = lessons.map((l) => l.id)
      const { data: { user } } = await supabase.auth.getUser()
      const prog = (user && lessonIds.length)
        ? ((await supabase.from('lesson_progress').select('lesson_id').eq('user_id', user.id).eq('completed', true).in('lesson_id', lessonIds)).data ?? []) as any[]
        : []
      const doneSet = new Set(prog.map((p) => p.lesson_id))
      const chapToSubject = new Map(chapters.map((c) => [c.id, c.subject_id]))

      const chapCount = new Map<string, number>()
      const quizCount = new Map<string, number>()
      const totalC = new Map<string, number>()
      const doneC = new Map<string, number>()
      for (const c of chapters) chapCount.set(c.subject_id, (chapCount.get(c.subject_id) ?? 0) + 1)
      for (const l of lessons) {
        const sid = chapToSubject.get(l.chapter_id); if (!sid) continue
        totalC.set(sid, (totalC.get(sid) ?? 0) + 1)
        if (l.type === 'quiz') quizCount.set(sid, (quizCount.get(sid) ?? 0) + 1)
        if (doneSet.has(l.id)) doneC.set(sid, (doneC.get(sid) ?? 0) + 1)
      }

      setDomains(rows.map((d) => {
        const t = totalC.get(d.id) ?? 0
        return {
          id: d.id, name: d.name, icon: d.icon,
          chapters: chapCount.get(d.id) ?? 0,
          quizzes: quizCount.get(d.id) ?? 0,
          progress: t ? Math.round(((doneC.get(d.id) ?? 0) / t) * 100) : 0,
        }
      }))
      setLoading(false)
    }
    load()
  }, [subjectId])

  if (loading) return <ActivityIndicator style={{ flex: 1, backgroundColor: colors.background }} color={colors.primary} />

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.hbtn} onPress={() => router.back()}><Text style={styles.hbtnText}>←</Text></TouchableOpacity>
        <Text style={styles.htitle} numberOfLines={1}>{icon ?? subjectIcon(name)} {name}</Text>
        <View style={styles.hbtn} />
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        <Text style={styles.subtitle}>Choisis un domaine pour voir ses chapitres</Text>
        {domains.length === 0 ? (
          <Text style={styles.empty}>Domaines bientôt disponibles.</Text>
        ) : (
          domains.map((d) => {
            const accent = subjectAccent(d.name)
            return (
              <TouchableOpacity
                key={d.id}
                activeOpacity={0.85}
                style={styles.card}
                onPress={() => router.push(`/parcours/${d.id}` as any)}
              >
                <View style={[styles.accent, { backgroundColor: accent }]} />
                <View style={styles.cardBody}>
                  <View style={[styles.iconBox, { backgroundColor: accent + '1A' }]}>
                    <Text style={styles.iconText}>{d.icon || subjectIcon(d.name)}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.domainName}>{d.name}</Text>
                    <Text style={styles.counts}>📘 {d.chapters} chapitres   ✅ {d.quizzes} quiz</Text>
                    <View style={styles.progressTrack}>
                      <View style={[styles.progressFill, { width: `${d.progress}%`, backgroundColor: colors.primary }]} />
                    </View>
                  </View>
                  <Text style={styles.chevron}>›</Text>
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
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#fff', paddingTop: 48, paddingBottom: 14, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: colors.cardBorder },
  hbtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.primaryTint, alignItems: 'center', justifyContent: 'center' },
  hbtnText: { fontSize: 20, color: colors.text, fontWeight: '800' },
  htitle: { flex: 1, textAlign: 'center', fontSize: 18, fontWeight: '900', color: colors.text },
  list: { padding: 16, gap: 12 },
  subtitle: { fontSize: 13, color: colors.textMuted, marginBottom: 4 },
  empty: { color: colors.textMuted, textAlign: 'center', paddingVertical: 24 },
  card: {
    flexDirection: 'row', backgroundColor: colors.card, borderRadius: radius.lg, overflow: 'hidden',
    borderWidth: 1, borderColor: colors.cardBorder, ...cardShadow,
  },
  accent: { width: 5 },
  cardBody: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 14, padding: 14 },
  iconBox: { width: 48, height: 48, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  iconText: { fontSize: 24 },
  domainName: { fontSize: 16, fontWeight: '800', color: colors.text },
  counts: { fontSize: 12, color: colors.textMuted, marginTop: 3 },
  progressTrack: { height: 6, backgroundColor: colors.primaryTint, borderRadius: radius.full, marginTop: 8, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: radius.full },
  chevron: { fontSize: 26, color: colors.outlineVariant },
})
