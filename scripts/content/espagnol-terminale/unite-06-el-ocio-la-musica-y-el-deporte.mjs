/**
 * Espagnol Terminale A — Unité 6 : El ocio, la música y el deporte (Les loisirs, la
 * musique et le sport).
 *
 * Même gabarit que les unités 1 à 5. Notion de grammaire unique : le pretérito
 * indefinido (jugué, fui, tuve) pour raconter des faits passés et terminés, opposé
 * au pretérito perfecto vu à l'unité 4. Thème issu de la méthode fournie par
 * l'utilisateur (pas de programme INRAP d'espagnol disponible).
 */

export const unit = {
  chapterTitle: 'UNIDAD 6 — EL OCIO, LA MÚSICA Y EL DEPORTE / LES LOISIRS, LA MUSIQUE ET LE SPORT',
  description: 'ESPAGNOL · UNIDAD 6 — El ocio, la música y el deporte · raconter ses loisirs · le pretérito indefinido',
  order: 6,
}

export const lessons = [
  {
    type: 'cours',
    title: 'Unidad 6 — Introducción : El ocio, la música y el deporte',
    content: `## El ocio, la música y el deporte — Les loisirs, la musique et le sport

**Niveau :** Terminale A (espagnol, deuxième langue) · **Durée conseillée :** 4 séances de 45 à 90 minutes

### Pourquoi ce thème ?

Le week-end, on joue au football sur un terrain de quartier, on danse sur de la rumba, on va à un concert, on regarde un match. La musique et le sport sont des loisirs, mais aussi une **culture** : la rumba congolaise et le flamenco espagnol sont tous deux inscrits au patrimoine culturel immatériel de l'humanité. Dans cette unité, tu vas apprendre à **parler de tes loisirs**, à **dire ce que tu aimes** et surtout à **raconter** un match, un concert ou un week-end passé avec le **pretérito indefinido**, le temps du récit en espagnol.

### Objectifs — À la fin de l'unité, tu pourras :

- **utiliser** le vocabulaire des loisirs, de la musique et du sport (≈ 45 mots) et exprimer tes goûts (me gusta, me encanta, prefiero) ;
- **raconter des faits passés et terminés** avec le **pretérito indefinido** (jugué, fuimos, tuvo) et le distinguer du pretérito perfecto ;
- **comprendre** un récit de week-end et un texte sur la rumba et le flamenco ;
- **raconter** un souvenir de match ou de concert à l'oral ;
- **écrire** un récit de 120 à 150 mots : « Un fin de semana inolvidable ».

### Le parcours de l'unité

| Étape | Ce que tu fais | Compétence |
|---|---|---|
| 1. Vocabulario | Loisirs, musique, sport, goûts | Lexique |
| 2. Gramática | Le pretérito indefinido | Langue |
| 3. Escuchar | « ¿Qué hiciste el fin de semana? » | Comprendre à l'oral |
| 4. Leer | « La rumba y el flamenco, patrimonio de la humanidad » | Comprendre à l'écrit |
| 5. Hablar | Raconter un souvenir, débat sur le sport | S'exprimer à l'oral |
| 6. Escribir | « Un fin de semana inolvidable » | S'exprimer à l'écrit |
| 7. Ejercicios | Exercices corrigés (bouton en bas de page) | Entraînement |
| 8. Test | QCM de fin d'unité, 20 questions | Évaluation |

### Pour te lancer — Calentamiento

- ¿Qué haces en tu tiempo libre?
- ¿Qué música te gusta? ¿Quién es tu cantante favorito?
- ¿Practicas algún deporte?`,
  },
  {
    type: 'cours',
    title: 'Vocabulario — El ocio, la música y el deporte',
    content: `## Vocabulario — Le vocabulaire de l'unité

Apprends ces mots par groupes de 10 et lis les exemples à voix haute.

### 1. El ocio — Les loisirs

| Español | Prononciation | Français | Catégorie | Ejemplo |
|---|---|---|---|---|
| el tiempo libre / el ocio | /ˈoθjo/ | le temps libre / les loisirs | nom | En mi tiempo libre, leo. |
| el fin de semana | /fin de seˈmana/ | le week-end | nom | El fin de semana voy a la playa. |
| salir con los amigos | /saˈliɾ/ | sortir avec les amis | verbe | Los sábados salgo con mis amigos. |
| ir de fiesta | /ˈfjesta/ | faire la fête | verbe | Fuimos de fiesta el sábado. |
| ver una película / una serie | /peˈlikula/ | regarder un film / une série | verbe | Vimos una película de acción. |
| leer / la lectura | /leˈeɾ/ | lire / la lecture | verbe / nom | Me gusta la lectura. |
| jugar a los videojuegos | /bideoˈxweɣos/ | jouer aux jeux vidéo | verbe | Mi hermano juega a los videojuegos. |
| navegar por internet | /naβeˈɣaɾ/ | surfer sur internet | verbe | Navego por internet cada noche. |
| ir a la playa | /ˈplaʝa/ | aller à la plage | verbe | En Pointe-Noire vamos a la playa. |
| pasear | /paseˈaɾ/ | se promener | verbe | Paseamos por la Corniche. |
| aburrirse / divertirse | /aβuˈriɾse/ /diβeɾˈtiɾse/ | s'ennuyer / s'amuser | verbe | Nos divertimos mucho. |

### 2. La música — La musique

| Español | Français | Ejemplo |
|---|---|---|
| la canción | la chanson | Esta canción es muy bonita. |
| el / la cantante | le chanteur / la chanteuse | Mi cantante favorito es congoleño. |
| el grupo / la orquesta | le groupe / l'orchestre | La orquesta tocó toda la noche. |
| el concierto | le concert | Fui a un concierto de rumba. |
| el escenario | la scène | El cantante subió al escenario. |
| el público | le public | El público cantó con él. |
| la letra | les paroles | Me sé la letra de memoria. |
| el ritmo | le rythme | La rumba tiene un ritmo suave. |
| tocar (la guitarra, el tambor) | jouer (de la guitare, du tambour) | Mi primo toca la guitarra. |
| cantar / bailar | chanter / danser | Bailamos hasta medianoche. |
| grabar un disco | enregistrer un disque | El grupo grabó un disco en 2020. |

Attention : **tocar** un instrument (tocar la guitarra) mais **jugar** à un jeu ou un sport (jugar al fútbol).

### 3. El deporte — Le sport

| Español | Prononciation | Français | Catégorie | Ejemplo |
|---|---|---|---|---|
| el fútbol / el baloncesto | /bal̪onˈθesto/ | le football / le basket | nom | Juego al baloncesto. |
| el balonmano / el atletismo | /alteˈtismo/ | le handball / l'athlétisme | nom | Mi hermana hace atletismo. |
| el equipo | /eˈkipo/ | l'équipe | nom | Nuestro equipo es el mejor. |
| el jugador / la jugadora | /xuɣaˈðoɾ/ | le joueur / la joueuse | nom | Es una gran jugadora. |
| el entrenador | /entɾenaˈðoɾ/ | l'entraîneur | nom | El entrenador está contento. |
| entrenar(se) | /entɾeˈnaɾ/ | s'entraîner | verbe | Entrenamos tres veces por semana. |
| el partido | /paɾˈtiðo/ | le match | nom | Vimos el partido en la tele. |
| el campeonato | /kampeoˈnato/ | le championnat | nom | Ganamos el campeonato del barrio. |
| el gol / marcar un gol | /ɡol/ | le but / marquer un but | nom / verbe | Santiago marcó dos goles. |
| ganar / perder / empatar | /ɡaˈnaɾ/ /emˈpataɾ/ | gagner / perdre / faire match nul | verbe | Empatamos uno a uno. |
| el árbitro | /ˈaɾβitɾo/ | l'arbitre | nom | El árbitro pitó un penalti. |
| el estadio / la cancha | /esˈtaðjo/ /ˈkantʃa/ | le stade / le terrain | nom | Jugamos en la cancha del barrio. |
| la afición / el aficionado | /afiθjoˈnaðo/ | les supporters / le supporter | nom | La afición cantó todo el partido. |
| la medalla | /meˈðaʎa/ | la médaille | nom | Ganó una medalla de oro. |

### 4. Expresar gustos — Exprimer ses goûts

**Gustar** et **encantar** fonctionnent comme **doler** (unité 4) : ce qui plaît est le sujet.

| Phrase | Français |
|---|---|
| **Me gusta** el fútbol. / **Me gusta** bailar. | J'aime le football. / J'aime danser. |
| **Me gustan** las películas de acción. | J'aime les films d'action. (pluriel → gustan) |
| **Me encanta** la rumba. | J'adore la rumba. |
| **No me gusta nada** el boxeo. | Je n'aime pas du tout la boxe. |
| **Prefiero** leer. | Je préfère lire. |
| **A mí también** / **A mí tampoco** | Moi aussi / Moi non plus |

### Faux amis à retenir

- **el partido** = le match (et aussi le parti politique) ; « la partie » d'un jeu = **la partida**.
- **el disco** = le disque ; « la discothèque » = **la discoteca**.
- **la afición** = les supporters, la passion ; « une affiche » = **un cartel**.
- **la cancha** = le terrain de sport (surtout en Amérique latine et en Afrique hispanophone).

### Mémorisation

Fais trois listes : **Me encanta… / Me gusta… / No me gusta nada…** et place dans chacune au moins cinq activités du vocabulaire.`,
  },
  {
    type: 'cours',
    title: 'Gramática — El pretérito indefinido',
    content: `## Gramática — Le pretérito indefinido

Pour **raconter** un match, un concert, un week-end ou la vie d'un artiste, l'espagnol utilise le **pretérito indefinido**. Il exprime une action **passée et terminée**, située dans un moment **fini** (ayer, el sábado pasado, en 2021). Il correspond au passé simple du récit écrit français et, à l'oral, à notre passé composé.

### 1. Observa — Observe d'abord

Phrases tirées du récit de l'unité :

- El sábado **fui** a un concierto de rumba.
- La orquesta **tocó** durante tres horas.
- Santiago **jugó** un partido y **marcó** dos goles.
- **Bailamos** hasta medianoche.
- Ayer **tuve** que estudiar todo el día.

### 2. Les verbes réguliers

| Personne | Bailar (-ar) | Comer (-er) | Salir (-ir) |
|---|---|---|---|
| yo | bail**é** | com**í** | sal**í** |
| tú | bail**aste** | com**iste** | sal**iste** |
| él / ella / usted | bail**ó** | com**ió** | sal**ió** |
| nosotros / nosotras | bail**amos** | com**imos** | sal**imos** |
| vosotros / vosotras | bail**asteis** | com**isteis** | sal**isteis** |
| ellos / ellas / ustedes | bail**aron** | com**ieron** | sal**ieron** |

Les verbes en **-er** et **-ir** ont les **mêmes terminaisons**. L'**accent écrit** de « yo » et « él » est indispensable : **bailo** (je danse, présent) ≠ **bailó** (il a dansé).

### 3. Changements d'orthographe à la 1re personne

Pour garder le son, certaines consonnes changent devant **-é** :

| Infinitif | yo | él |
|---|---|---|
| jugar | **jugué** | jugó |
| llegar | **llegué** | llegó |
| tocar | **toqué** | tocó |
| practicar | **practiqué** | practicó |
| empezar | **empecé** | empezó |

Et **i** devient **y** entre deux voyelles : leer → **leyó, leyeron** ; oír → **oyó, oyeron**.

### 4. Les verbes irréguliers les plus fréquents

| Infinitif | yo | tú | él / ella | nosotros | ellos |
|---|---|---|---|---|---|
| ser / ir | **fui** | fuiste | **fue** | fuimos | fueron |
| tener | **tuve** | tuviste | **tuvo** | tuvimos | tuvieron |
| estar | **estuve** | estuviste | **estuvo** | estuvimos | estuvieron |
| hacer | **hice** | hiciste | **hizo** | hicimos | hicieron |
| poder | **pude** | pudiste | **pudo** | pudimos | pudieron |
| poner | **puse** | pusiste | **puso** | pusimos | pusieron |
| venir | **vine** | viniste | **vino** | vinimos | vinieron |
| decir | **dije** | dijiste | **dijo** | dijimos | **dijeron** |
| dar | **di** | diste | **dio** | dimos | dieron |
| ver | **vi** | viste | **vio** | vimos | vieron |

Ces irréguliers **n'ont pas d'accent écrit** (tuve, hizo, fue). **Ser** et **ir** ont les mêmes formes : le contexte fait la différence (Fue un buen partido = ce fut ; Fue al estadio = il alla).

Les verbes en **-ir** à diphtongue changent à la 3e personne : dormir → **durmió, durmieron** ; pedir → **pidió** ; preferir → **prefirió** ; divertirse → **se divirtió**.

### 5. Indefinido ou perfecto ?

| Pretérito indefinido | Pretérito perfecto (unité 4) |
|---|---|
| moment **terminé** | période **pas finie** ou lien avec le présent |
| ayer, anoche, el sábado pasado, la semana pasada, en 2021, hace dos años | hoy, esta mañana, esta semana, este año, ya, nunca |
| **Ayer jugué** al fútbol. | **Hoy he jugado** al fútbol. |
| **En 2021** la UNESCO **reconoció** la rumba. | **Este año he ido** a tres conciertos. |

### 6. Cinco ejemplos sobre el tema

1. El sábado pasado **fuimos** al estadio y **vimos** un partido increíble.
2. Mi equipo **ganó** tres a uno y yo **marqué** un gol.
3. Anoche la orquesta **tocó** hasta las dos de la mañana.
4. El año pasado **hice** un curso de guitarra.
5. Mis amigos **se divirtieron** mucho en la fiesta.

### 7. Erreurs fréquentes

| Faux | Correct | Pourquoi |
|---|---|---|
| Ayer jugo al fútbol. | Ayer jugué al fútbol. | yo → jugué (-gué) |
| Él bailo toda la noche. | Él bailó toda la noche. | accent écrit : bailó |
| Hací los deberes. | Hice los deberes. | irrégulier : hice |
| Él hició un gol. | Él hizo un gol. | irrégulier : hizo |
| Tení un partido. | Tuve un partido. | irrégulier : tuve |
| Ayer he ido al concierto. | Ayer fui al concierto. | ayer → indefinido |
| Fué un buen concierto. | Fue un buen concierto. | pas d'accent sur fue, fui, dio, vio |

### Pour aller plus loin : hace + durée

**Hace** + durée = il y a : **Hace dos años** gané el campeonato. **Hace un mes** fui a Malabo.

### A ti

Les exercices de grammaire corrigés sont dans le bouton « Exercices » en bas de page (exercices 1 à 3).`,
  },
  {
    type: 'cours',
    title: 'Escuchar — ¿Qué hiciste el fin de semana?',
    content: `## Escuchar — Comprendre à l'oral

**Situation :** C'est lundi. Santiago est rentré à Malabo après son échange. Divine et lui se racontent leur week-end par message vocal, puis en appel vidéo.

### Antes de escuchar — Avant d'écouter

1. Mots-clés : la orquesta (l'orchestre), el escenario (la scène), el partido (le match), marcar un gol (marquer un but), empatar (faire match nul).
2. Devine : qu'a pu faire chacun pendant le week-end ?

### Comment travailler

L'enregistrement audio sera bientôt disponible dans l'application. En attendant :

- **Première écoute :** fais-toi lire le dialogue sans le regarder ; réponds aux questions globales (exercice 4, partie A).
- **Deuxième écoute :** relis le texte, puis réponds aux questions de détail.
- **Troisième écoute :** lis-le à deux en jouant les rôles.

### Transcripción — Transcription

**Divine:** ¡Hola, Santiago! ¿Qué tal el fin de semana? ¿Qué hiciste?

**Santiago:** ¡Hola! ¡Fue un fin de semana increíble! El sábado por la mañana jugué un partido con el equipo de mi instituto. Jugamos contra el mejor equipo de Malabo.

**Divine:** ¿Y quién ganó?

**Santiago:** ¡Nosotros! Bueno… al principio perdíamos uno a cero, pero en la segunda parte marqué dos goles. Al final ganamos dos a uno. Mis compañeros me llevaron en hombros y el entrenador nos invitó a todos a un refresco.

**Divine:** ¡Enhorabuena, campeón! ¿Y el domingo?

**Santiago:** El domingo estuve muy cansado. Dormí hasta las once, comí con mi familia y por la tarde vi una película con mi hermana Lucía. Y tú, ¿qué hiciste?

**Divine:** Yo fui a un concierto de rumba el sábado por la noche, con mis primos. Tocó una orquesta muy famosa de Brazzaville. ¡Fue maravilloso!

**Santiago:** ¿Dónde fue el concierto?

**Divine:** En una sala grande del centro. Llegamos a las ocho, pero el concierto empezó a las diez: tuvimos que esperar dos horas. Cuando el cantante subió al escenario, todo el público gritó. La orquesta tocó durante tres horas y bailamos sin parar.

**Santiago:** ¿Y te divertiste?

**Divine:** ¡Muchísimo! Mi prima Grâce subió al escenario a bailar con los bailarines. Y al final, el cantante dijo unas palabras en español para un grupo de turistas: ¡me acordé de ti!

**Santiago:** ¡Qué suerte! ¿Y a qué hora volviste a casa?

**Divine:** A las dos de la mañana. Mi padre nos esperó despierto… y el domingo tuve que ayudar a mi madre en el mercado todo el día. ¡No pude descansar!

**Santiago:** ¡Pobrecita! Bueno, el próximo fin de semana descansas tú y yo hago los deberes.

**Divine:** ¡Trato hecho!

### Vocabulario clave del diálogo

| Español | Français |
|---|---|
| ¿Qué tal…? | Comment s'est passé… ? |
| al principio | au début |
| la segunda parte | la deuxième mi-temps |
| llevar en hombros | porter en triomphe |
| ¡Enhorabuena! | Félicitations ! |
| la sala | la salle |
| gritar | crier |
| sin parar | sans s'arrêter |
| acordarse de | se souvenir de |
| esperar despierto | attendre sans dormir |
| ¡Pobrecita! | Ma pauvre ! |
| ¡Trato hecho! | Marché conclu ! |

**Remarque :** relève les indefinidos réguliers (jugué, ganó, marqué, ganamos, invitó, comí, llegamos, empezó, subió, gritó, tocó, bailamos, volviste) et irréguliers (hiciste, fue, estuve, dormí, vi, fui, tuvimos, dijo, tuve, pude). Le récit porte sur un moment **terminé** : le week-end dernier.

### Preguntas

Les questions de compréhension et leur corrigé sont dans l'**exercice 4**, en bas de page.`,
  },
  {
    type: 'cours',
    title: 'Leer — La rumba y el flamenco, patrimonio de la humanidad',
    content: `## Leer — Comprendre un texte

### Antes de leer — Avant de lire

Lis le titre et la première phrase de chaque paragraphe. Quelles musiques sont présentées ? Qu'ont-elles en commun ?

### La rumba y el flamenco, patrimonio de la humanidad

**1.** La UNESCO protege no solo monumentos, sino también tradiciones vivas: lenguas, fiestas, danzas y músicas. Es el llamado «patrimonio cultural inmaterial de la humanidad». Dos músicas muy queridas en el Congo y en España forman parte de esta lista: el flamenco, inscrito en 2010, y la rumba congoleña, inscrita en 2021.

**2.** El flamenco nació en Andalucía, en el sur de España. Durante siglos, el pueblo gitano, los andaluces y otras culturas mezclaron sus cantos y sus ritmos. En el siglo diecinueve, el flamenco salió de las casas y de las fiestas familiares y llegó a los cafés y a los teatros. Tiene tres elementos: el cante (la voz), el toque (la guitarra) y el baile. Los artistas cantan sobre el amor, la tristeza, la libertad y la vida difícil del pueblo.

**3.** La rumba congoleña nació mucho más tarde, en los años cuarenta y cincuenta del siglo veinte, en Brazzaville y en Kinshasa, las dos capitales situadas a cada lado del río Congo. Los músicos locales escucharon los discos cubanos que llegaron en los barcos y mezclaron esos ritmos con los cantos y las danzas tradicionales del Congo. En 1959 se fundó en Brazzaville la famosa orquesta Les Bantous de la Capitale. Después, la rumba viajó por toda África y dio nacimiento a otros estilos, como el soukous y el ndombolo.

**4.** En 2021, la República del Congo y la República Democrática del Congo presentaron juntas la candidatura de la rumba a la UNESCO. Cuando la organización anunció la noticia, miles de personas celebraron el reconocimiento en las calles de las dos capitales. Para muchos músicos, fue un momento de orgullo, pero también una responsabilidad: hay que transmitir esta música a los jóvenes.

**5.** El flamenco y la rumba tienen algo en común: nacieron en el pueblo, mezclaron influencias muy diferentes y hoy pertenecen al mundo entero. Escucharlas es también aprender la historia de dos pueblos.

(Texte rédigé pour ce cours, environ 370 mots.)

### Palabras útiles del texto

| Español | Français |
|---|---|
| el patrimonio inmaterial | le patrimoine immatériel |
| querido | aimé, cher |
| inscrito | inscrit |
| nacer (nació) | naître (naquit, est né) |
| el pueblo gitano | le peuple gitan |
| mezclar | mélanger |
| el siglo | le siècle |
| el cante / el toque / el baile | le chant / le jeu de guitare / la danse (flamenco) |
| a cada lado de | de chaque côté de |
| fundar (se fundó) | fonder (fut fondé) |
| dar nacimiento a | donner naissance à |
| juntas | ensemble |
| el orgullo | la fierté |
| pertenecer a | appartenir à |

### Estrategia de lectura

1. **Lecture globale** : une introduction sur l'UNESCO (1), le flamenco (2), la rumba (3 et 4), une conclusion qui compare (5).
2. **Lecture sélective** : relève toutes les dates (2010, 2021, années 1940-1950, 1959, XIXe siècle) et ce qui s'est passé.
3. **Repère l'indefinido** : nació, mezclaron, salió, llegó, escucharon, llegaron, mezclaron, se fundó, viajó, dio, presentaron, anunció, celebraron, fue. C'est le temps du **récit historique**.

### Preguntas

Les questions sont dans les **exercices 5 et 6**, en bas de page.`,
  },
  {
    type: 'cours',
    title: 'Hablar — Contar un recuerdo y debatir',
    content: `## Hablar — S'exprimer à l'oral

### 1. Preguntas para conversar — Questions de discussion

Réponds à voix haute en phrases complètes.

1. ¿Qué hiciste el fin de semana pasado?
2. ¿Cuál fue el mejor concierto o el mejor partido de tu vida? ¿Qué pasó?
3. ¿Qué música te gusta? ¿Y qué música no te gusta nada?
4. ¿Practicas un deporte? ¿Desde cuándo?
5. ¿Qué prefieres: ver un partido en el estadio o en la tele? ¿Por qué?

### 2. Frases modelo — Phrases modèles

| Pour… | Frases |
|---|---|
| Situer le récit | El sábado pasado… / Hace dos años… / Un día… / Anoche… |
| Enchaîner | Primero… / Después… / Luego… / De repente… / Al final… |
| Raconter un match | Jugamos contra… / Marqué un gol. / Ganamos tres a uno. / Empatamos. |
| Raconter un concierto | Fui a un concierto de… / La orquesta tocó… / Bailamos toda la noche. |
| Dire ses impressions | ¡Fue increíble / inolvidable / aburrido! / Me divertí mucho. / Lo pasé genial. |
| Exprimer ses goûts | Me encanta… / Me gustan… / Prefiero… / No me gusta nada… |

### 3. Un recuerdo inolvidable — Raconte (1 minuto 30)

Raconte un moment inoubliable lié à la musique ou au sport : quand, où, avec qui, ce qui s'est passé, comment cela s'est terminé et ce que tu as ressenti. Utilise au moins **huit verbes à l'indefinido**, dont quatre irréguliers (fui, tuve, hice, estuve, vi, dijo…).

### 4. Juego de rol — El lunes en el instituto

**Alumno A.** Tu es allé(e) à un concert le week-end dernier : raconte-le avec enthousiasme.

**Alumno B.** Tu as joué un match important : raconte-le. Chacun pose ensuite trois questions à l'autre : ¿Con quién fuiste? ¿Quién ganó? ¿A qué hora volviste?

### 5. Debate

**Tema :** « Los futbolistas ganan demasiado dinero. »

- **A favor :** salaires énormes comparés à ceux des médecins ou des enseignants, mauvais exemple pour les jeunes, l'argent pourrait financer des écoles.
- **En contra :** carrière courte et risques de blessure, talent rare, le football fait vivre beaucoup de gens, certains joueurs aident leur pays d'origine.

### Consejos para el oral

- Prononce bien l'accent final de l'indefinido : bai**ló**, ju**gó**, mar**qué** ; c'est lui qui distingue le passé du présent.
- **Fue** et **fui** se prononcent en une seule syllabe : /fwe/, /fwi/.`,
  },
  {
    type: 'cours',
    title: 'Escribir — Un fin de semana inolvidable',
    content: `## Escribir — S'exprimer par écrit

### El tema — Le sujet

**Raconte à ton correspondant un week-end inoubliable (120 à 150 mots) : un concert, un match, une fête, une sortie à la plage… Dis ce que tu as fait, avec qui, ce qui s'est passé et ce que tu as ressenti.**

### Método — Le plan du récit

| Partie | Contenu | Outils |
|---|---|---|
| **Saludo** | Formule d'appel | ¡Hola, Santiago! / Querido Santiago: |
| **Situer** | Quand, où, avec qui | El sábado pasado fui a… con… |
| **Les événements** | Trois ou quatre étapes, dans l'ordre | Primero… Después… De repente… Al final… |
| **Les impressions** | Ce que tu as ressenti | Fue increíble. Me divertí mucho. |
| **Les goûts** | Pourquoi tu aimes cette activité | Me encanta… porque… |
| **Despedida** | Une question et une formule finale | ¿Y tú, qué hiciste? Un abrazo, |

### Expresiones útiles

- **Temps :** el sábado pasado, anoche, ayer, la semana pasada, hace un mes
- **Enchaîner :** primero, luego, después, más tarde, de repente, al final, por fin
- **Concert :** la orquesta tocó…, el cantante cantó…, el público gritó…, bailamos sin parar
- **Match :** jugamos contra…, marqué un gol, ganamos / perdimos / empatamos, el árbitro pitó…
- **Impressions :** fue increíble / divertido / inolvidable, lo pasé genial, me divertí, estuve muy contento(a)

### Lista de comprobación

- ☐ Formule d'appel et formule finale.
- ☐ Le récit est situé dans le temps (el sábado pasado, anoche…).
- ☐ J'utilise au moins dix verbes à l'indefinido, dont quatre irréguliers.
- ☐ Les accents de l'indefinido régulier sont écrits (bailé, bailó) ; pas d'accent sur fue, fui, vio, dio.
- ☐ Les étapes sont reliées par des connecteurs.
- ☐ J'exprime mes goûts avec gustar ou encantar.
- ☐ J'ai entre 120 et 150 mots.

### A ti

Rédige ton récit dans l'**exercice 9**, puis compare avec l'exemple corrigé.`,
  },
  {
    type: 'resume',
    title: 'Ficha de repaso — El ocio, la música y el deporte',
    content: `### À retenir — Unidad 6 : El ocio, la música y el deporte

**Idée centrale :** les loisirs, la musique et le sport sont aussi une culture. Le flamenco (Andalousie, inscrit à l'UNESCO en 2010) et la rumba congolaise (née à Brazzaville et Kinshasa dans les années 1940-1950, inscrite en 2021) sont nés dans le peuple, ont mélangé des influences différentes et appartiennent aujourd'hui au monde entier.

**Vocabulaire indispensable**
- Loisirs : el tiempo libre, el fin de semana, salir con los amigos, ir de fiesta, ver una película, leer, jugar a los videojuegos, ir a la playa, pasear, divertirse, aburrirse
- Musique : la canción, el cantante, el grupo, la orquesta, el concierto, el escenario, el público, la letra, el ritmo, tocar la guitarra, cantar, bailar
- Sport : el fútbol, el baloncesto, el equipo, el jugador, el entrenador, entrenar, el partido, el campeonato, marcar un gol, ganar, perder, empatar, el árbitro, el estadio, la afición
- Goûts : me gusta / me gustan, me encanta, prefiero, no me gusta nada, a mí también / tampoco
- tocar un instrumento ≠ jugar a un deporte

**Grammaire : le pretérito indefinido**

| | -ar | -er / -ir |
|---|---|---|
| yo / tú / él | -é, -aste, -ó | -í, -iste, -ió |
| nosotros / vosotros / ellos | -amos, -asteis, -aron | -imos, -isteis, -ieron |

- Orthographe : jugué, llegué, toqué, empecé ; leyó, oyó.
- Irréguliers : fui (ser / ir), tuve, estuve, hice / hizo, pude, puse, vine, dije, di, vi.
- -ir à diphtongue (3e pers.) : durmió, pidió, prefirió, se divirtió.
- Indefinido (ayer, el sábado pasado, en 2021, hace dos años) ≠ perfecto (hoy, esta semana, ya, nunca).

**Pour l'oral et l'écrit**
- El sábado pasado… Primero… Después… Al final…
- ¡Fue increíble! Me divertí mucho. Lo pasé genial.`,
  },
]

export const exercises = [
  {
    title: 'Ejercicio 1 — Conjuga en pretérito indefinido (verbos regulares)',
    difficulty: 1,
    statement: `Mets les verbes au **pretérito indefinido**.

1. Ayer yo ______ (bailar) toda la noche.
2. ¿Tú ______ (ver) el partido? (attention : ver est irrégulier)
3. El cantante ______ (cantar) tres canciones nuevas.
4. Nosotros ______ (comer) en casa de mi tía.
5. ¿Vosotros ______ (salir) el sábado?
6. Mis amigos ______ (llegar) tarde al concierto.
7. Mi hermana ______ (escribir) una canción.
8. El sábado pasado yo ______ (jugar) al baloncesto.`,
    solution: `1. **bailé**
2. **viste** (ver : vi, viste, vio… sans accent)
3. **cantó**
4. **comimos**
5. **salisteis**
6. **llegaron**
7. **escribió**
8. **jugué** (g → gu devant é)

Rappel : -ar → -é, -aste, -ó, -amos, -asteis, -aron ; -er / -ir → -í, -iste, -ió, -imos, -isteis, -ieron.`,
  },
  {
    title: 'Ejercicio 2 — Verbos irregulares en indefinido',
    difficulty: 2,
    statement: `Mets les verbes au **pretérito indefinido** (irréguliers).

1. El sábado yo ______ (ir) al estadio con mi padre.
2. El concierto ______ (ser) maravilloso.
3. Ayer nosotros ______ (tener) entrenamiento.
4. ¿Qué ______ (hacer) tú el domingo?
5. Santiago ______ (hacer) dos goles.
6. Mis primos ______ (venir) a la fiesta.
7. El entrenador nos ______ (decir) «¡Bravo!».
8. Yo no ______ (poder) ir al concierto.
9. Mi abuelo ______ (dormir) durante el partido.
10. Los aficionados ______ (estar) muy contentos.`,
    solution: `1. **fui**
2. **fue**
3. **tuvimos**
4. **hiciste**
5. **hizo** (c → z devant o)
6. **vinieron**
7. **dijo**
8. **pude**
9. **durmió** (o → u à la 3e personne)
10. **estuvieron**

Rappel : les indefinidos irréguliers ne portent pas d'accent écrit.`,
  },
  {
    title: 'Ejercicio 3 — ¿Indefinido o perfecto? Corrige los errores',
    difficulty: 3,
    statement: `**A. Choisis entre l'indefinido et le perfecto selon le marqueur de temps.**
1. Ayer ______ (yo, ver) una película muy buena.
2. Esta semana ______ (yo, ir) dos veces a la playa.
3. En 2021, la UNESCO ______ (reconocer) la rumba congoleña.
4. ¿______ (tú, estar) alguna vez en un concierto?
5. Hace dos años mi equipo ______ (ganar) el campeonato.

**B. Chaque phrase contient une erreur. Corrige-la.**
6. Ayer jugo al fútbol con mis amigos.
7. Él bailo con mi prima.
8. Hací los deberes antes del partido.
9. Ayer he ido a un concierto.
10. Fué un partido increíble.`,
    solution: `**A.**
1. **vi** (ayer → indefinido)
2. **he ido** (esta semana → perfecto)
3. **reconoció** (en 2021 → indefinido)
4. **Has estado** (alguna vez → perfecto)
5. **ganó** (hace dos años → indefinido)

**B.**
6. Ayer **jugué** al fútbol con mis amigos. (yo → jugué)
7. Él **bailó** con mi prima. (accent : bailó)
8. **Hice** los deberes antes del partido. (irrégulier)
9. Ayer **fui** a un concierto. (ayer → indefinido)
10. **Fue** un partido increíble. (pas d'accent sur fue)`,
  },
  {
    title: 'Ejercicio 4 — Escuchar: ¿Qué hiciste el fin de semana?',
    difficulty: 1,
    statement: `Réponds aux questions sur le dialogue (leçon Escuchar). Réponds en espagnol, par des phrases complètes.

**A. Comprensión global — ¿Verdadero o falso?**
1. Santiago y Divine pasaron el fin de semana juntos.
2. El equipo de Santiago ganó el partido.
3. Divine descansó el domingo.

**B. Comprensión detallada**
4. ¿Contra quién jugó el equipo de Santiago?
5. ¿Cuántos goles marcó Santiago? ¿Cuál fue el resultado final?
6. ¿Qué hicieron sus compañeros y el entrenador después del partido?
7. ¿Qué hizo Santiago el domingo? (tres actividades)
8. ¿Adónde fue Divine el sábado por la noche? ¿Con quién?
9. ¿Por qué tuvieron que esperar dos horas?
10. ¿Qué hizo la prima Grâce?
11. ¿A qué hora volvió Divine a casa? ¿Qué hizo el domingo?`,
    solution: `**A.**
1. **Falso** — Santiago estuvo en Malabo y Divine en Brazzaville.
2. **Verdadero** — ganaron dos a uno.
3. **Falso** — tuvo que ayudar a su madre en el mercado todo el día.

**B.**
4. **Contra el mejor equipo de Malabo.**
5. **Marcó dos goles. Ganaron dos a uno.**
6. **Sus compañeros lo llevaron en hombros y el entrenador los invitó a un refresco.**
7. **Durmió hasta las once, comió con su familia y vio una película con su hermana.**
8. **Fue a un concierto de rumba con sus primos.**
9. **Porque llegaron a las ocho, pero el concierto empezó a las diez.**
10. **Subió al escenario a bailar con los bailarines.**
11. **Volvió a las dos de la mañana. El domingo tuvo que ayudar a su madre en el mercado.**`,
  },
  {
    title: 'Ejercicio 5 — Leer: comprensión del texto',
    difficulty: 2,
    statement: `Réponds aux questions sur le texte « La rumba y el flamenco, patrimonio de la humanidad ».

**A. Comprensión global**
1. El texto: (a) explica cómo bailar flamenco (b) presenta la historia de dos músicas reconocidas por la UNESCO (c) cuenta un concierto en Madrid.

**B. Comprensión detallada**
2. ¿Qué es el «patrimonio cultural inmaterial»? Da dos ejemplos.
3. ¿En qué año fueron inscritos el flamenco y la rumba congoleña?
4. ¿Dónde nació el flamenco? ¿Qué culturas lo crearon?
5. ¿Cuáles son los tres elementos del flamenco?
6. ¿Cuándo y dónde nació la rumba congoleña?
7. ¿Qué escucharon los músicos locales?
8. ¿Qué orquesta se fundó en Brazzaville en 1959?
9. ¿Qué otros estilos nacieron de la rumba?

**C. ¿Verdadero o falso? Justifica con una frase del texto.**
10. La República del Congo presentó sola la candidatura de la rumba.`,
    solution: `**A.** 1. **(b)**

**B.**
2. **Son tradiciones vivas: lenguas, fiestas, danzas y músicas** (dos ejemplos).
3. **El flamenco en 2010 y la rumba congoleña en 2021.**
4. **En Andalucía, en el sur de España. Lo crearon el pueblo gitano, los andaluces y otras culturas.**
5. **El cante (la voz), el toque (la guitarra) y el baile.**
6. **En los años cuarenta y cincuenta del siglo veinte, en Brazzaville y en Kinshasa.**
7. **Los discos cubanos que llegaron en los barcos.**
8. **Les Bantous de la Capitale.**
9. **El soukous y el ndombolo.**

**C.**
10. **Falso** — «la República del Congo y la República Democrática del Congo presentaron juntas la candidatura».`,
  },
  {
    title: 'Ejercicio 6 — Leer: vocabulario e interpretación',
    difficulty: 3,
    statement: `**A. Busca en el texto la palabra o expresión que significa:**
1. un período de cien años (párrafo 2)
2. poner juntas cosas diferentes (párrafo 2)
3. crear una organización (párrafo 3)
4. el sentimiento de estar contento de algo propio (párrafo 4)
5. ser de alguien (párrafo 5)

**B.** Relève dans le paragraphe 3 quatre verbes à l'indefinido et donne leur infinitif. Pourquoi l'auteur utilise-t-il ce temps ?

**C. Interpretación (4-5 frases en español).**
6. «Escucharlas es también aprender la historia de dos pueblos». ¿Qué quiere decir el autor? ¿Qué canción o qué música de tu país cuenta la historia de tu pueblo?`,
    solution: `**A.**
1. **el siglo**
2. **mezclar**
3. **fundar**
4. **el orgullo**
5. **pertenecer a**

**B. Exemples :** **nació** (nacer), **escucharon** (escuchar), **llegaron** (llegar), **mezclaron** (mezclar), **se fundó** (fundarse), **viajó** (viajar), **dio** (dar). L'auteur emploie l'indefinido car il **raconte des faits historiques passés et terminés**, situés à un moment précis (années 1940-1950, 1959).

**C. Ejemplo de respuesta :**
6. El autor quiere decir que una música no es solo diversión: en sus letras y en sus ritmos hay recuerdos, alegrías y sufrimientos de un pueblo. Por ejemplo, la rumba congoleña nació en la época colonial y acompañó la independencia. Algunas canciones antiguas de mi país hablan del río, del trabajo en el campo y de la familia. Cuando las escuché con mi abuelo, aprendí cómo vivía la gente antes.

Toute réponse cohérente en espagnol est acceptée.`,
  },
  {
    title: 'Ejercicio 7 — Vocabulario: relaciona y completa',
    difficulty: 1,
    statement: `**A. Relie chaque mot à sa définition.**

| Palabra | Definición |
|---|---|
| 1. el árbitro | a. el lugar donde cantan los artistas en un concierto |
| 2. el escenario | b. la persona que hace respetar las reglas del partido |
| 3. empatar | c. las palabras de una canción |
| 4. la letra | d. terminar un partido con el mismo resultado |
| 5. el entrenador | e. la persona que prepara a los jugadores |

**B. Completa con: toca, juega, concierto, gol, me encantan.**
6. Mi primo ______ la guitarra en una orquesta.
7. Mi hermana ______ al baloncesto.
8. ______ las canciones de rumba.
9. El delantero marcó un ______ en el último minuto.
10. Anoche fui a un ______ en el centro.`,
    solution: `**A.** 1-**b** · 2-**a** · 3-**d** · 4-**c** · 5-**e**

**B.**
6. **toca** (tocar un instrumento)
7. **juega** (jugar a un deporte)
8. **Me encantan** (pluriel : las canciones)
9. **gol**
10. **concierto**`,
  },
  {
    title: 'Ejercicio 8 — Ordena y traduce',
    difficulty: 2,
    statement: `**A. Remets les mots dans l'ordre.**
1. fui / el sábado / a / de rumba / un concierto
2. dos / marcó / goles / Santiago
3. ganamos / a / tres / uno
4. hasta / bailamos / medianoche

**B. Traduis en espagnol.**
5. Hier, j'ai joué au football avec mes amis.
6. Le concert a été inoubliable.
7. Il y a deux ans, mon équipe a gagné le championnat.
8. J'adore la musique, mais je n'aime pas du tout danser.`,
    solution: `**A.**
1. **El sábado fui a un concierto de rumba.**
2. **Santiago marcó dos goles.**
3. **Ganamos tres a uno.**
4. **Bailamos hasta medianoche.**

**B.**
5. **Ayer jugué al fútbol con mis amigos.**
6. **El concierto fue inolvidable.**
7. **Hace dos años, mi equipo ganó el campeonato.**
8. **Me encanta la música, pero no me gusta nada bailar.**`,
  },
  {
    title: 'Ejercicio 9 — Escribir: un fin de semana inolvidable (120-150 palabras)',
    difficulty: 3,
    statement: `**Tema :** Raconte à ton correspondant un week-end inoubliable (**120 à 150 mots**) : un concert, un match, une fête, une sortie à la plage… Dis ce que tu as fait, avec qui, ce qui s'est passé et ce que tu as ressenti.

Suis le plan de la leçon Escribir. Utilise au moins dix verbes à l'indefinido, dont quatre irréguliers. Écris ton texte, valide-le, puis compare avec l'exemple corrigé.`,
    solution: `**Ejemplo de texto corregido (≈ 150 palabras)**

¡Hola, Santiago!

Te cuento mi fin de semana: ¡fue inolvidable! El sábado por la tarde, mi equipo de baloncesto jugó la final del campeonato del barrio. Fuimos a la cancha del instituto a las tres y había mucha gente.

Primero, el otro equipo marcó muchos puntos y perdíamos de diez puntos. Pero en la segunda parte, el entrenador nos dijo: «¡No tengáis miedo!». Entonces jugamos mejor y yo hice cinco canastas. Al final, ganamos por dos puntos. ¡Todo el público gritó!

Por la noche, mis padres organizaron una pequeña fiesta en casa. Vinieron mis primos y mis amigos, comimos pescado y bailamos rumba hasta medianoche. Estuve muy cansada, pero muy feliz.

¡Me encanta el baloncesto porque es un deporte de equipo!

¿Y tú, qué hiciste el fin de semana?

Un abrazo,

Divine

**Grille d'auto-évaluation (sur 20)** : forme et organisation du récit (4) · contenu (situer, raconter, impressions, goûts) (5) · vocabulaire du thème (4) · grammaire : indefinido régulier et irrégulier, gustar (5) · orthographe et accents (2).`,
  },
  {
    title: 'Prueba final — Tareas de expresión escrita y oral',
    difficulty: 3,
    statement: `Ces deux tâches complètent le **QCM de fin d'unité** (20 questions).

**1. Expresión escrita (70-90 palabras).** Raconte la dernière fois que tu es allé(e) à une fête, un concert ou un match. Utilise au moins **huit verbes à l'indefinido**, dont trois irréguliers, et des connecteurs (primero, después, al final).

**2. Expresión oral.** Enregistre-toi pendant **1 minute 30** : « ¿Qué hiciste el fin de semana pasado? »`,
    solution: `**1. Ejemplo de respuesta :**

El mes pasado fui a la boda de mi prima en Dolisie. Primero, viajamos en autobús con toda la familia: el viaje duró cuatro horas. Después, asistimos a la ceremonia en la iglesia. Por la noche, una orquesta tocó rumba y todos bailamos. Mi abuelo bailó con la novia y todo el mundo aplaudió. Comimos mucho y tuve que probar todos los platos. Al final, volvimos a casa el domingo, muy cansados pero muy contentos.

**2. Points attendus à l'oral :** situer (el fin de semana pasado, el sábado…), raconter au moins six actions à l'indefinido dont des irréguliers (fui, hice, estuve, tuve, vi…), enchaîner avec des connecteurs, donner ses impressions (fue genial, me divertí), exprimer un goût (me encanta…), parler sans lire.`,
  },
]

export const qcm = {
  title: 'Prueba de la unidad 6 — El ocio, la música y el deporte',
  time_limit_sec: 900,
  questions: [
    // Vocabulaire (7)
    { prompt: '« Jouer de la guitare » :', options: ['jugar la guitarra', 'tocar la guitarra', 'hacer la guitarra', 'cantar la guitarra'], correct_index: 1, explanation: 'Tocar un instrument ; jugar a un sport.' },
    { prompt: '« Jouer au football » :', options: ['tocar al fútbol', 'jugar al fútbol', 'hacer el fútbol', 'jugar el fútbol'], correct_index: 1, explanation: 'Jugar a + el = jugar al fútbol.' },
    { prompt: 'La persona que hace respetar las reglas del partido es…', options: ['el entrenador', 'el árbitro', 'el aficionado', 'el jugador'], correct_index: 1, explanation: 'El árbitro = l\'arbitre.' },
    { prompt: '« Faire match nul » :', options: ['ganar', 'perder', 'empatar', 'marcar'], correct_index: 2, explanation: 'Empatar = faire match nul.' },
    { prompt: '« J\'adore les films d\'action » :', options: ['Me encanta las películas de acción.', 'Me encantan las películas de acción.', 'Yo encanto las películas de acción.', 'Me gusto las películas de acción.'], correct_index: 1, explanation: 'Sujet pluriel → encantan.' },
    { prompt: '« Les paroles d\'une chanson » :', options: ['las palabras', 'la letra', 'el ritmo', 'el disco'], correct_index: 1, explanation: 'La letra = les paroles.' },
    { prompt: '« Le match » :', options: ['la partida', 'el partido', 'el juego', 'la parte'], correct_index: 1, explanation: 'El partido = le match.' },
    // Grammaire (7)
    { prompt: 'Ayer yo ______ al fútbol.', options: ['jugo', 'jugué', 'jugé', 'jugó'], correct_index: 1, explanation: 'yo → jugué (g → gu devant é).' },
    { prompt: 'Él ______ toda la noche.', options: ['bailo', 'bailó', 'bailé', 'bailaba'], correct_index: 1, explanation: 'Indefinido, él : -ó avec accent.' },
    { prompt: 'El sábado pasado nosotros ______ al estadio.', options: ['fuimos', 'fueron', 'hemos ido', 'vamos'], correct_index: 0, explanation: 'Ir, nosotros : fuimos (moment terminé).' },
    { prompt: 'Indefinido de « hacer », él :', options: ['hació', 'hizo', 'hico', 'hice'], correct_index: 1, explanation: 'hacer → hizo.' },
    { prompt: 'Indefinido de « tener », yo :', options: ['tení', 'tuve', 'tuvo', 'tené'], correct_index: 1, explanation: 'tener → tuve.' },
    { prompt: '______ un concierto inolvidable.', options: ['Fué', 'Fue', 'Fui', 'Era fue'], correct_index: 1, explanation: 'Ser, él : fue (sans accent).' },
    { prompt: 'Choisis la phrase correcte :', options: ['Ayer he visto el partido.', 'Ayer vi el partido.', 'Ayer veo el partido.', 'Ayer vió el partido.'], correct_index: 1, explanation: 'Ayer → indefinido ; vi sans accent.' },
    // Compréhension — texte « La rumba y el flamenco » (6)
    { prompt: '¿En qué año fue inscrito el flamenco en la lista de la UNESCO?', options: ['En 1959', 'En 2010', 'En 2021', 'En 1950'], correct_index: 1, explanation: 'Paragraphe 1.' },
    { prompt: '¿Dónde nació el flamenco?', options: ['En Madrid', 'En Andalucía', 'En Cuba', 'En Brazzaville'], correct_index: 1, explanation: 'Paragraphe 2.' },
    { prompt: 'Los tres elementos del flamenco son…', options: ['el cante, el toque y el baile', 'la guitarra, el piano y el tambor', 'la letra, el ritmo y el disco', 'el teatro, el café y la casa'], correct_index: 0, explanation: 'Paragraphe 2.' },
    { prompt: '¿Cuándo nació la rumba congoleña?', options: ['En el siglo diecinueve', 'En los años cuarenta y cincuenta del siglo veinte', 'En 2021', 'En 1990'], correct_index: 1, explanation: 'Paragraphe 3.' },
    { prompt: '¿Qué orquesta se fundó en Brazzaville en 1959?', options: ['OK Jazz', 'Les Bantous de la Capitale', 'Los Gitanos', 'La Orquesta de Cuba'], correct_index: 1, explanation: 'Paragraphe 3.' },
    { prompt: 'Según el texto, el flamenco y la rumba…', options: ['nacieron en el pueblo y mezclaron influencias diferentes', 'nacieron en el mismo país', 'son músicas modernas', 'no tienen nada en común'], correct_index: 0, explanation: 'Paragraphe 5.' },
  ],
}
