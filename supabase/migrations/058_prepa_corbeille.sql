-- Migration 058 : espace « Prépa » et corbeille du back office
--
-- 1. Type d'épreuve. Jusqu'ici une annale était un QCM `is_exam` que l'élève
--    passait dans le mode de son choix. L'espace Prépa range désormais les
--    épreuves par type — Bac test, Bac blanc, Bac rouge, Ancien bac — et par
--    matière. `exam_kind` dit dans quel rayon l'épreuve apparaît ; pour les trois
--    premiers, il fixe aussi le mode de passage (chrono, pénalité).
--
-- 2. Corbeille. Supprimer une épreuve ou un exercice par erreur effaçait aussi,
--    en cascade, les questions, les corrigés et l'historique des élèves. On passe
--    à une suppression douce (`deleted_at`) : l'élément disparaît pour les élèves
--    mais se restaure depuis la console. La suppression définitive reste possible
--    depuis la corbeille.

-- ── 1. Type d'épreuve ─────────────────────────────────────────────────────────
alter table public.quizzes
  add column if not exists exam_kind text
    check (exam_kind in ('bac_test', 'bac_blanc', 'bac_rouge', 'ancien_bac'));

comment on column public.quizzes.exam_kind is
  'Rayon de l''espace Prépa (bac_test, bac_blanc, bac_rouge, ancien_bac). NULL hors épreuves d''examen.';

-- Les annales datées sont des sujets d'anciennes sessions ; les autres
-- (dictées CEPE sans année…) deviennent des sujets d'entraînement « test ».
update public.quizzes
   set exam_kind = case when year is not null then 'ancien_bac' else 'bac_test' end
 where is_exam and exam_kind is null;

-- ── 2. Corbeille ──────────────────────────────────────────────────────────────
alter table public.quizzes   add column if not exists deleted_at timestamptz;
alter table public.exercises add column if not exists deleted_at timestamptz;

create index if not exists idx_quizzes_prepa
  on public.quizzes(subject_id, exam_kind) where is_exam and deleted_at is null;

-- Un QCM de chapitre en corbeille ne doit pas empêcher d'en créer un nouveau.
drop index if exists idx_quizzes_one_per_chapter;
create unique index idx_quizzes_one_per_chapter
  on public.quizzes(chapter_id)
  where chapter_id is not null and deleted_at is null;

-- Lecture élève : un élément en corbeille n'existe plus. (La policy « admin
-- only write » laisse les admins tout voir, d'où des filtres explicites côté
-- application.)
drop policy if exists "quizzes: select free content" on public.quizzes;
create policy "quizzes: select free content" on public.quizzes
  for select using (
    auth.uid() is not null
    and deleted_at is null
    and (is_premium = false or (select public.current_user_plan_level()) >= 1)
  );

drop policy if exists "quiz_questions: select via quiz access" on public.quiz_questions;
create policy "quiz_questions: select via quiz access" on public.quiz_questions
  for select using (
    exists (
      select 1 from public.quizzes qz
       where qz.id = quiz_questions.quiz_id
         and qz.deleted_at is null
         and (
           (select public.current_user_plan_level()) >= 1
           or (not qz.is_premium and not qz.is_exam and qz.chapter_id is not null
               and public.is_open_chapter(qz.chapter_id))
         )
    )
  );

drop policy if exists "exercises_read" on public.exercises;
create policy "exercises_read" on public.exercises for select to authenticated using (
  deleted_at is null
  and (
    (select public.current_user_plan_level()) >= 1
    or (not is_premium and public.is_open_chapter(chapter_id))
  )
);
