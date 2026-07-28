-- Alpha Kelassi — Seed des séries (filières) du Congo-Brazzaville
-- À exécuter APRÈS la migration 027 (le type track_type doit déjà contenir
-- 'professionnel', ajouté par 027 — ne pas fusionner dans la même transaction
-- que l'ALTER TYPE ADD VALUE).
--
-- NB mapping : series.level est contraint à l'enum study_level
-- (bepc | bac_a | bac_c | bac_d). Les séries techniques réutilisent donc
-- provisoirement un code de niveau général (à affiner quand la nomenclature
-- officielle des BAC techniques sera figée).

insert into public.series (code, label, track, level, country_code) values
  -- ── BAC Général ──
  ('A',  'Série A — Lettres et Sciences Humaines',        'generale',  'bac_a', 'CG'),
  ('C',  'Série C — Mathématiques et Sciences Physiques',  'generale',  'bac_c', 'CG'),
  ('D',  'Série D — Sciences de la Vie et de la Terre',     'generale',  'bac_d', 'CG'),
  -- ── BAC Technique (à compléter selon les filières réelles) ──
  ('G1', 'Série G1 — Commerce et Comptabilité',            'technique', 'bac_a', 'CG'),
  ('G2', 'Série G2 — Techniques Administratives',          'technique', 'bac_a', 'CG'),
  ('F3', 'Série F3 — Génie Civil',                         'technique', 'bac_c', 'CG')
on conflict (code, track, level, country_code) do nothing;
