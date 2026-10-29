# Équations différentielles

> **🎯 Dans ce chapitre, tu vas apprendre à…**
>
> - reconnaître une équation différentielle et son **ordre** ;
> - résoudre $y' = f(x)$, $y'' = f(x)$ et $ay' + by = 0$ ;
> - résoudre $ay'' + by' + cy = 0$ grâce à l'**équation caractéristique** ;
> - résoudre une équation **avec second membre** (solution particulière + solution homogène).

## 1. Qu'est-ce qu'une équation différentielle ?

> **💡 Pour bien comprendre — une énigme sur une fonction**
>
> D'habitude, l'inconnue d'une équation est un **nombre** $x$. Ici, l'inconnue est une **fonction** $y$, et l'énigme parle de ses dérivées. Par exemple, $y' = 2y$ veut dire : « trouve une fonction dont la dérivée est le double d'elle-même ».

> **✏️ Exemple — pour commencer**
>
> Soit $g(x) = -e^{2x}$. Calcule $g'$ et $g''$, puis trouve une relation entre $g'$ et $g$, et entre $g''$, $g'$ et $g$.
>
> **Solution.**
>
> - $g'(x) = -2e^{2x}$ et $g''(x) = -4e^{2x}$.
> - $g' = 2g$ : $g$ est solution de l'équation $y' = 2y$.
> - $g'' - g' - 2g = -4e^{2x} + 2e^{2x} + 2e^{2x} = 0$ : $g$ est solution de $y'' - y' - 2y = 0$.

> **📘 Définition — Équation différentielle**
>
> - Une **équation différentielle** est une équation dont l'inconnue est une fonction $y$ et qui contient au moins une de ses dérivées $y'$, $y''$, …
> - Son **ordre** est le plus grand ordre de dérivation qui apparaît : $2y'' + 4y' - y = 0$ est d'ordre $2$ ; $y' + 6y = 0$ est d'ordre $1$.
> - Elle est **homogène** (ou **sans second membre**) quand le membre de droite est nul.
> - **Résoudre** (ou **intégrer**) l'équation sur un intervalle $I$, c'est trouver **toutes** les fonctions solutions sur $I$.

> **📘 Définition — Solution générale, solution particulière**
>
> - La **solution générale** est l'ensemble de toutes les solutions : elle contient **une** constante pour une équation d'ordre $1$, **deux** constantes pour une équation d'ordre $2$.
> - Une **solution particulière** est **une** solution précise, sans constante libre.

## 2. Les équations du premier ordre

> **🏛️ Propriété — Équations $y' = 0$ et $y' = f(x)$**
>
> - $y' = 0$ : les solutions sont les fonctions **constantes** $y = c$.
> - $y' = f(x)$ ($f$ continue sur $I$) : les solutions sont $y = F(x) + c$, où $F$ est une **primitive** de $f$.

> **✏️ Exemple**
>
> Résous $y' = \dfrac{1}{x^2}e^{1/x}$ et $y' = \tan x - \cos(2x)$.
>
> **Solution.**
>
> - $\left(e^{1/x}\right)' = -\dfrac{1}{x^2}e^{1/x}$, donc sur chaque intervalle où $x \neq 0$ : $y = -e^{1/x} + K$.
> - $\tan x = \dfrac{\sin x}{\cos x}$ est de la forme $-\dfrac{u'}{u}$ avec $u = \cos x$. Sur un intervalle où $\cos x \neq 0$ : $y = -\ln\lvert\cos x\rvert - \dfrac{1}{2}\sin(2x) + C$.

> **🏛️ Théorème — Équation $ay' + by = 0$** ($a \neq 0$)
>
> Les solutions sur $\mathbb{R}$ sont les fonctions :
>
> $$y(x) = \lambda\,e^{-\frac{b}{a}x}$$
>
> $$\lambda \in \mathbb{R}$$
>
> Pour une **condition initiale** $y(x_0) = y_0$ donnée, il existe **une seule** solution.

> **💡 Pour bien comprendre — d'où vient l'exponentielle ?**
>
> $ay' + by = 0$ s'écrit $y' = k\,y$ avec $k = -\dfrac{b}{a}$ : la fonction doit être **proportionnelle à sa propre dérivée**. C'est la propriété magique de l'exponentielle : $(e^{kx})' = k\,e^{kx}$.

> **✏️ Exemple**
>
> Trouve la solution de $2y' + 3y = 0$ telle que $f(0) = 2$.
>
> **Solution.**
>
> - $y' = -\dfrac{3}{2}y$, donc $y = \lambda\,e^{-\frac{3}{2}x}$.
> - $f(0) = \lambda = 2$, d'où $f(x) = 2e^{-\frac{3}{2}x}$.

## 3. Les équations du second ordre

> **🏛️ Propriété — Équations $y'' = 0$ et $y'' = f(x)$**
>
> - $y'' = 0$ : $y' = c_1$ puis $y = c_1 x + c_2$ (fonctions affines).
> - $y'' = f(x)$ : on cherche **deux primitives successives**. Si $F$ est une primitive de $f$ et $G$ une primitive de $F$ : $y = G(x) + c_1 x + c_2$.

> **✏️ Exemple**
>
> Résous $y'' = x + \dfrac{1}{x^2}$ et $y'' = 2\sin^2 x$.
>
> **Solution.**
>
> - $y' = \dfrac{x^2}{2} - \dfrac{1}{x} + c_1$, puis $y = \dfrac{x^3}{6} - \ln\lvert x\rvert + c_1 x + c_2$ (sur un intervalle où $x \neq 0$).
> - $2\sin^2 x = 1 - \cos(2x)$, donc $y' = x - \dfrac{1}{2}\sin(2x) + c_1$, puis $y = \dfrac{x^2}{2} + \dfrac{1}{4}\cos(2x) + c_1 x + c_2$.

> **📘 Définition — Équation caractéristique**
>
> À l'équation $ay'' + by' + cy = 0$ ($a \neq 0$), on associe l'**équation caractéristique** :
>
> $$ar^2 + br + c = 0$$
>
> de discriminant $\Delta = b^2 - 4ac$.

> **💡 Pour bien comprendre — pourquoi cette équation ?**
>
> On essaie une fonction $y = e^{rx}$ : $y' = r\,e^{rx}$ et $y'' = r^2 e^{rx}$. En remplaçant : $(ar^2 + br + c)\,e^{rx} = 0$. Comme $e^{rx}$ n'est jamais nul, il faut $ar^2 + br + c = 0$. L'équation différentielle devient une simple **équation du second degré** !

> **🏛️ Théorème — Solutions de $ay'' + by' + cy = 0$** ($A$, $B$ réels quelconques)
>
> - $\Delta > 0$, deux racines réelles $r_1$ et $r_2$ : $y = A\,e^{r_1 x} + B\,e^{r_2 x}$.
> - $\Delta = 0$, une racine double $r_0 = -\dfrac{b}{2a}$ : $y = (Ax + B)\,e^{r_0 x}$.
> - $\Delta < 0$, deux racines complexes $\alpha \pm i\beta$ : $y = \big(A\cos(\beta x) + B\sin(\beta x)\big)\,e^{\alpha x}$.

> **🧭 Méthode — en 3 étapes**
>
> 1. Écris l'équation caractéristique et calcule $\Delta$.
> 2. Écris la forme générale qui correspond au signe de $\Delta$.
> 3. Utilise les **deux conditions** de l'énoncé (comme $f(0)$ et $f'(0)$) pour trouver $A$ et $B$.

> **✏️ Exemple — $\Delta > 0$**
>
> Résous $y'' + 2y' - 3y = 0$ avec $f(0) = 3$ et $f'(0) = -1$.
>
> **Solution.**
>
> - $r^2 + 2r - 3 = 0$, $\Delta = 16$ : $r_1 = -3$, $r_2 = 1$. Donc $f(x) = A\,e^{-3x} + B\,e^{x}$.
> - $f(0) = A + B = 3$ et $f'(0) = -3A + B = -1$, d'où $A = 1$ et $B = 2$.
> - $f(x) = e^{-3x} + 2e^{x}$.

> **✏️ Exemple — $\Delta = 0$**
>
> Résous $4y'' - 4y' + y = 0$ avec $g(0) = 4$ et $g'(0) = 2$.
>
> **Solution.**
>
> - $4r^2 - 4r + 1 = (2r - 1)^2 = 0$ : racine double $r_0 = \dfrac{1}{2}$. Donc $g(x) = (Ax + B)\,e^{x/2}$.
> - $g(0) = B = 4$ et $g'(0) = A + \dfrac{B}{2} = 2$, d'où $A = 0$.
> - $g(x) = 4e^{x/2}$.

> **✏️ Exemple — $\Delta < 0$**
>
> Résous $y'' + \pi^2 y = 0$, sachant que la solution $h$ est **impaire** et que $h\left(\frac{1}{2}\right) = 1$.
>
> **Solution.**
>
> - $r^2 + \pi^2 = 0$ : $r = \pm i\pi$ ($\alpha = 0$, $\beta = \pi$). Donc $h(x) = A\cos(\pi x) + B\sin(\pi x)$.
> - $h$ impaire : $h(-x) + h(x) = 2A\cos(\pi x) = 0$ pour tout $x$, donc $A = 0$.
> - $h\left(\frac{1}{2}\right) = B\sin\frac{\pi}{2} = B = 1$, d'où $h(x) = \sin(\pi x)$.

> **⚠️ Attention — une condition qui ne sert à rien**
>
> Ici, la condition $h'\left(\frac{1}{2}\right) = 1$ ne permettrait **pas** de conclure : $h'(x) = B\pi\cos(\pi x)$ et $\cos\frac{\pi}{2} = 0$. Vérifie toujours que tes conditions donnent bien une équation en $A$ ou $B$.

## 4. Les équations avec second membre

> **🏛️ Théorème — Le principe de superposition**
>
> Pour résoudre une équation **avec second membre** $(E)$ :
> 1. on trouve **une** solution particulière $g$ de $(E)$ ;
> 2. on résout l'équation **homogène** $(E_0)$ (même équation, second membre remplacé par $0$) ;
> 3. les solutions de $(E)$ sont **toutes** les fonctions $\varphi = f + g$, où $f$ est une solution de $(E_0)$.

> **💡 Pour bien comprendre — la formule « une + toutes »**
>
> Solution générale $=$ **une** solution particulière $+$ **toutes** les solutions de l'équation homogène. La solution particulière « absorbe » le second membre ; l'homogène apporte les constantes.

> **🧭 Méthode — deviner une solution particulière**
>
> On cherche une solution qui **ressemble au second membre** :
> - second membre polynôme de degré $1$ → on essaie $y = ax + b$ ;
> - second membre $e^{kx}$ → on essaie $y = m\,e^{kx}$ ;
> - second membre en $\cos x$, $\sin x$ → on essaie $y = a\cos x + b\sin x$.
>
> Puis on remplace dans l'équation et on **identifie** les coefficients.

> **✏️ Exemple — second membre affine**
>
> Résous $(E) : y' + 3y = -x + 5$.
>
> **Solution.**
>
> - On essaie $y = ax + b$ : $a + 3(ax + b) = -x + 5$, donc $3a = -1$ et $a + 3b = 5$ : $a = -\dfrac{1}{3}$, $b = \dfrac{16}{9}$. Solution particulière : $y_p = -\dfrac{1}{3}x + \dfrac{16}{9}$.
> - Équation homogène $y' + 3y = 0$ : $y = k\,e^{-3x}$.
> - Solutions de $(E)$ : $\varphi(x) = k\,e^{-3x} - \dfrac{1}{3}x + \dfrac{16}{9}$, $k \in \mathbb{R}$.

> **✏️ Exemple — second membre trigonométrique**
>
> Soit $(E) : y' - y = 2\cos x$ et $g(x) = -\cos x + \sin x$.
>
> **Solution.**
>
> - $g'(x) = \sin x + \cos x$, donc $g' - g = \sin x + \cos x + \cos x - \sin x = 2\cos x$ : $g$ est solution de $(E)$.
> - Si $\varphi$ est solution de $(E)$, alors $f = \varphi - g$ vérifie $f' - f = 2\cos x - 2\cos x = 0$ ; et réciproquement.
> - Les solutions de $y' - y = 0$ sont $f(x) = k\,e^{x}$, donc $\varphi(x) = k\,e^{x} - \cos x + \sin x$.

> **✏️ Exemple — au second ordre**
>
> Résous $(E_1) : y'' - 2y' + 5y = e^{-2x}$ avec $h(0) = 1$ et $h'(0) = 0$.
>
> **Solution.**
>
> - On essaie $g(x) = m\,e^{-2x}$ : $4m + 4m + 5m = 13m = 1$, donc $m = \dfrac{1}{13}$.
> - Homogène : $r^2 - 2r + 5 = 0$, $\Delta = -16$, $r = 1 \pm 2i$. Donc $f(x) = \big(A\cos(2x) + B\sin(2x)\big)e^{x}$.
> - $h = f + g$ : $h(0) = A + \dfrac{1}{13} = 1$ donne $A = \dfrac{12}{13}$ ; $h'(0) = A + 2B - \dfrac{2}{13} = 0$ donne $B = -\dfrac{5}{13}$.
> - $h(x) = \dfrac{1}{13}\Big(\big(12\cos(2x) - 5\sin(2x)\big)e^{x} + e^{-2x}\Big)$.

> **🎯 À retenir**
>
> - $ay' + by = 0$ : $y = \lambda\,e^{-\frac{b}{a}x}$.
> - $ay'' + by' + cy = 0$ : équation caractéristique $ar^2 + br + c = 0$, puis trois cas selon $\Delta$.
> - Ordre $1$ → une constante ; ordre $2$ → deux constantes, trouvées avec deux conditions.
> - Avec second membre : **une** solution particulière $+$ **toutes** les solutions homogènes.
