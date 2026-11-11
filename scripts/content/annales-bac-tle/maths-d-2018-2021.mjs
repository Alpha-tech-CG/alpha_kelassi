// Annales du bac — MATHÉMATIQUES série D (Congo), sessions 2018 à 2021.
// Source : compilation « sujets et corrigés bac D 2009-2021 » (PDF fourni le 26/10/2026).
// Énoncés transcrits (erreurs signalées) ; corrigés rédigés pour l'application.
// Rangs : 2021 = 10, 2020 = 11, 2019 = 12, 2018 = 13.
const R = String.raw

const bac2021 = {
  title: 'Bac D 2021 — Mathématiques : z³ + 8i = 0 et similitude, projection vectorielle, fonction (ln x)² et aire, régression',
  statement: R`**Baccalauréat 2021 — Série D — Mathématiques**

### Exercice 1 (5 points)
1. On considère dans $\mathbb{C}$ l'équation $(E) : z^3 + 8i = 0$.
   a) Vérifier que $a = 2i$ est solution de $(E)$.
   b) Prouver que $(E)$ peut s'écrire $(z - 2i)(z^2 + 2iz - 4) = 0$.
   c) Achever la résolution.
2. Dans le plan complexe, on considère les points $A$, $B$, $C$ d'affixes $2i$, $-\sqrt3 - i$ et $\sqrt3 - i$.
   a) Calculer le module et un argument de $U = \dfrac{z_C - z_A}{z_B - z_A}$.
   b) En déduire la nature du triangle $ABC$.
3. $I$ est le point d'affixe $-i$ et $S$ la similitude plane directe de centre $A$ qui transforme $C$ en $I$.
   a) Donner l'écriture complexe de $S$.
   b) Déterminer l'angle et le rapport de $S$.

### Exercice 2 (5 points)
On considère l'endomorphisme $f$ de $\mathbb{R}^2$ (base $(\vec i, \vec j)$) défini par $f(\vec v_1) = \vec 0$ et $f(\vec v_2) = \vec v_2$, avec $\vec v_1 = -\vec i + 5\vec j$ *(le sujet imprimé porte $\vec v_1 = \vec i + 5\vec j$, ce qui est une erreur)* et $\vec v_2 = -2\vec i + 5\vec j$.
1. a) Montrer que $f(\vec i) = 2\vec i - 5\vec j$ et $f(\vec j) = \frac25\vec i - \vec j$.
   b) En déduire la matrice de $f$.
2. Prouver que $f$ n'est pas bijective.
3. Soit $\vec u' = x'\vec i + y'\vec j$ l'image de $\vec u = x\vec i + y\vec j$.
   a) Exprimer $x'$ et $y'$ en fonction de $x$ et $y$.
   b) Montrer que $f \circ f(\vec i) = f(\vec i)$ et $f \circ f(\vec j) = f(\vec j)$.
   c) En déduire la nature de $f$.
   d) Donner les éléments caractéristiques de $f$.

### Exercice 3 (7 points)
$f(x) = (\ln x)^2$ sur $]0 ; +\infty[$ ; $(\mathscr{C})$ est sa courbe (unité : 2 cm).

**Partie A**
1. Montrer que $f'(x) = \dfrac{2\ln x}{x}$.
2. Étudier le signe de $f'(x)$.
3. Montrer que $\lim\limits_{0^+} f = +\infty$ et $\lim\limits_{+\infty} f = +\infty$.
4. Dresser le tableau de variation de $f$.
5. Montrer que $\lim\limits_{+\infty}\dfrac{f(x)}{x} = 0$, puis interpréter.
6. Construire $(\mathscr{C})$.

**Partie B** — Soit $g(x) = -f(x)$ et $(\mathscr{C}')$ sa courbe.
1. Comment déduit-on $(\mathscr{C}')$ de $(\mathscr{C})$ ?
2. Sans étudier $g$, dresser son tableau de variation.
3. Construire $(\mathscr{C}')$.

**Partie C** — Soit $H(x) = x(\ln x)^2 - 2x\ln x + 2x$.
1. Montrer que $H$ est une primitive de $f$ sur $]0 ; +\infty[$.
2. Calculer en cm² l'aire de la portion de plan délimitée par $(\mathscr{C})$, $(\mathscr{C}')$ et les droites $x = 1$ et $x = e$.

### Exercice 4 (3 points)
Une enquête donne $X$ (nombre d'exemplaires du produit) et $Y$ (prix de vente en milliers de F CFA) :

| $X \backslash Y$ | 1 | 2 | 3 |
|---|---|---|---|
| 0 | 6 | 3 | 1 |
| 1 | 4 | 11 | 3 |
| 2 | 1 | 10 | 16 |
| 3 | 0 | 5 | 13 |
| 4 | 2 | 1 | 4 |

1. Déterminer les séries marginales de $X$ et de $Y$.
2. Déterminer les variances de $X$ et de $Y$ sachant que le point moyen est $G(1{,}93 ; 2{,}3)$.
3. On donne $\text{cov}(X, Y) = 0{,}44$. Déterminer par la méthode des moindres carrés l'équation de la droite de régression de $Y$ en $X$.
4. Calculer le coefficient de corrélation linéaire.`,
  solution: R`### Exercice 1
1. a) $(2i)^3 + 8i = -8i + 8i = 0$.
   b) Développement : $z^3 + 2iz^2 - 4z - 2iz^2 + 4z + 8i = z^3 + 8i$.
   c) $z^2 + 2iz - 4 = 0$ : $\Delta' = i^2 + 4 = 3$, racines $-i \pm \sqrt3$. $S = \{2i \,;\, -\sqrt3 - i \,;\, \sqrt3 - i\}$.
2. a) $U = \dfrac{\sqrt3 - 3i}{-\sqrt3 - 3i} = \dfrac12 + i\dfrac{\sqrt3}{2}$ : $|U| = 1$, $\arg U = \dfrac\pi3$.
   b) $AB = AC$ et un angle de $\frac\pi3$ : $ABC$ est **équilatéral**.
3. a) $I$ est le milieu de $[BC]$ (pied de la hauteur issue de $A$) : $\dfrac{AI}{AC} = \cos\frac\pi6 = \dfrac{\sqrt3}{2}$ et $(\overrightarrow{AC}, \overrightarrow{AI}) = -\dfrac\pi6$. Donc $z' - 2i = \frac{\sqrt3}{2}e^{-i\frac\pi6}(z - 2i)$, soit $z' = \left(\frac34 - i\frac{\sqrt3}{4}\right)z - \frac{\sqrt3}{2} + \frac12i$.
   b) Angle $-\dfrac\pi6$, rapport $\dfrac{\sqrt3}{2}$.

### Exercice 2
1. a) $-f(\vec i) + 5f(\vec j) = \vec 0$ et $-2f(\vec i) + 5f(\vec j) = -2\vec i + 5\vec j$ : par différence, $f(\vec i) = 2\vec i - 5\vec j$, puis $f(\vec j) = \frac15f(\vec i) = \frac25\vec i - \vec j$.
   b) $M = \begin{pmatrix} 2 & \frac25 \\ -5 & -1 \end{pmatrix}$.
2. $\det M = -2 + 2 = 0$ : $f$ n'est pas bijective (son noyau contient $\vec v_1 \neq \vec 0$).
3. a) $x' = 2x + \frac25y$ ; $y' = -5x - y$.
   b) $f(2\vec i - 5\vec j) = 2f(\vec i) - 5f(\vec j) = 4\vec i - 10\vec j - 2\vec i + 5\vec j = f(\vec i)$ ; de même $f\left(\frac25\vec i - \vec j\right) = f(\vec j)$.
   c) $f \circ f = f$ : **projection vectorielle**.
   d) Base (vecteurs invariants) : $5x + 2y = 0$, droite dirigée par $\vec v_2 = (-2 ; 5)$. Direction ($\ker f$) : $5x + y = 0$, droite dirigée par $\vec v_1 = (-1 ; 5)$.

### Exercice 3
**Partie A**
1. $(u^2)' = 2uu'$ avec $u = \ln x$.
2. $f'(x)$ a le signe de $\ln x$ : négatif sur $]0 ; 1[$, positif sur $]1 ; +\infty[$.
3. $\ln x \to -\infty$ en $0^+$ et $+\infty$ en $+\infty$ : son carré tend vers $+\infty$.
4. $f$ décroît de $+\infty$ à $f(1) = 0$, puis croît vers $+\infty$.
5. Avec $x = \frac1{u^2}$ ($u \to 0^+$) : $\dfrac{(\ln x)^2}{x} = 4(u\ln u)^2 \to 0$. Branche parabolique de direction $(Ox)$ en $+\infty$.

**Partie B**
1. $(\mathscr{C}')$ est la symétrique de $(\mathscr{C})$ par rapport à l'**axe des abscisses** $(Ox)$.
2. $g$ croît de $-\infty$ à $0$ sur $]0 ; 1]$, puis décroît vers $-\infty$.

**Partie C**
1. $H'(x) = (\ln x)^2 + 2\ln x - 2\ln x - 2 + 2 = (\ln x)^2$.
2. $\mathcal{A} = \displaystyle\int_1^e 2f = 2\big[H\big]_1^e = 2\left((e - 2e + 2e) - 2\right) = 2(e - 2)$ u.a. $= 8(e - 2)$ cm² $\approx 5{,}75$ cm².

### Exercice 4
1. $X$ : 0 (10), 1 (18), 2 (27), 3 (18), 4 (7) ; $Y$ : 1 (13), 2 (30), 3 (37) ; $N = 80$. ($\overline X = 1{,}925$, $\overline Y = 2{,}3$.)
2. $V(X) = \dfrac{18 + 108 + 162 + 112}{80} - 1{,}93^2 \approx 1{,}275$ ; $V(Y) = \dfrac{13 + 120 + 333}{80} - 2{,}3^2 = 0{,}535$.
3. Avec la valeur du sujet : $a = \dfrac{0{,}44}{1{,}275} \approx 0{,}345$, $b = 2{,}3 - 0{,}345 \times 1{,}93 \approx 1{,}634$ : $Y = 0{,}345X + 1{,}634$.
4. $r = \dfrac{0{,}44}{\sqrt{1{,}275 \times 0{,}535}} \approx 0{,}53$.

> Remarque : à partir du tableau, $\frac1N\sum n_{ij}x_iy_j = \frac{384}{80} = 4{,}8$, d'où une covariance $\approx 4{,}8 - 1{,}925 \times 2{,}3 \approx 0{,}37$ (et non $0{,}44$). Avec cette valeur : $Y \approx 0{,}29X + 1{,}74$ et $r \approx 0{,}45$.`,
}

const bac2020 = {
  title: 'Bac D 2020 — Mathématiques : système complexe, polynôme et rotation, symétrie vectorielle, fonction x(1 + e²⁻ˣ) et réciproque, probabilités',
  statement: R`**Baccalauréat 2020 — Série D — Mathématiques**

### Exercice 1 (5 points)
1. Trouver les nombres complexes $z_1$, $z_2$, $z_3$ tels que $z_1 + z_2 = -3 + i$, $i\,\overline{z_2} = 1 - 2i$ et $z_2 \times z_3 = -1 - 2i$.
2. On considère $P(z) = z^3 + (3 - 2i)z^2 + (1 - 4i)z - 1 - 2i$.
   a) Vérifier que $i$ est une racine de $P$.
   b) Trouver $z_0$ tel que $P(z) = (z - i)(z - z_0)(z + 2 - i)$.
   c) Résoudre $P(z) = 0$.
3. $A$, $B$, $C$ ont pour affixes $z_A = -1$, $z_B = -2 + i$, $z_C = i$.
   a) Donner l'écriture complexe de la rotation $R$ de centre $A$ qui transforme $B$ en $C$.
   b) En déduire l'angle de $R$.

### Exercice 2 (5 points)
$\mathcal{B} = (\vec i, \vec j)$ est la base canonique de $\mathbb{R}^2$ ; $\vec u = \vec i + \vec j$ et $\vec v = -\vec i + 2\vec j$.
1. a) Prouver que $\mathcal{B}' = (\vec u, \vec v)$ est une base. b) Écrire $\vec i$ et $\vec j$ dans la base $\mathcal{B}'$.
2. $f$ est l'endomorphisme tel que $f(\vec u) = \vec u$ et $f(\vec v) = -\vec v$.
   a) Calculer $f(\vec i)$ et $f(\vec j)$.
   b) Montrer que $f \circ f(\vec i) = \vec i$ et $f \circ f(\vec j) = \vec j$.
   c) En déduire la nature de $f$.
   d) Donner la base $E$ et la direction $D$ de $f$.

### Exercice 3 (7 points)
**Partie A** — $h(x) = (1 - x)e^{2-x} + 1$ sur $\mathbb{R}$.
1. a) Calculer $h'(x)$. b) En déduire son signe. c) On admet $\lim\limits_{+\infty} h = 1$ et $\lim\limits_{-\infty} h = +\infty$ ; dresser le tableau de variation de $h$.
2. En déduire le signe de $h(x)$.

**Partie B** — $f(x) = x\left(1 + e^{2-x}\right)$ sur $\mathbb{R}$ ; $(\mathscr{C})$ est sa courbe (unité 1 cm).
1. Calculer $\lim\limits_{+\infty} f$.
2. a) Montrer que $f'(x) = h(x)$. b) Dresser le tableau de variation de $f$ (on admet $\lim\limits_{-\infty} f = -\infty$).
3. a) Montrer que $f$ admet une bijection réciproque $f^{-1}$ définie sur $\mathbb{R}$. b) Dresser le tableau de variation de $f^{-1}$.
4. a) Préciser la branche infinie de $(\mathscr{C})$ en $-\infty$.
   b) Montrer que la droite $(\Delta) : y = x$ est asymptote à $(\mathscr{C})$ en $+\infty$.
   c) Étudier la position de $(\mathscr{C})$ par rapport à $(\Delta)$.
5. Construire $(\Delta)$, $(\mathscr{C})$ et la courbe $(\mathscr{C}')$ de $f^{-1}$.

### Exercice 4 (3 points)
Un produit est soumis à deux tests indépendants de normes $A$ et $B$ ; il est accepté s'il satisfait aux deux. $P(A) = 0{,}9$ et $P(B) = 0{,}95$.
1. Calculer $P(A \cap B)$.
2. $C$ : « le produit n'est pas accepté ». Montrer que $P(C) = 0{,}145$.
3. Le client accepte finalement le produit s'il satisfait au test $A$ ou au test $B$. Calculer $P(A \cup B)$.`,
  solution: R`### Exercice 1
1. $i\overline{z_2} = 1 - 2i \Rightarrow \overline{z_2} = \dfrac{1 - 2i}{i} = -2 - i \Rightarrow z_2 = -2 + i$. Puis $z_1 = -3 + i - z_2 = -1$ et $z_3 = \dfrac{-1 - 2i}{-2 + i} = i$.
2. a) $P(i) = -i - (3 - 2i) + (1 - 4i)i - 1 - 2i = -i - 3 + 2i + i + 4 - 1 - 2i = 0$.
   b) Terme constant : $(-i)(-z_0)(2 - i) = -1 - 2i \Rightarrow z_0(1 + 2i) = -1 - 2i \Rightarrow z_0 = -1$.
   c) $S = \{i \,;\, -1 \,;\, -2 + i\}$.
3. a) $a = \dfrac{z_C - z_A}{z_B - z_A} = \dfrac{1 + i}{-1 + i} = -i$ : $z' = -i(z + 1) - 1 = -iz - 1 - i$.
   b) $-i = e^{-i\frac\pi2}$ : angle $-\dfrac\pi2$.

### Exercice 2
1. a) $\det(\vec u, \vec v) = 2 + 1 = 3 \neq 0$.
   b) $\vec i = \frac23\vec u - \frac13\vec v$ et $\vec j = \frac13\vec u + \frac13\vec v$.
2. a) $f(\vec i) = \frac23\vec u + \frac13\vec v = \frac13\vec i + \frac43\vec j$ ; $f(\vec j) = \frac13\vec u - \frac13\vec v = \frac23\vec i - \frac13\vec j$.
   b) $f\left(\frac13\vec i + \frac43\vec j\right) = \frac19\vec i + \frac49\vec j + \frac89\vec i - \frac49\vec j = \vec i$ ; de même $f \circ f(\vec j) = \vec j$.
   c) $f \circ f = \text{id}$ : **symétrie vectorielle**.
   d) Base $E = \text{Vect}(\vec u)$ ; direction $D = \text{Vect}(\vec v)$.

### Exercice 3
**Partie A**
1. a) $h'(x) = -e^{2-x} - (1 - x)e^{2-x} = (x - 2)e^{2-x}$.
   b) $h' < 0$ sur $]-\infty ; 2[$, $h' > 0$ sur $]2 ; +\infty[$.
   c) $h$ décroît de $+\infty$ à $h(2) = 0$, puis croît vers $1$.
2. Minimum nul : $h(x) \geq 0$ sur $\mathbb{R}$ (nul seulement en 2).

**Partie B**
1. $\lim\limits_{+\infty} f = +\infty$ (car $1 + e^{2-x} \to 1$).
2. a) $f'(x) = 1 + e^{2-x} - xe^{2-x} = (1 - x)e^{2-x} + 1 = h(x)$.
   b) $f' \geq 0$ : $f$ croît de $-\infty$ à $+\infty$, avec une tangente horizontale en $(2 ; 4)$.
3. a) $f$ continue, strictement croissante (sa dérivée ne s'annule qu'en un point) : bijection de $\mathbb{R}$ sur $\mathbb{R}$.
   b) $f^{-1}$ est croissante de $-\infty$ à $+\infty$ ; elle a une tangente verticale au point $(4 ; 2)$ (non dérivable en 4).
4. a) $\dfrac{f(x)}{x} = 1 + e^{2-x} \to +\infty$ : branche parabolique de direction $(Oy)$ en $-\infty$.
   b) $f(x) - x = xe^{2-x} \to 0$ en $+\infty$.
   c) $f(x) - x = xe^{2-x}$ a le signe de $x$ : $(\mathscr{C})$ est au-dessus de $(\Delta)$ pour $x > 0$, en dessous pour $x < 0$, et la coupe en $O$.
5. $(\mathscr{C}')$ est la symétrique de $(\mathscr{C})$ par rapport à $(\Delta)$.

### Exercice 4
1. Tests indépendants : $P(A \cap B) = 0{,}9 \times 0{,}95 = 0{,}855$.
2. $P(C) = 1 - 0{,}855 = 0{,}145$.
3. $P(A \cup B) = 0{,}9 + 0{,}95 - 0{,}855 = 0{,}995$.`,
}

const bac2019 = {
  title: 'Bac D 2019 — Mathématiques : équation du 2ᵈ degré, rotation et cos π/12, symétrie vectorielle, fonctions ln x/x + 1/x et 1/x, loi de probabilité',
  statement: R`**Baccalauréat 2019 — Série D — Mathématiques**

### Exercice 1 (5 points)
1. On considère l'équation $(E) : Z^2 - 4Z + 8 = 0$.
   a) Résoudre $(E)$.
   b) Écrire sous forme trigonométrique la solution dont la partie imaginaire est négative.
2. Dans le plan complexe, $A$ et $B$ ont pour affixes $2 - 2i$ et $2 + 2i$.
   a) Écrire sous forme algébrique $U = \dfrac{Z_B}{Z_A}$.
   b) En déduire la nature du triangle $OAB$.
3. Soit $f$ l'application $M(Z) \mapsto M'(Z')$ avec $Z' = e^{i\frac\pi3}Z$.
   a) Préciser la nature de $f$.
   b) Écrire sous forme trigonométrique, puis algébrique, l'affixe de $A' = f(A)$.
   c) En déduire les valeurs exactes de $\cos\dfrac{\pi}{12}$ et $\sin\dfrac{\pi}{12}$.

### Exercice 2 (5 points)
$f$ est l'endomorphisme de $E$ (base canonique $(\vec i, \vec j)$) défini par $x' = 2x + 3y$ et $y' = -x - 2y$.
1. Déterminer $f(\vec i)$ et $f(\vec j)$.
2. En déduire la matrice de $f$.
3. Soit $\vec V(3 ; -4)$. Donner son image $\vec V'$.
4. Montrer que $f$ est un endomorphisme bijectif.
5. a) Calculer $f \circ f(\vec i)$ et $f \circ f(\vec j)$. b) En déduire la nature de $f$. c) Déterminer sa base et sa direction.

### Exercice 3 (7 points)
**Partie I** — $g(x) = \dfrac1x$ sur $]0 ; +\infty[$, de courbe $(\mathscr{C}')$ (unité 2 cm).
1. Calculer $g'(x)$ et donner son signe.
2. Sachant que $\lim\limits_{0^+} g = +\infty$ et $\lim\limits_{+\infty} g = 0$, dresser le tableau de variation de $g$.

**Partie II** — $f(x) = \dfrac{\ln x}{x} + \dfrac1x$ sur $]0 ; +\infty[$, de courbe $(\mathscr{C})$.
1. a) Résoudre $f(x) = g(x)$. b) En déduire la position relative de $(\mathscr{C})$ et $(\mathscr{C}')$.
2. a) Calculer les limites de $f$ en $0^+$ et en $+\infty$. b) Montrer que $f'(x) = -\dfrac{\ln x}{x^2}$ et étudier son signe. c) Établir le tableau de variation de $f$.
3. En remarquant que les axes sont asymptotes aux deux courbes, tracer $(\mathscr{C})$ et $(\mathscr{C}')$.

**Partie III** — $h(x) = \frac12(\ln x)^2$ et $k(x) = f(x) - g(x)$ sur $]0 ; +\infty[$.
1. Démontrer que $h$ est une primitive de $k$.
2. Calculer en cm² l'aire de la portion de plan comprise entre $(\mathscr{C})$, $(\mathscr{C}')$ et les droites $x = 1$ et $x = e$.

### Exercice 4 (3 points)
Loi de probabilité d'une variable aléatoire $X$ :

| $x_i$ | 0 | 1 | $a$ | 3 |
|---|---|---|---|---|
| $P(X = x_i)$ | $\frac18$ | $\frac38$ | $\frac38$ | $b$ |

1. Calculer $E(X)$ en fonction de $a$ et $b$.
2. a) Déterminer $a$ et $b$ tels que $E(X) = \frac32$. b) Calculer la variance et l'écart-type de $X$.
3. Donner la fonction de répartition de $X$.`,
  solution: R`### Exercice 1
1. a) $\Delta' = 4 - 8 = -4 = (2i)^2$ : $Z_1 = 2 - 2i$ et $Z_2 = 2 + 2i$.
   b) $Z_1 = 2\sqrt2\left(\cos\left(-\frac\pi4\right) + i\sin\left(-\frac\pi4\right)\right)$.
2. a) $U = \dfrac{2 + 2i}{2 - 2i} = \dfrac{(1 + i)^2}{2} = i$.
   b) $|U| = 1$ et $\arg U = \frac\pi2$ : $OA = OB$ et angle droit en $O$ : $OAB$ est **rectangle isocèle en $O$**.
3. a) Rotation de centre $O$ et d'angle $\frac\pi3$.
   b) $Z_{A'} = e^{i\frac\pi3}\cdot2\sqrt2e^{-i\frac\pi4} = 2\sqrt2e^{i\frac\pi{12}}$ ; algébriquement $\left(\frac12 + i\frac{\sqrt3}2\right)(2 - 2i) = (1 + \sqrt3) + i(\sqrt3 - 1)$.
   c) $\cos\dfrac\pi{12} = \dfrac{1 + \sqrt3}{2\sqrt2} = \dfrac{\sqrt6 + \sqrt2}{4}$ et $\sin\dfrac\pi{12} = \dfrac{\sqrt3 - 1}{2\sqrt2} = \dfrac{\sqrt6 - \sqrt2}{4}$.

### Exercice 2
1. $f(\vec i) = 2\vec i - \vec j$ ; $f(\vec j) = 3\vec i - 2\vec j$.
2. $M = \begin{pmatrix} 2 & 3 \\ -1 & -2 \end{pmatrix}$.
3. $\vec V' = (6 - 12 ; -3 + 8) = (-6 ; 5)$.
4. $\det M = -4 + 3 = -1 \neq 0$ : $f$ est bijective.
5. a) $f(2 ; -1) = (1 ; 0)$ et $f(3 ; -2) = (0 ; 1)$ : $f \circ f = \text{id}$.
   b) Symétrie vectorielle.
   c) Base : $x + 3y = 0$ ; direction : $x + y = 0$.

### Exercice 3
**Partie I**
1. $g'(x) = -\dfrac1{x^2} < 0$. 2. $g$ décroît de $+\infty$ à $0$.

**Partie II**
1. a) $f(x) = g(x) \iff \dfrac{\ln x}{x} = 0 \iff x = 1$.
   b) $(\mathscr{C})$ est en dessous de $(\mathscr{C}')$ sur $]0 ; 1[$, au-dessus sur $]1 ; +\infty[$ ; elles se coupent en $(1 ; 1)$.
2. a) En $0^+$ : $f(x) = \dfrac{1 + \ln x}{x} \to -\infty$ ; en $+\infty$ : $f \to 0$.
   b) $f'(x) = \dfrac{1 - \ln x}{x^2} - \dfrac1{x^2} = -\dfrac{\ln x}{x^2}$ : positive sur $]0 ; 1[$, négative sur $]1 ; +\infty[$.
   c) $f$ croît de $-\infty$ à $f(1) = 1$, puis décroît vers $0$.
3. Asymptotes : $x = 0$ et $y = 0$ pour les deux courbes ; $(\mathscr{C})$ coupe l'axe des abscisses en $x = \frac1e$.

**Partie III**
1. $h'(x) = \ln x \times \dfrac1x = k(x)$.
2. Sur $[1 ; e]$, $f \geq g$ : $\mathcal{A} = \big[h\big]_1^e = \frac12$ u.a. $= 2$ cm².

### Exercice 4
1. $E(X) = \frac38 + \frac{3a}{8} + 3b$.
2. a) Somme des probabilités : $\frac78 + b = 1$, donc $b = \frac18$ ; puis $\frac38(1 + a) + \frac38 = \frac32 \iff a = 2$.
   b) $E(X^2) = \frac38 + \frac{12}{8} + \frac98 = 3$ ; $V(X) = 3 - \frac94 = \frac34$ ; $\sigma = \frac{\sqrt3}{2} \approx 0{,}87$.
3. $F(x) = 0$ si $x < 0$ ; $\frac18$ sur $[0 ; 1[$ ; $\frac12$ sur $[1 ; 2[$ ; $\frac78$ sur $[2 ; 3[$ ; $1$ si $x \geq 3$.`,
}

const bac2018 = {
  title: 'Bac D 2018 — Mathématiques : translation et rotation, sous-espaces supplémentaires, fonction ln x/(ln x − 1) et e⁻²ˣ, ajustement linéaire',
  statement: R`**Baccalauréat 2018 — Série D — Mathématiques**

### Exercice 1 (5 points)
Dans le plan complexe, on considère $Z_A = 1 + 2i$, $Z_B = -1 + 2i$, $Z_C = 1 - i$ et $Z_D = 1$.
1. a) Déterminer l'affixe du vecteur $\overrightarrow{BC}$.
   b) Déterminer l'expression analytique de la translation de vecteur $\overrightarrow{BC}$.
   c) Trouver l'affixe de l'image $A'$ de $A$ par cette translation.
2. a) Prouver qu'une mesure de l'angle $(\overrightarrow{AD}, \overrightarrow{AB})$ est $-\frac\pi2$.
   b) Écrire l'expression analytique de la rotation $R$ de centre $A$ et d'angle $(\overrightarrow{AD}, \overrightarrow{AB})$.
   c) Trouver l'affixe de l'image $C'$ de $C$ par $R$.
3. Déterminer le rapport et l'angle de la similitude plane directe $S$ de centre $A$ qui transforme $B$ en $A$.

### Exercice 2 (5 points)
Dans le plan vectoriel $E$ (base $(\vec i, \vec j)$), on considère les droites vectorielles $(D_1) : x - 2y = 0$ et $(D_2) : x + y = 0$.
1. Vérifier que $(D_1)$ et $(D_2)$ sont engendrées par $\vec e_1 = 2\vec i + \vec j$ et $\vec e_2 = -\vec i + \vec j$.
2. Prouver que $(\vec e_1, \vec e_2)$ est une base de $E$.
3. Montrer que $(D_1)$ et $(D_2)$ sont supplémentaires dans $E$.
4. Soit $f$ l'endomorphisme tel que $f(\vec e_1) = \vec e_1$ et $f(\vec e_2) = -\vec e_2$. Exprimer $f(\vec i)$ et $f(\vec j)$ dans la base $(\vec i, \vec j)$.

### Exercice 3 (6 points)
$f(x) = \dfrac{\ln x}{-1 + \ln x}$ si $x > 0$ et $f(x) = e^{-2x}$ si $x \leq 0$ ; $(\mathscr{C})$ est sa courbe (unité 2 cm).
1. Déterminer l'ensemble de définition de $f$.
2. Vérifier que $f$ est continue en $0$.
3. Étudier la dérivabilité de $f$ en $0$.
4. a) Déterminer $f'$. b) Dresser le tableau de variation de $f$.
5. a) Préciser les branches infinies de $(\mathscr{C})$. b) Tracer $(\mathscr{C})$.
6. Calculer l'aire du domaine limité par $(\mathscr{C})$, l'axe des abscisses et les droites $x = -1$ et $x = 0$.

### Exercice 4 (4 points)
$x$ est le nombre de jours et $y$ le poids (en mg) d'une larve :

| $x$ | 1 | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|---|
| $y$ | 0,2 | 1,4 | 1,8 | 2 | 2,6 | 3 |

1. Calculer les coordonnées du point moyen $G$.
2. Déterminer l'équation de la droite de régression de $y$ en $x$.
3. Estimer le poids de la larve au 7ᵉ jour.`,
  solution: R`### Exercice 1
1. a) $z_{\overrightarrow{BC}} = (1 - i) - (-1 + 2i) = 2 - 3i$.
   b) $Z' = Z + 2 - 3i$, soit $x' = x + 2$ et $y' = y - 3$.
   c) $Z_{A'} = 3 - i$.
2. a) $\dfrac{Z_B - Z_A}{Z_D - Z_A} = \dfrac{-2}{-2i} = -i$ : $(\overrightarrow{AD}, \overrightarrow{AB}) = -\frac\pi2$.
   b) $Z' - Z_A = -i(Z - Z_A)$, d'où $x' = y - 1$ et $y' = -x + 3$.
   c) $C' : x' = -1 - 1 = -2$, $y' = -1 + 3 = 2$ : $Z_{C'} = -2 + 2i$.
3. ⚠️ Une similitude de centre $A$ laisse $A$ fixe et est bijective : elle ne peut pas envoyer $B \neq A$ sur $A$. Il n'existe **pas** de telle similitude (le calcul $Z' = aZ + b$ avec $S(A) = A$ et $S(B) = A$ donne $a = 0$). La question est à revoir dans le sujet.

### Exercice 2
1. $x = 2y \iff (x, y) = y(2, 1)$ et $x = -y \iff (x, y) = y(-1, 1)$.
2. $\det(\vec e_1, \vec e_2) = 2 + 1 = 3 \neq 0$.
3. $(\vec e_1, \vec e_2)$ est une base : $(D_1) + (D_2) = E$ ; et $x = 2y = -y$ implique $x = y = 0$ : $(D_1) \cap (D_2) = \{\vec 0\}$.
4. $2f(\vec i) + f(\vec j) = 2\vec i + \vec j$ et $-f(\vec i) + f(\vec j) = \vec i - \vec j$ : $f(\vec i) = \frac13\vec i + \frac23\vec j$ et $f(\vec j) = \frac43\vec i - \frac13\vec j$ ($f$ est la symétrie de base $(D_1)$ et de direction $(D_2)$).

### Exercice 3
1. Il faut $\ln x \neq 1$ pour $x > 0$ : $D_f = \,]-\infty ; e[\, \cup \,]e ; +\infty[$.
2. $f(0) = 1$ ; en $0^+$, $f(x) = 1 + \dfrac{1}{\ln x - 1} \to 1$ : continue.
3. À gauche : $\dfrac{e^{-2x} - 1}{x} \to -2$. À droite : $\dfrac{f(x) - 1}{x} = \dfrac{1}{x(\ln x - 1)} \to -\infty$ ($x\ln x \to 0^-$) : **non dérivable** en 0.
4. a) $x < 0$ : $f'(x) = -2e^{-2x}$ ; $x > 0$, $x \neq e$ : $f'(x) = \dfrac{-1}{x(\ln x - 1)^2}$.
   b) $f' < 0$ partout : $f$ décroît de $+\infty$ (en $-\infty$) à $1$ en $0$, puis jusqu'à $-\infty$ en $e^-$ ; de $+\infty$ en $e^+$ à $1$ en $+\infty$.
5. a) En $-\infty$ : $\dfrac{f(x)}{x} = \dfrac{e^{-2x}}{x} \to -\infty$, branche parabolique de direction $(Oy)$. Asymptote verticale $x = e$ ; asymptote horizontale $y = 1$ en $+\infty$.
6. $\mathcal{A} = \displaystyle\int_{-1}^0 e^{-2x}dx = \left[-\tfrac12e^{-2x}\right]_{-1}^0 = \frac{e^2 - 1}{2}$ u.a. $= 2(e^2 - 1)$ cm² $\approx 12{,}8$ cm².

### Exercice 4
1. $\overline x = 3{,}5$ ; $\overline y = \dfrac{11}{6} \approx 1{,}83$.
2. $\text{Cov} = \dfrac{47{,}4}{6} - 3{,}5 \times \dfrac{11}{6} = \dfrac{8{,}9}{6} \approx 1{,}483$ ; $V(x) = \dfrac{91}{6} - 12{,}25 = \dfrac{17{,}5}{6} \approx 2{,}917$.
   $a = \dfrac{8{,}9}{17{,}5} \approx 0{,}509$ ; $b = \dfrac{11}{6} - 0{,}509 \times 3{,}5 \approx 0{,}053$ : $y \approx 0{,}509x + 0{,}053$.
3. Pour $x = 7$ : $y \approx 3{,}61$ mg.`,
}

export const BLOCS = [
  { subject: 'Mathématiques', levels: ['bac_d'], chapterTitle: 'Annales du bac — Mathématiques série D', orderStart: 10, exercises: [bac2021, bac2020, bac2019, bac2018] },
]
