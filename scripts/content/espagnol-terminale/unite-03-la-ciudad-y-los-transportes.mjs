/**
 * Espagnol Terminale A — Unité 3 : La ciudad y los transportes (La ville et les transports).
 *
 * Même gabarit que les unités 1 et 2. Notion de grammaire unique : l'impératif
 * affirmatif (tú, usted, vosotros, ustedes) pour indiquer un chemin et donner des
 * instructions. L'impératif négatif (no + subjonctif) est seulement signalé : il
 * sera vu avec le subjonctif à l'unité 7. Thème issu de la méthode fournie par
 * l'utilisateur (pas de programme INRAP d'espagnol disponible).
 */

export const unit = {
  chapterTitle: 'UNIDAD 3 — LA CIUDAD Y LOS TRANSPORTES / LA VILLE ET LES TRANSPORTS',
  description: 'ESPAGNOL · UNIDAD 3 — La ciudad y los transportes · s\'orienter, indiquer un chemin · l\'impératif',
  order: 3,
}

export const lessons = [
  {
    type: 'cours',
    title: 'Unidad 3 — Introducción : La ciudad y los transportes',
    content: `## La ciudad y los transportes — La ville et les transports

**Niveau :** Terminale A (espagnol, deuxième langue) · **Durée conseillée :** 4 séances de 45 à 90 minutes

### Pourquoi ce thème ?

Brazzaville, Pointe-Noire, Malabo, Madrid : chaque ville a ses quartiers, ses marchés, ses embouteillages et ses moyens de transport. Savoir **décrire sa ville**, **demander son chemin**, **indiquer une direction** et **parler des transports** est indispensable pour voyager ou accueillir un visiteur hispanophone. Dans cette unité, tu vas aussi apprendre l'**impératif**, le mode des instructions : « tourne à gauche », « prenez le bus », « traverse la rue ».

### Objectifs — À la fin de l'unité, tu pourras :

- **utiliser** le vocabulaire de la ville, des directions et des transports (≈ 45 mots) ;
- **donner des instructions et indiquer un chemin** avec l'**impératif affirmatif** (sigue, gira, cruza, tome, vaya…) ;
- **comprendre** un appel téléphonique pour guider un visiteur perdu et un texte sur les transports dans trois villes ;
- **demander et indiquer un chemin** à l'oral, en tutoyant ou en vouvoyant ;
- **écrire** un message de 120 à 150 mots pour expliquer à un ami comment venir chez toi.

### Le parcours de l'unité

| Étape | Ce que tu fais | Compétence |
|---|---|---|
| 1. Vocabulario | La ville, les directions, les transports | Lexique |
| 2. Gramática | L'impératif affirmatif | Langue |
| 3. Escuchar | « ¡Me he perdido! » : guider un ami par téléphone | Comprendre à l'oral |
| 4. Leer | « Moverse en la ciudad: un desafío diario » | Comprendre à l'écrit |
| 5. Hablar | Demander et indiquer un chemin, présenter sa ville | S'exprimer à l'oral |
| 6. Escribir | Message : comment venir chez moi | S'exprimer à l'écrit |
| 7. Ejercicios | Exercices corrigés (bouton en bas de page) | Entraînement |
| 8. Test | QCM de fin d'unité, 20 questions | Évaluation |

### Pour te lancer — Calentamiento

- ¿En qué ciudad vives? ¿En qué barrio?
- ¿Cómo vas al instituto: a pie, en autobús, en taxi?
- ¿Qué lugar de tu ciudad recomiendas a un turista?`,
  },
  {
    type: 'cours',
    title: 'Vocabulario — La ciudad, las direcciones y los transportes',
    content: `## Vocabulario — Le vocabulaire de l'unité

Apprends ces mots par groupes de 10 et lis les exemples à voix haute.

### 1. La ciudad — La ville

| Español | Prononciation | Français | Catégorie | Ejemplo |
|---|---|---|---|---|
| la ciudad | /θjuˈðað/ | la ville | nom | Brazzaville es una ciudad grande. |
| el barrio | /ˈbarjo/ | le quartier | nom | Vivo en el barrio de Moungali. |
| la calle / la avenida | /ˈkaʎe/ /aβeˈniða/ | la rue / l'avenue | nom | Mi casa está en una calle tranquila. |
| la plaza | /ˈplaθa/ | la place | nom | Nos vemos en la plaza. |
| la esquina | /esˈkina/ | le coin (de la rue) | nom | La farmacia está en la esquina. |
| el cruce | /ˈkɾuθe/ | le carrefour | nom | Gira a la derecha en el cruce. |
| el semáforo | /seˈmafoɾo/ | le feu (tricolore) | nom | Para en el semáforo. |
| el puente | /ˈpwente/ | le pont | nom | Cruza el puente. |
| el mercado | /meɾˈkaðo/ | le marché | nom | Mi madre vende en el mercado. |
| la iglesia / la mezquita | /iˈɣlesja/ /meθˈkita/ | l'église / la mosquée | nom | La iglesia está enfrente del colegio. |
| el ayuntamiento | /aʝuntaˈmjento/ | la mairie | nom | El ayuntamiento está en el centro. |
| el hospital / la farmacia | /ospiˈtal/ | l'hôpital / la pharmacie | nom | ¿Dónde está el hospital? |
| el banco / la tienda | /ˈbaŋko/ | la banque / le magasin | nom | Hay un banco al lado de la tienda. |
| el centro / las afueras | /ˈθentɾo/ /aˈfweɾas/ | le centre / la périphérie | nom | Vivo en las afueras. |

### 2. Las direcciones — Les directions

| Español | Français | Ejemplo |
|---|---|---|
| todo recto | tout droit | Sigue todo recto. |
| a la derecha / a la izquierda | à droite / à gauche | Gira a la izquierda. |
| la primera / segunda calle | la première / deuxième rue | Toma la segunda calle a la derecha. |
| al final de | au bout de | Al final de la calle, hay un parque. |
| cerca de / lejos de | près de / loin de | El mercado está cerca de mi casa. |
| al lado de | à côté de | El banco está al lado de la farmacia. |
| enfrente de | en face de | La parada está enfrente del hospital. |
| entre … y … | entre … et … | La tienda está entre el banco y el bar. |
| detrás de / delante de | derrière / devant | El patio está detrás del instituto. |
| a cinco minutos (a pie) | à cinq minutes (à pied) | La estación está a cinco minutos a pie. |

### 3. Los transportes — Les transports

| Español | Prononciation | Français | Catégorie | Ejemplo |
|---|---|---|---|---|
| el coche | /ˈkotʃe/ | la voiture | nom | Mi tío tiene un coche viejo. |
| el autobús / el minibús | /awtoˈβus/ | le bus / le minibus | nom | Voy al instituto en autobús. |
| el taxi | /ˈtaksi/ | le taxi | nom | En Brazzaville los taxis son verdes. |
| la moto | /ˈmoto/ | la moto | nom | La moto es rápida pero peligrosa. |
| la bicicleta | /biθiˈkleta/ | le vélo | nom | Voy en bicicleta. |
| el tren / la estación | /tɾen/ /estaˈθjon/ | le train / la gare | nom | El tren sale de la estación a las seis. |
| el metro | /ˈmetɾo/ | le métro | nom | En Madrid hay metro. |
| el avión / el aeropuerto | /aˈβjon/ | l'avion / l'aéroport | nom | El avión aterriza en Maya-Maya. |
| el barco | /ˈbaɾko/ | le bateau | nom | Cruzamos el río en barco. |
| la parada | /paˈɾaða/ | l'arrêt (de bus) | nom | Espera en la parada. |
| el billete | /biˈʎete/ | le billet | nom | Compra el billete en la taquilla. |
| subir a / bajar de | /suˈβiɾ/ /baˈxaɾ/ | monter dans / descendre de | verbe | Baja en la tercera parada. |
| coger / tomar | /koˈxeɾ/ /toˈmaɾ/ | prendre (un transport) | verbe | Coge el autobús número 5. |
| el atasco | /aˈtasko/ | l'embouteillage | nom | Hay un atasco en la avenida. |
| la hora punta | /ˈoɾa ˈpunta/ | l'heure de pointe | nom | A la hora punta, hay mucho tráfico. |

### Prépositions avec les transports

- **en** + moyen de transport : en autobús, en taxi, en coche, en tren, en avión, en bicicleta.
- mais **a pie** (à pied) et **a caballo** (à cheval).
- **ir a** + lieu (je vais à) : Voy **al** mercado (a + el = **al**). Voy **a la** escuela.

### Faux amis et nuances

- **la carta** = la lettre ; « une carte (de ville) » = **el plano** ou **el mapa**.
- **la parada** = l'arrêt de bus ; « la parade » = el desfile.
- **coger** = prendre (en Espagne et en Guinée équatoriale) ; en Amérique latine, on dit plutôt **tomar**.
- **el coche** (Espagne) = **el carro** (Amérique latine) = la voiture.

### Mémorisation

Dessine le **plano de tu barrio** (le plan de ton quartier) : ta maison, l'arrêt de bus, le marché, l'école, la pharmacie. Écris en espagnol où se trouve chaque lieu (al lado de, enfrente de, cerca de…).`,
  },
  {
    type: 'cours',
    title: 'Gramática — El imperativo afirmativo',
    content: `## Gramática — L'impératif affirmatif

Pour indiquer un chemin, donner une recette, un conseil ou un ordre, on utilise l'**impératif**. En espagnol, il a des formes différentes pour **tú** (tutoiement), **usted** (vouvoiement d'une personne), **vosotros** (tutoiement de plusieurs personnes, en Espagne) et **ustedes** (vouvoiement de plusieurs personnes, et tutoiement pluriel en Amérique latine et en Guinée équatoriale).

### 1. Observa — Observe d'abord

Phrases tirées de l'appel téléphonique de l'unité :

- **Sal** de la estación y **gira** a la izquierda.
- **Sigue** todo recto hasta el semáforo.
- **Cruza** la avenida y **coge** el minibús.
- Señor, **baje** en la tercera parada, por favor.
- **Llámame** cuando llegues.

### 2. Les verbes réguliers

| Personne | Hablar (-ar) | Comer (-er) | Subir (-ir) |
|---|---|---|---|
| **tú** | habl**a** | com**e** | sub**e** |
| **usted** | habl**e** | com**a** | sub**a** |
| **vosotros** | habl**ad** | com**ed** | sub**id** |
| **ustedes** | habl**en** | com**an** | sub**an** |

**Astuce de formation :**
- **tú** = la forme du présent « él / ella » : él gira → **¡gira!** ; él cruza → **¡cruza!**
- **usted / ustedes** : on **inverse la voyelle** : -ar → **-e / -en** ; -er, -ir → **-a / -an** (gire, giren ; coma, coman ; suba, suban).
- **vosotros** : on remplace le **-r** de l'infinitif par **-d** (girar → girad).

### 3. Les verbes à diphtongue ou irréguliers au présent

La forme **usted** se construit à partir du « yo » du présent : yo **sigo** → usted **siga** ; yo **cojo** → usted **coja** ; yo **vuelvo** → usted **vuelva**.

| Infinitif | yo (présent) | tú | usted | ustedes |
|---|---|---|---|---|
| seguir (continuer) | sigo | **sigue** | **siga** | **sigan** |
| volver (revenir) | vuelvo | **vuelve** | **vuelva** | **vuelvan** |
| coger (prendre) | cojo | **coge** | **coja** | **cojan** |
| cruzar (traverser) | cruzo | **cruza** | **cruce** | **crucen** |

Orthographe : **z** devient **c** devant e (cruce) ; **g** devient **j** devant a (coja), pour garder le même son.

### 4. Les huit irréguliers à la forme tú

| Infinitif | tú | usted | Ejemplo |
|---|---|---|---|
| decir (dire) | **di** | diga | Di la verdad. |
| hacer (faire) | **haz** | haga | Haz los deberes. |
| ir (aller) | **ve** | **vaya** | Ve al mercado. / Vaya al centro. |
| poner (mettre) | **pon** | ponga | Pon la mochila aquí. |
| salir (sortir) | **sal** | salga | Sal de la estación. |
| ser (être) | **sé** | sea | Sé puntual. |
| tener (avoir) | **ten** | tenga | Ten cuidado. |
| venir (venir) | **ven** | venga | Ven a mi casa. |

### 5. L'impératif avec un pronom

Le pronom se **colle à la fin** du verbe affirmatif, et on ajoute un **accent écrit** pour garder l'accent tonique :
- llama + me → **llámame** (appelle-moi) ; dime (dis-moi) ; espérame (attends-moi)
- usted : **dígame** (dites-moi), **siéntese** (asseyez-vous)

### 6. Cinco ejemplos sobre el tema

1. **Coge** el autobús número 3 y **baja** en la plaza.
2. Señora, **siga** todo recto y **gire** a la derecha.
3. **Ven** a mi casa el sábado.
4. Chicos, **tened** cuidado al cruzar la calle.
5. Señores, **tomen** un taxi: el aeropuerto está lejos.

### 7. Erreurs fréquentes

| Faux | Correct | Pourquoi |
|---|---|---|
| ¡Gira tú a la izquierda, señor! | ¡Gire a la izquierda, señor! | vouvoiement → forme usted |
| Sigua todo recto. | Siga todo recto. | seguir → sigo → siga |
| ¡Vas al mercado! (ordre) | ¡Ve al mercado! | impératif de ir : ve |
| Hace los deberes. (ordre) | Haz los deberes. | impératif irrégulier : haz |
| Me llama. (ordre : appelle-moi) | Llámame. | pronom collé à la fin + accent |
| Cruze la calle. | Cruce la calle. | z → c devant e |
| Sale de casa. (ordre) | Sal de casa. | impératif irrégulier : sal |

### Pour aller plus loin : l'impératif négatif

Pour dire « ne… pas », l'espagnol utilise **no + subjonctif présent**, une autre forme : **No cruces** (ne traverse pas), **No gires** (ne tourne pas). Tu l'étudieras avec le subjonctif dans l'**unité 7**. En attendant, retiens ces trois formules très utiles : **No corras** (ne cours pas), **No te preocupes** (ne t'inquiète pas), **No tengas miedo** (n'aie pas peur).

### A ti

Les exercices de grammaire corrigés sont dans le bouton « Exercices » en bas de page (exercices 1 à 3).`,
  },
  {
    type: 'cours',
    title: 'Escuchar — ¡Me he perdido!',
    content: `## Escuchar — Comprendre à l'oral

**Situation :** Santiago est venu de Malabo à Brazzaville pour un échange scolaire d'une semaine. Il devait retrouver Divine chez elle, mais il s'est perdu en sortant de la gare routière. Il l'appelle au téléphone. Ensuite, il demande son chemin à un passant. (Les lieux du quartier sont imaginaires.)

### Antes de escuchar — Avant d'écouter

1. Mots-clés : perderse (se perdre), la estación de autobuses (la gare routière), el semáforo (le feu), la parada (l'arrêt), el vendedor (le vendeur).
2. Devine : quelles instructions Divine va-t-elle donner à Santiago ?

### Comment travailler

L'enregistrement audio sera bientôt disponible dans l'application. En attendant :

- **Première écoute :** fais-toi lire le dialogue sans le regarder ; réponds aux questions globales (exercice 4, partie A).
- **Deuxième écoute :** relis le texte, dessine le trajet sur une feuille, puis réponds aux questions de détail.
- **Troisième écoute :** lis-le à trois en jouant les rôles.

### Transcripción — Transcription

**Divine:** ¿Diga? ¡Santiago! ¿Dónde estás? Te estamos esperando para comer.

**Santiago:** ¡Ay, Divine, me he perdido! Estoy delante de la estación de autobuses, pero no sé qué dirección tomar. Hay mucha gente, muchos taxis verdes… ¡y mucho ruido!

**Divine:** Tranquilo, no te preocupes. Escucha bien. Sal de la estación por la puerta principal y gira a la izquierda. ¿Ves una gasolinera?

**Santiago:** Sí, la veo. Está al lado de un mercado.

**Divine:** Perfecto. Sigue todo recto unos cien metros, hasta el semáforo. En el semáforo, cruza la avenida. Ten cuidado: los coches van muy rápido.

**Santiago:** Vale. Cruzo la avenida… ¿y después?

**Divine:** Enfrente, hay una parada de minibuses. Coge el minibús que va a Moungali. Es azul y blanco. Dile al conductor que bajas en la parada de la farmacia Santa Rita. Son cuatro paradas.

**Santiago:** ¿Y cuánto cuesta el billete?

**Divine:** Doscientos francos. Ten monedas preparadas, porque el conductor no siempre tiene cambio. Cuando bajes del minibús, llámame: mi hermano va a buscarte. La farmacia está a dos minutos de mi casa.

**Santiago:** ¡Muchas gracias! Te llamo enseguida.

(Unos minutos más tarde, Santiago no encuentra la parada y pregunta a un vendedor.)

**Santiago:** Perdone, señor, ¿la parada de los minibuses para Moungali, por favor?

**Vendedor:** Sí, joven. Mire, está ahí, detrás de ese camión rojo. Espere allí. Pero tome el siguiente minibús: ese está completamente lleno.

**Santiago:** Muchas gracias, señor. Muy amable.

**Vendedor:** De nada. ¡Y bienvenido a Brazzaville!

### Vocabulario clave del diálogo

| Español | Français |
|---|---|
| ¿Diga? | Allô ? (en décrochant) |
| me he perdido | je me suis perdu |
| el ruido | le bruit |
| la puerta principal | la porte principale |
| la gasolinera | la station-service |
| el conductor | le chauffeur |
| tener cambio | avoir de la monnaie |
| ir a buscar a alguien | aller chercher quelqu'un |
| enseguida | tout de suite |
| Perdone, … | Excusez-moi, … |
| el siguiente | le suivant |
| lleno | plein |

**Remarque :** Divine **tutoie** Santiago (sal, gira, sigue, cruza, ten, coge, dile, llámame) ; Santiago et le vendeur **se vouvoient** (perdone, mire, espere, tome). Compare les deux séries de formes.

### Preguntas

Les questions de compréhension et leur corrigé sont dans l'**exercice 4**, en bas de page.`,
  },
  {
    type: 'cours',
    title: 'Leer — Moverse en la ciudad: un desafío diario',
    content: `## Leer — Comprendre un texte

### Antes de leer — Avant de lire

Lis le titre et la première phrase de chaque paragraphe. Quelles villes sont présentées ? Quel problème ont-elles en commun ?

### Moverse en la ciudad: un desafío diario

**1.** Hoy, más de la mitad de la población del mundo vive en ciudades, y cada mañana millones de personas tienen el mismo problema: ¿cómo llegar al trabajo o a la escuela a tiempo? En las grandes ciudades, moverse es un desafío diario. Los atascos, el ruido y la contaminación son parte de la vida urbana, en África como en Europa.

**2.** En Brazzaville, la mayoría de la gente se desplaza en taxi, en minibús o a pie. Los taxis, pintados de verde, son fáciles de reconocer y no son muy caros si se comparten. Los minibuses son más baratos, pero a la hora punta están llenos y hay que esperar mucho tiempo en las paradas. Muchos estudiantes caminan varios kilómetros cada día porque el transporte es demasiado caro para su familia.

**3.** En Madrid, la capital de España, la situación es diferente. La ciudad tiene una de las redes de metro más grandes de Europa, con cientos de estaciones. También hay autobuses, trenes de cercanías y bicicletas públicas que se alquilan con una tarjeta. Sin embargo, muchos madrileños todavía usan el coche y los atascos son frecuentes. Por eso, el ayuntamiento ha prohibido la entrada de los coches más contaminantes en el centro.

**4.** En Malabo, la capital de Guinea Ecuatorial, la ciudad crece rápidamente. Se han construido nuevas carreteras y avenidas, y el taxi colectivo es el medio de transporte más popular. Como Malabo está en una isla, el avión y el barco son también muy importantes para viajar al continente.

**5.** ¿Cuál es la solución? Los expertos dan los mismos consejos a todas las ciudades: desarrollen el transporte público, construyan aceras seguras para los peatones, planten árboles y animen a la gente a usar la bicicleta. Y a los ciudadanos les dicen: compartan el coche o el taxi, caminen cuando sea posible y respeten las normas de tráfico. Una ciudad más fácil de recorrer es también una ciudad más humana.

(Texte rédigé pour ce cours, environ 370 mots.)

### Palabras útiles del texto

| Español | Français |
|---|---|
| la mitad | la moitié |
| un desafío | un défi |
| la contaminación | la pollution |
| desplazarse | se déplacer |
| pintado | peint |
| compartir | partager |
| la red | le réseau |
| los trenes de cercanías | les trains de banlieue |
| alquilar | louer |
| la tarjeta | la carte (de transport) |
| crecer | grandir, croître |
| la carretera | la route |
| la acera | le trottoir |
| el peatón | le piéton |
| animar a | encourager à |
| recorrer | parcourir |

### Estrategia de lectura

1. **Lecture globale** : un problème commun (paragraphe 1), trois villes (2, 3, 4), des solutions (5).
2. **Lecture sélective** : pour chaque ville, relève les moyens de transport cités et un problème.
3. **Repère l'impératif** dans le dernier paragraphe : desarrollen, construyan, planten, animen, compartan, caminen, respeten. À quelle personne sont ces verbes ? (ustedes : les experts s'adressent aux villes et aux citoyens.)

### Preguntas

Les questions sont dans les **exercices 5 et 6**, en bas de page.`,
  },
  {
    type: 'cours',
    title: 'Hablar — Preguntar e indicar el camino',
    content: `## Hablar — S'exprimer à l'oral

### 1. Preguntas para conversar — Questions de discussion

Réponds à voix haute en phrases complètes.

1. ¿Cómo es tu barrio? ¿Qué hay cerca de tu casa?
2. ¿Cómo vas al instituto? ¿Cuánto tiempo tardas?
3. ¿Cuál es el medio de transporte más práctico en tu ciudad? ¿Y el más peligroso?
4. ¿Qué problemas de transporte hay en tu ciudad?
5. ¿Qué lugar de tu ciudad recomiendas a un visitante? ¿Por qué?

### 2. Frases modelo — Phrases modèles

| Pour… | Frases |
|---|---|
| Aborder quelqu'un | Perdone, señor / señora… / Oye, perdona… (à un jeune) |
| Demander son chemin | ¿Dónde está…? / ¿Para ir a…, por favor? / ¿Hay un banco por aquí? / ¿Está lejos? |
| Indiquer (tú) | Sigue todo recto. Gira a la derecha. Toma la primera calle. Cruza la plaza. |
| Indiquer (usted) | Siga todo recto. Gire a la izquierda. Tome la segunda calle. Cruce el puente. |
| Situer | Está al lado de… / enfrente de… / al final de la calle / a cinco minutos a pie. |
| Remercier | Muchas gracias, muy amable. — De nada. |

### 3. Juego de rol — En la calle

**Alumno A — un turista español perdido.** Tu demandes le chemin pour aller à trois endroits (l'hôpital, la banque, l'arrêt de bus). Vouvoie ton interlocuteur.

**Alumno B — un habitante del barrio.** Avec le plan dessiné en classe, tu indiques le chemin en vouvoyant (forme usted) : siga, gire, tome, cruce.

Puis échangez les rôles **en vous tutoyant** (forme tú) : sigue, gira, toma, cruza.

### 4. Presentación — Mi ciudad (1 minuto 30)

Présente ta ville ou ton quartier à un visiteur de Malabo : où elle se trouve, les quartiers, les lieux importants, les transports, et donne-lui **trois conseils à l'impératif** (Visita…, Toma…, Ten cuidado con…).

### 5. Debate

**Tema :** « Las motos-taxi deben estar prohibidas en la ciudad. »

- **A favor :** accidents fréquents, conducteurs sans casque ni permis, pollution, bruit.
- **En contra :** rapides dans les embouteillages, bon marché, elles donnent du travail aux jeunes, elles vont là où les bus ne vont pas.

### Consejos para el oral

- L'accent tonique de l'impératif est souvent sur l'avant-dernière syllabe : **gi**ra, **si**gue, **cru**za ; avec pronom, il reste à sa place : **llá**mame.
- **z** et **c** devant e / i se prononcent comme le **th** anglais en Espagne (cruza, cerca), comme un **s** en Amérique latine et souvent en Guinée équatoriale : les deux sont corrects.`,
  },
  {
    type: 'cours',
    title: 'Escribir — Cómo llegar a mi casa',
    content: `## Escribir — S'exprimer par écrit

### El tema — Le sujet

**Ton correspondant arrive dans ta ville ce week-end. Écris-lui un message (120 à 150 mots) : explique-lui comment venir de la gare routière (ou de l'aéroport) jusqu'à chez toi, quel transport prendre, et donne-lui quelques conseils pour se déplacer dans ta ville.**

### Método — Le plan du message

| Partie | Contenu | Outils |
|---|---|---|
| **Saludo** | Formule d'appel | ¡Hola, Santiago! / Querido Santiago: |
| **Introducción** | Exprimer sa joie, rappeler le rendez-vous | ¡Qué bien que vienes! Te espero el sábado. |
| **El trayecto** | Les étapes du chemin, dans l'ordre | Primero, sal… Después, coge… Luego, baja… Al final… |
| **Los transportes** | Quel moyen, quel prix, combien de temps | El minibús cuesta… Tardas unos… minutos. |
| **Consejos** | Deux ou trois conseils à l'impératif | Ten cuidado con… Lleva… Llámame si… |
| **Despedida** | Formule finale | ¡Hasta el sábado! Un abrazo, |

### Expresiones útiles

- **Ordre des étapes :** primero, después, luego, entonces, al final, cuando llegues a…
- **Directions :** sigue todo recto, gira a la derecha / izquierda, toma la primera calle, cruza la avenida, al final de la calle
- **Transport :** coge / toma el autobús número…, baja en la parada de…, el billete cuesta…, tardas … minutos
- **Lieux :** mi casa está enfrente de… / al lado de… / entre … y …
- **Conseils :** ten cuidado con…, lleva…, no olvides…, llámame si te pierdes

### Lista de comprobación

- ☐ Formule d'appel et formule finale.
- ☐ Les étapes du trajet sont dans l'ordre, avec des connecteurs (primero, después, luego…).
- ☐ J'utilise au moins six verbes à l'impératif (forme tú), dont au moins deux irréguliers (sal, ven, ten, haz, pon, ve…).
- ☐ J'utilise au moins trois prépositions de lieu (al lado de, enfrente de, cerca de…).
- ☐ en + transport, mais a pie ; al = a + el.
- ☐ J'ai entre 120 et 150 mots.

### A ti

Rédige ton message dans l'**exercice 9**, puis compare avec l'exemple corrigé.`,
  },
  {
    type: 'resume',
    title: 'Ficha de repaso — La ciudad y los transportes',
    content: `### À retenir — Unidad 3 : La ciudad y los transportes

**Idée centrale :** se déplacer en ville est un défi quotidien partout : embouteillages, bruit, pollution. Brazzaville (taxis verts, minibus, marche à pied), Madrid (grand réseau de métro, vélos publics) et Malabo (taxis collectifs, avion et bateau pour quitter l'île) cherchent des solutions : transports publics, trottoirs sûrs, vélo, partage des véhicules.

**Vocabulaire indispensable**
- Ville : la ciudad, el barrio, la calle, la avenida, la plaza, la esquina, el cruce, el semáforo, el puente, el mercado, el ayuntamiento, el hospital, la farmacia, el centro, las afueras
- Directions : todo recto, a la derecha, a la izquierda, al final de, cerca de, lejos de, al lado de, enfrente de, entre, detrás de, delante de
- Transports : el coche, el autobús, el minibús, el taxi, la moto, la bicicleta, el tren, la estación, el metro, el avión, el barco, la parada, el billete, subir a, bajar de, coger / tomar, el atasco, la hora punta
- Prépositions : en autobús, en taxi… mais a pie ; a + el = al

**Grammaire : l'impératif affirmatif**

| | tú | usted | vosotros | ustedes |
|---|---|---|---|---|
| girar | gira | gire | girad | giren |
| coger | coge | coja | coged | cojan |
| subir | sube | suba | subid | suban |
| seguir | sigue | siga | seguid | sigan |

- tú = forme « él » du présent ; usted / ustedes : on inverse la voyelle (-ar → -e ; -er / -ir → -a), à partir du « yo » du présent (sigo → siga).
- Irréguliers (tú) : di, haz, ve, pon, sal, sé, ten, ven.
- Pronom collé à la fin + accent : llámame, dígame.
- Impératif négatif = no + subjonctif (unité 7) : no te preocupes, no corras.

**Pour l'oral et l'écrit**
- Perdone, ¿para ir a…? / ¿Dónde está…? / ¿Está lejos?
- Primero…, después…, luego…, al final…`,
  },
]

export const exercises = [
  {
    title: 'Ejercicio 1 — El imperativo con tú',
    difficulty: 1,
    statement: `Mets le verbe entre parenthèses à l'**impératif, forme tú**.

1. (girar) ______ a la derecha en el semáforo.
2. (cruzar) ______ la avenida con cuidado.
3. (coger) ______ el autobús número 5.
4. (subir) ______ al minibús azul.
5. (seguir) ______ todo recto hasta la plaza.
6. (salir) ______ de la estación por la puerta principal.
7. (venir) ______ a mi casa el sábado.
8. (tener) ______ cuidado con las motos.
9. (ir) ______ al mercado y compra pan.
10. (hacer) ______ los deberes antes de salir.`,
    solution: `1. **Gira** 2. **Cruza** 3. **Coge** 4. **Sube** 5. **Sigue**
6. **Sal** (irrégulier) 7. **Ven** (irrégulier) 8. **Ten** (irrégulier) 9. **Ve** (irrégulier) 10. **Haz** (irrégulier)

Rappel : pour les réguliers, la forme tú est identique à la forme « él » du présent (él gira → ¡gira!).`,
  },
  {
    title: 'Ejercicio 2 — Tú o usted',
    difficulty: 2,
    statement: `**A. Transforme ces instructions données à un ami (tú) en instructions polies à une dame âgée (usted).**
1. Sigue todo recto.
2. Gira a la izquierda.
3. Toma la segunda calle.
4. Cruza el puente.
5. Coge el taxi.
6. Sube al autobús.

**B. Fais l'inverse : transforme en forme tú.**
7. Baje en la tercera parada.
8. Vuelva mañana.
9. Vaya al hospital.
10. Venga conmigo.`,
    solution: `**A.**
1. **Siga** todo recto. (sigo → siga)
2. **Gire** a la izquierda.
3. **Tome** la segunda calle.
4. **Cruce** el puente. (z → c devant e)
5. **Coja** el taxi. (cojo → coja)
6. **Suba** al autobús.

**B.**
7. **Baja** en la tercera parada.
8. **Vuelve** mañana.
9. **Ve** al hospital.
10. **Ven** conmigo.`,
  },
  {
    title: 'Ejercicio 3 — Pronombres y corrección de errores',
    difficulty: 2,
    statement: `**A. Ajoute le pronom à l'impératif (n'oublie pas l'accent écrit).**
1. llamar + me (tú) → ______
2. decir + me (tú) → ______
3. esperar + nos (tú) → ______
4. decir + me (usted) → ______

**B. Chaque phrase contient une erreur. Corrige-la.**
5. Señor, ¡gira a la izquierda, por favor!
6. Sigua todo recto.
7. ¡Sale de casa ahora!
8. Cruze la calle aquí.
9. Me llama cuando llegues. (sens : appelle-moi)
10. Voy al instituto en pie.`,
    solution: `**A.**
1. **Llámame**
2. **Dime** (une seule syllabe avant le pronom : pas d'accent)
3. **Espéranos**
4. **Dígame**

**B.**
5. Señor, ¡**gire** a la izquierda, por favor! (vouvoiement → usted)
6. **Siga** todo recto. (seguir → sigo → siga)
7. ¡**Sal** de casa ahora! (impératif irrégulier de salir)
8. **Cruce** la calle aquí. (z → c devant e)
9. **Llámame** cuando llegues. (pronom collé + accent)
10. Voy al instituto **a pie**. (a pie, mais en autobús)`,
  },
  {
    title: 'Ejercicio 4 — Escuchar: ¡Me he perdido!',
    difficulty: 1,
    statement: `Réponds aux questions sur le dialogue (leçon Escuchar). Réponds en espagnol, par des phrases complètes.

**A. Comprensión global — ¿Verdadero o falso?**
1. Santiago está en Malabo.
2. Divine explica el camino a Santiago por teléfono.
3. Santiago encuentra la parada sin ayuda.

**B. Comprensión detallada**
4. ¿Dónde está Santiago cuando llama a Divine?
5. ¿Qué ve Santiago a su alrededor? (dos cosas)
6. ¿Por qué puerta tiene que salir de la estación? ¿Y hacia dónde tiene que girar?
7. ¿Qué tiene que hacer en el semáforo? ¿Por qué tiene que tener cuidado?
8. ¿Qué minibús tiene que coger? ¿En qué parada tiene que bajar?
9. ¿Cuánto cuesta el billete? ¿Qué consejo le da Divine?
10. ¿Quién va a buscar a Santiago?
11. ¿Dónde está la parada, según el vendedor? ¿Por qué no debe tomar el primer minibús?`,
    solution: `**A.**
1. **Falso** — está en Brazzaville, para un intercambio escolar.
2. **Verdadero.**
3. **Falso** — pregunta a un vendedor.

**B.**
4. **Está delante de la estación de autobuses.**
5. **Mucha gente, muchos taxis verdes** (y hay mucho ruido); **una gasolinera al lado de un mercado.**
6. **Tiene que salir por la puerta principal y girar a la izquierda.**
7. **Tiene que cruzar la avenida. Tiene que tener cuidado porque los coches van muy rápido.**
8. **El minibús que va a Moungali (azul y blanco). Tiene que bajar en la parada de la farmacia Santa Rita** (cuatro paradas).
9. **Doscientos francos. Le aconseja tener monedas preparadas, porque el conductor no siempre tiene cambio.**
10. **El hermano de Divine.**
11. **Está detrás de un camión rojo. No debe tomar el primer minibús porque está completamente lleno.**`,
  },
  {
    title: 'Ejercicio 5 — Leer: comprensión del texto',
    difficulty: 2,
    statement: `Réponds aux questions sur le texte « Moverse en la ciudad: un desafío diario ».

**A. Comprensión global**
1. El texto: (a) es una guía turística de Madrid (b) presenta los problemas de transporte de tres ciudades y propone soluciones (c) cuenta un viaje en avión.

**B. Comprensión detallada**
2. ¿Qué parte de la población del mundo vive en ciudades?
3. Cita tres problemas de la vida urbana.
4. ¿Cómo se desplaza la mayoría de la gente en Brazzaville?
5. ¿Por qué muchos estudiantes caminan varios kilómetros cada día?
6. Cita tres medios de transporte de Madrid.
7. ¿Qué ha decidido el ayuntamiento de Madrid? ¿Por qué?
8. ¿Por qué el avión y el barco son importantes en Malabo?
9. Cita dos consejos para las ciudades y dos consejos para los ciudadanos.

**C. ¿Verdadero o falso? Justifica con una frase del texto.**
10. En Madrid, nadie usa el coche.`,
    solution: `**A.** 1. **(b)**

**B.**
2. **Más de la mitad.**
3. **Los atascos, el ruido y la contaminación.**
4. **En taxi, en minibús o a pie.**
5. **Porque el transporte es demasiado caro para su familia.**
6. **El metro, los autobuses, los trenes de cercanías, las bicicletas públicas** (tres).
7. **Ha prohibido la entrada de los coches más contaminantes en el centro, porque los atascos son frecuentes** (y para reducir la contaminación).
8. **Porque Malabo está en una isla: hay que tomar el avión o el barco para viajar al continente.**
9. Ciudades: **desarrollar el transporte público, construir aceras seguras, plantar árboles, animar a usar la bicicleta.** Ciudadanos: **compartir el coche o el taxi, caminar, respetar las normas de tráfico.**

**C.**
10. **Falso** — «muchos madrileños todavía usan el coche y los atascos son frecuentes».`,
  },
  {
    title: 'Ejercicio 6 — Leer: vocabulario e interpretación',
    difficulty: 3,
    statement: `**A. Busca en el texto la palabra que significa:**
1. el cincuenta por ciento (párrafo 1)
2. una prueba difícil (párrafo 1)
3. pagar para usar algo durante un tiempo (párrafo 3)
4. la parte de la calle reservada a las personas que caminan (párrafo 5)
5. una persona que va a pie (párrafo 5)

**B.** Dans le paragraphe 5, à qui s'adressent les verbes « desarrollen, construyan, planten » ? À quelle personne sont-ils ? Donne leur infinitif.

**C. Interpretación (4-5 frases en español).**
6. «Una ciudad más fácil de recorrer es también una ciudad más humana». ¿Qué significa? Propón dos soluciones para tu ciudad, con el imperativo.`,
    solution: `**A.**
1. **la mitad**
2. **un desafío**
3. **alquilar**
4. **la acera**
5. **el peatón**

**B.** Ils s'adressent **aux villes (à leurs responsables)**. Ils sont à l'**impératif, forme ustedes**. Infinitifs : **desarrollar, construir, plantar**.

**C. Ejemplo de respuesta :**
6. Significa que, si es fácil moverse, la gente tiene más tiempo para su familia, respira un aire más limpio y vive con menos estrés. En una ciudad así, los niños y los ancianos pueden caminar sin peligro. Para mi ciudad, propongo dos soluciones: construyan aceras para los peatones y pongan más minibuses a la hora punta. Y a los conductores les digo: respeten los semáforos.

Toute réponse cohérente en espagnol, avec au moins deux impératifs, est acceptée.`,
  },
  {
    title: 'Ejercicio 7 — Vocabulario: relaciona y completa',
    difficulty: 1,
    statement: `**A. Relie chaque mot à sa définition.**

| Palabra | Definición |
|---|---|
| 1. el semáforo | a. el lugar donde para el autobús |
| 2. la parada | b. muchos coches que no avanzan |
| 3. el atasco | c. la luz roja, amarilla y verde |
| 4. la esquina | d. el lugar donde salen y llegan los aviones |
| 5. el aeropuerto | e. el lugar donde se encuentran dos calles |

**B. Completa con: enfrente, billete, a pie, bajar, barrio.**
6. Vivo en un ______ muy tranquilo.
7. La farmacia está ______ del hospital.
8. El instituto está cerca: voy ______.
9. Tienes que ______ en la próxima parada.
10. El ______ de minibús cuesta doscientos francos.`,
    solution: `**A.** 1-**c** · 2-**a** · 3-**b** · 4-**e** · 5-**d**

**B.**
6. **barrio**
7. **enfrente**
8. **a pie**
9. **bajar**
10. **billete**`,
  },
  {
    title: 'Ejercicio 8 — Ordena y traduce',
    difficulty: 2,
    statement: `**A. Remets les mots dans l'ordre.**
1. todo / sigue / recto / el semáforo / hasta
2. la segunda / toma / a la derecha / calle
3. al lado / la farmacia / está / del banco
4. el / coge / número 3 / autobús

**B. Traduis en espagnol.**
5. Traverse la rue et tourne à gauche. (tú)
6. Excusez-moi, madame, où est l'hôpital ?
7. Prenez le taxi, l'aéroport est loin. (usted)
8. Viens chez moi samedi et appelle-moi quand tu arrives à la gare.`,
    solution: `**A.**
1. **Sigue todo recto hasta el semáforo.**
2. **Toma la segunda calle a la derecha.**
3. **La farmacia está al lado del banco.**
4. **Coge el autobús número 3.**

**B.**
5. **Cruza la calle y gira a la izquierda.**
6. **Perdone, señora, ¿dónde está el hospital?**
7. **Coja (tome) el taxi, el aeropuerto está lejos.**
8. **Ven a mi casa el sábado y llámame cuando llegues a la estación.**`,
  },
  {
    title: 'Ejercicio 9 — Escribir: cómo llegar a mi casa (120-150 palabras)',
    difficulty: 3,
    statement: `**Tema :** Ton correspondant arrive dans ta ville ce week-end. Écris-lui un message de **120 à 150 mots** : explique-lui comment venir de la gare routière (ou de l'aéroport) jusqu'à chez toi, quel transport prendre, et donne-lui quelques conseils pour se déplacer dans ta ville.

Suis le plan de la leçon Escribir. Utilise au moins six impératifs (forme tú), dont deux irréguliers. Écris ton texte, valide-le, puis compare avec l'exemple corrigé.`,
    solution: `**Ejemplo de mensaje corregido (≈ 145 palabras)**

¡Hola, Santiago!

¡Qué bien que vienes a Pointe-Noire! Te explico cómo llegar a mi casa desde la estación de autobuses.

Primero, sal de la estación y gira a la derecha. Sigue todo recto hasta el cruce, donde hay un gran mercado. Después, cruza la avenida y coge un taxi. Dile al taxista que vas al barrio de Tié-Tié, a la farmacia de la Paz. El taxi cuesta unos mil francos y tardas quince minutos si no hay atasco.

Mi casa está enfrente de la farmacia, al lado de una tienda de móviles. Es una casa blanca con una puerta verde.

Ten cuidado con las motos y lleva tu documento de identidad. Y si te pierdes, llámame enseguida.

¡Hasta el sábado!

Un abrazo,

Divine

**Grille d'auto-évaluation (sur 20)** : forme du message et clarté du trajet (4) · contenu (trajet, transport, conseils) (5) · vocabulaire de la ville et des transports (4) · grammaire : impératif, prépositions (5) · orthographe, accents et ponctuation (2).`,
  },
  {
    title: 'Prueba final — Tareas de expresión escrita y oral',
    difficulty: 3,
    statement: `Ces deux tâches complètent le **QCM de fin d'unité** (20 questions).

**1. Expresión escrita (70-90 palabras).** Un touriste espagnol te demande comment aller de ton lycée au marché le plus proche. Écris les indications **en le vouvoyant** (forme usted) : au moins cinq impératifs et trois prépositions de lieu.

**2. Expresión oral.** Enregistre-toi pendant **1 minute 30** : « Presenta tu barrio a un visitante y dale tres consejos para moverse por la ciudad. »`,
    solution: `**1. Ejemplo de respuesta :**

Buenos días, señor. Es muy fácil. Salga del instituto por la puerta principal y gire a la izquierda. Siga todo recto unos doscientos metros, hasta el semáforo. Allí, cruce la avenida con cuidado, porque hay mucho tráfico. Después, tome la primera calle a la derecha. El mercado está al final de la calle, al lado de una iglesia y enfrente de un banco. Si está cansado, coja un taxi: cuesta muy poco. ¡Buen día!

**2. Points attendus à l'oral :** situer le quartier (está en…, cerca de…), citer des lieux avec des prépositions (al lado de, enfrente de), présenter les transports (en taxi, en minibús, a pie), donner trois conseils à l'impératif (coge…, ten cuidado con…, visita…), parler sans lire.`,
  },
]

export const qcm = {
  title: 'Prueba de la unidad 3 — La ciudad y los transportes',
  time_limit_sec: 900,
  questions: [
    // Vocabulaire (7)
    { prompt: '« L\'embouteillage » se dit :', options: ['el atasco', 'el semáforo', 'el cruce', 'la parada'], correct_index: 0, explanation: 'El atasco = l\'embouteillage.' },
    { prompt: '« Tout droit » se dit :', options: ['todo derecho a la derecha', 'todo recto', 'al final', 'enfrente'], correct_index: 1, explanation: 'Todo recto = tout droit (a la derecha = à droite).' },
    { prompt: 'El lugar donde para el autobús es…', options: ['la estación de tren', 'la parada', 'la esquina', 'la acera'], correct_index: 1, explanation: 'La parada = l\'arrêt.' },
    { prompt: 'Choisis la phrase correcte :', options: ['Voy al instituto en pie.', 'Voy al instituto a pie.', 'Voy al instituto por pie.', 'Voy al instituto de pie.'], correct_index: 1, explanation: 'En autobús, en taxi… mais a pie.' },
    { prompt: '« En face de la pharmacie » :', options: ['al lado de la farmacia', 'detrás de la farmacia', 'enfrente de la farmacia', 'lejos de la farmacia'], correct_index: 2, explanation: 'Enfrente de = en face de.' },
    { prompt: '« Descendre du bus » :', options: ['subir al autobús', 'bajar del autobús', 'coger el autobús', 'perder el autobús'], correct_index: 1, explanation: 'Bajar de = descendre de ; subir a = monter dans.' },
    { prompt: '« Une carte (plan de ville) » se dit :', options: ['una carta', 'un plano', 'una tarjeta', 'una parada'], correct_index: 1, explanation: 'Faux ami : la carta = la lettre ; le plan = el plano.' },
    // Grammaire (7)
    { prompt: 'Impératif, tú : (girar) ______ a la derecha.', options: ['Giras', 'Gira', 'Gire', 'Girad'], correct_index: 1, explanation: 'Tú = forme « él » du présent : gira.' },
    { prompt: 'Impératif, usted : (seguir) ______ todo recto, señora.', options: ['Sigue', 'Sigua', 'Siga', 'Seguid'], correct_index: 2, explanation: 'yo sigo → usted siga.' },
    { prompt: 'Impératif, tú : (salir) ______ de la estación.', options: ['Sale', 'Sal', 'Salga', 'Sali'], correct_index: 1, explanation: 'Irrégulier : salir → sal.' },
    { prompt: 'Impératif, tú : (venir) ______ a mi casa.', options: ['Ven', 'Viene', 'Venga', 'Vienes'], correct_index: 0, explanation: 'Irrégulier : venir → ven.' },
    { prompt: 'Impératif, tú : (ir) ______ al mercado.', options: ['Va', 'Vas', 'Ve', 'Vaya'], correct_index: 2, explanation: 'Irrégulier : ir → ve (usted : vaya).' },
    { prompt: '« Appelle-moi » :', options: ['Me llama.', 'Llamame.', 'Llámame.', 'Llama me.'], correct_index: 2, explanation: 'Pronom collé à la fin + accent écrit.' },
    { prompt: 'Impératif, usted : (cruzar) ______ la calle.', options: ['Cruza', 'Cruze', 'Cruce', 'Cruzad'], correct_index: 2, explanation: 'z devient c devant e : cruce.' },
    // Compréhension — texte « Moverse en la ciudad » (6)
    { prompt: '¿Qué parte de la población mundial vive en ciudades?', options: ['Un cuarto', 'Más de la mitad', 'Casi toda', 'Un diez por ciento'], correct_index: 1, explanation: 'Paragraphe 1.' },
    { prompt: '¿De qué color son los taxis de Brazzaville, según el texto?', options: ['Amarillos', 'Azules', 'Verdes', 'Rojos'], correct_index: 2, explanation: 'Paragraphe 2.' },
    { prompt: '¿Por qué muchos estudiantes de Brazzaville caminan?', options: ['Porque les gusta el deporte', 'Porque el transporte es demasiado caro', 'Porque no hay calles', 'Porque está prohibido el taxi'], correct_index: 1, explanation: 'Paragraphe 2.' },
    { prompt: '¿Qué tiene Madrid?', options: ['Una de las redes de metro más grandes de Europa', 'Muchos taxis verdes', 'Un puerto en una isla', 'Pocas calles'], correct_index: 0, explanation: 'Paragraphe 3.' },
    { prompt: '¿Por qué el avión y el barco son importantes en Malabo?', options: ['Porque no hay carreteras', 'Porque Malabo está en una isla', 'Porque son baratos', 'Porque está prohibido el coche'], correct_index: 1, explanation: 'Paragraphe 4.' },
    { prompt: 'En el texto, «el peatón» es…', options: ['el conductor', 'la persona que va a pie', 'el policía', 'el taxista'], correct_index: 1, explanation: 'Paragraphe 5 : le piéton.' },
  ],
}
