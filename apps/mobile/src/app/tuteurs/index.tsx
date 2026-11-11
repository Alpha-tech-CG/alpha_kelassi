import { useCallback, useState } from 'react'
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native'
import { useRouter, useFocusEffect } from 'expo-router'
import { supabase } from '../../lib/supabase'
import { API_URL } from '../../lib/config'
import { colors, radius, cardShadow, fonts } from '../../lib/theme'
import { BackButton } from '../../components/BackButton'
import { SolarIcon } from '../../icons/solar'

/**
 * Page « Tuteurs » côté élève : la correction par un tuteur humain vérifié.
 * Avant, le raccourci « Tuteur » de l'accueil ouvrait Cognix IA ; ici l'élève
 * comprend le service, demande une correction, suit ses demandes, et peut
 * passer à Cognix IA pour une question rapide ou devenir tuteur lui-même.
 */
const STEPS = [
  { title: 'Photographie ton exercice', desc: 'L’énoncé et ton travail, même inachevé.' },
  { title: 'Un tuteur vérifié le corrige', desc: 'Un enseignant ou un étudiant validé par l’équipe Cognix.' },
  { title: 'Tu reçois une correction détaillée', desc: 'Tu peux la noter, et la contester si besoin.' },
]

const IN_PROGRESS = new Set(['pending', 'assigned', 'submitted', 'disputed'])

export default function TuteursScreen() {
  const router = useRouter()
  const [inProgress, setInProgress] = useState<number | null>(null)
  const [total, setTotal] = useState<number | null>(null)

  useFocusEffect(
    useCallback(() => {
      let active = true
      ;(async () => {
        try {
          const { data: { session } } = await supabase.auth.getSession()
          const res = await fetch(`${API_URL}/api/corrections`, {
            headers: { Authorization: `Bearer ${session?.access_token ?? ''}` },
          })
          const json = await res.json().catch(() => ({}))
          const rows = (json.data ?? []) as { status: string }[]
          if (!active) return
          setTotal(rows.length)
          setInProgress(rows.filter((r) => IN_PROGRESS.has(r.status)).length)
        } catch {
          if (active) { setTotal(null); setInProgress(null) }
        }
      })()
      return () => { active = false }
    }, [])
  )

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BackButton />
      </View>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={{ flex: 1 }}>
            <Text style={styles.heroKicker}>TUTEURS</Text>
            <Text style={styles.heroTitle}>Un vrai tuteur corrige ton exercice</Text>
            <Text style={styles.heroSub}>Bloqué sur un devoir ? Envoie-le : un tuteur te répond avec une correction expliquée.</Text>
          </View>
          <Image source={require('../../../assets/cognix-tutor.png')} style={styles.heroImg} resizeMode="contain" />
        </View>

        <TouchableOpacity style={styles.primary} activeOpacity={0.88} onPress={() => router.push('/correction/nouveau' as any)}>
          <SolarIcon name="notebook" size={24} color="#fff" />
          <Text style={styles.primaryText}>Demander une correction</Text>
          <Text style={styles.primaryArrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} activeOpacity={0.88} onPress={() => router.push('/correction' as any)}>
          <View style={styles.cardIcon}><SolarIcon name="document" size={24} color={colors.primary} /></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>Mes demandes</Text>
            <Text style={styles.cardSub}>
              {total === null
                ? 'Suis l’avancement de tes corrections'
                : total === 0
                  ? 'Aucune demande pour l’instant'
                  : `${total} demande${total > 1 ? 's' : ''}${inProgress ? ` · ${inProgress} en cours` : ''}`}
            </Text>
          </View>
          {inProgress ? <View style={styles.count}><Text style={styles.countText}>{inProgress}</Text></View> : null}
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Comment ça marche</Text>
        <View style={styles.steps}>
          {STEPS.map((st, i) => (
            <View key={st.title} style={styles.step}>
              <View style={styles.stepNum}><Text style={styles.stepNumText}>{i + 1}</Text></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.stepTitle}>{st.title}</Text>
                <Text style={styles.stepDesc}>{st.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Autres façons d’avancer</Text>
        <TouchableOpacity style={styles.card} activeOpacity={0.88} onPress={() => router.push('/(tabs)/tuteur' as any)}>
          <Image source={require('../../../assets/cognix-tutor-avatar.png')} style={styles.avatar} />
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>Une question rapide ?</Text>
            <Text style={styles.cardSub}>Cognix IA t’explique tout de suite, 24h/24</Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card} activeOpacity={0.88} onPress={() => router.push('/tuteur-espace' as any)}>
          <View style={styles.cardIcon}><SolarIcon name="star" size={24} color={colors.primary} /></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>Deviens tuteur</Text>
            <Text style={styles.cardSub}>Corrige des exercices et gagne 250 FCFA par correction</Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: 16, paddingTop: 52, paddingBottom: 10 },
  scroll: { paddingHorizontal: 16, paddingBottom: 48 },
  hero: {
    flexDirection: 'row', alignItems: 'flex-end', backgroundColor: colors.primary, borderRadius: 28,
    paddingLeft: 20, paddingTop: 20, overflow: 'hidden', marginBottom: 16, ...cardShadow,
  },
  heroKicker: { color: '#ffffffcc', fontSize: 10, fontFamily: fonts.body, letterSpacing: 1.2 },
  heroTitle: { color: '#fff', fontSize: 21, lineHeight: 26, fontFamily: fonts.headingBlack, marginTop: 4 },
  heroSub: { color: '#ffffffe0', fontSize: 12, lineHeight: 17, marginTop: 8, marginBottom: 20 },
  heroImg: { width: 128, height: 150, marginRight: -14 },
  primary: {
    flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.text, borderRadius: radius.lg,
    paddingVertical: 17, paddingHorizontal: 18, marginBottom: 12, ...cardShadow,
  },
  primaryText: { flex: 1, color: '#fff', fontSize: 16, fontFamily: fonts.body },
  primaryArrow: { color: colors.yellow, fontSize: 20, fontFamily: fonts.body },
  card: {
    flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.card, borderRadius: radius.lg,
    padding: 14, marginBottom: 10, borderWidth: 1, borderColor: colors.cardBorder, ...cardShadow,
  },
  cardIcon: { width: 46, height: 46, borderRadius: 15, backgroundColor: colors.primaryTint, alignItems: 'center', justifyContent: 'center' },
  avatar: { width: 46, height: 46, borderRadius: 23, backgroundColor: colors.primaryTint },
  cardTitle: { fontSize: 15, fontFamily: fonts.body, color: colors.text },
  cardSub: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  count: { minWidth: 24, height: 24, borderRadius: 12, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6 },
  countText: { color: '#fff', fontSize: 12, fontFamily: fonts.body },
  chevron: { fontSize: 24, color: colors.outlineVariant },
  sectionTitle: { fontSize: 17, fontFamily: fonts.headingBlack, color: colors.text, marginTop: 18, marginBottom: 12 },
  steps: { backgroundColor: colors.card, borderRadius: radius.lg, padding: 16, gap: 16, borderWidth: 1, borderColor: colors.cardBorder },
  step: { flexDirection: 'row', gap: 12 },
  stepNum: { width: 30, height: 30, borderRadius: 15, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  stepNumText: { color: '#fff', fontFamily: fonts.heading, fontSize: 14 },
  stepTitle: { fontSize: 14, fontFamily: fonts.body, color: colors.text },
  stepDesc: { fontSize: 12, color: colors.textMuted, marginTop: 2, lineHeight: 17 },
})
