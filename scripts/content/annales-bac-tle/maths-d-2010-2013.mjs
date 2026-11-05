// Annales du bac — MATHÉMATIQUES série D (Congo), sessions 2010 à 2013.
// Source : compilation « sujets et corrigés bac D 2009-2021 » (PDF fourni le 26/10/2026).
// Énoncés transcrits ; corrigés rédigés pour l'application. Rangs : blanc 2026 = 0,
// 2024 = 1, 2021 = 10 … 2013 = 18, 2012 = 19, 2011 = 20, 2010 = 21.
const R = String.raw

const bac2013 = {
  title: 'Bac D 2013 — Mathématiques : série double, racines cubiques et rotation, fonction définie par morceaux, asymptote et aire',
  statement: R`**Baccalauréat 2013 — Série D — Mathématiques**

### Exercice 1 (4 points)
Les caractères $X$ et $Y$ sont distribués suivant le tableau :

| $X \backslash Y$ | −1 | 0 | 2 |
|---|---|---|---|
| −2 | 4 | 0 | 2 |
| −1 | 3 | 5 | 0 |
| 0 | 2 | 1 | 2 |

1. Dresser la loi marginale de $X$ et celle de $Y$.
2. Trouver les coordonnées du point moyen $G(\overline X ; \overline Y)$.
3. Déterminer l'équation de la droite de régression de $Y$ en $X$.
4. Calculer le coefficient de corrélation linéaire.

### Exercice 2 (4 points)
Le plan est rapporté à un repère orthonormé $(O ; \vec u, \vec v)$.
1. Résoudre dans $\mathbb{C}$ l'équation $(E) : Z^3 + 8 = 0$ ; donner les solutions sous forme algébrique.
   Soient $A$, $B$, $C$ les points d'affixes $Z_A = 1 + i\sqrt3$, $Z_B = -2$, $Z_C = 1 - i\sqrt3$.
2. a) Calculer le module et un argument de $U = \dfrac{Z_C - Z_A}{Z_B - Z_A}$.
   b) En déduire la nature du triangle $ABC$.
   Soit $S$ la rotation telle que $S(A) = C$ et $S(C) = B$.
3. a) Déterminer l'expression complexe de $S$.
   b) Déterminer les éléments caractéristiques de $S$.

### Problème (12 points)
**Partie A.** Soit $g(x) = 1 - x^2 - \ln x$ sur $]0 ; +\infty[$.
1. Étudier les variations de $g$ et dresser son tableau de variation.
2. Calculer $g(1)$, puis en déduire le signe de $g$.

**Partie B.** On considère $f(x) = 1 + x - e^{1-x}$ si $x \leq 1$ et $f(x) = \dfrac{2x - x^2 + \ln x}{x}$ si $x > 1$ ; $(\mathscr{C})$ est sa courbe (unité : 2 cm).
1. Déterminer l'ensemble de définition de $f$.
2. a) Étudier la continuité et la dérivabilité de $f$ en $x = 1$.
   b) Pour $x > 1$, exprimer $f'(x)$ en fonction de $g(x)$.
3. Étudier les variations de $f$ et dresser son tableau de variation.
4. Démontrer que la droite $(\Delta) : y = 2 - x$ est asymptote à $(\mathscr{C})$ et étudier leur position relative.
5. Écrire l'équation de la tangente $(T)$ à $(\mathscr{C})$ en $x = 0$.
6. Étudier les branches infinies de $(\mathscr{C})$.
7. Construire dans le même repère $(\mathscr{C})$, $(\Delta)$ et $(T)$.
8. Calculer l'aire du domaine limité par $(\mathscr{C})$, $(\Delta)$ et les droites $x = \frac32$ et $x = e$ (on prendra $\ln2 \approx 0{,}7$ ; $e \approx 2{,}7$).`,
  solution: R`### Exercice 1
1. $X$ : −2 (6), −1 (8), 0 (5) ; $Y$ : −1 (9), 0 (6), 2 (4) ; $N = 19$.
2. $\overline X = \dfrac{-12 - 8}{19} = -\dfrac{20}{19}$ ; $\overline Y = \dfrac{-9 + 8}{19} = -\dfrac1{19}$.
3. $\dfrac1N\sum n_{ij}x_iy_j = \dfrac{8 - 8 + 3}{19} = \dfrac3{19}$, d'où $\text{Cov} = \dfrac{3}{19} - \dfrac{20}{361} = \dfrac{37}{361}$ ; $V(X) = \dfrac{24 + 8}{19} - \dfrac{400}{361} = \dfrac{208}{361}$.
   $a = \dfrac{37}{208}$, $b = \overline Y - a\overline X = \dfrac{7}{52}$ : $Y = \dfrac{37}{208}X + \dfrac7{52}$.
4. $V(Y) = \dfrac{9 + 16}{19} - \dfrac1{361} = \dfrac{474}{361}$ ; $r = \dfrac{37}{\sqrt{208 \times 474}} \approx 0{,}117$ : corrélation très faible.

### Exercice 2
1. $Z = re^{i\theta}$ : $r^3 = 8$ et $3\theta \equiv \pi\;[2\pi]$, d'où $r = 2$ et $\theta \in \left\{\frac\pi3, \pi, \frac{5\pi}3\right\}$ : $S = \{1 + i\sqrt3 \,;\, -2 \,;\, 1 - i\sqrt3\}$.
2. a) $U = \dfrac{-2i\sqrt3}{-3 - i\sqrt3} = \dfrac12 + i\dfrac{\sqrt3}{2}$ : $|U| = 1$, $\arg U = \dfrac\pi3$.
   b) $AC = AB$ et $(\overrightarrow{AB}, \overrightarrow{AC}) = \dfrac\pi3$ : $ABC$ est **équilatéral**.
3. a) $Z' = aZ + b$ : $a = \dfrac{Z_B - Z_C}{Z_C - Z_A} = \dfrac{-3 + i\sqrt3}{-2i\sqrt3} = -\dfrac12 - i\dfrac{\sqrt3}2$ et $b = Z_C - aZ_A = 0$ : $Z' = \left(-\frac12 - i\frac{\sqrt3}2\right)Z$.
   b) $a = e^{i\frac{4\pi}{3}}$ : rotation de centre $O$ et d'angle $\dfrac{4\pi}{3}$ (soit $-\dfrac{2\pi}{3}$) — $O$ est le centre du triangle.

### Problème
**Partie A**
1. $g'(x) = -2x - \dfrac1x < 0$ : $g$ décroît de $+\infty$ à $-\infty$.
2. $g(1) = 0$ : $g > 0$ sur $]0 ; 1[$ et $g < 0$ sur $]1 ; +\infty[$.

**Partie B**
1. $D_f = \mathbb{R}$.
2. a) $f(1) = 1$ et $\lim\limits_{1^+} f = \dfrac{2 - 1 + 0}{1} = 1$ : continue. À gauche : $f'_g(1) = 1 + 1 = 2$ ; à droite : $\dfrac{f(x) - 1}{x - 1} = \dfrac{x - x^2 + \ln x}{x(x - 1)} \to -1 + 1 = 0$. **Non dérivable** en 1 (point anguleux).
   b) $f(x) = 2 - x + \dfrac{\ln x}{x}$, d'où $f'(x) = -1 + \dfrac{1 - \ln x}{x^2} = \dfrac{1 - x^2 - \ln x}{x^2} = \dfrac{g(x)}{x^2}$.
3. Pour $x < 1$ : $f'(x) = 1 + e^{1-x} > 0$ ; pour $x > 1$ : $f'(x) < 0$. $f$ croît de $-\infty$ à $f(1) = 1$, puis décroît vers $-\infty$.
4. $f(x) - (2 - x) = \dfrac{\ln x}{x} \to 0$ en $+\infty$ : $(\Delta)$ est asymptote. Pour $x > 1$, $\frac{\ln x}{x} > 0$ : $(\mathscr{C})$ est **au-dessus** de $(\Delta)$.
5. $f(0) = 1 - e$ et $f'(0) = 1 + e$ : $(T) : y = (1 + e)x + 1 - e$.
6. En $-\infty$ : $\dfrac{f(x)}{x} = \dfrac1x + 1 - \dfrac{e^{1-x}}{x} \to +\infty$ : branche parabolique de direction $(Oy)$. En $+\infty$ : asymptote oblique $(\Delta)$.
8. $\mathcal{A} = \displaystyle\int_{3/2}^{e}\frac{\ln x}{x}dx = \left[\frac{(\ln x)^2}{2}\right]_{3/2}^{e} = \frac12\left(1 - \ln^2\tfrac32\right)$ u.a. $= 2\left(1 - \ln^2\tfrac32\right)$ cm² $\approx 1{,}67$ cm² (avec $\ln\frac32 = \ln3 - \ln2 \approx 0{,}405$).`,
}

const bac2012 = {
  title: 'Bac D 2012 — Mathématiques : régression et corrélation, racines carrées complexes et cos 5π/12, équation différentielle, fonction et aire',
  statement: R`**Baccalauréat 2012 — Série D — Mathématiques**

### Exercice 1 (4 points)
On considère la série statistique double :

| $X$ | −2 | 0 | 1 | $a$ | 4 |
|---|---|---|---|---|---|
| $Y$ | −10 | −8 | $b$ | 0 | 12 |

1. Déterminer les réels $a$ et $b$ pour que le point moyen $G$ ait pour coordonnées $(1 ; -2)$.
2. On prend $a = 2$ et $b = -4$.
   a) Représenter le nuage de points.
   b) Déterminer l'équation de la droite de régression de $X$ en $Y$.
   c) Calculer le coefficient de corrélation linéaire et interpréter.

### Exercice 2 (4 points)
1. Résoudre dans $\mathbb{C}$ l'équation $(E) : z^2 + 8\sqrt3 - 8i = 0$ :
   a) en utilisant la forme trigonométrique ;
   b) en utilisant la forme algébrique (on admettra que $8 + 4\sqrt3 = \left(\sqrt2 + \sqrt6\right)^2$).
2. Placer les images des solutions $z_1$ et $z_2$ sur un cercle trigonométrique.
3. En déduire les valeurs exactes de $\cos\dfrac{5\pi}{12}$ et $\sin\dfrac{5\pi}{12}$.

### Problème (12 points)
**Partie A**
1. Résoudre l'équation différentielle $y'' + 2y' + y = 0$.
2. Déterminer la solution $u$ telle que $u(0) = 1$ et $u'(0) = 0$.

**Partie B** — $f(x) = (x + 1)e^{-x}$ si $x \leq 0$ et $f(x) = 1 - 2x + x\ln x$ si $x > 0$ ; $(\mathscr{C})$ est sa courbe (unité : 2 cm).
3. Préciser l'ensemble de définition de $f$.
4. Étudier la continuité et la dérivabilité de $f$ en $0$.
5. Étudier les variations de $f$ (tableau de variation).
6. Pour $x \leq 0$, déterminer le point d'intersection de $(\mathscr{C})$ avec l'axe des abscisses et une équation de la tangente $(T)$ en ce point.
7. Démontrer que $f(x) = 0$ admet une solution unique $\alpha \in \,]6 ; 7[$.
8. a) Étudier les branches infinies de $(\mathscr{C})$. b) Tracer $(\mathscr{C})$ et $(T)$.

**Partie C** — Soit $h(x) = -f(x)$.
9. a) Dresser le tableau de variation de $h$.
   b) Tracer la courbe $(\mathscr{C}')$ de $h$ dans le même repère.
   c) Calculer en cm² l'aire $\mathcal{A}$ du domaine limité par $(\mathscr{C})$, $(\mathscr{C}')$ et les droites $x = -1$ et $x = 0$.`,
  solution: R`### Exercice 1
1. $\overline X = \dfrac{a + 3}{5} = 1 \Rightarrow a = 2$ ; $\overline Y = \dfrac{b - 6}{5} = -2 \Rightarrow b = -4$.
2. b) $\text{Cov}(X, Y) = \dfrac{20 + 0 - 4 + 0 + 48}{5} - 1 \times (-2) = 14{,}8$ ; $V(Y) = \dfrac{100 + 64 + 16 + 0 + 144}{5} - 4 = 60{,}8$.
   $X = aY + b$ avec $a = \dfrac{14{,}8}{60{,}8} \approx 0{,}243$ et $b = 1 - 0{,}243 \times (-2) \approx 1{,}486$ : $X \approx 0{,}243\,Y + 1{,}486$.
   c) $V(X) = \dfrac{4 + 0 + 1 + 4 + 16}{5} - 1 = 4$ ; $r = \dfrac{14{,}8}{2\sqrt{60{,}8}} \approx 0{,}949$ : forte corrélation linéaire positive.

### Exercice 2
1. a) $z^2 = -8\sqrt3 + 8i = 16e^{i\frac{5\pi}{6}}$ : $z = 4e^{i\frac{5\pi}{12}}$ ou $z = 4e^{i\left(\frac{5\pi}{12} + \pi\right)} = -4e^{i\frac{5\pi}{12}}$.
   b) $x^2 - y^2 = -8\sqrt3$, $x^2 + y^2 = 16$, $xy = 4 > 0$ : $x^2 = 8 - 4\sqrt3 = (\sqrt6 - \sqrt2)^2$ et $y^2 = 8 + 4\sqrt3 = (\sqrt6 + \sqrt2)^2$. Solutions : $z_1 = (\sqrt6 - \sqrt2) + i(\sqrt6 + \sqrt2)$ et $z_2 = -z_1$.
2. $z_1$ et $z_2$ sont sur le cercle de centre $O$ et de rayon 4, diamétralement opposés, $z_1$ à l'angle $\frac{5\pi}{12}$ ($75°$).
3. Par identification ($z_1$ a ses deux parties positives) : $\cos\dfrac{5\pi}{12} = \dfrac{\sqrt6 - \sqrt2}{4}$ et $\sin\dfrac{5\pi}{12} = \dfrac{\sqrt6 + \sqrt2}{4}$.

### Problème
**Partie A**
1. $r^2 + 2r + 1 = 0$, racine double $-1$ : $y = (c_1x + c_2)e^{-x}$.
2. $u(0) = c_2 = 1$ et $u'(0) = c_1 - c_2 = 0$ : $u(x) = (x + 1)e^{-x}$.

**Partie B**
3. $D_f = \mathbb{R}$.
4. $f(0) = 1$ et $\lim\limits_{0^+}(1 - 2x + x\ln x) = 1$ : continue. À gauche : $\dfrac{(x + 1)e^{-x} - 1}{x} \to 0$ (c'est $u'(0)$). À droite : $\dfrac{f(x) - 1}{x} = -2 + \ln x \to -\infty$ : **non dérivable** en 0 (demi-tangente verticale à droite).
5. $x < 0$ : $f'(x) = -xe^{-x} > 0$. $x > 0$ : $f'(x) = -1 + \ln x$, négatif sur $]0 ; e[$, positif ensuite. $f$ croît de $-\infty$ à $1$ sur $]-\infty ; 0]$, décroît jusqu'à $f(e) = 1 - e$, puis croît vers $+\infty$.
6. $f(x) = 0$ pour $x \leq 0 \iff x = -1$ : point $(-1 ; 0)$. $f'(-1) = e$ : $(T) : y = ex + e$.
7. $f(6) \approx -0{,}25 < 0$ et $f(7) \approx 0{,}62 > 0$ ; $f$ continue, strictement croissante sur $[6 ; 7]$ : $\alpha$ unique.
8. a) En $-\infty$ : $\dfrac{f(x)}{x} = e^{-x}\left(1 + \frac1x\right) \to +\infty$ ; en $+\infty$ : $\dfrac{f(x)}{x} = \frac1x - 2 + \ln x \to +\infty$ : branches paraboliques de direction $(Oy)$.

**Partie C**
9. a) $h$ a les variations contraires : décroît de $+\infty$ à $-1$, croît jusqu'à $e - 1$, puis décroît vers $-\infty$.
   b) $(\mathscr{C}')$ est la symétrique de $(\mathscr{C})$ par rapport à l'axe des abscisses.
   c) Sur $[-1 ; 0]$, $f \geq 0 \geq h$ : $\mathcal{A} = \displaystyle\int_{-1}^0 (f - h) = 2\int_{-1}^0(1 + x)e^{-x}dx$. Par parties, une primitive de $(1 + x)e^{-x}$ est $-(x + 2)e^{-x}$ : $\displaystyle\int_{-1}^0 = -2 + e$. D'où $\mathcal{A} = 2(e - 2)$ u.a. $= 8(e - 2)$ cm² $\approx 5{,}75$ cm².`,
}

const bac2011 = {
  title: 'Bac D 2011 — Mathématiques : endomorphisme de ℝ³, équation complexe et parallélogramme, fonction logarithme et tangentes',
  statement: R`**Baccalauréat 2011 — Série D — Mathématiques**

### Exercice 1 (4 points)
$\mathbb{R}^3$ est rapporté à une base $(\vec i, \vec j, \vec k)$. L'application $f$ associe à $\vec u(x, y, z)$ le vecteur $\vec u'(x', y', z')$ tel que
$$x' = -x + ay + 2z,\quad y' = x + 2y + z,\quad z' = x + y \qquad (a \in \mathbb{R}).$$
1. Écrire la matrice de $f$.
2. Pour quelles valeurs de $a$ $f$ est-elle bijective ?
3. On pose $a = 1$.
   a) Déterminer l'ensemble $B$ des vecteurs invariants par $f$.
   b) Déterminer $\ker f$ et $\operatorname{Im} f$, et une base de chacun.
4. Soit $\vec u(1, \alpha, \beta)$. Calculer $\alpha$ et $\beta$ pour que $\vec u \in \ker f$.

### Exercice 2 (4 points)
On considère l'équation $(E) : Z^2 - (1 + 3i)Z + 4 + 4i = 0$.
1. Résoudre $(E)$ ; on appellera $Z_1$ la solution imaginaire pure et $Z_2$ l'autre.
2. Dans le plan complexe, on considère les points $A$, $B$, $C$, $D$ d'affixes $3$ ; $4i$ ; $-2 + 3i$ ; $1 - i$.
   a) Placer les points.
   b) Calculer les affixes des vecteurs $\overrightarrow{AB}$, $\overrightarrow{DC}$, $\overrightarrow{CB}$, $\overrightarrow{DA}$.
   c) En déduire la nature du quadrilatère $ABCD$.

### Problème (12 points)
**Partie A**
1. Montrer qu'il existe deux réels $a$ et $b$ tels que, pour tout $t \neq -1$, $\dfrac{1 - t}{1 + t} = a + \dfrac{b}{1 + t}$.
2. Calculer $\displaystyle\int_0^x \frac{1 - t}{1 + t}\,dt$.

**Partie B** — Soit $f(x) = -x + \ln(x + 1)^2$.
1. Donner l'ensemble de définition de $f$.
2. Déterminer les variations de $f$.
3. Dresser le tableau de variation de $f$.
4. Montrer que $f(x) = 0$ admet une solution unique $\alpha$ dans $]2 ; 3[$.
5. Calculer $f(x)$ et $f'(x)$ pour $x = -2$ ; $-\frac32$ ; $0$ ; $5$.
6. Étudier les branches infinies de la courbe $(\mathscr{C})$.
7. Tracer $(\mathscr{C})$ (unité 1 cm) ainsi que les tangentes aux points d'abscisses $-2$ et $0$.

**Partie C** — Soit $h(x) = -f(x)$ pour $x \in \,]-1 ; +\infty[$.
1. Dresser le tableau de variation de $h$.
2. Tracer la courbe $(\mathscr{C}')$ de $h$ dans le même repère.`,
  solution: R`### Exercice 1
1. $M = \begin{pmatrix} -1 & a & 2 \\ 1 & 2 & 1 \\ 1 & 1 & 0 \end{pmatrix}$.
2. $\det M = -1(0 - 1) - a(0 - 1) + 2(1 - 2) = a - 1$ : $f$ bijective $\iff a \neq 1$.
3. a) $f(\vec u) = \vec u \iff -2x + y + 2z = 0$, $x + y + z = 0$, $x + y - z = 0$, d'où $z = 0$, $y = -x$ et $-3x = 0$ : $B = \{\vec 0\}$.
   b) $\ker f$ : $-x + y + 2z = 0$, $x + 2y + z = 0$, $x + y = 0$ donnent $x = z$, $y = -z$ : $\ker f = \text{Vect}(1, -1, 1)$ (droite).
   $\operatorname{Im} f$ : $(x', y', z')$ est une image $\iff x' - 2y' + 3z' = 0$ : plan de base $\{(2, 1, 0) ; (-3, 0, 1)\}$ (dimension $3 - 1 = 2$).
4. $(1, \alpha, \beta) \in \ker f \iff \alpha = -1$ et $\beta = 1$ (vecteur $(1, -1, 1)$).

### Exercice 2
1. $\Delta = (1 + 3i)^2 - 4(4 + 4i) = -24 - 10i = (-1 + 5i)^2$. $Z_1 = \dfrac{1 + 3i - 1 + 5i}{2} = 4i$ et $Z_2 = \dfrac{1 + 3i + 1 - 5i}{2} = 1 - i$.
2. b) $z_{\overrightarrow{AB}} = -3 + 4i = z_{\overrightarrow{DC}}$ ; $z_{\overrightarrow{CB}} = 2 + i = z_{\overrightarrow{DA}}$.
   c) $\overrightarrow{AB} = \overrightarrow{DC}$ : $ABCD$ est un **parallélogramme** ($AB = 5 \neq BC = \sqrt5$ : ni losange ni rectangle, car $\overrightarrow{AB}\cdot\overrightarrow{BC} \neq 0$).

### Problème
**Partie A**
1. $a + \dfrac{b}{1 + t} = \dfrac{at + a + b}{1 + t}$ : $a = -1$ et $a + b = 1$, d'où $b = 2$.
2. $\displaystyle\int_0^x\left(-1 + \frac{2}{1 + t}\right)dt = -x + 2\ln(1 + x) = -x + \ln(1 + x)^2$ (pour $x > -1$).

**Partie B**
1. $D_f = \mathbb{R} \setminus \{-1\}$ ; $f(x) = -x + 2\ln|x + 1|$.
2. $f'(x) = -1 + \dfrac{2}{x + 1} = \dfrac{1 - x}{x + 1}$ : $f' < 0$ sur $]-\infty ; -1[$, $> 0$ sur $]-1 ; 1[$, $< 0$ sur $]1 ; +\infty[$.
3. Limites : $+\infty$ en $-\infty$, $-\infty$ en $-1$ (des deux côtés), $-\infty$ en $+\infty$. Maximum local $f(1) = -1 + \ln4 \approx 0{,}39$.
4. $f(2) \approx 0{,}197 > 0$ et $f(3) \approx -0{,}227 < 0$ ; $f$ continue, strictement décroissante sur $[2 ; 3]$ : $\alpha$ unique.
5. $f(-2) = 2$, $f'(-2) = -3$ ; $f\left(-\frac32\right) = \frac32 - 2\ln2 \approx 0{,}11$, $f'\left(-\frac32\right) = -5$ ; $f(0) = 0$, $f'(0) = 1$ ; $f(5) = -5 + 2\ln6 \approx -1{,}42$, $f'(5) = -\frac23$.
6. $x = -1$ est asymptote verticale. En $\pm\infty$ : $\dfrac{f(x)}{x} \to -1$ et $f(x) + x = 2\ln|x + 1| \to +\infty$ : branche parabolique de direction la droite $y = -x$.
7. Tangentes : $y = -3x - 4$ en $-2$ ; $y = x$ en $0$.

**Partie C**
1. $h = -f$ sur $]-1 ; +\infty[$ : $h$ décroît de $+\infty$ (en $-1^+$) à $h(1) = 1 - \ln4 \approx -0{,}39$, puis croît vers $+\infty$ ; $h(0) = 0$ et $h(\alpha) = 0$.
2. $(\mathscr{C}')$ est la symétrique de la partie de $(\mathscr{C})$ située sur $]-1 ; +\infty[$ par rapport à l'axe des abscisses.`,
}

const bac2010 = {
  title: 'Bac D 2010 — Mathématiques : loi de probabilité et fonction de répartition, triangle équilatéral, fonction ln et exponentielle, bijection',
  statement: R`**Baccalauréat 2010 — Série D — Mathématiques**

### Exercice 1 (4 points)
Une urne contient deux boules blanches et trois boules noires, indiscernables au toucher. On tire simultanément deux boules et on note leur couleur. $X = -1$ si les deux boules sont blanches, $X = 0$ si l'une est blanche et l'autre noire, $X = 1$ si les deux sont noires.
1. Déterminer la loi de probabilité de $X$.
2. Calculer l'espérance de $X$.
3. a) Définir la fonction de répartition $F$ de $X$.
   b) Tracer sa courbe représentative (1 cm en abscisse et 5 cm en ordonnée pour unités).

### Exercice 2 (4 points)
Dans le plan complexe muni d'un repère orthonormal direct, on considère $z_1 = \sqrt3 + i$, $z_2 = -\sqrt3 + i$ et $z_3 = -2i$.
1. Écrire une équation de degré 3 dont $z_1$, $z_2$ et $z_3$ sont solutions.
2. Écrire $z_1$, $z_2$, $z_3$ sous forme trigonométrique.
3. a) Placer les points $A$, $B$, $C$ d'affixes $z_1$, $z_2$, $z_3$.
   b) Montrer qu'une mesure de chacun des angles du triangle $ABC$ est $\frac\pi3$.
   c) En déduire la nature du triangle $ABC$.

### Problème (12 points)
**Partie A** — Soit $g(x) = 2\ln(-x)$ sur $]-\infty ; 0[$.
1. Étudier les variations de $g$ et dresser son tableau de variation.
2. Calculer $g(-1)$ et en déduire le signe de $g(x)$.

**Partie B** — $f(x) = -2x + 1 + 2x\ln|x|$ si $x < 0$ et $f(x) = (x + 2)e^{-x} - 1$ si $x \geq 0$ ; $(\mathscr{C})$ est sa courbe (unité : 1 cm).
1. Déterminer l'ensemble de définition de $f$.
2. a) Étudier la continuité et la dérivabilité de $f$ en $0$.
   b) Pour $x < 0$, exprimer $f'(x)$ en fonction de $g(x)$.
3. Étudier les variations de $f$ et dresser son tableau de variation.
4. Montrer que $f(x) = 0$ a exactement deux solutions $\alpha$ et $\beta$ telles que $1 < \alpha < \frac32$ et $-4 < \beta < -3$.
5. Étudier les branches infinies de $(\mathscr{C})$.
6. Tracer $(\mathscr{C})$.
7. a) Calculer l'aire $\mathcal{A}(\alpha)$ de l'ensemble des points $M(x ; y)$ tels que $0 \leq x \leq \alpha$ et $0 \leq y \leq f(x)$.
   b) Calculer la limite de $\mathcal{A}(\alpha)$ lorsque $\alpha$ tend vers 0.

**Partie C** — Soit $h$ la restriction de $f$ à $I = \,]-\infty ; -1]$.
1. Montrer que $h$ est une bijection de $I$ sur un intervalle $J$ à déterminer.
2. Dresser le tableau de variation de $h^{-1}$.
3. Tracer la courbe de $h^{-1}$ dans le même repère que $(\mathscr{C})$.`,
  solution: R`### Exercice 1
1. $\binom52 = 10$ tirages : $P(X = -1) = \frac{1}{10}$ ; $P(X = 0) = \frac{2 \times 3}{10} = \frac{6}{10}$ ; $P(X = 1) = \frac{3}{10}$.
2. $E(X) = -\frac1{10} + \frac3{10} = \frac15$.
3. a) $F(x) = 0$ si $x < -1$ ; $\frac1{10}$ si $-1 \leq x < 0$ ; $\frac7{10}$ si $0 \leq x < 1$ ; $1$ si $x \geq 1$.
   b) Fonction en escalier, croissante, continue à droite.

### Exercice 2
1. $(z - z_1)(z - z_2) = z^2 - 2iz - 4$ (car $z_1 + z_2 = 2i$ et $z_1z_2 = -4$), puis $(z^2 - 2iz - 4)(z + 2i) = z^3 - 8i$ : équation $z^3 - 8i = 0$.
2. $z_1 = 2\left(\cos\frac\pi6 + i\sin\frac\pi6\right)$ ; $z_2 = 2\left(\cos\frac{5\pi}6 + i\sin\frac{5\pi}6\right)$ ; $z_3 = 2\left(\cos\left(-\frac\pi2\right) + i\sin\left(-\frac\pi2\right)\right)$.
3. b) $\dfrac{z_C - z_A}{z_B - z_A} = \dfrac{-\sqrt3 - 3i}{-2\sqrt3} = \dfrac12 + i\dfrac{\sqrt3}{2} = e^{i\frac\pi3}$ : angle $\frac\pi3$ en $A$ ; de même $\dfrac{z_B - z_C}{z_A - z_C} = e^{i\frac\pi3}$ en $C$ ; le troisième vaut $\pi - \frac{2\pi}3 = \frac\pi3$.
   c) $ABC$ est **équilatéral** (inscrit dans le cercle de centre $O$, de rayon 2).

### Problème
**Partie A**
1. $g'(x) = \dfrac{2}{x} < 0$ : $g$ décroît de $+\infty$ (en $-\infty$) à $-\infty$ (en $0^-$).
2. $g(-1) = 0$ : $g > 0$ sur $]-\infty ; -1[$, $g < 0$ sur $]-1 ; 0[$.

**Partie B**
1. $D_f = \mathbb{R}$.
2. a) $\lim\limits_{0^-} f = 1 = f(0)$ (car $x\ln|x| \to 0$) : continue. À gauche : $\dfrac{f(x) - 1}{x} = -2 + 2\ln|x| \to -\infty$ : **non dérivable** en 0 (demi-tangente verticale) ; à droite, le nombre dérivé vaut $-1$.
   b) Pour $x < 0$ : $f'(x) = -2 + 2\ln(-x) + 2 = 2\ln(-x) = g(x)$.
3. $f$ croît sur $]-\infty ; -1]$ de $-\infty$ à $f(-1) = 3$, décroît sur $[-1 ; 0]$ jusqu'à $1$ ; pour $x > 0$, $f'(x) = -(x + 1)e^{-x} < 0$ : $f$ décroît de $1$ vers $-1$.
4. $f(1) \approx 0{,}10$ et $f\left(\frac32\right) \approx -0{,}22$ : un unique $\alpha$ (décroissance stricte) ; $f(-4) \approx -2{,}09$ et $f(-3) \approx 0{,}41$ : un unique $\beta$ (croissance stricte) ; ailleurs $f$ ne s'annule pas ($f \geq 1$ sur $[-1 ; 0]$, $f < 0$ après $\alpha$, $f < 0$ avant $\beta$).
5. En $-\infty$ : $\dfrac{f(x)}{x} = -2 + \frac1x + 2\ln|x| \to +\infty$ : branche parabolique de direction $(Oy)$. En $+\infty$ : asymptote horizontale $y = -1$.
7. a) $\mathcal{A}(\alpha) = \displaystyle\int_0^\alpha\left((x + 2)e^{-x} - 1\right)dx$. Par parties, une primitive de $(x + 2)e^{-x}$ est $-(x + 3)e^{-x}$, d'où $\mathcal{A}(\alpha) = 3 - (\alpha + 3)e^{-\alpha} - \alpha$ (en cm²).
   b) $\lim\limits_{\alpha \to 0}\mathcal{A}(\alpha) = 3 - 3 = 0$.

**Partie C**
1. $h$ est continue, strictement croissante sur $]-\infty ; -1]$ : bijection sur $J = \,]-\infty ; 3]$.
2. $h^{-1}$ est strictement croissante sur $]-\infty ; 3]$, de $-\infty$ à $-1$.
3. Courbe de $h^{-1}$ : symétrique de celle de $h$ par rapport à la droite $y = x$.`,
}

export const BLOCS = [
  { subject: 'Mathématiques', levels: ['bac_d'], chapterTitle: 'Annales du bac — Mathématiques série D', orderStart: 18, exercises: [bac2013, bac2012, bac2011, bac2010] },
]
