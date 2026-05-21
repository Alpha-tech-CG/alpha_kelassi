-- Migration 009 : Onboarding & Programme beta (Sprint S12)

-- Préférences onboarding sur le profil utilisateur
alter table public.users
  add column if not exists onboarding_completed boolean not null default false,
  add column if not exists study_level_pref     study_level,
  add column if not exists subject_ids_pref     uuid[] default '{}';

-- Feedbacks beta utilisateurs
create table if not exists public.beta_feedback (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references public.users(id) on delete set null,
  rating      smallint not null check (rating between 1 and 5),
  comment     text,
  page        text,          -- page depuis laquelle le feedback est envoyé
  app_version text,
  created_at  timestamptz not null default now()
);

create index if not exists idx_beta_feedback_created on public.beta_feedback(created_at desc);

-- RLS beta_feedback
alter table public.beta_feedback enable row level security;
create policy "user insère son feedback"
  on public.beta_feedback for insert
  with check (auth.uid() = user_id or user_id is null);
create policy "admin lit tout"
  on public.beta_feedback for select
  using (
    exists (select 1 from public.users where id = auth.uid() and role = 'admin')
  );
