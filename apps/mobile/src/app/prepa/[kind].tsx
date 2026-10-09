import { useEffect, useMemo, useState } from 'react'
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, BackHandler } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { supabase } from '../../lib/supabase'
import { useLevel } from '../../hooks/useLevel'
import { useBilling } from '../../hooks/useBilling'
import { colors, radius, cardShadow, fonts, subjectIcon } from '../../lib/theme'
import { isRayon, rayonMeta, MODE_LABEL, type ExamMode } from '../../lib/prepa'

/**
 * Un rayon de l'espace Prépa : l'élève choisit sa matière, puis une épreuve
 * (ou un chapitre de TD). Les épreuves sans question (encore en préparation
 * dans la console) sont masquées grâce à `question_total` (migration 059).
 */

interface Subject { id: string; name: string }
interface Epreuve { id: string; title: string; year: number | null; time_limit_sec: number; is_premium: boolean; subject_id: string; question_total: number }
interface Sujet { id: string; title: string; year: number | null; session: string | null; is_premium: boolean; subject_id: string }
interface TdChapter { id: string; title: string; order_index: number; subject_id: string; count: number }

const MODES: ExamMode[] = ['entrainement', 'bac_test', 'bac_blanc', 'bac_rouge']

export default function PrepaRayonScreen() {
  const { kind } = useLocalSearchParams<{ kind: string }>()
  const router = useRouter()
  const { level, track, ready } = useLevel()
  const { me } = useBilling()
  const allowed = new Set(me?.exam_modes ?? [])

  const rayon = isRayon(kind) ? kind : 'bac_test'
  const meta = rayonMeta(rayon, level)

  const [loading, setLoading] = useState(true)
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [epreuves, setEpreuves] = useState<Epreuve[]>([])
  const [sujets, setSujets] = useState<Sujet[]>([])
  const [chapters, setChapters] = useState<TdChapter[]>([])
  const [subjectId, setSubjectId] = useState<string | null>(null)

  useEffect(() => {
    if (!ready) return
    let active = true
    ;(async () => {
      let sq = supabase.from('subjects').select('id, name').order('name')
      if (level) sq = sq.eq('level', level)
      if (track) sq = sq.eq('track_type', track)
      const { data: subs } = await sq
      const subjectRows = (subs ?? []) as Subject[]
      const ids = subjectRows.map((s) => s.id)

      if (ids.length > 0) {
        if (rayon === 'td') {
          const { data } = await supabase.from('exercises')
            .select('id, chapters!inner(id, title, order_index, subject_id)')
            .in('chapters.subject_id', ids).is('deleted_at', null)
          const map = new Map<string, TdChapter>()
          for (const row of (data ?? []) as any[]) {
            const c = Array.isArray(row.chapters) ? row.chapters[0] : row.chapters
            if (!c) continue
            const cur = map.get(c.id) ?? { id: c.id, title: c.title, order_index: c.order_index ?? 0, subject_id: c.subject_id, count: 0 }
            cur.count += 1
            map.set(c.id, cur)
          }
          if (active) setChapters([...map.values()].sort((a, b) => a.order_index - b.order_index))
        } else {
          const [{ data: qz }, docs] = await Promise.all([
            supabase.from('quizzes')
              .select('id, title, year, time_limit_sec, is_premium, subject_id, question_total')
              .eq('is_exam', true).eq('exam_kind', rayon).is('deleted_at', null).in('subject_id', ids)
              .order('year', { ascending: false, nullsFirst: false }),
            rayon === 'ancien_bac'
              ? supabase.from('documents').select('id, title, year, session, is_premium, subject_id')
                  .eq('type', 'examen').in('subject_id', ids).order('year', { ascending: false, nullsFirst: false })
              : Promise.resolve({ data: [] }),
          ])
          if (active) {
            setEpreuves(((qz ?? []) as Epreuve[]).filter((e) => (e.question_total ?? 0) > 0))
            setSujets((docs.data ?? []) as Sujet[])
          }
        }
      }
      if (active) { setSubjects(subjectRows); setLoading(false) }
    })()
    return () => { active = false }
  }, [ready, level, track, rayon])

  /** Nombre d'éléments par matière dans ce rayon. */
  const countBySubject = useMemo(() => {
    const m = new Map<string, number>()
    const add = (sid: string, n = 1) => m.set(sid, (m.get(sid) ?? 0) + n)
    if (rayon === 'td') chapters.forEach((c) => add(c.subject_id, c.count))
    else { epreuves.forEach((e) => add(e.subject_id)); sujets.forEach((d) => add(d.subject_id)) }
    return m
  }, [rayon, chapters, epreuves, sujets])

  // Matières garnies d'abord : l'élève voit tout de suite où il y a du travail.
  const orderedSubjects = useMemo(
    () => {
      const has = (id: string) => ((countBySubject.get(id) ?? 0) > 0 ? 1 : 0)
      return [...subjects].sort((a, b) => has(b.id) - has(a.id) || a.name.localeCompare(b.name, 'fr'))
    },
    [subjects, countBySubject],
  )
  const subject = subjects.find((s) => s.id === subjectId) ?? null

  // Bouton retour Android : depuis une matière, on revient au choix de la matière.
  useEffect(() => {
    if (!subjectId) return
    const sub = BackHandler.addEventListener('hardwareBackPress', () => { setSubjectId(null); return true })
    return () => sub.remove()
  }, [subjectId])

  function openPlans(plan: string, title: string, body: string) {
    Alert.alert(title, body, [
      { text: 'Voir les formules', onPress: () => router.push(`/abonnement?plan=${plan}` as any) },
      { text: 'Plus tard', style: 'cancel' },
    ])
  }

  function startEpreuve(ep: Epreuve) {
    // Rayon à mode fixe : on lance directement dans ce mode.
    if (meta.mode) {
      if (me && !allowed.has(meta.mode)) {
        openPlans(meta.plan ?? 'starter', `${meta.label} — formule ${meta.planLabel}`,
          `Le ${meta.label} est inclus dans la formule ${meta.planLabel}.`)
        return
      }
      router.push(`/quiz/${ep.id}?mode=${meta.mode}` as any)
      return
    }
    // Ancien sujet : l'élève choisit son mode.
    const open = MODES.filter((m) => allowed.has(m))
    if (me && open.length === 0) {
      openPlans('starter', 'Simulations disponibles dès Starter',
        'Entraînement libre et test chronométré sont inclus dans Starter ; blanc et rouge dans Pro.')
      return
    }
    Alert.alert(ep.title, 'Comment veux-tu passer ce sujet ?', [
      ...MODES.map((m) => {
        const ml = MODE_LABEL[m]
        return !me || allowed.has(m)
          ? { text: `${ml.emoji}  ${ml.label}`, onPress: () => router.push(`/quiz/${ep.id}?mode=${m}` as any) }
          : { text: `🔒  ${ml.label} — ${ml.planLabel}`, onPress: () => router.push(`/abonnement?plan=${ml.plan}` as any) }
      }),
      { text: 'Annuler', style: 'cancel' as const },
    ])
  }

  const header = (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => (subject ? setSubjectId(null) : router.back())} hitSlop={12}
        accessibilityRole="button" accessibilityLabel="Retour">
        <Text style={styles.back}>←</Text>
      </TouchableOpacity>
      <Text style={styles.kicker}>{meta.emoji}  {meta.label.toUpperCase()}</Text>
      <Text style={styles.title}>{subject ? subject.name : 'Choisis ta matière'}</Text>
      {!subject && <Text style={styles.subtitle}>{meta.desc}</Text>}
    </View>
  )

  if (loading) return <View style={styles.container}>{header}<ActivityIndicator style={{ marginTop: 40 }} color={colors.primary} /></View>

  // ── Étape 1 : la matière ───────────────────────────────────────────────────
  if (!subject) {
    return (
      <View style={styles.container}>
        {header}
        <ScrollView contentContainerStyle={styles.content}>
          {orderedSubjects.length === 0 ? (
            <Text style={styles.empty}>Aucune matière pour ta classe pour l'instant.</Text>
          ) : orderedSubjects.map((s) => {
            const n = countBySubject.get(s.id) ?? 0
            return (
              <TouchableOpacity key={s.id} style={[styles.card, n === 0 && styles.cardEmpty]} activeOpacity={0.9}
                onPress={() => setSubjectId(s.id)}>
                <View style={styles.cardIcon}><Text style={{ fontSize: 22 }}>{subjectIcon(s.name)}</Text></View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle} numberOfLines={1}>{s.name}</Text>
                  <Text style={styles.cardSub}>
                    {n === 0 ? 'Bientôt disponible'
                      : rayon === 'td' ? `${n} exercice${n > 1 ? 's' : ''}` : `${n} sujet${n > 1 ? 's' : ''}`}
                  </Text>
                </View>
                <Text style={styles.chevron}>›</Text>
              </TouchableOpacity>
            )
          })}
        </ScrollView>
      </View>
    )
  }

  // ── Étape 2 : TD de la matière ─────────────────────────────────────────────
  if (rayon === 'td') {
    const list = chapters.filter((c) => c.subject_id === subject.id)
    return (
      <View style={styles.container}>
        {header}
        <ScrollView contentContainerStyle={styles.content}>
          {list.length === 0 ? (
            <Text style={styles.empty}>Pas encore d'exercices dans cette matière. Reviens bientôt !</Text>
          ) : list.map((c, i) => (
            <TouchableOpacity key={c.id} style={styles.card} activeOpacity={0.9}
              onPress={() => router.push(`/exercices/${c.id}` as any)}>
              <View style={styles.cardIcon}><Text style={styles.cardIndex}>{i + 1}</Text></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle} numberOfLines={2}>{c.title}</Text>
                <Text style={styles.cardSub}>{c.count} exercice{c.count > 1 ? 's' : ''} corrigé{c.count > 1 ? 's' : ''}</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    )
  }

  // ── Étape 2 : épreuves de la matière ───────────────────────────────────────
  const list = epreuves.filter((e) => e.subject_id === subject.id)
  const pdfs = sujets.filter((d) => d.subject_id === subject.id)
  const locked = !!me && !!meta.mode && !allowed.has(meta.mode)

  return (
    <View style={styles.container}>
      {header}
      <ScrollView contentContainerStyle={styles.content}>
        {locked && (
          <TouchableOpacity style={styles.lockBanner} onPress={() => router.push(`/abonnement?plan=${meta.plan}` as any)}>
            <Text style={styles.lockBannerText}>🔒 {meta.label} : inclus dans la formule {meta.planLabel}. Voir les formules ›</Text>
          </TouchableOpacity>
        )}

        {list.length === 0 && pdfs.length === 0 && (
          <Text style={styles.empty}>Aucun sujet « {meta.label} » dans cette matière pour l'instant. Reviens bientôt !</Text>
        )}

        {list.map((ep) => (
          <TouchableOpacity key={ep.id} style={styles.card} activeOpacity={0.9} onPress={() => startEpreuve(ep)}>
            <View style={styles.cardIcon}><Text style={{ fontSize: 22 }}>{meta.emoji}</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle} numberOfLines={2}>{ep.title} {ep.is_premium ? '⭐' : ''}</Text>
              <Text style={styles.cardSub}>
                {ep.year ? `Session ${ep.year} · ` : ''}{Math.round(ep.time_limit_sec / 60)} min · {ep.question_total} question{ep.question_total > 1 ? 's' : ''}
              </Text>
            </View>
            <Text style={styles.chevron}>{locked ? '🔒' : '›'}</Text>
          </TouchableOpacity>
        ))}

        {pdfs.length > 0 && (
          <>
            <Text style={styles.section}>Sujets officiels (PDF)</Text>
            {pdfs.map((d) => (
              <TouchableOpacity key={d.id} style={styles.card} activeOpacity={0.9} onPress={() => router.push(`/examens/${d.id}` as any)}>
                <View style={styles.cardIcon}><Text style={{ fontSize: 20 }}>📄</Text></View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle} numberOfLines={2}>{d.title} {d.is_premium ? '⭐' : ''}</Text>
                  <Text style={styles.cardSub}>{[d.year, d.session].filter(Boolean).join(' · ') || 'Sujet'}</Text>
                </View>
                <Text style={styles.chevron}>›</Text>
              </TouchableOpacity>
            ))}
          </>
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingTop: 56, paddingHorizontal: 16, paddingBottom: 8 },
  back: { fontSize: 24, color: colors.text, marginBottom: 8 },
  kicker: { fontSize: 12, fontWeight: '900', color: colors.primary, letterSpacing: 1 },
  title: { fontSize: 24, fontFamily: fonts.headingBlack, color: colors.text, marginTop: 4 },
  subtitle: { fontSize: 13, color: colors.textMuted, marginTop: 4 },
  content: { padding: 16, paddingBottom: 40 },
  card: {
    flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.card, borderRadius: radius.lg,
    padding: 14, marginBottom: 10, borderWidth: 1, borderColor: colors.cardBorder, ...cardShadow,
  },
  cardEmpty: { opacity: 0.55 },
  cardIcon: { width: 46, height: 46, borderRadius: 14, backgroundColor: colors.primaryTint, alignItems: 'center', justifyContent: 'center' },
  cardIndex: { fontSize: 18, fontWeight: '900', color: colors.primary },
  cardTitle: { fontSize: 15, fontWeight: '800', color: colors.text },
  cardSub: { fontSize: 12, color: colors.textMuted, marginTop: 3 },
  chevron: { fontSize: 22, color: colors.primary },
  section: { fontSize: 15, fontWeight: '900', color: colors.text, marginTop: 14, marginBottom: 10 },
  empty: { fontSize: 14, color: colors.textMuted, textAlign: 'center', paddingVertical: 40, paddingHorizontal: 20 },
  lockBanner: { backgroundColor: colors.card, borderRadius: radius.md, borderWidth: 1, borderColor: colors.cardBorder, padding: 12, marginBottom: 12 },
  lockBannerText: { fontSize: 13, fontWeight: '700', color: colors.text },
})
