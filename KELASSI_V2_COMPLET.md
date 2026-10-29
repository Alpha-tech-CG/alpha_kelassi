# Alpha Kelassi V2 — Spécification Complète

> **Version** : 2.0 UNIQUE — Document de référence consolidé  
> **Date** : Août 2026  
> **Plateforme hôte** : Cognix (orchestre tous les profils et flux)  
> **Périmètre** : Tuteurs humains + Contenus pédagogiques + Communauté + Messagerie + Gamification + Sécurité mineurs

---

## 0. Vision

Alpha Kelassi V2 est une **super-app scolaire tout-en-un** pour les élèves du Congo Brazzaville (BEPC, BAC). Elle combine :

- Des **contenus pédagogiques complets** (cours, fiches, vidéos, quiz, annales)
- La **correction humaine d'exercices** par des tuteurs rémunérés, validée par l'IA
- Une **communauté de révision** (groupes, séances, défis, enseignants)
- Une **messagerie sécurisée** avec modération IA pensée pour les mineurs
- De la **gamification** pour maintenir la motivation
- Un **contrôle parental** et des protections adaptées à l'âge

La plateforme **Cognix** orchestre l'ensemble : chaque profil (élève, tuteur, enseignant, parent, admin) est automatiquement redirigé vers son espace.

---

## BLOC A — Contenus Pédagogiques

### A.1 Structure des contenus

Chaque matière est organisée en **chapitres**. Pour chaque chapitre, l'élève trouve :

| Ressource | Description |
|-----------|-------------|
| **Cours complet** | Texte structuré avec définitions, théorèmes, exemples |
| **Résumé** | Synthèse en 1–2 pages des points essentiels |
| **Fiche de révision** | Format carte mémo, rapide à relire |
| **Vidéo explicative** | Lien YouTube intégré (professeur congolais de préférence) |
| **Exercices** | 5–10 exercices par chapitre, du plus simple au plus difficile |
| **Corrigés détaillés** | Solution complète avec démarche expliquée étape par étape |

### A.2 Matières couvertes (priorité V2)

Niveaux couverts : **BEPC** et **BAC** (toutes filières : A, C, D)

| Priorité 1 (lancement) | Priorité 2 (dans les 3 mois) |
|------------------------|------------------------------|
| Mathématiques | Histoire-Géographie |
| Physique-Chimie | Philosophie |
| Sciences de la Vie et de la Terre | Langues vivantes (Anglais, Espagnol) |
| Français | Économie |

### A.3 Anciens sujets d'examen (Annales)

Chaque année d'examen disponible est organisée ainsi :

- **Entraînement libre** — l'élève s'exerce sans pression
- **Bac test** — simulation chronométrée (durée réelle)
- **Bac blanc** — évaluation avec note et correction automatique IA
- **Bac rouge** — mode difficile avec pénalité sur les mauvaises réponses

Les corrigés officiels (ou générés IA) sont disponibles après soumission.

### A.4 Planning de révision personnalisé

L'élève configure son planning en répondant à :
- La date de son examen
- Les matières à réviser
- Le nombre d'heures disponibles par jour

L'app génère un **planning semaine par semaine** avec :
- Les chapitres à étudier chaque jour
- Des rappels push (matin et soir)
- Un suivi de progression (✅ fait / ⏳ en retard)

En V2, le planning est semi-intelligent : il s'adapte aux chapitres marqués "non compris" par l'élève après un quiz.

---

## BLOC B — Correction par Tuteurs Humains

> Bloc déjà détaillé dans `KELASSI_V2_TUTEURS.md` — résumé ici pour cohérence.

### B.1 Principe

L'élève Premium soumet une **photo de son travail manuscrit** + l'énoncé de l'exercice. Un tuteur humain qualifié reçoit la mission (style Deliveroo), envoie une **photo de sa correction manuscrite**, qui est validée par l'IA avant d'être livrée à l'élève.

### B.2 Rémunération tuteur

| Cas | Gain |
|-----|------|
| Validé à la 1re tentative | 250 FCFA |
| Validé à la 2e tentative | 150 FCFA |
| 2 échecs | 0 FCFA — IA prend le relais |

### B.3 Dispatch (Deliveroo)

- Push notification au tuteur → chrono 5 min pour accepter
- Délai de rendu : **1h30** après acceptation
- Si non honoré → réassignation automatique + pénalité score

### B.4 Inscription tuteur

- Pièce d'identité + diplôme BAC ou attestation de réussite
- Validation Cognix dans les **24h**
- Pas de test supplémentaire — l'IA et le score filtrent naturellement

### B.5 Litige élève

Si l'élève conteste une correction → l'IA arbitre avec une explication détaillée. Le tuteur n'est pas pénalisé si sa solution avait été validée par l'IA.

---

## BLOC C — Communauté de Révision

### C.1 Groupes de révision

Un élève peut **créer ou rejoindre** un groupe de révision. Types de groupes :

| Type | Exemple | Qui peut créer |
|------|---------|----------------|
| Groupe de classe | "Tle D — Lycée Savorgnan" | Élève ou Enseignant |
| Groupe de matière | "Maths BEPC Brazzaville" | Élève |
| Groupe officiel | Créé par un enseignant vérifié | Enseignant |
| Groupe privé | Cercle d'amis | Élève |

Chaque groupe contient :
- **Fil de discussion** de groupe (messages + photos)
- **Calendrier des séances** (dates et sujets de révision planifiés)
- **Bibliothèque partagée** (fiches, résumés, photos de notes uploadées par les membres)
- **Quiz de groupe** (défi collectif sur un chapitre donné)

### C.2 Séances de révision collectives

Un membre peut créer une séance :
- Définir sujet, date, durée
- Inviter les membres du groupe
- Pendant la séance : fil de discussion dédié + quiz live en temps réel
- Après : résumé automatique IA des points abordés

### C.3 Rôle des enseignants

Un enseignant peut créer un compte en fournissant :
- Pièce d'identité
- Justificatif d'enseignement (carte professionnelle ou attestation de l'école)
- Validation Cognix en 48h

Un enseignant dans un groupe peut :
- Publier des ressources officielles (cours, devoirs)
- Lancer des quiz pour ses élèves
- Consulter les statistiques de participation du groupe
- Modérer les discussions

### C.4 Mentors élèves

Un élève devient **Mentor** automatiquement quand :
- Son score XP dépasse un seuil (ex. top 5% de sa filière)
- Il a aidé d'autres élèves (réponses évaluées positivement)

Le mentor peut :
- Répondre aux questions publiques d'autres élèves
- Animer des séances dans des groupes
- Accéder à un badge visible sur son profil

---

## BLOC D — Messagerie Sécurisée

### D.1 Types de messagerie

| Canal | Accès |
|-------|-------|
| Chat de groupe | Tous les membres du groupe |
| Message direct (DM) | Uniquement entre élèves du même groupe, avec restrictions d'âge |
| Annonces enseignant | Enseignant → tous les membres, lecture seule |

Les **DM entre inconnus** ne sont pas autorisés. Un DM n'est possible qu'entre membres d'un même groupe commun.

### D.2 Restrictions selon l'âge

| Âge déclaré | DM autorisés |
|-------------|--------------|
| < 15 ans | Désactivés par défaut (sauf déverrouillage parental) |
| 15–17 ans | Autorisés uniquement dans les groupes communs |
| 18 ans et + | Autorisés sans restriction |

### D.3 Modération IA (avant envoi)

Chaque message passe par l'IA avant d'être publié :

- **Insultes / violence** → bloqué, message d'explication envoyé à l'auteur
- **Contenu sexuel** → bloqué + signalement automatique à l'équipe Cognix
- **Harcèlement détecté** → alerte admin groupe + signalement
- **Liens externes suspects** → bloqué avec explication
- **Contenu hors-sujet excessif** → avertissement (pas de blocage)

L'IA laisse passer les messages normaux **sans délai visible** — la modération est transparente.

### D.4 Signalement humain

Chaque message ou utilisateur peut être **signalé** par n'importe quel membre. Les signalements arrivent à :
1. L'admin du groupe (enseignant ou créateur)
2. L'équipe Cognix (pour les cas graves)

### D.5 Coordonnées masquées

Aucune information de contact personnelle (numéro de téléphone, email, réseaux sociaux, adresse) ne peut être partagée dans les messages. L'IA bloque automatiquement les patterns de coordonnées.

---

## BLOC E — Gamification & Motivation

### E.1 Système XP

Chaque action rapporte des points XP :

| Action | XP |
|--------|----|
| Compléter un chapitre | +50 |
| Réussir un quiz (>70%) | +30 |
| Passer un bac blanc | +80 |
| Soumettre un exercice à corriger | +10 |
| Aider un camarade (réponse aimée) | +20 |
| Séance de révision complétée | +40 |
| Revenir 7 jours de suite | +100 (bonus streak) |

### E.2 Badges et trophées

| Badge | Condition |
|-------|-----------|
| 🔥 Assidu | 7 jours consécutifs d'activité |
| 📚 Lecteur | 10 chapitres lus |
| ✅ Perfectionniste | 5 quiz à 100% |
| 🏆 Champion | 1er d'un défi de groupe |
| 🌟 Mentor | Statut Mentor débloqué |
| 🎓 Prêt pour le BAC | Planning de révision 100% complété |

### E.3 Classements

- **Classement personnel** : progression semaine par semaine
- **Classement du groupe** : qui a le plus de XP dans le groupe
- **Classement national** (filière) : top élèves de la même filière au Congo

Le classement national est **optionnel** — l'élève peut choisir d'être anonyme.

### E.4 Défis

| Type de défi | Description |
|--------------|-------------|
| Défi solo | L'élève se fixe un objectif (ex. finir 3 chapitres cette semaine) |
| Défi de groupe | Quiz collectif sur un chapitre, score moyen du groupe |
| Défi inter-groupes | Deux groupes s'affrontent sur un quiz |
| Challenge hebdomadaire | Lancé par Cognix chaque lundi, ouvert à tous |

---

## BLOC F — Sécurité des Mineurs & Contrôle Parental

### F.1 Profil mineur

À l'inscription, l'élève déclare sa date de naissance. Si mineur (< 18 ans) :
- Les DM sont restreints (voir D.2)
- Le partage de coordonnées est bloqué
- Le contenu est filtré (modération IA renforcée)
- Un email de notification peut être envoyé à un parent (optionnel à l'inscription)

### F.2 Espace parent (optionnel)

Le parent peut créer un **compte parent lié** au compte de son enfant. Il accède à :
- La durée quotidienne d'utilisation
- Les matières et chapitres consultés
- Les groupes rejoints (noms uniquement)
- Les alertes de signalement (si son enfant a été signalé ou a signalé quelqu'un)

Le parent ne peut **pas lire** les messages privés de son enfant (vie privée respectée).

Le parent peut :
- Activer/désactiver les DM
- Fixer une limite de temps journalière
- Recevoir un rapport hebdomadaire par email

### F.3 Politique de tolérance zéro

Comportements entraînant **suspension immédiate du compte** :
- Partage de contenu sexuel impliquant des mineurs
- Harcèlement répété après avertissement
- Tentative de contournement des règles d'âge
- Usurpation d'identité (tuteur, enseignant, admin)

---

## BLOC G — Profils & Navigation Cognix

Cognix redirige chaque utilisateur vers son espace dès la connexion :

| Profil | Espace dédié |
|--------|--------------|
| **Élève** | App mobile : cours, quiz, correction, communauté, planning |
| **Tuteur** | Dashboard tuteur : missions, wallet, score, historique |
| **Enseignant** | Dashboard pédago : groupes, ressources, quiz, stats |
| **Parent** | Dashboard parental : suivi, alertes, limites |
| **Admin Cognix** | Panel admin : validation comptes, modération, supervision |

La redirection est automatique selon le `role` en base (`student`, `tutor`, `teacher`, `parent`, `admin`).

---

## Architecture Technique — Vue d'ensemble V2

### Nouveaux rôles DB

```sql
ALTER TYPE user_role ADD VALUE 'tutor';
ALTER TYPE user_role ADD VALUE 'teacher';
ALTER TYPE user_role ADD VALUE 'parent';
```

### Nouvelles tables (migrations 021+)

```
021 — tutor_profiles, tutor_subjects
022 — correction_missions, correction_solutions, correction_disputes
023 — tutor_ratings, tutor_wallet_transactions
024 — study_groups, group_members, group_messages
025 — group_sessions, session_participants
026 — teacher_profiles, teacher_group_roles
027 — parent_links, parental_settings
028 — xp_events, user_xp, badges, user_badges
029 — challenges, challenge_participants
030 — moderation_flags, moderation_actions
031 — chapters (extension de subjects), chapter_resources
032 — exam_simulations, simulation_results
033 — study_plans, study_plan_tasks
```

### Nouveaux buckets Supabase Storage

| Bucket | Contenu | Accès |
|--------|---------|-------|
| `exercise-photos` | Énoncés soumis par élèves | Privé (owner) |
| `student-work` | Travaux manuscrits élèves | Privé (owner + tuteur assigné) |
| `tutor-solutions` | Photos corrections tuteurs | Privé (owner + élève concerné) |
| `tutor-documents` | CNI + diplômes BAC tuteurs | Privé admin only |
| `teacher-documents` | Justificatifs enseignants | Privé admin only |
| `group-resources` | Fiches, cours partagés dans les groupes | Membres du groupe |
| `chapter-content` | PDFs cours, fiches officielles Kelassi | Public (authentifié) |

### Nouveaux jobs BullMQ

**Tuteurs**
- `dispatch-mission` — cherche tuteur disponible
- `mission-accept-timeout` — réassigne après 5 min sans réponse
- `mission-due-timeout` — 1h30 écoulé sans rendu
- `ai-verify-solution` — vérifie photo solution tuteur
- `ai-force-solution` — génère solution IA après 2 échecs
- `ai-resolve-dispute` — arbitre litige élève
- `update-tutor-score` — recalcule score après mission
- `send-reward` — crédite wallet tuteur

**Contenus & Planning**
- `send-revision-reminder` — push matin/soir selon planning élève
- `update-study-plan` — adapte le planning si chapitre marqué "non compris"

**Communauté**
- `send-group-event-reminder` — rappel avant séance de groupe
- `compute-group-leaderboard` — met à jour classement du groupe

**Modération**
- `ai-moderate-message` — analyse chaque message avant publication
- `escalate-flag` — escalade un signalement à l'équipe Cognix

**Gamification**
- `award-xp` — crédite XP après action
- `check-badge-unlock` — vérifie si un badge est débloqué
- `weekly-challenge-start` — lance le défi hebdomadaire Cognix
- `streak-check` — vérifie et récompense les streaks quotidiens

### Nouvelles routes API principales

```
-- Contenus
GET  /api/subjects/:id/chapters
GET  /api/chapters/:id/resources
GET  /api/chapters/:id/exercises
GET  /api/exams                        → annales

-- Planning
GET  /api/study-plan
POST /api/study-plan/generate
PATCH /api/study-plan/tasks/:id

-- Tuteurs (cf. doc tuteurs)
POST  /api/corrections
GET   /api/tutor/missions
...

-- Groupes
POST  /api/groups
GET   /api/groups/:id
POST  /api/groups/:id/join
POST  /api/groups/:id/messages
POST  /api/groups/:id/sessions

-- Gamification
GET   /api/me/xp
GET   /api/me/badges
GET   /api/leaderboard/group/:id
GET   /api/leaderboard/national

-- Parents
POST  /api/parent/link              → lier compte parent à enfant
GET   /api/parent/dashboard
PATCH /api/parent/settings

-- Modération
POST  /api/messages/:id/flag        → signaler un message
POST  /api/users/:id/flag           → signaler un utilisateur
```

---

## Roadmap V2 — Plan de livraison

| Phase | Semaines | Contenu |
|-------|----------|---------|
| **Phase 1** | S1–S3 | DB migrations 021–023 + système tuteurs complet (API + mobile) |
| **Phase 2** | S4–S6 | Bloc contenus (chapitres, cours, fiches, exercices, corrigés) + quiz |
| **Phase 3** | S7–S8 | Annales + simulations + planning de révision |
| **Phase 4** | S9–S11 | Groupes de révision + messagerie sécurisée + modération IA |
| **Phase 5** | S12–S13 | Gamification (XP, badges, classements, défis) |
| **Phase 6** | S14–S15 | Enseignants + contrôle parental + dashboard Cognix complet |
| **Phase 7** | S16–S17 | Sécurité, tests de charge, bêta fermée, corrections |
| **Lancement** | S18 | Déploiement public V2 |

---

## Décisions confirmées

| Sujet | Décision |
|-------|----------|
| Architecture | Une seule version V2 unique, pas de sous-versions |
| Plateforme | Cognix orchestre tous les profils |
| Accès correction tuteur | Inclus dans le Premium |
| Délai correction | 1h30 après acceptation |
| Rémunération tuteur | 250 / 150 / 0 FCFA |
| Format correction | Photo manuscrite obligatoire |
| Qualification tuteur | BAC + CNI, validation 24h, pas de test |
| DM mineurs < 15 ans | Désactivés par défaut |
| Modération | IA avant envoi + signalement humain |
| Enseignants | Compte vérifié, rôle dans les groupes |
| Gamification | XP + badges + classements + défis hebdos |

---

## Ce qui n'est PAS dans V2 (réservé V3)

- Cours en live (streaming vidéo en direct avec un enseignant)
- Tutorat 1-to-1 en visioconférence
- Marketplace de cours particuliers
- Application web desktop avancée (focus mobile V2)
- Intégration avec les bulletins scolaires officiels

---

*Ce document remplace `KELASSI_V2_TUTEURS.md` comme référence principale. Mis à jour au fil des décisions.*

---

## CLAUDE CODE — États de travail

> Liste exhaustive des tâches d'implémentation V2, dans l'ordre d'exécution.  
> Format : `- [ ]` = à faire · `- [x]` = terminé · `- [~]` = en cours

---

### PHASE 1 — Système Tuteurs (S1–S3)

#### Base de données

- [ ] Ajouter `'tutor'` à l'enum `user_role` dans Supabase (migration 021)
- [ ] Créer la table `tutor_profiles` (user_id, bio, id_doc_url, bac_doc_url, is_verified, verified_at, score, wallet_balance, is_active)
- [ ] Créer la table `tutor_subjects` (tutor_id, subject_id) — relation tuteur ↔ matières
- [ ] Créer la table `correction_missions` (id, student_id, tutor_id, subject_id, exercise_url, work_url, status, accepted_at, due_at, delivered_at, attempts, reward_fcfa, ai_verdict, created_at) — migration 022
- [ ] Créer la table `correction_solutions` (id, mission_id, attempt, photo_url, ai_status, ai_feedback, submitted_at)
- [ ] Créer la table `correction_disputes` (id, mission_id, student_id, description, ai_explanation, resolved_at, created_at)
- [ ] Créer la table `tutor_ratings` (id, mission_id UNIQUE, student_id, tutor_id, clarity, quality, comment, created_at) — migration 023
- [ ] Créer la table `tutor_wallet_transactions` (id, tutor_id, mission_id, amount_fcfa, type CHECK IN credit/withdrawal, status, created_at)
- [ ] Écrire les politiques RLS pour toutes les tables tuteurs (élève voit ses missions, tuteur voit les siennes, admin voit tout)
- [ ] Créer les buckets Storage : `exercise-photos`, `student-work`, `tutor-solutions`, `tutor-documents`
- [ ] Configurer les policies Storage (tutor-documents = admin only, autres = owner + parties concernées)

#### API — Routes tuteurs (Hono)

- [ ] `POST /api/corrections` — élève soumet un exercice (upload photo + énoncé, crée la mission en `pending`)
- [ ] `GET /api/corrections/:id` — statut d'une mission (accessible par l'élève concerné)
- [ ] `GET /api/tutor/missions` — liste des missions disponibles pour le tuteur connecté (filtre par matières validées)
- [ ] `POST /api/tutor/missions/:id/accept` — tuteur accepte une mission (passe à `assigned`, calcule `due_at = now + 1h30`)
- [ ] `POST /api/tutor/missions/:id/submit` — tuteur soumet une photo de solution (upload, crée `correction_solutions`, déclenche job `ai-verify-solution`)
- [ ] `GET /api/tutor/wallet` — portefeuille tuteur (balance + historique transactions)
- [ ] `POST /api/tutor/withdraw` — demande de retrait (crée transaction `withdrawal`, appelle CinetPay)
- [ ] `POST /api/corrections/:id/rate` — élève note le tuteur (clarity + quality + comment)
- [ ] `POST /api/corrections/:id/dispute` — élève conteste une correction (crée `correction_disputes`, déclenche `ai-resolve-dispute`)

#### API — Routes admin tuteurs

- [ ] `GET /api/admin/tutors/pending` — liste les tuteurs en attente de validation (is_verified = false)
- [ ] `POST /api/admin/tutors/:id/verify` — valider un compte tuteur (is_verified = true, verified_at = now)
- [ ] `POST /api/admin/tutors/:id/reject` — rejeter un compte tuteur avec motif

#### Jobs BullMQ

- [ ] Job `dispatch-mission` — au moment de la création d'une mission : cherche les tuteurs actifs/vérifiés sur la matière, envoie push notification à chacun dans l'ordre de score décroissant
- [ ] Job `mission-accept-timeout` — planifié 5 min après dispatch : si mission encore `pending`, relancer vers le tuteur suivant dans la file
- [ ] Job `mission-due-timeout` — planifié à `due_at` : si mission encore `assigned` (pas soumise), passe à `failed`, score tuteur pénalisé, IA prend le relais
- [ ] Job `ai-verify-solution` — analyse OCR de la photo solution + vérification Gemini (énoncé + solution) : retourne `ok` ou `error` avec localisation
- [ ] Job `ai-force-solution` — déclenché après 2e tentative échouée : Gemini génère la solution complète, `delivered` à l'élève ET au tuteur, reward = 0
- [ ] Job `ai-resolve-dispute` — Gemini analyse énoncé + solution tuteur + description contestation élève → produit explication détaillée stockée dans `ai_explanation`
- [ ] Job `update-tutor-score` — après chaque mission terminée : recalcule `score = (avg ratings × 0.6) + (taux validation 1re tentative × 0.4)`
- [ ] Job `send-reward` — après solution validée : crédite `wallet_balance` du tuteur et crée transaction `credit`

#### App mobile — Côté élève (Expo)

- [ ] Écran "Faire corriger un exercice" : sélection matière + upload 2 photos (travail + énoncé)
- [ ] Écran suivi de mission : statut en temps réel (pending → assigned → delivered), heure de rendu estimée
- [ ] Notification push "Un tuteur a accepté votre exercice — rendu dans Xh"
- [ ] Notification push "Votre correction est prête !"
- [ ] Écran réception correction : affichage photo solution tuteur + option "Contester"
- [ ] Écran notation tuteur : clarity + quality (étoiles) + commentaire optionnel (visible 24h après réception)

#### App mobile — Côté tuteur (Expo)

- [ ] Écran missions disponibles : liste avec matière, type d'exercice, rémunération, chrono 5 min
- [ ] Notification push mission disponible avec chrono visible
- [ ] Écran détail mission : photo travail élève + énoncé
- [ ] Écran soumission solution : prise de photo manuscrite + envoi
- [ ] Écran feedback IA (si erreur) : affichage de la localisation de l'erreur pour 2e tentative
- [ ] Dashboard wallet : balance, historique gains, bouton "Retirer"
- [ ] Écran score et avis : score global, détail par mission, commentaires élèves

#### Onboarding tuteur

- [ ] Formulaire inscription tuteur : nom, photo, matières, niveau
- [ ] Upload pièce d'identité + diplôme BAC (Supabase Storage, bucket `tutor-documents`)
- [ ] Écran "En attente de validation" (affiché après soumission, jusqu'à validation admin)
- [ ] Email automatique confirmation validation (ou rejet avec motif)

---

### PHASE 2 — Contenus Pédagogiques (S4–S6)

#### Base de données

- [ ] Créer la table `chapters` (id, subject_id, title, order_index, is_premium, created_at) — migration 031
- [ ] Créer la table `chapter_resources` (id, chapter_id, type ENUM cours/résumé/fiche/vidéo/exercice/corrigé, title, content_text, content_url, is_premium, created_at)
- [ ] Bucket Storage `chapter-content` pour les PDFs cours et fiches officielles

#### API

- [ ] `GET /api/subjects/:id/chapters` — liste des chapitres d'une matière
- [ ] `GET /api/chapters/:id` — détail d'un chapitre avec ses ressources
- [ ] `GET /api/chapters/:id/resources` — ressources par type (filtre ?type=cours|résumé|fiche|vidéo|exercice)
- [ ] `POST /api/admin/chapters` — créer un chapitre (admin)
- [ ] `POST /api/admin/chapters/:id/resources` — ajouter une ressource à un chapitre (admin)

#### App mobile

- [ ] Écran liste des matières par niveau (BEPC / BAC A / BAC C / BAC D)
- [ ] Écran chapitres d'une matière avec progression (% chapitres vus)
- [ ] Écran ressource : lecture cours, résumé, fiche avec scroll et zoom
- [ ] Player vidéo YouTube intégré dans l'app
- [ ] Écran exercices d'un chapitre : liste + bouton "Voir corrigé" (débloqué après tentative)
- [ ] Marqueur "Chapitre compris / Non compris" après lecture → déclenche mise à jour planning

---

### PHASE 3 — Annales & Planning (S7–S8)

#### Base de données

- [ ] Créer la table `exam_simulations` (id, user_id, document_id, mode ENUM entraînement/bac_test/bac_blanc/bac_rouge, started_at, finished_at, score, time_taken) — migration 032
- [ ] Créer la table `simulation_results` (id, simulation_id, question_index, user_answer, correct_answer, is_correct, time_spent)
- [ ] Créer la table `study_plans` (id, user_id, exam_date, hours_per_day, generated_at) — migration 033
- [ ] Créer la table `study_plan_tasks` (id, plan_id, chapter_id, scheduled_date, status ENUM pending/done/skipped)

#### API

- [ ] `GET /api/exams` — liste des annales disponibles (par matière, niveau, année)
- [ ] `POST /api/simulations` — démarrer une simulation (crée `exam_simulations`)
- [ ] `POST /api/simulations/:id/submit` — soumettre les réponses (calcule score, crée `simulation_results`)
- [ ] `GET /api/simulations/:id/results` — résultats détaillés avec corrigé
- [ ] `POST /api/study-plan/generate` — générer un planning personnalisé (paramètres : exam_date, matières, hours_per_day)
- [ ] `GET /api/study-plan` — planning actif de l'élève
- [ ] `PATCH /api/study-plan/tasks/:id` — marquer une tâche done/skipped

#### Jobs BullMQ

- [ ] Job `send-revision-reminder` — push matin (7h) et soir (20h) selon les tâches du jour dans le planning
- [ ] Job `update-study-plan` — si chapitre marqué "non compris" : réinsère des sessions de révision supplémentaires dans le planning

#### App mobile

- [ ] Écran annales : filtre par matière / année / mode
- [ ] Écran simulation : timer, questions, navigation entre questions, abandon
- [ ] Écran résultats simulation : score, temps, questions ratées avec corrigé
- [ ] Écran planning semainier : vue calendrier, tâches du jour, progression globale
- [ ] Notifications push planning (matin + soir)

---

### PHASE 4 — Groupes & Messagerie (S9–S11)

#### Base de données

- [ ] Créer `study_groups` (id, name, type ENUM classe/matière/officiel/privé, subject_id nullable, created_by, created_at) — migration 024
- [ ] Créer `group_members` (group_id, user_id, role ENUM member/admin, joined_at)
- [ ] Créer `group_messages` (id, group_id, sender_id, content, photo_url nullable, ai_moderated BOOLEAN, ai_blocked BOOLEAN, created_at)
- [ ] Créer `group_sessions` (id, group_id, title, subject, scheduled_at, duration_min, created_by) — migration 025
- [ ] Créer `session_participants` (session_id, user_id, joined_at)
- [ ] Créer `moderation_flags` (id, message_id nullable, flagged_user_id nullable, reporter_id, reason, status, created_at) — migration 030
- [ ] Créer `moderation_actions` (id, flag_id, admin_id, action, note, created_at)
- [ ] Bucket Storage `group-resources` pour les fiches partagées dans les groupes

#### API

- [ ] `POST /api/groups` — créer un groupe
- [ ] `GET /api/groups` — liste des groupes (rejoints + suggestions)
- [ ] `GET /api/groups/:id` — détail groupe (membres, derniers messages, sessions)
- [ ] `POST /api/groups/:id/join` — rejoindre un groupe
- [ ] `DELETE /api/groups/:id/leave` — quitter un groupe
- [ ] `GET /api/groups/:id/messages` — historique messages (paginé)
- [ ] `POST /api/groups/:id/messages` — envoyer un message (déclenche job `ai-moderate-message` avant publication)
- [ ] `POST /api/groups/:id/sessions` — créer une séance
- [ ] `GET /api/groups/:id/sessions` — liste des séances
- [ ] `POST /api/messages/:id/flag` — signaler un message
- [ ] `POST /api/users/:id/flag` — signaler un utilisateur

#### Jobs BullMQ

- [ ] Job `ai-moderate-message` — analyse le contenu avant publication : insultes, sexuel, harcèlement, coordonnées, liens suspects → bloque ou publie
- [ ] Job `escalate-flag` — si signalement grave (score > seuil) : alerte push à l'équipe Cognix
- [ ] Job `send-group-event-reminder` — rappel push 1h avant une séance de groupe
- [ ] Job `compute-group-leaderboard` — recalcule le classement XP du groupe chaque soir

#### App mobile

- [ ] Écran découverte groupes : recherche, suggestions, groupes rejoints
- [ ] Écran groupe : fil de messages + membres + séances à venir
- [ ] Écran chat groupe : envoi texte + photo, affichage messages en temps réel (Supabase Realtime)
- [ ] Écran création séance : titre, sujet, date/heure, durée
- [ ] Écran séance live : fil dédié + timer de séance
- [ ] Interface signalement : bouton sur message → formulaire motif
- [ ] Restrictions DM selon âge : bouton DM visible seulement si règles d'âge respectées

---

### PHASE 5 — Gamification (S12–S13)

#### Base de données

- [ ] Créer `xp_events` (id, user_id, action, xp_amount, reference_id nullable, created_at) — migration 028
- [ ] Créer `user_xp` (user_id PRIMARY KEY, total_xp, weekly_xp, streak_days, last_active_date)
- [ ] Créer `badges` (id, code, name, description, condition_type, condition_value, icon_url)
- [ ] Créer `user_badges` (user_id, badge_id, earned_at)
- [ ] Créer `challenges` (id, title, type ENUM solo/groupe/inter_groupes/hebdo, xp_reward, starts_at, ends_at, config JSONB) — migration 029
- [ ] Créer `challenge_participants` (challenge_id, user_id, group_id nullable, score, completed_at)

#### API

- [ ] `GET /api/me/xp` — XP total, hebdo, streak, badges débloqués
- [ ] `GET /api/me/badges` — tous les badges avec statut (débloqué / verrouillé)
- [ ] `GET /api/leaderboard/group/:id` — classement XP du groupe
- [ ] `GET /api/leaderboard/national` — classement national par filière (anonymisé si opt-out)
- [ ] `GET /api/challenges` — défis disponibles (solo + hebdo Cognix)
- [ ] `POST /api/challenges/:id/join` — rejoindre un défi

#### Jobs BullMQ

- [ ] Job `award-xp` — déclenché après chaque action éligible (chapitre lu, quiz réussi, etc.) : insère dans `xp_events`, met à jour `user_xp`
- [ ] Job `check-badge-unlock` — après chaque `award-xp` : vérifie si un nouveau badge est débloqué → notifie l'élève
- [ ] Job `streak-check` — chaque nuit à 23h59 : vérifie si l'élève a été actif aujourd'hui, incrémente ou remet à 0 le streak
- [ ] Job `weekly-challenge-start` — chaque lundi matin : crée le challenge hebdomadaire Cognix et notifie tous les élèves actifs
- [ ] Job `weekly-xp-reset` — chaque lundi : remet `weekly_xp` à 0 (pour le classement hebdomadaire)

#### App mobile

- [ ] Widget XP et streak sur l'écran d'accueil
- [ ] Écran profil élève : XP total, streak, badges, rang dans le groupe
- [ ] Écran badges : galerie tous badges (débloqués + verrouillés avec conditions)
- [ ] Écran classements : onglets Groupe / National / Hebdo
- [ ] Écran défis : liste des défis actifs, rejoindre, progression
- [ ] Animation déclenchée quand un badge est débloqué (confetti)
- [ ] Notification push badge débloqué

---

### PHASE 6 — Enseignants, Parents, Dashboards Cognix (S14–S15)

#### Base de données

- [ ] Ajouter `'teacher'` et `'parent'` à l'enum `user_role`
- [ ] Créer `teacher_profiles` (user_id, school, id_doc_url, teaching_certificate_url, is_verified, verified_at) — migration 026
- [ ] Créer `teacher_group_roles` (teacher_id, group_id, can_post_resources, can_launch_quiz, can_moderate)
- [ ] Créer `parent_links` (parent_id, child_id, linked_at) — migration 027
- [ ] Créer `parental_settings` (child_id PRIMARY KEY, dm_enabled, daily_limit_minutes, weekly_report_email)

#### API

- [ ] `POST /api/teacher/register` — inscription enseignant (upload CNI + justificatif)
- [ ] `GET /api/admin/teachers/pending` — liste enseignants en attente de validation
- [ ] `POST /api/admin/teachers/:id/verify` — valider un enseignant
- [ ] `POST /api/parent/link` — lier compte parent à enfant (via code ou email enfant)
- [ ] `GET /api/parent/dashboard` — activité de l'enfant (durée, matières, groupes, alertes)
- [ ] `PATCH /api/parent/settings` — modifier les paramètres (DM, limite temps, rapport email)
- [ ] `GET /api/admin/moderation` — tableau de bord modération (flags en attente, actions récentes)

#### App mobile

- [ ] Écran enseignant dans un groupe : publier ressource, lancer quiz, voir stats membres
- [ ] Interface parent (web ou app séparée légère) : dashboard activité enfant
- [ ] Écran paramètres parent : toggle DM, saisie limite temps, toggle rapport hebdo

#### Dashboard Cognix (web admin)

- [ ] Page validation tuteurs (liste pending → bouton Valider/Rejeter + prévisualisation documents)
- [ ] Page validation enseignants (même logique)
- [ ] Page supervision missions (toutes les missions en cours, failed, disputed)
- [ ] Page modération (tous les flags, messages signalés, actions prises)
- [ ] Page statistiques globales (missions/jour, taux validation IA, XP distribués, utilisateurs actifs)

---

### PHASE 7 — Sécurité, Tests & Bêta (S16–S17)

#### Sécurité

- [ ] Audit RLS Supabase sur toutes les nouvelles tables (aucune fuite cross-user)
- [ ] Vérifier que les buckets Storage `tutor-documents` et `teacher-documents` sont inaccessibles sans rôle admin
- [ ] Limiter le rate des routes sensibles (`/api/corrections`, `/api/tutor/missions/:id/submit`) via middleware Hono
- [ ] Valider les types et tailles des photos uploadées côté API (max 5 MB, JPEG/PNG uniquement)
- [ ] Scanner les URLs des photos avec Gemini avant stockage (détection contenu inapproprié)

#### Tests

- [ ] Tests unitaires jobs BullMQ (dispatch, timeout, ai-verify, ai-force)
- [ ] Tests d'intégration API tuteurs (flux complet mission de bout en bout)
- [ ] Tests RLS : vérifier qu'un tuteur ne peut pas voir les missions d'un autre
- [ ] Tests de charge : simuler 100 missions simultanées et vérifier le dispatch
- [ ] Tests modération IA : corpus de messages (propres + inappropriés) → vérifier taux de détection

#### Bêta fermée

- [ ] Recruter 20–30 tuteurs bêta (étudiants BAC+2/+3 Brazzaville)
- [ ] Recruter 50–100 élèves bêta (Terminale D et BEPC)
- [ ] Mettre en place un canal Slack/WhatsApp de feedback bêta
- [ ] Monitorer les missions en temps réel (dashboard admin) pendant la bêta
- [ ] Corriger les bugs critiques remontés avant lancement public

---

### LANCEMENT — S18

- [ ] Déploiement Vercel (web) + EAS Build (APK Android) + TestFlight (iOS)
- [ ] Activer les notifications push en production (FCM + APNs)
- [ ] Activer CinetPay en mode production (retraits réels tuteurs)
- [ ] Communication lancement (réseaux sociaux, groupes WhatsApp scolaires Congo)
- [ ] Monitoring post-lancement 48h (Sentry, logs Supabase, alertes BullMQ)

---

*Tâches générées le 07/08/2026 — à cocher au fil de l'implémentation.*
