import { useCallback, useEffect, useRef, useState } from 'react'
import { ScrollView, View, Text, TouchableOpacity, TextInput, StyleSheet, ActivityIndicator } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { colors, radius, cardShadow, fonts } from '../lib/theme'
import { api, dateFr, formatFcfa, planLabel, type PlanId, type PlanOffer } from '../lib/billing'
import { useBilling } from '../hooks/useBilling'
import { QuotaBar } from '../components/QuotaBar'

type Interval = 'month' | 'year'
type Tone = 'info' | 'ok' | 'error'

const LEVEL: Record<PlanId, number> = { free: 0, starter: 1, pro: 2, pro_max: 3 }

export default function AbonnementScreen() {
  const router = useRouter()
  const params = useLocalSearchParams<{ plan?: string }>()
  const { me, reload } = useBilling()
  const [plans, setPlans] = useState<PlanOffer[] | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [interval, setBillingInterval] = useState<Interval>('month')
  const [selected, setSelected] = useState<PlanId | null>(null)
  const [network, setNetwork] = useState<'MTN' | 'AIRTEL'>('MTN')
  const [phone, setPhone] = useState('')
  const [paying, setPaying] = useState(false)
  const [status, setStatus] = useState<{ tone: Tone; text: string } | null>(null)
  const scrollRef = useRef<ScrollView>(null)

  const loadPlans = useCallback(async () => {
    const res = await api<PlanOffer[]>('/api/billing/plans')
    if (res.ok && res.json.data) { setPlans(res.json.data); setLoadError(null) }
    else setLoadError(res.json.error?.message ?? 'Les formules n’ont pas pu être chargées.')
  }, [])
  useEffect(() => { loadPlans() }, [loadPlans])

  // Arrivée depuis un écran verrouillé : /abonnement?plan=pro
  useEffect(() => {
    const p = params.plan as PlanId | undefined
    if (p && p !== 'free' && p in LEVEL) setSelected(p)
  }, [params.plan])

  const currentPlan: PlanId = me?.plan ?? 'free'
  const selectedOffer = plans?.find((p) => p.id === selected) ?? null
  const price = selectedOffer ? (interval === 'month' ? selectedOffer.monthly : selectedOffer.yearly) : null

  function choose(plan: PlanId) {
    setSelected(plan)
    setStatus(null)
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100)
  }

  function changeText(plan: PlanId): string {
    const sub = me?.current_subscription
    if (!sub || currentPlan === 'free' || !sub.expires_at) return 'Ta formule sera active dès la confirmation du paiement.'
    if (LEVEL[plan] > LEVEL[currentPlan]) return 'Montée immédiate : les jours restants de ta formule actuelle sont convertis au prorata.'
    if (plan === currentPlan) return `Renouvellement : la nouvelle période commencera le ${dateFr(sub.expires_at)}.`
    return `Tu gardes ta formule actuelle jusqu’au ${dateFr(sub.expires_at)} ; ${planLabel(plan)} prendra le relais ensuite.`
  }

  async function pay() {
    if (!selectedOffer || !price) return
    const digits = phone.replace(/[^0-9]/g, '')
    if (digits.length < 8) { setStatus({ tone: 'error', text: 'Saisis ton numéro Mobile Money (9 chiffres).' }); return }

    setPaying(true)
    setStatus({ tone: 'info', text: 'Envoi de la demande de paiement…' })
    try {
      const res = await api<{ reference: string }>('/api/billing/feexpay', {
        method: 'POST',
        body: JSON.stringify({ product: price.product, phone: digits, network }),
      })
      if (!res.ok || !res.json.data?.reference) {
        setStatus({ tone: 'error', text: res.json.error?.message ?? 'Le paiement n’a pas pu être lancé.' })
        return
      }
      const reference = res.json.data.reference
      setStatus({ tone: 'info', text: 'Confirme le paiement sur ton téléphone (code Mobile Money)…' })

      for (let i = 0; i < 60; i++) { // ~3 min
        await new Promise((r) => setTimeout(r, 3000))
        const s = await api<{ status: string; message: string }>(`/api/billing/feexpay/status?reference=${reference}`)
        const st = s.json.data?.status
        if (st && st !== 'pending') {
          setStatus({ tone: st === 'successful' ? 'ok' : 'error', text: s.json.data!.message })
          if (st === 'successful') { setSelected(null); setPhone(''); await reload() }
          return
        }
      }
      setStatus({ tone: 'info', text: 'Paiement toujours en attente. Si tu l’as validé, ta formule s’activera dans quelques minutes.' })
    } finally {
      setPaying(false)
    }
  }

  const sub = me?.current_subscription

  return (
    <ScrollView ref={scrollRef} style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={12} accessibilityRole="button" accessibilityLabel="Retour">
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title} accessibilityRole="header">Formules Cognix</Text>
        <View style={{ width: 20 }} />
      </View>

      {/* Ma formule */}
      {me && (
        <View style={styles.card}>
          <Text style={styles.overline}>MA FORMULE</Text>
          <Text style={styles.currentPlan}>
            {me.plan_label}{sub?.billing_interval ? ` · ${sub.billing_interval === 'month' ? 'mensuelle' : 'annuelle'}` : ''}
          </Text>
          {me.is_admin && <Text style={styles.muted}>Compte administrateur : accès complet.</Text>}
          {sub?.expires_at && (
            <Text style={[styles.muted, me.expiring_soon && styles.warn]}>
              Active jusqu’au {dateFr(sub.expires_at)}{me.days_left !== null ? ` (${me.days_left} jour${me.days_left > 1 ? 's' : ''})` : ''}.
              {me.expiring_soon ? ' Pense à la renouveler.' : ''}
            </Text>
          )}
          {me.scheduled.map((s) => (
            <Text key={s.id} style={styles.muted}>Programmée : {planLabel(s.plan)} à partir du {dateFr(s.started_at)}.</Text>
          ))}
          <QuotaBar label="Questions Cognix IA aujourd’hui" usage={me.usage.ai_questions} />
          <QuotaBar label="Corrections par tuteur ce mois-ci" usage={me.usage.tutor_corrections} />
        </View>
      )}

      {/* Période */}
      <View style={styles.toggle} accessibilityRole="radiogroup">
        {(['month', 'year'] as const).map((i) => (
          <TouchableOpacity
            key={i}
            style={[styles.toggleBtn, interval === i && styles.toggleBtnOn]}
            onPress={() => setBillingInterval(i)}
            accessibilityRole="radio"
            accessibilityState={{ selected: interval === i }}
          >
            <Text style={[styles.toggleText, interval === i && styles.toggleTextOn]}>{i === 'month' ? 'Mensuel' : 'Annuel · 2 mois offerts'}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {loadError && <Text style={styles.errorText}>{loadError}</Text>}
      {!plans && !loadError && <ActivityIndicator color={colors.primary} style={{ marginVertical: 30 }} />}

      {plans?.map((p) => {
        const isCurrent = p.id === currentPlan
        const offer = interval === 'month' ? p.monthly : p.yearly
        const higher = LEVEL[p.id] > LEVEL[currentPlan]
        return (
          <View key={p.id} style={[styles.planCard, isCurrent && styles.planCardCurrent, p.id === 'pro' && !isCurrent && styles.planCardPopular]}>
            <View style={styles.badges}>
              {!!p.highlight && <Text style={styles.badgeHighlight}>{p.highlight}</Text>}
              {isCurrent && <Text style={styles.badgeCurrent}>Ta formule actuelle</Text>}
            </View>
            <Text style={styles.planName} accessibilityRole="header">{p.label}</Text>
            <Text style={styles.muted}>{p.tagline}</Text>
            <Text style={styles.planPrice}>{offer ? offer.label : '0 FCFA'}</Text>
            {offer && (
              <Text style={styles.savings}>
                {interval === 'year' ? `Soit ${formatFcfa(Math.round(offer.amount / 12))} par mois · ${p.yearly_savings_label}` : `Ou ${p.yearly?.label} (${p.yearly_savings_label?.toLowerCase()})`}
              </Text>
            )}

            <View style={styles.facts}>
              <Text style={styles.fact}>🤖 {p.ai_daily_limit} questions Cognix IA / jour</Text>
              <Text style={styles.fact}>✍️ {p.tutor_corrections_monthly ? `${p.tutor_corrections_monthly} corrections par tuteur / mois` : 'Correction par tuteur non incluse'}</Text>
              <Text style={styles.fact}>📝 Simulations : {p.exam_modes.length ? p.exam_modes.join(', ') : 'aucune'}</Text>
            </View>

            {p.features.map((f) => <Text key={f} style={styles.feature}>✓ {f}</Text>)}
            {p.exclusions.map((f) => <Text key={f} style={styles.exclusion} accessibilityLabel={`Non inclus : ${f}`}>✕ {f}</Text>)}

            {p.id !== 'free' && !(isCurrent && me?.is_admin) && (
              <TouchableOpacity
                style={[styles.chooseBtn, !higher && styles.chooseBtnSecondary]}
                onPress={() => choose(p.id)}
                accessibilityRole="button"
              >
                <Text style={[styles.chooseText, !higher && styles.chooseTextSecondary]}>
                  {isCurrent ? `Renouveler ${p.label}` : higher ? `Passer à ${p.label}` : `Choisir ${p.label} à l’échéance`}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )
      })}

      {/* Paiement */}
      {selectedOffer && price && (
        <View style={styles.card}>
          <Text style={styles.payTitle} accessibilityRole="header">
            Payer {selectedOffer.label} {interval === 'month' ? 'mensuel' : 'annuel'} — {formatFcfa(price.amount)}
          </Text>
          <Text style={styles.muted}>{changeText(selectedOffer.id)}</Text>

          <Text style={styles.fieldLabel}>Opérateur</Text>
          <View style={styles.operatorRow} accessibilityRole="radiogroup">
            {(['MTN', 'AIRTEL'] as const).map((n) => (
              <TouchableOpacity key={n} style={[styles.operatorBtn, network === n && styles.operatorBtnOn]} onPress={() => setNetwork(n)}
                accessibilityRole="radio" accessibilityState={{ selected: network === n }}>
                <Text style={[styles.operatorText, network === n && styles.operatorTextOn]}>{n === 'MTN' ? 'MTN MoMo' : 'Airtel Money'}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.fieldLabel}>Numéro Mobile Money</Text>
          <View style={styles.phoneRow}>
            <Text style={styles.phonePrefix}>🇨🇬 +242</Text>
            <TextInput
              style={styles.phoneInput}
              placeholder="06 XXX XX XX"
              placeholderTextColor={colors.textMuted}
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
              editable={!paying}
              accessibilityLabel="Numéro Mobile Money"
            />
          </View>

          {status && (
            <View style={[styles.statusBox, status.tone === 'ok' ? styles.statusOk : status.tone === 'error' ? styles.statusError : styles.statusInfo]} accessibilityLiveRegion="polite">
              {paying && status.tone === 'info' && <ActivityIndicator size="small" color={colors.primary} />}
              <Text style={styles.statusText}>{status.text}</Text>
            </View>
          )}

          <TouchableOpacity style={[styles.payBtn, paying && { opacity: 0.5 }]} onPress={pay} disabled={paying} accessibilityRole="button">
            <Text style={styles.payBtnText}>{paying ? 'Paiement en cours…' : `Payer ${formatFcfa(price.amount)}`}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { setSelected(null); setStatus(null) }} disabled={paying} style={styles.cancelBtn} accessibilityRole="button">
            <Text style={styles.cancelText}>Annuler</Text>
          </TouchableOpacity>
          <Text style={styles.legal}>Paiement sécurisé FeexPay. Activation après confirmation de l’opérateur. Aucun renouvellement automatique.</Text>
        </View>
      )}

      <Text style={styles.legal}>
        À l’échéance, ton compte repasse en Gratuit : ta progression, tes badges et ton historique sont conservés.
      </Text>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingTop: 56, paddingBottom: 60 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  back: { fontSize: 24, color: colors.text },
  title: { fontSize: 20, fontFamily: fonts.headingBlack, color: colors.text },
  card: { backgroundColor: colors.card, borderRadius: radius.xl, padding: 18, borderWidth: 1, borderColor: colors.cardBorder, marginBottom: 16, ...cardShadow },
  overline: { fontSize: 11, fontWeight: '900', color: colors.textMuted, letterSpacing: 0.8 },
  currentPlan: { fontSize: 22, fontWeight: '900', color: colors.text, marginTop: 2, marginBottom: 4 },
  muted: { fontSize: 13, color: colors.textMuted, marginTop: 2, lineHeight: 19 },
  warn: { color: colors.red, fontWeight: '700' },
  toggle: { flexDirection: 'row', backgroundColor: colors.primaryTint, borderRadius: radius.md, padding: 4, marginBottom: 16 },
  toggleBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: radius.md },
  toggleBtnOn: { backgroundColor: colors.card, ...cardShadow },
  toggleText: { fontSize: 13, fontWeight: '700', color: colors.textMuted },
  toggleTextOn: { color: colors.text },
  errorText: { color: colors.red, textAlign: 'center', marginVertical: 12 },
  planCard: { backgroundColor: colors.card, borderRadius: radius.xl, padding: 18, borderWidth: 2, borderColor: colors.cardBorder, marginBottom: 14 },
  planCardCurrent: { borderColor: colors.primary },
  planCardPopular: { borderColor: '#1E74E8' },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 4 },
  badgeHighlight: { backgroundColor: '#E3EEFD', color: '#0F4FA8', fontSize: 11, fontWeight: '900', paddingHorizontal: 10, paddingVertical: 3, borderRadius: radius.full, overflow: 'hidden' },
  badgeCurrent: { backgroundColor: colors.primaryTint, color: colors.primary, fontSize: 11, fontWeight: '900', paddingHorizontal: 10, paddingVertical: 3, borderRadius: radius.full, overflow: 'hidden' },
  planName: { fontSize: 20, fontWeight: '900', color: colors.text },
  planPrice: { fontSize: 24, fontWeight: '900', color: colors.text, marginTop: 8 },
  savings: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  facts: { backgroundColor: colors.background, borderRadius: radius.md, padding: 10, marginVertical: 12, gap: 3 },
  fact: { fontSize: 13, color: colors.text, fontWeight: '700' },
  feature: { fontSize: 13, color: colors.text, lineHeight: 20 },
  exclusion: { fontSize: 13, color: colors.textMuted, lineHeight: 20 },
  chooseBtn: { backgroundColor: colors.text, borderRadius: radius.md, paddingVertical: 13, alignItems: 'center', marginTop: 14 },
  chooseBtnSecondary: { backgroundColor: 'transparent', borderWidth: 2, borderColor: colors.cardBorder },
  chooseText: { color: '#fff', fontSize: 14, fontWeight: '900' },
  chooseTextSecondary: { color: colors.text },
  payTitle: { fontSize: 17, fontWeight: '900', color: colors.text, marginBottom: 4 },
  fieldLabel: { fontSize: 13, fontWeight: '800', color: colors.text, marginTop: 14, marginBottom: 8 },
  operatorRow: { flexDirection: 'row', gap: 8 },
  operatorBtn: { flex: 1, backgroundColor: colors.card, borderRadius: radius.md, paddingVertical: 12, alignItems: 'center', borderWidth: 1, borderColor: colors.cardBorder },
  operatorBtnOn: { borderColor: colors.primary, backgroundColor: colors.primaryTint },
  operatorText: { fontSize: 13, fontWeight: '700', color: colors.textMuted },
  operatorTextOn: { color: colors.primary },
  phoneRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: radius.md, borderWidth: 1, borderColor: colors.cardBorder, overflow: 'hidden' },
  phonePrefix: { paddingHorizontal: 14, paddingVertical: 14, fontSize: 14, fontWeight: '700', color: colors.text, backgroundColor: colors.primaryTint },
  phoneInput: { flex: 1, paddingHorizontal: 12, paddingVertical: 14, fontSize: 15, color: colors.text },
  statusBox: { flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: radius.md, padding: 12, marginTop: 14 },
  statusInfo: { backgroundColor: colors.primaryTint },
  statusOk: { backgroundColor: '#E6F7EE' },
  statusError: { backgroundColor: '#FDECEA' },
  statusText: { flex: 1, fontSize: 13, color: colors.text },
  payBtn: { backgroundColor: colors.primary, borderRadius: radius.lg, paddingVertical: 16, alignItems: 'center', marginTop: 16, ...cardShadow },
  payBtnText: { color: '#fff', fontSize: 16, fontWeight: '900' },
  cancelBtn: { alignItems: 'center', paddingVertical: 12 },
  cancelText: { color: colors.textMuted, fontWeight: '700' },
  legal: { fontSize: 11, color: colors.textMuted, textAlign: 'center', marginTop: 10, lineHeight: 16 },
})
