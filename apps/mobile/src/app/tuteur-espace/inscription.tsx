import { useEffect, useState } from 'react'
import { ScrollView, View, Text, TouchableOpacity, TextInput, StyleSheet, ActivityIndicator, Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { supabase } from '../../lib/supabase'
import { API_URL } from '../../lib/config'
import { colors, radius, cardShadow, fonts, subjectIcon } from '../../lib/theme'
import { pickAndUpload } from '../../lib/uploads'

interface Subject { id: string; name: string }
type Doc = { path: string; uri: string } | null

async function token() {
  const { data: { session } } = await supabase.auth.getSession()
  return session?.access_token
}

export default function InscriptionTuteur() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [picked, setPicked] = useState<Set<string>>(new Set())
  const [bio, setBio] = useState('')
  const [idDoc, setIdDoc] = useState<Doc>(null)
  const [bacDoc, setBacDoc] = useState<Doc>(null)
  const [busy, setBusy] = useState<'id' | 'bac' | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    (async () => {
      const { data: subs } = await supabase.from('subjects').select('id, name').order('name')
      // Dédoublonne par nom (une matière peut exister sur plusieurs niveaux).
      const seen = new Set<string>()
      const uniq = ((subs ?? []) as Subject[]).filter((s) => (seen.has(s.name) ? false : (seen.add(s.name), true)))
      setSubjects(uniq)
      setLoading(false)
    })()
  }, [])

  async function upload(which: 'id' | 'bac') {
    setBusy(which)
    try {
      const r = await pickAndUpload('tutor-documents', 'library')
      if (r) (which === 'id' ? setIdDoc : setBacDoc)(r)
    } catch (e: any) {
      Alert.alert('Oups', e?.message ?? 'Téléversement impossible.')
    } finally {
      setBusy(null)
    }
  }

  async function submit() {
    if (picked.size === 0 || !idDoc || !bacDoc || submitting) return
    setSubmitting(true)
    const t = await token()
    const res = await fetch(`${API_URL}/api/tutor/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${t}` },
      body: JSON.stringify({ bio: bio || undefined, subject_ids: [...picked], id_doc_url: idDoc.path, bac_doc_url: bacDoc.path }),
    })
    const json = await res.json().catch(() => ({}))
    setSubmitting(false)
    if (!res.ok) {
      Alert.alert('Erreur', json.error?.code === 'ALREADY_TUTOR' ? 'Tu as déjà un profil tuteur.' : (json.error?.message ?? 'Inscription impossible.'))
      return
    }
    Alert.alert('Dossier envoyé ✅', 'Ton compte tuteur sera validé sous 24h.', [{ text: 'OK', onPress: () => router.replace('/tuteur-espace') }])
  }

  if (loading) return <ActivityIndicator style={{ flex: 1, backgroundColor: colors.background }} color={colors.primary} />
  const ready = picked.size > 0 && idDoc && bacDoc

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Text style={styles.back}>←</Text></TouchableOpacity>
        <Text style={styles.title}>Devenir tuteur</Text>
        <View style={{ width: 20 }} />
      </View>

      <Text style={styles.label}>Matières que tu peux corriger</Text>
      <View style={styles.chips}>
        {subjects.map((s) => {
          const on = picked.has(s.id)
          return (
            <TouchableOpacity key={s.id} style={[styles.chip, on && styles.chipOn]} onPress={() => setPicked((p) => { const n = new Set(p); n.has(s.id) ? n.delete(s.id) : n.add(s.id); return n })}>
              <Text style={[styles.chipText, on && styles.chipTextOn]}>{subjectIcon(s.name)} {s.name}</Text>
            </TouchableOpacity>
          )
        })}
      </View>

      <Text style={styles.label}>Présentation (optionnel)</Text>
      <TextInput style={styles.input} placeholder="Ex : Étudiant en L2 Maths, j’aide les élèves de Terminale…" placeholderTextColor={colors.textMuted} value={bio} onChangeText={setBio} multiline maxLength={500} />

      <Text style={styles.label}>Pièce d’identité (CNI)</Text>
      <DocSlot doc={idDoc} busy={busy === 'id'} onPress={() => upload('id')} label="Ajouter ma CNI" />

      <Text style={styles.label}>Diplôme ou attestation BAC</Text>
      <DocSlot doc={bacDoc} busy={busy === 'bac'} onPress={() => upload('bac')} label="Ajouter mon diplôme" />

      <TouchableOpacity style={[styles.submit, (!ready || submitting) && { opacity: 0.5 }]} onPress={submit} disabled={!ready || submitting}>
        <Text style={styles.submitText}>{submitting ? 'Envoi…' : 'Envoyer mon dossier'}</Text>
      </TouchableOpacity>
      <Text style={styles.footHint}>Tes documents sont privés et visibles uniquement par l’équipe Cognix pour la validation.</Text>
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
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 },
  back: { fontSize: 24, color: colors.text },
  title: { fontSize: 20, fontFamily: fonts.headingBlack, color: colors.text },
  label: { fontSize: 14, fontWeight: '800', color: colors.text, marginTop: 20, marginBottom: 10 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: radius.full, borderWidth: 1, borderColor: colors.cardBorder, backgroundColor: colors.card },
  chipOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: 13, color: colors.textMuted, fontWeight: '700' },
  chipTextOn: { color: '#fff' },
  input: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.cardBorder, borderRadius: radius.md, padding: 14, fontSize: 14, color: colors.text, minHeight: 76, textAlignVertical: 'top' },
  doc: { backgroundColor: colors.card, borderWidth: 1.5, borderColor: colors.cardBorder, borderStyle: 'dashed', borderRadius: radius.lg, paddingVertical: 20, alignItems: 'center', justifyContent: 'center' },
  docOk: { borderColor: '#0B8A46', borderStyle: 'solid', backgroundColor: '#F0FBF5' },
  docText: { fontSize: 14, color: colors.textMuted, fontWeight: '700' },
  submit: { backgroundColor: colors.primary, borderRadius: radius.lg, paddingVertical: 16, alignItems: 'center', marginTop: 28, ...cardShadow },
  submitText: { color: '#fff', fontSize: 15, fontWeight: '800' },
  footHint: { fontSize: 11, color: colors.textMuted, textAlign: 'center', marginTop: 14, lineHeight: 16, paddingHorizontal: 10 },
})
