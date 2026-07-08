-- Migration 018 : ajoute la colonne page_number manquante sur document_chunks.
--
-- Bug pré-existant (avant tout travail de cette session) : la table
-- document_chunks (migration 001) n'a jamais eu de colonne page_number,
-- alors que :
--   - search_chunks() (migration 006) la lit dans son SELECT
--   - embed-worker.ts (indexation) essaie de l'écrire à chaque insert
--
-- Conséquence vérifiée empiriquement : tout appel à search_chunks() plante
-- avec "column c.page_number does not exist" — le RAG / tuteur IA est
-- totalement non fonctionnel tant que cette colonne n'existe pas.

alter table public.document_chunks
  add column if not exists page_number integer;
