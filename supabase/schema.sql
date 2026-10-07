-- EcoCycle Supabase Database Schema
-- Run this in the Supabase SQL Editor

-- 1. PROFILES TABLE
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text not null,
  email text not null,
  phone text,
  role text not null default 'USER' check (role in ('USER', 'COLLECTOR', 'ADMIN')),
  avatar_url text,
  address text,
  city text default 'Bengaluru',
  created_at timestamptz default now()
);

-- 2. COLLECTORS TABLE
create table if not exists public.collectors (
  id uuid default gen_random_uuid() primary key,
  profile_id uuid references public.profiles(id) on delete cascade,
  business_name text not null,
  verification_status text not null default 'PENDING' check (verification_status in ('VERIFIED', 'PENDING', 'REJECTED')),
  rating numeric(2,1) default 4.8,
  available boolean default true,
  service_area text default 'Indiranagar & Koramangala, Bengaluru',
  latitude double precision default 12.9716,
  longitude double precision default 77.5946,
  supported_categories text[] default array['Computer Equipment', 'Mobile Phones', 'Home Appliances', 'Cables & Accessories'],
  created_at timestamptz default now()
);

-- 3. EWASTE_ITEMS TABLE
create table if not exists public.ewaste_items (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  image_url text,
  device_name text not null,
  category text not null,
  condition text default 'Grade B+ (Functional with minor wear)',
  confidence numeric default 94,
  estimated_value numeric default 1200,
  estimated_weight numeric default 2.4,
  ai_result jsonb default '{}'::jsonb,
  status text not null default 'SUBMITTED',
  created_at timestamptz default now()
);

-- 4. PICKUPS TABLE
create table if not exists public.pickups (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  collector_id uuid references public.collectors(id) on delete set null,
  ewaste_item_id uuid references public.ewaste_items(id) on delete cascade,
  pickup_address text not null,
  scheduled_date date default current_date,
  scheduled_time text default 'Today, 4:00 PM',
  status text not null default 'REQUESTED' check (status in ('REQUESTED', 'ACCEPTED', 'COLLECTOR_ASSIGNED', 'ON_THE_WAY', 'COLLECTED', 'RECYCLED')),
  latitude double precision default 12.9784,
  longitude double precision default 77.6408,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 5. REWARDS TABLE
create table if not exists public.rewards (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  points integer not null default 50,
  reason text not null,
  created_at timestamptz default now()
);

-- 6. CERTIFICATES TABLE
create table if not exists public.certificates (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  pickup_id uuid references public.pickups(id) on delete set null,
  certificate_number text unique not null,
  recycled_weight numeric not null,
  co2_avoided numeric not null,
  issued_at timestamptz default now()
);

-- 7. NOTIFICATIONS TABLE
create table if not exists public.notifications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  title text not null,
  message text not null,
  read boolean default false,
  created_at timestamptz default now()
);

-- Indexes for performance
create index if not exists idx_profiles_role on public.profiles(role);
create index if not exists idx_collectors_available on public.collectors(available, verification_status);
create index if not exists idx_ewaste_user on public.ewaste_items(user_id);
create index if not exists idx_pickups_user on public.pickups(user_id);
create index if not exists idx_pickups_collector on public.pickups(collector_id);
create index if not exists idx_pickups_status on public.pickups(status);
create index if not exists idx_rewards_user on public.rewards(user_id);
create index if not exists idx_certificates_user on public.certificates(user_id);

-- ROW LEVEL SECURITY (RLS)
alter table public.profiles enable row level security;
alter table public.collectors enable row level security;
alter table public.ewaste_items enable row level security;
alter table public.pickups enable row level security;
alter table public.rewards enable row level security;
alter table public.certificates enable row level security;
alter table public.notifications enable row level security;

-- Policies for profiles
create policy "Users can view own profile or admins can view all"
  on public.profiles for select
  using (auth.uid() = id or (select role from public.profiles where id = auth.uid()) = 'ADMIN');

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile on signup"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Policies for collectors
create policy "Anyone authenticated can view collectors"
  on public.collectors for select
  to authenticated using (true);

create policy "Collectors can update own record"
  on public.collectors for update
  using (auth.uid() = profile_id or (select role from public.profiles where id = auth.uid()) = 'ADMIN');

-- Policies for ewaste_items
create policy "Users view own items, collectors view items assigned, admins view all"
  on public.ewaste_items for select
  using (
    auth.uid() = user_id or 
    exists (select 1 from public.pickups p join public.collectors c on p.collector_id = c.id where p.ewaste_item_id = public.ewaste_items.id and c.profile_id = auth.uid()) or
    (select role from public.profiles where id = auth.uid()) = 'ADMIN'
  );

create policy "Users can insert ewaste items"
  on public.ewaste_items for insert
  with check (auth.uid() = user_id);

create policy "Users can update own ewaste items"
  on public.ewaste_items for update
  using (auth.uid() = user_id);

-- Policies for pickups
create policy "Users view own pickups, collectors view assigned/requested pickups, admins view all"
  on public.pickups for select
  using (
    auth.uid() = user_id or 
    collector_id in (select id from public.collectors where profile_id = auth.uid()) or
    (select role from public.profiles where id = auth.uid()) = 'ADMIN' or
    status = 'REQUESTED'
  );

create policy "Users can create pickups"
  on public.pickups for insert
  with check (auth.uid() = user_id);

create policy "Users and assigned collectors can update pickups"
  on public.pickups for update
  using (
    auth.uid() = user_id or 
    collector_id in (select id from public.collectors where profile_id = auth.uid()) or
    (select role from public.profiles where id = auth.uid()) = 'ADMIN'
  );

-- Policies for rewards
create policy "Users view own rewards"
  on public.rewards for select
  using (auth.uid() = user_id or (select role from public.profiles where id = auth.uid()) = 'ADMIN');

-- Policies for certificates
create policy "Users view own certificates"
  on public.certificates for select
  using (auth.uid() = user_id or (select role from public.profiles where id = auth.uid()) = 'ADMIN');

-- Policies for notifications
create policy "Users view own notifications"
  on public.notifications for select
  using (auth.uid() = user_id);

create policy "Users update own notifications"
  on public.notifications for update
  using (auth.uid() = user_id);
