-- Migration 015 : autorise les admins à modifier n'importe quel profil utilisateur.
-- Sans cette policy, la page /admin/users échouait silencieusement (RLS "update own"
-- seulement) : un admin ne pouvait pas éditer le plan/rôle des autres utilisateurs.

create policy "users: admin update all" on public.users
  for update using (public.current_user_role() = 'admin')
  with check (public.current_user_role() = 'admin');

-- Lecture : un admin doit voir tous les profils pour la console (la page /admin/users
-- charge la liste). On ajoute la lecture admin si elle n'est pas déjà couverte.
create policy "users: admin select all" on public.users
  for select using (public.current_user_role() = 'admin');
