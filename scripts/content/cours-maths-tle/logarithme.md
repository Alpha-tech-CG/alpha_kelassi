# La fonction logarithme népérien

> **🎯 Dans ce chapitre, tu vas apprendre à…**
>
> - savoir d'où vient la fonction $\ln$ et ce qu'elle « fait » ;
> - utiliser ses règles de calcul (produit, quotient, puissance) ;
> - trouver où $\ln u(x)$ existe et le dériver ;
> - calculer les limites avec $\ln$ ;
> - résoudre des équations et inéquations avec des logarithmes ;
> - utiliser les logarithmes de base $a$, dont le logarithme décimal.

## 1. Une fonction née d'une dérivée

> **💡 Pour bien comprendre — la fonction qui manquait**
>
> Tu connais des fonctions dont la dérivée vaut $x^2$, $x$, $1$… Mais quelle fonction a pour dérivée $\dfrac{1}{x}$ ? Aucune de celles que tu connais ! On a donc **inventé** une nouvelle fonction exprès pour ça : c'est le logarithme népérien.

> **📘 Définition — Logarithme népérien**
>
> La fonction **logarithme népérien**, notée $\ln$, est la primitive de $x \mapsto \dfrac{1}{x}$ sur $]0 \,;\, +\infty[$ qui s'annule en $1$. Autrement dit :
>
> $$\ln 1 = 0$$
>
> $$(\ln x)' = \frac{1}{x} \quad \text{pour tout } x > 0$$

> **⚠️ Attention**
>
> $\ln x$ n'existe **que pour $x > 0$**. $\ln 0$, $\ln(-3)$… n'existent pas.

> **📘 Définition — Le nombre $e$**
>
> Le nombre $e$ est le réel tel que $\ln e = 1$. Une valeur approchée est $e \approx 2{,}718$.

## 2. Sens de variation et comparaison

> **🏛️ Théorème — Variations de $\ln$**
>
> La fonction $\ln$ est définie, continue, dérivable et **strictement croissante** sur $]0 \,;\, +\infty[$ (sa dérivée $\frac{1}{x}$ y est positive).

Comme elle est strictement croissante, elle respecte l'ordre :

> **📐 Formules — comparer deux logarithmes** (pour $a > 0$ et $b > 0$)
>
> $$\ln a = \ln b \iff a = b$$
>
> $$\ln a < \ln b \iff a < b$$
>
> En particulier : $\ln x > 0 \iff x > 1$ et $\ln x < 0 \iff 0 < x < 1$.

## 3. Les règles de calcul

> **💡 Pour bien comprendre — le grand pouvoir du logarithme**
>
> Le logarithme transforme les **multiplications en additions**. Avant les calculatrices, c'était une vraie révolution : pour multiplier deux grands nombres, on additionnait leurs logarithmes dans une table !

> **📐 Formules — à savoir par cœur** (pour $a > 0$, $b > 0$ et $n$ réel)
>
> $$\ln(ab) = \ln a + \ln b$$
>
> $$\ln\left(\frac{a}{b}\right) = \ln a - \ln b$$
>
> $$\ln\left(\frac{1}{b}\right) = -\ln b$$
>
> $$\ln\left(a^n\right) = n \ln a$$
>
> $$\ln \sqrt{a} = \frac{1}{2}\ln a$$

> **✏️ Exemple — simplifier**
>
> $A = \ln 12 - \ln 3 + \ln \frac{1}{4} = \ln\left(\frac{12}{3} \times \frac{1}{4}\right) = \ln 1 = 0$.
> $B = \ln 8 = \ln(2^3) = 3\ln 2$.

> **⚠️ Attention — les erreurs classiques**
>
> $\ln(a + b) \neq \ln a + \ln b$ ! La règle marche pour un **produit**, pas pour une somme.
> $(\ln a)^2 \neq \ln(a^2)$ : par exemple $(\ln e)^2 = 1$ mais $\ln(e^2) = 2$.

## 4. Où existe $\ln u(x)$ ?

> **🏛️ Propriété — Conditions d'existence**
>
> - $\ln u(x)$ existe $\iff u(x) > 0$ ;
> - $\ln |u(x)|$ existe $\iff u(x) \neq 0$ ;
> - $\ln \left(\dfrac{u(x)}{v(x)}\right)$ existe $\iff \dfrac{u(x)}{v(x)} > 0$ ;
> - $\ln \big(u(x)\big)^2$ existe $\iff u(x) \neq 0$.

> **🧭 Méthode — trouver l'ensemble de définition**
>
> 1. Repère **tout ce qui est « dans » un $\ln$**.
> 2. Écris que c'est **strictement positif** (et que les dénominateurs ne s'annulent pas).
> 3. Résous, puis rassemble les conditions.

> **✏️ Exemple — À toi de jouer, puis vérifie**
>
> Donne l'ensemble de définition de $f(x) = x^3 + 2x + \ln x$, $g(x) = x^2 \ln(-x)$ et $h(x) = \left(\dfrac{x+1}{x}\right)\ln(2 - x)$.
>
> **Solution.**
>
> - $f$ : il faut $x > 0$, donc $D_f = ]0 \,;\, +\infty[$.
> - $g$ : il faut $-x > 0$, soit $x < 0$, donc $D_g = ]-\infty \,;\, 0[$.
> - $h$ : il faut $x \neq 0$ et $2 - x > 0$, soit $x < 2$, donc $D_h = ]-\infty \,;\, 0[ \,\cup\, ]0 \,;\, 2[$.

## 5. Dériver un logarithme

> **📐 Formules — dérivées**
>
> $$(\ln x)' = \frac{1}{x}$$
>
> $$\big(\ln u(x)\big)' = \frac{u'(x)}{u(x)}$$
>
> $$\big(\ln |u(x)|\big)' = \frac{u'(x)}{u(x)}$$

> **💡 Pour bien comprendre**
>
> Retiens la phrase : « la dérivée de $\ln u$, c'est **la dérivée de ce qu'il y a dedans, divisée par ce qu'il y a dedans** ».

> **✏️ Exemple — À toi de jouer, puis vérifie**
>
> Dérive $f(x) = x + \ln\left(\dfrac{1-x}{1+x}\right)$ (sur $]-1 \,;\, 1[$), $g(x) = \ln|\cos x - \sin x|$ et $h(x) = \ln\left(2 + \sqrt{x^2+1}\right)$.
>
> **Solution.**
>
> - On écrit $\ln\left(\frac{1-x}{1+x}\right) = \ln(1-x) - \ln(1+x)$, d'où $f'(x) = 1 - \dfrac{1}{1-x} - \dfrac{1}{1+x} = 1 - \dfrac{2}{1-x^2} = -\dfrac{1+x^2}{1-x^2}$.
> - $g'(x) = \dfrac{-\sin x - \cos x}{\cos x - \sin x}$.
> - $u(x) = 2 + \sqrt{x^2+1}$, $u'(x) = \dfrac{x}{\sqrt{x^2+1}}$, donc $h'(x) = \dfrac{x}{\sqrt{x^2+1}\left(2 + \sqrt{x^2+1}\right)}$.

## 6. Les limites à connaître

> **💡 Pour bien comprendre — une courbe paresseuse**
>
> La courbe de $\ln$ plonge vers $-\infty$ quand $x$ s'approche de $0$ (l'axe des ordonnées est une asymptote). À droite, elle monte vers $+\infty$… mais **très lentement** : il faut aller jusqu'à $x \approx 22\,026$ pour que $\ln x$ atteigne $10$ !

> **📐 Formules — limites de base**
>
> $$\lim_{x \to 0^+} \ln x = -\infty$$
>
> $$\lim_{x \to +\infty} \ln x = +\infty$$

> **🏛️ Théorème — Croissances comparées** (pour tout $\alpha > 0$)
>
> $$\lim_{x \to +\infty} \frac{\ln x}{x} = 0$$
>
> $$\lim_{x \to 0^+} x \ln x = 0$$
>
> $$\lim_{x \to +\infty} \frac{\ln x}{x^\alpha} = 0$$
>
> $$\lim_{x \to 0^+} x^\alpha \ln x = 0$$
>
> Le logarithme est toujours **battu** par n'importe quelle puissance de $x$.

> **📐 Formules — limites « du taux »**
>
> $$\lim_{x \to 0} \frac{\ln(1+x)}{x} = 1$$
>
> $$\lim_{x \to 0} \frac{\ln(1+ax)}{x} = a \quad (a \neq 0)$$
>
> $$\lim_{x \to 1} \frac{\ln x}{x - 1} = 1$$
>
> Ce sont des nombres dérivés déguisés (dérivée de $\ln$ en $1$).

## 7. Équations et inéquations

> **🧭 Méthode — résoudre avec des logarithmes**
>
> 1. **Toujours commencer** par les conditions d'existence (ce qui est dans $\ln$ doit être $> 0$).
> 2. Utilise $\ln A = \ln B \iff A = B$, ou $\ln A = k \iff A = e^k$.
> 3. Si tu vois $\ln^2 x$ et $\ln x$, pose $X = \ln x$ et résous une équation du second degré.
> 4. Vérifie que tes solutions respectent les conditions du départ.

> **✏️ Exemple — équations**
>
> - $\ln(x+3) = 0$ : il faut $x > -3$ ; $x + 3 = 1$, donc $x = -2$. $S = \{-2\}$.
> - $\ln^2 x + \ln x = 0$ (avec $x > 0$) : $\ln x(\ln x + 1) = 0$, donc $\ln x = 0$ ou $\ln x = -1$. $S = \left\{1 \,;\, e^{-1}\right\}$.
> - $\ln^2 x + 3\ln x - 4 = 0$ : avec $X = \ln x$, $X^2 + 3X - 4 = (X-1)(X+4) = 0$, donc $\ln x = 1$ ou $\ln x = -4$. $S = \left\{e \,;\, e^{-4}\right\}$.

> **✏️ Exemple — inéquations**
>
> - $\ln(2x - e) > 1$ : il faut $2x - e > 0$, et $\ln(2x - e) > \ln e \iff 2x - e > e \iff x > e$. $S = ]e \,;\, +\infty[$.
> - $\ln(2 - 3x) \geq 0$ : $2 - 3x \geq 1 \iff x \leq \frac{1}{3}$ (et alors $2 - 3x > 0$). $S = \left]-\infty \,;\, \tfrac{1}{3}\right]$.
> - $\ln^2 x + 3\ln x - 4 \leq 0$ : $(X - 1)(X + 4) \leq 0 \iff -4 \leq X \leq 1$, donc $e^{-4} \leq x \leq e$. $S = \left[e^{-4} \,;\, e\right]$.

## 8. Étude complète de $x \mapsto \ln x$

| $x$ | $0$ | | $1$ | | $e$ | | $+\infty$ |
|---|---|---|---|---|---|---|---|
| $(\ln x)' = \frac{1}{x}$ | ‖ | $+$ | | $+$ | | $+$ | |
| $\ln x$ | $-\infty$ | ↗ | $0$ | ↗ | $1$ | ↗ | $+\infty$ |

- L'axe des ordonnées ($x = 0$) est **asymptote verticale**.
- En $+\infty$, **branche parabolique** de direction l'axe des abscisses (car $\frac{\ln x}{x} \to 0$).
- La tangente en $1$ est $y = x - 1$, et la courbe est toujours **en dessous** de cette tangente.

> **✏️ Exercice d'entraînement — un problème type bac**
>
> Soit $g(x) = x^2 - 1 + 2\ln x$ sur $]0 \,;\, +\infty[$.
> 1. Calcule les limites de $g$ en $0$ et en $+\infty$, étudie ses variations, calcule $g(1)$ et déduis-en le signe de $g$.
> 2. Soit $f(x) = \dfrac{x^2 - 1}{x} - \dfrac{2\ln x}{x}$ sur $]0 \,;\, +\infty[$. Étudie les limites de $f$, montre que $f'(x) = \dfrac{g(x)}{x^2}$, dresse son tableau de variation, étudie ses asymptotes et sa tangente au point d'abscisse $1$.
>
> **Pistes et résultats.**
> 1. $g(x) \to -\infty$ en $0$, $+\infty$ en $+\infty$ ; $g'(x) = 2x + \frac{2}{x} > 0$ : $g$ est strictement croissante ; $g(1) = 0$, donc $g < 0$ sur $]0 \,;\, 1[$ et $g > 0$ sur $]1 \,;\, +\infty[$.
> 2. $f(x) = x - \dfrac{1 + 2\ln x}{x}$. En $0^+$, $f(x) \to +\infty$ (asymptote verticale $x = 0$) ; en $+\infty$, $f(x) - x \to 0$ : la droite $y = x$ est **asymptote oblique**. $f$ décroît sur $]0 \,;\, 1]$ et croît sur $[1 \,;\, +\infty[$, avec $f(1) = 0$ ; la tangente en $1$ est horizontale : $y = 0$.
> *(Dans la version d'origine de cet exercice, l'asymptote annoncée était $y = x - 1$ : avec la fonction donnée, c'est bien $y = x$.)*

## 9. Le logarithme de base $a$

> **📘 Définition — $\log_a$**
>
> Soit $a > 0$ avec $a \neq 1$. Pour tout $x > 0$ : $$\log_a x = \frac{\ln x}{\ln a}$$
> Pour $a = e$, on retrouve $\ln$. Pour $a = 10$, c'est le **logarithme décimal**, noté $\log$ : $\log x = \dfrac{\ln x}{\ln 10}$.

> **💡 Pour bien comprendre — à quoi sert le logarithme décimal ?**
>
> $\log 10 = 1$, $\log 100 = 2$, $\log 1\,000 = 3$… Le logarithme décimal **compte les zéros** ! C'est pour cela qu'on l'utilise pour le pH en chimie ou les décibels en physique.

> **📐 Formules** (pour $x > 0$, $y > 0$, $k$ réel)
>
> $$\log_a(xy) = \log_a x + \log_a y$$
>
> $$\log_a \frac{x}{y} = \log_a x - \log_a y$$
>
> $$\log_a\left(x^k\right) = k \log_a x$$
>
> $$(\log_a x)' = \frac{1}{x \ln a}$$

> **🏛️ Théorème — Variations de $\log_a$**
>
> - si $a > 1$ : $\log_a$ est strictement **croissante** ;
> - si $0 < a < 1$ : $\log_a$ est strictement **décroissante**.

> **✏️ Exercice d'entraînement — fonction réciproque et suite**
>
> Soit $f(x) = 2\ln(1 + x)$.
> 1. Donne $D_f$, les limites aux bornes et les branches infinies ; étudie les variations de $f$.
> 2. Montre que $f$ admet une réciproque $f^{-1}$ et calcule $(f^{-1})'(4\ln 2)$.
> 3. Avec $I = [2 \,;\, 3]$ : montre que $f(I) \subset I$, que $f(x) = x$ a une unique solution $\alpha$ dans $I$ et que $|f'(x)| \leq \frac{2}{3}$ sur $I$.
> 4. Soit $u_0 = 2$ et $u_{n+1} = f(u_n)$. Montre que $|u_n - \alpha| \leq \left(\frac{2}{3}\right)^n$ et trouve le plus petit $n_0$ tel que $|u_n - \alpha| \leq 10^{-3}$ pour $n \geq n_0$.
>
> **Pistes et résultats.**
> 1. $D_f = ]-1 \,;\, +\infty[$ ; $f(x) \to -\infty$ en $-1^+$ (asymptote $x = -1$), $f(x) \to +\infty$ en $+\infty$ avec une branche parabolique de direction $(Ox)$ ; $f'(x) = \frac{2}{1+x} > 0$.
> 2. $f$ est continue et strictement croissante : c'est une bijection de $]-1 \,;\, +\infty[$ sur $\mathbb{R}$, avec $f^{-1}(x) = e^{x/2} - 1$. Comme $f(3) = 4\ln 2$ et $f'(3) = \frac{1}{2}$ : $(f^{-1})'(4\ln 2) = \frac{1}{f'(3)} = 2$.
> 3. $f(2) = 2\ln 3 \approx 2{,}20$ et $f(3) = 4\ln 2 \approx 2{,}77$ sont dans $I$ et $f$ croît, donc $f(I) \subset I$. La fonction $x \mapsto f(x) - x$ est strictement décroissante sur $I$ et change de signe : une seule solution $\alpha$. Sur $I$, $|f'(x)| = \frac{2}{1+x} \leq \frac{2}{3}$.
> 4. Par l'inégalité des accroissements finis, $|u_{n+1} - \alpha| \leq \frac{2}{3}|u_n - \alpha|$, puis par récurrence $|u_n - \alpha| \leq \left(\frac{2}{3}\right)^n|u_0 - \alpha| \leq \left(\frac{2}{3}\right)^n$. Donc $u_n \to \alpha$. Enfin $\left(\frac{2}{3}\right)^n \leq 10^{-3} \iff n \geq \frac{3\ln 10}{\ln 1{,}5} \approx 17{,}04$ : $n_0 = 18$.

> **🎯 À retenir**
>
> - $\ln x$ n'existe que pour $x > 0$ ; $\ln 1 = 0$, $\ln e = 1$.
> - $\ln(ab) = \ln a + \ln b$ et $\ln(a^n) = n\ln a$.
> - $(\ln u)' = \dfrac{u'}{u}$.
> - $\ln x \to -\infty$ en $0^+$, $\ln x \to +\infty$ en $+\infty$, mais il est battu par toutes les puissances de $x$.
> - $\log_a x = \dfrac{\ln x}{\ln a}$.
