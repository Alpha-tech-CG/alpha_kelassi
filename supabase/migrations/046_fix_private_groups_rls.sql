-- Alpha Kelassi V2 — Correctif sécurité (revue) : groupes privés
-- Migration 046
--
-- Vuln HIGH (faille RLS de 037) : n'importe quel utilisateur authentifié pouvait
--   1. lister TOUS les groupes via "groups: read all" (using true), y compris
--      les groupes 'prive', et récupérer leurs UUID ;
--   2. s'auto-inscrire dans n'importe quel groupe via "members: join self"
--      (qui ne vérifiait que user_id = auth.uid()) ;
--   3. devenir membre → lire tout l'historique du chat privé (is_group_member).
--   Bonus : "members: join self" ne bornait pas la colonne role → auto-attribution
--   possible de role='admin'.
--
-- Correctif :
--   • Découverte : groupes 'prive' visibles uniquement par leurs membres/créateur.
--   • Auto-inscription : autorisée seulement dans les groupes non privés, en 'member'.
--     Le créateur du groupe garde le droit de s'y inscrire (y compris privé) avec
--     n'importe quel rôle (préserve le flux "créateur = admin" de l'app).
--   • Invitation : le créateur peut ajouter des membres à SON groupe (privé inclus).

-- ── Helpers SECURITY DEFINER (bypass RLS → pas de récursion) ──────────────────
create or replace function public.is_group_owner(gid uuid)
returns boolean language sql security definer stable set search_path = public as $$
  select exists (select 1 from public.study_groups where id = gid and created_by = auth.uid());
$$;
revoke execute on function public.is_group_owner(uuid) from anon;

create or replace function public.group_is_private(gid uuid)
returns boolean language sql security definer stable set search_path = public as $$
  select exists (select 1 from public.study_groups where id = gid and type = 'prive');
$$;
revoke execute on function public.group_is_private(uuid) from anon;

-- ── 1) Découverte : public pour tous ; privé réservé aux membres/créateur ─────
drop policy if exists "groups: read all" on public.study_groups;
drop policy if exists "groups: read public or member" on public.study_groups;
create policy "groups: read public or member" on public.study_groups for select to authenticated
  using (
    type <> 'prive'
    or created_by = auth.uid()
    or public.is_group_member(id)
  );

-- ── 2) Auto-inscription : groupes non privés en 'member' ; créateur : libre ───
drop policy if exists "members: join self" on public.group_members;
create policy "members: join self" on public.group_members for insert to authenticated
  with check (
    user_id = auth.uid()
    and (
      public.is_group_owner(group_id)
      or (role = 'member' and not public.group_is_private(group_id))
    )
  );

-- ── 3) Invitation : le créateur ajoute des membres à son groupe (privé inclus) ─
drop policy if exists "members: added by owner" on public.group_members;
create policy "members: added by owner" on public.group_members for insert to authenticated
  with check (public.is_group_owner(group_id));
