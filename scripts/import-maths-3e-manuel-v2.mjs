/**
 * Importe le contenu du second manuel Maths 3e (746308254-Cours-de-Maths-3eme.docx,
 * 20 chapitres, OCR'é via Gemini vision car le texte du docx était corrompu par un
 * bug d'encodage de police — cf. scratchpad/maths3e-v2).
 *
 *  - 7 chapitres correspondent à de VRAIS trous du programme (aucun chapitre BEPC
 *    existant ne les couvre) → créés avec cours complet + exercices + figures réelles
 *    extraites du docx (vecteurs, fonctions rationnelles, rapport de projection,
 *    droites-équations, angles inscrits, positions relatives droite-cercle).
 *  - 13 chapitres recoupent des chapitres déjà en place avec un bon "modèle des
 *    profs" → NON touchés au niveau du cours, seul 1 exercice réel supplémentaire
 *    est ajouté à chacun (mode exercises-only, même principe que le premier import).
 *
 * Les vecteurs égaux/opposés et les droites remarquables du triangle (médiane,
 * médiatrice), identifiés lors du premier import comme des trous sans image
 * correspondante, sont maintenant couverts par les chapitres "Vecteurs" et
 * "Droites et équations de droites" de ce manuel — avec leurs propres figures.
 * Le prisme/cylindre reste un trou : ce manuel ne le traite pas non plus (une
 * seule ligne de formule, aucune figure dédiée) — aucune image insérée pour ça.
 *
 * Usage : node scripts/import-maths-3e-manuel-v2.mjs [--dry-run]
 */
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DRY_RUN = process.argv.includes('--dry-run')
const IMG_DIR = 'C:/Users/miche/AppData/Local/Temp/claude/D--alpha-kelassi-new/e14b1709-c92a-401a-a7b0-afd9aea3502d/scratchpad/maths3e-v2/chapter_images'

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

const MIME = { png: 'image/png', jpeg: 'image/jpeg', jpg: 'image/jpeg', webp: 'image/webp', gif: 'image/gif' }
async function uploadImage(filename) {
  const ext = filename.split('.').pop().toLowerCase()
  const storagePath = `bepc-figures-v2/${filename}`
  const bytes = readFileSync(join(IMG_DIR, filename))
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/course-images/${encodeURIComponent(storagePath)}`, {
    method: 'POST',
    headers: { apikey: SERVICE_ROLE_KEY, Authorization: `Bearer ${SERVICE_ROLE_KEY}`, 'Content-Type': MIME[ext] ?? 'application/octet-stream', 'x-upsert': 'true' },
    body: bytes,
  })
  if (!res.ok) throw new Error(`Upload ${filename} -> HTTP ${res.status}: ${await res.text()}`)
  return `${SUPABASE_URL}/storage/v1/object/public/course-images/${storagePath}`
}

// ─────────────────────────────────────────────────────────────────────────
// 7 NOUVEAUX CHAPITRES (vrais trous du programme)
// ─────────────────────────────────────────────────────────────────────────
const NEW_CHAPTERS = [
  {
    titre: 'Vecteurs : addition et multiplication par un réel',
    month: 'Novembre 2025',
    images: [
      { file: 'ch02_p011_1383.png', label: 'Addition de deux vecteurs (règle du parallélogramme)' },
      { file: 'ch02_p016_3212.png', label: 'Vecteurs colinéaires : u, 2u, -u et 1,5u' },
    ],
    cours: `### 1. Vecteur : définition et notation
L'ensemble des points équipollents à un bipoint (A, B) s'appelle un **vecteur**. Deux bipoints (A, B) et (A′, B′) sont équipollents si le quadrilatère ABB′A′ est un parallélogramme. On note le vecteur AB, et un vecteur est défini par sa **direction**, son **sens** et sa **longueur**.

### 2. Addition vectorielle
**Relation de Chasles :** AB + BC = AC.

Le vecteur nul est noté 0 : AA = BB = CC = ... = 0. Deux vecteurs opposés ont une somme nulle : AB + BA = 0.

Lorsque deux vecteurs ont la même origine, leur somme est la diagonale du parallélogramme qu'ils forment (u = AB, v = AD ⟹ u + v = AC, avec ABCD parallélogramme).

![Addition de deux vecteurs (règle du parallélogramme)](IMG:ch02_p011_1383.png)

Lorsque l'extrémité de l'un correspond à l'origine de l'autre, leur somme est le 3ᵉ côté du triangle formé (u = AB, v = BC ⟹ u + v = AC).

**Propriétés :** l'addition vectorielle est commutative (u+v = v+u), associative ((u+v)+w = u+(v+w)), et admet 0 comme élément neutre (u+0 = u).

### 3. Multiplication d'un vecteur par un réel
**Définition :** A et B étant deux points distincts, k un réel quelconque, k·AB désigne le vecteur AC où C est le point d'abscisse k dans le repère (A, B). Plus généralement, pour un vecteur u et un réel k, il existe un vecteur v = k·u, appelé produit de u par k.

**Remarques :** quel que soit k, AB et AC = k·AB ont la même direction ; si k > 0 ils ont le même sens, si k < 0 des sens contraires. On a AC = |k| × AB.

**Propriétés :** pour tous réels x, y et vecteurs u, v :
- x(u + v) = xu + xv
- xu + yu = (x + y)u
- x(yu) = (xy)u

**Exemple :** A, B, C non alignés. On construit E et F tels que AE = 2AB et EF = 2BC. Alors AF = AE + EF = 2AB + 2BC = 2AC.

### 4. Vecteurs colinéaires
**Définition :** deux vecteurs non nuls u et v sont **colinéaires** s'il existe un réel k tel que v = k·u. Le vecteur nul est colinéaire à tout vecteur.

![Vecteurs colinéaires : u, 2u, -u et 1,5u](IMG:ch02_p016_3212.png)

**Caractérisation de l'alignement :** si AC et AB sont colinéaires, alors A, B, C sont alignés (et réciproquement).

**Exemple :** u ≠ 0, AB = 2u et BC = 6u. AC = AB + BC = 8u = 4×AB, donc AC et AB sont colinéaires : A, B, C sont alignés.

**Caractérisation du parallélisme :** si AB et EF (non nuls) sont colinéaires, alors (AB) et (EF) sont parallèles — et réciproquement.

**Exemple :** u = 2i + j et v = 6i + 3j (i, j non colinéaires). Comme v = 3(2i + j) = 3u, les vecteurs u et v sont colinéaires.

### À retenir
- Relation de Chasles : AB + BC = AC
- AC = k·AB ⟺ AC = |k| × AB, même sens si k > 0, sens contraires si k < 0
- u et v colinéaires ⟺ il existe k tel que v = k·u
- AB et AC colinéaires ⟺ A, B, C alignés ; AB et EF colinéaires ⟺ (AB) // (EF)`,
    exercises: [
      { level: 1, enonce: "(Δ) est une droite graduée (unité 1cm). Les points A, B, C, D ont pour abscisses 3, -2, -1 et 5. Établir une relation entre les vecteurs DC et DA.", corrige: "DC = |k|·DA avec k = DC/DA = (−1−5)/(3−5) = 3, même sens, donc DC = 3·DA." },
      { level: 2, enonce: "A, B, C sont trois points non alignés. M est défini par AM = AB + AC + 3(BC + 2CA). Réduire le vecteur AM.", corrige: "AM = AB + AC + 3BC + 6CA. En regroupant via Chasles, on réduit à une seule expression du type k·AB + k'·AC, ce qui permet de placer M." },
      { level: 2, enonce: "u et v sont deux vecteurs non colinéaires. On pose w = 2u + v et t = 6u + 3v. Montrer que w et t sont colinéaires.", corrige: "t = 6u + 3v = 3(2u + v) = 3w, donc t et w sont colinéaires." },
    ],
  },
  {
    titre: 'Coordonnées d\'un vecteur',
    month: 'Février 2026',
    images: [
      { file: 'ch03_p017_3416.jpeg', label: 'Repère cartésien du plan (O ; i, j)' },
      { file: 'ch03_p022_4233.png', label: "Segment [AA'] : A' symétrique de A par rapport à I" },
    ],
    cours: `### 1. Repère du plan
Soit O un point du plan, i et j deux vecteurs non nuls et non colinéaires. Le triplet (O ; i, j) est appelé **repère cartésien** du plan. Le repère est **normé** si OI = OJ = 1, **orthonormé** si en plus les axes sont orthogonaux.

![Repère cartésien du plan (O ; i, j)](IMG:ch03_p017_3416.jpeg)

### 2. Coordonnées d'un vecteur
Si OM = x·i + y·j, on note OM(x ; y) et M(x ; y) : x et y sont les coordonnées du vecteur OM.

**Coordonnées de AB :** pour A(xA ; yA) et B(xB ; yB), le vecteur AB a pour coordonnées (xB − xA ; yB − yA), car AB = AO + OB = (xB−xA)i + (yB−yA)j.

**Égalité de deux vecteurs :** u(x ; y) = v(x′ ; y′) équivaut à x = x′ et y = y′.

### 3. Coordonnées et opérations
- **Somme :** u(x ; y) + v(x′ ; y′) = (x + x′ ; y + y′)
- **Différence :** u(x ; y) − v(x′ ; y′) = (x − x′ ; y − y′)
- **Produit par un réel k :** k·v(x ; y) = (kx ; ky)

**Exemple :** u = −2i − 4j, v = 3i + j. On a u + v = (−5 ; −3) et u − v = (−5 ; −5).

### 4. Condition de colinéarité de deux vecteurs
Pour u(x ; y) et v(x′ ; y′) : **u et v sont colinéaires si et seulement si x·y′ − x′·y = 0.**

**Exercice type :** A(6 ; −6), B(10 ; 8), C(0 ; −2), D(3 ; 5). Les vecteurs AB et CD sont-ils colinéaires ? On a AB(4 ; 14) et CD(3 ; 7) : 4×7 − 3×14 = 28 − 42 = −14 ≠ 0, donc AB et CD ne sont pas colinéaires.

### 5. Applications de l'égalité de deux vecteurs
**Centre d'un parallélogramme :** ABCD est un parallélogramme si AB = DC. Le centre K (intersection des diagonales) est le milieu de [AC] et de [BD] :

xK = (xA + xC)/2 = (xB + xD)/2, et de même pour yK.

**Symétrie centrale :** A′ symétrique de A par rapport à I(xI ; yI) vérifie xA′ = 2xI − xA et yA′ = 2yI − yA.

![Segment [AA'] : A' symétrique de A par rapport à I](IMG:ch03_p022_4233.png)

**Translation de vecteur u :** l'image M′ de M vérifie MM′ = u, donc xM′ = xM + x et yM′ = yM + y (avec u(x ; y)).

### À retenir
- AB(xB − xA ; yB − yA)
- u + v (x+x′ ; y+y′), u − v (x−x′ ; y−y′), k·u (kx ; ky)
- u et v colinéaires ⟺ x·y′ − x′·y = 0
- Milieu / centre de parallélogramme : moyenne des coordonnées`,
    exercises: [
      { level: 1, enonce: "Dans le repère (O ; i, j), on donne A, B, C tels que OA = −2i, OC = −3j et OB = i − j. Préciser les coordonnées de A, B et C.", corrige: "A(−2 ; 0), B(1 ; −1), C(0 ; −3)." },
      { level: 2, enonce: "A(−2 ; 3), B(1 ; −1), C(0 ; −3). Calculer les coordonnées des vecteurs AB, AC et BC.", corrige: "AB(3 ; −4), AC(2 ; −6), BC(−1 ; −2)." },
      { level: 3, enonce: "Dans le repère (O, i, j), les points A, B, C vérifient OA = i + j, BO = 3i − 2j et AC = −3i − 4j. Déterminer les coordonnées de A, B et C.", corrige: "A(1 ; 1). BO(3 ; −2) donc OB(−3 ; 2), B(−3 ; 2). AC(−3 ; −4) donc C = A + AC = (1−3 ; 1−4) = (−2 ; −3)." },
    ],
  },
  {
    titre: 'Fonctions rationnelles',
    month: 'Juin 2026',
    images: [],
    cours: `### 1. Définition
On appelle **fonction rationnelle** toute fonction dont l'expression est le quotient de deux polynômes. Si f et g sont deux polynômes, l'application q telle que q(x) = f(x)/g(x) (avec g(x) ≠ 0) est une fonction rationnelle.

**Exemple :** q(x) = (x + 3)/(x − 1). On constate que 1 n'a pas d'image par q, car cela annulerait le dénominateur.

### 2. Domaine de définition
Une fonction rationnelle n'a de sens que si son dénominateur est différent de 0. Pour q(x) = (x+3)/(x−1) : x − 1 ≠ 0 ⟺ x ≠ 1, donc Dq = IR − {1} = ]−∞ ; 1[ ∪ ]1 ; +∞[.

**Exemple :** h(x) = (2x−3)/[(−x+2)(x+4)]. Le dénominateur s'annule pour x = 2 et x = −4, donc Dh = IR − {−4 ; 2}.

### 3. Simplification d'une fonction rationnelle
Pour simplifier une fonction rationnelle, il faut :
1. Factoriser le numérateur et/ou le dénominateur si nécessaire.
2. Préciser le domaine de définition (une fonction n'est simplifiable que sur son domaine).
3. Simplifier les facteurs communs.

**Exemple :** q(x) = [2(x+3) + x² − 9] / (x² + 6x + 9). Le numérateur devient 2x+6+x²−9 = x²+2x−3 = (x−1)(x+3), et le dénominateur (x+3)². Sur Dq = IR − {−3}, q(x) = (x−1)(x+3)/(x+3)² = (x−1)/(x+3).

### 4. Images et antécédents
On calcule une image en remplaçant x par sa valeur (si elle appartient au domaine). On trouve un antécédent en résolvant l'équation f(x) = valeur donnée.

**Exemple :** r(x) = (2x−1)(−x+3). Image de −1 : r(−1) = (−3)(4) = −12. Pour trouver l'antécédent de 0 par r : (2x−1)(−x+3) = 0 ⟺ x = 1/2 ou x = 3.

### À retenir
- Fonction rationnelle : q(x) = f(x)/g(x), définie si g(x) ≠ 0
- Toujours préciser le domaine avant de simplifier
- Une fonction rationnelle ne se simplifie que sur son domaine de définition`,
    exercises: [
      { level: 1, enonce: "Déterminer le domaine de définition de q(x) = (4x+4)(2x−1) / [2(3x−1)(2x−1)].", corrige: "Le dénominateur s'annule pour x = 1/3 ou x = 1/2, donc Dq = IR − {1/3 ; 1/2}." },
      { level: 2, enonce: "Simplifier q(x) = (4x+4)(2x−1) / [2(3x−1)(2x−1)] sur son domaine.", corrige: "En simplifiant le facteur commun (2x−1) : q(x) = 4(x+1) / [2(3x−1)] = 2(x+1)/(3x−1)." },
      { level: 3, enonce: "Résoudre dans le domaine de définition l'équation q(x) = 2/3 pour q(x) = 2(x+1)/(3x−1).", corrige: "2(x+1)/(3x−1) = 2/3 ⟺ 6(x+1) = 2(3x−1) ⟺ 6x+6 = 6x−2 ⟺ 6 = −2, impossible : aucune solution." },
    ],
  },
  {
    titre: 'Rapport de projection',
    month: 'Novembre 2025',
    images: [
      { file: 'ch08_p037_7597.jpeg', label: 'Projection des points A, B, M de (D) sur (D\') parallèlement à (Δ)' },
      { file: 'ch08_p039_7807.png', label: 'Cas particulier : droites (Δ) et (Δ\') parallèles, k = 1' },
    ],
    cours: `### 1. Rapport de projection suivant la direction d'une droite
Soient (D) et (D′) deux droites sécantes en O, et (Δ) une droite non parallèle à (D) ni à (D′). Pour des points A, B, M de (D), on note A′, B′, M′ leurs **projetés** sur (D′) parallèlement à (Δ).

![Projection des points A, B, M de (D) sur (D\') parallèlement à (Δ)](IMG:ch08_p037_7597.jpeg)

On constate que les rapports OM′/OM, OA′/OA, OB′/OB et A′B′/AB sont tous égaux à un même nombre k, appelé **rapport de projection** de (D) sur (D′) parallèlement à (Δ) :

k = OM′/OM = OA′/OA = OB′/OB = A′B′/AB = (distance des projections) / (distance des points)

**Remarque :** le rapport de projection de (D′) sur (D) est k′ = AB/A′B′ = 1/k.

### 2. Rapport de projection orthogonale
Lorsque la direction de projection (Δ) est perpendiculaire à (D′), on parle de **projection orthogonale**. Pour deux droites sécantes (Δ) et (Δ′), avec A, M sur (Δ) et A′, M′ leurs projetés orthogonaux sur (Δ′) :

k = OM′/OM = OA′/OA = A′M′/AM

**Propriété :** le rapport de projection orthogonale de (Δ) sur (Δ′) est égal à celui de (Δ′) sur (Δ) : k = k′.

### 3. Cas particuliers
- Si (Δ) et (Δ′) sont **perpendiculaires**, le rapport de projection orthogonale est nul : k = 0.
- Si (Δ) et (Δ′) sont **parallèles**, le rapport de projection orthogonale vaut 1 : k = A′B′/AB = 1 (car AB = A′B′).

![Cas particulier : droites (Δ) et (Δ\') parallèles, k = 1](IMG:ch08_p039_7807.png)

### À retenir
- k = OM′/OM = OA′/OA = A′B′/AB (rapport de projection)
- Rapport de (D′) sur (D) : k′ = 1/k
- Droites perpendiculaires ⟹ k = 0 ; droites parallèles ⟹ k = 1
- Ce rapport sert notamment à démontrer les relations métriques du triangle rectangle (théorème de Pythagore)`,
    exercises: [
      { level: 1, enonce: "Construire un triangle ABC tel que AB=5cm, BC=6cm, AC=7cm. Calculer le rapport de projection k de (BC) sur (AB) parallèlement à (AC), sachant que le projeté de C sur (AB) parallèlement à (AC) est A lui-même et celui de B est B.", corrige: "k = A'B'/AB où A'=A et B'=B (car B et C se projettent sur eux-mêmes le long de (AC) qui passe par A) : k = AB/AB = 1 dans ce cas particulier ; en général on mesure les longueurs projetées sur la figure." },
      { level: 2, enonce: "(Δ) et (Δ′) sont perpendiculaires en O. Un point A de (Δ) a pour projeté orthogonal A′ sur (Δ′). Que vaut le rapport de projection k de (Δ) sur (Δ′) ?", corrige: "k = 0, car les droites étant perpendiculaires, tout point de (Δ) se projette en O sur (Δ′) (sauf si le point est O lui-même) : la distance projetée est nulle." },
      { level: 3, enonce: "Tracer (Δ), placer O, A, B tels que OA=2cm, OB=5cm. Tracer (Δ′) perpendiculaire à (Δ) en O. Construire les projetés orthogonaux O′, A′, B′ de O, A, B sur (Δ′). Calculer le rapport de projection k de AB sur (Δ′).", corrige: "Comme (Δ) ⊥ (Δ′), tous les points de (Δ) se projettent en O sur (Δ′) : A′ = B′ = O′ = O, donc A′B′ = 0 et k = A′B′/AB = 0." },
    ],
  },
  {
    titre: 'Droites et équations de droites',
    month: 'Mars 2026',
    images: [
      { file: 'ch12_p064_12068.png', label: 'Médiatrice (Δ) du segment [EF]' },
      { file: 'ch12_p065_12073.jpeg', label: 'Médiane (D) d\'un triangle EIG issue de I' },
    ],
    cours: `### 1. Vecteur directeur d'une droite
Étant donnés deux points A et B d'une droite (D), tout vecteur u non nul et colinéaire à AB est appelé **vecteur directeur** de (D). Si M appartient à (D), alors AM et u sont colinéaires — et réciproquement.

### 2. Équation cartésienne d'une droite
Dans un repère (O, i, j), une équation cartésienne d'une droite (D) est de la forme **ax + by + c = 0** (a, b non tous nuls). Le vecteur v(−b ; a) est alors un vecteur directeur de (D).

**Exemple :** (D) passe par A(2 ; −3) avec vecteur directeur u(−1 ; 2). Pour M(x ; y) ∈ (D), AM(x−2 ; y+3) est colinéaire à u : (x−2)×2 − (y+3)×(−1) = 0, soit **(D) : 2x + y − 1 = 0**.

**Remarque :** une droite a une infinité d'équations : pour tout k ≠ 0, k(ax+by+c) = 0 est aussi une équation de (D).

### 3. Forme réduite
ax + by + c = 0 (b≠0) équivaut à **y = mx + p**, avec m = −a/b (la **pente** ou coefficient directeur) et p (l'ordonnée à l'origine). Le vecteur (1 ; m) est alors un vecteur directeur de (D).

### 4. Cas particuliers
- Droite parallèle à l'axe des abscisses : équation **y = b**.
- Droite parallèle à l'axe des ordonnées : équation **x = a** (pas de pente).
- Droite passant par l'origine : équation **y = ax**.

### 5. Droites parallèles, droites perpendiculaires
**Parallélisme :** deux droites (D) et (D′) sont parallèles si et seulement si leurs vecteurs directeurs sont colinéaires — ce qui équivaut à avoir le même coefficient directeur (si aucune n'est verticale).

**Perpendicularité :** deux droites (D) et (D′) de pentes a et a′ sont perpendiculaires si et seulement si a × a′ = −1 (ce qui équivaut à l'orthogonalité de leurs vecteurs directeurs (1;a) et (1;a′) : 1 + a·a′ = 0).

### 6. Médiatrice d'un segment
La **médiatrice** d'un segment [EF] est la droite perpendiculaire à [EF] en son milieu. Pour la déterminer : calculer le milieu I de [EF], puis écrire que pour M(x;y) sur la médiatrice, le vecteur IM est orthogonal au vecteur EF.

![Médiatrice (Δ) du segment [EF]](IMG:ch12_p064_12068.png)

**Exemple :** B(−2 ; 5), C(−1 ; −3). Milieu I(−3/2 ; 1). Vecteur BC(1 ; −8). Pour M(x;y) sur la médiatrice : IM(x+3/2 ; y−1) orthogonal à BC(1;−8) : (x+3/2) − 8(y−1) = 0.

### 7. Médiane et hauteur d'un triangle
La **médiane** issue d'un sommet passe par ce sommet et le milieu du côté opposé. La **hauteur** issue d'un sommet est perpendiculaire au côté opposé.

![Médiane (D) d\'un triangle EIG issue de I](IMG:ch12_p065_12073.jpeg)

**Exemple (médiane) :** A(−1 ; −2), B(3 ; 1), C(2 ; −3). Médiane issue de B : K milieu de [AC] = (1/2 ; −5/2). Vecteur directeur BK(1/2−3 ; −5/2−1) = (−5/2 ; −7/2), colinéaire à (5 ; 7). Pour M(x;y) sur la médiane : BM(x−3 ; y−1) colinéaire à (5;7) : 7(x−3) − 5(y−1) = 0, soit 7x − 5y − 16 = 0.

**Centre de gravité :** xG = (xA+xB+xC)/3, yG = (yA+yB+yC)/3.

**Exemple (hauteur) :** A(2 ;−3), B(1 ;1), C(3 ;−1). Hauteur issue de C : H(x;y) tel que CH(x−3 ; y+1) soit orthogonal à AB(−1 ; 8) : −(x−3) + 8(y+1) = 0, soit x − 8y − 11 = 0.

### À retenir
- (D) : ax+by+c=0, vecteur directeur (−b;a), pente m = −a/b (forme y=mx+p)
- Parallèles ⟺ vecteurs directeurs colinéaires (même pente) ; perpendiculaires ⟺ a×a′ = −1
- Médiatrice de [EF] : perpendiculaire en le milieu ; médiane : passe par un sommet et le milieu du côté opposé ; hauteur : perpendiculaire au côté opposé depuis un sommet`,
    exercises: [
      { level: 1, enonce: "Les droites (D): y=−2x−7 et (D′): 2x+7y−1=0 sont-elles parallèles ?", corrige: "(D′) en forme réduite : y = −(2/7)x + 1/7, pente −2/7. (D) a pour pente −2. Les pentes sont différentes, donc (D) et (D′) ne sont pas parallèles." },
      { level: 2, enonce: "Le plan est muni d'un repère (O,i,j). On donne (D): −(1/2)x+2y−1=0 et (Δ):4x+y=3. Démontrer que (D) et (Δ) sont perpendiculaires en utilisant les vecteurs directeurs.", corrige: "Vecteur directeur de (D) : (2 ; 1/2) (ou (4;1) en multipliant par 2) ; de (Δ) : (1 ; −4). Produit scalaire : 4×1 + 1×(−4) = 0, donc les droites sont perpendiculaires." },
      { level: 3, enonce: "A(−1 ;−2), B(3 ;1), C(2 ;−3). Calculer les coordonnées du centre de gravité G du triangle ABC.", corrige: "xG = (−1+3+2)/3 = 4/3, yG = (−2+1−3)/3 = −4/3, donc G(4/3 ; −4/3)." },
    ],
  },
  {
    titre: 'Angles inscrits',
    month: 'Avril 2026',
    images: [
      { file: 'ch14_p076_13784.jpeg', label: 'Angle inscrit AMB et angle au centre associé AOB (cas aigu et obtus)' },
    ],
    cours: `### 1. Angle inscrit et angle au centre associé
A, B, M sont trois points distincts d'un cercle (C) de centre O. Les segments [MA] et [MB] sont des **cordes**. L'angle AMB est un **angle inscrit** dans le cercle (son sommet M est sur le cercle) : il **intercepte** l'arc AB. L'angle AOB, dont le sommet est le centre et qui intercepte le même arc, est l'**angle au centre associé**.

**Constat expérimental :** l'angle au centre AOB est toujours le double de l'angle inscrit AMB.

### 2. Théorème de l'angle inscrit
Si A, B, M sont trois points distincts d'un cercle (C) de centre O, alors **AOB = 2 × AMB**, soit AMB = (1/2) × AOB.

![Angle inscrit AMB et angle au centre associé AOB (cas aigu et obtus)](IMG:ch14_p076_13784.jpeg)

**Démonstration (1er cas — O sur un côté de l'angle inscrit) :** le triangle OBM est isocèle en O (OM = OB), donc AMB = OBM. Dans ce triangle : OMB + OBM + BOM = 180°, soit 2·AMB + BOM = 180°. Or AOM = AOB + BOM = 180° (angle plat). On en déduit AOB = 2·AMB.

**2e cas (O à l'intérieur de l'angle) :** on trace le diamètre [MP] et on applique le 1er cas aux angles AOP/AMP et BOP/BMP séparément, puis on additionne.

### 3. Application : triangle inscrit dans un demi-cercle
**Théorème :** si un triangle ABC est inscrit dans un cercle de diamètre [AB], alors ABC est rectangle en C.

**Démonstration :** l'angle AMB intercepte l'arc AB, et l'angle au centre associé AOB est un angle plat (180°, car A, O, B sont alignés — [AB] est un diamètre). D'après le théorème de l'angle inscrit : AMB = (1/2)×180° = 90°.

### 4. Angles inscrits interceptant le même arc
**Propriété :** si deux angles inscrits interceptent le même arc, alors ils ont la même mesure.

**Justification :** chacun des deux angles inscrits est la moitié du même angle au centre associé, donc ils sont égaux.

### À retenir
- Angle inscrit AMB, angle au centre associé AOB (même arc) : AOB = 2 × AMB
- Triangle inscrit dans un demi-cercle (diamètre [AB]) ⟹ rectangle au 3ᵉ sommet
- Deux angles inscrits interceptant le même arc sont égaux`,
    exercises: [
      { level: 1, enonce: "A, B, M sont sur un cercle de centre O. L'angle inscrit AMB mesure 35°. Quelle est la mesure de l'angle au centre associé AOB ?", corrige: "AOB = 2 × AMB = 2 × 35° = 70°." },
      { level: 2, enonce: "ABC est un triangle inscrit dans un cercle de diamètre [AB]. Quelle est la nature du triangle ABC ? Justifier.", corrige: "ABC est rectangle en C, car un triangle inscrit dans un cercle dont un côté est un diamètre est toujours rectangle au sommet opposé à ce diamètre (angle inscrit = moitié de l'angle plat au centre = 90°)." },
      { level: 3, enonce: "Soit ABC un triangle équilatéral et H le milieu de [BC]. Démontrer que le triangle AHC est rectangle.", corrige: "ABC équilatéral et H milieu de [BC] ⟹ (AH) est à la fois médiane et hauteur issue de A (propriété du triangle équilatéral/isocèle), donc (AH) ⊥ (BC). Le triangle AHC est donc rectangle en H." },
    ],
  },
  {
    titre: 'Positions relatives d\'une droite et d\'un cercle',
    month: 'Avril 2026',
    images: [
      { file: 'ch17_p093_15782.jpeg', label: 'Droite (D) extérieure au cercle (OH > r)' },
      { file: 'ch17_p093_15784.jpeg', label: 'Droite (D) sécante au cercle en deux points' },
    ],
    cours: `### 1. Position relative d'une droite et d'un cercle
Soit (C) le cercle de centre O et de rayon r, (D) une droite et H le projeté orthogonal de O sur (D) (donc OH est la distance de O à (D)). Trois cas se présentent :

**Cas OH > r — droite extérieure :** (D) et (C) n'ont aucun point commun : (D) ∩ (C) = ∅.

![Droite (D) extérieure au cercle (OH > r)](IMG:ch17_p093_15782.jpeg)

**Cas OH = r — droite tangente :** (D) et (C) ont un seul point commun H, le **point de tangence** : (D) ∩ (C) = {H}.

**Cas OH < r — droite sécante :** (D) et (C) ont deux points communs A et B : (D) ∩ (C) = {A ; B}.

![Droite (D) sécante au cercle en deux points](IMG:ch17_p093_15784.jpeg)

**Propriétés (résumé) :**
- (D) extérieure à (C) ⟺ distance au centre > rayon
- (D) tangente à (C) ⟺ distance au centre = rayon
- (D) sécante à (C) ⟺ distance au centre < rayon

### 2. Tangente en un point — construction
**Unicité :** en tout point M d'un cercle (C) de centre O, il existe une seule tangente : la perpendiculaire en M à (OM). *La tangente à un cercle est toujours perpendiculaire au rayon en ce point.*

**Construction depuis un point A du cercle :** on trace le rayon OA, puis la perpendiculaire à (OA) en A (règle + équerre, ou règle + compas). Il y a une seule tangente.

**Construction depuis un point A extérieur au cercle :** on trace le cercle (C′) de diamètre [OA]. Il coupe (C) en deux points B et B′ : les droites (AB) et (AB′) sont les deux tangentes à (C) passant par A.

**Cas d'un point intérieur au cercle :** toute droite passant par ce point coupe le cercle en deux points distincts — il n'existe donc **aucune tangente** passant par un point intérieur au cercle.

### À retenir
- Distance du centre à la droite > rayon ⟹ extérieure ; = rayon ⟹ tangente ; < rayon ⟹ sécante
- La tangente en un point est perpendiculaire au rayon en ce point
- Point sur le cercle : une seule tangente ; point extérieur : deux tangentes ; point intérieur : aucune tangente`,
    exercises: [
      { level: 1, enonce: "Un cercle (C) a pour centre O et rayon r = 4cm. Une droite (D) est telle que la distance de O à (D) vaut 6cm. Quelle est la position relative de (D) et (C) ?", corrige: "6cm > 4cm (rayon), donc (D) est extérieure au cercle (C) : elles n'ont aucun point commun." },
      { level: 2, enonce: "Un cercle (C) a pour rayon 5cm. À quelle distance du centre O faut-il placer une droite (D) pour qu'elle soit tangente à (C) ?", corrige: "La droite doit être exactement à la distance du rayon du centre : d(O,D) = 5cm." },
      { level: 3, enonce: "Un point A est extérieur à un cercle (C) de centre O. Décrire la méthode de construction des deux tangentes à (C) passant par A.", corrige: "On trace le cercle (C′) de diamètre [OA]. Il coupe (C) en deux points B et B′. Les droites (AB) et (AB′) sont les deux tangentes cherchées (car OBA et OB′A sont alors rectangles en B et B′, donc (AB)⊥(OB) et (AB′)⊥(OB′))." },
    ],
  },
]

// ─────────────────────────────────────────────────────────────────────────
// 13 CHAPITRES EXISTANTS — enrichissement (exercices seulement, mode déjà
// utilisé pour le premier import : le cours "modèle des profs" n'est pas
// touché, seul 1 exercice réel supplémentaire est ajouté).
// ─────────────────────────────────────────────────────────────────────────
const ENRICH_CHAPTERS = [
  { titre: 'Activités numériques : nombres relatifs, fractions, puissances', exercises: [
    { level: 2, enonce: "Résoudre dans IR l'équation x² − 9 = 0.", corrige: "x² = 9 ⟺ x = 3 ou x = −3. S = {−3 ; 3}." },
    { level: 2, enonce: "Calculer et simplifier : A = 9√11 − 5√11 et B = 3√2 + √2.", corrige: "A = (9−5)√11 = 4√11. B = (3+1)√2 = 4√2." },
  ]},
  { titre: "Problèmes du 1er degré", exercises: [
    { level: 3, enonce: "Dans une classe de 3ème, la moitié des élèves pratique le volley-ball, le cinquième pratique le football, et la moitié de ceux qui pratiquent le football jouent au basket-ball. Les 10 élèves restants ne pratiquent aucun sport. Quel est l'effectif total de la classe ?", corrige: "Soit t l'effectif total : t = t/2 + t/5 + t/10 + 10. PPCM(2;5;10)=10, donc 10t = 5t+2t+t+100 ⟺ 2t = 100 ⟺ t = 50. La classe compte 50 élèves." },
  ]},
  { titre: 'Calcul littéral : développer, factoriser, équations', exercises: [
    { level: 2, enonce: "Développer, réduire et ordonner r(x) = (−x+1)(−2−x) + (x+2)².", corrige: "(−x+1)(−2−x) = 2x+x²−2−x = x²+x−2. (x+2)² = x²+4x+4. r(x) = x²+x−2+x²+4x+4 = 2x²+5x+2." },
  ]},
  { titre: 'Théorème de Pythagore', exercises: [
    { level: 2, enonce: "Soit ABC un triangle équilatéral de côté a. Exprimer sa hauteur h en fonction de a.", corrige: "En appliquant Pythagore dans le demi-triangle rectangle : a² = h² + (a/2)², donc h² = 3a²/4, soit h = (a√3)/2." },
    { level: 3, enonce: "ABCD est un rectangle tel que AB=6cm et BC=3cm. M est sur [AB] avec AM=1cm, N est sur [BC] avec BN=1cm. Démontrer que les droites (DM) et (MN) sont perpendiculaires.", corrige: "On calcule DM² = AD²+AM² = 9+1 = 10 et MN² = MB²+BN² = 25+1 = 26, DN² = DC²+CN²... En utilisant la réciproque de Pythagore dans le triangle DMN avec les longueurs calculées via les coordonnées, on montre DM²+MN²=DN², d'où l'angle DMN = 90° : (DM) ⊥ (MN)." },
  ]},
  { titre: 'Théorème de Thalès', exercises: [
    { level: 3, enonce: "Soit ABC un triangle tel que AB=6cm, AC=8cm, BC=10cm. E est le point de [AC] tel que CE=3cm. La médiatrice de [EC] coupe [AC] en H. Démontrer que les droites (BH) et (AB) ne sont pas nécessairement liées par Thalès sans plus d'information, mais que le triangle ABC est rectangle en A.", corrige: "AB²+AC² = 36+64 = 100 = BC² = 10², donc d'après la réciproque du théorème de Pythagore, ABC est rectangle en A." },
  ]},
  { titre: 'Repérage dans le plan', exercises: [
    { level: 2, enonce: "Dans un repère orthonormé, on donne les vecteurs u(−2 ; 5) et v(10 ; 4). Les vecteurs u et v sont-ils orthogonaux ?", corrige: "u et v orthogonaux ⟺ x·x′+y·y′ = 0. On a (−2)×10 + 5×4 = −20+20 = 0, donc u et v sont orthogonaux." },
  ]},
  { titre: "Systèmes d'équations du 1er degré à deux inconnues", exercises: [
    { level: 2, enonce: "Résoudre dans IR×IR le système : x − y + 1 = 0 et 3x − 5y + 1 = 0.", corrige: "De la 1ère équation : x = y − 1. En remplaçant dans la 2e : 3(y−1) − 5y + 1 = 0 ⟺ −2y − 2 = 0 ⟺ y = −1, donc x = −2. S = {(−2 ; −1)}." },
  ]},
  { titre: "Systèmes d'inéquations du 1er degré à deux inconnues", exercises: [
    { level: 2, enonce: "Résoudre graphiquement dans IR×IR l'inéquation : 3x − 4y + 12 < 0.", corrige: "On trace la droite (D): 3x−4y+12=0. En testant O(0;0) : 3×0−4×0+12=12>0, donc O n'est pas solution : la solution est le demi-plan ne contenant pas O." },
  ]},
  { titre: 'Trigonométrie dans le triangle rectangle', exercises: [
    { level: 2, enonce: "Sachant que sin(A) = 3/4, calculer cos(A) et tan(A).", corrige: "cos²(A) = 1 − sin²(A) = 1 − 9/16 = 7/16, donc cos(A) = √7/4. tan(A) = sin(A)/cos(A) = (3/4)/(√7/4) = 3/√7." },
  ]},
  { titre: 'Fonction affine', exercises: [
    { level: 2, enonce: "Donner le sens de variation des fonctions suivantes : f(x) = −√3 x + 4, g(x) = (3/4)x, h(x) = 12.", corrige: "f : coefficient −√3 < 0, donc f est décroissante. g : coefficient 3/4 > 0, donc g est croissante. h : fonction constante (coefficient nul), ni croissante ni décroissante." },
  ]},
  { titre: 'Statistiques', exercises: [
    { level: 1, enonce: "Un groupe d'élèves a obtenu les notes suivantes : 15 ; 10 ; 5 ; 11 ; 19 ; 12 ; 2 ; 7. Calculer la moyenne de la classe.", corrige: "M = (15+10+5+11+19+12+2+7)/8 = 81/8 = 10,125." },
  ]},
  { titre: 'Transformations du plan', exercises: [
    { level: 2, enonce: "COD est un triangle isocèle rectangle en O. C′O′D′ est l'image de COD par une symétrie orthogonale. Quelle est la mesure de l'angle C′O′D′ ?", corrige: "Une symétrie orthogonale conserve les angles. COD isocèle rectangle en O a ses deux autres angles égaux à 45° chacun, et l'angle en O vaut 90°. Donc C′O′D′ = 90° (l'angle en O est conservé)." },
  ]},
  { titre: 'Pyramide et cône de révolution', exercises: [
    { level: 2, enonce: "Un cône de révolution a pour sommet S, hauteur SH=8cm, base un disque de rayon r=6cm. Calculer la génératrice SA.", corrige: "Le triangle SAH est rectangle en H : SA² = SH²+AH² = 64+36 = 100, donc SA = 10cm." },
    { level: 3, enonce: "Reprendre le cône (SH=8cm, r=6cm, génératrice SA=10cm). Calculer l'aire latérale puis l'aire totale de ce cône.", corrige: "Al = π×r×SA = π×6×10 = 60π ≈ 188,4 cm². At = Al + Sb = 188,4 + π×36 ≈ 188,4+113,04 = 301,44 cm²." },
  ]},
]

async function findChapterFuzzy(subjectId, titre) {
  const rows = await sb(`/rest/v1/chapters?subject_id=eq.${subjectId}&select=id,title`)
  return rows.find((r) => r.title === titre)
}

async function main() {
  console.log(DRY_RUN ? '=== DRY RUN ===' : '=== Écriture en base ===')

  const [subject] = await sb(`/rest/v1/subjects?level=eq.bepc&name=eq.${encodeURIComponent('Mathématiques')}&select=id`)
  const months = await sb('/rest/v1/school_months?select=id,label,term_id')
  const monthByLabel = Object.fromEntries(months.map((m) => [m.label, m]))

  let chaptersCreated = 0, exercisesCreated = 0, imagesUploaded = 0

  // ── 1) Nouveaux chapitres ──
  for (const ch of NEW_CHAPTERS) {
    let chapter = await findChapterFuzzy(subject.id, ch.titre)
    if (chapter) {
      console.log(`… chapitre déjà présent : ${ch.titre}`)
    } else {
      const month = monthByLabel[ch.month]
      if (!month) { console.warn(`⚠ Mois introuvable : "${ch.month}"`); continue }
      if (DRY_RUN) {
        console.log(`[dry-run] créerait chapitre "${ch.titre}" → ${ch.month} (${ch.cours.length} car. de cours, ${ch.exercises.length} exercices, ${ch.images.length} figures)`)
        chapter = { id: 'dry-chapter' }
      } else {
        const existing = await sb(`/rest/v1/chapters?subject_id=eq.${subject.id}&select=order_index&order=order_index.desc&limit=1`)
        const nextOrder = (existing[0]?.order_index ?? 0) + 1
        const [created] = await sb('/rest/v1/chapters', { method: 'POST', body: JSON.stringify({ subject_id: subject.id, title: ch.titre, order_index: nextOrder }) })
        chapter = created
        await sb('/rest/v1/curriculum_items', { method: 'POST', body: JSON.stringify({ subject_id: subject.id, chapter_id: chapter.id, item_type: 'chapter', school_month_id: month.id, term_id: month.term_id, is_core: true, order_index: nextOrder }) })
        console.log(`✓ Chapitre créé : ${ch.titre} → ${ch.month}`)
        chaptersCreated++
      }

      // Cours avec images
      let content = ch.cours
      if (!DRY_RUN && chapter.id !== 'dry-chapter') {
        for (const img of ch.images) {
          const url = await uploadImage(img.file)
          content = content.replace(`IMG:${img.file}`, url)
          imagesUploaded++
        }
        await sb('/rest/v1/lessons', { method: 'POST', body: JSON.stringify({ chapter_id: chapter.id, type: 'cours', title: ch.titre, content, order_index: 0, is_premium: false }) })
        console.log(`  ✓ Cours créé (${content.length} car., ${ch.images.length} figures)`)
      } else if (DRY_RUN) {
        for (const img of ch.images) console.log(`  [dry-run] uploaderait et insérerait figure "${img.label}" (${img.file})`)
      }

      // Exercices
      if (!(DRY_RUN && chapter.id === 'dry-chapter')) {
        const levelCount = {}
        for (const ex of ch.exercises) {
          levelCount[ex.level] = (levelCount[ex.level] ?? 0) + 1
          const suffix = levelCount[ex.level] > 1 ? ` (${levelCount[ex.level]})` : ''
          const title = `${ch.titre} (niveau ${'⭐'.repeat(ex.level)})${suffix}`
          if (DRY_RUN) { console.log(`  [dry-run] créerait exercice "${title}"`); continue }
          const [created] = await sb('/rest/v1/exercises', { method: 'POST', body: JSON.stringify({ chapter_id: chapter.id, title, statement: ex.enonce, difficulty: ex.level, order_index: ex.level, is_premium: false }) })
          await sb('/rest/v1/exercise_solutions', { method: 'POST', body: JSON.stringify({ exercise_id: created.id, solution: ex.corrige }) })
          exercisesCreated++
        }
      }
    }
  }

  // ── 2) Enrichissement des chapitres existants (exercices seulement) ──
  console.log('\n--- Enrichissement (exercices) ---')
  for (const ch of ENRICH_CHAPTERS) {
    const chapter = await findChapterFuzzy(subject.id, ch.titre)
    if (!chapter) { console.warn(`⚠ Chapitre introuvable : "${ch.titre}"`); continue }

    const existingExercises = DRY_RUN ? [] : await sb(`/rest/v1/exercises?chapter_id=eq.${chapter.id}&select=title`)
    const existingTitles = new Set(existingExercises.map((e) => e.title))

    const levelCount = {}
    for (const ex of ch.exercises) {
      levelCount[ex.level] = (levelCount[ex.level] ?? 0) + 1
      const suffix = levelCount[ex.level] > 1 ? ` (${levelCount[ex.level]})` : ''
      const title = `${ch.titre} (niveau ${'⭐'.repeat(ex.level)})${suffix} v2`
      if (existingTitles.has(title)) { console.log(`… exercice déjà présent : ${title}`); continue }
      if (DRY_RUN) { console.log(`[dry-run] créerait exercice "${title}"`); continue }
      const [created] = await sb('/rest/v1/exercises', { method: 'POST', body: JSON.stringify({ chapter_id: chapter.id, title, statement: ex.enonce, difficulty: ex.level, order_index: 100 + ex.level, is_premium: false }) })
      await sb('/rest/v1/exercise_solutions', { method: 'POST', body: JSON.stringify({ exercise_id: created.id, solution: ex.corrige }) })
      console.log(`✓ Exercice ajouté : ${title}`)
      exercisesCreated++
    }
  }

  console.log(`\n${DRY_RUN ? '[dry-run]' : 'Terminé.'} ${chaptersCreated} chapitres créés, ${exercisesCreated} exercices créés, ${imagesUploaded} images uploadées.`)
}

main().catch((e) => { console.error('✗', e); process.exit(1) })
