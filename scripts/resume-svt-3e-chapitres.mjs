/**
 * Remplace le contenu (full verbatim + longues séries d'exercices) des 8
 * chapitres SVT 3e conservés par un résumé intelligent : définitions clés,
 * mécanismes, données chiffrées essentielles, structuré clairement — sans
 * les dizaines d'exercices qui alourdissaient le cours. Les figures déjà
 * uploadées (course-images/svt-3e-figures/) sont réutilisées telles quelles.
 *
 * "Génétique" n'est pas dans cette liste : c'est toujours l'ancien
 * placeholder (le fascicule sénégalais ne couvrait pas ce sujet) — il a
 * besoin d'une vraie source de contenu, pas d'un résumé.
 *
 * Usage : node scripts/resume-svt-3e-chapitres.mjs [--dry-run]
 */
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DRY_RUN = process.argv.includes('--dry-run')

const env = Object.fromEntries(
  readFileSync(join(__dirname, '..', 'apps', 'web', '.env.local'), 'utf-8')
    .split('\n').filter((l) => l.includes('=') && !l.startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] })
)
const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY

async function sb(path, init) {
  const res = await fetch(`${SUPABASE_URL}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', apikey: SERVICE_ROLE_KEY, Authorization: `Bearer ${SERVICE_ROLE_KEY}`, Prefer: 'return=representation', ...(init?.headers ?? {}) },
  })
  const text = await res.text()
  const json = text ? JSON.parse(text) : null
  if (!res.ok) throw new Error(`${init?.method ?? 'GET'} ${path} -> HTTP ${res.status}: ${JSON.stringify(json)}`)
  return json
}

const IMG = 'https://evtqdztycnttegzoleqb.supabase.co/storage/v1/object/public/course-images/svt-3e-figures'

const SUMMARIES = {
  'La tectonique des plaques': `### Introduction
La surface de la Terre se déplace très lentement : elle est formée d'une mosaïque de plaques rigides (la lithosphère) qui bougent les unes par rapport aux autres.

### 1. Zones actives et zones stables
Les séismes et volcans ne sont pas répartis au hasard : ils se concentrent aux **frontières** entre plaques (**zones actives**), tandis que l'intérieur des plaques est **stable** (peu ou pas de séismes/volcans).

![Répartition des séismes et des volcans](${IMG}/p118_499.jpeg)

Une **plaque lithosphérique** est une portion rigide et stable de la lithosphère (partie continentale et/ou océanique), délimitée par ces zones actives. Exemples : plaques Africaine, Eurasiatique, Nord-américaine, Pacifique...

### 2. Les trois types de frontières de plaques
**a) Divergence (zones d'écartement / dorsales océaniques)** — les plaques s'éloignent ; le magma remonte et se refroidit, créant une nouvelle croûte océanique (**accrétion**). Au centre se trouve un fossé d'effondrement, le **rift**.

**b) Convergence (zones d'affrontement)** — deux cas :
- **Subduction** : la plaque la plus dense (souvent océanique) s'enfonce sous l'autre, entraînant volcanisme explosif et, à terme, la fermeture d'un océan.
- **Collision** (deux plaques continentales) : très sismique, peu/pas de volcanisme, formation de chaînes de montagnes (ex. l'Himalaya = collision Inde/Eurasie ; les Alpes = collision Afrique/Europe).

**c) Coulissage** — les plaques glissent latéralement le long de failles transformantes (séismes superficiels puissants, pas de volcanisme).

![Mobilité des plaques](${IMG}/p120_506.jpeg)

### 3. Le moteur : les courants de convection
La désintégration radioactive d'éléments comme l'uranium libère de la chaleur au centre de la Terre. La matière chaude du manteau remonte, se refroidit puis redescend : ce sont les **courants de convection**, moteur du déplacement des plaques.

### 4. Conséquences de la mobilité des plaques
- **Dérive des continents** (théorie de Wegener, 1915) : tous les continents actuels formaient un supercontinent unique, la **Pangée** (nord : Laurasie : sud : Gondwana), qui s'est fragmenté. Preuves : complémentarité des côtes Afrique/Amérique du Sud, mêmes fossiles et structures géologiques de part et d'autre de l'Atlantique, traces de glaciation alignées.
- **Formation de chaînes de montagnes** par collision.
- **Déformations des terrains** :
  - **Plis** : synclinal (concavité vers le haut) ou anticlinal (concavité vers le bas).
  - **Failles** : normale (extension, allongement), inverse (compression, raccourcissement), décrochante (mouvement horizontal).

![Plis et failles](${IMG}/p124_517.jpeg)

### À retenir
- Plaque = portion rigide de lithosphère limitée par des zones actives (sismiques/volcaniques)
- 3 frontières : divergence (dorsale, accrétion) / convergence (subduction ou collision) / coulissage (failles transformantes)
- Moteur : courants de convection du manteau
- Conséquences : dérive des continents (Wegener), chaînes de montagnes, plis et failles`,

  "La respiration chez l'espèce humaine": `### Introduction
La respiration est l'entrée et la sortie d'air dans les poumons, permettant des échanges gazeux entre l'air, les poumons et le sang.

### 1. Anatomie de l'appareil respiratoire
- **Voies respiratoires** : fosses nasales → pharynx (carrefour aéro-digestif) → larynx → trachée artère → bronches (2) → bronchioles → alvéoles pulmonaires (richement vascularisées par des capillaires).
- **Poumons** (droit et gauche), reliés à la cage thoracique par la **plèvre**.
- **Muscles respiratoires** : diaphragme et muscles intercostaux — le « moteur » de la respiration.

![Anatomie de l'appareil respiratoire](${IMG}/p030_187.jpeg)

### 2. La ventilation pulmonaire
Un mouvement respiratoire comprend deux phases :
- **Inspiration** (phénomène **actif**) : le diaphragme s'abaisse, les muscles intercostaux se contractent → la cage thoracique et les poumons augmentent de volume → l'air riche en O₂ entre.
- **Expiration** (phénomène **passif**) : relâchement → diminution du volume → l'air riche en CO₂ sort.

Fréquence respiratoire : **15 à 16 mouvements/min** chez l'adulte (augmente à l'effort, diminue au sommeil).

**Volumes respiratoires** : volume courant (VC ≈ 0,5 L), volume de réserve inspiratoire (VRI ≈ 2,5 L), volume de réserve expiratoire (VRE ≈ 1,2 L), volume résiduel (VR). Capacité vitale = VRI + VRE + VC.

### 3. Les échanges gazeux air ↔ poumons ↔ sang
| | Air inspiré | Air expiré |
|---|---|---|
| Dioxygène | 21 cm³ | 16 cm³ |
| Dioxyde de carbone | 0,02 cm³ | 4,5 cm³ |
| Azote | 79 cm³ | 79 cm³ (inchangé) |

Au niveau des **alvéoles** (grande surface d'échange ≈ 200 m², paroi très fine, forte irrigation sanguine) : le sang cède du CO₂ et se charge en O₂. Le sang entrant dans les poumons est rouge sombre (riche en CO₂), il en ressort rouge vif (riche en O₂).

### 4. Le transport des gaz respiratoires
- **O₂** : 98% se combine à l'hémoglobine → **oxyhémoglobine** (HbO₂) ; 2% dissous dans le plasma.
- **CO₂** : 25% se combine à l'hémoglobine → carbaminohémoglobine ; 75% dissous dans le plasma.

### 5. Tabac et pollution
Le **monoxyde de carbone** du tabac se lie fortement à l'hémoglobine et bloque son activité, réduisant l'oxygène disponible pour les organes. La pollution atmosphérique cause diverses maladies respiratoires. Pour un appareil respiratoire sain : respirer par le nez, faire de l'exercice, éviter de fumer.

### À retenir
- Inspiration = active (entrée O₂) ; Expiration = passive (sortie CO₂)
- Échanges gazeux alvéoles ↔ sang : O₂ entre dans le sang, CO₂ en sort
- O₂ transporté à 98% par l'hémoglobine (oxyhémoglobine)
- Le monoxyde de carbone du tabac empoisonne le transport d'O₂`,

  "Le rôle du rein dans l'excrétion urinaire et la régulation du milieu intérieur": `### Introduction
Le métabolisme produit des déchets toxiques que l'organisme doit éliminer : c'est le rôle du **rein**.

### 1. L'appareil urinaire
Reins (en forme de haricot, sous le diaphragme) → uretères → vessie (réservoir) → urètre (évacuation).
Le rein comprend 3 zones : corticale (externe, riche en vaisseaux), médullaire/pyramidale (les **néphrons**), et interne (bassinet).

![Anatomie du rein](${IMG}/p068_329.jpeg)

### 2. Le rôle du rein (comparaison plasma / urine)
| Constituant | Plasma (g/L) | Urine (g/L) |
|---|---|---|
| Glucose, protides, lipides | présents | **absents** (0) |
| Urée | 0,3 | 20 à 30 |
| Sels minéraux, acide urique | présents | concentration plus élevée |
| Ammoniaque | 0 | 0,5 |

→ Le rein est une **barrière** (retient glucose/protides/lipides), un **filtre sélectif** (concentre urée/sels/acide urique) et un **organe sécréteur** (produit l'ammoniaque).

### 3. Le néphron et la formation de l'urine
Chaque néphron = glomérule (corpuscule de Bowman) + tubule (tube contourné proximal → anse de Henle → tube contourné distal → canal collecteur). Le rein reçoit **20% du débit sanguin**.

Trois étapes :
1. **Filtration** (dans le glomérule) : le plasma est filtré, les grosses molécules (protéines, lipides, cellules) sont retenues → **urine primitive**.
2. **Réabsorption** (tubes contournés) : retour au sang de l'eau, du glucose (réabsorption totale) et des sels minéraux (réabsorption partielle) → **urine définitive**.
3. **Sécrétion** : certaines substances (acide hippurique, ammoniac) sont ajoutées par les cellules tubulaires.

![Étapes de la formation de l'urine](${IMG}/p070_337.jpeg)

### 4. Rôle dans la régulation du milieu intérieur
Le rein élimine l'excès d'eau et de sels minéraux au-delà d'un **seuil d'élimination** (ex. glucose : 1,7 g/L, au-delà duquel il apparaît dans l'urine des diabétiques). Il élimine aussi les déchets toxiques (urée, acide urique). D'autres organes y participent : poumons (CO₂, eau), peau (eau, sels, urée), foie (détoxification, réserve de glycogène).

### 5. Anomalies rénales
- **Glycosurie** : sucre dans l'urine (diabète).
- **Albuminurie** : protéines dans l'urine (insuffisance rénale, glomérule défaillant).
- **Calculs urinaires** : cristaux bloquant les voies urinaires.
- **Goutte** : accumulation d'acide urique mal éliminé dans les articulations.

### À retenir
- Rein = barrière + filtre sélectif + organe sécréteur
- Formation de l'urine : filtration → réabsorption → sécrétion
- Rôle central dans l'équilibre du milieu intérieur (élimination des déchets, régulation eau/sels)`,

  "L'immunité et la réponse immunitaire": `### Introduction
Face aux microorganismes qui franchissent nos barrières naturelles, l'organisme déploie une **réponse immunitaire**.

### 1. La réponse immunitaire non spécifique
Après une blessure, l'invasion microbienne déclenche une **réaction inflammatoire** (rougeur, chaleur, gonflement, douleur), qui attire les **macrophages**.

**La phagocytose** (4 étapes) : adhésion → absorption (le phagocyte entoure le microbe) → digestion (enzymes) → élimination des résidus. Cette réponse est **non spécifique** : elle agit contre tout microbe.

![Phagocytose](${IMG}/p080_363.jpeg)

### 2. La réponse immunitaire spécifique
Un **antigène** est une molécule étrangère qui déclenche la production d'**anticorps** spécifiques.

**Réponse primaire** (1er contact) : lente, faible production d'anticorps, peu durable (< 50 jours) — simple « sensibilisation ».
**Réponse secondaire** (2e contact, même antigène) : rapide, production massive et durable, grâce aux **cellules mémoires** formées lors du 1er contact → **mémoire immunitaire**.

**Spécificité** : des anticorps anti-tétaniques protègent contre le tétanos mais pas contre la diphtérie — un anticorps n'est efficace que contre l'antigène qui a provoqué sa formation.

### 3. L'immunité
Capacité de l'organisme à se défendre contre des substances/cellules étrangères. On distingue l'**immunité innée** (naturelle) et l'**immunité acquise**.

### À retenir
- Réponse non spécifique : inflammation + phagocytose (contre tout microbe)
- Réponse spécifique : anticorps ciblant un antigène précis
- Réponse secondaire > réponse primaire grâce aux cellules mémoires (base de la vaccination)`,

  'Le système immunitaire': `### Introduction
Les réactions de défense immunitaire mobilisent un ensemble d'organes et de cellules : le **système immunitaire**.

### 1. Les organes lymphoïdes
**Organes primaires (centraux)** :
- **Moelle osseuse** : formation de toutes les cellules immunitaires ; maturation des lymphocytes B.
- **Thymus** : maturation des lymphocytes T (T = thymodépendants).

**Organes secondaires (périphériques)** — lieux de rencontre antigènes/cellules immunitaires : amygdales, rate, ganglions lymphatiques, MALT (tissus lymphoïdes des muqueuses).

![Organes du système immunitaire](${IMG}/p090_409.jpeg)

### 2. Les cellules du système immunitaire (leucocytes)
Trois grandes catégories :
1. **Granulocytes** (polynucléaires) : noyau segmenté, cytoplasme granuleux.
2. **Monocytes / macrophages** : gros leucocytes, deviennent des cellules phagocytaires dans les tissus.
3. **Lymphocytes** : petites cellules à noyau rond ; deux familles — **lymphocytes T** et **lymphocytes B** ; certains deviennent des cellules mémoire.

### À retenir
- Organes lymphoïdes primaires (moelle osseuse, thymus) = production/maturation des cellules immunitaires
- Organes lymphoïdes secondaires (rate, ganglions...) = lieux de la réponse immunitaire
- 3 types de leucocytes : granulocytes, macrophages, lymphocytes (T et B)
- Anticorps = réponse spécifique ; phagocytose = réponse non spécifique`,

  "Dysfonctionnement du système immunitaire : cas de l'infection au VIH/SIDA": `### Introduction
Quand le système immunitaire ne remplit plus son rôle (réponse insuffisante ou absente), on parle de **dysfonctionnement du système immunitaire** — le VIH/SIDA en est l'exemple le plus grave.

### 1. Définitions
- **VIH** : Virus de l'Immunodéficience Humaine.
- **SIDA** : Syndrome d'Immuno Déficience Acquise — un ensemble de symptômes traduisant un affaiblissement (acquis, non héréditaire) du système immunitaire.

### 2. Séropositivité et séronégativité
Contaminé par le VIH, l'organisme produit des anticorps anti-VIH.
- **Séropositivité** = présence d'anticorps anti-VIH.
- **Séronégativité** = absence d'anticorps anti-VIH.

### 3. Mécanisme et maladies opportunistes
Le VIH s'attaque aux **lymphocytes T4** et les détruit. Ceux-ci deviennent insuffisants pour assurer la défense spécifique : c'est l'**immunodéficience**. Le système de défense affaibli laisse alors la porte ouverte à des infections normalement sans danger : les **maladies opportunistes**.

### À retenir
- VIH détruit les lymphocytes T4 → système immunitaire déficient → maladies opportunistes
- Séropositif = anticorps anti-VIH présents (le virus est là, la maladie SIDA pas nécessairement déclarée)
- Le SIDA est la phase terminale de l'infection au VIH

*Note : le mode de transmission et les moyens de prévention (volet explicitement demandé par le programme officiel) ne sont pas détaillés dans la source utilisée pour ce cours — à compléter.*`,

  "Aide à l'immunité": `### Introduction
Le système immunitaire peut être secondé par un **transfert d'immunité** : c'est le principe de la prévention (vaccination) et du traitement (sérothérapie, antibiothérapie).

### 1. La prévention : la vaccination
**Vacciner** = injecter un microbe « atténué » (antigène non dangereux) pour provoquer une réaction de défense (production d'anticorps) sans déclencher la maladie.

**Principe** : le vaccin active une réponse primaire (peu d'anticorps, formation de cellules mémoire). En cas de contact ultérieur avec le vrai microbe, les cellules mémoires déclenchent une réponse secondaire rapide et massive → élimination totale de l'antigène.

**Caractéristiques** : spécifique et préventive, active (l'organisme fabrique lui-même ses anticorps), lente à s'établir mais durable (nécessite des rappels).

### 2. Le traitement
**Sérothérapie** : injection d'un sérum contenant des anticorps déjà fabriqués par un autre organisme. Méthode **curative** : action spécifique et immédiate, mais de courte durée (l'organisme élimine ces anticorps « étrangers »).

| Caractéristique | Vaccination | Sérothérapie |
|---|---|---|
| Moment | Avant la maladie (préventif) | Maladie déclarée (curatif) |
| Origine des anticorps | Fabriqués par l'organisme | Injectés (autre organisme) |
| Type d'immunité | Active | Passive |
| Durée d'action | Longue (avec rappels) | Courte |
| Début d'action | Retardé | Immédiat |

**Sérovaccination** : associe les deux — le sérum protège immédiatement, le vaccin assure une protection durable.

**Antibiothérapie** : découverte par Alexander Fleming en 1929 (Penicillium notatum détruisant des staphylocoques). Un **antibiotique** tue (bactéricide) ou freine (bactériostatique) les bactéries. Un **antibiogramme** permet de déterminer l'antibiotique le plus efficace contre un microbe donné.

![Antibiogramme](${IMG}/p104_450.png)

### À retenir
- Vaccination = prévention, immunité active, durable
- Sérothérapie = traitement, immunité passive, immédiate mais courte
- Antibiothérapie = traitement contre les bactéries, guidé par l'antibiogramme`,

  'Le fonctionnement du système nerveux': `### Introduction
Le système nerveux élabore la réponse de l'organisme face aux informations reçues de l'environnement.

### 1. Organisation du système nerveux
- **Système nerveux central (SNC)** : encéphale (cerveau, cervelet, bulbe rachidien) + moelle épinière.
- **Système nerveux périphérique** : les nerfs — 12 paires de nerfs crâniens (partent de l'encéphale) et 31 paires de nerfs rachidiens (partent de la moelle épinière).

### 2. Stimulus et comportement
Un **stimulus** est un facteur de l'environnement (lumière, son, odeur...) qui peut provoquer un **comportement**.
- **Comportement volontaire** : fait intervenir la volonté (ex. danser).
- **Comportement involontaire (réflexe)** : indépendant de la volonté (ex. retirer la main d'un objet chaud).

| Organe de sens | Récepteur | Sens |
|---|---|---|
| Nez | Terminaisons olfactives | Odorat |
| Peau | Terminaisons cutanées | Toucher |
| Oreille | Oreille interne | Ouïe |
| Langue | Papilles gustatives | Goût |
| Œil | Rétine | Vue |

### 3. L'arc réflexe
Des expériences de section-stimulation (sur grenouille) montrent que la réalisation d'un comportement nécessite dans l'ordre :
**Récepteur** (transforme le stimulus en message sensitif) → **nerf sensitif** (conduit l'influx centripète) → **centre nerveux** (reçoit, interprète, élabore la réponse) → **nerf moteur** (conduit l'influx centrifuge) → **effecteur** (muscle ou glande, exécute la réponse).

![Arc réflexe](${IMG}/p011_95.png)

**Centres nerveux** :
- Le **cerveau** (cortex cérébral, en aires sensitives et motrices) commande les mouvements **volontaires**, conscients.
- La **moelle épinière** (avec le cervelet et le bulbe rachidien) commande les réflexes, inconscients, automatiques, prévisibles.

| | Acte volontaire | Acte réflexe |
|---|---|---|
| Centre nerveux | Cerveau | Moelle épinière (ou bulbe/cervelet) |
| Conscience | Conscient | Inconscient |
| Vitesse | Lent | Automatique, rapide |

**Réflexes innés** (communs à l'espèce, sans apprentissage — ex. réflexe pupillaire) vs **réflexes acquis/conditionnés** (appris par répétition — ex. saliver à l'heure des repas).

### 4. Hygiène du système nerveux
À éviter : manque de sommeil, bruit, lumière intense, excitants (thé, café), drogues (cannabis, cocaïne, héroïne), abus de médicaments, stress.
À privilégier : sommeil suffisant, activité physique, alimentation équilibrée.

### À retenir
- SNC (encéphale + moelle épinière) / SN périphérique (nerfs)
- Arc réflexe : récepteur → nerf sensitif → centre nerveux → nerf moteur → effecteur
- Cerveau = volontaire/conscient ; moelle épinière = réflexe/inconscient
- Hygiène : éviter drogues, excitants, manque de sommeil

*Note : le programme officiel demande aussi la structure du tissu nerveux et du neurone, ainsi que les maladies du système nerveux (tétanos, poliomyélite) — non couverts par la source utilisée pour ce cours.*`,
}

async function main() {
  console.log(DRY_RUN ? '=== DRY RUN ===' : '=== Écriture en base ===')
  const [subject] = await sb(`/rest/v1/subjects?level=eq.bepc&name=eq.SVT&select=id`)

  let updated = 0
  for (const [titre, content] of Object.entries(SUMMARIES)) {
    const [chapter] = await sb(`/rest/v1/chapters?subject_id=eq.${subject.id}&title=eq.${encodeURIComponent(titre)}&select=id`)
    if (!chapter) { console.warn(`⚠ Chapitre introuvable : "${titre}"`); continue }
    if (DRY_RUN) {
      console.log(`[dry-run] remplacerait le cours de "${titre}" par un résumé de ${content.length} caractères`)
    } else {
      const [lesson] = await sb(`/rest/v1/lessons?chapter_id=eq.${chapter.id}&type=eq.cours&select=id`)
      await sb(`/rest/v1/lessons?id=eq.${lesson.id}`, { method: 'PATCH', body: JSON.stringify({ content }) })
      console.log(`✓ Résumé appliqué : "${titre}" (${content.length} car.)`)
    }
    updated++
  }
  console.log(`\n${DRY_RUN ? '[dry-run]' : 'Terminé.'} ${updated} chapitres résumés.`)
}

main().catch((e) => { console.error('✗', e); process.exit(1) })
