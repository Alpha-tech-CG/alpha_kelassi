-- Migration 060 : un même cours dans plusieurs séries (copies liées)
--
-- Une matière n'appartient qu'à une classe (`subjects.level`) et tout le contenu
-- élève est filtré par matière : un chapitre ne peut donc pas « vivre » dans deux
-- séries à la fois sans toucher à toutes les requêtes du web et du mobile.
-- On publie plutôt des COPIES LIÉES : le chapitre original garde la main, ses
-- copies (une par série) portent `source_chapter_id`, et chaque leçon, exercice,
-- QCM et question copié porte `source_id` = la ligne d'origine.
--
-- `sync_chapter_copies` remet chaque copie à l'image de l'original EN PLACE :
-- les lignes existantes sont mises à jour (mêmes id, donc la progression des
-- élèves de la série est conservée), les nouvelles sont ajoutées, celles dont
-- l'original a disparu sont retirées. Ce qu'un admin a ajouté directement dans
-- une copie (`source_id` nul) n'est jamais touché.
--
-- `source_id` n'a volontairement pas de clé étrangère : quand l'original est
-- supprimé, la copie doit pouvoir le constater (source introuvable) au lieu de
-- recevoir un NULL qui la confondrait avec un ajout manuel.

alter table public.chapters
  add column if not exists source_chapter_id uuid references public.chapters(id) on delete set null;
create index if not exists idx_chapters_source on public.chapters(source_chapter_id) where source_chapter_id is not null;

alter table public.lessons        add column if not exists source_id uuid;
alter table public.exercises      add column if not exists source_id uuid;
alter table public.quizzes        add column if not exists source_id uuid;
alter table public.quiz_questions add column if not exists source_id uuid;

comment on column public.chapters.source_chapter_id is
  'Chapitre original dont celui-ci est une copie liée (même cours publié dans une autre série).';

-- ── Synchronise UNE copie sur son original ────────────────────────────────────
create or replace function public.sync_chapter_copy(p_source uuid, p_target uuid)
returns void
language plpgsql
set search_path = public
as $$
declare
  v_src_quiz  public.quizzes%rowtype;
  v_tgt_quiz  uuid;
  v_subject   uuid;
  v_level     public.study_level;
begin
  -- Chapitre : intitulé et description suivent l'original ; l'ordre reste propre à la série.
  update public.chapters t set title = s.title, description = s.description
    from public.chapters s where s.id = p_source and t.id = p_target;

  -- Leçons
  update public.lessons t set
      type = s.type, title = s.title, content = s.content, video_url = s.video_url,
      duration_min = s.duration_min, is_premium = s.is_premium, order_index = s.order_index
    from public.lessons s
   where t.chapter_id = p_target and t.source_id = s.id and s.chapter_id = p_source;

  insert into public.lessons (chapter_id, type, title, content, video_url, duration_min, is_premium, order_index, source_id)
  select p_target, s.type, s.title, s.content, s.video_url, s.duration_min, s.is_premium, s.order_index, s.id
    from public.lessons s
   where s.chapter_id = p_source
     and not exists (select 1 from public.lessons t where t.chapter_id = p_target and t.source_id = s.id);

  delete from public.lessons t
   where t.chapter_id = p_target and t.source_id is not null
     and not exists (select 1 from public.lessons s where s.id = t.source_id and s.chapter_id = p_source);

  -- Exercices (la corbeille suit l'original) et corrigés
  update public.exercises t set
      title = s.title, statement = s.statement, difficulty = s.difficulty,
      is_premium = s.is_premium, order_index = s.order_index, deleted_at = s.deleted_at
    from public.exercises s
   where t.chapter_id = p_target and t.source_id = s.id and s.chapter_id = p_source;

  insert into public.exercises (chapter_id, title, statement, difficulty, is_premium, order_index, deleted_at, source_id)
  select p_target, s.title, s.statement, s.difficulty, s.is_premium, s.order_index, s.deleted_at, s.id
    from public.exercises s
   where s.chapter_id = p_source
     and not exists (select 1 from public.exercises t where t.chapter_id = p_target and t.source_id = s.id);

  -- Original supprimé définitivement : la copie part en corbeille (restaurable).
  update public.exercises t set deleted_at = coalesce(t.deleted_at, now())
   where t.chapter_id = p_target and t.source_id is not null
     and not exists (select 1 from public.exercises s where s.id = t.source_id and s.chapter_id = p_source);

  insert into public.exercise_solutions (exercise_id, solution)
  select t.id, ss.solution
    from public.exercises t
    join public.exercise_solutions ss on ss.exercise_id = t.source_id
   where t.chapter_id = p_target
  on conflict (exercise_id) do update set solution = excluded.solution;

  -- QCM de fin de chapitre
  select * into v_src_quiz from public.quizzes
   where chapter_id = p_source and deleted_at is null limit 1;
  select id into v_tgt_quiz from public.quizzes
   where chapter_id = p_target and deleted_at is null limit 1;

  if v_src_quiz.id is null then
    -- L'original n'a plus de QCM : la copie synchronisée part en corbeille.
    update public.quizzes set deleted_at = now()
     where id = v_tgt_quiz and source_id is not null;
    return;
  end if;

  if v_tgt_quiz is null then
    select c.subject_id, s.level into v_subject, v_level
      from public.chapters c join public.subjects s on s.id = c.subject_id where c.id = p_target;
    insert into public.quizzes (chapter_id, subject_id, level, title, description, time_limit_sec, is_premium, source_id)
    values (p_target, v_subject, v_level, v_src_quiz.title, v_src_quiz.description,
            v_src_quiz.time_limit_sec, v_src_quiz.is_premium, v_src_quiz.id)
    returning id into v_tgt_quiz;
  else
    update public.quizzes set title = v_src_quiz.title, description = v_src_quiz.description,
           time_limit_sec = v_src_quiz.time_limit_sec, is_premium = v_src_quiz.is_premium,
           source_id = coalesce(source_id, v_src_quiz.id)
     where id = v_tgt_quiz;
  end if;

  -- Questions : on écarte d'abord les positions (unique par QCM) pour éviter
  -- les collisions pendant la remise en ordre.
  update public.quiz_questions set position = position + 10000 where quiz_id = v_tgt_quiz;

  update public.quiz_questions t set
      position = s.position, prompt = s.prompt, options = s.options,
      correct_index = s.correct_index, explanation = s.explanation
    from public.quiz_questions s
   where t.quiz_id = v_tgt_quiz and t.source_id = s.id and s.quiz_id = v_src_quiz.id;

  delete from public.quiz_questions t
   where t.quiz_id = v_tgt_quiz and t.source_id is not null
     and not exists (select 1 from public.quiz_questions s where s.id = t.source_id and s.quiz_id = v_src_quiz.id);

  insert into public.quiz_questions (quiz_id, position, prompt, options, correct_index, explanation, source_id)
  select v_tgt_quiz, s.position, s.prompt, s.options, s.correct_index, s.explanation, s.id
    from public.quiz_questions s
   where s.quiz_id = v_src_quiz.id
     and not exists (select 1 from public.quiz_questions t where t.quiz_id = v_tgt_quiz and t.source_id = s.id);

  -- Questions propres à la copie : à la suite de celles de l'original.
  with extra as (
    select id, row_number() over (order by position) rn
      from public.quiz_questions where quiz_id = v_tgt_quiz and position > 10000
  ), base as (
    select coalesce(max(position), 0) m from public.quiz_questions where quiz_id = v_tgt_quiz and position <= 10000
  )
  update public.quiz_questions q set position = base.m + extra.rn
    from extra, base where q.id = extra.id;
end;
$$;

-- ── Synchronise toutes les copies d'un chapitre (ou de son original) ─────────
create or replace function public.sync_chapter_copies(p_chapter uuid)
returns integer
language plpgsql
set search_path = public
as $$
declare
  v_root uuid;
  v_copy uuid;
  v_n    integer := 0;
begin
  select coalesce(source_chapter_id, id) into v_root from public.chapters where id = p_chapter;
  if v_root is null then return 0; end if;
  for v_copy in select id from public.chapters where source_chapter_id = v_root loop
    perform public.sync_chapter_copy(v_root, v_copy);
    v_n := v_n + 1;
  end loop;
  return v_n;
end;
$$;

-- ── Publie un chapitre dans une autre matière (autre série) ──────────────────
create or replace function public.copy_chapter_to_subject(p_chapter uuid, p_subject uuid)
returns uuid
language plpgsql
set search_path = public
as $$
declare
  v_root uuid;
  v_new  uuid;
begin
  -- Copier une copie revient à copier l'original : pas de chaînes de copies.
  select coalesce(source_chapter_id, id) into v_root from public.chapters where id = p_chapter;
  if v_root is null then raise exception 'CHAPTER_NOT_FOUND'; end if;

  select id into v_new from public.chapters
   where subject_id = p_subject and (id = v_root or source_chapter_id = v_root) limit 1;
  if v_new is not null then return v_new; end if;   -- déjà publié dans cette matière

  insert into public.chapters (subject_id, title, description, order_index, source_chapter_id)
  select p_subject, c.title, c.description,
         coalesce((select max(order_index) + 1 from public.chapters where subject_id = p_subject), 0),
         v_root
    from public.chapters c where c.id = v_root
  returning id into v_new;

  perform public.sync_chapter_copy(v_root, v_new);
  return v_new;
end;
$$;

-- Réservées au serveur (console admin, clé service).
revoke execute on function public.sync_chapter_copy(uuid, uuid)     from public, anon, authenticated;
revoke execute on function public.sync_chapter_copies(uuid)         from public, anon, authenticated;
revoke execute on function public.copy_chapter_to_subject(uuid, uuid) from public, anon, authenticated;
grant  execute on function public.sync_chapter_copy(uuid, uuid)     to service_role;
grant  execute on function public.sync_chapter_copies(uuid)         to service_role;
grant  execute on function public.copy_chapter_to_subject(uuid, uuid) to service_role;
