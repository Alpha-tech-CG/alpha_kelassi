-- Alpha Kelassi — Paiements tuteurs (payout FeexPay)
-- Migration 049 : retrait tuteur via FeexPay + débit wallet atomique.

-- 1. Référence de transaction FeexPay sur les mouvements de wallet (payout).
alter table public.tutor_wallet_transactions
  add column if not exists provider_ref text;

-- 2. Débit ATOMIQUE avec plancher — corrige le TOCTOU de `increment_tutor_wallet`
--    (lecture du solde puis débit séparés → double retrait possible sous course).
--    Un seul UPDATE conditionnel, verrouillage de ligne implicite :
--      - solde suffisant  → débite et renvoie le nouveau solde,
--      - solde insuffisant → aucune ligne modifiée, renvoie NULL.
create or replace function public.debit_tutor_wallet(p_tutor_id uuid, p_amount integer)
returns integer
language sql
security definer
set search_path = public
as $$
  update public.tutor_profiles
  set wallet_balance = wallet_balance - p_amount
  where user_id = p_tutor_id
    and p_amount > 0
    and wallet_balance >= p_amount
  returning wallet_balance;
$$;

-- Serveur uniquement (comme increment_tutor_wallet).
revoke execute on function public.debit_tutor_wallet(uuid, integer) from public, anon, authenticated;
grant  execute on function public.debit_tutor_wallet(uuid, integer) to service_role;
