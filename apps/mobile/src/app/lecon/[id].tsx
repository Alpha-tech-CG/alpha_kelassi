import { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import { WebView } from 'react-native-webview'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { supabase } from '../../lib/supabase'
import { colors, radius } from '../../lib/theme'

type Block =
  | { type: 'subtitle'; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'image'; url: string; caption?: string }
  | { type: 'formula'; latex: string }
  | { type: 'table'; rows: string[][] }

interface Lesson { id: string; title: string; content: Block[] }

// Échappe le HTML puis applique le gras **texte** (le contenu math $...$ reste lisible par KaTeX)
function esc(s: string): string {
  return (s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
function inline(s: string): string {
  return esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
}

function buildHtml(title: string, blocks: Block[]): string {
  const body = blocks.map((b) => {
    if (b.type === 'subtitle') return `<h2>${inline(b.text)}</h2>`
    if (b.type === 'paragraph') return `<p>${inline(b.text).replace(/\n/g, '<br/>')}</p>`
    if (b.type === 'image') return `<figure><img src="${esc(b.url)}"/>${b.caption ? `<figcaption>${esc(b.caption)}</figcaption>` : ''}</figure>`
    if (b.type === 'formula') return `<div class="formula">\\[${esc(b.latex)}\\]</div>`
    if (b.type === 'table') {
      const rows = Array.isArray(b.rows) ? b.rows : []
      const head = rows[0] ? `<tr>${rows[0].map((c) => `<th>${inline(c)}</th>`).join('')}</tr>` : ''
      const rest = rows.slice(1).map((r) => `<tr>${r.map((c) => `<td>${inline(c)}</td>`).join('')}</tr>`).join('')
      return `<div class="tablewrap"><table>${head}${rest}</table></div>`
    }
    return ''
  }).join('\n')

  return `<!DOCTYPE html><html><head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css"/>
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js"></script>
<style>
  * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
  body { margin: 0; padding: 20px 18px 60px; background: ${colors.background};
    color: ${colors.text}; font-family: -apple-system, 'Segoe UI', Roboto, sans-serif;
    font-size: 17px; line-height: 1.55; -webkit-text-size-adjust: 100%; }
  h1 { font-size: 24px; font-weight: 800; margin: 0 0 18px; line-height: 1.25; }
  h2 { font-size: 19px; font-weight: 800; color: ${colors.primary}; margin: 26px 0 8px; }
  p { margin: 0 0 12px; }
  strong { font-weight: 800; color: ${colors.text}; }
  figure { margin: 16px 0; text-align: center; }
  img { max-width: 100%; border-radius: 12px; }
  figcaption { font-size: 13px; color: ${colors.textMuted}; font-style: italic; margin-top: 6px; }
  .formula { margin: 16px 0; text-align: center; overflow-x: auto; overflow-y: hidden; }
  .tablewrap { overflow-x: auto; margin: 16px 0; }
  table { border-collapse: collapse; width: 100%; font-size: 15px; }
  th, td { border: 1px solid ${colors.cardBorder}; padding: 8px 10px; text-align: left; }
  th { background: ${colors.primaryTint}; color: ${colors.text}; font-weight: 800; }
  tr:nth-child(even) td { background: ${colors.card}; }
</style></head>
<body>
  <h1>${esc(title)}</h1>
  ${body}
  <script>
    function render(){ if(window.renderMathInElement){ renderMathInElement(document.body, {
      delimiters:[{left:'\\\\[',right:'\\\\]',display:true},{left:'$$',right:'$$',display:true},{left:'$',right:'$',display:false}],
      throwOnError:false }); } else { setTimeout(render, 120); } }
    window.addEventListener('load', render);
  </script>
</body></html>`
}

export default function LeconScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('course_lessons').select('id, title, content').eq('id', id).single()
      setLesson(data as unknown as Lesson | null)
      setLoading(false)
    }
    load()
  }, [id])

  if (loading) return <ActivityIndicator style={{ flex: 1, backgroundColor: colors.background }} color={colors.primary} />

  if (!lesson) {
    return (
      <View style={styles.emptyScreen}>
        <Text style={styles.emptyTitle}>Leçon introuvable.</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}><Text style={styles.backBtnText}>Retour</Text></TouchableOpacity>
      </View>
    )
  }

  const blocks = Array.isArray(lesson.content) ? lesson.content : []
  const html = buildHtml(lesson.title, blocks)

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={12}><Text style={styles.back}>←</Text></TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>Leçon</Text>
      </View>
      <WebView
        originWhitelist={['*']}
        source={{ html, baseUrl: 'https://kelassi.app/' }}
        style={styles.web}
        showsVerticalScrollIndicator
        setSupportMultipleWindows={false}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', paddingTop: 52, paddingHorizontal: 16, paddingBottom: 12, gap: 12, backgroundColor: colors.card, borderBottomWidth: 1, borderBottomColor: colors.cardBorder },
  back: { fontSize: 24, color: colors.text },
  headerTitle: { fontSize: 16, fontWeight: '700', color: colors.text, flex: 1 },
  web: { flex: 1, backgroundColor: colors.background },
  emptyScreen: { flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', gap: 16 },
  emptyTitle: { fontSize: 16, color: colors.textMuted },
  backBtn: { backgroundColor: colors.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: radius.md },
  backBtnText: { color: '#fff', fontWeight: '700' },
})
