import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { colors, radius } from '../lib/theme'
import { PLAN_LABEL, type LockedInfo } from '../lib/billing'

/**
 * Fonctionnalité verrouillée : ce qui manque, la formule minimale, son prix et
 * un accès direct aux offres. Remplace les messages « Premium » et les erreurs.
 */
export function LockedFeature({ info, compact = false, fallbackTitle }: { info: LockedInfo | null; compact?: boolean; fallbackTitle?: string }) {
  const router = useRouter()
  if (!info && !fallbackTitle) return null
  const plan = info?.requiredPlan ?? 'starter'
  const label = PLAN_LABEL[plan]
  const title = info?.title || fallbackTitle || ''

  return (
    <View
      style={[styles.box, compact && styles.compact]}
      accessible
      accessibilityLabel={`${title} ${info?.body ?? ''} Formule requise : ${label}${info?.price ? `, à partir de ${info.price}` : ''}.`}
    >
      <Text style={styles.icon} importantForAccessibility="no">🔒</Text>
      <Text style={styles.title}>{title}</Text>
      {!!info?.body && <Text style={styles.body}>{info.body}</Text>}
      <Text style={styles.plan}>Formule requise : {label}{info?.price ? ` — à partir de ${info.price}` : ''}</Text>
      <TouchableOpacity
        style={styles.cta}
        accessibilityRole="button"
        accessibilityLabel={`Voir la formule ${label}`}
        onPress={() => router.push(`/abonnement?plan=${plan}` as any)}
      >
        <Text style={styles.ctaText}>Voir la formule {label}</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  box: { backgroundColor: '#FFF8E6', borderColor: '#F2D48A', borderWidth: 1, borderRadius: radius.lg, padding: 18, alignItems: 'center', marginVertical: 10 },
  compact: { padding: 14 },
  icon: { fontSize: 28, marginBottom: 6 },
  title: { fontSize: 15, fontWeight: '900', color: colors.text, textAlign: 'center' },
  body: { fontSize: 13, color: colors.textMuted, textAlign: 'center', marginTop: 6, lineHeight: 19 },
  plan: { fontSize: 13, fontWeight: '800', color: '#8A5A00', textAlign: 'center', marginTop: 10 },
  cta: { backgroundColor: colors.text, borderRadius: radius.md, paddingVertical: 12, paddingHorizontal: 18, marginTop: 12, alignSelf: 'stretch', alignItems: 'center' },
  ctaText: { color: '#fff', fontSize: 14, fontWeight: '800' },
})
