-- 067 — Questionnaire d'inscription (app) : établissement, ville, objectif
--
-- L'inscription mobile pose une question par écran (prénom, nom, date de
-- naissance, classe, établissement, ville, objectif, e-mail). Les réponses
-- partent en métadonnées de signUp() ; le trigger de la migration 066 les
-- recopie maintenant dans public.users. Chaque valeur est contrôlée : une
-- réponse inattendue est ignorée, jamais bloquante pour l'inscription.

alter table public.users
  add column if not exists school text check (char_length(school) <= 120),
  add column if not exists city   text check (char_length(city)   <= 80),
  add column if not exists goal   text check (goal in ('examen', 'notes', 'retard', 'rythme'));

-- L'élève peut corriger ces réponses depuis son profil (mêmes règles que 024).
grant update (school, city, goal) on public.users to authenticated;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  meta  jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  lvl   public.study_level;
  trk   public.track_type;
  bday  date;
  name  text;
  g     text;
begin
  begin
    lvl := nullif(meta->>'study_level', '')::public.study_level;
  exception when invalid_text_representation then lvl := null;
  end;
  begin
    trk := nullif(meta->>'track_type', '')::public.track_type;
  exception when invalid_text_representation then trk := null;
  end;
  begin
    bday := nullif(meta->>'birthdate', '')::date;
    if bday < date '1950-01-01' or bday > current_date then bday := null; end if;
  exception when others then bday := null;
  end;

  name := nullif(trim(coalesce(
    meta->>'full_name',
    concat_ws(' ', nullif(trim(meta->>'first_name'), ''), nullif(trim(meta->>'last_name'), ''))
  )), '');
  g := meta->>'goal';
  if g not in ('examen', 'notes', 'retard', 'rythme') then g := null; end if;

  insert into public.users (id, email, phone, full_name, study_level_pref, track_type, birthdate, school, city, goal)
  values (
    new.id,
    new.email,
    new.phone,
    left(name, 120),
    lvl,
    trk,
    bday,
    left(nullif(trim(meta->>'school'), ''), 120),
    left(nullif(trim(meta->>'city'), ''), 80),
    g
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

revoke all on function public.handle_new_user() from public, anon, authenticated;
