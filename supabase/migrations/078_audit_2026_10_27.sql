-- 078 — Correctifs du second audit de sécurité (27/10/2026, lot A : E1, M1, M2, M4).
-- Rapport : docs/audit-securite-2026-10-27.md

-- ── E1 — Corrigés des QCM lisibles directement ──────────────────────────────────
-- La règle RLS « quiz_questions: select via quiz access » filtre les LIGNES, pas
-- les colonnes : un élève pouvait lire correct_index et explanation par REST et
-- tricher (bacs blancs, rouges, classements, défis). On retire la lecture de la
-- table puis on la rend colonne par colonne, sans ces deux-là.
-- Les corrigés restent lus par submit_quiz_attempt (security definer) et par les
-- routes en clé de service ; ni le site ni l'app ne les lisent directement.
-- La vue quiz_weak_areas (security_invoker) n'utilise que id et quiz_id.
revoke select on public.quiz_questions from public, anon, authenticated;
grant select (id, quiz_id, position, prompt, options, created_at, source_id)
  on public.quiz_questions to anon, authenticated;

-- ── M1 — Insertion de sa propre ligne users (rôle, formule, XP) ─────────────────
-- La ligne est créée par le trigger handle_new_user (migrations 066-067) ; la
-- règle d'insertion côté client ne sert plus et laisserait, si le trigger
-- tombait en panne (cas avant le 20/10), un inscrit se créer en role = 'admin'.
drop policy if exists "users: insert on signup" on public.users;
revoke insert on public.users from public, anon, authenticated;

-- ── M2 — File du support ouverte aux visiteurs ───────────────────────────────────
-- Les retours passent tous par /api/feedback (authentifié, débit limité, clé de
-- service). L'écriture directe permettait à n'importe qui, sans compte, de
-- remplir la file en se donnant la priorité maximale.
drop policy if exists "user insère son feedback" on public.beta_feedback;
revoke insert, update, delete on public.beta_feedback from public, anon, authenticated;

-- ── M4 — Événements sans plafond pour les comptes connectés ──────────────────────
-- 073 bornait la taille pour tous mais le débit seulement pour les visiteurs.
-- Plafond ajouté : 1 500 événements par heure et par compte (au 27/10 : 4 au
-- plus ; un élève très actif avec la mesure de vitesse reste sous 400).
create or replace function public.app_events_guard()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if octet_length(new.props::text) > 2048
     or length(new.name) > 64
     or length(new.platform) > 16
     or length(coalesce(new.app_version, '')) > 32
     or length(coalesce(new.device_id, '')) > 128 then
    raise exception 'APP_EVENT_TOO_LARGE';
  end if;

  if new.user_id is null then
    if (select count(*) from public.app_events
        where user_id is null and device_id = new.device_id
          and created_at > now() - interval '1 hour') >= 30 then
      raise exception 'APP_EVENT_RATE_LIMITED';
    end if;
    if (select count(*) from public.app_events
        where user_id is null and created_at > now() - interval '1 minute') >= 500 then
      raise exception 'APP_EVENT_RATE_LIMITED';
    end if;
  else
    -- Index app_events_user_idx (user_id, created_at desc), migration 069.
    if (select count(*) from public.app_events
        where user_id = new.user_id and created_at > now() - interval '1 hour') >= 1500 then
      raise exception 'APP_EVENT_RATE_LIMITED';
    end if;
  end if;

  return new;
end; $$;

revoke execute on function public.app_events_guard() from public, anon, authenticated;
