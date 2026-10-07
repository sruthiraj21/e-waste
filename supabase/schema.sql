-- ====================================================================
-- EcoCycle Supabase Database Schema & Storage Setup
-- Run this complete script in your Supabase Project: SQL Editor
-- ====================================================================

-- 1. EXTENSIONS
create extension if not exists "uuid-ossp";

-- 2. PROFILES TABLE
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text not null,
  email text not null,
  phone text,
  role text not null default 'USER' check (role in ('USER', 'COLLECTOR', 'ADMIN')),
  avatar_url text,
  address text,
  city text default 'Bengaluru',
  green_points integer not null default 50,
  recycled_kg numeric not null default 0,
  co2_avoided_kg numeric not null default 0,
  pickups_count integer not null default 0,
  rank text not null default 'Eco Starter (Tier 1)',
  created_at timestamptz default now()
);

-- 3. COLLECTORS TABLE
create table if not exists public.collectors (
  id uuid default gen_random_uuid() primary key,
  profile_id uuid references public.profiles(id) on delete cascade,
  business_name text not null,
  verification_status text not null default 'PENDING' check (verification_status in ('VERIFIED', 'PENDING', 'REJECTED')),
  rating numeric(2,1) default 4.8,
  reviews_count integer default 100,
  available boolean default true,
  service_area text default 'Indiranagar & Koramangala, Bengaluru',
  distance_km numeric default 2.4,
  eta_text text default '30–45 mins',
  badges text[] default array['Zero-Emission EV', 'ISO 14001 Certified', 'Digital Custody Seal'],
  latitude double precision default 12.9716,
  longitude double precision default 77.5946,
  supported_categories text[] default array['Computer Equipment', 'Mobile Phones', 'Home Appliances', 'Cables & Accessories'],
  completed_pickups integer default 0,
  total_earnings numeric default 0,
  created_at timestamptz default now()
);

-- 4. EWASTE_ITEMS TABLE
create table if not exists public.ewaste_items (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  image_url text,
  device_name text not null,
  category text not null,
  condition text default 'Grade B+ (Functional with minor casing wear)',
  confidence numeric default 94,
  estimated_value numeric default 1200,
  estimated_weight numeric default 2.4,
  specs text default 'Aluminum Unibody Chassis • Core i7 / M-Series Architecture',
  ai_result jsonb default '{}'::jsonb,
  status text not null default 'SUBMITTED',
  created_at timestamptz default now()
);

-- 5. PICKUPS TABLE
create table if not exists public.pickups (
  id uuid default gen_random_uuid() primary key,
  tracking_id text unique default ('EC-' || floor(1000 + random() * 9000)::text || '-BLR'),
  user_id uuid references public.profiles(id) on delete cascade,
  collector_id uuid references public.collectors(id) on delete set null,
  ewaste_item_id uuid references public.ewaste_items(id) on delete cascade,
  pickup_address text not null,
  scheduled_date date default current_date,
  scheduled_time text default 'Today, 4:00 PM',
  status text not null default 'REQUESTED' check (status in ('REQUESTED', 'ACCEPTED', 'COLLECTOR_ASSIGNED', 'ON_THE_WAY', 'COLLECTED', 'RECYCLED')),
  status_note text default 'Pickup requested. Matching with certified collector.',
  progress_percent integer default 15,
  user_lat double precision default 12.9352,
  user_lng double precision default 77.6245,
  collector_lat double precision default 12.9716,
  collector_lng double precision default 77.5946,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 6. REWARDS TABLE
create table if not exists public.rewards (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  points integer not null default 50,
  reason text not null,
  created_at timestamptz default now()
);

-- 7. CERTIFICATES TABLE
create table if not exists public.certificates (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  pickup_id uuid references public.pickups(id) on delete set null,
  certificate_number text unique not null,
  device_name text not null default 'Electronic Device',
  batch_id text default ('Batch #' || floor(80000 + random() * 10000)::text),
  foundry_name text default 'Valo CleanMetallurgy & EcoCycle Zurich Partner',
  recycled_weight numeric not null,
  co2_avoided numeric not null,
  water_saved_liters integer default 320,
  green_points_added integer default 100,
  gold_recovered_grams text default '0.034g 24K Gold',
  copper_recovered_grams text default '14.2g Pure Copper',
  verification_status text default '100% Chain-of-Custody Verified',
  rank_unlocked text default 'Eco Warrior Rank (Tier 4)',
  issued_at timestamptz default now()
);

-- 8. NOTIFICATIONS TABLE
create table if not exists public.notifications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  title text not null,
  message text not null,
  read boolean default false,
  created_at timestamptz default now()
);

-- 9. INDEXES
create index if not exists idx_profiles_role on public.profiles(role);
create index if not exists idx_collectors_avail on public.collectors(available, verification_status);
create index if not exists idx_ewaste_user on public.ewaste_items(user_id);
create index if not exists idx_pickups_user on public.pickups(user_id);
create index if not exists idx_pickups_col on public.pickups(collector_id);
create index if not exists idx_pickups_status on public.pickups(status);
create index if not exists idx_rewards_user on public.rewards(user_id);
create index if not exists idx_certificates_user on public.certificates(user_id);

-- 10. ROW LEVEL SECURITY (RLS)
alter table public.profiles enable row level security;
alter table public.collectors enable row level security;
alter table public.ewaste_items enable row level security;
alter table public.pickups enable row level security;
alter table public.rewards enable row level security;
alter table public.certificates enable row level security;
alter table public.notifications enable row level security;

-- Public & Authenticated Read/Write Policies
create policy "Anyone can view profiles" on public.profiles for select using (true);
create policy "Users can update own profile" on public.profiles for update using (true);
create policy "Anyone can insert profile" on public.profiles for insert with check (true);

create policy "Anyone can view collectors" on public.collectors for select using (true);
create policy "Collectors can update own info" on public.collectors for update using (true);
create policy "Admins can insert collectors" on public.collectors for insert with check (true);

create policy "Anyone can view ewaste items" on public.ewaste_items for select using (true);
create policy "Anyone can insert ewaste items" on public.ewaste_items for insert with check (true);
create policy "Anyone can update ewaste items" on public.ewaste_items for update using (true);

create policy "Anyone can view pickups" on public.pickups for select using (true);
create policy "Anyone can insert pickups" on public.pickups for insert with check (true);
create policy "Anyone can update pickups" on public.pickups for update using (true);

create policy "Anyone can view rewards" on public.rewards for select using (true);
create policy "Anyone can insert rewards" on public.rewards for insert with check (true);

create policy "Anyone can view certificates" on public.certificates for select using (true);
create policy "Anyone can insert certificates" on public.certificates for insert with check (true);

create policy "Anyone can view notifications" on public.notifications for select using (true);
create policy "Anyone can update notifications" on public.notifications for update using (true);
create policy "Anyone can insert notifications" on public.notifications for insert with check (true);

-- 11. AUTOMATIC PROFILE CREATION TRIGGER ON AUTH.USERS SIGNUP
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.email,
    coalesce(new.raw_user_meta_data->>'role', 'USER')
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 12. SUPABASE STORAGE BUCKET FOR E-WASTE IMAGES
insert into storage.buckets (id, name, public)
values ('ewaste-images', 'ewaste-images', true)
on conflict (id) do update set public = true;

create policy "Public Access to ewaste-images"
  on storage.objects for select
  using (bucket_id = 'ewaste-images');

create policy "Allow Upload to ewaste-images"
  on storage.objects for insert
  with check (bucket_id = 'ewaste-images');

-- 13. SEED DEFAULT VERIFIED COLLECTORS
insert into public.collectors (business_name, verification_status, rating, reviews_count, available, service_area, distance_km, eta_text, badges, latitude, longitude, supported_categories, completed_pickups, total_earnings)
values 
  ('GreenCycle Services', 'VERIFIED', 4.8, 342, true, 'Indiranagar, Koramangala & HSR, Bengaluru', 2.4, '30–45 mins', array['Zero-Emission EV', 'ISO 14001 Certified', 'Digital Custody Seal'], 12.9716, 77.5946, array['Computer Equipment', 'Mobile Phones', 'Home Appliances', 'Cables & Accessories'], 184, 48500),
  ('EcoVan Bangalore', 'VERIFIED', 4.7, 198, true, 'Whitefield & Marathahalli, Bengaluru', 3.8, 'Today 4:00 PM', array['R2 Certified', 'Solar EV Fleet'], 12.9698, 77.7499, array['Computer Equipment', 'Mobile Phones', 'Peripherals'], 112, 31200),
  ('Urban Green Hub', 'VERIFIED', 4.9, 512, true, 'Jayanagar & JP Nagar, Bengaluru', 1.9, 'Tomorrow 9:00 AM', array['Govt Authorized Foundry', 'Zero-Landfill Seal'], 12.9250, 77.5938, array['Computer Equipment', 'Home Appliances', 'Cables & Accessories'], 320, 94000)
on conflict do nothing;
