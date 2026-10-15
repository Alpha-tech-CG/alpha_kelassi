-- Retour arrière de la migration 062.
--
-- La migration n'ajoute que des colonnes, des déclencheurs et des index : rien
-- n'est supprimé ni réécrit côté contenu. Ce retour arrière est donc sans
-- perte de données — l'application mobile se contentera, faute de colonne, de
-- retélécharger le programme entier au lieu des seules nouveautés.

begin;

drop trigger if exists set_updated_at on public.subjects;
drop trigger if exists set_updated_at on public.chapters;
drop trigger if exists set_updated_at on public.lessons;
drop trigger if exists set_updated_at on public.exercises;
drop trigger if exists set_updated_at on public.exercise_solutions;

drop index if exists public.idx_chapters_updated_at;
drop index if exists public.idx_lessons_updated_at;
drop index if exists public.idx_exercises_updated_at;

alter table public.subjects           drop column if exists updated_at;
alter table public.chapters           drop column if exists updated_at;
alter table public.lessons            drop column if exists updated_at;
alter table public.exercises          drop column if exists updated_at;
alter table public.exercise_solutions drop column if exists updated_at;

commit;
