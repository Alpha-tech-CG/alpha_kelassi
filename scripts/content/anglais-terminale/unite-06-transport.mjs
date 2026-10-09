/**
 * Anglais Terminale A, C et D — Unité 6 : Transport (thème 6 du programme INRAP).
 *
 * Même gabarit que les unités 1 à 5. Notion de grammaire unique : parler du futur
 * avec will et be going to (fiche INRAP). Le conditionnel de type 1 (If + présent,
 * will), aussi cité, est présenté en prolongement car il repose sur will. Les
 * comparatifs, également cités, ont été traités à l'unité 4 et sont réemployés.
 */

export const unit = {
  chapterTitle: 'THEME 6 — TRANSPORT / LE TRANSPORT',
  description: 'ANGLAIS · UNITÉ 6 — Transport · thème 6 du programme INRAP',
}

export const lessons = [
  {
    type: 'cours',
    title: 'Unit 6 — Introduction : Transport',
    content: `## Transport — Le transport

**Niveau :** Terminale A, C et D · **Durée conseillée :** 4 séances de 45 à 90 minutes · **Programme INRAP :** thème 6

### Pourquoi ce thème ?

Le matin, à Brazzaville ou à Pointe-Noire, il faut parfois une heure pour traverser la ville en bus ou en taxi. Entre les deux grandes villes, on peut prendre le train du Chemin de fer Congo-Océan, la route nationale ou l'avion, et sur le fleuve circulent pirogues et bateaux. Le transport fait vivre l'économie, mais il pose aussi des problèmes : embouteillages, accidents, pollution, coût. Dans cette unité, tu vas apprendre à **parler de tes déplacements**, à **comparer les moyens de transport** et surtout à **parler de l'avenir** : tes projets de voyage et les villes de demain.

### Objectifs — À la fin de l'unité, tu pourras :

- **utiliser** le vocabulaire des transports, du voyage et de la circulation (≈ 40 mots) ;
- **parler du futur** avec **will** (prédiction, décision immédiate) et **be going to** (projet, évidence) ;
- **comprendre** une conversation pour organiser un voyage et un article sur les transports urbains en Afrique ;
- **organiser** un voyage et **débattre** à l'oral ;
- **écrire** un rapport de 150 mots avec des propositions.

### Le parcours de l'unité

| Étape | Ce que tu fais | Compétence |
|---|---|---|
| 1. Vocabulary | Moyens de transport, voyage, circulation | Lexique |
| 2. Grammar | Le futur : will et be going to | Langue |
| 3. Listening | « Train or bus to Pointe-Noire? » | Comprendre à l'oral |
| 4. Reading | « African cities on the move » | Comprendre à l'écrit |
| 5. Speaking | Projets, prédictions, débat voiture / transports en commun | S'exprimer à l'oral |
| 6. Writing | Un rapport : améliorer les transports de ta ville | S'exprimer à l'écrit |
| 7. Exercises | Exercices corrigés (bouton en bas de page) | Entraînement |
| 8. Test | QCM de fin d'unité, 20 questions | Évaluation |

### Pour te lancer — Warm-up

- How do you go to school? How long does it take?
- What is the best way to travel from Brazzaville to Pointe-Noire? Why?
- How will people travel in 2050, in your opinion?`,
  },
  {
    type: 'cours',
    title: 'Vocabulary — Means of transport, travel and traffic',
    content: `## Vocabulary — Le vocabulaire de l'unité

Apprends ces mots par groupes de 10 et lis les exemples à voix haute.

### 1. Means of transport — Les moyens de transport

| English | Prononciation | Français | Catégorie | Example |
|---|---|---|---|---|
| means of transport | /miːnz/ | moyen(s) de transport | nom | The bus is the cheapest means of transport. |
| public transport | /ˈpʌblɪk ˈtrænspɔːt/ | les transports en commun | nom | Public transport is not reliable here. |
| a car | /kɑː/ | une voiture | nom | My uncle drives an old car. |
| a bus / a minibus | /bʌs/ | un bus / un minibus | nom | The minibus was full. |
| a taxi | /ˈtæksi/ | un taxi | nom | Taxis in Brazzaville are green. |
| a motorbike / a motorbike taxi | /ˈməʊtəbaɪk/ | une moto / un moto-taxi | nom | Motorbike taxis are fast but dangerous. |
| a lorry / a truck | /ˈlɒri/ /trʌk/ | un camion | nom | Lorries carry timber to the port. |
| a train / the railway | /treɪn/ /ˈreɪlweɪ/ | un train / le chemin de fer | nom | The railway links Brazzaville and Pointe-Noire. |
| a plane / an airport | /pleɪn/ /ˈeəpɔːt/ | un avion / un aéroport | nom | The plane takes less than an hour. |
| a boat / a canoe | /bəʊt/ /kəˈnuː/ | un bateau / une pirogue | nom | Fishermen use canoes on the river. |
| a ferry | /ˈferi/ | un bac, un ferry | nom | The ferry crosses the river to Kinshasa. |
| a bicycle / on foot | /ˈbaɪsɪkl/ /ɒn fʊt/ | un vélo / à pied | nom | Many pupils go to school on foot. |

### 2. Travelling — Voyager

| English | Prononciation | Français | Catégorie | Example |
|---|---|---|---|---|
| a journey | /ˈdʒɜːni/ | un trajet, un voyage | nom | The journey takes ten hours. |
| a trip | /trɪp/ | une excursion, un court voyage | nom | We went on a school trip. |
| a ticket / a fare | /ˈtɪkɪt/ /feə/ | un billet / le prix du trajet | nom | The bus fare has gone up. |
| a passenger | /ˈpæsɪndʒə/ | un passager | nom | The bus carries forty passengers. |
| a driver | /ˈdraɪvə/ | un conducteur, un chauffeur | nom | The driver stopped suddenly. |
| a station / a bus stop | /ˈsteɪʃn/ | une gare / un arrêt de bus | nom | Wait for me at the bus stop. |
| to get on / to get off | /ɡet ɒn/ /ɡet ɒf/ | monter / descendre (d'un véhicule) | verbe | Get off at the next stop. |
| to catch / to miss | /kætʃ/ /mɪs/ | attraper / rater (un bus, un train) | verbe | Hurry, or we'll miss the train! |
| to commute | /kəˈmjuːt/ | faire le trajet domicile-travail | verbe | He commutes two hours a day. |
| luggage | /ˈlʌɡɪdʒ/ | les bagages | nom | Don't forget your luggage. |
| a delay / delayed | /dɪˈleɪ/ | un retard / retardé | nom / adj | The train was delayed by two hours. |
| on time | /ɒn taɪm/ | à l'heure | expression | The plane arrived on time. |

### 3. Traffic and roads — Circulation et routes

| English | Français | Example |
|---|---|---|
| traffic / a traffic jam | la circulation / un embouteillage | We were stuck in a traffic jam. |
| rush hour | l'heure de pointe | Avoid the city centre at rush hour. |
| a road / a motorway | une route / une autoroute | The new road is much safer. |
| a crossroads / traffic lights | un carrefour / des feux | Turn left at the traffic lights. |
| a pothole | un nid-de-poule | The road is full of potholes. |
| a road accident | un accident de la route | Speed causes many road accidents. |
| speed / to speed | la vitesse / rouler trop vite | Speeding is dangerous. |
| a seat belt / a helmet | une ceinture / un casque | Always wear a helmet on a motorbike. |
| fuel / petrol | le carburant / l'essence | Fuel is expensive this year. |
| pollution / exhaust fumes | la pollution / les gaz d'échappement | Old cars produce exhaust fumes. |

### Mots à ne pas confondre

- **travel** (voyager, le voyage en général, indénombrable) ; **a journey** (un trajet précis) ; **a trip** (un court voyage, aller-retour). On ne dit pas « a travel ».
- **a car** (une voiture) ≠ **a coach** (un autocar) ≠ **a carriage** (un wagon de voyageurs).
- **luggage** est indénombrable : two pieces of luggage, jamais « two luggages ».
- **by** + moyen de transport : by bus, by train, by plane… mais **on foot** (à pied).

### Mémorisation

Classe tous les moyens de transport en trois colonnes : ROAD, RAIL, WATER, AIR. Puis dis pour chacun un avantage et un inconvénient : The plane is faster but more expensive.`,
  },
  {
    type: 'cours',
    title: 'Grammar — Talking about the future: will and be going to',
    content: `## Grammar — Parler du futur : will et be going to

L'anglais n'a pas un seul « futur ». Pour parler de l'avenir, on choisit selon **ce qu'on veut dire** : une prédiction, une décision prise sur le moment, un projet déjà décidé, ou une chose qu'on voit arriver.

### 1. Observe — Observe d'abord

Phrases tirées de la conversation et du texte de l'unité :

- We**'re going to** visit my grandparents in Pointe-Noire. (projet décidé)
- Look at that queue! We**'re going to** miss the bus. (on le voit arriver)
- OK, I**'ll** buy the tickets online. (décision prise sur le moment)
- I think the train **will** be more comfortable. (opinion, prédiction)
- By 2050, Africa's cities **will** have twice as many people. (prédiction)

### 2. Will + base verbale

| Forme | Construction | Exemple |
|---|---|---|
| Affirmative | sujet + **will** ('ll) + base verbale | The road **will** be ready next year. |
| Négative | **won't** (will not) + base verbale | The bus **won't** come today. |
| Interrogative | **Will** + sujet + base verbale ? | **Will** the train be on time? |

**Emplois de will :**
- **prédiction, opinion** sur l'avenir (souvent avec I think, probably, maybe, I'm sure) : I think cars **will** be electric.
- **décision prise au moment où l'on parle** : The phone is ringing. — I**'ll** answer it.
- **promesse, offre** : I**'ll** help you with your luggage.

### 3. Be going to + base verbale

| Forme | Construction | Exemple |
|---|---|---|
| Affirmative | sujet + **am / is / are going to** + base verbale | They **are going to** build a bridge. |
| Négative | **am not / isn't / aren't going to** | I**'m not going to** take the motorbike. |
| Interrogative | **Am / Is / Are** + sujet + **going to** + base ? | **Are** you **going to** travel this summer? |

**Emplois de be going to :**
- **projet, intention déjà décidés** : I'**m going to** study engineering next year.
- **prédiction fondée sur une évidence présente** : Look at those clouds, it**'s going to** rain.

### 4. Will ou be going to ?

| Will | Be going to |
|---|---|
| Décision **sur le moment** : Oh, the taxi is here. I'll go. | Décision **déjà prise** : I'm going to take the 7 o'clock train. (billet acheté) |
| Prédiction **d'opinion** : I think the train will be late. | Prédiction **visible** : The driver is too fast! We're going to have an accident! |

### 5. Cinq exemples sur le thème

1. The government **is going to** repair the road next month.
2. I think electric motorbikes **will** be common in ten years.
3. Hurry up! We**'re going to** miss the train.
4. Don't worry, I**'ll** carry your bag.
5. **Will** there **be** a tramway in Brazzaville one day?

### 6. Erreurs fréquentes

| Faux | Correct | Pourquoi |
|---|---|---|
| I will to travel tomorrow. | I will travel tomorrow. | will + base verbale sans to |
| She wills come. | She will come. | will est invariable |
| I going to take the bus. | I'm going to take the bus. | ne pas oublier be |
| They are going to built a bridge. | They are going to build a bridge. | going to + base verbale |
| When I will arrive, I'll call you. | When I arrive, I'll call you. | après when / if → présent |
| I won't to drive. | I won't drive. | won't + base verbale |

### Pour aller plus loin : le conditionnel de type 1

Pour parler d'une **condition probable** et de sa conséquence future : **If + présent, … will + base verbale.**

- **If** the city **builds** more bus lanes, traffic **will decrease**.
- **If** you **don't wear** a helmet, you **will be** in danger.

Attention : jamais will après if dans la condition (If it will rain… est faux → If it rains…). Même règle après when, as soon as, before, after.

### À toi

Les exercices de grammaire corrigés sont dans le bouton « Exercices » en bas de page (exercices 1 à 3).`,
  },
  {
    type: 'cours',
    title: 'Listening — Train or bus to Pointe-Noire?',
    content: `## Listening — Une conversation

**Situation :** C'est bientôt les vacances. À Brazzaville, Christelle et son frère Junior préparent leur voyage chez leurs grands-parents à Pointe-Noire. Leur cousin Fabrice, qui a fait le trajet le mois dernier, leur donne des conseils.

### Avant d'écouter

1. Mots-clés : the coach station (la gare routière), a sleeper / a berth (une couchette), comfortable (confortable), the scenery (le paysage), to book (réserver).
2. Devine : quels moyens de transport peuvent-ils choisir ? Avec quels avantages ?

### Comment travailler

L'enregistrement audio sera bientôt disponible dans l'application. En attendant :

- **Première écoute :** fais-toi lire la conversation sans la regarder ; réponds aux questions globales (exercice 4, partie A).
- **Deuxième écoute :** relis le texte, puis réponds aux questions de détail.
- **Troisième écoute :** lis-la à trois en jouant les rôles.

### Transcript — Transcription

**Christelle:** Fabrice, we're going to visit Grandma and Grandpa in Pointe-Noire during the holidays. How did you travel last month?

**Fabrice:** I took the bus. There are several companies at the coach station. The road is good now, and the journey takes about eight or nine hours.

**Junior:** Eight hours! I think I'll be bored.

**Fabrice:** It's long, but it's not too expensive, and the buses leave every morning. The only problem is the driver: mine was going really fast. At one point I thought, "We're going to have an accident!"

**Christelle:** That's what Mum is afraid of. What about the train?

**Fabrice:** The train is slower and less frequent, but you can walk around, and the scenery is beautiful: the Mayombe forest, the hills, the rivers. Some people say it's the most beautiful journey in Congo.

**Junior:** And the plane?

**Fabrice:** The plane takes less than an hour, but the ticket is much more expensive. With the money for two plane tickets, you could pay for four bus tickets.

**Christelle:** We don't have that much money. So it's the bus or the train.

**Junior:** I'd like to see the Mayombe forest. Let's take the train!

**Christelle:** OK, but the train doesn't run every day, so we're going to check the timetable first. And we need to book early, because it will be full during the holidays.

**Fabrice:** Good idea. And don't forget to take water and food. The journey will be long.

**Junior:** Don't worry, I'll pack sandwiches and bananas.

**Christelle:** And I'll call Grandma tonight to tell her when we're going to arrive.

**Fabrice:** Perfect. She'll be so happy to see you!

### Vocabulaire clé de la conversation

| English | Français |
|---|---|
| a coach station | une gare routière |
| bored | qui s'ennuie |
| at one point | à un moment donné |
| to walk around | se dégourdir les jambes |
| the scenery | le paysage |
| frequent | fréquent |
| a timetable | un horaire |
| to book | réserver |
| to pack | emballer, préparer (un sac) |

**Remarque :** relève les futurs : we're going to visit, we're going to check (projets décidés) ; we're going to have an accident (évidence) ; I'll be bored, it will be full (prédictions) ; I'll pack, I'll call (décisions prises sur le moment).

### Questions

Les questions de compréhension et leur corrigé sont dans l'**exercice 4**, en bas de page.`,
  },
  {
    type: 'cours',
    title: 'Reading — African cities on the move',
    content: `## Reading — Comprendre un texte

### Avant de lire — Skimming

Lis le titre et la première phrase de chaque paragraphe. Quel problème le texte décrit-il ? Quelles solutions présente-t-il ?

### African cities on the move

**1.** Every morning, millions of Africans begin their day in a traffic jam. In Lagos, Nairobi, Kinshasa or Brazzaville, workers can spend two or three hours a day travelling to work and back home. Roads are crowded with old cars, minibuses and motorbike taxis, and the air is full of exhaust fumes. Experts predict that the population of African cities will double in the next twenty-five years. If nothing changes, traffic will become even worse.

**2.** Some cities have already decided to act. In 2015, Addis Ababa, the capital of Ethiopia, opened a light railway, one of the first in sub-Saharan Africa. Dar es Salaam in Tanzania has built a system of rapid buses that run on their own lanes, so they don't get stuck in traffic. Passengers buy a card, wait at modern stations and travel much faster than before.

**3.** Two-wheelers are also changing. In Kigali, Nairobi and Kampala, young companies are replacing petrol motorbikes with electric ones. Riders recharge or exchange their batteries at small stations in the city. They pay less for energy, and they don't pollute the streets. Some engineers think that Africa will skip the age of petrol and go directly to electric transport, just as it skipped the landline telephone and went directly to the mobile phone.

**4.** However, building modern transport is expensive. A railway or a bus network costs millions of dollars, and many cities are already in debt. Moreover, millions of people earn their living from the informal transport sector: taxi drivers, minibus owners, motorbike riders. If the new systems take their jobs, there will be protests. That is why the best projects include these workers instead of excluding them.

**5.** The future of African cities is going to depend on choices that are made today. Clean, safe and affordable transport is not a luxury: it means more time for families, healthier air and more jobs. As a Tanzanian commuter said, "Before, I left home at five. Now I can have breakfast with my children."

(Texte rédigé pour ce cours, environ 360 mots.)

### Mots utiles du texte

| English | Français |
|---|---|
| on the move | en mouvement |
| crowded | encombré, bondé |
| to double | doubler |
| a light railway | un tramway, un métro léger |
| a lane | une voie |
| to get stuck | rester bloqué |
| two-wheelers | les deux-roues |
| to recharge | recharger |
| to skip | sauter (une étape) |
| a landline | un téléphone fixe |
| to earn one's living | gagner sa vie |
| affordable | abordable |

### Stratégie de lecture

1. **Skimming** : le texte suit le plan problème → solutions (rail, bus, électrique) → limites → conclusion.
2. **Scanning** : relève les villes et les pays cités et ce que chacun a fait.
3. **Repère le futur** : will double, will become, will skip, there will be, is going to depend : le texte mêle constat présent et prévisions.

### Questions

Les questions sont dans les **exercices 5 et 6**, en bas de page.`,
  },
  {
    type: 'cours',
    title: 'Speaking — Plans, predictions and debate',
    content: `## Speaking — S'exprimer à l'oral

### 1. Discussion questions — Questions de discussion

Réponds à voix haute en phrases complètes.

1. How do you usually travel in your town? What are the advantages and disadvantages?
2. What are you going to do during the next holidays? Where are you going to go?
3. How will people travel in Congo in 2050? Make three predictions.
4. Are motorbike taxis a solution or a danger?
5. What would make public transport more attractive?

### 2. Phrases modèles — Model sentences

| Pour… | Phrases |
|---|---|
| Parler de ses projets | I'm going to… / We're planning to… / Next week, I'm going to… |
| Prédire | I think… will… / In the future,… will probably… / I'm sure… won't… |
| Proposer, décider | I'll… / Let's… / Why don't we…? |
| Comparer | The train is slower but more comfortable than the bus. |
| Mettre une condition | If the city builds…, traffic will… |

### 3. Role-play — Au guichet de la gare

**Student A — a traveller.** Tu veux aller de Brazzaville à Pointe-Noire. Demande l'heure de départ, la durée du trajet, le prix, et réserve une place.

**Student B — the ticket seller.** Réponds avec des informations précises et propose des options (couchette, aller-retour…).

Phrases utiles : What time does the next train leave? / How long does the journey take? / How much is a return ticket? / I'll take a single ticket, please.

### 4. Predictions — Ma ville en 2050 (1 minute 30)

Décris ta ville en 2050 : transports, routes, énergie, pollution. Utilise au moins **quatre phrases avec will** et **une phrase avec if**. Exemple : In 2050, there will be a tramway across Brazzaville. If the city plants trees, the air will be cleaner.

### 5. Débat

**Motion :** « Public transport is better than private cars. »

- **For :** moins cher, moins polluant, moins d'embouteillages, plus sûr, accessible à tous.
- **Against :** horaires peu fiables, bus bondés, liberté et confort de la voiture, pas de transports en commun dans les villages.

### Conseils pour l'oral

- À l'oral, on contracte : I'll /aɪl/, we'll, it'll, won't /wəʊnt/.
- Ne confonds pas **won't** /wəʊnt/ (will not) et **want** /wɒnt/ (vouloir).
- Going to se prononce souvent /ˈɡənə/ dans la conversation rapide (à comprendre, mais écris toujours going to).`,
  },
  {
    type: 'cours',
    title: 'Writing — A report: improving transport in your town',
    content: `## Writing — S'exprimer par écrit

### Le sujet

**Your town council has asked young people for ideas. Write a report (about 150 words) entitled "Improving transport in our town". Describe the main problems and suggest three solutions.**

### Méthode — Le plan du rapport

Un rapport est un texte **organisé et objectif**, avec un titre et des sous-titres.

| Partie | Contenu | Outils |
|---|---|---|
| **Title** | Improving transport in our town | — |
| **Introduction** | Le but du rapport | The aim of this report is to… |
| **Current situation** | Les problèmes constatés (2 ou 3) | présent, comparatifs |
| **Recommendations** | Trois propositions précises | should, I suggest, could |
| **Conclusion** | Les effets attendus | If…, will… / will |

### Expressions utiles — Useful expressions

- **But du rapport :** The aim of this report is to… / This report describes… and suggests…
- **Constat :** At present,… / The main problem is… / Many people complain about…
- **Recommandations :** First, the council should… / I suggest that… / Another solution would be to…
- **Conséquences :** If these measures are adopted, journeys will be… / As a result, there will be fewer…
- **Conclure :** To conclude,… / These changes will make our town…

### Liste de vérification

- ☐ Mon rapport a un titre et des sous-titres (Introduction, Current situation, Recommendations, Conclusion).
- ☐ Je décris au moins deux problèmes réels de ma ville.
- ☐ Je fais trois propositions précises.
- ☐ J'utilise will (et au moins un conditionnel avec if) pour les conséquences.
- ☐ Pas de will après if.
- ☐ J'ai environ 150 mots, avec un ton neutre et poli.

### À toi

Rédige ton rapport dans l'**exercice 9**, puis compare avec l'exemple corrigé.`,
  },
  {
    type: 'resume',
    title: 'Revision sheet — Transport',
    content: `### À retenir — Unit 6 : Transport

**Idée centrale :** le transport fait vivre l'économie, mais les villes africaines, qui grandissent vite, souffrent d'embouteillages, d'accidents et de pollution. Solutions : transports en commun (bus rapides sur voies réservées, tramways, trains), deux-roues électriques, routes sûres, sans oublier les travailleurs du transport informel.

**Vocabulaire indispensable**
- Moyens de transport : public transport, car, bus, minibus, taxi, motorbike taxi, lorry, train, railway, plane, boat, canoe, ferry, bicycle, on foot
- Voyager : journey, trip, ticket, fare, passenger, driver, station, bus stop, to get on / off, to catch / miss, to commute, luggage, delay, on time
- Circulation : traffic, traffic jam, rush hour, road, crossroads, traffic lights, pothole, road accident, speed, seat belt, helmet, fuel, exhaust fumes

**Grammaire : le futur**

| | Emplois | Exemple |
|---|---|---|
| will + base | prédiction, opinion ; décision sur le moment ; promesse | I think it will rain. / I'll carry it. |
| be going to + base | projet décidé ; prédiction visible | I'm going to travel. / We're going to crash! |

- Négation : won't ; isn't / aren't going to.
- Après if, when, as soon as : présent (When I arrive, I'll call you).
- Conditionnel de type 1 : If + présent, will + base.

**Pour l'oral et l'écrit**
- by bus, by train, by plane… mais on foot.
- travel (indénombrable), a journey, a trip ; luggage (indénombrable).
- Rapport : titre, sous-titres, recommandations avec should / I suggest.`,
  },
]

export const exercises = [
  {
    title: 'Exercise 1 — Will: predictions and decisions',
    difficulty: 1,
    statement: `**A. Complète avec will ou won't + le verbe entre parenthèses.**
1. I think the new road ______ (reduce) traffic jams.
2. Don't worry, the bus ______ (be) late today, the driver is always on time.
3. In 2050, most cars ______ (run) on electricity.
4. ______ the train ______ (stop) at Dolisie?
5. She doesn't like planes. She ______ (fly) to Pointe-Noire.

**B. Réagis à chaque situation avec une décision prise sur le moment (I'll…).**
6. Your grandmother has a heavy bag.
7. You missed the last bus.
8. Your friend doesn't know the way to the station.`,
    solution: `**A.**
1. **will reduce**
2. **won't be**
3. **will run**
4. **Will** the train **stop** at Dolisie?
5. **won't fly**

**B. Exemples de réponses :**
6. **I'll carry your bag (for you).**
7. **I'll take a taxi.** / **I'll walk home.**
8. **I'll show you the way.**

Rappel : will est suivi de la base verbale, sans to, et ne prend jamais de -s.`,
  },
  {
    title: 'Exercise 2 — Be going to: plans and evidence',
    difficulty: 1,
    statement: `**A. Complète avec la bonne forme de be going to + le verbe.**
1. We ______ (visit) our cousins in Ouesso next month.
2. My brother ______ (not / buy) a motorbike; he's too young.
3. ______ you ______ (take) the train or the bus?
4. The government ______ (build) a new bridge over the river.

**B. Que va-t-il se passer ? Utilise be going to (évidence).**
5. The taxi driver is driving very fast and the road is wet.
6. The bus is full and there are still twenty people at the bus stop.
7. It's 7:58 and the train leaves at 8:00. We are still at home.`,
    solution: `**A.**
1. **are going to visit**
2. **isn't going to buy**
3. **Are** you **going to take** the train or the bus?
4. **is going to build**

**B. Exemples de réponses :**
5. **He's going to have an accident.**
6. **Some people aren't going to get on the bus.** / **They're going to wait for the next one.**
7. **We're going to miss the train.**`,
  },
  {
    title: 'Exercise 3 — Will or going to? First conditional and mistakes',
    difficulty: 2,
    statement: `**A. Choisis will ou be going to.**
1. A: The phone is ringing. — B: OK, I ______ (answer) it.
2. I've bought my ticket. I ______ (travel) on Saturday.
3. I think public transport ______ (improve) in the future.
4. Look at those black clouds! It ______ (rain).

**B. Mets les verbes à la bonne forme (conditionnel de type 1).**
5. If the city ______ (build) bus lanes, traffic ______ (decrease).
6. If you ______ (not / wear) a helmet, you ______ (be) in danger.
7. When we ______ (arrive) in Pointe-Noire, we ______ (call) you.

**C. Chaque phrase contient une erreur. Corrige-la.**
8. I will to take the bus tomorrow.
9. If it will rain, we will stay at home.
10. They are going to built a railway.`,
    solution: `**A.**
1. **'ll answer** (décision prise sur le moment)
2. **'m going to travel** (projet déjà décidé, billet acheté)
3. **will improve** (opinion, prédiction)
4. **'s going to rain** (évidence visible)

**B.**
5. If the city **builds** bus lanes, traffic **will decrease**.
6. If you **don't wear** a helmet, you **will be** in danger.
7. When we **arrive** in Pointe-Noire, we **will call** you.

**C.**
8. I will **take** the bus tomorrow. (pas de to après will)
9. If it **rains**, we will stay at home. (présent après if)
10. They are going to **build** a railway. (base verbale après going to)`,
  },
  {
    title: 'Exercise 4 — Listening: Train or bus to Pointe-Noire?',
    difficulty: 1,
    statement: `Réponds aux questions sur la conversation (leçon Listening).

**A. Compréhension globale — True or False?**
1. Christelle and Junior are going to Pointe-Noire for work.
2. They finally choose the plane.
3. Fabrice made the journey recently.

**B. Compréhension détaillée**
4. Who are they going to visit?
5. How did Fabrice travel, and how long did the journey take?
6. What frightened Fabrice during his journey?
7. Give two advantages of the train according to Fabrice.
8. Why don't they take the plane?
9. Why does Junior want to take the train?
10. What are they going to do before buying tickets? Why must they book early?
11. What will Junior and Christelle do to prepare the trip?`,
    solution: `**A.**
1. **False** — they are going to visit their grandparents during the holidays.
2. **False** — they choose the train.
3. **True** — he travelled last month.

**B.**
4. **Their grandparents** (Grandma and Grandpa).
5. **By bus**; the journey took **about eight or nine hours**.
6. **The driver was going really fast**; he thought they were going to have an accident.
7. **You can walk around** and **the scenery is beautiful** (the Mayombe forest, the hills, the rivers).
8. Because **the ticket is much more expensive** and they don't have that much money.
9. Because **he wants to see the Mayombe forest**.
10. They are going to **check the timetable**, because the train doesn't run every day; they must book early because **it will be full during the holidays**.
11. **Junior will pack sandwiches and bananas**; **Christelle will call Grandma** to tell her when they are going to arrive.`,
  },
  {
    title: 'Exercise 5 — Reading: understanding the text',
    difficulty: 2,
    statement: `Réponds aux questions sur le texte « African cities on the move ».

**A. Global understanding**
1. The text is mainly about: (a) the history of the African railway (b) the transport problems of African cities and some solutions (c) how to buy a car.

**B. Detailed understanding**
2. How much time can workers spend travelling every day?
3. What will happen to the population of African cities, according to experts?
4. What did Addis Ababa open in 2015?
5. Why are the buses of Dar es Salaam faster?
6. What change is happening in Kigali, Nairobi and Kampala? Give two advantages.
7. Explain the comparison with the mobile phone.
8. Give two difficulties of building modern transport.
9. What is the change in the Tanzanian commuter's life?

**C. True or False? Justify.**
10. The best projects exclude the informal transport workers.`,
    solution: `**A.** 1. **(b)**

**B.**
2. **Two or three hours a day.**
3. It **will double in the next twenty-five years**.
4. **A light railway**, one of the first in sub-Saharan Africa.
5. Because **they run on their own lanes**, so they don't get stuck in traffic.
6. Companies are **replacing petrol motorbikes with electric ones**; riders **pay less for energy** and **don't pollute** the streets.
7. Africa **skipped the landline telephone and went directly to the mobile phone**; in the same way, it **may skip petrol and go directly to electric transport**.
8. **It is expensive** (millions of dollars, cities already in debt) and **it may take the jobs of informal transport workers**, which would cause protests.
9. **Before, he left home at five; now he can have breakfast with his children.**

**C.**
10. **False** — "the best projects include these workers instead of excluding them."`,
  },
  {
    title: 'Exercise 6 — Reading: vocabulary and interpretation',
    difficulty: 3,
    statement: `**A. Find in the text a word or expression that means:**
1. full of people or vehicles (paragraph 1)
2. to become two times bigger (paragraph 1)
3. a part of a road reserved for some vehicles (paragraph 2)
4. to jump over a stage (paragraph 3)
5. not too expensive (paragraph 5)

**B.** Paragraph 1: "If nothing changes, traffic will become even worse." Identify the grammar structure and explain its use.

**C. Interpretation (4-5 sentences).**
6. "Clean, safe and affordable transport is not a luxury." Do you agree? Explain with examples from your town.`,
    solution: `**A.**
1. **crowded**
2. **to double**
3. **a lane**
4. **to skip**
5. **affordable**

**B.** C'est un **conditionnel de type 1** : **If + présent** (nothing changes), **will + base verbale** (will become). Il exprime une conséquence probable dans le futur si la condition se réalise.

**C. Exemple de réponse :**
6. I agree that good transport is not a luxury but a necessity. In my town, many workers spend hours in crowded minibuses, so they arrive tired and have less time for their families. Road accidents with motorbike taxis also kill young people every year. If the city invests in safe and cheap buses, pupils will arrive at school on time and the air will be cleaner. That is why transport should be a priority for our leaders.

Toute réponse argumentée et illustrée par un exemple local est acceptée.`,
  },
  {
    title: 'Exercise 7 — Vocabulary: match and complete',
    difficulty: 1,
    statement: `**A. Relie chaque mot à sa définition.**

| Word | Definition |
|---|---|
| 1. a passenger | a. the time of day when traffic is heaviest |
| 2. a fare | b. a person who travels in a vehicle but does not drive it |
| 3. rush hour | c. a hole in the surface of a road |
| 4. a pothole | d. the money you pay for a journey |
| 5. to commute | e. to travel regularly between home and work |

**B. Complète avec : traffic jam, helmet, missed, luggage, delayed.**
6. We were stuck in a ______ for two hours.
7. Always wear a ______ when you ride a motorbike.
8. The plane was ______ because of the storm.
9. I ______ the bus, so I arrived late at school.
10. How many pieces of ______ do you have?`,
    solution: `**A.** 1-**b** · 2-**d** · 3-**a** · 4-**c** · 5-**e**

**B.**
6. **traffic jam**
7. **helmet**
8. **delayed**
9. **missed**
10. **luggage** (indénombrable : pieces of luggage)`,
  },
  {
    title: 'Exercise 8 — Put in order and translate',
    difficulty: 2,
    statement: `**A. Remets les mots dans l'ordre.**
1. going / visit / we / to / are / grandparents / our
2. think / will / I / be / the train / late
3. if / builds / the city / will / traffic / decrease / bus lanes,
4. you / are / going / how / to / travel / ?

**B. Traduis en anglais.**
5. Nous allons prendre le train pour Pointe-Noire.
6. Je pense que les voitures seront électriques en 2050.
7. Si tu rates le bus, tu arriveras en retard.
8. Ne t'inquiète pas, je vais porter ton sac. (décision sur le moment)`,
    solution: `**A.**
1. **We are going to visit our grandparents.**
2. **I think the train will be late.**
3. **If the city builds bus lanes, traffic will decrease.**
4. **How are you going to travel?**

**B.**
5. **We're going to take the train to Pointe-Noire.**
6. **I think cars will be electric in 2050.**
7. **If you miss the bus, you will arrive late.** (ou you'll be late)
8. **Don't worry, I'll carry your bag.** (will : décision prise sur le moment, malgré le « je vais » français)`,
  },
  {
    title: 'Exercise 9 — Writing: a report on transport (≈ 150 words)',
    difficulty: 3,
    statement: `**Topic:** Your town council has asked young people for ideas. Write a report (about **150 words**) entitled "Improving transport in our town". Describe the main problems and suggest three solutions.

Suis le plan de la leçon Writing (titre, introduction, situation actuelle, recommandations, conclusion). Utilise will et au moins un conditionnel avec if. Écris ton texte, valide-le, puis compare avec l'exemple corrigé.`,
    solution: `**Exemple de production corrigée (≈ 160 mots)**

**Improving transport in our town**

**Introduction.** The aim of this report is to describe the transport problems of our town and to suggest some solutions.

**Current situation.** At present, the main roads are crowded at rush hour, and it can take an hour to cross the town. Many minibuses are old and produce exhaust fumes. Moreover, motorbike taxis cause many accidents, because most riders don't wear helmets.

**Recommendations.** First, the council should create bus lanes on the main avenues, so that buses can move faster. Secondly, I suggest that the potholes be repaired and that traffic lights be installed at the busiest crossroads. Finally, helmets should be compulsory for riders and passengers, with regular police controls.

**Conclusion.** If these measures are adopted, journeys will be shorter and safer, and the air will be cleaner. Better transport will improve the daily life of everybody in our town.

**Grille d'auto-évaluation (sur 20)** : forme du rapport (titre, sous-titres, ton) (4) · pertinence des problèmes et des solutions (5) · vocabulaire du thème (4) · grammaire : will, going to, conditionnel (5) · orthographe et ponctuation (2).`,
  },
  {
    title: 'End-of-unit test — Writing and speaking tasks',
    difficulty: 3,
    statement: `Ces deux tâches complètent le **QCM de fin d'unité** (20 questions).

**1. Writing task (70-90 words).** Write an email to a friend about a trip you are going to make during the next holidays: where you are going to go, how you are going to travel, and what you think the journey will be like.

**2. Speaking task.** Enregistre-toi pendant **1 minute 30** : « How will people travel in Congo in 2050? »`,
    solution: `**1. Exemple de réponse :**

Hi Divine,
Great news: I'm going to spend the holidays in Ouesso with my uncle! We're going to leave Brazzaville on 2 July. We're going to travel by bus, because the plane is too expensive. The journey is very long, so I think I'll be tired when I arrive. But I'm sure I'll love the forest and the Sangha river. My uncle is going to take me fishing. I'll send you photos!
See you soon,
Prince

**2. Points attendus à l'oral :** faire au moins quatre prédictions avec will (électrique, tramway, routes, trains…), employer I think / probably / I'm sure, au moins un conditionnel (If the government invests…, there will be…), comparer avec aujourd'hui (faster, cleaner, safer), conclure par une opinion, parler sans lire.`,
  },
]

export const qcm = {
  title: 'Unit 6 test — Transport',
  time_limit_sec: 900,
  questions: [
    // Vocabulaire (7)
    { prompt: 'A long line of vehicles that cannot move is a:', options: ['traffic light', 'traffic jam', 'crossroads', 'motorway'], correct_index: 1, explanation: 'Traffic jam = un embouteillage.' },
    { prompt: 'The money you pay for a bus or train journey is the:', options: ['fare', 'fair', 'fee', 'fine'], correct_index: 0, explanation: 'Fare = le prix du trajet (fine = une amende).' },
    { prompt: 'A person who travels in a vehicle without driving it is a:', options: ['driver', 'rider', 'passenger', 'commuter'], correct_index: 2, explanation: 'Passenger = un passager.' },
    { prompt: '"Une gare routière" in English is:', options: ['a coach station', 'a car park', 'a bus lane', 'a railway'], correct_index: 0, explanation: 'Coach station = gare routière (coach = autocar).' },
    { prompt: 'Choose the correct sentence.', options: ['I go to school by foot.', 'I go to school on foot.', 'I go to school with foot.', 'I go to school in foot.'], correct_index: 1, explanation: 'by bus, by train… mais on foot.' },
    { prompt: 'Choose the correct sentence.', options: ['I have three luggages.', 'I have three pieces of luggage.', 'I have three luggage.', 'I have a luggages.'], correct_index: 1, explanation: 'Luggage est indénombrable.' },
    { prompt: 'Hurry up, or we will ______ the train!', options: ['lose', 'miss', 'fail', 'catch'], correct_index: 1, explanation: 'To miss a train = rater un train ; to catch = l\'attraper.' },
    // Grammaire (7)
    { prompt: 'I think cars ______ electric in 2050.', options: ['are going', 'will be', 'will to be', 'be'], correct_index: 1, explanation: 'Prédiction d\'opinion (I think) → will + base verbale.' },
    { prompt: 'I\'ve bought my ticket. I ______ travel on Saturday.', options: ['will', 'am going to', 'go to', 'going to'], correct_index: 1, explanation: 'Projet déjà décidé → be going to.' },
    { prompt: 'The phone is ringing. — OK, I ______ answer it.', options: ['\'ll', '\'m going to', 'answer', 'will to'], correct_index: 0, explanation: 'Décision prise sur le moment → will.' },
    { prompt: 'Look at the speed of that car! It ______ crash!', options: ['will', 'is going to', 'goes to', 'won\'t'], correct_index: 1, explanation: 'Prédiction fondée sur une évidence visible → be going to.' },
    { prompt: 'If the city ______ bus lanes, traffic will decrease.', options: ['will build', 'builds', 'built', 'is build'], correct_index: 1, explanation: 'Après if : présent (jamais will).' },
    { prompt: 'The negative form of "will" is:', options: ['willn\'t', 'won\'t', 'don\'t will', 'not will'], correct_index: 1, explanation: 'will not = won\'t.' },
    { prompt: 'They are going to ______ a new bridge.', options: ['built', 'building', 'build', 'builds'], correct_index: 2, explanation: 'Going to + base verbale.' },
    // Compréhension — texte sur les villes africaines (6)
    { prompt: 'According to experts, the population of African cities will:', options: ['decrease', 'double in 25 years', 'stay the same', 'double in 5 years'], correct_index: 1, explanation: 'Paragraphe 1.' },
    { prompt: 'Which city opened a light railway in 2015?', options: ['Lagos', 'Brazzaville', 'Addis Ababa', 'Kigali'], correct_index: 2, explanation: 'Paragraphe 2.' },
    { prompt: 'Why are the rapid buses of Dar es Salaam faster?', options: ['They are electric', 'They run on their own lanes', 'They don\'t stop', 'They are free'], correct_index: 1, explanation: 'Paragraphe 2.' },
    { prompt: 'What are young companies doing in Kigali, Nairobi and Kampala?', options: ['Building railways', 'Replacing petrol motorbikes with electric ones', 'Selling cars', 'Closing roads'], correct_index: 1, explanation: 'Paragraphe 3.' },
    { prompt: 'Who could protest against new transport systems?', options: ['Tourists', 'Informal transport workers', 'Engineers', 'Pupils'], correct_index: 1, explanation: 'Paragraphe 4 : taxi drivers, minibus owners, motorbike riders.' },
    { prompt: 'In the text, "affordable" means:', options: ['rapide', 'abordable, pas trop cher', 'dangereux', 'moderne'], correct_index: 1, explanation: 'Affordable = que l\'on peut se payer.' },
  ],
}
