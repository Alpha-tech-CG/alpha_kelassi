// Annales et sujets type bac — TECHNIQUES COMMERCIALES (série G3).
// Sujets officiels photographiés ; corrigés = méthode détaillée + calculs quand l'énoncé est
// complet (⚠️ données manquantes sur la photo). Type porté par le titre.

const SUBJECT = 'Techniques Commerciales'
const MATCH = 'techniques commerciales*'
const CH = 'Annales et sujets type bac — Techniques commerciales'
const DESC = 'Sujets d’examen G3 : études de marché, gestion des stocks, facturation, prévision des ventes, prix psychologique, rentabilité.'

const louisette = {
  title: 'Bac rouge 2013 (G3) — Techniques commerciales : part de marché (LOUISETTE)',
  statement: `**Baccalauréat technique — Session 2013 — Série G3 — Étude de cas — 5 h. (1re partie : techniques commerciales.)**

Mlle LOUISETTE commercialise des imprimantes laser à Brazzaville. Élasticité de la demande/revenu = 0,60 ; indice de richesse vive de la zone = 1,16.
2009 : CA des concurrents = 18 000 000 FCFA. 2010 : CA de la profession −20 %, prix des imprimantes −9 %, revenus des ménages +18 %, CA de la concurrence −35 %, population 750 000 (2009) → 780 000 (2010). 2011 : revenus stables, prix +5 %, clientèle +14 %, principal concurrent 38 % du marché, LOUISETTE 60 % du marché restant.

**TAF :** 1) part de marché de LOUISETTE en 2009 et 2010 (son CA 2009 = 2/3 de celui de la concurrence) ; 2) nombre d'appareils vendus par la concurrence (prix 112 500 en 2009) ; 3) avis sur le CA de LOUISETTE en 2010 ; 4) CA prévisionnel de LOUISETTE en 2011.`,
  solution: `**Méthode.**
1. CA LOUISETTE 2009 = 2/3 × 18 000 000 = 12 000 000 ; marché total 2009 = concurrence + LOUISETTE = 18 000 000 + 12 000 000 = 30 000 000 ⇒ **part 2009 = 40 %**. En 2010, marché total = 30 000 000 × (1 − 20 %) = 24 000 000 ; CA concurrence = 18 000 000 × (1 − 35 %) = 11 700 000 ⇒ CA LOUISETTE = 24 000 000 − 11 700 000 = 12 300 000 ⇒ **part 2010 = 51,25 %**.
2. Nombre d'appareils concurrence 2009 = 18 000 000 ÷ 112 500 = **160 appareils**.
3. Commentaire : malgré la baisse générale (−20 %), le CA de LOUISETTE progresse (12,0 → 12,3 M) et sa part passe de 40 % à 51 % : **bonne performance** relative.
4. CA prévisionnel 2011 : marché restant après le concurrent (38 %) ⇒ LOUISETTE = 60 % du restant = 60 % × 62 % = 37,2 % du marché 2011 ; estimer le marché 2011 (effet prix +5 %, clientèle +14 %, revenus stables ⇒ via l'élasticité) puis CA = part × marché. (Appliquer CA = marché 2011 × 0,372.)`,
  difficulty: 3,
}

const sporaris = {
  title: 'Bac rouge juin 2005 (G3) — Techniques commerciales : SPORARIS (tendance, saisonniers, rémunération)',
  statement: `**Baccalauréat technique — Session juin 2005 — Option Commerce — Série G3 — Étude de cas — 5 h.** Calculatrices autorisées.

**Document 1 — Analyse et prévision des ventes.** Ventes SPORARIS (millions F) :
| Années | 1997 | 1998 | 1999 | 2000 | 2001 | 2002 |
|---|---|---|---|---|---|---|
| CA | 45 | 47 | 55 | 51 | 48 | K |
Coefficients saisonniers trimestriels : T1 0,48 ; T2 M ; T3 1,92 ; T4 0,64. Charges 2003 : assurance 650 000 ; entretien 250 000 ; loyer mensuel 150 000 ; salaires mensuels 850 000 ; commissions 6 600 000 + 0,2 CF ; matériel 5 600 000 (linéaire 10 ans). Hausses de prix : 13 % (2000), 15 % (2001), 16 % (2002), 18 % prévue (2003).
TAF : 1) inconnues et équation de la droite de tendance (méthode des points extrêmes, b = 42,6) ; 2) CA annuel 2003 ; 3) ventes trimestrielles 1997-2003 ; 4) ventes trimestrielles 2000-2003 en francs constants (base 1999) ; 5) totaux mobiles trimestriels ; 6) tableau d'exploitation différentiel.

**Document 2 — Rémunération des représentants.** Fixe mensuel = 5 × 50 000 ; commission 5 000 + 5 % du CA ; 3 représentants ; quota global 900 téléphones ; secteurs 1/2/3 à 1 000/1 500/2 000 clients ; prix d'un téléphone 50 000 (marge 20 %) ; ventes 100/300/500 ; prime sur objectif (0-20 % : 0 ; 21-40 : 10 000 ; 41-60 : 20 000 ; +60 : 30 000).
TAF : 1) rémunération de chaque représentant ; 2) CA global ; 3) bénéfice de l'entreprise.`,
  solution: `**Document 1.**
1. Coefficients : moyenne des 4 = 1 ⇒ M = 4 − (0,48 + 1,92 + 0,64) = **0,96**. K (tendance) : voir ci-dessous. Droite de tendance y = a·x + b par points extrêmes ; avec b = 42,6, calculer a sur deux points extrêmes des ventes annuelles, puis prolonger.
2. CA 2003 = valeur de tendance pour x(2003), éventuellement ajustée.
3. Ventes trimestrielles = (CA annuel ÷ 4) × coefficient saisonnier de chaque trimestre.
4. Francs constants (base 1999) : diviser chaque CA par l'indice des prix cumulé depuis 1999 (produits des hausses 13/15/16/18 %).
5. Totaux mobiles = somme glissante de 4 trimestres consécutifs.
6. Tableau différentiel 2003 : CA, charges variables (commissions ∝ CA), charges fixes (assurance, entretien, loyer×12, salaires×12, dotation 5 600 000 ÷ 10) ⇒ M/CV, résultat.
**Document 2.** Pour chaque représentant : rémunération = fixe (250 000) + commission (5 000 + 5 % × CA du secteur) + prime (selon % de réalisation du quota). CA secteur = ventes × 50 000. CA global = somme des CA. Bénéfice = marge (20 % du CA) − rémunérations totales.`,
  difficulty: 3,
}

const reveEnfance = {
  title: 'Bac blanc 2004-2005 (G3) — Techniques commerciales : gestion des stocks et facturation (RÊVE DE MON ENFANCE)',
  statement: `**Bac blanc — Direction départementale de Brazzaville — 2004-2005 — Série G3 — Étude de cas — 5 h — Coeff. 6.** (1re partie.)

**Étude 1 — Gestion des stocks (aquariums).** Stock de protection 12 jours ; frais mensuels de lancement 375 F ; taux de marque brute 25 % ; stock 31/12/2004 = 250 articles ; quantité pendant le délai normal 25 articles ; coût de stockage 882 F pour 8 820 F stockés ; TVA 18 % ; CAD 5 % ; PVTTCU 7 134 F ; consommations 2005 : 200/mois au 1er semestre, +50 % au 2e semestre.
TAF : 1) lot économique et nombre économique de commandes ; 2) périodicité (jours, mois) ; 3) budget des approvisionnements ; 4) perte si 15 commandes/an ; 5) durée moyenne de stockage (inventaire intermittent).

**Étude 2 — Facturation.** 250 machines ; rabais x %, remise 8 %, escompte 1 %, TVA 18 %, CAD 5 %.
TAF : 1) corps de la facture (remise − rabais = 325 000 ; remise + rabais = 1 575 000) ; 2) prix de vente d'une machine (transport 8 250/machine ; douane 4 % du transport ; autres frais 15 % du coût d'achat ; distribution 20 % du PVHT ; marge 22 % ; TVA 18 %, CAD 5 %) ; 3) marge unitaire et totale.`,
  solution: `**Étude 1.**
- Consommation annuelle = 200 × 6 + 300 × 6 = 3 000 articles. Prix d'achat HT unitaire : PVTTCU 7 134 ÷ 1,18 = 6 045,76 HT ; taux de marque 25 % ⇒ coût d'achat = PVHT × (1 − 0,25)… (déduire le coût d'achat unitaire). Coût de lancement = 375 × 12 = 4 500/an ; coût de possession unitaire = 882 ÷ 8 820 = 10 % de la valeur stockée.
- **Lot économique** Q* = racine(2 × D × coût de lancement ÷ coût de possession unitaire) ; **nombre de commandes** N* = D ÷ Q*.
- Périodicité = 12 ÷ N* (mois) ou 360 ÷ N* (jours).
- Budget des approvisionnements : échelonner commandes et stocks sur l'année (stock de protection 12 jours).
- Perte si 15 commandes = coût total (lancement + possession) à 15 commandes − coût total optimal.
- Durée moyenne de stockage = 360 ÷ coefficient de rotation (stock moyen).
**Étude 2.**
1. Rabais R et remise r : r − R = 325 000 et r + R = 1 575 000 ⇒ r = 950 000, R = 625 000 ⇒ taux x. Corps de facture : brut → rabais → remise → net commercial → escompte 1 % → net financier → TVA 18 % → CAD 5 % → net à payer.
2. Coût d'achat unitaire = net commercial ÷ 250 + frais ; PVHT tel que marge 22 % ; prix de vente TTC = PVHT × 1,18 (+ CAD).
3. Marge unitaire = PVHT − coût de revient ; marge totale = marge unitaire × 250.`,
  difficulty: 3,
}

const gracePhonie = {
  title: 'Bac blanc 14 juin 2000 (G3) — Techniques commerciales : GRACE PHONIE et rentabilité (MARINA)',
  statement: `**Bac blanc — Complexes scolaires Prix Nobel & William Petty — 14 juin 2000 — Série G3 — Étude de cas — 5 h.** (1re partie.)

**Étude 1 — GRACE PHONIE (achat/stockage).** Facture d'appareils SIEMENS (05/01/2000) : rabais 5 %, remise 10 %, escompte 1 % ; le fournisseur a oublié l'escompte et appliqué à tort une TVA de 18,6 % ; net à payer erroné = 209 000 F. Prix d'achat brut unitaire 15 000 F.
TAF : 1) corps de la facture reçue ; 2) prévision annuelle en quantité ; 3) nombre empirique de commandes ; 4) prix de vente (transport 250 ; douane 18 % du coût d'achat ; manutention 2 % des douanes ; distribution 5 % du PVHT ; marge 16 % ; TVA 12,5 %) ; 5) budget des approvisionnements 2001 (ventes Jan 105, Fév 120 ; coefficients saisonniers mensuels donnés ; stock 31/12/2000 = 250 ; stock de sécurité 150 ; quantité commandée 450 ; délai 18 jours).

**Étude 2 — Rentabilité (MARINA, 1999).** Charges variables d'approvisionnement 780 000 ; marge sur coût variable 40 000 000 ; variation de stock −400 000 ; charges variables de distribution 1 500 000 ; CA critique 15 000 000 ; charges fixes 6 000 000.
TAF : 1) taux de M/CV ; 2) CA net ; 3) tableau d'exploitation différentiel ; 4) date du seuil de rentabilité (fermée en juin) ; 5) marge et indice de sécurité ; 6) en 2000 frais fixes +15 % : a) nouveau seuil ; b) CA pour un bénéfice de 45 100 000.`,
  solution: `**Étude 1.** 1. Reconstituer : brut (15 000 × n) → rabais 5 % → remise 10 % → (escompte 1 % oublié) → TVA 18,6 % (erronée) ⇒ net 209 000 pour la quantité ; en déduire n. Présenter ensuite la facture CORRECTE (avec escompte, sans TVA sur export). 2. Prévision = n (quantité de la commande annuelle). 3. Nombre empirique = consommation ÷ quantité par commande. 4. Coût d'achat unitaire + frais (transport, douane 18 %, manutention) ⇒ coût de revient ; PVHT (marge 16 %) ; PVTTC (TVA 12,5 %). 5. Budget : stock initial 250, sécurité 150, commandes de 450 au délai de 18 jours, ventes mensuelles = prévision × coefficient saisonnier.
**Étude 2.** 1. Taux M/CV = M/CV ÷ CA ; au seuil, CA critique × taux = charges fixes ⇒ taux = 6 000 000 ÷ 15 000 000 = **40 %**. 2. CA net = M/CV ÷ taux = 40 000 000 ÷ 0,40 = **100 000 000**. 3. Tableau différentiel (CA, charges variables, M/CV, charges fixes, résultat). 4. Seuil atteint au bout de CA critique ÷ CA × durée d'activité (11 mois, fermé en juin). 5. Marge de sécurité = CA − CA critique ; indice = marge ÷ CA. 6. Nouveau seuil = (6 000 000 × 1,15) ÷ 0,40 ; CA pour bénéfice 45 100 000 : (charges fixes + 45 100 000) ÷ taux.`,
  difficulty: 3,
}

const eputshaNgwasuma = {
  title: 'Test — Composition 1er semestre 2004-2005 (TG3) — Techniques commerciales : études de marché et prévisions (EPUTSHA, NGWASUMA)',
  statement: `**Lycée technique du 1er mai — Composition du 1er semestre 2004-2005 — Terminale G3 — Étude de cas — 5 h.** (1re partie.)

**Module 1 — Méthodes et outils d'étude de marché (EPUTSHA).** Questionnaire dans les rues de Brazzaville. 1) Comment déterminer l'échantillon type (critères de choix) ? 2) Budget 15 000 F ; une question coûte 65 F ; dépouillement/analyse 6 000 F : combien de personnes interroger ? Échantillon satisfaisant ? 3) Rédiger 5 questions principales.

**Module 2 — Prévision des ventes (NGWASUMA).** Ventes de boissons (millions F) 1995-2004 par marque (Fanta PM/GM, Grenadine PM/GM, Coca-cola, Pulpe).
TAF : 1) graphique d'évolution par produit et du CA global ; 2) répartition en % du CA (2004, 2003, 2002) ; 3) prévision Fanta PM 2005 (points moyens, 1997-2004) ; 4) prévision pulpe 2005 (points extrêmes) ; 5-6) corrélation ventes coca-cola / jours de fraîcheur, prévision 2005 (70 jours).`,
  solution: `**Module 1.** 1. Échantillon représentatif = même structure que la population mère (quotas par CSP, âge, sexe, zone) ; méthode des quotas ou tirage aléatoire. 2. Budget disponible pour les questions = 15 000 − 6 000 = 9 000 ; nombre de questions = 9 000 ÷ 65 ≈ 138 ; si le questionnaire compte q questions, nombre de personnes = 138 ÷ q. Échantillon **trop faible** pour des résultats significatifs. 3. Exemples de questions : fréquence d'achat, budget mensuel, marque préférée, lieu d'achat, prix acceptable.
**Module 2.** 1. Tracer une courbe par produit (échelle 1 cm = 4 M, 1 cm = 1 an) + courbe du CA global (somme). 2. % = CA du produit ÷ CA total de l'année × 100. 3. **Points moyens** : séparer la série 1997-2004 en deux sous-périodes, calculer le point moyen de chacune, tracer la droite, prolonger à 2005 (les 2 premières années sont écartées car atypiques). 4. **Points extrêmes** : droite passant par le premier et le dernier point, prolongée à 2005. 5-6. Coefficient de corrélation r = covariance ÷ (écarts-types) entre ventes et jours de fraîcheur ; si |r| proche de 1, relation forte ⇒ prévoir les ventes 2005 par la droite de régression pour 70 jours.`,
  difficulty: 3,
}

const prixPsycho = {
  title: 'Test — Études de marché : prix psychologique (Photomat et Pédalo)',
  statement: `**Exercices d'étude de marché — prix psychologique (série G3).**

**Exercice 8 (Photomat — caméra sonore).** Département de 210 473 ménages (répartition par CSP en annexe). On interroge 2 % (4 206 ménages). Deux questions : Q1 « au-dessus de quel prix trop cher ? » ; Q2 « au-dessous de quel prix mauvaise qualité ? ». Réponses par CSP fournies.
TAF : 1) nombre de ménages interrogés par CSP ; 2) axe des prix et segments d'acceptation par CSP ; 3) pour chaque prix, nombre d'acheteurs potentiels ⇒ prix psychologique ; 4) autres renseignements à considérer.

**Exercice 9 (Pédalo — tricycle enfant).** A) Vélos adultes : revenus +15 %, indice de richesse vive 1,68, élasticité 1,95, part de marché espérée 65 % en 2004 ; annexe 1 (CA et parts 1999-2003). TAF : CA prévisionnel 2004. B) Tricycle enfant : 3 questions (intention, prix trop cher, prix trop bas) ; annexes 2 et 3. TAF : 1) représenter les réponses Q2/Q3 ; 2) nombre d'acheteurs par prix ⇒ prix psychologique (= CA potentiel max ?).`,
  solution: `**Prix psychologique — méthode.**
- Pour chaque prix proposé, calculer le % de personnes qui le jugent « trop cher » (cumul Q1) et « trop bon marché » (cumul Q2/Q3) ; le % d'acheteurs potentiels = 100 − (% trop cher + % trop bas) ; le **prix psychologique** est celui qui maximise ce pourcentage d'acheteurs.
**Exercice 8.** 1. Nombre interrogé par CSP = 4 206 × part de la CSP (annexe 1, en %). 2. Tracer pour chaque CSP un segment entre son prix plancher (Q2) et son prix plafond (Q1). 3. Dresser le tableau cumulé par prix et retenir le prix du maximum d'acheteurs. 4. Autres éléments : coûts et marge, prix des concurrents, pouvoir d'achat, image/positionnement.
**Exercice 9.** A) CA 2004 : partir de l'effet revenu via l'élasticité (variation de la demande = élasticité × variation du revenu) et de l'indice de richesse vive ; part de marché 65 % ⇒ CA = marché total 2004 × 0,65 (arrondir à la dizaine de milliers). B) Même méthode du prix psychologique ; vérifier si le prix psychologique coïncide avec le CA potentiel maximum (nombre d'acheteurs × prix).`,
  difficulty: 3,
}

const reveVetements = {
  title: 'Bac rouge 11 juillet 2006 (G3) — Techniques commerciales : études de marché et fiche de stocks (REVE)',
  statement: `**Baccalauréat technique commercial — Session du 11 juillet 2006 — Série G3 — Étude de cas. (1re partie : techniques commerciales.)**

**Document 1 — Études de marché.** Mlle REVE (vêtements) : CA 2000 = 26 000 000 ; CA 2001 = 29 500 000 ; indice de richesse vive 1,12 ; élasticité demande/revenu 0,75. 2000→2001 : revenus +15 %, population 75 000 → 84 000. 2002 : revenus stables, prix +10 %, clientèle +14 %, concurrence 46 % du marché.
TAF : 1) différence indice de richesse vive / indice de disparité de la consommation ? 2) avis sur le CA 2001 (justifier par calcul) ; 3) CA prévisionnel 2002 (CA concurrence 2001 = moitié de celui de l'entreprise 2001).

**Document 2 — Fiche de stocks (pantalon SUPER 200, mai 2001).** Mouvements : 02/05 sortie 500 ; 08/05 commande 2 500 ; 10/05 sortie 600 ; 15/05 réception cmde 6 (PAU 32 800) ; 18/05 commande 3 000 ; 19/05 sortie 3 000 ; 21/05 réception cmde 7 (coût d'achat global 96 000 000) ; 23/05 commande 500 ; 24/05 sortie 2 000 ; 27/05 sortie 1 500 ; 28/05 réception cmde 8 (PA TTC global 66 100 000). Frais d'import : douane 12 % du PAU, transport 500/u, manutention 50/u. Stock avril 2001 : 2 000 pantalons valant 60 000 000.
TAF : établir la fiche de stocks avec sorties évaluées par : 1) CUMP après chaque entrée ; 2) CUMP d'après les seules entrées de la période ; 3) coût préétabli de 35 000 F.`,
  solution: `**Document 1.** 1. L'**indice de richesse vive** mesure le niveau de revenu/consommation d'une zone par rapport à la moyenne nationale ; l'**indice de disparité de la consommation** mesure l'écart de consommation d'un produit par rapport à la moyenne (il intègre l'élasticité). Ils diffèrent : le premier est global, le second propre au produit. 2. CA 2001 « normal » = CA 2000 × effet revenu (élasticité 0,75 × +15 %) × effet population (84/75) ; comparer au CA réel 29 500 000 pour juger. 3. CA 2002 : partir du marché 2001 (entreprise + concurrence = entreprise × 1,5), appliquer les effets 2002 (prix +10 %, clientèle +14 %, revenus stables) et la part restante après concurrence 46 %.
**Document 2.** Coût d'achat unitaire entrant = PAU + douane (12 %) + transport (500) + manutention (50). Réception cmde 6 : PAU 32 800 ⇒ coût entrée ; cmde 7 : 96 000 000 ÷ 3 000 = 32 000 PAU ; cmde 8 : 66 100 000 TTC ÷ 1,18 ÷ 500 ⇒ PAU. Tenir la fiche (entrées, sorties, stock) avec les trois méthodes de valorisation des sorties : 1) **CUMP recalculé après chaque entrée** ; 2) **CUMP unique de période** = (stock initial + total entrées) ÷ quantités ; 3) **coût préétabli 35 000** (écart d'incorporation en fin de période).`,
  difficulty: 3,
}

const casino = {
  title: 'Test — DST GFC2/LCT2 (niveau BTS) — Prévision par coefficients saisonniers (Casino)',
  statement: `**IHEM — DST : Prévision et Gestion Budgétaire en GFC2 et LCT2 — 2011-2012.** (Niveau post-bac ; méthode des coefficients saisonniers au programme de la prévision des ventes G3.)

Questions de cours : 1) définir la gestion budgétaire ; 2) phases de la gestion budgétaire ; 3) la prévision des ventes, « pierre angulaire » des autres budgets (justifier).
Étude de cas — indices de vente des chaussures de sport (magasin Casino) :
| Trimestre | 2005 | 2006 | 2007 |
|---|---|---|---|
| T1 | 106 | 90 | 106 |
| T2 | 111 | 111 | 106 |
| T3 | 100 | 106 | 90 |
| T4 | 115 | 100 | 95 |
TAF : déterminer les indices prévisionnels de vente 2008 par la méthode des coefficients saisonniers (valeurs ajustées et rapports au trend à 2 décimales ; coefficients saisonniers à 3 décimales).`,
  solution: `**Questions.** 1. La gestion budgétaire = mode de gestion consistant à traduire en budgets les décisions prises (prévision), puis à comparer réalisations et prévisions (contrôle budgétaire) pour agir. 2. Phases : prévision → budgétisation → contrôle (analyse des écarts). 3. Les ventes conditionnent la production, les approvisionnements, les investissements et la trésorerie : le budget des ventes est donc établi en premier et sert de base aux autres (« pierre angulaire »).
**Étude de cas — coefficients saisonniers.**
1. Ajustement du trend : calculer la tendance (moyennes mobiles centrées sur 4 trimestres, ou droite des moindres carrés sur les 12 valeurs) ⇒ valeurs ajustées (2 décimales).
2. Rapport au trend = valeur observée ÷ valeur ajustée (2 décimales) pour chaque trimestre.
3. Coefficient saisonnier de chaque trimestre = moyenne des rapports de ce trimestre, redressée pour que la somme des 4 coefficients = 4 (3 décimales).
4. Prévision 2008 = valeur de tendance prolongée à chaque trimestre 2008 × coefficient saisonnier correspondant.`,
  difficulty: 3,
}

export const BLOCS = [
  {
    subject: SUBJECT, match: MATCH, levels: ['bac_g3'], chapterTitle: CH, description: DESC,
    exercises: [louisette, sporaris, reveEnfance, gracePhonie, eputshaNgwasuma, prixPsycho, reveVetements, casino],
  },
]
