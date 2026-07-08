-- Migration 019 : corrige un second bug pré-existant dans search_chunks().
--
-- Après l'ajout de page_number (migration 018), l'appel échouait encore :
-- "Returned type smallint does not match expected type integer in column 4"
-- (chunk_index). La fonction déclare `chunk_index integer` dans son
-- RETURNS TABLE, mais document_chunks.chunk_index est un smallint
-- (migration 001). Cast explicite pour faire correspondre les types.

create or replace function public.search_chunks(
  query_embedding vector,
  match_count integer default 5,
  min_similarity double precision default 0.72,
  filter_document uuid default null
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
  where
    (filter_document is null or c.document_id = filter_document)
    and 1 - (c.embedding <=> query_embedding) >= min_similarity
  order by c.embedding <=> query_embedding
  limit match_count;
end;
$$;
