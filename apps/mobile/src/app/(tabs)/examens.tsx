import { useEffect, useState, useMemo } from 'react'
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import { useRouter } from 'expo-router'
import { supabase } from '../../lib/supabase'
import { useLevel } from '../../hooks/useLevel'
import { colors, radius, cardShadow, LEVEL_LABEL, levelBadgeStyle } from '../../lib/theme'

interface Doc { id: string; title: string; level: string; year: number | null; session: string | null; is_premium: boolean; subjects: { name: string } | null }

export default function ExamensScreen() {
  const router = useRouter()
  const { level, ready } = useLevel()
  const [docs, setDocs] = useState<Doc[]>([])
  const [loading, setLoading] = useState(true)
  const [year, setYear] = useState<string>('') // '' = toutes

  useEffect(() => {
    if (!ready) return
    let q = supabase
      .from('documents')
      .select('id, title, level, year, session, is_premium, subjects(name)')
      .eq('type', 'examen')
      .order('year', { ascending: false })
      .limit(200)
    if (level) q = q.eq('level', level) // uniquement les annales du niveau de l'élève
    q.then(({ data }) => {
      setDocs((data ?? []).map((doc) => ({
        ...doc,
        subjects: Array.isArray(doc.subjects) ? (doc.subjects[0] ?? null) : doc.subjects,
      })) as Doc[])
      setLoading(false)
    })
  }, [ready, level])

  const years = useMemo(() => {
    const set = new Set<string>()
    for (const d of docs) if (d.year) set.add(String(d.year))
    return [...set].sort((a, b) => b.localeCompare(a))
  }, [docs])

  const filtered = year ? docs.filter((d) => String(d.year) === year) : docs

  if (loading) return <ActivityIndicator style={{ flex: 1, backgroundColor: colors.background }} color={colors.primary} />

  const badge = level ? levelBadgeStyle(level) : { bg: colors.red, fg: colors.onRed }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {level && (
          <View style={[styles.levelPill, { backgroundColor: badge.bg }]}>
            <Text style={[styles.levelPillText, { color: badge.fg }]}>{LEVEL_LABEL[level]}</Text>
          </View>
        )}
        <Text style={styles.title}>Annales & Examens</Text>

        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.heroKicker}>OBJECTIF MENTION</Text>
          <Text style={styles.heroText}>Révise avec les sujets officiels corrigés de ton niveau.</Text>
        </View>

        {/* Filtre par année */}
        {years.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.yearsScroll} contentContainerStyle={styles.years}>
            <TouchableOpacity style={[styles.yearChip, year === '' && styles.yearChipActive]} onPress={() => setYear('')}>
              <Text style={[styles.yearChipText, year === '' && styles.yearChipTextActive]}>Toutes</Text>
            </TouchableOpacity>
            {years.map((y) => (
              <TouchableOpacity key={y} style={[styles.yearChip, year === y && styles.yearChipActive]} onPress={() => setYear(y)}>
                <Text style={[styles.yearChipText, year === y && styles.yearChipTextActive]}>{y}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        <Text style={styles.sectionTitle}>Sujets disponibles{year ? ` (${year})` : ''}</Text>

        {filtered.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyText}>Aucun sujet disponible pour le moment.</Text>
          </View>
        ) : (
          filtered.map((doc) => (
            <TouchableOpacity key={doc.id} style={styles.card} onPress={() => router.push(`/examens/${doc.id}` as any)}>
              <View style={styles.cardIconBox}><Text style={styles.cardIcon}>📝</Text></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle} numberOfLines={2}>{doc.title}</Text>
                <View style={styles.cardMeta}>
                  {doc.subjects && <Text style={styles.subjectText}>{doc.subjects.name}</Text>}
                  {doc.year && <Text style={styles.metaDot}>· {doc.year}</Text>}
                  {doc.session && <Text style={styles.metaDot}>· {doc.session}</Text>}
                </View>
              </View>
              {doc.is_premium && <Text style={styles.premium}>⭐</Text>}
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, paddingTop: 56 },
  levelPill: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 5, borderRadius: radius.full, marginBottom: 8 },
  levelPillText: { fontSize: 12, fontWeight: '800' },
  title: { fontSize: 26, fontWeight: '800', color: colors.text, marginBottom: 16 },
  hero: { backgroundColor: colors.primary, borderRadius: radius.lg, padding: 22, marginBottom: 18, ...cardShadow },
  heroKicker: { color: '#83FB9C', fontSize: 13, fontWeight: '800', letterSpacing: 1, marginBottom: 8 },
  heroText: { color: '#fff', fontSize: 17, fontWeight: '600', lineHeight: 24 },
  yearsScroll: { marginBottom: 16 },
  years: { gap: 8, paddingRight: 16 },
  yearChip: { paddingHorizontal: 18, paddingVertical: 9, borderRadius: radius.full, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.cardBorder },
  yearChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  yearChipText: { fontSize: 14, fontWeight: '700', color: colors.textMuted },
  yearChipTextActive: { color: '#fff' },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: colors.text, marginBottom: 10 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: radius.md, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: colors.cardBorder, gap: 12, ...cardShadow },
  cardIconBox: { width: 44, height: 44, borderRadius: radius.sm, backgroundColor: colors.primaryTint, alignItems: 'center', justifyContent: 'center' },
  cardIcon: { fontSize: 20 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: 3 },
  cardMeta: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 4 },
  subjectText: { fontSize: 12, color: colors.textMuted, fontWeight: '600' },
  metaDot: { fontSize: 12, color: colors.outline },
  premium: { fontSize: 14 },
  chevron: { fontSize: 22, color: colors.outlineVariant },
  empty: { backgroundColor: colors.card, borderRadius: radius.md, borderWidth: 1, borderColor: colors.cardBorder, padding: 30, alignItems: 'center' },
  emptyIcon: { fontSize: 36, marginBottom: 8 },
  emptyText: { fontSize: 14, color: colors.textMuted, textAlign: 'center' },
})
