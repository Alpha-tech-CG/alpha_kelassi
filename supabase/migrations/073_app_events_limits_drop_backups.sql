-- 073 — Événements d'usage bornés + tables de sauvegarde retirées (audit sécurité du 26/10/2026, F7 et F8).
--
-- F7. La politique "app_events: insert anonymous signup" (069) laisse un visiteur
-- NON CONNECTÉ insérer des événements avec un device_id arbitraire, sans limite :
-- remplissage de la base et statistiques faussées. L'APK installé écrit en
-- direct dans la table, donc on ne peut pas faire passer ces envois par une
-- route API sans casser le suivi de l'ancienne version. Le contrôle se fait
-- dans la base, par un déclencheur :
--   • tailles bornées pour tous (props ≤ 2 Ko, textes courts) ;
--   • événements anonymes : 30 par heure et par device_id, et 500 par minute
--     au total (un device_id différent à chaque envoi ne contourne pas ce plafond).
-- Les clients ignorent déjà l'erreur d'insertion (suivi « au mieux »).
-- Au 26/10 : props ≤ 112 octets, 2 événements anonymes par appareil et par
-- heure, 4 par minute au plus — très loin des seuils.
--
-- F8. backup_057_users_plan (1 ligne) et backup_057_subscriptions (vide),
-- laissées par la migration 057 du 11/09, exportées hors ligne le 26/10.

-- ── F7 ─────────────────────────────────────────────────────────────────────────
create index if not exists app_events_anon_device_idx
  on public.app_events (device_id, created_at desc) where user_id is null;

create or replace function public.app_events_guard()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if octet_length(new.props::text) > 2048
     or length(new.name) > 64
     or length(new.platform) > 16
     or length(coalesce(new.app_version, '')) > 32
     or length(coalesce(new.device_id, '')) > 128 then
    raise exception 'APP_EVENT_TOO_LARGE';
  end if;

  if new.user_id is null then
    if (select count(*) from public.app_events
        where user_id is null and device_id = new.device_id
          and created_at > now() - interval '1 hour') >= 30 then
      raise exception 'APP_EVENT_RATE_LIMITED';
    end if;
    if (select count(*) from public.app_events
        where user_id is null and created_at > now() - interval '1 minute') >= 500 then
      raise exception 'APP_EVENT_RATE_LIMITED';
    end if;
  end if;

  return new;
end; $$;

revoke execute on function public.app_events_guard() from PUBLIC, anon, authenticated;

drop trigger if exists app_events_guard on public.app_events;
create trigger app_events_guard before insert on public.app_events
  for each row execute function public.app_events_guard();

-- ── F8 ─────────────────────────────────────────────────────────────────────────
drop table if exists public.backup_057_users_plan;
drop table if exists public.backup_057_subscriptions;
