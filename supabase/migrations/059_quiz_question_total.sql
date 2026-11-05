-- Migration 059 : nombre réel de questions d'un QCM, lisible par l'élève
--
-- L'espace Prépa doit cacher les épreuves encore vides (créées dans la console
-- mais sans questions). Or l'élève Gratuit ne voit pas les questions d'une
-- épreuve (RLS) : `quiz_questions(count)` lui renverrait 0 partout. Cette
-- colonne calculée PostgREST (`select('id, question_total')`) compte côté
-- serveur sans exposer les questions elles-mêmes.

create or replace function public.question_total(q public.quizzes)
returns integer
language sql
stable
security definer
set search_path = public
as $$
  select count(*)::int from public.quiz_questions where quiz_id = q.id
$$;

comment on function public.question_total(public.quizzes) is
  'Colonne calculée PostgREST : nombre réel de questions d''un QCM, même quand la formule de l''élève masque les questions (RLS). Sert à cacher les épreuves encore vides.';

revoke execute on function public.question_total(public.quizzes) from public, anon;
grant execute on function public.question_total(public.quizzes) to authenticated, service_role;
