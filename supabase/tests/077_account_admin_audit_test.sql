-- Tests de la migration 077 (journal des actions sur les comptes).
--
-- À exécuter APRÈS 077. Tout se déroule dans une transaction annulée ; le
-- script se termine volontairement sur l'exception TESTS_077_OK, qui garantit
-- l'annulation. Toute autre erreur signale un échec.

begin;

do $$
declare
  ok boolean;
begin
  -- Ni anon ni un élève ne peuvent écrire dans le journal.
  if has_table_privilege('anon', 'public.account_admin_audit', 'insert')
     or has_table_privilege('authenticated', 'public.account_admin_audit', 'insert')
     or has_table_privilege('authenticated', 'public.account_admin_audit', 'update')
     or has_table_privilege('authenticated', 'public.account_admin_audit', 'delete')
     or has_table_privilege('anon', 'public.account_admin_audit', 'select') then
    raise exception '077 droits trop larges sur account_admin_audit';
  end if;

  -- RLS active, lecture réservée aux admins.
  if not (select relrowsecurity from pg_class where oid = 'public.account_admin_audit'::regclass) then
    raise exception '077 RLS inactive';
  end if;

  -- Motif obligatoire (5 caractères minimum).
  ok := false;
  begin
    insert into public.account_admin_audit (action, reason) values ('ban', '  ab ');
  exception when check_violation then ok := true;
  end;
  if not ok then raise exception '077 motif trop court accepté'; end if;

  -- Action inconnue refusée.
  ok := false;
  begin
    insert into public.account_admin_audit (action, reason) values ('delete_everything', 'motif valide');
  exception when check_violation then ok := true;
  end;
  if not ok then raise exception '077 action inconnue acceptée'; end if;

  -- Une ligne valide passe (service role).
  insert into public.account_admin_audit (action, reason, user_email, detail)
  values ('ban', 'Test de la migration 077', 'test@exemple.cg', '{"source":"test"}');

  raise exception 'TESTS_077_OK';
end $$;

rollback;
