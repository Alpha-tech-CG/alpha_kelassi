import { useState, useRef } from 'react'
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet,
  Animated, ActivityIndicator, Alert,
} from 'react-native'
import { useRouter } from 'expo-router'
import { supabase } from '../lib/supabase'

const API_URL = process.env['EXPO_PUBLIC_API_URL'] ?? 'http://localhost:3001'

const LEVELS = [
  { value: 'bepc',  label: 'BEPC',  sub: '3ème', color: '#0F8F4F' },
  { value: 'bac_c', label: 'BAC C', sub: 'Maths-Sciences', color: '#0B6B3A' },
  { value: 'bac_d', label: 'BAC D', sub: 'Sciences Naturelles', color: '#0B6B3A' },
  { value: 'bac_a', label: 'BAC A', sub: 'Lettres & Philo', color: '#0B6B3A' },
]

const KELASSI_TIPS = [
  { icon: '🎯', title: 'Sois précis', desc: 'Indique la matière et le sujet. Ex : "Explique la dérivée en Maths BAC C"' },
  { icon: '🔍', title: 'Demande des exemples', desc: '"Donne-moi un exemple avec des chiffres" → Kelassi s\'adapte à ton niveau.' },
  { icon: '🔄', title: 'Reformule si besoin', desc: '"Je n\'ai pas compris, explique autrement" → Kelassi essaie une autre approche.' },
]

export default function OnboardingScreen() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [level, setLevel] = useState<string | null>(null)
  const [subjects, setSubjects] = useState<{ id: string; name: string }[]>([])
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [subjectsLoading, setSubjectsLoading] = useState(false)
  const slideAnim = useRef(new Animated.Value(0)).current

  async function loadSubjects(lvl: string) {
    setSubjectsLoading(true)
    const { data } = await supabase.from('subjects').select('id, name').eq('level', lvl).order('name')
    setSubjects(data ?? [])
    setSubjectsLoading(false)
  }

  function goNext() {
    Animated.timing(slideAnim, { toValue: 1, duration: 250, useNativeDriver: true }).start(() => {
      slideAnim.setValue(0)
      setStep((s) => s + 1)
    })
  }

  async function handleLevelSelect(lvl: string) {
    setLevel(lvl)
    await loadSubjects(lvl)
    goNext()
  }

  function toggleSubject(id: string) {
    setSelectedSubjects((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  async function handleComplete() {
    if (!level || selectedSubjects.length === 0) return
    setLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('Non connecté')

      const res = await fetch(`${API_URL}/api/onboarding/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ level, subject_ids: selectedSubjects }),
      })
      const json = await res.json()

      // Si un document suggéré existe, génère la première flashcard
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
      {/* Progress dots */}
      <View style={styles.dots}>
        {[0, 1, 2, 3].map((i) => (
          <View key={i} style={[styles.dot, step === i && styles.dotActive]} />
        ))}
      </View>

      <Animated.View style={[styles.content, { opacity: slideAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }), transform: [{ translateX }] }]}>

        {/* Étape 0 — Bienvenue + niveau */}
        {step === 0 && (
          <View style={styles.step}>
            <Text style={styles.emoji}>👋</Text>
            <Text style={styles.title}>Bienvenue sur Kelassi !</Text>
            <Text style={styles.subtitle}>Quel est ton niveau scolaire ?</Text>
            <View style={styles.levelGrid}>
              {LEVELS.map((l) => (
                <TouchableOpacity
                  key={l.value}
                  style={[styles.levelCard, { borderColor: l.color }]}
                  onPress={() => handleLevelSelect(l.value)}
                >
                  <Text style={[styles.levelLabel, { color: l.color }]}>{l.label}</Text>
                  <Text style={styles.levelSub}>{l.sub}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Étape 1 — Matières */}
        {step === 1 && (
          <View style={styles.step}>
            <Text style={styles.emoji}>📚</Text>
            <Text style={styles.title}>Tes matières principales</Text>
            <Text style={styles.subtitle}>Sélectionne celles que tu veux réviser en priorité</Text>
            {subjectsLoading ? (
              <ActivityIndicator color="#0F8F4F" style={{ marginTop: 24 }} />
            ) : (
              <ScrollView style={styles.subjectList} showsVerticalScrollIndicator={false}>
                <View style={styles.subjectChips}>
                  {subjects.map((s) => {
                    const sel = selectedSubjects.includes(s.id)
                    return (
                      <TouchableOpacity
                        key={s.id}
                        style={[styles.chip, sel && styles.chipActive]}
                        onPress={() => toggleSubject(s.id)}
                      >
                        <Text style={[styles.chipText, sel && styles.chipTextActive]}>{s.name}</Text>
                      </TouchableOpacity>
                    )
                  })}
                </View>
              </ScrollView>
            )}
            <TouchableOpacity
              style={[styles.btn, selectedSubjects.length === 0 && styles.btnDisabled]}
              onPress={goNext}
              disabled={selectedSubjects.length === 0}
            >
              <Text style={styles.btnText}>Continuer ({selectedSubjects.length} choisie{selectedSubjects.length > 1 ? 's' : ''})</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Étape 2 — Tutoriel Kelassi */}
        {step === 2 && (
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
            <TouchableOpacity style={styles.btn} onPress={goNext}>
              <Text style={styles.btnText}>J'ai compris !</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Étape 3 — Première flashcard */}
        {step === 3 && (
          <View style={styles.step}>
            <Text style={styles.emoji}>🃏</Text>
            <Text style={styles.title}>Ta première flashcard t'attend !</Text>
            <Text style={styles.subtitle}>
              Kelassi va générer 3 flashcards depuis un de tes cours. Révise-les pour commencer à accumuler des XP !
            </Text>
            <View style={styles.featureList}>
              {['Algorithme de répétition espacée SM-2', 'Adapté à ton niveau et tes matières', '+ 2 XP par flashcard réussie'].map((f) => (
                <View key={f} style={styles.featureRow}>
                  <Text style={styles.featureCheck}>✅</Text>
                  <Text style={styles.featureText}>{f}</Text>
                </View>
              ))}
            </View>
            <TouchableOpacity
              style={[styles.btn, loading && styles.btnDisabled]}
              onPress={handleComplete}
              disabled={loading}
            >
              {loading
                ? <ActivityIndicator color="#fff" />
                : <Text style={styles.btnText}>C'est parti ! 🚀</Text>
              }
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
  dot:          { width: 8, height: 8, borderRadius: 4, backgroundColor: '#DDE8E1' },
  dotActive:    { backgroundColor: '#0F8F4F', width: 24 },
  content:      { flex: 1, paddingHorizontal: 24 },
  step:         { flex: 1 },
  emoji:        { fontSize: 48, textAlign: 'center', marginBottom: 16 },
  title:        { fontSize: 24, fontWeight: '700', color: '#1F2A24', textAlign: 'center', marginBottom: 8 },
  subtitle:     { fontSize: 15, color: '#6D7A72', textAlign: 'center', marginBottom: 24, lineHeight: 22 },
  levelGrid:    { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'center' },
  levelCard:    { width: '44%', borderWidth: 2, borderRadius: 16, padding: 16, alignItems: 'center', backgroundColor: '#fff' },
  levelLabel:   { fontSize: 20, fontWeight: '700', marginBottom: 4 },
  levelSub:     { fontSize: 12, color: '#6D7A72', textAlign: 'center' },
  subjectList:  { flex: 1, marginBottom: 16 },
  subjectChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip:         { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1.5, borderColor: '#DDE8E1', backgroundColor: '#fff' },
  chipActive:   { backgroundColor: '#0F8F4F', borderColor: '#0F8F4F' },
  chipText:     { fontSize: 13, fontWeight: '500', color: '#1F2A24' },
  chipTextActive: { color: '#fff' },
  tips:         { gap: 16, marginBottom: 32 },
  tip:          { flexDirection: 'row', gap: 12, backgroundColor: '#fff', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#EEF8F4' },
  tipIcon:      { fontSize: 24 },
  tipTitle:     { fontSize: 14, fontWeight: '600', color: '#1F2A24', marginBottom: 2 },
  tipDesc:      { fontSize: 12, color: '#6D7A72', lineHeight: 18 },
  featureList:  { gap: 12, marginBottom: 40 },
  featureRow:   { flexDirection: 'row', alignItems: 'center', gap: 10 },
  featureCheck: { fontSize: 16 },
  featureText:  { fontSize: 14, color: '#1F2A24' },
  btn:          { backgroundColor: '#0F8F4F', borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginTop: 'auto' as any, marginBottom: 32 },
  btnDisabled:  { opacity: 0.5 },
  btnText:      { color: '#fff', fontSize: 16, fontWeight: '700' },
})
