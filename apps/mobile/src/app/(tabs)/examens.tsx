import { useEffect, useState } from 'react'
import { FlatList, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import { useRouter } from 'expo-router'
import { supabase } from '../../lib/supabase'

interface Doc { id: string; title: string; level: string; year: number | null; session: string | null; is_premium: boolean; subjects: { name: string } | null }

const LEVELS = ['', 'bepc', 'bac_a', 'bac_c', 'bac_d'] as const
const LEVEL_LABELS: Record<string, string> = { '': 'Tous', bepc: 'BEPC', bac_a: 'BAC A', bac_c: 'BAC C', bac_d: 'BAC D' }

export default function ExamensScreen() {
  const router = useRouter()
  const [docs, setDocs] = useState<Doc[]>([])
  const [loading, setLoading] = useState(true)
  const [level, setLevel] = useState('')

  useEffect(() => {
    supabase
      .from('documents')
      .select('id, title, level, year, session, is_premium, subjects(name)')
      .eq('type', 'examen')
      .order('year', { ascending: false })
      .limit(100)
      .then(({ data }) => {
        setDocs((data ?? []) as Doc[])
        setLoading(false)
      })
  }, [])

  const filtered = level ? docs.filter((d) => d.level === level) : docs

  const byYear = filtered.reduce<Record<string, Doc[]>>((acc, d) => {
    const y = d.year?.toString() ?? 'N/A'
    if (!acc[y]) acc[y] = []
    acc[y].push(d)
    return acc
  }, {})
  const sections = Object.entries(byYear).sort((a, b) => b[0].localeCompare(a[0]))

  if (loading) return <ActivityIndicator style={{ flex: 1 }} color="#0B6B3A" />

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Examens d'État</Text>
        <View style={styles.levels}>
          {LEVELS.map((l) => (
            <TouchableOpacity
              key={l}
              style={[styles.levelChip, level === l && styles.levelChipActive]}
              onPress={() => setLevel(l)}
            >
              <Text style={[styles.levelChipText, level === l && styles.levelChipTextActive]}>
                {LEVEL_LABELS[l]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FlatList
        data={sections}
        keyExtractor={([year]) => year}
        contentContainerStyle={styles.list}
        renderItem={({ item: [year, yearDocs] }) => (
          <View style={styles.section}>
            <Text style={styles.yearLabel}>📅 {year}</Text>
            {yearDocs.map((doc) => (
              <TouchableOpacity
                key={doc.id}
                style={styles.card}
                onPress={() => router.push(`/examens/${doc.id}` as any)}
              >
                <Text style={styles.cardIcon}>📝</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle} numberOfLines={2}>{doc.title}</Text>
                  <View style={styles.cardMeta}>
                    <Text style={styles.levelBadge}>{doc.level.replace('_', ' ').toUpperCase()}</Text>
                    {doc.session && (
                      <Text style={[styles.sessionBadge, doc.session === 'rattrapage' && styles.rattrapageBadge]}>
                        {doc.session}
                      </Text>
                    )}
                    {doc.subjects && <Text style={styles.subjectText}>{doc.subjects.name}</Text>}
                  </View>
                </View>
                {doc.is_premium && <Text style={{ fontSize: 14 }}>⭐</Text>}
              </TouchableOpacity>
            ))}
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyText}>Aucun examen disponible</Text>
          </View>
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7FAF8' },
  header: { backgroundColor: '#F0ECFA', paddingTop: 60, paddingHorizontal: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#DDE8E1' },
  title: { fontSize: 22, fontWeight: '700', color: '#1F2A24', marginBottom: 12 },
  levels: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  levelChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: '#EEF8F4', borderWidth: 1, borderColor: '#DDE8E1' },
  levelChipActive: { backgroundColor: '#0B6B3A', borderColor: '#0B6B3A' },
  levelChipText: { fontSize: 12, fontWeight: '600', color: '#6D7A72' },
  levelChipTextActive: { color: '#fff' },
  list: { padding: 16 },
  section: { marginBottom: 24 },
  yearLabel: { fontSize: 16, fontWeight: '700', color: '#1F2A24', marginBottom: 10 },
  card: { backgroundColor: '#fff', borderRadius: 14, padding: 14, flexDirection: 'row', alignItems: 'center', marginBottom: 8, borderWidth: 1, borderColor: '#EEF8F4' },
  cardIcon: { fontSize: 22, marginRight: 12 },
  cardTitle: { fontSize: 14, fontWeight: '500', color: '#1F2A24', marginBottom: 4 },
  cardMeta: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, alignItems: 'center' },
  levelBadge: { fontSize: 10, backgroundColor: '#F0ECFA', color: '#0B6B3A', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10, fontWeight: '600' },
  sessionBadge: { fontSize: 10, backgroundColor: '#EAF5EC', color: '#0F8F4F', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10 },
  rattrapageBadge: { backgroundColor: '#FFF7CC', color: '#0B6B3A' },
  subjectText: { fontSize: 10, color: '#6D7A72' },
  empty: { paddingTop: 60, alignItems: 'center' },
  emptyIcon: { fontSize: 40, marginBottom: 8 },
  emptyText: { fontSize: 14, color: '#6D7A72' },
})
