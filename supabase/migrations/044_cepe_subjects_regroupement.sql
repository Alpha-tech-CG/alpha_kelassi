-- Alpha Kelassi — Regroupement des matières CEPE en épreuves
-- Migration 044
--
-- Purement additif : aucune matière, chapitre, leçon, exercice ou quiz existant
-- n'est renommé ni déplacé. On ajoute juste une métadonnée de regroupement au-dessus
-- des matières CEPE déjà en place, pour que l'écran Cours affiche les 3 épreuves
-- réelles (Français, Mathématiques, Éveil) plutôt que 15 matières à plat.
-- N'affecte que les matières de level='cepe' — BEPC/BAC ne sont pas touchés.

alter table public.subjects
  add column if not exists parent_subject_id uuid references public.subjects(id) on delete set null,
  add column if not exists display_order smallint not null default 0;

create index if not exists idx_subjects_parent on public.subjects(parent_subject_id);

-- ── Ordre d'affichage des 3 épreuves CEPE (elles restent parent_subject_id = null) ──
update public.subjects set display_order = 1 where level = 'cepe' and name = 'Français';
update public.subjects set display_order = 2 where level = 'cepe' and name = 'Mathématiques';
update public.subjects set display_order = 3 where level = 'cepe' and name = 'Éveil';

-- ── Rattachement des domaines existants à leur épreuve ──────────────────────────
do $$
declare
  v_francais_id uuid;
  v_maths_id    uuid;
  v_eveil_id    uuid;
begin
  select id into v_francais_id from public.subjects where level = 'cepe' and name = 'Français';
  select id into v_maths_id    from public.subjects where level = 'cepe' and name = 'Mathématiques';
  select id into v_eveil_id    from public.subjects where level = 'cepe' and name = 'Éveil';

  -- Français : Grammaire, Conjugaison, Orthographe (x2), Vocabulaire, Expression écrite
  update public.subjects set parent_subject_id = v_francais_id, display_order = 1 where level = 'cepe' and name = 'Grammaire';
  update public.subjects set parent_subject_id = v_francais_id, display_order = 2 where level = 'cepe' and name = 'Conjugaison';
  update public.subjects set parent_subject_id = v_francais_id, display_order = 3 where level = 'cepe' and name = 'Orthographe grammaticale';
  update public.subjects set parent_subject_id = v_francais_id, display_order = 4 where level = 'cepe' and name = 'Orthographe d''usage';
  update public.subjects set parent_subject_id = v_francais_id, display_order = 5 where level = 'cepe' and name = 'Vocabulaire';
  update public.subjects set parent_subject_id = v_francais_id, display_order = 6 where level = 'cepe' and name = 'Expression écrite';

  -- Mathématiques : Numération (Calcul rapide & Problèmes suivront à l'étape 2)
  update public.subjects set parent_subject_id = v_maths_id, display_order = 1 where level = 'cepe' and name = 'Numération';

  -- Éveil : SVT, Initiation à la production, Technologie, Chimie, Science-physique
  update public.subjects set parent_subject_id = v_eveil_id, display_order = 1 where level = 'cepe' and name = 'SVT';
  update public.subjects set parent_subject_id = v_eveil_id, display_order = 2 where level = 'cepe' and name = 'Initiation à la production';
  update public.subjects set parent_subject_id = v_eveil_id, display_order = 3 where level = 'cepe' and name = 'Technologie';
  update public.subjects set parent_subject_id = v_eveil_id, display_order = 4 where level = 'cepe' and name = 'Chimie';
  update public.subjects set parent_subject_id = v_eveil_id, display_order = 5 where level = 'cepe' and name = 'Science-physique';
end $$;
