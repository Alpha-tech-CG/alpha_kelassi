// Bac technique 2024 — MATHÉMATIQUES série E (Congo), publié comme sujet d'entraînement
// dans les annales de Maths série C (la série E n'existe pas dans l'application ; son
// programme recoupe celui de la série C). Énoncé transcrit ; corrigé rédigé pour
// l'application (le corrigé du PDF a servi de référence). Rang : juste après le bac C 2024.
const R = String.raw

const bacE2024 = {
  title: 'Bac E 2024 (série technique) — sujet d’entraînement : complexes et congruences, similitudes et hyperbole, suite d’intégrales, statistique',
  statement: R`**Baccalauréat technique — Session 2024 — Série E — Mathématiques — Coefficient 5**

> Sujet de la série E (mathématiques et techniques), proposé ici en **entraînement pour la série C** : son programme recoupe celui de la série C.

### Exercice 1 (4 points)
1. Soit $\alpha \in [-\pi ; \pi]$ et l'équation $(E) : z^2 - (4\sin\alpha)z + 4 = 0$.
   a) Résoudre $(E)$ dans $\mathbb{C}$ ; on notera $z_1$ et $z_2$ ses solutions.
   b) Donner la forme exponentielle de $z_1$ et $z_2$.
   c) Calculer $S = \dfrac1{z_1} + \dfrac1{z_2}$.
2. On considère dans $\mathbb{Z}^2$ l'équation $(E') : 17x - 40y = 1$.
   a) Montrer que $(E')$ admet des solutions dans $\mathbb{Z}^2$.
   b) Déterminer une solution particulière $(x_0 ; y_0)$ de $(E')$.
   c) Résoudre $(E')$ dans $\mathbb{Z}^2$.
   d) Déterminer l'inverse modulo 40 de 17 compris entre 0 et 40.

### Exercice 2 (8 points)
Dans le plan orienté, on considère un triangle $ABC$ tel que $(\overrightarrow{AB}, \overrightarrow{AC}) \equiv \dfrac\pi2\;[2\pi]$ et $(\overrightarrow{BC}, \overrightarrow{BA}) \equiv \dfrac\pi3\;[2\pi]$.
1. Soit $f$ la similitude plane directe de centre $A$ qui transforme $B$ en $C$. Déterminer l'angle et le rapport de $f$.
2. Soit $g$ la similitude plane indirecte de centre $A$ qui transforme $C$ en $B$.
   a) Déterminer le rapport de $g$.
   b) Déterminer l'axe $(\Delta)$ de $g$.
   c) Soit $D$ le point défini par $\overrightarrow{AD} = \frac13\overrightarrow{AC}$. Montrer que $g(B) = D$ et en déduire que $[BD)$ est la bissectrice intérieure de l'angle $(\overrightarrow{BC}, \overrightarrow{BA})$.
3. a) Montrer que $f \circ g$ est une symétrie axiale et préciser son axe.
   b) On pose $D' = f(D)$. Montrer que $D'$ est le symétrique de $B$ par rapport à $A$.
4. La bissectrice intérieure de l'angle $(\overrightarrow{AC}, \overrightarrow{AD'})$ coupe la droite $(CD')$ en un point $J$. Soit $I$ le centre du cercle inscrit dans le triangle $ABC$. Déterminer $f(I)$.
5. La droite $(\Delta)$ coupe le segment $[BC]$ en $L$. On note $K = S_{(BD')}(J)$ et $E = S_{(BD')}(L)$. Soit $(H)$ l'hyperbole de rectangle fondamental $KELJ$ et d'axe focal $(BD')$.
   a) Montrer que $(H)$ est une hyperbole équilatère.
   b) Préciser le centre et les asymptotes de $(H)$.
   c) Placer les foyers $F_1$ et $F_2$ de $(H)$.
   d) Justifier que $f \circ g\,[(H)] = (H)$.
   e) Tracer $(H)$.

### Exercice 3 (5 points)
1. Soit $f(x) = (x + 2)e^{-x}$ sur $\mathbb{R}$ et $(\mathscr{C})$ sa courbe dans un repère orthonormé.
   a) Étudier les variations de $f$, puis dresser son tableau de variation.
   b) Tracer $(\mathscr{C})$.
2. Soit $g$ la restriction de $f$ à l'intervalle $I = [-1 ; +\infty[$.
   a) Montrer que $g$ réalise une bijection de $I$ sur un intervalle $J$ à déterminer.
   b) Tracer dans le même repère la courbe $(\mathscr{C}')$ de la réciproque $g^{-1}$.
3. Pour tout entier $n \geq 1$, on pose $I_n = \displaystyle\int_{-2}^{0}\frac{(x + 2)^ne^{-x}}{n!}\,dx$ et $U_n = \displaystyle\sum_{k=0}^{n}\frac{2^k}{k!}$.
   a) Vérifier que pour tout $x \in [-2 ; 0]$, $0 \leq \dfrac{(x + 2)^ne^{-x}}{n!} \leq \dfrac{2^n}{n!}e^2$.
   b) Justifier, à l'aide d'une intégration par parties, que $I_1 = e^2 - 3$.
   c) Montrer que pour tout $n \geq 1$, $I_{n+1} = I_n - \dfrac{2^{n+1}}{(n + 1)!}$, puis en déduire que $I_n = e^2 - U_n$.
4. Soit $V_n = \dfrac{2^n}{n!}$. Montrer que pour tout $n \geq 2$, $V_{n+1} \leq \frac23V_n$, puis en déduire que $V_n \leq 2\left(\frac23\right)^{n-2}$ et préciser la limite de $V_n$.
5. En utilisant la question 3.a, justifier que $0 \leq I_n \leq 2e^2V_n$, puis en déduire les limites de $I_n$ et de $U_n$.

### Exercice 4 (3 points)
Le tableau ci-dessous présente l'évolution d'un virus dans un pays :

| $x_i$ (mois) | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|
| $y_i$ (nombre de malades) | 10 | 18 | 20 | 23 | 30 |

1. Calculer le nombre moyen de malades.
2. Calculer $\text{cov}(X ; Y)$.
3. Calculer le coefficient de corrélation linéaire.
4. Déterminer la droite de régression de $y$ en $x$.
5. Donner une estimation du nombre de mois pour 60 malades.`,
  solution: R`### Exercice 1
1. a) $\Delta' = 4\sin^2\alpha - 4 = -4\cos^2\alpha = (2i\cos\alpha)^2$ : $z_1 = 2\sin\alpha + 2i\cos\alpha$ et $z_2 = 2\sin\alpha - 2i\cos\alpha$.
   b) $z_1 = 2\left(\cos\left(\frac\pi2 - \alpha\right) + i\sin\left(\frac\pi2 - \alpha\right)\right) = 2e^{i\left(\frac\pi2 - \alpha\right)}$ et $z_2 = \overline{z_1} = 2e^{i\left(\alpha - \frac\pi2\right)}$.
   c) $S = \dfrac{z_1 + z_2}{z_1z_2} = \dfrac{4\sin\alpha}{4} = \sin\alpha$.
2. a) $40 = 17 \times 2 + 6$ ; $17 = 6 \times 2 + 5$ ; $6 = 5 + 1$ : $\text{PGCD}(17, 40) = 1$, donc $(E')$ a des solutions (Bézout).
   b) En remontant : $1 = 6 - 5 = 3 \times 6 - 17 = 3 \times 40 - 7 \times 17$, soit $17 \times (-7) - 40 \times (-3) = 1$ : $(x_0 ; y_0) = (-7 ; -3)$.
   c) $17(x + 7) = 40(y + 3)$ ; $17$ et $40$ premiers entre eux (Gauss) : $x = -7 + 40k$, $y = -3 + 17k$, $k \in \mathbb{Z}$.
   d) $17 \times (-7) \equiv 1\;[40]$ ; les inverses sont $-7 + 40k$ ; entre 0 et 40 : **33** ($17 \times 33 = 561 = 14 \times 40 + 1$).

### Exercice 2
*Repère pour vérifier : $A(0 ; 0)$, $B(1 ; 0)$, $C(0 ; \sqrt3)$ (on prend $AB$ pour unité) ; $D\left(0 ; \frac{\sqrt3}{3}\right)$.*
1. $\theta = (\overrightarrow{AB}, \overrightarrow{AC}) = \dfrac\pi2$ ; dans le triangle rectangle en $A$, $k_1 = \dfrac{AC}{AB} = \tan\widehat{ABC} = \tan\dfrac\pi3 = \sqrt3$. ($f : z' = i\sqrt3\,z$.)
2. a) $k_2 = \dfrac{AB}{AC} = \dfrac1{\sqrt3} = \dfrac{\sqrt3}{3}$.
   b) Une similitude indirecte de centre $A$ envoyant $C$ sur $B$ a pour axe la bissectrice de l'angle $(\overrightarrow{AC}, \overrightarrow{AB})$ : $(\Delta)$ est la bissectrice intérieure de l'angle droit en $A$ (droite $y = x$).
   c) $g = h_{(A, \frac{\sqrt3}{3})} \circ S_{(\Delta)}$ (composée commutative), donc $g \circ g = h_{(A, \frac13)}$. Ainsi $g(B) = g(g(C)) = h_{(A,\frac13)}(C) = D$.
   Dans le triangle $ABD$ rectangle en $A$ : $\tan\widehat{ABD} = \dfrac{AD}{AB} = \dfrac{\sqrt3}{3}$, donc $\widehat{ABD} = \dfrac\pi6$, moitié de $\widehat{ABC} = \dfrac\pi3$ : $[BD)$ est la bissectrice intérieure de l'angle en $B$.
3. a) $f \circ g$ est une similitude **indirecte** (directe ∘ indirecte) de rapport $\sqrt3 \times \frac{\sqrt3}{3} = 1$ : c'est une symétrie axiale. $f \circ g(A) = A$ et $f \circ g(C) = f(B) = C$ : son axe est **la droite $(AC)$**.
   b) $D' = f(D) = f(g(B)) = S_{(AC)}(B)$ : $D'$ est le symétrique de $B$ par rapport à $(AC)$ ; comme $(AB) \perp (AC)$, c'est aussi le symétrique de $B$ par rapport à $A$ ($D'(-1 ; 0)$).
4. $f$ envoie le triangle $ABC$ sur le triangle $ACF$ avec $F = f(C)$ (de coordonnées $(-3 ; 0)$), donc le centre $I$ du cercle inscrit de $ABC$ sur le centre du cercle inscrit de $ACF$. Ce centre est sur la bissectrice de l'angle droit en $A$, c'est-à-dire la bissectrice de $(\overrightarrow{AC}, \overrightarrow{AD'})$, et sur la bissectrice de l'angle en $C$ de $ACF$ ; dans $ACF$, $\widehat{ACF} = \frac\pi3$ et $(CD')$ fait un angle de $\frac\pi6$ avec $(CA)$ (image par $f$ de la bissectrice $(BD)$) : c'est cette bissectrice. Donc **$f(I) = J$**.
   (Vérification : le rayon inscrit de $ACF$ vaut $r = \frac{3 + \sqrt3 - 2\sqrt3}{2} = \frac{3 - \sqrt3}{2}$, et $J(-r ; r)$ est bien sur $(CD') : y = \sqrt3(x + 1)$.)
5. $L = (\Delta) \cap [BC]$ : $L(r ; r)$ avec le même $r = \frac{3 - \sqrt3}2 \approx 0{,}63$ ; $(BD')$ est l'axe des abscisses, donc $K(-r ; -r)$ et $E(r ; -r)$.
   a) $KELJ$ est un **carré** de centre $A$ (côtés $2r$) : le rectangle fondamental étant un carré, $a = b = r$ et $(H)$ est équilatère.
   b) Centre $A$ ; asymptotes : les diagonales du carré, c'est-à-dire $(\Delta)$ et $(AJ)$ (droites $y = x$ et $y = -x$).
   c) $c = \sqrt{a^2 + b^2} = r\sqrt2$, qui est la demi-diagonale $AJ$ du carré. Le cercle de centre $A$ passant par $J$, $K$, $E$, $L$ coupe l'axe focal $(BD')$ en $F_1$ et $F_2$ : $F_{1,2}(\pm r\sqrt2 ; 0)$, soit environ $(\pm0{,}90 ; 0)$.
   d) $f \circ g = S_{(AC)}$, et $(AC)$ est l'axe non focal de $(H)$, qui est un axe de symétrie de l'hyperbole : $f \circ g[(H)] = (H)$. (Équation : $x^2 - y^2 = r^2$, invariante par $x \mapsto -x$.)
   e) Deux branches de sommets $(\pm r ; 0)$, d'asymptotes $y = \pm x$.

### Exercice 3
1. a) $f'(x) = e^{-x} - (x + 2)e^{-x} = -(x + 1)e^{-x}$ : $f$ croît sur $]-\infty ; -1]$, décroît sur $[-1 ; +\infty[$. Limites : $-\infty$ en $-\infty$ ; $0$ en $+\infty$. Maximum $f(-1) = e$.
   b) $(\mathscr{C})$ coupe l'axe des abscisses en $-2$, l'axe des ordonnées en $(0 ; 2)$ ; asymptote $y = 0$ en $+\infty$ ; branche parabolique de direction $(Oy)$ en $-\infty$.
2. a) $g$ est continue et strictement décroissante sur $[-1 ; +\infty[$ : bijection sur $J = \,]0 ; e]$.
   b) $(\mathscr{C}')$ est la symétrique de la partie de $(\mathscr{C})$ sur $[-1 ; +\infty[$ par rapport à la droite $y = x$.
3. a) Sur $[-2 ; 0]$ : $0 \leq x + 2 \leq 2$ et $1 \leq e^{-x} \leq e^2$, d'où l'encadrement.
   b) $u = x + 2$, $v' = e^{-x}$ : $I_1 = \left[-(x + 2)e^{-x}\right]_{-2}^0 + \displaystyle\int_{-2}^0 e^{-x}dx = -2 + (e^2 - 1) = e^2 - 3$.
   c) $u = \dfrac{(x + 2)^{n+1}}{(n + 1)!}$, $v' = e^{-x}$ : $I_{n+1} = \left[-\dfrac{(x + 2)^{n+1}}{(n + 1)!}e^{-x}\right]_{-2}^0 + I_n = -\dfrac{2^{n+1}}{(n + 1)!} + I_n$.
   Par récurrence (ou en sommant) : $I_n = I_1 - \displaystyle\sum_{k=2}^{n}\frac{2^k}{k!} = e^2 - 3 - (U_n - 1 - 2) = e^2 - U_n$.
4. $\dfrac{V_{n+1}}{V_n} = \dfrac{2}{n + 1} \leq \dfrac23$ pour $n \geq 2$. Par récurrence, $V_n \leq V_2\left(\frac23\right)^{n-2} = 2\left(\frac23\right)^{n-2}$, qui tend vers 0 : $\lim V_n = 0$.
5. En intégrant 3.a sur un intervalle de longueur 2 : $0 \leq I_n \leq 2\cdot\dfrac{2^n}{n!}e^2 = 2e^2V_n$. Par encadrement, $\lim I_n = 0$, donc $\lim U_n = e^2$ (soit $\displaystyle\sum_{k=0}^{+\infty}\frac{2^k}{k!} = e^2$).

### Exercice 4
1. $\overline y = \dfrac{10 + 18 + 20 + 23 + 30}{5} = 20{,}2$ malades (et $\overline x = 4$ mois).
2. $\text{cov}(X ; Y) = \dfrac{20 + 54 + 80 + 115 + 180}{5} - 4 \times 20{,}2 = 89{,}8 - 80{,}8 = 9$.
3. $V(X) = \dfrac{90}{5} - 16 = 2$ ; $V(Y) = \dfrac{2\,253}{5} - 20{,}2^2 = 42{,}56$ ; $r = \dfrac{9}{\sqrt{2 \times 42{,}56}} \approx 0{,}98$ : forte corrélation linéaire positive.
4. $a = \dfrac{9}{2} = 4{,}5$ ; $b = 20{,}2 - 4{,}5 \times 4 = 2{,}2$ : $y = 4{,}5x + 2{,}2$.
5. $60 = 4{,}5x + 2{,}2 \iff x \approx 12{,}8$ : environ **13 mois**.`,
}

export const BLOCS = [
  { subject: 'Mathématiques', levels: ['bac_c'], chapterTitle: 'Annales du bac — Mathématiques série C', orderStart: 1, exercises: [bacE2024] },
]
