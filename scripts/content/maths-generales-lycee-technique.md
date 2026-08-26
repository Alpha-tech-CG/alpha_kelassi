##### a. Dérivabilité en un point $x_{0}$

##### b. Dérivabilité à gauche et à droite en $x_{0}$

2.3. Fonction dérivée

##### a. Définition

##### b. Dérivées des fonctions usuelles et opérations

##### c. Sens de variation

##### d. Extremum

### II. Compléments sur les fonctions numériques

#### 1. Dérivée et monotonie

#### 2. Fonction continue et strictement monotone

#### 3. Dérivée d’une bijection réciproque

#### 4. Théorèmes utiles

a.Théorème des valeurs intermédiaires
b.Théorème de Rolle
c.Théorème des accroissements finis (TAF)
d.Théorème des inégalités des accroissements finis (TIAF)

#### 5. Recherche des points remarquables

##### a. Point d’inflexion

##### b. Point d’intercession avec les axes

#### 6. Courbes des fonctions associées

## CHAPITRE I : RAPPELS ET COMPLEMENTS SUR

LES FONCTIONS NUMERIQUES

### I. RAPPES

#### 1. Limites

##### a. Définition et notation

a et l sont des nombres réels, f une fonction d’ensemble de définition Df.
On dit que f admet une limite à gauche en a égal à l, lorsque la
restriction g de f à D$f \cap$ ] $- \infty$ ; a[ admet en a une limite égale à l.
On note : lim f(x) = lim g(x)= l

$x \to a x \to a$

On dit que f admet une limite à droite en a égal à l lorsque la
restriction g de f à D$f \cap$ ]a ;+$\infty$[ admet en a une limite égale à l.
On note : lim f(x)=lim g(x)= l

$x \to a x \to a$

##### b. Formes indéterminées

Lorsque les tableaux sur les opérations des limites ne permettent pas de
déterminer la limite d’une somme, d’un produit ou d’un quotient de deux
fonctions, connaissant leurs limites respectives, on dit qu’il y a une forme
indéterminée.
On relève quatre (4) types de formes indéterminées à savoir $: \infty - \infty$ ; 0 x

$\frac{0}{0} \infty$

$\infty$ ; ;$\infty$

Exemples
Calculer les limites suivantes :

1/ lim $\frac{2 x^{3} - 7 x^{2} + 6 x - 1}{x^{3} - 1}$ 2/ lim [x $- \sqrt{x^{2} +}$ x + 1]

$x \to 1 x \to + \infty$

### Solution

Calculons les limites
- 1. lim $\frac{2 x^{3} - 7 x^{2} + 6 x - 1}{x^{3} - 1} = \frac{2 ( - 1^{3} ) - 7 ( 1^{2} ) + 6 ( 1 ) - 1}{( 1^{3} ) - 1} = \frac{0}{0}$ F.I

$x \to$1

Levons l’indéterminée

lim $\frac{2 x^{3} - 7 x^{2} + 6 x - 1}{x^{3} - 1}$ =lim $\frac{2 x^{2} - 5 x + 1}{x^{2} + x + 1} = \frac{2 ( 1^{2} ) - 5 ( 1 ) + 1}{( 1^{2} ) + 1 + 1} = \frac{- 2}{3}$

$x \to 1 x \to$1

- 2. lim [ x $- \sqrt{x^{2}}$ + x + 1$] = +\infty - \infty F.I$

x$\to + \infty$

Levons l’indéterminée

($x - \sqrt{x^{2} + x + 1 )} ( x + \sqrt{x^{2} + x + 1 )} \frac{x^{2} - x^{2} - x - 1}{( x + \sqrt{x^{2} + x + 1 )}} \frac{- x - 1}{( x + \sqrt{x^{2} + x + 1 )}}$

lim (x$+ \sqrt{x^{2} + x + 1 )}$ = lim = lim

$x \to + \infty x \to + \infty x \to + \infty$

=

lim $\frac{-}{( x + \sqrt{\;} \frac{x ( 1 + 1 x )}{x^{2} ( 1 + 1 x + \frac{1}{x 2}_{)}}}$ or lim $\frac{1}{x}$ = 0 donc lim $\frac{- x}{x + \sqrt{x^{2}}}$ = lim $\frac{- x}{x + | x |}$ =

$x \to + \infty x \to + \infty x \to + \infty x \to + \infty$

lim $\frac{- x}{2 x} = \frac{- 1}{2}$

$x \to + \infty$

##### c. Quelques théorèmes sur les limites

Théorème des gendarmes
Soient f, g et h trois (3) fonctions numériques, si f(x$) \leq g$(x$) \leq g$(x)
avec lim f(x) = lim ℎ(x) = l alors lim g(x) = l

$x \to + x_{0} x \to + x_{0} x \to + x_{0}$

Conséquence
Si pour tout x, |f(x) - 1| $\leq g$(x) avec l $\in \mathbb{R}$, et si lim g(x) = 0 alors lim f(x)

$x \to + x_{0} x \to + x_{0}$

= l.
NB : ces résultats restent valables quand x tend vers $\infty$.

Cas particuliers de limites de fonctions composées

Si lim f(x) = l, alors $lim \sqrt{f}$(x) = $\sqrt{l}$

$x \to + a x \to + a$

Si lim f(x) = +$\infty$, alors $lim \sqrt{f}$(x) = +$\infty$

$x \to + a x \to + a$

Si lim f(x) = l’, alors lim |f(x)| = l’

$x \to + a x \to + a$

Si lim f(x) = +$\infty$, alors lim |f(x)| = +$\infty$

$x \to + 0 x \to + \infty$

Si lim f(x) = -$\infty$, alors lim |f(x)| = +$\infty$

$x \to + 0 x \to + \infty$

##### d. Limites et Branches infinies

Soit ( ∁), la courbe représentant les variations de f dans un repère (o, i⃗ , j⃗ )
On dit qu’une droite (D) : x = a($a \in \mathbb{R}$) est asymptote verticale
à( ∁) si lim f(x) = +$\infty$

$x \to + a$

On dit qu’une droite (D) : y = b ($b \in \mathbb{R}$) est asymptote
horizontaleà ( ∁) si lim f(x) = b

x$\to + \infty$

On dit qu’une droite (D) : y = ax + b est asymptote oblique à ( ∁)
$si en \infty$ si lim[ f(x) - y] = b

$x \to \infty$

Principe
Soit f(x) = ax + b + q(x), si lim q(x) =0, alors la droite (D) : y = ax + b

$x \to + \infty$

est asymptote oblique à (∁) $en \infty .$
Remarques
$R_{1}$ : Pour étudier la position de (∁) par rapport à (D) : y = ax + b, on
étudie le signe de f(x) - y = 0
Si f(x) - y > 0, alors (∁) est au-dessus de (D)
Si f(x) - y < 0, alors (∁) est en dessous de (D)

$R_{2}$ :

Si lim [ f(x) - y] =$0^{+}$ , alors (∁) est au-dessus de (D)

x$\to \infty$

Si lim [ f(x) - y] =$0^{-}$ , alors (∁) est en dessous de (D)

$x \to \infty$

$R_{3}$ :

Si lim f(x) =$\infty ,$ on examine lim $\frac{f ( x )}{x}$

$x \to \infty x \to \infty$

Si lim $\frac{f ( x )}{x} = \infty ,$ alors (∁) admet une branche parabolique de

$x \to \infty$

direction (oy)
Si lim $\frac{f ( x )}{x}$ = 0, alors (∁) admet une branche parabolique de

$x \to \infty$

direction (ox)

lim $\frac{f ( x )}{x}$ = a (a $\neq$ 0)

$x \to \infty$

$et$

Si $\infty$, alors (∁) admet une brancℎe parabolique
de direction la droite d’équation y = ax
lim [ f(x) - ax] =
$x \to \infty$ 0, alors la doite d’équation y = ax est direction
{ { asymptotique à (C) en $\infty$

lim $\frac{f ( x )}{x}$ = a (a $\neq$ 0)

Si ${^{x\to \infty}}$ alors la droite d’équation (D) : y = ax + best
lim [f(x) - ax] = b ($b \neq$ 0)

$x \to \infty$

asymptote oblique à (∁) en $\infty$
Exemple :

On donne f(x) = $\frac{3 x - 6}{x^{2} - x - 2}$

1/ Déterminer l’ensemble de définition de $f$
2/ Calculer les limites aux bornes de l’ensemble de définition
3/ En déduire les asymptotes à la courbe représentant les variations de f.

### Solution

f(x) = $\frac{3 x - 6}{x^{2} - x - 2}$

1/ Ensemble de définition

Ef = ]-$\infty$ ;-1[$\cup$]-1 ;2[$\cup$]2 $;+\infty [$

2/ Calculs des limites aux bornes de $E f$

lim f(x)= lim $\frac{3 x}{x^{2}}$ = lim $\frac{3}{x}$ = 0

$x \to - \infty x \to - \infty x \to - \infty$

lim f(x) = + $\infty$ ; lim f(x) = - $\infty$ ; lim f(x) = - $\infty$ ; lim f(x) = + $\infty$

$x \to - 1^{-} x \to - 1^{+} x \to 2^{-} x \to 2^{+}$

lim f(x)= lim $\frac{3 x}{x^{2}}$ = lim $\frac{3}{x}$ = 0*

$x \to + \infty x \to + \infty x \to + \infty$

3/ Déduction des asymptotes à la courbe de f
lim f(x) = 0 et lim f(x) = 0, alors la droite d’équation y=0 est asymptote

$x \to - \infty x \to + \infty$

horizontale à (∁)
lim f(x) = + $\infty$ et lim f(x) = $- \infty$ , alors la droite d’équation x = - 1 est

$x \to - 1^{-} x \to - 1^{+}$

asymptote verticale à (∁)
lim f(x) = $- \infty$ et lim f(x) = + $\infty$, alors la droite d’équation x = 2 est asymptote

$x \to 2^{-} x \to 2^{+}$

verticale à ( ∁)

#### 2. Continuité et Dérivabilité

##### a. Continuité

#### 1. Définition

Une fonction est continue sur un intervalle lorsque sa courbe se trace
d’un trait.

#### 2. Continuité en un point x $= x_{0}$

Une fonction f est continue sur un point $x_{0} \in E$f si et seulement si

f$( x_{0}$ ) existe

{ lim f(x) = f$( x_{0}$ )

$x \to x_{0}$

#### 3. Continuité à gauche et à droite en x $= x_{0}$

fest continue à gauche en x=$x_{0} , x_{0} \in E$f si et seulement si

f$( x_{0}$ ) existe

{ lim f(x) = f$( x_{0}$ )

$x \to x_{0} -$

f est continue à droite en x=$x_{0} , x_{0} \in E_{f}$ si et seulement si

f$( x_{0}$ ) existe

{ lim f(x) = f$( x_{0}$ )

$x \to x_{0}$ +

#### 4. Continuité sur un intervalle

Soit fune fonction définie sur un intervalle I de $\mathbb{R} ,$ fest continue sur I
si et seulement si f est continue en tout point de I.
Remarque :
Une fonction non continue en $x_{0}$ est discontinue.

#### 5. Prolongement par continuité

Soit f une fonction définie et continue sur un intervalle D tel que :
D = ]$\infty$ ; a[ $\cup$ ]a ; $\beta$[, non définie en a et telle que : limf(x)=limf(x)= l

x$\to$a x$\to$a

On appelle prolongement de f par continuité, la fonction g définie sur
l’intervalle ]∝ ; $β$[par $\forall$ x$\in D$, g(x) = f(x) et g(a) = 1

##### b. Dérivabilité

#### 1. Dérivabilité en un point x=$x_{0}$

f est dérivable en $x_{0}$ si lim $\frac{f ( x ) - f ( x_{0} )}{x - x_{0}} =$ f’$( x_{0}$ )= l ($l \in \mathbb{R}$)

x$\to x_{0}$

f’$( x_{0}$ ) est appelé nombre dérivé.

Si f’$( x_{0}$ )=l$\neq 0, alors f est dérivable en x_{0}$ et la courbe (∁)

admet une tangente oblique au point d’abscisse $x_{0}$ d’équation :

(T) : Y = f’$( x_{0}$ )(x $- x_{0}$ ) + f$( x_{0}$ )

si f’$( x_{0}$ )= l=0, alors f est dérivable en $x_{0}$ et la courbe ( ∁) admet
au point $M_{0} ( x_{0} ;$ f$( x_{0}$ )) une tangente horizontale d’équation :
(T) : Y = f $( x_{0}$ )

si lim $\frac{f ( x ) - f ( x_{0} )}{x - x_{0}} = \infty$, alors f n’est pas dérivable en

$x \to x_{0}$

$x_{0} et$ la courbe (∁) admet au point $M_{0} ( x_{0} ;$ f$( x_{0}$ )) une tangente

verticale d’équation :(T) : x$= x_{0} M_{0} ( x_{0} ;$f$( x_{0}$ )) est un point de

rebroussement

#### 2. Dérivabilité à gauche et à droite en x $= x_{0}$

fest dérivable en $x_{0}$ à gauche si lim $\frac{f ( x ) - f ( x_{0} )}{x - x_{0}} =$f’g($x_{0}$ ) = l ($l \in \mathbb{R}$)

x$\to x_{0}$

fest dérivable en $x_{0}$ à droite si lim $\frac{f ( x ) - f ( x_{0} )}{x - x_{0}} =$f’$( x_{0}$ ) = l’(’l $\in \mathbb{R}$)

x$\to x_{0}$ d 17

Remarques

$R_{1} :$ f est dérivable en $x_{0}$ si $f’_{g} ( x_{0}$ )=l ($l \in \mathbb{R}$)

$R_{2}$ : Si $lim \frac{f ( x ) - f ( x_{0} )}{x - x_{0}} \neq lim \frac{f ( x ) - f ( x_{0} )}{x - x_{0}}$ ,

$x \to x_{0} x \to x_{0}$

L’une des formes étant au moins finie alors f n’est pas dérivable en $x_{0}$ et la courbe
(∁) admet au point $M_{0} ( x_{0} ;$ f$( x_{0}$ )) deux demi-tangentes qui ne forment pas un
angle plat et le point $M_{0} ( x_{0} ;$ f$( x_{0}$ )) est appelé point anguleux.
$R_{3}$ : Toute fonction dérivable est continue. La réciproque n’est pas toujours
vraie.

#### 3. Fonction dérivée

#### 1. Définition

Si f est dérivable en tout point $x_{0}$ de I, on dit que f est dérivable sur
I.
On appelle fonction dérivée première de f, la fonction notée f, qui
à tout réel x de I fait correspondre, le nombre dérivé de f au point
x.

$I$ ⟶ $\mathbb{R}$

f’{x ⟶ f’(x)

#### 2. Dérivées des fonctions usuelles et opérations

| Fonction ( f ) | Dérivée ( f ’ ) |  |
| --- | --- | --- |
| ( ) a a \in \mathbb{R} | 0 |  |
| x | 1 |  |
| x^{n} | - 1 nx^{n} |  |
| ( )^{n} ax + b | 1 ( )^{n-} an ax + b |  |
| ax^{2} + bx + c | 2 ax + b |  |
| 1 | 1 - |  |
| x | x^{2} |  |
| x \sqrt | 1 |  |
|  | 2 x \sqrt |  |
| U \pm V | U’ \pm V’ |  |
| U . V | U’ . V + U . V’ |  |
| U | U’ . V - U . V ’ |  |
| V | V^{2} |  |
| U^{n} | - 1 n U’ . U^{n} |  |
|  | U ’ |  |
| \sqrt U |  |  |
|  | 2 U \sqrt |  |
| 1 | U ’ - |  |
| U | U^{2} |  |
| cos x | - sin x |  |
| sin x | cos x |  |
| tan x | 1 1 + tan ² x = |  |
|  | cos ² x |  |
| cot x | 1 - |  |
|  | sin ² x |  |
| ( ) cos ax + b | ( ) - a sin ax + b |  |
| ( ) sin ax + b | ( ) cos ax + b |  |
| λ . U avec λε \mathbb{R} | λ . U ’ |  |
|  |  | 19 |

#### 3. Sens de variation

Soit fune fonction dérivable sur I
Si $\forall$ x $\in$ I, f’(x) <0 ; fest strictement décroissante sur I
Si $\forall$ x $\in$ I, f’(x) > 0 ; f est strictement croissante sur I
Si $\forall$ x $\in$ I, f’(x) = 0 ; f est constante sur I, f est une fonction
monotone sur I ; si elle est décroissante ou croissante.

#### 4. Extremum

Un point I ($x_{0} ,$f$( x_{0}$ )) est un extremum (minimum ou maximum)
Si f’(x) = 0.
En ce point la courbe (∁) admet une tangente horizontale.
Soit f, une fonction dérivable sur l’intervalle I = [a $;$b]

$x a x_{0} b x a x_{0} b$

$f ( x ) f ( x ) β$

$α$

$α$ est un minimum $β$ est maximum

### II. Compléments sur les fonctions numériques

#### 1. Dérivée et monotonie

$\forall x$ élément de I intervalle de $\mathbb{R}$.

Si f’(x$) \geq$0 (respectivement f’(x$) \leq$0) alors f est croissante
(respectivement décroissante) sur I.

#### 2. Fonction continue et strictement monotone

Si une fonction f est continue et strictement monotone sur un intervalle
I, alors f réalise une bijection de I sur f(I).
Par conséquent, f admet une bijection réciproque notée $f^{-1}$ définie sur
f(I) à valeurs dans I et variant dans le même sens que f.
N.B
Les courbes représentatives de f et $f^{-1}$ sont symétriques par rapport à
la première bissectrice (y = x).

#### 3. Dérivée d’une fonction réciproque

Soit fest une fonction continue et strictement monotone sur I.
Si f est dérivable sur I, alors sa réciproque $f^{-1}$ est aussi dérivable sur

f(I) et on a :($f^{-1} )’$ (x) = $\frac{1}{f’[ ( f^{-} 1 ) ( x ) ]}$

#### 4. Théorèmes

##### a. Théorème des valeurs intermédiaires

Si fest continue sur un intervalle I = [a $;$ b]alors f prend au moins
une valeur comprise entre f(a) et f(b)
Si f est continue sur un intervalle[a $;$ b]et f(a). f(b)<0,
alors il existe au moins un réel c$\in$ ]a $;$b[ tel que f(c) = 0,
autrement dit, l’équationf(x) = 0, admet au moins une

### solution.

Si f est une fonction continue et strictement monotone sur
[a $;$ b]et f(a). f(b) < 0, alors il existe un réel unique $c \in$
]a $;$ b[, tel quef(c) = 0.

##### b. Théorème de Rolle

Soit f une fonction continue sur [a $;$ b] dérivable sur ]a $;$b[ telle que
f(a) = f(b), il existe un réel ∝ $\in$ ]a $;$ b[ tel que f’(∝)=0.

##### c. Théorème des accroissements finis

Soit f une fonction continuesur [a $;$ b] et dérivable sur ]a $;$ b[, il existe

$C \in$ ]a $;$b[tel f’(c) = $\frac{f ( b ) - f ( a )}{b - a}$

##### d. Inégalités des accroissements finis

Soit f une fonction continue et dérivable sur l’intervalle fermé borne
[a $;$b], s’il existe des réels m et M tels que : x $\in$ [a $;$b] m$\leq f’$ (x$) \leq$M

alorsm$\leq \frac{f ( b ) - f ( a )}{b - a} \leq M$

De même, si f est une fonction continue et dérivable sur
l’intervalle [a $;$ b] et s’il existe un réel M tel que pour x $\in$
[a $;$b]

|f’(x)| $\leq$M alors|$\frac{f ( b ) - f ( a )}{b - a}$| $\leq$ M

#### 5. Recherche des points particuliers

##### a. Point d’inflexion

Soit f une fonction dérivable sur I, si la dérivée seconde de f
notée f’s’annule en $x_{0}$ en changeant de signe, la courbe (C)
de f traverse alors la tangente au point $M_{0} ( x_{0}$ ; ($x_{0}$ )), le
point $M_{0}$ est un point d’inflexion.

##### b. Points d’intersection avec les axes

Sur (ox) ; on pose y = f(x) = 0 puis on résout
l’équation f(x) = 0 22

Sur (oy) ; on pose x = 0 et on calcule f(o)
Exemple :
On considère la fonction numérique de la variable réelle
x définie par : f(x) =
Trouver les points d’intersection de (C) avec les axes.

### Solution

On a : A(0 ; 0) ; B(- 3 ;0) ; avec l’axe (ox); C(0 ; 0) avec
l’axe (oy)

#### 6. Courbes des fonctions associées

Soient f et g deux fonctions de courbes respectivement
Si g(x) = - f(x), les courbes f et g sont symétriques par
rapport à l’axe des abscisses
Si g(x) = f(- x), alors les courbes f et g sont symétriques
par rapport à l’axe des ordonnées.
Si g(x) = - f(- x), alors les courbes f et g sont symétriques
par rapport à l’origine.

Problème 1
On considère la fonction f de la variable réelle x définie par :

3$x^{2} +$ a, si $x \leq -$1

f(x) = { $\frac{4}{x - 3}$

##### x - 3 + , si x > - 1

(C) désigne la courbe représentative de f dans un repère orthonormé (O, i⃗ , j⃗ ) du plan
(Unité graphique 1 cm).
- 1. Déterminer a pour que la fonction f soit continue en $x_{0} =$ - 1
- 2. On pose a = - 8, Etudier la dérivabilité de f au point $x_{0} =$ - 1

#### 3. Etudier les variations de f.

- 4. Montrer que la droite d'équation y = x - 3 est une asymptote à la courbe (C)
de f.
- 5. Soit ℎ la restriction de f sur [5; +$\infty$[, montrer que h admet une bijection
réciproque$ℎ^{-1}$ .
- 6. construire les courbes (C) de f et (C') de $f^{-1}$ dans le même repère.
Problème 2

f(x) = $\frac{x - 2}{x + 3} ,$ si x < 2

On considère la fonction f définie par {

f(x) = $x^{2} -$ 2x, si $x \geq$ 2

#### 1. Préciser son ensemble de définition

- 2. Etudier la continuité et la dérivabilité de f en $x_{0}$ = 2. Donner une interprétation
géométrique

#### 3. Etudier les variations de f.

#### 4. Préciser les branches infinies.

- 5. On désigne par h la restriction de f sur ]$- \infty ;$ - 3]
- a. Monter que h admet une bijection réciproque notée$ℎ^{-1}$ .

##### b. Dresser le tableau de variation de$ℎ^{-}$ 1.

- c. Expliciter $ℎ^{-1}$ puis calculer ($ℎ^{-1} )($- 4) et ($ℎ^{-1}$ )'(- 4).
- d. Tracer les courbes (C) de f et (C’) de ($ℎ^{-1}$ ) dans le même repère.

### FICHE N° 2

### THEME : NOMBRES COMPLEXES

OBJECTIF GENERAL : Réaliser des activités numériques et algébriques
Objectifs Spécifiques :
Identifier un nombre complexe
Effectuer des calculs sur les nombres complexes
Utiliser les nombres complexes en géométrie
Résoudre des équations dans l’ensemble $\mathbb{C}$ des nombre complexes
Durée de la séquence de l’enseignement/d’apprentissage : 15 h
Plan du cours

#### 4. Corps des nombres complexes : Etude algébrique

4.1. Définition et forme algébrique d’un nombre complexe
4.2. Nombre complexe conjugué
4.2.1.Définition
4.2.2.Propriétés
4.3. Représentation géométrique d’un nombre complexe
4.4. Module d’un nombre complexe
4.4.1.Définition
4.4.2.Propriété

#### 5. Etude Trigonométrique

5.1. Argument d’un nombre complexe non nul
5.1.1.Définition
5.1.2.Propriété
5.2. Forme trigonométrique d’un nombre complexe non nul 25

5.2.1.Forme
5.2.2.Propriétés
5.2.3.Forme exponentielle d’un nombre complexe non nul
5.2.4.Formule de Moivre
5.2.5.Formules d’Euler
5.2.6.Propriétés

#### 6. Equations dans $\mathbb{C}$

6.1. Racines carrées d’un nombre complexe
6.1.1.Méthode algébrique
6.1.2.Méthode trigonométrique $: Racine n^{ième}$ d’un nombre complexe non nul
6.2. Equations du second degré à coefficients complexes

6.3. $Résolution d’une équation du 3^{ième}$ à coefficients complexes

#### 7. Quelques formules

7.1. Formule d’addition et de transformation (voir en annexe)
7.2. Formule du binôme de Newton

#### 8. Nombres complexes et géométrie

8.1. Application à la trigonométrie
8.1.1.Expression de cos($nθ$) et sin($nθ$) sous forme de polynôme de cos $θ$ et sin $θ$
8.1.2.Linéarisation
8.2. Nombre complexe et configuration du plan
8.3. Nature et élément caractéristique de transformation du plan
8.3.1.Similitude plane directe
8.3.2.Translation
8.3.3.Homothétie
8.3.4.Rotation

## CHAPITRE II : LES NOMBRES COMPLEXES

### I. Corps des nombres complexes : Etude algébrique

#### 1. Définition

On appelle nombre complexe tout nombre de la forme = a + ib , tel que a et b
sont des nombres réels et $i^{2} =$ - 1un nombre imaginaire. L’ensemble des
nombres complexes est noté $\mathbb{C}$. L’écriture Z = a + ib est appelée forme
algébrique de Z.
Le nombre réela est appelé partie réelle de Z et noté Re (Z)
Le nombre b est appelé partie imaginaire de Z et noté Im(Z)
D’où
Z = Re(Z) + iIm(Z)
Exemple :

$Z_{1}$ = 3 + 2i $; Z_{2} =$ - 4 + 7i $; Z_{3} =$ - 1 - i

Si b = 0, alors Z = a, est un nombre réel
Exemple :

$Z_{1}$ = 5 ;

$Z_{2} =$ - 10 ;

$Z_{3}$ = 11

Si a = 0 et b $\neq$ 0, alors Z = ib, le nombre Z est dit imaginaire pur.
Exemple :

$Z_{1}$ = 2i ;

$Z_{2} = - 7 i$ ;

$Z_{3}$ = 14i

Z est un nombre complexe nul si a = 0 et b = 0
Nombre complexe conjugue
Soit Z = a + ib un nombre complexe (a, b$) \in \mathbb{R} ^{2}$ .
On appelle conjugue de Z le nombre complexe, noté Z tel que :
Z = (a+ib) = a - ib
Exemple :

$Z_{1}$ = 1 + $i \to Z$ = 1 - i ;

$Z_{2}$ = 3 - 2$i \to Z_{2}$ = 3 + 2i

$. Z_{3} =$ - 2 + 5$i \to Z_{3}$ = - 2 - 5i $;$ si Z = $a \to Z$ = a

$. Z_{4} =$ - 3 - 7$i \to Z_{4}$ = 3 + 7i $;$ si Z = $ib \to Z$ = - ib

#### 2. Représentation géométrique d’un nombre complexe

Le plan P est muni d’un repère orthonormé direct (o$, e_{1}$⃗ ⃗ ⃗ ⃗ , $e_{2}$⃗ ⃗ ⃗ ⃗ ) (plan complexe)
Tout nombre complexe correspond à un point et un seul. Au nombre complexe
Z = a + ib correspond le point M(a). On dit que M(a) est le point image de

$b b$

$Z = a + ib , Z$ est l’affixe du point $M$

| u ⃗ ⃗ | axe réel |  |
| --- | --- | --- |
| ⃗ e_{1} ⃗ ⃗ ⃗ | a |  |
|  |  | 28 |

$b M$

axe imaginaire

$e_{2}$⃗ ⃗⃗ ⃗

U⃗⃗⃗ = ⃗OM⃗ ⃗ ⃗ ⃗ ⃗ ⃗

#### 3. Propriétés

Soit $Z = a + ib et Z = a - ib$

$P_{1} : Z + Z = 2a ; Z - Z = 2bi ; Z . Z = a^{2} + b^{2}$

$P_{2} :$ Z = (a - ib) = a + ib ⟹ Z = Z

$P_{3} : I_{m} ($Z) = b$; I_{m} ($Z ) = - bd’où $I_{m} ($Z) = $- I_{m} ($Z)

$P_{4} :$ R(Z) = a$;$ Re(Z ) = a: d’où Re(Z ) = Re(Z)
$P_{5} :$Z ∓ Z’= Z$\pm Z$’avecZ’= a’+ ib’

$P_{6}$ : ($\frac{_{1}}{Z}$) = $\frac{1}{Z} ( Z \neq 0$)

$P_{7}$ : ($\frac{_{Z}}{Z’}$) = $\frac{Z}{Z’} ( Z’\neq 0$)

$P_{8} : ZZ’= Z . Z’$

$P_{9} : Z^{n}$ = (Z$)^{n} ($Z$\neq 0$)

$P_{10} :$ Z = Z$\Leftrightarrow Z$ est réel

Z = - Z ⟺ Z est imaginaire

$a = a’$

$P_{11} :$ Z = Z’⟹ {

$b = b’$

#### 4. Module d’un nombre complexe

##### a. Définition

Soit Z un nombre complexe tel que Z = a + ib.
On appelle module de Z le nombre réel positif, noté|Z|, tel que :

|Z| = $\sqrt{Z}$. Z$= \sqrt{a^{2} + b^{2}}$

$\sqrt{2}$

|Z| = $\sqrt{a^{2} + b^{2}}$ = ($R_{(z)}$ ) + ($I_{m} ($Z$) )^{2}$

$b$

$e_{2}$⃗ ⃗⃗ ⃗

0 ⃗$e_{1}$⃗ ⃗ ⃗ a

##### b. Interprétation géométrique

|Z| = ‖⃗OM⃗ ⃗ ⃗ ⃗ ⃗ ⃗ ‖ = OM
Exemple :
Calculons les modules des nombres complexes suivants.

Z = 3 - 4$i \to$ |Z| = $\sqrt{\;}$(3) Z| = 5

$\frac{2 + ( - 4 )^{2} ⟹ |}{\frac{1}{2} 2 \sqrt{2} 2}$

Z = $- \frac{1}{2} + i \sqrt{2} \to$ |Z| = $\sqrt{(}$- ) + ( ) ⟹ |Z| = 1

$\frac{1 + i \sqrt{3}}{1 + i} \frac{| 1 + i \sqrt{3}^{|}}{| 1 + i |} \sqrt{\sqrt{\;}} \frac{2}{\sqrt{2}}$ 30

Z $= \to$ |Z| = = $\Rightarrow$ |Z| = $\Rightarrow$ |Z| = $\sqrt{\;}$2

### Exercice :

Calculer le module des nombres complexes suivants :
- 1. $Z_{1} = \frac{1 + i}{\sqrt{2}}$ ;

#### 2. $Z_{2}$ = 2 + 2$i \sqrt{\;}$3

##### c. Propriétés

Pour tous nombres complexes Z et Z’, pour tout entier relatif n, on a *
$P_{1}$ : |Z.Z’| = |Z|. |Z’|

$P_{2}$ : |$\frac{1}{Z}$| = $\frac{1}{| Z |} ( Z \neq 0$

$P_{3}$ : |$Z^{n}$ | = |$Z |^{n} ( Z \neq 0$)

$P_{4}$ : |$\frac{Z}{Z’}$| = $\frac{| Z |}{| Z’|} ( Z \neq 0$)

$P_{5}$ : |Z + Z’| = |Z| + |Z’|

$P_{6}$ : |$Z |^{2} =$ Z. Z

$P_{7}$ : |⋋ Z| =⋋ |Z|

$P_{8} : \frac{1}{Z} = \frac{1}{| Z^{2} |}$

$P_{9}$ : |Z + Z’| $\leq$ |Z| + |Z’|
Exemple :

Soit $Z_{1}$ = ($- \sqrt{\;}$3 + i)(1 + $i )^{2} et Z_{2} = \frac{( - \sqrt{3}^{+} i ) 3}{( 1 + i )^{2}}$

Montrons que le module de $Z_{1}$ est égale au module de $Z_{2}$

$2$

|$Z_{1}$ | = |$- \sqrt{3}$ + i||1 + $i |^{2}$ ⟹ |$Z_{1}$ | = (2)($\sqrt{2}$) ⟹ |$Z_{1}$ | = 4

|$Z_{2}$ | = $\frac{| - \sqrt{3}^{+} i | 3}{| 1 + i^{2} |}$ ⟹ |$Z_{2}$ | = $\frac{2^{3}}{( \sqrt{2}^{)} 2}$ ⟹ |$Z_{2}$ | = $\frac{8}{2}$ ⟹ |$Z_{2}$ | = 4 d’où

|$Z_{1}$ | = |$Z_{2}$ | = 4

### II. Etude Trigonométrique

#### 1. Argument d’un nombre complexe non nul

1.1. Définition
Soit Z un nombre complexe non nul et M son image dans le plan complexe.
On appelle argument de Z toute mesure de l’angle orienté ($e_{1}$⃗ ⃗ ⃗ ⃗ , ⃗OM⃗ ⃗ ⃗ ⃗ ⃗ ⃗ ) en
radian.
|Z| = OM

$b$

e⃗ ⃗⃗ ⃗

$\frac{2}{0 a} \frac{θ}{⃗ e_{1} ⃗ ⃗ ⃗}$

NB :
Pour trouver l’argument d’un nombre complexe, Z,
On calcul :
- 1) Son module |Z| = $ρ$ = ‖⃗OM⃗ ⃗ ⃗ ⃗ ⃗ ⃗ ‖ = $\sqrt{a^{2} + b^{2}}$

#### 2) On pose $θ$ = arg(Z)[2$π$]

$\frac{R_{e} ( Z )}{| Z |} a$

$cosθ$ = =

On trouve { $θ$[2$π$]

$sinθ = \frac{I_{m} ( Z )}{| Z |} = \frac{| Z b |}{| Z |}$

Voir le cercle trigonométrique (en annexe)
Activité :
Calculons le module et un argument des nombres complexes suivants :

$Z_{1} = 1 + i$

$a \frac{1}{\sqrt{2}} \sqrt{2}$

$cosθ$ = $cosθ$ = =

arg $( Z_{1}$ ) ⟹ { ⟹ { $θ = \frac{π}{4}$ [2$π$]

$sinθ = \frac{| b Z |}{| Z |} 1 \sqrt{2}$

$sinθ$ = =

$\sqrt{2}$

$\frac{1}{2} \sqrt{2}$ | |

$Z_{2} = - i \to Z_{2} = 1$

$cosθ = \frac{1}{2}$

$arg Z_{2}$ { $θ$ = $- \frac{π}{6}$ [2$π$]

$sinθ = - \sqrt{2}$

$Z_{3} = \sqrt{3}$ + $i \to$ |$Z_{3}$ | = 2

$cosθ = \sqrt{3}$

arg$( Z_{3}$ ) { $θ = \frac{π}{6}$ [2$π$]

$sinθ = \frac{1 2}{2}$

1.2. Propriétés
Soit Z = a + ib et Z’= a’+ ib’
$P_{1} arg$(Z. Z’) = [arg(Z) + arg(Z’)][$2π$]

$P_{2} arg ( \frac{Z}{Z’}$) = [arg(Z) - arg(Z’)][$2π$]

$P_{3} arg ( \frac{1}{Z}$) = [- arg(Z)][$2π$] car arg(1) = 0

$P_{4} arg ( \frac{1}{Z^{n}}$) = [- n arg(z)][$2π$]

$P_{5} arg ( Z^{n}$ ) = [n arg(Z)][$2π$] 33

Remarques
Le nombre complexe nul n’a pas d’argument : Z = 0
Z est imaginaire pur ⟺ arg(Z) = $\frac{π}{2}$ [$π$]
Pour tout nombre complexe Z non nul on a :
arg(Z) = - arg(Z)[2$π$]
arg(- Z) = $π$ + arg(Z)[2$π$]
arg(- Z) = $π$ - arg(Z) [2$π$]

#### 2. Forme trigonométrique d’un nombre complexe non nul

Soit Z un nombre complexe non nul de module |Z| et d’argument $θ$
On sait que : Z = a + ib

$a$

$cosθ$ = ⟹ a = |Z|$cosθ$

Or arg(Z){

$sinθ = \frac{| Z b |}{| Z |}$ ⟹ b = |Z|$sinθ$

Ainsi Z = a + ib ⟹ Z = |Z|$cosθ$ + i|Z|$sinθ$

$\frac{⟹ Z = | Z | [ cosθ + i sinθ ]}{Z = | Z | [ cosθ + i sinθ ]}$

On appelle forme trigonométrique de Z l’écriture
Activité :
Déterminons la forme trigonométrique des nombres complexes suivants.

$Z_{1} = - \frac{1}{2} + i \sqrt{2} \to$ |$Z_{1}$ | = 1

$cosθ = - \frac{1}{\frac{2}{3}}$

arg$( Z_{1}$ ) ⟹ $θ = \frac{2π}{3}$ [$2π$]

$\sqrt{2}$

{ $sinθ$ =

Or $Z_{1}$ = |$Z_{1}$ |[$cosθ$ + isinθ] d’où

| 2π 2π |  |
| --- | --- |
| Z_{1} = cos + i sin |  |
| 3 3 | 34 |

$Z_{2} = \sqrt{\;}$3 + $i \to$ |$Z_{2}$ | = 2

$\sqrt{\;}$3

$cosθ$ =

arg$( Z_{2}$ ) ⟹ $θ = \frac{π}{6}$ [2$π$]

$sinθ = \frac{1 2}{2}$

{

Or Z = |$Z_{2}$ |[$cosθ$ + isinθ] d’où $Z_{2}$ = 2 [$cos \frac{π}{6}$ + isin $\frac{π}{6}$]

$\frac{1}{3} \sqrt{2}$3

$Z_{3} =$ - i $; Z_{4} = - \sqrt{3}$ - i$; Z_{4} =$ - 1 + $i \sqrt{\;}$3

2.1. Propriétés
Soit ZetZ’deux nombres complexes non nuls on a:
|Z| = |Z’|

$P_{1} Z$ = Z’⟹ {

$θ = θ’+ 2kπ ( k \in \mathbb{Z}$)

$P_{2} Z$.Z’⟹ [|Z|.|Z4|];$θ$ + $θ$’

$P_{3} \frac{Z}{Z’}$ ⟹ $\frac{[ | Z | ; θ ]}{[ | Z’| ; θ’]}$ + [$\frac{| Z |}{| Z’|}$] avec Z$’\neq 0$

$P_{4} \frac{1}{Z}$ ⟹ [$\frac{1}{| Z |} ;$ - $θ$] avec $Z \neq 0$

$P_{5} Z^{n}$ ⟹ [|$Z |^{n} ; nθ$]

$P_{6} -$ Z ⟹ [|Z|; $θ$ + u ]

NB :
Z = [|Z|; $θ$] est la forme polaire d’un nombre complexe non nul
Activité :
Déterminons le module et un argument des nombres complexes
suivants

#### 1- $i \sqrt{2}$3

$Z_{1}$ = 2 On pose $Z_{1} = \frac{z_{1}}{z_{2}}$ avec $z_{1} = \frac{1}{2} - i \sqrt{2}$ et

$- \sqrt{3} - i$

$z_{2} = - \sqrt{3 - i}$ 35

$cosθ = \frac{1}{2}$

|$z_{1}$ | = 1 arg$( z_{1}$ ) ⟹ $θ_{1} = - \frac{π}{3}$ [2$π$]

$\sqrt{2}$3

{$sinθ = -$

⟹ $z_{1}$ = [1; $- \frac{π}{3}$]

$\sqrt{2}$3

$cosθ = -$

|$z_{2}$ | = 2 arg$( z_{2}$ ) ⟹ $θ = \frac{7 π}{6}$ [2$π$]

$sinθ = - \frac{1}{2}$

{

⟹ $z_{2}$ = [2; $- \frac{7 π}{6}$]

Or $Z_{1} = \frac{z_{1}}{z_{2}}$ ⟹ $Z_{1} = \frac{[ 1 ; ]}{[ 2 ; \frac{- 7 \frac{π}{π 3 ]}}{6}}$ ⟹ $Z_{1}$ = [$\frac{1}{2} ; - \frac{π}{3} - \frac{7 π}{6}$]

$Z_{1}$ = [$\frac{1}{2} ; - \frac{3π}{2}$]

$Z_{2} = \frac{- 1 + i \sqrt{3}}{1 + i}$ posons $Z_{2} = \frac{z_{1}}{z_{2}}$ avec $z_{1} =$ - 1 + $i \sqrt{\;}$3 et $z_{2}$ = 1 + i

$cosθ = - \frac{1}{\frac{2}{3}}$

($z_{2}$ ) ⟹ $θ = \frac{2 π}{3}$ [2$π$]

|$z_{1}$ | = 2 arg $\sqrt{2}$

{ $sinθ$ =

⟹ $z_{1}$ = [2; $\frac{2 π}{3}$]

$\sqrt{2}$2

$cosθ$ =

($z_{2}$ ) ⟹ $θ = \frac{π}{4}$[2$π$]

|$z_{2}$ | = $\sqrt{\;}$2 ⟹ arg $\sqrt{2}$2

$sinθ$ =

{

⟹ $z_{2}$ = [$\sqrt{\;}$2; $\frac{π}{4}$]

$Z_{2}$ = [$\sqrt{2 ; \frac{5π}{12}}$]

2.2. Forme exponentielle d’un nombre complexe non nul
Soit Z un nombre complexe non nul de module |Z| et d’argument $θ$.
Z = |Z|[$cosθ$ + isinθ].

Z = |Z|$e^{iθ}$

On appelle forme exponentielle de Z l’écriture avec

$e^{iθ} = cosθ$ + isinθ

Activité.
Déterminons la forme exponentielle des nombres complexes suivants

$Z_{1}$ = 1 - $i \to$ |$Z_{1}$ | = $\sqrt{2}$ arg$( Z_{1}$ ) = $θ_{1} = - \frac{π}{4}$ [2$π$]

$- \frac{iπ}{4}$

Or Z = |Z|$e^{iθ}$ ⟹ $Z_{1} = \sqrt{2}$e

$Z_{2} = - \sqrt{3}$ - $i \to$ |$Z_{2}$ | = 2: arg$( Z_{2}$ ) = $θ_{2} = \frac{7 π}{6}$ [2$π$]

$\frac{i7π}{6}$

$Z_{2} = 2e$

### Exercice :

Soit $Z_{1}$ = 1 + i $et Z_{2}$ = 1 + $i \sqrt{\;}$3

#### 1- Déterminer le module et un argument de $Z_{1} et Z_{2}$

- 2- Exercice sous forme trigonométrique, algébrique et exponentielle le nombre

complexe $z = Z_{1} . Z_{2}$

- 3- En déduire les valeurs exactes de $cos \frac{7 π}{12} et sin \frac{7 π}{12}$

### Solution

$Z_{1}$ = 1 + i $et Z_{2}$ = 1 + $i \sqrt{\;}$3

#### 1- Déterminons le module et un argument de $Z_{1} et Z_{2}$

$cosθ = \sqrt{2}$

|$Z_{1}$ | = 2 ⟹ arg($Z_{1}$ ){ ⟹ $θ = \frac{π}{4}$ [2$π$] ⟹ $Z_{1}$ = [$\sqrt{\;}$2; $\frac{π}{4}$]

$sinθ \sqrt{2}$

$\frac{=}{\frac{π}{4}}$

arg$( Z_{1}$ ) = [$2π$]

cos$\theta = \frac{1}{2}$

|$Z_{2}$ | = 2 ⟹ arg($Z_{2}$ ) { ⟹ $\theta = \frac{\pi}{3}$ [$2\pi$] ⟹ $Z_{2}$ = [2; $\frac{\pi}{3}$]

sin$\theta = \sqrt{2}$

arg$( Z_{2}$ ) = $\frac{π}{3}$ [$2π$]

#### 2- Forme trigonométrique de z $= Z_{1} . Z_{2}$

z $= Z_{1} . Z_{2}$ ⟹ z = [|$Z_{1}$ |. |$Z_{2}$ |; $\theta _{1} + \theta _{2}$ ] ⟹ z = [2$\sqrt{\;}$2; $\frac{\pi}{4} + \frac{\pi}{3}$]

z = [2$\sqrt{\;}$2; $\frac{71}{12}$] ⟹ z = |z|[cos$\theta$ + isin$\theta$] ⟹ z = $2 \sqrt{2}$ [$cos \frac{7π}{12} +$ i $sin \frac{7π}{12}$]

- Forme exponentielle de z $= Z_{1} . Z_{2}$

$\frac{i7π}{6}$

z = |Z|$e^{i\theta}$ ⟹ z = $2 \sqrt{2}$ e

- Forme algébrique

z $= Z_{1} . Z_{2}$ ⟹ z = (1 + i)(1 + i$\sqrt{\;}$3) z = (1 $- \sqrt{3}$) + i(1 $+ \sqrt{3}$)

2.3. Déduisons les valeurs exactes de $cos \frac{7π}{12}$ et $sin \frac{7π}{12}$ par

identification$z = z$

$2 \sqrt{\;}$2 [$cos \frac{7 π}{12}$ + isin $\frac{7 π}{12}$] = (1 $- \sqrt{\;}$3) + i(1 + $\sqrt{\;}$3) ⟹

2$\sqrt{\;}$2cos $\frac{7 π}{12} +$ i $2 \sqrt{2 sin \frac{7 π}{12}}$ = (1 $- \sqrt{\;}$3) + i(1 + $\sqrt{\;}$3)

7$π \frac{7 π}{12} 1 - \sqrt{2} 3 \sqrt{2 \sqrt{\;} \frac{1}{2} \times \sqrt{3} )}$2( $- \sqrt{2}$3)

2$\sqrt{2}$cos = 1 $- \sqrt{3}$ cos = =

2$\sqrt{\;}$

$\Rightarrow$ { $\Rightarrow \frac{(}{2}$

2$\sqrt{2 sin \frac{7 12 π}{12}}$ = 1 + $\sqrt{3 \frac{7 π}{12}}$ 1 + $\sqrt{2} 3 \sqrt{2 ( \sqrt{\;} \frac{1}{2} \times \sqrt{\;} )}$( + $\sqrt{2}$)

sin = =

{ 2$\sqrt{\;}$

| 7 π 2 - 6 \sqrt \sqrt cos = | 7 π 2 + 6 \sqrt \sqrt sin = |
| --- | --- |
| 12 4 | 12 4 |

D’où
Formule de Moivre
Soit Z = |Z|[$Cosθ$ + isinθ] avec |Z| = 1
Z = $cosθ$ + isinθ

$Z^{n}$ = ($cosθ$ + isinθ$)^{n} \Rightarrow Z^{n} =$ cos(n$θ$) + isin($nθ$)

Formule d’Euler

Soit $θ \in \mathbb{R} ,$ on a$:$ Z = $cosθ$ + isinθ = $e^{iθ}$

$\frac{1}{Z} = cosθ$ - isinθ = $e^{-iθ}$

Z $+ \frac{1}{Z}$ = 2$cosθ = e^{iθ} + e^{-} iθ \Rightarrow cosθ = \frac{e^{iθ} + e^{-} iθ}{2}$

| e^{iθ} - e^{-iθ} |  |
| --- | --- |
| sinθ = |  |
| 2i | 39 |

Z $- \frac{1}{Z}$ = 2isinθ = $e^{iθ} + e^{-} iθ \Rightarrow$

2.4. Propriétés

Soit Z = |Z|$e^{iθ} et$ Z’= |Z’|$e^{iθ}$

$P_{1}$ ⟹ Z. Z’= |Z|. |Z’|$e^{i(θ+θ’)}$

$P_{2}$ ⟹ $\frac{Z}{Z’} = \frac{| Z |}{| Z’|} e^{i(θ} - θ$)(Z$’\neq 0$)

$P_{3}$ ⟹ $\frac{1}{Z} = \frac{1}{| Z |} e^{-} iθ$($Z \neq 0$)

$P_{4}$ ⟹ $Z^{n}$ = |$Z |^{n} e^{inθ}$

### Exercice d’application(non résolus)

Résoudre dans $\mathbb{C} \times \mathbb{C}$ les systèmes suivants

2$iZ_{1} -$ (1 + i$) Z_{2}$ = 4

$S_{1}$ { ;

3$Z_{1} - 2 i Z_{2} = i$

(1 + i$) Z_{1} - iZ_{2}$ = 2 + i

$S_{2}$ { ;

(2 + i$) Z_{1}$ + (2 - i$) Z_{2}$ = 7 - 4i

(2 + i$) Z_{1}$ + 7$Z_{2}$ = 1 + 2i

$S_{3}$ {

(1 - i$) Z_{1} - i Z_{2}$ = 4 - i

### III. Equation dans $\mathbb{C}$

#### 1. Racines carrées d’un nombre complexe

##### a. Méthode algébrique

Soit Z = a + ib un nombre complexe et U = x + iyune racine carrée de
$Z$ tel que

|$U |^{2}$ = |Z| 40

$U^{2} = Z \Rightarrow$ {

$U^{2} = Z$

$x^{2} + y^{2} = \sqrt{a^{2} + b^{2} x^{2} + y^{2} = \sqrt{\;} a^{2} + b^{2}}$

$\Rightarrow$ { $\Rightarrow$ {

(x + $iy )^{2} =$ a + $ib x^{2} - y^{2}$ + 2ixy = a + ib

Activité : 1
Déterminons les racines carrées de Z = 3 - 4i soit U = x + iyune racine carrée de Z
tel que $U^{2} =$ Z|Z| = 5

$x^{2} + y^{2}$ = 5 (1) $x^{2} + y^{2}$ = 5

{ ( ) (1)+(2) { .$\Rightarrow x^{2}$ = 4 $\Rightarrow x = \pm 2 \Rightarrow$ {x = - 2

$x^{2} - y^{2}$ = 3 2 $x^{2} - y^{2}$ = 3

x = 2
2xy = - 4 (3) 2$x^{2}$= 8

six = - 2 dans(3). ona: - 4y = - $4 \Rightarrow y$ = 1 or U = x + $iy \Rightarrow U_{1} =$ - 2 + i

si x = 2 dans (3). on a: 4y = - $4 \Rightarrow y$ = - 1 or U = x + $iy \Rightarrow U_{2}$ = 2 - i

D’où S{- 2 + i$;$ 2 - i}
Activité 2 :
Déterminons les racines carrées de Z = - 1 - 4$i \sqrt{\;}$3 soit U = x + iyune racine carrée
de Z tel que : $U^{2} =$ Z|Z| = 7

$x^{2} + y^{2}$ = 7 (1) $x^{2} + y^{2}$ = 7

{$x^{2} - y^{2} =$ - 1 (2) (1)+(2) {$x^{2} - y^{2} =$ - $1 \Rightarrow x^{2}$ = 3 $\Rightarrow x = \pm \sqrt{3 \Rightarrow}$

2xy = - $4 \sqrt{\;}$3(3) 2$x^{2}$ = 6

{x = $- \sqrt{3}$3

$x = \sqrt{\;}$

Si x = $- \sqrt{\;}$3dans (3) on a$:$ - $2 \sqrt{3}$y = - $4 \sqrt{3 \Rightarrow y}$ = 2

OrU = x + $iy \Rightarrow U_{1} = - \sqrt{\;}$3 + 2i 41

Si x $= \sqrt{\;}$3 dans (3). on $2 \sqrt{3}$y = - $4 \sqrt{3 \Rightarrow y}$ = - 2

$\frac{a :}{3}$

OrU = x + $iy \Rightarrow U_{2} = \sqrt{-}$ 2i

D’où S{$- \sqrt{3}$ + 2i$; \sqrt{3}$ - 2i}

Activité 3 :
Déterminons les racines carrées de Z = - $8 \sqrt{\;}$2 + 8$i \sqrt{\;}$2
Soit U = x + iyla racine carrée de Z tel que : $U^{2} =$ Z|Z| = 16

$x^{2} + y^{2}$ = 16 (1)

{ $x^{2} - y^{2}$ = 8$\sqrt{\;}$2(2)

$\frac{-}{2}$

2xy = - $8 \sqrt{\;}$ (3)

$x^{2} + y^{2}$ = 16

(1)+(2) { $x^{2} - y^{2} =$ - $8 \sqrt{2 \Rightarrow x = \pm \sqrt{\;} 8}$ - $4 \sqrt{2 \Rightarrow x^{2}}$ = 8 - $4 \sqrt{\;}$2

2$x^{2} = 16 - 8 \sqrt{2}$

$x^{2} + y^{2}$ = 16

$x = - \sqrt{8 - 4 \sqrt{\;}} 8 - 4 \sqrt{2}$2

(1)-(2) { $- x^{2} + y^{2}$ = 8$\sqrt{\;}$2 { $\Rightarrow y^{2}$ = 8 + 4$\sqrt{\;}$2

$x = \sqrt{\;}$

2$y^{2}$ = 16 + 8$\sqrt{\;}$2

$\Rightarrow y = \pm \sqrt{\;}$8 + 4$\sqrt{\;}$2

y = $- \sqrt{\;}$8 + 4$\sqrt{\;}$2

$or U = x + iy$

y $= \sqrt{\;}$8 + 4$\sqrt{\;}$2

{

$U_{1} = - \sqrt{8}$ - $4 \sqrt{2}$ - $i \sqrt{\;}$8 + 4$\sqrt{2 et U_{2} = \sqrt{\;} 8}$ - $4 \sqrt{\;}$2 + $i \sqrt{\;}$8 + 4$\sqrt{\;}$2

D’où

##### b. Méthode trigonométrique : Racines $n^{ième}$ d’un nombre

complexe
Soit Z un nombre complexe non nul et n un entier naturel($n \geq$ 2).
On appelle racine $n^{iè} me$de Z, tout nombre complexe z tel que $z^{n} =$ Z

Posons z = [|z|; $θ_{1}$ ] et Z = [|Z|; $θ_{2}$ ] $or z^{n} =$ Z

|$z |^{n}$ = |Z|

$\Rightarrow$ [|$z |^{n} ; nθ_{1}$ ] = [|Z|; $θ_{2}$ ] $\Rightarrow$ {

$nθ_{1} = θ$ + 2$kπ$ ($k \in Z$)

$n \frac{2}{| Z |}$

|z| = $\sqrt{\;}$

$\Rightarrow$ {

$θ_{1} = \frac{θ_{2}}{n} + \frac{2 kπ}{n}$

$z_{k}$ = [$n \sqrt{\;}$|Z|; $\frac{θ_{2}}{n} + \frac{2kπ}{n}$]

D’où

$z_{k} = n \sqrt{| Z |}$[cos$( \frac{θ_{2}}{n} + \frac{2kπ}{n}$) + i sin$( \frac{θ_{2}}{n} + \frac{2kπ}{n}$)]

Avec k = {0, 1, 2, 3, … , n - 1}
Activité :
Résolvons dans $\mathbb{C}$ les équations suivantes

$Z^{3}$ = 1 + $i \sqrt{\;}$3 posons $Z^{3} =$ z avec z = 1 + $i \sqrt{\;}$3

Z = [|Z|;$θ$] et z = [2; $\frac{π}{3}$] $or Z^{3} = z \Rightarrow$ [|Z|;$θ ]^{3}$ = [2; $\frac{π}{3}$]

| $|^{3}$ |Z| = 3 2

Z = 2 $\sqrt{\;}$

[|$Z |^{3}$ ; 3$θ$] = [2; $\frac{π}{3}$] ⟹ { ⟹ {

3$θ = \frac{π}{3}$ + 2$kπ θ = \frac{π}{9} + \frac{2 kπ}{3} ( k \in Z$)

$Z_{k}$ = 3 2 [cos $( \frac{π}{9} + \frac{2 kπ}{3}$) + i sin $( \frac{π}{9} + \frac{2 k π}{3}$)] aveck = {0, 1, 2}

$\sqrt{\;}$

$Z_{0} = 3 \sqrt{2}$[$cos \frac{π}{9} +$ i $sin \frac{π}{9}$]

Si k = 0 :
Si k = 1 : 3

$\frac{Z_{1} = \sqrt{2}^{[} cos \frac{7π}{9}}{+ i sin 7π ]}$

$\frac{9}{3 \frac{13π}{9} \frac{13π}{9}}$

Si k = 2 : $Z_{2} = \sqrt{2}$[cos + i sin ]

$Z^{4} =$ - 1 + i Posons $Z^{4} =$ z avec z = - 1 + i

Z = [|Z|;$θ$]etz = [$\sqrt{\;}$2; $\frac{3 π}{4}$]or$Z^{4} =$ z ⟹ [|Z|;$θ ]^{4}$ = [$\sqrt{\;}$2; $\frac{3 π}{4}$]

|$Z |^{4} = \sqrt{\;}$2

$\Rightarrow$ [|$Z |^{4}$ ;4$θ$] = [$\sqrt{\;}$2; $\frac{3 π}{4}$] $\Rightarrow$ {

4$θ = \frac{3 π}{4}$ + 2$kπ$ ($k \in Z$)

4$\sqrt{\;}$

|Z| $\sqrt{4 \frac{3 π}{16} \frac{kπ}{2}}$

{ d’où$Z_{k}$ = [$\sqrt{\sqrt{\;}}$2; + ]

$θ = \frac{= 3 π}{16} + \frac{kπ 2}{2}$

$Z_{k} = \sqrt{\sqrt{\;}}$2[cos $( \frac{3 π}{16} + \frac{kπ}{2}$) + i sin $( \frac{3 π}{16} + \frac{kπ}{2}$)]

Avec k = {0, 1, 2, 3}
- si k = 0 ; 4

$Z_{0} = \sqrt{\sqrt{\;} 2}$ [$cos \frac{3π}{16} +$ i $sin \frac{3π}{16}$]

$4$

- si k = 1 ; $Z_{1} = \sqrt{\sqrt{\;} 2}$ [$cos \frac{1 1 π}{16} +$ i $sin \frac{11π}{16}$]

$4$

- si k = 2 ; $Z_{2} = \sqrt{\sqrt{\;} 2}$ [$cos \frac{19π}{16}$ + +i $sin \frac{19π}{16}$]

| 4 27π 27π \sqrt Z_{3} = 2 [ cos + i sin ] \sqrt |  |
| --- | --- |
| 16 16 |  |
|  | 44 |

- si k = 3 ;

- Exercice : Résoudre dans $\mathbb{C}$ les équations suivantes :

$Z_{1}^{3} =$ - 1 - i $; Z_{2}^{2} = \sqrt{\;}$3 + i $et Z_{3}^{4}$ = 1 - $i \sqrt{\;}$3

T.A.F :

#### 2. Equations du second degré à coefficient complexes

Soit $aZ^{2} +$ bZ + $c une équation du 2^{nd}$ degré où a, b et c sont des nombres

complexes avec $a \neq$ 0.
Pour résoudre cette équation, on calcule le discriminant $\Delta = b^{2} - 4 ac ou$

$\Delta’= b’2 - ac$

1er cas si $\Delta$> 0 $ou \Delta’$ > 0, alors l’équation admet deux racines distinctes.

$Z_{1} = \frac{- b - \sqrt{\Delta}}{2 a} et Z_{2} = \frac{- b + \sqrt{\Delta}}{2 a}$ ou $Z_{1} = \frac{- b’- \sqrt{\Delta’}}{a} et Z_{2} = \frac{- b’+ \sqrt{\Delta’}}{a}$

Exemple : Résolvons dans $\mathbb{C}$ les équations suivantes :

#### 1) $Z^{2} -$ 5Z + 4 = 0 avec a = 1; b = - 5 et c = 4

$\Delta = b^{2} -$ 4$ac \Rightarrow \Delta$= (- $5 )^{2} -$ 4(1)(4) $\Rightarrow \Delta$= 25 - $16 \Rightarrow \Delta$= 9 > 0,

alors l’équation admet deux racines distinctes.

$Z_{1} = \frac{- b - \sqrt{\;} \Delta}{2 a} \Rightarrow Z_{1} = \frac{5 - 3}{2} \Rightarrow Z_{1}$ = 1

$Z_{2} = \frac{- b + \sqrt{\;} \Delta}{2 a} \Rightarrow Z_{2} = \frac{5 + 3}{2} \Rightarrow Z_{2}$ = 4

D’où S = {1$;$4}
- 2) $Z^{2}$ + 4iZ - 8 = 0 avec a = 1; b = 4i et c = - 8 ; b’$= \frac{b}{2}$ ⟹ b’= 2i

$\Delta’= b^{2}’$ - ac ⟹ $\Delta’$ = (2$i )^{2} -$ (1)(- 8)

$\Delta’=$ - 4 + 8 ⟹ $\Delta’$ = 4 > 0, alors l’équation admet deux racines
distinctes

$Z_{1} = \frac{- b’- \sqrt{\;} \Delta’}{a}$ ⟹ $Z_{1} =$ - 2i $- \sqrt{\;}$4 ⟹ $Z_{1} =$ - 2 - 2i

$Z_{2} = \frac{- b’+ \sqrt{\Delta’}}{a}$ ⟹ $Z_{2} = - 2 i$

$\frac{- 2 i + \sqrt{\;} 4 ⟹ Z_{2} = 2}{S = { - 2 - 2i ; 2 - 2i }}$

D’où
$2^{ème}$ Cas $si \Delta =$ 0 $ou \Delta’=$ 0, alors l’équation admet une racine double.

| - b Z_{1} = Z_{2} = |  | - b ’ |
| --- | --- | --- |
|  | o u | Z_{1} = Z_{2} = |
| 2 a |  | a |

Exemple : Résolvons dans $\mathbb{C}$ l’équation suivante :
$4 Z^{2}$ + 4Z + 1 = 0 avec a = 4; b = 4 et c = 1 b’= 2

$\Delta’= b^{2}’$ - ac ⟹ $\Delta’$ = (2$)^{2} -$ (4)(1) $\Rightarrow \Delta’$ = 4 - $4 \Rightarrow \Delta’$ = 0, alors

l’équation admet une racine double.

$Z_{1} = Z_{2} = \frac{- b’}{a} \Rightarrow Z_{1} = Z_{2} = \frac{2}{4} \Rightarrow Z_{1} = Z_{2} = - \frac{1}{2}$

D’où S = {$- \frac{1}{2}$}

3ème Cas $si \Delta$< 0 $ou \Delta’$ < 0, alors l’équation admet deux racines complexes
conjuguées

|  |  | \sqrt \| \| \| \| - b ’ - i \Delta ’ - b ’ + i \sqrt \Delta |
| --- | --- | --- |
| - b - i \sqrt \| \Delta ’ \| - b + i \sqrt \| \Delta \| Z_{1} = et Z_{2} = |  | Z_{1} = et Z_{2} = |
| a 2a | ou | a a |

Exemple :
Résoudre dans $\mathbb{C}$ les équations suivantes :
- a) (1 + i$) Z^{2}$ + 2(2 + i) Z + 4 = 0 avec a = 1 + i $;$b = 2(2 + i)
et c = 4 b’= 2 + i

$\Delta’= b^{2}’$ - ac ⟹ $\Delta’$ = (2 + $i )^{2} -$ (1 + i)(4) ⟹ $\Delta’=$ - 1 < 0 alors

l’équation admet deux racines complexes conjuguées

$Z_{1} = \frac{- b - i \sqrt{| \Delta’|}}{a}$ ⟹ $Z_{1} = \frac{- ( 2 + i ) - i \sqrt{| \Delta’|}}{1 + i} \Rightarrow Z_{1} = \frac{- 2 - i - i}{1 + i}$

$Z_{1} = \frac{- 2 - 2 i}{1 + i} \Rightarrow Z_{1} = \frac{- 2 ( 1 + i ) ( 1 - i )}{( 1 + i ) ( 1 - i )} \Rightarrow Z_{1} = -$2

$Z_{2} = \frac{- ( 2 + i ) + i \sqrt{| - 1 |}}{1 + i} \Rightarrow Z = \frac{- 2 - i + i}{1 + i} \Rightarrow Z_{2} = \frac{- 2 ( 1 - i )}{( 1 + i ) ( 1 - i )} \Rightarrow Z_{2} =$ - 1 + i

$\frac{2}{S = { - 2 ; - 1 + i }}$

D’où
- b) $Z^{2} -$ (2 + i) Z + 3 + i = 0 avec a = 1; b = - (2 + i) et c = 3 + i

$\Delta = b^{2} -$ 4$ac \Rightarrow \Delta$= [- (2 + i$) ]^{2} -$ 4(1)(3 + i)

$\Delta$= 4 + 4i - 1 - 12 - 4$i \Rightarrow \Delta =$ - 9 < 0 alors l’équation admet
deux racines complexes conjuguées

$Z_{1} = \frac{- b - i \sqrt{| \Delta |}}{2 a} \Rightarrow Z_{1} = \frac{2 + i - i \sqrt{| - 9 |}}{2} \Rightarrow Z_{1} = \frac{2 + i - 3 i}{2} \Rightarrow Z_{1}$ = 1 - i

$Z_{2} = \frac{- b + i \sqrt{| \Delta |}}{2 a} \frac{2 + i + i \sqrt{| - 9 |}}{2} \Rightarrow Z_{2} = \frac{2 + i + 3 i}{2} \Rightarrow Z_{2}$ = 1 + i

$\frac{\Rightarrow Z_{2} =}{S = { 1 - i ; 1 + 2i }}$

D’où

4ème Cas $si \Delta =$ a + ib $ou \Delta’=$ a + ib($b \neq 0$)

L’équation admet deux racines complexes.

$Z_{1} = \frac{- b - \sqrt{\;} \Delta}{2 a} \Rightarrow Z_{1} = \frac{- b + \sqrt{\;} \Delta}{2 a} ou Z_{1} = \frac{- b’- \sqrt{\;} \Delta’}{a} et Z_{2} = \frac{- b’- \sqrt{\;} \Delta’}{a}$

On cherche les racines carrées de $\Delta ( \sqrt{\Delta}$) soit z la racine carrée de $\Delta$.
On pose z $= \sqrt{\Delta}$ avec z = x + iy

Si $z_{0} et z_{1}$ sont les deux racines carrées opposées se $\Delta$, alors les solutions de l’équations
sont :

$Z_{1} = \frac{- b - z_{0}}{2a} et Z_{2} = \frac{- b + z_{0}}{2a}$

$Z_{1} = \frac{- b + z_{0}}{2a} et Z_{2} = \frac{- b + z_{1}}{2a}$

$Z_{1} = \frac{- b’- z_{0}}{a} et Z_{2} = \frac{- b’+ z_{1}}{a}$

Activité : Résolvons dans $\mathbb{C}$ l’équation suivante :
- 1. $iZ^{2} +$ Z - - 3 + i = 0 avec a = i$;$ b = 1 et c = - 3 + i

$\Delta = b^{2} -$ 4$ac \Rightarrow \Delta$= (1$)^{2} -$ 4(i)(- 3 + i$) \Rightarrow \Delta$= 1 + 12i + 4

$\Rightarrow \Delta$= 5 + 12i

Trouvons les racines carrées de $\Delta$

Posons z $= \sqrt{\Delta}$ avec z = x + iy

|$\Delta$| = 13

$x^{2} + y^{2}$ = 13 (1) $x^{2} + y^{2}$ = 13

{ $x^{2} - y^{2}$ = 5 (2) (1)+(2) {$x^{2} - y^{2}$ = 5

2xy = 12 (3) 2$x^{2}$=18$\Rightarrow x^{2}$ = 9 $\Rightarrow x = \pm$3

- si x = - 3. Remplaçons x dans (3)

.- 6y = 12 $\Rightarrow y$ = - 2 or z = x + $iy \Rightarrow z_{0} =$ - 3 - 2i

- si x = 3. Remplaçons x dans (3)

. 6y = 12 $\Rightarrow y$ = 2 or z = x + $iy \Rightarrow z_{1}$ = 3 + 2iorz $= \sqrt{\Delta \Rightarrow}$

$z_{1} = \sqrt{\Delta}$= 3 + 2i

.$Z_{1} = \frac{- b - \sqrt{\Delta}}{2 a} \Rightarrow Z_{1} = \frac{- b - _{1} z}{2 a} \Rightarrow Z_{1} = \frac{- 1 - 3 - 2 i}{2 i} \Rightarrow Z_{1} = \frac{- 4 - 2 i}{2 i} \Rightarrow$

$Z_{1} =$ - 1 + 2i

$Z_{2} = \frac{- b - \sqrt{\;} \Delta}{2 a} \Rightarrow Z_{2} = \frac{- b + z_{1}}{2 a} \Rightarrow Z_{2} = \frac{- 1 + 3 + 2 i}{2 i} \Rightarrow$

$Z_{2}$

$\frac{= 2 + 2 i \Rightarrow Z_{2} = 1 - i}{S = { - 1 + 2i ; 1 - i }}$

D’où
- Exercice : Résoudre dans $\mathbb{C}$ les équations suivantes

#### 1. $Z^{2} -$ (1 + 4i) Z + 7i - 9 = 0

#### 2. $Z^{2} -$ 4Z + 5 + (Z + 1) 0

$\frac{i}{3} \frac{=}{3}$

#### 3. $Z^{2} -$ 2(1 + $i \sqrt{)}$Z + 2$i \sqrt{\;}$ = 0

#### 4. $Z^{2} -$ 2iZ - 2 = 0

- 3. Résolution du polynôme du 3ème degré à coefficient complexes.
Exemples de résolution
Soit le polynôme défini par :.P(z) = $Z^{3} -$ (11 + 2i$) Z^{2}$ + 2(17 + 7i) Z - 42
- 1. Démontrer qu’il existe un nombre réel $α$ solution de l’équation P(Z) = 0

#### 2. Déterminer le polynôme du second degré tel que :

P(z) = (Z - $α$)($aZ^{2} +$ bZ + c) avec a, b et c des nombres complexes à
préciser.

#### 3. Résoudre dans $\mathbb{C}$ l’équation P(Z) = 0

### Solution

.P(Z) = $z^{3} -$ (11 + 2i$) Z^{2}$ + 2(17 + 7i) Z - 42

#### 7. Démontrons qu’il existe un nombre réel $α$ tel que

P($α$) = 0 $\Rightarrow α^{3} -$ (11 + 2i$) α^{2}$ + 2(17 + 7i)$α$ - 42 = 0

$α^{3} - 11 α^{2} -$ 2$i α^{2}$ + 34$α$ + 14$iα$ - 42 = 0

$α^{3} - 11 α^{2}$ + 34$α$ - 42 = 0 - 2$α$ = 0 $\Rightarrow α$ = 0

$\Rightarrow$ { $\Rightarrow$ {

- $2 α^{2}$ + 14$α$ = 0 $\Rightarrow -$2$α$($α$ - 7) = 0 $α$ - 7 = 0

$α$ = 0 à rejetter

$\Rightarrow$ {

$α$ = 7 à retenir
D’où $α$ = 7 est la solution réelle de P
- 8. $\frac{Déterminons le polynôme du second degré tel que :}{P ( Z ) = ( Z - 7 ) ( aZ^{2} + bZ + c )}$
Schéma de HORNER

|  | 1 | - 11 - 2i | 34 + 14i | - 42 |  |
| --- | --- | --- | --- | --- | --- |
| 7 |  | 7 | - 28 - 14i | 42 | D’où a = 1 ; b = - 4 - 2 i et c = 6 |
|  | 1 | - 4 - 2i | 6 |  |  |

Donc avec

#### 9. Résolvons dans $\mathbb{C}$ l’équation P(Z) = 0

Z - 7 = 0 $\Rightarrow Z_{0}$ = 7

$\Rightarrow ($Z - 7)[$Z^{2} -$ 2(2 + i) Z + 6] = 0 {

$Z^{2} -$ 2(2 + i) Z + 6 = 0
$\Delta’=$ - 3 + 4iTrouvons les racines carrées de $\Delta’$
On pose z² = $\Delta’$ avec z = x + iy

$x^{2} + y^{2}$ = 5 (1) $x^{2} + y^{2}$ = 5

{ $x^{2} - y^{2} =$ - 3(2) (1)+(2) {$x^{2} - y^{2} =$ - 3

2xy = 4 (3) 2$x^{2}$=2$\Rightarrow x = \pm$1

Si x = 1 dans l’équation (3) on a : 2y = 4 or y = 2

or z = x + $iy \Rightarrow z_{0}$ = 1 + 2i $= \sqrt{\Delta}$

$Z_{1} = \frac{- b’- \sqrt{\;} \Delta’}{a} \Rightarrow Z_{1} = \frac{- b’- z_{0}}{a} \Rightarrow Z_{1}$ = 2 + i - 1 - 2$i \Rightarrow Z_{1}$ = 1 - i

$Z_{2} = \frac{- b’+ \sqrt{\;} \Delta’}{a} \Rightarrow Z_{2} = \frac{- b’+ z_{0}}{a} \Rightarrow Z_{2}$ = 2 + i + 1 + 2$i \Rightarrow Z_{2}$ = 3 + 3i

|  | 50 |
| --- | --- |
| { } S = 7 ; 1 - i ; 3 + 3 i |  |

D’où

- 1- Démontrons qu’il existe un nombre imaginaire par ib tel que P(ib) = 0

.$\Rightarrow ( ib )^{3} -$ 2(1 + 2i)($ib )^{2}$ + 7i(ib) + 3 - 9i = 0

.$\Rightarrow - ib^{3}$ + 2$b^{2}$ + 4$i b^{2} -$ 7b + 3 - 9i = 0

$- b^{3}$ + 4$b^{2} -$ 9 = 0

$b_{1}$ = 3 à rétenir
{

2$b^{2} -$ 7b + 3 = 0 $\Rightarrow$ { $\frac{1}{2}$

$b_{2}$ = à rejeter
D’où Z = 3i la solution imaginaire par de P
- 2- $\frac{Déterminons le polynôme du second degré Q tel que :}{2}$
P(z) = (Z - 3i)(aZ + nZ + c)
Trouvons Q(z) = $aZ^{2} +$ bZ + c par le schéma de HORNER

|  | 1 | - 2 - 4i | 7i | 3 - 9i |  |
| --- | --- | --- | --- | --- | --- |
|  |  |  |  |  | D’où a = 1 ; b = - 2 - i et c = 3 + i |
| z_{i} |  | 3i | 3 - 6i | - 3 + 9i |  |
|  | 1 | - 2 - i | 3 + i | 0 |  |

Donc

#### 3- Résolvons dans $\mathbb{C}$ l’équation P(Z) = 0

Z - 3i = 0 $\Rightarrow Z_{0}$ = 3i

.(Z - 3i)[$Z^{2} -$ (2 + i) Z + 3 + i] = 0 $\Rightarrow$ {
$Z^{2} -$ (2 + i) Z + 3 + i = 0
.$\Delta =$ - 9 < 0, L’équation admet deux racines complexes conjuguées

$Z_{1} = \frac{- b - \sqrt{\;} | \Delta |}{2 a} \Rightarrow Z_{1} = \frac{2 + i - i \sqrt{\;} | - 9 |}{2} \Rightarrow Z_{1} = \frac{2 + i - 3 i}{2} \Rightarrow Z_{1}$ = 1 - i

$Z_{2} = \frac{- b + i \sqrt{| \Delta |}}{2 a} \Rightarrow Z_{2} = \frac{2 + i + i \sqrt{| - 9 |}}{2} \Rightarrow Z_{2} = \frac{2 + i + 3 i}{2} \Rightarrow Z_{2}$ = 1 + 2i

| { } S = 3i ; 1 - i ; 1 + 2i |  |
| --- | --- |
|  | 51 |

d’où

### Exercice d’application

On donne P(z) = $Z^{3}$ + 2$i Z^{2}$ + 16i

#### 1- Calculer P(2i)

- 2- Montrer que P(Z) peut s’écrire sous la forme P(z) = (Z - 2i)($aZ^{2} +$ bZ + c)
avec a, b et c trois nombres complexes à préciser.

#### 3- Résoudre dans ⊄ l’équation P(z) = 0

- 4- $Z_{0} , Z_{1} et Z_{2}$ les solutions de cette équation. Donner la nature du triangle

$M_{0} , M_{1} et M_{2}$ d’affixes respectives $Z_{0} , Z_{1} et Z_{2}$ . (voir nombres complexes et

configuration du plan)

### IV. Quelques formules

- 1- Formules d’addition et formules de transformation (voir en annexe)

#### 2- Formule du Binôme de NEWTON

.$\forall ($a, b$) \in \mathbb{R} ^{2} ( n \in \mathbb{N}$)

| n | n ’ C^{P}_{n} = |
| --- | --- |
| ( )^{n} a + b = \sum C^{P}_{n} a^{n-P} b^{P} P = 0 | ( ) P ! n - P ! |

NB :
Les valeurs de $C_{n}^{P}$ sont données par le triangle de PASCAL
n! = n(n - 1)(n - 2)(n - 3) … $\times 2 \times 1$
Triangle de PASCAL

| n | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0 | 1 |  |  |  |  |  |  |  |  |  |
| 1 | 1 | 1 |  |  |  |  |  |  |  |  |
| 2 | 1 | 2 | 1 |  |  |  |  |  |  |  |
| 3 | 1 | 3 | 3 | 1 |  |  |  |  |  |  |
| 4 | 1 | 4 | 6 | 4 | 1 |  |  |  |  |  |
| 5 | 1 | 5 | 10 | 10 | 5 | 1 |  |  |  |  |
| 6 | 1 | 6 | 15 | 20 | 15 | 6 | 1 |  |  |  |
| 7 | 1 | 7 | 21 | 35 | 35 | 21 | 7 | 1 |  |  |
|  |  |  |  |  |  |  |  |  |  | 52 |
| 8 | 1 | 8 | 28 | 56 | 70 | 56 | 28 | 8 | 1 |  |

### V. Nombre complexe et géométrie

#### 1. Application à la trigonométrie

1.1. Expression de cos($nθ$)+ sin($nθ$) sous forme de polynôme de

$cos θ et sinθ$

D’après la formule de Moivre.

($cosθ$ + isinθ$)^{n} =$ cos($nθ$) + isin($nθ$) = $e^{iθ}$

cos($nθ$) est la partie réelle
sin($nθ$) est la partie imaginaire
D’après la formule du Binôme de NEWTON

$n$

($cosθ$ + i$sinθ )^{n} = \sum C_{n}^{P} ( cosθ )^{n-P}$ (isinθ$)^{P}$

P=0
On obtient alors

.cos($nθ$) = $R_{e}$ [$\sum ^{n}_{P} C_{n}^{P} ( cosθ )^{n} -$P(isinθ$)^{P}$ ]

=0

.sin($nθ$) = $I_{m}$ [$\sum ^{n}_{P} C_{n}^{P} ( cosθ )^{n} -$P(isinθ$)^{P}$ ]

=0
Activité :
Exprimons cos4xetsin4x sous forme d’un polynôme de cosxetsinx.
On sait que : (cosx + isinx$)^{4} =$ cos4x + isin4x

Or (cosx + isinx$)^{4} = \sum ^{n}_{P=} C_{4} P$ (cosx$)^{4} -$P(isinx$)^{P}$

.cos4x + isin4x $= C_{4}^{0}$ (cosx$)^{4} -$0(isinx$)^{0} + C_{4}^{1}$ (cosx$)^{3}$ (isinx$)^{1}$ +

$C_{4}$2(cosx$)^{2}$ (isinx$)^{2} + C_{4}$3(cosx)(isinx$)^{3} + C_{4}$4(cosx$)^{0}$ (isinx$)^{4}$

cos4x + isin4x $= cos^{4} x$ + 4$i cos^{3}$ xsinx - 6c$o s^{2} x sin^{2} x$ - 4icosx$sin^{3} x + sin^{4} x$

D’où

| cos4x = cos^{4} x - 6 cos^{2} x sin^{2} x |  |
| --- | --- |
| + sin^{4} x | 53 |
| sin4x = 4cos^{3} x sinx - 4cos sin^{3} x |  |

1.2. Linéarisation
Linéariser c’est transformer un polynôme en cosx et sinx en une somme
de cosinus et sinus des multiples de x.
NB :

$e^{inθ} + e^{-} inθ = 2 cos ( nθ$)

$e^{inθ} - e^{-} inθ$ = 2isin($nθ$)

Activité :

Linéarisons $cos^{4}$ xet$sin^{3} x$

D’après la formule d’EULER

$e^{ix} =$ cos + isinx

$e^{-} ix = cos -$ isinx $ix$

⟹ cosx = $\frac{1}{2} ( e^{ix} + e^{-}$ )

$e^{1} x + e^{-ix}$ = 2cosx

4 4

$cos^{4} x$ = [$\frac{1}{2} ( e^{ix} + e^{-} ix$)] $\Rightarrow cos^{4} x$ = ($\frac{1}{2}$) ($e^{ix} + e^{-} ix )^{4} \Rightarrow cos^{4} x$

= $\frac{1}{16} ( e^{ix} + e^{-ix} )^{4}$

Or ($e^{ix} + e^{-} ix )^{4} = \sum ^{4}_{P} C_{4} P ( e^{ix} )^{4} -$P$( e^{-} ix )^{P} \Rightarrow ( e^{ix} + e^{-ix} )^{4}$ =

=0

$C_{4}^{0} ( e^{ix} )^{4} -$0($e^{-ix} )^{0} + C_{4}^{1} ( e^{ix} )^{3} ( e^{-} ix$) + $C_{4}^{2} ( e^{ix} )^{2} ( e^{-ix} )^{2} + C_{4}^{3} ( e^{ix}$ )($e^{-ix} )^{3}$ +

$C_{4}$4($e^{ix} )^{0} ( e^{-} ix )^{4}$

($e^{ix} + e^{-ix} )^{4} = e^{i4} x$ + 4$e^{i3} x . e^{-} ix$ + 6$e^{i2x} . e^{-} i$2x + 4$e^{ix} . e^{-} i$3x $+ e^{-i4x}$

($e^{ix} + e^{-} ix )^{4} = e^{i4} x + e^{-} i$4x + 4($e^{i2} x + e^{-} i$2x) + 6

($e^{ix} + e^{-} ix )^{4}$ = 2cos4x + 8cos2x + 8or $cos^{4} x = \frac{1}{16} ( e^{ix} + e^{-} ix )^{4}$

⟹ $cos^{4} x = \frac{1}{16}$ [2cos4x + 8cos2x + 6]

cosx+isinx=$e^{ix}$

cosx + isinx = $e^{ix}$ cosx+isinx=- e ix

.x - 1 { $ix \Rightarrow {^{-}}$ 2isinx=$e^{ix} - e^{-} ix$

cos - isinx = $e^{-}$

.⟹ sinx = $\frac{1}{2 i} ( e^{ix} - e^{-} ix ) \Rightarrow$ sinx = $- \frac{1}{2} i ( e^{ix} - e^{-} ix$)

ix 3 3 ix

.$sin^{3} x$ = [$- \frac{1}{2} i ( e^{ix} - e^{-}$ )] $\Rightarrow sin^{3} x$ = ($- \frac{1}{2}$) ($e^{ix} - e^{-} )^{3}$

.$\Rightarrow sin^{3} x = \frac{1}{8} i ( e^{ix} - e^{-} ix )^{3}$ or ($e^{ix} - e^{-ix} )^{3} = \sum ^{3}_{P} ( e^{ix} )^{3} -$P($- e^{-ix} )^{P}$

=0

.($e^{ix} - e^{-} ix )^{3} = C_{3}$0($e^{ix} )^{3} ( e^{-} ix )^{0} + C_{3}$1($e^{ix} )^{2} ( - e^{-} ix$) + $C_{3}$2($e^{ix} )^{2} ( - e^{-ix} )^{2}$ +

$C_{3}^{3} ( e^{ix}$ )($- e^{-} ix )^{3}$

.($e^{ix} - e^{-} ix )^{3} = e^{i3} x$ - $3 e^{i2} x . e^{-} ix$ + 3$e^{ix} . e^{-} i$2x $- e^{-i3} x$

.($e^{ix} - e^{-} ix )^{3} = e^{i3} x - e^{-i} 3$x - 3($e^{ix} - e^{-} ix$)

.($e^{ix} - e^{-} ix )^{3}$ = 2isin3x - 6isinx

Or $sin^{3} x = \frac{1}{8} ix$ - ix 3 3 $\frac{1}{8} 3$x - 6isinx]

$\frac{i ( e - e ) \Rightarrow sin x = i [ 2 isin}{3}$

sin x $= \frac{3}{4}$ sinx $- \frac{1}{4}$ sin3x

#### 2. Nombre complexe et configuration du plan

| Configuration |  |  |  |  | C | aracté risation geométrique | C aracterisation complexe |  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
|  |  |  |  |  |  | A ̂ AB = AC et mes A = α | Z_{C} - Z_{A} = e^{iα} |  |
| Triangle ABC isocèle en A |  | ⃗ | e_{2} ⃗ | ⃗ ⃗ |  | α ( ) 0 < α \leq π | Z_{B} - Z_{A} Ou Z_{C} - Z_{A} iα = e^{-} |  |
|  |  |  |  |  | C | B | Z_{B} - Z_{A} |  |
|  |  |  |  | 0 |  | e_{1} ⃗ ⃗ ⃗ ⃗ | k \neq kπ ( k \in \mathbb{Z} ) |  |
|  |  |  |  |  |  | A \frac{π}{3} ̂ AB = AC et mes A = | Z_{C} - Z_{A} π / 3 = e^{i} |  |
| Triangle ABC équilatéral | e_{2} ⃗ ⃗ ⃗ ⃗ |  |  |  | C | α B | Z_{B} - Z_{A} Ou Z_{C} - Z_{A} π i / 3 |  |
|  |  |  |  |  |  |  | = e^{-} |  |
|  | 0 |  |  |  |  | ⃗ e_{1} ⃗ ⃗ ⃗ | Z_{B} - Z_{A} |  |
|  |  |  |  |  |  | A \frac{π}{2} ̂ AB = AC et mes A = | Z_{C} - Z_{A} = i |  |
| Triangle ABC rectangle et isocèle en A | e_{2} ⃗ ⃗ ⃗ ⃗ |  |  | C |  | α B | Z_{B} - Z_{A} Ou Z_{C} - Z_{A} = - i |  |
|  | 0 |  |  |  |  | ⃗ e_{1} ⃗ ⃗ ⃗ | Z_{B} - Z_{A} |  |
| Triangle ABC | e_{2} ⃗ ⃗ ⃗ ⃗ |  |  |  | B | \frac{π}{2} \frac{π}{2} ̂ mes A = ou - | Z_{C} - Z_{A} = ib |  |
| rectangle en A |  |  |  |  | A | C | Z_{B} - Z_{A} ( ) b \in \mathbb{R} ^{∗} |  |
|  | 0 |  |  |  |  | ⃗ e_{1} ⃗ ⃗ ⃗ |  |  |
| Points A , B , C alignés | e_{2} ⃗ ⃗ ⃗ ⃗ |  |  |  |  | ̂ ⃗ ⃗ ⃗ ⃗ ⃗ ⃗ ⃗ ⃗ ⃗ ⃗ ⃗ ⃗ mes ( AB , AC ) = 0 ou π | Z_{C} - Z_{A} \in \mathbb{R} ^{∗} |  |
|  |  |  |  |  |  |  | Z_{B} - Z_{A} |  |
|  | 0 |  |  |  |  | ⃗ e_{1} ⃗ ⃗ ⃗ |  |  |
| Points ABC et D |  |  |  |  |  | ̂ ̂ ⃗ ⃗ ⃗ ⃗ ⃗ ⃗ ⃗ ⃗ ⃗ ⃗ ⃗ ⃗ ⃗ ⃗ ⃗ ⃗ ⃗ ⃗ ⃗ ⃗ ⃗ ⃗ ⃗ ⃗ ⃗ A mes ( AB , AC ) = mes ( DA , DB ) = 0 ⃗ ⃗ ⃗ ⃗ ⃗ ⃗ ⃗ ⃗ ⃗ ⃗ ⃗ ⃗ ( ) mes ( CA , CB ) \neq 0 π | Z_{C} - Z_{B} |  |
| cocycliques | e_{2} ⃗ ⃗ ⃗ ⃗ |  |  |  |  |  | Z_{C} - Z_{A} \in \mathbb{R} ^{∗} |  |
|  |  |  |  |  |  |  | Z_{D} - Z_{B} |  |
|  |  |  |  |  | C | B | Z_{D} - Z_{A} |  |
|  |  | 0 |  |  |  | ⃗ e_{1} ⃗ ⃗ ⃗ |  | 56 |

- 3. Ecritures complexes des transformations ponctuelles(spécial TBG)
3.1. Définition
On appelle transformation ponctuelle associée aux nombres complexes
toute transformation de la forme Z’= aZ + b ou a et b sont des
nombres complexes avec $a \neq 0$
3.2. Nature et éléments caractéristique des transformations ponctuelles
3.2.1. Similitude Plane directe
Z’= aZ + b est une Similitude Plane directe si $a \in \mathbb{C} ^{∗}$ et |a| $\neq 1$
Les éléments caractéristiques sont :
Le rapport k = |a|
L’angle : $θ$ = arg(a)
Le centre est l’unique point invariant.

On pose Z’= $Z \Rightarrow Z$ = aZ + $b \Rightarrow Z$ - aZ = $b \Rightarrow$ (1 - a) Z = $b \Rightarrow$

$Z = \frac{b}{1 - a}$

posons $Z = ω$

Donc $ω$ est l'affixe du centre $\Omega$, est la solution unique

$ω = \frac{b}{1 - a}$

D’où

Activité 1 :
Caractérisons la transformation ponctuelle définie par : Z’= (1 - i) Z + 2i
L’écriture complexe est de la forme Z’= aZ + b avec a = 1 - i et b = 2 - i
$a \in \mathbb{C} ^{∗}$ , alors il s’agit d’une similitude plane directe de rapport k = |a| = $\sqrt{\;}$2 et
d’angle

$cosθ = \sqrt{2}$

Arg.(a) { ⟹ $θ$ = $- \frac{π}{4}$ [2$π$]

$sinθ = - \sqrt{2}$

Le centre est l’unique point invariant $ω = \frac{b}{1 - a}$

.$ω = \frac{2 - i}{1 - 1 + i} \Rightarrow ω = - 1 - 2 i$

$- 1$

D’où $Ω$( )

$- 2$

Activité : 2
Caractérisons la transformation ponctuelle définie par Z’$= \frac{1}{2} iZ$ + 1 $- \frac{1}{2} i$
L’écriture complexe est de la forme z’= aZ + b avec a $= \frac{1}{2} i$ et b = 1 $- \frac{1}{2} i$
$a \in \mathbb{C} ^{∗}$ alors il s’agit d’une similitude plane directe de rapport k = |a| = $\frac{1}{2}$
L’angle est l’argument de a = - 1

{cos $θ$ = 0 ⟹ $θ = \frac{π}{2}$ [2$π$]

sin $θ$ = 1
Le centre $Ω$est l’unique point invariant d'affixe$ω = \frac{b}{1 - a}$

| 1 Ω ( ) |  |
| --- | --- |
| 0 | 58 |

..$ω = \frac{1 - 1 2 i}{1 - 1 2 i} \Rightarrow ω$ = 1 D’où

### Exercice :

Soit Z’= 2iZ + 1 - 2i l'écriture complexe d'une transformation ponctuelle

#### 1. Caractériser cette transformation ponctuelle.

#### 2. Donner les éléments caractéristiques.

3.2.2. Translation
.Z’= aZ + b est une translation si a = 1 $\Rightarrow Z’$ = Z + b
L’élément caractéristique est le vecteur de la translation v⃗ d’affixe b

$R_{e} ( b$)

⃗v⃗⃗ ( )

$I_{m} ( b$)

Activité :
Déterminons les éléments caractéristiques de la transformation de l’écriture
complexe Z’= Z + 3 - i.
L’écriture complexe est de la forme = aZ + b avec a = 1 et b = 3 - i. Il s’agit

$\frac{Z’}{3}$

d’une translation du vecteur
v⃗⃗ ⃗ ( )

$- 1$

3.2.3. Homothétie
.
Z’= aZ + b est une homothétiesi $a \in \mathbb{R} -$ {1}
Les éléments caractéristiques sont :
Le rapport $k = a$

$R_{e} ( \frac{b}{\frac{1 - b a}{1 - a}}$)

Le centre est $Ω$ [ ]

$I_{m}$ ( )

Activité
Déterminons les éléments caractéristiques de la transformation ponctuelle
l’écriture complexe Z’= - Z + 2i
L’écriture complexe est de la forme Z’= aZ + b avec a = 1. Il s’agit d’une

homothétie de centre $ω = \frac{b}{1 - a}$

$\frac{2 i}{1 + 1} \frac{2 i}{2}$ 1

.$\Rightarrow ω = \Rightarrow ω = \Rightarrow ω$ = i D’où $\Omega$( )

Le rapport k = a = - 1
3.2.4. Rotation
.Z’= aZ + b est une rotation si $a \in \mathbb{C} ^{∗}$ et |a| = 1

$R_{e} ( \frac{b}{\frac{1 - b a}{1 - a}}$)

- Le centre est $Ω$ [ ]

$I_{m}$ ( )

- L’angle est l’argument de a
Activité
Déterminons les éléments caractéristiques de l’écriture complexe

Z’= ($\frac{1}{2} + \frac{i \sqrt{\;} 3}{2} )$ Z + 2i

L’écriture complexe est de la forme Z’= aZ + b avec a $= \frac{1}{2} + \frac{i \sqrt{3}}{2}$ zet b = 2i
2 2

1 $\sqrt{2}$3 1 $\frac{3}{4}$

|a| = $\sqrt{2}$( ) + ( ) $\Rightarrow$ |a| = $\sqrt{4} + \Rightarrow$ |a| = $\sqrt{1 \Rightarrow}$ |a| = 1

Alors il s’agit d’une rotation dont l’unique point invariant est

$\frac{b}{1 - a} \frac{2 i}{1 - 1 2 - \frac{i \sqrt{\;} 3}{2}} 4$i(1+$i \sqrt{3}$)

$\Rightarrow ω = \Rightarrow ω = \Rightarrow ω = \Rightarrow ω$ = (1+i )(1- i $) \Rightarrow ω$ = $- \sqrt{\;}$3 + i

$\frac{1 - 2 i i \sqrt{\;} 3}{2} \sqrt{3} \sqrt{3}$

D’où

$cosθ = \frac{1}{2}$

L’angle arg.(a) { ⟹ $θ = \frac{π}{3}$ [2$π$]

$sinθ = - \sqrt{2}$

### Exercice 1(spéciale BG)

- 1. Résous dans $\mathbb{C}$ l’équation :$Z^{3}$ + (4 - 4i$) Z^{2} -$ 12iZ - 8 - 8i = 0 sachant
qu’elle admet une solution réelle et une solution imaginaire pure.
- 2. On considère dans le plan complexe muni d’un repère (o$, e_{1}$⃗ ⃗ ⃗ ⃗ , $e_{2}$⃗ ⃗ ⃗ ⃗ ) les points
A, B et C d’affixes respectives $Z_{A}$ = 2i$; Z_{B} =$ - 2 + 2i $et Z_{C} =$ - 2
- a. Calcule $\frac{Z_{A} - Z_{B}}{Z_{C} - Z_{B}}$ en déduire la nature du triangle ABC.
- 3. Soit S la similitude plane directe telle que : S(A) = B et S(B) = C
- a. Détermine l’expression complexe de S et détermine ses éléments
caractéristiques.

### Exercice 2

On donne les nombres complexes suivants :

U = ($\sqrt{3}$ - 1) + i$( \sqrt{\;}$3 + 1) et V = 1 - $i \sqrt{\;}$3

#### 1. Détermine le module et un argument de V

- 2. On pose = $\frac{U}{V}$ . Ecrire Z sous forme algébrique et sous la forme
trigonométrique.
- 3. En déduire le module et un argument de U ainsi que les valeurs

exactes de $cos \frac{5 π}{12} et sin \frac{5 π}{12}$

#### 4. Ecriture complexe de transformation (suite)

Nous indiquons dans le tableau ci-dessous l’écriture complexe de certaines
transformations du plan.
Dans ce tableau, M(Z) et M’(Z’) désignent un point et son image ainsi que leurs affixes,
par chacune de ces transformations.

| Transformation |  |  |  |  | Image | M ’ d’un point | M | Définition géométrique | Ecriture complexe |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Translation de vecteur u ⃗ ⃗ ( a ) | ⃗ ⃗ | e_{2} ⃗ ⃗ |  |  |  |  |  | ⃗ ⃗ ⃗ ⃗ ⃗ ⃗ ⃗ ⃗ ⃗ ⃗ MM ’ = u ⃗ ⃗ | Z’ = Z + a |
|  | 0 |  |  |  |  | ⃗ e_{1} ⃗ ⃗ ⃗ |  |  |  |
| Symétrie de centre \Omega ( ω ) |  |  |  |  |  |  |  | ⃗ ⃗ ⃗ ⃗ ⃗ ⃗ ⃗ ⃗ ⃗ ⃗ ⃗ ⃗ ⃗ ⃗ ⃗ ⃗ \Omega M ’ = - \Omega M | ( ) Z’ - ω = - Z - ω |
|  | 0 | e_{2} ⃗ ⃗ | ⃗ ⃗ |  | ⃗ | e_{1} ⃗ ⃗ ⃗ |  |  |  |
| Symétrie par rapport |  |  |  |  |  |  | M | O M’ = OM { | Z ’ = Z |
|  |  |  |  |  |  |  |  | ̂ ̂ |  |
| à l’axe réel | 0 | ⃗ ⃗ | e_{2} ⃗ ⃗ |  |  | ⃗ e_{1} ⃗ ⃗ ⃗ | M’ | ⃗ ⃗ ⃗ ⃗ ⃗ ⃗ ⃗ ⃗ ⃗ ⃗ ⃗ ⃗ ⃗ ⃗ (_{1} e ⃗ ⃗ ⃗ ⃗ , OM ) = - ( e_{1} ⃗ ⃗ ⃗ ⃗ , OM ) |  |
| Symétrie p ar rapport |  |  |  |  |  | M |  |  |  |
| à l’axe imaginaire |  | M’ |  | ⃗ | e_{2} ⃗ ⃗ ⃗ |  |  | O M’ = OM { ̂ ̂ ⃗ ⃗ ⃗ ⃗ ⃗ ⃗ ⃗ ⃗ ⃗ ⃗ ⃗ ⃗ ⃗ ⃗ ⃗ ⃗ ( e_{1} ⃗ ⃗ ⃗ ⃗ , OM ’ ) = - ( e_{1} ⃗ ⃗ ⃗ ⃗ , OM ) | Z ’ = - Z |
|  |  |  |  |  | 0 | ⃗ e_{1} ⃗ ⃗ ⃗ |  |  |  |
| Homothétie de centre \Omega ( ω ) et de rapport k | e_{2} ⃗ ⃗ ⃗ ⃗ |  |  |  |  |  |  | ⃗ ⃗ ⃗ ⃗ ⃗ ⃗ ⃗ ⃗ ⃗ \Omega M ’ = k \Omega M | Z’ - ω = k ( Z - ω ) |
|  |  |  | 0 |  |  | ⃗ e_{1} ⃗ ⃗ ⃗ |  |  |  |
| Rotation de ce ntre \Omega ( ω ) et d’angle α | e_{2} ⃗ ⃗ ⃗ ⃗ |  |  |  |  | α |  | \Omega M’ = \Omega M { ̂ ⃗ ⃗ ⃗ ⃗ ⃗ ⃗ ⃗ ⃗ ⃗ ⃗ ⃗ ⃗ ⃗ ⃗ ⃗ ⃗ [ ] Mes ( \Omega M , \Omega M ’ ) = α 2 π | ( ) Z’ - ω = e^{iα} Z - ω ou z ’ - ω = e^{iα} |
|  |  |  |  |  |  |  |  |  | z - ω |
|  |  |  |  |  |  | ⃗ e_{1} ⃗ ⃗ ⃗ | M’ |  |  |

Tableau trigonométrique des valeurs utiles

| 0 | 0 0° | π / 6 30° | π / 4 45° | π / 3 60 ° | π / 2 90° | 2 π / 3 120° | 3 π / 4 135° | 5 π / 6 150° | π 180° | 7 π / 6 210° | 5 π / 4 225° | 4 π / 3 240° | 3 π / 2 270° | 5 π / 3 300° | 7 π / 4 315° | 11 π / 6 330° | 2 π 360° |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| sinθ | 0 | 1 / 2 | 2 \sqrt / 2 | 3 \sqrt / 2 | 1 | 3 \sqrt / 2 | 2 \sqrt / 2 | 1 / 2 | 0 | - 1 / 2 | - 2 \sqrt / 2 | - 3 \sqrt / 2 | - 1 | - 3 \sqrt / 2 | - 2 \sqrt / 2 | - 1 / 2 | 0 |
| cosθ | 1 | 3 \sqrt / 2 | 2 \sqrt / 2 | 1 / 2 | 0 | - 1 / 2 | - 2 \sqrt / 2 | - 3 \sqrt / 2 | - 1 | - 3 \sqrt / 2 | - 2 \sqrt / 2 | - 1 / 2 | 0 | 1 / 2 | 2 / 2 | 3 \sqrt / 2 | 1 |
| tanθ | 0 | 3 \sqrt / 3 | 1 | \sqrt 3 |  | - \sqrt 3 | - 1 | - 3 \sqrt / 3 | 0 | 3 \sqrt / 3 | 1 | \sqrt 3 |  | - \sqrt 3 | - 1 | - 3 \sqrt / 3 | 0 |
| cotanθ |  | \sqrt 3 | 1 / 2 | 3 \sqrt / 3 | 0 | - 3 \sqrt / 3 | - 1 | - \sqrt 3 |  | \sqrt 3 | 1 | 3 \sqrt / 3 | 0 | - 3 \sqrt / 3 | - 1 | - \sqrt 3 |  |

Principales relations

$\frac{π}{2} \frac{sinθ}{cosθ} . sin^{2} θ + cos^{2} θ$ = 1

.Pour tout $θ \neq ( π$) > $tanθ$ =

.1 + $tan^{2} θ = \frac{1}{cos^{2} θ}$

.Pour tout $θ \neq$ 0($π$) > $cotanθ = \frac{cosθ}{sinθ}$

. 1 + $cotan^{2} θ = \frac{1}{sin^{2} θ}$

.Pour tout $θ \neq$ 0 ($\frac{π}{2}$) > $tanθ = \frac{1}{cotanθ} et$ cotan $= \frac{1}{t anθ}$

| ( ) sin - θ = - sinθ | ( ) cos - θ = cosθ | ( ) tan - θ = - tanθ | ( ) cotan - θ = - cotanθ |
| --- | --- | --- | --- |
| ( ) sin θ + π = - sinθ | ( ) cos θ + π = - cosθ | ( ) tan θ + π = tanθ | ( ) cotan θ + π = cotanθ |
| ( ) sin π - θ = sinθ | ( ) cos π - θ = - cosθ | ( ) tan π - θ = - tanθ | ( ) cotan π - θ = - cotanθ |
| \frac{π}{2} sin ( θ + ) = cosθ | \frac{π}{2} cos ( θ + ) = - sinθ | \frac{π}{2} tan ( θ + ) = - cotanθ | \frac{π}{2} cotan ( θ + ) = - tanθ |
| \frac{π}{2} sin ( - θ ) = cosθ | \frac{π}{2} cos ( - θ ) = sinθ | \frac{π}{2} tan ( - θ ) = cotanθ | \frac{π}{2} cotan ( - θ ) = tanθ |

| π / 4 |  |  | 2 2 \sqrt{2} / 2 |  | π / 4 |
| --- | --- | --- | --- | --- | --- |
|  |  |  | 1 / 2 |  |  |
| 2 / 3 \sqrt - | 2 / 2 \sqrt - | - 1 / 2 | sin co s | 1 / 2 | \sqrt{2} / 2 |
|  |  |  | - 1 / 2 |  |  |
|  |  |  | - \sqrt{2} / 2 |  |  |
| π / 4 |  |  | - \sqrt{3} / 2 |  | 7 |

2$π / π π$

3 $/ \sqrt{3}_{/} /$3

5$π / π$

6 $/$6

$\sqrt{3} /$

$π$ 2 2$π$

7$π /$

6 11$π /$

$π / = - \frac{π}{4}$

4$π / 5 π$

3 $/$3

3$π /$

Formules d’addition Formules de duplication

| ( ) cos θ + θ ’ = cosθ . cos θ’ - sinθ . sinθ ’ | ( ) cos θ - θ ’ = cosθ . cos θ’ + sinθ . sinθ ’ | cos 2 θ = cos^{2} θ - sin^{2} θ | 1 + cos 2 θ cos^{2} θ = |
| --- | --- | --- | --- |
|  |  |  | 2 |
| ( ) sin θ + θ ’ = sinθ . cos θ’ + cosθ . sinθ ’ | ( ) sin θ - θ ’ = sinθ . cos θ’ - cosθ . sinθ ’ | cos 2 θ = 2 cos^{2} θ - 1 | 1 - cos 2 θ sin^{2} θ = |
|  |  |  | 2 |
| tanθ + tanθ ’ | tanθ - tanθ ’ ( ) an θ - θ ’ = |  | 2 tanθ tan 2 θ = |
| ( ) tan θ + θ’ = |  | cos 2 θ = 1 - 2 sin^{2} θ |  |
| 1 - tanθ . tanθ ’ | 1 + tanθ . tanθ ’ |  | 1 tan^{2} θ |
|  |  | sin 2 θ = 2 sinθ . cosθ |  |

| Transformation de somme en produit | Transformation de produit en somme |
| --- | --- |
| Etant donnée p et q réels | Etant donnée des réels θ et θ ’ |
| p + q p - q cosp + cosq = 2 cos . cos | 1 |
| 2 2 | [ ( ) ] cosθ . cos θ’ = cos θ - θ’ + cos ( θ + θ’ ) 2 |
| p + q p - q cosp - cosq = - 2 sin . sin | 1 [ ( ) ] sinθ . sin θ’ = cos θ - θ’ - cos ( θ + θ’ ) |
| 2 2 | 2 |
| p + q p - q sinp + sinq = 2 sin . cos | 1 [ ( ) ] sinθ . cos θ’ = sin θ - θ’ + s in ( θ + θ’ ) |
| 2 2 | 2 |
| p + q p + q sinp - sinq = 2 sin . cos |  |
| 2 2 |  |

Tangente de l’angle moitié

| Etant donné α réel, \frac{α}{2} \frac{α}{2} 1 + cosα = 2 cos^{2} 1 - sinα = 2 sin^{2} | \frac{π}{2} \frac{α}{2 ,} ( ) Pour tout α \neq π 2 π et α \neq ( π ) , en posant t = tan 2 t 2 t 1 - t^{2} tanα = sinα = cosα = |
| --- | --- |
|  | 1 - t^{2} 1 + t^{2} 1 + t^{2} |

Equations trigonométriques

| α est un élément donné de l’ensemble | Equation : x \in R | Les solutions de l’équation |
| --- | --- | --- |
| R | sinx = sinα | α + 2 kπ et π - α + 2 kπ , avec kε \mathbb{Z} |
| R | cosx = cosα | α + 2 kπ - α + 2 kπ , avec kε \mathbb{Z} |
| π R - { + kπ } | tanx = tanα | α + kπ , avec kε \mathbb{Z} |
| 2 |  |  |
| { } R - 0 + kπ | cotanx = cotanα | α + kπ , avec kε \mathbb{Z} |

### FICHE N° 3

Thème : PRIMITIVES ET CALCUL INTEGRAL
OBJECTIF GENERAL : Réaliser des activités diverses
OBJECTIF SPECIFIQUE : Calculer les intégrales d’une fonction continue.
DUREE DE LA SEQUENCE DE L’ENSEIGNEMENT/D’APPRENTISSAGE : 10 h
PLAN DU COURS

### I. Primitive

#### 1. Définition

#### 2. Théorèmes

#### 3. Tableau des primitives usuelles

### II. Intégrales d’une fonction continue

#### 1. Définition

#### 2. Propriétés

#### 3. Méthodes d’intégration

##### a) Intégration par parties

##### b) Intégration par changement de variable

##### c) Intégration par décomposition

### III. Application au calcul d’aire

### Exercice d’entraînement

## CHAPITRE 3 : PRIMITIVES ET CALCUL INTEGRAL

### I. PRIMITIVES

#### 1. Définition

Soit f une fonction continue sur un intervalle I de $\mathbb{R}$.F est une fonction
dérivable sur I.
On dit que F est une primitive de f sur I si et seulement si :

$\forall x \in I$, F’(x) = f(x)

Exemple :
Montrer que F(x) = $x^{3}$ + 3$x^{2} -$ 5x + 20 est la primitive de
f(x) = 3$x^{2}$ + 6x - 5
En effet, pour tout $xε \mathbb{R} ,$ F’(x) = 3$x^{2}$ + 6x - 5 = f(x)

#### 2. Théorèmes :

Théorème 1 :
Toute fonction continue sur l’intervalle I admet au moins une
primitive sur cet intervalle
Elle est de la forme :
F(x) + C où C’est une constante arbitraire.
Théorème 2 :
Si F est une primitive de F sur I, alors toute autre primitive G de
f sur I s’écrit de manière unique

$\forall x \in I$ G(x) = F(x) + C

Théorème 3 :
Si $x_{0}$ et $y_{0}$ sont deux réels donnés, il existe une unique primitive F
elle que :

F$( x_{0}$ ) = $y_{0}$

#### 3. Tableau des primitives des fonctions usuelles

| Fonctions f | Primitives F |
| --- | --- |
| a , ( a \in \mathbb{R} ) | ax + C |
|  | + 1 x^{n} + C |
| x^{n} , ( n \neq - 1 ) | n + 1 |
| a , ( n \neq 1 ) | a - + C |
| x^{n} | - 1 ( n - 1 ) n^{n} |
| ( ax + b )^{n} , ( n \neq - 1 ) | + 1 1 ( ax + b )^{n} + C |
|  | a n + 1 |
| U’ U^{n} , ( n \neq - 1 ) | + 1 U^{n} + C |
|  | n + 1 |
| U ’ | 1 - + C |
| , ( n \neq - 1 ) |  |
| U^{n} | - 1 ( n - 1 ) U^{n} |
| U ’ |  |
| U \sqrt | 2 \sqrt U + C |
| U ’ e^{U} | e^{U} + C |
| U ’ |  |
| U | \| \| ln U + C |
| ( ) cos ax + b , ( a \neq 0 ) | \frac{1}{a} ( ) sin ax + b + C |
| ( ) sin ax + b , ( a \neq 0 ) | \frac{1}{a} ( ) - cos ax + b + C |
| 1 + t g^{2} x | ( ) tg x + C |
| 1 + cot g^{-2} x | - coygx + C |

### Exercice n°1 :

Trouver les primitives de fonctions suivantes :

#### 1. f(x) = 4$x^{3} - 6 x^{2}$ + 4x + 19

#### 2. f(x) = $\frac{1}{2} x^{4}$ + 5$x^{3} - 4 x^{2} +$ x + 1

### Exercice n°2 :

- 1. Trouver toutes les primitives de la fonction f(x) = 3$x^{2}$ + 2x + 4
- 2. Déterminer ensuite celle qui prend la valeur 8 pour x = - 2

### II. INTEGRALE D’UNE FONCTION CONTINUE

#### 1. Définition

Soit F une primitive de f continue sur I = [a$;$ b] sur intervalle de $\mathbb{R}$.
L’intégrale de f sur [a$;$ b] se note :

$b$

$\int f$(x) dx = [F(x$) ]^{b}_{a} =$ F(b) - F(a)

$a$

#### 2. Propriétés

Soit f et g deux fonctions continues sur un intervalle I = [a$;$ b], et C sont
des éléments de I
b ( ) a ( )

P1 : $\int a$ f x dx = $- \int b$ f x dx

a ( )
P2 : $\int a$ f x dx = 0
b ( ) b ( )

P3 : $\int a$ Kf x dx = $K \int a$ f x dx où $K \in \mathbb{R}$

b( )( ) b ( ) b ( )

P4 : $\int a$ f + g x dx $= \int a$ f x dx $+ \int a$ g x dx

b ( ) c ( ) c ( )
P5 : $\int a$ f x dx $+ \int b$ f x dx $= \int a$ f x dx(relation de Charles)
[ ] b ( )

P6 : sif $\geq$ 0 sur a$;$ b , alors $\int a$ f x $dx \geq$ 0

[ ] b ( ) b ( )

P7 : sif $\leq g$sur a$;$ b , alors $\int a$ f x $dx \leq \int a$ g x dx

b ( ) b ( )

P8 : |$\int a$ f x dx| $\leq \int a$ |f x |dx

P9 : Soit f une fonction bornée sur [a, b] telle que

$m \leq f$(x$) \leq M$, Alors :

$b$

m(b - a$) \leq \int f$(x)$dx \leq M$(b - a) ⟺

$a$

$b$

$m \leq \frac{1}{b - a} \int f ( x ) dx \leq M$

$a$

$\frac{1}{b - a} b$ ( )

D’où le réel $\int a$ f x dx est appelé valeur moyenne de
f sur [a ; b]
P10 : Soit f une fonction continue sur un intervalle I symétrique
par rapport à 0 pour tout élément de I on a :
a ( ) a ( )
Si f est paire$\int -$a f x dx = $2 \int b$ f x dx
Exemple :

$\frac{π}{2} \frac{π}{2}$

$\int$ cos 3x = 2 $\int$ cos 3xdx

$- \frac{π}{2}$ 0

a ( )
Si f est impaire$\int -$a f x dx = 0
Exemple :

$π$

$\int$ sin xdx = 0

$- π$

#### 3. Méthode d’intégration

##### a. Intégration par parties

Soit U et V deux fonction dérivables sur un intervalle I telles
que les dérivées U’et V’sont continues sur I. a et b sont deux
élément de I , on a :
b ( ) ( ) ( ) ( ) b ( ) ( )

$\int a$ U’x V x dx = [U x V $x ]^{b}_{a} - \int a$ U x V’x dx

b ( ) ( ) ( ) ( ) b ( ) ( )

$\int a$ U x V’x dx = [U x V $x ]^{b}_{a} - \int a$ U’x V x dx

Exemple :

$e$ lne

Calculer $I_{1} = \int$1 xlnxdx ; $I_{2} = \int$0 (- 2x + 3)$e^{-2x} dx$ ;

##### b. Intégration par changement de variable

Exemple :

$I_{1} = \int \frac{x^{2}}{x^{3} + 2} dx$ ;

$I_{2} = \int \frac{x}{x^{2} + 1} dx$ ;

1 $\sqrt{\;}$

1 2

$I_{3} = \int ($x + 2)$e^{x}$ +4x+3dx

##### c. Intégration par décomposition

Déterminer a et b tels que : $\frac{2 x + 4}{x + 3} =$ a $+ \frac{b}{x + 3} ou x \neq -$3

2 $\frac{2 x + 4}{x + 3}$

Calculer $I = \int 1 dx$

Exemple 2 :

Déterminer a, b et c tels que : $\frac{1}{x ( x^{2} + 1 )} = \frac{a}{x} + \frac{bx + c}{x^{2} + 1}$

3 $\frac{1}{x ( x^{-} 2 + 1 )}$

Calculer $I = \int 1 dx$

### III. Application au calcul d’aire

- 1. Calculer l’aire limitée par la courbe (C) de f, l’axe des abscisses et les
droites d’équation x = a et x = b. avec b > a

$1^{er}$ cas : Si la courbe (C) de f est au-dessus de l’axe des abscisses.
y
(C)
A
x’a 0 b x
y’

On écrit $a \leq x \leq b ; 0 \leq y \leq f$(x)

$b$

$A = \int f ( x ) dx U_{a}$

$a$

$2^{ème}$ cas : Si la courbe (C) de f esten-dessous de l’axe des abscisses.
y
A
x’a 0 b x
y’

On écrit $a \leq x \leq b ; f ( x ) \leq y \leq 0$

$b$

$A = - \int f ( x ) dx . ua$

$a$

- 2. Calculer l’aire limitée par la courbe (C) de f, l’asymptote oblique et les
droites d’équations x = a et x = b.

$1^{er}$ cas : Si la courbe (C) de f est au-dessus de l’asymptote oblique y = ax + b

$y$

(C)

$A$

$b$

$x’0 x$

$a$

$y’$

$a \leq x \leq b b$

On écrit : { A $= \int a$ (f(x) - y) dx. u. a

0 $\leq y \leq f$(x)

$2^{e}$ cas : Si la courbe (C) de f est en-dessous de l’asymptote oblique

$y = ax + b$

$y$

A

$a b x$

$x’$

$A$

(C)

$y’$

$a \leq x \leq b b$

On écrit : { A $= \int a$ (y - f(x)) dx. ua

0 $\leq y \leq$ 0

Calculer l’aire de la partie du plan limitée par la courbe (Cf) et la courbe ($C_{g}$ )
représentation graphiques dans un repère (0, i⃗ , j⃗ ) des fonctions f et g continues sur [a, b]
et les droites d’équation $x = a et x = b$
Soit la courbe ($C_{f}$ ) est au-dessus de la courbe ($C_{g}$ )⟹ (g < f)

$y ( C_{g}$ )

$A ( C f$)

$x’a 0 b x$

$y’$

$a \leq x \leq b b$

On écrit : { A $= \int a$ (f(x) - y) dx u. a

$0 \leq y \leq f ( x$)

Remarque :

##### u. a = unité d’aire

Si le repère orthonormé (0, i⃗ , j⃗ ) a pour unité 1cm, alors on :

##### u. a = 1$cm \times 1$cm = 1$cm^{2}$

Si le repère orthonormé 0, i⃗ , j⃗ ) a pour unité 2cm, alors on :

##### u. a = 2$cm \times 2$cm = 4$cm^{2}$

### EXERCICE D’ENTRAINEMENT

### Exercice n°1 :

Soit la fonction f définie par : f(x) = $\frac{1}{2} x$ + ln(x - 1)

#### 1. Calculer la dérivée f’(x)

3 $\frac{x + 1}{4 ( x - 1 )}$

#### 2. En déduire I $= \int 2$ dx

### Exercice n°2 :

$\frac{π}{0 2} \frac{π}{0 2}$

On pose : I $= \int ( e^{x}$ cos $x )^{2} dx ;$ J $= \int ( e^{x}$ sin $x )^{2} dx$

#### 1. Calculer I + J puis I - J

#### 2. En déduire les valeurs de I et J

### Exercice n°3 :

$\frac{π}{0 4} \frac{π}{0 4}$

On considère les intégrales : A $= \int sin^{2} x cos^{4}$ xdx et B $= \int cos^{2} x cos^{4}$ xdx

Calculer A + B $;$ A - B puis A et B

### Exercice n°4 :

$\frac{π}{0 4} \frac{π}{0 4}$

On pose I $= \int cos^{3}$ xdx et J $= \int sin^{3}$ xcosxdx

#### 1. CalculerI + J $;$ I – J

#### 2. En déduire la valeur de I et J

### Exercice n°5 :

$\frac{π}{0 2} \frac{π}{0 2}$

On donne : A $= \int x^{2} cos^{2}$ xdx ; B $= \int x^{2} sin^{2}$ xdx ;

Calculer A + B$;$ A - Bpuis A et B

### Exercice n°6 :

On pose : $I_{n} = \int 0 x^{n} e^{x} dx ; \forall n \in \mathbb{N}$

#### 1. Calculer $I_{0} et I_{1}$

- 2. Trouver une relation de récurrence entre $I_{n}$ et $I_{n+1}$ En déduire $I_{5}$ .

### Exercice n°7 :

$\frac{π}{0 2} \frac{π}{0 2}$

Soit : I= $\int e^{2x} c os^{2}$ xdx ; J= $\int e^{2x} sin^{2}$ xdx ;

#### 1. Calculer I + J

#### 2. Soit f(x) = $\frac{1}{4} e^{2x} ($cos2x + sin2x)

- 3. Trouver une relation de récurrence entre $I_{n}$ et $I_{n+1}$ En déduire $I_{5}$ .

##### a. Calculer f’(x). En déduire I – J

##### b. Calculer I et J

### Exercice n°8 :

Soit : $I_{n} = \int 0 x^{n} \sqrt{1}$ - x dx ;

Démontrer que : (2n + 5$)_{n+1} I$ = 2(n + 1$)_{n} I$

### Exercice n°9 :

$\frac{π}{0 2} \frac{cos x}{1 + 2 sinx} \frac{π}{0 2} \frac{sin 2 x}{1 + 2 sinx}$

On donne : I $= \int dx$ ; J= $\int dx$ ;

Soit $K = I + J$

##### a) Calculer K puis I

##### b) En déduire J

### Exercice n°10 :

Soit la fonction f définie par f(x) = $\frac{5 x^{4} + x^{2} + 3}{x^{2}}$

- 1) Monter que pour $x \neq$ 0, f(x) = 5$x^{2}$ + 1 + $\frac{3}{x^{2}}$

#### 2) Déterminer la primitive F et f qui s’annuel pour x = 2

### Exercice n°11 :

1$\frac{x}{1 + x^{-} 2}$

#### 1. Calculer $I_{1} = \int 0$ dx

1 $\frac{x^{3}}{1 + x^{-} 2}$

#### 2. Soit $I_{2} = \int 0$ dx

Calculer $I_{1} + I_{2}$ . En déduire la valeur de $I_{2}$ .

### Exercice n°12 :

$\frac{π}{0 2} \frac{π}{0 2} \frac{π}{0 2}$

On donne : I $= \int cos^{4}$ xdx ; J $= \int sin^{4}$ xdx ; K $= \int 2 sin^{2} cos^{2}$ xdx

#### 1. Calculer I – J et I + J + K

#### 2. Exprimer cos(4x) en fonctionde cos xet sin x

#### 3. En déduire I + J - 3K puis I, J et K.

### Exercice n°13 :

1 $\frac{- 2 n}{2 n + 1}$

Soit: $I_{n} = \int -$1($x^{2} - 1 )^{n} dx$ ; montrer que $I_{n} = I_{n-1}$

### Exercice n°14 :

Soit la fonction f définie par : f(x) = (x - 3)$e^{x}$
- 1. Déterminer les réels a et b pour que F(x) = (ax + b) soit la primitive
de f(x).
3 ( )

#### 2. Déduire I $= \int 0$ f x dx

### Exercice n°15 :

$\frac{π}{0 2}$

On considère les intégrales : $I_{n} = \int x^{n}$ sinxdx; ($n \in \mathbb{N}$)

#### 1. Calculer $I_{0}$ et $I_{1}$

#### 2. Etablir une relation entre $I_{n}$ et $I_{n-2}$

### FICHE N° 4

### THEME : Fonctions Logarithmes

OBJECTIF GENERAL : Réaliser des activités diverses
OBJECTIF SPECIFIQUE : Etudier des fonctions numériques particulières
DUREE DE LA SEQUENCE DE L’ENSEIGNEMENT/D’APPRENTISSAGE : 2 sem. soit
10h
Plan du cours

### I. Fonction logarithme népérien

#### 1. Définition

#### 2. Propriétés algébriques

#### 3. Exemple de résolution des équations et inéquations

#### 4. Limites classiques

#### 5. Etude de la fonction f(x) = ln(x)

#### 6. Dérivée de la composée f(x) = ln[U(x)]

#### 7. Primitives et ln

- II. Fonctions logarithmes de base a, avec $a \in$ ]0; 1[ $\cup$ ]1; +$\infty$[

#### 1. Définition

#### 2. Propriétés

#### 3. Exemples de résolution des équations et systèmes

#### 4. Etude de la fonction f(x) = $log_{a} x$

#### 5. Exemple d’étude d’une fonction comportant ln

## CHAPITRE 4 : FONCTIONS LOGARITHMES

### I. FONCTION LOGARITHME NEPERIEN

#### 1. Définition

La fonction logarithme népérien notée ln, est la primitive de la fonction $\frac{1}{x}$
sur ]0; +$\infty$[ qui s’annule en 1.
Le logarithme népérien de x est noté lnx.

$\forall x \in$ ]0;+$\infty$[ , (lnx)’$= \frac{1}{x}$

ln1 = 0
lne = 1 (e = 2, 71est la base du logarithme).

#### 2. Propriétés

$\forall a$ > 0, $\forall b$ > 0 et pour tout rationnel n on a :
ln(a. b) = lna + lnb

ln $( \frac{a}{b}$) = lna - lnb ; $ln \frac{1}{a} =$ - lna

$ln a^{n}$ = nlna ; $ln \sqrt{a = \frac{1}{2}}$lna

lna = lnb ⟺ a = b ; lna < lnb ⟺ a < b
Soit U une fonction définie sur $\mathbb{R}$ telle que :
0 < U(x) et a un réel donné.
ln U(x) = a ⟺ U(x) = $e^{a}$

$ln U ( x ) \leq a$ ⟺ $U ( x ) \leq e^{a}$

#### 3. Exemples de résolution des équations et inéquation

Résoudre dans $\mathbb{R}$ les équations suivantes.

##### a) l n(x - 1) + ln(x + 2) = 2lnx

##### x - 1 > 0

l’équation a un sens ⟺ {x + 2 > 0 E =]1;+$\infty$[
x > 0
l n(x - 1) + ln(x + 2) = 2lnx
l n(x - 1)(x + 2) = $ln x^{2}$
(x - 1)(x + 2) = $x^{2}$

##### x - 2 = 2 $\in E$.

$\frac{0 ⟹ x =}{S = { 2 }}$

##### b) ln2x – ln(x - 2) = ln3

⟺ {x > 0 E =]2;+$\infty$[

##### x - 2 > 0

l’équation a un sens⟺ ln2x - ln(x - 2) = ln3

$ln \frac{2 x}{x - 2} = ln$3

$\frac{2 x}{x - 2}$ = 6 $\in E$

$\frac{3 ⟹ x =}{S = { 6 }}$

Résoudre dans $\mathbb{R} ^{2}$ les systèmes suivants :

$x + y = \frac{10}{3}$

##### a) {

lnx + lny = 0
x > 0
le système est défini ⟺ {y > 0

$x + y = \frac{10}{3} x + y = \frac{10}{3}$

Ainsi : { ⟹ {
ln(x. y) = ln1 x. y = 1

xet y solutions de l’équation $t^{2} -$

$\frac{St + P = 0}{\frac{1}{3} \frac{1}{3}}$

$t_{1} = \frac{1}{3}$

$t^{2} - \frac{10}{3} t$ + 1 = 0 ⟹ { { S = {( ; 3)(3; )}

$t_{2}$ = 3

##### b) Résoudre dans $\mathbb{R}$ l’inéquation suivante :

ln(3x - 6) > ln(x + 2)
L’inéquation a un sens si et seulement si :
3x - 6 > 0 x > 2
{ ⟹ {
x + 2 > 0 x > - 2
Ce qui équivaut à E =]2;+$\infty$[
ln(3x - 6) > ln(x + 2) équivaut à 3x - 6 > x + 2 ⟹ x > 4
d’où S =]4; +$\infty$[

$x^{2} - y^{2}$ = 12

##### c) Résoudre dans $\mathbb{R} ^{2}$ le système suivant : {

lnx - lny = ln2
x > 0
Le système est défini ⟺ {y > 0

$x^{2} - y^{2}$ = 12 $x^{2} - y^{2}$ = 12

Ainsi: {$ln \frac{x}{y} =$ ln2 ⟹ { $\frac{x}{y}$ = 2 ⟹

(1)

(2) $x^{2} - y^{2}$ = 12

{
x = 2y
Remplaçons x dans (1)
(2$y )^{2} - y^{2}$ = 12 ⟹ 3$y^{2}$ = 12 ⟹ y = ∓2 donc y = ∓4
x > 0
D’après E car {y > 0
S = {(4$;$ 2)}

#### 4. Limites classiques

lim lnx = $- \infty$ lim xlnx = 0 lim $\frac{ln ( 1 + x )}{x}$ = 1

$x \to 0^{+} x \to 0^{+} x \to$0

lim lnx = +$\infty$ lim $\frac{lnx}{x}$ = 0 lim $\frac{lnx}{x - 1}$ = 1

$x \to 0^{+} x \to + \infty x \to$1

#### 5. Etude de la fonction lnx

Ef =]0,+$\infty$[, lim lnx = $- \infty$, lim lnx = +$\infty$

$x \to 0^{+} x \to 0^{+}$

f’(x) = $\frac{1}{x}$ et $\forall x \in$ ]0,+$\infty$[, f’(x) > 0

Tableau de variation

x +$\infty$

f’(x) +

+$\infty$

f(x)

-$\infty$

Branches infinies
lim f(x) = $- \infty ,$ x = 0 A. V.

$x \to 0^{+}$

lim f(x) = 0 , lim $\frac{f ( x )}{x}$ = 0 ; B.P de direction (Oy)

$x \to + \infty x \to + \infty$

(C$) \cap ($ox) ; f(x)=0 ⟹ lnx = 0 ⟹ lnx = ln1.
x = 1 ; A(1; 0)
Remarque:
D’après le T.V, la fonction ln est continue et strictement monotone, elle est donc

bijective de ]0, +$\infty$[ sur $\mathbb{R}$

lnU(x) existe si et seulement si U(x) > 0
ln|U(x)| existe si et seulement si U(x$) \neq$ 0
Equation de la tangente (T) en A. y = x - 1

$y$

(C)

$o A$

$x’x$

$y’$

#### 6. Dérivée

Si U est dérivable sur un intervalle I, alors f l’est aussi et on a :

f(x) = lnU(x) ⟹ f((x) = $\frac{U’( x )}{U ( x )}$

Exemple :

f(x) = ln(2x - 1) ⟹ f’(x) = $\frac{2}{2 x - 1}$

#### 7. Primitive et ln

Soit U une fonction dérivable sur $\mathbb{R} ^{∗}$

La fonction $\frac{U’( x )}{U ( x )}$ a pour primitive ln|U(x)| + c$;$ c $ε \mathbb{R}$

### II. LOGARITHME DE BASE A

#### 1. Définition

Soit a un réel strictement positif distinct de 1. $e_{i} a \in$ ]0 ;1[ U ]1;+$\infty$[
On appelle fonction logarithme de base a, la fonction définie sur ]0;+$\infty$[
qui , à tout x réel strictement positif associe.

$log^{x}_{a} = \frac{lnx}{lna}$

#### 2. Propriétés

Les propriétés de la fonction $log_{a}$ se déduisant de celles de la fonction ln.
x et y étant deux réels strictement positifs, on a :

$log_{a} x . y = log_{a} x + log_{a} y$

$log_{a} \frac{x}{y} = log_{a} x - log_{a} y$

$log_{a} x^{r} = r log_{a} x$ ; avec $r ε \mathbb{Q}$

En particulier
Pour a = 10, $log_{10}^{x}$ = logx (logarithme décimal)
Pour a = e, $log_{e}^{x}$ = lnx (logarithme népérien)

#### 3. Exemple :

7($log_{y}^{x} + log_{x} y$) = 50

Résoudre dans $\mathbb{R} ^{2}$ le système {

##### x - y = 256

7($log_{y}^{x} + log_{x} y$) = 50 ⟹ 7 ($\frac{lnx}{lny} + \frac{lny}{lnx}$) = 50

x > 0 y > 0
Equation qui a un sens ⟺ { et {

$x \neq 0 y \neq$ 1

Posons :

$\frac{lnx}{lny} = x$ et $\frac{lny}{lnx} = \frac{1}{x}$

$\frac{1}{x} x_{1} = \frac{1}{7}$

7(x + ) = 50 ⟹ 7$x^{2} -$ 50x + 7 = 0 ⟹ {

$x_{2}$ = 7

Pour x = 7 on a :

$\frac{lnx}{lny}$ = 7 ⟹ lnx = 7lny ⟹ x $= y^{7}$

Le système devient :

$x = y^{7}$

{ remplaçons x dans (2)

##### x - y = 256

$y^{7} .$ y = 256 ⟹ $y^{8} = 2^{8}$ ⟹ y = 2 soit x = 128

d’où S = {(128$;$ 2)}

#### 4. Etude de la fonction $log^{x}_{a}$

Soit f(x) = $log_{a}^{x} = \frac{lnx}{lna}$

$’$

f’(x) = ($\frac{lnx}{lna}$) = $\frac{1}{lna}$ (lnx)’$= \frac{1}{xlna} f’$ (x) = $\frac{1}{xlna}$

Si 0 < a < 1. Si a> 1
f’(x) < 0 car lna < 0 f’(x) > 0 car lna > 0

Tableau de variation Tableau de variation

x 0 1 +$\infty$ x 0 1 +$\infty$

f’(x) +

f(x) +$\infty$ f(x)

+$\infty$

$- \infty - \infty$

lim = +$\infty$ ; lim = $- \infty$ lim = $- \infty$ ; lim = +$\infty$

$x \to 0^{+} x \to + \infty x \to 0^{+} x \to + \infty$

Tracé des courbes

$y$

a > 1

0 $A$

$x$' $x$

0 < a < 1

$y’$

#### 5. Exemple d’étude d’une fonction

Soit ℎ la fonction numérique définie par : ℎ(x) = $x^{2} -$ 1 + lnx

#### 1. Calculer ℎ(x)

- 2. Etudier les variations de ℎ et en déduire le signe de ℎ(x)
- 3. On considère la fonction f définie par : f(x) = x $- \frac{lnx}{x}$

##### a. Montrer que la droite d’équation y = x est asymptote à la

courbe (Cf)

##### b. Etudier les variations de f.

#### 4. Soit g la restriction de f sur ]0 ;1]

- a. Monter que g est une bijection de ]0 ; 1] sur un intervalle J à
préciser
- b. Construire les courbes (Cf) et (C’) de $g^{-1}$ dans le même
repère.
- c. Donner une équation de la tangente (T) à (Cf) au point $x_{0} = \frac{1}{e}$
- 5. Déterminer l’aire de la portion du plan limitée par la courbe (Cf) et
les droites d’équation y = x , x = 1 et x = 2.

### Solution du problème n° 1

ℎ(x) = $x^{2} -$ 1 + lnx

#### 1. Calculons ℎ(1) or ℎ(1) = 0

#### 2. Etude des variations

$E_{ℎ}$ =]0,+$\infty$[ , lim ℎ = $- \infty$ , lim ℎ = +$\infty$ ,

$0^{+} + \infty$

ℎ(x) = $x^{2} -$ 1 + lnx ⟹ $ℎ’$ (x) = 2x $+ \frac{1}{x}$

⟹ h’(x) = $\frac{2 x^{2} + 1}{x}$

$\forall x \in$ ]0 ;+$\infty$[ , $ℎ’$(x) > 0

Tableau de variation

x 0 1 +$\infty$

h’(x)
h(x)

+$\infty$

$- \infty$

Déduisons b signe de ℎ(x)

$\forall x \in$ ]0 ;1[ , ℎ(x) < 0

D’après le Tableau de variation : {

$\forall x \in$ ]1 ;+$\infty$[ , ℎ(x$) \geq$ 0

#### 3. f(x) = x $- \frac{lnx}{x}$

##### a. Soit y = x et A.O. ⟺ lim(f(x) - y) = 0

+$\infty$

en effet : lim(f(x) - y) = lim(x $- \frac{lnx}{x} -$ x) ⟹

+$\infty + \infty$

lim ($- \frac{lnx}{x}$) = 0

+$\infty$

##### b. Etude de variation

x > 0

f est définie $\Leftrightarrow$ { ⟹ $E_{f}$ =]0, +$\infty$[

$x \neq$ 0

lim f = lim(x $- \frac{lnx}{x}$) = lim (x $- \frac{1}{x}$ . lnx) = +$\infty$

$0^{+} 0^{+} 0^{+}$

### FICHE N° 5

### THEME : FONCTIONS EXPONENTIELLES ET PUISSANCES

OBJECTIF GENERAL : Réaliser les activités sur la fonction exponentielle
OBJECTIF SPECIFIQUE :
Reconnaître et utiliser les fonctions exponentielles de base
Effectuer des calculs algébriques sur la fonction exponentielle.
Résoudre des équations, inéquations et des systèmes
Calculer une dérivée
Calculer une primitive
Etudier une fonction
DUREE DE LA SEQUENCE DE L’ENSEIGNEMENT/D’APPRENTISSAGE : 10 h
Plan du cours.

### I. Fonction exponentielle népérienne f(x) = $e^{x}$

#### 1. Définition

#### 2. Propriétés

#### 3. Application à la résolution des équations et inéquations

#### 4. Limites classiques

#### 5. Etude de la fonction f(x) = $e^{x}$ et représentation

#### 6. Dérivée de la fonction f(x) = $e^{U} ($n)

#### 7. Fonctions exponentielles et primitives

### II. Fonction exponentielle de base a

#### 1. Définition

#### 2. Propriétés

#### 3. Etude de la fonction f(x) = $a^{x}$

#### 4. Activités : Résolution des équations et inéquations

### III. Fonctions puissance

#### 1. Définition

#### 2. Ensemble de définition

#### 3. Dérivée

#### 4. Croissance comparée de lnx, $e^{x}$ et $x^{α}$

- IV. Exemple d’étude d’une fonction exponentielle (application)

## CHAPITRE 5 : FONCTIONS EXPONENETIELLES

ET PUISSANCE

### I. Fonction exponentielle népérienne f(x) = $e^{x}$

##### a. Définition

La fonction exponentielle notée $e^{x}$ est la bijection réciproque de la fonction

logarithme népérien. $e^{x} : \mathbb{R} \to$]0,+$\infty$[

##### b. Propriétés

Pour tous nombres réels a et b et r un nombre rationnel, on a :

$e^{a} + b = e^{a} . e^{b} - b \frac{e^{a}}{e^{b}}$

$e^{a}$ =

$e^{-} a = \frac{1}{e^{a}}$

$e^{ra}$ = ($e^{a} )^{r}$

$( e^{a}$ < $e^{b}$ ) ⟺ (a < b) $( e^{a} = e^{b}$ ) ⟺ (a = b)

##### c. Applications (équation, inéquation et système)

Résoudre dans $\mathbb{R} l$’équation ($e^{x} )^{2} - e^{x} -$ 2 = 0

Posons : $e^{x} =$ t, t > 0 ($e^{x} )^{2} - e^{x} -$ 2 = 0

L’équation devient :

$t_{1}$ = 2

$t^{2} -$ t - 2 = 0 ⟹ {

$t_{2} = -$1

Pour t = 2 ⟹ $e^{x}$ = 2 ⟹ x = ln2
Pour t = - 1 ⟹ $e^{x} =$ - 1 impossible S = {ln2}

Résoudre dans $\mathbb{R} l$’équation$e^{x} - 5 e^{-} x$ - 4 = 0

$e^{x} - 5 e^{-} x$ - 4 = 0 ⟹ $e^{x} -$ 5 ($\frac{1}{e^{x}} )$ - 4 = 0 ⟹ ($e^{x} )^{2} - 4 e^{x} -$ 5

= 0
Posons : $e^{x} =$ t, t > 0

$t_{1}$ = 5

L’équation devient : $t^{2} -$ 4t - 5 = 0 ⟹ {

$t_{2} = -$1

Pour t = 5 ⟹ $e^{x}$ = 5 ⟹ x = ln5
Pour t = - 1 ⟹ $e^{x} =$ - 1 impossible S = {ln5}
Résoudre dans $\mathbb{R} ^{2}$ les systèmes suivants :

| a) 2a + 5b = 16 { ( ) } { S = 3 ; 2 3a + 3b = 15 | En déduire la solution du système + ln 2 + ln 5 e^{x} + e^{y} = 16 { ( ) } { S = ln3 ; ln2 + ln 3 + ln 3 e^{x} + e^{y} = 15 |
| --- | --- |
| b) 3a + 2b = 11 { ( ) } { S = 3 ; 1 a - b = 2 | En déduire la solution du système x + 1 y 3 e^{2} + 2 e^{2} = 11 { ( ) } { S = ln3 ; ln2 x + + ln 3 e^{2} + e^{y} = 15 |

Résoudre dans $\mathbb{R} ^{2}$ l'inéquation : $e^{5x} -$3 < 1

$e^{5x-3}$ < 1 ⟹ $e^{5x} -$3 < $e^{0}$

D'où

5x - 3 < 0 ⟹ x < $\frac{3}{5} S$ = ]$- \infty ; \frac{3}{5}$[

##### d. Limites classiques

$lim e^{x} =$ 0 $lim e^{x}$ = +$\infty lim xe^{x} =$ 0

$x \to - \infty x \to - \infty x \to - \infty$

$lim \frac{e^{x}}{x}$ = +$\infty lim \frac{e^{x} - 1}{x} =$ 1

$x \to + \infty x \to 0$

##### e. Etude de la fonction $e^{x}$

Ef $= \mathbb{R}$, lim $e^{x}$ = 0 ; lim $e^{x}$ = + $\infty ,$ f’(x) = $e^{x}$

$- \infty + \infty$

$\forall x \in \mathbb{R} ,$ f’(x) > 0

Tableau de variation Branches infinis

lim $e^{x}$ = 0, y = 0 A.H. en $- \infty$

$- \infty$

-$\infty$ 0 + $\infty \frac{e^{x}}{x}$

lim $e^{x}$ = + $\infty$, lim = +$\infty$

$\frac{x}{f’(x)} + \infty + \infty$

$\frac{+}{+ \infty}$

f(x)
(C) admet une B.P de direction (Oy).
(C$) \cap ($Oy): { x = 0 B(0; 1) (C) coupe (Oy) en B.

$e^{0}$ = 1

Tangente en B à (C). (T) y = x + 1
Traçons (C).

$y$

(C)
B

$x’o x$

$y’$

f.Dérivée de f(x) = $e^{U} ($x)
Si U est dérivable sur un intervalle I, alors f l’est aussi.
On a :

f(x) = $e^{U(x)}$ ⟹ f’(x) = U’(x$) e^{U} ($x)

Exemple :
Calculer la dérivée de fonctions suivantes :

f(x) = $e^{2x}$ +3, g(x) = $e^{-x+1}$

f’(x) = 2$e^{2} x$+3, g’(x) = $- e^{-} x$+1

##### g. Fonction exponentielle et primitive

$e^{ax+b}$ a pour ensemble des primitives $\frac{1}{a} e^{ax+b} +$ C

U’(x$) e^{U} ($x) a pour ensemble des primitives $e^{U(x)} +$ C

### II. FONCTION EXPONENTIELLE DE BASE a

##### a. Définition :

Soit a un réel strictement positif distinct de 1.

et $a \in$ ]0, 1[$\cup$ ]1, +$\infty$[

$\forall x \in \mathbb{R} , a^{x} = e^{xlna}$

$a^{x}$ est la fonction exponentielle de base a.

##### b. Propriétés :

Pour tous nombres réels a et b strictement positifs et pour tous nombres réels x
et y on a :

$y a^{x} - y = \frac{a^{x}}{a^{y}}$

$a^{x+} = a^{x} . a^{y}$

$( \frac{a}{b} )^{x} = \frac{a^{x}}{b^{x}} a^{-} y = \frac{1}{a^{y}}$

$( a^{b} )^{x} = a^{x} . b^{x} ( a^{x} )^{y} = a^{xy}$

##### c. Etude de la fonction exponentielle de base a

La fonction $a^{x}$ étant la composée de deux fonctions dérivables sur $\mathbb{R}$

est aussi dérivable sur $\mathbb{R} ( a^{x} )’$ = ($e^{xlna} )’$ = (lna)$e^{xlna}$ = (lna)$a^{x}$

On en déduit les résultats suivants :
Si 0 < a < 1
Exemple :

$x$

f1(1) = ($\frac{1}{2}$)

$f_{1}’$ (x) = (lna)$a^{x}$ < 0 car lna < 0

Tableau de variation $\frac{Branches infinies}{x}$

$\frac{x}{( a^{x} )’} - \infty + \infty$ lim a = +$\infty$,

$- \infty$

$\frac{-}{+ \infty}$ lim $a^{x}$ = 0

+$\infty$

$a^{x}$

Si a > 1 f’2(x) = (lna)$a^{x}$ > 0car lna > a
Exemple :

f2(x) = $2^{x}$

$f_{1}’$ (x) = (lna)$a^{x}$ < 0 car lna < 0
Tableau de variation Branches infinies

lim $a^{x}$ = +$\infty$,

$- \infty$

-$\infty + \infty$ lim $a^{x}$ = 0

$\frac{x}{( a^{x} )’} + \infty$

$\frac{+}{+ \infty}$

$a^{x}$

$- \infty$

Tracé des courbes

$y (C_{2}$ )

A $(C_{1}$ )

x’-2 -1 0 1 2 3 4 x
-1
-2

$y’$

NB :
Toutes les courbes des fonctions exponentielles passent par le point A(0, 1)

##### d. Activités : Résolution des équations et inéquations

Résoudre dans $\mathbb{R}$ l'équation suivante : $2^{x+} 1 + 4^{x} -$ 15 = 0

### Solution :

$2^{x}$ . 2 + ($2^{x} )^{2} -$ 15 = 0 Posons : $2^{x} =$ t, t > 0

$2^{x}$ . 2 + ($2^{x} )^{2} -$ 15 = 0

$t_{1}$ = 3

$t^{2}$ . +2t - 15 = 0 ⟹ {

$t_{2} = -$5

Pour t = 3 Pour t = - 5

$2^{x}$ = 3 $2^{x} =$ - 5

$ln 2^{x} =$ ln3 Impossible

xln2 = ln3

x $= \frac{ln 3}{ln 2} = log_{2}^{3}$ ⟹ S = {$log^{3}_{2}$ }

Résoudre dans $\mathbb{R}$ l'équation suivante : $10^{6x} -$ 3$. 10^{3x} -$ 4 = 0

### Solution

($10^{3x} )^{2} -$ 3. $10^{3x} -$ 4 = 0 Posons : $10^{3x} =$ t, t > 0

$t_{1}$ = 4

$t^{x} -$ 3t - 4 = 0 ⟹ {

$t_{2} = -$1

Pour t = 4 Pour t = - 1

$10^{3} x$ = 4 $10^{3x} =$ - 1

$ln 10^{3} x$ = ln4 Impossible

3xln10 = ln4

x $= \frac{2 ln 2}{3 ln 10} = \frac{2}{3} \times \frac{ln 2}{ln 10} = \frac{2}{3} log$2 S = {$\frac{2}{3} log$2}

### III. FONCTION PUISSANCE

##### a. Présentation

Soit u et v deux fonctions numériques à variable réelle x , on se propose d’étudier
la fonction f(x) = [U(x$) ]^{v(x)}$

##### b. Ensemble de définition

f existe ⟺ U(x)

$\frac{> 0 . On écrit :}{f ( x ) = [ U ( x ) ]^{v} ( x ) = e^{v} ( x ) lnU ( x )}$

##### c. Dérivée

Si u et v sont dérivables sur un intervalle I, alors f l’est aussi et on a :

f(x) = [U(x$) ]^{v(x}$ ) = $e^{v(x}$ ) lnU(x)

⟹ f’(x) = [v’(x) lnU(x) + $\frac{v ( x ) U’( x )}{U ( x )}$]$e^{v} ($x) lnU(x)

⟹ f’(x) = [v’(x) lnU(x) + $\frac{v ( x ) U’( x )}{U ( x )}$]$e^{v} ($x) lnU(x)

##### d. Croissance comparée de lnx , $e^{x}$ et $x^{α}$

Soit $α$ un nombre réel strictement positif, on a :

$\frac{lnx}{x^{α}}$ lim $x^{α}$ lnx = 0

lim = 0 $x \to 0^{+}$

$x \to + \infty$

lim $x^{α} e^{-x}$ = 0

lim $\frac{e^{x}}{x^{α}}$ = +$\infty x \to + \infty$

$x \to + \infty$

### IV. Exemple d’étude d’une fonction

Soit la fonction f définie par :

f(x) = $\frac{e^{x} - 3}{e^{x} - 1}$

(C) désigne sa courbe représentative dans un repère orthonormé (0, i⃗ , j⃗ )

#### 1. Etudier les variations de f

2.
- a. Trouver les coordonnées du point A point d’intersection de (C) et l’axe
(Ox).

##### b. Donner une équation de la tangente (T) à (C) au point A.

- 3. Démonter que le point B(0 ; 2) est centre de symétrie de (C).

#### 4. Tracer (C).

5.
- a. Démontrer que $\forall$ x $\in E_{f}$ on a : f(x) = 3 $- \frac{2 e^{x}}{e^{x} - 1}$
- b. Calculer l’air de la partie du plan délimitée par (C), l’axe (Ox) et les
droites d’équationsx = ln2 et x = ln9.
6.
- a. Soit h la restriction de f à l’intervalle ]0, +$\infty$[/Montrer que h admet une
bijection réciproque $ℎ^{-1}$ sur un intervalle k que l’on déterminera.
- b. Tracer (C’) courbe de $ℎ^{-}$ 1dans le même repère que (C). Justifier.

### Solution du problème n°01

f(x) = $\frac{e^{x} - 3}{e^{x} - 1}$

#### 1. Etude de variations

Ef =] $- \infty$; 0[ $\cup$ ]0,+$\infty$[ f est définie ⟺ $e^{x} - 1 \neq$ 0

lim f = 3, lim f = 1 , lim f = +$\infty$, lim f = $- \infty$,

$- \infty + \infty 0^{-} 0^{+}$

f’(x) = $\frac{e^{x} ( e^{x} - 1 ) - e^{x} ( e^{x} - 3 )}{( e^{x} - 1 )^{2}} = \frac{e^{x} ( e^{x} - 1 - e^{x} + 3 )}{( e^{x} - 1 )^{2}} = \frac{2 e^{x}}{( e^{x} - 1 )^{2}}$

$\forall x \in E$f , f’(x) > 0

Tableau de variations

x -$\infty$ 0 ln3 +$\infty$

f’(x) +

+$\infty + \infty$

F(x) 0

3 $- \infty$

2.

##### a. (C$) \cap ($O, x) :

On pose

y = 0 ⟹ $\frac{e^{x} - 3}{e^{x} - 1}$ = 0 ⟹ $e^{x} -$ 3 = 0 ⟹ x = ln3 A(ln3; 0)

##### b. Tangente en A.

f(ln3) = 0

{ ⟹ (T): y $= \frac{3}{2} ($x - ln3)

f’(ln3) = $\frac{3}{2}$

##### c. Tracé de la courbe

- Branches infinies
lim f = 3 $\to y$ = 3 A. H.

$- \infty$

lim f = 1 $\to y$ = 1 A. H.

+$\infty$

lim f $= \pm \infty \to x$ = 0 A. V.

0$\pm$

#### 3. Démontrons que B(0,2) est centre de symétrie de (C).

f(2a - x) + f(x) = 2$b \to f$(- x) + f(x) = 4
En effet :

f(- x) = $\frac{e^{-} x - 3}{e^{-} x - 1} = \frac{1 - 3}{\frac{e^{x} 1}{e^{x}} - 1} = \frac{1 - 3 e^{x}}{1 - e^{x}} = \frac{3 e^{x} - 1}{e^{x} - 1}$

f(x) + (f(- x) = $\frac{3 e^{x} - 1}{e^{x} - 1} + \frac{e^{x} - 3}{e^{x} - 1} = \frac{3 e^{x} - 1 + e^{x} - 3}{e^{x} - 1}$

f(- x) + (f(x) = $\frac{4 e^{x} - 4}{e^{x} - 1} = \frac{4 ( e^{x} - 1 )}{e^{x} - 1}$ = 4

f(- x) + (f(x) = 4 Ce qu'il fallait démontrer.

#### 4. Représentation graphique

y
y=3
B(0;2)
y=1
x’0 A(ln3;0) x
y'

5.
- a. Démontrons que $\forall x \in E_{f,} f$(x) = 3 $- \frac{2 e^{x}}{e^{x} - 1}$

En effet : 3 $- \frac{2 e^{x}}{e^{x} - 1} = \frac{3 ( e^{x} - 1 ) - 2 e^{x}}{e^{x} - 1} = \frac{3 ( e^{x} - 1 ) - 2 e^{x}}{e^{x} - 1} = \frac{e^{x} - 3}{e^{x} - 1} =$ f(x)

##### b. Calcul d’une aire :

$ln 9 ln 3 ln$9

$A = \int f ( x ) dx = \int f ( x ) dx + \int f ( x ) dx$

$ln 2 ln 2 ln$3

$ln 3 ln$9

A = $- \int$ (3 $- \frac{2 e^{x}}{e^{x} - 1} )$ dx $+ \int$ (3 $- \frac{2 e^{x}}{e^{x} - 1} )$ dx

$ln 2 ln$3

$ln$9

A = [- 3x + 2 ln($e^{x} -$ 1)$]^{ln3}$ + [3x - 2 ln($e^{x} -$ 1)] dx

$ln$3

$A = ln2 u . a$.

### FICHE N° 6

### THEME : EQUATIONS DIFFERENTIELLES

OBJECTIF GENERAL : Réaliser les activités sur la fonction exponentielle
OBJECTIF SPECIFIQUE :
Reconnaître et utiliser les fonctions exponentielles de base
DUREE DE LA SEQUENCE DE L’ENSEIGNEMENT/D’APPRENTISSAGE : 10 h
Plan du cours.

### I. Généralités

#### 1. Définition

#### 2. Ordre d'une équation différentielle

- 3. Résoudre ou intégrer une équation différentielle revient à déterminer une
fonction inconnue y qui vérifie cette équation. L'ensemble des solutions
d'une équation différentielle est appelé intégrale indéfinie ou solution
générale de cette équation différentielle.
- II. Equations différentielles Linéaires homogènes à coefficients constants

##### a. Forme : ay’+ by = 0

$- \frac{b}{a} x$

##### b. Résolution : $y_{g} =$ ke , $k \in \mathbb{R}$

- III. $Equations différentielles Linéaires homogènes du 2^{nd}$ ordre

##### a. Forme : ay’+ by’+ cy = 0, $a \neq$ 0

##### b. Résolution

### IV. Equations différentielles non homogènes

##### a. $Du 1^{er}$ ordre

##### b. $Du 2^{nd}$ ordre

## CHAPITRE VI : EQUATIONS DIFFERENTIELLES

### I. Généralité

#### 1. Définition

Une équation différentielle est une relation liant la fonction inconnuey et
ses dérivées successives y’, y’’, … $y^{n}$
Exemples : y’- 4y = 0; y’+ 2y + 2 = $e^{x}$

#### 2. Ordre d'une équation différentielle

L'ordre d'une équation différentielle porte sur le plus élevé des ordres des
dérivées de y intervenant dans cette équation

#### 3. Résolution des équations différentielles

Résoudre ou intégrer une équation différentielle c’est trouver l’ensemble
de toutes les fonctions f qui la vérifient.
Cet ensemble de fonctions est appelé intégrale ou solution générale de
cette équation.
- II. Equations différentielles linéaires homogènes de 1er ordre à
coefficients constants.
- a. Forme : ay’+ by = 0$; a \in \mathbb{R} ^{∗} et b \in \mathbb{R}$

$- b x$

La solution générale de l’équation ay’+ by = 0 est y = $λ$e a ($λ \in \mathbb{R}$)
NB : Le réel $λ$ est déterminé en fonction de la condition initiale on en
déduit de la solution particulière.

##### b. Méthodes de résolutions

Exemple :
Résoudre l’équation : y’+ 2y = 0

### Solution :

(E) ∶ y’+ 2y = 0 ⟹ a = 1 et b = 2

$\frac{d’où}{- \frac{b}{a}_{x} - 2x}$

$y_{G} = λ e$ ⟹ $y_{G} = λ e , λ \in \mathbb{R}$

Exemple :
Intégrer l’équation différentielle (E) : 3y’- 4y = 0 valeur -1 pour
$x_{0}$ = 3, puis déterminer la solution générale

### Solution :

(E) : 3y’- 4y = 0; a = 3 ; b = - 4

4$x$

$y_{G} = λ e^{3}$ (Solution générale).

Trouvons la solution particulière en utilisant la condition donnée.

4$x$

y = f(x) = $λ e^{3}$ ⟹ f(3) = - 1
4(3)

$λ e^{3} =$ - 1 ⟹ $λ e^{4} =$ - 1 ⟹ $λ$ = $- \frac{1}{e^{4}} = - e^{-4}$

4$x 4 x - 4$

D’où f(x) = $- e^{-4} . e^{3}$ ⟹ f(x) = $- e^{3}$ (solution particulière)

- III. Equations différentielle linéaires homogènes du second ordre à
coefficients constants
- a) Forme : ay’+ by + cy = 0 où $a \in \mathbb{R} ^{∗}$ , b et c des réels

##### b) Méthode de résolution

On recherche l’équation caractéristique.
Pour l’équation (E) : ay’’+ by’+ cy l’équation est :

$a r^{2} + br + c = 0$

On calcule par la suite le discriminant $\Delta$ ou $\Delta’$ : puis trois cas
peuvent se présenter.

| Signe de \Delta | Racines | Solution générale |
| --- | --- | --- |
| \Delta > 0 | r \neq r_{2} (réelles) 1 | x x 1 2 y = C_{1} . e^{r} + C_{2} . e^{r} |
| \Delta = 0 | r = r_{2} = r 1 (réelles) | x 0 y = ( C_{1} + C_{2} x ) e^{r} |
| \Delta < 0 | r = α + iβ 1 r_{2} = α - iβ | y = [ C_{1} cos βx C_{2} sin βx ] e^{2x} |

Remarques :
$C_{1} et C_{2}$ sont des constantes réelles, elles sont définies à partir des
conditions initiales données dans le texte.
Pour le cas $\Delta$< 0 ; de ces deux racines, on retient la racine où $β$ > 0.

Exemples :

#### 1. Intégrer ces équations différentielles suivantes :

##### a) (E): y’+ 5y’+ 6y = 0

##### b) ($E_{1}$ ): 4y’- 4y’+ y = 0

##### c) ($E_{2}$ ): y’+ 2y’+ 5y = 0

2.
- a. Donner la solution générale de l’équation : (E): y’+ 4y’+ 4y = 0
ℎ(0) = 1

##### b. Donner la solution particulière h tel que :{

$ℎ’$ (0) = - 1
3.
- a. Donne la solution générale de l’équation : (E): y’+ 2y’+ 2y = 0

$\frac{π}{2} - \frac{π}{2}$

- b. Donc la solution particulière f dont la courbe passe par A( ; e )
et admet en x $= \frac{5 π}{4}$, une tangent horizontale.

### V. Equations différentielles non homogène

##### a. $Du 1^{er}$ ordre

$a_{1}$ ) Forme : y’= f(x)

y’= f(x) ⟺ $\int y’= \int f$(x) dx ⟹ y = F(x) + $C_{1}$

où F est une primitive de fsur $\mathbb{R}$
Exemple :
y’= sin 2x

⟹ $\int y’= \int$sin 2xdx

$y = - \frac{1}{2} cos 2x + C_{1}$

$a_{2}$ ) Forme : ay’+ by = f(x) $a \neq 0$

$- b$

La solution générale de cette équation est : y = $λ$e a $+ y_{1}$ avec

$- \frac{b}{a} x$

$y_{1}$ solution particulière de l’équation donnée et $y = C . e$
étant la solution générale de l’équation ay’+ by = 0
Exemple :
(E): 2y’- y = 3x + 1 ⟹ a = 2 et b = - 1

$1 x$

y = $K e^{2}$ (Solution homogène)
Posons : f(x) = y = ax + b
f’(x) = a ; remplaçons dans :
(E): 2a - (ax + b) = 3x + 1 ⟹ {a = - 3

$b = -$7

$y_{1} =$ - 3x - 7(Solution non homogène)

$1 x$

Y = $K e^{2} -$ 3x - 7(Solution générale)

### Exercice :

Intégrer les équations différentielles

##### a) y’- y $= x^{2} -$ x + 1

##### b) y’+ 2y = cos x

##### c) y’- y = sin x

##### d) 3y’+ 2y $= e^{x}$

##### b. Du second ordre

$b_{1}$ ) Forme : y’= f(x)

y’= f(x) ⟺ $\int y’= \int f$(x) dx

⟺ y’= F(x) + $C_{1}$ , avec F la primitive de f sur $\mathbb{R}$

⟺ $’dx$

$\frac{\int y = \int ( f ( x ) + C_{1} )}{y = G ( x ) + C x + C}$

⟺ 1 2 G étant une primitive de F

$C_{1} et C_{2}$ sont des réels

Exemple :
Résoudre l’équation différentielle : (E): y’$= e^{-2x}$

### Solution :

(E) ∶ y’$= e^{-} 2$x

$\int y’= \int e^{-} 2 x dx$ ⟹ $y’= - \frac{1}{2} e^{-2} x + C$

$\int y’= \int ( - \frac{1}{2} e^{-} 2 x + C_{1} ) dx$

⟺ $y = - \frac{1}{2} \int e^{-} 2 x + C_{1} \int dx$

⟺ y = $- \frac{1}{2} ( - \frac{1}{2} e^{-} 2$x) + $C_{1} x + C_{2}$ ⟹ y $= \frac{e^{-} 2x}{4} + C_{1} x + C_{2}$

$b_{2}$ ) Forme : ay’+ by + cy = g(x) ($a \in \mathbb{R} ^{∗}$ )

La solution générale de cette équation est la somme de la

### solution homogène et de la solution non homogène($y_{n}$ ).

$\frac{( y_{h} )}{y_{G} = y_{h} + y_{n}}$

Exemple :
Intégrer l’équation différentielle : (E): y’+ 2y + y = x

### Solution

(E): y’+ 2y + y = x
La solution homogène de l’équation : y’+ 2y’+ y = 0
EC$: r^{2}$ + 2r + 1 = 0

$\Delta = b^{2} -$ 4ac = (2$)^{2} -$ 4(1)(1) = 0

L’équation admet une racine double : r1 = $r_{2} = r_{0} =$ - 1

D’où $y_{H}$ = ($C_{1} + C_{2} x ) e^{-x}$

Déterminons la solution non homogène
Posons : f(x) = ax + b
f’(x) = a
f’’(x) = 0
Remplaçons dans l’équation (E)
0 + 2a + ax + b = x
ax + 2a + b = x
Par identification : on a : { a = 1

$b = -$2

D’où la solution non homogène est : $y_{n} =$ x - 2

$y_{G}$ =

$\frac{y_{H} + y_{n}}{D onc y = ( C + C x ) e^{-} x + x - 2}$

$G 1 2$

### Exercice :

Intégrer chacune des équations suivantes :

##### a) y’+ 2y $= x^{2} -$ x + 1

##### b) y’+ y’$= x^{2}$ + 2x

### FICHE N° 7

### THEME : LES SUITES NUMERIQUES

OBJECTIF GENERAL : Réaliser des activités diverses
OBJECTIF SPECIFIQUE :
DUREE DE LA SEQUENCE DE L’ENSEIGNEMENT/D’APPRENTISSAGE :
Plan du cours

### I. LE RAISONNEMENT PAR RECURRENCE

#### 1. L’Axione

#### 2. Exemples d’applications

### II. ETUDE DES SUITES NUMERIQUES

#### 1. Généralités

##### a. Définition d’une suite

##### b. Sens de variation d’une suite

##### c. Comparaison de deux suites

##### d. Suite majorées, minorées, bornées, positives, négatives

#### 2. Limites d’une suite numérique

##### a. Limite d’une suite définie par une formule explicite

##### b. Suites convergentes et divergentes

##### c. Critères et théorèmes de comparaison

##### d. Convergence d’une suite monotone

- e. Conséquence d’une suite définie par une formule de récurrence

#### 3. Suites adjacentes

#### 4. Suites périodiques

#### 5. Suites Arithmétiques (ou progressions Arithmétiques)

#### 6. Suites Géométriques (Progressions géométriques)

#### 7. Suites récurrentes d’ordre 2

##### a. Définition

##### b. Equation caractéristique

##### c. Terme général d’une suite d’ordre 2

## CHAPITRE VII : LES SUITES NUMERIQUES

### I. LE RAISONNEMENT PAR RECURRENCE

#### 1. L’Axione

On veut démontrer qu’une propriété Pn est vraie pour tout entier naturel n.
On montre que la propriété est vraie pour $P_{O}$ ou P1.
On suppose que Pn est vrai au rang n et on démontre que la propriété
est aussi vraie au rang n + 1.

#### 2. Exemples d’applications

Exemple 1

On considère la suite définie par $U_{0}$ = 2 et $\forall$ n ϵ$\mathbb{N} , U_{n}$ + 1 = 2$U_{n} -$ n.

Démontrer par récurrence que $\forall n ε \mathbb{N} , U_{n} = 2^{n} +$ n + 1.

### Solution

Soit Pn $= 2^{n} +$ n + 1(hypothèse de récurrence)
Vérifions au rang de premier indice (c’est-à-dire pour n = 0)
On a : $2^{0}$ + 0 + 1 = 1 + 1 = 2 = $U_{0}$ vraie.
Supposons que la propriété soit vraie au rang n, c'est-à-dire $U_{n} = 2^{n}$ +
n + 1, alors
Montrons qu’elle est aussi vraie au rang n + 1 c’est à dire
Un $= 2^{n} +$ n + 1, alors montrons qu’elle est aussi vraie au
rang n + 1, c'est-à-dire $U_{n+1} = 2^{n+}$ 1 + (n + 1) + 1.

$U_{n+1}$ = 2$U_{n} -$ n

= 2($2^{n} +$ n + 1) - n
= $2^{n}$ +1 + 2n + 2 - n
= $2^{n}$ +1 + n + 2

$U_{n+} = 2^{n+}$ 1 + (n + 1) + 1 Vraie.

### Conclusion

$\forall n ε \mathbb{N} , U_{n} = 2^{n} +$ n + 1.

Exemple
Montrer que la somme des n premiers naturels élevés au carré est :

$n$

$\sum k^{2} = 1^{2} + 2^{2} + 3^{2}$ + ⋯ + $n^{2} = \frac{n ( n + 1 ) ( 2 n + 1 )}{6}$

i=1

### Solution

Soit Pn l’hypothèse de récurrence.

Pn $= 1^{2} + 2^{2} + 3^{2}$ + ⋯ + $n^{2} = \frac{n ( n + 1 ) ( 2 n + 1 )}{6 .}$

Vérifions au rang 1

On a $: 1^{2} =1 = \frac{1 ( 2 ) ( 3 )}{6} = \frac{6}{6}$=1 vraie

$D’où P_{1}$ est vraie.

Supposons que la propriété soit vraie au rang n, c'est-à-dire

Pn $= 1^{2} + 2^{2} + 3^{2}$ + ⋯ + $n^{2} = \frac{n ( n + 1 ) ( 2 n + 1 )}{6}$

Alors montrons qu’elle est aussi vraie au rang n + 1 c'est-à-dire

$P_{n}$ +1 = $1^{2} + 2^{2} + 3^{2}$ + ⋯ + $n^{2}$ + (n + 1$)^{2}$

= $\frac{( n + 1 ) ( n + 2 ) ( 2 n + 3 )}{6}$

$P_{n+1} = 1^{2} + 2^{2} + 3^{2}$ + ⋯ + $n^{2}$ + (n + 1$)^{2}$

= $\frac{n ( n + 1 ) ( 2 n + 1 )}{6}$ + ($n^{6}$ + 1$)^{2}$

= $\frac{n ( n + 1 ) ( 2 n + 1 ) + 6 ( n + 1^{2} )}{6}$

= $\frac{( n + 1 ) [ n ( 2 n + 1 ) + 6 ( n + 1 ) ]}{6}$

= $\frac{( n + 1 ) ( 2 n^{2} + n + 6 n + 6 )}{6}$

= $\frac{( n + 1 ) ( 2 n ² + 7 n + 6 )}{6}$

Factorisons 2n² + 7n + 6
$\Delta$= (7)² - 4(2) (6) = 49 - 48 = 1

n’= $\frac{- 7 - 1}{4} =$ - 2 ; n’= $\frac{- 7 + 1}{4} = - \frac{3}{2}$

Donc 2n² + 7n + 6 = 2(n + 2) (n $+ \frac{3}{2}$) = (n + 2) (2n + 3)
La relation devient :

$P_{n+1} = 1^{2} + 2^{2} + 3^{2}$ + ⋯ + $n^{2}$ + (n + 1$)^{2} = \frac{( n + 1 ) ( n + 2 ) ( 2 n + 3 )}{6}$ Vraie.

### Conclusion :

$\forall n ε \mathbb{N} , 1^{2} + 2^{2} + 3^{2}$ + ⋯ + $n^{2} = \frac{n ( n + 1 ) ( 2 n + 1 )}{6}$

### II. ETUDE DES SUITES NUMERIQUES

#### 1. Généralités

##### a. Définition d’une suite

On appelle suite numérique, toute fonction de $\mathbb{N}$ vers $\mathbb{R}$.
On distingue :
Les suites définies par une formule explicite.
Exemple
$U_{n} =$ n (n + 1) = f(n).
f est la fonction de $\mathbb{N}$ vers $\mathbb{R}$ définie par f(x) = x (x + 1).
Les suites définies par une formule de récurrence.
Exemple

$U_{0} = 6$

{ $\frac{1}{2}$

$U_{n} +$1 = $- U_{n} +$ 3 = g$( U_{n}$ ).

g est la fonction de $\mathbb{N}$vers $\mathbb{R}$ définie par g(x) = $- \frac{1}{2} x$ + 3.

##### b. Sens de variation d’une suite

Pour étudier le sens de variation d’une suite (terme général $U_{n}$ ), on étudie
le signe de $U_{n} +$1 $- U_{n}$ . (Pour une suite à termes positifs, on peut

comparer $\frac{U_{n} + 1}{U_{n}} et$ 1 )

Si $U_{n} +$1 $- U_{n}$ > 0, alors la suite est croissante
Si $U_{n} +$1 $- U_{n}$ . < 0, alors la suite est décroissante
Si $U_{n} +$1 $- U_{n}$ . = 0, alors la suite est constante ou stationnaire.

N.$B_{1}$

Une suite est monotone si elle est soit croissante, soit décroissante.
Une suite est dite strictement monotone si elle est soit strictement
croissante, soit strictement décroissante.

$NB_{2}$

Lorsque la suite U est définie par une formule explicite $U_{n} =$ f(n),
on étudie le sens de variations de la fonction f.
Lorsque la suite est définie par une formule de récurrence
$U_{n+} 1$ = g$( U_{n}$ ), on utilise un raisonnement par récurrence.

### Exercice d’application.

Etudier le sens de variations de la suite U définie par $U_{n} = \frac{3n + 2}{2n - 1}$ avec n $ε N^{∗}$

### Solution.

$1^{ère}$ méthode : L’étude du signe de $U_{n+1} - U_{n}$ .

$U_{n} \frac{3 n + 2}{2 n - 1} et U_{n+1} = \frac{3 ( n + 1 ) + 2}{2 ( n + 1 ) - 1} = \frac{3 n + 3 + 2}{2 n + 2 - 1} = \frac{3 n + 5}{2 n + 1}$

$On a : U_{n+1} - U n = \frac{3 n + 5}{2 n + 1} - \frac{3 n + 2}{2 n - 1}$

= $\frac{( 3 n + 5 ) ( 2 n - 1 ) - ( 2 n + 1 ) ( 3 n + 2 )}{( 2 n + 1 ) ( 2 n - 1 )}$

= $\frac{6 n ² - 3 n + 10 n - 5 - 6 n ² - 4 n - 3 n - 2}{( 2 n + 1 ) ( 2 n - 1 )}$

$U_{n}$ +1 $- U_{n} = \frac{- 7}{( 2 n + 1 ) ( 2 n - 1 )}$

| x | - \infty - | \frac{1}{2} 0 | \frac{1}{2} | 1 | + \infty |
| --- | --- | --- | --- | --- | --- |
| - 7 | - | - | - | - | - |
| 2 n + 1 | - | + | + | + | + |
| 2 n - 1 | - | - | - | + | + |
| U_{n-1} - U_{n} | - | + | + | - | - |

Or n ϵ $\mathbb{N}$*, alors l’entier le plus proche de $\frac{1}{2}$ est 1.

D’où $\forall n \geq$ 1, $U_{n+1} - U_{n}$ < 0.

### Conclusion

$U_{n+1} - U_{n}$ < 0 donc $\forall n \geq$ 1, la suite U est strictement décroissante.
Représentation graphique

|  |  |  |  | 3 + 2 U_{1} = | = 5 |
| --- | --- | --- | --- | --- | --- |
|  |  |  |  | 1 6 + 2 U_{2} = | 8 = = 2 , 7 |
| 5 |  |  |  | 4 - 1 9 + U_{3} = | 3 2 11 = = 2 , 2 |
| 4 |  |  |  | 5 17 U_{5} = | 5 ≃ 1 , 9 |
| 3 |  |  |  | 9 |  |
| 2 |  |  |  |  |  |
| 1 |  |  |  |  |  |
| 0 | 1 | 2 3 4 5 | 6 7 8 9 10 | 11 |  |

$2^{ème}$ méthode : Utilisation de la fonction f $: \mathbb{R}$ ⟶ $\mathbb{R}$

$x$ ⟼ $\frac{3 x + 2}{2 x - 1}$

$\forall n ε \mathbb{N} ^{∗} , U_{n} = f ( n$)

f(x) = $\frac{3 x + 2}{2 x - 1}$

Dérivée

f’(x) = $\frac{3 ( 2 x - 1 ) - 2 ( 3 x + 2 )}{( 2 x - 1^{2} )} = \frac{6 x - 3 + 6 x - 4}{( 2 x - 1^{2} )} = - \frac{7}{( 2 x - 1^{2} )}$ or $- \frac{7}{( 2 x - 1^{2} )}$ < 0

| x | - \infty 0 | \frac{1}{2} | 1 | + \infty |
| --- | --- | --- | --- | --- |
| f ’ ( x ) | - | - | - | - |

Or ]$- \infty ,$ 1[ $\notin \mathbb{N} ^{∗}$

### Conclusion

f est strictement décroissante sur [1 + $\infty$[, la suite U est donc
strictement décroissante à partir du rang 1.

##### c. Comparaison de deux suites

Définition

$U et V sont deux suites de même ensemble de définition, n_{0}$ est un nombre

entier naturel.

Si $\forall n ε \mathbb{N} /$ n > $n_{0}$ , on a $U_{n} \geq V$n, alors on dit que U est supérieure à V

à partir de l’indice $n_{0}$ .

### Exercice d’application

Comparer les suites $U_{n} = \frac{1}{n 2}$ et Vn$= \frac{1}{2n + 1}$ (avec n ϵ $\mathbb{N}$*)

### Solution

$\frac{Etudions le signe de V - U}{n n}$.

Vn $- U_{n} = \frac{1}{2 n + 1} - \frac{1}{n^{2}} = \frac{n^{2} - 2 n - 1}{n ² ( 2 n + 1 )}$ . Le signe de Vn $- U_{n}$ dépend de n² - 2n - 1,

Car n² (2n + 1) > 0.
Posons n² - 2n - 1 = 0.
$\Delta’$ = b’² - ac = (- 1)² - (1)(- 1) = 1 + 1 = 2.

x’$= \frac{- b’- \sqrt{\;} \Delta}{a} = \frac{1 - \sqrt{\;} 2}{1}$ = 1 $- \sqrt{\;}$2

x’$= \frac{- b’+ \sqrt{\;} \Delta}{a} = \frac{1 + \sqrt{\;} 2}{1}$ = 1 + $\sqrt{\;}$2

{

| n | - \infty 1 - | \sqrt{2} | 0 1 | + \sqrt{2} 3 | + \infty |
| --- | --- | --- | --- | --- | --- |
| n^{2} - 2 n - 1 | + | - | - | + | + |

]$- \infty$, 0] $\notin \mathbb{N} ^{∗}$ , d’où $\forall n$ > 3, Vn $- U_{n}$ > 0.

### Conclusion

La suite (Vn) est donc supérieure à la suite ($U_{n}$ ) à partir de l’indice 3.

##### d. Suite majorées, minorées, bornées, positives, négatives

Définition
On dit qu’une suite numérique U définie sur une partie E, de $\mathbb{N}$ est :
Minorée, s’il existe un nombre réel m tel que, pour tout $nεE$,
On a : $U_{n} \geq m$ ; (m est appelé minorant).

Positive, si elle minorée par 0 ($U_{n} \geq 0$).
Majorée, s’il existe un nombre réel M tel que, pour tout n$εE$ on
a : Un $\leq M$, (M est appelé majorant).
Négative, s’il est majoré par 0.
Bornée, si elle est à la fois minorée et majorée, c'est-à-dire si on

a : m $\leq Un \leq M$.

### Exercice d’application

Montrer que la suite Un = $\frac{1}{3 + n ²}$ est bornée.

### Solution

$1^{ère}$ méthode

Montrons que la suite Un est minorée.

$\forall nεN$, on a : 3 + n² > 0 ⟺ $\frac{1}{3 + n ²}$ > 0

$U_{n}$ est positive, donc
$U_{n}$ est minoré par 0.
Démontrons que $U_{n}$ est majorée.
$\forall nεN$, on a successivement :

n $\geq$ 0 ⟺ $n^{2} \geq$ 0 ⟺ 3 + n² $\geq$ 3 ⟺ $\frac{1}{3 + n ²} \leq \frac{1}{3}$

Ainsi $U_{n}$ est majoré par $\frac{1}{3}$

### Conclusion

Comme 0 < Un $\leq \frac{1}{3}$ , donc $U_{n}$ est bornée.

$2^{ème}$ méthode

Posons f(x) = $\frac{1}{3 + x ²}$

f est définie ⟺ 3 + x² > 0 ,$\forall x \in$ R Ef $= \mathbb{R}$

Dérivée : f’(x) = $\frac{- 2 x}{( 3 + x ² ) ²}$

$\forall$ x $\in R, (3+x^{2} )^{2}$ > 0, d’où f est du signe de -2x

f’(x) = 0 ⟺ - 2x = 0 ⟺ x = 0

| x | - \infty 0 | + \infty |
| --- | --- | --- |
| f ’ ( x ) | + | - |

lim f(x)= lim $\frac{1}{3 + x^{2} = 0} ;$ f(0) = $\frac{1}{3}$

$n \to + \infty n \to + \infty$

Tableau de variation.

| x | - \infty | 0 + \infty |
| --- | --- | --- |
| f ’ ( x ) | + | - |
| f ( x ) | 1 3 | 0 |

avec ]$- \infty$; 0[ $\notin \mathbb{N}$

Or $U_{n} =$ f(n)

$\forall$ n $\in$ N

Ainsi {0 < Un $\leq \frac{1}{3}$

$U_{n}$ est bornée.

#### 2. Limites d’une suite numérique

Les propriétés sur les limites d’une somme, d’un produit, d’un quotient de deux
suites sont les mêmes que celles sur les limites d’une fonction en +$\infty$.

##### a) Limite d’une suite définie par une formule explicite

Propriété
f est une fonction de $\mathbb{R}$ vers $\mathbb{R}$, U est la suite définie par la formule explicite

$U_{n} =$ f(n).

Si f admet une limite en +$\infty$, alors U admet la même limite.
Exemple.

$\sqrt{7 n^{2}}$

Etudier la limite de la suite U =

$\sqrt{7 n^{2}} \sqrt{7 n^{2}}$

Considérons (x) . On a lim f(x)= lim = $\sqrt{\;}$1 = 1.

$n \to + \infty n \to + \infty$

Comme $U_{n} =$ f(n), alors $lim U_{n} =$ 1

n⟶+$\infty$

##### b) Suites convergentes et divergentes

Soit ($U_{n} )_{n} \in \mathbb{N}$ une suite numérique.

Si lim $U_{n} =$ l = constante, alors la suite est dite convergente.

n⟶+$\infty$

Elle converge vers l.
Si lim $U_{n} = \infty$, alors la suite $U_{n}$ est dite divergente.

n⟶+$\infty$

### Exercice d’application

Etudier la convergence de chacune des suites suivantes :

$U_{n} = \frac{3 n - 1}{3 n + 2}$ et Vn = 2n + 7

### Solution

lim $U_{n}$ = lim $\frac{3 n - 1}{3 n + 2}$ = lim $\frac{3 n}{3 n}$ = 1

n⟶+$\infty n$⟶+$\infty n$⟶+$\infty$

### Conclusion

lim $U_{n}$ = 1, donc la suite ($U_{n}$ ) est convergente vers 1.

n⟶+$\infty$

lim Vn = lim 2n + 7 = lim 2n = +$\infty$.

n⟶+$\infty n$⟶+$\infty n$⟶+$\infty$

- Conclusion : lim Vn = +$\infty$ , donc la suite ($U_{n}$ ) est divergente.

n⟶+$\infty$

##### c) Critères et théorèmes de comparaison

Critères : Soient U et V deux suites (à termes positifs) numériques

telles que $U_{n} \leq V$n.

Si Vn est convergente, alors $U_{n}$ est aussi convergente.
Théorèmes :
$l$ est un nombre réel, U, V, W sont des suites numériques.
Si à partir d’un certain indice :

$U_{n} \geq V$n

lim $U_{n}$ =+$\infty$

$n \to + \infty$

$U_{n} \geq V$n

lim $U_{n} = - \infty$

$n \to + \infty$

$U_{n} \leq V_{n} \leq W_{n}$

et alors lim Vn = l

$n \to + \infty$

lim Un = limWn = l
Ce dernier théorème est appelé Théorème des gendarmes (ou théorème
d’encadrement)

### Exercice d’application

Etudier la convergence des suites U, V, W définies respectivement par :

3$\sqrt{n^{2}}$

$U_{n}$ = , Vn $= n^{2}$ +Sin 2n ; Wn = $\frac{n^{2} + ( - 1 )^{n}}{n^{2}}$

### Solution

Etudions la convergence des suites.
lim Un.

$n \to + \infty$

1ère méthode

3$\sqrt{n^{2}}$

$U_{n}$ = = $\frac{( n - 1^{3} ) 1}{n^{2}}$ lim $\frac{( n - 1^{3} ) 1}{n^{2}}$ = lim $\frac{n^{3} 1}{n ²}$= lim $\frac{1}{n ( 2 - 1 3 )}$ = lim $\frac{1}{n^{3} 5}$ = 0

$n \to + \infty n \to + \infty n \to + \infty n \to + \infty$

lim $U_{n}$ = 0

$n \to + \infty$

### Conclusion :

Comme lim $U_{n}$ =0, alors la suite $U_{n}$ est convergente.

$n \to + \infty$

Autre méthode

3 3 3$\sqrt{n^{2}} 3 \sqrt{n ²} 3 \sqrt{n^{2}} 3 \sqrt{n^{2}}$

$\sqrt{n}$ - $1 \leq \sqrt{n \leq n}$ ⟺ $\leq \leq \frac{n}{n^{2}}$ ⟺ $\leq \leq \frac{1}{n}$

3$\sqrt{n^{2}}$

$\leq \frac{1}{n}$ . Comme lim $\frac{1}{n}$ = 0, alors lim $U_{n}$ = 0

$n \to + \infty n \to + \infty$

### Conclusion : la suite Un converge vers 0

Vn = n² + sin 2n

On sait que - $1 \leq Sin$ 2$n \leq$ 1 ⟹ - $1 \leq Sin$ 2n ⟹ - 1 + $n^{2} \leq n^{2}$ +

$Sin 2 n$ ⟹ $n^{2} - 1 \leq V_{n}$

Or lim n² - 1 = +$\infty$, alors lim Vn =+$\infty$

$n \to + \infty n \to + \infty$

### Conclusion : la suite Vn est divergente.

Wn = $\frac{n^{2} + ( - 1^{n} )}{n^{2}}$

$\forall$ n $\in \mathbb{N}$, on a : -1$\leq$ (-$1)^{n} \leq$ 1

$n^{2}$ -1$\leq n^{2}$ + (-$1)^{n} \leq n^{2}$ + 1 ⟹ $\frac{n^{2} - 1}{n^{2}} \leq \frac{n^{2} + ( - 1 ) n}{n^{2}} \leq \frac{n ² + 1}{n ²}$

Or lim $\frac{n^{2} - 1}{n^{2}}$ = lim $\frac{n^{2} + 1}{n^{2}}$ = 1

$n \to + \infty n \to + \infty$

Donc d’après le théorème des gendarmes
lim Wn = 1 la suite Wn est convergente. Elle converge vers 1.

$n \to + \infty$

##### d) Convergence d’une suite monotone

Toute suite croissante et majorée est convergente.
Toute suite décroissante et minorée est convergente.
Toute suite croissante et non majorée diverge.
Toute suite décroissante et non minorée diverge.
Exercices d’application

### Exercice 1

$U_{0}$

Soit la suite U définie par : {$U_{n}$ = = $\frac{- 2}{U_{n} + 2}$

+1
- 1) Démontrer par récurrence que $\forall$ n $\in \mathbb{N}$, -1< $U_{n} \leq$ 1.

#### 2) a. Démontrons que U est décroissante

##### b. En déduire que U est convergente

### Solution

- 1) Démontrons par récurrence que $\forall$ n $\in \mathbb{N}$, -1< $U_{n} \leq$ 1
Soit Pn : -1< $U_{n} \leq$ 1. (Hypothèse de récurrence).

Vérification au rang 0

$U_{0}$ =1 et -1< $U_{0} \leq$ 1 vrai, car $U_{0}$ = 1

Donc $P_{0}$ vraie.
Supposons que $\forall$ n $\in \mathbb{N} ,$ Pn vraie c'est-à-dire supposons que -1< $U_{n} \leq$ 1 vraie.
Démontrons alors que $P_{n}$ +1 est vraie, c'est-à-dire démontrons que -1< Un+1 $\leq$ 1
Démonstration.
On a successivement les égalités :

-1< $U_{n} \leq$ 1

⟹-1+3 < $U_{n} +3 \leq$ 4 ⟺ 2 < $U_{n} +3 \leq$ 4 ⟺ $\frac{1}{2}$ > $\frac{1}{U_{n} + 3} \geq \frac{1}{4}$

⟺ $\frac{- 2}{2}$ < $\frac{- 2}{U_{n} + 3} \leq \frac{- 2}{4}$ ⟺ -1< $U_{n} +3 \leq - \frac{1}{2}$

Or $\frac{- 1}{2}$ <1, donc on aura -1 < $U_{n}$ +1 $\leq$ 13 (C.Q.F.D.)
Donc $P_{n}$ +1 vraie.
- Conclusion : $\forall$ n $\in \mathbb{N}$, -1< $U_{n} \leq$ 1

#### 2) a. Démontrons que la suite U est décroissante.

$U_{n}$ +1 - $U_{n} = \frac{- 2}{U_{n} + 3} - U_{n}$

= $\frac{- 2 - U_{n} ² - 3 U_{n}}{U_{n} + 3}$

= $\frac{- ( U_{n} ² + 3 U_{n} + 2 )}{U_{n} + 3}$

$U_{n}$ +1 - $U_{n} = \frac{- ( U_{n} + 1 ) ( U_{n} + 2 )}{U_{n} + 3}$

Or ( $U_{n}$ +1) ( $U_{n}$ +2)> 0 alors – ( $U_{n}$ +1) ( $U_{n}$ +2)< 0

Donc $\forall$ n $\in \mathbb{N} , U_{n+1} - U_{n}$ < 0

### Conclusion

$U_{n+1} - U_{n}$ < 0, d’où U est décroissante.

##### b. Déduisons que U est convergente.

$On a démontré à la 1^{ère}$ question que -1< $U_{n} \leq$ 1

$On a démontré à la 2^{ème}$ question que la suite U est décroissante.

### Conclusion

On en déduit que U est une suite décroissante et minorée par -1, donc la suite U
est convergente.

### Exercice 2

$U_{n}$ +1 = 2$U_{n}$ + n

Soit la suite U définie par : {

$U_{0}$ = 1

- 1) Démontrer par récurrence que $\forall$ n $\in \mathbb{N} , U_{n} \geq$ 0

#### 2) Etudier le sens de variation de la suite U.

#### 3) Montrer que la suite U est divergente.

### Solution

- 1) Démontrons par récurrence que $\forall$ n $\in \mathbb{N} , U_{n} \geq$ 0
Soit Pn : $U_{n} \geq$ 0 (hypothèse de récurrence)
Vérifions au rang 0

$U_{0}$ =1 et 1$\geq$ 0 vraie, donc $P_{0}$ vraie

Supposons que $\forall$ n $\in \mathbb{N} , U_{n} \geq$ 0 vraie

Démontrons que $\forall$ n $\in \mathbb{N} , U_{n+} 1 \geq$ 0 vraie

Démonstration
On sait que $U_{n} \geq$ 0 (hypothese de récurrence)

Ainsi 2$U_{n} \geq 2$x0 ⟺ 2$U_{n} \geq$ 0 (1)

Or n $\mathbb{N}$ donc n $\geq$ 0 (2)

2$U_{n} \geq$ 0 (1)

On obtient : {

n $\geq$ 0 (2)

(1)+(2) ⟹ 2$U_{n}$ +n $\geq$ 0

$U_{n}$ +1 $\geq$ 0 C.Q.F.D

$P_{n+1}$ Vraie

### Conclusion : $\forall$ n $\in \mathbb{N} , U_{n} \geq$ 0

#### 2) Etudions le sens de variation de la suite U.

$U_{n}$ +1 - $U_{n}$ = 2$U_{n}$ + n - $U_{n}$

$U_{n}$ +1 - $U_{n} = U_{n}$ + n ; or $U_{n} \geq$ 0 d’après l’hypothèse de récurrence n $\geq$ 0 car n $\in \mathbb{N}$

Donc $U_{n}$ + n $\geq$ 0, d’où la suite U est croissante.

#### 3) Montrons que U est divergente.

On a $U_{n+}$ 1= 2$U_{n}$ +n ⟺ $U_{n+1} \geq$ n

Donc la suite U n’est pas majorée.
- Conclusion : La suite U est non majorée et croissante, elle est donc divergente.
- e) Conséquence d’une suite définie par une formule de récurrence
Limite de la composée d’une suite suivie d’une fonction
La propriété donnant la limite de la composée de deux fonctions reste
valable pour la composée d’une suite suivie d’une fonction.
Limite d’une suite définie par une formule de récurrence
Propriété :
$g$ est une fonction continue sur un intervalle I. U est une suite à

$valeurs dans I définie par son 1^{er}$ terme et la formule de récurrence

$U_{n}$ +1= g$( U_{n}$ )

Si U est la convergente, alors sa limite est une solution $α$ de
l’équation g(x) = x.

On dit que $α$ est un point fixe de la fonction g
Remarque
Si l’équation g(x) = x n’admet pas de solution dans I, alors la suite U est
divergente.

### Exercice d’application

Etudier la convergente de la suite définie par :

$U_{n}$ +1 = $U_{n} + \frac{1}{U_{n}}$

{

$U_{0}$ = 1

### Solution

Considérons la fonction g : ⟼ x $+ \frac{1}{x}$

On a $U_{n+}$ 1= g$( U_{n}$ )

g(x) = x $+ \frac{1}{x}$ Résolvons l’équation g(x) = x

On a : x $+ \frac{1}{x} =$ x ⟺ $\frac{1}{x}$ = 0.

⟺ 0x = 1 (Impossible)
Cette équation n’a pas de solution, d’où la suite U est divergente.

#### 3. Suites adjacentes

Définition :
Deux suites U et V définies sur $\mathbb{N}$ sont adjacentes si, et seulement si :
U est croissante
V est décroissante

$lim ( V_{n} - U_{n}$ ) = 0

$n \to + \infty$

Propriété
Si U et V sont deux suites adjacentes telles que U croissante et V décroissante,
alors

$\forall$ n $\in \mathbb{N}$, on a $U_{n} \leq V$n

Cela signifie que tous les termes de la suite V sont supérieurs à tous les termes
de la suite U.
Théorème
Deux suites adjacentes convergent vers la même limite.

### Exercice d’application

Soient U et V deux suites définies respectivement par :

$U_{n} = \sum ^{n}_{i=1} \frac{1}{k^{2}} = \frac{1}{1^{2}} + \frac{1}{2^{2}} + \frac{1}{3^{2}}$ + ⋯ $\frac{1}{n^{2}}$

Vn = $U_{n} + \frac{1}{n}$

Démontrer que les suites U et V sont adjacentes.

### Solution

$\forall$ n $\in \mathbb{N}$*

$U_{n}$ +1 $- U_{n}$ = ( $\frac{1}{1^{2}} + \frac{1}{2^{2}}$ + ⋯ + $\frac{1}{n^{2}} + \frac{1}{( n + 1 ) ²} )$ - $( \frac{1}{1^{2}} + \frac{1}{2^{2}}$ + ⋯ + $\frac{1}{n^{2}}$)

$U_{n}$ +1 $- U_{n} = \frac{1}{( n + 1 ) ²}$ ⟺ $\frac{1}{( n + 1 ) 2} \geq$ 0

Donc la suite U est croissante

$\forall$ n $\in \mathbb{N}$*

Vn+1 - Vn = $- U_{n} + \frac{1}{n + 1} - \frac{1}{n}$

$\frac{U_{n} + 1}{1}$

= + $\frac{1}{( n + 1 )} - \frac{1}{n}$

(n$+ 1^{2}$)

Vn+1 - Vn $= \frac{n + n ( n + 1 ) - ( n + 1 ) ²}{n ( n + 1 ) ²} = \frac{n + n 2 + n - n^{2} - 2 n - 1}{n ( n + 1 ) ²}$

= $\frac{- 1}{n ( n + 1 ) ²}$

or n (n + 1)² > 0 ⟹ $\frac{- 1}{n ( n + 1 ) ²}$ < 0

On Vn+1 - Vn < 0, donc la suite $\forall$ est décroissante.

lim (Vn - $U_{n}$ ) = lim $\frac{1}{n}$ = 0

$n \to + \infty n \to + \infty$

### Conclusion

U est décroissante, V est décroissante et lim (Vn - $U_{n}$ ) = 0, donc les suites U et V sont

$n \to + \infty$

adjacentes.

#### 4. Suites périodiques

Définition
($U_{n} )_{n\in N}$ est dite périodique de période p, s’il existe un entier non nul p tel que :

$\forall$ n $\in \mathbb{N}$,

$U_{n+p} = U_{n}$

### Exercice d’application

On considère la suite Vn = sin $\frac{nπ}{2}$. Montrer que Vn est périodique et préciser la valeur de
la période p.

### Solution

Vn = sin $\frac{nπ}{2}$

Pour montrer que Vn est périodique, on doit démontrer que $V_{+p}$n = Vn.

On a: $V_{+p}$n = sin $\frac{( n + p ) π}{2}$ (1)

On sait que les fonctions sinus sont périodiques de période 2 $π$, donc :

Vn = (sin $\frac{nπ}{2}$) = sin ($\frac{n π}{2}$ + 2$π$)

= sin ($\frac{nπ + 4 π}{2}$)

Vn = sin [$\frac{( n + 4 ) π}{2}$] (2)

On doit avoir $V_{+p}$n = Vn
(1) = (2)

Soit : sin $\frac{( n + p ) π}{2}$ = sin $\frac{( n + 4 ) π}{2}$

### Conclusion

Par identification, on déduit que la suite V est périodique de période p = 4.
Autre méthode pour calculer p
On sait que la période p des fonctions de la forme : Sin (ax + b) ou cos (ax + b) se
calcule à l’aide de la formule :

$p = \frac{2π}{| a |}$

On a : Vn = sin $\frac{nπ}{2}$ = sin ($\frac{π}{2} n$) est de la forme sin( a x + b) avec a $= \frac{π}{2} ,$ x = n et

b = 0. Alors la période p $= \frac{2 π}{| a |}$ = = $\frac{2}{\frac{π π}{2}} = \frac{4 π}{π}$ = 4. p = 4.

$\frac{2 π π}{| 2}$|

#### 5. Suites Arithmétiques (ou progressions Arithmétiques)

Définition
$Une suite (U_{n}$ ) est dite arithmétique lorsqu’il existe un nombre réel r

appelé raison tel que : ¥ n € N $: U_{n+1} = U_{n}$ + r $ou U_{n+1}$ – Un = r

Exemple $: Soit U la suite définie par U_{n}$ = 2n+1

Montrer que U est une suite arithmétique

### Solution

$Un est une suite arithmétique \to U_{n+1}$ – $U_{n} = r$

On a $: U_{n+1}$ – $U_{n}$ = 2(n+1) +1 – (2n+1)
= 2n+2+1 – 2n – 1

$U_{n+1}$ – $U_{n}$ = 2

Donc ($U_{n}$ ) est une suite arithmétique de raison r = 2
Remarque
Toute suite dont le terme général est de la forme $U_{n} =$ an + b, avec a € R, est
une suite arithmétique de raison $r = a$
Théorème

$Si (U_{n}$ ) est une suite arithmétique, alors ¥ n € N $U_{n} = \frac{U_{n} - 1 + U_{n} + 1}{2}$

Démonstration $: (U_{n}$ ) est une arithmétique, alors :

$U_{n+1}$ – $U_{n}$ = r (1)

$U_{n}$ – $U_{n-}$ 1 = r (2)

(1).(2) $\to U_{n+1}$ – $U_{n}$ – $U_{n} + U_{n-1} = 0 U_{n+1} + U_{n}$ -1 $= 2U_{n} U_{n} = \frac{Un - 1 + Un + 1}{2}$

Terme général d’une suite Arithmétique

$U_{n} = U_{o}$ + nr $Si le 1^{er} terme est U_{o}$

$U_{n} = U_{1}$ + (n-1) r $Si le 1^{er} terme est U_{1}$

Cas général (forme explicite)

$Le terme général d’une suite arithmétique de 1^{er}$ terme U et de raison r est donné

par la formule : $U_{n} = U_{\alpha}$ + (n – $\alpha ) r$

Sens de variation, limites (convergence)
U est une suite arithmétique de raison r, on sait que $: U_{n+1}$ – $U_{n}$ = r

Si r > 0, alors U est strictement croissante et lim $U_{n}$ = +$\infty ( U diverge vers +\infty )$

$n \to + \infty$

Si r < 0, alors U est strictement décroissante et lim $U_{n} = - \infty$ (U diverge vers -$\infty )$

$n \to - \infty$

Si r = 0, alors U est constante et U converge vers 0
Somme S des termes consécutifs d’une suite arithmétique

$S = nombre de termes \times \frac{1er terme + dernier terme}{2}$

Ainsi $U_{o} + U_{1} ……………………. + U_{n}$ = (n+1) $\frac{Uo + Un}{2}$

$U_{1} + U_{2}$ +….+ $U_{n}$ = n ($\frac{U1 + Un}{2}$)

Exemple : 1 +2+3+…+ n = $\frac{n ( n + 1 )}{2}$

Cas général

Sn= $U_{∝} + U_{∝+}$ 1 + $U_{∝+}$ 2 + $....+U_{n}$ = Sn = $\frac{n - ∝ + 1}{2} (U_{n} + U_{∝}$ )

Détermination d’une suite arithmétique

Une suit$e arithmétique est déterminée par son 1^{er}$ terme et sa raison ou par

deux de ces termes.

Trois réels a, b, c sont dans cet ordre les termes d’une suite arithmétique si et
seulement si l’on a : b = $\frac{a + c}{2}$ ou 2b = a + c
Exercices d’application
Calculer les cinq premiers termes de la suite arithmétique U de raison 3 et telle

que $: U_{5}$ = 10

### Solution

$On sait que U_{n+1} = U_{n}$ + r $donc U_{5}$ = U4 + r

Soit 10 = $U_{4} + 3 \to U_{4}$ = 10 – 3 = 7

De même $: U_{4} = U_{3} + 3 \to U_{3}$ = 7-3 = 4

$U_{3} = U_{2} + 3 \to U_{2}$ = 4 – 3 = 1

$Les cinq 1^{er}$ s termes de la suite sont= - 5, -2, 1, 4, 7,

### Exercice 2

$U est la suite arithmétique de raison r. On pose Sn = U_{o} + U_{1} + ………+ U_{n-1}$

- a- Sachant que $: U_{27} = 9,5 et S_{28} = 140. Calculer U_{o}$ et r
- b- Sachant que $: U_{o}$ = -$3, U_{n}$ -1 $= 69 et S_{n}$ = 330, calculer n et r

### Solution

- a. $Calcul de U_{o}$ et r $: on a S_{28} = 28 \times \frac{( Uo + U 27 )}{2}$

$2S_{28} = 28U_{o} + 28U_{27}$

$2 \times 140 = 28U_{o} + 28 \times 9,5$

280 = 28Uo + 266 $\to U$o = $\frac{280 - 266}{28} = \frac{14}{28} = \frac{1}{2}$ = 0,5

Alors, $U_{o}$ = 0,5

Calcul de r $: U_{27} = U_{o}$ + 27r r = $\frac{U 27 - U_{0}}{27} = \frac{9 , 5 - 0 , 5}{27} = \frac{9}{27} = \frac{1}{3}$

##### b. On a $: S_{n}$ = n $\frac{Uo + U_{n} - 1}{2}$

$2S_{n} = n(U_{o} + U_{n}$ -1$) \to n = \frac{2 Sn}{Uo + U_{n} - 1} = \frac{2 ( 330 )}{- 3 + 69}$ = 10 D’où n = 10

Calcul de r $: U_{n} = U_{o}$ + r r = $\frac{U_{n} - 1 - Uo}{n - 1} = \frac{69 + 3}{9} = \frac{72}{9}$ = 8 r = 8

### Exercice 3 :

Soit U la suite numérique définie sur N par $: Uo = 1 et U_{n+1} = \frac{U_{n} - 1}{U_{n} + 3}$

#### 1- $Calculer U_{1} , U_{2} , U_{3} et U_{4}$

#### 2- Prouver que $\forall$ n $\in N, U_{n}$ > -1

- 3- Démontré que la suite V définie sur $\mathbb{N} par V_{n} = \frac{1}{U_{n} + 1}$ est une suite arithmétique
- 4- $Exprimer V_{n} , puis U_{n}$ en fonction de n et étudier convergence de la suite

### Solution

- 1- $Calculons U_{1} , U_{2} , U_{3} , et U_{4} : Uo = 1, U_{1} = 0, U_{2}$ = -$1/3, U_{3}$ = -1/2 et $U_{4}$ = -3/5
- 2- Démontrons par récurrence que $\forall n \in \mathbb{N}$ donc Un > -1

$Vérification au rang de 1^{er}$ indice on a : Uo = 1, donc Uo > -1 Vrai

$\forall n \in \mathbb{N} puis supposons U_{n}$ > -$1, montrons alors que U_{n+1}$ > -1 on a :

$U_{n+1} = \frac{U_{n} - 1}{U_{n} + 3}$ = 1 $- \frac{4}{U_{n} + 3}$ or $U_{n}$ > -$1 donc U_{n}$ +3 > -1 + 3

Un+3 > 2 Divisons chaque membre par 1 : $\frac{1}{Un + 3}$ < $\frac{1}{2} \to \frac{- 4}{Un + 3}$ > $- \frac{4}{2}$ ↔ 1 -

$\frac{4}{Un + 3}$ > 1 - 2.

D’où Un+1 > 1 (C.Q.F.D)

### Conclusion : $\forall n \in N$, Un > - 1

- 3- Démontrons que v est une suite arithmétique $\forall n \in N$, on :

V$n+_{1} = \frac{1}{Un + 1 + 1}$ = = = $\frac{Un + 3}{2 Un + 2}$

$\frac{Un - 1 1}{Un + 3}$+1 $\frac{Un - 1 1 + Un + 3}{Un + 3}$

$Vn+_{1} = \frac{1}{2} \times \frac{Un + 3}{Un + 1} = \frac{1}{2} \times \frac{Un + 1 + 2}{Un + 1} = \frac{1}{2}$ (1 + $\frac{2}{Un + 1}$) = $\frac{1}{2} + \frac{1}{Un + 1}$

$Vn+_{1}$ = Vn + $\frac{1}{2}$ donc V est une suite arithmétique de raison $\frac{1}{2}$ et $de 1^{er}$ terme

Vo = $\frac{1}{Uo + 1} = \frac{1}{2}$

#### 4- Exprimons Vn puis Un en fonction de n

Vn est une suite arithmétique, donc Vn = Vo + nr Vn = $\frac{1}{2} + \frac{n}{2}$

Vn = $\frac{1}{Un + 1} \to ($Un + 1) Vn = 1 Un = $\frac{1 - n}{n + 1}$

Convergence de la suite U $\forall \in n$ N, limUn = lim ($\frac{1 - n}{1 - n}$) = 1

$n \to \infty n \to \infty$

#### 6. Suites Géométriques (Progressions géométriques)

Définition :
Une suite U est géométrique s’il existe un réel q appelé raison telle que :

$U_{n+1}$ = q

Terme général : $Un = U_{o} . q^{n} si le 1^{er} terme est U_{o}$ ou $U_{n} = U_{1} . q^{n-1}$

$Si le terme 1^{er} terme est U_{1}$

$En général si le 1^{er}$ terme est $U_{α}$ on a : Un = $U_{α} . q^{n-2}$

Sens de variation, limites (converge)
$Si q > 1 et U_{o}$ > 0, alors U est strictement croissante et limUn = + $\infty$

$n \to \infty$

$Si q < 1 et U_{O}$ < 0, alors U est strictement décroissante et limUn = $- \infty$

$n \to \infty$

$Si 0 < q < 1 et U_{o}$ ; alors U est strictement décroissante et limUn = 0

$n \to \infty$

Si q = 1, alors U est constante.
Détermination d’une suite Géométrique
Une suite géométrique est déterminée p$ar son 1^{er}$ terme et sa raison ou par deux
de ses termes.

Trois réels a, b, c sont dans cet ordre, les termes d’une suite géométrique si et
seulement si l’on : $b^{2}$ = ac
Exemple : Les trois chiffres 2, 4, 8 sont en progression géométrique $: 4 = 2 \times 8$
Somme S des termes consécutifs d’une suite géométrique

#### 1- $( raison^{nombre}$) determes

$S_{n} = 1^{er} terme \times 1 -$raison

Cas général

$S_{n} = \sum ^{\infty}_{n} Ui = U_{∝} + U_{1} + U_{2}$ +………………. $+ U_{n}$

$S_{n}$ = U∝ ($\frac{1 - q^{n} ( - ∝ + 1 )}{1 - q}$)

Insertion des termes
Insérer n termes géométriques entre deux nombres x et y non nuls, c’est
déterminer une progression géométrique dont les termes extrêmes sont x et
- y. En pratique, il faut d’abord déterminer la nouvelle raison q pour la

relation $: q’=^{n+1} \sqrt{q}$ avec q = $\frac{y}{x}$

Exercices d’application
Insérer deux nombres géométriques a = 2 et b = 54

### Solution

q = $\frac{a}{b} = \frac{54}{2} = 27 q’=^{n+1} \sqrt{27 =^{3} \sqrt{\;}}$27 = 3 (n = 2)

$La nouvelle suite est 2, 6, 18, 54, (en effet U_{o} = 2, U_{1} = U_{o} q’= 2 \times 3= 6$

### Exercice 2

V est suite géométrique de raison q. On pose $: S_{n} = V_{o} + V_{1} + ………+ V_{n+1}$ (n € N*)

- a) $Sachant que V_{o} = 343 et V_{3} = 1. Calculer q et S_{4}$
- b) $Sachant que q = 2, V_{o} = 7 S_{n} = 1785. Calculer n et V_{n+1}$

### Solution

##### a. Calcul de q

On sait que $: V_{n} = V_{o} . q^{n}$

$Donc V_{3} = Vo q^{3} \to q^{3} = \frac{V 3}{V o} = \frac{1}{343}$

q = ∛$\frac{1}{343} = \frac{∛ 1}{∛ 343} = \frac{1}{7}$ q = $\frac{1}{7}$

Calcul de S4

S4 = Vo $\frac{1 - q 4}{1 - q}$

S4 =343 ($\frac{1 - ( 1_{4} 7 )}{1 - 1 7} ) S4 = 343 \times 7/6 (2400/2401) = 400$

S4 = 400
- b. Calcul de n et Vn$-_{1} On sait que Sn = V_{o} \frac{( 1 - qn )}{1 - q} Sn = V_{o} \frac{qn - 1}{q - 1}$

$Sn = Vo q_{n}$ – $Vo = S_{n}$ (q-1)

$q_{n} = \frac{( q - 1 ) S_{n} + Vo}{Vo} q_{n} = \frac{( q - 1 ) Sn}{Vo}$ + 1

A.N :

$q_{n} = \frac{1785}{7}$ + 1 $q_{n} = 256 or 256 = 2^{8}$

$q_{n} = 2^{8}$ n = 8

Calcul de Vn$-_{1} : V_{n} = Vo q_{n} donc V_{n}$ -1 $= Vo.q^{n-1}$

A.N :

Vn- $1 = 7(2)^{7} V$n- 1 = 896

### Exercice 4

Soit U, la suite numérique définie par : $U_{o} = 2 et U_{n+1} = \frac{2}{3} U_{n}$ + 1

$On considère la suite V définie sur N par V_{n} = U_{n}$ – 3

1-Démontrer que V est une suite géométrique

2-Exprime$r V_{n} , puis U_{n}$ en fonction de n

3-Etudier la convergence de U

### Solution

Soit (Un) définie par $: U_{o} = 2, U_{n+1} = \frac{2}{3} U_{n}$ + 1 $et V_{n} = U_{n}$ -3

1-$) Déterminons que (V_{n}$ ) est une suite Géométrique

On sait que $: V_{n+1} = q.V_{n} V_{n} = U_{n}$ – 3

$Au rang n+1, V_{n+1} = U_{n+1}$ – 3

$V_{n+1} = \frac{2}{3} U_{n}$ + 1 – 3

$V_{n+1} = \frac{2}{3} U_{n}$ – 2 (1)

$On sait que V_{n} = U_{n}$ – $3 alors U_{n} = V_{n}$ + 3 (2)

Remplaçons (2) et (1) on a $: V_{n+1} = \frac{2}{3} (V_{n}$ + 3)

$V_{n+1} = \frac{2}{3} V_{n}$

$Cette relation montre que V_{n}$ une suite géométrique de raison q = $\frac{2}{3} et de 1^{er} terme V_{o}$

$=U_{o}$ – 3 = 2 – 3 = -1

2-$) Exprimons V_{n} puis U_{n}$ en fonction de n

$V_{n}$ en fonction $: V_{n} = Vo q^{n}$

$V_{n}$ = (-1)($\frac{2}{3} )^{n} V_{n}$ = - ($\frac{2}{3} )^{n}$

$U_{n}$ en fonction de n $: U_{n} = V_{n} + 3 U_{n}$ = 3 – ( $\frac{2}{3} )^{n}$

3-) Convergence de U $: On sait que V est une suite géométrique de 1^{er} terme V_{o}$ = 1 et

de raison q = $\frac{2}{3}$ d’où on a 0 < $\frac{2}{3}$ < 1 $et U_{o}$ = -1 Uo < 0

$(V_{n}$ ) est donc une suite croissante et limVn = 0

$n \to \infty$

$La suite (U_{n}$ ) converge vers 3

Suites récurrentes d’ordre 2

##### a) Définition

$On appelle suite récurrente d’ordre 2, toute suite (U_{n}$ ) définie par ses deux premiers

termes et la relation de récurrence : $aU_{n+2} + b U_{n+1} + cU_{n}$ = 0

Exemple

La suite U définie par $: U_{o} =1, U_{1} = et U_{n+2} + 2U_{n+1}$ – $U_{n}$ = 0 est une suite récurrente

d’ordre 2

##### b) Equation caractéristique

Soit une suite définie par $: U_{o} = 2 et aU_{n+2} + bU_{n+1} + cU_{n}$ = 0 (a$\neq$0)

On appelle équation caractéristique de la suite, l’équation : $aq^{2}$ – bq – cq = 0

### Exercice 1 :

$Soit (U_{n} ) la suite définie par U_{o} = 1, U_{1} = 0 et 2U_{n+2}$ – $U_{n+1}$ – $U_{n}$ = 0

L’équation caractéristique est $: 2q^{2}$ – q – 1 = 0
- Exercice 2 $: La suite (U_{n} ) U_{o} = 1, U_{1} = 0 et U_{n+2}$ – $3U_{n+1} + 2U_{n}$ =0
A pour équation caractéristique $: q^{2}$ – 3q + 2 = 0

##### c) Terme général d’une suite d’ordre 2

$Soit (U_{n} ) la suite définie par U_{o} € R, U_{1} € R et aU_{n+2} + bU_{n+1} + cU_{n}$ =0

- 1. On détermine l’équation caractéristique $: aq^{2}$ + bq + c =0

#### 2. On résout l’équation caractéristique

On a $: \Delta = b^{2}$ – 4ac

$Si \Delta < 0, l’équation aq^{2}$ + q + c = 0 n’admet pas de racine

$Si \Delta = 0, l’équation admet une racine double : q_{1} = q_{2} = \frac{- b}{2 a}$

Dans ce cas $: U_{n}$ = ( ∝ n + $β ) q^{n}$

Avec ∝ $\in R$ et $β \in R$

$Si \Delta > 0, l’équation admet deux racines distinctes qui sont : q_{1} = \frac{- b - \sqrt{\;} \Delta}{2 a}$ et

$q_{2} = \frac{- b + \sqrt{\;} \Delta}{2 a}$

$Dans ce cas U_{n}$ =∝ $q_{1} n$ + $β q_{1} n$

### Exercice d’application

### Exercice 1 :

Déterminer le terme général de la suite Un définie par :

$U_{o} = 0 , U_{1} = 1 et U_{n+2} + 2U_{n+1} + U_{n}$ = 0

Equation caractéristique $: q^{2}$ + 2q +1 = 0

$\Delta = ( 2)^{2}$ – 4(2)(1) = 0

L’équation admet une racine double q = $\frac{- 2}{2}$ = 1
D’où Un= (∝ n + $β$)(-$1)^{n}$ =0
Déterminons ∝ et $β$

On a Uo = 0 alors Uo = (∝$\times$ 0 + $β$)(-$1)^{0} = 0 β$=0

De même, on a $: U_{1}$ = 1
$Soit U_{1}$ = (∝ +$β$)(-$1)^{1}$ = 1 ∝ - $β$= 1 or $β$ = 0 , - ∝= 1 ∝= - 1

### Conclusion

Le terme général de la suite est donc $: U_{n}$ = (-n)(-$1)^{n} ou U_{n}$ = (n)(-1)(-$1)^{n}$

$U_{n}$ = n(-$1)^{1}$ (-1) n $U_{n}$ = n(-1) n+1

Exemple 2

$Trouver le terme général de la suite (U_{n}$ ) définie par $: U_{o} =0, U_{1}$ = 1 et

$U_{n+2} + 3U_{n+1}$ – $4U_{n}$ = 0

### Solution

L’équation caractéristique est $: q^{2}$ + 3q – 4= 0
$\Delta = b^{2}$ – 4(-4) $\Delta = 5^{2}$ l’équation admet deux racines distinctes qui
sont

$q_{1} = \frac{- b - \sqrt{\;} \Delta}{2 a} = \frac{- 3 - 5}{2}$ = - $4 et q_{2} = \frac{- b + \sqrt{\;} \Delta}{2 a} = \frac{- 3 + 5}{2}$= 1

Dans ce cas $U_{n}$ = ∝ $q_{1} n$ + $β q_{2} n$

Un = ∝(-$4)^{n} + β (1)^{n}$

Pour n = 0 $U_{o}$ = 0
$U_{o}$ = ∝ (- 4)0 + $β$(1)0 Uo =∝ +$β$ ∝ +$β$ = 0 (1)

Pour n= 1 $U_{1} = 1 U_{1}$ = -4∝ +$β$ - 4∝ +$β$ = 1

(1) $\to$ ∝= - $β$(3)

(2) Dans (2) on a : 4$β$ + $β$ = 1 et $β$ = $- \frac{1}{5}$

D’où le terme général d’une suite : $U_{n} = - \frac{1}{5} ($- $4 )^{n} + \frac{1}{5}$

### FICHE N° 8

### THEME : Analyse combinatoire

OBJECTIF GENERAL : Réaliser des activités diverses
OBJECTIF SPECIFIQUE :
DUREE DE LA SEQUENCE DE L’ENSEIGNEMENT/D’APPRENTISSAGE :
Plan du cours

#### 1. Ensembles équipotents

#### 2. Ensemble fini

#### 3. Propriétés des cardinaux d’ensembles finis

##### a. Théorème

##### b. Conséquence

#### 4. P-listes, arrangements, permutations

#### 5. Combinaison

##### a. Définition

#### 6. Outils de dénombrement

##### a. Modèle de base

##### b. Applications

## CHAPITRE VIII : ANALYSE COMBINATOIRE

#### 1. Ensembles équipotents

On dit que deux ensembles E et F sont équipotents, si et seulement s’il existe une
bijection de l’un sur l’autre.
Exemple
Soit E = N, l’ensemble des entiers naturels et F l’ensemble des entiers naturels pairs.
L’application : E F
n 2n est une bijection de E sur F.
Les ensembles E et F sont équipotents.

#### 2. Ensemble fini

On dit qu’ensemble E est fini, si et seulement s’il est vide ou s’il existe un entier naturel n
tel que E soit équipotent aux sous-ensembles de $\mathbb{N}$ contenant n élément. On note :
Card(E)=n le nombre d’éléments de E. Lorsque E est égal à l’ensemble vide,
Alors , Card (E ) = 0
On a : Card ($φ$ ) = 0
Un ensemble qui n’est pas fini est appelé ensemble infini. Exemple l’ensemble $\mathbb{N}$
est infini.

#### 3. Propriétés des cardinaux d’ensembles finis

##### a) Théorème

Soit E et F deux ensembles finis quelconques, alors :

E F

$E \cap F$

EUF
Card($E \cup F$) = Card (E) + Card(F) - Card($E \cap ($F)

##### b) Conséquence

| E F |  | Si E et F sont disjoints c’est - à - dire E \cap F = \emptyset , |
| --- | --- | --- |
|  | Alors | ( ) ( ) Card E \cup F = Card E + Card ( F ) |

EUF
Remarques
Soit E et F deux ensembles finis quelconques, alors : E x F est aussi un ensemble fini :

$\frac{Card Card ( F )}{\frac{( E \times F ) = Card ( E ) \times}{Card ( E ) \leq Card ( F )}}$

$Si E \subset F$ alors

Applications
- 1. Dans une classe de 30 élèves, 20 étudient l’anglais et 15 l’allemand. Sachant que
tous les élèves étudient au moins l’une des deux langues ; l’anglais ou l’allemand.
Combien y-a-t-il d’élèves étudiant :
- a) A la fois l’anglais et l’allemand ?
- b) Seulement l’anglais ?
- c) Seulement l’allemand ?

### Solution

- a) Soit E l’ensemble des élèves étudiant l’anglais : Card (E ) = 20
Soit F l’ensemble des élèves étudiant l’allemand : Card (F) = 15
Ici 30 élèves correspondent au Card (EUF). On a : Card (EUF) = 30
Le nombre d’élèves étudiant à la fois l’anglais et l’allemand correspond au

$Card ( E \cap F$)

On a : Card($E \cup F$) = Card (E) + Card(F) - Card($E \cap F$)
⟺ 30 = 20 + 15 - Card($E \cap F$) alors Card($E \cap F$) = 5
Il y a cinq élèves qui étudient à la fois l’anglais et l’allemand.

##### b) Elèves étudiant uniquement l’anglais. 20 – 5 = 15

15 élèves étudient uniquement l’anglais.

##### c) Elèves étudiant uniquement l’allemand. 15 – 5 = 10

10 élèves étudient uniquement l’allemand.
- 2. Dans un groupe de 25 personnes, 10 jouent au basket-ball, 17 jouent au football et 8
pratiquent ces deux sports,
Détermine le nombre de personnes :
- a) Qui jouent seulement au football, seulement au basket-ball,

##### b) Qui ne pratiquent aucun de ces deux sports.

### Solution

E F Card($E \cup F$) = 25
Card (E) = 10
Card(F) = 17

#### 10 - 8 8 17 - 8 Card($E \cap F$) = 8

##### a) On a : 17-8=9, donc 9 personnes qui jouent seulement au

football.

$\frac{25 - ( 2 - 8 - 9 )}{EUF}$

De même 10 – 8 = 2, donc 2 personnes qui jouent seulement au basket-ball.
- b) On en déduit que 25 – (9 + 8 + 2) = 6, donc 6 personnes ne pratiquent aucun de ces
deux sports.

#### 4. P-LISTES, ARRANGEMENTS, PERMUTATIONS

Soit E un ensemble fini et n son cardinal, Soit p un entier naturel non nul.
Une p-liste d’éléments de E est un p - uplet (U1. U2, … Un) constituée
d’éléments de E. Une p-liste est un élément de l’ensemble $E^{p}$ et on a :

Card $( E^{p}$ ) = (Card $E )^{p} = n^{p}$

Un arrangement de p éléments de E est une p-liste d’éléments de E.
Nécessairement

( $p \leq n$)

On distingue deux types d’arrangements : arrangement avec répétition et
arrangement sans répétition.

Le nombre d’arrangements avec répétition de p éléments d’un ensemble contenant

n éléments est : $A_{n} p = n^{p} , avec p \leq n et n\geq 1$

Le nombre d’arrangements sans répétition de p éléments pris parmi n éléments est :

$A_{n} p$ = n(n - 1) … $\times ($n - p + 1) = $\frac{n !}{( n - p ) !}$ (1 $\leq P \leq n$)

Exemple : $A^{3}_{8}$ = 8 $\times 7 \times$ 6 = 336

Ou $A^{3}_{8} = \frac{8 !}{( 8 - 3 ) !} = \frac{8 !}{5 !} = \frac{8 \times 7 \times 6 \times 5 !}{5 !} = 336$

Une permutation de E est un arrangement sans répétition des n éléments de E.
Le nombre de permutations de E est : $P_{n} =$ n! avec 1 ! =1 ; 0 !=1

#### 5. Combinaison

##### a) Définition

Soit n et p deux entiers naturels tels que $p \leq n$
Une combinaison de p éléments d’un ensemble E de n éléments est une partie
non ordonnée de p éléments distincts de E.
Le nombre de combinaisons (ou parties) de p éléments d’un ensemble à n
éléments est :

$C_{n} p = \frac{n !}{p ! ( n - p ) !} = \frac{A^{P}_{n}}{p !}$

Exemple:

$\frac{7 !}{4 ! ( 7 - 4 ) !} \frac{7 !}{4 ! 3 !} 7 \times 6 \times 5 \times$ 4!

$C_{7}^{4}$ = = = = 35

4! 3 $\times 2 \times$ 1

##### b) Propriétés

Pour tout entier naturel n,

Remarque
Soit A une partie de E. A est la partie complémentaire de A dans E et on écrit :

A$= C_{E} A$ = {$x \in E / x \notin A$}

$A \cap A = \emptyset$

{ lois de Morgan.

$A \cup A = E$

Si A et B sont des parties de E : $A \cap B$ = A$\cup B ;$A$\cup$B = A$\cup B$

Le triangle de Pascal : (Blaise Pascal) mathématicien, physicien et
philosophe Français 1923-1662).
Soit n et P deux entiers naturels tels que : $P \leq n$ on a : $C_{n} n$- p $= C_{n} p$

Si de plus n < p < n, alors $C_{n} p$+1 = $C_{n} p + C_{n} p$+1

+1
(formule de Pascal qui permet de construire les lignes successives du triangle
de Pascal).

| 1 |  |  |  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 1 |  |  |  |  |  |  |  |
| 1 | 2 | 1 |  |  |  |  |  |  |
| 1 | 3 | 3 | 1 |  |  |  |  |  |
| 1 | 4 | 6 | 4 | 1 |  |  |  |  |
| 1 | 5 | 10 | 10 | 5 | 1 |  |  |  |
| 1 | 6 | 15 | 20 | 15 | 6 | 1 |  |  |
| 1 | 7 | 21 | 35 | 35 | 21 | 7 | 1 |  |
| 1 | 8 | 28 | 56 | 70 | 56 | 28 | 7 | 1 |

p
n 0 1 2 3 4 5 6 7 8 9
7 Ligne 7
Colonnes 3

$\frac{Exemples}{( x + y )^{5} =}$

$x^{5}$ + 5$x^{4} y$ + 10$x^{3} y^{2}$ + 10$x^{2} y^{3}$ + 5$x y^{4} + y^{5}$

(x + $y )^{5} = x^{5} - 5 x^{4} y$ + 10$x^{3} y^{2} - 10 x^{2} y^{3}$ + 5$x y^{4} - y^{5}$

Isaac Newton : (physicien, mathématicien et astronome Anglais 1642 – 1727)
Pour tous réels a et b et tout entier non nul n, on a :

(a + $b )^{n} = a^{n} + C_{n}^{1} a^{n-1} b$ + ⋯ + $C_{n} p a^{n-} p$b + ⋯ + $b^{n}$

$n$

($a + b )^{n} = \sum C_{n} p a^{n-p} b^{p}$

$p = 0$

Cette formule explique le nom de coefficients binomiaux donné aux nombres $C_{n} p$
Exemple

(a + $b )^{3} = a^{3}$ + 3$a^{2} b$ + 3$a b^{2} + b^{3}$

(a - $b )^{3} = a^{3}$ + 3$a^{2} b$ + 3$a b^{2} - b^{3}$

#### 6. Outils de dénombrement

##### a. Modèle de base

Soient n et p deux entiers naturels.
Les tirages de P boules dans une urne qui contient n boules modélisent de
nombreux problèmes de dénombrement.

|  |  | On effectue p tirages |  | Résultat |
| --- | --- | --- | --- | --- |
| Modélisation | Les p éléments sont ordonnés | Les p éléments sont distincts | Outil | (Nombre de tirages) |
| Tirages successifs avec remise | Oui | Non | p - uplet de E | p n^{p} = A_{n} |
|  |  |  | Arrangement de p | n ! p A_{n} = Avec |
| Tirages successifs sans remise | Oui | Oui | élémen ts de E | ( ) n - p ! p \leq n |
| Tirages simultanés | Non | Oui | Combinaison de p | n ! p C_{n} = |
|  |  |  | éléments de E | ( ) p ! n - p ! |

NB : $A_{n} p$ = ordre ; $C_{n} p$ = désordre

##### b. Applications

Exemple 01
Soit E l’ensemble de défini par E = {1;2; 3; 4}.
- a) Ecrire tous les nombres de trois chiffres distincts à l’aide des
éléments de E. Combien y en a-t-il ?
- b) Parmi ces nombres, combien sont divisibles par 6 ? divisibles par 9 ?
- c) Démontrer à l’aide d’un arbre, qu’il existe 24 nombres de trois
chiffres distincts choisis parmi les éléments de l’ensemble
{1;2; 3; 4}.
- d) Combien y a-t-il de nombres de trois chiffres, distinctes ou non,
choisis parmi les éléments de cet ensemble ?

### Solution

- a) Pour écrire un nombre de trois chiffres distincts, on peut procéder en deux
étapes :
Choisir trois éléments de F ;
Ecrire tous les nombres distincts obtenus à partir de ces trois éléments.
Ou bien :
4 branches pour les centaines ;
4 x 4 =16 branches pour les dizaines ;
4 x 4 x 4= 64 branches pour les unités.
123 132 213 231 312 321
124 142 214 241 412 421 Ou encore :
143 314 341 413 431 $P_{4}$ = 4 !=4 x 9 x 2 x 1 = 24
234 243 324 342 423 432

- b) Parmi ces 24 nombres, 6 sont divisibles par 6 (132 ; 312 ; 234 ; 324 ;
342 ; 432) et 6 sont divisibles par 9 (234 ; 243 ; 324 ;342 ;423 ;432).
- c) On convient de choisir dans l’ordre : les chiffres des centaines, des
dizaines, des unités.
On construit ainsi un arbre de choix à trois niveaux.
On obtient :
4 choix possibles pour le chiffre des centaines, donc 4 branches ;
Pour chacune de ces 4 branches, 3 choix possibles pour le chiffre des dizaines, donc :
4 x 3, c’est -à-dire 12 branches ;
Pour chacune de ces 12 branches, 2 choix possibles pour le chiffre des unités, donc :
4 x 3 x 2, c’est-à-dire 24 branches.
A chacune des 24 branches de l’arbre ainsi construit, il correspond un des nombres
cherchés.
Centaines 1 2 3 4
142124 132134 142143 213214 231234 241243 312314321324 341342 412413421423 431432
D’un même chiffre peut être choisi une fois, deux fois ou trois fois. Il y a donc 4 choix
possible = ………… l’arrivée des trois premiers. On se propose de déterminer le nombre
de podiums possible, en supposant qu’il n’y a pas d’ex ce quo.
Exemple 2 :
On dispose de quatre pièces de monnaie. Une de 10frs, une de 25 frs, une de 50 frs et
une de 100 frs. Quelles sont toutes les sommes possibles que l’on peut constituer avec
ces pièces ?

### Solution :

Pour systématiser cette recherche, on peut se demander, pour chaque pièce, si on prend
ou non.
On convient de noter respectivement 0 et 1 les réponses NON et OUI à cette question.
On construit ainsi un arbre dont chaque niveau correspond à une pièce de monnaie.
A chaque branche de cet arbre est associée une somme d’argent et l’ensemble des
branches permet de déterminer toutes les sommes possibles.
100f 50f 25f 10f
0 ----------------- 0000 ----------------- 0 F
0 1 0001 - 10 F
0 0 ------------------ 0010 ----------------- 25 F
1 1 0011 - 35 F
0 0 ------------------ 0100 ----------------- 50 F
0 1 0101 - 60 F
1 0 ------------------ 0110 ----------------- 75 F
1 1 0111 - 85 F
0 ------------------ 1000 ----------------- 100 F
0 1 1001 - 110 F
0 0 ------------------ 1010 ----------------- 125 F
1 1 1011 - 135 F
1 0 ------------------ 1100 ----------------- 150 F
0 1 1101 - 160 F
1 0 ------------------ 1110 ----------------- 175 F
1 1 1111 - 185 F
La branche 0110 est associé 50 + 25 = 75 f
La branche 1011 est associe : 100 + 25 +10 = 135f
Cette méthode est exhaustive, elle permet de déterminer toutes les sommes
possibles.
Exemple 3 :
Dix athlètes participent à une course, on appelle podium l’arrivée des trois premiers. On
se propose de déterminer le nombre de podiums possibles, en supposant qu’il n’y a pas
d’ex aequo.

### Solution :

Un podium est constitué de trois éléments deux à deux distincts. Il y a un ordre, donc le
podium cherché est un arrangement de trois éléments de l’ensemble des dix sportifs,
c’est-à-dire 3 athlètes pris parmi 10. On a :

$A^{3}_{10} = \frac{10 !}{( 10 - 3 ) !} = \frac{10 !}{7 !} = \frac{10 \times 9 \times 8 \times 7 !}{7 !} =$ 720 podium possibles

Exemple 4
On désire sélectionner 6 joueurs parmi les 15 membres d’un Club pour constituer une
équipe de volley-ball. Déterminer le nombre de sélections différentes que l’on peut
former.

### Solution :

Chaque sélection est un sous-ensemble de 6 éléments de l’ensemble E des 15 membres
du Club, c’est-à-dire une combinaison de 6 joueurs pris parmi 15.
Le nombre de sélections possibles est donc :

6 $\frac{A^{6}_{15}}{6 !} \frac{15 !}{6 ! ( 15 - 6 ) !} \frac{15 !}{6 ! 9 !} 15 \times 14 \times 13 \times 12 \times 11 \times 10 \times$ 9!

$C_{15}$ = = = = = 5005

6 $\times 5 \times 4 \times 3 \times 2 \times 1 \times$ 9!

Exemple 5
Une urne contient 12 boules numérotées de 1 à 12. On tire 3 boules de cette urne.
Calculer le nombre de tirages distincts dans les trois cas suivants :
- a) Les boules sont tirées l’une après l’autre, en remettant chaque fois la boule tirée
dans l’urne ;
- b) Les boules sont tirées l’une après l’autre sans les remettre dans l’urne ;

##### c) Les trous boules sont tirées simultanément.

### Solution

Soit U l’ensemble des 12 boules contenues dans l’urne. On a : n=12 et p=3
- a) On -tire 3 boules de cette urne, l’une après l’autre en remettant chaque fois la
boule tirée dans l’urne : une telle manipulation est appelée « tirages successifs
avec remise ».
Les boules sont ordonnées puisqu’on les tire l’une après l’autre ; elles ne sont pas
nécessairement distinctes puisqu’on remet la boule tirée dans l’urne après chaque
tirage.
On a donc : $α_{12}$3 = $12^{3} =$ 1728 tirages distincts
- b) On tire 3 boules de l’urne, l’une après l’autre sans les remettre dans l’urne : Une
telle manipulation est appelée « tirages successifs sans remise »
Les boules sont ordonnées puisqu’on les tire l’une après l’autre ; elles sont
distinctes puisqu’on ne remet pas la boule tirée dans l’urne après chaque tirage.

On a alors : $A_{12}$3 = $\frac{12 !}{( 12 - 3 ) !} = \frac{12 !}{9 !} =$ 1320 tirages distincts

- c) On tire simultanément 3 boules de l’urne : une telle manipulation est appelée
« tirage simultané ».
Les boules ne sont pas ordonnées et elles sont distinctes puisqu’on les tires
simultanément.

$\frac{12 !}{3 ! ( 12 - 3 ) !} \frac{12 !}{3 ! 9 !} 12 \times 11 \times 10 \times 9$!

On a alors : $C_{12}^{3}$ = = = $3 \times 2 \times 1 \times 9$ ! = 220 tirages distincts

Exemple 6
Une urne contient 12 boules numérotées de 1 à 12 dont 3 sont rouges, 4 vertes et 5
blanches. On tire successivement et avec remise, 3 boules de cette urne.
Calculer le nombre de tirages distincts dans les deux cas suivants :
- a) Les trois boules tirées sont de la même couleur ; la première et la troisième
boules tirées sont vertes.

### Solution

Soit n = 12 boules contenues dans l’urne : 3 Rouges, 4Vertes et 5 Blanches.
Le tirage étant successif et avec remise.
- a) Les trois boules tirées sont de la même couleur signifie que les trois boules tirées
peuvent être, soit rouges, soit vertes, soit blanches.
Le nombre de tirages distincts de trois boules de même couleur est donc :

$A^{3}_{3} + A^{3}_{4} + A^{3}_{5} = 3^{3} + 4^{3} + 5^{3} = 216$ tirages

- b) La première et la troisième boule tirées sont vertes : on a :

$A^{1}_{4} \times A^{1}_{3} \times A^{1}_{4} + A^{1}_{4} \times A^{1}_{5} \times A^{1}_{4} + A^{1}_{4} \times A^{1}_{4} \times A^{1}_{4}$

= 4 $\times 3 \times$ 4 + 4 $\times 5 \times$ 4 + 4 $\times 4 \times$ 4 = 48 + 80 + 64 = 192 Tirages

Exemple 7
Une urne contient 3 boules rouges (3R), 4 vertes (4V) et 5 blanches (5B).
On tire simultanément 3 boules de cette urne. Calculer le nombre de tirages distincts
dans les deux cas suivants :
- a) Une des boules au moins est blanche ;

##### b) Il y a aux plus deux couleurs distinctes dans le tirage.

### Solution :

n = 12 (3R + 4V +5B)
p = 3 Tirage simultané et sans remise
- a) Soit A l’ensemble des tirages de 3 boules contenant « au moins une boule blanche »

Card(A) = $C_{3} 1 \times C_{4} 1 \times C_{5}$1 + $C_{3} 2 \times C_{5}$1 + $C_{3} 1 \times C_{5}$2 + $C_{4} 1 \times C_{5}$2 + $C_{5}$3

4 $\times 3 \times$ 2! 5 $\times 4 \times$ 3! 5 $\times 4 \times$ 3!

Card(A) = 3 $\times 4 \times$ 5 + 3 $\times$ 5 + $\times$ 5 + 3 $\times$ + 4 $\times$

2 $\times 1 \times$ 2! 2 $\times 1 \times$ 3! 2 $\times 1 \times$ 3!

5 $\times 4 \times$ 3!

+

3! $\times 2 \times$ 1!

Card(A) = 60 + 15 + 30 + 30 + 40 + 10 = 185

$\frac{C ard ( A ) = 185 tirages}{"}$

- b) Soit B l’événement “Il y a aux plus deux couleurs distincts dans le tirage

Card(B) = $C_{3} 1 \times C_{4}$2 + $C_{3} 1 \times C_{5}$2 + $C_{4} 1 \times C_{3}$2 + $C_{5} 1 \times C_{3}$2 + $C_{3}$3 + $C_{4}$3 + $C_{5}$3 + $C_{4} 1 \times C_{5}$2

+ $C_{5}^{1} \times C_{4}^{2}$

Card(B) = 18 + 30 + 12 = 160

$\frac{+ 15 + 1 + 4 + 10 + 40 + 20}{Card ( B ) = 160 tirages}$

### Exercice 8

Un jeu de 32 cartes est constitué de 4 « couleurs » Pique (), cœur (), carreau (),
trèfle () contenant chacune l’As, le Roi, la Dame, le Valet, le 10, le 9, le 8 et le 7.
On tire simultanément 5 cartes de ce jeu.
Calculer le nombre de tirages distincts dans les cas suivants.
- a) Les 5 cartes sont quelconques ;
- b) Il y a exactement 2 As parmi les 5 cartes ;
- c) Il y a au moins 1 As parmi les 5 cartes ;

##### d) Les 5 cartes sont de la même « couleur ».

### Solution

Les cartes sont tirées simultanément, elles sont donc non ordonnées et distinctes. On a
des tirages simultanés et on doit donc utiliser des combinaisons.
- a) Le nombre de combinaisons de 5 éléments d’un ensemble à 32 éléments est

$C_{32}^{5}$ .

Le nombre de tirages distincts de 5 cartes quelconques est donc :

5 $\frac{31 !}{5 ! ( 32 - 5 ) !} \frac{32 !}{5 ! 27 !} 32 \times 31 \times 30 \times 29 \times 28 \times$27!

$C_{32}$ = = = 5$\times 4 \times 3 \times 2 \times 1 \times$27! = 201376.

- b) Soit B l’ensemble de mains de 5 cartes contenant « exactement 2 As parmi
les 5 cartes ».
On obtient le Card(B) en appliquant le principe multiplicatif, c’est-à-dire en
multipliant le nombre de tirages de 2 As parmi les 4 et le nombre de tirage
des 3 cartes parmi les 28 autres cartes que les As.
Le nombre de tirages de 5 cartes contenant exactement 2 As est donc :

Card(B) = $C_{4}^{2} \times C_{28}^{3} = \frac{4 !}{2 ! ( 4 - 2 ) !} \times \frac{28 !}{3 ! ( 28 - 3 ) !} = \frac{4 !}{2 ! 2 !} \times \frac{28 !}{3 ! 25 !}$

4 $\times 3 \times$ 2! 28 $\times 27 \times 26 \times$ 25

Card(B) = $\times =$ 19656

2! 2 $\times$ 1! 3 $\times 2 \times 1 \times$ 25!

- c) Soit E l’ensemble des tirages de 5 cartes quelconques et C l’ensemble de
tirages de 5 cartes contenant au moins un As.
On utilise le complémentaire de C dans E.
EC est l’ensemble des tirages ne contenant pas d’As, donc :

Card ($E \ C$) = $C_{28}^{5}$ .

On en déduit que : Card (C) = Card (E) – Card ($E \ C$)

Card (C ) = $C_{32}^{5} - C_{28}^{5}$

Card(C) = 201376 - 98280 = 108096
- d) Les 5 cartes peuvent être soit 5 piques, soit 5 cœurs, soit 5 carreaux, soit 5
trèfles.
Le nombre de tirages de 5 cartes parmi les 8 Piques est $C_{8}^{5}$
Il en est de même pour les trois autres couleurs.
Le nombre de tirages de 5 cartes de la même couleur est donc :

$C_{8}$5 + $C_{8}$5 + $C_{8}$5 + $C_{8}$5 = 56 + 56 + 56 + 56 = 224

NB : Pour la question c, on pouvait encore raisonner autrement :
Soit C « l’événement d’obtenir au moins 1 As parmi les 5 cartes »

Card(C) = $C_{4}^{1} \times C_{28}^{4} + C_{4}^{2} \times C_{28}^{3} + C_{4}^{3} \times C_{28}^{2} + C_{4}^{4} \times C_{28}^{1}$

Card(C) = 4 $\times \frac{28 !}{4 ! 24 !} + \frac{4 !}{2 ! 2 !} \times \frac{28 !}{3 ! 25 !} + \frac{4 !}{3 ! 1 !} \times \frac{28 !}{2 ! 26 !}$ + 1 $\times \frac{28 !}{1 ! 27 !}$

28 $\times 27 \times 26 \times 25 \times$ 24! 4 $\times 3 \times 2 \times$ 1!

Card(C) = 4 $\times$ +

4 $\times 3 \times 2 \times$ 1! $\times$ 24! 2 $\times$ 1!2!

28 $\times 27 \times 26 \times$ 25! $\frac{4 \times 3 !}{3 !} 28 \times 27 \times$ 26!

$\times + \times$ + 28

3 $\times 2 \times$ 1! $\times$ 25! 2 $\times$ 1!26!

Card(C) = 14 $\times 9 \times 26 \times$ 25 + 2 $\times 3 \times 14 \times 9 \times$ 26 + 4 $\times 14 \times$ 27 + 28

Card(C) = 81900 + 19656 + 1512 + 28 ⟹ Card(C) = 103096

### FICHE N° 9

### THEME : PROBABILITES

OBJECTIF GENERAL : Réaliser des activités diverses
OBJECTIF SPECIFIQUE :
DUREE DE LA SEQUENCE DE L’ENSEIGNEMENT/D’APPRENTISSAGE :
Plan du cours

### II. Définitions

#### 1. Expérience (ou épreuve) aléatoire, issues

#### 2. Univers d’une épreuve ou expérience aléatoire

#### 3. Evénement

#### 4. Réunion, intersection de deux événements

#### 5. Evénements contraires – Evénements incompatibles

### III. Probabilité d’un événement

#### 1. Définition

#### 2. Conséquences

#### 3. Equiprobabilité

### IV. Variable aléatoire (ou aléa numérique)

#### 1. Définition d’une variable aléatoire

#### 2. Loi de probabilité

- 3. Espérance mathématique, variance et Ecart Type d’une variable aléatoire x

##### a. Espérance mathématique

##### b. Variance

##### c. Ecart type

- 4. Fonction de répartition Variable aléatoire (ou aléa numérique)

### IV. PROBABILITES CONDITIONNELLES

#### 1. Définition

#### 2. Remarque

#### 3. Formules de probabilité composée

#### 4. Evénements indépendants

##### a. Définition

##### b. Théorèmes

- 5. Indépendance de deux variables aléatoires (aléas indépendants)

### V. Epreuve de BERNOULLI – Loi Binomiale

#### 1. Définitions

#### 2. Propriétés

PROBABILITES

### I. Définitions

#### 1. Expérience (ou épreuve) aléatoire, issues

Une expérience est dite aléatoire quand on ne peut pas, à priori connaître le
résultat.
Exemple
Lancer une pièce de monnaie et observer le côté exposé, lorsque la pièce est
immobilisée, est une expérience aléatoire comportant deux issues (ou
éventualités).

#### 2. Univers d’une épreuve ou expérience aléatoire

L’ensemble de toutes les issues ou éventualités ou résultats d’une expérience
aléatoire est appelé univers des possibles. On le note le plus souvent $\Omega$. Par
exemple, pour la pièce de monnaie, on a : $\Omega$ = {P, F} où P désigne pile et F
désigne face.

#### 3. Evénement

On appelle événement, toute partie de l’univers des possibles.
Un événement réduit à une seule issue est appelé événement
élémentaire (ou dit aussi que cet événement est un singleton).
Un évènement est dit certain, lorsque cet événement est l’ensemble $\Omega$.
Un événement A est dit impossible lorsque $A = φ$

#### 4. Réunion, intersection de deux événements

Soient A et B deux événements de $\Omega$.
On appelle événement (A ou B), la partie $A \cup B$ de $\Omega$.
On appelle événement (A et B), la partie $A \cap B$ de $\Omega$.

#### 5. Evénements contraires – Evénements incompatibles

Soient A et B deux événements de $\Omega$.
On appelle événement contraire de A, la partie A de $\Omega$, complément

de A dans $\Omega$.

Les événements A et B sont incompatibles, lorsque $\cap B = \emptyset$ .

### II. Probabilité d’un événement

#### 1. Définition

$\Omega$ Etant l’univers d’une expérience aléatoire. On appelle probabilité sur $\Omega$,
toute application p définie de P$( \Omega$) vers [0 ;1] vérifiant les propriétés
suivantes :
La probabilité d’un événement est comprise entre 0 et 1. Ainsi quel
que soit l’événement A, on a : $0 \leq p$(A$) \leq 1$

$Si A\leq b alors p ( A ) \leq p ( B$)

La probabilité de l’événement certain $\Omega$. Est égal à 1, c’est-à-dire :
p($Ω$) = 1
Si A et B sont des événements incompatibles, la probabilité de
l’événement « A ou B » est P(A) + P(B), autrement dit :

Si $A \cap B = \emptyset$ alors p($A \cup B$) = p(A) + p(B)

(axiome des probabilités totales).
NB :
P$( \Omega$) est l’ensemble de tous les événements (ou des sous-ensembles de $\Omega$).

#### 2. Conséquences (à admettre)

La probabilité de l’événement impossible est 0. Autrement dit

p$( \emptyset$) = 0

La somme des probabilités de deux événements contraires A et A
est égale à 1.

On a : $A \cup A = \Omega et A \cap A = \emptyset$ alors

$p ( A \cup$

$\frac{A ) = p ( \Omega ) < = > p ( A ) + p ( A ) = p ( \Omega )}{p ( A ) + p ( A ) = 1 ou p ( A ) = 1 - p ( A )}$

<=>
Si A et B sont deux événements quelconques, alors:

p($A \cup B$) = p(A) + p(B) - p($A \cap B$)

#### 3. Equiprobabilité

Définition
Il y a équiprobabilité lorsque toutes les issues ont la même probabilité.
Dans ce cas, si Card ($Ω$) = n

##### a) Pour toute issue a, on a : p({a}) = $\frac{1}{n}$

##### b) Pour tout événement A, on a :

p(A) = $\frac{Card ( A )}{Card ( Ω )}$ autrement dit

Nombre de cas favorables à A
p(A) =
Nombre de cas possibles
Remarque
Dans la pratique, la situation d’équiprobabilité est signalée par les termes si
après :

Un dé parfait, une pièce bien équilibrée, cartes bien battues, tirage au hasard,
tirage au sort, etc.
Détermination d’une probabilité
Soit $\Omega$ l’univers d’une épreuve aléatoire contenant n issues. Une
probabilité p sur $\Omega$ est entièrement déterminée par la donnée des
probabilités des événements élémentaires. Dans ce cas, la
probabilité d’un événement A est la somme des probabilités des
événements élémentaires qui le composent.
Applications
Application 1
On lance trois fois de suite une pièce de monnaie bien équilibrée.
- 1) Ecrire à l’aide d’un arbre les résultats possibles de l’expérience.
- 2) On note A l’événement : « obtenir au moins une fois pile » quel est
l’événement contraire de A ?
Calculer sa probabilité. En déduire la probabilité de l’événement A.

### Solution

$1^{er}$ lancer $2^{ème}$ lancer $3^{ème}$ lancer Evénement réglementaires
P ------------ PPP
P F ------------ PPF
P P ------------ PFP
F F ------------ PFF
P ------------ FPP
P F ------------ FPF
F P ------------ FFP
F F ------------ FFF
L’univers $Ω$ des résultats possibles est :
$\Omega$ = {PPP; PPF; PFP; PFF; FPP; FPF; FFP; FFF}
Card($Ω$) = 8

NB :
La pièce étant équilibrée, on est en situation d’équiprobabilité
- 2) $\frac{L’événement contraire de A}{?}$ : « obtenir au moins une fois pile » est
l’événement A « n’obtenir que des faces » Donc :

P(A) = P(FFF) = $\frac{1}{8} :$ P(A ) = $\frac{1}{8}$

Par la suite, on sait que : P(A) + P(A) = 1

Donc P(A) = 1 - P(A) => 1 $- \frac{1}{8} = \frac{7}{8}$ => P(A) = $\frac{7}{8}$

Application 2
On jette successivement deux fois un dé.

##### a) Quelle est la probabilité d’obtenir le même nombre.

- b) Quelle est la probabilité d’obtenir les nombres différents.

### Solution

Soit $Ω$ l’univers

Card($Ω$) = $A_{6}$2 = $6^{2} =$ 36

##### a) Soit A « l’événement obtenir le même nombre ».

A = {(1,1); (2,2); (3,3); (4,4); (5,5); (6,6)}
Card(A) = 6

P(A) = $\frac{Card ( A )}{Card ( Ω )} = \frac{6}{36} = \frac{1}{6}$ d’où P(A) = $\frac{1}{6}$

##### b) Soit B « l’événement obtenir les nombres différents »

$B = A$

P(B) = P(A) = 1 - P(A)

P(B) = 1 $- \frac{1}{6} = \frac{5}{6}$ , d’où P(B) = $\frac{5}{6}$

Application 3
Dans un jeu normal de 32 cartes. Calculer les probabilités des événements
suivants :
Sachant qu’on tire au hasard une main de 5 cartes :
- a) Obtenir exactement 3 trèfles ;
- b) Obtenir au moins 2 valets ;

##### c) Obtenir exactement 2 dames et 3 rois.

### Solution

Soit $Ω$ l’univers. Représenté par un tableau :

$\frac{32 !}{5 ! ( 32 - 5 ) !} \frac{32 !}{5 ! 27 !} 32 \times 31 \times 30 \times 29 \times$ 28

Card$( \Omega$) = $C_{32}^{5}$ = = = = 201376

5 $\times 4 \times 3 \times 2 \times$ 1

##### a) Soit A l’événement « obtenir exactement trois trèfles ».

Card(A) = $C_{8} 3 \times C_{24}$2 = $\frac{8 !}{3 ! 5 !} \times \frac{24 !}{2 ! 22 !}$

4 $\times 8 \times 7 \times 6 \times 24 \times$ 23

= = 15456

3 $\times 2 \times$ 2

Alors

P(A) = $\frac{Card ( A )}{Card ( \Omega )} = \frac{15456}{201376}$ = 0,076

##### b) Soit B l’événement « obtenir au moins deux valets »

Card(B) = $C_{4}^{2} \times C_{28}^{3} + C_{4}^{3} \times C_{28}^{2} + C_{4}^{4} \times C_{28}^{1}$

Card(B) = $\frac{4 ! 28 !}{2 ! 2 ! 3 ! 25 !} + \frac{4 ! 28 !}{3 ! 1 ! 2 ! 26 !}$ + 28

3 $\times 2 \times 28 \times 27 \times 26 \frac{4 \times 28 \times 27}{2}$

= + + 28

3 $\times$ 2

Card(B) = 28 $\times 27 \times 26 \times 14 \times$ 27 + 28

= 19656 + 1518 + 28
Card(B) = 21196
Alors :

P(B) = $\frac{Card ( B )}{Card ( \Omega )} = \frac{21196}{201376} =$ 0, 105

- c) Soit C l’événement « obtenir exactement deux dames et trois
rois »

Card(C) = $C_{4}^{2} \times C_{4}^{3} \times C_{24}^{0}$

$\frac{4 !}{2 ! 2 !} \frac{4 !}{3 !} 4 \times 3 \times 2 \times 4 \times 3 \times$ 2

= $\times \times = 24$

2 $\times 2 \times 3 \times$ 2

Alors P(c) = $\frac{Card ( C )}{Card ( \Omega )} = \frac{24}{201376} =$ 1, 19$. 10^{-4}$

### III. Variable aléatoire (ou aléa numérique)

#### 1. Définition d’une variable aléatoire

Lorsque à chaque éventualité $e_{i}$ d’une expérience aléatoire, on associé un nombre
réel $x_{i}$ , on dit que l’on a défini une variable aléatoire X. On désigne généralement
les aléas numériques (ou variables aléatoires) par les lettres : X, Y, Z…

#### 2. Loi de probabilité

Définition
Lorsque à chaque valeur $x_{i}$ , prise par une variable aléatoire X, on associe la
$probabilité P_{i}$ de l’événement (X=$x_{i}$ ), on dit que l’on a défini la loi de probabilité
de X (ou la distribution de X).
NB :
La loi de probabilité d’une variable aléatoire X est souvent numérique et
représentée par un tableau :

| Valeurs de x ou x_{i} , | x_{1} | x_{2} | ------ | x_{n} |  |
| --- | --- | --- | --- | --- | --- |
| P(X= x_{i} ) ou P_{i} | P_{1} | P_{2} | ------ | P_{n} | \sum P_{i} = 1 |

Univers image de X :
C’est l’ensemble de toutes les valeurs $x_{i}$ prisent par la variable aléatoire réelle X.

On note : X$( \Omega$) = {$x_{1} ; x_{2}$ ; …; $x_{n}$ }

- 3. Espérance mathématique, variance et Ecart Type d’une variable
aléatoire x

##### a) Espérance mathématique

Définition
L’espérance mathématique de l’aléa numérique X est le nombre réel
désigné par E(x), défini par :

$n$

E(x) = $\sum x_{i} P$(x $= x_{i}$ ) = $x_{1} P_{1} + x_{2} P_{2}$ + ⋯ + $x_{n} P_{n}$

$i = 1$

##### b) Variance

Définition
On appelle variance d’un aléa numérique x, le nombre noté V(x) tel
que :
V(x) = E[x - E(x$) ]^{2}$
Posons E(x) = m
Alors V(x) = E(x - $m )^{2}$

= E$( x^{2} -$ 2mX $+ m^{2}$ )

= E$( x^{2} )$ - 2mE(x) + $m^{2}$

= $E ( x^{2} ) - 2 m^{2} + m^{2}$

= $E ( x^{2} ) - m^{2}$

| ( ) ( ) V x = E x^{2} - [ E ( x ) ]^{2} |  |
| --- | --- |
|  | 170 |

où = E$( x^{2}$ ) = $\sum ^{n}_{i=1} x^{2}_{i} P$(X $= x_{i}$ )

##### c) Ecart type

Définition :
On appelle Ecarte type de x, la racine carrée positive de la variance. On

note : $ρ$(x) = $\sqrt{V}$(x)

#### 4. Fonction de répartition

Définition
On appelle fonction de répartition, la fonction.

F : $\mathbb{R}$ ⟶ [0,1]

x ⟶ P(X < x)
NB :
F est définie par les formules explicites suivantes :
Pour x < $x_{1} ,$ F(x) = 0

Pour $x_{i} \leq x \leq x_{i+1} ,$ F(x) = F$( x_{i-1}$ ) + P(x $= x_{i}$ )

Pour $x_{n} \leq x$, F(x) = 1

Conséquence : F est une fonction croissante en escalier.
Application
Un joueur lance trois fois une pièce de monnaie parfaitement équilibrée. Il gagne
200 frs pour chaque apparition de « pile » et il perd 100frs pour chaque apparition
de « face ».

- 1) Déterminer la probabilité P sur l’univers $Ω$ des éléments de l’expérience
aléatoire « lancer 3 fois de suite une pièce de monnaie équilibrée ».
- 2) Définis par un tableau la variable aléatoire X donnant le gain pour chaque
éventualité de $Ω$

#### 3) Déterminer la loi de probabilité de X.

- 4) Calculer l’espérance mathématique, la variance et l’écart-type de la
variable aléatoire X.
- 5) Construire le diagramme en bâtons de la loi de probabilité X.

#### 6) Déterminer la fonction de répartition F de X.

#### 7) Représenter graphiquement la fonction de répartition.

### Solution

#### 1) On sait que l’ensemble des issues est :

$\Omega$ = {PPP; PPF; PFP; PFF; FPP; FPF; FFP; FFF}
(Voir exercice du cour § II.3)
La pièce de monnaie étant parfaitement équilibrée, il y a équiprobabilité des
événements élémentaires, donc la probabilité d’un événement élémentaire est

$P = \frac{1}{8}$

- 2) Variable aléatoire X donnant le gain pour chaque éventualité de $Ω$.

| Eventualité de Ω | PPP | PPF | PFP | PFF | FPP | FPF | FFP | FFF |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Valeurs prises par X | 600 | 300 | 300 | 0 | 300 | 0 | 0 | - 300 |

D’où X($Ω$) = {- 300$;$ 0$;$ 300$;$ 600}

#### 3) Loi de probabilité de la variable aléatoire.

| Xi | - 300 | 0 | 300 | 600 |
| --- | --- | --- | --- | --- |
| ( ) P x = x_{i} ou P_{i} | \frac{1}{8} | \frac{3}{8} | \frac{3}{8} | \frac{1}{8} |

$\sum P_{i} = \frac{8}{8}$ = 1

#### 4) Espérance mathématique, variance et écart type de X.

$\frac{Espérance mathématique E ( x ) .}{4}$

E(x) = $\sum P_{i} x_{i} =$ P$1 x_{1} + P_{2} x_{2} + P_{3} x_{3} +$ P$4 x_{4}$

i=1

| Xi | - 300 | 0 | 300 | 600 |
| --- | --- | --- | --- | --- |
| ( ) P x = x_{i} = P_{i} | \frac{1}{8} | \frac{3}{8} | \frac{3}{8} | \frac{1}{8} |
|  | 300 - | 0 | 900 | 600 |
| x_{i} P_{i} | 8 |  | 8 | 8 |

E(x) = $- \frac{300}{8} + \frac{0}{8} + \frac{900}{8} + \frac{600}{8} = \frac{1200}{8}$ = 150 E(x) = 150

Variance V(x)

V(x) = P$1 x_{1}^{2} + P_{2} x_{2}^{2}$ + ⋯ + P$n x_{n}^{2} -$ [E(x$) ]^{2}$

| Xi | - 300 | 0 | 300 | 600 |
| --- | --- | --- | --- | --- |
| ( ) P x = x_{i} = P_{i} | \frac{1}{8} | \frac{3}{8} | \frac{3}{8} | \frac{1}{8} |
| x_{i}^{2} P_{i} | 90000 | 0 | 27000 | 36000 |
|  | 8 |  | 8 | 8 |

V(x) = $\frac{90000}{8}$ + 0 + $\frac{270000}{8} \frac{360000}{8} -$ (150$)^{2}$

$\frac{+}{V (x) = 67500}$

= 90.000 – 22 500 =>
Ecart-type
$σ$(x) = $\sqrt{V}$(x) = $\sqrt{\;}$67500 = 259,8 => $σ$(x) = 259, 8

- 5) Construction du diagramme en bâtons de la loi de probabilité de x.
Ce diagramme est déterminé à partir du tableau donnant la loi de probabilité X

#### 6) Fonction de répartition F de la variable aléatoire X.

A partir du tableau donnant la loi de probabilité de X, on déduit le tableau
ci-dessous qui détermine la fonction de répartition de X.

| xi | - \infty - |  | 300 |  |  | 0 |  | 300 |  |  | 600 | + \infty |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| P ( X < x_{i} ) | 0 | 1 8 |  | 1 8 | 4 8 |  | 4 8 | 7 8 | 7 8 | 1 |  | - 1 |

Pour $x \in$ ] $- \infty ;$ - 300[, F(x) = 0

Pour $x \in$ [- 300;0[, F(x) = 1
Pour $x \in$ [0;300[, F(x) = 1 + 3 = 4
8 8 8
Pour $x \in$ [300;600[, F(x) = 4 + 3 = 7
8 8 8
Pour $x \in$ [600;+$\infty$[, F(x) = 7 + 1 = 1
8 8

#### 7) Représentation graphique de la fonction de répartition.

### IV. PROBABILITES CONDITIONNELLES

#### 1. Définition

Soient A et B deux événements de l’univers $Ω$. Si A est un événement de
probabilité non nul, alors l’application PA $: P_{(Ω)} \to \mathbb{R} ^{+}$ définie par,

$\forall B \in P$($Ω$), $P_{A} ($B) = $\frac{P ( A \cap B )}{P ( A )}$, est appelée Probabilité conditionnelle sachant

que A est réalisé.
$P_{A}$ est appelée probabilité conditionnelle relative à A.
$P_{A}$ (B) noté aussi P (B/A) est la probabilité de B relative à A ou probabilité que B
se réalise sachant que A est réalisé.

#### 2. Remarque

$P_{A}$ est une probabilité sur ($\Omega$, P($\Omega$)) <=> PA$( \Omega$) = 1

PA(B$\cup C$)=PA(B) + PA(C) avec B$\cap C = \emptyset$

Par définition

PA$( \Omega$) = $\frac{P ( A \cap \Omega )}{P ( A )} = \frac{P ( A )}{P ( A )}$ = 1

Si B et C sont deux événements incompatibles, alors $A \cap B$ et $A \cap C$ sont aussi
incompatibles.
Par définition, on a :

PA($B \cup C$) = $\frac{P [ A \cap ( B \cup C ) ]}{P ( A )} = \frac{P [ ( A \cap B ) \cup ( A \cap C ) ]}{P ( A )}$

= $\frac{P ( A \cap B ) + P ( A \cap C )}{P ( A )}$

PA($B \cup C$) = $\frac{P ( A \cap B )}{P ( A )} + \frac{P ( A \cap C )}{P ( A )}$

$P_{A} ( B \cup C$) = $P_{A} ($B) + $P_{A} ($C)

#### 3. Formules de probabilité composée

$\frac{P ( A \cap B )}{P ( A )}$ Avec

PA(B) = <=> P($A \cap B$) = P(A$) \times P$A(B)

P($A \cap B$) = P($B \cap A$)

$P_{B} ($A) = $\frac{P ( A \cap B )}{P ( B )}$ <=> P($B \cap A$) = P(B$) \times P_{B} ($A)

NB :
Les situations de probabilité conditionnelle peuvent être représentées par l’arbre
de probabilité suivante :

PA(B) B …….. $A \cap B$ …… P ($A \cap B$) = P(A$) \times P$A(B)

P(A) A …….. …… =

$P A ( B ) B A \cap B P ( A \cap B ) P ( A ) \times P A ( B$)

$Ω$

$P_{A} ($B) B …….. A$\cap B$ …… P (A$\cap B$) = P(A$) \times P_{A}$(B)

$P ( A ) A$

B …….. A$\cap B$ …… P($A \cap B$) = P(A$) \times P_{A}$(B)

$P_{A} ( B$)

#### 4. Evénements indépendants

##### a. Définition

Deux événements A et B sont dits indépendants si la réalisation de l’un n’a
aucune influence sur la réalisation de l’autre.
Autrement dit : PA(B) = P(B) $et P_{B} ($A) = P(A)

Avec P(A$) \neq 0$ et P(B$) \neq$ 0

##### b. Théorèmes

A et B sont deux événements indépendants si, et seulement

si : P($A \cap B$) = P(A$) \times P$(B)

$Si A_{1} , A_{2}$ , …An sont n événements indépendants de probabilité non
nulle, alors on a :

P$( A_{1} \cap A_{2} \cap A_{3}$ … $A_{n}$ ) = P$( A_{1} ) \times P ( A_{2} ) \times P ( A_{3} ) \times$ … $\times P ( A_{n}$ )

- 5. Indépendance de deux variables aléatoires (aléas indépendants)

Soient X et Y deux aléas sur $\Omega$ tels que X$( \Omega$) = {$x_{1} , x_{2}$ , … $x_{n}$ } et

Y$( \Omega$) = {$y_{1} , y_{2}$ , …$y_{q}$ } et

On dit que X et Y sont deux aléas indépendants
<=> $\forall ($i, j$, \in$ {1,2,3, … , n} $\times$ {1,2, … q} on a :

P[(x $= x_{i} ) \cap ($Y = yj] = P(X $= x_{i} ) \times P$(Y = yj)

Applications

### Exercice 1

Dans un jeu de 52 cartes, on tire successivement 2 cartes sans remettre dans le
jeu la première carte tirée. Quelle est la probabilité d’avoir deux cœurs ?
Soit A l’événement « obtenir un cœur au premier tirage »
Soit B l’événement « obtenir un cœur au deuxième tirage »
$A \cap B$ est l’événement « obtenir deux cœurs »

Soit $\Omega$ l’univers. Card$( \Omega$) = $C_{52}$1 = 52

Soit A l’événement obtenir un cœur au premier tirage.

Card(A) = $C_{13}^{1}$ = 13

P(A) = $\frac{13}{52} = \frac{1}{4}$

Soit on a tiré un cœur au premier tirage.
Card(B/A) = $C_{12}$1 = 12

P(B/A) = $\frac{12}{51} = \frac{4}{17}$

Alors P(A $\cap$ B) = $\frac{1}{4} \times \frac{4}{17} = \frac{1}{17}$ D’où P($A \cap B$) = $\frac{1}{17}$

### Exercice 2

Dans une population donnée 15% des individus ont une malad$ie M_{A}$ . Parmi les

$individus atteints par la maladie M_{A}$ , 20% ont $une maladie M_{B}$ et parmi les

$individus non atteints par la maladie M_{A} , 4% ont la maladie M_{B}$ .

On prend un individu de cette population au hasard et on considère les
évènements :

A « l’individu es$t atteint de la maladie M_{A}$ » ;

B « $l’individu est atteint de la maladie M_{B}$ ».

- 1) Donner les valeurs des probabilités suivantes $: P(A), P_{A} (B) et P_{A}$ (B).

#### 2) Calculer la probabilité de l’évènement : B.

#### 3) $Calculer la probabilité conditionnelle P_{B}$ (A).

- 4) Les événements A et B, sont –ils indépendants ?

### Solution

- 1. Donnons les valeurs des probabilités : P(A), PA(B) $et P_{A}$(B)

P(A) = $\frac{15}{100}$ = 0,15

PA(B) = $\frac{20}{100}$ = 0,20

$P_{A}$(B) = $\frac{4}{100}$ = 0,04

#### 2. Calculons la probabilité de l’événement B.

Aidons-nous d’un arbre pondéré :
$P_{A} ($B)= 0,20 B …….. P ($A \cap B$) = 0,15 x 0,20 = 0,03
P(A)=0,15 A
$P_{A} ($B )= 0,80 B …….. P($A \cap B$) = 0,15 x 0,80 = 0,12

$Ω$

$P_{A} ($B)= 0,04 B …….. P (A$\cap B$) = 0,85 x 0,04 = 0,034
P(A)= 0,85 A
B …….. P(A$\cap B$ ) = 0,85 x 0,96 = 0,816

$P_{A} ($B )= 096

Or = B = ($A \cap B ) \cup ($A$\cap B$) . Les événements $A \cap B$ et A$\cap B$ sont incompatibles.

| NB : Si les événements B_{1} , B_{2} | ,…,B_{n} | En forment une partition de l’univers | \Omega , alors |
| --- | --- | --- | --- |
| Pour tout événement A : | ( ) P A | ( ) ( ) = P A \cap B_{1} + P A \cap B_{2} + ⋯ + P | ( A \cap B_{n} ) |
|  |  | Formule des probabilités totales |  |
| Pour tout i tel que 1 \leq i | \leq n | ( ) ( ) P A \cap B_{i} = P_{B} A \times P ( B_{i} ) i |  |

Ainsi, d’après la formule des probabilités totales, on a :
P(B) = P($A \cap B$) + P(A$\cap B$) = 0,03 + 0,034
P(B)= 0,064

#### 3. Calculons la probabilité conditionnelle $P_{B} ($A)

$P_{B} ($A) = $\frac{P ( A \cap B )}{P ( B )} = \frac{0 , 03}{0 , 064} = \frac{3}{6 , 4} = \frac{15}{32}$

#### 4. A et B sont indépendants si PA(B) = P(B)

On a : PA(B) = 0,20 et P(B)= 0,064
Comme PA(B$) \neq P$(B), alors les événements A et B ne sont pas indépendants.

### Exercice 3

On lance successivement deux dés, soit $\Omega$, l’ensemble des couples
(i, j)(1 $\leq i \leq$ 6; 1 $\leq j \leq$ 6) Des résultats lus sur les faces supérieures où i est le
résultat lu sur le premier dé lancé, j le résultat lu sur le second dé, lancé.
Soit X et Y les aléas numériques définis sur $\Omega$ par:
X(i, j) = 1 si i pair ;
X(i, j) = 0 si i impair ;
Y(i, j) = 1 si i+j pair ;
Y(i, j) = 0 si i+j impair.

#### 1. Déterminer les lois de probabilités de X et Y.

- 2. Les variables X et Y sont-elles indépendantes ?

### Solution

1.

| i j | 1 | 2 | 3 | 4 | 5 | 6 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | (1;1) | (1;2) | (1;3) | (1;4) | (1;5) | (1; 6) |
| 2 | (2;1) | (2;2) | (2;3) | (2;4) | (2;5) | (2;6) |
| 3 | (3;1) | (3;2) | (3;3) | (3;4) | (3;5) | (3;6) |
| 4 | (4;1) | (4;2) | (4;3) | (4;4) | (4;5) | (4;6) |
| 5 | (5;1) | (5;2) | (5;3) | (5;4) | (5;5) | (5;6) |
| 6 | (6;1) | (6;2) | (6;3) | (6;4) | (6;5) | (6;6) |

$1^{er}$ loi de probabilité de X, X = {o, 1}
18 1
P(X = 0) = =

P(X = 1) = $\frac{36 18}{36} = \frac{2 1}{2}$

| x_{i} | 0 | 1 |
| --- | --- | --- |
| P ( X = x_{i} ) | \frac{1}{2} | \frac{1}{2} |

Loi de probabilité de Y. $Y \in$ {0,1}

P(Y = 0) = $\frac{18}{36} = \frac{1}{2} ;$ P(Y = 1) = $\frac{18}{36} = \frac{1}{2}$ ;

| x_{i} | 0 | 1 |
| --- | --- | --- |
| P ( X = yj ) | \frac{1}{2} | \frac{1}{2} |

- 2. Les variables X et Y sont indépendante <=> $\forall ($i, j$) \in$ {0,1} $\times$ {0,1}

On a : P[(X $= x_{i} ) \cap ($Y = yj)] = P(X $= x_{i} ) \times P$(Y = yj)

{(X = 1) $\cap ($Y = 0)} = {(2,1), (2,3), 2,5), (4,1), (4,3), (4,5), (6,1), (6,3), (6,5)}

P[(X = 1) $\cap$ ((Y = 0)] = $\frac{9}{36} = \frac{1}{4} =$ P(x = 1) $\times P$(Y = 0)

### V. Epreuve de BERNOULLI – Loi Binomiale

#### 1. Définitions

On appelle épreuve de Bernoulli, toute épreuve aléatoire ne conduisant
qu’à deux éventualités appelées Succès noté S et échec noté E ou S. La
probabilité p du succès est appelée paramètre de l’épreuve de Bernoulli.
On appelle Schéma de Bernoulli, une suite indépendante de n épreuves de
Bernoulli. L’entier n et la probabilité p du succès sont appelés paramètres
du schéma de Bernoulli.

#### 2. Propriétés

Soit E un schéma de Bernoulli de n épreuves, p la probabilité d’avoir un succès
et q la probabilité d’avoir un échec (donc q = 1 - p).
Soit X la variable aléatoire qui à chaque éventualité associe le nombre k de succès

(0 $\leq k \leq n$)

La loi de probabilité de X est définie par :

p(X = k) = $C^{k}_{n} . p^{k} ($1 - $p )^{n} -$k ou p(X = k) = $C^{k}_{n} p^{k} q^{n-k}$

Cette loi de probabilité de X est appelée loi Binomiale de paramètres n et p.
L’univers image X ou l’ensemble des valeurs de X est {0,1,2, … , n - 1}

Remarques
Quand on fait un arbre, on a

$\frac{: p ( X = k ) = n_{k} p^{k} q^{n} - k}{; k= nombre de succès}$

Avec n= nombre d’épreuves ; p= probabilité de succès ;
$n_{K}$ = nombre de probabilité comportant cas succès

| Espérance mathématique | ( ) E X = np |
| --- | --- |
| ( ) V X = npq |  |

Variance :

### FICHE N° 10

### THEME : ALGEBRE LINEAIRE

OBJECTIF GENERAL : Réaliser des activités diverses
OBJECTIF SPECIFIQUE :
DUREE DE LA SEQUENCE DE L’ENSEIGNEMENT/D’APPRENTISSAGE :
Plan du cours

### I. Espace vectoriel sur $\mathbb{R}$

#### 1. Définition

#### 2. Sous –espace vectoriel

#### 3. Intersection de deux sous-espaces vectoriels

- 4. Somme de deux sous-espaces vectoriels Somme de deux sous-espaces vectoriels

#### 5. Somme directe de deux sous-espaces

#### 6. Sous-espaces vectoriels supplémentaires

#### 7. Combinaisons linéaires

#### 8. Famille génératrice

#### 9. Famille libre

#### 10. Famille

#### 11. Base d’un espace vectoriel.

#### 12. Dimension d’un espace vectoriel.

#### 13. Coordonnées d’un vecteur

### II. Applications linéaires

#### 1. Définition

#### 2. Noyau et image d’une application linéaire

##### a. Noyau

#### 3. Ensemble de vecteurs W1 invariants par f

#### 4. Ensemble de vecteurs W2 transformés en leurs opposés

#### 5. Expression analytique d’une application linéaire

#### 6. Matrice d’une application linéaire

#### 7. $\frac{Opérations sur les matrices dans \mathbb{R}}{a.}$

Somme des matrices Mf + Mg

##### b. Multiplication d’une matrice par un réel

##### c. Multiplication de deux matrices

#### 8. Endomorphismes particuliers

##### a. Projection vectorielle

##### b. Symétrie vectorielle

ALGEBRE LINÉAIRE

### I. Espace vectoriel sur $\mathbb{R}$

#### 1. Définition

On dit que l’ensemble E est un espace vectoriel sur $\mathbb{R}$ si est seulement si les deux
conditions suivantes (se traduisant par huit axions) sont satisfaites.
L’ensemble E est muni d’une loi de composition interne notée +, appelée :
addition qui fait de E un groupe commutatif (ou abélien), d’où les quatre premiers
axiomes.
La loi + est associative dans E.
$\forall ($u⃗ ⃗ , v⃗ , w⃗⃗ ⃗ ) $\in E^{3}$ , on a : (u⃗ ⃗ + v⃗ ) + w⃗⃗ ⃗ = u⃗ ⃗ + (v ⃗⃗⃗ ⃗ + w⃗⃗ ⃗ ).
La loi + admet o⃗ comme élément neutre dans E.
$\forall u$⃗ ⃗ $\in E$, on a : (u⃗ ⃗ + o⃗ ) = u⃗ ⃗
Tout élément de E a un symétrique, car la loi + admet un élément
symétrique.
$\forall u$⃗ ⃗ $\in E$, le symétrique de u⃗ ⃗ est - u⃗ ⃗ car : u⃗⃗ ⃗ + (- u⃗⃗ ⃗ ) = ⃗0⃗ ⃗
La loi + est commutative.
$\forall ($u⃗ ⃗ , v⃗ ) $\in E^{2} ,$ u⃗⃗ ⃗ + v⃗⃗ ⃗ = v⃗⃗ ⃗ + u⃗⃗ ⃗
L’ensemble E est muni d’une loi de composition externe notée ∗ appelée :
multiplication, à opérations dans $\mathbb{R}$, satisfaisant les quatre axiomes suivants :

$\forall ($u⃗ ⃗ , v⃗ ) $\in E^{2} , \forall α \in \mathbb{R} α$(u⃗⃗ ⃗ + v⃗⃗ ⃗ ) = $α$u⃗⃗ ⃗ + $α$v⃗⃗ ⃗

$\forall u$⃗ ⃗ $\in E , \forall ( α$, $β ) \in \mathbb{R} ^{2}$ : ($α$ + $β$) u⃗⃗ ⃗ = $α$u⃗⃗ ⃗ + $β$u⃗⃗ ⃗

$\forall u$⃗ ⃗ $\in E , \forall ( α$, $β ) \in \mathbb{R} ^{2} : α$($β$u⃗⃗ ⃗ ) = ($αβ$) u⃗⃗ ⃗

$\forall u$⃗ ⃗ $\in E$, 1u⃗⃗ ⃗ = u⃗⃗ ⃗

Remarque
Les éléments de E sont appelés vecteur et ceux de $\mathbb{R}$ sont des scalaires ou
opérateurs.
Conséquence

$\forall ($u⃗ ⃗ , v⃗ , w⃗⃗ ⃗ ), éléments de E, $\forall α \in \mathbb{R}$

on a :
(u⃗ ⃗ + v⃗ ) + w⃗⃗ ⃗ = u⃗ ⃗ + (v ⃗⃗⃗ ⃗ + w⃗⃗ ⃗ ) = u⃗ ⃗ + v⃗ + w⃗⃗ ⃗

$α$ u⃗ ⃗ = ⃗0⃗ $\Leftrightarrow α$ = 0 ou u⃗ ⃗ = ⃗0⃗

Exemples d’espaces vectoriels
($\mathbb{R}$, +, *) est un espace vectoriel.
($\mathbb{C}$, +, *) est un espace vectoriel.

#### 2. Sous espace vectoriel

Définition
$F \subset E$ est un sous-espace vectoriel de l’espace vectoriel E, si est seulement si :

F est non vide ($F \neq \emptyset$)

F est un stable pour la loi + de E, c’est-à-dire : $\forall ($u⃗ ⃗ , $θ$⃗ ) $\in F^{2} ,$ U⃗⃗⃗ + $θ$⃗ $\in F$

F est stable pour la loi de E, c’est-à-dire : $\forall$ ⋋$\in \mathbb{R} , \forall θ$⃗ $\in F$, ⋋. $θ$⃗ $\in F$

### Exercice d’application

Montrer que l’ensemble E des éléments de $\mathbb{R} ^{2}$ de la forme (2x $;$ x) est un sous

espace vectoriel de $\mathbb{R} ^{2}$ .

### Solution :

E est une partie de $\mathbb{R} ^{2}$ , non vide, car (0 ;0) $\in E$, donc $E \neq \emptyset$

Soit u⃗ ⃗ (2x$;$ x) et $θ$⃗ (2x’$;$ x’)
Montrons que u⃗ ⃗ + v⃗ $\in E$
On a : u⃗ ⃗ + v⃗ = (2x$;$ x) + (2x’$;$ x’)
= (2x + 2x’$;$ x + x’)
= [2(x + x’); x + x’]

$\forall$ ⋋$\in \mathbb{R} , \forall u$⃗ ⃗ (2x$;$ x$) \in E$ . Montrons que : ⋋ u⃗ ⃗ $\in E$.

On a : ⋋ u⃗ ⃗ =⋋ (2x$;$ x)

= (2 ⋋ x;⋋ x$) \in E$

D’où ⋋ u⃗ ⃗ $\in E$

### Conclusion :

E est sous espace vectoriel de $\mathbb{R} ^{2}$ .
Contre-exemple :
L’ensemble des éléments de $\mathbb{R} ^{2}$ de la forme (x ;1) n’est pas un sous-espace
vectoriel de $\mathbb{R} ^{2}$ , car par exemple (0 ; 1) + (0 ;1) = (0 ; 2) n’appartient pas à
cet ensemble.

#### 3. Intersection de deux sous-espaces vectoriels

$Si E_{1} et E_{2}$ sont deux sous-espaces vectoriels d’un espace vectoriel E sur $\mathbb{R}$, alors
$E_{1} \cap E_{2}$ est un sous espace vectoriel de E.

#### 2. Somme de deux sous-espaces vectoriels

$E_{1} et E_{2}$ étant deux sous-espaces vectoriels d’un espace vectoriel E sur $\mathbb{R}$, on

appelle somme des sous-$espaces vectoriels E_{1} et E_{2} , notée E_{1} + E_{2}$ , l’ensemble

des vecteurs :

w⃗⃗ ⃗ = u⃗ ⃗ + $θ$⃗ où u⃗ ⃗ $\in E_{1}$ et $θ$⃗ $\in E_{2}$ .

Remarque

$Ne pas confondre E_{1} + E_{2}$ et $E_{1} \cup E_{2}$

$Si E_{1} et E_{2} sont deux droites vectorielles alors E_{1} + E_{2}$ = plan vectoriel.

$E_{1} \cup E_{2}$ est l’ensemble de deux droites vectorielles.

#### 3. Somme directe de deux sous-espaces

$Si E_{1} et E_{2}$ sont deux sous espaces vectoriels d’un espace vectoriel E sur $\mathbb{R}$ tels
que :

$E_{1} \cap E_{2}$ ={o⃗ }$, alors la somme E_{1} + E_{2}$ est dite directe.

$La somme directe est notée E_{1}$ ⨁ $E_{2}$ .

$\forall w$⃗⃗ ⃗ $\in ( E_{1}$ ⨁$E_{2}$ ), la décomposition w⃗⃗ ⃗ = u⃗ ⃗ + v⃗ avec u⃗ ⃗ $\in E_{1}$ et v⃗ $\in E_{2}$ , se fait de

façon unique.
Théorème :

On a l’équivalence $: E_{1}$ ⨁ $E_{2}$ ⟺ $E_{1} \cap E_{2}$ = {o⃗ }

#### 4. Sous-espaces vectoriels supplémentaires

Deux sous-$espaces vectoriels E_{1} et E_{2}$ d’un espace vectoriel E sont dits

supplémentaires dans E si leur somme directe est égale à E, c’est-à-dire si l’on
a :

E = $E_{1} + E_{2}$

$E_{1}$ ⊕ $E_{2}$ = E ⟺ {

$E_{1} \cap E_{2}$ = {o⃗ }

### Exercice d’application

Soit $E_{1}$ = {$\frac{x , 0}{x} \in \mathbb{R}$} , $E_{2}$ = {(0, y)/$y \in \mathbb{R}$}

$Montrer que E_{1} et E_{2}$ sont deux sous-espaces vectoriels supplémentaires de $\mathbb{R} ^{2}$ .

### Solution

Montrons que E = $E_{1} + E_{2}$ avec E $= \mathbb{R} ^{2}$

Soit u⃗ ⃗ (x, 0) $\in E_{1}$ et v⃗ (0, y$) \in E_{2}$ on a :
u⃗ ⃗ + v⃗ = (x, 0) + (0, y)

= (x + 0,0 + y) = (x, y$) \in \mathbb{R} ^{2}$ d’où E = $E_{1} + E_{2}$

Montrons que $E_{1} \cap E_{2}$ = {o⃗ }.

On a : u ⃗⃗⃗ ⃗ $\in E_{1} \cap E_{2}$ ⟺ u ⃗⃗⃗ ⃗ $\in E_{1} et$ u ⃗⃗⃗ ⃗ $\in E_{2}$

⟺ u ⃗⃗⃗ ⃗ (x, 0) et u ⃗⃗⃗ ⃗ (0, y)
⟺ u ⃗⃗⃗ ⃗ (0,0)

d’où $E_{1} \cap E_{2}$ = {o⃗ }.

### Conclusion

$E_{1}$ ⊕ $E_{2}$ =E, donc $E_{1} et E_{2}$ sont deux sous-espaces vectoriels supplémentaires

de E= $\mathbb{R} ^{2}$ .

#### 5. Combinaisons linéaires

Définition
Soit une famille ($U_{1}$⃗⃗⃗ , $U_{2}$⃗⃗⃗ , … , $U_{n}$⃗⃗⃗ ) des vecteurs d’un espace vectoriel. On dit qu’un
vecteur U⃗⃗⃗ de E est une combinaison linéaire de vecteurs $U_{1}$⃗⃗⃗ , $U_{2}$⃗⃗⃗ , …, $U_{n}$⃗⃗⃗ si et
seulement s’il existe une famille ($α_{1} , α_{2}$ , … , $α_{n}$ ) de nombres réels tels que :

U⃗⃗⃗ =$α_{1} U_{1}$⃗⃗⃗ + $α_{2} U_{2}$⃗⃗⃗ , … , $α_{n} U_{n}$⃗⃗⃗

On écrit : U⃗⃗⃗ = $\sum ^{n}_{i=} 1 α_{i} U_{i}$⃗⃗⃗

NB :
L’ensemble des combinaisons linéaires de n vecteurs $U_{1}$⃗⃗⃗ , $U_{2}$⃗⃗⃗ , … , $U_{n}$⃗⃗⃗ d’un espace
vectoriel E est un sous-espace vectoriel $E_{1}$ de E.
On dit que les n vecteurs $U_{1}$⃗⃗⃗ , $U_{2}$⃗⃗⃗ , … , $U_{n}$⃗⃗⃗ engendrent $E_{1}$ ou bien $E_{1}$ est engendré
par n vecteurs.

#### 6. Famille génératrice

Définition
Soit E un espace vectoriel. Une famille ($U_{1}$⃗⃗⃗ , $U_{2}$⃗⃗⃗ , … , $U_{n}$⃗⃗⃗ ) d’éléments de E est dite
génératrice, si tout élément v⃗ de E est une combinaison linéaire de cette famille,
c’est-à-dire :

$\forall v$⃗ $\in E , \exists ( α_{1} , α_{2}$ , … , $α_{n} ) \in \mathbb{R} ^{n} /$v⃗ = $α_{1} U_{1}$⃗⃗⃗ + $α_{2} U_{2}$⃗⃗⃗ , … , $α_{n} U_{n}$⃗⃗⃗

NB :
On dit aussi que ($U_{1}$⃗⃗⃗ , $U_{2}$⃗⃗⃗ , … , $U_{n}$⃗⃗⃗ ) forment un système générateur.

### Exercice d’application

Démontrer que les vecteurs $U_{1}$⃗⃗⃗ (3) $et U_{2}$⃗⃗⃗ (1) forment une famille génératrice de
2 5

$\mathbb{R} ^{2}$ .

$U_{1}$⃗⃗⃗ et $U_{2}$⃗⃗⃗ est une famille génératrice de $\mathbb{R} ^{2}$ si et seulement

Si $\forall v$⃗ $\in \mathbb{R} ^{2} , \exists ( α_{1} , α_{2} ) \in \mathbb{R} ^{2} /$v⃗ = $α_{1} U_{1}$⃗⃗⃗ + $α_{2} U_{2}$⃗⃗⃗

$x$

Posons : v⃗ = (y) donc on a :

v⃗ = $α_{1} U_{1}$⃗⃗⃗ + $α_{2} U_{2}$⃗⃗⃗ ⟺ (x) = $α_{1}$ (3) + $α_{2}$ (1) ⟺ (s) = x(- 5)

y 2 5

x = 3$α_{1} + α_{2}$ (1)

{

y = 2$α_{1}$ + 5$α_{2}$ (2)

Dét = d=|3 1| = 15 - 2 = 13 ⟹ $d \neq$ 0
2 5
Le système (S) a une solution unique
Résolvons (S)

$- 5 x = - 15 α_{1} - 5 α_{2}$

(s) = {

y = 2$α_{1}$ + 5$α_{2}$

$y - 5 x = - 13 α_{1}$ ⟹ $α_{1} = \frac{5 x - y}{13}$

Remplaçons $α_{1}$ par sa valeur dans (1). On aura :

x = 3 ($\frac{5 x - y}{13}$) + $α_{2}$ soit : $α_{2} = \frac{15 x - 3 y}{13}$

### Conclusion

⃗$U_{1}$⃗ ⃗ et ⃗$U_{2}$⃗ ⃗ est une famille génératrice de $\mathbb{R} ^{2}$ .

#### 7. Famille libre

Définition
Soit F une famille de vecteurs ($U_{1}$⃗⃗⃗ , $U_{2}$⃗⃗⃗ , … , $U_{n}$⃗⃗⃗ ) d’un espace vectoriel E. On dit
que F est une famille libre, si et seulement s’il existe une famille

($α_{1} , α_{2}$ , … , $α_{n}$ ) de réels tels que :

$α_{1}$ ⃗$U_{1}$⃗ ⃗ + $α_{2}$ ⃗$U_{2}$⃗ ⃗ , … , $α_{n}$ ⃗$U_{n}$⃗ ⃗ = o⃗⃗⃗ ⟹ $α_{1} = α_{2}$ = ⋯ = $α_{n} =$ 0

NB
On dit aussi que les n vecteurs $U_{1}$⃗⃗⃗ , $U_{2}$⃗⃗⃗ , … $U_{n}$⃗⃗⃗ sont linéairement indépendants,

d’où dans $\mathbb{R} ^{2}$ et $\mathbb{R} ^{3}$ toute famille ($U_{1}$⃗⃗⃗ , $U_{2}$⃗⃗⃗ , … , $U_{n}$⃗⃗⃗ ) est libre si dét

($U_{1}$⃗⃗⃗ , $U_{2}$⃗⃗⃗ , … , $U_{n}$⃗⃗⃗ ) $\neq$ 0.

Exercices d’applications

### Exercice 1

Dans $\mathbb{R} ^{2}$ , on considère U⃗⃗⃗ (3) et v⃗ (1). Montrer que la famille (u⃗ ⃗ , v⃗ ) est libre.
4 2

### Solution

$1^{ère}$ méthode : (u⃗ ⃗ , v⃗ ) est une famille libre dans $\mathbb{R} ^{2}$ si et seulement s’il existe

($α_{1} , α_{2} ) \in \mathbb{R} ^{2} / α_{1} u_{1}$⃗ ⃗ + $α_{2} v_{2}$⃗ = ⃗0⃗ ⟹ $α_{1} = α_{2}$ = 0

On a : $α_{1} u_{1}$⃗ ⃗ + $α_{2} v_{2}$⃗ = ⃗0⃗

3 1 0 3$α_{1} + α_{2}$ = 0 3$α_{1} + α_{2}$ = 0

⟺ $α_{1}$ ( ) + $α_{2}$ ( ) = ( ) ⟺ { ⟺ {

4 1 2 0 4$α_{1}$ + 2$α_{2}$ = 0 2$α_{1} + α_{2}$ = 0

3$α_{1} + α_{2}$ = 0

⟺ {

- $2 α_{1} - α_{2}$ = 0

$α_{1}$ = 0

3$α_{1} + α_{2}$ = 0 ⟺ 0 + $α_{2}$ = 0 ⟹ $α_{2}$ = 0

### Conclusion

(u⃗ ⃗ , v⃗ ) est une famille libre.

$2^{ème}$ méthode :

(u⃗ ⃗ , v⃗ ) est libre ⟺ dét (u⃗ ⃗ , v⃗ $\neq$ 0)
Dét (u⃗ ⃗ , v⃗ ) = |3 1| = 6 - 4 = 2 $\neq$ 0
4 2
Comme Dét (u⃗ ⃗ , v⃗ ) $\neq$ 0, d’où(u⃗ ⃗ , v⃗ ) est une famille libre.

### Exercice 2

Dans $\mathbb{R} ^{3}$ , on donne u⃗ ⃗ = (1; 1; - 2); v⃗ (1; 2; - 3) et w⃗⃗ ⃗ (1; 1; 1)
Montrer que(u⃗ ⃗ , v⃗ , w⃗⃗ ⃗ ) est une famille libre.

### Solution

(u⃗ ⃗ , v⃗ , w⃗⃗ ⃗ ) est une famille libre dans $\mathbb{R} ^{3}$ si et seulement s’il existe trois réels $α_{1}$ ,

$α_{2}$ , et $α_{3}$ tels que : $α_{1} u$⃗ ⃗ + $α_{2} v$⃗ + $α_{3} w$⃗⃗ ⃗ = ⃗0⃗ ⟹ $α_{1} = α_{2} = α_{3}$ = 0

1 1 1 0 $α_{1} + α_{2} + α_{3}$ = 0 (1)

On a : $α_{1}$ (1) + $α_{2}$ ( 2 ) + $α_{3}$ (1) = (0) ⟹ { $α_{1}$ + 2$α_{2} + α_{3}$ = 0 (2)

#### 2 - 5 2 0 - $2 α_{1} - 3 α_{2} + α_{3}$ = 0 (3)

(1) - (2) ⟹ $- α_{2}$ = 0 ⟹ $α_{2}$ = 0

Remplaçons $α_{2}$ par sa valeur dans (1) et (3), on aura ∶

$α_{1} + α_{3}$ = 0 $α_{1} = - α_{3} α_{1} = - α_{3}$

{ ⟹ {- 2($- α_{3}$ ) = 0 ⟺ { 3$α_{3}$ = 0 ⟹ $α_{3}$ = 0

- $2 α_{1} + α_{3}$ = 0

Comme $α_{1} = - α_{3}$ donc $α_{1}$ = 0

Ainsi : $α_{1} = α_{2} = α_{3}$ = 0

### Conclusion

(u⃗ ⃗ , v⃗ , w⃗⃗ ⃗ ) est une famille libre.

$2^{ème}$ méthode

Dans $\mathbb{R} ^{3}$ , (u⃗ ⃗ , v⃗ , w⃗⃗ ⃗ ) est libre ⟺ dét (u⃗ ⃗ , v⃗ , w⃗⃗ ⃗ ) $\neq$ 0

dét (u⃗ ⃗ , v⃗ , w⃗⃗ ⃗ ) $\neq$ 0
1 1 1 1 1
dét (u⃗ ⃗ , v⃗ , w⃗⃗ ⃗ ) = | 1 2 1 | 1 2 = 2 - 2 - 3 + 4 + 3 - 1 = 3
- 2 - 3 1 - 2 - 3
dét (u⃗ ⃗ , v⃗ , w⃗⃗ ⃗ ) = 3

### Conclusion

Comme dét (u⃗ ⃗ , v⃗ , w⃗⃗ ⃗ ) $\neq$ 0 , alors (u⃗ ⃗ , v⃗ , w⃗⃗ ⃗ ) est une famille libre.
Remarque
On peut aussi calculer dét(u⃗ ⃗ , v⃗ , w⃗⃗ ⃗ ) par la méthode cofacteurs (ou méthode
des mineurs).
1 1 1
dét (u⃗ ⃗ , v⃗ , w⃗⃗ ⃗ ) = | | = 1 | 2 1| - 1 |1 1 | + 1| 1 2 |
1 2 1
- 3 1 - 2 1 - 2 - 3
- 2 - 3 1
dét (u⃗ ⃗ , v⃗ , w⃗⃗ ⃗ ) = (2 + 3) - (1 + 2) + (- 3 + 4) = 5 - 3 + 1 = 3
dét (u⃗ ⃗ , v⃗ , w⃗⃗ ⃗ ) = 3
On retrouve le même résultat.

#### 8. Famille

Définition
Une famille F de n vecteurs ($u_{1}$⃗ ⃗ , $u_{2}$⃗ ⃗ ,….$u_{n}$⃗ ⃗ ) d’un espace vectoriel est dite liée
sil elle est non libre, c’est-à-dire s’il existe une famille($α_{1} , α_{2,…} α_{n}$ ) des réels

non tous nuls tel que : $α_{1} u_{1,}$⃗ ⃗ + $α_{2} u_{2}$⃗ ⃗ +⋯+ $α_{n} u_{n}$⃗ ⃗ = $\to$

On dit alors que les n vecteurs ($u_{1,}$⃗ ⃗ $u_{2}$⃗ ⃗ ,….$u_{n}$⃗ ⃗ ) sont linéairement dépendants. Ils
forment une partie liée de E.

#### 1 - 2 - 1 0

On a : $α_{1}$ (4)+ $α_{2}$ ( 7 ) +$α_{3}$ ( 5 ) = (0)
2 1 1 0

$α_{1} - 2 α_{2} - α_{3}$ = 0 x(- 4) - $4 α_{1}$ + 8$α_{2}$ + 4$α_{2}$ = 0 (1)

(S) : { 4$α_{1}$ + 7$α_{2}$ + 5$α_{3}$ = 0 | ⟺ { 4$α_{1}$ + 7 $α_{2}$ + 5$α_{3}$ = 0 (2)

2$α_{1} + α_{2} + α_{3}$ = 0 2 $α_{1} + α_{2} + α_{3}$ = 0 (3)

(1)+(2)$\Rightarrow 15 α_{2}$ + 9$α_{3}$ = 0 $\Rightarrow = α_{2} = - \frac{3}{5} α_{3}$

2$α_{1} - \frac{3}{5} α_{3} + α_{3}$ = 0 ⟺ 2$α_{1} - \frac{2}{5} α_{3} \Rightarrow α_{1}$ = = $- \frac{1}{5} α_{3}$

$α_{1} = - α_{3}$

Finalement, on a : {$α_{2} = - \frac{3 5}{5} α_{3}$

$α_{3} \neq$ 0

Donc ($u_{1}$⃗ ⃗ , $u_{2}$⃗ ⃗ ,$u_{3}$⃗ ⃗ ) est une famille liée.
2ème méthode
Calculons le déterminant de ($u_{1}$⃗ ⃗ , $u_{2,}$⃗ ⃗ $u_{3}$⃗ ⃗ )

#### 1 - 2 - 1

dét($u_{1}$⃗ ⃗ $u_{2}$⃗ ⃗ $u_{3}$⃗ ⃗ )=| |=1|7 5|+2|4 5| -1 |4|
, , 4 7 5
1 1 2 1 2
2 1 1
dét($u_{1}$⃗ ⃗ , $u_{2}$⃗ ⃗ ,$u_{3}$⃗ ⃗ ) = (7 - 5) + 2 (4 - 10) - (4 - 14) = 0
comme dét ($u_{1}$⃗ ⃗ , $u_{2}$⃗ ⃗ ,$u_{3}$⃗ ⃗ ) = 0, alors la famille ($u_{1}$⃗ ⃗ , $u_{2,}$⃗ ⃗ $u_{3}$⃗ ⃗ ) est liée.

#### 9. Base d’un espace vectoriel.

Définition
Une famille ($u_{1}$⃗ ⃗ , $u_{2}$⃗ ⃗ , … $u_{n}$⃗ ⃗ ) est une base de l’espace vectoriel E si, et seulement
si cette famille est à la fois génératrice de E et libre.
Exemple

Dans $\mathbb{R} ^{2,}$ on considère u⃗ ⃗ (1; 2) et v⃗ (1; 1) . Montrer que (u⃗ ⃗ , v⃗ ) est une base

de $\mathbb{R} ^{2}$

Montrons que (u⃗⃗ ⃗ , v⃗⃗ ⃗ ) est une famille génératrice.
Rappel

(u⃗ ⃗ , v⃗ ) est une famille génératrice de $\mathbb{R} ^{2}$ ⟺$\forall w$⃗⃗ ⃗ $\in \mathbb{R} ^{2} , \exists ( α_{1} , α_{2} ) \in$

$\mathbb{R} ^{2} /$ w⃗⃗⃗ ⃗ = $α_{1} u$⃗⃗ ⃗ + $α_{2} v$⃗⃗ ⃗

Posons w⃗⃗ ⃗ = ( x, y).

x 1 1 x $= α_{1} + α_{2}$ (1)

On a : (y) = $α_{1}$ ( ) + $α_{2}$ ( ) ⟺ {

2 1 y = 2$α_{1} + α_{2}$ (2)

(1)-(2) $\Rightarrow x$ - y $= α_{1} + α_{2} - 2 α_{1} - α_{2}$

$x - y = - α_{1} \Rightarrow α_{1} = y - x$

Remplaçons $α_{1}$ par sa valeur dans (1), on a :

x = y - x $+ α_{2} \Rightarrow α_{2}$ = 2x - y

D’où (u⃗ ⃗ , v⃗ ) est une famille génératrice de $\mathbb{R} ^{2}$
Montrons que (u⃗⃗ ⃗ , v⃗⃗ ⃗ ) est libre.
Rappel
(u⃗⃗ ⃗ , v⃗⃗ ⃗ ) est libre ⟺ dét (u⃗⃗ ⃗ , v⃗⃗ ⃗ ) $\neq 0$
On a dét (u⃗ ⃗ , v⃗ ) = |1 1| = 1-2 = -1.
2 1
dét (u⃗ ⃗ , v⃗ ) = -1. -1$\neq$ 0
d’où (u⃗⃗ ⃗ , v⃗⃗ ⃗ ) est libre.

### Conclusion

(u⃗ ⃗ , v⃗ ) étant génératrice et libre, est une base $\mathbb{R} ^{2}$ .

#### 10. Dimension d’un espace vectoriel.

Si E admet une base ayant n éléments, alors toute base de E est formée de n
éléments.
Le naturel n s’appelle la dimension de E.
On note : dim E = n
NB
n est le nombre de vecteurs de toute base de E.
Tout espace vectoriel de dimension 1 est appelé droite vectorielle.
Tout espace vectoriel de dimension 2 est appelée plan vectoriel.
Conséquences
Dans un espace vectoriel de dimension n, toute famille libre de n éléments
est une base.
De même, toute famille génératrice de n éléments est une base.
Un espace vectoriel de dimension 0 est réduit au vecteur nul ⃗0⃗
Corollaires
- a) Si un espace vectoriel E admet une base ayant n éléments, alors toute partie
contenante plus de n éléments est liée.
Exemple
Dans $\mathbb{R} ^{2}$ , {(2,1), (- 1,2)} est une base.
{(2,1), (- 1,2), (0,1)} est une famille liée.

- b) Si un espace vectoriel admet une base ayant n éléments, alors toute partie
libre admet au plus n éléments.

#### 11. Coordonnées d’un vecteur

Soit $β$ = ($e_{1}$⃗ , $e_{2}$⃗ , … $e_{n}$⃗ ) est une base d’un espace vectoriel E. On appelle
coordonnées d’un vecteur u⃗ ⃗ de E, les réels $x_{1} , x_{2}$ , … , $x_{n}$ , tels que u⃗ ⃗ = $x_{1} e_{1}$⃗ +

$x_{2} e_{2}$⃗ + …+$x_{n} e_{n}$⃗

### II. Applications linéaires

#### 1. Définition.

E et F étant deux espaces vectoriels sur $\mathbb{R}$ , on dit qu’une application f de E
vers F est linéaire si et seulement si f vérifie les deux propriétés suivantes :
- 1) $\forall ($u ⃗ , v ⃗ ) $\in E$2, f (u ⃗ + v ⃗ ) = f (u ⃗ ) + f (v ⃗ ).
- 2) $\forall f$(⋋, u⃗ ⃗ )$\in \mathbb{R}$ x E, f (⋋.u⃗ ⃗ ) = ⋋ f (u⃗ ⃗ )
Remarque
f (u⃗ ⃗ ), f ( v⃗ ), f (u⃗ ⃗ + v⃗ ), f(⋋, u ⃗ ), ⋋ f (u⃗ ⃗ ) sont des éléments de F.
Vocabulaire
Soit f une application linéaire de E vers F.
Si $E \neq F$, alors f est un homomorphisme.
Si E = F, alors f est appelée endomorphisme de E.
Tout endomorphisme bijectif, est appelé automorphisme.

Exemple

F : $\mathbb{R} ^{2} \to \mathbb{R} ^{3}$

$x$

u⃗ ⃗ (y$) \to$ f (u⃗ ⃗ ) = (x +2y ; -x 3y).
Démontrer que f est une application linéaire de $\mathbb{R} ^{2}$ vers$\mathbb{R} ^{3}$

### Solution

Démontrons que f est une application linéaire.
f (u⃗ ⃗ ) = (x + 2y $;$ - x ; 3y)

$x x’$

$\forall u$⃗ ⃗ (y$) \in \mathbb{R} ^{2} , \forall v$⃗ ( ) $\in \mathbb{R} ^{2}$

$y’$

On a : f (u⃗ ⃗ ) = (x + 2y $;$ - x ; 3y)
f ( v⃗ ) = (x’+ 2y’; - x’; 3y’)
f (u⃗ ⃗ + v⃗ ) = [(x + 2y + x’+ 2y’); (- x - x’); (3y + 3y’)]
= (x + 2y $;$- x ; 3y) + (x’+ 2y’;- x’; 3y’)
= f (u⃗ ⃗

$\frac{) + f ( v ⃗ )}{f ( u ⃗ ⃗ ⃗ + v ⃗ ⃗ ⃗ ) = f ( u ⃗ ⃗ ⃗ ) + f ( v ⃗ ⃗ ⃗ )}$

Alors
f(⋋ u⃗ ⃗ ) = ?
f(⋋u⃗ ⃗ ) = f(⋋ x,⋋ y)
= ((⋋ x + 2 ⋋ y$;$ - ⋋ x; 3 ⋋ y)
= ⋋ ( x + 2y$;$ - x; 3y)
= ⋋ f(u⃗ ⃗ )
Alors : f(⋋u⃗⃗ ⃗ ) = ⋋ f(u⃗⃗ ⃗ )

### Conclusion

et signifient que f est une application linéaire.
NB :
Une application linéaire est totalement déterminée si l’on connait les images
des vecteurs de base.
Exemple
Soit E l’espace vectoriel de base (i⃗ , j⃗ , k⃗⃗ ), f est l’application linéaire de E
dans E telle que :
f(i⃗ ) = 2 i⃗ - j⃗ ; f (j⃗ ) = j⃗ + k⃗⃗ ; f (3 i⃗ - k⃗⃗ ) = f(j⃗ )
Déterminer le vecteur f (k⃗⃗ )

### Solution

Déterminons le vecteur f (k⃗⃗ )
On sait que f (3i⃗ ) - f(k⃗⃗ ) = f(j⃗ ) ⟺ f (k⃗⃗ ) = 3 f (i⃗ ) – f(j⃗ )
f (k⃗⃗ )= 3 (2i⃗ - j⃗ ) - (j⃗ + k⃗⃗ )
f (k⃗⃗ )= 6i⃗ - 3 j⃗ - j⃗ - k⃗⃗
D’où f (⃗k⃗ ⃗ ) = 6i⃗ - 4j⃗ - ⃗k⃗ ⃗

#### 2. Noyau et image d’une application linéaire.

Soit f une application linéaire d’un espace vectoriel E dans un espace
vectoriel F.

##### a) Noyau

On appelle noyau de f et on noté Kerf l’ensemble des vecteurs u⃗ ⃗ de E
tels que f(u⃗ ⃗ )= ⃗0⃗
Kerf = u⃗⃗ ⃗ $\in /$f(u⃗⃗ ⃗ ) = ⃗0⃗ ⃗
Image
On appelle image de f et on note Imf, l’image f(E) de E par f.
F : E ⟶ F
u⃗ ⃗ ⟶ ⃗u’⃗ ⃗ ⃗ = f(u⃗ ⃗ )
Imf = {f(u⃗⃗ ⃗ ) $\in F /$ u⃗⃗ ⃗ $\in E$}
Théorèmes
Th1 : Kerf est un sous-espace vectoriel de E.
Th2 : Imf est un sous-espace vectoriel de F.
Th3 : f est surjective si et seulement si Imf = F.
Th4 : f est injective si et seulement si Kerf = {⃗0⃗ }, ou f$( u_{1}$⃗ ⃗ ) =

f$( u_{2}$⃗ ⃗ ) ⟺ $u_{1}$⃗ ⃗ = $u_{2}$⃗ ⃗

Remarque 1
Si f est un endomorphisme de E alors :
dimKerf + dimImf = dimE
Remarque 2
Si ($\Delta$): ax + by + c = 0, alors un vecteur directeur est u⃗⃗ ⃗ (- b)

$a$

Si ($\Delta$): y = ax + b , alors un vecteur directeur est u⃗⃗ ⃗ (1)

$a$

Exercices d’application

### Exercice 1

Dans l’espace vectoriel $\mathbb{R} ^{2}$ muni de la base $β$ = ($e_{1}$⃗ , $e_{2}$⃗ ), on considère l’application
linéaire f définie par :
x’= - x + 3y
{
y’= 2x - 6y

#### 1) Quel est le noyau de f ? Donnez-en une base.

#### 2) Quelle est l’image de f ? Donnez-en une base.

### Solution

x’= - x + 3y
{
y’= 2x - 6y

#### 1. Noyau de f

x ⃗⃗⃗ ⃗ x’
Posons u⃗ ⃗ (y) alors f (u⃗ ⃗ ) = u’( )

$y’$

Par définition Kerf = u⃗ ⃗ $\in \mathbb{R} ^{2} /$ f (u⃗ ⃗ ) = ⃗0⃗
x’= 0 - x + 3y = 0
⟺ { ⟺ {
y’= 0 2x - 6y = 0
Calculons le déterminant du système obtenu.
dét = d = |- 1 3|= 6 – 6 = 0

#### 2 - 6

Comme d=0 alors le système admet une infinité de solution.
En effet, les deux équations sont équivalentes.
- x + 3y = 0
- x + 3y = 0

⟺ { $\frac{1}{2} \Rightarrow$ {

2x - 6y = 0 |$\times ($- ) - x + 3y = 0
Le système se réduit à une seule équation - x + 3y = 0 ⟺ x - 3y = 0

### Conclusion

Le noyau a pour équation x-3y=0, d’où Kerf est la droite vectorielle
d’équation x - 3y = 0

$ou y = \frac{1}{3} x$.

Base :
Une base de Kerf est $e_{1}$⃗ (3) ou $e_{1}$⃗ = 3i⃗ + j⃗
2 Image de f

Par définition Imf = f (u⃗ ⃗ ) $\in \mathbb{R} ^{2} /$ u⃗ ⃗ $\in \mathbb{R} ^{2}$

x’= - x + 3y (1) 2x’= - 2x + 6y

Donc { $\Rightarrow$ {

y’= 2x - 6y (2) y’= 2x - 6y
2x’+ y’= 0

### Conclusion

Imf est la droite vectorielle d’équation 2x’+ y’= 0
Base
Une base de Imf est $e_{2}$⃗ (- 1) ou $e_{2}$⃗ = - i⃗ + 2 j⃗

### Exercice 2

Soit $β$= (i⃗ , j⃗ ) une base de l’espace vectoriel E. On considère l’endomorphisme f

$x’= x - 2 y$

défini par : {
y’= 3x + y

##### a) Déterminons Kerf et Imf

- b) f est est-elle bijective ?

### Solution

##### a) Déterminons Kerf et Imf

x x’= 0 x - 2y = 0
u⃗ ⃗ ( ) $\in$ kerf ⟺ f(u⃗ ⃗ ) = ⃗0⃗ ⟺⟺ { ⟺ {
y y’= 0 3x + y = 0
Calculons le déterminant du système
dét = d | 1 - 2 |= 1+6 = 7 ⟹ 7 $\neq$ 0
3 1
Comme d $\neq$ 0, le système admet une solution unique.
Résolvons le système par une méthode de notre choix.
Utilisons la méthode d’addition.

##### x - 2y = 0 $\frac{x - 2y = 0}{{ 6 x + 2 y =}}$

⟺ { | ⟹
3x + y = 0 $\times$ (2) 0

7x = 0 $\Rightarrow$ x = 0

x = 0 dans (1) $\Rightarrow$ -2y = 0 $\Rightarrow$ y = 0

D’où S ={(0,0)}
Alors Kerf = {⃗0⃗ } donc f est injective.
Image de f :
x’= x - 2y
f(u⃗ ⃗ ) $\in I$mf ⟺ {
y’= 3x + y
d= | 1 - 2 | = 1+6 = 7 $\neq$ 0
3 1
donc pour tout couple (x’, y’) de réels, il existe au moins un couple (x, y) tel que :
x’= x - 2y
{ alors f est surjective, donc Imf = E.
y’= 3x + y
2.- Comme f est à la fois injective et surjective, donc f est bijective.

#### 3. $Ensemble de vecteurs W_{1}$ invariants par f

Soit f : E ⟶ E
u⃗ ⃗ ⟶ ⃗u⃗⃗ ⃗’= f(u⃗ ⃗ ), un endomorphisme de E.
u⃗ ⃗ et invariant par f ⟺ f(u⃗ ⃗ ) = u⃗ ⃗
L’ensemble des vecteurs invariants est $: W_{1}$ = {u⃗ ⃗ $\in E$ /f(u⃗ ⃗ ) = u⃗ ⃗ }

#### 4. Ensemble de vecteurs W2 transformés en leurs opposés

Soit f : E ⟶ E
u⃗ ⃗ ⟶ ⃗u⃗⃗ ⃗’= f(u⃗ ⃗ ) = - u⃗ ⃗ , un endomorphisme de E.
$W_{2}$ = {u⃗ ⃗ $\in E$ /f(u⃗ ⃗ ) = - u⃗ ⃗ }

#### 5. Expression analytique d’une application linéaire

Soit f $:$ E ⟶ F
u⃗ ⃗ ⟶ ⃗u⃗⃗ ⃗’= f(u⃗ ⃗ ), une application linéaire.
Déterminer l’expression analytique de l’application linéaire f revient à exprimer les
composantes de ⃗u⃗⃗ ⃗’en fonction de celles de u⃗ ⃗
Soit (i⃗ , j⃗ , k⃗⃗ ) une base de E, ⃗u⃗⃗ ⃗’(x’, y’, z’) image par f d’un vecteur u⃗ ⃗ (x, y, z) de E. Si
Mf est la matrice de f dans la base (i⃗ , j⃗ , k⃗⃗ ), alors f(u⃗ ⃗ )= u⃗ ⃗ ⟺ Mf u⃗ ⃗ = ⃗u⃗⃗ ⃗’
a b c x x’x’= ax + by + cz
Ainsi : (a’b’c’) (y) = (y’) ⟹ {y’= a’x + b’y + c’z
a" b" c" z z’z’= ax + by + c"z
est l’expression analytique de f dans la base (i⃗ , j⃗ , k⃗⃗ ).
Exemple
Soit E l’espace vectoriel de base (i⃗ , j⃗ ) et soit f : E↦ E l’application linéaire définie.
telle que f (i⃗ ) = 3i⃗ + j⃗ et f (j⃗ ) = - i⃗ + j⃗ . Déterminer l’expression analytique de f.

### Solution

On a : f : E ↦ E
x ⃗⃗⃗ ⃗ x’
u⃗ ⃗ (y) ↦ u’( ) = f (u⃗ ⃗ )

$y’$

On a : x’i⃗ +y’j⃗ = f (xi⃗ + yj⃗ )
= x f (i⃗ )+y f (j⃗ )
= x (3i⃗ +j⃗ ) + y (-i⃗ +j⃗ )
= 3 x i⃗ +x j⃗ - yi⃗ + y j⃗
x’i⃗ + y’j⃗ = ( 3x - y) i⃗ + (x + y) j⃗
Par identification
x’= 3x – y
{
y’= x + y
est l’expression analytique de f.

#### 6. Matrice d’une application linéaire

La matrice d’une application linéaire s’obtient à partir de l’expression analytique de

$f$.

Dans la base $β$ = (i⃗ , j⃗ ) , si f est définie par :
x’= ax+ cy
y’= bx +dy

$x x’$

Avec u⃗ ⃗ (y) et f (u⃗ ⃗ ) =( ), on convient d’écrire :

$y’$

x’a c x
( ) = (b d ) (y) ligne

$y’$

Colonne.
a c
Le symbole M = (b d ) est appelé matrice de l’application linéaire f par rapport à la
base$β$.

a c
Elle est parfois notée $M_{f}$ = [ ] et est appelé matrice carrée d’ordre 2.
b d
Remarques
Une matrice est dite carrée si le nombre de lignes est égal au nombre de colonnes.
Exemples 1 : dans la base (i⃗ , j⃗ ), la matrice associée de l’application linéaire f définie
x’= 3x - y 3 - 1
par { est : Mf = ( )
y’= x + y 1 1
Exemple 2
Dans la base (i⃗ , j⃗⃗⃗ , ⃗k⃗⃗ ⃗ , ), la matrice associée à l’application linéaire
x’= 2x - y + z 2 - 1 1
f $: \mathbb{R} ^{3}$ ⟶ $\mathbb{R} ^{3}$ définie par : {y’= - x + 2y - 4z est Mf = [- 1 2 - 4]

$z’= x + y 1 1 0$

Rappels
La base canonique de $\mathbb{R}$² est = {i⃗ $(_{0}$1), j⃗ $(_{1}$0)}
1 0 0
La base canonique de $\mathbb{R} ^{3}$ est $: \beta =$ {i⃗ (0) ; j⃗ (1) ; k⃗⃗ (0)}
0 0 1
Théorème
Soit f : E E ; U⃗⃗⃗ ⃗U⃗ ⃗ ⃗’= f(U⃗⃗⃗ ) un endomorphisme de E et Mf la matrice de f
dans la base canonique.
f est bijective si, et seulement si dét M$f \neq$ 0.
Remarques importantes
Remarque 1
Si f est un endomorphisme de $\mathbb{R}$² muni de la base (i⃗ , j⃗ ) et si on connaît f(i⃗ )
et f(j⃗ ), alors la matrice de f est telle que :

f(i⃗ ) f(j⃗ )
Mf = ( ⋮ ⋮ )
⋮ ⋮

### Exercice 1 d’application

Soit f un endomorphisme de $\mathbb{R} ^{2}$ muni de la base (i⃗ , j ⃗⃗ ⃗ ) est défini tel que :
f(i⃗ ) = - i⃗ + 2j⃗
{
f(j⃗ ) = 3i⃗ - 4j⃗
Déterminons la matrice de f.

### Solution la matrice de f est M = (- 1 3)

$f 2 -$ 4

Remarque 2
Soit f un endomorphisme de $\mathbb{R} ^{3}$ muni de la base (i⃗ , j⃗⃗⃗ , ⃗k⃗⃗ ⃗ , ) et si on connait
f(i⃗ ), f(j⃗ ), f(k⃗⃗ ), alors la matrice de f est telle que :
f(i⃗ ) f(j⃗ ) f(k⃗⃗ )
Mf = ( ⋮ ⋮ ⋮ )
⋮ ⋮ ⋮

### Exercice 2 d’application

Soit E un espace vectoriel rapporté à une base ($e_{1}$⃗ ⃗ ⃗ ⃗ , $e_{2}$⃗ ⃗ ⃗ ⃗ ⃗, ⃗$e_{3}$⃗ ⃗ ⃗ ⃗ , ). Soit f

f$( e_{1}$⃗ ) = 3$e_{1}$⃗ $- e_{2}$⃗ + $e_{3}$⃗

l’endomorphisme de E défini tel que : { f$( e_{2}$⃗ ) = $e_{1}$⃗ + $e_{2}$⃗ + 2$e_{3}$⃗

f $( e_{3}$⃗ ) = $- e_{1}$⃗ + $e_{2}$⃗ + 3$e_{3}$⃗

Trouver la matrice de f.

### Solution

#### 3 - 1 1

La matrice de f est : Mf =[ 1 1 2]
- 1 1 3

### Exercice 3 d’application

Dans la base (i⃗ , j⃗⃗⃗ , ⃗k⃗⃗ ⃗, ), on considère l’application linéaire dont la matrice est

#### 0 - 2 2

$M_{f}$ = [2 - 4 2].

#### 2 - 2 0

L’application f est-elle bijective ?

### Solution

#### 0 - 2 2 0 - 2

Det $M_{f}$ = ⌈2 - 4 2 2 - 4⌉ = 0 – 8 – 8 + 16 – 0 - 0 = -16 + 16 = 0

#### 2 - 2 0 2 - 2

### Conclusion

Comme le dét de $M_{f}$ = 0, alors f n’est pas bijective

### Exercice

Dans l’espace vectoriel E de base (i⃗ , j⃗⃗⃗ , ⃗k⃗⃗ ⃗ , ), on considère l’endomorphisme f qui à tout
x x’x’= - 2x + 4y + 2z
vecteur u⃗ ⃗ (y) associe le vecteur u’⃗ ⃗ (y’) tel que : {y’= - 4x + 8y + 4z
z z’z’= 5x - 10y - 5z

#### 1. Déterminer la matrice M de f

- 2. Déterminer le noyau de f, puis en donner une base ($e_{1,}$⃗ $e_{2}$⃗ ).
- 3. Déterminer l’image de f, puis en donner une base ($e_{3}$⃗ )
- 4. Déterminer l’ensemble des vecteurs invariants par f, puis en donner une base ($e_{4}$⃗ )
- 5. Montrer que ($e_{1}$⃗ , $e_{2}$⃗ , $e_{3}$⃗ ) est une base de E, puis écrire la matrice M de f dans la base

($e_{1}$⃗ , $e_{2}$⃗ , $e_{3}$⃗ ).

### Solution

x’= - 2x + 4y + 2z - 2 4 2
- 1. F : {y’= - 4x + 8y + 4z, alors la matrice de f est : Mf = (- 4 8 4 )
z’= 5x - 10y - 5z 5 - 10 - 5

#### 2. Déterminons le noyau de f

x’= 0 - 2x + 4y + 2z = 0
Kerf = { u⃗ ⃗ $\in E /$f(u⃗ ⃗ ) = u⃗ ⃗ } ⟹ {y’= 0 ⟺ {- 4x + 8y + 4z = 0
z’= 0 5x - 10y - 5z = 0
Calculons le déterminant du système
- 2 4 2 - 2 4
Dét = d = |- 4 8 4 - 4 8 | = 80 + 80 + 80 – 80 – 80 – 80 = 0

#### 5 - 10 - 5 5 - 10

Comme d=0, alors le système admet une infinité de solution.
En effet, les trois équations sont équivalentes :
∗ (- )
- 2x + 4y + 2z = 0 x - 2y - z = 0
{- 4x + 8y + 4z = 0 |∗ ($- \frac{2 1}{4}$) ⟹ {x - 2y - z = 0 le système se réduit à une seule
|
5x - 10y - 5z = 0 $\frac{1}{5} x$ - 2y - z = 0
∗ ( )
équation x – 2y –z = 0.

### Conclusion

Kerf est un plan vectoriel d’équation x - 2y – z = 0.
Donnons une base de kerf
On fixe x.
x = 2y + z avec u⃗ ⃗ (x, y, z) ; u⃗ ⃗ = (2y + z, y, z) ⟹ u⃗ ⃗ = (2y, y, 0)+(z ; 0 ; z) ⟹
u⃗ ⃗ = y(2; 1; 0) + z(1; 0; 1)

D’où u⃗ ⃗ = $y e_{1}$⃗ + $z e_{2}$⃗

Kerf est un plan vectoriel d’équation x - 2y - z = 0 engendré par les vecteurs
2 1

$e_{1}$⃗ (1) et $e_{2}$⃗ (0)

0 1

#### 3) $\frac{Déterminons l’image Imf}{’}$

Imf = { u⃗ ⃗ $ε$ E $/ \exists u$⃗ ⃗ $\in$ E et u’⃗ ⃗ = f( u⃗ ⃗ )}
x’= - 2x + 4y + 2z x’= - 2x + 4y + 2z
{y’= - 4x + 8 y + 4 z |∗ (2) ⟹ { 2y’= - 8x + 16y + 8z
z’= 5x - 10y - 5z ∗ (2) 2z’= 10x - 20 y - 10z
x’+ 2y’+ 2z’= 0
Donc Inf est un plan vectoriel d’équation x + 2y + 2 z = 0

$\frac{Donnons une base de Imf}{x}$

$- 2 y - 2 z - 2 y - 2 z -$2

u⃗ ⃗ (y) $ε$ Inf ⟺ x = 2y -2z ⟹ u⃗ ⃗ ( y ) ⟹ ( y ) + ( 0 ) ⟹ y ( 1 ) +

$z z 0 z$ 0

$-$2

z ( 0 )

$- 2 -$1

Une base de Imf est $e_{3}$⃗ ( 1 ) et $e_{4}$⃗ ( 0 )
0 1
Déterminons l’ensemble des vecteurs invariants par f
x x’= x - 2x + 4y + 2z = x
u⃗ ⃗ (y) $ε$ Invf ⟺ f(u⃗ ⃗ ) = u⃗ ⃗ ⟺ {z’= y ⟺ {- 4x + 8y + 4z = y ⟺

$z z’= z 5 x - 10 y - 5 y = z$

- 3x + 4y + 2z = 0
{- 4x + 7y + 4z = 0
5x - 10y - 6z = 0
- 2x + y = 0 y = 2x y = 2x
⟹ { ⟺ { ⟺ { ⟺
- 3x + 4y + 2z = 0 - 3x + 8x + 2z = 0 5x + 2z = 0
y = 2x

{ $\frac{5}{2}$

$z = - x ; xε \mathbb{R}$

$x x$ 1

D’où u⃗ ⃗ (y) $ε$ Inf ⟺ u⃗ ⃗ ( 2 ) = x ( )

$z - \frac{5 x}{2} x \frac{- 2 5}{2}$

Donc Invf est une droite vectorielle engendrée par $e_{5}$⃗ ( ) ou = i⃗ + 2j⃗ $- \frac{5}{2 ⃗}$ ℎ⃗

$\frac{- 2 5}{2}$

On fixe y = $λ$, alors (2) ⟹ x $= \frac{1}{2} λ$

$x \frac{1}{2} λ \frac{1}{2}$

U⃗⃗⃗ (y) ⟹ U⃗⃗⃗ ( ) = $λ$ ( )

$z \frac{- 5 λ}{4} λ \frac{- 1 5}{4}$

1/2
Donc Invf est une droite vectorielle d’équation y =-$\frac{4}{5}$ z engendrée par $e_{1}$⃗ ( 1 ) ou
- 5/4

$e_{1}$⃗ = $\frac{1}{2 ⃗} i$+j⃗ - $\frac{5}{4 ⃗} k$⃗

5.- Montrons que ($e_{1}$⃗ , $e_{2}$⃗ , $e_{3}$⃗ ) est une base de E, puis écrivons la matrice M de f dans la

base ($e_{1}$⃗ , $e_{2}$⃗ , $e_{3}$⃗ ).

($e_{1}$⃗ , $e_{2}$⃗ , $e_{3}$⃗ ) est une base de E ⟺ dét ($e_{1}$⃗ , $e_{2}$⃗ , $e_{3}$⃗ ) $\neq$ 0

2 1 - 2 2 1
dét ($e_{1}$⃗ , $e_{2}$⃗ , $e_{3}$⃗ ) = |1 0 - 4 1 0|
0 1 5 0 1
dét ($e_{1}$⃗ , $e_{2}$⃗ , $e_{3}$⃗ ) = 0 + 0 - 2 - 0 + 8 - 5 = 1

dét ($e_{1}$⃗ , $e_{2}$⃗ , $e_{3}$⃗ ) = 1

Comme dét ($e_{1}$⃗ , $e_{2}$⃗ , $e_{3}$⃗ ) $\neq$ 0, donc ($e_{1}$⃗ , $e_{2}$⃗ , $e_{3}$⃗ ) est une base de E.

*Ecrivons la matrice de f dans la base ($e_{1}$⃗ , $e_{2}$⃗ , $e_{3}$⃗ ).
On sait que :
$e_{1}$⃗ = 2i⃗ + j⃗ ; $e_{2}$⃗ = i⃗ + k⃗⃗ et $e_{3}$⃗ = - 2i⃗ - 4j⃗ + 5k⃗⃗
Exprimons i⃗ , j⃗ , k⃗⃗ en fonction de $e_{1}$⃗ , $e_{2}$⃗ , $e_{3}$⃗
2i⃗ + j⃗ = $e_{1}$⃗ (1)
{ i⃗ + k⃗⃗ = $e_{2}$⃗ (2)
- 2i⃗ - 4j⃗ + 5k⃗⃗ = $e_{3}$⃗ (3)
(1) j⃗ = $e_{1}$⃗ - 2i⃗

Remplaçons j⃗ par sa valeur dans (2) et (3), on a :
i⃗ + k⃗⃗ = $e_{2}$⃗ i⃗ + k⃗⃗ = $e_{2}$⃗
{ ⟹ {
- 2i⃗ - 4($e_{1}$⃗ - 2i⃗ ) + 5k⃗⃗ = $e_{3}$⃗ - 2i⃗ - 8i⃗ + 5k⃗⃗ = 4$e_{1}$⃗ + $e_{3}$⃗
- 3x + 4y + 2z = 0 (1)
⟹ {- 4x + 7y + 4z = 0(2)
5x - 10y - 6z = 0(3)
Calculons la déterminant du système
- 3 4 2 - 3 4
dét = d = |- 4 7 4 - 4 7| = 126 + 80 + 80 - 70 - 120 - 96 = 0

#### 5 - 10 - 6 5 - 10

Comme d=0, alors le système admet une infinité de solutions.
(2)⟹ x $= \frac{7}{4} y$ + z remplaçons x par sa valeur dans (1)

- 3 ($\frac{7}{4} y$ + z) + 4y + 2z = 0 $- \frac{21}{4} y$ + 4y - 3z + 2z = 0

On aura : { ⟹ {

5 ($\frac{7}{4} y$ + z) - 10y - 6z = 0 $\frac{35}{4} y$ - 10y + 5z - 6z = 0

i⃗ + k⃗⃗ = $e_{2}$⃗ k(- 5) - 5i⃗ - 5k⃗⃗ = - $5 e_{2}$⃗
{ ⌊ ⟹ {

6i⃗ + 5k⃗⃗ = 4$e_{1}$⃗ + $e_{3}$⃗ 6i⃗ + 5k⃗⃗ = 4$e_{1}$⃗ + $e_{3}$⃗

i⃗ = 4$e_{1}$⃗ - $5 e_{2}$⃗ + $e_{3}$⃗

Remplaçons i⃗ par sa valeur dans (2), on a :

k⃗⃗ = $e_{2}$⃗ - $4 e_{1}$⃗ + 5$e_{2}$⃗ $- e_{3}$⃗ ⟹ k⃗⃗ = - $4 e_{1}$⃗ + 6$e_{2}$⃗ $- e_{3}$⃗

Remplaçons i⃗ et k⃗⃗ par leurs valeurs dans (3), on a :

4j⃗ = $- e_{3}$⃗ - 2(- $4 e_{1}$⃗ + 6$e_{2}$⃗ $- e_{3}$⃗ ) + 5(- $4 e_{1}$⃗ + 6$e_{2}$⃗ $- e_{3}$⃗ )

4j⃗ = $- e_{3}$⃗ - $2 e_{3}$⃗ - $5 e_{3}$⃗ - $8 e_{1}$⃗ - $20 e_{1}$⃗ + 10$e_{2}$⃗ + 30$e_{2}$⃗

4j⃗ = - $28 e_{1}$⃗ + 40$e_{2}$⃗ - $8 e_{3}$⃗

Soit : j⃗ = - $7 e_{1}$⃗ - $10 e_{2}$⃗ - $2 e_{3}$⃗

On sait aussi que :
f(i⃗ ) = - 2i⃗ - 4j⃗ + 5k⃗⃗

f(j⃗ ) = 4i⃗ + 8j⃗ - 10k⃗⃗
f(k⃗⃗ ) = 2i⃗ + 4j⃗ - 5k⃗⃗
Alors f(i⃗ ) = f(4$e_{1}$⃗ - $5 e_{2}$⃗ + $e_{3}$⃗ ) = - 2i⃗ - 4j⃗ + 5k⃗⃗ = $e_{3}$⃗

⟹ 4f$( e_{1}$⃗ ) - 5f$( e_{2}$⃗ ) + f$( e_{3}$⃗ ) = $e_{3}$⃗

f(j⃗ ) = f(- $7 e_{1}$⃗ + 10$e_{2}$⃗ - $2 e_{3}$⃗ ) = 4i⃗ + 8j⃗ - 10k⃗⃗ = - $2 e_{3}$⃗

⟹ - 7f$( e_{1}$⃗ ) + 10f$( e_{2}$⃗ ) - 2f$( e_{3}$⃗ ) = - $2 e_{3}$⃗

- 4x - 5y + z $= e_{3}$⃗ (1)
⟹ {- 7x + 10y - 2z = - $2 e_{3}$⃗ (2)
- 4x + 6y - z $= e_{3}$⃗ (3)
Remplaçons z par sa valeur dans
- 7x + 10y - 2(4x + 5y $+ e_{3}$⃗ ) = - $2 e_{3}$⃗
{
- 4x + 6y - (4x + 5y $+ e_{3}$⃗ ) = $e_{3}$⃗
x = 0
{ alors : z $= e_{3}$⃗ + 4(0) + 5(2$e_{3}$⃗ )

y = 2$e_{3}$⃗

Ainsi donc :

f$( e_{1}$⃗ ) = 0$e_{1}$⃗ + 0$e_{2}$⃗ + 0$e_{3}$⃗

{ f$( e_{2}$⃗ ) = 0$e_{1}$⃗ + 0$e_{2}$⃗ + 2$e_{3}$⃗

f$( e_{3}$⃗ ) = 0$e_{1}$⃗ + 0$e_{2}$⃗ + 11$e_{3}$⃗

$0 0 0$

La matrice de f dans la base $e_{1}$⃗ , $e_{2}$⃗ , $e_{3}$⃗ est : $M_{f}$ = (0 0 0)

$0 2 11$

### Exercice :

L’espace vectoriel $\mathbb{R} ^{3}$ est rapporté à une base canonique (i⃗ , j⃗ , k⃗⃗ ). On considère
l’application f $: \mathbb{R} ^{3}$ ⟶ $\mathbb{R} ^{3}$ qui à tout vecteur u⃗ ⃗ (x, y, z) associé le vecteur ⃗u’⃗ ⃗ ⃗ (x’, y’, z’)
u⃗ ⃗ (x, y, z) ⟶ ⃗u’⃗ ⃗ ⃗ (x’, y’, z’)
x’= x + ay + 2z
{ y’= x + 2y + z

$z’= x + y$

- 1. Déterminer les valeurs de a pour lesquelles f est bijective.

#### 2. On pose : a=1

##### a) Déterminer le noyau de f.

##### b) Déterminer l’image de f

- 3. Soit w⃗⃗ ⃗ = (1, ∝, $β$) un vecteur de $\mathbb{R} ^{3}$ .
Déterminer ∝ et $β$ pour que w⃗⃗ ⃗ $\in$ Kerf

#### 7. Opérations sur les matrices dans $\mathbb{R}$

$a c$

Soit $M_{f}$ = (b d), la matrice de l’endomorphisme f
et Mg = (a’c’), la matrice de l’endomorphisme g

$b’d’$

##### a) Somme des matrices $M_{f} \frac{+ M}{g}$

$a c a’c’a + a’c + c’$

$M_{f+g}$ = (b d) + ( ) ⟹ $M_{f+g}$ = ( )

$b’d’b + b’d + d’$

##### b) Multiplication d’une matrice par un réel

a c ⋋ a ⋋ c

$\forall$ ⋋$\in \mathbb{R}$, ⋋ $M_{f}$ =⋋ (b d) = ( )

⋋ b ⋋ d

##### c) Multiplication de deux matrices

La matrice de $f \circ g$ est :

$a c a’c’$

M$f \circ g$ = $Mf \times Mg$ = (b d) ( )

$b’d’$

M = (aa’+ cd’ac’+ cd’)

$f \circ g b d’+ d b’b c’+ dd’$

Exemple
1 0 0 2 0 + 0 2 + 0 0 2
( )( ) = ( ) = ( )
2 3 1 1 0 + 3 4 + 3 3 7
NB :
Pour noter une matrice, on utilise indifféremment les crochets, les
parenthèses ou la double barre.
Un endomorphisme peut être défini par :
- a) Sa matrice ;
- b) Son expression analytique ;

##### c) Les images de vecteurs de base.

#### 8. Endomorphismes particuliers

##### a. Projection vectorielle (ou projecteur)

Soit E un espace vectoriel de base $β$ = ($e_{1}$⃗ , $e_{2}$⃗ … , $e_{n}$⃗ )
Définition
On appelle projection vectorielle de E, tout endomorphisme f de E tel que :

$f \circ f = f ou Mf \times Mf = Mf$

NB :
x ⃗ ⃗ ⃗ ⃗ x’
Soit U⃗⃗⃗ ( ) alors f(u⃗ ⃗ ) = U’( )

$y y’$

Donc $f \circ f$ = f ⟺ f[f(u⃗ ⃗ )] =f(⃗u’⃗ ⃗ ⃗ )
⃗ ⃗ ⃗ ⃗ ⃗ x’= x’
=u’’⟹ {

$y’= y’$

$x’= x’$

Alors $f \circ f$ = f ⟹ {

$y’= y’$

Les éléments caractéristiques d’une projection vectorielle sont :
- La base (ou axe de projection) : C’est l’ensemble des vecteurs
invariants, donc c’est $W_{1}$ = Invf = {u⃗⃗ ⃗ $\in E /$ f(u⃗⃗ ⃗ ) = u⃗⃗ ⃗ }
- La Direction : C’est le noyau de l’application, c’est :
Kerf = {u⃗⃗ ⃗ $\in E /$ f(u⃗⃗ ⃗ ) = ⃗0⃗ ⃗ }

##### b. Symétrie vectorielle (ou involution)

Définition
On appelle symétrie vectorielle, tout endomorphisme f de E tel que :

$f \circ f = Id_{E} ou Mf \times Mf = M_{I}$

$M_{I}$ est la matrice unité.
Les éléments caractéristiques d’une symétrie vectorielle sont :
- La base (ou axe de symétrie) : C’est l’ensemble des vecteurs
invariants, donc c’est Invf = {u⃗⃗ ⃗ $\in E /$ f(u⃗⃗ ⃗ ) = u⃗⃗ ⃗ }
- La Direction : C’est l’ensemble des vecteurs transformés en
leurs opposés, c’est :
$W_{2}$ = {u⃗⃗ ⃗ $\in E /$ f(u⃗⃗ ⃗ ) = - u⃗⃗ ⃗ }
NB :
$M_{I}$ est dite matrice inversible, c’est-à-dire qu’elle admet une matrice
symétrique pour la multiplication.

$La matrice symétrique de M_{I}$ se nomme $: matrice inverse de M_{I}$ et

se note $M_{I}^{-1}$

Exemple
- 1 2 5
Soit la matrice de A telle que : A = ( 1 2 3 )
- 2 8 10
Détermine la matrice inverse de A, notée $A^{-1}$

### Solution

- 1 2 5
A = ( 1 2 3 )
- 2 8 10
Calculons le déterminant de A.
- 1 2 5 - 1 2
Det A = | 1 2 3 1 2 |
2 8 10 - 2 8
Dét A= -20-12+40 +20 +24 -20
Dét A = -32 + 64
Dét A = 32
Déterminons la matrice inverse de A.
| 2 3 | - | 1 3 | |1 2|
8 10 - 2 10 - 2 8

$\frac{1}{32}$ 2 5 - 1 5 - 1 2

$A^{-1} =$ - | | | | - | |
8 10 - 2 10 - 2 8
|2 5| - |- 1 5| |- 1 2|
( 2 3 1 3 1 2 )
- 4 - 16 12 - 4 20 - 4

$A^{-1} = \frac{1}{32}$ ( 20 0 4 ) ⟹ $A^{-1} = \frac{1}{32} ($- 16 0 8)

- 4 8 - 4 12 4 - 4
D’où

$- \frac{1}{8} \frac{5}{8} - \frac{1}{8}$

$\frac{1}{2}$ 1

$A^{-1} = -$ 0

$\frac{3}{8} \frac{1}{8} - \frac{1 4}{8}$

( )

Remarques

- Dans $\mathbb{R} ^{2} , M_{I}$ = (1 0)

0 1
1 0 0

- Dans $\mathbb{R} ^{3} , M_{I}$ = (0 1 0)

0 0 1
1 0 0 0

- Dans $\mathbb{R} ^{4} , M_{I}$ = (0 1 0 0)

0 0 1 0
0 0 0 1
Exercices d’application

### Exercice 1

Le plan vectoriel (P⃗⃗ ) est rapporté à une base (i⃗ , j⃗ ), Soit f un endomorphisme
de (P⃗⃗ ) qui à tout vecteur u⃗ ⃗ (x, y) associe ⃗u’⃗ ⃗ ⃗ (x’, y’) tel que :

$x’= \frac{1}{4} x - \frac{3}{4} y$

{

$y’= - \frac{1}{4} x + \frac{3}{4} y$

#### 1) Démontrer que f est une projection vectorielle.

#### 2) $Déterminer sa base E_{1}$

#### 3) $Déterminer sa direction E_{2}$

### Solution

$\frac{1}{4} - \frac{3}{4}$

Mf = ( )

$- \frac{1}{4} \frac{3}{4}$

#### 1. F est une projection vectorielle ⟺ $Mf \times Mf$ = Mf

$\frac{1}{4} - \frac{3}{4} \frac{1}{4} - \frac{3}{4}$

On a : M$f \times Mf$ = ( ) ( )

$- \frac{1}{4} \frac{3}{4} - \frac{1}{4} \frac{3}{4}$

$\frac{1}{16} \frac{3}{16} \frac{3}{16} 9 \frac{4}{16} \frac{12}{16}$

+ $- - -$

$Mf \times Mf$ = ( ) = ( )

$- \frac{1}{16} - \frac{3}{16} \frac{3}{16} + \frac{16 9}{16} - \frac{4}{16} \frac{12}{16}$

$\frac{1}{4} - \frac{3}{4}$

$Mf \times Mf$ = ( ) = Mf

$- \frac{1}{4} \frac{3}{4}$

Autre méthode

$x’= \frac{1}{4} x - \frac{3}{4} y$

{

$y’= - \frac{1}{4} x + \frac{3}{4} y$

F est une projection vectorielle ⟺ fof = f

$\frac{1}{4} \frac{3}{4}’$

$x’= x’x’= x’- y’$

⟺ {’⟺ {’⟺

$y’= y’y’= - \frac{1}{4} x’+ \frac{3}{4} y’$

1 1 3 3 $\frac{1}{4} \frac{3}{4}$

x’= ( x - y) - ( x + y)

{ $’$

y’= $- \frac{4 1}{4} ( \frac{4 1}{4} x - \frac{4 3}{4} y$) + $\frac{4 3}{4} ( - \frac{1}{4} x + \frac{3}{4} y$)

$x’= \frac{1}{16} x - \frac{3}{16} y + \frac{3}{16} x - \frac{9}{16} y x’= \frac{4}{16} x - \frac{12}{16} y$

⟺ { ⟺ {

$y’’= - \frac{1}{16} x + \frac{3}{16} y - \frac{3}{16} x + \frac{9}{16} y y’’= - \frac{4}{16} x + \frac{12}{16} y$

$x’= \frac{1}{4} x - \frac{3}{4} y$

$x’= x’$

⟺ { ⟺ {’

$’\frac{1}{4} \frac{3}{4} y’= y’$

$y’= - x + y$

### Conclusion

Comme $Mf \times Mf$ = Mf ou $f \circ f$ = f donc f est une projection vectorielle.

#### 2. Base de f.

$E_{1}$ = Invf = {u⃗ ⃗ $\in P$⃗⃗ / f(u⃗ ⃗ ) = u⃗ ⃗ }

$x’= x$

On a : f(u⃗ ⃗ ) = u⃗ ⃗ ⟺ {

$y’= y$

$\frac{1}{4} \frac{3}{4}$ 1 3 3 3

$x = x - y x - x = - y x = - y$

⟺ { ⟺ { ⟺ { ⟺

$y = - \frac{1}{4} x + \frac{3}{4} y y - \frac{4 3}{4} y = - \frac{4 1}{4} x \frac{4 1}{4} y = - \frac{4 1}{4} x$

$x = - y$

{$y = - x$

x + y = 0
⟺ {
x + y = 0

S U P E R V I S IO N E T C O O R D I N A T IO N

### I. INSTITUTION

Antoine Thomas Nicéphore FYLLA SAINT EUDES………………METPFQE
Jean NGAKOSSO………………………………………….………..Directeur de Cabinet du Ministre
Jacques MABIALA ……………………………………………........Conseiller Coordonnateur
Jacques SAMBA …………………………………………………....Conseiller Coordonnateur Adjoint
David ANGA ………………………………………………………..IGETPFQE
René Fulgence ADICOLLE GOUM ………………………………..DGET
Jean Antoine PANDZOU …………………………………………...IPETPFQE

### II. PARTENAIRES DU METPFQE

Télé – Congo ……………………………………………………………
Atlas Clavis Services……………………………………………….……
GENC…………………………………………………………......….….
STARTIMES ……………………………………………………………
MTN………………………………………………………..….……..….
AIRTEL…………………………………………………………..…..….
CONGO TELECOM………..………………………………………...…
C–DIRECT……………………………………………………………….

### III. SUPERVISION

Responsable : Félicien IBOUANGA ……………………..DDETP-B
Responsable Adjoint : Jacques BALENDE………………Inspecteur Coordonnateur du SIDETPFQE

### IV. COORDINATION

Responsable : BORO Parfait Faustin, Proviseur LTCM
Responsables Adjoints : GOUEMBA HAULLIER Alain Riches, Proviseur LEPAAC
OKO Basile, Proviseur LTIM

$\frac{MEMBRES}{-}$

DINGUISSI Patrice, Proviseur LPAK
- LELO Simon, Proviseur LTCF
- ANGOUNDA Jean Pierre, Proviseur LTIF
- MOLLOUMBA Jean Felix, Directeur EPMS
- DIAVILA Charlotte, Directrice CET Théophile Mbemba
- MILANDOU MADZOU Mfou, Directrice CETF 08 MARS
- OWASSA Bernard, Directeur ENBA
- N’GOKA ITOUA Jean Roger, Directeur ENMA
- POOS Blandine, Directrice ENI
- MBOLA Godefroy, Directeur des Etudes VA LTCM
- MOUHOUILENO Aloise, Directeur des Etudes VA LTCF
- KAMBA Julien, Directeur $des Etudes 2^{ème}$ Cycle LTIF
- KOUMBA Alphonse, Directeur $des Etudes 2^{ème}$ Cycle LTIM

### V. OPERATEURS DE SAISIE (REPRESENTANTS)

Responsable : NGOULOUBI Elie, CD série H LTCM
Responsables Adjoints :
KOUZONZA MBEMBA Sidney CD Informatique LTCM
POBA MAYILA MATONDO Néhémie, CDA Informatique LTCM
BISSICKOUMOUNOU MATONDOS Grace, CDA série H LTCM
MAKAYA Dieudonné Rudy CDA Comptabilité LTCM

### VI. CONCEPTEURS ET PRESENTATEURS DE COURS

#### 1- $\frac{LES INSPECTEURS}{?}$

NGATSE Roger
ABINYAH Eméry Didier 221

#### 2- LES PERSONNES RESSOURCES

#### 3- $\frac{LES ENSEIGNANTS ACTIFS}{?}$

MASSAMBA Juste Alfred
MAHAMBOULT Florent Bertin
MABANZA Daniel
NGOMA Florent Constant
MPOUABOUA Léonard
NTSILOULOU Justin
BEMBA KOUYOLA Emmanuel
GAMBA MOUAYA Roger
MAKILA Jean de Dieu

### VII. MATERIEL UTILISE

### VIII. BIBLIOGRAPHIE

METPFQE – MES COURS A LA MAISON
