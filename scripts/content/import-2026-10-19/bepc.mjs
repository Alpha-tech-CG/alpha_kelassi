// 3ᵉ / BEPC — lectures du manuel « La 3ᵉ en français » (photos du 19/10/2026) et livret de verbes
// irréguliers (The Young Teachers' School).
// Les extraits de romans encore protégés ne sont PAS recopiés : chaque leçon est une fiche de lecture
// originale (auteur, résumé, thèmes, procédés, questions corrigées) à utiliser avec le manuel.

const ANGLAIS_VERBES = '52fb5185-d684-4ba3-a06f-7b8c382541c9' // BEPC · Anglais · Les verbes irréguliers
const FR_LECTURE = 'a922c4c9-5d2a-4ec4-90f0-c2529e769083'      // BEPC · Français · Lecture et compréhension

const verbesGroupes = {
  title: 'Verbes irréguliers : les apprendre par groupes (et ceux à ne pas confondre)',
  content: `Pour mémoriser plus vite les verbes irréguliers, on les regroupe selon leur **façon de se former** : dans un même groupe, le prétérit et le participe passé se construisent de la même manière.

### 1. Voyelle longue → voyelle courte (« ee » → « e »)
| Infinitif | Prétérit | Participe passé | Sens |
|---|---|---|---|
| to bleed | bled | bled | saigner |
| to feed | fed | fed | nourrir |
| to meet | met | met | rencontrer |
| to speed | sped | sped | se hâter |

### 2. Terminaison en « -t »
| Infinitif | Prétérit | Participe passé | Sens |
|---|---|---|---|
| to creep | crept | crept | ramper |
| to deal | dealt | dealt | négocier |
| to dream | dreamt | dreamt | rêver |
| to feel | felt | felt | sentir |
| to keep | kept | kept | garder |
| to kneel | knelt | knelt | s'agenouiller |
| to mean | meant | meant | vouloir dire |
| to sleep | slept | slept | dormir |
| to sweep | swept | swept | balayer |
| to weep | wept | wept | pleurer |

### 3. « -d » final → « -t »
| Infinitif | Prétérit | Participe passé | Sens |
|---|---|---|---|
| to bend | bent | bent | plier |
| to lend | lent | lent | prêter |
| to rend | rent | rent | déchirer |
| to send | sent | sent | envoyer |
| to spend | spent | spent | dépenser |

### 4. « -ell » → « -old »
| Infinitif | Prétérit | Participe passé | Sens |
|---|---|---|---|
| to sell | sold | sold | vendre |
| to tell | told | told | dire, raconter |

### 5. Terminaison en « -ought / -aught »
| Infinitif | Prétérit | Participe passé | Sens |
|---|---|---|---|
| to bring | brought | brought | apporter |
| to buy | bought | bought | acheter |
| to fight | fought | fought | se battre |
| to seek | sought | sought | chercher |
| to think | thought | thought | penser |
| to catch | caught | caught | attraper |
| to teach | taught | taught | enseigner |

### 6. Les trois formes identiques
to bet (parier), to burst (éclater), to cast (jeter), to cost (coûter), to cut (couper), to hit (frapper), to hurt (blesser), to let (laisser), to put (mettre), to rid (débarrasser), to set (placer), to shed (verser), to shut (fermer), to split (fendre), to spread (étendre), to thrust (pousser brusquement).
*Exemple : to cut – cut – cut.*

### 7. « -ake » → « -ook » → « -aken »
to shake – shook – shaken (secouer) ; to take – took – taken (prendre).

### 8. Prétérit en « -o- », participe en « -en » ou « -n »
| Infinitif | Prétérit | Participe passé | Sens |
|---|---|---|---|
| to break | broke | broken | casser |
| to freeze | froze | frozen | geler |
| to steal | stole | stolen | voler (dérober) |
| to speak | spoke | spoken | parler |
| to weave | wove | woven | tisser |
| to bear | bore | borne | porter |
| to swear | swore | sworn | jurer |
| to tear | tore | torn | déchirer |
| to wear | wore | worn | porter (un vêtement) |

### 9. « i » → « o » → « i + en »
to drive – drove – driven (conduire) ; to ride – rode – ridden (aller à cheval, à moto) ; to rise – rose – risen (se lever) ; to write – wrote – written (écrire).

### 10. Prétérit en « -ew », participe en « -own »
to blow – blew – blown (souffler) ; to grow – grew – grown (pousser, grandir) ; to know – knew – known (savoir, connaître) ; to throw – threw – thrown (lancer).

### 11. « got »
to get – got – got (obtenir) ; to forget – forgot – forgotten (oublier).

### 12. « i » → « a »
to sit – sat – sat (s'asseoir) ; to spit – spat – spat (cracher).

### 13. « i » → « u »
to dig – dug – dug (creuser) ; to spin – spun – spun (filer) ; to stick – stuck – stuck (coller).

### 14. « -ing » → « -ung »
to cling – clung – clung (s'accrocher) ; to fling – flung – flung (jeter) ; to sling – slung – slung (lancer) ; to sting – stung – stung (piquer) ; to swing – swung – swung (se balancer) ; to wring – wrung – wrung (tordre).

### 15. « i » → « a » → « u »
| Infinitif | Prétérit | Participe passé | Sens |
|---|---|---|---|
| to begin | began | begun | commencer |
| to drink | drank | drunk | boire |
| to ring | rang | rung | sonner |
| to sing | sang | sung | chanter |
| to sink | sank | sunk | sombrer, couler |
| to shrink | shrank | shrunk | rétrécir |
| to spring | sprang | sprung | jaillir |
| to swim | swam | swum | nager |

## Ne pas confondre
| Infinitif | Prétérit | Participe passé | Sens |
|---|---|---|---|
| to fall | fell | fallen | tomber |
| to fell | felled | felled | abattre (un arbre) |
| to feel | felt | felt | sentir |
| to flee | fled | fled | fuir |
| to fly | flew | flown | voler (dans les airs) |
| to flow | flowed | flowed | couler (liquide) |
| to lie | lay | lain | être couché |
| to lie | lied | lied | mentir |
| to lay | laid | laid | poser |
| to rend | rent | rent | déchirer |
| to rent | rented | rented | louer |
| to see | saw | seen | voir |
| to saw | sawed | sawn | scier |
| to sow | sowed | sown | semer |
| to sew | sewed | sewn | coudre |
| to sink | sank | sunk | sombrer |
| to think | thought | thought | penser |
| to thank | thanked | thanked | remercier (verbe régulier) |

**Astuce** : récite chaque groupe à voix haute (« to bring, brought, brought ; to buy, bought, bought… ») : le rythme commun aide la mémoire.`,
}

const ficheLecture = (o) => ({
  title: `Lecture : ${o.titre} — ${o.auteur}`,
  content: `*Fiche de lecture à utiliser avec le manuel* La 3ᵉ en français *(${o.dossier}). Lis d'abord le texte dans ton manuel, puis travaille cette fiche.*

### L'auteur et l'œuvre
${o.auteurOeuvre}

### Ce que raconte l'extrait
${o.resume}

### Les thèmes
${o.themes.map((t) => `- ${t}`).join('\n')}

### Comment le texte est écrit
${o.procedes.map((t) => `- ${t}`).join('\n')}

### Questions de compréhension (avec éléments de réponse)
${o.questions.map(([q, r], i) => `**${i + 1}. ${q}**\n${r}`).join('\n\n')}

### Vocabulaire
${o.vocabulaire.map(([m, d]) => `- **${m}** : ${d}`).join('\n')}

### Pour aller plus loin (expression écrite)
${o.expression}`,
})

const lectures = [
  ficheLecture({
    titre: 'Une voix pour l\'Afrique', auteur: 'Myriam Makeba', dossier: 'dossier 4 « Au fil des arts », texte 2',
    auteurOeuvre: `Myriam (Miriam) Makeba (1932-2008), chanteuse sud-africaine surnommée « Mama Africa », a été contrainte à l'exil pendant plus de trente ans pour avoir dénoncé l'**apartheid**, régime de ségrégation raciale imposé aux Noirs d'Afrique du Sud. L'extrait vient de son autobiographie *Makeba : ma vie*, écrite avec James Hall (1988). (C'est aussi le texte de la dictée du BEPC 2021.)`,
    resume: `L'extrait comprend trois moments. **1. Les débuts** : remarquée par le chef d'un orchestre célèbre, les *Manhattan Brothers*, la jeune Myriam réussit une audition, prend le nom de scène « Myriam Makeba » et chante avec quatre hommes, dans des spectacles fatigants et mal payés, mais elle découvre l'aventure de la scène. **2. Le pouvoir magique de la musique** : en tournée en Europe, elle affronte un public de rock d'abord hostile, qui finit par l'acclamer. **3. La musique et la vie** : en exil, frappée par des deuils, elle trouve dans le chant une consolation et une arme : sa voix porte la souffrance de son peuple et sa lutte contre le racisme.`,
    themes: ['la vocation artistique et le travail de l\'artiste', 'la musique comme consolation et comme combat', 'l\'apartheid, le racisme et l\'exil', 'l\'amour du public et du pays natal'],
    procedes: ['récit **autobiographique** à la 1ʳᵉ personne, au passé puis au présent', 'alternance de dialogues et de récit', 'vocabulaire des émotions (surprise, fatigue, colère, joie)', 'progression en trois parties titrées, du passé au présent'],
    questions: [
      ['Comment la narratrice réagit-elle aux premiers compliments ?', 'Elle est surprise et gênée ; elle n\'ose pas croire qu\'on la prenne au sérieux.'],
      ['Pourquoi les spectacles sont-ils difficiles au début ?', 'Ils sont nombreux, longs (jusqu\'au matin), fatigants et mal payés.'],
      ['Comment Myriam vient-elle à bout d\'un public hostile ?', 'Par la persévérance et la force de sa musique : elle continue à chanter et finit par conquérir le public.'],
      ['Quel double rôle la musique joue-t-elle dans sa vie d\'exilée ?', 'Une consolation face à la douleur, et un moyen de lutter : elle parle des maux de son pays et dénonce l\'apartheid.'],
      ['Quel portrait de Myriam Makeba se dégage du texte ?', 'Une artiste passionnée, courageuse, tenace, généreuse, attachée à son peuple et engagée.'],
    ],
    vocabulaire: [['imprésario', 'personne qui organise les spectacles et la carrière d\'un artiste'], ['apartheid', 'régime de séparation des races en Afrique du Sud (1948-1991)'], ['exil', 'fait de vivre hors de son pays, souvent par obligation']],
    expression: 'Fais le portrait d\'un(e) artiste congolais(e) que tu admires et montre ce que sa musique apporte à son public.',
  }),
  ficheLecture({
    titre: '« Je ne peux pas t\'épouser… »', auteur: 'Chinua Achebe', dossier: 'dossier 1 « Ce monde qui change », texte 3',
    auteurOeuvre: `Chinua Achebe (1930-2013), romancier nigérian de langue anglaise, est l'auteur du *Monde s'effondre* (1958). Dans *Le Malaise* (1960), il raconte le retour au pays d'Obi Okonkwo, jeune intellectuel formé en Angleterre grâce à l'argent de son village, Umuofia.`,
    resume: `Au bord d'une piscine, Clara annonce en larmes à Obi qu'elle ne peut pas l'épouser : elle est une **osu**, c'est-à-dire descendante d'une caste d'esclaves consacrés à une divinité, avec qui la tradition interdit de se marier. Obi, élevé à l'école de la Mission et en Europe, refuse ce préjugé et décide de l'épouser. Son ami Joseph tente de l'en dissuader : un tel mariage déshonorerait sa famille et son village, et compromettrait l'avenir de ses enfants. Obi s'obstine, mais il sait que sa famille s'opposera violemment à son projet.`,
    themes: ['le conflit entre tradition et modernité', 'l\'amour face aux interdits sociaux (les castes)', 'l\'individu face à la communauté', 'l\'intellectuel africain partagé entre deux cultures'],
    procedes: ['dialogues vifs qui opposent les points de vue', 'narration à la 3ᵉ personne qui donne accès aux pensées d\'Obi', 'contraste entre le calme d\'Obi et l\'émotion de Clara', 'arguments de Joseph tirés de la tradition et du « qu\'en-dira-t-on »'],
    questions: [
      ['Pourquoi Clara ne peut-elle pas épouser Obi ?', 'Parce qu\'elle est une osu : la tradition interdit aux autres membres de la communauté de s\'unir à ces descendants d\'esclaves consacrés.'],
      ['Quelle est la position d\'Obi face à cet interdit ?', 'Il le juge injuste et dépassé ; il décide d\'épouser Clara malgré tout.'],
      ['Quels arguments Joseph oppose-t-il à Obi ?', 'Le mariage concerne toute la famille et le village ; la honte retomberait sur ses parents et ses enfants ; la société n\'est pas prête à ce changement.'],
      ['D\'où vient la différence de jugement entre Obi et Joseph ?', 'De leur éducation : Obi a été formé à l\'école de la Mission et en Europe ; Joseph reste attaché aux coutumes.'],
      ['Qui a raison selon toi ? Justifie.', 'Réponse personnelle argumentée : la dignité et l\'égalité des personnes, d\'un côté ; le respect de la famille et la prudence, de l\'autre.'],
    ],
    vocabulaire: [['osu', 'chez les Igbo, personne d\'une caste consacrée aux dieux, mise à l\'écart'], ['antagoniste', 'adversaire, personne qui s\'oppose'], ['pionnier', 'personne qui ouvre une voie nouvelle']],
    expression: 'Imagine la lettre qu\'Obi écrit à ses parents pour leur annoncer son projet de mariage et les convaincre de l\'accepter.',
  }),
  ficheLecture({
    titre: 'Le Mandat (fin du récit)', auteur: 'Sembène Ousmane', dossier: 'dossier 1 « Ce monde qui change », texte 5',
    auteurOeuvre: `Sembène Ousmane (1923-2007), écrivain et cinéaste sénégalais, est l'un des pères du cinéma africain. *Le Mandat* (1966), dont il a tiré un film primé à Venise en 1968, raconte les malheurs d'Ibrahima Dieng, chômeur de Dakar qui reçoit un mandat de 25 000 F envoyé de Paris par son neveu.`,
    resume: `Faute de pièce d'identité, Dieng n'a jamais pu toucher le mandat. Dans ce dénouement, il a tout perdu : il s'est endetté auprès de tous, il a été volé par Mbaye, un parent « moderne » qui s'est approprié l'argent, et ses femmes ont mis leurs bijoux en gage. Écœuré par la fourberie et le mensonge, il déclare au facteur Bah qu'il va désormais « se vêtir de la peau de l'hyène ». Bah lui répond que tout peut changer, que les honnêtes gens finiront par l'emporter. Une femme, un bébé sur le dos, vient alors mendier auprès de lui : la scène se termine dans le silence.`,
    themes: ['la misère et le chômage dans la ville moderne', 'la bureaucratie et la corruption', 'l\'honnêteté face à la ruse', 'la solidarité et l\'espoir d\'un changement'],
    procedes: ['dialogue presque théâtral, phrases courtes', 'ironie tragique : Dieng, victime, est encore sollicité', 'symbole de l\'hyène (la ruse, la malhonnêteté)', 'fin ouverte : silence et regard échangé'],
    questions: [
      ['Pourquoi Dieng veut-il « se vêtir de la peau de l\'hyène » ?', 'Il a été trompé et volé parce qu\'il était honnête ; il décide d\'être rusé et malhonnête à son tour.'],
      ['Quel rôle joue le facteur Bah ?', 'C\'est la voix de l\'espoir : il rappelle que les choses peuvent changer et que les gens honnêtes peuvent s\'unir.'],
      ['Que montre l\'arrivée de la mendiante ?', 'La misère est générale ; malgré ses résolutions, Dieng reste confronté à la générosité qu\'on attend de lui.'],
      ['La conclusion est-elle optimiste ou pessimiste ?', 'Elle est ambiguë : le constat est sombre, mais le dialogue avec Bah et le silence final laissent une place à l\'espoir et à la réflexion.'],
    ],
    vocabulaire: [['mandat', 'titre permettant de toucher à la poste une somme envoyée par quelqu\'un'], ['mettre en gage', 'laisser un objet en garantie contre un prêt d\'argent'], ['quémander', 'demander humblement et avec insistance']],
    expression: 'Dieng écrit à son neveu pour lui expliquer pourquoi il n\'a pas pu toucher le mandat. Rédige cette lettre.',
  }),
  ficheLecture({
    titre: 'Malentendus', auteur: 'Bernard Dadié', dossier: 'dossier 2 « Histoires d\'en rire », texte 3',
    auteurOeuvre: `Bernard Binlin Dadié (1916-2019), écrivain ivoirien, a raconté dans *Climbié* (1956) une enfance et une jeunesse marquées par l'école coloniale. Climbié se présente au concours d'entrée de l'École normale William-Ponty, établissement prestigieux de l'Afrique occidentale française.`,
    resume: `Le jour de l'épreuve d'orthographe, un inspecteur dicte le texte avec un accent régional si fort que les candidats ne comprennent presque rien. Les plumes hésitent, la gomme travaille plus que les plumes, les élèves échangent des regards affolés. Certains voient s'évanouir leurs rêves d'entrer à William-Ponty. À la récréation, les candidats décident de faire annuler le concours et refusent les épreuves suivantes ; malgré les exhortations des examinateurs, personne ne se présente à l'épreuve de mathématiques.`,
    themes: ['l\'école coloniale et ses concours', 'l\'injustice et l\'incompréhension', 'la solidarité des élèves', 'l\'humour au service de la critique'],
    procedes: ['comique de situation : un inspecteur incompréhensible pendant une dictée', 'accumulation de verbes et gradation (« couraient, hésitaient, s\'arrêtaient »)', 'personnification (la gomme « travaillait plus que les plumes »)', 'renversement final : les élèves prennent le pouvoir'],
    questions: [
      ['Quel est le « malentendu » du titre ?', 'Les élèves ne comprennent pas la dictée à cause de la prononciation régionale de l\'inspecteur, qui croit au contraire bien articuler.'],
      ['Comment l\'auteur rend-il l\'angoisse des candidats ?', 'Par leurs gestes (battements de paupières, ongles mordus, regards levés au plafond) et par l\'accumulation de verbes.'],
      ['Qu\'est-ce qui rend la scène comique ?', 'Le décalage entre l\'assurance de l\'inspecteur et l\'incompréhension générale, et l\'exagération des réactions.'],
      ['Comment réagissent les élèves à la fin ?', 'Ils s\'unissent et refusent de composer pour obtenir l\'annulation du concours.'],
    ],
    vocabulaire: [['concours', 'examen où l\'on classe les candidats pour un nombre limité de places'], ['s\'égosiller', 'crier fort et longtemps'], ['s\'effilocher', 'se défaire peu à peu (ici : les rêves s\'évanouissent)']],
    expression: 'Raconte un examen ou un devoir où un malentendu a créé une situation comique.',
  }),
  ficheLecture({
    titre: 'La danse du coba', auteur: 'Camara Laye', dossier: 'dossier 4 « Au fil des arts », texte 3',
    auteurOeuvre: `Camara Laye (1928-1980), écrivain guinéen, raconte dans *L'Enfant noir* (1953) son enfance à Kouroussa, en pays malinké. L'extrait décrit la danse du **coba**, réservée aux garçons à la veille de leur circoncision.`,
    resume: `Sur la grande place, les futurs circoncis avancent en file indienne derrière le père de Kouyaté, vieillard vénérable qui entonne le chant du coba. Au son des tam-tams, ils dansent toute la journée et toute la nuit, sous le regard des hommes et à l'écart des femmes. Malgré la fatigue, l'anxiété et l'épuisement, soutenus par la musique, ils achèvent leur dernier tour de place à l'aube.`,
    themes: ['l\'initiation et le passage à l\'âge d\'homme', 'la musique et la danse dans les rites africains', 'le respect des anciens', 'l\'endurance et la fierté'],
    procedes: ['récit à la 1ʳᵉ personne d\'un adulte qui se souvient', 'refrain répété (« Coba ! Aye coba… ») qui donne le rythme', 'description du mouvement et des sons', 'progression dans le temps jusqu\'à l\'aube'],
    questions: [
      ['Pourquoi le père de Kouyaté conduit-il la danse ?', 'C\'est le plus âgé et le plus respecté : on lui reconnaît ce privilège d\'ancienneté et de renommée.'],
      ['Quel est le rôle des tam-tams ?', 'Ils donnent le rythme et soutiennent les danseurs épuisés.'],
      ['Pourquoi les femmes sont-elles écartées ?', 'Le coba est « affaire d\'homme » : c\'est un rite masculin d\'initiation.'],
      ['Quels sentiments éprouvent les adolescents ?', 'Fierté et solennité, mais aussi fatigue et anxiété avant l\'épreuve de la circoncision.'],
    ],
    vocabulaire: [['circoncision', 'ablation rituelle du prépuce, marquant le passage à l\'âge d\'homme dans de nombreuses sociétés'], ['solennité', 'caractère grave et cérémonieux'], ['boubou', 'longue tunique ample portée en Afrique de l\'Ouest']],
    expression: 'Décris une danse traditionnelle de ta région et la cérémonie où elle est pratiquée.',
  }),
  ficheLecture({
    titre: 'L\'homme fort', auteur: 'Jules Renard', dossier: 'dossier 2 « Histoires d\'en rire », texte 4',
    auteurOeuvre: `Jules Renard (1864-1910), écrivain français (*Poil de Carotte*, *Histoires naturelles*), pratique un humour fondé sur l'observation et la brièveté. Ce récit vient du recueil *Le Vigneron dans sa vigne* (1894) ; chaque histoire y forme un texte indépendant.`,
    resume: `Un homme, à qui personne ne reconnaît sa force, veut la prouver devant ses voisins réunis à la veillée. Il choisit une grosse bûche noueuse et annonce qu'il va la casser sur sa cuisse « comme une allumette ». Tout le monde se tait et l'admire déjà. Il soulève la bûche, la frappe contre sa jambe… et c'est sa jambe qui se casse.`,
    themes: ['la vantardise et l\'orgueil', 'le regard des autres', 'l\'effet de chute comique'],
    procedes: ['récit très bref, phrases courtes', 'tension croissante (silence, admiration du public)', '**chute** inattendue et ironique : l\'inverse de ce qu\'il annonçait', 'humour noir : on rit d\'un accident'],
    questions: [
      ['Que veut prouver l\'homme ?', 'Qu\'il est fort, alors que personne ne le croit.'],
      ['Comment l\'auteur crée-t-il l\'attente ?', 'Par la mise en scène : le choix de la bûche la plus dure, l\'annonce solennelle, le silence et l\'admiration de l\'assistance.'],
      ['En quoi la fin est-elle comique ?', 'C\'est un renversement : au lieu de la bûche, c\'est sa jambe qui casse ; le vantard est puni par sa propre vantardise.'],
      ['Quelle leçon peut-on en tirer ?', 'L\'orgueil et le désir de briller aux yeux des autres peuvent conduire à des catastrophes.'],
    ],
    vocabulaire: [['nœud (du bois)', 'partie très dure du bois, à l\'endroit où partait une branche'], ['ployer', 'plier, courber'], ['chute (d\'un récit)', 'fin inattendue qui surprend le lecteur']],
    expression: 'Écris une courte histoire drôle qui se termine par une chute inattendue.',
  }),
]

export const blocs = [
  { chapterId: ANGLAIS_VERBES, lessons: [verbesGroupes] },
  { chapterId: FR_LECTURE, lessons: lectures },
]
