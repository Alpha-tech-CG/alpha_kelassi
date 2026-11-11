import React, { useState } from 'react'
import { View, Text, StyleSheet, Image, Dimensions, ScrollView } from 'react-native'
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
    i % 2 === 1 ? (
      <Text key={`${keyBase}-b${i}`} style={styles.bold}>
        {p}
      </Text>
    ) : (
      <Text key={`${keyBase}-t${i}`}>{p}</Text>
    )
  )
}
const isTableRow = (l: string) => /^\s*\|.*\|\s*$/.test(l)
const isSeparator = (l: string) => /^\s*\|?[\s:|-]+\|?\s*$/.test(l) && l.includes('-')
const cells = (l: string) =>
  l
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((c) => c.trim())

type Callout = { kind: 'astuce' | 'piege' | 'exo'; label: string; icon: string }
function detectCallout(text: string): Callout | null {
  const t = text.toLowerCase()
  if (/astuce|💡/.test(t)) return { kind: 'astuce', label: 'Astuce CEPE', icon: '💡' }
  if (/piège|piege|attention|danger|⚠️/.test(t))
    return { kind: 'piege', label: 'Piège à éviter', icon: '⚠️' }
  if (/exercice|✏️|✍️/.test(t)) return { kind: 'exo', label: 'Exercice', icon: '✏️' }
  return null
}

function headingKind(text: string) {
  if (/^introduction\b/i.test(text)) return 'introduction'
  if (/notions?\s+cl[eé]s|d[eé]finitions?\s+des?\s+notions/i.test(text)) return 'keywords'
  if (/^d[eé]veloppement\b/i.test(text)) return 'development'
  if (/^conclusion\b/i.test(text)) return 'conclusion'
  return null
}

/**
 * Tableau de leçon lisible sur téléphone.
 *
 * Avant, chaque colonne recevait la même part de la largeur de l'écran : à 4 ou
 * 5 colonnes, le texte était coupé presque lettre par lettre. Désormais chaque
 * colonne prend une largeur adaptée à son contenu (entre MIN et MAX) ; si le
 * tableau tient dans l'écran, il l'occupe en entier, sinon il défile
 * horizontalement (avec une indication « fais glisser »).
 */
const TABLE_AVAILABLE = SCREEN_WIDTH - 68 // marges de l'écran chapitre + de la carte
const COL_MIN = 92
const COL_MAX = 230
function LessonTable({ rows }: { rows: string[][] }) {
  const nCols = Math.max(0, ...rows.map((r) => r.length))
  if (nCols === 0) return null
  const plain = (s: string) => s.replace(/\*\*/g, '')
  // Largeur « naturelle » : le plus long mot et la longueur moyenne d'une ligne de texte.
  const natural = Array.from({ length: nCols }, (_, c) => {
    let longestWord = 0
    let longestCell = 0
    for (const r of rows) {
      const t = plain(r[c] ?? '')
      longestCell = Math.max(longestCell, t.length)
      for (const w of t.split(/\s+/)) longestWord = Math.max(longestWord, w.length)
    }
    const byText = Math.min(longestCell, 28) * 7.4 + 22
    const byWord = longestWord * 8.2 + 22
    return Math.min(COL_MAX, Math.max(COL_MIN, byText, byWord))
  })
  const total = natural.reduce((a, b) => a + b, 0)
  const fits = total <= TABLE_AVAILABLE
  const widths = fits ? natural.map((w) => (w / total) * TABLE_AVAILABLE) : natural

  const table = (
    <View style={[styles.table, { width: fits ? TABLE_AVAILABLE : total }]}>
      {rows.map((row, r) => (
        <View key={r} style={[styles.trow, r === 0 ? styles.thead : r % 2 === 0 && styles.trowAlt]}>
          {Array.from({ length: nCols }, (_, c) => (
            <View key={c} style={[styles.cellBox, { width: widths[c] }, c === nCols - 1 && styles.cellLast]}>
              <Text style={[styles.cell, r === 0 && styles.headCell]}>{inline(row[c] ?? '', `c${r}-${c}`)}</Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  )
  if (fits) return <View style={styles.tableWrap}>{table}</View>
  return (
    <View style={styles.tableWrap}>
      <ScrollView horizontal showsHorizontalScrollIndicator nestedScrollEnabled>
        {table}
      </ScrollView>
      <Text style={styles.tableHint}>‹ Fais glisser le tableau pour tout voir ›</Text>
    </View>
  )
}

export function LessonContent({ content }: { content: string }) {
  const lines = content.split(/\r?\n/)
  const out: React.ReactNode[] = []
  let i = 0,
    key = 0

  const renderBlock = (raw: string, k: string): React.ReactNode | null => {
    const trimmed = raw.trim()
    if (trimmed === '') return null
    const label = trimmed.match(
      /^\*\*(Probl[eé]matique|Objectifs? p[eé]dagogiques?|[ÀA] retenir|Exemple(?: concret)?|D[eé]finitions?)\s*:?\*\*\s*(.*)$/i
    )
    if (label) {
      const isQuestion = /^probl/i.test(label[1] ?? '')
      return (
        <View key={k} style={[styles.note, isQuestion && styles.questionNote]}>
          <Text style={[styles.noteLabel, isQuestion && styles.questionLabel]}>
            {isQuestion ? 'QUESTION CENTRALE' : label[1]?.replace(/:$/, '').toLocaleUpperCase('fr')}
          </Text>
          <Text style={styles.noteText}>{inline(label[2] ?? '', k)}</Text>
        </View>
      )
    }
    const definition = trimmed.match(/^\*\*([^*]+)\*\*\s*:\s*(.*)$/)
    if (definition) {
      return (
        <View key={k} style={styles.definitionRow}>
          <Text style={styles.keyword}>{inline(definition[1] ?? '', k)}</Text>
          <Text style={styles.definitionText}>{inline(definition[2] ?? '', k)}</Text>
        </View>
      )
    }
    const numbered = trimmed.match(/^(\d+)[.)]\s+(.*)$/)
    if (numbered) {
      return (
        <View key={k} style={styles.li}>
          <Text style={styles.listNumber}>{numbered[1]}</Text>
          <Text style={styles.liText}>{inline(numbered[2] ?? '', k)}</Text>
        </View>
      )
    }
    const b = trimmed.match(/^[-*]\s+(.*)$/)
    if (b) {
      const term = b[1]?.match(/^\*\*([^*]+)\*\*\s*:\s*(.*)$/)
      if (term) {
        return (
          <View key={k} style={styles.definitionRow}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.keyword}>{inline(term[1] ?? '', k)}</Text>
            <Text style={styles.definitionText}>{inline(term[2] ?? '', k)}</Text>
          </View>
        )
      }
      return (
        <View key={k} style={styles.li}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.liText}>{inline(b[1] ?? '', k)}</Text>
        </View>
      )
    }
    return (
      <Text key={k} style={styles.p}>
        {inline(trimmed, k)}
      </Text>
    )
  }

  while (i < lines.length) {
    const line = lines[i] ?? ''
    const trimmed = line.trim()

    if (trimmed === '') {
      out.push(<View key={key++} style={{ height: 8 }} />)
      i++
      continue
    }
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
      out.push(<View key={key++} style={styles.hr} />)
      i++
      continue
    }

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
        if (before) {
          const node = renderBlock(before, `imgseg${key}-${segments.length}`)
          if (node) segments.push(node)
        }
        segments.push(
          <View key={`img${key}-${segments.length}`} style={styles.figure}>
            <LessonImage uri={m[2] ?? ''} />
            {m[1] ? <Text style={styles.caption}>{m[1]}</Text> : null}
          </View>
        )
        lastIndex = m.index + m[0].length
      }
      const after = trimmed.slice(lastIndex).trim()
      if (after) {
        const node = renderBlock(after, `imgseg${key}-${segments.length}`)
        if (node) segments.push(node)
      }
      out.push(<View key={key++}>{segments}</View>)
      i++
      continue
    }

    const h = trimmed.match(/^(#{1,6})\s+(.*)$/)
    if (h) {
      const htext = h[2] ?? ''
      const level = (h[1] ?? '').length
      const kind = headingKind(htext)
      if (level === 2 && kind === 'introduction') {
        let end = i + 1
        while (end < lines.length && !/^##\s/.test((lines[end] ?? '').trim())) end++
        const body = lines
          .slice(i + 1, end)
          .join('\n')
          .trim()
        out.push(
          <View key={key++} style={styles.introduction}>
            <View style={styles.introHeading}>
              <View style={styles.introIcon}>
                <Text style={styles.introIconText}>✦</Text>
              </View>
              <View style={styles.introHeadingCopy}>
                <Text style={styles.introEyebrow}>POUR COMMENCER</Text>
                <Text style={styles.introTitle}>{htext}</Text>
              </View>
            </View>
            <LessonContent content={body} />
          </View>
        )
        i = end
        continue
      }
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
        const st =
          callout.kind === 'astuce'
            ? styles.astuce
            : callout.kind === 'piege'
              ? styles.piege
              : styles.exo
        const badge =
          callout.kind === 'astuce'
            ? styles.badgeAstuce
            : callout.kind === 'piege'
              ? styles.badgePiege
              : styles.badgeExo
        out.push(
          <View key={key++} style={[styles.callout, st]}>
            <View style={styles.calloutHead}>
              <View style={[styles.calloutIcon, badge]}>
                <Text style={{ fontSize: 16 }}>{callout.icon}</Text>
              </View>
              <Text style={styles.calloutTitle}>{callout.label}</Text>
            </View>
            {body}
          </View>
        )
        continue
      }
      out.push(
        level === 1 ? (
          <View key={key++} style={styles.lessonHeading}>
            <Text style={styles.lessonHeadingEyebrow}>LEÇON</Text>
            <Text style={styles.lessonHeadingTitle}>{inline(htext, `h${key}`)}</Text>
          </View>
        ) : level === 2 ? (
          <View
            key={key++}
            style={[
              styles.sectionHeader,
              kind === 'keywords' && styles.keywordHeading,
              kind === 'development' && styles.developmentHeading,
              kind === 'conclusion' && styles.conclusionHeading,
            ]}
          >
            {kind === 'keywords' ? (
              <View style={[styles.sectionIcon, styles.keywordIcon]}>
                <Text style={styles.sectionIconText}>✦</Text>
              </View>
            ) : kind === 'development' ? (
              <View style={[styles.sectionIcon, styles.developmentIcon]}>
                <Text style={styles.sectionIconText}>✎</Text>
              </View>
            ) : null}
            <Text style={styles.sectionTitle}>{inline(htext, `h${key}`)}</Text>
          </View>
        ) : level === 3 ? (
          <View key={key++} style={styles.subsectionHeader}>
            <View style={styles.subsectionMarker} />
            <Text style={styles.subsectionTitle}>{inline(htext, `h${key}`)}</Text>
          </View>
        ) : (
          <Text key={key++} style={styles.minorHeading}>
            {inline(htext, `h${key}`)}
          </Text>
        )
      )
      i++
      continue
    }

    if (isTableRow(line)) {
      const rows: string[] = []
      while (i < lines.length && isTableRow(lines[i] ?? '')) {
        rows.push(lines[i] ?? '')
        i++
      }
      out.push(<LessonTable key={key++} rows={rows.filter((r) => !isSeparator(r)).map(cells)} />)
      continue
    }

    if (/^>\s?/.test(trimmed)) {
      out.push(
        <View key={key++} style={styles.quote}>
          <Text style={styles.quoteText}>{inline(trimmed.replace(/^>\s?/, ''), `q${key}`)}</Text>
        </View>
      )
      i++
      continue
    }

    const node = renderBlock(line, `p${key}`)
    if (node) out.push(<View key={key++}>{node}</View>)
    i++
  }

  return <View>{out}</View>
}

const styles = StyleSheet.create({
  bold: { fontFamily: fonts.body, color: colors.text },
  lessonHeading: {
    marginTop: 8,
    marginBottom: 12,
    padding: 15,
    borderRadius: 18,
    backgroundColor: '#EAF2E5',
  },
  lessonHeadingEyebrow: {
    marginBottom: 4,
    color: '#628356',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.1,
  },
  lessonHeadingTitle: {
    color: '#214B3D',
    fontFamily: fonts.heading,
    fontSize: 20,
    lineHeight: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    marginTop: 20,
    marginBottom: 9,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#E7A83E',
    borderRadius: 0,
    backgroundColor: '#FFF7E5',
  },
  keywordHeading: { borderLeftColor: '#739C52', backgroundColor: '#EEF5E9' },
  developmentHeading: {
    borderLeftColor: '#D89A38',
    backgroundColor: '#FFF2D6',
    marginTop: 28,
  },
  conclusionHeading: { borderLeftColor: '#4C8A63', backgroundColor: '#EAF4E8' },
  sectionIcon: {
    width: 27,
    height: 27,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9,
  },
  keywordIcon: { backgroundColor: '#DCEBCF' },
  developmentIcon: { backgroundColor: '#F9E5B5' },
  sectionIconText: { color: '#52713E', fontSize: 14, fontWeight: '900' },
  sectionTitle: {
    flex: 1,
    color: '#214B3D',
    fontFamily: fonts.heading,
    fontSize: 16,
    lineHeight: 23,
  },
  subsectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 9,
    marginTop: 15,
    marginBottom: 6,
  },
  subsectionMarker: {
    width: 7,
    height: 7,
    marginTop: 7,
    borderRadius: 4,
    backgroundColor: '#D89A38',
  },
  subsectionTitle: {
    flex: 1,
    color: '#397158',
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 22,
  },
  minorHeading: {
    marginTop: 11,
    marginBottom: 5,
    color: '#855C26',
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 21,
  },
  p: { fontFamily: fonts.regular, fontSize: 15, lineHeight: 23, color: colors.text },
  hr: { height: 1, backgroundColor: '#EEE4D0', marginVertical: 16 },
  li: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, paddingLeft: 4, marginVertical: 4 },
  bullet: { fontSize: 15, color: '#C78B2E', fontFamily: fonts.body, minWidth: 16 },
  listNumber: {
    minWidth: 22,
    height: 22,
    overflow: 'hidden',
    borderRadius: 11,
    backgroundColor: '#FFF1D1',
    color: '#855C26',
    fontSize: 12,
    lineHeight: 22,
    textAlign: 'center',
    fontFamily: fonts.body,
  },
  liText: { flex: 1, fontFamily: fonts.regular, fontSize: 15, lineHeight: 22, color: colors.text },
  definitionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: 7,
    marginVertical: 5,
    padding: 10,
    borderWidth: 1,
    borderColor: '#EEE5D4',
    borderRadius: 12,
    backgroundColor: '#FFFDFA',
  },
  keyword: {
    overflow: 'hidden',
    borderRadius: 999,
    backgroundColor: '#FFF1D1',
    paddingHorizontal: 9,
    paddingVertical: 4,
    color: '#76501E',
    fontFamily: fonts.body,
    fontSize: 13,
  },
  definitionText: {
    flex: 1,
    minWidth: '68%',
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 21,
    color: colors.text,
  },
  note: {
    marginVertical: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#7E9F61',
    backgroundColor: '#F2F7ED',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  noteLabel: {
    marginBottom: 4,
    color: '#52713E',
    fontFamily: fonts.heading,
    fontSize: 10,
    letterSpacing: 0.7,
    textTransform: 'uppercase',
  },
  noteText: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 21, color: '#3F5140' },
  questionNote: { borderLeftColor: '#D89A38', backgroundColor: '#FFF8E8' },
  questionLabel: { color: '#96651F' },
  introduction: {
    marginVertical: 8,
    padding: 15,
    borderWidth: 1,
    borderColor: '#DCE9D6',
    borderRadius: 20,
    backgroundColor: '#F5F9F1',
  },
  introHeading: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  introIcon: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#E4EFDE',
  },
  introIconText: { color: '#4C8058', fontSize: 18, fontWeight: '900' },
  introHeadingCopy: { flex: 1 },
  introEyebrow: { color: '#628356', fontSize: 9, fontWeight: '900', letterSpacing: 1.1 },
  introTitle: { color: '#214B3D', fontFamily: fonts.heading, fontSize: 17, lineHeight: 23 },
  quote: {
    borderLeftWidth: 4,
    borderLeftColor: '#D89A38',
    borderRadius: 0,
    backgroundColor: '#FFF8E8',
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginVertical: 8,
  },
  quoteText: { fontSize: 14, lineHeight: 21, fontStyle: 'italic', color: '#655638' },
  tableWrap: { marginVertical: 12 },
  table: {
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  trow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.cardBorder },
  trowAlt: { backgroundColor: '#F7FAFF' },
  thead: { backgroundColor: colors.primary, borderBottomWidth: 0 },
  cellBox: { borderRightWidth: 1, borderRightColor: colors.cardBorder, paddingHorizontal: 10, paddingVertical: 9 },
  cellLast: { borderRightWidth: 0 },
  cell: {
    fontFamily: fonts.regular,
    fontSize: 13.5,
    lineHeight: 19,
    color: colors.text,
  },
  headCell: { fontFamily: fonts.body, color: '#fff' },
  tableHint: { marginTop: 6, fontSize: 11, color: colors.textMuted, textAlign: 'center' },
  figure: { marginVertical: 10, alignItems: 'center' },
  image: { borderRadius: 16, backgroundColor: '#fff' },
  caption: {
    fontSize: 12,
    color: colors.textMuted,
    fontStyle: 'italic',
    marginTop: 6,
    textAlign: 'center',
  },
  // Encarts
  callout: { borderRadius: 18, borderWidth: 1, padding: 16, marginVertical: 12 },
  calloutHead: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  calloutIcon: {
    width: 34,
    height: 34,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calloutTitle: {
    fontFamily: fonts.heading,
    fontSize: 13,
    color: colors.text,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  astuce: { backgroundColor: '#FFF8E8', borderColor: '#F1DFB7' },
  piege: { backgroundColor: '#FFF1ED', borderColor: '#F2D0C7' },
  exo: { backgroundColor: '#EFF7EC', borderColor: '#D7E8D0' },
  badgeAstuce: { backgroundColor: colors.yellow },
  badgePiege: { backgroundColor: colors.red },
  badgeExo: { backgroundColor: colors.primary },
})
