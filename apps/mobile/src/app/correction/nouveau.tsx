import { useEffect, useState } from 'react'
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Image } from 'react-native'
import { useRouter } from 'expo-router'
import { supabase } from '../../lib/supabase'
import { API_URL } from '../../lib/config'
import { colors, radius, cardShadow, fonts, subjectIcon } from '../../lib/theme'
import { pickAndUpload } from '../../lib/uploads'

interface Subject { id: string; name: string }
type Slot = { path: string; uri: string } | null

async function token() {
  const { data: { session } } = await supabase.auth.getSession()
  return session?.access_token
}

export default function NouvelleCorrection() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [isPremium, setIsPremium] = useState(true)
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [subjectId, setSubjectId] = useState<string | null>(null)
  const [exercise, setExercise] = useState<Slot>(null)   // énoncé
  const [work, setWork] = useState<Slot>(null)           // travail manuscrit
  const [busy, setBusy] = useState<'exercise' | 'work' | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }
      const { data: profile } = await supabase.from('users').select('plan, study_level_pref, track_type').eq('id', user.id).single()
      const p = profile as { plan?: string; study_level_pref?: string; track_type?: string } | null
      setIsPremium(p?.plan === 'premium')
      let q = supabase.from('subjects').select('id, name').order('name')
      if (p?.study_level_pref) q = q.eq('level', p.study_level_pref)
      if (p?.track_type) q = q.eq('track_type', p.track_type)
      const { data: subs } = await q
      setSubjects((subs ?? []) as Subject[])
      setLoading(false)
    })()
  }, [])

  async function pick(which: 'exercise' | 'work') {
    Alert.alert('Ajouter une photo', which === 'exercise' ? 'Photo de l’énoncé' : 'Photo de ton travail', [
      { text: 'Prendre une photo', onPress: () => run(which, 'camera') },
      { text: 'Depuis la galerie', onPress: () => run(which, 'library') },
      { text: 'Annuler', style: 'cancel' },
    ])
  }

  async function run(which: 'exercise' | 'work', source: 'camera' | 'library') {
    setBusy(which)
    try {
      const bucket = which === 'exercise' ? 'exercise-photos' : 'student-work'
      const r = await pickAndUpload(bucket, source)
      if (r) (which === 'exercise' ? setExercise : setWork)(r)
    } catch (e: any) {
      Alert.alert('Oups', e?.message ?? 'Impossible d’ajouter la photo.')
    } finally {
      setBusy(null)
    }
  }

  async function submit() {
    if (!subjectId || !exercise || !work || submitting) return
    setSubmitting(true)
    const t = await token()
    const res = await fetch(`${API_URL}/api/corrections`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${t}` },
      body: JSON.stringify({ subject_id: subjectId, exercise_url: exercise.path, work_url: work.path }),
    })
    const json = await res.json().catch(() => ({}))
    setSubmitting(false)
    if (!res.ok) {
      if (json.error?.code === 'PREMIUM_REQUIRED') {
        Alert.alert('Réservé au Premium', 'La correction par un tuteur humain fait partie de l’offre Premium.')
      } else {
        Alert.alert('Erreur', json.error?.message ?? 'Envoi impossible.')
      }
      return
    }
    router.replace(`/correction/${json.data.id}`)
  }

  if (loading) return <ActivityIndicator style={{ flex: 1, backgroundColor: colors.background }} color={colors.primary} />

  const ready = subjectId && exercise && work

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Text style={styles.back}>←</Text></TouchableOpacity>
        <Text style={styles.title}>Faire corriger</Text>
        <View style={{ width: 20 }} />
      </View>

      {!isPremium && (
        <TouchableOpacity style={styles.premiumBanner} onPress={() => router.push('/abonnement' as any)} activeOpacity={0.85}>
          <Text style={styles.premiumText}>⭐ La correction par un tuteur est une fonctionnalité Premium. Appuie pour t’abonner →</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.label}>1 · Matière</Text>
      <View style={styles.chips}>
        {subjects.map((s) => {
          const on = subjectId === s.id
          return (
            <TouchableOpacity key={s.id} style={[styles.chip, on && styles.chipOn]} onPress={() => setSubjectId(s.id)}>
              <Text style={[styles.chipText, on && styles.chipTextOn]}>{subjectIcon(s.name)} {s.name}</Text>
            </TouchableOpacity>
          )
        })}
        {subjects.length === 0 && <Text style={styles.hint}>Choisis d’abord ton parcours dans ton profil.</Text>}
      </View>

      <Text style={styles.label}>2 · Photo de l’énoncé</Text>
      <PhotoSlot slot={exercise} busy={busy === 'exercise'} onPress={() => pick('exercise')} placeholder="Ajouter l’énoncé" />

      <Text style={styles.label}>3 · Photo de ton travail</Text>
      <PhotoSlot slot={work} busy={busy === 'work'} onPress={() => pick('work')} placeholder="Ajouter ton travail manuscrit" />

      <TouchableOpacity style={[styles.submit, (!ready || submitting) && { opacity: 0.5 }]} onPress={submit} disabled={!ready || submitting}>
        <Text style={styles.submitText}>{submitting ? 'Envoi…' : 'Envoyer à un tuteur'}</Text>
      </TouchableOpacity>
      <Text style={styles.footHint}>Un tuteur qualifié corrige ton exercice à la main, vérifié par l’IA. Délai moyen : 1h30.</Text>
    </ScrollView>
  )
}

function PhotoSlot({ slot, busy, onPress, placeholder }: { slot: Slot; busy: boolean; onPress: () => void; placeholder: string }) {
  return (
    <TouchableOpacity style={styles.slot} onPress={onPress} disabled={busy} activeOpacity={0.85}>
      {busy ? (
        <ActivityIndicator color={colors.primary} />
      ) : slot ? (
        <>
          <Image source={{ uri: slot.uri }} style={styles.preview} resizeMode="cover" />
          <Text style={styles.slotChange}>Changer</Text>
        </>
      ) : (
        <>
          <Text style={styles.slotIcon}>📷</Text>
          <Text style={styles.slotText}>{placeholder}</Text>
        </>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingTop: 56, paddingBottom: 60 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 },
  back: { fontSize: 24, color: colors.text },
  title: { fontSize: 20, fontFamily: fonts.headingBlack, color: colors.text },
  premiumBanner: { backgroundColor: '#FFF3E0', borderRadius: radius.md, padding: 12, marginBottom: 16 },
  premiumText: { color: '#C77700', fontSize: 12, fontWeight: '700' },
  label: { fontSize: 14, fontWeight: '800', color: colors.text, marginTop: 18, marginBottom: 10 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: radius.full, borderWidth: 1, borderColor: colors.cardBorder, backgroundColor: colors.card },
  chipOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: 13, color: colors.textMuted, fontWeight: '700' },
  chipTextOn: { color: '#fff' },
  hint: { fontSize: 13, color: colors.textMuted },
  slot: { backgroundColor: colors.card, borderRadius: radius.lg, borderWidth: 1.5, borderColor: colors.cardBorder, borderStyle: 'dashed', minHeight: 120, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  slotIcon: { fontSize: 32, marginBottom: 6 },
  slotText: { fontSize: 13, color: colors.textMuted, fontWeight: '700' },
  preview: { width: '100%', height: 180 },
  slotChange: { position: 'absolute', bottom: 8, right: 10, backgroundColor: '#000000aa', color: '#fff', fontSize: 11, fontWeight: '700', paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.full, overflow: 'hidden' },
  submit: { backgroundColor: colors.primary, borderRadius: radius.lg, paddingVertical: 16, alignItems: 'center', marginTop: 28, ...cardShadow },
  submitText: { color: '#fff', fontSize: 15, fontWeight: '800' },
  footHint: { fontSize: 11, color: colors.textMuted, textAlign: 'center', marginTop: 14, lineHeight: 16, paddingHorizontal: 10 },
})
