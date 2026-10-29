-- Alpha Kelassi V2 — Phase 6 : enseignants (BLOC C.3)
-- Migration 041
--
-- Miroir du système tuteur (migr. 032) : profil enseignant validé par l'admin,
-- + rôles dans les groupes. Documents privés (CNI + justificatif) dans un
-- bucket admin-only. Écritures via service role (API) après validation serveur.

create table public.teacher_profiles (
  user_id                  uuid primary key references public.users(id) on delete cascade,
  school                   text,
  id_doc_url               text,
  teaching_certificate_url text,
  is_verified              boolean not null default false,
  verified_at              timestamptz,
  created_at               timestamptz not null default now()
);

create table public.teacher_group_roles (
  teacher_id        uuid not null references public.teacher_profiles(user_id) on delete cascade,
  group_id          uuid not null references public.study_groups(id) on delete cascade,
  can_post_resources boolean not null default true,
  can_launch_quiz    boolean not null default true,
  can_moderate       boolean not null default true,
  primary key (teacher_id, group_id)
);

alter table public.teacher_profiles    enable row level security;
alter table public.teacher_group_roles enable row level security;

create policy "teacher_profiles: owner read" on public.teacher_profiles
  for select using (user_id = auth.uid());
create policy "teacher_profiles: admin all" on public.teacher_profiles
  for all using (public.current_user_role() = 'admin') with check (public.current_user_role() = 'admin');

create policy "teacher_roles: owner read" on public.teacher_group_roles
  for select using (teacher_id = auth.uid());
create policy "teacher_roles: admin all" on public.teacher_group_roles
  for all using (public.current_user_role() = 'admin') with check (public.current_user_role() = 'admin');

-- Bucket privé des documents enseignants (CNI + justificatif d'enseignement).
insert into storage.buckets (id, name, public) values ('teacher-documents', 'teacher-documents', false)
on conflict (id) do nothing;

create policy "teacher-documents: admin read" on storage.objects
  for select using (bucket_id = 'teacher-documents' and public.current_user_role() = 'admin');
create policy "teacher-documents: owner write" on storage.objects
  for insert with check (bucket_id = 'teacher-documents' and auth.uid()::text = (storage.foldername(name))[1]);
