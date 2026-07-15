-- Alpha Kelassi — Durcissement sécurité (audit)
-- Migration 022 : ferme l'accès direct des clients aux fonctions SECURITY DEFINER
-- sensibles. Le serveur les appelle via le service role (non affecté par ces REVOKE).

-- increment_xp(user_id, amount) : prenait un user_id arbitraire → un client
-- pouvait s'attribuer un XP illimité / modifier celui des autres. Service role only.
revoke execute on function public.increment_xp(uuid, integer) from anon, authenticated;

-- search_chunks(..., p_include_premium) : p_include_premium=true contournait le
-- gating premium si appelé directement. Le web l'appelle via service role.
revoke execute on function public.search_chunks(vector, integer, double precision, uuid, boolean) from anon, authenticated;

-- rls_auto_enable() : fonction d'event trigger interne, aucune raison d'être exposée.
revoke execute on function public.rls_auto_enable() from anon, authenticated;

-- submit_quiz_attempt : garde l'accès authentifié (utilise auth.uid()), retire anon.
revoke execute on function public.submit_quiz_attempt(uuid, jsonb, integer) from anon;
