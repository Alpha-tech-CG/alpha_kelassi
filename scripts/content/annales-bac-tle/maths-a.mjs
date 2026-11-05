// Annales du bac — MATHÉMATIQUES série A (Congo).
// Source : corrigés 2020 et 2021 (le sujet lui-même n'était pas fourni) : l'énoncé est
// reconstitué à partir des données et des questions qui apparaissent dans le corrigé.

const RECONSTITUE = `> ⚠️ Énoncé reconstitué d'après le corrigé (le sujet original n'était pas fourni) : les données et les questions sont celles du bac, la formulation peut légèrement différer.`

const bac2021 = {
  title: 'Bac A 2021 — Mathématiques : fractions et PPCM, polynôme et logarithme, fonction homographique, ajustement de Mayer',
  statement: `**Baccalauréat 2021 — Série A — Mathématiques**

${RECONSTITUE}

### Exercice 1

**Partie A.** On donne les fractions $a = \\dfrac{9}{10}$, $b = \\dfrac{18}{25}$ et $c = \\dfrac{4}{30}$.
1. Simplifier, si possible, chacune des fractions $a$, $b$ et $c$.
2. Déterminer le PPCM des nombres $10$, $25$ et $15$.
3. a) Écrire $a$, $b$ et $c$ avec le même dénominateur $150$.
   b) En déduire la valeur de $S = a - b + c$ sous forme de fraction.

**Partie B.** On considère le polynôme $P(x) = 2x^3 + 3x^2 - 11x - 6$.
1. a) Vérifier que $P(x) = (2x + 1)(x^2 + x - 6)$.
   b) Résoudre dans $\\mathbb{R}$ l'équation $x^2 + x - 6 = 0$.
   c) En déduire les solutions de l'équation $P(x) = 0$.
2. En posant $x = \\ln t$, résoudre dans $]0 ; +\\infty[$ l'équation
$$(E) : \\; 2(\\ln t)^3 + 3(\\ln t)^2 - 11\\ln t - 6 = 0.$$

### Exercice 2

Soit $g$ la fonction définie sur $\\mathbb{R}^*$ par $g(x) = \\dfrac{x - 1}{x}$ et $(\\mathscr{C}_g)$ sa courbe représentative dans un repère orthonormé.
1. a) Écrire l'ensemble de définition de $g$ comme réunion d'intervalles.
   b) Déterminer le réel $a$ tel que, pour tout $x \\neq 0$, $g(x) = 1 + \\dfrac{a}{x}$.
   c) Calculer les limites de $g$ en $-\\infty$, en $+\\infty$, et en $0$ (à gauche et à droite). En déduire les asymptotes à $(\\mathscr{C}_g)$.
2. a) Calculer $g'(x)$.
   b) Étudier le signe de $g'(x)$ et en déduire le sens de variation de $g$.
   c) Dresser le tableau de variation de $g$.
3. a) Calculer les coordonnées des points $A$, $B$ et $C$ de $(\\mathscr{C}_g)$ d'abscisses respectives $-1$, $1$ et $2$.
   b) Tracer $(\\mathscr{C}_g)$ et ses asymptotes.

### Exercice 3

On a relevé le poids $Y$ (en mg) d'une larve d'insecte en fonction de son âge $X$ (en mois) :

| $X$ (âge en mois) | 1 | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|---|
| $Y$ (poids en mg) | 1,2 | 1,8 | 2,3 | 2,5 | 3 | 3,5 |

1. Calculer les coordonnées du point moyen $G$ de la série.
2. On partage la série en deux sous-séries $T_1$ (les trois premiers relevés) et $T_2$ (les trois derniers).
   a) Écrire les tableaux $T_1$ et $T_2$.
   b) Calculer les coordonnées des points moyens $G_1$ de $T_1$ et $G_2$ de $T_2$.
   c) Déterminer une équation de la droite d'ajustement linéaire par la méthode de Mayer (droite $(G_1G_2)$).
3. On admet qu'une équation de la droite d'ajustement est $1{,}24x - 3y + 2{,}8 = 0$. Estimer le poids de la larve au 7ᵉ mois.`,
  solution: `### Exercice 1

**Partie A**
1. $\\text{PGCD}(9, 10) = 1$ et $\\text{PGCD}(18, 25) = 1$ : $a$ et $b$ sont irréductibles. En revanche $c = \\dfrac{4}{30} = \\dfrac{2 \\times 2}{2 \\times 15} = \\dfrac{2}{15}$.
2. $10 = 2 \\times 5$, $25 = 5^2$, $15 = 3 \\times 5$. Le PPCM prend chaque facteur premier avec son plus grand exposant : $\\text{PPCM} = 2 \\times 3 \\times 5^2 = 150$.
3. a) $a = \\dfrac{9 \\times 15}{10 \\times 15} = \\dfrac{135}{150}$ ; $b = \\dfrac{18 \\times 6}{25 \\times 6} = \\dfrac{108}{150}$ ; $c = \\dfrac{2 \\times 10}{15 \\times 10} = \\dfrac{20}{150}$.
   b) $S = \\dfrac{135 - 108 + 20}{150} = \\boxed{\\dfrac{47}{150}}$.

**Partie B**
1. a) $(2x+1)(x^2+x-6) = 2x^3 + 2x^2 - 12x + x^2 + x - 6 = 2x^3 + 3x^2 - 11x - 6 = P(x)$.
   b) $\\Delta = 1^2 - 4 \\times 1 \\times (-6) = 25$, d'où $x_1 = \\dfrac{-1 - 5}{2} = -3$ et $x_2 = \\dfrac{-1 + 5}{2} = 2$.
   c) $P(x) = 0 \\iff 2x + 1 = 0$ ou $x^2 + x - 6 = 0$ : $S = \\left\\{-3 \\,;\\, -\\tfrac12 \\,;\\, 2\\right\\}$.
2. Avec $x = \\ln t$, $(E)$ devient $P(x) = 0$, donc $\\ln t \\in \\{-3 ; -\\tfrac12 ; 2\\}$ :
$$S = \\left\\{ e^{-3} \\,;\\, e^{-1/2} \\,;\\, e^{2} \\right\\}.$$

### Exercice 2
1. a) $D_g = \\mathbb{R}^* = \\,]-\\infty ; 0[ \\,\\cup\\, ]0 ; +\\infty[$.
   b) $\\dfrac{x-1}{x} = \\dfrac{x}{x} - \\dfrac{1}{x} = 1 - \\dfrac1x$ : $a = -1$.
   c) $\\lim\\limits_{x \\to \\pm\\infty} g(x) = 1$ car $\\dfrac1x \\to 0$ : asymptote horizontale $y = 1$ en $-\\infty$ et en $+\\infty$.
   En $0$ : $-\\dfrac1x \\to +\\infty$ si $x \\to 0^-$ et $-\\dfrac1x \\to -\\infty$ si $x \\to 0^+$. Donc $\\lim\\limits_{0^-} g = +\\infty$, $\\lim\\limits_{0^+} g = -\\infty$ : asymptote verticale $x = 0$.
2. a) $g'(x) = \\dfrac{1 \\cdot x - (x - 1) \\cdot 1}{x^2} = \\dfrac{1}{x^2}$.
   b) $g'(x) > 0$ sur $\\mathbb{R}^*$ : $g$ est strictement croissante sur $]-\\infty ; 0[$ et sur $]0 ; +\\infty[$.
   c) Tableau : sur $]-\\infty ; 0[$, $g$ croît de $1$ à $+\\infty$ ; sur $]0 ; +\\infty[$, $g$ croît de $-\\infty$ à $1$.
3. a) $g(-1) = \\dfrac{-2}{-1} = 2$ : $A(-1 ; 2)$ ; $g(1) = 0$ : $B(1 ; 0)$ ; $g(2) = \\dfrac12$ : $C\\left(2 ; \\tfrac12\\right)$.
   b) Courbe : deux branches d'hyperbole de centre $(0 ; 1)$, passant par $A$ (branche de gauche, au-dessus de $y = 1$) et par $B$, $C$ (branche de droite, en dessous de $y = 1$).

### Exercice 3
1. $\\overline{X} = \\dfrac{1+2+3+4+5+6}{6} = 3{,}5$ et $\\overline{Y} = \\dfrac{14{,}3}{6} \\approx 2{,}38$ : $G(3{,}5 \\,;\\, 2{,}38)$.
2. a) $T_1$ : $X = 1, 2, 3$ et $Y = 1{,}2 ; 1{,}8 ; 2{,}3$. $T_2$ : $X = 4, 5, 6$ et $Y = 2{,}5 ; 3 ; 3{,}5$.
   b) $G_1\\left(2 \\,;\\, \\tfrac{5{,}3}{3}\\right) \\approx (2 \\,;\\, 1{,}77)$ et $G_2(5 \\,;\\, 3)$.
   c) Pente $a = \\dfrac{3 - 1{,}77}{5 - 2} \\approx 0{,}41$. $G_2$ est sur la droite : $3 = 0{,}41 \\times 5 + b$, d'où $b = 0{,}95$.
   Droite de Mayer : $y = 0{,}41x + 0{,}95$.
3. On remarque que $3y = 1{,}23x + 2{,}85$ est pratiquement l'équation donnée. Pour $x = 7$ : $1{,}24 \\times 7 - 3y + 2{,}8 = 0 \\iff 3y = 11{,}48 \\iff y \\approx 3{,}83$.
   Au 7ᵉ mois, la larve pèse environ **3,83 mg**.`,
}

const bac2020 = {
  title: 'Bac A 2020 — Mathématiques : vrai-faux et PGCD, équations (exp, ln), fonction homographique, ajustement de Mayer',
  statement: `**Baccalauréat 2020 — Série A — Mathématiques**

${RECONSTITUE}

### Exercice 1

**Partie 1**
1. Répondre par Vrai ou Faux en justifiant :
   a) $28$ et $56$ sont des multiples de $7$.
   b) L'équation $6x^2 - 7x + 3 = 0$ admet des solutions dans $\\mathbb{R}$.
   c) $124$ est divisible par $3$.
2. a) Déterminer le PGCD de $1950$ et $235$ par l'algorithme d'Euclide, puis écrire la fraction $\\dfrac{1950}{235}$ sous forme irréductible.
   b) Donner un encadrement de $\\dfrac{1950}{235}$ d'amplitude $10^{-3}$.

**Partie 2**
1. Résoudre dans $\\mathbb{R}$ l'équation $\\dfrac{2x - 1}{x + 4} = \\dfrac{2x + 1}{x - 2}$.
2. a) Résoudre dans $\\mathbb{R}$ l'équation $3x^2 - 2x - 1 = 0$.
   b) En déduire les solutions de l'équation $(E') : 3e^{2x} - 2e^{x} - 1 = 0$.
3. a) Résoudre dans $\\mathbb{R}^2$ le système $(S) : \\begin{cases} x - 2y = -1 \\\\ 2x + 3y = -2 \\end{cases}$
   b) En déduire les solutions du système $(S') : \\begin{cases} \\ln x - 2\\ln y = -1 \\\\ 2\\ln x + 3\\ln y = -2 \\end{cases}$

### Exercice 2

Soit $g$ la fonction définie par $g(x) = \\dfrac{-2x + 2}{2x + 3}$ et $(\\mathscr{C})$ sa courbe représentative dans un repère orthonormé.
1. a) Calculer l'image de $-1$ par $g$.
   b) Quel est le réel qui n'a pas d'image par $g$ ?
2. Calculer la limite de $g$ en $+\\infty$, en $-\\infty$, et en $-\\dfrac32$ à gauche et à droite.
3. a) Calculer $g'(x)$.
   b) Étudier le signe de $g'(x)$.
4. Dresser le tableau de variation de $g$.
5. Compléter le tableau de valeurs suivant :

| $x$ | $-2$ | … | $0$ | $1$ |
|---|---|---|---|---|
| $g(x)$ | … | $4$ | … | … |

6. Déterminer les points d'intersection de $(\\mathscr{C})$ avec les axes, préciser les asymptotes et tracer $(\\mathscr{C})$.

### Exercice 3

On a mesuré, pour dix personnes, la distance $x$ (en m) d'un lancer de poids avec le bras droit et la distance $y$ (en m) avec le bras gauche :

| $x_i$ | 5,5 | 5,6 | 5,6 | 5,8 | 6 | 6,2 | 6,4 | 6,8 | 7,1 | 7,2 |
|---|---|---|---|---|---|---|---|---|---|---|
| $y_i$ | 4,1 | 4,9 | 3,9 | 4 | 4,9 | 4,7 | 5,5 | 5 | 6,2 | 6 |

1. a) Représenter le nuage de points de cette série.
   b) Calculer les coordonnées du point moyen $G_1$ des cinq premiers points.
   c) Calculer les coordonnées du point moyen $G_2$ des cinq derniers points.
2. a) Déterminer une équation de la droite $(G_1G_2)$ (droite de Mayer).
   b) Une personne lance le poids à $4{,}4$ m avec le bras gauche. Estimer la distance de son lancer avec le bras droit.`,
  solution: `### Exercice 1

**Partie 1**
1. a) **Vrai** : $28 = 7 \\times 4$ et $56 = 7 \\times 8$.
   b) **Faux** : $\\Delta = (-7)^2 - 4 \\times 6 \\times 3 = 49 - 72 = -23 < 0$, aucune racine réelle.
   c) **Faux** : la somme des chiffres $1 + 2 + 4 = 7$ n'est pas divisible par $3$.
2. a) $1950 = 235 \\times 8 + 70$ ; $235 = 70 \\times 3 + 25$ ; $70 = 25 \\times 2 + 20$ ; $25 = 20 \\times 1 + 5$ ; $20 = 5 \\times 4 + 0$.
   Le dernier reste non nul est $5$ : $\\text{PGCD}(1950, 235) = 5$ et $\\dfrac{1950}{235} = \\dfrac{390}{47}$.
   b) $\\dfrac{390}{47} \\approx 8{,}2979$, d'où $8{,}297 < \\dfrac{1950}{235} < 8{,}298$.

**Partie 2**
1. L'équation a un sens pour $x \\neq -4$ et $x \\neq 2$. Produit en croix : $(2x-1)(x-2) = (2x+1)(x+4)$, soit $2x^2 - 5x + 2 = 2x^2 + 9x + 4$, d'où $-14x = 2$ et $x = -\\dfrac17$ (valeur autorisée). $S = \\left\\{-\\tfrac17\\right\\}$.
2. a) $\\Delta' = (-1)^2 - 3 \\times (-1) = 4$ : $x_1 = \\dfrac{1 - 2}{3} = -\\dfrac13$ et $x_2 = \\dfrac{1 + 2}{3} = 1$.
   b) On pose $X = e^x$ : $3X^2 - 2X - 1 = 0$ donne $X = -\\dfrac13$ ou $X = 1$. Or $e^x > 0$, donc seul $e^x = 1$ convient : $S' = \\{0\\}$.
3. a) De $x = 2y - 1$ dans la 2ᵉ équation : $2(2y - 1) + 3y = -2 \\iff 7y = 0 \\iff y = 0$, puis $x = -1$. $S = \\{(-1 ; 0)\\}$.
   b) Avec $X = \\ln x$, $Y = \\ln y$ ($x > 0$, $y > 0$), on retrouve $(S)$ : $\\ln x = -1$ et $\\ln y = 0$, d'où $S' = \\left\\{\\left(\\tfrac1e ; 1\\right)\\right\\}$.

### Exercice 2
1. a) $g(-1) = \\dfrac{2 + 2}{-2 + 3} = 4$.
   b) $g$ n'est pas définie quand $2x + 3 = 0$ : $-\\dfrac32$ n'a pas d'image.
2. En $\\pm\\infty$ : $g(x) \\sim \\dfrac{-2x}{2x} = -1$, donc $\\lim g = -1$.
   En $-\\dfrac32$ : le numérateur tend vers $5$ et $2x + 3 \\to 0$, négatif à gauche, positif à droite. D'où $\\lim\\limits_{x \\to -\\frac32^-} g(x) = -\\infty$ et $\\lim\\limits_{x \\to -\\frac32^+} g(x) = +\\infty$.
3. a) $g'(x) = \\dfrac{-2(2x+3) - 2(-2x+2)}{(2x+3)^2} = \\dfrac{-10}{(2x+3)^2}$.
   b) Le carré est strictement positif, donc $g'(x) < 0$ pour tout $x \\neq -\\dfrac32$.
4. $g$ est strictement décroissante sur $\\left]-\\infty ; -\\tfrac32\\right[$ (de $-1$ à $-\\infty$) et sur $\\left]-\\tfrac32 ; +\\infty\\right[$ (de $+\\infty$ à $-1$).
5. $g(-2) = \\dfrac{6}{-1} = -6$ ; $g(0) = \\dfrac23$ ; $g(1) = 0$. Antécédent de $4$ : $-2x + 2 = 4(2x + 3) \\iff -10x = 10 \\iff x = -1$.

| $x$ | $-2$ | $-1$ | $0$ | $1$ |
|---|---|---|---|---|
| $g(x)$ | $-6$ | $4$ | $\\tfrac23$ | $0$ |

6. $(\\mathscr{C})$ coupe l'axe des ordonnées en $\\left(0 ; \\tfrac23\\right)$ et l'axe des abscisses en $(1 ; 0)$.
   Asymptotes : verticale $x = -\\dfrac32$, horizontale $y = -1$ (en $-\\infty$ et en $+\\infty$). Tracé : hyperbole de centre $\\left(-\\tfrac32 ; -1\\right)$, passant par $(-2 ; -6)$, $(-1 ; 4)$, $\\left(0 ; \\tfrac23\\right)$, $(1 ; 0)$.

### Exercice 3
1. a) Nuage : placer les dix points $(x_i ; y_i)$.
   b) $\\overline{x_1} = \\dfrac{28{,}5}{5} = 5{,}70$ et $\\overline{y_1} = \\dfrac{21{,}8}{5} = 4{,}36$ : $G_1(5{,}70 ; 4{,}36)$.
   c) $\\overline{x_2} = \\dfrac{33{,}7}{5} = 6{,}74$ et $\\overline{y_2} = \\dfrac{27{,}4}{5} = 5{,}48$ : $G_2(6{,}74 ; 5{,}48)$.
2. a) $a = \\dfrac{5{,}48 - 4{,}36}{6{,}74 - 5{,}70} = \\dfrac{1{,}12}{1{,}04} \\approx 1{,}077$ ; $b = 4{,}36 - 1{,}077 \\times 5{,}7 \\approx -1{,}778$.
   $(G_1G_2) : y = 1{,}077x - 1{,}778$.
   b) $4{,}4 = 1{,}077x - 1{,}778 \\iff x = \\dfrac{6{,}178}{1{,}077} \\approx 5{,}74$ : avec le bras droit, le lancer est estimé à **5,74 m**.`,
}

export const BLOCS = [
  {
    subject: 'Mathématiques',
    levels: ['bac_a'],
    chapterTitle: 'Annales du bac — Mathématiques série A',
    description: 'Sujets du baccalauréat série A avec corrigés détaillés.',
    exercises: [bac2021, bac2020].map((e) => ({ difficulty: 2, ...e })),
  },
]
