-- ═══════════════════════════════════════════════════════════
-- EraseMate — Supabase Database Setup
-- Run this in your Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════

-- ── Enable UUID extension ────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ── Usage tracking ───────────────────────────────────────────
create table if not exists public.usage (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  date       date not null default current_date,
  count      integer not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, date)
);

-- Upsert helper: increment count on conflict
create or replace function increment_usage_count(p_user_id uuid, p_date date)
returns void language plpgsql security definer as $$
begin
  insert into public.usage(user_id, date, count)
  values (p_user_id, p_date, 1)
  on conflict (user_id, date)
  do update set count = usage.count + 1, updated_at = now();
end;
$$;

-- ── Job history ──────────────────────────────────────────────
create table if not exists public.jobs (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid references auth.users(id) on delete set null,
  original_url    text,
  result_url      text,
  model           text,
  processing_ms   integer,
  orig_width      integer,
  orig_height     integer,
  file_size_bytes bigint,
  status          text default 'success',
  created_at      timestamptz default now()
);

create index jobs_user_id_idx on public.jobs(user_id);
create index jobs_created_at_idx on public.jobs(created_at desc);

-- ── Row Level Security ───────────────────────────────────────
alter table public.usage enable row level security;
alter table public.jobs  enable row level security;

-- Users can only read their own rows
create policy "Users read own usage"
  on public.usage for select using (auth.uid() = user_id);

create policy "Service role writes usage"
  on public.usage for all using (true);

create policy "Users read own jobs"
  on public.jobs for select using (auth.uid() = user_id);

create policy "Service role writes jobs"
  on public.jobs for all using (true);

-- ── Updated_at trigger ───────────────────────────────────────
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger usage_updated_at
  before update on public.usage
  for each row execute procedure set_updated_at();
