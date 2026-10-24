// Annales et sujets type bac — COMPTABILITÉ (générale/financière + analytique de gestion).
// Séries G2, G3, BG. Sujets officiels photographiés ; corrigés = méthode détaillée + calculs
// quand l'énoncé est complet (⚠️ données manquantes sur la photo). Type porté par le titre.
// Matières ciblées : « Comptabilité Analytique de Gestion », « Comptabilité Financière »
// (G2/G3), « COMPTABILITÉ GÉNÉRALE » (BG).

const ANALYTIQUE = { subject: 'Comptabilité Analytique de Gestion', match: 'comptabilit* analytique*' }
const FINANCIERE = { subject: 'Comptabilité Financière', match: 'comptabilit* financi*re' }
const GENERALE = { subject: 'COMPTABILITÉ GÉNÉRALE', match: 'comptabilit* g*n*rale' }
const CH = 'Annales et sujets type bac — Comptabilité'

const daso = {
  title: 'Test — Composition 1er trimestre 2008-2009 (TG2) — Comptabilité analytique : entreprise DASO',
  statement: `**Lycée technique Poaty Bernard — Composition du 1er trimestre 2008-2009 — Série TG2 — Étude de cas — Durée 5 h. (2ᵉ partie.)**

L'entreprise « DASO » fabrique un produit fini P à partir de deux matières M et N. La matière M est transformée dans l'atelier A en pièces X et Y (stockées) ; puis X et Y, avec la matière N, sont assemblées dans l'atelier B pour donner P.

Juin — Stocks au 1er : M 200 kg à 1 050 ; N 300 kg à 1 370 ; X 300 u à 2 600 ; Y 200 u à 2 875 ; P 10 u à 52 700.
Achats : M 1 600 kg à 900 ; N 3 200 kg à 1 260.
Consommations : M 1 500 kg (dont 500 pour X) ; N 2 700 kg ; X 3 u et Y 5 u par unité de P.
MOD : atelier A 150 h (X) et 270 h (Y) à 2 000 ; atelier B 218 h à 1 800.
Charges indirectes : Approvisionnement (kg achetés) 600 ; Atelier A (h MOD) 2 500 ; Atelier B (kg N consommés) 275 ; Distribution (1 000 F de ventes) 8. TARS distribution = 133 200.
Production : X 500 u ; Y 1 000 u ; P 220 u. Ventes : P à 75 000 l'unité.
Stocks au 30 : M 275 ; N 830 ; X 130 ; Y 100. Sorties au CUMP + SI.

**TAF :** 1) organigramme de production ; 2) différents coûts et résultat analytique de P (présenter les CIP).`,
  solution: `**Méthode (coûts hiérarchisés, sorties au CUMP avec stock initial).**
1. **Organigramme** : M → Atelier A → pièces X et Y (stock) ; X + Y + N → Atelier B → P (stock) → ventes.
2. Enchaînement des coûts :
- **Coût d'achat** de M et N = prix d'achat + charges d'approvisionnement (coût d'UO × kg achetés) ; d'où le CUMP de chaque matière = (stock initial + entrées) ÷ (quantités).
- **Coût de production des pièces** X et Y (atelier A) = M consommée (au CUMP) + MOD atelier A + charges indirectes A (h MOD) ; CUMP de X et de Y.
- **Coût de production de P** (atelier B) = X et Y consommées (3 X et 5 Y par P, au CUMP) + N consommée + MOD atelier B + charges indirectes B (kg N) ; CUMP de P.
- **Coût de revient de P** = coût de production des P vendus + distribution (8 par 1 000 F de ventes).
- **Résultat analytique** = chiffre d'affaires (P vendus × 75 000) − coût de revient.
- Vérifier les sorties par le stock final (CUMP) et présenter les CIP (coût d'achat, de production, de revient).
Ventes de P : production 220 + stock initial 10 − stock final : le nombre de P vendus se déduit des stocks (⚠️ le stock final de P n'est pas lisible sur la photo ; le lire sur la copie d'origine pour chiffrer le CA et le résultat).`,
  difficulty: 3,
}

const pontonCegeSogexFin = {
  title: 'Test — Composition 1er trimestre 2008-2009 (TG2) — Comptabilité générale : PONTON S.A (amortissements)',
  statement: `**Lycée technique Poaty Bernard — Composition du 1er trimestre 2008-2009 — Série TG2 — Étude de cas — Durée 5 h. (1re partie.)**

Au 31/12/2007, tableau des immobilisations de PONTON S.A :
| Nature | Valeur d'entrée | Amort. au 31/12/2006 |
|---|---|---|
| Charges à répartir | ? | ? |
| Bâtiments | 50 000 000 | 4 062 500 |
| Matériel et outillage ind. | 40 000 000 | 12 750 000 |
| Matériel et mobilier de bureau | 4 640 000 | 2 992 000 |
| Matériel de transport | 18 000 000 | 13 500 000 |

Inventaire : a) charges à répartir = 10 % de la valeur des bâtiments, inhérentes à leur acquisition ; b) bâtiments datant de la création, amortis sur 40 ans en linéaire ; c) matériel et outillage = machine A (25/01/2005, 25 000 000, dégressif, > 6 ans) + machine B (22/06/2007, dégressif, 6 ans 8 mois) ; d) matériel de transport = 1 véhicule, accéléré, 6 ans ; e) matériel et mobilier = micro-ordinateur (18/04/2004, 4 000 000, dégressif 6 ans, en service 01/05/2004) + machine à écrire IBM (15/08/2007, amort. économique linéaire 6 ans et fiscal dégressif).

**TAF :** 1) date de création de l'entreprise ; 2) VCN au 31/12/2006 des charges à répartir (6 ans) ; 3) durée de vie de la machine A ; 4) date d'acquisition du véhicule ; 5) écriture d'inventaire au 31/12/2007.`,
  solution: `**Méthode (amortissements, cumul 31/12/2006 donné).**
1. **Date de création** : les bâtiments datent de la création et sont amortis linéairement sur 40 ans → annuité = 50 000 000 ÷ 40 = 1 250 000. Cumul au 31/12/2006 = 4 062 500 ⇒ durée écoulée = 4 062 500 ÷ 1 250 000 = 3,25 ans ⇒ 3 ans et 3 mois avant le 31/12/2006 ⇒ **création vers le 01/10/2003** (1re annuité prorata).
2. **Charges à répartir** = 10 % × 50 000 000 = 5 000 000 ; amorties sur 6 ans ⇒ annuité 833 333 ; VCN 31/12/2006 = 5 000 000 − cumul (selon date d'engagement) : appliquer VCN = VO − Σamortissements.
3. **Machine A** : dégressif ; retrouver la durée à partir du taux dégressif (taux = taux linéaire × coefficient) et du cumul, par VCN = VO × (1 − t_d)^n.
4. **Véhicule (accéléré, 6 ans)** : à partir du cumul 13 500 000 sur VO 18 000 000 et du barème accéléré, déterminer le nombre d'annuités écoulées ⇒ date d'acquisition.
5. **Écriture d'inventaire 31/12/2007** : D 6813 Dotations aux amort. / C 2831, 2841, 2844, 2845 (montants des annuités 2007 de chaque poste). ⚠️ Plusieurs valeurs d'origine (charges à répartir, machines A/B) dépendent de données à lire précisément sur la copie ; appliquer la méthode ci-dessus poste par poste.`,
  difficulty: 3,
}

const cge2 = {
  title: 'Test — Évaluation 1er semestre (CGE2, niveau BTS) — Comptabilité analytique',
  statement: `**Évaluation du 1er semestre — Comptabilité analytique — Comptable Gestionnaire d'Entreprise (CGE2) — Durée 2 h.** (Niveau BTS joint au recueil ; méthode identique à la comptabilité analytique du bac G.)

Une entreprise fabrique X et Y à partir d'une matière A (atelier de coulage puis atelier de finition).
Stocks au 1er déc. : A 35 t à 300 F/kg ; X 600 m² à 15 875 ; Y 200 m² à 19 775.
Achats : A 25 000 kg à 268. Charges par nature 11 670 000 (dont 210 000 non incorporables, 3 840 000 MOD des deux ateliers). Charges supplétives (rémunération exploitant) 2 421 000/an.
Atelier coulage : 36 000 kg de A + 1 200 000 MOD pour 1 000 m² de A coulée. Atelier finition : X 450 m², Y 550 m² ; MOD X 1 550 h, Y 4 450 h.
Ventes : X 700 m² pour 15 400 000 ; Y 600 m² pour 17 100 000. Production : X 460 m², Y 500 m². Stocks physiques : A 22 000 kg ; X 350 m² ; Y 100 m².
Tableau de répartition fourni (Énergie, Adm, Appro, Atelier coulage, Atelier finition, Dist) ; DAA annuelles 6 360 000.

**TAF :** 1) achever le tableau de répartition (coûts d'UO arrondis) ; 2) résultat analytique ; 3) résultat corrigé ; 4) résultat de la comptabilité générale (par simple calcul). Sorties au CUMP.`,
  solution: `**Méthode.**
1. **Tableau de répartition** : répartir les charges par nature (dont dotations = 6 360 000 ÷ 12 pour le mois) selon les clés ; traiter les prestations réciproques Énergie ↔ Administration par un système de deux équations ; calculer les totaux secondaires puis les coûts d'unité d'œuvre.
2. Enchaîner : coût d'achat de A (prix + approvisionnement) → CUMP de A → coût de l'atelier coulage (A coulée) → coûts de production de X et Y (finition) → coûts de revient (distribution) → **résultats analytiques** = ventes − coûts de revient.
3. **Résultat corrigé** = Σ résultats analytiques + charges supplétives − charges non incorporables ± différences d'inventaire (écarts stocks réels/théoriques) ± différences d'imputation.
4. **Résultat de la comptabilité générale** = résultat corrigé − charges supplétives + charges non incorporables (relation de rapprochement). Charges supplétives mensuelles = 2 421 000 ÷ 12 ; non incorporables = 210 000.`,
  difficulty: 3,
}

const claudy = {
  title: 'Bac blanc déc. 2012 (G2-G3) — Comptabilité générale : établissements CLAUDY (amortissements)',
  statement: `**Complexe Scolaire Joseph Bikoko — Prépa-Bac n°2 — Session de décembre 2012 — Séries G2/G3 — Étude de cas — 5 h.** Documents autorisés : PCG OHADA, calculatrice. (1re partie.)

Balance des établissements CLAUDY au 31/12/2005 avant inventaire : 151 Amort. dérogatoires 1 440 000 ; 20 Charges immobilisées 1 480 000 ; 231 Bâtiment 15 000 000 ; 241 Matériel et outillage 6 000 000 ; 244 Matériel et mobilier 4 200 000 ; 245 Matériel de transport ? ; 2831 Amort. bâtiments 5 052 795 ; 2841 Amort. matériel et outillage 3 500 000 ; 2844 Amort. matériel et mobilier 2 937 000 ; 2845 Amort. matériel de transport ?

Inventaire : a) charges immobilisées engagées pour 5 920 000, il y a 3 ans 3 mois ; b) 2 bâtiments acquis le 23/01/99 (5 000 000) et 12/01/2002 (10 000 000), dégressif, dérogatoire non constaté ; c) 2 machines M1, M2 même coût, M2 acquise 25/07/2003 (service 01/08/2003), linéaire 5 ans ; d) salon (service 01/12/2001) + étagère (service 01/06/2002), linéaire 4 ans ; e) camionnette MAZDA (service 01/11/2002) + camionnette VW (25/05/2005, 4 500 000, service 31/08/2005), accéléré 5 ans, VRP = 0.

**TAF :** 1) durée de vie et taux des charges immobilisées ; 2) taux dégressif et durée des bâtiments (> 6 ans) ; 3) valeurs d'origine du matériel et mobilier ; 4) date de mise en service de M1 ; 5) valeur d'origine de la MAZDA (G2) ; 6) régularisation des bâtiments jusqu'à fin 2004 (G2) ; 7) écritures de régularisation 2005 ; 8) extrait du bilan au 31/12/2005.`,
  solution: `**Méthode.**
1. Charges immobilisées : durée 3 ans 3 mois écoulée ; le cumul (1 480 000) et la VO 5 920 000 donnent l'annuité et donc la durée totale et le taux (t = annuité ÷ VO).
2. Bâtiments (dégressif, durée > 6 ans) : taux dégressif = 1 ÷ durée × coefficient (2,5 si > 6 ans) ; retrouver la durée par VCN = VO × (1 − t_d)^n à partir du cumul 5 052 795 sur 15 000 000.
3. Matériel et mobilier : deux biens linéaires 4 ans à dates connues ; poser VO1 + VO2 = 4 200 000 et Σamortissements (prorata temporis) = 2 937 000 → système à deux inconnues.
4. M1, M2 même coût (VO = 3 000 000 chacune) linéaire 5 ans ; connaissant le cumul total 3 500 000 et la date de M2, déduire la date de M1.
5. MAZDA : accéléré 5 ans ; à partir du cumul du poste transport, de la VW (VO et dates connues) et de VRP = 0, isoler la VO de la MAZDA.
6-7. **Régularisations** : constater l'amortissement dérogatoire des bâtiments (D 851 / C 151) jusqu'à 2004, puis les dotations 2005 (D 6813 / C 28xx et D 851 / C 151) ; 8. présenter l'extrait de bilan (VO, amortissements, VCN par poste).
⚠️ Les montants exacts dépendent des dates et VO à lire sur la copie ; appliquer la démarche poste par poste.`,
  difficulty: 3,
}

const amortissements = {
  title: 'Test — Études de cas d’amortissement (maisons LE CAPI, KPI OLEY, etc. — sujets 4 à 8)',
  statement: `**Exercices d'amortissement — comptabilité générale (séries G).**

**Sujet 4 (LE CAPI).** Au 31/12/2005 : 22 Immobilisations corporelles 6 005 000 ; 28 Amort. 1 198 800. Matériels industriels (28/04/2005, 10 ans, dégressif) ; constructions (janv. 2001, linéaire 5 %) ; voiture (juil. 2003, linéaire 20 %). TAF : 1) valeur d'entrée de chaque immobilisation (construction = 4 × matériels industriels) ; 2) amortissements des constructions et de la voiture ; 3) si voiture = 1 700 000 HT, plan dégressif (TVA non déductible).

**Sujet 5.** Au 31/12/97 : 231 Construction 40 000 000 ; 2831 Amort. constructions 18 750 000 ; 2841 Amort. matériel 2 800 000. Immeuble A1 acquis il y a 11 ans (taux 3 %), A2 il y a 16 ans (taux 5 %) ; matériel acquis 1/05/93 (10 %, accéléré, VR 1 500 000). TAF : valeurs d'entrée des immeubles et du matériel ; annuités de 97 au journal.

**Sujet 6 (KPI OLEY).** Au 31/12/2005 : 241 M. & outillage ind. 2 112 000 ; 244 M. & mobilier 840 000 ; 245 M. transport 12 000 000 ; 2841 1 159 000 ; 2844 224 000 ; 2845 9 408 000. Scie (1/04/1999, linéaire) ; tour à bois (12/05/2001, 4 ans, dégressif, VCN 31/12/2001 = 684 000) ; mobilier linéaire 20 % ; 3 voitures (1/01/2002, dégressif 20 %). TAF : VO de la scie et de la tour ; écritures d'inventaire 31/12/2005.

**Sujet 7.** Au 31/12/2001 : 20 Charges immobilisées 1 944 000 ; 215 Fonds commercial 1 800 000 ; 245 M. transport 15 000 000 ; 2845 9 187 500. Charges immo. (14/07/2009, dégressif 5 ans) ; fonds (direct 25 %, acquis il y a 4 ans) ; NISSAN (08/04/2010, dégressif 4 ans) + RENAULT (linéaire 20 %). TAF : écritures d'inventaire 31/12/2011.

**Sujet 8 (LE CAPI).** Au 31/12/2005 : 20 Charges immo. 4 320 000 ; 231 Bâtiments ind. 36 000 000 ; 241 Matériel ind. 9 000 000 ; 2441 M. bureau 14 400 000 ; 245 M. transport 27 000 000 ; 2831 5 580 000 ; 2841 6 375 000 ; 2844 ? ; 2845 22 590 000. TAF : VO des charges immo., date des bâtiments, taux du matériel ind., VO des matériels de transport, écritures d'inventaire.`,
  solution: `**Méthode générale d'amortissement.**
- Linéaire : annuité = VO × t ; t = 1 ÷ durée ; date retrouvée par cumul ÷ annuité (prorata temporis au mois).
- Dégressif : t_d = t_linéaire × coefficient (1,5 si 3-4 ans ; 2 si 5-6 ans ; 2,5 si > 6 ans) ; VCN_n = VO × (1 − t_d)^n ; bascule au linéaire quand c'est plus favorable.
- Accéléré : barème (première et deux premières annuités majorées), base = VO − VRP.
- VCN = VO − Σamortissements.
Appliqué :
- **Sujet 4** : VO(matériels) = x, VO(construction) = 4x, VO(voiture) = y ; x·+ 4x + y = 6 005 000 et Σamortissements (selon dates et taux) = 1 198 800 ⇒ système ⇒ VO ; puis plan dégressif de la voiture (1 700 000, coefficient 2 pour 10 ans → t_d = 20 %).
- **Sujet 5** : annuité A1 = 40 000 000·… ; retrouver VO des immeubles par Σamortissements = 18 750 000 (deux immeubles, taux 3 % et 5 %, durées 11 et 16 ans) ; matériel : VO par cumul 2 800 000 et VR 1 500 000 (accéléré). Annuités 97 : D 6813 / C 2831, 2841.
- **Sujet 6** : tour à bois dégressif 4 ans (coefficient 1,5 → t_d = 37,5 %) ; VCN 31/12/2001 = 684 000 = VO × (1 − 0,375) prorata ⇒ VO de la tour ; scie = reste du poste ; voitures dégressif 20 %.
- **Sujet 7** : NISSAN dégressif 4 ans (t_d = 37,5 %) ; RENAULT linéaire 20 % ; charges immo. et fonds selon taux donnés ; écritures d'inventaire 31/12/2011.
- **Sujet 8** : charges immo. (engagées, réparties) ; bâtiments 30 ans ; matériel ind. accéléré 7 ans 1 mois ⇒ taux ; transport accéléré 5 ans (NISSAN 48 mois, RENAULT 02/04/2001, VRP 1 800 000) ⇒ VO ; 2844 à calculer.
⚠️ Les dates précises commandent les prorata ; chiffrer poste par poste à partir de la copie.`,
  difficulty: 3,
}

const tdAmort = {
  title: 'Test — TD « Les Amortissements » (Le Chemin de la Réussite, 2008-2009) — 10 exercices',
  statement: `**Centre d'encadrement scolaire « Le Chemin de la Réussite » — TD1 Les Amortissements (2008-2009).**
1. S.A « DMS » : matériel informatique 450 000 HT (15/11/2004, YAHYA, espèces, linéaire 4 ans, TVA 18 % déductible, service 17/11/2004). Journaliser l'acquisition et l'inventaire 31/12/2005 (frais d'acquisition 7 500 HT).
2. Matériel bureautique acquis 1/01/2003, dégressif, durée < 5 ans ; 1re annuité 168 750, 2e 105 468,75. Écriture d'inventaire fin 2005.
3. Matériel de transport : Σamortissements avant inventaire 1998 = 16 912 000, taux linéaire 1/4, annuité normale. Valeur d'origine et date d'acquisition.
4. Machine outil 536 000 (1/09/2001) + machine Star 242 000 (30/04), même taux ; VCN au 31/12/2004 du poste = 449 500. Taux constant commun.
5. Au 31/12/2000 : M. & outillage 5 226 000 ; M. bureau info. 4 144 000 ; Amort. 5 032 000. Même date, même taux linéaire 10 %. Date d'acquisition.
6. Machine acquise 1/05/1999, constant ; VCN 31/12/1999 = 2 600 000 ; VCN 31/12/2001 = 1 400 000. Plan d'amortissement.
7. Au 31/12/2000 : Matériel 280 000 ; Amort. 138 700 ; Net 141 300. Matériel de fabrication (10 ans) + de transport (5 ans), dégressif, acquis il y a 2 ans. Valeurs d'acquisition respectives.
8. Logiciel 30 000 000 TTC (01/04/2003, TVA non déductible, 5 ans, dégressif fiscal 100 %). Tableau de comparaison amortissement économique / fiscal ; écritures 31/12/2005.
9. Au 31/12/2003 : véhicules A et B, VCN totale 2 960 000 ; A acquis 1/01/2000, B 1/01/2002, linéaire 5 ans, Σ VO = 7 600 000. VO de chaque véhicule.
10. Au 31/12/2004 : M. bureau info. 620 000 ; Amort. 465 000. Micro 450 000 (02/01/1999), calculatrice 30 000 (01/07/2001), photocopieuse 140 000 (01/10/2004). Taux commun, puis durée.`,
  solution: `**Méthode (voir rappels d'amortissement).**
1. Acquisition : D 2442 Matériel informatique 450 000 ; D 4451 TVA déductible 81 000 / C 521 Banque/571 Caisse 531 000 (les frais 7 500 HT entrent dans la VO : base 457 500). Inventaire : D 6813 / C 2842 (annuité = 457 500 ÷ 4 × prorata).
2. Dégressif : 2e/1re annuité = 105 468,75 ÷ 168 750 = 0,625 = (1 − t_d) ⇒ t_d = 37,5 % ⇒ durée 4 ans ; VO = 168 750 ÷ 0,375 = 450 000 ; annuité 2005 (3e) = VCN × t_d.
3. Taux 25 % ; annuité = VO × 0,25 ; Σamortissements 16 912 000 = n × annuité ⇒ n et VO.
4. Taux constant t : VCN(poste) = 536 000(1 − t)^n + 242 000(1 − t)^m = 449 500 (n, m selon dates) ⇒ t.
5. Même taux 10 %, même date : Σamortissements = 10 % × (5 226 000 + 4 144 000) × n = 5 032 000 ⇒ n ⇒ date.
6. Constant : de VCN 1999 et 2001, (1 − t)² = 1 400 000 ÷ 2 600 000 ⇒ t ; VO = 2 600 000 ÷ (1 − t)^(prorata 1999).
7. Dégressif, 2 ans : poser VO_fab (10 ans, t_d 25 %) et VO_tr (5 ans, t_d 40 %) ; Σamortissements 2 ans = 138 700 et VO_fab + VO_tr = 280 000 ⇒ système.
8. Comparer annuités économiques (linéaire 20 %) et fiscales (dégressif 100 % la 1re année) ; l'écart = amortissement dérogatoire (D 851 / C 151).
9. Linéaire 5 ans : A amorti 4 ans (VCN = 0,2·VO_A), B amorti 2 ans (VCN = 0,6·VO_B) ; 0,2·VO_A + 0,6·VO_B = 2 960 000 et VO_A + VO_B = 7 600 000 ⇒ VO_A = 6 400 000, VO_B = 1 200 000.
10. Taux commun t : Σamortissements (prorata par bien) = 465 000 ⇒ t ⇒ durée = 1 ÷ t.`,
  difficulty: 3,
}

const bb2013Ana = {
  title: 'Bac blanc juin 2013 (G3) — Comptabilité analytique : produit R (encours et déchets)',
  statement: `**Bac Blanc — Session juin 2013 — Série G3 — Étude de cas — 5 h — Coeff. 06. (1re partie.)**

Une entreprise fabrique un produit fini R à partir des matières M et N. L'atelier 1 traite M → produit semi-fini K (stocké) ; déchets = 15 % du poids traité, vendus 1 300 F/kg après traitement de 600 F/kg, distribution rémunérée 10,5 % du CA des déchets. L'atelier 2 traite K + N → R (stocké).
Tableau de répartition (Entretien, Énergie, Approv., AT1, AT2, Dist, Adm) fourni.
1er trim. 2012 — Achats : M 16 000 kg à 1 000 ; N 7 000 kg à 950. Stock 01/01 : M 1 000 kg à 1 200 ; N 700 kg à 1 000 ; R 450 u à 3 000 ; en-cours AT1 6 000 kg à 800 ; en-cours AT2 1 050 kg à 3 000. Production : K 15 050 u (dont 4 000 achevées à 75 %) ; R 7 000 u. Charges directes : AT1 2 000 h à 850 ; AT2 1 750 h à 650. Stocks 31/03 : M 4 000 ; N 1 300 ; K 500 ; R 500 ; en-cours AT1 4 000 u à 75 % ; en-cours AT2 1 800 000 f. Ventes : R 6 950 u à 4 200.

**TAF :** 1) schéma technique ; 2) achever le tableau de répartition ; 3) coûts et résultat analytique ; 4) résultat d'exploitation (éléments supplétifs 880 000, charges non incorporables 1 600 000).`,
  solution: `**Méthode.**
1. **Schéma** : M → AT1 → K (+ déchets 15 % vendus) ; K + N → AT2 → R → ventes.
2. **Tableau de répartition** : prestations réciproques Entretien ↔ Énergie (système 2 équations), puis totaux secondaires et coûts d'UO (kg mp achetée, kg mp consommée, HMOD, QPFV, CPPFV).
3. Enchaîner coût d'achat M, N → coût de production de K (M + MOD AT1 + charges AT1 + en-cours initial − en-cours final − valeur des déchets nette) → coût de production de R (K + N + MOD AT2 + charges AT2 + en-cours) ; équivalences d'unités pour les en-cours (achèvement 75 %) ; CUMP/【PEPS selon consignes ; **résultat analytique** = CA de R − coût de revient de R (+ marge sur déchets).
4. **Résultat d'exploitation** = résultat analytique − charges supplétives 880 000 + charges non incorporables 1 600 000 (relation comptabilité analytique ↔ générale).`,
  difficulty: 3,
}

const bb2013Gen = {
  title: 'Bac blanc juin 2013 (G3) — Comptabilité générale : cessions et provisions',
  statement: `**Bac Blanc — Session juin 2013 — Série G3 — Étude de cas. (2ᵉ partie.)**

**Dossier 1 — Amortissements et cession.** Matériel de transport : Toyota RAV4 3 000 000 HT (TVA non déd.), Toyota Hilux 1 200 000 HT (TVA déd.), Toyota WX 2 140 200 TTC (TVA déd.), toutes acquises le 18/01/2009, dégressif, 5 ans. Le 30/04/2012 la RAV4 est échangée contre une PATROL neuve 3 250 000 HT (TVA non déd.), reprise 1 000 000 HT, soulte par chèque. TAF : résultat de cession ; écritures de régularisation 31/12/2012.

**Dossier 2 — Provisions.** État des créances douteuses au 31/12/2012 (clients Draman, Jeanny, Sabrina, Adélla, Vignie, Aude) avec provisions antérieures, règlements et observations ; état des titres de placement (MTN, Airtel, Warid, Azur) avec cours. TAF : écritures de régularisation 31/12/2012.`,
  solution: `**Méthode.**
**Dossier 1** : calculer la VCN de la RAV4 au 30/04/2012 (dégressif 5 ans, t_d = 40 %, prorata) ; résultat de cession = prix de reprise (1 000 000) − VCN ; passer la sortie (D 28 Amort., D 81 VCN cédée, D 485/521, C 24) et l'acquisition de la PATROL (D 245, D 4451, C 521 pour la soulte + reprise) ; régulariser les dotations 2012 des trois véhicules.
**Dossier 2** : pour chaque client, comparer la provision nécessaire (créance HT × taux de perte estimé) à la provision antérieure ⇒ dotation (6594 / 491) ou reprise (491 / 7594) ; solder les créances réglées ou irrécouvrables (pertes 651, TVA à régulariser). Pour les titres : provision = moins-value latente (prix d'acquisition − cours), dotation/reprise (6795 / 590), et plus-value à la cession enregistrée en produit. Tous les règlements en espèces non comptabilisés sont d'abord saisis.`,
  difficulty: 3,
}

const benieDorc = {
  title: 'Test — TD Comptabilité analytique (Le Céleste, TG2) — BENIE-DORC (encours et déchets)',
  statement: `**Complexe Scolaire le Céleste — TD de comptabilité analytique de gestion — Classe TG2 — « Encours et déchets ».**

BENIE-DORC fabrique 2 produits (P1, P2) à partir de M1, M2 dans 3 ateliers A, B, C. M1 passe en A (perte 10 % du poids) puis en C → P1 ; M2 passe en B (perte 10 %) puis en C → P2. Déchets de A irrécupérables (évacuation 250 F/kg) ; déchets de B vendus 375 F/kg.
Mars — MOD : A 1 500 h, B 1 800 h, C 2 200 h (1 400 P1, reste P2), à 240 F/h. Achats : M1 12 000 kg à 10 ; M2 6 500 kg à 15. En-cours A : début 25 000, fin 18 000 ; B : début 22 000, fin 12 000. Consommations : M1 12 000 ; M2 6 000 ; P1 2 500 kg ; P2 1 800 kg. Prix : P1 350, P2 600. Situation initiale : M1 3 500 kg à 20 ; M2 5 000 kg à 25 ; P1 25 000 kg à 20 ; P2 2 000 kg à 50. Charges supplétives : capital 8 400 000 à 5 %/an. Créance douteuse 100 000 à provisionner 70 %. Charges par nature (ADM, ENT, Approv., AT.A, AT.B, AT.C, Distrib.) fournies.

**TAF :** 1) achever le tableau de répartition ; 2) schéma technique ; 3) coûts et résultat analytique ; 4) résultat d'exploitation.`,
  solution: `**Méthode.**
1. Répartition : prestations réciproques ADM ↔ Entretien (système 2 équations), totaux secondaires, coûts d'UO (kg M achetée, HMOD, kg vendus).
2. Schéma : M1 → A (perte 10 %, déchets évacués) → C → P1 ; M2 → B (perte 10 %, déchets vendus) → C → P2.
3. Coûts d'achat M1, M2 (CUMP + SI) → coûts de production atelier A et B (matière + MOD + charges + en-cours initial − en-cours final − valeur des déchets) → coût de l'atelier C réparti entre P1 (1 400 h) et P2 (800 h) → coûts de revient (distribution) → **résultats analytiques** = ventes − coûts de revient.
4. Résultat d'exploitation = Σ résultats analytiques + charges supplétives (8 400 000 × 5 % ÷ 12) − dotation provision (100 000 × 70 %) et éléments de rapprochement.`,
  difficulty: 3,
}

const bgJbm = {
  title: 'Bac rouge 19 juin 2012 (BG) — Comptabilité : entreprise JBM (amortissements)',
  statement: `**Baccalauréat technique — Session du 19 juin 2012 — Série BG — Comptabilité — Durée 3 h.** Documents autorisés : plan comptable, calculatrice.

Balance avant inventaire au 31/12/2008 de « JBM » : 241 Matériels et outillage 1 228 000 ; 245 Matériels de transport 375 000 ; 2841 Amort. matériel et outillage 241 400 ; 2845 Amort. matériel de transport 195 000.
Inventaire : 1) matériel et outillage = tour automatique (01/07/2006, 720 000) + presse hydraulique (01/10/2007, 508 000) ; le 30/11/2008 la tour est mise au rebut (court-circuit) ; 2) matériel de transport = 1 voiture, VCN au 31/12/2006 = 300 000, dégressif.

**TAF :** 1) taux constant du matériel et outillage et taux dégressif du matériel de transport ; 2) écritures nécessaires au 31/12/2008.`,
  solution: `**Méthode.**
1. **Taux constant (linéaire) du matériel et outillage** : les amortissements 2841 = 241 400 au 31/12/2007 (cumul avant l'exercice 2008). Annuités de la tour (depuis 01/07/2006) et de la presse (depuis 01/10/2007), prorata temporis, au même taux t : 720 000·t·(durées) + 508 000·t·(durée) = 241 400 ⇒ **t**.
2. **Taux dégressif du transport** : VCN 31/12/2006 = 300 000 ; cumul 2845 = 195 000 au 31/12/2007 ⇒ annuité 2007 = VCN × t_d ; avec VO et VCN successives, (1 − t_d) = VCN_n+1 ÷ VCN_n ⇒ **t_d**.
Écritures 31/12/2008 : dotation de l'exercice (D 6813 / C 2841, 2845) ; **mise au rebut de la tour** le 30/11/2008 : dotation complémentaire au prorata (jusqu'au 30/11), puis sortie (D 2841 pour le cumul, D 81 VCN pour la valeur résiduelle, C 241 pour la VO).`,
  difficulty: 3,
}

const sogexAna = {
  title: 'Bac rouge 21 juin 2011 (G2) — Comptabilité analytique : SOGEX (escabeaux)',
  statement: `**Baccalauréat technique — Session du 21 juin 2011 — Série G2 — Étude de cas — 5 h.** Documents : calculatrice, plan comptable OHADA. (1re partie.)

SOGEX fabrique 2 escabeaux : ESCA-PM (vendu 1 200 F) et ESCA-GM (14 000 F), à partir de lattes de bois, pièces plastiques et barres d'aluminium (atelier usinage puis montage, sans stockage intermédiaire).
Prix d'achat : Bois 27,4 F/u ; Plastique 45,7 F/pièce ; Aluminium 15,2 F/u. Consommations par escabeau — ESCA-PM : 10 bois, 1 plastique, 15 aluminium ; ESCA-GM : 12 bois, 4 plastiques, 25 aluminium. MOD/unité — usinage : PM 20 min, GM 42 min ; montage : PM 20 min, GM 45 min. Taux horaire MOD : usinage 274,4 F, montage 150 F.
Charges indirectes 1er trim. 2009 : Approvisionnement 432 000 (∝ quantités achetées) ; Usinage 318 560 (∝ H.MOD) ; Montage 405 000 (∝ H.MOD) ; Distribution 105 600 (∝ CA) ; Administration 115 740 (dont 35 340 pour ESCA-GM). Sorties : CUMP (matières), PEPS (produits finis). Charges supplétives 60 000/mois ; non incorporables 25 000/mois exclues.
Stock 01/01/2009 : Bois 7 000 u (247 000) ; Aluminium 10 000 u (190 000) ; ESCA-PM 1 000 u (850 000) ; ESCA-GM 1 000 u (1 700 000). Achats : Bois 110 000 ; Plastiques 20 000 ; Aluminium 250 000. Production : PM 9 000 ; GM 2 000. Ventes : PM 8 000 ; GM 2 000. Stocks finaux réels 31/03 : Bois 2 900 ; Plastique 2 990 ; Aluminium 3 050 ; ESCA-PM 1 567 000 ; ESCA-GM 1 369 860.

**TAF :** 1) différents coûts ; 2) résultats analytiques par produit, global, corrigé, et résultat d'exploitation.`,
  solution: `**Méthode.**
- Coût d'achat de chaque matière = prix d'achat + part d'approvisionnement (∝ quantités achetées) ; CUMP = (stock initial + entrées) ÷ quantités.
- Coût de production par produit = matières consommées (au CUMP, selon nomenclature) + MOD usinage et montage (minutes → heures × taux) + charges indirectes usinage et montage (∝ H.MOD) ; PEPS pour sortir les produits finis.
- Coût de revient = coût de production des produits vendus + distribution (∝ CA) + administration (dont 35 340 pour GM).
- **Résultats analytiques** par produit = CA − coût de revient ; **global** = somme ; **corrigé** = global + charges supplétives (60 000 × 3) − différences d'inventaire (écarts stocks réels/théoriques) ; **résultat d'exploitation** = corrigé ajusté des charges non incorporables (25 000 × 3) et supplétives.`,
  difficulty: 3,
}

const rapprochementRoly = {
  title: 'Bac blanc (G2) — Comptabilité générale : état de rapprochement (entreprise Roly)',
  statement: `**Étude de cas — Deuxième partie : comptabilité générale — État de rapprochement (entreprise Roly).**

Le 31/12/2007, le compte « banque LCB » chez Roly présente un solde débiteur de 1 136 700 F ; le relevé de la banque indique un solde créditeur de 626 300 F. Discordances : chèque n° 017 (19/12, fournisseur Henri) comptabilisé 276 300 au lieu de 267 300 ; chèques n° 018 et 019 (302 700) non encore présentés ; virement client Eric 251 000 (banque 30/12, Roly 06/01/2008) ; chèque remis 132 900 (Roly 28/12, banque 03/01/2008). Le relevé comporte : effets domiciliés échus 970 300 ; coupons encaissés 36 000 ; droit de garde 2 100 et frais de tenue de compte 3 900.

**TAF :** 1) reconstituer l'état de rapprochement au 31/12/2007 ; 2) écritures de régularisation au journal du 31/12/2007.`,
  solution: `**Méthode.**
1. **État de rapprochement** (deux colonnes : compte banque chez Roly / compte Roly à la banque). Côté Roly : corriger l'erreur du chèque 017 (+ 9 000), enregistrer le virement reçu 251 000 (+), les effets domiciliés 970 300 (−), les coupons 36 000 (+), le droit de garde 2 100 (−), les frais 3 900 (−). Côté banque : ajouter les chèques 018/019 non débités (−) et le chèque remis 132 900 non encore crédité (+). Après ajustements, les deux soldes rapprochés doivent être égaux.
2. **Écritures chez Roly** (seules les opérations qui le concernent) : D 521 Banque / C 411 Eric 251 000 ; D 521 / C 497 ou 401 Henri 9 000 (erreur) ; D 521 / C 497 effets 970 300 ; D 521 / C 77 Revenus (coupons) 36 000 ; D 631/6312 Frais bancaires 3 900 + D 627 Droit de garde 2 100 / C 521. (Les chèques non présentés et le chèque en cours d'encaissement ne donnent pas d'écriture : simples décalages.)`,
  difficulty: 3,
}

const r/* reve compta */ = {
  title: 'Bac rouge 11 juillet 2006 (G3) — Comptabilité : amortissement et tableau d’exploitation (REVE)',
  statement: `**Baccalauréat technique commercial — Session du 11 juillet 2006 — Série G3 — Étude de cas. (Deuxième partie : comptabilité.)**

**Exercice 1.** Une machine-outil acquise le 17/07/2000 est amortie en 5 ans en dégressif ; les deux dernières annuités sont chacune de 168 800 F. TAF : a) taux d'amortissement ; b) valeur d'origine ; c) tableau d'amortissement.

**Exercice 2.** Reconstituer le tableau d'exploitation de l'entreprise REVE : seuil de rentabilité 2 500 000 ; marge sur coût variable (pour le CA) 1 600 000 ; charges fixes 400 000 ; coefficient de rotation des stocks = 4 ; stock final dépassant de 10 000 F le stock initial. TAF : établir le tableau d'exploitation différentiel (achats et stocks apparents).`,
  solution: `**Exercice 1.** Dégressif 5 ans ⇒ coefficient 2 ⇒ t_d = 40 % ; les deux dernières annuités égales correspondent au passage au linéaire sur la durée restante. a) **t_d = 40 %**. b) Les deux dernières annuités (linéaire sur 2 ans) = VCN à ce moment ÷ 2 = 168 800 ⇒ VCN = 337 600 ; remonter par (1 − 0,40) chaque année jusqu'à la VO : VO = 337 600 ÷ (0,6)^3 (3 années de dégressif avant la bascule) ≈ **1 563 000 F** (ajuster selon le prorata 2000). c) Dresser le tableau (année, base, annuité dégressive puis linéaire, cumul, VCN).
**Exercice 2.** Taux de M/CV = M/CV ÷ CA ; au seuil, M/CV = charges fixes ⇒ taux = 400 000 ÷ 2 500 000 = 16 % ; CA = M/CV ÷ 16 % = 1 600 000 ÷ 0,16 = **10 000 000**. Coût variable = CA − M/CV = 8 400 000. Coût d'achat des marchandises vendues = achats + stock initial − stock final ; avec rotation = coût d'achat vendu ÷ stock moyen = 4 et stock final = stock initial + 10 000, en déduire achats et stocks. Dresser le tableau différentiel (CA, achats, variation de stock, autres charges variables, M/CV, charges fixes, résultat).`,
  difficulty: 3,
}

export const BLOCS = [
  // Comptabilité analytique de gestion
  { ...ANALYTIQUE, levels: ['bac_g2'], chapterTitle: CH, exercises: [daso, cge2, benieDorc, sogexAna] },
  { ...ANALYTIQUE, levels: ['bac_g3'], chapterTitle: CH, exercises: [bb2013Ana] },
  // Comptabilité financière / générale (G2, G3)
  { ...FINANCIERE, levels: ['bac_g2'], chapterTitle: CH, exercises: [pontonCegeSogexFin, rapprochementRoly] },
  { ...FINANCIERE, levels: ['bac_g2', 'bac_g3'], chapterTitle: CH, exercises: [claudy, amortissements, tdAmort] },
  { ...FINANCIERE, levels: ['bac_g3'], chapterTitle: CH, exercises: [bb2013Gen, r] },
  // Comptabilité générale (BG)
  { ...GENERALE, levels: ['bac_bg'], chapterTitle: CH, exercises: [bgJbm] },
]
