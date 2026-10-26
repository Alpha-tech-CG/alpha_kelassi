// Annales du bac — PHYSIQUE-CHIMIE série C (Congo), sessions 2018 et 2019.
// Source : corrigés seuls (PDF fournis le 26/10/2026) : énoncés reconstitués d'après le
// corrigé, et signalés comme tels. Partie chimie → « CHIMIE », physique → « Physique ».
const R = String.raw

const RECONSTITUE = R`> ⚠️ Énoncé reconstitué d'après le corrigé (le sujet original n'était pas fourni) : les données et les questions sont celles du bac, la formulation et les choix proposés peuvent différer.`

const CHIMIE = [
  {
    title: 'Bac C 2019 — Chimie : constantes (Ka, demi-vie, K, Rydberg), amines, acide monochloroéthanoïque',
    statement: R`**Baccalauréat 2019 — Série C — Physique-Chimie, partie CHIMIE (8 points)**

${RECONSTITUE}

### Partie A : vérification des connaissances
1. **Appariement** — donne l'expression ou la relation correspondant à chaque grandeur :
   1) la constante d'acidité $K_a$ d'un couple $\text{AH}/\text{A}^-$ ;
   2) la relation entre la constante radioactive $\lambda$ et la demi-vie $T$ ;
   3) la constante d'équilibre $K$ de la réaction $\alpha\text{A} + \beta\text{B} \rightleftharpoons \gamma\text{C} + \delta\text{D}$ ;
   4) la constante de Rydberg $R_H$ de l'atome d'hydrogène, en fonction de $E_0$, $h$ et $c$.
2. **Schéma à compléter.** $(\text{C}_2\text{H}_5)_2\text{NH} + \text{H}_2\text{O} \rightleftharpoons \;\ldots + \;\ldots$
3. **Choix multiples.**
   3.1. Pour un mélange équimolaire acide-alcool secondaire, le rendement d'estérification vaut : 5 % ; 60 % ; 67 %.
   3.2. La plus grande longueur d'onde émise par l'atome d'hydrogène appartient à la série de : Lyman ; Balmer ; Paschen.

### Partie B : application des connaissances
On dispose d'une solution d'acide monochloroéthanoïque $\text{CH}_2\text{ClCOOH}$ de concentration $C_A = 5\times10^{-2}$ mol/L, dont le pH vaut $2{,}1$.
1. Montrer que cet acide est faible.
2. Écrire l'équation de sa réaction avec l'eau.
3. a) Faire l'inventaire des espèces présentes et calculer leurs concentrations.
   b) En déduire le $pK_a$ du couple $\text{CH}_2\text{ClCOOH}/\text{CH}_2\text{ClCOO}^-$.
4. On dose $V_A = 20$ mL de cette solution par une solution d'hydroxyde de sodium de concentration $C_B = 0{,}1$ mol/L. Écrire l'équation du dosage et calculer le volume de soude à verser pour que le pH soit égal au $pK_a$.`,
    solution: R`### Partie A
1. 1) $K_a = \dfrac{[\text{A}^-][\text{H}_3\text{O}^+]}{[\text{AH}]}$ ; 2) $\lambda = \dfrac{\ln 2}{T}$ (car $N(t + T) = \frac{N(t)}{2}$ avec $N = N_0e^{-\lambda t}$) ; 3) $K = \dfrac{[\text{C}]_{éq}^\gamma[\text{D}]_{éq}^\delta}{[\text{A}]_{éq}^\alpha[\text{B}]_{éq}^\beta}$ ; 4) $\dfrac{hc}{\lambda} = E_0\left(\dfrac1{p^2} - \dfrac1{n^2}\right)$ donne $R_H = \dfrac{E_0}{hc}$.
2. $(\text{C}_2\text{H}_5)_2\text{NH} + \text{H}_2\text{O} \rightleftharpoons (\text{C}_2\text{H}_5)_2\text{NH}_2^+ + \text{OH}^-$ : le doublet non liant de l'azote capte un proton (caractère basique des amines).
3. 3.1 : **60 %** (67 % pour un alcool primaire, 5 % pour un tertiaire). 3.2 : **Paschen** : $\lambda = \dfrac{hc}{E_n - E_p}$ est maximale pour le plus petit écart d'énergie, $E_4 - E_3$, transition qui aboutit au niveau 3.

### Partie B
1. $-\log C_A = 1{,}3 < 2{,}1$ : $[\text{H}_3\text{O}^+] < C_A$, l'acide n'est pas totalement dissocié : il est **faible**.
2. $\text{CH}_2\text{ClCOOH} + \text{H}_2\text{O} \rightleftharpoons \text{CH}_2\text{ClCOO}^- + \text{H}_3\text{O}^+$.
3. a) Espèces : $\text{H}_2\text{O}$, $\text{CH}_2\text{ClCOOH}$, $\text{CH}_2\text{ClCOO}^-$, $\text{H}_3\text{O}^+$, $\text{OH}^-$.
   - $[\text{H}_3\text{O}^+] = 10^{-2{,}1} \approx 7{,}94\times10^{-3}$ mol/L ; $[\text{OH}^-] = \dfrac{10^{-14}}{7{,}94\times10^{-3}} \approx 1{,}26\times10^{-12}$ mol/L.
   - Électroneutralité : $[\text{CH}_2\text{ClCOO}^-] \approx [\text{H}_3\text{O}^+] \approx 7{,}94\times10^{-3}$ mol/L.
   - Conservation : $[\text{CH}_2\text{ClCOOH}] = 5\times10^{-2} - 7{,}94\times10^{-3} \approx 4{,}21\times10^{-2}$ mol/L.
   b) $pK_a = pH - \log\dfrac{[\text{CH}_2\text{ClCOO}^-]}{[\text{CH}_2\text{ClCOOH}]} = 2{,}1 - \log\dfrac{7{,}94\times10^{-3}}{4{,}21\times10^{-2}} \approx \mathbf{2{,}8}$.
4. $\text{CH}_2\text{ClCOOH} + \text{OH}^- \to \text{CH}_2\text{ClCOO}^- + \text{H}_2\text{O}$. $pH = pK_a$ à la **demi-équivalence**. Équivalence : $V_{BE} = \dfrac{C_AV_A}{C_B} = \dfrac{5\times10^{-2} \times 20}{0{,}1} = 10$ mL, donc $V_B = \mathbf{5}$ **mL**.`,
  },
  {
    title: 'Bac C 2018 — Chimie : vrai-faux (oxydoréduction, estérification, cinétique), dosage de l’eau oxygénée',
    statement: R`**Baccalauréat 2018 — Série C — Physique-Chimie, partie CHIMIE (8 points)**

${RECONSTITUE}

### Partie A : vérification des connaissances
1. **Vrai ou faux.**
   a) Une oxydation est une perte d'électrons et une réduction un gain d'électrons.
   b) Une solution électrolytique contient des ions et conduit le courant électrique.
   c) Le rendement de l'hydrolyse d'un ester d'alcool secondaire est de 60 %.
   d) Pour une réaction d'ordre 1, le temps de demi-réaction est $t_{1/2} = \dfrac{\ln 2}{k[\text{A}]_0}$.
2. **Texte à trous.** « L'ensemble des radiations émises lors des transitions aboutissant au même niveau d'énergie constitue une ……… »
3. **Question à réponse courte.** Donne la relation qui lie le pH d'une solution au $pK_a$ du couple acide/base présent.

### Partie B : application des connaissances
1. On dissout $19{,}75$ g de permanganate de potassium $\text{KMnO}_4$ dans de l'eau pour obtenir $250$ mL de solution. Calcule sa concentration $C_1$.
2. On dose $V_2 = 10$ mL d'une solution d'eau oxygénée $\text{H}_2\text{O}_2$ en milieu acide par cette solution de permanganate. L'équivalence est obtenue pour $V_1 = 8$ mL.
   a) Écris les demi-équations des couples $\text{O}_2/\text{H}_2\text{O}_2$ et $\text{MnO}_4^-/\text{Mn}^{2+}$ en milieu acide.
   b) Écris l'équation bilan de la réaction de dosage.
   c) Calcule la concentration $C_2$ de l'eau oxygénée.

*Données :* $K = 39$ ; $Mn = 55$ ; $O = 16$ (g/mol).`,
    solution: R`### Partie A
1. a) **Vrai** : le réducteur cède des électrons (il est oxydé), l'oxydant en capte (il est réduit).
   b) **Vrai** : ce sont les ions (cations et anions) qui assurent la conduction.
   c) **Faux** : pour un alcool secondaire, l'hydrolyse donne 40 % d'alcool (l'estérification, 60 % d'ester).
   d) **Faux** : $t_{1/2} = \dfrac{\ln 2}{k}$ (avec la convention $v = -\frac1a\frac{d[\text{A}]}{dt}$, $t_{1/2} = \frac{\ln 2}{ak}$) : pour l'ordre 1, il ne dépend pas de $[\text{A}]_0$.
2. « … constitue une **série de raies**. »
3. $pH = pK_a + \log\dfrac{[\text{base}]}{[\text{acide}]}$ (obtenue en prenant $-\log$ de $K_a = \dfrac{[\text{A}^-][\text{H}_3\text{O}^+]}{[\text{AH}]}$).

### Partie B
1. $M(\text{KMnO}_4) = 158$ g/mol : $C_1 = \dfrac{19{,}75}{158 \times 0{,}250} = \mathbf{0{,}5}$ **mol/L**.
2. a) $\text{H}_2\text{O}_2 + 2\,\text{H}_2\text{O} \rightleftharpoons \text{O}_2 + 2\,\text{H}_3\text{O}^+ + 2e^-$ ;
   $\text{MnO}_4^- + 8\,\text{H}_3\text{O}^+ + 5e^- \rightleftharpoons \text{Mn}^{2+} + 12\,\text{H}_2\text{O}$.
   b) (×5 et ×2) : $2\,\text{MnO}_4^- + 5\,\text{H}_2\text{O}_2 + 6\,\text{H}_3\text{O}^+ \longrightarrow 2\,\text{Mn}^{2+} + 5\,\text{O}_2 + 14\,\text{H}_2\text{O}$.
   c) À l'équivalence : $\dfrac{n(\text{MnO}_4^-)}{2} = \dfrac{n(\text{H}_2\text{O}_2)}{5}$, soit $5C_1V_1 = 2C_2V_2$ :
   $C_2 = \dfrac{5 \times 0{,}5 \times 8}{2 \times 10} = \mathbf{1}$ **mol/L**.`,
  },
]

const PHYSIQUE = [
  {
    title: 'Bac C 2019 — Physique : vrai-faux, propagation d’une onde, solide sur une piste circulaire puis horizontale',
    statement: R`**Baccalauréat 2019 — Série C — Physique-Chimie, partie PHYSIQUE (12 points)**

${RECONSTITUE} Les deux courbes de la partie B n'étant pas reproduites dans le corrigé, leurs lectures utiles sont données dans l'énoncé.

### Partie A : vérification des connaissances
1. **Vrai ou faux.**
   a) Pour un pendule conique (fil de longueur $l$, vitesse angulaire $\omega$, angle $\theta$ avec la verticale), $\cos\theta = \dfrac{g}{l\omega^2}$.
   b) L'effet photoélectrique est l'émission d'électrons par un métal qui reçoit de l'énergie rayonnante.
   c) Dans un mouvement circulaire uniforme de rayon $R$ et de vitesse angulaire $\omega$, l'accélération est normale et vaut $R\omega^2$.
   d) À la résonance d'intensité, l'impédance d'un circuit RLC série est maximale.
2. **Question à réponse courte.** Quand dit-on qu'un ébranlement est transversal ?

### Partie B : application des connaissances
Une source O, animée d'un mouvement vibratoire sinusoïdal transversal, émet une onde le long d'une corde.
- La courbe 1 (élongation de O en fonction du temps) montre une sinusoïde d'amplitude $0{,}2$ mm et de période $T = 2\times10^{-3}$ s ; à $t = 0$, $y_O = 0$ et croît.
- La courbe 2 (aspect de la corde à l'instant $t_1$) montre que l'onde s'est propagée sur une distance $d_1 = \dfrac64\lambda$.
1. Exprimer la célérité $v$ de l'onde en fonction de la longueur d'onde $\lambda$.
2. Écrire l'équation horaire du mouvement de la source O.
3. Écrire l'équation horaire du mouvement d'un point M situé à la distance $d = 12{,}5$ (même unité que $\lambda$) de O.
4. Déterminer l'instant $t_1$.

### Partie C : résolution d'un problème
Un solide de masse $m = 60$ kg, assimilé à un point, part sans vitesse du point A d'une piste formée d'un arc de cercle AB de centre O, de rayon $r = 5$ m, d'angle $\theta = \dfrac\pi4$ (B est le point le plus bas, à la verticale de O), suivi d'une partie horizontale BC de longueur $2r$. Sur tout le trajet, les frottements équivalent à une force $\vec f$ de norme constante, opposée au mouvement. On prend $g = 10$ m/s².
1. a) Exprimer la vitesse $v_B$ en B en fonction de $g$, $r$, $\theta$, $f$ et $m$.
   b) Exprimer la vitesse $v_C$ en C.
2. Le solide s'arrête en C.
   a) Exprimer $f$ en fonction de $m$, $g$ et $\theta$.
   b) Calculer $f$.
   c) Calculer $v_B$.`,
    solution: R`### Partie A
1. a) **Vrai** : $T\sin\theta = ml\omega^2\sin\theta$ et $T\cos\theta = mg$ donnent $\cos\theta = \dfrac{g}{l\omega^2}$.
   b) **Vrai**. c) **Vrai** (accélération tangentielle nulle).
   d) **Faux** : à la résonance, $L\omega = \dfrac{1}{C\omega}$ et l'impédance est **minimale** : $Z = R$.
2. Un ébranlement est transversal lorsque la perturbation du milieu est **perpendiculaire** à la direction de propagation.

### Partie B
1. $v = \dfrac\lambda T = \dfrac{\lambda}{2\times10^{-3}} = 500\,\lambda$ (m/s, $\lambda$ en m).
2. $\omega = \dfrac{2\pi}{T} = 1\,000\pi$ rad/s, amplitude $2\times10^{-4}$ m, phase nulle : $y_O(t) = 2\times10^{-4}\sin(1\,000\pi t)$.
3. Retard $t_M = \dfrac dv = \dfrac{12{,}5}{500\lambda}$ : $y_M(t) = y_O(t - t_M) = 2\times10^{-4}\sin\!\left(1\,000\pi t - \dfrac{25\pi}{\lambda}\right)$ pour $t \geq t_M$.
4. L'onde parcourt $\lambda$ en $T$ : $t_1 = \dfrac{d_1}{\lambda}T = \dfrac64 \times 2\times10^{-3} = \mathbf{3\times10^{-3}}$ **s**.

### Partie C
1. a) Théorème de l'énergie cinétique entre A et B : le poids fournit $mgr(1 - \cos\theta)$ (dénivelé $r - r\cos\theta$), la réaction normale ne travaille pas, le frottement fournit $-f\cdot r\theta$ (longueur de l'arc) :
$$\tfrac12mv_B^2 = mgr(1 - \cos\theta) - fr\theta \;\Rightarrow\; v_B = \sqrt{2r\left[g(1 - \cos\theta) - \frac fm\theta\right]}.$$
   b) Sur BC (horizontal), seul le frottement travaille : $\tfrac12mv_C^2 - \tfrac12mv_B^2 = -f\cdot 2r$, d'où
$$v_C = \sqrt{2r\left[g(1 - \cos\theta) - \frac fm(\theta + 2)\right]}.$$
2. a) $v_C = 0 \iff f = \dfrac{mg(1 - \cos\theta)}{\theta + 2}$.
   b) $f = \dfrac{60 \times 10 \times (1 - \cos\frac\pi4)}{\frac\pi4 + 2} \approx \mathbf{63}$ **N**.
   c) $v_B = \sqrt{2 \times 5\left[10(1 - 0{,}707) - \dfrac{63{,}1}{60}\times0{,}785\right]} \approx \mathbf{4{,}6}$ **m/s**.`,
  },
  {
    title: 'Bac C 2018 — Physique : pendule de torsion, résonance, condensateur plan, ondes, fentes de Young',
    statement: R`**Baccalauréat 2018 — Série C — Physique-Chimie, partie PHYSIQUE (12 points)**

${RECONSTITUE} Les courbes de la partie B sont décrites dans l'énoncé.

### Partie A : vérification des connaissances
1. **Questions à réponse courte.**
   1.1. Donne l'expression de la pulsation propre d'un pendule de torsion (constante de torsion $C$, moment d'inertie $J_\Delta$).
   1.2. Que vaut l'impédance d'un circuit RLC série à la résonance d'intensité ?
   1.3. Donne la direction, le sens et la valeur du champ électrique entre les armatures d'un condensateur plan (tension $U$, distance $d$).
   1.4. À quelle condition un mouvement rectiligne uniformément varié est-il accéléré ?
2. **Texte à trous.** « Un système est dit ……… lorsque son énergie mécanique reste constante au cours du temps. »

### Partie B : application des connaissances
Une source S vibre sinusoïdalement et l'onde se propage jusqu'à un point M. On a enregistré les élongations $y_S(t)$ et $y_M(t)$ : deux sinusoïdes d'amplitude $2$ mm et de période égale à 4 divisions de l'axe des temps (3 divisions correspondent à $0{,}015$ s) ; $y_S$ part de 0 en croissant à $t = 0$ ; $y_M$ démarre 2 divisions plus tard, et ses maxima coïncident avec les minima de $y_S$.
1. a) Déterminer la période et l'amplitude du mouvement.
   b) Déterminer le retard de M sur S.
   c) Comparer les mouvements de S et de M.
   d) Écrire les équations horaires $y_S(t)$ et $y_M(t)$.

### Partie C : résolution d'un problème
On réalise l'expérience des fentes de Young avec une source S monochromatique de longueur d'onde $\lambda_1$. Les fentes $S_1$ et $S_2$ sont distantes de $a = 1$ mm ; l'écran est à $D = 2$ m du plan des fentes.
1. 1.1 a) Donner la position $x_k$ des franges brillantes sur l'écran.
   b) En déduire l'expression de l'interfrange $i$.
   1.2 La distance séparant 11 franges brillantes consécutives est $9{,}6$ mm.
   a) Calculer l'interfrange.
   b) Calculer $\lambda_1$.
2. La source émet en plus une radiation $\lambda_2$. On constate que la 5ᵉ frange brillante de $\lambda_1$ coïncide avec la 4ᵉ frange brillante de $\lambda_2$. Calculer $\lambda_2$.`,
    solution: R`### Partie A
1. 1.1. Relation fondamentale de la dynamique de rotation : $J_\Delta\ddot\theta = -C\theta$, d'où $\ddot\theta + \dfrac{C}{J_\Delta}\theta = 0$ : $\omega_0 = \sqrt{\dfrac{C}{J_\Delta}}$ (et $T_0 = 2\pi\sqrt{\dfrac{J_\Delta}{C}}$).
   1.2. À la résonance, $L\omega = \dfrac1{C\omega}$ : l'impédance est minimale et vaut $Z = R$.
   1.3. $\vec E$ est perpendiculaire aux armatures, orienté vers l'armature négative, et $E = \dfrac Ud$ (V/m).
   1.4. Il est accéléré lorsque $\vec a$ et $\vec v$ ont le même sens : $\vec v\cdot\vec a > 0$.
2. « Un système est dit **conservatif** … »

### Partie B
1. a) Une division vaut $\dfrac{0{,}015}{3} = 0{,}005$ s : $T = 4 \times 0{,}005 = \mathbf{0{,}02}$ **s** ; amplitude $a = 2$ mm.
   b) $\theta = 2 \times 0{,}005 = 0{,}01$ s $= \dfrac T2$.
   c) Même fréquence ; les maxima de l'un coïncident avec les minima de l'autre : S et M vibrent **en opposition de phase**.
   d) $y_S(t) = 2\times10^{-3}\sin(100\pi t)$ (m) ; $y_M(t) = y_S(t - \theta) = 2\times10^{-3}\sin(100\pi t - \pi)$ pour $t \geq 0{,}01$ s.

### Partie C
1. 1.1 a) $x_k = k\dfrac{\lambda_1D}{a}$, $k \in \mathbb{Z}$.
   b) $i = x_{k+1} - x_k = \dfrac{\lambda_1D}{a}$.
   1.2 a) 11 franges brillantes consécutives délimitent 10 interfranges : $i = \dfrac{9{,}6}{10} = \mathbf{0{,}96}$ **mm**.
   b) $\lambda_1 = \dfrac{ia}{D} = \dfrac{0{,}96\times10^{-3} \times 10^{-3}}{2} = \mathbf{4{,}8\times10^{-7}}$ **m** (480 nm).
2. Coïncidence : $5\dfrac{\lambda_1D}{a} = 4\dfrac{\lambda_2D}{a}$, d'où $\lambda_2 = \dfrac{5\lambda_1}{4} = \mathbf{6{,}0\times10^{-7}}$ **m** (600 nm).`,
  },
]

export const BLOCS = [
  { subject: 'CHIMIE', levels: ['bac_c'], chapterTitle: 'Annales du bac — Chimie', description: 'Parties chimie des sujets du baccalauréat, avec corrigés détaillés.', orderStart: 10, exercises: CHIMIE },
  { subject: 'Physique', levels: ['bac_c'], chapterTitle: 'Annales du bac — Physique', description: 'Parties physique des sujets du baccalauréat, avec corrigés détaillés.', orderStart: 10, exercises: PHYSIQUE },
]
