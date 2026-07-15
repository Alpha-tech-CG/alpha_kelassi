-- Alpha Kelassi — Durcissement sécurité (audit, points faibles)
-- Migration 025 : buckets publics + quiz_attempts.

-- Les objets des buckets publics restent servis par URL publique (getPublicUrl)
-- sans policy SELECT. On retire les policies de listing large pour empêcher
-- l'énumération de tous les fichiers.
drop policy if exists "course_images_read"   on storage.objects;
drop policy if exists "images: read all"      on storage.objects;
drop policy if exists "pdfs-public: read all" on storage.objects;

-- quiz_attempts : créées uniquement via la RPC submit_quiz_attempt
-- (SECURITY DEFINER, bypass RLS). On retire l'insertion directe pour empêcher
-- la fabrication de fausses tentatives.
drop policy if exists "quiz_attempts: insert own" on public.quiz_attempts;
