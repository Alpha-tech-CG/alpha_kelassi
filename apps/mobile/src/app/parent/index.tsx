import { useState, useCallback } from 'react'
import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native'
import { useRouter, useFocusEffect } from 'expo-router'
import { supabase } from '../../lib/supabase'
import { colors, radius, cardShadow, fonts } from '../../lib/theme'

interface Child { id: string; name: string }

export default function ParentScreen() {
  const router = useRouter()
  const [children, setChildren] = useState<Child[]>([])
  const [loading, setLoading] = useState(true)
  const [code, setCode] = useState('')
  const [linking, setLinking] = useState(false)

  const load = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setLoading(false); return }
    const { data: links } = await supabase.from('parent_links').select('child_id').eq('parent_id', user.id)
    const ids = (links ?? []).map((l: any) => l.child_id)
    if (ids.length) {
      const { data: profs } = await supabase.from('public_profiles').select('id, full_name').in('id', ids)
      setChildren(((profs ?? []) as { id: string; full_name: string | null }[]).map((p) => ({ id: p.id, name: p.full_name ?? 'Enfant' })))
    } else setChildren([])
    setLoading(false)
  }, [])
  useFocusEffect(useCallback(() => { load() }, [load]))

  async function link() {
    if (code.trim().length < 4 || linking) return
    setLinking(true)
    const { data, error } = await supabase.rpc('redeem_parent_code', { p_code: code.trim() })
    setLinking(false)
    if (error) {
      const msg = error.message.includes('CODE_INVALID') ? 'Code invalide ou expiré.'
        : error.message.includes('CODE_SELF') ? 'Tu ne peux pas te lier à toi-même.' : 'Liaison impossible.'
      return Alert.alert('Oups', msg)
    }
    setCode('')
    await load()
    Alert.alert('Compte lié ✅', `Tu suis maintenant ${(data as { child_name?: string })?.child_name ?? 'cet élève'}.`)
  }

  if (loading) return <ActivityIndicator style={{ flex: 1, backgroundColor: colors.background }} color={colors.primary} />

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={12}><Text style={styles.back}>←</Text></TouchableOpacity>
        <Text style={styles.title}>Espace parent</Text>
      </View>

      <View style={styles.linkCard}>
        <Text style={styles.linkTitle}>Lier le compte de mon enfant</Text>
        <Text style={styles.linkSub}>Demande-lui de générer un code dans son app (Profil → Inviter un parent).</Text>
        <View style={styles.linkRow}>
          <TextInput style={styles.input} placeholder="Code à 6 caractères" placeholderTextColor={colors.textMuted}
            value={code} onChangeText={(v) => setCode(v.toUpperCase())} autoCapitalize="characters" maxLength={6} />
          <TouchableOpacity style={[styles.linkBtn, (code.trim().length < 4 || linking) && { opacity: 0.5 }]} onPress={link} disabled={code.trim().length < 4 || linking}>
            <Text style={styles.linkBtnText}>{linking ? '…' : 'Lier'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.section}>Mes enfants</Text>
      {children.length === 0 ? (
        <Text style={styles.empty}>Aucun enfant lié. Saisis un code ci-dessus pour commencer.</Text>
      ) : children.map((c) => (
        <TouchableOpacity key={c.id} style={styles.childCard} onPress={() => router.push(`/parent/${c.id}`)}>
          <View style={styles.avatar}><Text style={styles.avatarText}>{c.name[0]?.toUpperCase()}</Text></View>
          <Text style={styles.childName}>{c.name}</Text>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, paddingTop: 56, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  back: { fontSize: 24, color: colors.text },
  title: { fontSize: 20, fontFamily: fonts.headingBlack, color: colors.text },
  linkCard: { backgroundColor: colors.card, borderRadius: radius.lg, padding: 16, borderWidth: 1, borderColor: colors.cardBorder, ...cardShadow },
  linkTitle: { fontSize: 15, fontWeight: '800', color: colors.text },
  linkSub: { fontSize: 12, color: colors.textMuted, marginTop: 4, marginBottom: 12, lineHeight: 17 },
  linkRow: { flexDirection: 'row', gap: 8 },
  input: { flex: 1, backgroundColor: colors.background, borderWidth: 1, borderColor: colors.cardBorder, borderRadius: radius.md, paddingHorizontal: 14, paddingVertical: 11, fontSize: 16, color: colors.text, fontWeight: '800', letterSpacing: 3 },
  linkBtn: { backgroundColor: colors.primary, borderRadius: radius.md, paddingHorizontal: 22, alignItems: 'center', justifyContent: 'center' },
  linkBtnText: { color: '#fff', fontWeight: '800', fontSize: 15 },
  section: { fontSize: 16, fontWeight: '900', color: colors.text, marginTop: 24, marginBottom: 12 },
  empty: { fontSize: 13, color: colors.textMuted },
  childCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.card, borderRadius: radius.lg, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: colors.cardBorder, ...cardShadow },
  avatar: { width: 46, height: 46, borderRadius: 15, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontSize: 18, fontWeight: '900' },
  childName: { flex: 1, fontSize: 15, fontWeight: '800', color: colors.text },
  chevron: { fontSize: 22, color: colors.primary },
})
