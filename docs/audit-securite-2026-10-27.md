# Audit de sécurité — 27/10/2026 (site + application)

Second audit après celui du 26/10 (`docs/audit-securite-2026-10-26.md`), qui a été entièrement corrigé côté code. Il couvre aussi tout ce qui a été ajouté depuis : la console réorganisée, la création de comptes, le bannissement, les annonces dans l'app, le service worker, la CSP à nonce et la mesure de vitesse.

**Méthode.** Le test a été passif en production : lecture des en-têtes et appels sans session uniquement, aucune attaque. Tout le reste est une lecture de la base et du code :
- côté base : alertes Supabase, règles RLS table par table, droits par colonne, stockage ;
- côté code : les 110 routes API, l'application mobile (secrets, WebView, liens, stockage) et `pnpm audit`.

## Synthèse

| Réf. | Gravité | Problème | Où |
|---|---|---|---|
| E1 | **ÉLEVÉ** | Les bonnes réponses des QCM (`correct_index`, `explanation`) se lisent directement dans la base | `quiz_questions` |
| M1 | MOYEN | Un compte peut insérer sa propre ligne `users` avec `role`, `plan` et `xp` (faille latente) | `users` (droits + règle d'insertion) |
| M2 | MOYEN | N'importe qui, sans compte, peut écrire dans la file du support et choisir la priorité | `beta_feedback` |
| M3 | MOYEN | La protection contre les mots de passe divulgués est toujours désactivée | Supabase Auth (réglage) |
| M4 | MOYEN | Aucun plafond d'événements pour les comptes connectés | `app_events` (déclencheur 073) |
| F1 | FAIBLE | L'élève peut écrire sa propre progression (leçons, résultats de bac blanc, série de jours) | RLS « own » |
| F2 | FAIBLE | `zod` 3.25 : risque de saturation mémoire sur de très gros tableaux | `apps/web` |
| F3 | FAIBLE | Alertes sur des dépendances de compilation (Expo, Rollup), non embarquées | `pnpm audit` |
| F4 | FAIBLE | Les liens dans une leçon s'ouvrent dans la WebView ; Markdown rendu sans nettoyage | `MathLessonView`, `lecon/[id]` |
| F5 | FAIBLE | Sauvegarde Android automatique non désactivée | `app.json` |
| F6 | FAIBLE | En-tête `X-Powered-By: Next.js` | `next.config.ts` |

**Vérifié sans problème :**
- RLS est active sur toutes les tables, et aucune règle d'écriture n'est ouverte à tous (`true`).
- Les 48 routes `/api/admin` passent toutes par `requireAdmin` (liste blanche d'e-mails + rôle).
- Les routes qui prennent un identifiant (corrections, missions, groupes, planning, paiements) vérifient toutes que l'élément appartient à l'appelant.
- Le webhook FeexPay relit le statut chez FeexPay au lieu de croire ce qu'il reçoit.
- Stockage : les buckets privés ne sont accessibles qu'au propriétaire ou aux admins, et aucun bucket public n'accepte d'écriture côté client.
- Les solutions d'exercices ne se débloquent qu'après une tentative, et le barème ne contient que des points.
- Application :
  - aucun secret dans le code ni dans la configuration (seule la clé publique Supabase y figure) ;
  - session stockée chiffrée (SecureStore) ;
  - permission unique : INTERNET.
- En-têtes de production : CSP à nonce sans `unsafe-inline` ni `unsafe-eval`, HSTS avec preload, `X-Frame-Options: DENY`, `nosniff`.
- Les nouvelles routes de comptes refusent tout appel sans session (401). Le bannissement a été testé de bout en bout le 27/10 : connexion refusée et session déjà ouverte non renouvelée.

---

## E1 — ÉLEVÉ — Les corrigés des QCM se lisent directement dans la base

**Constat.** L'API `/api/quiz/:id` ne renvoie jamais `correct_index` ni `explanation`. Mais la table `quiz_questions` laisse le rôle `authenticated` (et `anon`) lire toutes ses colonnes. La règle RLS limite seulement les lignes aux QCM auxquels la formule de l'élève donne accès.

**Exploitation.** Il suffit d'avoir un compte élève, la clé publique (présente dans l'app) et une requête `GET /rest/v1/quiz_questions?quiz_id=eq.<id>&select=correct_index,explanation`. L'élève obtient alors le corrigé de tout QCM qu'il peut passer, avant de répondre.

**Risque métier.**
- Triche sur les bacs blancs, les bacs « rouges » et les QCM de chapitre.
- Classements, défis et XP faussés.
- Perte de crédibilité de la Prépa auprès des élèves et des parents.

**Correction proposée (migration 078).**
- Retirer la lecture de toute la table, puis la redonner colonne par colonne (`id, quiz_id, position, prompt, options, created_at…`), sans `correct_index` ni `explanation`.
- La fonction serveur `submit_quiz_attempt` (security definer) et les routes en clé de service continuent de les lire.
- Vérifié dans le code : ni le site ni l'app ne lisent ces colonnes directement. Les corrigés arrivent par la fonction serveur après la soumission.
- Test : un élève reçoit un refus sur `select correct_index`, et le passage normal d'un QCM fonctionne toujours.

## M1 — MOYEN — Insertion de sa propre ligne `users` avec rôle et formule

**Constat.** Le rôle `authenticated` a le droit `INSERT` sur toutes les colonnes de `users`, y compris `role`, `plan` et `xp`. La règle « users: insert on signup » exige seulement `id = auth.uid()`.

**Pourquoi ce n'est pas exploitable aujourd'hui.**
- Le trigger `handle_new_user` crée la ligne à l'inscription, donc une insertion par l'élève échoue (clé déjà prise).
- Aujourd'hui, aucun compte n'existe sans profil.
- Rien dans le code n'insère dans `users`.

**Pourquoi le corriger quand même.** Avant le 20/10, le trigger d'inscription était cassé (migrations 066-068). Pendant cette période, un nouvel inscrit pouvait insérer sa ligne avec `role = 'admin'`. Il obtenait alors l'écriture sur tous les contenus, les annonces et les portefeuilles tuteurs, par les règles « admin all » (sans passer par la console, protégée par la liste blanche).

**Correction proposée (migration 078).** Supprimer la règle « users: insert on signup » et retirer `INSERT` sur `users` à `anon` et `authenticated`. Seul le trigger insère.

## M2 — MOYEN — File du support ouverte aux visiteurs

**Constat.** La règle « user insère son feedback » de `beta_feedback` accepte `user_id IS NULL`, avec toutes les colonnes : `priority`, `status`, `plan`, `kind`. Or le site et l'app envoient leurs retours par `/api/feedback`, en clé de service.

**Risque.** Sans compte, n'importe qui peut remplir la file Support et le bloc « À traiter » de la vue d'ensemble, en se donnant la priorité maximale.

**Correction proposée (migration 078).** Supprimer la règle et retirer `INSERT` à `anon` et `authenticated`. Seule l'API, qui authentifie et limite le débit, écrit.

## M3 — MOYEN — Protection contre les mots de passe divulgués (rappel)

C'est le point M4 de l'audit du 26/10, toujours désactivé. C'est un réglage à faire par vous : Supabase → Authentication → Providers → Email → « Prevent use of leaked passwords ».

**Fait le 27/10/2026** : option activée par l'utilisateur dans le tableau de bord Supabase.

## M4 — MOYEN — Événements illimités pour les comptes connectés

**Constat.** Le déclencheur de la migration 073 borne la taille de chaque événement pour tous, mais le **débit** seulement pour les visiteurs anonymes. Un compte connecté peut insérer sans limite dans `app_events`, directement par REST. Depuis le 26/10, chaque page vue en produit aussi 3 lignes de mesure de vitesse.

**Risque.** Une table remplie, et des statistiques de la console faussées.

**Correction proposée (migration 078).** Ajouter au déclencheur un plafond par compte, par exemple 1 500 événements par heure. Un élève très actif en produit quelques dizaines.

## Points FAIBLES

- **F1 :** les règles « own » sur `lesson_progress`, `exam_results`, `exercise_attempts` et `user_progress` laissent l'élève écrire sa propre progression. La triche se limite à lui-même (badges, défis), et une récompense de défi n'est versée qu'une fois (migration 071). Les classements utilisent `users.xp`, que l'élève ne peut pas modifier. À garder en tête si un jour des récompenses dépendent de ces tables.
- **F2 :** `zod` 3.25.76 est visé par une alerte de saturation mémoire. Le plafond de 4,5 Mo de Vercel sur les requêtes et les bornes posées le 26/10 (F9) limitent l'impact. Passer à zod 4 est un changement majeur, à prévoir à part.
- **F3 :** 1 alerte critique et environ 20 élevées dans `pnpm audit`, toutes dans des outils de compilation : Expo CLI et Metro (`shell-quote`, `js-yaml`, `undici`, `node-forge`…), et Rollup ou `fast-uri` via `@sentry/nextjs`. Rien de tout cela n'est embarqué dans l'APK ni dans les fonctions du site. À traiter à la prochaine montée de version d'Expo et de Sentry.
- **F4 :** dans les WebView des leçons, un lien du contenu s'ouvre dans la WebView, et le Markdown est rendu sans nettoyage. Le contenu est écrit par les admins uniquement. À ajouter : `onShouldStartLoadWithRequest`, pour ouvrir les liens dans le navigateur (build EAS).
- **F5 :** `android.allowBackup` n'est pas mis à `false`. La session est chiffrée par le Keystore, donc illisible dans une sauvegarde, mais c'est l'usage recommandé (build EAS).
- **F6 :** l'en-tête `X-Powered-By: Next.js` révèle la technologie du site. À retirer avec `poweredByHeader: false`.

## Plan proposé

1. **Lot A, migration 078 (base seule, effet immédiat) :** E1, M1, M2 et M4, avec un test SQL dans une transaction annulée, comme pour 070 à 077. E1 sera vérifié en essayant de passer un vrai QCM après la migration.
2. **Lot B (site) :** F6.
3. **Lot C (app, prochain build EAS) :** F4 et F5.
4. **Lot D, à votre charge :** M3 dans Supabase Auth.

## Suivi (27/10/2026)

- Lot A : migration 078 appliquée et testée en production (commit 28bc493).
- Lot B : F6 déployé (commit 18fd245), plus d'en-tête `X-Powered-By` en production.
- Lot C : F4 et F5 commités en 1.0.15 (c051146) ; build EAS repoussé au 01/11 (quota gratuit épuisé).
- Lot D : M3 activé par l'utilisateur.
5. **Plus tard :** F2 et F3, à la prochaine montée de version de zod, Expo et Sentry.
