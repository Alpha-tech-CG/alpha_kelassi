// Sujets inédits Cognix — MATHÉMATIQUES Terminales A, C et D (26/10/2026).
// Chaque sujet reprend la structure et les notions d'un sujet officiel (`inspiredBy`) en
// posant les mêmes questions autrement : autres données, autre contexte, parfois la question
// réciproque. Tous les résultats numériques ont été recalculés (script de vérification Python).
const R = String.raw

const CHAPTER = 'Sujets type bac inédits (Cognix)'
const DESCRIPTION = 'Sujets complets créés sur le modèle des sujets officiels : mêmes notions, questions posées autrement. Pour les simulations de la Prépa.'

const mathsD1 = {
  title: 'Sujet Cognix n°1 — Mathématiques série D : similitude, projection vectorielle, fonction exp-ln et aire, dé pipé',
  inspiredBy: 'Bac D 2024 — Mathématiques : nombres complexes et similitude, endomorphisme, fonction exp-ln, dé pipé',
  exam: { exam_kind: 'bac_blanc', duration_min: 240, bareme: [
    { label: 'Exercice 1', points: 5 }, { label: 'Exercice 2', points: 5 }, { label: 'Exercice 3', points: 7 }, { label: 'Exercice 4', points: 3 },
  ] },
  statement: R`**Sujet type bac inédit (Cognix) — Série D — Mathématiques — Durée 4 h — Coefficient 4**

### Exercice 1 (5 points)
Le plan complexe est rapporté à un repère orthonormé direct $(O ; \vec u, \vec v)$. On considère l'application $h$ qui, à tout point $M(x ; y)$, associe le point $M'(x' ; y')$ tel que $\begin{cases} x' = x - y \\ y' = x + y - 2 \end{cases}$
1. Montrer que l'écriture complexe de $h$ est $z' = (1 + i)z - 2i$.
2. Déterminer le point invariant de $h$. On le note $A$.
3. En déduire la nature et les éléments caractéristiques de $h$ (centre, rapport $k$, angle $\theta$).
4. On considère les points $B$ et $C$ d'affixes $z_B = 1 + 2i$ et $z_C = -1 + i$.
   a) Vérifier que $h(B) = C$.
   b) Calculer $w = \dfrac{z_C - z_A}{z_B - z_A}$ sous forme algébrique, puis son module et un argument.
   c) En déduire la nature du triangle $ABC$.

### Exercice 2 (5 points)
Le plan vectoriel $E$ est rapporté à la base $(\vec i, \vec j)$. On considère l'endomorphisme $f$ de $E$ défini par $\begin{cases} x' = 6x - 3y \\ y' = 4x - 2y \end{cases}$
1. Écrire la matrice $M$ de $f$ dans la base $(\vec i, \vec j)$.
2. Déterminer le noyau $\ker f$ ; on en donnera un vecteur directeur $\vec e_1$ de première coordonnée $1$.
3. Déterminer l'image $\operatorname{Im} f$ ; on en donnera un vecteur directeur $\vec e_2$ de première coordonnée $3$.
4. a) Montrer que $(\vec e_1, \vec e_2)$ est une base de $E$.
   b) Exprimer $\vec e_3 = 5\vec i + 6\vec j$ dans la base $(\vec e_1, \vec e_2)$, puis calculer $f(\vec e_3)$ de deux façons.
5. a) Calculer $M^2$ et montrer que $f \circ f = 4f$.
   b) On pose $p = \dfrac14 f$. Montrer que $p$ est une projection vectorielle dont on précisera la base et la direction.

### Exercice 3 (7 points)
On considère la fonction $f$ définie sur $\mathbb{R}$ par $f(x) = e^{x}$ si $x \leq 0$ et $f(x) = 1 + x\ln x$ si $x > 0$. On note $(C)$ sa courbe dans un repère orthonormé (unité : 2 cm).
1. Calculer les limites de $f$ en $-\infty$ et en $+\infty$. Interpréter la première.
2. Étudier la continuité de $f$ en $0$.
3. Étudier la dérivabilité de $f$ en $0$ et interpréter géométriquement les résultats.
4. Calculer $f'(x)$ sur $]-\infty ; 0[$ puis sur $]0 ; +\infty[$, et étudier son signe.
5. Dresser le tableau de variation de $f$.
6. a) Montrer que l'équation $f(x) = 2$ admet une unique solution $\alpha$ dans $\mathbb{R}$.
   b) Vérifier que $1{,}7 < \alpha < 1{,}8$.
7. Étudier la branche infinie de $(C)$ en $+\infty$.
8. Tracer $(C)$.
9. À l'aide d'une intégration par parties, calculer l'aire, en cm², du domaine limité par $(C)$, la droite d'équation $y = 1$ et les droites d'équations $x = 1$ et $x = e$.

### Exercice 4 (3 points)
Un dé cubique dont les faces sont numérotées de 1 à 6 est pipé : les faces 1, 2 et 3 ont la même probabilité $a$ ; les faces 4 et 5 ont chacune une probabilité double de celle de la face 1 ; la face 6 a une probabilité triple de celle de la face 1.
1. Montrer que $a = \dfrac{1}{10}$.
2. Quelle est la probabilité d'obtenir un numéro pair ?
3. $X$ est la variable aléatoire égale au numéro obtenu.
   a) Donner la loi de probabilité de $X$.
   b) Calculer l'espérance mathématique $E(X)$ et la variance $V(X)$.`,
  solution: R`### Exercice 1
1. $z' = x' + iy' = (x - y) + i(x + y - 2)$. Or $(1 + i)(x + iy) = (x - y) + i(x + y)$, donc $z' = (1 + i)z - 2i$.
2. $z = (1 + i)z - 2i \iff -iz = -2i \iff z = 2$ : $A$ a pour affixe $z_A = 2$.
3. $h$ est de la forme $z' = az + b$ avec $a = 1 + i \neq 1$ : c'est une **similitude plane directe** de centre $A$, de rapport $k = |1 + i| = \sqrt2$ et d'angle $\theta = \arg(1 + i) = \dfrac\pi4$.
4. a) $(1 + i)(1 + 2i) - 2i = 1 + 2i + i - 2 - 2i = -1 + i = z_C$.
   b) $w = \dfrac{-3 + i}{-1 + 2i} = \dfrac{(-3 + i)(-1 - 2i)}{5} = \dfrac{3 + 6i - i + 2}{5} = 1 + i$ ; $|w| = \sqrt2$ et $\arg w = \dfrac\pi4$. (Normal : $w$ est le coefficient $a$ de la similitude.)
   c) $AC = \sqrt2\,AB$ et $(\overrightarrow{AB}, \overrightarrow{AC}) = \dfrac\pi4$. Avec $AB = |{-1} + 2i| = \sqrt5$, $AC = \sqrt{10}$ et $BC = |{-2} - i| = \sqrt5$ : $AB = BC$ et $AB^2 + BC^2 = 10 = AC^2$. Le triangle $ABC$ est **rectangle isocèle en $B$**.

### Exercice 2
1. $M = \begin{pmatrix} 6 & -3 \\ 4 & -2 \end{pmatrix}$.
2. $f(\vec u) = \vec 0 \iff 6x - 3y = 0$ et $4x - 2y = 0 \iff y = 2x$ : $\ker f = \text{Vect}(\vec e_1)$ avec $\vec e_1 = \vec i + 2\vec j$.
3. $x' = 3(2x - y)$ et $y' = 2(2x - y)$ : tout vecteur image est colinéaire à $3\vec i + 2\vec j$, et $f(\vec i) = 6\vec i + 4\vec j \neq \vec 0$. Donc $\operatorname{Im} f = \text{Vect}(\vec e_2)$ avec $\vec e_2 = 3\vec i + 2\vec j$ (droite ; $\dim \ker f + \dim \operatorname{Im} f = 2$).
4. a) $\det(\vec e_1, \vec e_2) = 1 \times 2 - 2 \times 3 = -4 \neq 0$ : base de $E$ (et $\ker f$, $\operatorname{Im} f$ sont supplémentaires).
   b) $\alpha\vec e_1 + \beta\vec e_2 = (\alpha + 3\beta)\vec i + (2\alpha + 2\beta)\vec j$ : $\alpha + 3\beta = 5$ et $\alpha + \beta = 3$, d'où $\beta = 1$, $\alpha = 2$ : $\vec e_3 = 2\vec e_1 + \vec e_2$.
   $f(\vec e_3) = 2f(\vec e_1) + f(\vec e_2) = \vec 0 + (18 - 6)\vec i + (12 - 4)\vec j = 12\vec i + 8\vec j$. Directement : $f(\vec e_3) = (30 - 18)\vec i + (20 - 12)\vec j = 12\vec i + 8\vec j$.
5. a) $M^2 = \begin{pmatrix} 24 & -12 \\ 16 & -8 \end{pmatrix} = 4M$, donc $f \circ f = 4f$.
   b) $p \circ p = \dfrac1{16} f \circ f = \dfrac4{16}f = p$ : $p$ est une projection vectorielle. Sa base est $\operatorname{Im} p = \operatorname{Im} f = \text{Vect}(\vec e_2)$ et sa direction $\ker p = \ker f = \text{Vect}(\vec e_1)$ ($p(\vec e_2) = \frac14 \cdot 4\vec e_2 = \vec e_2$).

### Exercice 3
1. $\lim\limits_{-\infty} e^x = 0$ : la droite $y = 0$ est **asymptote horizontale** en $-\infty$. En $+\infty$, $x\ln x \to +\infty$ : $\lim\limits_{+\infty} f = +\infty$.
2. $f(0) = e^0 = 1$ et $\lim\limits_{0^+} x\ln x = 0$ (croissances comparées), donc $\lim\limits_{0^+} f = 1 = f(0)$ : $f$ est continue en $0$.
3. À gauche : $\dfrac{e^x - 1}{x} \to 1$ : $f'_g(0) = 1$, demi-tangente de pente $1$ ($y = x + 1$).
   À droite : $\dfrac{f(x) - 1}{x} = \ln x \to -\infty$ : pas dérivable à droite ; demi-tangente **verticale** (dirigée vers le bas). $f$ n'est pas dérivable en $0$ : **point anguleux**.
4. Sur $]-\infty ; 0[$ : $f'(x) = e^x > 0$. Sur $]0 ; +\infty[$ : $f'(x) = \ln x + 1$, négatif sur $\left]0 ; \frac1e\right[$, nul en $\frac1e$, positif ensuite.
5. $f$ croît de $0$ à $1$ sur $]-\infty ; 0]$, décroît de $1$ à $f\!\left(\frac1e\right) = 1 - \frac1e \approx 0{,}63$ sur $\left[0 ; \frac1e\right]$, puis croît de $1 - \frac1e$ à $+\infty$.
6. a) Sur $\left]-\infty ; \frac1e\right]$, $f(x) \leq 1 < 2$ : pas de solution. Sur $\left[\frac1e ; +\infty\right[$, $f$ est continue et strictement croissante de $1 - \frac1e$ à $+\infty$, et $2$ est dans cet intervalle : une solution unique $\alpha$.
   b) $f(1{,}7) = 1 + 1{,}7\ln1{,}7 \approx 1{,}902 < 2$ et $f(1{,}8) = 1 + 1{,}8\ln1{,}8 \approx 2{,}058 > 2$ : $1{,}7 < \alpha < 1{,}8$ ($\alpha \approx 1{,}763$).
7. $\dfrac{f(x)}{x} = \dfrac1x + \ln x \to +\infty$ : branche parabolique de direction $(Oy)$.
8. Points utiles : asymptote $y = 0$ à gauche, $(0 ; 1)$ avec la demi-tangente $y = x + 1$ et la demi-tangente verticale, minimum local $\left(\frac1e ; 1 - \frac1e\right) \approx (0{,}37 ; 0{,}63)$, $(1 ; 1)$, $(\alpha ; 2)$, $(e ; 1 + e) \approx (2{,}72 ; 3{,}72)$.
9. Sur $[1 ; e]$, $f(x) - 1 = x\ln x \geq 0$ : la courbe est au-dessus de $y = 1$. $\mathcal{A} = \displaystyle\int_1^e x\ln x\,dx$. IPP avec $u = \ln x$, $v' = x$ : $\displaystyle\int_1^e x\ln x\,dx = \left[\frac{x^2}{2}\ln x\right]_1^e - \int_1^e \frac x2\,dx = \frac{e^2}{2} - \left[\frac{x^2}{4}\right]_1^e = \frac{e^2}{2} - \frac{e^2}{4} + \frac14 = \frac{e^2 + 1}{4}$ u.a.
   Une unité d'aire vaut $2 \times 2 = 4$ cm² : $\mathcal{A} = (e^2 + 1)$ cm² $\approx 8{,}39$ cm².

### Exercice 4
1. $P_1 = P_2 = P_3 = a$, $P_4 = P_5 = 2a$, $P_6 = 3a$ ; la somme vaut $3a + 4a + 3a = 10a = 1$, d'où $a = \dfrac1{10}$.
2. $P(\text{pair}) = P_2 + P_4 + P_6 = \dfrac{1 + 2 + 3}{10} = \dfrac35$.
3. a) Loi de $X$ :

| $x_i$ | 1 | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|---|
| $P(X = x_i)$ | $\frac{1}{10}$ | $\frac{1}{10}$ | $\frac{1}{10}$ | $\frac{2}{10}$ | $\frac{2}{10}$ | $\frac{3}{10}$ |

   b) $E(X) = \dfrac{1 + 2 + 3 + 8 + 10 + 18}{10} = \dfrac{42}{10} = \dfrac{21}{5}$.
   $E(X^2) = \dfrac{1 + 4 + 9 + 32 + 50 + 108}{10} = \dfrac{204}{10} = \dfrac{102}{5}$ ; $V(X) = \dfrac{102}{5} - \dfrac{441}{25} = \dfrac{69}{25} = 2{,}76$.`,
}

const mathsC1 = {
  title: 'Sujet Cognix n°1 — Mathématiques série C : système de congruences, carré et similitude, ellipse, encadrement d’intégrale, dé truqué',
  inspiredBy: 'Bac C 2024 — Mathématiques : congruences, rotations et similitude, ellipse, encadrement d’intégrale, dé truqué',
  exam: { exam_kind: 'bac_blanc', duration_min: 240, bareme: [
    { label: 'Exercice 1', points: 4 }, { label: 'Exercice 2', points: 8 }, { label: 'Exercice 3', points: 5 }, { label: 'Exercice 4', points: 3 },
  ] },
  statement: R`**Sujet type bac inédit (Cognix) — Série C — Mathématiques — Durée 4 h — Coefficient 5**

### Exercice 1 (4 points)
On considère dans $\mathbb{Z}$ le système $(S) : \begin{cases} x \equiv 2 \;[5] \\ x \equiv 4 \;[11] \end{cases}$
1. Déterminer le plus petit entier naturel solution de $(S)$. On le note $x_0$.
2. a) Montrer que $x$ est solution de $(S)$ si et seulement si $x - x_0$ est divisible par $55$.
   b) En déduire l'ensemble des solutions de $(S)$.
3. Un bibliothécaire range ses cahiers par paquets de 5 : il en reste 2. Par paquets de 11, il en reste 4. Il possède entre 450 et 500 cahiers. Combien en a-t-il ?

### Exercice 2 (8 points)
Dans le plan orienté, $ABCD$ est un carré de sens direct, de centre $O$, avec $AB = 4$ cm. On note $J$ le milieu de $[BC]$.
1. Faire la figure ($[AB]$ horizontal).
2. On note $r_A$ la rotation de centre $A$ et d'angle $\dfrac\pi2$, $r_B$ la rotation de centre $B$ et d'angle $\dfrac\pi2$, et $f = r_B \circ r_A$.
   a) Montrer que $r_A = S_{(AC)} \circ S_{(AB)}$.
   b) Déterminer la nature de $f$.
   c) Calculer $f(A)$ et en déduire le centre $E$ de $f$. Montrer que $E$ est le symétrique de $O$ par rapport à $(AB)$.
3. On munit le plan du repère orthonormé direct $\left(A ; \frac14\overrightarrow{AB}, \frac14\overrightarrow{AD}\right)$. Soit $S$ la similitude plane directe de centre $A$ qui transforme $B$ en $O$.
   a) Déterminer l'écriture complexe de $S$, son rapport et son angle.
   b) Montrer que $S(C) = D$.
   c) Déterminer l'image par $S$ du point $J$, puis l'image du segment $[BC]$.
4. Soit $(\mathcal E)$ l'ensemble des points $M$ du plan tels que $MA + MC = 2AB$.
   a) Montrer que $B$ et $D$ appartiennent à $(\mathcal E)$.
   b) Justifier que $(\mathcal E)$ est une ellipse ; préciser ses foyers, son centre et son axe focal.
   c) Calculer son excentricité et la longueur de son petit axe.

### Exercice 3 (5 points)
On se propose d'encadrer $I = \displaystyle\int_0^1 \frac{1}{1 + xe^{-x}}\,dx$.
1. Démontrer que pour tout réel $u \in [0 ; 1]$, $1 - u \leq \dfrac1{1 + u} \leq 1 - \dfrac u2$.
2. Soit $g(x) = xe^{-x}$.
   a) Étudier les variations de $g$ sur $[0 ; 1]$ et en déduire que $0 \leq g(x) \leq 1$ sur cet intervalle.
   b) Vérifier que $G(x) = -(x + 1)e^{-x}$ est une primitive de $g$ et calculer $J = \displaystyle\int_0^1 g(x)\,dx$.
3. Déduire des questions précédentes que $\dfrac2e \leq I \leq \dfrac12 + \dfrac1e$, puis donner un encadrement décimal de $I$ d'amplitude $0{,}2$.

### Exercice 4 (3 points)
Un dé à six faces numérotées de 1 à 6 est truqué de sorte que la probabilité d'obtenir la face $k$ soit proportionnelle à $k$.
1. Montrer que la probabilité d'obtenir la face $k$ est $\dfrac{k}{21}$.
2. Calculer la probabilité $p$ d'obtenir un multiple de 3.
3. On lance ce dé trois fois de suite ; $X$ est le nombre de multiples de 3 obtenus.
   a) Justifier que $X$ suit une loi binomiale dont on donnera les paramètres.
   b) Calculer $P(X = 2)$ et $P(X \geq 1)$.
   c) Calculer l'espérance de $X$.`,
  solution: R`### Exercice 1
1. Les entiers $\equiv 4\;[11]$ sont $4, 15, 26, 37, \dots$ ; le premier qui est $\equiv 2\;[5]$ est $37$ ($37 = 7 \times 5 + 2$) : $x_0 = 37$.
2. a) Si $x$ est solution, $5 \mid x - 37$ et $11 \mid x - 37$ ; $5$ et $11$ sont premiers entre eux, donc (Gauss) $55 \mid x - 37$. Réciproquement, si $x = 37 + 55k$, alors $x \equiv 37 \equiv 2\;[5]$ et $x \equiv 37 \equiv 4\;[11]$.
   b) $\mathcal S = \{37 + 55k,\ k \in \mathbb{Z}\}$.
3. Le nombre $N$ de cahiers vérifie $(S)$ : $450 \leq 37 + 55k \leq 500 \iff 7{,}5 \leq k \leq 8{,}4$, donc $k = 8$ : **477 cahiers**.

### Exercice 2
*Repère pour vérifier : $A = 0$, $B = 4$, $C = 4 + 4i$, $D = 4i$, $O = 2 + 2i$, $J = 4 + 2i$.*
1. Figure : carré direct, $O$ intersection des diagonales, $J$ milieu de $[BC]$.
2. a) $(AB)$ et $(AC)$ se coupent en $A$ et $(\overrightarrow{AB}, \overrightarrow{AC}) = \dfrac\pi4$ : $S_{(AC)} \circ S_{(AB)}$ est la rotation de centre $A$ et d'angle $2 \times \dfrac\pi4 = \dfrac\pi2$, c'est $r_A$.
   b) La somme des angles vaut $\dfrac\pi2 + \dfrac\pi2 = \pi \neq 0\;[2\pi]$ : $f$ est une rotation d'angle $\pi$, c'est-à-dire une **symétrie centrale**.
   c) $r_A(A) = A$ et $r_B(A)$ : le point $A'$ tel que $BA' = BA$ et $(\overrightarrow{BA}, \overrightarrow{BA'}) = \frac\pi2$, soit $z_{A'} = i(0 - 4) + 4 = 4 - 4i$. Le centre $E$ est le milieu de $[AA']$ : $z_E = 2 - 2i$. $O = 2 + 2i$ et $E = 2 - 2i$ sont conjugués : $E$ est le symétrique de $O$ par rapport à $(AB)$ (l'axe réel).
3. a) $S : z' = az$ (centre $A = 0$) et $S(B) = O$ : $a = \dfrac{2 + 2i}{4} = \dfrac{1 + i}{2}$. Rapport $|a| = \dfrac{\sqrt2}{2}$, angle $\arg a = \dfrac\pi4$.
   b) $\dfrac{1 + i}{2}(4 + 4i) = \dfrac{4 + 8i - 4}{2} = 4i = z_D$ : $S(C) = D$.
   c) $S(J) = \dfrac{1 + i}{2}(4 + 2i) = \dfrac{2 + 6i}{2} = 1 + 3i$, milieu de $[OD]$ (logique : une similitude conserve les milieux). L'image de $[BC]$ est $[S(B)S(C)] = [OD]$.
4. a) $BA + BC = 4 + 4 = 8 = 2AB$ et $DA + DC = 8$ : $B, D \in (\mathcal E)$.
   b) $AC = 4\sqrt2 < 8$ : $(\mathcal E)$ est l'ellipse de **foyers $A$ et $C$**, de grand axe $2a = 8$ ; son centre est le milieu $O$ de $[AC]$ et son axe focal la droite $(AC)$.
   c) $a = 4$, $c = \dfrac{AC}{2} = 2\sqrt2$ : $e = \dfrac ca = \dfrac{\sqrt2}{2}$. $b^2 = a^2 - c^2 = 16 - 8 = 8$, $b = 2\sqrt2$ : petit axe $2b = 4\sqrt2$ cm. (Contrôle : le petit axe porte $B$ et $D$ et $OB = 2\sqrt2 = b$.)

### Exercice 3
1. Pour $u \in [0 ; 1]$, $1 + u > 0$. $\dfrac1{1 + u} - (1 - u) = \dfrac{1 - (1 - u^2)}{1 + u} = \dfrac{u^2}{1 + u} \geq 0$ ; $\left(1 - \dfrac u2\right) - \dfrac1{1 + u} = \dfrac{(2 - u)(1 + u) - 2}{2(1 + u)} = \dfrac{u(1 - u)}{2(1 + u)} \geq 0$.
2. a) $g'(x) = (1 - x)e^{-x} \geq 0$ sur $[0 ; 1]$ : $g$ est croissante, donc $0 = g(0) \leq g(x) \leq g(1) = \dfrac1e < 1$.
   b) $G'(x) = -e^{-x} + (x + 1)e^{-x} = xe^{-x} = g(x)$. $J = G(1) - G(0) = -\dfrac2e + 1 = 1 - \dfrac2e$.
3. Avec $u = g(x) \in [0 ; 1]$ : $1 - g(x) \leq \dfrac1{1 + g(x)} \leq 1 - \dfrac{g(x)}2$ ; on intègre sur $[0 ; 1]$ : $1 - J \leq I \leq 1 - \dfrac J2$, soit $\dfrac2e \leq I \leq \dfrac12 + \dfrac1e$.
   Numériquement $0{,}735 \leq I \leq 0{,}868$, d'où par exemple $0{,}7 \leq I \leq 0{,}9$ (la valeur exacte est $I \approx 0{,}797$).

### Exercice 4
1. $P(k) = \lambda k$ et $\lambda(1 + 2 + \dots + 6) = 21\lambda = 1$ : $\lambda = \dfrac1{21}$, $P(k) = \dfrac{k}{21}$.
2. Multiples de 3 : $\{3 ; 6\}$, $p = \dfrac{3 + 6}{21} = \dfrac37$.
3. a) Trois épreuves identiques et indépendantes, à deux issues (succès « multiple de 3 » de probabilité $\frac37$) : $X \sim \mathcal B\left(3 ; \frac37\right)$.
   b) $P(X = 2) = 3\left(\dfrac37\right)^2\dfrac47 = \dfrac{108}{343} \approx 0{,}315$ ; $P(X \geq 1) = 1 - \left(\dfrac47\right)^3 = \dfrac{279}{343} \approx 0{,}813$.
   c) $E(X) = 3 \times \dfrac37 = \dfrac97$.`,
}

const mathsA1 = {
  title: 'Sujet Cognix n°1 — Mathématiques série A : fractions et PPCM, polynôme et exponentielle, fonction homographique, ajustement de Mayer',
  inspiredBy: 'Bac A 2021 — Mathématiques : fractions et PPCM, polynôme et logarithme, fonction homographique, ajustement de Mayer',
  exam: { exam_kind: 'bac_blanc', duration_min: 180, bareme: [
    { label: 'Exercice 1', points: 7 }, { label: 'Exercice 2', points: 8 }, { label: 'Exercice 3', points: 5 },
  ] },
  statement: R`**Sujet type bac inédit (Cognix) — Série A — Mathématiques — Durée 3 h**

### Exercice 1 (7 points)
**Partie A.** On donne $a = \dfrac{7}{12}$, $b = \dfrac{15}{18}$ et $c = \dfrac{10}{45}$.
1. Écrire chacune de ces fractions sous forme irréductible.
2. Déterminer le PPCM des dénominateurs obtenus.
3. Calculer $S = a + b - c$ et donner le résultat sous forme irréductible.

**Partie B.** On considère le polynôme $P(x) = 2x^3 - x^2 - 13x - 6$.
1. Calculer $P(-2)$ et $P(3)$.
2. Déterminer les réels $\alpha$, $\beta$, $\gamma$ tels que $P(x) = (2x + 1)(\alpha x^2 + \beta x + \gamma)$.
3. Résoudre dans $\mathbb{R}$ l'équation $P(x) = 0$.
4. En posant $X = e^x$, résoudre dans $\mathbb{R}$ l'équation $2e^{3x} - e^{2x} - 13e^x - 6 = 0$.

### Exercice 2 (8 points)
Soit $g$ la fonction définie par $g(x) = \dfrac{2x + 1}{x - 1}$ et $(\mathscr C)$ sa courbe représentative dans un repère orthonormé (unité : 1 cm).
1. Déterminer l'ensemble de définition $D_g$ de $g$.
2. Déterminer les réels $a$ et $b$ tels que, pour tout $x \in D_g$, $g(x) = a + \dfrac{b}{x - 1}$.
3. Calculer les limites de $g$ aux bornes de $D_g$ et en déduire les asymptotes de $(\mathscr C)$.
4. Calculer $g'(x)$, étudier son signe et dresser le tableau de variation de $g$.
5. Déterminer les coordonnées des points d'intersection de $(\mathscr C)$ avec les axes du repère.
6. Écrire une équation de la tangente $(T)$ à $(\mathscr C)$ au point d'abscisse $0$.
7. Tracer $(T)$, les asymptotes et $(\mathscr C)$ (on placera les points d'abscisses $-2$, $2$ et $4$).

### Exercice 3 (5 points)
Une coopérative agricole a relevé sa production d'arachides $Y$ (en tonnes) pendant six années consécutives, l'année étant repérée par son rang $X$ :

| $X$ (rang de l'année) | 1 | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|---|
| $Y$ (production en tonnes) | 2,1 | 2,6 | 3,2 | 3,5 | 4,1 | 4,4 |

1. Représenter le nuage de points de cette série.
2. Calculer les coordonnées du point moyen $G$.
3. a) Calculer les coordonnées des points moyens $G_1$ des trois premières années et $G_2$ des trois dernières.
   b) Déterminer une équation de la droite de Mayer $(G_1G_2)$ et vérifier que $G$ lui appartient.
4. En utilisant cet ajustement :
   a) estimer la production de la 8ᵉ année ;
   b) déterminer à partir de quelle année la production dépassera 6 tonnes.`,
  solution: R`### Exercice 1
**Partie A**
1. $a = \dfrac7{12}$ est irréductible ($\text{PGCD}(7, 12) = 1$) ; $b = \dfrac{15}{18} = \dfrac{3 \times 5}{3 \times 6} = \dfrac56$ ; $c = \dfrac{10}{45} = \dfrac{5 \times 2}{5 \times 9} = \dfrac29$.
2. $12 = 2^2 \times 3$, $6 = 2 \times 3$, $9 = 3^2$ : $\text{PPCM}(12, 6, 9) = 2^2 \times 3^2 = 36$.
3. $S = \dfrac{21}{36} + \dfrac{30}{36} - \dfrac{8}{36} = \dfrac{43}{36}$ (irréductible : $43$ est premier).

**Partie B**
1. $P(-2) = -16 - 4 + 26 - 6 = 0$ et $P(3) = 54 - 9 - 39 - 6 = 0$.
2. $(2x + 1)(\alpha x^2 + \beta x + \gamma) = 2\alpha x^3 + (2\beta + \alpha)x^2 + (2\gamma + \beta)x + \gamma$. Par identification : $2\alpha = 2$, $2\beta + \alpha = -1$, $\gamma = -6$, d'où $\alpha = 1$, $\beta = -1$, $\gamma = -6$ (contrôle : $2\gamma + \beta = -13$). $P(x) = (2x + 1)(x^2 - x - 6)$.
3. $x^2 - x - 6 = (x - 3)(x + 2)$ : $\mathcal S = \left\{-2 \,;\, -\tfrac12 \,;\, 3\right\}$.
4. Avec $X = e^x > 0$, l'équation s'écrit $P(X) = 0$. Seule la solution positive convient : $e^x = 3$, d'où $\mathcal S = \{\ln 3\}$.

### Exercice 2
1. $D_g = \mathbb{R} \setminus \{1\} = \,]-\infty ; 1[ \,\cup\, ]1 ; +\infty[$.
2. $a + \dfrac{b}{x - 1} = \dfrac{ax - a + b}{x - 1}$ : $a = 2$ et $-a + b = 1$, donc $b = 3$. $g(x) = 2 + \dfrac3{x - 1}$.
3. $\lim\limits_{\pm\infty} g = 2$ : asymptote horizontale $y = 2$. $\lim\limits_{1^-} g = -\infty$ et $\lim\limits_{1^+} g = +\infty$ : asymptote verticale $x = 1$.
4. $g'(x) = \dfrac{2(x - 1) - (2x + 1)}{(x - 1)^2} = \dfrac{-3}{(x - 1)^2} < 0$ : $g$ est strictement décroissante sur $]-\infty ; 1[$ (de $2$ à $-\infty$) et sur $]1 ; +\infty[$ (de $+\infty$ à $2$).
5. Axe des ordonnées : $g(0) = -1$, point $(0 ; -1)$. Axe des abscisses : $2x + 1 = 0$, point $\left(-\frac12 ; 0\right)$.
6. $g'(0) = -3$ : $(T) : y = -3x - 1$.
7. Points : $g(-2) = 1$, $g(2) = 5$, $g(4) = 3$. Hyperbole de centre $(1 ; 2)$ ; branche de gauche sous $y = 2$ passant par $(-2 ; 1)$, $\left(-\frac12 ; 0\right)$, $(0 ; -1)$ ; branche de droite au-dessus de $y = 2$ passant par $(2 ; 5)$, $(4 ; 3)$.

### Exercice 3
1. Nuage : six points sensiblement alignés, en hausse.
2. $\overline X = 3{,}5$ et $\overline Y = \dfrac{19{,}9}{6} \approx 3{,}32$ : $G(3{,}5 \,;\, 3{,}32)$.
3. a) $G_1\left(2 \,;\, \dfrac{7{,}9}{3}\right) \approx (2 \,;\, 2{,}63)$ et $G_2\left(5 \,;\, \dfrac{12}{3}\right) = (5 \,;\, 4)$.
   b) Pente $m = \dfrac{4 - 2{,}633}{3} \approx 0{,}456$ ; $4 = 0{,}456 \times 5 + p$ donne $p \approx 1{,}72$ : $y = 0{,}456x + 1{,}72$. Pour $x = 3{,}5$ : $0{,}456 \times 3{,}5 + 1{,}72 \approx 3{,}32$ : $G$ est bien sur la droite.
4. a) $x = 8$ : $y \approx 0{,}456 \times 8 + 1{,}72 \approx 5{,}37$ tonnes.
   b) $0{,}456x + 1{,}72 > 6 \iff x > 9{,}39$ : à partir de la **10ᵉ année**.`,
}

export const BLOCS = [
  { subject: 'Mathématiques', levels: ['bac_d'], chapterTitle: CHAPTER, description: DESCRIPTION, exercises: [mathsD1] },
  { subject: 'Mathématiques', levels: ['bac_c'], chapterTitle: CHAPTER, description: DESCRIPTION, exercises: [mathsC1] },
  { subject: 'Mathématiques', levels: ['bac_a'], chapterTitle: CHAPTER, description: DESCRIPTION, exercises: [mathsA1] },
]
