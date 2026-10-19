# Intégrale d'une fonction continue

> **🎯 Dans ce chapitre, tu vas apprendre à…**
>
> - retrouver une **primitive** (faire « la dérivée à l'envers ») ;
> - calculer une **intégrale** et utiliser ses propriétés ;
> - utiliser l'**intégration par parties** et le **changement de variable** ;
> - calculer des **aires** et des **volumes** ;
> - étudier une **fonction définie par une intégrale**.

## 1. Les primitives : la dérivée à l'envers

> **💡 Pour bien comprendre — remonter le temps**
>
> Dériver, c'est passer de $F$ à $F'$. Chercher une primitive, c'est le **chemin inverse** : on connaît $f$ et on cherche la fonction $F$ dont $f$ est la dérivée. C'est comme deviner le gâteau quand on ne voit que la recette… à l'envers.

> **📘 Définition — Primitive**
>
> Soit $f$ continue sur un intervalle $I$. Une **primitive** de $f$ sur $I$ est une fonction $F$ dérivable sur $I$ telle que $F'(x) = f(x)$ pour tout $x$ de $I$.
> Exemples : $\ln x$ est une primitive de $\dfrac{1}{x}$ sur $]0 \,;\, +\infty[$ ; $-\cos x$ est une primitive de $\sin x$ sur $\mathbb{R}$.

> **🏛️ Propriété — Toutes les primitives**
>
> - Toute fonction **continue** sur un intervalle a des primitives.
> - Si $F$ est une primitive de $f$, **toutes** les primitives de $f$ sont les fonctions $F + c$ ($c$ réel).
> - Pour $x_0 \in I$ et $y_0$ réel donnés, il existe **une seule** primitive $F$ telle que $F(x_0) = y_0$.

> **💡 Pour bien comprendre — pourquoi « $+ c$ » ?**
>
> La dérivée d'une constante est nulle : $x^2$, $x^2 + 5$ et $x^2 - 7$ ont toutes la même dérivée $2x$. Une primitive n'est donc connue qu'**à une constante près**. Une condition comme $F(0) = 1$ permet de trouver cette constante.

> **📐 Formules — primitives usuelles** ($c$ est une constante)
>
> | $f(x)$ | une primitive $F(x)$ | sur |
> |---|---|---|
> | $a$ | $ax$ | $\mathbb{R}$ |
> | $x^n$ ($n \in \mathbb{N}$) | $\dfrac{x^{n+1}}{n+1}$ | $\mathbb{R}$ |
> | $x^\alpha$ ($\alpha \neq -1$) | $\dfrac{x^{\alpha+1}}{\alpha+1}$ | $]0 \,;\, +\infty[$ |
> | $\dfrac{1}{x}$ | $\ln x$ | $]0 \,;\, +\infty[$ |
> | $\dfrac{1}{\sqrt{x}}$ | $2\sqrt{x}$ | $]0 \,;\, +\infty[$ |
> | $\sqrt{x}$ | $\dfrac{2}{3}x\sqrt{x}$ | $[0 \,;\, +\infty[$ |
> | $e^x$ | $e^x$ | $\mathbb{R}$ |
> | $\sin x$ | $-\cos x$ | $\mathbb{R}$ |
> | $\cos x$ | $\sin x$ | $\mathbb{R}$ |
> | $\dfrac{1}{\cos^2 x}$ | $\tan x$ | $x \neq \frac{\pi}{2} + k\pi$ |
> | $\dfrac{1}{\sin^2 x}$ | $-\dfrac{\cos x}{\sin x}$ | $x \neq k\pi$ |
> | $\tan x$ | $-\ln\lvert\cos x\rvert$ | $x \neq \frac{\pi}{2} + k\pi$ |

> **📐 Formules — primitives des fonctions composées** ($u$ dérivable)
>
> | $f$ | une primitive | condition |
> |---|---|---|
> | $u'\,u^n$ | $\dfrac{u^{n+1}}{n+1}$ | $n \neq -1$ |
> | $\dfrac{u'}{u}$ | $\ln\lvert u\rvert$ | $u \neq 0$ |
> | $\dfrac{u'}{u^n}$ ($n \geq 2$) | $-\dfrac{1}{(n-1)\,u^{n-1}}$ | $u \neq 0$ |
> | $\dfrac{u'}{\sqrt{u}}$ | $2\sqrt{u}$ | $u > 0$ |
> | $u'\,e^u$ | $e^u$ | |
> | $u' \cos u$ | $\sin u$ | |
> | $u' \sin u$ | $-\cos u$ | |

> **🧭 Méthode — reconnaître une forme**
>
> Cherche **la fonction et sa dérivée** cachées dans l'expression. Par exemple, dans $\dfrac{2x}{x^2+1}$, le numérateur $2x$ est la dérivée du dénominateur $x^2 + 1$ : c'est la forme $\dfrac{u'}{u}$, donc une primitive est $\ln(x^2 + 1)$.

> **✏️ Exemple**
>
> Soit $f(x) = e^x - \sqrt{x}$ sur $[0 \,;\, +\infty[$. Trouve toutes ses primitives, puis celle qui vaut $1$ en $0$.
>
> **Solution.**
>
> - Les primitives : $F(x) = e^x - \dfrac{2}{3}x\sqrt{x} + c$.
> - $F(0) = 1 + c = 1$, donc $c = 0$ et $F(x) = e^x - \dfrac{2}{3}x\sqrt{x}$.

## 2. L'intégrale

> **📘 Définition — Intégrale**
>
> Soit $f$ continue sur $I$, $F$ une primitive de $f$, et $a$, $b$ dans $I$. L'**intégrale** de $f$ de $a$ à $b$ est le nombre :
>
> $$\int_a^b f(t)\,dt = \big[F(t)\big]_a^b = F(b) - F(a)$$
>
> $a$ et $b$ sont les **bornes** ; $t$ est une **variable muette** : on peut la remplacer par $x$ ou $u$ sans changer le résultat.

> **💡 Pour bien comprendre — l'aire sous la courbe**
>
> Si $f$ est **positive** et $a < b$, l'intégrale $\int_a^b f(t)\,dt$ est l'**aire** de la surface coincée entre la courbe, l'axe des abscisses et les droites $x = a$ et $x = b$. C'est la « quantité de peinture » qu'il faut pour colorier cette zone.

> **✏️ Exemple**
>
> $\displaystyle\int_1^3 (t^2 - 1)\,dt = \left[\frac{t^3}{3} - t\right]_1^3 = (9 - 3) - \left(\frac{1}{3} - 1\right) = \frac{20}{3}$.

> **🏛️ Propriété — Règles de calcul** ($f$, $g$ continues, $\alpha$ réel)
>
> - $\displaystyle\int_a^a f(t)\,dt = 0$ et $\displaystyle\int_b^a f(t)\,dt = -\int_a^b f(t)\,dt$.
> - **Relation de Chasles** : $\displaystyle\int_a^c f(t)\,dt = \int_a^b f(t)\,dt + \int_b^c f(t)\,dt$.
> - **Linéarité** : $\displaystyle\int_a^b \big(\alpha f(t) + g(t)\big)\,dt = \alpha\int_a^b f(t)\,dt + \int_a^b g(t)\,dt$.

> **🏛️ Propriété — Intégrales et inégalités** ($a \leq b$)
>
> - Si $f \geq 0$ sur $[a \,;\, b]$, alors $\displaystyle\int_a^b f(t)\,dt \geq 0$.
> - Si $f \leq g$ sur $[a \,;\, b]$, alors $\displaystyle\int_a^b f(t)\,dt \leq \int_a^b g(t)\,dt$.

> **🏛️ Propriété — Symétries et périodicité**
>
> - $f$ **paire** : $\displaystyle\int_{-a}^a f(t)\,dt = 2\int_0^a f(t)\,dt$.
> - $f$ **impaire** : $\displaystyle\int_{-a}^a f(t)\,dt = 0$ (les deux moitiés se compensent).
> - $f$ **périodique** de période $p$ : $\displaystyle\int_a^{a+p} f(t)\,dt = \int_0^p f(t)\,dt$.

> **🏛️ Théorème — Inégalité de la moyenne** ($a \leq b$)
>
> - Si $m \leq f(x) \leq M$ sur $[a \,;\, b]$, alors $m(b - a) \leq \displaystyle\int_a^b f(t)\,dt \leq M(b - a)$.
> - Si $|f(x)| \leq M$ sur $[a \,;\, b]$, alors $\left|\displaystyle\int_a^b f(t)\,dt\right| \leq M(b - a)$.

> **📘 Définition — Valeur moyenne**
>
> La **valeur moyenne** de $f$ sur $[a \,;\, b]$ ($a \neq b$) est :
>
> $$\mu = \frac{1}{b - a}\int_a^b f(t)\,dt$$
>
> C'est la hauteur du rectangle qui aurait **la même aire** que la surface sous la courbe.

## 3. Les techniques de calcul

### a) Avec les primitives usuelles

> **✏️ Exemple — reconnaître les formes**
>
> Calcule $I = \displaystyle\int_0^{\pi/2} \sin(2t)\,e^{\cos^2 t}\,dt$, $J = \displaystyle\int_2^3 \frac{2t}{t^2 - 1}\,dt$ et $K = \displaystyle\int_e^{e^3} \frac{dt}{t(\ln t)^2}$.
>
> **Solution.**
>
> - $(\cos^2 t)' = -2\sin t\cos t = -\sin(2t)$ : forme $-u'e^u$. Donc $I = \big[-e^{\cos^2 t}\big]_0^{\pi/2} = -1 + e$.
> - Forme $\dfrac{u'}{u}$ avec $u = t^2 - 1 > 0$ sur $[2 \,;\, 3]$ : $J = \big[\ln(t^2 - 1)\big]_2^3 = \ln 8 - \ln 3 = \ln\dfrac{8}{3}$.
> - Forme $\dfrac{u'}{u^2}$ avec $u = \ln t$ : $K = \left[-\dfrac{1}{\ln t}\right]_e^{e^3} = -\dfrac{1}{3} + 1 = \dfrac{2}{3}$.

> **⚠️ Attention — la fonction doit être continue entre les bornes**
>
> On ne peut pas écrire $\displaystyle\int_0^2 \frac{2t}{t^2 - 1}\,dt$ : la fonction n'existe pas en $t = 1$, qui est **entre** $0$ et $2$. Vérifie toujours que $f$ est continue sur tout l'intervalle $[a \,;\, b]$.

### b) L'intégration par parties

> **📐 Formule — Intégration par parties** ($u$, $v$ dérivables, $u'$ et $v'$ continues)
>
> $$\int_a^b u(t)\,v'(t)\,dt = \big[u(t)\,v(t)\big]_a^b - \int_a^b u'(t)\,v(t)\,dt$$

> **💡 Pour bien comprendre — l'échange de rôles**
>
> On a un produit difficile à intégrer. On choisit un facteur qui devient **plus simple quand on le dérive** (comme $t$ ou $\ln t$) et un facteur **facile à intégrer** (comme $e^t$). La formule échange les rôles, et l'intégrale qui reste est plus facile.

> **🧭 Méthode — que choisir pour $u$ (à dériver) ?**
>
> Dans l'ordre de priorité : $\ln$ en premier, puis les polynômes, puis $e^t$, $\sin$, $\cos$ (qu'on garde plutôt pour $v'$).

> **✏️ Exemple**
>
> Calcule $I = \displaystyle\int_1^e \ln t\,dt$ et $J = \displaystyle\int_0^1 t\,e^t\,dt$.
>
> **Solution.**
>
> - Pour $I$ : $u = \ln t$, $v' = 1$, donc $u' = \dfrac{1}{t}$, $v = t$. $I = \big[t\ln t\big]_1^e - \displaystyle\int_1^e 1\,dt = e - (e - 1) = 1$.
> - Pour $J$ : $u = t$, $v' = e^t$, donc $u' = 1$, $v = e^t$. $J = \big[t\,e^t\big]_0^1 - \displaystyle\int_0^1 e^t\,dt = e - (e - 1) = 1$.

### c) Le changement de variable affine

> **📐 Formule — Changement de variable $u = \alpha t + \beta$** ($\alpha \neq 0$)
>
> $$\int_a^b f(\alpha t + \beta)\,dt = \frac{1}{\alpha}\int_{\alpha a + \beta}^{\alpha b + \beta} f(u)\,du$$
>
> On remplace **trois choses** : l'expression ($u = \alpha t + \beta$), le $dt$ ($dt = \frac{1}{\alpha}du$) et les **bornes**.

> **✏️ Exemple**
>
> Calcule $I = \displaystyle\int_{-1}^0 \frac{t}{\sqrt{2t + 3}}\,dt$.
>
> **Solution.**
>
> - On pose $u = 2t + 3$ : $t = \dfrac{u - 3}{2}$ et $dt = \dfrac{du}{2}$. Les bornes : $t = -1 \to u = 1$ ; $t = 0 \to u = 3$.
> - $I = \dfrac{1}{4}\displaystyle\int_1^3 \left(\sqrt{u} - \frac{3}{\sqrt{u}}\right)du = \dfrac{1}{4}\left[\frac{2}{3}u\sqrt{u} - 6\sqrt{u}\right]_1^3$.
> - $I = \dfrac{1}{4}\left(2\sqrt{3} - 6\sqrt{3} - \dfrac{2}{3} + 6\right) = \dfrac{4}{3} - \sqrt{3}$.

## 4. Calculer des aires

> **📘 Définition — Unité d'aire**
>
> Dans un repère orthogonal $(O \,;\, \vec{i}, \vec{j})$, l'**unité d'aire** (u.a.) est l'aire du rectangle construit sur $\vec{i}$ et $\vec{j}$ : $1 \text{ u.a.} = \|\vec{i}\| \times \|\vec{j}\|$.
> Par exemple, avec $2$ cm sur chaque axe : $1 \text{ u.a.} = 4 \text{ cm}^2$.

> **🏛️ Théorème — Aire entre deux courbes**
>
> Si $g(x) \leq f(x)$ sur $[a \,;\, b]$, l'aire du domaine compris entre les deux courbes et les droites $x = a$ et $x = b$ est :
>
> $$\mathcal{A} = \int_a^b \big(f(x) - g(x)\big)\,dx \text{ u.a.}$$
>
> **Cas particulier** : si $f \leq 0$ sur $[a \,;\, b]$, l'aire entre la courbe et l'axe des abscisses est $\mathcal{A} = -\displaystyle\int_a^b f(x)\,dx$ u.a.

> **💡 Pour bien comprendre — « celle du haut moins celle du bas »**
>
> Pour une aire entre deux courbes, on fait toujours **la courbe du haut moins la courbe du bas** : ainsi le résultat est positif, comme toute aire.

> **✏️ Exemple — une aire avec l'exponentielle**
>
> Soit $f(x) = (1 - x)e^{-x}$ (unité : $2$ cm). Étudie $f$, puis calcule l'aire $\mathcal{A}$ entre la courbe, l'axe $(Ox)$ et les droites $x = 0$ et $x = 1$.
>
> **Solution.**
>
> - Limites : $\displaystyle\lim_{x \to -\infty} f(x) = +\infty$ ; $\displaystyle\lim_{x \to +\infty} f(x) = 0$ (asymptote $y = 0$).
> - $f'(x) = -e^{-x} - (1 - x)e^{-x} = (x - 2)e^{-x}$ : $f$ décroît sur $]-\infty \,;\, 2]$ et croît sur $[2 \,;\, +\infty[$ ; minimum $f(2) = -e^{-2}$.
> - Sur $[0 \,;\, 1]$, $f \geq 0$. Comme $(x\,e^{-x})' = (1 - x)e^{-x}$, on a $\displaystyle\int_0^1 f(x)\,dx = \big[x\,e^{-x}\big]_0^1 = e^{-1}$.
> - $\mathcal{A} = \dfrac{1}{e}$ u.a. $= \dfrac{4}{e}$ cm² $\approx 1{,}47$ cm².

> **✏️ Exemple — une aire avec le logarithme**
>
> Soit $f(x) = 1 - \ln x$ (unité : $1$ cm). Calcule l'aire entre la courbe, l'axe $(Ox)$ et les droites $x = 1$ et $x = 2$.
>
> **Solution.**
>
> - Sur $[1 \,;\, 2]$, $\ln x \leq \ln 2 < 1$, donc $f \geq 0$.
> - Une primitive de $\ln x$ est $x\ln x - x$ (voir l'intégration par parties). Donc $\displaystyle\int_1^2 (1 - \ln x)\,dx = 1 - \big[x\ln x - x\big]_1^2 = 1 - (2\ln 2 - 1) = 2 - 2\ln 2$.
> - $\mathcal{A} = 2 - 2\ln 2 \approx 0{,}61$ cm².

## 5. Calculer des volumes

> **🏛️ Théorème — Volume par tranches**
>
> Si un solide est compris entre les plans $z = a$ et $z = b$, et si l'aire de sa tranche à la hauteur $z$ est $S(z)$ (fonction continue), alors son volume est :
>
> $$V = \int_a^b S(z)\,dz \text{ unités de volume}$$
>
> **Solide de révolution** : en faisant tourner la courbe de $f$ autour de l'axe $(Ox)$ entre $a$ et $b$, chaque tranche est un disque de rayon $|f(x)|$ et :
>
> $$V = \pi\int_a^b \big(f(x)\big)^2\,dx$$

> **💡 Pour bien comprendre — le saucisson**
>
> On coupe le solide en **tranches très fines**, comme un saucisson. Chaque tranche a un volume « aire × épaisseur ». L'intégrale additionne toutes les tranches.

> **✏️ Exemple — un problème complet**
>
> Soit $f(x) = x\,e^{-x+2}$ sur $[0 \,;\, +\infty[$ (unité : $2$ cm) et $I_n = \displaystyle\int_0^3 x^n e^{-2x}\,dx$.
>
> **Solution.**
>
> - $f(0) = 0$ et $f(x) \to 0$ en $+\infty$ : asymptote horizontale $y = 0$.
> - $f'(x) = (1 - x)e^{-x+2}$ : $f$ croît sur $[0 \,;\, 1]$, décroît ensuite ; maximum $f(1) = e$.
> - $I_0 = \left[-\dfrac{1}{2}e^{-2x}\right]_0^3 = \dfrac{1}{2} - \dfrac{1}{2}e^{-6}$.
> - Par parties ($u = e^{-2x}$, $v' = x^n$) : $I_n = \dfrac{3^{n+1}e^{-6}}{n+1} + \dfrac{2}{n+1}I_{n+1}$, d'où $(n+1)I_n - 2I_{n+1} = 3^{n+1}e^{-6}$.
> - Avec $n = 0$ puis $n = 1$ : $I_1 = \dfrac{1}{4} - \dfrac{7}{4}e^{-6}$ et $I_2 = \dfrac{1}{4} - \dfrac{25}{4}e^{-6}$.
> - Volume de révolution : $V = \pi\displaystyle\int_0^3 x^2 e^{-2x+4}\,dx = \pi e^4 I_2$ u.v.
> - $1$ u.v. $= 2^3 = 8$ cm³, donc $V = 2\pi\left(e^4 - 25e^{-2}\right) \approx 322$ cm³.

## 6. Les fonctions définies par une intégrale

> **📘 Définition — Fonction intégrale**
>
> Si $f$ est continue sur un intervalle $I$ contenant $a$, on définit sur $I$ :
>
> $$F(x) = \int_a^x f(t)\,dt$$
>
> Attention aux deux variables : $x$ est la variable de $F$, $t$ est la variable (muette) d'intégration.

> **🏛️ Théorème — Dérivée d'une fonction intégrale**
>
> $F$ est **la primitive de $f$ qui s'annule en $a$** : pour tout $x$ de $I$,
>
> $$F'(x) = f(x)$$
>
> $$F(a) = 0$$
>
> Donc le **signe de $f$** donne directement le **sens de variation** de $F$.

> **💡 Pour bien comprendre — un compteur**
>
> $F(x)$ est comme un **compteur** qui additionne l'aire sous la courbe depuis $a$ jusqu'à $x$. Si $f$ est positive, le compteur monte ; si $f$ est négative, il descend.

> **✏️ Exemple**
>
> Soit $F(x) = \displaystyle\int_1^x \frac{e^t}{t}\,dt$ sur $]0 \,;\, +\infty[$.
>
> **Solution.**
>
> - $t \mapsto \dfrac{e^t}{t}$ est continue sur $]0 \,;\, +\infty[$, qui contient $1$ : $F$ y est définie.
> - $F'(x) = \dfrac{e^x}{x} > 0$ : $F$ est **strictement croissante**, et $F(1) = 0$.
> - Soit $h(x) = F(x) - \ln x = \displaystyle\int_1^x \frac{e^t - 1}{t}\,dt$. Comme $\dfrac{e^t - 1}{t} > 0$, $h$ est croissante avec $h(1) = 0$ : $h < 0$ sur $]0 \,;\, 1[$ et $h > 0$ sur $]1 \,;\, +\infty[$.
> - Donc $F(x) < \ln x$ près de $0$, d'où $F(x) \to -\infty$ en $0^+$ (asymptote verticale $x = 0$) ; et $F(x) > \ln x$ pour $x > 1$, d'où $F(x) \to +\infty$ en $+\infty$.

> **✏️ Exemple — une fonction bornée**
>
> Soit $F(x) = \displaystyle\int_0^x \frac{dt}{\sqrt{1 + t^4}}$.
>
> **Solution.**
>
> - La fonction intégrée est continue sur $\mathbb{R}$ : $F$ est définie sur $\mathbb{R}$, $F(0) = 0$, et $F$ est **impaire** car la fonction intégrée est paire.
> - $F'(x) = \dfrac{1}{\sqrt{1 + x^4}} > 0$ : $F$ est strictement croissante.
> - Sur $[0 \,;\, 1]$, $\dfrac{1}{\sqrt{1 + t^4}} \leq 1$, donc $F(1) \leq 1$. Pour $t \geq 1$, $\dfrac{1}{\sqrt{1 + t^4}} \leq \dfrac{1}{t^2}$, donc $\displaystyle\int_1^x \frac{dt}{\sqrt{1+t^4}} \leq 1 - \frac{1}{x}$.
> - Ainsi $F(x) \leq 2 - \dfrac{1}{x} < 2$ pour $x \geq 1$ : $F$ est croissante et majorée, elle a une limite finie $\ell \leq 2$ en $+\infty$ (asymptote horizontale $y = \ell$).
> - Tangente en $0$ : $F'(0) = 1$, donc $(T) : y = x$. Pour $x > 0$, $F(x) - x = \displaystyle\int_0^x \left(\frac{1}{\sqrt{1+t^4}} - 1\right)dt < 0$ : la courbe est **sous** $(T)$ ; pour $x < 0$ elle est au-dessus (imparité).

> **🎯 À retenir**
>
> - Primitive = dérivée à l'envers, connue à une constante près.
> - $\int_a^b f(t)\,dt = F(b) - F(a)$ ; pour $f \geq 0$, c'est une aire.
> - Par parties : $\int u v' = [uv] - \int u' v$.
> - Aire entre deux courbes : $\int_a^b (\text{haut} - \text{bas})$, en u.a., puis conversion en cm².
> - $F(x) = \int_a^x f(t)\,dt$ a pour dérivée $f$ et s'annule en $a$.
