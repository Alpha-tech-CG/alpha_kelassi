import { useEffect, useState } from 'react'
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { supabase } from '../../lib/supabase'
import { colors, radius, cardShadow } from '../../lib/theme'

interface Lesson { id: string; title: string; position: number }
interface Objective { id: string; title: string; position: number; course_lessons: Lesson[] }
interface Course {
  id: string; title: string; subtitle: string | null; is_premium: boolean
  subjects: { name: string } | null
  course_objectives: Objective[]
}

export default function CoursDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState<Record<string, boolean>>({})

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('courses')
        .select('id, title, subtitle, is_premium, subjects(name), course_objectives(id, title, position, course_lessons(id, title, position))')
        .eq('id', id)
        .single()
      const c = data as unknown as Course | null
      if (c) {
        c.course_objectives = (c.course_objectives ?? []).sort((a, b) => a.position - b.position)
        c.course_objectives.forEach((o) => { o.course_lessons = (o.course_lessons ?? []).sort((a, b) => a.position - b.position) })
        if (c.course_objectives[0]) setOpen({ [c.course_objectives[0].id]: true })
      }
      setCourse(c)
      setLoading(false)
    }
    load()
  }, [id])

  if (loading) return <ActivityIndicator style={{ flex: 1, backgroundColor: colors.background }} color={colors.primary} />

  if (!course) {
    return (
      <View style={styles.emptyScreen}>
        <Text style={styles.emptyTitle}>Cours introuvable.</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>Retour</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={12}><Text style={styles.back}>←</Text></TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{course.subjects?.name ?? 'Cours'}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Text style={styles.title}>{course.title}</Text>
          {course.subtitle ? <Text style={styles.subtitle}>{course.subtitle}</Text> : null}
          {course.is_premium ? <Text style={styles.premiumBadge}>⭐ Premium</Text> : null}
        </View>

        <Text style={styles.sectionLabel}>Objectifs généraux</Text>

        {course.course_objectives.length === 0 ? (
          <View style={styles.empty}><Text style={styles.emptyText}>Ce cours n&apos;a pas encore de contenu.</Text></View>
        ) : (
          course.course_objectives.map((og, i) => {
            const isOpen = !!open[og.id]
            return (
              <View key={og.id} style={styles.ogCard}>
                <TouchableOpacity style={styles.ogHeader} onPress={() => setOpen((s) => ({ ...s, [og.id]: !s[og.id] }))}>
                  <View style={styles.ogBadge}><Text style={styles.ogBadgeText}>{i + 1}</Text></View>
                  <Text style={styles.ogTitle} numberOfLines={2}>{og.title}</Text>
                  <Text style={styles.ogChevron}>{isOpen ? '▾' : '▸'}</Text>
                </TouchableOpacity>

                {isOpen && (
                  <View style={styles.osList}>
                    {og.course_lessons.length === 0 ? (
                      <Text style={styles.osEmpty}>Aucun objectif spécifique.</Text>
                    ) : (
                      og.course_lessons.map((os) => (
                        <TouchableOpacity key={os.id} style={styles.osRow} onPress={() => router.push(`/lecon/${os.id}` as any)}>
                          <View style={styles.osDot} />
                          <Text style={styles.osTitle} numberOfLines={2}>{os.title}</Text>
                          <Text style={styles.osChevron}>›</Text>
                        </TouchableOpacity>
                      ))
                    )}
                  </View>
                )}
              </View>
            )
          })
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', paddingTop: 52, paddingHorizontal: 16, paddingBottom: 12, gap: 12, backgroundColor: colors.card, borderBottomWidth: 1, borderBottomColor: colors.cardBorder },
  back: { fontSize: 24, color: colors.text },
  headerTitle: { fontSize: 16, fontWeight: '700', color: colors.text, flex: 1 },
  content: { padding: 16, gap: 12, paddingBottom: 40 },
  hero: { marginBottom: 4 },
  title: { fontSize: 24, fontWeight: '800', color: colors.text, lineHeight: 30 },
  subtitle: { fontSize: 15, color: colors.textMuted, marginTop: 6, lineHeight: 21 },
  premiumBadge: { alignSelf: 'flex-start', marginTop: 10, backgroundColor: colors.yellow, color: colors.onYellow, fontSize: 12, fontWeight: '800', paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.full, overflow: 'hidden' },
  sectionLabel: { fontSize: 13, fontWeight: '800', color: colors.outline, textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 8 },
  ogCard: { backgroundColor: colors.card, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.cardBorder, ...cardShadow, overflow: 'hidden' },
  ogHeader: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
  ogBadge: { width: 30, height: 30, borderRadius: 15, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  ogBadgeText: { color: '#fff', fontWeight: '800', fontSize: 14 },
  ogTitle: { flex: 1, fontSize: 15, fontWeight: '700', color: colors.text },
  ogChevron: { fontSize: 16, color: colors.primary, fontWeight: '700' },
  osList: { paddingHorizontal: 16, paddingBottom: 8, gap: 2, borderTopWidth: 1, borderTopColor: colors.cardBorder, paddingTop: 8 },
  osRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, gap: 12 },
  osDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primaryContainer },
  osTitle: { flex: 1, fontSize: 14, fontWeight: '600', color: colors.text },
  osChevron: { fontSize: 20, color: colors.outlineVariant },
  osEmpty: { fontSize: 13, color: colors.textMuted, paddingVertical: 10 },
  empty: { backgroundColor: colors.card, borderRadius: radius.md, borderWidth: 1, borderColor: colors.cardBorder, padding: 24, alignItems: 'center' },
  emptyText: { fontSize: 14, color: colors.textMuted, textAlign: 'center' },
  emptyScreen: { flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', gap: 16 },
  emptyTitle: { fontSize: 16, color: colors.textMuted },
  backBtn: { backgroundColor: colors.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: radius.md },
  backBtnText: { color: '#fff', fontWeight: '700' },
})
