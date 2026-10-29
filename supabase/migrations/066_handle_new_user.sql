-- 066 — Création automatique du profil public.users à l'inscription
--
-- Aucune migration ne créait la ligne public.users d'un nouveau compte : le
-- seul profil existant avait été inséré à la main. Un élève fraîchement inscrit
-- n'avait donc pas de profil — /api/onboarding/complete mettait à jour 0 ligne
-- sans erreur et le tableau de bord ne trouvait rien.
--
-- Le trigger reprend le nom et la classe passés en métadonnées par signUp()
-- (web : full_name + study_level). Une classe inconnue de l'enum est ignorée
-- plutôt que de faire échouer l'inscription (« Database error saving new user »).

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  lvl public.study_level;
begin
  begin
    lvl := nullif(new.raw_user_meta_data->>'study_level', '')::public.study_level;
  exception when invalid_text_representation then
    lvl := null;
  end;

  insert into public.users (id, email, phone, full_name, study_level_pref)
  values (
    new.id,
    new.email,
    new.phone,
    nullif(trim(coalesce(new.raw_user_meta_data->>'full_name', '')), ''),
    lvl
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

revoke all on function public.handle_new_user() from public, anon, authenticated;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Rattrapage : comptes auth déjà créés sans profil
insert into public.users (id, email, phone, full_name)
select u.id, u.email, u.phone, nullif(trim(coalesce(u.raw_user_meta_data->>'full_name', '')), '')
from auth.users u
where not exists (select 1 from public.users p where p.id = u.id)
on conflict (id) do nothing;
