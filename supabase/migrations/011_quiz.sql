-- Migration 011 : QCM chronométrés (Quiz Service)
-- QCM à choix multiple avec chrono, score, corrigé et détection des points faibles.

-- Un QCM appartient à une matière (et optionnellement à un document source)
create table if not exists public.quizzes (
  id             uuid primary key default gen_random_uuid(),
  subject_id     uuid not null references public.subjects(id) on delete cascade,
  document_id    uuid references public.documents(id) on delete set null,
  title          text not null,
  description    text,
  level          study_level not null,
  time_limit_sec integer not null default 600,   -- durée totale du QCM (10 min par défaut)
  is_premium     boolean not null default false,
  created_at     timestamptz not null default now()
);

create index if not exists idx_quizzes_subject on public.quizzes(subject_id, level);

-- Questions d'un QCM
create table if not exists public.quiz_questions (
  id            uuid primary key default gen_random_uuid(),
  quiz_id       uuid not null references public.quizzes(id) on delete cascade,
  position      smallint not null,                 -- ordre d'affichage (1..N)
  prompt        text not null,
  options       jsonb not null,                    -- ["Option A", "Option B", ...]
  correct_index smallint not null,                 -- index de la bonne réponse dans options
  explanation   text,                              -- corrigé affiché après soumission
  created_at    timestamptz not null default now(),
  unique(quiz_id, position)
);

create index if not exists idx_quiz_questions_quiz on public.quiz_questions(quiz_id, position);

-- Tentatives d'un utilisateur sur un QCM
create table if not exists public.quiz_attempts (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references public.users(id) on delete cascade,
  quiz_id      uuid not null references public.quizzes(id) on delete cascade,
  score        smallint not null,                  -- nombre de bonnes réponses
  total        smallint not null,                  -- nombre de questions
  duration_sec integer not null,                   -- temps réellement passé
  completed_at timestamptz not null default now()
);

create index if not exists idx_quiz_attempts_user on public.quiz_attempts(user_id, completed_at desc);
create index if not exists idx_quiz_attempts_quiz on public.quiz_attempts(quiz_id);

-- Réponse par question (base de la détection des points faibles)
create table if not exists public.quiz_attempt_answers (
  id             uuid primary key default gen_random_uuid(),
  attempt_id     uuid not null references public.quiz_attempts(id) on delete cascade,
  question_id    uuid not null references public.quiz_questions(id) on delete cascade,
  selected_index smallint,                          -- null = question laissée sans réponse
  is_correct     boolean not null
);

create index if not exists idx_quiz_answers_attempt on public.quiz_attempt_answers(attempt_id);

-- ============================================================
-- RPC de soumission (anti-triche) : le score est calculé côté
-- serveur, jamais côté client. Utilisable par web ET mobile.
-- p_answers = [{"question_id":"uuid","selected_index":2}, ...]
-- ============================================================
create or replace function public.submit_quiz_attempt(
  p_quiz_id uuid,
  p_answers jsonb,
  p_duration_sec integer
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
  v_total      smallint;
  v_result     jsonb;
begin
  if v_user_id is null then
    raise exception 'AUTH_REQUIRED';
  end if;

  -- Vérifie l'accès au QCM (gating premium comme les documents)
  select is_premium into v_is_premium from public.quizzes where id = p_quiz_id;
  if v_is_premium is null then
    raise exception 'QUIZ_NOT_FOUND';
  end if;
  if v_is_premium and public.current_user_plan() <> 'premium' then
    raise exception 'PREMIUM_REQUIRED';
  end if;

  select count(*)::smallint into v_total from public.quiz_questions where quiz_id = p_quiz_id;

  insert into public.quiz_attempts (user_id, quiz_id, score, total, duration_sec)
    values (v_user_id, p_quiz_id, 0, v_total, greatest(p_duration_sec, 0))
    returning id into v_attempt_id;

  -- Corrige chaque question côté serveur
  insert into public.quiz_attempt_answers (attempt_id, question_id, selected_index, is_correct)
  select
    v_attempt_id,
    q.id,
    (a.selected_index)::smallint,
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
    from public.quiz_attempt_answers
    where attempt_id = v_attempt_id and is_correct;

  update public.quiz_attempts set score = v_score where id = v_attempt_id;

  -- Corrigé détaillé renvoyé au client (bonnes réponses + explications)
  select jsonb_build_object(
    'attempt_id', v_attempt_id,
    'score', v_score,
    'total', v_total,
    'corrections', coalesce(jsonb_agg(
      jsonb_build_object(
        'question_id', q.id,
        'correct_index', q.correct_index,
        'explanation', q.explanation
      ) order by q.position
    ), '[]'::jsonb)
  ) into v_result
  from public.quiz_questions q
  where q.quiz_id = p_quiz_id;

  return v_result;
end;
$$;

-- ============================================================
-- Vue : points faibles de l'utilisateur (matières où il rate le plus)
-- ============================================================
create or replace view public.quiz_weak_areas as
select
  qa.user_id,
  s.id   as subject_id,
  s.name as subject_name,
  count(*)                             as answered,
  count(*) filter (where not ans.is_correct) as wrong,
  round(
    100.0 * count(*) filter (where not ans.is_correct) / nullif(count(*), 0)
  )::int as error_rate
from public.quiz_attempt_answers ans
join public.quiz_attempts qa on qa.id = ans.attempt_id
join public.quiz_questions qq on qq.id = ans.question_id
join public.quizzes qz on qz.id = qq.quiz_id
join public.subjects s on s.id = qz.subject_id
group by qa.user_id, s.id, s.name;

-- ============================================================
-- RLS
-- ============================================================
alter table public.quizzes             enable row level security;
alter table public.quiz_questions       enable row level security;
alter table public.quiz_attempts        enable row level security;
alter table public.quiz_attempt_answers enable row level security;

-- QUIZZES : lecture libre (free) + premium selon le plan ; écriture admin
create policy "quizzes: select free content" on public.quizzes
  for select using (
    auth.uid() is not null
    and (is_premium = false or public.current_user_plan() = 'premium')
  );
create policy "quizzes: admin only write" on public.quizzes
  for all using (public.current_user_role() = 'admin');

-- QUIZ_QUESTIONS : accessibles via le QCM parent.
-- NB : correct_index/explanation restent lisibles ; le front NE doit PAS
-- les envoyer avant soumission (les routes de lecture les excluent).
create policy "quiz_questions: select via quiz access" on public.quiz_questions
  for select using (
    exists (
      select 1 from public.quizzes qz
      where qz.id = quiz_id
        and (qz.is_premium = false or public.current_user_plan() = 'premium')
    )
    and auth.uid() is not null
  );
create policy "quiz_questions: admin only write" on public.quiz_questions
  for all using (public.current_user_role() = 'admin');

-- QUIZ_ATTEMPTS : chacun voit et crée les siennes
create policy "quiz_attempts: select own" on public.quiz_attempts
  for select using (user_id = auth.uid());
create policy "quiz_attempts: insert own" on public.quiz_attempts
  for insert with check (user_id = auth.uid());

-- QUIZ_ATTEMPT_ANSWERS : accessibles via la tentative parente
create policy "quiz_answers: select own" on public.quiz_attempt_answers
  for select using (
    exists (
      select 1 from public.quiz_attempts qa
      where qa.id = attempt_id and qa.user_id = auth.uid()
    )
  );
