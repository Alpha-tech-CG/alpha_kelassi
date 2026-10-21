# Algèbre linéaire

> **🎯 Dans ce chapitre, tu vas apprendre à…**
>
> - reconnaître un **espace vectoriel** et un **sous-espace vectoriel** ;
> - dire si une famille de vecteurs est **libre**, **liée**, **génératrice**, si c'est une **base** ;
> - travailler avec une **application linéaire**, sa **matrice**, son **noyau** et son **image** ;
> - reconnaître une **projection** et une **symétrie** vectorielles.

## 1. Les espaces vectoriels

> **💡 Pour bien comprendre — le monde des flèches**
>
> Les vecteurs du plan, on sait les **additionner** (mettre les flèches bout à bout) et les **multiplier par un nombre** (les allonger, les raccourcir, les retourner). Un **espace vectoriel**, c'est n'importe quel ensemble où ces deux opérations marchent avec les mêmes règles que pour les flèches.

> **📘 Définition — Espace vectoriel sur $\mathbb{R}$**
>
> Un ensemble $E$ non vide est un **espace vectoriel** s'il est muni :
> - d'une **addition** ($\vec{u} + \vec{v}$ est dans $E$) qui est associative, commutative, a un élément neutre $\vec{0}$, et où chaque vecteur a un opposé ;
> - d'une **multiplication par un réel** ($\lambda\vec{u}$ est dans $E$) telle que, pour tous réels $\lambda$, $\mu$ et vecteurs $\vec{u}$, $\vec{v}$ :
>   - $\lambda(\mu\vec{u}) = (\lambda\mu)\vec{u}$ et $1 \cdot \vec{u} = \vec{u}$ ;
>   - $(\lambda + \mu)\vec{u} = \lambda\vec{u} + \mu\vec{u}$ et $\lambda(\vec{u} + \vec{v}) = \lambda\vec{u} + \lambda\vec{v}$.
>
> Les éléments de $E$ sont des **vecteurs** ; les réels sont des **scalaires**. Exemples : $\mathbb{R}^2$ (le plan vectoriel), $\mathbb{R}^3$ (l'espace), et plus généralement $\mathbb{R}^n$.

> **🏛️ Propriété — Règles de calcul**
>
> - $\lambda\vec{u} = \vec{0} \iff \lambda = 0$ ou $\vec{u} = \vec{0}$.
> - $\vec{a} + \vec{c} = \vec{b} + \vec{c} \iff \vec{a} = \vec{b}$.
> - $(-\lambda)\vec{u} = \lambda(-\vec{u}) = -(\lambda\vec{u})$.

## 2. Les sous-espaces vectoriels

> **📘 Définition — Sous-espace vectoriel**
>
> Une partie $F$ de $E$ est un **sous-espace vectoriel** si :
> 1. $F$ contient $\vec{0}$ (donc $F$ n'est pas vide) ;
> 2. pour tous $\vec{u}$, $\vec{v}$ de $F$ et tous réels $\alpha$, $\beta$ : $\alpha\vec{u} + \beta\vec{v} \in F$.
>
> On dit que $F$ est **stable** par combinaison linéaire.

> **💡 Pour bien comprendre — une pièce fermée**
>
> Un sous-espace, c'est une « pièce » de $E$ dont on ne peut pas sortir en additionnant ou en multipliant : par exemple une **droite** ou un **plan** qui passent par l'origine. Une droite qui ne passe pas par $\vec{0}$ n'est **pas** un sous-espace.

> **✏️ Exemple**
>
> Montre que $D = \{(x \,;\, y) \in \mathbb{R}^2 \mid x + y = 0\}$ est un sous-espace vectoriel de $\mathbb{R}^2$.
>
> **Solution.**
>
> - $(0 \,;\, 0) \in D$ car $0 + 0 = 0$.
> - Si $(x \,;\, y)$ et $(x' \,;\, y')$ sont dans $D$, alors $(\alpha x + \beta x') + (\alpha y + \beta y') = \alpha(x + y) + \beta(x' + y') = 0$.
> - Donc $D$ est un sous-espace vectoriel (c'est une droite vectorielle). De la même façon, $P = \{(x \,;\, y \,;\, z) \mid 2x - y + 3z = 0\}$ est un sous-espace de $\mathbb{R}^3$ (un plan vectoriel).

> **🏛️ Propriété — Intersection et somme**
>
> Si $F$ et $G$ sont des sous-espaces de $E$ :
> - $F \cap G$ et $F + G = \{\vec{u} + \vec{v} \mid \vec{u} \in F, \vec{v} \in G\}$ sont des sous-espaces de $E$ ;
> - si $F \cap G = \{\vec{0}\}$, la somme est **directe**, notée $F \oplus G$ ;
> - si de plus $F \oplus G = E$, on dit que $F$ et $G$ sont **supplémentaires** : tout vecteur de $E$ s'écrit **de façon unique** comme somme d'un vecteur de $F$ et d'un vecteur de $G$.
>
> En dimension finie : $F$ et $G$ supplémentaires $\iff F \cap G = \{\vec{0}\}$ et $\dim F + \dim G = \dim E$.

## 3. Familles de vecteurs

> **📘 Définition — Combinaison linéaire**
>
> Une **combinaison linéaire** des vecteurs $\vec{u}_1, \ldots, \vec{u}_n$ est un vecteur de la forme $\lambda_1\vec{u}_1 + \lambda_2\vec{u}_2 + \cdots + \lambda_n\vec{u}_n$. Exemple : $5\vec{v} - 7\vec{w}$.

> **✏️ Exemple**
>
> Dans $\mathbb{R}^2$, écris $\vec{u}(2 \,;\, 3)$ comme combinaison linéaire de $\vec{v}(1 \,;\, -2)$ et $\vec{w}(2 \,;\, 1)$.
>
> **Solution.**
>
> - On cherche $a$, $b$ avec $a\vec{v} + b\vec{w} = \vec{u}$ : $a + 2b = 2$ et $-2a + b = 3$.
> - On trouve $b = \dfrac{7}{5}$ et $a = -\dfrac{4}{5}$ : $\vec{u} = -\dfrac{4}{5}\vec{v} + \dfrac{7}{5}\vec{w}$.

> **📘 Définition — Famille libre, liée, génératrice, base**
>
> - **Libre** : la seule combinaison nulle est celle dont **tous** les coefficients sont nuls : $\lambda_1\vec{u}_1 + \cdots + \lambda_n\vec{u}_n = \vec{0} \Rightarrow \lambda_1 = \cdots = \lambda_n = 0$.
> - **Liée** : elle n'est pas libre ; c'est le cas si et seulement si l'un des vecteurs est combinaison linéaire des autres.
> - **Génératrice** de $E$ : **tout** vecteur de $E$ est combinaison linéaire de ses vecteurs.
> - **Base** : famille à la fois **libre et génératrice**. Tout vecteur s'écrit alors de façon **unique** dans la base : ce sont ses **coordonnées**.

> **💡 Pour bien comprendre — libre = pas de vecteur inutile**
>
> Une famille **liée** contient un vecteur « en trop » : on peut le fabriquer avec les autres. Une famille **génératrice** permet de **tout** fabriquer. Une **base**, c'est le kit parfait : tout fabriquer, sans aucune pièce en trop.

> **📘 Définition — Dimension**
>
> Toutes les bases de $E$ ont le même nombre de vecteurs : c'est la **dimension** de $E$, notée $\dim E$. On a $\dim\{\vec{0}\} = 0$, $\dim\mathbb{R}^2 = 2$ (plan vectoriel), $\dim\mathbb{R}^3 = 3$.
> Une droite vectorielle du plan a une équation $ax + by = 0$ ; une droite vectorielle de l'espace a pour équations $\dfrac{x}{a} = \dfrac{y}{b} = \dfrac{z}{c}$ (ou est engendrée par le vecteur $(a \,;\, b \,;\, c) \neq \vec{0}$).

> **🏛️ Théorème — Le test du déterminant**
>
> Dans un espace de dimension $n$, une famille de **$n$ vecteurs** est une base $\iff$ elle est libre $\iff$ son **déterminant** est **non nul**. Si le déterminant est nul, la famille est liée.
>
> $$\det(\vec{u}, \vec{v}) = \begin{vmatrix} x & x' \\ y & y' \end{vmatrix} = xy' - x'y$$

> **✏️ Exemple — libre ou liée ?**
>
> **Solution.**
>
> - $\vec{u}(-1 \,;\, 1)$ et $\vec{v}(3 \,;\, 2)$ : $\det = (-1)(2) - (3)(1) = -5 \neq 0$, la famille est **libre** (c'est même une base de $\mathbb{R}^2$).
> - $\vec{u}(-4 \,;\, 1 \,;\, 2)$ et $\vec{v}(8 \,;\, -2 \,;\, -4)$ : $\vec{v} = -2\vec{u}$, la famille est **liée**.
> - $\vec{u}(1 \,;\, 2 \,;\, -1)$, $\vec{v}(0 \,;\, 2 \,;\, 1)$, $\vec{w}(-1 \,;\, 0 \,;\, 3)$ : en développant selon la première ligne, $\det = 1 \times (2 \times 3 - 0 \times 1) - 0 + (-1) \times (2 \times 1 - 2 \times (-1)) = 6 - 4 = 2 \neq 0$ : **libre**, donc base de $\mathbb{R}^3$.
> - $\vec{u} = -\vec{i} + 2\vec{j}$ et $\vec{v} = 2\vec{i} + 3\vec{j}$ : $\det = -3 - 4 = -7 \neq 0$, c'est une base de $\mathbb{R}^2$, donc une famille **génératrice**.

> **✏️ Exemple — deux droites supplémentaires**
>
> $(D)$ et $(D')$ sont les droites vectorielles engendrées par $\vec{u} = 3\vec{i} + 5\vec{j}$ et $\vec{v} = 2\vec{i} - \vec{j}$.
>
> **Solution.**
>
> - $M(x \,;\, y) \in (D) \iff \det(\vec{OM}, \vec{u}) = 0 \iff 5x - 3y = 0$. De même $(D') : x + 2y = 0$.
> - $\det(\vec{u}, \vec{v}) = 3 \times (-1) - 2 \times 5 = -13 \neq 0$ : les droites ne sont pas confondues, donc $(D) \cap (D') = \{\vec{0}\}$, et $1 + 1 = 2 = \dim\mathbb{R}^2$. Elles sont **supplémentaires**.

## 4. Les applications linéaires

> **📘 Définition — Application linéaire**
>
> Une application $f : E \to F$ est **linéaire** si, pour tous vecteurs $\vec{u}$, $\vec{v}$ et tous réels $\alpha$, $\beta$ :
>
> $$f(\alpha\vec{u} + \beta\vec{v}) = \alpha f(\vec{u}) + \beta f(\vec{v})$$
>
> Vocabulaire : une application linéaire de $E$ dans $E$ est un **endomorphisme** ; une application linéaire **bijective** est un **isomorphisme** ; un endomorphisme bijectif est un **automorphisme**. Si $f \circ f = \text{Id}_E$, $f$ est **involutive**.

> **💡 Pour bien comprendre — respecter les opérations**
>
> Une application linéaire « respecte » les deux opérations : l'image d'une somme est la somme des images, l'image d'un double est le double de l'image. Conséquence immédiate : $f(\vec{0}) = \vec{0}$.

> **✏️ Exemple**
>
> Montre que $f(x \,;\, y) = (x \,;\, x + y)$ est un endomorphisme de $\mathbb{R}^2$.
>
> **Solution.**
>
> - Pour $\vec{u}(x \,;\, y)$ et $\vec{v}(a \,;\, b)$ : $f(\alpha\vec{u} + \beta\vec{v}) = (\alpha x + \beta a \,;\, \alpha x + \beta a + \alpha y + \beta b)$.
> - C'est bien $\alpha(x \,;\, x + y) + \beta(a \,;\, a + b) = \alpha f(\vec{u}) + \beta f(\vec{v})$ : $f$ est linéaire de $\mathbb{R}^2$ dans $\mathbb{R}^2$, donc c'est un endomorphisme.

## 5. Matrices

> **📘 Définition — Matrice d'une application linéaire**
>
> Dans une base $(\vec{e}_1, \ldots, \vec{e}_n)$, la **matrice** de $f$ a pour **colonnes** les coordonnées de $f(\vec{e}_1)$, $f(\vec{e}_2)$, …, dans cet ordre.
> Exemple : si $f(\vec{i}) = \vec{i} - \vec{j}$ et $f(\vec{j}) = 2\vec{i} + 3\vec{j}$, alors
>
> $$M = \begin{pmatrix} 1 & 2 \\ -1 & 3 \end{pmatrix}$$

> **⚠️ Attention — en colonnes, pas en lignes !**
>
> Les coordonnées de $f(\vec{e}_1)$ forment la **première colonne**. Par exemple, avec $f(\vec{i}) = 2\vec{i} + 3\vec{j} - 5\vec{k}$, $f(\vec{j}) = 3\vec{i} + \vec{k}$ et $f(\vec{k}) = \vec{i} + \vec{j} + 2\vec{k}$ :
>
> $$M = \begin{pmatrix} 2 & 3 & 1 \\ 3 & 0 & 1 \\ -5 & 1 & 2 \end{pmatrix}$$

> **📐 Formules — opérations sur les matrices $2 \times 2$**
>
> $$\begin{pmatrix} a & b \\ c & d \end{pmatrix} + \begin{pmatrix} a' & b' \\ c' & d' \end{pmatrix} = \begin{pmatrix} a + a' & b + b' \\ c + c' & d + d' \end{pmatrix}$$
>
> $$\lambda\begin{pmatrix} a & b \\ c & d \end{pmatrix} = \begin{pmatrix} \lambda a & \lambda b \\ \lambda c & \lambda d \end{pmatrix}$$
>
> $$\begin{pmatrix} a & b \\ c & d \end{pmatrix}\begin{pmatrix} a' & b' \\ c' & d' \end{pmatrix} = \begin{pmatrix} aa' + bc' & ab' + bd' \\ ca' + dc' & cb' + dd' \end{pmatrix}$$
>
> La matrice **identité** $I_n$ a des $1$ sur la diagonale et des $0$ ailleurs.

> **🧭 Méthode — le produit « ligne par colonne »**
>
> Le coefficient à la ligne $i$ et à la colonne $j$ du produit $MN$ s'obtient en multipliant terme à terme la **ligne $i$ de $M$** par la **colonne $j$ de $N$**, puis en additionnant. Le produit $MN$ n'existe que si $M$ a autant de colonnes que $N$ a de lignes. Attention : en général $MN \neq NM$.

> **🏛️ Propriété — Matrice et composition**
>
> - La matrice de $g \circ f$ est le produit $M_g \times M_f$.
> - Un endomorphisme est **bijectif** si et seulement si le **déterminant** de sa matrice (carrée) est **non nul**.

> **🧭 Méthode — expression analytique**
>
> Si $\vec{u}(x \,;\, y)$ a pour image $\vec{u}'(x' \,;\, y')$, on écrit $f(\vec{u}) = x\,f(\vec{i}) + y\,f(\vec{j})$, puis on identifie les coordonnées. Cela revient à faire le produit de la matrice par la colonne $(x \,;\, y)$.

> **✏️ Exemple**
>
> $f(\vec{i}) = -\vec{i} + \vec{j}$ et $f(\vec{j}) = 3\vec{i} + 4\vec{j}$. Trouve l'expression analytique de $f$.
>
> **Solution.**
>
> - $f(x\vec{i} + y\vec{j}) = x(-\vec{i} + \vec{j}) + y(3\vec{i} + 4\vec{j}) = (-x + 3y)\vec{i} + (x + 4y)\vec{j}$.
> - Donc $x' = -x + 3y$ et $y' = x + 4y$.

## 6. Noyau, image et vecteurs invariants

> **📘 Définition — Noyau et image**
>
> - Le **noyau** de $f$ : $\ker f = \{\vec{u} \in E \mid f(\vec{u}) = \vec{0}\}$, les vecteurs « écrasés » sur $\vec{0}$.
> - L'**image** de $f$ : $\text{Im} f = \{f(\vec{u}) \mid \vec{u} \in E\}$, tous les vecteurs atteints.
>
> Ce sont des sous-espaces vectoriels (de $E$ pour le noyau, de $F$ pour l'image).

> **🏛️ Théorème — Théorème du rang**
>
> Si $E$ est de dimension finie :
>
> $$\dim\ker f + \dim\text{Im} f = \dim E$$
>
> - $f$ est **injective** $\iff \ker f = \{\vec{0}\}$.
> - $f$ est **surjective** $\iff \text{Im} f = F$.
> - Pour un endomorphisme en dimension finie : injectif $\iff$ surjectif $\iff$ bijectif.

> **✏️ Exemple**
>
> Soit $f$ définie par $x' = x + y$ et $y' = 2x + 2y$. Trouve $\ker f$ et $\text{Im} f$.
>
> **Solution.**
>
> - $\ker f$ : $x + y = 0$ (la deuxième équation est la même, multipliée par $2$). C'est la droite vectorielle d'équation $x + y = 0$, de base $\vec{e} = -\vec{i} + \vec{j}$.
> - $\text{Im} f$ : on remarque que $y' = 2x'$ toujours. C'est la droite d'équation $y = 2x$, de base $\vec{e}\,' = \vec{i} + 2\vec{j}$.
> - Vérification avec le théorème du rang : $1 + 1 = 2$. ✔

> **📘 Définition — Vecteurs invariants**
>
> Un vecteur $\vec{u}$ est **invariant** par $f$ si $f(\vec{u}) = \vec{u}$. Leur ensemble $\text{Inv} f = \ker(f - \text{Id})$ est un sous-espace vectoriel.

## 7. Projections et symétries vectorielles

> **📘 Définition — Projection vectorielle**
>
> $f$ est une **projection** si $f \circ f = f$ (ou $M^2 = M$). Elle est caractérisée par :
> - sa **base** : l'ensemble des vecteurs invariants, $\{\vec{u} \mid f(\vec{u}) = \vec{u}\}$ ;
> - sa **direction** : son noyau, $\{\vec{u} \mid f(\vec{u}) = \vec{0}\}$.
>
> Base et direction sont supplémentaires.

> **📘 Définition — Symétrie vectorielle**
>
> $f$ est une **symétrie** si $f \circ f = \text{Id}$ (ou $M^2 = I$). Elle est caractérisée par :
> - sa **base** : $\{\vec{u} \mid f(\vec{u}) = \vec{u}\}$ ;
> - sa **direction** : $\{\vec{u} \mid f(\vec{u}) = -\vec{u}\}$ (les vecteurs retournés).

> **💡 Pour bien comprendre — l'ombre et le miroir**
>
> Une **projection**, c'est comme l'**ombre** d'un objet sur le sol : projeter deux fois ne change rien ($f \circ f = f$). Une **symétrie**, c'est un **miroir** : se refléter deux fois ramène au point de départ ($f \circ f = \text{Id}$).

> **✏️ Exemple**
>
> Étudie $p : x' = \dfrac{x + y}{2},\ y' = \dfrac{x + y}{2}$ et $s : x' = y,\ y' = x$.
>
> **Solution.**
>
> - Pour $p$ : $M = \begin{pmatrix} 1/2 & 1/2 \\ 1/2 & 1/2 \end{pmatrix}$ et $M^2 = M$ : c'est une **projection**. Base : $x' = x$ et $y' = y$ donnent $y = x$. Direction : $x + y = 0$.
> - Pour $s$ : $s(s(x \,;\, y)) = (x \,;\, y)$ : c'est une **symétrie**. Base : $y = x$ (vecteurs invariants). Direction : $(y \,;\, x) = (-x \,;\, -y)$, soit $y = -x$.

> **🎯 À retenir**
>
> - Sous-espace : contient $\vec{0}$ et stable par combinaison linéaire.
> - Base = libre + génératrice ; $n$ vecteurs en dimension $n$ forment une base $\iff \det \neq 0$.
> - Matrice : les **colonnes** sont les images des vecteurs de base.
> - $\dim\ker f + \dim\text{Im} f = \dim E$.
> - Projection : $f \circ f = f$ ; symétrie : $f \circ f = \text{Id}$.
