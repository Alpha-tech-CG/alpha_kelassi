-- Alpha Kelassi V2 — Phase 4 : profils publics (noms d'affichage)
-- Migration 038
--
-- Le RLS de public.users limite la lecture à sa propre ligne. Pour afficher le
-- NOM de l'expéditeur dans un chat de groupe, on expose une vue restreinte aux
-- seules colonnes non sensibles (id, nom, avatar). La vue s'exécute avec les
-- droits du propriétaire (pas de RLS) mais ne révèle QUE ces 3 colonnes.

create or replace view public.public_profiles as
  select id, full_name from public.users;

grant select on public.public_profiles to authenticated, anon;
