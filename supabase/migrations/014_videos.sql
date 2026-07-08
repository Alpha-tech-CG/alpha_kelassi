-- Migration 014 : Cours vidéo (liens externes YouTube/Vimeo)
-- Aucun stockage ni encodage : on ne garde que les métadonnées + l'ID externe.
-- Le lecteur (iframe web / app YouTube sur mobile) gère l'adaptation au débit.

create type video_provider as enum ('youtube', 'vimeo');

create table if not exists public.videos (
  id            uuid primary key default gen_random_uuid(),
  subject_id    uuid not null references public.subjects(id) on delete cascade,
  title         text not null,
  description   text,
  level         study_level not null,
  provider      video_provider not null default 'youtube',
  external_id   text not null,                 -- ex. 'dQw4w9WgXcQ'
  url           text not null,                 -- URL d'origine (fallback / ouverture externe)
  duration_sec  integer,
  thumbnail_url text,
  is_premium    boolean not null default false,
  created_at    timestamptz not null default now()
);

create index if not exists idx_videos_subject on public.videos(subject_id, level);

-- RLS : lecture libre (free) + premium selon le plan ; écriture admin (comme documents)
alter table public.videos enable row level security;

create policy "videos: select free content" on public.videos
  for select using (
    auth.uid() is not null
    and (is_premium = false or public.current_user_plan() = 'premium')
  );
create policy "videos: admin only write" on public.videos
  for all using (public.current_user_role() = 'admin');
