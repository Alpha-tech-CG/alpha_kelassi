-- Tests de la migration 057 (formules, quotas, expiration).
--
-- À exécuter APRÈS 056 et 057, dans l'éditeur SQL Supabase (rôle postgres).
-- Tout se déroule dans une transaction annulée à la fin : aucune donnée n'est
-- conservée. Chaque vérification lève une exception explicite en cas d'échec ;
-- si le script se termine sur « ROLLBACK » sans erreur, tous les tests passent.

begin;

do $$
declare
  v_user  uuid := gen_random_uuid();
  v_admin uuid := gen_random_uuid();
  r       jsonb;
begin
  -- Comptes de test (auth.users puis profil)
  insert into auth.users (id, email) values (v_user, 'test-057-eleve@example.invalid'), (v_admin, 'test-057-admin@example.invalid');
  insert into public.users (id, email, role, plan) values
    (v_user, 'test-057-eleve@example.invalid', 'student', 'free'),
    (v_admin, 'test-057-admin@example.invalid', 'admin', 'free')
  on conflict (id) do nothing;
  -- Un déclencheur d'inscription a pu créer les profils avant nous : on fixe les rôles.
  update public.users set role = 'student', plan = 'free' where id = v_user;
  update public.users set role = 'admin' where id = v_admin;

  -- ── Hiérarchie ─────────────────────────────────────────────────────────
  if public.plan_level('free') <> 0 or public.plan_level('starter') <> 1 or public.plan_level('pro') <> 2
     or public.plan_level('pro_max') <> 3 or public.plan_level('premium') <> 2 then
    raise exception 'ÉCHEC plan_level';
  end if;
  if public.user_plan_level(v_user) <> 0 then raise exception 'ÉCHEC gratuit par défaut'; end if;
  if public.user_plan_level(v_admin) <> 3 then raise exception 'ÉCHEC admin = Pro Max effectif'; end if;

  -- ── Abonnement actif, programmé, expiré ────────────────────────────────
  insert into public.subscriptions (user_id, plan, status, started_at, expires_at, source)
  values (v_user, 'starter', 'active', now() - interval '1 day', now() + interval '10 days', 'admin');
  if public.user_plan_level(v_user) <> 1 then raise exception 'ÉCHEC Starter actif'; end if;

  insert into public.subscriptions (user_id, plan, status, started_at, expires_at, source)
  values (v_user, 'pro', 'pending', now() + interval '10 days', now() + interval '40 days', 'admin');
  if public.user_plan_level(v_user) <> 1 then raise exception 'ÉCHEC un abonnement programmé ne donne rien avant son début'; end if;

  update public.subscriptions set expires_at = now() - interval '1 second'
   where user_id = v_user and plan = 'starter';
  if public.user_plan_level(v_user) <> 0 then raise exception 'ÉCHEC expiration immédiate des droits'; end if;
  perform public.refresh_user_plan(v_user);
  if (select status from public.subscriptions where user_id = v_user and plan = 'starter') <> 'expired' then
    raise exception 'ÉCHEC passage à expired';
  end if;
  if (select plan::text from public.users where id = v_user) <> 'free' then
    raise exception 'ÉCHEC retour du cache au Gratuit';
  end if;

  update public.subscriptions set started_at = now() - interval '1 second' where user_id = v_user and plan = 'pro';
  if public.user_plan_level(v_user) <> 2 then raise exception 'ÉCHEC démarrage programmé'; end if;
  perform public.refresh_user_plan(v_user);
  if (select plan::text from public.users where id = v_user) <> 'pro' then raise exception 'ÉCHEC cache Pro'; end if;

  -- ── Quotas : limite, idempotence, remboursement, changement de période ─
  r := public.consume_usage(v_user, 'ai_questions', '2026-09-11', 2, 'req-aaaaaaaa');
  if not (r->>'allowed')::boolean or (r->>'used')::int <> 1 then raise exception 'ÉCHEC 1re consommation %', r; end if;

  r := public.consume_usage(v_user, 'ai_questions', '2026-09-11', 2, 'req-aaaaaaaa');
  if not (r->>'duplicate')::boolean or (r->>'used')::int <> 1 then raise exception 'ÉCHEC nouvelle tentative comptée deux fois %', r; end if;

  r := public.consume_usage(v_user, 'ai_questions', '2026-09-11', 2, 'req-bbbbbbbb');
  if (r->>'used')::int <> 2 then raise exception 'ÉCHEC 2e consommation %', r; end if;

  r := public.consume_usage(v_user, 'ai_questions', '2026-09-11', 2, 'req-cccccccc');
  if (r->>'allowed')::boolean then raise exception 'ÉCHEC limite atteinte non refusée %', r; end if;

  r := public.refund_usage(v_user, 'ai_questions', 'req-bbbbbbbb');
  if not (r->>'refunded')::boolean then raise exception 'ÉCHEC remboursement'; end if;
  r := public.refund_usage(v_user, 'ai_questions', 'req-bbbbbbbb');
  if (r->>'refunded')::boolean then raise exception 'ÉCHEC double remboursement'; end if;

  r := public.consume_usage(v_user, 'ai_questions', '2026-09-11', 2, 'req-cccccccc');
  if not (r->>'allowed')::boolean then raise exception 'ÉCHEC une requête échouée a consommé du quota %', r; end if;

  r := public.consume_usage(v_user, 'ai_questions', '2026-09-12', 2, 'req-dddddddd');
  if (r->>'used')::int <> 1 then raise exception 'ÉCHEC réinitialisation le jour suivant %', r; end if;

  update public.usage_counters set bonus = 1
   where user_id = v_user and usage_type = 'ai_questions' and period_key = '2026-09-11';
  r := public.consume_usage(v_user, 'ai_questions', '2026-09-11', 2, 'req-eeeeeeee');
  if not (r->>'allowed')::boolean then raise exception 'ÉCHEC quota exceptionnel ignoré %', r; end if;

  r := public.consume_usage(v_user, 'tutor_corrections', '2026-09', 2, 'corr-11111111');
  r := public.consume_usage(v_user, 'tutor_corrections', '2026-09', 2, 'corr-22222222');
  r := public.consume_usage(v_user, 'tutor_corrections', '2026-09', 2, 'corr-33333333');
  if (r->>'allowed')::boolean then raise exception 'ÉCHEC 3e correction Pro acceptée %', r; end if;
  r := public.consume_usage(v_user, 'tutor_corrections', '2026-10', 2, 'corr-33333333');
  if (r->>'duplicate')::boolean is not true then
    -- la clé a déjà été refusée en septembre (aucun évènement créé) : elle est donc neuve en octobre
    if (r->>'used')::int <> 1 then raise exception 'ÉCHEC réinitialisation au mois suivant %', r; end if;
  end if;

  -- ── Contenu : premier chapitre ouvert ──────────────────────────────────
  perform 1 from public.chapters limit 1;
  if found then
    if not public.is_open_chapter((select c.id from public.chapters c
                                     order by c.subject_id, c.order_index, c.created_at, c.id limit 1)) then
      raise exception 'ÉCHEC premier chapitre non ouvert';
    end if;
  end if;

  raise notice 'Tous les tests de la migration 057 passent.';
end;
$$;

rollback;
