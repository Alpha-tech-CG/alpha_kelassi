# La fonction exponentielle

> **🎯 Dans ce chapitre, tu vas apprendre à…**
>
> - reconnaître la fonction exponentielle et ses règles de calcul ;
> - dériver $e^{u(x)}$ sans te tromper ;
> - calculer les limites où apparaît $e^x$ ;
> - résoudre des équations avec des exponentielles ;
> - utiliser $a^x$ et $x^\alpha$.

## 1. D'où vient l'exponentielle ?

> **💡 Pour bien comprendre — l'histoire du « bouton retour »**
>
> Le logarithme népérien $\ln$ est comme une machine : tu lui donnes un nombre **positif** $x$, elle te rend un nombre $y = \ln x$.
> L'exponentielle, c'est **la machine qui fait le chemin inverse** : tu lui donnes $y$, elle te rend le $x$ de départ.
> Les deux machines s'annulent, comme « fermer » et « ouvrir » une porte : si tu fais l'une puis l'autre, tu reviens au point de départ.

> **📘 Définition — Fonction exponentielle**
>
> La fonction **exponentielle** est la fonction réciproque de la fonction $\ln$. On la note $\exp$ et on écrit :
>
> $$\exp(x) = e^x$$
>
> où $e \approx 2{,}718$ est le nombre tel que $\ln e = 1$.

Concrètement, pour tout réel $y$ et tout réel $x > 0$ :

$$y = \ln x \iff x = e^y$$

> **📐 Formules — les deux machines s'annulent**
>
> $$e^{\ln x} = x \quad (\text{pour } x > 0)$$
>
> $$\ln\left(e^{x}\right) = x \quad (\text{pour tout réel } x)$$

> **⚠️ Attention**
>
> $e^x$ est **toujours strictement positif** : $e^x > 0$ pour tout réel $x$. Une équation comme $e^x = -2$ n'a donc **aucune** solution.

## 2. Les règles de calcul

> **💡 Pour bien comprendre**
>
> L'exponentielle transforme les **additions en multiplications**. C'est exactement le contraire du logarithme, qui transforme les multiplications en additions. Si tu connais les règles des puissances ($2^3 \times 2^4 = 2^7$), tu connais déjà celles de l'exponentielle : $e$ se comporte comme n'importe quel nombre qu'on élève à une puissance.

> **📐 Formules — à savoir par cœur** (pour tous réels $x$ et $y$, tout entier ou réel $n$)
>
> $$e^0 = 1$$
>
> $$e^1 = e$$
>
> $$e^{x+y} = e^x \times e^y$$
>
> $$e^{x-y} = \frac{e^x}{e^y}$$
>
> $$e^{-x} = \frac{1}{e^x}$$
>
> $$\left(e^x\right)^n = e^{nx}$$

> **✏️ Exemple — simplifier une expression**
>
> Simplifions $A = \dfrac{e^{3x} \times e^{-x}}{e^{x+1}}$.
> - En haut : $e^{3x} \times e^{-x} = e^{3x + (-x)} = e^{2x}$ (on **additionne** les exposants).
> - On divise : $\dfrac{e^{2x}}{e^{x+1}} = e^{2x - (x+1)} = e^{x-1}$ (on **soustrait** les exposants).
> Donc $A = e^{x-1}$.

## 3. Sens de variation et comparaison

> **🏛️ Théorème — Variations de l'exponentielle**
>
> La fonction $x \mapsto e^x$ est définie, continue, dérivable et **strictement croissante** sur $\mathbb{R}$.

Comme elle est strictement croissante, elle « respecte l'ordre » : comparer deux exponentielles revient à comparer leurs exposants.

> **📐 Formules — comparer deux exponentielles** (pour tous réels $a$ et $b$)
>
> $$e^a = e^b \iff a = b$$
>
> $$e^a < e^b \iff a < b$$

## 4. Quand $e^{u(x)}$ existe-t-il ?

> **🏛️ Propriété — Ensemble de définition**
>
> $e^{u(x)}$ existe **dès que** $u(x)$ existe. L'exponentielle n'ajoute aucune contrainte (contrairement à $\ln$, qui exige un nombre positif).

> **✏️ Exemple — À toi de jouer, puis vérifie**
>
> Donne l'ensemble de définition de $f(x) = e^{2x^2+3x+1}$, $g(x) = e^{\frac{1}{x}}$ et $h(x) = \dfrac{e^{-x} + 2}{e^x + 1}$.
>
> **Solution.**
>
> - $2x^2 + 3x + 1$ existe pour tout réel : $D_f = \mathbb{R}$.
> - $\dfrac{1}{x}$ existe si $x \neq 0$ : $D_g = \mathbb{R}^*$.
> - Le dénominateur $e^x + 1$ est toujours $> 1$, donc jamais nul : $D_h = \mathbb{R}$.

## 5. Dériver une exponentielle

> **💡 Pour bien comprendre — la fonction « miroir »**
>
> L'exponentielle a une propriété magique : **sa dérivée, c'est elle-même**. Sa pente en un point est égale à sa hauteur en ce point. Plus la courbe monte, plus elle monte vite !

> **📐 Formules — dérivées**
>
> $$\left(e^x\right)' = e^x$$
>
> $$\left(e^{ax}\right)' = a\,e^{ax}$$
>
> $$\left(e^{u(x)}\right)' = u'(x)\,e^{u(x)}$$

> **🧭 Méthode — dériver $e^{u(x)}$ en 3 étapes**
>
> 1. Repère ce qu'il y a « dans le chapeau » : c'est $u(x)$.
> 2. Calcule $u'(x)$.
> 3. Écris $u'(x)$ **devant** l'exponentielle, sans toucher à l'exponentielle.

> **✏️ Exemple — À toi de jouer, puis vérifie**
>
> Dérive $f(x) = e^{2x^2+3x+1}$ et $g(x) = e^{\frac{1}{x}}$.
>
> **Solution.**
>
> - $u(x) = 2x^2 + 3x + 1$, $u'(x) = 4x + 3$, donc $f'(x) = (4x+3)\,e^{2x^2+3x+1}$.
> - $u(x) = \dfrac{1}{x}$, $u'(x) = -\dfrac{1}{x^2}$, donc $g'(x) = -\dfrac{1}{x^2}\,e^{\frac{1}{x}}$.

> **⚠️ Attention — l'erreur classique**
>
> $\left(e^{x^2}\right)'$ **n'est pas** $e^{x^2}$ ni $e^{2x}$ ! C'est $2x\,e^{x^2}$ : on n'oublie jamais de multiplier par $u'(x)$.

## 6. Les limites à connaître

> **💡 Pour bien comprendre — l'image de la courbe**
>
> Imagine la courbe de $e^x$ : à gauche, elle s'écrase sur l'axe des abscisses **sans jamais le toucher** (elle tend vers $0$) ; à droite, elle s'envole vers le ciel, de plus en plus vite.

> **📐 Formules — limites de base**
>
> $$\lim_{x \to -\infty} e^x = 0$$
>
> $$\lim_{x \to +\infty} e^x = +\infty$$

> **📐 Formules — limite « du taux » en 0**
>
> $$\lim_{x \to 0} \frac{e^x - 1}{x} = 1$$
>
> $$\lim_{x \to 0} \frac{e^{ax} - 1}{x} = a \quad (a \neq 0)$$
>
> C'est simplement le nombre dérivé de $e^x$ (puis de $e^{ax}$) en $0$.

> **🏛️ Théorème — Croissances comparées** (pour tout réel $\alpha > 0$)
>
> $$\lim_{x \to +\infty} \frac{e^x}{x^\alpha} = +\infty$$
>
> $$\lim_{x \to +\infty} x^\alpha e^{-x} = 0$$
>
> $$\lim_{x \to -\infty} x^\alpha e^{x} = 0$$

> **💡 Pour bien comprendre — la course**
>
> Imagine une course entre trois coureurs : le logarithme $\ln x$, la puissance $x^\alpha$ et l'exponentielle $e^x$. À l'infini, **l'exponentielle gagne toujours**, et le logarithme arrive toujours dernier. Quand deux d'entre eux s'affrontent dans une fraction, **c'est le plus rapide qui impose la limite**.

> **📐 Formule — limite d'une composée**
>
> Si $u(x) \to L$ quand $x \to x_0$, alors $e^{u(x)} \to e^{L}$. Et si $u(x) \to +\infty$, alors $e^{u(x)} \to +\infty$ ; si $u(x) \to -\infty$, alors $e^{u(x)} \to 0$.

## 7. Résoudre des équations et des systèmes

> **🧭 Méthode — trois situations**
>
> - **$e^{A} = b$ avec $b > 0$** : on applique $\ln$ des deux côtés : $A = \ln b$.
> - **$e^{A} = e^{B}$** : on compare les exposants : $A = B$.
> - **Équation avec $e^{2x}$ et $e^x$** : on pose $X = e^x$ (avec $X > 0$) et on se ramène à une équation du second degré.

> **✏️ Exemple 1 — $e^{x+2} = 3$**
>
> $3 > 0$, donc $x + 2 = \ln 3$, soit $x = \ln 3 - 2$. $S = \{\ln 3 - 2\}$.

> **✏️ Exemple 2 — $e^{x^2} = e^{x+2}$**
>
> On compare les exposants : $x^2 = x + 2$, soit $x^2 - x - 2 = 0$, donc $(x-2)(x+1) = 0$. $S = \{-1 \,;\, 2\}$.

> **✏️ Exemple 3 — $e^{2x} - 2e^x - 3 = 0$**
>
> On pose $X = e^x > 0$ ; comme $e^{2x} = (e^x)^2 = X^2$, l'équation devient $X^2 - 2X - 3 = 0$, soit $(X - 3)(X + 1) = 0$.
> $X = -1$ est impossible ($X > 0$). Il reste $e^x = 3$, d'où $x = \ln 3$. $S = \{\ln 3\}$.

> **✏️ Exemple 4 — un système**
>
> Résoudre $\begin{cases} 4e^x - 3e^y = 9 \\ 2e^x + e^y = 7 \end{cases}$.
> On pose $X = e^x > 0$ et $Y = e^y > 0$ : $\begin{cases} 4X - 3Y = 9 \\ 2X + Y = 7 \end{cases}$.
> De la 2ᵉ équation, $Y = 7 - 2X$ ; dans la 1ʳᵉ : $4X - 21 + 6X = 9$, d'où $X = 3$ et $Y = 1$.
> Donc $e^x = 3$ et $e^y = 1$ : $x = \ln 3$ et $y = 0$. $S = \{(\ln 3 \,;\, 0)\}$.

## 8. Étude complète de $x \mapsto e^x$

| $x$ | $-\infty$ | | $0$ | | $+\infty$ |
|---|---|---|---|---|---|
| $(e^x)' = e^x$ | | $+$ | | $+$ | |
| $e^x$ | $0$ | ↗ | $1$ | ↗ | $+\infty$ |

- La courbe passe par les points $(0 \,;\, 1)$ et $(1 \,;\, e)$.
- La droite $y = 0$ (l'axe des abscisses) est **asymptote horizontale** en $-\infty$.
- En $+\infty$, la courbe a une **branche parabolique** de direction l'axe des ordonnées (car $\frac{e^x}{x} \to +\infty$).
- La tangente en $0$ a pour équation $y = x + 1$, et la courbe est toujours **au-dessus** de cette tangente.
- Les courbes de $e^x$ et de $\ln x$ sont **symétriques** par rapport à la droite $y = x$.

> **✏️ Exemple — À toi de jouer**
>
> Soit $f(x) = x + 1 - e^x$ sur $\mathbb{R}$.
> 1. Calcule les limites de $f$ en $-\infty$ et en $+\infty$.
> 2. Montre que la droite $(\mathcal{D}) : y = x + 1$ est asymptote à la courbe de $f$ en $-\infty$.
>
> **Solution.**
>
> 1. En $-\infty$ : $x + 1 \to -\infty$ et $e^x \to 0$, donc $f(x) \to -\infty$. En $+\infty$ : on factorise, $f(x) = x\left(1 + \frac{1}{x} - \frac{e^x}{x}\right)$ ; or $\frac{e^x}{x} \to +\infty$, donc $f(x) \to -\infty$.
> 2. $f(x) - (x + 1) = -e^x \to 0$ quand $x \to -\infty$ : la droite $(\mathcal{D})$ est asymptote oblique en $-\infty$ (et la courbe est en dessous, car $-e^x < 0$).

## 9. L'exponentielle de base $a$

> **💡 Pour bien comprendre**
>
> Tu sais déjà calculer $2^3$. Mais que vaut $2^{0{,}7}$ ou $2^{\sqrt{2}}$ ? L'exponentielle permet de donner un sens à $a^x$ pour **n'importe quel** réel $x$, grâce à une astuce : on passe par $e$.

> **📘 Définition — $a^x$**
>
> Soit $a > 0$. Pour tout réel $x$ : $$a^x = e^{x \ln a}$$
> La fonction $x \mapsto a^x$ s'appelle l'exponentielle de base $a$ ; c'est la réciproque de $\log_a$.

> **✏️ Exemple**
>
> $3^x = e^{x \ln 3}$ ; $\left(\tfrac{1}{2}\right)^x = e^{-x \ln 2}$.

> **📐 Formules — mêmes règles que les puissances** (pour $a > 0$, $b > 0$, $x$ et $y$ réels)
>
> $$a^{x+y} = a^x a^y$$
>
> $$\frac{a^x}{a^y} = a^{x-y}$$
>
> $$\left(a^x\right)^y = a^{xy}$$
>
> $$(ab)^x = a^x b^x$$
>
> $$\left(\frac{a}{b}\right)^x = \frac{a^x}{b^x}$$
>
> $$\ln\left(a^x\right) = x \ln a$$

> **🏛️ Théorème — Variations de $x \mapsto a^x$**
>
> Sa dérivée est $\left(a^x\right)' = \ln a \times a^x$. Donc :
> - si $a > 1$ (alors $\ln a > 0$) : $x \mapsto a^x$ est **strictement croissante** ;
> - si $0 < a < 1$ (alors $\ln a < 0$) : $x \mapsto a^x$ est **strictement décroissante**.

## 10. Les fonctions puissances $x^\alpha$

> **📘 Définition — Fonction puissance**
>
> Soit $\alpha$ un réel. Pour tout $x > 0$ : $$x^\alpha = e^{\alpha \ln x}$$

> **📐 Formules** (pour $x > 0$, $\alpha$ et $\beta$ réels)
>
> $$x^{\alpha+\beta} = x^\alpha x^\beta$$
>
> $$\left(x^\alpha\right)^\beta = x^{\alpha\beta}$$
>
> $$\frac{x^\alpha}{x^\beta} = x^{\alpha-\beta}$$
>
> $$x^0 = 1$$
>
> $$\left(x^\alpha\right)' = \alpha\, x^{\alpha - 1}$$

> **🏛️ Théorème — Variations de $x \mapsto x^\alpha$ sur $]0 \,;\, +\infty[$**
>
> - si $\alpha > 0$ : strictement **croissante** ;
> - si $\alpha < 0$ : strictement **décroissante**.

## 11. Croissances comparées : le tableau final

> **🏛️ Théorème — Le plus rapide gagne** (pour tout $\alpha > 0$)
>
> $$\lim_{x \to +\infty} \frac{e^x}{x^\alpha} = +\infty$$
>
> $$\lim_{x \to +\infty} \frac{\ln x}{x^\alpha} = 0$$
>
> Classement à l'infini : $\ln x \;\ll\; x^\alpha \;\ll\; e^x$.

> **🧭 Méthode — lever une forme indéterminée**
>
> Devant « $\frac{\infty}{\infty}$ » ou « $0 \times \infty$ » avec des $e^x$, des $\ln x$ et des puissances : repère le terme le plus rapide, **factorise-le**, puis applique les croissances comparées.

> **🎯 À retenir**
>
> - $e^x > 0$, $e^0 = 1$, $e^{a+b} = e^a e^b$.
> - $(e^{u})' = u'\,e^{u}$.
> - $e^x \to 0$ en $-\infty$, $e^x \to +\infty$ en $+\infty$, et $e^x$ bat toutes les puissances.
> - $a^x = e^{x \ln a}$ et $x^\alpha = e^{\alpha \ln x}$.
