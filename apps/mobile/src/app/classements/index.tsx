import { useEffect, useState, useCallback } from 'react'
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator, ScrollView } from 'react-native'
import { useRouter } from 'expo-router'
import { supabase } from '../../lib/supabase'
import { colors, radius, cardShadow, fonts } from '../../lib/theme'

interface Row { rank: number; user_id: string; name: string; xp: number; is_me: boolean }
interface Group { id: string; name: string }
type Tab = 'national' | 'groupe'

const medal = (r: number) => (r === 1 ? '🥇' : r === 2 ? '🥈' : r === 3 ? '🥉' : `${r}`)

export default function ClassementsScreen() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('national')
  const [loading, setLoading] = useState(true)
  const [rows, setRows] = useState<Row[]>([])
  const [myRank, setMyRank] = useState<{ rank: number; total: number; xp: number } | null>(null)
  const [groups, setGroups] = useState<Group[]>([])
  const [groupId, setGroupId] = useState<string | null>(null)

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: gm } = await supabase.from('group_members').select('study_groups(id, name)').eq('user_id', user.id)
        const gs = (gm ?? []).map((m: any) => m.study_groups).filter(Boolean) as Group[]
        setGroups(gs)
        if (gs[0]) setGroupId(gs[0].id)
      }
    })()
  }, [])

  const load = useCallback(async () => {
    setLoading(true)
    if (tab === 'national') {
      const [{ data: lb }, { data: mine }] = await Promise.all([
        supabase.rpc('leaderboard_national', { p_limit: 50 }),
        supabase.rpc('my_rank_national'),
      ])
      setRows((lb ?? []) as Row[])
      const m = Array.isArray(mine) ? mine[0] : mine
      setMyRank(m ? { rank: Number(m.rank), total: Number(m.total), xp: m.xp } : null)
    } else {
      if (!groupId) { setRows([]); setMyRank(null); setLoading(false); return }
      const { data: lb } = await supabase.rpc('leaderboard_group', { p_group_id: groupId, p_limit: 50 })
      setRows((lb ?? []) as Row[])
      setMyRank(null)
    }
    setLoading(false)
  }, [tab, groupId])
  useEffect(() => { load() }, [load])

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={12}><Text style={styles.back}>←</Text></TouchableOpacity>
        <Text style={styles.title}>Classements</Text>
        <View style={{ width: 20 }} />
      </View>

      <View style={styles.tabs}>
        {(['national', 'groupe'] as Tab[]).map((t) => (
          <TouchableOpacity key={t} style={[styles.tab, tab === t && styles.tabOn]} onPress={() => setTab(t)}>
            <Text style={[styles.tabText, tab === t && styles.tabTextOn]}>{t === 'national' ? '🌍 National' : '👥 Groupe'}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {tab === 'groupe' && groups.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.groupScroll} contentContainerStyle={styles.groupChips}>
          {groups.map((g) => (
            <TouchableOpacity key={g.id} style={[styles.gChip, groupId === g.id && styles.gChipOn]} onPress={() => setGroupId(g.id)}>
              <Text style={[styles.gChipText, groupId === g.id && styles.gChipTextOn]} numberOfLines={1}>{g.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {tab === 'national' && myRank && (
        <View style={styles.myRankCard}>
          <Text style={styles.myRankText}>Ton rang : <Text style={styles.myRankStrong}>#{myRank.rank}</Text> / {myRank.total} · {myRank.xp.toLocaleString('fr-FR')} XP</Text>
        </View>
      )}

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={colors.primary} />
      ) : (
        <FlatList
          data={rows}
          keyExtractor={(r) => r.user_id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.empty}>{tab === 'groupe' && groups.length === 0 ? 'Rejoins un groupe pour voir son classement.' : 'Pas encore de classement. Gagne du XP en révisant !'}</Text>}
          renderItem={({ item }) => (
            <View style={[styles.row, item.is_me && styles.rowMe]}>
              <Text style={[styles.rank, item.rank <= 3 && styles.rankTop]}>{medal(item.rank)}</Text>
              <Text style={[styles.name, item.is_me && styles.nameMe]} numberOfLines={1}>{item.name}{item.is_me ? ' (toi)' : ''}</Text>
              <Text style={styles.xp}>{item.xp.toLocaleString('fr-FR')} XP</Text>
            </View>
          )}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 56, paddingHorizontal: 16, paddingBottom: 12 },
  back: { fontSize: 24, color: colors.text },
  title: { fontSize: 20, fontFamily: fonts.headingBlack, color: colors.text },
  tabs: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, marginBottom: 10 },
  tab: { flex: 1, paddingVertical: 10, borderRadius: radius.md, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.cardBorder, alignItems: 'center' },
  tabOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  tabText: { fontSize: 14, fontWeight: '800', color: colors.textMuted },
  tabTextOn: { color: '#fff' },
  groupScroll: { maxHeight: 44, marginBottom: 6 },
  groupChips: { paddingHorizontal: 16, gap: 8 },
  gChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.full, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.cardBorder, maxWidth: 200 },
  gChipOn: { backgroundColor: colors.primaryTint, borderColor: colors.primary },
  gChipText: { fontSize: 13, fontWeight: '700', color: colors.textMuted },
  gChipTextOn: { color: colors.primary },
  myRankCard: { marginHorizontal: 16, marginBottom: 8, backgroundColor: colors.primaryTint, borderRadius: radius.md, padding: 12, alignItems: 'center' },
  myRankText: { fontSize: 13, color: colors.text, fontWeight: '600' },
  myRankStrong: { color: colors.primary, fontWeight: '900' },
  list: { padding: 16, paddingTop: 4, gap: 8 },
  empty: { textAlign: 'center', color: colors.textMuted, marginTop: 40, fontSize: 13, paddingHorizontal: 30 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.card, borderRadius: radius.md, padding: 14, borderWidth: 1, borderColor: colors.cardBorder },
  rowMe: { borderColor: colors.primary, backgroundColor: colors.primaryTint },
  rank: { width: 34, fontSize: 15, fontWeight: '900', color: colors.textMuted, textAlign: 'center' },
  rankTop: { fontSize: 20 },
  name: { flex: 1, fontSize: 15, fontWeight: '700', color: colors.text },
  nameMe: { color: colors.primary, fontWeight: '900' },
  xp: { fontSize: 13, fontWeight: '800', color: colors.primary },
})
