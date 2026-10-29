// Annales BEPC Français (République du Congo) : dictée + questions, au format d'origine.
// Source : examens_bepc_cepe.md (19/10/2026). BEPC 2018 = même sujet que 2012 (regroupés).

const parties = (p) => [
  `**I. Compréhension**\n${p.I}`,
  `**II. Maniement de la langue**\n${p.II}`,
  `**III. Grammaire**\n${p.III}`,
  `**IV. Conjugaison**\n${p.IV}`,
].join('\n\n')

export const bepc = [
  {
    year: 2010, titre: 'Retour aux valeurs universelles',
    texte: "À l'aube de la nouvelle décennie, nous avons besoin, dans chaque pays, de retourner aux valeurs simples qui ont grandi d'autres nations : le travail, le sacrifice, la gestion rigoureuse des biens publics. Autant de valeurs qui, si elles sont respectées par tous, pourraient nous aider à rattraper le retard accumulé… Cependant les nations africaines ne pourront retrouver ces valeurs et, en fin de compte, le progrès, qu'à deux conditions : enrayer l'ignorance en généralisant la gratuité de l'enseignement afin de ne pas exclure les populations défavorisées ; garantir l'exercice de la démocratie, facteur de développement.",
    source: 'Faustin Hitiyise, « Jeune Afrique », 5 février 1990.',
    questions: {
      I: "1. Relève deux valeurs universelles.\n2. Vrai ou faux : a) La gestion rigoureuse des biens publics entraîne le progrès ; b) Le travail et le sacrifice défavorisent le développement ; c) La gratuité de l'enseignement engendre l'ignorance ; d) La démocratie garantit le progrès.",
      II: "1. Relève un synonyme de « progrès ».\n2. Trouve un homonyme du mot « compte » et emploie-le dans une phrase.",
      III: "1. Indique le sujet du verbe « pourraient ».\n2. Relève une expression de but.\n3. Mets à la forme affirmative : « Les nations africaines ne pourront retrouver ces valeurs ».",
      IV: "1. Donne l'infinitif et le participe passé du verbe conjugué dans « Les nations africaines ne pourront retrouver ces valeurs ».\n2. Réécris la phrase au présent de l'indicatif.",
    },
    corrige: {
      I: "1. **le travail** et **le sacrifice** (aussi : la gestion rigoureuse des biens publics).\n2. a) **Vrai** ; b) **Faux** ; c) **Faux** (elle enraye l'ignorance) ; d) **Vrai** (la démocratie est « facteur de développement »).",
      II: "1. **développement**.\n2. Homonymes : **conte**, **comte**. Ex. : *Grand-mère nous raconte un **conte** chaque soir.*",
      III: "1. Le sujet de « pourraient » est le pronom relatif **qui** (il reprend « valeurs »).\n> Le corrigé local donne « elles », mais « elles » est le sujet de « sont respectées ».\n2. « **afin de ne pas exclure les populations défavorisées** ».\n3. *Les nations africaines **pourront** retrouver ces valeurs.*",
      IV: "1. Infinitif : **pouvoir** ; participe passé : **pu**.\n2. *Les nations africaines ne **peuvent** (pas) retrouver ces valeurs.*",
    },
  },
  {
    year: 2011, titre: 'Une civilisation universelle',
    texte: "Chaque année, les frontières s'abaissent, les cordons douaniers se relâchent un peu plus. Les relations internationales s'intensifient par le bateau, la route, le chemin de fer, l'avion, demain par la fusée… Chaque année, c'est un échange plus intense de personnes, de faits scientifiques et techniques, de livres et de machines, de coutumes et de costumes, d'idées. Ces échanges provoquent des emprunts. Ainsi se crée, peu à peu, une civilisation universelle.",
    source: 'Léopold Sédar Senghor, La 3ᵉ en français, p. 265.',
    questions: {
      I: "1. Choisis le titre qui convient : Les cordons douaniers / Un long voyage / Une civilisation universelle.\n2. Choisis deux bonnes réponses : « Chaque année les relations internationales sont : a) interdites ; b) développées ; c) rares ; d) bénéfiques. »",
      II: "1. Donne un synonyme de « chemin ».\n2. Trouve un mot de la même famille que « avion » et emploie-le dans une phrase.",
      III: "1. Trouve dans le texte un adverbe.\n2. Relève une proposition indépendante juxtaposée.\n3. Donne la nature et la fonction du mot souligné : « emprunts ».",
      IV: "1. Indique le mode utilisé dans ce texte.\n2. Réécris « Ces échanges provoquent des emprunts » au futur simple et au passé antérieur de l'indicatif.",
    },
    corrige: {
      I: "1. **Une civilisation universelle**.\n2. **b) développées** et **d) bénéfiques**.",
      II: "1. **route** (aussi : voie, piste, sentier).\n2. **aviateur** (aussi : aviation). Ex. : *L'**aviateur** pilote un gros porteur.*",
      III: "1. Par exemple **peu**, **plus**, **demain** ou **ainsi**.\n2. « *les cordons douaniers se relâchent un peu plus* » (juxtaposée à « *Chaque année, les frontières s'abaissent* »).\n3. **emprunts** : nom commun, masculin pluriel, **complément d'objet direct** du verbe *provoquer*.",
      IV: "1. Le mode **indicatif** (présent de l'indicatif).\n2. Futur simple : *Ces échanges **provoqueront** des emprunts.* — Passé antérieur : *Ces échanges **eurent provoqué** des emprunts.*",
    },
  },
  {
    year: 2012, titre: 'Retour au travail de la terre', note: 'Ce sujet est retombé au BEPC 2018.',
    texte: "J'ai choisi de revenir au village pour voir clair en moi-même. Au village, je vais cultiver la terre. Les plantations de palmier à huile ont besoin de bras pour être rénovées ; il faut partout encourager les paysans à exploiter nos ressources naturelles et leur faire comprendre qu'ils doivent avant tout compter sur eux-mêmes. Ma place est à leurs côtés, car je pense que l'instruction ne devrait dispenser aucun de nous de ce retour salutaire vers la terre nourricière.",
    source: "D'après Etounga Mangelle, « La colline du fromager », La 3ᵉ en français, p. 307.",
    questions: {
      I: "1. Relève une expression qui justifie le titre.\n2. Vrai ou faux : a) Mon choix est de retourner à la campagne ; b) Je ferai l'élevage et la pêche ; c) Nous devons décourager les paysans ; d) Le « retour au village » est une affaire de tout le monde.",
      II: "1. Donne le sens de l'expression « ressources naturelles ».\n2. Trouve un mot de la même famille que « terre » et emploie-le dans une phrase.",
      III: "1. Donne la nature et la fonction du mot souligné : « nourricière ».\n2. Relève une proposition subordonnée complétive.\n3. Réécris « J'ai choisi de revenir au village » à la forme interro-négative.",
      IV: "« Je vais cultiver la terre ».\n1. Donne l'infinitif présent du verbe conjugué.\n2. Réécris cette phrase au futur simple et au passé composé de l'indicatif.",
    },
    corrige: {
      I: "1. « *Au village, je vais cultiver la terre* » (ou : « *ce retour salutaire vers la terre nourricière* »).\n2. a) **Vrai** ; b) **Faux** (il va cultiver la terre) ; c) **Faux** (il faut les encourager) ; d) **Vrai** (« *aucun de nous* » n'en est dispensé).",
      II: "1. Les **richesses fournies par la nature** (sol, sous-sol, forêts, eaux) que l'homme peut exploiter.\n2. **territoire** (aussi : terrain, terroir, enterrer). Ex. : *Ce **terrain** est fertile.*",
      III: "1. **nourricière** : adjectif qualificatif, féminin singulier, **épithète** du nom *terre*.\n2. « *qu'ils doivent avant tout compter sur eux-mêmes* » (ou : « *que l'instruction ne devrait dispenser aucun de nous de ce retour…* »).\n3. ***N'ai-je pas** choisi de revenir au village ?*",
      IV: "1. Le verbe conjugué est **aller** (*vais*) ; il est suivi de l'infinitif *cultiver* (futur proche).\n2. Futur simple : *Je **cultiverai** la terre* (on accepte : *J'irai cultiver la terre*). — Passé composé : *J'**ai cultivé** la terre.*",
    },
  },
  {
    year: 2013, titre: 'La fraternité',
    texte: "Je ne me souviendrai jamais de ton visage. Tu es l'homme et tu m'apparais avec le visage de tous les hommes à la fois. Tu ne nous as jamais dévisagés et déjà tu nous as reconnus. Tu es le frère bien-aimé. Et, à mon tour, je te reconnaîtrai dans tous les hommes. Tu m'apparais baigné de noblesse et de bienveillance, grand seigneur, tu as le pouvoir de donner à boire. Tous mes amis, tous mes ennemis en toi marchent vers moi, et je n'ai plus un seul ennemi au monde.",
    source: 'Antoine de Saint-Exupéry, La 3ᵉ en français, p. 254.',
    questions: {
      I: "1. Relève une expression qui justifie le titre.\n2. Vrai ou faux : a) L'auteur considère les visages ; b) L'auteur enseigne le tribalisme ; c) L'auteur considère tous les hommes comme ses frères ; d) L'auteur prône l'amitié entre les hommes.",
      II: "1. Donne le sens du mot « ennemi ».\n2. Relève deux mots antonymes dans la dictée.",
      III: "1. Donne la nature et la fonction des mots soulignés : « te » (reconnaîtrai) ; « monde ».\n2. Réécris « Je ne me souviendrai jamais de ton visage » à la forme interrogative.",
      IV: "« Je te reconnaîtrai dans tous les hommes ». Remplace la 1ʳᵉ personne du singulier par la 1ʳᵉ personne du pluriel et réécris la phrase obtenue à l'imparfait et au passé composé de l'indicatif.",
    },
    corrige: {
      I: "1. « *Tu es le frère bien-aimé* » (ou : « *je te reconnaîtrai dans tous les hommes* »).\n2. a) **Vrai** (le mot *visage* revient souvent : l'auteur voit en un visage celui de tous les hommes) ; b) **Faux** ; c) **Vrai** ; d) **Vrai**.",
      II: "1. **ennemi** : adversaire, personne qui nous veut du mal.\n2. **amis** / **ennemis**.",
      III: "1. **te** : pronom personnel, 2ᵉ personne du singulier, **complément d'objet direct** du verbe *reconnaître*. — **monde** : nom commun, masculin singulier, **complément circonstanciel de lieu** du verbe *avoir* (*n'ai*).\n2. ***Ne me souviendrai-je jamais** de ton visage ?*",
      IV: "*Nous te reconnaîtrons dans tous les hommes.*\n- Imparfait : *Nous te **reconnaissions** dans tous les hommes.*\n- Passé composé : *Nous t'**avons reconnu** dans tous les hommes.*",
    },
  },
  {
    year: 2014, titre: 'La radio en Afrique',
    texte: "Grâce à la radio, le visage de l'Afrique a beaucoup changé ces dernières années. Nous aimons la radio parce qu'elle nous fait découvrir notre culture, nos civilisations, nos arts. Cependant, la radio ne saurait se borner à remplacer le tambour disséminant les nouvelles dans les villages de brousse. Si le message tambouriné est une technique, il est encore un art digne d'être conservé. La radio fait connaître le message non seulement à quelques villages, mais à tout un peuple désireux de rester en contact avec des traditions qui font son originalité.",
    source: 'Francis Bebey, La 3ᵉ en français, p. 236.',
    questions: {
      I: "1. Relève une expression qui justifie le titre.\n2. Vrai ou faux : a) La radio remplace le tambour ; b) La radio et le tambour sont des moyens de communication ; c) La radio véhicule le message ; d) Nous rejetons la radio en Afrique.",
      II: "1. Donne le sens de l'expression « message tambouriné ».\n2. Trouve dans la dictée le synonyme du mot « culture » et emploie-le dans une phrase.",
      III: "1. Donne la nature et la fonction du mot souligné : « Afrique ».\n2. Fais l'analyse logique de : « Nous aimons la radio parce qu'elle nous fait découvrir notre culture ».",
      IV: "« La radio fait connaître le message ».\n1. Donne l'infinitif présent du verbe souligné (fait).\n2. Réécris la phrase au futur simple de l'indicatif et au conditionnel présent.",
    },
    corrige: {
      I: "1. « *Grâce à la radio, le visage de l'Afrique a beaucoup changé ces dernières années* ».\n2. a) **Faux** (elle « ne saurait se borner à remplacer le tambour ») ; b) **Vrai** ; c) **Vrai** ; d) **Faux** (« *Nous aimons la radio* »).",
      II: "1. Une **nouvelle transmise au moyen du son du tambour**.\n2. **civilisations** (aussi : traditions). Ex. : *Chaque peuple est fier de sa **civilisation**.*",
      III: "1. **Afrique** : nom propre, féminin singulier, **complément du nom** *visage*.\n2. Deux propositions :\n- « *Nous aimons la radio* » : **proposition principale** ;\n- « *parce qu'elle nous fait découvrir notre culture* » : **proposition subordonnée conjonctive circonstancielle de cause**, introduite par *parce que*, complément circonstanciel de cause du verbe *aimer*.",
      IV: "1. **faire**.\n2. Futur simple : *La radio **fera** connaître le message.* — Conditionnel présent : *La radio **ferait** connaître le message.*",
    },
  },
  {
    year: 2015, titre: "J'ai un rêve",
    texte: "J'ai un rêve : un jour les petits-fils des anciens esclaves et les petits-fils de leurs anciens maîtres pourront s'asseoir ensemble à la même table. J'ai un rêve : mes quatre enfants vivront un jour dans un pays où ils ne seront pas jugés sur la couleur de leur peau, mais sur la valeur de leur caractère. Et quand les cloches de la liberté sonneront à travers le pays, tous les enfants de Dieu sans distinction de races se donneront la main en chantant : « Nous sommes libres enfin ! ».",
    source: 'Martin Luther King, La 3ᵉ en français, p. 252.',
    questions: {
      I: "1. Choisis le titre qui convient : a) La fraternité ; b) Le tribalisme ; c) Le racisme.\n2. Vrai ou faux : a) La liberté est déjà acquise ; b) L'auteur encourage l'unité ; c) Il y a l'unité dans ce pays ; d) Dans ce pays les blancs et les noirs s'aimeront.",
      II: "1. Donne le sens de l'expression « anciens maîtres ».\n2. Donne le féminin du mot « Dieu » et emploie-le dans une phrase.",
      III: "1. Donne la nature et la fonction des mots soulignés : « quatre » et « caractère ».\n2. Écris « Nous sommes libres enfin ! » à la forme interrogative.",
      IV: "« J'ai un rêve ».\na) Quel est l'infinitif du verbe ?\nb) Donne son participe passé.\nc) Écris cette phrase au futur simple et au plus-que-parfait de l'indicatif.",
    },
    corrige: {
      I: "1. **a) La fraternité**.\n2. a) **Faux** (c'est encore un rêve) ; b) **Vrai** ; c) **Faux** ; d) **Vrai** (c'est le rêve de l'auteur).",
      II: "1. Les **anciens propriétaires d'esclaves** (les anciens esclavagistes).\n2. **déesse**. Ex. : *Dans la mythologie grecque, Athéna est la **déesse** de la sagesse.*",
      III: "1. **quatre** : adjectif numéral cardinal, **détermine** le nom *enfants*. — **caractère** : nom commun, masculin singulier, **complément du nom** *valeur*.\n2. ***Sommes-nous enfin libres** ?*",
      IV: "a) **avoir**.\nb) **eu**.\nc) Futur simple : *J'**aurai** un rêve.* — Plus-que-parfait : *J'**avais eu** un rêve.*",
    },
  },
  {
    year: 2016, titre: 'La réussite',
    texte: "Lire, écrire, calculer parfaitement sont les meilleures bases de la réussite dans les études et la vie professionnelle ; pour votre enfant, il s'agit d'un bénéfice qu'il conserve toute une vie. À condition de l'avoir acquis une fois pour toutes et correctement ! L'écolier est souvent seul face aux erreurs de l'apprentissage : classes surchargées, parents occupés… Pourtant, vous voulez être sûr de cet acquis fondamental. Sans base solide, comment votre enfant peut-il progresser ?",
    source: 'La 3ᵉ en français.',
    questions: {
      I: "1. Relève une expression qui justifie le titre.\n2. Vrai ou faux : a) Réussir demande la maîtrise de la lecture, de l'écriture et du calcul ; b) Maîtriser ces trois mécanismes est une perte de temps ; c) L'écolier est souvent abandonné à ses fautes d'apprentissage ; d) Sans base, la progression est facile.",
      II: "1. Trouve le synonyme de « correctement ».\n2. Décompose le mot « professionnelle » et nomme ses différentes parties.",
      III: "1. Donne la nature et la fonction du mot souligné : « parfaitement ».\n2. Relève une proposition subordonnée relative.\n3. Transcris « L'écolier est souvent seul face aux erreurs de l'apprentissage » à la forme interro-négative.",
      IV: "« Pourtant, vous voulez être sûr de cet acquis fondamental ».\n1. Donne l'infinitif présent et le participe passé du verbe souligné (voulez).\n2. Réécris cette phrase au passé composé de l'indicatif et au conditionnel présent.",
    },
    corrige: {
      I: "1. « *Lire, écrire, calculer parfaitement sont les meilleures bases de la réussite* ».\n2. a) **Vrai** ; b) **Faux** ; c) **Vrai** ; d) **Faux**.",
      II: "1. **bien** (aussi : convenablement, sans faute).\n2. **profession** (radical / mot de base) + **-nelle** (suffixe qui forme l'adjectif).",
      III: "1. **parfaitement** : adverbe de manière, **complément circonstanciel de manière** des verbes *lire, écrire, calculer*.\n2. « *qu'il conserve toute une vie* » (relative introduite par *que*, complément de l'antécédent *bénéfice*).\n3. *L'écolier **n'est-il pas** souvent seul face aux erreurs de l'apprentissage ?*",
      IV: "1. Infinitif : **vouloir** ; participe passé : **voulu**.\n2. Passé composé : *Pourtant, vous **avez voulu** être sûr de cet acquis fondamental.* — Conditionnel présent : *Pourtant, vous **voudriez** être sûr de cet acquis fondamental.*",
    },
  },
  {
    year: 2019, titre: 'Un élève sérieux',
    texte: "À présent, on peut trouver des femmes partout dans les villes et les villages. Mais j'obéis à mes livres. L'homme prend la femme et ils vivent heureux pour toujours. Je ne suis pas pressé. Il faut que je me prépare. Je ne peux pas être célibataire un jour, marié le lendemain. Le mariage doit venir graduellement. Je refuse de me marier à la hâte. Un homme doit avoir le temps de se préparer pour se faire une idée… Je dois d'abord penser à mes études.",
    source: 'Wole Soyinka, La 3ᵉ en français.',
    questions: {
      I: "1. Choisis le titre : Le mariage de ma sœur / Le jour de la fête / Un élève sérieux.\n2. Vrai ou faux : a) On peut trouver les femmes dans toutes les localités ; b) L'homme et la femme s'unissent pour vivre malheureux ; c) J'accepte le mariage à la hâte ; d) J'accorde la priorité à mes études.",
      II: "1. Donne le sens de l'expression « à la hâte ».\n2. Donne un mot de la même famille que « heureux » et emploie-le dans une phrase.",
      III: "1. Donne la nature et la fonction du mot souligné : « graduellement ».\n2. Relève une proposition indépendante coordonnée.\n3. Transcris « Je dois d'abord penser à mes études » à la forme interro-négative.",
      IV: "« Je me prépare ».\n1. Donne l'infinitif présent et la forme du verbe.\n2. Réécris cette phrase au futur simple et au passé composé de l'indicatif.",
    },
    corrige: {
      I: "1. **Un élève sérieux**.\n2. a) **Vrai** ; b) **Faux** (« *ils vivent heureux* ») ; c) **Faux** (« *Je refuse de me marier à la hâte* ») ; d) **Vrai**.",
      II: "1. **précipitamment**, trop vite, sans prendre le temps de réfléchir.\n2. **bonheur** (aussi : malheureux, heureusement). Ex. : *Le **bonheur** se construit avec patience.*",
      III: "1. **graduellement** : adverbe de manière, **complément circonstanciel de manière** du verbe *venir*.\n2. « *ils vivent heureux pour toujours* » (coordonnée par **et** à « *L'homme prend la femme* ») ; ou « *Mais j'obéis à mes livres* » (coordonnée par **mais**).\n3. ***Ne dois-je pas** d'abord penser à mes études ?*",
      IV: "1. Infinitif : **se préparer** ; forme **pronominale**.\n2. Futur simple : *Je me **préparerai**.* — Passé composé : *Je me **suis préparé(e)**.*",
    },
  },
  {
    year: 2020, titre: 'Les valeurs cardinales',
    texte: "À l'aube de la nouvelle décennie, nous avons besoin, dans chaque pays, de retourner aux valeurs simples qui ont grandi d'autres nations : le travail, le sacrifice, la gestion rigoureuse des biens publics. Cependant, les nations africaines ne pourront retrouver ces valeurs et, en fin de compte, le progrès, qu'à deux conditions : enrayer l'ignorance en généralisant la gratuité de l'enseignement afin de ne pas exclure les populations défavorisées ; garantir l'exercice de la démocratie, facteur de développement.",
    source: "D'après Faustin Hitiyise, La 3ᵉ en français.",
    questions: {
      I: "1. Relève une expression qui justifie le titre.\n2. Vrai ou faux : a) Chaque pays doit revenir aux valeurs élémentaires ; b) Ces valeurs existaient déjà dans le passé ; c) Il y a une seule exigence pour recouvrer ces valeurs ; d) La gratuité de l'enseignement augmente l'ignorance.",
      II: "1. Donne le sens du mot « décennie ».\n2. Donne un homophone du mot « compte » et emploie-le dans une phrase.",
      III: "1. Donne le genre et le nombre des mots soulignés : « pays » et « valeurs ».\n2. Relève une proposition subordonnée relative.",
      IV: "« Les valeurs qui ont grandi d'autres nations ».\n1. Donne l'infinitif présent du verbe souligné.\n2. Réécris cette phrase au présent et au futur simple de l'indicatif.",
    },
    corrige: {
      I: "1. « *le travail, le sacrifice, la gestion rigoureuse des biens publics* » (ou : « *retourner aux valeurs simples* »).\n2. a) **Vrai** ; b) **Vrai** (on parle de « retourner » à ces valeurs) ; c) **Faux** (il y a **deux** conditions) ; d) **Faux** (elle enraye l'ignorance).",
      II: "1. **décennie** : période de **dix ans**.\n2. **conte** (aussi : comte). Ex. : *Ce **conte** africain parle d'un lièvre rusé.*",
      III: "1. **pays** : masculin singulier (invariable) ; **valeurs** : féminin pluriel.\n2. « *qui ont grandi d'autres nations* ».",
      IV: "1. **grandir**.\n2. Présent : *Les valeurs qui **grandissent** d'autres nations.* — Futur simple : *Les valeurs qui **grandiront** d'autres nations.*",
    },
  },
  {
    year: 2021, titre: "L'amour de la musique",
    texte: "Je suis heureuse de monter sur la scène. Monter sur les planches, c'est entrer dans un monde parfait. Le passé n'existe plus. L'avenir n'a plus de menaces. La seule chose qui compte, c'est la musique. Je ne vis que pour cela. C'est mon amour pour la musique et pour mon public qui crée ce monde parfait. Ma voix porte quand je parle des maux qui étranglent mon pays. Tous les jours, il y a plus à dire : les tragédies s'accumulent et le temps presse.",
    source: "D'après Myriam Makéba, La 3ᵉ en français.",
    questions: {
      I: "1. Choisis le titre : La presse écrite / L'amour de la musique / Le racisme.\n2. Vrai ou faux : a) Elle est contente sur la scène ; b) L'unique préoccupation est ma famille ; c) Ce monde parfait est créé par l'argent ; d) Tous les jours, il y a des problèmes.",
      II: "1. Donne un synonyme du mot « avenir ».\n2. Trouve un mot de la même famille que « musique » et emploie-le dans une phrase.",
      III: "1. Fais l'analyse grammaticale du mot souligné : « seule ».\n2. « Je parle des maux qui étranglent mon pays » : transforme cette phrase complexe en deux phrases simples.",
      IV: "1. Indique le temps prédominant dans le texte.\n2. « Je ne vis que pour cela » : réécris à l'imparfait de l'indicatif et au présent du subjonctif.",
    },
    corrige: {
      I: "1. **L'amour de la musique**.\n2. a) **Vrai** ; b) **Faux** (« *la seule chose qui compte, c'est la musique* ») ; c) **Faux** (c'est l'amour de la musique et du public) ; d) **Vrai**.",
      II: "1. **futur** (aussi : lendemain, devenir).\n2. **musicien** (aussi : musical). Ex. : *Mon frère est un **musicien** talentueux.*",
      III: "1. **seule** : adjectif qualificatif, féminin singulier, **épithète** du nom *chose*.\n2. *Je parle des maux. Ces maux étranglent mon pays.*",
      IV: "1. Le **présent de l'indicatif**.\n2. Imparfait : *Je ne **vivais** que pour cela.* — Présent du subjonctif : *(Il faut) que je ne **vive** que pour cela.*",
    },
  },
  {
    year: 2022, titre: 'Les migrations',
    texte: "Les hommes bougent à la surface de la planète depuis l'aube des temps. Ainsi que l'écrivait un grand savant : « Il n'y a peut-être pas dans le monde un seul peuple qui se trouve aujourd'hui à l'endroit où la race à laquelle il appartient est née. » Dans notre Afrique, les anciens gardent encore la mémoire de ceux venus de loin parfois, qui ont fondé tel ou tel village. Les grandes villes modernes sont nées de l'exode rural. Les variétés de migrations sont infinies.",
    source: 'La 3ᵉ en français.',
    questions: {
      I: "Relève une expression qui justifie le titre.",
      II: "1. Donne le sens du mot « migrations ».\n2. Trouve l'antonyme du mot « village » et emploie-le dans une phrase.",
      III: "1. Donne la nature et la fonction de l'expression soulignée : « depuis l'aube des temps ».\n2. Relève une proposition indépendante.\n3. Transcris « Les grandes villes sont nées de l'exode rural » à la forme négative.",
      IV: "« Les anciens gardent la mémoire ».\n1. Donne le participe présent et le groupe du verbe conjugué.\n2. Réécris cette phrase au futur simple de l'indicatif et au subjonctif présent.",
    },
    corrige: {
      I: "« *Les hommes bougent à la surface de la planète depuis l'aube des temps* » (ou : « *Les variétés de migrations sont infinies* »).",
      II: "1. **migrations** : déplacements de populations qui quittent une région ou un pays pour aller s'installer ailleurs.\n2. **ville**. Ex. : *Beaucoup de jeunes quittent le village pour la **ville**.*",
      III: "1. « *depuis l'aube des temps* » : groupe nominal prépositionnel (introduit par *depuis*), **complément circonstanciel de temps** du verbe *bouger*.\n2. « *Les variétés de migrations sont infinies.* » (ou : « *Les grandes villes modernes sont nées de l'exode rural.* »)\n3. *Les grandes villes **ne** sont **pas** nées de l'exode rural.*",
      IV: "1. Participe présent : **gardant** ; verbe *garder*, **1er groupe**.\n2. Futur simple : *Les anciens **garderont** la mémoire.* — Subjonctif présent : *(Il faut) que les anciens **gardent** la mémoire.*",
    },
  },
  {
    year: 2023, titre: "L'importance de l'éducation",
    texte: "Je dis toujours à mes filles et mes garçons : vous êtes la relève pour vos parents et toute la famille. Travaillez pour mériter leurs sacrifices. Cultivez-vous au lieu de réfuter. Devenus majeurs, pour que vos idées et arguments aient du crédit, il faut qu'ils émanent d'un savoir conditionné par des diplômes. Le diplôme n'est pas un mythe. Il n'est pas tout, certes. Mais il couronne un savoir, un travail. Le rêve d'une ascension fulgurante pousse les parents à donner plus de savoir que d'éducation à leurs progénitures.",
    source: 'Mariama Bâ, Une si longue lettre.',
    questions: {
      I: "1. Relève une expression qui justifie le titre.\n2. Vrai ou faux : a) Je parle à mes enfants ; b) Les enfants sont l'avenir de demain ; c) Le savoir conduit les enfants à la perdition ; d) Le diplôme est un mythe.",
      II: "1. Donne le sens du mot « éducation ».\n2. Donne un mot de la même famille que « argument » et emploie-le dans une phrase.",
      III: "1. Analyse grammaticalement l'expression soulignée : « mes filles ».\n2. Transcris « Le diplôme n'est pas un mythe » à la forme affirmative.",
      IV: "« Le rêve pousse les parents à donner le savoir ».\n1. Donne l'infinitif présent et le temps du verbe souligné (pousse).\n2. Réécris cette phrase au futur simple et au conditionnel présent.",
    },
    corrige: {
      I: "1. « *Travaillez pour mériter leurs sacrifices. Cultivez-vous au lieu de réfuter.* » (ou : « *donner plus de savoir que d'éducation à leurs progénitures* »).\n2. a) **Vrai** ; b) **Vrai** (« *vous êtes la relève* ») ; c) **Faux** ; d) **Faux** (« *Le diplôme n'est pas un mythe* »).",
      II: "1. **éducation** : action de former un enfant, de lui transmettre des connaissances, mais aussi des **valeurs et de bonnes manières**.\n2. **argumenter** (aussi : argumentation). Ex. : *Il faut **argumenter** pour convaincre ton lecteur.*",
      III: "1. « *(à) mes filles* » : groupe nominal (déterminant possessif *mes* + nom commun *filles*), féminin pluriel, **complément d'objet indirect** du verbe *dire*.\n2. *Le diplôme **est** un mythe.*",
      IV: "1. Infinitif : **pousser** ; temps : **présent de l'indicatif**.\n2. Futur simple : *Le rêve **poussera** les parents à donner le savoir.* — Conditionnel présent : *Le rêve **pousserait** les parents à donner le savoir.*",
    },
  },
]

export function buildBepcExercises() {
  return bepc.map((s) => ({
    title: `BEPC ${s.year}${s.year === 2012 ? ' et 2018' : ''} — Dictée : ${s.titre}`,
    statement: `> ${s.texte}\n>\n> *${s.source}*\n\n${parties(s.questions)}`,
    solution: parties(s.corrige),
  }))
}

// QCM BEPC 2022 (le seul sujet de ce fichier qui n'avait pas encore son QCM d'annale).
export const bepc2022Quiz = {
  title: 'BEPC 2022 — Dictée : Les migrations',
  year: 2022,
  questions: [
    { prompt: 'Quelle expression du texte justifie le titre « Les migrations » ?', options: ['Les hommes bougent à la surface de la planète depuis l\'aube des temps.', 'Les anciens gardent encore la mémoire.', 'Dans notre Afrique.', 'Un grand savant.'], correct_index: 0, explanation: 'Cette phrase montre que les hommes se sont toujours déplacés : c\'est le sens du mot « migrations ».' },
    { prompt: 'Que signifie le mot « migrations » ?', options: ['Des fêtes traditionnelles', 'Des déplacements de populations qui vont s\'installer ailleurs', 'Des maladies venues de loin', 'Des constructions de villages'], correct_index: 1, explanation: 'Une migration est le déplacement d\'une population d\'une région ou d\'un pays vers un autre pour s\'y installer.' },
    { prompt: 'Quel est l\'antonyme du mot « village » ?', options: ['hameau', 'campagne', 'ville', 'brousse'], correct_index: 2, explanation: 'Le contraire du village est la ville. Ex. : « Beaucoup de jeunes quittent le village pour la ville. »' },
    { prompt: 'Vrai ou faux : « D\'après le texte, les grandes villes modernes sont nées de l\'exode rural. »', options: ['Vrai', 'Faux'], correct_index: 0, explanation: 'Le texte le dit : « Les grandes villes modernes sont nées de l\'exode rural. »' },
    { prompt: 'Quelle est la nature et la fonction de « depuis l\'aube des temps » ?', options: ['Groupe nominal, sujet de bougent', 'Groupe nominal prépositionnel, complément circonstanciel de temps de bougent', 'Adverbe, complément de manière', 'Groupe nominal, complément d\'objet direct de bougent'], correct_index: 1, explanation: 'Introduit par « depuis », ce groupe indique depuis quand les hommes bougent : c\'est un CC de temps.' },
    { prompt: 'Laquelle de ces phrases est une proposition indépendante ?', options: ['qui ont fondé tel ou tel village', 'où la race à laquelle il appartient est née', 'Les variétés de migrations sont infinies.', 'qui se trouve aujourd\'hui à l\'endroit'], correct_index: 2, explanation: 'Elle a un seul verbe conjugué et ne dépend d\'aucune autre proposition ; les autres sont des subordonnées relatives.' },
    { prompt: 'Quelle est la forme négative de « Les grandes villes sont nées de l\'exode rural » ?', options: ['Les grandes villes sont-elles nées de l\'exode rural ?', 'Les grandes villes ne sont pas nées de l\'exode rural.', 'Les grandes villes sont pas nées de l\'exode rural.', 'Les grandes villes ne naissent de l\'exode rural.'], correct_index: 1, explanation: 'La négation encadre l\'auxiliaire : « ne sont pas nées ».' },
    { prompt: 'Dans « Les anciens gardent la mémoire », quel est le participe présent du verbe et son groupe ?', options: ['gardé, 1er groupe', 'gardant, 1er groupe', 'gardant, 2e groupe', 'garder, 3e groupe'], correct_index: 1, explanation: 'Garder (terminaison -er) est du 1er groupe ; son participe présent est « gardant ».' },
    { prompt: 'Quelle est la réécriture au futur simple de « Les anciens gardent la mémoire » ?', options: ['Les anciens gardaient la mémoire.', 'Les anciens garderaient la mémoire.', 'Les anciens garderont la mémoire.', 'Les anciens ont gardé la mémoire.'], correct_index: 2, explanation: 'Futur simple de « garder », 3e personne du pluriel : « garderont ».' },
    { prompt: 'Et au subjonctif présent ?', options: ['Que les anciens gardent la mémoire.', 'Que les anciens gardaient la mémoire.', 'Que les anciens garderont la mémoire.', 'Que les anciens gardassent la mémoire.'], correct_index: 0, explanation: 'Au subjonctif présent : « que les anciens gardent » (même forme qu\'au présent de l\'indicatif pour ce verbe).' },
  ],
}
