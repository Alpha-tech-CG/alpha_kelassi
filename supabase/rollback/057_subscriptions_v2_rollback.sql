-- Retour arrière de la migration 057 (nouvelles formules Cognix).
--
-- À exécuter en une fois dans l'éditeur SQL Supabase si 057 doit être annulée.
-- Rétablit les policies et fonctions d'origine, restaure `users.plan` depuis la
-- sauvegarde, puis supprime les objets ajoutés.
--
-- ⚠️ Les tables payment_transactions, subscription_admin_audit, usage_* et
-- progress_reports sont SUPPRIMÉES : exportez-les d'abord si des paiements
-- réels ont eu lieu depuis l'application de 057 (obligation de conservation).
-- Les valeurs d'enum ajoutées par 056 ne peuvent pas être retirées sans
-- recréer les types ; elles restent inutilisées et sans effet.

begin;

-- 1. Données : formules d'avant la migration
update public.users u
   set plan = b.plan::user_plan
  from public.backup_057_users_plan b
 where b.id = u.id;

delete from public.subscriptions where source = 'legacy' and notes like 'Migration 057%';
update public.subscriptions s
   set plan = b.plan
  from public.backup_057_subscriptions b
 where b.id = s.id;

-- 2. Fonctions d'origine
create or replace function public.current_user_plan()
returns user_plan language sql security definer stable set search_path = public, pg_temp as $$
  select plan from public.users where id = auth.uid()
$$;

drop function if exists public.submit_quiz_attempt(uuid, jsonb, integer, text);
create or replace function public.submit_quiz_attempt(
  p_quiz_id uuid, p_answers jsonb, p_duration_sec integer, p_mode text default 'bac_blanc'
)
returns jsonb language plpgsql security definer as $$
declare
  v_user_id uuid := auth.uid(); v_is_premium boolean; v_attempt_id uuid;
  v_score smallint := 0; v_wrong smallint := 0; v_total smallint; v_penalized smallint; v_result jsonb;
begin
  if v_user_id is null then raise exception 'AUTH_REQUIRED'; end if;
  select is_premium into v_is_premium from public.quizzes where id = p_quiz_id;
  if v_is_premium is null then raise exception 'QUIZ_NOT_FOUND'; end if;
  if v_is_premium and public.current_user_plan() <> 'premium' then raise exception 'PREMIUM_REQUIRED'; end if;
  select count(*)::smallint into v_total from public.quiz_questions where quiz_id = p_quiz_id;
  insert into public.quiz_attempts (user_id, quiz_id, score, total, duration_sec, mode)
    values (v_user_id, p_quiz_id, 0, v_total, greatest(p_duration_sec, 0), p_mode) returning id into v_attempt_id;
  insert into public.quiz_attempt_answers (attempt_id, question_id, selected_index, is_correct)
  select v_attempt_id, q.id, (a.selected_index)::smallint, (a.selected_index is not null and a.selected_index = q.correct_index)
    from public.quiz_questions q
    left join lateral (select (elem->>'selected_index')::int as selected_index from jsonb_array_elements(p_answers) elem
                        where elem->>'question_id' = q.id::text limit 1) a on true
   where q.quiz_id = p_quiz_id;
  select count(*)::smallint into v_score from public.quiz_attempt_answers where attempt_id = v_attempt_id and is_correct;
  select count(*)::smallint into v_wrong from public.quiz_attempt_answers
   where attempt_id = v_attempt_id and selected_index is not null and not is_correct;
  update public.quiz_attempts set score = v_score where id = v_attempt_id;
  v_penalized := case when p_mode = 'bac_rouge' then greatest(0, v_score - v_wrong) else v_score end;
  select jsonb_build_object('attempt_id', v_attempt_id, 'score', v_score, 'penalized_score', v_penalized, 'wrong', v_wrong,
    'total', v_total, 'mode', p_mode,
    'corrections', coalesce(jsonb_agg(jsonb_build_object('question_id', q.id, 'correct_index', q.correct_index,
      'explanation', q.explanation) order by q.position), '[]'::jsonb))
    into v_result from public.quiz_questions q where q.quiz_id = p_quiz_id;
  return v_result;
end; $$;

-- 3. Policies d'origine
drop policy if exists "lessons_read" on public.lessons;
create policy "lessons_read" on public.lessons for select to authenticated using (
  not is_premium or exists (select 1 from public.users where id = auth.uid() and plan = 'premium'));

drop policy if exists "exercises_read" on public.exercises;
create policy "exercises_read" on public.exercises for select to authenticated using (
  not is_premium or exists (select 1 from public.users where id = auth.uid() and plan = 'premium'));

drop policy if exists "exercise_solutions_after_attempt" on public.exercise_solutions;
create policy "exercise_solutions_after_attempt" on public.exercise_solutions for select to authenticated using (
  exists (select 1 from public.exercise_attempts a where a.exercise_id = exercise_solutions.exercise_id and a.user_id = auth.uid()));

drop policy if exists "quizzes: select free content" on public.quizzes;
create policy "quizzes: select free content" on public.quizzes for select using (
  auth.uid() is not null and (is_premium = false or public.current_user_plan() = 'premium'));

drop policy if exists "quiz_questions: select via quiz access" on public.quiz_questions;
create policy "quiz_questions: select via quiz access" on public.quiz_questions for select using (
  exists (select 1 from public.quizzes qz where qz.id = quiz_id
           and (qz.is_premium = false or public.current_user_plan() = 'premium')));

drop policy if exists "documents: select free content" on public.documents;
create policy "documents: select free content" on public.documents for select using (
  auth.uid() is not null and (is_premium = false or public.current_user_plan() = 'premium'));

drop policy if exists "chunks: select via document access" on public.document_chunks;
create policy "chunks: select via document access" on public.document_chunks for select using (
  exists (select 1 from public.documents d where d.id = document_chunks.document_id
           and (d.is_premium = false or public.current_user_plan() = 'premium'))
  and auth.uid() is not null);

drop policy if exists "videos: select free content" on public.videos;
create policy "videos: select free content" on public.videos for select using (
  auth.uid() is not null and (is_premium = false or public.current_user_plan() = 'premium'));

update storage.buckets set public = true where id = 'pdfs-public';
drop policy if exists "pdfs-public: read allowed documents" on storage.objects;
create policy "pdfs-public: read all" on storage.objects for select using (bucket_id = 'pdfs-public');

drop policy if exists "pdfs-premium: read premium users" on storage.objects;
create policy "pdfs-premium: read premium users" on storage.objects for select using (
  bucket_id = 'pdfs-premium' and auth.uid() is not null and public.current_user_plan() = 'premium');

create policy "users: admin update all" on public.users
  for update using (public.current_user_role() = 'admin') with check (public.current_user_role() = 'admin');

drop policy if exists "subscriptions: admin read" on public.subscriptions;

-- 4. Tableau de bord parent d'origine (migration 042) — à rétablir AVANT de
--    supprimer user_plan_level, dont dépend la version 057.
create or replace function public.parent_dashboard(p_child_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_result jsonb;
begin
  if not exists (select 1 from public.parent_links where parent_id = auth.uid() and child_id = p_child_id) then
    raise exception 'NOT_LINKED';
  end if;
  select jsonb_build_object(
    'child_name', (select coalesce(full_name, 'Enfant') from public.users where id = p_child_id),
    'last_active', (select max(last_active) from public.user_progress where user_id = p_child_id),
    'active_days_week', (select count(distinct d)::int from (
        select completed_at::date d from public.lesson_progress
          where user_id = p_child_id and completed and completed_at >= now() - interval '7 days'
        union
        select completed_at::date from public.quiz_attempts
          where user_id = p_child_id and completed_at >= now() - interval '7 days') x),
    'lessons_week', coalesce((select count(*)::int from public.lesson_progress
        where user_id = p_child_id and completed and completed_at >= now() - interval '7 days'), 0),
    'quizzes_week', coalesce((select count(*)::int from public.quiz_attempts
        where user_id = p_child_id and completed_at >= now() - interval '7 days'), 0),
    'xp', (select xp from public.users where id = p_child_id),
    'groups', coalesce((select jsonb_agg(g.name) from public.group_members m
        join public.study_groups g on g.id = m.group_id where m.user_id = p_child_id), '[]'::jsonb),
    'flags_count', coalesce((select count(*)::int from public.moderation_flags
        where flagged_user_id = p_child_id or reporter_id = p_child_id), 0),
    'settings', coalesce((select to_jsonb(s) - 'child_id' - 'updated_at' from public.parental_settings s where s.child_id = p_child_id),
        jsonb_build_object('dm_enabled', true, 'daily_limit_minutes', null, 'weekly_report_email', false))
  ) into v_result;
  return v_result;
end; $$;
revoke execute on function public.parent_dashboard(uuid) from anon;

-- 5. Objets ajoutés
drop trigger  if exists enforce_whatsapp_opt_in on public.users;
drop trigger  if exists enforce_flashcard_limit on public.flashcards;
drop function if exists public.enforce_whatsapp_opt_in();
drop function if exists public.enforce_flashcard_limit();
drop function if exists public.consume_usage(uuid, text, text, integer, text);
drop function if exists public.refund_usage(uuid, text, text);
drop function if exists public.refresh_due_subscriptions();
drop function if exists public.refresh_user_plan(uuid);
drop function if exists public.is_open_document(uuid);
drop function if exists public.is_open_chapter(uuid);
drop function if exists public.current_user_plan_level();
drop function if exists public.user_plan_level(uuid);
drop function if exists public.plan_level(text);

drop table if exists public.progress_reports;
drop table if exists public.learning_insights;
drop table if exists public.subscription_admin_audit;
drop table if exists public.payment_webhook_events;
drop table if exists public.payment_transactions;
drop table if exists public.usage_events;
drop table if exists public.usage_counters;

alter table public.correction_missions drop column if exists priority, drop column if exists request_key, drop column if exists deep_analysis;
alter table public.group_messages      drop column if exists is_priority;
alter table public.beta_feedback       drop column if exists kind, drop column if exists plan,
                                        drop column if exists priority, drop column if exists status;
alter table public.users drop column if exists plan_expires_at, drop column if exists plan_source, drop column if exists plan_review;
alter table public.subscriptions
  drop column if exists billing_interval, drop column if exists amount, drop column if exists currency,
  drop column if exists started_at, drop column if exists cancelled_at, drop column if exists suspended_at,
  drop column if exists payment_provider, drop column if exists provider_transaction_id,
  drop column if exists product_key, drop column if exists source, drop column if exists notes;

commit;
