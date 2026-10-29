-- Tests de la migration 076 (agrégats de vitesse pour la console admin).
--
-- À exécuter APRÈS 076. Tout se déroule dans une transaction annulée ; le
-- script se termine volontairement sur l'exception TESTS_076_OK, qui garantit
-- l'annulation. Toute autre erreur signale un échec.

begin;

do $$
declare
  r    jsonb;
  page jsonb;
begin
  -- Réservée au service_role.
  if has_function_privilege('anon', 'public.admin_web_vitals(int)', 'execute')
     or has_function_privilege('authenticated', 'public.admin_web_vitals(int)', 'execute') then
    raise exception '076 admin_web_vitals exécutable par anon/authenticated';
  end if;

  -- Page de test : 4 LCP de 1 000 000 à 1 003 000 ms (p75 = 1 002 250), une
  -- mesure INP et TTFB, une valeur invalide ignorée. Valeurs énormes pour
  -- passer en tête des pages lentes.
  insert into public.app_events (device_id, name, platform, props)
  select 'test-076-' || g, 'web_vital', 'web',
         jsonb_build_object('metric', 'LCP', 'value', (999000 + g * 1000)::text, 'rating', 'poor', 'path', '/test-076')
  from generate_series(1, 4) g;
  insert into public.app_events (device_id, name, platform, props) values
    ('test-076-inp',  'web_vital', 'web', '{"metric":"INP","value":"999150","rating":"poor","path":"/test-076"}'),
    ('test-076-ttfb', 'web_vital', 'web', '{"metric":"TTFB","value":"999900","rating":"poor","path":"/test-076"}'),
    ('test-076-bad',  'web_vital', 'web', '{"metric":"LCP","value":"abc","rating":"poor","path":"/test-076"}');

  r := public.admin_web_vitals(1);
  select p into page from jsonb_array_elements(r->'pages') p where p->>'path' = '/test-076';

  if page is null then raise exception '076 page de test absente : %', r; end if;
  if (page->>'n')::int <> 4 then raise exception '076 n attendu 4 (valeur invalide ignorée) : %', page; end if;
  if (page->>'lcp')::numeric <> 1002250 then raise exception '076 p75 LCP attendu 1002250 : %', page; end if;
  if (page->>'inp')::numeric <> 999150 or (page->>'ttfb')::numeric <> 999900 then
    raise exception '076 INP/TTFB inattendus : %', page;
  end if;
  if r->'overall'->'LCP' is null then raise exception '076 overall.LCP absent : %', r; end if;

  raise exception 'TESTS_076_OK';
end $$;

rollback;
