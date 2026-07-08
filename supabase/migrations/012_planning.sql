-- Migration 012 : Planning & révision (Planning Service)
-- Compte à rebours avant l'examen + plan de révision + emploi du temps quotidien.

-- Dates officielles des examens d'État (référentiel géré par l'admin)
create table if not exists public.exam_events (
  id           uuid primary key default uuid_generate_v4(),
  level        study_level not null,
  label        text not null,                 -- ex. "BEPC 2027"
  exam_date    date not null,
  country_code char(2) not null default 'CG',
  created_at   timestamptz not null default now()
);

create index if not exists idx_exam_events_level on public.exam_events(level, exam_date);

-- Plan de révision d'un élève (cible un examen)
create table if not exists public.revision_plans (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid not null references public.users(id) on delete cascade,
  level      study_level not null,
  title      text not null,
  exam_date  date not null,
  is_active  boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists idx_revision_plans_user on public.revision_plans(user_id, is_active);

-- Séances de révision planifiées (l'emploi du temps)
create table if not exists public.revision_sessions (
  id             uuid primary key default uuid_generate_v4(),
  user_id        uuid not null references public.users(id) on delete cascade,
  plan_id        uuid references public.revision_plans(id) on delete cascade,
  subject_id     uuid references public.subjects(id) on delete set null,
  title          text not null,
  scheduled_date date not null,
  duration_min   smallint not null default 30,
  is_done        boolean not null default false,
  done_at        timestamptz,
  created_at     timestamptz not null default now()
);

create index if not exists idx_revision_sessions_user_date
  on public.revision_sessions(user_id, scheduled_date);

-- ============================================================
-- RLS
-- ============================================================
alter table public.exam_events       enable row level security;
alter table public.revision_plans     enable row level security;
alter table public.revision_sessions  enable row level security;

-- EXAM_EVENTS : lecture pour tout utilisateur connecté, écriture admin
create policy "exam_events: select all" on public.exam_events
  for select using (auth.uid() is not null);
create policy "exam_events: admin write" on public.exam_events
  for all using (public.current_user_role() = 'admin');

-- REVISION_PLANS : chacun gère les siens
create policy "revision_plans: all own" on public.revision_plans
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- REVISION_SESSIONS : chacun gère les siennes
create policy "revision_sessions: all own" on public.revision_sessions
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ============================================================
-- Seed : exemples de dates d'examen (l'admin ajustera les dates officielles)
-- ============================================================
insert into public.exam_events (level, label, exam_date) values
  ('bepc',  'BEPC 2027',           '2027-06-14'),
  ('bac_a', 'BAC Série A 2027',    '2027-06-28'),
  ('bac_c', 'BAC Série C 2027',    '2027-06-28'),
  ('bac_d', 'BAC Série D 2027',    '2027-06-28')
on conflict do nothing;
