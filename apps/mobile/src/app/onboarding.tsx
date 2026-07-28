import { useState, useRef } from 'react'
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet,
  Animated, ActivityIndicator, Alert,
} from 'react-native'
import { useRouter } from 'expo-router'
import { supabase } from '../lib/supabase'
import { API_URL } from '../lib/config'

type Track = 'generale' | 'technique'
interface Series { id: string; code: string; label: string; level: string }

const TRACKS: { value: Track; emoji: string; title: string; desc: string }[] = [
  { value: 'generale',  emoji: '🎓', title: 'Enseignement général',   desc: 'CEPE, BEPC, BAC A / C / D' },
  { value: 'technique', emoji: '🔧', title: 'Enseignement technique', desc: 'Séries G1, G2, F3…' },
]
const LEVEL_ORDER: Record<string, number> = { cepe: 0, bepc: 1, bac_a: 2, bac_c: 3, bac_d: 4 }

const KELASSI_TIPS = [
  { icon: '🎯', title: 'Sois précis', desc: 'Indique la matière et le sujet. Ex : "Explique la dérivée en Maths BAC C"' },
  { icon: '🔍', title: 'Demande des exemples', desc: '"Donne-moi un exemple avec des chiffres" → Kelassi s\'adapte à ton niveau.' },
  { icon: '🔄', title: 'Reformule si besoin', desc: '"Je n\'ai pas compris, explique autrement" → Kelassi essaie une autre approche.' },
]

export default function OnboardingScreen() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [track, setTrack] = useState<Track | null>(null)
  const [seriesList, setSeriesList] = useState<Series[]>([])
  const [level, setLevel] = useState<string | null>(null)
  const [subjects, setSubjects] = useState<{ id: string; name: string }[]>([])
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [stepLoading, setStepLoading] = useState(false)
  const slideAnim = useRef(new Animated.Value(0)).current

  function goStep(n: number) {
    Animated.timing(slideAnim, { toValue: 1, duration: 200, useNativeDriver: true }).start(() => {
      slideAnim.setValue(0)
      setStep(n)
    })
  }

  async function handleTrackSelect(t: Track) {
    setTrack(t); setStepLoading(true)
    const { data } = await supabase.from('series').select('id, code, label, level').eq('track', t)
    const rows = (data ?? []) as Series[]
    rows.sort((a, b) => (LEVEL_ORDER[a.level] ?? 99) - (LEVEL_ORDER[b.level] ?? 99) || a.code.localeCompare(b.code))
    setSeriesList(rows); setStepLoading(false); goStep(1)
  }

  async function handleParcoursSelect(s: Series) {
    setLevel(s.level); setStepLoading(true)
    const { data } = await supabase.from('subjects').select('id, name')
      .eq('level', s.level).eq('track_type', track!).order('name')
    setSubjects(data ?? []); setSelectedSubjects([]); setStepLoading(false); goStep(2)
  }

  function toggleSubject(id: string) {
    setSelectedSubjects((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])
  }

  async function handleComplete() {
    if (!track || !level) return
    setLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('Non connecté')
      const res = await fetch(`${API_URL}/api/onboarding/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ track_type: track, level, subject_ids: selectedSubjects }),
      })
      const json = await res.json()
      if (json.data?.suggested_document) {
        await fetch(`${API_URL}/api/flashcards/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
          body: JSON.stringify({ document_id: json.data.suggested_document.id, count: 3 }),
        })
      }
      router.replace('/(tabs)/')
    } catch {
      Alert.alert('Erreur', 'Impossible de sauvegarder. Réessaie.')
    } finally {
      setLoading(false)
    }
  }

  const translateX = slideAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -20] })

  return (
    <View style={styles.container}>
      <View style={styles.dots}>
        {[0, 1, 2, 3, 4].map((i) => (
          <View key={i} style={[styles.dot, step === i && styles.dotActive]} />
        ))}
      </View>

      <Animated.View style={[styles.content, { opacity: slideAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }), transform: [{ translateX }] }]}>

        {/* Étape 0 — Filière */}
        {step === 0 && (
          <View style={styles.step}>
            <Text style={styles.emoji}>👋</Text>
            <Text style={styles.title}>Bienvenue sur Kelassi !</Text>
            <Text style={styles.subtitle}>Quel type d'enseignement suis-tu ?</Text>
            <View style={{ gap: 12 }}>
              {TRACKS.map((t) => (
                <TouchableOpacity key={t.value} style={styles.trackCard} onPress={() => handleTrackSelect(t.value)} disabled={stepLoading}>
                  <Text style={styles.trackEmoji}>{t.emoji}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.trackTitle}>{t.title}</Text>
                    <Text style={styles.trackDesc}>{t.desc}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Étape 1 — Parcours */}
        {step === 1 && (
          <View style={styles.step}>
            <TouchableOpacity onPress={() => goStep(0)}><Text style={styles.backLink}>← Changer de filière</Text></TouchableOpacity>
            <Text style={styles.emoji}>🧭</Text>
            <Text style={styles.title}>Ton parcours</Text>
            <Text style={styles.subtitle}>Sélectionne ton examen / ta série.</Text>
            {stepLoading ? <ActivityIndicator color="#0F8F4F" style={{ marginTop: 24 }} /> : seriesList.length === 0 ? (
              <Text style={styles.emptyText}>Aucun parcours pour cette filière pour l'instant.</Text>
            ) : (
              <View style={styles.parcoursGrid}>
                {seriesList.map((s) => (
                  <TouchableOpacity key={s.id} style={styles.parcoursCard} onPress={() => handleParcoursSelect(s)}>
                    <Text style={styles.parcoursCode}>{s.code}</Text>
                    <Text style={styles.parcoursLabel} numberOfLines={2}>{s.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Étape 2 — Matières */}
        {step === 2 && (
          <View style={styles.step}>
            <TouchableOpacity onPress={() => goStep(1)}><Text style={styles.backLink}>← Changer de parcours</Text></TouchableOpacity>
            <Text style={styles.emoji}>📚</Text>
            <Text style={styles.title}>Tes matières principales</Text>
            <Text style={styles.subtitle}>Sélectionne celles à réviser (optionnel).</Text>
            {subjects.length === 0 ? (
              <Text style={styles.emptyText}>Les matières de ce parcours arrivent bientôt. Tu peux continuer.</Text>
            ) : (
              <ScrollView style={styles.subjectList} showsVerticalScrollIndicator={false}>
                <View style={styles.subjectChips}>
                  {subjects.map((s) => {
                    const sel = selectedSubjects.includes(s.id)
                    return (
                      <TouchableOpacity key={s.id} style={[styles.chip, sel && styles.chipActive]} onPress={() => toggleSubject(s.id)}>
                        <Text style={[styles.chipText, sel && styles.chipTextActive]}>{s.name}</Text>
                      </TouchableOpacity>
                    )
                  })}
                </View>
              </ScrollView>
            )}
            <TouchableOpacity style={styles.btn} onPress={() => goStep(3)}>
              <Text style={styles.btnText}>Continuer{selectedSubjects.length > 0 ? ` (${selectedSubjects.length})` : ''}</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Étape 3 — Tutoriel */}
        {step === 3 && (
          <View style={styles.step}>
            <Text style={styles.emoji}>🤖</Text>
            <Text style={styles.title}>Comment utiliser Kelassi ?</Text>
            <View style={styles.tips}>
              {KELASSI_TIPS.map((t) => (
                <View key={t.title} style={styles.tip}>
                  <Text style={styles.tipIcon}>{t.icon}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.tipTitle}>{t.title}</Text>
                    <Text style={styles.tipDesc}>{t.desc}</Text>
                  </View>
                </View>
              ))}
            </View>
            <TouchableOpacity style={styles.btn} onPress={() => goStep(4)}>
              <Text style={styles.btnText}>J'ai compris !</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Étape 4 — Lancement */}
        {step === 4 && (
          <View style={styles.step}>
            <Text style={styles.emoji}>🚀</Text>
            <Text style={styles.title}>Tout est prêt !</Text>
            <Text style={styles.subtitle}>Ton espace est configuré pour ton parcours. Bonne révision avec Kelassi !</Text>
            <View style={styles.featureList}>
              {['Contenu adapté à ta filière et ton parcours', 'Répétition espacée SM-2', '+ 2 XP par flashcard réussie'].map((f) => (
                <View key={f} style={styles.featureRow}>
                  <Text style={styles.featureCheck}>✅</Text>
                  <Text style={styles.featureText}>{f}</Text>
                </View>
              ))}
            </View>
            <TouchableOpacity style={[styles.btn, loading && styles.btnDisabled]} onPress={handleComplete} disabled={loading}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>C'est parti ! 🚀</Text>}
            </TouchableOpacity>
          </View>
        )}
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: '#F7FAF8', paddingTop: 60 },
  dots:         { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 32 },
  dot:          { width: 8, height: 8, borderRadius: 4, backgroundColor: '#E3EADF' },
  dotActive:    { backgroundColor: '#0F8F4F', width: 24 },
  content:      { flex: 1, paddingHorizontal: 24 },
  step:         { flex: 1 },
  backLink:     { color: '#3E4A3E', fontSize: 13, marginBottom: 8 },
  emoji:        { fontSize: 48, textAlign: 'center', marginBottom: 16 },
  title:        { fontSize: 24, fontWeight: '700', color: '#171D17', textAlign: 'center', marginBottom: 8 },
  subtitle:     { fontSize: 15, color: '#3E4A3E', textAlign: 'center', marginBottom: 24, lineHeight: 22 },
  emptyText:    { fontSize: 14, color: '#3E4A3E', textAlign: 'center', paddingVertical: 24 },
  trackCard:    { flexDirection: 'row', alignItems: 'center', gap: 14, borderWidth: 2, borderColor: '#0F8F4F', borderRadius: 16, padding: 18, backgroundColor: '#fff' },
  trackEmoji:   { fontSize: 32 },
  trackTitle:   { fontSize: 17, fontWeight: '700', color: '#171D17' },
  trackDesc:    { fontSize: 12, color: '#3E4A3E', marginTop: 2 },
  parcoursGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'center' },
  parcoursCard: { width: '44%', borderWidth: 2, borderColor: '#E3EADF', borderRadius: 14, padding: 14, alignItems: 'center', backgroundColor: '#fff' },
  parcoursCode: { fontSize: 20, fontWeight: '800', color: '#0F8F4F' },
  parcoursLabel:{ fontSize: 11, color: '#3E4A3E', textAlign: 'center', marginTop: 4 },
  subjectList:  { flex: 1, marginBottom: 16 },
  subjectChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip:         { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1.5, borderColor: '#E3EADF', backgroundColor: '#fff' },
  chipActive:   { backgroundColor: '#0F8F4F', borderColor: '#0F8F4F' },
  chipText:     { fontSize: 13, fontWeight: '500', color: '#171D17' },
  chipTextActive: { color: '#fff' },
  tips:         { gap: 16, marginBottom: 32 },
  tip:          { flexDirection: 'row', gap: 12, backgroundColor: '#fff', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#EFF6EB' },
  tipIcon:      { fontSize: 24 },
  tipTitle:     { fontSize: 14, fontWeight: '600', color: '#171D17', marginBottom: 2 },
  tipDesc:      { fontSize: 12, color: '#3E4A3E', lineHeight: 18 },
  featureList:  { gap: 12, marginBottom: 40 },
  featureRow:   { flexDirection: 'row', alignItems: 'center', gap: 10 },
  featureCheck: { fontSize: 16 },
  featureText:  { fontSize: 14, color: '#171D17' },
  btn:          { backgroundColor: '#0F8F4F', borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginTop: 'auto' as any, marginBottom: 32 },
  btnDisabled:  { opacity: 0.5 },
  btnText:      { color: '#fff', fontSize: 16, fontWeight: '700' },
})
