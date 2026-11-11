-- Alpha Kelassi V2 — Phase 6 : contrôle parental (BLOC F)
-- Migration 042
--
-- Liaison parent↔enfant PAR CONSENTEMENT : l'enfant génère un code court, le
-- parent le saisit → lien créé. Aucun parent ne peut se lier sans le code.
-- Le dashboard parent agrège l'activité (durée, matières, groupes, alertes)
-- SANS jamais exposer les messages privés (F.2) — via RPC SECURITY DEFINER
-- qui vérifient le lien à chaque appel.

-- Profil mineur (F.1) : date de naissance (l'élève peut la renseigner).
alter table public.users add column if not exists birthdate date;
grant update (birthdate) on public.users to authenticated;

create table public.parent_links (
  parent_id uuid not null references public.users(id) on delete cascade,
  child_id  uuid not null references public.users(id) on delete cascade,
  linked_at timestamptz not null default now(),
  primary key (parent_id, child_id)
);
create index idx_parent_links_child on public.parent_links(child_id);

create table public.parental_settings (
  child_id            uuid primary key references public.users(id) on delete cascade,
  dm_enabled          boolean not null default true,
  daily_limit_minutes int,
  weekly_report_email boolean not null default false,
  updated_at          timestamptz not null default now()
);

create table public.parent_link_codes (
  code       text primary key,
  child_id   uuid not null references public.users(id) on delete cascade,
  expires_at timestamptz not null
);
create index idx_parent_codes_child on public.parent_link_codes(child_id);

alter table public.parent_links      enable row level security;
alter table public.parental_settings enable row level security;
alter table public.parent_link_codes enable row level security;

-- Liens : parent voit les siens, enfant voit qui le suit ; admin tout.
create policy "parent_links: read own" on public.parent_links for select to authenticated
  using (parent_id = auth.uid() or child_id = auth.uid() or public.current_user_role() = 'admin');
create policy "parent_links: child unlink" on public.parent_links for delete to authenticated
  using (child_id = auth.uid() or parent_id = auth.uid());

-- Réglages : parent lié ou l'enfant peuvent lire ; écriture via RPC (service role).
create policy "parental_settings: read linked" on public.parental_settings for select to authenticated
  using (child_id = auth.uid()
    or exists (select 1 from public.parent_links pl where pl.child_id = parental_settings.child_id and pl.parent_id = auth.uid()));

-- Codes : l'enfant gère les siens.
create policy "parent_codes: own" on public.parent_link_codes for all to authenticated
  using (child_id = auth.uid()) with check (child_id = auth.uid());

-- ── RPC ───────────────────────────────────────────────────────────────────────
-- L'enfant génère un code de liaison (valable 24h, remplace l'ancien).
create or replace function public.generate_parent_code()
returns text language plpgsql security definer set search_path = public as $$
declare v_code text := upper(substr(md5(random()::text || auth.uid()::text), 1, 6));
begin
  delete from public.parent_link_codes where child_id = auth.uid();
  insert into public.parent_link_codes (code, child_id, expires_at)
  values (v_code, auth.uid(), now() + interval '24 hours');
  return v_code;
end; $$;

-- Le parent saisit le code → crée le lien + réglages par défaut.
create or replace function public.redeem_parent_code(p_code text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_child uuid; v_name text;
begin
  select child_id into v_child from public.parent_link_codes
    where code = upper(p_code) and expires_at > now();
  if v_child is null then raise exception 'CODE_INVALID'; end if;
  if v_child = auth.uid() then raise exception 'CODE_SELF'; end if;

  insert into public.parent_links (parent_id, child_id) values (auth.uid(), v_child) on conflict do nothing;
  insert into public.parental_settings (child_id) values (v_child) on conflict do nothing;
  delete from public.parent_link_codes where code = upper(p_code);   -- usage unique

  select full_name into v_name from public.users where id = v_child;
  return jsonb_build_object('child_id', v_child, 'child_name', coalesce(v_name, 'Enfant'));
end; $$;

-- Dashboard parent : activité agrégée de l'enfant (jamais les messages privés).
create or replace function public.parent_dashboard(p_child_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_result jsonb;
begin
  if not exists (select 1 from public.parent_links where parent_id = auth.uid() and child_id = p_child_id) then
    raise exception 'NOT_LINKED';
  end if;

  select jsonb_build_object(
    'child_name', (select coalesce(full_name, 'Enfant') from public.users where id = p_child_id),
    'last_active', (select max(last_active) from public.user_progress where user_id = p_child_id),
    'active_days_week', (select count(distinct d)::int from (
        select completed_at::date d from public.lesson_progress
          where user_id = p_child_id and completed and completed_at >= now() - interval '7 days'
        union
        select completed_at::date from public.quiz_attempts
          where user_id = p_child_id and completed_at >= now() - interval '7 days') x),
    'lessons_week', coalesce((select count(*)::int from public.lesson_progress
        where user_id = p_child_id and completed and completed_at >= now() - interval '7 days'), 0),
    'quizzes_week', coalesce((select count(*)::int from public.quiz_attempts
        where user_id = p_child_id and completed_at >= now() - interval '7 days'), 0),
    'xp', (select xp from public.users where id = p_child_id),
    'groups', coalesce((select jsonb_agg(g.name) from public.group_members m
        join public.study_groups g on g.id = m.group_id where m.user_id = p_child_id), '[]'::jsonb),
    'flags_count', coalesce((select count(*)::int from public.moderation_flags
        where flagged_user_id = p_child_id or reporter_id = p_child_id), 0),
    'settings', coalesce((select to_jsonb(s) - 'child_id' - 'updated_at' from public.parental_settings s where s.child_id = p_child_id),
        jsonb_build_object('dm_enabled', true, 'daily_limit_minutes', null, 'weekly_report_email', false))
  ) into v_result;
  return v_result;
end; $$;

-- Le parent modifie les réglages de l'enfant.
create or replace function public.update_parental_settings(
  p_child_id uuid, p_dm_enabled boolean, p_daily_limit int, p_weekly_email boolean)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from public.parent_links where parent_id = auth.uid() and child_id = p_child_id) then
    raise exception 'NOT_LINKED';
  end if;
  insert into public.parental_settings (child_id, dm_enabled, daily_limit_minutes, weekly_report_email, updated_at)
  values (p_child_id, p_dm_enabled, p_daily_limit, p_weekly_email, now())
  on conflict (child_id) do update set
    dm_enabled = excluded.dm_enabled,
    daily_limit_minutes = excluded.daily_limit_minutes,
    weekly_report_email = excluded.weekly_report_email,
    updated_at = now();
end; $$;

revoke execute on function public.generate_parent_code() from anon;
revoke execute on function public.redeem_parent_code(text) from anon;
revoke execute on function public.parent_dashboard(uuid) from anon;
revoke execute on function public.update_parental_settings(uuid, boolean, int, boolean) from anon;
