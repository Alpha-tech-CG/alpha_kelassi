# Audit de sécurité Cognix (Alpha Kelassi) — 26/10/2026

Périmètre : `apps/web` (Next.js 15, API de prod, 109 routes), base Supabase `evtqdztycnttegzoleqb` (RLS, fonctions, stockage), `apps/mobile` (Expo), paiements FeexPay.
Méthode : lecture du code, `pnpm audit`, requêtes en lecture seule sur la base de prod (catalogue, politiques, droits) et conseiller sécurité Supabase. **Aucune attaque n'a été lancée contre la production et aucun code n'a été modifié.**

## Synthèse

| # | Sévérité | Problème | Fichier / objet |
|---|---|---|---|
| C1 | **CRITIQUE** | Next.js 15.5.23 : exécution de code à distance sans authentification via l'optimiseur d'images (AVIF/SVG) | `apps/web/package.json:25`, `apps/web/next.config.ts` (`images`) |
| E1 | **ÉLEVÉ** | Code de liaison parent devinable par force brute : accès aux données d'un mineur et à ses réglages parentaux | fonctions `generate_parent_code` / `redeem_parent_code` |
| M1 | MOYEN | XP illimité : quitter puis rejoindre un défi redonne la récompense, ce qui fausse le classement national | politique `participants: own [ALL]` + `list_challenges` (`supabase/migrations/040_challenges.sql:66-85`) |
| M2 | MOYEN | Retrait tuteur : une erreur réseau après un virement réussi recrédite le portefeuille (double paiement) | `apps/web/src/app/api/tutor/withdraw/route.ts:60-84` |
| M3 | MOYEN | Les limites de débit de `/api/auth/*` se contournent (Supabase Auth est joignable en direct) et ne bloquent plus rien si Redis tombe | `apps/web/src/lib/rate-limit.ts`, `lib/redis.ts`, `app/api/auth/*` |
| M4 | MOYEN | La détection des mots de passe divulgués est désactivée alors que l'inscription par mot de passe est ouverte | Supabase Auth |
| M5 | MOYEN | Bucket public `images` : tout compte peut y déposer des images publiques, sans dossier propre | politique `images: authenticated write` |
| F1 | FAIBLE | Redirection ouverte via `next` dans le callback d'authentification | `apps/web/src/app/auth/callback/route.ts:10,17` |
| F2 | FAIBLE | `/api/ai/chat` écrit, avec la clé service, dans une session `session_id` sans vérifier qu'elle appartient à l'appelant | `apps/web/src/app/api/ai/chat/route.ts:181-197,314` |
| F3 | FAIBLE | 4 routes admin ne passent pas par `requireAdmin()` et sautent donc la liste blanche d'e-mails | `admin/documents`, `admin/documents/presign`, `admin/videos`, `admin/quiz/generate` |
| F4 | FAIBLE | Un tuteur peut accepter sa propre demande de correction | `apps/web/src/app/api/tutor/missions/[id]/accept/route.ts` |
| F5 | FAIBLE | Messages d'erreur internes renvoyés au client | `app/api/auth/otp/request/route.ts:44`, `app/api/admin/documents/presign/route.ts:59` |
| F6 | FAIBLE | CSP avec `'unsafe-inline' 'unsafe-eval'` ; `remotePatterns` ouvert à `*.supabase.co` | `apps/web/next.config.ts` |
| F7 | FAIBLE | Insertion anonyme illimitée dans `app_events` (remplissage de la table) | politique `app_events: insert anonymous signup` |
| F8 | FAIBLE | Tables de sauvegarde `backup_057_*` (données d'abonnement) laissées dans `public` | base |
| F9 | FAIBLE | Dépendances : zod 3.25 (déni de service mémoire) ; failles côté mobile limitées à l'outillage de build Expo | `pnpm audit` |
| F10 | FAIBLE | `typescript.ignoreBuildErrors: true` : les erreurs de type, qui peuvent cacher des bugs d'autorisation, n'empêchent pas le déploiement | `apps/web/next.config.ts` |

### Contrôles conformes

- **Secrets** : aucun secret réel n'est suivi par git, historique compris. Seuls les `.env.example`, avec des valeurs fictives, sont versionnés, et `.env*.local` est ignoré.
- **RLS** active sur toutes les tables `public`. Les colonnes sensibles de `users` (`role`, `plan`, `xp`) ne sont pas modifiables par le client : seules 13 colonnes de profil le sont.
- **Paiement FeexPay** solide. Le prix est fixé par le serveur, la transaction est enregistrée avant l'appel, et le statut et le montant sont relus auprès de FeexPay (`decidePayment`). La réclamation est atomique (`pending → successful`), l'index unique bloque les doublons et le suivi vérifie le propriétaire de la référence.
- **Webhook WhatsApp** : signature HMAC `X-Hub-Signature-256` comparée en temps constant, refus par défaut, challenge filtré et renvoyé en `text/plain`.
- **Crons** : `CRON_SECRET` comparé avec `timingSafeEqual`.
- **IDOR** : les routes testées (sessions IA, corrections, missions, suivi de paiement, export de compte, tableau parent) filtrent bien sur `user.id` ou s'appuient sur la RLS.
- **Stockage privé** (`student-work`, `exercise-photos`, `tutor-*`, `teacher-documents`) : un dossier par utilisateur, limite de 5 Mo, images JPEG/PNG uniquement. Les uploads admin vérifient le type MIME, la taille et les magic bytes.
- **En-têtes** : HSTS avec preload, `X-Frame-Options: DENY`, `nosniff`, `Referrer-Policy` et `Permissions-Policy` sont en place. Les routes API n'envoient aucun en-tête CORS (même origine uniquement) et la suppression de compte passe par `DELETE` (pré-requête CORS obligatoire).
- **XSS** : le Markdown web est rendu sans `rehype-raw`, et le WebView mobile désinfecte le HTML. Aucun `child_process`, aucun `eval`, pas de SQL brut (tout passe par PostgREST ou des RPC typées).

---

## Détail des vulnérabilités

### C1 — CRITIQUE — Next.js vulnérable (RCE dans l'optimiseur d'images)

- **Risque** : prise de contrôle du serveur, et donc des variables d'environnement : `SUPABASE_SERVICE_ROLE_KEY`, `FEEXPAY_TOKEN`, clé Gemini.
- **Preuve** : `pnpm audit` remonte `next 15.5.23` (`next >=10.0.0 <=15.5.27`) avec trois avis : « Unauthenticated Remote Code Execution in Image Optimization API when SVG files are used », la même faille pour AVIF, et un DoS des Server Actions. L'application active l'optimiseur (`images.formats: ['image/avif','image/webp']`) et accepte **n'importe quel** hôte `*.supabase.co`. Un attaquant peut donc héberger un fichier piégé dans son propre projet Supabase gratuit et le faire traiter par `/_next/image?url=https://<son-projet>.supabase.co/...`.
- **Correctif** :
  1. `pnpm --filter web add next@^15.5.28` (ou la dernière 15.5.x), puis redéployer.
  2. Restreindre `remotePatterns` à `evtqdztycnttegzoleqb.supabase.co`.
  3. Mettre aussi à jour `sharp` (≥ 0.35.5), qu'utilise l'optimiseur.
- **Vérification** :
  ```bash
  pnpm audit --prod --audit-level critical
  ```
  Le résultat doit être vide pour `apps/web`. Ensuite, `curl -I "https://alpha-kelassi-web.vercel.app/_next/image?url=https://example.supabase.co/x.png&w=64&q=75"` doit renvoyer 400 (hôte non autorisé).

### E1 — ÉLEVÉ — Force brute sur le code parent (données de mineurs)

- **Risque** : n'importe quel compte peut se lier comme « parent » à un élève inconnu. Il voit alors son nom, son XP, ses jours d'activité et ses résultats selon la formule, et peut **modifier ses réglages parentaux** (couper les messages privés, imposer une limite quotidienne).
- **Preuve** : `generate_parent_code()` produit `upper(substr(md5(random()::text || auth.uid()), 1, 6))`, soit 6 caractères hexadécimaux (16,7 millions de valeurs) tirés d'un `random()` non cryptographique, valables 24 h. `redeem_parent_code(p_code)` est appelable par tout compte authentifié via `POST /rest/v1/rpc/redeem_parent_code`, sans limite de tentatives. Avec N codes actifs, une tentative sur ~16,7 M / N réussit : environ 170 000 requêtes pour 100 codes actifs, ce qui se boucle en quelques heures.
- **Correctif** (migration) :
  - Code de 10 caractères au moins, tiré de `gen_random_bytes` (pgcrypto) sur un alphabet base32 sans ambiguïté.
  - Table `parent_code_attempts(user_id, at)` : au-delà de 5 échecs par heure, `redeem_parent_code` lève `TOO_MANY_ATTEMPTS`.
  - Validité ramenée à 1 h et code à usage unique (le code est déjà supprimé après usage).
  - En option : l'enfant confirme la liaison dans l'application avant qu'elle prenne effet.
- **Test** : script SQL dans `supabase/tests/` qui génère un code, fait 6 appels avec de mauvais codes et vérifie que le 6e lève `TOO_MANY_ATTEMPTS`, puis que le bon code est refusé lui aussi tant que le blocage dure.

### M1 — MOYEN — XP infini via les défis

- **Risque** : triche sur le classement national et sur les badges qui en dépendent.
- **Preuve** : la politique `participants: own [ALL]` permet de `DELETE` sa propre participation. `join_challenge` la recrée avec `completed_at = null`, puis `list_challenges()` recompte la progression depuis `c.starts_at` et rappelle `increment_xp(+100)`. Il suffit de répéter `DELETE /rest/v1/challenge_participants?challenge_id=eq.<hebdo>` → `rpc/join_challenge` → `rpc/list_challenges`. `join_challenge` accepte aussi l'identifiant d'un défi solo d'un autre élève.
- **Correctif** :
  - Retirer `DELETE`/`UPDATE` aux clients : `revoke insert, update, delete on challenge_participants from authenticated, PUBLIC`. Les écritures passent alors uniquement par les RPC.
  - Table `challenge_rewards(challenge_id, user_id) primary key`, insérée avant `increment_xp` avec `on conflict do nothing`, et XP crédité seulement si la ligne a bien été insérée.
  - Dans `join_challenge`, refuser les défis `solo` dont `created_by <> auth.uid()`.
- **Test** : avec un jeton élève, `DELETE` d'une participation renvoie 403 ou 0 ligne, et un second `list_challenges()` après avoir rejoint de nouveau ne change pas `users.xp`.

### M2 — MOYEN — Double paiement possible lors d'un retrait tuteur

- **Risque** : perte d'argent réel.
- **Preuve** : `tutor/withdraw/route.ts:60-84`. Le `fetch` vers FeexPay n'a ni délai d'expiration ni lecture du statut en cas de doute. Toute exception (coupure réseau, délai Vercel dépassé, réponse non JSON) et toute réponse `!res.ok` sont traitées comme `FAILED`, ce qui recrédite le portefeuille. Si FeexPay a pourtant exécuté le virement, le tuteur peut retirer la même somme une seconde fois.
- **Correctif** : distinguer « refus certain » (réponse explicite `FAILED`) et « issue inconnue » (exception, 5xx, délai dépassé). Dans le second cas, laisser la transaction en `pending` **sans recréditer**, enregistrer un `provider_ref` ou un identifiant d'idempotence, et confier le rapprochement au cron, qui interroge `GET /api/payouts/status/public/{reference}` (la logique de la migration 050 existe déjà). Ajouter `AbortSignal.timeout(20_000)`.
- **Test** : test unitaire qui simule `fetch` qui lève une erreur et vérifie que `increment_tutor_wallet` **n'est pas** appelé et que la transaction reste `pending`.

### M3 — MOYEN — Limitation de débit contournable

- **Preuve** :
  1. `/api/auth/login`, `otp/request` et `otp/verify` limitent par IP et e-mail ou téléphone, mais l'API Supabase Auth (`/auth/v1/token`, `/auth/v1/otp`, `/auth/v1/verify`) est appelable directement avec la clé anon publique, livrée dans l'APK. Les seules limites réelles sont celles du tableau de bord Supabase.
  2. `rateLimit()` ne bloque plus rien si Upstash est absent ou en panne (`incr` renvoie 1), et `redis.ts` remplace même Redis par un objet vide quand les variables manquent.
- **Correctif** :
  - Dans Supabase → Authentication → Rate limits : SMS/OTP ≈ 5 par heure et par numéro, vérifications ≈ 30 par heure et par IP, connexions ≈ 30 par 5 min et par IP. Activer CAPTCHA (hCaptcha ou Turnstile) sur l'inscription et l'envoi d'OTP pour éviter la fraude SMS.
  - Vérifier que `UPSTASH_REDIS_REST_URL`/`TOKEN` sont bien posés en Production sur Vercel.
  - Pour `login`, `otp*`, `register` et `withdraw`, **bloquer** quand Redis est indisponible (variante `rateLimitStrict`).
- **Vérification** : 6 POST rapides sur `/api/auth/otp/verify` avec un mauvais code doivent donner un 429 au 6e. À rejouer **sur un numéro de test, en préproduction**.

### M4 — MOYEN — Mots de passe divulgués acceptés

- **Preuve** : conseiller Supabase `auth_leaked_password_protection` = désactivé. Or `/api/auth/register` et `/api/auth/login` utilisent bien des mots de passe.
- **Correctif** : Supabase → Authentication → Policies → activer « Leaked password protection ».
- **Vérification** : refaire tourner le conseiller sécurité Supabase. L'alerte doit disparaître.

### M5 — MOYEN — Bucket public `images` ouvert en écriture à tous les comptes

- **Risque** : sur une plateforme destinée à des mineurs, n'importe qui peut héberger des images publiques sous le domaine Supabase du projet (contenu inapproprié, hameçonnage) et remplir le stockage.
- **Preuve** : politique `images: authenticated write [INSERT]` = `bucket_id='images' AND auth.uid() IS NOT NULL`, sans contrainte de dossier. Le bucket est `public=true` (limite de 5 Mo, jpeg/png/webp).
- **Correctif** : imposer le dossier propre `(storage.foldername(name))[1] = auth.uid()::text`, ou réserver l'écriture aux admins si le bucket ne sert qu'aux contenus. Interdire le listing.
- **Test** : un élève qui fait `POST /storage/v1/object/images/autre-dossier/x.png` doit recevoir 403.

### F1 — FAIBLE — Redirection ouverte dans `/auth/callback`

- **Preuve** : `NextResponse.redirect(`${origin}${next}`)` avec `next` fourni par l'utilisateur. `next=@evil.com` donne `https://kelassi.app@evil.com`, et `next=.evil.com` donne `https://kelassi.app.evil.com`. L'exploitation exige toutefois un `code` valide pour la victime, ce que PKCE rend difficile.
- **Correctif** : n'accepter que `next` qui commence par `/` sans être suivi de `/` ni de `\` : `const safe = /^\/(?![\/\\])/.test(next) ? next : '/dashboard'`.
- **Test** : `GET /auth/callback?code=x&next=@evil.com` ne doit jamais renvoyer `Location` vers un autre hôte.

### F2 — FAIBLE — Écriture dans la session IA d'un autre élève

- **Preuve** : `ai/chat/route.ts:181`. Un `session_id` fourni est réutilisé tel quel, puis `saveChatMessages(getAdmin(), …)` insère avec la clé service, qui contourne la RLS. Il faut connaître l'UUID de la victime, ce qui limite fortement le risque.
- **Correctif** : si `body.session_id` est fourni, vérifier `chat_sessions.user_id = user.id` avec le client utilisateur (sinon 404), ou insérer les messages avec le client utilisateur, la RLS `chat_messages: insert via own session` existant déjà.
- **Test** : un élève A qui envoie le `session_id` de B doit recevoir 404, et la table `chat_messages` de B doit rester inchangée.

### F3 — FAIBLE — Routes admin sans liste blanche d'e-mails

- **Preuve** : les 4 routes de la synthèse vérifient `role = 'admin'` mais pas `isAllowedAdminEmail`. La défense en profondeur promise par `admin-guard.ts` n'y est donc pas.
- **Correctif** : remplacer le contrôle maison par `const auth = await requireAdmin(); if ('error' in auth) return auth.error`.
- **Test** : `grep -L requireAdmin $(find apps/web/src/app/api/admin -name route.ts)` doit renvoyer une liste vide.

### F4 — FAIBLE — Auto-correction rémunérée

- **Preuve** : `accept/route.ts` ne compare pas `mission.student_id` à `user.id`. Un tuteur vérifié qui est aussi élève peut accepter ses propres demandes et être payé (250 FCFA). C'est peu rentable aujourd'hui, mais cela fausse le score du tuteur.
- **Correctif** : ajouter `.neq('student_id', user.id)` à la mise à jour conditionnelle.

### F5 — FAIBLE — Fuite de messages d'erreur internes

- `otp/request` renvoie `error.message` de Supabase, qui révèle la configuration du fournisseur SMS, et `presign` renvoie l'erreur brute du stockage.
- **Correctif** : message générique + `console.error`, comme dans le reste du code.

### F6 — FAIBLE — CSP permissive

- `script-src 'self' 'unsafe-inline' 'unsafe-eval'` retire à la CSP l'essentiel de sa valeur contre les XSS. À terme : nonces Next.js (`middleware` + `headers()`), puis retirer `'unsafe-eval'` si le worker react-pdf le permet. Ajouter `frame-ancestors 'none'`, plus moderne que `X-Frame-Options`.

### F7 — FAIBLE — `app_events` en insertion anonyme

- Un visiteur non connecté peut insérer sans limite (`device_id` arbitraire). **Correctif** : faire passer les événements anonymes par une route API limitée par IP, ou ajouter une fonction de contrôle de débit.

### F8 — FAIBLE — Tables de sauvegarde en production

- `backup_057_subscriptions` et `backup_057_users_plan` (RLS sans politique, donc illisibles par les clients). Les exporter hors ligne puis faire `drop table`.

### F9 — FAIBLE — Autres dépendances

- `zod 3.25.76` (épuisement mémoire sur des collections surdimensionnées) : vérifier que chaque `z.array()` côté serveur a un `.max()`.
- Mobile : `shell-quote`, `fast-uri`, `node-forge` et `brace-expansion` arrivent par `@expo/cli`, `expo-dev-client` et `react-devtools-core`, c'est-à-dire l'outillage de développement et de build, absent de l'APK de production. Ne pas embarquer `expo-dev-client` dans le profil `production` d'EAS.
- `pnpm audit` total : 4 critiques, 26 élevées, 19 modérées, 5 faibles.

### F10 — FAIBLE — Build qui ignore les erreurs TypeScript

- `ignoreBuildErrors: true` : la régénération des types Supabase (`pnpm db:generate-types`) devient un prérequis pour remettre le contrôle en place.

---

## À vérifier hors du code (non vérifiable en lecture seule)

1. **Supabase Auth** : limites de débit, durée de vie du JWT (≤ 1 h) et des refresh tokens (rotation et détection de réutilisation activées), expiration des OTP (≤ 5 min), **liste des URL de redirection** sans joker large.
2. **Vercel, variables de production** : `UPSTASH_REDIS_REST_*`, `CRON_SECRET`, `WHATSAPP_APP_SECRET`, `FEEXPAY_*` présentes. `SUPABASE_SERVICE_ROLE_KEY` ne doit **jamais** porter le préfixe `NEXT_PUBLIC_`.
3. **Mobile** : vérifier que l'APK ne contient que `EXPO_PUBLIC_SUPABASE_ANON_KEY` (par exemple `unzip -p app.apk assets/index.android.bundle | grep -c service_role` doit renvoyer 0).
4. **FeexPay** : URL de rappel en HTTPS, pointée sur `/api/billing/feexpay/webhook`.
5. **Vercel Firewall** : règle de limite de débit sur `/api/auth/*` et `/api/billing/*` (défense au niveau du réseau).

## Actions avant la mise en production (par ordre)

1. **[C1]** Mettre à jour Next.js (≥ 15.5.28) et sharp, restreindre `remotePatterns`, redéployer. *Le jour même.*
2. **[E1]** Migration du code parent : code long et cryptographique, limite de tentatives, validité 1 h.
3. **[M1]** Retirer les droits d'écriture client sur `challenge_participants` et rendre la récompense idempotente.
4. **[M2]** Retrait tuteur : ne plus recréditer quand l'issue est inconnue, rapprochement par le cron.
5. **[M3/M4]** Supabase Auth : limites de débit, CAPTCHA, protection contre les mots de passe divulgués. Vérifier Upstash en prod, mode strict sur les routes sensibles.
6. **[M5]** Restreindre l'écriture du bucket `images`.
7. **[F1–F5]** Correctifs courts : redirection, session IA, `requireAdmin` partout, auto-acceptation, messages d'erreur.
8. Relancer `pnpm audit` et le conseiller sécurité Supabase, puis les tests de validation ci-dessus **en préproduction**.
9. **[F6–F10]** Après le lancement : CSP à nonces, `app_events`, tables de sauvegarde, types Supabase.
