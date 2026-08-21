# Politique de sécurité

Alpha Kelassi (Cognix) est une plateforme éducative (web, mobile, API) utilisée par des élèves,
tuteurs, enseignants et parents. Nous prenons au sérieux tout signalement de vulnérabilité.

## Signaler une vulnérabilité

Envoie un email à **privacy@kelassi.app** avec :

- une description de la vulnérabilité et de son impact potentiel ;
- les étapes pour la reproduire (URL, requête, compte de test si besoin) ;
- si possible, une suggestion de correctif ou de mitigation.

Merci de **ne pas** divulguer publiquement (issue GitHub, réseaux sociaux, forum) avant que le
correctif soit déployé — nous te créditerons volontiers une fois le problème résolu, si tu le
souhaites.

**Ne fais pas** : exfiltration de données réelles d'utilisateurs, déni de service sur nos
environnements de production, ingénierie sociale contre l'équipe ou les utilisateurs. Les tests
de type "preuve de concept" limités et non destructifs sont les bienvenus.

## Délai de réponse visé

- Accusé de réception : sous 72 heures.
- Premier avis (sévérité estimée, prochaine étape) : sous 7 jours.
- Correctif pour une faille critique (accès non autorisé aux données, contournement RLS,
  élévation de privilège, fuite de secrets) : traité en priorité, déploiement visé sous 14 jours.

## Portée

- **Web** : `apps/web` (Next.js, déployé sur Vercel — app élèves/tuteurs/enseignants + back-office admin).
- **Mobile** : `apps/mobile` (Expo/React Native, Android/iOS).
- **API** : routes `apps/web/src/app/api/**` (API de production) ; `apps/api` (Hono, non utilisé en prod actuellement).
- **Base de données** : Supabase (Postgres + RLS), migrations dans `supabase/migrations/**`.

Hors périmètre : infrastructure tierce (Vercel, Supabase, Upstash, FeexPay eux-mêmes), attaques
purement théoriques sans preuve d'exploitabilité, rapports issus de scanners automatiques sans
validation manuelle.

## Mesures déjà en place

- **RLS Supabase** activé sur les tables sensibles (paiements, comptes, messages, notes/évaluations)
  avec policies par rôle (élève/tuteur/enseignant/parent/admin) — voir `supabase/migrations/`.
- **CSP** (Content-Security-Policy) et en-têtes de sécurité (HSTS, X-Frame-Options,
  X-Content-Type-Options, Referrer-Policy, Permissions-Policy) sur `apps/web`
  (`apps/web/next.config.ts`).
- **Authentification** via Supabase Auth (JWT), vérification serveur systématique dans les routes API.
- **Paiements** (Mobile Money via FeexPay) : vérification serveur du statut des transactions, pas
  de confiance dans les callbacks client seuls.
- **Scan de secrets** automatisé sur chaque push/PR (Gitleaks, `.github/workflows/gitleaks.yml`).
- **Revue de sécurité automatisée** sur chaque PR (`.github/workflows/security-review.yml`).
- **Audit des dépendances** (Dependabot + `pnpm audit` en CI).
- **Monitoring d'erreurs** (Sentry) sur `apps/web` pour détecter les anomalies en production.

Ce document est amené à évoluer ; n'hésite pas à signaler s'il te semble incomplet ou obsolète.
