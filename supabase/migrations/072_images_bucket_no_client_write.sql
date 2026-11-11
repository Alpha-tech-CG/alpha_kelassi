-- 072 — Bucket public `images` : plus d'écriture client (audit sécurité du 26/10/2026, M5).
--
-- Avant : la politique "images: authenticated write" (003) laissait n'importe
-- quel compte déposer des fichiers dans ce bucket PUBLIC, sans dossier propre :
-- hébergement d'images publiques (contenu inapproprié, hameçonnage) sous le
-- domaine Supabase du projet, sur une plateforme destinée à des mineurs.
--
-- Après : aucune écriture côté client. Le bucket est vide et aucun code web ni
-- mobile n'y écrit (les téléversements de l'app vont dans des buckets privés,
-- dossier = UID ; les images de cours passent par `course-images` côté admin).
-- Le bucket est conservé : s'il resservait, recréer une politique limitée à
-- `(storage.foldername(name))[1] = auth.uid()::text` ou aux admins.

drop policy if exists "images: authenticated write" on storage.objects;
