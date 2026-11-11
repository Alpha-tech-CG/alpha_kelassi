# Isométries du plan

> **🎯 Dans ce chapitre, tu vas apprendre à…**
>
> - reconnaître une **isométrie**, un **déplacement**, un **antidéplacement** ;
> - classer les isométries selon leurs **points fixes** ;
> - **composer** translations, symétries, rotations et réflexions ;
> - étudier une **symétrie glissée**.

## 1. Qu'est-ce qu'une isométrie ?

> **💡 Pour bien comprendre — déplacer sans déformer**
>
> Une isométrie déplace une figure **sans l'étirer ni l'écraser** : comme quand tu fais glisser, tourner ou retourner un carreau de carrelage. Les longueurs ne changent pas.

> **📘 Définition — Isométrie**
>
> Une **isométrie** est une transformation du plan qui **conserve les distances** : pour tous points $M$ et $N$ d'images $M'$ et $N'$, on a $M'N' = MN$.
> Exemples : l'identité, les **translations**, les **rotations**, les **réflexions** (symétries orthogonales), les **symétries glissées**.

> **🏛️ Propriété — Ce que conserve une isométrie**
>
> Une isométrie est bijective et :
> - l'image d'un segment $[AB]$ est le segment $[A'B']$ ; l'image d'une droite est une droite ;
> - l'image d'un cercle de centre $\Omega$ et de rayon $r$ est le cercle de centre $\Omega'$ et de **même rayon** $r$ ;
> - elle conserve le **parallélisme**, l'**orthogonalité**, les **milieux**, les **barycentres** et les **angles géométriques** ($\widehat{A'B'C'} = \widehat{ABC}$).

> **🏛️ Propriété — Deux isométries égales**
>
> Deux isométries qui ont **les mêmes images pour trois points non alignés** sont égales.

## 2. Déplacements et antidéplacements

> **📘 Définition — Déplacement, antidéplacement**
>
> - Un **déplacement** (isométrie positive) **conserve** les angles orientés : $(\overrightarrow{A'B'}, \overrightarrow{A'C'}) = (\overrightarrow{AB}, \overrightarrow{AC})$. Ce sont les translations et les rotations (et l'identité).
> - Un **antidéplacement** (isométrie négative) **change le signe** des angles orientés : $(\overrightarrow{A'B'}, \overrightarrow{A'C'}) = -(\overrightarrow{AB}, \overrightarrow{AC})$. Ce sont les réflexions et les symétries glissées.

> **💡 Pour bien comprendre — avec ou sans retournement**
>
> Un **déplacement**, c'est bouger un carreau **sur la table** sans le soulever. Un **antidéplacement**, c'est le **retourner** face contre table : l'ordre des sommets « tourne » dans l'autre sens.

> **📐 Formules — expressions analytiques** (repère orthonormé, $a^2 + b^2 = 1$)
>
> Déplacement :
>
> $$x' = ax - by + c$$
>
> $$y' = bx + ay + d$$
>
> Antidéplacement :
>
> $$x' = ax + by + c$$
>
> $$y' = bx - ay + d$$
>
> Le déterminant $\begin{vmatrix} a & -b \\ b & a \end{vmatrix}$ vaut $1$ pour un déplacement ; $\begin{vmatrix} a & b \\ b & -a \end{vmatrix}$ vaut $-1$ pour un antidéplacement.

> **🏛️ Propriété — Règle des signes pour la composition**
>
> - déplacement $\circ$ déplacement $=$ déplacement ;
> - antidéplacement $\circ$ antidéplacement $=$ déplacement ;
> - déplacement $\circ$ antidéplacement $=$ antidéplacement (et dans l'autre ordre aussi).
>
> C'est comme la règle des signes : « $+ \times + = +$ », « $- \times - = +$ », « $+ \times - = -$ ».

## 3. Classer une isométrie par ses points fixes

> **🏛️ Théorème — Points fixes d'une isométrie**
>
> | Points fixes | L'isométrie est… |
> |---|---|
> | trois points non alignés | l'**identité** |
> | deux points distincts $A$, $B$ (et pas l'identité) | la **réflexion** d'axe $(AB)$ |
> | un seul point $A$ | une **rotation** de centre $A$ |
> | aucun point | une **translation** ou une **symétrie glissée** |

> **📘 Définition — Triangles isométriques**
>
> Les triangles $ABC$ et $A'B'C'$ sont **isométriques** (superposables) s'il existe une isométrie qui envoie $A$, $B$, $C$ sur $A'$, $B'$, $C'$. C'est le cas **dès que** $A'B' = AB$, $B'C' = BC$ et $A'C' = AC$.
> - Avec un déplacement : ils sont **directement** superposables.
> - Avec un antidéplacement : ils sont superposables **après retournement**.

## 4. Composer des translations et des symétries centrales

> **🏛️ Théorème — Deux translations**
>
> $$t_{\vec{u}} \circ t_{\vec{v}} = t_{\vec{u} + \vec{v}}$$
>
> Cette composée est **commutative**, et $t_{\vec{u}} \circ t_{-\vec{u}} = \text{Id}$.

> **💡 Pour bien comprendre**
>
> Glisser de $\vec{v}$ puis de $\vec{u}$, c'est glisser d'un coup de $\vec{u} + \vec{v}$ : on met les flèches bout à bout.

> **🏛️ Théorème — Deux symétries centrales**
>
> $$S_{\Omega'} \circ S_{\Omega} = t_{2\overrightarrow{\Omega\Omega'}}$$
>
> C'est une **translation**. Elle n'est **pas commutative** : $S_\Omega \circ S_{\Omega'} = t_{2\overrightarrow{\Omega'\Omega}}$. Et $S_\Omega \circ S_\Omega = \text{Id}$.

> **💡 Pour bien comprendre — d'où vient le « 2 » ?**
>
> Si $M_1 = S_\Omega(M)$ et $M' = S_{\Omega'}(M_1)$, alors $\Omega$ est le milieu de $[MM_1]$ et $\Omega'$ celui de $[M_1M']$. Par le théorème des milieux dans le triangle $MM_1M'$ : $\overrightarrow{MM'} = 2\,\overrightarrow{\Omega\Omega'}$.

> **🏛️ Théorème — Translation et symétrie centrale**
>
> $t_{\vec{u}} \circ S_\Omega$ est la **symétrie centrale** de centre $\Omega'$ tel que $\overrightarrow{\Omega\Omega'} = \frac{1}{2}\vec{u}$ (on écrit $t_{\vec{u}} = S_{\Omega'} \circ S_\Omega$). Elle n'est pas commutative.

## 5. Composer deux réflexions

> **🏛️ Théorème — Deux réflexions d'axes parallèles**
>
> Si $(\Delta) \parallel (\Delta')$, $H_1 \in (\Delta)$ et $H_2$ est son projeté orthogonal sur $(\Delta')$ :
>
> $$S_{(\Delta')} \circ S_{(\Delta)} = t_{2\overrightarrow{H_1H_2}}$$
>
> C'est une **translation**, de vecteur perpendiculaire aux axes et de longueur **deux fois** leur distance. Si les axes sont confondus, on obtient l'identité.

> **🏛️ Théorème — Deux réflexions d'axes sécants**
>
> Si $(\Delta)$ et $(\Delta')$ se coupent en $\Omega$ :
>
> $$S_{(\Delta')} \circ S_{(\Delta)} = r\big(\Omega, \,2(\Delta, \Delta')\big)$$
>
> C'est une **rotation** de centre $\Omega$ et d'angle **deux fois** l'angle des axes.

> **🏛️ Théorème — Décomposer une translation ou une rotation**
>
> - Toute translation $t_{\vec{u}}$ s'écrit $S_{(\Delta')} \circ S_{(\Delta)}$ : on choisit **n'importe quelle** droite $(\Delta)$ perpendiculaire à $\vec{u}$, et alors $(\Delta') = t_{\frac{1}{2}\vec{u}}(\Delta)$ est imposée.
> - Toute rotation $r(\Omega, \theta)$ s'écrit $S_{(\Delta')} \circ S_{(\Delta)}$ : on choisit **n'importe quelle** droite $(\Delta)$ passant par $\Omega$, et $(\Delta')$ passe par $\Omega$ avec $(\Delta, \Delta') = \frac{\theta}{2} \;[\pi]$.

> **🧭 Méthode — composer grâce aux réflexions**
>
> Pour composer deux isométries, on les décompose en réflexions en choisissant **astucieusement** une droite commune, qui s'élimine car $S_{(\Delta)} \circ S_{(\Delta)} = \text{Id}$.
> Exemple : $r(\Omega, \theta) \circ S_{(\Delta)}$ avec $\Omega \in (\Delta)$. On écrit $r = S_{(\Delta')} \circ S_{(\Delta)}$, donc $r \circ S_{(\Delta)} = S_{(\Delta')} \circ S_{(\Delta)} \circ S_{(\Delta)} = S_{(\Delta')}$ : c'est une **réflexion**, d'axe $(\Delta')$ passant par $\Omega$ avec $(\Delta, \Delta') = \frac{\theta}{2}$.

> **🏛️ Propriété — Autres composées**
>
> - Translation et rotation d'angle $\theta \neq 0$ : $t_{\vec{u}} \circ r(A, \theta)$ est une **rotation d'angle $\theta$** (de centre différent). Elle n'est en général pas commutative.
> - Rotation $r(\Omega, \theta)$ et réflexion d'axe $(\Delta)$ : si $\Omega \in (\Delta)$, c'est une **réflexion** ; si $\Omega \notin (\Delta)$, c'est une **symétrie glissée**.

## 6. La symétrie glissée

> **📘 Définition — Symétrie glissée**
>
> Soit $(\Delta)$ une droite et $\vec{u}$ un vecteur **non nul, parallèle** à $(\Delta)$. La **symétrie glissée** d'axe $(\Delta)$ et de vecteur $\vec{u}$ est :
>
> $$G = S_{(\Delta)} \circ t_{\vec{u}} = t_{\vec{u}} \circ S_{(\Delta)}$$
>
> (ici, l'ordre ne compte pas).

> **💡 Pour bien comprendre — les traces de pas**
>
> Regarde des traces de pas dans le sable : le pied gauche, puis le pied droit un peu plus loin, reflété de l'autre côté de la ligne de marche. Passer d'une trace à la suivante, c'est **refléter** puis **avancer** : une symétrie glissée !

> **🏛️ Propriété — Symétrie glissée**
>
> - Elle n'a **aucun point fixe**.
> - $G \circ G = t_{2\vec{u}}$ : en l'appliquant deux fois, on obtient une translation.
> - Sa réciproque est la symétrie glissée de même axe et de vecteur $-\vec{u}$.
> - Pour tout point $M$, le **milieu** de $[M\,G(M)]$ est **sur l'axe** $(\Delta)$.

> **🧭 Méthode — trouver l'axe et le vecteur**
>
> 1. **Vecteur** : prends un point $A$ et calcule $C = G(G(A))$. Alors $2\vec{u} = \overrightarrow{AC}$, donc $\vec{u} = \frac{1}{2}\overrightarrow{AC}$.
> 2. **Axe** : c'est la droite qui passe par les milieux de $[AA']$ et de $[BB']$ (avec $A' = G(A)$, $B' = G(B)$) ; elle est parallèle à $\vec{u}$.

> **✏️ Exemple**
>
> Étudie $G : x' = x + 2,\ y' = -y$.
>
> **Solution.**
>
> - C'est un antidéplacement ($a = 1$, $b = 0$). Si $x' = x$ et $y' = y$, on obtient $2 = 0$ : **aucun point fixe**, c'est donc une symétrie glissée.
> - $G \circ G$ : $x'' = x + 4$ et $y'' = y$, soit $t_{(4 \,;\, 0)}$. Donc $\vec{u}(2 \,;\, 0)$.
> - Le milieu de $[M\,G(M)]$ est $(x + 1 \,;\, 0)$ : il est toujours sur l'axe $y = 0$. L'axe est donc l'axe des abscisses.

> **🎯 À retenir**
>
> - Isométrie = conserve les distances. Déplacement : conserve les angles orientés ; antidéplacement : les change de signe.
> - Points fixes : 3 non alignés → identité ; 2 → réflexion ; 1 → rotation ; 0 → translation ou symétrie glissée.
> - $S_{\Omega'} \circ S_\Omega = t_{2\overrightarrow{\Omega\Omega'}}$ ; deux réflexions d'axes parallèles → translation ; d'axes sécants → rotation d'angle double.
> - Symétrie glissée : $G \circ G = t_{2\vec{u}}$, et le milieu de $[M\,G(M)]$ est sur l'axe.
