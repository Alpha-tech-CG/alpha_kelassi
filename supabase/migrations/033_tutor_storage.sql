-- Alpha Kelassi V2 — Buckets Storage du système tuteurs
-- Migration 033
--
-- Convention de chemin : `<user_id>/<fichier>` → la 1re partie du chemin est
-- l'UID du propriétaire. Les policies n'autorisent l'accès direct qu'au
-- propriétaire de son dossier. Les accès inter-parties (le tuteur assigné qui
-- consulte le travail de l'élève, l'élève qui consulte la solution du tuteur)
-- sont servis par l'API via des URLs signées (createSignedUrl, service role),
-- ce qui garde ces policies simples et infaillibles.

insert into storage.buckets (id, name, public) values
  ('exercise-photos', 'exercise-photos', false),
  ('student-work',    'student-work',    false),
  ('tutor-solutions', 'tutor-solutions', false),
  ('tutor-documents', 'tutor-documents', false)
on conflict (id) do nothing;

-- ── exercise-photos / student-work / tutor-solutions : propriétaire uniquement ──
do $$
declare b text;
begin
  foreach b in array array['exercise-photos', 'student-work', 'tutor-solutions']
  loop
    execute format($p$
      create policy "%1$s: owner read" on storage.objects
        for select using (
          bucket_id = %1$L
          and auth.uid()::text = (storage.foldername(name))[1]
        );
    $p$, b);

    execute format($p$
      create policy "%1$s: owner write" on storage.objects
        for insert with check (
          bucket_id = %1$L
          and auth.uid()::text = (storage.foldername(name))[1]
        );
    $p$, b);

    execute format($p$
      create policy "%1$s: owner delete" on storage.objects
        for delete using (
          bucket_id = %1$L
          and auth.uid()::text = (storage.foldername(name))[1]
        );
    $p$, b);
  end loop;
end $$;

-- ── tutor-documents : ADMIN uniquement (CNI + diplômes, données sensibles) ─────
create policy "tutor-documents: admin read" on storage.objects
  for select using (
    bucket_id = 'tutor-documents' and public.current_user_role() = 'admin'
  );

-- Le tuteur téléverse ses propres pièces dans son dossier (write seul, pas read).
create policy "tutor-documents: owner write" on storage.objects
  for insert with check (
    bucket_id = 'tutor-documents'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
