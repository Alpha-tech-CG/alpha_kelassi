## Résumé

<!-- Que fait cette PR et pourquoi ? -->

## Checklist sécurité

- [ ] **RLS / permissions** — si cette PR touche du SQL (migration, policy, fonction) : les policies RLS ont été vérifiées pour la nouvelle table/colonne, et aucun rôle n'a de privilège plus large que nécessaire.
- [ ] **Pas de secret ajouté** — aucune clé API, token, mot de passe ou identifiant réel n'est présent dans le code, les commits ou les fichiers de config commités (`.env.example` reste avec des valeurs factices).
- [ ] **Gestion d'erreur sans fuite d'info** — les blocs catch/`if (error)` exposés au client ne renvoient pas `error.message` brut (détails Postgres, stack trace) ; le détail réel est loggué côté serveur uniquement (`console.error`).
- [ ] **Tests / vérification manuelle** — la modification a été testée (tests automatisés et/ou vérification manuelle décrite ci-dessous).

## Vérification manuelle effectuée

<!-- Décris brièvement comment tu as testé ce changement. -->
