import { useState, useCallback } from 'react'
import { ScrollView, View, Text, TouchableOpacity, TextInput, StyleSheet, ActivityIndicator, Alert } from 'react-native'
import { useRouter, useFocusEffect } from 'expo-router'
import { supabase } from '../lib/supabase'
import { API_URL } from '../lib/config'
import { colors, radius, cardShadow, fonts } from '../lib/theme'

type Plan = 'monthly' | 'yearly'

const PLANS: { id: Plan; label: string; price: number; period: string; hint: string }[] = [
  { id: 'monthly', label: 'Mensuel', price: 2000, period: '/mois', hint: '' },
  { id: 'yearly', label: 'Annuel', price: 20000, period: '/an', hint: 'économise 4 000 FCFA' },
]

const FEATURES = [
  'Questions IA illimitées',
  "Tous les cours & examens d'État",
  'Corrigés détaillés',
  'Flashcards avancées (SM-2)',
  'Progression complète + badges',
]

async function token() {
  const { data: { session } } = await supabase.auth.getSession()
  return session?.access_token
}

export default function AbonnementScreen() {
  const router = useRouter()
  const [plan, setPlan] = useState<Plan>('yearly')
  const [network, setNetwork] = useState<'MTN' | 'AIRTEL'>('MTN')
  const [phone, setPhone] = useState('')
  const [busy, setBusy] = useState(false)
  const [pending, setPending] = useState<string | null>(null)
  const [isPremium, setIsPremium] = useState(false)

  const loadStatus = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase.from('users').select('plan').eq('id', user.id).single()
    setIsPremium((data as { plan?: string } | null)?.plan === 'premium')
  }, [])
  useFocusEffect(useCallback(() => { loadStatus() }, [loadStatus]))

  async function pollSubscription(): Promise<boolean> {
    const t = await token()
    for (let i = 0; i < 40; i++) { // ~2 min (40 × 3 s)
      await new Promise((r) => setTimeout(r, 3000))
      const res = await fetch(`${API_URL}/api/billing/subscription`, {
        headers: { Authorization: `Bearer ${t}` },
      })
      const json = await res.json().catch(() => ({}))
      if (json.data?.status === 'active') return true
    }
    return false
  }

  async function subscribe() {
    const digits = phone.replace(/[^0-9]/g, '')
    if (digits.length < 8) return Alert.alert('Numéro invalide', 'Saisis ton numéro Mobile Money.')

    setBusy(true)
    const t = await token()
    const res = await fetch(`${API_URL}/api/billing/feexpay`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${t}` },
      body: JSON.stringify({ plan, phone: digits, network }),
    })
    const json = await res.json().catch(() => ({}))
    if (!res.ok || !json.data?.reference) {
      setBusy(false)
      return Alert.alert('Erreur', json.error?.message ?? "Le paiement n'a pas pu être lancé.")
    }

    setPending('Confirme le paiement sur ton téléphone (code Mobile Money)…')
    const ok = await pollSubscription()
    setPending(null)
    setBusy(false)
    if (ok) {
      await loadStatus()
      Alert.alert('Premium activé 🎉', 'Ton abonnement est actif. Bon courage pour tes révisions !')
      router.back()
    } else {
      Alert.alert('En attente', 'Paiement non confirmé à temps. Si tu as validé, ton accès s\'activera sous peu.')
    }
  }

  if (isPremium) {
    return (
      <View style={styles.centered}>
        <Text style={styles.bigIcon}>⭐</Text>
        <Text style={styles.premiumTitle}>Tu es Premium</Text>
        <Text style={styles.premiumSub}>Tu as accès à tout le contenu et à l'IA illimitée.</Text>
        <TouchableOpacity style={styles.payBtn} onPress={() => router.back()}>
          <Text style={styles.payBtnText}>Retour</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const selected = PLANS.find((p) => p.id === plan)!

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={12}><Text style={styles.back}>←</Text></TouchableOpacity>
        <Text style={styles.title}>Kelassi Premium</Text>
        <View style={{ width: 20 }} />
      </View>

      <View style={styles.hero}>
        <Text style={styles.heroIcon}>⭐</Text>
        <Text style={styles.heroTitle}>Réussis ton examen avec l'IA</Text>
      </View>

      <View style={styles.featureCard}>
        {FEATURES.map((f) => (
          <View key={f} style={styles.featureRow}>
            <Text style={styles.featureCheck}>✓</Text>
            <Text style={styles.featureText}>{f}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Choisis ton offre</Text>
      <View style={styles.planRow}>
        {PLANS.map((p) => (
          <TouchableOpacity
            key={p.id}
            style={[styles.planCard, plan === p.id && styles.planCardActive]}
            onPress={() => setPlan(p.id)}
          >
            <Text style={[styles.planLabel, plan === p.id && { color: colors.primary }]}>{p.label}</Text>
            <Text style={styles.planPrice}>{p.price.toLocaleString('fr-FR')}<Text style={styles.planUnit}> FCFA{p.period}</Text></Text>
            {!!p.hint && <Text style={styles.planHint}>{p.hint}</Text>}
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Paiement Mobile Money</Text>
      <View style={styles.operatorRow}>
        {(['MTN', 'AIRTEL'] as const).map((n) => (
          <TouchableOpacity key={n} style={[styles.operatorBtn, network === n && styles.operatorBtnActive]} onPress={() => setNetwork(n)}>
            <Text style={[styles.operatorText, network === n && styles.operatorTextActive]}>{n === 'MTN' ? 'MTN MoMo' : 'Airtel Money'}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.phoneRow}>
        <Text style={styles.phonePrefix}>🇨🇬 +242</Text>
        <TextInput
          style={styles.phoneInput}
          placeholder="06 XXX XX XX"
          placeholderTextColor={colors.textMuted}
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
          editable={!busy}
        />
      </View>

      {pending && (
        <View style={styles.pendingBox}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={styles.pendingText}>{pending}</Text>
        </View>
      )}

      <TouchableOpacity style={[styles.payBtn, busy && { opacity: 0.5 }]} onPress={subscribe} disabled={busy}>
        <Text style={styles.payBtnText}>
          {busy ? (pending ? 'En attente…' : 'Traitement…') : `Payer ${selected.price.toLocaleString('fr-FR')} FCFA`}
        </Text>
      </TouchableOpacity>

      <Text style={styles.legal}>Paiement sécurisé FeexPay · Annulation à tout moment</Text>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingTop: 56, paddingBottom: 50 },
  centered: { flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', padding: 30 },
  bigIcon: { fontSize: 56, marginBottom: 12 },
  premiumTitle: { fontSize: 22, fontFamily: fonts.headingBlack, color: colors.text, marginBottom: 6 },
  premiumSub: { fontSize: 14, color: colors.textMuted, textAlign: 'center', marginBottom: 24 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  back: { fontSize: 24, color: colors.text },
  title: { fontSize: 20, fontFamily: fonts.headingBlack, color: colors.text },
  hero: { alignItems: 'center', marginBottom: 20 },
  heroIcon: { fontSize: 44 },
  heroTitle: { fontSize: 18, fontWeight: '900', color: colors.text, marginTop: 8, textAlign: 'center' },
  featureCard: { backgroundColor: colors.card, borderRadius: radius.xl, padding: 18, borderWidth: 1, borderColor: colors.cardBorder, ...cardShadow },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 5 },
  featureCheck: { color: colors.primary, fontWeight: '900', fontSize: 15 },
  featureText: { fontSize: 14, color: colors.text, flex: 1 },
  sectionTitle: { fontSize: 16, fontWeight: '900', color: colors.text, marginTop: 24, marginBottom: 12 },
  planRow: { flexDirection: 'row', gap: 10 },
  planCard: { flex: 1, backgroundColor: colors.card, borderRadius: radius.md, padding: 16, borderWidth: 2, borderColor: colors.cardBorder },
  planCardActive: { borderColor: colors.primary, backgroundColor: colors.primaryTint },
  planLabel: { fontSize: 14, fontWeight: '800', color: colors.text, marginBottom: 4 },
  planPrice: { fontSize: 20, fontWeight: '900', color: colors.text },
  planUnit: { fontSize: 12, fontWeight: '700', color: colors.textMuted },
  planHint: { fontSize: 11, color: colors.primary, marginTop: 4, fontWeight: '700' },
  operatorRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  operatorBtn: { flex: 1, backgroundColor: colors.card, borderRadius: radius.md, paddingVertical: 12, alignItems: 'center', borderWidth: 1, borderColor: colors.cardBorder },
  operatorBtnActive: { borderColor: colors.primary, backgroundColor: colors.primaryTint },
  operatorText: { fontSize: 13, fontWeight: '700', color: colors.textMuted },
  operatorTextActive: { color: colors.primary },
  phoneRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: radius.md, borderWidth: 1, borderColor: colors.cardBorder, overflow: 'hidden' },
  phonePrefix: { paddingHorizontal: 14, paddingVertical: 14, fontSize: 14, fontWeight: '700', color: colors.text, backgroundColor: colors.primaryTint },
  phoneInput: { flex: 1, paddingHorizontal: 12, paddingVertical: 14, fontSize: 15, color: colors.text },
  pendingBox: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.primaryTint, borderRadius: radius.md, padding: 14, marginTop: 16 },
  pendingText: { flex: 1, fontSize: 13, color: colors.text },
  payBtn: { backgroundColor: colors.primary, borderRadius: radius.lg, paddingVertical: 16, alignItems: 'center', marginTop: 20, ...cardShadow },
  payBtnText: { color: '#fff', fontSize: 16, fontWeight: '900' },
  legal: { fontSize: 11, color: colors.textMuted, textAlign: 'center', marginTop: 14 },
})
