# Statistiques — Terminale BG — compléments tirés du cahier de cours

Source : cahier de cours manuscrit, 19 pages photographiées sur les indices composés.
Les chapitres I (Les indices statistiques) et II (Notions de probabilité) de la matière viennent du
polycopié METPFQE et couvrent déjà ces notions ; ce chapitre apporte le formulaire du cahier et ses
applications résolues. Les 8 pages du cahier sur les probabilités (analyse combinatoire, univers,
épreuve, événement) n'ajoutent rien au chapitre II existant et ne sont pas reprises.

## Chapitre 3 — Les indices composés : formulaire et applications

### 1. Définition et propriétés

On appelle **indices composés**, ou synthétiques, les indices qui font intervenir plusieurs grandeurs caractérisant l'évolution des phénomènes économiques, financiers et sociaux. On utilise le plus souvent les quantités et les prix.

Les indices composés obéissent aux mêmes propriétés que les indices simples : identité, réversibilité et transférabilité.

Ils sont déterminés selon deux méthodes :

- les **indices des moyennes arithmétiques** (IMA) ;
- la **moyenne arithmétique des indices** (MAI).

Dans toutes les formules, $G$ désigne la variable étudiée (prix ou quantité), $t$ la période courante, $0$ la période de base, $K$ le coefficient de pondération et $n$ le nombre d'articles ou de produits. Les indices sont exprimés en base 100.

### 2. Les indices des moyennes arithmétiques (IMA)

On distingue deux catégories.

**L'indice des moyennes arithmétiques simples (IMAS)**

$I_{t/0} = \dfrac{\sum G_t}{\sum G_0} \times 100$

**L'indice des moyennes arithmétiques pondérées (IMAP)**

$I_{t/0} = \dfrac{\sum G_t \times K}{\sum G_0 \times K} \times 100$

#### Application 1

Soit l'évolution des prix de trois céréales au cours de trois années :

| Céréales | 2009 | 2011 | 2015 |
| --- | --- | --- | --- |
| Mil | 100 | 800 | 1 000 |
| Sorgho | 300 | 400 | 1 400 |
| Blé | 60 | 150 | 600 |

1. Calculer les IMAS des années 2011 et 2015 par rapport à l'époque de base 2009.
2. On donne les pondérations suivantes : mil = 80 ; sorgho = 50 ; blé = 40. Calculer les IMAP des années 2011 et 2015.

**Solution**

*1) Les IMAS, base 2009.*

$I_{11/09} = \dfrac{800 + 400 + 150}{100 + 300 + 60} \times 100 = \dfrac{1\,350}{460} \times 100 = 293{,}48$

$I_{15/09} = \dfrac{1\,000 + 1\,400 + 600}{460} \times 100 = \dfrac{3\,000}{460} \times 100 = 652{,}17$

*2) Les IMAP, base 2009.*

$I_{11/09} = \dfrac{(800 \times 80) + (400 \times 50) + (150 \times 40)}{(100 \times 80) + (300 \times 50) + (60 \times 40)} \times 100 = \dfrac{64\,000 + 20\,000 + 6\,000}{8\,000 + 15\,000 + 2\,400} \times 100 = \dfrac{90\,000}{25\,400} \times 100 = 354{,}33$

$I_{15/09} = \dfrac{(1\,000 \times 80) + (1\,400 \times 50) + (600 \times 40)}{25\,400} \times 100 = \dfrac{174\,000}{25\,400} \times 100 = 685{,}04$

### 3. La moyenne arithmétique des indices (MAI)

On distingue deux catégories.

**La moyenne arithmétique des indices simples (MAIS)**

$I_{t/0} = \dfrac{\sum \dfrac{G_t}{G_0}}{n} \times 100$

**La moyenne arithmétique pondérée des indices simples (MAPIS)**

$I_{t/0} = \dfrac{\sum \dfrac{G_t}{G_0} \times K}{\sum K} \times 100$

#### Application 2

Le tableau suivant retrace les prix de différents produits à des périodes différentes :

| Produits | 2012 | 2013 | 2014 | Pondération |
| --- | --- | --- | --- | --- |
| Café | 300 | 420 | 500 | 4 |
| Sucre | 250 | 300 | 440 | 8 |
| Lait | 450 | 500 | 600 | 3 |

En considérant 2012 comme base, calculer : a) la MAIS des années 2013 et 2014 ; b) la MAPIS des années 2013 et 2014.

**Solution**

*a) La MAIS.*

$I_{13/12} = \dfrac{\dfrac{420}{300} + \dfrac{300}{250} + \dfrac{500}{450}}{3} \times 100 = \dfrac{1{,}4 + 1{,}2 + 1{,}1111}{3} \times 100 = 123{,}70$

$I_{14/12} = \dfrac{\dfrac{500}{300} + \dfrac{440}{250} + \dfrac{600}{450}}{3} \times 100 = \dfrac{1{,}6667 + 1{,}76 + 1{,}3333}{3} \times 100 = 158{,}67$

*b) La MAPIS.*

$I_{13/12} = \dfrac{(1{,}4 \times 4) + (1{,}2 \times 8) + (1{,}1111 \times 3)}{4 + 8 + 3} \times 100 = \dfrac{5{,}6 + 9{,}6 + 3{,}3333}{15} \times 100 = 123{,}56$

$I_{14/12} = \dfrac{(1{,}6667 \times 4) + (1{,}76 \times 8) + (1{,}3333 \times 3)}{15} \times 100 = \dfrac{6{,}6667 + 14{,}08 + 4}{15} \times 100 = 164{,}98$

### 4. Les autres indices synthétiques

Certains économistes ont mis en évidence d'autres indices synthétiques, parmi lesquels les indices de Laspeyres, de Paasche et de Fisher, l'indice de la valeur globale, l'indice du pouvoir d'achat et le taux de variation. On note $p$ les prix et $q$ les quantités.

**Les indices de Laspeyres (L)** : les pondérations sont celles de la période de base.

- Laspeyres des prix : $L_p = \dfrac{\sum p_t\,q_0}{\sum p_0\,q_0} \times 100$
- Laspeyres des quantités : $L_q = \dfrac{\sum q_t\,p_0}{\sum q_0\,p_0} \times 100$

**Les indices de Paasche (P)** : les pondérations sont celles de la période courante.

- Paasche des prix : $P_p = \dfrac{\sum p_t\,q_t}{\sum p_0\,q_t} \times 100$
- Paasche des quantités : $P_q = \dfrac{\sum q_t\,p_t}{\sum q_0\,p_t} \times 100$

**L'indice de Fisher (F)** : c'est la moyenne géométrique des indices de Laspeyres et de Paasche.

- Fisher des prix : $F_p = \sqrt{L_p \times P_p}$
- Fisher des quantités : $F_q = \sqrt{L_q \times P_q}$

**L'indice de la valeur globale (IVG)**

$IVG = \dfrac{\sum p_t\,q_t}{\sum p_0\,q_0} \times 100$

C'est aussi le produit du Laspeyres des prix par le Paasche des quantités, et inversement :

$100 \times IVG = L_p \times P_q = L_q \times P_p$

**L'indice du pouvoir d'achat (IPA)** : c'est le rapport de l'indice du revenu à l'indice des prix.

$IPA = \dfrac{I(\text{revenu})}{I(\text{prix})} \times 100$

**Le taux de variation (V)** : c'est le rapport de la variation du prix au prix initial.

$V_{t/0} = \dfrac{p_t - p_0}{p_0} \times 100$

#### Application 3

Les prix et les quantités de trois produits, pour deux années, sont enregistrés dans le tableau suivant :

| Produits | Prix 2014 (base) | Quantité 2014 | Prix 2016 | Quantité 2016 |
| --- | --- | --- | --- | --- |
| A | 20 | 35 | 38 | 50 |
| B | 30 | 40 | 35 | 75 |
| C | 45 | 48 | 60 | 80 |

Calculer : a) les indices de Laspeyres (prix et quantités) ; b) les indices de Paasche (prix et quantités) ; c) les indices de Fisher (prix et quantités) ; d) l'indice de la valeur globale ; e) le taux de variation du prix de chaque produit.

**Solution**

Calculs préliminaires :

| Produits | $p_0\,q_0$ | $p_t\,q_0$ | $p_0\,q_t$ | $p_t\,q_t$ |
| --- | --- | --- | --- | --- |
| A | 700 | 1 330 | 1 000 | 1 900 |
| B | 1 200 | 1 400 | 2 250 | 2 625 |
| C | 2 160 | 2 880 | 3 600 | 4 800 |
| **Total** | **4 060** | **5 610** | **6 850** | **9 325** |

*a) Laspeyres.*

$L_p = \dfrac{5\,610}{4\,060} \times 100 = 138{,}18$ ; $L_q = \dfrac{6\,850}{4\,060} \times 100 = 168{,}72$

*b) Paasche.*

$P_p = \dfrac{9\,325}{6\,850} \times 100 = 136{,}13$ ; $P_q = \dfrac{9\,325}{5\,610} \times 100 = 166{,}22$

*c) Fisher.*

$F_p = \sqrt{138{,}18 \times 136{,}13} = 137{,}15$ ; $F_q = \sqrt{168{,}72 \times 166{,}22} = 167{,}47$

*d) Valeur globale.*

$IVG = \dfrac{9\,325}{4\,060} \times 100 = 229{,}68$

Vérification : $\dfrac{L_p \times P_q}{100} = \dfrac{138{,}18 \times 166{,}22}{100} = 229{,}68$.

*e) Taux de variation des prix.*

$V_A = \dfrac{38 - 20}{20} \times 100 = 90\ \%$ ; $V_B = \dfrac{35 - 30}{30} \times 100 = 16{,}67\ \%$ ; $V_C = \dfrac{60 - 45}{45} \times 100 = 33{,}33\ \%$
