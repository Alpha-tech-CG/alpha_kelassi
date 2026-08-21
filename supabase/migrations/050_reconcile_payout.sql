-- Alpha Kelassi — Paiements tuteurs (réconciliation payout)
-- Migration 050 : finalisation atomique d'un retrait échoué.
--
-- Le worker de réconciliation interroge le statut FeexPay des retraits restés
-- 'pending'. Pour un échec, il faut recréditer le wallet ET marquer la
-- transaction — sans risque de DOUBLE recrédit si deux ticks se chevauchent.
--
-- Cette fonction « réclame » la transaction (pending → rejected) et recrédite,
-- le tout dans une seule transaction. Le recrédit n'a lieu que pour le tick qui
-- a effectivement basculé la ligne (found), donc au plus une fois.

create or replace function public.reconcile_failed_payout(p_txn_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tutor  uuid;
  v_amount integer;
begin
  update public.tutor_wallet_transactions
    set status = 'rejected'
    where id = p_txn_id
      and type = 'withdrawal'
      and status = 'pending'
    returning tutor_id, amount_fcfa into v_tutor, v_amount;

  if not found then
    return false;  -- déjà finalisée par un autre tick
  end if;

  update public.tutor_profiles
    set wallet_balance = wallet_balance + v_amount
    where user_id = v_tutor;

  return true;
end;
$$;

revoke execute on function public.reconcile_failed_payout(uuid) from public, anon, authenticated;
grant  execute on function public.reconcile_failed_payout(uuid) to service_role;
