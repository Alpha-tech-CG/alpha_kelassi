-- Migration 052 : catalogue de cours consultable sans compte
--
-- Objectif produit : n'importe qui doit pouvoir découvrir le programme
-- (matières, chapitres, titres des leçons) avant de créer un compte — pour la
-- découverte comme pour le référencement. La LECTURE du contenu d'une leçon
-- reste réservée aux comptes inscrits.
--
-- Deux verrous distincts doivent être ouverts pour que PostgREST réponde au
-- rôle `anon` : la policy RLS (quelles LIGNES) et le privilège SQL (quelles
-- COLONNES). On s'appuie sur les deux, avec des portées différentes :
--
--   • subjects / chapters : lecture complète — aucune donnée sensible, ce sont
--     des intitulés de programme scolaire public.
--   • lessons : lecture restreinte AUX COLONNES DE MÉTADONNÉES. Le privilège
--     est accordé colonne par colonne, donc `content` et `video_url` restent
--     inaccessibles au rôle anonyme même si la policy autorise la ligne.
--     C'est ce qui distingue « voir le sommaire » de « lire le cours ».
--
-- Rien n'est ouvert en écriture : aucune policy `insert`/`update`/`delete`
-- n'est ajoutée pour `anon`, et les tables de données personnelles
-- (users, lesson_progress, chat_*) ne sont pas touchées.

-- ── Matières ────────────────────────────────────────────────────────────────
drop policy if exists "subjects_public_read_anon" on public.subjects;
create policy "subjects_public_read_anon" on public.subjects
  for select to anon using (true);
grant select on public.subjects to anon;

-- ── Chapitres ───────────────────────────────────────────────────────────────
drop policy if exists "chapters_public_read_anon" on public.chapters;
create policy "chapters_public_read_anon" on public.chapters
  for select to anon using (true);
grant select on public.chapters to anon;

-- ── Leçons : métadonnées uniquement ─────────────────────────────────────────
-- La policy exclut d'emblée les leçons premium (aucune aujourd'hui, mais la
-- règle doit tenir si le catalogue en accueille plus tard).
drop policy if exists "lessons_public_meta_read_anon" on public.lessons;
create policy "lessons_public_meta_read_anon" on public.lessons
  for select to anon using (not is_premium);

-- On repart d'une ardoise propre avant d'accorder colonne par colonne : un
-- `grant select` sur toute la table accordé ailleurs rendrait le découpage
-- ci-dessous inopérant.
revoke select on public.lessons from anon;
grant select (id, chapter_id, type, title, duration_min, is_premium, order_index)
  on public.lessons to anon;

-- Vérification manuelle suggérée après application :
--   set role anon;
--   select content from public.lessons limit 1;   -- doit échouer (permission denied)
--   select title   from public.lessons limit 1;   -- doit réussir
--   reset role;
