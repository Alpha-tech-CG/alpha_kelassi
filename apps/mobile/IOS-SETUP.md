# Mise en route iOS (Cognix / kelassi)

Tout ce qui pouvait être préparé sans compte Apple est fait. Ce fichier liste les
étapes restantes, à faire une fois le compte Apple Developer créé.

## Déjà prêt dans le repo

- `bundleIdentifier` : `com.kelassi.app` (app.json)
- `buildNumber` iOS : **15** (aligné sur l'avancement Android, versionCode 16)
- Permissions Info.plist : caméra, Face ID, `ITSAppUsesNonExemptEncryption: false`
- `cli.appVersionSource: "local"` dans eas.json → EAS lit la version depuis app.json
  (pas d'auto-incrément surprise ; on bump à la main comme pour Android)
- Profil de build `production.ios` présent dans eas.json (archive store par défaut)

## Étape 1 — Créer le compte Apple (toi, ~15 min + validation Apple)

1. https://developer.apple.com → s'inscrire au **Apple Developer Program** (99 $/an).
2. La validation par Apple peut prendre de quelques heures à 2 jours.
3. Noter le **Team ID** (visible dans Membership sur le portail développeur).

## Étape 2 — Lancer le premier build iOS (EAS crée les credentials)

```bash
cd apps/mobile
npx eas-cli build --platform ios --profile production
```

- EAS demande la connexion à ton **Apple ID** puis crée tout seul :
  - le certificat de distribution,
  - le provisioning profile pour `com.kelassi.app`.
- Résultat : un fichier `.ipa` téléchargeable (comme l'`.aab` Android).

## Étape 3 — Préparer App Store Connect (pour publier)

1. https://appstoreconnect.apple.com → **Apps** → créer l'app
   - Bundle ID : `com.kelassi.app`
   - Noter l'**Apple ID numérique de l'app** (ascAppId, ex. `1234567890`).
2. Créer une **clé API App Store Connect** (Users and Access → Integrations → App Store Connect API) :
   - télécharger le fichier `AuthKey_XXXX.p8`,
   - noter le **Key ID** et l'**Issuer ID**.

## Étape 4 — Compléter eas.json pour `eas submit`

Remplacer le bloc `submit.production.ios` (aujourd'hui vide `{}`) par, au choix :

Option A — clé API (recommandée, pas de 2FA à chaque fois) :

```json
"ios": {
  "ascApiKeyPath": "./asc-api-key.p8",
  "ascApiKeyId": "LE_KEY_ID",
  "ascApiKeyIssuerId": "L_ISSUER_ID",
  "ascAppId": "ID_NUMERIQUE_DE_L_APP",
  "appleTeamId": "TON_TEAM_ID"
}
```

Option B — Apple ID classique :

```json
"ios": {
  "appleId": "ton.email@apple.com",
  "ascAppId": "ID_NUMERIQUE_DE_L_APP",
  "appleTeamId": "TON_TEAM_ID"
}
```

⚠️ Ne pas committer `asc-api-key.p8` ni la clé → ajouter au `.gitignore`.

## Étape 5 — Soumettre

```bash
cd apps/mobile
npx eas-cli submit --platform ios --profile production --latest
```

Puis finir la fiche (captures, description, confidentialité) dans App Store Connect
et envoyer en revue Apple.

## À ne pas oublier

- À chaque nouvelle version iOS : incrémenter `buildNumber` dans app.json
  (et `version` si c'est une version marketing différente).
- iOS exige une **URL de politique de confidentialité** et un écran de suppression de
  compte — déjà en place côté app pour le Play Store, à vérifier identique pour Apple.
