// Annales du bac — PHYSIQUE-CHIMIE série D (Congo), sessions 2010 à 2014.
// Source : sujets officiels (PDF fournis le 26/10/2026), sans corrigé : corrigés rédigés
// pour l'application. Chaque sujet est découpé : partie chimie → matière « CHIMIE »,
// partie physique → matière « Physique ».
// Ordre d'affichage : du plus récent au plus ancien (2015-2020 occupent les rangs 0 à 99).
const R = String.raw

export const BLOCS = [
  { subject: 'CHIMIE', levels: ['bac_d'], chapterTitle: 'Annales du bac — Chimie', description: 'Parties chimie des sujets du baccalauréat, avec corrigés détaillés.', orderStart: 100, get exercises() { return CHIMIE } },
  { subject: 'Physique', levels: ['bac_d'], chapterTitle: 'Annales du bac — Physique', description: 'Parties physique des sujets du baccalauréat, avec corrigés détaillés.', orderStart: 100, get exercises() { return PHYSIQUE } },
]

export const CHIMIE = [
  {
    title: 'Bac D 2014 — Chimie : connaissances, dosage du permanganate par le fer (II)',
    statement: R`**Baccalauréat 2014 — Série D — Physique-Chimie, partie CHIMIE (8 points)**

### Partie A : vérification des connaissances

**Appariement.** Relie un élément-question de la colonne A à un élément-réponse de la colonne B (exemple : a·8 = b·12).

| Colonne A | Colonne B |
|---|---|
| a·1 Le pH d'une solution de monoacide fort | b·1 $t_{1/2} = \dfrac{1}{kC_0}$ |
| a·2 L'élévation ébulliométrique d'une solution | b·2 une droite de pente $-k$ |
| a·3 Le temps de demi-réaction d'une réaction d'ordre 2 | b·3 $-\log C_a$ |
| a·4 Pour une réaction d'ordre 1, la fonction $\ln C = f(t)$ est : | b·4 $\Delta\theta = k'\dfrac{m}{m'M}$ |

**Question à réponse courte.** Donne les définitions de : a) série de raies ; b) énergie d'ionisation de l'atome d'hydrogène.

**Réarrangement.** Ordonne le texte suivant écrit en désordre :
« dans l'échantillon soit désintégrée / initialement présents / d'un nucléide / est la durée nécessaire / pour que / la période radioactive / la moitié des noyaux radioactifs »

### Partie B : application des connaissances
1. On prépare une solution S en dissolvant $7{,}9$ g de cristaux anhydres de permanganate de potassium ($\text{KMnO}_4$) dans $200$ mL d'eau. Calcule la concentration molaire volumique de la solution S.
2. On dose en milieu acide $20$ mL de la solution S par une solution de sulfate de fer ($\text{Fe}^{2+} + \text{SO}_4^{2-}$) à $1$ mol/L.
   a) Écris l'équation bilan de la réaction d'oxydoréduction.
   b) Calcule le volume de la solution de sulfate de fer utilisé.
   c) Calcule les concentrations molaires volumiques des ions manganèse ($\text{Mn}^{2+}$) et des ions ferriques ($\text{Fe}^{3+}$) formés.

*Données :* $K = 39$ ; $Mn = 55$ ; $O = 16$ (g/mol). Couples redox : $\text{Fe}^{3+}/\text{Fe}^{2+}$ ; $\text{MnO}_4^-/\text{Mn}^{2+}$.`,
    solution: R`### Partie A
**Appariement :** a·1 = b·3 ; a·2 = b·4 ; a·3 = b·1 ; a·4 = b·2.

**Définitions.**
- a) Une **série de raies** est l'ensemble des radiations émises (ou absorbées) par l'atome lorsqu'il se désexcite vers (ou s'excite depuis) un **même niveau** d'énergie (niveau 1 : série de Lyman ; niveau 2 : série de Balmer…).
- b) L'**énergie d'ionisation** de l'atome d'hydrogène est l'énergie minimale à fournir à l'atome, pris dans son état fondamental, pour lui arracher son électron : $E_i = E_\infty - E_1 = 13{,}6$ eV.

**Réarrangement :** « La période radioactive d'un nucléide est la durée nécessaire pour que la moitié des noyaux radioactifs initialement présents dans l'échantillon soit désintégrée. »

### Partie B
1. $M(\text{KMnO}_4) = 39 + 55 + 4 \times 16 = 158$ g/mol, $n = \dfrac{7{,}9}{158} = 0{,}05$ mol, d'où $C = \dfrac{0{,}05}{0{,}200} = \mathbf{0{,}25}$ **mol/L**.
2. a) Demi-équations : $\text{MnO}_4^- + 8\text{H}^+ + 5e^- \to \text{Mn}^{2+} + 4\text{H}_2\text{O}$ et $\text{Fe}^{2+} \to \text{Fe}^{3+} + e^-$ (×5).
$$\text{MnO}_4^- + 5\,\text{Fe}^{2+} + 8\,\text{H}^+ \longrightarrow \text{Mn}^{2+} + 5\,\text{Fe}^{3+} + 4\,\text{H}_2\text{O}$$
   b) À l'équivalence $n(\text{Fe}^{2+}) = 5\,n(\text{MnO}_4^-) = 5 \times 0{,}25 \times 0{,}020 = 0{,}025$ mol, d'où $V = \dfrac{0{,}025}{1} = 25$ mL.
   c) Volume total : $20 + 25 = 45$ mL. $n(\text{Mn}^{2+}) = 5 \times 10^{-3}$ mol et $n(\text{Fe}^{3+}) = 0{,}025$ mol :
   $[\text{Mn}^{2+}] = \dfrac{5\times10^{-3}}{0{,}045} \approx 0{,}11$ mol/L ; $[\text{Fe}^{3+}] = \dfrac{0{,}025}{0{,}045} \approx 0{,}56$ mol/L.`,
  },
  {
    title: 'Bac D 2013 — Chimie : spectre de l’atome d’hydrogène, mélange soude-acide chlorhydrique',
    statement: R`**Baccalauréat 2013 — Série D — Physique-Chimie, partie CHIMIE (8 points)**

### Exercice 1 (Spectre de l'atome d'hydrogène)
Les niveaux d'énergie quantifiés de l'atome d'hydrogène sont donnés par $E_n = -\dfrac{13{,}6}{n^2}$ (eV), $n$ étant un entier supérieur ou égal à 1.
1. a) Calculer les énergies des niveaux correspondant à $n = 1$ ; $2$ ; $3$ ; $4$ ; $5$ et $n = \infty$.
   b) Représenter dans un diagramme d'énergie les cinq premiers niveaux ainsi que le niveau correspondant à l'atome ionisé.
2. Le spectre de l'atome d'hydrogène contient les radiations de fréquences $N_a = 6{,}16\times10^{14}$ Hz et $N_b = 6{,}91\times10^{14}$ Hz. Sachant que ces deux radiations aboutissent au niveau $n = 2$, déterminer les numéros $a$ et $b$ des niveaux initiaux.

*Données :* $h = 6{,}62\times10^{-34}$ J·s ; $1$ eV $= 1{,}6\times10^{-19}$ J.

### Exercice 2 (Réaction acide-base)
On dissout une masse $m = 4{,}0$ g de soude dans un volume $V_1 = 500$ mL de solution d'acide chlorhydrique de concentration $C_1 = 10^{-1}$ mol/L.
1. a) Écrire les équations des réactions.
   b) Déterminer, en moles, la quantité d'ions hydroxyde apportés par la soude et la quantité d'ions hydronium présents dans la solution d'acide chlorhydrique avant le mélange.
2. Le mélange obtenu est-il acide ou basique ?
3. Calculer les concentrations des ions présents dans le mélange. En déduire le pH.
4. Quel volume de solution d'acide chlorhydrique de concentration $C_1$ faut-il ajouter au mélange précédent pour obtenir une solution neutre ?

*Données :* $K_e = 10^{-14}$ à 25 °C ; $Na = 23$ ; $O = 16$ ; $H = 1$ (g/mol).`,
    solution: R`### Exercice 1
1. a) $E_1 = -13{,}6$ eV ; $E_2 = -3{,}40$ eV ; $E_3 \approx -1{,}51$ eV ; $E_4 = -0{,}85$ eV ; $E_5 \approx -0{,}54$ eV ; $E_\infty = 0$.
   b) Diagramme : axe vertical des énergies, un trait horizontal par niveau ; les niveaux se resserrent vers $E_\infty = 0$ (atome ionisé).
2. Énergie du photon : $E = hN$.
   - $E_a = 6{,}62\times10^{-34} \times 6{,}16\times10^{14} \approx 4{,}08\times10^{-19}$ J $\approx 2{,}55$ eV. Or $E_a = E_a' - E_2$, d'où le niveau initial $-3{,}40 + 2{,}55 = -0{,}85$ eV $= E_4$ : $\mathbf{a = 4}$.
   - $E_b \approx 4{,}57\times10^{-19}$ J $\approx 2{,}86$ eV ; niveau initial $-3{,}40 + 2{,}86 = -0{,}54$ eV $= E_5$ : $\mathbf{b = 5}$.

### Exercice 2
1. a) Dissolution : $\text{NaOH} \to \text{Na}^+ + \text{OH}^-$. Réaction : $\text{H}_3\text{O}^+ + \text{OH}^- \to 2\,\text{H}_2\text{O}$.
   b) $n(\text{OH}^-) = \dfrac{4{,}0}{40} = 0{,}10$ mol ; $n(\text{H}_3\text{O}^+) = C_1V_1 = 0{,}1 \times 0{,}5 = 0{,}05$ mol.
2. Les ions $\text{OH}^-$ sont en excès ($0{,}05$ mol restants) : le mélange est **basique**.
3. En admettant que le volume reste $0{,}5$ L : $[\text{OH}^-] = 0{,}10$ mol/L, $[\text{Na}^+] = 0{,}20$ mol/L, $[\text{Cl}^-] = 0{,}10$ mol/L, $[\text{H}_3\text{O}^+] = \dfrac{10^{-14}}{0{,}10} = 10^{-13}$ mol/L, d'où $\mathbf{pH = 13}$.
4. Il faut neutraliser les $0{,}05$ mol d'$\text{OH}^-$ restants : $V = \dfrac{0{,}05}{0{,}1} = 0{,}5$ L $=$ **500 mL**.`,
  },
  {
    title: 'Bac D 2012 — Chimie : spectre de l’atome d’hydrogène (Balmer), dosage du diiode',
    statement: R`**Baccalauréat 2012 — Série D — Physique-Chimie, partie CHIMIE (8 points)**

### Exercice 1 (Spectre de l'atome d'hydrogène)
Les niveaux énergétiques de l'atome d'hydrogène sont donnés par $E_n = -\dfrac{E_0}{n^2}$ avec $E_0 = 13{,}6$ eV.
1. a) Calculer les énergies correspondant à $n = 1$, $n = 2$, $n = 3$, $n = \infty$.
   b) Représenter le diagramme des énergies de l'atome (échelle : 1 cm pour 1 eV).
2. L'analyse du spectre d'émission révèle la présence de la radiation de longueur d'onde $\lambda = 656$ nm dans la série de Balmer.
   a) Montrer que les longueurs d'onde des radiations de la série de Balmer vérifient $\dfrac{1}{\lambda} = R_H\left(\dfrac14 - \dfrac{1}{n^2}\right)$.
   b) Déterminer $n$ pour la radiation $\lambda = 656$ nm.
3. Un photon d'énergie $7$ eV arrive sur un atome d'hydrogène. Que se passe-t-il :
   a) si l'atome est dans l'état fondamental ?
   b) si l'atome est dans l'état excité $n = 2$ ?

*Données :* $h = 6{,}62\times10^{-34}$ J·s ; $c = 3\times10^8$ m/s ; $1$ eV $= 1{,}6\times10^{-19}$ J.

### Exercice 2 (Oxydoréduction)
1. a) Écrire les demi-équations des couples $\text{I}_2/\text{I}^-$ et $\text{S}_4\text{O}_6^{2-}/\text{S}_2\text{O}_3^{2-}$.
   b) En déduire l'équation bilan de la réaction entre le diiode et l'ion thiosulfate.
2. On dose $V_0 = 50$ mL d'une solution de diiode par une solution de thiosulfate de concentration $C_r = 0{,}1$ mol/L. L'équivalence est atteinte pour $V_r = 25{,}5$ mL.
   a) Calculer la concentration $C_0$ de la solution de diiode.
   b) Quelle masse de cristaux de thiosulfate de sodium $\text{Na}_2\text{S}_2\text{O}_3$ a-t-on dissoute dans un litre (pour préparer la solution titrante) si les cristaux contiennent 5 % d'impuretés ?

*Données :* $S = 32$ ; $Na = 23$ ; $O = 16$ (g/mol).`,
    solution: R`### Exercice 1
1. a) $E_1 = -13{,}6$ eV ; $E_2 = -3{,}4$ eV ; $E_3 \approx -1{,}51$ eV ; $E_\infty = 0$.
   b) Diagramme : traits horizontaux à $-13{,}6$ cm, $-3{,}4$ cm, $-1{,}5$ cm et $0$ sous l'origine.
2. a) Série de Balmer : désexcitation d'un niveau $n > 2$ vers le niveau 2. Le photon émis a l'énergie $\dfrac{hc}{\lambda} = E_n - E_2 = E_0\left(\dfrac14 - \dfrac1{n^2}\right)$, d'où $\dfrac1\lambda = R_H\left(\dfrac14 - \dfrac1{n^2}\right)$ avec $R_H = \dfrac{E_0}{hc} \approx 1{,}10\times10^{7}$ m⁻¹.
   b) $\dfrac{1}{656\times10^{-9}} = 1{,}524\times10^{6}$ m⁻¹ $\Rightarrow \dfrac14 - \dfrac1{n^2} \approx 0{,}139 \Rightarrow \dfrac1{n^2} \approx 0{,}111 \Rightarrow \mathbf{n = 3}$ (raie rouge $H_\alpha$).
3. a) État fondamental : $-13{,}6 + 7 = -6{,}6$ eV ne correspond à aucun niveau et $7 < 13{,}6$ eV : le photon **n'est pas absorbé**.
   b) État $n = 2$ : $7 > 3{,}4$ eV, le photon est absorbé et l'atome est **ionisé** ; l'électron part avec $E_c = 7 - 3{,}4 = 3{,}6$ eV.

### Exercice 2
1. a) $\text{I}_2 + 2e^- \to 2\,\text{I}^-$ et $2\,\text{S}_2\text{O}_3^{2-} \to \text{S}_4\text{O}_6^{2-} + 2e^-$.
   b) $\text{I}_2 + 2\,\text{S}_2\text{O}_3^{2-} \longrightarrow 2\,\text{I}^- + \text{S}_4\text{O}_6^{2-}$.
2. a) À l'équivalence $n(\text{I}_2) = \dfrac{n(\text{S}_2\text{O}_3^{2-})}{2}$ : $C_0 = \dfrac{C_rV_r}{2V_0} = \dfrac{0{,}1 \times 25{,}5}{2 \times 50} = \mathbf{0{,}0255}$ **mol/L**.
   b) $M(\text{Na}_2\text{S}_2\text{O}_3) = 2\times23 + 2\times32 + 3\times16 = 158$ g/mol. Pour 1 L à $0{,}1$ mol/L il faut $15{,}8$ g de produit pur ; les cristaux n'en contiennent que 95 % : $m = \dfrac{15{,}8}{0{,}95} \approx \mathbf{16{,}6}$ **g**.`,
  },
  {
    title: 'Bac D 2011 — Chimie : cinétique d’ordre 2 (NOBr), acide méthanoïque',
    statement: R`**Baccalauréat 2011 — Série D — Physique-Chimie, partie CHIMIE (8 points)**

### Exercice 1
La décomposition de NOBr à une température déterminée, selon l'équation $\text{NOBr}_{(g)} \to 2\,\text{NO}_{(g)} + \text{Br}_{2(g)}$ (écrite ainsi dans le sujet), fournit les résultats suivants :

| $t$ (s) | 0 | 6,2 | 10,8 | 14,7 | 20,0 | 24,5 |
|---|---|---|---|---|---|---|
| $[\text{NOBr}]$ (mol/L) | 0,0250 | 0,0198 | 0,0162 | 0,0144 | 0,0125 | 0,0112 |

1. En se servant de ces résultats, déterminer le temps de demi-réaction.
2. Sachant que la réaction est d'ordre deux :
   a) calculer la constante de vitesse de la réaction ;
   b) écrire la loi de vitesse de cette réaction ;
   c) déterminer le temps nécessaire à la disparition de 80 % du réactif, puis calculer la vitesse de disparition du réactif à cette date.

### Exercice 2
On dissout $2{,}3$ g d'acide méthanoïque HCOOH dans l'eau pure de façon à obtenir $500$ mL de solution. Toutes les mesures sont faites à 25 °C. Le pH de cette solution est $2{,}4$.
1. a) Calculer la concentration molaire volumique de la solution.
   b) Montrer que l'acide méthanoïque est un acide faible.
   c) Écrire l'équation de dissociation de l'acide méthanoïque dans l'eau.
2. a) Faire l'inventaire des espèces chimiques présentes dans la solution.
   b) Calculer les concentrations molaires des différentes espèces.
3. a) Calculer le $pK_a$ du couple $\text{HCOOH}/\text{HCOO}^-$.
   b) Le $pK_a$ du couple $\text{CH}_3\text{COOH}/\text{CH}_3\text{COO}^-$ est $4{,}7$. Comparer les forces des acides méthanoïque et éthanoïque.

*Données :* $C = 12$ ; $O = 16$ ; $H = 1$ (g/mol).`,
    solution: R`### Exercice 1
> L'équation du sujet n'est pas équilibrée (on attend $2\,\text{NOBr} \to 2\,\text{NO} + \text{Br}_2$). On suit l'équation telle qu'elle est écrite (coefficient 1 pour NOBr), soit $v = -\frac{d[\text{NOBr}]}{dt}$. Avec l'équation équilibrée et $v = -\frac12\frac{d[\text{NOBr}]}{dt}$, on trouverait $k = 1{,}0$ L·mol⁻¹·s⁻¹ et $v = 2{,}5\times10^{-5}$ mol·L⁻¹·s⁻¹ ; les durées restent les mêmes.

1. $t_{1/2}$ est atteint quand $[\text{NOBr}] = \dfrac{0{,}0250}{2} = 0{,}0125$ mol/L : d'après le tableau, $\mathbf{t_{1/2} = 20{,}0}$ **s**.
2. a) Pour une réaction d'ordre 2 : $\dfrac1{[\text{NOBr}]} - \dfrac1{C_0} = kt$ et $t_{1/2} = \dfrac1{kC_0}$, d'où $k = \dfrac{1}{20 \times 0{,}025} = \mathbf{2{,}0}$ **L·mol⁻¹·s⁻¹** (vérification à $t = 10{,}8$ s : $\frac{1}{0{,}0162} - 40 \approx 21{,}7 = 2 \times 10{,}8$).
   b) $v = -\dfrac{d[\text{NOBr}]}{dt} = k[\text{NOBr}]^2 = 2{,}0\,[\text{NOBr}]^2$.
   c) Il reste 20 % : $C = 0{,}005$ mol/L. $t = \dfrac1k\left(\dfrac1C - \dfrac1{C_0}\right) = \dfrac{200 - 40}{2} = \mathbf{80}$ **s**. À cette date, $v = 2{,}0 \times (0{,}005)^2 = \mathbf{5\times10^{-5}}$ **mol·L⁻¹·s⁻¹**.

### Exercice 2
1. a) $M = 46$ g/mol, $n = \dfrac{2{,}3}{46} = 0{,}05$ mol, $C = \dfrac{0{,}05}{0{,}5} = \mathbf{0{,}1}$ **mol/L**.
   b) $[\text{H}_3\text{O}^+] = 10^{-2{,}4} \approx 4{,}0\times10^{-3}$ mol/L $< C$ : l'acide n'est que partiellement dissocié, il est **faible** (sinon on aurait pH $= -\log 0{,}1 = 1$).
   c) $\text{HCOOH} + \text{H}_2\text{O} \rightleftharpoons \text{HCOO}^- + \text{H}_3\text{O}^+$.
2. a) Espèces : $\text{H}_2\text{O}$, $\text{HCOOH}$, $\text{HCOO}^-$, $\text{H}_3\text{O}^+$, $\text{OH}^-$.
   b) $[\text{H}_3\text{O}^+] \approx 4{,}0\times10^{-3}$ ; $[\text{OH}^-] = \dfrac{10^{-14}}{4{,}0\times10^{-3}} \approx 2{,}5\times10^{-12}$ ; électroneutralité : $[\text{HCOO}^-] \approx [\text{H}_3\text{O}^+] \approx 4{,}0\times10^{-3}$ ; conservation : $[\text{HCOOH}] = 0{,}1 - 0{,}004 = 0{,}096$ mol/L.
3. a) $K_a = \dfrac{[\text{HCOO}^-][\text{H}_3\text{O}^+]}{[\text{HCOOH}]} = \dfrac{(4{,}0\times10^{-3})^2}{0{,}096} \approx 1{,}66\times10^{-4}$, d'où $\mathbf{pK_a \approx 3{,}8}$.
   b) $3{,}8 < 4{,}7$ : l'acide méthanoïque est **plus fort** que l'acide éthanoïque (plus le $pK_a$ est petit, plus l'acide est fort).`,
  },
  {
    title: 'Bac D 2010 — Chimie : niveaux d’énergie de l’hydrogène, dosage d’une eau de Javel',
    statement: R`**Baccalauréat 2010 — Série D — Physique-Chimie, partie CHIMIE (8 points)**

### Exercice 1
On rappelle que les niveaux d'énergie quantifiés de l'atome d'hydrogène sont donnés par $E_n = -\dfrac{E_0}{n^2}$ avec $E_0 = 13{,}6$ eV, $n$ entier positif.
1. a) Déterminer, en joules, l'énergie qu'il faut fournir à un atome d'hydrogène pour le faire passer de l'état fondamental au premier état excité.
   b) Que se passe-t-il si l'atome, dans son état fondamental, reçoit :
   - un photon d'énergie $W = 1{,}83\times10^{-18}$ J ?
   - un électron d'énergie cinétique $E_c = 1{,}83\times10^{-18}$ J ?
2. Définir et calculer l'énergie d'ionisation de l'atome d'hydrogène.
3. On considère la série de Lyman.
   a) Qu'appelle-t-on série de raies ?
   b) L'analyse spectroscopique permet de déceler la radiation de fréquence $\nu = 3{,}8\times10^{15}$ Hz. À quelle transition correspond-elle ?

*Données :* $h = 6{,}62\times10^{-34}$ J·s ; $c = 3\times10^8$ m/s ; $1$ eV $= 1{,}6\times10^{-19}$ J.

### Exercice 2
On dose une eau de Javel à usage domestique. On fait réagir $20$ mL de cette eau de Javel diluée, contenant des ions hypochlorite $\text{ClO}^-$, avec un excès d'ions iodure $\text{I}^-$ ; on acidifie le milieu.
1. Les couples redox en présence sont $\text{ClO}^-/\text{Cl}^-$ et $\text{I}_2/\text{I}^-$. Écrire l'équation bilan de la réaction.
2. On dose le diiode formé par une solution de thiosulfate ($\text{S}_2\text{O}_3^{2-}$) à $0{,}100$ mol/L. L'équivalence est atteinte pour $15{,}2$ mL versés.
   a) Écrire l'équation bilan de la réaction de dosage (couple $\text{S}_4\text{O}_6^{2-}/\text{S}_2\text{O}_3^{2-}$).
   b) Calculer la concentration molaire de l'eau de Javel (diluée) en ions $\text{ClO}^-$.`,
    solution: R`### Exercice 1
1. a) $\Delta E = E_2 - E_1 = 13{,}6\left(1 - \dfrac14\right) = 10{,}2$ eV $= 10{,}2 \times 1{,}6\times10^{-19} \approx \mathbf{1{,}63\times10^{-18}}$ **J**.
   b) $1{,}83\times10^{-18}$ J $\approx 11{,}4$ eV.
   - **Photon** : il n'est absorbé que si son énergie correspond exactement à une transition. Or $E_2 - E_1 = 10{,}2$ eV et $E_3 - E_1 \approx 12{,}1$ eV : aucune transition ne vaut $11{,}4$ eV (et $11{,}4 < 13{,}6$ eV, pas d'ionisation). Le photon **n'est pas absorbé**.
   - **Électron** : il peut céder une partie de son énergie. L'atome passe au niveau 2 (il ne peut pas atteindre le niveau 3, qui demande $12{,}1$ eV) et l'électron repart avec $11{,}4 - 10{,}2 \approx 1{,}2$ eV ($\approx 2\times10^{-19}$ J).
2. L'énergie d'ionisation est l'énergie minimale à fournir à l'atome dans son état fondamental pour lui arracher l'électron : $E_i = E_\infty - E_1 = 13{,}6$ eV $\approx 2{,}18\times10^{-18}$ J.
3. a) Une série de raies est l'ensemble des radiations émises lorsque l'atome se désexcite vers un **même niveau** ; pour la série de Lyman, ce niveau est $n = 1$.
   b) $E = h\nu = 6{,}62\times10^{-34} \times 3{,}8\times10^{15} \approx 2{,}52\times10^{-18}$ J $\approx 15{,}7$ eV.
   ⚠️ Cette valeur dépasse $13{,}6$ eV, limite de la série de Lyman ($\nu_{\max} \approx 3{,}29\times10^{15}$ Hz) : la fréquence imprimée dans le sujet est vraisemblablement une coquille pour $3{,}08\times10^{15}$ Hz. Avec cette valeur : $E \approx 2{,}04\times10^{-18}$ J $\approx 12{,}75$ eV $= 13{,}6\left(1 - \dfrac1{n^2}\right) \Rightarrow n^2 = 16$ : transition du niveau **$n = 4$ vers $n = 1$**.

### Exercice 2
1. $\text{ClO}^- + 2\,\text{H}^+ + 2e^- \to \text{Cl}^- + \text{H}_2\text{O}$ et $2\,\text{I}^- \to \text{I}_2 + 2e^-$ :
$$\text{ClO}^- + 2\,\text{I}^- + 2\,\text{H}^+ \longrightarrow \text{Cl}^- + \text{I}_2 + \text{H}_2\text{O}$$
2. a) $\text{I}_2 + 2\,\text{S}_2\text{O}_3^{2-} \longrightarrow 2\,\text{I}^- + \text{S}_4\text{O}_6^{2-}$.
   b) $n(\text{S}_2\text{O}_3^{2-}) = 0{,}100 \times 15{,}2\times10^{-3} = 1{,}52\times10^{-3}$ mol ; $n(\text{I}_2) = 7{,}6\times10^{-4}$ mol $= n(\text{ClO}^-)$.
   $[\text{ClO}^-] = \dfrac{7{,}6\times10^{-4}}{0{,}020} = \mathbf{3{,}8\times10^{-2}}$ **mol/L**.`,
  },
]

export const PHYSIQUE = [
  {
    title: 'Bac D 2014 — Physique : vrai-faux, interférences à la surface de l’eau, satellite géostationnaire',
    statement: R`**Baccalauréat 2014 — Série D — Physique-Chimie, partie PHYSIQUE (12 points)**

### Partie A : vérification des connaissances
1. **Vrai ou faux.**
   a) Un mouvement s'effectuant à une vitesse $v$ constante peut être circulaire ou rectiligne.
   b) Si un solide n'est ni isolé, ni pseudo-isolé, le vecteur accélération de son centre d'inertie n'est pas nul.
   c) Deux vibrations de périodes différentes ne peuvent pas interférer.
   d) L'énergie mécanique d'un système conservatif varie au cours du mouvement.
2. **Schéma à faire.** Une particule $\alpha$ ($\text{He}^{2+}$) arrive avec une vitesse $\vec V_0$ (horizontale) en un point O d'un espace champ électrique créé par deux plaques horizontales A (en bas) et B (en haut) telles que $V_B - V_A > 0$. Reproduis le schéma et représente le vecteur champ $\vec E$ et la force électrique $\vec F$ qui s'exerce sur la particule.
3. **Réarrangement.** Réécris la phrase pour définir une grandeur : « une période / parcourue / la longueur d'onde / la distance / est / par l'onde en ».

### Partie B : application des connaissances
Deux pointes $S_1$ et $S_2$ distantes de $8$ cm produisent à la surface d'une nappe d'eau des vibrations sinusoïdales d'amplitude $a = 2$ mm. Les ondes se propagent à la célérité $v = 1{,}5$ m/s.
1. La distance entre deux points consécutifs d'amplitude maximale (sur le segment $S_1S_2$) vaut $D = 1$ cm. Détermine la longueur d'onde et la fréquence des vibrations.
2. Les équations horaires de $S_1$ et $S_2$ sont $y_{S_1}(t) = y_{S_2}(t) = a\sin(2\pi N t)$.
   a) Établis l'équation horaire du mouvement d'un point M situé à la distance $d_1$ de $S_1$ et $d_2$ de $S_2$.
   b) Détermine l'élongation de M pour $d_1 = 4$ cm et $d_2 = 7$ cm.

### Partie C : résolution d'un problème
Un satellite doit être placé à une altitude $h$ afin de paraître immobile pour un observateur terrestre (satellite géostationnaire).
1. Le satellite, assimilé à un point matériel de masse $m$, décrit un mouvement circulaire uniforme à l'altitude $h$. Établis, en fonction de $g_0$, $R$ et $h$ :
   a) la vitesse linéaire du satellite ;
   b) sa période de révolution.
2. a) Quelle est la valeur de la période (en secondes) pour que le satellite soit géostationnaire ?
   b) À quelle altitude $h$ doit-on alors placer ce satellite ?

*Données :* $g_h = g_0\dfrac{R^2}{(R+h)^2}$ ; $R = 6\,400$ km ; $g_0 = 9{,}8$ m/s².`,
    solution: R`### Partie A
1. a) **Vrai** (vitesse de norme constante : mouvement uniforme, rectiligne ou circulaire). b) **Vrai** : $\sum \vec F \neq \vec 0$ donc $\vec a_G \neq \vec 0$. c) **Vrai** : pour interférer, les sources doivent être synchrones (même fréquence) et cohérentes. d) **Faux** : elle se conserve.
2. $\vec E$ est dirigé vers les potentiels décroissants : de B vers A (vers le bas). La particule $\alpha$ est positive : $\vec F = 2e\,\vec E$ a le même sens que $\vec E$, vers la plaque A.
3. « La longueur d'onde est la distance parcourue par l'onde en une période. »

### Partie B
1. Sur $S_1S_2$, deux maxima consécutifs sont distants de $\dfrac\lambda2$ : $\lambda = 2D = \mathbf{2}$ **cm**, puis $N = \dfrac{v}{\lambda} = \dfrac{1{,}5}{0{,}02} = \mathbf{75}$ **Hz**.
2. a) Chaque onde arrive en M avec un retard $\dfrac{d_i}{v}$ :
$$y_M = a\sin\!\left(2\pi N t - \frac{2\pi d_1}{\lambda}\right) + a\sin\!\left(2\pi N t - \frac{2\pi d_2}{\lambda}\right) = 2a\cos\!\left(\frac{\pi(d_2 - d_1)}{\lambda}\right)\sin\!\left(2\pi N t - \frac{\pi(d_1 + d_2)}{\lambda}\right)$$
   b) $d_2 - d_1 = 3$ cm $= 1{,}5\,\lambda$ : $\cos(1{,}5\pi) = 0$, donc $y_M(t) = 0$ : M est **immobile** (frange d'amplitude nulle).

### Partie C
1. Le satellite n'est soumis qu'à son poids $m\vec g_h$, centripète. Mouvement circulaire uniforme : $m\dfrac{v^2}{R+h} = mg_0\dfrac{R^2}{(R+h)^2}$.
   a) $v = R\sqrt{\dfrac{g_0}{R+h}}$.
   b) $T = \dfrac{2\pi(R+h)}{v} = \dfrac{2\pi}{R}\sqrt{\dfrac{(R+h)^3}{g_0}}$.
2. a) Le satellite doit tourner avec la Terre, dans le même sens : $T$ = durée d'un tour de la Terre sur elle-même, soit le jour sidéral $T \approx 86\,164$ s (on prend souvent $24$ h $= 86\,400$ s).
   b) $(R+h)^3 = \dfrac{g_0R^2T^2}{4\pi^2} \approx \dfrac{9{,}8 \times (6{,}4\times10^6)^2 \times (86\,164)^2}{4\pi^2} \approx 7{,}55\times10^{22}$ m³, d'où $R + h \approx 4{,}23\times10^7$ m et $h \approx \mathbf{3{,}6\times10^4}$ **km** (environ 35 900 km).`,
  },
  {
    title: 'Bac D 2013 — Physique : pendule pesant, onde à la surface de l’eau, effet photoélectrique',
    statement: R`**Baccalauréat 2013 — Série D — Physique-Chimie, partie PHYSIQUE (12 points)**

### Exercice 1 (Oscillations mécaniques)
Une tige homogène OA de longueur $L = 1$ m et de masse $m = 100$ g peut osciller sans frottement autour d'un axe horizontal $(\Delta)$ passant par son extrémité supérieure O. On fixe à l'autre extrémité A une masse ponctuelle $m_A = \dfrac{3m}{2}$. Le pendule est écarté de sa position d'équilibre d'un angle $\theta_0 = 0{,}15$ rad, puis abandonné sans vitesse initiale.
1. Soit G le centre d'inertie du système.
   a) Montrer que $OG = \dfrac{4L}{5}$.
   b) Calculer le moment d'inertie $J_\Delta$ du système par rapport à $(\Delta)$.
2. a) En utilisant la méthode énergétique, déterminer la nature du mouvement pour des oscillations de faible amplitude.
   b) Écrire l'équation horaire du mouvement en prenant pour origine des temps l'instant où on l'abandonne.

### Exercice 2 (Onde progressive)
Une pointe frappe la surface d'une nappe d'eau en un point S. Elle a un mouvement rectiligne sinusoïdal de fréquence $N = 50$ Hz et d'amplitude $a = 3$ mm.
1. Établir l'équation horaire du mouvement de S, sachant qu'à $t = 0$, S est à son élongation maximale positive.
2. La nappe est le siège d'une onde progressive sinusoïdale transversale de longueur d'onde $\lambda = 2$ cm.
   a) Calculer la célérité des ondes.
   b) Établir l'équation horaire $y_M(t)$ d'un point M situé à $x = 8{,}5$ cm de S.
   c) Comparer les mouvements de S et de M.
   d) Représenter dans un même système d'axes les courbes $y_S(t)$ et $y_M(t)$.

### Exercice 3 (Effet photoélectrique)
On éclaire une cellule photoélectrique au césium successivement avec deux radiations de longueurs d'onde $\lambda_1 = 410$ nm et $\lambda_2 = 740$ nm.
1. La longueur d'onde seuil du césium est $\lambda_0 = 660$ nm.
   a) Définir la longueur d'onde seuil.
   b) Laquelle des deux radiations provoque l'émission d'électrons ?
2. Pour cette radiation, calculer en eV l'énergie cinétique maximale d'un électron émis par la cathode.
3. On établit entre l'anode et la cathode une tension variable $U_{AC}$ et on relève l'intensité. La caractéristique $I = f(U_{AC})$ s'annule pour $U_{AC} = -1{,}15$ V et présente un palier à $I = 1{,}2$ µA.
   a) Que signifient les nombres $-1{,}15$ V et $1{,}2$ µA ?
   b) Calculer la tension $U_{AC}$ pour laquelle les électrons arrivent à l'anode à la vitesse $V_A = 2\,000$ km/s.
   c) Au courant de saturation, déterminer le nombre d'électrons émis par la cathode en $16$ s.

*Données :* $h = 6{,}62\times10^{-34}$ J·s ; $c = 3\times10^8$ m/s ; $e = 1{,}6\times10^{-19}$ C ; $m_e = 9{,}1\times10^{-31}$ kg ; $g = 9{,}8$ m/s².`,
    solution: R`### Exercice 1
1. a) Barycentre : la tige a son centre en $\dfrac L2$, la masse $\dfrac{3m}{2}$ est en $L$ :
$$OG = \frac{m\cdot\frac L2 + \frac{3m}{2}\cdot L}{m + \frac{3m}{2}} = \frac{2mL}{\frac{5m}{2}} = \frac{4L}{5} = 0{,}8 \text{ m}.$$
   b) $J_\Delta = \dfrac{mL^2}{3} + \dfrac{3m}{2}L^2 = \dfrac{11}{6}mL^2 = \dfrac{11}{6}\times 0{,}1 \times 1^2 \approx \mathbf{0{,}183}$ **kg·m²**.
2. a) Masse totale $M = \dfrac{5m}{2} = 0{,}25$ kg. Sans frottement, l'énergie mécanique se conserve :
$E = \tfrac12 J_\Delta\dot\theta^2 + Mg\,OG(1 - \cos\theta) \approx \tfrac12 J_\Delta\dot\theta^2 + \tfrac12 Mg\,OG\,\theta^2$ (petits angles).
$\dfrac{dE}{dt} = 0 \Rightarrow \dot\theta\left(J_\Delta\ddot\theta + Mg\,OG\,\theta\right) = 0 \Rightarrow \ddot\theta + \dfrac{Mg\,OG}{J_\Delta}\theta = 0$ : mouvement **sinusoïdal** de pulsation $\omega_0 = \sqrt{\dfrac{0{,}25 \times 9{,}8 \times 0{,}8}{0{,}183}} \approx 3{,}27$ rad/s ($T_0 \approx 1{,}92$ s).
   b) À $t = 0$, $\theta = \theta_0$ et $\dot\theta = 0$ : $\theta(t) = 0{,}15\cos(3{,}27\,t)$ (rad).

### Exercice 2
1. $y_S(t) = a\cos(2\pi N t) = 3\times10^{-3}\cos(100\pi t)$ (m).
2. a) $c = \lambda N = 0{,}02 \times 50 = \mathbf{1}$ **m/s**.
   b) M reproduit le mouvement de S avec le retard $\theta = \dfrac xc = 0{,}085$ s : $y_M(t) = 3\times10^{-3}\cos\!\left(100\pi t - \dfrac{2\pi x}{\lambda}\right)$ pour $t \geq 0{,}085$ s. Avec $\dfrac x\lambda = 4{,}25$ : $\dfrac{2\pi x}\lambda = 8{,}5\pi \equiv \dfrac\pi2 \;[2\pi]$, soit $y_M(t) = 3\times10^{-3}\cos\!\left(100\pi t - \dfrac\pi2\right) = 3\times10^{-3}\sin(100\pi t)$.
   c) M vibre **en quadrature retard** sur S (déphasage $\dfrac\pi2$).
   d) Deux sinusoïdes de même amplitude ($3$ mm) et même période ($0{,}02$ s), décalées d'un quart de période ; $y_M$ est nulle avant $t = 0{,}085$ s.

### Exercice 3
1. a) La longueur d'onde seuil $\lambda_0$ est la plus grande longueur d'onde capable d'extraire des électrons du métal ($\dfrac{hc}{\lambda_0}$ = travail d'extraction $W_0$).
   b) Il faut $\lambda \leq \lambda_0$ : seule $\lambda_1 = 410$ nm provoque l'émission.
2. $E_{c\max} = hc\left(\dfrac1{\lambda_1} - \dfrac1{\lambda_0}\right) = 6{,}62\times10^{-34}\times3\times10^8\left(\dfrac{1}{410\times10^{-9}} - \dfrac{1}{660\times10^{-9}}\right) \approx 1{,}83\times10^{-19}$ J $\approx \mathbf{1{,}15}$ **eV**.
3. a) $-1{,}15$ V est le **potentiel d'arrêt** $U_0$ : $eU_0 = E_{c\max}$ (cohérent avec la question 2). $1{,}2$ µA est l'**intensité du courant de saturation** : tous les électrons émis atteignent l'anode.
   b) Théorème de l'énergie cinétique entre C et A : $\tfrac12 m_eV_A^2 - E_{c\max} = eU_{AC}$. $\tfrac12 \times 9{,}1\times10^{-31} \times (2\times10^6)^2 = 1{,}82\times10^{-18}$ J $\approx 11{,}4$ eV, d'où $U_{AC} \approx 11{,}4 - 1{,}15 \approx \mathbf{10{,}2}$ **V**.
   c) $N = \dfrac{I_s\,t}{e} = \dfrac{1{,}2\times10^{-6} \times 16}{1{,}6\times10^{-19}} = \mathbf{1{,}2\times10^{14}}$ électrons.`,
  },
  {
    title: 'Bac D 2012 — Physique : chariot (énergie cinétique), propagation sur une corde, dipôles R, (r, L), C',
    statement: R`**Baccalauréat 2012 — Série D — Physique-Chimie, partie PHYSIQUE (12 points)**

### Exercice 1 (Dynamique)
Partant du repos en A, un ouvrier pousse un chariot de masse $m = 60$ kg sur une distance AB horizontale en exerçant une force $\vec F$ horizontale constante. Ensuite, grâce à l'énergie cinétique acquise en B, le chariot monte un plan incliné BC d'angle $\alpha$ avec l'horizontale. Les forces de frottement ont, sur tout le trajet ABC, une intensité constante égale à $\dfrac{P}{20}$ ($P$ : poids du chariot).
1. En appliquant le théorème de l'énergie cinétique :
   a) exprimer la vitesse $V_B$ du chariot en B en fonction de $F$, $m$, $l$ et $g$ ;
   b) exprimer la vitesse $V_C$ en C en fonction de $V_B$, $g$, $BC$ et $\alpha$, puis en fonction de $F$, $m$, $g$, $l$, $BC$ et $\alpha$.
2. Déterminer la valeur de $F$ pour que le chariot atteigne le point C avec une vitesse nulle.

*Données :* $AB = l = 30$ m ; $BC = 6$ m ; $\alpha = 25°$ ; $g = 10$ m/s².

### Exercice 2 (Propagation)
1. Un point A est animé d'un mouvement sinusoïdal rectiligne vertical de fréquence $50$ Hz et d'amplitude $a = 3$ mm.
   a) En prenant pour origine des temps l'instant où A passe par sa position d'équilibre en allant dans le sens positif, donner l'expression de $y_A(t)$.
   b) À quel instant l'élongation vaut-elle $1{,}5$ mm, A se déplaçant dans le sens positif ?
2. A est l'extrémité d'un vibreur lié à une corde tendue de masse linéique $\mu = 2{,}5\times10^{-3}$ kg/m. Les vibrations se propagent le long de la corde à la vitesse $v = 20$ m/s.
   a) Calculer la tension de la corde.
   b) Quelle est la longueur d'onde des vibrations ?

### Exercice 3 (Courant alternatif)
On considère trois dipôles : $D_1$ conducteur ohmique de résistance $R$ ; $D_2$ bobine de résistance $r$ et d'inductance $L$ ; $D_3$ condensateur de capacité $C$.
- Expérience 1 : on applique une tension continue $U_C = 9$ V et on mesure l'intensité $I_C$.
- Expérience 2 : on applique une tension sinusoïdale de valeur efficace $U_e = 12$ V et de fréquence $f = 50$ Hz et on mesure l'intensité efficace $I_e$.

| Dipôle | $I_C$ (A) | $I_e$ (A) | $U_C/I_C$ | $U_e/I_e$ |
|---|---|---|---|---|
| $D_1$ | 1,875 | 2,5 | | |
| $D_2$ | 3,6 | 3,2 | | |
| $D_3$ | 0,0 | $5\times10^{-3}$ | | |

1. Compléter le tableau.
2. Déterminer $R$, $r$, $L$ et $C$.
3. On associe les trois dipôles en série, alimentés par un générateur de tension efficace constante et de fréquence réglable. Pour quelle fréquence l'intensité efficace est-elle maximale ?`,
    solution: R`### Exercice 1
Frottements : $f = \dfrac{mg}{20} = 30$ N.
1. a) Sur AB (horizontal, poids et réaction normale ne travaillent pas) : $\tfrac12 mV_B^2 - 0 = (F - f)\,l$, d'où
$$V_B = \sqrt{\frac{2l}{m}\left(F - \frac{mg}{20}\right)}.$$
   b) Sur BC, le poids travaille : $W = -mg\,BC\sin\alpha$, et $W(\vec f) = -\dfrac{mg}{20}BC$ :
$$V_C^2 = V_B^2 - 2g\,BC\left(\sin\alpha + \frac1{20}\right) = \frac{2l}{m}\left(F - \frac{mg}{20}\right) - 2g\,BC\left(\sin\alpha + \frac1{20}\right).$$
2. $V_C = 0 \iff F = \dfrac{mg}{20} + \dfrac{mg\,BC}{l}\left(\sin\alpha + \dfrac1{20}\right) = 30 + \dfrac{600 \times 6}{30}(0{,}423 + 0{,}05) \approx 30 + 56{,}7 = \mathbf{86{,}7}$ **N**.

### Exercice 2
1. a) $y_A(t) = 3\times10^{-3}\sin(100\pi t)$ (m) : à $t = 0$, $y_A = 0$ et la vitesse est positive.
   b) $\sin(100\pi t) = \dfrac12$ avec une vitesse positive ($\cos > 0$) : $100\pi t = \dfrac\pi6 + 2k\pi$, soit $t = \dfrac{1}{600} + \dfrac{k}{50}$ s. Première fois : $t \approx \mathbf{1{,}67}$ **ms**.
2. a) $v = \sqrt{\dfrac T\mu} \Rightarrow T = \mu v^2 = 2{,}5\times10^{-3} \times 20^2 = \mathbf{1}$ **N**.
   b) $\lambda = \dfrac vf = \dfrac{20}{50} = \mathbf{0{,}40}$ **m**.

### Exercice 3
1. $D_1$ : $U_C/I_C = 4{,}8\;\Omega$ et $U_e/I_e = 4{,}8\;\Omega$. $D_2$ : $2{,}5\;\Omega$ et $3{,}75\;\Omega$. $D_3$ : $U_C/I_C$ infini (le condensateur bloque le courant continu) et $U_e/I_e = 2\,400\;\Omega$.
2. - $R = 4{,}8\;\Omega$ (même valeur en continu et en alternatif).
   - En continu, la bobine se comporte comme sa résistance : $r = 2{,}5\;\Omega$. En alternatif : $Z_2 = \sqrt{r^2 + (L\omega)^2} = 3{,}75\;\Omega$, d'où $L\omega = \sqrt{3{,}75^2 - 2{,}5^2} \approx 2{,}80\;\Omega$ et $L = \dfrac{2{,}80}{100\pi} \approx \mathbf{8{,}9\times10^{-3}}$ **H**.
   - $Z_3 = \dfrac1{C\omega} = 2\,400\;\Omega \Rightarrow C = \dfrac{1}{2\,400 \times 100\pi} \approx \mathbf{1{,}33\times10^{-6}}$ **F**.
3. L'intensité est maximale à la **résonance** ($L\omega = \dfrac1{C\omega}$) : $f_0 = \dfrac{1}{2\pi\sqrt{LC}} = \dfrac{1}{2\pi\sqrt{8{,}9\times10^{-3} \times 1{,}33\times10^{-6}}} \approx \mathbf{1{,}47\times10^3}$ **Hz**.`,
  },
  {
    title: 'Bac D 2011 — Physique : pendule élastique vertical, onde sur une corde, circuit (R, C) en alternatif',
    statement: R`**Baccalauréat 2011 — Série D — Physique-Chimie, partie PHYSIQUE (12 points)**

### Exercice 1
Un ressort de masse négligeable, de raideur $k = 26$ N/m, est suspendu verticalement à une potence. À son autre extrémité, on fixe un solide (S) de masse $m$ ; le ressort s'allonge de $\Delta l_0$.
1. Écrire la relation donnant $\Delta l_0$ à l'équilibre en fonction de $k$, $m$ et $g$.
2. Le solide est écarté de sa position d'équilibre de $3$ cm vers le bas, puis lâché sans vitesse initiale à $t = 0$. La période des oscillations libres est $T = 0{,}52$ s.
   a) Établir l'équation différentielle du mouvement de (S).
   b) Déterminer la masse du solide.
3. Déterminer l'équation horaire du mouvement de (S).
4. Trouver la vitesse de (S) au premier passage par la position d'équilibre.

*Donnée :* $g = 10$ m/s².

### Exercice 2
L'extrémité A d'une corde élastique est animée d'un mouvement vibratoire d'élongation $y_A = 4\times10^{-2}\sin(20\pi t)$ (en m).
1. Déterminer l'amplitude, la période, la fréquence et la phase initiale du mouvement de A.
2. La célérité de l'onde est $c = 2{,}5$ m/s. Déterminer :
   a) la longueur d'onde ;
   b) l'équation horaire d'un point M de la corde situé à $d = 62{,}5$ cm de A ;
   c) représenter le graphe du mouvement de M.
3. On considère un point N situé à $93{,}75$ cm de A. Comparer les mouvements de M et de N à celui de A.

### Exercice 3
1. Un conducteur ohmique de résistance $R = 20\;\Omega$ est parcouru par un courant sinusoïdal de fréquence $N = 50$ Hz, d'intensité $i(t) = 2\sqrt2\cos(\omega t)$. Donner l'expression de la tension à ses bornes.
2. On monte en série avec ce conducteur un condensateur de capacité $C = 2\times10^{-4}$ F ; l'ensemble est parcouru par le même courant.
   a) Faire le schéma du circuit.
   b) Calculer l'impédance du circuit.
   c) Déterminer le déphasage de la tension aux bornes de l'ensemble par rapport à l'intensité.
   d) Établir l'expression de la tension instantanée $u(t)$.
3. Calculer la puissance moyenne consommée dans le circuit.`,
    solution: R`### Exercice 1
1. À l'équilibre, $m\vec g + \vec T = \vec 0$ : $k\,\Delta l_0 = mg$, soit $\Delta l_0 = \dfrac{mg}{k}$.
2. a) Axe vertical orienté vers le bas, origine à l'équilibre, $x$ l'écart. $\sum\vec F = m\vec a$ : $mg - k(\Delta l_0 + x) = m\ddot x$, et avec $k\Delta l_0 = mg$ :
$$\ddot x + \frac km x = 0.$$
   b) $T = 2\pi\sqrt{\dfrac mk} \Rightarrow m = \dfrac{kT^2}{4\pi^2} = \dfrac{26 \times 0{,}52^2}{4\pi^2} \approx \mathbf{0{,}178}$ **kg**.
3. $\omega_0 = \dfrac{2\pi}{T} \approx 12{,}1$ rad/s. Avec $x(0) = +0{,}03$ m et $\dot x(0) = 0$ : $x(t) = 0{,}03\cos(12{,}1\,t)$ (m).
4. Au passage par l'équilibre, la vitesse est maximale : $v = X_m\omega_0 = 0{,}03 \times 12{,}1 \approx \mathbf{0{,}36}$ **m/s** (dirigée vers le haut au premier passage).

### Exercice 2
1. Amplitude $4$ cm ; $\omega = 20\pi$ rad/s, d'où $N = 10$ Hz et $T = 0{,}1$ s ; phase initiale nulle.
2. a) $\lambda = \dfrac cN = \dfrac{2{,}5}{10} = \mathbf{0{,}25}$ **m**.
   b) M reproduit le mouvement de A avec le retard $\theta = \dfrac dc = 0{,}25$ s : pour $t \geq 0{,}25$ s,
$y_M = 4\times10^{-2}\sin\!\left(20\pi t - \dfrac{2\pi d}{\lambda}\right) = 4\times10^{-2}\sin(20\pi t - 5\pi) = -4\times10^{-2}\sin(20\pi t)$ ; $y_M = 0$ avant.
   c) Graphe : nul jusqu'à $t = 0{,}25$ s, puis sinusoïde d'amplitude $4$ cm, de période $0{,}1$ s, de signe opposé à celle de A.
3. $\dfrac{d_M}{\lambda} = 2{,}5$ : M vibre en **opposition de phase** avec A. $\dfrac{d_N}{\lambda} = 3{,}75$ : le déphasage $7{,}5\pi \equiv \dfrac{\pi}{2}$ (modulo $2\pi$) : N vibre en **quadrature** avec A ($y_N = 4\times10^{-2}\cos(20\pi t)$ pour $t \geq 0{,}375$ s).

### Exercice 3
1. $u_R = Ri = 40\sqrt2\cos(100\pi t)$ (V).
2. a) Schéma : générateur alternatif, conducteur ohmique et condensateur en série (ampèremètre en série, voltmètre aux bornes de l'ensemble).
   b) $X_C = \dfrac1{C\omega} = \dfrac{1}{2\times10^{-4}\times100\pi} \approx 15{,}9\;\Omega$ ; $Z = \sqrt{R^2 + X_C^2} = \sqrt{400 + 253} \approx \mathbf{25{,}6\;\Omega}$.
   c) $\tan\varphi = -\dfrac{X_C}{R} \approx -0{,}80$ : $\varphi \approx -38{,}5° \approx -0{,}67$ rad (la tension est **en retard** sur l'intensité).
   d) $U_m = Z I_m = 25{,}6 \times 2\sqrt2 \approx 72{,}3$ V : $u(t) \approx 72{,}3\cos(100\pi t - 0{,}67)$ (V).
3. $P = RI^2 = 20 \times 2^2 = \mathbf{80}$ **W** (seule la résistance consomme de la puissance ; aussi $P = UI\cos\varphi$).`,
  },
  {
    title: 'Bac D 2010 — Physique : proton dans un champ électrostatique, pendule simple',
    statement: R`**Baccalauréat 2010 — Série D — Physique-Chimie, partie PHYSIQUE (12 points)**

### Exercice 1
Un proton animé d'une vitesse horizontale $\vec V_0$ entre dans un champ électrostatique uniforme $\vec E$, créé entre deux plaques horizontales A (en haut) et B (en bas), par un point O situé à égale distance des plaques. La tension entre les plaques est $U = 400$ V. On néglige le poids du proton. Le champ $\vec E$ est vertical, dirigé vers le bas. Un écran vertical est placé à droite des plaques.
1. Sur un schéma clair :
   a) indiquer les signes des plaques en justifiant ;
   b) représenter la force électrostatique $\vec F$ qui s'exerce sur le proton.
2. a) Établir les équations horaires du mouvement du proton dans le repère $(O, x, y)$ ($x$ horizontal dans le sens de $\vec V_0$, $y$ vertical vers le haut).
   b) En déduire l'équation de la trajectoire entre les plaques.
3. Le proton sort du champ par le point S d'ordonnée $y_S = -0{,}96$ mm.
   a) Déterminer $V_0$.
   b) Quelle est la nature du mouvement à l'extérieur des plaques ?
4. L'écran est à la distance $D = 30$ cm du milieu des plaques. Déterminer les coordonnées du point d'impact M du proton sur l'écran.

*Données :* $d = 20$ cm (distance entre les plaques) ; $L = 10$ cm (longueur des plaques) ; $m_p = 1{,}67\times10^{-27}$ kg ; $q_p = +e$ ; $e = 1{,}6\times10^{-19}$ C.

### Exercice 2
Un pendule simple est constitué d'un fil inextensible de masse négligeable, de longueur $l$, et d'un solide ponctuel de masse $m = 100$ g ; l'extrémité libre du fil est fixée en O. Le pendule effectue des oscillations de faible amplitude, de période $T = 2$ s.
1. Calculer :
   a) la longueur du fil ;
   b) l'incertitude absolue sur cette longueur, sachant que $g = 9{,}80 \pm 0{,}01$ m/s² et que la période est mesurée à $0{,}02$ s près.
2. On écarte le pendule d'un angle de $60°$ et on l'abandonne sans vitesse initiale. Déterminer :
   a) par le théorème de l'énergie cinétique, la vitesse du solide quand il passe par la position $\theta = 45°$ ;
   b) la tension du fil à cette position.
3. Calculer l'énergie cinétique du solide lorsqu'il passe par la position verticale.

*On prendra $g = 9{,}8$ m/s² pour les questions 2 et 3.*`,
    solution: R`### Exercice 1
1. a) Le proton (charge positive) est dévié vers le bas ($y_S < 0$) : $\vec F = e\vec E$ est vers le bas, donc $\vec E$ aussi. Le champ va de la plaque positive vers la plaque négative : **A est positive, B négative**.
   b) $\vec F$ : verticale, vers le bas (vers B), de norme $F = eE$.
2. a) $E = \dfrac Ud = \dfrac{400}{0{,}20} = 2\,000$ V/m. Accélération : $a = \dfrac{eE}{m_p} = \dfrac{1{,}6\times10^{-19}\times2\,000}{1{,}67\times10^{-27}} \approx 1{,}92\times10^{11}$ m/s², dirigée vers le bas.
   $x(t) = V_0t$ et $y(t) = -\tfrac12\,a\,t^2$.
   b) $t = \dfrac{x}{V_0}$ : $y = -\dfrac{eE}{2m_pV_0^2}x^2$ (arc de parabole).
3. a) En S, $x = L$ : $|y_S| = \dfrac{aL^2}{2V_0^2}$, d'où $V_0 = L\sqrt{\dfrac{a}{2|y_S|}} = 0{,}10\sqrt{\dfrac{1{,}92\times10^{11}}{2\times0{,}96\times10^{-3}}} \approx \mathbf{1{,}0\times10^{6}}$ **m/s**.
   b) Hors des plaques, le proton n'est soumis à aucune force (poids négligé) : mouvement **rectiligne uniforme**, selon la tangente en S.
4. La tangente en S passe par le milieu I des plaques ($x = \dfrac L2$) ; sa pente est $\dfrac{|y_S|}{L/2} = \dfrac{2|y_S|}{L}$. Sur l'écran : $|y_M| = D\cdot\dfrac{2|y_S|}{L} = 0{,}30 \times \dfrac{2\times0{,}96\times10^{-3}}{0{,}10} \approx 5{,}76\times10^{-3}$ m.
   **M** a pour coordonnées $x_M = \dfrac L2 + D = 35$ cm et $y_M \approx -5{,}76$ mm.

### Exercice 2
1. a) $T = 2\pi\sqrt{\dfrac lg} \Rightarrow l = \dfrac{gT^2}{4\pi^2} = \dfrac{9{,}80\times4}{4\pi^2} \approx \mathbf{0{,}993}$ **m**.
   b) $\dfrac{\Delta l}{l} = \dfrac{\Delta g}{g} + 2\dfrac{\Delta T}{T} = \dfrac{0{,}01}{9{,}80} + 2\times\dfrac{0{,}02}{2} \approx 0{,}021$, d'où $\Delta l \approx 0{,}021$ m : $l = 0{,}99 \pm 0{,}02$ m.
2. a) Entre $\theta_0 = 60°$ et $\theta = 45°$, seul le poids travaille (la tension est perpendiculaire au déplacement) :
$\tfrac12 mv^2 = mgl(\cos\theta - \cos\theta_0)$, d'où $v = \sqrt{2gl(\cos45° - \cos60°)} = \sqrt{2\times9{,}8\times0{,}993\times0{,}207} \approx \mathbf{2{,}0}$ **m/s**.
   b) Projection de $\sum\vec F = m\vec a$ sur la normale (vers O) : $T - mg\cos\theta = m\dfrac{v^2}{l}$, d'où $T = mg(3\cos\theta - 2\cos\theta_0) = 0{,}98\,(2{,}121 - 1) \approx \mathbf{1{,}10}$ **N**.
3. $E_c = mgl(1 - \cos60°) = 0{,}1\times9{,}8\times0{,}993\times0{,}5 \approx \mathbf{0{,}49}$ **J**.`,
  },
]
