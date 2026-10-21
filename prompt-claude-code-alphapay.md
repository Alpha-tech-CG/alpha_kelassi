# Prompt Claude Code — AlphaPay : interfaces manquantes

## Contexte

Projet AlphaPay (monorepo Turborepo). Stack :
- `apps/api/` — NestJS, guards `InternalGuard` (header `X-Internal-Token`) et `WalletJwtGuard`
- `admin/` — React + Vite + Clerk, appels via proxy `/admin-api` → `api.js`
- `mobile/app/` — Expo Router (React Native)
- Base de données : Prisma (`@paybrain/database`)

L'inscription client mobile **existe déjà** dans `mobile/app/index.tsx` (3 étapes : identité → PIN → OTP SMS).  
Le panel admin **merchant KYC** existe dans `admin/src/pages/Kyc.jsx`.

**Ce qui manque :**
1. Un endpoint API interne pour gérer les wallets clients depuis l'admin
2. Une page admin pour voir et valider manuellement les wallets clients
3. Le câblage (route + nav + RBAC)

---

## Tâche 1 — API : `apps/api/src/modules/wallet/wallet-admin.controller.ts`

Créer un nouveau contrôleur NestJS protégé par `InternalGuard` (comme `KycAdminController`).

```
@Controller('internal/wallets')
@UseGuards(InternalGuard)
```

Endpoints à créer (appelle le service Prisma directement, comme `KycAdminController`) :

```
GET  /internal/wallets
  - Query params: status (PENDING_VERIFICATION | ACTIVE | BLOCKED), phone (partial search), page, limit (défaut 50)
  - Retourne : id, phone, fullName, status, balanceCents, kycLevel, createdAt, lastLoginAt
  - Tri : createdAt DESC

GET  /internal/wallets/:id
  - Retourne le wallet complet + 10 dernières transactions (type, amountCents, status, createdAt, description)

POST /internal/wallets/:id/activate
  - Passe le wallet de PENDING_VERIFICATION → ACTIVE
  - Body : { officer: string, reason?: string }
  - Erreur 400 si déjà ACTIVE ou BLOCKED

POST /internal/wallets/:id/block
  - Passe le wallet → BLOCKED
  - Body : { officer: string, reason: string }  (reason obligatoire)

POST /internal/wallets/:id/unblock
  - Passe BLOCKED → ACTIVE
  - Body : { officer: string, reason: string }
```

Ajouter ce contrôleur dans `wallet.module.ts`.

Modèle Prisma du wallet : `WalletClient` (champs : `id`, `phone`, `fullName`, `status`, `balanceCents`, `kycLevel`, `createdAt`). Utiliser `@Inject('PRISMA') private readonly prisma: PrismaClient` comme dans les autres services du module.

---

## Tâche 2 — Admin : `admin/src/pages/WalletClients.jsx`

Nouvelle page React dans le même style que `Kyc.jsx` (utilise `Card`, `Button`, `Badge`, `Table`, `td` depuis `../ui`).

**Vue liste :**
- Titre : `Wallets clients`
- Filtre par statut (boutons : Tous / En attente / Actifs / Bloqués)
- Barre de recherche par numéro de téléphone (debounce 300ms)
- Tableau colonnes : `Téléphone | Nom | Statut | Solde (XAF) | KYC | Créé le | Actions`
- Bouton `Ouvrir` par ligne → ouvre le détail

**Vue détail (même page, en dessous, comme dans Kyc.jsx) :**
- Affiche : téléphone, nom, statut, solde en XAF (`balanceCents / 100`), niveau KYC, date création
- Tableau des 10 dernières transactions (type, montant, statut, date)
- Boutons selon le statut actuel :
  - Si `PENDING_VERIFICATION` → bouton **Activer** (vert)
  - Si `ACTIVE` → bouton **Bloquer** (rouge)
  - Si `BLOCKED` → bouton **Débloquer** (orange)
  - Toujours un bouton **Fermer**
- Confirmation `window.confirm` avant chaque action. Pour Bloquer : `window.prompt` pour saisir le motif (obligatoire).
- L'officer = `user?.primaryEmailAddress?.emailAddress`

**Permissions RBAC** : utiliser `can(role, 'wallet.view')` pour la page, `can(role, 'wallet.block')` pour les boutons d'action.

Appels API (via `import { api } from '../api'`) :
```js
api.get('/internal/wallets', { params: { status, phone, limit: 50 } })
api.get(`/internal/wallets/${id}`)
api.post(`/internal/wallets/${id}/activate`, { officer, reason })
api.post(`/internal/wallets/${id}/block`, { officer, reason })
api.post(`/internal/wallets/${id}/unblock`, { officer, reason })
```

---

## Tâche 3 — Câblage admin

### `admin/src/rbac.js`

Ajouter dans `MATRIX` :
```js
'wallet.view':  ['support', 'compliance', 'admin'],
'wallet.block': ['compliance', 'admin'],
```

### `admin/src/App.jsx`

Ajouter :
```jsx
import WalletClients from './pages/WalletClients';
// ...
<Route path="/wallets" element={<Protected cap="wallet.view"><WalletClients /></Protected>} />
```

### `admin/src/Layout.jsx`

Ajouter un lien de navigation vers `/wallets` dans la sidebar/navbar (même style que les liens KYC/Settlements existants), label `Wallets clients`, icône porte-monnaie.

---

## Contraintes à respecter

- Ne pas modifier le code existant de `Kyc.jsx`, `Search.jsx`, `wallet-auth.controller.ts`
- Utiliser `InternalGuard` (jamais exposer ces endpoints sans auth)
- Les erreurs API doivent retourner des messages FR clairs (ex: `Wallet déjà actif`)
- Même style visuel que `Kyc.jsx` (dark theme, `Card`, `Badge`, `Table`)
- `Badge` affiche déjà les statuts KYC — vérifier dans `ui.jsx` si `PENDING_VERIFICATION`, `ACTIVE`, `BLOCKED` sont déjà mappés, sinon les ajouter
