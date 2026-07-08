-- Migration 017 : passe de sécurité complète (advisors Supabase)
--
-- 1) Vues d'analytics admin exposées publiquement.
--    Ces 4 vues (créées sans security_invoker, donc exécutées avec les
--    droits du propriétaire = bypass RLS) héritaient des privilèges par
--    défaut de Supabase qui accordent SELECT à `anon` et `authenticated`
--    sur tout nouvel objet du schéma public. Résultat : n'importe qui,
--    même sans être connecté, pouvait lire ces agrégats via l'API REST
--    (ex. /rest/v1/daily_chat_usage exposait user_id + volume de
--    questions IA par jour, sans authentification).
--    Ces vues ne sont utilisées QUE par la console admin via la clé
--    service role (qui n'a pas besoin de ces grants — service_role
--    bypass RLS et les grants par défaut). On révoque donc l'accès
--    public/authentifié : elles restent internes à l'admin.
revoke all on public.documents_index_status from anon, authenticated;
revoke all on public.daily_chat_usage       from anon, authenticated;
revoke all on public.top_documents_7d       from anon, authenticated;
revoke all on public.active_users_stats     from anon, authenticated;

-- 2) search_path mutable sur les fonctions applicatives.
--    Sans `SET search_path` fixé, le search_path effectif au moment de
--    l'appel dépend de la session appelante. Pour les fonctions
--    SECURITY DEFINER (qui tournent avec les droits élevés de leur
--    propriétaire), c'est un vecteur classique de détournement de
--    privilèges si un rôle pouvait injecter un objet dans un schéma
--    placé avant `public` dans le search_path. Ici anon/authenticated
--    n'ont pas CREATE sur public (vérifié), donc le risque réel est
--    faible, mais on fige quand même le search_path par défense en
--    profondeur — recommandation standard Supabase.
--    `public, pg_temp` (et non '') car search_chunks utilise l'opérateur
--    <=> de pgvector, dont l'extension est installée dans public.
alter function public.current_user_plan()                                   set search_path = public, pg_temp;
alter function public.current_user_role()                                   set search_path = public, pg_temp;
alter function public.increment_xp(uuid, integer)                           set search_path = public, pg_temp;
alter function public.search_chunks(vector, integer, double precision, uuid) set search_path = public, pg_temp;
alter function public.set_updated_at()                                      set search_path = public, pg_temp;
alter function public.submit_quiz_attempt(uuid, jsonb, integer)             set search_path = public, pg_temp;

-- ============================================================
-- Non traité dans cette migration (documenté, pas de correctif ici) :
--
-- - Extension `vector` installée dans le schéma public plutôt que dans
--   un schéma dédié (ex. `extensions`). Recommandation Supabase de bonne
--   pratique (sévérité WARN, pas une vraie vulnérabilité), mais la
--   déplacer casserait toutes les références de type `vector` non
--   qualifiées dans les migrations et le code (colonnes, fonctions).
--   À traiter dans une migration dédiée, isolée, testée à part.
--
-- - Policies "read all" sur les buckets storage pdfs-public et images
--   (listage public possible). Ces buckets sont volontairement publics
--   par design : la ségrégation premium/public se fait déjà au niveau
--   du choix de bucket (pdfs-premium vs pdfs-public), donc le contenu
--   listable y est déjà destiné à être librement accessible. Pas un
--   risque réel dans ce contexte — laissé tel quel.
-- ============================================================
