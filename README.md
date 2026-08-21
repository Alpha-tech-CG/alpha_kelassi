# Alpha Kelassi 🎓

**App mobile & web de préparation aux examens d'État — Congo Brazzaville** (CEPE, BEPC, BAC).

Cours structurés, annales officielles corrigées, tuteur IA hors-ligne, groupes d'étude modérés, gamification et calendrier scolaire — pensé pour une connexion mobile intermittente et le paiement Mobile Money.

---

## ✨ Fonctionnalités

- **Cours structurés** — série → chapitre → sous-chapitre → leçon, avec rendu mathématique (KaTeX) et markdown embarqués (100 % hors-ligne sur mobile).
- **Annales & examens** — épreuves d'État officielles avec corrigés ; 4 modes de simulation (entraînement, test, blanc, rouge).
- **Tuteur IA « Kelassi »** — RAG sur les documents de cours (pgvector), méthode Feynman, analogies locales, quota journalier.
- **Flashcards** — répétition espacée (SM-2).
- **Système de tuteurs** — fiches + exercices/corrigés débloqués par tentative, wallet tuteur.
- **Groupes d'étude** — chat temps réel modéré par IA (regex + Gemini).
- **Gamification** — classements, badges, défis solo/hebdomadaires.
- **Dashboards** — admin (validation tuteurs/enseignants, modération), enseignants, contrôle parental.
- **Planning & rappels** — calendrier scolaire CEPE/BEPC/BAC + rappels WhatsApp.

---

## 🧱 Stack technique

| Couche | Technologie |
|--------|-------------|
| **Web / API produit** | Next.js 15 (App Router) — sert le site élève **et** l'API REST consommée par le web et le mobile |
| **Mobile** | Expo 52 (React Native) + Expo Router ; KaTeX/marked embarqués pour le rendu hors-ligne |
| **Service de fond** | Hono (`apps/api`) — webhooks paiement/WhatsApp + worker de rappels (BullMQ) |
| **Base de données** | Supabase (PostgreSQL + pgvector + Auth + Storage), RLS sur toutes les tables |
| **Cache / quotas / queue** | Upstash Redis |
| **IA** | Google Gemini (`@google/genai`) + embeddings `text-embedding-004` (vecteurs 768d, index HNSW) |
| **Paiements** | Stripe (carte) + FeexPay (Mobile Money, paiement push) |
| **Messagerie** | WhatsApp Cloud API + SMS OTP (Africa's Talking) |
| **Monitoring** | Sentry (web + api) |
| **Monorepo** | pnpm workspaces + Turborepo |
| **Déploiement** | Vercel (web) · hébergement Node (api) · EAS Build (mobile) |

> ℹ️ **À noter** : l'API de production est **Next.js** (`apps/web/src/app/api`), pas le service Hono. `apps/api` héberge uniquement les webhooks et les jobs de fond. Le stockage offline WatermelonDB du mobile est désactivé au profit d'un cache léger (`lessonCache`).

---

## 📁 Structure du monorepo

```
alpha-kelassi/
├── apps/
│   ├── web/            # Next.js — site élève + API REST (route handlers)
│   ├── mobile/         # Expo — app Android/iOS
│   └── api/            # Hono — webhooks (Stripe/FeexPay/WhatsApp) + worker rappels
├── packages/
│   ├── types/          # Types TS partagés (dont Database générés par Supabase)
│   ├── ui/             # Composants UI web partagés
│   └── config/         # Configs ESLint / Prettier / TS
├── supabase/
│   ├── migrations/     # Schéma PostgreSQL + RLS (047 migrations)
│   └── seed_series.sql
├── scripts/            # Scripts d'import/seed de contenu (Maths, Physique, SVT…)
├── k6/                 # Test de charge (load-test.js)
├── docs/               # Documentation, specs, métadonnées store
└── resources/          # Médias, schémas, maquettes
```

---

## 🚀 Démarrage rapide

### Prérequis

- **Node.js ≥ 22**
- **pnpm ≥ 9** (`npm install -g pnpm`)
- **Supabase CLI** (`npm install -g supabase`) + **Docker** (pour le stack local)

### Installation

```bash
# 1. Cloner et installer
git clone https://github.com/apha-tech/alpha-kelassi
cd alpha-kelassi
pnpm install

# 2. Variables d'environnement
cp .env.example .env.local
# → renseigner les clés (voir section ci-dessous)

# 3. Base de données locale (Docker requis)
supabase start
supabase db push          # applique les migrations
supabase gen types typescript --local > packages/types/src/database.ts

# 4. Lancer tous les apps (Turborepo)
pnpm dev
```

### Lancer un app individuellement

```bash
pnpm --filter web dev        # Next.js  → http://localhost:3000
pnpm --filter api dev        # Hono (webhooks + jobs)
pnpm --filter mobile dev     # Expo (Metro)
```

---

## 🔑 Variables d'environnement

Copier `.env.example` → `.env.local` et renseigner. Groupes principaux :

| Domaine | Clés |
|---------|------|
| **Supabase** | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_DB_URL` |
| **Redis / Queue** | `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `QUEUE_REDIS_URL` |
| **IA** | `GEMINI_API_KEY` |
| **Stripe** | `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_PREMIUM_MONTHLY`, `STRIPE_PRICE_PREMIUM_YEARLY` |
| **FeexPay** | `FEEXPAY_TOKEN`, `FEEXPAY_SHOP`, `FEEXPAY_CALLBACK_URL` |
| **WhatsApp** | `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_API_VERSION`, `WHATSAPP_VERIFY_TOKEN`, `WHATSAPP_APP_SECRET` |
| **SMS OTP** | `AT_API_KEY`, `AT_USERNAME`, `AT_SENDER_ID` |
| **App** | `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_APP_ENV`, `NODE_ENV` |

> ⚠️ `SUPABASE_SERVICE_ROLE_KEY` et les secrets de webhook ne doivent **jamais** être préfixés `NEXT_PUBLIC_`. Le service role contourne la RLS — réservé au serveur.

---

## 🗄️ Base de données & migrations

- Schéma et politiques dans `supabase/migrations/` (numérotées `001` → `047`).
- **RLS activée sur toutes les tables** ; les colonnes sensibles de `users` (`role`, `plan`, `xp`) ne sont modifiables que par le service role.
- Recherche sémantique via `pgvector` (index HNSW, cosine).

```bash
supabase db push                                   # appliquer les migrations
supabase migration new <nom>                       # créer une migration
supabase gen types typescript --local > packages/types/src/database.ts
```

---

## 🔒 Sécurité

Le projet a fait l'objet de plusieurs audits (voir historique des migrations `022`–`024`, `043`, `046`, `047`).

- **RLS** sur l'intégralité des tables ; anti-escalade de privilèges (grants au niveau colonne).
- **Webhooks paiement** : Stripe (`constructEvent`), FeexPay (callback non signé → l'intention d'achat est liée au serveur à l'init, puis **re-vérification du statut et du montant** côté serveur avant d'accorder le premium), WhatsApp (`X-Hub-Signature-256`, fail-closed).
- **En-têtes HTTP** : CSP, HSTS (`preload`), `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`.
- **Storage** : bucket premium privé (accès gated par plan), uploads limités (5 Mo, images uniquement), écriture admin-only sur les buckets publics.
- **Rate-limiting & quotas IA** via Upstash Redis (fail-open pour ne jamais casser l'appelant).
- **Validation** des entrées par Zod sur les routes.

---

## 📈 Test de charge

Scénario k6 simulant jusqu'à 500 utilisateurs simultanés sur les endpoints critiques :

```bash
# Smoke test local
k6 run --vus 50 --duration 2m k6/load-test.js

# Test complet contre la prod
k6 run --env API_URL=https://<domaine> --env TOKEN=<jwt> k6/load-test.js
```

Seuils : p95 < 2 s, taux d'erreur < 1 %.

---

## 🚢 Déploiement

| Cible | Méthode |
|-------|---------|
| **Web + API produit** | Vercel (`apps/web`) — build `pnpm build` |
| **Service de fond** (`apps/api`) | Hôte Node (`pnpm --filter api build && pnpm --filter api start`) — nécessaire pour les webhooks et le worker de rappels |
| **Mobile** | EAS Build (`pnpm --filter mobile build:android` / `build:ios`) |
| **Base de données** | `supabase db push` vers le projet distant |

---

## 🛠️ Scripts utiles (racine)

```bash
pnpm dev          # tous les apps en dev (Turborepo)
pnpm build        # build de tous les packages/apps
pnpm lint         # lint monorepo
pnpm type-check   # vérification TypeScript
pnpm format       # Prettier
pnpm test         # tests
```

Les scripts de `scripts/` servent à importer/seeder le contenu pédagogique (ex. `node scripts/seed-physique-tc-td.mjs`).

---

## 📄 Licence

Projet privé — © Alpha Tech. Tous droits réservés.
