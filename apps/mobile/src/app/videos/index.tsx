import { useEffect, useState } from 'react'
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Image, Linking } from 'react-native'
import { useRouter } from 'expo-router'
import { supabase } from '../../lib/supabase'
import { API_URL } from '../../lib/config'
import { useLevel } from '../../hooks/useLevel'
import { colors, radius, cardShadow } from '../../lib/theme'

interface Video {
  id: string
  title: string
  level: string
  url: string
  duration_sec: number | null
  thumbnail_url: string | null
  is_premium: boolean
  subjects: { name: string } | null
}

export default function VideosScreen() {
  const router = useRouter()
  const { level, ready } = useLevel()
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!ready) return
    async function load() {
      const { data: { session } } = await supabase.auth.getSession()
      const q = level ? `?level=${level}` : ''
      const res = await fetch(`${API_URL}/api/videos${q}`, { headers: { Authorization: `Bearer ${session?.access_token}` } })
      const json = await res.json()
      setVideos(json.data ?? [])
      setLoading(false)
    }
    load()
  }, [ready, level])

  // Ouvre dans l'app YouTube / le navigateur : lecteur natif, adaptation au débit, offline géré par YouTube
  function watch(v: Video) {
    Linking.openURL(v.url).catch(() => null)
  }

  if (loading) return <ActivityIndicator style={{ flex: 1, backgroundColor: colors.background }} color={colors.primary} />

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={12}><Text style={styles.back}>←</Text></TouchableOpacity>
        <Text style={styles.title}>Cours vidéo</Text>
        <View style={{ width: 24 }} />
      </View>

      {videos.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>🎬</Text>
          <Text style={styles.emptyText}>Aucune vidéo disponible pour le moment.</Text>
        </View>
      ) : (
        videos.map((v) => (
          <TouchableOpacity key={v.id} style={styles.card} onPress={() => watch(v)} activeOpacity={0.85}>
            <View style={styles.thumbWrap}>
              {v.thumbnail_url
                ? <Image source={{ uri: v.thumbnail_url }} style={styles.thumb} />
                : <View style={[styles.thumb, styles.thumbEmpty]}><Text style={styles.playIcon}>▶</Text></View>}
              <View style={styles.playBadge}><Text style={styles.playBadgeText}>▶</Text></View>
            </View>
            <View style={styles.meta}>
              <Text style={styles.videoTitle} numberOfLines={2}>{v.title} {v.is_premium ? '⭐' : ''}</Text>
              <Text style={styles.videoSub}>
                {v.subjects?.name ? `${v.subjects.name}` : ''}
                {v.duration_sec ? ` · ${Math.floor(v.duration_sec / 60)} min` : ''}
              </Text>
            </View>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, paddingTop: 56 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 },
  back: { fontSize: 24, color: colors.text },
  title: { fontSize: 20, fontWeight: '800', color: colors.text },
  empty: { alignItems: 'center', paddingTop: 50 },
  emptyIcon: { fontSize: 40, marginBottom: 12 },
  emptyText: { fontSize: 14, color: colors.textMuted, textAlign: 'center' },
  card: { backgroundColor: colors.card, borderRadius: radius.lg, overflow: 'hidden', marginBottom: 14, borderWidth: 1, borderColor: colors.cardBorder, ...cardShadow },
  thumbWrap: { position: 'relative', width: '100%', aspectRatio: 16 / 9, backgroundColor: '#DDE8E1' },
  thumb: { width: '100%', height: '100%' },
  thumbEmpty: { alignItems: 'center', justifyContent: 'center' },
  playIcon: { fontSize: 32, color: colors.outline },
  playBadge: { position: 'absolute', top: '50%', left: '50%', marginLeft: -24, marginTop: -24, width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(0,107,46,0.92)', alignItems: 'center', justifyContent: 'center' },
  playBadgeText: { color: '#fff', fontSize: 18, marginLeft: 3 },
  meta: { padding: 14 },
  videoTitle: { fontSize: 15, fontWeight: '700', color: colors.text },
  videoSub: { fontSize: 12, color: colors.textMuted, marginTop: 3 },
})
