-- Alpha Kelassi V2 — Phase 7 : durcissement sécurité (audit linter Supabase)
-- Migration 043
--
-- Corrige les alertes du linter de sécurité sur les objets des phases 1-6 :
--   1. public_profiles : vue SECURITY DEFINER (ERROR) → table + trigger + RLS.
--   2. submit_quiz_attempt : search_path mutable → figé à public.
--   3. Fonctions SECURITY DEFINER exécutables par anon : le REVOKE ... FROM anon
--      était INEFFICACE (Postgres accorde EXECUTE à PUBLIC par défaut). On
--      révoque bien depuis PUBLIC, puis on ré-accorde à authenticated seulement
--      aux fonctions appelées par les clients.
--   4. Limites d'upload (≤ 5 Mo, JPEG/PNG) sur les buckets photos.

-- ── 1. public_profiles : vue definer → table synchronisée (RLS propre) ─────────
drop view if exists public.public_profiles;

create table if not exists public.public_profiles (
  id        uuid primary key references public.users(id) on delete cascade,
  full_name text
);
insert into public.public_profiles (id, full_name)
  select id, full_name from public.users on conflict (id) do nothing;

alter table public.public_profiles enable row level security;
drop policy if exists "public_profiles: read all" on public.public_profiles;
create policy "public_profiles: read all" on public.public_profiles for select to authenticated using (true);

create or replace function public.sync_public_profile()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.public_profiles (id, full_name) values (new.id, new.full_name)
    on conflict (id) do update set full_name = excluded.full_name;
  return new;
end; $$;
revoke execute on function public.sync_public_profile() from public;

drop trigger if exists sync_public_profile_trg on public.users;
create trigger sync_public_profile_trg
  after insert or update of full_name on public.users
  for each row execute function public.sync_public_profile();

-- ── 2. Fige le search_path de submit_quiz_attempt ─────────────────────────────
alter function public.submit_quiz_attempt(uuid, jsonb, integer, text) set search_path = public;

-- ── 3. Verrou PUBLIC → authenticated sur les fonctions definer ────────────────
-- Fonctions appelées par les clients (RPC ou RLS) : révoquer PUBLIC, accorder authenticated.
do $$
declare fn text;
begin
  foreach fn in array array[
    'leaderboard_national(int)', 'my_rank_national()', 'leaderboard_group(uuid, int)',
    'list_challenges()', 'join_challenge(uuid)', 'create_solo_challenge(text, text, int)',
    'generate_parent_code()', 'redeem_parent_code(text)', 'parent_dashboard(uuid)',
    'update_parental_settings(uuid, boolean, int, boolean)',
    'submit_quiz_attempt(uuid, jsonb, integer, text)', 'is_group_member(uuid)'
  ]
  loop
    execute format('revoke execute on function public.%s from public;', fn);
    execute format('grant execute on function public.%s to authenticated;', fn);
  end loop;

  -- Fonctions SERVEUR uniquement (service role / appels imbriqués) : PUBLIC seulement révoqué.
  foreach fn in array array[
    'increment_tutor_wallet(uuid, integer)', 'ensure_weekly_challenge()',
    'challenge_progress(text, timestamptz)'
  ]
  loop
    execute format('revoke execute on function public.%s from public;', fn);
    execute format('revoke execute on function public.%s from anon, authenticated;', fn);
  end loop;
end $$;

-- NB : ALTER FUNCTION ... SET search_path réinitialise l'ACL au défaut (PUBLIC).
-- On re-verrouille donc EXPLICITEMENT submit_quiz_attempt après l'ALTER ci-dessus,
-- + les helpers pré-existants current_user_role/plan et le trigger sync.
revoke execute on function public.submit_quiz_attempt(uuid, jsonb, integer, text) from public, anon;
grant  execute on function public.submit_quiz_attempt(uuid, jsonb, integer, text) to authenticated;
revoke execute on function public.sync_public_profile() from public, anon, authenticated;
revoke execute on function public.current_user_role() from public, anon;
grant  execute on function public.current_user_role() to authenticated;
revoke execute on function public.current_user_plan() from public, anon;
grant  execute on function public.current_user_plan() to authenticated;

-- ── 4. Limites des buckets d'upload (≤ 5 Mo, images uniquement) ───────────────
update storage.buckets
  set file_size_limit = 5242880,                              -- 5 Mo
      allowed_mime_types = array['image/jpeg', 'image/png']
  where id in ('exercise-photos', 'student-work', 'tutor-solutions', 'tutor-documents', 'teacher-documents');
