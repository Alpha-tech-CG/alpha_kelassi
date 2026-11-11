# Courbes paramétrées

> **🎯 Dans ce chapitre, tu vas apprendre à…**
>
> - décrire le trajet d'un point qui bouge avec le **temps** $t$ ;
> - réduire l'intervalle d'étude grâce à la **périodicité** et aux **symétries** ;
> - dresser un tableau de variations **commun** à $x(t)$ et $y(t)$ ;
> - trouver les **tangentes** et les **branches infinies** ;
> - tracer la courbe.

## 1. Rappels : parité et périodicité

> **📘 Définition — Fonction paire, impaire, périodique**
>
> - $f$ est **paire** si $f(-x) = f(x)$ (exemple : $x^2$) : courbe symétrique par rapport à l'axe des ordonnées.
> - $f$ est **impaire** si $f(-x) = -f(x)$ (exemple : $x^3$) : courbe symétrique par rapport à l'origine.
> - $f$ est **périodique** de période $T > 0$ si $f(x + T) = f(x)$ (exemple : $\cos x$, période $2\pi$).

## 2. Qu'est-ce qu'une courbe paramétrée ?

> **💡 Pour bien comprendre — la fourmi qui se promène**
>
> Imagine une fourmi qui marche sur une feuille. À chaque instant $t$, on note sa position : son abscisse $x(t)$ et son ordonnée $y(t)$. Le chemin qu'elle dessine est une **courbe paramétrée**. Le « paramètre » $t$, c'est l'horloge.

> **📘 Définition — Courbe paramétrée**
>
> Soit $I$ un intervalle et $x$, $y$ deux fonctions définies sur $I$. La **courbe paramétrée** $(\mathcal{C})$ est l'ensemble des points $M(t)$ de coordonnées $\big(x(t) \,;\, y(t)\big)$ pour $t \in I$.
> - Le système « $x = x(t)$ et $y = y(t)$ » est une **représentation paramétrique** de $(\mathcal{C})$.
> - La **fonction vectorielle** associée est $F(t) = \overrightarrow{OM}(t) = x(t)\,\vec{i} + y(t)\,\vec{j}$.

> **✏️ Exemple — trois courbes connues**
>
> - $t \mapsto (\cos t \,;\, \sin t)$ décrit le **cercle trigonométrique**.
> - $t \mapsto (at + b \,;\, ct + d)$ décrit une **droite** si $(a, c) \neq (0, 0)$.
> - $t \mapsto \big(t \,;\, f(t)\big)$ décrit la **courbe de la fonction** $f$.

> **✏️ Exemple — paramétrer un segment**
>
> Soit $A(2 \,;\, -1)$ et $B(-1 \,;\, 3)$. Trouve une représentation paramétrique du segment $[AB]$.
>
> **Solution.**
>
> - $M$ est sur $[AB]$ si et seulement si $\overrightarrow{AM} = k\,\overrightarrow{AB}$ avec $k \in [0 \,;\, 1]$.
> - $\overrightarrow{AB}(-3 \,;\, 4)$, donc $x - 2 = -3k$ et $y + 1 = 4k$.
> - Représentation : $x = 2 - 3k$ et $y = -1 + 4k$, avec $k \in [0 \,;\, 1]$.

> **⚠️ Attention**
>
> - Une même courbe peut avoir **plusieurs** représentations paramétriques.
> - $M(t)$ n'existe que si $x(t)$ **et** $y(t)$ existent en même temps.
> - Parfois, on peut **éliminer** $t$ entre les deux équations et obtenir directement une relation entre $x$ et $y$.

## 3. Le plan d'étude

> **🧭 Méthode — étudier une courbe paramétrée**
>
> 1. **Domaine** : $D = D_x \cap D_y$.
> 2. **Réduire** l'intervalle d'étude (périodicité, symétries).
> 3. **Tableau de variations commun** de $x$ et de $y$.
> 4. **Points remarquables** et **tangentes**.
> 5. **Branches infinies**.
> 6. **Tracé** de la courbe.

### a) Réduire l'intervalle d'étude

> **🏛️ Propriété — Périodicité**
>
> Si $x$ et $y$ sont périodiques de période $T$, la fourmi repasse par le même chemin tous les $T$ : on étudie la courbe sur un intervalle de longueur $T$, par exemple $[t_0 \,;\, t_0 + T]$.
> Si $x$ a pour période $T_1$ et $y$ pour période $T_2$, on prend la **période commune** (le plus petit multiple commun).

> **🏛️ Propriété — Symétries** (on compare $M(t)$ et un autre point de la courbe)
>
> | Si, pour tout $t$… | alors $M(-t)$ est le symétrique de $M(t)$ par rapport à… |
> |---|---|
> | $x(-t) = x(t)$ et $y(-t) = -y(t)$ | l'axe $(Ox)$ |
> | $x(-t) = -x(t)$ et $y(-t) = y(t)$ | l'axe $(Oy)$ |
> | $x(-t) = -x(t)$ et $y(-t) = -y(t)$ | l'origine $O$ |
> | $x(-t) = y(t)$ et $y(-t) = x(t)$ | la droite $y = x$ |
> | $x(-t) = -y(t)$ et $y(-t) = -x(t)$ | la droite $y = -x$ |
>
> Les mêmes règles valent en remplaçant $-t$ par $\pi - t$ ou $\pi + t$. Si $x(-t) = x(t)$ et $y(-t) = y(t)$, les points $M(-t)$ et $M(t)$ sont **confondus**.

> **💡 Pour bien comprendre — travailler moitié moins**
>
> Grâce à une symétrie, il suffit d'étudier la courbe pour $t \geq 0$ (par exemple), puis de « refléter » le dessin dans un **miroir** pour obtenir l'autre moitié.

### b) Le tableau de variations commun

> **🧭 Méthode — un seul tableau pour deux fonctions**
>
> On met dans **un même tableau** : les valeurs de $t$, le signe de $x'(t)$, les variations de $x$, le signe de $y'(t)$, les variations de $y$. On peut ajouter une ligne avec le **coefficient directeur** $\dfrac{y'(t)}{x'(t)}$ aux valeurs de $t$ importantes.

### c) Les tangentes

> **🏛️ Théorème — Vecteur directeur de la tangente**
>
> Si le vecteur $\vec{V}(t_0) = x'(t_0)\,\vec{i} + y'(t_0)\,\vec{j}$ n'est **pas nul**, la courbe a au point $M(t_0)$ une tangente dirigée par ce vecteur.
> - $x'(t_0) = 0$ et $y'(t_0) \neq 0$ : tangente **verticale** ;
> - $x'(t_0) \neq 0$ et $y'(t_0) = 0$ : tangente **horizontale** ;
> - $x'(t_0) \neq 0$ et $y'(t_0) \neq 0$ : tangente **oblique**, de coefficient directeur $\dfrac{y'(t_0)}{x'(t_0)}$.

> **💡 Pour bien comprendre — le vecteur vitesse**
>
> $\vec{V}(t)$ est le **vecteur vitesse** de la fourmi : il indique dans quelle direction elle avance à l'instant $t$. La tangente, c'est la direction de sa marche.

> **🏛️ Propriété — Point stationnaire** ($x'(t_0) = y'(t_0) = 0$ : la fourmi s'arrête un instant)
>
> On regarde la limite $\ell$ de $\dfrac{y'(t)}{x'(t)}$ quand $t \to t_0$ :
> - $\ell = 0$ : tangente **horizontale** ;
> - $\ell = \pm\infty$ : tangente **verticale** ;
> - $\ell = a \neq 0$ : tangente de coefficient directeur $a$, d'équation $y = a\big(x - x(t_0)\big) + y(t_0)$.

### d) Les branches infinies

> **🏛️ Propriété — Branches infinies** (quand $t \to t_0$, $t_0$ fini ou infini)
>
> - $x(t) \to \alpha$ (réel) et $y(t) \to \pm\infty$ : asymptote **verticale** $x = \alpha$.
> - $x(t) \to \pm\infty$ et $y(t) \to \beta$ (réel) : asymptote **horizontale** $y = \beta$.
> - $x(t) \to \pm\infty$ et $y(t) \to \pm\infty$ : on étudie $\dfrac{y(t)}{x(t)}$.
>   - limite $\pm\infty$ : branche parabolique de direction $(Oy)$ ;
>   - limite $0$ : branche parabolique de direction $(Ox)$ ;
>   - limite $a \neq 0$ : on étudie $y(t) - a\,x(t)$. Si elle tend vers un réel $b$, la droite $y = ax + b$ est **asymptote** ; si elle tend vers $\pm\infty$, branche parabolique de direction $y = ax$.

### e) Le tracé

> **🧭 Méthode — tracer proprement**
>
> 1. Place les **asymptotes** et les **points remarquables** (points à tangente horizontale ou verticale, intersections avec les axes : $y(t) = 0$ pour $(Ox)$, $x(t) = 0$ pour $(Oy)$).
> 2. Dessine les petites **tangentes** en ces points.
> 3. Suis le tableau de gauche à droite : regarde comment $x$ et $y$ évoluent ensemble quand $t$ augmente.
> 4. Complète par les **symétries**.

## 4. Un exemple complet : une ellipse

> **✏️ Exemple**
>
> Étudie la courbe $(\mathcal{C})$ définie par $x(t) = -1 + 2\cos t$ et $y(t) = \sin t$, $t \in \mathbb{R}$.
>
> **Solution.**
>
> - **Réduction** : $x$ et $y$ sont $2\pi$-périodiques. De plus $x(-t) = x(t)$ et $y(-t) = -y(t)$ : la courbe est symétrique par rapport à $(Ox)$. On étudie donc sur $[0 \,;\, \pi]$.
> - **Dérivées** : $x'(t) = -2\sin t \leq 0$ sur $[0 \,;\, \pi]$, donc $x$ décroît de $1$ à $-3$. $y'(t) = \cos t$ : $y$ croît de $0$ à $1$ sur $\left[0 \,;\, \frac{\pi}{2}\right]$, puis décroît de $1$ à $0$.
> - **Tangentes** : en $t = 0$, $M(1 \,;\, 0)$ avec $x' = 0$, $y' = 1$ : tangente verticale. En $t = \frac{\pi}{2}$, $M(-1 \,;\, 1)$ avec $y' = 0$ : tangente horizontale. En $t = \pi$, $M(-3 \,;\, 0)$ : tangente verticale.
> - **Axe $(Oy)$** : $x(t) = 0 \iff \cos t = \frac{1}{2} \iff t = \frac{\pi}{3}$, d'où le point $\left(0 \,;\, \frac{\sqrt{3}}{2}\right)$ (et son symétrique).
> - **Équation cartésienne** : $\cos t = \dfrac{x + 1}{2}$ et $\sin t = y$, donc $\left(\dfrac{x+1}{2}\right)^2 + y^2 = 1$ : c'est une **ellipse** de centre $(-1 \,;\, 0)$, de demi-axes $2$ (horizontal) et $1$ (vertical).

> **🎯 À retenir**
>
> - Une courbe paramétrée = le trajet d'un point $M(t)$ qui bouge avec $t$.
> - On réduit l'étude grâce à la périodicité et aux symétries.
> - Tangente dirigée par $\big(x'(t_0) \,;\, y'(t_0)\big)$ : verticale si $x' = 0$, horizontale si $y' = 0$.
> - Branches infinies : même méthode que pour les fonctions, avec $\frac{y(t)}{x(t)}$ puis $y(t) - a\,x(t)$.
