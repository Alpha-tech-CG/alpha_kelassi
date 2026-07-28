-- Alpha Kelassi — Architecture pédagogique structurée
-- Migration 027 : Séries (filières) → Chapitres → Leçons (4 blocs) → Progression
--
-- RÉTROCOMPATIBILITÉ : additive uniquement. Aucune table existante n'est modifiée.
-- L'ancienne structure documents/courses (migr. 021) continue de coexister.

-- ── Filière (track_type) ─────────────────────────────────────────────────────
-- NB : le type track_type EXISTE DÉJÀ (migr. 026) avec les valeurs FR
--      ('generale', 'technique'). On se contente d'AJOUTER 'professionnel'
--      pour ne pas casser subjects.track_type ni l'API admin subjects.
alter type track_type add value if not exists 'professionnel';

-- ── Type de leçon (4 blocs par chapitre) ─────────────────────────────────────
do $$
begin
  if not exists (select 1 from pg_type where typname = 'lesson_type') then
    create type lesson_type as enum ('cours', 'resume', 'quiz', 'video');
  end if;
end $$;

-- ── Séries / filières (A, C, D, G1, G2, F3…) ─────────────────────────────────
create table if not exists public.series (
  id           uuid primary key default gen_random_uuid(),
  code         text not null,              -- 'A', 'C', 'D', 'G1', 'G2', 'F3'…
  label        text not null,              -- 'Série A — Lettres et Sciences Humaines'
  track        track_type not null,        -- generale | technique | professionnel
  level        study_level not null,       -- 'bepc' | 'bac_a' | 'bac_c' | 'bac_d'
  country_code char(2) not null default 'CG',
  created_at   timestamptz not null default now(),
  unique(code, track, level, country_code)
);
create index if not exists idx_series_level on public.series(level, track);

-- ── Chapitres d'une matière ──────────────────────────────────────────────────
create table if not exists public.chapters (
  id           uuid primary key default gen_random_uuid(),
  subject_id   uuid not null references public.subjects(id) on delete cascade,
  series_id    uuid references public.series(id) on delete set null,
  title        text not null,
  order_index  smallint not null default 0,
  description  text,
  created_at   timestamptz not null default now()
);
create index if not exists idx_chapters_subject on public.chapters(subject_id, order_index);

-- ── Leçons par chapitre (cours / résumé / quiz / vidéo) ──────────────────────
create table if not exists public.lessons (
  id           uuid primary key default gen_random_uuid(),
  chapter_id   uuid not null references public.chapters(id) on delete cascade,
  type         lesson_type not null,
  title        text not null,
  content      text,                       -- markdown pour cours / resume
  video_url    text,                       -- pour type='video'
  duration_min smallint,                   -- durée estimée (minutes)
  is_premium   boolean not null default false,
  order_index  smallint not null default 0,
  created_at   timestamptz not null default now()
);
create index if not exists idx_lessons_chapter on public.lessons(chapter_id, order_index);

-- ── Progression utilisateur par leçon ────────────────────────────────────────
create table if not exists public.lesson_progress (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references public.users(id) on delete cascade,
  lesson_id    uuid not null references public.lessons(id) on delete cascade,
  completed    boolean not null default false,
  score        smallint,                   -- type='quiz' : score 0-100
  completed_at timestamptz,
  unique(user_id, lesson_id)
);
create index if not exists idx_lesson_progress_user on public.lesson_progress(user_id);

-- ── RLS ──────────────────────────────────────────────────────────────────────
alter table public.series          enable row level security;
alter table public.chapters        enable row level security;
alter table public.lessons         enable row level security;
alter table public.lesson_progress enable row level security;

-- Référentiel public en lecture (authentifiés)
drop policy if exists "series_public_read"   on public.series;
drop policy if exists "chapters_public_read"  on public.chapters;
create policy "series_public_read"   on public.series   for select to authenticated using (true);
create policy "chapters_public_read" on public.chapters for select to authenticated using (true);

-- Leçons : les leçons premium ne sont lisibles que par les abonnés premium
drop policy if exists "lessons_read" on public.lessons;
create policy "lessons_read" on public.lessons for select to authenticated using (
  not is_premium
  or exists (select 1 from public.users where id = auth.uid() and plan = 'premium')
);

-- Progression : chaque élève ne voit et ne modifie que la sienne
drop policy if exists "lesson_progress_own" on public.lesson_progress;
create policy "lesson_progress_own" on public.lesson_progress
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- ── Vue : progression agrégée par chapitre ───────────────────────────────────
-- NB : reflète les leçons avec lesquelles l'utilisateur a interagi (LEFT JOIN).
--      Le total absolu de leçons d'un chapitre doit être recalculé côté API
--      depuis public.lessons si besoin d'un dénominateur exact.
create or replace view public.chapter_progress as
select
  lp.user_id,
  l.chapter_id,
  count(*) filter (where l.type = 'cours'  and lp.completed) as cours_done,
  count(*) filter (where l.type = 'resume' and lp.completed) as resume_done,
  count(*) filter (where l.type = 'quiz'   and lp.completed) as quiz_done,
  count(*) filter (where l.type = 'video'  and lp.completed) as video_done,
  avg(lp.score) filter (where l.type = 'quiz')               as quiz_avg_score,
  count(l.id)                                                as total_lessons,
  count(*) filter (where lp.completed)                       as completed_lessons
from public.lessons l
left join public.lesson_progress lp on lp.lesson_id = l.id
group by lp.user_id, l.chapter_id;
