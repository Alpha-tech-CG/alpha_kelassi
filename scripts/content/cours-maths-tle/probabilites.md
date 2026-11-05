# Probabilités

> **🎯 Dans ce chapitre, tu vas apprendre à…**
>
> - parler le langage des **événements** ;
> - calculer une **probabilité**, en particulier quand il y a **équiprobabilité** ;
> - utiliser les **probabilités conditionnelles**, les **arbres** et la formule des **probabilités totales** ;
> - étudier une **variable aléatoire** : loi, espérance, variance, fonction de répartition ;
> - reconnaître les lois de **Bernoulli**, **binomiale**, **uniforme** et **exponentielle**.

## 1. Le vocabulaire

> **📘 Définition — Expérience, univers, événement**
>
> - Une **expérience aléatoire** est une expérience dont on ne peut pas prévoir le résultat (exemple : lancer un dé).
> - Une **éventualité** (ou **issue**) est un résultat possible.
> - L'**univers** $\Omega$ est l'ensemble de toutes les issues. Pour un dé : $\Omega = \{1, 2, 3, 4, 5, 6\}$.
> - Un **événement** est une partie de $\Omega$. « Obtenir un nombre pair » : $A = \{2, 4, 6\}$.
> - Un **événement élémentaire** contient une seule issue.
> - $\Omega$ est l'événement **certain** ; $\emptyset$ est l'événement **impossible** (obtenir $7$ avec un dé).
> - $A$ et $B$ sont **incompatibles** s'ils ne peuvent pas se réaliser ensemble : $A \cap B = \emptyset$.
> - L'événement **contraire** de $A$ est $\overline{A}$ : il se réalise quand $A$ ne se réalise pas.

## 2. La probabilité d'un événement

> **📘 Définition — Probabilité**
>
> Une **probabilité** sur $\Omega$ associe à chaque événement $A$ un nombre $p(A)$ entre $0$ et $1$, avec $p(\Omega) = 1$, et telle que $p(A \cup B) = p(A) + p(B)$ quand $A$ et $B$ sont incompatibles.

> **🏛️ Propriété — Règles de calcul**
>
> - $p(\emptyset) = 0$ et $0 \leq p(A) \leq 1$.
> - $p(\overline{A}) = 1 - p(A)$.
> - $p(A \cup B) = p(A) + p(B) - p(A \cap B)$.
> - Si $A \subset B$, alors $p(A) \leq p(B)$.

> **📐 Formule — Équiprobabilité**
>
> Si toutes les issues ont la même chance (chacune a la probabilité $\frac{1}{n}$), alors :
>
> $$p(A) = \frac{\text{card}(A)}{\text{card}(\Omega)} = \frac{\text{nombre de cas favorables}}{\text{nombre de cas possibles}}$$
>
> On repère l'équiprobabilité par des mots comme : *au hasard*, *dé équilibré*, *non truqué*, *non pipé*, *pièce parfaite*, *boules indiscernables au toucher*, *cartes bien battues*.

> **💡 Pour bien comprendre — le bon réflexe**
>
> Une probabilité, c'est la **part** des chances qui sont favorables. Avant de calculer, demande-toi toujours : « Combien de cas possibles ? Combien me conviennent ? » Et souvent, il est plus simple de calculer le **contraire** (« au moins un » ↔ « aucun »).

> **✏️ Exemple**
>
> On lance un dé équilibré. Probabilité d'obtenir un nombre pair ? Un nombre au moins égal à $5$ ?
>
> **Solution.**
>
> - $\{2, 4, 6\}$ : $p = \dfrac{3}{6} = \dfrac{1}{2}$.
> - $\{5, 6\}$ : $p = \dfrac{2}{6} = \dfrac{1}{3}$.

## 3. Les probabilités conditionnelles

> **📘 Définition — Probabilité conditionnelle**
>
> Si $p(B) \neq 0$, la probabilité de $A$ **sachant** $B$ est :
>
> $$p_B(A) = \frac{p(A \cap B)}{p(B)}$$
>
> D'où la formule utile : $p(A \cap B) = p(B) \times p_B(A) = p(A) \times p_A(B)$.

> **💡 Pour bien comprendre — on change d'univers**
>
> « Sachant $B$ », c'est comme si on te disait : « $B$ s'est réalisé ». L'univers se **réduit** à $B$, et on regarde quelle part de $B$ est aussi dans $A$.

> **📘 Définition — Événements indépendants**
>
> $A$ et $B$ sont **indépendants** si $p(A \cap B) = p(A) \times p(B)$. Quand les probabilités sont non nulles, cela équivaut à $p_B(A) = p(A)$ : savoir que $B$ s'est réalisé ne change **pas** la probabilité de $A$.

> **⚠️ Attention — indépendants ≠ incompatibles**
>
> - **Incompatibles** : $A \cap B = \emptyset$, ils ne peuvent **pas** arriver ensemble.
> - **Indépendants** : l'un n'**influence** pas l'autre, $p(A \cap B) = p(A) \times p(B)$.
>
> Deux événements incompatibles de probabilités non nulles ne sont **jamais** indépendants (si l'un arrive, l'autre est impossible : il y a bien une influence !).

> **🧭 Méthode — l'arbre pondéré**
>
> 1. Chaque branche porte une probabilité ; celles qui partent d'un même nœud ont une **somme égale à $1$**.
> 2. La probabilité d'un **chemin** est le **produit** des probabilités de ses branches : $p(A \cap B) = p(A) \times p_A(B)$.
> 3. La probabilité d'un événement est la **somme** des probabilités des chemins qui y mènent.

> **🏛️ Théorème — Probabilités totales et formule de Bayes**
>
> Si $A_1, \ldots, A_n$ forment un **système complet** (ils sont incompatibles deux à deux et leur réunion est $\Omega$) :
>
> $$p(B) = p(A_1)\,p_{A_1}(B) + \cdots + p(A_n)\,p_{A_n}(B)$$
>
> En particulier, avec $A$ et $\overline{A}$ : $p(B) = p(A)\,p_A(B) + p(\overline{A})\,p_{\overline{A}}(B)$.
> **Bayes** (pour « remonter » l'arbre) :
>
> $$p_B(A) = \frac{p(A)\,p_A(B)}{p(A)\,p_A(B) + p(\overline{A})\,p_{\overline{A}}(B)}$$

> **✏️ Exemple — un contrôle qualité**
>
> Une usine produit $1{,}8\,\%$ de pièces défectueuses. Une pièce bonne est acceptée avec la probabilité $0{,}97$ ; une pièce mauvaise est refusée avec la probabilité $0{,}99$. $A$ = « la pièce est défectueuse », $B$ = « la pièce est refusée ».
>
> **Solution.**
>
> - $p(A) = 0{,}018$ ; $p_A(B) = 0{,}99$ ; $p_{\overline{A}}(B) = 1 - 0{,}97 = 0{,}03$.
> - Défectueuse **et** acceptée : $p(A \cap \overline{B}) = 0{,}018 \times 0{,}01 = 0{,}000\,18$.
> - Bonne **et** refusée : $p(\overline{A} \cap B) = 0{,}982 \times 0{,}03 = 0{,}029\,46$.
> - Erreur de contrôle $C$ (l'un ou l'autre, incompatibles) : $p(C) = 0{,}000\,18 + 0{,}029\,46 = 0{,}029\,64$.

## 4. Les variables aléatoires

> **📘 Définition — Variable aléatoire et loi**
>
> Une **variable aléatoire** $X$ associe un **nombre** à chaque issue (par exemple un gain). Ses valeurs $x_1 < x_2 < \cdots < x_n$ forment l'**univers image** $X(\Omega)$.
> Sa **loi de probabilité** donne $p_i = p(X = x_i)$ pour chaque valeur, dans un tableau. La somme des $p_i$ vaut $1$.

> **🧭 Méthode — « au plus », « au moins »**
>
> - « Au plus $x_3$ » : $p(X \leq x_3) = p_1 + p_2 + p_3$.
> - « Au moins $x_3$ » : $p(X \geq x_3) = 1 - p(X < x_3) = 1 - (p_1 + p_2)$.
> - « Strictement plus que $x_4$ » : $p(X > x_4) = 1 - (p_1 + p_2 + p_3 + p_4)$.

> **📐 Formules — espérance, variance, écart-type**
>
> $$E(X) = \sum_{i=1}^{n} x_i\,p_i$$
>
> $$V(X) = \sum_{i=1}^{n} \big(x_i - E(X)\big)^2 p_i = E(X^2) - \big(E(X)\big)^2$$
>
> $$\sigma(X) = \sqrt{V(X)}$$
>
> Pour un jeu : $E(X) > 0$, il est **favorable** au joueur ; $E(X) < 0$, **défavorable** ; $E(X) = 0$, il est **équitable** (la variable est dite centrée).

> **💡 Pour bien comprendre — la moyenne sur le long terme**
>
> L'espérance, c'est ce que tu gagnerais **en moyenne par partie** si tu jouais un très grand nombre de fois. Pour un dé, $E(X) = \frac{1 + 2 + \cdots + 6}{6} = 3{,}5$ : aucune face ne vaut $3{,}5$, mais c'est la moyenne à long terme.

> **📘 Définition — Fonction de répartition (cas discret)**
>
> $F(x) = p(X \leq x)$. C'est une fonction **en escalier**, croissante, de $0$ (avant $x_1$) à $1$ (après $x_n$) : $F(x) = 0$ si $x < x_1$, $F(x) = p_1$ sur $[x_1 \,;\, x_2[$, $F(x) = p_1 + p_2$ sur $[x_2 \,;\, x_3[$, …, $F(x) = 1$ sur $[x_n \,;\, +\infty[$.

## 5. Bernoulli et la loi binomiale

> **📘 Définition — Épreuve et schéma de Bernoulli**
>
> - Une **épreuve de Bernoulli** a deux issues : le **succès** $S$, de probabilité $p$, et l'**échec**, de probabilité $q = 1 - p$. La variable qui vaut $1$ en cas de succès et $0$ sinon a $E = p$ et $V = pq$.
> - Un **schéma de Bernoulli** consiste à répéter $n$ fois, de façon **indépendante**, la même épreuve.

> **🏛️ Théorème — Loi binomiale $\mathcal{B}(n, p)$**
>
> Le nombre $X$ de succès dans un schéma de Bernoulli suit la loi binomiale de paramètres $n$ et $p$ :
>
> $$p(X = k) = C_n^k\,p^k\,(1 - p)^{n-k}$$
>
> $$0 \leq k \leq n$$
>
> $$E(X) = np$$
>
> $$V(X) = np(1 - p)$$
>
> $$\sigma(X) = \sqrt{np(1 - p)}$$

> **💡 Pour bien comprendre — d'où vient $C_n^k$ ?**
>
> Un chemin avec $k$ succès et $n - k$ échecs a la probabilité $p^k q^{n-k}$. Et il y a $C_n^k$ façons de **placer** les $k$ succès parmi les $n$ épreuves.

> **✏️ Exemple — suite du contrôle qualité**
>
> On contrôle $5$ pièces de façon indépendante. $X$ est le nombre d'erreurs de contrôle.
>
> **Solution.**
>
> - $X$ suit la loi binomiale $\mathcal{B}(5 \,;\, 0{,}029\,64)$.
> - $E(X) = 5 \times 0{,}029\,64 \approx 0{,}148$ ; $V(X) \approx 0{,}148 \times 0{,}970\,36 \approx 0{,}144$ ; $\sigma(X) \approx 0{,}379$.
> - Exactement deux erreurs : $p(X = 2) = C_5^2 \times 0{,}029\,64^2 \times 0{,}970\,36^3 \approx 0{,}008\,0$.
> - Exactement trois erreurs : $p(X = 3) = C_5^3 \times 0{,}029\,64^3 \times 0{,}970\,36^2 \approx 0{,}000\,25$.

## 6. Les variables aléatoires continues

> **📘 Définition — Densité et fonction de répartition**
>
> Une variable aléatoire **continue** peut prendre toutes les valeurs d'un intervalle. Elle est décrite par une **densité** $f$ : une fonction **positive**, continue par morceaux, avec $\displaystyle\int_{-\infty}^{+\infty} f(x)\,dx = 1$.
>
> $$p(a \leq X \leq b) = \int_a^b f(x)\,dx$$
>
> Sa **fonction de répartition** est $F(t) = p(X \leq t) = \displaystyle\int_{-\infty}^{t} f(x)\,dx$.

> **💡 Pour bien comprendre — l'aire, c'est la probabilité**
>
> Pour une variable continue, la probabilité est une **aire sous la courbe** de la densité. Conséquence étonnante : $p(X = a) = 0$ pour tout $a$ (un seul point n'a pas d'aire). Donc $p(X \leq b) = p(X < b)$.

> **🏛️ Propriété — Fonction de répartition (cas continu)**
>
> - $F$ est continue, croissante, à valeurs dans $[0 \,;\, 1]$, avec $F(t) \to 0$ en $-\infty$ et $F(t) \to 1$ en $+\infty$.
> - $F' = f$ là où $f$ est continue : $F$ est une **primitive** de la densité.
> - $p(a \leq X \leq b) = F(b) - F(a)$.

> **📐 Formules — espérance et variance (cas continu)**
>
> $$E(X) = \int_{-\infty}^{+\infty} x\,f(x)\,dx$$
>
> $$V(X) = E(X^2) - \big(E(X)\big)^2 \quad \text{avec} \quad E(X^2) = \int_{-\infty}^{+\infty} x^2 f(x)\,dx$$
>
> Et dans tous les cas : $E(aX + b) = aE(X) + b$, $V(aX + b) = a^2V(X)$, $\sigma(aX + b) = |a|\,\sigma(X)$.

> **✏️ Exemple — une densité à trouver**
>
> $X$ a pour densité $f(x) = \alpha(4x - x^2)$ sur $[0 \,;\, 4]$ (et $0$ ailleurs).
>
> **Solution.**
>
> - $\displaystyle\int_0^4 (4x - x^2)\,dx = \left[2x^2 - \frac{x^3}{3}\right]_0^4 = 32 - \frac{64}{3} = \frac{32}{3}$, donc $\alpha = \dfrac{3}{32}$.
> - Pour $x \in [0 \,;\, 4]$ : $F(x) = \dfrac{6x^2 - x^3}{32}$ ; $F(x) = 0$ si $x < 0$ et $F(x) = 1$ si $x > 4$.
> - $p(1 \leq X \leq 3) = F(3) - F(1) = \dfrac{27}{32} - \dfrac{5}{32} = \dfrac{11}{16}$.
> - La densité est symétrique autour de $2$, donc $E(X) = 2$. $E(X^2) = \dfrac{3}{32}\displaystyle\int_0^4 (4x^3 - x^4)\,dx = \dfrac{3}{32} \times \dfrac{256}{5} = \dfrac{24}{5}$.
> - $V(X) = \dfrac{24}{5} - 4 = \dfrac{4}{5}$ et $\sigma(X) = \dfrac{2}{\sqrt{5}} \approx 0{,}89$.

> **🏛️ Propriété — Deux lois continues à connaître**
>
> | Loi | Densité | $E(X)$ | $V(X)$ |
> |---|---|---|---|
> | uniforme sur $[a \,;\, b]$ | $\dfrac{1}{b - a}$ sur $[a \,;\, b]$, $0$ ailleurs | $\dfrac{a + b}{2}$ | $\dfrac{(b - a)^2}{12}$ |
> | exponentielle de paramètre $\lambda > 0$ | $\lambda e^{-\lambda x}$ pour $x \geq 0$, $0$ sinon | $\dfrac{1}{\lambda}$ | $\dfrac{1}{\lambda^2}$ |

> **💡 Pour bien comprendre**
>
> - **Uniforme** : toutes les valeurs de $[a \,;\, b]$ ont « la même chance », comme l'heure d'arrivée d'un bus si on ne sait rien.
> - **Exponentielle** : elle décrit la **durée de vie** d'un objet qui ne s'use pas (un composant électronique) ; $p(X > t) = e^{-\lambda t}$.

> **🎯 À retenir**
>
> - Équiprobabilité : $p(A) = \frac{\text{cas favorables}}{\text{cas possibles}}$ ; $p(\overline{A}) = 1 - p(A)$.
> - $p_B(A) = \frac{p(A \cap B)}{p(B)}$ ; arbre : on multiplie le long d'un chemin, on additionne les chemins.
> - Indépendants : $p(A \cap B) = p(A)\,p(B)$ — à ne pas confondre avec incompatibles.
> - $E(X) = \sum x_i p_i$ ; $V(X) = E(X^2) - E(X)^2$.
> - Binomiale : $p(X = k) = C_n^k p^k (1-p)^{n-k}$, $E = np$, $V = np(1-p)$.
> - Densité : la probabilité est une aire, $p(a \leq X \leq b) = \int_a^b f$.
