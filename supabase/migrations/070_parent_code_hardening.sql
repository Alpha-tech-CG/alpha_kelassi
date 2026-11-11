-- 070 — Code de liaison parent : résistance à la force brute (audit sécurité du 26/10/2026, E1).
--
-- Avant : 6 caractères hexadécimaux (16,7 M valeurs) tirés de random(), valables
-- 24 h, et redeem_parent_code() appelable sans limite → un compte pouvait
-- essayer des codes jusqu'à se lier à un élève inconnu (données d'un mineur,
-- réglages parentaux modifiables).
--
-- Après :
--   • code tiré de gen_random_bytes (CSPRNG) dans un alphabet de 31 signes sans
--     ambiguïté (pas de I, L, O, 0, 1) : 31^6 ≈ 887 M valeurs ;
--   • validité 1 h (moins de codes actifs en même temps) ;
--   • 5 échecs par heure et par compte, puis refus TOO_MANY_ATTEMPTS.
--
-- Compatibilité APK : la longueur reste 6 (le champ de l'app installée est
-- limité à 6 caractères). Un échec ne peut pas être compté s'il lève une
-- exception (PostgREST annule alors la transaction, et l'essai avec). On renvoie
-- donc l'erreur en fixant `response.status` : la transaction est validée et
-- supabase-js expose quand même `error.message = 'CODE_INVALID'`, ce que
-- l'application installée sait déjà afficher.

-- ── Journal des essais ─────────────────────────────────────────────────────────
create table if not exists public.parent_code_attempts (
  user_id      uuid not null references public.users(id) on delete cascade,
  attempted_at timestamptz not null default now()
);
create index if not exists idx_parent_code_attempts_user
  on public.parent_code_attempts (user_id, attempted_at desc);

-- Lecture et écriture réservées aux fonctions (aucune politique client).
alter table public.parent_code_attempts enable row level security;
revoke all on public.parent_code_attempts from PUBLIC, anon, authenticated;

-- ── Codes : les clients lisent et suppriment les leurs, l'écriture passe par la RPC ──
drop policy if exists "parent_codes: own" on public.parent_link_codes;
create policy "parent_codes: read own" on public.parent_link_codes for select to authenticated
  using (child_id = auth.uid());
create policy "parent_codes: delete own" on public.parent_link_codes for delete to authenticated
  using (child_id = auth.uid());
revoke insert, update, truncate on public.parent_link_codes from PUBLIC, anon, authenticated;

-- Les codes déjà émis l'ont été avec l'ancien générateur : on les invalide.
delete from public.parent_link_codes;

-- ── Génération ─────────────────────────────────────────────────────────────────
create or replace function public.generate_parent_code()
returns text language plpgsql security definer set search_path = public, extensions as $$
declare
  v_alphabet constant text := 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  v_bytes bytea;
  v_code  text;
  i int;
begin
  if auth.uid() is null then raise exception 'AUTH_REQUIRED'; end if;

  delete from public.parent_link_codes where child_id = auth.uid() or expires_at <= now();

  loop
    v_bytes := extensions.gen_random_bytes(6);
    v_code := '';
    for i in 0..5 loop
      -- 256 n'est pas multiple de 31 : on rejette les octets >= 248 (8 × 31)
      -- pour garder un tirage uniforme.
      while get_byte(v_bytes, i) >= 248 loop
        v_bytes := set_byte(v_bytes, i, get_byte(extensions.gen_random_bytes(1), 0));
      end loop;
      v_code := v_code || substr(v_alphabet, 1 + get_byte(v_bytes, i) % 31, 1);
    end loop;
    exit when not exists (select 1 from public.parent_link_codes where code = v_code);
  end loop;

  insert into public.parent_link_codes (code, child_id, expires_at)
  values (v_code, auth.uid(), now() + interval '1 hour');
  return v_code;
end; $$;

-- ── Utilisation ────────────────────────────────────────────────────────────────
create or replace function public.redeem_parent_code(p_code text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_user  uuid := auth.uid();
  v_code  text := upper(btrim(coalesce(p_code, '')));
  v_child uuid;
  v_name  text;
begin
  if v_user is null then raise exception 'AUTH_REQUIRED'; end if;

  if (select count(*) from public.parent_code_attempts
      where user_id = v_user and attempted_at > now() - interval '1 hour') >= 5 then
    perform set_config('response.status', '429', true);
    return jsonb_build_object('code', 'P0001', 'message', 'TOO_MANY_ATTEMPTS', 'details', null, 'hint', null);
  end if;

  select child_id into v_child from public.parent_link_codes
  where code = v_code and expires_at > now();

  if v_child is null then
    insert into public.parent_code_attempts (user_id) values (v_user);
    delete from public.parent_code_attempts where attempted_at < now() - interval '1 day';
    perform set_config('response.status', '400', true);
    return jsonb_build_object('code', 'P0001', 'message', 'CODE_INVALID', 'details', null, 'hint', null);
  end if;

  if v_child = v_user then raise exception 'CODE_SELF'; end if;

  insert into public.parent_links (parent_id, child_id) values (v_user, v_child) on conflict do nothing;
  insert into public.parental_settings (child_id) values (v_child) on conflict do nothing;
  delete from public.parent_link_codes where code = v_code;
  select full_name into v_name from public.users where id = v_child;
  return jsonb_build_object('child_id', v_child, 'child_name', coalesce(v_name, 'Enfant'));
end; $$;

revoke execute on function public.generate_parent_code()   from PUBLIC, anon;
revoke execute on function public.redeem_parent_code(text) from PUBLIC, anon;
grant  execute on function public.generate_parent_code()   to authenticated;
grant  execute on function public.redeem_parent_code(text) to authenticated;
