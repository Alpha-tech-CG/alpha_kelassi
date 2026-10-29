// Annales du bac — MATHÉMATIQUES série D (Congo), sessions 2014 à 2017.
// Source : compilation « sujets et corrigés bac D 2009-2021 » (PDF fourni le 26/10/2026).
// Énoncés transcrits (erreurs signalées) ; corrigés rédigés pour l'application.
// Rangs : 2017 = 14, 2016 = 15, 2015 = 16, 2014 = 17.
const R = String.raw

const bac2017 = {
  title: 'Bac D 2017 — Mathématiques : polynôme et rotation, symétrie vectorielle, fonction x − (x − 1) ln x, fonction de répartition',
  statement: R`**Baccalauréat 2017 — Série D — Mathématiques**

### Exercice 1 (5 points)
Le plan complexe est muni du repère orthonormé $(O ; \vec u, \vec v)$ avec $\|\vec u\| = \|\vec v\| = 2$ cm. On considère $P(Z) = Z^3 + Z^2 - 2$.
1. a) Montrer que 1 est une racine de $P$.
   b) Vérifier que $P(Z) = (Z - 1)(Z^2 + 2Z + 2)$.
   c) Résoudre dans $\mathbb{C}$ l'équation $P(Z) = 0$.
2. On considère les points $A$, $B$, $C$ d'affixes $Z_A = 1$, $Z_B = -1 + i$, $Z_C = -1 - i$.
   a) Construire le triangle $ABC$.
   b) Déterminer l'affixe $Z_D$ du point $D$ tel que $ABCD$ soit un parallélogramme.
3. Soit $R$ la rotation de centre $A$ et d'angle $\frac\pi3$.
   a) Montrer que l'expression complexe de $R$ est $Z' = \left(\frac12 + i\frac{\sqrt3}{2}\right)Z + \frac12 - i\frac{\sqrt3}{2}$.
   b) Exprimer les coordonnées $x'$ et $y'$ de $M' = R(M)$ en fonction de celles $x$ et $y$ de $M$.

### Exercice 2 (5 points)
$(\vec i, \vec j)$ est une base du plan vectoriel $E$ ; $f$ est l'endomorphisme tel que $5f(\vec i) = a\vec i + 4\vec j$ et $f(\vec j) = \frac45\vec i - \frac35\vec j$.
1. Déterminer la matrice de $f$ dans la base $(\vec i, \vec j)$.
2. Déterminer l'expression analytique de $f$.
3. Déterminer le réel $a$ pour que $f$ soit une symétrie vectorielle.
4. On pose $a = 3$.
   a) Déterminer les éléments caractéristiques de $f$ (base et direction).
   b) Déterminer un vecteur directeur $\vec e_1$ de la base.
   c) Déterminer un vecteur directeur $\vec e_2$ de la direction.
   d) Soient $\vec e_1 = 2\vec i + \vec j$ et $\vec e_2 = -\vec i + 2\vec j$. Démontrer que $(\vec e_1, \vec e_2)$ est une base.
   e) Donner la matrice de $f$ dans la base $(\vec e_1, \vec e_2)$.

### Exercice 3 (7 points)
**Partie A.** Soit $g(x) = -\dfrac1x + \ln x$ sur $]0 ; +\infty[$.
1. Calculer les limites de $g$ en $0^+$ et en $+\infty$.
2. a) Calculer $g'(x)$. b) Dresser le tableau de variation de $g$.
3. a) Montrer que $g(x) = 0$ a une solution unique $\alpha \in \left]\frac32 ; 2\right[$. b) En déduire le signe de $g(x)$.

**Partie B.** Soit $f(x) = x - (x - 1)\ln x$ sur $]0 ; +\infty[$ et $(\mathscr{C})$ sa courbe.
1. Calculer les limites de $f$ en $0^+$ et en $+\infty$.
2. a) Montrer que $f'(x) = -g(x)$. b) Dresser le tableau de variation de $f$ (on prendra $\alpha = 1{,}7$ et $f(\alpha) = 1{,}3$).
3. On admet que $f(x) = 0$ a deux solutions $x_0 \in \left]\frac12 ; 1\right[$ et $x_1 \in \left]\frac72 ; 4\right[$.
   a) Étudier les branches infinies de $(\mathscr{C})$.
   b) Tracer $(\mathscr{C})$.
4. Tracer la courbe $(\mathscr{C}')$ de $h(x) = -f(x)$ dans le même repère.

### Exercice 4 (3 points)
La fonction de répartition d'une variable aléatoire $X$ est donnée par :

| $x$ | $]-\infty ; 2[$ | $[2 ; 3[$ | $[3 ; 4[$ | $[4 ; 5[$ | $[5 ; 6[$ | $[6 ; +\infty[$ |
|---|---|---|---|---|---|---|
| $F(x)$ | 0 | $\frac16$ | $\frac{5}{24}$ | $\frac{7}{24}$ | $\frac13$ | 1 |

(Rappel : sur $[x_k ; x_{k+1}[$, $F$ vaut $P_1 + \dots + P_k$, où $P_i$ est la probabilité de la valeur $x_i$.)
1. Donner les valeurs prises par $X$.
2. Établir la loi de probabilité de $X$.
3. Calculer l'espérance $E(X)$.`,
  solution: R`### Exercice 1
1. a) $P(1) = 1 + 1 - 2 = 0$.
   b) $(Z - 1)(Z^2 + 2Z + 2) = Z^3 + 2Z^2 + 2Z - Z^2 - 2Z - 2 = Z^3 + Z^2 - 2$.
   c) $Z^2 + 2Z + 2 = 0$ : $\Delta' = 1 - 2 = -1 = i^2$, racines $-1 \pm i$. $S = \{1 ; -1 + i ; -1 - i\}$.
2. b) $\overrightarrow{AB} = \overrightarrow{DC} \iff Z_D = Z_C - Z_B + Z_A = 1 - 2i$.
3. a) $Z' - Z_A = e^{i\frac\pi3}(Z - Z_A)$ : $Z' = \left(\frac12 + i\frac{\sqrt3}{2}\right)(Z - 1) + 1 = \left(\frac12 + i\frac{\sqrt3}2\right)Z + \frac12 - i\frac{\sqrt3}{2}$.
   b) $x' = \frac12x - \frac{\sqrt3}{2}y + \frac12$ et $y' = \frac{\sqrt3}{2}x + \frac12y - \frac{\sqrt3}{2}$.

### Exercice 2
1. $M = \dfrac15\begin{pmatrix} a & 4 \\ 4 & -3 \end{pmatrix}$.
2. $x' = \frac a5x + \frac45y$ ; $y' = \frac45x - \frac35y$.
3. $f$ est une symétrie si $f \circ f = \text{id}$, c'est-à-dire $M^2 = I_2$ : $\frac1{25}\begin{pmatrix} a^2 + 16 & 4a - 12 \\ 4a - 12 & 25 \end{pmatrix} = I_2 \iff a = 3$.
4. a) Base (vecteurs invariants) : $\frac35x + \frac45y = x \iff x - 2y = 0$ : droite $x = 2y$. Direction ($f(\vec u) = -\vec u$) : $\frac35x + \frac45y = -x \iff 2x + y = 0$.
   b) $\vec e_1 = (2 ; 1)$. c) $\vec e_2 = (-1 ; 2)$.
   d) $\det(\vec e_1, \vec e_2) = 4 + 1 = 5 \neq 0$.
   e) $f(\vec e_1) = \vec e_1$, $f(\vec e_2) = -\vec e_2$ : matrice $\begin{pmatrix} 1 & 0 \\ 0 & -1 \end{pmatrix}$ ($f$ est la symétrie orthogonale d'axe $\text{Vect}(\vec e_1)$).

### Exercice 3
**Partie A**
1. $\lim\limits_{0^+} g = -\infty$ ; $\lim\limits_{+\infty} g = +\infty$.
2. $g'(x) = \dfrac1{x^2} + \dfrac1x = \dfrac{1 + x}{x^2} > 0$ : $g$ croît de $-\infty$ à $+\infty$.
3. a) $g\left(\frac32\right) \approx -0{,}26$ et $g(2) \approx 0{,}19$ : $\alpha$ unique par le théorème des valeurs intermédiaires (bijection).
   b) $g < 0$ sur $]0 ; \alpha[$, $g > 0$ sur $]\alpha ; +\infty[$.

**Partie B**
1. En $0^+$ : $f(x) = x - x\ln x + \ln x \to -\infty$. En $+\infty$ : $f(x) = x\ln x\left(\frac{1}{\ln x} - 1 + \frac1x\right) \to -\infty$.
2. a) $f'(x) = 1 - \ln x - \dfrac{x - 1}{x} = \dfrac1x - \ln x = -g(x)$.
   b) $f$ croît sur $]0 ; \alpha]$ de $-\infty$ à $f(\alpha) \approx 1{,}3$, puis décroît vers $-\infty$.
3. a) $x = 0$ asymptote verticale ; en $+\infty$, $\dfrac{f(x)}{x} = 1 - \ln x + \dfrac{\ln x}{x} \to -\infty$ : branche parabolique de direction $(Oy)$.
   b) $(\mathscr{C})$ passe par $(1 ; 1)$, coupe l'axe des abscisses en $x_0 \approx 0{,}6$ et $x_1 \approx 3{,}6$.
4. $(\mathscr{C}')$ est la symétrique de $(\mathscr{C})$ par rapport à l'axe des abscisses.

### Exercice 4
1. $X$ prend les valeurs 2, 3, 4, 5, 6.
2. $P(X = 2) = \frac16$ ; $P(X = 3) = \frac5{24} - \frac16 = \frac1{24}$ ; $P(X = 4) = \frac7{24} - \frac5{24} = \frac1{12}$ ; $P(X = 5) = \frac13 - \frac7{24} = \frac1{24}$ ; $P(X = 6) = 1 - \frac13 = \frac23$.
3. $E(X) = \dfrac{8 + 3 + 8 + 5 + 96}{24} = \dfrac{120}{24} = 5$.`,
}

const bac2016 = {
  title: 'Bac D 2016 — Mathématiques : similitude et triangle rectangle isocèle, automorphisme involutif, fonction eˣ/(eˣ − 1) et aire, série double',
  statement: R`**Baccalauréat 2016 — Série D — Mathématiques**

### Exercice 1 (5 points)
Dans le plan complexe muni d'un repère orthonormal, on considère l'application $S : z' = (1 + i)z$.
1. Déterminer la nature, le rapport et l'angle de $S$.
2. Soit $A$ d'affixe $z_A = 2i$. Déterminer les affixes de $B$ et $C$ tels que $S(A) = B$ et $S(B) = C$.
3. Placer $A$, $B$ et $C$.
4. $I$ est le milieu de $[OC]$. Montrer que le triangle $ABI$ est rectangle et isocèle en $B$.
5. Écrire une équation du troisième degré dont $z_A$, $z_B$ et $z_C$ sont solutions.

### Exercice 2 (5 points)
$\mathbb{R}^2$ est rapporté à sa base canonique $(\vec i, \vec j)$. $f$ est l'endomorphisme tel que $f(\vec j) = 3\vec i - 2\vec j$ et $f \circ f(\vec j) = \vec j$.
1. Calculer $f(\vec i)$ et $f \circ f(\vec i)$.
2. En déduire la nature de $f$.
3. a) Qu'est-ce qu'un automorphisme ?
   b) Prouver que $f$ est un automorphisme involutif.
   c) Caractériser $f$.
4. Soient $\vec u = 2\vec i - \vec j$ et $\vec v = -3\vec i + \vec j$.
   a) Montrer que $\mathcal{B}' = (\vec u, \vec v)$ est une base de $\mathbb{R}^2$.
   b) Écrire la matrice de $f$ dans la base $\mathcal{B}'$.

### Exercice 3 (7 points)
Dans un repère orthonormal (unité : 1 cm), on considère $f(x) = \dfrac{e^x}{e^x - 1}$ sur $]0 ; +\infty[$ et sa courbe $(\mathscr{C})$.
1. Calculer les limites de $f$ en $0^+$ et en $+\infty$.
2. En déduire que $f$ admet deux asymptotes que l'on précisera.
3. a) Montrer que $f'(x) = -\dfrac{e^x}{(e^x - 1)^2}$.
   b) Donner le sens de variation de $f$.
   c) Dresser son tableau de variation.
4. Tracer $(\mathscr{C})$ et ses asymptotes.
5. Soit $g(x) = -f(x)$. Construire sa courbe $(\mathscr{C}')$ dans le même repère.
6. Calculer l'aire de la portion de plan délimitée par $(\mathscr{C})$, $(\mathscr{C}')$ et les droites $x = 1$ et $x = 2$.

### Exercice 4 (3 points)
Tableau statistique à double entrée :

| $X \backslash Y$ | 0 | 1 | 2 |
|---|---|---|---|
| −1 | 1 | $m$ | 1 |
| 1 | 1 | 0 | 2 |
| 2 | 2 | 3 | $n$ |

1. Déterminer les lois marginales de $X$ et de $Y$ en fonction de $m$ et $n$.
2. Déterminer $m$ et $n$ sachant que le point moyen est $G(1 ; 1)$.
3. On pose $m = n = 1$.
   a) Déterminer l'équation de la droite de régression de $Y$ en $X$, sachant que la covariance de $X$ et $Y$ est $-\frac1{12}$, la variance de $X$ est $\frac12$ et celle de $Y$ est $\frac16$. *(⚠️ Ces deux variances sont erronées dans le sujet : voir le corrigé.)*
   b) Calculer le coefficient de corrélation linéaire entre $X$ et $Y$.`,
  solution: R`### Exercice 1
1. $1 + i = \sqrt2\,e^{i\frac\pi4}$ : $S$ est la similitude directe de centre $O$, de rapport $\sqrt2$ et d'angle $\frac\pi4$.
2. $z_B = (1 + i)2i = -2 + 2i$ ; $z_C = (1 + i)(-2 + 2i) = -4$.
4. $z_I = -2$. $BA = |2i + 2 - 2i| = 2$ et $BI = |-2 + 2 - 2i| = 2$ ; $\dfrac{z_A - z_B}{z_I - z_B} = \dfrac{2}{-2i} = i$ : angle droit en $B$. $ABI$ est rectangle isocèle en $B$.
5. $(z - 2i)(z + 2 - 2i)(z + 4) = z^3 + (6 - 4i)z^2 + (4 - 20i)z - 16 - 16i$ : équation $z^3 + (6 - 4i)z^2 + (4 - 20i)z - 16 - 16i = 0$.

### Exercice 2
1. $\vec i = \frac13\left(f(\vec j) + 2\vec j\right)$, d'où $f(\vec i) = \frac13\left(f \circ f(\vec j) + 2f(\vec j)\right) = \frac13\left(\vec j + 6\vec i - 4\vec j\right) = 2\vec i - \vec j$. Puis $f \circ f(\vec i) = 2f(\vec i) - f(\vec j) = 4\vec i - 2\vec j - 3\vec i + 2\vec j = \vec i$.
2. $f \circ f$ coïncide avec l'identité sur une base : $f \circ f = \text{id}$, $f$ est une **symétrie vectorielle**.
3. a) Un automorphisme est un endomorphisme bijectif.
   b) $f \circ f = \text{id}$ donne $f^{-1} = f$ : $f$ est bijective et involutive.
   c) $x' = 2x + 3y$, $y' = -x - 2y$. Base : $f(\vec u) = \vec u \iff x + 3y = 0$, droite dirigée par $(-3 ; 1)$. Direction : $f(\vec u) = -\vec u \iff x + y = 0$, droite dirigée par $(-1 ; 1)$.
4. a) $\det(\vec u, \vec v) = 2 - 3 = -1 \neq 0$.
   b) $f(\vec u) = 2f(\vec i) - f(\vec j) = \vec i = -\vec u - \vec v$ ; $f(\vec v) = -3f(\vec i) + f(\vec j) = -3\vec i + \vec j = \vec v$. Matrice : $\begin{pmatrix} -1 & 0 \\ -1 & 1 \end{pmatrix}$.

### Exercice 3
1. $\lim\limits_{0^+} f = +\infty$ (numérateur $\to 1$, dénominateur $\to 0^+$) ; $\lim\limits_{+\infty} f = 1$ (car $f(x) = \frac{1}{1 - e^{-x}}$).
2. Asymptote verticale $x = 0$ et asymptote horizontale $y = 1$.
3. a) $f'(x) = \dfrac{e^x(e^x - 1) - e^xe^x}{(e^x - 1)^2} = -\dfrac{e^x}{(e^x - 1)^2}$.
   b) et c) $f' < 0$ : $f$ décroît de $+\infty$ à $1$.
5. $(\mathscr{C}')$ est la symétrique de $(\mathscr{C})$ par rapport à l'axe des abscisses.
6. $\mathcal{A} = \displaystyle\int_1^2 2f(x)\,dx = 2\Big[\ln(e^x - 1)\Big]_1^2 = 2\ln\frac{e^2 - 1}{e - 1} = 2\ln(e + 1)$ u.a., soit environ $2{,}63$ cm².

### Exercice 4
1. $X$ : −1 ($m + 2$), 1 (3), 2 ($n + 5$) ; $Y$ : 0 (4), 1 ($m + 3$), 2 ($n + 3$) ; $N = m + n + 10$.
2. $\overline X = \dfrac{-m + 2n + 11}{m + n + 10} = 1$ et $\overline Y = \dfrac{m + 2n + 9}{m + n + 10} = 1$ donnent $n = 1$ puis $m = 1$.
3. Avec $m = n = 1$ ($N = 12$) :
   - les valeurs exactes sont $V(X) = \frac{3 + 3 + 24}{12} - 1 = \frac32$, $V(Y) = \frac{4 + 16}{12} - 1 = \frac23$, et $\text{Cov} = \frac{-3 + 4 + 10}{12} - 1 = -\frac1{12}$ (ce dernier résultat est bien celui du sujet) ;
   - a) Avec les valeurs **imposées** par le sujet : $a = \dfrac{-1/12}{1/2} = -\dfrac16$, $b = 1 + \dfrac16 = \dfrac76$ : $Y = -\dfrac16X + \dfrac76$. Avec les valeurs exactes : $a = -\dfrac1{18}$ et $Y = -\dfrac1{18}X + \dfrac{19}{18}$.
   - b) Avec les valeurs du sujet : $r = \dfrac{-1/12}{\sqrt{1/12}} = -\dfrac{\sqrt3}{6} \approx -0{,}29$ ; avec les valeurs exactes : $r = \dfrac{-1/12}{\sqrt{1}} \approx -0{,}083$. Dans les deux cas, la corrélation linéaire est faible.`,
}

const bac2015 = {
  title: 'Bac D 2015 — Mathématiques : équation du 3ᵉ degré et similitude, projection vectorielle, fonction 1/(x ln x) et aire, inertie d’un nuage',
  statement: R`**Baccalauréat 2015 — Série D — Mathématiques**

### Exercice 1 (5 points)
1. Déterminer les racines carrées du nombre complexe $u = 6 + 6i\sqrt3$.
2. Soit l'équation $(E) : 4Z^3 - 6i\sqrt3\,Z^2 - (9 + 3i\sqrt3)Z - 4 = 0$.
   a) Vérifier que $Z_0 = -\frac12$ est solution de $(E)$.
   b) Résoudre $(E)$ dans $\mathbb{C}$.
3. Le plan complexe est rapporté à un repère orthonormal direct. On donne $Z_A = -\frac12$, $Z_B = -\frac12 + \frac{\sqrt3}{2}i$ et $Z_C = 1 + i\sqrt3$.
   a) Déterminer l'écriture complexe de la similitude plane directe $S$ qui transforme $A$ en $B$ et $B$ en $C$.
   b) Déterminer les éléments caractéristiques de $S$.

### Exercice 2 (5 points)
$E$ est le plan vectoriel de base $(\vec i, \vec j)$. On donne $\vec e_1 = \vec i + \vec j$ et $\vec e_2 = 2\vec i + 3\vec j$, et l'endomorphisme $f$ tel que $f(\vec e_1) = \vec e_1$ et $f(\vec e_2) = \vec 0$.
1. Vérifier que $(\vec e_1, \vec e_2)$ est une base de $E$.
2. Écrire la matrice de $f$ dans la base $(\vec e_1, \vec e_2)$.
3. Soit $\vec u' = x'\vec i + y'\vec j$ l'image de $\vec u = x\vec i + y\vec j$ par $f$.
   a) Montrer que $f(\vec i) = 3\vec i + 3\vec j$ et $f(\vec j) = -2\vec i - 2\vec j$.
   b) Exprimer $x'$ et $y'$ en fonction de $x$ et $y$.
   c) Calculer $f \circ f(\vec u)$.
   d) En déduire la nature de $f$.
   e) Déterminer les caractéristiques de $f$.

### Exercice 3 (6 points)
On considère $f(x) = \dfrac{1}{x\ln x}$ et sa courbe $(\mathscr{C})$ dans un repère orthonormé.
1. Montrer que $f$ est définie sur $]0 ; 1[ \cup ]1 ; +\infty[$.
2. Vérifier que $f'(x) = \dfrac{-1 - \ln x}{(x\ln x)^2}$.
3. a) Étudier le signe de $f'$. b) Dresser le tableau de variation de $f$. c) Étudier les branches infinies. d) Tracer $(\mathscr{C})$.
4. a) Montrer que $f$ peut encore s'écrire $f(x) = \dfrac{1/x}{\ln x}$.
   b) Calculer $I = \displaystyle\int_e^3 f(x)\,dx$.
   c) En déduire l'aire du domaine limité par $(\mathscr{C})$, l'axe des abscisses et les droites $x = e$ et $x = 3$ (unité : 2 cm).

### Exercice 4 (4 points)
Série statistique double :

| $X \backslash Y$ | −1 | 1 |
|---|---|---|
| −1 | 2 | 1 |
| 0 | 3 | 2 |
| 2 | 1 | 1 |

1. Déterminer les deux séries marginales.
2. Déterminer les coordonnées $\overline X$ et $\overline Y$ du point moyen.
3. Calculer l'inertie du nuage par rapport au point moyen $G$.
4. Calculer le coefficient de corrélation linéaire.`,
  solution: R`### Exercice 1
1. $x^2 - y^2 = 6$, $x^2 + y^2 = |u| = 12$, $xy = 3\sqrt3 > 0$ : $x = \pm3$, $y = \pm\sqrt3$ (même signe). Racines : $3 + i\sqrt3$ et $-3 - i\sqrt3$.
2. a) $4\left(-\frac18\right) - 6i\sqrt3\cdot\frac14 + \frac{9 + 3i\sqrt3}{2} - 4 = \frac{-4 - 12i\sqrt3 + 36 + 12i\sqrt3 - 32}{8} = 0$.
   b) $(E) \iff \left(Z + \frac12\right)\left(4Z^2 - 2(1 + 3i\sqrt3)Z - 8\right) = 0$. Discriminant réduit : $\Delta' = (1 + 3i\sqrt3)^2 + 32 = 6 + 6i\sqrt3 = (3 + i\sqrt3)^2$. Racines : $\dfrac{1 + 3i\sqrt3 \pm (3 + i\sqrt3)}{4}$, soit $1 + i\sqrt3$ et $-\frac12 + i\frac{\sqrt3}{2}$.
   $S = \left\{-\frac12 \,;\, -\frac12 + i\frac{\sqrt3}2 \,;\, 1 + i\sqrt3\right\}$.
3. a) $Z' = aZ + b$ : $a = \dfrac{Z_C - Z_B}{Z_B - Z_A} = \dfrac{\frac32 + i\frac{\sqrt3}2}{i\frac{\sqrt3}2} = 1 - i\sqrt3$ et $b = Z_B - aZ_A = 0$ : $Z' = (1 - i\sqrt3)Z$.
   b) $1 - i\sqrt3 = 2e^{-i\frac\pi3}$ : centre $O$, rapport 2, angle $-\frac\pi3$.

### Exercice 2
1. $\det(\vec e_1, \vec e_2) = 3 - 2 = 1 \neq 0$.
2. $\begin{pmatrix} 1 & 0 \\ 0 & 0 \end{pmatrix}$.
3. a) $f(\vec i) + f(\vec j) = \vec i + \vec j$ et $2f(\vec i) + 3f(\vec j) = \vec 0$ : $f(\vec i) = 3(\vec i + \vec j)$ et $f(\vec j) = -2(\vec i + \vec j)$.
   b) $x' = 3x - 2y$ et $y' = 3x - 2y$.
   c) $f \circ f(\vec u) = (3x - 2y)f(\vec i) + (3x - 2y)f(\vec j) = (3x - 2y)(\vec i + \vec j) = f(\vec u)$.
   d) $f \circ f = f$ : $f$ est une **projection vectorielle**.
   e) Base : $\{f(\vec u) = \vec u\}$ : $x - y = 0$, droite dirigée par $\vec e_1 = (1 ; 1)$. Direction : $\ker f$ : $3x - 2y = 0$, droite dirigée par $\vec e_2 = (2 ; 3)$.

### Exercice 3
1. Il faut $x > 0$ et $x\ln x \neq 0$, soit $x \neq 1$.
2. $(x\ln x)' = \ln x + 1$, d'où $f'(x) = -\dfrac{1 + \ln x}{(x\ln x)^2}$.
3. a) $f'(x) > 0 \iff \ln x < -1 \iff x < \frac1e$.
   b) $f$ croît sur $\left]0 ; \frac1e\right]$ de $-\infty$ à $f\left(\frac1e\right) = -e$, décroît sur $\left[\frac1e ; 1\right[$ vers $-\infty$, puis décroît sur $]1 ; +\infty[$ de $+\infty$ à $0$.
   c) Asymptotes verticales $x = 0$ et $x = 1$ ; asymptote horizontale $y = 0$ en $+\infty$.
4. a) $\dfrac{1}{x\ln x} = \dfrac{1/x}{\ln x}$ : de la forme $\dfrac{u'}{u}$ avec $u = \ln x$.
   b) $I = \Big[\ln(\ln x)\Big]_e^3 = \ln(\ln3) - \ln1 = \ln(\ln3) \approx 0{,}094$.
   c) $f > 0$ sur $[e ; 3]$ : $\mathcal{A} = \ln(\ln3)$ u.a. $= 4\ln(\ln3)$ cm² $\approx 0{,}38$ cm².

### Exercice 4
1. $X$ : −1 (3), 0 (5), 2 (2) ; $Y$ : −1 (6), 1 (4) ; $N = 10$.
2. $\overline X = \frac{-3 + 4}{10} = 0{,}1$ ; $\overline Y = \frac{-6 + 4}{10} = -0{,}2$.
3. $V(X) = \frac{3 + 8}{10} - 0{,}01 = 1{,}09$ ; $V(Y) = 1 - 0{,}04 = 0{,}96$. Inertie : $I_G = \sum n_i\,GM_i^2 = N\left(V(X) + V(Y)\right) = 10 \times 2{,}05 = 20{,}5$ (soit $2{,}05$ si l'on rapporte à l'effectif).
4. $\text{Cov} = \frac{2 - 1 - 2 + 2}{10} - 0{,}1 \times (-0{,}2) = 0{,}12$ ; $r = \dfrac{0{,}12}{\sqrt{1{,}09 \times 0{,}96}} \approx 0{,}117$ : très faible corrélation.`,
}

const bac2014 = {
  title: 'Bac D 2014 — Mathématiques : racines cubiques de l’unité, endomorphisme de ℝ³, fonction eˣ/(eˣ + 1) et suite récurrente, série double',
  statement: R`**Baccalauréat 2014 — Série D — Mathématiques**

### Exercice 1 (5 points)
1. Qu'appelle-t-on conjugué d'un nombre complexe ?
2. a) Résoudre dans $\mathbb{C}$ l'équation $(E) : Z^3 = 1$ (résultats sous forme algébrique).
   b) Montrer que les solutions non réelles sont conjuguées entre elles *(le sujet dit « deux à deux conjuguées »)*.
3. Montrer que $Z_1 = -1 - i\sqrt3$ est solution de $(E') : Z^3 = 8$.
4. Soient $z'_0$, $z'_1$, $z'_2$ les solutions de $(E')$, où $z'_1$ et $z'_2$ sont conjugués.
   a) Utiliser les solutions de $(E)$ pour déduire celles de $(E')$.
   b) Montrer que $\dfrac{z'_1}{z'_2}$ est solution de $(E)$.

### Exercice 2 (5 points)
$f$ est l'endomorphisme de $\mathbb{R}^3$ (base $(\vec i, \vec j, \vec k)$) qui associe à $(x, y, z)$ le vecteur $(x', y', z')$ défini par $x' = y + z$, $y' = x + y + z$, $z' = x$.
1. Déterminer $f(\vec i)$, $f(\vec j)$, $f(\vec k)$.
2. En déduire la matrice de $f$.
3. a) Quelles conditions un ensemble $\mathcal{E}$ doit-il remplir pour être un sous-espace vectoriel de $\mathbb{R}^3$ ?
   b) Montrer que $H = \{(x, y, z) \in \mathbb{R}^3 \,/\, x - y + z = 0\}$ est un sous-espace vectoriel de $\mathbb{R}^3$.
4. Déterminer le noyau de $f$ et en donner une base $(\vec e_1)$.
5. Déterminer l'image de $f$, puis une base $(\vec e_2, \vec e_3)$.

### Exercice 3 (7 points)
Dans un repère orthonormé $(O ; \overrightarrow{OI}, \overrightarrow{OJ})$, on considère $g(x) = \dfrac{e^x}{e^x + 1} - x$.
1. Préciser l'ensemble de définition de $g$.
2. Déterminer $g'(x)$ et en déduire son signe.
3. Dresser le tableau de variation de $g$.
4. Démontrer que l'équation $\dfrac{e^x}{e^x + 1} = x$ admet une solution unique $\alpha \in \mathbb{R}$.
5. Soit $h(x) = \dfrac{e^x}{e^x + 1}$ et $(\mathscr{C})$ sa courbe (unité : 2 cm).
   a) Montrer que $h'(x) > 0$ pour tout $x$.
   b) Dresser le tableau de variation de $h$.
   c) En déduire que pour tout $x$, $0 \leq h(x) \leq 1$.
6. On définit la suite $u_0 = 0$ et $u_{n+1} = h(u_n)$.
   a) Démontrer par récurrence que $(u_n)$ est majorée par 1.
   b) Démontrer par récurrence que $(u_n)$ est croissante.
   c) En déduire que $(u_n)$ converge, puis montrer que sa limite est $\alpha$.

### Exercice 4 (3 points)
Série statistique double :

| $x \backslash y$ | 1 | 3 |
|---|---|---|
| −1 | 1 | 2 |
| 0 | 0 | $a$ |
| 2 | 2 | 0 |

1. Déterminer les séries marginales de $x$ et de $y$.
2. Déterminer le réel $a$ pour que le point moyen soit $G\left(\frac16 ; 2\right)$.
3. On donne $a = 1$. Calculer la variance de $x$, la variance de $y$ et la covariance.`,
  solution: R`### Exercice 1
1. Le conjugué de $z = x + iy$ ($x$, $y$ réels) est $\bar z = x - iy$.
2. a) $Z = re^{i\theta}$ : $r = 1$ et $3\theta \equiv 0\;[2\pi]$ : $z_0 = 1$, $z_1 = -\frac12 + i\frac{\sqrt3}2$, $z_2 = -\frac12 - i\frac{\sqrt3}2$.
   b) $\overline{z_1} = z_2$.
3. $Z_1 = 2z_2$, donc $Z_1^3 = 8z_2^3 = 8$.
4. a) $z^3 = 1 \iff (2z)^3 = 8$ : les solutions de $(E')$ sont $2$, $-1 + i\sqrt3$ et $-1 - i\sqrt3$.
   b) $\left(\dfrac{z'_1}{z'_2}\right)^3 = \dfrac{8}{8} = 1$.

### Exercice 2
1. $f(\vec i) = \vec j + \vec k$ ; $f(\vec j) = \vec i + \vec j$ ; $f(\vec k) = \vec i + \vec j$.
2. $M = \begin{pmatrix} 0 & 1 & 1 \\ 1 & 1 & 1 \\ 1 & 0 & 0 \end{pmatrix}$.
3. a) $\mathcal{E}$ non vide (contient $\vec 0$), stable par addition et par multiplication par un réel.
   b) $(0, 0, 0) \in H$ ; si $\vec u$, $\vec v \in H$ et $\lambda \in \mathbb{R}$, alors $(x + x') - (y + y') + (z + z') = 0$ et $\lambda x - \lambda y + \lambda z = 0$ : $H$ est un sous-espace vectoriel (un plan).
4. $f(\vec u) = \vec 0 \iff y + z = 0$, $x = 0$ : $\ker f = \text{Vect}(\vec e_1)$ avec $\vec e_1 = (0, 1, -1)$.
5. Toute image vérifie $y' = x' + z'$ : $\operatorname{Im} f = H$, plan de base $\vec e_2 = (1, 1, 0)$, $\vec e_3 = (0, 1, 1)$ (dimension $3 - 1 = 2$).

### Exercice 3
1. $e^x + 1 > 0$ : $D_g = \mathbb{R}$.
2. $g'(x) = \dfrac{e^x}{(e^x + 1)^2} - 1 = \dfrac{-e^{2x} - e^x - 1}{(e^x + 1)^2} < 0$.
3. $g$ décroît de $+\infty$ (en $-\infty$) à $-\infty$ (en $+\infty$).
4. $g$ est continue et strictement décroissante de $\mathbb{R}$ sur $\mathbb{R}$ : $g(x) = 0$ a une unique solution $\alpha$, d'où $h(\alpha) = \alpha$ (et $\alpha \approx 0{,}66$).
5. a) $h'(x) = \dfrac{e^x}{(e^x + 1)^2} > 0$.
   b) $h$ croît de $0$ (en $-\infty$) à $1$ (en $+\infty$).
   c) Donc $0 < h(x) < 1$.
6. a) $u_0 = 0 \leq 1$ et, si $u_n \leq 1$, $u_{n+1} = h(u_n) \leq 1$ (par 5.c).
   b) $u_0 = 0 \leq u_1 = \frac12$ ; si $u_n \leq u_{n+1}$, alors $h(u_n) \leq h(u_{n+1})$ ($h$ croissante), soit $u_{n+1} \leq u_{n+2}$.
   c) Croissante et majorée : $(u_n)$ converge vers $\ell \in [0 ; 1]$. $h$ étant continue, $\ell = h(\ell)$, c'est-à-dire $g(\ell) = 0$, donc $\ell = \alpha$ (unicité). (On peut aussi utiliser $0 < h'(x) \leq \frac e4$ sur $[0 ; 1]$ et l'inégalité des accroissements finis.)

### Exercice 4
1. $x$ : −1 (3), 0 ($a$), 2 (2) ; $y$ : 1 (3), 3 ($a + 2$) ; $N = a + 5$.
2. $\overline x = \dfrac{-3 + 4}{a + 5} = \dfrac{1}{a + 5} = \dfrac16$ et $\overline y = \dfrac{3 + 3(a + 2)}{a + 5} = 2$ : $a = 1$.
3. $V(x) = \dfrac{3 + 8}{6} - \dfrac1{36} = \dfrac{65}{36}$ ; $V(y) = \dfrac{3 + 27}{6} - 4 = 1$ ; $\text{Cov} = \dfrac{-1 - 6 + 4}{6} - \dfrac16 \times 2 = -\dfrac56$.`,
}

export const BLOCS = [
  { subject: 'Mathématiques', levels: ['bac_d'], chapterTitle: 'Annales du bac — Mathématiques série D', orderStart: 14, exercises: [bac2017, bac2016, bac2015, bac2014] },
]
