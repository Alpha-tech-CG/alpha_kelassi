import { View, Text, StyleSheet } from 'react-native'
import { colors, radius } from '../lib/theme'
import type { UsageView } from '../lib/billing'

/** Quota consommé et restant, en texte d'abord (la barre ne fait qu'illustrer). */
export function QuotaBar({ label, usage }: { label: string; usage: UsageView | null | undefined }) {
  if (!usage) return null
  const limit = usage.limit === null ? null : usage.limit + usage.bonus
  const pct = limit ? Math.min(100, Math.round((100 * usage.used) / limit)) : 0
  const reached = usage.message.reached

  return (
    <View
      style={styles.box}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      accessibilityValue={limit ? { min: 0, max: limit, now: Math.min(usage.used, limit), text: usage.message.summary } : { text: usage.message.summary }}
    >
      <View style={styles.row}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.count}>{limit === null ? 'Sans limite' : `${usage.used} / ${limit}`}</Text>
      </View>
      {limit !== null && limit > 0 && (
        <View style={styles.track}><View style={[styles.fill, { width: `${pct}%` }, reached && styles.fillReached]} /></View>
      )}
      <Text style={styles.summary}>{usage.message.summary}</Text>
      {!!usage.message.detail && <Text style={[styles.detail, reached && styles.detailReached]}>{usage.message.detail}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  box: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.cardBorder, borderRadius: radius.md, padding: 12, marginVertical: 6 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 },
  label: { fontSize: 13, fontWeight: '800', color: colors.text, flex: 1, marginRight: 8 },
  count: { fontSize: 13, fontWeight: '800', color: colors.textMuted },
  track: { height: 8, backgroundColor: colors.primaryTint, borderRadius: radius.full, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: colors.primary, borderRadius: radius.full },
  fillReached: { backgroundColor: colors.red },
  summary: { fontSize: 12, color: colors.textMuted, marginTop: 6 },
  detail: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  detailReached: { color: colors.red, fontWeight: '700' },
})
