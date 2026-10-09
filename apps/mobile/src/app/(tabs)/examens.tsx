import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { useLevel } from '../../hooks/useLevel'
import { useBilling } from '../../hooks/useBilling'
import { colors, radius, cardShadow, fonts, LEVEL_LABEL, levelBadgeStyle } from '../../lib/theme'
import { RAYONS, rayonMeta, examName, type PrepaRayon } from '../../lib/prepa'

/**
 * Espace « Prépa » — remplace l'ancienne page Examens (liste de PDF).
 *
 * L'élève choisit d'abord CE QU'IL VEUT FAIRE (Bac test, Bac blanc, Bac rouge,
 * anciens sujets ou TD), puis la matière : les épreuves et les exercices sont
 * rangés par matière. Les rayons fermés par la formule restent visibles, avec
 * leur cadenas, pour que l'élève sache ce qui existe.
 */
export default function PrepaScreen() {
  const router = useRouter()
  const { level } = useLevel()
  const { me } = useBilling()
  const allowed = new Set(me?.exam_modes ?? [])
  const badge = level ? levelBadgeStyle(level) : { bg: colors.red, fg: colors.onRed }

  // Un rayon à mode fixe est verrouillé si la formule n'ouvre pas ce mode.
  // `me` absent (chargement, hors-ligne) : on n'affiche pas de cadenas à tort.
  const isLocked = (r: PrepaRayon) => {
    const m = rayonMeta(r, level)
    return !!me && !!m.mode && !allowed.has(m.mode)
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {level && (
          <View style={[styles.levelPill, { backgroundColor: badge.bg }]}>
            <Text style={[styles.levelPillText, { color: badge.fg }]}>{LEVEL_LABEL[level] ?? level}</Text>
          </View>
        )}
        <Text style={styles.title}>Prépa</Text>
        <Text style={styles.subtitle}>Choisis comment tu veux t'entraîner pour le {examName(level)}, puis ta matière.</Text>

        {RAYONS.map((r) => {
          const m = rayonMeta(r, level)
          const locked = isLocked(r)
          const featured = r === 'bac_blanc'
          return (
            <TouchableOpacity
              key={r}
              style={[styles.card, featured && styles.cardFeatured]}
              activeOpacity={0.9}
              onPress={() => router.push(`/prepa/${r}` as any)}
              accessibilityRole="button"
              accessibilityLabel={`${m.label} : ${m.desc}${locked ? `, formule ${m.planLabel} requise` : ''}`}
            >
              <View style={[styles.iconBox, featured && styles.iconBoxFeatured]}>
                <Text style={styles.icon}>{m.emoji}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.cardTitle, featured && styles.cardTitleFeatured]}>{m.label}</Text>
                <Text style={[styles.cardDesc, featured && styles.cardDescFeatured]}>{m.desc}</Text>
              </View>
              {locked ? (
                <View style={styles.lock}><Text style={styles.lockText}>🔒 {m.planLabel}</Text></View>
              ) : (
                <Text style={[styles.chevron, featured && { color: '#fff' }]}>›</Text>
              )}
            </TouchableOpacity>
          )
        })}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, paddingTop: 56, paddingBottom: 40 },
  levelPill: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 5, borderRadius: radius.full, marginBottom: 8 },
  levelPillText: { fontSize: 12, fontWeight: '800' },
  title: { fontSize: 28, fontFamily: fonts.headingBlack, color: colors.text },
  subtitle: { fontSize: 14, color: colors.textMuted, marginTop: 4, marginBottom: 20, lineHeight: 20 },
  card: {
    flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: colors.card, borderRadius: radius.lg,
    padding: 18, marginBottom: 12, borderWidth: 1, borderColor: colors.cardBorder, ...cardShadow,
  },
  cardFeatured: { backgroundColor: colors.primary, borderColor: colors.primary },
  iconBox: { width: 52, height: 52, borderRadius: 16, backgroundColor: colors.primaryTint, alignItems: 'center', justifyContent: 'center' },
  iconBoxFeatured: { backgroundColor: 'rgba(255,255,255,0.18)' },
  icon: { fontSize: 26 },
  cardTitle: { fontSize: 17, fontWeight: '900', color: colors.text },
  cardTitleFeatured: { color: '#fff' },
  cardDesc: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
  cardDescFeatured: { color: 'rgba(255,255,255,0.85)' },
  chevron: { fontSize: 26, color: colors.primary },
  lock: { backgroundColor: colors.background, borderRadius: radius.full, paddingHorizontal: 10, paddingVertical: 5 },
  lockText: { fontSize: 11, fontWeight: '800', color: colors.textMuted },
})
