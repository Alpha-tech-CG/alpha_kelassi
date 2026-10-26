-- 077 — Journal des actions de la console sur les comptes (26/10/2026).
--
-- La console admin peut désormais créer un compte pour un élève, l'aider à se
-- connecter (confirmer son e-mail, lui donner un mot de passe provisoire)
-- et bannir ou débannir un compte. Chaque action est tracée ici : qui,
-- quoi, sur quel compte, quand et pourquoi.
--
-- L'état du compte (banni, e-mail confirmé, dernière connexion) n'est PAS
-- recopié dans public.users : il est lu dans Supabase Auth (auth.users), qui
-- applique lui-même le bannissement (connexion et renouvellement de session
-- refusés). Même modèle que subscription_admin_audit (migration 057) : écrit
-- par l'API avec la clé de service, lisible des seuls admins.

create table if not exists public.account_admin_audit (
  id         uuid primary key default gen_random_uuid(),
  admin_id   uuid references public.users(id) on delete set null,
  -- Garde la trace même si le compte est supprimé plus tard.
  user_id    uuid references public.users(id) on delete set null,
  user_email text,
  action     text not null check (action in ('create', 'ban', 'unban', 'confirm_email', 'reset_password')),
  reason     text not null check (char_length(trim(reason)) >= 5 and char_length(reason) <= 500),
  detail     jsonb not null default '{}'::jsonb check (jsonb_typeof(detail) = 'object'),
  created_at timestamptz not null default now()
);

create index if not exists account_admin_audit_user_idx on public.account_admin_audit(user_id, created_at desc);

alter table public.account_admin_audit enable row level security;

-- Supabase accorde par défaut tous les droits à anon/authenticated : on repart de zéro.
revoke all on public.account_admin_audit from public, anon, authenticated;
grant select on public.account_admin_audit to authenticated;

drop policy if exists "account_admin_audit: admin read" on public.account_admin_audit;
create policy "account_admin_audit: admin read" on public.account_admin_audit for select to authenticated
  using (public.current_user_role() = 'admin');

-- Pas de policy INSERT/UPDATE/DELETE : seule l'API (service role) écrit, et
-- le journal ne se modifie pas.
