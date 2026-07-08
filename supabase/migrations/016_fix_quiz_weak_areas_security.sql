-- Migration 016 : corrige une fuite de données sur la vue quiz_weak_areas.
--
-- Sans `security_invoker`, une vue Postgres s'exécute avec les droits de son
-- propriétaire (le rôle des migrations, qui bypass RLS) et non ceux de
-- l'appelant. Résultat : n'importe quel utilisateur authentifié pouvait
-- interroger /rest/v1/quiz_weak_areas directement et voir les points faibles
-- de TOUS les élèves, la protection .eq('user_id', ...) n'existant que
-- côté code applicatif (routes web/mobile), pas au niveau de la base.
--
-- `security_invoker = true` force la vue à s'exécuter avec les droits de
-- l'appelant : les RLS de quiz_attempts / quiz_attempt_answers
-- ("select own") s'appliquent alors normalement et limitent chaque
-- utilisateur à ses propres données, quel que soit le point d'entrée
-- (route applicative ou appel direct à l'API REST Supabase).

drop view if exists public.quiz_weak_areas;

create view public.quiz_weak_areas
with (security_invoker = true)
as
select
  qa.user_id,
  s.id   as subject_id,
  s.name as subject_name,
  count(*)                             as answered,
  count(*) filter (where not ans.is_correct) as wrong,
  round(
    100.0 * count(*) filter (where not ans.is_correct) / nullif(count(*), 0)
  )::int as error_rate
from public.quiz_attempt_answers ans
join public.quiz_attempts qa on qa.id = ans.attempt_id
join public.quiz_questions qq on qq.id = ans.question_id
join public.quizzes qz on qz.id = qq.quiz_id
join public.subjects s on s.id = qz.subject_id
group by qa.user_id, s.id, s.name;
