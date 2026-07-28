-- Migration 029 : filière (track) choisie par l'élève à l'inscription.
-- Le profil stocke désormais la filière (générale/technique/professionnel) EN PLUS
-- du niveau/parcours (study_level_pref).
alter table public.users
  add column if not exists track_type track_type;

-- L'élève peut mettre à jour sa propre filière (colonnes verrouillées par migr. 023).
grant update (track_type) on public.users to authenticated;
