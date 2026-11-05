-- Migration 030 : Tracking utilisateurs & erreurs client (Dashboard personnel)

-- 1. Code promo sur les utilisateurs
alter table public.users
  add column if not exists promo_code text;

create index if not exists idx_users_promo_code on public.users(promo_code)
  where promo_code is not null;

-- 2. Vues de pages (quelles pages de l'app sont les plus visitées)
create table if not exists public.page_views (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references public.users(id) on delete set null,
  page_path   text not null,                 -- ex: '/dashboard', '/documents/xyz'
  duration_s  integer,                       -- durée de visite en secondes
  viewed_at   timestamptz not null default now(),
  platform    text default 'web'             -- 'web' | 'mobile'
);

create index if not exists idx_page_views_path    on public.page_views(page_path, viewed_at desc);
create index if not exists idx_page_views_user    on public.page_views(user_id, viewed_at desc);
create index if not exists idx_page_views_date    on public.page_views(viewed_at desc);

-- 3. Sessions de connexion (fréquence de login par user)
create table if not exists public.login_sessions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.users(id) on delete cascade,
  logged_in_at timestamptz not null default now(),
  ip_address  text,
  device      text,                          -- 'mobile' | 'desktop' | 'tablet'
  platform    text default 'web'             -- 'web' | 'mobile'
);

create index if not exists idx_login_sessions_user on public.login_sessions(user_id, logged_in_at desc);
create index if not exists idx_login_sessions_date on public.login_sessions(logged_in_at desc);

-- 4. Erreurs client (bugs détectés dans le frontend)
create table if not exists public.client_errors (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references public.users(id) on delete set null,
  page_path     text,
  error_type    text,                        -- ex: 'TypeError', 'NetworkError'
  error_message text,
  stack_trace   text,
  occurred_at   timestamptz not null default now(),
  browser       text,
  os            text,
  platform      text default 'web'
);

create index if not exists idx_client_errors_page on public.client_errors(page_path, occurred_at desc);
create index if not exists idx_client_errors_date on public.client_errors(occurred_at desc);

-- 5. RLS — page_views
alter table public.page_views enable row level security;

create policy "user insère ses propres vues"
  on public.page_views for insert
  with check (auth.uid() = user_id);

create policy "admin lit toutes les vues"
  on public.page_views for select
  using (
    exists (select 1 from public.users where id = auth.uid() and role = 'admin')
  );

-- 6. RLS — login_sessions
alter table public.login_sessions enable row level security;

create policy "user insère ses propres sessions"
  on public.login_sessions for insert
  with check (auth.uid() = user_id);

create policy "admin lit toutes les sessions"
  on public.login_sessions for select
  using (
    exists (select 1 from public.users where id = auth.uid() and role = 'admin')
  );

-- 7. RLS — client_errors
alter table public.client_errors enable row level security;

create policy "user insère ses propres erreurs"
  on public.client_errors for insert
  with check (auth.uid() = user_id);

create policy "admin lit toutes les erreurs"
  on public.client_errors for select
  using (
    exists (select 1 from public.users where id = auth.uid() and role = 'admin')
  );

-- 8. Vues agrégées pour le dashboard

-- Top 10 pages sur 7 jours
create or replace view public.top_pages_7d as
select
  page_path,
  count(*)                                          as view_count,
  count(distinct user_id)                           as unique_users,
  round(avg(duration_s))::integer                   as avg_duration_s
from public.page_views
where viewed_at >= now() - interval '7 days'
group by page_path
order by view_count desc
limit 10;

-- Pages qui ont eu des erreurs
create or replace view public.error_hotspots_7d as
select
  page_path,
  error_type,
  count(*)                                          as error_count,
  max(occurred_at)                                  as last_seen
from public.client_errors
where occurred_at >= now() - interval '7 days'
  and page_path is not null
group by page_path, error_type
order by error_count desc
limit 20;

-- Stats codes promo
create or replace view public.promo_code_stats as
select
  promo_code,
  count(*)                                          as user_count,
  min(created_at)                                   as first_use,
  max(created_at)                                   as last_use
from public.users
where promo_code is not null
group by promo_code
order by user_count desc;
