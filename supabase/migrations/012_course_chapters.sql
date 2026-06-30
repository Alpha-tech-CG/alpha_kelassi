-- Migration 012 : Fiches de révision par chapitres
-- Pipeline : BullMQ → Gemini 2.5 Flash → course_chapters

-- ─── Type de statut ────────────────────────────────────────────────────────────
do $$ begin
  create type chapter_status as enum ('pending', 'processing', 'done', 'error');
exception when duplicate_object then null; end $$;

-- ─── Table course_chapters ─────────────────────────────────────────────────────
create table if not exists public.course_chapters (
  id              uuid        primary key default uuid_generate_v4(),
  document_id     uuid        not null references public.documents(id) on delete cascade,
  chapter_number  smallint    not null,
  title           text        not null,
  summary_md      text,           -- Fiche de révision Markdown générée par Gemini
  raw_text        text,           -- Extrait brut du chunk source (retiré après synthèse pour économiser)
  word_count      integer,
  status          chapter_status  not null default 'pending',
  error_message   text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),

  unique(document_id, chapter_number)
);

-- ─── Index ─────────────────────────────────────────────────────────────────────
create index if not exists idx_course_chapters_doc
  on public.course_chapters(document_id, chapter_number);

create index if not exists idx_course_chapters_status
  on public.course_chapters(status);

-- ─── Colonne synthesized_at sur documents ──────────────────────────────────────
alter table public.documents
  add column if not exists synthesized_at timestamptz;

-- ─── RLS ───────────────────────────────────────────────────────────────────────
alter table public.course_chapters enable row level security;

-- Les utilisateurs voient les chapitres des documents auxquels ils ont accès
create policy "lecture chapitres" on public.course_chapters for select
  using (
    exists (
      select 1 from public.documents d
      where d.id = document_id
        and (
          not d.is_premium
          or exists (
            select 1 from public.users u
            where u.id = auth.uid() and u.plan = 'premium'
          )
        )
    )
  );

create policy "service_role full access chapters" on public.course_chapters
  to service_role using (true) with check (true);

-- ─── Trigger updated_at ────────────────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_chapters_updated_at on public.course_chapters;
create trigger trg_chapters_updated_at
  before update on public.course_chapters
  for each row execute function public.set_updated_at();
