# Transformations planes

> **🎯 Dans ce chapitre, tu vas apprendre à…**
>
> - reconnaître une **transformation** du plan, ses **points fixes**, sa **réciproque** ;
> - composer deux transformations ;
> - écrire l'**expression analytique** d'une application affine ;
> - utiliser la **translation**, la **symétrie centrale**, la **réflexion**, la **symétrie oblique** et la **rotation**.

## 1. Généralités

> **💡 Pour bien comprendre — déplacer tous les points à la fois**
>
> Une transformation, c'est une **règle** qui déplace **chaque** point du plan vers un nouvel endroit, sans que deux points arrivent au même endroit et sans laisser de place vide. Glisser, tourner, refléter dans un miroir, agrandir : ce sont des transformations.

> **📘 Définition — Transformation du plan**
>
> Une **transformation** $f$ du plan est une application **bijective** du plan dans lui-même : tout point $M$ a une image $M' = f(M)$, et tout point $M'$ a un **unique** antécédent $M$.
> Exemples : l'identité, les translations, les symétries, les rotations, les homothéties.

> **📘 Définition — Points fixes et ensembles invariants**
>
> - $M$ est un **point fixe** (ou **invariant**) de $f$ si $f(M) = M$. On note $\text{Inv} f$ l'ensemble des points fixes.
> - Un ensemble $E$ est **globalement invariant** par $f$ si $f(E) = E$ : les points peuvent bouger, mais ils restent dans $E$.

> **📘 Définition — Réciproque, composée, involution**
>
> - La **réciproque** $f^{-1}$ ramène chaque point à son antécédent : $f(M) = M' \iff f^{-1}(M') = M$.
> - La **composée** $g \circ f$ consiste à appliquer **d'abord $f$, puis $g$** : $(g \circ f)(M) = g\big(f(M)\big)$. En général, $g \circ f \neq f \circ g$.
> - $f$ est **involutive** si $f \circ f = \text{Id}$, c'est-à-dire $f^{-1} = f$ (comme un miroir).

> **⚠️ Attention — l'ordre de lecture**
>
> Dans $g \circ f$, on lit de **droite à gauche** : c'est $f$ qui agit en premier.

## 2. Les applications affines

> **📘 Définition — Application affine**
>
> Une application $f$ du plan est **affine** si elle conserve les **barycentres** : si $G$ est le barycentre de $(A, a)$, $(B, b)$, $(C, c)$, alors $f(G)$ est le barycentre de $(f(A), a)$, $(f(B), b)$, $(f(C), c)$.

> **🏛️ Propriété — Expression analytique**
>
> Dans un repère, une application affine s'écrit :
>
> $$x' = ax + by + c$$
>
> $$y' = a'x + b'y + c'$$
>
> Elle est **bijective** (c'est une transformation) si et seulement si $\begin{vmatrix} a & b \\ a' & b' \end{vmatrix} = ab' - a'b \neq 0$.
> Ses points fixes se trouvent en résolvant $x' = x$ et $y' = y$.

> **🏛️ Propriété — Ce que conserve une transformation affine**
>
> L'**alignement**, le **parallélisme**, les **milieux** et les **barycentres**.
> Les isométries (translations, symétries, rotations) et les homothéties conservent **en plus** l'orthogonalité et les angles géométriques.

## 3. La translation

> **📘 Définition — Translation**
>
> La **translation** de vecteur $\vec{u}$ envoie $M$ sur $M'$ tel que $\overrightarrow{MM'} = \vec{u}$. Son élément caractéristique est son **vecteur**.

> **📐 Formules — translation de vecteur $\vec{u}(x_0 \,;\, y_0)$**
>
> - En complexes, si $\vec{u}$ a pour affixe $b = x_0 + iy_0$ : $z' = z + b$.
> - Analytiquement : $x' = x + x_0$ et $y' = y + y_0$.
>
> Exemple : la translation de vecteur $\vec{u}(2 \,;\, -3)$ s'écrit $x' = x + 2$ et $y' = y - 3$.

> **💡 Pour bien comprendre**
>
> Une translation fait **glisser** toute la figure d'un seul bloc, dans la même direction, sur la même distance. Aucun point ne reste fixe (sauf si $\vec{u} = \vec{0}$).

## 4. La symétrie centrale

> **📘 Définition — Symétrie centrale**
>
> La **symétrie de centre $\Omega$**, notée $S_\Omega$, envoie $M$ sur $M'$ tel que $\Omega$ soit le **milieu** de $[MM']$.

> **📐 Formule — symétrie de centre $\Omega(a \,;\, b)$**
>
> $\Omega$ milieu de $[MM']$ donne $a = \dfrac{x + x'}{2}$ et $b = \dfrac{y + y'}{2}$, d'où :
>
> $$x' = -x + 2a$$
>
> $$y' = -y + 2b$$

## 5. La réflexion (symétrie orthogonale)

> **📘 Définition — Réflexion**
>
> La **réflexion d'axe $(\Delta)$**, notée $S_{(\Delta)}$, envoie $M$ sur $M'$ tel que $(\Delta)$ soit la **médiatrice** de $[MM']$.

> **🏛️ Propriété — Réflexion**
>
> - Ses points fixes sont exactement les points de l'**axe** $(\Delta)$.
> - Elle est **involutive** : $S_{(\Delta)} \circ S_{(\Delta)} = \text{Id}$.
> - Elle conserve les distances, le parallélisme, l'orthogonalité, les barycentres, le contact et la forme des figures.
> - Elle **change le signe** des angles orientés (c'est un miroir).

> **🧭 Méthode — trouver l'expression analytique d'une réflexion**
>
> Pour l'axe $(\mathcal{D}) : ax + by + c = 0$, de vecteur directeur $\vec{u}(-b \,;\, a)$, on écrit deux conditions :
> 1. le **milieu** $I$ de $[MM']$ est sur $(\mathcal{D})$ : $a\dfrac{x + x'}{2} + b\dfrac{y + y'}{2} + c = 0$ ;
> 2. $\overrightarrow{MM'}$ est **perpendiculaire** à l'axe : $\overrightarrow{MM'} \cdot \vec{u} = 0$, soit $-b(x' - x) + a(y' - y) = 0$.
>
> On résout ce système en $x'$ et $y'$.

> **📐 Formule — réflexion d'axe $ax + by + c = 0$**
>
> $$x' = x - \frac{2a(ax + by + c)}{a^2 + b^2}$$
>
> $$y' = y - \frac{2b(ax + by + c)}{a^2 + b^2}$$

> **📐 Formules — réflexions particulières**
>
> | Axe | Expression analytique |
> |---|---|
> | $y = b$ (horizontal) | $x' = x$ et $y' = -y + 2b$ |
> | $x = a$ (vertical) | $x' = -x + 2a$ et $y' = y$ |
> | $y = x$ (1ʳᵉ bissectrice) | $x' = y$ et $y' = x$ |
> | $y = -x$ (2ᵉ bissectrice) | $x' = -y$ et $y' = -x$ |

> **✏️ Exemple**
>
> Trouve l'expression de la réflexion d'axe $(\mathcal{D}) : x + y - 2 = 0$.
>
> **Solution.**
>
> - $a = b = 1$, $c = -2$, $a^2 + b^2 = 2$ : $x' = x - (x + y - 2) = -y + 2$ et $y' = y - (x + y - 2) = -x + 2$.
> - Vérification : $O(0 \,;\, 0)$ a pour image $(2 \,;\, 2)$ ; le milieu $(1 \,;\, 1)$ est bien sur $(\mathcal{D})$. ✔

## 6. La symétrie oblique

> **📘 Définition — Symétrie d'axe $(\mathcal{D})$ et de direction $(\Delta)$**
>
> Soit $(\mathcal{D})$ et $(\Delta)$ deux droites sécantes. La symétrie d'**axe** $(\mathcal{D})$ et de **direction** $(\Delta)$ envoie $M$ sur $M'$ tel que :
> - $\overrightarrow{MM'}$ est **parallèle** à $(\Delta)$ ;
> - le **milieu** de $[MM']$ est sur $(\mathcal{D})$.
>
> Si $(\mathcal{D}) \perp (\Delta)$, on retrouve la réflexion d'axe $(\mathcal{D})$.

> **💡 Pour bien comprendre — le miroir penché**
>
> C'est un « miroir » où l'on ne se déplace pas perpendiculairement à l'axe, mais **en biais**, toujours dans la même direction $(\Delta)$.

## 7. La rotation

> **📘 Définition — Rotation**
>
> La **rotation** de centre $\Omega$ et d'angle $\theta$, notée $r(\Omega, \theta)$, laisse $\Omega$ fixe et envoie tout point $M \neq \Omega$ sur $M'$ tel que :
>
> $$\Omega M' = \Omega M$$
>
> $$(\overrightarrow{\Omega M}, \overrightarrow{\Omega M'}) = \theta \;[2\pi]$$

> **💡 Pour bien comprendre — l'aiguille de la montre**
>
> Plante une punaise en $\Omega$ et fais tourner la feuille d'un angle $\theta$ : chaque point tourne autour de la punaise **en restant à la même distance**.

> **🏛️ Propriété — Rotation**
>
> - Si $\theta \neq 0$, le **centre** est l'unique point fixe.
> - Sa réciproque est $r(\Omega, -\theta)$.
> - Elle conserve les distances, les **angles orientés**, le parallélisme, l'orthogonalité, les barycentres et la nature des figures.
> - Cas particuliers : $\theta = 0$, c'est l'identité ; $\theta = \pi$, c'est la symétrie centrale de centre $\Omega$ (demi-tour) ; $\theta = \frac{\pi}{2}$, quart de tour direct ; $\theta = -\frac{\pi}{2}$, quart de tour indirect.

> **📐 Formules — expression analytique** (repère orthonormé direct)
>
> Rotation de centre $O$ :
>
> $$x' = x\cos\theta - y\sin\theta$$
>
> $$y' = x\sin\theta + y\cos\theta$$
>
> Rotation de centre $\Omega(x_\Omega \,;\, y_\Omega)$ :
>
> $$x' - x_\Omega = (x - x_\Omega)\cos\theta - (y - y_\Omega)\sin\theta$$
>
> $$y' - y_\Omega = (x - x_\Omega)\sin\theta + (y - y_\Omega)\cos\theta$$
>
> En complexes : $z' - \omega = e^{i\theta}(z - \omega)$.

> **💡 Pour bien comprendre — d'où vient la formule ?**
>
> Si $M$ est à la distance $r$ de $O$ avec l'angle $b$, alors $x = r\cos b$ et $y = r\sin b$. Après rotation, l'angle devient $b + \theta$ : $x' = r\cos(b + \theta)$ et $y' = r\sin(b + \theta)$. Il suffit de développer avec les formules d'addition.
>
> Pour un centre $\Omega$, on fait la même chose **en se plaçant en $\Omega$** : on remplace $x$ par $x - x_\Omega$, etc.

> **✏️ Exemple**
>
> Écris la rotation de centre $\Omega(1 \,;\, 2)$ et d'angle $\frac{\pi}{2}$.
>
> **Solution.**
>
> - $\cos\frac{\pi}{2} = 0$ et $\sin\frac{\pi}{2} = 1$ : $x' - 1 = -(y - 2)$ et $y' - 2 = x - 1$.
> - Donc $x' = -y + 3$ et $y' = x + 1$. Vérification : $\Omega(1 \,;\, 2)$ a pour image $(1 \,;\, 2)$. ✔

> **🧭 Méthode — retrouver une rotation qui envoie $A$ sur $A'$ et $B$ sur $B'$**
>
> - **Existence** : il faut $AB = A'B'$ et $(\overrightarrow{AB}, \overrightarrow{A'B'}) \neq 0 \;[2\pi]$.
> - **Angle** : $\theta = (\overrightarrow{AB}, \overrightarrow{A'B'})$, calculé avec
>
> $$\cos\theta = \frac{\overrightarrow{AB} \cdot \overrightarrow{A'B'}}{AB \times A'B'}$$
>
> $$\sin\theta = \frac{\det(\overrightarrow{AB}, \overrightarrow{A'B'})}{AB \times A'B'}$$
>
> - **Centre** : le point d'intersection des **médiatrices** de $[AA']$ et de $[BB']$ (le centre est à égale distance d'un point et de son image).

> **🎯 À retenir**
>
> - Transformation = bijection du plan ; $g \circ f$ : d'abord $f$, puis $g$.
> - Translation : $x' = x + x_0$, $y' = y + y_0$.
> - Symétrie de centre $\Omega(a \,;\, b)$ : $x' = 2a - x$, $y' = 2b - y$.
> - Réflexion : le milieu de $[MM']$ est sur l'axe et $\overrightarrow{MM'}$ est perpendiculaire à l'axe.
> - Rotation de centre $O$ : $x' = x\cos\theta - y\sin\theta$, $y' = x\sin\theta + y\cos\theta$.
