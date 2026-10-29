-- Migration 062 : horodatage des contenus pour la synchronisation hors-ligne
--
-- L'application mobile télécharge le programme pour le lire sans réseau. Sans
-- date de dernière modification, elle ne peut pas savoir ce qui a changé : le
-- bouton « Télécharger pour hors-ligne » retélécharge donc TOUT le programme
-- à chaque fois, images comprises — coûteux sur une connexion mobile payante.
--
-- On ajoute `updated_at` aux tables de contenu, maintenu par le déclencheur
-- `set_updated_at()` déjà en place depuis la migration 001, et un index pour
-- interroger les seules lignes modifiées depuis la dernière synchronisation.
--
-- Les suppressions sont déjà traçables : `deleted_at` existe sur `exercises`
-- et `quizzes` (migration 058). Les chapitres et les leçons, eux, sont
-- réellement supprimés : l'application retire du téléphone ce qui n'est plus
-- renvoyé par le serveur lors d'une synchronisation complète.
--
-- Sans risque pour l'existant : colonnes ajoutées avec une valeur par défaut,
-- aucune politique RLS touchée, aucune donnée réécrite hors de l'initialisation.

begin;

alter table public.subjects           add column if not exists updated_at timestamptz not null default now();
alter table public.chapters           add column if not exists updated_at timestamptz not null default now();
alter table public.lessons            add column if not exists updated_at timestamptz not null default now();
alter table public.exercises          add column if not exists updated_at timestamptz not null default now();
alter table public.exercise_solutions add column if not exists updated_at timestamptz not null default now();

-- Initialisation : on part de la date de création, pour que la première
-- synchronisation incrémentale ne considère pas tout comme « modifié ».
update public.subjects           set updated_at = created_at where created_at is not null and updated_at > created_at;
update public.chapters           set updated_at = created_at where created_at is not null and updated_at > created_at;
update public.lessons            set updated_at = created_at where created_at is not null and updated_at > created_at;
update public.exercises          set updated_at = created_at where created_at is not null and updated_at > created_at;
update public.exercise_solutions set updated_at = created_at where created_at is not null and updated_at > created_at;

drop trigger if exists set_updated_at on public.subjects;
create trigger set_updated_at before update on public.subjects
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at on public.chapters;
create trigger set_updated_at before update on public.chapters
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at on public.lessons;
create trigger set_updated_at before update on public.lessons
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at on public.exercises;
create trigger set_updated_at before update on public.exercises
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at on public.exercise_solutions;
create trigger set_updated_at before update on public.exercise_solutions
  for each row execute function public.set_updated_at();

-- Index des seules lignes récentes : la synchronisation demande
-- « ce qui a changé depuis telle date », jamais la table entière.
create index if not exists idx_chapters_updated_at  on public.chapters(updated_at);
create index if not exists idx_lessons_updated_at   on public.lessons(updated_at);
create index if not exists idx_exercises_updated_at on public.exercises(updated_at);

commit;
