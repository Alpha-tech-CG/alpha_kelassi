-- Alpha Kelassi — Migration 011: Système de parrainage viral

-- ── Referral code unique par utilisateur ─────────────────────────────────
alter table public.users
  add column if not exists referral_code text unique;

-- Génère un code KELASSI-XXXX (charset sans ambiguïté : pas de 0/O ni 1/I/L)
create or replace function public.generate_referral_code_fn()
returns trigger language plpgsql as $$
declare
  v_chars text := 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  v_code  text;
  v_exists boolean;
begin
  loop
    v_code := 'KELASSI-' ||
      substr(v_chars, (floor(random() * length(v_chars)) + 1)::int, 1) ||
      substr(v_chars, (floor(random() * length(v_chars)) + 1)::int, 1) ||
      substr(v_chars, (floor(random() * length(v_chars)) + 1)::int, 1) ||
      substr(v_chars, (floor(random() * length(v_chars)) + 1)::int, 1);
    select exists(select 1 from public.users where referral_code = v_code) into v_exists;
    exit when not v_exists;
  end loop;
  new.referral_code := v_code;
  return new;
end;
$$;

-- Trigger BEFORE INSERT — attribue un code aux nouveaux utilisateurs
drop trigger if exists trg_assign_referral_code on public.users;
create trigger trg_assign_referral_code
  before insert on public.users
  for each row
  when (new.referral_code is null)
  execute function public.generate_referral_code_fn();

-- Génère les codes manquants pour les utilisateurs existants (idempotent)
do $$
declare
  v_chars  text := 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  v_code   text;
  v_exists boolean;
  r        record;
begin
  for r in select id from public.users where referral_code is null loop
    loop
      v_code := 'KELASSI-' ||
        substr(v_chars, (floor(random() * length(v_chars)) + 1)::int, 1) ||
        substr(v_chars, (floor(random() * length(v_chars)) + 1)::int, 1) ||
        substr(v_chars, (floor(random() * length(v_chars)) + 1)::int, 1) ||
        substr(v_chars, (floor(random() * length(v_chars)) + 1)::int, 1);
      select exists(select 1 from public.users where referral_code = v_code) into v_exists;
      exit when not v_exists;
    end loop;
    update public.users set referral_code = v_code where id = r.id;
  end loop;
end;
$$;

-- ── Table des parrainages ─────────────────────────────────────────────────
create table if not exists public.referrals (
  id              uuid primary key default uuid_generate_v4(),
  referrer_id     uuid not null references public.users(id) on delete cascade,
  referee_id      uuid not null references public.users(id) on delete cascade,
  referral_code   text not null,
  bonus_credited  boolean not null default false,
  -- Empreinte douce anti-fraude : SHA256(ip + user-agent) du referee à l'inscription
  signup_fingerprint text,
  created_at      timestamptz not null default now(),

  -- Un utilisateur ne peut être parrainé qu'une seule fois
  unique(referee_id),
  -- Empêche l'auto-parrainage au niveau DB
  check(referrer_id <> referee_id)
);

create index if not exists idx_referrals_referrer on public.referrals(referrer_id);
create index if not exists idx_referrals_code     on public.referrals(referral_code);

-- ── Table des bonus de quota journaliers (cumulables) ────────────────────
-- Stocké en Redis côté app, mais la table garde la trace pour audit
create table if not exists public.quota_bonuses (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid not null references public.users(id) on delete cascade,
  reason       text not null,       -- 'referral', 'promo'…
  bonus_amount integer not null default 5,
  bonus_date   date not null default current_date,
  referral_id  uuid references public.referrals(id),
  created_at   timestamptz not null default now(),
  -- Un seul bonus de parrainage par parrain par jour
  unique(user_id, reason, bonus_date)
);

create index if not exists idx_quota_bonuses_user on public.quota_bonuses(user_id, bonus_date);

-- ── RLS ──────────────────────────────────────────────────────────────────
alter table public.referrals enable row level security;

create policy "user voit ses parrainages" on public.referrals for select
  using (auth.uid() = referrer_id or auth.uid() = referee_id);

-- L'insert/update est fait via service_role (route API côté serveur)
create policy "service_role full access referrals" on public.referrals
  to service_role using (true) with check (true);

alter table public.quota_bonuses enable row level security;

create policy "user voit ses bonus" on public.quota_bonuses for select
  using (auth.uid() = user_id);

create policy "service_role full access bonuses" on public.quota_bonuses
  to service_role using (true) with check (true);
