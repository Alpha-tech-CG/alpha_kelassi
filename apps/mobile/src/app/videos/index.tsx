import { useEffect, useState } from 'react'
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Image, Linking } from 'react-native'
import { useRouter } from 'expo-router'
import { supabase } from '../../lib/supabase'

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

const API_URL = process.env['EXPO_PUBLIC_API_URL'] ?? 'http://localhost:3001'

export default function VideosScreen() {
  const router = useRouter()
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession()
      const res = await fetch(`${API_URL}/api/videos`, { headers: { Authorization: `Bearer ${session?.access_token}` } })
      const json = await res.json()
      setVideos(json.data ?? [])
      setLoading(false)
    }
    load()
  }, [])

  // Ouvre dans l'app YouTube / le navigateur : lecteur natif, adaptation au débit, offline géré par YouTube
  function watch(v: Video) {
    Linking.openURL(v.url).catch(() => null)
  }

  if (loading) return <ActivityIndicator style={{ flex: 1 }} color="#E53935" />

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Text style={styles.back}>←</Text></TouchableOpacity>
        <Text style={styles.title}>Cours vidéo</Text>
        <View style={{ width: 20 }} />
      </View>

      {videos.length === 0 ? (
        <Text style={styles.empty}>Aucune vidéo disponible pour le moment.</Text>
      ) : (
        videos.map((v) => (
          <TouchableOpacity key={v.id} style={styles.card} onPress={() => watch(v)}>
            <View style={styles.thumbWrap}>
              {v.thumbnail_url
                ? <Image source={{ uri: v.thumbnail_url }} style={styles.thumb} />
                : <View style={[styles.thumb, styles.thumbEmpty]}><Text style={styles.playIcon}>▶</Text></View>}
              <View style={styles.playBadge}><Text style={styles.playBadgeText}>▶</Text></View>
            </View>
            <View style={styles.meta}>
              <Text style={styles.videoTitle} numberOfLines={2}>{v.title} {v.is_premium ? '⭐' : ''}</Text>
              <Text style={styles.videoSub}>
                {v.subjects?.name ? `${v.subjects.name} · ` : ''}{v.level.replace('_', ' ').toUpperCase()}
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
  container: { flex: 1, backgroundColor: '#F7FAF8' },
  content: { padding: 20, paddingTop: 60 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  back: { fontSize: 22, color: '#6D7A72' },
  title: { fontSize: 18, fontWeight: '700', color: '#1F2A24' },
  empty: { textAlign: 'center', color: '#6D7A72', marginTop: 40 },
  card: { backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden', marginBottom: 14, borderWidth: 1, borderColor: '#EEF8F4' },
  thumbWrap: { position: 'relative', width: '100%', aspectRatio: 16 / 9, backgroundColor: '#DDE8E1' },
  thumb: { width: '100%', height: '100%' },
  thumbEmpty: { alignItems: 'center', justifyContent: 'center' },
  playIcon: { fontSize: 32, color: '#6D7A72' },
  playBadge: { position: 'absolute', top: '50%', left: '50%', marginLeft: -22, marginTop: -22, width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(220,38,38,0.9)', alignItems: 'center', justifyContent: 'center' },
  playBadgeText: { color: '#fff', fontSize: 16, marginLeft: 3 },
  meta: { padding: 12 },
  videoTitle: { fontSize: 14, fontWeight: '600', color: '#1F2A24' },
  videoSub: { fontSize: 12, color: '#6D7A72', marginTop: 3 },
})
