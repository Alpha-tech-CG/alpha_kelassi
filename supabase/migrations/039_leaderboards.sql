-- Alpha Kelassi V2 — Phase 5 : classements (BLOC E.3)
-- Migration 039
--
-- Le RLS de public.users est own-row : impossible de lire le XP des autres.
-- On expose donc des fonctions SECURITY DEFINER qui renvoient un classement
-- (national par filière/niveau, ou par groupe) sans divulguer les colonnes
-- sensibles — seulement prénom + XP. Anonymat national respecté (opt-out E.3).

alter table public.users add column if not exists leaderboard_opt_out boolean not null default false;
grant update (leaderboard_opt_out) on public.users to authenticated;

-- Prénom d'affichage (ou 'Élève anonyme' si l'utilisateur s'est retiré du classement national).
-- Classement NATIONAL : élèves du même niveau que l'appelant, triés par XP.
create or replace function public.leaderboard_national(p_limit int default 50)
returns table(rank bigint, user_id uuid, name text, xp int, is_me boolean)
language sql security definer stable set search_path = public as $$
  with me as (select study_level_pref from public.users where id = auth.uid())
  select
    row_number() over (order by u.xp desc, u.created_at asc) as rank,
    u.id,
    case when u.leaderboard_opt_out and u.id <> auth.uid() then 'Élève anonyme'
         else coalesce(nullif(split_part(coalesce(u.full_name, ''), ' ', 1), ''), 'Élève') end as name,
    u.xp,
    (u.id = auth.uid()) as is_me
  from public.users u, me
  where u.study_level_pref is not distinct from me.study_level_pref
    and u.role = 'student'
  order by u.xp desc, u.created_at asc
  limit greatest(p_limit, 1);
$$;

-- Rang de l'appelant (même s'il est hors du top N).
create or replace function public.my_rank_national()
returns table(rank bigint, total bigint, xp int)
language sql security definer stable set search_path = public as $$
  with me as (select study_level_pref, xp from public.users where id = auth.uid())
  select
    (select count(*) + 1 from public.users u, me
       where u.study_level_pref is not distinct from me.study_level_pref
         and u.role = 'student' and u.xp > me.xp),
    (select count(*) from public.users u, me
       where u.study_level_pref is not distinct from me.study_level_pref and u.role = 'student'),
    (select xp from me);
$$;

-- Classement d'un GROUPE (réservé aux membres du groupe).
create or replace function public.leaderboard_group(p_group_id uuid, p_limit int default 50)
returns table(rank bigint, user_id uuid, name text, xp int, is_me boolean)
language sql security definer stable set search_path = public as $$
  select
    row_number() over (order by u.xp desc, u.created_at asc) as rank,
    u.id,
    coalesce(nullif(split_part(coalesce(u.full_name, ''), ' ', 1), ''), 'Élève') as name,
    u.xp,
    (u.id = auth.uid()) as is_me
  from public.group_members m
  join public.users u on u.id = m.user_id
  where m.group_id = p_group_id
    and public.is_group_member(p_group_id)   -- l'appelant doit être membre
  order by u.xp desc, u.created_at asc
  limit greatest(p_limit, 1);
$$;

revoke execute on function public.leaderboard_national(int) from anon;
revoke execute on function public.my_rank_national() from anon;
revoke execute on function public.leaderboard_group(uuid, int) from anon;
