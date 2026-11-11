-- Alpha Kelassi — Nouvelles formules Cognix (1/2)
-- Migration 056 : nouvelles valeurs d'énumération.
--
-- PostgreSQL n'autorise pas l'usage d'une valeur d'enum ajoutée dans la même
-- transaction : ces ajouts vivent donc seuls ici, et la migration 057 (qui
-- les utilise) doit être appliquée APRÈS validation de celle-ci — même
-- découpage que 054/055 pour les séries techniques.
--
-- `premium` n'est PAS supprimé : une valeur d'enum ne se retire pas sans
-- recréer le type, et d'anciennes lignes ou d'anciennes versions de
-- l'application peuvent encore l'employer. Il est lu comme `pro` (cf. 057).

alter type public.user_plan add value if not exists 'starter';
alter type public.user_plan add value if not exists 'pro';
alter type public.user_plan add value if not exists 'pro_max';

-- Abonnement payé mais pas encore commencé (renouvellement ou descente
-- programmés à l'échéance en cours), abonnement arrivé à terme, et
-- suspension manuelle depuis la console.
alter type public.subscription_status add value if not exists 'pending';
alter type public.subscription_status add value if not exists 'expired';
alter type public.subscription_status add value if not exists 'suspended';
