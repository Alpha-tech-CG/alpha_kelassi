-- Alpha Kelassi — Cours structurés (texte + images), édités depuis l'admin
-- Migration 021 : hiérarchie Cours → Objectif Général (O.G) → Objectif Spécifique (O.S) → contenu en blocs

-- ── Cours ────────────────────────────────────────────────────────────────────
create table if not exists public.courses (
  id           uuid primary key default gen_random_uuid(),
  subject_id   uuid not null references public.subjects(id) on delete cascade,
  level        study_level not null,
  title        text not null,
  subtitle     text,
  country_code char(2) not null default 'CG',
  is_premium   boolean not null default false,
  position     integer not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index if not exists courses_subject_idx on public.courses(subject_id);
create index if not exists courses_level_idx   on public.courses(level);

-- ── Objectifs Généraux (O.G) ─────────────────────────────────────────────────
create table if not exists public.course_objectives (
  id         uuid primary key default gen_random_uuid(),
  course_id  uuid not null references public.courses(id) on delete cascade,
  title      text not null,
  position   integer not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists course_objectives_course_idx on public.course_objectives(course_id);

-- ── Objectifs Spécifiques (O.S) + contenu ────────────────────────────────────
-- content = tableau de blocs jsonb :
--   [{ "type": "subtitle",  "text": "..." },
--    { "type": "paragraph", "text": "..." },
--    { "type": "image",     "url": "https://...", "caption": "..." }]
create table if not exists public.course_lessons (
  id           uuid primary key default gen_random_uuid(),
  objective_id uuid not null references public.course_objectives(id) on delete cascade,
  title        text not null,
  content      jsonb not null default '[]'::jsonb,
  position     integer not null default 0,
  created_at   timestamptz not null default now()
);
create index if not exists course_lessons_objective_idx on public.course_lessons(objective_id);

-- ── RLS : lecture pour les utilisateurs authentifiés, écriture réservée au
--         service role (admin, qui bypass la RLS) ──────────────────────────────
alter table public.courses            enable row level security;
alter table public.course_objectives  enable row level security;
alter table public.course_lessons     enable row level security;

drop policy if exists "courses_read"    on public.courses;
drop policy if exists "objectives_read" on public.course_objectives;
drop policy if exists "lessons_read"    on public.course_lessons;

create policy "courses_read"    on public.courses           for select to authenticated using (true);
create policy "objectives_read" on public.course_objectives for select to authenticated using (true);
create policy "lessons_read"    on public.course_lessons    for select to authenticated using (true);

-- ── Storage : bucket public pour les images des cours ────────────────────────
insert into storage.buckets (id, name, public)
values ('course-images', 'course-images', true)
on conflict (id) do nothing;

-- Lecture publique des images
drop policy if exists "course_images_read" on storage.objects;
create policy "course_images_read" on storage.objects
  for select using (bucket_id = 'course-images');
