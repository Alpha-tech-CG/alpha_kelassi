-- Alpha Kelassi — Calendrier scolaire CEPE
-- Migration 045
--
-- Purement additif : indexe dans le temps le contenu CEPE déjà écrit
-- (subjects/chapters/lessons/exercises/quizzes) sans rien renommer ni déplacer.
-- Portée : niveau CEPE uniquement pour cette phase (BEPC/BAC non concernés).

-- ── Année scolaire ────────────────────────────────────────────────────────────
create table if not exists public.academic_years (
  id           uuid primary key default gen_random_uuid(),
  level        study_level not null,
  country_code char(2) not null default 'CG',
  label        text not null,                 -- '2025-2026'
  start_date   date not null,
  end_date     date not null,
  created_at   timestamptz not null default now(),
  unique(level, country_code, label)
);
create index if not exists idx_academic_years_dates on public.academic_years(level, start_date, end_date);

-- ── Trimestre ─────────────────────────────────────────────────────────────────
create table if not exists public.terms (
  id               uuid primary key default gen_random_uuid(),
  academic_year_id uuid not null references public.academic_years(id) on delete cascade,
  term_number      smallint not null check (term_number between 1 and 3),
  label            text not null,              -- 'Trimestre 1'
  start_date       date not null,
  end_date         date not null,
  created_at       timestamptz not null default now(),
  unique(academic_year_id, term_number)
);
create index if not exists idx_terms_dates on public.terms(start_date, end_date);
create index if not exists idx_terms_year on public.terms(academic_year_id);

-- ── Mois scolaire ─────────────────────────────────────────────────────────────
create table if not exists public.school_months (
  id          uuid primary key default gen_random_uuid(),
  term_id     uuid not null references public.terms(id) on delete cascade,
  label       text not null,                  -- 'Octobre 2025'
  start_date  date not null,
  end_date    date not null,
  order_index smallint not null,              -- 1..9 sur l'année scolaire
  created_at  timestamptz not null default now(),
  unique(term_id, order_index)
);
create index if not exists idx_school_months_dates on public.school_months(start_date, end_date);
create index if not exists idx_school_months_term on public.school_months(term_id);

-- ── Pivot contenu ↔ calendrier ────────────────────────────────────────────────
-- Grain recommandé : une ligne 'chapter' par chapitre (pilote le déblocage
-- mensuel). Les lignes 'quiz' marquent les tests mensuels/compositions.
-- Les lignes 'lesson'/'exercise' sont optionnelles (sélection fine pour révision).
create table if not exists public.curriculum_items (
  id              uuid primary key default gen_random_uuid(),
  subject_id      uuid not null references public.subjects(id) on delete cascade,
  chapter_id      uuid references public.chapters(id) on delete cascade,
  lesson_id       uuid references public.lessons(id) on delete cascade,
  exercise_id     uuid references public.exercises(id) on delete cascade,
  quiz_id         uuid references public.quizzes(id) on delete cascade,
  item_type       text not null check (item_type in ('chapter','lesson','exercise','quiz')),
  school_month_id uuid not null references public.school_months(id) on delete cascade,
  term_id         uuid not null references public.terms(id) on delete cascade,
  is_core         boolean not null default true,
  is_revision     boolean not null default false,
  order_index     smallint not null default 0,
  created_at      timestamptz not null default now(),
  constraint curriculum_items_one_ref check (
    (case when chapter_id  is not null then 1 else 0 end +
     case when lesson_id   is not null then 1 else 0 end +
     case when exercise_id is not null then 1 else 0 end +
     case when quiz_id     is not null then 1 else 0 end) = 1
  )
);
create index if not exists idx_curriculum_items_month on public.curriculum_items(school_month_id, order_index);
create index if not exists idx_curriculum_items_term on public.curriculum_items(term_id);
create index if not exists idx_curriculum_items_subject on public.curriculum_items(subject_id);
create unique index if not exists idx_curriculum_items_chapter on public.curriculum_items(chapter_id) where chapter_id is not null;
create unique index if not exists idx_curriculum_items_lesson on public.curriculum_items(lesson_id) where lesson_id is not null;
create unique index if not exists idx_curriculum_items_exercise on public.curriculum_items(exercise_id) where exercise_id is not null;
create unique index if not exists idx_curriculum_items_quiz on public.curriculum_items(quiz_id) where quiz_id is not null;

-- ── Suivi de révision par élève (remplace la notion de "student_progress") ────
-- Alimentée par l'app (upsert) à chaque lesson_progress/exercise_attempts/
-- quiz_attempts qui correspond à un curriculum_item. Ne modifie aucune des
-- 3 tables de progression existantes.
create table if not exists public.curriculum_item_review (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid not null references public.users(id) on delete cascade,
  curriculum_item_id uuid not null references public.curriculum_items(id) on delete cascade,
  score_best         smallint check (score_best between 0 and 100),
  attempts_count     smallint not null default 0,
  last_reviewed_at   timestamptz,
  next_review_at     timestamptz,
  ease_factor        real not null default 2.5,
  created_at         timestamptz not null default now(),
  unique(user_id, curriculum_item_id)
);
create index if not exists idx_cir_next_review on public.curriculum_item_review(user_id, next_review_at);
create index if not exists idx_cir_score on public.curriculum_item_review(user_id, score_best);

-- ── Tests mensuels / compositions trimestrielles (enrichit quizzes) ───────────
alter table public.quizzes
  add column if not exists is_monthly_test  boolean not null default false,
  add column if not exists is_term_exam     boolean not null default false,
  add column if not exists default_month_id uuid references public.school_months(id) on delete set null,
  add column if not exists default_term_id  uuid references public.terms(id) on delete set null;

create index if not exists idx_quizzes_monthly_test on public.quizzes(default_month_id) where is_monthly_test;
create index if not exists idx_quizzes_term_exam on public.quizzes(default_term_id) where is_term_exam;

-- ── Liaison fine quiz ↔ chapitres couverts (optionnelle) ───────────────────────
create table if not exists public.simulation_curriculum (
  quiz_id             uuid not null references public.quizzes(id) on delete cascade,
  curriculum_item_id  uuid not null references public.curriculum_items(id) on delete cascade,
  primary key (quiz_id, curriculum_item_id)
);
create index if not exists idx_simcur_item on public.simulation_curriculum(curriculum_item_id);

-- ── RLS ──────────────────────────────────────────────────────────────────────
alter table public.academic_years       enable row level security;
alter table public.terms                enable row level security;
alter table public.school_months        enable row level security;
alter table public.curriculum_items     enable row level security;
alter table public.curriculum_item_review enable row level security;
alter table public.simulation_curriculum enable row level security;

-- Référentiel calendrier : lecture libre pour les authentifiés (comme series/chapters)
drop policy if exists "academic_years_public_read" on public.academic_years;
create policy "academic_years_public_read" on public.academic_years for select to authenticated using (true);

drop policy if exists "terms_public_read" on public.terms;
create policy "terms_public_read" on public.terms for select to authenticated using (true);

drop policy if exists "school_months_public_read" on public.school_months;
create policy "school_months_public_read" on public.school_months for select to authenticated using (true);

drop policy if exists "curriculum_items_public_read" on public.curriculum_items;
create policy "curriculum_items_public_read" on public.curriculum_items for select to authenticated using (true);

drop policy if exists "simulation_curriculum_public_read" on public.simulation_curriculum;
create policy "simulation_curriculum_public_read" on public.simulation_curriculum for select to authenticated using (true);

-- Suivi de révision : chaque élève ne voit et ne modifie que le sien
drop policy if exists "curriculum_item_review_own" on public.curriculum_item_review;
create policy "curriculum_item_review_own" on public.curriculum_item_review
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Écritures sur le référentiel calendrier : service role uniquement (admin/scripts),
-- comme exercises/exercise_solutions (migr. 035).
