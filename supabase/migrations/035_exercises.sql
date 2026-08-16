-- Alpha Kelassi V2 — Phase 2 : exercices + corrigés détaillés
-- Migration 035
--
-- Modèle : chaque chapitre a des exercices (énoncé markdown/LaTeX, difficulté).
-- Le CORRIGÉ est dans une table séparée, lisible seulement APRÈS que l'élève a
-- tenté l'exercice (règle « Voir corrigé débloqué après tentative » — A.1/A.3).
-- La distinction est faite par RLS, pas côté client : le corrigé ne transite
-- jamais tant que l'élève n'a pas de ligne dans exercise_attempts.

-- ── Exercices (énoncés) ───────────────────────────────────────────────────────
create table if not exists public.exercises (
  id          uuid primary key default gen_random_uuid(),
  chapter_id  uuid not null references public.chapters(id) on delete cascade,
  title       text not null,
  statement   text not null,                    -- énoncé (markdown + $LaTeX$)
  difficulty  smallint not null default 1 check (difficulty between 1 and 3),  -- 1 facile · 2 moyen · 3 difficile
  is_premium  boolean not null default false,
  order_index smallint not null default 0,
  created_at  timestamptz not null default now()
);
create index if not exists idx_exercises_chapter on public.exercises(chapter_id, order_index);

-- ── Corrigés (1 par exercice) ─────────────────────────────────────────────────
create table if not exists public.exercise_solutions (
  exercise_id uuid primary key references public.exercises(id) on delete cascade,
  solution    text not null,                    -- corrigé détaillé (markdown + $LaTeX$)
  created_at  timestamptz not null default now()
);

-- ── Tentatives (déverrouille le corrigé) ──────────────────────────────────────
create table if not exists public.exercise_attempts (
  user_id     uuid not null references public.users(id) on delete cascade,
  exercise_id uuid not null references public.exercises(id) on delete cascade,
  created_at  timestamptz not null default now(),
  primary key (user_id, exercise_id)
);
create index if not exists idx_exercise_attempts_user on public.exercise_attempts(user_id);

-- ── RLS ──────────────────────────────────────────────────────────────────────
alter table public.exercises          enable row level security;
alter table public.exercise_solutions enable row level security;
alter table public.exercise_attempts  enable row level security;

-- Énoncés : lecture par les authentifiés, premium filtré (comme les leçons).
drop policy if exists "exercises_read" on public.exercises;
create policy "exercises_read" on public.exercises for select to authenticated using (
  not is_premium
  or exists (select 1 from public.users where id = auth.uid() and plan = 'premium')
);

-- Tentatives : chaque élève gère les siennes (insert = déverrouillage du corrigé).
drop policy if exists "exercise_attempts_own" on public.exercise_attempts;
create policy "exercise_attempts_own" on public.exercise_attempts
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Corrigés : lisibles UNIQUEMENT si l'élève a une tentative sur cet exercice.
drop policy if exists "exercise_solutions_after_attempt" on public.exercise_solutions;
create policy "exercise_solutions_after_attempt" on public.exercise_solutions
  for select to authenticated using (
    exists (
      select 1 from public.exercise_attempts a
      where a.exercise_id = exercise_solutions.exercise_id and a.user_id = auth.uid()
    )
  );
-- (Les écritures sur exercises/exercise_solutions passent par le service role — admin.)
