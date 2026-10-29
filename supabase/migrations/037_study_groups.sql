-- Alpha Kelassi V2 — Phase 4 : groupes de révision + messagerie (BLOC C + D)
-- Migration 037
--
-- Cœur : groupes, membres, messages de groupe (modérés AVANT publication par
-- l'IA côté serveur → un message bloqué n'est jamais visible), séances, et
-- signalements. La modération IA s'exécute dans la route POST message (Vercel
-- n'a pas de worker) ; le message n'est inséré que s'il passe.

create type group_type  as enum ('classe', 'matiere', 'officiel', 'prive');
create type member_role as enum ('member', 'admin');

create table public.study_groups (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  type        group_type not null default 'matiere',
  subject_id  uuid references public.subjects(id) on delete set null,
  created_by  uuid not null references public.users(id) on delete cascade,
  created_at  timestamptz not null default now()
);
create index idx_study_groups_type on public.study_groups(type);

create table public.group_members (
  group_id  uuid not null references public.study_groups(id) on delete cascade,
  user_id   uuid not null references public.users(id) on delete cascade,
  role      member_role not null default 'member',
  joined_at timestamptz not null default now(),
  primary key (group_id, user_id)
);
create index idx_group_members_user on public.group_members(user_id);

create table public.group_messages (
  id         uuid primary key default gen_random_uuid(),
  group_id   uuid not null references public.study_groups(id) on delete cascade,
  sender_id  uuid not null references public.users(id) on delete cascade,
  content    text not null,
  photo_url  text,
  ai_blocked boolean not null default false,   -- true = refusé par la modération (jamais affiché)
  created_at timestamptz not null default now()
);
create index idx_group_messages_group on public.group_messages(group_id, created_at desc);

create table public.group_sessions (
  id           uuid primary key default gen_random_uuid(),
  group_id     uuid not null references public.study_groups(id) on delete cascade,
  title        text not null,
  subject      text,
  scheduled_at timestamptz not null,
  duration_min smallint not null default 60,
  created_by   uuid not null references public.users(id) on delete cascade,
  created_at   timestamptz not null default now()
);
create index idx_group_sessions_group on public.group_sessions(group_id, scheduled_at);

create table public.session_participants (
  session_id uuid not null references public.group_sessions(id) on delete cascade,
  user_id    uuid not null references public.users(id) on delete cascade,
  joined_at  timestamptz not null default now(),
  primary key (session_id, user_id)
);

create table public.moderation_flags (
  id              uuid primary key default gen_random_uuid(),
  message_id      uuid references public.group_messages(id) on delete cascade,
  flagged_user_id uuid references public.users(id) on delete set null,
  reporter_id     uuid not null references public.users(id) on delete cascade,
  reason          text not null,
  status          text not null default 'open' check (status in ('open', 'reviewed', 'dismissed')),
  created_at      timestamptz not null default now()
);
create index idx_moderation_flags_status on public.moderation_flags(status, created_at desc);

-- ── Helper anti-récursion RLS ─────────────────────────────────────────────────
-- Une policy sur group_members qui interroge group_members provoquerait une
-- récursion infinie. On passe par une fonction SECURITY DEFINER (bypass RLS).
create or replace function public.is_group_member(gid uuid)
returns boolean language sql security definer stable set search_path = public as $$
  select exists (select 1 from public.group_members where group_id = gid and user_id = auth.uid());
$$;
revoke execute on function public.is_group_member(uuid) from anon;

-- ── RLS ──────────────────────────────────────────────────────────────────────
alter table public.study_groups        enable row level security;
alter table public.group_members       enable row level security;
alter table public.group_messages      enable row level security;
alter table public.group_sessions      enable row level security;
alter table public.session_participants enable row level security;
alter table public.moderation_flags    enable row level security;

-- Groupes : découverte ouverte aux authentifiés ; création par soi-même ; admin tout.
create policy "groups: read all" on public.study_groups for select to authenticated using (true);
create policy "groups: create own" on public.study_groups for insert to authenticated with check (created_by = auth.uid());
create policy "groups: admin all" on public.study_groups for all using (public.current_user_role() = 'admin') with check (public.current_user_role() = 'admin');

-- Membres : voir ses co-membres ; rejoindre/quitter soi-même.
create policy "members: read co-members" on public.group_members for select to authenticated
  using (user_id = auth.uid() or public.is_group_member(group_id));
create policy "members: join self" on public.group_members for insert to authenticated with check (user_id = auth.uid());
create policy "members: leave self" on public.group_members for delete to authenticated using (user_id = auth.uid());

-- Messages : lisibles par les membres, seulement s'ils ne sont pas bloqués.
-- (Insertion via service role après modération → pas de policy insert client.)
create policy "messages: read as member" on public.group_messages for select to authenticated
  using (not ai_blocked and public.is_group_member(group_id));
create policy "messages: admin all" on public.group_messages for all using (public.current_user_role() = 'admin') with check (public.current_user_role() = 'admin');

-- Séances : membres du groupe.
create policy "sessions: read as member" on public.group_sessions for select to authenticated using (public.is_group_member(group_id));
create policy "sessions: create as member" on public.group_sessions for insert to authenticated with check (public.is_group_member(group_id) and created_by = auth.uid());

create policy "participants: own" on public.session_participants for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Signalements : l'auteur crée les siens ; admin voit tout.
create policy "flags: create own" on public.moderation_flags for insert to authenticated with check (reporter_id = auth.uid());
create policy "flags: read own or admin" on public.moderation_flags for select to authenticated
  using (reporter_id = auth.uid() or public.current_user_role() = 'admin');

-- ── Realtime : diffusion des nouveaux messages aux membres ────────────────────
alter publication supabase_realtime add table public.group_messages;
