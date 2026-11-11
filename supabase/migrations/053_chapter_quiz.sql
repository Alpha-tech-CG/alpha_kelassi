-- Migration 053 : QCM rattaché à un chapitre
--
-- Jusqu'ici un QCM ne pouvait viser qu'une MATIÈRE (`quizzes.subject_id`).
-- Le bloc « quiz » d'un chapitre, lui, n'était que du texte Markdown dans
-- `lessons.content` : les questions s'affichaient, mais sans correction, sans
-- score et sans chrono — rien n'était corrigé ni comptabilisé.
--
-- On relie donc les vrais QCM (quizzes + quiz_questions, avec leur moteur de
-- soumission anti-triche déjà en place) à un chapitre, pour offrir « le QCM
-- qui vient après le chapitre » avec correction automatique.
--
-- `chapter_id` est NULLABLE : les 50 QCM existants, rattachés à une matière ou
-- à une annale, continuent de fonctionner sans modification.

alter table public.quizzes
  add column if not exists chapter_id uuid references public.chapters(id) on delete cascade;

create index if not exists idx_quizzes_chapter on public.quizzes(chapter_id);

-- Un seul QCM de fin de chapitre par chapitre : l'index partiel laisse
-- coexister autant de QCM de matière/annale que voulu (chapter_id null), tout
-- en empêchant les doublons créés par un double clic dans la console admin.
create unique index if not exists idx_quizzes_one_per_chapter
  on public.quizzes(chapter_id)
  where chapter_id is not null;

comment on column public.quizzes.chapter_id is
  'Chapitre dont ce QCM est l''évaluation de fin. NULL pour les QCM de matière et les annales.';

-- Aucune policy à ajouter : celles de la migration 011 (lecture élève avec
-- filtre premium, écriture réservée aux admins) couvrent déjà ces lignes.
