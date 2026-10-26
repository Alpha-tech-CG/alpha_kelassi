-- Test de la migration 072 (bucket `images` sans écriture client).
-- À exécuter APRÈS 072, dans l'éditeur SQL Supabase. Lecture seule.

do $$
begin
  if exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects'
      and cmd in ('INSERT', 'UPDATE', 'ALL')
      and (coalesce(qual, '') ilike '%''images''%' or coalesce(with_check, '') ilike '%''images''%')
  ) then
    raise exception 'M5 : une politique d''écriture subsiste sur le bucket images';
  end if;
  raise notice 'Test 072 : OK';
end $$;
