import { useEffect, useState } from 'react'
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { supabase } from '../../lib/supabase'
import { colors, radius, cardShadow, fonts } from '../../lib/theme'
import { LessonContent } from '../../components/LessonContent'
import { MathLessonView } from '../../components/MathLessonView'

const hasMath = (s?: string | null) => !!s && /\$[^$\n]+\$|\$\$/.test(s)

interface Exercise { id: string; title: string; statement: string; difficulty: number; order_index: number }
const DIFF: Record<number, { label: string; bg: string; fg: string }> = {
  1: { label: 'Facile',    bg: '#E6F7EE', fg: '#0B8A46' },
  2: { label: 'Moyen',     bg: '#FFF3E0', fg: '#C77700' },
  3: { label: 'Difficile', bg: '#FDE2E1', fg: '#C62828' },
}

function Markdown({ content }: { content: string }) {
  return hasMath(content) ? <MathLessonView content={content} /> : <LessonContent content={content} />
}

export default function ExercicesScreen() {
  const { chapterId } = useLocalSearchParams<{ chapterId: string }>()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState('Exercices')
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [solutions, setSolutions] = useState<Record<string, string>>({})   // corrigés révélés
  const [busy, setBusy] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const [{ data: chapter }, { data: rows }] = await Promise.all([
        supabase.from('chapters').select('title').eq('id', chapterId).maybeSingle(),
        supabase.from('exercises').select('id, title, statement, difficulty, order_index')
          .eq('chapter_id', chapterId).order('order_index'),
      ])
      setTitle((chapter as { title?: string } | null)?.title ?? 'Exercices')
      setExercises((rows ?? []) as Exercise[])
      setLoading(false)
    }
    load()
  }, [chapterId])

  async function reveal(ex: Exercise) {
    if (solutions[ex.id] || busy) return
    setBusy(ex.id)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        // Enregistre la tentative → déverrouille le corrigé (RLS).
        await supabase.from('exercise_attempts').upsert(
          { user_id: user.id, exercise_id: ex.id }, { onConflict: 'user_id,exercise_id', ignoreDuplicates: true },
        )
      }
      const { data: sol } = await supabase.from('exercise_solutions').select('solution').eq('exercise_id', ex.id).maybeSingle()
      setSolutions((prev) => ({ ...prev, [ex.id]: (sol as { solution?: string } | null)?.solution ?? 'Corrigé indisponible.' }))
    } finally {
      setBusy(null)
    }
  }

  if (loading) return <ActivityIndicator style={{ flex: 1, backgroundColor: colors.background }} color={colors.primary} />

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={12}><Text style={styles.back}>←</Text></TouchableOpacity>
        <Text style={styles.title} numberOfLines={2}>Exercices — {title}</Text>
      </View>

      {exercises.length === 0 ? (
        <View style={styles.empty}><Text style={styles.emptyText}>Aucun exercice pour ce chapitre.</Text></View>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          {exercises.map((ex, i) => {
            const d = DIFF[ex.difficulty] ?? DIFF[1]!
            const revealed = solutions[ex.id]
            return (
              <View key={ex.id} style={styles.card}>
                <View style={styles.cardHead}>
                  <Text style={styles.exNum}>Exercice {i + 1}</Text>
                  <View style={[styles.badge, { backgroundColor: d.bg }]}><Text style={[styles.badgeText, { color: d.fg }]}>{d.label}</Text></View>
                </View>
                {ex.title ? <Text style={styles.exTitle}>{ex.title}</Text> : null}
                <View style={{ marginTop: 6 }}><Markdown content={ex.statement} /></View>

                {revealed ? (
                  <View style={styles.solution}>
                    <Text style={styles.solutionLabel}>✅ Corrigé détaillé</Text>
                    <Markdown content={revealed} />
                  </View>
                ) : (
                  <TouchableOpacity style={[styles.revealBtn, busy === ex.id && { opacity: 0.6 }]} onPress={() => reveal(ex)} disabled={busy === ex.id}>
                    <Text style={styles.revealText}>{busy === ex.id ? '…' : 'Voir le corrigé'}</Text>
                  </TouchableOpacity>
                )}
              </View>
            )
          })}
          <Text style={styles.hint}>Cherche d'abord par toi-même, puis compare avec le corrigé. C'est comme ça qu'on progresse 💪</Text>
        </ScrollView>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingTop: 56, paddingHorizontal: 16, paddingBottom: 12 },
  back: { fontSize: 24, color: colors.text, marginBottom: 8 },
  title: { fontSize: 20, fontFamily: fonts.headingBlack, color: colors.text },
  content: { padding: 16, gap: 14, paddingBottom: 40 },
  card: { backgroundColor: colors.card, borderRadius: radius.lg, padding: 16, borderWidth: 1, borderColor: colors.cardBorder, ...cardShadow },
  cardHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
  exNum: { fontSize: 13, fontWeight: '900', color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.full },
  badgeText: { fontSize: 11, fontWeight: '800' },
  exTitle: { fontSize: 16, fontWeight: '800', color: colors.text, marginTop: 2 },
  revealBtn: { marginTop: 14, borderWidth: 1.5, borderColor: colors.primary, borderRadius: radius.md, paddingVertical: 12, alignItems: 'center' },
  revealText: { color: colors.primary, fontWeight: '800', fontSize: 15 },
  solution: { marginTop: 14, backgroundColor: '#F0FBF5', borderRadius: radius.md, padding: 14, borderWidth: 1, borderColor: '#CBEBD9' },
  solutionLabel: { fontSize: 13, fontWeight: '800', color: '#0B8A46', marginBottom: 8 },
  hint: { fontSize: 12, color: colors.textMuted, textAlign: 'center', marginTop: 8, lineHeight: 17, paddingHorizontal: 12 },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyText: { fontSize: 14, color: colors.textMuted },
})
