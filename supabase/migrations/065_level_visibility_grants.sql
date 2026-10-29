-- Migration 065 : droits d'exécution des fonctions de visibilité (correctif de la 064)
--
-- Les policies de la 064 (subjects, series, chapters) appellent
-- `level_is_visible()` / `subject_is_visible()`, qui appellent à leur tour
-- `current_user_role()` (migration 002) pour le passe-droit admin.
--
-- `current_user_role()` n'a pas l'EXECUTE accordé au rôle `anon`. Résultat :
-- le catalogue public sans compte (migration 052, lecture anonyme de
-- `subjects`) tombe en « permission denied for function current_user_role ».
-- Les comptes connectés ne sont pas touchés (ils ont déjà ce droit).
--
-- On accorde explicitement l'exécution aux rôles qui en ont besoin. Fonctions
-- SECURITY DEFINER : elles s'exécutent avec les droits du propriétaire, le
-- GRANT ne fait qu'autoriser l'appel. Pour `anon`, `auth.uid()` est nul, donc
-- `current_user_role()` renvoie nul et le passe-droit admin reste faux.

grant execute on function public.current_user_role() to anon;
grant execute on function public.level_is_visible(study_level) to anon, authenticated;
grant execute on function public.subject_is_visible(uuid) to anon, authenticated;

-- Vérification suggérée après application (rôle anonyme) :
--   set role anon;
--   select id from public.subjects where level = 'cepe' limit 1;   -- doit réussir
--   select id from public.subjects where level = 'cp1'  limit 1;   -- doit renvoyer 0 ligne
--   reset role;
