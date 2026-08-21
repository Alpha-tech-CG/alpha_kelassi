-- Migration 051 : Application technique de la politique de rétention RGPD
--
-- La page /confidentialite (§5 "Durée de conservation") promet des durées
-- précises mais aucun mécanisme technique ne les appliquait jusqu'ici :
--   • Données de compte        : jusqu'à suppression du compte + 30 jours
--   • Historique de chat IA    : 12 mois glissants
--   • Logs techniques          : 90 jours
--   • Données de paiement      : 5 ans (obligation légale)
--
-- Cette migration ajoute une purge quotidienne via pg_cron pour les
-- catégories qui correspondent sans ambiguïté à des tables existantes :
--
--   1. Historique de chat IA (chat_sessions / chat_messages, cf. migration
--      001_initial_schema.sql — "Sessions de chat avec Kelassi") → purge des
--      messages/sessions dont le dernier message a plus de 12 mois.
--   2. Logs techniques (client_errors, login_sessions, cf. migration
--      030_tracking.sql — erreurs frontend + IP de connexion, correspondant
--      exactement à "logs d'erreurs" et "adresse IP" du §2 de la politique)
--      → purge des lignes de plus de 90 jours.
--
-- Volontairement HORS PÉRIMÈTRE de cette migration (voir rapport de la tâche
-- pour le détail) :
--   • "Données de compte + 30 jours après suppression" : aucune colonne de
--     type deleted_at / deletion_requested_at n'existe sur public.users et
--     aucun flux d'application ne marque une demande de suppression de
--     compte à ce jour. Un job basé sur le temps ne peut pas être écrit sans
--     ce déclencheur ; l'ajouter à l'aveugle risquerait de supprimer des
--     comptes actifs. À implémenter au niveau applicatif (flux
--     /compte/supprimer) avant de pouvoir purger automatiquement.
--   • "Données de paiement : 5 ans" : c'est un plancher légal de
--     conservation, pas un plafond explicite au-delà duquel la suppression
--     est exigée par la politique actuelle. Aucune purge n'est ajoutée pour
--     subscriptions / tutor_wallet_transactions afin de ne pas risquer de
--     détruire des données comptables encore utiles ; à revoir avec un
--     conseil juridique si une purge post-5-ans est réellement souhaitée.
--   • message_log (WhatsApp/SMS, migration 013_messaging.sql) et page_views
--     (migration 030) : non explicitement couverts par une durée du §5 de la
--     politique de confidentialité (ce ne sont ni des "logs techniques"
--     d'erreur/IP, ni le "chat IA"). Non touchés par prudence — à trancher
--     explicitement si la politique de confidentialité est mise à jour pour
--     les couvrir.

-- ── pg_cron ──────────────────────────────────────────────────────────────────
-- NOTE IMPORTANTE : sur Supabase, l'extension pg_cron doit être activée
-- manuellement dans le dashboard ("Database" > "Extensions") sur certains
-- plans ; elle peut être restreinte ou indisponible selon le plan du projet.
-- Si l'extension n'est pas disponible, la ligne `create extension` ci-dessous
-- échouera à l'exécution réelle de cette migration contre la base de
-- production/staging — dans ce cas, activer pg_cron manuellement dans le
-- dashboard Supabase puis rejouer uniquement la partie `cron.schedule` de ce
-- fichier. Vérification manuelle requise.
create extension if not exists pg_cron;

-- ── Fonction de purge ────────────────────────────────────────────────────────
create or replace function public.purge_expired_data()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  -- 1. Historique de chat IA : 12 mois glissants.
  --    On supprime les sessions dont TOUS les messages ont plus de 12 mois
  --    (ou qui n'ont jamais reçu de message), ce qui entraîne la suppression
  --    en cascade des chat_messages associés (on delete cascade, cf.
  --    001_initial_schema.sql).
  delete from public.chat_sessions cs
  where not exists (
    select 1 from public.chat_messages cm
    where cm.session_id = cs.id
      and cm.created_at >= now() - interval '12 months'
  );

  -- Filet de sécurité : messages orphelins de plus de 12 mois qui auraient
  -- échappé à la suppression de session ci-dessus (session encore réutilisée
  -- entre-temps par un message récent : dans ce cas on ne supprime que les
  -- vieux messages, pas toute la session).
  delete from public.chat_messages
  where created_at < now() - interval '12 months';

  -- 2. Logs techniques : 90 jours.
  delete from public.client_errors
  where occurred_at < now() - interval '90 days';

  delete from public.login_sessions
  where logged_in_at < now() - interval '90 days';
end;
$$;

revoke execute on function public.purge_expired_data() from anon, authenticated;

-- ── Planification quotidienne ───────────────────────────────────────────────
-- 3h du matin (heure du serveur cron, généralement UTC sur Supabase) :
-- créneau de faible trafic pour l'app (utilisateurs au Congo, UTC+1).
select cron.schedule(
  'purge-expired-data',
  '0 3 * * *',
  $$select public.purge_expired_data()$$
);
