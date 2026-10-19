# Nombres complexes

> **🎯 Dans ce chapitre, tu vas apprendre à…**
>
> - calculer avec les nombres complexes (forme algébrique, conjugué, module, argument) ;
> - passer aux formes **trigonométrique** et **exponentielle** ;
> - utiliser les formules de **Moivre** et d'**Euler** ;
> - trouver les **racines** $n$-ièmes et résoudre des **équations** de degré $2$, $3$ et $4$ ;
> - traduire la **géométrie** (distances, angles, figures, transformations) en nombres complexes.

## 1. La forme algébrique

> **💡 Pour bien comprendre — un nouveau nombre**
>
> Aucun nombre réel n'a un carré négatif. Les mathématiciens ont donc **inventé** un nombre, noté $i$, tel que $i^2 = -1$. En le mélangeant aux réels, on obtient les **nombres complexes**. Et bonne nouvelle : on calcule avec eux **comme d'habitude**, en remplaçant $i^2$ par $-1$ dès qu'il apparaît.

> **📘 Définition — Nombre complexe**
>
> Un **nombre complexe** s'écrit $z = a + ib$ avec $a$ et $b$ réels : c'est sa **forme algébrique**. L'ensemble des nombres complexes est noté $\mathbb{C}$.
> - $a = \text{Re}(z)$ est la **partie réelle**, $b = \text{Im}(z)$ la **partie imaginaire** (c'est un réel !).
> - Si $b = 0$, $z$ est **réel** ; si $a = 0$, $z$ est **imaginaire pur**.
> - Exemples : $3 - i$ ; $15 + 3i$ ; $4$ (réel) ; $-9i$ (imaginaire pur).

> **🏛️ Propriété — Égalité et calculs** ($z_1 = a_1 + ib_1$, $z_2 = a_2 + ib_2$)
>
> - $z_1 = z_2 \iff a_1 = a_2$ **et** $b_1 = b_2$ ; en particulier $z = 0 \iff a = b = 0$.
> - Somme : $z_1 + z_2 = (a_1 + a_2) + i(b_1 + b_2)$.
> - Produit : $z_1 z_2 = (a_1 a_2 - b_1 b_2) + i(a_1 b_2 + a_2 b_1)$.

> **📘 Définition — Conjugué**
>
> Le **conjugué** de $z = a + ib$ est $\overline{z} = a - ib$ (on change le signe de la partie imaginaire : c'est le **reflet** de $z$ dans l'axe réel).

> **🏛️ Propriété — Règles du conjugué**
>
> - $z\,\overline{z} = a^2 + b^2$ (toujours un réel positif !).
> - $z + \overline{z} = 2\,\text{Re}(z)$ et $z - \overline{z} = 2i\,\text{Im}(z)$.
> - $z$ est réel $\iff \overline{z} = z$ ; $z$ est imaginaire pur $\iff \overline{z} = -z$.
> - $\overline{z + z'} = \overline{z} + \overline{z'}$ ; $\overline{z z'} = \overline{z}\,\overline{z'}$ ; $\overline{\left(\frac{z}{z'}\right)} = \frac{\overline{z}}{\overline{z'}}$ ; $\overline{z^n} = \overline{z}^{\,n}$ ; $\overline{\overline{z}} = z$.
> - Si $P$ est un polynôme à coefficients **réels**, $\overline{P(z)} = P(\overline{z})$.

> **🧭 Méthode — écrire un quotient sous forme algébrique**
>
> On multiplie le numérateur et le dénominateur par le **conjugué du dénominateur** : le dénominateur devient un réel.

> **✏️ Exemple**
>
> Écris $z_1 = \dfrac{-1}{2i}$ et $z_2 = \dfrac{3 - i}{4 + 3i}$ sous forme algébrique.
>
> **Solution.**
>
> - $z_1 = \dfrac{-1 \times (-2i)}{2i \times (-2i)} = \dfrac{2i}{4} = \dfrac{1}{2}i$.
> - $z_2 = \dfrac{(3 - i)(4 - 3i)}{(4 + 3i)(4 - 3i)} = \dfrac{12 - 9i - 4i + 3i^2}{16 + 9} = \dfrac{9 - 13i}{25} = \dfrac{9}{25} - \dfrac{13}{25}i$.

## 2. Le plan complexe, le module et l'argument

> **📘 Définition — Affixe**
>
> Dans un repère orthonormé direct $(O \,;\, \vec{u}, \vec{v})$, on associe à $z = a + ib$ le point $M(a \,;\, b)$ : $z$ est l'**affixe** de $M$.
> L'axe des abscisses est l'**axe réel**, l'axe des ordonnées l'**axe imaginaire**.
> Le vecteur $\overrightarrow{AB}$ a pour affixe $z_B - z_A$.

> **📘 Définition — Module**
>
> Le **module** de $z = a + ib$ est le réel positif $|z| = \sqrt{a^2 + b^2} = \sqrt{z\,\overline{z}}$.
> C'est la **distance** $OM$. Plus généralement, $AB = |z_B - z_A|$.

> **🏛️ Propriété — Règles du module**
>
> - $|z| = 0 \iff z = 0$ ; $|\overline{z}| = |z|$ ; $|\text{Re}(z)| \leq |z|$ et $|\text{Im}(z)| \leq |z|$.
> - $|z_1 z_2| = |z_1|\,|z_2|$ ; $\left|\dfrac{z_1}{z_2}\right| = \dfrac{|z_1|}{|z_2|}$ ; $|z^n| = |z|^n$.
> - **Inégalité triangulaire** : $|z_1 + z_2| \leq |z_1| + |z_2|$.

> **📘 Définition — Argument**
>
> Pour $z \neq 0$, un **argument** de $z$, noté $\arg z$, est une mesure en radians de l'angle $(\vec{u}, \overrightarrow{OM})$. Il est défini à $2\pi$ près. Si $\theta = \arg z$ et $r = |z|$ :
>
> $$\cos\theta = \frac{a}{r}$$
>
> $$\sin\theta = \frac{b}{r}$$

> **💡 Pour bien comprendre — le GPS du point**
>
> Pour retrouver $M$, on peut donner ses coordonnées $(a \,;\, b)$… ou dire « marche **tout droit sur $r$ mètres** en tournant d'un **angle $\theta$** ». C'est la même information, vue autrement : **module** = distance, **argument** = direction.

> **🏛️ Propriété — Règles de l'argument** (à $2\pi$ près)
>
> - $\arg(z_1 z_2) = \arg z_1 + \arg z_2$ ; $\arg\dfrac{z_1}{z_2} = \arg z_1 - \arg z_2$ ; $\arg(z^n) = n\arg z$.
> - $\arg\overline{z} = -\arg z$ ; $\arg(-z) = \pi + \arg z$.
> - $z$ réel strictement positif $\iff \arg z = 0$ ; réel strictement négatif $\iff \arg z = \pi$.
> - $z = ib$ avec $b > 0$ $\iff \arg z = \frac{\pi}{2}$ ; avec $b < 0$ $\iff \arg z = -\frac{\pi}{2}$.

> **💡 Pour bien comprendre — l'astuce à retenir**
>
> Quand on **multiplie** des complexes, on **multiplie les modules** et on **ajoute les arguments**. C'est comme les puissances : $10^2 \times 10^3 = 10^{2+3}$.

## 3. Formes trigonométrique et exponentielle

> **📘 Définition — Formes trigonométrique et exponentielle** ($z \neq 0$, $r = |z|$, $\theta = \arg z$)
>
> $$z = r(\cos\theta + i\sin\theta) = r\,e^{i\theta}$$
>
> On écrit aussi la **forme polaire** $z = [r \,;\, \theta]$. Le conjugué est $\overline{z} = r\,e^{-i\theta}$.

> **📐 Formules — calculer en forme exponentielle**
>
> $$r\,e^{i\theta} \times r'\,e^{i\theta'} = rr'\,e^{i(\theta + \theta')}$$
>
> $$\frac{r\,e^{i\theta}}{r'\,e^{i\theta'}} = \frac{r}{r'}\,e^{i(\theta - \theta')}$$
>
> $$\frac{1}{r\,e^{i\theta}} = \frac{1}{r}\,e^{-i\theta}$$
>
> $$\left(r\,e^{i\theta}\right)^n = r^n\,e^{in\theta}$$

> **📐 Formules — Moivre et Euler**
>
> Formule de Moivre ($n$ entier) :
>
> $$(\cos\theta + i\sin\theta)^n = \cos(n\theta) + i\sin(n\theta)$$
>
> Formules d'Euler :
>
> $$\cos\theta = \frac{e^{i\theta} + e^{-i\theta}}{2}$$
>
> $$\sin\theta = \frac{e^{i\theta} - e^{-i\theta}}{2i}$$

> **🧭 Méthode — linéariser $\cos^n\theta$ ou $\sin^n\theta$**
>
> 1. Remplace $\cos\theta$ (ou $\sin\theta$) par sa formule d'Euler.
> 2. Développe avec le **binôme de Newton** : $(a + b)^n = \displaystyle\sum_{k=0}^n \binom{n}{k}a^k b^{n-k}$.
> 3. Regroupe les termes $e^{ik\theta}$ et $e^{-ik\theta}$ deux à deux et reviens aux cosinus et sinus avec Euler.
>
> Exemple : $\cos^2\theta = \dfrac{e^{2i\theta} + 2 + e^{-2i\theta}}{4} = \dfrac{1 + \cos(2\theta)}{2}$.

> **📐 Formules — factorisation par l'angle moitié**
>
> $$e^{ia} + e^{ib} = 2\cos\left(\frac{a - b}{2}\right)e^{i\frac{a + b}{2}}$$
>
> $$e^{ia} - e^{ib} = 2i\sin\left(\frac{a - b}{2}\right)e^{i\frac{a + b}{2}}$$
>
> Astuce : on met en facteur $e^{i\frac{a+b}{2}}$, et il reste une formule d'Euler.

> **✏️ Exemple — l'angle moitié en action**
>
> Soit $z_1 = i$ et $z_2 = \dfrac{1}{2} + i\dfrac{\sqrt{3}}{2}$. Calcule $|z_1| \times |z_2|$, puis $Z = \dfrac{z_1 + z_2}{1 + z_1 z_2}$.
>
> **Solution.**
>
> - $z_1 = e^{i\pi/2}$ et $z_2 = e^{i\pi/3}$ : $|z_1| \times |z_2| = 1$.
> - Numérateur : $e^{i\pi/2} + e^{i\pi/3} = 2\cos\dfrac{\pi}{12}\,e^{i5\pi/12}$.
> - Dénominateur : $1 + e^{i5\pi/6} = e^{i0} + e^{i5\pi/6} = 2\cos\dfrac{5\pi}{12}\,e^{i5\pi/12}$.
> - $Z = \dfrac{\cos(\pi/12)}{\cos(5\pi/12)} = \dfrac{\cos(\pi/12)}{\sin(\pi/12)} = 2 + \sqrt{3}$ : c'est un **réel**, et $|Z| = 2 + \sqrt{3}$.

## 4. Les racines $n$-ièmes

> **📘 Définition — Racine $n$-ième**
>
> Une **racine $n$-ième** de $Z$ est un nombre complexe $z$ tel que $z^n = Z$.

> **🏛️ Théorème — Les $n$ racines** ($Z = r\,e^{i\theta} \neq 0$)
>
> $Z$ a exactement $n$ racines $n$-ièmes :
>
> $$z_k = \sqrt[n]{r}\;e^{i\left(\frac{\theta}{n} + \frac{2k\pi}{n}\right)}$$
>
> $$k = 0, 1, \ldots, n - 1$$
>
> - Pour $Z = 1$ : les **racines $n$-ièmes de l'unité** sont $e^{2ik\pi/n}$.
> - La somme des $n$ racines est nulle (pour $n \geq 2$).
> - Leurs images sont les sommets d'un **polygone régulier à $n$ côtés**, inscrit dans le cercle de centre $O$ et de rayon $\sqrt[n]{r}$.

> **💡 Pour bien comprendre — la part de gâteau**
>
> Le module se « racine » ($\sqrt[n]{r}$) et l'angle se **partage en $n$**. Puis on tourne de $\frac{2\pi}{n}$ pour passer d'une racine à la suivante, comme on découpe un gâteau rond en $n$ parts égales.

> **✏️ Exemple**
>
> Trouve les racines cubiques de $1$, puis celles de $u = 1 + i$.
>
> **Solution.**
>
> - $1 = e^{i0}$ : les racines sont $1$, $j = e^{2i\pi/3} = -\dfrac{1}{2} + i\dfrac{\sqrt{3}}{2}$ et $j^2 = e^{4i\pi/3} = -\dfrac{1}{2} - i\dfrac{\sqrt{3}}{2}$.
> - $1 + i = \sqrt{2}\,e^{i\pi/4}$ : module des racines $\sqrt[3]{\sqrt{2}} = 2^{1/6}$, arguments $\dfrac{\pi}{12}$, $\dfrac{3\pi}{4}$ et $\dfrac{17\pi}{12}$.

> **🧭 Méthode — racines carrées sous forme algébrique**
>
> Pour trouver $z = x + iy$ tel que $z^2 = a + ib$, on résout :
> - $x^2 - y^2 = a$ (parties réelles) ;
> - $x^2 + y^2 = |a + ib|$ (modules) ;
> - $2xy = b$ (parties imaginaires) : cette équation donne le **signe** de $xy$.
>
> Les deux premières donnent $x^2$ et $y^2$ ; la troisième dit s'il faut prendre $x$ et $y$ de même signe ou de signes contraires.

> **✏️ Exemple**
>
> Trouve les racines carrées de $u = 3 + 4i$.
>
> **Solution.**
>
> - $x^2 - y^2 = 3$ et $x^2 + y^2 = 5$, donc $x^2 = 4$ et $y^2 = 1$.
> - $2xy = 4 > 0$ : $x$ et $y$ ont le même signe. Les racines sont $2 + i$ et $-2 - i$.

## 5. Les équations

> **🏛️ Théorème — Équation $az^2 + bz + c = 0$** ($a \neq 0$, $\Delta = b^2 - 4ac$)
>
> - Si $\delta$ est une racine carrée de $\Delta$ (avec $\delta \ne 0$), les solutions sont :
>
> $$z_1 = \frac{-b - \delta}{2a}$$
>
> $$z_2 = \frac{-b + \delta}{2a}$$
>
> - Si $\Delta = 0$ : une solution double $z_0 = -\dfrac{b}{2a}$.
> - Coefficients **réels** et $\Delta < 0$ : on prend $\delta = i\sqrt{-\Delta}$, et les deux solutions sont **conjuguées**.

> **✏️ Exemple — coefficients réels**
>
> Résous $z^2 + z + 1 = 0$, $z^2 - 6z + 9 = 0$ et $z^2 - z - 2 = 0$.
>
> **Solution.**
>
> - $\Delta = -3$ : $z = \dfrac{-1 - i\sqrt{3}}{2}$ ou $z = \dfrac{-1 + i\sqrt{3}}{2}$.
> - $\Delta = 0$ : $z = 3$ (solution double).
> - $\Delta = 9$ : $z = -1$ ou $z = 2$.

> **✏️ Exemple — coefficients complexes**
>
> Résous $(E_1) : z^2 - 5iz - 6 = 0$ et $(E_2) : z^2 - (5 - 4i)z + 3(1 - 3i) = 0$.
>
> **Solution.**
>
> - $(E_1)$ : $\Delta = (5i)^2 + 24 = -1 = i^2$, donc $\delta = i$ et $z = \dfrac{5i \pm i}{2}$ : $z = 2i$ ou $z = 3i$.
> - $(E_2)$ : $\Delta = (5 - 4i)^2 - 12(1 - 3i) = -3 - 4i$. Ses racines carrées : $x^2 = 1$, $y^2 = 4$, $xy < 0$, donc $\delta = 1 - 2i$.
> - $z = \dfrac{5 - 4i \pm (1 - 2i)}{2}$ : $z = 3 - 3i$ ou $z = 2 - i$.

> **✏️ Exemple — avec $\Delta'$ (coefficient de $z$ pair)**
>
> Résous $(1 + i)z^2 + 2(2 + i)z + 4 = 0$.
>
> **Solution.**
>
> - $b = 2b'$ avec $b' = 2 + i$ : $\Delta' = b'^2 - ac = (2 + i)^2 - 4(1 + i) = -1$, donc $\delta' = i$.
> - $z = \dfrac{-b' \pm \delta'}{a}$ : $z = \dfrac{-2}{1 + i} = -1 + i$ ou $z = \dfrac{-2 - 2i}{1 + i} = -2$.

> **🧭 Méthode — équations avec $\overline{z}$ ou $|z|$**
>
> On pose $z = x + iy$ et on sépare **partie réelle** et **partie imaginaire** : on obtient un système de deux équations réelles.

> **✏️ Exemple**
>
> Résous $z + 2\overline{z} = 4 + i$ et $4z^2 + 8|z|^2 - 3 = 0$.
>
> **Solution.**
>
> - $x + iy + 2x - 2iy = 3x - iy = 4 + i$, donc $x = \dfrac{4}{3}$ et $y = -1$ : $z = \dfrac{4}{3} - i$.
> - $4(x^2 - y^2 + 2ixy) + 8(x^2 + y^2) - 3 = 0$ donne $12x^2 + 4y^2 = 3$ et $xy = 0$.
> - Si $y = 0$ : $x = \pm\dfrac{1}{2}$. Si $x = 0$ : $y = \pm\dfrac{\sqrt{3}}{2}$. Solutions : $\pm\dfrac{1}{2}$ et $\pm\dfrac{\sqrt{3}}{2}i$.

> **🧭 Méthode — équation de degré 3 avec une racine connue $z_0$**
>
> On factorise : $az^3 + bz^2 + cz + d = (z - z_0)(az^2 + \alpha z + \beta)$, puis on résout l'équation du second degré.
> Pour trouver $\alpha$ et $\beta$ : **identification** des coefficients, **division euclidienne**, ou **tableau de Horner** :
> - on recopie $a$ ;
> - $\alpha = b + a z_0$ ;
> - $\beta = c + \alpha z_0$ ;
> - vérification : $d + \beta z_0 = 0$.

> **✏️ Exemple**
>
> Soit $P(z) = z^3 - (1 + 3i)z^2 + (1 + 4i)z + 3 - 3i$. Montre que $i$ est racine et résous $P(z) = 0$.
>
> **Solution.**
>
> - $P(i) = -i + (1 + 3i) + (i - 4) + 3 - 3i = 0$. ✔
> - Horner avec $z_0 = i$ : $\alpha = -(1 + 3i) + i = -1 - 2i$ ; $\beta = 1 + 4i + (-1 - 2i)i = 3 + 3i$ ; vérification : $3 - 3i + (3 + 3i)i = 0$. ✔
> - $z^2 - (1 + 2i)z + 3 + 3i = 0$ : $\Delta = -15 - 8i$, $\delta = 1 - 4i$, donc $z = 1 - i$ ou $z = 3i$.
> - Solutions : $\{i \,;\, 1 - i \,;\, 3i\}$.

> **🧭 Méthode — équation « symétrique » de degré 4**
>
> Pour $az^4 + bz^3 + cz^2 + bz + a = 0$ (les coefficients se lisent pareil dans les deux sens) : $0$ n'est pas solution, on divise par $z^2$ et on pose $u = z + \dfrac{1}{z}$, sachant que $z^2 + \dfrac{1}{z^2} = u^2 - 2$.
> Pour $az^4 + bz^3 + cz^2 - bz + a = 0$, on pose plutôt $u = z - \dfrac{1}{z}$ (et $z^2 + \frac{1}{z^2} = u^2 + 2$).

> **✏️ Exemple**
>
> Résous $z^4 - 5z^3 + 6z^2 - 5z + 1 = 0$.
>
> **Solution.**
>
> - $0$ n'est pas solution. En divisant par $z^2$ : $\left(z^2 + \dfrac{1}{z^2}\right) - 5\left(z + \dfrac{1}{z}\right) + 6 = 0$, soit $u^2 - 5u + 4 = 0$ avec $u = z + \dfrac{1}{z}$.
> - $u = 1$ ou $u = 4$.
> - $z + \dfrac{1}{z} = 1 \iff z^2 - z + 1 = 0 \iff z = \dfrac{1 \pm i\sqrt{3}}{2}$.
> - $z + \dfrac{1}{z} = 4 \iff z^2 - 4z + 1 = 0 \iff z = 2 \pm \sqrt{3}$.

## 6. Les complexes au service de la géométrie

> **📐 Formules — distances, milieux, barycentres**
>
> - Distance : $AB = |z_B - z_A|$.
> - Milieu $I$ de $[AB]$ : $z_I = \dfrac{z_A + z_B}{2}$ ; centre de gravité $G$ de $ABC$ : $z_G = \dfrac{z_A + z_B + z_C}{3}$.
> - Barycentre des points $(A_k, \alpha_k)$ : $z_G = \dfrac{\alpha_1 z_{A_1} + \cdots + \alpha_n z_{A_n}}{\alpha_1 + \cdots + \alpha_n}$.

> **📐 Formules — angles**
>
> $$(\vec{u}, \overrightarrow{AB}) = \arg(z_B - z_A)$$
>
> $$(\overrightarrow{AB}, \overrightarrow{AC}) = \arg\frac{z_C - z_A}{z_B - z_A}$$
>
> $$(\overrightarrow{AB}, \overrightarrow{CD}) = \arg\frac{z_D - z_C}{z_B - z_A}$$

> **🏛️ Propriété — Alignement et orthogonalité**
>
> - $A$, $B$, $C$ alignés $\iff \dfrac{z_C - z_A}{z_B - z_A}$ est **réel**.
> - $(AB) \perp (CD) \iff \dfrac{z_D - z_C}{z_B - z_A}$ est **imaginaire pur** (non nul).
> - $(AB) \parallel (CD) \iff \dfrac{z_D - z_C}{z_B - z_A}$ est **réel** (non nul).

> **🏛️ Propriété — Reconnaître une figure** (avec $q = \dfrac{z_C - z_A}{z_B - z_A}$)
>
> | Le triangle $ABC$ est… | si et seulement si |
> |---|---|
> | isocèle en $A$ | $\lvert q\rvert = 1$ |
> | rectangle en $A$ | $q$ est imaginaire pur |
> | rectangle isocèle en $A$ | $q = i$ ou $q = -i$ |
> | équilatéral | $q = e^{i\pi/3}$ ou $q = e^{-i\pi/3}$ |
>
> - $ABCD$ est un **parallélogramme** $\iff z_A + z_C = z_B + z_D$ (les diagonales ont le même milieu).
> - $ABCD$ est un **carré** $\iff$ c'est un parallélogramme et $\dfrac{z_D - z_B}{z_C - z_A} = \pm i$ (diagonales perpendiculaires et de même longueur).
> - $A$, $B$, $C$, $D$ (non alignés) sont **cocycliques** $\iff \dfrac{z_C - z_A}{z_C - z_B} \times \dfrac{z_D - z_B}{z_D - z_A}$ est **réel**.

> **🏛️ Propriété — Ensembles de points** ($M$ d'affixe $z$)
>
> - $|z - z_A| = k$ ($k > 0$) : **cercle** de centre $A$ et de rayon $k$ ; en particulier $|z| = 1$ est le cercle trigonométrique.
> - $|z - z_A| = |z - z_B|$ : **médiatrice** de $[AB]$.
> - $\arg(z - z_A) = \alpha \;[\pi]$ : **droite** passant par $A$ (privée de $A$), qui fait l'angle $\alpha$ avec $\vec{u}$.
> - $\arg(z - z_A) = \alpha \;[2\pi]$ : **demi-droite** d'origine $A$ (privée de $A$), de direction $\alpha$.

> **✏️ Exemple — des ensembles de points**
>
> Détermine l'ensemble des points $M(z)$ tels que $z = 1 + 2e^{i\alpha}$ ($\alpha$ réel). Puis, avec $z_A = 2$, $z_B = -4 + i$ et $z' = \dfrac{z - z_A}{z - z_B}$, trouve l'ensemble des $M$ tels que $|z'| = 1$, puis $|z'| = 2$, puis $z'$ réel.
>
> **Solution.**
>
> - $|z - 1| = 2$ : c'est le **cercle** de centre $\Omega(1)$ et de rayon $2$.
> - $|z'| = 1 \iff MA = MB$ : la **médiatrice** de $[AB]$.
> - $|z'| = 2 \iff MA = 2MB$. Avec $z = x + iy$ : $(x - 2)^2 + y^2 = 4\big((x + 4)^2 + (y - 1)^2\big)$, ce qui donne $(x + 6)^2 + \left(y - \frac{4}{3}\right)^2 = \frac{148}{9}$ : le **cercle** de centre $\left(-6 \,;\, \frac{4}{3}\right)$ et de rayon $\frac{2\sqrt{37}}{3}$.
> - $z'$ réel $\iff$ $M = A$, ou les vecteurs $\overrightarrow{BM}$ et $\overrightarrow{AM}$ sont colinéaires : la **droite $(AB)$ privée de $B$**.

## 7. Les transformations en complexes

> **🏛️ Propriété — Translation**
>
> La translation de vecteur $\vec{w}$ d'affixe $b$ s'écrit $z' = z + b$. Avec $b = x_0 + iy_0$ : $x' = x + x_0$ et $y' = y + y_0$.

> **✏️ Exemple**
>
> - $z' = z + 4 - 3i$ est la translation de vecteur d'affixe $4 - 3i$.
> - Avec $A(2 - i)$ et $B(5 + 3i)$ : $z_{\overrightarrow{AB}} = 3 + 4i$, donc la translation de vecteur $\overrightarrow{AB}$ s'écrit $z' = z + 3 + 4i$, soit $x' = x + 3$ et $y' = y + 4$.

> **📘 Définition — Homothétie**
>
> L'**homothétie** de centre $\Omega$ et de rapport $k$ (réel non nul, $k \neq 1$) envoie $M$ sur $M'$ tel que $\overrightarrow{\Omega M'} = k\,\overrightarrow{\Omega M}$.
> En complexes : $z' - \omega = k(z - \omega)$.
> Analytiquement, avec $\Omega(x_0 \,;\, y_0)$ : $x' = kx + (1 - k)x_0$ et $y' = ky + (1 - k)y_0$.

> **🏛️ Propriété — Homothétie**
>
> - Son seul point fixe est le centre $\Omega$ ; $\Omega$, $M$ et $M'$ sont **alignés**.
> - $\overrightarrow{M'N'} = k\,\overrightarrow{MN}$ : elle multiplie les longueurs par $|k|$ et les aires par $k^2$.
> - Elle conserve les angles orientés, le parallélisme, l'orthogonalité, les milieux et les barycentres.
> - Sa réciproque est l'homothétie de centre $\Omega$ et de rapport $\frac{1}{k}$. Pour $k = -1$, c'est la symétrie centrale de centre $\Omega$.
> - Une transformation $z' = kz + b$ ($k$ réel) est une translation si $k = 1$, et une homothétie de rapport $k$ et de centre $\omega = \dfrac{b}{1 - k}$ si $k \neq 1$.

> **✏️ Exemple**
>
> - L'homothétie de centre $A(3 \,;\, -2)$ et de rapport $-5$ s'écrit $x' = -5x + 18$ et $y' = -5y - 12$.
> - $x' = 7x - 6$ et $y' = 7y + 12$ : rapport $7$, centre $\left(\dfrac{-6}{1 - 7} \,;\, \dfrac{12}{1 - 7}\right) = (1 \,;\, -2)$.

> **🧭 Méthode — trouver l'homothétie qui envoie $A$ sur $A'$ et $B$ sur $B'$**
>
> Elle existe si $\overrightarrow{A'B'} = k\,\overrightarrow{AB}$ avec $k \neq 1$. Son rapport est ce $k$, et son centre est le point d'intersection des droites $(AA')$ et $(BB')$ (si elles sont distinctes).

> **🏛️ Théorème — Composer des homothéties et des translations**
>
> - Deux homothéties de rapports $k_1$ et $k_2$ : la composée a pour rapport $k_1 k_2$. Si $k_1 k_2 = 1$, c'est une **translation** ; sinon c'est une **homothétie** de rapport $k_1 k_2$ (de même centre si les deux centres sont égaux).
> - Une homothétie $h$ (centre $A$, rapport $k \neq 1$) et une translation $t$ de vecteur $\vec{w}$ : $h \circ t$ et $t \circ h$ sont des homothéties de rapport $k$, de centres $\Omega$ tels que :
>
> $$h \circ t : \ \overrightarrow{A\Omega} = \frac{k}{1 - k}\,\vec{w}$$
>
> $$t \circ h : \ \overrightarrow{A\Omega} = \frac{1}{1 - k}\,\vec{w}$$
>
> Attention : en général, $h_1 \circ h_2 \neq h_2 \circ h_1$.

> **💡 Pour bien comprendre — composer en complexes**
>
> Chaque transformation s'écrit $z \mapsto kz + b$. En les enchaînant, on obtient encore une écriture $z \mapsto Kz + B$ avec $K = k_1 k_2$ : il suffit ensuite de regarder si $K = 1$ (translation) ou non (homothétie).

> **✏️ Exemple**
>
> Soit $ABC$ un triangle, $h$ l'homothétie de centre $B$ et de rapport $\frac{3}{2}$, $h'$ celle de centre $C$ et de rapport $\frac{2}{3}$. Montre que $g = h' \circ h$ est une translation et trouve son vecteur.
>
> **Solution.**
>
> - Le rapport de $g$ est $\frac{3}{2} \times \frac{2}{3} = 1$ : $g$ est une translation.
> - $g(B) = h'(B)$ car $h(B) = B$. Or $\overrightarrow{C\,h'(B)} = \frac{2}{3}\overrightarrow{CB}$, donc le vecteur est $\overrightarrow{B\,g(B)} = \overrightarrow{BC} + \frac{2}{3}\overrightarrow{CB} = \frac{1}{3}\overrightarrow{BC}$.

## 8. Les similitudes indirectes

> **📘 Définition — Similitude indirecte**
>
> Une transformation est une **similitude indirecte** si et seulement si son écriture complexe est $z' = a\overline{z} + b$ avec $a \neq 0$. Elle **renverse** les angles orientés (comme un miroir).
> Si $|a| \neq 1$, c'est la composée (qui commute) de l'homothétie de centre $\Omega$ et de rapport $|a|$ et de la symétrie d'axe $(\mathcal{D})$ passant par $\Omega$.

> **🏛️ Théorème — Nature de $z' = a\overline{z} + b$**
>
> - $|a| = 1$ et $a\overline{b} + b = 0$ : **symétrie axiale** ; l'axe est l'ensemble des points fixes, $z = a\overline{z} + b$.
> - $|a| = 1$ et $a\overline{b} + b \neq 0$ : **symétrie glissée**, composée de la symétrie d'axe $(\mathcal{D})$ et de la translation de vecteur d'affixe $\frac{1}{2}(a\overline{b} + b)$, parallèle à l'axe.
> - $|a| \neq 1$ : similitude indirecte de rapport $|a|$ et de centre $\omega = \dfrac{a\overline{b} + b}{1 - |a|^2}$. Son axe passe par $\Omega$ et fait l'angle $\frac{1}{2}\arg a$ avec $\vec{u}$.

> **✏️ Exemple — une symétrie axiale**
>
> Soit $f : z' = \left(\frac{1}{2} + i\frac{\sqrt{3}}{2}\right)\overline{z} + 1 - i\sqrt{3}$.
>
> **Solution.**
>
> - $a = e^{i\pi/3}$, donc $|a| = 1$. $a\overline{b} = e^{i\pi/3} \times 2e^{i\pi/3} = 2e^{2i\pi/3} = -1 + i\sqrt{3}$, donc $a\overline{b} + b = 0$ : $f$ est une **symétrie axiale**.
> - Axe : $z = a\overline{z} + b$. En posant $z = x + iy$, la partie réelle donne $\frac{x}{2} - \frac{\sqrt{3}}{2}y = 1$, soit la droite $x - \sqrt{3}\,y - 2 = 0$.

> **✏️ Exemple — une symétrie glissée**
>
> Soit $f : z' = \left(\frac{1}{2} + i\frac{\sqrt{3}}{2}\right)\overline{z} + \frac{3}{2} - \frac{3}{2}i$.
>
> **Solution.**
>
> - $|a| = 1$ et $a\overline{b} + b = \dfrac{9 - 3\sqrt{3}}{4} + i\,\dfrac{3\sqrt{3} - 3}{4} \neq 0$ : c'est une **symétrie glissée**.
> - Vecteur de la translation : affixe $\dfrac{9 - 3\sqrt{3}}{8} + i\,\dfrac{3\sqrt{3} - 3}{8}$.
> - Axe : la droite $x - \sqrt{3}\,y = \dfrac{3 + 3\sqrt{3}}{4}$, qui est bien parallèle au vecteur de la translation.

> **✏️ Exemple — une similitude indirecte**
>
> Soit $f : z' = (1 + i)\overline{z} + 2 - i$.
>
> **Solution.**
>
> - $|a| = \sqrt{2} \neq 1$ : similitude indirecte de rapport $\sqrt{2}$.
> - $a\overline{b} + b = (1 + i)(2 + i) + 2 - i = 3 + 2i$, et $1 - |a|^2 = -1$ : centre $\omega = -3 - 2i$.
> - L'axe passe par $\Omega$ et fait l'angle $\frac{1}{2} \times \frac{\pi}{4} = \frac{\pi}{8}$ avec $\vec{u}$.

> **⚠️ Attention — erreurs fréquentes**
>
> - $\text{Im}(a + ib) = b$, et non $ib$.
> - $|z_1 + z_2|$ n'est **pas** égal à $|z_1| + |z_2|$ en général (seulement « inférieur ou égal »).
> - Un argument se donne toujours « à $2\pi$ près » ; vérifie le **quadrant** avec les signes de $\cos\theta$ et $\sin\theta$.

> **🎯 À retenir**
>
> - $i^2 = -1$ ; $z\overline{z} = |z|^2$ ; quotient : multiplier par le conjugué du dénominateur.
> - $z = r\,e^{i\theta}$ : on multiplie les modules, on ajoute les arguments.
> - Racines $n$-ièmes : $\sqrt[n]{r}\,e^{i(\theta + 2k\pi)/n}$, sommets d'un polygone régulier.
> - $az^2 + bz + c = 0$ : $z = \frac{-b \pm \delta}{2a}$ avec $\delta^2 = \Delta$.
> - Géométrie : $AB = |z_B - z_A|$ et $(\overrightarrow{AB}, \overrightarrow{AC}) = \arg\frac{z_C - z_A}{z_B - z_A}$.
