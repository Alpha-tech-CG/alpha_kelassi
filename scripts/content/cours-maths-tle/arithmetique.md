# Arithmétique

> **🎯 Dans ce chapitre, tu vas apprendre à…**
>
> - manier la **divisibilité** et la **division euclidienne** ;
> - calculer un **PGCD** (algorithme d'Euclide) et un **PPCM** ;
> - utiliser les théorèmes de **Bézout** et de **Gauss** ;
> - résoudre des **équations diophantiennes** $ax + by = c$ ;
> - calculer avec les **congruences** (Fermat, inverses, restes chinois) ;
> - écrire un nombre dans une autre **base**.

## 1. Divisibilité et division euclidienne

> **📘 Définition — Diviseur, multiple**
>
> Soit $a$ et $b$ des entiers relatifs, $b \neq 0$. On dit que **$b$ divise $a$** (noté $b \mid a$) s'il existe un entier $k$ tel que $a = bk$. On dit aussi que $a$ est un **multiple** de $b$.
> - $\mathcal{D}(a)$ désigne l'ensemble des diviseurs de $a$ ; $b\mathbb{Z}$ celui des multiples de $b$.
> - Exemple : $\mathcal{D}(12) = \{\pm 1 \,;\, \pm 2 \,;\, \pm 3 \,;\, \pm 4 \,;\, \pm 6 \,;\, \pm 12\}$ et $3\mathbb{Z} = \{\ldots \,;\, -6 \,;\, -3 \,;\, 0 \,;\, 3 \,;\, 6 \,;\, \ldots\}$.

> **🏛️ Propriété — Règles de divisibilité**
>
> - $a \mid a$, $1 \mid a$ et $a \mid 0$. Un entier non nul a un nombre **fini** de diviseurs et une **infinité** de multiples.
> - Si $b \mid a$ et $a \neq 0$, alors $|b| \leq |a|$. Si $a \mid b$ et $b \mid a$, alors $|a| = |b|$.
> - **Transitivité** : si $a \mid b$ et $b \mid c$, alors $a \mid c$.
> - Si $a \mid b$, alors $a \mid bk$ pour tout entier $k$.
> - Si $a \mid b$ et $a \mid c$, alors $a \mid (pb + qc)$ pour **tous** entiers $p$ et $q$.

> **💡 Pour bien comprendre — la dernière règle est la plus utile**
>
> Si un nombre divise deux entiers, il divise **toutes leurs combinaisons** : leur somme, leur différence, $3b - 2c$… C'est l'outil principal des exercices du type « montrer que $d$ divise $1$, donc $d = 1$ ».

> **🏛️ Théorème — Division euclidienne**
>
> Pour $a$ entier et $b$ entier non nul, il existe un **unique** couple $(q \,;\, r)$ d'entiers tel que :
>
> $$a = bq + r$$
>
> $$0 \leq r < |b|$$
>
> $q$ est le **quotient**, $r$ le **reste**. $b$ divise $a$ si et seulement si $r = 0$. Exemple : $47 = 8 \times 5 + 7$.

## 2. PGCD et algorithme d'Euclide

> **📘 Définition — PGCD**
>
> Le **PGCD** de deux entiers non nuls $a$ et $b$, noté $\text{PGCD}(a, b)$ ou $a \wedge b$, est le plus grand entier naturel qui divise à la fois $a$ et $b$. Exemple : $\text{PGCD}(24, 30) = 6$.

> **🏛️ Propriété — Règles du PGCD**
>
> - $\text{PGCD}(a, b) = \text{PGCD}(b, a) = \text{PGCD}(|a|, |b|)$.
> - $\text{PGCD}(ka, kb) = |k| \times \text{PGCD}(a, b)$.
> - Si $b \mid a$, alors $\text{PGCD}(a, b) = |b|$.
> - Si $a = bq + r$, alors $\text{PGCD}(a, b) = \text{PGCD}(b, r)$.
> - Les diviseurs communs à $a$ et $b$ sont exactement les diviseurs de leur PGCD.
> - Si $d = \text{PGCD}(a, b)$, alors $a = da'$ et $b = db'$ avec $\text{PGCD}(a', b') = 1$.

> **🧭 Méthode — Algorithme d'Euclide**
>
> On divise $a$ par $b$, puis $b$ par le reste, puis le reste par le nouveau reste… jusqu'à obtenir un reste nul. **Le PGCD est le dernier reste non nul.**

> **✏️ Exemple**
>
> Calcule $\text{PGCD}(304\,939 \,;\, 151\,097)$.
>
> **Solution.**
>
> - $304\,939 = 151\,097 \times 2 + 2\,745$
> - $151\,097 = 2\,745 \times 55 + 122$
> - $2\,745 = 122 \times 22 + 61$
> - $122 = 61 \times 2 + 0$
> - Le dernier reste non nul est $61$ : $\text{PGCD} = 61$.

> **📘 Définition — Nombres premiers entre eux**
>
> $a$ et $b$ sont **premiers entre eux** si $\text{PGCD}(a, b) = 1$ : leur seul diviseur commun positif est $1$. Exemple : $756 = 2^2 \times 3^3 \times 7$ et $221 = 13 \times 17$ sont premiers entre eux.

## 3. Les grands théorèmes : Bézout et Gauss

> **🏛️ Théorème — Identité de Bézout**
>
> Si $d = \text{PGCD}(a, b)$, il existe des entiers $u$ et $v$ tels que $au + bv = d$.
> Plus généralement, un entier $m$ s'écrit $au + bv$ si et seulement si $m$ est un multiple de $d$.

> **🏛️ Théorème — Théorème de Bézout**
>
> $a$ et $b$ sont premiers entre eux $\iff$ il existe des entiers $u$ et $v$ tels que $au + bv = 1$.

> **🏛️ Théorème — Théorème de Gauss**
>
> Si $a$ divise $bc$ et si $a$ est premier avec $b$, alors $a$ divise $c$.

> **💡 Pour bien comprendre — Gauss en image**
>
> Si $7$ divise $3c$, comme $7$ n'a rien en commun avec $3$, tout le « $7$ » doit se trouver dans $c$ : $7$ divise $c$.

> **🧭 Méthode — trouver $u$ et $v$ (remonter Euclide)**
>
> On écrit l'algorithme d'Euclide, on isole chaque reste, puis on **remonte** les égalités en remplaçant les restes un par un, jusqu'à exprimer le PGCD avec $a$ et $b$.

## 4. Les équations diophantiennes $ax + by = c$

> **🏛️ Théorème — Existence de solutions**
>
> Soit $d = \text{PGCD}(a, b)$. L'équation $ax + by = c$ (inconnues entières) a des solutions **si et seulement si $d$ divise $c$**.

> **🧭 Méthode — résoudre $ax + by = c$**
>
> 1. Calcule $d = \text{PGCD}(a, b)$. Si $d$ ne divise pas $c$ : pas de solution. Sinon, divise tout par $d$.
> 2. Trouve une **solution particulière** $(x_0 \,;\, y_0)$ (évidente, ou en remontant Euclide).
> 3. Soustrais : $a(x - x_0) = -b(y - y_0)$, puis applique **Gauss**.
> 4. Conclus : $x = x_0 + bk$ et $y = y_0 - ak$ (avec $a$ et $b$ premiers entre eux), $k \in \mathbb{Z}$.

> **✏️ Exemple**
>
> Résous $12x + 21y = 2$, puis $45x - 28y = 1$.
>
> **Solution.**
>
> - $\text{PGCD}(12, 21) = 3$ ne divise pas $2$ : **aucune solution**.
> - $\text{PGCD}(45, 28) = 1$ : il y a des solutions. En remontant Euclide ($45 = 28 + 17$, $28 = 17 + 11$, $17 = 11 + 6$, $11 = 6 + 5$, $6 = 5 + 1$), on trouve $45 \times 5 - 28 \times 8 = 1$.
> - $45(x - 5) = 28(y - 8)$. Comme $45$ est premier avec $28$, Gauss donne $28 \mid (x - 5)$ : $x = 5 + 28k$, puis $y = 8 + 45k$.
> - Solutions : $\{(5 + 28k \,;\, 8 + 45k) \,;\, k \in \mathbb{Z}\}$.

## 5. PPCM et nombres premiers

> **📘 Définition — PPCM**
>
> Le **PPCM** de $a$ et $b$ non nuls, noté $\text{PPCM}(a, b)$ ou $a \vee b$, est le plus petit multiple commun strictement positif. Exemple : $\text{PPCM}(7, 8) = 56$.

> **📐 Formule — PGCD et PPCM**
>
> $$\text{PGCD}(a, b) \times \text{PPCM}(a, b) = |ab|$$
>
> Et $\text{PPCM}(ka, kb) = |k| \times \text{PPCM}(a, b)$.

> **📘 Définition — Nombre premier**
>
> Un **nombre premier** est un entier naturel qui a **exactement deux** diviseurs positifs : $1$ et lui-même. Les premiers sont $2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, \ldots$ ($1$ n'est **pas** premier).

> **🏛️ Théorème — Nombres premiers**
>
> - Il existe une **infinité** de nombres premiers.
> - Tout entier $n \geq 2$ a au moins un diviseur premier. S'il n'est pas premier, il a un diviseur premier $p$ tel que $p \leq \sqrt{n}$.
> - **Décomposition** : tout entier $n \geq 2$ s'écrit de façon **unique** $n = p_1^{\alpha_1} \times p_2^{\alpha_2} \times \cdots \times p_k^{\alpha_k}$ avec $p_1 < p_2 < \cdots < p_k$ premiers. Exemple : $720 = 2^4 \times 3^2 \times 5$.

> **🧭 Méthode — tester si $n$ est premier**
>
> Essaie de diviser $n$ par les nombres premiers $2, 3, 5, 7, \ldots$ **jusqu'à $\sqrt{n}$** seulement. Si aucun ne divise $n$, alors $n$ est premier.

> **📐 Formules — utiliser la décomposition**
>
> Si $n = p_1^{\alpha_1} \times \cdots \times p_k^{\alpha_k}$ :
> - nombre de diviseurs positifs : $N = (\alpha_1 + 1)(\alpha_2 + 1) \cdots (\alpha_k + 1)$ ;
> - les diviseurs positifs sont les termes du développement de $(1 + p_1 + \cdots + p_1^{\alpha_1}) \times \cdots \times (1 + p_k + \cdots + p_k^{\alpha_k})$ ;
> - PGCD : produit des facteurs communs avec le **plus petit** exposant ; PPCM : produit de tous les facteurs avec le **plus grand** exposant.

> **✏️ Exemple**
>
> Décompose $72$, compte ses diviseurs positifs et donne-les.
>
> **Solution.**
>
> - $72 = 2^3 \times 3^2$, donc $N = (3 + 1)(2 + 1) = 12$ diviseurs.
> - $(1 + 2 + 4 + 8)(1 + 3 + 9)$ donne : $1, 2, 3, 4, 6, 8, 9, 12, 18, 24, 36, 72$.

> **✏️ Exemple — des nombres amis**
>
> Deux nombres sont **amis** si chacun est la somme des diviseurs positifs de l'autre (sauf l'autre lui-même). Montre que $220$ et $284$ sont amis.
>
> **Solution.**
>
> - $220 = 2^2 \times 5 \times 11$ : diviseurs $1, 2, 4, 5, 10, 11, 20, 22, 44, 55, 110, 220$. Somme sans $220$ : $284$.
> - $284 = 2^2 \times 71$ : diviseurs $1, 2, 4, 71, 142, 284$. Somme sans $284$ : $220$. Ils sont amis !

> **🧭 Méthode — systèmes avec PGCD, PPCM, somme ou produit**
>
> On pose $d = \text{PGCD}(x, y)$, $x = da$ et $y = db$ avec $a$ et $b$ **premiers entre eux**. Alors $\text{PPCM}(x, y) = dab$ et $xy = d^2 ab$. On se ramène à chercher des couples $(a \,;\, b)$ premiers entre eux.

> **✏️ Exemple — quatre systèmes dans $\mathbb{N}^2$**
>
> **Solution.**
>
> - $\text{PPCM} = 168$ et $xy = 1008$ : $d = \frac{1008}{168} = 6$ et $ab = 28$ avec $a \wedge b = 1$ : $(a \,;\, b) \in \{(1 \,;\, 28), (4 \,;\, 7), (7 \,;\, 4), (28 \,;\, 1)\}$, donc $(x \,;\, y) \in \{(6 \,;\, 168), (24 \,;\, 42), (42 \,;\, 24), (168 \,;\, 6)\}$.
> - $\text{PGCD} = 354$ et $x + y = 5664$ : $a + b = 16$ avec $a \wedge b = 1$, donc $(a \,;\, b)$ parmi $(1 \,;\, 15)$, $(3 \,;\, 13)$, $(5 \,;\, 11)$, $(7 \,;\, 9)$ et leurs inverses. Par exemple $(x \,;\, y) = (354 \,;\, 5310)$, $(1062 \,;\, 4602)$, $(1770 \,;\, 3894)$, $(2478 \,;\, 3186)$, et les couples inversés.
> - $\text{PPCM} = 504$ et $x + y = 135$ : $d$ divise $\text{PGCD}(135, 504) = 9$. Seul $d = 9$ marche ($a + b = 15$, $ab = 56$, donc $a = 7$, $b = 8$) : $(63 \,;\, 72)$ et $(72 \,;\, 63)$.
> - $\text{PGCD} = 42$ et $\text{PPCM} = 1680$ : $ab = 40$ avec $a \wedge b = 1$ : $(42 \,;\, 1680)$, $(210 \,;\, 336)$, $(336 \,;\, 210)$, $(1680 \,;\, 42)$.

## 6. Les congruences

> **💡 Pour bien comprendre — l'arithmétique de l'horloge**
>
> Sur une horloge, $15$ h, c'est $3$ h : on ne regarde que le **reste** de la division par $12$. Dire « $15 \equiv 3$ modulo $12$ », c'est exactement ça. On oublie les tours complets et on garde le reste.

> **📘 Définition — Congruence**
>
> Soit $n \geq 1$. On dit que $a$ est **congru à $b$ modulo $n$**, et on écrit $a \equiv b \;[n]$, si $a - b$ est un multiple de $n$ ; autrement dit, si $a$ et $b$ ont le **même reste** dans la division par $n$.

> **🏛️ Propriété — On calcule avec les congruences comme avec des égalités**
>
> Si $a \equiv a' \;[n]$ et $b \equiv b' \;[n]$, alors :
> - $a + b \equiv a' + b' \;[n]$ et $ab \equiv a'b' \;[n]$ ;
> - $a^k \equiv a'^k \;[n]$ pour tout entier naturel $k$.
>
> (Et la congruence est réflexive, symétrique et transitive.)

> **⚠️ Attention — on ne divise pas !**
>
> $2 \times 3 \equiv 2 \times 0 \;[6]$, mais $3 \not\equiv 0 \;[6]$. Pour « simplifier » par $a$, il faut utiliser l'**inverse** de $a$ modulo $n$ (voir plus bas), qui n'existe que si $a$ est premier avec $n$.

> **📘 Définition — Ordre modulo $n$**
>
> Si $a$ est premier avec $n$, l'**ordre** de $a$ modulo $n$ est le plus petit entier $k \geq 1$ tel que $a^k \equiv 1 \;[n]$. Les restes de $a^m$ se répètent alors avec la période $k$.
> Exemple : $2004 \equiv -1 \;[5]$, donc $2004^2 \equiv 1 \;[5]$ : l'ordre de $2004$ modulo $5$ est $2$.

> **🏛️ Théorème — Petit théorème de Fermat**
>
> Si $p$ est premier, alors $a^p \equiv a \;[p]$ pour tout entier $a$.
> Si de plus $p$ ne divise pas $a$, alors $a^{p-1} \equiv 1 \;[p]$. L'ordre de $a$ modulo $p$ divise alors $p - 1$.

> **🧭 Méthode — reste de $a^N$ dans la division par $n$**
>
> 1. Cherche une petite puissance $a^k \equiv 1$ (ou $\equiv -1$) modulo $n$.
> 2. Fais la division euclidienne $N = kq + r$.
> 3. Alors $a^N = (a^k)^q \times a^r \equiv a^r \;[n]$.

> **✏️ Exemple — des restes de puissances**
>
> **Solution.**
>
> - $2004 \equiv -1 \;[5]$, donc $2004^{2020} \equiv (-1)^{2020} = 1 \;[5]$ : le reste est $1$.
> - $999 = 27 \times 37$, donc $10^3 \equiv 1 \;[27]$ et $10^{3n} \equiv 1 \;[27]$. Avec $100 = 3 \times 33 + 1$ et $10 = 3 \times 3 + 1$ : $10^{100} + 10^{10} \equiv 10 + 10 = 20 \;[27]$.
> - Les puissances de $2$ modulo $9$ : $2, 4, 8, 7, 5, 1$ (période $6$). Donc $9 \mid 2^n - 1 \iff n$ est un multiple de $6$.

> **✏️ Exemple — modulo 7**
>
> Soit $B_n = 3^{2n+1} + 2^{n+2}$. Montre que $7 \mid B_n$, puis étudie les restes de $5^n$ modulo $7$.
>
> **Solution.**
>
> - $B_n = 3 \times 9^n + 4 \times 2^n \equiv 3 \times 2^n + 4 \times 2^n = 7 \times 2^n \equiv 0 \;[7]$, car $9 \equiv 2 \;[7]$. En particulier, le reste de $B_{2020}$ est $0$.
> - $5^n$ modulo $7$, pour $n = 0, 1, \ldots, 5$ : $1, 5, 4, 6, 2, 3$, puis ça recommence (ordre $6$).
> - $2020 = 6 \times 336 + 4$, donc $5^{2020} \equiv 2 \;[7]$ ; et $5^{2021} \equiv 3 \;[7]$.
> - L'ordre de $4$ modulo $7$ est $3$ ($4^3 = 64 \equiv 1$). Avec $2020 = 3 \times 673 + 1$ : $4^{2020} + 5^{2020} \equiv 4 + 2 = 6 \;[7]$.

> **🏛️ Propriété — L'ordre divise $p - 1$** (ici $p = 7$)
>
> Si $k$ est l'ordre de $a$ modulo $7$ et $6 = kq + r$ avec $0 \leq r < k$, alors $a^r = a^6 \times (a^k)^{-q} \equiv 1 \;[7]$. Comme $k$ est le plus petit, $r = 0$ : **$k$ divise $6$**.

## 7. L'ensemble $\mathbb{Z}/n\mathbb{Z}$

> **📘 Définition — Classes modulo $n$**
>
> La **classe** de $x$ modulo $n$ est l'ensemble $\dot{x}$ des entiers congrus à $x$ modulo $n$. Exemple : modulo $5$, $\dot{2} = \{\ldots, -8, -3, 2, 7, 12, \ldots\}$.
> $\mathbb{Z}/n\mathbb{Z} = \{\dot{0}, \dot{1}, \ldots, \dot{(n-1)}\}$ a exactement $n$ éléments. On y calcule avec $\dot{a} + \dot{b} = \dot{(a+b)}$ et $\dot{a} \times \dot{b} = \dot{(ab)}$.

> **✏️ Exemple — dans $\mathbb{Z}/4\mathbb{Z}$**
>
> Résous le système $\dot{2}x + y = \dot{1}$ et $\dot{3}x + \dot{2}y = \dot{0}$, puis $\dot{3}x + \dot{2} = \dot{3}$ et $x^2 - \dot{3}x + \dot{2} = \dot{0}$.
>
> **Solution.**
>
> - Tables : en ajoutant ou multipliant, on garde le reste modulo $4$ (par exemple $\dot{3} + \dot{2} = \dot{1}$ et $\dot{2} \times \dot{2} = \dot{0}$).
> - Système : $y = \dot{1} - \dot{2}x$, puis $\dot{3}x + \dot{2} - \dot{4}x = \dot{2} - x = \dot{0}$, donc $x = \dot{2}$ et $y = \dot{1}$.
> - $\dot{3}x = \dot{1}$ : comme $\dot{3} \times \dot{3} = \dot{1}$, $x = \dot{3}$.
> - On teste les $4$ classes : $x^2 - \dot{3}x + \dot{2}$ vaut $\dot{2}, \dot{0}, \dot{0}, \dot{2}$ pour $x = \dot{0}, \dot{1}, \dot{2}, \dot{3}$. Solutions : $\dot{1}$ et $\dot{2}$.

## 8. Les équations modulaires

> **📘 Définition — Inverse modulo $n$**
>
> Un **inverse** de $a$ modulo $n$ est un entier $a'$ tel que $aa' \equiv 1 \;[n]$. Exemple : $2 \times 3 = 6 \equiv 1 \;[5]$, donc $3$ est l'inverse de $2$ modulo $5$.

> **🏛️ Théorème — Existence de l'inverse**
>
> $a$ est inversible modulo $n$ $\iff$ $a$ et $n$ sont premiers entre eux. On le trouve avec Bézout : si $au + nv = 1$, alors $u$ est un inverse de $a$.

> **✏️ Exemple**
>
> Trouve l'inverse de $24$ modulo $55$.
>
> **Solution.**
>
> - Euclide : $55 = 24 \times 2 + 7$ ; $24 = 7 \times 3 + 3$ ; $7 = 3 \times 2 + 1$.
> - En remontant : $1 = 7 - 2 \times 3 = 7 - 2(24 - 3 \times 7) = 7 \times 7 - 2 \times 24 = 7(55 - 2 \times 24) - 2 \times 24 = 7 \times 55 - 16 \times 24$.
> - Donc $24 \times (-16) \equiv 1 \;[55]$, et $-16 \equiv 39$ : l'inverse est $39$ (vérification : $24 \times 39 = 936 = 17 \times 55 + 1$).

> **🧭 Méthode — résoudre $ax \equiv b \;[n]$**
>
> - Si $a$ est premier avec $n$ : on multiplie par l'inverse, $x \equiv a^{-1}b \;[n]$.
> - Sinon, soit $d = \text{PGCD}(a, n)$ : si $d \nmid b$, **pas de solution** ; si $d \mid b$, on divise $a$, $b$ et $n$ par $d$ et on se ramène au premier cas.

> **✏️ Exemple**
>
> Résous $5x \equiv 3 \;[7]$ et $60x \equiv 36 \;[144]$.
>
> **Solution.**
>
> - $5 \times 3 = 15 \equiv 1 \;[7]$, donc $5^{-1} \equiv 3$ et $x \equiv 9 \equiv 2 \;[7]$ : $x = 2 + 7k$.
> - $\text{PGCD}(60, 144) = 12$ divise $36$ : on obtient $5x \equiv 3 \;[12]$. Comme $5 \times 5 = 25 \equiv 1 \;[12]$, $x \equiv 15 \equiv 3 \;[12]$ : $x = 3 + 12k$.

> **🏛️ Théorème — Restes chinois**
>
> Si $n_1, \ldots, n_p$ sont premiers entre eux deux à deux, le système $x \equiv a_i \;[n_i]$ a une **unique** solution modulo $N = n_1 \cdots n_p$ :
>
> $$x_0 \equiv \sum_{i=1}^{p} a_i N_i y_i \;[N]$$
>
> $$N_i = \frac{N}{n_i}$$
>
> $$y_i \equiv N_i^{-1} \;[n_i]$$

> **✏️ Exemple — deux méthodes**
>
> Résous le système $2x \equiv 1 \;[5]$ et $3x \equiv 2 \;[7]$.
>
> **Solution.**
>
> - On se ramène à $x \equiv 3 \;[5]$ (car $2^{-1} \equiv 3$) et $x \equiv 3 \;[7]$ (car $3^{-1} \equiv 5$ et $10 \equiv 3$).
> - **Substitution** : $x = 3 + 5p = 3 + 7q$, donc $5p = 7q$ ; par Gauss, $q = 5k$ et $x = 3 + 35k$.
> - **Restes chinois** : $N = 35$, $N_1 = 7$, $N_2 = 5$, $y_1 = 7^{-1} \equiv 3 \;[5]$, $y_2 = 5^{-1} \equiv 3 \;[7]$. $x_0 \equiv 3 \times 7 \times 3 + 3 \times 5 \times 3 = 108 \equiv 3 \;[35]$.
> - Solutions : $x = 3 + 35k$, $k \in \mathbb{Z}$.

## 9. Les systèmes de numération

> **💡 Pour bien comprendre — compter avec moins de doigts**
>
> En base $10$, on fait des paquets de $10$. En base $2$ (binaire, celle des ordinateurs), on fait des paquets de $2$ et on n'a que les chiffres $0$ et $1$. En base $16$ (hexadécimal), on a $16$ chiffres : $0$ à $9$, puis $A = 10$, $B = 11$, $C = 12$, $D = 13$, $E = 14$, $F = 15$.

> **🏛️ Théorème — Écriture en base $b$** ($b \geq 2$)
>
> Tout entier naturel non nul $x$ s'écrit de façon **unique** :
>
> $$x = a_n b^n + a_{n-1}b^{n-1} + \cdots + a_1 b + a_0$$
>
> avec des chiffres $0 \leq a_k < b$ et $a_n \neq 0$. On note $x = \overline{a_n a_{n-1} \ldots a_1 a_0}^{\,b}$ (sans barre, c'est la base $10$).

> **🧭 Méthode — changer de base**
>
> - **De la base $10$ vers la base $b$** : on divise par $b$ encore et encore ; les **restes, lus de bas en haut**, forment l'écriture.
> - **De la base $b$ vers la base $10$** : on additionne chaque chiffre multiplié par la puissance de $b$ correspondante.

> **✏️ Exemple**
>
> Écris $87$ et $1337$ en base $2$, $\overline{10100111001}^{\,2}$ et $\overline{1010111}^{\,2}$ en base $10$, et $64\,206$ en base $16$.
>
> **Solution.**
>
> - $87 = 64 + 16 + 4 + 2 + 1 = \overline{1010111}^{\,2}$ et $1337 = 1024 + 256 + 32 + 16 + 8 + 1 = \overline{10100111001}^{\,2}$.
> - Donc, en sens inverse, $\overline{10100111001}^{\,2} = 1337$ et $\overline{1010111}^{\,2} = 87$.
> - $64\,206 = 16 \times 4012 + 14$ ; $4012 = 16 \times 250 + 12$ ; $250 = 16 \times 15 + 10$ ; $15 = 16 \times 0 + 15$. En lisant les restes de bas en haut : $15, 10, 12, 14$, soit $\overline{FACE}^{\,16}$.

> **🎯 À retenir**
>
> - PGCD : dernier reste non nul de l'algorithme d'Euclide ; $\text{PGCD} \times \text{PPCM} = |ab|$.
> - Bézout : $a \wedge b = 1 \iff au + bv = 1$. Gauss : $a \mid bc$ et $a \wedge b = 1 \Rightarrow a \mid c$.
> - $ax + by = c$ a des solutions $\iff \text{PGCD}(a, b) \mid c$.
> - Congruences : on ajoute, on multiplie, on élève à une puissance… mais on ne divise pas.
> - Fermat : $a^{p-1} \equiv 1 \;[p]$ si $p$ premier ne divise pas $a$.
