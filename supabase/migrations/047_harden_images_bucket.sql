-- Alpha Kelassi — Durcissement sécurité (audit)
-- Migration 047 : limites sur le bucket `images`.
--
-- Le bucket `images` autorise l'écriture à tout utilisateur authentifié
-- (policy "images: authenticated write", migration 003) mais, contrairement
-- aux buckets d'upload utilisateur durcis en migration 043, il n'avait AUCUNE
-- limite de taille ni de type MIME. Un utilisateur connecté pouvait donc :
--   - saturer le stockage avec des fichiers volumineux,
--   - héberger des fichiers arbitraires (PDF, exécutables, HTML) via une URL
--     publique du domaine.
--
-- Correctif : on aligne `images` sur les autres buckets d'upload — 5 Mo max,
-- images uniquement (JPEG / PNG / WebP).

update storage.buckets
  set file_size_limit    = 5242880,                                  -- 5 Mo
      allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp']
  where id = 'images';
