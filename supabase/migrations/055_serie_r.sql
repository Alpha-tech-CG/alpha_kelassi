-- Migration 055 : classe d'examen « série R » du lycée technique
--
-- Le programme de Mathématiques Générales du METPFQE vise les terminales
-- « G2, G3, BG et R ». Les trois premières existent depuis la migration 054 ;
-- la série R, elle, n'avait ni valeur d'enum ni ligne dans `series`. Sans
-- elle, aucune matière ne peut être rattachée à cette classe.
--
-- ⚠ EXÉCUTION EN DEUX TEMPS
-- PostgreSQL refuse d'utiliser une valeur d'enum dans la même transaction que
-- sa création (« unsafe use of new value of enum type »). La PARTIE 1 doit
-- donc être validée avant de lancer la PARTIE 2 — même contrainte qu'en 054.
--
-- ⚠ CÔTÉ APPLICATION
-- `packages/types/src/levels.ts` doit lister la même valeur, sinon la classe
-- est rejetée par la validation applicative. Les cartes de couleurs de
-- `apps/web/src/app/(catalogue)/cours/page.tsx` et de
-- `apps/web/src/app/admin/curriculum/page.tsx` doivent également la connaître :
-- la page publique lit `LEVEL_CONFIG[v]!.label` sans repli.

-- ════════════════════ PARTIE 1 — valeur d'enum ════════════════════
alter type study_level add value if not exists 'bac_r';

-- ════════════════════ PARTIE 2 — série ════════════════════
-- (à exécuter après validation de la partie 1)
--
-- L'intitulé complet de la spécialité n'est pas donné par le programme reçu :
-- on s'en tient à « Série R », comme pour BG en migration 054, plutôt que
-- d'inventer un libellé.
insert into public.series (code, label, track, level, country_code) values
  ('R', 'Série R', 'technique', 'bac_r', 'CG')
on conflict (code, track, level, country_code) do nothing;
