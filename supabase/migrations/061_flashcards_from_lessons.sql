-- Allow personal flashcards to originate from structured lessons as well as documents.
alter table public.flashcards
  alter column document_id drop not null,
  add column lesson_id uuid references public.lessons(id) on delete cascade;

alter table public.flashcards
  add constraint flashcards_exactly_one_source
  check ((document_id is not null) <> (lesson_id is not null));

create index flashcards_user_lesson_idx
  on public.flashcards(user_id, lesson_id)
  where lesson_id is not null;
