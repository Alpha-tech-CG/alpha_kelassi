-- Alpha Kelassi — Durcissement sécurité (audit) — complément de 022
-- L'EXECUTE des fonctions SECURITY DEFINER était aussi accordé au pseudo-rôle
-- PUBLIC (hérité par anon/authenticated) : le REVOKE de 022 (anon/authenticated
-- seulement) était donc insuffisant. On révoque depuis PUBLIC. Le service_role
-- conserve son grant explicite → le serveur continue de fonctionner.

revoke execute on function public.increment_xp(uuid, integer) from public;
revoke execute on function public.search_chunks(vector, integer, double precision, uuid, boolean) from public;
revoke execute on function public.rls_auto_enable() from public;

-- submit_quiz_attempt utilise auth.uid() : PUBLIC retiré, ré-accordé aux
-- utilisateurs connectés et au serveur.
revoke execute on function public.submit_quiz_attempt(uuid, jsonb, integer) from public;
grant execute on function public.submit_quiz_attempt(uuid, jsonb, integer) to authenticated, service_role;
