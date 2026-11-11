// Annales et sujets type bac — VIE D'ENTREPRISE (séries G2, G3).
// Sujets officiels photographiés, transcrits ; corrigés = méthode détaillée + calculs
// quand l'énoncé est complet (⚠️ signale les données illisibles/incomplètes sur la photo).
// Le type d'épreuve est porté par le titre (« Bac rouge … », « Bac blanc … », « Test … »).

const SUBJECT = "VIE D'ENTREPRISE"
const MATCH = 'vie d*entreprise'
const CHAPTER = 'Annales et sujets type bac — Vie d’entreprise'
const DESC = 'Sujets d’examen (bacs, compositions et TD) : coûts de production, programmation linéaire, décisions et PERT.'

const sodaco = {
  title: 'Bac rouge 1997 (G1-G2-G3) — Vie d’entreprise : entreprise SODACO',
  statement: `**Baccalauréat technique — Séries G1 · G2 · G3 — Session 1997 — Vie d’entreprise — Durée 3 h — Coefficient 3.** Calculatrices autorisées.

## Première partie
Pour assurer sa production dans les conditions fixées par les normes techniques, l’entreprise SODACO supporte à chaque niveau de production les dépenses ci-après :

| Q | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| CVNP | 0 | 6 | 60 | 162 | 312 | 510 | 756 | 1 050 | 1 392 | 1 782 | 2 220 |
| CT | 600 | 624 | 696 | 816 | 984 | 1 200 | 1 464 | 1 776 | 2 136 | 2 544 | 3 000 |

L’entreprise SODACO détient la totalité de l’offre ; ses recettes évoluent ainsi :

| RM | 192 | 216 | 240 | 264 | 288 | 312 | 336 | 360 | 384 | 408 |
|---|---|---|---|---|---|---|---|---|---|---|
| RT | 1 920 | 1 944 | 1 920 | 1 848 | 1 728 | 1 560 | 1 344 | 1 080 | 768 | 408 |

1. Compléter le premier tableau en calculant les CVT, CVP, Cmo, Cma.
2. Déterminer la quantité et le prix de vente unitaire qui satisfont SODACO si elle cherche le plus grand profit possible.
3. Formuler, en fonction du prix, l’équation de la demande globale qui s’adresse à la SODACO.
4. À long terme, les frais de structure augmentent de 120 et les dépenses en matières premières de 2 par unité ; 100 firmes interviennent aux conditions de production et de vente identiques. Déterminer : a) le volume optimal au niveau de l’entreprise ; b) le volume optimal au niveau de l’industrie ; c) le profit réalisé par l’entreprise.
5. Quelle est la situation la plus avantageuse pour le consommateur ? Pourquoi ?

## Deuxième partie
Parlant de la dimension des entreprises, A. PLATER écrit : « L’innovateur grandit, mais l’imitateur grandit aussi le plus souvent. Le traditionnel sauf par accident reste petit. » Commenter cette affirmation.`,
  solution: `## Méthode et résultats

**1. Compléter le tableau des coûts.**
- CF (coût fixe total) = CT à Q = 0 = **600** (constant à tous les niveaux).
- CVT (coût variable total) = CT − CF.
- CVP (coût variable proportionnel) = CVT − CVNP (part qui croît proportionnellement à Q).
- Cmo (coût moyen) = CT ÷ Q.
- Cma (coût marginal) = ΔCT ÷ ΔQ = CT(Q) − CT(Q−1).

| Q | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
|---|---|---|---|---|---|---|---|---|---|---|
| CVT = CT − 600 | 24 | 96 | 216 | 384 | 600 | 864 | 1 176 | 1 536 | 1 944 | 2 400 |
| CVP = CVT − CVNP | 18 | 36 | 54 | 72 | 90 | 108 | 126 | 144 | 162 | 180 |
| Cmo = CT ÷ Q | 624 | 348 | 272 | 246 | 240 | 244 | 253,7 | 267 | 282,7 | 300 |
| Cma = ΔCT | 24 | 72 | 120 | 168 | 216 | 264 | 312 | 360 | 408 | 456 |

(CVP est bien proportionnel : 18 × Q.)

**2. Quantité et prix du profit maximum (monopoleur).** Le profit est maximal là où la recette marginale égale le coût marginal (Rma = Cma), c’est-à-dire au sommet de la courbe de profit Π = RT − CT. On compare RT et CT niveau par niveau et on retient la quantité qui maximise RT − CT ; le prix est alors la recette moyenne RM correspondante (prix = RM, puisque RT = prix × Q pour un offreur unique).
⚠️ Sur la photo, les lignes RM/RT ne sont pas alignées de façon certaine avec Q = 1…10 (RM décroît de 408 à 192 quand RT passe par un maximum) : reporter l’alignement exact du tableau d’origine avant de lire le couple (Q*, prix*). La règle à appliquer reste Rma = Cma, puis prix* = RM(Q*).

**3. Équation de la demande.** La demande globale lie le prix p à la quantité q. À partir des couples (q, RM = p) du tableau, on ajuste une droite p = a·q + b (RM est une fonction affine décroissante de q) : calculer la pente a = Δp ÷ Δq et l’ordonnée à l’origine b sur deux points du tableau, d’où q = (b − p) ÷ (−a).

**4. Long terme (100 firmes identiques).**
- Nouveaux coûts : CF' = 600 + 120 = **720** ; CVP' = CVP + 2Q (dépenses matières + 2 par unité) ; refaire CT', Cmo', Cma'.
- a) **Volume optimal de l’entreprise** : en concurrence (100 firmes), chaque firme produit au minimum de son coût moyen Cmo' (optimum technique : Cma' = Cmo'), là où le prix de long terme s’établit.
- b) **Volume de l’industrie** = 100 × volume optimal d’une firme.
- c) **Profit de l’entreprise** = (prix − Cmo' au minimum) × q* = **0** à long terme en concurrence pure et parfaite (le prix égale le coût moyen minimum : profit économique nul).

**5. Situation la plus avantageuse pour le consommateur.** La **concurrence** (2ᵉ situation) : prix plus bas (égal au coût moyen minimum), quantité plus grande et absence de profit de monopole ; le surplus du consommateur est maximal.

## Deuxième partie (plan de commentaire)
Idée : la taille n’est pas le seul facteur de réussite. **L’innovateur** (souvent une grande firme ou une firme pionnière) grandit grâce à l’avance technologique ; **l’imitateur** profite de l’innovation sans en supporter tout le coût de recherche et peut grandir à son tour ; **le traditionnel**, qui n’innove ni n’imite, reste petit. Discuter avec : économies d’échelle, effets de synergie, rôle des PME efficaces (souplesse, proximité), sous-traitance, cycle de vie du produit. Conclure que l’efficacité (rapport résultats/moyens) prime sur la seule dimension.`,
}

const epao = {
  title: 'Test — Composition 2ᵉ trimestre 2011-2012 (TG2) — Vie d’entreprise : EPAO et GRACE DIVINE',
  statement: `**Collège Roi Salomon — Composition du 2ᵉ trimestre 2011-2012 — Classe TG2 — Vie d’entreprise — Durée 3 h — Coefficient 3.**

## 1ʳᵉ partie : questions de cours
1. Citer et expliquer deux caractéristiques de l’efficacité de l’entreprise.
2. Qualifier et expliquer les relations (A + B = A) et (A + B = C).
3. Pourquoi utilise-t-on les tâches virtuelles (fictives) pour construire le graphe PERT d’un projet ?

## 2ᵉ partie : exercice (programmation linéaire)
La maison « EPAO » fabrique deux produits RAC et NIV.

| Éléments | RAC | NIV |
|---|---|---|
| Coût proportionnel de production | 160 | 100 |
| Coût proportionnel de distribution | 20 | 10 |
| Prix de vente unitaire | 220 | 140 |

Frais fixes non répartis : 1 300 000 (ensemble des deux produits).

| Contraintes | Capacité | RAC | NIV |
|---|---|---|---|
| Atelier 1 | 40 000 HM | 4 | 2 |
| Atelier 2 | 10 000 HM | 0,5 | 1 |
| Marché — minimum | | 1 000 | 3 000 |
| Marché — maximum | | 8 000 | 9 000 |

(HM = heures machine.) **TAF :** déterminer graphiquement la meilleure combinaison productive et le profit maximum encaissé par « EPAO ».

## 3ᵉ partie : problème (coûts — maison GRACE DIVINE)
| Coût de revient | 400 | 640 | 900 | 1 160 | 1 400 | 1 680 | 1 980 | 2 700 | 3 360 | 4 080 |
|---|---|---|---|---|---|---|---|---|---|---|
| Coût additionnel | — | 120 | 130 | 130 | 120 | 140 | 150 | 180 | 220 | 240 |

On signale : frais de structure = 120 F pour q < 18 et 200 F pour q ≥ 18 ; au 6ᵉ niveau, résultat unitaire et marginal d’égale valeur ; seuil critique au 8ᵉ niveau, où le coût des inputs vaut 28,8 % des charges opérationnelles.
**TAF :** 1) déterminer les quantités produites ; 2) calculer CT, Cma, CFT, CVT, CVP, CVNP, Cmo ; 3) étudier la rentabilité (optimum technique, zones de rendement, optimum économique, seuils de rentabilité et leur sens, zones de pertes et de profits) ; 4) représenter graphiquement le profit maximum.`,
  solution: `## 1ʳᵉ partie
1. **Efficacité de l’entreprise** (deux caractéristiques, au choix) : l’**efficacité économique** (atteindre les objectifs — production, chiffre d’affaires — au moindre coût : bon rapport résultats/moyens) ; l’**efficacité sociale** (satisfaction et motivation du personnel, bon climat) ; on peut aussi citer la flexibilité/adaptation au marché et la rentabilité.
2. **(A + B = A)** : relation d’**absorption** — la ressource A domine, B s’y fond sans la modifier (effet nul de B). **(A + B = C)** : relation de **synergie** — la combinaison de A et B donne un résultat nouveau C supérieur à leur simple somme (« 2 + 2 = 5 »).
3. **Tâches fictives** : tâches imaginaires de durée nulle servant à **respecter les relations d’antériorité** (quand deux tâches partagent partiellement les mêmes antécédents) et à **éviter que deux tâches aient même étape de début et de fin**, ce qui rendrait le graphe ambigu.

## 2ᵉ partie — Programmation linéaire (EPAO)
Variables : x = nombre de RAC, y = nombre de NIV. Marge sur coût variable unitaire :
- RAC : 220 − (160 + 20) = **40** ; NIV : 140 − (100 + 10) = **30**.
Fonction économique à maximiser : **Z = 40x + 30y − 1 300 000**.
Contraintes : 4x + 2y ≤ 40 000 (atelier 1) ; 0,5x + y ≤ 10 000 (atelier 2) ; 1 000 ≤ x ≤ 8 000 ; 3 000 ≤ y ≤ 9 000.
Méthode : tracer le polygone des contraintes, puis déplacer la droite d’iso-marge 40x + 30y ; l’optimum est au sommet le plus éloigné. Sommet d’intersection atelier 1 / atelier 2 : 4x + 2y = 40 000 et 0,5x + y = 10 000 → de la 2ᵉ, y = 10 000 − 0,5x ; en reportant : 4x + 2(10 000 − 0,5x) = 40 000 → 3x = 20 000 → x ≈ 6 667, y ≈ 6 667 (à confronter aux bornes de marché 1 000≤x≤8 000, 3 000≤y≤9 000). Calculer Z en chaque sommet admissible et retenir le maximum, puis **profit = Z** (marges − 1 300 000 de frais fixes).

## 3ᵉ partie — Coûts (GRACE DIVINE)
Notations : CFT (frais de structure) ; CVP ∝ q ; CVNP = cumul des coûts additionnels non proportionnels ; CVT = CVP + CVNP ; CT = CFT + CVT = « coût de revient » donné ; Cma = coût additionnel (ΔCT) ; Cmo = CT ÷ q.
1. **Quantités** : le « coût additionnel » est le coût marginal (ΔCT entre deux niveaux). Les niveaux vont de 1 à 10 ; l’énoncé fixe le changement de CFT à q = 18 et deux repères (6ᵉ niveau : profit marginal nul ⇒ Cma = prix ; 8ᵉ niveau : seuil critique). ⚠️ Le pas exact entre deux quantités n’est pas lisible sur la photo ; en déduire q à partir de « frais de structure 120 F pour q < 18 et 200 F pour q ≥ 18 » (le 18 marque la frontière entre deux niveaux).
2. **Tableau des coûts** : remplir CFT, CVP, CVNP, CVT, CT, Cma, Cmo avec les relations ci-dessus.
3. **Rentabilité** : optimum technique = q qui minimise Cmo (Cma = Cmo) ; zones de rendement = croissant tant que Cma décroît, décroissant ensuite ; optimum économique = q qui maximise le profit (Cma = recette marginale = prix) ; seuils de rentabilité = q où recette totale = coût total (entrée et sortie de la zone de profit) ; entre les deux seuils = zone de profit, à l’extérieur = zones de pertes.
4. **Profit maximum** : Π = RT − CT ; le représenter comme l’écart vertical maximal entre la courbe de recette totale et la courbe de coût total (atteint à l’optimum économique).`,
}

const tdLineaire = {
  title: 'Test — TD 1979 (TG2-TG3) — Vie d’entreprise : programmation linéaire (P1, P2)',
  statement: `**Lycée technique commercial — TD de Vie d’entreprise — Niveau TG2 et TG3 — Durée 3 h.**

## I. Questions de cours
1. Après avoir défini l’information, à quoi sert-elle dans l’entreprise ?
2. Après avoir défini le tableau de bord, donner sa périodicité et son importance.
3. Comparer : a) décisions stratégiques et décisions opérationnelles ; b) décisions certaines et aléatoires.

## II. Exercice
Une entreprise fabrique deux produits P1 et P2 sur deux machines A et B.
- Pour 100 unités de P1 : 300 heures machine A et 400 heures machine B.
- Pour 100 unités de P2 : 400 heures machine A et 200 heures machine B.
- La machine A peut fonctionner 120 heures le mois ; la machine B, 80 heures le mois.
- Bénéfice unitaire : P1 = 27 F ; P2 = 24 F.
- Marchandises périssables (non stockables) : le marché n’écoule pas plus de 15 unités de P1 et 28 unités de P2.

**TAF :** 1) s’agit-il d’un programme à maximiser ou à minimiser ? 2) formaliser le programme ; 3) le résoudre graphiquement ; 4) représenter la droite de la solution optimale dans le même repère.`,
  solution: `## I. Questions de cours
1. **Information** : donnée mise en forme, porteuse de sens, qui réduit l’incertitude. Dans l’entreprise elle sert à **décider** (base de toute décision), à **coordonner** les services, à **contrôler** (comparer réalisations et prévisions) et à **communiquer** (interne/externe).
2. **Tableau de bord** : document de synthèse réunissant quelques indicateurs clés (chiffrés ou graphiques) pour suivre l’action. **Périodicité** : régulière et rapprochée (journalière, hebdomadaire ou mensuelle selon l’indicateur). **Importance** : il montre à tout moment la situation par rapport aux objectifs, signale les écarts et permet des décisions correctives rapides.
3. a) Les **décisions stratégiques** engagent l’entreprise à long terme, sont rares, risquées et prises par la direction générale ; les **décisions opérationnelles** concernent la vie courante (achats, ventes), sont répétitives, à court terme et prises aux niveaux inférieurs. b) Une **décision certaine** a toutes ses variables connues et maîtrisées (résultat unique et prévisible) ; une **décision aléatoire** comporte des variables non maîtrisées, dont on ne connaît que les probabilités.

## II. Programmation linéaire
Ramener les temps à l’unité (÷ 100) et les capacités en heures.
Variables : x = nombre d’unités de P1, y = nombre d’unités de P2.
1. **Programme à MAXIMISER** (on cherche le plus grand bénéfice) : **Z = 27x + 24y**.
2. Contraintes :
- Machine A : 3x + 4y ≤ 12 000 (120 h = 12 000 min ? non : 300 h pour 100 P1 ⇒ 3 h par P1 ; capacité 120 h) → **3x + 4y ≤ 120** ;
- Machine B : 4x + 2y ≤ 80, soit **2x + y ≤ 40** ;
- Débouchés : **0 ≤ x ≤ 15** et **0 ≤ y ≤ 28**.
3. **Résolution graphique** : tracer les droites 3x + 4y = 120, 2x + y = 40, x = 15, y = 28 ; déterminer le polygone des solutions (x ≥ 0, y ≥ 0) ; déplacer la droite d’iso-profit 27x + 24y. L’optimum est au sommet le plus éloigné. Intersection des deux ateliers : 3x + 4y = 120 et 2x + y = 40 → y = 40 − 2x ; 3x + 4(40 − 2x) = 120 → −5x = −40 → **x = 8**, **y = 24** (admissible : x ≤ 15, y ≤ 28). Z = 27 × 8 + 24 × 24 = 216 + 576 = **792 F**. Comparer aux autres sommets (par ex. x = 15 ⇒ 2(15)+y=40 ⇒ y=10, Z = 405 + 240 = 645 ; y = 28 ⇒ 3x+112=120 ⇒ x=8/3, Z≈72+672=744) : le maximum reste **(x = 8 ; y = 24), Z = 792 F**.
4. Tracer, dans le même repère, la droite d’iso-profit passant par l’optimum : 27x + 24y = 792.`,
}

const soki = {
  title: 'Bac rouge (G3) — Vie d’entreprise : fromagerie SOKI (programmation linéaire)',
  statement: `**Baccalauréat technique — Série G3 — Vie d’entreprise — Durée 3 h.** Calculatrice autorisée.

## Questions de cours
1. Montrer en quoi les entreprises à faibles effectifs peuvent être plus efficaces que celles employant beaucoup de personnes.
2. La grande entreprise se caractérise par l’importance des moyens mis en œuvre ; donner l’importance de ses moyens.
3. Peut-on utiliser la méthode P.E.R.T pour les travaux accélérés de notre pays ? Pourquoi ?

## Exercice
M. SOKI fabrique deux fromages : des « Coco » vendus 50 F l’unité et des « Rico » vendus 60 F l’unité.
- Un Coco nécessite 3 litres de lait et 0,1 heure de travail ; un Rico, 2 litres de lait et 0,3 heure de travail.
- Par semaine : 16 000 litres de lait et 1 000 heures de travail disponibles.
- Capacités maximales : 5 000 Coco et 3 000 Rico par semaine.
- Lait acheté 10 F le litre ; heure de travail payée 10 F.

**TAF :** quelles productions hebdomadaires de Coco et de Rico maximisent le bénéfice de la fabrique ?`,
  solution: `## Questions de cours
1. **Petites entreprises efficaces** : souplesse et rapidité de décision, proximité du client et du marché, faibles coûts de structure, forte motivation et polyvalence du personnel, capacité d’innovation et d’adaptation ; elles peuvent donc avoir un meilleur rapport résultats/moyens qu’une grande structure lourde.
2. **Moyens de la grande entreprise** : moyens **humains** (effectifs nombreux, spécialisation), **matériels** (équipements lourds, usines), **financiers** (capitaux importants, accès au crédit et aux marchés financiers) ; ils permettent des économies d’échelle, la recherche-développement et la conquête de grands marchés.
3. **PERT et travaux accélérés** : oui — le PERT ordonne les tâches, identifie le chemin critique et les marges, donc permet de **réduire la durée d’un projet** en agissant sur les tâches critiques ; c’est pertinent pour accélérer de grands chantiers (routes, bâtiments), à condition de disposer de données fiables de durée.

## Exercice — Programmation linéaire (maximisation)
Variables : x = Coco produits/semaine, y = Rico produits/semaine.
**Bénéfice unitaire** (prix − coût des facteurs ; coûts : lait 10 F/l, travail 10 F/h) :
- Coco : coût = 3 × 10 + 0,1 × 10 = 31 ; bénéfice = 50 − 31 = **19 F**.
- Rico : coût = 2 × 10 + 0,3 × 10 = 23 ; bénéfice = 60 − 23 = **37 F**.
Fonction à maximiser : **Z = 19x + 37y**.
Contraintes : lait 3x + 2y ≤ 16 000 ; travail 0,1x + 0,3y ≤ 1 000 (soit x + 3y ≤ 10 000) ; débouchés 0 ≤ x ≤ 5 000 et 0 ≤ y ≤ 3 000.
**Résolution** : tracer le polygone et déplacer la droite d’iso-bénéfice. Sommets utiles :
- y = 3 000 (max Rico) → lait : 3x + 6 000 ≤ 16 000 ⇒ x ≤ 3 333 ; travail : x + 9 000 ≤ 10 000 ⇒ x ≤ 1 000 ⇒ x = 1 000. Z = 19 000 + 111 000 = **130 000 F**.
- Intersection lait/travail : 3x + 2y = 16 000 et x + 3y = 10 000 → x = 10 000 − 3y ; 3(10 000 − 3y) + 2y = 16 000 ⇒ −7y = −14 000 ⇒ y = 2 000, x = 4 000. Z = 76 000 + 74 000 = **150 000 F** (admissible : x ≤ 5 000, y ≤ 3 000).
- x = 5 000 (max Coco) → travail : 5 000 + 3y ≤ 10 000 ⇒ y ≤ 1 666 ; Z = 95 000 + 61 666 ≈ 156 666 mais lait : 15 000 + 2y ≤ 16 000 ⇒ y ≤ 500 ⇒ Z = 95 000 + 18 500 = 113 500 F.
Le maximum est à **(x = 4 000 Coco ; y = 2 000 Rico), bénéfice = 150 000 F par semaine** (lait et travail saturés : plein emploi des deux facteurs).`,
}

export const BLOCS = [
  { subject: SUBJECT, match: MATCH, levels: ['bac_g2', 'bac_g3'], chapterTitle: CHAPTER, description: DESC, exercises: [sodaco] },
  { subject: SUBJECT, match: MATCH, levels: ['bac_g2'], chapterTitle: CHAPTER, description: DESC, exercises: [epao] },
  { subject: SUBJECT, match: MATCH, levels: ['bac_g2', 'bac_g3'], chapterTitle: CHAPTER, description: DESC, exercises: [tdLineaire] },
  { subject: SUBJECT, match: MATCH, levels: ['bac_g3'], chapterTitle: CHAPTER, description: DESC, exercises: [soki] },
]
