// Annales du bac — MATHÉMATIQUES série C (Congo), sessions 2015 à 2017.
// Source : compilation « sujets et corrigés bac C 2009-2021 » (PDF fourni le 26/10/2026).
// Énoncés transcrits (erreurs d'énoncé signalées) ; corrigés rédigés pour l'application.
// Rangs : 2017 = 13, 2016 = 14, 2015 = 15.
const R = String.raw

const bac2017 = {
  title: 'Bac C 2017 — Mathématiques : équation diophantienne, hyperbole et similitude indirecte, fonction intégrale, probabilités',
  statement: R`**Baccalauréat 2017 — Série C — Mathématiques**

### Exercice 1 (4 points)
On considère dans $\mathbb{Z} \times \mathbb{Z}$ l'équation $(E) : 48x + 35y = 1$.
a) Justifier à l'aide du théorème de Bézout que $(E)$ admet des solutions.
b) Justifier que $48$ et $-8$ sont inverses modulo $35$.
c) En remarquant que $(E)$ peut s'écrire $48x \equiv 1\;[35]$, déterminer une solution particulière $(x_0, y_0)$.
d) Achever la résolution de $(E)$.

### Exercice 2 (8 points)
Le plan est orienté. $ABC$ est un triangle équilatéral de sens direct, de centre de gravité $E$.
1. Faire une figure ($AB = 4$ cm).
2. Construire le cercle $(\mathscr{C})$ de centre $A$ passant par $B$.
3. Construire le point $F$ symétrique de $A$ par rapport à $E$.
4. Montrer que les droites $(CF)$ et $(CA)$ sont perpendiculaires.
   Soit $(\Gamma)$ l'hyperbole de cercle principal $(\mathscr{C})$ dont une directrice est la droite $(BC)$.
5. Montrer que $F$ est un foyer de $(\Gamma)$. Préciser son axe focal.
6. $G$ est le projeté orthogonal de $F$ sur $(BC)$ et $H$ le point de l'axe focal tel que $\overrightarrow{AH} = 3\overrightarrow{AG}$.
   a) Construire $H$.
   b) On pose $AF = c$ et $AB = a$. Que représente le rapport $\dfrac{AF}{AB}$ pour $(\Gamma)$ ? Montrer qu'il vaut $\dfrac{2\sqrt3}{3}$.
7. Construire le point $I$ tel que $\overrightarrow{GI} = \dfrac ca\overrightarrow{GH}$.
8. $(d)$ est la perpendiculaire à l'axe focal passant par $H$. Construire le point $J$ de $(\Gamma)$ situé sur $(d)$, du même côté de $(AH)$ que $C$.
9. On note $S$ le sommet de $(\Gamma)$ associé au foyer $F$. Construire l'arc $(\mathscr{H})$ de $(\Gamma)$ d'extrémités $J$ et $S$.
10. Soit $s = h \circ S_{(BC)}$ où $h$ est l'homothétie de centre $A$ et de rapport $\frac12$.
   a) Déterminer l'axe $(\Delta)$ et le centre $\Omega$ de la similitude indirecte $s$.
   b) Construire l'arc $(\mathscr{H}')$, image de $(\mathscr{H})$ par $s$.
   c) Déterminer l'excentricité de $(\Gamma')$, image de $(\Gamma)$ par $s$.

### Exercice 3 (5 points)
Soit $f(x) = (x - 1)\ln(x + 1)$ sur $I = [0 ; +\infty[$ et, pour $x \geq 0$, $F(x) = \displaystyle\int_1^x f(t)\,dt$.
1. a) Prouver que $F$ est dérivable sur $I$ et que $F'(x) = f(x)$.
   b) En déduire le sens de variation de $F$.
2. On admet que pour tout $x \geq 2$, $f(x) \geq x - 1$.
   a) Prouver que pour tout $x \geq 2$, $F(x) \geq \frac12(x - 1)^2$. *(⚠️ Inégalité fausse dans le sujet : prouver plutôt que $F(x) \geq F(2) + \frac{x^2}{2} - x$.)*
   b) En déduire $\lim\limits_{+\infty} F$ et $\lim\limits_{+\infty} \dfrac{F(x)}{x}$.
   c) Dresser le tableau de variation de $F$.
   d) Donner l'allure de la courbe de $F$ (unité 2 cm ; on donne $F(0) \approx 0{,}13$ et $F(2) \approx 0{,}5$).
3. Soit $u_n = \displaystyle\int_n^{n+1} f(t)\,dt$.
   a) Vérifier que $u_n = F(n + 1) - F(n)$.
   b) À l'aide de l'inégalité des accroissements finis sur $[n ; n + 1]$, montrer que $f(n) \leq u_n \leq f(n + 1)$. *(⚠️ Vrai pour $n \in \mathbb{N}^*$ seulement.)*

### Exercice 4 (3 points)
Jean tire deux fois au but. La probabilité de réussir le premier tir est $0{,}7$ ; s'il le réussit, la probabilité de réussir le second est $0{,}8$ ; s'il le manque, elle est de $0{,}4$. $R_1$ : « le premier tir est réussi » ; $R_2$ : « le second tir est réussi ».
1. Construire l'arbre de probabilité.
2. Calculer la probabilité que les deux tirs soient réussis.
3. Calculer la probabilité que le second tir soit réussi.
4. $A$ : « Jean réussit exactement un tir ». Calculer $P(A)$.`,
  solution: R`### Exercice 1
a) $\text{PGCD}(48, 35) = 1$ : par Bézout, $(E)$ a des solutions.
b) $48 \times (-8) = -384 = 1 - 35 \times 11 \equiv 1\;[35]$.
c) $48 \times (-8) + 35 \times 11 = 1$ : $(x_0, y_0) = (-8 ; 11)$.
d) $48(x + 8) = 35(11 - y)$ ; $35$ et $48$ premiers entre eux : $x = -8 + 35k$, puis $y = 11 - 48k$. $S = \{(-8 + 35k ; 11 - 48k),\ k \in \mathbb{Z}\}$.

### Exercice 2
4. $EA = EC$ ($E$ centre du triangle équilatéral) et $EA = EF$ : dans le triangle $ACF$, la médiane $[CE]$ mesure la moitié de $[AF]$, donc $ACF$ est rectangle en $C$.
5. Le centre de $(\Gamma)$ est $A$ (centre du cercle principal) ; l'axe focal est la perpendiculaire à la directrice $(BC)$ passant par $A$ : $(AG)$ (qui passe par $E$ et $F$). $C$ est commun au cercle principal et à la directrice : $(AC)$ est une asymptote. Le projeté orthogonal d'un foyer sur une asymptote est sur le cercle principal ; $C$ est le projeté de $F$ sur $(AC)$ (question 4) : $F$ est un foyer.
6. b) $\dfrac{AF}{AB} = \dfrac ca$ est l'**excentricité**. Dans le triangle $ABF$ rectangle en $B$ (symétrique de $ACF$), $\widehat{FAB} = 30°$ : $\dfrac{AB}{AF} = \cos30°$, d'où $e = \dfrac{2}{\sqrt3} = \dfrac{2\sqrt3}{3}$.
7. La perpendiculaire à $(AH)$ en $H$ et la parallèle à $(AC)$ passant par $G$ se coupent en $K$ avec $GK = \dfrac{GH}{\cos30°} = e\cdot GH$ : $I$ est l'intersection du cercle de centre $G$, de rayon $GK$, avec la demi-droite $[GH)$.
8. Pour $J \in (\Gamma)$ : $JF = e\cdot JP$ où $P$ est son projeté sur $(BC)$, et $JP = GH$ ; donc $JF = e\cdot GH = GI$ : $J$ est l'intersection de $(d)$ et du cercle de centre $F$ et de rayon $GI$ (côté de $C$).
10. a) $s(A) = h(G) = G$ et $s(G) = h(G) = G'$, milieu de $[AG]$. Or $s \circ s = h_{(\Omega, \frac14)}$, donc $\overrightarrow{\Omega G'} = \frac14\overrightarrow{\Omega A}$, d'où $\overrightarrow{A\Omega} = \frac43\overrightarrow{AG'} = \frac23\overrightarrow{AG}$ : **$\Omega = E$**. L'axe $(\Delta)$ est la perpendiculaire à $(AG)$ passant par $E$.
   b) $s(F)$ est le milieu $F'$ de $[AE]$ (foyer de $(\Gamma')$) ; la directrice devient $(MN)$, avec $M$, $N$ milieux de $[AB]$ et $[AC]$ ; l'asymptote $(AC)$ devient $(GN)$ ; le cercle principal devient le cercle de centre $G$ et de rayon $GN$.
   c) Une similitude conserve les rapports de distances : $e' = \dfrac{2\sqrt3}{3}$.

### Exercice 3
1. a) $f$ est continue sur $I$ et $1 \in I$ : $F$ est la primitive de $f$ qui s'annule en $1$, dérivable, de dérivée $f$.
   b) $f(x) < 0$ sur $]0 ; 1[$ et $f(x) > 0$ sur $]1 ; +\infty[$ : $F$ décroît sur $[0 ; 1]$ et croît sur $[1 ; +\infty[$, avec $F(1) = 0$.
2. a) Pour $x \geq 2$ : $F(x) = F(2) + \displaystyle\int_2^x f(t)\,dt \geq F(2) + \int_2^x (t - 1)\,dt = F(2) + \frac{x^2}{2} - x$.
   (L'inégalité $F(x) \geq \frac12(x - 1)^2$ du sujet est fausse au voisinage de $x = 2$ : $F(2) \approx 0{,}5 = \frac12(2 - 1)^2$ et la courbe de $F$ croît moins vite juste après.)
   b) Par minoration, $\lim\limits_{+\infty} F = +\infty$ et $\dfrac{F(x)}{x} \geq \dfrac{F(2)}{x} + \dfrac x2 - 1 \to +\infty$ : branche parabolique de direction $(Oy)$.
   c) $F$ décroît de $F(0) \approx 0{,}13$ à $0$ sur $[0 ; 1]$, puis croît vers $+\infty$.
3. a) Relation de Chasles : $F(n + 1) - F(n) = \displaystyle\int_n^{n+1} f(t)\,dt$.
   b) Pour $n \geq 1$, $f'(x) = \ln(x + 1) + \dfrac{x - 1}{x + 1} > 0$ sur $[n ; n + 1]$, donc $f(n) \leq F'(x) = f(x) \leq f(n + 1)$ ; l'inégalité des accroissements finis donne $f(n) \leq F(n + 1) - F(n) \leq f(n + 1)$. (Pour $n = 0$, c'est faux : $f(0) = f(1) = 0$ alors que $u_0 = -F(0) \neq 0$.)

### Exercice 4
1. Arbre : $R_1$ (0,7) puis $R_2$ (0,8) / $\overline{R_2}$ (0,2) ; $\overline{R_1}$ (0,3) puis $R_2$ (0,4) / $\overline{R_2}$ (0,6).
2. $P(R_1 \cap R_2) = 0{,}7 \times 0{,}8 = 0{,}56$.
3. $P(R_2) = 0{,}56 + 0{,}3 \times 0{,}4 = 0{,}68$.
4. $P(A) = 0{,}7 \times 0{,}2 + 0{,}3 \times 0{,}4 = 0{,}26$.`,
}

const bac2016 = {
  title: 'Bac C 2016 — Mathématiques : équation diophantienne, symétrie glissée et parabole, équation différentielle et suite, corrélation',
  statement: R`**Baccalauréat 2016 — Série C — Mathématiques**

### Exercice 1 (4 points)
On donne dans $\mathbb{Z}^2$ l'équation $(E) : 2688x + 3024y = -3360$.
1. Déterminer $\text{PGCD}(2688, 3024)$, puis en déduire que $(E)$ admet des solutions.
2. Montrer que $(E)$ est équivalente à $(E_1) : 8x + 9y = -10$.
3. a) Montrer que $(E_1)$ peut s'écrire $(E_2) : 8x \equiv -10\;[9]$.
   b) Résoudre $(E_2)$.
   c) En déduire les solutions de $(E)$.

### Exercice 2 (8 points)
Le plan est orienté. $ABCD$ est un rectangle tel que $(\overrightarrow{BD}, \overrightarrow{BA}) = \dfrac\pi3\;[2\pi]$. On considère le losange $BDEG$ tel que $(\overrightarrow{BD}, \overrightarrow{BA}) = (\overrightarrow{BD}, \overrightarrow{BE})\;[2\pi]$. $S_\Delta$ et $t_{\vec u}$ désignent la symétrie orthogonale d'axe $(\Delta)$ et la translation de vecteur $\vec u$. On considère $f = S_{(AD)} \circ S_{(AB)} \circ S_{(BD)}$.
1. Faire la figure ($AB = 4$ cm, $(AB)$ horizontal).
2. Déterminer la nature et les éléments caractéristiques de $g = S_{(AB)} \circ S_{(BD)}$.
3. $R$ est la rotation de centre $B$ et d'angle $\dfrac\pi3$. Déterminer la nature exacte de $S_{(AD)} \circ R$.
4. $F$ est le milieu de $[BG]$.
   a) Démontrer que $f = t_{\overrightarrow{BF}} \circ S_{(AC)}$. *(⚠️ Erreur d'énoncé : il faut montrer que $S_{(AD)} \circ R = t_{\overrightarrow{BF}} \circ S_{(AC)}$.)*
   b) En déduire les éléments caractéristiques de $f$. *(Lire : de $S_{(AD)} \circ R$.)*
5. Soit $(P)$ la parabole dont une tangente est $(EF)$, la normale associée $(GB)$ et l'axe focal $(EB)$. Démontrer que $A$ est le foyer de $(P)$.
6. $H$ est le milieu de $[EG]$ et $L$ celui de $[ED]$. Déterminer la directrice $(d)$ de $(P)$.
7. Construire le point $I$ de $(P)$ tel que $[IF]$ soit une corde focale.
8. Construire la corde focale $[JK]$ de $(P)$ où $J$ appartient au segment $[AD]$.
9. Construire l'arc d'extrémités $J$ et $F$ de $(P)$.
10. Soit $(P')$ l'image de $(P)$ par $f$. a) Déterminer le foyer de $(P')$. b) Déterminer son axe focal.

### Exercice 3 (5 points)
1. Déterminer la solution $f$ de $(E) : y'' + 2y' + 2y = 0$ vérifiant $f\!\left(\frac\pi2\right) = e^{-\frac\pi2}$ et $f'\!\left(\frac\pi2\right) = -e^{-\frac\pi2}$.
2. On pose $f(x) = e^{-x}\sin x$.
   a) Déterminer les réels $A$ et $B$ pour que $F(x) = e^{-x}(A\cos x + B\sin x)$ soit une primitive de $f$.
   b) Calculer $\displaystyle\int_{n\pi}^{(n+1)\pi} f(x)\,dx$.
3. Soit $v_n = \dfrac{e^{-\pi} + 1}{2}\left(-e^{-\pi}\right)^n$.
   a) Montrer que $(v_n)$ est géométrique ; préciser sa raison et son premier terme.
   b) Calculer $S_n = v_0 + \dots + v_n$, puis la limite de $S_n$.

### Exercice 4 (3 points)
Tableau statistique à double entrée :

| $X \backslash Y$ | −1 | 2 | 3 |
|---|---|---|---|
| 1 | 2 | 1 | 1 |
| 2 | 2 | 3 | 1 |

1. Convertir ce tableau en un tableau linéaire.
2. Déterminer le coefficient de corrélation $\rho_{X,Y}$ (on donne $\overline X = 1{,}6$ et $\overline Y = 1$).
3. Donner une interprétation géométrique de cette corrélation.`,
  solution: R`### Exercice 1
1. $3024 = 2688 + 336$, $2688 = 336 \times 8$ : $\text{PGCD} = 336$, qui divise $3360 = 336 \times 10$ : $(E)$ a des solutions.
2. On divise par $336$ : $8x + 9y = -10$.
3. a) $8x + 10 = -9y$ est un multiple de $9$ : $8x \equiv -10\;[9]$.
   b) $8 \times 1 = 8 \equiv -10\;[9]$ : $8(x - 1) \equiv 0\;[9]$, $9$ et $8$ premiers entre eux : $x = 1 + 9k$.
   c) $y = \dfrac{-10 - 8(1 + 9k)}{9} = -2 - 8k$ : $S = \{(1 + 9k ; -2 - 8k),\ k \in \mathbb{Z}\}$.

### Exercice 2
2. $(AB)$ et $(BD)$ se coupent en $B$ : $g$ est la rotation de centre $B$ et d'angle $2((BD), (BA)) = \dfrac{2\pi}{3}$.
3. Composée d'une rotation (centre $B$ hors de l'axe $(AD)$) et d'une symétrie axiale : c'est une **symétrie glissée**.
4. a) $f \neq t_{\overrightarrow{BF}} \circ S_{(AC)}$ (contre-exemple : le centre $Q$ du rectangle a des images différentes). En revanche, $u = S_{(AD)} \circ R$ vérifie $u(B) = E$ et $u(E) = G$, donc $u \circ u(B) = G$ : son vecteur est $\frac12\overrightarrow{BG} = \overrightarrow{BF}$ ; son axe, dirigé par $\overrightarrow{BF}$, passe par le milieu de $[BE]$ : c'est $(AC)$. D'où $S_{(AD)} \circ R = t_{\overrightarrow{BF}} \circ S_{(AC)}$.
   b) Symétrie glissée d'axe $(AC)$ et de vecteur $\overrightarrow{BF}$.
5. La tangente et la normale en un point d'une parabole coupent l'axe focal en deux points dont le milieu est le foyer : ici en $E$ et $B$, de milieu $A$. Le foyer est $A$.
6. Le symétrique $H$ du foyer par rapport à la tangente $(EF)$ est sur la directrice : $(d)$ est la perpendiculaire à l'axe $(EB)$ passant par $H$, c'est-à-dire $(HL)$.
7. Les tangentes aux extrémités d'une corde focale sont perpendiculaires et se coupent sur la directrice. Avec $N = (EF) \cap (d)$, $I$ est l'intersection de la demi-droite $[FA)$ et de la perpendiculaire à $(EF)$ en $N$.
8. Avec $O = (EB) \cap (d)$, la corde focale $[JK]$ perpendiculaire à l'axe a ses tangentes qui se coupent en $O$ : $J$ et $K$ sont les intersections de la droite $(AD)$ et du cercle de centre $A$ et de rayon $AO$.
10. $f = S_{(AD)} \circ R \circ R = t_{\overrightarrow{BF}} \circ S_{(AC)} \circ R$. a) $f(A) = t_{\overrightarrow{BF}}(E) = E'$, avec $BFE'E$ parallélogramme : foyer de $(P')$. b) $f(B) = E$ et $f(A) = E'$ : l'axe focal de $(P')$ est $(EE')$, c'est-à-dire la droite $(ED)$.

### Exercice 3
1. $r^2 + 2r + 2 = 0$ : $r = -1 \pm i$ ; $y = e^{-x}(c_1\cos x + c_2\sin x)$. Les conditions donnent $c_2 = 1$ et $c_1 = 0$ : $f(x) = e^{-x}\sin x$.
2. a) $F'(x) = e^{-x}\left[(-A + B)\cos x + (-A - B)\sin x\right] = \sin x\,e^{-x}$ : $A = B = -\frac12$, $F(x) = -\frac12e^{-x}(\cos x + \sin x)$.
   b) Comme $\cos(k\pi) = (-1)^k$ et $\sin(k\pi) = 0$ : $F(k\pi) = -\frac12(-1)^ke^{-k\pi}$, d'où
$$\int_{n\pi}^{(n+1)\pi} f(x)\,dx = F((n + 1)\pi) - F(n\pi) = \frac{(-1)^n}{2}\left(e^{-n\pi} + e^{-(n+1)\pi}\right) = \frac{1 + e^{-\pi}}{2}\left(-e^{-\pi}\right)^n.$$
3. a) $\dfrac{v_{n+1}}{v_n} = -e^{-\pi}$ : géométrique de raison $-e^{-\pi}$ et de premier terme $v_0 = \dfrac{1 + e^{-\pi}}{2}$.
   b) $S_n = v_0\dfrac{1 - (-e^{-\pi})^{n+1}}{1 + e^{-\pi}} = \dfrac12\left(1 - (-e^{-\pi})^{n+1}\right)$ ; comme $e^{-\pi} < 1$, $\lim S_n = \dfrac12$ (c'est $\displaystyle\int_0^{+\infty} e^{-x}\sin x\,dx$).

### Exercice 4
1. $X$ : 1, 1, 1, 1, 2, 2, 2, 2, 2, 2 et $Y$ : −1, −1, 2, 3, −1, −1, 2, 2, 2, 3.
2. $V(X) = \dfrac{4 + 24}{10} - 1{,}6^2 = 0{,}24$ ; $V(Y) = \dfrac{4 + 16 + 18}{10} - 1 = 2{,}8$ ; $\text{Cov} = \dfrac{(-2 + 2 + 3) + (-4 + 12 + 6)}{10} - 1{,}6 = 1{,}7 - 1{,}6 = 0{,}1$.
   $\rho = \dfrac{0{,}1}{\sqrt{0{,}24 \times 2{,}8}} \approx 0{,}12$ : corrélation très faible.
3. $\rho$ est le cosinus de l'angle entre les vecteurs centrés $(x_i - \overline X)$ et $(y_i - \overline Y)$ : angle $\approx \arccos(0{,}12) \approx 83°$, presque droit (variables quasi non corrélées linéairement).`,
}

const bac2015 = {
  title: 'Bac C 2015 — Mathématiques : congruences et inverse modulo, ellipse et symétrie glissée, point fixe et suite, test de dépistage',
  statement: R`**Baccalauréat 2015 — Série C — Mathématiques**

### Exercice 1 (4 points)
Le but est de résoudre l'équation $(E) : 21x - 17y = 4$.
1. a) Montrer que cette équation admet au moins une solution.
   b) Montrer que $(E)$ est équivalente à $(E') : 21x \equiv 4\;[17]$.
2. On rappelle qu'un entier relatif $a$ est l'inverse modulo $n$ d'un entier $b$ si $ab \equiv 1\;[n]$.
   a) Déterminer l'inverse modulo 17 de 21.
   b) Montrer que les solutions de $(E')$ sont les entiers $x = 1 + 17k$, $k \in \mathbb{Z}$.
3. En déduire l'ensemble des solutions de $(E)$.

### Exercice 2 (8 points)
Dans le plan orienté, $ABCD$ est un carré de centre $O$ tel que $(\overrightarrow{AB}, \overrightarrow{AD}) \equiv \frac\pi2\;[2\pi]$ ; $I$ et $J$ sont les milieux de $[DC]$ et $[AD]$ ; $AB = 4$ cm.
1. Faire une figure.
2. On considère l'ellipse $(\mathscr{E})$ de centre $\Omega$, d'excentricité $\frac12$, de foyer $B$ et de directrice $(AD)$. Quel est son axe focal ?
3. $S_1$ et $S_2$ sont les points de $(\mathscr{E})$ situés sur $(AB)$.
   a) Montrer que $\overrightarrow{BS_1} = \frac13\overrightarrow{BA}$ et $\overrightarrow{BS_2} = -\overrightarrow{BA}$.
   b) Placer $S_1$ et $S_2$.
4. Tracer le cercle principal $(\mathscr{C}_p)$ de $(\mathscr{E})$.
5. Tracer le cercle secondaire $(\mathscr{C}_s)$.
6. Tracer le cercle directeur $(\mathscr{C}_d)$ de centre le foyer $B$.
7. Construire le point de $(\mathscr{E})$ situé sur la demi-droite $[BC)$.
8. Tracer l'arc de $(\mathscr{E})$ balayé par l'angle $(\overrightarrow{\Omega S_3}, \overrightarrow{\Omega B})$, où $S_3$ est le sommet de l'axe non focal situé du même côté que $C$.
9. Soit $f = S_{(AC)} \circ t_{\overrightarrow{DC}}$.
   a) Qu'appelle-t-on symétrie glissée ?
   b) Montrer que $f$ est une symétrie glissée ; déterminer son vecteur et son axe.
   c) Tracer l'image $(\mathscr{E}')$ de $(\mathscr{E})$ par $f$.

### Exercice 3 (5 points)
Soit $f(x) = \dfrac{1 - x\ln x}{x}$ sur $]0 ; +\infty[$. On admet que $f(x) = 0$ a une solution unique $\alpha$ sur $I = \left[\frac32 ; 2\right]$. Soit $g(x) = e^{\frac1x}$ et la suite $u_0 = 2$, $u_{n+1} = g(u_n)$.
1. Sachant que $f(\alpha) = 0$, montrer que $\alpha$ est solution de $g(x) = x$.
2. Montrer par récurrence que pour tout $n$, $u_n \in I$.
3. On suppose que pour tout $x \in I$, $|g'(x)| \leq \frac12$. Par l'inégalité des accroissements finis, montrer que $|g(x) - \alpha| \leq \frac12|x - \alpha|$ pour tout $x \in I$.
4. a) Montrer que $|u_{n+1} - \alpha| \leq \frac12|u_n - \alpha|$.
   b) En déduire que $|u_n - \alpha| \leq \left(\frac12\right)^n$.
   c) Montrer que $(u_n)$ converge vers $\alpha$.
5. a) Déterminer un entier $n_0$ tel que $|u_{n_0} - \alpha| \leq 10^{-1}$.
   b) Déterminer la valeur approchée $u_{n_0}$ de $\alpha$.

### Exercice 4 (3 points)
Une maladie atteint 3 % d'une population. Chez les malades, 95 % des tests sont positifs ; chez les non-malades, 1 % des tests sont positifs. $M$ : « être malade » ; $T$ : « le test est positif ».
1. Construire un arbre pondéré.
2. Donner $P(M \cap T)$, puis $P(\overline M \cap \overline T)$.
3. Déterminer $P(T)$ et $P(\overline T)$.
4. a) Calculer la probabilité de ne pas être malade sachant que le test est positif.
   b) Calculer la probabilité d'être malade sachant que le test est négatif.`,
  solution: R`### Exercice 1
1. a) $\text{PGCD}(21, 17) = 1$ divise 4 (Bézout) : solutions.
   b) $21x - 4 = 17y \iff 21x \equiv 4\;[17]$.
2. a) $21 = 17 + 4$, $17 = 4 \times 4 + 1$ : $1 = 17 \times 5 - 21 \times 4$, donc $21 \times (-4) \equiv 1\;[17]$ : l'inverse est $-4$ (ou $13$).
   b) $x \equiv -4 \times 4 = -16 \equiv 1\;[17]$ : $x = 1 + 17k$.
3. $y = \dfrac{21x - 4}{17} = 1 + 21k$ : $S = \{(1 + 17k ; 1 + 21k),\ k \in \mathbb{Z}\}$.

### Exercice 2
2. L'axe focal est la perpendiculaire à la directrice $(AD)$ passant par le foyer $B$ : la droite $(AB)$.
3. a) Un sommet $S$ sur $(AB)$ vérifie $SB = \frac12 SA$, soit $(2\overrightarrow{SB} - \overrightarrow{SA})\cdot(2\overrightarrow{SB} + \overrightarrow{SA}) = 0$ ; les points étant alignés : $2\overrightarrow{SB} + \overrightarrow{SA} = \vec 0 \iff \overrightarrow{BS} = \frac13\overrightarrow{BA}$, ou $2\overrightarrow{SB} - \overrightarrow{SA} = \vec 0 \iff \overrightarrow{BS} = -\overrightarrow{BA}$.
   b) Avec $A$ à l'origine et $B$ en 4 : $S_1$ en $\frac83$, $S_2$ en $8$ ; centre $\Omega$ en $\frac{16}{3}$, $a = \frac83$, $c = \frac43$ ; second foyer $B'$ en $\frac{20}{3}$.
4. $(\mathscr{C}_p)$ : centre $\Omega$, rayon $a = \Omega S_1$.
5. Le sommet $S_3$ de l'axe non focal vérifie $BS_3 = a$ : intersection de la perpendiculaire à $(AB)$ en $\Omega$ et du cercle de centre $B$ de rayon $a$ ; $(\mathscr{C}_s)$ : centre $\Omega$, rayon $b = \Omega S_3 = \sqrt{a^2 - c^2} = \frac{4\sqrt3}{3}$.
6. $(\mathscr{C}_d)$ : centre $B$, rayon $2a = S_1S_2$.
7. Soit $P = [BC) \cap (\mathscr{C}_d)$ ; le point cherché $Q$ est l'intersection de $[BC)$ et de la médiatrice de $[B'P]$ : $QB + QB' = QB + QP = BP = 2a$.
9. a) Une symétrie glissée est la composée (commutative) d'une symétrie axiale et d'une translation de vecteur directeur de l'axe (non nul).
   b) $\overrightarrow{DC}$ n'est pas orthogonal à $(AC)$ : $f$ est une symétrie glissée. $f(A) = S_{(AC)}(B) = D$ et $f(D) = S_{(AC)}(C) = C$, donc $f \circ f(A) = C$ : vecteur $\frac12\overrightarrow{AC} = \overrightarrow{OC}$ ; l'axe, parallèle à $(AC)$, passe par le milieu $J$ de $[AD]$ : c'est la droite $(JI)$.
   c) $(\mathscr{E}')$ : image des sommets et foyers par $f$.

### Exercice 3
1. $1 - \alpha\ln\alpha = 0 \Rightarrow \ln\alpha = \frac1\alpha \Rightarrow \alpha = e^{\frac1\alpha} = g(\alpha)$.
2. $u_0 = 2 \in I$. Si $u_n \in I$ : $\frac12 \leq \frac1{u_n} \leq \frac23$, d'où $e^{1/2} \approx 1{,}65 \leq u_{n+1} \leq e^{2/3} \approx 1{,}95$, donc $u_{n+1} \in I$.
3. $g$ dérivable sur $I$ avec $|g'| \leq \frac12$ : $|g(x) - g(\alpha)| \leq \frac12|x - \alpha|$, et $g(\alpha) = \alpha$.
4. a) On applique 3 à $x = u_n \in I$.
   b) $|u_0 - \alpha| = 2 - \alpha \leq \frac12 \leq 1$, puis récurrence avec a).
   c) $\left(\frac12\right)^n \to 0$ : $u_n \to \alpha$.
5. a) $\left(\frac12\right)^n \leq 0{,}1 \iff n \geq \dfrac{\ln10}{\ln2} \approx 3{,}32$ : $n_0 = 4$.
   b) $u_1 \approx 1{,}6487$ ; $u_2 \approx 1{,}8340$ ; $u_3 \approx 1{,}7254$ ; $u_4 \approx 1{,}7855$ : $\alpha \approx 1{,}79$ à $10^{-1}$ près ($\alpha \approx 1{,}763$).

### Exercice 4
1. Arbre : $M$ (0,03) → $T$ (0,95), $\overline T$ (0,05) ; $\overline M$ (0,97) → $T$ (0,01), $\overline T$ (0,99).
2. $P(M \cap T) = 0{,}03 \times 0{,}95 = 0{,}0285$ ; $P(\overline M \cap \overline T) = 0{,}97 \times 0{,}99 = 0{,}9603$.
3. $P(T) = 0{,}0285 + 0{,}97 \times 0{,}01 = 0{,}0382$ ; $P(\overline T) = 0{,}9618$.
4. a) $P_T(\overline M) = \dfrac{0{,}0097}{0{,}0382} \approx 0{,}254$ (un test positif sur quatre environ est un faux positif).
   b) $P_{\overline T}(M) = \dfrac{0{,}03 \times 0{,}05}{0{,}9618} \approx 0{,}0016$.`,
}

export const BLOCS = [
  { subject: 'Mathématiques', levels: ['bac_c'], chapterTitle: 'Annales du bac — Mathématiques série C', orderStart: 13, exercises: [bac2017, bac2016, bac2015] },
]
