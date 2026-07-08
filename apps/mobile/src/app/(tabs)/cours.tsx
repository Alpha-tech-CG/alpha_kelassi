import { useState, memo, useCallback } from 'react'
import { FlatList, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { courses, levelLabels, type HardcodedCourse } from '../../content/courses'

const LEVELS = ['', 'bepc', 'bac_a', 'bac_c', 'bac_d'] as const

const CourseCard = memo(({ item, onPress }: { item: HardcodedCourse; onPress: () => void }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <View style={styles.cardHeader}>
      <Text style={styles.subject}>{item.subject}</Text>
      <Text style={styles.duration}>{item.duration}</Text>
    </View>
    <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
    <Text style={styles.summary} numberOfLines={2}>{item.summary}</Text>
    <View style={styles.metaRow}>
      <Text style={styles.levelBadge}>{levelLabels[item.level]}</Text>
      <Text style={styles.chapterBadge}>{item.chapter}</Text>
      {item.isPremium && <Text style={styles.premiumBadge}>Premium</Text>}
    </View>
  </TouchableOpacity>
))

export default function CoursScreen() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [level, setLevel] = useState<(typeof LEVELS)[number]>('')

  const filtered = courses.filter((course) => {
    const query = search.trim().toLowerCase()
    if (level && course.level !== level) return false
    if (!query) return true
    return [course.title, course.subject, course.chapter, course.summary]
      .some((value) => value.toLowerCase().includes(query))
  })

  const getItemLayout = useCallback((_: unknown, index: number) => ({
    length: 142,
    offset: 142 * index,
    index,
  }), [])

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Cours & revisions</Text>
        <Text style={styles.subtitle}>Lecons integrees dans l'application, sans PDF a telecharger.</Text>
        <TextInput
          style={styles.search}
          placeholder="Rechercher une lecon..."
          value={search}
          onChangeText={setSearch}
          placeholderTextColor="#6D7A72"
        />
        <View style={styles.levels}>
          {LEVELS.map((item) => (
            <TouchableOpacity
              key={item}
              style={[styles.levelChip, level === item && styles.levelChipActive]}
              onPress={() => setLevel(item)}
            >
              <Text style={[styles.levelChipText, level === item && styles.levelChipTextActive]}>
                {levelLabels[item]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        getItemLayout={getItemLayout}
        initialNumToRender={12}
        maxToRenderPerBatch={8}
        windowSize={5}
        removeClippedSubviews
        renderItem={({ item }) => (
          <CourseCard item={item} onPress={() => router.push(`/cours/${item.id}` as any)} />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>--</Text>
            <Text style={styles.emptyText}>Aucun cours trouve</Text>
          </View>
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7FAF8' },
  header: { backgroundColor: '#EAF5EC', paddingTop: 60, paddingHorizontal: 16, paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: '#DDE8E1' },
  title: { fontSize: 22, fontWeight: '700', color: '#1F2A24', marginBottom: 4 },
  subtitle: { fontSize: 13, color: '#6D7A72', lineHeight: 18, marginBottom: 12 },
  search: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#DDE8E1', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, fontSize: 15, color: '#1F2A24', marginBottom: 10 },
  levels: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  levelChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: '#EEF8F4', borderWidth: 1, borderColor: '#DDE8E1' },
  levelChipActive: { backgroundColor: '#0F8F4F', borderColor: '#0F8F4F' },
  levelChipText: { fontSize: 12, fontWeight: '600', color: '#6D7A72' },
  levelChipTextActive: { color: '#fff' },
  list: { padding: 16, gap: 12 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#DDE8E1' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  subject: { fontSize: 12, fontWeight: '700', color: '#0B6B3A', textTransform: 'uppercase' },
  duration: { fontSize: 12, color: '#6D7A72' },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#1F2A24', marginBottom: 6 },
  summary: { fontSize: 13, color: '#6D7A72', lineHeight: 19, marginBottom: 10 },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  levelBadge: { fontSize: 11, backgroundColor: '#EAF5EC', color: '#0F8F4F', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10, fontWeight: '700' },
  chapterBadge: { fontSize: 11, backgroundColor: '#EEF8F4', color: '#1F2A24', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  premiumBadge: { fontSize: 11, backgroundColor: '#FFF7CC', color: '#0B6B3A', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10, fontWeight: '700' },
  empty: { paddingTop: 60, alignItems: 'center' },
  emptyIcon: { fontSize: 30, marginBottom: 8, color: '#6D7A72' },
  emptyText: { fontSize: 14, color: '#6D7A72' },
})
