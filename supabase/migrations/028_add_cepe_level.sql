-- Migration 028 : ajoute le CEPE (école primaire) comme niveau d'examen
-- sélectionnable à l'inscription (filière générale).
-- NB : ALTER TYPE ADD VALUE ne doit pas être utilisé dans la même transaction
-- que l'insertion de séries CEPE (voir seed_series.sql).
alter type study_level add value if not exists 'cepe';
