import { useState, useCallback } from 'react'
import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native'
import { useRouter, useFocusEffect } from 'expo-router'
import { supabase } from '../../lib/supabase'
import { colors, radius, cardShadow, fonts } from '../../lib/theme'

interface Group { id: string; name: string; type: string }
const TYPE_LABEL: Record<string, string> = { classe: 'Classe', matiere: 'Matière', officiel: 'Officiel', prive: 'Privé' }
const TYPES = ['matiere', 'classe', 'prive'] as const

export default function GroupesScreen() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [mine, setMine] = useState<Group[]>([])
  const [suggestions, setSuggestions] = useState<Group[]>([])
  const [creating, setCreating] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [type, setType] = useState<string>('matiere')

  const load = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setLoading(false); return }
    const { data: memberships } = await supabase.from('group_members')
      .select('group_id, study_groups(id, name, type)').eq('user_id', user.id)
    const myGroups = (memberships ?? []).map((m: any) => m.study_groups).filter(Boolean) as Group[]
    setMine(myGroups)
    const joinedIds = new Set(myGroups.map((g) => g.id))
    const { data: all } = await supabase.from('study_groups').select('id, name, type').order('created_at', { ascending: false }).limit(30)
    setSuggestions(((all ?? []) as Group[]).filter((g) => !joinedIds.has(g.id)))
    setLoading(false)
  }, [])
  useFocusEffect(useCallback(() => { load() }, [load]))

  async function create() {
    if (name.trim().length < 3 || creating) return
    setCreating(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setCreating(false); return }
    const { data: g, error } = await supabase.from('study_groups')
      .insert({ name: name.trim(), type, created_by: user.id }).select('id').single()
    if (error || !g) { setCreating(false); return Alert.alert('Erreur', error?.message ?? 'Création impossible.') }
    await supabase.from('group_members').insert({ group_id: (g as { id: string }).id, user_id: user.id, role: 'admin' })
    setCreating(false); setName(''); setShowForm(false)
    router.push(`/groupes/${(g as { id: string }).id}`)
  }

  async function join(g: Group) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('group_members').insert({ group_id: g.id, user_id: user.id, role: 'member' })
    router.push(`/groupes/${g.id}`)
  }

  if (loading) return <ActivityIndicator style={{ flex: 1, backgroundColor: colors.background }} color={colors.primary} />

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={12}><Text style={styles.back}>←</Text></TouchableOpacity>
        <Text style={styles.title}>Groupes de révision</Text>
        <TouchableOpacity onPress={() => setShowForm((s) => !s)}><Text style={styles.plus}>{showForm ? '×' : '＋'}</Text></TouchableOpacity>
      </View>

      {showForm && (
        <View style={styles.form}>
          <TextInput style={styles.input} placeholder="Nom du groupe (ex : Maths Tle C — Brazza)" placeholderTextColor={colors.textMuted} value={name} onChangeText={setName} maxLength={80} />
          <View style={styles.typeRow}>
            {TYPES.map((t) => (
              <TouchableOpacity key={t} style={[styles.typeChip, type === t && styles.typeChipOn]} onPress={() => setType(t)}>
                <Text style={[styles.typeChipText, type === t && styles.typeChipTextOn]}>{TYPE_LABEL[t]}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={[styles.createBtn, (name.trim().length < 3 || creating) && { opacity: 0.5 }]} onPress={create} disabled={name.trim().length < 3 || creating}>
            <Text style={styles.createText}>{creating ? 'Création…' : 'Créer le groupe'}</Text>
          </TouchableOpacity>
        </View>
      )}

      <Text style={styles.section}>Mes groupes</Text>
      {mine.length === 0 ? (
        <Text style={styles.empty}>Tu n'as pas encore rejoint de groupe.</Text>
      ) : mine.map((g) => (
        <TouchableOpacity key={g.id} style={styles.card} onPress={() => router.push(`/groupes/${g.id}`)}>
          <View style={styles.avatar}><Text style={styles.avatarText}>{g.name[0]?.toUpperCase()}</Text></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardName} numberOfLines={1}>{g.name}</Text>
            <Text style={styles.cardType}>{TYPE_LABEL[g.type] ?? g.type}</Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
      ))}

      <Text style={styles.section}>Découvrir</Text>
      {suggestions.length === 0 ? (
        <Text style={styles.empty}>Aucun autre groupe pour l'instant. Crée le premier !</Text>
      ) : suggestions.map((g) => (
        <View key={g.id} style={styles.card}>
          <View style={[styles.avatar, { backgroundColor: colors.primaryTint }]}><Text style={[styles.avatarText, { color: colors.primary }]}>{g.name[0]?.toUpperCase()}</Text></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardName} numberOfLines={1}>{g.name}</Text>
            <Text style={styles.cardType}>{TYPE_LABEL[g.type] ?? g.type}</Text>
          </View>
          <TouchableOpacity style={styles.joinBtn} onPress={() => join(g)}><Text style={styles.joinText}>Rejoindre</Text></TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, paddingTop: 56, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  back: { fontSize: 24, color: colors.text },
  title: { fontSize: 20, fontFamily: fonts.headingBlack, color: colors.text },
  plus: { fontSize: 26, color: colors.primary, fontWeight: '800' },
  form: { backgroundColor: colors.card, borderRadius: radius.lg, padding: 16, marginBottom: 18, borderWidth: 1, borderColor: colors.cardBorder, ...cardShadow },
  input: { backgroundColor: colors.background, borderWidth: 1, borderColor: colors.cardBorder, borderRadius: radius.md, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, color: colors.text, marginBottom: 12 },
  typeRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  typeChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.full, borderWidth: 1, borderColor: colors.cardBorder },
  typeChipOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  typeChipText: { fontSize: 13, color: colors.textMuted, fontWeight: '700' },
  typeChipTextOn: { color: '#fff' },
  createBtn: { backgroundColor: colors.primary, borderRadius: radius.md, paddingVertical: 13, alignItems: 'center' },
  createText: { color: '#fff', fontWeight: '800', fontSize: 15 },
  section: { fontSize: 16, fontWeight: '900', color: colors.text, marginTop: 16, marginBottom: 10 },
  empty: { fontSize: 13, color: colors.textMuted, marginBottom: 6 },
  card: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.card, borderRadius: radius.lg, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: colors.cardBorder, ...cardShadow },
  avatar: { width: 46, height: 46, borderRadius: 15, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontSize: 18, fontWeight: '900' },
  cardName: { fontSize: 15, fontWeight: '800', color: colors.text },
  cardType: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  chevron: { fontSize: 22, color: colors.primary },
  joinBtn: { backgroundColor: colors.primaryTint, borderRadius: radius.full, paddingHorizontal: 16, paddingVertical: 8 },
  joinText: { color: colors.primary, fontWeight: '800', fontSize: 13 },
})
