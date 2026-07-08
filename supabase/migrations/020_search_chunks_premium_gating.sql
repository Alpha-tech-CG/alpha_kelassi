-- Migration 020 : ajoute le filtrage premium à search_chunks().
--
-- search_chunks() est SECURITY DEFINER (nécessaire : bypass RLS pour
-- chercher dans tout document_chunks) et n'a jamais eu AUCUN filtrage par
-- statut premium — n'importe qui pouvait récupérer le contenu de cours
-- payants via le tuteur IA.
--
-- On ne peut PAS gater via auth.uid()/current_user_plan() ici : le web
-- (getAdmin()) et l'API (désormais via c.get('supabase') mais le RAG
-- reste un appel serveur orchestré) n'ont pas forcément auth.uid() défini
-- au moment de l'appel. Le vrai statut premium de l'utilisateur est déjà
-- connu par le code appelant (web/api récupèrent profile.plan avant
-- d'appeler la recherche) — on le fait donc transiter en paramètre
-- explicite plutôt que de dépendre du rôle Postgres qui exécute la requête.

-- Postgres distingue les fonctions par signature complète : un simple
-- `create or replace` avec un paramètre en plus crée une SURCHARGE au lieu
-- de remplacer l'ancienne, rendant les appels à 4 arguments ambigus côté
-- PostgREST. On supprime explicitement l'ancienne signature d'abord.
drop function if exists public.search_chunks(vector, integer, double precision, uuid);

create or replace function public.search_chunks(
  query_embedding vector,
  match_count integer default 5,
  min_similarity double precision default 0.72,
  filter_document uuid default null,
  p_include_premium boolean default false
)
returns table(
  id uuid,
  document_id uuid,
  content text,
  chunk_index integer,
  page_number integer,
  metadata jsonb,
  similarity double precision
)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  return query
  select
    c.id,
    c.document_id,
    c.content,
    c.chunk_index::integer,
    c.page_number,
    c.metadata,
    1 - (c.embedding <=> query_embedding) as similarity
  from public.document_chunks c
  join public.documents d on d.id = c.document_id
  where
    (filter_document is null or c.document_id = filter_document)
    and (d.is_premium = false or p_include_premium = true)
    and 1 - (c.embedding <=> query_embedding) >= min_similarity
  order by c.embedding <=> query_embedding
  limit match_count;
end;
$$;
