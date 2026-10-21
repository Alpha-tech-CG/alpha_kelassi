# Angles orientés

> **🎯 Dans ce chapitre, tu vas apprendre à…**
>
> - mesurer un angle **avec un sens** de rotation ;
> - trouver la **mesure principale** d'un angle ;
> - utiliser la **relation de Chasles** et les règles de calcul ;
> - exploiter l'**angle inscrit** et l'**angle au centre** ;
> - prouver que des points sont **cocycliques** ou **alignés** ;
> - trouver un **arc capable**.

## 1. Orienter le plan

> **💡 Pour bien comprendre — tourner dans un sens ou dans l'autre**
>
> Un angle « ordinaire » dit seulement **de combien** on tourne. Un angle **orienté** dit aussi **dans quel sens**. Tourner de $90°$ vers la gauche ou vers la droite, ce n'est pas la même chose !

> **📘 Définition — Sens direct**
>
> Sur un cercle, il y a deux sens de parcours. Le **sens direct** (ou **positif**, ou **trigonométrique**) est le sens **contraire** des aiguilles d'une montre ; l'autre est le sens **indirect**. Un plan muni de ce choix est **orienté**.

> **📘 Définition — Cercle trigonométrique et abscisse curviligne**
>
> Sur le cercle trigonométrique (centre $O$, rayon $1$, orienté), à chaque réel $\alpha$ correspond un point $M$ : on part du point $(1 \,;\, 0)$ et on parcourt une longueur $|\alpha|$ dans le sens direct si $\alpha > 0$, indirect si $\alpha < 0$. Les réels $\alpha + 2k\pi$ donnent le même point : ce sont les **abscisses curvilignes** de $M$.
> Sur un cercle de rayon $R$, un arc d'angle $\alpha$ (en radians) a pour longueur $L = R\alpha$.

> **📘 Définition — Congruence modulo $2\pi$**
>
> $\alpha \equiv \beta \;[2\pi]$ signifie que $\alpha - \beta$ est un multiple de $2\pi$ : $\alpha = \beta + 2k\pi$ avec $k \in \mathbb{Z}$.
> Si $A$ et $B$ ont pour abscisses curvilignes $a$ et $b$, l'**arc orienté** $\overset{\frown}{AB}$ a pour mesures $b - a + 2k\pi$.

## 2. L'angle orienté de deux vecteurs

> **📘 Définition — Angle orienté**
>
> Pour deux vecteurs non nuls $\vec{u}$ et $\vec{v}$, on trace depuis $O$ les vecteurs unitaires de même sens : ils coupent le cercle trigonométrique en $A$ et $B$. Les mesures de l'**angle orienté** $(\vec{u}, \vec{v})$ sont celles de l'arc orienté $\overset{\frown}{AB}$. Il est défini à $2\pi$ près.

> **💡 Pour bien comprendre — l'ordre compte**
>
> $(\vec{u}, \vec{v})$ se lit « l'angle pour aller de $\vec{u}$ **vers** $\vec{v}$ ». Si tu échanges les deux, tu tournes dans l'autre sens : l'angle change de signe.

> **🏛️ Propriété — Règles de calcul** (à $2\pi$ près)
>
> - **Chasles** : $(\vec{u}, \vec{v}) = (\vec{u}, \vec{w}) + (\vec{w}, \vec{v})$.
> - $(\vec{v}, \vec{u}) = -(\vec{u}, \vec{v})$ et $(\vec{u}, \vec{u}) = 0$.
> - $(\vec{u}, \vec{v}) = 0$ si $\vec{u}$ et $\vec{v}$ sont colinéaires **de même sens** ; $= \pi$ s'ils sont de **sens contraires**.
> - $(-\vec{u}, -\vec{v}) = (\vec{u}, \vec{v})$ ; $(-\vec{u}, \vec{v}) = (\vec{u}, -\vec{v}) = (\vec{u}, \vec{v}) + \pi$.
> - Pour $k$ réel non nul : $(k\vec{u}, \vec{v}) = (\vec{u}, \vec{v})$ si $k > 0$, et $(\vec{u}, \vec{v}) + \pi$ si $k < 0$.

## 3. La mesure principale

> **📘 Définition — Mesure principale**
>
> Parmi toutes les mesures $\theta + 2k\pi$ d'un angle, une seule est dans l'intervalle $]-\pi \,;\, \pi]$ : c'est la **mesure principale**.

> **🧭 Méthode — trouver la mesure principale de $\theta = \frac{a\pi}{b}$**
>
> 1. Si $-\pi < \theta \leq \pi$ (c'est-à-dire $-b < a \leq b$), c'est déjà la mesure principale.
> 2. Sinon, on enlève (ou on ajoute) un **nombre pair de $\pi$** pour revenir dans $]-\pi \,;\, \pi]$ : on cherche l'entier pair $2k$ le plus proche de $\frac{a}{b}$.
> 3. Cas particuliers : $n\pi$ a pour mesure principale $0$ si $n$ est pair, et $\pi$ si $n$ est impair.

> **✏️ Exemple**
>
> Trouve la mesure principale de $\dfrac{37\pi}{6}$, de $-\dfrac{17\pi}{4}$ et de $7\pi$.
>
> **Solution.**
>
> - $\dfrac{37}{6} \approx 6{,}2$ : on enlève $6\pi = \dfrac{36\pi}{6}$, il reste $\dfrac{\pi}{6}$.
> - $-\dfrac{17}{4} = -4{,}25$ : on ajoute $4\pi = \dfrac{16\pi}{4}$, il reste $-\dfrac{\pi}{4}$.
> - $7\pi = 6\pi + \pi$ : la mesure principale est $\pi$.

## 4. Demi-droites, bissectrices et droites

> **📘 Définition — Angle de demi-droites, bissectrice**
>
> L'angle orienté $(Ox, Oy)$ de deux demi-droites est l'angle $(\vec{u}, \vec{v})$ de leurs vecteurs directeurs.
> La **bissectrice** de $(Ox, Oy)$ est la demi-droite $[Oz)$ telle que $(Ox, Oz) = (Oz, Oy)$. Un point $M \neq O$ est :
> - sur la **bissectrice intérieure** de $(\overrightarrow{OA}, \overrightarrow{OB})$ si $(\overrightarrow{OA}, \overrightarrow{OM}) = \frac{1}{2}(\overrightarrow{OA}, \overrightarrow{OB}) \;[2\pi]$ ;
> - sur la **bissectrice extérieure** si $(\overrightarrow{OA}, \overrightarrow{OM}) = \frac{1}{2}(\overrightarrow{OA}, \overrightarrow{OB}) + \frac{\pi}{2} \;[\pi]$.

> **📘 Définition — Angle de deux droites**
>
> L'angle de deux **droites** se mesure **à $\pi$ près** (une droite n'a pas de sens : retourner un vecteur directeur ajoute $\pi$).

> **🏛️ Propriété — Angles à côtés parallèles ou perpendiculaires** (à $\pi$ près)
>
> - Si $(D_1) \parallel (D_2)$ et $(d_1) \parallel (d_2)$, alors $(D_1, d_1) = (D_2, d_2)$.
> - Si $(D_1) \perp (D_2)$ et $(d_1) \perp (d_2)$, alors $(D_1, d_1) = (D_2, d_2)$.

## 5. Angle inscrit et angle au centre

> **📘 Définition — Angle inscrit, angle au centre**
>
> Soit $(\mathcal{C})$ un cercle de centre $O$, et $A$, $B$, $M$ trois points distincts de $(\mathcal{C})$.
> - $(\overrightarrow{MA}, \overrightarrow{MB})$ est un **angle inscrit** : son sommet est **sur** le cercle.
> - $(\overrightarrow{OA}, \overrightarrow{OB})$ est un **angle au centre** : son sommet est le **centre**.

> **🏛️ Théorème — Angle inscrit**
>
> L'angle au centre est le **double** de l'angle inscrit qui intercepte le même arc :
>
> $$(\overrightarrow{OA}, \overrightarrow{OB}) = 2(\overrightarrow{MA}, \overrightarrow{MB}) \;[2\pi]$$
>
> **Tangente** : si $(AT)$ est la tangente en $A$, alors $(\overrightarrow{AT}, \overrightarrow{AB}) = (\overrightarrow{MA}, \overrightarrow{MB}) \;[\pi]$ : l'angle entre la tangente et la corde vaut l'angle inscrit.

> **💡 Pour bien comprendre — le spectateur et la scène**
>
> Imagine que $[AB]$ est une scène de théâtre. Le centre $O$ est le meilleur siège : il voit la scène sous un angle **deux fois plus grand** que n'importe quel spectateur $M$ assis sur le cercle. Et tous les spectateurs du même côté voient la scène sous **le même angle**.

> **🏛️ Propriété — Conséquences**
>
> - Deux angles inscrits qui interceptent le **même arc** sont égaux.
> - Un angle inscrit qui intercepte un **diamètre** est **droit**.
> - Deux angles inscrits qui interceptent des arcs complémentaires (de part et d'autre de la corde) sont **supplémentaires**.

## 6. Points cocycliques et points alignés

> **📘 Définition — Points cocycliques**
>
> Des points sont **cocycliques** s'ils sont sur un **même cercle**. Trois points non alignés le sont toujours (il passe un cercle par eux) ; quatre points, pas toujours.

> **🏛️ Théorème — Cocyclicité et alignement** (angles de droites, à $\pi$ près)
>
> - Quatre points distincts $A$, $B$, $C$, $D$, non alignés, sont **cocycliques** $\iff (\overrightarrow{AB}, \overrightarrow{AC}) = (\overrightarrow{DB}, \overrightarrow{DC}) \;[\pi]$.
> - Trois points distincts $A$, $B$, $C$ sont **alignés** $\iff (\overrightarrow{AB}, \overrightarrow{AC}) = 0 \;[\pi]$.

> **💡 Pour bien comprendre**
>
> $A$ et $D$ « voient » le segment $[BC]$ sous le même angle (à $\pi$ près) : ils sont donc sur le même cercle passant par $B$ et $C$.

> **✏️ Exemple — deux triangles rectangles**
>
> $ABC$ est rectangle en $B$ et $ACD$ est rectangle en $D$. Montre que $A$, $B$, $C$, $D$ sont cocycliques.
>
> **Solution.**
>
> - $B$ voit $[AC]$ sous un angle droit, donc $B$ est sur le cercle de diamètre $[AC]$.
> - De même pour $D$. Les quatre points sont sur le cercle de diamètre $[AC]$ : ils sont **cocycliques**.

## 7. Transformations et angles

> **🏛️ Propriété — Effet sur les angles orientés**
>
> - Une **symétrie orthogonale** (réflexion) **change le signe** des angles orientés : $(\vec{u}\,', \vec{v}\,') = -(\vec{u}, \vec{v})$.
> - Une **homothétie** (et une translation, une rotation) **conserve** les angles orientés : si $A'$, $B'$, $C'$ sont les images de $A$, $B$, $C$, alors $(\overrightarrow{C'A'}, \overrightarrow{C'B'}) = (\overrightarrow{CA}, \overrightarrow{CB})$.

## 8. Quelques droites célèbres du triangle

> **🏛️ Propriété — Symétriques de l'orthocentre**
>
> Soit $H$ l'orthocentre du triangle $ABC$ et $(\mathcal{C})$ son cercle circonscrit. Les symétriques de $H$ par rapport aux côtés $(BC)$, $(CA)$ et $(AB)$ sont **sur le cercle** $(\mathcal{C})$.

> **🏛️ Théorème — Droites de Simson, de Steiner et d'Euler**
>
> - **Simson** : si $M$ est sur le cercle circonscrit à $ABC$, ses projetés orthogonaux sur $(AB)$, $(BC)$ et $(CA)$ sont **alignés**, sur la droite de Simson de $M$.
> - **Steiner** : l'image de la droite de Simson par l'homothétie de centre $M$ et de rapport $2$ est la droite de Steiner ; elle passe par les symétriques de $M$ par rapport aux trois côtés, et par l'orthocentre $H$.
> - **Euler** : le centre $O$ du cercle circonscrit, le centre de gravité $G$ et l'orthocentre $H$ sont **alignés**, sur la droite d'Euler, avec $\overrightarrow{OH} = 3\,\overrightarrow{OG}$.

## 9. Arc capable

> **📘 Définition — Arc capable**
>
> Le segment $[AB]$ est **vu** du point $M$ sous l'angle $\theta$ si $(\overrightarrow{MA}, \overrightarrow{MB}) = \theta \;[2\pi]$. L'ensemble de ces points $M$ est l'**arc capable** de $[AB]$ pour l'angle $\theta$.

> **🏛️ Théorème — Ensemble des points $M$ tels que $(\overrightarrow{MA}, \overrightarrow{MB}) = \theta$**
>
> **À $2\pi$ près** :
> - $\theta = 0$ : la droite $(AB)$ **privée** du segment $[AB]$ ;
> - $\theta = \pi$ : le segment $[AB]$ privé de $A$ et $B$ ;
> - sinon : un **arc de cercle** d'extrémités $A$ et $B$ (privé de $A$ et $B$).
>
> **À $\pi$ près** :
> - $\theta = 0$ : la droite $(AB)$ privée de $A$ et $B$ ;
> - sinon : un **cercle** entier passant par $A$ et $B$, privé de $A$ et $B$ (le « cercle capable »).

> **🧭 Méthode — construire l'arc capable**
>
> 1. Trace $[AB]$, puis une demi-droite $[AT)$ telle que $(\overrightarrow{AT}, \overrightarrow{AB}) = \theta$ : ce sera la tangente en $A$.
> 2. Trace la perpendiculaire à $(AT)$ en $A$, puis la médiatrice de $[AB]$ : elles se coupent au centre $\Omega$.
> 3. Trace l'arc de centre $\Omega$ d'extrémités $A$ et $B$, du côté opposé à $T$.

> **🎯 À retenir**
>
> - Sens direct = sens inverse des aiguilles d'une montre ; un angle orienté se mesure à $2\pi$ près.
> - Mesure principale : l'unique mesure dans $]-\pi \,;\, \pi]$.
> - Chasles : $(\vec{u}, \vec{v}) = (\vec{u}, \vec{w}) + (\vec{w}, \vec{v})$.
> - Angle au centre $= 2 \times$ angle inscrit.
> - Cocycliques : $(\overrightarrow{AB}, \overrightarrow{AC}) = (\overrightarrow{DB}, \overrightarrow{DC}) \;[\pi]$ ; alignés : $(\overrightarrow{AB}, \overrightarrow{AC}) = 0 \;[\pi]$.
