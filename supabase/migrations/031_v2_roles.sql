-- Alpha Kelassi V2 — Nouveaux rôles (Cognix)
-- Migration 031 : ajoute les rôles tuteur / enseignant / parent à l'enum user_role.
--
-- IMPORTANT : `ALTER TYPE ... ADD VALUE` doit être dans SA PROPRE migration.
-- Une valeur d'enum ajoutée ne peut pas être RÉFÉRENCÉE dans la même
-- transaction que son ajout. Les migrations suivantes (032+) qui comparent
-- `role = 'tutor'` dans des policies RLS s'appuient sur ce commit préalable.

alter type user_role add value if not exists 'tutor';
alter type user_role add value if not exists 'teacher';
alter type user_role add value if not exists 'parent';
