-- Migration 013 : index de performance + RPC analytics

-- Index manquant pour le rapport "utilisateurs actifs par matière"
CREATE INDEX IF NOT EXISTS idx_user_progress_subject_active
  ON public.user_progress(subject_id, last_active DESC);

-- Index pour accélérer la requête des vues sur les 7 derniers jours
CREATE INDEX IF NOT EXISTS idx_document_views_viewed_at
  ON public.document_views(viewed_at DESC);

-- Fonction RPC : top 10 documents les plus vus sur 7 jours (agrégation SQL)
CREATE OR REPLACE FUNCTION public.top_documents_7days(p_limit int DEFAULT 10)
RETURNS TABLE(
  document_id  uuid,
  view_count   bigint,
  title        text,
  type         text,
  level        text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT
    dv.document_id,
    COUNT(*)          AS view_count,
    d.title,
    d.type,
    d.level
  FROM public.document_views dv
  JOIN public.documents d ON d.id = dv.document_id
  WHERE dv.viewed_at >= NOW() - INTERVAL '7 days'
  GROUP BY dv.document_id, d.title, d.type, d.level
  ORDER BY view_count DESC
  LIMIT p_limit;
$$;
