# Suites numériques

> **🎯 Dans ce chapitre, tu vas apprendre à…**
>
> - démontrer une propriété « pour tout $n$ » grâce à la **récurrence** ;
> - dire si une suite est bornée, monotone, périodique, convergente ;
> - maîtriser les suites **arithmétiques** et **géométriques** (terme général, somme, limite) ;
> - résoudre les suites **arithmético-géométriques**, **adjacentes** et **récurrentes d'ordre 2**.

## 1. Le raisonnement par récurrence

> **💡 Pour bien comprendre — l'effet domino**
>
> Imagine une file de dominos. Pour être sûr qu'ils tombent **tous**, il suffit de vérifier deux choses :
> 1. le **premier** domino tombe ;
> 2. **chaque** domino qui tombe fait tomber le **suivant**.
>
> La récurrence, c'est exactement ça, mais avec une propriété $P(n)$ au lieu des dominos.

> **🏛️ Théorème — Principe de récurrence**
>
> Pour démontrer que $P(n)$ est vraie pour tout entier $n \geq n_0$ :
> 1. **Initialisation** : on vérifie que $P(n_0)$ est vraie ;
> 2. **Hérédité** : on suppose $P(k)$ vraie pour un entier $k \geq n_0$ (c'est l'**hypothèse de récurrence**) et on prouve que $P(k+1)$ est vraie ;
> 3. **Conclusion** : $P(n)$ est vraie pour tout $n \geq n_0$.

> **✏️ Exemple — une somme de puissances de 2**
>
> Soit $u_n = 2^1 + 2^2 + \cdots + 2^n$ pour $n \geq 1$. Calcule $u_2$, $u_3$, $u_4$, puis montre que $u_n = 2^{n+1} - 2$.
>
> **Solution.**
>
> - $u_2 = 2 + 4 = 6$ ; $u_3 = 6 + 8 = 14$ ; $u_4 = 14 + 16 = 30$.
> - **Initialisation** : $u_1 = 2$ et $2^2 - 2 = 2$. ✔
> - **Hérédité** : supposons $u_k = 2^{k+1} - 2$. Alors $u_{k+1} = u_k + 2^{k+1} = 2^{k+1} - 2 + 2^{k+1} = 2 \times 2^{k+1} - 2 = 2^{k+2} - 2$. ✔
> - **Conclusion** : pour tout $n \geq 1$, $u_n = 2^{n+1} - 2$.

> **✏️ Exemple — un multiple de 3**
>
> Montre que $4^n - 1$ est un multiple de $3$ pour tout $n \in \mathbb{N}$.
>
> **Solution.**
>
> - **Initialisation** : $4^0 - 1 = 0 = 3 \times 0$. ✔
> - **Hérédité** : supposons $4^k - 1 = 3m$ ($m$ entier). Alors $4^{k+1} - 1 = 4 \times 4^k - 1 = 4(4^k - 1) + 3 = 12m + 3 = 3(4m + 1)$. ✔
> - **Conclusion** : $4^n - 1$ est toujours un multiple de $3$.

> **✏️ Exemple — la somme des entiers**
>
> Montre que $S_n = 1 + 2 + \cdots + n = \dfrac{n(n+1)}{2}$, puis calcule $A = 1 + 2 + \cdots + 2020$ et $B = 48 + 49 + \cdots + 627$.
>
> **Solution.**
>
> - **Initialisation** : $S_1 = 1 = \dfrac{1 \times 2}{2}$. ✔
> - **Hérédité** : si $S_k = \dfrac{k(k+1)}{2}$, alors $S_{k+1} = \dfrac{k(k+1)}{2} + (k+1) = \dfrac{(k+1)(k+2)}{2}$. ✔
> - $A = S_{2020} = \dfrac{2020 \times 2021}{2} = 2\,041\,210$.
> - $B = S_{627} - S_{47} = \dfrac{627 \times 628}{2} - \dfrac{47 \times 48}{2} = 196\,878 - 1\,128 = 195\,750$.

## 2. Suites majorées, minorées, bornées

> **💡 Pour bien comprendre — le plafond et le plancher**
>
> Une suite **majorée** ne dépasse jamais un **plafond** $M$ ; une suite **minorée** ne descend jamais sous un **plancher** $m$. Une suite **bornée** vit entre les deux, comme dans une pièce.

> **📘 Définition — Suite majorée, minorée, bornée**
>
> - $(u_n)$ est **majorée** s'il **existe** un réel $M$ tel que $u_n \leq M$ pour tout $n$.
> - $(u_n)$ est **minorée** s'il **existe** un réel $m$ tel que $u_n \geq m$ pour tout $n$.
> - $(u_n)$ est **bornée** si elle est à la fois majorée et minorée : $m \leq u_n \leq M$.
> - $(u_n)$ est **positive** si $u_n \geq 0$, **négative** si $u_n \leq 0$, pour tout $n$.

> **🧭 Méthode — montrer que $u_n \leq M$**
>
> On étudie le **signe de la différence** $u_n - M$ : si elle est négative pour tout $n$, la suite est majorée par $M$.

> **✏️ Exemple**
>
> Soit $u_n = \dfrac{2n}{n+1}$. Montre que $0 \leq u_n < 2$.
>
> **Solution.**
>
> - Pour $n \geq 0$, numérateur et dénominateur sont positifs : $u_n \geq 0$, la suite est **minorée par $0$**.
> - $u_n - 2 = \dfrac{2n - 2(n+1)}{n+1} = \dfrac{-2}{n+1} < 0$ : la suite est **majorée par $2$**.
> - Elle est donc **bornée**.

## 3. Suites périodiques

> **📘 Définition — Suite périodique**
>
> $(u_n)$ est **périodique** s'il existe un entier $p \geq 1$ tel que $u_{n+p} = u_n$ pour tout $n$. Le plus petit de ces entiers est la **période**. Alors $u_{n + kp} = u_n$ pour tout entier $k$.

> **💡 Pour bien comprendre**
>
> Comme les jours de la semaine : tous les $7$ jours, on retombe sur le même jour. Pour connaître le jour dans $100$ jours, on regarde seulement le **reste** de $100$ divisé par $7$.

> **✏️ Exemple**
>
> Soit $u_n = (-1)^n$. Montre qu'elle est périodique de période $2$, puis trouve $u_{3019}$ et $u_{3020}$.
>
> **Solution.**
>
> - $u_{n+2} = (-1)^n \times (-1)^2 = (-1)^n = u_n$ : période $2$.
> - $u_0 = 1$, $u_1 = -1$, $u_2 = 1$.
> - $3019 = 2 \times 1509 + 1$, donc $u_{3019} = u_1 = -1$ ; $3020 = 2 \times 1510$, donc $u_{3020} = u_0 = 1$.

## 4. Sens de variation et convergence

> **📘 Définition — Sens de variation**
>
> - $(u_n)$ est **croissante** si $u_{n+1} - u_n \geq 0$ pour tout $n$ ;
> - **décroissante** si $u_{n+1} - u_n \leq 0$ ;
> - **constante** si $u_{n+1} - u_n = 0$.

> **🧭 Méthode — deux façons d'étudier les variations**
>
> - Étudier le **signe** de $u_{n+1} - u_n$.
> - Si tous les termes sont **strictement positifs**, comparer $\dfrac{u_{n+1}}{u_n}$ à $1$.

> **📘 Définition — Convergence**
>
> Une suite est **convergente** si elle a une limite **finie** ; sinon elle est **divergente**.

> **🏛️ Théorème — Convergence monotone**
>
> - Toute suite **croissante et majorée** converge.
> - Toute suite **décroissante et minorée** converge.
> - Une suite croissante **non majorée** tend vers $+\infty$ ; une suite décroissante **non minorée** tend vers $-\infty$.

> **💡 Pour bien comprendre**
>
> Une balle qui monte **toujours** mais se cogne à un plafond finit par se « coller » à une hauteur précise : elle converge.

> **✏️ Exemple**
>
> Soit $u_n = \dfrac{1}{n(n+1)}$ pour $n \geq 1$. Étudie ses variations et sa convergence.
>
> **Solution.**
>
> - $u_{n+1} - u_n = \dfrac{1}{(n+1)(n+2)} - \dfrac{1}{n(n+1)} = \dfrac{n - (n+2)}{n(n+1)(n+2)} = \dfrac{-2}{n(n+1)(n+2)} < 0$ : la suite est **décroissante**.
> - Elle est **minorée par $0$** (tous les termes sont positifs) : elle **converge**.
> - Le dénominateur tend vers $+\infty$, donc $\displaystyle\lim_{n \to +\infty} u_n = 0$.

## 5. Les suites arithmétiques

> **💡 Pour bien comprendre — l'escalier régulier**
>
> Une suite arithmétique, c'est un escalier dont **toutes les marches ont la même hauteur** $r$ : à chaque pas, on **ajoute** $r$.

> **📘 Définition — Suite arithmétique**
>
> $(u_n)$ est **arithmétique** s'il existe un réel $r$, la **raison**, tel que $u_{n+1} = u_n + r$ pour tout $n$.
> Exemple : $2, 6, 10, 14, 18, \ldots$ est arithmétique de raison $4$.

> **📐 Formules — suite arithmétique de raison $r$**
>
> Terme général :
>
> $$u_n = u_0 + nr$$
>
> $$u_n = u_p + (n - p)r$$
>
> Somme de termes consécutifs :
>
> $$S = \text{(nombre de termes)} \times \frac{\text{premier terme} + \text{dernier terme}}{2}$$
>
> De $u_p$ à $u_n$, il y a $n - p + 1$ termes.

> **💡 Pour bien comprendre — d'où vient la formule de la somme ?**
>
> Écris la somme à l'endroit, puis à l'envers, et additionne colonne par colonne : chaque colonne vaut « premier $+$ dernier ». Avec $N$ colonnes, on obtient $2S = N \times (\text{premier} + \text{dernier})$.

> **🏛️ Propriété — Trois termes en progression arithmétique**
>
> $a$, $b$, $c$ (dans cet ordre) sont en progression arithmétique $\iff a + c = 2b$ : le terme du milieu est la **moyenne** des deux autres.

> **🏛️ Propriété — Variations et limite**
>
> - $r > 0$ : suite **croissante**, elle tend vers $+\infty$ ;
> - $r < 0$ : suite **décroissante**, elle tend vers $-\infty$ ;
> - $r = 0$ : suite **constante**.
>
> Une suite arithmétique de raison non nulle est donc toujours **divergente**.

> **✏️ Exemple**
>
> $(u_n)$ est arithmétique avec $u_{17} = 24$ et $u_{40} = 70$. Trouve $r$ et $u_0$.
>
> **Solution.**
>
> - $u_{40} - u_{17} = (40 - 17)r$, donc $23r = 46$ et $r = 2$.
> - $u_0 = u_{17} - 17r = 24 - 34 = -10$.

## 6. Les suites géométriques

> **💡 Pour bien comprendre — la photocopieuse**
>
> Une suite géométrique, c'est comme une photocopieuse réglée sur un **zoom** $q$ : à chaque copie, on **multiplie** la taille par $q$.

> **📘 Définition — Suite géométrique**
>
> $(u_n)$ est **géométrique** s'il existe un réel $q \neq 0$, la **raison**, tel que $u_{n+1} = q\,u_n$ pour tout $n$.
> Exemple : $3, 1, \frac{1}{3}, \frac{1}{9}, \ldots$ est géométrique de raison $\frac{1}{3}$.

> **📐 Formules — suite géométrique de raison $q$**
>
> Terme général :
>
> $$u_n = u_0\,q^n$$
>
> $$u_n = u_p\,q^{n-p}$$
>
> Somme de $N$ termes consécutifs ($q \neq 1$) :
>
> $$S = \text{premier terme} \times \frac{1 - q^{N}}{1 - q}$$
>
> En particulier :
>
> $$1 + q + q^2 + \cdots + q^n = \frac{1 - q^{n+1}}{1 - q}$$
>
> Si $q = 1$, tous les termes sont égaux et $S = N \times u_p$.

> **🏛️ Propriété — Trois termes en progression géométrique**
>
> $a$, $b$, $c$ (dans cet ordre) sont en progression géométrique $\iff a \times c = b^2$.

> **🏛️ Propriété — Variations** (pour $u_n = u_0\,q^n$ avec $q > 0$)
>
> | | $0 < q < 1$ | $q > 1$ |
> |---|---|---|
> | $u_0 > 0$ | décroissante | croissante |
> | $u_0 < 0$ | croissante | décroissante |
>
> Si $q = 1$, la suite est constante. Si $q < 0$, les signes alternent : la suite est dite **alternée** (ni croissante ni décroissante).

> **🏛️ Théorème — Limite de $q^n$**
>
> - $q > 1$ : $q^n \to +\infty$, la suite diverge (si $u_0 \neq 0$) ;
> - $q = 1$ : $q^n = 1$, la suite est constante ;
> - $-1 < q < 1$ : $q^n \to 0$, la suite **converge vers $0$** ;
> - $q \leq -1$ : $q^n$ n'a pas de limite, la suite diverge.

> **✏️ Exemple**
>
> $(u_n)_{n \geq 1}$ est géométrique **alternée** avec $u_1 = 2$ et $u_3 = 8$. Trouve son terme général, puis $u_2$ et $u_4$.
>
> **Solution.**
>
> - $u_3 = u_1\,q^2$, donc $q^2 = 4$. La suite est alternée, donc $q < 0$ : $q = -2$.
> - $u_n = u_1\,q^{n-1} = 2 \times (-2)^{n-1}$.
> - $u_2 = -4$ et $u_4 = 2 \times (-2)^3 = -16$.

## 7. Les suites arithmético-géométriques

> **📘 Définition — Suite arithmético-géométrique**
>
> $(u_n)$ est **arithmético-géométrique** s'il existe deux réels $\alpha$ et $\beta$ tels que $u_{n+1} = \alpha\,u_n + \beta$ pour tout $n$.
> - Si $\alpha = 1$ : c'est une suite **arithmétique** de raison $\beta$.
> - Si $\beta = 0$ : c'est une suite **géométrique** de raison $\alpha$.

> **🧭 Méthode — l'astuce de la suite auxiliaire** (cas $\alpha \neq 1$)
>
> 1. On cherche le **point fixe** $\ell$, solution de $\ell = \alpha \ell + \beta$ : $\ell = \dfrac{\beta}{1 - \alpha}$.
> 2. On pose $v_n = u_n - \ell$. Alors $v_{n+1} = \alpha\,v_n$ : $(v_n)$ est **géométrique** de raison $\alpha$.
> 3. Donc $v_n = v_0\,\alpha^n$ et on revient à $u_n = v_n + \ell$.

> **📐 Formule — terme général** ($u_0 = \lambda$, $\alpha \neq 1$)
>
> $$u_n = \alpha^n\left(\lambda - \frac{\beta}{1 - \alpha}\right) + \frac{\beta}{1 - \alpha}$$

> **💡 Pour bien comprendre — pourquoi ça marche ?**
>
> Le point fixe $\ell$ est la valeur qui « ne bouge pas ». En mesurant l'**écart** entre $u_n$ et ce point fixe, le $+\beta$ gênant disparaît : il ne reste qu'une multiplication par $\alpha$.

> **✏️ Exemple**
>
> $u_0 = 2$ et $u_{n+1} = 2u_n + 5$. On pose $v_n = u_n + 5$. Montre que $(v_n)$ est géométrique et exprime $u_n$.
>
> **Solution.**
>
> - $v_{n+1} = u_{n+1} + 5 = 2u_n + 10 = 2(u_n + 5) = 2v_n$ : géométrique de raison $2$.
> - $v_0 = 7$, donc $v_n = 7 \times 2^n$ et $u_n = 7 \times 2^n - 5$.

> **✏️ Exemple — avec la formule**
>
> $u_0 = 1$ et $u_{n+1} = 3u_n + 5$. Calcule $u_1$ à $u_4$, puis $u_n$.
>
> **Solution.**
>
> - $u_1 = 8$, $u_2 = 29$, $u_3 = 92$, $u_4 = 281$.
> - Point fixe : $\ell = \dfrac{5}{1 - 3} = -\dfrac{5}{2}$. Donc $v_n = u_n + \dfrac{5}{2}$ est géométrique de raison $3$ avec $v_0 = \dfrac{7}{2}$.
> - $u_n = \dfrac{7}{2} \times 3^n - \dfrac{5}{2}$. Vérification : $u_1 = \dfrac{21}{2} - \dfrac{5}{2} = 8$. ✔

## 8. Les suites adjacentes

> **📘 Définition — Suites adjacentes**
>
> $(u_n)$ et $(v_n)$ sont **adjacentes** si :
> 1. l'une est **croissante** et l'autre **décroissante** ;
> 2. $u_n \leq v_n$ pour tout $n$ ;
> 3. $\displaystyle\lim_{n \to +\infty} (v_n - u_n) = 0$.

> **🏛️ Théorème — Suites adjacentes**
>
> Deux suites adjacentes **convergent vers la même limite** $\ell$, et $u_n \leq \ell \leq v_n$ pour tout $n$.

> **💡 Pour bien comprendre — la pince**
>
> Une suite monte, l'autre descend, et l'écart entre elles se réduit à rien : comme une **pince** qui se referme, elles finissent par se rejoindre au même point.

> **✏️ Exemple**
>
> $u_n = \dfrac{n}{n+1}$ et $v_n = \dfrac{n+2}{n+1}$. Montre qu'elles sont adjacentes.
>
> **Solution.**
>
> - $u_n = 1 - \dfrac{1}{n+1}$ est **croissante** ; $v_n = 1 + \dfrac{1}{n+1}$ est **décroissante**.
> - $v_n - u_n = \dfrac{2}{n+1} > 0$ et $\dfrac{2}{n+1} \to 0$.
> - Elles sont adjacentes ; leur limite commune est $1$.

## 9. Les suites récurrentes linéaires d'ordre 2

> **📘 Définition — Suite récurrente d'ordre 2**
>
> On donne $u_0 = a$, $u_1 = b$ et, pour tout $n$, $u_{n+2} = p\,u_{n+1} + q\,u_n$ (avec $q \neq 0$).
> Chaque terme dépend des **deux** précédents. On lui associe l'**équation caractéristique** :
>
> $$r^2 - pr - q = 0$$
>
> de discriminant $\Delta = p^2 + 4q$.

> **🏛️ Théorème — Forme du terme général** ($A$ et $B$ réels à trouver avec $u_0$ et $u_1$)
>
> - $\Delta > 0$, deux racines réelles $r_1$ et $r_2$ : $u_n = A\,r_1^n + B\,r_2^n$.
> - $\Delta = 0$, racine double $r_0$ : $u_n = (A + Bn)\,r_0^n$.
> - $\Delta < 0$, racines complexes $\rho\,e^{\pm i\theta}$ : $u_n = \rho^n\big(A\cos(n\theta) + B\sin(n\theta)\big)$.

> **🧭 Méthode — en 3 étapes**
>
> 1. Écris l'équation caractéristique et trouve ses racines.
> 2. Écris la forme du terme général qui correspond.
> 3. Trouve $A$ et $B$ en remplaçant $n$ par $0$ puis par $1$.

> **✏️ Exemple — $\Delta > 0$**
>
> $u_0 = 1$, $u_1 = 3$, $u_{n+2} = 4u_{n+1} + 5u_n$.
>
> **Solution.**
>
> - $u_2 = 17$, $u_3 = 83$, $u_4 = 417$.
> - $r^2 - 4r - 5 = 0$ : $r_1 = 5$ et $r_2 = -1$. Donc $u_n = A \times 5^n + B \times (-1)^n$.
> - $A + B = 1$ et $5A - B = 3$, d'où $A = \dfrac{2}{3}$ et $B = \dfrac{1}{3}$ : $u_n = \dfrac{2 \times 5^n + (-1)^n}{3}$.

> **✏️ Exemple — $\Delta = 0$**
>
> $u_0 = 1$, $u_1 = 2$, $u_{n+2} = u_{n+1} - \dfrac{1}{4}u_n$.
>
> **Solution.**
>
> - $u_2 = \dfrac{7}{4}$, $u_3 = \dfrac{5}{4}$, $u_4 = \dfrac{13}{16}$.
> - $r^2 - r + \dfrac{1}{4} = \left(r - \dfrac{1}{2}\right)^2 = 0$ : racine double $\dfrac{1}{2}$. Donc $u_n = (A + Bn)\left(\dfrac{1}{2}\right)^n$.
> - $A = 1$ et $\dfrac{1 + B}{2} = 2$, d'où $B = 3$ : $u_n = \dfrac{1 + 3n}{2^n}$.

> **✏️ Exemple — $\Delta < 0$**
>
> $u_0 = u_1 = \sqrt{3}$, $u_{n+2} = u_{n+1} - u_n$.
>
> **Solution.**
>
> - $u_2 = 0$, $u_3 = -\sqrt{3}$, $u_4 = -\sqrt{3}$.
> - $r^2 - r + 1 = 0$, $\Delta = -3$ : $r = \dfrac{1}{2} \pm i\dfrac{\sqrt{3}}{2} = e^{\pm i\pi/3}$, donc $\rho = 1$ et $\theta = \dfrac{\pi}{3}$.
> - $u_n = A\cos\dfrac{n\pi}{3} + B\sin\dfrac{n\pi}{3}$ ; $u_0$ donne $A = \sqrt{3}$, et $u_1$ donne $\dfrac{\sqrt{3}}{2} + B\dfrac{\sqrt{3}}{2} = \sqrt{3}$, d'où $B = 1$.
> - $u_n = \sqrt{3}\cos\dfrac{n\pi}{3} + \sin\dfrac{n\pi}{3}$.

> **⚠️ Attention — erreurs fréquentes**
>
> - Ne confonds pas : arithmétique → on **ajoute** $r$ ; géométrique → on **multiplie** par $q$.
> - Dans une somme, compte bien le **nombre de termes** : de $u_p$ à $u_n$, il y en a $n - p + 1$ (pas $n - p$).
> - Dans la récurrence, l'hérédité doit **utiliser** l'hypothèse $P(k)$ ; sinon la démonstration ne vaut rien.

> **🎯 À retenir**
>
> - Récurrence = initialisation + hérédité.
> - Arithmétique : $u_n = u_0 + nr$ ; géométrique : $u_n = u_0\,q^n$.
> - Somme : arithmétique → $N \times \frac{\text{premier} + \text{dernier}}{2}$ ; géométrique → $\text{premier} \times \frac{1 - q^N}{1 - q}$.
> - Croissante et majorée (ou décroissante et minorée) ⟹ convergente.
> - $u_{n+1} = \alpha u_n + \beta$ : on passe par la suite $v_n = u_n - \ell$, qui est géométrique.
