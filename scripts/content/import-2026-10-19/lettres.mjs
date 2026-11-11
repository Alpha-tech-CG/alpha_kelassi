// Français, philosophie, histoire-géographie et anglais — Terminale C et D (scans du 19/10/2026).
// Les textes d'auteurs encore protégés (J.-L. Curtis, E. Argo, R. Howard, manuel d'histoire Bréal)
// sont remplacés par des TEXTES ADAPTÉS rédigés pour l'application (mêmes idées, même structure),
// pour ne pas reproduire d'œuvres protégées ; les questions des sujets sont conservées.

// Décompte des mots à la française : « l'accueil » compte pour deux mots ; la ponctuation ne compte pas.
const mots = (s) => s.replace(/[’']/g, ' ').split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length

const FR_D = 'd31aede0-7812-464a-bd13-e51a130debc3'
const FR_C = '08a44176-47f6-45af-aa4c-f69dd6c50847'
const PHILO_D = '7a970c87-44aa-4eab-8bb7-10b8a2c183bc'
const PHILO_C = '6eacbeed-2a83-4c6b-a6c9-bf34a2d94c63'
const HG_D = '8386f566-931a-440d-a521-15100981090b'
const HG_C = '4202d209-291e-4adf-88fd-b52af08c3a47'
const ANG_D_REF = '9978a6bf-ec46-4e86-aba1-abef81954b44'
const ANG_C_REF = '51e06f13-c59b-46bf-9b88-4850213e221c'

// ── Le Pleurer-Rire ─────────────────────────────────────────────────────────
const leconPleurerRire = {
  title: 'Le Pleurer-Rire : utilité et inutilité du roman',
  content: `*Fiche de cours (Lycée Chaminade, page de l'apprenant). Roman d'Henri Lopes, 1982.*

### Introduction
Parler de l'utilité ou de l'inutilité du *Pleurer-Rire* est difficile, sinon impossible, si l'on ne se réfère pas à l'art en tant qu'activité humaine et à son utilité dans la vie sociale.

### I. Ce que l'art exprime
1. L'art exprime le **réel**, la nature, de façon à les faire apparaître comme vrais.
2. Il exprime l'**imagination** de l'artiste.
3. Il exprime la **beauté**.

### II. L'art pour l'art
- L'art a pour seule finalité la **beauté** et le **plaisir**, sans aucun souci moral (idée reprise par Théophile Gautier, Théodore de Banville puis le Parnasse).
- L'art doit être éternel et ne doit pas chercher l'utile.
- Chercher l'utile, c'est flatter le public aux dépens du travail artistique, qui seul assure la pérennité de l'œuvre.
- Cette conception s'oppose à l'engagement romantique et aux diverses tendances moralisantes.

### III. L'utilité de l'art
**1. En quoi l'art peut-il être utile ?**
- en donnant une **culture** par la lecture ;
- en donnant une **formation morale**, sous forme de préceptes, en nous faisant prendre conscience de nous-mêmes ;
- en **réformant la société** par la satire sociale et l'engagement de l'écrivain.

**2. Pourquoi l'écrivain doit-il chercher à être utile ?**
- L'écrivain est **responsable de son temps** : pour Albert Camus, l'artiste est « embarqué » dans son époque.
- Il rend compte de son génie : il voit ce qui échappe aux autres (c'est un **visionnaire**), il sent et pense mieux.
- Grâce aux prestiges de l'art, il donne une forme frappante et durable aux idées encore informes des hommes.
- Il peut être utile par des engagements directs, par des œuvres à thèse, ou simplement en exprimant toute la réalité et en lui donnant la beauté artistique (peinture totale des séductions et des horreurs, comme dans *Phèdre* ; effet de purification, comme dans *Madame Bovary*).

### IV. *Le Pleurer-Rire* : utilité et inutilité
**1. L'utilité du roman**
- **Par sa forme** : le roman procure un plaisir esthétique grâce à sa forme variée : système de collage (extrait de *Jacques le Fataliste* de Diderot), forme épistolaire (lettres entre Maître et le jeune compatriote en exil), récit qui est à la fois narration et critique de la narration ; la chronologie est brisée pour porter un regard critique sur l'histoire racontée. C'est un véritable culte de l'art.
- **Par son contenu** : c'est un roman contre l'**oppression**, la confiscation des **libertés**, la **démagogie**, le **tribalisme** et la **corruption**. Lopes ose dévoiler l'inhumain et l'immoral ; pour lui, le bon romancier est celui qui dit ce qu'on n'ose pas dire. Le roman est donc un **appel** (pour Sartre, l'œuvre d'art vaut parce qu'elle est appel).
- Le roman véhicule l'**amour de la patrie** : le jeune compatriote en exil s'informe de la situation du pays ; le capitaine Yabaka défend les droits de l'homme ; Malaïka Yabaka et Soukali s'opposent aux agissements du régime de Tonton et encouragent les manifestations.
- Henri Lopes se fait la **« voix des sans-voix »**, le porte-parole du peuple meurtri, dans l'esprit d'Aimé Césaire qui, dans le *Cahier d'un retour au pays natal*, veut que sa bouche soit celle des malheurs qui n'en ont pas.

**2. L'inutilité du roman**
Parler de l'inutilité du *Pleurer-Rire* serait méconnaître les finalités de la littérature. Le roman paraît pourtant **impuissant** face à l'oppression, à la corruption et à la dictature : depuis sa parution (1982), il n'a pu empêcher la tyrannie, la violence ni les coups d'État. L'homme politique tel que le décrit Lopes reste le même dans ses pratiques :
- le culte de la personnalité ;
- la confiscation des libertés ;
- la manipulation de la presse ;
- le maintien au pouvoir par tous les moyens (surarmement, militarisation de jeunes égarés, changements de constitution).

### Conclusion
Quoi qu'il en soit, l'œuvre littéraire incite à la **prise de conscience** et au changement des mœurs : sa contribution éducative et morale est forte, même si elle ne transforme pas immédiatement la réalité.`,
}

const dissertPleurerRire = {
  title: 'Dissertation : le contenu du Pleurer-Rire justifie-t-il son titre ?',
  statement: `**Sujet (Devoirs dirigés n°1, Lycée Chaminade 2021-2022 ; repris au bac blanc zonal de mai 2022, zone 1 Brazzaville-Pool) :**
Montrez que le contenu du roman *Le Pleurer-Rire* d'Henri Lopes justifie le titre.

Rédigez l'introduction, le développement (organisé en parties) et la conclusion.`,
  solution: `*Corrigé du département de français du Lycée Chaminade (2021-2022), mis en forme.*

## I. Analyse du sujet
- **Mots-clés** : *pleurer* : le tragique, ce qui attriste ; *rire* : ce qui divertit, amuse.
- **Reformulation** : le contenu convient au titre parce qu'il est à la fois tragique et comique.
- **Thème** : le titre du roman. **Problème posé** : le rapport entre le titre et le contenu du roman.
- **Problématique** : dans quelle mesure le contenu justifie-t-il le titre *Le Pleurer-Rire* ?
- **Thèse** : le contenu du *Pleurer-Rire* illustre le titre.

## II. Recherche des idées
### Partie 1 : le tragique dans le roman
**1. Le tragique politique**
- *La dictature* : Bwakamabé Na Sakkadé (« Tonton ») est un tyran qui n'accepte pas la moindre contradiction et veut coûte que coûte se maintenir au pouvoir (« prêt à se battre, à mourir et à tuer » pour le garder). Il supprime toutes les libertés de la vie démocratique : plus de multipartisme, d'opposition, d'élections ni de liberté d'expression.
- *La violence* : les démocrates qui refusent de « plier l'échine » sont déportés dans des camps ; on remplit les prisons de membres de la tribu de Polépolé ; on fusille des Djassikini.

**2. Le tragique économique**
- *La mauvaise gestion* : Tonton se paie en premier ; les caisses du trésor s'assèchent ; les fonctionnaires attendent leur salaire 45, 50, 60 jours (« les mois s'étiraient comme du chewing-gum ») ; construction d'un palais de soixante-quinze milliards ; voyages incessants à l'étranger.
- *La corruption* : il suffit de glisser quelques dollars pour découvrir le pays ; l'affaire des dindes géantes de M. Karam.

**3. Le tragique social**
- *Le tribalisme* : Tonton veut être entouré « des siens, rien que des siens » ; les frères de son épouse Ma Mireille sont nommés directeur de la santé et P.D.G. d'une banque ; les Djassikini sont privés de bourses et exclus de la diplomatie et de l'armée ; on impose d'indiquer sa tribu sur les copies d'examen.
- *L'exploitation de la femme* : les « petites mamans » ; des femmes offertes comme cadeaux d'accueil.

**4. Le tragique moral**
- *L'immoralité et la superstition* : Tonton consulte surtout des voyants ; Maître lui-même jette des cauris pour séduire Mme Berger.
- *L'infidélité* : Maître trompe sa femme (Soukali, Cécile, Mme Berger, Ma Mireille) ; Ma Mireille trompe Tonton ; Soukali trompe l'inspecteur Adolphe ; Tonton entretient plusieurs « petites mamans ».

### Partie 2 : le rire
- **Comique de geste** : Tonton exhibe sa cicatrice de la cuisse devant l'ambassadeur de France ; lors de son intronisation coutumière, il décoche des coups de rein en direction de Ma Mireille.
- **Comique de situation** : Tonton, torse nu, exécute une danse érotique avec le sérieux d'un élève appliqué devant un peuple qui applaudit ; le déguisement du colonel Haraka.
- **Comique de langage** : le parler de Tonton, fait de mots tronqués et déformés (« Vec moi », « Zoubliez »…).
- **Comique de caractère** : Tonton qui délire devant le corps du capitaine Yabaka ; la jalousie de Maître ; l'ignorance de Tonton lors de son interview.

### Partie 3 : le mariage du tragique et du comique
- **Dans l'histoire** : un ancien combattant devient président ; il est à la fois dictateur, semi-analphabète, superstitieux et tribaliste — on en rit et on en pleure.
- **Dans les personnages** : Tonton est à la fois sadique et ridicule, infidèle et trompé ; les voyants sont à la fois « puissants » et grotesques.
- **Dans la langue** : langue soignée et langue populaire se mêlent ; hyperboles, antithèses, personnifications, comparaisons ; particularités du français local (« Parle-ko », « dè ») et variations des niveaux de langue.

## III. Conclusion
- **Bilan** : le roman associe constamment la tragédie politique, économique, sociale et morale d'une dictature africaine et le rire qu'elle provoque ; le titre, qui unit les deux verbes, en est le résumé exact.
- **Point de vue** : ce mélange rend la dénonciation plus forte : le rire désarme le tyran et rend le récit supportable.
- **Élargissement** : on peut comparer avec d'autres romans de la dictature (*La Vie et demie* de Sony Labou Tansi).`,
}

// ── Méthodologie et sujets type bac (Français C-D) ───────────────────────────
const leconFonctions = {
  title: 'Les fonctions de la littérature',
  content: `*Fiche de cours.*

### I. Définition de la littérature
La littérature est l'ensemble des œuvres **orales ou écrites** auxquelles on reconnaît une **finalité esthétique**. Elle est la vision du monde propre à un écrivain ou à un groupe d'écrivains. Elle remplit plusieurs fonctions.

### II. Les fonctions de la littérature
La littérature (le roman, le théâtre, la poésie) présente de multiples avantages ; d'où l'étude de ses finalités.

**A. La fonction d'évasion (divertissement)**
La première fonction de la littérature est le **divertissement**. Elle fait s'évader le lecteur à travers les histoires racontées. Par la lecture, l'homme se détend, se décrispe ; cette détente favorise son équilibre mental et son bien-être. La littérature libère aussi l'être humain de ses obsessions. Pour Guy Des Cars, le romancier n'a pas à livrer un message : le roman, c'est l'évasion. Exemples : *Le Tour du monde en quatre-vingts jours* de Jules Verne, *L'Enfant noir* de Camara Laye.

**B. La fonction de dénonciation (engagement)**
L'écrivain doit **prendre position**, **critiquer**, **dénoncer** les abus et les injustices sociales : il lève le voile sur la société. Il doit donc être **engagé**. Jean-Paul Sartre affirme que l'écrivain doit s'engager tout entier dans ses ouvrages ; pour lui, la fonction de l'écrivain est « d'appeler un chat un chat ». L'artiste se fait le **porte-parole des sans-voix** (le peuple) : Aimé Césaire, dans le *Cahier d'un retour au pays natal*, fait de sa bouche celle des malheureux qui n'en ont pas. Richard Wright, écrivain noir américain, voulait défendre les droits de ses compatriotes opprimés. L'artiste devient ainsi un **mage**, un **guide** qui conduit le peuple et dissipe l'obscurantisme : pour Paul Éluard, le poète est un frère voyant qui conduit son frère aveugle ; pour John Steinbeck, le devoir de l'écrivain est de dénoncer les faiblesses et les échecs humains afin que l'homme puisse se perfectionner.

**C. La fonction esthétique**
L'œuvre littéraire a une finalité esthétique : le **Beau**. Elle procure du **plaisir** par les mots, le langage, les sonorités, les images. C'est l'art pour l'art : un art sans but utile, sans préoccupation morale. Théophile Gautier affirme qu'il n'y a de vraiment beau que ce qui ne peut servir à rien.

**D. La fonction didactique**
La finalité de l'écrivain est de **conscientiser**, de **moraliser**, de **former** : il critique les idées afin d'épurer, de purifier l'homme. Pour Sartre, « l'homme est à inventer chaque jour ». L'écrivain doit parler à tous ses contemporains, exprimer leurs joies et leurs colères, les **consoler**. Thomas Mann, dans « L'artiste et la société », reconnaît que l'art n'a jamais pu arrêter le triomphe du mal : il n'est pas une puissance, il n'est qu'une consolation.

La littérature renfermerait enfin la totalité de la **condition humaine** et deviendrait **anthropologique**. Albert Camus, dans son *Discours de Suède* (1957), déclare que l'écrivain est « embarqué » dans son temps.

### À retenir
| Fonction | Rôle | Exemple de référence |
|---|---|---|
| Évasion | divertir, détendre | Jules Verne, Camara Laye |
| Dénonciation | critiquer, s'engager | Sartre, Césaire, Wright |
| Esthétique | créer le Beau, plaire | Théophile Gautier |
| Didactique | instruire, moraliser, consoler | Sartre, Thomas Mann, Camus |`,
}

const resumeArgo = "L'accueil des migrants met l'Europe à l'épreuve : il peut unir ou diviser les peuples. Les Européens doivent être solidaires et fraternels, mais organisés. Pour des pays vieillissants, les migrants sont un atout. Mais leur rejet par les autochtones menace la paix sociale."
const textArgo = `La question de l'accueil des réfugiés et des migrants met aujourd'hui l'Europe à l'épreuve, comme l'avait fait avant elle la crise financière. Elle peut rapprocher les peuples ou, au contraire, fragiliser une construction historique qui représente un vrai progrès de civilisation, même si elle reste perfectible. C'est pourquoi les Européens, fidèles à leurs valeurs, doivent se montrer complémentaires malgré leurs différences et fraternels envers ces populations qui fuient la guerre ou la misère. Mais cet accueil ne peut se faire n'importe comment ni dans le désordre. Avec le vieillissement de la population européenne, les migrations peuvent en effet favoriser le développement de certains pays d'accueil. C'est ainsi que l'Allemagne et l'Autriche, jugées pragmatiques, voient dans l'arrivée des réfugiés une chance économique et sociale immédiate.
Pourtant, la question des conditions d'accueil se pose désormais, car un rejet massif des nouveaux venus par les populations locales pourrait menacer la paix sociale.`

const textArgoSuite = `À plus long terme, il existe aussi un risque d'éclatement culturel et social, et même une perte de compétitivité si les réfugiés rentrent massivement chez eux. En France, pays d'accueil par tradition, la volonté d'intégrer et d'assimiler les immigrés n'empêche pas une partie de la population de craindre d'être envahie. Quant aux pays de l'ancien bloc de l'Est, récemment entrés dans l'Union européenne, ils n'ont pas encore une base sociale assez solide pour accueillir des réfugiés.
Pour mieux organiser l'accueil, il paraît indispensable de mettre en place un plan européen sur dix ans, avec des corridors protégés et un pont humanitaire pour les victimes de guerre. Cette action doit être étudiée et préparée par les instances européennes et les Nations unies ; elle éviterait que les réfugiés tombent entre les mains des passeurs et risquent sans cesse leur vie. Parallèlement, il faudrait réunir autour d'une table les belligérants des pays en guerre afin de favoriser des gouvernements de réconciliation et d'unité nationale.`

const etudeArgo = {
  title: 'Étude de texte argumentatif : l\'accueil des migrants en Europe',
  statement: `**Devoirs dirigés n°1 — Lycée Chaminade, Terminale C-D, 2021-2022 — Sujet n°3 : étude du texte argumentatif**

> *Texte adapté pour l'application d'après un texte d'Emmanuel Argo (« Émergence Tombwa », 1998) : mêmes idées et même plan, rédaction différente.*

${textArgo}

${textArgoSuite}

**I. Questions (6 pts)**
*A. Compréhension (3 pts)*
1. Quel est le problème développé dans ce texte ? (1,5 pt)
2. Relevez dans le texte deux attitudes que les Européens doivent, selon l'auteur, adopter à l'égard des immigrés et des réfugiés. (1,5 pt)
*B. Pratique de la langue (3 pts)*
1. Donnez le sens du mot « migrants ». (1 pt)
2. Soit la phrase : « Cette action doit être étudiée et préparée par les instances européennes. »
a) Mettez le sujet au pluriel et faites toutes les modifications nécessaires. (1 pt)
b) Mettez la phrase obtenue au passé composé de l'indicatif. (1 pt)

**II. Travail d'écriture (14 pts)**
1. **Résumé (6 pts)** : le premier passage du texte (de « La question de l'accueil » jusqu'à « menacer la paix sociale ») compte **${mots(textArgo)} mots**. Résumez-le au quart de sa longueur ; une marge de 10 % en plus ou en moins est tolérée. Indiquez le nombre de mots de votre résumé.
2. **Discussion (8 pts)** : pensez-vous, comme l'auteur, que les migrants ont un impact positif sur les pays d'accueil ?`,
  solution: `## I. Questions
**A. 1.** Le texte traite du problème de l'**accueil des réfugiés et des migrants en Europe** et de leur **intégration** dans les pays d'accueil.
**2.** Les Européens doivent : **se montrer complémentaires** malgré leurs différences ; **se montrer fraternels** envers les populations qui fuient la guerre ou la misère.

**B. 1.** Les **migrants** sont des personnes qui quittent leur pays (ou leur région) pour aller s'installer ailleurs, le plus souvent pour fuir la guerre ou la pauvreté, ou pour chercher du travail.
**2. a)** « **Ces actions doivent être étudiées et préparées** par les instances européennes. »
**b)** « Ces actions **ont dû être étudiées et préparées** par les instances européennes. »

## II. Travail d'écriture
**1. Résumé** — Le passage compte ${mots(textArgo)} mots : le résumé doit en compter environ ${Math.round(mots(textArgo) / 4)} (de ${Math.round(mots(textArgo) / 4 * 0.9)} à ${Math.round(mots(textArgo) / 4 * 1.1)} mots).
Idées essentielles à conserver : l'accueil des migrants est un défi majeur pour l'Europe ; il peut unir ou diviser ; il faut être solidaires et fraternels, mais avec organisation ; les migrants peuvent être un atout pour des pays vieillissants ; mais le rejet par les populations locales menace la paix sociale.

*Proposition de résumé* :
${resumeArgo}
(**${mots(resumeArgo)} mots**)

**2. Discussion** (plan binaire)
- *Mots-clés* : migrations (le fait de quitter un pays pour s'établir dans un autre) ; impact positif (favoriser, stimuler le développement) ; pays d'accueil (ici l'Europe).
- *Problématique* : en quoi les migrations sont-elles un facteur de progrès pour les pays d'accueil ? Ne leur causent-elles pas aussi du tort ?

**Thèse : les migrations sont un facteur de développement**
- Elles soutiennent la **croissance économique** : main-d'œuvre abondante et bon marché dans les entreprises de tous genres.
- Les pays d'accueil profitent des **talents sportifs** des migrants (joueurs africains dans les grands clubs européens).
- Ils profitent de leurs **compétences intellectuelles** : écrivains, universitaires, ingénieurs, médecins africains installés en Europe.
- Elles favorisent les **échanges culturels** et le métissage (musique, art, cuisine).

*Transition* : si les migrations enrichissent les pays d'accueil, elles leur posent aussi des problèmes.

**Antithèse : les migrations peuvent nuire aux pays d'accueil**
- Problèmes d'**insécurité** souvent mis en avant (réseaux criminels, tensions).
- Elles accroissent la **dépense publique** : hébergement, soins, nourriture des réfugiés.
- Difficultés d'**intégration** : ghettos, conflits, rejet et racisme.
- **Désorganisation économique** : travail au noir, fausses identités, pas d'impôts.

**Conclusion** : bilan (atout réel mais à certaines conditions) ; point de vue personnel argumenté ; ouverture possible sur la nécessité de développer les pays de départ.`,
}

const dissertJeunesse = {
  title: 'Dissertation : « La jeunesse est la principale ressource du développement des nations »',
  statement: `**Devoirs dirigés n°1 (Lycée Chaminade, 2021-2022) — sujet repris au bac blanc zonal de mai 2022 (zone 1)**

Dans une revue de sociologie, un observateur aguerri déclare : « La jeunesse est la principale ressource du développement des nations. »
Expliquez et discutez cette assertion en vous inspirant de la réalité quotidienne.

*(Au bac blanc zonal, la consigne était : « Expliquez cette assertion », avec « principale source » au lieu de « principale ressource ».)*`,
  solution: `*Corrigé du département de français du Lycée Chaminade, complété pour la consigne « discutez ».*

## I. Analyse du sujet
- **Mots-clés** : *la jeunesse* : période de la vie entre l'enfance et la maturité, et l'ensemble des jeunes ; *principale ressource du développement* : ce qui contribue le plus à l'émergence, au progrès des nations.
- **Reformulation** : selon un observateur, ce sont surtout les jeunes qui font progresser les nations.
- **Thème** : la jeunesse. **Problème posé** : le rôle de la jeunesse dans l'évolution des nations.
- **Problématique** : dans quelle mesure la jeunesse contribue-t-elle au développement des nations ? Est-elle la seule, ou la principale, ressource de ce développement ?
- **Plan** : explicatif (si la consigne est « expliquez ») ; dialectique (si la consigne est « expliquez et discutez »).

## II. Introduction (à rédiger)
Partir d'un constat général (la population africaine est très jeune), citer le sujet, poser la problématique, annoncer le plan.

## III. Développement
### Thèse : la jeunesse est un puissant atout du progrès
1. **Sur le plan démographique** : la jeunesse est dynamique et vigoureuse ; elle assure le renouvellement des générations, alors que les pays vieillissants manquent de bras.
2. **Sur le plan scientifique** : les jeunes mettent activement leur intelligence au service de l'innovation (Mark Zuckerberg a créé Facebook à vingt ans ; le Congolais Vérone Mankou a conçu une tablette et un smartphone africains).
3. **Sur le plan socio-politique** : la jeunesse apporte des idées nouvelles, d'où l'émergence de jeunes dirigeants (Sebastian Kurz, Emmanuel Macron, Juan Guaidó).
4. **Sur le plan économique** : les jeunes sont efficaces au travail et constituent un vaste marché (mode, téléphonie, musique, sport).

### Antithèse (pour « discutez ») : la jeunesse n'est pas toujours une ressource
1. Sans **formation** ni **emploi**, la jeunesse devient un poids : chômage, exode, délinquance, drogue, violences.
2. Une jeunesse **manipulée** peut être enrôlée dans des milices ou des conflits.
3. Le développement exige aussi l'**expérience** des aînés, des institutions solides, une bonne gouvernance et des ressources naturelles bien gérées.

### Synthèse
La jeunesse est la principale ressource **potentielle** des nations ; elle ne devient une véritable force de développement que si elle est **éduquée, formée, employée** et associée aux décisions, aux côtés de l'expérience des aînés.

## IV. Conclusion
Bilan des idées ; point de vue personnel ; élargissement (par exemple sur les politiques d'emploi des jeunes en Afrique).`,
}

const resumeCurtis = "Le livre et la littérature pourraient bientôt disparaître, car notre manière de voir, d'entendre et de lire a profondément changé. Les images et l'information instantanée ont élargi nos connaissances et notre horizon au monde entier, de l'infiniment petit jusqu'à l'espace."
const textCurtis = `Il se pourrait que la littérature et les livres, tels que nous les connaissons, n'aient plus devant eux un très long avenir. Beaucoup de signes semblent l'annoncer. Je ne suis ni prophète ni spécialiste de l'avenir et je ne ferai aucune prédiction, mais il est certain qu'en une seule génération notre manière de voir, d'entendre et de lire s'est profondément transformée.
L'information instantanée et le bombardement continu des images ont changé notre façon de percevoir le monde. Il y a quelques siècles, le cerveau humain, cet ordinateur vivant, traitait des données simples, limitées à un petit cercle de connaissances et à un petit territoire. Ces deux espaces se sont considérablement élargis : l'un s'étend désormais à tout le savoir, l'autre à l'univers entier.
On nous fait voir aussi bien ce qui se passe à l'intérieur des molécules que les premiers pas de l'homme sur la Lune. Nous suivons de près la vie politique de notre village, et nous apercevons de plus loin celle des grandes puissances.`

const textCurtisSuite = `Grâce aux médias, même les questions scientifiques les plus difficiles nous sont expliquées par des spécialistes à la radio et à la télévision. Le savoir ne nous parvient plus seulement par la lecture : il passe de plus en plus par l'image.
Nous sommes donc en train de quitter la civilisation de l'écriture, née avec l'imprimerie, pour entrer dans une civilisation nouvelle. Voilà pourquoi la littérature ne sait plus très bien quelle est sa place dans un monde qui lui retire peu à peu ses anciens pouvoirs. Débordée par l'image, elle est tentée de se replier sur elle-même et de s'interroger sur son propre outil : le langage. Les écrivains continuent pourtant d'écrire, et ils sont même de plus en plus nombreux ; mais il n'est pas confortable de travailler à cheval entre deux civilisations.`

const etudeCurtis = {
  title: 'Bac blanc zonal mai 2022 — Étude de texte : le livre dans l\'impasse ?',
  statement: `**Inspection des lycées d'enseignement général zone 1 (Brazzaville-Pool) — Bac blanc zonal, mai 2022 — Français C/D — Durée 3 h**
*Le candidat traite l'un des trois sujets : sujet n°1, dissertation sur* Le Pleurer-Rire *; sujet n°2, dissertation sur la jeunesse (voir ces exercices dans le cours) ; sujet n°3 ci-dessous.*

**Sujet n°3 : étude du texte argumentatif — « Le livre dans l'impasse ? »**

> *Texte adapté pour l'application d'après un texte de Jean-Louis Curtis (*Questions à la littérature*, 1973) : mêmes idées et même plan, rédaction différente.*

${textCurtis}

${textCurtisSuite}

**I. Questions (6 pts)**
*A. Compréhension (3 pts)*
1. Quel est le thème développé dans ce texte ? (1 pt)
2. Reformulez la thèse de l'auteur. (2 pts)
*B. Pratique de la langue (3 pts)*
1. Donnez le sens de l'expression « le bombardement continu des images ». (1 pt)
2. Soit la phrase : « Ces deux espaces se sont considérablement élargis. »
a) Réécrivez-la au plus-que-parfait. (1 pt)
b) Déterminez la nature de cette proposition. (1 pt)

**II. Travail d'écriture (14 pts)**
1. **Résumé (6 pts)** : le premier passage du texte (de « Il se pourrait » jusqu'à « celle des grandes puissances ») compte **${mots(textCurtis)} mots**. Résumez-le au quart de sa longueur ; une marge de 10 % en plus ou en moins est tolérée.
2. **Discussion (8 pts)** : pensez-vous que le livre n'est plus important dans un monde dominé par l'image ?`,
  solution: `## I. Questions
**A. 1.** Le thème : l'**avenir du livre et de la littérature** face à la **civilisation de l'image** (télévision, médias).
**2.** Thèse : la littérature et le livre tels que nous les connaissons risquent de disparaître, car l'**image** et l'**information instantanée** remplacent peu à peu la **lecture** comme moyen d'accéder au savoir ; débordée, la littérature ne sait plus quelle est sa place et se replie sur elle-même.

**B. 1.** « Le bombardement continu des images » : l'exposition **permanente, massive et répétée** aux images diffusées par les médias (télévision, écrans), qui s'imposent à nous sans répit.
**2. a)** « Ces deux espaces **s'étaient** considérablement **élargis**. »
**b)** C'est une **proposition indépendante** (un seul verbe conjugué, elle ne dépend d'aucune autre proposition).

## II. Travail d'écriture
**1. Résumé** — Le passage compte ${mots(textCurtis)} mots : le résumé doit en compter environ ${Math.round(mots(textCurtis) / 4)} (de ${Math.round(mots(textCurtis) / 4 * 0.9)} à ${Math.round(mots(textCurtis) / 4 * 1.1)} mots). Idées essentielles : le livre et la littérature pourraient disparaître ; notre façon de percevoir a changé en une génération ; l'information instantanée et les images ont élargi notre horizon de connaissances et notre horizon géographique ; nous voyons désormais aussi bien l'infiniment petit que l'espace.

*Proposition de résumé* :
${resumeCurtis}
(**${mots(resumeCurtis)} mots**)

**2. Discussion** (plan dialectique)
*Problématique* : à l'ère de la télévision, d'Internet et des réseaux sociaux, le livre a-t-il perdu son importance ?

**Thèse : l'image concurrence fortement le livre**
- Elle est **rapide**, attrayante, accessible même à ceux qui lisent mal ; elle informe en temps réel.
- Les **vidéos éducatives**, documentaires et cours en ligne transmettent le savoir de façon vivante.
- Les jeunes lisent moins ; les écrans occupent leur temps libre.

**Antithèse : le livre reste irremplaçable**
- Il développe la **réflexion**, la **concentration**, l'**imagination** et l'**esprit critique**, alors que l'image impose sa vision et se consomme passivement.
- Il **conserve** et transmet durablement le savoir, la mémoire, la littérature ; il reste la base de l'école et des examens.
- Il ne demande ni électricité ni connexion ; il est accessible partout, ce qui compte en Afrique.
- Le livre se transforme sans disparaître : livres numériques, liseuses, bibliothèques en ligne.

**Synthèse** : l'image et le livre sont **complémentaires** : l'image attire et informe vite, le livre approfondit et forme l'esprit.

**Conclusion** : bilan, point de vue personnel argumenté, ouverture (par exemple sur la place de la lecture dans l'éducation des jeunes).`,
}

// ── Philosophie ─────────────────────────────────────────────────────────────
const philo = [
  {
    title: 'Dissertation : l\'inconscient est-il une certitude ?',
    statement: `**Lycée Chaminade, département de philosophie, 2021-2022 — Devoir surveillé, Terminale D, 2 heures** (l'élève traite l'un des trois sujets proposés)

Sujet n°1 : **L'inconscient est-il une certitude ?**

Rédigez une dissertation complète (introduction, développement en trois parties, conclusion).`,
    solution: `## Analyse du sujet
- **Inconscient** : ensemble des processus psychiques qui échappent à la conscience mais influencent nos pensées et nos actes (au sens de Freud : contenus refoulés).
- **Certitude** : connaissance indubitable, fondée sur des preuves ; s'oppose à l'hypothèse, à l'opinion.
- **Problème** : l'inconscient, qui par définition échappe à la conscience, peut-il être connu avec certitude, ou n'est-il qu'une hypothèse ?

## Plan proposé
**I. L'inconscient semble une certitude (thèse)**
- Freud montre ses manifestations : **lapsus**, **actes manqués**, **rêves** (« voie royale qui mène à l'inconscient »), **symptômes** névrotiques que la conscience n'explique pas.
- La **cure psychanalytique** guérit en faisant revenir à la conscience des souvenirs refoulés : l'efficacité de la thérapie semble prouver la réalité de l'inconscient.
- La conscience n'est pas transparente : nous ignorons souvent les vraies raisons de nos actes (Spinoza : les hommes se croient libres parce qu'ils ignorent les causes qui les déterminent).

**II. L'inconscient n'est qu'une hypothèse (antithèse)**
- Il n'est jamais observé directement : on le **déduit** de ses effets. Pour Popper, la psychanalyse n'est pas réfutable, donc pas scientifique.
- Pour **Descartes**, la pensée se connaît elle-même : « penser » et « avoir conscience » se confondent.
- Pour **Sartre**, invoquer l'inconscient est souvent une **mauvaise foi** : une façon de fuir sa responsabilité. Pour **Alain**, l'inconscient est une manière de « donner dignité à notre corps », non une seconde personne en nous.

**III. Une hypothèse féconde (synthèse)**
L'inconscient n'est pas une certitude au sens des sciences exactes, mais une **hypothèse nécessaire et féconde** : elle rend intelligibles des faits que la conscience seule n'explique pas, et elle aide à soigner. Elle invite l'homme à mieux se connaître sans renoncer à sa responsabilité.

## Conclusion
L'inconscient n'est pas une certitude démontrée mais une hypothèse vraisemblable et utile ; reconnaître ses limites n'enlève rien à la tâche de la conscience : se connaître et répondre de ses actes.`,
  },
  {
    title: 'Dissertation : l\'impression garantit-elle la connaissance ?',
    statement: `**Lycée Chaminade, département de philosophie, 2021-2022 — Devoir surveillé, Terminale D, 2 heures**

Sujet n°2 : **L'impression garantit-elle la connaissance ?**

Rédigez une dissertation complète.`,
    solution: `## Analyse du sujet
- **Impression** : donnée immédiate des sens (sensation, perception) ou sentiment spontané, première idée qu'on se fait d'une chose.
- **Garantir** : assurer, rendre certain. **Connaissance** : savoir vrai et justifié.
- **Problème** : suffit-il de sentir ou de percevoir pour connaître avec certitude ?

## Plan proposé
**I. L'impression est à la source de la connaissance (thèse)**
- Pour les **empiristes**, toute connaissance vient de l'expérience : l'esprit est d'abord une « table rase » (Locke) ; pour Hume, toutes nos idées dérivent de nos **impressions**.
- Les sens nous mettent en contact direct avec le réel ; la science part de l'observation.

**II. L'impression ne suffit pas, elle peut tromper (antithèse)**
- Les **illusions des sens** : le bâton qui paraît brisé dans l'eau ; Descartes et le **morceau de cire** : ce que je sais de la cire, je le conçois par l'entendement, non par les sens.
- L'impression est **subjective** et variable d'une personne à l'autre ; les « premières impressions » sont souvent des préjugés.
- **Platon** (allégorie de la caverne) : les sens ne montrent que des ombres. **Bachelard** : l'expérience première est un **obstacle épistémologique** ; la science se construit contre l'évidence sensible.

**III. L'impression, point de départ que la raison doit éprouver (synthèse)**
**Kant** : « toute notre connaissance commence avec l'expérience, mais il ne s'ensuit pas qu'elle dérive toute de l'expérience ». L'impression fournit la matière ; la **raison**, la **méthode** et la **vérification** (expérimentation, démonstration) en font une connaissance.

## Conclusion
L'impression ne garantit pas la connaissance : elle en est le point de départ nécessaire mais insuffisant ; la connaissance exige le travail critique de la raison.`,
  },
  {
    title: 'Dissertation : la contradiction conduit-elle au savoir ?',
    statement: `**Lycée Chaminade, département de philosophie, 2021-2022 — Devoir surveillé, Terminale D, 2 heures**

Sujet n°3 : **La contradiction conduit-elle au savoir ?**

Rédigez une dissertation complète.`,
    solution: `## Analyse du sujet
- **Contradiction** : opposition entre deux affirmations (contredire quelqu'un, le débat) ou, en logique, le fait d'affirmer une chose et son contraire.
- **Conduire au savoir** : permettre d'atteindre une connaissance vraie.
- **Problème** : l'opposition des idées est-elle un chemin vers la vérité, ou un obstacle (confusion, erreur) ?

## Plan proposé
**I. La contradiction est un moteur du savoir (thèse)**
- **Socrate** : par le dialogue et la réfutation, il fait apparaître les contradictions de son interlocuteur, le délivre de ses fausses certitudes et l'amène à chercher le vrai (maïeutique).
- **Hegel** : la pensée progresse par la **dialectique** ; la contradiction (thèse/antithèse) est dépassée dans une synthèse plus riche.
- En **science**, les théories avancent par la critique : pour **Popper**, une théorie doit pouvoir être réfutée ; pour **Bachelard**, la science progresse en rectifiant ses erreurs.

**II. La contradiction peut aussi éloigner du savoir (antithèse)**
- En **logique**, une pensée contradictoire est fausse ou absurde : le **principe de non-contradiction** (Aristote) est la condition de toute vérité.
- La contradiction systématique (esprit de contradiction, **sophistique**, éristique) cherche à vaincre l'adversaire, non à trouver le vrai.
- Le débat peut se réduire à une confrontation d'opinions et de passions sans conclusion.

**III. La contradiction méthodique au service de la vérité (synthèse)**
La contradiction conduit au savoir lorsqu'elle est **méthodique** et **honnête** : un examen critique des idées (le débat argumenté, la discussion scientifique) qui vise à dépasser l'erreur. C'est l'esprit critique, et non la simple opposition, qui fait progresser la connaissance.

## Conclusion
La contradiction n'est pas le savoir lui-même mais elle peut en être le chemin, à condition d'être soumise à la raison et orientée vers la recherche de la vérité.`,
  },
]

// ── Histoire-géographie : méthodologie ──────────────────────────────────────
const leconMethodoHG = {
  title: 'Méthodologie : le commentaire orienté d\'un document',
  content: `### Définition
Le **commentaire orienté** d'un document est un exercice qui consiste à étudier un document en répondant à des questions destinées à en expliquer les idées maîtresses. C'est un commentaire guidé : les questions orientent la réflexion. Elles sont de trois types : **présentation**, **compréhension** et **évaluation**.
Il ne s'agit pas de donner des réponses très brèves, mais de bâtir un exposé cohérent autour des idées fortes que suggèrent les questions.

### 1. La première question : présenter le document
Il faut indiquer :
- sa **nature** : extrait de texte (livre, discours, article, traité…), tableau statistique, graphique, carte… ;
- son **auteur** : l'identité de la personne qui a rédigé le document ;
- sa **source** et sa **date** : d'où le document est tiré et l'année de publication ;
- son **objet** ou son **contexte** : de quoi parle le document.

### 2. Les questions de compréhension (2ᵉ, 3ᵉ…)
Elles portent sur les idées principales du document, à mettre en relation avec les connaissances acquises en classe. On s'appuie sur le texte (citations courtes entre guillemets) et on explique.

### 3. L'évaluation du document (dernière question)
Elle sert à dégager l'**intérêt** ou la **portée historique** du document, en vue de la conclusion :
- **l'intérêt** : montrer l'importance ou l'utilité du document, ce qu'il permet de comprendre ;
- **la portée historique** : son impact, ses conséquences sur l'évolution de l'histoire.

### Exemple corrigé
**Texte (adapté pour l'application, d'après un manuel d'histoire de seconde) : les citoyens-soldats au service de la cité grecque**
> Athènes n'a pas d'armée permanente : en cas de guerre, chaque citoyen âgé de vingt ans et plus sert comme cavalier, hoplite ou rameur. Si les citoyens ne suffisent pas, on enrôle des métèques, des mercenaires et même des esclaves. Les chefs de l'armée, les stratèges, sont choisis parmi les citoyens les plus riches : ce sont des magistrats élus pour un an et rééligibles ; à part Périclès, la plupart ne sont élus qu'une fois puis redeviennent simples soldats.
> Chaque citoyen participe aussi aux dépenses de guerre selon sa fortune : les plus riches financent la construction et l'armement des trières, ceux qui le sont moins équipent leur cheval de cavalier, les citoyens aisés combattent comme hoplites et les plus pauvres servent dans l'infanterie légère ou comme rameurs. Ces citoyens-soldats défendent la liberté de leur cité, notamment au début du Vᵉ siècle av. J.-C., pendant les guerres médiques, lorsque les Perses tentent d'envahir la Grèce : Athènes les bat à Marathon en 490, puis sur mer à Salamine en 480. Pour se protéger de nouvelles attaques, les Athéniens consacrent une partie des revenus des mines d'argent du Laurion à la construction des Longs Murs, qui protègent la route reliant la ville à son port, le Pirée.

**Questions**
1. Présentez le document.
2. Quelles sont les catégories sociales citées dans ce texte ?
3. Que font les citoyens-soldats lors des guerres médiques ?
4. Que font les Athéniens pour éviter toute nouvelle attaque ?
5. Quelle est la portée historique du document ?

**Réponses**
1. Ce document est un **extrait de texte** historique tiré d'un manuel d'histoire de classe de seconde (texte de Gracia Dorelle-Ferré, *Les Fondements du monde moderne*, éditions Bréal, 1996, ici adapté). Il présente l'organisation militaire d'Athènes au Vᵉ siècle av. J.-C.
2. Les **citoyens** (des plus riches aux plus pauvres), les **métèques** (étrangers domiciliés à Athènes), les **mercenaires** et les **esclaves**. (Cavaliers, hoplites et rameurs sont des fonctions militaires, réparties selon la fortune des citoyens.)
3. Ils se battent pour **défendre la liberté de la cité** contre les Perses et remportent les victoires de **Marathon** (490) et de **Salamine** (480 av. J.-C.).
4. Ils consacrent une partie des revenus des **mines du Laurion** à la construction des **Longs Murs** qui protègent la route entre Athènes et le Pirée.
5. Le document montre un élément de la **civilisation grecque** : dans la démocratie athénienne, le citoyen participe à la défense et au financement de la cité selon ses moyens ; c'est cette mobilisation qui a permis à Athènes de repousser les Perses et de devenir une puissance maritime.`,
}

const dissertAtmosphere = {
  title: 'Dissertation de géographie corrigée : l\'importance de l\'atmosphère',
  statement: `**Sujet : Expliquez l'importance de l'atmosphère.**

Rédigez une dissertation complète : compréhension du sujet (mots-clés, reformulation, problématique, plan), introduction, développement et conclusion.`,
  solution: `## Compréhension du sujet
1. **Mots-clés** : *expliquez* : analysez, relatez, parlez de… ; *importance* : intérêt, utilité ; *atmosphère* : couche d'air qui enveloppe la Terre.
2. **Reformulation** : analysez l'intérêt de la couche d'air qui environne la Terre ; relatez l'utilité de l'atmosphère.
3. **Problématique** : quelle est l'importance de l'atmosphère ?
4. **Plan** : l'atmosphère source de vie ; l'atmosphère siège des variations climatiques ; l'atmosphère régulateur de l'ensoleillement.

## Introduction
L'atmosphère est constituée de plusieurs couches de gaz. Ces couches sont d'une grande importance pour les êtres vivants : les hommes, les animaux et les végétaux. Quelle est donc l'importance de l'atmosphère ? Nous expliquerons d'abord qu'elle est une source de vie, ensuite qu'elle est le siège des variations climatiques et enfin qu'elle régule l'ensoleillement.

## Développement
**D'abord**, l'atmosphère est une **source de vie** grâce aux gaz qui la composent : l'azote, l'oxygène, le gaz carbonique et la vapeur d'eau. Elle fournit l'oxygène et le gaz carbonique nécessaires à la respiration des hommes et des animaux et à la photosynthèse des végétaux. Les gaz à effet de serre retiennent une partie de la chaleur du Soleil à la surface de la Terre, chaleur indispensable à la vie ; et l'**ozone** de la stratosphère protège les êtres vivants des rayons dangereux du Soleil, comme les ultraviolets.

**Ensuite**, l'atmosphère est le **siège des variations climatiques** : elle contient l'air humide qui engendre les pluies, et tous les phénomènes météorologiques (pluies, vents, nuages…) se forment dans la **troposphère**. Elle absorbe aussi une partie du rayonnement solaire et transporte la chaleur des zones les plus chaudes (zone intertropicale) vers les zones les plus froides (zones polaires).

**Enfin**, l'atmosphère joue le rôle de **régulateur de l'ensoleillement** : grâce aux mouvements horizontaux et verticaux de l'air, elle répartit de façon plus équilibrée l'énergie solaire. Elle atténue l'intensité des rayons le jour et empêche la perte de chaleur la nuit, ce qui évite à la Terre de trop fortes chaleurs et de trop forts refroidissements.

## Conclusion
L'atmosphère est une enveloppe gazeuse qui présente trois importances majeures : elle est une source de vie, le siège des variations climatiques et le régulateur de l'ensoleillement. Elle protège les êtres vivants, permet les échanges respiratoires, apporte les précipitations et maintient des températures favorables à la vie. D'où la nécessité de la protéger contre la pollution.`,
}

// ── Anglais ─────────────────────────────────────────────────────────────────
const textSalt = `Salt is added to food to make it tastier. It provides the body with sodium, which is necessary for the muscles to work properly and for regulating the amount of water in the body. Health experts advise most adults to keep their daily sodium intake around 1,500 milligrams and never above 2,300 milligrams: eating more than this maximum is harmful.

High blood pressure, also called hypertension, affects millions of people. It can be caused by other factors, such as stress or a diet rich in saturated fats, but eating too much sodium increases the risk of developing it. For people who already suffer from high blood pressure, eating less salt can also reduce the risk of heart disease and stroke.

Fluid retention, also known as oedema, happens when too much water builds up in the body, including under the skin. It can be caused by hormone changes, hot weather and a high salt intake. It shows as swelling in the hands, ankles and feet, with a feeling of stiffness or pain. Eating less salt and drinking plenty of water can help to alleviate this condition.

Scientists have not yet proved a definite link between salt and heart disease, but most studies agree that too much salt increases the risk. Sodium causes the body to keep water, which raises blood pressure; high blood pressure, in turn, increases the risk of heart attack and stroke. That is why many doctors prefer not to take any chances and advise everyone to reduce the salt in their food.`

const devoirAnglais = {
  title: 'Devoir Chaminade 2021-2022 (Tle C-D) — Eating too much salt',
  statement: `**Lycée Chaminade, département de LVE, section anglais — 2021-2022 — Premier devoir du deuxième trimestre — Terminale C et D — Anglais — 3 heures**

## SECTION ONE: Reading
Read carefully the text below and then answer the related questions.

**TEXT: Eating too much salt**
> *Text adapted for the app from an article by Rebecca Howard (2018): same ideas, different wording.*

${textSalt}

**A. Write true or false after the following statements (2 pts)**
1. Consuming too much salt through food could be harmful.
2. It is necessary to keep a check on how much salt you consume.
3. Consuming too much salt can leave you feeling thirsty most of the time.
4. A healthy diet is essential for both children and adults.

**B. Answer the following questions (4 pts)**
1. Why does everyone need salt?
2. What should be done to reduce the risk of diseases?
3. Is there any relationship between the food we eat and health? Justify.
4. Quote from the text the other factors of the diseases linked to too much salt intake.

## SECTION TWO: Linguistic competence
**A. Vocabulary (2 pts)** — Match the following words with their suitable synonym:
1. Intake — 2. Swelling — 3. Alleviate — 4. Stiffness
a. Hardness — b. Absorption — c. Puffiness — d. Diminish

**B. Grammar (4 pts)**
1. Complete these sentences with *much, many, a few, little*. (2 pts)
 1) How ……… juice is left in the bottle?
 2) I have had ……… headaches already because of the stress.
 3) We have ……… bread; it is not enough for dinner.
 4) Janie and Bob have ……… chairs but they need more.
2. Correct the mistake contained in each of the sentences below. (2 pts)
 1) She recommended me that I take a few days off from my work.
 2) I have not ate anything today.
 3) I hate doing mistakes.
 4) Please, borrow me your car.

## SECTION THREE: Communicative competence (4 pts)
Complete the following conversation with the missing parts.
A: Morning. — B: Morning. — A: ……1…… — B: Jane took the blue shirt to the cleaner. — A: ……2…… — B: After the trip John and Jake felt sick. — A: ……3…… — B: No, they didn't go to work by their own car. — A: ……4…… — B: Yes, they already left for work. — A: Bye.

## SECTION FOUR: Guided writing (4 pts)
Write in order these scrambled sentences.
1) Not / physician / most / diarrhoea / a / people / suffering / from / consult / do.
2) Healthy / ? / food / eat / do / you / brain / your / keep / to / any.
3) Near / a / parking / place / the / shops / rarely / they / find.
4) Parents / my / I / sometimes / fly / winter / to / in / Florida / to.`,
  solution: `## Section one
**A.** 1. **True** — eating more than the maximum is harmful.
2. **True** — the text gives a daily limit (1,500 to 2,300 mg of sodium) that should not be exceeded.
3. **True** — salt makes the body keep water (fluid retention); the body needs more water, and the text advises drinking plenty of water.
4. **True** — the whole text shows that what we eat affects the health of everyone.

**B.** 1. Everyone needs salt because it provides **sodium**, which is necessary for the **muscles to work properly** and for **regulating the amount of water** in the body.
2. We should **reduce our salt (sodium) intake** and **drink plenty of water**; we should also avoid stress and diets rich in saturated fats.
3. **Yes.** Too much salt can cause high blood pressure (hypertension), fluid retention (oedema), heart disease and stroke: the food we eat has a direct effect on our health.
4. "**stress or a diet rich in saturated fats**" (for hypertension) and "**hormone changes, hot weather**" (for fluid retention).

## Section two
**A.** 1 → **b** (intake = absorption) ; 2 → **c** (swelling = puffiness) ; 3 → **d** (alleviate = diminish) ; 4 → **a** (stiffness = hardness).

**B. 1.** 1) How **much** juice is left in the bottle? (uncountable) 2) I have had **many** headaches already… 3) We have **little** bread; it is not enough… (uncountable, negative idea) 4) …have **a few** chairs but they need more. (countable, small number)
**2.** 1) She recommended **that I take** a few days off from my work. (*recommend somebody that* is incorrect) 2) I have not **eaten** anything today. 3) I hate **making** mistakes. 4) Please, **lend** me your car.

## Section three (possible answers)
1. What did Jane take to the cleaner? / Who took the blue shirt to the cleaner?
2. When did John and Jake feel sick? / What happened after the trip?
3. Did they go to work by their own car?
4. Have they already left for work?

## Section four
1) Most people suffering from diarrhoea do not consult a physician.
2) Do you eat any food to keep your brain healthy?
3) They rarely find a parking place near the shops.
4) In winter, I sometimes fly to Florida to my parents.`,
}

export const blocs = [
  {
    subjectId: FR_D, chapterTitle: 'Le Pleurer-Rire d\'Henri Lopes',
    description: 'Œuvre au programme : utilité et inutilité du roman, dissertation corrigée sur le titre.',
    lessons: [leconPleurerRire], exercises: [dissertPleurerRire], copyTo: [FR_C],
  },
  {
    subjectId: FR_D, chapterTitle: 'Méthodologie et sujets de type bac (Français C-D)',
    description: 'Les fonctions de la littérature ; dissertations et études de texte argumentatif corrigées (devoirs dirigés et bac blanc zonal 2022).',
    lessons: [leconFonctions], exercises: [dissertJeunesse, etudeArgo, etudeCurtis], copyTo: [FR_C],
  },
  {
    subjectId: PHILO_D, chapterTitle: 'Sujets de dissertation corrigés',
    description: 'Devoir surveillé du Lycée Chaminade (2021-2022) : trois sujets de dissertation avec plans détaillés.',
    exercises: philo, copyTo: [PHILO_C],
  },
  {
    subjectId: HG_D, chapterTitle: 'Méthodologie : commentaire de document et dissertation',
    description: 'Le commentaire orienté d\'un document (avec exemple corrigé) et une dissertation de géographie corrigée.',
    lessons: [leconMethodoHG], exercises: [dissertAtmosphere], copyTo: [HG_C],
  },
  { chapterId: ANG_D_REF, exercises: [devoirAnglais] },
  { chapterId: ANG_C_REF, exercises: [devoirAnglais] },
]
