// TD de mathématiques, Terminale D — Lycée Chaminade, 2021-2022 (scan « [TD Math Terminale D] »).
// Corrigés rédigés pour l'application (le TD n'en contenait pas).
const r = String.raw

const ex01 = {
  title: 'TD Chaminade — Exercice 0.1 : équation z³ + i = 0',
  statement: r`Dans l'ensemble $\mathbb{C}$ des nombres complexes, on considère l'équation $(E) : z^3 + i = 0$.
On veut résoudre l'équation $(E)$ par deux méthodes différentes.

**1) Méthode algébrique**
- a) Vérifie que $\alpha = i$ est solution de l'équation $(E)$.
- b) Montrer que l'équation $(E)$ est équivalente à l'équation $(E') : (z - i)(z^2 + iz - 1) = 0$.
- c) Achever la résolution dans $\mathbb{C}$ de l'équation $(E)$.

**2) Méthode trigonométrique**
- a) Déterminer le module et un argument du nombre complexe $\beta = -i$.
- b) Déterminer, sous forme trigonométrique, les solutions de l'équation $(E)$.
- c) Calculer la somme des solutions de l'équation $(E)$.

**3)** Le plan est rapporté au repère orthonormé $(O, \vec u, \vec v)$, unité graphique 2 cm. On considère les points $A$, $B$ et $C$ d'affixes respectives $i$, $\frac{\sqrt3}{2} - \frac12 i$ et $-\frac{\sqrt3}{2} - \frac12 i$.
- a) Montrer que les points $A$, $B$ et $C$ sont situés sur le cercle $(\mathcal C)$ de centre $O$ et de rayon 1.
- b) Placer les points $A$, $B$ et $C$ sur le cercle $(\mathcal C)$.
- c) Déterminer une mesure en radian de l'angle $(\overrightarrow{AB}, \overrightarrow{AC})$.
- d) En déduire la nature du triangle $ABC$.
- e) On désigne par $G$ le centre de gravité du triangle $ABC$. Déterminer son affixe $z_G$. Que peut-on en déduire ?`,
  solution: r`**1) a)** $i^3 + i = -i + i = 0$, donc $\alpha = i$ est solution.

**b)** On développe : $(z - i)(z^2 + iz - 1) = z^3 + iz^2 - z - iz^2 - i^2 z + i = z^3 - z + z + i = z^3 + i$.
Donc $(E) \iff (z - i)(z^2 + iz - 1) = 0$.

**c)** $z^2 + iz - 1 = 0$ : $\Delta = i^2 - 4 \times 1 \times (-1) = -1 + 4 = 3$, d'où $z = \dfrac{-i \pm \sqrt3}{2}$.

$$S = \left\{\, i \;;\; \tfrac{\sqrt3}{2} - \tfrac12 i \;;\; -\tfrac{\sqrt3}{2} - \tfrac12 i \,\right\}$$

**2) a)** $|\beta| = 1$ et $\arg \beta = -\dfrac{\pi}{2}$ $[2\pi]$ : $\beta = e^{-i\pi/2}$.

**b)** On pose $z = r e^{i\theta}$ : $z^3 = -i \iff r^3 = 1$ et $3\theta = -\dfrac{\pi}{2} + 2k\pi$, soit $r = 1$ et $\theta = -\dfrac{\pi}{6} + \dfrac{2k\pi}{3}$, $k \in \{0, 1, 2\}$.
- $k = 0$ : $z_0 = \cos\left(-\frac{\pi}{6}\right) + i \sin\left(-\frac{\pi}{6}\right) = \frac{\sqrt3}{2} - \frac12 i$
- $k = 1$ : $z_1 = \cos\frac{\pi}{2} + i\sin\frac{\pi}{2} = i$
- $k = 2$ : $z_2 = \cos\frac{7\pi}{6} + i \sin\frac{7\pi}{6} = -\frac{\sqrt3}{2} - \frac12 i$

On retrouve les solutions de la question 1.

**c)** $z_0 + z_1 + z_2 = \frac{\sqrt3}{2} - \frac12 i + i - \frac{\sqrt3}{2} - \frac12 i = 0$.

**3) a)** $|z_A| = |i| = 1$ ; $|z_B| = |z_C| = \sqrt{\frac34 + \frac14} = 1$ : $OA = OB = OC = 1$, les trois points sont sur le cercle de centre $O$ et de rayon 1.

**b)** $A(0 ; 1)$, $B\left(\frac{\sqrt3}{2} ; -\frac12\right) \approx (0{,}87 ; -0{,}5)$, $C\left(-\frac{\sqrt3}{2} ; -\frac12\right)$ (avec l'unité 2 cm, le cercle a un rayon de 2 cm).

**c)** $z_B - z_A = \frac{\sqrt3}{2} - \frac32 i$ et $z_C - z_A = -\frac{\sqrt3}{2} - \frac32 i$.
$$\frac{z_C - z_A}{z_B - z_A} = \frac{-\sqrt3 - 3i}{\sqrt3 - 3i} = \frac{(-\sqrt3 - 3i)(\sqrt3 + 3i)}{3 + 9} = \frac{6 - 6\sqrt3\, i}{12} = \frac12 - \frac{\sqrt3}{2} i = e^{-i\pi/3}$$
Donc $(\overrightarrow{AB}, \overrightarrow{AC}) = -\dfrac{\pi}{3}$ $[2\pi]$.

**d)** Le module du quotient vaut 1, donc $AC = AB$ ; et l'angle en $A$ mesure $\frac{\pi}{3}$ : le triangle $ABC$ est **équilatéral**.

**e)** $z_G = \dfrac{z_A + z_B + z_C}{3} = \dfrac{0}{3} = 0$ : $G = O$. Le centre de gravité est confondu avec le centre du cercle circonscrit, ce qui confirme que $ABC$ est équilatéral.`,
}

const ex02 = {
  title: 'TD Chaminade — Exercice 0.2 : équation du 3ᵉ degré et similitude',
  statement: r`Dans l'ensemble $\mathbb{C}$ des nombres complexes, on considère l'équation
$$(E) : z^3 + (1 + i)z^2 + (4 - i)z + 12 - 6i = 0$$

**1)** Montrer que $\alpha = -2$ est solution de l'équation $(E)$.

**2)** Achever la résolution dans $\mathbb{C}$ de l'équation $(E)$.

**3)** Le plan est rapporté au repère orthonormé $(O, \vec u, \vec v)$. On considère les points $A$, $B$ et $C$ d'affixes respectives $-2$, $-3i$ et $1 + 2i$.
- a) Placer les points $A$, $B$ et $C$ dans le repère.
- b) Déterminer les affixes des vecteurs $\vec w$ et $\vec t$ tels que : $\vec w = 2\overrightarrow{AB} - 3\overrightarrow{BC}$ et $\vec t = 2\overrightarrow{CA} - 2\overrightarrow{AB}$.
- c) Déterminer les affixes des points suivants : $I$ milieu de $[BC]$, $G$ centre de gravité du triangle $ABC$.
- d) Déterminer l'affixe du point $D$ tel que $CABD$ soit un parallélogramme.
- e) Montrer que le triangle $ABC$ est rectangle isocèle en $A$. En déduire la nature exacte du quadrilatère $CABD$.

**4)** Soit $S$ la similitude plane directe de centre $B$ et qui transforme $C$ en $A$.
- a) Donner son écriture complexe.
- b) Déterminer son rapport $k$ et une mesure $\theta$ de son angle.
- c) Donner son expression analytique.
- d) Soit $I'$ l'image de $I$ par $S$. Déterminer son affixe $z_{I'}$.
- e) Montrer que les droites $(II')$ et $(CA)$ sont parallèles.`,
  solution: r`**1)** $(-2)^3 + (1+i)(-2)^2 + (4-i)(-2) + 12 - 6i = -8 + 4 + 4i - 8 + 2i + 12 - 6i = 0$. Donc $-2$ est solution.

**2)** On factorise : $z^3 + (1+i)z^2 + (4-i)z + 12 - 6i = (z + 2)(z^2 + az + b)$.
En développant : $z^3 + (a + 2)z^2 + (2a + b)z + 2b$. Par identification : $a + 2 = 1 + i$, donc $a = -1 + i$ ; $2b = 12 - 6i$, donc $b = 6 - 3i$ (vérification : $2a + b = -2 + 2i + 6 - 3i = 4 - i$ ✓).

On résout $z^2 + (-1 + i)z + 6 - 3i = 0$ :
$\Delta = (-1+i)^2 - 4(6 - 3i) = -2i - 24 + 12i = -24 + 10i$.
On cherche $\delta = x + iy$ avec $\delta^2 = \Delta$ : $x^2 - y^2 = -24$, $x^2 + y^2 = |\Delta| = \sqrt{576 + 100} = 26$, $2xy = 10$. D'où $x^2 = 1$, $y^2 = 25$, $xy > 0$ : $\delta = 1 + 5i$.
$$z_1 = \frac{1 - i + 1 + 5i}{2} = 1 + 2i \qquad z_2 = \frac{1 - i - 1 - 5i}{2} = -3i$$
$$S = \{-2 \;;\; -3i \;;\; 1 + 2i\}$$

**3) a)** $A(-2 ; 0)$, $B(0 ; -3)$, $C(1 ; 2)$.

**b)** $z_{\overrightarrow{AB}} = -3i + 2 = 2 - 3i$ ; $z_{\overrightarrow{BC}} = 1 + 5i$ ; $z_{\overrightarrow{CA}} = -3 - 2i$.
- $z_{\vec w} = 2(2 - 3i) - 3(1 + 5i) = 1 - 21i$
- $z_{\vec t} = 2(-3 - 2i) - 2(2 - 3i) = -10 + 2i$

**c)** $z_I = \dfrac{-3i + 1 + 2i}{2} = \dfrac12 - \dfrac12 i$ ; $z_G = \dfrac{-2 - 3i + 1 + 2i}{3} = -\dfrac13 - \dfrac13 i$.

**d)** $CABD$ parallélogramme $\iff \overrightarrow{CA} = \overrightarrow{DB} \iff z_D = z_B - z_A + z_C = -3i + 2 + 1 + 2i = 3 - i$.

**e)** $\dfrac{z_C - z_A}{z_B - z_A} = \dfrac{3 + 2i}{2 - 3i} = \dfrac{(3 + 2i)(2 + 3i)}{13} = \dfrac{13i}{13} = i$.
Module 1 : $AC = AB$ ; argument $\frac{\pi}{2}$ : $(\overrightarrow{AB}, \overrightarrow{AC}) = \frac{\pi}{2}$. Le triangle $ABC$ est **rectangle isocèle en $A$**.
Le parallélogramme $CABD$ a deux côtés consécutifs $[AC]$ et $[AB]$ égaux et perpendiculaires : c'est un **carré**.

**4) a)** $S$ : $z' - z_B = a(z - z_B)$ avec $a = \dfrac{z_A - z_B}{z_C - z_B} = \dfrac{-2 + 3i}{1 + 5i} = \dfrac{(-2 + 3i)(1 - 5i)}{26} = \dfrac{13 + 13i}{26} = \dfrac{1 + i}{2}$.
$z' = \dfrac{1+i}{2}(z + 3i) - 3i$, soit :
$$z' = \frac{1 + i}{2}\, z - \frac{3}{2} - \frac{3}{2} i$$

**b)** $k = |a| = \dfrac{\sqrt2}{2}$ ; $\theta = \arg a = \dfrac{\pi}{4}$ $[2\pi]$.

**c)** Avec $z = x + iy$ : $\begin{cases} x' = \dfrac{x - y - 3}{2} \\[2mm] y' = \dfrac{x + y - 3}{2} \end{cases}$

**d)** $z_{I'} = \dfrac{1 + i}{2} \times \dfrac{1 - i}{2} - \dfrac32 - \dfrac32 i = \dfrac12 - \dfrac32 - \dfrac32 i = -1 - \dfrac32 i$.

**e)** $z_{\overrightarrow{II'}} = -1 - \frac32 i - \frac12 + \frac12 i = -\frac32 - i = \frac12(-3 - 2i) = \frac12\, z_{\overrightarrow{CA}}$.
Les vecteurs $\overrightarrow{II'}$ et $\overrightarrow{CA}$ sont colinéaires : $(II') \parallel (CA)$.`,
}

const ex03 = {
  title: 'TD Chaminade — Exercice 0.3 : nature d\'une transformation',
  statement: r`Le plan est rapporté au repère orthonormé $(O, \vec u, \vec v)$. On considère la transformation $F$ du plan complexe qui associe à tout point $M$ d'affixe $z$ le point $M'$ d'affixe $z'$ telle que :
$$z' = (1 - i - \lambda)\,z + 2(1 - 2i), \quad \text{où } \lambda \in \mathbb{C}$$

**1)** Déterminer le nombre complexe $\lambda$ pour que $F$ soit :
- a) une translation ;
- b) une symétrie centrale ;
- c) une rotation d'angle de mesure $\frac{\pi}{3}$ ;
- d) une homothétie de rapport $k = -2$.

**2)** On pose $\lambda = 0$. Donner la nature et les éléments caractéristiques de $F$.`,
  solution: r`On note $a = 1 - i - \lambda$ ; $F$ s'écrit $z' = az + b$ avec $b = 2 - 4i \neq 0$.

**1) a)** Translation $\iff a = 1 \iff \lambda = -i$ (translation de vecteur d'affixe $2 - 4i$).

**b)** Symétrie centrale $\iff a = -1 \iff \lambda = 2 - i$.

**c)** Rotation d'angle $\frac{\pi}{3}$ $\iff a = e^{i\pi/3} = \frac12 + \frac{\sqrt3}{2} i \iff \lambda = 1 - i - \frac12 - \frac{\sqrt3}{2} i = \dfrac12 - \dfrac{2 + \sqrt3}{2}\, i$.

**d)** Homothétie de rapport $-2$ $\iff a = -2 \iff \lambda = 3 - i$.

**2)** $\lambda = 0$ : $z' = (1 - i)z + 2 - 4i$.
$a = 1 - i$ : $|a| = \sqrt2$ et $\arg a = -\frac{\pi}{4}$. $F$ est une **similitude plane directe** de rapport $\sqrt2$ et d'angle $-\dfrac{\pi}{4}$.
Centre $\Omega$ : $\omega = a\omega + b \iff \omega = \dfrac{b}{1 - a} = \dfrac{2 - 4i}{i} = -i(2 - 4i) = -4 - 2i$.
Le centre est $\Omega(-4 ; -2)$.`,
}

const ex04 = {
  title: 'TD Chaminade — Exercice 0.4 : étude d\'une fonction définie par morceaux',
  difficulty: 3,
  statement: r`On considère la fonction $g$ définie sur $\mathbb{R}$ par $g(x) = 3x - \sqrt{1 + x^2}$.

**1)** Étudier les variations de $g$.

**2)** Résoudre dans $\mathbb{R}$ l'équation $g(x) = 0$, puis en déduire le signe de $g(x)$ sur $\mathbb{R}$.

**3)** Soit la fonction numérique de la variable réelle $x$ définie par :
$$f(x) = \begin{cases} \dfrac{x^2 + 2x + 3}{x + 1} & \text{si } x \le 0 \\[3mm] 3\sqrt{1 + x^2} - x & \text{si } x > 0 \end{cases}$$
On note $(\mathcal C)$ la courbe de $f$ dans le plan rapporté à un repère orthonormé $(O, \vec i, \vec j)$, unité graphique 1 cm.
- a) Donner l'ensemble de définition de $f$, noté $E_f$.
- b) Étudier la continuité de $f$ en $x_0 = 0$.
- c) Étudier la dérivabilité de $f$ en $x_0 = 0$.
- d) Préciser la tangente à $(\mathcal C)$ au point d'abscisse $x_0 = 0$.
- e) Montrer que pour $x > 0$, $f'(x) = \dfrac{g(x)}{\sqrt{1 + x^2}}$.
- f) Dresser le tableau de variation de $f$ sur son ensemble de définition.
- g) Étudier les branches infinies de la courbe $(\mathcal C)$.
- h) Tracer $(\mathcal C)$, ses asymptotes et sa tangente au point d'abscisse $x_0 = 0$.`,
  solution: r`**1)** $g'(x) = 3 - \dfrac{x}{\sqrt{1 + x^2}}$. Comme $|x| < \sqrt{1 + x^2}$, on a $\dfrac{x}{\sqrt{1+x^2}} < 1$, donc $g'(x) > 2 > 0$ : **$g$ est strictement croissante sur $\mathbb{R}$**.
Limites : en $+\infty$, $\sqrt{1+x^2} \sim x$ donc $g(x) \sim 2x \to +\infty$ ; en $-\infty$, $\sqrt{1+x^2} \sim -x$ donc $g(x) \sim 4x \to -\infty$.

**2)** $g(x) = 0 \iff 3x = \sqrt{1 + x^2}$. Il faut $x \ge 0$, puis $9x^2 = 1 + x^2 \iff x^2 = \frac18 \iff x = \dfrac{1}{2\sqrt2} = \dfrac{\sqrt2}{4}$.
$g$ étant croissante : $g(x) < 0$ sur $\left]-\infty ; \frac{\sqrt2}{4}\right[$, $g\left(\frac{\sqrt2}{4}\right) = 0$, $g(x) > 0$ sur $\left]\frac{\sqrt2}{4} ; +\infty\right[$.

**3) a)** Pour $x \le 0$, il faut $x \neq -1$ ; pour $x > 0$, $f$ est toujours définie : $E_f = \mathbb{R} \setminus \{-1\}$.

**b)** $f(0) = \dfrac{3}{1} = 3$ et $\displaystyle\lim_{x \to 0^+} f(x) = 3\sqrt1 - 0 = 3$ : **$f$ est continue en 0**.

**c)** Pour $x < 0$ ($x \neq -1$) : $f'(x) = \dfrac{(2x + 2)(x + 1) - (x^2 + 2x + 3)}{(x+1)^2} = \dfrac{x^2 + 2x - 1}{(x + 1)^2}$, d'où un nombre dérivé à gauche $f'_g(0) = -1$.
Pour $x > 0$ : $f'(x) = \dfrac{3x}{\sqrt{1 + x^2}} - 1$, d'où $f'_d(0) = -1$.
$f'_g(0) = f'_d(0) = -1$ : **$f$ est dérivable en 0** et $f'(0) = -1$.

**d)** Tangente : $y = f'(0)(x - 0) + f(0)$, soit $\boxed{y = -x + 3}$.

**e)** Pour $x > 0$ : $f'(x) = \dfrac{3x}{\sqrt{1+x^2}} - 1 = \dfrac{3x - \sqrt{1 + x^2}}{\sqrt{1 + x^2}} = \dfrac{g(x)}{\sqrt{1+x^2}}$.

**f)** Signe de $f'$ :
- pour $x < 0$, signe de $x^2 + 2x - 1$, de racines $-1 - \sqrt2 \approx -2{,}41$ et $-1 + \sqrt2$ ($> 0$, hors de l'intervalle) : $f' > 0$ sur $]-\infty ; -1-\sqrt2[$, $f' < 0$ sur $]-1-\sqrt2 ; -1[$ et sur $]-1 ; 0]$ ;
- pour $x > 0$, signe de $g$ : $f' < 0$ sur $\left]0 ; \frac{\sqrt2}{4}\right[$, $f' > 0$ sur $\left]\frac{\sqrt2}{4} ; +\infty\right[$.

Valeurs : en $x = -1 - \sqrt2$, $x + 1 = -\sqrt2$ et $x^2 + 2x + 3 = (x+1)^2 + 2 = 4$, donc $f(-1-\sqrt2) = -\dfrac{4}{\sqrt2} = -2\sqrt2$.
En $x = \frac{\sqrt2}{4}$ : $\sqrt{1 + \frac18} = \frac{3}{2\sqrt2}$, donc $f = \dfrac{9}{2\sqrt2} - \dfrac{\sqrt2}{4} = \dfrac{9\sqrt2}{4} - \dfrac{\sqrt2}{4} = 2\sqrt2$.

Limites : $\lim\limits_{-\infty} f = -\infty$ ; $\lim\limits_{x \to -1^-} f(x) = -\infty$ (numérateur $\to 2$, dénominateur $\to 0^-$) ; $\lim\limits_{x \to -1^+} f(x) = +\infty$ ; $\lim\limits_{+\infty} f = +\infty$.

| $x$ | $-\infty$ | | $-1-\sqrt2$ | | $-1$ | | $0$ | | $\frac{\sqrt2}{4}$ | | $+\infty$ |
|---|---|---|---|---|---|---|---|---|---|---|---|
| $f'(x)$ | | $+$ | $0$ | $-$ | ‖ | $-$ | $-1$ | $-$ | $0$ | $+$ | |
| $f(x)$ | $-\infty$ | ↗ | $-2\sqrt2$ | ↘ | $-\infty$ ‖ $+\infty$ | ↘ | $3$ | ↘ | $2\sqrt2$ | ↗ | $+\infty$ |

**g)** Branches infinies :
- $x = -1$ : **asymptote verticale**.
- En $-\infty$ : $x^2 + 2x + 3 = (x+1)^2 + 2$, donc $f(x) = x + 1 + \dfrac{2}{x + 1}$. Comme $\dfrac{2}{x+1} \to 0$, la droite $\Delta_1 : y = x + 1$ est **asymptote oblique** en $-\infty$ ; $\dfrac{2}{x+1} < 0$ : la courbe est en dessous.
- En $+\infty$ : $\dfrac{f(x)}{x} = 3\dfrac{\sqrt{1+x^2}}{x} - 1 \to 2$ et $f(x) - 2x = 3\left(\sqrt{1 + x^2} - x\right) = \dfrac{3}{\sqrt{1+x^2} + x} \to 0^+$. La droite $\Delta_2 : y = 2x$ est **asymptote oblique** en $+\infty$ ; la courbe est au-dessus.

**h)** Tracer : les asymptotes $x = -1$, $y = x + 1$ (pour $x \le 0$) et $y = 2x$ (pour $x > 0$) ; la tangente $y = -x + 3$ au point $(0 ; 3)$ ; les points $(-1-\sqrt2 ; -2\sqrt2) \approx (-2{,}41 ; -2{,}83)$ (maximum local) et $\left(\frac{\sqrt2}{4} ; 2\sqrt2\right) \approx (0{,}35 ; 2{,}83)$ (minimum local), en respectant le tableau de variation.`,
}

export const blocs = [
  { chapterId: '0c0108e4-056f-4200-ac53-c95e08db3b1f', exercises: [ex01, ex02, ex03] }, // Tle D · Nombres complexes
  { chapterId: '363bde92-1fc4-4cc3-982c-c111d4201ad6', exercises: [ex04] },             // Tle D · Fonctions numériques
]
