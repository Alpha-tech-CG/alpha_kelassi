-- Migration 063 : classes intermédiaires des trois cycles (PARTIE 1 / 2)
--
-- Jusqu'ici l'application ne connaissait que les classes d'examen : CM2
-- (CEPE), 3e (BEPC) et les Terminales (BAC). On ajoute les autres classes du
-- système congolais, rangées par cycle :
--
--   Primaire : CP1, CP2, CE1, CE2, CM1   → CM2  (CEPE, valeur `cepe`)
--   Collège  : 6e, 5e, 4e                → 3e   (BEPC, valeur `bepc`)
--   Lycée    : Seconde par filière (A, C, technique), Première par série
--              (A, C, D, E, F3, G2, G3, H, BG, R) → Terminales (`bac_*`)
--
-- Ces classes restent INVISIBLES pour les élèves tant que l'administration ne
-- les a pas ouvertes (migration 064, table `study_level_settings`).
--
-- ⚠ EXÉCUTION EN DEUX TEMPS
-- PostgreSQL refuse d'utiliser une valeur d'enum dans la même transaction que
-- sa création (« unsafe use of new value of enum type »). Cette migration doit
-- être validée avant de lancer la 064.

-- Primaire
alter type study_level add value if not exists 'cp1';
alter type study_level add value if not exists 'cp2';
alter type study_level add value if not exists 'ce1';
alter type study_level add value if not exists 'ce2';
alter type study_level add value if not exists 'cm1';

-- Collège
alter type study_level add value if not exists 'sixieme';
alter type study_level add value if not exists 'cinquieme';
alter type study_level add value if not exists 'quatrieme';

-- Lycée — Seconde, par filière
alter type study_level add value if not exists 'seconde_a';
alter type study_level add value if not exists 'seconde_c';
alter type study_level add value if not exists 'seconde_t';

-- Lycée — Première, par série
alter type study_level add value if not exists 'premiere_a';
alter type study_level add value if not exists 'premiere_c';
alter type study_level add value if not exists 'premiere_d';
alter type study_level add value if not exists 'premiere_e';
alter type study_level add value if not exists 'premiere_f3';
alter type study_level add value if not exists 'premiere_g2';
alter type study_level add value if not exists 'premiere_g3';
alter type study_level add value if not exists 'premiere_h';
alter type study_level add value if not exists 'premiere_bg';
alter type study_level add value if not exists 'premiere_r';
