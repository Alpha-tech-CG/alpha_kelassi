import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { getCourseById, levelLabels } from '../../content/courses'

export default function CoursDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const course = getCourseById(id)

  if (!course) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyTitle}>Cours introuvable</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Retour</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <Text style={styles.subject}>{course.subject}</Text>
        <Text style={styles.title}>{course.title}</Text>
        <Text style={styles.summary}>{course.summary}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.levelBadge}>{levelLabels[course.level]}</Text>
          <Text style={styles.metaBadge}>{course.chapter}</Text>
          <Text style={styles.metaBadge}>{course.duration}</Text>
          {course.isPremium && <Text style={styles.premiumBadge}>Premium</Text>}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Objectifs</Text>
        {course.objectives.map((objective) => (
          <View key={objective} style={styles.bulletRow}>
            <Text style={styles.bulletDot}>•</Text>
            <Text style={styles.bulletText}>{objective}</Text>
          </View>
        ))}
      </View>

      {course.sections.map((section, index) => (
        <View key={section.title} style={styles.card}>
          <Text style={styles.sectionEyebrow}>Partie {index + 1}</Text>
          <Text style={styles.cardTitle}>{section.title}</Text>
          {section.body.map((paragraph) => (
            <Text key={paragraph} style={styles.paragraph}>{paragraph}</Text>
          ))}
        </View>
      ))}

      <View style={styles.takeawaysCard}>
        <Text style={styles.takeawaysTitle}>A retenir</Text>
        {course.takeaways.map((item) => (
          <View key={item} style={styles.takeawayRow}>
            <Text style={styles.takeawayCheck}>✓</Text>
            <Text style={styles.takeawayText}>{item}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5FBF0' },
  content: { padding: 16, paddingTop: 60, paddingBottom: 32 },
  hero: { backgroundColor: '#EFF6EB', borderRadius: 18, padding: 18, borderWidth: 1, borderColor: '#E3EADF', marginBottom: 14 },
  subject: { fontSize: 12, fontWeight: '800', color: '#006B2E', textTransform: 'uppercase', marginBottom: 8 },
  title: { fontSize: 24, fontWeight: '800', color: '#171D17', lineHeight: 30, marginBottom: 8 },
  summary: { fontSize: 14, color: '#3E4A3E', lineHeight: 21, marginBottom: 14 },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  levelBadge: { fontSize: 11, backgroundColor: '#006B2E', color: '#FFFFFF', paddingHorizontal: 9, paddingVertical: 5, borderRadius: 12, fontWeight: '700' },
  metaBadge: { fontSize: 11, backgroundColor: '#FFFFFF', color: '#171D17', paddingHorizontal: 9, paddingVertical: 5, borderRadius: 12 },
  premiumBadge: { fontSize: 11, backgroundColor: '#F7D64A', color: '#202624', paddingHorizontal: 9, paddingVertical: 5, borderRadius: 12, fontWeight: '700' },
  card: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#E3EADF', marginBottom: 12 },
  sectionEyebrow: { fontSize: 11, color: '#006B2E', fontWeight: '800', textTransform: 'uppercase', marginBottom: 4 },
  cardTitle: { fontSize: 17, fontWeight: '800', color: '#171D17', marginBottom: 10 },
  paragraph: { fontSize: 15, color: '#171D17', lineHeight: 23, marginBottom: 10 },
  bulletRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  bulletDot: { color: '#006B2E', fontSize: 18, lineHeight: 22 },
  bulletText: { flex: 1, fontSize: 14, color: '#171D17', lineHeight: 21 },
  takeawaysCard: { backgroundColor: '#FFF7CC', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#F7D64A' },
  takeawaysTitle: { fontSize: 17, fontWeight: '800', color: '#202624', marginBottom: 10 },
  takeawayRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  takeawayCheck: { color: '#006B2E', fontSize: 15, fontWeight: '800' },
  takeawayText: { flex: 1, fontSize: 14, color: '#202624', lineHeight: 21 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: '#F5FBF0' },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#171D17', marginBottom: 16 },
  backButton: { backgroundColor: '#006B2E', borderRadius: 12, paddingHorizontal: 20, paddingVertical: 12 },
  backButtonText: { color: '#FFFFFF', fontWeight: '700' },
})
