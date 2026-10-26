// Annales du bac — MATHÉMATIQUES série C (Congo), sessions 2012 à 2014.
// Source : compilation « sujets et corrigés bac C 2009-2021 » (PDF fourni le 26/10/2026).
// Énoncés transcrits ; corrigés rédigés pour l'application. Rangs : 2014 = 16 … 2012 = 18.
const R = String.raw

const bac2014 = {
  title: 'Bac C 2014 — Mathématiques : équation complexe paramétrée, paraboles et similitude, intégrales Jₙ, loi de probabilité',
  statement: R`**Baccalauréat 2014 — Série C — Mathématiques**

### Exercice 1 (4 points)
1. Soit $(E)$ l'équation d'inconnue $Z$ : $Z^2 - \left(2ie^{i\theta}\cos\theta\right)Z - e^{2i\theta} = 0$, où $\theta \in \mathbb{R}$. Résoudre $(E)$ dans $\mathbb{C}$ ; présenter les solutions sous forme exponentielle.
2. Dans le plan muni d'un repère orthonormal direct $(O ; \vec u, \vec v)$, $A$ et $B$ ont pour affixes $Z_A = e^{i\frac\pi2}$ et $Z_B = e^{i\left(\frac\pi2 + 2\theta\right)}$ ; $Z_0$ est l'affixe de $O$.
   a) Exprimer $\arg\left(\dfrac{Z_B - Z_0}{Z_A - Z_0}\right)$ en fonction de $\theta$.
   b) En déduire l'ensemble des valeurs de $\theta$ pour lesquelles $(\overrightarrow{OA}, \overrightarrow{OB}) = \dfrac\pi2\;[2\pi]$.
   c) On suppose $0 \leq \theta < \dfrac\pi2$. Écrire le conjugué de $Z_A + Z_B$ sous forme exponentielle.

### Exercice 2 (8 points)
$ABC$ est un triangle isocèle rectangle en $A$, de sens direct, avec $AC = 6$ cm. $D$, $E$, $F$ sont les milieux respectifs de $[BC]$, $[AB]$ et $[BD]$.
1. Faire la figure. Soit $(P)$ la parabole de foyer $B$ et de directrice $(AC)$.
2. a) Qu'appelle-t-on pas (ou paramètre) d'une parabole ?
   b) Déterminer le pas $\alpha$ de $(P)$.
   Soit $G$ le symétrique de $A$ par rapport à $(BC)$.
3. a) Démontrer que $(AG)$ est tangente à $(P)$ en un point à déterminer.
   b) Construire le point $H$ de $(P)$ situé sur la médiatrice de $[EB]$.
   c) Construire l'arc $(P_0)$ de $(P)$ de corde focale $[GI]$, où $I$ est le symétrique de $G$ par rapport à $(AB)$.
   Soit $(P')$ la parabole de foyer $B$ et de directrice $(AG)$.
4. Déterminer le centre $\Omega$, le rapport $K$ et une mesure de l'angle de la similitude plane directe $S$ qui transforme $(P')$ en $(P)$.
5. Construire l'antécédent $J$ de $G$ par $S$.
6. Construire l'arc $(P'_0)$ qui a pour image $(P_0)$ par $S$.
   On note $\mathcal{A}'_0$ l'aire de la portion $(\mathscr{E}'_0)$ limitée par les droites $(JB)$, $(EF)$ et $(P'_0)$, et $\mathcal{A}_0$ celle de son image $(\mathscr{E}_0)$ par $S$.
7. Démontrer que $\mathcal{A}_0 = 2\mathcal{A}'_0$.
8. Déterminer l'aire $\mathcal{A}$ de $S \circ S \circ S \circ S(\mathscr{E}'_0)$ en fonction de $\mathcal{A}_0$.

### Exercice 3 (4 points)
Soit $f_n(x) = x^{n+1}e^{-x}$, où $n \in \mathbb{N}$.
1. Déterminer l'ensemble de définition de $f_n$.
2. On suppose $n$ impair.
   a) Calculer $f_n'(x)$ et étudier son signe.
   b) Calculer les limites de $f_n$ aux bornes de son ensemble de définition.
   c) Dresser le tableau de variation de $f_n$.
3. Pour $n \in \mathbb{N}$ et $p \in \mathbb{N}^*$, on pose $I_{n,p} = \displaystyle\int_0^p f_n(x)\,dx$ et $J_n = \lim\limits_{p \to +\infty} I_{n,p}$.
   a) En intégrant $I_{n+1,p}$ par parties, montrer que $J_{n+1} = (n + 2)J_n$.
   b) En déduire $J_n$ en fonction de $n$ et de $J_0$.

### Exercice 4 (4 points)
Une urne contient quatre jetons numérotés 1, 2, 3, 4, indiscernables au toucher. On extrait successivement et sans remise deux jetons. $X$ est la valeur absolue de la différence des deux numéros sortis.
1. Déterminer la loi de probabilité de $X$.
2. Calculer l'espérance mathématique, la variance et l'écart-type de $X$.`,
  solution: R`### Exercice 1
1. Discriminant réduit : $\Delta' = \left(ie^{i\theta}\cos\theta\right)^2 + e^{2i\theta} = e^{2i\theta}(1 - \cos^2\theta) = \left(e^{i\theta}\sin\theta\right)^2$.
   $Z_1 = ie^{i\theta}\cos\theta - e^{i\theta}\sin\theta = ie^{i\theta}(\cos\theta + i\sin\theta) = e^{i\left(\frac\pi2 + 2\theta\right)}$ ;
   $Z_2 = ie^{i\theta}\cos\theta + e^{i\theta}\sin\theta = ie^{i\theta}(\cos\theta - i\sin\theta) = e^{i\frac\pi2}$.
2. a) $\dfrac{Z_B}{Z_A} = e^{2i\theta}$ : l'argument vaut $2\theta\;[2\pi]$.
   b) $2\theta \equiv \dfrac\pi2\;[2\pi] \iff \theta \equiv \dfrac\pi4\;[\pi]$ : $\theta \in \left\{\dfrac\pi4 + k\pi,\ k \in \mathbb{Z}\right\}$.
   c) $Z_A + Z_B = e^{i\frac\pi2}\left(1 + e^{2i\theta}\right) = e^{i\frac\pi2}e^{i\theta}\left(e^{-i\theta} + e^{i\theta}\right) = 2\cos\theta\,e^{i\left(\frac\pi2 + \theta\right)}$, avec $2\cos\theta > 0$. Donc $\overline{Z_A + Z_B} = 2\cos\theta\,e^{-i\left(\frac\pi2 + \theta\right)}$.

### Exercice 2
2. a) Le pas (paramètre) $p$ d'une parabole est la distance de son foyer à sa directrice. b) $\alpha = d(B, (AC)) = BA = 6$ cm.
3. a) $C$ est le projeté orthogonal de $G$ sur $(AC)$ (car $ABGC$ est un carré) et $GB = GC$ : $G \in (P)$. $(AG)$ est la médiatrice de $[BC]$, c'est-à-dire la bissectrice de l'angle formé par $[GB]$ et la perpendiculaire à la directrice : c'est la **tangente à $(P)$ en $G$**.
   b) Si $H \in (P)$ est sur la médiatrice de $[EB]$, sa distance à $(AC)$ vaut $H_0A$ ($H_0$ milieu de $[EB]$, donc $H_0A = 4{,}5$ cm). Or $HB = HH_1 = H_0A$ : $H$ est à l'intersection de la médiatrice de $[EB]$ et du cercle de centre $B$ et de rayon $H_0A$ (deux points, symétriques par rapport à $(AB)$).
   c) $E$ (sommet), $G$, $H$, et leurs symétriques $I$ et $H'$ par rapport à l'axe $(AB)$ sont sur $(P)$ : on trace l'arc $(P_0)$ passant par ces cinq points.
4. Les deux paraboles ont le même foyer $B$ : $\Omega = B$. $S$ envoie la directrice $(AG)$ sur $(AC)$, donc le pied $D$ de la perpendiculaire issue de $B$ sur $(AG)$ sur le pied $A$ sur $(AC)$ : $K = \dfrac{BA}{BD} = \dfrac{6}{3\sqrt2} = \sqrt2$ et l'angle est $(\overrightarrow{BD}, \overrightarrow{BA}) = \dfrac\pi4$.
5. $S(J) = G$ : $BG = \sqrt2\,BJ$ et $(\overrightarrow{BJ}, \overrightarrow{BG}) = \frac\pi4$ : $BJG$ est rectangle isocèle en $J$ ; $J$ est l'intersection du cercle de diamètre $[BG]$ et de la médiatrice de $[BG]$ (côté convenable pour l'orientation).
6. Même méthode qu'au 3 pour $(P')$ (sommet $F$, milieu de $[BD]$) : avec $H'_0$ milieu de $[BF]$, les points $K$ et $K'$ intersections du cercle de centre $B$, de rayon $H'_0D$, et de la médiatrice de $[BF]$ ; avec $F$, $J$ et le symétrique $J'$ de $J$ par rapport à $(BD)$, on trace $(P'_0)$.
7. Une similitude de rapport $k$ multiplie les aires par $k^2$ : $\mathcal{A}_0 = (\sqrt2)^2\mathcal{A}'_0 = 2\mathcal{A}'_0$.
8. $S^4$ est la similitude de centre $B$ et de rapport $(\sqrt2)^4 = 4$ : $\mathcal{A} = 16\,\mathcal{A}'_0 = 8\,\mathcal{A}_0$.

### Exercice 3
1. $f_n$ est définie sur $\mathbb{R}$.
2. a) $f_n'(x) = x^n e^{-x}(n + 1 - x)$. $n$ impair : $x^n$ a le signe de $x$. Donc $f_n' < 0$ sur $]-\infty ; 0[$, $> 0$ sur $]0 ; n + 1[$, $< 0$ sur $]n + 1 ; +\infty[$.
   b) $n + 1$ est pair : en $-\infty$, $x^{n+1} \to +\infty$ et $e^{-x} \to +\infty$, donc $f_n \to +\infty$ ; en $+\infty$, $f_n \to 0$ (croissances comparées).
   c) $f_n$ décroît de $+\infty$ à $0$, croît jusqu'à $f_n(n + 1) = \left(\dfrac{n+1}{e}\right)^{n+1}$, puis décroît vers $0$.
3. a) $u' = e^{-x}$, $v = x^{n+2}$ : $I_{n+1,p} = \left[-x^{n+2}e^{-x}\right]_0^p + (n + 2)I_{n,p} = -p^{n+2}e^{-p} + (n + 2)I_{n,p}$. Quand $p \to +\infty$, $p^{n+2}e^{-p} \to 0$, d'où $J_{n+1} = (n + 2)J_n$.
   b) $J_n = (n + 1)J_{n-1} = (n + 1)n J_{n-2} = \dots = (n + 1)!\,J_0$ (et $J_0 = \lim\displaystyle\int_0^p xe^{-x}dx = 1$, donc $J_n = (n + 1)!$).

### Exercice 4
1. 12 tirages ordonnés équiprobables. $|n - p| = 1$ : (1,2), (2,1), (2,3), (3,2), (3,4), (4,3) : 6 cas ; $= 2$ : (1,3), (3,1), (2,4), (4,2) : 4 cas ; $= 3$ : (1,4), (4,1) : 2 cas.
   $P(X = 1) = \frac12$, $P(X = 2) = \frac13$, $P(X = 3) = \frac16$.
2. $E(X) = \frac12 + \frac23 + \frac12 = \frac53$ ; $V(X) = \frac12 + \frac43 + \frac32 - \frac{25}{9} = \frac{10}{3} - \frac{25}{9} = \frac59$ ; $\sigma(X) = \dfrac{\sqrt5}{3}$.`,
}

const bac2013 = {
  title: 'Bac C 2013 — Mathématiques : équation complexe du 3ᵉ degré, série double, paraboles et similitude, fonction et aire',
  statement: R`**Baccalauréat 2013 — Série C — Mathématiques**

### Exercice 1 (4 points)
On considère l'équation $(E) : z^3 - \left(\dfrac12 + \dfrac12i\right)z^2 - \left(\dfrac12 + \dfrac12i\right)z + 1 = 0$.
1. Montrer que $-1$ est solution de $(E)$.
2. Démontrer que si $z_0$ est solution de $(E)$, alors $\dfrac1{z_0}$ est aussi solution de $(E)$.
3. Résoudre dans $\mathbb{C}$ l'équation $(E') : z^2 - \left(\dfrac32 + \dfrac12i\right)z + 1 = 0$.
4. Déterminer toutes les solutions de $(E)$.

### Exercice 2 (4 points)
Les caractères $X$ et $Y$ sont distribués suivant le tableau :

| $X$ | −2 | −2 | −1 | −2 | −1 | 0 | −1 | −2 | −1 | −2 | 0 | −1 | −1 | −1 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| $Y$ | −1 | 2 | 2 | −1 | 2 | 2 | 0 | −1 | 0 | 2 | −1 | −1 | 0 | −1 |

1. Transformer ce tableau en un tableau à double entrée d'effectifs $n_{ij}$.
2. Déterminer le point moyen $G(\overline X, \overline Y)$.
3. Calculer les variances $V(X)$ et $V(Y)$.
4. Calculer la covariance $\text{Cov}(X, Y)$ et le coefficient de corrélation linéaire.

### Problème (12 points)
$ABCD$ est un carré de centre $O$ tel que $(\overrightarrow{AB}, \overrightarrow{AD}) = 90°$ et $AD = 2$. $(P_1)$ est la parabole de directrice $(AD)$, tangente en $C$ à la droite $(AC)$.
1. Démontrer que le foyer de $(P_1)$ est $B$.
   Soit $(P_2)$ la parabole de foyer $B$ tangente à $(AD)$ en $D$ ; $E$ est le symétrique de $B$ par rapport à $A$ et $F$ le symétrique de $D$ par rapport à $(AB)$.
2. Démontrer que $(EF)$ est la directrice de $(P_2)$.
3. Construire le deuxième point $H$ de $(P_2)$ appartenant à la droite $(DB)$.
4. Comment appelle-t-on le segment $[DH]$ pour $(P_2)$ ? Justifier.
5. Démontrer que le point $I$, symétrique de $C$ par rapport à $(BE)$, appartient à $(P_1)$.
6. Construire les arcs de $(P_1)$ et $(P_2)$ de cordes respectives $[CI]$ et $[DH]$.
   Soit $S$ la similitude plane directe qui transforme $(P_2)$ en $(P_1)$.
7. Déterminer une mesure $\theta$ de l'angle de $S$. Justifier.
8. Déterminer son rapport $k$. Justifier.
9. Déterminer son centre. Justifier.
   Le plan étant rapporté au repère orthonormé $(J ; \overrightarrow{JB}, \overrightarrow{JO})$, où $J$ est le milieu de $[AB]$, on considère $f(x) = 2\sqrt x + \ln(x + 1)$ et sa courbe $(\mathscr{C})$.
10. Dresser le tableau de variation de $f$.
11. Étudier la branche infinie de $(\mathscr{C})$.
12. Construire $(\mathscr{C})$.
13. Calculer l'aire de la portion du plan limitée par les droites $(JO)$, $(BC)$ et les courbes $(\mathscr{C})$ et $(P_1)$. On montrera qu'une équation de $(P_1)$ dans ce repère est $y^2 = 4x$.`,
  solution: R`### Exercice 1
1. $(-1)^3 - \left(\frac12 + \frac i2\right) + \left(\frac12 + \frac i2\right) + 1 = 0$.
2. $0$ n'est pas solution. En divisant l'équation par $z_0^3$ : $1 - \left(\frac12 + \frac i2\right)\frac1{z_0} - \left(\frac12 + \frac i2\right)\frac1{z_0^2} + \frac1{z_0^3} = 0$, qui est exactement $(E)$ écrite pour $\frac1{z_0}$ (les coefficients sont « symétriques »).
3. $\Delta = \left(\frac32 + \frac i2\right)^2 - 4 = -2 + \frac32i = \left(\frac12 + \frac32i\right)^2$. Solutions : $z = \dfrac{\frac32 + \frac i2 \pm \left(\frac12 + \frac32i\right)}{2}$, soit $1 + i$ et $\frac12 - \frac12i$ (inverses l'une de l'autre).
4. $(z + 1)\left(z^2 - \left(\frac32 + \frac i2\right)z + 1\right)$ redonne $(E)$ par développement : $S = \left\{-1 \,;\, 1 + i \,;\, \frac12 - \frac12i\right\}$.

### Exercice 2
1. Tableau des effectifs $n_{ij}$ :

| $Y \backslash X$ | −2 | −1 | 0 | total |
|---|---|---|---|---|
| −1 | 3 | 2 | 1 | 6 |
| 0 | 0 | 3 | 0 | 3 |
| 2 | 2 | 2 | 1 | 5 |
| total | 5 | 7 | 2 | 14 |

2. $\overline X = \dfrac{-10 - 7}{14} = -\dfrac{17}{14}$ ; $\overline Y = \dfrac{-6 + 10}{14} = \dfrac27$ : $G\left(-\frac{17}{14} ; \frac27\right)$.
3. $V(X) = \dfrac{20 + 7}{14} - \dfrac{289}{196} = \dfrac{89}{196}$ ; $V(Y) = \dfrac{6 + 20}{14} - \dfrac4{49} = \dfrac{87}{49}$.
4. $\sum n_{ij}x_iy_j = 3 \times 2 + 2 \times (-4) + 2 \times 1 + 2 \times (-2) = -4$, d'où $\text{Cov} = -\dfrac4{14} + \dfrac{17}{14}\times\dfrac27 = \dfrac{3}{49}$ et $r = \dfrac{3/49}{\sqrt{\frac{89}{196}\cdot\frac{87}{49}}} \approx 0{,}068$ : corrélation quasi nulle.

### Problème
1. $D$ est le projeté orthogonal de $C$ sur la directrice $(AD)$. La tangente en $C$ est la médiatrice de $[F'D]$ où $F'$ est le foyer ; or $(AC)$ est la médiatrice de $[BD]$ : le foyer est $B$.
2. Le symétrique du foyer par rapport à une tangente est sur la directrice : $E$, symétrique de $B$ par rapport à $(AD)$, est sur la directrice. Et $E$ est le projeté orthogonal de $D$ sur $(EF)$, avec $DE = DB$ : la directrice est $(EF)$.
3. L'axe de $(P_2)$ est la perpendiculaire à $(EF)$ passant par $B$, soit $(BF)$ ; $H$ est le symétrique de $D$ par rapport à $(BF)$.
4. $[DH]$ passe par le foyer $B$ et ses extrémités sont sur $(P_2)$ : c'est une **corde focale** (perpendiculaire à l'axe : c'est même le *latus rectum*).
5. L'axe de $(P_1)$ est $(BE)$ (perpendiculaire à la directrice $(AD)$ par $B$) ; la parabole est symétrique par rapport à son axe : $I \in (P_1)$.
6. Arcs tracés à partir des sommets ($J$ pour $(P_1)$, milieu de $[AB]$) et des extrémités des cordes focales.
7. Les axes orientés sont $\overrightarrow{BF}$ pour $(P_2)$ et $\overrightarrow{BA}$ pour $(P_1)$ : $\theta = (\overrightarrow{BF}, \overrightarrow{BA}) = -\dfrac\pi4$.
8. Le rapport est celui des paramètres (distances du foyer à la directrice). $F$ est le projeté orthogonal de $B$ sur $(EF)$ (avec $A(0;0)$, $B(2;0)$ : $E(-2;0)$, $F(0;-2)$, $(EF) : x + y + 2 = 0$), donc $k = \dfrac{d(B, (AD))}{d(B, (EF))} = \dfrac{BA}{BF} = \dfrac{2}{2\sqrt2} = \dfrac{\sqrt2}{2}$.
9. $S$ envoie la corde focale $[DH]$ sur $[CI]$, donc le milieu $B$ de $[DH]$ sur le milieu $B$ de $[CI]$ : le centre est **$B$**.
10. $f$ est définie sur $[0 ; +\infty[$, dérivable sur $]0 ; +\infty[$ : $f'(x) = \dfrac1{\sqrt x} + \dfrac1{x + 1} > 0$. $f$ croît de $0$ à $+\infty$ (demi-tangente verticale en $0$).
11. $\dfrac{f(x)}{x} = \dfrac2{\sqrt x} + \dfrac{\ln(x + 1)}{x} \to 0$ : branche parabolique de direction $(J ; \overrightarrow{JB})$.
13. Dans ce repère, $B(1 ; 0)$ est le foyer et la directrice $(AD)$ a pour équation $x = -1$ : $MB^2 = d(M, (AD))^2 \iff (x - 1)^2 + y^2 = (x + 1)^2 \iff y^2 = 4x$. La branche supérieure est $y = 2\sqrt x$, sous $(\mathscr{C})$ sur $[0 ; 1]$. Aire :
$$\int_0^1\left(f(x) - 2\sqrt x\right)dx = \int_0^1 \ln(x + 1)\,dx = \Big[(x + 1)\ln(x + 1) - x\Big]_0^1 = 2\ln2 - 1 \text{ u.a.}$$`,
}

const bac2012 = {
  title: 'Bac C 2012 — Mathématiques : équation du 4ᵉ degré et points cocycliques, suite d’intégrales, carrés, rotation, similitudes et affinité',
  statement: R`**Baccalauréat 2012 — Série C — Mathématiques**

### Exercice 1 (3 points)
1. Résoudre dans $\mathbb{C}$ l'équation $Z^4 - \sqrt2\,Z^3 - 4\sqrt2\,Z - 16 = 0$, sachant qu'elle admet deux solutions imaginaires pures.
2. Dans le plan complexe muni d'un repère $(O ; \vec u, \vec v)$, on considère les points $A$, $B$, $C$, $D$ d'affixes $z_A = 2i$, $z_B = -\sqrt2$, $z_C = -2i$ et $z_D = 2\sqrt2$.
   a) Représenter les points $A$, $B$, $C$ et $D$.
   b) Montrer que $A$, $B$, $C$ et $D$ appartiennent à un même cercle $(\mathscr{C})$ dont on précisera le centre et le rayon.

### Exercice 2 (5 points)
Pour tout entier naturel non nul $n$, on pose $I_n = \displaystyle\int_0^1 x^n e^{-\frac{x^2}{2}}\,dx$.
1. Calculer $I_1$.
2. Montrer que pour tout $n \in \mathbb{N}^*$, $I_n \geq 0$.
3. Par une intégration par parties, montrer que $I_n = -e^{-\frac12} + (n - 1)I_{n-2}$ (on pourra écrire $x^n = x^{n-1}\cdot x$).
4. Étudier le sens de variation de $(I_n)$. En déduire que $(I_n)$ converge vers une limite $l$.
5. Montrer que pour tout $n \in \mathbb{N}^*$, $0 \leq I_n \leq \dfrac1{n + 1}$. Calculer $l$.

### Problème (12 points)
Le plan est orienté. $ABCD$ est un carré de sens direct, de centre $O$. $I$, $J$, $K$, $L$ sont les milieux respectifs de $[AD]$, $[AB]$, $[BC]$ et $[CD]$.
1. $E$ est le point tel que le triangle $IDE$ soit rectangle isocèle en $D$ et de sens direct. Montrer que $IE = AO$.
2. En déduire qu'il existe une rotation $r$ transformant $I$ en $A$ et $E$ en $O$. Préciser une mesure $\theta$ de son angle.
3. Construire le centre $\Omega$ de $r$.
4. $\Omega_1$ est le point d'intersection de $(IE)$ et $(OA)$. Montrer que $\Omega$, $E$, $O$, $\Omega_1$ sont sur un même cercle $(\mathscr{C})$, que l'on tracera.
5. Montrer que $A\Omega_1I\Omega$ est un carré.
6. Donner les caractéristiques de la similitude plane directe $S$ qui transforme le carré $ABCD$ en $A\Omega_1I\Omega$.
7. Placer $K' = S(K)$ puis $L' = S(L)$.
8. Soit $S' = h_{(Q, \frac12)} \circ S_{(OD)}$, $Q$ étant un point de la droite $(OD)$. Caractériser $S'$.
9. On veut construire $Q$ sachant que $S'(C) = J$.
   a) Montrer que si $S'(C) = J$, alors $\overrightarrow{QJ} = \frac12\overrightarrow{QA}$.
   b) Construire alors le point $Q$.
10. Soit $f$ l'application qui à tout point $M$ associe $M'$ tel que $\overrightarrow{HM'} = \frac12\overrightarrow{HM}$, $H$ étant le projeté orthogonal de $M$ sur la droite $(OE)$.
   a) Caractériser $f$.
   b) Tracer l'image $(\mathscr{C}')$ de $(\mathscr{C})$ par $f$.
   c) Donner la nature de $(\mathscr{C}')$.`,
  solution: R`### Exercice 1
1. $Z = ib$ : $(ib)^4 - \sqrt2(ib)^3 - 4\sqrt2\,ib - 16 = (b^4 - 16) + i\sqrt2\,b(b^2 - 4) = 0 \iff b = \pm2$. Donc $Z^4 - \sqrt2Z^3 - 4\sqrt2Z - 16 = (Z^2 + 4)(Z^2 - \sqrt2Z - 4)$ (identification des termes constant et de degré 1). $Z^2 - \sqrt2Z - 4 = 0$ : $\Delta = 18$, racines $2\sqrt2$ et $-\sqrt2$.
   $S = \{2i \,;\, -2i \,;\, 2\sqrt2 \,;\, -\sqrt2\}$.
2. b) $A$ et $C$ sont symétriques par rapport à l'axe réel, qui porte $B$ et $D$. Le centre $\Omega$ du cercle passant par $B$ et $D$ et par $A$ est sur l'axe réel : $\Omega(\omega ; 0)$ avec $\Omega A = \Omega D$ : $\omega^2 + 4 = (2\sqrt2 - \omega)^2 \iff 4\sqrt2\,\omega = 4 \iff \omega = \dfrac{\sqrt2}{2}$. Alors $\Omega B = \dfrac{\sqrt2}{2} + \sqrt2 = \dfrac{3\sqrt2}{2} = \Omega D = \Omega A = \Omega C$.
   Les quatre points sont sur le cercle de centre $\Omega\left(\frac{\sqrt2}2\right)$ et de rayon $\dfrac{3\sqrt2}{2}$ (de diamètre $[BD]$).

### Exercice 2
1. $I_1 = \left[-e^{-\frac{x^2}{2}}\right]_0^1 = 1 - e^{-\frac12}$.
2. L'intégrande est continue et positive sur $[0 ; 1]$ : $I_n \geq 0$.
3. $u = x^{n-1}$, $v' = xe^{-\frac{x^2}2}$, $v = -e^{-\frac{x^2}2}$ : $I_n = \left[-x^{n-1}e^{-\frac{x^2}2}\right]_0^1 + (n - 1)\displaystyle\int_0^1 x^{n-2}e^{-\frac{x^2}2}dx = -e^{-\frac12} + (n - 1)I_{n-2}$ (pour $n \geq 3$).
4. $I_{n+1} - I_n = \displaystyle\int_0^1 x^n(x - 1)e^{-\frac{x^2}2}dx \leq 0$ : $(I_n)$ est décroissante et minorée par 0, donc convergente.
5. Sur $[0 ; 1]$, $0 < e^{-\frac{x^2}2} \leq 1$, d'où $0 \leq x^ne^{-\frac{x^2}2} \leq x^n$ et $0 \leq I_n \leq \dfrac1{n + 1}$. Par encadrement, $l = 0$.

### Problème
1. Avec un carré de côté $a$ : $ID = DE = \frac a2$, donc $IE = \frac{a\sqrt2}{2}$ ; et $AO = \frac{a\sqrt2}{2}$ (demi-diagonale). $IE = AO$.
2. $IE = AO$ et $\overrightarrow{IE} \neq \overrightarrow{AO}$ : il existe une unique rotation $r$ telle que $r(I) = A$ et $r(E) = O$, d'angle $(\overrightarrow{IE}, \overrightarrow{AO}) = (\overrightarrow{OD}, \overrightarrow{OC}) = -\dfrac\pi2$ (car $(IE) \parallel (OD)$ et $(AO) \parallel (OC)$).
3. $\Omega$ est l'intersection des médiatrices de $[IA]$ et de $[EO]$.
4. $(\overrightarrow{\Omega O}, \overrightarrow{\Omega E}) = \dfrac\pi2$ (rotation d'angle $-\frac\pi2$ envoyant $E$ sur $O$) et $(\overrightarrow{\Omega_1O}, \overrightarrow{\Omega_1E}) = (\overrightarrow{OC}, \overrightarrow{OD}) = \dfrac\pi2$ : $\Omega$ et $\Omega_1$ voient $[OE]$ sous le même angle orienté : les quatre points sont cocycliques (cercle de diamètre $[OE]$).
5. $\Omega A = \Omega I$ et $(\overrightarrow{\Omega I}, \overrightarrow{\Omega A}) = -\frac\pi2$ : $\Omega AI$ est rectangle isocèle en $\Omega$. Thalès dans $AOD$ ($(\Omega_1I) \parallel (OD)$) : $A\Omega_1 = \Omega_1I$, et $(\Omega_1I) \perp (\Omega_1A)$ : $\Omega_1AI$ est rectangle isocèle en $\Omega_1$. Deux triangles rectangles isocèles d'hypoténuse commune $[AI]$, de part et d'autre : $A\Omega_1I\Omega$ est un carré.
6. $S(A) = A$, $S(B) = \Omega_1$ : centre $A$, angle $(\overrightarrow{AB}, \overrightarrow{A\Omega_1}) = \dfrac\pi4$, rapport $\dfrac{A\Omega_1}{AB} = \dfrac{AC/4}{AB} = \dfrac{\sqrt2}{4}$.
7. $S$ conserve les milieux : $K'$ est le milieu de $[\Omega_1I]$ ($S(B) = \Omega_1$, $S(C) = I$) et $L'$ le milieu de $[I\Omega]$.
8. $Q \in (OD)$ est fixe par $S_{(OD)}$ et par l'homothétie : $S'$ est la **similitude indirecte** de centre $Q$, d'axe $(OD)$ et de rapport $\frac12$.
9. a) $S_{(OD)}(C) = A$, donc $S'(C) = h(A) = J$ : $\overrightarrow{QJ} = \frac12\overrightarrow{QA}$, c'est-à-dire que $J$ est le milieu de $[QA]$.
   b) $J$ milieu de $[AB]$ et de $[QA]$ : $Q = B$ (qui est bien sur la droite $(OD) = (BD)$).
10. a) $f$ est l'**affinité orthogonale** d'axe $(OE)$ et de rapport $\frac12$.
   b) et c) L'image d'un cercle par une affinité orthogonale est une ellipse : $(\mathscr{C}')$ est une **ellipse** (le cercle $(\mathscr{C})$ a pour diamètre $[OE]$, porté par l'axe : $(\mathscr{C}')$ a pour grand axe $[OE]$ et pour petit axe la moitié du diamètre perpendiculaire).`,
}

export const BLOCS = [
  {
    subject: 'Mathématiques', levels: ['bac_c'], chapterTitle: 'Annales du bac — Mathématiques série C',
    orderStart: 16, exercises: [bac2014, bac2013, bac2012],
  },
]
