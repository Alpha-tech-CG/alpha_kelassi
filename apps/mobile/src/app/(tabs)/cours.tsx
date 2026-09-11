import { useEffect, useState, useMemo } from 'react'
import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import { useRouter } from 'expo-router'
import { supabase } from '../../lib/supabase'
import { useLevel } from '../../hooks/useLevel'
import { colors, radius, cardShadow, LEVEL_LABEL, levelBadgeStyle, subjectAccent, subjectIcon } from '../../lib/theme'

interface Subject {
  id: string
  name: string
  level: string
  icon: string | null
  lessons: number
  quizzes: number
  progress: number // 0..100
  hasChildren: boolean
  domains: number
}

const BROWSABLE_LEVELS = Object.keys(LEVEL_LABEL)

export default function MatieresScreen() {
  const router = useRouter()
  const { level: profileLevel, track: profileTrack, isAdmin, ready } = useLevel()
  // Un admin peut consulter n'importe quelle classe ; null = celle de son profil.
  const [browseLevel, setBrowseLevel] = useState<string | null>(null)
  const level = browseLevel ?? profileLevel
  // La filière du profil ne vaut que pour la classe du profil.
  const track = browseLevel ? null : profileTrack
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (!ready) return
    // Changer vite de classe ne doit pas laisser une réponse périmée écraser la bonne.
    let active = true
    async function load() {
      // Matières du parcours ET de la filière de l'élève uniquement
      let sq = supabase.from('subjects').select('id, name, level, icon, parent_subject_id').order('name')
      if (level) sq = sq.eq('level', level)
      if (track) sq = sq.eq('track_type', track)
      const { data: subs } = await sq
      const rows = (subs ?? []) as any[]
      const subjectIds = rows.map((s) => s.id)

      // Regroupement en domaines (migration 044) : seules les matières sans parent
      // apparaissent dans la liste principale ; leurs enfants alimentent leurs stats.
      const childrenByParent = new Map<string, any[]>()
      for (const r of rows) {
        if (!r.parent_subject_id) continue
        const arr = childrenByParent.get(r.parent_subject_id) ?? []
        arr.push(r)
        childrenByParent.set(r.parent_subject_id, arr)
      }
      const topLevel = rows.filter((r) => !r.parent_subject_id)

      // Contenu structuré (027) : chapitres → leçons → progression réelle
      const { data: { user } } = await supabase.auth.getUser()
      const chapters = subjectIds.length
        ? ((await supabase.from('chapters').select('id, subject_id').in('subject_id', subjectIds)).data ?? []) as any[]
        : []
      const chapterIds = chapters.map((c) => c.id)
      const lessons = chapterIds.length
        ? ((await supabase.from('lessons').select('id, chapter_id, type').in('chapter_id', chapterIds)).data ?? []) as any[]
        : []
      const lessonIds = lessons.map((l) => l.id)
      const prog = (user && lessonIds.length)
        ? ((await supabase.from('lesson_progress').select('lesson_id, completed').eq('user_id', user.id).in('lesson_id', lessonIds)).data ?? []) as any[]
        : []
      const doneSet = new Set(prog.filter((p) => p.completed).map((p) => p.lesson_id))
      const chapToSubject = new Map(chapters.map((c) => [c.id, c.subject_id]))

      const chapCount = new Map<string, number>()
      for (const c of chapters) chapCount.set(c.subject_id, (chapCount.get(c.subject_id) ?? 0) + 1)
      const quizCount = new Map<string, number>()
      const totalC = new Map<string, number>()
      const doneC = new Map<string, number>()
      for (const l of lessons) {
        const sid = chapToSubject.get(l.chapter_id); if (!sid) continue
        totalC.set(sid, (totalC.get(sid) ?? 0) + 1)
        if (l.type === 'quiz') quizCount.set(sid, (quizCount.get(sid) ?? 0) + 1)
        if (doneSet.has(l.id)) doneC.set(sid, (doneC.get(sid) ?? 0) + 1)
      }

      if (!active) return
      setSubjects(topLevel.map((s) => {
        const children = childrenByParent.get(s.id) ?? []
        const ids = children.length ? [s.id, ...children.map((c) => c.id)] : [s.id]
        const sum = (m: Map<string, number>) => ids.reduce((acc, id) => acc + (m.get(id) ?? 0), 0)
        const t = sum(totalC)
        return {
          id: s.id, name: s.name, level: s.level, icon: s.icon,
          lessons: sum(chapCount),
          quizzes: sum(quizCount),
          progress: t ? Math.round((sum(doneC) / t) * 100) : 0,
          hasChildren: children.length > 0,
          domains: children.length,
        }
      }))
      setLoading(false)
    }
    load()
    return () => { active = false }
  }, [ready, level, track])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return q ? subjects.filter((s) => s.name.toLowerCase().includes(q)) : subjects
  }, [subjects, search])

  if (loading) return <ActivityIndicator style={{ flex: 1, backgroundColor: colors.background }} color={colors.primary} />

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mes Matières</Text>
        {level && <Text style={styles.subtitle}>Programme {LEVEL_LABEL[level] ?? level}{browseLevel ? ' · consultation admin' : ''}</Text>}
        {isAdmin && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.levelChips}>
            {BROWSABLE_LEVELS.map((l) => {
              const on = l === level
              return (
                <TouchableOpacity
                  key={l}
                  style={[styles.levelChip, on && styles.levelChipOn]}
                  onPress={() => setBrowseLevel(l === profileLevel ? null : l)}
                >
                  <Text style={[styles.levelChipText, on && styles.levelChipTextOn]}>{LEVEL_LABEL[l]}</Text>
                </TouchableOpacity>
              )
            })}
          </ScrollView>
        )}
        <TextInput
          style={styles.search}
          placeholder="Rechercher une matière…"
          value={search}
          onChangeText={setSearch}
          placeholderTextColor={colors.outline}
        />
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        {filtered.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>📚</Text>
            <Text style={styles.emptyText}>
              {level ? 'Aucune matière pour ton niveau pour le moment.' : 'Termine ton inscription pour voir tes matières.'}
            </Text>
          </View>
        ) : (
          filtered.map((s) => {
            const accent = subjectAccent(s.name)
            const badge = levelBadgeStyle(s.level)
            return (
              <TouchableOpacity
                key={s.id}
                activeOpacity={0.85}
                style={styles.card}
                onPress={() => router.push(((s.level === 'cepe' || s.level === 'bepc') ? `/progression?subject=${s.id}&level=${s.level}` : `/parcours/${s.id}`) as any)}
              >
                <View style={[styles.accent, { backgroundColor: accent }]} />
                <View style={styles.cardBody}>
                  <View style={styles.cardTop}>
                    <View style={[styles.iconBox, { backgroundColor: accent + '1A' }]}>
                      <Text style={styles.iconText}>{s.icon || subjectIcon(s.name)}</Text>
                    </View>
                    <View style={[styles.badge, { backgroundColor: badge.bg }]}>
                      <Text style={[styles.badgeText, { color: badge.fg }]}>{LEVEL_LABEL[s.level]}</Text>
                    </View>
                  </View>

                  <Text style={styles.subjectName}>{s.name}</Text>
                  <Text style={styles.counts}>
                    {s.hasChildren ? `📁 ${s.domains} domaines   📘 ${s.lessons} chapitres` : `📘 ${s.lessons} Cours   ✅ ${s.quizzes} Quiz`}
                  </Text>

                  <View style={styles.progressRow}>
                    <Text style={styles.progressLabel}>Progression</Text>
                    <Text style={[styles.progressPct, { color: colors.primary }]}>{s.progress}%</Text>
                  </View>
                  <View style={styles.progressTrack}>
                    <View style={[styles.progressFill, { width: `${s.progress}%`, backgroundColor: colors.primary }]} />
                  </View>
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
  header: { paddingTop: 60, paddingHorizontal: 16, paddingBottom: 12 },
  title: { fontSize: 26, fontWeight: '800', color: colors.text },
  subtitle: { fontSize: 13, color: colors.textMuted, marginTop: 2, marginBottom: 12 },
  levelChips: { gap: 8, paddingBottom: 10 },
  levelChip: {
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: radius.full,
    borderWidth: 1, borderColor: colors.cardBorder, backgroundColor: colors.card,
  },
  levelChipOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  levelChipText: { fontSize: 12, fontWeight: '700', color: colors.textMuted },
  levelChipTextOn: { color: '#fff' },
  search: {
    backgroundColor: colors.card, borderWidth: 1, borderColor: colors.cardBorder, borderRadius: radius.md,
    paddingHorizontal: 14, paddingVertical: 11, fontSize: 15, color: colors.text, marginTop: 4,
  },
  list: { padding: 16, paddingTop: 4, gap: 14 },
  card: {
    flexDirection: 'row', backgroundColor: colors.card, borderRadius: radius.lg, overflow: 'hidden',
    borderWidth: 1, borderColor: colors.cardBorder, ...cardShadow,
  },
  accent: { width: 5 },
  cardBody: { flex: 1, padding: 16 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  iconBox: { width: 48, height: 48, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  iconText: { fontSize: 24 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.full },
  badgeText: { fontSize: 11, fontWeight: '800' },
  subjectName: { fontSize: 19, fontWeight: '800', color: colors.text, marginTop: 12 },
  counts: { fontSize: 13, color: colors.textMuted, marginTop: 4 },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 14 },
  progressLabel: { fontSize: 13, color: colors.textMuted },
  progressPct: { fontSize: 15, fontWeight: '800' },
  progressTrack: { height: 8, backgroundColor: colors.primaryTint, borderRadius: radius.full, marginTop: 6, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: radius.full },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyIcon: { fontSize: 40, marginBottom: 12 },
  emptyText: { fontSize: 14, color: colors.textMuted, textAlign: 'center', paddingHorizontal: 30 },
})
