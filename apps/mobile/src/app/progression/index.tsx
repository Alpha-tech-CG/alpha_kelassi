import { useEffect, useState, useCallback } from 'react'
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, ImageBackground } from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { supabase } from '../../lib/supabase'
import { API_URL } from '../../lib/config'
import { colors, radius, cardShadow, fonts } from '../../lib/theme'
import { subjectArtwork } from '../../lib/subjectArtwork'
import { BackButton } from '../../components/BackButton'
import { ImageTile } from '../../components/ImageTile'
import { FadeIn } from '../../components/FadeIn'

interface ProgChapter {
  id: string
  title: string
  domain_name: string
  month_label: string | null
  total_lessons: number
  completed_lessons: number
  is_completed: boolean
  is_unlocked: boolean
}

async function token() {
  const { data: { session } } = await supabase.auth.getSession()
  return session?.access_token
}

/**
 * Parcours d'une matière du primaire / collège : chapitres dans l'ordre, débloqués
 * au fil de l'année. On arrive ici depuis « Mes matières » ; la matière est fixée
 * (plus de barre de matières en haut : on revient en arrière pour en changer).
 */
export default function ProgressionScreen() {
  const router = useRouter()
  const { subject: subjectId } = useLocalSearchParams<{ subject?: string; level?: string }>()
  const [name, setName] = useState('Matière')
  const [chapters, setChapters] = useState<ProgChapter[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    if (!subjectId) { setLoading(false); return }
    const [{ data: subj }, t] = await Promise.all([
      supabase.from('subjects').select('name').eq('id', subjectId).maybeSingle(),
      token(),
    ])
    setName((subj as { name?: string } | null)?.name ?? 'Matière')
    const res = await fetch(`${API_URL}/api/curriculum/progression?subject=${subjectId}`, { headers: { Authorization: `Bearer ${t}` } })
    const json = await res.json().catch(() => ({}))
    setChapters(json?.data?.chapters ?? [])
    setLoading(false)
  }, [subjectId])

  useEffect(() => { load() }, [load])

  if (loading) return <ActivityIndicator style={{ flex: 1, backgroundColor: colors.background }} color={colors.primary} />

  const nextIndex = chapters.findIndex((c) => c.is_unlocked && !c.is_completed)
  const total = chapters.reduce((a, c) => a + c.total_lessons, 0)
  const done = chapters.reduce((a, c) => a + c.completed_lessons, 0)
  const overall = total ? Math.round((done / total) * 100) : 0
  const art = subjectArtwork(name)

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BackButton label="Matières" />
      </View>

      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        <ImageBackground source={art} style={styles.hero} imageStyle={styles.heroImg}>
          <View style={styles.heroShade} />
          <Text style={styles.heroKicker}>PROGRESSION</Text>
          <Text style={styles.heroTitle} numberOfLines={2}>{name}</Text>
          <View style={styles.heroRow}>
            <View style={styles.heroTrack}><View style={[styles.heroFill, { width: `${overall}%` }]} /></View>
            <Text style={styles.heroPct}>{overall}%</Text>
          </View>
          <Text style={styles.heroSub}>{done} leçon{done > 1 ? 's' : ''} terminée{done > 1 ? 's' : ''} sur {total}</Text>
        </ImageBackground>

        <Text style={styles.sectionTitle}>Chapitres</Text>
        {chapters.map((c, i) => {
          const isNext = i === nextIndex
          const pct = c.total_lessons ? Math.round((c.completed_lessons / c.total_lessons) * 100) : 0
          return (
            <FadeIn key={c.id} delay={120 + Math.min(i, 10) * 55}>
            <TouchableOpacity
              style={[styles.card, !c.is_unlocked && styles.cardLocked, isNext && styles.cardNext]}
              activeOpacity={c.is_unlocked ? 0.85 : 1}
              disabled={!c.is_unlocked}
              onPress={() => router.push(`/chapitre/${c.id}` as any)}
            >
              <ImageTile source={art} label={String(i + 1)} pct={pct} done={c.is_completed} locked={!c.is_unlocked} size={52} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.cardTitle, !c.is_unlocked && styles.textLocked]} numberOfLines={2}>{c.title}</Text>
                <Text style={styles.cardSub} numberOfLines={1}>
                  {!c.is_unlocked ? 'Bientôt débloqué' : c.domain_name}{c.month_label ? ` · ${c.month_label}` : ''}
                </Text>
              </View>
              {isNext ? <View style={styles.nextPill}><Text style={styles.nextText}>À suivre</Text></View> : null}
            </TouchableOpacity>
            </FadeIn>
          )
        })}
        {chapters.length === 0 && <Text style={styles.empty}>Aucun chapitre pour cette matière.</Text>}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: 16, paddingTop: 52, paddingBottom: 10 },
  list: { paddingHorizontal: 16, paddingBottom: 40 },
  hero: { borderRadius: 26, padding: 20, overflow: 'hidden', marginBottom: 22, ...cardShadow },
  heroImg: { borderRadius: 26 },
  heroShade: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(20,92,192,0.82)' },
  heroKicker: { color: '#ffffffcc', fontSize: 10, fontFamily: fonts.body, letterSpacing: 1.2 },
  heroTitle: { color: '#fff', fontSize: 24, fontFamily: fonts.headingBlack, marginTop: 4, marginBottom: 14 },
  heroRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  heroTrack: { flex: 1, height: 10, backgroundColor: '#ffffff33', borderRadius: radius.full, padding: 2, overflow: 'hidden' },
  heroFill: { height: '100%', backgroundColor: colors.yellow, borderRadius: radius.full },
  heroPct: { color: colors.yellow, fontSize: 15, fontFamily: fonts.headingBlack },
  heroSub: { color: '#ffffffe6', fontSize: 12, marginTop: 8 },
  sectionTitle: { fontSize: 18, fontFamily: fonts.headingBlack, color: colors.text, marginBottom: 12 },
  card: {
    flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.card, borderRadius: 20,
    padding: 12, marginBottom: 12, borderWidth: 1, borderColor: colors.cardBorder, ...cardShadow,
  },
  cardLocked: { backgroundColor: '#F1F4F9', borderColor: '#E3E9F2', shadowOpacity: 0, elevation: 0 },
  cardNext: { borderColor: colors.primary, borderWidth: 2 },
  cardTitle: { fontSize: 14, fontFamily: fonts.body, color: colors.text },
  cardSub: { fontSize: 11, color: colors.textMuted, marginTop: 3 },
  textLocked: { color: colors.textMuted },
  nextPill: { backgroundColor: colors.primary, paddingHorizontal: 9, paddingVertical: 4, borderRadius: 999 },
  nextText: { color: '#fff', fontSize: 10, fontFamily: fonts.body },
  empty: { textAlign: 'center', color: colors.textMuted, paddingTop: 40 },
})
