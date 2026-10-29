// SVT Terminale D — sujets complets : bacs, bacs blancs, compositions, devoirs et TD (scans du 19/10/2026).
// Énoncés transcrits ; pages originales jointes pour les figures ; corrigés rédigés pour l'application.
const G = 'svt-td-genetique-humaine-1'
const p = (file, ...pages) => pages.map((n) => `${file}-p${String(n).padStart(2, '0')}.jpg`)

const bac2005 = {
  title: 'Bac D 2005 (juin) — SVT : immunologie, physiologie nerveuse, sérothérapie',
  difficulty: 3,
  pages: p(G, 5, 6),
  statement: `**Baccalauréat, session de juin 2005 — République du Congo — Sciences de la Vie et de la Terre — Série D — Coefficient 5 — Durée 4 h**

**EXERCICE I (6 pts)**
1. a) Une souris de souche CBA reçoit deux greffes de peau ; la première vient d'un donneur CBA, la seconde d'un donneur de souche A. Les greffons prennent et, le 6ᵉ jour après l'opération, leur aspect est semblable. Mais du 6ᵉ au 12ᵉ jour, le receveur rejette le greffon « A ». En revanche, le greffon « CBA » est définitivement accepté.
b) Quelques jours après, on fait une nouvelle tentative de greffe d'un greffon « A » sur le receveur « CBA ». Cette fois, le greffon est éliminé en six (6) jours. En revanche, une greffe de peau d'une souris de souche C (toujours sur le receveur CBA) est rejetée en 12 jours.
Analysez et expliquez ces expériences.

2. a) Une souris de souche CBA reçoit une greffe de peau d'un donneur A. Huit jours après, on sacrifie l'animal et on extrait une fraction de sérum et une fraction de cellules lymphoïdes des ganglions lymphatiques. Ces deux fractions sont injectées séparément à deux souris CBA auxquelles on greffe, quelques semaines après, la peau d'une souris A. La souris ayant reçu le sérum rejette la greffe au dixième jour ; la souris qui a reçu la fraction « cellules » rejette la greffe en six (6) jours (moyenne).
b) Une souris de souche CBA subit l'ablation du thymus (thymectomie) à la naissance. Deux mois après, elle reçoit une greffe de peau d'un donneur A. Trois mois plus tard, la greffe est toujours en place.
c) Il est possible de réaliser la greffe des cellules d'une souris A à des embryons de souris CBA (greffe in utero). Les souriceaux ainsi traités, devenus adultes, acceptent des greffes de peau de souris A et CBA, mais rejettent la peau d'une souris C.
Analysez et expliquez ces expériences.

**EXERCICE II (6 pts)**
On se propose d'étudier la physiologie d'un nerf. On porte des séries d'excitations d'intensité croissante sur ce nerf ; à chaque excitation correspond un temps (t). Les résultats suivants ont été obtenus :

| t (ms) | 0,3 | 0,6 | 0,9 | 1,2 | 1,5 | 1,8 | 2,1 | 2,4 |
|---|---|---|---|---|---|---|---|---|
| I (mV) | 3,3 | 2,0 | 1,5 | 1,2 | 1,1 | 1,0 | 1,0 | 1,0 |

1. Citez les propriétés essentielles du nerf.
2. Tracez la courbe d'excitabilité nerveuse en fonction du temps (échelle : 1 cm → 0,2 ms ; 1 cm → 0,4 mV).
3. Après avoir défini ce qu'on entend par chronaxie et rhéobase, déterminez graphiquement leurs valeurs.
4. En vous servant de la réponse 3, dites en vous justifiant si une excitation d'intensité 1,2 mV appliquée pendant 0,9 ms est efficace.
5. Quelles sont alors les conditions d'obtention d'une excitation efficace ?
6. a) Qu'appelle-t-on un potentiel d'action ? Dans quelle condition apparaît-il ? b) Qu'appelle-t-on un potentiel de repos ? À quoi est-il dû ? c) Réalisez des schémas de montage permettant de mettre en évidence le potentiel d'action et le potentiel de repos.

**EXERCICE III (4 pts)**
- Expérience 1 : une souris reçoit de la toxine tétanique fraîche. Elle meurt.
- Expérience 2 : une souris reçoit une injection d'anatoxine tétanique puis, 15 jours après, une injection de toxine tétanique fraîche. Elle survit.
- Expérience 3 : une souris reçoit une injection d'anatoxine tétanique puis, 15 jours après, une injection de toxine diphtérique fraîche. Elle meurt.
Quelles conclusions peut-on tirer de ces expériences ?
- Expérience 4 : une souris reçoit une injection d'anatoxine tétanique ; 15 jours après, on prélève son sérum et on l'injecte à une autre souris à laquelle on injecte simultanément de la toxine tétanique fraîche. Elle survit.
- Expérience 5 : une souris reçoit une injection du sérum obtenu précédemment puis, 15 jours après, une injection de toxine tétanique fraîche. Elle meurt.
1. Qu'appelle-t-on sérum ?
2. Interprétez ces expériences et dégagez la notion de sérothérapie.`,
  solution: `## Exercice I
**1. a)** La greffe CBA → CBA (**autogreffe / isogreffe**, même souche) est acceptée : le receveur la reconnaît comme « soi ». La greffe A → CBA (**allogreffe**) est rejetée entre le 6ᵉ et le 12ᵉ jour : les cellules du greffon portent des marqueurs (molécules du CMH) différents, reconnus comme « non-soi » par le système immunitaire du receveur. C'est un **rejet primaire** (le délai correspond au temps nécessaire pour activer et multiplier les lymphocytes).
**b)** Le second greffon A est rejeté plus vite (6 jours) : c'est un **rejet secondaire**, dû à une **mémoire immunitaire** acquise lors du premier contact. Le greffon C est rejeté en 12 jours, comme un premier greffon : la mémoire est **spécifique** de la souche A.

**2. a)** Les **cellules lymphoïdes** transfèrent la mémoire (rejet accéléré en 6 jours), le **sérum** (anticorps) presque pas (10 jours, proche d'un rejet primaire). Le rejet de greffe relève surtout de l'**immunité à médiation cellulaire** (lymphocytes T).
**b)** Sans thymus dès la naissance, les lymphocytes T ne peuvent pas acquérir leur maturité : la greffe n'est pas rejetée. Ce sont donc les **lymphocytes T** (thymo-dépendants) qui rejettent les greffes.
**c)** Mis en contact avec les cellules A pendant sa formation, le système immunitaire de l'embryon CBA a appris à les considérer comme « soi » : c'est une **tolérance immunitaire acquise**, **spécifique** (la peau C reste rejetée).

## Exercice II
1. Le nerf est **excitable** (il répond à une stimulation par un influx) et **conducteur** (il propage l'influx).
2. Courbe intensité-durée : hyperbole décroissante qui tend vers une asymptote horizontale I = 1,0 mV.
3. - **Rhéobase** : intensité minimale qui, appliquée pendant un temps suffisamment long (théoriquement infini), provoque une réponse → **1,0 mV**.
- **Chronaxie** : durée minimale de passage d'un courant d'intensité **double de la rhéobase** (2,0 mV) pour obtenir une réponse → **0,6 ms**.
4. Pour 0,9 ms, il faut au minimum 1,5 mV. Avec 1,2 mV (point situé **sous** la courbe), l'excitation est **inefficace**.
5. Il faut une intensité au moins égale à la rhéobase et une durée suffisante : le couple (durée, intensité) doit se situer **sur ou au-dessus de la courbe** ; la variation de l'intensité doit aussi être assez brusque.
6. a) Le **potentiel d'action** est une inversion brève et propagée de la polarisation de la membrane (dépolarisation jusqu'à environ +30 mV puis repolarisation). Il apparaît quand la stimulation atteint le **seuil** (stimulation efficace).
b) Le **potentiel de repos** est la différence de potentiel permanente (environ −70 mV) entre l'intérieur (négatif) et l'extérieur (positif) de la fibre au repos. Il est dû à la **répartition inégale des ions** (K⁺ plus concentré dedans, Na⁺ dehors), à la perméabilité sélective de la membrane et à la **pompe Na⁺/K⁺**.
c) - Potentiel de repos : une microélectrode **dans** la fibre, l'autre **à la surface**, reliées à un oscilloscope (le spot dévie à −70 mV dès la pénétration).
- Potentiel d'action : électrodes excitatrices reliées à un stimulateur d'un côté ; électrodes réceptrices (une interne, une externe, ou deux externes) reliées à l'oscilloscope plus loin sur la fibre.

## Exercice III
**Conclusions des expériences 1 à 3** : la toxine tétanique est mortelle (1). L'**anatoxine** (toxine rendue inoffensive mais gardant son pouvoir antigénique) a **immunisé** la souris contre la toxine tétanique (2) : c'est le principe de la **vaccination**. Cette protection est **spécifique** : elle ne protège pas contre la toxine diphtérique (3).

**1.** Le **sérum** est la partie liquide du sang, débarrassée des cellules et du fibrinogène (liquide obtenu après coagulation) ; il contient les **anticorps**.

**2.** - Expérience 4 : le sérum de la souris immunisée contient des **anticorps antitoxine tétanique** qui neutralisent immédiatement la toxine : la protection est **transférable par le sérum** et **immédiate**.
- Expérience 5 : 15 jours après l'injection, le sérum ne protège plus : les anticorps reçus ont été éliminés et la souris n'a pas produit elle-même d'anticorps ni de mémoire. Cette **immunité passive** est de **courte durée**.
**Sérothérapie** : injection d'un sérum contenant des anticorps spécifiques déjà formés ; elle agit immédiatement (traitement **curatif** ou d'urgence) mais brièvement, contrairement à la vaccination (préventive, lente à s'installer, durable).`,
}

const bac2003 = {
  title: 'Bac D 2003 (juin) — Biologie : groupes sanguins et jonction neuromusculaire',
  pages: p(G, 11, 12),
  statement: `**Baccalauréat, session de juin 2003 — République du Congo — Épreuve de Biologie — Série D — Coefficient 3 — Durée 3 h**

**I.** On désire connaître le groupe sanguin d'un sujet X. Pour cela, on prélève à l'extrémité d'un doigt quelques gouttes de sang avec un vaccinostyle. Sur une plaque de porcelaine blanche, on dépose une goutte de sérum anti-A, une goutte de sérum anti-B et une goutte de sérum anti-A, anti-B. Une goutte de sang du sujet X est mélangée à chaque goutte de sérum ; on obtient le résultat suivant :

| Mélange | Aspect |
|---|---|
| Sang du sujet X + sérum anti-A | Grumeleux |
| Sang du sujet X + sérum anti-B | Homogène |
| Sang du sujet X + sérum anti-A et anti-B | Grumeleux |

1. Définissez la notion de sérum anti-A, anti-B, anti-AB. De quels groupes sanguins a-t-on extrait chaque sérum ?
2. Expliquez les réactions obtenues en vous aidant de schémas.
3. À quels types de substances chimiques sont-elles dues ? Comment et par quelles cellules ces substances sont-elles produites ? Précisez l'origine de ces cellules.
4. Déterminez le groupe sanguin du sujet X. De quel(s) autre(s) groupe(s) sanguin(s) le sujet X peut-il éventuellement recevoir le sang ?

**II.**
1. Avec la préparation nerf sciatique-gastrocnémien, un stimulateur et un oscilloscope à deux voies, on réalise le montage du document 1 (voir la page scannée). La voie I de l'oscilloscope enregistre les phénomènes mécaniques de la contraction du muscle ; la voie II est reliée à deux électrodes placées à la surface du muscle. On porte une excitation d'intensité et de durée convenables sur le nerf ; on obtient les tracés A et B du document 2.
a) À quels tracés s'attendait-on (schématisez) ? b) Que représentent les tracés A et B ? Analysez le tracé A.
2. On veut savoir à quel niveau agit une substance biochimique X utilisée comme poison paralysant :
- Expérience 1 : le nerf est placé dans la substance X ; on excite et on obtient les tracés a et b du document 3.
- Expérience 2 : le muscle est placé dans la substance X ; on excite et on obtient les tracés a et b du document 3.
- Expérience 3 : la jonction nerf-muscle est plongée dans la substance X ; on excite et on obtient le tracé (c) du document 3.
a) Interprétez chaque expérience et concluez en précisant le lieu d'action de la substance X.
b) Expliquez le passage de l'influx nerveux au niveau de cette zone (schéma à l'appui).`,
  solution: `## I
**1.** - **Sérum anti-A** : sérum contenant des anticorps (agglutinines) anti-A ; on l'extrait du sang de sujets du **groupe B** (ou O).
- **Sérum anti-B** : contient des agglutinines anti-B ; extrait de sujets du **groupe A** (ou O).
- **Sérum anti-A, anti-B** : contient les deux ; extrait de sujets du **groupe O**.
**2.** L'aspect grumeleux est une **agglutination** : les anticorps anti-A se fixent sur les antigènes (agglutinogènes) A portés par les hématies et les relient entre elles en amas (complexes antigène-anticorps). Avec le sérum anti-B, aucun antigène B n'est reconnu : le mélange reste homogène. (Schéma : hématies portant des antigènes A, reliées par des anticorps en forme de Y.)
**3.** Ces réactions sont dues à des **anticorps** (immunoglobulines, de nature protéique). Ils sont produits et sécrétés par les **plasmocytes**, cellules issues de la différenciation des **lymphocytes B** après leur activation ; les lymphocytes B naissent et mûrissent dans la **moelle osseuse rouge**.
**4.** Le sang de X est agglutiné par l'anti-A (et l'anti-A, B) mais pas par l'anti-B : ses hématies portent l'antigène A seul → **groupe A**. Il peut recevoir du sang du groupe **A** et du groupe **O** (donneur universel).

## II
**1. a)** On s'attendait à obtenir sur la voie I une **secousse musculaire** (myogramme) et sur la voie II un **potentiel d'action musculaire** (électromyogramme).
**b)** Tracé A : **myogramme** d'une secousse ; tracé B : **électromyogramme** (activité électrique du muscle). Analyse du tracé A : une **phase de latence** (de l'excitation au point B), une **phase de contraction** (B → C, le muscle se raccourcit), puis une **phase de relâchement** (C → D, retour à la position initiale). L'activité électrique précède la contraction.

**2. a)** - Expérience 1 : tracés normaux → X n'empêche ni la naissance ni la conduction de l'influx dans le **nerf**.
- Expérience 2 : tracés normaux → X n'agit pas sur le **muscle** lui-même.
- Expérience 3 : le nerf conduit l'influx (tracé c), mais le muscle ne se contracte pas → X bloque la **jonction neuromusculaire** (plaque motrice), comme le curare.
**b)** Transmission au niveau de la synapse neuromusculaire : le potentiel d'action arrive à la terminaison de l'axone → entrée d'ions Ca²⁺ → **exocytose** des vésicules d'**acétylcholine** dans la fente synaptique → l'acétylcholine diffuse et se fixe sur ses **récepteurs** de la membrane de la fibre musculaire → dépolarisation (potentiel de plaque) → potentiel d'action musculaire → contraction. L'acétylcholine est ensuite détruite par l'**acétylcholinestérase**. La substance X empêche cette transmission (par exemple en occupant les récepteurs à l'acétylcholine).`,
}

const bb2010 = {
  title: 'Bac blanc 2010 (zone I) — SVT série D : physiologie nerveuse et cardiaque',
  difficulty: 3,
  pages: p(G, 7, 8, 9),
  statement: `**Inspection des lycées zone I (Brazzaville – Pool – Sangha – Likouala), année scolaire 2009-2010, baccalauréat blanc — SVT — Série D — Durée 4 h — Coefficient 5** (figures sur les pages scannées)

**I (5 points)**
A. On isole dans un nerf deux fibres nerveuses F1 (diamètre 30 µm, ligature entre ER1 et ER2) et F2 (diamètre 10 µm). On applique sur chacune une stimulation efficace de même intensité ; les électrodes réceptrices reliées à un oscilloscope permettent d'obtenir les enregistrements PA1 et PA2 (d1 = d2 ; température 36 °C).
1. Quelles différences apporte la comparaison de ces deux réponses (PA1 et PA2) ?
2. Comment pouvez-vous les expliquer ?

B. On procède à des stimulations d'intensités croissantes (i1 … i12) sur un nerf, puis sur une fibre de ce nerf. On mesure l'amplitude des réponses sur la fibre (R2) et sur le nerf (R1).
1. Rappelez la différence entre un nerf et une fibre nerveuse.
2. Comment interprétez-vous les résultats ?

| Intensité (UA) | i1 | i2 | i3 | i4 | i5 | i6 | i7 | i8 | i9 | i10 | i11 | i12 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Amplitude R1 (nerf) | 0 | 0 | 110 | 180 | 310 | 410 | 460 | 600 | 680 | 780 | 820 | 820 |
| Amplitude R2 (fibre) | 0 | 0 | 110 | 110 | 110 | 110 | 110 | 110 | 110 | 110 | 110 | 110 |

**II (5 points)** — On étudie la physiologie du tissu nerveux (document 1).
1. Sur un axone géant de céphalopode, on place deux microélectrodes réceptrices (R1, R2), l'une introduite en profondeur, l'autre maintenue à la surface.
a) Lors de la pénétration intracellulaire, on constate une brusque différence de potentiel qui se stabilise vers 70 millivolts (schéma a). Comment nomme-t-on cette différence de potentiel et comment l'explique-t-on ?
b) Au temps t1, on porte une stimulation d'intensité suffisante : on obtient le tracé du schéma b. Nommez et interprétez cette variation.
c) On fait varier l'intensité (I1 < I2 < I3 < I4) et on obtient le schéma c. Quelles propriétés de la fibre nerveuse isolée sont ainsi mises en évidence ?
2. On dispose maintenant sur la fibre deux électrodes extracellulaires (R'1 et R'2) reliées à un oscillographe. Une stimulation efficace donne le tracé du schéma d. Comment appelle-t-on ce tracé et comment peut-on l'expliquer ?

**IV (6 points)**
A. 1. On enregistre les contractions du muscle cardiaque d'une grenouille (figure 1).
a) Analysez ce tracé. Quel nom lui donne-t-on ?
b) Repérez une révolution cardiaque. Reproduisez-la en délimitant les différentes phases.
c) Évaluez la fréquence des battements cardiaques.
2. a) On porte sur le myocarde deux stimulations électriques S1 et S2 (figure 2A). Dégagez de l'analyse de ce tracé une propriété particulière du myocarde.
b) On soumet le myocarde à une série d'excitations répétées et rapprochées (80 par seconde) (figure 2B). Analysez ce tracé ; comparez-le à celui du muscle gastrocnémien dans les mêmes conditions et dégagez une nouvelle propriété du myocarde.`,
  solution: `## I
**A. 1.** PA1 est **monophasique**, PA2 est **diphasique** ; de plus PA1 apparaît **plus tôt** (temps de latence plus court) que PA2, alors que la distance parcourue est la même (d1 = d2).
**2.** - Sur F1, la **ligature** située entre ER1 et ER2 bloque l'influx : il passe sous la première électrode réceptrice mais n'atteint jamais la seconde → une seule déflexion (monophasique). Sur F2, l'influx passe successivement sous les deux électrodes → deux déflexions de sens opposés (diphasique).
- F1 a un **diamètre plus grand** (30 µm contre 10 µm) : la vitesse de conduction augmente avec le diamètre de la fibre, l'influx arrive donc plus vite.

**B. 1.** La **fibre nerveuse** est un prolongement (axone) d'un seul neurone. Le **nerf** est un faisceau de nombreuses fibres nerveuses entourées de tissu conjonctif.
**2.** - Fibre (R2) : aucune réponse pour i1 et i2 (intensités infraliminaires), puis une réponse d'amplitude **constante** (110) dès le seuil i3 : la fibre obéit à la **loi du tout ou rien**.
- Nerf (R1) : la réponse apparaît à i3 puis son amplitude **augmente** avec l'intensité jusqu'à un maximum (820) atteint à i11. Les fibres du nerf ont des seuils différents : plus l'intensité augmente, plus le nombre de fibres excitées (**recrutement**) augmente ; à i11 toutes les fibres répondent. Le nerf n'obéit pas à la loi du tout ou rien.

## II
**1. a)** C'est le **potentiel de repos** (≈ −70 mV, intérieur négatif). Il s'explique par la répartition inégale des ions de part et d'autre de la membrane (K⁺ concentré à l'intérieur, Na⁺ à l'extérieur), la perméabilité de la membrane au repos surtout pour K⁺ et le fonctionnement de la **pompe Na⁺/K⁺**.
**b)** C'est un **potentiel d'action** : brève inversion de polarité (dépolarisation jusqu'à environ +30 mV, due à une entrée massive de Na⁺), suivie d'une repolarisation (sortie de K⁺), parfois d'une courte hyperpolarisation, puis retour au potentiel de repos.
**c)** I1 et I2 ne déclenchent pas de potentiel d'action (simples réponses locales) : il existe un **seuil d'excitation**. I3 et I4 donnent des potentiels d'action de **même amplitude** : la fibre obéit à la **loi du tout ou rien**.
**2.** C'est un **potentiel d'action diphasique** (biphasique) : la zone dépolarisée (négative à l'extérieur) passe d'abord sous R'1 (première déflexion), puis sous R'2 (déflexion de sens inverse).

## IV
**A. 1. a)** Le tracé montre des contractions **régulières et rythmiques** qui se succèdent spontanément : c'est un **cardiogramme** ; il traduit l'**automatisme** du cœur.
**b)** Une révolution cardiaque comprend la **systole auriculaire** (petite élévation), la **systole ventriculaire** (grande élévation) puis la **diastole** (relâchement général, retour à la ligne de base).
**c)** On compte le nombre de révolutions sur la durée repérée (5 secondes) et on rapporte à une minute : fréquence = nombre de révolutions × 12 (par exemple, 4 révolutions en 5 s → 48 battements par minute).
**2. a)** S1, portée pendant la **systole**, est sans effet : le myocarde est **inexcitable pendant la systole** (période réfractaire). S2, portée pendant la **diastole**, provoque une contraction supplémentaire (**extrasystole**) suivie d'un **repos compensateur**.
**b)** Malgré des excitations très rapprochées, le cœur ne présente pas de contraction soutenue (seulement quelques extrasystoles) : il **n'est pas tétanisable**. Le muscle gastrocnémien, lui, entre en **tétanos** (contraction soutenue, secousses fusionnées). La longue période réfractaire du myocarde lui permet de toujours se relâcher et donc de continuer à pomper le sang.`,
}

const bbZonal2022 = {
  title: 'Bac blanc zonal mai 2022 (zone 1, Brazzaville-Pool) — SVT série D',
  difficulty: 3,
  pages: p('bac-blanc-zonal-terminale-d-1', 1, 2, 3, 4),
  statement: `**Inspection des lycées d'enseignement général zone 1 (Brazzaville-Pool), année 2021-2022, baccalauréat blanc zonal, session de mai 2022 — SVT — Série D — Durée 4 h** (figures et graphiques sur les pages scannées)

## Partie A : Restitution des connaissances (6 points)
**I. Appariement (2 points)** — Associez chaque chiffre de la colonne A à la lettre de la colonne B (exemple : 5 → e).
- Liste A : 1. Neurone pyramidal ; 2. Neurone en T ; 3. Neurone bipolaire ; 4. Neurone multipolaire
- Liste B : a. Ganglion rachidien ; b. Rétine ; c. Moelle épinière ; d. Cortex cérébral

**II. Questions à choix multiples (2 points)** — Choisissez la bonne réponse (exemple : 5 = a).
1. Les agents polluants : a) assurent l'abattage anarchique des arbres ; b) assurent la réoxygénation rapide du milieu ; c) sont responsables des maladies pulmonaires.
2. L'ovogenèse diffère de la spermatogenèse par : a) le nombre de gamètes ; b) l'existence d'une phase de multiplication ; c) le déroulement du brassage de l'information génétique au cours de la méiose.
3. Dans le cas d'une anomalie récessive liée au chromosome sexuel X : a) toutes les filles atteintes doivent avoir un père atteint ; b) tout fils atteint doit avoir une mère atteinte ; c) un père normal peut avoir des filles atteintes.
4. En anaphase I : a) les chromosomes sont rangés dans le plan équatorial ; b) les chromosomes à deux chromatides migrent vers les pôles opposés ; c) les chromosomes homologues se séparent et migrent vers les pôles opposés.

**III. Schéma (2 points)** — Sans le reproduire, légendez et titrez le schéma (fleur, légendes 1 à 6) en attribuant un nom à chaque numéro (0,25 point par bonne réponse).

## Partie B : Application des connaissances (8 points)
**Exercice 1 : Tectonique globale (4 points)**
Les ondes sismiques et la connaissance de la structure interne du globe terrestre. Deux cas furent envisagés pour déterminer la structure réelle du globe : premier cas, la planète est homogène ; deuxième cas, la planète est hétérogène.
Lors d'un séisme, les vibrations qui naissent au niveau du foyer se propagent dans toutes les directions : elles voyagent à l'intérieur du globe terrestre. Les ondes sismiques P et S arrivent à la station d'enregistrement à des moments différents et se propagent à des vitesses variables.
Sur le schéma (a), où le globe est représenté en coupe, on a imaginé ce que serait la propagation des ondes engendrées par un séisme si la Terre était homogène, c'est-à-dire tout entière constituée de la même matière et de la même densité. Le schéma (b) correspond à un globe hétérogène.
1. Quelle phrase du texte permet d'approuver l'une des deux hypothèses ? (0,5 point)
2. Expliquez la nature de la trajectoire dans les deux schémas. (1 point)
3. Les ondes reçues aux stations 2 et 3 ont subi des déviations brutales vers 70 km, 2 900 km et 5 100 km de profondeur. Comment expliquez-vous ces différentes déviations ? (1,5 point)
4. Indiquez l'hypothèse retenue. (0,5 point)
5. Comment expliquez-vous que l'heure d'enregistrement des ondes aux différentes stations soit la même dans le schéma (b) et différente dans le schéma (a) ? (0,5 point)

**Exercice 2 : Système nerveux (4 points)**
On excite un nerf de grenouille dans des conditions expérimentales différentes avec des courants dont l'intensité et la durée de passage (valeurs limites efficaces) sont indiquées ci-dessous (durée en ms).

| Expérience A — I (mA) | 1,8 | 1,8 | 2,8 | 3,2 | 4 | 4,8 | 8 | | |
|---|---|---|---|---|---|---|---|---|---|
| T (ms) | 15 | 10 | 7 | 5 | 3 | 2 | 1,5 | | |
| **Expérience B — I (mA)** | 1,3 | 1,3 | 1,5 | 2 | 2,3 | 2,5 | 3,5 | 5,5 | 8 |
| T (ms) | 15 | 10 | 6 | 3 | 2 | 1,5 | 1,2 | 0,6 | 0,3 |
| **Expérience C — I (mA)** | 0,3 | 0,3 | 0,4 | 0,5 | 0,6 | 1,1 | 2 | 3 | 6 |
| T (ms) | 15 | 10 | 5 | 1 | 0,5 | 0,3 | 0,2 | 0,1 | 0,08 |

1. Tracez sur un même graphe les courbes d'excitabilité du nerf correspondant aux trois expériences (échelle : 1 cm → 1 mA ; 1 cm → 1 ms). (1,5 pt)
2. Dans quelle expérience le nerf se révèle-t-il le plus excitable ? Justifiez. (0,5 pt)
3. Un seul point de chaque courbe est suffisant pour caractériser l'excitabilité de chacun de ces états. Indiquez pour chaque courbe les coordonnées de ce point. (1 pt)
4. Citez trois paramètres susceptibles de faire varier l'excitabilité nerveuse. (1 pt)

## Partie C : Résolution d'un problème de reproduction humaine (6 points)
M. X et Mme X vivent ensemble depuis huit (8) ans et n'ont pas d'enfants. Afin de déterminer la cause de l'infertilité du couple, ils consultent un gynécologue qui recommande des dosages hormonaux.

Document 1 : dosage de la LH plasmatique (mU/mL) avant traitement.

| Jour | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| LH | 5,5 | 7,2 | 8,2 | 7,1 | 6,8 | 5,8 | 6,4 | 6,8 | 6 | 5,8 | 6,4 | 7 | 6,2 |

| Jour | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| LH | 6,5 | 6,8 | 5,6 | 5,9 | 5,4 | 6,2 | 6,3 | 6,8 | 5,8 | 6,5 | 7 | 7,2 | 6,4 |

Document 2 : dosage quotidien d'œstradiol (pg.mL⁻¹) et de progestérone (ng.mL⁻¹) avant traitement (courbes basses et plates).
À la suite de ces dosages, le gynécologue propose un traitement au citrate de clomiphène dont les résultats sont consignés dans le document 3 (LH, FSH, œstradiol et progestérone ; d = début, f = fin du traitement).
1. Quel est le problème posé ? (0,5 pt)
2. Analysez les documents 1 et 2. (2 pts)
3. Quelles hypothèses proposez-vous pour répondre au problème posé ? (1 pt)
4. Quelle information supplémentaire apporte l'analyse du document 3 ? (1,5 pt)
5. En tenant compte de toutes vos déductions, concluez quant au problème posé. (0,5 pt)`,
  solution: `## Partie A
**I.** 1 → **d** (cortex cérébral) ; 2 → **a** (ganglion rachidien) ; 3 → **b** (rétine) ; 4 → **c** (moelle épinière).

**II.** 1 = **c** ; 2 = **a** (une ovogenèse donne un seul ovule fonctionnel, une spermatogenèse quatre spermatozoïdes) ; 3 = **a** (une fille atteinte Xᵃ Xᵃ a forcément reçu Xᵃ de son père, qui est donc atteint) ; 4 = **c**.

**III.** Titre : **coupe longitudinale d'une fleur hermaphrodite (complète)**. Les six éléments à nommer, d'après la position des traits de rappel : le **pétale** (corolle), l'**étamine** avec son **anthère** et son **filet**, le **stigmate** et le **style** du pistil, l'**ovaire** contenant les **ovules**, et le **sépale** (calice) à la base, sur le réceptacle.

## Partie B — Exercice 1
1. « Les ondes sismiques P et S arrivent à la station d'enregistrement à des moments différents et **se propagent à des vitesses variables**. » Si les vitesses varient, le milieu traversé n'est pas homogène.
2. Schéma (a) : trajectoires **rectilignes** — dans un milieu homogène, les ondes se propagent en ligne droite à vitesse constante. Schéma (b) : trajectoires **courbes** (et brisées) — la vitesse change avec la profondeur, les ondes sont **réfractées** (et réfléchies) aux limites entre milieux différents.
3. Les déviations brutales traduisent des **discontinuités** entre couches de natures différentes :
- vers **70 km** : discontinuité de **Mohorovičić** (limite croûte / manteau ; profondeur variable, plus grande sous les continents) ;
- vers **2 900 km** : discontinuité de **Gutenberg** (limite manteau / noyau externe liquide : les ondes S y sont arrêtées, les ondes P ralenties et déviées) ;
- vers **5 100 km** : discontinuité de **Lehmann** (limite noyau externe liquide / noyau interne ou graine, solide).
4. Hypothèse retenue : **la Terre est hétérogène**, formée de couches concentriques (croûte, manteau, noyau externe, noyau interne).
5. Dans un globe homogène (a), la vitesse est constante : le temps d'arrivée est proportionnel à la longueur du trajet, donc différent pour chaque station. Dans le globe hétérogène (b), la vitesse des ondes **augmente avec la profondeur** : les ondes qui vont vers les stations lointaines passent plus profond, où elles sont plus rapides, ce qui compense la plus grande longueur de leur trajet.

## Partie B — Exercice 2
1. On trace trois courbes intensité-durée (hyperboles décroissantes, chacune tendant vers une asymptote horizontale).
2. Le nerf est **le plus excitable dans l'expérience C** : sa rhéobase (0,3 mA) et sa chronaxie (≈ 0,5 ms) sont les plus faibles ; il répond à des courants plus faibles et plus brefs.
3. Le point caractéristique est celui de la **chronaxie** : (durée = chronaxie ; intensité = 2 × rhéobase).
- A : rhéobase 1,8 mA → 2 × 1,8 = 3,6 mA ; par lecture graphique (entre 3,2 mA à 5 ms et 4 mA à 3 ms), chronaxie ≈ **4 ms** → point (**4 ms ; 3,6 mA**).
- B : rhéobase 1,3 mA → 2,6 mA ; chronaxie ≈ **1,5 ms** → point (**1,5 ms ; 2,6 mA**).
- C : rhéobase 0,3 mA → 0,6 mA ; chronaxie = **0,5 ms** → point (**0,5 ms ; 0,6 mA**).
4. Par exemple : la **température**, la **fatigue** du nerf, les **substances chimiques** (anesthésiques, drogues), la composition ionique du milieu, le diamètre et la myélinisation des fibres.

## Partie C
1. Quelle est la cause de l'infertilité du couple (ici de Mme X, chez qui les dosages sont faits) ?
2. Document 1 : la LH varie faiblement entre **5,4 et 8,2 mU/mL** pendant tout le cycle, **sans pic** (normalement, pic vers le 14ᵉ jour). Document 2 : l'œstradiol reste **bas et constant** (pas de pic préovulatoire) et la progestérone est **très basse** tout le cycle (pas de phase lutéale). → Pas de pic de LH, **pas d'ovulation**, pas de corps jaune : Mme X est **anovulatoire**.
3. Hypothèses : soit les **ovaires** sont déficients (les follicules ne mûrissent pas) ; soit le **complexe hypothalamo-hypophysaire** fonctionne mal (stimulation insuffisante des ovaires, absence de pic de LH).
4. Après traitement au clomiphène (qui empêche les œstrogènes d'exercer leur rétrocontrôle négatif sur l'hypothalamus et l'hypophyse) : **pics de FSH et de LH** vers le 14ᵉ jour, **pic d'œstradiol** juste avant, puis **forte sécrétion de progestérone** du 16ᵉ au 26ᵉ jour environ. Il y a eu **ovulation** et formation d'un **corps jaune** : les ovaires sont fonctionnels dès qu'ils sont correctement stimulés.
5. L'infertilité de Mme X est due à une **absence d'ovulation d'origine hypothalamo-hypophysaire** (sécrétion insuffisante de gonadostimulines, pas de pic de LH) ; elle est corrigée par le clomiphène.`,
}

const compoS1 = {
  title: 'Composition 2ᵉ trimestre 2021-2022 (zone 1) — SVT Tle D, sujet n°1',
  pages: p('svt-2', 1, 2, 3, 4),
  statement: `**Inspection des lycées d'enseignement général zone 1 (Brazzaville-Pool) — Compositions du 2ᵉ trimestre 2021-2022 — Terminale D — SVT — 4 heures — Sujet n°1** (figures sur les pages scannées)

## Partie A : Restitution des connaissances (6 pts)
**I. Définitions (2 pts)** — Définissez : parabiose, pollinisation, crossing-over, nidation.
**II. Vrai ou faux (2 pts)** — Répondez par vrai ou faux (exemple : 5 = f).
- a) La testostérone est une hormone produite par les tubes séminifères.
- b) La fleur bisexuée est une fleur qui possède les organes reproducteurs mâles et femelles.
- c) La deuxième division de la méiose est toujours précédée d'une phase S.
- d) Les chromatides sœurs d'un chromosome sont génétiquement identiques.
**III. Réarrangement (2 pts)** — La FIVETE est la fécondation in vitro et le transfert d'embryon. Ordonnez ces étapes (exemple : 6-8-7-10-9-11) : 1) capacitation des spermatozoïdes ; 2) transfert de l'embryon dans l'utérus ; 3) prélèvement des ovocytes matures ; 4) prélèvement des spermatozoïdes ; 5) nidation.

## Partie B : Application des connaissances (8 pts)
**Exercice 1 : Division cellulaire (4 pts)** — Le schéma représente la disposition des chromosomes au cours d'une division cellulaire (chromosomes A et B).
1. De quelle division s'agit-il ? Justifiez. (0,5 pt)
2. À quelle phase de cette division correspond ce document ? Justifiez. (0,5 pt)
3. a) Quelle est la garniture chromosomique de cette cellule ? (0,5 pt) b) Combien de plaques métaphasiques peut-on avoir ? (0,5 pt)
4. Déterminez le nombre de types de cellules obtenues à l'issue de cette division. (0,5 pt)
5. a) Quelle fonction génétique de cette division est mise en évidence par ce schéma ? (0,5 pt) b) Illustrez cette fonction en utilisant les chromosomes A et B. (1 pt)

**Exercice 2 : Reproduction chez les Spermaphytes (4 pts)**
Chez le maïs, au moment de la fécondation, le tube pollinique qui entre dans le pistil renferme trois noyaux (A, B et C) et le sac embryonnaire renferme 8 noyaux (1 à 8) (document 1).
1. Sachant que A est le noyau végétatif et que 7 et 8 sont les synergides, lesquelles des combinaisons suivantes : A-B-C, 4-5-C, A-6, 7-6-8, B-C-6, 1-2-C, B-6, 1-2-3 donneront : a) l'œuf embryon ? (0,5 pt) b) l'œuf albumen ? (0,5 pt)
2. Comparez les deux combinaisons choisies du point de vue chromosomique. (1 pt)
3. De ces deux œufs, lequel donnera la plantule dans la graine mûre ? Justifiez. (1 pt)
4. Expliquez en quelques lignes la double fécondation. (1 pt)

## Partie C : Résolution d'un problème (reproduction humaine) (6 pts)
Monsieur A présente un retard de puberté. Ses testicules sont de petite taille et sa concentration plasmatique en testostérone est très basse.

Document 1 : concentrations plasmatiques de LH et de FSH (UI.L⁻¹).

| | LH | FSH |
|---|---|---|
| Individu témoin | 2 à 10 | 1 à 12 |
| Monsieur A | < 0,9 | < 0,4 |

Document 2 : certains patients présentant les mêmes symptômes reçoivent des injections de GnRH toutes les deux heures. Avant injection : LH ≈ 0 et testostérone = 63 ; avec injection pulsatile de GnRH : LH pulsatile (≈ 15 à 30 UI.L⁻¹) et testostérone = 500. Chez Monsieur A, avec le même traitement, la LH et la testostérone restent anormalement basses.

Document 3a : extrait de la séquence du récepteur de la GnRH (protéine membranaire des cellules de l'hypophyse antérieure), acides aminés 166 à 171 :
- individu témoin : … Leu – Ser – Val – Phe – Ala …
- Monsieur A : … Leu – Ser – Arg – Val – Phe – Ala …

Document 3b : la fixation de la GnRH sur son récepteur provoque normalement une augmentation de la production d'inositol-phosphate (IP) dans la cellule hypophysaire ; l'IP est nécessaire à la production de LH et de FSH. Avec des concentrations croissantes de GnRH (10⁻⁹ à 10⁻⁷ mol.L⁻¹), la quantité d'IP augmente chez le témoin (≈ 0,2 → 3) mais reste à sa valeur de base (≈ 0,2) chez Monsieur A.

1. Quel est le problème posé par ces données ? (0,5 pt)
2. De l'analyse du document 1, quelle hypothèse pouvez-vous émettre ? (1 pt)
3. L'analyse du document 2 permet-elle de confirmer cette hypothèse ? Justifiez. (1,5 pt)
4. Après comparaison des séquences du document 3a, quelle nouvelle hypothèse pouvez-vous émettre ? (1 pt)
5. Après analyse du document 3b, expliquez l'origine de l'anomalie de Monsieur A. (2 pts)`,
  solution: `## Partie A
**I.** - **Parabiose** : union chirurgicale de deux animaux qui établit entre eux une circulation sanguine commune.
- **Pollinisation** : transport du grain de pollen de l'anthère d'une étamine jusqu'au stigmate d'un pistil.
- **Crossing-over** : échange de segments de chromatides entre deux chromosomes homologues appariés, au niveau des chiasmas, pendant la prophase I de la méiose.
- **Nidation** : implantation de l'embryon (blastocyste) dans la muqueuse utérine.

**II.** a = **faux** (elle est produite par les cellules de Leydig, situées entre les tubes séminifères) ; b = **vrai** ; c = **faux** (il n'y a pas de réplication de l'ADN entre les deux divisions de la méiose) ; d = **vrai** (elles sont issues de la réplication d'une même molécule d'ADN ; seul un crossing-over peut les rendre différentes).

**III.** **3 – 4 – 1 – 2 – 5** (prélèvement des ovocytes, prélèvement des spermatozoïdes, capacitation puis fécondation in vitro, transfert de l'embryon, nidation).

## Partie B — Exercice 1
1. Une **méiose** : les chromosomes homologues sont **appariés** en bivalents et forment des **chiasmas**, ce qui n'existe pas en mitose.
2. **Prophase I** (fin de prophase I, diplotène) : chromosomes à deux chromatides, homologues appariés et entrecroisés, pas encore rangés sur la plaque équatoriale.
3. a) On compte **4 bivalents** : **2n = 8** (n = 4).
b) Chaque bivalent peut s'orienter de deux façons sur la plaque équatoriale : 2⁴ = 16 orientations, soit **2ⁿ⁻¹ = 8 plaques métaphasiques différentes** (deux orientations symétriques donnent la même plaque).
4. Sans crossing-over : **2ⁿ = 2⁴ = 16 types** de cellules (gamètes) différents ; les crossing-over en augmentent encore le nombre.
5. a) Le **brassage intrachromosomique** (crossing-over entre chromatides des chromosomes homologues A et B), qui s'ajoute au brassage interchromosomique.
b) Schéma : avant échange, A porte (par exemple) les allèles a1 et b1 sur ses deux chromatides, B porte a2 et b2. Au niveau du chiasma, une chromatide de A échange un segment avec une chromatide de B. Après la méiose, on obtient quatre chromatides différentes : **a1 b1** et **a2 b2** (parentales), **a1 b2** et **a2 b1** (recombinées).

## Partie B — Exercice 2
1. a) **Œuf embryon (œuf principal)** : **B-6** (un noyau spermatique + l'oosphère).
b) **Œuf albumen** : **4-5-C** (l'autre noyau spermatique + les deux noyaux polaires du sac embryonnaire).
2. L'œuf embryon est **diploïde (2n)** : n (spermatique) + n (oosphère). L'œuf albumen est **triploïde (3n)** : n (spermatique) + n + n (noyaux polaires).
3. L'**œuf principal (2n)** : il se divise pour former l'**embryon** (la plantule). L'œuf albumen donne l'**albumen**, tissu de réserves qui nourrit l'embryon.
4. Le tube pollinique apporte deux noyaux spermatiques dans le sac embryonnaire : l'un féconde l'**oosphère** (œuf principal 2n → embryon), l'autre s'unit aux **deux noyaux polaires** (œuf albumen 3n → albumen). Deux fécondations ont lieu en même temps : c'est la **double fécondation**, propre aux angiospermes.

## Partie C
1. Quelle est l'origine du retard de puberté (testostérone très basse) de Monsieur A ?
2. LH et FSH sont **effondrées** chez M. A : ses testicules ne sont pas stimulés, d'où la testostérone basse. Hypothèse : le défaut se situe **en amont des testicules**, au niveau de l'**hypophyse** ou de l'**hypothalamus** (manque de GnRH).
3. Chez les autres patients, l'injection pulsatile de GnRH fait remonter la LH et la testostérone (63 → 500) : leur hypophyse fonctionne, il leur manquait la GnRH (cause hypothalamique). Chez M. A, la GnRH est **sans effet** : l'hypothèse d'un simple manque de GnRH est **rejetée** pour lui ; c'est son **hypophyse** qui ne répond pas à la GnRH.
4. Le récepteur de M. A possède un **acide aminé supplémentaire (Arg)** entre Ser et Val : il résulte d'une **mutation par addition** (insertion d'un triplet) du gène codant ce récepteur. Hypothèse : le **récepteur à GnRH anormal** ne fonctionne pas.
5. Chez le témoin, la GnRH fait augmenter l'IP (signal nécessaire à la sécrétion de LH et FSH) proportionnellement à sa concentration ; chez M. A, l'IP reste à sa valeur de base quelle que soit la dose de GnRH. Le récepteur muté **ne transmet pas le signal** de la GnRH : les cellules hypophysaires ne produisent ni LH ni FSH, les testicules ne sont pas stimulés et la testostérone reste très basse, d'où le retard pubertaire. L'origine est donc **génétique** : une mutation du gène du récepteur hypophysaire de la GnRH.`,
}

const compoS2 = {
  title: 'Composition 2ᵉ trimestre 2021-2022 (zone 1) — SVT Tle D, sujet n°2',
  pages: p('svt-1', 1, 2, 3),
  statement: `**Inspection des lycées d'enseignement général zone 1 (Brazzaville-Pool) — Compositions du 2ᵉ trimestre 2021-2022 — Terminale D — SVT — 4 heures — Sujet n°2** (figures sur les pages scannées)

## Partie A : Restitution des connaissances (6 pts)
**I. QCM (2 pts)** — Choisissez la bonne réponse (exemple : 5 = e).
1. Le crossing-over : a) se produit au moment de la fécondation ; b) se réalise entre chromosomes homologues ; c) est sans effet sur la diversité des gamètes.
2. La fécondation : a) annule le brassage génétique réalisé par la méiose ; b) assure une séparation indépendante des allèles de chaque gène ; c) contribue à la variation génétique des individus d'une espèce.
3. Les menstruations sont la conséquence d'une : a) augmentation du taux d'hormones ovariennes ; b) augmentation du taux de progestérone ; c) augmentation du taux d'œstrogènes ; d) diminution du taux d'hormones ovariennes.
4. Après la double fécondation chez les Spermaphytes : a) l'ovule est transformé en fruit ; b) l'ovule est transformé en graine ; c) l'ovaire est transformé en graine.
**II. Appariement (2 pts)** — Colonne A : 1. GnRH ; 2. HCG ; 3. Prolactine ; 4. Œstradiol — Colonne B : a. Ovaire ; b. Hypophyse ; c. Hypothalamus ; d. Placenta.
**III. Schéma (2 pts)** — Réalisez le schéma annoté d'un ovule droit d'angiosperme.

## Partie B : Application des connaissances (8 pts)
**Exercice 1 : Division cellulaire (4 pts)** — Les schémas a, b et c du document 1 représentent des figures de divisions observées dans un testicule ; seul le comportement de deux paires de chromosomes a été représenté.
1. Indiquez la phase de division des cellules a, b et c. (1,5 pt)
2. Le document 2 représente des chromosomes présents dans les cellules des tubes séminifères (lots A, B et C).
a) Retrouvez à quelle cellule germinale appartient chacun des lots A, B et C. (1,5 pt)
b) Que représentent les chromosomes n°3 du lot C ? (0,5 pt)
c) Quelle phase succédera au schéma b ? (0,5 pt)

**Exercice 2 : Reproduction humaine (4 pts)** — Dans l'espèce humaine, la reproduction fait intervenir des cellules sexuelles qui se forment au cours de la gamétogenèse ; les cellules germinales y subissent deux types de divisions.
1. a) Nommez ces divisions. (0,5 pt) b) Précisez les phases de la gamétogenèse au cours desquelles se produisent ces divisions. (1 pt) c) Dites à quelles périodes de la vie elles interviennent chez l'homme et chez la femme. (0,5 pt)
3. En considérant l'ensemble des chromosomes de l'espèce, donnez le nombre de types de gamètes qu'on peut obtenir à l'issue de l'ovogenèse, sachant que les chromosomes homologues sont d'origines différentes (paternelle et maternelle). Justifiez. (1 pt)
4. Au moment de l'éjaculation, on compte près de cent millions de spermatozoïdes par mm³ de sperme et environ 39 % d'entre eux sont anormaux (grosse tête, deux queues, queue enroulée). À quelle phase de la spermatogenèse interviennent ces anomalies ? Justifiez. (1 pt)

## Partie C : Résolution d'un problème (reproduction chez les Spermaphytes) (6 pts)
Dans un jardin scolaire où l'on trouve des plants de tomates en fleurs, les élèves, pour arroser, versent de l'eau sur les fleurs. Le professeur fait remarquer que ce procédé risque de faire baisser la récolte. D'autre part, lorsqu'il pleut beaucoup, on constate que les arbres portent très peu de fruits : on parle de « coulure ».
- Document 1 : grain de pollen (pore germinatif, noyau germinatif, noyau reproducteur) et pistil (stigmate, style, ovaire, ovule).
- Document 2 : germination du grain de pollen — lot 1 (gélose + eau pure) : les grains de pollen éclatent ; lot 2 (gélose + solution nutritive) : la plupart des grains germent, les tubes polliniques croissent normalement.
- Document 3 : nombre de grains de pollen germés en fonction de la quantité d'eau disponible sur le stigmate (courbe décroissante : environ 100 grains germés à 10 % d'eau, aucun vers 80 %).
1. Quel est le problème posé ? (0,5 pt)
2. À partir du document 1 et de vos connaissances, expliquez comment se forment la graine et le fruit chez les Spermaphytes. (1,5 pt)
3. Après avoir interprété le document 2, quelle hypothèse émettez-vous pour expliquer le problème posé ? (1,5 pt)
4. L'interprétation du document 3 peut-elle justifier la rareté des fruits pendant la saison des pluies ? (1,5 pt)
5. Quelle conclusion tirez-vous quant au problème posé ? (1 pt)`,
  solution: `## Partie A
**I.** 1 = **b** ; 2 = **c** ; 3 = **d** ; 4 = **b**.
**II.** 1 = **c** (GnRH : hypothalamus) ; 2 = **d** (HCG : placenta, d'abord le trophoblaste) ; 3 = **b** (prolactine : hypophyse) ; 4 = **a** (œstradiol : ovaire).
**III.** Schéma de l'**ovule droit (orthotrope)** : le **funicule** (pédoncule qui rattache l'ovule au placenta de l'ovaire), la **chalaze** (base où arrivent les vaisseaux), les deux **téguments** (externe et interne) qui laissent au sommet un orifice, le **micropyle**, le **nucelle**, et dans le nucelle le **sac embryonnaire** avec, côté micropyle, l'**oosphère** encadrée des deux **synergides**, au centre les deux **noyaux polaires** (ou noyau secondaire), et côté chalaze les trois **antipodes**. Titre : « Ovule droit d'Angiosperme ».

## Partie B — Exercice 1
1. - **a** : **anaphase de mitose** — à chaque pôle migrent 4 chromosomes à **une** chromatide (les deux paires complètes).
- **b** : **métaphase II** — 2 chromosomes seulement (un de chaque paire), à **deux** chromatides, sur la plaque équatoriale.
- **c** : **anaphase I** — à chaque pôle migrent 2 chromosomes à **deux** chromatides (séparation des homologues).
2. a) - Lot **A** (3 chromosomes à une chromatide, un seul exemplaire de chaque) : cellule haploïde → **spermatide** (ou spermatozoïde).
- Lot **B** (3 chromosomes à deux chromatides, un de chaque paire) : **spermatocyte II** (après la division réductionnelle).
- Lot **C** (3 paires de chromosomes à deux chromatides) : **spermatocyte I** (cellule diploïde dont l'ADN est répliqué).
b) Les deux chromosomes n°3 du lot C sont différents : ce sont les **chromosomes sexuels X et Y** (cellule d'un individu mâle).
c) Après la métaphase II (schéma b) vient l'**anaphase II** (séparation des chromatides de chaque chromosome).

## Partie B — Exercice 2
1. a) La **mitose** et la **méiose**.
b) Les mitoses ont lieu pendant la **phase de multiplication** (des spermatogonies ou ovogonies) ; la méiose pendant la **phase de maturation** (spermatocytes / ovocytes I et II).
c) - Chez l'**homme** : mitoses et méiose se déroulent **en continu de la puberté jusqu'à la fin de la vie**.
- Chez la **femme** : les mitoses ont lieu **pendant la vie fœtale** ; la méiose commence aussi avant la naissance (blocage en prophase I), reprend à chaque cycle **de la puberté à la ménopause**, et la méiose II ne s'achève qu'au moment de la **fécondation**.
3. 2n = 46 : 23 paires. À la méiose, chaque paire se sépare indépendamment des autres (brassage interchromosomique), chaque gamète recevant au hasard le chromosome paternel ou maternel de chaque paire : **2²³ = 8 388 608 types de gamètes** (sans compter les crossing-over).
4. Ces anomalies sont **morphologiques** (forme de la tête, du flagelle) : elles apparaissent pendant la **spermiogenèse**, phase de **différenciation** des spermatides en spermatozoïdes (condensation du noyau, formation de l'acrosome et du flagelle), et non pendant les divisions.

## Partie C
1. Pourquoi l'eau versée sur les fleurs et les fortes pluies font-elles baisser la production de fruits (coulure) ?
2. Le grain de pollen déposé sur le **stigmate** (pollinisation) **germe** : il émet par son pore germinatif un **tube pollinique** qui traverse le style jusqu'à l'ovule et y apporte deux noyaux reproducteurs : c'est la **double fécondation** (œuf principal 2n et œuf albumen 3n). Ensuite l'**ovule** fécondé devient la **graine** (embryon + réserves + téguments) et la paroi de l'**ovaire** se transforme en **fruit**.
3. Dans l'eau pure, les grains de pollen **éclatent** (l'eau entre par osmose dans le grain, plus concentré que ce milieu) ; dans une solution nutritive, ils germent. Hypothèse : l'eau déposée sur les fleurs fait éclater les grains de pollen ; sans germination, pas de tube pollinique, pas de fécondation, donc pas de fruits.
4. Oui : plus la quantité d'eau sur le stigmate est grande, moins il y a de grains germés (≈ 100 à 10 % d'eau, aucun vers 80 %). Pendant la saison des pluies, les stigmates sont gorgés d'eau : le pollen ne germe pas et les fleurs ne sont pas fécondées.
5. Conclusion : l'excès d'eau sur les fleurs (arrosage sur les fleurs, fortes pluies) empêche la germination du pollen, donc la fécondation, d'où la chute des fleurs sans fruits (coulure). Il faut arroser au pied des plantes.`,
}

const devoirChaminade = {
  title: 'Devoir de classe 2021-2022 (Lycée Chaminade) — SVT Tle D : tectonique, méiose, synthèse des protéines',
  pages: p('svt-devoir-2', 1, 2, 3),
  statement: `**Lycée Chaminade — Département des SVT — Année scolaire 2021-2022 — Devoir de classe — SVT — Terminale D — 3 heures** (figures sur les pages scannées)

## Partie A : Restitution des connaissances
**I. Questions à choix multiples (2 points)** — Associez chaque lettre à la bonne réponse (exemple : 5 = 3).
- a) L'asthénosphère fait partie : 1. du manteau ; 2. de la croûte terrestre ; 3. de la lithosphère.
- b) Une plaque est formée de l'ensemble : 1. lithosphère et manteau ; 2. croûte et asthénosphère ; 3. croûte et manteau supérieur.
- c) La duplication de l'ADN a lieu : 1. entre les deux divisions de la méiose ; 2. avant la division réductionnelle ; 3. avant chacune des divisions de la méiose.
- d) Une mutation silencieuse : 1. ne modifie pas la séquence d'ADN ; 2. ne modifie pas la séquence d'acides aminés ; 3. rend non fonctionnel le polypeptide correspondant.

**II. Vrai ou faux (2 points)** (exemple : 5 = faux)
1. La croûte terrestre est une mince pellicule flottant sur un manteau fait de magma liquide.
2. Le braconnage est une chasse abusive des animaux dans le but de protéger d'autres animaux.
3. L'anaphase II est caractérisée par la migration polaire de n chromosomes fissurés.
4. La non-dégradation de la matière plastique est responsable du réchauffement du sol.

**III. Définitions (2 points)** — Définissez : cycle cellulaire, équidistance, pollution, marge active.

## Partie B : Application des connaissances
**Exercice 1 : Division cellulaire (4 pts)** — Le schéma représente la disposition des chromosomes au cours d'une division cellulaire (chromosomes A et B).
1. De quelle division s'agit-il ? (0,5 pt)
2. À quelle phase de cette division correspond ce document ? Justifiez. (0,5 pt)
3. a) Quelle est la garniture chromosomique de cette cellule ? (0,5 pt) b) Combien de plaques métaphasiques peut-on avoir ? (0,75 pt)
4. Déterminez le nombre de types de cellules obtenues à l'issue de cette division. (0,75 pt)
- a) Quelle fonction génétique a été mise en évidence dans ce schéma ? (0,5 pt)
- b) Schématisez cette fonction en utilisant les chromosomes A et B. (0,5 pt)

**Exercice 2 : Synthèse des protéines (4 points)** — Soit la séquence des nucléotides d'un gène (brin d'ADN transcrit) :
\`…TAC GAC CAC CTC TCC ACG GAC…\`
1. Écrivez la séquence de la protéine. (1 pt)
2. Sur le brin transcrit, on remplace le nucléotide de la position 4 par un nucléotide à adénine. a) Comment nomme-t-on cette mutation ? (0,5 pt) b) Quelle est sa conséquence ? (0,75 pt) c) Quelle propriété du code génétique a-t-on mise en évidence ? (0,75 pt)
3. On incorpore sur le brin transcrit un nucléotide à thymine entre les nucléotides 6 et 7. a) Comment nomme-t-on cette mutation ? (0,5 pt) b) Quelle est sa conséquence ? (0,5 pt)

Extrait du code génétique : Mét = AUG ; Leu = CUG, UUG ; Glu = GAG ; Val = GUG ; Cys = UGU, UGC ; Arg = AGG ; Ser = AGU ; Gly = GGA ; Pro = CCU.

## Partie C : Résolution d'un problème (cartographie) (6 points)
Des géologues et géophysiciens, à bord d'un bateau foreur, partent des Petites Antilles en direction de l'Afrique pour mener une prospection sur les fonds océaniques. Ils veulent expliquer le mécanisme qui affecte ces fonds et réalisent des mesures qui les conduisent aux documents suivants.
- Document 1 : coupe schématique du plancher océanique entre les Antilles et l'Afrique (Petites Antilles, fosse océanique, plaine abyssale, rift, talus et plateau continental, Afrique).
- Document 2 : frontières des plaques lithosphériques (A : dorsale océanique ; B ; C : Sumatra ; D : Pérou).
1. De quel problème s'agit-il ?
2. Analysez le document 2 au niveau des zones représentées par les lettres A-B et C-D et associez à chaque zone le nom de la frontière et le phénomène correspondant.
3. Formulez une hypothèse quant au mécanisme de l'expansion océanique.
4. Le document 1 permet-il de confirmer l'hypothèse émise en 3 ? Justifiez votre réponse.`,
  solution: `## Partie A
**I.** a = **1** ; b = **3** (la lithosphère = croûte + manteau supérieur rigide) ; c = **2** (pendant l'interphase qui précède la méiose) ; d = **2**.

**II.** 1. **Faux** : le manteau est **solide** ; seule l'asthénosphère est plus ductile, mais ce n'est pas un magma liquide.
2. **Faux** : le braconnage est une chasse (ou pêche) **illégale**, pratiquée pour l'ivoire, la viande, etc. ; il menace les espèces.
3. **Faux** : en anaphase II, chaque pôle reçoit n chromosomes **à une seule chromatide** (les chromatides se séparent). La migration de n chromosomes fissurés (à deux chromatides) caractérise l'**anaphase I**.
4. **Faux** : le plastique non dégradé **pollue** et **imperméabilise** le sol (il gêne l'infiltration de l'eau, l'aération et l'activité des êtres vivants du sol) ; il n'est pas responsable de son réchauffement.

**III.** - **Cycle cellulaire** : ensemble des étapes que traverse une cellule entre deux divisions successives : interphase (G1, S, G2) puis mitose.
- **Équidistance** : différence d'altitude constante entre deux courbes de niveau successives d'une carte topographique.
- **Pollution** : dégradation d'un milieu (air, eau, sol) par l'introduction de substances ou d'énergie nuisibles aux êtres vivants.
- **Marge active** : bordure d'un continent située au contact d'une **zone de subduction** (fosse océanique, séismes, volcanisme), par opposition à une marge passive.

## Partie B — Exercice 1
1. Une **méiose** (homologues appariés en bivalents, avec chiasmas).
2. **Prophase I** : chromosomes à deux chromatides, homologues appariés et entrecroisés (chiasmas), pas encore alignés sur la plaque équatoriale.
3. a) **4 bivalents** : **2n = 8**.
b) 2ⁿ⁻¹ = 2³ = **8 plaques métaphasiques** différentes possibles (chaque bivalent peut s'orienter de deux façons).
4. Sans crossing-over : **2ⁿ = 2⁴ = 16 types** de cellules.
a) Le **brassage intrachromosomique** (crossing-over entre les chromatides des homologues A et B).
b) Schéma : deux homologues A et B appariés ; au chiasma, une chromatide de A échange un segment avec une chromatide de B ; à la fin de la méiose, on obtient deux chromatides parentales et deux chromatides recombinées (portant chacune un morceau de A et un morceau de B).

## Partie B — Exercice 2
1. Brin transcrit : TAC GAC CAC CTC TCC ACG GAC
ARNm (complémentaire) : **AUG CUG GUG GAG AGG UGC CUG**
Protéine : **Mét – Leu – Val – Glu – Arg – Cys – Leu**
2. Le 4ᵉ nucléotide (G de GAC) est remplacé par A : le triplet devient AAC, le codon **UUG**.
a) Mutation par **substitution**.
b) UUG code encore la **leucine** : la protéine est inchangée (mutation **silencieuse**).
c) La **redondance** (dégénérescence) du code génétique : plusieurs codons codent le même acide aminé.
3. Après insertion de T : TAC GAC T|CA CCT CTC CAC GGA C… → nouvelle lecture TAC GAC TCA CCT CTC CAC GGA
ARNm : AUG CUG **AGU GGA GAG GUG CCU** → Mét – Leu – **Ser – Gly – Glu – Val – Pro**…
a) Mutation par **addition** (insertion).
b) **Décalage du cadre de lecture** : tous les acides aminés à partir du 3ᵉ sont changés ; la protéine obtenue est différente et en général **non fonctionnelle**.

## Partie C
1. Il s'agit d'expliquer le mécanisme de l'**expansion des fonds océaniques** (mouvement des plaques lithosphériques).
2. - Zone **A-B** : **dorsale océanique** (médio-atlantique) → **frontière divergente** (limite d'accrétion) : les plaques s'écartent, du magma remonte et forme une nouvelle lithosphère océanique ; volcanisme et séismes superficiels.
- Zone **C-D** (Sumatra, Pérou) : **fosses océaniques** → **frontière convergente** (zone de **subduction**) : la lithosphère océanique plonge sous une autre plaque ; séismes profonds, volcanisme explosif, chaînes de montagnes.
3. Hypothèse : la lithosphère océanique est **créée au niveau des dorsales** par remontée de matériaux du manteau, s'écarte de part et d'autre de la dorsale (expansion), puis **disparaît dans les fosses** par subduction.
4. Oui : la coupe Antilles-Afrique montre au milieu de l'océan un **rift** (axe de la dorsale) d'où partent symétriquement les plaines abyssales, et du côté des Petites Antilles une **fosse océanique** où le plancher disparaît. On retrouve donc une zone de création et une zone de disparition du plancher océanique, ce qui confirme l'hypothèse.`,
}

const tdSpermaphytes = {
  title: 'TD Spermaphytes — SVT Tle D : double fécondation',
  pages: p('svt-td-2', 1),
  statement: `**TD Spermaphytes — Terminale D** (figures sur la page scannée)

**Exercice 1** — Chaque série d'affirmations comporte une seule réponse exacte. Repérez-la.
1. On parle de double fécondation chez les spermaphytes parce que : a) deux spermatozoïdes apportés par le tube pollinique fécondent l'oosphère ; b) deux noyaux du grain de pollen interviennent ; c) deux noyaux centraux du sac embryonnaire sont fécondés à la fois ; d) deux zygotes se forment au terme de ce processus.
2. Les plantes dioïques sont les plantes dont les pieds : a) possèdent tous des fleurs bisexuées ; b) possèdent des fleurs à la fois mâles et femelles ; c) sont pour les uns à fleurs unisexuées mâles et pour les autres à fleurs unisexuées femelles ; d) possèdent des fleurs unisexuées, les unes mâles, les autres femelles.
3. Chez les spermaphytes, le gamète femelle est : a) l'ovule ; b) le sac embryonnaire ; c) une antipode ; d) l'oosphère.

**Exercice 2** — Chez le maïs, au moment de la fécondation, le tube pollinique qui entre dans le pistil renferme trois noyaux (A, B, C) ; le sac embryonnaire renferme 8 noyaux (1 à 8).
1. Sachant que A est le noyau végétatif et que 7 et 8 sont les synergides, lesquelles des combinaisons suivantes : ABC, 45C, A6, 768, BC6, 12C, B6, 123 donneront : a) l'œuf embryon ? b) l'œuf albumen ?
2. Comparez les deux combinaisons choisies du point de vue chromosomique.
3. De ces deux œufs, lequel donnera la plantule dans la graine mûre ? Pourquoi ?

**Exercice 3** — Le document est un schéma de la coupe du sac embryonnaire pendant la fécondation chez l'oignon (légendes 1 à 6).
1. Schématisez ce document et annotez-le.
2. Expliquez en quelques lignes le phénomène biologique qu'illustre ce document.
3. Quelle est son importance ?`,
  solution: `**Exercice 1**
1. **d)** — deux zygotes se forment : l'œuf principal (2n) et l'œuf albumen (3n). (a et c sont inexacts : un seul noyau spermatique féconde l'oosphère, l'autre s'unit aux noyaux polaires ; b ne suffit pas à définir la double fécondation.)
2. **c)** — chez une plante dioïque, les fleurs mâles et les fleurs femelles sont portées par des pieds différents (d décrit une plante monoïque comme le maïs).
3. **d)** — l'**oosphère**.

**Exercice 2**
1. a) Œuf embryon : **B6** (noyau spermatique + oosphère). b) Œuf albumen : **45C** (noyau spermatique + deux noyaux polaires).
2. Œuf embryon : **2n** (n + n) ; œuf albumen : **3n** (n + n + n).
3. L'**œuf embryon** : en se divisant, il forme l'embryon, c'est-à-dire la future plantule (radicule, tigelle, gemmule, cotylédon) ; l'albumen n'est qu'un tissu de réserves.

**Exercice 3**
1. Schéma du sac embryonnaire pendant la fécondation : **tube pollinique** entrant par le **micropyle**, deux **noyaux spermatiques**, **synergides**, **oosphère** (fécondée par un noyau spermatique), **noyaux polaires** ou noyau secondaire (fécondés par l'autre noyau spermatique), **antipodes** au pôle opposé, nucelle et téguments autour. Titre : « double fécondation chez l'oignon ».
2. C'est la **double fécondation** : le tube pollinique libère ses deux noyaux spermatiques ; l'un fusionne avec l'oosphère et donne l'œuf principal (2n), l'autre fusionne avec les deux noyaux polaires et donne l'œuf albumen (3n).
3. L'œuf principal donne l'**embryon** (nouvelle plante) ; l'œuf albumen donne l'**albumen**, réserve nutritive qui nourrit l'embryon lors de la germination. La double fécondation déclenche aussi la transformation de l'ovule en **graine** et de l'ovaire en **fruit**.`,
}

const tdNerfMuscle = {
  title: 'TD SVT Tle D — Nerf, muscle, réflexes, Sordaria et cœur (6 exercices)',
  difficulty: 3,
  pages: p(G, 13, 14),
  statement: `**TD de SVT — Terminale D** (figures sur les pages scannées)

**Exo I** — Une chaîne neuronique : deux électrodes excitatrices sont placées au point E sur une dendrite ; quatre oscillographes sont placés en O₁, O₂, O₃ et O₄ (O₁ et O₂ sur l'axone du premier neurone, O₃ sur le neurone suivant, après une synapse, O₄ du côté opposé à O₁ par rapport à E). On applique des courants et on détermine pour chaque intensité le temps d'excitation minimum donnant une réponse sur O₁ :

| Intensité (mA) | 0,1 | 0,1 | 0,1 | 0,15 | 0,2 | 0,3 | 0,4 | 0,7 | 1,2 |
|---|---|---|---|---|---|---|---|---|---|
| Temps d'excitation (ms) | 2 | 1 | 0,9 | 0,6 | 0,5 | 0,4 | 0,3 | 0,2 | 0,1 |

1. Construisez la courbe I = f(t) (1 cm pour 0,2 mA ; 1 cm pour 0,2 ms).
2. Interprétez cette courbe. Donnez les valeurs caractéristiques de l'excitabilité de cette fibre.
3. a) On excite la fibre avec I₁ = 0,2 mA pendant t₁ = 0,3 ms. Qu'observe-t-on sur O₁ et O₂ ? Justifiez. b) Même question avec I₂ = 0,3 mA pendant t₂ = 0,6 ms.
4. On porte en E une excitation efficace. a) Qu'observe-t-on sur chacun des oscillographes O₁, O₂, O₃ et O₄ ? Où constate-t-on des différences ? Pourquoi ? b) Représentez et analysez la réponse obtenue en O₁. c) La vitesse de l'influx dans cette fibre est de 50 m/s, la distance E-O₃ est de 12 mm et le temps mis par l'influx entre E et O₃ est de 0,34 ms. Interprétez ces résultats.

**Exo II** — On stimule un muscle gastrocnémien de grenouille avec un courant légèrement supérieur à la rhéobase de ce muscle ; on obtient le document 1 (myogramme avec deux secousses C₁ et C₂, signal électrique avec fermeture A et ouverture B du circuit, temps en 1/100 s).
1. Combien y a-t-il eu de stimulations efficaces ? Justifiez.
2. Interprétez la réponse C₁.
3. Quels myogrammes obtient-on si l'on ouvre le circuit en A ? en B ? Représentez-les.
4. On arrête le cylindre et on le déplace à la main après chaque stimulation d'intensité croissante (document 2 : pas de réponse aux premières stimulations, puis réponses d'amplitude croissante, puis amplitude maximale constante). a) Décrivez ces résultats et les différences avec les précédents. b) Quelle interprétation proposez-vous ? c) Quelle(s) caractéristique(s) des cellules musculaires met-on en évidence ?

**Exo III** — Un myogramme (une secousse) est obtenu avec un myographe isotonique ; la vitesse du cylindre est de 50 cm/s.
1. Analysez ce myogramme en déterminant la durée des différentes phases.
2. On porte sur le muscle deux excitations identiques légèrement supraliminaires, séparées par : a) 2/10 s ; b) 6/100 s ; c) 2/100 s. Dessinez et interprétez les myogrammes.
3. Quelles seraient les réponses du muscle à 12 excitations successives séparées par a) 6/100 s ; b) 2/100 s ? Interprétez.

**Exo IV**
1. Un chiot nourri exclusivement de lait pendant plusieurs mois ignore tout autre aliment. a) On lui montre de la viande : il ne salive pas. b) On la lui fait manger : il salive abondamment ; on répète chaque jour. c) Au bout de huit jours, on lui montre la viande sans la lui donner : il salive. Quel est l'excitant absolu ? l'excitant conditionnel ? Sur quels récepteurs agissent-ils ? Expliquez pourquoi la vue de la viande, inefficace en a, devient efficace en c.
2. Un chien dressé à saliver à la vue de la viande reçoit cette présentation huit fois de suite toutes les 3 min ; après 25 min, on lui donne la viande à manger, puis on recommence à la lui montrer toutes les 3 min :

| Temps (min) | 0 | 3 | 6 | 9 | 12 | 15 | 18 | 21 |
|---|---|---|---|---|---|---|---|---|
| Salive (cm³) | 4 | 3,8 | 3,6 | 3 | 2 | 1 | 0 | 0 |

Interprétez. Comparez l'efficacité d'un excitant absolu à celle d'un excitant conditionnel.

**Exo V** — On croise deux souches de Sordaria (même cycle que Neurospora) : une souche sauvage à spores lisses et une souche mutée à spores ridées. On obtient six types d'asques selon l'ordre des spores : I (4 lisses / 4 ridées) : 27 ; II (4 ridées / 4 lisses) : 33 ; III (2/2/2/2) : 13 ; IV (2/2/2/2 inversé) : 9 ; V (2/4/2) : 7 ; VI (2/4/2 inversé) : 11.
1. Écrivez le génotype des mycéliums parentaux et celui des œufs à l'origine des ascospores.
2. Dessinez le comportement des chromosomes pendant la méiose conduisant aux dispositions I et II ; quel phénomène la disposition III met-elle en évidence ? Schématisez-la.
3. Évaluez la distance gène-centromère.

**Exo VI**
A. Un schéma représente un cœur de mammifère (éléments 1 à 10).
1. Donnez une légende complète. 2. À quel tissu cardiaque appartiennent les structures 2, 4, 5 et 6 ? 3. Établissez la différence anatomique entre ce cœur et celui d'un batracien.
B. 1. On détruit par cautérisation la structure 2 : oreillettes et ventricules cessent de battre, puis reprennent à un rythme plus lent. 2. Sur un autre cœur, on sectionne la structure 5 : les oreillettes battent normalement, les ventricules s'arrêtent puis reprennent sur un rythme plus lent. 3. Un fragment d'oreillette droite comprenant la structure 2, placé dans du Ringer, se contracte à 120 battements par minute. 4. Un fragment de la cloison interauriculaire comprenant la structure 4 se contracte à 50 battements par minute ; les deux fragments placés ensemble battent à 120 contractions par minute. (Les questions de la partie B ne figurent pas sur la copie : interprétez ces expériences.)`,
  solution: `## Exo I
1-2. La courbe est une hyperbole décroissante : plus le courant est intense, plus la durée nécessaire est courte ; en dessous d'une intensité minimale, aucune durée ne suffit.
- **Rhéobase = 0,1 mA** (intensité minimale efficace pour une durée longue).
- **Chronaxie** = durée nécessaire pour 2 × 0,1 = 0,2 mA → **0,5 ms**.
3. a) Pour 0,2 mA, il faut au moins 0,5 ms : 0,3 ms est trop court → excitation **inefficace**, rien sur O₁ ni O₂.
b) Pour 0,3 mA, il suffit de 0,4 ms : 0,6 ms > 0,4 ms → excitation **efficace** : potentiel d'action enregistré en O₁ puis en O₂ (un peu plus tard, car plus loin).
4. a) Des potentiels d'action apparaissent en O₁ et O₂ ; l'influx se propage aussi dans l'autre sens à partir de E, vers O₄ (sur le même neurone, la conduction se fait dans les deux sens à partir du point excité). En O₃, la réponse est **retardée**, car l'influx doit franchir une **synapse**. (Un oscillographe placé sur un neurone situé **avant** une synapse ne recevrait rien : la transmission synaptique est à sens unique.)
b) En O₁ : potentiel d'action (avec une électrode interne : dépolarisation rapide d'environ −70 à +30 mV, repolarisation, légère hyperpolarisation, retour au repos ; avec deux électrodes externes : tracé diphasique).
c) À 50 m/s, 12 mm seraient parcourus en 0,012 / 50 = 0,24 ms. On mesure 0,34 ms : le retard de **0,1 ms** correspond au **délai synaptique** (temps de libération, diffusion et fixation du neurotransmetteur).

## Exo II
1. **Deux** stimulations efficaces : l'une à la **fermeture** (A) et l'autre à l'**ouverture** (B) du circuit ; chacune provoque une secousse (C₁ et C₂). Le courant qui passe entre A et B, constant, n'excite pas : seule une **variation brusque** d'intensité est efficace.
2. C₁ est une **secousse musculaire** : temps de latence, phase de contraction (raccourcissement), phase de relâchement.
3. Si le circuit est ouvert en A (pas de fermeture), aucun courant ne passe : aucune secousse. Avec seulement l'ouverture en B, une seule secousse (C₂) est enregistrée.
4. a) Pas de réponse pour les faibles intensités ; puis des secousses d'**amplitude croissante** avec l'intensité ; enfin une amplitude **maximale constante**. Dans l'expérience précédente, l'intensité était fixe.
b) Les fibres du muscle ont des seuils différents : quand l'intensité augmente, de plus en plus de fibres sont **recrutées** ; lorsque toutes répondent, l'amplitude est maximale.
c) Chaque **fibre** musculaire obéit à la loi du **tout ou rien** et possède un **seuil** propre ; le **muscle** entier ne suit pas cette loi.

## Exo III
1. Durée = longueur mesurée sur le tracé (cm) ÷ 50 cm/s. On distingue un **temps de latence**, une **phase de contraction** puis une **phase de relâchement**, plus longue ; chez la grenouille, une secousse dure de l'ordre de 0,1 s (par exemple 1 cm ↔ 0,02 s).
2. a) 2/10 s : la seconde excitation arrive après la fin de la secousse → **deux secousses séparées** identiques.
b) 6/100 s : elle arrive pendant le **relâchement** → la seconde secousse part d'un niveau plus haut : **fusion incomplète** (sommation), amplitude totale plus grande.
c) 2/100 s : elle arrive pendant la **contraction** → **fusion complète** : une seule contraction plus ample.
3. a) Excitations toutes les 6/100 s : **tétanos imparfait** (contraction soutenue mais tracé dentelé). b) Toutes les 2/100 s : **tétanos parfait** (plateau lisse). Ces résultats montrent la **sommation des contractions** : le muscle squelettique est tétanisable.

## Exo IV
1. - **Excitant absolu** : la viande **dans la bouche** ; il agit sur les **récepteurs gustatifs** de la langue (réflexe inné : salivation).
- **Excitant conditionnel** : la **vue** de la viande ; il agit sur les **récepteurs visuels** (rétine).
Au début (a), la vue de la viande est un excitant **neutre**. Associée de façon répétée à l'excitant absolu (b), elle finit par déclencher seule la salivation (c) : une **liaison temporaire nouvelle** s'est établie dans le cortex entre l'aire visuelle et le centre de la salivation. C'est un **réflexe conditionnel**.
2. Quand la vue de la viande n'est plus suivie de la nourriture, la salivation diminue (4 → 0 cm³ en 18 min) : le réflexe conditionnel s'**éteint** (inhibition d'extinction). Il faut le « renforcer » régulièrement par l'excitant absolu. L'excitant absolu est toujours efficace (réflexe inné, permanent) ; l'excitant conditionnel est efficace mais **instable**, il perd son effet s'il n'est pas renforcé.

## Exo V
1. Mycéliums (haploïdes) : sauvage **(+)** (spores lisses) et muté **(r)** (spores ridées). Œuf diploïde : **(+ // r)**.
2. Dispositions I et II (4 / 4) : **pas de crossing-over** entre le gène et le centromère ; les deux allèles se séparent dès la **division I** (préréduction). Disposition III (2 / 2 / 2 / 2) : un **crossing-over** a eu lieu entre le gène et le centromère ; les allèles ne se séparent qu'à la **division II** (postréduction). Il en est de même pour IV, V et VI.
3. Total des asques : 27 + 33 + 13 + 9 + 7 + 11 = **100**. Asques postréduits : 13 + 9 + 7 + 11 = **40**, soit 40 %. Dans un asque postréduit, la moitié seulement des chromatides est recombinée : distance gène-centromère = 40 / 2 = **20 unités** (centimorgans).

## Exo VI
A. 1. Légende du cœur : oreillettes droite et gauche, ventricules droit et gauche, cloison, valvules, vaisseaux (veines caves, aorte, artère pulmonaire), et les éléments du tissu nodal : **2 = nœud sinusal**, **4 = nœud auriculo-ventriculaire**, **5 = faisceau de His**, **6 = réseau de Purkinje** (identifications confirmées par les expériences de la partie B).
2. Les structures 2, 4, 5 et 6 appartiennent au **tissu nodal**, responsable de l'automatisme et de la conduction de l'excitation.
3. Le cœur de mammifère a **4 cavités** (2 oreillettes, 2 ventricules : circulations pulmonaire et générale complètement séparées) ; celui du batracien en a **3** (2 oreillettes, **un seul ventricule** où sangs oxygéné et non oxygéné se mélangent en partie).
B. Interprétation : le cœur est **automatique**. Le **nœud sinusal** (2), le plus rapide (120/min), impose son rythme à tout le cœur : c'est le **pacemaker**. Détruit, il est relayé par le **nœud auriculo-ventriculaire** (4), plus lent (50/min). Le **faisceau de His** (5) conduit l'excitation des oreillettes aux ventricules : sectionné, les ventricules ne reçoivent plus l'ordre et battent à leur propre rythme, plus lent. Placés ensemble, les deux fragments battent au rythme du plus rapide (120/min).`,
}

const exo220 = {
  title: 'Fascicule SVT — Exercice n°220 : le réflexe conditionnel chez le rat',
  pages: p(G, 10),
  statement: `Le professeur David Wied, à Utrecht (Hollande), a étudié le comportement des rats dans une cage d'expérimentation d'un type particulier. La cage se compose de deux compartiments identiques A et B, séparés par une barrière de 5 cm de hauteur. Le fond de la cage est une grille métallique : on peut envoyer une décharge électrique dans les pattes du rat par le plancher du compartiment où il se trouve. Tous les déplacements du rat sont enregistrés par une caméra de télévision ; le rat ne voit jamais l'expérimentateur.
Quand il reçoit la décharge dans un compartiment, il saute et franchit la barrière pour aller dans l'autre compartiment, non électrifié.
On entreprend une série d'expériences avec un signal sonore : pendant 5 secondes, le rat entend le signal sonore puis il reçoit une décharge électrique ; il saute dans le compartiment où il se sent en sécurité. On recommence plusieurs fois. À la longue, dès l'audition du signal sonore, le rat saute dans l'autre compartiment, évitant ainsi le choc. Lorsque les rats sont soumis chaque jour à 10 essais séparés par un intervalle moyen d'une minute, on constate au bout d'une quinzaine de jours qu'ils sautent au seul signal sonore.
1. a) L'expérimentateur a oublié de préciser certaines conditions d'expérimentation : lesquelles ? b) Analysez les résultats de ces expériences.
2. Précisez les différents éléments et établissez le trajet de l'influx nerveux dans les cas suivants : a) le rat reçoit une décharge électrique et saute la barrière ; b) le rat reconnaît le signal sonore (réflexe d'investigation qui dure 2 à 3 secondes) ; c) le rat saute la barrière au seul signal sonore ; d) déduisez-en le mécanisme du réflexe conditionnel.
3. Pour quelles raisons l'expérimentateur recourt-il à une caméra de télévision pour suivre les réactions de l'animal ?
4. Quels sont les différents types cellulaires qui permettent à l'animal, d'une part, de percevoir le choc électrique et, d'autre part, de s'y soustraire ?
5. Quelle est l'importance des réflexes conditionnels dans la vie de l'homme ?`,
  solution: `**1. a)** Il faut préciser les conditions qui garantissent que seul le son sert de signal : animal **éveillé, en bonne santé**, toujours le **même signal sonore** (même intensité, même durée), même intensité du choc, **toujours le son avant le choc** (et jamais l'inverse), dans un **environnement calme**, sans autres stimulations (bruits, lumière, odeurs) ; le rat doit aussi avoir **faim ou être motivé** de façon constante, et l'on vérifie au départ que le son seul ne provoque pas le saut.
**b)** Au début, seul le choc électrique (excitant **absolu**) déclenche le saut : c'est un réflexe **inné**. Le son, d'abord **neutre**, est présenté de façon répétée juste avant le choc ; après une quinzaine de jours (environ 150 associations), il déclenche à lui seul le saut : il est devenu un excitant **conditionnel**. Un **réflexe conditionnel** (acquis) s'est formé.

**2. a)** Réflexe inné : **récepteurs cutanés** des pattes (nocicepteurs) → **nerfs sensitifs** → **moelle épinière** (et encéphale) → **nerfs moteurs** → **muscles** des pattes → saut.
**b)** Réflexe d'investigation : **oreille interne** (cochlée) → **nerf auditif** → centres nerveux / **aire auditive du cortex** → nerfs moteurs → muscles de la tête et des oreilles (le rat s'oriente vers le son).
**c)** Réflexe conditionnel : oreille → nerf auditif → **aire auditive** → **liaison temporaire** nouvelle dans le cortex → **aire motrice** (et centres du saut) → moelle épinière → nerfs moteurs → muscles → saut.
**d)** Mécanisme : l'association répétée, dans un ordre et un délai constants, d'un excitant neutre (le son) et d'un excitant absolu (le choc) crée dans le **cortex cérébral** une **connexion temporaire** entre le centre qui reçoit l'excitant neutre (aire auditive) et le centre du réflexe inné. Le son déclenche alors la réponse. Cette liaison s'éteint si elle n'est plus renforcée.

**3.** Pour que la présence ou les gestes de l'expérimentateur ne deviennent pas des **stimuli parasites** (le rat pourrait se conditionner à la vue de l'expérimentateur au lieu du son), et pour enregistrer objectivement toutes les réactions.

**4.** - Percevoir le choc : les **récepteurs sensoriels cutanés** (terminaisons nerveuses de la peau des pattes) et les **neurones sensitifs** (dont le corps cellulaire est dans les ganglions rachidiens).
- S'y soustraire : les **neurones d'association** (interneurones) de la moelle et de l'encéphale, les **neurones moteurs** (motoneurones) et les **fibres musculaires** des muscles squelettiques.

**5.** Les réflexes conditionnels permettent à l'homme de s'**adapter** à son milieu : ils sont à la base de l'**apprentissage**, de l'**éducation**, des **habitudes** (écriture, conduite, gestes professionnels, sport), du **langage** ; ils permettent aussi d'anticiper un danger (réagir à un signal avant le danger lui-même).`,
}

export const blocs = [
  {
    subjectId: 'a9987cc5-6d4c-4b9f-8dc7-2679cae32e59', // Tle D · SVT
    chapterTitle: 'Annales SVT — Bacs, bacs blancs, compositions et devoirs',
    description: 'Sujets complets de Terminale D (bac 2003 et 2005, bacs blancs 2010 et 2022, compositions et devoirs) avec corrigés détaillés.',
    exercises: [bbZonal2022, compoS1, compoS2, devoirChaminade, bb2010, bac2005, bac2003, tdSpermaphytes, tdNerfMuscle, exo220],
  },
]
