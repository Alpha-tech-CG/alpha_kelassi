// Exercices d'entraînement de physique et de chimie nucléaire / atomique (Terminale C et D).
// Source : recueil « Exercices corrigés de Physique, Terminale S » (PDF fourni le 26/10/2026).
// Seuls les exercices complets (sans renvoi à un manuel) et conformes au programme du Congo
// ont été retenus ; énoncés reformulés (données parfois corrigées, signalé), corrigés rédigés
// pour l'application. Physique : publiés en C et en D ; chimie : publiés dans CHIMIE C (les
// chapitres de CHIMIE D en sont des copies liées, synchronisées après le seed).
const R = String.raw
const EX = 'Entraînement — '

const RFD = [
  {
    title: `${EX}Ascenseur : poussée du câble et accélération`,
    difficulty: 2,
    statement: R`La cabine d'un ascenseur, de masse $M = 400$ kg, transporte cinq personnes de masse totale $m = 300$ kg. Pendant la montée, le câble exerce sur la cabine une force $\vec F$ constante, verticale, vers le haut, de valeur $F = 8\,500$ N. On néglige les frottements ; $g = 9{,}8$ m/s².
1. Faire l'inventaire des forces extérieures appliquées au système {cabine + passagers} et les représenter sur un schéma.
2. Énoncer la deuxième loi de Newton et l'appliquer au système.
3. En déduire les caractéristiques du vecteur accélération du centre d'inertie pendant la montée.
4. La cabine, initialement au repos, démarre maintenant vers le bas avec les mêmes passagers.
   a) Quels sont la direction et le sens de l'accélération au démarrage ?
   b) Sans calcul, comparer la nouvelle tension $F'$ du câble au poids $P$ de l'ensemble.`,
    solution: R`1. Système de masse $M + m = 700$ kg : poids $\vec P$ (vertical, vers le bas, $P = 700 \times 9{,}8 = 6\,860$ N) et force du câble $\vec F$ (verticale, vers le haut).
2. Dans un référentiel galiléen, $\sum\vec F_{\text{ext}} = (M + m)\,\vec a_G$. Ici $\vec F + \vec P = (M + m)\vec a_G$.
3. Sur un axe vertical orienté vers le haut : $F - P = (M + m)a$, d'où $a = \dfrac{8\,500 - 6\,860}{700} \approx \mathbf{2{,}3}$ **m/s²** ; $\vec a_G$ est vertical, dirigé vers le haut (mouvement accéléré vers le haut).
4. a) Au démarrage vers le bas, la vitesse augmente vers le bas : $\vec a_G$ est vertical, **vers le bas**.
   b) $F' - P = (M + m)a'$ avec $a' < 0$ : $F' < P$ (le câble « retient » moins que le poids).`,
  },
  {
    title: `${EX}Skieur sur une piste inclinée (descente et remontée à la perche)`,
    difficulty: 3,
    statement: R`Un skieur de masse $m = 70$ kg évolue sur une piste rectiligne inclinée de $\alpha = 10°$ sur l'horizontale. On néglige les frottements de l'air, mais pas ceux de la neige ; $g = 9{,}8$ m/s².
1. Le skieur descend la piste d'un mouvement rectiligne uniforme.
   a) Faire le bilan des forces exercées sur {skieur + skis}.
   b) Appliquer le principe d'inertie et, par projection sur deux axes (parallèle et perpendiculaire à la piste), déterminer la composante normale de la réaction de la piste et la force de frottement.
2. Le skieur remonte la piste à vitesse constante, tiré par une perche faisant un angle $\beta = 30°$ avec la piste, vers le haut ; la tension de la perche vaut $T = 900$ N. Reprendre l'étude : calculer la réaction normale et la force de frottement.

> Énoncé adapté : dans le document d'origine, l'angle de la perche était donné par rapport à la verticale, ce qui conduisait à une réaction normale négative (le skieur décollerait).`,
    solution: R`1. a) Poids $\vec P$ ($P = 686$ N) et réaction de la piste $\vec R$, qu'on décompose en $\vec R_N$ (normale) et $\vec f$ (frottement, parallèle à la piste, vers le haut puisque le skieur descend).
   b) Mouvement rectiligne uniforme : $\vec P + \vec R_N + \vec f = \vec 0$.
   - Axe parallèle à la piste : $f = mg\sin\alpha = 686 \times 0{,}174 \approx \mathbf{119}$ **N**.
   - Axe perpendiculaire : $R_N = mg\cos\alpha = 686 \times 0{,}985 \approx \mathbf{676}$ **N**.
2. Forces : $\vec P$, $\vec R_N$, $\vec f$ (vers le bas de la pente, puisque le skieur monte) et $\vec T$.
   - Parallèlement à la piste (vers le haut) : $T\cos\beta - mg\sin\alpha - f = 0$, d'où $f = 900 \times 0{,}866 - 119 \approx \mathbf{660}$ **N**.
   - Perpendiculairement : $R_N + T\sin\beta - mg\cos\alpha = 0$, d'où $R_N = 676 - 450 \approx \mathbf{226}$ **N** (positive : le skieur reste en contact).`,
  },
  {
    title: `${EX}Solide lancé sur un plan incliné sans frottement`,
    difficulty: 2,
    statement: R`Un solide de masse $m$ est lancé vers le haut, suivant la ligne de plus grande pente d'un plan incliné d'un angle $\alpha = 20°$ sur l'horizontale, avec une vitesse $v_0 = 3$ m/s. Les frottements sont négligés. À $t = 0$, son centre d'inertie $G$ est en $O$ ; l'axe $(O ; \vec i)$ est orienté vers le haut du plan. $g = 9{,}8$ m/s².
1. a) Faire l'inventaire des forces et les représenter.
   b) Montrer que l'accélération de $G$ suivant $\vec i$ vaut $a = -g\sin\alpha$.
   c) Qualifier le mouvement.
2. a) Écrire l'équation différentielle vérifiée par l'abscisse $x(t)$, puis la loi horaire $x(t)$.
   b) Déterminer la date $t_1$ à laquelle le solide s'arrête et la distance $d$ parcourue sur le plan.
   c) Que se passe-t-il ensuite ?`,
    solution: R`1. a) Le poids $\vec P$ (vertical) et la réaction $\vec R$ du plan, perpendiculaire au plan (pas de frottement).
   b) $\vec P + \vec R = m\vec a$ ; sur $\vec i$ : $-mg\sin\alpha + 0 = ma$, d'où $a = -g\sin\alpha \approx -3{,}35$ m/s².
   c) Accélération constante, opposée à la vitesse : mouvement rectiligne **uniformément décéléré** (pendant la montée).
2. a) $\ddot x = -g\sin\alpha$, d'où $v(t) = -g\sin\alpha\,t + v_0$ et $x(t) = -\frac12 g\sin\alpha\,t^2 + v_0t$.
   b) $v(t_1) = 0 \iff t_1 = \dfrac{v_0}{g\sin\alpha} \approx \mathbf{0{,}90}$ **s** ; $d = x(t_1) = \dfrac{v_0^2}{2g\sin\alpha} \approx \mathbf{1{,}34}$ **m**.
   c) L'accélération reste la même : le solide redescend d'un mouvement uniformément accéléré et repasse en $O$ avec la vitesse $v_0$ (sans frottement, l'énergie mécanique se conserve).`,
  },
  {
    title: `${EX}Chute d’une bille dans un liquide : méthode d’Euler`,
    difficulty: 3,
    statement: R`Une bille de volume $V$ et de masse volumique $\rho$ est lâchée sans vitesse dans un liquide de masse volumique $\rho'$. Elle tombe verticalement ; le liquide exerce une poussée d'Archimède et une force de frottement $\vec f = -k\vec v$.
1. Montrer que l'équation différentielle du mouvement peut s'écrire $\dfrac{dv}{dt} = av + b$, et exprimer $a$ et $b$.
2. Rappeler le principe de la méthode d'Euler.
3. Avec $a = -9{,}0$ s⁻¹, $b = 10$ m/s² et un pas $\Delta t = 0{,}03$ s, un tableur donne :

| $t$ (s) | 0 | 0,03 | 0,06 | 0,09 | 0,12 | 0,15 | 0,18 | 0,21 | 0,24 | 0,27 |
|---|---|---|---|---|---|---|---|---|---|---|
| $v$ (m/s) | 0 | 0,30 | 0,52 | 0,68 | 0,80 | 0,88 | 0,94 | … | … | … |

   Calculer les trois dernières valeurs par la méthode d'Euler.
4. Déterminer la vitesse limite et le temps caractéristique du mouvement.`,
    solution: R`1. Forces : poids $\rho Vg$ (vers le bas), poussée d'Archimède $\rho'Vg$ (vers le haut), frottement $kv$ (vers le haut). Axe vertical vers le bas : $\rho V\dfrac{dv}{dt} = (\rho - \rho')Vg - kv$, soit $\dfrac{dv}{dt} = av + b$ avec $a = -\dfrac{k}{\rho V}$ et $b = g\left(1 - \dfrac{\rho'}{\rho}\right)$.
2. On remplace la dérivée par un taux d'accroissement sur un petit pas $\Delta t$ : $v(t + \Delta t) \approx v(t) + \left(av(t) + b\right)\Delta t$, et on itère à partir de la valeur initiale.
3. $v_{n+1} = v_n + (-9v_n + 10) \times 0{,}03 = 0{,}73\,v_n + 0{,}30$ : $v(0{,}21) \approx 0{,}99$ m/s ; $v(0{,}24) \approx 1{,}02$ m/s ; $v(0{,}27) \approx 1{,}05$ m/s.
4. En régime permanent $\frac{dv}{dt} = 0$ : $v_{\lim} = -\dfrac ba = \dfrac{10}{9} \approx \mathbf{1{,}1}$ **m/s**. Temps caractéristique : $\tau = -\dfrac1a \approx \mathbf{0{,}11}$ **s** (la tangente à l'origine coupe l'asymptote $v = v_{\lim}$ en $t = \tau$).`,
  },
]

const PESANTEUR = [
  {
    title: `${EX}Volcan sur Io : chute libre dans un champ de pesanteur faible`,
    difficulty: 1,
    statement: R`En 1979, grâce aux images de la sonde Voyager, on a découvert sur Io (un satellite de Jupiter) un volcan en éruption dont le panache de lave s'élevait à environ $h = 280$ km. À la surface d'Io, l'intensité de la pesanteur vaut $g = 1{,}8$ m/s² ; on la suppose constante jusqu'à cette altitude et on néglige toute atmosphère.
Déterminer :
1. la vitesse à laquelle les blocs de lave étaient projetés verticalement ;
2. la durée nécessaire pour atteindre la hauteur maximale.`,
    solution: R`Mouvement vertical uniformément décéléré ($a = -g$).
1. Au sommet la vitesse est nulle : $0 - v_0^2 = -2gh$, d'où $v_0 = \sqrt{2gh} = \sqrt{2 \times 1{,}8 \times 280\,000} \approx \mathbf{1{,}0\times10^3}$ **m/s** (environ 3 600 km/h).
2. $v = v_0 - gt = 0 \iff t = \dfrac{v_0}{g} \approx \dfrac{1\,004}{1{,}8} \approx \mathbf{560}$ **s**, soit un peu plus de 9 minutes.`,
  },
  {
    title: `${EX}Projectile dans le champ de pesanteur : vrai ou faux justifié`,
    difficulty: 2,
    statement: R`Un projectile de masse $m$ est lancé à $t = 0$ depuis l'origine $O$ d'un repère $(O, x, z)$, $Oz$ vertical vers le haut, avec une vitesse $\vec v_0$ faisant un angle $\alpha$ avec l'horizontale. Référentiel terrestre galiléen, champ de pesanteur uniforme, résistance de l'air négligée. Dire si chaque affirmation est vraie ou fausse, en justifiant.
1. Le vecteur accélération du centre d'inertie ne dépend pas des conditions initiales.
2. Le projeté du centre d'inertie sur l'axe vertical $Oz$ a un mouvement rectiligne uniforme.
3. La trajectoire est une parabole quelle que soit la valeur de $\alpha$.
4. Si le projectile est lancé horizontalement d'une hauteur $H$ avec la vitesse $v_0$, l'abscisse de son point de chute est $x = v_0\sqrt{\dfrac{2H}{g}}$.`,
    solution: R`1. **Vrai** : la seule force est le poids, donc $\vec a_G = \vec g$, indépendant de $\vec v_0$ et de la position initiale.
2. **Faux** : sur $Oz$, $a_z = -g \neq 0$ : le mouvement projeté est uniformément varié ; c'est le projeté sur $Ox$ qui est uniforme.
3. **Faux** : si $\alpha = 90°$ (tir vertical), $x(t) = 0$ et la trajectoire est un segment de droite vertical. La trajectoire n'est parabolique que si $\cos\alpha \neq 0$.
4. **Vrai** : $x = v_0t$ et $z = H - \frac12gt^2$ ; au sol $z = 0$ pour $t = \sqrt{\frac{2H}{g}}$, d'où $x = v_0\sqrt{\frac{2H}{g}}$.`,
  },
  {
    title: `${EX}Portée d’un canon : la « Grosse Bertha »`,
    difficulty: 2,
    statement: R`Le canon allemand surnommé « Grosse Bertha » (1918) avait une portée maximale d'environ $P = 120$ km. On étudie un obus lancé d'un point $O$ au niveau du sol avec une vitesse $\vec v_0$ faisant un angle $\alpha$ avec l'horizontale, dans un champ de pesanteur uniforme ($g = 9{,}8$ m/s²), en négligeant l'air.
1. Établir les équations horaires du mouvement.
2. En déduire l'équation de la trajectoire.
3. Exprimer la portée $P$ en fonction de $v_0$, $\alpha$ et $g$.
4. La portée est maximale pour $\alpha = 45°$. Calculer la vitesse théorique de l'obus à la sortie du fût.
5. En réalité, cette vitesse était de l'ordre de $1\,600$ m/s. Expliquer la différence.`,
    solution: R`1. $\vec a = \vec g$ : $x(t) = v_0\cos\alpha\,t$ et $z(t) = -\frac12gt^2 + v_0\sin\alpha\,t$.
2. $z = -\dfrac{g}{2v_0^2\cos^2\alpha}x^2 + x\tan\alpha$.
3. $z = 0$, $x \neq 0$ : $P = \dfrac{v_0^2\sin2\alpha}{g}$.
4. $\alpha = 45°$ : $P = \dfrac{v_0^2}{g}$, d'où $v_0 = \sqrt{gP} = \sqrt{9{,}8 \times 120\,000} \approx \mathbf{1{,}1\times10^3}$ **m/s**.
5. La résistance de l'air n'est pas négligeable à ces vitesses : elle freine fortement l'obus, et il faut une vitesse initiale bien plus grande pour atteindre la même portée (le modèle sans frottement est trop simple).`,
  },
  {
    title: `${EX}Balle de golf : flèche, portée et angles de tir`,
    difficulty: 2,
    statement: R`Dans un repère $(O ; \vec i, \vec j, \vec k)$, une balle de golf lancée en $O$ à $t = 0$ avec la vitesse $\vec v_0$ (angle $\alpha$ avec l'horizontale) a pour équations horaires :
$$x = v_0\cos\alpha\;t,\qquad y = 0,\qquad z = -\tfrac12gt^2 + v_0\sin\alpha\;t.$$
1. Préciser l'orientation des axes du repère.
2. Exprimer l'altitude maximale $h$ (la flèche) et la portée horizontale $d$.
3. Pour quelle valeur de $\alpha$ la portée est-elle maximale ?
4. Montrer qu'une même portée peut être atteinte avec deux angles de tir.`,
    solution: R`1. $Ox$ horizontal dans le plan du tir, $Oy$ horizontal perpendiculaire (le mouvement reste dans le plan $xOz$), $Oz$ vertical vers le haut.
2. Au sommet, $\dot z = 0 \iff t = \dfrac{v_0\sin\alpha}{g}$, d'où $h = \dfrac{v_0^2\sin^2\alpha}{2g}$. Au retour au sol ($z = 0$, $t = \frac{2v_0\sin\alpha}{g}$) : $d = \dfrac{v_0^2\sin2\alpha}{g}$.
3. $d$ est maximale quand $\sin2\alpha = 1$, soit $\alpha = 45°$.
4. $\sin2\alpha = \sin(\pi - 2\alpha) = \sin\left(2\left(\frac\pi2 - \alpha\right)\right)$ : les angles $\alpha$ et $\frac\pi2 - \alpha$ (complémentaires) donnent la même portée (tir tendu et tir en cloche).`,
  },
]

const RC = [
  {
    title: `${EX}Charge et décharge d’un condensateur à travers une résistance`,
    difficulty: 2,
    statement: R`Un condensateur initialement déchargé, de capacité $C = 4{,}7$ µF, est monté en série avec un conducteur ohmique de résistance $R = 1{,}0$ kΩ et un générateur de f.é.m. $E = 6{,}0$ V. Un interrupteur à deux positions permet de charger (position 1) puis de décharger (position 2, le générateur est retiré du circuit) le condensateur. $u$ est la tension aux bornes du condensateur.
1. À $t = 0$, l'interrupteur est placé en position 1. Que se passe-t-il pour le condensateur ?
2. Établir l'équation différentielle vérifiée par $u(t)$.
3. La solution est de la forme $u(t) = K\left(1 - e^{-\alpha t}\right)$. Exprimer $K$ et $\alpha$.
4. a) Exprimer et calculer la constante de temps $\tau$.
   b) Tracer l'allure de $u(t)$ et indiquer deux méthodes pour lire $\tau$.
   c) Au bout de quelle durée peut-on considérer la charge terminée ?
5. Le condensateur étant chargé, on bascule en position 2 et on prend une nouvelle origine des temps.
   a) Établir l'équation différentielle et déterminer $K$ et $\alpha$ dans $u(t) = Ke^{-\alpha t}$.
   b) Tracer l'allure de $u(t)$ et indiquer comment lire $\tau$.`,
    solution: R`1. Le condensateur se **charge** : ses armatures accumulent des charges opposées et $u$ croît de $0$ à $E$.
2. Loi des mailles : $E = Ri + u$ avec $i = C\dfrac{du}{dt}$, d'où $RC\dfrac{du}{dt} + u = E$.
3. En reportant : $RC\,K\alpha e^{-\alpha t} + K - Ke^{-\alpha t} = E$ pour tout $t$ : $K = E = 6{,}0$ V et $\alpha = \dfrac1{RC}$.
4. a) $\tau = RC = 1{,}0\times10^3 \times 4{,}7\times10^{-6} = \mathbf{4{,}7}$ **ms**.
   b) Courbe croissante tendant vers $E$. Méthodes : $u(\tau) = 0{,}63E \approx 3{,}8$ V ; ou la tangente à l'origine coupe l'asymptote $u = E$ à $t = \tau$.
   c) À $t = 5\tau \approx 24$ ms, $u \approx 0{,}99E$ : la charge est pratiquement terminée.
5. a) Sans générateur : $Ri + u = 0$, soit $RC\dfrac{du}{dt} + u = 0$ ; $K = E$ (à $t = 0$, $u = E$) et $\alpha = \dfrac1{RC}$ : $u = Ee^{-t/\tau}$.
   b) Courbe décroissante de $E$ vers $0$ ; $u(\tau) = 0{,}37E \approx 2{,}2$ V, ou la tangente à l'origine coupe l'axe des temps en $\tau$.`,
  },
]

const OSCILLATEURS = [
  {
    title: `${EX}Le pendule de Foucault`,
    difficulty: 1,
    statement: R`Le pendule de Foucault (1851) est constitué d'une sphère d'acier de 28 kg suspendue à un fil d'acier de 1,4 mm de diamètre et de 67 m de longueur, accroché à la coupole du Panthéon à Paris. Son plan d'oscillation tourne lentement par rapport au sol, ce qui met en évidence la rotation de la Terre. On prendra $g = 9{,}81$ m/s².
1. Pourquoi ce pendule peut-il être assimilé à un pendule simple ?
2. À quelle condition la loi d'isochronisme des petites oscillations est-elle applicable ?
3. Cette condition est-elle remplie si l'amplitude du déplacement horizontal de la sphère est de 10 m ?
4. Évaluer la période propre du pendule.`,
    solution: R`1. La masse du fil est négligeable devant celle de la sphère, et les dimensions de la sphère sont très petites devant la longueur du fil (67 m) : on peut la considérer comme un point matériel au bout d'un fil sans masse.
2. Les oscillations doivent être de **faible amplitude** (en pratique $\theta_m$ inférieur à une dizaine de degrés) : la période est alors indépendante de l'amplitude.
3. $\sin\theta_m = \dfrac{10}{67} \approx 0{,}15$, soit $\theta_m \approx 8{,}6°$ : la condition est remplie.
4. $T_0 = 2\pi\sqrt{\dfrac lg} = 2\pi\sqrt{\dfrac{67}{9{,}81}} \approx \mathbf{16{,}4}$ **s**.`,
  },
  {
    title: `${EX}Période d’un pendule simple : exploitation de mesures`,
    difficulty: 2,
    statement: R`Un pendule simple est formé d'une petite sphère de plomb ($m = 125$ g) suspendue à un fil dont on fait varier la longueur $\ell$. Pour chaque longueur, on mesure la durée $\Delta t$ de 20 petites oscillations :

| $\ell$ (cm) | 12,3 | 24,4 | 28,6 | 32,4 | 38,5 |
|---|---|---|---|---|---|
| $\Delta t$ (s) | 14,1 | 19,8 | 21,4 | 22,8 | 24,9 |

1. Calculer la période $T$ pour chaque longueur.
2. On cherche une relation de la forme $T = k\cdot\ell^a$. En calculant $T/\sqrt\ell$, montrer que $a = \frac12$ et déterminer $k$. Quel graphique ($T$ en fonction de $\frac1\ell$, de $\sqrt\ell$ ou de $\ell^2$) est le plus simple à exploiter ?
3. a) Donner l'expression théorique de $T$ en fonction de $\ell$ et $g$.
   b) Vérifier son homogénéité par une analyse dimensionnelle.
   c) En déduire la valeur théorique de $k$ ($g = 9{,}81$ m/s²) et conclure.`,
    solution: R`1. $T = \frac{\Delta t}{20}$ : 0,705 s ; 0,990 s ; 1,07 s ; 1,14 s ; 1,245 s.
2. $\sqrt\ell$ (m$^{1/2}$) : 0,351 ; 0,494 ; 0,535 ; 0,569 ; 0,620. Les rapports $T/\sqrt\ell$ valent tous environ $2{,}0$ : $T = 2{,}0\sqrt\ell$, d'où $a = \frac12$ et $k \approx 2{,}0$ s·m$^{-1/2}$. Le graphique $T = f(\sqrt\ell)$ est le plus simple : c'est une **droite passant par l'origine**.
3. a) $T = 2\pi\sqrt{\dfrac{\ell}{g}}$.
   b) $\left[\sqrt{\ell/g}\right] = \sqrt{\dfrac{\text{m}}{\text{m}\cdot\text{s}^{-2}}} = \text{s}$ : homogène à une durée.
   c) $k = \dfrac{2\pi}{\sqrt g} = \dfrac{2\pi}{3{,}13} \approx 2{,}01$ s·m$^{-1/2}$ : accord excellent avec l'expérience (la masse n'intervient pas).`,
  },
  {
    title: `${EX}Horloge à balancier et navigation en mer`,
    difficulty: 1,
    statement: R`1. Une horloge à balancier contient un pendule simple oscillant avec une faible amplitude (moins de 10°) ; ses oscillations sont entretenues par un système de poids et de poulies, et font avancer les aiguilles.
   a) Pourquoi faut-il entretenir les oscillations ?
   b) La masse du pendule a-t-elle une influence sur sa période ?
   c) Sur quel paramètre agir pour régler la période ?
2. Au XVIIIᵉ siècle, connaître l'heure exacte à bord d'un navire permettait de calculer la longitude. Pourquoi une horloge à balancier est-elle inadaptée sur un navire ?`,
    solution: R`1. a) À cause des frottements (air, axe), le pendule perd de l'énergie et ses oscillations s'amortissent : sans entretien, il s'arrêterait.
   b) Non : $T_0 = 2\pi\sqrt{\frac lg}$ ne dépend pas de la masse.
   c) Sur la **longueur** du pendule (allonger le pendule augmente la période).
2. Les mouvements du navire (roulis, tangage, accélérations) modifient le champ de pesanteur « apparent » et perturbent les oscillations : la période n'est plus constante et l'horloge dérive.`,
  },
]

const NUCLEAIRE = [
  {
    title: `${EX}Isotopes, eau lourde et équations de désintégration`,
    difficulty: 1,
    statement: R`1. On considère les noyaux $(Z, A)$ suivants : $(8, 16)$ ; $(16, 32)$ ; $(8, 18)$ ; $(4, 8)$ ; $(4, 9)$ ; $(8, 17)$.
   a) Combien d'éléments différents sont représentés ? Lesquels ?
   b) Quels noyaux sont isotopes ? Écrire leur symbole $^A_Z\text{X}$.
2. L'eau lourde a pour formule $\text{D}_2\text{O}$, où D est le deutérium $^2_1\text{H}$.
   a) Quelle est la différence entre un noyau de deutérium et un noyau d'hydrogène $^1_1\text{H}$ ?
   b) Justifier le terme « eau lourde ».
3. Compléter les équations suivantes en appliquant les lois de conservation :
   a) émission $\alpha$ : $^{210}_{84}\text{Po} \to \;^{\dots}_{\dots}\text{Pb} + \;^{\dots}_{\dots}\text{He}$ et $^{223}_{88}\text{Ra} \to \;^{\dots}_{\dots}\text{Rn} + \alpha$ ;
   b) émission $\beta^-$ : $^{32}_{15}\text{P} \to \;^{32}_{16}\text{S} + \dots$ ;
   c) émission $\beta^+$ : $^{12}_{7}\text{N} \to \;^{\dots}_{\dots}\text{C} + \dots$`,
    solution: R`1. a) Trois éléments : $Z = 8$ (oxygène), $Z = 16$ (soufre), $Z = 4$ (béryllium).
   b) Isotopes (même $Z$, $A$ différents) : $^{16}_8\text{O}$, $^{17}_8\text{O}$, $^{18}_8\text{O}$ d'une part ; $^{8}_4\text{Be}$ et $^{9}_4\text{Be}$ d'autre part.
2. a) Le deutérium a un neutron en plus (1 proton + 1 neutron) ; l'hydrogène ordinaire n'a qu'un proton.
   b) $M(\text{D}_2\text{O}) = 2 \times 2 + 16 = 20$ g/mol contre $18$ g/mol pour $\text{H}_2\text{O}$ : à volume égal, l'eau lourde est plus lourde (environ 11 % de plus).
3. a) $^{210}_{84}\text{Po} \to \;^{206}_{82}\text{Pb} + \;^4_2\text{He}$ ; $^{223}_{88}\text{Ra} \to \;^{219}_{86}\text{Rn} + \;^4_2\text{He}$.
   b) $^{32}_{15}\text{P} \to \;^{32}_{16}\text{S} + \;^{0}_{-1}e$.
   c) $^{12}_{7}\text{N} \to \;^{12}_{6}\text{C} + \;^{0}_{1}e$.`,
  },
  {
    title: `${EX}Énergie de liaison : oxygène 16 et hélium 4`,
    difficulty: 2,
    statement: R`Données : $m_p = 1{,}00728$ u ; $m_n = 1{,}00866$ u ; $1$ u $= 931{,}5$ MeV/$c^2$.
1. La masse du noyau d'oxygène $^{16}_8\text{O}$ est $15{,}995$ u. Calculer son énergie de liaison par nucléon.
2. Même question pour le noyau d'hélium $^4_2\text{He}$, de masse $4{,}0026$ u.
3. Lequel des deux noyaux est le plus stable ? Situer chacun sur la courbe d'Aston.`,
    solution: R`1. Défaut de masse : $\Delta m = 8m_p + 8m_n - m = 16{,}1275 - 15{,}995 = 0{,}1325$ u, soit $E_\ell = 0{,}1325 \times 931{,}5 \approx 123{,}4$ MeV et $\dfrac{E_\ell}{A} \approx \mathbf{7{,}7}$ **MeV/nucléon**.
2. $\Delta m = 2m_p + 2m_n - m = 4{,}0319 - 4{,}0026 = 0{,}0293$ u, soit $E_\ell \approx 27{,}3$ MeV et $\dfrac{E_\ell}{A} \approx \mathbf{6{,}8}$ **MeV/nucléon**.
3. Le noyau le plus stable est celui dont l'énergie de liaison par nucléon est la plus grande : **l'oxygène 16**. Sur la courbe d'Aston ($-\frac{E_\ell}{A}$ en fonction de $A$), il est plus bas que l'hélium, mais au-dessus du minimum situé vers le fer ($A \approx 56$, environ 8,8 MeV/nucléon).`,
  },
  {
    title: `${EX}Fission de l’uranium 235 calculée par les énergies de liaison`,
    difficulty: 2,
    statement: R`On considère la réaction de fission $^1_0n + \;^{235}_{92}\text{U} \to \;^{94}_{38}\text{Sr} + \;^{140}_{54}\text{Xe} + 2\,^1_0n$.
1. Exprimer l'énergie libérée en fonction des énergies de liaison par nucléon des noyaux.
2. La calculer, sachant que l'énergie de liaison par nucléon vaut $8{,}50$ MeV pour Sr et Xe, et $7{,}6$ MeV pour U.`,
    solution: R`1. Les neutrons libres n'ont pas d'énergie de liaison. L'énergie libérée est la différence entre l'énergie de liaison des produits et celle du noyau initial :
$$E = 94\,\frac{E_\ell}{A}(\text{Sr}) + 140\,\frac{E_\ell}{A}(\text{Xe}) - 235\,\frac{E_\ell}{A}(\text{U}).$$
2. $E = (94 + 140) \times 8{,}50 - 235 \times 7{,}6 = 1\,989 - 1\,786 \approx \mathbf{2{,}0\times10^2}$ **MeV** par noyau d'uranium.`,
  },
  {
    title: `${EX}La perte de masse du Soleil`,
    difficulty: 2,
    statement: R`La fusion de l'hydrogène dans le Soleil produit des noyaux d'hélium ; chaque réaction libère $24$ MeV. Données : $c = 3{,}0\times10^8$ m/s ; $1$ MeV $= 1{,}6\times10^{-13}$ J.
1. Calculer la perte de masse correspondant à une réaction.
2. Toute l'énergie produite est rayonnée ; la puissance rayonnée vaut $3{,}9\times10^{26}$ W. Calculer la perte de masse du Soleil par seconde.
3. La masse du Soleil est d'environ $1{,}99\times10^{30}$ kg et son âge de $4{,}6$ milliards d'années. Quelle masse a-t-il perdue depuis qu'il rayonne (à puissance constante) ? Quel pourcentage de sa masse cela représente-t-il ?`,
    solution: R`1. $\Delta m = \dfrac{E}{c^2} = \dfrac{24 \times 1{,}6\times10^{-13}}{9\times10^{16}} \approx \mathbf{4{,}3\times10^{-29}}$ **kg**.
2. $\dfrac{\Delta m}{\Delta t} = \dfrac{P}{c^2} = \dfrac{3{,}9\times10^{26}}{9\times10^{16}} \approx \mathbf{4{,}3\times10^{9}}$ **kg/s** (plus de 4 millions de tonnes par seconde).
3. Durée : $4{,}6\times10^9 \times 3{,}16\times10^7 \approx 1{,}45\times10^{17}$ s ; masse perdue $\approx 4{,}3\times10^9 \times 1{,}45\times10^{17} \approx \mathbf{6{,}3\times10^{26}}$ **kg**, soit $\dfrac{6{,}3\times10^{26}}{1{,}99\times10^{30}} \approx 3\times10^{-4}$ : environ **0,03 %** de sa masse.`,
  },
  {
    title: `${EX}Iode 131 ou césium 137 : lequel est le plus dangereux ?`,
    difficulty: 2,
    statement: R`Deux échantillons contiennent initialement le même nombre $N_0$ de noyaux : de l'iode 131 (demi-vie $8{,}0$ jours) et du césium 137 (demi-vie $30$ ans).
1. Définir la demi-vie radioactive.
2. Exprimer, en fonction de $N_0$, le nombre de noyaux restants dans chaque échantillon aux dates $t = 8$ jours, 1 an, 30 ans et 300 ans.
3. Lors d'un accident nucléaire, ces deux noyaux peuvent être rejetés dans l'atmosphère. Lequel est, à terme, le plus dangereux ?
4. Quel doit être le rapport des nombres de noyaux pour que les deux échantillons aient la même activité ?`,
    solution: R`1. La demi-vie $t_{1/2}$ est la durée au bout de laquelle la moitié des noyaux radioactifs initialement présents se sont désintégrés.
2. $N = N_0\,2^{-t/t_{1/2}}$.
   - Iode 131 : $\frac{N_0}2$ à 8 jours ; à 1 an ($\approx 45{,}6$ demi-vies), $N \approx 2\times10^{-14}N_0$ : pratiquement plus rien, et a fortiori à 30 et 300 ans.
   - Césium 137 : $\approx 0{,}9995\,N_0$ à 8 jours ; $\approx 0{,}977\,N_0$ à 1 an ; $\frac{N_0}2$ à 30 ans ; $\frac{N_0}{2^{10}} \approx 10^{-3}N_0$ à 300 ans.
3. L'iode disparaît en quelques semaines (très actif mais pendant peu de temps) ; le césium contamine l'environnement pendant des siècles : **à terme, le césium 137 est le plus dangereux**.
4. $A = \lambda N$ et $\lambda = \frac{\ln2}{t_{1/2}}$. Activités égales $\iff \dfrac{N_{\text{Cs}}}{N_{\text{I}}} = \dfrac{\lambda_{\text{I}}}{\lambda_{\text{Cs}}} = \dfrac{t_{1/2}(\text{Cs})}{t_{1/2}(\text{I})} = \dfrac{30 \times 365}{8} \approx \mathbf{1{,}4\times10^3}$.`,
  },
  {
    title: `${EX}Datation au carbone 14`,
    difficulty: 2,
    statement: R`Dans la haute atmosphère, des neutrons produits par les rayons cosmiques sont absorbés par des noyaux d'azote $^{14}_7\text{N}$ ; la réaction donne du carbone 14 et une autre particule. Le carbone 14, radioactif $\beta^-$ (demi-vie $5\,570$ ans), est assimilé par les plantes comme le carbone 12 : sa proportion reste constante tant qu'elles vivent, puis décroît après leur mort.
1. Donner la composition des noyaux $^{12}_6\text{C}$ et $^{14}_6\text{C}$. Comment appelle-t-on de tels noyaux ?
2. Écrire l'équation de formation du carbone 14 ; quelle est la particule produite ?
3. Écrire l'équation de la désintégration $\beta^-$ du carbone 14.
4. Dans du bois vivant, on compte un atome de carbone 14 pour $10^{12}$ atomes de carbone 12. Quel est l'âge d'un bois mort où cette proportion est d'un pour $8\times10^{12}$ ?`,
    solution: R`1. $^{12}_6\text{C}$ : 6 protons et 6 neutrons ; $^{14}_6\text{C}$ : 6 protons et 8 neutrons. Ce sont des **isotopes**.
2. Conservation du nombre de masse et du nombre de charge : $^{14}_7\text{N} + \;^1_0n \to \;^{14}_6\text{C} + \;^1_1\text{H}$ : la particule est un **proton**.
3. $^{14}_6\text{C} \to \;^{14}_7\text{N} + \;^{0}_{-1}e$ (accompagné d'un antineutrino).
4. La proportion a été divisée par $8 = 2^3$ : trois demi-vies se sont écoulées, soit $t = 3 \times 5\,570 = \mathbf{16\,710}$ **ans**.`,
  },
  {
    title: `${EX}Âge des roches lunaires par la méthode potassium-argon`,
    difficulty: 3,
    statement: R`Le potassium $^{40}_{19}\text{K}$ est radioactif et se désintègre en argon $^{40}_{18}\text{Ar}$, gaz retenu dans les roches. Sa demi-vie est $t_{1/2} = 1{,}5\times10^9$ ans.
1. Écrire l'équation de la désintégration. De quel type est-elle ?
2. Calculer la constante radioactive $\lambda$.
3. Un échantillon de 1 g de roche rapportée par la mission Apollo XI contient $8{,}2\times10^{-6}$ cm³ d'argon 40 et $1{,}66\times10^{-6}$ cm³ de potassium 40 (volumes ramenés aux conditions normales, $V_m = 22{,}4$ L/mol). En supposant que tout l'argon provient de la désintégration du potassium, déterminer l'âge de la roche.

> Donnée adaptée : le document d'origine indiquait un volume d'argon qui conduisait à un âge supérieur à celui de l'Univers.`,
    solution: R`1. $^{40}_{19}\text{K} \to \;^{40}_{18}\text{Ar} + \;^{0}_{1}e$ : désintégration $\beta^+$.
2. $\lambda = \dfrac{\ln2}{t_{1/2}} = \dfrac{0{,}693}{1{,}5\times10^9} \approx \mathbf{4{,}6\times10^{-10}}$ **an⁻¹**.
3. Les volumes molaires étant égaux, le rapport des volumes est le rapport des nombres de noyaux : $\dfrac{N_{\text{Ar}}}{N_{\text{K}}} = \dfrac{8{,}2}{1{,}66} \approx 4{,}94$. Avec $N_{\text{K},0} = N_{\text{K}} + N_{\text{Ar}}$ et $N_{\text{K}} = N_{\text{K},0}e^{-\lambda t}$ :
$$t = \frac1\lambda\ln\left(1 + \frac{N_{\text{Ar}}}{N_{\text{K}}}\right) = \frac{\ln(5{,}94)}{4{,}6\times10^{-10}} \approx \mathbf{3{,}9\times10^9}\text{ ans}.$$`,
  },
  {
    title: `${EX}Désintégration du césium 137 et rayonnement gamma`,
    difficulty: 2,
    statement: R`L'accident de Tchernobyl (1986) a dispersé dans l'atmosphère du césium 137, émetteur $\beta^-$. Données : $^{132}_{54}\text{Xe}$ ; $^{137}_{56}\text{Ba}$ ; $^{137}_{55}\text{Cs}$ ; $^{135}_{52}\text{Te}$ ; $h = 6{,}62\times10^{-34}$ J·s ; $c = 3\times10^8$ m/s ; $1$ eV $= 1{,}6\times10^{-19}$ J.
1. Écrire l'équation de la désintégration.
2. Le noyau fils est souvent obtenu dans un état excité, situé $662$ keV au-dessus de son état fondamental. Quel phénomène accompagne son retour à l'état fondamental ?
3. Calculer la longueur d'onde du rayonnement émis. À quel domaine appartient-il ?`,
    solution: R`1. $^{137}_{55}\text{Cs} \to \;^{137}_{56}\text{Ba} + \;^{0}_{-1}e$ (le noyau fils a $Z = 56$ : c'est le baryum).
2. La désexcitation du noyau s'accompagne de l'émission d'un photon : le **rayonnement $\gamma$**.
3. $\lambda = \dfrac{hc}{E} = \dfrac{6{,}62\times10^{-34} \times 3\times10^8}{662\times10^3 \times 1{,}6\times10^{-19}} \approx \mathbf{1{,}9\times10^{-12}}$ **m** : domaine des **rayons $\gamma$** (bien au-delà des rayons X).`,
  },
]

const SPECTRES = [
  {
    title: `${EX}Énergie d’un photon et transitions de l’atome de mercure`,
    difficulty: 1,
    statement: R`Données : $h = 6{,}62\times10^{-34}$ J·s ; $c = 3\times10^8$ m/s ; $1$ eV $= 1{,}6\times10^{-19}$ J.
1. Calculer, en joules puis en eV, l'énergie d'un photon de longueur d'onde $\lambda = 0{,}55$ µm.
2. Un atome de mercure passe du niveau $E_1 = -4{,}99$ eV au niveau fondamental $E_0 = -10{,}45$ eV.
   a) Calculer la longueur d'onde de la radiation associée.
   b) S'agit-il d'une émission ou d'une absorption ?
   c) Cette radiation est-elle visible ?
3. La couronne solaire émet une raie intense de longueur d'onde $587{,}6$ nm due à l'hélium ; le spectre de la lumière solaire présente une raie sombre à la même longueur d'onde.
   a) Expliquer pourquoi la même raie apparaît en émission et en absorption.
   b) Calculer le quantum d'énergie associé.`,
    solution: R`1. $E = \dfrac{hc}{\lambda} = \dfrac{1{,}986\times10^{-25}}{0{,}55\times10^{-6}} \approx \mathbf{3{,}6\times10^{-19}}$ **J** $\approx \mathbf{2{,}3}$ **eV**.
2. a) $\Delta E = E_1 - E_0 = 5{,}46$ eV $\approx 8{,}74\times10^{-19}$ J, d'où $\lambda = \dfrac{hc}{\Delta E} \approx \mathbf{227}$ **nm**.
   b) L'atome passe à un niveau inférieur : il perd de l'énergie, c'est une **émission**.
   c) Non : $227$ nm $< 400$ nm, c'est un rayonnement **ultraviolet**.
3. a) Un atome ne peut absorber que les photons dont l'énergie correspond exactement à l'écart entre deux de ses niveaux, c'est-à-dire ceux qu'il peut émettre : les raies d'absorption et d'émission d'un élément ont les mêmes longueurs d'onde.
   b) $E = \dfrac{1{,}986\times10^{-25}}{587{,}6\times10^{-9}} \approx 3{,}4\times10^{-19}$ J $\approx \mathbf{2{,}1}$ **eV**.`,
  },
  {
    title: `${EX}Niveaux d’énergie de l’atome de mercure : excitation par un électron ou un photon`,
    difficulty: 2,
    statement: R`Quelques niveaux d'énergie de l'atome de mercure : $E_3 = -2{,}72$ eV ; $E_2 = -3{,}75$ eV ; $E_1 = -4{,}99$ eV ; $E_0 = -10{,}45$ eV (niveau fondamental). Données : $h = 6{,}62\times10^{-34}$ J·s ; $c = 3\times10^8$ m/s ; $1$ eV $= 1{,}6\times10^{-19}$ J.
1. Un électron d'énergie cinétique $6{,}0$ eV peut-il porter un atome de mercure, pris à l'état fondamental, dans un état excité ? Lequel ?
2. Quelle est la longueur d'onde du rayonnement émis lors de la transition du niveau 3 au niveau 1 ?
3. Une radiation dont le quantum vaut $5{,}46$ eV peut-elle interagir avec un atome de mercure à l'état fondamental ? Même question pour un quantum de $6{,}0$ eV.`,
    solution: R`1. Oui : un électron peut céder **une partie** de son énergie. $E_1 - E_0 = 5{,}46$ eV $< 6{,}0$ eV : l'atome peut passer au niveau 1 (l'électron repart avec $0{,}54$ eV). Le niveau 2 demande $6{,}70$ eV : impossible.
2. $E_3 - E_1 = 2{,}27$ eV $\approx 3{,}63\times10^{-19}$ J : $\lambda = \dfrac{hc}{\Delta E} \approx \mathbf{547}$ **nm** (vert, visible).
3. Un photon est absorbé seulement si son énergie correspond **exactement** à une transition (ou dépasse l'énergie d'ionisation, $10{,}45$ eV). $5{,}46$ eV $= E_1 - E_0$ : **absorbé** (passage au niveau 1). $6{,}0$ eV ne correspond à aucune transition et reste inférieur à $10{,}45$ eV : **pas d'interaction**.`,
  },
  {
    title: `${EX}Raies visibles de l’hydrogène et série de Balmer`,
    difficulty: 2,
    statement: R`Le spectre d'émission de l'hydrogène dans le visible comporte quatre raies : 410 nm, 434 nm, 486 nm et 656 nm. Les niveaux d'énergie sont $E_n = -\dfrac{13{,}6}{n^2}$ (eV). Données : $h = 6{,}62\times10^{-34}$ J·s ; $c = 3\times10^8$ m/s ; $1$ eV $= 1{,}6\times10^{-19}$ J.
1. Pourquoi ce spectre est-il un spectre de raies ?
2. Calculer, en eV, le quantum d'énergie de chaque raie.
3. Ces raies correspondent aux transitions des niveaux supérieurs vers le niveau $n = 2$ ($E_2 = -3{,}40$ eV) : c'est la série de Balmer. Retrouver les niveaux de départ et leurs énergies.
4. Entre quelles valeurs extrêmes les longueurs d'onde de la série de Balmer sont-elles comprises ?
5. Quelle est l'énergie d'ionisation de l'atome d'hydrogène ?`,
    solution: R`1. Les niveaux d'énergie de l'atome sont **quantifiés** : il ne peut émettre que des photons d'énergies bien précises, correspondant aux écarts entre niveaux, d'où des raies isolées.
2. $E = \dfrac{hc}{\lambda}$ : 656 nm → 1,89 eV ; 486 nm → 2,55 eV ; 434 nm → 2,86 eV ; 410 nm → 3,03 eV.
3. Niveau de départ : $E_n = E_2 + E$ : $-1{,}51$ eV ($n = 3$, raie $H_\alpha$ à 656 nm) ; $-0{,}85$ eV ($n = 4$, 486 nm) ; $-0{,}54$ eV ($n = 5$, 434 nm) ; $-0{,}37$ eV ($n = 6$, 410 nm).
4. La plus grande longueur d'onde correspond à la plus petite énergie ($3 \to 2$) : 656 nm. La plus petite correspond à $n \to \infty$ : $E = 3{,}40$ eV, soit $\lambda \approx 365$ nm. La série est comprise entre **365 nm et 656 nm**.
5. $E_i = E_\infty - E_1 = 13{,}6$ eV.`,
  },
]

const PH = (chapterTitle, exercises) => ({ subject: 'Physique', levels: ['bac_c', 'bac_d'], chapterTitle, orderStart: 100, exercises })
const CH = (chapterTitle, exercises) => ({ subject: 'CHIMIE', levels: ['bac_c'], chapterTitle, orderStart: 100, exercises, syncCopies: true })

export const BLOCS = [
  PH('Relation fondamentale de la dynamique (RFD)', RFD),
  PH('Champ de pesanteur et champ gravitationnel', PESANTEUR),
  PH('Dipôle (R,C)', RC),
  PH('Oscillateurs mécaniques', OSCILLATEURS),
  CH('Chapitre 3: PROPRIÉTÉS DES RÉACTIONS NUCLÉAIRES ', NUCLEAIRE),
  CH('Chapitre 2: Le SEPECTRE DE L\'ATOME D\'HYDROGÈNE ', SPECTRES),
]
