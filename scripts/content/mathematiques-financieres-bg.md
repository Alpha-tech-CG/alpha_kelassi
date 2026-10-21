# Mathématiques financières — Terminale BG

Source : cahier de cours manuscrit (année 2024-2025), 14 pages photographiées.
Programme annoncé en tête du cahier : I. Les intérêts simples — II. Les intérêts composés —
III. Escompte à intérêts composés — IV. Les annuités. Le cahier ne couvre que le chapitre I.

## Chapitre 1 — Les intérêts simples

### I. Définition

Quand une personne (le prêteur) prête un capital à une autre personne (l'emprunteur), il est habituellement convenu que l'emprunteur rembourse à l'échéance non seulement le montant du prêt, mais aussi un supplément appelé **intérêt** du prêt.

L'intérêt est donc la **rémunération du capital** placé ou prêté. Il est fonction :

- du capital prêté ou placé ;
- du taux d'intérêt convenu entre le prêteur et l'emprunteur ;
- de la durée du prêt.

Le **taux d'intérêt** est le rapport entre l'intérêt obtenu pendant une unité de temps et le capital placé ou prêté. Ce rapport s'exprime au choix :

- par une fraction : $\dfrac{5}{100}$ ;
- par un nombre décimal : 0,05 ;
- par un pourcentage : 5 %.

L'unité de temps choisie pour définir le taux est habituellement l'année ; on peut aussi utiliser le semestre, le trimestre ou une autre période.

### II. Formule des intérêts simples

L'intérêt simple est proportionnel :

- à la somme placée ou prêtée ;
- au taux d'intérêt ;
- à la durée du placement.

Si $I$ est l'intérêt rapporté par un capital $C$ placé ou prêté au taux $t$ (en pourcentage) pendant une durée $n$, cette proportionnalité se traduit par les formules suivantes :

| Durée $n$ exprimée en | Formule |
| --- | --- |
| années | $I = \dfrac{C \times t \times n}{100}$ |
| semestres | $I = \dfrac{C \times t \times n}{200}$ |
| mois | $I = \dfrac{C \times t \times n}{1\,200}$ |
| quinzaines | $I = \dfrac{C \times t \times n}{2\,400}$ |
| jours | $I = \dfrac{C \times t \times n}{36\,000}$ |

**Remarque.** Par convention, l'année commerciale compte **360 jours**. En revanche, lorsqu'on décompte les jours d'un placement, on compte chaque mois pour son nombre réel de jours, comme dans l'année civile : octobre a 31 jours, novembre 30 jours, décembre 31 jours. On ne compte pas le jour du placement, mais on compte celui du remboursement.

### III. Autres calculs sur l'intérêt simple

De ces formules, on peut tirer par transformation les expressions permettant de calculer $C$, $t$ et $n$. Avec $n$ en années :

$I = \dfrac{C \times t \times n}{100}$, donc $100\,I = C \times t \times n$, d'où :

$C = \dfrac{100\,I}{t \times n}$ ; $t = \dfrac{100\,I}{C \times n}$ ; $n = \dfrac{100\,I}{C \times t}$

Pour les autres unités de temps, il suffit de remplacer 100 par le diviseur correspondant :

| Calcul | Jours | Quinzaines | Mois | Semestres | Années |
| --- | --- | --- | --- | --- | --- |
| Capital $C$ | $\dfrac{36\,000\,I}{t \times n}$ | $\dfrac{2\,400\,I}{t \times n}$ | $\dfrac{1\,200\,I}{t \times n}$ | $\dfrac{200\,I}{t \times n}$ | $\dfrac{100\,I}{t \times n}$ |
| Taux $t$ | $\dfrac{36\,000\,I}{C \times n}$ | $\dfrac{2\,400\,I}{C \times n}$ | $\dfrac{1\,200\,I}{C \times n}$ | $\dfrac{200\,I}{C \times n}$ | $\dfrac{100\,I}{C \times n}$ |
| Durée $n$ | $\dfrac{36\,000\,I}{C \times t}$ | $\dfrac{2\,400\,I}{C \times t}$ | $\dfrac{1\,200\,I}{C \times t}$ | $\dfrac{200\,I}{C \times t}$ | $\dfrac{100\,I}{C \times t}$ |

### IV. La valeur acquise (VA)

La valeur acquise par un capital placé pendant un certain temps est la valeur de ce capital augmenté de ses intérêts à la fin de la période de placement.

$VA = C + I$

Avec $I = \dfrac{C \times t \times n}{100}$, on obtient $VA = C + \dfrac{C \times t \times n}{100}$, soit :

$VA = C \left(1 + \dfrac{t \times n}{100}\right)$ ($n$ en années)

$VA = C \left(1 + \dfrac{t \times n}{1\,200}\right)$ ($n$ en mois)

$VA = C \left(1 + \dfrac{t \times n}{36\,000}\right)$ ($n$ en jours)

### V. La valeur actuelle (Va)

La valeur actuelle est la valeur, aujourd'hui, d'une somme disponible dans le futur. Elle se calcule par la formule suivante :

$V_a = VA - I$

### Série d'exercices

#### Exercice 1

On place un capital de 8 000 F pendant 6 ans au taux de 11 % l'an. Calculer l'intérêt et la valeur acquise.

**Solution**

Données : $C = 8\,000$ ; $n = 6$ ans ; $t = 11\ \%$.

$I = \dfrac{C \times t \times n}{100} = \dfrac{8\,000 \times 11 \times 6}{100} = 5\,280$

$VA = C + I = 8\,000 + 5\,280 = 13\,280$

L'intérêt est de 5 280 F et la valeur acquise de 13 280 F.

#### Exercice 2

Calculer l'intérêt fourni par le placement de 28 000 F à 9 %, du 13 septembre au 27 juillet de l'année suivante.

**Solution**

Données : $C = 28\,000$ ; $t = 9\ \%$ ; durée en jours.

Faisons le décompte des jours :

| Mois | Jours |
| --- | --- |
| Septembre (30 − 13) | 17 |
| Octobre | 31 |
| Novembre | 30 |
| Décembre | 31 |
| Janvier | 31 |
| Février | 28 |
| Mars | 31 |
| Avril | 30 |
| Mai | 31 |
| Juin | 30 |
| Juillet | 27 |
| **Total** | **$n$ = 317 jours** |

$I = \dfrac{C \times t \times n}{36\,000} = \dfrac{28\,000 \times 9 \times 317}{36\,000} = 2\,219$

L'intérêt est de 2 219 F.

#### Exercice 3

Un capital de 8 400 F a produit, du 16 mai au 25 septembre, un intérêt de 231 F. Calculer le taux de placement.

**Solution**

Données : $C = 8\,400$ ; $I = 231$.

Décompte des jours :

| Mois | Jours |
| --- | --- |
| Mai (31 − 16) | 15 |
| Juin | 30 |
| Juillet | 31 |
| Août | 31 |
| Septembre | 25 |
| **Total** | **$n$ = 132 jours** |

$t = \dfrac{36\,000 \times I}{C \times n} = \dfrac{36\,000 \times 231}{8\,400 \times 132} = \dfrac{8\,316\,000}{1\,108\,800} = 7{,}5$

Le taux de placement est de 7,5 %.

#### Exercice 4

Un capital de 7 200 F, prêté à 8 % le 08 juin, a acquis à la fin du prêt une valeur de 7 288 F. Déterminer à quelle date le prêt a été remboursé.

**Solution**

Données : $C = 7\,200$ ; $VA = 7\,288$ ; $t = 8\ \%$.

$VA = C + I$, donc $I = VA - C = 7\,288 - 7\,200 = 88$

$n = \dfrac{36\,000 \times I}{C \times t} = \dfrac{36\,000 \times 88}{7\,200 \times 8} = \dfrac{3\,168\,000}{57\,600} = 55 \text{ jours}$

Décompte à partir du 08 juin : il reste 30 − 8 = 22 jours en juin, puis 31 jours en juillet, soit 53 jours ; il manque 2 jours, pris en août.

Le prêt a été remboursé le **02 août**.

#### Exercice 5

Deux capitaux dont le total est de 20 000 F sont placés, le premier à $t\ \%$ et le second à $(t + 1)\ \%$. Le revenu annuel du premier capital est de 1 080 F et celui du second de 800 F. Calculer les deux capitaux et les deux taux.

**Solution**

Soit $C_1$ et $C_2$ les deux capitaux. Pour un an :

$\dfrac{C_1 \times t}{100} = 1\,080$, donc $C_1 = \dfrac{108\,000}{t}$

$\dfrac{C_2 \times (t + 1)}{100} = 800$, donc $C_2 = \dfrac{80\,000}{t + 1}$

Or $C_1 + C_2 = 20\,000$ :

$\dfrac{108\,000}{t} + \dfrac{80\,000}{t + 1} = 20\,000$

En multipliant les deux membres par $t\,(t + 1)$ et en divisant par 1 000 :

$108\,(t + 1) + 80\,t = 20\,t\,(t + 1)$

$188\,t + 108 = 20\,t^2 + 20\,t$

$20\,t^2 - 168\,t - 108 = 0$, soit $5\,t^2 - 42\,t - 27 = 0$

$\Delta = (-42)^2 - 4 \times 5 \times (-27) = 1\,764 + 540 = 2\,304 = 48^2$

$t = \dfrac{42 + 48}{10} = 9$ (l'autre racine, négative, est à rejeter)

Les taux sont donc 9 % et 10 %, et les capitaux :

$C_1 = \dfrac{108\,000}{9} = 12\,000$ ; $C_2 = \dfrac{80\,000}{10} = 8\,000$

Vérification : $12\,000 + 8\,000 = 20\,000$.
