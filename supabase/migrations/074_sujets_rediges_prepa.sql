-- 074 — Sujets rédigés dans l'espace Prépa (26/10/2026).
--
-- Jusqu'ici, les rayons Bac test / Bac blanc / Bac rouge / Anciens bacs ne
-- proposaient que des QCM (quizzes). Un vrai sujet de bac est rédigé : énoncé
-- complet, durée, barème. On réutilise les EXERCICES (énoncé + corrigé débloqué
-- après tentative, contrôlé par RLS — migration 035) au lieu d'un nouveau moteur :
-- un exercice devient un « sujet d'épreuve » quand `exam_kind` est renseigné.
--
--   exam_kind    rayon où le sujet apparaît (mêmes valeurs que quizzes.exam_kind) ;
--   origin       'reel' (sujet officiel ou bac blanc d'une inspection) ou
--                'genere' (sujet créé par nous, inspiré des sujets réels :
--                mêmes notions et même structure, données et contexte différents) ;
--   variant_of   sujet réel dont un sujet généré s'inspire (facultatif) ;
--   duration_min durée officielle de l'épreuve ;
--   bareme       [{ "label": "Exercice 1", "points": 4 }, …] — sert à l'auto-notation ;
--   exam_year    session (sujets réels).
--
-- Une simulation de Bac blanc ALTERNE un sujet réel et un sujet généré (choix fait
-- par l'application à partir de l'historique de l'élève, table exam_results).

alter table public.exercises
  add column if not exists exam_kind text
    check (exam_kind in ('bac_test', 'bac_blanc', 'bac_rouge', 'ancien_bac')),
  add column if not exists origin text
    check (origin in ('reel', 'genere')),
  add column if not exists variant_of uuid references public.exercises(id) on delete set null,
  add column if not exists duration_min smallint check (duration_min > 0),
  add column if not exists bareme jsonb,
  add column if not exists exam_year smallint;

alter table public.exercises
  drop constraint if exists exercises_exam_fields_chk;
alter table public.exercises
  add constraint exercises_exam_fields_chk check (
    exam_kind is null or (origin is not null and duration_min is not null)
  );

comment on column public.exercises.exam_kind is
  'Rayon Prépa du sujet rédigé (null = exercice de TD seulement).';
comment on column public.exercises.origin is
  'reel = sujet officiel / bac blanc d''inspection ; genere = sujet créé par Cognix, inspiré des sujets réels.';

create index if not exists idx_exercises_exam
  on public.exercises(exam_kind, origin) where exam_kind is not null and deleted_at is null;

-- Lecture : Bac blanc et Bac rouge sont des rayons Pro (comme pour les QCM) ;
-- les anciens sujets et le Bac test restent ouverts dès Starter.
drop policy if exists "exercises_read" on public.exercises;
create policy "exercises_read" on public.exercises for select to authenticated using (
  deleted_at is null
  and (
    (select public.current_user_plan_level()) >= 1
    or (not is_premium and public.is_open_chapter(chapter_id))
  )
  and (
    exam_kind is null
    or exam_kind not in ('bac_blanc', 'bac_rouge')
    or (select public.current_user_plan_level()) >= 2
  )
);

-- Copies rendues et auto-notées (historique + alternance réel / généré).
create table if not exists public.exam_results (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references public.users(id) on delete cascade,
  exercise_id      uuid not null references public.exercises(id) on delete cascade,
  mode             text not null check (mode in ('bac_test', 'bac_blanc', 'bac_rouge', 'ancien_bac')),
  scores           jsonb not null default '[]'::jsonb,   -- [{ label, points, max }]
  total            numeric(5,2),
  max_total        numeric(5,2),
  duration_sec     integer check (duration_sec >= 0),
  created_at       timestamptz not null default now()
);
create index if not exists idx_exam_results_user on public.exam_results(user_id, created_at desc);

alter table public.exam_results enable row level security;
drop policy if exists "exam_results_own" on public.exam_results;
create policy "exam_results_own" on public.exam_results
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
