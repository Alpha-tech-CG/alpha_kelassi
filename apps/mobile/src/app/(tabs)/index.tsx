import { useEffect, useState } from 'react'
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import { useRouter } from 'expo-router'
import { supabase } from '../../lib/supabase'
import { useLevel } from '../../hooks/useLevel'
import { colors, radius, cardShadow, LEVEL_LABEL, subjectIcon } from '../../lib/theme'

interface SubjectVM { id: string; name: string; icon: string | null; progress: number }

const ACTIONS = [
  { label: 'Tuteur',  icon: '💬', route: '/(tabs)/tuteur' },
  { label: 'Cards',   icon: '🃏', route: '/flashcards' },
  { label: 'Examens', icon: '📄', route: '/(tabs)/examens' },
  { label: 'Vidéos',  icon: '🎬', route: '/videos' },
]

export default function HomeScreen() {
  const router = useRouter()
  const { level, track, ready } = useLevel()
  const [name, setName] = useState('')
  const [xp, setXp] = useState(0)
  const [streak, setStreak] = useState(0)
  const [subjects, setSubjects] = useState<SubjectVM[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!ready) return
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }

      const [{ data: profile }, { data: prog }] = await Promise.all([
        supabase.from('users').select('full_name, xp').eq('id', user.id).single(),
        supabase.from('user_progress').select('streak_days').eq('user_id', user.id),
      ])
      setName((profile as { full_name?: string })?.full_name?.split(' ')[0] ?? 'Élève')
      setXp((profile as { xp?: number })?.xp ?? 0)
      setStreak(Math.max(0, ...((prog ?? []) as { streak_days: number }[]).map((p) => p.streak_days)))

      // Matières du parcours + progression réelle
      let sq = supabase.from('subjects').select('id, name, icon').order('name')
      if (level) sq = sq.eq('level', level)
      if (track) sq = sq.eq('track_type', track)
      const { data: subs } = await sq
      const rows = (subs ?? []) as { id: string; name: string; icon: string | null }[]
      const ids = rows.map((s) => s.id)

      const chapters = ids.length ? ((await supabase.from('chapters').select('id, subject_id').in('subject_id', ids)).data ?? []) as any[] : []
      const chIds = chapters.map((c) => c.id)
      const lessons = chIds.length ? ((await supabase.from('lessons').select('id, chapter_id').in('chapter_id', chIds)).data ?? []) as any[] : []
      const lIds = lessons.map((l) => l.id)
      const done = lIds.length ? ((await supabase.from('lesson_progress').select('lesson_id').eq('user_id', user.id).eq('completed', true).in('lesson_id', lIds)).data ?? []) as any[] : []
      const doneSet = new Set(done.map((d) => d.lesson_id))
      const chToSub = new Map(chapters.map((c) => [c.id, c.subject_id]))
      const tot = new Map<string, number>(), dn = new Map<string, number>()
      for (const l of lessons) {
        const sid = chToSub.get(l.chapter_id); if (!sid) continue
        tot.set(sid, (tot.get(sid) ?? 0) + 1)
        if (doneSet.has(l.id)) dn.set(sid, (dn.get(sid) ?? 0) + 1)
      }
      setSubjects(rows.map((s) => {
        const t = tot.get(s.id) ?? 0
        return { id: s.id, name: s.name, icon: s.icon, progress: t ? Math.round(((dn.get(s.id) ?? 0) / t) * 100) : 0 }
      }))
      setLoading(false)
    }
    load()
  }, [ready, level, track])

  if (loading) return <ActivityIndicator style={{ flex: 1, backgroundColor: colors.background }} color={colors.primary} />

  const total = subjects.length
  const started = subjects.filter((s) => s.progress > 0).length
  const overall = total ? Math.round(subjects.reduce((a, s) => a + s.progress, 0) / total) : 0
  const lvl = level ? LEVEL_LABEL[level] : '—'

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
      {/* Header vert arrondi */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <TouchableOpacity style={styles.avatar} onPress={() => router.push('/(tabs)/profil')}>
              <Text style={styles.avatarText}>{name[0]?.toUpperCase() ?? '?'}</Text>
              <View style={styles.avatarBadge}><Text style={styles.avatarBadgeText}>{lvl}</Text></View>
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
              <Text style={styles.hello} numberOfLines={1}>Salut, {name} ! 👋</Text>
              <View style={styles.chips}>
                <View style={styles.chip}><Text style={styles.chipText}>🔥 {streak} Jours</Text></View>
                <View style={styles.chip}><Text style={styles.chipText}>⭐ {xp.toLocaleString('fr-FR')} XP</Text></View>
              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.bell}><Text style={{ fontSize: 20 }}>🔔</Text></TouchableOpacity>
        </View>

        {/* Carte progression (chevauche le header) */}
        <View style={styles.progCard}>
          <View style={styles.progTop}>
            <Text style={styles.progTitle}>PROGRESSION {lvl}</Text>
            <Text style={styles.progCount}>{started} / {total} matières</Text>
          </View>
          <View style={styles.progTrack}><View style={[styles.progFill, { width: `${overall}%` }]} /></View>
          <Text style={styles.progHint}>🎖️ Continue — {overall}% de ton parcours complété !</Text>
        </View>
      </View>

      <View style={styles.body}>
        {/* Raccourcis */}
        <View style={styles.actions}>
          {ACTIONS.map((a) => (
            <TouchableOpacity key={a.label} style={styles.action} onPress={() => router.push(a.route as any)}>
              <View style={styles.actionBox}><Text style={{ fontSize: 24 }}>{a.icon}</Text></View>
              <Text style={styles.actionLabel}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tes Matières */}
        <View style={styles.sectionHead}>
          <Text style={styles.sectionTitle}>Tes Matières</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/cours')}><Text style={styles.seeAll}>VOIR TOUT</Text></TouchableOpacity>
        </View>
        {subjects.length === 0 ? (
          <Text style={styles.empty}>Choisis ton parcours pour voir tes matières.</Text>
        ) : (
          <View style={styles.grid}>
            {subjects.slice(0, 6).map((s) => (
              <TouchableOpacity key={s.id} style={styles.subjectCard} onPress={() => router.push(`/parcours/${s.id}` as any)}>
                <View style={styles.subjectIcon}><Text style={{ fontSize: 24 }}>{s.icon ?? subjectIcon(s.name)}</Text></View>
                <Text style={styles.subjectName} numberOfLines={1}>{s.name}</Text>
                <View style={styles.subjectProgRow}>
                  <View style={styles.subjectTrack}><View style={[styles.subjectFill, { width: `${s.progress}%` }]} /></View>
                  <Text style={styles.subjectPct}>{s.progress}%</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* CTA Kelassi */}
        <TouchableOpacity style={styles.cta} onPress={() => router.push('/(tabs)/tuteur')}>
          <View style={{ flex: 1 }}>
            <Text style={styles.ctaTitle}>Besoin d'aide ?</Text>
            <Text style={styles.ctaSub}>Demande à Kelassi, ton tuteur IA !</Text>
            <View style={styles.ctaBtn}><Text style={styles.ctaBtnText}>PARLER À KELASSI →</Text></View>
          </View>
          <Text style={{ fontSize: 56 }}>🤖</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { backgroundColor: colors.primary, paddingTop: 52, paddingBottom: 56, paddingHorizontal: 20, borderBottomLeftRadius: 40, borderBottomRightRadius: 40 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerLeft: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 54, height: 54, borderRadius: 18, backgroundColor: '#ffffff33', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#ffffff80' },
  avatarText: { color: '#fff', fontSize: 22, fontWeight: '800' },
  avatarBadge: { position: 'absolute', bottom: -6, right: -6, backgroundColor: colors.yellow, borderRadius: 10, paddingHorizontal: 5, paddingVertical: 1, borderWidth: 2, borderColor: colors.primary },
  avatarBadgeText: { color: colors.onYellow, fontSize: 9, fontWeight: '800' },
  hello: { color: '#fff', fontSize: 19, fontWeight: '900' },
  chips: { flexDirection: 'row', gap: 8, marginTop: 6 },
  chip: { backgroundColor: '#ffffff2e', paddingHorizontal: 9, paddingVertical: 3, borderRadius: radius.full },
  chipText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  bell: { width: 46, height: 46, borderRadius: 16, backgroundColor: '#ffffff2e', alignItems: 'center', justifyContent: 'center' },
  progCard: { backgroundColor: '#fff', borderRadius: 26, padding: 20, marginTop: 22, ...cardShadow },
  progTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  progTitle: { color: colors.text, fontSize: 13, fontWeight: '900', letterSpacing: 0.3 },
  progCount: { color: colors.primary, fontSize: 13, fontWeight: '900' },
  progTrack: { height: 16, backgroundColor: colors.primaryTint, borderRadius: radius.full, padding: 3, overflow: 'hidden' },
  progFill: { height: '100%', backgroundColor: colors.primary, borderRadius: radius.full },
  progHint: { color: colors.textMuted, fontSize: 11, fontWeight: '700', marginTop: 14 },
  body: { paddingHorizontal: 20, marginTop: 20 },
  actions: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 28 },
  action: { alignItems: 'center', gap: 6, width: '23%' },
  actionBox: { width: 56, height: 56, borderRadius: 18, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.cardBorder, ...cardShadow },
  actionLabel: { fontSize: 10, fontWeight: '900', color: colors.textMuted, textTransform: 'uppercase' },
  sectionHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 20, fontWeight: '900', color: colors.text },
  seeAll: { color: colors.primary, fontSize: 11, fontWeight: '900', letterSpacing: 1 },
  empty: { color: colors.textMuted, fontSize: 14, paddingVertical: 20, textAlign: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14 },
  subjectCard: { width: '46%', flexGrow: 1, backgroundColor: '#fff', borderRadius: 26, padding: 18, borderWidth: 1, borderColor: colors.cardBorder, ...cardShadow },
  subjectIcon: { width: 52, height: 52, borderRadius: 16, backgroundColor: colors.primaryTint, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  subjectName: { fontSize: 15, fontWeight: '900', color: colors.text, marginBottom: 8 },
  subjectProgRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  subjectTrack: { flex: 1, height: 5, backgroundColor: colors.primaryTint, borderRadius: radius.full, overflow: 'hidden' },
  subjectFill: { height: '100%', backgroundColor: colors.primary, borderRadius: radius.full },
  subjectPct: { fontSize: 10, fontWeight: '900', color: colors.primary },
  cta: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.primary, borderRadius: 32, padding: 24, marginTop: 28, ...cardShadow },
  ctaTitle: { color: '#fff', fontSize: 19, fontWeight: '900', marginBottom: 4 },
  ctaSub: { color: '#ffffffcc', fontSize: 12, fontWeight: '700', marginBottom: 14 },
  ctaBtn: { alignSelf: 'flex-start', backgroundColor: colors.yellow, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 16 },
  ctaBtnText: { color: colors.onYellow, fontSize: 12, fontWeight: '900' },
})
