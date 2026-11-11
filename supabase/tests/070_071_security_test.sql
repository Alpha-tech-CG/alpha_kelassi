-- Tests des migrations 070 (code parent) et 071 (récompense des défis).
--
-- À exécuter APRÈS 070 et 071, dans l'éditeur SQL Supabase (rôle postgres).
-- Tout se déroule dans une transaction annulée à la fin : aucune donnée n'est
-- conservée. Chaque vérification lève une exception explicite en cas d'échec ;
-- si le script se termine sur « ROLLBACK » sans erreur, tous les tests passent.

begin;

do $$
declare
  a   uuid := gen_random_uuid();   -- élève (enfant)
  b   uuid := gen_random_uuid();   -- parent / attaquant
  c   text;
  r   jsonb;
  i   int;
  xp0 int;
  xp1 int;
  hid uuid;
  ok  boolean := false;
begin
  -- Comptes de test (auth.users, puis profil si le déclencheur ne l'a pas créé)
  insert into auth.users (id, email) values (a, 'test-070-eleve@example.invalid'), (b, 'test-070-parent@example.invalid');
  insert into public.users (id, email) values (a, 'test-070-eleve@example.invalid'), (b, 'test-070-parent@example.invalid')
    on conflict (id) do nothing;

  -- ── 070 : génération ──
  perform set_config('request.jwt.claims', json_build_object('sub', a, 'role', 'authenticated')::text, true);
  c := public.generate_parent_code();
  if c !~ '^[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{6}$' then raise exception 'E1 format inattendu : %', c; end if;
  if (select expires_at from public.parent_link_codes where code = c) > now() + interval '61 minutes' then
    raise exception 'E1 validité supérieure à 1 h';
  end if;

  -- ── 070 : 5 échecs, puis refus même avec le bon code ──
  perform set_config('request.jwt.claims', json_build_object('sub', b, 'role', 'authenticated')::text, true);
  for i in 1..5 loop
    r := public.redeem_parent_code('ZZZZZZ');
    if r->>'message' is distinct from 'CODE_INVALID' then raise exception 'E1 échec n°% : %', i, r; end if;
  end loop;
  r := public.redeem_parent_code(c);
  if r->>'message' is distinct from 'TOO_MANY_ATTEMPTS' then raise exception 'E1 pas de blocage : %', r; end if;

  -- ── 070 : une fois le blocage levé, le bon code (en minuscules) fonctionne ──
  delete from public.parent_code_attempts where user_id = b;
  r := public.redeem_parent_code(lower(c));
  if (r->>'child_id')::uuid is distinct from a then raise exception 'E1 liaison ratée : %', r; end if;
  if exists (select 1 from public.parent_link_codes where code = c) then raise exception 'E1 code réutilisable'; end if;

  -- ── 070/071 : droits client retirés ──
  if has_table_privilege('authenticated', 'public.parent_link_codes', 'INSERT') then raise exception 'E1 INSERT client encore permis'; end if;
  if has_table_privilege('authenticated', 'public.challenge_participants', 'DELETE') then raise exception 'M1 DELETE client encore permis'; end if;
  if has_table_privilege('authenticated', 'public.challenge_participants', 'UPDATE') then raise exception 'M1 UPDATE client encore permis'; end if;

  -- ── 071 : le XP du défi hebdo n'est versé qu'une fois ──
  perform set_config('request.jwt.claims', json_build_object('sub', a, 'role', 'authenticated')::text, true);
  perform public.ensure_weekly_challenge();
  select id into hid from public.challenges where type = 'hebdo' and ends_at > now() order by starts_at desc limit 1;
  -- Objectif ramené à 1 leçon, puis une leçon terminée (annulé au ROLLBACK).
  update public.challenges set target = 1 where id = hid;
  insert into public.lesson_progress (user_id, lesson_id, completed, completed_at)
    values (a, (select id from public.lessons limit 1), true, now());
  perform public.join_challenge(hid);
  select xp into xp0 from public.users where id = a;
  perform public.list_challenges();
  select xp into xp1 from public.users where id = a;
  if xp1 - xp0 <> 100 then raise exception 'M1 premier versement attendu 100, obtenu %', xp1 - xp0; end if;

  -- L'attaque : supprimer sa participation puis rejoindre à nouveau.
  -- (Le client n'en a plus le droit ; on la simule ici en postgres.)
  delete from public.challenge_participants where challenge_id = hid and user_id = a;
  perform public.join_challenge(hid);
  perform public.list_challenges();
  select xp into xp0 from public.users where id = a;
  if xp0 <> xp1 then raise exception 'M1 XP versé deux fois (+%)', xp0 - xp1; end if;

  -- ── 071 : le défi solo d'un autre élève est refusé ──
  perform set_config('request.jwt.claims', json_build_object('sub', b, 'role', 'authenticated')::text, true);
  perform public.create_solo_challenge('Défi de B', 'lessons', 1);
  perform set_config('request.jwt.claims', json_build_object('sub', a, 'role', 'authenticated')::text, true);
  begin
    perform public.join_challenge((select id from public.challenges where type = 'solo' and created_by = b limit 1));
  exception when others then
    ok := (sqlerrm = 'CHALLENGE_NOT_FOUND');
  end;
  if not ok then raise exception 'M1 défi solo d''un autre élève accepté'; end if;

  -- ── 071 : au plus 3 défis solo en cours ──
  ok := false;
  perform public.create_solo_challenge('1', 'lessons', 1);
  perform public.create_solo_challenge('2', 'lessons', 1);
  perform public.create_solo_challenge('3', 'lessons', 1);
  begin
    perform public.create_solo_challenge('4', 'lessons', 1);
  exception when others then
    ok := (sqlerrm = 'TOO_MANY_SOLO_CHALLENGES');
  end;
  if not ok then raise exception 'M1 4e défi solo accepté'; end if;

  raise notice 'Tests 070/071 : OK';
end $$;

rollback;
