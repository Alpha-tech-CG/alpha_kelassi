-- Alpha Kelassi / Cognix — Suivi d'usage
-- Migration 069 : journal d'événements de l'app (mobile + web) et statistiques
-- de la console admin.
--
-- Pas de service tiers d'analyse : les élèves sont mineurs, les données restent
-- dans Supabase. On n'enregistre que des faits d'usage (écran ouvert, quiz
-- terminé…) et des identifiants de contenu, jamais de texte saisi par l'élève.
--
-- Règles d'accès
--   • Un élève connecté n'insère que pour lui-même (user_id = auth.uid()).
--   • Un visiteur non connecté (questionnaire d'inscription) n'insère que des
--     événements d'inscription, sans user_id, rattachés à un identifiant
--     d'installation aléatoire (device_id).
--   • Personne ne relit la table depuis l'app : la console lit les agrégats par
--     admin_app_stats(), réservée au service_role.

create table if not exists public.app_events (
  id          bigint generated always as identity primary key,
  user_id     uuid references public.users(id) on delete cascade,
  device_id   text check (device_id is null or device_id ~ '^[A-Za-z0-9-]{8,64}$'),
  name        text not null check (name ~ '^[a-z][a-z0-9_]{1,39}$'),
  platform    text not null check (platform in ('android', 'ios', 'web')),
  app_version text check (app_version is null or length(app_version) <= 20),
  props       jsonb not null default '{}'::jsonb
              check (jsonb_typeof(props) = 'object' and pg_column_size(props) <= 2048),
  created_at  timestamptz not null default now()
);

create index if not exists app_events_created_idx on public.app_events(created_at desc);
create index if not exists app_events_name_idx    on public.app_events(name, created_at desc);
create index if not exists app_events_user_idx    on public.app_events(user_id, created_at desc) where user_id is not null;

alter table public.app_events enable row level security;

-- Supabase accorde par défaut tous les droits à anon/authenticated : on repart de zéro.
revoke all on public.app_events from public, anon, authenticated;
grant insert (user_id, device_id, name, platform, app_version, props) on public.app_events to anon, authenticated;

drop policy if exists "app_events: insert own" on public.app_events;
create policy "app_events: insert own" on public.app_events for insert to authenticated
  with check (user_id = auth.uid());

-- Avant la création du compte : seulement les étapes d'inscription, anonymes.
drop policy if exists "app_events: insert anonymous signup" on public.app_events;
create policy "app_events: insert anonymous signup" on public.app_events for insert to anon, authenticated
  with check (
    user_id is null
    and device_id is not null
    and name in ('app_open', 'register_step', 'register_submitted')
  );

-- Pas de policy SELECT/UPDATE/DELETE : invisible et immuable depuis l'app.

-- ════════════════════════════════════════════════════════════════════════════
-- Statistiques de la console admin
-- ════════════════════════════════════════════════════════════════════════════
-- Jours comptés à l'heure du Congo (UTC+1).

create or replace function public.admin_app_stats(p_days int default 30)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_days  int := greatest(7, least(coalesce(p_days, 30), 180));
  v_tz    text := 'Africa/Brazzaville';
  v_today date := (now() at time zone 'Africa/Brazzaville')::date;
  v_from  date := v_today - (v_days - 1);
  v_since timestamptz := (v_from::timestamp at time zone 'Africa/Brazzaville');
  v_result jsonb;
begin
  with
  days as (
    select d::date as day from generate_series(v_from, v_today, interval '1 day') d
  ),
  students as (
    select id, created_at, (created_at at time zone v_tz)::date as signup_day, plan, plan_expires_at, onboarding_completed
    from users where role = 'student'
  ),
  ev as (
    select e.user_id, e.device_id, e.name, e.platform, e.props, e.created_at,
           (e.created_at at time zone v_tz)::date as day
    from app_events e
    where e.created_at >= v_since
  ),
  -- Activité : un événement d'app OU une trace pédagogique existante (les
  -- versions de l'app antérieures au suivi n'envoient pas d'événements).
  activity as (
    select user_id, day from ev where user_id is not null
    union
    select user_id, (completed_at at time zone v_tz)::date from lesson_progress
      where completed_at >= v_since and user_id is not null
    union
    select user_id, (completed_at at time zone v_tz)::date from quiz_attempts
      where completed_at >= v_since and user_id is not null
  ),
  student_activity as (
    select a.user_id, a.day from activity a join students s on s.id = a.user_id
  ),
  per_day as (
    select d.day,
           (select count(*) from students s where s.signup_day = d.day) as signups,
           (select count(distinct sa.user_id) from student_activity sa where sa.day = d.day) as active
    from days d
  ),
  -- Rétention : parmi les inscrits assez anciens, part revenue à J+1 et dans
  -- la 2e semaine (J+7 à J+13).
  retention as (
    select
      count(*) filter (where s.signup_day <= v_today - 1)  as cohort_d1,
      count(*) filter (where s.signup_day <= v_today - 1 and exists (
        select 1 from student_activity sa where sa.user_id = s.id and sa.day = s.signup_day + 1)) as back_d1,
      count(*) filter (where s.signup_day <= v_today - 13) as cohort_w2,
      count(*) filter (where s.signup_day <= v_today - 13 and exists (
        select 1 from student_activity sa where sa.user_id = s.id and sa.day between s.signup_day + 7 and s.signup_day + 13)) as back_w2
    from students s
    where s.signup_day >= v_from
  ),
  top_chapters as (
    select c.id, c.title, sub.name as subject, se.code as series,
           count(*) as views, count(distinct ev.user_id) as viewers
    from ev
    join chapters c on c.id::text = ev.props->>'chapter_id'
    left join subjects sub on sub.id = c.subject_id
    left join series se on se.id = c.series_id
    where ev.name = 'chapter_opened'
    group by c.id, c.title, sub.name, se.code
    order by views desc
    limit 15
  ),
  -- Leçons du programme (`lessons`, sous-chapitres) et des cours structurés
  -- (`course_lessons`, écran /lecon).
  top_lessons as (
    select coalesce(l.title, cl.title) as title, coalesce(c.title, '') as chapter,
           count(*) as views, count(distinct ev.user_id) as viewers
    from ev
    left join lessons l on l.id::text = ev.props->>'lesson_id'
    left join chapters c on c.id = l.chapter_id
    left join course_lessons cl on cl.id::text = ev.props->>'course_lesson_id'
    where ev.name = 'lesson_opened' and coalesce(l.id, cl.id) is not null
    group by coalesce(l.id, cl.id), coalesce(l.title, cl.title), c.title
    order by views desc
    limit 15
  ),
  funnel_steps as (
    select (ev.props->>'index')::int as idx, ev.props->>'step' as step,
           count(distinct ev.device_id) as devices
    from ev
    where ev.name = 'register_step' and ev.props ? 'index' and (ev.props->>'index') ~ '^\d{1,2}$'
    group by 1, 2
  ),
  pay as (
    select * from payment_transactions where created_at >= v_since
  ),
  first_paid as (
    -- Premier paiement réussi de chaque élève (conversion gratuit → payant).
    select user_id, min(created_at) as at from payment_transactions
    where status = 'successful' and user_id is not null
    group by user_id
  )
  select jsonb_build_object(
    'days', v_days,
    'from', v_from,
    'today', v_today,
    'generated_at', now(),
    'series', (select jsonb_agg(jsonb_build_object('day', day, 'signups', signups, 'active', active) order by day) from per_day),
    'students_total', (select count(*) from students),
    'signups_period', (select count(*) from students where signup_day >= v_from),
    'dau', (select count(distinct user_id) from student_activity where day = v_today),
    'wau', (select count(distinct user_id) from student_activity where day > v_today - 7),
    'mau', (select count(distinct user_id) from student_activity),
    'events_period', (select count(*) from ev),
    'platforms', (select coalesce(jsonb_object_agg(platform, n), '{}'::jsonb) from (
        select platform, count(distinct coalesce(user_id::text, device_id)) as n from ev group by platform) p),
    'retention', (select to_jsonb(r) from retention r),
    'top_chapters', (select coalesce(jsonb_agg(to_jsonb(t)), '[]'::jsonb) from top_chapters t),
    'top_lessons', (select coalesce(jsonb_agg(to_jsonb(t)), '[]'::jsonb) from top_lessons t),
    'events_by_name', (select coalesce(jsonb_object_agg(name, n), '{}'::jsonb) from (select name, count(*) n from ev group by name) x),
    'quizzes_completed', (select count(*) from quiz_attempts where completed_at >= v_since),
    'funnel', jsonb_build_object(
      'steps', (select coalesce(jsonb_agg(jsonb_build_object('index', idx, 'step', step, 'devices', devices) order by idx), '[]'::jsonb) from funnel_steps),
      'submitted', (select count(distinct device_id) from ev where name = 'register_submitted'),
      'signed_up', (select count(*) from students where signup_day >= v_from),
      'onboarded', (select count(*) from students where signup_day >= v_from and onboarding_completed),
      'first_content', (select count(*) from students s where s.signup_day >= v_from and exists (
          select 1 from ev where ev.user_id = s.id and ev.name in ('chapter_opened', 'lesson_opened')))
    ),
    'payments', jsonb_build_object(
      'by_status', (select coalesce(jsonb_object_agg(status, n), '{}'::jsonb) from (select status, count(*) n from pay group by status) x),
      'revenue', (select coalesce(sum(amount), 0) from pay where status = 'successful'),
      'by_plan', (select coalesce(jsonb_agg(to_jsonb(x) order by x.revenue desc), '[]'::jsonb) from (
          select plan::text as plan, count(*) as payments, sum(amount) as revenue
          from pay where status = 'successful' group by plan) x),
      'by_kind', (select coalesce(jsonb_object_agg(coalesce(change_kind, 'inconnu'), n), '{}'::jsonb) from (
          select change_kind, count(*) n from pay where status = 'successful' group by change_kind) x),
      'failure_reasons', (select coalesce(jsonb_agg(to_jsonb(x) order by x.n desc), '[]'::jsonb) from (
          select coalesce(nullif(failure_reason, ''), provider_status, 'non précisée') as reason, count(*) n
          from pay where status in ('failed', 'cancelled', 'expired') group by 1 order by 2 desc limit 8) x),
      'by_network', (select coalesce(jsonb_agg(to_jsonb(x)), '[]'::jsonb) from (
          select coalesce(network, 'inconnu') as network,
                 count(*) filter (where status = 'successful') as ok,
                 count(*) filter (where status in ('failed', 'cancelled', 'expired')) as ko
          from pay group by 1) x)
    ),
    'conversions', jsonb_build_object(
      'new_paying_period', (select count(*) from first_paid where at >= v_since),
      'paying_now', (select count(*) from students where plan <> 'free' and (plan_expires_at is null or plan_expires_at > now())),
      'paying_by_plan', (select coalesce(jsonb_object_agg(plan, n), '{}'::jsonb) from (
          select plan::text as plan, count(*) n from students
          where plan <> 'free' and (plan_expires_at is null or plan_expires_at > now()) group by plan) x),
      'paywall_viewers', (select count(distinct user_id) from ev where name = 'paywall_viewed'),
      'paywall_then_paid', (select count(distinct ev.user_id) from ev join first_paid fp on fp.user_id = ev.user_id
          where ev.name = 'paywall_viewed' and fp.at >= ev.created_at)
    )
  ) into v_result;

  return v_result;
end
$$;

revoke execute on function public.admin_app_stats(int) from public, anon, authenticated;
grant  execute on function public.admin_app_stats(int) to service_role;

-- Purge : les événements bruts au-delà de 13 mois n'apportent plus rien.
create or replace function public.purge_old_app_events()
returns int language sql security definer set search_path = public as $$
  with d as (delete from app_events where created_at < now() - interval '13 months' returning 1)
  select count(*)::int from d
$$;
revoke execute on function public.purge_old_app_events() from public, anon, authenticated;
grant  execute on function public.purge_old_app_events() to service_role;
