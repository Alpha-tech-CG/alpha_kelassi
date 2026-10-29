// Annales du bac — PHYSIQUE-CHIMIE série D (Congo), sessions 2015 à 2020.
// Source : sujets officiels (PDF fournis le 26/10/2026). Corrigés rédigés pour
// l'application. Partie chimie → « CHIMIE », partie physique → « Physique ».
const R = String.raw

export const BLOCS = [
  { subject: 'CHIMIE', levels: ['bac_d'], chapterTitle: 'Annales du bac — Chimie', description: 'Parties chimie des sujets du baccalauréat, avec corrigés détaillés.', orderStart: 10, get exercises() { return CHIMIE } },
  { subject: 'Physique', levels: ['bac_d'], chapterTitle: 'Annales du bac — Physique', description: 'Parties physique des sujets du baccalauréat, avec corrigés détaillés.', orderStart: 10, get exercises() { return PHYSIQUE } },
]

const CHIMIE = [
  {
    title: 'Bac D 2020 — Chimie : énergie de liaison, QCM, teneur en fer d’un minerai',
    statement: R`**Baccalauréat 2020 — Série D — Physique-Chimie, partie CHIMIE (8 points)**

### Partie A : vérification des connaissances
1. **Texte à trous.** Recopie et complète la phrase avec quatre des six mots suivants : ionisation, noyau, constituants, fournir, liaison, isotopes.
« L'énergie de ……… est l'énergie qu'il faut ……… à un ……… stable au repos pour séparer ses ……… »
2. **Choix multiples.**
   a) Pour une solution aqueuse d'acide faible de concentration $C_A$ : a1) $[\text{H}_3\text{O}^+] < C_A$ ; a2) $[\text{H}_3\text{O}^+] > C_A$ ; a3) $[\text{H}_3\text{O}^+] = C_A$.
   b) La saponification d'un ester est une réaction : b1) limitée ; b2) totale ; b3) rapide.
   c) La réaction d'oxydoréduction est une : c1) réaction de transfert d'électrons mettant en jeu deux couples oxydant/réducteur ; c2) réaction de transfert de protons ; c3) réaction qui ne concerne que les noyaux des atomes.
   d) La densité d'un gaz par rapport à l'air est donnée par : d1) $29M$ ; d2) $\dfrac{29}{M}$ ; d3) $\dfrac{M}{29}$.
3. **Schéma à compléter.** Recopie et complète l'équation acido-basique : $(\text{CH}_3)_3\text{N} + \;\ldots \rightleftharpoons \text{OH}^- + \;\ldots$

### Partie B : application des connaissances
On dispose d'un minerai de fer de masse $80$ g. Pour déterminer sa teneur en fer, on le fait réagir avec une solution d'acide chlorhydrique ($\text{H}_3\text{O}^+ + \text{Cl}^-$). On observe un dégagement de $19{,}2$ L de gaz mesurés dans les CNTP.
1. Écris les demi-équations et l'équation bilan de la réaction d'oxydoréduction.
2. a) Détermine la masse de fer ayant réagi.
   b) Déduis-en la teneur en fer du minerai.

*Données :* $M(\text{Fe}) = 56$ g/mol ; $E^0(\text{Fe}^{2+}/\text{Fe}) = -0{,}41$ V ; $E^0(\text{H}_3\text{O}^+/\text{H}_2) = 0{,}00$ V ; $V_m = 22{,}4$ L/mol.`,
    solution: R`### Partie A
1. « L'énergie de **liaison** est l'énergie qu'il faut **fournir** à un **noyau** stable au repos pour séparer ses **constituants**. »
2. a) **a1** : l'acide faible n'est que partiellement dissocié. b) **b2** : totale. c) **c1**. d) **d3** : $d = \dfrac{M}{29}$.
3. $(\text{CH}_3)_3\text{N} + \text{H}_2\text{O} \rightleftharpoons \text{OH}^- + (\text{CH}_3)_3\text{NH}^+$ (la triméthylamine est une base faible).

### Partie B
1. $E^0(\text{H}_3\text{O}^+/\text{H}_2) > E^0(\text{Fe}^{2+}/\text{Fe})$ : l'oxydant $\text{H}_3\text{O}^+$ oxyde le fer.
   - $\text{Fe} \to \text{Fe}^{2+} + 2e^-$
   - $2\,\text{H}_3\text{O}^+ + 2e^- \to \text{H}_2 + 2\,\text{H}_2\text{O}$
   - Bilan : $\text{Fe} + 2\,\text{H}_3\text{O}^+ \longrightarrow \text{Fe}^{2+} + \text{H}_2 + 2\,\text{H}_2\text{O}$
2. a) $n(\text{H}_2) = \dfrac{19{,}2}{22{,}4} \approx 0{,}857$ mol $= n(\text{Fe})$, d'où $m(\text{Fe}) = 0{,}857 \times 56 = \mathbf{48}$ **g**.
   b) Teneur : $\dfrac{48}{80} = 0{,}60$, soit **60 %** de fer.`,
  },
  {
    title: 'Bac D 2019 — Chimie : radioactivité, vrai-faux, cinétique d’ordre 2 (NO₂)',
    statement: R`**Baccalauréat 2019 — Série D — Physique-Chimie, partie CHIMIE (8 points)**

### Partie A : vérification des connaissances
1. **Texte à trous.** Complète la phrase par quatre des cinq mots : électron ; longueur ; atomes ; particules ; rayonnement.
« Lorsque les noyaux de certains ……… se désintègrent, ils émettent d'une part des ………, d'autre part un ……… électromagnétique de très courte ……… d'onde. »
2. **Question à réponse construite.** Donne la définition d'une famille radioactive.
3. **Vrai ou faux.**
   a) Un indicateur coloré est un acide faible ou une base faible dont la couleur de la forme acide est différente de celle de la forme basique, en solution aqueuse.
   b) Un atome d'hydrogène dans son état fondamental émet un rayonnement électromagnétique.
   c) L'élévation ébulliométrique est inversement proportionnelle à la masse molaire moléculaire du soluté.
   d) Dans les conditions normales de température et de pression, le volume molaire est $V_m = 22{,}4$ mol/L.
   e) La constante d'équilibre d'une réaction chimique dépend des pressions partielles des réactifs et des produits.

### Partie B : application des connaissances
La cinétique de la réaction $2\,\text{NO}_2 \to 2\,\text{NO} + \text{O}_2$ a été étudiée à $400$ K. On a obtenu :

| Expérience | 1 | 2 | 3 |
|---|---|---|---|
| $[\text{NO}_2]_0$ (mol/L) | 0,85 | 1,10 | 1,6 |
| $v_0$ (mol·L⁻¹·s⁻¹) | 0,39 | 0,65 | 1,38 |

1. Détermine l'ordre global de cette réaction ainsi que la valeur de la constante de vitesse.
2. Déduis la loi de vitesse et la loi intégrée de cette réaction.
3. Calcule le temps de demi-réaction pour l'expérience 2.
4. Au bout de combien de temps 75 % du $\text{NO}_2$ se sont-ils transformés (expérience 2) ?`,
    solution: R`### Partie A
1. « Lorsque les noyaux de certains **atomes** se désintègrent, ils émettent d'une part des **particules**, d'autre part un **rayonnement** électromagnétique de très courte **longueur** d'onde. »
2. Après une désintégration, le noyau fils peut être lui-même instable et se désintégrer à son tour, et ainsi de suite jusqu'à un noyau stable. L'ensemble formé par le noyau père et tous ses descendants est une **famille radioactive** (ex. : famille de l'uranium 238, qui aboutit au plomb 206).
3. a) **Vrai**. b) **Faux** : dans l'état fondamental, il ne peut pas se désexciter, donc il n'émet rien. c) **Vrai** : $\Delta\theta = k_e\dfrac{m}{m'M}$. d) **Faux** : $V_m = 22{,}4$ **L/mol**. e) **Faux** : la constante d'équilibre ne dépend que de la température.

### Partie B
1. On teste $\dfrac{v_0}{[\text{NO}_2]_0^2}$ : $\dfrac{0{,}39}{0{,}85^2} \approx 0{,}540$ ; $\dfrac{0{,}65}{1{,}10^2} \approx 0{,}537$ ; $\dfrac{1{,}38}{1{,}6^2} \approx 0{,}539$. Ce rapport est constant : la réaction est **d'ordre 2**, avec $k \approx \mathbf{0{,}54}$ **L·mol⁻¹·s⁻¹**. (Le rapport $v_0/[\text{NO}_2]_0$, lui, varie : 0,46 ; 0,59 ; 0,86.)
2. La vitesse de réaction tient compte du coefficient 2 de $\text{NO}_2$ : $v = -\dfrac12\dfrac{d[\text{NO}_2]}{dt} = k[\text{NO}_2]^2 = 0{,}54\,[\text{NO}_2]^2$.
   Loi intégrée : $\dfrac{1}{[\text{NO}_2]} - \dfrac{1}{[\text{NO}_2]_0} = 2kt$.
3. $t_{1/2} = \dfrac{1}{2k[\text{NO}_2]_0} = \dfrac{1}{2 \times 0{,}54 \times 1{,}10} \approx \mathbf{0{,}84}$ **s**.
4. Il reste $\dfrac{[\text{NO}_2]_0}{4}$ : $\dfrac{4}{[\text{NO}_2]_0} - \dfrac{1}{[\text{NO}_2]_0} = 2kt$, d'où $t = \dfrac{3}{2k[\text{NO}_2]_0} = 3\,t_{1/2} \approx \mathbf{2{,}5}$ **s**.

> Remarque : si l'on définit la vitesse sans le coefficient ($v = -\frac{d[\text{NO}_2]}{dt} = k[\text{NO}_2]^2$), on trouve $t_{1/2} \approx 1{,}7$ s et $t \approx 5{,}1$ s. La convention ci-dessus est celle attendue au bac.`,
  },
  {
    title: 'Bac D 2018 — Chimie : oxydoréduction, QCM, vitesses de réaction, série de Balmer',
    statement: R`**Baccalauréat 2018 — Série D — Physique-Chimie, partie CHIMIE (8 points)**

### Partie A : vérification des connaissances
1. **Texte à trous.** Recopie puis complète les mots manquants parmi : oxydant, potentiel, électron, réducteur, oxydoréduction.
« Dans une réaction d'………, c'est l'……… le plus fort qui ……… avec le ……… le plus fort. »
2. **Choix multiples.**
   a) L'énergie de l'atome d'hydrogène est donnée par : a1) $E_n = \dfrac{13{,}6}{n^2}$ (J) ; a2) $E_n = -\dfrac{13{,}6}{n^2}$ (eV) ; a3) $E_n = -13{,}6\,n^2$ (eV).
   b) Le niveau d'énergie le plus bas de l'atome d'hydrogène correspond : b1) au premier état excité ; b2) au niveau d'ionisation ; b3) à l'état fondamental.
   c) En dissolvant un soluté de masse $m$ (masse molaire $M$) dans un solvant de masse $m'$, l'abaissement cryométrique de cette solution diluée non électrolytique est : c1) $\Delta\theta = K\dfrac{m'}{mM}$ ; c2) $\Delta\theta = K\dfrac{m}{m'M}$ ; c3) $\Delta\theta = K\dfrac{M}{mm'}$.
   d) Le pH d'une dibase forte en solution aqueuse est : d1) $-\log C_b$ ; d2) $14 - \log C_b$ ; d3) $14 + \log 2C_b$ ; d4) $14 + \log C_b$.
3. **Question à réponse courte.** Pour la réaction $2\,\text{I}^- + \text{H}_2\text{O}_2 + 2\,\text{H}_3\text{O}^+ \to \text{I}_2 + 4\,\text{H}_2\text{O}$, établis une relation :
   a) entre les vitesses de $\text{H}_2\text{O}_2$ et de $\text{H}_2\text{O}$ ;
   b) entre les vitesses de $\text{I}^-$ et de $\text{I}_2$.

### Partie B : application des connaissances
Les niveaux d'énergie de l'atome d'hydrogène sont $E_n = -\dfrac{13{,}6}{n^2}$ (eV), $n \in \mathbb{N}^*$.
1. Calcule en eV $E_1$, $E_2$, $E_3$, $E_4$, $E_5$, $E_\infty$.
2. Fais le diagramme d'énergie correspondant (échelle : 1 cm pour 1 eV).
3. Calcule : a) l'énergie minimale de la série de Balmer ; b) l'énergie maximale de la série de Balmer.
4. Déduis : a) la longueur d'onde $\lambda_1$ la plus courte de la série de Balmer ; b) la longueur d'onde $\lambda_2$ la plus grande de la même série.

*Données :* $h = 6{,}62\times10^{-34}$ J·s ; $c = 3\times10^8$ m/s ; $1$ eV $= 1{,}6\times10^{-19}$ J.`,
    solution: R`### Partie A
1. « Dans une réaction d'**oxydoréduction**, c'est l'**oxydant** le plus fort qui **réagit** avec le **réducteur** le plus fort. » (Le troisième blanc est le verbe *réagit*, absent de la liste ; *potentiel* et *électron* ne conviennent pas.)
2. a) **a2**. b) **b3**. c) **c2** : $\Delta\theta = K\dfrac{m}{m'M}$. d) **d3** : une dibase forte libère $2C_b$ ions $\text{OH}^-$, donc $pH = 14 + \log(2C_b)$.
3. a) $v(\text{H}_2\text{O}_2)_{\text{disp}} = \dfrac{v(\text{H}_2\text{O})_{\text{form}}}{4}$, soit $-\dfrac{d[\text{H}_2\text{O}_2]}{dt} = \dfrac14\dfrac{d[\text{H}_2\text{O}]}{dt}$.
   b) $v(\text{I}^-)_{\text{disp}} = 2\,v(\text{I}_2)_{\text{form}}$, soit $-\dfrac{d[\text{I}^-]}{dt} = 2\dfrac{d[\text{I}_2]}{dt}$.

### Partie B
1. $E_1 = -13{,}6$ ; $E_2 = -3{,}4$ ; $E_3 \approx -1{,}51$ ; $E_4 = -0{,}85$ ; $E_5 \approx -0{,}54$ ; $E_\infty = 0$ (eV).
2. Diagramme : traits horizontaux aux ordonnées correspondantes (13,6 cm entre $E_1$ et $E_\infty$).
3. La série de Balmer correspond aux désexcitations vers $n = 2$.
   a) Énergie minimale : transition $3 \to 2$ : $E_3 - E_2 \approx 1{,}89$ eV.
   b) Énergie maximale : transition $\infty \to 2$ : $E_\infty - E_2 = 3{,}4$ eV.
4. $\lambda = \dfrac{hc}{\Delta E}$ :
   a) $\lambda_1 = \dfrac{6{,}62\times10^{-34}\times3\times10^8}{3{,}4\times1{,}6\times10^{-19}} \approx \mathbf{365}$ **nm** (la plus courte correspond à l'énergie maximale).
   b) $\lambda_2 = \dfrac{6{,}62\times10^{-34}\times3\times10^8}{1{,}89\times1{,}6\times10^{-19}} \approx \mathbf{657}$ **nm**.`,
  },
  {
    title: 'Bac D 2017 — Chimie : QCM, appariement, estérification (méthanoate d’éthyle)',
    statement: R`**Baccalauréat 2017 — Série D — Physique-Chimie, partie CHIMIE (8 points)**

### Partie A : vérification des connaissances
1. **Choix multiples.** Choisis la bonne réponse.
   1.1. La longueur d'onde d'une raie est donnée par : a1) $\lambda = \dfrac{E_n - E_p}{hc}$ ; a2) $\lambda = \dfrac{h(E_n - E_p)}{c}$ ; a3) $\lambda = \dfrac{hc}{E_n - E_p}$.
   1.2. Le temps de demi-réaction d'une réaction d'ordre 1 est : b1) $t = \dfrac{k}{\ln 2}$ ; b2) $t = \dfrac{1}{kC_0}$ ; b3) $t = \dfrac{\ln 2}{k}$.
   1.3. Entre deux acides faibles, le plus fort est celui dont la constante d'acidité est : c1) plus faible ; c2) plus grande ; c3) nulle.
   1.4. Le rendement d'estérification d'un alcool tertiaire pour un mélange équimolaire est : d1) 67 % ; d2) 5 % ; d3) 60 %.
2. **Appariement.**

| Colonne A | Colonne B |
|---|---|
| A1 : radioactivité $\alpha$ | B1 : réaction totale |
| A2 : radioactivité $\beta^+$ | B2 : excès de nucléons |
| A3 : réaction de saponification | B3 : excès de protons |
| A4 : hydrolyse | B4 : réaction réversible |

### Partie B : application des connaissances
On prépare un ester à odeur de rhum en mélangeant $0{,}40$ mol d'acide méthanoïque (HCOOH) et $1{,}00$ mol d'éthanol ($\text{CH}_3\text{CH}_2\text{OH}$). On ajoute quelques gouttes d'acide sulfurique et on chauffe à reflux pendant 4 heures. Après refroidissement, on dose l'acide méthanoïque restant par une solution d'hydroxyde de sodium de concentration $C_b = 1{,}6$ mol/L : il faut verser $V_b = 30$ mL.
1. Écris l'équation-bilan de l'estérification et nomme l'ester formé.
2. Écris l'équation-bilan de la réaction de dosage.
3. Détermine la quantité d'acide méthanoïque présent à l'équilibre.
4. Déduis la composition (en mol) du mélange final.
5. Calcule le rendement de la réaction.`,
    solution: R`### Partie A
1. 1.1 : **a3** ($\lambda = \dfrac{hc}{E_n - E_p}$) ; 1.2 : **b3** ; 1.3 : **c2** ; 1.4 : **d2** (environ 5 % pour un alcool tertiaire ; 67 % pour un primaire, 60 % pour un secondaire).
2. A1 = B2 (le noyau a trop de nucléons) ; A2 = B3 (trop de protons) ; A3 = B1 (saponification totale) ; A4 = B4 (hydrolyse limitée, réversible).

### Partie B
1. $\text{HCOOH} + \text{CH}_3\text{CH}_2\text{OH} \rightleftharpoons \text{HCOOCH}_2\text{CH}_3 + \text{H}_2\text{O}$ : l'ester est le **méthanoate d'éthyle**.
2. $\text{HCOOH} + \text{OH}^- \longrightarrow \text{HCOO}^- + \text{H}_2\text{O}$.
3. $n(\text{HCOOH})_{\text{éq}} = C_bV_b = 1{,}6 \times 0{,}030 = \mathbf{0{,}048}$ **mol**.
4. Acide ayant réagi : $0{,}40 - 0{,}048 = 0{,}352$ mol. Mélange final : acide $0{,}048$ mol ; éthanol $1{,}00 - 0{,}352 = 0{,}648$ mol ; ester $0{,}352$ mol ; eau $0{,}352$ mol.
5. Le réactif limitant est l'acide : $r = \dfrac{0{,}352}{0{,}40} = \mathbf{88}$ **%** (supérieur à 67 % car l'alcool est en excès).`,
  },
  {
    title: 'Bac D 2016 — Chimie : noyau, appariement, rayonnement γ, acide méthanoïque',
    statement: R`**Baccalauréat 2016 — Série D — Physique-Chimie, partie CHIMIE (8 points)**

### Partie A : vérification des connaissances
1. **Texte à trous.** Complète par les mots : neutrons, l'atome, nucléons, protons.
« Le noyau de ……… est constitué des ……… et des ……… appelés ……… »
2. **Appariement.**

| Colonne A | Colonne B |
|---|---|
| a1 : solution basique | b1 : contient plus d'ions hydronium que d'ions hydroxyde |
| a2 : solution acide | b2 : isotopes |
| a3 : le produit ionique de l'eau | b3 : contient plus d'ions hydroxyde que d'ions hydronium |
| a4 : nucléides de même Z mais de A différents | b4 : aqueuse diluée |

3. **Question à réponse construite.** La radioactivité $\gamma$ accompagne généralement les radioactivités $\alpha$ et $\beta$. Explique l'émission du rayonnement $\gamma$.

### Partie B : application des connaissances
On a préparé une solution d'acide méthanoïque (HCOOH) de concentration inconnue $C_0$. Son pH est égal à $2{,}7$.
1. Écris l'équation-bilan de la réaction de l'acide méthanoïque avec l'eau.
2. Fais l'inventaire des espèces chimiques présentes dans la solution.
3. Sachant que le $pK_a$ du couple associé à l'acide méthanoïque est $3{,}8$, calcule les concentrations de toutes les espèces.
4. Déduis la concentration $C_0$ de la solution.

*Donnée :* $K_e = 10^{-14}$.`,
    solution: R`### Partie A
1. « Le noyau de **l'atome** est constitué des **protons** et des **neutrons** appelés **nucléons**. »
2. a1 = b3 ; a2 = b1 ; a3 = b4 (le produit ionique $K_e = [\text{H}_3\text{O}^+][\text{OH}^-]$ s'applique à toute solution aqueuse diluée) ; a4 = b2.
3. Après une désintégration $\alpha$ ou $\beta$, le noyau fils est souvent formé dans un **état excité**. Il revient à son état fondamental en émettant un photon de très grande énergie : c'est le rayonnement $\gamma$ (onde électromagnétique de très courte longueur d'onde).

### Partie B
1. $\text{HCOOH} + \text{H}_2\text{O} \rightleftharpoons \text{HCOO}^- + \text{H}_3\text{O}^+$.
2. $\text{H}_2\text{O}$, $\text{HCOOH}$, $\text{HCOO}^-$, $\text{H}_3\text{O}^+$, $\text{OH}^-$.
3. - $[\text{H}_3\text{O}^+] = 10^{-2{,}7} \approx 2{,}0\times10^{-3}$ mol/L ; $[\text{OH}^-] = \dfrac{10^{-14}}{2{,}0\times10^{-3}} \approx 5{,}0\times10^{-12}$ mol/L.
   - Électroneutralité ($[\text{OH}^-]$ négligeable) : $[\text{HCOO}^-] \approx 2{,}0\times10^{-3}$ mol/L.
   - $K_a = 10^{-3{,}8} \approx 1{,}58\times10^{-4}$ : $[\text{HCOOH}] = \dfrac{[\text{HCOO}^-][\text{H}_3\text{O}^+]}{K_a} = \dfrac{(2{,}0\times10^{-3})^2}{1{,}58\times10^{-4}} \approx 2{,}5\times10^{-2}$ mol/L.
4. Conservation de la matière : $C_0 = [\text{HCOOH}] + [\text{HCOO}^-] \approx 0{,}025 + 0{,}002 = \mathbf{2{,}7\times10^{-2}}$ **mol/L**.`,
  },
  {
    title: 'Bac D 2015 — Chimie : QCM, vrai-faux, cinétique d’ordre 1 (azométhane)',
    statement: R`**Baccalauréat 2015 — Série D — Physique-Chimie, partie CHIMIE (8 points)**

### Partie A : vérification des connaissances
1. **Choix multiples.**
   a) Le pH d'une solution aqueuse de monobase forte de concentration $C$ est : a1) $14 - \log C$ ; a2) $-\log C$ ; a3) $14 + \log C$.
   b) Un oxydant est une espèce chimique capable : b1) de céder des électrons ; b2) de capter des électrons.
   c) Lorsqu'on dilue une solution acide : c1) le pH diminue ; c2) le pH augmente ; c3) le pH ne varie pas.
2. **Vrai ou faux.**
   a) Le catalyseur permet de réduire la durée d'une réaction.
   b) Le temps de demi-réaction d'une réaction d'ordre 2 est $\dfrac{\ln 2}{K}$.
   c) L'hydrolyse d'un ester est une réaction limitée.
3. **Réarrangement.** Ordonne la phrase : « L'activité / par seconde / radioactive / est le nombre / d'une source / de désintégrations ».

### Partie B : application des connaissances
La décomposition de l'azométhane, $\text{CH}_3\text{N}_2\text{CH}_{3(g)} \to \text{CH}_3\text{CH}_{3(g)} + \text{N}_{2(g)}$, est une réaction d'ordre un, de constante de vitesse $K = 4\times10^{-4}$ s⁻¹ ; la concentration initiale est $C_0 = 0{,}604$ mol/L.
1. Écris la loi de vitesse de cette réaction.
2. Calcule : a) le temps de demi-réaction ; b) le temps nécessaire à la disparition de 75 % du réactif.
3. a) Détermine la concentration de l'azométhane à $t = 10$ min.
   b) Déduis la vitesse de la réaction à cet instant.`,
    solution: R`### Partie A
1. a) **a3** : $[\text{OH}^-] = C$, donc $pH = 14 + \log C$. b) **b2**. c) **c2** : la dilution diminue $[\text{H}_3\text{O}^+]$, le pH augmente (vers 7).
2. a) **Vrai**. b) **Faux** : pour l'ordre 2, $t_{1/2} = \dfrac{1}{KC_0}$ ; $\dfrac{\ln 2}{K}$ correspond à l'ordre 1. c) **Vrai**.
3. « L'activité d'une source radioactive est le nombre de désintégrations par seconde. »

### Partie B
1. $v = -\dfrac{d[\text{A}]}{dt} = K[\text{A}]$, de solution $[\text{A}] = C_0e^{-Kt}$.
2. a) $t_{1/2} = \dfrac{\ln 2}{K} = \dfrac{0{,}693}{4\times10^{-4}} \approx \mathbf{1\,733}$ **s** (environ 29 min).
   b) Il reste 25 % $= \dfrac14$ : deux demi-vies, $t = 2t_{1/2} = \dfrac{\ln 4}{K} \approx \mathbf{3\,466}$ **s** (environ 58 min).
3. a) $t = 600$ s : $[\text{A}] = 0{,}604\,e^{-4\times10^{-4}\times600} = 0{,}604\,e^{-0{,}24} \approx \mathbf{0{,}475}$ **mol/L**.
   b) $v = K[\text{A}] = 4\times10^{-4} \times 0{,}475 \approx \mathbf{1{,}9\times10^{-4}}$ **mol·L⁻¹·s⁻¹**.`,
  },
]

const PHYSIQUE = [
  {
    title: 'Bac D 2020 — Physique : vrai-faux, onde le long d’une corde, portée d’un jet d’eau',
    statement: R`**Baccalauréat 2020 — Série D — Physique-Chimie, partie PHYSIQUE (12 points)**

### Partie A : vérification des connaissances
1. **Question à réponse courte.** Définis la trajectoire d'un mobile.
2. **Schéma à compléter.** Une bille de masse $m$ glisse sans frottement à l'intérieur d'une piste en forme d'arc de cercle. Représente les forces appliquées sur la bille B.
3. **Vrai ou faux.**
   a) Un système animé d'un mouvement rectiligne uniforme a une vitesse constante.
   b) La période d'un pendule de torsion est $T = 2\pi\sqrt{\dfrac CJ}$.
   c) Deux mouvements sont en phase lorsque le déphasage vaut $\Delta\varphi = 2k\pi$.
   d) Au cours d'un mouvement circulaire uniforme, le vecteur accélération a deux composantes non nulles.
   e) L'équation différentielle d'un système animé d'un mouvement de rotation sinusoïdal est $\ddot x + \omega^2x = 0$.

### Partie B : application des connaissances
Une lame vibrante provoque à l'extrémité A d'une corde élastique de longueur $l = 3$ m et de masse $m = 90$ g un mouvement vibratoire sinusoïdal transversal qui se propage le long de la corde. La corde est tendue horizontalement par une force $F = 0{,}75$ N. On néglige l'amortissement et la réflexion.
La courbe $y_A(t)$ (en mm) est une sinusoïde d'amplitude $5$ mm qui passe par $0$ à $t = 0$ en allant vers les valeurs **négatives**, s'annule à $0{,}01$ s, $0{,}02$ s, $0{,}03$ s, $0{,}04$ s, avec un minimum $-5$ mm à $0{,}005$ s et un maximum $+5$ mm à $0{,}015$ s.
1. Calcule la célérité des ondes le long de la corde.
2. a) Déduis de la courbe la période $T$ et la fréquence $N$ du mouvement de A.
   b) Calcule la longueur d'onde.
   c) Écris l'équation horaire du mouvement de A.

### Partie C : résolution d'un problème
Un jardinier souhaite arroser des fleurs situées à $11$ m du dispositif d'arrosage, sur un sol horizontal. Le jet d'eau a une vitesse initiale $\vec v_0$ de norme $12$ m/s, inclinée de $\alpha = 25°$ sur l'horizontale. On étudie la chute libre d'une goutte (action de l'air négligée), $g = 10$ m/s².
1. Établis les équations horaires du mouvement de la goutte.
2. Déduis l'équation de sa trajectoire dans le repère $(Ox, Oy)$.
3. Calcule la portée $D$.
4. Les fleurs sont-elles arrosées ? Justifie.

*Aide :* $\sin 50° = 0{,}766$.`,
    solution: R`### Partie A
1. La trajectoire d'un mobile est l'ensemble des positions successives occupées par ce mobile au cours du temps (dans un référentiel donné).
2. Deux forces : le **poids** $\vec P$ (vertical, vers le bas) et la **réaction** $\vec R$ de la piste, perpendiculaire à la piste (dirigée vers le centre de l'arc), puisqu'il n'y a pas de frottement.
3. a) **Vrai**. b) **Faux** : $T = 2\pi\sqrt{\dfrac JC}$. c) **Vrai**. d) **Faux** : l'accélération est uniquement normale (centripète), sa composante tangentielle est nulle. e) **Faux** : pour une rotation, la variable est l'angle : $\ddot\theta + \omega^2\theta = 0$ ($\ddot x + \omega^2 x = 0$ décrit une translation).

### Partie B
1. $\mu = \dfrac{0{,}090}{3} = 0{,}03$ kg/m, $c = \sqrt{\dfrac F\mu} = \sqrt{\dfrac{0{,}75}{0{,}03}} = \mathbf{5}$ **m/s**.
2. a) $T = 0{,}02$ s, $N = \dfrac1T = \mathbf{50}$ **Hz**.
   b) $\lambda = \dfrac cN = \dfrac{5}{50} = \mathbf{0{,}10}$ **m**.
   c) Amplitude $5$ mm ; à $t = 0$, $y_A = 0$ et décroît : $y_A(t) = 5\times10^{-3}\sin(100\pi t + \pi) = -5\times10^{-3}\sin(100\pi t)$ (m).

### Partie C
1. La goutte n'est soumise qu'à son poids : $\vec a = \vec g$. Avec $v_0\cos\alpha \approx 10{,}88$ m/s et $v_0\sin\alpha \approx 5{,}07$ m/s :
   $x(t) = (v_0\cos\alpha)\,t \approx 10{,}88\,t$ ; $y(t) = -\tfrac12 gt^2 + (v_0\sin\alpha)\,t \approx -5t^2 + 5{,}07\,t$.
2. $y = -\dfrac{g}{2v_0^2\cos^2\alpha}x^2 + x\tan\alpha \approx -0{,}042\,x^2 + 0{,}466\,x$.
3. $y = 0$ pour $x \neq 0$ : $D = \dfrac{v_0^2\sin 2\alpha}{g} = \dfrac{144 \times 0{,}766}{10} \approx \mathbf{11{,}0}$ **m**.
4. La portée vaut environ $11$ m, distance des fleurs : **oui, les fleurs sont arrosées** (les gouttes retombent au niveau des fleurs).`,
  },
  {
    title: 'Bac D 2019 — Physique : appariement, ressort dans un ascenseur, pendule conique',
    statement: R`**Baccalauréat 2019 — Série D — Physique-Chimie, partie PHYSIQUE (12 points)**

### Partie A : vérification des connaissances
1. **Appariement.**

| Colonne A | Colonne B |
|---|---|
| A1 : incertitude relative | B1 : nœud |
| A2 : point d'amplitude maximale | B2 : nombre abstrait |
| A3 : point d'amplitude nulle | B3 : dépend du temps |
| A4 : incertitude absolue | B4 : nombre concret |
| | B5 : ventre |

2. **Question à réponse courte.** Donne le nom de la tension qu'il faut appliquer entre l'anode et la cathode d'une cellule photoélectrique pour annuler le courant photoélectrique.
3. **Schéma à compléter.** Un point M de la périphérie d'une roue en rotation autour de l'axe $(\Delta)$ passant par O effectue un mouvement circulaire uniformément accéléré. Représente le vecteur accélération $\vec a$ et le vecteur vitesse $\vec v$ de M.

### Partie B : application des connaissances
Un ascenseur démarre en translation rectiligne vers le haut. Il atteint la vitesse de $6$ m/s après un parcours de $6$ m. Il conserve ensuite cette vitesse sur une distance $d$, puis s'arrête $2{,}5$ s après un parcours $d'$.
1. Précise la nature du mouvement dans chacune des phases.
2. On suspend au plafond de l'ascenseur un ressort à spires non jointives, de longueur à vide $L_0 = 20$ cm et de raideur $k = 30$ N/m ; à l'autre extrémité est accroché un solide (S) de masse $m = 300$ g. Au cours du mouvement, le ressort prend une longueur $L$ (masse du ressort négligeable).
   a) Établis l'expression de $L$ en fonction de $L_0$, $m$, $k$, $g$ et de l'accélération $a$.
   b) Calcule $L$ au cours de chaque phase.

*On suppose qu'il ne se produit pas d'oscillations ; $g = 10$ m/s².*

### Partie C : résolution d'un problème
On veut déterminer la période $T$ d'un pendule conique. Un ressort vertical à spires non jointives a une longueur à vide $L_0 = 20$ cm. On y accroche un solide S de masse $m = 200$ g ; à l'équilibre, la longueur du ressort est $L_1 = 30$ cm.
1. Détermine la raideur $K$ du ressort.
2. Le ressort est fixé par son extrémité supérieure en un point O d'un axe vertical $(\Delta)$. L'ensemble est mis en rotation autour de $(\Delta)$ : S décrit un cercle dans un plan horizontal et le ressort fait un angle $\alpha = 30°$ avec l'axe.
   a) Représente les forces qui s'appliquent sur S.
   b) Calcule : b.1) la longueur $L_2$ du ressort ; b.2) la vitesse angulaire $\omega$.
3. Calcule enfin la période $T$ de ce pendule conique.

*On donne $g = 10$ m/s².*`,
    solution: R`### Partie A
1. A1 = B2 (sans unité) ; A2 = B5 (ventre) ; A3 = B1 (nœud) ; A4 = B4 (a une unité).
2. Le **potentiel d'arrêt** (tension d'arrêt) $U_0$, négatif : $eU_0 = E_{c\max}$.
3. $\vec v$ est **tangent** au cercle en M, dans le sens du mouvement. $\vec a$ a une composante tangentielle de même sens que $\vec v$ (mouvement accéléré) et une composante normale dirigée vers O : $\vec a$ est donc orienté vers l'intérieur du cercle et « vers l'avant ».

### Partie B
1. - Phase 1 : rectiligne **uniformément accéléré** : $a_1 = \dfrac{v^2}{2d_1} = \dfrac{36}{12} = 3$ m/s².
   - Phase 2 : rectiligne **uniforme** ($a_2 = 0$).
   - Phase 3 : rectiligne **uniformément retardé** : $a_3 = \dfrac{0 - 6}{2{,}5} = -2{,}4$ m/s² ; $d' = \dfrac{6 \times 2{,}5}{2} = 7{,}5$ m.
2. a) Dans le référentiel terrestre, sur un axe vertical orienté vers le haut : $k(L - L_0) - mg = ma$, d'où
$$L = L_0 + \frac{m(g + a)}{k}.$$
   b) Phase 1 : $L = 0{,}20 + \dfrac{0{,}3 \times 13}{30} = \mathbf{0{,}33}$ **m** ; phase 2 : $L = 0{,}20 + \dfrac{0{,}3\times10}{30} = \mathbf{0{,}30}$ **m** ; phase 3 : $L = 0{,}20 + \dfrac{0{,}3 \times 7{,}6}{30} \approx \mathbf{0{,}276}$ **m**.

### Partie C
1. À l'équilibre : $K(L_1 - L_0) = mg$, d'où $K = \dfrac{0{,}2 \times 10}{0{,}10} = \mathbf{20}$ **N/m**.
2. a) Deux forces : le poids $\vec P$ (vertical) et la tension $\vec T$ du ressort, dirigée de S vers O. Leur somme est horizontale, dirigée vers l'axe (force centripète).
   b.1) Projection verticale : $T\cos\alpha = mg$, donc $T = \dfrac{2}{\cos30°} \approx 2{,}31$ N et $L_2 = L_0 + \dfrac TK = 0{,}20 + \dfrac{2{,}31}{20} \approx \mathbf{0{,}315}$ **m**.
   b.2) Projection radiale, avec $r = L_2\sin\alpha$ : $T\sin\alpha = m\omega^2L_2\sin\alpha$, donc $\omega = \sqrt{\dfrac{T}{mL_2}} = \sqrt{\dfrac{2{,}31}{0{,}2 \times 0{,}315}} \approx \mathbf{6{,}05}$ **rad/s**.
3. $T = \dfrac{2\pi}{\omega} \approx \mathbf{1{,}04}$ **s**.`,
  },
  {
    title: 'Bac D 2018 — Physique : appariement, effet photoélectrique (potassium), onde sur une corde',
    statement: R`**Baccalauréat 2018 — Série D — Physique-Chimie, partie PHYSIQUE (12 points)**

### Partie A : vérification des connaissances
1. **Réarrangement.** Ordonne la phrase : « La formation / prouve / de la lumière / des interférences / la nature / lumineuses / ondulatoire ».
2. **Appariement.**

| Colonne A | Colonne B |
|---|---|
| A1 : différence de marche | B1 : la tension en avance de phase sur l'intensité |
| A2 : circuit inductif | B2 : $\dfrac{\lambda D}{a}$ |
| A3 : circuit capacitif | B3 : la tension en retard de phase sur l'intensité |
| A4 : interfrange | B4 : $\dfrac{ax}{D}$ |

3. **Question à réponse courte.** Définis un pendule pesant.

### Partie B : application des connaissances
La cathode d'une cellule photoélectrique au potassium est éclairée par deux radiations, de longueurs d'onde $\lambda_1 = 0{,}49$ µm et $\lambda_2 = 0{,}66$ µm. Le travail d'extraction du potassium est $W_0 = 2{,}25$ eV.
1. a) Détermine la longueur d'onde seuil.
   b) Laquelle des deux radiations provoque l'effet photoélectrique ?
2. La cellule est éclairée par $\lambda_1$. La puissance rayonnante reçue par la cathode est $P = 9\times10^{-7}$ W ; l'intensité du courant de saturation vaut $I_s = 4\times10^{-8}$ A. Détermine :
   a) la vitesse maximale des électrons à la sortie de la cathode ;
   b) le rendement quantique de la cellule.

*Données :* $h = 6{,}62\times10^{-34}$ J·s ; $c = 3\times10^8$ m/s ; $e = 1{,}6\times10^{-19}$ C ; $m_e = 9{,}1\times10^{-31}$ kg.

### Partie C : résolution d'un problème
L'extrémité A d'une lame horizontale vibre verticalement. En A est fixée une corde horizontale de longueur $L = AB = 1{,}20$ m et de masse $m = 24$ g, tendue par une force $F$ (un solide suspendu après une poulie). La fréquence des vibrations est $N = 50$ Hz et la célérité $c = 20$ m/s. Un dispositif supprime la réflexion en B.
1. Calcule : a) la longueur d'onde ; b) la tension $F$ du fil.
2. A a un mouvement sinusoïdal d'amplitude $a = 10$ mm.
   a) Établis l'équation horaire de A (origine des temps : élongation de A nulle et croissante).
   b) Établis l'équation horaire d'un point C tel que $AC = x = 70$ cm.
3. Représente l'élongation $y_C(t)$.
4. Représente l'aspect de la corde à l'instant $t = 0{,}025$ s.`,
    solution: R`### Partie A
1. « La formation des interférences lumineuses prouve la nature ondulatoire de la lumière. »
2. A1 = B4 ; A2 = B1 ; A3 = B3 ; A4 = B2.
3. Un pendule pesant est un solide mobile autour d'un axe horizontal fixe **ne passant pas par son centre d'inertie**.

### Partie B
1. a) $\lambda_0 = \dfrac{hc}{W_0} = \dfrac{6{,}62\times10^{-34}\times3\times10^8}{2{,}25\times1{,}6\times10^{-19}} \approx \mathbf{0{,}55}$ **µm**.
   b) Il faut $\lambda \leq \lambda_0$ : seule $\lambda_1 = 0{,}49$ µm convient.
2. a) $E_{c\max} = \dfrac{hc}{\lambda_1} - W_0 = 4{,}05\times10^{-19} - 3{,}60\times10^{-19} \approx 4{,}5\times10^{-20}$ J, d'où $v_{\max} = \sqrt{\dfrac{2E_{c\max}}{m_e}} \approx \mathbf{3{,}2\times10^5}$ **m/s**.
   b) Électrons émis par seconde : $n_e = \dfrac{I_s}{e} = 2{,}5\times10^{11}$ s⁻¹. Photons reçus par seconde : $n_p = \dfrac{P}{hc/\lambda_1} = \dfrac{9\times10^{-7}}{4{,}05\times10^{-19}} \approx 2{,}2\times10^{12}$ s⁻¹.
   Rendement quantique $\rho = \dfrac{n_e}{n_p} \approx \mathbf{0{,}11}$ (11 %).

### Partie C
1. a) $\lambda = \dfrac cN = \dfrac{20}{50} = \mathbf{0{,}40}$ **m**.
   b) $\mu = \dfrac{0{,}024}{1{,}20} = 0{,}02$ kg/m et $F = \mu c^2 = 0{,}02 \times 400 = \mathbf{8}$ **N**.
2. a) $y_A(t) = 10^{-2}\sin(100\pi t)$ (m).
   b) Retard $\theta = \dfrac xc = 0{,}035$ s ; pour $t \geq 0{,}035$ s : $y_C(t) = 10^{-2}\sin\!\left(100\pi t - \dfrac{2\pi x}{\lambda}\right) = 10^{-2}\sin(100\pi t - 3{,}5\pi) = 10^{-2}\cos(100\pi t)$ ; $y_C = 0$ avant.
3. Graphe : nul de $0$ à $0{,}035$ s, puis sinusoïde d'amplitude $10$ mm et de période $0{,}02$ s (C démarre vers le haut à $t = 0{,}035$ s, comme A à $t = 0$).
4. À $t = 0{,}025$ s, le front d'onde est en $x = ct = 0{,}50$ m. Pour $0 \leq x \leq 0{,}50$ m : $y(x) = 10^{-2}\sin(2{,}5\pi - 5\pi x) = 10^{-2}\cos(5\pi x)$ : sinusoïde de période spatiale $0{,}40$ m, valant $+10$ mm en A et $0$ au front ; au-delà de $0{,}50$ m, la corde est au repos (horizontale).`,
  },
  {
    title: 'Bac D 2017 — Physique : vrai-faux, pendule (énergie, tension), fentes de Young et lame de verre',
    statement: R`**Baccalauréat 2017 — Série D — Physique-Chimie, partie PHYSIQUE (12 points)**

### Partie A : vérification des connaissances
1. **Vrai ou faux.**
   a) La période de rotation de la Terre est $T = 24$ h.
   b) Un ventre de vibration est un point qui vibre avec une amplitude nulle.
   c) La distance parcourue par une onde pendant une période est appelée longueur d'onde.
   d) L'allure de la trajectoire d'un projectile dépend de sa masse.
2. **Texte à trous.** Complète par les mots : rectiligne, point, galiléen, mouvement, centre, isolé.
« Dans le référentiel ………, le mouvement du ……… d'inertie d'un solide ……… est un mouvement ……… uniforme. »
3. **Question à réponse courte.** Définis l'interfrange.

### Partie B : application des connaissances
Un pendule est constitué d'une bille de masse $m$ (assimilable à un point) fixée à l'extrémité d'une tige indéformable, sans masse, de longueur $l$ ; l'autre extrémité peut tourner autour d'un axe horizontal $(\Delta)$.
1. Fais le bilan des forces exercées sur la bille.
2. Calcule le travail de ces forces lorsque le pendule, écarté d'un angle $\alpha_m = 60°$ par rapport à la verticale puis abandonné, repasse par sa position d'équilibre.
3. Exprime, en fonction de $m$, $l$, $g$ et $\alpha_m$, la vitesse $v$ de la bille au passage à la verticale (vitesse initiale nulle).
4. Détermine la tension de la tige au passage par la verticale.

### Partie C : résolution d'un problème
On réalise l'expérience des fentes de Young. La source S, monochromatique, est à $d = 50$ cm du plan des fentes $S_1$ et $S_2$, distantes de $a = 3$ mm. L'écran (E) est à $D = 2$ m du plan des fentes. On veut déterminer l'épaisseur $e$ d'une lame de verre d'indice $n = 1{,}5$. Sur l'écran, la distance entre la 6ᵉ frange brillante d'un côté de la frange centrale et la 6ᵉ frange brillante de l'autre côté est $L = 4{,}8$ mm.
1. Détermine la longueur d'onde $\lambda_1$ de la lumière émise par S.
2. On déplace la source S parallèlement au plan des fentes, du côté de $S_1$, de $Y = 2{,}5$ cm. Le système de franges se déplace de $x$ sur l'écran.
   a) Établis l'expression de la différence de marche $\delta$ en fonction de $Y$, $x$, $D$, $d$ et $a$.
   b) De combien et dans quel sens se déplace la frange centrale ?
3. On utilise une lame de verre pour ramener la frange centrale à sa position initiale.
   a) Devant quelle fente doit-on placer la lame ?
   b) Détermine l'épaisseur $e$ de la lame.`,
    solution: R`### Partie A
1. a) **Faux** : la Terre fait un tour sur elle-même en un jour sidéral, environ $23$ h $56$ min ($86\,164$ s) ; 24 h est le jour solaire moyen. b) **Faux** : un ventre vibre avec une amplitude **maximale**. c) **Vrai**. d) **Faux** : en chute libre, $\vec a = \vec g$, indépendant de la masse.
2. « Dans le référentiel **galiléen**, le mouvement du **centre** d'inertie d'un solide **isolé** est un mouvement **rectiligne** uniforme. »
3. L'interfrange $i$ est la distance entre les milieux de deux franges consécutives de même nature (deux brillantes ou deux sombres) : $i = \dfrac{\lambda D}{a}$.

### Partie B
1. Le poids $\vec P$ (vertical, vers le bas) et la réaction $\vec R$ de la tige, dirigée selon la tige (pas de frottement sur l'axe).
2. $W(\vec R) = 0$ (perpendiculaire à la trajectoire circulaire). $W(\vec P) = mgh = mgl(1 - \cos\alpha_m) = \dfrac{mgl}{2}$ pour $\alpha_m = 60°$.
3. Théorème de l'énergie cinétique : $\tfrac12mv^2 = mgl(1 - \cos\alpha_m)$, d'où $v = \sqrt{2gl(1 - \cos\alpha_m)}$ $\left(= \sqrt{gl}\text{ pour } 60°\right)$.
4. À la verticale, sur la normale orientée vers l'axe : $T - mg = m\dfrac{v^2}{l}$, d'où $T = mg(3 - 2\cos\alpha_m) = \mathbf{2mg}$ pour $\alpha_m = 60°$.

### Partie C
1. Entre la 6ᵉ frange brillante d'un côté et la 6ᵉ de l'autre, il y a $12$ interfranges : $i = \dfrac{4{,}8}{12} = 0{,}40$ mm. $\lambda_1 = \dfrac{ia}{D} = \dfrac{0{,}40\times10^{-3}\times3\times10^{-3}}{2} = \mathbf{6{,}0\times10^{-7}}$ **m** (600 nm).
2. a) On oriente $Y$ et $x$ du côté de $S_1$. S est plus près de $S_1$ : $SS_2 - SS_1 \approx \dfrac{aY}{d}$. Pour un point M d'abscisse $x$ : $S_2M - S_1M \approx \dfrac{ax}{D}$. Donc
$$\delta = (SS_2 + S_2M) - (SS_1 + S_1M) = a\left(\frac Yd + \frac xD\right).$$
   b) Frange centrale : $\delta = 0 \Rightarrow x = -\dfrac{DY}{d} = -\dfrac{2 \times 0{,}025}{0{,}5} = -0{,}10$ m. Elle se déplace de **10 cm, du côté de $S_2$** (sens opposé au déplacement de la source).
3. a) Le chemin passant par $S_2$ est plus long de $\dfrac{aY}{d}$ ; il faut allonger le chemin optique passant par $S_1$ : on place la lame **devant $S_1$** (elle ajoute $(n - 1)e$).
   b) Au centre ($x = 0$) : $(n - 1)e = \dfrac{aY}{d}$, d'où $e = \dfrac{aY}{d(n-1)} = \dfrac{3\times10^{-3} \times 0{,}025}{0{,}5 \times 0{,}5} = \mathbf{3\times10^{-4}}$ **m** (0,3 mm).`,
  },
  {
    title: 'Bac D 2016 — Physique : oscillateur harmonique, ondes stationnaires, électron dans un champ électrostatique',
    statement: R`**Baccalauréat 2016 — Série D — Physique-Chimie, partie PHYSIQUE (12 points)**

### Partie A : vérification des connaissances
1. **Question à réponse courte.** Définis une onde transversale.
2. **Réarrangement.** Ordonne la phrase : « Un oscillateur / est une fonction sinusoïdale du temps / est / dont / un oscillateur / harmonique / l'équation horaire du mouvement ».
3. **Vrai ou faux.**
   a) Pour des oscillations de faible amplitude, un pendule pesant est un oscillateur harmonique de translation.
   b) La longueur d'onde est la distance parcourue par une onde en une période.
4. **Schéma à compléter.** Dans un repère $(O, \vec i, \vec j)$, représente les vecteurs de Fresnel $\overrightarrow{OA_1}$ et $\overrightarrow{OA_2}$ associés à $y_1 = 2\sin\left(100\pi t + \dfrac\pi2\right)$ (cm) et $y_2 = 3\sin(50\pi t + \pi)$ (cm).

### Partie B : application des connaissances
Une corde de longueur $L = 1{,}2$ m et de masse $m = 40$ g soutient à son extrémité C un solide de masse $M$ (la corde passe sur une poulie en B). La partie horizontale $AB = l = 0{,}9$ m est le siège d'ondes stationnaires. Un vibreur impose à A un mouvement sinusoïdal transversal de fréquence $N = 50$ Hz.
1. On observe 6 fuseaux sur AB. Calcule : a) la longueur d'onde ; b) la célérité de propagation.
2. Détermine la masse $M$ ($g = 10$ m/s²).

### Partie C : résolution d'un problème
Un faisceau homocinétique d'électrons pénètre au point O avec une vitesse horizontale $V_0 = 10^7$ m/s dans le champ électrostatique uniforme $\vec E$ régnant entre deux plaques horizontales A (en haut) et B (en bas), distantes de $d = 15$ cm ; O est à égale distance des plaques. Les plaques ont une longueur $l = 20$ cm ; on établit $U_{AB} = V_A - V_B = +150$ V.
1. a) Donne le signe des plaques et représente $\vec E$.
   b) Calcule l'intensité de $\vec E$.
2. a) Établis les équations horaires du mouvement de l'électron dans $(O, \vec i, \vec j)$.
   b) Détermine l'équation cartésienne de la trajectoire.
3. Trouve les composantes du vecteur vitesse $\vec v_S$ à la sortie S du champ.
4. Déduis la norme de $\vec v_S$.

*Données :* $q = -e = -1{,}6\times10^{-19}$ C ; $m = 9{,}1\times10^{-31}$ kg.`,
    solution: R`### Partie A
1. Une onde est transversale lorsque la perturbation (déformation du milieu) est **perpendiculaire** à la direction de propagation (ex. : onde le long d'une corde).
2. « Un oscillateur harmonique est un oscillateur dont l'équation horaire du mouvement est une fonction sinusoïdale du temps. »
3. a) **Faux** : c'est un oscillateur harmonique de **rotation**. b) **Vrai**.
4. $\overrightarrow{OA_1}$ : longueur $2$ cm, angle $\dfrac\pi2$ avec $(O, \vec i)$ : porté par $+\vec j$. $\overrightarrow{OA_2}$ : longueur $3$ cm, angle $\pi$ : porté par $-\vec i$ (représentation à $t = 0$ ; les deux pulsations étant différentes, les vecteurs ne tournent pas à la même vitesse).

### Partie B
1. a) Chaque fuseau mesure $\dfrac\lambda2$ : $6\cdot\dfrac\lambda2 = 0{,}9$ m, donc $\lambda = \mathbf{0{,}30}$ **m**.
   b) $c = \lambda N = 0{,}30 \times 50 = \mathbf{15}$ **m/s**.
2. $\mu = \dfrac{0{,}040}{1{,}2} \approx 3{,}33\times10^{-2}$ kg/m. Tension de la corde : $F = \mu c^2 = 3{,}33\times10^{-2} \times 225 = 7{,}5$ N $= Mg$, d'où $M = \mathbf{0{,}75}$ **kg**.

### Partie C
1. a) $V_A > V_B$ : **A est positive, B négative** ; $\vec E$ est vertical, dirigé de A vers B (vers le bas).
   b) $E = \dfrac{U_{AB}}{d} = \dfrac{150}{0{,}15} = \mathbf{1\,000}$ **V/m**.
2. a) $\vec F = q\vec E = -e\vec E$ : vers le haut. $a = \dfrac{eE}{m} = \dfrac{1{,}6\times10^{-19}\times1\,000}{9{,}1\times10^{-31}} \approx 1{,}76\times10^{14}$ m/s² (selon $+\vec j$).
   $x(t) = V_0t$ ; $y(t) = \tfrac12at^2$.
   b) $y = \dfrac{eE}{2mV_0^2}x^2 \approx 0{,}88\,x^2$ (parabole tournée vers A).
3. Durée de traversée : $t_S = \dfrac{l}{V_0} = 2\times10^{-8}$ s. $v_{Sx} = V_0 = 10^7$ m/s ; $v_{Sy} = at_S \approx 3{,}5\times10^6$ m/s. (À la sortie, $y_S \approx 0{,}88 \times 0{,}2^2 \approx 3{,}5$ cm $< 7{,}5$ cm : l'électron sort bien du champ sans toucher A.)
4. $v_S = \sqrt{(10^7)^2 + (3{,}5\times10^6)^2} \approx \mathbf{1{,}06\times10^7}$ **m/s**.`,
  },
  {
    title: 'Bac D 2015 — Physique : mouvement circulaire, camion sur une côte, effet photoélectrique',
    statement: R`**Baccalauréat 2015 — Série D — Physique-Chimie, partie PHYSIQUE (12 points)**

### Partie A : vérification des connaissances
1. **Texte à trous.** Complète par : tangent ; trajectoire ; uniforme ; normal.
« Dans un mouvement circulaire ………, le vecteur accélération est ……… tandis que le vecteur vitesse est ……… à la ……… »
2. **Appariement.**

| Colonne A | Colonne B |
|---|---|
| a1 : impédance du circuit R, L | b1 : $Z = \sqrt{R^2 + \left(L\omega - \frac{1}{C\omega}\right)^2}$ |
| a2 : différence de marche d'un point d'amplitude nulle | b2 : $Z = \sqrt{R^2 + (L\omega)^2}$ |
| a3 : impédance du circuit R, L, C série | b3 : $d_2 - d_1 = k\lambda$ |
| a4 : différence de marche d'un point d'amplitude maximale | b4 : $d_2 - d_1 = (2k+1)\dfrac\lambda2$ |

3. **Choix multiples.**
   a) Dans un mouvement circulaire uniformément varié, l'accélération angulaire est : a1) nulle ; a2) constante ; a3) variable.
   b) Le mouvement d'un satellite autour de la Terre est étudié dans le référentiel : b1) terrestre supposé galiléen ; b2) géocentrique supposé galiléen ; b3) lié au centre du Soleil.
   c) La célérité $V$ des ondes sur une corde de masse linéique $\mu$, tendue par une force $F$, est : c1) $V = \sqrt{\dfrac\mu F}$ ; c2) $V = \sqrt{F\mu}$ ; c3) $V = \sqrt{\dfrac F\mu}$.
   d) L'énergie cinétique d'un système en rotation est : d1) $\tfrac12mV^2$ ; d2) $\tfrac12J\dot\theta^2$ ; d3) $\tfrac12\dfrac{J}{\dot\theta^2}$.

### Partie B : application des connaissances
Un camion de masse totale $M = 2{,}4$ t grimpe une côte rectiligne AB inclinée de $\alpha = 30°$ sur l'horizontale. Partant du repos en A, il accélère uniformément et atteint $18$ km/h en $10$ s. Les frottements équivalent à une force $\vec f$ parallèle à la ligne de plus grande pente, d'intensité $f = 400$ N. Calcule :
a) l'accélération du mouvement ;
b) l'intensité $F$ de la force motrice ;
c) la vitesse au sommet B, sachant que $AB = 196$ m ;
d) l'énergie mécanique du système camion-Terre en B (référence de l'énergie potentielle : le plan horizontal passant par A).

### Partie C : résolution d'un problème
La cathode d'une cellule photoélectrique a un seuil photoélectrique $\lambda_0 = 0{,}684\times10^{-6}$ m. On l'éclaire avec une radiation $\lambda < \lambda_0$. Pour une tension anode-cathode de $45$ V, les électrons arrivent sur l'anode avec la vitesse $v_A = 4\times10^6$ m/s.
1. Détermine : a) l'énergie d'extraction $W_0$ ; b) l'énergie cinétique d'un électron arrivant sur l'anode ; c) l'énergie cinétique maximale d'un électron émis à la cathode.
2. Calcule l'énergie $W$ d'un photon incident.
3. Déduis-en la longueur d'onde de la radiation.

*Données :* $m_e = 9{,}1\times10^{-31}$ kg ; $c = 3\times10^8$ m/s ; $h = 6{,}62\times10^{-34}$ J·s ; $e = 1{,}6\times10^{-19}$ C.`,
    solution: R`### Partie A
1. « Dans un mouvement circulaire **uniforme**, le vecteur accélération est **normal** tandis que le vecteur vitesse est **tangent** à la **trajectoire**. »
2. a1 = b2 ; a2 = b4 ; a3 = b1 ; a4 = b3.
3. a) **a2** ; b) **b2** ; c) **c3** ; d) **d2**.

### Partie B
a) $v = 18$ km/h $= 5$ m/s ; $a = \dfrac{5 - 0}{10} = \mathbf{0{,}5}$ **m/s²**.
b) Projection de $\sum\vec F = M\vec a$ sur la ligne de plus grande pente (vers le haut) : $F - f - Mg\sin\alpha = Ma$, d'où (avec $g = 9{,}8$ m/s²)
$F = 2\,400 \times 0{,}5 + 400 + 2\,400 \times 9{,}8 \times 0{,}5 = 1\,200 + 400 + 11\,760 \approx \mathbf{1{,}34\times10^4}$ **N** (avec $g = 10$ : $1{,}36\times10^4$ N).
c) En supposant l'accélération maintenue sur toute la côte : $v_B^2 = 2a\,AB = 2 \times 0{,}5 \times 196 = 196$, d'où $v_B = \mathbf{14}$ **m/s**.
d) $E_m = \tfrac12Mv_B^2 + Mg\,AB\sin\alpha = \tfrac12 \times 2\,400 \times 196 + 2\,400 \times 9{,}8 \times 98 \approx 2{,}35\times10^5 + 2{,}30\times10^6 \approx \mathbf{2{,}54\times10^6}$ **J**.

### Partie C
1. a) $W_0 = \dfrac{hc}{\lambda_0} = \dfrac{6{,}62\times10^{-34}\times3\times10^8}{0{,}684\times10^{-6}} \approx \mathbf{2{,}90\times10^{-19}}$ **J** ($\approx 1{,}8$ eV).
   b) $E_{cA} = \tfrac12m_ev_A^2 = \tfrac12 \times 9{,}1\times10^{-31} \times (4\times10^6)^2 \approx \mathbf{7{,}28\times10^{-18}}$ **J**.
   c) Théorème de l'énergie cinétique entre C et A : $E_{cA} - E_{c\max} = eU_{AC}$, d'où $E_{c\max} = 7{,}28\times10^{-18} - 1{,}6\times10^{-19}\times45 = \mathbf{8{,}0\times10^{-20}}$ **J** ($0{,}5$ eV).
2. $W = W_0 + E_{c\max} \approx 2{,}90\times10^{-19} + 0{,}80\times10^{-19} = \mathbf{3{,}70\times10^{-19}}$ **J**.
3. $\lambda = \dfrac{hc}{W} \approx \dfrac{1{,}986\times10^{-25}}{3{,}70\times10^{-19}} \approx \mathbf{5{,}37\times10^{-7}}$ **m** (environ 537 nm).`,
  },
]
