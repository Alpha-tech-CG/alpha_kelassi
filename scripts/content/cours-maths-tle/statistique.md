# Statistique

> **🎯 Dans ce chapitre, tu vas apprendre à…**
>
> - résumer une série à **une variable** (moyenne, variance, écart-type) ;
> - lire une série à **deux variables** : nuage de points, lois marginales, point moyen ;
> - calculer l'**inertie** d'un nuage ;
> - tracer une **droite d'ajustement** (moindres carrés, Mayer) ;
> - juger la qualité de l'ajustement avec le **coefficient de corrélation**.

## 1. Le vocabulaire

> **📘 Définition — La statistique**
>
> La **statistique** est la science qui **collecte**, **classe**, **analyse** et **présente** des données (en médecine, en éducation, en économie…). Les **statistiques** sont les résultats qu'elle produit.
> On collecte les données par :
> - un **recensement** : on interroge **toute** la population ;
> - un **sondage** : on interroge seulement une partie, appelée **échantillon**.

## 2. Les séries à une variable

> **📘 Définition — Série statistique à une variable**
>
> Une série statistique à un caractère $X$ est l'ensemble des couples $(x_i \,;\, n_i)$ :
> - $x_i$ est une **valeur** (modalité) du caractère ;
> - $n_i$ est son **effectif** : le nombre d'individus qui ont cette valeur ;
> - l'**effectif total** est $N = n_1 + n_2 + \cdots + n_p$ ;
> - la **fréquence** de $x_i$ est $f_i = \dfrac{n_i}{N}$ (multipliée par $100$, c'est un pourcentage). La somme des fréquences vaut $1$.

> **📐 Formules — moyenne, variance, écart-type**
>
> Moyenne :
>
> $$\overline{x} = \frac{1}{N}\sum_{i=1}^{p} n_i x_i$$
>
> Variance (formule de König : « moyenne des carrés moins carré de la moyenne ») :
>
> $$V(x) = \frac{1}{N}\sum_{i=1}^{p} n_i (x_i - \overline{x})^2 = \frac{1}{N}\sum_{i=1}^{p} n_i x_i^2 - \overline{x}^2$$
>
> Écart-type :
>
> $$\sigma(x) = \sqrt{V(x)}$$

> **💡 Pour bien comprendre — la moyenne et la dispersion**
>
> La **moyenne** dit **où** se trouvent les valeurs en gros. L'**écart-type** dit si elles sont **serrées** autour de la moyenne (petit écart-type) ou **éparpillées** (grand écart-type). Deux classes peuvent avoir $10/20$ de moyenne : dans l'une tout le monde a entre $9$ et $11$, dans l'autre les notes vont de $2$ à $18$.

## 3. Les séries à deux variables

> **📘 Définition — Série double**
>
> Une **série statistique double** étudie **deux** caractères $X$ et $Y$ sur les mêmes individus. Elle se présente :
> - en **tableau linéaire** : une liste de couples $(x_i \,;\, y_i)$ ;
> - en **tableau à double entrée** : l'effectif $n_{ij}$ de chaque couple $(x_i \,;\, y_j)$.

> **📘 Définition — Nuage de points**
>
> Le **nuage de points** est l'ensemble des points $M_{ij}(x_i \,;\, y_j)$. On le représente :
> - par **points pondérés** : on écrit l'effectif $n_{ij}$ à côté de chaque point ;
> - par **taches** : chaque point est un disque d'**aire proportionnelle** à $n_{ij}$.

> **🧭 Méthode — passer d'un tableau à l'autre**
>
> - **Double entrée → linéaire** : on recopie chaque couple $(x_i \,;\, y_j)$ autant de fois que son effectif $n_{ij}$.
> - **Linéaire → double entrée** : on compte combien de fois chaque couple apparaît.

> **✏️ Exemple — double entrée vers linéaire**
>
> | $Y \backslash X$ | $0$ | $2$ | $3$ | $4$ |
> |---|---|---|---|---|
> | $1$ | $1$ | $2$ | $3$ | $0$ |
> | $3$ | $0$ | $2$ | $1$ | $1$ |
>
> **Solution.**
>
> - Effectif total : $N = 1 + 2 + 3 + 0 + 0 + 2 + 1 + 1 = 10$.
> - Tableau linéaire : $X = 0, 2, 2, 2, 2, 3, 3, 3, 3, 4$ et $Y = 1, 1, 1, 3, 3, 1, 1, 1, 3, 3$.

> **✏️ Exemple — linéaire vers double entrée**
>
> $X = 0, 2, 1, 0, 2, 3, 3, 3$ et $Y = 1, 1, 0, 1, 1, 1, 2, 1$.
>
> **Solution.**
>
> - $N = 8$. On compte : $(0 \,;\, 1)$ deux fois, $(2 \,;\, 1)$ deux fois, $(1 \,;\, 0)$ une fois, $(3 \,;\, 1)$ deux fois, $(3 \,;\, 2)$ une fois.
>
> | $Y \backslash X$ | $0$ | $1$ | $2$ | $3$ |
> |---|---|---|---|---|
> | $0$ | $0$ | $1$ | $0$ | $0$ |
> | $1$ | $2$ | $0$ | $2$ | $2$ |
> | $2$ | $0$ | $0$ | $0$ | $1$ |

> **📘 Définition — Lois marginales**
>
> La **loi marginale de $X$** est la série $(x_i \,;\, n_{i\bullet})$ où $n_{i\bullet}$ est le total de la **colonne** $x_i$ ; la loi marginale de $Y$ s'obtient avec les totaux des **lignes**. Pour un tableau linéaire, chaque valeur a l'effectif $1$.

> **✏️ Exemple**
>
> | $Y \backslash X$ | $0$ | $2$ | $3$ | $4$ |
> |---|---|---|---|---|
> | $1$ | $1$ | $2$ | $3$ | $5$ |
> | $3$ | $5$ | $2$ | $8$ | $6$ |
>
> **Solution.**
>
> - Loi de $X$ : effectifs $6, 4, 11, 11$ pour $x = 0, 2, 3, 4$.
> - Loi de $Y$ : effectifs $11$ pour $y = 1$ et $21$ pour $y = 3$. Vérification : $N = 32$ dans les deux cas. ✔

> **📘 Définition — Point moyen**
>
> Le **point moyen** du nuage est $G(\overline{x} \,;\, \overline{y})$, où $\overline{x}$ et $\overline{y}$ sont les moyennes des lois marginales. C'est le **barycentre** des points du nuage, pondérés par leurs effectifs.

## 4. L'inertie d'un nuage

> **📘 Définition — Inertie**
>
> L'**inertie** du nuage par rapport à un point $A$ est la somme des carrés des distances de $A$ aux points du nuage, pondérées par les effectifs :
>
> $$I_A = \sum_{i,j} n_{ij}\,AM_{ij}^2$$

> **🏛️ Théorème — Huygens**
>
> $$I_A = I_G + N \times AG^2$$
>
> $$I_G = N\big(V(x) + V(y)\big)$$
>
> L'inertie est donc **la plus petite** quand $A = G$ : $I_G$ est l'**inertie minimale**. Pour tout autre point $A \neq G$, $I_A > I_G$.

> **💡 Pour bien comprendre**
>
> L'inertie mesure à quel point le nuage est « étalé » autour d'un point. Le point moyen $G$ est le point **le plus central** : c'est autour de lui que le nuage est le moins étalé.

## 5. L'ajustement linéaire

> **💡 Pour bien comprendre — tracer la meilleure droite**
>
> Quand le nuage a une forme allongée, on cherche une droite qui passe **au plus près** de tous les points. Elle permet de **prévoir** : par exemple, estimer la taille d'un enfant à un âge donné.

> **📐 Formule — Covariance**
>
> $$\text{cov}(x, y) = \frac{1}{N}\sum_{i,j} n_{ij}(x_i - \overline{x})(y_j - \overline{y}) = \frac{1}{N}\sum_{i,j} n_{ij}x_i y_j - \overline{x}\,\overline{y}$$
>
> Son signe dit si $y$ a tendance à **augmenter** (cov $> 0$) ou à **diminuer** (cov $< 0$) quand $x$ augmente.

> **🏛️ Théorème — Droites de régression (méthode des moindres carrés)**
>
> Elles passent toutes les deux par le point moyen $G$.
> - Droite de régression de $y$ en $x$ : $y = ax + b$ avec
>
> $$a = \frac{\text{cov}(x, y)}{V(x)}$$
>
> $$b = \overline{y} - a\,\overline{x}$$
>
> - Droite de régression de $x$ en $y$ : $x = a'y + b'$ avec
>
> $$a' = \frac{\text{cov}(x, y)}{V(y)}$$
>
> $$b' = \overline{x} - a'\,\overline{y}$$

> **🏛️ Propriété — Méthode de Mayer**
>
> On partage le nuage (rangé selon les $x$ croissants) en deux sous-nuages de même effectif (à une unité près si $N$ est impair). On calcule leurs points moyens $G_1$ et $G_2$. La **droite de Mayer** est la droite $(G_1G_2)$.
> Elle passe par $G$, car $G$ est le barycentre de $G_1$ et $G_2$ pondérés par les effectifs des sous-nuages ; si $N$ est pair, $G$ est le milieu de $[G_1G_2]$.

> **📐 Formule — Coefficient de corrélation linéaire**
>
> $$r = \frac{\text{cov}(x, y)}{\sigma(x)\,\sigma(y)}$$
>
> On a $-1 \leq r \leq 1$ et $r^2 = a \times a'$.

> **🏛️ Propriété — Interpréter $r$**
>
> - $|r| = 1$ : les points sont **parfaitement alignés** ; les deux droites de régression sont confondues.
> - $0{,}87 \leq |r| \leq 1$ : **forte** corrélation, l'ajustement linéaire est **justifié**.
> - $|r| < 0{,}87$ : corrélation **faible**, l'ajustement n'est pas justifié.
> - $|r|$ proche de $0$ : pas de lien linéaire entre $x$ et $y$.
> - Le **signe** de $r$ est celui de la covariance : $r > 0$, les deux grandeurs varient dans le même sens.

> **✏️ Exemple — un ajustement complet**
>
> | $X$ | $59$ | $62$ | $65$ | $68$ | $71$ | $74$ | $77$ |
> |---|---|---|---|---|---|---|---|
> | $Y$ | $12$ | $43$ | $46$ | $54$ | $55$ | $60$ | $62$ |
>
> **Solution.**
>
> - Lois marginales : chaque valeur a l'effectif $1$, $N = 7$.
> - $\overline{x} = \dfrac{476}{7} = 68$ et $\overline{y} = \dfrac{332}{7} \approx 47{,}43$ : $G(68 \,;\, 47{,}43)$.
> - Écarts $x_i - \overline{x}$ : $-9, -6, -3, 0, 3, 6, 9$, donc $V(x) = \dfrac{252}{7} = 36$ et $\sigma(x) = 6$.
> - $\text{cov}(x, y) = \dfrac{1}{7}\sum (x_i - \overline{x})\,y_i = \dfrac{579}{7} \approx 82{,}71$.
> - $a = \dfrac{82{,}71}{36} \approx 2{,}30$ et $b = 47{,}43 - 2{,}30 \times 68 \approx -108{,}8$ : $y \approx 2{,}30x - 108{,}8$.
> - $V(y) \approx 249{,}67$, $\sigma(y) \approx 15{,}80$, d'où $r \approx \dfrac{82{,}71}{6 \times 15{,}80} \approx 0{,}87$ : la corrélation est **juste forte**, l'ajustement est acceptable.
> - Prévision pour $x = 80$ : $y \approx 2{,}30 \times 80 - 108{,}8 \approx 75$.

> **⚠️ Attention — corrélation n'est pas causalité**
>
> Un $r$ proche de $1$ montre que deux grandeurs varient **ensemble**, pas que l'une **cause** l'autre. Et une prévision loin des données observées est risquée.

> **🎯 À retenir**
>
> - $\overline{x} = \frac{1}{N}\sum n_i x_i$ ; $V(x) = \frac{1}{N}\sum n_i x_i^2 - \overline{x}^2$ ; $\sigma = \sqrt{V}$.
> - Point moyen $G(\overline{x} \,;\, \overline{y})$ ; $I_A = I_G + N \cdot AG^2$.
> - Régression de $y$ en $x$ : $a = \frac{\text{cov}(x, y)}{V(x)}$, et la droite passe par $G$.
> - $r = \frac{\text{cov}}{\sigma_x \sigma_y}$ ; $|r| \geq 0{,}87$ : ajustement justifié.
