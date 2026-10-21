/**
 * Banque d'exercices corrigés de SVT Terminale C & D (sujets de type bac),
 * rangés par chapitre. Les documents (courbes, coupes, schémas d'expérience)
 * des sujets d'origine sont décrits entre crochets.
 * difficulty : 1 = restituer, 2 = analyser, 3 = sujet complet.
 */

const R1 = {
  title: 'Cycle ovarien et hormones', difficulty: 2,
  statement: `[Document I : quatre schémas A, B, C, D montrant l'évolution d'un follicule au cours d'un cycle. Document II : taux d'œstrogènes et de progestérone dans les urines d'une femme, du 26 juillet au 25 août.]

1. a) Range les schémas A, B, C, D dans l'ordre chronologique. b) Donne le nom de chaque structure. c) Légende le schéma A (5 éléments).
2. a) Décris l'évolution des deux hormones. b) Donne les phases du cycle et leurs dates. c) Date l'ovulation. d) Cette femme est-elle enceinte le 25 août ? Justifie.`,
  solution: `1. a) Ordre : **C → D → A → B**.
b) C = **follicules primordiaux** ; D = **follicule primaire** ; A = **follicule de De Graaf** (mûr) ; B = **corps jaune**.
c) A : 1 = thèque externe ; 2 = thèque interne ; 3 = antrum (cavité) ; 4 = ovocyte ; 5 = granulosa.

2. b) Cycle de 30 jours : **phase folliculaire** du 26/7 au 10/8, **phase lutéale** du 10/8 au 25/8.
c) **Ovulation le 10 août** (juste après le pic d'œstrogènes).
d) **Non** : le 25 août, les **deux** hormones ovariennes chutent ensemble. Le corps jaune régresse, les règles vont arriver. En cas de grossesse, la progestérone resterait élevée.`,
}
const R2 = {
  title: "Action des hormones ovariennes sur l'utérus", difficulty: 2,
  statement: `Des lapines **impubères** sont réparties en 4 lots. On injecte de l'œstradiol au temps t1 et/ou de la progestérone au temps t2 (plus tard), puis on observe l'utérus.
- Lot 1 : aucune injection.
- Lot 2 : progestérone seule.
- Lot 3 : œstradiol seul.
- Lot 4 : œstradiol, puis progestérone.

1. Pourquoi utilise-t-on des lapines impubères ?
2. Analyse les résultats : lot 1 et lot 2 sans évolution ; lot 3 endomètre légèrement épaissi ; lot 4 endomètre très développé en « dentelle utérine ».
3. Conclus.`,
  solution: `1. Leurs ovaires ne sécrètent presque rien : les effets observés sont dus **uniquement** aux injections.

2. Lot 1 : aucune évolution (témoin). Lot 2 : la progestérone seule ne fait **rien**. Lot 3 : l'œstradiol seul fait **commencer** l'épaississement de l'endomètre. Lot 4 : œstradiol puis progestérone donnent un **développement complet** (dentelle utérine).

3. Le développement de l'utérus demande **d'abord l'œstradiol**, **puis la progestérone**. La progestérone n'agit que sur un endomètre déjà préparé par l'œstradiol — exactement l'ordre du cycle (phase folliculaire, puis phase lutéale).`,
}
const R3 = {
  title: 'Régulation de la LH chez une guenon castrée', difficulty: 3,
  statement: `On suit le taux de LH chez une guenon : ablation des ovaires (castration) au jour 0 ; perfusion de **faibles** doses d'œstradiol du 28e au 34e jour ; injections de **fortes** doses d'œstradiol du 38e au 41e jour ; implant de **progestérone** au 50e jour, puis mêmes fortes doses d'œstradiol.

1. Comment évolue la LH entre le 8e et le 28e jour ? Explique.
2. Quelles relations entre œstradiol et LH montrent les jours 28 à 43 ? Nomme les mécanismes.
3. Quel est l'effet de la progestérone (jours 50 à 60) ?
4. Fais la synthèse des relations entre hypophyse et ovaires.`,
  solution: `1. La LH reste **constante et très élevée** (≈ 20 ng/mL) : sans ovaires, l'hypophyse n'est **plus freinée**.

2. Faibles doses d'œstradiol → la LH **baisse** : **rétrocontrôle négatif** (comme en phase folliculaire). Fortes doses → **pic de LH** vers le 43e jour : **rétrocontrôle positif** (c'est ce pic qui déclenche l'ovulation).

3. Avec la progestérone, les fortes doses d'œstradiol **ne provoquent plus** de pic de LH : la progestérone exerce un **rétrocontrôle négatif** (comme en phase lutéale, où il n'y a pas de nouvelle ovulation).

4. L'ovaire **règle lui-même son activité** : par rétrocontrôle **négatif** (œstradiol faible, progestérone) et **positif** (œstradiol fort → pic de LH → ovulation), sous la commande hypothalamus (GnRH) → hypophyse (FSH, LH).`,
}
const R4 = {
  title: 'Glaire cervicale et fécondation', difficulty: 2,
  statement: `[Document I : quantité de glaire cervicale selon le jour du cycle (maximum vers le 14e jour), avec son aspect et son pH. Document II : deux étapes A et B de la fécondation chez un mammifère.]

1. Analyse le document I.
2. Donne les rôles de la glaire cervicale.
3. Explique ce qui se passe pendant la fécondation (document II).`,
  solution: `1. La glaire est **la plus abondante au moment de l'ovulation** (J14) : elle est alors claire, filante et **alcaline**. C'est un facteur qui **favorise la fécondation**.

2. Rôles : créer un **milieu basique** favorable aux spermatozoïdes (le vagin est acide) ; **fermer l'utérus** en dehors de l'ovulation (maillage serré qui arrête les microbes) ; **trier** les spermatozoïdes les plus vigoureux.

3. Les spermatozoïdes traversent la zone pellucide (enzymes de l'**acrosome** + mouvements du flagelle). **Un seul** fusionne avec l'ovocyte II : des granules corticaux sont libérés (**blocage de la polyspermie**) et la méiose s'achève (2e globule polaire). Puis les deux pronucléus fusionnent (**caryogamie**) → cellule-œuf.`,
}
const R5 = {
  title: "Devenir de l'œuf humain : fécondation et nidation", difficulty: 3,
  statement: `[Figure 1 : coupe de l'appareil génital féminin avec des lettres A à H. Figure 2 : six étapes, numérotées dans le désordre, de l'ovulation à l'implantation : 1 = stade 2 cellules ; 2 = spermatozoïde dans la zone pellucide ; 3 = blastocyste ; 4 = anaphase de la 1re mitose de l'œuf ; 5 = morula ; 6 = deux pronucléus.]

1. Range les numéros dans l'ordre chronologique et justifie.
2. Combien de chromosomes ont : l'ovocyte II, un globule polaire, un spermatozoïde, une cellule folliculaire, une cellule de la morula ?
3. Définis fécondation et nidation.
4. Comment est évitée la polyspermie ?`,
  solution: `1. Ordre : **2 – 6 – 4 – 1 – 5 – 3** : pénétration du spermatozoïde → deux pronucléus → 1re mitose (anaphase) → stade 2 cellules → morula → blastocyste.

2. Ovocyte II, globule polaire et spermatozoïde : **n = 23**. Cellule folliculaire et cellules de l'embryon : **2n = 46**.

3. **Fécondation** : union de deux gamètes dans la trompe → cellule-œuf. **Nidation** : implantation du blastocyste dans la muqueuse utérine, environ **7 jours** après la fécondation.

4. Deux blocages : un **blocage rapide** (la membrane de l'ovocyte change de polarisation) et un **blocage tardif** (les granules corticaux forment la membrane de fécondation).`,
}
const R6 = {
  title: 'Mode d\'action de la pilule contraceptive', difficulty: 2,
  statement: `[Document 1 : LH, œstradiol et progestérone chez une femme fertile pendant trois cycles. Document 2 : mêmes dosages chez une femme sous pilule œstro-progestative.]

1. Décris les deux documents.
2. Quelles différences observes-tu ?
3. Déduis le rôle de la pilule et justifie.
4. Pourquoi l'arrêt de la pilule au 21e jour est-il suivi de règles ?`,
  solution: `1. Femme fertile : **pic d'œstradiol** vers J13, **pic de LH** vers J14, **progestérone** en deuxième partie de cycle. Sous pilule : œstradiol et LH **bas et constants**, **pas de pic**, pas de progestérone naturelle.

2. Sous pilule, les **pics d'œstradiol et de LH disparaissent**.

3. La pilule **empêche l'ovulation** : par **rétrocontrôle négatif** sur l'hypothalamus et l'hypophyse, elle bloque FSH et LH ; sans pic de LH, pas d'ovulation, donc pas de corps jaune.

4. À l'arrêt, l'endomètre perd **brutalement** son soutien hormonal : il se détruit, ce qui donne des règles (comme la chute naturelle des hormones en fin de cycle).`,
}
const R7 = {
  title: 'Double fécondation chez les plantes à fleurs', difficulty: 2,
  statement: `[Document I : un ovule. Document II : le sac embryonnaire au moment de la fécondation, avec les numéros 1 à 7 et les lettres A (gamète mâle), B (sac embryonnaire), C (tube pollinique).]

1. Où se trouve l'ovule dans la fleur ?
2. Légende le document II (1 à 7).
3. Comment se forme le sac embryonnaire ?
4. a) Quels éléments participent à la double fécondation ? b) Combien de chromosomes a chaque œuf ? c) Que devient chaque œuf ?`,
  solution: `1. L'ovule est dans l'**ovaire du pistil**.

2. 1 = nucelle ; 2 = antipodes ; 3 = les 2 noyaux centraux (polaires) ; 4 = oosphère ; 5 = synergides ; 6 = noyau végétatif ; 7 = micropyle.

3. La cellule mère du sac fait une **méiose** → 4 cellules haploïdes dont 3 dégénèrent ; la dernière fait **3 mitoses** → 8 noyaux répartis en 7 cellules : c'est le sac embryonnaire.

4. a) Les **2 gamètes mâles**, l'**oosphère** et les **2 noyaux centraux**.
b) Œuf principal : **2n** ; œuf accessoire : **3n**.
c) L'œuf principal donne l'**embryon** ; l'œuf accessoire donne l'**albumen** (réserves). Embryon + albumen + téguments = **graine**.`,
}
const R8 = {
  title: 'Transplantation nucléaire : le clonage (Gurdon)', difficulty: 2,
  statement: `En 1960, Gurdon détruit aux ultraviolets le noyau d'ovules de Xénopes sauvages (couleur brun-vert). Dans ces ovules, il greffe des noyaux de cellules intestinales de têtards **albinos**. Sur 64 œufs, 40 donnent des adultes **identiques**, de **même sexe**, **albinos**.

1. a) Pourquoi tous ces Xénopes sont-ils identiques et de même sexe ? b) Combien de mitoses a-t-il fallu pour obtenir 64 noyaux à partir d'une cellule ?
2. Comment appelle-t-on ces 40 Xénopes ? Et la technique ?
3. Pourquoi parle-t-on de « photocopie biologique » ?`,
  solution: `1. a) Tous les noyaux greffés viennent de cellules d'**un même têtard**, toutes issues par mitoses d'une même cellule-œuf : ils ont le **même patrimoine génétique** (celui du donneur albinos) → individus identiques et de même sexe.
b) Chaque mitose double le nombre de cellules : $2^n = 64$, donc **n = 6 mitoses**.

2. Ces 40 Xénopes forment un **clone** ; la technique est la **transplantation nucléaire** (clonage).

3. Le clonage **reproduit à l'identique** le patrimoine génétique du donneur, alors que la reproduction sexuée (méiose + fécondation) fabrique des individus **tous différents**.`,
}

const D1 = {
  title: "Quantité d'ADN au cours d'une division", difficulty: 2,
  statement: `[Document : quantité d'ADN dans le noyau d'une cellule d'un organe reproducteur, au cours du temps : 1 unité de t1 à t2 ; montée jusqu'à 2 unités de t2 à t4 ; palier à 2 de t4 à t5 ; descente à 1 puis à 0,5 unité de t5 à t7.]

1. Explique les transformations entre t1 et t7.
2. Nomme les cellules obtenues et donne leur nombre de chromosomes chez l'Homme.`,
  solution: `1. De t2 à t4, la quantité d'ADN **double** (1 → 2) : c'est la **réplication** (phase S). Ensuite, deux **baisses successives sans nouvelle réplication** (2 → 1 → 0,5) : ce sont les **deux divisions de la méiose** (division I réductionnelle, puis division II).

2. Avant la division : cellule **diploïde** (2n = 46). Après la division I : cellules **haploïdes** (n = 23) à chromosomes à 2 chromatides. Après la division II : **gamètes** haploïdes (n = 23) à chromosomes à 1 chromatide (0,5 unité d'ADN).`,
}

const N = [
  {
    title: 'Réflexe myotatique et codage du message nerveux', difficulty: 3,
    statement: `Un coup sec sous la rotule provoque l'extension de la jambe. [Document : on enregistre, avec une microélectrode, les messages d'une fibre sensitive du muscle étiré par des charges de 4 g, 20 g et 30 g ; puis un potentiel d'action isolé.]

1. Comment s'appelle cette réaction ? Justifie.
2. Quel est le rôle du muscle antérieur (extenseur) et du muscle postérieur (fléchisseur) ?
3. Donne les caractéristiques d'un réflexe.
4. Que montrent les enregistrements quand la charge augmente ?
5. Explique les mouvements d'ions pendant un potentiel d'action.`,
    solution: `1. C'est un **réflexe myotatique** (réflexe d'étirement) : réponse **involontaire** qui dépend de la **moelle épinière**, un muscle étiré se contracte.

2. Pendant l'extension, l'extenseur se **contracte** et le fléchisseur se **relâche** : ce sont des muscles **antagonistes**.

3. Une réponse réflexe est **involontaire**, **automatique**, **inévitable** et **stéréotypée** ; elle met en jeu récepteur, voie sensitive, centre, voie motrice et effecteur.

4. Plus la charge est forte, plus la **fréquence** des potentiels d'action **augmente**, alors que leur **amplitude ne change pas** : le message nerveux est **codé en fréquence**.

5. Ouverture des canaux **Na⁺** → entrée de Na⁺ → **dépolarisation** ; fermeture des canaux Na⁺ et ouverture des canaux **K⁺** → sortie de K⁺ → **repolarisation** ; la **pompe Na⁺/K⁺** rétablit ensuite le repos (−70 mV).`,
  },
  {
    title: 'Le sens de circulation du message dans la moelle', difficulty: 2,
    statement: `Chez un homme dont la moelle est sectionnée, une stimulation de la plante du pied provoque quand même une flexion de la jambe (il ne sent rien et ne commande plus ses jambes).
[Expériences sur un nerf rachidien : on stimule la racine dorsale (A) et on enregistre sur la racine ventrale (B), puis l'inverse.]

1. Nomme cette réaction et cite les organes qui interviennent.
2. Décris une coupe de moelle épinière.
3. Analyse les deux expériences et conclus sur le sens du message.`,
    solution: `1. C'est un **réflexe inné médullaire**. Organes : la **peau** (récepteur), le **nerf sensitif**, la **moelle épinière** (centre), le **nerf moteur** et les **muscles** (effecteurs).

2. Substance **grise centrale** en papillon (cornes antérieures **motrices**, cornes postérieures **sensitives**), substance **blanche** autour ; **racine dorsale** sensitive avec le ganglion spinal ; **racine ventrale** motrice.

3. Stimuler A (racine dorsale) → message enregistré en B et contraction. Stimuler B → contraction, mais **rien** en A. Le message ne circule que **de la racine dorsale vers la racine ventrale** : la transmission est **à sens unique**, à cause des **synapses** entre neurones sensitifs et moteurs.`,
  },
  {
    title: 'Sommation et intégration par le motoneurone', difficulty: 3,
    statement: `Une microélectrode est placée dans un motoneurone. Expérience 1 : on stimule les fibres sensitives avec des intensités croissantes i1 à i5 (tracés Ia à Ie). Expérience 2 : deux stimulations d'intensité i3 plus ou moins rapprochées dans le temps.

1. Que sont les tracés Ia, Ib, Ic ? Pourquoi leur amplitude augmente-t-elle ?
2. Quand un potentiel d'action apparaît-il ? Explique sur le plan ionique.
3. Quelle propriété montrent les tracés Ia à Ie ?
4. Interprète l'expérience 2 et nomme la propriété mise en évidence.`,
    solution: `1. Ce sont des **dépolarisations locales** (potentiels postsynaptiques) ; leur amplitude **augmente avec l'intensité** de la stimulation.

2. Un PA n'apparaît que si la dépolarisation **atteint le seuil** (à partir de Id). Au seuil, les canaux **Na⁺** s'ouvrent en masse.

3. Le PA obéit à la **loi du tout ou rien**.

4. Une stimulation i3 seule ne suffit pas, mais deux stimulations **rapprochées** s'**additionnent** et atteignent le seuil → PA. C'est la **sommation temporelle** (intégration nerveuse). Quand des fibres différentes sont stimulées **en même temps**, on parle de sommation **spatiale**.`,
  },
  {
    title: "Calculer la vitesse de l'influx nerveux", difficulty: 1,
    statement: `On stimule un nerf de grenouille et on enregistre le message en deux points distants de **2 cm**. Le décalage entre les deux réponses est de **0,85 ms**. L'enregistrement présente deux déflexions de sens opposés.

1. Calcule la vitesse de l'influx en expliquant la méthode.
2. Comment s'appelle ce type d'enregistrement ? À quelles conditions l'obtient-on ?`,
    solution: `1. $v = \\dfrac{\\Delta d}{\\Delta t} = \\dfrac{2 \\times 10^{-2}}{0{,}85 \\times 10^{-3}} \\approx 23{,}5$ m/s.

2. C'est un **potentiel d'action diphasique** : les deux électrodes réceptrices doivent être assez **éloignées** et le nerf **intact** entre elles (le message passe sous l'une puis sous l'autre).`,
  },
  {
    title: 'Ce qui fait varier la vitesse de conduction', difficulty: 2,
    statement: `Tableau 1 (nerf de grenouille) : fibres de 10 µm et 20 µm de diamètre, à 20 °C et à 30 °C : vitesses de 15 m/s à 60-80 m/s.
Tableau 2 : fibre **myélinisée** de 13 µm → 75 m/s ; axone de calmar **sans myéline** de 700 µm → 25 m/s.

1. Analyse les deux tableaux.
2. Conclus.
3. Comment le message se propage-t-il dans chaque type de fibre ?`,
    solution: `1. À température égale, la vitesse **augmente avec le diamètre** ; à diamètre égal, elle **augmente avec la température**. Et une petite fibre **myélinisée** (75 m/s) est **plus rapide** qu'une énorme fibre sans myéline (25 m/s).

2. La vitesse dépend du **diamètre**, de la **température** et surtout de la présence de **myéline**.

3. Fibre myélinisée : conduction **saltatoire** (de nœud de Ranvier en nœud de Ranvier). Fibre sans myéline : conduction **continue**, de proche en proche.`,
  },
  {
    title: 'Synapses et déclenchement du réflexe myotatique', difficulty: 2,
    statement: `Un motoneurone M reçoit trois fibres sensitives F1, F2, F3 venant du quadriceps. On stimule F1 seule (réponse a), puis F1 + F2 (réponse b), puis F1 + F2 + F3 (réponse c : un potentiel d'action apparaît sur l'axone de M).

1. Explique ces résultats à l'aide du fonctionnement de la synapse.
2. Quelle condition faut-il pour que le réflexe se déclenche ?`,
    solution: `1. Le PA arrivant au bout d'une fibre libère un **neurotransmetteur** qui crée sur M une petite dépolarisation, le **PPSE** (potentiel postsynaptique excitateur).
- a) F1 seule : un PPSE trop faible → pas de PA.
- b) F1 + F2 : deux PPSE s'additionnent (**sommation spatiale**), encore sous le seuil → pas de PA.
- c) F1 + F2 + F3 : la somme **atteint le seuil** → **PA** sur le motoneurone.

2. L'étirement doit activer **plusieurs fibres en même temps** (sommation spatiale) et/ou être assez intense (PA fréquents, **sommation temporelle**).`,
  },
  {
    title: 'La plaque motrice', difficulty: 3,
    statement: `Expériences sur la jonction entre un neurone moteur et une fibre musculaire (zone A) : (1) stimulation S de l'axone moteur ; (2) dépôt d'une petite goutte G1, puis d'une grosse goutte G2 d'acétylcholine (ACh) sur la fibre ; (3) dépôt de G2 sur une fibre traitée à l'**ésérine** (qui empêche la destruction de l'ACh) ; (4) injection de G2 **à l'intérieur** de la fibre.

1. Comment s'appelle la zone A ?
2. Pourquoi G1 et G2 n'ont-elles pas le même effet ?
3. S et G2 donnent la même réponse : que peux-tu en déduire ?
4. Explique la réponse obtenue avec l'ésérine.
5. Que montre l'injection à l'intérieur de la fibre ?
6. Schématise une plaque motrice et explique son fonctionnement.`,
    solution: `1. La zone A est la **plaque motrice** (jonction neuromusculaire).

2. G1 contient **trop peu** d'ACh pour exciter efficacement la fibre ; G2 en contient assez.

3. Exciter l'axone **libère de l'ACh** sur la plaque motrice : c'est elle qui excite la fibre.

4. Avec l'ésérine, l'ACh n'est **plus détruite** : elle continue d'exciter la fibre → réponses **répétées**.

5. Injectée **dedans**, l'ACh est **sans effet** : ses récepteurs sont sur la **face externe** de la membrane.

6. Schéma : terminaison de l'axone, **vésicules d'ACh**, membrane présynaptique, **fente synaptique**, membrane postsynaptique (musculaire). Fonctionnement : le PA arrive → entrée de **Ca²⁺** → les vésicules libèrent l'**ACh** → l'ACh se fixe sur ses **récepteurs** → entrée de Na⁺ → **PA musculaire** → contraction ; puis l'ACh est **détruite**. Ici, un PA nerveux déclenche toujours un PA musculaire.`,
  },
  {
    title: "Le réflexe conditionnel (expérience de Pavlov)", difficulty: 2,
    statement: `Sécrétion de salive chez le chien. (1) Un son seul ne fait pas saliver. (2) De la viande sur la langue fait saliver. (3) On associe 7 fois le son et la viande. (4) Le son seul fait maintenant saliver.
Tableau 1 : en faisant entendre le son seul toutes les quelques minutes de 13 h à 14 h, le nombre de gouttes baisse de 10 à 0. Tableau 2 : après de nouvelles associations son + viande, la salivation reprend.

1. Quel rôle jouent le son et la viande ?
2. Quel réflexe observe-t-on en (2) ? et en (4) ?
3. Analyse le tableau 1 et donne une caractéristique de ce réflexe.
4. Que montre le tableau 2 ?`,
    solution: `1. Le son est un **stimulus neutre** qui devient **stimulus conditionnel** ; la viande est un **stimulus absolu** (inconditionnel).

2. (2) : **réflexe inné** (absolu) de salivation. (4) : **réflexe conditionnel** (acquis).

3. Sans viande, la salivation diminue jusqu'à **disparaître** : le réflexe conditionnel est **temporaire** (**extinction**).

4. Il faut **entretenir** le réflexe conditionnel (rappeler l'association) pour qu'il ne disparaisse pas.`,
  },
  {
    title: 'Le cortex et le réflexe conditionnel', difficulty: 3,
    statement: `Un chien A est conditionné à un son. On détruit une zone de son cortex cérébral : le réflexe au son disparaît pour toujours, mais on peut encore en créer un nouveau avec un éclair lumineux. Puis on détruit la formation réticulée : tous les réflexes conditionnels disparaissent, mais la viande dans la gueule fait toujours saliver.

1. Quel est le rôle de la zone corticale détruite ?
2. Pourquoi la salivation à la viande est-elle conservée ? Trace le trajet du message dans le réflexe conditionnel au son.
3. Définis le réflexe conditionnel et cite trois intérêts chez l'Homme.`,
    solution: `1. Cette zone (l'**aire auditive**) participe à l'élaboration du réflexe conditionnel déclenché par le son.

2. Le **centre salivaire du bulbe** est intact : le **réflexe inné** fonctionne toujours.
Trajet : son → oreille → **aire auditive** → nouvelle connexion → **aire gustative** → **centre salivaire du bulbe** → glandes salivaires → salive.

3. Le réflexe conditionnel est une réaction **involontaire**, née d'un **apprentissage**. Intérêts : il développe les **automatismes**, permet l'**éducation**, et l'adaptation au milieu (et le dressage des animaux).`,
  },
]

const C = [
  {
    title: 'Automatisme cardiaque et ligatures de Stannius', difficulty: 2,
    statement: `Un cœur de grenouille, prélevé et placé dans un liquide physiologique, continue de battre.

1. Que peux-tu en déduire ?
2. On fait des ligatures. Cœur I : ligature entre le sinus veineux et l'oreillette → le sinus continue de battre, oreillettes et ventricule s'arrêtent. Puis seconde ligature entre oreillettes et ventricule → le ventricule repart, plus lentement. Cœur II : une seule ligature entre oreillettes et ventricule → sinus et oreillettes battent normalement ; le ventricule s'arrête un moment puis repart très lentement.
a) Conclus sur l'origine de l'activité cardiaque. b) Où naît la contraction ?`,
    solution: `1. Le cœur est doué d'**automatisme** : il bat **tout seul**, hors du corps.

2. a) L'automatisme a son **siège dans le sinus** (cœur I, 1re ligature). Le ventricule isolé repart plus lentement : il existe un **deuxième centre** d'automatisme, plus lent. Le sinus **impose** son rythme au reste du cœur : c'est l'**entraîneur** (pacemaker).
b) La contraction **naît dans le sinus veineux** puis se propage à tout le cœur.`,
  },
  {
    title: 'Pression artérielle et rythme cardiaque (nerfs de Héring et de Cyon)', difficulty: 3,
    statement: `Expérience 1 : on pince les deux carotides **en bas** (le sang n'arrive plus au sinus carotidien) → le cœur accélère. Expérience 2 : on ligature les carotides **en haut** (le sang s'accumule dans le sinus carotidien) → le cœur ralentit. Expérience 3 : on excite le nerf de Héring et on enregistre la pression artérielle.

1. Définis tachycardie et bradycardie.
2. Explique les expériences 1 et 2.
3. Que fait l'excitation du nerf de Héring sur la pression ? Quel est le rôle de ce nerf ?`,
    solution: `1. **Tachycardie** : accélération du rythme cardiaque. **Bradycardie** : ralentissement.

2. Exp. 1 : la pression **chute** dans le sinus carotidien → les **barorécepteurs** ne sont plus stimulés → le centre cardio-modérateur n'agit plus, le sympathique l'emporte → **tachycardie**.
Exp. 2 : la pression **monte** dans le sinus → les barorécepteurs sont excités → le **parasympathique** (nerf X) l'emporte → **bradycardie**.

3. La pression **chute brusquement** puis remonte. Le nerf de Héring est un nerf **sensitif** (centripète) : il informe les centres du bulbe de la pression ; c'est un **nerf dépresseur**.`,
  },
  {
    title: 'Commande nerveuse et hormonale du cœur', difficulty: 2,
    statement: `[Document : schéma de la régulation du cœur : nerf de Héring, nerf de Cyon, nerf X, nerf cardiaque, nerf splanchnique, médullosurrénale, centres du bulbe.]

1. Quel est l'effet de la stimulation du nerf X ? du nerf cardiaque ?
2. Que se passe-t-il si l'on coupe le nerf X ?
3. Le nerf splanchnique stimule la médullosurrénale : quelle substance agit alors sur le cœur ?
4. À quel système nerveux appartient chaque nerf ? Quelles substances libèrent le nerf X et le nerf cardiaque ?`,
    solution: `1. Le nerf X **ralentit** le cœur (bradycardie, effet cardio-modérateur) ; le nerf cardiaque l'**accélère** (tachycardie, effet cardio-accélérateur).

2. Couper le nerf X fait **accélérer** le cœur : il le freine en permanence.

3. L'**adrénaline**.

4. Nerf X : système **parasympathique** ; nerfs cardiaque et splanchnique : système **(ortho)sympathique**. Le nerf X libère de l'**acétylcholine**, le nerf cardiaque de la **noradrénaline**.`,
  },
  {
    title: 'Le tissu nodal et le pacemaker', difficulty: 2,
    statement: `On cultive des cellules de cœur d'embryon de rat : certaines se contractent toutes seules en rythme, d'autres non ; mises en contact, toutes se contractent ensemble.

1. Dans quelles conditions faut-il faire cette expérience ?
2. Identifie les deux types de cellules et conclus.
3. Pourquoi pose-t-on parfois un stimulateur électrique (pacemaker) ? Quel est son rôle ?
4. Explique le fonctionnement du tissu nodal.`,
    solution: `1. Dans un liquide physiologique riche en **O₂** et en **glucose**, à **37 °C** (le rat est un mammifère).

2. Les cellules qui battent seules sont celles du **tissu nodal** ; les autres viennent du **myocarde**. Les cellules nodales sont **auto-excitables** et entraînent les cellules musculaires.

3. On pose un pacemaker quand le **tissu nodal est défaillant** ; il génère un **rythme régulier** (70 à 80 battements par minute).

4. L'excitation naît dans le **nœud sinusal**, gagne les oreillettes (qui se contractent), passe par le **nœud auriculo-ventriculaire**, puis le **faisceau de His** et le **réseau de Purkinje** jusqu'aux ventricules (qui se contractent).`,
  },
]

const GE = [
  {
    title: 'Couleur des yeux chez la drosophile (hérédité liée au sexe)', difficulty: 3,
    statement: `On croise un mâle aux yeux **blancs** avec une femelle aux yeux **rouges** (races pures) : toute la F1 a les yeux rouges. En F2, les femelles ont toutes les yeux rouges et les mâles sont pour moitié rouges, pour moitié blancs.
Croisement réciproque (mâle rouge × femelle blanche) : F'1 = mâles blancs et femelles rouges ; F'2 = blancs et rouges en nombres égaux dans les deux sexes.

Interprète ces croisements.`,
    solution: `- F1 toute rouge → **rouge (R) dominant**, blanc (w) récessif.
- Les résultats **diffèrent selon le sexe** et les deux croisements réciproques ne donnent pas la même chose → le gène est sur le **chromosome X** (sans équivalent sur Y).

**Croisement 1** : ♀ X^R X^R × ♂ X^w Y → F1 : ♀ X^R X^w et ♂ X^R Y, **tous rouges**. F2 : femelles X^R X^R ou X^R X^w (**toutes rouges**) ; mâles X^R Y (rouges) ou X^w Y (blancs), **moitié-moitié**. ✔

**Croisement réciproque** : ♀ X^w X^w × ♂ X^R Y → F'1 : ♀ X^R X^w (**rouges**) et ♂ X^w Y (**blancs**). F'2 : X^R X^w, X^w X^w, X^R Y, X^w Y → rouges et blancs dans les deux sexes. ✔

**Conclusion** : le gène de la couleur des yeux est porté par **X** ; l'allèle rouge est dominant.`,
  },
  {
    title: 'Couleur du plumage chez la poule (chromosome Z)', difficulty: 2,
    statement: `Un coq Sussex **blanc** × une poule Rhode Island **rouge** → tous les poussins sont blancs. Un coq Rhode Island **rouge** × une poule Sussex **blanche** → 50 % de mâles blancs et 50 % de femelles rouges.

Interprète, sachant que chez les oiseaux le mâle est ZZ et la femelle ZW.`,
    solution: `- 1er croisement : tout blanc → **blanc (B) dominant**, rouge (b) récessif.
- Le 2e croisement donne un résultat **différent selon le sexe** → gène porté par le chromosome **Z**.

Croisement 1 : coq Z^B Z^B × poule Z^b W → mâles Z^B Z^b (blancs) et femelles Z^B W (blanches) → **tous blancs**. ✔
Croisement 2 : coq Z^b Z^b × poule Z^B W → mâles Z^B Z^b (**blancs**) et femelles Z^b W (**rouges**). ✔

**Conclusion** : gène lié au sexe (chromosome Z), allèle blanc dominant.`,
  },
  {
    title: 'Une maladie dans la famille Koffi (pedigree et ADN)', difficulty: 3,
    statement: `Koffi (père, sain) et Akissi (mère, saine) ont trois enfants : Aya (fille saine), Kouakou (fils sain) et Yao (fils **malade**).
[Document II : nombre de séquences d'ADN de l'allèle normal (M) et de l'allèle muté (m) chez cinq personnes A à E : A (1 M, 0 m) ; B (2 M, 0 m) ; C (1 M, 0 m) ; D (0 M, 1 m) ; E (1 M, 1 m).]

1. L'allèle de la maladie est-il dominant ou récessif ?
2. Peut-on dire, avec l'arbre seul, s'il est sur un autosome ou sur X ?
3. Utilise le document II pour trancher.
4. Identifie A à E et donne leurs génotypes.
5. Le couple attend un 4e enfant. a) Probabilité qu'il ait le même phénotype qu'Aya ? b) L'échographie montre une fille : probabilité qu'elle soit malade ?`,
    solution: `1. Yao est malade alors que ses parents sont sains → l'allèle est **récessif** (les parents le portent sans être malades).

2. Non : allèle récessif **autosomal** (parents hétérozygotes) ou **lié à l'X** (mère conductrice) restent possibles.

3. Une cellule a autant de séquences que d'exemplaires du gène. A, C, D n'en ont **qu'une** → ce sont des **hommes** (un seul X) ; B et E en ont deux → des **femmes**. Le gène est donc sur **X** : maladie **récessive liée à l'X**.

4. D (0 M, 1 m) = **Yao** X^m Y ; E (1 M, 1 m) = **Akissi** X^M X^m (conductrice) ; B (2 M) = **Aya** X^M X^M ; A et C (1 M) = **Koffi** et **Kouakou**, X^M Y.

5. Koffi X^M Y × Akissi X^M X^m → X^M X^M, X^M X^m, X^M Y, X^m Y (¼ chacun).
a) Fille saine : X^M X^M + X^M X^m = **½**.
b) Une fille reçoit **X^M de son père** : elle ne peut pas être malade → probabilité **0**.`,
  },
  {
    title: 'La mucoviscidose et la consanguinité', difficulty: 3,
    statement: `La mucoviscidose touche environ 1 enfant sur 2 000. Chez les personnes en bonne santé (population blanche), **1 sur 20** est porteuse saine (hétérozygote). [Document : arbre d'une famille consanguine avec des enfants atteints de parents sains.]

1. Donne les caractéristiques génétiques de cette maladie.
2. Calcule la fréquence attendue des nouveau-nés atteints.
3. Donne les génotypes des malades et de leurs parents.
4. Pourquoi la consanguinité augmente-t-elle le risque ?`,
    solution: `1. Elle touche les **deux sexes** (gène **autosomal**) et apparaît chez des enfants de parents **sains** (allèle **récessif**) : maladie **autosomale récessive**.

2. Un enfant est atteint (a//a) si ses deux parents sont hétérozygotes **et** lui transmettent chacun a :
$$P = \\frac{1}{20} \\times \\frac{1}{20} \\times \\frac{1}{4} = \\frac{1}{1\\,600}$$
soit environ 1 enfant sur 1 600 (même ordre de grandeur que 1 sur 2 000).

3. Malades : **(a//a)** ; leurs parents, sains, sont forcément **hétérozygotes (A//a)**.

4. Des cousins ont plus de chances de porter **le même allèle rare**, hérité d'un **ancêtre commun**. Le risque que deux allèles a se rencontrent est donc plus grand : la consanguinité favorise l'apparition des **maladies récessives**.`,
  },
  {
    title: 'Daltonisme et anomalie des chromosomes sexuels', difficulty: 3,
    statement: `Le daltonisme est dû à un gène porté par X (sans équivalent sur Y). Une fille II2 est daltonienne alors que ses deux parents voient normalement.

1. L'allèle du daltonisme est-il dominant ou récessif ?
2. a) Pourquoi est-il surprenant que II2 soit daltonienne ? b) Son caryotype montre qu'il lui manque un chromosome X : écris sa formule chromosomique. c) D'où vient cette anomalie ?
3. Un garçon II1 de la même famille est atteint du syndrome de Klinefelter et est daltonien : écris son génotype et explique l'origine.`,
    solution: `1. Le daltonisme apparaît chez des enfants de parents sains : l'allèle **d** est **récessif**, lié à X.

2. a) Une fille daltonienne devrait être X^d X^d, donc avoir un **père daltonien** ; or son père voit normalement.
b) Il lui manque un X : **44 autosomes + X0** (syndrome de **Turner**). Son seul X, X^d, vient de sa mère conductrice (X^D X^d) : l'allèle d s'exprime.
c) Une **non-disjonction** des chromosomes sexuels pendant la méiose du **père** a produit un spermatozoïde **sans** chromosome sexuel.

3. Klinefelter = **44 + XXY**. Garçon daltonien : **X^d X^d Y**. Origine : non-disjonction des chromosomes X chez la **mère** conductrice (méiose II) → ovule X^d X^d, fécondé par un spermatozoïde Y.`,
  },
  {
    title: 'Hibiscus : un gène codominant et un gène dominant', difficulty: 3,
    statement: `On croise deux races pures d'hibiscus. La F2 (F1 × F1) compte : 82 corolles ouvertes rouges ; 165 ouvertes roses ; 81 ouvertes blanches ; 28 fermées rouges ; 53 fermées roses ; 26 fermées blanches.

1. Combien de gènes gouvernent chaque caractère ?
2. Donne le génotype de la F1 pour chaque caractère.
3. Les gènes sont-ils indépendants ou liés ?
4. Quels étaient les phénotypes des parents ?`,
    solution: `Total = 435.

1. **Forme** : ouvertes 328 / fermées 107 ≈ **3 : 1** → **un gène**, ouverte (O) dominant sur fermée (f).
**Couleur** : rouges 110 / roses 218 / blanches 107 ≈ **1 : 2 : 1** → **un gène** à **codominance** (rouge R et blanc B ; rose = hétérozygote R//B).

2. F1 : (O//f) pour la forme → ouverte ; (R//B) pour la couleur → rose.

3. Les proportions correspondent au produit (3 : 1) × (1 : 2 : 1) = 3 : 6 : 3 : 1 : 2 : 1, c'est-à-dire ≈ 82 : 165 : 81 : 28 : 53 : 26 → les gènes sont **indépendants**.

4. Parents de race pure donnant une F1 ouverte rose : **ouverte rouge (O//O, R//R) × fermée blanche (f//f, B//B)**, ou **ouverte blanche × fermée rouge**.`,
  },
  {
    title: 'Gènes liés et carte factorielle', difficulty: 3,
    statement: `On croise une lignée pure à grains **colorés et ridés** avec une lignée pure à grains **incolores et lisses**. La F1 a des grains **colorés et lisses**. On croise la F1 avec une lignée à grains incolores et ridés (test-cross) et on obtient : 1 208 colorés ridés ; 209 incolores lisses ; 45 colorés lisses ; 44 incolores ridés.

Interprète ces résultats et établis la carte factorielle.`,
    solution: `- F1 colorée et lisse → **coloré (C)** domine incolore (c) ; **lisse (L)** domine ridé (r). La F1 est double hétérozygote.
- Le test-cross avec le double récessif (c//c, r//r) montre directement les **gamètes** de la F1. Gènes indépendants → on attendrait **4 classes égales** (25 % chacune). Ici : **2 classes très nombreuses** (colorés ridés, incolores lisses) et **2 classes rares** (colorés lisses, incolores ridés) → les gènes sont **liés** (sur le même chromosome).
- Les classes nombreuses sont les combinaisons **parentales** : dans la F1, **C est lié à r** et **c est lié à L**.
- Les classes rares sont les **recombinés**, dus à un **crossing-over** : 45 + 44 = 89.
- Effectif total : 1 208 + 209 + 45 + 44 = **1 506**.
$$\\text{distance} = \\frac{89}{1\\,506} \\times 100 \\approx 5{,}9 \\text{ \\%}$$
soit environ **6 centimorgans** (cM).

Carte factorielle : gène de la couleur •——— 6 cM ———• gène de la forme.

(Remarque : en théorie, les deux classes parentales devraient être à peu près égales ; ce sont bien les deux classes rares qui mesurent la recombinaison.)`,
  },
]

const I = [
  {
    title: 'Anticorps et complément', difficulty: 2,
    statement: `Dans des tubes à 37 °C, on met des globules rouges de mouton (GRM) avec : tube 1 : eau salée → GRM intacts ; tube 2 : anticorps anti-GRM → GRM **agglutinés** ; tube 3 : anticorps anti-GRM + complément → GRM **détruits** ; tube 4 : eau salée + complément → GRM intacts. (Le complément est un ensemble de protéines du plasma.)

1. Comment obtient-on des anticorps anti-GRM chez un lapin ?
2. Quel est le rôle des anticorps ? et du complément ?
3. Conclus.`,
    solution: `1. On injecte des GRM à un lapin : ces antigènes déclenchent une réponse immunitaire, et le lapin fabrique des **anticorps anti-GRM** (en quantité environ une semaine après).

2. Tube 1 : témoin. Tube 2 : les anticorps **agglutinent** les GRM. Tube 3 : anticorps + complément → **destruction** (hémolyse). Tube 4 : le complément **seul** ne fait rien.

3. Pour détruire les GRM, il faut **les anticorps et le complément** : les anticorps reconnaissent et neutralisent les antigènes, le complément les détruit. Il y a **coopération** entre immunité spécifique et non spécifique.`,
  },
  {
    title: 'Toxine tétanique et immunité humorale', difficulty: 3,
    statement: `Souris A : injection de toxine tétanique (TT) ou diphtérique (TD) → mort. Souris B : vaccinée par l'anatoxine tétanique, puis TT → **survie** ; TD → mort. On prélève le sérum de B. Souris C : sérum de B + TT → **survie**. Souris D : sérum de B passé sur un filtre portant de l'anatoxine tétanique, puis TT → mort.

1. a) Qu'est-ce qu'une toxine ? b) Quelle caractéristique de la réponse immunitaire montrent A et B ?
2. Montre qu'il s'agit d'une réponse à médiation humorale.`,
    solution: `1. a) Une **toxine** est une substance libérée par un microbe, qui circule dans le sang : c'est un **antigène soluble**.
b) L'anatoxine tétanique protège contre le tétanos mais **pas** contre la diphtérie : la réponse est **spécifique**.

2. Le **sérum** de B protège C : l'immunité a été **transférée par le sérum**, qui contient des **anticorps** → réponse à **médiation humorale**. Après passage sur l'anatoxine, le sérum ne protège plus (D meurt) : les anticorps anti-tétaniques sont restés **fixés** sur l'anatoxine du filtre.`,
  },
  {
    title: 'Réponses primaire et secondaire ; structure des anticorps', difficulty: 2,
    statement: `[Document : taux d'anticorps dans le sang après un premier contact avec un antigène (réponse primaire, surtout des IgM) puis après un second contact (réponse secondaire, surtout des IgG).]

1. Compare les deux réponses.
2. Quelles cellules expliquent la réponse secondaire ?
3. a) Définis antigène et anticorps. b) Schématise un anticorps. c) Cite les 5 classes d'immunoglobulines et un rôle de chacune.`,
    solution: `1. La réponse **primaire** est **lente** à démarrer, **faible** (surtout des IgM). La réponse **secondaire** est **plus rapide**, **plus forte** et **plus longue** (surtout des IgG).

2. Les **cellules mémoire** (lymphocytes mémoire).

3. a) **Antigène** : substance étrangère capable de déclencher une réponse immunitaire. **Anticorps** : protéine (immunoglobuline) produite en réponse à un antigène, qu'elle fixe **spécifiquement**.
b) Molécule en **Y** : 2 chaînes **lourdes** + 2 chaînes **légères** ; une partie **variable** (sites de fixation de l'antigène, au bout des bras) et une partie **constante**.
c) **IgM** (apparaissent en premier) ; **IgG** (réponse secondaire, traversent le placenta) ; **IgA** (dans la salive, le lait, les muqueuses) ; **IgE** (allergies, vers parasites) ; **IgD** (à la surface des lymphocytes B).`,
  },
  {
    title: 'Rejet de greffe et compatibilité HLA', difficulty: 3,
    statement: `On greffe la peau d'un donneur A sur un receveur B : le greffon est détruit au **12e jour**. Une 2e greffe du même donneur A sur B est rejetée en **7 jours**. Des greffes venant d'autres donneurs sur B sont rejetées au 12e jour.
[Graphe : pourcentage de greffons qui survivent selon la parenté des marqueurs HLA entre donneur et receveur.]

1. À quoi servent les immunosuppresseurs ?
2. Que montre le graphe ?
3. Montre que le rejet révèle la spécificité et la mémoire de la réponse immunitaire.`,
    solution: `1. Ils **freinent la réponse immunitaire** (surtout la réponse cellulaire) : par exemple la ciclosporine bloque la production d'**interleukine 2** et donc la multiplication des lymphocytes. On les utilise pour éviter le rejet d'une greffe.

2. Plus les marqueurs HLA du donneur et du receveur se **ressemblent**, plus le greffon **survit** longtemps (presque 100 % s'ils sont identiques ; rejet rapide sans parenté).

3. **Spécificité** : seul le 2e greffon du **même** donneur A est rejeté plus vite ; ceux des autres donneurs restent rejetés au 12e jour. **Mémoire** : ce rejet accéléré s'explique par des **cellules mémoire** formées lors de la 1re greffe.`,
  },
  {
    title: 'Thymus, moelle osseuse et coopération cellulaire', difficulty: 3,
    statement: `Des souris sont irradiées (l'irradiation détruit les cellules de la moelle osseuse).
- Lot A : irradiation + greffe de moelle → elles ont des LB et des LT.
- Lot B : ablation du thymus + irradiation + greffe de moelle → LB seulement.
- Lot C : ablation du thymus + irradiation + greffe de thymus → ni LB ni LT.
On leur injecte des pneumocoques tués ; 5 jours plus tard, on teste leur sérum sur des pneumocoques : A → agglutination nette ; B → très légère ; C → aucune.

1. Quel est le rôle du thymus et de la moelle osseuse ?
2. Pourquoi les pneumocoques sont-ils agglutinés ?
3. Explique les résultats et montre qu'il existe une coopération entre cellules.`,
    solution: `1. La **moelle osseuse** fabrique les LB et les LT (lot A) et suffit à la maturation des **LB** (lot B). Le **thymus** est nécessaire à la maturation des **LT** (lot B n'a pas de LT) mais ne fabrique pas de lymphocytes (lot C).

2. Le sérum contient des **anticorps** fabriqués par les LB activés : ils **agglutinent** les pneumocoques.

3. A (LB + LT) : réponse **normale**. B (LB seuls) : **très peu** d'anticorps → les LT sont nécessaires. C : aucun lymphocyte, aucune réponse. Une réponse normale demande **LB et LT ensemble** : c'est la **coopération cellulaire** (les LT4 stimulent les LB).`,
  },
  {
    title: 'Dépistage du VIH', difficulty: 3,
    statement: `On recherche le VIH de façon indirecte sur une bandelette portant des protéines du virus. Sujet A : une bande apparaît sur une protéine **spécifique** du VIH. Sujet B : une bande apparaît seulement sur une protéine **non spécifique**.

1. a) Que recherche-t-on ? b) Quelle réaction se produit ?
2. Conclus pour A et B.
3. À partir de quand ce test est-il fiable ? Pourquoi ?
4. a) Schématise le VIH. b) Qu'est-ce qu'un rétrovirus ?
5. Explique comment le VIH se multiplie et pourquoi il provoque le sida.`,
    solution: `1. a) On recherche des **anticorps anti-VIH** dans le sang. b) Ils se fixent **spécifiquement** sur les protéines du virus : on obtient un **complexe immun** (antigène-anticorps).

2. **A est séropositif** (porteur du VIH) ; **B ne l'est pas**.

3. Environ **3 mois** après l'infection : c'est le temps qu'il faut à l'organisme pour fabriquer assez d'anticorps (la séroconversion).

4. a) Une **enveloppe** lipidique avec les glycoprotéines **gp120** et **gp41**, une **capside** qui contient l'**ARN** viral et la **transcriptase inverse**.
b) Un **rétrovirus** fabrique de l'**ADN** à partir de son **ARN**.

5. Le virus entre dans un **LT4** ; la transcriptase inverse copie son ARN en ADN ; cet ADN s'**intègre** dans l'ADN du LT4 ; la cellule fabrique de nouveaux virus qui sortent en **bourgeonnant**, et elle finit par mourir. La disparition des LT4 fait **s'effondrer** les défenses : c'est le **sida**, avec ses maladies opportunistes.`,
  },
]

const G = [
  {
    title: 'Filons hydrothermaux et minerais', difficulty: 2,
    statement: `Quand un magma granitique cristallise, les métaux (or, fer, étain) se concentrent de deux façons : le magma résiduel riche en silice donne des **pegmatites** ; des fluides chauds forment des **filons** à gangue de quartz, qui se déposent en refroidissant parfois loin du massif. [Document : étapes de formation de filons d'or.]

1. Annote le document avec : filon d'or, lithosphère, fissure, fluide hydrothermal, magma résiduel.
2. Dans quelles roches peut-on trouver de l'étain ?
3. Explique la formation des minerais filoniens à gangue de quartz.
4. Quelle méthode d'exploitation proposes-tu pour ces filons ?
5. Quels sont les effets de l'exploitation minière ?`,
    solution: `1. 1 = lithosphère ; 2 = fluide hydrothermal ; 3 = magma résiduel ; 4 = fissure ; 5 = filon d'or.

2. Dans des roches **magmatiques** (granite, pegmatite) et des roches **sédimentaires** (alluvions).

3. Des fluides **très chauds** (hydrothermaux) circulent dans les fissures de la roche ; en refroidissant, ils déposent les métaux et le quartz : le minerai se **concentre** dans le filon.

4. Les filons sont **en profondeur** : on choisit une **exploitation souterraine** (galeries).

5. **Positif** : richesse, emplois, meilleure qualité de vie. **Négatif** : destruction des sols et des paysages, pollution de l'eau et de l'air, gaz toxiques, atteintes à la santé et à la biodiversité.`,
  },
  {
    title: "Gîtes d'or primaires et secondaires", difficulty: 3,
    statement: `[Document : bloc-diagramme d'une région avec une rivière, une faille, un filon et une roche magmatique ; cinq gîtes d'or numérotés de 1 à 5.]

1. a) Identifie les gîtes 1 à 5. b) Propose une méthode de prospection pour le gîte 2 (dans la rivière).
2. Définis gîte, gisement et minerai.
3. D'où vient l'or des gîtes secondaires ? Classe les gîtes en primaires et secondaires.
4. Comment exploite-t-on l'or à ciel ouvert ?
5. Propose des mesures de protection de l'environnement.`,
    solution: `1. a) 1 = veine de quartz aurifère (gîte de faille) ; 2 = **gîte alluvionnaire** (placer) ; 3 = paléoplacer (ancien placer) ; 4 = gîte d'altération ; 5 = gîte filonien.
b) **Prospection alluvionnaire à la batée** : on lave les sables et graviers de la rivière ; l'or, très **dense**, reste au fond.

2. **Gisement** : lieu où l'on trouve une substance utile. **Gîte** : gisement de métaux exploitables. **Minerai** : roche qui contient assez de substance utile pour être exploitée.

3. L'or vient de gisements qui **affleurent** : les eaux l'**arrachent**, le **transportent**, puis il se **dépose** par gravité dans les plaines et les lits des rivières.
Primaires : veine de quartz aurifère, gîte filonien. Secondaires : gîte alluvionnaire, paléoplacer, gîte d'altération.

4. Quand le gisement affleure : on enlève la végétation puis la couche qui recouvre le minerai (le **mort-terrain**), c'est la « découverte », puis on extrait le minerai.

5. **Reboiser**, protéger les sols, **traiter** les eaux usées et les gaz rejetés, **réhabiliter** le site.`,
  },
  {
    title: 'Formation du pétrole et pièges', difficulty: 3,
    statement: `Dans un bassin sédimentaire, on mesure la teneur en hydrocarbures des argiles selon la profondeur : faible et presque constante jusqu'à 1 815 m, puis forte hausse jusqu'à 3 000 ppm vers 3 490 m. Au laboratoire, on chauffe la matière organique : le maximum d'« huile » apparaît vers **450 °C**. La température augmente de **30 °C par 1 000 m**.

1. Analyse les mesures de terrain.
2. Compare la température de formation du pétrole au laboratoire et dans la nature.
3. Comment expliquer cette différence ?
4. Qu'est-ce qu'un piège à pétrole ? Explique la formation d'un gisement.`,
    solution: `1. Jusqu'à 1 815 m, la teneur reste **faible** (≈ 158 ppm) ; au-delà, elle **augmente fortement** jusqu'à ≈ 3 000 ppm vers 3 490 m.

2. À 3 490 m, la température est d'environ $\\dfrac{30 \\times 3\\,490}{1\\,000} \\approx 105$ °C (au-dessus de la surface). Au laboratoire, il faut 450 °C : environ **4 fois plus chaud**.

3. Dans la nature interviennent aussi la **pression**, l'action des **bactéries** et surtout le **temps** (des millions d'années) : la transformation se fait donc à plus basse température.

4. Un **piège à pétrole** est une structure (anticlinal, faille…) où les hydrocarbures s'**accumulent** sous une roche **imperméable** (roche couverture). Formation : la matière organique se dépose avec les argiles, à l'abri de l'oxygène ; enfouie, elle devient kérogène puis **pétrole** ; moins dense, le pétrole **migre** vers le haut à travers une roche poreuse (roche-réservoir) jusqu'à être **bloqué** par la couche imperméable.`,
  },
  {
    title: 'Prospection pétrolière : le gisement « Bélier »', difficulty: 2,
    statement: `[Document : colonne de roches d'un bassin côtier (sable, argile, grès), avec le gisement « Bélier » et une échelle de température.]

1. Décris la prospection par **sismique réflexion**.
2. Comment évolue la température avec la profondeur ?
3. Le gisement se trouve entre 2 000 et 2 050 m, dans une couche de grès surmontée d'argile. Pourquoi le pétrole s'est-il accumulé là ?`,
    solution: `1. On crée des **ondes** artificielles (explosions, chocs) ; elles se **réfléchissent** sur les limites entre couches et reviennent en surface, où on les enregistre. On en déduit la **structure du sous-sol**.

2. La température **augmente régulièrement** avec la profondeur (la courbe est une droite croissante).

3. Le **grès** est **poreux** : c'est une roche-réservoir où le pétrole peut circuler. L'**argile** au-dessus est **imperméable** : elle bloque la remontée du pétrole, qui s'accumule dans le grès.`,
  },
]

/** Exercices de chaque chapitre (clé = nom du fichier de cours). */
export const EXERCISES = {
  'divisions-cellulaires': [D1],
  'reproduction-animaux': [R1, R2, R6, R8],
  'reproduction-homme': [R1, R2, R3, R4, R5, R6, R8],
  'reproduction-vegetaux': [R7],
  'systeme-nerveux': N,
  'activite-cardiaque': C,
  'genetique': GE,
  'immunologie': I,
  'ressources-geologiques': G,
}
