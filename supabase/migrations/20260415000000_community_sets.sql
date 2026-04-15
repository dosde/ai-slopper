-- Community Sets: user-generated round packs
-- Tables: sets, set_rounds, set_scores, rate_limits

create extension if not exists "pgcrypto";

create table if not exists sets (
  id uuid primary key default gen_random_uuid(),
  seed text unique not null,
  title text not null,
  creator_initials text,
  lang text not null default 'en',
  visibility text not null check (visibility in ('public','private')),
  play_count int not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists sets_public_popular_idx
  on sets (visibility, play_count desc)
  where visibility = 'public';
create index if not exists sets_recent_idx on sets (created_at desc);

create table if not exists set_rounds (
  set_id uuid references sets(id) on delete cascade,
  round_index int not null check (round_index between 0 and 5),
  round jsonb not null,
  primary key (set_id, round_index)
);

create table if not exists set_scores (
  id bigserial primary key,
  set_id uuid references sets(id) on delete cascade,
  score int not null,
  initials text not null,
  timestamp bigint not null,
  created_at timestamptz not null default now()
);
create index if not exists set_scores_by_set_idx on set_scores (set_id, score desc);

create table if not exists rate_limits (
  ip_hash text not null,
  action text not null,
  count int not null default 0,
  window_start timestamptz not null default now(),
  primary key (ip_hash, action)
);

-- RLS
alter table sets enable row level security;
alter table set_rounds enable row level security;
alter table set_scores enable row level security;
alter table rate_limits enable row level security;

-- Anon can read public sets or any set by seed (edge fn uses service role for private lookups too,
-- but we allow public-only via anon for browsing).
drop policy if exists "sets_select_public" on sets;
create policy "sets_select_public" on sets
  for select to anon
  using (visibility = 'public');

-- Anon can read rounds only if parent set is public (private goes through edge fn with service role).
drop policy if exists "set_rounds_select_public" on set_rounds;
create policy "set_rounds_select_public" on set_rounds
  for select to anon
  using (exists (select 1 from sets s where s.id = set_rounds.set_id and s.visibility = 'public'));

-- Anon can read scores for any set (ok — seed is the access token).
drop policy if exists "set_scores_select_all" on set_scores;
create policy "set_scores_select_all" on set_scores
  for select to anon
  using (true);

-- No anon inserts anywhere; all writes go through edge functions with service role.

-- Atomic play-count bump helper (called by submit-set-score).
create or replace function inc_set_play_count(p_set_id uuid)
returns void language sql as $$
  update sets set play_count = play_count + 1 where id = p_set_id;
$$;
