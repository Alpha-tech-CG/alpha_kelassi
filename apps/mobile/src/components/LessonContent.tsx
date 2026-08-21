import React, { useState } from 'react'
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native'
import { colors, fonts } from '../lib/theme'

const SCREEN_WIDTH = Dimensions.get('window').width

/**
 * Affiche une image de leçon à sa vraie taille : on mesure ses dimensions
 * naturelles pour calculer la hauteur d'affichage à partir de la largeur
 * disponible, plutôt que de forcer une hauteur fixe qui écrase les schémas
 * (beaucoup contiennent du texte/légendes qui doit rester lisible).
 */
function LessonImage({ uri }: { uri: string }) {
  const [ratio, setRatio] = useState<number | null>(null)
  const displayWidth = SCREEN_WIDTH - 40 // marge horizontale de l'écran leçon
  const height = ratio ? Math.min(displayWidth / ratio, 520) : 260

  return (
    <Image
      source={{ uri }}
      style={[styles.image, { width: displayWidth, height }]}
      resizeMode="contain"
      onLoad={(e) => {
        const { width, height: h } = e.nativeEvent.source
        if (width && h) setRatio(width / h)
      }}
    />
  )
}

/**
 * Rendu Markdown léger pour les leçons (design final Cognix).
 * Titres → gras, **gras**, listes, tableaux, images, et encarts colorés
 * pour « Astuce CEPE » (jaune), « Piège à éviter » (rouge), « Exercice » (vert).
 */

function inline(text: string, keyBase: string): React.ReactNode[] {
  const parts = text.split(/\*\*/)
  return parts.map((p, i) =>
    i % 2 === 1
      ? <Text key={`${keyBase}-b${i}`} style={styles.bold}>{p}</Text>
      : <Text key={`${keyBase}-t${i}`}>{p}</Text>
  )
}
const isTableRow = (l: string) => /^\s*\|.*\|\s*$/.test(l)
const isSeparator = (l: string) => /^\s*\|?[\s:|-]+\|?\s*$/.test(l) && l.includes('-')
const cells = (l: string) => l.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim())

type Callout = { kind: 'astuce' | 'piege' | 'exo'; label: string; icon: string }
function detectCallout(text: string): Callout | null {
  const t = text.toLowerCase()
  if (/astuce|💡/.test(t)) return { kind: 'astuce', label: 'Astuce CEPE', icon: '💡' }
  if (/piège|piege|attention|danger|⚠️/.test(t)) return { kind: 'piege', label: 'Piège à éviter', icon: '⚠️' }
  if (/exercice|✏️|✍️/.test(t)) return { kind: 'exo', label: 'Exercice', icon: '✏️' }
  return null
}

export function LessonContent({ content }: { content: string }) {
  const lines = content.split(/\r?\n/)
  const out: React.ReactNode[] = []
  let i = 0, key = 0

  const renderBlock = (raw: string, k: string): React.ReactNode | null => {
    const trimmed = raw.trim()
    if (trimmed === '') return null
    const b = trimmed.match(/^[-*]\s+(.*)$/)
    if (b) return <View key={k} style={styles.li}><Text style={styles.bullet}>•</Text><Text style={styles.liText}>{inline(b[1] ?? '', k)}</Text></View>
    return <Text key={k} style={styles.p}>{inline(trimmed, k)}</Text>
  }

  while (i < lines.length) {
    const line = lines[i] ?? ''
    const trimmed = line.trim()

    if (trimmed === '') { out.push(<View key={key++} style={{ height: 8 }} />); i++; continue }
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(trimmed)) { out.push(<View key={key++} style={styles.hr} />); i++; continue }

    // Matches an image anywhere in the line, not just when it's the sole
    // content — source content occasionally has trailing punctuation (e.g.
    // interval notation "]a, b[") right after the image on the same line,
    // which a fully-anchored regex would miss entirely, leaving the raw
    // "![...](...)" markdown visible as plain text (looks like a stray link).
    // Accepte les URLs distantes (https, en ligne) et les chemins locaux
    // (file://, servis depuis le cache hors-ligne — cf. lib/lessonCache.ts).
    const imgLineRegex = /!\[([^\]]*)\]\(((?:https?|file):\/\/[^\s)]+)\)/g
    if (imgLineRegex.test(trimmed)) {
      imgLineRegex.lastIndex = 0
      const segments: React.ReactNode[] = []
      let lastIndex = 0
      let m: RegExpExecArray | null
      while ((m = imgLineRegex.exec(trimmed))) {
        const before = trimmed.slice(lastIndex, m.index).trim()
        if (before) { const node = renderBlock(before, `imgseg${key}-${segments.length}`); if (node) segments.push(node) }
        segments.push(
          <View key={`img${key}-${segments.length}`} style={styles.figure}>
            <LessonImage uri={m[2] ?? ''} />
            {m[1] ? <Text style={styles.caption}>{m[1]}</Text> : null}
          </View>
        )
        lastIndex = m.index + m[0].length
      }
      const after = trimmed.slice(lastIndex).trim()
      if (after) { const node = renderBlock(after, `imgseg${key}-${segments.length}`); if (node) segments.push(node) }
      out.push(<View key={key++}>{segments}</View>)
      i++; continue
    }

    const h = trimmed.match(/^(#{1,6})\s+(.*)$/)
    if (h) {
      const htext = h[2] ?? ''
      const callout = detectCallout(htext)
      if (callout) {
        // Collecte le corps jusqu'au prochain titre
        i++
        const body: React.ReactNode[] = []
        let bk = 0
        while (i < lines.length && !/^#{1,6}\s/.test((lines[i] ?? '').trim())) {
          const node = renderBlock(lines[i] ?? '', `co${key}-${bk++}`)
          if (node) body.push(node)
          i++
        }
        const st = callout.kind === 'astuce' ? styles.astuce : callout.kind === 'piege' ? styles.piege : styles.exo
        const badge = callout.kind === 'astuce' ? styles.badgeAstuce : callout.kind === 'piege' ? styles.badgePiege : styles.badgeExo
        out.push(
          <View key={key++} style={[styles.callout, st]}>
            <View style={styles.calloutHead}>
              <View style={[styles.calloutIcon, badge]}><Text style={{ fontSize: 16 }}>{callout.icon}</Text></View>
              <Text style={styles.calloutTitle}>{callout.label}</Text>
            </View>
            {body}
          </View>
        )
        continue
      }
      const lvl = (h[1] ?? '').length
      out.push(<Text key={key++} style={[styles.heading, lvl <= 2 ? styles.h2 : styles.h3]}>{inline(htext, `h${key}`)}</Text>)
      i++; continue
    }

    if (isTableRow(line)) {
      const rows: string[] = []
      while (i < lines.length && isTableRow(lines[i] ?? '')) { rows.push(lines[i] ?? ''); i++ }
      const dataRows = rows.filter((r) => !isSeparator(r)).map(cells)
      out.push(
        <View key={key++} style={styles.table}>
          {dataRows.map((row, r) => (
            <View key={r} style={[styles.trow, r === 0 && styles.thead]}>
              {row.map((cell, c) => <Text key={c} style={[styles.cell, r === 0 && styles.bold]}>{inline(cell, `c${r}-${c}`)}</Text>)}
            </View>
          ))}
        </View>
      )
      continue
    }

    if (/^>\s?/.test(trimmed)) {
      out.push(<View key={key++} style={styles.quote}><Text style={styles.quoteText}>{inline(trimmed.replace(/^>\s?/, ''), `q${key}`)}</Text></View>)
      i++; continue
    }

    const node = renderBlock(line, `p${key}`)
    if (node) out.push(<View key={key++}>{node}</View>)
    i++
  }

  return <View>{out}</View>
}

const styles = StyleSheet.create({
  bold: { fontFamily: fonts.body, color: colors.text },
  heading: { fontFamily: fonts.heading, color: colors.text, marginTop: 16, marginBottom: 4 },
  h2: { fontSize: 18 },
  h3: { fontSize: 15.5, color: colors.primary },
  p: { fontFamily: fonts.regular, fontSize: 15, lineHeight: 23, color: colors.text },
  hr: { height: 1, backgroundColor: colors.cardBorder, marginVertical: 10 },
  li: { flexDirection: 'row', gap: 8, paddingLeft: 4, marginVertical: 2 },
  bullet: { fontSize: 15, color: colors.primary, fontFamily: fonts.body, minWidth: 16 },
  liText: { flex: 1, fontFamily: fonts.regular, fontSize: 15, lineHeight: 22, color: colors.text },
  quote: { borderLeftWidth: 3, borderLeftColor: colors.primary, paddingLeft: 10, marginVertical: 4 },
  quoteText: { fontSize: 14, fontStyle: 'italic', color: colors.textMuted },
  table: { borderWidth: 1, borderColor: colors.cardBorder, borderRadius: 12, overflow: 'hidden', marginVertical: 8 },
  trow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.cardBorder },
  thead: { backgroundColor: colors.primaryTint },
  cell: { flex: 1, fontFamily: fonts.regular, fontSize: 13, lineHeight: 19, color: colors.text, padding: 8, borderRightWidth: 1, borderRightColor: colors.cardBorder },
  figure: { marginVertical: 10, alignItems: 'center' },
  image: { borderRadius: 16, backgroundColor: '#fff' },
  caption: { fontSize: 12, color: colors.textMuted, fontStyle: 'italic', marginTop: 6, textAlign: 'center' },
  // Encarts
  callout: { borderRadius: 24, borderWidth: 2, padding: 16, marginVertical: 10 },
  calloutHead: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  calloutIcon: { width: 34, height: 34, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  calloutTitle: { fontFamily: fonts.heading, fontSize: 13, color: colors.text, textTransform: 'uppercase', letterSpacing: 0.5 },
  astuce: { backgroundColor: '#FEF9E7', borderColor: '#F7D64A66' },
  piege: { backgroundColor: '#FDECEA', borderColor: '#E5393566' },
  exo: { backgroundColor: '#EAF5EC', borderColor: '#1E74E844' },
  badgeAstuce: { backgroundColor: colors.yellow },
  badgePiege: { backgroundColor: colors.red },
  badgeExo: { backgroundColor: colors.primary },
})
