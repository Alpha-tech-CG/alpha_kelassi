import { useCallback, useState } from 'react'
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useFocusEffect, useRouter } from 'expo-router'
import { colors, radius, cardShadow, fonts } from '../lib/theme'
import {
  announcementTarget, dismissAnnouncement, dismissedAnnouncements, fetchAnnouncements,
  type Announcement, type AnnouncementType,
} from '../lib/announcements'

const ACCENT: Record<AnnouncementType, string> = {
  annonce: colors.primary, promo: '#F59E0B', pub: colors.primary, alerte: colors.red,
}
const EMOJI: Record<AnnouncementType, string> = { annonce: '📢', promo: '🎁', pub: '📣', alerte: '⚠️' }

/**
 * Annonce de la console admin en haut de l'Accueil. Une seule à la fois (la
 * plus récente non fermée) ; fermée, elle ne revient plus sur cet appareil.
 * Relue à chaque retour sur l'écran. Aucune erreur n'est montrée à l'élève.
 */
export function AnnouncementBanner({ plan }: { plan: string | null | undefined }) {
  const router = useRouter()
  const [current, setCurrent] = useState<Announcement | null>(null)

  useFocusEffect(useCallback(() => {
    let alive = true
    void (async () => {
      const [list, dismissed] = await Promise.all([fetchAnnouncements(plan), dismissedAnnouncements()])
      if (alive) setCurrent(list.find((a) => !dismissed.includes(a.id)) ?? null)
    })()
    return () => { alive = false }
  }, [plan]))

  if (!current) return null
  const accent = ACCENT[current.type] ?? colors.primary
  const target = current.cta_label && current.cta_url ? announcementTarget(current.cta_url) : null

  async function close() {
    if (!current) return
    const id = current.id
    setCurrent(null)
    await dismissAnnouncement(id)
  }

  function open() {
    if (!target) return
    if (target.kind === 'screen') router.push(target.route as never)
    else void Linking.openURL(target.url)
  }

  return (
    <View style={styles.card} accessibilityRole="summary">
      <View style={[styles.accent, { backgroundColor: accent }]} />
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{EMOJI[current.type] ?? '📢'} {current.title}</Text>
        <Text style={styles.message}>{current.message}</Text>
        {target && (
          <TouchableOpacity onPress={open} accessibilityRole="button" style={styles.ctaWrap}>
            <Text style={[styles.cta, { color: accent }]}>{current.cta_label} →</Text>
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity onPress={close} accessibilityRole="button" accessibilityLabel="Fermer l’annonce" hitSlop={12} style={styles.close}>
        <Text style={styles.closeText}>✕</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row', gap: 12, backgroundColor: colors.card, borderRadius: radius.lg,
    padding: 14, marginBottom: 18, ...cardShadow,
  },
  accent: { width: 4, borderRadius: radius.full },
  title: { fontFamily: fonts.body, fontSize: 15, color: colors.text },
  message: { fontFamily: fonts.regular, fontSize: 13, color: colors.textMuted, marginTop: 3, lineHeight: 19 },
  ctaWrap: { marginTop: 8, alignSelf: 'flex-start' },
  cta: { fontFamily: fonts.body, fontSize: 13 },
  close: { paddingLeft: 4 },
  closeText: { fontSize: 14, color: colors.textMuted },
})
