# TODO - Admin parcours/classes (générale / technique)

- [x] Vérifier le schéma DB `subjects` pour confirmer la présence/absence de `track_type`.
- [x] Adapter API admin subjects GET/POST pour supporter parcours libre + catégorie (`generale`/`technique`).
- [x] Adapter API admin subjects PATCH pour permettre MAJ de la catégorie si nécessaire.
- [x] Mettre à jour l'UI admin subjects:
  - [x] Ajouter bouton explicite pour ajout de parcours/classe
  - [x] Ajouter champs parcours/classe + catégorie dans le formulaire
  - [x] Mettre à jour affichage groupé par catégorie puis parcours/classe
- [x] Ajouter migration Supabase si `track_type` est absent.
- [ ] Vérification finale de cohérence (types/UX/API).
