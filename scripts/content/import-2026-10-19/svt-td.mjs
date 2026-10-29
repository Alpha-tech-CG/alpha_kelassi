// SVT Terminale D — TD « Reproduction humaine » (Lycée Chaminade) et TD « Les prévisions en
// génétique humaine » (Inspection des lycées zone 1, 04/02/2022). Énoncés transcrits des scans,
// pages originales jointes (figures) ; corrigés rédigés pour l'application.
const R = 'svt-td-reproduction-humaine-2'
const G = 'svt-td-genetique-humaine-1'
const p = (file, ...pages) => pages.map((n) => `${file}-p${String(n).padStart(2, '0')}.jpg`)

export const repro = [
  {
    title: 'TD Reproduction humaine — Partie A : restitution des connaissances',
    pages: p(R, 1),
    statement: `**I. Définitions** — Donnez la définition des mots et groupes de mots suivants : acrosome, nidation, hormone.

**II. Questions à choix multiples** — Choisissez la ou les bonne(s) réponse(s) (exemple : e = vrai).
- a) La pilule bloque l'ovulation en : a1) supprimant le pic de LH ; a2) supprimant le pic d'œstradiol ; a3) exerçant un rétrocontrôle négatif sur le complexe hypothalamo-hypophysaire.
- b) La stérilité masculine peut être causée par : b1) les canaux déférents obstrués ; b2) les spermatozoïdes anormaux ; b3) un pH du sperme compris entre 7 et 7,5.
- c) Chaque spermatozoïde possède : c1) un seul allèle de chaque gène de l'espèce ; c2) à la fois des chromosomes d'origine paternelle et d'origine maternelle ; c3) 46 chromosomes.
- d) Que se passe-t-il si l'ovocyte II n'est pas fécondé : d1) les sécrétions d'hormones baissent ; d2) l'endomètre est détruit ; d3) les règles apparaissent.

**III. Appariement** — Associez un numéro de la liste 1 à une lettre de la liste 2.
- Liste 1 : 1. Progestérone ; 2. Hypophyse ; 3. Corps jaune ; 4. Utérus ; 5. Filtrage du sperme
- Liste 2 : a. Glande qui sécrète deux hormones contrôlant l'activité ovarienne ; b. Glaire cervicale ; c. Hormone ovarienne sécrétée uniquement en deuxième phase du cycle sexuel ; d. Voie génitale femelle ; e. Résultat de la transformation du follicule ovarien après l'ovulation

**IV. Vrai ou faux** — Les affirmations suivantes sont-elles vraies ou fausses ? Dans ce dernier cas, donnez la réponse juste.
1. La polyspermie est une production trop abondante de spermatozoïdes.
2. La testostérone est produite par les cellules de Sertoli du tube séminifère.
3. Les enzymes acrosomiales servent à digérer la membrane de l'ovocyte.
4. L'entretien de la sécrétion lactée suppose l'intervention de deux types de messages : nerveux afférents et hormonaux efférents.

**V. Réarrangement** — Les lettres a, b, c, d et e représentent les événements du cycle sexuel chez la femme. Donnez l'ordre normal du déroulement de ce phénomène (exemple : f-g-h-i-k).
a = ovulation ; b = pic de sécrétion de LH ; c = pic de sécrétion des œstrogènes ; d = corps jaune ; e = pic de sécrétion de la progestérone`,
    solution: `**I. Définitions**
- **Acrosome** : vésicule qui coiffe le noyau du spermatozoïde ; elle contient des enzymes (hyaluronidase, acrosine) qui permettent au spermatozoïde de traverser les enveloppes de l'ovocyte (corona radiata, zone pellucide).
- **Nidation** : implantation de l'embryon (au stade blastocyste) dans la muqueuse utérine (endomètre), environ 7 jours après la fécondation.
- **Hormone** : substance chimique sécrétée par une glande endocrine, transportée par le sang, qui agit à faible dose sur des cellules cibles possédant des récepteurs spécifiques.

**II. QCM**
- a = **a1 et a3** : les hormones de synthèse exercent un rétrocontrôle négatif sur l'hypothalamus et l'hypophyse, ce qui supprime le pic de LH, donc l'ovulation.
- b = **b1 et b2** (un pH de 7 à 7,5 est normal).
- c = **c1 et c2** (le spermatozoïde est haploïde : 23 chromosomes, un allèle par gène ; la répartition indépendante des chromosomes à la méiose mélange chromosomes d'origine paternelle et maternelle). c3 est faux.
- d = **d1, d2 et d3** : le corps jaune régresse, les taux d'œstradiol et de progestérone chutent, l'endomètre se désagrège et les règles apparaissent.

**III. Appariement** : 1 = c ; 2 = a ; 3 = e ; 4 = d ; 5 = b.

**IV. Vrai ou faux**
1. **Faux** : la polyspermie est la pénétration de plusieurs spermatozoïdes dans un même ovocyte.
2. **Faux** : la testostérone est produite par les **cellules de Leydig** (cellules interstitielles), situées entre les tubes séminifères.
3. **Faux** : les enzymes acrosomiales digèrent les **enveloppes** de l'ovocyte (corona radiata, zone pellucide) ; la membrane de l'ovocyte, elle, **fusionne** avec celle du spermatozoïde.
4. **Vrai** : c'est un réflexe neuro-endocrinien (succion du mamelon → message nerveux vers l'hypothalamus → sécrétion de prolactine et d'ocytocine).

**V. Réarrangement** : **c – b – a – d – e** (pic d'œstrogènes → pic de LH → ovulation → corps jaune → pic de progestérone).`,
  },
  {
    title: 'TD Reproduction humaine — Exercice 1 : la FIVETE',
    pages: p(R, 2),
    statement: `La FIVETE offre aux couples stériles la possibilité de procréer ; les follicules sont prélevés dans l'organe sexuel femelle.
1. Développez le mot « FIVETE ».
2. Comment s'appelle cet organe ?
3. Cet organe joue deux rôles principaux. Lesquels ?
4. Dans les conditions normales, le gamète femelle est libéré sous l'action d'une hormone : laquelle ? Donnez son origine.

Le clinicien repère un follicule et aspire le contenu avec une seringue spéciale :
5. Schématisez le gamète femelle ainsi recueilli et mettez des légendes.
6. En réduisant le nombre de chromosomes à 2n = 6, faites le schéma du noyau précédent.
7. Quelques jours après la fécondation in vitro, l'embryon est replacé dans la muqueuse hypertrophiée de l'utérus. Cette muqueuse a été préparée par deux hormones : lesquelles ? Justifiez votre réponse.`,
    solution: `1. **FIVETE** = **F**écondation **I**n **V**itro **E**t **T**ransfert d'**E**mbryon.
2. L'**ovaire**.
3. - Rôle **exocrine** (gamétogène) : production des ovocytes (ovogenèse, maturation des follicules).
   - Rôle **endocrine** : sécrétion des hormones ovariennes (œstrogènes et progestérone).
4. La **LH** (hormone lutéinisante) : son **pic** déclenche l'ovulation. Elle est sécrétée par l'**antéhypophyse** (hypophyse antérieure).
5. Schéma de l'**ovocyte II** (ovocyte de 2ᵉ ordre) : cellules folliculaires de la **corona radiata**, **zone pellucide**, **espace périvitellin** contenant le **1ᵉʳ globule polaire**, **membrane plasmique**, **cytoplasme** avec granules corticaux, **noyau bloqué en métaphase II** (chromosomes sur la plaque équatoriale du fuseau).
6. Avec 2n = 6, l'ovocyte II est haploïde : on dessine **3 chromosomes à 2 chromatides** (un de chaque paire, de tailles différentes) alignés sur la plaque équatoriale d'un fuseau de division (métaphase II).
7. L'**œstradiol** puis la **progestérone**. L'œstradiol, sécrété par les follicules pendant la phase folliculaire, fait proliférer l'endomètre ; la progestérone, sécrétée par le corps jaune après l'ovulation, agit sur cet endomètre déjà préparé et le transforme en **dentelle utérine** (glandes sécrétrices, vaisseaux spiralés), état favorable à la nidation. L'une sans l'autre ne suffit pas (voir l'expérience des lapines, exercice 3).`,
  },
  {
    title: 'TD Reproduction humaine — Exercice 2 : régulation de la fonction testiculaire',
    pages: p(R, 2, 3),
    statement: `On se propose d'étudier quelques aspects de la régulation de la fonction testiculaire chez l'homme à partir des résultats expérimentaux suivants. Le document 2 présente la relation entre l'hypophyse et l'hypothalamus (noyau hypothalamique, vaisseau sanguin, tige de l'hypophyse ou tige pituitaire, niveau AB, hypophyse antérieure — voir la page scannée).

**Première série d'expériences**
- Expérience (a) : chez un rat adulte, on enlève l'hypophyse puis on la greffe à un endroit quelconque sur le même animal. L'hypophyse greffée de cette manière cesse de sécréter les gonadostimulines (FSH et LH).
- Expérience (b) : chez un autre rat adulte, l'hypophyse est maintenue en place mais la tige pituitaire est sectionnée au niveau AB et séparée de l'hypothalamus par un papier imperméable. On constate dans ce cas que l'hypophyse ne produit pas de gonadostimulines.

1. Analysez ces deux expériences en vue de déduire la relation entre l'hypothalamus et l'hypophyse antérieure.

**Deuxième série d'expériences**
- Expérience (c) : on prélève l'hypophyse d'un rat pubère et on la cultive sur milieu nutritif approprié. On remarque qu'elle ne libère pas de gonadostimulines (FSH et LH).
- Expérience (d) : on répète l'expérience (c) en ajoutant au milieu de culture des extraits d'hypothalamus provenant d'un rat normal. Il se produit une sécrétion de gonadostimulines.
- Expérience (e) : on répète l'expérience (c) en ajoutant des extraits d'hypothalamus provenant d'un rat castré. On observe une abondante sécrétion de gonadostimulines.
- Expérience (f) : on répète l'expérience (c) en ajoutant des extraits d'hypothalamus provenant d'un rat auquel on a injecté une forte dose de testostérone. La sécrétion de gonadostimulines par l'hypophyse devient très faible.

2. Analysez les expériences (c), (d), (e) et (f) en vue de déduire la (ou les) relation(s) entre l'hypothalamus, l'hypophyse et les testicules.
3. En exploitant uniquement les données des expériences précédentes, représentez sous forme d'un schéma fonctionnel commenté la régulation hormonale de la fonction reproductrice chez l'homme.`,
    solution: `**1.** Dans les deux cas, l'hypophyse, bien que vivante, ne sécrète plus FSH ni LH dès qu'elle est **séparée de l'hypothalamus** (greffe à distance ou section de la tige avec interposition d'un papier imperméable qui empêche le rétablissement des vaisseaux).
→ L'activité de l'antéhypophyse dépend de l'hypothalamus, qui la commande **par voie sanguine** (vaisseaux de la tige pituitaire : système porte hypothalamo-hypophysaire).

**2.**
- (c) : isolée, l'hypophyse ne sécrète rien → elle a besoin d'une stimulation.
- (d) : des extraits d'hypothalamus suffisent à déclencher la sécrétion → l'hypothalamus produit une **substance chimique stimulante** (une neurohormone : la **GnRH**).
- (e) : l'hypothalamus d'un rat **castré** stimule davantage → en l'absence de testicules, l'hypothalamus produit plus de GnRH : les testicules **freinent** normalement l'hypothalamus.
- (f) : après une forte dose de testostérone, l'hypothalamus stimule très peu → c'est la **testostérone** qui exerce ce frein.

Conclusion : l'hypothalamus stimule l'antéhypophyse par la GnRH ; l'antéhypophyse stimule les testicules par FSH et LH ; la testostérone testiculaire exerce un **rétrocontrôle négatif** sur l'hypothalamus.

**3. Schéma fonctionnel**
\`\`\`
        Hypothalamus
            │ GnRH (+)  ◄────────────────┐
            ▼                            │
    Antéhypophyse                        │ rétrocontrôle
            │ FSH, LH (+)                │ négatif (−)
            ▼                            │
        Testicules ── testostérone ──────┘
\`\`\`
Commentaire : la sécrétion de testostérone se maintient ainsi à un niveau à peu près constant ; si elle augmente, elle freine la sécrétion de GnRH (donc de FSH et LH) ; si elle diminue (castration), le frein est levé.`,
  },
  {
    title: 'TD Reproduction humaine — Exercice 3 : hormones ovariennes et endomètre (lapines)',
    pages: p(R, 3),
    statement: `Le développement de l'endomètre avant la fécondation puis son maintien dans un état favorable sont les conditions nécessaires au bon déroulement de l'implantation puis de la grossesse. On effectue sur plusieurs lots de lapines impubères des expériences dont le protocole et les résultats sont présentés dans le tableau suivant (1 : endomètre, 2 : myomètre ; tous les schémas sont à la même échelle — voir la page scannée).

| | Lot 1 | Lot 2 | Lot 3 | Lot 4 |
|---|---|---|---|---|
| Injection d'œstradiol au temps t1 | Non | Non | Oui | Oui |
| Injection de progestérone au temps t2 (t2 > t1) | Non | Oui | Non | Oui |
| Aspect de l'utérus en coupe | petit, endomètre mince | identique au lot 1 | endomètre un peu plus développé | utérus très développé, endomètre épais et plissé |

1. Expliquez pourquoi ces expériences ont été effectuées sur des lapines impubères.
2. Analysez les résultats d'expériences.
3. Concluez.`,
    solution: `**1.** Chez des lapines **impubères**, les ovaires ne sécrètent pas encore d'hormones : les effets observés ne peuvent être dus qu'aux hormones **injectées** (pas d'interférence avec des hormones naturelles).

**2.**
- Lot 1 (témoin, aucune injection) : utérus petit, endomètre mince.
- Lot 2 (progestérone seule) : aucun changement par rapport au témoin → la progestérone seule est **sans effet**.
- Lot 3 (œstradiol seul) : endomètre un peu plus épais → l'œstradiol provoque la **prolifération** de l'endomètre.
- Lot 4 (œstradiol puis progestérone) : endomètre très épais et plissé (**dentelle utérine**) → effet maximal.

**3.** L'œstradiol prépare l'endomètre (prolifération) ; la progestérone n'agit que sur un endomètre **préalablement préparé par l'œstradiol** et le transforme en dentelle utérine, état nécessaire à la nidation. Les deux hormones agissent donc **successivement et en synergie** (l'œstradiol permet notamment la mise en place des récepteurs à la progestérone).`,
  },
  {
    title: 'TD Reproduction humaine — Exercice 4 : la glaire cervicale',
    pages: p(R, 3, 4),
    statement: `Au cours du cycle menstruel, le col de l'utérus subit des modifications en rapport avec la sécrétion de glaire par les glandes cervicales (voir le document I sur la page scannée : quantité de glaire en fonction des jours du cycle, avec son aspect, son pH et ses éléments figurés).

| Période | Règles → 8ᵉ j | ~ 8ᵉ-10ᵉ j | 10ᵉ → 14ᵉ j | 14ᵉ → 20ᵉ j | après le 20ᵉ j |
|---|---|---|---|---|---|
| Aspect | Clair | Épais | Clair | Coagule | Peu transparent |
| pH | Légèrement neutre ou acide | | Alcalin | Légèrement neutre ou acide | |
| Éléments figurés | Nombreux mais isolés | | 0 | Nombreux | Nombreux s'agglomérant |

1. Analysez le graphe du document I.
2. Citez les différents rôles physiologiques attribués au mucus cervical.`,
    solution: `**1.** La quantité de glaire est faible au début du cycle, augmente fortement à partir du 8ᵉ-10ᵉ jour, atteint un **maximum juste avant le 14ᵉ jour** (période de l'ovulation), puis chute rapidement ; un petit pic secondaire apparaît vers le 20ᵉ jour.
Autour de l'ovulation (10ᵉ-14ᵉ jour), le col s'ouvre et la glaire est **abondante, claire, alcaline et sans éléments figurés** : elle est perméable aux spermatozoïdes. Le reste du cycle, elle est **peu abondante, épaisse ou coagulée, neutre à acide et riche en éléments figurés** (cellules, leucocytes) : elle forme un bouchon qui s'oppose au passage des spermatozoïdes.
Ces variations sont sous contrôle hormonal : l'œstradiol (élevé avant l'ovulation) rend la glaire abondante et filante ; la progestérone (phase lutéale) l'épaissit.

**2.** Rôles de la glaire cervicale :
- **barrière** protectrice contre les microbes et, hors période ovulatoire, contre les spermatozoïdes (rôle contraceptif naturel) ;
- **filtre** sélectif qui, en période ovulatoire, laisse passer les spermatozoïdes mobiles et normaux et retient les anormaux ;
- **protection et nutrition** des spermatozoïdes (son pH alcalin neutralise l'acidité vaginale) ;
- **réservoir** de spermatozoïdes, libérés progressivement vers l'utérus.`,
  },
  {
    title: 'TD Reproduction humaine — Exercice 5 : la fécondation',
    pages: p(R, 4),
    statement: `Les figures A et B du document II (voir la page scannée) se rapportent à la fécondation chez un mammifère.
1. Annotez et légendez les figures A et B (légendes 1 à 5 et titre 6 pour A ; légendes 7 à 10 et titre 11 pour B).
2. Expliquez dans les grandes lignes ce qui s'est passé entre l'étape A et l'étape B.
3. Expliquez ce qui va se dérouler pour arriver à la fin de la fécondation après l'étape B.`,
    solution: `**1.**
- Figure A — titre (6) : **ovocyte II entouré de spermatozoïdes au moment de la fécondation** (pénétration d'un spermatozoïde). Structures à légender (1 à 5, en suivant les traits de rappel) : cellules folliculaires de la **corona radiata**, **zone pellucide**, **spermatozoïdes**, **membrane** et **cytoplasme** de l'ovocyte, noyau de l'ovocyte bloqué en **métaphase II**.
- Figure B — titre (11) : **œuf (zygote) au stade des deux pronucléi**. Structures à légender (7 à 10) : **zone pellucide**, **globules polaires** (1ᵉʳ et 2ᵉ), **pronucléus mâle**, **pronucléus femelle**.

**2.** Entre A et B :
- **réaction acrosomique** : les enzymes de l'acrosome permettent au spermatozoïde de traverser la corona radiata puis la zone pellucide ;
- **fusion** des membranes du spermatozoïde et de l'ovocyte ; la tête du spermatozoïde entre dans le cytoplasme ;
- **réaction corticale** : les granules corticaux libèrent leur contenu, la zone pellucide durcit → blocage de la **polyspermie** ;
- l'ovocyte, activé, **achève sa méiose II** et expulse le **2ᵉ globule polaire** ;
- le noyau du spermatozoïde et celui de l'ovule se gonflent et forment les **pronucléi** mâle et femelle.

**3.** Après B : les deux pronucléi **répliquent leur ADN**, **migrent** l'un vers l'autre, leurs enveloppes disparaissent et leurs chromosomes se rassemblent sur une même plaque équatoriale : c'est l'**amphimixie** (caryogamie). La cellule-œuf diploïde (2n = 46) est formée : la fécondation est achevée, et la **première mitose** de segmentation commence.`,
  },
  {
    title: 'TD Reproduction humaine — Exercice 6 : la pilule contraceptive',
    pages: p(R, 4, 5),
    statement: `Chez une femme fertile, on dose dans le plasma sanguin trois hormones impliquées dans le cycle sexuel (LH, œstradiol, progestérone). Le résultat de ces dosages, sur trois cycles (janvier, février, mars), est traduit graphiquement dans le document 1. Le document 2 présente des dosages équivalents, mais réalisés chez une femme sous contraception orale (« pilule » constituée d'un mélange œstrogène – progestatif de synthèse, prise quotidienne du jour 0 au jour 21 ; seules les hormones naturelles ont été dosées). Voir les graphiques sur les pages scannées.
1. Analysez les documents 1 et 2.
2. Comparez ces deux documents en faisant ressortir uniquement les différences.
3. a. Déduisez le rôle des pilules absorbées. b. Justifiez la réponse.
4. L'arrêt de la prise de pilules à partir du 21ᵉ jour est suivi de règles presque normales. Expliquez pourquoi.`,
    solution: `**1.**
- Document 1 (femme fertile) : les cycles durent **28 jours**. La **LH** reste basse sauf un **pic** très net (≈ 35 ng/ml) vers le **14ᵉ jour**. L'**œstradiol** augmente pendant la première moitié du cycle jusqu'à un **pic** (≈ 250-300 pg/ml) juste avant le pic de LH, chute, puis remonte modérément en deuxième phase. La **progestérone** est quasi nulle en première phase et élevée (≈ 20-25 ng/ml) du 16ᵉ au 24ᵉ jour environ.
- Document 2 (femme sous pilule) : les trois hormones naturelles restent **basses et à peu près constantes** pendant tout le cycle ; aucun pic.

**2.** Sous pilule : **pas de pic de LH**, **pas de pic d'œstradiol**, **pas de sécrétion importante de progestérone** en deuxième phase.

**3. a.** La pilule **empêche l'ovulation** (rôle contraceptif).
**b.** Les hormones de synthèse, présentes en permanence, exercent un **rétrocontrôle négatif** sur le complexe hypothalamo-hypophysaire : la sécrétion de GnRH, FSH et LH reste faible, les follicules ne mûrissent pas (pas de pic d'œstradiol), le rétrocontrôle positif ne se produit pas, donc pas de pic de LH, pas d'ovulation, pas de corps jaune (pas de progestérone naturelle).

**4.** Pendant la prise, l'endomètre est entretenu par les hormones de synthèse. À l'arrêt (21ᵉ jour), leur taux **chute brutalement** : l'endomètre n'est plus maintenu, il se désagrège et provoque un saignement semblable aux règles (« hémorragie de privation »).`,
  },
  {
    title: 'TD Reproduction humaine — Problème : le cycle sexuel et son contrôle',
    pages: p(R, 6, 7),
    statement: `**A.** Le cycle sexuel est un ensemble d'événements sexuels qui se produisent de façon répétitive aux mêmes intervalles de temps. On veut comprendre l'évolution de la concentration plasmatique de deux hormones ovariennes. Les courbes 2 et 3 du document 1 donnent la concentration plasmatique de ces deux hormones chez la femme ; la courbe 1 donne le taux plasmatique d'une hormone hypophysaire (voir la page scannée).
1. De quel problème s'agit-il ?
2. Déterminez le nom et l'origine de chacune de ces hormones.
3. Déterminez la durée du cycle sexuel et la date approximative de l'ovulation.

**B.** Le document 2 représente des coupes transversales (a et b) d'un organe féminin.
- a) De quel organe s'agit-il ?
- b) Situez les coupes obtenues par rapport aux phases du cycle sexuel.

**C.** Afin de chercher le déterminisme des transformations que subit cet organe au cours du cycle sexuel, on réalise les expériences suivantes :
- Expérience 1 : l'ovariectomie totale d'une rate entraîne la disparition de telles modifications, alors que la greffe d'un fragment d'ovaire les fait rétablir.
- Expérience 2 : des lapines impubères reçoivent des injections quotidiennes d'œstradiol ou de progestérone durant un certain nombre de jours :

| Traitement | Résultat |
|---|---|
| Progestérone seule | Pas de développement important de l'utérus |
| Œstradiol seul | Pas de développement important de l'utérus |
| Œstradiol + progestérone | Développement important de l'endomètre |

- a) Quelle conclusion pouvez-vous tirer de ces expériences ?
- b) Décrivez les modifications que subit cet organe au cours du cycle. Quel est l'intérêt de telles modifications ?

**D.** Le document 3 correspond à des dosages réalisés chez une femme prenant des pilules combinées.
- a) Comparez les courbes obtenues à celles du document 1.
- b) Déterminez d'après vos connaissances le rôle des pilules absorbées.
- c) Peut-on observer les modifications habituelles au niveau de l'organe considéré ? Expliquez.
- d) L'arrêt de la prise de la pilule à partir du 21ᵉ jour est suivi de règles presque normales. Expliquez le maintien de la menstruation.`,
    solution: `**A. 1.** Il s'agit de comprendre comment évoluent les hormones hypophysaire et ovariennes au cours du cycle et comment elles sont liées entre elles.
**2.** Courbe 1 : **LH**, sécrétée par l'**antéhypophyse**. Courbe 2 : **œstradiol**, sécrété par les **follicules** (thèque interne et granulosa) puis par le corps jaune. Courbe 3 : **progestérone**, sécrétée par le **corps jaune**.
**3.** Les pics de LH se répètent tous les **28 jours** : le cycle dure 28 jours. L'ovulation a lieu vers le **14ᵉ jour**, juste après le pic de LH (≈ 24 à 36 h après).

**B. a)** L'**utérus** (coupe montrant l'endomètre).
**b)** Coupe **a** (endomètre mince, peu plissé) : **phase folliculaire** (début de cycle, après les règles). Coupe **b** (endomètre épais, très plissé, en dentelle) : **phase lutéale** (deuxième moitié du cycle).

**C. a)** Les modifications de l'utérus sont commandées par les **ovaires**, par voie **hormonale** (une greffe, non innervée, les rétablit). Ni l'œstradiol seul ni la progestérone seule ne suffisent : seule leur **association** (l'œstradiol puis la progestérone) entraîne le développement de l'endomètre.
**b)** - Phase **menstruelle** (jours 1 à 4-5) : destruction de la partie superficielle de l'endomètre (règles).
- Phase **proliférative** (jusqu'au 14ᵉ jour), sous l'action de l'œstradiol : l'endomètre s'épaissit, ses glandes s'allongent, les vaisseaux se développent.
- Phase **sécrétoire** (après l'ovulation), sous l'action de la progestérone : les glandes deviennent tortueuses et sécrètent du glycogène, les artérioles se spiralisent : c'est la **dentelle utérine** ; le myomètre est au repos.
Intérêt : préparer l'utérus à recevoir l'embryon (**nidation**) au moment où il arrive, environ une semaine après l'ovulation.

**D. a)** Sous pilule, les taux d'œstradiol, de progestérone et de LH restent **bas et constants** : il n'y a ni pic d'œstradiol, ni pic de LH, ni montée de progestérone.
**b)** La pilule **bloque l'ovulation** par rétrocontrôle négatif sur l'hypothalamus et l'hypophyse.
**c)** Non : sans cycle ovarien naturel, l'endomètre ne connaît pas les transformations habituelles ; il reste peu développé (entretenu seulement par les hormones de synthèse) et peu propice à une nidation.
**d)** Les hormones de synthèse entretiennent l'endomètre ; leur arrêt au 21ᵉ jour provoque une chute brutale du taux hormonal, l'endomètre se désagrège et les règles apparaissent.`,
  },
  {
    title: 'TD Reproduction humaine — Problème : le devenir de l\'œuf fécondé',
    pages: p(R, 7),
    statement: `On se propose d'étudier le devenir de l'œuf issu de la fécondation chez l'espèce humaine. La figure 1 représente une coupe partielle de l'appareil génital de la femme (lettres a à f) et la figure 2 indique dans le désordre les étapes (numérotées 1 à 6) qui se déroulent depuis l'ovulation jusqu'à l'implantation de l'embryon (voir la page scannée).
1. De quel problème s'agit-il ?
2. a) À chacune des lettres de la figure 1, faites correspondre son numéro de la figure 2, en respectant l'ordre chronologique du déroulement du phénomène. b) Justifiez votre réponse.
3. Émettez une hypothèse quant au devenir de l'œuf fécondé.
4. Exposez comment ces étapes sont rendues possibles au cours de la période considérée grâce à des phénomènes physiologiques concernant l'hypophyse, l'ovaire et l'utérus.`,
    solution: `**1.** Il s'agit de savoir ce que devient l'œuf entre la fécondation et l'implantation, et où se déroulent ces étapes.

**2. a)** L'ordre chronologique des stades de la figure 2 est :
**ovocyte II entouré de spermatozoïdes (fécondation)** → **œuf au stade des deux pronucléi** → **embryon à 2 cellules** → **morula** (amas de cellules pleines) → **blastocyste** (cavité, bouton embryonnaire).
On les place de l'ovaire vers l'utérus, le long des lettres de la figure 1 : ovulation à la surface de l'ovaire, fécondation dans le tiers externe de la trompe (ampoule), segmentation pendant la descente dans la trompe, blastocyste dans la cavité utérine où il s'implante dans l'endomètre.
**b)** Justification : les divisions de segmentation augmentent progressivement le nombre de cellules (1 → 2 → morula → blastocyste) pendant que l'embryon est transporté vers l'utérus ; il faut environ 3-4 jours pour atteindre l'utérus et la nidation a lieu vers le 7ᵉ jour.

**3.** Hypothèse : l'œuf fécondé se divise (segmentation) en descendant la trompe, puis s'implante dans la muqueuse utérine où il poursuit son développement.

**4.** - **Hypophyse** : le pic de LH déclenche l'ovulation et la transformation du follicule rompu en **corps jaune**.
- **Ovaire** : le corps jaune sécrète **progestérone** et œstradiol ; en cas de fécondation, il est maintenu par l'hormone **hCG** sécrétée par l'embryon, ce qui évite les règles.
- **Utérus** : sous l'action de l'œstradiol puis de la progestérone, l'endomètre devient une **dentelle utérine** riche en glycogène et en vaisseaux, prête à accueillir l'embryon ; la progestérone met le myomètre au repos (pas de contractions qui expulseraient l'embryon). Dans la trompe, les cils et les contractions font progresser l'œuf.`,
  },
  {
    title: 'TD Reproduction humaine — Problème : la stérilité de M. et Mme X',
    pages: p(R, 8),
    statement: `La reproduction humaine est un mécanisme de multiplication qui nécessite le concours de deux parents, l'homme et la femme. Ces individus produisent dans leurs glandes génitales des cellules sexuelles ou gamètes. Monsieur et madame X ont consulté un médecin afin de comprendre les causes de leur stérilité. Ils ont subi des examens biologiques.
5. Identifiez le problème posé dans ce texte.

Document 1 : spermogramme de Monsieur X au moment de l'éjaculation.

| Spermatozoïdes | Homme normal | Monsieur X |
|---|---|---|
| Nombre | 53.10⁶/ml | 56.10⁶/ml |
| Pourcentage des anormaux | 35 | 65 |
| Pourcentage de mobilité au temps t0 + 1 heure | 55 | 25 |
| Pourcentage de mobilité au temps t0 + 4 heures | 45 | 23 |
| Volume de l'éjaculat | 4 ml | 1,5 ml |

6. Analysez les résultats du document 1 obtenus chez Monsieur X. Concluez. (1,5 pt)

Document 2 : examen des sécrétions ovariennes et utérines au moment de l'ovulation et après, chez Madame X.

| | | Femme normale | Madame X |
|---|---|---|---|
| Glaire cervicale | Acidité | + | +++ |
| | Fluidité | Moyenne | Moyenne |
| Œstrogènes | 14ᵉ jour | 0,35 ng/ml | 0,32 ng/ml |
| | 20ᵉ jour | 0,20 ng/ml | 0,22 ng/ml |
| Progestérone | 14ᵉ jour | 5 ng/ml | 5 ng/ml |
| | 20ᵉ jour | 25 ng/ml | 8 ng/ml |

7. Analysez les résultats du document 2 obtenus chez Madame X. Concluez.`,
    solution: `**5.** Il s'agit de déterminer la (ou les) cause(s) de la stérilité du couple X.

**6.** Le nombre de spermatozoïdes de M. X est normal (56 millions/ml). En revanche :
- **65 %** de spermatozoïdes anormaux contre 35 % (**tératospermie**) ;
- mobilité très réduite : **25 %** puis 23 % contre 55 % puis 45 % (**asthénospermie**) ;
- volume de l'éjaculat faible : **1,5 ml** contre 4 ml (**hypospermie**, sécrétions des glandes annexes insuffisantes).
Conclusion : M. X est **hypofertile** : peu de spermatozoïdes normaux et mobiles atteignent l'ovocyte.

**7.** Chez Mme X, les œstrogènes sont normaux, la fluidité de la glaire aussi, mais :
- la glaire est **très acide** (+++), milieu défavorable à la survie et à la mobilité des spermatozoïdes ;
- la progestérone du **20ᵉ jour** est très faible (**8 ng/ml** contre 25) : le **corps jaune fonctionne mal** (insuffisance lutéale), donc l'endomètre est mal préparé et la nidation est compromise.
Conclusion : Mme X présente aussi des anomalies. La stérilité du couple a une **double origine**, masculine et féminine.`,
  },
  {
    title: 'TD Reproduction humaine — Exercice : les cellules du testicule',
    pages: p(R, 9),
    statement: `Sur une coupe microscopique de testicule (document 3, voir la page scannée), on repère trois types de cellules (1, 2 et 3) impliquées plus ou moins directement dans la spermatogenèse.

Expérience 1 : on sait que l'activité des cellules testiculaires est sous le contrôle des gonadostimulines hypophysaires. On injecte des gonadostimulines à un animal impubère et on note les conséquences au niveau des trois types cellulaires (tableau 1).

| Éléments observés | Injection de LH | Injection de FSH |
|---|---|---|
| Lignée germinale | Au repos | Activée |
| Cellules de Sertoli | Peu développées | Développées |
| Cellules de Leydig | Activées | Inactivées |

Expérience 2 : on cultive des cellules antéhypophysaires, éventuellement en présence d'autres types cellulaires, et on dose les gonadostimulines libérées dans le milieu (tableau 2).

| Activité des cellules hypophysaires | Cellules hypophysaires seules | + cellules de rein ou de rate | + cellules de Leydig |
|---|---|---|---|
| Libération de FSH | 100 % | 100 % | 100 % |
| Libération de LH | 100 % | 100 % | 60 % |

1. Identifiez les trois types cellulaires 1, 2 et 3. (1,5 pt)
2. Donnez le rôle de chaque type cellulaire. (1,5 pt)
3. Quelles précisions apporte l'expérience 1 concernant les « cibles » des gonadostimulines au niveau testiculaire ? (0,5 pt)
4. Quelle relation entre testicule et hypophyse peut être déduite des résultats de l'expérience 2 ? (0,5 pt)`,
    solution: `**1.** Les trois types cellulaires de la coupe sont : les **cellules de Leydig** (cellules interstitielles, en petits amas **entre** les tubes séminifères), les **cellules de Sertoli** (grandes cellules allongées qui s'étendent de la paroi du tube jusqu'à la lumière) et les **cellules de la lignée germinale** (spermatogonies, spermatocytes, spermatides, disposées en couches jusqu'aux spermatozoïdes dans la lumière). Sur le document, le n° 1 (hors du tube) correspond aux cellules de Leydig, le n° 2 à une cellule de Sertoli et le n° 3 aux cellules germinales.

**2.**
- Cellules de **Leydig** : sécrétion de la **testostérone** (fonction endocrine).
- Cellules de **Sertoli** : soutien et **nutrition** des cellules germinales, contrôle de la spermatogenèse (sous l'action de la FSH et de la testostérone), barrière protectrice.
- Cellules **germinales** : formation des **spermatozoïdes** (spermatogenèse : mitoses, méiose, spermiogenèse).

**3.** La **LH** agit sur les **cellules de Leydig** (elle stimule la sécrétion de testostérone) ; la **FSH** agit sur les **cellules de Sertoli**, qui activent la lignée germinale (spermatogenèse).

**4.** Seules les cellules de Leydig diminuent la libération de LH (60 %), sans modifier celle de la FSH : les cellules de Leydig (par la testostérone) exercent un **rétrocontrôle négatif** sur la sécrétion de **LH** par l'hypophyse.`,
  },
  {
    title: 'TD Reproduction humaine — Problème : l\'infertilité de Mme X (dosages de LH)',
    pages: p(R, 10),
    statement: `M. X, devenu mature, rêve de former un foyer harmonieux. Il rencontre Mlle X et les deux décident de vivre ensemble. Malheureusement, huit (8) ans plus tard, aucun enfant n'arrive dans ce foyer ; M. X accuse sa conjointe d'être responsable de cette situation.
Le couple consulte un médecin qui prescrit un traitement médical à Mme X, mais en vain. Le médecin recommande alors des analyses médicales à Mme X : les résultats sont représentés dans le document 3 (taux de LH constant, environ 100, du 5ᵉ au 30ᵉ jour, sans pic).
M. X prend une deuxième femme (Mme X₂) avec laquelle il obtient des jumeaux (une fille et un garçon). Le premier couple veut comprendre la cause de l'infertilité de Mme X et fait faire les mêmes analyses à Mme X₂ : les résultats sont représentés dans le document 4 (taux de LH bas avec un pic d'environ 140 vers le 14ᵉ jour).
Afin de bien cerner la difficulté de Mme X, le médecin fait observer à M. X le document 5 (schéma de la régulation : hypothalamus → sécrétion pulsatile de GnRH → antéhypophyse → FSH, LH → ovaire → œstradiol, rétrocontrôle négatif ou positif ; la progestérone module le rétrocontrôle positif de l'œstradiol). Voir la page scannée.
1. Quel est le problème posé ? (0,5 pt)
2. Analysez les résultats représentés par les documents 3 et 4. (1,5 pt)
3. L'examen clinique de l'ovaire de Mme X montre des vides et une structure fibreuse dans la partie corticale. Quelle information nouvelle apporte cet examen clinique ? (1 pt)
4. Au regard de l'analyse de tous les documents, expliquez la cause de la stérilité chez Mme X. (1,5 pt)
5. M. X a-t-il raison de prendre une deuxième femme ? Justifiez. (1 pt)
6. Quelle conclusion tirez-vous quant au problème posé ? (0,5 pt)`,
    solution: `**1.** Quelle est la cause de l'infertilité de Mme X ?

**2.** Chez Mme X₂ (fertile), la LH est basse pendant le cycle avec un **pic** vers le 14ᵉ jour : ce pic déclenche l'ovulation. Chez Mme X, la LH est **élevée et constante** (≈ 100) pendant tout le cycle, **sans aucun pic** : il n'y a donc **pas d'ovulation**.

**3.** La zone corticale de l'ovaire de Mme X ne contient pas de follicules (vides, tissu fibreux) : ses **ovaires ne fonctionnent pas** (pas de follicules, donc pas d'ovocytes ni d'œstradiol).

**4.** Sans follicules, l'ovaire ne sécrète pas d'œstradiol. Il n'y a donc :
- ni **rétrocontrôle négatif** : l'hypothalamus et l'hypophyse ne sont plus freinés, d'où une LH **constamment élevée** ;
- ni **pic d'œstradiol**, donc ni rétrocontrôle positif, ni pic de LH, ni ovulation.
L'hypophyse fonctionne : la cause de la stérilité est **ovarienne** (absence de follicules). C'est pourquoi le traitement hormonal a échoué.

**5.** Biologiquement, M. X est fertile (il a eu des jumeaux avec Mme X₂) et la stérilité du premier couple vient bien de Mme X. Mais prendre une deuxième femme n'est pas une solution médicale : le couple pouvait envisager d'autres solutions (don d'ovocytes avec FIVETE, adoption). C'est aussi un choix qui relève des valeurs et de la loi, pas de la biologie.

**6.** La stérilité de Mme X est due à une **insuffisance ovarienne** (ovaires dépourvus de follicules) : sans œstradiol, il n'y a ni rétrocontrôle, ni pic de LH, ni ovulation.`,
  },
  {
    title: 'TD Reproduction humaine — Problème : la ménopause',
    pages: p(R, 11),
    statement: `Chez la femme, les possibilités d'avoir un enfant sont limitées à une période de la vie qui s'étend de la puberté à la ménopause (vers 45-50 ans). Cette dernière se manifeste par un certain nombre de modifications physiologiques. On se propose d'étudier celles qui concernent l'activité ovarienne.
Des coupes d'ovaires effectuées chez des femmes de 50 ans ne présentent aucun follicule mûr ; les follicules primordiaux sont dégénérescents et l'ovaire est envahi par un tissu conjonctif (tissu de remplissage).
On cherche à savoir si la dégénérescence des follicules primordiaux chez la femme ménopausée est due à l'arrêt de la stimulation des structures ovariennes par le complexe hypothalamo-hypophysaire, ou bien au vieillissement de l'ovaire lui-même.
- Graphique 1 : dosages d'hormones ovariennes chez des femmes de 50 ans (progestérone en ng.mL⁻¹ et œstradiol en pg.mL⁻¹, très bas et constants sur 28 jours).
- Graphique 2 : évolution du taux moyen de LH au cours de la vie chez la femme (≈ 1 ng.mL⁻¹ de 20 à 40 ans, s'élève jusqu'à ≈ 5 vers 50 ans, puis ≈ 3,5 vers 60-70 ans).
(Voir la page scannée.)
1. Quel est le problème posé ? (0,5 pt)
2. Analysez les graphiques 1 et 2. (2 pts)
3. Les graphiques 1 et 2 permettent-ils de privilégier une des deux hypothèses ? Justifiez votre réponse. (2,5 pts)
4. Utilisez vos connaissances pour expliquer les caractéristiques de la sécrétion de LH chez la femme âgée. (1 pt)`,
    solution: `**1.** La dégénérescence des follicules à la ménopause est-elle due à l'arrêt de la stimulation hypothalamo-hypophysaire ou au vieillissement de l'ovaire lui-même ?

**2.** - Graphique 1 : chez la femme de 50 ans, l'œstradiol et la progestérone sont **très bas et constants** : il n'y a plus de cycle ovarien (ni pic d'œstradiol, ni phase lutéale).
- Graphique 2 : la LH est faible (≈ 1 ng/ml) entre 20 et 40 ans, puis **augmente fortement** autour de 45-50 ans (≈ 5 ng/ml, soit environ 5 fois plus), et reste élevée ensuite (≈ 3,5 ng/ml).

**3.** Oui. Si l'ovaire n'était plus stimulé, on observerait une LH **basse**. Or la LH est au contraire **élevée** : le complexe hypothalamo-hypophysaire stimule toujours (et même davantage) les ovaires, mais ceux-ci ne répondent plus (pas d'hormones ovariennes). On privilégie donc l'hypothèse du **vieillissement de l'ovaire** lui-même (épuisement du stock de follicules).

**4.** L'ovaire ménopausé ne sécrète presque plus d'œstradiol ni de progestérone. Le **rétrocontrôle négatif** qu'exercent normalement ces hormones sur l'hypothalamus et l'hypophyse disparaît : la sécrétion de GnRH, et donc de LH (et de FSH), augmente et reste élevée en permanence. Il n'y a plus de pic de LH, faute de pic d'œstradiol (pas de rétrocontrôle positif).`,
  },
  {
    title: 'TD Reproduction humaine — Problème : le traitement au clomiphène',
    pages: p(R, 12),
    statement: `Un couple, marié depuis quatre ans, n'a pu avoir d'enfants ; il consulte un médecin. Celui-ci prescrit un examen qui permet de doser quotidiennement, pendant un mois, le taux de l'hormone LH. Les résultats sont présentés dans le document 1.

| Jours | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| LH (mUI/mL) | 5,5 | 7,2 | 8,2 | 7,1 | 6,8 | 5,8 | 6,4 | 6,8 | 6 | 5,8 | 6,4 | 7 | 7,1 | 6,2 |

| Jours | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| LH (mUI/mL) | 6,5 | 6,8 | 5,6 | 5,9 | 5,4 | 6,2 | 6,3 | 6,8 | 5,8 | 6,5 | 7 | 7,2 | 6,4 | 6,2 |

1. De quel problème s'agit-il ? (0,5 pt)
2. Analysez les résultats obtenus. (1 pt)
3. Émettez une hypothèse expliquant pourquoi cette femme ne pouvait pas procréer. (1 pt)
4. Le médecin propose alors un traitement au clomiphène : cette substance présente des analogies de structure avec les œstrogènes et se fixe préférentiellement sur les récepteurs du complexe hypothalamo-hypophysaire. De cette façon, le clomiphène inhibe l'action des œstrogènes naturels sur le complexe hypothalamo-hypophysaire. Le résultat du traitement (pris du 1ᵉʳ au 7ᵉ jour) est présenté par le document 2 (voir la page scannée : LH ≈ 10 avec un pic ≈ 38 mUI/mL au 14ᵉ jour ; œstrogènes avec un pic ≈ 90 pg/mL vers le 12ᵉ jour ; progestérone qui s'élève après le 14ᵉ jour jusqu'à ≈ 15 ng/mL).
- a) En vous appuyant sur l'analyse des résultats du traitement, qu'est-ce qui permet de penser que le traitement a été efficace ? (2 pts)
- b) Expliquez l'effet produit par le traitement. (1,5 pt)`,
    solution: `**1.** Pourquoi cette femme ne peut-elle pas avoir d'enfants (cause de son infertilité) ?

**2.** Le taux de LH oscille faiblement entre **5,4 et 8,2 mUI/mL** pendant tout le mois ; il n'y a **aucun pic** de LH (normalement très net vers le 14ᵉ jour).

**3.** Sans pic de LH, il n'y a **pas d'ovulation** : la femme est stérile par **anovulation**, probablement parce que le complexe hypothalamo-hypophysaire ne reçoit pas le signal (pic d'œstrogènes) qui déclenche le pic de LH, ou reste trop freiné par les œstrogènes.

**4. a)** Après traitement : un **pic de LH** (≈ 38 mUI/mL) apparaît vers le 14ᵉ jour, précédé d'un **pic d'œstrogènes** (≈ 90 pg/mL) vers le 12ᵉ jour ; ensuite la **progestérone** s'élève (≈ 15 ng/mL au 21ᵉ jour), ce qui montre qu'un **corps jaune** s'est formé. Il y a donc eu **ovulation** : le traitement est efficace.
**b)** En occupant les récepteurs aux œstrogènes de l'hypothalamus et de l'hypophyse, le clomiphène **lève le rétrocontrôle négatif** des œstrogènes. Le complexe hypothalamo-hypophysaire sécrète alors davantage de GnRH, FSH et LH : les follicules sont stimulés et mûrissent, sécrètent beaucoup d'œstradiol (pic), qui déclenche par **rétrocontrôle positif** le pic de LH puis l'ovulation ; le follicule rompu devient un corps jaune qui sécrète la progestérone.`,
  },
  {
    title: 'TD Reproduction — Exercice : la chatte malade et la parabiose',
    pages: p(R, 13),
    statement: `Chez une chatte malade, on observe une hypertrophie de l'hypophyse et des ovaires ainsi qu'une régression de ses voies génitales et un arrêt du cycle sexuel. Un examen au laboratoire montre que ces observations sont dues à un virus qui attaque et inhibe le fonctionnement des cellules folliculaires ainsi que celles du corps jaune.
1. Comment expliquez-vous les anomalies observées ci-dessus ?
2. Quelles méthodes préconisez-vous pour les corriger ?
3. On met en parabiose (liaison permettant la communication sanguine entre deux individus) la chatte malade avec une chatte hypophysectomisée.
- a) Peut-on espérer une amélioration de l'état de la chatte malade ? Justifiez votre réponse.
- b) Quelle est l'importance de la parabiose ?
- c) Quel serait l'aspect de l'hypophyse et des voies génitales de la chatte malade si la parabiose était faite avec un mâle hypophysectomisé ?
- d) Résumez par un schéma les interactions entre les différents organes mis en jeu dans l'expérience réalisée en 3.`,
    solution: `**1.** Les cellules folliculaires et celles du corps jaune ne fonctionnent plus : **plus d'œstradiol ni de progestérone**.
- Les voies génitales (utérus, vagin), qui dépendent de ces hormones, **régressent** et le cycle s'arrête.
- Le **rétrocontrôle négatif** des hormones ovariennes sur l'hypothalamus et l'hypophyse disparaît : l'hypophyse, stimulée en permanence, s'**hypertrophie** et sécrète beaucoup de FSH et LH, qui font à leur tour grossir les ovaires (hypertrophie sans sécrétion efficace).

**2.** Apporter les hormones manquantes : injections (ou greffe d'ovaire sain) d'**œstradiol et de progestérone**, administrées de façon à reproduire le cycle (œstradiol puis œstradiol + progestérone).

**3. a)** Oui. La chatte hypophysectomisée a des ovaires sains (non stimulés). Grâce à la circulation commune, la FSH et la LH abondantes de la chatte malade vont stimuler les ovaires de la chatte opérée, qui sécrètent alors œstradiol et progestérone ; ces hormones passent dans le sang de la chatte malade : ses voies génitales se redéveloppent et son hypophyse, de nouveau freinée, reprend un volume normal.
**b)** La parabiose montre que la communication entre ces organes se fait **par voie sanguine** (hormones) et permet de faire agir les hormones d'un animal sur les organes d'un autre.
**c)** Avec un mâle hypophysectomisé, les gonadostimulines de la chatte stimuleraient les testicules du mâle, qui sécréteraient de la testostérone. La testostérone exerce un rétrocontrôle négatif sur l'hypothalamus et l'hypophyse : l'**hypophyse** de la chatte retrouverait un volume normal. Mais la testostérone n'agit pas sur l'utérus comme les hormones ovariennes : les **voies génitales** resteraient régressées.
**d)**
\`\`\`
Chatte malade                         Chatte hypophysectomisée
Hypophyse ── FSH, LH ─(sang)──────►  Ovaires sains
    ▲                                     │
    └──── (−) œstradiol, progestérone ◄───┘
                     │
                     └──► voies génitales de la chatte malade (redéveloppement)
\`\`\``,
  },
  {
    title: 'TD Reproduction humaine — Problème : le mode d\'action du RU 486',
    pages: p(R, 13, 14),
    statement: `Le RU 486, administré à une femme au tout début de la grossesse, déclenche l'apparition des règles et l'expulsion de l'embryon dans les heures qui suivent. On cherche à comprendre son mode d'action. Trois séries d'expériences ont été réalisées.

**Document 1** — premières expériences réalisées sur trois lots de lapines (schémas à la même échelle, voir la page scannée) :
- Lot 1 : injection d'œstrogène → muqueuse utérine peu développée.
- Lot 2 : injection d'œstrogène puis de progestérone → muqueuse très développée (dentelle utérine).
- Lot 3 : absorption orale de RU 486 puis injection d'œstrogène et de progestérone → muqueuse peu développée (comme le lot 1).

**Document 2** — on pratique des injections en quantités égales de différentes substances, dont certaines sont marquées radioactivement. Quinze minutes après, on réalise des coupes d'utérus mises en contact avec une émulsion photographique ; on compte les grains d'argent qui correspondent aux molécules marquées fixées sur leurs récepteurs dans les cellules de la muqueuse utérine (moyenne sur 300).

| | Lot 1 | Lot 2 | Lot 3 |
|---|---|---|---|
| Expérience | RU 486 marqué | Progestérone marquée | RU 486 non marqué puis progestérone marquée |
| Nombre moyen de grains d'argent | 8 | 8 | 2 |

**Document 3** — on enregistre les contractions de l'utérus (myomètre) : sans molécule, contractions fortes ; avec progestérone, contractions très faibles ; avec progestérone + RU 486, contractions fortes (voir la page scannée).

1. Quel est le problème posé par ce sujet ? (0,5 pt)
2. Analysez les trois expériences du document 1 puis tirez une conclusion. (3 pts)
3. Analysez les trois expériences du document 2 puis tirez une conclusion globale. (3 pts)
4. Quelle nouvelle information apporte l'analyse du document 3 ? (1 pt)
5. En tenant compte de toutes vos déductions précédentes, concluez quant au problème posé. (0,5 pt)`,
    solution: `**1.** Comment le RU 486 provoque-t-il les règles et l'expulsion de l'embryon (quel est son mode d'action) ?

**2.** - Lot 1 : l'œstrogène seul n'entraîne qu'un faible développement de la muqueuse.
- Lot 2 : œstrogène puis progestérone → dentelle utérine : c'est la progestérone qui développe la muqueuse préparée par l'œstrogène.
- Lot 3 : malgré l'injection d'œstrogène et de progestérone, la muqueuse reste comme dans le lot 1 : la progestérone n'a pas agi.
Conclusion : le RU 486 **empêche l'action de la progestérone** sur la muqueuse utérine.

**3.** - Lot 1 : le RU 486 marqué se fixe sur des récepteurs des cellules de la muqueuse (8 grains).
- Lot 2 : la progestérone se fixe sur ses récepteurs (8 grains, même valeur).
- Lot 3 : après le RU 486, la progestérone ne se fixe presque plus (2 grains).
Conclusion globale : le RU 486 se fixe **sur les mêmes récepteurs que la progestérone** et les occupe ; il entre en **compétition** avec elle (c'est un **antiprogestérone**) sans produire ses effets.

**4.** La progestérone **inhibe les contractions** du myomètre (repos utérin nécessaire à la grossesse) ; en présence de RU 486, cet effet disparaît et l'utérus se contracte fortement.

**5.** Le RU 486 bloque les récepteurs de la progestérone : la muqueuse utérine n'est plus entretenue et se désagrège (règles), et le myomètre, n'étant plus mis au repos, se contracte et **expulse l'embryon**. Le RU 486 agit donc comme une pilule abortive précoce (contragestif).`,
  },
]

export const genetique = [
  {
    title: 'Génétique humaine — Exercice 1 : l\'albinisme',
    pages: p(G, 1),
    statement: `L'albinisme est dû à l'absence d'un pigment, la mélanine, qui donne sa coloration aux poils, à l'iris et aux cellules de la peau. L'absence de mélanine est due à la non-fabrication d'une protéine enzymatique intervenant dans sa synthèse. Dans la population humaine, il existe un allèle permettant cette synthèse et un autre allèle qui ne la permet pas.
On estime à 1 % le nombre d'individus hétérozygotes pour ce gène.
La figure (voir la page scannée) représente l'arbre généalogique d'une famille dans laquelle sévit l'albinisme.
1. L'allèle responsable de l'albinisme est-il dominant ou récessif ? Justifiez.
2. Est-il porté par les chromosomes sexuels ? Par les autosomes ? Justifiez.
3. Donnez les génotypes des différents individus.
4. Quelle est la probabilité pour que le couple 16-17 ait un autre enfant albinos ?
5. Quelle est la probabilité pour que l'homme 21 ait un enfant albinos ?
6. Quelle est la probabilité pour qu'un couple d'individus non albinos extérieurs à la famille ait un enfant albinos ?`,
    solution: `On note **A** l'allèle normal et **a** l'allèle de l'albinisme.

**1.** Les parents **1 et 2**, non albinos, ont des enfants albinos (**4, 5 et 7**). L'allèle de l'albinisme était donc présent chez les parents sans s'exprimer : il est **récessif** (a < A). Même raisonnement pour les couples 11-12 (enfants 23, 24) et 16-17 (enfants 27, 28).

**2.** - S'il était porté par le chromosome **Y**, seuls des hommes seraient atteints : or des femmes (4, 7, 23, 24) sont albinos. Hypothèse rejetée.
- S'il était porté par le chromosome **X** (récessif), une fille albinos (Xᵃ Xᵃ) aurait obligatoirement un père albinos (Xᵃ Y). Or les filles albinos 4 et 7 ont un père (1) **non albinos**. Hypothèse rejetée.
Le gène est donc porté par un **autosome**.

**3.** Génotypes :
- albinos (4, 5, 7, 23, 24, 27, 28) : **a//a** ;
- parents d'albinos (1, 2, 11, 12, 16, 17) : **A//a** (non albinos ayant transmis a) ;
- enfants non albinos de la femme albinos 4 (11 à 16) : **A//a** (ils ont forcément reçu a de leur mère) ;
- les autres individus non albinos (3, 6, 8, 9, 10, 18, 19, 20, 21, 22, 25, 26, 29) : **A//A ou A//a** (on ne peut pas trancher). Pour ceux qui sont frères ou sœurs d'albinos et nés de deux parents A//a (6, 8, 9, 21, 22, 26, 29), la probabilité d'être A//a est de **2/3**.

**4.** 16 et 17 sont **A//a** (ils ont déjà eu des enfants albinos). Échiquier A//a × A//a : 1/4 A//A, 1/2 A//a, **1/4 a//a**.
Probabilité d'un autre enfant albinos : **1/4**.

**5.** L'homme 21 est non albinos, né de parents A//a (ses sœurs 23 et 24 sont albinos) : P(21 est A//a) = **2/3**.
Sa conjointe, extérieure à la famille, est hétérozygote avec la probabilité **1/100**.
P(enfant albinos) = 2/3 × 1/100 × 1/4 = **1/600** (≈ 0,17 %).

**6.** Deux individus non albinos extérieurs : P = 1/100 × 1/100 × 1/4 = **1/40 000** (0,0025 %).
On voit que le risque est 66 fois plus élevé lorsqu'un membre de la famille est concerné.`,
  },
  {
    title: 'Génétique humaine — Exercice 2 : la chorée de Huntington',
    pages: p(G, 2),
    statement: `La chorée de Huntington est une maladie neurologique qui apparaît tardivement, entre 30 et 50 ans, et qui se caractérise par des mouvements épileptoïdes et de la démence.
Voici l'arbre généalogique d'une famille dont certains membres, figurés en noir, sont atteints (voir la page scannée). D'autres données permettent d'affirmer que le sujet I₂ est homozygote.
1. L'allèle de la maladie est-il récessif ou dominant ? Justifiez votre réponse.
2. S'agit-il d'une hérédité liée au sexe ? Justifiez votre réponse.
3. Donnez les génotypes des individus II₃ et II₄.
4. a) Les sujets III₄ et III₅ risquent-ils d'être atteints ? Justifiez votre réponse. b) Quelle est la probabilité pour que ces individus soient atteints ?`,
    solution: `On note **M** l'allèle de la maladie et **s** l'allèle sain.

**1.** I₂ est saine et **homozygote** : elle ne possède que l'allèle sain. Sa fille II₃ est atteinte : elle a reçu un allèle sain de sa mère et ne peut donc être malade que si un seul allèle de la maladie (venu de son père I₁, atteint) suffit. L'allèle de la maladie est **dominant** (M > s). On remarque d'ailleurs que tout malade a un parent malade (pas de « saut » de génération).

**2.** - Le gène n'est pas sur **Y** : des femmes sont atteintes (II₃, III₃).
- S'il était sur **X** (dominant), un père atteint transmettrait son X à **toutes ses filles** et jamais à ses fils. Or l'homme atteint II₁ a un **fils atteint** (III₂), qui a reçu de son père le chromosome Y, pas le X. Hypothèse rejetée.
Il ne s'agit donc **pas** d'une hérédité liée au sexe : le gène est **autosomal**.

**3.** - II₃ est atteinte et sa mère I₂ est homozygote saine (s//s) : II₃ est **M//s**.
- II₄ est sain : **s//s** (l'allèle dominant s'exprimerait s'il le possédait).

**4. a)** Oui. Leur mère II₃ (M//s) peut leur transmettre l'allèle M ; le fait qu'ils paraissent sains ne prouve rien, car la maladie n'apparaît qu'entre 30 et 50 ans.
**b)** Croisement M//s × s//s : 1/2 M//s (atteints) et 1/2 s//s. Chacun des sujets III₄ et III₅ a une probabilité de **1/2** d'être atteint.`,
  },
  {
    title: 'Génétique humaine — Exercice 3 : le syndrome de Lowe',
    pages: p(G, 3),
    statement: `Le syndrome de Lowe est une maladie héréditaire très rare associant une déficience mentale, une opacité des cristallins (entraînant une cataracte) et un déficit de la fonction rénale. La cause biochimique précise en est inconnue : on cherche à la déterminer en identifiant le gène qui est altéré chez ces malades.
La figure (voir la page scannée) représente l'arbre généalogique de la famille D, exemple typique de la transmission du syndrome de Lowe.
1. À l'aide d'un raisonnement fondé sur l'analyse précise de l'arbre généalogique, indiquez si l'allèle responsable de la maladie est dominant ou récessif.
2. Le gène considéré est-il porté par une paire autosomale ou par la paire des chromosomes sexuels ? Justifiez votre réponse. Si plusieurs hypothèses sont recevables, identifiez la plus probable.
3. En prenant en compte l'hypothèse la plus probable :
- a) Déterminez le génotype des individus III₁ et III₂.
- b) Déterminez le risque, en termes de probabilité, pour l'enfant IV₄, à naître, d'être atteint du syndrome de Lowe : si c'est un garçon ? si c'est une fille ? si l'on ne considère pas le sexe ?`,
    solution: `On note **N** l'allèle normal et **m** l'allèle de la maladie.

**1.** Des parents sains ont des enfants atteints : I₁ × I₂ (fils II₄), II₁ × II₂ (fils III₃), III₁ × III₂ (fils IV₁ et IV₂). L'allèle de la maladie était présent mais masqué chez ces parents : il est **récessif**.

**2.** - Hypothèse **autosomale** : possible en théorie, mais il faudrait que plusieurs conjoints venus d'autres familles (II₁, III₁) soient tous hétérozygotes pour une maladie **très rare** : c'est très improbable.
- Hypothèse **chromosome X** : seuls des **garçons** sont atteints, et la maladie est transmise par des **mères saines** (II₂, III₂) qui sont conductrices. C'est le schéma typique d'une maladie récessive liée à X.
- Chromosome **Y** : impossible, un père sain (III₁) a des fils atteints.
L'hypothèse **la plus probable** : gène porté par le **chromosome X** (récessif lié au sexe).

**3. a)** III₁, homme sain : **Xᴺ Y**. III₂, femme saine mère de garçons atteints : **Xᴺ Xᵐ** (conductrice).
**b)** Croisement Xᴺ Y × Xᴺ Xᵐ :

| Gamètes | Xᴺ (mère) | Xᵐ (mère) |
|---|---|---|
| Xᴺ (père) | Xᴺ Xᴺ fille saine | Xᴺ Xᵐ fille saine conductrice |
| Y (père) | Xᴺ Y garçon sain | Xᵐ Y garçon atteint |

- si c'est un **garçon** : risque **1/2** ;
- si c'est une **fille** : risque **0** (au pire conductrice, 1/2) ;
- sans considérer le sexe : **1/4**.`,
  },
  {
    title: 'Génétique humaine — Exercice 4 : le rachitisme vitamino-résistant',
    pages: p(G, 4),
    statement: `L'arbre généalogique simplifié de la figure 1 (voir la page scannée) représente une famille dont certains membres sont atteints de rachitisme vitamino-résistant, qu'un traitement par la vitamine D ne suffit pas à faire disparaître : 1 (homme atteint) × 2 (femme saine) → 3 (fille atteinte) ; 3 × 4 (homme sain) → 5 (fils atteint) ; 5 × 6 (femme saine) → 7 et 8 (filles atteintes), 9 (garçon sain).
Les conjoints 2, 4 et 6 sont issus de familles où ce caractère ne s'est jamais manifesté.

Figure 2 — descendance de couples « père rachitique × mère saine » :

| | Filles atteintes | Filles saines | Garçons atteints | Garçons sains | Total |
|---|---|---|---|---|---|
| Père rachitique, mère saine | 29 | 0 | 0 | 25 | 54 |

Après avoir effectué une exploitation rigoureuse des figures 1 et 2 :
1. a) Indiquez si l'allèle de la maladie est dominant ou récessif. b) Donnez la localisation chromosomique du gène.
2. Donnez les génotypes des individus 1, 2, 3, 4, 5 et 7.
3. Quelle est la probabilité pour le couple 5-6 de donner naissance à un enfant atteint du rachitisme vitamino-résistant ?`,
    solution: `**1. a)** Les conjoints 2, 4 et 6 viennent de familles indemnes : on admet qu'ils ne portent pas l'allèle de la maladie. Pourtant leurs enfants (3, 5, 7, 8) sont atteints : **un seul allèle**, reçu de l'autre parent, suffit à provoquer la maladie. L'allèle est **dominant** (R > n).
**b)** Figure 2 : un père atteint a **toutes ses filles atteintes** (29/29) et **tous ses fils sains** (25/25). Le père transmet son X à toutes ses filles et son Y à tous ses fils : le gène est porté par le **chromosome X** (partie propre à X).

**2.** - 1 : homme atteint **Xᴿ Y** ; 2 : femme saine **Xⁿ Xⁿ** ;
- 3 : femme atteinte **Xᴿ Xⁿ** (elle a reçu Xⁿ de sa mère) ; 4 : homme sain **Xⁿ Y** ;
- 5 : homme atteint **Xᴿ Y** ; 7 : fille atteinte **Xᴿ Xⁿ**.

**3.** Couple 5 (Xᴿ Y) × 6 (Xⁿ Xⁿ) : toutes les filles sont **Xᴿ Xⁿ** (atteintes), tous les garçons **Xⁿ Y** (sains).
- Probabilité d'avoir un enfant atteint (sexe non précisé) : **1/2** ;
- si c'est une fille : **1** (100 %) ; si c'est un garçon : **0**.`,
  },
]

export const blocs = [
  { chapterId: '1aab3a10-89f8-4a9f-abf8-d391ba24fe88', exercises: repro },     // Tle D · SVT · Reproduction humaine
  { chapterId: '2b18fc0d-9212-4eef-97c0-6271797e37a5', exercises: genetique }, // Tle D · SVT · Génétique humaine
]
