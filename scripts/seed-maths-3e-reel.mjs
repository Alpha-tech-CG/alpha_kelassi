/**
 * Importe le vrai contenu de maths_3e_contenu_complet.docx (10 chapitres
 * officiels M3E-1..10) :
 *  - M3E-1, M3E-2, M3E-5, M3E-6 : chapitres créés récemment avec juste un
 *    résumé structuré (create-official-bepc-chapters.mjs) → le cours est
 *    REMPLACÉ par le vrai contenu détaillé de ce document.
 *  - M3E-3, M3E-4, M3E-7, M3E-8, M3E-9 : chapitres qui ont déjà un cours+quiz
 *    réel et détaillé ("modèle des profs") → NON touchés, seuls les
 *    exercices (vides partout) sont ajoutés.
 *  - M3E-10 : nouveau chapitre "Révisions générales et annales BEPC" — pas
 *    créé précédemment (jugé trop générique), mais ce document a un vrai
 *    contenu méthodologique → créé maintenant.
 *
 * Usage : node scripts/seed-maths-3e-reel.mjs [--dry-run]
 */
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DRY_RUN = process.argv.includes('--dry-run')

const env = Object.fromEntries(
  readFileSync(join(__dirname, '..', 'apps', 'web', '.env.local'), 'utf-8')
    .split('\n').filter((l) => l.includes('=') && !l.startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] })
)
const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY

async function sb(path, init) {
  const res = await fetch(`${SUPABASE_URL}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', apikey: SERVICE_ROLE_KEY, Authorization: `Bearer ${SERVICE_ROLE_KEY}`, Prefer: 'return=representation', ...(init?.headers ?? {}) },
  })
  const text = await res.text()
  const json = text ? JSON.parse(text) : null
  if (!res.ok) throw new Error(`${init?.method ?? 'GET'} ${path} -> HTTP ${res.status}: ${JSON.stringify(json)}`)
  return json
}

const CHAPTERS = [
  {
    code: 'M3E-1', mode: 'replace',
    titre: 'Activités numériques : nombres relatifs, fractions, puissances',
    cours: `### Nombres relatifs
Un nombre relatif est un nombre positif ou négatif. Exemple : +3, -5, 0.

**Règles**
- Addition de deux nombres de même signe : on garde le signe et on additionne les valeurs absolues.
- Addition de deux nombres de signes contraires : on prend le signe du plus grand et on soustrait les valeurs absolues.
- Multiplication/Division : même signe = positif, signes contraires = négatif.

**Exemples**
- Calculer A = (-5) + (+3) → A = -2 (signes contraires : 5-3=2, signe du plus grand = négatif)
- Calculer B = (-4) × (-7) → B = +28 (même signe = positif)

### Fractions
Une fraction est un quotient a/b où a et b sont des entiers (b ≠ 0).

**Règles**
- Simplification : on divise numérateur et dénominateur par un même nombre.
- Addition/Soustraction : on réduit au même dénominateur.
- Multiplication : on multiplie les numérateurs entre eux et les dénominateurs entre eux.
- Division : multiplier par l'inverse.

**Exemples**
- Simplifier 12/18 → 12/18 = (6×2)/(6×3) = 2/3
- Calculer 3/4 + 5/6 → 9/12 + 10/12 = 19/12

### Puissances de 10
10ⁿ = 1 suivi de n zéros. 10⁻ⁿ = 0,00...01 (n zéros après la virgule).

**Règles**
- 10ⁿ × 10ᵐ = 10ⁿ⁺ᵐ
- 10ⁿ / 10ᵐ = 10ⁿ⁻ᵐ
- (10ⁿ)ᵐ = 10ⁿˣᵐ
- Notation scientifique : a × 10ⁿ où 1 ≤ a < 10

**Exemples**
- Écrire 3500 en notation scientifique → 3500 = 3,5 × 10³
- Calculer 10⁵ × 10⁻² → 10⁵⁻² = 10³ = 1000

### À retenir
- Nombres relatifs : mêmes signes = +, signes contraires = -
- Fractions : même dénominateur pour additionner
- 10ⁿ × 10ᵐ = 10ⁿ⁺ᵐ
- Notation scientifique : a × 10ⁿ avec 1 ≤ a < 10`,
    exercises: [
      { level: 1, enonce: 'Calculer A = (-7) + (+4).', corrige: 'A = -3' },
      { level: 1, enonce: 'Simplifier 15/25.', corrige: '15/25 = 3/5' },
      { level: 2, enonce: 'Calculer B = 2/3 + 5/9.', corrige: 'B = 6/9 + 5/9 = 11/9' },
      { level: 2, enonce: 'Écrire 0,0045 en notation scientifique.', corrige: '0,0045 = 4,5 × 10⁻³' },
      { level: 3, enonce: 'Calculer C = (2 × 10⁵) × (3 × 10⁻²).', corrige: 'C = 6 × 10³ = 6000' },
    ],
  },
  {
    code: 'M3E-2', mode: 'replace',
    titre: 'Calcul littéral : développer, factoriser, équations',
    cours: `### Développer
- k(a+b) = ka + kb
- k(a-b) = ka - kb
- (a+b)(c+d) = ac + ad + bc + bd

**Exemples**
- Développer 3(x+5) → 3(x+5) = 3x + 15
- Développer (x+2)(x+3) → x² + 3x + 2x + 6 = x² + 5x + 6

### Factoriser
- ka + kb = k(a+b) (facteur commun k)
- ka - kb = k(a-b)

**Exemples**
- Factoriser 5x + 15 → 5x + 15 = 5(x + 3)
- Factoriser 4x² - 8x → 4x² - 8x = 4x(x - 2)

### Équations du 1er degré
- On peut ajouter ou soustraire un même nombre aux deux membres.
- On peut multiplier ou diviser par un même nombre non nul les deux membres.

**Exemples**
- Résoudre 3x + 5 = 14 → 3x = 9, donc x = 3
- Résoudre 2x - 7 = x + 3 → x = 10

### Équations-produits
Si (ax+b)(cx+d) = 0, alors ax+b = 0 ou cx+d = 0.

**Exemple**
- Résoudre (2x-4)(x+3) = 0 → 2x-4=0 donc x=2, ou x+3=0 donc x=-3. Solutions : 2 et -3.

### À retenir
- k(a+b) = ka + kb
- (a+b)(c+d) = ac + ad + bc + bd
- ka + kb = k(a+b)
- Produit nul : (ax+b)(cx+d)=0 ⟹ ax+b=0 ou cx+d=0`,
    exercises: [
      { level: 1, enonce: 'Développer 4(x-3).', corrige: '4x - 12' },
      { level: 1, enonce: 'Factoriser 7x + 21.', corrige: '7(x + 3)' },
      { level: 2, enonce: 'Résoudre 5x - 3 = 2x + 9.', corrige: '3x = 12, x = 4' },
      { level: 2, enonce: 'Développer (2x+1)(x-4).', corrige: '2x² - 8x + x - 4 = 2x² - 7x - 4' },
      { level: 3, enonce: 'Résoudre (3x+6)(2x-8) = 0.', corrige: '3x+6=0 donc x=-2, ou 2x-8=0 donc x=4. Solutions : -2 et 4' },
    ],
  },
  {
    code: 'M3E-5', mode: 'replace',
    titre: 'Trigonométrie dans le triangle rectangle',
    cours: `### Définitions
Dans un triangle rectangle ABC (angle droit en A) :
- cos(B) = AB/BC (côté adjacent / hypoténuse)
- sin(B) = AC/BC (côté opposé / hypoténuse)
- tan(B) = AC/AB (côté opposé / côté adjacent)

**Moyen mnémotechnique** : CAH SOH TOA — Cos = Adjacent/Hypoténuse, Sin = Opposé/Hypoténuse, Tan = Opposé/Adjacent.

### Relations
- cos²(B) + sin²(B) = 1
- tan(B) = sin(B)/cos(B)

**Exemple**
- cos(B) = 0,6. Calculer sin(B) → sin²(B) = 1 - 0,36 = 0,64, donc sin(B) = 0,8

### Calculs
**Exemples**
- Triangle ABC rectangle en A, AB=3cm, BC=5cm. Calculer cos(B) et AC → cos(B) = 3/5 = 0,6 ; AC = √(5²-3²) = √16 = 4cm
- Triangle ABC rectangle en A, AB=4cm, AC=3cm. Calculer tan(B) et l'angle B → tan(B) = 3/4 = 0,75 ; B ≈ 37°

### À retenir
- cos = Adjacent/Hypoténuse
- sin = Opposé/Hypoténuse
- tan = Opposé/Adjacent
- cos² + sin² = 1`,
    exercises: [
      { level: 1, enonce: 'Triangle rectangle, côté adjacent = 5, hypoténuse = 13. Calculer cos.', corrige: 'cos = 5/13' },
      { level: 2, enonce: 'cos(B) = 0,8. Calculer sin(B).', corrige: 'sin(B) = 0,6' },
      { level: 3, enonce: "Échelle de 5m appuyée sur un mur, pied à 3m du mur. Calculer la hauteur atteinte.", corrige: 'h = √(5²-3²) = 4m' },
    ],
  },
  {
    code: 'M3E-6', mode: 'replace',
    titre: 'Repérage dans le plan',
    cours: `### Coordonnées
Dans un repère (O,I,J), un point M a pour coordonnées (x;y) où x est l'abscisse et y l'ordonnée.

**Exemple**
- A(2;3), B(-1;4). Placer A et B → A : 2 sur l'axe x, 3 sur l'axe y. B : -1 sur x, 4 sur y.

### Distance
AB = √[(xB-xA)² + (yB-yA)²]

**Exemple**
- A(1;2), B(4;6). Calculer AB → AB = √[(4-1)²+(6-2)²] = √(9+16) = √25 = 5

### Milieu
M milieu de [AB] : xM = (xA+xB)/2, yM = (yA+yB)/2

**Exemple**
- A(2;5), B(6;3). Calculer M → xM = 4, yM = 4, donc M(4;4)

### Vecteurs dans un repère
Le vecteur AB a pour coordonnées (xB-xA ; yB-yA)

**Exemple**
- A(1;2), B(5;4) → AB(4;2)

### À retenir
- Distance : AB = √[(xB-xA)² + (yB-yA)²]
- Milieu : xM = (xA+xB)/2, yM = (yA+yB)/2
- Vecteur AB(xB-xA ; yB-yA)`,
    exercises: [
      { level: 1, enonce: 'A(2;3), B(5;7). Calculer AB.', corrige: 'AB = 5' },
      { level: 1, enonce: 'A(-1;4), B(3;2). Calculer M milieu de [AB].', corrige: 'M(1;3)' },
      { level: 2, enonce: 'A(0;0), B(3;4), C(6;0). Montrer que ABC est isocèle.', corrige: 'AB=5, BC=5, donc isocèle en B' },
      { level: 3, enonce: 'A(1;2), B(5;6), C(3;0). Montrer que ABC est un triangle rectangle.', corrige: 'AB²=32, AC²=8, BC²=40. AB²+AC²=BC², donc rectangle en A' },
    ],
  },
  // ── Chapitres avec cours déjà en place : exercices seulement ──
  {
    code: 'M3E-3', mode: 'exercises-only', titre: 'Théorème de Thalès',
    exercises: [
      { level: 1, enonce: 'AB=10, AM=4, AC=15, (MN)//(BC). Calculer AN.', corrige: 'AN = 6' },
      { level: 2, enonce: 'Triangle réduit de rapport 0,5. AB=12cm. Calculer A\'B\'.', corrige: "A'B' = 6cm" },
      { level: 3, enonce: 'AM=5, AB=15, AN=7, AC=21. Montrer que (MN)//(BC).', corrige: 'AM/AB = 5/15 = 1/3, AN/AC = 7/21 = 1/3. Donc parallèles.' },
    ],
  },
  {
    code: 'M3E-4', mode: 'exercises-only', titre: 'Transformations du plan',
    exercises: [
      { level: 1, enonce: 'ABCD parallélogramme. Citer un vecteur égal à AD.', corrige: 'AD = BC' },
      { level: 2, enonce: 'Simplifier AB + BC + CA.', corrige: 'AB + BC + CA = AA = vecteur nul' },
      { level: 3, enonce: 'Construire D tel que ABCD soit un parallélogramme.', corrige: 'D = translaté de C par le vecteur AB' },
    ],
  },
  {
    code: 'M3E-7', mode: 'exercises-only', titre: "Systèmes d'équations du 1er degré à deux inconnues",
    exercises: [
      { level: 1, enonce: 'Résoudre {x+y=7 ; x-y=3}.', corrige: '(5;2)' },
      { level: 2, enonce: 'Résoudre {2x+3y=16 ; x-y=2}.', corrige: '(22/5 ; 12/5)' },
      { level: 3, enonce: 'Un groupe de 15 personnes paie 180F. Adultes 15F, enfants 10F. Combien d\'adultes et d\'enfants ?', corrige: '12 adultes, 3 enfants' },
    ],
  },
  {
    code: 'M3E-8', mode: 'exercises-only', titre: 'Pyramide et cône de révolution',
    exercises: [
      { level: 1, enonce: 'Cylindre, R=2cm, h=7cm. Calculer V.', corrige: 'V = 28π ≈ 88cm³' },
      { level: 2, enonce: 'Pyramide, base carrée 6cm de côté, hauteur 9cm. Calculer V.', corrige: 'V = (1/3) × 36 × 9 = 108cm³' },
      { level: 3, enonce: 'Sphère, R=5cm. Calculer V et aire.', corrige: 'V = (4/3)π × 125 ≈ 523,6cm³, Aire = 4π × 25 ≈ 314cm²' },
    ],
  },
  {
    code: 'M3E-9', mode: 'exercises-only', titre: 'Statistiques',
    exercises: [
      { level: 1, enonce: 'Notes : 10, 12, 14, 16. Calculer la moyenne.', corrige: '13' },
      { level: 1, enonce: '5kg de pommes coûtent 2500F. Prix de 8kg ?', corrige: '4000F' },
      { level: 2, enonce: 'Article à 8000F, réduction de 25%. Nouveau prix ?', corrige: '6000F' },
      { level: 3, enonce: 'Carte à l\'échelle 1/100000. Distance réelle 15km. Distance sur la carte ?', corrige: '15cm' },
    ],
  },
  // ── Nouveau chapitre (contenu méthodologique réel) ──
  {
    code: 'M3E-10', mode: 'create', titre: 'Révisions générales et annales BEPC', month: 'Mai 2026',
    cours: `### Méthode de révision par chapitre
- Relire les fiches "À retenir" de chaque chapitre.
- Refaire les exemples et exercices déjà vus.
- Identifier ses points faibles et y revenir en priorité.

### Structure d'un sujet type BEPC
- Exercice 1 : Activités numériques (4-5 points)
- Exercice 2 : Calcul littéral (4-5 points)
- Exercice 3 : Géométrie (6-7 points)
- Exercice 4 : Problèmes (4-5 points)

**Conseils** : bien lire l'énoncé, commencer par les exercices faciles, soigner la présentation, vérifier les résultats.

### Erreurs fréquentes à éviter
- Signes dans les nombres relatifs
- Développement (a+b)(c+d) = ac + bd (faux ! il manque ad + bc)
- Thalès : mauvais rapports
- Trigonométrie : confondre cos, sin, tan
- Systèmes : erreurs de calcul

### À retenir
- Relire les fiches de synthèse de chaque chapitre.
- S'entraîner en temps limité.
- Analyser ses erreurs après chaque exercice.`,
    exercises: [
      { level: 3, enonce: 'Sujet BEPC complet (2h), les 4 exercices type.', corrige: 'Voir les annales corrigées de chaque chapitre.' },
    ],
  },
]

function statementFromExercise(ex) { return ex.enonce }
function solutionFromExercise(ex) { return ex.corrige }

async function main() {
  console.log(DRY_RUN ? '=== DRY RUN ===' : '=== Écriture en base ===')

  const [subject] = await sb('/rest/v1/subjects?level=eq.bepc&name=eq.Math%C3%A9matiques&select=id')
  const months = await sb('/rest/v1/school_months?select=id,label,term_id')
  const monthByLabel = Object.fromEntries(months.map((m) => [m.label, m]))

  let lessonsUpdated = 0, exercisesCreated = 0, chaptersCreated = 0

  for (const ch of CHAPTERS) {
    let [chapter] = await sb(`/rest/v1/chapters?subject_id=eq.${subject.id}&title=eq.${encodeURIComponent(ch.titre)}&select=id,title,order_index`)

    if (ch.mode === 'create') {
      if (!chapter) {
        const month = monthByLabel[ch.month]
        if (DRY_RUN) { console.log(`[dry-run] créerait chapitre "${ch.titre}" (${ch.code}) → ${ch.month}`); chapter = { id: 'dry-chapter' } }
        else {
          const existing = await sb(`/rest/v1/chapters?subject_id=eq.${subject.id}&select=order_index&order=order_index.desc&limit=1`)
          const nextOrder = (existing[0]?.order_index ?? 0) + 1
          const [created] = await sb('/rest/v1/chapters', { method: 'POST', body: JSON.stringify({ subject_id: subject.id, title: ch.titre, order_index: nextOrder }) })
          chapter = created
          await sb('/rest/v1/curriculum_items', { method: 'POST', body: JSON.stringify({ subject_id: subject.id, chapter_id: chapter.id, item_type: 'chapter', school_month_id: month.id, term_id: month.term_id, is_core: true, order_index: nextOrder }) })
          console.log(`✓ Chapitre créé : ${ch.titre} (${ch.code})`)
          chaptersCreated++
        }
      } else {
        console.log(`… chapitre déjà présent : ${ch.titre}`)
      }
    } else if (!chapter) {
      console.warn(`⚠ Chapitre introuvable : "${ch.titre}" (${ch.code})`)
      continue
    }

    if (ch.mode === 'replace') {
      const [existing] = await sb(`/rest/v1/lessons?chapter_id=eq.${chapter.id}&type=eq.cours&select=id,content`)
      if (existing && existing.content === ch.cours) {
        console.log(`… cours déjà à jour : ${ch.titre}`)
      } else if (DRY_RUN) {
        console.log(`[dry-run] ${existing ? 'mettrait à jour' : 'créerait'} le cours "${ch.titre}" (${ch.cours.length} caractères)`)
      } else if (existing) {
        await sb(`/rest/v1/lessons?id=eq.${existing.id}`, { method: 'PATCH', body: JSON.stringify({ content: ch.cours }) })
        console.log(`✓ Cours mis à jour : ${ch.titre}`)
        lessonsUpdated++
      } else {
        await sb('/rest/v1/lessons', { method: 'POST', body: JSON.stringify({ chapter_id: chapter.id, type: 'cours', title: ch.titre, content: ch.cours, order_index: 0, is_premium: false }) })
        console.log(`✓ Cours créé : ${ch.titre}`)
        lessonsUpdated++
      }
    } else if (ch.mode === 'create' && !DRY_RUN) {
      await sb('/rest/v1/lessons', { method: 'POST', body: JSON.stringify({ chapter_id: chapter.id, type: 'cours', title: ch.titre, content: ch.cours, order_index: 0, is_premium: false }) })
      console.log(`✓ Cours créé : ${ch.titre}`)
    }

    if (ch.exercises && !(DRY_RUN && chapter.id === 'dry-chapter')) {
      const levelCount = {}
      for (const ex of ch.exercises) {
        levelCount[ex.level] = (levelCount[ex.level] ?? 0) + 1
        const suffix = levelCount[ex.level] > 1 ? ` (${levelCount[ex.level]})` : ''
        const title = `${ch.titre} (niveau ${'⭐'.repeat(ex.level)})${suffix}`
        const existing = DRY_RUN ? [] : await sb(`/rest/v1/exercises?chapter_id=eq.${chapter.id}&title=eq.${encodeURIComponent(title)}&select=id`)
        if (existing.length > 0) { console.log(`… exercice déjà présent : ${title}`); continue }
        if (DRY_RUN) { console.log(`[dry-run] créerait exercice "${title}"`); continue }
        const [created] = await sb('/rest/v1/exercises', {
          method: 'POST',
          body: JSON.stringify({ chapter_id: chapter.id, title, statement: statementFromExercise(ex), difficulty: ex.level, order_index: ex.level, is_premium: false }),
        })
        await sb('/rest/v1/exercise_solutions', { method: 'POST', body: JSON.stringify({ exercise_id: created.id, solution: solutionFromExercise(ex) }) })
        exercisesCreated++
      }
    }
  }

  console.log(`\n${DRY_RUN ? '[dry-run]' : 'Terminé.'} ${chaptersCreated} chapitre créé, ${lessonsUpdated} cours mis à jour/créés, ${exercisesCreated} exercices créés.`)
}

main().catch((e) => { console.error('✗', e); process.exit(1) })
