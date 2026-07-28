import { useEffect, useState } from 'react'
import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Linking } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { supabase } from '../../lib/supabase'
import { API_URL } from '../../lib/config'
import { colors, radius, cardShadow } from '../../lib/theme'
import { useNetworkStatus } from '../../hooks/useNetworkStatus'
import { readCachedLesson, writeCachedLesson } from '../../lib/lessonCache'
import { LessonContent } from '../../components/LessonContent'

type LessonType = 'cours' | 'resume' | 'quiz' | 'video'
interface LessonVM {
  id: string; type: LessonType; title: string
  content: string | null; video_url: string | null; duration_min: number | null; order_index: number
}
const TABS: { type: LessonType; icon: string; label: string }[] = [
  { type: 'cours', icon: '📖', label: 'Cours' }, { type: 'resume', icon: '📝', label: 'Résumé' },
  { type: 'quiz', icon: '✅', label: 'Quiz' }, { type: 'video', icon: '🎥', label: 'Vidéo' },
]

export default function ChapitreScreen() {
  const { chapterId } = useLocalSearchParams<{ chapterId: string }>()
  const router = useRouter()
  const { isOnline } = useNetworkStatus()
  const [title, setTitle] = useState('')
  const [lessons, setLessons] = useState<LessonVM[]>([])
  const [done, setDone] = useState<Record<string, { completed: boolean; score: number | null }>>({})
  const [tab, setTab] = useState<LessonType>('cours')
  const [loading, setLoading] = useState(true)
  const [fromCache, setFromCache] = useState(false)
  const [busy, setBusy] = useState<string | null>(null)
  const [flash, setFlash] = useState<string | null>(null)
  const [scores, setScores] = useState<Record<string, string>>({})

  useEffect(() => {
    async function load() {
      try {
        const { data: chapter } = await supabase.from('chapters').select('title').eq('id', chapterId).maybeSingle()
        const { data: rows, error } = await supabase
          .from('lessons')
          .select('id, type, title, content, video_url, duration_min, order_index')
          .eq('chapter_id', chapterId).order('order_index')
        if (error) throw error

        const ls = (rows ?? []) as LessonVM[]
        const t = (chapter as { title?: string } | null)?.title ?? 'Chapitre'
        const { data: { user } } = await supabase.auth.getUser()
        const { data: prog } = user
          ? await supabase.from('lesson_progress').select('lesson_id, completed, score').eq('user_id', user.id)
          : { data: [] }
        const dmap: Record<string, { completed: boolean; score: number | null }> = {}
        for (const p of (prog ?? []) as { lesson_id: string; completed: boolean; score: number | null }[]) dmap[p.lesson_id] = { completed: p.completed, score: p.score }

        setTitle(t); setLessons(ls); setDone(dmap); setFromCache(false)
        setTab((TABS.find((x) => ls.some((l) => l.type === x.type))?.type) ?? 'cours')
        // Cache offline (contenu texte lisible plus tard sans réseau)
        writeCachedLesson(`chapter:${chapterId}`, 'chapter', JSON.stringify({ title: t, lessons: ls }))
      } catch {
        // Hors-ligne : repli sur le cache
        const cached = await readCachedLesson(`chapter:${chapterId}`)
        if (cached) {
          try {
            const parsed = JSON.parse(cached) as { title: string; lessons: LessonVM[] }
            setTitle(parsed.title); setLessons(parsed.lessons); setFromCache(true)
            setTab((TABS.find((x) => parsed.lessons.some((l) => l.type === x.type))?.type) ?? 'cours')
          } catch { /* cache corrompu */ }
        }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [chapterId])

  async function complete(l: LessonVM) {
    if (!isOnline) { setFlash('Reconnecte-toi pour valider ta progression.'); setTimeout(() => setFlash(null), 3000); return }
    setBusy(l.id)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const score = l.type === 'quiz' ? Math.max(0, Math.min(100, Number(scores[l.id] ?? '0'))) : undefined
      const res = await fetch(`${API_URL}/api/curriculum/lessons/${l.id}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(session ? { Authorization: `Bearer ${session.access_token}` } : {}) },
        body: JSON.stringify(score !== undefined ? { score } : {}),
      })
      const json = await res.json()
      if (!res.ok) { setFlash(json?.error?.message ?? 'Erreur, réessaie.'); return }
      setDone((prev) => ({ ...prev, [l.id]: { completed: true, score: score ?? null } }))
      const xp = json?.data?.xp_awarded ?? 0
      setFlash(json?.data?.chapter_completed ? `🎓 Chapitre complété ! +${xp} XP` : xp > 0 ? `+${xp} XP` : 'Enregistré ✓')
    } catch {
      setFlash('Connexion impossible.')
    } finally {
      setBusy(null); setTimeout(() => setFlash(null), 3000)
    }
  }

  if (loading) return <ActivityIndicator style={{ flex: 1, backgroundColor: colors.background }} color={colors.primary} />

  const visibleTabs = TABS.filter((x) => lessons.some((l) => l.type === x.type))
  const items = lessons.filter((l) => l.type === tab).sort((a, b) => a.order_index - b.order_index)

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={12}><Text style={styles.back}>←</Text></TouchableOpacity>
        <Text style={styles.title} numberOfLines={2}>{title}</Text>
        {fromCache && <Text style={styles.offline}>⤓ Version hors-ligne</Text>}
      </View>

      {lessons.length === 0 ? (
        <View style={styles.empty}><Text style={styles.emptyText}>Contenu bientôt disponible.</Text></View>
      ) : (
        <>
          {/* Onglets segmentés */}
          <View style={styles.tabs}>
            {visibleTabs.map((x) => (
              <TouchableOpacity key={x.type} style={[styles.tab, tab === x.type && styles.tabActive]} onPress={() => setTab(x.type)}>
                <Text style={[styles.tabText, tab === x.type && styles.tabTextActive]}>{x.icon} {x.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <ScrollView contentContainerStyle={styles.content}>
            {items.map((l) => {
              const isDone = done[l.id]?.completed
              return (
                <View key={l.id} style={styles.card}>
                  <View style={styles.cardHead}>
                    <Text style={styles.cardTitle}>{l.title}</Text>
                    {l.duration_min ? <Text style={styles.dur}>{l.duration_min} min</Text> : null}
                  </View>

                  {(l.type === 'cours' || l.type === 'resume') && l.content ? (
                    <View style={{ marginTop: 6 }}><LessonContent content={l.content} /></View>
                  ) : null}

                  {l.type === 'video' && l.video_url ? (
                    <TouchableOpacity style={styles.videoBtn} onPress={() => Linking.openURL(l.video_url!)}>
                      <Text style={styles.videoBtnText}>▶  Ouvrir la vidéo</Text>
                    </TouchableOpacity>
                  ) : null}

                  {l.type === 'quiz' ? (
                    <View style={styles.quizRow}>
                      {l.content ? <LessonContent content={l.content} /> : null}
                      {!isDone && (
                        <View style={styles.scoreRow}>
                          <Text style={styles.scoreLabel}>Ton score :</Text>
                          <TextInput style={styles.scoreInput} keyboardType="number-pad" placeholder="0-100"
                            placeholderTextColor={colors.outline} value={scores[l.id] ?? ''}
                            onChangeText={(v) => setScores((p) => ({ ...p, [l.id]: v.replace(/[^0-9]/g, '') }))} />
                          <Text style={styles.scoreLabel}>/ 100</Text>
                        </View>
                      )}
                    </View>
                  ) : null}

                  {isDone ? (
                    <Text style={styles.doneText}>✅ Complété{l.type === 'quiz' && done[l.id]?.score != null ? ` — ${done[l.id]?.score}%` : ''}</Text>
                  ) : (
                    <TouchableOpacity style={[styles.cta, (busy === l.id || fromCache) && styles.ctaDisabled]} disabled={busy === l.id || fromCache} onPress={() => complete(l)}>
                      <Text style={styles.ctaText}>
                        {busy === l.id ? '…' : l.type === 'cours' ? 'Marquer comme lu' : l.type === 'video' ? 'Marquer comme visionné' : l.type === 'quiz' ? 'Valider le quiz' : 'Marquer comme fait'}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              )
            })}
          </ScrollView>
        </>
      )}

      {flash && <View style={styles.toast}><Text style={styles.toastText}>{flash}</Text></View>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingTop: 56, paddingHorizontal: 16, paddingBottom: 12 },
  back: { fontSize: 24, color: colors.text, marginBottom: 8 },
  title: { fontSize: 22, fontWeight: '800', color: colors.text },
  offline: { fontSize: 12, color: colors.textMuted, marginTop: 4 },
  tabs: { flexDirection: 'row', paddingHorizontal: 16, gap: 8, marginBottom: 8, flexWrap: 'wrap' },
  tab: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: radius.full, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.cardBorder },
  tabActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  tabText: { fontSize: 13, fontWeight: '700', color: colors.textMuted },
  tabTextActive: { color: '#fff' },
  content: { padding: 16, gap: 14 },
  card: { backgroundColor: colors.card, borderRadius: radius.lg, padding: 16, borderWidth: 1, borderColor: colors.cardBorder, ...cardShadow },
  cardHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { flex: 1, fontSize: 16, fontWeight: '700', color: colors.text },
  dur: { fontSize: 12, color: colors.textMuted },
  body: { fontSize: 15, lineHeight: 23, color: colors.text, marginTop: 10 },
  videoBtn: { marginTop: 12, backgroundColor: colors.primaryTint, borderRadius: radius.md, padding: 14, alignItems: 'center' },
  videoBtnText: { color: colors.primary, fontWeight: '700', fontSize: 15 },
  quizRow: { marginTop: 4 },
  scoreRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12 },
  scoreLabel: { fontSize: 14, color: colors.textMuted },
  scoreInput: { width: 70, borderWidth: 1, borderColor: colors.cardBorder, borderRadius: radius.sm, paddingHorizontal: 10, paddingVertical: 6, color: colors.text },
  cta: { marginTop: 14, backgroundColor: colors.primary, borderRadius: radius.md, paddingVertical: 12, alignItems: 'center' },
  ctaDisabled: { opacity: 0.5 },
  ctaText: { color: '#fff', fontWeight: '800', fontSize: 15 },
  doneText: { marginTop: 14, color: '#16a34a', fontWeight: '800', fontSize: 14 },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyText: { fontSize: 14, color: colors.textMuted },
  toast: { position: 'absolute', bottom: 30, alignSelf: 'center', backgroundColor: '#111827', paddingHorizontal: 18, paddingVertical: 10, borderRadius: radius.full },
  toastText: { color: '#fff', fontWeight: '700', fontSize: 14 },
})
