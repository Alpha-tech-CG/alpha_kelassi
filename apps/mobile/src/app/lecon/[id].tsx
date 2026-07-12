import { useEffect, useState } from 'react'
import { ScrollView, View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { supabase } from '../../lib/supabase'
import { colors, radius } from '../../lib/theme'

type Block =
  | { type: 'subtitle'; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'image'; url: string; caption?: string }

interface Lesson { id: string; title: string; content: Block[] }

export default function LeconScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('course_lessons').select('id, title, content').eq('id', id).single()
      setLesson(data as unknown as Lesson | null)
      setLoading(false)
    }
    load()
  }, [id])

  if (loading) return <ActivityIndicator style={{ flex: 1, backgroundColor: colors.background }} color={colors.primary} />

  if (!lesson) {
    return (
      <View style={styles.emptyScreen}>
        <Text style={styles.emptyTitle}>Leçon introuvable.</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}><Text style={styles.backBtnText}>Retour</Text></TouchableOpacity>
      </View>
    )
  }

  const blocks = Array.isArray(lesson.content) ? lesson.content : []

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={12}><Text style={styles.back}>←</Text></TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>Leçon</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{lesson.title}</Text>

        {blocks.length === 0 ? (
          <View style={styles.empty}><Text style={styles.emptyText}>Contenu à venir.</Text></View>
        ) : (
          blocks.map((b, i) => {
            if (b.type === 'subtitle') return <Text key={i} style={styles.subtitle}>{b.text}</Text>
            if (b.type === 'paragraph') return <Text key={i} style={styles.paragraph}>{b.text}</Text>
            if (b.type === 'image') return <ImageBlock key={i} url={b.url} caption={b.caption} />
            return null
          })
        )}
      </ScrollView>
    </View>
  )
}

function ImageBlock({ url, caption }: { url: string; caption?: string }) {
  const [ratio, setRatio] = useState(16 / 9)
  useEffect(() => {
    Image.getSize(url, (w, h) => { if (w && h) setRatio(w / h) }, () => {})
  }, [url])
  return (
    <View style={styles.imageWrap}>
      <Image source={{ uri: url }} style={[styles.image, { aspectRatio: ratio }]} resizeMode="contain" />
      {caption ? <Text style={styles.caption}>{caption}</Text> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', paddingTop: 52, paddingHorizontal: 16, paddingBottom: 12, gap: 12, backgroundColor: colors.card, borderBottomWidth: 1, borderBottomColor: colors.cardBorder },
  back: { fontSize: 24, color: colors.text },
  headerTitle: { fontSize: 16, fontWeight: '700', color: colors.text, flex: 1 },
  content: { padding: 20, paddingBottom: 48 },
  title: { fontSize: 22, fontWeight: '800', color: colors.text, marginBottom: 16, lineHeight: 28 },
  subtitle: { fontSize: 18, fontWeight: '800', color: colors.primary, marginTop: 20, marginBottom: 8 },
  paragraph: { fontSize: 16, color: colors.text, lineHeight: 25, marginBottom: 12 },
  imageWrap: { marginVertical: 12 },
  image: { width: '100%', borderRadius: radius.md, backgroundColor: colors.primaryTint },
  caption: { fontSize: 13, color: colors.textMuted, fontStyle: 'italic', textAlign: 'center', marginTop: 6 },
  empty: { backgroundColor: colors.card, borderRadius: radius.md, borderWidth: 1, borderColor: colors.cardBorder, padding: 24, alignItems: 'center', marginTop: 12 },
  emptyText: { fontSize: 14, color: colors.textMuted },
  emptyScreen: { flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', gap: 16 },
  emptyTitle: { fontSize: 16, color: colors.textMuted },
  backBtn: { backgroundColor: colors.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: radius.md },
  backBtnText: { color: '#fff', fontWeight: '700' },
})
