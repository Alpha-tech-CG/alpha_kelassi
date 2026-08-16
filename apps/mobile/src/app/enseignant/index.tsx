import { useState, useCallback } from 'react'
import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native'
import { useRouter, useFocusEffect } from 'expo-router'
import { supabase } from '../../lib/supabase'
import { API_URL } from '../../lib/config'
import { colors, radius, cardShadow, fonts } from '../../lib/theme'
import { pickAndUpload } from '../../lib/uploads'

type Doc = { path: string; uri: string } | null
interface Profile { user_id: string; is_verified: boolean; school: string | null }

async function token() {
  const { data: { session } } = await supabase.auth.getSession()
  return session?.access_token
}

export default function EnseignantScreen() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [school, setSchool] = useState('')
  const [idDoc, setIdDoc] = useState<Doc>(null)
  const [cert, setCert] = useState<Doc>(null)
  const [busy, setBusy] = useState<'id' | 'cert' | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const load = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setLoading(false); return }
    const { data } = await supabase.from('teacher_profiles').select('user_id, is_verified, school').eq('user_id', user.id).maybeSingle()
    setProfile((data ?? null) as Profile | null)
    setLoading(false)
  }, [])
  useFocusEffect(useCallback(() => { load() }, [load]))

  async function upload(which: 'id' | 'cert') {
    setBusy(which)
    try {
      const r = await pickAndUpload('teacher-documents', 'library')
      if (r) (which === 'id' ? setIdDoc : setCert)(r)
    } catch (e: any) { Alert.alert('Oups', e?.message ?? 'Téléversement impossible.') }
    finally { setBusy(null) }
  }

  async function submit() {
    if (school.trim().length < 2 || !idDoc || !cert || submitting) return
    setSubmitting(true)
    const t = await token()
    const res = await fetch(`${API_URL}/api/teacher/register`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${t}` },
      body: JSON.stringify({ school: school.trim(), id_doc_url: idDoc.path, teaching_certificate_url: cert.path }),
    })
    const json = await res.json().catch(() => ({}))
    setSubmitting(false)
    if (!res.ok) return Alert.alert('Erreur', json.error?.message ?? 'Inscription impossible.')
    Alert.alert('Dossier envoyé ✅', 'Ton compte enseignant sera validé sous 48h.', [{ text: 'OK', onPress: load }])
  }

  if (loading) return <ActivityIndicator style={{ flex: 1, backgroundColor: colors.background }} color={colors.primary} />

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={12}><Text style={styles.back}>←</Text></TouchableOpacity>
        <Text style={styles.title}>Espace enseignant</Text>
      </View>

      {profile ? (
        <View style={styles.hero}>
          <Text style={styles.heroEmoji}>{profile.is_verified ? '✅' : '⏳'}</Text>
          <Text style={styles.heroTitle}>{profile.is_verified ? 'Compte enseignant validé' : 'En attente de validation'}</Text>
          <Text style={styles.heroSub}>
            {profile.is_verified
              ? 'Tu peux animer des groupes officiels, publier des ressources et lancer des quiz pour tes élèves.'
              : 'Ton dossier est en cours de vérification par l’équipe Cognix (sous 48h).'}
          </Text>
        </View>
      ) : (
        <>
          <Text style={styles.intro}>Enseignant ? Crée ton compte vérifié pour animer des groupes officiels et suivre tes élèves.</Text>

          <Text style={styles.label}>Établissement</Text>
          <TextInput style={styles.input} placeholder="Ex : Lycée Savorgnan de Brazza" placeholderTextColor={colors.textMuted} value={school} onChangeText={setSchool} maxLength={160} />

          <Text style={styles.label}>Pièce d’identité (CNI)</Text>
          <DocSlot doc={idDoc} busy={busy === 'id'} onPress={() => upload('id')} label="Ajouter ma CNI" />

          <Text style={styles.label}>Justificatif d’enseignement</Text>
          <DocSlot doc={cert} busy={busy === 'cert'} onPress={() => upload('cert')} label="Carte pro / attestation école" />

          <TouchableOpacity style={[styles.submit, (school.trim().length < 2 || !idDoc || !cert || submitting) && { opacity: 0.5 }]} onPress={submit} disabled={school.trim().length < 2 || !idDoc || !cert || submitting}>
            <Text style={styles.submitText}>{submitting ? 'Envoi…' : 'Envoyer mon dossier'}</Text>
          </TouchableOpacity>
          <Text style={styles.footHint}>Tes documents sont privés, visibles uniquement par l’équipe Cognix.</Text>
        </>
      )}
    </ScrollView>
  )
}

function DocSlot({ doc, busy, onPress, label }: { doc: Doc; busy: boolean; onPress: () => void; label: string }) {
  return (
    <TouchableOpacity style={[styles.doc, doc && styles.docOk]} onPress={onPress} disabled={busy} activeOpacity={0.85}>
      {busy ? <ActivityIndicator color={colors.primary} /> : (
        <Text style={[styles.docText, doc && { color: '#0B8A46' }]}>{doc ? '✓ Document ajouté — modifier' : `＋ ${label}`}</Text>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingTop: 56, paddingBottom: 60 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  back: { fontSize: 24, color: colors.text },
  title: { fontSize: 20, fontFamily: fonts.headingBlack, color: colors.text },
  hero: { backgroundColor: colors.card, borderRadius: radius.xl, padding: 26, alignItems: 'center', borderWidth: 1, borderColor: colors.cardBorder, marginTop: 20, ...cardShadow },
  heroEmoji: { fontSize: 52, marginBottom: 12 },
  heroTitle: { fontSize: 19, fontWeight: '900', color: colors.text, marginBottom: 8, textAlign: 'center' },
  heroSub: { fontSize: 13, color: colors.textMuted, textAlign: 'center', lineHeight: 20 },
  intro: { fontSize: 14, color: colors.textMuted, lineHeight: 20, marginBottom: 8 },
  label: { fontSize: 14, fontWeight: '800', color: colors.text, marginTop: 18, marginBottom: 10 },
  input: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.cardBorder, borderRadius: radius.md, paddingHorizontal: 12, paddingVertical: 12, fontSize: 14, color: colors.text },
  doc: { backgroundColor: colors.card, borderWidth: 1.5, borderColor: colors.cardBorder, borderStyle: 'dashed', borderRadius: radius.lg, paddingVertical: 20, alignItems: 'center', justifyContent: 'center' },
  docOk: { borderColor: '#0B8A46', borderStyle: 'solid', backgroundColor: '#F0FBF5' },
  docText: { fontSize: 14, color: colors.textMuted, fontWeight: '700' },
  submit: { backgroundColor: colors.primary, borderRadius: radius.lg, paddingVertical: 16, alignItems: 'center', marginTop: 28, ...cardShadow },
  submitText: { color: '#fff', fontSize: 15, fontWeight: '800' },
  footHint: { fontSize: 11, color: colors.textMuted, textAlign: 'center', marginTop: 14, lineHeight: 16, paddingHorizontal: 10 },
})
