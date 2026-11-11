-- 075 — Paquets de flashcards par chapitre (26/10/2026).
--
-- Chaque chapitre a son paquet de cartes préparé à l'avance (une cinquantaine), commun à
-- tous les élèves : rien n'est généré à la demande, donc ni IA ni attente. Une séance
-- montre 15 cartes tirées au hasard dans le paquet.
--   source = 'auto'   : cartes tirées des cours du chapitre (scripts/seed-flashcards-chapitres.mjs) ;
--   source = 'manuel' : cartes rédigées (jamais remplacées par le script).
-- Les flashcards personnelles (révision espacée SM-2, table flashcards) restent inchangées.

create table if not exists public.chapter_flashcards (
  id          uuid primary key default gen_random_uuid(),
  chapter_id  uuid not null references public.chapters(id) on delete cascade,
  front       text not null check (char_length(front) between 1 and 500),
  back        text not null check (char_length(back) between 1 and 2000),
  order_index integer not null default 0,
  source      text not null default 'auto' check (source in ('auto', 'manuel')),
  created_at  timestamptz not null default now()
);
create index if not exists idx_chapter_flashcards_chapter on public.chapter_flashcards(chapter_id, order_index);

-- Même règle d'accès que les leçons du chapitre (migration 057).
alter table public.chapter_flashcards enable row level security;
drop policy if exists "chapter_flashcards_read" on public.chapter_flashcards;
create policy "chapter_flashcards_read" on public.chapter_flashcards for select to authenticated using (
  (select public.current_user_plan_level()) >= 1
  or public.is_open_chapter(chapter_id)
);
