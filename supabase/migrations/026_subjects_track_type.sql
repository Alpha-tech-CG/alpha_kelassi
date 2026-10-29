-- Migration 026: ajouter la catégorie de parcours pour les matières
-- Objectif: classer les classes/parcours en "generale" ou "technique"

do $$
begin
  if not exists (
    select 1
    from pg_type
    where typname = 'track_type'
  ) then
    create type track_type as enum ('generale', 'technique');
  end if;
end $$;

alter table public.subjects
  add column if not exists track_type track_type not null default 'generale';

create index if not exists subjects_track_type_idx on public.subjects(track_type);
