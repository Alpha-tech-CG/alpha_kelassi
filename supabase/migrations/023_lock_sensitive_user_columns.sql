-- Alpha Kelassi — Durcissement sécurité (audit)
-- Migration 023 : empêche l'auto-élévation de privilèges.
--
-- CRITIQUE : la policy "users: update own" (id = auth.uid()) autorisait un
-- utilisateur à modifier n'importe quelle colonne de sa propre ligne, et le
-- rôle `authenticated` avait le droit UPDATE au niveau table (toutes colonnes).
-- Un utilisateur connecté pouvait donc :
--   PATCH /rest/v1/users?id=eq.<son_id>  { "role": "admin" }   → devenir admin
--   ... { "plan": "premium" }   → premium gratuit
--   ... { "xp": 999999 }        → truquer le classement
--
-- Correctif : on retire le droit UPDATE au niveau table et on ne ré-accorde
-- que les colonnes que l'utilisateur peut légitimement modifier. role/plan/xp
-- ne sont désormais modifiables que par le serveur (service role).

revoke update on public.users from anon, authenticated;

grant update (full_name, phone, onboarding_completed, study_level_pref, subject_ids_pref, whatsapp_opt_in, reminder_hour)
  on public.users to authenticated;
