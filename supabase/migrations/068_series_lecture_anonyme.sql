-- 068 — Liste des classes lisible avant connexion
--
-- Le questionnaire d'inscription de l'app (067) fait choisir la classe avant
-- la création du compte : la politique de `series` ne visait que le rôle
-- authenticated, la liste revenait vide. Même filtre (classes ouvertes aux
-- élèves, migration 064) pour les visiteurs ; c'est un simple catalogue.

drop policy if exists series_anon_read on public.series;
create policy series_anon_read on public.series
  for select to anon
  using (public.level_is_visible(level));
