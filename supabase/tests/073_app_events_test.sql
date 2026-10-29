-- Tests de la migration 073 (événements d'usage bornés, sauvegardes retirées).
--
-- À exécuter APRÈS 073, dans l'éditeur SQL Supabase. Tout se déroule dans une
-- transaction annulée : aucune donnée n'est conservée. Le script se termine
-- volontairement sur l'exception TESTS_073_OK, qui garantit l'annulation ;
-- toute autre erreur signale un échec.

begin;

do $$
declare
  dev text := 'test-073-' || gen_random_uuid();
  ok  boolean;
  i   int;
begin
  -- Les tables de sauvegarde ont disparu.
  if to_regclass('public.backup_057_users_plan') is not null
     or to_regclass('public.backup_057_subscriptions') is not null then
    raise exception 'F8 tables de sauvegarde encore présentes';
  end if;

  -- Événement anonyme normal : accepté.
  insert into public.app_events (device_id, name, platform, props)
  values (dev, 'app_open', 'android', '{"step":1}');

  -- props trop volumineux : refusé.
  ok := false;
  begin
    insert into public.app_events (device_id, name, platform, props)
    values (dev || '-big', 'app_open', 'android', jsonb_build_object('x', repeat('a', 3000)));
  exception when others then ok := (sqlerrm = 'APP_EVENT_TOO_LARGE');
  end;
  if not ok then raise exception 'F7 props de 3 Ko accepté'; end if;

  -- 30 événements par heure et par appareil, puis refus.
  for i in 2..30 loop
    insert into public.app_events (device_id, name, platform, props) values (dev, 'app_open', 'android', '{}');
  end loop;
  ok := false;
  begin
    insert into public.app_events (device_id, name, platform, props) values (dev, 'app_open', 'android', '{}');
  exception when others then ok := (sqlerrm = 'APP_EVENT_RATE_LIMITED');
  end;
  if not ok then raise exception 'F7 31e événement de l''appareil accepté'; end if;

  -- Plafond global : 500 par minute, même en changeant de device_id.
  insert into public.app_events (device_id, name, platform, props)
  select 'test-073-flood-' || g, 'app_open', 'android', '{}'
  from generate_series(1, 500 - (select count(*) from public.app_events
                                 where user_id is null and created_at > now() - interval '1 minute')::int) g;
  ok := false;
  begin
    insert into public.app_events (device_id, name, platform, props) values ('test-073-flood-x', 'app_open', 'android', '{}');
  exception when others then ok := (sqlerrm = 'APP_EVENT_RATE_LIMITED');
  end;
  if not ok then raise exception 'F7 plafond global non appliqué'; end if;

  raise exception 'TESTS_073_OK';
end $$;

rollback;
