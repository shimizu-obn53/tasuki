-- 案件テーブル
create table if not exists freelance_jobs (
  id uuid primary key default gen_random_uuid(),
  site text not null check (site in ('lancers','visasq','coconala','crowdworks','other')),
  title text not null,
  url text,
  amount integer,
  status text not null default '応募中' check (status in ('未応募','応募中','選考中','受注','完了','見送り')),
  applied_at timestamptz,
  completed_at timestamptz,
  notes text,
  created_at timestamptz default now()
);

-- 応募文テーブル
create table if not exists freelance_applications (
  id uuid primary key default gen_random_uuid(),
  job_id uuid references freelance_jobs(id) on delete cascade,
  content text not null,
  created_at timestamptz default now()
);

-- RLS無効（個人用）
alter table freelance_jobs disable row level security;
alter table freelance_applications disable row level security;
