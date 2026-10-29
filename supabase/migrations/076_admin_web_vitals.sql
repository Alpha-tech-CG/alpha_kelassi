-- 076 — Vitesse ressentie par les élèves sur le site (carte « Vitesse » de /admin/suivi).
--
-- Le composant <WebVitals /> du site envoie, pour les élèves connectés, un
-- événement `web_vital` dans app_events (policy "insert own" de 069, bornes de
-- 073) : props = { metric: LCP | INP | TTFB, value: millisecondes, rating,
-- path: chemin aux identifiants remplacés par :id }.
--
-- Depuis le 26/10 toutes les pages sont rendues à chaque visite (CSP à nonce) :
-- ces mesures disent si les élèves le ressentent. Le 75e centile est la valeur
-- de référence des Core Web Vitals (bon : LCP ≤ 2 500 ms, INP ≤ 200 ms,
-- TTFB ≤ 800 ms).
--
-- Même modèle que admin_app_stats() : agrégats seulement, réservés au
-- service_role (la page admin les lit avec la clé de service).

create or replace function public.admin_web_vitals(p_days int default 7)
returns jsonb language sql stable security definer set search_path = public as $$
  with
  params as (
    select greatest(1, least(coalesce(p_days, 7), 90)) as days
  ),
  v as (
    select e.props->>'metric' as metric,
           (e.props->>'value')::numeric as value,
           e.props->>'rating' as rating,
           e.props->>'path' as path
    from app_events e, params
    where e.name = 'web_vital'
      and e.created_at >= now() - make_interval(days => params.days)
      and e.props->>'metric' in ('LCP', 'INP', 'TTFB')
      and (e.props->>'value') ~ '^\d{1,7}$'
  ),
  overall as (
    select metric,
           count(*) as n,
           round(percentile_cont(0.75) within group (order by value)) as p75,
           round(100.0 * count(*) filter (where rating = 'poor') / count(*), 1) as poor_pct
    from v group by metric
  ),
  -- Pages les plus lentes à afficher (LCP), avec au moins 3 mesures.
  pages as (
    select path,
           count(*) filter (where metric = 'LCP') as n,
           round(percentile_cont(0.75) within group (order by value) filter (where metric = 'LCP'))  as lcp,
           round(percentile_cont(0.75) within group (order by value) filter (where metric = 'INP'))  as inp,
           round(percentile_cont(0.75) within group (order by value) filter (where metric = 'TTFB')) as ttfb
    from v
    group by path
    having count(*) filter (where metric = 'LCP') >= 3
    order by lcp desc nulls last
    limit 15
  )
  select jsonb_build_object(
    'days', (select days from params),
    'overall', coalesce((select jsonb_object_agg(metric, jsonb_build_object('n', n, 'p75', p75, 'poor_pct', poor_pct)) from overall), '{}'::jsonb),
    'pages', coalesce((select jsonb_agg(to_jsonb(p) order by p.lcp desc nulls last) from pages p), '[]'::jsonb)
  )
$$;

revoke execute on function public.admin_web_vitals(int) from public, anon, authenticated;
grant  execute on function public.admin_web_vitals(int) to service_role;
