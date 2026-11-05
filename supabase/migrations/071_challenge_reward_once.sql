-- 071 — Défis : le XP n'est versé qu'une fois par défi et par élève (audit sécurité du 26/10/2026, M1).
--
-- Avant : la politique "participants: own" (ALL) laissait l'élève supprimer sa
-- participation. join_challenge() la recréait avec completed_at = null, et
-- list_challenges() reversait le XP : XP illimité, classement national faussé.
-- join_challenge() acceptait aussi le défi solo d'un autre élève.
--
-- Après :
--   • les clients ne font plus que LIRE leurs participations ; toute écriture
--     passe par les RPC (join_challenge, create_solo_challenge, list_challenges) ;
--   • table challenge_rewards (clé primaire défi + élève) : le XP n'est crédité
--     que si la ligne de récompense vient d'être créée ;
--   • join_challenge() : seulement un défi en cours, hebdo ou créé par l'appelant ;
--   • create_solo_challenge() : au plus 3 défis solo en cours par élève.

-- ── Récompenses versées ────────────────────────────────────────────────────────
create table if not exists public.challenge_rewards (
  challenge_id uuid not null references public.challenges(id) on delete cascade,
  user_id      uuid not null references public.users(id) on delete cascade,
  xp           int  not null,
  rewarded_at  timestamptz not null default now(),
  primary key (challenge_id, user_id)
);
alter table public.challenge_rewards enable row level security;
revoke all on public.challenge_rewards from PUBLIC, anon, authenticated;
create policy "challenge_rewards: read own" on public.challenge_rewards for select to authenticated
  using (user_id = auth.uid());
grant select on public.challenge_rewards to authenticated;

-- Défis déjà terminés : la récompense est réputée versée.
insert into public.challenge_rewards (challenge_id, user_id, xp, rewarded_at)
select cp.challenge_id, cp.user_id, c.xp_reward, cp.completed_at
from public.challenge_participants cp join public.challenges c on c.id = cp.challenge_id
where cp.completed_at is not null
on conflict do nothing;

-- ── Participations : lecture seule côté client ─────────────────────────────────
drop policy if exists "participants: own" on public.challenge_participants;
create policy "participants: read own" on public.challenge_participants for select to authenticated
  using (user_id = auth.uid());
revoke insert, update, delete, truncate on public.challenge_participants from PUBLIC, anon, authenticated;

-- Même chose pour les défis eux-mêmes (création uniquement via les RPC).
revoke insert, update, delete, truncate on public.challenges from PUBLIC, anon, authenticated;

-- ── RPC ────────────────────────────────────────────────────────────────────────
create or replace function public.join_challenge(p_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then raise exception 'AUTH_REQUIRED'; end if;
  if not exists (
    select 1 from public.challenges
    where id = p_id and ends_at > now()
      and (type = 'hebdo' or created_by = auth.uid())
  ) then
    raise exception 'CHALLENGE_NOT_FOUND';
  end if;
  insert into public.challenge_participants (challenge_id, user_id)
  values (p_id, auth.uid()) on conflict do nothing;
end; $$;

create or replace function public.create_solo_challenge(p_title text, p_metric text, p_target integer)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  if auth.uid() is null then raise exception 'AUTH_REQUIRED'; end if;
  if (select count(*) from public.challenges
      where type = 'solo' and created_by = auth.uid() and ends_at > now()) >= 3 then
    raise exception 'TOO_MANY_SOLO_CHALLENGES';
  end if;
  if p_metric not in ('lessons', 'quizzes') then p_metric := 'lessons'; end if;
  insert into public.challenges (title, description, type, metric, target, xp_reward, starts_at, ends_at, created_by)
  values (left(coalesce(nullif(p_title, ''), 'Mon défi'), 120), 'Défi personnel', 'solo', p_metric,
          least(greatest(p_target, 1), 100), 30, now(), now() + interval '7 days', auth.uid())
  returning id into v_id;
  insert into public.challenge_participants (challenge_id, user_id) values (v_id, auth.uid());
  return v_id;
end; $$;

create or replace function public.list_challenges()
returns jsonb language plpgsql security definer set search_path = public as $$
declare rec record; v_result jsonb; v_rewarded int;
begin
  perform public.ensure_weekly_challenge();

  for rec in
    select c.id, c.metric, c.starts_at, c.target, c.xp_reward
    from public.challenge_participants cp
    join public.challenges c on c.id = cp.challenge_id
    where cp.user_id = auth.uid() and cp.completed_at is null and c.ends_at > now()
  loop
    if public.challenge_progress(rec.metric, rec.starts_at) >= rec.target then
      update public.challenge_participants set completed_at = now(), score = rec.target
        where challenge_id = rec.id and user_id = auth.uid();
      -- La clé primaire garantit un seul versement, même en cas d'appels simultanés.
      insert into public.challenge_rewards (challenge_id, user_id, xp)
        values (rec.id, auth.uid(), rec.xp_reward) on conflict do nothing;
      get diagnostics v_rewarded = row_count;
      if v_rewarded > 0 then
        perform public.increment_xp(auth.uid(), rec.xp_reward);
      end if;
    end if;
  end loop;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', c.id, 'title', c.title, 'description', c.description, 'type', c.type,
    'metric', c.metric, 'target', c.target, 'xp_reward', c.xp_reward, 'ends_at', c.ends_at,
    'joined', (cp.user_id is not null),
    'completed', (cp.completed_at is not null),
    'progress', least(public.challenge_progress(c.metric, c.starts_at), c.target)
  ) order by (c.type = 'hebdo') desc, c.created_at desc), '[]'::jsonb)
  into v_result
  from public.challenges c
  left join public.challenge_participants cp on cp.challenge_id = c.id and cp.user_id = auth.uid()
  where c.ends_at > now() and (c.type = 'hebdo' or c.created_by = auth.uid() or cp.user_id is not null);
  return v_result;
end; $$;

revoke execute on function public.join_challenge(uuid)                     from PUBLIC, anon;
revoke execute on function public.create_solo_challenge(text, text, integer) from PUBLIC, anon;
revoke execute on function public.list_challenges()                        from PUBLIC, anon;
grant  execute on function public.join_challenge(uuid)                     to authenticated;
grant  execute on function public.create_solo_challenge(text, text, integer) to authenticated;
grant  execute on function public.list_challenges()                        to authenticated;
