# Fonctions numériques

> **🎯 Dans ce chapitre, tu vas apprendre à…**
>
> - trouver où une fonction existe ;
> - calculer des limites, même quand elles « coincent » (formes indéterminées) ;
> - repérer les asymptotes et les branches infinies d'une courbe ;
> - utiliser la continuité (valeurs intermédiaires, bijection) ;
> - dériver, étudier les variations, trouver les tangentes ;
> - exploiter les symétries et tracer des courbes « cousines ».

## 1. L'ensemble de définition

> **💡 Pour bien comprendre — la machine qui refuse certains nombres**
>
> Une fonction, c'est une machine : on met un nombre $x$, elle rend un nombre $f(x)$. Mais certaines machines **refusent** des nombres : on ne peut pas diviser par $0$, ni prendre la racine carrée d'un nombre négatif. L'ensemble de définition, c'est **la liste des nombres acceptés**.

> **📘 Définition — Ensemble de définition**
>
> L'ensemble de définition de $f$, noté $D_f$ (ou $E_f$), est l'ensemble des réels $x$ pour lesquels $f(x)$ existe.

> **🏛️ Propriété — Quand $f(x)$ existe-t-il ?** ($p$ et $q$ sont des polynômes)
>
> - Un **polynôme** existe toujours : $D = \mathbb{R}$.
> - $\dfrac{p(x)}{q(x)}$ existe $\iff q(x) \neq 0$ (on ne divise pas par zéro).
> - $\sqrt{p(x)}$ existe $\iff p(x) \geq 0$ (pas de racine d'un négatif).
> - $\dfrac{\sqrt{p(x)}}{\sqrt{q(x)}}$ existe $\iff p(x) \geq 0$ et $q(x) > 0$.
> - $\sqrt{\dfrac{p(x)}{q(x)}}$ existe $\iff \dfrac{p(x)}{q(x)} \geq 0$ et $q(x) \neq 0$.
> - $|p(x)|$, $\cos(ax+b)$, $\sin(ax+b)$ existent toujours.

> **✏️ Exemple — À toi de jouer, puis vérifie**
>
> Trouve l'ensemble de définition de : $f(x) = 3x^4 + 2x + 6$ ; $g(x) = \sqrt{x+1}$ ; $h(x) = \sqrt{|x+2| - 2}$ ; $k(x) = \dfrac{x}{(x+3)(x-1)}$ ; $l(x) = x + 5 + \sqrt{2x+4}$ ; $m(x) = \dfrac{x}{\sqrt{x+1}}$ ; $p(x) = \dfrac{\sqrt{x}}{x(x+3)}$.
>
> **Solution.**
>
> - $D_f = \mathbb{R}$ (polynôme).
> - $x + 1 \geq 0$ : $D_g = [-1 \,;\, +\infty[$.
> - $|x+2| \geq 2 \iff x \leq -4$ ou $x \geq 0$ : $D_h = ]-\infty \,;\, -4] \cup [0 \,;\, +\infty[$.
> - $D_k = \mathbb{R} \setminus \{-3 \,;\, 1\}$.
> - $2x + 4 \geq 0$ : $D_l = [-2 \,;\, +\infty[$.
> - $x + 1 > 0$ (racine au dénominateur) : $D_m = ]-1 \,;\, +\infty[$.
> - $x \geq 0$, $x \neq 0$ et $x \neq -3$ : $D_p = ]0 \,;\, +\infty[$.

## 2. Les limites

> **💡 Pour bien comprendre — « où va la fonction ? »**
>
> Calculer une limite, c'est regarder **où se dirige** $f(x)$ quand $x$ s'approche d'une valeur (ou part vers l'infini), comme on devine la destination d'une voiture en regardant sa route.

> **📐 Formules — limites de référence** ($n$ entier $\geq 1$, $k$ réel)
>
> $$\lim_{x \to +\infty} x^n = +\infty$$
>
> $$\lim_{x \to \pm\infty} \frac{k}{x^n} = 0$$
>
> $$\lim_{x \to +\infty} \sqrt{x} = +\infty$$
>
> $$\lim_{x \to 0^+} \frac{1}{x} = +\infty$$
>
> $$\lim_{x \to 0^-} \frac{1}{x} = -\infty$$
>
> $$\lim_{x \to 0} \frac{1}{x^2} = +\infty$$
>
> En $-\infty$ : $x^n \to +\infty$ si $n$ est pair, $x^n \to -\infty$ si $n$ est impair.

> **🏛️ Théorème — Polynômes et fractions rationnelles à l'infini**
>
> - Un **polynôme** se comporte à l'infini comme son **terme de plus haut degré**.
> - Une **fraction rationnelle** se comporte à l'infini comme le **quotient des termes de plus haut degré** du numérateur et du dénominateur.

> **✏️ Exemple**
>
> - $\displaystyle\lim_{x \to -\infty} (-5x^3 + 7x + 4) = \lim_{x \to -\infty} -5x^3 = +\infty$.
> - $\displaystyle\lim_{x \to +\infty} \frac{3x^2 + 2x}{x - 1} = \lim_{x \to +\infty} \frac{3x^2}{x} = \lim_{x \to +\infty} 3x = +\infty$.

> **📘 Définition — Formes indéterminées**
>
> Quand le calcul direct donne l'une de ces quatre situations, on ne peut pas conclure tout de suite :
>
> $$+\infty - \infty$$
>
> $$0 \times \infty$$
>
> $$\frac{0}{0}$$
>
> $$\frac{\infty}{\infty}$$

> **🧭 Méthode — lever une indétermination**
>
> - Avec des **polynômes** : on **factorise** (souvent par $(x - a)$ quand on tend vers $a$).
> - Avec des **racines carrées** : on multiplie par l'**expression conjuguée** : $(\sqrt{A} - \sqrt{B})(\sqrt{A} + \sqrt{B}) = A - B$.

> **✏️ Exemple — quatre formes indéterminées**
>
> - $\displaystyle\lim_{x \to 1} \frac{1 - \sqrt{x}}{x - 1} = \lim_{x \to 1} \frac{1 - \sqrt{x}}{(\sqrt{x} - 1)(\sqrt{x} + 1)} = \lim_{x \to 1} \frac{-1}{\sqrt{x} + 1} = -\frac{1}{2}$.
> - $\sqrt{3 - x} - \sqrt{2 - x} = \dfrac{(3 - x) - (2 - x)}{\sqrt{3-x} + \sqrt{2-x}} = \dfrac{1}{\sqrt{3-x} + \sqrt{2-x}} \to 0$ quand $x \to -\infty$.
> - $x - \sqrt{x^2+1} = \dfrac{x^2 - (x^2+1)}{x + \sqrt{x^2+1}} = \dfrac{-1}{x + \sqrt{x^2+1}} \to 0$ quand $x \to +\infty$.
> - $\dfrac{x^3 - 7x + 6}{x^2 + 3x - 10} = \dfrac{(x-2)(x^2 + 2x - 3)}{(x-2)(x+5)} = \dfrac{x^2 + 2x - 3}{x + 5} \to \dfrac{5}{7}$ quand $x \to 2$.

> **📐 Formules — limites trigonométriques** ($a \neq 0$)
>
> $$\lim_{x \to 0} \frac{\sin x}{x} = 1$$
>
> $$\lim_{x \to 0} \frac{\sin ax}{x} = a$$
>
> $$\lim_{x \to 0} \frac{\tan x}{x} = 1$$
>
> $$\lim_{x \to 0} \frac{1 - \cos x}{x^2} = \frac{1}{2}$$
>
> $$\lim_{x \to 0} \frac{1 - \cos ax}{x^2} = \frac{a^2}{2}$$

> **🏛️ Théorème — Comparaison et gendarmes**
>
> - Si $f(x) \geq g(x)$ pour $x$ assez grand et $g(x) \to +\infty$, alors $f(x) \to +\infty$.
> - Si $f(x) \leq g(x)$ pour $x$ assez grand et $g(x) \to -\infty$, alors $f(x) \to -\infty$.
> - **Théorème des gendarmes** : si $g(x) \leq f(x) \leq h(x)$ et si $g$ et $h$ ont la **même** limite $\ell$, alors $f(x) \to \ell$.
> - Variante : si $|f(x) - \ell| \leq g(x)$ et $g(x) \to 0$, alors $f(x) \to \ell$.

> **💡 Pour bien comprendre — les gendarmes**
>
> Deux gendarmes encadrent un prisonnier et marchent vers la prison : le prisonnier, coincé entre eux, arrive **forcément** à la prison aussi !

> **✏️ Exemple — les gendarmes en action**
>
> Soit $f(x) = \dfrac{x + \sin x}{x}$ sur $]0 \,;\, +\infty[$. Comme $-1 \leq \sin x \leq 1$ : $\dfrac{x - 1}{x} \leq f(x) \leq \dfrac{x + 1}{x}$. Les deux bornes tendent vers $1$ en $+\infty$ : par les gendarmes, $\displaystyle\lim_{x \to +\infty} f(x) = 1$.

> **✏️ Exemple — la comparaison**
>
> Soit $f(x) = 2x + 1 - 3\sin x$. Comme $-3 \leq -3\sin x \leq 3$ : $2x - 2 \leq f(x) \leq 2x + 4$. En $+\infty$, $2x - 2 \to +\infty$ donc $f(x) \to +\infty$ ; en $-\infty$, $2x + 4 \to -\infty$ donc $f(x) \to -\infty$.

> **🏛️ Théorème — Limite d'une composée**
>
> Si $g(x) \to b$ quand $x \to a$ et $f(X) \to c$ quand $X \to b$, alors $f(g(x)) \to c$ quand $x \to a$.

## 3. Les branches infinies et les asymptotes

> **💡 Pour bien comprendre — les rails de la courbe**
>
> Une asymptote est une droite dont la courbe se rapproche **de plus en plus**, comme un train qui longe des rails, sans forcément jamais les toucher.

> **📘 Définition — Asymptotes**
>
> - **Asymptote verticale** $x = a$ : si $f(x) \to \pm\infty$ quand $x \to a$.
> - **Asymptote horizontale** $y = b$ : si $f(x) \to b$ quand $x \to \pm\infty$.
> - **Asymptote oblique** $y = ax + b$ : si $f(x) - (ax + b) \to 0$ quand $x \to \pm\infty$.

> **🧭 Méthode — quand $f(x) \to \pm\infty$ en l'infini : la recherche en 3 étapes**
>
> 1. Calcule $\displaystyle\lim \frac{f(x)}{x}$.
>    - si elle vaut $0$ : **branche parabolique de direction $(Ox)$** ;
>    - si elle vaut $\pm\infty$ : **branche parabolique de direction $(Oy)$** ;
>    - si elle vaut un réel $a \neq 0$ : passe à l'étape 2.
> 2. Calcule $\lim \big(f(x) - ax\big)$.
>    - si c'est un réel $b$ : la droite $y = ax + b$ est **asymptote oblique** ;
>    - si c'est $\pm\infty$ : **branche parabolique de direction la droite $y = ax$**.
> 3. Astuce : si on peut écrire $f(x) = ax + b + \varepsilon(x)$ avec $\varepsilon(x) \to 0$, la droite $y = ax + b$ est directement asymptote.

> **🧭 Méthode — position de la courbe par rapport à une droite $y = ax + b$**
>
> Étudie le **signe** de $f(x) - (ax + b)$ : positif → courbe **au-dessus** ; négatif → courbe **en dessous** ; nul → elles se coupent.

## 4. La continuité

> **💡 Pour bien comprendre — tracer sans lever le crayon**
>
> Une fonction est continue sur un intervalle si on peut tracer sa courbe **sans lever le crayon** : pas de saut, pas de trou.

> **📘 Définition — Continuité en un point**
>
> $f$ est continue en $x_0$ si $f(x_0)$ existe et $\displaystyle\lim_{x \to x_0} f(x) = f(x_0)$.
> Autrement dit : limite à gauche $=$ limite à droite $= f(x_0)$.

> **🏛️ Théorème — Fonctions continues**
>
> - Les polynômes, les fractions rationnelles, les racines, $\sin$ et $\cos$ sont continus là où ils sont définis.
> - Sommes, produits, quotients (dénominateur non nul) et composées de fonctions continues sont continus.
> - Toute fonction **dérivable** est continue (mais pas l'inverse : $|x|$ est continue en $0$ sans y être dérivable).

> **✏️ Exemple — une fonction « en deux morceaux »**
>
> $f(x) = -x + 4 - \dfrac{1}{x-1}$ si $x \leq 0$, et $f(x) = \dfrac{3x - 5}{x^2 - 1}$ si $x > 0$.
> - **Définition** : le premier morceau existe pour tout $x \leq 0$ ; le second exige $x \neq 1$. Donc $D_f = \mathbb{R} \setminus \{1\}$.
> - **En $0$** : $f(0) = 4 + 1 = 5$ et, à droite, $\dfrac{3x-5}{x^2-1} \to \dfrac{-5}{-1} = 5$. Les deux côtés valent $5$ : $f$ est **continue en $0$**, donc continue sur $\mathbb{R} \setminus \{1\}$.
> - **Limites et asymptotes** : en $1^-$, $f(x) \to +\infty$ ; en $1^+$, $f(x) \to -\infty$ : asymptote verticale $x = 1$. En $+\infty$, $f(x) \to 0$ : asymptote horizontale $y = 0$. En $-\infty$, $f(x) - (-x + 4) = -\dfrac{1}{x-1} \to 0$ : asymptote oblique $y = -x + 4$.

> **📘 Définition — Prolongement par continuité**
>
> Si $f$ n'est pas définie en $x_0$ mais $f(x) \to \ell$ (réel) quand $x \to x_0$, on « bouche le trou » en posant $g(x_0) = \ell$ et $g(x) = f(x)$ ailleurs : $g$ est le **prolongement par continuité** de $f$ en $x_0$.

> **✏️ Exemple — boucher un trou**
>
> - $f(x) = \dfrac{x^3 + 1}{x^2 + 3x + 2}$ n'est pas définie en $-2$ ni en $-1$. Or $\dfrac{(x+1)(x^2 - x + 1)}{(x+1)(x+2)} = \dfrac{x^2 - x + 1}{x + 2} \to 3$ quand $x \to -1$ : on prolonge en posant $f(-1) = 3$.
> - $g(x) = x^2 \sin\left(\frac{1}{x}\right)$ : $-x^2 \leq g(x) \leq x^2$, donc par les gendarmes $g(x) \to 0$ en $0$ : on prolonge en posant $g(0) = 0$.

> **🏛️ Théorème — Image d'un intervalle**
>
> L'image d'un intervalle par une fonction continue est un **intervalle**. Si $f$ est continue et strictement croissante sur $[a \,;\, b]$, alors $f([a \,;\, b]) = [f(a) \,;\, f(b)]$ ; si elle est strictement décroissante, $f([a \,;\, b]) = [f(b) \,;\, f(a)]$. Sur un intervalle ouvert, on remplace les valeurs aux bornes par les limites.

> **🏛️ Théorème — Valeurs intermédiaires**
>
> Si $f$ est continue sur $[a \,;\, b]$, alors $f$ prend **toutes** les valeurs comprises entre $f(a)$ et $f(b)$.
> **Conséquence** : si $f(a) \times f(b) < 0$, l'équation $f(x) = 0$ a **au moins une** solution dans $]a \,;\, b[$ ; si en plus $f$ est strictement monotone, cette solution est **unique**.

> **💡 Pour bien comprendre — traverser la rivière**
>
> Si tu pars d'une rive (valeur négative) et arrives sur l'autre (valeur positive) sans sauter, tu as **forcément** traversé la rivière (la valeur $0$) au moins une fois.

> **✏️ Exemple**
>
> $f(x) = x^3 + 2x - 1$ : $f(0{,}4) = -0{,}136 < 0$ et $f(0{,}5) = 0{,}125 > 0$, $f$ est continue et strictement croissante ($f'(x) = 3x^2 + 2 > 0$). Donc $f(x) = 0$ a une unique solution $\alpha$ dans $[0{,}4 \,;\, 0{,}5]$.

> **🏛️ Théorème — Bijection**
>
> Si $f$ est continue et strictement monotone sur un intervalle $I$, alors $f$ réalise une **bijection** de $I$ sur $f(I)$. Sa réciproque $f^{-1}$ est continue, a le même sens de variation, et sa courbe est la **symétrique** de celle de $f$ par rapport à la droite $y = x$.

## 5. La dérivation

> **💡 Pour bien comprendre — la pente du chemin**
>
> Le nombre dérivé $f'(x_0)$, c'est **la pente** de la courbe au point d'abscisse $x_0$ : si elle est positive, ça monte ; négative, ça descend ; nulle, c'est plat (sommet ou creux).

> **📘 Définition — Nombre dérivé**
>
> $f$ est dérivable en $x_0$ si le taux d'accroissement a une limite réelle :
>
> $$f'(x_0) = \lim_{x \to x_0} \frac{f(x) - f(x_0)}{x - x_0}$$

> **📐 Formule — Équation de la tangente au point d'abscisse $x_0$**
>
> $$y = f'(x_0)(x - x_0) + f(x_0)$$

> **🏛️ Propriété — Tangentes et demi-tangentes particulières**
>
> - Taux $\to 0$ : tangente **horizontale** $y = f(x_0)$.
> - Taux $\to \pm\infty$ : $f$ n'est pas dérivable en $x_0$, mais la courbe a une tangente **verticale** $x = x_0$.
> - Dérivées à gauche et à droite **différentes** : deux demi-tangentes, c'est un **point anguleux**.
> - Demi-tangentes verticales de sens contraires : **point de rebroussement**.

> **📐 Formules — dérivées des fonctions usuelles**
>
> | Fonction | Dérivée |
> |---|---|
> | $k$ (constante) | $0$ |
> | $ax + b$ | $a$ |
> | $x^n$ | $n x^{n-1}$ |
> | $\sqrt{x}$ | $\dfrac{1}{2\sqrt{x}}$ |
> | $\dfrac{1}{x}$ | $-\dfrac{1}{x^2}$ |
> | $\sin x$ | $\cos x$ |
> | $\cos x$ | $-\sin x$ |
> | $\tan x$ | $1 + \tan^2 x = \dfrac{1}{\cos^2 x}$ |

> **📐 Formules — dérivées et opérations**
>
> | Fonction | Dérivée |
> |---|---|
> | $u + v$ | $u' + v'$ |
> | $k u$ | $k u'$ |
> | $u v$ | $u'v + uv'$ |
> | $\dfrac{1}{u}$ | $-\dfrac{u'}{u^2}$ |
> | $\dfrac{u}{v}$ | $\dfrac{u'v - uv'}{v^2}$ |
> | $u^n$ | $n u^{n-1} u'$ |
> | $\sqrt{u}$ | $\dfrac{u'}{2\sqrt{u}}$ |
> | $\sin u$ | $u' \cos u$ |
> | $\cos u$ | $-u' \sin u$ |
> | $v \circ u$ | $u' \times (v' \circ u)$ |

> **✏️ Exemple — À toi de jouer, puis vérifie**
>
> Dérive $f(x) = 5x^5 + 6$, $g(x) = 2020^{2020}$, $h(x) = 2\sqrt{x}$, $p(x) = -\dfrac{2}{x}$ ; puis $g \circ f$ avec $f(x) = 2x + 4$ et $g(x) = \dfrac{1}{x - 4}$ ; enfin $f''$ pour $f(x) = \dfrac{1}{x}$.
>
> **Solution.**
>
> - $f'(x) = 25x^4$ ; $g'(x) = 0$ ($g$ est une constante !) ; $h'(x) = \dfrac{1}{\sqrt{x}}$ ; $p'(x) = \dfrac{2}{x^2}$.
> - $(g \circ f)(x) = \dfrac{1}{2x}$, donc $(g \circ f)'(x) = -\dfrac{1}{2x^2}$ (on retrouve $f'(x) \times g'(f(x)) = 2 \times \left(-\dfrac{1}{(2x)^2}\right)$).
> - $f'(x) = -\dfrac{1}{x^2}$, $f''(x) = \dfrac{2}{x^3}$.

## 6. Variations, extremums, points d'inflexion

> **🏛️ Théorème — Le signe de la dérivée donne le sens de variation** (sur un intervalle $I$)
>
> - $f'(x) \geq 0$ sur $I$ $\iff$ $f$ croissante sur $I$ ;
> - $f'(x) \leq 0$ sur $I$ $\iff$ $f$ décroissante sur $I$ ;
> - $f'(x) = 0$ sur $I$ $\iff$ $f$ constante sur $I$.

> **🏛️ Théorème — Extremum**
>
> Si $f'$ s'annule en $x_0$ **en changeant de signe**, $f$ a un extremum (maximum ou minimum local) en $x_0$.

> **📘 Définition — Point d'inflexion**
>
> Un point d'inflexion est un point où la courbe **traverse sa tangente** (elle passe de « bol » à « dôme », ou l'inverse). C'est le cas quand $f''$ s'annule en changeant de signe.

> **✏️ Exemple — étude complète**
>
> Soit $f(x) = \dfrac{x^2 + x + 1}{x + 1}$.
> - $D_f = \mathbb{R} \setminus \{-1\}$ et $f(x) = x + \dfrac{1}{x+1}$.
> - Limites : $-\infty$ en $-\infty$ ; $-\infty$ en $-1^-$ ; $+\infty$ en $-1^+$ ; $+\infty$ en $+\infty$.
> - Asymptotes : $x = -1$ (verticale) ; $y = x$ (oblique, car $\dfrac{1}{x+1} \to 0$).
> - $f'(x) = 1 - \dfrac{1}{(x+1)^2} = \dfrac{x(x+2)}{(x+1)^2}$ : du signe de $x(x+2)$.
> - $f$ croît sur $]-\infty \,;\, -2]$, décroît sur $[-2 \,;\, -1[$ et sur $]-1 \,;\, 0]$, croît sur $[0 \,;\, +\infty[$. Maximum local $f(-2) = -3$, minimum local $f(0) = 1$.

> **🏛️ Théorème — Dérivée de la réciproque**
>
> Si $f$ est dérivable et strictement monotone sur $I$ avec $f'$ qui ne s'annule pas, alors $f^{-1}$ est dérivable et
>
> $$\left(f^{-1}\right)'(y) = \frac{1}{f'\big(f^{-1}(y)\big)}$$

## 7. Les accroissements finis

> **🏛️ Théorème — Rolle**
>
> Si $f$ est continue sur $[a \,;\, b]$, dérivable sur $]a \,;\, b[$ et $f(a) = f(b)$, il existe $c \in ]a \,;\, b[$ tel que $f'(c) = 0$.

> **💡 Pour bien comprendre**
>
> Si tu pars et reviens à la même altitude, il y a forcément un moment où ton chemin est **plat** (le sommet ou le creux).

> **🏛️ Théorème — Accroissements finis**
>
> Si $f$ est continue sur $[a \,;\, b]$ et dérivable sur $]a \,;\, b[$, il existe $c \in ]a \,;\, b[$ tel que $f(b) - f(a) = (b - a) f'(c)$.

> **🏛️ Théorème — Inégalités des accroissements finis**
>
> - Si $m \leq f'(x) \leq M$ sur $[a \,;\, b]$, alors $m(b - a) \leq f(b) - f(a) \leq M(b - a)$.
> - Si $|f'(x)| \leq M$ sur $I$, alors $|f(b) - f(a)| \leq M|b - a|$ pour tous $a$, $b$ de $I$.

> **✏️ Exemple — encadrer avec la dérivée**
>
> Soit $f(x) = \sqrt{x^2 + 1}$, donc $f'(x) = \dfrac{x}{\sqrt{x^2+1}}$, qui est croissante sur $[1 \,;\, 2]$.
> - Sur $[1 \,;\, 2]$ : $f'(1) = \dfrac{1}{\sqrt{2}} \leq f'(x) \leq f'(2) = \dfrac{2}{\sqrt{5}}$.
> - Pour $x \in [1 \,;\, 2]$, on applique l'inégalité entre $x$ et $2$ : $\dfrac{2}{\sqrt{5}}(x - 2) \leq f(x) - \sqrt{5} \leq \dfrac{1}{\sqrt{2}}(x - 2)$.
> - Comme $|f'(x)| \leq \dfrac{2}{\sqrt{5}}$ sur $[1 \,;\, 2]$ : $|f(x) - \sqrt{2}| \leq \dfrac{2}{\sqrt{5}}|x - 1|$.
> *(La version d'origine de cet exercice inversait les bornes : $f'(2) = \frac{2}{\sqrt5} \approx 0{,}89$ est bien plus grand que $\frac{1}{\sqrt2} \approx 0{,}71$.)*

## 8. Symétries et périodicité

> **📘 Définition — Fonction paire, fonction impaire** ($D_f$ symétrique par rapport à $0$)
>
> - $f$ est **paire** si $f(-x) = f(x)$ : sa courbe est symétrique par rapport à l'**axe des ordonnées**.
> - $f$ est **impaire** si $f(-x) = -f(x)$ : sa courbe est symétrique par rapport à l'**origine**.

> **✏️ Exemple**
>
> - $f(x) = \dfrac{|x|}{x^2+1}$ : $D_f = \mathbb{R}$ et $f(-x) = f(x)$, donc $f$ est **paire**.
> - $g(x) = \dfrac{x^3}{\sqrt{1 - x^2}}$ : $D_g = ]-1 \,;\, 1[$ et $g(-x) = -g(x)$, donc $g$ est **impaire**.

> **🏛️ Propriété — Centre et axe de symétrie**
>
> - $\Omega(a \,;\, b)$ est **centre de symétrie** de la courbe si $f(2a - x) + f(x) = 2b$ (pour $x$ et $2a - x$ dans $D_f$).
> - La droite $x = a$ est **axe de symétrie** si $f(2a - x) = f(x)$.

> **✏️ Exemple**
>
> - $f(x) = \dfrac{x^3 + 3x^2 + 4x + 3}{x^2+1} = x + 3 + \dfrac{3x}{x^2+1}$. Alors $f(-x) + f(x) = 6 = 2 \times 3$ : $B(0 \,;\, 3)$ est centre de symétrie.
> - $f(x) = -2x^2 + 6x + 1$ : $f(3 - x) = -2x^2 + 6x + 1 = f(x)$, donc la droite $x = \frac{3}{2}$ est axe de symétrie.

> **📘 Définition — Fonction périodique**
>
> $f$ est périodique de période $T$ si $f(x + T) = f(x)$ pour tout $x$. On l'étudie alors sur un intervalle de longueur $T$, puis on complète la courbe par des **translations** de vecteur $T\vec{i}$.

> **📐 Formules — périodes usuelles** ($a \neq 0$)
>
> $$\cos(ax+b) \text{ et } \sin(ax+b) : \ T = \frac{2\pi}{|a|}$$
>
> $$\tan(ax+b) : \ T = \frac{\pi}{|a|}$$

> **🧭 Méthode — point fixe d'une famille de courbes $(\mathcal{C}_m)$**
>
> Un point fixe est un point par lequel passent **toutes** les courbes, quel que soit $m$. On écrit $y = f_m(x)$ comme une égalité en $m$, on la range sous la forme $m \times A(x, y) + B(x, y) = 0$, et on exige $A = 0$ et $B = 0$.

> **🧭 Méthode — intersections avec les axes**
>
> - Avec l'axe des abscisses : résoudre $f(x) = 0$.
> - Avec l'axe des ordonnées : calculer $f(0)$ (si $0 \in D_f$).

## 9. Les courbes « cousines »

> **💡 Pour bien comprendre — déplacer une courbe sans la redessiner**
>
> Quand tu connais la courbe de $f$, tu peux obtenir celle de beaucoup d'autres fonctions par un simple **glissement** ou un **reflet dans un miroir**.

> **📐 Formules — courbe de $g$ à partir de celle de $f$**
>
> | $g(x) =$ | La courbe de $g$ s'obtient par… |
> |---|---|
> | $-f(x)$ | symétrie par rapport à l'axe $(Ox)$ |
> | $f(-x)$ | symétrie par rapport à l'axe $(Oy)$ |
> | $-f(-x)$ | symétrie par rapport à l'origine $O$ |
> | $f(x - a)$ | translation de vecteur $a\vec{i}$ (glissement horizontal) |
> | $f(x) + b$ | translation de vecteur $b\vec{j}$ (glissement vertical) |
> | $f(x - a) + b$ | translation de vecteur $a\vec{i} + b\vec{j}$ |
> | $\lvert f(x) \rvert$ | on garde la partie au-dessus de $(Ox)$ et on « replie » la partie en dessous |
> | $f(\lvert x \rvert)$ | on garde la partie où $x \geq 0$ et on la recopie par symétrie par rapport à $(Oy)$ |
> | $k f\left(\frac{x}{k}\right)$ | homothétie de centre $O$ et de rapport $k$ |

> **⚠️ Attention — le piège du signe**
>
> La courbe de $x \mapsto f(x - 2)$ est décalée de $2$ vers la **droite** (et non vers la gauche) : le point d'abscisse $x$ de la courbe de $f$ se retrouve à l'abscisse $x + 2$.

> **🎯 À retenir**
>
> - Les deux interdits : diviser par $0$, prendre la racine carrée d'un nombre négatif.
> - Forme indéterminée → factoriser ou utiliser la quantité conjuguée.
> - Asymptote oblique : $\frac{f(x)}{x} \to a$, puis $f(x) - ax \to b$.
> - Valeurs intermédiaires + stricte monotonie → une solution unique.
> - Tangente : $y = f'(x_0)(x - x_0) + f(x_0)$ ; le signe de $f'$ donne les variations.
