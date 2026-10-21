'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { MarkdownRenderer } from '@/components/markdown-renderer'

/* ------------------------------------------------------------------ */
/* Tableaux Markdown (GFM) : sérialisation / relecture                  */
/* ------------------------------------------------------------------ */

type Align = 'left' | 'center' | 'right'

const escapeCell = (s: string) => s.replace(/\|/g, '\\|').replace(/\r?\n/g, '<br>').trim()
const unescapeCell = (s: string) => s.replace(/<br\s*\/?>/gi, '\n').replace(/\\\|/g, '|').trim()

const sepFor = (a: Align, width: number) => {
  const inner = '-'.repeat(Math.max(3, width))
  if (a === 'center') return `:${inner.slice(0, Math.max(1, inner.length - 2))}:`
  if (a === 'right') return `${inner.slice(0, Math.max(2, inner.length - 1))}:`
  return inner
}

/** Grille + alignements → tableau Markdown GFM, colonnes alignées dans la source. */
function gridToMarkdown(grid: string[][], aligns: Align[]): string {
  const cols = aligns.length
  const cells = grid.map((row) => Array.from({ length: cols }, (_, c) => escapeCell(row[c] ?? '')))
  const widths = Array.from({ length: cols }, (_, c) =>
    Math.max(3, ...cells.map((row) => row[c]!.length)),
  )
  const pad = (s: string, c: number) => {
    const w = widths[c]!
    if (aligns[c] === 'right') return s.padStart(w)
    if (aligns[c] === 'center') {
      const left = Math.floor((w - s.length) / 2)
      return ' '.repeat(left) + s + ' '.repeat(w - s.length - left)
    }
    return s.padEnd(w)
  }
  const line = (row: string[]) => `| ${row.map((s, c) => pad(s, c)).join(' | ')} |`
  const separator = `| ${aligns.map((a, c) => sepFor(a, widths[c]!)).join(' | ')} |`
  return [line(cells[0] ?? []), separator, ...cells.slice(1).map(line)].join('\n')
}

const isTableLine = (l: string) => /^\s*\|.*\|\s*$/.test(l)
const isSeparatorLine = (l: string) => /^\s*\|[\s:|-]+\|\s*$/.test(l) && l.includes('-')

const splitRow = (l: string) =>
  l
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    // Ne coupe pas sur un « \| » échappé.
    .split(/(?<!\\)\|/)
    .map(unescapeCell)

function alignOf(sep: string): Align {
  const s = sep.trim()
  if (s.startsWith(':') && s.endsWith(':')) return 'center'
  if (s.endsWith(':')) return 'right'
  return 'left'
}

/** Repère le tableau Markdown qui entoure le curseur, s'il y en a un. */
function tableAtCursor(value: string, cursor: number) {
  const lines = value.split('\n')
  let offset = 0
  let index = lines.length - 1
  for (let i = 0; i < lines.length; i++) {
    const end = offset + lines[i]!.length
    if (cursor <= end) { index = i; break }
    offset = end + 1
  }
  if (!isTableLine(lines[index] ?? '')) return null

  let first = index
  while (first > 0 && isTableLine(lines[first - 1]!)) first--
  let last = index
  while (last < lines.length - 1 && isTableLine(lines[last + 1]!)) last++
  if (last - first < 1 || !isSeparatorLine(lines[first + 1]!)) return null

  const header = splitRow(lines[first]!)
  const aligns = splitRow(lines[first + 1]!).map(alignOf)
  const cols = Math.max(header.length, aligns.length)
  const body = lines.slice(first + 2, last + 1).map(splitRow)
  const grid = [header, ...body].map((row) => Array.from({ length: cols }, (_, c) => row[c] ?? ''))

  const start = lines.slice(0, first).reduce((n, l) => n + l.length + 1, 0)
  const end = start + lines.slice(first, last + 1).join('\n').length
  return {
    start,
    end,
    grid,
    aligns: Array.from({ length: cols }, (_, c) => aligns[c] ?? 'left') as Align[],
  }
}

/* ------------------------------------------------------------------ */
/* Boîte de dialogue « Tableau » — construction visuelle façon Word     */
/* ------------------------------------------------------------------ */

const emptyGrid = (rows: number, cols: number) =>
  Array.from({ length: rows }, () => Array.from({ length: cols }, () => ''))

interface TableDialogProps {
  initial: { grid: string[][]; aligns: Align[] } | null
  onCancel: () => void
  onInsert: (markdown: string) => void
}

const ALIGN_ICON: Record<Align, string> = { left: '⬅', center: '↔', right: '➡' }

function TableDialog({ initial, onCancel, onInsert }: TableDialogProps) {
  // Étape 1 : choix des dimensions par survol (grille type Word). Ignorée en édition.
  const [sized, setSized] = useState(initial !== null)
  const [hover, setHover] = useState({ r: 2, c: 2 })
  const [grid, setGrid] = useState<string[][]>(initial?.grid ?? emptyGrid(3, 3))
  const [aligns, setAligns] = useState<Align[]>(initial?.aligns ?? ['left', 'left', 'left'])

  const rows = grid.length
  const cols = aligns.length

  function start(r: number, c: number) {
    setGrid(emptyGrid(r, c))
    setAligns(Array.from({ length: c }, () => 'left' as Align))
    setSized(true)
  }

  const setCell = (r: number, c: number, v: string) =>
    setGrid((g) => g.map((row, i) => (i === r ? row.map((cell, j) => (j === c ? v : cell)) : row)))

  const addRow = (at: number) =>
    setGrid((g) => [...g.slice(0, at), Array.from({ length: cols }, () => ''), ...g.slice(at)])
  const delRow = (at: number) => {
    if (rows > 2 && at > 0) setGrid((g) => g.filter((_, i) => i !== at))
  }

  function addCol(at: number) {
    setGrid((g) => g.map((row) => [...row.slice(0, at), '', ...row.slice(at)]))
    setAligns((a) => [...a.slice(0, at), 'left', ...a.slice(at)])
  }
  function delCol(at: number) {
    if (cols <= 1) return
    setGrid((g) => g.map((row) => row.filter((_, j) => j !== at)))
    setAligns((a) => a.filter((_, j) => j !== at))
  }
  const cycleAlign = (c: number) =>
    setAligns((a) =>
      a.map((v, j) => (j === c ? (v === 'left' ? 'center' : v === 'center' ? 'right' : 'left') : v)),
    )

  return (
    <Modal title={initial ? 'Modifier le tableau' : 'Insérer un tableau'} onClose={onCancel} wide={sized}>
      {!sized ? (
        <div>
          <p className="text-sm text-gray-500 mb-3">
            Choisis la taille du tableau, en-tête compris — comme dans Word.
          </p>
          <div className="inline-block p-2 bg-gray-50 rounded-xl border border-gray-200">
            {Array.from({ length: 8 }).map((_, r) => (
              <div key={r} className="flex">
                {Array.from({ length: 10 }).map((_, c) => {
                  const on = r <= hover.r && c <= hover.c
                  return (
                    <button
                      key={c}
                      type="button"
                      onMouseEnter={() => setHover({ r, c })}
                      onFocus={() => setHover({ r, c })}
                      onClick={() => start(r + 1, c + 1)}
                      className={`w-6 h-6 m-0.5 rounded border ${on ? 'bg-green-600 border-green-700' : 'bg-white border-gray-200'}`}
                      aria-label={`${r + 1} lignes sur ${c + 1} colonnes`}
                    />
                  )
                })}
              </div>
            ))}
          </div>
          <p className="text-sm font-bold text-gray-700 mt-3">
            {hover.r + 1} ligne{hover.r ? 's' : ''} × {hover.c + 1} colonne{hover.c ? 's' : ''}
          </p>
        </div>
      ) : (
        <div>
          <p className="text-sm text-gray-500 mb-3">
            Remplis les cellules — la 1<sup>re</sup> ligne est l&apos;en-tête.{' '}
            <kbd className="px-1 bg-gray-100 border rounded text-xs">Tab</kbd> passe à la cellule suivante.
            Le Markdown et les formules $…$ sont acceptés dans les cellules.
          </p>

          <div className="overflow-x-auto pb-2">
            <table className="border-collapse">
              <thead>
                <tr>
                  <th className="w-8" />
                  {aligns.map((a, c) => (
                    <th key={c} className="px-1 pb-1">
                      <div className="flex items-center justify-center gap-1">
                        {/* tabIndex -1 : Tab doit sauter de cellule en cellule, pas s'arrêter sur ces boutons. */}
                        <button type="button" tabIndex={-1} onClick={() => cycleAlign(c)} title="Alignement de la colonne"
                          className="w-6 h-6 rounded-md bg-gray-100 hover:bg-gray-200 text-xs">{ALIGN_ICON[a]}</button>
                        <button type="button" tabIndex={-1} onClick={() => addCol(c + 1)} title="Ajouter une colonne à droite"
                          className="w-6 h-6 rounded-md bg-gray-100 hover:bg-green-100 text-xs">+</button>
                        <button type="button" tabIndex={-1} onClick={() => delCol(c)} disabled={cols <= 1} title="Supprimer la colonne"
                          className="w-6 h-6 rounded-md bg-gray-100 hover:bg-red-100 text-xs disabled:opacity-30">✕</button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {grid.map((row, r) => (
                  <tr key={r}>
                    <td className="pr-1 align-middle">
                      <div className="flex flex-col gap-0.5">
                        <button type="button" tabIndex={-1} onClick={() => addRow(r + 1)} title="Ajouter une ligne en dessous"
                          className="w-6 h-5 rounded bg-gray-100 hover:bg-green-100 text-[10px]">+</button>
                        <button type="button" tabIndex={-1} onClick={() => delRow(r)} disabled={rows <= 2 || r === 0}
                          title={r === 0 ? "L'en-tête ne peut pas être supprimé" : 'Supprimer la ligne'}
                          className="w-6 h-5 rounded bg-gray-100 hover:bg-red-100 text-[10px] disabled:opacity-30">✕</button>
                      </div>
                    </td>
                    {row.map((cell, c) => (
                      <td key={c} className="p-0">
                        <input
                          value={cell}
                          onChange={(e) => setCell(r, c, e.target.value)}
                          placeholder={r === 0 ? `Colonne ${c + 1}` : ''}
                          style={{ textAlign: aligns[c] }}
                          className={`w-36 border border-gray-300 px-2 py-1.5 text-sm outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 ${
                            r === 0 ? 'bg-green-50 font-bold text-gray-900' : 'bg-white text-gray-700'
                          }`}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center mt-4 gap-3 flex-wrap">
            <button type="button" onClick={() => addRow(rows)}
              className="px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-sm font-bold text-gray-700">
              + Ligne
            </button>
            <div className="flex gap-2">
              <button type="button" onClick={onCancel}
                className="px-4 py-2 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100">Annuler</button>
              <button type="button" onClick={() => onInsert(gridToMarkdown(grid, aligns))}
                className="px-5 py-2 rounded-xl bg-green-700 text-white text-sm font-bold hover:bg-green-800">
                {initial ? 'Mettre à jour' : 'Insérer le tableau'}
              </button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  )
}

/* ------------------------------------------------------------------ */
/* Boîte de dialogue « Schéma » — import d'une image                    */
/* ------------------------------------------------------------------ */

// Même liste blanche que la route d'upload (le SVG est exclu : XSS stockée).
const ACCEPT = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_SIZE = 5 * 1024 * 1024

async function uploadImage(file: File): Promise<string> {
  const form = new FormData()
  form.append('file', file)
  const res = await fetch('/api/admin/courses/upload-image', { method: 'POST', credentials: 'include', body: form })
  const json = await res.json().catch(() => null)
  if (!res.ok) throw new Error(json?.error?.message ?? "Échec de l'envoi de l'image.")
  return json.data.url as string
}

function ImageDialog({ onCancel, onInsert }: { onCancel: () => void; onInsert: (md: string) => void }) {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [caption, setCaption] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)

  useEffect(() => {
    if (!file) { setPreview(null); return }
    const url = URL.createObjectURL(file)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  function pick(f: File | null | undefined) {
    setError(null)
    if (!f) return
    if (!ACCEPT.includes(f.type)) { setError('Formats acceptés : JPEG, PNG, WebP, GIF.'); return }
    if (f.size > MAX_SIZE) { setError('Image trop lourde (max 5 Mo).'); return }
    setFile(f)
    setCaption((c) => c || f.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' '))
  }

  async function send() {
    if (!file) return
    setBusy(true); setError(null)
    try {
      const url = await uploadImage(file)
      onInsert(`![${caption.trim() || 'Schéma'}](${url})`)
    } catch (e) {
      setError((e as Error).message)
      setBusy(false)
    }
  }

  return (
    <Modal title="Importer un schéma" onClose={onCancel}>
      {error && <div className="p-3 bg-red-50 text-red-700 rounded-xl text-sm mb-3">{error}</div>}

      <label
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); pick(e.dataTransfer.files?.[0]) }}
        className={`flex flex-col items-center justify-center gap-2 h-48 rounded-2xl border-2 border-dashed cursor-pointer transition ${
          dragging ? 'border-green-600 bg-green-50' : 'border-gray-200 bg-gray-50 hover:border-green-500'
        }`}
      >
        {preview ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={preview} alt="Aperçu du schéma" className="max-h-40 max-w-full object-contain rounded-lg" />
        ) : (
          <>
            <span className="text-3xl">🖼️</span>
            <span className="text-sm font-bold text-gray-600">Glisse une image ici, ou clique pour la choisir</span>
            <span className="text-xs text-gray-400">JPEG, PNG, WebP ou GIF — 5 Mo max</span>
          </>
        )}
        <input type="file" accept={ACCEPT.join(',')} className="hidden" onChange={(e) => pick(e.target.files?.[0])} />
      </label>

      <input
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        placeholder="Légende du schéma (texte alternatif)"
        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm mt-3"
      />

      <div className="flex justify-end gap-2 mt-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100">
          Annuler
        </button>
        <button type="button" onClick={send} disabled={!file || busy}
          className="px-5 py-2 rounded-xl bg-green-700 text-white text-sm font-bold hover:bg-green-800 disabled:opacity-50">
          {busy ? 'Envoi…' : 'Insérer le schéma'}
        </button>
      </div>
    </Modal>
  )
}

/* ------------------------------------------------------------------ */
/* Coque de modale                                                      */
/* ------------------------------------------------------------------ */

function Modal({ title, onClose, wide, children }: {
  title: string; onClose: () => void; wide?: boolean; children: React.ReactNode
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 sm:p-8"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className={`bg-white rounded-2xl shadow-xl p-6 w-full ${wide ? 'max-w-4xl' : 'max-w-lg'}`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-black text-gray-900">{title}</h2>
          <button type="button" onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100">✕</button>
        </div>
        {children}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Éditeur                                                              */
/* ------------------------------------------------------------------ */

interface Props {
  value: string
  onChange: (value: string) => void
  rows?: number
  placeholder?: string
  required?: boolean
  className?: string
}

/**
 * Zone de saisie Markdown avec barre d'outils : mise en forme, tableaux
 * construits visuellement (comme dans Word) et import de schémas en image.
 *
 * La sortie reste du Markdown standard (GFM) — exactement ce que lisent déjà le
 * site (`MarkdownRenderer`, remark-gfm) et l'application mobile
 * (`LessonContent` / `MathLessonView`) : rien à changer côté élève.
 */
export function MarkdownEditor({ value, onChange, rows = 8, placeholder, required, className = '' }: Props) {
  const ref = useRef<HTMLTextAreaElement>(null)
  const [dialog, setDialog] = useState<'table' | 'image' | null>(null)
  const [tableInit, setTableInit] = useState<{ grid: string[][]; aligns: Align[] } | null>(null)
  const [replaceRange, setReplaceRange] = useState<[number, number] | null>(null)
  const [preview, setPreview] = useState(false)
  const [uploading, setUploading] = useState(false)
  // Position du curseur à restaurer après une insertion (la valeur est contrôlée par le parent).
  const caret = useRef<number | null>(null)

  useEffect(() => {
    if (caret.current === null || !ref.current) return
    const pos = caret.current
    caret.current = null
    ref.current.focus()
    ref.current.setSelectionRange(pos, pos)
  }, [value])

  const replace = useCallback((from: number, to: number, text: string, pos?: number) => {
    caret.current = pos ?? from + text.length
    onChange(value.slice(0, from) + text + value.slice(to))
  }, [value, onChange])

  /** Insère un bloc sur ses propres lignes, avec les sauts de ligne qui vont bien. */
  const insertBlock = useCallback((text: string) => {
    const el = ref.current
    const from = el ? el.selectionStart : value.length
    const to = el ? el.selectionEnd : value.length
    const before = value.slice(0, from).replace(/\s+$/, '')
    const after = value.slice(to).replace(/^\s+/, '')
    const head = before ? `${before}\n\n` : ''
    caret.current = head.length + text.length
    onChange(head + text + (after ? `\n\n${after}` : '\n'))
  }, [value, onChange])

  /** Entoure la sélection : gras, italique, formule… */
  function wrap(before: string, after: string, hint: string) {
    const el = ref.current
    if (!el) return
    const { selectionStart: from, selectionEnd: to } = el
    const inner = value.slice(from, to) || hint
    replace(from, to, before + inner + after, from + before.length + inner.length)
  }

  /** Préfixe chaque ligne de la sélection : titre, liste… */
  function prefixLines(prefix: string, hint: string) {
    const el = ref.current
    if (!el) return
    const from = value.lastIndexOf('\n', el.selectionStart - 1) + 1
    const nl = value.indexOf('\n', el.selectionEnd)
    const to = nl === -1 ? value.length : nl
    const block = value.slice(from, to) || hint
    const out = block.split('\n').map((l) => (l.startsWith(prefix) ? l : prefix + l)).join('\n')
    replace(from, to, out)
  }

  function openTable() {
    const el = ref.current
    const found = el ? tableAtCursor(value, el.selectionStart) : null
    setTableInit(found ? { grid: found.grid, aligns: found.aligns } : null)
    setReplaceRange(found ? [found.start, found.end] : null)
    setDialog('table')
  }

  function insertTable(markdown: string) {
    setDialog(null)
    if (replaceRange) replace(replaceRange[0], replaceRange[1], markdown)
    else insertBlock(markdown)
    setReplaceRange(null)
  }

  /** Image collée ou déposée directement dans la zone de texte. */
  async function dropImage(file: File) {
    if (!ACCEPT.includes(file.type)) { alert('Formats acceptés : JPEG, PNG, WebP, GIF.'); return }
    if (file.size > MAX_SIZE) { alert('Image trop lourde (max 5 Mo).'); return }
    setUploading(true)
    try {
      insertBlock(`![Schéma](${await uploadImage(file)})`)
    } catch (e) {
      alert((e as Error).message)
    } finally {
      setUploading(false)
    }
  }

  const btn = 'px-2.5 py-1.5 rounded-lg text-xs font-bold text-gray-600 hover:bg-white hover:text-gray-900 hover:shadow-sm transition'

  return (
    <div className={className}>
      <div className="flex flex-wrap items-center gap-0.5 bg-gray-50 border border-gray-200 border-b-0 rounded-t-xl px-2 py-1.5">
        <button type="button" onClick={() => wrap('**', '**', 'gras')} className={`${btn} font-black`} title="Gras">G</button>
        <button type="button" onClick={() => wrap('*', '*', 'italique')} className={`${btn} italic`} title="Italique">I</button>
        <button type="button" onClick={() => prefixLines('## ', 'Titre')} className={btn} title="Titre de section">H</button>
        <button type="button" onClick={() => prefixLines('- ', 'élément')} className={btn} title="Liste à puces">• Liste</button>
        <button type="button" onClick={() => wrap('$', '$', 'x^2')} className={btn} title="Formule mathématique">∑ Formule</button>
        <span className="w-px h-5 bg-gray-200 mx-1" />
        <button type="button" onClick={openTable} title="Insérer un tableau (ou modifier celui sous le curseur)"
          className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 transition">
          ▦ Tableau
        </button>
        <button type="button" onClick={() => setDialog('image')} title="Importer un schéma (image)"
          className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-violet-700 bg-violet-50 hover:bg-violet-100 transition">
          🖼️ Schéma
        </button>
        <button type="button" onClick={() => setPreview((p) => !p)} title="Aperçu du rendu élève"
          className={`${btn} ml-auto ${preview ? 'bg-white text-gray-900 shadow-sm' : ''}`}>
          👁 Aperçu
        </button>
      </div>

      <div className="relative">
        <textarea
          ref={ref}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          required={required}
          placeholder={placeholder}
          onPaste={(e) => {
            const f = Array.from(e.clipboardData.files).find((x) => x.type.startsWith('image/'))
            if (f) { e.preventDefault(); dropImage(f) }
          }}
          onDrop={(e) => {
            const f = Array.from(e.dataTransfer.files).find((x) => x.type.startsWith('image/'))
            if (f) { e.preventDefault(); dropImage(f) }
          }}
          className={`w-full border border-gray-200 px-3 py-2.5 text-sm font-mono ${preview ? '' : 'rounded-b-xl'}`}
        />
        {uploading && (
          <span className="absolute bottom-4 right-3 px-2 py-1 rounded-lg bg-gray-900/80 text-white text-xs font-bold">
            Envoi de l&apos;image…
          </span>
        )}
      </div>

      {/* L'aperçu s'ajoute sous la zone de saisie : la validation du formulaire
          (champ requis) reste opérante et on garde le texte sous les yeux. */}
      {preview && (
        <div className="border border-gray-200 border-t-0 rounded-b-xl bg-gray-50/60 px-4 py-3 overflow-x-auto">
          <p className="text-[10px] font-black uppercase tracking-wide text-gray-400 mb-2">Aperçu élève</p>
          {value.trim()
            ? <MarkdownRenderer content={value} prose />
            : <p className="text-sm text-gray-400">Rien à afficher pour l&apos;instant.</p>}
        </div>
      )}

      {dialog === 'table' && (
        <TableDialog initial={tableInit} onCancel={() => { setDialog(null); setReplaceRange(null) }} onInsert={insertTable} />
      )}
      {dialog === 'image' && (
        <ImageDialog onCancel={() => setDialog(null)} onInsert={(md) => { setDialog(null); insertBlock(md) }} />
      )}
    </div>
  )
}
