-- Alpha Kelassi V2 — Système de correction par tuteurs humains (BLOC B)
-- Migration 032 : profils tuteurs, missions, solutions, litiges, notes, wallet.
--
-- Modèle de sécurité :
--   • RLS activé partout. Les CLIENTS (anon/authenticated) n'ont que des
--     policies SELECT (voir ses propres lignes / celles qui le concernent).
--   • TOUTES les écritures du workflow (création mission, acceptation, statut,
--     récompense, verdict IA) passent par l'API Hono avec le SERVICE ROLE, qui
--     bypass RLS après validation serveur du userId (cf. lib/xp.ts). Aucune
--     policy INSERT/UPDATE n'est accordée aux clients → écriture directe
--     PostgREST refusée par défaut (defense-in-depth contre l'escalade).
--   • Les admins ont un accès total via une policy `for all`.

-- ── Types ────────────────────────────────────────────────────────────────────
create type mission_status as enum (
  'pending',    -- créée, en attente d'un tuteur
  'assigned',   -- acceptée par un tuteur, correction en cours
  'submitted',  -- solution soumise, vérification IA en cours
  'delivered',  -- correction validée et livrée à l'élève
  'failed',     -- 2 échecs / délai dépassé → l'IA a pris le relais
  'disputed'    -- contestée par l'élève
);

create type solution_ai_status as enum ('pending', 'ok', 'error');
create type wallet_txn_type    as enum ('credit', 'withdrawal');
create type wallet_txn_status  as enum ('pending', 'completed', 'rejected');

-- ── Profils tuteurs ─────────────────────────────────────────────────────────
create table public.tutor_profiles (
  user_id        uuid primary key references public.users(id) on delete cascade,
  bio            text,
  id_doc_url     text,                       -- CNI (bucket privé admin)
  bac_doc_url    text,                       -- diplôme / attestation BAC
  is_verified    boolean not null default false,
  verified_at    timestamptz,
  score          numeric(5, 2) not null default 0,   -- 0.00 → 5.00
  wallet_balance integer not null default 0,          -- FCFA (entier)
  is_active      boolean not null default true,       -- dispo pour recevoir des missions
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create trigger set_updated_at before update on public.tutor_profiles
  for each row execute function public.set_updated_at();

-- Matières validées par le tuteur (dispatch filtré dessus)
create table public.tutor_subjects (
  tutor_id   uuid not null references public.tutor_profiles(user_id) on delete cascade,
  subject_id uuid not null references public.subjects(id) on delete cascade,
  primary key (tutor_id, subject_id)
);

-- ── Missions de correction ──────────────────────────────────────────────────
create table public.correction_missions (
  id           uuid primary key default gen_random_uuid(),
  student_id   uuid not null references public.users(id) on delete cascade,
  tutor_id     uuid references public.users(id) on delete set null,
  subject_id   uuid not null references public.subjects(id) on delete restrict,
  exercise_url text not null,                  -- énoncé (photo)
  work_url     text not null,                  -- travail manuscrit élève
  status       mission_status not null default 'pending',
  accepted_at  timestamptz,
  due_at       timestamptz,
  delivered_at timestamptz,
  attempts     smallint not null default 0,
  reward_fcfa  integer not null default 0,
  ai_verdict   text,
  created_at   timestamptz not null default now()
);

create index correction_missions_student_idx on public.correction_missions(student_id, created_at desc);
create index correction_missions_tutor_idx   on public.correction_missions(tutor_id, status);
create index correction_missions_pending_idx on public.correction_missions(subject_id) where status = 'pending';

-- Solutions soumises par les tuteurs (une par tentative)
create table public.correction_solutions (
  id           uuid primary key default gen_random_uuid(),
  mission_id   uuid not null references public.correction_missions(id) on delete cascade,
  attempt      smallint not null,
  photo_url    text not null,
  ai_status    solution_ai_status not null default 'pending',
  ai_feedback  text,
  submitted_at timestamptz not null default now(),
  unique (mission_id, attempt)
);

create index correction_solutions_mission_idx on public.correction_solutions(mission_id);

-- Litiges élève
create table public.correction_disputes (
  id             uuid primary key default gen_random_uuid(),
  mission_id     uuid not null references public.correction_missions(id) on delete cascade,
  student_id     uuid not null references public.users(id) on delete cascade,
  description    text not null,
  ai_explanation text,
  resolved_at    timestamptz,
  created_at     timestamptz not null default now()
);

create index correction_disputes_mission_idx on public.correction_disputes(mission_id);

-- Notes des tuteurs (une par mission)
create table public.tutor_ratings (
  id         uuid primary key default gen_random_uuid(),
  mission_id uuid not null unique references public.correction_missions(id) on delete cascade,
  student_id uuid not null references public.users(id) on delete cascade,
  tutor_id   uuid not null references public.users(id) on delete cascade,
  clarity    smallint not null check (clarity between 1 and 5),
  quality    smallint not null check (quality between 1 and 5),
  comment    text,
  created_at timestamptz not null default now()
);

create index tutor_ratings_tutor_idx on public.tutor_ratings(tutor_id);

-- Portefeuille tuteur
create table public.tutor_wallet_transactions (
  id          uuid primary key default gen_random_uuid(),
  tutor_id    uuid not null references public.users(id) on delete cascade,
  mission_id  uuid references public.correction_missions(id) on delete set null,
  amount_fcfa integer not null,
  type        wallet_txn_type not null,
  status      wallet_txn_status not null default 'completed',
  created_at  timestamptz not null default now()
);

create index tutor_wallet_tx_tutor_idx on public.tutor_wallet_transactions(tutor_id, created_at desc);

-- ── Fonction d'incrément atomique du portefeuille ────────────────────────────
-- Appelée uniquement côté serveur (service role) après validation d'une
-- correction. Révoquée de anon/authenticated (cf. durcissement migr. 024).
create or replace function public.increment_tutor_wallet(p_tutor_id uuid, p_amount integer)
returns void
language sql
security definer
set search_path = public
as $$
  update public.tutor_profiles
  set wallet_balance = wallet_balance + p_amount
  where user_id = p_tutor_id;
$$;

revoke execute on function public.increment_tutor_wallet(uuid, integer) from anon, authenticated;

-- ── RLS ──────────────────────────────────────────────────────────────────────
alter table public.tutor_profiles            enable row level security;
alter table public.tutor_subjects            enable row level security;
alter table public.correction_missions       enable row level security;
alter table public.correction_solutions      enable row level security;
alter table public.correction_disputes       enable row level security;
alter table public.tutor_ratings             enable row level security;
alter table public.tutor_wallet_transactions enable row level security;

-- tutor_profiles : le tuteur voit son profil ; admin voit tout.
create policy "tutor_profiles: owner read" on public.tutor_profiles
  for select using (user_id = auth.uid());
create policy "tutor_profiles: admin all" on public.tutor_profiles
  for all using (public.current_user_role() = 'admin')
  with check (public.current_user_role() = 'admin');

-- tutor_subjects : le tuteur voit ses matières ; admin tout.
create policy "tutor_subjects: owner read" on public.tutor_subjects
  for select using (tutor_id = auth.uid());
create policy "tutor_subjects: admin all" on public.tutor_subjects
  for all using (public.current_user_role() = 'admin')
  with check (public.current_user_role() = 'admin');

-- correction_missions : l'élève voit ses missions, le tuteur assigné les siennes.
create policy "missions: student read" on public.correction_missions
  for select using (student_id = auth.uid());
create policy "missions: assigned tutor read" on public.correction_missions
  for select using (tutor_id = auth.uid());
create policy "missions: admin all" on public.correction_missions
  for all using (public.current_user_role() = 'admin')
  with check (public.current_user_role() = 'admin');

-- correction_solutions : lisible par l'élève et le tuteur de la mission.
create policy "solutions: mission parties read" on public.correction_solutions
  for select using (
    exists (
      select 1 from public.correction_missions m
      where m.id = correction_solutions.mission_id
        and (m.student_id = auth.uid() or m.tutor_id = auth.uid())
    )
  );
create policy "solutions: admin all" on public.correction_solutions
  for all using (public.current_user_role() = 'admin')
  with check (public.current_user_role() = 'admin');

-- correction_disputes : l'élève voit ses litiges ; admin tout.
create policy "disputes: student read" on public.correction_disputes
  for select using (student_id = auth.uid());
create policy "disputes: admin all" on public.correction_disputes
  for all using (public.current_user_role() = 'admin')
  with check (public.current_user_role() = 'admin');

-- tutor_ratings : élève auteur et tuteur concerné peuvent lire.
create policy "ratings: parties read" on public.tutor_ratings
  for select using (student_id = auth.uid() or tutor_id = auth.uid());
create policy "ratings: admin all" on public.tutor_ratings
  for all using (public.current_user_role() = 'admin')
  with check (public.current_user_role() = 'admin');

-- tutor_wallet_transactions : le tuteur voit son historique ; admin tout.
create policy "wallet: owner read" on public.tutor_wallet_transactions
  for select using (tutor_id = auth.uid());
create policy "wallet: admin all" on public.tutor_wallet_transactions
  for all using (public.current_user_role() = 'admin')
  with check (public.current_user_role() = 'admin');
