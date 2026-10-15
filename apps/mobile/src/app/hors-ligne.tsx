/**
 * « Mes cours hors-ligne » : ce que l'appareil contient, la place occupée,
 * la mise à jour et le ménage.
 *
 * Sans cet écran, l'élève ne savait ni ce qu'il avait téléchargé, ni combien
 * de place cela prenait, ni comment en récupérer — un vrai problème sur un
 * téléphone d'entrée de gamme.
 */
import { useCallback, useEffect, useState } from 'react'
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, RefreshControl } from 'react-native'
import { useRouter } from 'expo-router'
import { colors, radius, cardShadow, fonts } from '../lib/theme'
import { useLevel } from '../hooks/useLevel'
import { listCachedEntries, cacheSize, clearCache, readCachedLesson, type CachedEntry } from '../lib/lessonCache'
import { syncAllForOffline, derniereSynchro, type SyncProgress } from '../lib/offlineSync'
import { enAttente, viderLaFile } from '../lib/outbox'

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
  const router = useRouter()
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

  if (chargement) return <ActivityIndicator style={{ flex: 1, backgroundColor: colors.background }} color={colors.primary} />

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ padding: 16, paddingBottom: 48 }}
      refreshControl={<RefreshControl refreshing={false} onRefresh={relire} />}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={12}><Text style={styles.back}>←</Text></TouchableOpacity>
        <Text style={styles.titre}>Mes cours hors-ligne</Text>
      </View>

      <View style={styles.carte}>
        <Text style={styles.gros}>{chapitres.length}</Text>
        <Text style={styles.sous}>chapitre{chapitres.length > 1 ? 's' : ''} disponible{chapitres.length > 1 ? 's' : ''} sans réseau</Text>
        <Text style={styles.ligne}>Place occupée : <Text style={styles.fort}>{poids(taille)}</Text></Text>
        <Text style={styles.ligne}>
          Dernière mise à jour : <Text style={styles.fort}>{derniere ? dateCourte(derniere) : 'jamais'}</Text>
        </Text>
      </View>

      {enFile > 0 && (
        <TouchableOpacity style={[styles.carte, styles.attente]} onPress={envoyerEnAttente}>
          <Text style={styles.attenteTitre}>⏳ {enFile} action(s) en attente d'envoi</Text>
          <Text style={styles.sous}>Tes réponses validées sans réseau partiront dès que tu seras connecté. Touche ici pour essayer maintenant.</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={[styles.bouton, synchro && styles.boutonOff]} onPress={mettreAJour} disabled={synchro}>
        {synchro
          ? <Text style={styles.boutonTexte}>
              {avancement && avancement.total > 0 ? `Mise à jour… ${avancement.done}/${avancement.total}` : 'Préparation…'}
            </Text>
          : <Text style={styles.boutonTexte}>Mettre à jour mes cours</Text>}
      </TouchableOpacity>
      <Text style={styles.aide}>Seuls les chapitres modifiés depuis la dernière fois sont retéléchargés.</Text>

      {chapitres.length > 0 && (
        <>
          <Text style={styles.sectionTitre}>Sur cet appareil</Text>
          {chapitres.map((c) => (
            <View key={c.key} style={styles.item}>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemTitre} numberOfLines={2}>{c.titre}</Text>
                <Text style={styles.sous}>{c.lecons} leçon{c.lecons > 1 ? 's' : ''} · {poids(c.taille)}</Text>
              </View>
            </View>
          ))}

          <TouchableOpacity style={styles.supprimer} onPress={toutSupprimer}>
            <Text style={styles.supprimerTexte}>Tout supprimer de cet appareil</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  back: { fontSize: 24, color: colors.text },
  titre: { fontFamily: fonts.heading, fontSize: 20, color: colors.text, flex: 1 },
  carte: { backgroundColor: colors.card, borderRadius: radius.lg, padding: 16, marginBottom: 12, ...cardShadow },
  gros: { fontFamily: fonts.heading, fontSize: 32, color: colors.primary },
  sous: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
  ligne: { fontSize: 14, color: colors.text, marginTop: 8 },
  fort: { fontFamily: fonts.body },
  attente: { borderWidth: 1, borderColor: colors.cardBorder },
  attenteTitre: { fontFamily: fonts.body, fontSize: 15, color: colors.text },
  bouton: { backgroundColor: colors.primary, borderRadius: radius.lg, paddingVertical: 14, alignItems: 'center', marginTop: 4 },
  boutonOff: { opacity: 0.7 },
  boutonTexte: { color: colors.onPrimary, fontFamily: fonts.body, fontSize: 15 },
  aide: { fontSize: 12, color: colors.textMuted, textAlign: 'center', marginTop: 8, marginBottom: 20 },
  sectionTitre: { fontFamily: fonts.heading, fontSize: 16, color: colors.text, marginBottom: 8 },
  item: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: radius.md, padding: 12, marginBottom: 8 },
  itemTitre: { fontSize: 14, color: colors.text, fontFamily: fonts.body },
  supprimer: { marginTop: 16, paddingVertical: 12, alignItems: 'center' },
  supprimerTexte: { color: colors.red, fontSize: 14, fontFamily: fonts.body },
})
