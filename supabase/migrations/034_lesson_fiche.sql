-- Alpha Kelassi V2 — Phase 2 : fiche de révision
-- Migration 034 : ajoute le type de leçon 'fiche' (carte mémo, format court).
--
-- Fichier séparé : une valeur d'enum ajoutée ne peut pas être référencée dans
-- la même transaction que son ajout (cf. migr. 031). Réutilise le rendu leçon
-- existant (markdown + KaTeX) côté mobile — aucune nouvelle table nécessaire.

alter type lesson_type add value if not exists 'fiche';
