-- Tests de la migration 078 (second audit de sécurité, lot A).
--
-- À exécuter APRÈS 078. Tout se déroule dans une transaction annulée ; le
-- script se termine volontairement sur l'exception TESTS_078_OK, qui garantit
-- l'annulation. Toute autre erreur signale un échec. Les vérifications « en
-- tant qu'élève » passent par SET ROLE authenticated + request.jwt.claims.

begin;

do $$
declare
  v_student uuid;
  v_quiz    uuid;
  v_n       int;
  v_res     jsonb;
  ok        boolean;
begin
  select id into v_student from public.users where role = 'student' order by created_at limit 1;
  if v_student is null then raise exception '078 aucun élève pour tester'; end if;

  -- QCM de chapitre ouvert à la formule gratuite (passable par n'importe quel élève).
  select q.id into v_quiz from public.quizzes q
   where not q.is_premium and not coalesce(q.is_exam, false) and q.deleted_at is null
     and q.chapter_id is not null and public.is_open_chapter(q.chapter_id)
     and exists (select 1 from public.quiz_questions qq where qq.quiz_id = q.id)
   limit 1;
  if v_quiz is null then raise exception '078 aucun QCM ouvert pour tester'; end if;

  -- ── En tant qu'élève ──────────────────────────────────────────────────────
  perform set_config('request.jwt.claims', json_build_object('sub', v_student, 'role', 'authenticated')::text, true);
  execute 'set local role authenticated';

  -- E1 : les questions restent lisibles (passage du QCM, comptage)…
  select count(*) into v_n from public.quiz_questions where quiz_id = v_quiz;
  if v_n = 0 then raise exception '078 E1 questions invisibles pour l''élève'; end if;
  perform id, quiz_id, position, prompt, options from public.quiz_questions where quiz_id = v_quiz limit 1;

  -- … mais pas les corrigés.
  ok := false;
  begin
    perform correct_index from public.quiz_questions where quiz_id = v_quiz limit 1;
  exception when insufficient_privilege then ok := true;
  end;
  if not ok then raise exception '078 E1 correct_index encore lisible'; end if;
  ok := false;
  begin
    perform explanation from public.quiz_questions where quiz_id = v_quiz limit 1;
  exception when insufficient_privilege then ok := true;
  end;
  if not ok then raise exception '078 E1 explanation encore lisible'; end if;

  -- E1 : la soumission renvoie toujours le corrigé, APRÈS les réponses.
  v_res := public.submit_quiz_attempt(v_quiz, '[]'::jsonb, 30, 'entrainement');
  if jsonb_array_length(v_res->'corrections') <> v_n or (v_res->'corrections'->0->>'correct_index') is null then
    raise exception '078 E1 soumission cassée : %', left(v_res::text, 200);
  end if;

  -- La vue des points faibles (security_invoker) fonctionne toujours.
  perform * from public.quiz_weak_areas where user_id = v_student;

  -- M1 : plus d'insertion dans users côté client.
  ok := false;
  begin
    insert into public.users (id, email, role) values (gen_random_uuid(), 'x@exemple.cg', 'admin');
  exception when insufficient_privilege then ok := true;
  end;
  if not ok then raise exception '078 M1 insertion users encore possible'; end if;

  -- M2 : plus d'écriture directe dans la file du support.
  ok := false;
  begin
    insert into public.beta_feedback (user_id, comment, priority) values (v_student, 'test', 5);
  exception when insufficient_privilege then ok := true;
  end;
  if not ok then raise exception '078 M2 beta_feedback encore inscriptible (élève)'; end if;

  execute 'reset role';

  -- M2 : ni par un visiteur.
  execute 'set local role anon';
  ok := false;
  begin
    insert into public.beta_feedback (comment, priority) values ('test', 5);
  exception when insufficient_privilege then ok := true;
  end;
  if not ok then raise exception '078 M2 beta_feedback encore inscriptible (visiteur)'; end if;
  execute 'reset role';

  -- ── M4 : plafond par compte (1 500 / heure) ──────────────────────────────
  insert into public.app_events (user_id, name, platform, props)
  select v_student, 'app_open', 'web', '{}'
  from generate_series(1, 1500 - (select count(*) from public.app_events
                                  where user_id = v_student and created_at > now() - interval '1 hour')::int);
  ok := false;
  begin
    insert into public.app_events (user_id, name, platform, props) values (v_student, 'app_open', 'web', '{}');
  exception when others then ok := (sqlerrm = 'APP_EVENT_RATE_LIMITED');
  end;
  if not ok then raise exception '078 M4 plafond par compte non appliqué'; end if;

  raise exception 'TESTS_078_OK';
end $$;

rollback;
