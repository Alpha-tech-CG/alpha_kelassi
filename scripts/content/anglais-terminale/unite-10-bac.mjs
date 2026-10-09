/**
 * Anglais Terminale A, C et D — Section BAC (chapitre « Référence et préparation à
 * l'examen » du programme INRAP).
 *
 * Le chapitre existait sous la forme d'une seule leçon très longue (grammaire de
 * référence, lexique, 10 textes, 10 sujets d'écriture, 10 sujets type BAC, méthode)
 * avec les corrigés DANS la leçon et beaucoup d'italiques que le mobile n'affiche
 * pas. Il est réorganisé selon la méthode des cours de langues : leçons de méthode
 * et de référence d'un côté, entraînement corrigé dans les exercices (corrigé ouvert
 * après réponse) et un BAC blanc « Language » en QCM. Tout le contenu existant est
 * conservé : les 10 sujets type BAC reçoivent un corrigé complet (Reading, Language
 * et un modèle de Writing), les 10 textes courts deviennent deux exercices, et les
 * points de grammaire jamais traités dans les unités (past perfect, discours
 * rapporté, conditionnels 2 et 3, formation des mots) ont leurs exercices.
 */

export const unit = {
  chapterTitle: 'Référence et préparation à l’examen',
  description: 'ANGLAIS · SECTION BAC — Méthode, grammaire de référence, lexique et 10 sujets type BAC corrigés',
}

export const lessons = [
  {
    type: 'cours',
    title: 'BAC — Introduction : l\'épreuve d\'anglais',
    content: `## Section BAC — Réussir l'épreuve d'anglais

**Niveau :** Terminale A, C et D · **À utiliser :** toute l'année, et intensivement pendant les révisions

### À quoi sert cette section ?

Les neuf unités t'ont donné le vocabulaire, la grammaire et les compétences de chaque thème du programme. Cette section t'apprend à **les mobiliser le jour de l'examen** : connaître l'épreuve, appliquer une méthode pour chaque partie, réviser la grammaire et le lexique d'un coup d'œil, et t'entraîner sur des **sujets type BAC corrigés**.

### La structure de l'épreuve

| Partie | Points | Ce qu'on te demande |
|---|---|---|
| **Reading** — compréhension écrite | **10** | Un texte suivi de questions : idée générale, détails, vrai / faux justifié, mots à trouver dans le texte |
| **Language** — langue | **5** | Des items de grammaire et de vocabulaire : temps, voix passive, discours rapporté, connecteurs, formation des mots… |
| **Writing** — expression écrite | **5** | Une production : essai argumenté, lettre formelle ou amicale, rapport, résumé, biographie |
| **Total** | **20** | |

### Gérer ton temps

Quelle que soit la durée indiquée sur ta convocation, répartis ton temps en proportion des points :

| Étape | Part du temps |
|---|---|
| Lecture du sujet entier | quelques minutes |
| Reading | environ la moitié |
| Language | environ un cinquième (items courts, points « sûrs ») |
| Writing | environ un quart |
| Relecture finale | toujours 5 minutes au moins |

Conseil : commence par la partie où tu es le plus à l'aise, mais **ne laisse jamais une question sans réponse**.

### Le parcours de la section

| Étape | Contenu | Où ? |
|---|---|---|
| 1. Méthode Reading | Lire, repérer, répondre | Leçon |
| 2. Méthode Language | Identifier ce que teste chaque item | Leçon |
| 3. Méthode Writing | Les six formats et leur présentation | Leçon |
| 4. Grammaire de référence | Toute la grammaire du BAC | Leçon |
| 5. Lexique thématique | ≈ 300 mots classés par thème | Leçon |
| 6. Entraînement | 10 sujets type BAC + textes courts + exercices ciblés, tous corrigés | Bouton « Exercices » |
| 7. BAC blanc Language | QCM de 20 questions | Test |
| 8. Fiche « jour J » | Les règles d'or | Fiche |

### Le lien avec les unités

| Thème | Unité | Grammaire travaillée dans l'unité |
|---|---|---|
| Food and health | 1 | Donner un conseil (should, ought to, had better) |
| Development | 2 | Present perfect |
| Music and sports | 3 | Prétérit et used to |
| The North/South divide | 4 | Comparatifs et superlatifs |
| Famous lives | 5 | Propositions relatives |
| Transport | 6 | Will et be going to, conditionnel de type 1 |
| Demographic, ecological and social problems | 7 | Voix passive ; connecteurs de cause et de conséquence |
| Employment | 8 | Gérondif et infinitif ; lettre formelle |
| Politics | 9 | Must, have to, mustn't, don't have to |

Les points qui n'ont pas d'unité propre (past perfect, discours rapporté, conditionnels 2 et 3, formation des mots, articles) sont dans la **grammaire de référence** et travaillés dans les **exercices 13 à 15**.`,
  },
  {
    type: 'cours',
    title: 'BAC — Reading method (10 points)',
    content: `## Reading — La méthode de la compréhension écrite

La compréhension écrite rapporte **la moitié des points**. C'est la partie où une bonne méthode fait gagner le plus.

### Étape 1 — Découvrir le texte (skimming)

- Lis le **titre**, la **source** et la **première phrase de chaque paragraphe**.
- Lis le texte **en entier une fois**, sans t'arrêter sur les mots inconnus.
- Demande-toi : **de quoi parle-t-il ?** (le thème) et **que veut montrer l'auteur ?** (l'idée principale). Rattache-le à l'un des 9 thèmes du programme : tu connais déjà son vocabulaire.

### Étape 2 — Lire les questions

- Lis **toutes les questions** avant de relire le texte : elles suivent souvent l'ordre du texte.
- Souligne le **mot interrogatif** et ce qu'il demande :

| Mot | Ce qu'on attend |
|---|---|
| What…? | une chose, une idée |
| Who…? | une personne |
| Where / When…? | un lieu / un moment |
| Why…? | une cause → réponds avec **Because…** |
| How…? | une manière, un moyen |
| How many / How much…? | une quantité |

### Étape 3 — Chercher les réponses (scanning)

- Relis le texte paragraphe par paragraphe et **souligne** le passage qui répond à chaque question ; note le numéro de la question dans la marge.
- Pour les mots inconnus, utilise le **contexte**, les **mots transparents** (education, development) et la **formation des mots** (un-, dis-, -ful, -less, -tion).

### Étape 4 — Rédiger les réponses

- Réponds par une **phrase complète**, sujet et verbe conjugué : « Why are rivers polluted? » → **Rivers are polluted because factories dump waste in them.**
- **Reprends** les mots du texte, mais adapte la phrase à la question (pronoms, temps). Ne recopie pas un paragraphe entier.
- Garde le **temps** de la question : Why **did** she leave? → She **left** because…

### Les types de questions

| Type | Méthode |
|---|---|
| **General understanding** (choisis le titre, l'idée principale) | Pense au texte entier, pas à un détail |
| **True or False? Justify** | Écris True ou False, puis **recopie la courte phrase du texte** qui le prouve, entre guillemets |
| **Find a word meaning…** | Cherche dans le paragraphe indiqué un mot de **même nature** (nom, verbe, adjectif) que la définition |
| **What does « it / they / this » refer to?** | Remonte dans la phrase précédente pour trouver le nom remplacé |
| **Explain in your own words** | Reformule avec tes mots, en 1 ou 2 phrases simples |
| **Personal question / opinion** | Donne ton avis avec In my opinion…, justifie avec because et un exemple |

### Erreurs qui coûtent des points

- Répondre « Yes » ou « No » sans justifier.
- Recopier une phrase qui ne répond pas exactement à la question.
- Oublier le -s de la 3e personne ou mélanger les temps.
- Laisser une question sans réponse : même une réponse partielle rapporte des points.

### Entraîne-toi

Exercices 1 à 10 (sujets type BAC) et 11-12 (textes courts), dans le bouton « Exercices » en bas de page.`,
  },
  {
    type: 'cours',
    title: 'BAC — Language method (5 points)',
    content: `## Language — La méthode de la partie langue

Les 5 points de Language sont les **plus faciles à sécuriser** : chaque item teste une règle précise. Si la règle est connue, le point est gagné.

### Étape 1 — Identifier ce que teste l'item

Avant d'écrire, demande-toi : **quelle règle ?** Les consignes et les indices te le disent.

| Consigne ou indice | Ce qui est testé | Où réviser |
|---|---|---|
| Put the verb in the correct tense / yesterday, since, already, by the time | les temps | Grammaire de référence §1 ; unités 2, 3, 6 |
| Put into the passive / … by … | la voix passive | Unité 7 |
| Rewrite in reported speech / He said that… | le discours rapporté | Grammaire de référence §4 ; exercice 13 |
| If… / Complete the conditional | les conditionnels | Grammaire de référence §2 ; exercice 14 |
| Fill in with who, which, whose… / Join the sentences | les relatives | Unité 5 |
| -er / more / the most / as… as | comparatifs et superlatifs | Unité 4 |
| must, should, have to, mustn't… | les modaux | Unités 1 et 9 |
| enjoy… / want… / look forward to… | gérondif ou infinitif | Unité 8 |
| Give the opposite / Give a noun from… | la formation des mots | Grammaire de référence §11 ; exercice 15 |
| however, therefore, although… | les connecteurs | Grammaire de référence §10 ; unité 7 |

### Étape 2 — Appliquer la règle mécaniquement

- **Temps :** repère le marqueur de temps (yesterday → prétérit ; since / for / already → present perfect ; tomorrow → futur ; by the time + passé → past perfect).
- **Passif :** même temps que la phrase active ; **be** au bon temps + **participe passé** ; l'ancien sujet devient **by + agent**.
- **Discours rapporté :** recule chaque temps d'un cran et change les repères (now → then, tomorrow → the next day).
- **Formation des mots :** identifie la nature demandée (nom, adjectif, contraire) et choisis le bon suffixe ou préfixe.

### Étape 3 — Vérifier

- Relis toute la phrase obtenue : est-elle **grammaticale** et **de même sens** que la phrase de départ ?
- Accords : he / she / it → **-s** au présent ; **has** et non have ; **was / were**.
- Orthographe des participes et des formes en -ing : stop → stopped, begin → beginning, write → written.

### Les 10 erreurs les plus fréquentes

| Faux | Correct |
|---|---|
| He didn't went. | He didn't go. |
| I have seen him yesterday. | I saw him yesterday. |
| If I will go… | If I go… |
| The house was build in 1990. | The house was built in 1990. |
| He said me that… | He told me that… / He said that… |
| more richer | richer |
| the man which… | the man who… |
| must to go | must go |
| I look forward to hear… | I look forward to hearing… |
| unpossible | impossible |

### Entraîne-toi

La partie Language des exercices 1 à 10, les exercices 13 à 15 et le BAC blanc Language (QCM de 20 questions).`,
  },
  {
    type: 'cours',
    title: 'BAC — Writing method (5 points)',
    content: `## Writing — La méthode de l'expression écrite

### Étape 1 — Analyser le sujet

Souligne trois choses dans la consigne :
1. **Le type de texte** : essay, letter, report, summary, biography, paragraph.
2. **Le sujet précis** : de quoi dois-tu parler ? Quelle question dois-tu traiter ?
3. **La longueur** : about 100 words, 120 words… Respecte-la à 10 % près.

### Étape 2 — Chercher des idées et faire un plan (au brouillon)

- Note rapidement 4 ou 5 idées, puis **garde les 2 ou 3 meilleures**.
- Pour chaque idée, prévois **un exemple** (si possible congolais ou africain).
- Fais le plan : **introduction → 2 ou 3 paragraphes → conclusion**.

### Étape 3 — Respecter le format

| Type | Présentation | Ouverture | Fin |
|---|---|---|---|
| **Essay** (essai argumenté) | introduction qui reprend la question ; un paragraphe par argument ; conclusion avec ton opinion | Today,… / Many people believe that… | To conclude,… In my opinion,… |
| **Formal letter** (lettre formelle) | ton adresse et la date en haut à droite ; adresse du destinataire à gauche ; pas de contractions | Dear Sir or Madam, / Dear Mr X, | Yours faithfully, (nom inconnu) / Yours sincerely, (nom connu) |
| **Informal letter / email** (lettre amicale) | ton familier, contractions possibles | Dear Kevin, / Hi Kevin, | Best wishes, / Write back soon, / Your friend, |
| **Report** (rapport) | titre + sous-titres (Introduction, Situation, Recommendations, Conclusion) ; ton neutre | The aim of this report is to… | If these measures are taken, … will… |
| **Summary** (résumé) | idées principales seulement, dans l'ordre du texte, avec tes mots ; pas d'opinion ni d'exemple | The text explains that… | — |
| **Biography / portrait** | ordre chronologique ; prétérit | X was born in… | That is why I admire… |

### Étape 4 — Rédiger

- Une idée par paragraphe, annoncée par un **connecteur** : First of all, Secondly, Moreover, However, Therefore, Finally.
- Des phrases **simples et correctes** valent mieux que des phrases longues et fausses.
- Réutilise le **lexique du thème** (leçon Lexique thématique) et la **grammaire des unités** : un comparatif, une relative, un passif, un modal bien placés montrent ta maîtrise.

### Étape 5 — Relire (5 minutes)

- ☐ Le type de texte et le format sont respectés.
- ☐ La longueur est respectée.
- ☐ Chaque verbe est au bon temps ; le -s de la 3e personne est là.
- ☐ Les connecteurs relient bien les idées.
- ☐ Orthographe, majuscules (I, Monday, Congo, English) et ponctuation.

### La grille de correction (sur 5)

| Critère | Ce que le correcteur vérifie |
|---|---|
| Respect de la consigne | type de texte, sujet, longueur |
| Organisation | plan clair, paragraphes, connecteurs |
| Idées | pertinence, exemples |
| Grammaire | temps, accords, structures variées |
| Vocabulaire et orthographe | mots justes, variés, bien écrits |

### Entraîne-toi

Chaque sujet type BAC (exercices 1 à 10) contient une partie Writing avec un **modèle corrigé**.`,
  },
  {
    type: 'cours',
    title: 'BAC — Reference grammar',
    content: `## Grammaire de référence — Tout ce qu'il faut savoir pour le BAC

Chaque point donne la règle, la forme et des exemples. Les points travaillés dans une unité renvoient à cette unité.

### 1. Les temps

| Temps | Forme | Emploi | Exemple | Marqueurs |
|---|---|---|---|---|
| Present simple | base (+ **-s** à la 3e pers.) | habitude, vérité générale | She works in a bank. Water boils at 100 °C. | usually, always, every day |
| Present continuous | am / is / are + V-ing | action en cours, temporaire | They are studying now. | now, at the moment, look! |
| Past simple (unité 3) | V-ed / forme irrégulière | action terminée, datée | He travelled to Dolisie last year. | yesterday, ago, in 2010, last week |
| Past continuous | was / were + V-ing | action en cours dans le passé | I was reading when he called. | when, while |
| Present perfect (unité 2) | have / has + participe passé | lien passé-présent : bilan, expérience, durée | I have finished. She has lived here since 2015. | already, yet, just, ever, never, since, for |
| **Past perfect** | **had + participe passé** | action **antérieure** à une autre action passée | When I arrived, the bus **had** already **left**. | already, before, by the time, after |
| Futur (unité 6) | will + base / be going to + base | prédiction, décision ; projet, évidence | It will rain. I'm going to study medicine. | tomorrow, next year, soon |

**Past perfect, mode d'emploi :** dans un récit au prétérit, il sert à remonter **plus loin dans le passé**. Comparer :
- When I arrived, the bus **left**. (il part au moment où j'arrive)
- When I arrived, the bus **had left**. (il était déjà parti avant mon arrivée)

### 2. Les conditionnels

| Type | Forme | Sens | Exemple |
|---|---|---|---|
| Zéro | If + présent, présent | vérité générale | If you heat ice, it melts. |
| 1 (unité 6) | If + présent, will + base | condition réelle, probable | If he studies, he will pass. |
| **2** | **If + prétérit, would + base** | situation **imaginaire** dans le présent ou le futur | If I **were** rich, I **would build** a school. |
| **3** | **If + past perfect, would have + participe passé** | situation **imaginaire dans le passé** (regret) | If I **had known**, I **would have come**. |

Règles : jamais **will** ni **would** dans la proposition avec if ; au type 2, on écrit **If I were** (à toutes les personnes, en anglais soigné).

### 3. La voix passive (unité 7)

be (au temps de la phrase active) + participe passé (+ by + agent) : They build houses. → Houses are built. / The flood destroyed the bridge. → The bridge was destroyed by the flood.

### 4. Le discours rapporté

**Affirmations :** say (that) / tell somebody (that) + recul des temps.

| Discours direct | Discours rapporté |
|---|---|
| present simple : "I **am** tired." | past simple : He said he **was** tired. |
| present continuous : "I **am working**." | past continuous : She said she **was working**. |
| past simple / present perfect : "I **saw** / **have seen** it." | past perfect : He said he **had seen** it. |
| will : "I **will** come." | would : She said she **would** come. |
| can / must : "I **can** help." | could / had to : He said he **could** help. |

**Repères qui changent :** now → then ; today → that day ; tomorrow → the next day ; yesterday → the day before ; here → there ; this → that ; ago → before.

**Questions :** ask + if / whether (question fermée) ou mot interrogatif, **sans inversion** : "Where do you live?" → She asked me **where I lived**. "Are you ready?" → He asked **if I was** ready.

**Ordres :** tell / ask + personne + **to** + base (négatif : **not to**) : "Sit down." → He told me **to sit** down. "Don't shout." → She asked us **not to shout**.

Piège : **say** n'a pas de complément de personne direct (He said that…) ; **tell** en a un (He told me that…).

### 5. Les modaux (unités 1 et 9)

| Sens | Modaux | Exemple |
|---|---|---|
| Capacité | can / could / be able to | She can swim. |
| Permission | can / may / be allowed to | May I come in? |
| Possibilité | may / might / could | It might rain. |
| Obligation | must / have to | You must stop. |
| Interdiction | mustn't | You mustn't smoke here. |
| Absence d'obligation | don't have to | You don't have to come. |
| Conseil | should / ought to / had better | You should rest. |

### 6. Comparatifs et superlatifs (unité 4)

Court : -er / the -est (tall, taller, the tallest). Long : more / the most (more interesting). Irréguliers : good, better, the best ; bad, worse, the worst ; far, further, the furthest. Égalité : as… as ; infériorité : not as… as, less… than.

### 7. Les propositions relatives (unité 5)

who (personne), which (chose), that (les deux, relative déterminative), whose (possession), where (lieu), when (moment). Explicative entre virgules : jamais that.

### 8. Les quantifieurs (unité 1)

| Dénombrables | Indénombrables | Les deux |
|---|---|---|
| many, a few, few, a number of | much, a little, little, a great deal of | some, any, a lot of, plenty of, no |

### 9. Les articles

- **a / an** : singulier dénombrable, non défini (a doctor, an engineer).
- **the** : défini, déjà connu ou unique (the sun, the president of the club).
- **Ø (pas d'article)** : pluriel ou indénombrable pris **en général** (Dogs are loyal. Water is precious. Education is important.).
- Piège : « La santé est importante » → **Health** is important (pas « The health »).

### 10. Les connecteurs logiques

| Rôle | Connecteurs |
|---|---|
| Addition | moreover, furthermore, in addition, besides, also |
| Opposition | however, nevertheless, although / though (+ phrase), despite / in spite of (+ nom), whereas, on the other hand |
| Cause | because (+ phrase), because of / due to / owing to (+ nom), since, as |
| Conséquence | so, therefore, thus, as a result, consequently |
| But | to / in order to / so as to (+ base), so that (+ phrase) |
| Conclusion | finally, in conclusion, to sum up, all in all |

### 11. La formation des mots

| Procédé | Exemples |
|---|---|
| Préfixes de sens contraire | **un**happy, **in**correct, **im**possible, **il**legal, **ir**regular, **dis**agree, **dis**appear |
| Autres préfixes | **re**build (à nouveau), **over**population (trop), **mis**understand (mal), **under**developed (pas assez) |
| Suffixes de noms | educa**tion**, deci**sion**, develop**ment**, happi**ness**, real**ity**, employ**er** / employ**ee** |
| Suffixes d'adjectifs | use**ful**, use**less**, comfort**able**, poss**ible**, fam**ous**, econom**ic**, cultur**al** |
| Suffixe d'adverbe | quick**ly**, careful**ly**, happi**ly** |
| Suffixes de verbes | modern**ise**, wid**en**, simpl**ify** |

Reconnaître préfixes et suffixes aide aussi à **deviner le sens** d'un mot inconnu dans le Reading.

### 12. Verbes irréguliers indispensables (base – prétérit – participe passé)

| | | |
|---|---|---|
| be – was / were – been | become – became – become | begin – began – begun |
| break – broke – broken | bring – brought – brought | build – built – built |
| buy – bought – bought | choose – chose – chosen | come – came – come |
| do – did – done | drink – drank – drunk | eat – ate – eaten |
| fall – fell – fallen | feel – felt – felt | find – found – found |
| get – got – got | give – gave – given | go – went – gone |
| grow – grew – grown | know – knew – known | leave – left – left |
| lose – lost – lost | make – made – made | meet – met – met |
| pay – paid – paid | read – read – read | run – ran – run |
| say – said – said | see – saw – seen | sell – sold – sold |
| speak – spoke – spoken | spend – spent – spent | take – took – taken |
| teach – taught – taught | think – thought – thought | throw – threw – thrown |
| understand – understood – understood | win – won – won | write – wrote – written |`,
  },
  {
    type: 'cours',
    title: 'BAC — Thematic vocabulary (≈ 300 words)',
    content: `## Lexique thématique — Les mots du BAC, thème par thème

Apprends les mots par thème et fais des phrases avec eux. Pour chaque thème, le vocabulaire complet (prononciation, exemples) est dans la leçon Vocabulary de l'unité correspondante.

### 1. Food and health — Alimentation et santé

diet (régime alimentaire), balanced (équilibré), nutrition, nutrient (nutriment), vitamin, protein (protéine), calorie, meal (repas), to cook (cuisiner), to swallow (avaler), appetite, hunger (faim), thirst (soif), to starve (mourir de faim), malnutrition, obesity (obésité), overweight (en surpoids), junk food (malbouffe), to avoid (éviter), fresh (frais), rotten (pourri), disease / illness (maladie), to recover (guérir), cure (remède), treatment (traitement), to prevent (prévenir), hygiene, vaccine (vaccin), symptom, fit (en forme), to exercise (faire du sport), well-being (bien-être).

### 2. Development — Le développement

development, growth (croissance), economy, industry, agriculture, infrastructure, investment, resources, wealth (richesse), poverty (pauvreté), standard of living (niveau de vie), literacy (alphabétisation), education, progress, to improve (améliorer), sustainable (durable), aid (aide), debt (dette), loan (prêt), trade (commerce), export, import, developing country, developed country, inequality, welfare (protection sociale), to finance, policy (mesure politique), budget, rural, urban, to urbanise.

### 3. Music and sports — Musique et sport

music, song (chanson), singer (chanteur), musician, band (groupe), instrument, rhythm (rythme), melody, lyrics (paroles), concert, stage (scène), to perform (se produire), audience (public), team (équipe), player (joueur), coach (entraîneur), to train (s'entraîner), match, championship (championnat), tournament (tournoi), referee (arbitre), to compete (concourir), to win / to lose, to beat (battre), victory, defeat (défaite), fan / supporter, stadium, fitness (forme physique), talent, discipline, to cheer (encourager).

### 4. The North/South divide — La fracture Nord-Sud

the North / the South, divide (fracture), gap (écart), inequality, rich / poor, trade, raw materials (matières premières), finished goods (produits finis), exploitation, fair trade (commerce équitable), globalisation (mondialisation), debt, aid, cooperation, dependence, independence, colonialism, market, price, to export / to import, multinational, migration, refugee (réfugié), brain drain (fuite des cerveaux), solidarity, justice, to benefit from (profiter de), to exploit, added value (valeur ajoutée), emerging (émergent).

### 5. Famous lives — Vies célèbres

to be born (naître), childhood (enfance), to grow up (grandir), youth (jeunesse), career (carrière), achievement (réalisation), success (réussite), to struggle (lutter), to overcome (surmonter), hardship (épreuve), to dedicate one's life to (consacrer sa vie à), to fight for (se battre pour), freedom, leader (dirigeant), hero / heroine, role model (modèle), influence, legacy (héritage), fame (célébrité), famous, to inspire, award / prize (récompense, prix), to discover, invention, courage, sacrifice, reputation, to admire, biography.

### 6. Transport — Le transport

public transport (transports en commun), vehicle, car, bus, coach (autocar), train, railway (chemin de fer), plane, boat, canoe (pirogue), bicycle, motorbike taxi, road, traffic (circulation), traffic jam (embouteillage), rush hour (heure de pointe), fare (prix du billet), ticket, journey (trajet), trip (voyage court), to travel, to commute (faire la navette), passenger, driver, fuel (carburant), pollution, accident, safety (sécurité), speed (vitesse), delay (retard), crowded (bondé), reliable (fiable), affordable (abordable).

### 7. Demographic, ecological and social problems — Problèmes démographiques, écologiques et sociaux

population growth (croissance démographique), overpopulation, birth rate / death rate (taux de natalité / mortalité), rural exodus (exode rural), slum (bidonville), environment, climate change, global warming (réchauffement climatique), pollution, deforestation, waste / rubbish (déchets), to recycle, to pollute, to protect, to preserve, awareness (prise de conscience), unemployment (chômage), crime (criminalité), shortage (pénurie), drought (sécheresse), flood (inondation), famine, epidemic, soil erosion (érosion des sols), endangered species (espèces menacées), charcoal (charbon de bois), sustainable, to threaten (menacer), cause, consequence, solution.

### 8. Employment — L'emploi

job, work, employment, unemployment, employer / employee, to apply for (postuler), application (candidature), CV, cover letter (lettre de motivation), interview (entretien), skill (compétence), qualification, experience, training (formation), internship (stage), to hire (embaucher), to fire (licencier), to recruit, salary / wage (salaire), income (revenu), career, promotion, self-employed (indépendant), entrepreneur, business, to earn a living (gagner sa vie), workplace (lieu de travail), colleague, workforce (main-d'œuvre), part-time / full-time, vacancy (poste vacant).

### 9. Politics — La politique

government, the State (l'État), democracy, dictatorship (dictature), election, to elect (élire), to vote, ballot (bulletin), candidate, political party, citizen (citoyen), citizenship, rights / duties (droits / devoirs), freedom of speech (liberté d'expression), law (loi), justice, to govern, power, leader, president, parliament, minister, policy, corruption, bribery (pots-de-vin), accountable (qui rend des comptes), peace, war, conflict, human rights, constitution, majority, opposition, the common good (l'intérêt général).

### Comment réviser ce lexique

- Un thème par jour : lis la liste, cache le français, puis cache l'anglais.
- Écris **trois phrases** par thème avec cinq mots de la liste.
- Avant un sujet type BAC, relis la liste du thème du texte : tu comprendras plus vite.`,
  },
  {
    type: 'cours',
    title: 'BAC — Revising all year long',
    content: `## Réviser toute l'année — Le plan de travail

### Chaque semaine

| Jour | Activité | Durée |
|---|---|---|
| 1 | Relire le lexique d'un thème + écrire 3 phrases | 20 min |
| 2 | Revoir un point de grammaire (grammaire de référence ou unité) + son exercice | 30 min |
| 3 | Lire un texte court et répondre aux questions (exercices 11-12) | 20 min |
| 4 | Faire un sujet type BAC complet en temps limité (exercices 1-10) | 1 h à 2 h |
| 5 | Corriger le sujet avec le corrigé, noter ses erreurs dans un carnet | 30 min |
| 6 | Écrire un texte (essai, lettre ou rapport) et le comparer au modèle | 40 min |

### Le carnet d'erreurs

Garde un carnet avec trois colonnes : **mon erreur** → **la correction** → **la règle**. Relis-le avant chaque devoir et chaque BAC blanc : on refait toujours les mêmes erreurs tant qu'on ne les a pas notées.

### Lire et écouter de l'anglais

- Lis un peu d'anglais chaque jour : un article simple, une page de manuel, les paroles d'une chanson que tu aimes.
- Écoute de l'anglais (radio, chansons, vidéos éducatives) et note 3 mots nouveaux par jour.
- Parle sans peur de faire des fautes : avec un camarade, décris ta journée en anglais pendant 2 minutes.

### Le mois avant l'examen

- Semaines 1 et 2 : refais les sujets type BAC 1 à 10, un par jour, en temps limité.
- Semaine 3 : refais le BAC blanc Language (QCM) jusqu'à obtenir au moins 16/20 ; revois chaque règle ratée.
- Semaine 4 : relis les fiches de révision des 9 unités et la fiche « jour J ». Repose-toi la veille.`,
  },
  {
    type: 'resume',
    title: 'BAC — Golden rules for exam day',
    content: `### À retenir — Le jour de l'épreuve d'anglais

**Structure :** Reading 10 points · Language 5 points · Writing 5 points.

**Avant de commencer**
- Lis **tout le sujet** et toutes les consignes.
- Repère le **thème** du texte (un des 9 thèmes) : rappelle-toi son vocabulaire.
- Répartis ton temps : environ la moitié pour le Reading, un cinquième pour le Language, un quart pour le Writing, 5 minutes de relecture.

**Reading**
- Lis le texte une fois en entier, puis les questions, puis relis en soulignant.
- Réponds par des **phrases complètes**, au bon temps.
- True / False → toujours **justifier** avec une citation courte.
- Find a word → un mot de même nature, dans le paragraphe indiqué.

**Language**
- Identifie la règle testée avant d'écrire.
- Pièges : didn't + base ; pas de will après if ; be + participe passé au passif ; said that / told me that ; must sans to.

**Writing**
- Analyse : type de texte, sujet, longueur.
- Plan : introduction → 2-3 paragraphes avec connecteurs → conclusion.
- Format : Yours faithfully (Dear Sir or Madam) / Yours sincerely (Dear Mr X).
- Phrases simples et correctes.

**À la fin**
- Relis : temps, -s de la 3e personne, orthographe, majuscules.
- **Ne laisse aucune question sans réponse.**
- Écris lisiblement.

Practice makes perfect. Good luck!`,
  },
]

const paper = (n, theme, text, reading, language, writing) => `**SUJET TYPE BAC n° ${n} — Theme: ${theme}**

Travaille en temps limité, sans regarder le corrigé, puis corrige-toi.

**TEXT**

${text}

**I. READING (10 points)**

${reading}

**II. LANGUAGE (5 points)**

${language}

**III. WRITING (5 points)**

${writing}`

export const exercises = [
  {
    title: 'BAC paper 1 — Food and health',
    difficulty: 2,
    statement: paper(1, 'Food and health',
      `> Good health starts with simple habits. Doctors remind us that eating fruit and vegetables, drinking clean water and sleeping well protect the body far better than any medicine. In our cities, however, fast food and sugary drinks are replacing traditional meals. The result is a rise in obesity and other diseases, even among the young. The good news is that healthy choices are usually cheap and within reach of everyone.`,
      `1. What three simple habits protect the body? (3 pts)
2. What is replacing traditional meals in cities? (2 pts)
3. What is the result of this change? (2 pts)
4. Is a healthy diet expensive? Justify with the text. (2 pts)
5. Find in the text an expression meaning "available, possible to obtain". (1 pt)`,
      `a) Put into the passive: People eat too much fast food. (1 pt)
b) Give the comparative: Vegetables are ______ (healthy) than sweets. (1 pt)
c) Give the opposite with a prefix: healthy → ______ (1 pt)
d) Give advice: You ______ eat more fruit. (1 pt)
e) Choose the connector: ______ fast food is cheap, it is unhealthy. (although / therefore) (1 pt)`,
      `Write a paragraph (about 100 words): How can students in your school eat more healthily?`),
    solution: `**I. READING**
1. **Eating fruit and vegetables, drinking clean water and sleeping well.**
2. **Fast food and sugary drinks** are replacing traditional meals.
3. **There is a rise in obesity and other diseases, even among the young.**
4. **No.** "Healthy choices are usually cheap and within reach of everyone."
5. **within reach**

**II. LANGUAGE**
a) **Too much fast food is eaten (by people).**
b) **healthier** (healthy → healthier : -y devient -ier)
c) **unhealthy**
d) **should** (ou ought to)
e) **Although** (opposition : bien que)

**III. WRITING — modèle (≈ 105 mots)**

Students in our school can eat more healthily in several simple ways. First, they should have breakfast at home before coming to school, because an empty stomach makes concentration difficult. Secondly, instead of buying doughnuts and sugary drinks at break time, they can bring fruit such as bananas, oranges or safou, which are cheap and full of vitamins. Moreover, the school could ask the sellers at the gate to offer healthier food. Finally, students must drink enough clean water during the day. If everyone changes small habits, we will be fitter, less tired and more successful in our studies.`,
  },
  {
    title: 'BAC paper 2 — Development',
    difficulty: 2,
    statement: paper(2, 'Development',
      `> Africa is a rich continent with poor people — a strange paradox. Its soil holds oil, gold and diamonds, yet millions lack schools and hospitals. The reason is often that raw materials are sold abroad while little is built at home. True development means transforming these resources into roads, jobs and knowledge, for the benefit of the whole population.`,
      `1. What is the "strange paradox"? (2 pts)
2. Name two riches of Africa's soil. (2 pts)
3. What do millions of people still lack? (2 pts)
4. What does "true development" mean according to the text? (2 pts)
5. Find a word meaning "changing into something else". (2 pts)`,
      `a) Present perfect: The country ______ (build) many schools since independence. (1 pt)
b) Superlative: Africa is one of the ______ (rich) continents in resources. (1 pt)
c) Complete: Resources are sold ______ foreign companies. (by / with) (1 pt)
d) Give a noun from "develop": ______ (1 pt)
e) Connector of consequence: Resources are exported, ______ little is built at home. (1 pt)`,
      `Essay (about 120 words): "Natural resources can be a blessing or a curse for a country." Discuss.`),
    solution: `**I. READING**
1. **Africa is a rich continent with poor people.**
2. **Oil, gold, diamonds** (any two).
3. **Schools and hospitals.**
4. It means **transforming resources into roads, jobs and knowledge for the benefit of the whole population**.
5. **transforming**

**II. LANGUAGE**
a) **has built** (since → present perfect)
b) **richest**
c) **by** (agent du passif)
d) **development**
e) **so** (ou therefore)

**III. WRITING — modèle (≈ 125 mots)**

Natural resources such as oil, timber or gold can bring great wealth to a country. They provide money to build roads, schools and hospitals, and they create jobs. In this case, they are a real blessing.

However, resources can also become a curse. When a country depends only on exporting raw materials, its economy suffers each time prices fall. Moreover, if the money is badly managed or stolen by corruption, the population stays poor while a few people get rich. Mining and logging can also destroy the environment.

In my opinion, resources are neither a blessing nor a curse in themselves: everything depends on how they are managed. With good governance, transformation at home and investment in education, they can truly develop a nation.`,
  },
  {
    title: 'BAC paper 3 — Music and sports',
    difficulty: 2,
    statement: paper(3, 'Music and sports',
      `> A champion is not born; a champion is made. Behind every medal there are years of early mornings, hard training and painful defeats. The same is true of a great musician, who practises long hours before the applause. Talent opens the door, but only discipline carries you through it.`,
      `1. According to the text, is a champion "born" or "made"? (2 pts)
2. What lies "behind every medal"? (2 pts)
3. What is said about a great musician? (2 pts)
4. Explain the last sentence in your own words. (2 pts)
5. Find a word meaning "regular practice in order to improve". (2 pts)`,
      `a) Simple past: He ______ (win) the race last Sunday. (1 pt)
b) Past habit: When she was a child, she ______ sing in a choir. (1 pt)
c) Relative pronoun: The player ______ scored the goal is only seventeen. (1 pt)
d) Give the adverb that means "with a lot of effort": He works very ______. (1 pt)
e) Connector: He trained hard; ______, he won. (therefore / although) (1 pt)`,
      `Paragraph (about 100 words): Describe a sportsperson or a musician you admire and explain why.`),
    solution: `**I. READING**
1. **A champion is made**, not born.
2. **Years of early mornings, hard training and painful defeats.**
3. **He practises long hours before the applause.**
4. **Talent helps you to start, but you succeed only if you work regularly and seriously.**
5. **training**

**II. LANGUAGE**
a) **won**
b) **used to**
c) **who** (ou that)
d) **hard** (attention : hardly signifie « à peine »)
e) **therefore**

**III. WRITING — modèle (≈ 105 mots)**

The musician I admire most is a young guitarist from my neighbourhood who now plays in a famous rumba orchestra. When he was a child, he used to make guitars with old tins and fishing lines. His family was poor, but he practised every evening after school. At sixteen, he won a music competition in Brazzaville, and a band leader noticed his talent. Today he performs all over Africa. I admire him because he never gave up, even when people laughed at his old guitar. He shows that discipline and passion can turn a dream into a career.`,
  },
  {
    title: 'BAC paper 4 — The North/South divide',
    difficulty: 2,
    statement: paper(4, 'The North/South divide',
      `> The gap between rich and poor nations did not appear by chance. For centuries, the South has supplied cheap raw materials, while the North has sold back expensive goods. Fair trade and regional cooperation can slowly change this, but only if Southern countries invest in education and process their own products.`,
      `1. Did the gap between rich and poor nations appear by chance? Justify. (2 pts)
2. What has the South supplied? (2 pts)
3. What has the North sold back? (2 pts)
4. What two things can slowly change the situation, and on what condition? (2 pts)
5. Find a word meaning "working together". (2 pts)`,
      `a) Put into the passive: The South supplies raw materials. (1 pt)
b) Comparative: Rich nations are ______ (powerful) than poor ones. (1 pt)
c) Give the opposite with a prefix: fair → ______ (1 pt)
d) Connector of contrast: The South is rich in resources; ______, it stays poor. (1 pt)
e) Give a noun from "cooperate": ______ (1 pt)`,
      `Essay (about 120 words): How can African countries reduce their dependence on richer nations?`),
    solution: `**I. READING**
1. **No.** "The gap between rich and poor nations did not appear by chance": for centuries, trade has been unequal.
2. **Cheap raw materials.**
3. **Expensive goods.**
4. **Fair trade and regional cooperation**, but **only if Southern countries invest in education and process their own products**.
5. **cooperation**

**II. LANGUAGE**
a) **Raw materials are supplied by the South.**
b) **more powerful**
c) **unfair**
d) **however** (ou nevertheless)
e) **cooperation**

**III. WRITING — modèle (≈ 125 mots)**

African countries are rich in resources, yet they still depend on richer nations for money, technology and manufactured goods. How can they become more independent?

First of all, they must invest in education and training. Skilled engineers and technicians are needed to build factories and to stop the brain drain.

Secondly, they should process their raw materials at home. Selling chocolate instead of cocoa beans, or furniture instead of logs, keeps the added value and creates jobs.

Moreover, African countries can trade more with one another. Regional cooperation makes them stronger when they negotiate with powerful partners.

To conclude, dependence will not disappear overnight. However, with education, local industry and cooperation, Africa can take its future into its own hands.`,
  },
  {
    title: 'BAC paper 5 — Famous lives',
    difficulty: 3,
    statement: paper(5, 'Famous lives',
      `> Those we remember longest are rarely those who had the most money. We remember men and women who served others: leaders who fought for freedom, doctors who healed the poor, teachers who opened minds. Their true wealth was courage and generosity, and that wealth never dies.`,
      `1. According to the text, who do we "remember longest"? (2 pts)
2. Give two examples of people we remember. (2 pts)
3. What was their "true wealth"? (2 pts)
4. Explain: "that wealth never dies". (2 pts)
5. Find a word meaning "bravery". (2 pts)`,
      `a) Past perfect: Before he became famous, he ______ (work) for the poor for years. (1 pt)
b) Relative pronoun: The doctor ______ healed them is admired by everybody. (1 pt)
c) Reported speech: "I will serve my country," she said. → She said that she ______ serve her country. (1 pt)
d) Give a noun from "generous": ______ (1 pt)
e) Connector: He had no money; ______, he was admired by all. (nevertheless / so) (1 pt)`,
      `Biography (about 120 words): Write about the life of a person you admire.`),
    solution: `**I. READING**
1. **Men and women who served others** (rarely those who had the most money).
2. **Leaders who fought for freedom, doctors who healed the poor, teachers who opened minds** (any two).
3. **Courage and generosity.**
4. **Their example and their influence continue after their death: people still remember them and are inspired by them.**
5. **courage**

**II. LANGUAGE**
a) **had worked** (past perfect : action antérieure à « became famous »)
b) **who** (ou that)
c) **would** (will → would au discours rapporté)
d) **generosity**
e) **nevertheless** (opposition)

**III. WRITING — modèle (≈ 125 mots)**

The person I admire most is Wangari Maathai, a Kenyan woman who changed her country by planting trees.

She was born in 1940 in a small village. At that time, few girls went to school, but her brother convinced their parents to send her. She became a brilliant student and, in 1971, she was the first woman in East and Central Africa to earn a doctorate.

In 1977, she founded the Green Belt Movement, which paid women to plant trees. Tens of millions of trees were planted. She also fought for democracy and was arrested several times, but she never gave up. In 2004, she received the Nobel Peace Prize.

I admire her because she proved that one determined person can change a whole nation.`,
  },
  {
    title: 'BAC paper 6 — Transport',
    difficulty: 2,
    statement: paper(6, 'Transport',
      `> In many African cities, the morning rush hour means long traffic jams and polluted air. The cause is simple: too many private cars and too few buses. Experts agree that good public transport is the real solution. One modern bus can replace dozens of cars, saving time, fuel and clean air at the same time.`,
      `1. What does the morning rush hour mean in many African cities? (2 pts)
2. What is the "simple" cause of the problem? (2 pts)
3. What is "the real solution" according to experts? (2 pts)
4. What can one modern bus replace? What does it save? (2 pts)
5. Find an expression meaning "the time of day when traffic is heaviest". (2 pts)`,
      `a) First conditional: If the city ______ (buy) more buses, traffic ______ (fall). (2 pts)
b) Will or going to? Look at the plans: they ______ build a new road. (1 pt)
c) Comparative: Buses are ______ (cheap) than taxis. (1 pt)
d) Connector of purpose: They bought new buses ______ reduce traffic. (in order to / because) (1 pt)`,
      `Report (about 120 words): Suggest three ways to improve transport in your area.`),
    solution: `**I. READING**
1. **Long traffic jams and polluted air.**
2. **Too many private cars and too few buses.**
3. **Good public transport.**
4. It can replace **dozens of cars**; it saves **time, fuel and clean air**.
5. **the (morning) rush hour**

**II. LANGUAGE**
a) If the city **buys** more buses, traffic **will fall**. (présent après if, will dans la principale)
b) **are going to** (évidence visible : les plans)
c) **cheaper**
d) **in order to** (but)

**III. WRITING — modèle (≈ 125 mots)**

**Improving transport in our area**

**Introduction.** The aim of this report is to suggest three ways to make transport in our area faster and safer.

**Current situation.** Every morning, the main avenue is blocked by cars, minibuses and motorbike taxis. Accidents are frequent, and the air is polluted.

**Recommendations.** First, the council should create a bus lane on the main avenue, so that buses can move quickly. Secondly, the potholes must be repaired and traffic lights installed at the busiest crossroads. Thirdly, helmets should be compulsory for motorbike riders and their passengers.

**Conclusion.** If these measures are adopted, journeys will be shorter, there will be fewer accidents and the air will be cleaner.`,
  },
  {
    title: 'BAC paper 7 — Demographic, ecological and social problems',
    difficulty: 2,
    statement: paper(7, 'Demographic, ecological and social problems',
      `> Our forests are disappearing. Every year, trees are cut down for wood and farmland, and they are rarely replaced. Without forests, the soil grows poor, rivers dry up and the climate changes. Protecting trees is therefore not a luxury but a necessity. Planting a tree today is a gift to tomorrow's children.`,
      `1. What is happening to the forests? (2 pts)
2. Why are trees cut down? (2 pts)
3. Name two consequences of losing forests. (2 pts)
4. Is protecting trees "a luxury"? Justify with the text. (2 pts)
5. Find a word meaning "something that is absolutely needed". (2 pts)`,
      `a) Put into the passive: People cut down thousands of trees every year. (1 pt)
b) Connector of consequence: Forests disappear; ______ the soil grows poor. (1 pt)
c) Give the opposite with a prefix: appear → ______ (1 pt)
d) Modal of obligation: We ______ protect the forests. (1 pt)
e) Give a noun from "protect": ______ (1 pt)`,
      `Essay (about 120 words): What can young people do to protect the environment?`),
    solution: `**I. READING**
1. **They are disappearing.**
2. **For wood and farmland.**
3. **The soil grows poor, rivers dry up and the climate changes** (any two).
4. **No.** "Protecting trees is therefore not a luxury but a necessity."
5. **a necessity**

**II. LANGUAGE**
a) **Thousands of trees are cut down every year.**
b) **so** (ou therefore, as a result)
c) **disappear**
d) **must** (ou have to)
e) **protection**

**III. WRITING — modèle (≈ 125 mots)**

Young people often think that the environment is the government's business. In fact, they can do a lot to protect it.

First, they can change their daily habits. They can refuse plastic bags, avoid wasting water and electricity, and throw their rubbish in bins instead of in the gutters.

Secondly, they can act together. School environment clubs can clean beaches and streets, and plant trees around schools. For example, in Pointe-Noire, pupils have collected hundreds of bags of plastic on the Côte Sauvage.

Finally, young people can raise awareness in their families, explaining why burning rubbish or cutting trees is dangerous.

To conclude, small actions repeated by millions of young people can make a big difference. The planet is our home: we must protect it.`,
  },
  {
    title: 'BAC paper 8 — Employment',
    difficulty: 2,
    statement: paper(8, 'Employment',
      `> Finding a first job is hard, but waiting for one is harder. Many young graduates now choose to create their own work instead of waiting for an employer. With a small idea, some courage and basic training, they open shops, workshops and farms. In doing so, they not only find a job — they create jobs for others too.`,
      `1. What is "harder" than finding a first job? (2 pts)
2. What do many young graduates now choose to do? (2 pts)
3. What three things do they need to start? (2 pts)
4. What do they create "for others"? (2 pts)
5. Find a word meaning "a place where things are made or repaired". (2 pts)`,
      `a) Present perfect: She ______ (start) her own business. (1 pt)
b) Formal letter: after "Dear Sir or Madam," you end with "Yours ______". (1 pt)
c) Relative pronoun: The young man ______ opened the shop is my cousin. (1 pt)
d) Connector: He had no job, ______ he created one. (1 pt)
e) Give a noun from "employ" for the person who gives work: ______ (1 pt)`,
      `Formal letter (about 120 words): Apply for a holiday job of your choice.`),
    solution: `**I. READING**
1. **Waiting for one** (a job).
2. **They choose to create their own work** instead of waiting for an employer.
3. **A small idea, some courage and basic training.**
4. **Jobs.**
5. **a workshop**

**II. LANGUAGE**
a) **has started**
b) **faithfully** (nom inconnu)
c) **who** (ou that)
d) **so**
e) **employer** (employee = le salarié)

**III. WRITING — modèle (≈ 125 mots)**

Dear Sir or Madam,

I am writing to apply for the position of shop assistant advertised at the entrance of your supermarket.

I am eighteen and I am a student in Terminale D. For two years, I have helped my mother in her shop at the market at weekends. I have learnt to serve customers, to handle money and to keep the shelves tidy.

I am very interested in working in your supermarket, because I enjoy meeting people and I would like to gain experience before going to university. I am punctual, polite and hard-working, and I do not mind working at weekends.

I am available from 1 July to 31 August. I would be glad to attend an interview at your convenience. I look forward to hearing from you.

Yours faithfully,

Prisca Moukala`,
  },
  {
    title: 'BAC paper 9 — Politics',
    difficulty: 2,
    statement: paper(9, 'Politics',
      `> Democracy is more than an election day. It is the daily behaviour of citizens who respect the law, pay their taxes and refuse corruption. Leaders must be honest and accountable, but citizens too have duties. A country is strong not only because of its leaders, but because of its people.`,
      `1. Democracy is "more than" what? (2 pts)
2. Give two daily behaviours of good citizens. (2 pts)
3. What must leaders be? (2 pts)
4. What does the text say about a country's strength? (2 pts)
5. Find a word meaning "who must explain and justify their actions". (2 pts)`,
      `a) Modal of obligation: Citizens ______ respect the law. (1 pt)
b) Modal of prohibition: Leaders ______ steal public money. (1 pt)
c) Opinion phrase: Corruption is harmful. → In my ______, corruption is harmful. (1 pt)
d) Connector of addition: Leaders have duties; ______, citizens have duties too. (1 pt)
e) Give a noun from "corrupt": ______ (1 pt)`,
      `Essay (about 120 words): What qualities make a good leader?`),
    solution: `**I. READING**
1. **An election day.**
2. **Respecting the law, paying taxes, refusing corruption** (any two).
3. **Honest and accountable.**
4. **A country is strong not only because of its leaders, but because of its people.**
5. **accountable**

**II. LANGUAGE**
a) **must** (ou have to)
b) **mustn't**
c) **opinion**
d) **moreover** (ou in addition, furthermore)
e) **corruption**

**III. WRITING — modèle (≈ 125 mots)**

Whether in a class, a town or a country, leaders have a great influence on people's lives. What qualities do they need?

First of all, a good leader must be honest. Citizens have to trust their leaders, and trust disappears as soon as there is corruption.

Secondly, a good leader has to listen. A mayor or a class delegate must know the real problems of the people before making decisions.

Moreover, a good leader must be accountable: he or she has to explain decisions and respect the law. Nelson Mandela, for example, chose to leave power after only one term.

To sum up, honesty, listening and accountability make a good leader. In my opinion, honesty is the most important quality, because without trust, nothing can be built.`,
  },
  {
    title: 'BAC paper 10 — Development and health',
    difficulty: 3,
    statement: paper(10, 'Development and health',
      `> A nation's greatest wealth is not its gold but its people. A child who is well fed, healthy and educated will one day build roads, cure the sick and teach others. This is why spending on health and education is never a waste: it is the wisest investment a country can make in its own future.`,
      `1. According to the text, what is "a nation's greatest wealth"? (2 pts)
2. What will a well-fed, healthy and educated child do one day? (3 pts)
3. Why is spending on health and education "never a waste"? (2 pts)
4. What is called "the wisest investment"? (2 pts)
5. Find a word meaning "money spent today to obtain a future benefit". (1 pt)`,
      `a) Superlative: It is the ______ (wise) investment. (1 pt)
b) Put into the passive: A country makes this investment. (1 pt)
c) Relative pronoun: A child ______ is educated helps the nation. (1 pt)
d) Connector of cause: We spend money on schools ______ children are the future. (1 pt)
e) Give a noun from "educate": ______ (1 pt)`,
      `Essay (about 120 words): "Health and education are the best investments a country can make." Do you agree?`),
    solution: `**I. READING**
1. **Its people** (not its gold).
2. **He or she will build roads, cure the sick and teach others.**
3. Because **it is the wisest investment a country can make in its own future**: healthy, educated children will build the nation.
4. **Spending on health and education.**
5. **investment**

**II. LANGUAGE**
a) **wisest**
b) **This investment is made by a country.**
c) **who** (ou that)
d) **because**
e) **education**

**III. WRITING — modèle (≈ 125 mots)**

I fully agree that health and education are the best investments a country can make.

First, a healthy population can work and produce. When children are vaccinated and well fed, they miss school less often, and adults can work without interruption.

Secondly, education trains the doctors, engineers, teachers and entrepreneurs a country needs. Educated citizens find better jobs, start businesses and understand their rights and duties.

Of course, roads, factories and electricity are also necessary. However, they cannot be built or managed without healthy and educated people.

To conclude, money spent on hospitals and schools is never wasted. In my opinion, a country that invests in its children prepares the strongest future possible.`,
  },
  {
    title: 'Short reading texts 1 to 5 — quick training',
    difficulty: 1,
    statement: `**Entraînement rapide au Reading.** Lis chaque texte et réponds aux questions par des phrases complètes.

**Text 1 — Food and health**
> Many students skip breakfast, thinking they save time. In fact, they lose energy and concentration for the whole morning. The brain needs fuel to work, and breakfast is the best fuel of the day. A simple meal of bread, fruit and milk is enough. Students who eat a good breakfast remember their lessons better and feel less tired. So the few minutes "saved" by skipping breakfast are, in truth, minutes lost.

1. Why do students skip breakfast? 2. What does the brain need to work? 3. Give an example of a simple breakfast. 4. What advantage do students who eat breakfast have? 5. Why are the minutes "saved" really "lost"?

**Text 2 — Development**
> A road is more than stones and tar. When a new road reaches a village, children can go to school more easily, farmers can sell their crops in town, and sick people can reach a hospital. In this way, a single road can change many lives at once. This is why development experts say that infrastructure is the backbone of progress: without roads, water and electricity, even the best ideas stay on paper.

1. A road is "more than" what? 2. Name three changes a new road brings to a village. 3. What do experts call infrastructure? 4. What three examples of infrastructure are given? 5. What happens to ideas without infrastructure?

**Text 3 — Music and sports**
> When the national team plays, something strange happens: people who never speak to each other suddenly become friends. In the street, in the market, everyone talks about the same match. For ninety minutes, differences of tribe, religion and wealth seem to disappear. This is the hidden power of sport: it unites a nation around a shared emotion. Music does the same thing. A popular song can bring a whole country to its feet.

1. What "strange" thing happens during a national match? 2. Where do people talk about the match? 3. What differences "seem to disappear"? 4. What is "the hidden power of sport"? 5. What can music do, according to the text?

**Text 4 — The North/South divide**
> A farmer in the South grows cocoa and sells it very cheaply. Thousands of kilometres away, in the North, a factory turns that same cocoa into expensive chocolate. The farmer earns a few coins; the factory earns a fortune. This simple story explains much of the North/South divide. The solution is not charity but justice: if Southern countries could process their own raw materials, they would keep the profit at home.

1. What does the Southern farmer grow, and how does he sell it? 2. What does the Northern factory do with the cocoa? 3. Compare what each one earns. 4. What does this story explain? 5. What solution does the text propose?

**Text 5 — Famous lives**
> Wangari Maathai was a woman from Kenya who understood a simple truth: to protect people, you must protect nature. She founded a movement that planted millions of trees. At first people laughed, then they followed her. In 2004 she received the Nobel Peace Prize — the first African woman to do so. Her life proves that one determined person, armed only with an idea and courage, can change a nation.

1. Where was Wangari Maathai from? 2. What "simple truth" did she understand? 3. What did her movement do? 4. What prize did she receive, and when? 5. What does her life prove?`,
    solution: `**Text 1.** 1. **To save time.** 2. **Fuel** (food, energy). 3. **Bread, fruit and milk.** 4. **They remember their lessons better and feel less tired.** 5. Because **they lose energy and concentration for the whole morning**.

**Text 2.** 1. **More than stones and tar.** 2. **Children can go to school more easily, farmers can sell their crops in town, sick people can reach a hospital.** 3. **The backbone of progress.** 4. **Roads, water and electricity.** 5. **They stay on paper** (they are never realised).

**Text 3.** 1. **People who never speak to each other suddenly become friends.** 2. **In the street and in the market.** 3. **Differences of tribe, religion and wealth.** 4. **It unites a nation around a shared emotion.** 5. **A popular song can bring a whole country to its feet** (unite it).

**Text 4.** 1. He grows **cocoa** and sells it **very cheaply**. 2. It **turns it into expensive chocolate**. 3. **The farmer earns a few coins; the factory earns a fortune.** 4. **Much of the North/South divide.** 5. **Justice, not charity: Southern countries should process their own raw materials** to keep the profit at home.

**Text 5.** 1. **From Kenya.** 2. **To protect people, you must protect nature.** 3. **It planted millions of trees.** 4. **The Nobel Peace Prize, in 2004.** 5. **One determined person, with an idea and courage, can change a nation.**`,
  },
  {
    title: 'Short reading texts 6 to 10 — quick training',
    difficulty: 1,
    statement: `**Entraînement rapide au Reading.** Lis chaque texte et réponds aux questions par des phrases complètes.

**Text 6 — Transport**
> In our growing cities, the same scene repeats every morning: long lines of cars, horns, and clouds of smoke. People spend hours in traffic instead of being at work or at school. The problem is not that there are too many people, but too few good buses and trains. A single bus can carry fifty passengers; fifty cars carry the same fifty people, but fill the whole road. The answer to traffic is not wider roads, but better public transport.

1. What scene repeats every morning? 2. Where should people be, instead of in traffic? 3. According to the text, what is the real problem? 4. Compare a bus and fifty cars. 5. What is "the answer to traffic"?

**Text 7 — Demographic, ecological and social problems**
> Every year, our cities grow by thousands of new arrivals. They come from the countryside, hoping for a better life. But when a city grows faster than its houses, schools and jobs, slums appear at its edges. There, families live without clean water or electricity. The solution is not to close the cities, but to develop the countryside too, so that people are not forced to leave their villages. Balanced development is the best answer to uncontrolled urban growth.

1. Who are the "new arrivals", and where do they come from? 2. Why do they come to the city? 3. When do slums appear? 4. What do families in slums live without? 5. What solution does the text propose?

**Text 8 — Employment**
> Awa finished school with good results but could not find a job for two years. Instead of waiting, she used her small savings to buy a sewing machine. She began making clothes for her neighbours. Today she owns a small workshop and employs three young people. Awa's story shows that, in a country where jobs are rare, creating your own work is sometimes the wisest choice. Self-employment turns a job-seeker into a job-maker.

1. What was Awa's situation after school? 2. What did she buy with her savings? 3. What did she begin to do? 4. What does she own today, and whom does she employ? 5. Explain the last sentence.

**Text 9 — Politics**
> Some young people say: "Politics is not my business." But politics decides the price of bread, the quality of schools and the safety of streets. To ignore politics is to let others decide your life for you. Being a good citizen does not mean shouting the loudest; it means voting, respecting the law, paying taxes and refusing corruption. Democracy is not a gift that leaders give; it is a garden that citizens must water every day.

1. What do some young people say about politics? 2. Name three things politics decides. 3. What does it mean "to ignore politics"? 4. What does being a good citizen mean, according to the text? 5. Explain the image of the "garden".

**Text 10 — Health and development**
> Clean water is the simplest medicine in the world. Many diseases that fill our hospitals come from dirty water. Where families can drink safe water, children fall ill less often and go to school more regularly. This is why bringing clean water to a village is at the same time a question of health and of development. Sometimes the greatest progress does not come from complicated machines, but from a simple, clean well.

1. What is called "the simplest medicine in the world"? 2. Where do many diseases come from? 3. What happens where families drink safe water? 4. Why is clean water a question of both health and development? 5. What does the last sentence suggest about progress?`,
    solution: `**Text 6.** 1. **Long lines of cars, horns and clouds of smoke** (traffic jams). 2. **At work or at school.** 3. **Too few good buses and trains** (not too many people). 4. **A bus carries fifty passengers; fifty cars carry the same people but fill the whole road.** 5. **Better public transport, not wider roads.**

**Text 7.** 1. **People from the countryside.** 2. **They hope for a better life.** 3. **When a city grows faster than its houses, schools and jobs.** 4. **Clean water and electricity.** 5. **To develop the countryside too** (balanced development), so that people are not forced to leave their villages.

**Text 8.** 1. **She had good results but could not find a job for two years.** 2. **A sewing machine.** 3. **Making clothes for her neighbours.** 4. **A small workshop; she employs three young people.** 5. **When you create your own work, you stop looking for a job and you start creating jobs for others.**

**Text 9.** 1. **"Politics is not my business."** 2. **The price of bread, the quality of schools, the safety of streets.** 3. **To let others decide your life for you.** 4. **Voting, respecting the law, paying taxes and refusing corruption.** 5. **Democracy is not given once and for all by leaders: citizens must take care of it every day, like a garden that needs water.**

**Text 10.** 1. **Clean water.** 2. **From dirty water.** 3. **Children fall ill less often and go to school more regularly.** 4. Because **healthier children go to school more regularly**, which helps development. 5. **Great progress can come from simple things, like a clean well, not only from complicated machines.**`,
  },
  {
    title: 'Language drill — Past perfect and reported speech',
    difficulty: 3,
    statement: `Ces deux points n'ont pas d'unité propre : révise-les dans la leçon « Reference grammar » (§1 et §4).

**A. Past perfect ou prétérit ? Mets les verbes à la bonne forme.**
1. When we arrived at the station, the train ______ (already / leave).
2. She ______ (pass) her baccalaureate before she ______ (find) a job.
3. I ______ (never / see) the sea before I ______ (go) to Pointe-Noire.
4. After the volunteers ______ (clean) the beach, they ______ (have) lunch together.

**B. Mets au discours rapporté.**
5. "I am tired," he said. → He said that ______.
6. "We will build a new school," the mayor said. → The mayor said that ______.
7. "I have lost my ID card," Prisca said. → Prisca said that ______.
8. "Where do you live?" she asked me. → She asked me ______.
9. "Are you ready?" the teacher asked us. → The teacher asked us ______.
10. "Don't shout!" the coach told the players. → The coach told the players ______.`,
    solution: `**A.**
1. the train **had already left** (il était parti avant notre arrivée)
2. She **had passed** her baccalaureate before she **found** a job.
3. I **had never seen** the sea before I **went** to Pointe-Noire.
4. After the volunteers **had cleaned** the beach, they **had** lunch together.

**B.**
5. He said that **he was tired**. (am → was)
6. The mayor said that **they would build a new school**. (will → would)
7. Prisca said that **she had lost her ID card**. (present perfect → past perfect)
8. She asked me **where I lived**. (pas d'inversion, do disparaît)
9. The teacher asked us **if (whether) we were ready**.
10. The coach told the players **not to shout**. (ordre négatif : not to + base)`,
  },
  {
    title: 'Language drill — The four conditionals',
    difficulty: 3,
    statement: `Révise d'abord la leçon « Reference grammar » (§2).

**A. Mets les verbes à la bonne forme (type indiqué).**
1. (type 0) If you ______ (heat) water to 100 °C, it ______ (boil).
2. (type 1) If it ______ (rain) tomorrow, the match ______ (be) cancelled.
3. (type 2) If I ______ (be) the president, I ______ (build) a hospital in every town.
4. (type 2) If she ______ (have) more money, she ______ (start) a business.
5. (type 3) If he ______ (study) harder, he ______ (pass) his exam last year.
6. (type 3) If we ______ (leave) earlier, we ______ (not / miss) the train.

**B. Quel type ? Explique le sens de chaque phrase en français.**
7. If I win the competition, I will buy a guitar.
8. If I won the competition, I would buy a guitar.
9. If I had won the competition, I would have bought a guitar.`,
    solution: `**A.**
1. If you **heat** water to 100 °C, it **boils**.
2. If it **rains** tomorrow, the match **will be** cancelled.
3. If I **were** the president, I **would build** a hospital in every town.
4. If she **had** more money, she **would start** a business.
5. If he **had studied** harder, he **would have passed** his exam last year.
6. If we **had left** earlier, we **would not (wouldn't) have missed** the train.

**B.**
7. **Type 1** : condition réelle et possible. « Si je gagne le concours, j'achèterai une guitare » (c'est possible).
8. **Type 2** : situation imaginaire. « Si je gagnais le concours, j'achèterais une guitare » (c'est peu probable ou hypothétique).
9. **Type 3** : situation passée qui ne s'est pas réalisée (regret). « Si j'avais gagné le concours, j'aurais acheté une guitare » (mais je n'ai pas gagné).`,
  },
  {
    title: 'Language drill — Word formation and connectors',
    difficulty: 2,
    statement: `Révise d'abord la leçon « Reference grammar » (§10 et §11).

**A. Donne le contraire avec un préfixe.**
1. possible → ______ 2. legal → ______ 3. agree → ______ 4. regular → ______ 5. employed → ______

**B. Donne le mot demandé.**
6. noun from "educate" → ______
7. noun from "happy" → ______
8. adjective from "danger" → ______
9. adjective meaning "without use" → ______
10. adverb from "careful" → ______

**C. Choisis le connecteur qui convient : however, because of, so that, although, therefore.**
11. ______ he was tired, he finished his homework.
12. The match was cancelled ______ the rain.
13. She saved money ______ she could buy a sewing machine.
14. Prices have risen. ______, many families cannot buy meat.
15. The country is rich in oil. ______, many people are still poor.`,
    solution: `**A.**
1. **impossible** 2. **illegal** 3. **disagree** 4. **irregular** 5. **unemployed**

**B.**
6. **education**
7. **happiness**
8. **dangerous**
9. **useless**
10. **carefully**

**C.**
11. **Although** (opposition + phrase)
12. **because of** (cause + nom)
13. **so that** (but + phrase)
14. **Therefore** (conséquence)
15. **However** (opposition, en début de phrase)`,
  },
]

export const qcm = {
  title: 'BAC blanc — Language (20 questions)',
  time_limit_sec: 1200,
  questions: [
    { prompt: 'She ______ in Brazzaville since 2015.', options: ['lives', 'lived', 'has lived', 'is living'], correct_index: 2, explanation: 'Since + point de départ → present perfect.' },
    { prompt: 'I ______ him yesterday at the market.', options: ['have seen', 'saw', 'see', 'had seen'], correct_index: 1, explanation: 'Moment passé précis (yesterday) → prétérit, jamais present perfect.' },
    { prompt: 'When we arrived, the film ______.', options: ['already started', 'has already started', 'had already started', 'already starts'], correct_index: 2, explanation: 'Action antérieure à une autre action passée → past perfect.' },
    { prompt: 'If it ______ tomorrow, we will stay at home.', options: ['will rain', 'rains', 'rained', 'would rain'], correct_index: 1, explanation: 'Conditionnel de type 1 : If + présent.' },
    { prompt: 'If I ______ rich, I would build a school.', options: ['am', 'will be', 'were', 'had been'], correct_index: 2, explanation: 'Type 2 : If + prétérit (were à toutes les personnes).' },
    { prompt: 'If he had studied, he ______ the exam.', options: ['would pass', 'will pass', 'would have passed', 'passed'], correct_index: 2, explanation: 'Type 3 : If + past perfect, would have + participe passé.' },
    { prompt: 'Passive: "They built the bridge in 1990."', options: ['The bridge is built in 1990.', 'The bridge was built in 1990.', 'The bridge was build in 1990.', 'The bridge has built in 1990.'], correct_index: 1, explanation: 'Prétérit passif : was + participe passé (built).' },
    { prompt: '"I am tired," he said. → He said that he ______ tired.', options: ['is', 'was', 'has been', 'will be'], correct_index: 1, explanation: 'Discours rapporté : présent → prétérit.' },
    { prompt: '"Where do you live?" she asked. → She asked me where ______.', options: ['do I live', 'I lived', 'did I live', 'I live'], correct_index: 1, explanation: 'Question rapportée : pas d\'inversion, recul du temps.' },
    { prompt: 'He ______ me that he was ready.', options: ['said', 'told', 'spoke', 'asked'], correct_index: 1, explanation: 'Tell + personne ; say n\'a pas de complément de personne direct.' },
    { prompt: 'The woman ______ son won the prize is a teacher.', options: ['who', 'which', 'whose', 'where'], correct_index: 2, explanation: 'Possession → whose.' },
    { prompt: 'Education is ______ way to develop a country.', options: ['the better', 'the best', 'the most good', 'the goodest'], correct_index: 1, explanation: 'good → better → the best.' },
    { prompt: 'You ______ smoke in the hospital. It is forbidden.', options: ['don\'t have to', 'mustn\'t', 'shouldn\'t to', 'needn\'t'], correct_index: 1, explanation: 'Interdiction → mustn\'t.' },
    { prompt: 'I look forward to ______ from you.', options: ['hear', 'hearing', 'heard', 'be heard'], correct_index: 1, explanation: 'Look forward to + -ing.' },
    { prompt: 'There isn\'t ______ water in the tank.', options: ['many', 'a few', 'much', 'few'], correct_index: 2, explanation: 'Water est indénombrable → much (à la forme négative).' },
    { prompt: '______ is important for development.', options: ['The education', 'An education', 'Education', 'A education'], correct_index: 2, explanation: 'Nom indénombrable pris en général → pas d\'article.' },
    { prompt: '______ it was raining, they played the match.', options: ['Because', 'Although', 'So', 'Therefore'], correct_index: 1, explanation: 'Opposition + phrase → although.' },
    { prompt: 'The road was closed ______ the flood.', options: ['because', 'because of', 'although', 'so that'], correct_index: 1, explanation: 'Cause + nom → because of.' },
    { prompt: 'The opposite of "legal" is:', options: ['unlegal', 'inlegal', 'illegal', 'dislegal'], correct_index: 2, explanation: 'Devant l : préfixe il-.' },
    { prompt: 'The noun from "develop" is:', options: ['developation', 'development', 'developness', 'developity'], correct_index: 1, explanation: 'Suffixe -ment.' },
  ],
}
