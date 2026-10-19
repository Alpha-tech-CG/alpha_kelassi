// Annales CEPE (République du Congo) au format d'origine : énoncé + corrigé.
// Source : export WhatsApp « Spécial cours » (examens_bepc_cepe.md, 19/10/2026).
// Les corrigés suivent les corrigés officiels déjà utilisés pour les QCM d'annales
// (seed-exam-content.mjs) ; les rares erreurs de ces corrigés sont signalées en remarque.

const q = (lines) => lines.map((l, i) => `${i + 1}. ${l}`).join('\n')

// ── Dictées + questions ───────────────────────────────────────────────────────
export const dictees = [
  {
    title: 'Dictée n°1 — Préparons l\'avenir',
    texte: "Il y a des épines sur la route du bonheur : il faut lutter pour vivre pleinement. Il faut avoir le goût de l'effort et non recourir toujours à la facilité. On déguste les fruits de ses efforts : seul un cultivateur qui a travaillé au soleil peut être fier de se reposer à l'ombre. Chacun doit planter un arbre durant sa jeunesse pour vivre à l'ombre dans sa vieillesse.",
    questions: [
      'Explique l\'expression : « il y a des épines sur la route du bonheur ».',
      'Donne le radical du mot « vieillard ».',
      'Donne la nature et la fonction des mots soulignés : « fruits » et « Chacun ».',
      '« On déguste les fruits de ses efforts » : mets cette phrase aux autres temps simples de l\'indicatif.',
    ],
    corrige: `**1.** Cela veut dire que la vie présente des **obstacles, des difficultés** : pour être heureux et réussir, il faut lutter et faire des efforts.

**2.** Le radical de « vieillard » est **vieill-** (de *vieil / vieille*), qu'on retrouve dans *vieillesse*, *vieillir*.
> Remarque : certains corrigés locaux donnent « vie », mais *vieillard* ne vient pas de *vie* : il vient de *vieux / vieil*.

**3.**
- **fruits** : nom commun, masculin pluriel, **complément d'objet direct** du verbe *déguster*.
- **Chacun** : pronom indéfini, **sujet** du verbe *devoir*.

**4.** (La phrase est au présent.)
- Imparfait : *On **dégustait** les fruits de ses efforts.*
- Passé simple : *On **dégusta** les fruits de ses efforts.*
- Futur simple : *On **dégustera** les fruits de ses efforts.*`,
  },
  {
    title: 'Dictée n°2 — Il faut être propre',
    texte: "Il n'est pas difficile d'être propre. Il suffit de faire attention à la saleté et de la faire disparaître dès qu'on l'aperçoit. Cela demande un peu de courage. La paresse et la malpropreté sont deux sœurs qui vont toujours ensemble. Vous avez les mains sales ? Allez les laver tout de suite. Il y a des détritus sur le sol de votre case ? Balayez-les immédiatement et portez-les à la fosse aux ordures.",
    questions: [
      'Trouve dans la dictée deux mots qui expliquent la même chose.',
      'Explique : malpropre ; fosse aux ordures.',
      'Donne la nature et la fonction des mots soulignés : « La » (paresse) et « fosse ».',
      'Mets la phrase suivante au futur simple et à l\'imparfait de l\'indicatif : « Cela demande un peu de courage ».',
    ],
    corrige: `**1.** **saleté** et **détritus** (on accepte aussi *saleté* et *malpropreté*).

**2.**
- **malpropre** : qui n'est pas propre, sale.
- **fosse aux ordures** : trou creusé dans le sol où l'on jette les ordures.

**3.**
- **La** : article défini, féminin singulier, détermine le nom *paresse*.
- **fosse** : nom commun, féminin singulier, **complément circonstanciel de lieu** du verbe *porter*.

**4.**
- Futur simple : *Cela **demandera** un peu de courage.*
- Imparfait : *Cela **demandait** un peu de courage.*`,
  },
  {
    title: 'Dictée n°3 — Les vertus du citron',
    texte: "Le citron est un fruit qu'on trouve un peu partout. L'homme l'utilise pour se rafraîchir et se soigner. En effet, le jus de citron est une excellente boisson. Il peut être pris pur ou dilué dans l'eau. Son suc facilite le travail du foie et du pancréas. En outre, le citron purifie le sang et nettoie l'organisme. Le citron contient l'acide nitrique.",
    questions: [
      'Quelle est l\'utilité du citron ?',
      'Explique : vertu, dilué.',
      'Donne la nature et la fonction des mots soulignés : « citron » (le citron) ; « excellente » (une excellente).',
      '« Le citron est un fruit qu\'on trouve un peu partout. » Mets cette phrase à l\'imparfait et au futur simple de l\'indicatif à la forme affirmative.',
    ],
    corrige: `**1.** Le citron sert à **se rafraîchir** et à **se soigner** : il facilite le travail du foie et du pancréas, purifie le sang et nettoie l'organisme.

**2.**
- **vertu** : qualité, bienfait (ici : propriété utile pour la santé).
- **dilué** : mélangé dans un liquide (ici dans l'eau).

**3.**
- **citron** : nom commun, masculin singulier, **sujet** du verbe *être*.
- **excellente** : adjectif qualificatif, féminin singulier, **épithète** du nom *boisson*.

**4.**
- Imparfait : *Le citron **était** un fruit qu'on **trouvait** un peu partout.*
- Futur simple : *Le citron **sera** un fruit qu'on **trouvera** un peu partout.*

> Remarque scientifique : le citron contient en réalité de l'**acide citrique** (et de la vitamine C), pas de l'acide nitrique. Le texte est recopié tel qu'il a été donné.`,
  },
  {
    title: 'Dictée n°4 — Ma première lettre',
    texte: "Il y a de cela une année, j'ai écrit une lettre à mon oncle qui habite au Gabon. J'avais utilisé une double feuille et j'avais soigné mon écriture pour qu'elle soit bien lisible ; j'avais respecté la présentation et les étapes que la maîtresse nous avait enseignées en classe. Mon oncle était très content de me lire et m'avait félicité car j'avais respecté les règles de conjugaison, de vocabulaire, d'orthographe et de grammaire.",
    questions: [
      'Quelle est la qualité d\'une bonne écriture ?',
      'Donne le contraire du mot lisible.',
      'Donne la nature et la fonction des mots soulignés : « Gabon », « règles » (de conjugaison).',
      'Conjugue « respecter les règles » à la première personne du pluriel au futur simple de l\'indicatif.',
    ],
    corrige: `**1.** Une bonne écriture doit être **soignée et bien lisible**.

**2.** Le contraire de *lisible* est **illisible**.

**3.**
- **Gabon** : nom propre (nom de pays), **complément circonstanciel de lieu** du verbe *habiter*.
- **règles** : nom commun, féminin pluriel, **complément d'objet direct** du verbe *respecter* (*avais respecté*).

**4.** *Nous **respecterons** les règles.*`,
  },
  {
    title: 'Dictée n°5 — La pollution',
    texte: "Il y a peu de temps que le mot pollution est entré dans le langage courant. Aussi est-il bon de rappeler sa signification exacte : il désigne l'ensemble des produits qui, déversés dans l'environnement, provoquent une nuisance ou gêne pour les êtres vivants. Il existe plusieurs sortes de pollutions, dont les plus importantes sont la pollution de l'air et la pollution de la terre.",
    questions: [
      'Donne un titre à ce texte.',
      'Relève dans la dictée la phrase qui explique la pollution.',
      'Trouve deux mots de la même famille que terre.',
      'Mets au futur simple et à l\'imparfait de l\'indicatif la phrase : « Aussi est-il bon de rappeler sa signification exacte. »',
    ],
    corrige: `**1.** **La pollution** (ou : *Qu'est-ce que la pollution ?*).

**2.** « *Il désigne l'ensemble des produits qui, déversés dans l'environnement, provoquent une nuisance ou gêne pour les êtres vivants.* »

**3.** Par exemple : **terrain**, **terrien** (aussi : *enterrer, terrasse, territoire, atterrir*).

**4.**
- Futur simple : *Aussi **sera**-t-il bon de rappeler sa signification exacte.*
- Imparfait : *Aussi **était**-il bon de rappeler sa signification exacte.*`,
  },
  {
    title: 'Dictée n°6 — La volonté',
    texte: "De toutes nos qualités, la volonté est la plus importante. Il ne servirait à rien d'avoir une belle intelligence et une bonne mémoire si la volonté nous fait défaut. L'élève qui néglige ses devoirs de classe, qui se réveille tard le matin manque de volonté. Il est de même pour celui qui préfère jouer toute la journée au lieu de penser au travail scolaire.",
    questions: [
      'Relève dans la dictée deux expressions qui montrent le manque de volonté.',
      'Écris deux mots de la même famille que journée.',
      'Donne la nature et la fonction des mots soulignés : « belle » (intelligence), « devoirs ».',
      '« La volonté est la plus importante » : écris cette phrase au futur simple et à l\'imparfait de l\'indicatif.',
    ],
    corrige: `**1.** « *néglige ses devoirs de classe* » ; « *se réveille tard le matin* » (on accepte aussi « *préfère jouer toute la journée* »).

**2.** Par exemple : **jour**, **journalier** (aussi : *journal, ajourner, séjour*).

**3.**
- **belle** : adjectif qualificatif, féminin singulier, **épithète** du nom *intelligence*.
- **devoirs** : nom commun, masculin pluriel, **complément d'objet direct** du verbe *négliger*.

**4.**
- Futur simple : *La volonté **sera** la plus importante.*
- Imparfait : *La volonté **était** la plus importante.*`,
  },
  {
    title: 'Dictée n°7 — Ajoutons à l\'humanité',
    texte: "On ne vous demande pas des miracles, on désire seulement que vous laissiez quelque chose après vous. Celui qui a planté un arbre avant de mourir n'a pas vécu inutilement. En effet, il a ajouté quelque chose à l'humanité. L'arbre donnera des fruits, ou au moins de l'ombre à ceux qui naîtront demain.",
    questions: [
      'Compréhension : « celui qui a planté un arbre avant de mourir n\'a pas vécu inutilement » — vrai ou faux ?',
      'Explique le mot vécu.',
      'Donne la nature et la fonction des mots soulignés : « arbre » (a planté un arbre) et le déterminant de « fruits ».',
      'Mets la phrase suivante à l\'imparfait : « on ne vous demande pas des miracles ».',
    ],
    corrige: `**1.** **Vrai** : le texte explique qu'il « *a ajouté quelque chose à l'humanité* ».

**2.** **vécu** est le participe passé du verbe *vivre* : ici, il veut dire **existé, passé sa vie**.

**3.**
- **arbre** : nom commun, masculin singulier, **complément d'objet direct** du verbe *planter*.
- **des** (des fruits) : article indéfini, masculin pluriel, **détermine** le nom *fruits*.
> Le sujet d'origine soulignait « les » ; dans le texte tel qu'il nous est parvenu, le déterminant de *fruits* est « des ».

**4.** *On ne vous **demandait** pas des miracles.*`,
  },
  {
    title: 'Dictée n°8 — La vaccination',
    texte: "La vaccination protège les enfants contre les maladies les plus dangereuses de l'enfance. En absence de la vaccination, beaucoup d'enfants meurent ou restent handicapés. Les campagnes de vaccination dans le monde entier ont déjà contribué à sauver des milliers de vies.",
    questions: [
      'Dis pourquoi on doit se faire vacciner.',
      'Trouve un mot de la même famille que vaccination.',
      'Donne la nature et la fonction des mots soulignés : « vaccination » (La vaccination protège), « enfants » (protège les enfants).',
      'Mets la première phrase de la dictée à l\'imparfait de l\'indicatif.',
    ],
    corrige: `**1.** On doit se faire vacciner pour **se protéger contre les maladies les plus dangereuses de l'enfance** ; sans vaccination, beaucoup d'enfants meurent ou restent handicapés.

**2.** Par exemple : **vaccin**, **vacciner**.

**3.**
- **vaccination** : nom commun, féminin singulier, **sujet** du verbe *protéger*.
- **enfants** : nom commun, masculin pluriel, **complément d'objet direct** du verbe *protéger*.

**4.** *La vaccination **protégeait** les enfants contre les maladies les plus dangereuses de l'enfance.*`,
  },
  {
    title: 'Dictée n°9 — Les dangers du tabac',
    texte: "Les médecins ont maintenant prouvé qu'une cigarette fumée par une femme enceinte agit sur le fœtus et son développement. Après la naissance, le bébé continue d'être intoxiqué par le lait maternel si la mère ne cesse pas de fumer. Préservons notre santé en résistant aux tentations du tabac.",
    questions: [
      'Dis ce que risque une femme enceinte si elle fume.',
      'Explique le mot intoxiqué.',
      'Donne la nature et la fonction des mots soulignés : « fumée », « tabac ».',
      '« Les médecins ont maintenant prouvé qu\'une cigarette fumée par une femme enceinte agit sur le fœtus et son développement. » Mets cette phrase au présent de l\'indicatif.',
    ],
    corrige: `**1.** Elle risque de **nuire à son bébé** : la cigarette agit sur le fœtus et son développement ; elle peut l'intoxiquer, et même après la naissance, par le lait maternel.

**2.** **intoxiqué** : empoisonné.

**3.**
- **fumée** : participe passé employé comme adjectif, féminin singulier, **épithète** du nom *cigarette*.
- **tabac** : nom commun, masculin singulier, **complément du nom** *tentations*.

**4.** *Les médecins **prouvent** maintenant qu'une cigarette fumée par une femme enceinte **agit** sur le fœtus et son développement.*`,
  },
  {
    title: 'Dictée n°10 — Cultivons la paix',
    texte: "Je prends l'engagement dans ma vie quotidienne, ma famille, mon travail, ma communauté, mon département et mon pays de :\n- respecter toutes les vies ;\n- rejeter la violence sous toutes ses formes ;\n- libérer la générosité ;\n- écouter pour se comprendre pour ne pas céder à la médisance et au rejet d'autrui ;\n- préserver la planète ;\n- promouvoir la solidarité, contribuer au développement de ma communauté.\n\n*Horizon d'Afrique CE2 p. 74 ; pour une culture de paix et de la non-violence (UNESCO 2000).*",
    questions: [
      'Relève dans la dictée deux (02) qualités qui contribuent à la culture de la paix.',
      'Trouve le contraire du mot engagement.',
      'Donne la nature et la fonction des mots soulignés : « engagement », « ma » (communauté).',
      '« Je prends l\'engagement » : écris cette phrase au passé composé de l\'indicatif.',
    ],
    corrige: `**1.** Par exemple : **la générosité** et **la solidarité** (on accepte aussi : *respecter toutes les vies, rejeter la violence, écouter autrui*).

**2.** **désengagement**.

**3.**
- **engagement** : nom commun, masculin singulier, **complément d'objet direct** du verbe *prendre*.
- **ma** : adjectif possessif, féminin singulier, **détermine** le nom *communauté*.

**4.** *J'**ai pris** l'engagement.*`,
  },
]

// ── Calcul rapide ─────────────────────────────────────────────────────────────
export const calculRapide = [
  {
    year: 2010, num: 1,
    questions: [
      "J'achète une chemise valant 8 000 F avec deux billets de 5 000 F. Combien doit-on me rendre ?",
      'Claude a 12 ans cette année. En quelle année est-il né ?',
      'Un écolier quitte sa maison à 6 h 35 min. Il arrive à l\'école à 6 h 55 min. Quelle est la durée de son trajet ?',
      'Quel est le prix de 100 litres d\'essence à 495 F le litre ?',
      'Écris en chiffres le nombre « un million neuf cent neuf mille deux ».',
      'Un cycliste fait 20 tours d\'une piste circulaire dont la circonférence est de 250 m. Quelle distance a-t-il parcourue ?',
      'Un sac de ciment pèse 50 kg. Combien de sacs dois-je acheter pour avoir une tonne ?',
      'Je partage 1 000 F entre deux enfants. Quelle est la part du plus grand sachant qu\'il a 100 F de plus ?',
      'Quelle est l\'aire d\'un terrain carré de 25 m de côté ?',
      'Combien de pots de 50 g peut-on avoir avec 2 000 g de yaourt ?',
    ],
    reponses: [
      '2 × 5 000 = 10 000 F ; 10 000 − 8 000 = **2 000 F**',
      '2010 − 12 = **1998**',
      '6 h 55 − 6 h 35 = **20 min**',
      '495 × 100 = **49 500 F**',
      '**1 909 002**',
      '250 × 20 = 5 000 m = **5 km**',
      '1 t = 1 000 kg ; 1 000 : 50 = **20 sacs**',
      '(1 000 + 100) : 2 = **550 F** (le plus petit a 450 F)',
      '25 × 25 = **625 m²**',
      '2 000 : 50 = **40 pots**',
    ],
  },
  {
    year: 2011, num: 2,
    questions: [
      'Combien valent 11 sachets de lait à raison de 75 F le sachet ?',
      'Un élève a 13 ans. En quelle année est-il né ?',
      'Un marchand a reçu 4 douzaines de crayons. Combien y a-t-il de crayons en tout ?',
      'Dans une classe on compte 75 garçons et 30 filles. Quel est l\'effectif de la classe ?',
      'Quel est le nombre qui, multiplié par lui-même, donne 100 ?',
      'Quel est le tiers de 96 ?',
      'Je donne un billet de 10 000 F pour payer un tissu qui coûte 7 500 F. Combien me rendra-t-on ?',
      'Quel est le côté d\'un jardin carré de 320 m de périmètre ?',
      'Quel est le quadruple de 50 ?',
      'Écris le nombre « cent un mille trois » en chiffres.',
    ],
    reponses: [
      '75 × 11 = **825 F**',
      '2011 − 13 = **1998**',
      '12 × 4 = **48 crayons**',
      '75 + 30 = **105 élèves**',
      '10 × 10 = 100 → **10**',
      '96 : 3 = **32**',
      '10 000 − 7 500 = **2 500 F**',
      '320 : 4 = **80 m**',
      '50 × 4 = **200**',
      '**101 003**',
    ],
  },
  {
    year: 2002, num: 3,
    questions: [
      'Un manioc coûte 100 F. Combien coûteront 60 maniocs ?',
      'Un train parti de Pointe-Noire à 6 h 30 min arrive à Dolisie à 11 h 30 min. Quelle est la durée de son trajet ?',
      'Quel est le côté d\'un carré de 160 m de périmètre ?',
      'Un sac de foufou pèse 25 kg. Quel est le poids de 4 sacs de foufou ?',
      'Quel est le triple de 333 ?',
      'Un terrain carré a 9 m de côté. Quelle est sa surface ?',
      'Une parcelle mesure 20 m de long et 18 m de large. Trouve son périmètre.',
      'Pour payer une dette de 850 F, tu donnes un billet de 1 000 F. Combien doit-on te rendre ?',
      'Quel est le quart de 1 600 F ?',
      'Écris en chiffres « un million trois cent soixante-dix-huit mille cinq francs ».',
    ],
    reponses: [
      '100 × 60 = **6 000 F**',
      '11 h 30 − 6 h 30 = **5 h**',
      '160 : 4 = **40 m**',
      '25 × 4 = **100 kg**',
      '333 × 3 = **999**',
      '9 × 9 = **81 m²**',
      '(20 + 18) × 2 = **76 m**',
      '1 000 − 850 = **150 F**',
      '1 600 : 4 = **400 F**',
      '**1 378 005 F**',
    ],
  },
  {
    year: 2003, num: 4,
    questions: [
      "J'ai 7 douzaines d'œufs. Combien d'œufs ai-je en tout ?",
      'Maman partage 10 000 F entre 4 enfants. Combien aura chacun ?',
      'Mon cadet est né en 1993. Quel âge a-t-il actuellement (en 2003) ?',
      'Quel est le triple de 423 ?',
      'Quel est le prix de 11 bics à 80 F l\'un ?',
      'Quel est le quart de 120 ?',
      'Quel est le prix de 10 litres d\'essence à 450 F le litre ?',
      "En épreuve orale, j'ai obtenu 6 en lecture et 8 en récitation. Quelle moyenne ai-je réalisée ?",
      'Un terrain carré a 36 m de périmètre. Quelle est sa surface ?',
      'Écris en chiffres le nombre « trois cent soixante-dix mille quinze ».',
    ],
    reponses: [
      '12 × 7 = **84 œufs**',
      '10 000 : 4 = **2 500 F**',
      '2003 − 1993 = **10 ans**',
      '423 × 3 = **1 269**',
      '80 × 11 = **880 F**',
      '120 : 4 = **30**',
      '450 × 10 = **4 500 F**',
      '(6 + 8) : 2 = **7**',
      'Côté : 36 : 4 = 9 m ; surface : 9 × 9 = **81 m²**',
      '**370 015**',
    ],
  },
  {
    year: 2004, num: 5,
    questions: [
      "Combien valent 2 douzaines d'œufs à 100 F l'un ?",
      'Christ a 400 F, Gloire en a le double. Combien ont-ils ensemble ?',
      "Un élève quitte sa maison à 6 h 25 min et arrive à l'école à 6 h 45 min. Quel est son temps de marche ?",
      "Pour acheter un bonbon, j'utilise 1/5 de 100 F. À combien ai-je acheté ce bonbon ?",
      "J'ai 14 ans. Mon père a le triple de mon âge. Quel est l'âge de mon père ?",
      'Pour payer une dette de 950 F, je donne un billet de 2 000 F. Combien devra-t-on me rendre ?',
      'Un timbre coûte 75 F. Combien coûteront 11 timbres ?',
      "J'achète un kilo de viande avec os. Sans os cette viande ne pèse plus que 750 g. Quel est le poids des os ?",
      "Quel est le prix de 25 cahiers à 300 F l'un ?",
      'Écris le nombre 10 010 en chiffres et en lettres.',
    ],
    reponses: [
      '24 × 100 = **2 400 F**',
      'Gloire : 800 F ; ensemble : 400 + 800 = **1 200 F**',
      '6 h 45 − 6 h 25 = **20 min**',
      '100 : 5 = **20 F**',
      '14 × 3 = **42 ans**',
      '2 000 − 950 = **1 050 F**',
      '75 × 11 = **825 F**',
      '1 000 g − 750 g = **250 g**',
      '300 × 25 = **7 500 F**',
      '**10 010** = **dix mille dix**',
    ],
  },
  {
    year: 2005, num: 6,
    questions: [
      'Un ouvrier gagne 300 F par heure de travail. Combien gagne-t-il en 12 heures ?',
      'Quel est le nombre qui vient avant 1 000 000 ?',
      "Combien coûtent 16 crayons valant 25 F l'un ?",
      "Un tonneau contient 2 hl d'eau. On retire 60 l. Combien de litres d'eau reste-t-il dans le tonneau ?",
      'Quel nombre faut-il ajouter à 1 075 F pour avoir 1 500 F ?',
      'Je paie une dette de 1 025 F avec un billet de 2 000 F. Combien doit-on me rendre ?',
      'Partage la somme de 5 800 F entre deux personnes. Quelle est la part de chacune d\'elles ?',
      'Le président Marien Ngouabi est né en 1938. Il est mort en 1977. Quelle a été la durée de sa vie ?',
      'Un coureur fait 6 fois le tour d\'une piste de 150 m. Quelle distance parcourt-il ?',
      'Écris le nombre « cent un mille trois » en chiffres et en lettres.',
    ],
    reponses: [
      '300 × 12 = **3 600 F**',
      '1 000 000 − 1 = **999 999**',
      '25 × 16 = **400 F**',
      '2 hl = 200 l ; 200 − 60 = **140 l**',
      '1 500 − 1 075 = **425 F**',
      '2 000 − 1 025 = **975 F**',
      '5 800 : 2 = **2 900 F**',
      '1977 − 1938 = **39 ans**',
      '150 × 6 = **900 m**',
      '**101 003** = **cent un mille trois**',
    ],
  },
  {
    year: 2006, num: 7,
    questions: [
      'Maman dépense 1 625 F pour acheter les poissons et 875 F pour les divers. Combien dépense-t-elle en tout ?',
      'Écris le nombre « cent un mille trois » en chiffres.',
      "D'un fût contenant 2 hl 3 dal d'huile, on retire 1 hl. Combien reste-t-il de litres d'huile dans ce fût ?",
      'Combien de minutes se sont écoulées entre 8 h 40 min et 8 h 57 min ?',
      "J'ai 800 F, ma sœur a le triple. Combien possède-t-elle ?",
      'Quelle est la plus petite fraction entre 4/3 et 4/7 ?',
      "En épreuve orale, j'ai eu 6 en lecture et 8 en rédaction. Quelle moyenne ai-je obtenue ?",
      'Pour se rendre à Brazzaville, on fait une réduction de 5 000 F sur le billet de 40 000 F à monsieur Oko. À combien lui revient le billet ?',
      'Écris en chiffres romains 27.',
      'Combien de dizaines y a-t-il dans 300 billes ?',
    ],
    reponses: [
      '1 625 + 875 = **2 500 F**',
      '**101 003**',
      '2 hl 3 dal = 230 l ; 1 hl = 100 l ; 230 − 100 = **130 l**',
      '8 h 57 − 8 h 40 = **17 min**',
      '800 × 3 = **2 400 F**',
      '**4/7** (même numérateur : la fraction qui a le plus grand dénominateur est la plus petite)',
      '(6 + 8) : 2 = **7**',
      '40 000 − 5 000 = **35 000 F**',
      '27 = 10 + 10 + 5 + 1 + 1 → **XXVII**',
      '300 : 10 = **30 dizaines**',
    ],
  },
  {
    year: 2012, num: 8,
    questions: [
      'Je suis né en 1992. Quel âge ai-je maintenant (en 2012) ?',
      "Combien y a-t-il d'œufs dans 5 douzaines ?",
      "J'achète un poulet à 1 500 F et un manioc à 750 F. Combien ai-je dépensé en tout ?",
      "Un élève quitte chez lui à 6 h 35 min et arrive à l'école à 6 h 50 min. Quelle est la durée de son trajet ?",
      'Combien coûtent 11 boîtes de tomates à raison de 95 F la boîte ?',
      'Un papa partage 1 200 F entre ses 4 enfants. Quelle est la part de chacun ?',
      'Convertis en ares la surface d\'un champ rectangulaire de 1 235 m².',
      'Une parcelle carrée mesure 164 m de périmètre. Trouve son côté.',
      'Combien font 12 × 8 ?',
      'Écris en lettres 235 718.',
    ],
    reponses: [
      '2012 − 1992 = **20 ans**',
      '12 × 5 = **60 œufs**',
      '1 500 + 750 = **2 250 F**',
      '6 h 50 − 6 h 35 = **15 min**',
      '95 × 11 = **1 045 F**',
      '1 200 : 4 = **300 F**',
      '1 a = 100 m² ; 1 235 : 100 = **12,35 a**',
      '164 : 4 = **41 m**',
      '**96**',
      '**deux cent trente-cinq mille sept cent dix-huit**',
    ],
  },
  {
    year: 2015, num: 9,
    questions: [
      'Une ficelle mesure 85 cm. On y ajoute 25 cm. Trouve la nouvelle longueur de cette ficelle.',
      'Un élève est né en 2004. Dis son âge en 2015.',
      'La distance entre Brazzaville et Pointe-Noire est de 515 km. Un train a parcouru 215 km. Trouve la distance qui reste à parcourir.',
      "Un œuf coûte 150 F. Écris le prix d'une douzaine d'œufs.",
      'Une personne achète un poste radio à 5 300 F et une lampe tempête à 3 200 F. Donne la dépense totale.',
      'Mpela a 800 F, sa sœur a le triple de sa somme. Trouve la somme appartenant à sa sœur.',
      'Un fût contient 200 litres de pétrole. Sita en soutire le quart. Trouve le nombre de litres soutirés.',
      "Un repas à la cantine coûte 700 F. Dis le montant que l'élève va payer pour 10 repas.",
      'La maîtresse dicte deux nombres à ses élèves : 459 et 41. Additionne ces nombres.',
      'Mon père partage 5 000 F entre Babéla et Tati. Tati prend 2 800 F. Écris la somme que prend Babéla.',
    ],
    reponses: [
      '85 + 25 = **110 cm** (1,10 m)',
      '2015 − 2004 = **11 ans**',
      '515 − 215 = **300 km**',
      '150 × 12 = **1 800 F**',
      '5 300 + 3 200 = **8 500 F**',
      '800 × 3 = **2 400 F**',
      '200 : 4 = **50 l**',
      '700 × 10 = **7 000 F**',
      '459 + 41 = **500**',
      '5 000 − 2 800 = **2 200 F**',
    ],
  },
  {
    year: 2017, num: 10,
    questions: [
      'Sita a reçu 10 douzaines de crayons. Trouve le nombre de crayons reçus.',
      'Mon père a 50 ans aujourd\'hui (en 2017). Trouve l\'année de sa naissance.',
      'Une classe compte 49 filles et 31 garçons. Calcule l\'effectif total.',
      'Pour payer un livre coûtant 3 500 F, je donne un billet de 5 000 F. Trouve ce qu\'on me rendra.',
      'Papa partage à parts égales 3 800 F entre ses deux enfants. Trouve la part de chaque enfant.',
      "Dans un fût on compte 2 hl d'huile, on soutire 60 litres. Calcule le nombre de litres restant dans le fût.",
      'Un sac de ciment coûte 4 500 F. Calcule le prix de 10 sacs.',
      'Un train parti de Pointe-Noire à 6 h 30 min arrive à Dolisie à 11 heures. Calcule la durée du trajet.',
      'Un sac de foufou pèse 25 kg. Calcule la masse de 4 sacs.',
      'Un terrain carré a 9 m de côté. Calcule son aire.',
    ],
    reponses: [
      '12 × 10 = **120 crayons**',
      '2017 − 50 = **1967**',
      '49 + 31 = **80 élèves**',
      '5 000 − 3 500 = **1 500 F**',
      '3 800 : 2 = **1 900 F**',
      '2 hl = 200 l ; 200 − 60 = **140 l**',
      '4 500 × 10 = **45 000 F**',
      '11 h − 6 h 30 = **4 h 30 min**',
      '25 × 4 = **100 kg**',
      '9 × 9 = **81 m²**',
    ],
  },
]

// ── Questions de cours (pluridisciplinaire) ───────────────────────────────────
// Chaque bloc : [matière, [ [question, réponse], ... ]]
export const questionsDeCours = [
  { year: 2001, blocs: [
    ['Histoire', [
      ['Cite trois compagnies concessionnaires du Moyen-Congo.', "La **Compagnie forestière Sangha-Oubangui (CFSO)**, la **Compagnie commerciale Sangha-Oubangui (CCSO)**, la **Compagnie française du Haut-Congo (CFHC)**. (Le corrigé local cite aussi la CFAO.)"],
      ['Donne la date d\'inauguration du CFCO et sa longueur totale.', "Le Chemin de fer Congo-Océan a été inauguré en **1934** ; il mesure environ **515 km** (de Brazzaville à Pointe-Noire)."],
    ]],
    ['Géographie', [
      ['Quelle est la longueur totale du fleuve Congo ? Où prend-il sa source ?', "Le fleuve Congo mesure environ **4 640 km** (on lit aussi 4 700 km). Il prend sa source en **RDC**, dans la région des **Grands Lacs** / plateau du Katanga."],
      ["Qu'est-ce qu'un pluviomètre ?", "C'est un **appareil qui mesure la quantité d'eau de pluie** tombée en un lieu (par jour, mois ou année)."],
    ]],
    ['SVT', [
      ['Cite les différentes sortes de dents.', "Les **incisives**, les **canines**, les **prémolaires** et les **molaires**."],
      ['Fais la coupe annotée de la dent.', "De l'extérieur vers l'intérieur : **l'émail** (couche dure de la couronne), **l'ivoire** (dentine), **la pulpe** (avec nerfs et vaisseaux sanguins). On distingue aussi **la couronne** (partie visible), **le collet** (au niveau de la gencive) et **la racine** (enfoncée dans l'os de la mâchoire, recouverte de cément). Légende aussi **la gencive** et **l'os maxillaire**."],
    ]],
    ['Initiation à la production', [
      ['De quoi est composé le sol ?', "Le sol est composé d'**argile**, de **calcaire**, de **sable** et d'**humus** (plus de l'eau et de l'air)."],
      ['En quoi consistent la jachère et l\'assolement ?', "**Jachère** : laisser un terrain au repos (sans culture) pendant 1 à 3 ans pour qu'il redevienne fertile. **Assolement** : cultiver des plantes différentes, à tour de rôle, sur un même terrain."],
    ]],
    ['Éducation pour la santé', [
      ['Cite deux parasites de la peau.', "Les **poux** et les **chiques** (aussi : la gale)."],
      ['Comment appelle-t-on le moustique qui transmet le paludisme ?', "L'**anophèle** (femelle)."],
    ]],
  ]},
  { year: 2002, blocs: [
    ['Histoire', [
      ['Quand De Brazza effectua-t-il son deuxième voyage au Congo ?', "En **1879** (deuxième expédition 1879-1882)."],
      ['Cite deux noms d\'explorateurs en Afrique occidentale et en Afrique centrale.', "Afrique occidentale : **René Caillié**, **Mungo Park** (le corrigé cite aussi Charles de Foucauld). Afrique centrale : **Pierre Savorgnan de Brazza**, **Henry Morton Stanley**."],
    ]],
    ['Géographie', [
      ['Cite les grands ensembles du relief du Congo.', "La **plaine côtière**, la **chaîne du Mayombe**, la **vallée du Niari**, le **massif du Chaillu**, les **plateaux des cataractes**, les **plateaux Batéké** et la **cuvette congolaise**."],
      ["Cite deux causes de l'exode rural.", "La **recherche du travail** et le **conflit des générations** (aussi : attrait des loisirs de la ville, manque d'écoles et d'hôpitaux au village)."],
    ]],
    ['SVT', [
      ['Donne les étapes des métamorphoses complètes de la chenille.', "**Œuf → chenille (larve) → chrysalide (nymphe) → papillon (adulte)**.\n> Remarque : le corrigé local écrit « œuf, larve, chenille, papillon », mais la chenille *est* la larve et il oublie la chrysalide."],
      ['Nomme les accidents des articulations.', "L'**entorse** (ou foulure) et la **luxation**."],
    ]],
    ['Initiation à la production', [
      ['Donne la composition physique du sol.', "**Sable, argile, calcaire et humus** (avec de l'eau et de l'air)."],
      ['Comment rendre un sol riche et fertile ?', "En lui **apportant des engrais** (fumier, compost, engrais chimiques), en pratiquant la **jachère** et l'**assolement**."],
    ]],
    ['Éducation pour la santé', [
      ['Quels sont les dangers qui peuvent provenir du séchage et de la cuisson des aliments ?', "**Séchage** : les aliments exposés attirent les **mouches**, qui transmettent des maladies. **Cuisson** : un aliment cuit mal conservé se **décompose**, pourrit et donne des asticots (intoxication alimentaire)."],
    ]],
  ]},
  { year: 2003, blocs: [
    ['Histoire', [
      ['Par qui et quand fut fondée la ville de Brazzaville ?', "Par **Pierre Savorgnan de Brazza**, le **3 octobre 1880**."],
      ["Quels sont les pays qui composaient l'A.E.F. ?", "Le **Moyen-Congo** (Congo), le **Gabon**, l'**Oubangui-Chari** (Centrafrique) et le **Tchad**."],
    ]],
    ['Géographie', [
      ['Cite les produits agricoles exportés par le Congo.', "Le **cacao** et le **café** (aussi : le sucre, l'huile de palme)."],
      ['Quel est le débit moyen du fleuve Congo ?', "Environ **41 000 m³/s**."],
    ]],
    ['SVT', [
      ['Quelle est la différence entre une combustion vive et une combustion lente ?', "La **combustion vive** produit une **flamme et de la lumière** (et beaucoup de chaleur) ; la **combustion lente** ne produit **ni flamme ni lumière** (ex. : la rouille, la respiration)."],
      ['Donne deux maladies provoquées par un virus.', "Le **sida** et la **grippe** (aussi : la rougeole, la poliomyélite)."],
    ]],
    ['Éducation pour la santé', [
      ['Que signifie M.S.T. ?', "**Maladie sexuellement transmissible**."],
      ['Quelle est la technique qui permet de transformer une eau sale en eau propre ?', "La **filtration** (le filtrage) ; on peut ensuite faire **bouillir** l'eau pour la rendre potable."],
    ]],
    ['Initiation à la production', [
      ['Quel est le rôle de la feuille dans une plante ?', "La feuille **fabrique la nourriture** de la plante grâce à la **chlorophylle** et à la lumière ; elle permet aussi la **respiration** et la **transpiration** de la plante."],
      ["Donne les conditions d'une bonne pépinière.", "Une **terre riche et meuble**, une pépinière **humide et ombragée**, **protégée** des vents, des insectes et des animaux, près d'un point d'eau."],
    ]],
  ]},
  { year: 2004, blocs: [
    ['Histoire', [
      ['Quand et par qui fut abolie la traite négrière ?', "Réponse attendue au CEPE : par le Français **Victor Schœlcher**, le **27 avril 1848**.\n> Précision : en 1848, Schœlcher fait abolir l'**esclavage** dans les colonies françaises ; la traite elle-même avait été interdite plus tôt (1815-1831)."],
      ['Donne les dates de début et de fin des travaux du CFCO.', "De **1921** à **1934**."],
    ]],
    ['Géographie', [
      ['Quelle est la superficie du Congo ?', "**342 000 km²**."],
      ['Réalise la carte des divisions administratives.', "À la date de ce sujet, le Congo comptait **12 départements** : Kouilou, Niari, Lékoumou, Bouenza, Pool, Plateaux, Cuvette, Cuvette-Ouest, Sangha, Likouala, et les communes-départements de **Brazzaville** et **Pointe-Noire**. Sur la carte : place chaque département, son chef-lieu (ex. Dolisie pour le Niari, Djambala pour les Plateaux, Ewo pour la Cuvette-Ouest, Owando pour la Cuvette, Ouesso pour la Sangha, Impfondo pour la Likouala, Kinkala pour le Pool, Madingou pour la Bouenza, Sibiti pour la Lékoumou), un titre, une légende et l'orientation (Nord)."],
    ]],
    ['Initiation à la production', [
      ["Donne les conditions d'une bonne germination.", "Une **graine saine** et pas trop vieille (plantule vivante), de l'**eau**, de l'**air** et de la **chaleur**, et un semis à bonne profondeur."],
      ['En quoi consistent le binage et le sarclage ?', "**Binage** : remuer (ameublir) la terre au pied des plantes. **Sarclage** : enlever les mauvaises herbes."],
    ]],
    ['Éducation pour la santé', [
      ["Donne les conditions d'une bonne digestion.", "**Bien mâcher** les aliments, manger à heures régulières sans excès, **boire assez d'eau**, **se reposer** après le repas, avoir des dents propres."],
      ['Donne la différence entre le sérum et le vaccin.', "Le **sérum** est **curatif** : il soigne une maladie déjà déclarée, action rapide mais courte (ex. sérum antitétanique). Le **vaccin** est **préventif** : il protège avant la maladie, action lente mais durable (ex. BCG)."],
    ]],
    ['ECMP', [
      ['Quelle est la forme du drapeau congolais et quelles sont les couleurs qui le constituent ?', "Il est **rectangulaire**, partagé en **diagonale** en trois couleurs : **vert, jaune, rouge**."],
    ]],
  ]},
  { year: 2006, blocs: [
    ['Histoire', [
      ['Quels sont les premiers partis politiques qui ont vu le jour au Congo ?', "Le **PPC** (Parti progressiste congolais) de Jean-Félix Tchicaya, le **MSA** (Mouvement socialiste africain) de Jacques Opangault et l'**UDDIA** (Union démocratique de défense des intérêts africains) de l'abbé Fulbert Youlou."],
      ["Quand et par qui fut aboli l'esclavage ?", "Par le Français **Victor Schœlcher**, le **27 avril 1848**."],
    ]],
    ['Géographie', [
      ['Quelle différence y a-t-il entre une culture vivrière et une culture industrielle ?', "La **culture vivrière** sert à nourrir la population et se consomme **sans transformation** (manioc, banane…). La **culture industrielle** est **transformée en usine** avant d'être consommée ou vendue (canne à sucre, café, cacao, palmier à huile…)."],
    ]],
    ['Sciences et technologie', [
      ['Donne les dangers du courant électrique.', "L'**électrocution** (et les brûlures) et le **court-circuit** (qui peut provoquer un incendie)."],
      ['Au cours de la respiration, quel gaz absorbons-nous et quel gaz rejetons-nous ?', "Nous absorbons l'**oxygène** et rejetons le **gaz carbonique**."],
    ]],
    ['Initiation à la production', [
      ['Quelles sont les différentes sortes de semis ?', "Le semis **à la volée**, **en lignes**, **en poquets** et **en pots**."],
      ['La graine de maïs a deux cotylédons : vrai ou faux ?', "**Faux** : le maïs est une **monocotylédone** (un seul cotylédon)."],
    ]],
    ['Éducation pour la santé', [
      ["Donne les méfaits de l'alcool.", "Il **affaiblit l'organisme** (foie, cerveau), fait **perdre le contrôle de soi** (violences, accidents), rend impoli et entraîne un **déséquilibre financier** dans la famille."],
      ['Quelle est la différence entre un microbe et un virus ?', "Le **microbe** (bactérie) est un être vivant très petit, visible au **microscope ordinaire**, souvent combattu par les antibiotiques. Le **virus** est encore beaucoup plus petit, visible seulement au **microscope électronique**, et les antibiotiques n'agissent pas sur lui."],
    ]],
    ['Éducation civique', [
      ['Relie ce qui va ensemble : Sénat / Assemblée nationale / Gouvernement — Ministre / Sénateur / Député.', "**Sénat → Sénateur** ; **Assemblée nationale → Député** ; **Gouvernement → Ministre**."],
    ]],
  ]},
  { year: 2007, blocs: [
    ['Histoire', [
      ['Donne deux explorateurs en Afrique centrale.', "**Pierre Savorgnan de Brazza** et **Henry Morton Stanley**."],
      ['Que te rappelle la date du 10 septembre 1880 ?', "La **signature du traité entre Pierre Savorgnan de Brazza et le roi Makoko**."],
    ]],
    ['Géographie', [
      ['Que signifie C.E.M.A.C. ?', "**Communauté économique et monétaire de l'Afrique centrale**."],
      ['Quelle est la longueur totale du fleuve Congo ?', "Environ **4 640 km** (on lit aussi 4 700 km)."],
    ]],
    ['SVT', [
      ['Cite les différents nerfs.', "Les **nerfs sensitifs**, les **nerfs moteurs** et les **nerfs mixtes**."],
      ["De quoi est constitué l'appareil circulatoire ?", "Du **cœur** et des **vaisseaux sanguins** (artères, veines, capillaires) dans lesquels circule le sang."],
    ]],
    ['Physique-chimie', [
      ['Quels sont les différents états de la matière ?', "**Solide**, **liquide** et **gazeux**."],
      ["Qu'est-ce qu'une combustion vive ?", "C'est une combustion qui produit une **flamme**, de la **lumière** et beaucoup de chaleur."],
    ]],
    ['Initiation à la production', [
      ['Quelles sont les différentes opérations culturales ?', "Le **débroussaillement**, le **labour**, le **semis**, le **binage**, le **sarclage**, l'**arrosage** et la **récolte**."],
      ["En quoi consiste l'amélioration du sol ?", "À **rendre le sol favorable aux cultures** avant de le cultiver : apport d'engrais (fumier, compost), labour, jachère, assolement."],
    ]],
    ['Éducation pour la santé', [
      ["Quel est l'insecte qui cause la maladie du sommeil ?", "La **mouche tsé-tsé** (glossine), qui transmet le trypanosome."],
      ['En quoi consiste la démoustication ?', "À **détruire les moustiques** et leurs larves (insecticides, suppression des eaux stagnantes)."],
    ]],
  ]},
  { year: 2008, blocs: [
    ['Histoire', [
      ["Tu as étudié en classe l'ONU et la CEMAC. Définis-les.", "**ONU** : Organisation des Nations unies (créée en 1945 pour maintenir la paix dans le monde). **CEMAC** : Communauté économique et monétaire de l'Afrique centrale (regroupe le Congo, le Gabon, le Cameroun, la Centrafrique, le Tchad et la Guinée équatoriale)."],
      ['Que te rappelle la date du 3 octobre 1880 ?', "La **fondation de Brazzaville** par Pierre Savorgnan de Brazza."],
    ]],
    ['Géographie', [
      ['Donne deux rôles joués par le port de Pointe-Noire.', "L'**importation** et l'**exportation** des marchandises (pétrole, bois…), y compris pour les pays voisins sans accès à la mer."],
      ["Où passe l'équateur au Congo ?", "Par **Makoua** (département de la Cuvette)."],
    ]],
    ['SVT', [
      ['Donne deux vertébrés qui nourrissent leurs petits au lait.', "Par exemple le **chien** et le **chat** (les mammifères : vache, chèvre…)."],
      ['Donne la différence entre la grande circulation et la petite circulation.', "La **petite circulation** va du cœur aux **poumons** et revient au cœur. La **grande circulation** va du cœur vers **tous les organes** du corps et revient au cœur."],
    ]],
    ['Sciences physiques', [
      ["Qu'est-ce qu'une force ?", "C'est **toute cause capable de mettre un corps en mouvement**, de modifier son mouvement ou de le déformer."],
    ]],
    ['Éducation pour la santé', [
      ['Comment faut-il assurer une bonne digestion ?', "**Bien mâcher** les aliments, **boire assez d'eau**, manger à heures régulières et **se reposer** après le repas."],
      ['Vrai ou faux : le tabac est un excitant.', "**Vrai** (la nicotine est un excitant)."],
    ]],
    ['Éducation à la vie familiale', [
      ['Vrai ou faux : la sous-alimentation et la suralimentation sont des mauvaises habitudes alimentaires.', "**Vrai**."],
    ]],
  ]},
  { year: 2009, blocs: [
    ['Histoire', [
      ['Que te rappelle le nom de Pierre Savorgnan de Brazza ?', "C'est l'**explorateur français d'origine italienne** qui a exploré le Congo, signé le traité avec le roi Makoko (1880) et **fondé Brazzaville**."],
      ["Quels sont les pays qui formaient l'AEF ?", "Le **Congo** (Moyen-Congo), le **Gabon**, le **Tchad** et l'**Oubangui-Chari** (Centrafrique)."],
    ]],
    ['Géographie', [
      ['Quel est le débit moyen du fleuve Congo ?', "Environ **41 000 m³/s**."],
      ['Quels sont les produits qui sont exploités par le Congo ?', "Produits agricoles : **cacao**, **café** ; on cite aussi le **pétrole** et le **bois**."],
    ]],
    ['SVT', [
      ["Donne la formule dentaire d'un homme adulte.", "Par demi-mâchoire : **2 incisives, 1 canine, 2 prémolaires, 3 molaires** ; soit par mâchoire 4 I + 2 C + 4 PM + 6 M, et **32 dents** au total."],
      ['Cite deux maladies provoquées par un virus.', "Le **sida** et la **poliomyélite** (aussi : grippe, rougeole)."],
    ]],
    ['Éducation pour la santé', [
      ["Quel est l'élément fondamental de l'hygiène ?", "La **propreté**."],
      ['Donne une technique qui permet de transformer une eau sale en eau claire.', "La **filtration** (le filtrage)."],
    ]],
    ['Éducation à la production', [
      ["Quelles sont les conditions d'une bonne germination ?", "Une **graine saine** et vivante, de l'**eau**, de l'**air** et de la **chaleur**."],
      ['En quoi consiste la jachère ?', "À **laisser un terrain sans culture** pendant 1 à 3 ans pour qu'il redevienne fertile."],
    ]],
  ]},
  { year: 2010, blocs: [
    ['Histoire', [
      ['Cite deux compagnies concessionnaires créées au Moyen-Congo.', "La **CCSO** (Compagnie commerciale Sangha-Oubangui) et la **CFSO** (Compagnie forestière Sangha-Oubangui). Le corrigé local cite aussi la CFAO."],
      ['Quelle est la date de proclamation de la République du Congo ?', "Le **28 novembre 1958**."],
    ]],
    ['Géographie', [
      ['Indique les chefs-lieux des départements des Plateaux et du Niari.', "Plateaux : **Djambala** ; Niari : **Dolisie**."],
      ['Quelle est la raison qui fait de Pointe-Noire un port maritime important ?', "C'est la **seule ouverture du Congo sur la mer** : toutes les **importations et exportations** de marchandises (pétrole, bois…) y passent, et elle est reliée à Brazzaville par le CFCO."],
    ]],
    ['Sciences et technologie', [
      ['Cite deux sortes de dents et leurs rôles.', "Les **incisives** servent à **couper** ; les **canines** à **déchirer** ; (les **molaires** à **broyer**)."],
      ['Parmi ces élevages, quel est celui des abeilles ? (apiculture ; pisciculture ; agriculture)', "L'**apiculture**."],
    ]],
    ['Éducation pour la santé', [
      ["En quoi consiste l'automédication ?", "À **prendre des médicaments sans l'avis d'un médecin**."],
      ["Qu'est-ce qui consiste à détruire les moustiques ?", "La **démoustication**."],
    ]],
    ['Initiation à la production', [
      ['Classe les produits suivants dans leurs domaines de production : arachide, chien, chocolat, chaise, maïs.', "**Production végétale** : arachide, maïs. **Production animale** : chien. **Production agro-alimentaire** (transformation) : chocolat. **Production artisanale** : chaise."],
    ]],
  ]},
  { year: 2011, blocs: [
    ['Histoire', [
      ['Donne la date de la signature du traité entre Pierre Savorgnan de Brazza et le roi Makoko.', "Le **10 septembre 1880**."],
      ["Cite deux explorateurs de l'Afrique centrale.", "**Pierre Savorgnan de Brazza** et **Henry Morton Stanley**."],
    ]],
    ['Géographie', [
      ['Sur un fond de carte, place les différents types de climat du Congo.', "**Climat équatorial** au **nord** (Sangha, Likouala, Cuvette) ; **climat subéquatorial** au **centre** (Plateaux, Pool) ; **climat tropical humide** au **sud** (Kouilou, Niari, Bouenza, Lékoumou). N'oublie pas le titre, la légende et l'orientation."],
    ]],
    ['SVT', [
      ['Définis une circulation.', "La **circulation sanguine** est le **mouvement du sang** dans le corps, poussé par le cœur à travers les vaisseaux. (Le corrigé local répond pour l'**articulation** : c'est le mode d'union de deux os.)"],
      ['Cite deux déformations de la colonne vertébrale.', "La **scoliose** et la **lordose** (aussi : la cyphose)."],
    ]],
    ['Initiation à la production', [
      ["L'apiculture est l'élevage des abeilles. Vrai ou faux ?", "**Vrai**."],
      ["Donne deux conditions d'une bonne pépinière.", "Elle doit être **constamment humide** et **ombragée** (aussi : terre riche et meuble, protégée des animaux)."],
    ]],
    ['Éducation pour la santé', [
      ['Cite une technique qui permet de transformer une eau sale en eau potable.', "Le **filtrage** puis l'**ébullition** (faire bouillir l'eau)."],
      ["Cite deux dangers de l'automédication.", "Le **surdosage** (intoxication) et le **sous-dosage** (la maladie n'est pas guérie et s'aggrave)."],
    ]],
  ]},
  { year: 2012, blocs: [
    ['Histoire', [
      ["Nomme l'événement relatif à la date du 28 novembre 1958.", "La **proclamation de la République du Congo**."],
      ['Victor Schœlcher est l\'homme qui a aboli la traite négrière. Vrai ou faux ?', "Réponse attendue : **Vrai**.\n> Précision : Schœlcher a fait abolir l'**esclavage** en 1848 ; la traite avait été interdite plus tôt."],
    ]],
    ['Géographie', [
      ['La superficie du Congo est : 432 000 km² / 243 000 km² / 342 000 km².', "**342 000 km²**."],
      ['Le Congo est un pays de la CEMAC. Vrai ou faux ?', "**Vrai**."],
    ]],
    ['SVT', [
      ['Donne la différence entre une veine et une artère.', "L'**artère** conduit le sang **du cœur vers les organes** ; la **veine** ramène le sang **des organes vers le cœur**."],
      ['Cite deux dangers liés au courant électrique.', "L'**électrocution** et le **court-circuit**."],
    ]],
    ['Initiation à la production', [
      ["Nomme les différentes parties d'une plante.", "La **racine**, la **tige**, les **feuilles** (et, chez beaucoup de plantes, les fleurs et les fruits)."],
      ["La jachère consiste à apporter de l'eau dans un terrain trop sec. Vrai ou faux ?", "**Faux** : la jachère consiste à laisser un terrain au repos ; apporter de l'eau, c'est l'**irrigation** (l'arrosage)."],
    ]],
    ['Éducation pour la santé', [
      ['Parmi ces conseils pour éviter le paludisme, choisis les bonnes réponses : se laver chaque matin / dormir sous une moustiquaire imprégnée / manger la banane / enterrer les boîtes vides.', "**Dormir sous une moustiquaire imprégnée** et **enterrer les boîtes vides** (qui gardent l'eau où pondent les moustiques)."],
      ['Cite deux modes de transmission du sida.', "Les **rapports sexuels non protégés** et le **sang contaminé** (transfusion, objets tranchants souillés) ; aussi de la mère à l'enfant."],
    ]],
  ]},
  { year: 2015, blocs: [
    ['Histoire', [
      ['Le 10 juin 1991 marque la fin de la Conférence nationale souveraine en République du Congo. Vrai ou faux ?', "**Vrai**."],
      ['Cite deux noms de héros ayant résisté à la pénétration coloniale au Congo.', "**Mabiala Ma Nganga** et **Bouéta Mbongo**."],
    ]],
    ['Géographie', [
      ['Dans quelle partie du Congo trouve-t-on le climat équatorial ?', "Au **nord** du pays."],
      ['La superficie du Congo est de : 340 000 km² / 342 000 km² / 243 000 km².', "**342 000 km²**."],
    ]],
    ['SVT', [
      ["Donne la formule dentaire d'un adulte.", "Par demi-mâchoire **2 I, 1 C, 2 PM, 3 M** ; par mâchoire 4 I + 2 C + 4 PM + 6 M ; **32 dents** en tout."],
    ]],
    ['Initiation à la production', [
      ['Parmi pisciculture / apiculture / aviculture, choisis celui des abeilles.', "L'**apiculture**."],
      ["Un maraîcher constate que son jardin de choux est trop sec : quelle opération doit-il effectuer ?", "L'**arrosage** (l'**irrigation**)."],
    ]],
    ['Éducation pour la santé', [
      ['La consommation du tabac ruine la santé. Vrai ou faux ?', "**Vrai**."],
    ]],
    ['ECMP', [
      ['La République du Congo a trois symboles. Cite-en deux.', "Le **drapeau** (vert, jaune, rouge) et l'**hymne national** (*La Congolaise*) ; le troisième est la **devise** (*Unité – Travail – Progrès*)."],
    ]],
  ]},
  { year: 2017, blocs: [
    ['Histoire', [
      ["Écris l'année du début et celle de la fin de la deuxième guerre mondiale.", "De **1939** à **1945**."],
      ['Définis le sigle O.N.U.', "**Organisation des Nations unies**."],
    ]],
    ['Géographie', [
      ['Nomme le chef-lieu du département de la Cuvette-Ouest.', "**Ewo**."],
      ['Cite deux affluents du Congo que tu connais.', "L'**Oubangui** et la **Sangha** (aussi : l'Alima, la Likouala-Mossaka)."],
    ]],
    ['Sciences et technologie', [
      ['Définis la combustion vive.', "C'est une combustion qui produit une **flamme** et de la **lumière**."],
      ['Le poisson respire par les poumons / par les branchies / par la peau.', "Par les **branchies**."],
    ]],
    ['Initiation à la production', [
      ['Cite deux éléments qui composent le sol.', "Le **sable** et l'**humus** (aussi : l'argile, le calcaire)."],
      ['Dis ce qui favorise la croissance de la plante.', "L'**eau**, la **lumière**, la **chaleur** et les **sels minéraux** du sol ; c'est la **feuille** qui fabrique la nourriture de la plante (réponse du corrigé local)."],
    ]],
    ['ECMP', [
      ['Donne deux exemples de cas de solidarité.', "L'**entraide** entre voisins (aider à construire une maison, aux travaux des champs) ; **assister une famille en deuil** ou des sinistrés."],
      ['Parmi « faire la fête / manipuler les armes de guerre / jouer avec la bouteille de gaz / boire l\'eau potable », relève deux comportements dangereux.', "**Manipuler les armes de guerre** et **jouer avec la bouteille de gaz**."],
    ]],
  ]},
]

export function buildCepeChapters() {
  return {
    dictees: dictees.map((d) => ({
      title: d.title,
      statement: `> ${d.texte.replace(/\n/g, '\n> ')}\n\n**Questions**\n\n${q(d.questions)}`,
      solution: d.corrige,
    })),
    calcul: calculRapide.map((s) => ({
      title: `CEPE ${s.year} — Calcul rapide (sujet n°${s.num})`,
      statement: `Réponds à chaque question en écrivant l'opération puis le résultat.\n\n${q(s.questions)}`,
      solution: s.reponses.map((r, i) => `**${i + 1}.** ${r}`).join('\n\n'),
    })),
    questionsDeCours: questionsDeCours.map((s) => {
      let n = 0
      const statement = s.blocs.map(([mat, qs]) => `**${mat}**\n${qs.map(([qq]) => `${++n}. ${qq}`).join('\n')}`).join('\n\n')
      n = 0
      const solution = s.blocs.map(([mat, qs]) => `### ${mat}\n\n${qs.map(([, r]) => `**${++n}.** ${r}`).join('\n\n')}`).join('\n\n')
      return { title: `CEPE ${s.year} — Questions de cours`, statement, solution }
    }),
  }
}
