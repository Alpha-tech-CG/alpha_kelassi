# Homothéties

> **🎯 Dans ce chapitre, tu vas apprendre à…**
>
> - définir une **homothétie** et connaître ses propriétés ;
> - écrire son **expression analytique** et la reconnaître ;
> - trouver l'homothétie qui envoie deux points sur deux autres ;
> - **composer** deux homothéties, ou une homothétie et une translation.

## 1. Définition et propriétés

> **💡 Pour bien comprendre — le projecteur**
>
> Une homothétie, c'est comme un **projecteur** placé au centre $\Omega$ : il agrandit (ou rétrécit) une image en l'éloignant (ou en la rapprochant) **le long des rayons lumineux** qui partent de $\Omega$. Si le rapport est négatif, l'image passe **de l'autre côté** du centre, retournée.

> **📘 Définition — Homothétie**
>
> Soit $\Omega$ un point et $k$ un réel non nul. L'**homothétie** de centre $\Omega$ et de rapport $k$, notée $h(\Omega, k)$, associe à tout point $M$ le point $M'$ tel que :
>
> $$\overrightarrow{\Omega M'} = k\,\overrightarrow{\Omega M}$$
>
> - $k = 1$ : c'est l'**identité** (tous les points sont fixes).
> - $k = -1$ : c'est la **symétrie centrale** de centre $\Omega$.

> **🏛️ Propriété — Homothétie de rapport $k \neq 1$**
>
> - Son **seul** point fixe est le centre $\Omega$.
> - $\Omega$, $M$ et $M'$ sont **alignés**.
> - C'est une transformation, de réciproque $h\left(\Omega, \frac{1}{k}\right)$.
> - Pour tous points $M$, $N$ : $\overrightarrow{M'N'} = k\,\overrightarrow{MN}$. Donc elle multiplie les **longueurs par $|k|$** et les **aires par $k^2$**.
> - Elle conserve les **angles orientés**, le parallélisme, l'orthogonalité, les milieux, les barycentres et le contact. L'image d'une droite est une droite **parallèle**.

> **⚠️ Attention — longueurs et aires**
>
> Avec $k = -3$ : les longueurs sont multipliées par $3$ (et non par $-3$ : une longueur est positive), et les aires par $9$.

## 2. Expression analytique

> **📐 Formule — homothétie de centre $\Omega(x_0 \,;\, y_0)$ et de rapport $k$**
>
> $\overrightarrow{\Omega M'} = k\,\overrightarrow{\Omega M}$ donne $x' - x_0 = k(x - x_0)$ et $y' - y_0 = k(y - y_0)$, soit :
>
> $$x' = kx + (1 - k)x_0$$
>
> $$y' = ky + (1 - k)y_0$$
>
> En complexes : $z' - \omega = k(z - \omega)$.

> **🏛️ Propriété — Reconnaître $x' = kx + p$, $y' = ky + q$**
>
> - Si $k = 1$ : c'est la **translation** de vecteur $\vec{u}(p \,;\, q)$.
> - Si $k \neq 1$ : c'est l'**homothétie** de rapport $k$ et de centre $\Omega\left(\dfrac{p}{1 - k} \,;\, \dfrac{q}{1 - k}\right)$ (son point fixe).

> **✏️ Exemple**
>
> 1. Écris l'homothétie de centre $A(3 \,;\, -2)$ et de rapport $-5$.
> 2. Reconnais $h : x' = 7x - 6,\ y' = 7y + 12$.
>
> **Solution.**
>
> - $1 - k = 6$ : $x' = -5x + 18$ et $y' = -5y - 12$.
> - $k = 7 \neq 1$ : homothétie de rapport $7$ et de centre $\left(\dfrac{-6}{-6} \,;\, \dfrac{12}{-6}\right) = (1 \,;\, -2)$.

## 3. Retrouver une homothétie

> **🧭 Méthode — l'homothétie qui envoie $A$ sur $A'$ et $B$ sur $B'$**
>
> - **Existence** : il faut que $\overrightarrow{A'B'} = k\,\overrightarrow{AB}$ avec $k \neq 1$ (les segments sont **parallèles**, sans être égaux et de même sens).
> - **Rapport** : ce réel $k$ ; en longueur, $|k| = \dfrac{A'B'}{AB}$.
> - **Centre** : le point d'intersection de $(AA')$ et $(BB')$ (si ces droites sont distinctes). On peut aussi utiliser $\overrightarrow{\Omega A'} = k\,\overrightarrow{\Omega A}$.

> **💡 Pour bien comprendre**
>
> Le centre est le « point de fuite » : toutes les droites qui relient un point à son image passent par lui, comme les rayons du projecteur.

## 4. Composer des homothéties

> **🏛️ Théorème — Deux homothéties de même centre**
>
> $$h(\Omega, k_1) \circ h(\Omega, k_2) = h(\Omega, k_1 k_2)$$
>
> Cette composée est **commutative**. Si $k_1 k_2 = 1$, c'est l'identité ; si $k_1 k_2 = -1$, c'est la symétrie de centre $\Omega$.

> **🏛️ Théorème — Deux homothéties de centres différents**
>
> Soit $f = h_1(O, k_1) \circ h_2(O', k_2)$ (on applique d'abord $h_2$).
> - Si $k_1 k_2 = 1$ : $f$ est la **translation** de vecteur $(k_1 - 1)\,\overrightarrow{OO'}$.
> - Si $k_1 k_2 \neq 1$ : $f$ est l'**homothétie** de rapport $k_1 k_2$ et de centre $\Omega$ tel que
>
> $$\overrightarrow{O\Omega} = \frac{k_1(1 - k_2)}{1 - k_1 k_2}\,\overrightarrow{OO'}$$
>
> En particulier, si $k_1 k_2 = -1$, c'est une symétrie centrale. En général, $h_1 \circ h_2 \neq h_2 \circ h_1$.

> **💡 Pour bien comprendre — la règle des rapports**
>
> En composant, on **multiplie les rapports**. Si le produit vaut $1$, plus rien n'est agrandi : il ne reste qu'un glissement, une translation.

> **🧭 Méthode — trouver le centre de la composée**
>
> Le centre $\Omega$ est le **point fixe** de $f$. Le plus simple est souvent de passer par l'écriture complexe ou analytique : $z \mapsto k_2 z + b_2$, puis $z \mapsto k_1 z + b_1$, ce qui donne $z \mapsto k_1 k_2 z + B$, et on résout $\omega = k_1 k_2\,\omega + B$.

> **✏️ Exemple**
>
> Soit $ABC$ un triangle, $h$ l'homothétie de centre $B$ et de rapport $\frac{3}{2}$, et $h'$ celle de centre $C$ et de rapport $\frac{2}{3}$. Montre que $g = h' \circ h$ est une translation et trouve son vecteur.
>
> **Solution.**
>
> - $\frac{3}{2} \times \frac{2}{3} = 1$ : $g$ est une **translation**.
> - $h(B) = B$, puis $h'(B)$ vérifie $\overrightarrow{C\,h'(B)} = \frac{2}{3}\overrightarrow{CB}$. Le vecteur est $\overrightarrow{B\,g(B)} = \overrightarrow{BC} + \frac{2}{3}\overrightarrow{CB} = \frac{1}{3}\overrightarrow{BC}$.
> - Avec la formule : $(k_1 - 1)\,\overrightarrow{CB} = -\frac{1}{3}\overrightarrow{CB} = \frac{1}{3}\overrightarrow{BC}$. ✔

> **✏️ Exemple — une homothétie composée**
>
> Soit $f = h(A, 2) \circ h(B, 3)$. Donne sa nature.
>
> **Solution.**
>
> - $k_1 k_2 = 6 \neq 1$ : $f$ est l'homothétie de rapport $6$.
> - Centre : $\overrightarrow{A\Omega} = \dfrac{2(1 - 3)}{1 - 6}\,\overrightarrow{AB} = \dfrac{4}{5}\,\overrightarrow{AB}$.

## 5. Homothétie et translation

> **🏛️ Théorème — Homothétie et translation**
>
> Soit $h$ l'homothétie de centre $A$ et de rapport $k \neq 1$, et $t$ la translation de vecteur $\vec{u} \neq \vec{0}$. Alors $h \circ t$ et $t \circ h$ sont des **homothéties de rapport $k$**, de centres $\Omega$ tels que :
>
> $$h \circ t : \ \overrightarrow{A\Omega} = \frac{k}{1 - k}\,\vec{u}$$
>
> $$t \circ h : \ \overrightarrow{A\Omega} = \frac{1}{1 - k}\,\vec{u}$$

> **💡 Pour bien comprendre — d'où viennent ces formules ?**
>
> Pour $t \circ h$, le centre $\Omega$ est fixe : $h(\Omega) + \vec{u} = \Omega$. Or $h(\Omega) = A + k\,\overrightarrow{A\Omega}$, donc $\overrightarrow{A\Omega} = k\,\overrightarrow{A\Omega} + \vec{u}$, soit $(1 - k)\overrightarrow{A\Omega} = \vec{u}$.
> Pour $h \circ t$, on écrit de même $h(\Omega + \vec{u}) = \Omega$, ce qui donne $(1 - k)\overrightarrow{A\Omega} = k\vec{u}$.

> **🎯 À retenir**
>
> - $\overrightarrow{\Omega M'} = k\,\overrightarrow{\Omega M}$ ; longueurs $\times |k|$, aires $\times k^2$ ; les angles orientés sont conservés.
> - $x' = kx + p$, $y' = ky + q$ : translation si $k = 1$, sinon homothétie de centre $\left(\frac{p}{1-k} \,;\, \frac{q}{1-k}\right)$.
> - Le centre est sur les droites $(AA')$ et $(BB')$.
> - Composer deux homothéties : on multiplie les rapports ; produit $1$ → translation.
