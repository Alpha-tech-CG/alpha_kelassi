# Dénombrement

> **🎯 Dans ce chapitre, tu vas apprendre à…**
>
> - manier les **ensembles** (réunion, intersection, complémentaire, parties) ;
> - compter avec le **cardinal** ;
> - reconnaître une **liste**, un **arrangement**, une **permutation**, une **combinaison** ;
> - utiliser le **binôme de Newton** ;
> - compter les **tirages** (successifs ou simultanés, avec ou sans remise).

## 1. Les ensembles

> **📘 Définition — Ensemble, élément**
>
> Un **ensemble** est une collection d'objets, appelés **éléments**. On note $x \in E$ si $x$ appartient à $E$, et $x \notin E$ sinon. Un ensemble est **fini** si on peut compter ses éléments : par exemple $E = \{0, 1, 2, 3, 4, 5, 6\}$.

> **📘 Définition — Opérations sur les ensembles**
>
> - **Réunion** $A \cup B$ : les éléments qui sont dans $A$ **ou** dans $B$ (ou dans les deux).
> - **Intersection** $A \cap B$ : les éléments qui sont dans $A$ **et** dans $B$. Si $A \cap B = \emptyset$, $A$ et $B$ sont **disjoints**.
> - **Différence** $A \setminus B$ : les éléments de $A$ qui ne sont **pas** dans $B$.
> - **Partie** : $A \subset B$ si tout élément de $A$ est dans $B$. L'ensemble de **toutes** les parties de $E$ se note $\mathcal{P}(E)$ ; il contient $\emptyset$ et $E$.
> - **Complémentaire** de $A$ dans $\Omega$ : $\overline{A}$, les éléments de $\Omega$ qui ne sont pas dans $A$.

> **💡 Pour bien comprendre — « ou » et « et »**
>
> Dans une classe, $A$ = « ceux qui aiment le foot » et $B$ = « ceux qui aiment la musique ». $A \cup B$ : ceux qui aiment **au moins un** des deux. $A \cap B$ : ceux qui aiment **les deux**.

> **🏛️ Propriété — Complémentaire**
>
> - $A \cap \overline{A} = \emptyset$ et $A \cup \overline{A} = \Omega$ : $A$ et $\overline{A}$ forment une **partition** de $\Omega$. Et $\overline{\overline{A}} = A$.
> - **Lois de Morgan** : $\overline{A \cap B} = \overline{A} \cup \overline{B}$ et $\overline{A \cup B} = \overline{A} \cap \overline{B}$.

> **✏️ Exemple**
>
> Avec $A = \{0, 1, 2, 5, 7\}$ et $B = \{1, 2, 3, 5, 6, 7\}$, puis $\Omega = \{3, 4, \ldots, 10\}$ et $C = \{3, 4, 5\}$.
>
> **Solution.**
>
> - $A \setminus B = \{0\}$ et $B \setminus A = \{3, 6\}$.
> - $\overline{C} = \{6, 7, 8, 9, 10\}$.

## 2. Le cardinal

> **📘 Définition — Cardinal**
>
> Le **cardinal** d'un ensemble fini $E$, noté $\text{card}(E)$, est son nombre d'éléments. $\text{card}(\emptyset) = 0$. **Dénombrer**, c'est calculer un cardinal.

> **📐 Formules — cardinaux**
>
> $$\text{card}(A \cup B) = \text{card}(A) + \text{card}(B) - \text{card}(A \cap B)$$
>
> $$\text{card}(\overline{A}) = \text{card}(\Omega) - \text{card}(A)$$
>
> $$\text{card}\big(\mathcal{P}(E)\big) = 2^n \quad \text{si } \text{card}(E) = n$$
>
> Si $A$ et $B$ sont disjoints, $\text{card}(A \cup B) = \text{card}(A) + \text{card}(B)$.

> **💡 Pour bien comprendre — pourquoi enlever $\text{card}(A \cap B)$ ?**
>
> Les élèves qui aiment le foot **et** la musique ont été comptés **deux fois** (une fois dans $A$, une fois dans $B$). On les retire une fois.

> **✏️ Exemple**
>
> Soit $E = \{a, b, c\}$. Combien a-t-il de parties ? Donne-les.
>
> **Solution.**
>
> - $\text{card}(E) = 3$, donc $2^3 = 8$ parties.
> - $\mathcal{P}(E) = \{\emptyset, \{a\}, \{b\}, \{c\}, \{a, b\}, \{a, c\}, \{b, c\}, \{a, b, c\}\}$.

## 3. Le principe multiplicatif et les listes

> **📘 Définition — Produit cartésien**
>
> $A \times B$ est l'ensemble des **couples** $(x \,;\, y)$ avec $x \in A$ et $y \in B$. L'ordre compte : en général $A \times B \neq B \times A$.

> **🏛️ Théorème — Principe multiplicatif**
>
> $$\text{card}(E_1 \times E_2 \times \cdots \times E_p) = \text{card}(E_1) \times \text{card}(E_2) \times \cdots \times \text{card}(E_p)$$
>
> En particulier, le nombre de **$p$-listes** (avec répétition possible) d'éléments d'un ensemble à $n$ éléments est $n^p$. C'est aussi le nombre d'applications d'un ensemble à $p$ éléments vers un ensemble à $n$ éléments.

> **💡 Pour bien comprendre — l'arbre des choix**
>
> Si tu choisis une chemise parmi $3$ et un pantalon parmi $4$, tu as $3 \times 4 = 12$ tenues. Chaque choix se **multiplie** avec les autres.

> **✏️ Exemple**
>
> À une soirée, il y a $3$ filles et $2$ garçons. Combien de couples fille–garçon peut-on former ?
>
> **Solution.** $3 \times 2 = 6$ couples.

## 4. Arrangements et permutations

> **📘 Définition — Factorielle**
>
> Pour $n$ entier naturel, $n! = n \times (n - 1) \times \cdots \times 2 \times 1$, avec la convention $0! = 1$.
> Exemples : $3! = 6$ ; $5! = 120$ ; $9! = 362\,880$.

> **📘 Définition — Arrangement**
>
> Un **arrangement** de $p$ éléments d'un ensemble à $n$ éléments ($p \leq n$) est une liste **ordonnée** de $p$ éléments **tous différents**.
>
> $$A_n^p = \frac{n!}{(n - p)!} = n(n - 1)\cdots(n - p + 1)$$
>
> Exemples : $A_5^2 = 5 \times 4 = 20$ ; $A_6^5 = 720$.

> **📘 Définition — Permutation**
>
> Une **permutation** de $n$ éléments est une façon de les **ranger tous** dans un ordre : il y en a $A_n^n = n!$.
> Si certains éléments se répètent ($r_1$ fois, $r_2$ fois, …), le nombre de rangements différents est :
>
> $$\frac{n!}{r_1! \times r_2! \times \cdots \times r_k!}$$

> **💡 Pour bien comprendre — le podium**
>
> Avec $8$ coureurs, combien de podiums (or, argent, bronze) ? $8$ choix pour l'or, puis $7$ pour l'argent, puis $6$ pour le bronze : $A_8^3 = 336$. L'**ordre compte** et on ne peut pas être deux fois sur le podium : c'est un arrangement.

> **✏️ Exemple — des nombres et des mots**
>
> Combien de nombres de $3$ chiffres peut-on écrire avec $1, 2, 3, 4, 5$ ? Combien de mots avec les lettres de ANE ? De AABCCC ?
>
> **Solution.**
>
> - Chiffres répétés permis : $5^3 = 125$. Chiffres tous différents : $A_5^3 = 5 \times 4 \times 3 = 60$.
> - ANE : $3! = 6$ mots.
> - AABCCC ($6$ lettres, A deux fois, C trois fois) : $\dfrac{6!}{2! \times 1! \times 3!} = \dfrac{720}{12} = 60$ mots.

## 5. Les combinaisons

> **📘 Définition — Combinaison**
>
> Une **combinaison** de $p$ éléments d'un ensemble à $n$ éléments est une **partie** à $p$ éléments : l'**ordre ne compte pas**. Leur nombre est :
>
> $$C_n^p = \binom{n}{p} = \frac{n!}{p!\,(n - p)!} = \frac{A_n^p}{p!}$$

> **💡 Pour bien comprendre — la poignée de bonbons**
>
> Prendre une poignée de $3$ bonbons dans un sac : peu importe l'ordre dans lequel ils arrivent dans ta main, c'est la **même** poignée. On divise donc les arrangements par $p!$, le nombre de façons de ranger les $p$ bonbons.

> **🏛️ Propriété — Règles des combinaisons**
>
> - $C_n^0 = C_n^n = 1$ ; $C_n^1 = n$ ; $C_n^p = C_n^{n-p}$ (choisir ceux qu'on prend, c'est choisir ceux qu'on laisse).
> - **Formule de Pascal** : $C_{n-1}^{p-1} + C_{n-1}^{p} = C_n^p$ (pour $0 < p < n$).

> **📐 Formule — Binôme de Newton**
>
> $$(a + b)^n = \sum_{k=0}^{n} C_n^k\,a^{n-k}b^k$$
>
> Les coefficients se lisent dans le **triangle de Pascal** : $1$ ; $1, 1$ ; $1, 2, 1$ ; $1, 3, 3, 1$ ; $1, 4, 6, 4, 1$ ; $1, 5, 10, 10, 5, 1$ ; …

> **✏️ Exemple**
>
> Développe $(a + b)^4$ et $(a + b)^5$.
>
> **Solution.**
>
> - $(a + b)^4 = a^4 + 4a^3b + 6a^2b^2 + 4ab^3 + b^4$.
> - $(a + b)^5 = a^5 + 5a^4b + 10a^3b^2 + 10a^2b^3 + 5ab^4 + b^5$.

## 6. Les tirages

> **🏛️ Propriété — Compter des tirages de $p$ objets parmi $n$**
>
> | Type de tirage | L'ordre compte ? | Répétitions ? | Nombre de tirages |
> |---|---|---|---|
> | successifs **avec** remise | oui | oui | $n^p$ |
> | successifs **sans** remise | oui | non | $A_n^p$ |
> | **simultanés** | non | non | $C_n^p$ |

> **🧭 Méthode — choisir le bon outil**
>
> Pose-toi deux questions :
> 1. **L'ordre compte-t-il ?** (un code, un classement : oui ; une poignée, un groupe : non)
> 2. **Peut-on reprendre le même élément ?** (avec remise : oui)
>
> Ordre + répétitions → $n^p$ ; ordre sans répétition → $A_n^p$ ; ni ordre ni répétition → $C_n^p$.

> **✏️ Exemple**
>
> Une urne contient $10$ boules. On en tire $3$.
>
> **Solution.**
>
> - Successivement avec remise : $10^3 = 1000$ tirages.
> - Successivement sans remise : $A_{10}^3 = 10 \times 9 \times 8 = 720$ tirages.
> - Simultanément : $C_{10}^3 = \dfrac{720}{6} = 120$ tirages.

> **🎯 À retenir**
>
> - $\text{card}(A \cup B) = \text{card}(A) + \text{card}(B) - \text{card}(A \cap B)$ ; $\text{card}(\mathcal{P}(E)) = 2^n$.
> - $p$-listes : $n^p$ ; arrangements : $A_n^p = \frac{n!}{(n-p)!}$ ; permutations : $n!$ ; combinaisons : $C_n^p = \frac{n!}{p!(n-p)!}$.
> - L'ordre compte → arrangement ; l'ordre ne compte pas → combinaison.
> - $(a + b)^n = \sum C_n^k a^{n-k}b^k$.
