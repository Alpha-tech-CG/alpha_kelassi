/**
 * Sépare les exercices du texte d'un cours et les installe dans l'espace
 * « Exercices » (tables `exercises` + `exercise_solutions`).
 *
 * Dans les sources Markdown, un exercice est un bloc ouvert par un titre de
 * niveau 4 commençant par « Exercice », « Exemple » ou « Application », et qui
 * court jusqu'au prochain titre de niveau 4 ou supérieur. L'énoncé s'arrête à
 * la première ligne qui annonce la résolution (« #### Solution »,
 * « **Solution** », « **Hypothèses** » ou une première étape « **1) … »).
 *
 * Dans l'application, l'élève ne voit que l'énoncé ; le corrigé reste fermé
 * tant qu'il n'a pas validé sa propre réponse. Le cours, lui, ne garde que
 * les définitions, les formules et les méthodes.
 */

const OPENING = /^#### ((?:Exercice|Exemple|Application)\b.*)$/
const HEADING = /^(#{1,6}) (.+)$/
const SOLUTION_START = /^(#### Solution\b.*|\*\*Solution\*\*.*|\*\*Hypothèses\*\*.*|\*\*1\) .*)$/
const HOLE = '<!--exercice-->'

/** Titre de section rendu présentable pour lever une ambiguïté (« Exercice 1 » ×2). */
function sectionLabel(heading) {
  const s = heading
    .replace(/^[A-Za-z0-9]{1,3}[.)]\s+/, '')            // « a) », « B. », « 3. »
    .replace(/^Exercices?(?: corrigés)?(?: sur)? /i, '')
    .trim()
  return s.charAt(0).toUpperCase() + s.slice(1)
}

/**
 * @returns {{ course: string, exercises: { title: string, statement: string, solution: string, difficulty: number, order_index: number }[] }}
 */
export function splitExercises(content) {
  const lines = content.split('\n')
  const out = []
  const found = []
  let section = ''

  for (let i = 0; i < lines.length; i++) {
    const open = lines[i].match(OPENING)
    if (!open) {
      const h = lines[i].match(HEADING)
      if (h && h[1].length <= 3) section = h[2]
      out.push(lines[i])
      continue
    }
    let end = i + 1
    while (end < lines.length) {
      const h = lines[end].match(HEADING)
      if (h && h[1].length <= 4 && !/^#### Solution\b/.test(lines[end])) break
      end++
    }
    const block = lines.slice(i + 1, end)
    const cut = block.findIndex((l) => SOLUTION_START.test(l))
    if (cut < 0) { out.push(...lines.slice(i, end)); i = end - 1; continue }   // pas de corrigé : reste dans le cours

    const statement = block.slice(0, cut).join('\n').trim()
    // « #### Solution » et « **Solution** » ne sont que des séparateurs ; les autres amorces font partie du corrigé.
    const keepFirst = !/^(#### Solution\b|\*\*Solution\*\*\s*$)/.test(block[cut])
    const solution = block.slice(keepFirst ? cut : cut + 1).join('\n').trim()
    if (!statement || !solution) { out.push(...lines.slice(i, end)); i = end - 1; continue }

    found.push({ heading: open[1].trim(), section, statement, solution })
    out.push(HOLE, '')
    i = end - 1
  }

  // Un titre dont tout le contenu était fait d'exercices n'a plus lieu d'être.
  const kept = []
  for (let i = 0; i < out.length; i++) {
    const h = out[i].match(HEADING)
    if (h) {
      let j = i + 1, holes = 0
      while (j < out.length && !HEADING.test(out[j])) { if (out[j] === HOLE) holes++; else if (out[j].trim()) { holes = -1; break } j++ }
      const next = j < out.length ? out[j].match(HEADING) : null
      if (holes > 0 && (!next || next[1].length <= h[1].length)) { i = j - 1; continue }
    }
    if (out[i] !== HOLE) kept.push(out[i])
  }
  const course = kept.join('\n').replace(/\n{3,}/g, '\n\n').trimEnd() + '\n'

  const count = {}
  for (const f of found) count[f.heading] = (count[f.heading] ?? 0) + 1
  const exercises = found.map((f, k) => ({
    title: count[f.heading] > 1 && f.section ? `${f.heading} — ${sectionLabel(f.section)}` : f.heading,
    statement: f.statement,
    solution: f.solution,
    difficulty: /^Exercice/.test(f.heading) ? 2 : 1,
    order_index: k,
  }))
  const titles = new Set(exercises.map((e) => e.title))
  if (titles.size !== exercises.length) throw new Error(`Titres d'exercices en double : ${exercises.map((e) => e.title).join(' | ')}`)
  return { course, exercises }
}

/**
 * Installe les exercices d'un chapitre. Idempotent : crée ce qui manque, met à
 * jour ce qui a changé (repéré par le titre), ne supprime jamais rien.
 */
export async function syncExercises(sb, chapterId, exercises, { dryRun, backup, indent = '      ' }) {
  if (!exercises.length) return
  const tag = dryRun ? '[dry-run] ' : ''
  if (!chapterId) { console.log(`${tag}${indent}${exercises.length} exercice(s) : création`); return }

  const existing = await sb(`/exercises?select=id,title,statement,difficulty,order_index,exercise_solutions(solution)&chapter_id=eq.${chapterId}`)
  const byTitle = new Map(existing.map((e) => [e.title, e]))
  let created = 0, updated = 0, same = 0

  for (const ex of exercises) {
    const old = byTitle.get(ex.title)
    if (!old) {
      created++
      if (dryRun) continue
      const [row] = await sb('/exercises', {
        method: 'POST',
        body: JSON.stringify({
          chapter_id: chapterId, title: ex.title, statement: ex.statement,
          difficulty: ex.difficulty, is_premium: false, order_index: ex.order_index,
        }),
      })
      await sb('/exercise_solutions', { method: 'POST', body: JSON.stringify({ exercise_id: row.id, solution: ex.solution }) })
      continue
    }
    // PostgREST rend la relation 1:1 en objet ou en tableau selon la détection de la clé.
    const sol = Array.isArray(old.exercise_solutions) ? old.exercise_solutions[0] : old.exercise_solutions
    const sameStatement = old.statement === ex.statement && old.order_index === ex.order_index && old.difficulty === ex.difficulty
    const sameSolution = sol?.solution === ex.solution
    if (sameStatement && sameSolution) { same++; continue }
    updated++
    backup.push({ table: 'exercises', id: old.id, before: old })
    if (dryRun) continue
    if (!sameStatement) {
      await sb(`/exercises?id=eq.${old.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ statement: ex.statement, order_index: ex.order_index, difficulty: ex.difficulty }),
      })
    }
    if (!sameSolution) {
      await sb('/exercise_solutions?on_conflict=exercise_id', {
        method: 'POST',
        headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
        body: JSON.stringify({ exercise_id: old.id, solution: ex.solution }),
      })
    }
  }
  const parts = [created && `${created} créé(s)`, updated && `${updated} mis à jour`, same && `${same} à jour`].filter(Boolean)
  console.log(`${created || updated ? tag : ''}${indent}exercices : ${parts.join(', ')}`)
}
