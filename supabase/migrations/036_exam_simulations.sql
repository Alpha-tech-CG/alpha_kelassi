-- Alpha Kelassi V2 — Phase 3 : simulations d'examen (annales)
-- Migration 036
--
-- Réutilise le moteur de QCM (migr. 011). Un « annale » = un quiz marqué
-- is_exam avec une année. 4 modes de passage (A.3) :
--   entrainement · bac_test · bac_blanc · bac_rouge (pénalité -1 par erreur).
-- Le score et la pénalité sont calculés CÔTÉ SERVEUR (anti-triche) dans la RPC.

alter table public.quizzes add column if not exists is_exam boolean not null default false;
alter table public.quizzes add column if not exists year    smallint;
create index if not exists idx_quizzes_exam on public.quizzes(level, year) where is_exam;

alter table public.quiz_attempts add column if not exists mode text;

-- On remplace la RPC par une version qui accepte le mode et calcule la
-- pénalité. p_mode a une valeur par défaut → les appels à 3 arguments
-- existants (PostgREST) continuent de fonctionner via le défaut.
drop function if exists public.submit_quiz_attempt(uuid, jsonb, integer);

create or replace function public.submit_quiz_attempt(
  p_quiz_id uuid,
  p_answers jsonb,
  p_duration_sec integer,
  p_mode text default 'bac_blanc'
)
returns jsonb
language plpgsql
security definer
as $$
declare
  v_user_id    uuid := auth.uid();
  v_is_premium boolean;
  v_attempt_id uuid;
  v_score      smallint := 0;
  v_wrong      smallint := 0;
  v_total      smallint;
  v_penalized  smallint;
  v_result     jsonb;
begin
  if v_user_id is null then
    raise exception 'AUTH_REQUIRED';
  end if;

  select is_premium into v_is_premium from public.quizzes where id = p_quiz_id;
  if v_is_premium is null then
    raise exception 'QUIZ_NOT_FOUND';
  end if;
  if v_is_premium and public.current_user_plan() <> 'premium' then
    raise exception 'PREMIUM_REQUIRED';
  end if;

  select count(*)::smallint into v_total from public.quiz_questions where quiz_id = p_quiz_id;

  insert into public.quiz_attempts (user_id, quiz_id, score, total, duration_sec, mode)
    values (v_user_id, p_quiz_id, 0, v_total, greatest(p_duration_sec, 0), p_mode)
    returning id into v_attempt_id;

  insert into public.quiz_attempt_answers (attempt_id, question_id, selected_index, is_correct)
  select
    v_attempt_id, q.id, (a.selected_index)::smallint,
    (a.selected_index is not null and a.selected_index = q.correct_index)
  from public.quiz_questions q
  left join lateral (
    select (elem->>'selected_index')::int as selected_index
    from jsonb_array_elements(p_answers) elem
    where elem->>'question_id' = q.id::text
    limit 1
  ) a on true
  where q.quiz_id = p_quiz_id;

  select count(*)::smallint into v_score
    from public.quiz_attempt_answers where attempt_id = v_attempt_id and is_correct;
  -- Mauvaises réponses effectivement données (une case cochée mais fausse).
  select count(*)::smallint into v_wrong
    from public.quiz_attempt_answers
    where attempt_id = v_attempt_id and selected_index is not null and not is_correct;

  update public.quiz_attempts set score = v_score where id = v_attempt_id;

  -- Bac rouge : pénalité -1 par mauvaise réponse (plancher à 0).
  v_penalized := case when p_mode = 'bac_rouge' then greatest(0, v_score - v_wrong) else v_score end;

  select jsonb_build_object(
    'attempt_id', v_attempt_id,
    'score', v_score,
    'penalized_score', v_penalized,
    'wrong', v_wrong,
    'total', v_total,
    'mode', p_mode,
    'corrections', coalesce(jsonb_agg(
      jsonb_build_object('question_id', q.id, 'correct_index', q.correct_index, 'explanation', q.explanation)
      order by q.position
    ), '[]'::jsonb)
  ) into v_result
  from public.quiz_questions q
  where q.quiz_id = p_quiz_id;

  return v_result;
end;
$$;
