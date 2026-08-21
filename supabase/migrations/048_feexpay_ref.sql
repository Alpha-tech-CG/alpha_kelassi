-- Alpha Kelassi — Paiements
-- Migration 048 : bascule CinetPay → FeexPay.
--
-- On ajoute une référence de transaction FeexPay, unique (idempotence des
-- webhooks). `cinetpay_ref` est conservée pour les abonnements historiques
-- déjà en base — aucune donnée n'est supprimée.

alter table public.subscriptions
  add column if not exists feexpay_ref text unique;
