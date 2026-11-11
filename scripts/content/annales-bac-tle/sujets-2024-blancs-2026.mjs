// Annales — sujets du bac 2024 (maths C et D) et bacs blancs zonaux de mai 2026
// (maths D zone 8, sciences physiques C zone 3 et D zone 5, SVT D zone 1, géographie C-D zone 3).
// Source : PDF fournis le 26/10/2026 (scans). Énoncés transcrits ; pages scannées jointes
// quand les figures sont nécessaires (dossier PAGES_DIR). Corrigés rédigés pour
// l'application ; quand un corrigé officiel était fourni (SP D, SVT D), il a servi de référence.
// Les textes d'auteurs des sujets de géographie sont adaptés (faits et chiffres conservés).
const R = String.raw
const p = (prefix, ...pages) => pages.map((n) => `${prefix}-p${String(n).padStart(2, '0')}.jpg`)

// ─────────────────────────────── MATHÉMATIQUES ───────────────────────────────

const mathsC2024 = {
  title: 'Bac C 2024 — Mathématiques : congruences, rotations et similitude, ellipse, encadrement d’intégrale, dé truqué',
  statement: R`**Baccalauréat — Session de juin 2024 — Série C — Mathématiques — Durée 4 h — Coefficient 5**

### Exercice 1 (4 points)
On considère dans $\mathbb{Z}$ le système $(S) : \begin{cases} x \equiv 3 \;[7] \\ x \equiv 5 \;[9] \end{cases}$
1. Prouver que $185$ est solution de $(S)$.
2. a) Montrer que si $x$ est une solution de $(S)$, alors $x - 185$ est divisible par $7$ et par $9$.
   b) Montrer que si un entier $p$ est divisible par $7$ et par $9$, alors $p$ est divisible par $63$.
   c) En déduire que si $x$ est une solution de $(S)$, alors $x \equiv 185 \;[63]$.
3. Déterminer toutes les solutions $x$ de $(S)$ telles que $680 \leq x \leq 820$.
4. Un sac contient $N$ oranges. Si on les range par groupes de 7, il en reste 3 ; si on les range par groupes de 9, il en reste 5.
   a) Justifier que $N$ est solution de $(S)$.
   b) En déduire le nombre d'oranges sachant que $680 \leq N \leq 750$.

### Exercice 2 (8 points)
Dans le plan orienté, on considère un segment $[AB]$ et le point $C$ tel que $ABC$ soit un triangle équilatéral de sens direct. On note $O$ le centre du triangle $ABC$ ; $I$ est le projeté orthogonal de $A$ sur $[BC]$. La parallèle à $(AI)$ passant par $C$ coupe la droite $(AB)$ au point $\Omega$. $D$ est le symétrique de $B$ par rapport à $C$.
1. Faire la figure ($[AB]$ horizontal, $AB = 6$ cm).
2. Soient $f = t_{\overrightarrow{BC}} \circ r_{(A;\,\frac\pi3)}$ et $g = f \circ r_{(B;\,-\frac\pi3)}$.
   a) Justifier que $t_{\overrightarrow{BC}} = S_{(\Omega C)} \circ S_{(AI)}$.
   b) Établir que $r_{(A;\,\frac\pi3)} = S_{(AI)} \circ S_{(AB)}$.
   c) En déduire que $f$ est une rotation de centre $\Omega$ et d'angle $\dfrac\pi3$.
   d) Montrer que $g$ est une translation.
   e) Montrer que $g(B) = D$. En déduire le vecteur de la translation $g$.
3. On considère la similitude plane directe $S$ d'angle $-\dfrac\pi3$, de rapport $2$, de centre $\Omega_1$, qui transforme $A$ en $D$.
   a) Montrer que le triangle $\Omega_1AD$ est rectangle de sens indirect en $A$ (on pourra calculer $\overrightarrow{A\Omega_1}\cdot\overrightarrow{AD}$).
   b) En déduire la construction de $\Omega_1$.
   c) Placer le point $I'$ image de $I$ par $S$.
   d) Montrer que les points $A$, $I$ et $I'$ sont alignés.
4. Soit $(E)$ l'ensemble des points $M$ du plan tels que $MB + MC = 2AC$.
   a) Montrer que $A$ appartient à $(E)$.
   b) Justifier que $(E)$ est une ellipse. Préciser l'axe focal.
   c) En remarquant que $I$ est le centre de $(E)$ et que $B$ et $C$ en sont les foyers, calculer l'excentricité de $(E)$.

### Exercice 3 (5 points)
On se propose d'encadrer l'intégrale $I = \displaystyle\int_0^1 \frac{1}{1 + x^2e^{-x}}\,dx$.
1. Soit $f(x) = x^2e^{-x}$.
   a) Calculer $f'(x)$ puis étudier son signe.
   b) Dresser le tableau de variation de $f$ (on donne $\lim\limits_{-\infty} f = +\infty$ et $\lim\limits_{+\infty} f = 0$).
   c) En déduire que pour tout $x \in [0 ; 1]$, $0 \leq f(x) \leq 1$.
2. a) Montrer que $F(x) = (-x^2 - 2x - 2)e^{-x}$ est une primitive de $f$ sur $\mathbb{R}$.
   b) En déduire la valeur de $J = \displaystyle\int_0^1 f(x)\,dx$.
3. a) On admet que pour tout $u \in [0 ; 1]$, $1 - u \leq \dfrac{1}{1 + u} \leq 1 - \dfrac u2$. En remplaçant $u$ par $f(x)$, démontrer que $1 - J \leq I \leq 1 - \dfrac J2$.
   b) En déduire que $\dfrac5e - 1 \leq I \leq \dfrac{5}{2e}$.

### Exercice 4 (3 points)
Un dé à six faces numérotées de 1 à 6 est truqué : les numéros de même parité ont la même probabilité d'apparition, et un numéro pair a deux fois plus de chances d'apparaître qu'un numéro impair. On note $p$ la probabilité d'un numéro pair (donné) et $q$ celle d'un numéro impair.
1. Calculer $p$ et $q$.
2. Soit $C$ l'événement « le numéro tiré est un nombre premier ».
   a) Écrire $C$ en extension.
   b) Montrer que la probabilité de tirer un nombre premier est $p' = \dfrac49$.
3. On lance 4 fois de suite le même dé ; $X$ est le nombre de fois qu'un numéro premier apparaît.
   a) Calculer la probabilité d'obtenir exactement une fois un numéro premier.
   b) Calculer la probabilité de ne pas avoir de numéro premier.`,
  solution: R`### Exercice 1
1. $185 = 26 \times 7 + 3$ et $185 = 20 \times 9 + 5$ : $185 \equiv 3\;[7]$ et $185 \equiv 5\;[9]$.
2. a) $x \equiv 3 \equiv 185\;[7]$ donc $7 \mid x - 185$ ; de même $9 \mid x - 185$.
   b) $7$ et $9$ sont premiers entre eux : si $7 \mid p$ et $9 \mid p$, alors $\text{PPCM}(7, 9) = 63$ divise $p$ (théorème de Gauss : $p = 7k$ et $9 \mid 7k$ donc $9 \mid k$).
   c) Par a) et b), $63 \mid x - 185$ : $x \equiv 185\;[63]$. (Réciproquement, tout $x = 185 + 63k$ est solution.)
3. $680 \leq 185 + 63k \leq 820 \iff 7{,}86 \leq k \leq 10{,}08 \iff k \in \{8 ; 9 ; 10\}$ : $x \in \{689 \,;\, 752 \,;\, 815\}$.
4. a) $N = 7q + 3$ et $N = 9q' + 5$ : $N \equiv 3\;[7]$ et $N \equiv 5\;[9]$.
   b) Parmi $689$, $752$, $815$, seul $689$ est entre $680$ et $750$ : **689 oranges**.

### Exercice 2
*Repère pour vérifier : $A(0;0)$, $B(6;0)$, $C(3;3\sqrt3)$, $I(4{,}5;1{,}5\sqrt3)$, $D(0;6\sqrt3)$, $\Omega(-6;0)$.*
1. Figure : triangle équilatéral direct, $I$ milieu de $[BC]$ (dans un triangle équilatéral, la hauteur est aussi médiane), $\Omega$ sur $(AB)$ à gauche de $A$, $D$ au-dessus de $A$ (car $\overrightarrow{AD} = \overrightarrow{AC} + \overrightarrow{BC}$, vertical).
2. a) $(AI) \perp (BC)$ et $(\Omega C) \parallel (AI)$. La composée de deux symétries d'axes parallèles est la translation de vecteur $2\overrightarrow{IC}$ (vecteur orthogonal aux axes, allant du premier au second axe). Or $2\overrightarrow{IC} = \overrightarrow{BC}$ : $t_{\overrightarrow{BC}} = S_{(\Omega C)} \circ S_{(AI)}$.
   b) $(AB)$ et $(AI)$ se coupent en $A$ et $(\overrightarrow{AB}, \overrightarrow{AI}) = \dfrac\pi6$ (la hauteur est bissectrice) : $S_{(AI)} \circ S_{(AB)} = r_{(A;\,2\times\frac\pi6)} = r_{(A;\,\frac\pi3)}$.
   c) $f = S_{(\Omega C)} \circ S_{(AI)} \circ S_{(AI)} \circ S_{(AB)} = S_{(\Omega C)} \circ S_{(AB)}$. Les droites $(AB)$ et $(\Omega C)$ se coupent en $\Omega$ avec un angle $(\overrightarrow{AB}, \overrightarrow{\Omega C}) = (\overrightarrow{AB}, \overrightarrow{AI}) = \dfrac\pi6$ : $f = r_{(\Omega;\,\frac\pi3)}$.
   d) $g$ est la composée de deux rotations d'angles $\dfrac\pi3$ et $-\dfrac\pi3$, de somme nulle : c'est une translation.
   e) $g(B) = f(B) = t_{\overrightarrow{BC}}\big(r_{(A;\frac\pi3)}(B)\big) = t_{\overrightarrow{BC}}(C) = D$ (car $ABC$ est équilatéral direct et $C$ est le milieu de $[BD]$). Donc $g = t_{\overrightarrow{BD}}$.
3. a) $\Omega_1D = 2\,\Omega_1A$ et l'angle en $\Omega_1$ mesure $\dfrac\pi3$. Al-Kashi : $AD^2 = \Omega_1A^2 + 4\Omega_1A^2 - 2\cdot\Omega_1A\cdot2\Omega_1A\cos\frac\pi3 = 3\,\Omega_1A^2$, donc $\Omega_1A^2 + AD^2 = 4\,\Omega_1A^2 = \Omega_1D^2$ : le triangle est rectangle en $A$ (et $\overrightarrow{A\Omega_1}\cdot\overrightarrow{AD} = 0$). L'angle $-\dfrac\pi3$ en $\Omega_1$ en fait un triangle de sens indirect.
   b) $\Omega_1$ est sur la perpendiculaire à $(AD)$ en $A$, c'est-à-dire sur $(AB)$, avec $A\Omega_1 = \dfrac{AD}{\tan(\pi/3)} = \dfrac{AD}{\sqrt3} = \dfrac{6\sqrt3}{\sqrt3} = 6 = AB$, du côté de $B$ (sens indirect) : **$\Omega_1 = B$**. Vérification en complexes : $z' = 2e^{-i\pi/3}(z - 6) + 6$ envoie $0$ sur $6 - 12e^{-i\pi/3} = 6\sqrt3\,i = z_D$.
   c) $S(B) = B$, donc $BI' = 2BI$ et $(\overrightarrow{BI}, \overrightarrow{BI'}) = -\dfrac\pi3$. Par le calcul, $I'(9 ; 3\sqrt3)$ (sur l'horizontale de $C$, à droite).
   d) $I(4{,}5 ; 1{,}5\sqrt3)$ est le milieu de $[AI']$ : $A$, $I$, $I'$ sont alignés. (Géométriquement : $BII'$ est rectangle en $I$ car $BI' = 2BI$ avec un angle de $60°$, donc $(II') \perp (BC)$, comme $(AI)$.)
4. a) $AB + AC = 2AC$ car $AB = AC$ : $A \in (E)$.
   b) $B$ et $C$ sont fixes et $2AC = 2BC > BC$ : par la définition bifocale, $(E)$ est l'ellipse de foyers $B$ et $C$, de grand axe $2a = 2BC$ ; l'axe focal est la droite $(BC)$.
   c) $a = BC$, $c = \dfrac{BC}{2}$ : $e = \dfrac ca = \dfrac12$. (Contrôle : $b = AI$ et $a^2 = b^2 + c^2 = \frac34BC^2 + \frac14BC^2$.)

### Exercice 3
1. a) $f'(x) = 2xe^{-x} - x^2e^{-x} = x(2 - x)e^{-x}$ : négatif sur $]-\infty ; 0[$, positif sur $]0 ; 2[$, négatif sur $]2 ; +\infty[$.
   b) $f$ décroît de $+\infty$ à $0$ sur $]-\infty ; 0]$, croît de $0$ à $f(2) = \dfrac4{e^2}$ sur $[0 ; 2]$, décroît de $\dfrac4{e^2}$ à $0$ sur $[2 ; +\infty[$.
   c) $f$ est croissante sur $[0 ; 1]$ : $0 = f(0) \leq f(x) \leq f(1) = \dfrac1e < 1$.
2. a) $F'(x) = (-2x - 2)e^{-x} - (-x^2 - 2x - 2)e^{-x} = x^2e^{-x} = f(x)$.
   b) $J = F(1) - F(0) = -\dfrac5e + 2 = 2 - \dfrac5e$.
3. a) Pour $x \in [0 ; 1]$, $u = f(x) \in [0 ; 1]$ : $1 - f(x) \leq \dfrac{1}{1 + f(x)} \leq 1 - \dfrac{f(x)}{2}$. On intègre sur $[0 ; 1]$ (bornes dans l'ordre croissant) : $1 - J \leq I \leq 1 - \dfrac J2$.
   b) $1 - J = \dfrac5e - 1$ et $1 - \dfrac J2 = \dfrac{5}{2e}$ : $\dfrac5e - 1 \leq I \leq \dfrac5{2e}$ (soit $0{,}839 \leq I \leq 0{,}920$).

### Exercice 4
1. Chaque numéro pair a la probabilité $p$, chaque impair $q$, avec $p = 2q$ et $3p + 3q = 1$ : $9q = 1$, d'où $q = \dfrac19$ et $p = \dfrac29$.
2. a) $C = \{2 ; 3 ; 5\}$.
   b) $p' = P(2) + P(3) + P(5) = \dfrac29 + \dfrac19 + \dfrac19 = \dfrac49$.
3. Les 4 lancers sont indépendants : $X$ suit la loi binomiale $\mathcal{B}\left(4 ; \tfrac49\right)$.
   a) $P(X = 1) = 4 \times \dfrac49 \times \left(\dfrac59\right)^3 = \dfrac{2\,000}{6\,561} \approx 0{,}305$.
   b) $P(X = 0) = \left(\dfrac59\right)^4 = \dfrac{625}{6\,561} \approx 0{,}095$.`,
}

const mathsD2024 = {
  title: 'Bac D 2024 — Mathématiques : nombres complexes et similitude, endomorphisme, fonction exp-ln, dé pipé',
  statement: R`**Baccalauréat — Session de juin 2024 — Série D — Mathématiques — Durée 4 h — Coefficient 4**

### Exercice 1 (5 points)
Le plan complexe est rapporté à un repère orthonormé $(O ; \vec u, \vec v)$. On désigne par $S$ l'application qui, à tout point $M(x ; y)$, associe le point $M'(x' ; y')$ tel que $\begin{cases} x' = -x - y + 2 \\ y' = x - y - 1 \end{cases}$
1. Déterminer l'affixe $z'$ de $M'$ en fonction de l'affixe $z$ de $M$.
2. On considère les points $A$, $B$, $C$ d'affixes $z_A = 1$, $z_B = -2 + i$ et $z_C = 3 - 4i$, et $u = \dfrac{z_A - z_C}{z_A - z_B}$.
   a) Déterminer la forme algébrique de $u$.
   b) Déterminer le module et un argument de $u$.
3. On considère la similitude plane directe $h$ qui laisse invariant $A$ et transforme $B$ en $C$.
   a) Montrer que $h$ a pour écriture complexe $z' = (i - 1)z + 2 - i$.
   b) En déduire l'angle $\theta$ et le rapport $k$ de $h$.

### Exercice 2 (5 points)
Le plan vectoriel $E$ est muni de la base $(\vec i, \vec j)$ ; $f$ est l'endomorphisme défini par $\begin{cases} x' = 10x + 4y \\ y' = -10x - 4y \end{cases}$
1. Déterminer $\ker f$.
2. Déterminer $\operatorname{Im} f$.
3. Soient $E_1$ et $E_2$ deux sous-espaces vectoriels de $E$ ; $\vec e_1 = -2\vec i + 5\vec j$ et $\vec e_2 = -\vec i + \vec j$.
   a) Montrer que $(\vec e_1, \vec e_2)$ est une base de $E$.
   b) Montrer que $E_1$ et $E_2$ sont supplémentaires dans $E$.
4. On donne $\vec e_3 = \vec i + 5\vec j$.
   a) Montrer que la famille $(\vec e_1, \vec e_2)$ est libre.
   b) Déterminer les réels $\alpha$ et $\beta$ tels que $\vec e_3 = \alpha\vec e_1 + \beta\vec e_2$.
5. On admet que $f(\vec e_1) = \vec 0$ et $f(\vec e_2) = \vec e_2$.
   a) Montrer que $f(\vec i) = 10\vec i - 10\vec j$ et $f(\vec j) = 4\vec i - 4\vec j$.
   b) En déduire la matrice de $f$ dans la base $(\vec i, \vec j)$.

### Exercice 3 (7 points)
On considère la fonction $f$ définie sur $\mathbb{R}$ par $f(x) = e^{1-x}$ si $x \leq 1$ et $f(x) = 1 - (x - 1)\ln(x - 1)$ si $x > 1$. $(C)$ est sa courbe dans un repère orthonormé (unité : 2 cm).
1. Calculer les limites de $f$ en $-\infty$ et en $+\infty$.
2. Étudier la continuité de $f$ en $1$.
3. Étudier la dérivabilité de $f$ en $1$ et interpréter géométriquement les résultats.
4. Calculer $f'(x)$ suivant les valeurs de $x$.
5. Étudier le signe de $f'(x)$.
6. Dresser le tableau de variation de $f$.
7. Montrer que l'équation $f(x) = 0$ admet une solution unique $\alpha$ et que $2{,}7 < \alpha < 2{,}8$.
8. Étudier les branches infinies de $(C)$.
9. Tracer $(C)$ ; on placera le point de $(C)$ d'abscisse $0$.

### Exercice 4 (3 points)
On jette un dé pipé à six faces numérotées de 1 à 6. On note $P_i$ la probabilité d'apparition de la face $i$, avec $P_1 = P_3$, $P_2 = P_4$, $P_5 = P_6 = 2P_1$ et $2P_1 = 3P_2$.
1. Montrer que $P_1 = \dfrac{3}{22}$.
2. $X$ est la variable aléatoire égale au numéro de la face obtenue.
   a) Déterminer la loi de probabilité de $X$.
   b) Montrer que $E(X) = \dfrac{45}{11}$.
   c) Calculer la variance $V(X)$.`,
  solution: R`### Exercice 1
1. $z' = x' + iy' = (-x - y + 2) + i(x - y - 1)$. Or $(-1 + i)(x + iy) = (-x - y) + i(x - y)$, donc $z' = (-1 + i)z + 2 - i$.
2. a) $u = \dfrac{1 - (3 - 4i)}{1 - (-2 + i)} = \dfrac{-2 + 4i}{3 - i} = \dfrac{(-2 + 4i)(3 + i)}{10} = \dfrac{-10 + 10i}{10} = -1 + i$.
   b) $|u| = \sqrt2$ et $u = \sqrt2\left(-\frac{\sqrt2}{2} + i\frac{\sqrt2}{2}\right)$ : $\arg u = \dfrac{3\pi}{4}$ $[2\pi]$.
3. a) $h : z' = az + b$. $h(A) = A$ et $h(B) = C$ donnent $a = \dfrac{z_C - z_A}{z_B - z_A} = \dfrac{2 - 4i}{-3 + i} = -1 + i$ (c'est $u$) et $b = z_A - az_A = 1 - (-1 + i) = 2 - i$. D'où $z' = (i - 1)z + 2 - i$ ; $h$ est l'application $S$ de la question 1.
   b) $k = |i - 1| = \sqrt2$ et $\theta = \arg(i - 1) = \dfrac{3\pi}{4}$.

### Exercice 2
1. $f(\vec u) = \vec 0 \iff 10x + 4y = 0 \iff y = -\dfrac52x$ : $\ker f = \text{Vect}(\vec e_1)$ avec $\vec e_1 = -2\vec i + 5\vec j$ (droite vectorielle).
2. $y' = -x'$ pour tout vecteur image : $\operatorname{Im} f = \text{Vect}(\vec i - \vec j) = \text{Vect}(\vec e_2)$ (droite ; dimension $2 - 1 = 1$).
3. a) $\det(\vec e_1, \vec e_2) = (-2)(1) - (5)(-1) = 3 \neq 0$ : base de $E$.
   b) On prend $E_1 = \ker f = \text{Vect}(\vec e_1)$ et $E_2 = \operatorname{Im} f = \text{Vect}(\vec e_2)$ (le sujet ne les précise pas). Comme $(\vec e_1, \vec e_2)$ est une base, $E_1 \cap E_2 = \{\vec 0\}$ et $E_1 + E_2 = E$ : ils sont supplémentaires.
4. a) Déterminant non nul : famille libre.
   b) $\alpha\vec e_1 + \beta\vec e_2 = (-2\alpha - \beta)\vec i + (5\alpha + \beta)\vec j = \vec i + 5\vec j$ : en additionnant, $3\alpha = 6$, d'où $\alpha = 2$ et $\beta = -5$.
5. ⚠️ Le sujet imprimé indique $f(\vec e_2) = \vec e_2$, mais la définition de $f$ donne $f(\vec e_2) = f(-\vec i + \vec j) = (-10 + 4)\vec i + (10 - 4)\vec j = 6\vec e_2$. C'est cette valeur qui conduit aux résultats demandés.
   a) De $\vec e_2 = -\vec i + \vec j$ et $\vec e_1 = -2\vec i + 5\vec j$, on tire $\vec i = \dfrac{\vec e_1 - 5\vec e_2}{3}$ et $\vec j = \dfrac{\vec e_1 - 2\vec e_2}{3}$. Alors $f(\vec i) = \dfrac{-5 \times 6\vec e_2}{3} = -10\vec e_2 = 10\vec i - 10\vec j$ et $f(\vec j) = \dfrac{-2 \times 6\vec e_2}{3} = -4\vec e_2 = 4\vec i - 4\vec j$. (Directement : $f(\vec i) = (10 ; -10)$ et $f(\vec j) = (4 ; -4)$ d'après la définition.)
   b) $M = \begin{pmatrix} 10 & 4 \\ -10 & -4 \end{pmatrix}$.

### Exercice 3
1. $\lim\limits_{-\infty} f = \lim e^{1-x} = +\infty$ ; en $+\infty$, $(x - 1)\ln(x - 1) \to +\infty$, donc $\lim\limits_{+\infty} f = -\infty$.
2. $f(1) = e^0 = 1$ ; à droite, $(x - 1)\ln(x - 1) \to 0$ (croissances comparées), donc $\lim\limits_{1^+} f = 1 = f(1)$ : $f$ est continue en $1$.
3. À gauche : $\dfrac{e^{1-x} - 1}{x - 1} \to -1$ (dérivée de $e^{1-x}$ en $1$) : $f'_g(1) = -1$, demi-tangente de pente $-1$ : $y = -x + 2$.
   À droite : $\dfrac{f(x) - 1}{x - 1} = -\ln(x - 1) \to +\infty$ : $f$ n'est pas dérivable à droite en $1$ ; $(C)$ admet une demi-tangente **verticale** (dirigée vers le haut). $f$ n'est pas dérivable en $1$ : $(C)$ présente un **point anguleux**.
4. Si $x < 1$ : $f'(x) = -e^{1-x}$. Si $x > 1$ : $f'(x) = -\ln(x - 1) - 1$.
5. Si $x < 1$ : $f'(x) < 0$. Si $x > 1$ : $f'(x) > 0 \iff \ln(x - 1) < -1 \iff x < 1 + \dfrac1e$ ; $f'(x) < 0$ pour $x > 1 + \dfrac1e$.
6. $f$ décroît de $+\infty$ à $1$ sur $]-\infty ; 1]$, croît de $1$ à $f\!\left(1 + \frac1e\right) = 1 + \frac1e \approx 1{,}37$ sur $\left[1 ; 1 + \frac1e\right]$, puis décroît vers $-\infty$.
7. Sur $\left]-\infty ; 1 + \frac1e\right]$, $f \geq 1 > 0$ : pas de solution. Sur $\left[1 + \frac1e ; +\infty\right[$, $f$ est continue, strictement décroissante, de $1 + \frac1e$ à $-\infty$ : une solution unique $\alpha$. $f(2{,}7) = 1 - 1{,}7\ln1{,}7 \approx 0{,}098 > 0$ et $f(2{,}8) = 1 - 1{,}8\ln1{,}8 \approx -0{,}058 < 0$ : $2{,}7 < \alpha < 2{,}8$.
8. En $-\infty$ : $\dfrac{f(x)}{x} = \dfrac{e^{1-x}}{x} \to -\infty$ : branche parabolique de direction $(Oy)$. En $+\infty$ : $\dfrac{f(x)}{x} = \dfrac1x - \dfrac{x-1}{x}\ln(x - 1) \to -\infty$ : branche parabolique de direction $(Oy)$.
9. Points utiles : $(0 ; e) \approx (0 ; 2{,}72)$, $(1 ; 1)$ avec les deux demi-tangentes, le maximum local $\left(1{,}37 ; 1{,}37\right)$, $(\alpha ; 0)$ avec $\alpha \approx 2{,}75$.

### Exercice 4
1. Posons $P_1 = P_3 = a$ ; alors $P_2 = P_4 = \dfrac{2a}{3}$ et $P_5 = P_6 = 2a$. Somme : $2a + \dfrac{4a}{3} + 4a = \dfrac{22a}{3} = 1$, d'où $P_1 = \dfrac{3}{22}$.
2. a) Loi de $X$ :

| $x_i$ | 1 | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|---|
| $P(X = x_i)$ | $\frac{3}{22}$ | $\frac{2}{22}$ | $\frac{3}{22}$ | $\frac{2}{22}$ | $\frac{6}{22}$ | $\frac{6}{22}$ |

   b) $E(X) = \dfrac{3 + 4 + 9 + 8 + 30 + 36}{22} = \dfrac{90}{22} = \dfrac{45}{11}$.
   c) $E(X^2) = \dfrac{3 + 8 + 27 + 32 + 150 + 216}{22} = \dfrac{436}{22} = \dfrac{218}{11}$ ; $V(X) = \dfrac{218}{11} - \left(\dfrac{45}{11}\right)^2 = \dfrac{2\,398 - 2\,025}{121} = \dfrac{373}{121} \approx 3{,}08$.`,
}

const mathsDBlanc2026 = {
  title: 'Bac blanc zonal mai 2026 (zone 8, Pool) — Mathématiques série D : complexes et similitude, endomorphisme, fonction exponentielle, régression',
  statement: R`**Inspection des lycées d'enseignement général, zone 8 (Pool / Djoué-Léfini) — Baccalauréat blanc zonal, session de mai 2026 — Série D — Mathématiques — Durée 4 h — Coefficient 4**

### Exercice 1 (5 points)
Le plan est muni d'un repère orthonormé direct $(O ; \vec u, \vec v)$ (unité : 2 cm).
1. Déterminer les racines carrées du nombre complexe $U = 8 - 6i$.
2. On considère le polynôme $p(z) = z^3 + (-1 + i)z^2 + (2 + 2i)z + 8i$.
   a) Démontrer que $p(z)$ admet une unique racine imaginaire pure $ai$ à déterminer.
   b) Déterminer les complexes $a$, $b$, $c$ tels que $p(z) = (z - 2i)(az^2 + bz + c)$.
   c) Résoudre dans $\mathbb{C}$ l'équation $p(z) = 0$.
3. On donne les points $A$, $B$, $C$ d'affixes $z_A = -1 - i$, $z_B = 2 - 2i$ et $z_C = 2i$.
   a) Placer les points $A$, $B$ et $C$.
   b) Calculer $\dfrac{z_C - z_A}{z_B - z_A}$. En déduire la nature du triangle $ABC$.
   c) Déterminer l'affixe du point $D$ tel que $ABCD$ soit un parallélogramme.
4. Soit $g$ la similitude plane directe de centre $A$ qui transforme $B$ en $D$.
   a) Montrer que l'écriture complexe de $g$ est $z' = (-1 + i)z - 3 - i$.
   b) Déterminer le rapport $k$ et une mesure de l'angle $\theta$ de $g$.
   c) Soit $E = g(C)$. Construire l'image $ADE$ du triangle $ABC$ par $g$.

### Exercice 2 (5 points)
L'espace vectoriel réel $E$ est rapporté à sa base canonique $(\vec i, \vec j)$. On considère l'endomorphisme $f$ défini par $f(\vec i) = 2\vec i - 3\vec j$ et $f(\vec j) = \vec i - 2\vec j$.
1. a) Donner la matrice $M$ de $f$ dans la base canonique.
   b) En déduire l'expression analytique de $f$.
   c) Soit $\vec u = x\vec i + y\vec j$. Montrer que $f \circ f(\vec u) = \vec u$.
   d) En déduire la nature de $f$.
2. On pose $\vec e_1 = \vec i - \vec j$ et $\vec e_2 = \vec i - 3\vec j$.
   a) Montrer que $(\vec e_1, \vec e_2)$ est une base de $E$.
   b) Déterminer $f(\vec e_1)$ et $f(\vec e_2)$ dans la base $(\vec e_1, \vec e_2)$.
   c) Écrire la matrice $N$ de $f$ dans la base $(\vec e_1, \vec e_2)$.
3. Déterminer les éléments caractéristiques (base et direction) de $f$.

### Exercice 3 (7 points)
**Partie A.** Soit $g$ la fonction définie sur $\mathbb{R}$ par $g(x) = (2 - x)e^x - 2$.
1. Calculer les limites de $g$ en $-\infty$ et en $+\infty$.
2. Déterminer $g'(x)$, puis dresser le tableau de variation de $g$.
3. a) Calculer $g(0)$ et montrer que l'équation $g(x) = 0$ admet sur $]1 ; 2[$ une solution unique $\alpha$.
   b) En déduire le signe de $g(x)$ sur $\mathbb{R}$.

**Partie B.** On considère la fonction $f$ définie sur $\mathbb{R}$ par $f(x) = \dfrac{x^2}{e^x - 1}$ si $x \neq 0$ et $f(0) = 0$ ; $(\mathscr{C})$ est sa courbe (unité : 2 cm).
1. Montrer que $f$ est continue et dérivable en $0$.
2. Démontrer que, pour tout $x \neq 0$, $f'(x) = \dfrac{x\,g(x)}{(e^x - 1)^2}$.
3. Montrer que $f(\alpha) = \alpha(2 - \alpha)$.
4. a) Préciser le signe de $f'(x)$ sur $\mathbb{R}$.
   b) On admet que $\lim\limits_{-\infty} f = -\infty$ et $\lim\limits_{+\infty} f = 0$. Dresser le tableau de variation de $f$.
5. Étudier les branches infinies de $(\mathscr{C})$.
6. Tracer $(\mathscr{C})$ (on prendra $\alpha = 1{,}6$).

**Partie C.** Soit $h$ la restriction de $f$ à l'intervalle $I = ]-\infty ; \alpha]$.
1. Montrer que $h$ réalise une bijection de $I$ sur un intervalle $J$ à préciser.
2. Dresser le tableau de variation de $h^{-1}$, la bijection réciproque de $h$.
3. Tracer la courbe $(\mathscr{C}')$ de $h^{-1}$ dans le même repère que $(\mathscr{C})$.

### Exercice 4 (3 points)
On considère la série statistique à deux variables suivante :

| $x_i$ | 1,2 | 1,4 | 1,6 | 1,8 | 2 |
|---|---|---|---|---|---|
| $y_i$ | 13 | 12 | 14 | 16 | $a$ |

Par la méthode des moindres carrés, on a obtenu la droite de régression de $y$ en $x$ : $y = 9x + 0{,}6$.
1. a) Calculer la moyenne $\overline X$ et la variance $V(x)$ des $x_i$.
   b) En déduire la covariance $\text{cov}(x, y)$.
2. a) Exprimer la moyenne $\overline Y$ des $y_i$ en fonction de $a$.
   b) En déduire la valeur de $a$.
   c) Calculer la variance $V(y)$ des $y_i$.
3. Calculer le coefficient de corrélation linéaire $r$.`,
  solution: R`### Exercice 1
1. $(x + iy)^2 = 8 - 6i \iff x^2 - y^2 = 8$, $2xy = -6$ et $x^2 + y^2 = |U| = 10$. D'où $x^2 = 9$, $y^2 = 1$, $xy < 0$ : les racines carrées sont $3 - i$ et $-3 + i$.
2. a) $p(ai) = -a^3i - a^2(-1 + i) + (2 + 2i)ai + 8i = (a^2 - 2a) + i(-a^3 - a^2 + 2a + 8)$. Partie réelle nulle : $a = 0$ ou $a = 2$ ; partie imaginaire : $a = 0$ donne $8 \neq 0$, $a = 2$ donne $-8 - 4 + 4 + 8 = 0$. Unique racine imaginaire pure : $2i$.
   b) $(z - 2i)(az^2 + bz + c) = az^3 + (b - 2ia)z^2 + (c - 2ib)z - 2ic$. Par identification : $a = 1$ ; $b - 2i = -1 + i$ donc $b = -1 + 3i$ ; $-2ic = 8i$ donc $c = -4$ (contrôle : $c - 2ib = -4 + 2i + 6 = 2 + 2i$ ✓).
   c) $z^2 + (-1 + 3i)z - 4 = 0$ : $\Delta = (-1 + 3i)^2 + 16 = 8 - 6i = U = (3 - i)^2$. Racines : $\dfrac{1 - 3i + 3 - i}{2} = 2 - 2i$ et $\dfrac{1 - 3i - 3 + i}{2} = -1 - i$.
   $S = \{2i \,;\, 2 - 2i \,;\, -1 - i\}$.
3. a) $A(-1 ; -1)$, $B(2 ; -2)$, $C(0 ; 2)$.
   b) $\dfrac{z_C - z_A}{z_B - z_A} = \dfrac{1 + 3i}{3 - i} = \dfrac{(1 + 3i)(3 + i)}{10} = \dfrac{10i}{10} = i$. Donc $AC = AB$ et $(\overrightarrow{AB}, \overrightarrow{AC}) = \dfrac\pi2$ : $ABC$ est **rectangle isocèle en $A$**.
   c) $ABCD$ parallélogramme $\iff \overrightarrow{AD} = \overrightarrow{BC} \iff z_D = z_A + z_C - z_B = -3 + 3i$.
4. a) On vérifie : $(-1 + i)(-1 - i) - 3 - i = 2 - 3 - i = -1 - i = z_A$ ($A$ invariant) et $(-1 + i)(2 - 2i) - 3 - i = 4i - 3 - i = -3 + 3i = z_D$. Une similitude directe est déterminée par l'image de deux points : c'est $g$.
   b) $k = |-1 + i| = \sqrt2$ ; $\theta = \arg(-1 + i) = \dfrac{3\pi}{4}$.
   c) $z_E = (-1 + i)(2i) - 3 - i = -2 - 2i - 3 - i = -5 - 3i$. L'image de $ABC$ est $ADE$, rectangle isocèle en $A$ (une similitude conserve les angles et multiplie les longueurs par $\sqrt2$).

### Exercice 2
1. a) $M = \begin{pmatrix} 2 & 1 \\ -3 & -2 \end{pmatrix}$.
   b) $f(\vec u) = x'\vec i + y'\vec j$ avec $x' = 2x + y$ et $y' = -3x - 2y$.
   c) $f \circ f(\vec u)$ : $x'' = 2(2x + y) + (-3x - 2y) = x$ et $y'' = -3(2x + y) - 2(-3x - 2y) = y$. Donc $f \circ f = \text{id}_E$ ($M^2 = I_2$).
   d) $f$ est involutive et différente de $\pm\text{id}$ : c'est une **symétrie vectorielle**.
2. a) $\det(\vec e_1, \vec e_2) = 1 \times (-3) - (-1) \times 1 = -2 \neq 0$ : base.
   b) $f(\vec e_1) = f(\vec i) - f(\vec j) = (2\vec i - 3\vec j) - (\vec i - 2\vec j) = \vec i - \vec j = \vec e_1$.
   $f(\vec e_2) = f(\vec i) - 3f(\vec j) = 2\vec i - 3\vec j - 3\vec i + 6\vec j = -\vec i + 3\vec j = -\vec e_2$.
   c) $N = \begin{pmatrix} 1 & 0 \\ 0 & -1 \end{pmatrix}$.
3. $f$ est la symétrie de **base** $\text{Vect}(\vec e_1)$ (vecteurs invariants, droite $y = -x$) et de **direction** $\text{Vect}(\vec e_2)$ (vecteurs changés en leurs opposés, droite $y = -3x$).

### Exercice 3
**Partie A**
1. En $-\infty$ : $xe^x \to 0$ et $e^x \to 0$, donc $g \to -2$. En $+\infty$ : $(2 - x)e^x \to -\infty$, donc $g \to -\infty$.
2. $g'(x) = -e^x + (2 - x)e^x = (1 - x)e^x$ : $g$ croît sur $]-\infty ; 1]$ de $-2$ à $g(1) = e - 2 \approx 0{,}72$, puis décroît sur $[1 ; +\infty[$ vers $-\infty$.
3. a) $g(0) = 2 - 2 = 0$. Sur $]1 ; 2[$, $g$ est continue, strictement décroissante, avec $g(1) = e - 2 > 0$ et $g(2) = -2 < 0$ : une solution unique $\alpha$.
   b) $g(x) < 0$ sur $]-\infty ; 0[$ ; $g(0) = 0$ ; $g(x) > 0$ sur $]0 ; \alpha[$ ; $g(\alpha) = 0$ ; $g(x) < 0$ sur $]\alpha ; +\infty[$.

**Partie B**
1. Au voisinage de $0$, $e^x - 1 \sim x$, donc $f(x) \sim x \to 0 = f(0)$ : $f$ est continue en $0$. Puis $\dfrac{f(x) - f(0)}{x} = \dfrac{x}{e^x - 1} \to 1$ : $f$ est dérivable en $0$ et $f'(0) = 1$.
2. $f'(x) = \dfrac{2x(e^x - 1) - x^2e^x}{(e^x - 1)^2} = \dfrac{x\left[(2 - x)e^x - 2\right]}{(e^x - 1)^2} = \dfrac{x\,g(x)}{(e^x - 1)^2}$.
3. $g(\alpha) = 0 \Rightarrow e^\alpha = \dfrac{2}{2 - \alpha} \Rightarrow e^\alpha - 1 = \dfrac{\alpha}{2 - \alpha}$, d'où $f(\alpha) = \dfrac{\alpha^2(2 - \alpha)}{\alpha} = \alpha(2 - \alpha)$.
4. a) $f'(x)$ a le signe de $x\,g(x)$ : positif sur $]-\infty ; 0[$ (deux facteurs négatifs) et sur $]0 ; \alpha[$, nul en $\alpha$, négatif sur $]\alpha ; +\infty[$ ; et $f'(0) = 1 > 0$.
   b) $f$ croît de $-\infty$ à $f(\alpha) = \alpha(2 - \alpha) \approx 0{,}64$ sur $]-\infty ; \alpha]$, puis décroît vers $0$ sur $[\alpha ; +\infty[$.
5. En $+\infty$ : $\lim f = 0$, asymptote horizontale $y = 0$. En $-\infty$ : $\dfrac{f(x)}{x} = \dfrac{x}{e^x - 1} \to +\infty$ (car $e^x - 1 \to -1$) : branche parabolique de direction $(Oy)$.
6. Tracé : courbe passant par $O$ avec la tangente $y = x$, maximum en $(1{,}6 ; 0{,}64)$, puis se rapprochant de l'axe des abscisses par valeurs positives.

**Partie C**
1. $h$ est continue et strictement croissante sur $I = ]-\infty ; \alpha]$ : bijection de $I$ sur $J = ]-\infty ; \alpha(2 - \alpha)]$.
2. $h^{-1}$ est strictement croissante sur $J$, de $-\infty$ à $\alpha$.
3. $(\mathscr{C}')$, courbe de $h^{-1}$, est la symétrique de la partie de $(\mathscr{C})$ correspondant à $I$ par rapport à la droite $y = x$ (elle passe par $O$, tangente à $y = x$, et se termine au point $(\alpha(2 - \alpha) ; \alpha)$).

### Exercice 4
1. a) $\overline X = \dfrac{1{,}2 + 1{,}4 + 1{,}6 + 1{,}8 + 2}{5} = 1{,}6$ ; $V(x) = \dfrac{1{,}44 + 1{,}96 + 2{,}56 + 3{,}24 + 4}{5} - 1{,}6^2 = 2{,}64 - 2{,}56 = 0{,}08$.
   b) La pente de la droite de régression est $\dfrac{\text{cov}(x, y)}{V(x)} = 9$, d'où $\text{cov}(x, y) = 9 \times 0{,}08 = 0{,}72$.
2. a) $\overline Y = \dfrac{13 + 12 + 14 + 16 + a}{5} = \dfrac{55 + a}{5}$.
   b) La droite passe par le point moyen : $\overline Y = 9 \times 1{,}6 + 0{,}6 = 15$, d'où $55 + a = 75$ et $a = 20$.
   c) $V(y) = \dfrac{169 + 144 + 196 + 256 + 400}{5} - 15^2 = 233 - 225 = 8$.
3. $r = \dfrac{\text{cov}(x, y)}{\sqrt{V(x)V(y)}} = \dfrac{0{,}72}{\sqrt{0{,}08 \times 8}} = \dfrac{0{,}72}{0{,}8} = 0{,}9$ : bonne corrélation linéaire.`,
}

// ─────────────────────────────── SCIENCES PHYSIQUES ───────────────────────────────

const spCBlanc2026Chimie = {
  title: 'Bac blanc zonal mai 2026 (zone 3, Owando) — Chimie série C : QCM, dichromate et éthanal, cinétique de l’eau oxygénée',
  statement: R`**Inspection des lycées d'enseignement général, zone 3 (Cuvette / Cuvette-Ouest / Congo-Oubangui) — Baccalauréat blanc zonal, session de mai 2026 — Sciences physiques, série C — Durée 4 h — Coefficient 5 — Partie CHIMIE (8 points)**

### Partie A : vérification des connaissances (4 points)
1. **Choix multiple.**
   a) L'énergie de liaison par nucléon des noyaux stables est : a.1) égale à 8 MeV/nucléon ; a.2) supérieure à 8 MeV/nucléon ; a.3) inférieure à 8 MeV/nucléon.
   b) La désintégration radioactive obéit à une cinétique d'ordre : b.1) deux ; b.2) nul ; b.3) un ; b.4) trois.
   c) L'acide sulfurique employé à faible dose au cours d'une estérification permet : c.1) de modifier la composition du mélange réactionnel ; c.2) d'accélérer la réaction ; c.3) d'augmenter le rendement de la réaction.
   d) Dans l'état fondamental, l'énergie de l'atome d'hydrogène est : d.1) 0 eV ; d.2) 13,6 eV ; d.3) −13,6 eV.
2. **Équation à écrire.** Écrire l'équation bilan de la réaction d'oxydoréduction entre les couples $\text{Cr}_2\text{O}_7^{2-}/\text{Cr}^{3+}$ ($E^0 = 1{,}33$ V) et $\text{C}_2\text{H}_4\text{O}_2/\text{C}_2\text{H}_4\text{O}$ ($E^0 = 0{,}03$ V).
3. **Texte à trous.** Complète avec : point d'équivalence, colorimétrique, couleur, acido-basique, l'indicateur coloré.
« Un dosage ……… est une réaction ……… dont le ……… est signalé par le changement de ……… de ……… utilisé. »
4. **Question à réponse construite.** Quelle différence y a-t-il entre une réaction totale et une réaction équilibrée ? (Donner un exemple dans chaque cas.)

### Partie B : application des connaissances (4 points)
1. Définis : catalyseur, catalyse homogène, catalyse hétérogène.
2. On étudie la décomposition catalytique de l'eau oxygénée dans un ballon maintenu à température constante : $2\,\text{H}_2\text{O}_2 \to 2\,\text{H}_2\text{O} + \text{O}_2$. À $t = 0$, la solution contient $0{,}01$ mol d'eau oxygénée et occupe un volume de $1$ L. On mesure le volume de dioxygène dégagé (volume molaire : $24$ L/mol) :

| $t$ (min) | 0 | 5 | 10 | 15 | 25 | 35 | 55 | 75 |
|---|---|---|---|---|---|---|---|---|
| $V_{\text{O}_2}$ (cm³) | 0 | 15,0 | 28,0 | 39,4 | 57,6 | 71,6 | 90,4 | 101,2 |

   a) Déduis des volumes mesurés les concentrations $C$ de l'eau oxygénée restante (tableau).
   b) Dans le même tableau, calcule $\dfrac{C_0}{C}$ et $\log\dfrac{C_0}{C}$.
   c) Montre graphiquement que la réaction est d'ordre 1 (échelle : 1 cm pour 5 min ; 1 cm pour 0,1).
   d) Calcule la constante de vitesse $k$ puis écris l'équation de vitesse intégrée.
3. a) Calcule la concentration de l'eau oxygénée restante à $t = 18$ min.
   b) Calcule la vitesse de la réaction à cette date.
   c) Déduis-en la vitesse de disparition de l'eau oxygénée (en mol·L⁻¹·min⁻¹).`,
    solution: R`### Partie A
1. a) **a.2** : pour les noyaux stables, l'énergie de liaison par nucléon est élevée (environ 8 à 8,8 MeV/nucléon, maximum vers le fer). b) **b.3** (ordre un : $N = N_0e^{-\lambda t}$). c) **c.2** : catalyseur, il accélère sans modifier le rendement. d) **d.3**.
2. $\text{Cr}_2\text{O}_7^{2-} + 14\,\text{H}^+ + 6e^- \to 2\,\text{Cr}^{3+} + 7\,\text{H}_2\text{O}$ et $\text{C}_2\text{H}_4\text{O} + \text{H}_2\text{O} \to \text{C}_2\text{H}_4\text{O}_2 + 2\,\text{H}^+ + 2e^-$ (×3) :
$$\text{Cr}_2\text{O}_7^{2-} + 3\,\text{C}_2\text{H}_4\text{O} + 8\,\text{H}^+ \longrightarrow 2\,\text{Cr}^{3+} + 3\,\text{C}_2\text{H}_4\text{O}_2 + 4\,\text{H}_2\text{O}$$
   (l'ion dichromate, oxydant le plus fort, oxyde l'éthanal en acide éthanoïque).
3. « Un dosage **colorimétrique** est une réaction **acido-basique** dont le **point d'équivalence** est signalé par le changement de **couleur** de **l'indicateur coloré** utilisé. »
4. Une réaction **totale** se poursuit jusqu'à disparition d'au moins un réactif (une seule flèche) : acide fort + base forte, saponification d'un ester. Une réaction **équilibrée** (limitée) s'arrête avant : réactifs et produits coexistent, les deux sens se compensent ($\rightleftharpoons$) : estérification, dissociation d'un acide faible dans l'eau.

### Partie B
1. Un **catalyseur** est une substance qui accélère une réaction sans figurer dans le bilan (on la retrouve intacte à la fin). Catalyse **homogène** : catalyseur et réactifs dans la même phase (ions $\text{Fe}^{3+}$ en solution). Catalyse **hétérogène** : phases différentes (platine solide avec des réactifs en solution ou gazeux).
2. a) $n(\text{O}_2) = \dfrac{V}{24\,000}$ (V en cm³) et $n(\text{H}_2\text{O}_2)_{\text{disparu}} = 2n(\text{O}_2)$, d'où $C = 0{,}01 - \dfrac{2V}{24\,000}$ (mol/L, car $V_{\text{sol}} = 1$ L).
   b)

| $t$ (min) | 0 | 5 | 10 | 15 | 25 | 35 | 55 | 75 |
|---|---|---|---|---|---|---|---|---|
| $C$ ($10^{-3}$ mol/L) | 10,0 | 8,75 | 7,67 | 6,72 | 5,20 | 4,03 | 2,47 | 1,57 |
| $C_0/C$ | 1 | 1,14 | 1,30 | 1,49 | 1,92 | 2,48 | 4,05 | 6,38 |
| $\log(C_0/C)$ | 0 | 0,058 | 0,115 | 0,173 | 0,284 | 0,394 | 0,608 | 0,805 |

   c) Les points $\left(t ; \log\frac{C_0}{C}\right)$ sont pratiquement alignés sur une droite passant par l'origine : $\log\dfrac{C_0}{C} = at$, soit $C = C_0e^{-2{,}3at}$ : c'est la loi d'une réaction **d'ordre 1**.
   d) Pente : $a \approx 0{,}011$ min⁻¹, d'où $\ln\dfrac{C_0}{C} = 2{,}3\,a\,t \approx 0{,}025\,t$.
   Avec $v = -\dfrac12\dfrac{dC}{dt} = kC$ (coefficient 2 de $\text{H}_2\text{O}_2$) : $\ln\dfrac{C_0}{C} = 2kt$, donc $k \approx \mathbf{1{,}3\times10^{-2}}$ **min⁻¹** et $C = 0{,}01\,e^{-0{,}025\,t}$.
   (Si l'on définit la vitesse sans le coefficient, on trouve $k \approx 2{,}5\times10^{-2}$ min⁻¹.)
3. a) $C(18) = 0{,}01\,e^{-0{,}025\times18} \approx \mathbf{6{,}4\times10^{-3}}$ **mol/L** (cohérent avec le tableau entre 15 et 25 min).
   b) $v = kC \approx 1{,}25\times10^{-2} \times 6{,}4\times10^{-3} \approx \mathbf{8\times10^{-5}}$ **mol·L⁻¹·min⁻¹**.
   c) $v_{\text{disp}}(\text{H}_2\text{O}_2) = 2v \approx \mathbf{1{,}6\times10^{-4}}$ **mol·L⁻¹·min⁻¹**.`,
}

const spCBlanc2026Physique = {
  title: 'Bac blanc zonal mai 2026 (zone 3, Owando) — Physique série C : électron dans un champ, ressort en rotation, fentes de Young et lumière blanche',
  pages: p('sp-c-blanc-2026-z3', 2, 3, 4),
  statement: R`**Inspection des lycées d'enseignement général, zone 3 — Baccalauréat blanc zonal, session de mai 2026 — Sciences physiques, série C — Partie PHYSIQUE (12 points)** (schémas sur les pages scannées)

### Partie A : vérification des connaissances (3 points)
1. **Schéma à compléter.** Entre deux plaques horizontales A (en haut) et B (en bas), le champ $\vec E$ est vertical, dirigé vers le haut. Un électron entre en O avec une vitesse horizontale $\vec V_0$ et frappe un écran en I. Indique la polarité des plaques et l'allure de la trajectoire entre O et I.
2. **Vrai ou faux.**
   1) La propagation d'un ébranlement et le déplacement d'un mobile sont deux phénomènes physiques identiques.
   2) Un phénomène périodique est forcément un phénomène vibratoire.
   3) Le théorème du centre d'inertie permet de décrire le mouvement de tous les points d'un solide.
   4) L'effet photoélectrique est l'émission d'électrons par des métaux portés à une température suffisamment élevée.
3. **Appariement.**

| Colonne A | Colonne B |
|---|---|
| A.1 Distance séparant deux hyperboles consécutives de même nature | B.1 $E_{c\max} = eU_0$ |
| A.2 Position des points de la corde vibrant en quadrature retard par rapport à la source | B.2 $d = \dfrac\lambda2$ |
| A.3 La formule des cordes vibrantes | B.3 $x_k = (4k + 1)\dfrac\lambda4$ |
| A.4 La différence de marche des hyperboles de mouvement nul | B.4 $d_2 - d_1 = (2k + 1)\dfrac\lambda2$ |
| A.5 L'énergie cinétique maximale de sortie des électrons de la cathode | B.5 $l = \dfrac{n}{2N}\sqrt{\dfrac F\mu}$ |

### Partie B : application des connaissances (4 points)
Une glissière T, soudée à un bâti mobile autour d'un axe vertical $(\Delta)$, est inclinée d'un angle $\theta$ par rapport à la verticale. Un solide S de masse $m$, ponctuel, posé sur la glissière, peut glisser sans frottement ; il est accroché à un ressort de raideur $k$ et de longueur à vide $l_0 = 20$ cm, dont l'autre extrémité est fixée en O sur l'axe (le ressort est le long de la glissière, S en dessous de O).
1. Le système est immobile. L'allongement du ressort est $10$ cm pour $\theta = 60°$ et $m = 200$ g. Calculer $k$ et la réaction $\vec R_1$ de la glissière sur S ($g = 10$ m/s²).
2. Le système tourne autour de $(\Delta)$ à la vitesse angulaire constante $\omega$.
   a) Déterminer la longueur $l_2$ du ressort et la réaction $\vec R_2$ lorsque S a atteint sa position d'équilibre. A.N. : $\omega = 4$ rad/s.
   b) Montrer que S décolle de la glissière lorsque $\omega$ dépasse une valeur $\omega_0$ que l'on calculera.

### Partie C : résolution d'un problème (5 points)
Dans le dispositif des fentes de Young, deux fentes fines $F_1$ et $F_2$, parallèles, distantes de $a$, sont percées dans une plaque opaque P et éclairées par une fente S équidistante de $F_1$ et $F_2$. L'écran E est à la distance $D$ de P ; H est l'intersection du plan médiateur avec l'écran et O le point de H dans le plan de la figure.
1. S est éclairée par une lumière monochromatique de longueur d'onde $\lambda$.
   a) Décrire le phénomène visible sur l'écran.
   b) Représenter l'aspect de l'écran ; préciser ce qui se passe sur H, au voisinage de O.
   c) Définir l'interfrange, donner son expression en fonction de $a$, $D$ et $\lambda$. A.N. : $a = 0{,}80$ mm ; $D = 2{,}00$ m ; $\lambda = 0{,}560$ µm.
2. On recouvre la fente $F_1$, côté écran, d'une lame de verre à faces parallèles L, d'indice $n$ et d'épaisseur faible $e_0$, placée parallèlement à P.
   a) Calculer la nouvelle différence de marche $\delta$ au point O.
   b) On augmente progressivement l'épaisseur de la lame ($n$ constant) ; les franges se déplacent.
   b.1) Exprimer la différence de marche $\delta'$ en un point P' tel que $OP' = x$ lorsque l'épaisseur vaut $e$.
   b.2) Le système de franges s'est déplacé de $x$ quand l'épaisseur vaut $e$ : exprimer $e$ en fonction de $a$, $D$, $n$ et $x$ (frange centrale : $\delta' = 0$).
   b.3) Indiquer, en le justifiant, le sens du déplacement des franges quand l'épaisseur augmente.
3. On supprime la lame et on remplace la source par une lumière blanche (longueurs d'onde de $0{,}400$ µm à $0{,}756$ µm).
   a) Qu'observe-t-on sur l'écran ?
   b) On place la fente d'un spectroscope suivant la droite H', parallèle à H, à la distance $x = 15$ mm de O.
   b.1) Déterminer le nombre de cannelures sombres.
   b.2) En déduire les longueurs d'onde correspondant à toutes les cannelures.`,
    solution: R`### Partie A
1. $\vec E$ va de la plaque positive vers la négative : **B positive, A négative**. L'électron subit $\vec F = -e\vec E$, vers le bas (vers B) : trajectoire parabolique entre les plaques, incurvée vers B, puis rectiligne jusqu'à l'écran (au-dessous de l'axe si l'on mesure à partir de O).
2. 1) **Faux** : un ébranlement transporte de l'énergie sans transport de matière, un mobile se déplace. 2) **Faux** (ex. : rotation uniforme d'une roue). 3) **Faux** : il ne décrit que le mouvement du centre d'inertie. 4) **Faux** : c'est l'émission thermoélectronique ; l'effet photoélectrique est provoqué par la lumière.
3. A.1 = B.2 ; A.2 = B.3 ; A.3 = B.5 ; A.4 = B.4 ; A.5 = B.1.

### Partie B
On projette sur la direction de la glissière (orientée de S vers O, faisant l'angle $\theta$ avec la verticale) et sur la normale.
1. À l'équilibre (forces : poids, tension $T = k\Delta l$ selon la glissière, réaction $R$ normale) : $k\Delta l = mg\cos\theta$, d'où $k = \dfrac{0{,}2 \times 10 \times 0{,}5}{0{,}10} = \mathbf{10}$ **N/m**. Normale : $R_1 = mg\sin\theta = 2 \times 0{,}866 \approx \mathbf{1{,}73}$ **N**.
2. a) S décrit un cercle de rayon $r = l\sin\theta$ : $\vec a$ est horizontale, centripète, $a = \omega^2l\sin\theta$.
   - Selon la glissière : $k(l - l_0) - mg\cos\theta = m\omega^2l\sin^2\theta$, d'où
   $$l_2 = \frac{kl_0 + mg\cos\theta}{k - m\omega^2\sin^2\theta} = \frac{2 + 1}{10 - 0{,}2 \times 16 \times 0{,}75} = \frac{3}{7{,}6} \approx \mathbf{0{,}395}\text{ m}.$$
   - Selon la normale : $R_2 = m\sin\theta\,(g - \omega^2l_2\cos\theta) = 0{,}2 \times 0{,}866 \times (10 - 16 \times 0{,}395 \times 0{,}5) \approx \mathbf{1{,}18}$ **N**.
   b) S décolle quand $R$ s'annule : $g = \omega^2l\cos\theta$ avec l'expression de $l$ ci-dessus. On obtient $\omega_0^2\left[kl_0\cos\theta + mg\right] = kg$, soit
   $$\omega_0 = \sqrt{\frac{kg}{kl_0\cos\theta + mg}} = \sqrt{\frac{100}{1 + 2}} \approx \mathbf{5{,}8}\text{ rad/s}.$$
   Pour $\omega > \omega_0$, il faudrait $R < 0$, impossible : S quitte la glissière.

### Partie C
1. a) Les deux fentes, éclairées par la même source, sont cohérentes : dans la zone où les faisceaux se superposent, on observe des **franges d'interférence** rectilignes, alternativement brillantes et sombres, parallèles aux fentes et équidistantes.
   b) En O (sur H), la différence de marche est nulle : **frange centrale brillante**, de part et d'autre des franges sombres et brillantes alternées.
   c) L'interfrange $i$ est la distance entre les milieux de deux franges consécutives de même nature : $i = \dfrac{\lambda D}{a} = \dfrac{0{,}560\times10^{-6}\times2{,}00}{0{,}80\times10^{-3}} = \mathbf{1{,}4}$ **mm**.
2. a) La lame allonge le chemin optique passant par $F_1$ de $(n - 1)e_0$ : en O, $\delta = (n - 1)e_0$.
   b.1) En P' d'abscisse $x$ (comptée du côté de $F_1$) : $F_2P' - F_1P' = \dfrac{ax}{D}$, donc $\delta' = \dfrac{ax}{D} - (n - 1)e$.
   b.2) Frange centrale : $\delta' = 0 \Rightarrow x = \dfrac{(n - 1)eD}{a}$, soit $e = \dfrac{ax}{(n - 1)D}$.
   b.3) $x$ croît avec $e$ : les franges se déplacent **du côté de la fente recouverte** ($F_1$), pour compenser le retard introduit par la lame.
3. a) Au centre, une frange **blanche** ; de part et d'autre, quelques franges irisées (colorées) ; plus loin, un « blanc d'ordre supérieur » : les franges des différentes couleurs se brouillent.
   b.1) En $x = 15$ mm : $\delta = \dfrac{ax}{D} = \dfrac{0{,}80\times10^{-3}\times15\times10^{-3}}{2} = 6{,}0\times10^{-6}$ m $= 6{,}0$ µm. Cannelure sombre : $\delta = (2k + 1)\dfrac\lambda2$, soit $\lambda = \dfrac{12}{2k + 1}$ µm. La condition $0{,}400 \leq \lambda \leq 0{,}756$ donne $15{,}9 \leq 2k + 1 \leq 30$, d'où $2k + 1 \in \{17 ; 19 ; 21 ; 23 ; 25 ; 27 ; 29\}$ : **7 cannelures sombres**.
   b.2) $\lambda$ (µm) : $\frac{12}{17} \approx 0{,}706$ ; $\frac{12}{19} \approx 0{,}632$ ; $\frac{12}{21} \approx 0{,}571$ ; $\frac{12}{23} \approx 0{,}522$ ; $\frac{12}{25} = 0{,}480$ ; $\frac{12}{27} \approx 0{,}444$ ; $\frac{12}{29} \approx 0{,}414$.`,
}

const spDBlanc2026Chimie = {
  title: 'Bac blanc zonal mai 2026 (zone 5, Bouenza-Lékoumou) — Chimie série D : rayonnement γ, appariement, synthèse de l’éthanoate de butyle',
  statement: R`**Inspection des lycées d'enseignement général, zone 5 (Bouenza-Lékoumou) — Baccalauréat blanc zonal, session de mai 2026 — Sciences physiques, série D — Durée 4 h — Coefficient 5 — Partie CHIMIE (8 points)**

### Partie A : vérification des connaissances (4 points)
1. **Question à réponse construite.** La radioactivité $\gamma$ accompagne généralement les radioactivités $\alpha$ et $\beta$. Explique l'émission du rayonnement $\gamma$.
2. **Texte à trous.** Complète par quatre des cinq mots : niveau, absorption, état, d'hydrogène, supérieure.
« Lorsque l'électron de l'atome ……… passe d'un ……… d'énergie inférieure à un niveau d'énergie ………, il y a ……… de photons. »
3. **Appariement.**

| Colonne A | Colonne B |
|---|---|
| A1 : l'énergie d'ionisation de l'atome d'hydrogène | B1 : $\text{NH}_3$ |
| A2 : base forte | B2 : $E^0 = 0{,}17$ V |
| A3 : potentiel rédox d'un couple | B3 : NaOH |
| A4 : base faible | B4 : $E = 13{,}6$ eV |

### Partie B : application des connaissances (4 points)
On synthétise l'éthanoate de butyle en mélangeant $45{,}7$ cm³ d'acide éthanoïque ($\text{CH}_3\text{COOH}$, masse volumique $1{,}05$ g/cm³) et $73$ cm³ de butan-1-ol ($\text{CH}_3\text{-CH}_2\text{-CH}_2\text{-CH}_2\text{-OH}$, masse volumique $0{,}81$ g/cm³).
1. Écris l'équation bilan de la réaction.
2. Vérifie que le mélange initial est équimolaire (résultat arrondi à un chiffre après la virgule).
3. Après un temps suffisamment long, on prélève le dixième du mélange à l'équilibre et on dose l'acide restant par une solution de soude de concentration $C_b = 1{,}5$ mol/L : il faut $17{,}6$ mL pour atteindre l'équivalence.
   a) Écris l'équation bilan de la réaction de dosage.
   b) Trouve, en mol, la composition du mélange à l'équilibre.
   c) Calcule le rendement de la réaction et la constante d'équilibre.

*Données :* $C = 12$ ; $H = 1$ ; $O = 16$ (g/mol).`,
  solution: R`### Partie A
1. Après une désintégration $\alpha$ ou $\beta$, le noyau fils est souvent formé dans un **état excité** ; en revenant à son état fondamental, il émet un photon de très grande énergie : c'est le rayonnement $\gamma$ (rayonnement de désexcitation du noyau).
2. « Lorsque l'électron de l'atome **d'hydrogène** passe d'un **niveau** d'énergie inférieure à un niveau d'énergie **supérieure**, il y a **absorption** de photons. »
3. A1 = B4 ; A2 = B3 ; A3 = B2 ; A4 = B1.

### Partie B
1. $\text{CH}_3\text{COOH} + \text{CH}_3(\text{CH}_2)_3\text{OH} \rightleftharpoons \text{CH}_3\text{COO}(\text{CH}_2)_3\text{CH}_3 + \text{H}_2\text{O}$.
2. $n_{\text{acide}} = \dfrac{1{,}05 \times 45{,}7}{60} \approx 0{,}8$ mol et $n_{\text{alcool}} = \dfrac{0{,}81 \times 73}{74} \approx 0{,}8$ mol : mélange **équimolaire**.
3. a) $\text{CH}_3\text{COOH} + \text{OH}^- \longrightarrow \text{CH}_3\text{COO}^- + \text{H}_2\text{O}$.
   b) Dans le prélèvement : $C_bV_b = 1{,}5 \times 17{,}6\times10^{-3} = 0{,}0264$ mol ; dans tout le mélange : $n_{\text{acide}} = 0{,}264$ mol.
   Alcool restant : $0{,}264$ mol ; ester formé : $0{,}8 - 0{,}264 = 0{,}536$ mol ; eau : $0{,}536$ mol.
   c) $r = \dfrac{0{,}536}{0{,}8} = \mathbf{67}$ **%** (valeur attendue pour un alcool primaire).
   $K = \dfrac{n_{\text{ester}}\,n_{\text{eau}}}{n_{\text{acide}}\,n_{\text{alcool}}} = \dfrac{0{,}536^2}{0{,}264^2} \approx \mathbf{4{,}1}$.`,
}

const spDBlanc2026Physique = {
  title: 'Bac blanc zonal mai 2026 (zone 5, Bouenza-Lékoumou) — Physique série D : forces électrique et magnétique, pendule, onde le long d’une corde',
  pages: p('sp-d-blanc-2026-z5', 2, 3),
  statement: R`**Inspection des lycées d'enseignement général, zone 5 — Baccalauréat blanc zonal, session de mai 2026 — Sciences physiques, série D — Partie PHYSIQUE (12 points)** (schémas et graphes sur les pages scannées)

### Partie A : vérification des connaissances (4 points)
1. **Schémas à compléter.** Représente la force qui s'exerce sur une charge $Q < 0$ placée en A, dans les deux cas :
   - cas 1 : vitesse $\vec v$ horizontale vers la droite, champ magnétique $\vec B$ perpendiculaire au plan, dirigé vers l'arrière (⊗) : force magnétique $\vec F_m$ ;
   - cas 2 : vitesse $\vec v$ horizontale vers la droite, champ électrique $\vec E$ vertical vers le bas : force électrique $\vec F_e$.
2. **Choix multiples** (une ou plusieurs bonnes réponses).
   2-1. L'unité du moment d'inertie est : a) N·m ; b) kg·m⁻² ; c) kg·m² ; d) N·m·rad⁻¹.
   2-2. Deux points d'un solide en rotation autour d'un axe fixe ont : a) même vitesse linéaire ; b) même accélération angulaire ; c) même période de révolution.
   2-3. La période d'un oscillateur mécanique correspond à la durée : a) d'un tour complet ; b) d'une oscillation ; c) du retour à la position d'équilibre.
   2-4. Dans un circuit à la résonance, l'intensité efficace est : a) minimale ; b) nulle ; c) maximale ; d) en ampère.
3. **Vrai ou faux.**
   a) La cinématique étudie les mouvements des corps en tenant compte des forces qui les produisent.
   b) Un ébranlement transversal se propage parallèlement à sa direction.
   c) Un système en chute libre n'est soumis qu'à son poids.
   d) La dualité explique l'aspect corpusculaire et l'aspect ondulatoire de la lumière.

### Partie B : application des connaissances (3 points)
Un pendule est constitué d'une bille de masse $m$ (ponctuelle) fixée à l'extrémité d'une tige indéformable, sans masse, de longueur $l$, dont l'autre extrémité tourne autour d'un axe horizontal $(\Delta)$.
1. Fais le bilan des forces exercées sur la bille.
2. Donne l'expression du travail de chacune de ces forces lorsque le pendule, écarté de $\alpha_m = 60°$ puis abandonné, repasse par sa position d'équilibre.
3. Exprime, en fonction de $l$, $g$ et $\alpha_m$, la vitesse $V$ au passage à la verticale (vitesse initiale nulle).
4. Détermine la tension de la tige au passage par la verticale.

### Partie C : résolution d'un problème (5 points)
Un vibreur est relié à l'extrémité S d'une longue corde. À $t = 0$, S commence à vibrer ; les oscillations, de période $T$ et d'amplitude $a$, se propagent à la célérité $V = 20$ m/s (réflexion négligée). Un logiciel trace les élongations de S et d'un point M situé à la distance $x$ de S : $y_S(t)$ part de $0$ en croissant ; l'amplitude est $2$ mm ; une durée de $0{,}015$ s correspond aux trois quarts d'une période ; $y_M(t)$ démarre avec un retard de cinq quarts de période.
1. À partir de la courbe $y_S(t)$ :
   a) Détermine la période $T$ et la phase initiale $\varphi_S$.
   b) Avec quel retard $\theta$ le point M commence-t-il à vibrer ?
   c) À quelle distance $x = SM$ se situe M ?
2. Quel déphasage $\varphi_M$ existe-t-il entre les mouvements de S et de M ?
3. Établis les équations horaires $y_S(t)$ et $y_M(t)$.`,
  solution: R`### Partie A
1. - Cas 1 : $\vec F_m = Q\,\vec v \wedge \vec B$. $\vec v \wedge \vec B$ (droite ∧ arrière) est dirigé **vers le haut** ; $Q < 0$, donc $\vec F_m$ est **vers le bas**, perpendiculaire à $\vec v$.
   - Cas 2 : $\vec F_e = Q\vec E$ : $Q < 0$, $\vec F_e$ est opposée à $\vec E$, donc **vers le haut**.
2. 2-1 : **c** ; 2-2 : **b** (et c : même vitesse angulaire, donc même période) ; 2-3 : **b** ; 2-4 : **c et d**.
3. a) **Faux** (la cinématique décrit le mouvement sans s'occuper des forces). b) **Faux** (il se propage perpendiculairement à la direction de la déformation). c) **Vrai**. d) **Vrai**.

### Partie B
1. Le poids $\vec P$ et la tension $\vec T$ de la tige.
2. $W(\vec T) = 0$ (sa droite d'action passe par l'axe, elle est perpendiculaire au déplacement) ; $W(\vec P) = mgh = mgl(1 - \cos\alpha_m)$.
3. Théorème de l'énergie cinétique : $\tfrac12mV^2 = mgl(1 - \cos\alpha_m)$, d'où $V = \sqrt{2gl(1 - \cos\alpha_m)}$.
4. Sur la normale (vers l'axe) : $T - mg = m\dfrac{V^2}{l} = 2mg(1 - \cos\alpha_m)$, d'où $T = mg(3 - 2\cos\alpha_m) = \mathbf{2mg}$ pour $\alpha_m = 60°$.

### Partie C
1. a) $\dfrac34T = 0{,}015$ s, d'où $T = 0{,}02$ s. À $t = 0$, $y_S = 0$ et croît : $y_S = a\sin(\omega t + \varphi_S)$ avec $\sin\varphi_S = 0$ et une vitesse positive : $\varphi_S = 0$.
   b) $\theta = \dfrac54T = 0{,}025$ s.
   c) $x = V\theta = 20 \times 0{,}025 = \mathbf{0{,}5}$ **m**.
2. $\varphi_M = \dfrac{2\pi x}{VT} = \dfrac{2\pi\times0{,}5}{20\times0{,}02} = 2{,}5\pi \equiv \dfrac\pi2$ : M est **en quadrature retard** sur S.
3. $y_S(t) = 2\times10^{-3}\sin(100\pi t)$ (m) ; $y_M(t) = 2\times10^{-3}\sin\!\left(100\pi t - \dfrac\pi2\right)$ (m), pour $t \geq 0{,}025$ s.`,
}

// ─────────────────────────────── SVT ───────────────────────────────

const svtDBlanc2026 = {
  title: 'Bac blanc zonal mai 2026 (zone 1, Brazzaville) — SVT série D : reproduction, tectonique des plaques, physiologie nerveuse, hémophilie',
  difficulty: 3,
  pages: p('svt-d-blanc-2026-z1', 1, 2, 3),
  statement: R`**Inspection des lycées d'enseignement général, zone 1 (Brazzaville) — Baccalauréat blanc zonal, session de mai 2026 — Épreuve : SVT 2 — Série D — Durée 4 h** (documents et figures sur les pages scannées)

### Partie A : restitution des connaissances (6 points)
**I. Questions à choix multiples (2 points)** — associer chaque chiffre à la bonne lettre.
1. La testostérone est une hormone sexuelle : a) dont la sécrétion est assurée par la LH ; b) dont la sécrétion est assurée par la FSH ; c) qui ne freine pas la sécrétion de la LH.
2. Le follicule secondaire : a) se caractérise par la présence de l'ovocyte II ; b) est marqué par l'apparition des thèques ; c) se caractérise par l'apparition de l'antrum.
3. Le gamétophyte femelle chez les spermaphytes : a) est l'antipode ; b) est la synergide ; c) est l'oosphère.
4. La complémentarité dominante est conditionnée : a) par la présence d'un allèle dominant ; b) par la présence d'un allèle récessif ; c) par la présence simultanée de deux allèles dominants.

**II. Appariement (2 points)**

| Colonne A | Colonne B |
|---|---|
| 1 - Distance horizontale variable | a - Équidistance |
| 2 - Courbes de niveau en traits épais | b - Courbe de niveau normale |
| 3 - Courbes de niveau en traits fins | c - Écartement |
| 4 - Distance verticale constante | d - Courbe de niveau maîtresse |

**III. Schéma (2 points)** — Réalisez le schéma annoté du gamète mâle.

### Partie B : application des connaissances (8 points)
**Exercice 1 : tectonique (4 points).** Le document (page scannée) montre des plaques lithosphériques et leurs limites : à gauche, une zone A avec volcanisme et plongement d'une plaque ; au centre, une zone B d'écartement ; à droite, une zone C avec des ophiolites charriées sur un continent. Les éléments 1 à 6 sont à annoter.
1. Annotez ce document selon la numérotation.
2. Combien de plaques comptez-vous sur ce document ?
3. Les zones A et B représentent des limites de plaques.
   a) De quel type de limite s'agit-il dans chaque cas ?
   b) Quel phénomène se déroule au niveau de chaque limite ?
   c) Citez une conséquence du phénomène se déroulant au niveau de chaque limite.
4. Comment expliquez-vous la présence des ophiolites au niveau de la zone C ?

**Exercice 2 : physiologie nerveuse (4 points).** À l'aide d'électrodes réceptrices reliées à un oscilloscope, on enregistre l'activité électrique d'un axone (figure A) et d'un nerf (figure B) en fonction de l'intensité de la stimulation (en UA). Figure A : aucune réponse en dessous de $I_1$, puis une réponse d'amplitude constante (100 %) dès $I_1$. Figure B : aucune réponse en dessous de $I_1$, puis une amplitude qui croît avec l'intensité jusqu'à 100 % vers 10 UA.
1. Analysez ces deux enregistrements.
2. Que représente l'intensité $I_1$ ? Justifiez.
3. Expliquez, à l'aide de vos connaissances, les résultats des deux enregistrements.
4. Représentez, pour l'axone et pour le nerf, les potentiels d'action obtenus après des excitations successives d'intensités $I_2 = 5$ UA et $I_3 = 10$ UA.

### Partie C : résolution d'un problème de génétique humaine (6 points)
L'hémophilie est une maladie rare liée au déficit d'une protéine nécessaire à la coagulation du sang. M. et Mme A attendent un enfant ; leur premier fils ($\text{II}_2$) est hémophile. Le médecin réalise une série d'examens :
- **Document 1** : arbre généalogique — $\text{I}_1$ (homme sain) et $\text{I}_2$ (femme saine) ont trois enfants : $\text{II}_1$ (fille saine), $\text{II}_2$ (garçon hémophile), $\text{II}_3$ (fille saine) ; $\text{II}_4$ est l'enfant à naître.
- **Document 2** : caryotype de l'enfant à naître.
- **Document 3** : analyse de l'ADN par Southern blot. Bandes observées : $\text{I}_1$ : 99 et 43 pg ; $\text{I}_2$ : 142, 99 et 43 pg ; $\text{II}_1$ : 99 et 43 pg ; $\text{II}_2$ : 142 pg seulement ; $\text{II}_3$ : 142, 99 et 43 pg ; $\text{II}_4$ : 99 et 43 pg.

1. Quel est le problème posé ?
2. À partir du document 1 :
   a) indiquez si l'allèle responsable de l'hémophilie est dominant ou récessif ;
   b) précisez la localisation du gène de l'hémophilie.
3. Analysez le document 2 puis précisez le sexe de l'enfant à naître ($\text{II}_4$).
4. Après analyse du document 3, indiquez le poids moléculaire correspondant à l'allèle responsable de l'hémophilie.
5. Donnez les génotypes des individus $\text{I}_1$, $\text{I}_2$, $\text{II}_1$ et $\text{II}_2$.
6. a) Montrez en quoi les tests pratiqués permettent de répondre au problème posé.
   b) Précisez le génotype de l'enfant à naître.`,
  solution: R`*Corrigé établi d'après le corrigé de l'inspection (sujet 2).*

### Partie A
**I.** 1 = a ; 2 = b ; 3 : aucune proposition n'est juste — le gamétophyte femelle est le **sac embryonnaire** (l'oosphère n'en est qu'une cellule, le gamète) ; la question a été annulée au barème. 4 = c.
**II.** 1 = c (écartement) ; 2 = d (courbe maîtresse) ; 3 = b (courbe normale) ; 4 = a (équidistance).
**III.** Spermatozoïde : **tête** (membrane plasmique, acrosome, noyau, cytoplasme), **pièce intermédiaire** (centriole proximal, centriole distal, mitochondries en manchon), **queue** ou flagelle (microtubules).

### Partie B — Exercice 1
1. 1 : croûte continentale ; 2 : manteau supérieur ; 3 : lithosphère continentale ; 4 : croûte océanique ; 5 : asthénosphère ; 6 : manteau supérieur.
2. **3 plaques** lithosphériques.
3. a) Zone A : limite **convergente** ; zone B : limite **divergente**.
   b) Zone A : **subduction** ; zone B : **accrétion** (expansion océanique).
   c) Zone A : séismes, volcanisme explosif, fosse océanique, plis et failles inverses. Zone B : failles normales, formation de nouvelle croûte océanique (une seule conséquence attendue par zone).
4. Les ophiolites sont des fragments de lithosphère océanique. Leur présence sur le continent (zone C) s'explique par la **fermeture d'un océan** : subduction, puis collision des continents, au cours de laquelle des lambeaux de croûte océanique sont charriés sur la plaque continentale (**obduction**).

### Partie B — Exercice 2
1. Figure A (axone) : aucune réponse avant $I_1$ ; dès $I_1$, l'amplitude est d'emblée maximale (100 %) et ne varie plus quand l'intensité augmente. Figure B (nerf) : à partir de $I_1$, l'amplitude augmente avec l'intensité, puis devient constante (100 %) à partir de 10 UA.
2. $I_1$ est l'**intensité seuil** (liminaire) : c'est la plus faible intensité qui provoque une réponse.
3. L'axone obéit à la **loi du tout ou rien** : sous le seuil, pas de potentiel d'action ; au-delà, un potentiel d'action d'amplitude maximale constante. Le nerf est formé de nombreuses fibres de seuils différents : quand l'intensité augmente, le nombre de fibres excitées augmente (**recrutement**), donc l'amplitude du potentiel global augmente, jusqu'à ce que toutes les fibres répondent.
4. Axone : deux potentiels d'action de même amplitude (100 %) pour $I_2$ et $I_3$. Nerf : pour $I_2 = 5$ UA, un potentiel d'amplitude intermédiaire ; pour $I_3 = 10$ UA, un potentiel d'amplitude maximale.

### Partie C
1. Il s'agit de déterminer le **risque que l'enfant à naître soit hémophile**.
2. a) $\text{II}_2$ est hémophile alors que ses parents sont sains : l'allèle est **récessif** (h ; allèle normal H).
   b) - Gène sur Y : $\text{II}_2$ aurait hérité d'un père malade — rejeté.
   - Gène autosomique : possible avec deux parents hétérozygotes.
   - Gène sur X : possible avec une mère $X^HX^h$ conductrice.
   La maladie ne touche qu'un garçon : l'hypothèse la plus probable est un gène porté par le **chromosome X** (confirmée par le document 3).
3. 22 paires d'autosomes et une paire de gonosomes différents (XY) : l'enfant est un **garçon**.
4. $\text{II}_2$, hémophile, ne possède qu'une bande de **142 pg** : c'est l'allèle h. L'allèle normal H donne les bandes de 99 et 43 pg ($99 + 43 = 142$ : il est coupé en deux fragments). Le père $\text{I}_1$, qui n'a que les bandes 99 + 43, ne porte pas h, ce qui exclut l'hypothèse autosomique (il faudrait qu'il soit hétérozygote) : le gène est bien sur X.
5. $\text{I}_1$ : $X^HY$ ; $\text{I}_2$ : $X^HX^h$ ; $\text{II}_1$ : $X^HX^H$ ; $\text{II}_2$ : $X^hY$.
6. a) L'arbre établit le mode de transmission (récessif, lié à X) ; le caryotype donne le sexe de l'enfant ; le Southern blot identifie l'allèle h (142 pg) chez chaque individu.
   b) L'enfant à naître est un garçon qui ne porte pas la bande de 142 pg : génotype $X^HY$, **il ne sera pas hémophile**.`,
}

// ─────────────────────────────── HISTOIRE-GÉOGRAPHIE ───────────────────────────────

const hgBlanc2026 = {
  title: 'Bac blanc zonal mai 2026 (zone 3, Owando) — Géographie séries C-D : échanges commerciaux du Congo, relief, Chine-Afrique, France-Congo',
  difficulty: 2,
  statement: R`**Inspection des lycées d'enseignement général, zone 3 (Cuvette / Cuvette-Ouest / Congo-Oubangui) — Baccalauréat blanc zonal, session de mai 2026 — Épreuve : géographie — Séries C/D — Durée 3 h — Coefficient 3 — Groupes de sujets au choix du candidat.**

> Les textes des commentaires sont **adaptés** des documents du sujet (les idées et les chiffres sont conservés).

## Groupe 1
**Dissertation (12 points).** Expliquez les échanges commerciaux et leurs problèmes au Congo.

**Commentaire de document (8 points).** *Les relations économiques Chine-Afrique : « une stratégie active vis-à-vis de l'Afrique »* — texte adapté de « La présence chinoise en Afrique », *La Lettre du CEPII*, n° 328, 20 décembre 2012.

> Longtemps, l'éloignement et la faible complémentarité des économies ont limité les relations entre la Chine et l'Afrique. Son industrialisation a changé la situation : pour couvrir ses besoins en matières premières, diversifier ses sources d'approvisionnement, trouver des marchés extérieurs dynamiques et des territoires ouverts à l'internationalisation de ses firmes, la Chine a adopté une stratégie active envers l'Afrique, dont elle est devenue le premier partenaire commercial. Les gains sont évidents pour elle : si l'Afrique absorbe moins de 5 % des exportations chinoises, ce débouché est bien plus important pour certains produits — véhicules utilitaires (28 %), fils et tissus (13 %), matériel de BTP (12,5 %). Le continent sert aussi de terrain d'essai à des produits et services innovants (services médicaux, financiers, informations aux agriculteurs par téléphone) avant leur diffusion mondiale. Les importations chinoises donnent aux investisseurs et aux consommateurs africains accès à des biens moins chers ; mais, dans le textile-habillement, cette concurrence a éliminé beaucoup d'entreprises africaines peu productives et fait disparaître des dizaines de milliers d'emplois.

Questions : 1. Présentez le document (1 pt). 2. Relevez les raisons qui justifient la présence actuelle de la Chine en Afrique (3 pts). 3. Quelles sont les principales exportations chinoises en Afrique ? Quelles en sont les conséquences ? (3 pts). 4. Quel est l'intérêt de ce document ? (1 pt)

## Groupe 2
**Dissertation (12 points).** Expliquez les grands ensembles du relief du Congo.

**Commentaire de document (8 points).** *Les échanges commerciaux entre la France et le Congo* — texte adapté du *Guide de l'investisseur au Congo*, Éditions Les Princes de l'Équateur, 2010-2011, p. 56.

> De longue date, la France est le premier partenaire économique du Congo : premier investisseur et premier fournisseur (20 % du marché). En 2007, les importations françaises en provenance du Congo ont chuté de plus de 40 %, à 87 millions d'euros (M€) ; elles sont remontées à 476 M€ en 2008 grâce à la reprise des achats de pétrole (436 M€), les achats de bois restant stables. Les exportations françaises vers le Congo ont progressé de 12 % pour atteindre 498 M€, portées par les biens intermédiaires (tubes en acier pour le BTP), les biens d'équipement (matériel hydraulique, pompes et compresseurs, matériel d'extraction) et les produits pharmaceutiques. En 2009, les échanges ont légèrement baissé en valeur : 455 M€ d'exportations françaises vers le Congo et 465 M€ d'importations françaises en provenance du Congo.

Questions : 1. Présentez le document (1 pt). 2. Indiquez les produits que le Congo importe de France. Quel est le montant des exportations françaises vers le Congo en 2008 ? (2 pts). 3. Indiquez les produits que le Congo exporte vers la France. Quel est le montant des exportations congolaises vers la France en 2008 ? (2 pts). 4. Après avoir calculé la balance commerciale du Congo avec la France en 2009, dites si elle est excédentaire ou déficitaire (2 pts). 5. Quel est l'intérêt de ce document ? (1 pt)`,
  solution: R`## Groupe 1
### Dissertation — plan détaillé
**Introduction.** Les échanges commerciaux sont les achats (importations) et les ventes (exportations) de biens et services avec l'extérieur. Le Congo, pays producteur de pétrole ouvert sur l'Atlantique, en dépend fortement. Quels sont ses échanges et quels problèmes rencontrent-ils ?

**I. Les échanges commerciaux du Congo**
1. *Les exportations* : surtout le **pétrole brut** (la très grande majorité des recettes d'exportation), puis le bois (grumes et sciages), le sucre et quelques produits miniers et agricoles.
2. *Les importations* : biens d'équipement (machines, véhicules), produits manufacturés, produits pétroliers raffinés, et une part importante de **produits alimentaires** (riz, farine, viande, poisson).
3. *Les partenaires et les moyens* : la Chine (premier client), la France et l'Union européenne, les États-Unis, l'Inde, les pays de la CEMAC ; le Port autonome de Pointe-Noire, le Chemin de fer Congo-Océan (CFCO), les routes et les aéroports.

**II. Les problèmes des échanges**
1. *La dépendance au pétrole* : les recettes suivent les cours mondiaux ; quand les prix baissent, la balance commerciale et le budget de l'État se dégradent.
2. *La faible diversification* : peu de produits transformés exportés ; une forte dépendance alimentaire.
3. *Des contraintes internes* : infrastructures insuffisantes ou vieillissantes, coûts de transport élevés, fraude et commerce informel, faible commerce avec les voisins de la CEMAC.

**III. Les solutions envisagées**
Diversification de l'économie (agriculture, transformation du bois, mines), modernisation des infrastructures (port, CFCO, routes), intégration régionale (CEMAC, zone de libre-échange continentale), lutte contre la fraude.

**Conclusion.** Des échanges dominés par le pétrole, qui rendent l'économie congolaise vulnérable : leur diversification est la condition d'un développement durable.

### Commentaire « Chine-Afrique »
1. **Présentation** : texte économique tiré de *La Lettre du CEPII* (n° 328, 20 décembre 2012), consacré à la présence chinoise en Afrique ; il en montre les raisons, les formes et les effets.
2. **Raisons** : les besoins de la Chine en matières premières ; la volonté de diversifier ses sources d'approvisionnement ; la recherche de marchés extérieurs dynamiques ; la recherche de territoires ouverts à l'internationalisation de ses firmes.
3. **Exportations chinoises** : véhicules utilitaires (28 % des débouchés), fils et tissus (13 %), matériel de BTP (12,5 %), et des services innovants testés en Afrique. **Conséquences** : positives — accès des investisseurs et des consommateurs africains à des biens moins chers ; négatives — concurrence qui élimine des entreprises africaines du textile-habillement et fait disparaître des dizaines de milliers d'emplois.
4. **Intérêt** : comprendre la stratégie économique de la Chine en Afrique et mesurer ses avantages et ses limites pour les économies africaines (coopération Sud-Sud, concurrence, dépendance).

## Groupe 2
### Dissertation — plan détaillé
**Introduction.** Le relief est l'ensemble des formes de la surface terrestre. Celui du Congo est peu élevé mais varié : quels en sont les grands ensembles ?

**I. Le Sud-Ouest : des reliefs variés**
1. *La plaine côtière* : étroite bande basse du littoral atlantique (cordons sableux, lagunes), autour de Pointe-Noire.
2. *Le massif du Mayombe* : chaîne de moyennes montagnes boisées parallèle à la côte, aux altitudes modestes (quelques centaines de mètres, proches de 900 m au plus), entaillée de gorges.
3. *La vallée (dépression) du Niari* : zone basse et fertile entre le Mayombe et les plateaux, domaine agricole (canne à sucre, cultures vivrières).
4. *Le massif du Chaillu* : relief élevé et boisé au nord de la vallée du Niari.

**II. Le Centre : les plateaux**
Les **plateaux Batéké** et les plateaux voisins (Cataractes au sud) : vastes plateaux sableux de 600 à 800 m environ, aux savanes, entaillés par les vallées des rivières, véritables châteaux d'eau.

**III. Le Nord : la cuvette congolaise et ses bordures**
1. *La cuvette congolaise* : grande plaine basse, marécageuse et inondable, couverte de forêt dense, drainée par le fleuve Congo et ses affluents (Sangha, Likouala…).
2. *Les hauteurs du Nord-Ouest* : collines et plateaux de la Sangha, où se trouve le point culminant du pays, le **mont Nabemba** (environ 1 000 m).

**Conclusion.** Un relief dominé par les plateaux et les plaines, avec des massifs au sud-ouest et au nord-ouest ; ce relief influence le climat, la répartition des populations et les activités (agriculture du Niari, forêts du Mayombe et du Nord, voies navigables de la cuvette).

### Commentaire « France-Congo »
1. **Présentation** : texte économique tiré du *Guide de l'investisseur au Congo* (Éditions Les Princes de l'Équateur, 2010-2011, p. 56), qui présente les échanges commerciaux entre la France et le Congo de 2007 à 2009.
2. **Produits importés de France** : biens intermédiaires (tubes en acier pour le BTP), biens d'équipement (matériel hydraulique, pompes et compresseurs, matériel d'extraction), produits pharmaceutiques. **Exportations françaises en 2008 : 498 M€.**
3. **Produits exportés vers la France** : pétrole et bois. **Exportations congolaises vers la France en 2008 : 476 M€** (dont 436 M€ de pétrole).
4. **Balance commerciale du Congo avec la France en 2009** = exportations congolaises − importations congolaises = $465 - 455 = +10$ M€ : elle est **excédentaire**.
5. **Intérêt** : montrer la place de la France comme partenaire du Congo et la dépendance des exportations congolaises au pétrole et au bois, face à des importations de produits manufacturés.`,
}

export const BLOCS = [
  { subject: 'Mathématiques', levels: ['bac_c'], chapterTitle: 'Annales du bac — Mathématiques série C', description: 'Sujets du baccalauréat série C avec corrigés détaillés.', orderStart: 0, exercises: [mathsC2024] },
  { subject: 'Mathématiques', levels: ['bac_d'], chapterTitle: 'Annales du bac — Mathématiques série D', description: 'Sujets du baccalauréat et bacs blancs série D, avec corrigés détaillés.', orderStart: 0, exercises: [mathsDBlanc2026, mathsD2024] },
  { subject: 'CHIMIE', levels: ['bac_c'], chapterTitle: 'Annales du bac — Chimie', orderStart: 0, exercises: [spCBlanc2026Chimie] },
  { subject: 'Physique', levels: ['bac_c'], chapterTitle: 'Annales du bac — Physique', orderStart: 0, exercises: [spCBlanc2026Physique] },
  { subject: 'CHIMIE', levels: ['bac_d'], chapterTitle: 'Annales du bac — Chimie', orderStart: 0, exercises: [spDBlanc2026Chimie] },
  { subject: 'Physique', levels: ['bac_d'], chapterTitle: 'Annales du bac — Physique', orderStart: 0, exercises: [spDBlanc2026Physique] },
  { subject: 'SVT', levels: ['bac_d'], chapterTitle: 'Annales SVT — Bacs, bacs blancs, compositions et devoirs', orderStart: -1, exercises: [svtDBlanc2026] },
  { subject: 'Histoire-Géographie', levels: ['bac_c', 'bac_d'], chapterTitle: 'Annales et sujets type bac — Histoire-Géographie', description: 'Sujets de bac et de bacs blancs avec corrigés (plans détaillés, commentaires).', orderStart: 0, exercises: [hgBlanc2026] },
]
