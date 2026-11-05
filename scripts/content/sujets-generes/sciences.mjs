// Sujets inédits Cognix — SCIENCES PHYSIQUES (parties chimie et physique, séries C et D)
// et SVT série D (26/10/2026). Même structure que les bacs blancs zonaux de mai 2026
// (`inspiredBy`), questions posées autrement. Valeurs numériques recalculées.
const R = String.raw

const CHAPTER = 'Sujets type bac inédits (Cognix)'
const DESCRIPTION = 'Sujets complets créés sur le modèle des sujets officiels : mêmes notions, questions posées autrement. Pour les simulations de la Prépa.'

const chimie1 = {
  title: 'Sujet Cognix n°1 — Chimie séries C-D : atome d’hydrogène, appariement, synthèse de l’éthanoate de propyle',
  inspiredBy: {
    bac_d: 'Bac blanc zonal mai 2026 (zone 5, Bouenza-Lékoumou) — Chimie série D : rayonnement γ, appariement, synthèse de l’éthanoate de butyle',
    bac_c: 'Bac blanc zonal mai 2026 (zone 3, Owando) — Chimie série C : QCM, dichromate et éthanal, cinétique de l’eau oxygénée',
  },
  exam: { exam_kind: 'bac_blanc', duration_min: 90, bareme: [
    { label: 'Partie A : vérification des connaissances', points: 4 }, { label: 'Partie B : application des connaissances', points: 4 },
  ] },
  statement: R`**Sujet type bac inédit (Cognix) — Sciences physiques, séries C et D — Partie CHIMIE (8 points)**

### Partie A : vérification des connaissances (4 points)
1. **Question à réponse construite.** Définis l'énergie d'ionisation de l'atome d'hydrogène et donne sa valeur en électronvolts.
2. **Texte à trous.** Complète par quatre des cinq mots : émission, niveau, photon, supérieure, absorption.
« Lorsque l'électron de l'atome d'hydrogène passe d'un niveau d'énergie ……… à un ……… d'énergie inférieure, l'atome libère un ……… : il y a ……… de lumière. »
3. **Appariement.**

| Colonne A | Colonne B |
|---|---|
| A1 : acide fort | B1 : $\text{CH}_3\text{COOH}$ |
| A2 : acide faible | B2 : $\text{p}K_a = 9{,}2$ |
| A3 : couple $\text{NH}_4^+/\text{NH}_3$ | B3 : $\text{HCl}$ |
| A4 : durée au bout de laquelle la moitié du réactif limitant a disparu | B4 : temps de demi-réaction $t_{1/2}$ |

### Partie B : application des connaissances (4 points)
On prépare l'éthanoate de propyle en chauffant à reflux, en présence de quelques gouttes d'acide sulfurique, un mélange de $28{,}6$ cm³ d'acide éthanoïque ($\text{CH}_3\text{COOH}$, masse volumique $1{,}05$ g/cm³) et de $37{,}5$ cm³ de propan-1-ol ($\text{CH}_3\text{-CH}_2\text{-CH}_2\text{-OH}$, masse volumique $0{,}80$ g/cm³).
1. Écris l'équation bilan de la réaction et donne ses caractéristiques.
2. Montre que le mélange initial est équimolaire.
3. Quel est le rôle de l'acide sulfurique ? Modifie-t-il la composition du mélange à l'équilibre ?
4. Une fois l'équilibre atteint, on prélève le dixième du mélange et on dose l'acide restant par une solution d'hydroxyde de sodium de concentration $C_b = 1{,}0$ mol/L : l'équivalence est obtenue pour $V_b = 16{,}7$ mL.
   a) Écris l'équation de la réaction de dosage.
   b) Détermine la composition, en mol, du mélange à l'équilibre.
   c) Calcule le rendement de l'estérification et la constante d'équilibre $K$.

*Données :* $C = 12$ ; $H = 1$ ; $O = 16$ (g/mol).`,
  solution: R`### Partie A
1. L'énergie d'ionisation est l'énergie **minimale** qu'il faut fournir à l'atome d'hydrogène pris dans son **état fondamental** pour lui arracher son électron : $E_i = 13{,}6$ eV.
2. « Lorsque l'électron de l'atome d'hydrogène passe d'un niveau d'énergie **supérieure** à un **niveau** d'énergie inférieure, l'atome libère un **photon** : il y a **émission** de lumière. » (Le mot « absorption » n'est pas utilisé.)
3. A1 = B3 ; A2 = B1 ; A3 = B2 ; A4 = B4.

### Partie B
1. $\text{CH}_3\text{COOH} + \text{CH}_3\text{CH}_2\text{CH}_2\text{OH} \rightleftharpoons \text{CH}_3\text{COOCH}_2\text{CH}_2\text{CH}_3 + \text{H}_2\text{O}$. Réaction lente, limitée (équilibre avec l'hydrolyse) et athermique.
2. $n_{\text{acide}} = \dfrac{1{,}05 \times 28{,}6}{60} \approx 0{,}50$ mol ; $n_{\text{alcool}} = \dfrac{0{,}80 \times 37{,}5}{60} = 0{,}50$ mol : mélange **équimolaire**.
3. L'acide sulfurique est un **catalyseur** : il accélère la réaction (l'équilibre est atteint plus vite) mais ne modifie pas la composition du mélange à l'équilibre.
4. a) $\text{CH}_3\text{COOH} + \text{OH}^- \longrightarrow \text{CH}_3\text{COO}^- + \text{H}_2\text{O}$.
   b) Prélèvement : $n = C_bV_b = 1{,}0 \times 16{,}7\times10^{-3} = 0{,}0167$ mol ; dans tout le mélange : $n_{\text{acide}} = 0{,}167$ mol. Alcool restant : $0{,}167$ mol ; ester formé : $0{,}50 - 0{,}167 = 0{,}333$ mol ; eau : $0{,}333$ mol.
   c) $r = \dfrac{0{,}333}{0{,}50} \approx \mathbf{67}$ **%** (valeur attendue avec un alcool primaire). $K = \dfrac{0{,}333^2}{0{,}167^2} \approx \mathbf{4{,}0}$.`,
}

const physique1 = {
  title: 'Sujet Cognix n°1 — Physique séries C-D : forces électrique et magnétique, pendule simple, onde le long d’une corde',
  inspiredBy: {
    bac_d: 'Bac blanc zonal mai 2026 (zone 5, Bouenza-Lékoumou) — Physique série D : forces électrique et magnétique, pendule, onde le long d’une corde',
    bac_c: 'Bac blanc zonal mai 2026 (zone 3, Owando) — Physique série C : électron dans un champ, ressort en rotation, fentes de Young et lumière blanche',
  },
  exam: { exam_kind: 'bac_blanc', duration_min: 150, bareme: [
    { label: 'Partie A : vérification des connaissances', points: 4 }, { label: 'Partie B : application des connaissances', points: 3 }, { label: 'Partie C : résolution d’un problème', points: 5 },
  ] },
  statement: R`**Sujet type bac inédit (Cognix) — Sciences physiques, séries C et D — Partie PHYSIQUE (12 points)**

### Partie A : vérification des connaissances (4 points)
1. **Direction des forces.** Une particule de charge $q > 0$ passe au point A avec une vitesse $\vec v$ horizontale dirigée vers la droite.
   - Cas 1 : il règne un champ magnétique $\vec B$ perpendiculaire au plan de la feuille, dirigé vers l'avant (⊙). Donne la direction et le sens de la force magnétique $\vec F_m$.
   - Cas 2 : il règne un champ électrique $\vec E$ horizontal dirigé vers la gauche. Donne la direction et le sens de la force électrique $\vec F_e$.
2. **Choix multiples** (une ou plusieurs bonnes réponses).
   2-1. La constante de raideur d'un ressort s'exprime en : a) N·m ; b) N/m ; c) kg·m² ; d) N.
   2-2. Pour de petites oscillations, la période propre d'un pendule simple dépend : a) de la masse ; b) de la longueur du fil ; c) de l'intensité de la pesanteur ; d) de l'amplitude.
   2-3. Dans un mouvement circulaire uniforme, le vecteur accélération est : a) nul ; b) tangent à la trajectoire ; c) dirigé vers le centre.
   2-4. Dans un circuit RLC série à la résonance d'intensité : a) l'impédance est égale à $R$ ; b) l'impédance est maximale ; c) la tension et l'intensité sont en phase.
3. **Vrai ou faux.**
   a) La dynamique étudie les mouvements en relation avec les forces qui les produisent.
   b) Une onde mécanique transporte de la matière.
   c) Dans le vide, tous les corps tombent avec la même accélération.
   d) L'effet photoélectrique met en évidence l'aspect ondulatoire de la lumière.

### Partie B : application des connaissances (3 points)
Un pendule simple est formé d'une bille ponctuelle de masse $m = 100$ g suspendue à un fil inextensible, de masse négligeable, de longueur $l = 0{,}90$ m. On l'écarte de sa position d'équilibre d'un angle $\alpha_m = 60°$ puis on l'abandonne sans vitesse. On prend $g = 9{,}8$ m/s² et on néglige les frottements.
1. Fais le bilan des forces exercées sur la bille et précise celle dont le travail est nul.
2. Exprime la vitesse $V$ de la bille lorsque le fil fait l'angle $\alpha$ avec la verticale, en fonction de $g$, $l$, $\alpha$ et $\alpha_m$.
3. Calcule $V$ pour $\alpha = 30°$ puis au passage par la position d'équilibre.
4. Exprime la tension du fil en fonction de $m$, $g$, $\alpha$ et $\alpha_m$, puis calcule-la pour $\alpha = 30°$ et pour $\alpha = 0$.

### Partie C : résolution d'un problème (5 points)
L'extrémité S d'une longue corde tendue horizontalement est reliée à un vibreur. À $t = 0$, S commence à vibrer ; les vibrations se propagent le long de la corde à la célérité $V = 15$ m/s (on néglige l'amortissement et la réflexion). L'enregistrement du mouvement de S montre que : à $t = 0$, $y_S = 0$ et S part **vers le bas** ; l'amplitude est $3$ mm ; une durée de $0{,}03$ s correspond à une période et demie. Un point M de la corde commence à vibrer avec un retard de sept quarts de période sur S.
1. a) Détermine la période $T$ et la longueur d'onde $\lambda$.
   b) Établis l'équation horaire $y_S(t)$ du mouvement de S.
2. a) Calcule le retard $\theta$ de M sur S et la distance $x = SM$.
   b) Compare les mouvements de S et de M.
   c) Établis l'équation horaire $y_M(t)$ en précisant pour quelles dates elle est valable.
3. Donne les positions, sur la corde, des points qui vibrent en phase avec S.`,
  solution: R`### Partie A
1. - Cas 1 : $\vec F_m = q\,\vec v \wedge \vec B$. Avec $\vec v$ vers la droite et $\vec B$ vers l'avant, $\vec v \wedge \vec B$ est dirigé **vers le bas** ; $q > 0$ : $\vec F_m$ est verticale, **vers le bas**, perpendiculaire à $\vec v$.
   - Cas 2 : $\vec F_e = q\vec E$ ; $q > 0$ : $\vec F_e$ a le sens de $\vec E$, horizontale **vers la gauche** (elle freine la particule).
2. 2-1 : **b** ; 2-2 : **b et c** ($T_0 = 2\pi\sqrt{l/g}$) ; 2-3 : **c** ; 2-4 : **a et c**.
3. a) **Vrai**. b) **Faux** (elle transporte de l'énergie, sans transport de matière). c) **Vrai**. d) **Faux** (il met en évidence l'aspect **corpusculaire** : les photons).

### Partie B
1. Le poids $\vec P$ et la tension $\vec T$ du fil. $\vec T$ est perpendiculaire au déplacement (portée par le rayon) : $W(\vec T) = 0$.
2. Théorème de l'énergie cinétique entre $\alpha_m$ (vitesse nulle) et $\alpha$ : $\tfrac12mV^2 = mgl(\cos\alpha - \cos\alpha_m)$, d'où $V = \sqrt{2gl(\cos\alpha - \cos\alpha_m)}$.
3. $\alpha = 30°$ : $V = \sqrt{2 \times 9{,}8 \times 0{,}90 \times (0{,}866 - 0{,}5)} \approx \mathbf{2{,}54}$ m/s. $\alpha = 0$ : $V = \sqrt{2 \times 9{,}8 \times 0{,}90 \times 0{,}5} \approx \mathbf{2{,}97}$ m/s.
4. Projection de la deuxième loi de Newton sur la normale (vers le point de suspension) : $T - mg\cos\alpha = m\dfrac{V^2}{l} = 2mg(\cos\alpha - \cos\alpha_m)$, d'où $T = mg(3\cos\alpha - 2\cos\alpha_m)$.
   $\alpha = 30°$ : $T = 0{,}98 \times (2{,}598 - 1) \approx \mathbf{1{,}57}$ N. $\alpha = 0$ : $T = 0{,}98 \times (3 - 1) = \mathbf{1{,}96}$ N ($= 2mg$).

### Partie C
1. a) $1{,}5T = 0{,}03$ s, d'où $T = 0{,}02$ s ; $\lambda = VT = 15 \times 0{,}02 = 0{,}30$ m.
   b) $y_S = a\sin(\omega t + \varphi)$ avec $\omega = \dfrac{2\pi}{T} = 100\pi$ rad/s. À $t = 0$ : $y_S = 0$ et S descend (vitesse négative), donc $\varphi = \pi$ : $y_S(t) = 3\times10^{-3}\sin(100\pi t + \pi)$ (m).
2. a) $\theta = \dfrac74T = 0{,}035$ s ; $x = V\theta = 15 \times 0{,}035 = \mathbf{0{,}525}$ **m** $= \dfrac74\lambda$.
   b) Déphasage $\Delta\varphi = \dfrac{2\pi x}{\lambda} = \dfrac{7\pi}{2} \equiv -\dfrac\pi2\;[2\pi]$ : M vibre **en quadrature** avec S (en quadrature avance, puisque $\frac{7\pi}2 = 4\pi - \frac\pi2$).
   c) $y_M(t) = y_S(t - \theta) = 3\times10^{-3}\sin\!\left(100\pi t + \pi - \dfrac{7\pi}{2}\right) = 3\times10^{-3}\sin\!\left(100\pi t - \dfrac\pi2\right)$ (m), valable pour $t \geq 0{,}035$ s ($y_M = 0$ avant).
3. Les points en phase avec S sont à des distances multiples de la longueur d'onde : $x_k = k\lambda = 0{,}30k$ m ($k \in \mathbb{N}^*$), soit $0{,}30$ m, $0{,}60$ m, $0{,}90$ m…`,
}

const svt1 = {
  title: 'Sujet Cognix n°1 — SVT série D : reproduction, subduction, message nerveux, albinisme',
  inspiredBy: 'Bac blanc zonal mai 2026 (zone 1, Brazzaville) — SVT série D : reproduction, tectonique des plaques, physiologie nerveuse, hémophilie',
  exam: { exam_kind: 'bac_blanc', duration_min: 240, bareme: [
    { label: 'Partie A : restitution des connaissances', points: 6 }, { label: 'Partie B : application des connaissances', points: 8 }, { label: 'Partie C : résolution d’un problème', points: 6 },
  ] },
  statement: R`**Sujet type bac inédit (Cognix) — Série D — Sciences de la vie et de la Terre — Durée 4 h — Coefficient 5**

### Partie A : restitution des connaissances (6 points)
**I. Définitions (2 points).** Définis : gamétogenèse, fécondation, potentiel de repos, subduction.

**II. Questions à choix multiples (2 points).** Pour chaque proposition, choisis la bonne réponse (exemple : 5 = a).
1. Chez l'homme, la spermatogenèse se déroule : a) dans l'épididyme ; b) dans les tubes séminifères ; c) dans la prostate.
2. L'ovulation est déclenchée par : a) un pic de LH ; b) une chute de progestérone ; c) la FSH seule.
3. La méiose produit à partir d'une cellule diploïde : a) deux cellules diploïdes ; b) quatre cellules haploïdes ; c) quatre cellules diploïdes.
4. La nidation a lieu : a) dans la trompe ; b) dans l'ovaire ; c) dans la muqueuse utérine.

**III. Vrai ou faux (2 points).**
1. Le corps jaune sécrète de la progestérone.
2. Au niveau d'une dorsale océanique, la lithosphère est détruite.
3. La gaine de myéline ralentit la conduction de l'influx nerveux.
4. Un caractère récessif ne s'exprime chez l'individu que s'il est à l'état homozygote.

### Partie B : application des connaissances (8 points)
**Exercice 1 : tectonique (4 points).** Le long d'une marge du Pacifique, on a relevé la profondeur des foyers de séismes en fonction de leur distance à la fosse océanique, mesurée vers le continent :

| Distance à la fosse (km) | 0 | 100 | 200 | 300 | 400 | 500 |
|---|---|---|---|---|---|---|
| Profondeur des foyers (km) | 10 | 60 | 120 | 230 | 380 | 520 |

1. Décris la répartition des foyers sismiques.
2. Quelle structure ces foyers dessinent-ils ? Comment l'appelle-t-on ?
3. Explique, à l'aide de ces données, le phénomène géologique mis en évidence.
4. Cite deux autres manifestations géologiques associées à ce type de marge.

**Exercice 2 : physiologie nerveuse (4 points).** On place deux électrodes réceptrices R₁ (à la surface) et R₂ (à l'intérieur) d'un axone géant isolé, reliées à un oscilloscope.
- Au repos, l'oscilloscope affiche une différence de potentiel constante de $-70$ mV.
- Après une stimulation efficace, on enregistre une variation brève : la différence de potentiel passe en $1$ ms de $-70$ mV à $+30$ mV, puis revient à $-70$ mV en passant légèrement sous cette valeur, le tout en $3$ ms environ.
1. Nomme ces deux phénomènes électriques.
2. Explique l'origine ionique de la valeur de repos.
3. Décris les différentes phases de l'enregistrement obtenu après stimulation et indique les mouvements d'ions responsables de chacune.
4. On double l'intensité de la stimulation : l'enregistrement reste identique. Quelle propriété de la fibre nerveuse est ainsi mise en évidence ?

### Partie C : résolution d'un problème de génétique humaine (6 points)
L'albinisme se manifeste par une absence de pigmentation de la peau, des cheveux et des yeux. On étudie une famille sur trois générations :
- **Génération I :** I₁ (homme) et I₂ (femme), tous deux de pigmentation normale.
- **Génération II :** leurs enfants II₁ (fils albinos), II₂ (fille normale) et II₃ (fils normal). II₂ épouse II₄, homme normal étranger à la famille.
- **Génération III :** enfants de II₂ et II₄ : III₁ (fille albinos) et III₂ (fils normal).
1. Construis l'arbre généalogique de cette famille.
2. L'allèle responsable de l'albinisme est-il dominant ou récessif ? Justifie.
3. Montre que le gène n'est pas porté par le chromosome X (on pourra raisonner sur III₁).
4. Écris les génotypes de I₁, I₂, II₁, II₂, II₄ et III₁ (on notera A l'allèle normal et a l'allèle de l'albinisme).
5. III₂ épouse une femme hétérozygote. Calcule la probabilité que leur premier enfant soit albinos.`,
  solution: R`### Partie A
**I.** Gamétogenèse : formation des gamètes (spermatozoïdes, ovules) dans les gonades, à partir de cellules germinales, par mitoses puis méiose. Fécondation : union d'un gamète mâle et d'un gamète femelle (fusion des noyaux) donnant une cellule-œuf diploïde. Potentiel de repos : différence de potentiel permanente (environ $-70$ mV) entre l'intérieur et l'extérieur d'une cellule nerveuse au repos, l'intérieur étant négatif. Subduction : plongement d'une plaque lithosphérique océanique sous une autre plaque, au niveau d'une fosse océanique.

**II.** 1 = b ; 2 = a ; 3 = b ; 4 = c.

**III.** 1. Vrai. 2. Faux (elle y est **créée** ; elle est détruite dans les zones de subduction). 3. Faux (elle l'**accélère** : conduction saltatoire). 4. Vrai.

### Partie B
**Exercice 1**
1. Les foyers sont superficiels près de la fosse et de plus en plus profonds en s'éloignant de la fosse vers le continent (de $10$ km à $520$ km de profondeur sur $500$ km).
2. Ils dessinent un plan incliné plongeant sous le continent : le **plan de Wadati-Benioff**.
3. Ce plan matérialise la plaque océanique qui s'enfonce dans le manteau sous la plaque continentale : c'est la **subduction**. Les séismes se produisent dans la plaque plongeante, rigide et froide, au contact du manteau.
4. Volcanisme explosif (andésitique) sur le continent, formation d'une chaîne de montagnes, fosse océanique, anomalies du flux de chaleur…

**Exercice 2**
1. Au repos : **potentiel de repos** ($-70$ mV). Après stimulation : **potentiel d'action**.
2. Inégale répartition des ions de part et d'autre de la membrane (plus de K⁺ à l'intérieur, plus de Na⁺ à l'extérieur), maintenue par la pompe Na⁺/K⁺ (transport actif), et perméabilité de la membrane au repos surtout aux ions K⁺ : la face interne est chargée négativement.
3. - **Dépolarisation** ($-70 \to +30$ mV) : ouverture des canaux Na⁺, entrée massive de Na⁺.
   - **Repolarisation** ($+30 \to -70$ mV) : fermeture des canaux Na⁺, ouverture des canaux K⁺, sortie de K⁺.
   - **Hyperpolarisation** (légèrement sous $-70$ mV) : les canaux K⁺ restent ouverts un peu plus longtemps ; puis retour au potentiel de repos grâce à la pompe Na⁺/K⁺.
4. Au-delà du seuil, le potentiel d'action garde la même amplitude quelle que soit l'intensité : la fibre obéit à la **loi du tout ou rien**.

### Partie C
1. Arbre : I₁ □ — ○ I₂ ; en dessous II₁ ■, II₂ ○ (mariée à II₄ □), II₃ □ ; sous le couple II₂–II₄ : III₁ ● et III₂ □ (symboles pleins = albinos).
2. I₁ et I₂ sont normaux et ont un fils albinos II₁ : l'allèle de l'albinisme était présent chez les parents sans s'exprimer. Il est **récessif**.
3. Si le gène était porté par X, la fille albinos III₁ ($X^aX^a$) aurait reçu un $X^a$ de son père II₄, qui serait donc albinos ($X^aY$). Or II₄ est normal : le gène n'est **pas lié à X**, il est **autosomal**.
4. II₁ et III₁ albinos : $aa$. I₁ et I₂ (parents de II₁) : $Aa$. II₂ et II₄ (parents de III₁, normaux) : $Aa$.
5. III₂ est normal, issu de deux parents $Aa$ : il est $AA$ avec la probabilité $\frac13$ et $Aa$ avec la probabilité $\frac23$. L'enfant est albinos seulement si III₂ est $Aa$ et si les deux parents transmettent $a$ : $P = \dfrac23 \times \dfrac12 \times \dfrac12 = \dfrac16$.`,
}

export const BLOCS = [
  { subject: 'CHIMIE', levels: ['bac_c', 'bac_d'], chapterTitle: CHAPTER, description: DESCRIPTION, exercises: [chimie1] },
  { subject: 'Physique', levels: ['bac_c', 'bac_d'], chapterTitle: CHAPTER, description: DESCRIPTION, exercises: [physique1] },
  { subject: 'SVT', levels: ['bac_d'], chapterTitle: CHAPTER, description: DESCRIPTION, exercises: [svt1] },
]
