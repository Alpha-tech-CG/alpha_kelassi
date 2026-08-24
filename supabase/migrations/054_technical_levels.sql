-- Migration 054 : classes d'examen du lycée technique
--
-- Les séries techniques existaient dans `series` mais étaient rattachées à des
-- niveaux généraux faute de mieux : G1 et G2 pointaient vers `bac_a`, F3 vers
-- `bac_c`. Un élève de G2 se voyait donc proposer le programme de BAC A.
--
-- On ajoute les vraies classes d'examen technique à l'enum `study_level`,
-- puis on recable les séries existantes dessus.
--
-- ⚠ EXÉCUTION EN DEUX TEMPS
-- PostgreSQL refuse d'utiliser une valeur d'enum dans la même transaction que
-- sa création (« unsafe use of new value of enum type »). La PARTIE 1 doit
-- donc être validée avant de lancer la PARTIE 2. Si l'outil de migration
-- enveloppe tout dans une transaction, jouer les deux blocs séparément.

-- ════════════════════ PARTIE 1 — valeurs d'enum ════════════════════
-- Baccalauréats techniques.
alter type study_level add value if not exists 'bac_e';
alter type study_level add value if not exists 'bac_f3';
alter type study_level add value if not exists 'bac_g2';
alter type study_level add value if not exists 'bac_g3';
alter type study_level add value if not exists 'bac_h';
-- Brevet de Gestion : examen distinct, pas une série du baccalauréat — d'où
-- l'absence de préfixe `bac_`, comme pour `cepe` et `bepc`.
alter type study_level add value if not exists 'bg';

-- ════════════════════ PARTIE 2 — séries ════════════════════
-- (à exécuter après validation de la partie 1)

-- Recable les séries techniques déjà présentes vers leur vraie classe.
-- G1 reste sur bac_a : cette série n'a pas été demandée comme classe propre,
-- la laisser telle quelle évite de créer un niveau sans contenu.
update public.series set level = 'bac_g2' where code = 'G2' and track = 'technique';
update public.series set level = 'bac_f3' where code = 'F3' and track = 'technique';

-- Séries manquantes. `unique(code, track, level, country_code)` rend
-- l'insertion idempotente.
insert into public.series (code, label, track, level, country_code) values
  ('G3', 'Série G3 — Techniques Commerciales',            'technique', 'bac_g3', 'CG'),
  ('H',  'Série H — Techniques Informatiques',            'technique', 'bac_h',  'CG'),
  ('E',  'Série E — Mathématiques et Technique',          'technique', 'bac_e',  'CG'),
  ('BG', 'BG — Brevet de Gestion',                        'technique', 'bg',     'CG')
on conflict (code, track, level, country_code) do nothing;
