import { useEffect, useState } from 'react'
import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet, Linking } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { supabase } from '../../lib/supabase'
import { API_URL } from '../../lib/config'
import { colors, radius, cardShadow } from '../../lib/theme'
import { useNetworkStatus } from '../../hooks/useNetworkStatus'
import { readCachedLesson, writeCachedLesson } from '../../lib/lessonCache'
import { LessonContent } from '../../components/LessonContent'
import { MathLessonView } from '../../components/MathLessonView'
import { ChapterSkeleton } from '../../components/Skeleton'

// Contenu avec formules LaTeX ($...$) → rendu math natif ; sinon rendu léger (encarts BEPC).
const hasMath = (s?: string | null) => !!s && /\$[^$\n]+\$|\$\$/.test(s)

type LessonType = 'cours' | 'resume' | 'fiche' | 'quiz' | 'video'
interface LessonVM {
  id: string; type: LessonType; title: string
  content: string | null; video_url: string | null; duration_min: number | null; order_index: number
}
const TABS: { type: LessonType; icon: string; label: string }[] = [
  { type: 'cours', icon: '📖', label: 'Cours' }, { type: 'resume', icon: '📝', label: 'Résumé' },
  { type: 'fiche', icon: '🗂️', label: 'Fiche' },
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
  const [openSub, setOpenSub] = useState<string | null>(null) // sous-chapitre ouvert (mode drill-down)
  const [exCount, setExCount] = useState(0)

  useEffect(() => {
    let cancelled = false

    function applyCached(parsed: { title: string; lessons: LessonVM[] }, isFromCache: boolean) {
      if (cancelled) return
      setTitle(parsed.title); setLessons(parsed.lessons); setFromCache(isFromCache)
      setTab((TABS.find((x) => parsed.lessons.some((l) => l.type === x.type))?.type) ?? 'cours')
    }

    async function load() {
      // 1) Cache d'abord : si présent, affichage instantané — indépendant de la
      // rapidité/fiabilité du réseau (une requête qui reste bloquée plusieurs
      // secondes avant d'échouer, plutôt que de rejeter tout de suite, ne doit
      // jamais empêcher de lire un cours déjà téléchargé).
      let hasCache = false
      try {
        const cached = await readCachedLesson(`chapter:${chapterId}`)
        if (cached) {
          const parsed = JSON.parse(cached) as { title: string; lessons: LessonVM[] }
          applyCached(parsed, true)
          hasCache = true
          setLoading(false)
        }
      } catch { /* cache absent/corrompu — on tentera le réseau ci-dessous */ }

      // 2) Réseau ensuite, avec timeout : rafraîchit si ça répond, sinon on
      // garde ce qui a déjà été affiché depuis le cache (ou l'état vide s'il
      // n'y en avait pas). Toutes les requêtes indépendantes partent en
      // parallèle (plutôt qu'enchaînées une par une) pour limiter l'attente
      // sur une connexion lente — c'est là que se jouait l'essentiel de la
      // lenteur perçue.
      try {
        // Sur un cache déjà affiché, ce n'est qu'un rafraîchissement en tâche
        // de fond : pas la peine d'attendre longtemps. Sans cache, c'est le
        // seul chemin vers le contenu : on laisse un peu plus de marge.
        const timeoutMs = hasCache ? 4000 : 6000
        const timeout = new Promise<never>((_, reject) => setTimeout(() => reject(new Error('timeout')), timeoutMs))

        const fetchAll = (async () => {
          const [{ data: chapter }, { data: rows, error }, { count: exc }] = await Promise.all([
            supabase.from('chapters').select('title').eq('id', chapterId).maybeSingle(),
            supabase.from('lessons')
              .select('id, type, title, content, video_url, duration_min, order_index')
              .eq('chapter_id', chapterId).order('order_index'),
            supabase.from('exercises').select('id', { count: 'exact', head: true }).eq('chapter_id', chapterId),
          ])
          if (error) throw error
          const { data: { user } } = await supabase.auth.getUser()
          const { data: prog } = user
            ? await supabase.from('lesson_progress').select('lesson_id, completed, score').eq('user_id', user.id)
            : { data: [] }
          return { chapter, rows, exc, prog }
        })()

        const { chapter, rows, exc, prog } = await Promise.race([fetchAll, timeout])
        if (cancelled) return

        const ls = (rows ?? []) as LessonVM[]
        const t = (chapter as { title?: string } | null)?.title ?? 'Chapitre'
        const dmap: Record<string, { completed: boolean; score: number | null }> = {}
        for (const p of (prog ?? []) as { lesson_id: string; completed: boolean; score: number | null }[]) dmap[p.lesson_id] = { completed: p.completed, score: p.score }

        setExCount(exc ?? 0)
        setDone(dmap)
        applyCached({ title: t, lessons: ls }, false)
        // Cache offline (texte + images, lisibles plus tard sans réseau)
        writeCachedLesson(`chapter:${chapterId}`, 'chapter', JSON.stringify({ title: t, lessons: ls }))
      } catch {
        // Réseau indisponible ou trop lent : on garde le cache déjà affiché
        // (le cas échéant) — rien à faire de plus ici.
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    setLoading(true)
    load()
    return () => { cancelled = true }
  }, [chapterId])

  async function complete(l: LessonVM) {
    if (l.type === 'cours') {
      const qz = lessons.filter((x) => x.type === 'quiz')
      if (qz.length > 0 && !qz.every((q) => done[q.id]?.completed)) {
        setFlash("Valide d'abord le quiz du chapitre."); setTimeout(() => setFlash(null), 3000); return
      }
    }
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

  if (loading) return <ChapterSkeleton />

  const visibleTabs = TABS.filter((x) => lessons.some((l) => l.type === x.type))
  const items = lessons.filter((l) => l.type === tab).sort((a, b) => a.order_index - b.order_index)
  // Un cours ne peut être marqué "lu" qu'une fois le(s) quiz du chapitre validé(s)
  const quizLessons = lessons.filter((l) => l.type === 'quiz')
  const quizzesValidated = quizLessons.length === 0 || quizLessons.every((q) => done[q.id]?.completed)
  // Mode drill-down : un chapitre avec plusieurs cours = plusieurs sous-chapitres (ex. Maths Terminale)
  const coursList = lessons.filter((l) => l.type === 'cours').sort((a, b) => a.order_index - b.order_index)
  const subMode = coursList.length > 1
  const openLesson = openSub ? lessons.find((l) => l.id === openSub) ?? null : null

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={12}><Text style={styles.back}>←</Text></TouchableOpacity>
        <Text style={styles.title} numberOfLines={2}>{title}</Text>
        {fromCache && <Text style={styles.offline}>⤓ Version hors-ligne</Text>}
      </View>

      {exCount > 0 && (
        <TouchableOpacity style={styles.exBtn} onPress={() => router.push(`/exercices/${chapterId}`)} activeOpacity={0.9}>
          <Text style={styles.exBtnIcon}>✏️</Text>
          <Text style={styles.exBtnText}>S'entraîner — {exCount} exercice{exCount > 1 ? 's' : ''} corrigé{exCount > 1 ? 's' : ''}</Text>
          <Text style={styles.exBtnChevron}>→</Text>
        </TouchableOpacity>
      )}

      {lessons.length === 0 ? (
        <View style={styles.empty}><Text style={styles.emptyText}>Contenu bientôt disponible.</Text></View>
      ) : subMode ? (
        openLesson ? (
          /* Détail d'un sous-chapitre */
          <ScrollView contentContainerStyle={styles.content}>
            <TouchableOpacity onPress={() => setOpenSub(null)} style={styles.subBack} hitSlop={10}>
              <Text style={styles.subBackText}>← Sous-chapitres</Text>
            </TouchableOpacity>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{openLesson.title}</Text>
              {openLesson.content ? (
                <View style={{ marginTop: 8 }}>
                  {hasMath(openLesson.content) ? <MathLessonView content={openLesson.content} /> : <LessonContent content={openLesson.content} />}
                </View>
              ) : null}
              {done[openLesson.id]?.completed ? (
                <Text style={styles.doneText}>✅ Complété</Text>
              ) : (
                <TouchableOpacity style={[styles.cta, (busy === openLesson.id || fromCache) && styles.ctaDisabled]} disabled={busy === openLesson.id || fromCache} onPress={() => complete(openLesson)}>
                  <Text style={styles.ctaText}>{busy === openLesson.id ? '…' : 'Marquer comme lu'}</Text>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
        ) : (
          /* Liste des sous-chapitres */
          <ScrollView contentContainerStyle={styles.content}>
            {coursList.map((l) => (
              <TouchableOpacity key={l.id} style={styles.subRow} onPress={() => setOpenSub(l.id)}>
                <Text style={styles.subRowText} numberOfLines={2}>{l.title}</Text>
                <Text style={styles.subRowChevron}>{done[l.id]?.completed ? '✅' : '›'}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )
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

                  {(l.type === 'cours' || l.type === 'resume' || l.type === 'fiche') && l.content ? (
                    <View style={{ marginTop: 6 }}>
                      {hasMath(l.content) ? <MathLessonView content={l.content} /> : <LessonContent content={l.content} />}
                    </View>
                  ) : null}

                  {l.type === 'video' && l.video_url ? (
                    <TouchableOpacity style={styles.videoBtn} onPress={() => Linking.openURL(l.video_url!)}>
                      <Text style={styles.videoBtnText}>▶  Ouvrir la vidéo</Text>
                    </TouchableOpacity>
                  ) : null}

                  {l.type === 'quiz' ? (
                    <View style={styles.quizRow}>
                      {l.content ? (hasMath(l.content) ? <MathLessonView content={l.content} /> : <LessonContent content={l.content} />) : null}
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
                  ) : (l.type === 'cours' && !quizzesValidated) ? (
                    <View style={styles.gated}>
                      <Text style={styles.gatedText}>🔒 Valide d'abord le quiz du chapitre pour marquer le cours comme lu.</Text>
                    </View>
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
  exBtn: { flexDirection: 'row', alignItems: 'center', gap: 10, marginHorizontal: 16, marginBottom: 8, backgroundColor: colors.primaryTint, borderRadius: radius.md, paddingVertical: 12, paddingHorizontal: 14 },
  exBtnIcon: { fontSize: 18 },
  exBtnText: { flex: 1, fontSize: 14, fontWeight: '800', color: colors.primary },
  exBtnChevron: { fontSize: 18, color: colors.primary, fontWeight: '800' },
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
  gated: { marginTop: 14, backgroundColor: '#FEF3C7', borderRadius: radius.md, padding: 12 },
  gatedText: { color: '#92400E', fontWeight: '600', fontSize: 13, lineHeight: 18 },
  subRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: radius.md, borderWidth: 1, borderColor: colors.cardBorder, paddingVertical: 16, paddingHorizontal: 16, ...cardShadow },
  subRowText: { flex: 1, fontSize: 15, fontWeight: '700', color: colors.text },
  subRowChevron: { fontSize: 20, color: colors.primary, marginLeft: 8 },
  subBack: { paddingVertical: 6, marginBottom: 4 },
  subBackText: { fontSize: 14, fontWeight: '700', color: colors.primary },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyText: { fontSize: 14, color: colors.textMuted },
  toast: { position: 'absolute', bottom: 30, alignSelf: 'center', backgroundColor: '#111827', paddingHorizontal: 18, paddingVertical: 10, borderRadius: radius.full },
  toastText: { color: '#fff', fontWeight: '700', fontSize: 14 },
})
