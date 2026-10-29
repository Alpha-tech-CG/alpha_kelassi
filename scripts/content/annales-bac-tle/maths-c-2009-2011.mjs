// Annales du bac — MATHÉMATIQUES série C (Congo), sessions 2009 à 2011.
// Source : compilation « sujets et corrigés bac C 2009-2021 » (PDF fourni le 26/10/2026).
// Énoncés transcrits ; corrigés rédigés pour l'application (le corrigé de la compilation a
// servi de référence). Rangs : 2024 = 0, puis 2020 = 10 … 2009 = 21.
const R = String.raw

const bac2011 = {
  title: 'Bac C 2011 — Mathématiques : intégrales et IPP, ajustement linéaire, rotations et similitude, ellipse',
  statement: R`**Baccalauréat 2011 — Série C — Mathématiques**

### Exercice 1 (3 points)
On pose $A = \displaystyle\int_0^{\frac\pi2} x\cos^2x\,dx$ et $B = \displaystyle\int_0^{\frac\pi2} x\sin^2x\,dx$.
1. Calculer $A + B$.
2. Calculer $A - B$ à l'aide d'une intégration par parties.
3. En déduire les valeurs de $A$ et $B$.

### Exercice 2 (5 points)
Le bénéfice (en milliers de francs CFA) d'une ferme avicole qui importe des poussins, sur 5 mois :

| $x_i$ (mois) | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|
| $y_i$ (milliers de F) | 96,1 | 63,5 | 49,2 | 41,5 | 35,7 |

1. Représenter le nuage de points (2 cm pour 1 mois en abscisse, 2 cm pour 5 milliers de francs en ordonnée).
2. Donner une équation de la droite de régression de $y$ en $x$.
3. Tracer cette droite. Estimer le bénéfice au 6ᵉ mois.

### Problème (12 points)
Le plan est orienté. $ABC$ est un triangle tel que $AC = 2AB$ et $(\overrightarrow{AB}, \overrightarrow{AC}) \equiv \dfrac\pi6\;[2\pi]$ ; on prendra $AB = 3$ cm et $AC = 6$ cm. On construit à l'extérieur du triangle les carrés $ACFG$ et $ABDE$ tels que $(\overrightarrow{AC}, \overrightarrow{AG}) \equiv \dfrac\pi2$ et $(\overrightarrow{AE}, \overrightarrow{AB}) \equiv \dfrac\pi2\;[2\pi]$. $K$ est le point tel que $\overrightarrow{GK} = \overrightarrow{AE}$. Les droites $(AK)$ et $(BC)$ se coupent en $I$ ; les droites $(AB)$ et $(KG)$ se coupent en $J$.

**Partie A**
1. Faire une figure.
2. Démontrer qu'il existe une rotation $R_1$ qui transforme le triangle $ABC$ en le triangle $EAK$. On note $\Omega_1$ son centre : construire $\Omega_1$ et donner l'angle de $R_1$.
3. Démontrer qu'il existe une rotation $R_2$ qui transforme $ABC$ en $GKA$. Donner son angle ; construire son centre $\Omega_2$.
4. a) On considère $f = R_1 \circ R_2$. Montrer que $f$ est une translation.
   b) Calculer $f(C)$. En déduire le vecteur de $f$.
5. Démontrer que $A$, $B$, $I$ et $\Omega_1$ sont sur un même cercle $(\mathscr{C})$ de centre $O$, milieu de $[AB]$.
6. Démontrer que $A$, $G$, $J$ et $\Omega_2$ sont sur un même cercle $(\mathscr{C}')$ de centre $O'$, milieu de $[AG]$.

**Partie B** — Le plan est rapporté au repère orthonormal direct $(A ; \vec u, \vec v)$ avec $\vec u = \overrightarrow{AB}$ et $\vec v = \overrightarrow{AE}$. Soit $S$ la similitude plane directe de centre $A$ qui transforme $(\mathscr{C})$ en $(\mathscr{C}')$.
7. Donner les éléments caractéristiques de $S$.
8. Donner l'écriture complexe de $S$.
9. Exprimer $x$ et $y$ en fonction de $x'$ et $y'$.

**Partie C** — Soit $(\mathscr{E})$ l'ellipse d'équation $4x^2 + y^2 = 4$.
10. Construire $(\mathscr{E})$ en précisant son centre, ses sommets et ses foyers.
11. Déterminer une équation de $(\mathscr{E}')$, image de $(\mathscr{E})$ par $S$.`,
  solution: R`### Exercice 1
1. $A + B = \displaystyle\int_0^{\frac\pi2} x\,dx = \frac{\pi^2}{8}$.
2. $A - B = \displaystyle\int_0^{\frac\pi2} x\cos 2x\,dx$. Avec $u = x$, $v' = \cos 2x$ : $A - B = \left[\tfrac x2\sin 2x\right]_0^{\pi/2} - \tfrac12\displaystyle\int_0^{\frac\pi2}\sin 2x\,dx = 0 + \left[\tfrac14\cos 2x\right]_0^{\pi/2} = -\tfrac12$.
3. $A = \dfrac{\pi^2}{16} - \dfrac14$ et $B = \dfrac{\pi^2}{16} + \dfrac14$.

### Exercice 2
1. Nuage de 5 points, décroissant ; point moyen $G(3 ; 57{,}2)$.
2. $\bar x = 3$, $\bar y = 57{,}2$ ; $V(x) = \dfrac{55}{5} - 9 = 2$ ; $\text{cov}(x, y) = \dfrac{\sum x_iy_i}{5} - \bar x\bar y = \dfrac{715{,}2}{5} - 171{,}6 = -28{,}56$.
   $a = \dfrac{-28{,}56}{2} = -14{,}28$ ; $b = 57{,}2 + 14{,}28 \times 3 = 100{,}04$ : $y = -14{,}28x + 100{,}04$.
3. Pour $x = 6$ : $y \approx 14{,}36$ milliers de francs, soit environ **14 360 F CFA** au 6ᵉ mois.

### Problème
**Partie A**
2. $AB = EA$ ; $\overrightarrow{GK} = \overrightarrow{AE}$ fait de $GKEA$ un parallélogramme, donc $EK = AG = AC$ ; les angles $(\overrightarrow{AB}, \overrightarrow{AC})$ et $(\overrightarrow{EA}, \overrightarrow{EK})$ ont leurs côtés perpendiculaires, ils sont égaux. Les triangles $ABC$ et $EAK$ sont donc directement isométriques. La rotation $R_1$ d'angle $(\overrightarrow{AB}, \overrightarrow{EA}) = \dfrac\pi2$ qui envoie $A$ sur $E$ et $B$ sur $A$ envoie alors $C$ sur $K$. Son centre $\Omega_1$ est l'intersection des médiatrices de $[AE]$ et $[AB]$ : c'est le **centre du carré $ABDE$**.
3. La symétrie centrale $R_0$ de centre $\Omega$ (centre du parallélogramme $GKEA$) envoie $EAK$ sur $GKA$. $R_2 = R_0 \circ R_1$ est une rotation d'angle $\pi + \dfrac\pi2 = \dfrac{3\pi}{2}$ (soit $-\dfrac\pi2$). Comme $R_2(A) = G$ et $R_2(C) = A$, $\Omega_2$ est l'intersection des médiatrices de $[AG]$ et $[CA]$ : c'est le **centre du carré $ACFG$**.
4. a) Somme des angles : $\dfrac\pi2 + \dfrac{3\pi}2 \equiv 0$ et centres distincts : $f$ est une translation.
   b) $f(C) = R_1(R_2(C)) = R_1(A) = E$ : $f = t_{\overrightarrow{CE}}$.
5. $R_1$ envoie $(BC)$ sur $(AK)$ : ces droites sont perpendiculaires, donc $(\overrightarrow{IB}, \overrightarrow{IA}) = \dfrac\pi2$. Et $\Omega_1$, centre du carré $ABDE$, voit $[AB]$ sous un angle droit. Les triangles $IAB$ et $\Omega_1AB$ sont rectangles d'hypoténuse $[AB]$ : $A$, $B$, $I$, $\Omega_1$ sont sur le cercle de diamètre $[AB]$, de centre $O$.
6. De même, $(KG) \parallel (AE) \perp (AB)$ donne $(\overrightarrow{JA}, \overrightarrow{JG}) = \dfrac\pi2$, et $\Omega_2$ (centre du carré $ACFG$) voit $[AG]$ sous un angle droit : $A$, $G$, $J$, $\Omega_2$ sont sur le cercle de diamètre $[AG]$, de centre $O'$.

**Partie B**
7. $S(A) = A$ et $S(O) = O'$ : rapport $\dfrac{AO'}{AO} = \dfrac{AG}{AB} = 2$ ; angle $(\overrightarrow{AO}, \overrightarrow{AO'}) = (\overrightarrow{AB}, \overrightarrow{AG}) = \dfrac\pi6 + \dfrac\pi2 = \dfrac{2\pi}{3}$.
8. $z' = 2e^{i\frac{2\pi}{3}}z = (-1 + i\sqrt3)\,z$.
9. $z = \dfrac12e^{-i\frac{2\pi}3}z' = \left(-\dfrac14 - i\dfrac{\sqrt3}{4}\right)z'$, d'où $x = \dfrac14(-x' + \sqrt3\,y')$ et $y = -\dfrac14(\sqrt3\,x' + y')$.

**Partie C**
10. $\dfrac{x^2}{1^2} + \dfrac{y^2}{2^2} = 1$ : centre $A$, sommets $(\pm1 ; 0)$ (dont $B$) et $(0 ; \pm2)$ ; grand axe vertical, $c = \sqrt{4 - 1} = \sqrt3$, foyers $(0 ; \pm\sqrt3)$.
11. En reportant $x$ et $y$ de la question 9 dans $4x^2 + y^2 = 4$ : $\dfrac{4(x' - \sqrt3y')^2 + (\sqrt3x' + y')^2}{16} = 4$, soit
$$(\mathscr{E}') : \; 7x^2 - 6\sqrt3\,xy + 13y^2 = 64.$$`,
}

const bac2010 = {
  title: 'Bac C 2010 — Mathématiques : congruences, rotation et similitude dans un carré, équation différentielle, fonction et suite d’aires',
  statement: R`**Baccalauréat 2010 — Série C — Mathématiques**

### Exercice 1 (4 points)
1. a) Montrer que les équations $x^2 \equiv -1\;[25]$ et $x^2 = -1 + 25k$ ($k \in \mathbb{Z}$) sont équivalentes.
   b) Pour $k = 2$, résoudre dans $\mathbb{Z}$ l'équation $x^2 \equiv -1\;[25]$.
2. a) Trouver, suivant les valeurs de l'entier naturel $n$, les restes de la division euclidienne de $2^n - 4$ par $5$.
   b) En déduire le reste de la division de $2^{2010} - 4$ par $5$. Que peut-on dire de la divisibilité de $2^{2010} - 4$ par $5$ ?

### Exercice 2 (5 points)
Dans le plan orienté, $ABCD$ est un carré de sens direct, de centre $O$ ; $I$ et $J$ sont les milieux respectifs de $[CD]$ et $[AD]$.
1. Construire l'ensemble $(\Gamma)$ des points $M$ tels que $(\overrightarrow{MA}, \overrightarrow{MC}) \equiv \dfrac\pi3\;[2\pi]$.
2. $(D)$ est la droite passant par $A$ telle que $((AC), (D)) \equiv \dfrac\pi3\;[\pi]$ ; elle coupe $(\Gamma)$ en $E$.
   a) Montrer que le triangle $EAC$ est équilatéral.
   b) En déduire qu'il existe une rotation $r$ de centre $E$ qui transforme $A$ en $C$.
3. $H$ est le centre de gravité du triangle $EAC$. La parallèle à $(AC)$ passant par $H$ coupe $(EA)$ et $(EC)$ en $G$ et $F$.
   a) Montrer que $\dfrac{EG}{EA} = \dfrac{EF}{EC} = \dfrac23$.
   b) Montrer qu'il existe une homothétie de centre $E$ qui transforme $A$ en $G$ et $C$ en $F$.
   c) En déduire qu'il existe une similitude plane directe $S$ de centre $E$ qui transforme $A$ en $F$.

### Problème (11 points)
**Partie A**
1. Résoudre dans $\mathbb{R}$ l'équation différentielle $y'' + \pi^2y = 0$.
2. Déterminer la solution particulière $g$ telle que $g(0) = 0$ et $g'(0) = 2\pi$.

**Partie B** — On considère $f(x) = 2\sin\pi x$ si $-4 \leq x \leq 0$ et $f(x) = x^2\left(\dfrac12 - \ln x\right)$ si $x > 0$ ; $(\mathscr{C})$ est sa courbe dans un repère orthonormé (unité : 2 cm).
3. a) Déterminer l'ensemble de définition $E_f$ de $f$.
   b) Étudier la continuité et la dérivabilité de $f$ en $0$.
   c) Montrer que l'étude de $f$ peut être réduite à l'intervalle $I = [-2 ; +\infty[$.
4. a) Étudier les variations de $f$ sur $I$ (tableau de variation).
   b) Étudier la branche infinie de $(\mathscr{C})$ et tracer $(\mathscr{C})$ sur son ensemble de définition.
5. Calculer l'aire $\mathcal{A}_0$ du domaine $(D)$ limité par $(\mathscr{C})$, l'axe des abscisses et les droites $x = 1$ et $x = \sqrt e$.

**Partie C**
6. Soit $S$ la similitude plane directe de centre $O$, de rapport $\dfrac{\sqrt2}{2}$ et d'angle $-\dfrac\pi2$. Pour $x > 0$, construire l'image $(\mathscr{C}')$ de $(\mathscr{C})$ par $S$.
7. On définit la suite de domaines $D_0 = D$ et $D_{n+1} = S(D_n)$.
   a) Exprimer l'aire $\mathcal{A}_n$ de $D_n$ en fonction de $n$ et $\mathcal{A}_0$.
   b) Exprimer $S_n = \mathcal{A}_0 + \mathcal{A}_1 + \dots + \mathcal{A}_n$ en fonction de $n$ et $\mathcal{A}_0$.
   c) Calculer la limite de $S_n$ quand $n$ tend vers $+\infty$.`,
  solution: R`### Exercice 1
1. a) $x^2 \equiv -1\;[25] \iff 25 \mid x^2 + 1 \iff x^2 + 1 = 25k \iff x^2 = -1 + 25k$ ($k \in \mathbb{Z}$).
   b) $k = 2$ : $x^2 = 49$, d'où $x = 7$ ou $x = -7$.
2. a) $2^4 = 16 \equiv 1\;[5]$ : les puissances de 2 sont périodiques de période 4. Pour $n = 4k$ : $2^n - 4 \equiv 1 - 4 \equiv 2$ ; $n = 4k + 1$ : $\equiv 2 - 4 \equiv 3$ ; $n = 4k + 2$ : $\equiv 4 - 4 = 0$ ; $n = 4k + 3$ : $\equiv 8 - 4 \equiv 4\;[5]$.
   b) $2010 = 4 \times 502 + 2$ : le reste est $0$, donc $2^{2010} - 4$ est **divisible par 5**.

### Exercice 2
1. Soit $P_0$ un point tel que $(\overrightarrow{P_0A}, \overrightarrow{P_0C}) = \frac\pi3$. $(\Gamma)$ est l'arc de cercle $\overset{\frown}{AP_0C}$ passant par $A$ et $C$ (privé de $A$ et $C$), lieu des points d'où l'on voit $[AC]$ sous l'angle orienté $\frac\pi3$.
2. a) $E \in (\Gamma)$ : $(\overrightarrow{EA}, \overrightarrow{EC}) = \frac\pi3$ ; $E \in (D)$ : $(\overrightarrow{AC}, \overrightarrow{AE}) = \frac\pi3$. Deux angles de $\frac\pi3$ : $EAC$ est **équilatéral**.
   b) $EA = EC$ : la rotation de centre $E$ et d'angle $(\overrightarrow{EA}, \overrightarrow{EC}) = \frac\pi3$ envoie $A$ sur $C$.
3. a) Thalès dans $EAC$ ($(GF) \parallel (AC)$) et dans $EOA$ ($(GH) \parallel (AO)$, $O$ milieu de $[AC]$ étant sur la médiane $(EO)$) : $\dfrac{EG}{EA} = \dfrac{EF}{EC} = \dfrac{EH}{EO} = \dfrac23$ ($H$ centre de gravité).
   b) $\overrightarrow{EG} = \frac23\overrightarrow{EA}$ et $\overrightarrow{EF} = \frac23\overrightarrow{EC}$ : l'homothétie $h$ de centre $E$ et de rapport $\frac23$ convient.
   c) $S = h \circ r$ est une similitude directe de centre $E$, de rapport $\frac23$ et d'angle $\frac\pi3$, et $S(A) = h(C) = F$.

### Problème
**Partie A**
1. Équation caractéristique $r^2 + \pi^2 = 0$, racines $\pm i\pi$ : $y(x) = c_1\cos\pi x + c_2\sin\pi x$.
2. $g(0) = c_1 = 0$ et $g'(0) = \pi c_2 = 2\pi$ : $g(x) = 2\sin\pi x$.

**Partie B**
3. a) $E_f = [-4 ; +\infty[$.
   b) $f(0) = 0$ ; $\lim\limits_{0^+} x^2\left(\frac12 - \ln x\right) = 0$ : $f$ est continue en 0. À gauche, $\dfrac{2\sin\pi x}{x} \to 2\pi$ ; à droite, $\dfrac{f(x)}{x} = \frac x2 - x\ln x \to 0$. Nombres dérivés différents : $f$ **n'est pas dérivable en 0** (point anguleux).
   c) $x \mapsto 2\sin\pi x$ est 2-périodique : la partie sur $[-4 ; -2]$ se déduit de celle sur $[-2 ; 0]$ par la translation de vecteur $-2\vec i$.
4. a) Sur $]-2 ; 0[$ : $f'(x) = 2\pi\cos\pi x$, positif sur $\left]-2 ; -\frac32\right]$ et $\left[-\frac12 ; 0\right[$, négatif sur $\left[-\frac32 ; -\frac12\right]$. Sur $]0 ; +\infty[$ : $f'(x) = x - 2x\ln x - x = -2x\ln x$, positif sur $]0 ; 1]$, négatif ensuite.
   Variations : $f(-2) = 0$ ↗ $f(-\frac32) = 2$ ↘ $f(-\frac12) = -2$ ↗ $f(0) = 0$ ↗ $f(1) = \frac12$ ↘ $-\infty$.
   b) $\dfrac{f(x)}{x} = x\left(\frac12 - \ln x\right) \to -\infty$ : branche parabolique de direction $(Oy)$ en $+\infty$. $(\mathscr{C})$ coupe l'axe des abscisses en $-4$, $-3$, $-2$, $-1$, $0$ et $\sqrt e$.
5. $\mathcal{A}_0 = \displaystyle\int_1^{\sqrt e}\left(\frac{x^2}{2} - x^2\ln x\right)dx$ ($f \geq 0$ sur $[1 ; \sqrt e]$). Par parties, $\displaystyle\int x^2\ln x\,dx = \frac{x^3}{3}\ln x - \frac{x^3}{9}$, d'où une primitive $\dfrac{5x^3}{18} - \dfrac{x^3}{3}\ln x$ et
$$\mathcal{A}_0 = \frac{e\sqrt e}{9} - \frac5{18} = \frac{2e\sqrt e - 5}{18}\text{ u.a.} = \frac{4e\sqrt e - 10}{9}\text{ cm}^2 \approx 0{,}88\text{ cm}^2.$$

**Partie C**
6. $(\mathscr{C}')$ : on applique à chaque point de $(\mathscr{C})$ ($x > 0$) le quart de tour indirect de centre $O$ suivi de l'homothétie de rapport $\frac{\sqrt2}{2}$ (le point $(1 ; \frac12)$ devient $\left(\frac{\sqrt2}{4} ; -\frac{\sqrt2}{2}\right)$, le point $(\sqrt e ; 0)$ devient $\left(0 ; -\frac{\sqrt{2e}}{2}\right)$).
7. a) Une similitude de rapport $k$ multiplie les aires par $k^2 = \frac12$ : $\mathcal{A}_n = \left(\frac12\right)^n\mathcal{A}_0$.
   b) Suite géométrique : $S_n = \mathcal{A}_0\dfrac{1 - (1/2)^{n+1}}{1 - 1/2} = 2\mathcal{A}_0\left(1 - \frac{1}{2^{n+1}}\right)$.
   c) $\lim S_n = 2\mathcal{A}_0 = \dfrac{8e\sqrt e - 20}{9}$ cm² $\approx 1{,}76$ cm².`,
}

const bac2009 = {
  title: 'Bac C 2009 — Mathématiques : suites récurrentes et congruences, équation complexe, similitude, rotation et hyperbole',
  statement: R`**Baccalauréat 2009 — Série C — Mathématiques**

### Exercice 1 (5 points)
On considère la famille $(S)$ des suites $(V_n)$ de premiers termes $V_0$ et $V_1$ définies par : pour tout $n \in \mathbb{N}$, $V_{n+2} + V_{n+1} - 6V_n = 0$.
1. a) Déterminer les suites géométriques $(a_n)$ et $(b_n)$ de $(S)$ de premier terme 1.
   b) Démontrer que la suite $(U_n)$ définie par $U_n = \alpha\,2^n + \beta(-3)^n$ ($\alpha$, $\beta$ réels) est dans $(S)$.
2. a) Déterminer les entiers relatifs $\alpha$ et $\beta$ solutions de l'équation $8\alpha - 27\beta = -11$.
   b) Déterminer l'entier relatif $k$ pour que le couple défini par $\alpha = 110 + 27k$ et $\beta = 33 + 8k$ soit solution de $4\alpha + 9\beta = 17$.
   c) En déduire les entiers $\alpha$ et $\beta$ pour lesquels $U_2 = 17$ et $U_3 = -11$.
   d) Démontrer que pour tout $n \in \mathbb{N}$, $U_n \equiv 3 \times 2^n\;[5]$.
   e) En déduire le reste de la division euclidienne de $U_n$ par 5.
3. Soit $W_n = 2^{n+1} + (-3)^n$ et $S_n = W_0 + \dots + W_n$.
   a) Démontrer que $S_n \equiv 2 - 4 \times 2^n\;[5]$.
   b) En déduire le reste de la division euclidienne de $S_{1956}$ par 5.

### Exercice 2 (4 points)
Le plan est rapporté à un repère orthonormé direct.
1. Résoudre dans $\mathbb{C}$ l'équation $(E) : z^2 + (\sqrt3 + i)z + 1 = 0$.
2. Écrire les solutions $z'$ et $z''$ de $(E)$ sous forme trigonométrique.

### Problème (11 points)
Dans le plan orienté, on considère les points $A$, $O$, $B$ alignés dans cet ordre, tels que $AB = 6$ et $\overrightarrow{AO} = \overrightarrow{OB}$.

**Partie A**
- I. 1. Construire les points $I$ et $J$ tels que $2\overrightarrow{IB} - \overrightarrow{IA} = \vec 0$ et $2\overrightarrow{JB} + \overrightarrow{JA} = \vec 0$. 2. Construire le cercle $(\mathscr{C}_1)$ de diamètre $[IJ]$ ; on note $K$ son centre.
- II. 1. Construire la droite $(T)$ passant par $A$ telle que $((T), (AB)) = 60°$. 2. Construire le cercle $(\mathscr{C}_2)$ passant par $A$ et $B$, dont la tangente en $A$ est $(T)$ ; on note $E$ son centre. 3. Démontrer que $(\mathscr{C}_1)$ et $(\mathscr{C}_2)$ ont deux points communs $\Omega_1$ et $\Omega_2$ situés de part et d'autre de $(AB)$ ; $\Omega_1$ est celui qui est du même côté de $(AB)$ que $E$.
- III. 1. Démontrer que le centre de la similitude $S$ d'angle $60°$, de rapport $\frac12$, qui transforme $A$ en $B$, est le point $\Omega_1$. 2. Démontrer que $A$, $E$ et $\Omega_1$ sont alignés.

**Partie B**
- I. 1. Soit $F$ le symétrique de $E$ par rapport à $(AB)$. a) Démontrer que $J$ est le centre de gravité du triangle $EFB$. b) Démontrer que $EJ = BK$ et $(\overrightarrow{EJ}, \overrightarrow{BK}) = 60°$. c) En déduire qu'il existe une rotation $R$ qui transforme $E$ en $B$ et $J$ en $K$. 2. Démontrer que les médiatrices de $[EB]$ et de $[JK]$ se coupent en $\Omega_1$. En déduire le centre de $R$.
- II. Soit $g = t_{\overrightarrow{BA}} \circ R$. 1. Démontrer que $\Omega_1$, $J$ et $F$ sont alignés. 2. Démontrer que le centre de la rotation $g$ est $F$.

**Partie C** — Soit $(H)$ l'hyperbole de centre $J$, dont un foyer est $I$, passant par $A$.
1. Construire le point $M$ de $(H)$ situé sur le segment $[I\Omega_1]$ ainsi que les deux sommets de $(H)$.
2. Démontrer que les droites $(JE)$ et $(F\Omega_1)$ sont les asymptotes de $(H)$. Tracer la branche de $(H)$ située du côté de $(B\Omega_1)$ qui contient $K$.
3. $(H')$ est l'image de $(H)$ par $S$. a) Démontrer que l'excentricité de $(H')$ est 2. b) Déterminer les sommets et les asymptotes de $(H')$.`,
  solution: R`### Exercice 1
1. a) Équation caractéristique $r^2 + r - 6 = 0$ : $r = 2$ ou $r = -3$. Suites géométriques de premier terme 1 : $a_n = 2^n$ et $b_n = (-3)^n$.
   b) $U_{n+2} + U_{n+1} - 6U_n = \alpha\,2^n(4 + 2 - 6) + \beta(-3)^n(9 - 3 - 6) = 0$ : $(U_n) \in (S)$.
2. a) Euclide : $27 = 8 \times 3 + 3$, $8 = 3 \times 2 + 2$, $3 = 2 + 1$, d'où $8 \times (-10) - 27 \times (-3) = 1$ et, en multipliant par $-11$, $8 \times 110 - 27 \times 33 = -11$. Alors $8(\alpha - 110) = 27(\beta - 33)$ ; $8$ et $27$ premiers entre eux, Gauss : $\beta = 33 + 8k$, $\alpha = 110 + 27k$, $k \in \mathbb{Z}$.
   b) $4(110 + 27k) + 9(33 + 8k) = 737 + 180k = 17 \iff k = -4$.
   c) $U_2 = 4\alpha + 9\beta = 17$ et $U_3 = 8\alpha - 27\beta = -11$ : $k = -4$, d'où $\alpha = 2$ et $\beta = 1$ ; $U_n = 2^{n+1} + (-3)^n$.
   d) $-3 \equiv 2\;[5]$ donc $(-3)^n \equiv 2^n$ et $U_n \equiv 2 \cdot 2^n + 2^n = 3 \cdot 2^n\;[5]$.
   e) $2^4 \equiv 1\;[5]$ : reste 3 si $n = 4k$ ; 1 si $n = 4k + 1$ ; 2 si $n = 4k + 2$ ; 4 si $n = 4k + 3$.
3. a) $W_n = U_n \equiv 3 \cdot 2^n$, donc $S_n \equiv 3(2^{n+1} - 1) \equiv 3 \cdot 2^{n+1} - 3 \equiv 6 \cdot 2^n + 2 \equiv 2 - 4 \cdot 2^n\;[5]$ (car $6 \equiv -4$ et $-3 \equiv 2$).
   b) $1956 = 4 \times 489$ : $2^{1956} \equiv 1$, $S_{1956} \equiv 2 - 4 = -2 \equiv 3\;[5]$ : reste **3**.

### Exercice 2
1. $\Delta = (\sqrt3 + i)^2 - 4 = -2 + 2\sqrt3\,i = (1 + i\sqrt3)^2$. D'où $z' = \dfrac{\sqrt3 - 1}{2}(-1 + i)$ et $z'' = \dfrac{\sqrt3 + 1}{2}(-1 - i)$.
2. $z' = \dfrac{\sqrt6 - \sqrt2}{2}\left(\cos\dfrac{3\pi}{4} + i\sin\dfrac{3\pi}{4}\right)$ et $z'' = \dfrac{\sqrt6 + \sqrt2}{2}\left(\cos\left(-\dfrac{3\pi}{4}\right) + i\sin\left(-\dfrac{3\pi}{4}\right)\right)$.

### Problème
*Repère pour vérifier : sur $(AB)$ d'origine $A$ : $O = 3$, $B = 6$, $J = 4$, $K = 8$, $I = 12$.*

**Partie A**
- I. 1. $\overrightarrow{AI} = 2\overrightarrow{AB}$ ($B$ milieu de $[AI]$) et $\overrightarrow{AJ} = \frac23\overrightarrow{AB}$. 2. $(\mathscr{C}_1)$ a pour centre $K$, milieu de $[IJ]$, et pour rayon $4$.
- II. 2. $E$ est à l'intersection de la médiatrice de $[AB]$ et de la perpendiculaire à $(T)$ en $A$. 3. $J$ est un point de $(\mathscr{C}_1)$ intérieur à $(\mathscr{C}_2)$ (sur la corde $[AB]$) et $B$ un point de $(\mathscr{C}_2)$ intérieur à $(\mathscr{C}_1)$ (sur $[IJ]$) : les cercles sont sécants en deux points, symétriques par rapport à la droite des centres $(AB)$, donc de part et d'autre de $(AB)$.
- III. 1. Le centre $\Omega$ de $S$ vérifie $(\overrightarrow{\Omega A}, \overrightarrow{\Omega B}) = 60°$, angle égal à l'angle entre la tangente $(T)$ et la corde $[AB]$ : $\Omega \in (\mathscr{C}_2)$. Et $\dfrac{\Omega B}{\Omega A} = \dfrac12$ : $\Omega$ est sur le cercle d'Apollonius de $A$ et $B$ de rapport $\frac12$, qui est $(\mathscr{C}_1)$ (il passe par $I$ et $J$). Avec l'orientation, $\Omega = \Omega_1$. 2. Al-Kashi avec $A\Omega_1 = 2B\Omega_1$ et un angle de $60°$ : $AB^2 = A\Omega_1^2 - B\Omega_1^2$, donc $ABΩ_1$ est rectangle en $B$ ; $[A\Omega_1]$ est un diamètre de $(\mathscr{C}_2)$, qui passe par le centre $E$ : $A$, $E$, $\Omega_1$ alignés.

**Partie B**
- I. 1. a) L'angle tangente-corde de $60°$ donne un angle au centre $\widehat{AEB} = 120°$ ; $EB = EF$ et l'angle $\widehat{EBF} = 60°$ : $EFB$ est équilatéral, de médiane $(BO)$ ($O$ milieu de $[EF]$). Or $\overrightarrow{BJ} = \frac23\overrightarrow{BO}$ : $J$ est son centre de gravité. b) $EJ = JB = 2 = BK$. $(EJ) \perp (\Omega_1A)$ et $(BK) \perp (\Omega_1B)$ : $(\overrightarrow{EJ}, \overrightarrow{BK}) = (\overrightarrow{\Omega_1A}, \overrightarrow{\Omega_1B}) = 60°$. c) $EJ = BK$, vecteurs non égaux : il existe une rotation $R$ d'angle $60°$ qui envoie $E$ sur $B$ et $J$ sur $K$. 2. $\Omega_1EB$ est équilatéral, donc $\Omega_1$ est sur la médiatrice de $[EB]$ ; $BJ = BK$ et $(JK) \perp (B\Omega_1)$ : $(B\Omega_1)$ est la médiatrice de $[JK]$. Le centre de $R$ est **$\Omega_1$**.
- II. 1. La médiatrice de $[EB]$ passe par $J$ et $F$ (triangle équilatéral $EFB$) et par $\Omega_1$ : alignement. 2. $R = S_{(\Omega_1B)} \circ S_{(\Omega_1F)}$ et $t_{\overrightarrow{BA}} = S_{(EF)} \circ S_{(\Omega_1B)}$ (axes parallèles distants de $\frac{AB}{2}$) : $g = S_{(EF)} \circ S_{(\Omega_1F)}$, composée de deux symétries d'axes sécants en $F$ : rotation de centre **$F$**.

**Partie C**
1. Axe focal $(AB)$, centre $J$, foyer $I$ ($c = JI = 8$) ; $A$ est un sommet ($a = JA = 4$), l'autre sommet est $K$, symétrique de $A$ par rapport à $J$ ; second foyer $I'$, symétrique de $I$. $M$ : soit $M_0$ l'intersection de $[\Omega_1I)$ avec le cercle directeur de centre $I$ et de rayon $2a$ ; $M$ est l'intersection de $[I\Omega_1]$ et de la médiatrice de $[I'M_0]$ (alors $|MI' - MI| = 2a$).
2. $\Omega_1 \in (\mathscr{C}_1)$ de diamètre $[IJ]$ : $(J\Omega_1) \perp (I\Omega_1)$, et $J\Omega_1 = a$ (rayon du cercle principal) : $(J\Omega_1)$ est une asymptote ; comme $\Omega_1$, $J$, $F$ sont alignés, c'est $(F\Omega_1)$. L'autre asymptote est sa symétrique par rapport à l'axe focal : $(JE)$.
3. a) Une similitude conserve les rapports de distances : $e' = e = \dfrac ca = \dfrac84 = 2$.
   b) $S(A) = B$ : $B$ est un sommet de $(H')$ ; le centre est $J' = S(J)$, milieu de $[\Omega_1K]$, et l'autre sommet est $K'$, symétrique de $B$ par rapport à $J'$. Asymptotes : images des asymptotes de $(H)$ : $(J'\Omega_1)$ et $(J'E')$, où $E' = S(E)$ est le milieu de $[\Omega_1B]$.`,
}

export const BLOCS = [
  {
    subject: 'Mathématiques', levels: ['bac_c'], chapterTitle: 'Annales du bac — Mathématiques série C',
    description: 'Sujets du baccalauréat série C avec corrigés détaillés.', orderStart: 19,
    exercises: [bac2011, bac2010, bac2009],
  },
]
