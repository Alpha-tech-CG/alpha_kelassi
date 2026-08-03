# Alpha Kelassi V2 — Système Tuteurs Humains

> **Version** : 2.0 — Concept & Architecture fonctionnelle  
> **Date** : Juillet 2026  
> **Plateforme** : Cognix (orchestre tous les profils et flux)  
> **Contexte** : Extension de la V1 (tuteur IA Kelassi) avec des tuteurs humains rémunérés pour la correction d'exercices physiques.

---

## 1. Vision générale

La V2 introduit une **couche humaine** dans la boucle pédagogique. L'élève soumet une photo de son travail manuscrit et reçoit une correction d'un tuteur humain, validée par l'IA avant livraison.

Le modèle s'inspire des plateformes de livraison à la demande (Deliveroo) pour le dispatch des missions. La plateforme **Cognix** orchestre l'ensemble : chaque utilisateur est redirigé vers son espace selon son profil (élève, tuteur, admin).

---

## 2. Les acteurs

| Acteur | Rôle |
|--------|------|
| **Élève** | Soumet une photo de son exercice + son travail. Reçoit la correction. Note le tuteur. Conteste si besoin. |
| **Tuteur** | Reçoit la mission, envoie une photo manuscrite de sa solution, est rémunéré selon la tentative. |
| **IA Kelassi** | Vérifie la correction. Donne la réponse finale si 2 échecs. Arbitre les litiges élève. |
| **Cognix** | Orchestre les flux, gère les profils, dispatch les missions, valide les comptes tuteurs. |

---

## 3. Flux complet — Soumission d'un exercice

```
Élève (abonné Premium)
  │
  ├─ [1] Prend une photo de son travail manuscrit
  ├─ [2] Joint l'énoncé de l'exercice (photo ou catalogue)
  └─ [3] Soumet la demande de correction
          │
          ▼
  DISPATCH AUTOMATIQUE (Cognix)
  ├─ Notification push aux tuteurs qualifiés sur cette matière
  ├─ Chrono : 5 min pour accepter
  │
  ├─ Tuteur accepte → confirmation de disponibilité
  │      └─ Si pas de réponse → mission proposée au tuteur suivant
  │
  ▼
  TUTEUR TRAVAILLE (délai max : 1h30)
  ├─ Reçoit : photo travail élève + énoncé
  ├─ Rédige sa solution sur papier
  └─ Prend une PHOTO de sa solution manuscrite (lisible) et la soumet
          │
          ▼
  VÉRIFICATION IA
  ├─ [OK — 1re tentative]
  │    ├─ Solution envoyée à l'élève
  │    └─ Tuteur crédité : +250 FCFA
  │
  └─ [ERREUR — 1re tentative]
       ├─ IA indique précisément où se trouve l'erreur
       ├─ Tuteur corrige et resoumet (photo nouvelle solution)
       │
       ├─ [OK — 2e tentative]
       │    ├─ Solution envoyée à l'élève
       │    └─ Tuteur crédité : +150 FCFA
       │
       └─ [ERREUR — 2e tentative]
            ├─ IA génère la solution officielle
            ├─ Envoyée à l'élève ET au tuteur (apprentissage)
            └─ Tuteur : 0 FCFA
```

---

## 4. Système de dispatch (modèle Deliveroo)

### 4.1 Notification & acceptation

Le tuteur reçoit une push notification contenant :
- La matière et le niveau (ex. Maths — BEPC)
- Le type d'exercice (ex. Algèbre — équation du 2ème degré)
- La rémunération potentielle (250 FCFA)
- Un **chrono visible** (5 min pour accepter)

S'il accepte → il confirme qu'il est disponible pour rendre dans les **1h30**.  
Si le chrono expire → mission retirée et proposée au tuteur suivant automatiquement.

### 4.2 File de tuteurs

- Triée par **score de réputation** (meilleurs tuteurs sollicités en priorité)
- Filtrée par **matière validée** lors de l'inscription
- Si aucun tuteur disponible → l'élève est averti d'un délai estimé

### 4.3 Statuts de la mission

| Statut | Description |
|--------|-------------|
| `pending` | En attente d'un tuteur |
| `assigned` | Tuteur assigné, en cours de résolution (1h30 max) |
| `submitted_1` | 1re photo soumise, en vérification IA |
| `revision_1` | IA a rejeté la 1re tentative, tuteur corrige |
| `submitted_2` | 2e photo soumise, en vérification IA |
| `delivered` | Solution validée et envoyée à l'élève |
| `failed` | 2 tentatives échouées, IA a pris le relais |
| `expired` | Aucun tuteur n'a accepté dans le délai |
| `disputed` | Élève a contesté, IA en cours d'arbitrage |

---

## 5. Correction manuscrite

Le tuteur **ne tape pas** sa solution — il l'écrit à la main sur papier et envoie **une photo de sa solution manuscrite**.

Règles de qualité :
- La photo doit être **lisible** (bien éclairée, nette, écriture claire)
- Si l'IA détecte une image illisible → mission rejetée avant vérification, tuteur averti de renvoyer
- Le tuteur peut envoyer plusieurs pages si l'exercice est long

---

## 6. Vérification IA

### 6.1 Principe

L'IA analyse : **énoncé** + **photo de la solution tuteur** (OCR + raisonnement).

- **Output OK** → solution correcte, livrée à l'élève
- **Output ERREUR** → feedback localisé pour le tuteur :
  - *"Erreur à l'étape 3 : la factorisation du membre gauche est incorrecte."*
  - *"Le résultat de l'intégrale est bon mais la constante C est manquante."*

### 6.2 Après 2 échecs

- L'IA génère la solution complète et expliquée
- Envoyée à l'**élève** (avec indication que c'est une correction IA)
- Envoyée au **tuteur** (pour qu'il comprenne son erreur)
- Tuteur : 0 FCFA

---

## 7. Rémunération des tuteurs

| Cas | Gain tuteur |
|-----|-------------|
| Solution validée à la **1re tentative** | **250 FCFA** |
| Solution validée à la **2e tentative** | **150 FCFA** |
| 2 tentatives échouées | **0 FCFA** |
| Mission non acceptée dans le délai | **0 FCFA** |
| Mission acceptée mais non rendue dans 1h30 | **0 FCFA** + pénalité score |

### 7.1 Portefeuille tuteur

- Gains cumulés dans un **wallet** visible dans le dashboard
- Retrait via **Mobile Money (MTN/Airtel)** ou **CinetPay** (déjà intégré V1)
- Seuil minimal de retrait : à définir (ex. 2 000 FCFA)

### 7.2 Pénalités

- Missions acceptées puis abandonnées → suspension temporaire
- Score trop bas → retrait de la file de dispatch

---

## 8. Inscription et validation tuteur

### 8.1 Processus d'inscription

Le tuteur s'inscrit sur Cognix en choisissant le profil **"Tuteur"** :

1. **Informations de base** : nom, prénom, photo de profil, numéro de téléphone
2. **Matières** : sélection des matières qu'il souhaite corriger (Maths, Physique, SVT, Français…)
3. **Niveau** : BEPC et/ou BAC
4. **Documents à fournir** :
   - Photo de sa **pièce d'identité** (CNI ou passeport)
   - Photo de son **diplôme du BAC** ou de son **attestation de réussite au BAC**

### 8.2 Délai de validation

- Après soumission des documents → **validation dans les 24h** par l'équipe Cognix
- Le tuteur reçoit une notification : *"Votre compte tuteur a été validé. Vous pouvez commencer à recevoir des missions."*
- En cas de refus → notification avec motif (document illisible, non conforme…)

### 8.3 Aucun test de qualification

La vérification du BAC suffit comme preuve de niveau. Pas de test supplémentaire — c'est l'IA et le système de réputation qui filtreront naturellement les tuteurs peu performants.

---

## 9. Système de notation (réputation)

### 9.1 Note par l'élève

Après réception de la correction, l'élève note le tuteur sur :
- **Clarté de la solution** (1–5 étoiles)
- **Qualité de la démarche** (1–5 étoiles)
- Commentaire libre (optionnel)

### 9.2 Score global du tuteur

```
Score = (moyenne des notes élèves × 0.6) + (taux de validation IA 1re tentative × 0.4)
```

Mis à jour automatiquement après chaque mission terminée.

### 9.3 Impact du score sur le dispatch

| Score | Effet |
|-------|-------|
| ≥ 4.5 ⭐ | Priorité maximale, badge "Expert Kelassi" |
| 3.5 – 4.4 ⭐ | Priorité normale |
| 2.5 – 3.4 ⭐ | Priorité réduite, alerte au tuteur |
| < 2.5 ⭐ | Suspension automatique + révision du compte Cognix |

---

## 10. Gestion des litiges élève

Si l'élève **conteste** une correction (même validée par l'IA) :

1. Il appuie sur **"Contester cette correction"** dans son fil de discussion
2. Il décrit brièvement son problème (champ texte libre)
3. **L'IA intervient** : elle analyse l'énoncé, la solution tuteur ET la question de l'élève
4. Elle produit une **explication détaillée** qui répond à la contestation :
   - Si la correction était juste → explique pourquoi, étape par étape
   - Si la correction avait une ambiguïté → lève l'ambiguïté avec la démarche complète
5. L'élève reçoit cette explication dans son fil de discussion
6. Aucune pénalité pour le tuteur dans ce cas (l'IA a validé sa correction)

> Le litige ne modifie pas la rémunération du tuteur si sa solution avait été validée par l'IA.

---

## 11. Plateforme Cognix — Gestion des profils

Cognix est l'application centrale qui orchestre tous les profils. Chaque utilisateur est redirigé vers son espace dédié à la connexion :

| Profil | Espace |
|--------|--------|
| **Élève** | App mobile Kelassi — cours, examens, soumission d'exercices, fil de corrections |
| **Tuteur** | Dashboard tuteur — missions disponibles, en cours, wallet, score, historique |
| **Admin** | Panel admin — validation des tuteurs, supervision des missions, litiges complexes |

La redirection est automatique selon le `role` stocké dans le profil Supabase (`student`, `tutor`, `admin`).

---

## 12. Architecture technique (extension V1)

### 12.1 Nouveau rôle DB

```sql
ALTER TYPE user_role ADD VALUE 'tutor';
```

### 12.2 Nouvelles tables (migration 021+)

```sql
-- Profil tuteur
CREATE TABLE tutor_profiles (
  user_id        UUID PRIMARY KEY REFERENCES users(id),
  bio            TEXT,
  id_doc_url     TEXT NOT NULL,   -- photo pièce d'identité (Storage)
  bac_doc_url    TEXT NOT NULL,   -- photo diplôme/attestation BAC (Storage)
  verified_at    TIMESTAMPTZ,     -- date de validation admin
  is_verified    BOOLEAN DEFAULT false,
  score          NUMERIC(3,2) DEFAULT 0,
  wallet_balance INTEGER DEFAULT 0,  -- en FCFA
  is_active      BOOLEAN DEFAULT true,
  created_at     TIMESTAMPTZ DEFAULT now()
);

-- Matières maîtrisées par le tuteur
CREATE TABLE tutor_subjects (
  tutor_id   UUID REFERENCES tutor_profiles(user_id),
  subject_id UUID REFERENCES subjects(id),
  PRIMARY KEY (tutor_id, subject_id)
);

-- Mission de correction
CREATE TABLE correction_missions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id      UUID REFERENCES users(id),
  tutor_id        UUID REFERENCES tutor_profiles(user_id),
  subject_id      UUID REFERENCES subjects(id),
  exercise_url    TEXT NOT NULL,   -- photo énoncé (Storage)
  work_url        TEXT NOT NULL,   -- photo travail élève (Storage)
  status          TEXT NOT NULL DEFAULT 'pending',
  accepted_at     TIMESTAMPTZ,
  due_at          TIMESTAMPTZ,     -- accepted_at + 1h30
  delivered_at    TIMESTAMPTZ,
  attempts        SMALLINT DEFAULT 0,
  reward_fcfa     INTEGER,         -- calculé à la livraison (250 ou 150)
  ai_verdict      JSONB,           -- dernier retour IA
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- Solutions photo soumises par le tuteur
CREATE TABLE correction_solutions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mission_id    UUID REFERENCES correction_missions(id),
  attempt       SMALLINT NOT NULL CHECK (attempt IN (1, 2)),
  photo_url     TEXT NOT NULL,     -- photo solution manuscrite (Storage)
  ai_status     TEXT,              -- 'ok' | 'error' | 'unreadable'
  ai_feedback   TEXT,              -- localisation erreur ou motif rejet
  submitted_at  TIMESTAMPTZ DEFAULT now()
);

-- Notes élèves sur tuteurs
CREATE TABLE tutor_ratings (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mission_id   UUID REFERENCES correction_missions(id) UNIQUE,
  student_id   UUID REFERENCES users(id),
  tutor_id     UUID REFERENCES tutor_profiles(user_id),
  clarity      SMALLINT CHECK (clarity BETWEEN 1 AND 5),
  quality      SMALLINT CHECK (quality BETWEEN 1 AND 5),
  comment      TEXT,
  created_at   TIMESTAMPTZ DEFAULT now()
);

-- Litiges élève
CREATE TABLE correction_disputes (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mission_id     UUID REFERENCES correction_missions(id),
  student_id     UUID REFERENCES users(id),
  description    TEXT NOT NULL,
  ai_explanation TEXT,            -- explication produite par l'IA
  resolved_at    TIMESTAMPTZ,
  created_at     TIMESTAMPTZ DEFAULT now()
);

-- Transactions portefeuille tuteur
CREATE TABLE tutor_wallet_transactions (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tutor_id     UUID REFERENCES tutor_profiles(user_id),
  mission_id   UUID REFERENCES correction_missions(id),
  amount_fcfa  INTEGER NOT NULL,
  type         TEXT NOT NULL CHECK (type IN ('credit', 'withdrawal')),
  status       TEXT DEFAULT 'completed',
  created_at   TIMESTAMPTZ DEFAULT now()
);
```

### 12.3 Nouvelles routes API (Hono)

```
-- Côté élève
POST   /api/corrections                → Soumettre un exercice
GET    /api/corrections/:id            → Statut d'une mission
POST   /api/corrections/:id/rate       → Noter le tuteur
POST   /api/corrections/:id/dispute    → Contester une correction

-- Côté tuteur
GET    /api/tutor/missions             → Missions disponibles
POST   /api/tutor/missions/:id/accept  → Accepter une mission
POST   /api/tutor/missions/:id/submit  → Soumettre une photo solution
GET    /api/tutor/wallet               → Portefeuille et historique
POST   /api/tutor/withdraw             → Demande de retrait

-- Admin / Cognix
GET    /api/admin/tutors/pending       → Tuteurs en attente de validation
POST   /api/admin/tutors/:id/verify    → Valider un compte tuteur
POST   /api/admin/tutors/:id/reject    → Rejeter un compte tuteur
```

### 12.4 Jobs BullMQ (nouveaux)

| Job | Déclencheur | Action |
|-----|-------------|--------|
| `dispatch-mission` | Mission créée | Notifie les tuteurs qualifiés par matière |
| `mission-accept-timeout` | Chrono 5 min expiré | Propose au tuteur suivant |
| `mission-due-timeout` | 1h30 après acceptation sans rendu | 0 FCFA + pénalité score + réassignation IA |
| `ai-verify-solution` | Photo solution soumise | OCR + vérification Gemini |
| `ai-resolve-dispute` | Litige soumis | Gemini analyse et produit explication |
| `ai-force-solution` | 2e tentative échouée | Génère solution IA et livre |
| `update-tutor-score` | Mission terminée | Recalcule score tuteur |
| `send-reward` | Solution validée | Crédite wallet tuteur |

### 12.5 Nouveaux buckets Supabase Storage

| Bucket | Contenu |
|--------|---------|
| `exercise-photos` | Énoncés envoyés par les élèves |
| `student-work` | Travaux manuscrits des élèves |
| `tutor-solutions` | Photos solutions manuscrites des tuteurs |
| `tutor-documents` | Pièces d'identité + diplômes BAC (privé, accès admin only) |

---

## 13. Tarification

### Élève

La correction d'exercices par tuteur est **incluse dans l'abonnement Premium**. Aucun coût supplémentaire pour l'élève abonné.

Les élèves Free n'ont pas accès à cette fonctionnalité → elle constitue un levier d'upsell vers le Premium.

### Tuteur

Rémunération par mission :
- **250 FCFA** — solution validée dès la 1re tentative
- **150 FCFA** — solution validée à la 2e tentative
- **0 FCFA** — 2 échecs ou mission non honorée

---

## 14. Roadmap V2 (estimée)

| Phase | Durée | Contenu |
|-------|-------|---------|
| **Phase 1** | 3 semaines | DB + Storage + routes API missions + vérification IA photo |
| **Phase 2** | 3 semaines | App mobile élève : soumission, suivi, réception, notation, litige |
| **Phase 3** | 2 semaines | Dashboard tuteur Cognix : missions, wallet, retraits |
| **Phase 4** | 2 semaines | Admin Cognix : validation tuteurs, supervision, dispatch prioritaire |
| **Phase 5** | 2 semaines | Tests, sécurité, charge, bêta fermée |

---

## 15. Décisions prises ✅

| Question | Décision |
|----------|----------|
| Tarif élève | Inclus dans le Premium |
| Délai de correction | 1h30 après acceptation |
| Rémunération 1re tentative | 250 FCFA |
| Rémunération 2e tentative | 150 FCFA |
| Format correction tuteur | Photo manuscrite (solution sur papier) |
| Qualification tuteur | BAC + pièce d'identité, validation en 24h |
| Test de qualification | Aucun — IA et réputation filtrent naturellement |
| Plateforme | Cognix orchestre tout, redirection par profil |
| Litige élève | IA intervient avec explication détaillée |

---

*Document vivant — Phase 1 à démarrer.*
