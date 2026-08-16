import { useState, useCallback } from 'react'
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native'
import { useRouter, useFocusEffect } from 'expo-router'
import { supabase } from '../../lib/supabase'
import { API_URL } from '../../lib/config'
import { colors, radius, cardShadow, fonts } from '../../lib/theme'

interface Txn { id: string; amount_fcfa: number; type: 'credit' | 'withdrawal'; status: string; created_at: string }

async function token() {
  const { data: { session } } = await supabase.auth.getSession()
  return session?.access_token
}
async function api(path: string, init?: RequestInit) {
  const t = await token()
  const res = await fetch(`${API_URL}/api/tutor${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${t}`, ...(init?.headers ?? {}) },
  })
  return { ok: res.ok, json: await res.json().catch(() => ({})) }
}

const AMOUNTS = [1000, 2000, 5000]

export default function WalletScreen() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [balance, setBalance] = useState(0)
  const [txns, setTxns] = useState<Txn[]>([])
  const [withdrawing, setWithdrawing] = useState(false)

  const load = useCallback(async () => {
    const { json } = await api('/wallet')
    setBalance(json.data?.balance ?? 0)
    setTxns(json.data?.transactions ?? [])
    setLoading(false)
  }, [])
  useFocusEffect(useCallback(() => { load() }, [load]))

  async function withdraw(amount: number) {
    if (amount > balance) return Alert.alert('Solde insuffisant', 'Tu ne peux pas retirer plus que ton solde.')
    Alert.alert('Confirmer le retrait', `Retirer ${amount.toLocaleString('fr-FR')} FCFA ?`, [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Retirer', onPress: async () => {
        setWithdrawing(true)
        const { ok, json } = await api('/withdraw', { method: 'POST', body: JSON.stringify({ amount }) })
        setWithdrawing(false)
        if (!ok) return Alert.alert('Erreur', json.error?.message ?? 'Retrait impossible.')
        await load()
        Alert.alert('Demande envoyée', 'Ton retrait est en cours de traitement.')
      } },
    ])
  }

  if (loading) return <ActivityIndicator style={{ flex: 1, backgroundColor: colors.background }} color={colors.primary} />

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Text style={styles.back}>←</Text></TouchableOpacity>
        <Text style={styles.title}>Portefeuille</Text>
        <View style={{ width: 20 }} />
      </View>

      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Solde disponible</Text>
        <Text style={styles.balanceValue}>{balance.toLocaleString('fr-FR')} <Text style={styles.balanceUnit}>FCFA</Text></Text>
      </View>

      <Text style={styles.sectionTitle}>Retirer</Text>
      <View style={styles.amounts}>
        {AMOUNTS.map((a) => (
          <TouchableOpacity key={a} style={[styles.amountBtn, (a > balance || withdrawing) && { opacity: 0.4 }]} onPress={() => withdraw(a)} disabled={a > balance || withdrawing}>
            <Text style={styles.amountText}>{a.toLocaleString('fr-FR')}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.hint}>Retrait via Mobile Money (Airtel / MTN). Minimum 500 FCFA.</Text>

      <Text style={styles.sectionTitle}>Historique</Text>
      {txns.length === 0 ? (
        <Text style={styles.empty}>Aucune transaction pour l’instant.</Text>
      ) : (
        txns.map((t) => (
          <View key={t.id} style={styles.txnRow}>
            <View style={[styles.txnIcon, { backgroundColor: t.type === 'credit' ? '#E6F7EE' : colors.primaryTint }]}>
              <Text>{t.type === 'credit' ? '➕' : '➖'}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.txnLabel}>{t.type === 'credit' ? 'Correction validée' : 'Retrait'}</Text>
              <Text style={styles.txnDate}>{new Date(t.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} · {t.status}</Text>
            </View>
            <Text style={[styles.txnAmount, { color: t.type === 'credit' ? '#0B8A46' : colors.text }]}>{t.type === 'credit' ? '+' : '−'}{t.amount_fcfa.toLocaleString('fr-FR')}</Text>
          </View>
        ))
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingTop: 56, paddingBottom: 50 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 },
  back: { fontSize: 24, color: colors.text },
  title: { fontSize: 20, fontFamily: fonts.headingBlack, color: colors.text },
  balanceCard: { backgroundColor: colors.primary, borderRadius: radius.xl, padding: 26, alignItems: 'center', ...cardShadow },
  balanceLabel: { color: '#E7F0FD', fontSize: 13, fontWeight: '700' },
  balanceValue: { color: '#fff', fontSize: 40, fontWeight: '900', marginTop: 6 },
  balanceUnit: { fontSize: 18, fontWeight: '700' },
  sectionTitle: { fontSize: 16, fontWeight: '900', color: colors.text, marginTop: 26, marginBottom: 12 },
  amounts: { flexDirection: 'row', gap: 10 },
  amountBtn: { flex: 1, backgroundColor: colors.card, borderRadius: radius.md, paddingVertical: 16, alignItems: 'center', borderWidth: 1, borderColor: colors.cardBorder, ...cardShadow },
  amountText: { fontSize: 15, fontWeight: '800', color: colors.primary },
  hint: { fontSize: 11, color: colors.textMuted, marginTop: 10 },
  empty: { fontSize: 13, color: colors.textMuted },
  txnRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.card, borderRadius: radius.md, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: colors.cardBorder },
  txnIcon: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  txnLabel: { fontSize: 14, fontWeight: '700', color: colors.text },
  txnDate: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  txnAmount: { fontSize: 15, fontWeight: '900' },
})
