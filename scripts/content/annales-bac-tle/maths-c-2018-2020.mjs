// Annales du bac — MATHÉMATIQUES série C (Congo), sessions 2018 à 2020.
// Source : compilation « sujets et corrigés bac C 2009-2021 » (PDF fourni le 26/10/2026).
// Énoncés transcrits (coquilles signalées) ; corrigés rédigés pour l'application.
// Rangs : 2020 = 10, 2019 = 11, 2018 = 12.
const R = String.raw

const bac2020 = {
  title: 'Bac C 2020 — Mathématiques : équation diophantienne, symétrie glissée et hyperbole, point fixe et suite, probabilités et indépendance',
  statement: R`**Baccalauréat 2020 — Série C — Mathématiques**

### Exercice 1 (4 points)
On cherche les couples d'entiers relatifs $(x, y)$ tels que $(E_0) : 2x - 7y = 3$.
1. Montrer que $(E_0)$ est équivalente à $(E_1) : 2x \equiv 3\;[7]$.
2. Donner l'ensemble des solutions de $(E_1)$.
3. En déduire l'ensemble des solutions de $(E_0)$.
4. $A$ est l'ensemble des diviseurs positifs de 95.
   a) Déterminer $A$.
   b) Trouver le couple $(x, y)$ vérifiant $\begin{cases} 2x - 7y = 3 \\ xy = 95 \end{cases}$

### Exercice 2 (8 points)
Dans le plan orienté, $ABCD$ est un carré de centre $O$, de sens direct. $I$, $J$, $K$, $L$ sont les milieux de $[AB]$, $[BC]$, $[CD]$, $[DA]$. $(\mathscr{C})$ est le cercle de diamètre $[AJ]$, de centre $O'$. $P$ et $Q$ sont les milieux de $[BJ]$ et $[AL]$.
1. Faire une figure ($AB = 6$ cm).
2. Soit $f$ la symétrie glissée d'axe $(OL)$.
   a) Déterminer le vecteur $\vec u$ de $f$, sachant que $f(D) = I$.
   b) Déterminer $f(K)$.
3. Soit $(H)$ l'hyperbole de rectangle fondamental $ABJL$ et d'axe focal $(PQ)$.
   a) Déterminer les asymptotes de $(H)$.
   b) Placer les foyers $F$ et $F'$ ($F$ le plus proche de $P$).
   c) Déterminer les sommets de $(H)$.
   d) Construire les directrices $(D_1)$ et $(D_2)$.
   e) Construire le point $M_0$ de $(H)$ situé sur le segment $[FJ]$ (justifier).
   f) Prouver que l'excentricité de $(H)$ est $e = \dfrac{\sqrt5}{2}$.
   g) Achever la construction de $(H)$.
4. Le plan est rapporté au repère orthonormé $(O' ; \vec i, \vec j)$ avec $\vec i = \overrightarrow{O'O}$.
   a) Montrer qu'une équation de $(H)$ dans ce repère est $x^2 - \dfrac{y^2}{4} = -1$.
   b) Vérifier le résultat de la question 3.f.

### Exercice 3 (5 points)
Soit $f(x) = \dfrac{x^2 - 1}{4} - 2\ln x$ sur $]0 ; +\infty[$.
1. a) Calculer $f'(x)$. b) Étudier le sens de variation de $f$. c) Montrer que $f(x) = 0$ admet une solution unique $\alpha \in [3 ; 4]$.
2. Soit $g(x) = \sqrt{1 + 8\ln x}$ sur $[3 ; +\infty[$ *(le sujet écrit $]3 ; +\infty[$, mais $g(3)$ est utilisé ensuite)*.
   a) Montrer que $f(x) = 0$ et $g(x) = x$ sont équivalentes sur $[3 ; +\infty[$.
   b) On suppose que pour tout $x \in [3 ; 4]$, $g(x) \in [3 ; 4]$ et $|g'(x)| \leq \frac49$. Montrer que $|g(x) - \alpha| \leq \frac49|x - \alpha|$.
3. Soit $u_0 = 3$ et $u_{n+1} = g(u_n)$.
   a) Montrer que pour tout $n \in \mathbb{N}$, $u_n \in [3 ; 4]$.
   b) Montrer que $|u_{n+1} - \alpha| \leq \frac49|u_n - \alpha|$.
   c) En déduire que $|u_n - \alpha| \leq \left(\frac49\right)^n$.
   d) Montrer que $(u_n)$ converge vers $\alpha$.
   e) Déterminer le plus petit entier $n_0$ tel que $u_{n_0}$ soit une valeur approchée de $\alpha$ à $10^{-2}$ près.

### Exercice 4 (3 points)
Une classe compte 26 garçons et 14 filles ; 13 garçons et $n$ filles sont inscrits dans un centre de langues. On choisit un élève au hasard. $G$ : « garçon » ; $F$ : « fille » ; $L$ : « inscrit au centre de langues ».
1. Calculer $P(G)$ et $P(F)$.
2. Construire un arbre de probabilités, sachant que $P_G(L) = \frac12$ et $P_F(L) = \frac{n}{14}$.
3. Montrer que $P(L) = \dfrac{13 + n}{40}$.
4. Déterminer $n$ pour que $L$ et $G$ soient indépendants.`,
  solution: R`### Exercice 1
1. $2x - 3 = 7y \iff 2x \equiv 3\;[7]$.
2. $2 \times (-3) - 7 \times (-1) = 1$ donne, ×3, $2 \times (-9) \equiv 3\;[7]$ ; alors $7 \mid 2(x + 9)$ et, par Gauss, $x = -9 + 7k$ (soit $x \equiv 5\;[7]$).
3. $y = \dfrac{2x - 3}{7} = -3 + 2k$ : $S = \{(-9 + 7k ; -3 + 2k),\ k \in \mathbb{Z}\}$.
4. a) $A = \{1 ; 5 ; 19 ; 95\}$.
   b) $(-9 + 7k)(-3 + 2k) = 95 \iff 14k^2 - 39k - 68 = 0$, dont la seule solution entière est $k = 4$ : $(x, y) = (19 ; 5)$ (vérification : $38 - 35 = 3$ et $19 \times 5 = 95$).

### Exercice 2
2. a) $f = t_{\vec u} \circ S_{(OL)}$ avec $\vec u$ dirigé par $(OL)$. $S_{(OL)}(D) = A$, donc $t_{\vec u}(A) = I$ : $\vec u = \overrightarrow{AI}$.
   b) $f(K) = t_{\overrightarrow{AI}}(I) = B$.
3. a) Les asymptotes sont les diagonales du rectangle fondamental : $(AJ)$ et $(BL)$.
   b) Les foyers sont sur l'axe $(PQ)$ à la distance $O'J$ de $O'$ (intersection du cercle de centre $O'$ passant par $J$, c'est-à-dire $(\mathscr{C})$, avec $(PQ)$).
   c) Les sommets sont $P$ et $Q$.
   d) Le projeté $H_1$ de $F$ sur la diagonale $(AJ)$ est sur la directrice $(D_1)$, perpendiculaire à $(PQ)$ ; de même $(D_2)$ avec $F'$ et $(LB)$.
   e) Soit $M_1$ l'intersection de $[JF)$ avec le cercle directeur de centre $F$ et de rayon $2\,O'P$ ; $M_0$ est l'intersection de $[FJ]$ et de la médiatrice de $[F'M_1]$ : $M_0F' - M_0F = M_0M_1 - M_0F = FM_1 = 2\,O'P$.
   f) $O'P = 3$ (demi-axe focal) et $O'J = \sqrt{3^2 + 1{,}5^2} = \frac32\sqrt5$ : $e = \dfrac{O'J}{O'P} = \dfrac{\sqrt5}{2}$.
4. a) Avec l'unité $O'O = 3$ cm : l'axe non focal porte $\vec i$ ($a = 1$ sur cet axe) et l'axe focal porte $\vec j$ (sommets à 2 unités). $(H) : -\dfrac{x^2}{1} + \dfrac{y^2}{4} = 1$, soit $x^2 - \dfrac{y^2}{4} = -1$.
   b) Foyers $(0 ; \pm\sqrt5)$, sommets $(0 ; \pm2)$ : $e = \dfrac{\sqrt5}{2}$. (On vérifie aussi $MF^2 - \frac54MH^2 = 0$ avec la directrice $y = -\frac{4}{\sqrt5}$.)

### Exercice 3
1. a) $f'(x) = \dfrac x2 - \dfrac2x = \dfrac{(x - 2)(x + 2)}{2x}$.
   b) $f$ décroît sur $]0 ; 2]$ de $+\infty$ à $f(2) = \frac34 - 2\ln2 \approx -0{,}64$, puis croît vers $+\infty$.
   c) $f(3) \approx -0{,}197$ et $f(4) \approx 0{,}977$ ; $f$ continue strictement croissante sur $[3 ; 4]$ : $\alpha$ unique.
2. a) Pour $x \geq 3$ : $f(x) = 0 \iff x^2 = 1 + 8\ln x \iff x = \sqrt{1 + 8\ln x}$ (car $x > 0$).
   b) Inégalité des accroissements finis appliquée entre $x$ et $\alpha$, avec $g(\alpha) = \alpha$.
3. a) Récurrence : $u_0 = 3 \in [3 ; 4]$ et $g([3 ; 4]) \subset [3 ; 4]$.
   b) On applique 2.b) à $x = u_n$.
   c) $|u_0 - \alpha| \leq 1$, puis récurrence.
   d) $\left(\frac49\right)^n \to 0$.
   e) $\left(\frac49\right)^n \leq 10^{-2} \iff n \geq \dfrac{2\ln10}{\ln9 - \ln4} \approx 5{,}68$ : $n_0 = 6$ ($\alpha \approx 3{,}26$).

### Exercice 4
1. $P(G) = \frac{26}{40} = \frac{13}{20}$ ; $P(F) = \frac{14}{40} = \frac{7}{20}$.
3. $P(L) = \frac{26}{40} \times \frac12 + \frac{14}{40} \times \frac{n}{14} = \frac{13 + n}{40}$.
4. Indépendance $\iff P_G(L) = P(L) \iff \frac12 = \frac{13 + n}{40} \iff n = 7$.`,
}

const bac2019 = {
  title: 'Bac C 2019 — Mathématiques : inverse modulo 226, rotation et symétrie glissée, hyperbole, équation différentielle et fonction, deux urnes',
  statement: R`**Baccalauréat 2019 — Série C — Mathématiques**

### Exercice 1 (4 points)
On considère l'équation $(E) : 109x - 226y = 1$, $x$ et $y$ entiers relatifs.
1. Déterminer le PGCD de 109 et 226.
2. Que peut-on conclure pour l'équation $(E)$ ?
3. Vérifier que 141 est l'inverse de 109 modulo 226.
4. a) Montrer que $(E)$ est équivalente à $(E') : 109x \equiv 1\;[226]$.
   b) Résoudre $(E')$.
   c) En déduire les solutions de $(E)$.

### Exercice 2 (8 points)
Dans le plan orienté, $ABCE$ est un carré de sens direct, de centre $O$. $D$ est le symétrique de $O$ par rapport à la droite $(BC)$ ; $K$ et $O'$ sont les milieux de $[BD]$ et $[BC]$ ; $G$ est le symétrique de $C$ par rapport à $B$.
1. Faire une figure ($[BC]$ horizontal, $BC = 6$ cm).
2. Soit $f$ la rotation qui transforme $O$ en $D$ et $A$ en $C$.
   a) Déterminer le centre de $f$.
   b) Déterminer une mesure $\theta$ de son angle.
   c) Prouver que $S_{(BA)} \circ S_{(BO)}$ est la réciproque de $f$.
3. Soit $g = S_{(OD)} \circ R_{(B, \frac\pi2)}$.
   a) Justifier que $g$ est une symétrie glissée.
   b) Déterminer $g(B)$ et $g(C)$.
   c) En calculant $g \circ g(B)$, montrer que le vecteur de $g$ est $\vec u = \overrightarrow{BO}$.
   d) En déduire que l'axe de $g$ est la droite $(KO')$.
   e) Déterminer l'ensemble $(\Gamma)$ des points $M$ tels que $g(M) = f^{-1}(M)$.
4. Soit $(H)$ l'hyperbole d'excentricité $e = 2$, de foyer $C$ et de directrice associée $(BA)$.
   a) $J$ est le point tel que $\overrightarrow{BJ} = \frac13\overrightarrow{BC}$. Montrer que $G$ et $J$ sont les sommets de $(H)$.
   b) Placer le centre $\Omega$ de $(H)$.
   c) Tracer les asymptotes $(\Delta_1)$ et $(\Delta_2)$.
   d) Tracer la branche $(H_0)$ de sommet $J$.
   e) Dans le repère orthonormé direct $(B ; \overrightarrow{BC}, \overrightarrow{BA})$, montrer à l'aide de la définition monofocale qu'une équation de $(H)$ est $3x^2 + 2x - y^2 - 1 = 0$.

### Exercice 3 (5 points)
1. Résoudre l'équation différentielle $(E) : y'' + 3y' + 2y = 0$.
2. Déterminer la solution $h$ de $(E)$ qui admet en $x = 0$ un extremum égal à 1 *(le sujet dit « un maximum »)*.
3. Soit $f(x) = -e^{-2x} + 2e^{-x}$ et $(\mathscr{C})$ sa courbe.
   a) Calculer $\lim\limits_{-\infty} f$ (on admet que $\lim\limits_{+\infty} f = 0$).
   b) Déterminer $f'$. c) Étudier le sens de variation de $f$. d) Dresser le tableau de variation.
   e) Trouver le point d'intersection de $(\mathscr{C})$ avec l'axe des abscisses.
   f) Calculer $\lim\limits_{-\infty} \dfrac{f(x)}{x}$.
   g) Tracer $(\mathscr{C})$.

### Exercice 4 (3 points)
L'urne $U_1$ contient 2 boules blanches et 3 noires ; l'urne $U_2$, 2 blanches et 2 noires. On lance un dé non truqué : si le résultat est inférieur ou égal à 2, on tire une boule dans $U_1$, sinon dans $U_2$. Événements $U_1$, $U_2$ (urne du tirage), $B$ (blanche), $N$ (noire).
1. a) Montrer que $P(U_1) = \frac13$. b) En déduire $P(U_2)$.
2. Traduire les données par un arbre.
3. Montrer que $P(N) = \frac{8}{15}$.
4. On a tiré une boule noire. Calculer la probabilité qu'elle provienne de $U_1$.`,
  solution: R`### Exercice 1
1. $226 = 109 \times 2 + 8$ ; $109 = 8 \times 13 + 5$ ; $8 = 5 + 3$ ; $5 = 3 + 2$ ; $3 = 2 + 1$ : PGCD $= 1$.
2. Par Bézout, $(E)$ admet des solutions.
3. $109 \times 141 = 15\,369 = 1 + 226 \times 68$.
4. a) $109x - 1 = 226y \iff 109x \equiv 1\;[226]$.
   b) $109(x - 141) \equiv 0\;[226]$ et, par Gauss, $x = 141 + 226k$.
   c) $y = \dfrac{109x - 1}{226} = 68 + 109k$ : $S = \{(141 + 226k ; 68 + 109k),\ k \in \mathbb{Z}\}$.

### Exercice 2
2. a) Le centre est l'intersection des médiatrices de $[OD]$ et $[AC]$ : c'est **$B$** ($BO = BD$, $BA = BC$).
   b) $\theta = (\overrightarrow{BA}, \overrightarrow{BC}) = -\dfrac\pi2$.
   c) $S_{(BA)} \circ S_{(BO)}$ est la rotation de centre $B$ d'angle $2((BO), (BA)) = 2 \times \dfrac\pi4 = \dfrac\pi2$ : c'est $f^{-1}$.
3. a) Composée d'une rotation dont le centre $B$ n'est pas sur l'axe $(OD)$ et d'une symétrie axiale : symétrie glissée.
   b) $g(B) = S_{(OD)}(B) = C$ ; $g(C) = S_{(OD)}(A) = E$.
   c) $g \circ g(B) = E$, donc $2\vec u = \overrightarrow{BE}$ : $\vec u = \overrightarrow{BO}$.
   d) L'axe, dirigé par $\overrightarrow{BO}$, passe par le milieu $O'$ de $[B\,g(B)] = [BC]$ : c'est la parallèle à $(BO)$ par $O'$, qui passe aussi par $K$ (droite des milieux dans $BCD$) : $(KO')$.
   e) $g(M) = f^{-1}(M) \iff S_{(OD)}(R(M)) = R(M)$ (car $f^{-1} = R_{(B,\frac\pi2)} = R$) $\iff R(M) \in (OD) \iff M \in R^{-1}((OD))$. Comme $R^{-1}(O) = D$, $(\Gamma)$ est la droite perpendiculaire à $(OD)$ passant par $D$.
4. a) Un sommet $S$ de l'axe $(BC)$ vérifie $SC = 2SB$ : $\overrightarrow{SC} = 2\overrightarrow{SB} \iff \overrightarrow{SB} = \overrightarrow{BC} \iff S = G$, ou $\overrightarrow{SC} = -2\overrightarrow{SB} \iff \overrightarrow{BS} = \frac13\overrightarrow{BC} \iff S = J$.
   b) $\Omega$ est le milieu de $[GJ]$.
   c) Les asymptotes passent par $\Omega$ et par les points d'intersection du cercle principal (diamètre $[GJ]$) avec la directrice $(BA)$.
   e) $M(x ; y)$, $C(1 ; 0)$, projeté sur $(BA)$ : $H(0 ; y)$. $MC = 2MH \iff (x - 1)^2 + y^2 = 4x^2 \iff 3x^2 + 2x - y^2 - 1 = 0$.

### Exercice 3
1. $r^2 + 3r + 2 = 0$ : $r = -1$ ou $-2$ ; $y = c_1e^{-2x} + c_2e^{-x}$.
2. $h(0) = 1$ et $h'(0) = 0$ : $c_1 + c_2 = 1$ et $-2c_1 - c_2 = 0$, d'où $c_1 = -1$, $c_2 = 2$ : $h(x) = -e^{-2x} + 2e^{-x}$ (c'est bien un maximum).
3. a) $f(x) = -e^{-2x}(1 - 2e^x) \to -\infty$ en $-\infty$.
   b) $f'(x) = 2e^{-2x} - 2e^{-x} = 2e^{-2x}(1 - e^x)$.
   c) et d) $f' > 0$ sur $]-\infty ; 0[$, $f' < 0$ sur $]0 ; +\infty[$ : $f$ croît de $-\infty$ à $f(0) = 1$, puis décroît vers $0$.
   e) $f(x) = 0 \iff e^{-2x}(2e^x - 1) = 0 \iff x = -\ln2$ : point $(-\ln2 ; 0)$.
   f) Avec $u = -x$ : $\dfrac{f(x)}{x} = \dfrac{e^{2u}}{u}(1 - 2e^{-u}) \to +\infty$ : branche parabolique de direction $(Oy)$ en $-\infty$.
   g) Asymptote $y = 0$ en $+\infty$, maximum $(0 ; 1)$.

### Exercice 4
1. a) $P(U_1) = P(\{1 ; 2\}) = \frac26 = \frac13$. b) $P(U_2) = \frac23$.
2. Arbre : $U_1$ ($\frac13$) → $B$ ($\frac25$), $N$ ($\frac35$) ; $U_2$ ($\frac23$) → $B$ ($\frac12$), $N$ ($\frac12$).
3. $P(N) = \frac13 \times \frac35 + \frac23 \times \frac12 = \frac15 + \frac13 = \frac{8}{15}$.
4. $P_N(U_1) = \dfrac{1/5}{8/15} = \dfrac38$.`,
}

const bac2018 = {
  title: 'Bac C 2018 — Mathématiques : système de congruences, hyperbole équilatère et similitude indirecte, fonction exp-ln, série double',
  statement: R`**Baccalauréat 2018 — Série C — Mathématiques**

### Exercice 1 (4 points)
On considère le système $(S) : \begin{cases} x \equiv 2\;[36] \\ x \equiv 3\;[25] \end{cases}$
1. Montrer que $(S)$ est équivalent à l'équation $(E) : 36a - 25b = 1$, où $a$ et $b$ sont des entiers relatifs.
2. Vérifier que $(-9 ; -13)$ est une solution de $(E)$.
3. Montrer que $(E)$ est équivalente à $(E') : 36a \equiv 1\;[25]$.
4. Donner l'inverse modulo 25 de 36.
5. En déduire les solutions de $(E')$.
6. a) Déterminer les solutions de $(E)$.
   b) En déduire les solutions de $(S)$ telles que $0 < x < 50$.

### Exercice 2 (8 points)
Dans le plan orienté, $ABCD$ est un carré de centre $O$ tel que $(\overrightarrow{AB}, \overrightarrow{AD}) = \frac\pi2$. $E$, $F$, $G$, $H$ sont les milieux de $[AB]$, $[BC]$, $[CD]$, $[DA]$. $(\mathscr{C}_1)$ est le cercle circonscrit au triangle $ABD$. $I$ est le symétrique de $O$ par rapport à $G$.
1. Faire une figure ($AB = 4$ cm, $(AB)$ horizontal).
2. Soit $(\Gamma)$ l'hyperbole de rectangle fondamental le carré $ABCD$ et d'axe non focal la droite $(EG)$.
   a) Préciser le foyer $J$ de $(\Gamma)$ situé sur la demi-droite $[OF)$.
   b) Préciser la directrice $(D)$ associée au foyer $J$.
   c) Construire le point $K$ de $(\Gamma)$ situé sur le segment $[JB]$.
   d) Déterminer la demi-droite asymptote de $(\Gamma)$ située dans la portion de plan délimitée par $[OF)$ et $[OG)$.
   e) Construire la branche $(\Gamma_0)$ de $(\Gamma)$ située dans cette portion de plan.
3. Soit $S$ la similitude plane indirecte d'axe $(AC)$, de rapport 2, qui transforme $F$ en $I$. Démontrer que son centre est $O$.
4. Soit $(\Gamma')$ l'image de $(\Gamma)$ par $S$.
   a) Montrer que $(\Gamma')$ est une hyperbole équilatère.
   b) Trouver l'excentricité de $(\Gamma')$.
   c) Construire le cercle principal $(\mathscr{C}_2)$ de $(\Gamma')$.
   d) Démontrer que $(\Gamma)$ et $(\Gamma')$ ont les mêmes asymptotes.
   e) Déterminer l'axe focal de $(\Gamma')$.
   f) Construire l'image $J'$ du foyer $J$ de $(\Gamma)$.
   g) Construire l'image $(\mathscr{C}'_1)$ du cercle $(\mathscr{C}_1)$ par $S$.
   h) Construire l'image $(\Gamma'_0)$ de $(\Gamma_0)$ par $S$.

### Exercice 3 (5 points)
**Partie A.** Soit $g(x) = xe^x - 1$ sur $]0 ; +\infty[$.
1. Calculer $g'(x)$.
2. Dresser le tableau de variation de $g$ (on admet que $\lim\limits_{+\infty} g = +\infty$).
3. a) Montrer que $g(x) = 0$ admet une solution unique $\alpha \in \left]\frac12 ; 1\right[$.
   b) En déduire le signe de $g(x)$.

**Partie B.** Soit $f(x) = e^x - \ln x$ sur $]0 ; +\infty[$ et $(\mathscr{C})$ sa courbe.
4. Calculer les limites de $f$ en $0^+$ et en $+\infty$.
5. Montrer que $f'(x) = \dfrac{g(x)}{x}$.
6. a) Dresser le tableau de variation de $f$ (on admet que $(\mathscr{C})$ a une branche parabolique de direction $(Oy)$).
   b) Montrer que $f$ admet un minimum $f(\alpha) = \alpha + \dfrac1\alpha$.
7. Tracer $(\mathscr{C})$ (on prendra $\alpha = 0{,}6$ et $f(\alpha) = 2{,}3$).

### Exercice 4 (3 points)
Série statistique à double entrée :

| $X \backslash Y$ | −1 | 2 | 3 |
|---|---|---|---|
| 2 | 2 | 0 | 3 |
| 3 | 1 | 3 | 4 |

1. Déterminer les séries marginales de $X$ et $Y$.
2. Déterminer les coordonnées $\overline X$ et $\overline Y$ du point moyen $G$.
3. On admet que la variance de $X$ est $\frac{10}{169}$ *(coquille du sujet : la valeur exacte est $\frac{40}{169}$)* et celle de $Y$ est $2{,}59$.
   a) Montrer que la covariance de $X$ et $Y$ est $\frac{29}{169}$.
   b) Montrer que la droite de régression de $Y$ en $X$ est $Y = \frac{29}{40}X - \frac{1}{20}$.`,
  solution: R`### Exercice 1
1. $x = 2 + 36a = 3 + 25b \iff 36a - 25b = 1$.
2. $36 \times (-9) - 25 \times (-13) = -324 + 325 = 1$.
3. $36a - 1 = 25b \iff 36a \equiv 1\;[25]$.
4. $36 \times (-9) \equiv 1\;[25]$ : l'inverse est $-9$ (ou $16$).
5. $36(a + 9) \equiv 0\;[25]$, Gauss : $a = -9 + 25k$.
6. a) $b = -13 + 36k$ : $S = \{(-9 + 25k ; -13 + 36k)\}$.
   b) $x = 2 + 36a = -322 + 900k$ ; $0 < x < 50 \iff 0{,}357 < k < 0{,}413$ : **aucune solution** ($x \equiv 578\;[900]$).

### Exercice 2
*Repère pour vérifier : $O$ origine, $F(2 ; 0)$, $G(0 ; -2)$, $C(2 ; -2)$ ; $a = b = 2$, $c = 2\sqrt2$.*
2. a) L'axe focal est $(OF)$ (perpendiculaire à $(EG)$) ; la demi-distance focale vaut $c = OC = 2\sqrt2$ : $J$ est l'intersection de $[OF)$ avec $(\mathscr{C}_1)$ (cercle de centre $O$ et de rayon $OA = 2\sqrt2$).
   b) Le projeté orthogonal de $J$ sur une diagonale du rectangle fondamental est sur la directrice : $(D)$ est la perpendiculaire à $(OF)$ en ce point (à la distance $\frac{a^2}{c} = \sqrt2$ de $O$).
   c) Avec $J_1$ le second foyer et le cercle directeur $(\mathscr{C}_d)$ de centre $J$ et de rayon $2a = 4$, soit $P = [BJ) \cap (\mathscr{C}_d)$ : $K$ est l'intersection de $[BJ]$ et de la médiatrice de $[J_1P]$ (alors $KJ_1 - KJ = KP - KJ = 4$).
   d) La demi-droite $[OC)$ (diagonale du carré).
   e) Tracé à partir du sommet $F$, de $K$, de son symétrique $K'$ par rapport à $(OF)$ et de l'asymptote $[OC)$.
3. $S = h_{(\Omega, 2)} \circ S_{(AC)}$ avec $\Omega \in (AC)$. $S_{(AC)}(F) = G$, donc $h(G) = I$ : $\overrightarrow{\Omega I} = 2\overrightarrow{\Omega G}$, d'où $\overrightarrow{\Omega O} = \overrightarrow{OI} - 2\overrightarrow{OG} = \vec 0$ : $\Omega = O$.
4. a) Le rectangle fondamental de $(\Gamma)$ est un carré, son image aussi : $(\Gamma')$ est équilatère.
   b) Une similitude conserve l'excentricité : $e' = \dfrac{OC}{OF} = \sqrt2$.
   c) $S(O) = O$, $S(F) = I$ : $(\mathscr{C}_2)$ a pour centre $O$ et pour rayon $OI = 4$.
   d) $(AC)$ est l'axe de $S$ et $(BD)$ passe par le centre perpendiculairement à l'axe : ces deux droites sont globalement invariantes. Ce sont les asymptotes de $(\Gamma)$, donc aussi de $(\Gamma')$.
   e) L'axe focal $(OF)$ devient $(OI) = (OG)$.
   f) $S_{(AC)}(J)$ est le point de $[OG)$ à la distance $2\sqrt2$ de $O$ ; $J'$ est le point de $[OG)$ tel que $OJ' = 4\sqrt2$.
   g) $(\mathscr{C}'_1)$ : cercle de centre $O$ et de rayon $4\sqrt2$ (il passe par $J'$).
   h) $(\Gamma'_0)$ : branche de sommet $I$, d'asymptotes $(AC)$ et $(BD)$, dans la portion de plan image (entre $[OG)$ et $[OD)$ après symétrie et agrandissement).

### Exercice 3
1. $g'(x) = (x + 1)e^x$.
2. $g' > 0$ : $g$ croît de $-1$ (en $0^+$) à $+\infty$.
3. a) $g\left(\frac12\right) \approx -0{,}18 < 0$ et $g(1) = e - 1 > 0$ ; $g$ continue strictement croissante : $\alpha$ unique.
   b) $g < 0$ sur $]0 ; \alpha[$, $g > 0$ sur $]\alpha ; +\infty[$.
4. $\lim\limits_{0^+} f = +\infty$ ; $f(x) = e^x\left(1 - \dfrac{\ln x}{e^x}\right) \to +\infty$.
5. $f'(x) = e^x - \dfrac1x = \dfrac{xe^x - 1}{x} = \dfrac{g(x)}{x}$.
6. a) $f$ décroît sur $]0 ; \alpha]$, croît sur $[\alpha ; +\infty[$.
   b) $g(\alpha) = 0 \Rightarrow e^\alpha = \dfrac1\alpha$ et $\ln\alpha = -\alpha$, d'où $f(\alpha) = \dfrac1\alpha + \alpha$.
7. Minimum $\approx (0{,}6 ; 2{,}3)$, asymptote verticale $x = 0$.

### Exercice 4
1. $X$ : 2 (effectif 5), 3 (effectif 8) ; $Y$ : −1 (3), 2 (3), 3 (7) ; $N = 13$.
2. $\overline X = \frac{10 + 24}{13} = \frac{34}{13}$ ; $\overline Y = \frac{-3 + 6 + 21}{13} = \frac{24}{13}$.
3. a) $\frac{1}{13}\sum n_{ij}x_iy_j = \frac{-4 + 18 - 3 + 18 + 36}{13} = 5$, d'où $\text{Cov} = 5 - \frac{34 \times 24}{169} = \frac{29}{169}$.
   b) $V(X) = \frac{20 + 72}{13} - \frac{1156}{169} = \frac{40}{169}$ (et non $\frac{10}{169}$). $a = \frac{29}{40}$ ; $b = \frac{24}{13} - \frac{29}{40}\times\frac{34}{13} = -\frac{1}{20}$ : $Y = \frac{29}{40}X - \frac1{20}$.`,
}

export const BLOCS = [
  { subject: 'Mathématiques', levels: ['bac_c'], chapterTitle: 'Annales du bac — Mathématiques série C', orderStart: 10, exercises: [bac2020, bac2019, bac2018] },
]
