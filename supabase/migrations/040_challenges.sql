-- Alpha Kelassi V2 — Phase 5 : défis (BLOC E.4)
-- Migration 040
--
-- Défis solo (objectif perso) + défi hebdomadaire Cognix. La PROGRESSION est
-- mesurée à partir de données réelles déjà horodatées (leçons terminées /
-- quiz passés depuis le début du défi) — pas de nouvelle infra XP. Le défi
-- hebdo est créé PARESSEUSEMENT au premier appel de la semaine (pas de cron).
-- Toute la logique est en RPC SECURITY DEFINER (scoping par auth.uid()).

create type challenge_type as enum ('solo', 'groupe', 'inter_groupes', 'hebdo');

create table public.challenges (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  description text,
  type        challenge_type not null,
  metric      text not null default 'lessons' check (metric in ('lessons', 'quizzes')),
  target      int not null default 5 check (target >= 1),
  xp_reward   int not null default 50,
  starts_at   timestamptz not null default now(),
  ends_at     timestamptz not null,
  created_by  uuid references public.users(id) on delete cascade,
  created_at  timestamptz not null default now()
);
create index idx_challenges_active on public.challenges(type, ends_at);

create table public.challenge_participants (
  challenge_id uuid not null references public.challenges(id) on delete cascade,
  user_id      uuid not null references public.users(id) on delete cascade,
  score        int not null default 0,
  completed_at timestamptz,
  joined_at    timestamptz not null default now(),
  primary key (challenge_id, user_id)
);

alter table public.challenges             enable row level security;
alter table public.challenge_participants enable row level security;
create policy "challenges: read all" on public.challenges for select to authenticated using (true);
create policy "participants: own" on public.challenge_participants for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Progression de l'appelant pour une métrique depuis une date.
create or replace function public.challenge_progress(p_metric text, p_since timestamptz)
returns int language sql security definer stable set search_path = public as $$
  select case p_metric
    when 'lessons' then (select count(*)::int from public.lesson_progress
                          where user_id = auth.uid() and completed and completed_at >= p_since)
    when 'quizzes' then (select count(*)::int from public.quiz_attempts
                          where user_id = auth.uid() and completed_at >= p_since)
    else 0 end;
$$;

-- Crée le défi hebdo de la semaine courante s'il n'existe pas encore.
create or replace function public.ensure_weekly_challenge()
returns void language plpgsql security definer set search_path = public as $$
declare w_start timestamptz := date_trunc('week', now());
begin
  if not exists (select 1 from public.challenges where type = 'hebdo' and starts_at = w_start) then
    insert into public.challenges (title, description, type, metric, target, xp_reward, starts_at, ends_at)
    values ('Défi de la semaine', 'Termine 5 leçons avant dimanche soir', 'hebdo', 'lessons', 5, 100,
            w_start, w_start + interval '7 days');
  end if;
end; $$;

-- Liste les défis actifs (hebdo + solo de l'appelant) avec progression, statut,
-- et attribue le XP dès qu'un défi rejoint atteint sa cible (une seule fois).
create or replace function public.list_challenges()
returns jsonb language plpgsql security definer set search_path = public as $$
declare rec record; v_result jsonb;
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
      perform public.increment_xp(auth.uid(), rec.xp_reward);
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

create or replace function public.join_challenge(p_id uuid)
returns void language sql security definer set search_path = public as $$
  insert into public.challenge_participants (challenge_id, user_id)
  values (p_id, auth.uid()) on conflict do nothing;
$$;

create or replace function public.create_solo_challenge(p_title text, p_metric text, p_target int)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  if p_metric not in ('lessons', 'quizzes') then p_metric := 'lessons'; end if;
  insert into public.challenges (title, description, type, metric, target, xp_reward, starts_at, ends_at, created_by)
  values (left(coalesce(nullif(p_title, ''), 'Mon défi'), 120), 'Défi personnel', 'solo', p_metric,
          greatest(p_target, 1), 30, now(), now() + interval '7 days', auth.uid())
  returning id into v_id;
  insert into public.challenge_participants (challenge_id, user_id) values (v_id, auth.uid());
  return v_id;
end; $$;

revoke execute on function public.challenge_progress(text, timestamptz) from anon;
revoke execute on function public.ensure_weekly_challenge() from anon;
revoke execute on function public.list_challenges() from anon;
revoke execute on function public.join_challenge(uuid) from anon;
revoke execute on function public.create_solo_challenge(text, text, int) from anon;
