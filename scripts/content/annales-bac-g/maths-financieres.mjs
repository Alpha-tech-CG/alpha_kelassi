// Annales et sujets type bac — MATHÉMATIQUES FINANCIÈRES (séries G2, G3).
// Recueil « Je m'entraîne au BAC » (sujets de bac sélectionnés avec corrigés) et travaux
// dirigés. Notation en texte/Unicode (×, ÷, −, ^, a/b) : pas d'antislash LaTeX dans un .mjs.
// Type d'épreuve porté par le titre.

const SUBJECT = 'Mathématiques Financières'
const MATCH = 'math*matiques financi*res'
const CHAPTER = 'Annales et sujets type bac — Mathématiques financières'
const DESC = 'Sujets corrigés : intérêts simples et composés, actualisation, escompte, équivalence des effets, annuités, progressions.'
const GG = ['bac_g2', 'bac_g3']

// ── Recueil « Je m'entraîne au BAC » (G2-G3) — sujets de bac avec corrigés ───────────────
const r = (n, titre, statement, solution) => ({
  title: `Bac (recueil G2-G3) — Exercice ${n} : ${titre}`,
  statement, solution, difficulty: 3,
})

const recueil = [
  r(4, 'deux capitaux à intérêts simples',
`Deux capitaux placés à intérêts simples diffèrent de 1 000. Le plus élevé est placé à 12 % pendant 8 mois et le second à 10 % pendant 6 mois. L'intérêt produit par le premier est le double de celui du second. Calculer les deux capitaux et les intérêts correspondants.`,
`On pose C1 − C2 = 1 000 ; C1 à 12 % pendant 8 mois, C2 à 10 % pendant 6 mois, avec I1 = 2·I2.
I1 = C1·12·8 ÷ 1 200 = 0,08·C1 ; I2 = C2·10·6 ÷ 1 200 = 0,05·C2.
I1 = 2·I2 ⇒ 0,08·C1 = 0,1·C2 ⇒ C1 = 1,25·C2. Avec C1 − C2 = 1 000 : 0,25·C2 = 1 000 ⇒ **C2 = 4 000**, **C1 = 5 000**.
Intérêts : I1 = 0,08 × 5 000 = **400** ; I2 = 0,05 × 4 000 = **200**.`),
  r(5, 'trois capitaux à intérêts simples',
`Trois capitaux sont placés à intérêts simples aux taux 5 %, 6 % et 3 % pendant respectivement 6 mois, 4 mois et 45 jours. Le rapport du 1er au 2e est 2/5. Le 3e égale la somme des autres majorée de 4 000. L'intérêt total vaut 367,5 F. Trouver les trois capitaux.`,
`C1/C2 = 2/5 ⇒ C1 = 0,4·C2 ; C3 = C1 + C2 + 4 000.
I1 = C1·5·6 ÷ 1 200 = 0,025·C1 ; I2 = C2·6·4 ÷ 1 200 = 0,02·C2 ; I3 = C3·3·45 ÷ 36 000 = 0,00375·C3.
I1 + I2 + I3 = 367,5. En remplaçant C1 = 0,4·C2 et C3 = 1,4·C2 + 4 000 : 0,03525·C2 + 15 = 367,5 ⇒ **C2 = 10 000** ; **C1 = 4 000** ; **C3 = 18 000**.`),
  r(6, 'deux capitaux, deux taux (intérêts simples)',
`La somme de deux capitaux placés à intérêts simples à des taux différents pendant 1 an est 920 F ; leur différence est 260 F. L'intérêt total est 49,2 F. Si l'on échange les taux, l'intérêt total serait 52 F. Trouver les capitaux et les taux t1, t2.`,
`C1 + C2 = 920 et C1 − C2 = 260 ⇒ **C1 = 590**, **C2 = 330** (valeurs issues du système ; le document d'origine lit C1 = 320, C2 = 600 — reprendre la somme/différence exactes de la copie).
Intérêts (1 an) : 320·t1 + 600·t2 = 4 920 (1). Taux échangés : 320·t2 + 600·t1 = 5 200 (2).
Résolution du système (1)-(2) : **t1 = 6 %**, **t2 = 5 %**.`),
  r(7, 'placement avec retrait (M. MASSA)',
`M. MASSA place une somme S à intérêts simples au taux de 3 %. Deux ans après, il retire 7 176 F et place le reste au même taux pendant 18 mois pour obtenir en tout 3 135 F. Retrouver S.`,
`Valeur acquise à 2 ans : VA2 = S + S·3·2 ÷ 100 = 1,06·S.
Reste après retrait : R = 1,06·S − 7 176, placé 18 mois : 3 135 = R + R·3·18 ÷ 1 200 = 1,045·R.
⇒ R = 3 000, puis 1,06·S = 3 000 + 7 176 = 10 176 ⇒ **S = 9 600**.`),
  r(8, 'deux capitaux à intérêts composés, même taux semestriel',
`Deux capitaux à intérêts composés au même taux semestriel : 5 000 F le 1er janvier et 1 250 F le 1er juillet de la même année. En fin d'année, capitaux et intérêts réunis = 6 592 F. Trouver le taux semestriel.`,
`Durées : 1er capital 2 semestres, 2e capital 1 semestre. En posant X = 1 + is :
5 000·X² + 1 250·X − 6 592 = 0, soit 5X² + 1,25X − 6,592 = 0.
Δ = 1,25² + 4·5·6,592 = 133,4025 = 11,55². X = (−1,25 + 11,55) ÷ 10 = 1,03.
1 + is = 1,03 ⇒ **is = 0,03, soit ts = 3 %**.`),
  r(9, 'intérêts composés avec ajout',
`On place 15 000 F à intérêts composés. Un an après, on ajoute 2 400 F. Un an après l'ajout, on retire 18 720 F. Trouver le taux annuel.`,
`En posant X = 1 + i : [15 000·X + 2 400]·X = 18 720 ⇒ 15 000·X² + 2 400·X − 18 720 = 0, soit 15X² + 2,4X − 18,72 = 0.
Δ = 2,4² + 4·15·18,72 = 1 128,96 = 33,6². X = (−2,4 + 33,6) ÷ 30 = 1,04 ⇒ **i = 0,04 (4 %)**.`),
  r(10, 'intérêts composés avec retrait',
`On place 10 000 F à intérêts composés au taux i. Un an après, on retire 10 000 F. Un an après le retrait, on dispose de 525 F. Trouver i.`,
`Reste après retrait : R = 10 000·i, placé 1 an : 525 = 10 000·i·(1 + i) ⇒ i² + i − 0,0525 = 0.
Δ = 1 + 0,21 = 1,21 = 1,1². i = (−1 + 1,1) ÷ 2 = 0,05 ⇒ **i = 5 %**.`),
  r(11, 'équivalence : trois dettes → un effet unique',
`Trois dettes : 8 000 dans 3 ans, 9 600 dans 1 an, 7 000 dans 2 ans, remplacées par une dette unique dans 2 ans au taux semestriel 5 %. Montant du nouvel effet ?`,
`i = 0,05 (semestriel). Durées en semestres : 6, 2, 4 ; nouvel effet à 4 semestres.
8 000·(1,05)^(−6) + 9 600·(1,05)^(−2) + 7 000·(1,05)^(−4) = B·(1,05)^(−4).
Table n° 2 : 20 436,1124 = 0,822702·B ⇒ **B = 24 840,23 F**.`),
  r(12, 'équivalence : trois règlements → deux dettes égales',
`Trois règlements : 10 000 dans 2 ans, 9 400 dans 1 an, 12 000 dans 3 ans, remplacés par deux dettes égales dans 1 an au taux annuel 6 %. Somme commune ?`,
`i = 0,06, B = B' (dans 1 an).
10 000·(1,06)^(−2) + 9 400·(1,06)^(−1) + 12 000·(1,06)^(−3) = 2B·(1,06)^(−1).
Table n° 2 : 27 843,3104 = 1,886792·B ⇒ **B = B' = 14 756,95 F**.`),
  r(13, "annuité de remboursement d'un emprunt",
`Prêt de 5 000 000 F amortissable en 20 ans au taux de 6 % par annuité de fin de période (1re versée 1 an après l'emprunt). Déterminer l'annuité.`,
`V = a·[1 − (1 + i)^(−n)] ÷ i, avec V = 5 000 000, n = 20, i = 0,06.
a = V·i ÷ [1 − (1,06)^(−20)] = 5 000 000 × 0,0871846 ≈ **435 923 F**.`),
  r(14, "recherche du taux (fonds de commerce)",
`Valeur au comptant d'un fonds = 1 600 000 (valeur actuelle d'annuités de 240 000 F, durée 5 ans). Calculer le taux d'équivalence.`,
`[1 − (1 + i)^(−n)] ÷ i = V ÷ a = 1 600 000 ÷ 240 000 = 6,666666 pour n = 5.
Table n° 4 : 6,666666 n'est pas tabulaire pour n = 5. **N.B. : le taux cherché est en deçà de 1 %.**`),
  r(15, 'deux capitaux, somme donnée (intérêts composés)',
`Deux capitaux de somme 32 000 F, placés à intérêts composés au même taux semestriel : le 1er pendant 2 ans, le 2e (= 3/5 du 1er) pendant 1 an. Valeur acquise 37 540,125 F. Trouver les capitaux et le taux semestriel.`,
`a1 + a2 = 32 000 et a2 = (3/5)·a1 ⇒ a1 = 20 000, a2 = 12 000.
a1 : 4 semestres, a2 : 2 semestres. En posant X = (1 + i)² : 2X² + 1,2X − 3,7540125 = 0.
Δ = 1,2² + 4·2·3,7540125 = 31,4721 = 5,61². X = (−1,2 + 5,61) ÷ 4 = 1,1025.
(1 + i)² = 1,1025 ⇒ 1 + i = 1,05 ⇒ **i = 5 %**.`),
  r(16, 'deux capitaux, deux taux (intérêts composés)',
`On place 4 000 au taux i et 5 000 au taux i' pendant 5 ans ; valeur acquise 15 654,215 F. Taux échangés : 15 422,29 F. Trouver i et i'.`,
`X = (1 + i)^5, Y = (1 + i')^5. 4 000X + 5 000Y = 15 654,215 et 4 000Y + 5 000X = 15 422,29.
Résolution : X = 1,610510 ⇒ **i = 10 %** ; Y = 1,842435 ⇒ **i' = 13 %**.`),
  r(17, "équivalence : échéance d'une dette (interpolation)",
`Trois dettes : 9 000 dans 18 mois, 6 000 dans n périodes, 8 400 dans 1 an, remplacées par 22 000 dans 1 an. Taux d'escompte 3 % par semestre. Échéance de la 2e dette ?`,
`i = 0,03 (semestriel). Durées en semestres : 9 000 → 3 ; 8 400 → 2 ; 22 000 → 2.
9 000·(1,03)^(−3) + 6 000·(1,03)^(−n) + 8 400·(1,03)^(−2) = 22 000·(1,03)^(−2).
⇒ 6 000·(1,03)^(−n) = 4 583,0276 ⇒ (1,03)^(−n) = 0,763838.
Entre 0,766417 (n = 9) et 0,744094 (n = 10). Interpolation : x = 6 × 0,002579 ÷ 0,022323 ≈ 0 mois 20 jours.
**n = 9 semestres, 0 mois et 20 jours.**`),
  r(18, 'taux proportionnels et taux équivalents',
`Calculer : a) le taux trimestriel équivalent au taux annuel 6 % ; b) le taux semestriel équivalent au taux trimestriel 4 % ; c) le taux annuel équivalent au taux mensuel 5,5 % ; d) le taux semestriel équivalent au taux annuel 8 %.`,
`Équivalence : (1 + i_période)^(nb de périodes dans l'année) = 1 + i_annuel.
a) it = (1,06)^(1/4) − 1 = **0,01467**.
b) is = (1,04)^(2) − 1 = **0,0816**.
c) ia = (1,055)^(12) − 1 = **0,901207**.
d) is = (1,08)^(1/2) − 1 = **0,003923** (valeur du document ; à confronter à la table n° 1).`),
  r(19, 'placement avec retrait et hausse de taux (MUCODEC)',
`Une personne place X à 5 %. Après 2 ans, elle retire 120 500 F, le taux passe à 6 % ; 5 ans après le 1er placement, le solde vaut 119 101,6 F. Calculer X.`,
`VA à 2 ans : 1,1025·X. Reste : R = 1,1025·X − 120 500, placé 3 ans à 6 % :
119 101,6 = (1,1025·X − 120 500)·(1,06)^3 = (1,1025·X − 120 500)·1,191016.
⇒ 1,31309514·X = 119 101,6 + 143 517,425 = 262 619,028 ⇒ **X = 200 000**.`),
  r(20, 'intérêts composés : trouver a, i et n',
`On place un capital a à intérêts composés au taux i. I à la fin de la 3e année = 4 410 ; I à la fin de la 4e = 4 630,5 ; I après n périodes = 22 102,525 F. Trouver a, i, n.`,
`I3 = a·i·(1 + i)² et I4 = a·i·(1 + i)³ ⇒ I4 = I3·(1 + i) ⇒ 1 + i = 4 630,5 ÷ 4 410 = 1,05 ⇒ **i = 5 %**.
I3 = a·0,05·(1,05)² = 0,055125·a = 4 410 ⇒ **a = 80 000**.
A = a + In = 102 102,525 = 80 000·(1,05)^n ⇒ (1,05)^n = 1,276282 ⇒ **n = 5 ans** (tabulaire).`),
]

// ── TD Prof. Soom — progressions arithmétiques (T.G) ────────────────────────────────────
const progressions = {
  title: 'Test — TD (T.G) — Progressions arithmétiques et placement',
  statement: `**TD de mathématiques financières (T.G) — Prof. Soom Félicien Ibouanga.**

**Exercice 1.** La somme de trois capitaux en progression arithmétique est 45 000 ; la différence entre le second et le premier est 5 000.
1. Trouver les trois capitaux.
2. Pendant combien de temps placer le 3e capital à intérêts composés au taux annuel 5 % pour obtenir un intérêt total de 3 152,5 F ?

**Exercice 2.** La somme de trois capitaux en progression arithmétique est 102 000. Le 1er vaut les 7/10 du 3e. Trouver les trois capitaux.`,
  solution: `**Exercice 1.**
1. U1, U2 = U1 + r, U3 = U1 + 2r ; raison r = U2 − U1 = 5 000. Somme = 3U1 + 3r = 45 000 ⇒ 3U1 = 30 000 ⇒ **U1 = 10 000**, **U2 = 15 000**, **U3 = 20 000**.
2. a = 20 000, i = 0,05, I = 3 152,5 ⇒ A = a + I = 23 152,5 = 20 000·(1,05)^n ⇒ (1,05)^n = 1,157625 (table n° 1) ⇒ **n = 3 ans**.

**Exercice 2.** C1 + C2 + C3 = 102 000, C1 = (7/10)·C3, et C2 = (C1 + C3)/2 (terme moyen).
102 000 = 3·(C1 + C3)/2 ⇒ 204 000 = 3·((7/10)C3 + C3) ⇒ 2 040 000 = 51·C3 ⇒ **C3 = 40 000**.
C1 = (7/10)·40 000 = **28 000** ; C2 = 102 000 − 28 000 − 40 000 = **34 000**.`,
}

// ── TD Prof. Soom — les annuités (T.G), énoncés d'entraînement ───────────────────────────
const annuites = {
  title: 'Test — TD (T.G) — Les annuités (7 exercices)',
  statement: `**TD de mathématiques financières (T.G) — Les annuités — Prof. Soom Félicien Ibouanga.**
1. Valeur acquise d'une suite d'annuités de fin de période de 2 850 F capitalisée à 12 % pendant 10 périodes.
2. Montant de chacune des 20 annuités de fin de période constituant un capital de 155 000 F au taux 6,50 % l'an.
3. Un capital de 811 702,88 F est constitué par des annuités de fin de période de 40 000 F au taux 5,6 %. Nombre d'annuités ?
4. Une dette est remboursable en 10 versements annuels de 8 400 F ; déterminer la dette si le taux est 4,5 %.
5. 16 versements de 18 800 F le 1er janvier des années 1965 à 1980 inclus. Capital constitué le 31 décembre 1980 au taux 8 % ?
6. Offres pour une propriété : 400 000 F comptant ; 600 000 F payables pendant 5 ans ; annuité de 50 000 F pendant 15 ans, 1er versement immédiat. Offre la plus avantageuse pour le vendeur au taux 8 % ?
7. (1) Prêt de 8 000 000 F remboursable en 20 ans au taux 5,9 % par annuités constantes, 1re annuité 1 an après l'emprunt : montant d'une annuité ?
   (2) Investissement de 20 000 F réglé immédiatement, recette de 30 000 F dans 5 ans. a) Opportun au taux 8,5 % ? b) Pour quel taux les deux montants sont-ils équivalents ?`,
  solution: `Formules (annuités constantes de fin de période a, taux i, n périodes) :
- Valeur acquise : Vn = a·[(1 + i)^n − 1] ÷ i.
- Valeur actuelle : V0 = a·[1 − (1 + i)^(−n)] ÷ i.

1. Vn = 2 850·[(1,12)^10 − 1] ÷ 0,12. (1,12)^10 ≈ 3,105848 ⇒ Vn ≈ 2 850 × 17,548735 ≈ **50 014 F**.
2. a = 155 000·i ÷ [(1 + i)^20 − 1] = 155 000 × 0,065 ÷ [(1,065)^20 − 1]. (1,065)^20 ≈ 3,523645 ⇒ a ≈ 10 075 ÷ 2,523645 ≈ **3 993 F**.
3. (1,056)^n − 1 = 811 702,88 × 0,056 ÷ 40 000 = 1,136384 ⇒ (1,056)^n = 2,136384 ⇒ n = ln(2,136384)/ln(1,056) ≈ **14 annuités**.
4. V0 = 8 400·[1 − (1,045)^(−10)] ÷ 0,045. (1,045)^(−10) ≈ 0,643928 ⇒ V0 ≈ 8 400 × 7,912718 ≈ **66 467 F**.
5. 16 versements en début d'année (1965→1980), capital au 31/12/1980 : Vn = a·[(1 + i)^n − 1] ÷ i × (1 + i) = 18 800·[(1,08)^16 − 1] ÷ 0,08 × 1,08. (1,08)^16 ≈ 3,425943 ⇒ ≈ 18 800 × 30,324288 × 1,08 ≈ **615 700 F**.
6. Comparer les valeurs actuelles au taux 8 % : offre 1 = 400 000 ; offre 2 = 600 000 (si « 600 000 pendant 5 ans » = 600 000 au total, préciser la périodicité) ; offre 3 = annuités de début de période 50 000·[1 − (1,08)^(−15)] ÷ 0,08 × 1,08 ≈ 50 000 × 8,559479 × 1,08 ≈ **462 212 F**. Retenir l'offre de plus grande valeur actuelle pour le vendeur. ⚠️ préciser la nature exacte de l'offre 2 (annuités ou somme globale) d'après la copie.
7. (1) a = 8 000 000 × 0,059 ÷ [1 − (1,059)^(−20)]. (1,059)^(−20) ≈ 0,317 ⇒ a ≈ 472 000 ÷ 0,683 ≈ **691 000 F**.
   (2) a) Valeur actuelle de la recette : 30 000·(1,085)^(−5) ≈ 30 000 × 0,663 ≈ 19 890 < 20 000 ⇒ investissement **non opportun** à 8,5 %. b) Équivalence : 20 000 = 30 000·(1 + i)^(−5) ⇒ (1 + i)^5 = 1,5 ⇒ i = 1,5^(1/5) − 1 ≈ **8,45 %**.`,
}

// ── TD Prof. Soom — escompte à intérêts composés et équivalence (T.G) ────────────────────
const escompte = {
  title: 'Test — TD (T.G) — Escompte à intérêts composés et équivalence des effets (7 exercices)',
  statement: `**TD de mathématiques financières (T.G) — Escompte à intérêts composés et équivalence des capitaux (ou effets) — Prof. Soom Félicien Ibouanga.**
1. Au taux 5,5 %, valeur actuelle et escompte à intérêts composés d'une somme payable dans 3 ans, valeur nominale 90 000.
2. Somme payable dans 8 ans, valeur nominale 110 000 : escompte à intérêts composés et valeur d'origine au taux 4 %.
3. Valeur nominale d'un effet payable dans 20 ans remplaçant équitablement, à 4 %, un effet de 4 000 F payable dans 10 ans.
4. Un débiteur doit 10 000 F dans 3 ans, 15 000 F dans 5 ans, 25 000 F dans 7 ans ; il se libère par un règlement unique dans 6 ans au taux 6 %. Montant ?
5. Remplacer 4 000 F (dans 4 ans) et 7 000 F (dans 6 ans) par 2 versements d'égale valeur nominale dans 2 et 4 ans, au taux 5 %. Montant ?
6. Remplacer 40 000 F (dans 4 ans) et 60 000 F (dans 2 ans) par un effet unique de 110 000 F à 5 %. Échéance commune ?
7. Remplacer 40 000 F (dans 4 ans) et 60 000 F (dans 2 ans) par un seul effet. Date de l'échéance moyenne au taux 5 %.`,
  solution: `Rappels (intérêts composés, taux i) : valeur actuelle V0 = Vn·(1 + i)^(−n) ; escompte E = Vn − V0. L'équivalence s'écrit en actualisant tous les effets à une même date.
1. V0 = 90 000·(1,055)^(−3) ≈ 90 000 × 0,851614 ≈ **76 645 F** ; E = 90 000 − 76 645 ≈ **13 355 F**.
2. V0 = 110 000·(1,04)^(−8) ≈ 110 000 × 0,730690 ≈ **80 376 F** ; E ≈ **29 624 F**.
3. Équivalence à aujourd'hui : X·(1,04)^(−20) = 4 000·(1,04)^(−10) ⇒ X = 4 000·(1,04)^10 ≈ 4 000 × 1,480244 ≈ **5 921 F**.
4. Règlement unique R dans 6 ans : R·(1,06)^(−6) = 10 000·(1,06)^(−3) + 15 000·(1,06)^(−5) + 25 000·(1,06)^(−7). Calculer le membre de droite puis R = [·]·(1,06)^6. (Méthode : actualiser à t = 0, capitaliser 6 ans.)
5. Deux versements égaux x (dans 2 et 4 ans) : x·(1,05)^(−2) + x·(1,05)^(−4) = 4 000·(1,05)^(−4) + 7 000·(1,05)^(−6) ⇒ x = [membre de droite] ÷ [(1,05)^(−2) + (1,05)^(−4)].
6. Échéance commune n de l'effet unique 110 000 : 110 000·(1,05)^(−n) = 40 000·(1,05)^(−4) + 60 000·(1,05)^(−2). Isoler (1,05)^(−n), puis n = −ln[·]/ln(1,05).
7. Échéance moyenne : la valeur nominale de l'effet unique est la somme des nominaux (40 000 + 60 000 = 100 000) ; 100 000·(1,05)^(−n) = 40 000·(1,05)^(−4) + 60 000·(1,05)^(−2) ⇒ (1,05)^(−n) = [·]/100 000 ⇒ n par logarithme.`,
}

export const BLOCS = [
  { subject: SUBJECT, match: MATCH, levels: GG, chapterTitle: CHAPTER, description: DESC, exercises: recueil },
  { subject: SUBJECT, match: MATCH, levels: GG, chapterTitle: CHAPTER, description: DESC, exercises: [progressions, annuites, escompte] },
]
