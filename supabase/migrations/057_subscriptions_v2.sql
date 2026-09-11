-- Alpha Kelassi — Nouvelles formules Cognix (2/2)
-- Migration 057 : hiérarchie Gratuit < Starter < Pro < Pro Max, droits en base,
-- quotas, transactions FeexPay, historique et journal d'administration.
--
-- PRÉREQUIS : migration 056 appliquée et validée.
-- RETOUR ARRIÈRE : supabase/rollback/057_subscriptions_v2_rollback.sql
--
-- Principes
--   • La formule effective se calcule depuis `subscriptions` (abonnement dont
--     la période couvre l'instant présent), jamais depuis un nom affiché.
--     `users.plan` reste un cache d'affichage rafraîchi par refresh_user_plan.
--   • Tous les contrôles d'accès « = 'premium' » sont réécrits en comparaison
--     de niveaux : sans cela, un abonné Starter, Pro ou Pro Max perdrait
--     l'accès au contenu premium.
--   • Le plan Gratuit ouvre le PREMIER chapitre de chaque matière et UNE annale
--     par matière. La règle vit dans les policies, donc elle vaut aussi pour
--     l'application mobile qui lit la base directement.
--   • Les administrateurs ont un accès Pro Max effectif, sans que `pro_max` ne
--     soit écrit en base.

-- ════════════════════════════════════════════════════════════════════════════
-- 0. Sauvegarde avant modification des données
-- ════════════════════════════════════════════════════════════════════════════

create table if not exists public.backup_057_users_plan as
  select id, plan::text as plan, now() as saved_at from public.users;
create table if not exists public.backup_057_subscriptions as
  select *, now() as saved_at from public.subscriptions;

alter table public.backup_057_users_plan    enable row level security;
alter table public.backup_057_subscriptions enable row level security;
revoke all on public.backup_057_users_plan    from anon, authenticated;
revoke all on public.backup_057_subscriptions from anon, authenticated;

-- ════════════════════════════════════════════════════════════════════════════
-- 1. Hiérarchie des formules
-- ════════════════════════════════════════════════════════════════════════════

-- Miroir SQL de PLAN_LEVELS (packages/types/src/subscriptions.ts).
create or replace function public.plan_level(p_plan text)
returns int language sql immutable set search_path = public as $$
  select case p_plan
    when 'starter' then 1
    when 'pro'     then 2
    when 'premium' then 2   -- ancienne offre unique, lue comme Pro
    when 'pro_max' then 3
    else 0
  end
$$;

alter table public.subscriptions
  add column if not exists billing_interval        text check (billing_interval in ('month', 'year')),
  add column if not exists amount                  integer check (amount is null or amount >= 0),
  add column if not exists currency                text not null default 'XAF',
  add column if not exists started_at              timestamptz,
  add column if not exists cancelled_at            timestamptz,
  add column if not exists suspended_at            timestamptz,
  add column if not exists payment_provider        text check (payment_provider in ('feexpay', 'stripe', 'cinetpay', 'admin')),
  add column if not exists provider_transaction_id text,
  add column if not exists product_key             text,
  add column if not exists source                  text not null default 'payment'
                                                   check (source in ('payment', 'admin', 'legacy')),
  add column if not exists notes                   text;

create unique index if not exists subscriptions_provider_tx_unique
  on public.subscriptions(payment_provider, provider_transaction_id)
  where provider_transaction_id is not null;
create index if not exists subscriptions_user_period_idx
  on public.subscriptions(user_id, status, started_at, expires_at);

comment on column public.subscriptions.status is
  'active = en cours ; pending = payé, commence à started_at (renouvellement ou descente programmés) ; '
  'expired = terminé ; canceled = annulé ; suspended = suspendu par un administrateur.';

alter table public.users
  add column if not exists plan_expires_at timestamptz,
  add column if not exists plan_source     text check (plan_source in ('subscription', 'admin', 'legacy')),
  add column if not exists plan_review     text;   -- motif de vérification signalé dans la console

-- Niveau effectif d'un utilisateur. Réservé au serveur : il révélerait sinon
-- la formule de n'importe qui.
create or replace function public.user_plan_level(p_user_id uuid)
returns int language sql stable security definer set search_path = public as $$
  select case
    when p_user_id is null then 0
    when exists (select 1 from public.users where id = p_user_id and role = 'admin') then 3
    else coalesce((
      select max(public.plan_level(s.plan::text))
      from public.subscriptions s
      where s.user_id = p_user_id
        and s.status in ('active', 'pending')
        and coalesce(s.started_at, s.created_at) <= now()
        and (s.expires_at is null or s.expires_at > now())
    ), 0)
  end
$$;

create or replace function public.current_user_plan_level()
returns int language sql stable security definer set search_path = public as $$
  select public.user_plan_level(auth.uid())
$$;

-- `current_user_plan()` reste disponible pour le code existant, mais renvoie
-- désormais la formule EFFECTIVE (expirée → free, admin → pro_max).
create or replace function public.current_user_plan()
returns user_plan language sql stable security definer set search_path = public as $$
  select (case public.current_user_plan_level()
    when 3 then 'pro_max' when 2 then 'pro' when 1 then 'starter' else 'free'
  end)::user_plan
$$;

revoke execute on function public.user_plan_level(uuid) from public, anon, authenticated;
grant  execute on function public.user_plan_level(uuid) to service_role;
revoke execute on function public.current_user_plan_level() from public, anon;
grant  execute on function public.current_user_plan_level() to authenticated, service_role;
revoke execute on function public.current_user_plan() from public, anon;
grant  execute on function public.current_user_plan() to authenticated, service_role;

-- Recalcule le cache `users.plan` et fait passer à `expired` les abonnements
-- terminés. Appelée par le webhook, la console et la tâche quotidienne.
create or replace function public.refresh_user_plan(p_user_id uuid)
returns text language plpgsql security definer set search_path = public as $$
declare
  v_plan    user_plan;
  v_expires timestamptz;
begin
  update public.subscriptions
     set status = 'expired', updated_at = now()
   where user_id = p_user_id
     and status in ('active', 'pending')
     and expires_at is not null and expires_at <= now();

  update public.subscriptions
     set status = 'active', updated_at = now()
   where user_id = p_user_id
     and status = 'pending'
     and started_at is not null and started_at <= now();

  select s.plan, s.expires_at into v_plan, v_expires
    from public.subscriptions s
   where s.user_id = p_user_id
     and s.status = 'active'
     and coalesce(s.started_at, s.created_at) <= now()
     and (s.expires_at is null or s.expires_at > now())
   order by public.plan_level(s.plan::text) desc, s.expires_at desc nulls first
   limit 1;

  if v_plan is null then
    update public.users set plan = 'free', plan_expires_at = null, plan_source = null where id = p_user_id;
    return 'free';
  end if;

  update public.users
     set plan = (case when v_plan::text = 'premium' then 'pro' else v_plan::text end)::user_plan,
         plan_expires_at = v_expires,
         plan_source = 'subscription'
   where id = p_user_id;
  return v_plan::text;
end;
$$;

-- Passe quotidienne : expirations et démarrages programmés de tous les comptes.
create or replace function public.refresh_due_subscriptions()
returns int language plpgsql security definer set search_path = public as $$
declare v_user uuid; v_count int := 0;
begin
  for v_user in
    select distinct user_id from public.subscriptions
     where (status in ('active', 'pending') and expires_at is not null and expires_at <= now())
        or (status = 'pending' and started_at is not null and started_at <= now())
  loop
    perform public.refresh_user_plan(v_user);
    v_count := v_count + 1;
  end loop;
  return v_count;
end;
$$;

revoke execute on function public.refresh_user_plan(uuid)      from public, anon, authenticated;
revoke execute on function public.refresh_due_subscriptions()  from public, anon, authenticated;
grant  execute on function public.refresh_user_plan(uuid)      to service_role;
grant  execute on function public.refresh_due_subscriptions()  to service_role;

-- ════════════════════════════════════════════════════════════════════════════
-- 2. Migration des anciennes données (sans perte de droits)
-- ════════════════════════════════════════════════════════════════════════════
--   free                         → free
--   premium avec abonnement      → pro (mensuel ou annuel, même règle)
--   premium sans abonnement      → pro conservé via un abonnement « legacy »
--                                  sans échéance, signalé pour vérification

update public.subscriptions
   set plan = 'pro', source = 'legacy',
       started_at = coalesce(started_at, created_at),
       payment_provider = coalesce(payment_provider,
         case when stripe_sub_id is not null then 'stripe'
              when feexpay_ref   is not null then 'feexpay'
              when cinetpay_ref  is not null then 'cinetpay' end),
       provider_transaction_id = coalesce(provider_transaction_id, feexpay_ref, cinetpay_ref, stripe_sub_id)
 where plan = 'premium';

insert into public.subscriptions (user_id, plan, status, started_at, expires_at, source, payment_provider, notes)
select u.id, 'pro', 'active', now(), null, 'legacy', 'admin',
       'Migration 057 : ancien Premium sans abonnement actif — droits conservés, à vérifier.'
  from public.users u
 where u.plan = 'premium'
   and u.role <> 'admin'
   and not exists (
     select 1 from public.subscriptions s
      where s.user_id = u.id and s.status = 'active'
        and (s.expires_at is null or s.expires_at > now()));

update public.users
   set plan_review = 'Ancien Premium sans abonnement actif : droits Pro conservés, à confirmer.'
 where plan = 'premium' and role <> 'admin'
   and exists (select 1 from public.subscriptions s where s.user_id = users.id and s.source = 'legacy' and s.expires_at is null);

-- Les administrateurs ont un accès Pro Max effectif : leur ancien `premium`
-- manuel n'a plus de raison d'être et ne doit pas gonfler les statistiques.
update public.users set plan = 'free', plan_source = null where plan = 'premium' and role = 'admin';

update public.users u
   set plan = 'pro', plan_source = 'legacy'
 where u.plan = 'premium';

-- ════════════════════════════════════════════════════════════════════════════
-- 3. Accès au contenu : premier chapitre et une annale ouverts au Gratuit
-- ════════════════════════════════════════════════════════════════════════════

-- Premier chapitre d'une matière, dans l'ordre du programme.
create or replace function public.is_open_chapter(p_chapter_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.chapters c
     where c.id = p_chapter_id
       and c.id = (select c2.id from public.chapters c2
                    where c2.subject_id = c.subject_id
                    order by c2.order_index, c2.created_at, c2.id
                    limit 1)
  )
$$;

-- Document ouvert au Gratuit : le plus récent de sa matière pour son type
-- (une annale par matière, un cours PDF par matière).
create or replace function public.is_open_document(p_document_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.documents d
     where d.id = p_document_id
       and not d.is_premium
       and d.id = (select d2.id from public.documents d2
                    where d2.subject_id = d.subject_id and d2.type = d.type and not d2.is_premium
                    order by d2.year desc nulls last, d2.created_at desc, d2.id
                    limit 1)
  )
$$;

revoke execute on function public.is_open_chapter(uuid)  from public, anon;
revoke execute on function public.is_open_document(uuid) from public, anon;
grant  execute on function public.is_open_chapter(uuid)  to authenticated, service_role;
grant  execute on function public.is_open_document(uuid) to authenticated, service_role;

-- Leçons
drop policy if exists "lessons_read" on public.lessons;
create policy "lessons_read" on public.lessons for select to authenticated using (
  (select public.current_user_plan_level()) >= 1
  or (not is_premium and public.is_open_chapter(chapter_id))
);

-- Exercices
drop policy if exists "exercises_read" on public.exercises;
create policy "exercises_read" on public.exercises for select to authenticated using (
  (select public.current_user_plan_level()) >= 1
  or (not is_premium and public.is_open_chapter(chapter_id))
);

-- Corrigés : il ne suffit plus d'avoir « tenté » un exercice (une tentative
-- s'insère librement) — l'exercice lui-même doit être accessible.
drop policy if exists "exercise_solutions_after_attempt" on public.exercise_solutions;
create policy "exercise_solutions_after_attempt" on public.exercise_solutions
  for select to authenticated using (
    exists (select 1 from public.exercise_attempts a
             where a.exercise_id = exercise_solutions.exercise_id and a.user_id = auth.uid())
    and exists (select 1 from public.exercises e where e.id = exercise_solutions.exercise_id)
  );

-- QCM : la liste reste visible (pour afficher le verrou), les QUESTIONS sont
-- réservées à Starter, sauf le QCM du premier chapitre.
drop policy if exists "quizzes: select free content" on public.quizzes;
create policy "quizzes: select free content" on public.quizzes
  for select using (
    auth.uid() is not null
    and (is_premium = false or (select public.current_user_plan_level()) >= 1)
  );

drop policy if exists "quiz_questions: select via quiz access" on public.quiz_questions;
create policy "quiz_questions: select via quiz access" on public.quiz_questions
  for select using (
    exists (
      select 1 from public.quizzes qz
       where qz.id = quiz_questions.quiz_id
         and (
           (select public.current_user_plan_level()) >= 1
           or (not qz.is_premium and not qz.is_exam and qz.chapter_id is not null
               and public.is_open_chapter(qz.chapter_id))
         )
    )
  );

-- Documents (cours PDF et annales)
drop policy if exists "documents: select free content" on public.documents;
create policy "documents: select free content" on public.documents
  for select using (
    auth.uid() is not null
    and (is_premium = false or (select public.current_user_plan_level()) >= 1)
  );

drop policy if exists "chunks: select via document access" on public.document_chunks;
create policy "chunks: select via document access" on public.document_chunks
  for select using (
    auth.uid() is not null
    and exists (
      select 1 from public.documents d
       where d.id = document_chunks.document_id
         and ((select public.current_user_plan_level()) >= 1 or public.is_open_document(d.id))
    )
  );

-- Vidéos
drop policy if exists "videos: select free content" on public.videos;
create policy "videos: select free content" on public.videos
  for select using (
    auth.uid() is not null
    and (is_premium = false or (select public.current_user_plan_level()) >= 1)
  );

-- Fichiers PDF. `pdfs-public` était un bucket PUBLIC : n'importe qui ayant
-- l'adresse lisait le PDF, ce qui rendait toute limite inapplicable. Il passe
-- en privé ; l'accès se fait par URL signée, accordée seulement si le document
-- est ouvert à l'appelant. (Aucun document en base au moment de la migration.)
update storage.buckets set public = false where id = 'pdfs-public';

drop policy if exists "pdfs-public: read all" on storage.objects;
drop policy if exists "pdfs-public: read allowed documents" on storage.objects;
create policy "pdfs-public: read allowed documents" on storage.objects
  for select using (
    bucket_id = 'pdfs-public'
    and auth.uid() is not null
    and exists (
      select 1 from public.documents d
       -- `name` désigne ici la colonne de storage.objects (documents n'en a pas).
       where regexp_replace(coalesce(d.pdf_url, ''), '^.*/', '') = name
         and ((select public.current_user_plan_level()) >= 1 or public.is_open_document(d.id))
    )
  );

drop policy if exists "pdfs-premium: read premium users" on storage.objects;
create policy "pdfs-premium: read premium users" on storage.objects
  for select using (
    bucket_id = 'pdfs-premium'
    and auth.uid() is not null
    and (select public.current_user_plan_level()) >= 1
  );

-- ════════════════════════════════════════════════════════════════════════════
-- 4. Simulations : modes contrôlés par la formule (calcul serveur)
-- ════════════════════════════════════════════════════════════════════════════
--   Annales  : Entraînement libre et Bac test → Starter ; Bac blanc et Bac rouge → Pro
--   QCM de chapitre : Starter, ou Gratuit sur le premier chapitre

drop function if exists public.submit_quiz_attempt(uuid, jsonb, integer, text);

create or replace function public.submit_quiz_attempt(
  p_quiz_id uuid,
  p_answers jsonb,
  p_duration_sec integer,
  p_mode text default 'entrainement'
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id    uuid := auth.uid();
  v_level      int;
  v_is_premium boolean;
  v_is_exam    boolean;
  v_chapter_id uuid;
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
  if p_mode not in ('entrainement', 'bac_test', 'bac_blanc', 'bac_rouge') then
    raise exception 'INVALID_MODE';
  end if;

  select is_premium, is_exam, chapter_id into v_is_premium, v_is_exam, v_chapter_id
    from public.quizzes where id = p_quiz_id;
  if v_is_premium is null then
    raise exception 'QUIZ_NOT_FOUND';
  end if;

  v_level := public.user_plan_level(v_user_id);

  if v_is_premium and v_level < 1 then
    raise exception 'PLAN_REQUIRED:full_courses';
  end if;

  if v_is_exam then
    if p_mode in ('bac_blanc', 'bac_rouge') and v_level < 2 then
      raise exception 'PLAN_REQUIRED:%', p_mode || '_mode';
    elsif v_level < 1 then
      raise exception 'PLAN_REQUIRED:%', case p_mode when 'bac_test' then 'bac_test_mode' else 'free_exam_mode' end;
    end if;
  elsif v_level < 1 and not (v_chapter_id is not null and public.is_open_chapter(v_chapter_id)) then
    raise exception 'PLAN_REQUIRED:chapter_quizzes';
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
  select count(*)::smallint into v_wrong
    from public.quiz_attempt_answers
    where attempt_id = v_attempt_id and selected_index is not null and not is_correct;

  update public.quiz_attempts set score = v_score where id = v_attempt_id;

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

revoke execute on function public.submit_quiz_attempt(uuid, jsonb, integer, text) from public, anon;
grant  execute on function public.submit_quiz_attempt(uuid, jsonb, integer, text) to authenticated;

-- ════════════════════════════════════════════════════════════════════════════
-- 5. Quotas (questions IA, corrections, questions prioritaires)
-- ════════════════════════════════════════════════════════════════════════════

create table if not exists public.usage_counters (
  user_id    uuid not null references public.users(id) on delete cascade,
  usage_type text not null check (usage_type in ('ai_questions', 'tutor_corrections', 'priority_group_questions')),
  period_key text not null,              -- `2026-09-11` (jour) ou `2026-09` (mois), heure du Congo
  used       integer not null default 0 check (used >= 0),
  bonus      integer not null default 0 check (bonus >= 0),   -- quota exceptionnel accordé par un admin
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, usage_type, period_key)
);

-- Une ligne par requête consommatrice : la clé rend la consommation
-- idempotente (une nouvelle tentative ne compte pas deux fois) et permet de
-- rembourser une requête qui a échoué.
create table if not exists public.usage_events (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.users(id) on delete cascade,
  usage_type  text not null,
  period_key  text not null,
  request_key text not null,
  status      text not null default 'consumed' check (status in ('consumed', 'refunded')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (user_id, usage_type, request_key)
);
create index if not exists usage_events_period_idx on public.usage_events(user_id, usage_type, period_key);

alter table public.usage_counters enable row level security;
alter table public.usage_events   enable row level security;

drop policy if exists "usage_counters: read own" on public.usage_counters;
create policy "usage_counters: read own" on public.usage_counters for select to authenticated
  using (user_id = auth.uid() or public.current_user_role() = 'admin');
drop policy if exists "usage_events: admin read" on public.usage_events;
create policy "usage_events: admin read" on public.usage_events for select to authenticated
  using (public.current_user_role() = 'admin');

-- Consomme une unité si la limite le permet. p_limit null = illimité.
-- Atomique : la ligne du compteur est verrouillée pendant la décision.
create or replace function public.consume_usage(
  p_user_id uuid, p_type text, p_period_key text, p_limit integer, p_request_key text
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_counter public.usage_counters;
  v_event   public.usage_events;
begin
  if p_request_key is null or length(p_request_key) < 8 then
    raise exception 'REQUEST_KEY_REQUIRED';
  end if;

  insert into public.usage_counters (user_id, usage_type, period_key)
  values (p_user_id, p_type, p_period_key)
  on conflict do nothing;

  select * into v_counter from public.usage_counters
   where user_id = p_user_id and usage_type = p_type and period_key = p_period_key
   for update;

  select * into v_event from public.usage_events
   where user_id = p_user_id and usage_type = p_type and request_key = p_request_key
   for update;

  if found and v_event.status = 'consumed' then
    return jsonb_build_object('allowed', true, 'duplicate', true,
      'used', v_counter.used, 'bonus', v_counter.bonus, 'limit', p_limit);
  end if;

  if p_limit is not null and v_counter.used >= p_limit + v_counter.bonus then
    return jsonb_build_object('allowed', false, 'duplicate', false,
      'used', v_counter.used, 'bonus', v_counter.bonus, 'limit', p_limit);
  end if;

  update public.usage_counters
     set used = used + 1, updated_at = now()
   where user_id = p_user_id and usage_type = p_type and period_key = p_period_key
   returning * into v_counter;

  insert into public.usage_events (user_id, usage_type, period_key, request_key, status)
  values (p_user_id, p_type, p_period_key, p_request_key, 'consumed')
  on conflict (user_id, usage_type, request_key)
  do update set status = 'consumed', period_key = excluded.period_key, updated_at = now();

  return jsonb_build_object('allowed', true, 'duplicate', false,
    'used', v_counter.used, 'bonus', v_counter.bonus, 'limit', p_limit);
end;
$$;

-- Rembourse une consommation (requête échouée). Sans effet si déjà remboursée.
create or replace function public.refund_usage(p_user_id uuid, p_type text, p_request_key text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_event public.usage_events;
begin
  select * into v_event from public.usage_events
   where user_id = p_user_id and usage_type = p_type and request_key = p_request_key
   for update;
  if not found or v_event.status <> 'consumed' then
    return jsonb_build_object('refunded', false);
  end if;

  update public.usage_counters
     set used = greatest(used - 1, 0), updated_at = now()
   where user_id = p_user_id and usage_type = p_type and period_key = v_event.period_key;
  update public.usage_events set status = 'refunded', updated_at = now() where id = v_event.id;
  return jsonb_build_object('refunded', true);
end;
$$;

revoke execute on function public.consume_usage(uuid, text, text, integer, text) from public, anon, authenticated;
revoke execute on function public.refund_usage(uuid, text, text)                 from public, anon, authenticated;
grant  execute on function public.consume_usage(uuid, text, text, integer, text) to service_role;
grant  execute on function public.refund_usage(uuid, text, text)                 to service_role;

-- ════════════════════════════════════════════════════════════════════════════
-- 6. Paiements FeexPay : transactions et notifications
-- ════════════════════════════════════════════════════════════════════════════

create table if not exists public.payment_transactions (
  id               uuid primary key default gen_random_uuid(),
  reference        text not null unique,
  user_id          uuid references public.users(id) on delete set null,  -- historique conservé (obligation légale)
  provider         text not null default 'feexpay',
  product_key      text not null,
  plan             user_plan not null,
  billing_interval text not null check (billing_interval in ('month', 'year')),
  amount           integer not null check (amount > 0),
  currency         text not null default 'XAF',
  status           text not null default 'pending'
                   check (status in ('pending', 'successful', 'failed', 'cancelled', 'expired')),
  change_kind      text check (change_kind in ('new', 'upgrade', 'renewal', 'downgrade')),
  network          text,
  phone_last4      text,
  provider_status  text,
  failure_reason   text,
  subscription_id  uuid references public.subscriptions(id) on delete set null,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  processed_at     timestamptz
);
create index if not exists payment_transactions_user_idx    on public.payment_transactions(user_id, created_at desc);
create index if not exists payment_transactions_pending_idx on public.payment_transactions(created_at) where status = 'pending';

create table if not exists public.payment_webhook_events (
  id          bigint generated always as identity primary key,
  provider    text not null default 'feexpay',
  reference   text,
  known       boolean not null default false,
  outcome     text not null,
  detail      text,
  received_at timestamptz not null default now()
);
create index if not exists payment_webhook_events_ref_idx on public.payment_webhook_events(reference, received_at desc);

alter table public.payment_transactions   enable row level security;
alter table public.payment_webhook_events enable row level security;

drop policy if exists "payment_transactions: read own" on public.payment_transactions;
create policy "payment_transactions: read own" on public.payment_transactions for select to authenticated
  using (user_id = auth.uid() or public.current_user_role() = 'admin');
drop policy if exists "payment_webhook_events: admin read" on public.payment_webhook_events;
create policy "payment_webhook_events: admin read" on public.payment_webhook_events for select to authenticated
  using (public.current_user_role() = 'admin');

drop policy if exists "subscriptions: admin read" on public.subscriptions;
create policy "subscriptions: admin read" on public.subscriptions for select to authenticated
  using (public.current_user_role() = 'admin');

-- ════════════════════════════════════════════════════════════════════════════
-- 7. Journal des modifications manuelles
-- ════════════════════════════════════════════════════════════════════════════

create table if not exists public.subscription_admin_audit (
  id         uuid primary key default gen_random_uuid(),
  admin_id   uuid references public.users(id) on delete set null,
  user_id    uuid references public.users(id) on delete set null,
  action     text not null check (action in ('set_plan', 'extend', 'suspend', 'reactivate', 'cancel', 'grant_quota', 'resolve_review')),
  old_value  jsonb,
  new_value  jsonb,
  reason     text not null check (char_length(trim(reason)) >= 5),
  created_at timestamptz not null default now()
);
create index if not exists subscription_admin_audit_user_idx on public.subscription_admin_audit(user_id, created_at desc);

alter table public.subscription_admin_audit enable row level security;
drop policy if exists "subscription_admin_audit: admin read" on public.subscription_admin_audit;
create policy "subscription_admin_audit: admin read" on public.subscription_admin_audit for select to authenticated
  using (public.current_user_role() = 'admin');

-- Changer une formule ne passe plus par le navigateur : la policy qui laissait
-- un admin modifier `users` depuis le client (migr. 015) servait à cela sans
-- aucune trace. Les écritures passent désormais par l'API (service role).
drop policy if exists "users: admin update all" on public.users;

-- ════════════════════════════════════════════════════════════════════════════
-- 8. Garde-fous des fonctionnalités lues directement par l'application
-- ════════════════════════════════════════════════════════════════════════════

-- Rappels WhatsApp : Starter. L'app active l'option en écrivant la colonne ;
-- le déclencheur refuse l'activation côté base (le serveur, lui, peut écrire).
create or replace function public.enforce_whatsapp_opt_in()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.whatsapp_opt_in and not coalesce(old.whatsapp_opt_in, false)
     and auth.uid() is not null and auth.uid() = new.id
     and public.user_plan_level(new.id) < 1 then
    raise exception 'PLAN_REQUIRED:whatsapp_reminders' using errcode = 'P0001';
  end if;
  return new;
end;
$$;
drop trigger if exists enforce_whatsapp_opt_in on public.users;
create trigger enforce_whatsapp_opt_in before update of whatsapp_opt_in on public.users
  for each row execute function public.enforce_whatsapp_opt_in();

-- Flashcards : 20 au plus en Gratuit, sans limite dès Starter.
create or replace function public.enforce_flashcard_limit()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if public.user_plan_level(new.user_id) < 1
     and (select count(*) from public.flashcards where user_id = new.user_id) >= 20 then
    raise exception 'PLAN_REQUIRED:flashcards' using errcode = 'P0001';
  end if;
  return new;
end;
$$;
drop trigger if exists enforce_flashcard_limit on public.flashcards;
create trigger enforce_flashcard_limit before insert on public.flashcards
  for each row execute function public.enforce_flashcard_limit();

revoke execute on function public.enforce_whatsapp_opt_in()  from public, anon, authenticated;
revoke execute on function public.enforce_flashcard_limit()  from public, anon, authenticated;

-- ════════════════════════════════════════════════════════════════════════════
-- 9. Fonctionnalités Pro et Pro Max
-- ════════════════════════════════════════════════════════════════════════════

-- Corrections : priorité de traitement (Pro Max) et analyse approfondie.
alter table public.correction_missions
  add column if not exists priority      smallint not null default 0,
  add column if not exists request_key   text,
  add column if not exists deep_analysis jsonb;
create unique index if not exists correction_missions_request_key_unique
  on public.correction_missions(student_id, request_key) where request_key is not null;
create index if not exists correction_missions_pending_priority_idx
  on public.correction_missions(priority desc, created_at) where status = 'pending';

-- Groupes : questions prioritaires mises en avant.
alter table public.group_messages
  add column if not exists is_priority boolean not null default false;
create index if not exists idx_group_messages_priority
  on public.group_messages(group_id, created_at desc) where is_priority;

-- Support : priorité selon la formule au moment de l'envoi.
alter table public.beta_feedback
  add column if not exists kind     text not null default 'feedback' check (kind in ('feedback', 'support')),
  add column if not exists plan     text,
  add column if not exists priority smallint not null default 0,
  add column if not exists status   text not null default 'open' check (status in ('open', 'answered', 'closed'));
create index if not exists idx_beta_feedback_priority on public.beta_feedback(status, priority desc, created_at desc);

-- Analyses IA mises en cache (erreurs récurrentes, recommandations par matière).
create table if not exists public.learning_insights (
  user_id    uuid not null references public.users(id) on delete cascade,
  kind       text not null check (kind in ('recurring_errors', 'subject_recommendations')),
  scope      text not null default 'all',          -- 'all' ou l'id de la matière
  period_key text not null,                          -- jour de génération (heure du Congo)
  content    jsonb not null,
  created_at timestamptz not null default now(),
  primary key (user_id, kind, scope, period_key)
);
alter table public.learning_insights enable row level security;
drop policy if exists "learning_insights: read own" on public.learning_insights;
create policy "learning_insights: read own" on public.learning_insights for select to authenticated
  using (user_id = auth.uid());

-- Rapports de progression (élève et parent).
create table if not exists public.progress_reports (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references public.users(id) on delete cascade,
  period_start date not null,
  period_end   date not null,
  content      jsonb not null,
  summary      text,
  created_at   timestamptz not null default now(),
  unique (user_id, period_start, period_end)
);
alter table public.progress_reports enable row level security;
drop policy if exists "progress_reports: read own or parent" on public.progress_reports;
create policy "progress_reports: read own or parent" on public.progress_reports for select to authenticated
  using (
    user_id = auth.uid()
    or exists (select 1 from public.parent_links pl where pl.child_id = progress_reports.user_id and pl.parent_id = auth.uid())
  );

-- Tableau de bord parent : le niveau de détail suit la formule de l'ENFANT
-- (c'est lui l'abonné). basic < standard (Starter) < enriched (Pro) < reports (Pro Max).
create or replace function public.parent_dashboard(p_child_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_level  int;
  v_result jsonb;
begin
  if not exists (select 1 from public.parent_links where parent_id = auth.uid() and child_id = p_child_id) then
    raise exception 'NOT_LINKED';
  end if;

  v_level := public.user_plan_level(p_child_id);

  v_result := jsonb_build_object(
    'child_name', (select coalesce(full_name, 'Enfant') from public.users where id = p_child_id),
    'child_plan', case v_level when 3 then 'pro_max' when 2 then 'pro' when 1 then 'starter' else 'free' end,
    'tracking_level', case when v_level >= 3 then 'reports' when v_level = 2 then 'enriched'
                           when v_level = 1 then 'standard' else 'basic' end,
    'last_active', (select max(last_active) from public.user_progress where user_id = p_child_id),
    'xp', (select xp from public.users where id = p_child_id),
    'settings', coalesce((select to_jsonb(s) - 'child_id' - 'updated_at' from public.parental_settings s where s.child_id = p_child_id),
        jsonb_build_object('dm_enabled', true, 'daily_limit_minutes', null, 'weekly_report_email', false))
  );

  if v_level >= 1 then
    v_result := v_result || jsonb_build_object(
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
      'groups', coalesce((select jsonb_agg(g.name) from public.group_members m
          join public.study_groups g on g.id = m.group_id where m.user_id = p_child_id), '[]'::jsonb),
      'flags_count', coalesce((select count(*)::int from public.moderation_flags
          where flagged_user_id = p_child_id or reporter_id = p_child_id), 0)
    );
  end if;

  if v_level >= 2 then
    v_result := v_result || jsonb_build_object(
      'subjects', coalesce((
        select jsonb_agg(row_to_json(t) order by t.subject_name)
        from (
          select s.id as subject_id, s.name as subject_name,
                 count(distinct l.id)::int as lessons_total,
                 count(distinct lp.lesson_id) filter (where lp.completed)::int as lessons_done
            from public.subjects s
            join public.chapters c on c.subject_id = s.id
            join public.lessons l on l.chapter_id = c.id
            left join public.lesson_progress lp on lp.lesson_id = l.id and lp.user_id = p_child_id
           where exists (select 1 from public.lesson_progress lp2
                          join public.lessons l2 on l2.id = lp2.lesson_id
                          join public.chapters c2 on c2.id = l2.chapter_id
                         where lp2.user_id = p_child_id and c2.subject_id = s.id)
           group by s.id, s.name
        ) t), '[]'::jsonb),
      'quiz_average', (select round(avg(100.0 * score / nullif(total, 0)))::int
                         from public.quiz_attempts
                        where user_id = p_child_id and completed_at >= now() - interval '30 days'),
      'weak_areas', coalesce((
        select jsonb_agg(jsonb_build_object('subject_name', x.subject_name, 'answered', x.answered, 'error_rate', x.error_rate)
                         order by x.error_rate desc)
        from (
          select s.name as subject_name, count(*)::int as answered,
                 round(100.0 * count(*) filter (where not ans.is_correct) / nullif(count(*), 0))::int as error_rate
            from public.quiz_attempt_answers ans
            join public.quiz_attempts qa on qa.id = ans.attempt_id
            join public.quiz_questions qq on qq.id = ans.question_id
            join public.quizzes qz on qz.id = qq.quiz_id
            left join public.chapters ch on ch.id = qz.chapter_id
            join public.subjects s on s.id = coalesce(qz.subject_id, ch.subject_id)
           where qa.user_id = p_child_id
           group by s.name
          having count(*) >= 3
           order by error_rate desc
           limit 5
        ) x), '[]'::jsonb)
    );
  end if;

  if v_level >= 3 then
    v_result := v_result || jsonb_build_object(
      'latest_report', (select jsonb_build_object('period_start', r.period_start, 'period_end', r.period_end,
                                                   'summary', r.summary, 'content', r.content, 'created_at', r.created_at)
                          from public.progress_reports r
                         where r.user_id = p_child_id
                         order by r.period_end desc, r.created_at desc limit 1)
    );
  end if;

  return v_result;
end;
$$;

revoke execute on function public.parent_dashboard(uuid) from public, anon;
grant  execute on function public.parent_dashboard(uuid) to authenticated;

-- ════════════════════════════════════════════════════════════════════════════
-- 10. Mise en cohérence des caches de formule
-- ════════════════════════════════════════════════════════════════════════════

select public.refresh_user_plan(u.id) from public.users u
 where exists (select 1 from public.subscriptions s where s.user_id = u.id);
