/**
 * « Mes cours hors-ligne » : ce que l'appareil contient, la place occupée,
 * la mise à jour et le ménage.
 *
 * Sans cet écran, l'élève ne savait ni ce qu'il avait téléchargé, ni combien
 * de place cela prenait, ni comment en récupérer — un vrai problème sur un
 * téléphone d'entrée de gamme.
 */
import { useCallback, useEffect, useState } from 'react'
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, Alert, RefreshControl } from 'react-native'
import { colors, radius, cardShadow, fonts } from '../lib/theme'
import { useLevel } from '../hooks/useLevel'
import { listCachedEntries, cacheSize, clearCache, readCachedLesson, type CachedEntry } from '../lib/lessonCache'
import { syncAllForOffline, derniereSynchro, indexHorsLigne, type SyncProgress } from '../lib/offlineSync'
import { enAttente, viderLaFile } from '../lib/outbox'
import { BackButton } from '../components/BackButton'
import { SolarIcon } from '../icons/solar'
import { CognixLoader, LoaderDots } from '../components/CognixLoader'

interface ChapitreLocal { key: string; titre: string; taille: number; lecons: number }

function poids(octets: number): string {
  if (octets < 1024) return `${octets} o`
  if (octets < 1024 * 1024) return `${Math.round(octets / 1024)} Ko`
  return `${(octets / (1024 * 1024)).toFixed(1)} Mo`
}

function dateCourte(d: Date): string {
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' }) +
    ' à ' + d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

export default function HorsLigneScreen() {
  const { level, track } = useLevel()

  const [chargement, setChargement] = useState(true)
  const [chapitres, setChapitres] = useState<ChapitreLocal[]>([])
  const [taille, setTaille] = useState(0)
  const [derniere, setDerniere] = useState<Date | null>(null)
  const [enFile, setEnFile] = useState(0)
  const [synchro, setSynchro] = useState(false)
  const [avancement, setAvancement] = useState<SyncProgress | null>(null)

  const relire = useCallback(async () => {
    const entrees: CachedEntry[] = await listCachedEntries()
    const chapitresEnCache = entrees.filter((e) => e.key.startsWith('chapter:'))
    const tailleParId = new Map(chapitresEnCache.map((e) => [e.key.slice('chapter:'.length), e.size]))

    // L'index écrit par la synchronisation évite de rouvrir chaque fichier.
    const index = await indexHorsLigne()
    const depuisIndex = index.filter((f) => tailleParId.has(f.id))
    if (depuisIndex.length > 0) {
      const liste = depuisIndex
        .map((f) => ({ key: `chapter:${f.id}`, titre: f.titre, taille: tailleParId.get(f.id) ?? 0, lecons: f.lecons }))
        .sort((a, b) => a.titre.localeCompare(b.titre, 'fr'))
      setChapitres(liste)
      setTaille(await cacheSize())
      setDerniere(await derniereSynchro())
      setEnFile(await enAttente())
      setChargement(false)
      return
    }

    // Repli : cache constitué au fil des visites, sans index.
    const liste = await Promise.all(chapitresEnCache.map(async (e) => {
      let titre = 'Chapitre'
      let lecons = 0
      try {
        const brut = await readCachedLesson(e.key)
        if (brut) {
          const parsed = JSON.parse(brut) as { title?: string; lessons?: unknown[] }
          titre = parsed.title ?? titre
          lecons = parsed.lessons?.length ?? 0
        }
      } catch { /* entrée illisible : on l'affiche quand même, pour pouvoir la supprimer */ }
      return { key: e.key, titre, taille: e.size, lecons }
    }))
    liste.sort((a, b) => a.titre.localeCompare(b.titre, 'fr'))
    setChapitres(liste)
    setTaille(await cacheSize())
    setDerniere(await derniereSynchro())
    setEnFile(await enAttente())
    setChargement(false)
  }, [])

  useEffect(() => { relire() }, [relire])

  async function mettreAJour() {
    if (synchro) return
    if (!level) { Alert.alert('Niveau manquant', 'Définis d\'abord ton niveau d\'examen dans ton profil.'); return }
    setSynchro(true)
    setAvancement({ done: 0, total: 0, label: '' })
    try {
      const { synced, failed, aJour, retires } = await syncAllForOffline(level, track, setAvancement)
      const details = [
        synced > 0 ? `${synced} chapitre(s) téléchargé(s)` : null,
        aJour > 0 ? `${aJour} déjà à jour` : null,
        retires > 0 ? `${retires} retiré(s) du programme` : null,
        failed > 0 ? `${failed} en échec` : null,
      ].filter(Boolean).join(' · ')
      Alert.alert('Mise à jour terminée', details || 'Tout était déjà à jour.')
    } catch {
      Alert.alert('Erreur', 'La mise à jour a été interrompue. Vérifie ta connexion et réessaie.')
    } finally {
      setSynchro(false)
      setAvancement(null)
      relire()
    }
  }

  async function envoyerEnAttente() {
    const { envoyees, restantes } = await viderLaFile()
    Alert.alert(
      'Envoi',
      envoyees > 0
        ? `${envoyees} action(s) envoyée(s).${restantes > 0 ? ` ${restantes} encore en attente.` : ''}`
        : 'Rien n\'a pu être envoyé pour le moment. Réessaie une fois connecté.',
    )
    relire()
  }

  function toutSupprimer() {
    Alert.alert(
      'Tout supprimer ?',
      'Les cours et exercices téléchargés seront retirés de cet appareil. Tu pourras les retélécharger quand tu auras du réseau.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer', style: 'destructive',
          onPress: async () => { await clearCache(); relire() },
        },
      ],
    )
  }

  if (chargement) return <CognixLoader />

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BackButton />
      </View>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={false} onRefresh={relire} tintColor={colors.primary} />}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <View style={styles.heroIcon}><SolarIcon name="cloud" size={30} color="#fff" /></View>
          <Text style={styles.heroKicker}>HORS-LIGNE</Text>
          <Text style={styles.heroTitle}>Mes cours sans réseau</Text>
          <View style={styles.stats}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{chapitres.length}</Text>
              <Text style={styles.statLabel}>chapitre{chapitres.length > 1 ? 's' : ''}</Text>
            </View>
            <View style={styles.statSep} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>{poids(taille)}</Text>
              <Text style={styles.statLabel}>sur le téléphone</Text>
            </View>
          </View>
          <Text style={styles.heroSub}>
            Dernière mise à jour : {derniere ? dateCourte(derniere) : 'jamais'}
          </Text>
        </View>

        {enFile > 0 && (
          <TouchableOpacity style={styles.attente} onPress={envoyerEnAttente} activeOpacity={0.85}>
            <Text style={styles.attenteTitre}>{enFile} action{enFile > 1 ? 's' : ''} en attente d'envoi</Text>
            <Text style={styles.attenteTexte}>
              Tes réponses validées sans réseau partiront dès que tu seras connecté. Touche ici pour essayer maintenant.
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={[styles.bouton, synchro && styles.boutonOff]} onPress={mettreAJour} disabled={synchro} activeOpacity={0.85}>
          {synchro && <View style={{ marginRight: 8 }}><LoaderDots color={"#fff"} size={6} /></View>}
          <Text style={styles.boutonTexte}>
            {synchro
              ? avancement && avancement.total > 0 ? `Mise à jour… ${avancement.done}/${avancement.total}` : 'Préparation…'
              : 'Mettre à jour mes cours'}
          </Text>
        </TouchableOpacity>
        <Text style={styles.aide}>Seuls les chapitres modifiés depuis la dernière fois sont retéléchargés.</Text>

        {chapitres.length === 0 ? (
          <View style={styles.vide}>
            <Text style={styles.videTitre}>Aucun cours enregistré</Text>
            <Text style={styles.videTexte}>
              Touche « Mettre à jour mes cours » avec du réseau : tous les chapitres de ta classe seront gardés sur ce téléphone.
            </Text>
          </View>
        ) : (
          <>
            <Text style={styles.sectionTitre}>Sur ce téléphone</Text>
            {chapitres.map((c, i) => (
              <View key={c.key} style={styles.item}>
                <View style={styles.itemNum}><Text style={styles.itemNumText}>{i + 1}</Text></View>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text style={styles.itemTitre} numberOfLines={2}>{c.titre}</Text>
                  <Text style={styles.itemSous}>{c.lecons} leçon{c.lecons > 1 ? 's' : ''} · {poids(c.taille)}</Text>
                </View>
              </View>
            ))}

            <TouchableOpacity style={styles.supprimer} onPress={toutSupprimer}>
              <Text style={styles.supprimerTexte}>Tout supprimer de ce téléphone</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: 16, paddingTop: 52, paddingBottom: 10 },
  scroll: { paddingHorizontal: 16, paddingBottom: 48 },
  hero: { backgroundColor: colors.primary, borderRadius: 26, padding: 20, marginBottom: 16, ...cardShadow },
  heroIcon: { width: 52, height: 52, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  heroKicker: { color: '#ffffffcc', fontSize: 10, fontFamily: fonts.body, letterSpacing: 1.2 },
  heroTitle: { color: '#fff', fontSize: 22, fontFamily: fonts.headingBlack, marginTop: 2 },
  stats: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.14)', borderRadius: 18, paddingVertical: 12, marginTop: 16 },
  stat: { flex: 1, alignItems: 'center' },
  statSep: { width: 1, alignSelf: 'stretch', backgroundColor: 'rgba(255,255,255,0.25)' },
  statValue: { color: '#fff', fontSize: 20, fontFamily: fonts.headingBlack },
  statLabel: { color: '#ffffffcc', fontSize: 11, marginTop: 2 },
  heroSub: { color: '#ffffffd9', fontSize: 12, marginTop: 12 },
  attente: { backgroundColor: '#FFF8E6', borderRadius: radius.lg, padding: 14, marginBottom: 14, borderWidth: 1, borderColor: '#F2D48A' },
  attenteTitre: { fontFamily: fonts.body, fontSize: 14, color: '#5C4300' },
  attenteTexte: { fontSize: 12, color: '#5C4300', marginTop: 4, lineHeight: 17 },
  bouton: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: colors.primary, borderRadius: radius.lg, paddingVertical: 15, ...cardShadow },
  boutonOff: { opacity: 0.75 },
  boutonTexte: { color: colors.onPrimary, fontFamily: fonts.body, fontSize: 15 },
  aide: { fontSize: 12, color: colors.textMuted, textAlign: 'center', marginTop: 8, marginBottom: 22, paddingHorizontal: 10 },
  vide: { backgroundColor: colors.card, borderRadius: radius.lg, padding: 18, borderWidth: 1, borderColor: colors.cardBorder },
  videTitre: { fontSize: 15, fontFamily: fonts.heading, color: colors.text },
  videTexte: { fontSize: 13, color: colors.textMuted, marginTop: 6, lineHeight: 19 },
  sectionTitre: { fontFamily: fonts.headingBlack, fontSize: 17, color: colors.text, marginBottom: 10 },
  item: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.card, borderRadius: radius.lg, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: colors.cardBorder },
  itemNum: { width: 36, height: 36, borderRadius: 12, backgroundColor: colors.primaryTint, alignItems: 'center', justifyContent: 'center' },
  itemNumText: { color: colors.primary, fontFamily: fonts.heading, fontSize: 14 },
  itemTitre: { fontSize: 14, color: colors.text, fontFamily: fonts.body },
  itemSous: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  supprimer: { marginTop: 14, paddingVertical: 14, alignItems: 'center', borderRadius: radius.lg, borderWidth: 1, borderColor: '#F3C4C3', backgroundColor: '#FDF1F1' },
  supprimerTexte: { color: colors.red, fontSize: 14, fontFamily: fonts.body },
})
