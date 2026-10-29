# Prompt Claude Code — Landing page PayBrain (HTML standalone)

## Objectif

Crée un fichier `apps/marketing/public/agregateur.html` — une landing page **standalone** (zéro dépendance, un seul fichier HTML+CSS+JS inline) qui présente PayBrain comme agrégateur de paiement Mobile Money en Afrique centrale.

La page doit être **visuellement impressionnante**, mobile-friendly, et fonctionner en ouvrant simplement le fichier dans un navigateur.

---

## Identité visuelle (à respecter exactement)

```
Nom du produit : PayBrain
Slogan : L'agrégateur de paiement Mobile Money d'Afrique centrale
Couleurs :
  - Bleu primaire  : #0035c5
  - Vert secondaire: #00b67a
  - Fond sombre    : #0a0f1e
  - Surface        : #0f1828
  - Texte          : #e6e9f2
  - Gris atténué   : #7b86a3
  - Bordure        : #1e2a40
Police : Inter (Google Fonts CDN)
```

---

## Structure de la page (dans l'ordre)

### 1. NAVBAR fixe
- Logo : carré bleu avec "AP" en blanc + texte "PayBrain"
- Liens : Fonctionnalités · Opérateurs · Tarifs · Développeurs · Contact
- Bouton CTA : "Démarrer" (bleu)
- Menu hamburger sur mobile

### 2. HERO
- Badge animé : "🚀 Disponible au Congo, Cameroun et RDC"
- Titre H1 grand et gras :
  **"Acceptez les paiements Mobile Money en une seule intégration"**
- Sous-titre :
  "PayBrain connecte MTN MoMo et Airtel Money à votre application via une API unifiée. Encaissez, reversez, réconciliez — sans vous soucier des opérateurs."
- 2 boutons : "Voir la démo →" (bleu) · "Lire la documentation" (outline)
- Mockup dashboard sous le hero : fenêtre de navigateur stylisée avec des stats fictives (Volume : 485 000 XAF · Transactions : 1 247 · Taux succès : 97.4%) et un graphique en barres SVG animé

### 3. BANDE D'OPÉRATEURS
- Fond bleu foncé
- Titre : "Opérateurs supportés"
- 2 logos stylisés côte à côte : MTN MoMo (fond jaune #FFCB02, texte noir) · Airtel Money (fond rouge #FF0000, texte blanc)
- Mention : "CinetPay · Carte Visa (bientôt)"

### 4. STATS (fond légèrement différent)
- 4 chiffres en grand :
  - < 3 secondes — Confirmation de paiement
  - 99.9% — Disponibilité SLA
  - 2 opérateurs — MTN + Airtel
  - XAF + USD — Devises supportées

### 5. FONCTIONNALITÉS (6 cards en grille 2×3)
Titre section : "Tout ce dont vous avez besoin"

| Icône | Titre | Description |
|-------|-------|-------------|
| ⚡ | API unifiée | Un seul endpoint pour MTN et Airtel. Pas de code spécifique par opérateur. |
| 🔐 | Sécurité bancaire | Signature HMAC, chiffrement AES-256, audit trail complet sur chaque transaction. |
| 📡 | Webhooks temps réel | Notification instantanée dès qu'un paiement est confirmé ou échoue. |
| 📊 | Dashboard en direct | Visualisez votre volume, vos revenus et vos reversements en temps réel. |
| 🔁 | Reversements automatiques | Les fonds sont reversés sur votre compte bancaire selon votre calendrier. |
| 🌍 | Multi-devises | Encaissez en XAF, affichez en USD/EUR. Taux de change en temps réel. |

### 6. COMMENT ÇA MARCHE (3 étapes)
Titre : "En production en moins d'une heure"

1. **Créez votre compte** — Inscription en ligne, validation KYC sous 48h, clé API reçue par email.
2. **Intégrez l'API** — Copiez-collez 10 lignes de code. SDK disponible pour Node.js, Python, PHP.
3. **Encaissez** — Votre client paie par Mobile Money. Vous êtes crédité instantanément.

### 7. EXTRAIT DE CODE (fond bleu foncé)
Titre : "Une API pensée pour les développeurs"
Sous-titre : "REST JSON · Webhooks · SDK Node.js · Sandbox inclus"

Fenêtre de code dark avec highlight syntaxique manuel (spans colorés) :

```javascript
// Initier un paiement MTN MoMo
const payment = await paybrain.payments.create({
  amount: 5000,        // en XAF
  currency: "XAF",
  operator: "MTN",
  phone: "+242065000000",
  description: "Commande #1234",
  webhookUrl: "https://votresite.com/webhook",
});

// → { id: "pay_abc123", status: "PENDING",
//     payUrl: "https://pay.paybrain.cg/..." }
```

Bouton : "Lire la documentation →"

### 8. TYPES DE COMPTES (2 cards côte à côte)
Titre : "Une solution pour chaque besoin"

**Compte Marchand** (bordure bleue)
- Pour les boutiques, e-commerces, plateformes
- ✓ Liens de paiement QR Code
- ✓ API REST complète
- ✓ Dashboard analytique
- ✓ Reversements automatiques
- CTA : "Ouvrir un compte marchand →"

**Compte Client / Wallet** (bordure verte)
- Pour les particuliers
- ✓ Portefeuille mobile sécurisé
- ✓ Envoi P2P instantané
- ✓ Paiement chez les marchands
- ✓ Recharge depuis MTN / Airtel
- CTA : "Créer mon portefeuille →"

### 9. TARIFICATION (2 plans)
Titre : "Tarifs simples et transparents"

**Starter** — Gratuit
- Jusqu'à 100 transactions/mois
- Accès sandbox illimité
- Support email
- CTA : "Commencer gratuitement"

**Pro** — 1.5% par transaction
- Transactions illimitées
- Dashboard avancé + analytics
- Webhooks + API complète
- Support prioritaire 24h
- CTA : "Nous contacter"

### 10. CONFIANCE / SÉCURITÉ
- Titre : "Construit pour la conformité et la sécurité"
- 4 badges : 🔒 Données chiffrées AES-256 · 🛡️ Conformité BEAC · 📋 KYC/AML intégré · 🔑 Authentification HMAC

### 11. CTA FINAL
- Fond dégradé bleu
- Titre : "Prêt à accepter des paiements Mobile Money ?"
- Sous-titre : "Rejoignez les marchands qui font confiance à PayBrain pour encaisser leurs paiements."
- Formulaire inline : champ email/téléphone + bouton "Rejoindre la liste d'attente"
- Note : "Inscription gratuite · Validation sous 48h · Aucune carte bancaire requise"

### 12. FOOTER
- Logo PayBrain
- Liens : Solution · Tarifs · Documentation · Contact · CGU · Confidentialité
- Mention : "© 2026 PayBrain · Groupe Alpha · Congo-Brazzaville"
- Badges opérateurs (MTN + Airtel, petits)

---

## Animations et effets

- Les sections apparaissent en fondu au scroll (IntersectionObserver natif, pas de librairie)
- Le graphique en barres du hero s'anime au chargement (hauteur 0 → valeur finale, transition CSS 0.8s)
- Le compteur des stats s'incrémente depuis 0 quand la section est visible (JS natif)
- Hover sur les cards : légère ombre bleue `box-shadow: 0 8px 24px rgba(0,53,197,.15)`
- Navbar : fond transparent → fond opaque au scroll

## Contraintes techniques

- **Un seul fichier HTML** — CSS et JS inline dans `<style>` et `<script>`
- Seule dépendance externe autorisée : Google Fonts (Inter) via CDN
- Responsive mobile-first — breakpoints à 640px et 1024px
- Pas de framework JS, pas de bundler
- Compatible Chrome/Firefox/Safari
- Taille cible : < 80 Ko
