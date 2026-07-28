import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { colors } from '../lib/theme'

/**
 * Rendu Markdown léger pour les leçons (pas de dépendance native).
 * Gère : titres (# → gras, sans le #), **gras**, listes à puces / numérotées,
 * tableaux |a|b|, citations >, séparateurs ---.
 */

// Découpe un texte en segments gras (**…**) → tableau de <Text>
function inline(text: string, keyBase: string): React.ReactNode[] {
  const parts = text.split(/\*\*/)
  return parts.map((p, i) =>
    i % 2 === 1
      ? <Text key={`${keyBase}-b${i}`} style={styles.bold}>{p}</Text>
      : <Text key={`${keyBase}-t${i}`}>{p}</Text>
  )
}

function isTableRow(l: string) { return /^\s*\|.*\|\s*$/.test(l) }
function isSeparator(l: string) { return /^\s*\|?[\s:|-]+\|?\s*$/.test(l) && l.includes('-') }
function cells(l: string) {
  return l.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim())
}

export function LessonContent({ content }: { content: string }) {
  const lines = content.split(/\r?\n/)
  const out: React.ReactNode[] = []
  let i = 0
  let key = 0

  while (i < lines.length) {
    const line = lines[i] ?? ''
    const trimmed = line.trim()

    // Ligne vide → petit espace
    if (trimmed === '') { out.push(<View key={key++} style={{ height: 8 }} />); i++; continue }

    // Séparateur horizontal
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(trimmed)) { out.push(<View key={key++} style={styles.hr} />); i++; continue }

    // Titre : #..###### → gras (sans le #)
    const h = trimmed.match(/^(#{1,6})\s+(.*)$/)
    if (h) {
      const level = (h[1] ?? '').length
      out.push(
        <Text key={key++} style={[styles.heading, level <= 2 ? styles.h2 : styles.h3]}>
          {inline(h[2] ?? '', `h${key}`)}
        </Text>
      )
      i++; continue
    }

    // Tableau : regroupe les lignes |...|
    if (isTableRow(line)) {
      const rows: string[] = []
      while (i < lines.length && isTableRow(lines[i] ?? '')) { rows.push(lines[i] ?? ''); i++ }
      const dataRows = rows.filter((r) => !isSeparator(r)).map(cells)
      out.push(
        <View key={key++} style={styles.table}>
          {dataRows.map((row, r) => (
            <View key={r} style={[styles.trow, r === 0 && styles.thead]}>
              {row.map((cell, cIdx) => (
                <Text key={cIdx} style={[styles.cell, r === 0 && styles.bold]}>{inline(cell, `c${r}-${cIdx}`)}</Text>
              ))}
            </View>
          ))}
        </View>
      )
      continue
    }

    // Citation
    if (/^>\s?/.test(trimmed)) {
      out.push(
        <View key={key++} style={styles.quote}>
          <Text style={styles.quoteText}>{inline(trimmed.replace(/^>\s?/, ''), `q${key}`)}</Text>
        </View>
      )
      i++; continue
    }

    // Liste à puces
    const b = trimmed.match(/^[-*]\s+(.*)$/)
    if (b) {
      out.push(
        <View key={key++} style={styles.li}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.liText}>{inline(b[1] ?? '', `li${key}`)}</Text>
        </View>
      )
      i++; continue
    }

    // Liste numérotée
    const n = trimmed.match(/^(\d+)\.\s+(.*)$/)
    if (n) {
      out.push(
        <View key={key++} style={styles.li}>
          <Text style={styles.bullet}>{n[1] ?? ''}.</Text>
          <Text style={styles.liText}>{inline(n[2] ?? '', `ol${key}`)}</Text>
        </View>
      )
      i++; continue
    }

    // Paragraphe
    out.push(<Text key={key++} style={styles.p}>{inline(trimmed, `p${key}`)}</Text>)
    i++
  }

  return <View>{out}</View>
}

const styles = StyleSheet.create({
  bold:      { fontWeight: '800', color: colors.text },
  heading:   { fontWeight: '800', color: colors.text, marginTop: 14, marginBottom: 4 },
  h2:        { fontSize: 18 },
  h3:        { fontSize: 15.5, color: colors.primary },
  p:         { fontSize: 15, lineHeight: 23, color: colors.text },
  hr:        { height: 1, backgroundColor: colors.cardBorder, marginVertical: 10 },
  li:        { flexDirection: 'row', gap: 8, paddingLeft: 4, marginVertical: 2 },
  bullet:    { fontSize: 15, color: colors.primary, fontWeight: '700', minWidth: 16 },
  liText:    { flex: 1, fontSize: 15, lineHeight: 22, color: colors.text },
  quote:     { borderLeftWidth: 3, borderLeftColor: colors.primary, paddingLeft: 10, marginVertical: 4 },
  quoteText: { fontSize: 14, fontStyle: 'italic', color: colors.textMuted },
  table:     { borderWidth: 1, borderColor: colors.cardBorder, borderRadius: 8, overflow: 'hidden', marginVertical: 8 },
  trow:      { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.cardBorder },
  thead:     { backgroundColor: colors.primaryTint },
  cell:      { flex: 1, fontSize: 13, lineHeight: 19, color: colors.text, padding: 8, borderRightWidth: 1, borderRightColor: colors.cardBorder },
})
