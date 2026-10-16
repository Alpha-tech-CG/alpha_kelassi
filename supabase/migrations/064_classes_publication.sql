-- Migration 064 : ouverture des classes aux élèves (PARTIE 2 / 2)
-- (à exécuter après validation de la 063)
--
-- Chaque classe a un interrupteur « ouverte aux élèves ». Les classes d'examen
-- déjà en service sont ouvertes ; les classes intermédiaires ajoutées par la
-- 063 sont fermées : l'administration y prépare le programme, les élèves ne
-- les voient pas.
--
-- La fermeture est appliquée par la base (RLS), pas par les écrans : une
-- classe fermée ne renvoie ni ses séries (donc impossible de la choisir à
-- l'inscription, sur le web comme sur l'appli déjà installée), ni ses
-- matières, ni ses chapitres — sauf à un administrateur. Les routes de la
-- console passent par la clé de service et ne sont pas concernées.

-- ── Interrupteur par classe ────────────────────────────────────────────────
create table if not exists public.study_level_settings (
  level      study_level primary key,
  published  boolean not null default false,
  updated_at timestamptz not null default now()
);

insert into public.study_level_settings (level, published)
select l, l::text in ('cepe', 'bepc', 'bac_a', 'bac_c', 'bac_d', 'bac_e', 'bac_f3',
                      'bac_g2', 'bac_g3', 'bac_h', 'bac_bg', 'bac_r')
from unnest(enum_range(null::study_level)) as l
on conflict (level) do nothing;

alter table public.study_level_settings enable row level security;
drop policy if exists "study_level_settings_read" on public.study_level_settings;
create policy "study_level_settings_read" on public.study_level_settings
  for select to anon, authenticated using (true);
grant select on public.study_level_settings to anon, authenticated;
-- (Écritures : uniquement par la console, via la clé de service.)

-- Une classe sans ligne est considérée ouverte : une valeur d'enum ajoutée plus
-- tard sans ligne ici ne doit pas disparaître silencieusement.
create or replace function public.level_is_visible(l study_level)
returns boolean language sql security definer stable set search_path = public as $$
  select coalesce((select published from public.study_level_settings where level = l), true)
      or coalesce(public.current_user_role() = 'admin', false)
$$;

create or replace function public.subject_is_visible(sid uuid)
returns boolean language sql security definer stable set search_path = public as $$
  select coalesce((select public.level_is_visible(s.level) from public.subjects s where s.id = sid), true)
$$;

-- ── Matières ───────────────────────────────────────────────────────────────
drop policy if exists "subjects: select all authenticated" on public.subjects;
create policy "subjects: select all authenticated" on public.subjects
  for select using (auth.uid() is not null and public.level_is_visible(level));

drop policy if exists "subjects_public_read_anon" on public.subjects;
create policy "subjects_public_read_anon" on public.subjects
  for select to anon using (public.level_is_visible(level));

-- ── Séries (choix de la classe à l'inscription) ────────────────────────────
drop policy if exists "series_public_read" on public.series;
create policy "series_public_read" on public.series
  for select to authenticated using (public.level_is_visible(level));

-- ── Chapitres ──────────────────────────────────────────────────────────────
drop policy if exists "chapters_public_read" on public.chapters;
create policy "chapters_public_read" on public.chapters
  for select to authenticated using (public.subject_is_visible(subject_id));

drop policy if exists "chapters_public_read_anon" on public.chapters;
create policy "chapters_public_read_anon" on public.chapters
  for select to anon using (public.subject_is_visible(subject_id));

-- ── Séries des nouvelles classes ───────────────────────────────────────────
-- L'inscription propose une classe à travers ses séries : chaque classe en a
-- donc une (comme CEPE et BEPC aujourd'hui). Fermées comme leur classe, elles
-- n'apparaîtront qu'une fois la classe ouverte.
-- `unique(code, track, level, country_code)` rend l'insertion idempotente.
insert into public.series (code, label, track, level, country_code) values
  ('CP1',  'CP1 — École primaire',                            'generale',  'cp1',         'CG'),
  ('CP2',  'CP2 — École primaire',                            'generale',  'cp2',         'CG'),
  ('CE1',  'CE1 — École primaire',                            'generale',  'ce1',         'CG'),
  ('CE2',  'CE2 — École primaire',                            'generale',  'ce2',         'CG'),
  ('CM1',  'CM1 — École primaire',                            'generale',  'cm1',         'CG'),
  ('6E',   '6e — Collège',                                    'generale',  'sixieme',     'CG'),
  ('5E',   '5e — Collège',                                    'generale',  'cinquieme',   'CG'),
  ('4E',   '4e — Collège',                                    'generale',  'quatrieme',   'CG'),
  ('2A',   'Seconde A — Littéraire',                          'generale',  'seconde_a',   'CG'),
  ('2C',   'Seconde C — Scientifique',                        'generale',  'seconde_c',   'CG'),
  ('2T',   'Seconde technique',                               'technique', 'seconde_t',   'CG'),
  ('1A',   'Première A — Lettres et Sciences Humaines',       'generale',  'premiere_a',  'CG'),
  ('1C',   'Première C — Mathématiques et Sciences Physiques','generale',  'premiere_c',  'CG'),
  ('1D',   'Première D — Sciences de la Vie et de la Terre',  'generale',  'premiere_d',  'CG'),
  ('1E',   'Première E — Mathématiques et Technique',         'technique', 'premiere_e',  'CG'),
  ('1F3',  'Première F3 — Génie Civil',                       'technique', 'premiere_f3', 'CG'),
  ('1G2',  'Première G2 — Techniques Administratives',        'technique', 'premiere_g2', 'CG'),
  ('1G3',  'Première G3 — Techniques Commerciales',           'technique', 'premiere_g3', 'CG'),
  ('1H',   'Première H — Techniques Informatiques',           'technique', 'premiere_h',  'CG'),
  ('1BG',  'Première BG',                                     'technique', 'premiere_bg', 'CG'),
  ('1R',   'Première R',                                      'technique', 'premiere_r',  'CG')
on conflict (code, track, level, country_code) do nothing;

-- Vérification suggérée après application :
--   select level, published from public.study_level_settings order by level;
--   -- Connecté comme élève : aucune série « seconde_* » ni « premiere_* » ne revient.
