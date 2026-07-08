-- Migration 013 : Messagerie sortante WhatsApp / SMS + rappels de révision
-- WhatsApp Business Cloud API (canal principal) avec repli SMS (Africa's Talking).

-- Préférences de rappel sur le profil utilisateur
alter table public.users
  add column if not exists whatsapp_opt_in boolean not null default false,
  add column if not exists reminder_hour   smallint not null default 18;  -- heure locale (0-23) du rappel quotidien

-- Journal des messages sortants : audit + idempotence (évite les doublons)
create table if not exists public.message_log (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references public.users(id) on delete cascade,
  channel     text not null check (channel in ('whatsapp', 'sms')),
  template    text not null,                 -- ex. 'revision_reminder'
  to_phone    text not null,
  body        text,
  status      text not null default 'sent'   check (status in ('sent', 'failed', 'delivered', 'read')),
  provider_id text,                           -- id retourné par Meta / Africa's Talking
  dedup_key   text unique,                    -- ex. 'reminder:<user>:<date>' — garantit l'unicité
  created_at  timestamptz not null default now()
);

create index if not exists idx_message_log_user on public.message_log(user_id, created_at desc);

-- RLS : l'utilisateur lit ses propres messages, l'admin voit tout.
-- Les écritures se font côté serveur (service role, qui bypass RLS).
alter table public.message_log enable row level security;

create policy "message_log: select own" on public.message_log
  for select using (
    user_id = auth.uid()
    or public.current_user_role() = 'admin'
  );
