-- Densyc Dashboard — full Supabase schema
-- Paste this whole file into: Supabase Dashboard → SQL Editor → New query → Run
-- Safe to re-run: uses "if not exists" / "drop ... if exists" where practical.

-- =========================================================
-- Enums
-- =========================================================
do $$ begin
  create type entity_status as enum ('active', 'inactive');
exception when duplicate_object then null; end $$;
do $$ begin
  create type booking_status as enum ('Booked', 'Pending', 'Rejected');
exception when duplicate_object then null; end $$;
do $$ begin
  create type user_role as enum ('Clinic Owner', 'Moderator', 'Receptionist', 'Accountant', 'Media Buyer', 'Content Creator');
exception when duplicate_object then null; end $$;
do $$ begin
  create type reservation_status as enum ('confirmed', 'pending', 'completed', 'cancelled');
exception when duplicate_object then null; end $$;

-- =========================================================
-- updated_at helper
-- =========================================================
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end; $$;

-- =========================================================
-- Tables
-- =========================================================
create table if not exists public.clinics (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text,
  city text,
  country text default 'Egypt',
  phone text,
  email text,
  website text,
  owner text,
  status entity_status not null default 'active',
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.branches (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid references public.clinics(id) on delete set null,
  name text not null,
  address text,
  city text,
  country text default 'Egypt',
  phone text,
  email text,
  working_hours text,
  manager text,
  status entity_status not null default 'active',
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default '',
  email text,
  phone text,
  role user_role not null default 'Receptionist',
  status entity_status not null default 'active',
  branches text[] not null default '{}',
  permissions jsonb not null default '{}'::jsonb,
  clinic_id uuid references public.clinics(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.patients (
  id uuid primary key default gen_random_uuid(),
  date date default current_date,
  name text not null,
  phone_number text,
  source text,
  interest text,
  country text default 'Egypt',
  city text,
  area text,
  nearest_branch text,
  ad_id text,
  communication_through text,
  moderator_notes text,
  receptionist_name text,
  attempt1 text,
  attempt2 text,
  attempt3 text,
  booking_status booking_status not null default 'Pending',
  show_no_show text,
  reservation_date date,
  rejection_feedback1 text,
  rejection_feedback2 text,
  quotation_amount numeric(12,2),
  amount_paid numeric(12,2),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.campaigns (
  id uuid primary key default gen_random_uuid(),
  campaign_name text not null,
  platform text,
  result_type text,
  status entity_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.campaign_ad_ids (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  ad_id text,
  link text,
  daily_spend numeric(12,2),
  position int default 0
);

create table if not exists public.campaign_daily_data (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  day text,
  date date,
  ad_id_spend text,
  results int default 0,
  cpr numeric(12,2) default 0,
  spend numeric(12,2) default 0,
  impressions int default 0,
  clicks int default 0,
  ctr numeric(8,2) default 0,
  position int default 0
);

create table if not exists public.reservations (
  id uuid primary key default gen_random_uuid(),
  patient text not null,
  patient_id uuid references public.patients(id) on delete set null,
  doctor text,
  clinic text,
  date date,
  time text,
  status reservation_status not null default 'pending',
  type text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- updated_at triggers
drop trigger if exists clinics_updated on public.clinics;
create trigger clinics_updated before update on public.clinics for each row execute function public.set_updated_at();
drop trigger if exists branches_updated on public.branches;
create trigger branches_updated before update on public.branches for each row execute function public.set_updated_at();
drop trigger if exists profiles_updated on public.profiles;
create trigger profiles_updated before update on public.profiles for each row execute function public.set_updated_at();
drop trigger if exists patients_updated on public.patients;
create trigger patients_updated before update on public.patients for each row execute function public.set_updated_at();
drop trigger if exists campaigns_updated on public.campaigns;
create trigger campaigns_updated before update on public.campaigns for each row execute function public.set_updated_at();
drop trigger if exists reservations_updated on public.reservations;
create trigger reservations_updated before update on public.reservations for each row execute function public.set_updated_at();

-- Indexes
create index if not exists branches_clinic_idx on public.branches (clinic_id);
create index if not exists ad_ids_campaign_idx on public.campaign_ad_ids (campaign_id);
create index if not exists daily_campaign_idx on public.campaign_daily_data (campaign_id);
create index if not exists patients_booking_idx on public.patients (booking_status);
create index if not exists reservations_date_idx on public.reservations (date);

-- =========================================================
-- Auth: auto-create profile on signup
-- =========================================================
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'Clinic Owner')
  )
  on conflict (id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'Clinic Owner');
$$;

-- =========================================================
-- Row Level Security
-- =========================================================
alter table public.clinics enable row level security;
alter table public.branches enable row level security;
alter table public.profiles enable row level security;
alter table public.patients enable row level security;
alter table public.campaigns enable row level security;
alter table public.campaign_ad_ids enable row level security;
alter table public.campaign_daily_data enable row level security;
alter table public.reservations enable row level security;

drop policy if exists "profiles_select" on public.profiles;
create policy "profiles_select" on public.profiles for select to authenticated using (true);
drop policy if exists "profiles_update_self_or_admin" on public.profiles;
create policy "profiles_update_self_or_admin" on public.profiles for update to authenticated
  using (id = auth.uid() or public.is_admin()) with check (id = auth.uid() or public.is_admin());
drop policy if exists "profiles_insert_admin" on public.profiles;
create policy "profiles_insert_admin" on public.profiles for insert to authenticated with check (public.is_admin());
drop policy if exists "profiles_delete_admin" on public.profiles;
create policy "profiles_delete_admin" on public.profiles for delete to authenticated using (public.is_admin());

do $$
declare t text;
begin
  foreach t in array array['clinics','branches','patients','campaigns','campaign_ad_ids','campaign_daily_data','reservations']
  loop
    execute format('drop policy if exists "%1$s_select" on public.%1$s;', t);
    execute format('create policy "%1$s_select" on public.%1$s for select to authenticated using (true);', t);
    execute format('drop policy if exists "%1$s_insert" on public.%1$s;', t);
    execute format('create policy "%1$s_insert" on public.%1$s for insert to authenticated with check (true);', t);
    execute format('drop policy if exists "%1$s_update" on public.%1$s;', t);
    execute format('create policy "%1$s_update" on public.%1$s for update to authenticated using (true) with check (true);', t);
    execute format('drop policy if exists "%1$s_delete" on public.%1$s;', t);
    execute format('create policy "%1$s_delete" on public.%1$s for delete to authenticated using (true);', t);
  end loop;
end $$;

-- =========================================================
-- Seed data (starter rows)
-- =========================================================
insert into public.clinics (name, address, city, country, phone, email, website, owner, status, description)
select * from (values
  ('Densyc Main Clinic', '12 Nasr St', 'Cairo', 'Egypt', '+20 100 111 2222', 'main@densyc.com', 'https://densyc.com', 'Dr. Yousef', 'active'::entity_status, 'Flagship dental clinic'),
  ('Densyc Alexandria', '5 Corniche Rd', 'Alexandria', 'Egypt', '+20 100 333 4444', 'alex@densyc.com', 'https://densyc.com', 'Dr. Sara', 'active'::entity_status, 'Alexandria branch clinic')
) as v(name, address, city, country, phone, email, website, owner, status, description)
where not exists (select 1 from public.clinics);

insert into public.branches (clinic_id, name, address, city, country, phone, email, working_hours, manager, status, description)
select c.id, b.name, b.address, b.city, 'Egypt', b.phone, b.email, '9AM - 9PM', b.manager, 'active'::entity_status, 'Branch location'
from (values
  ('Densyc Main Clinic', 'Main Branch', '12 Nasr St', 'Cairo', '+20 100 111 2222', 'main@densyc.com', 'Mohamed Karim'),
  ('Densyc Main Clinic', 'Downtown Branch', '30 Tahrir Sq', 'Cairo', '+20 100 555 6666', 'downtown@densyc.com', 'Nour Hassan'),
  ('Densyc Alexandria', 'Smouha Branch', '5 Corniche Rd', 'Alexandria', '+20 100 333 4444', 'alex@densyc.com', 'Layla Mostafa')
) as b(cname, name, address, city, phone, email, manager)
join public.clinics c on c.name = b.cname
where not exists (select 1 from public.branches);

insert into public.patients (name, phone_number, source, interest, city, area, nearest_branch, ad_id, communication_through, receptionist_name, booking_status, show_no_show, reservation_date, quotation_amount, amount_paid, moderator_notes)
select * from (values
  ('Ahmed Hassan', '+20 100 123 4567', 'Facebook', 'Dental Implants', 'Cairo', 'Nasr City', 'Main Branch', 'FB_001', 'WhatsApp', 'Sara Ahmed', 'Booked'::booking_status, 'Show', (current_date + 2), 15000::numeric, 5000::numeric, 'Interested in full mouth implants'),
  ('Mona Ali', '+20 101 234 5678', 'Instagram', 'Teeth Whitening', 'Giza', 'Dokki', 'Downtown Branch', 'IG_014', 'Phone Call', 'Mohamed Karim', 'Pending'::booking_status, null, null::date, 3000::numeric, 0::numeric, 'Asked for price'),
  ('Omar Khaled', '+20 102 345 6789', 'Google Ads', 'Braces', 'Alexandria', 'Smouha', 'Smouha Branch', 'GA_007', 'WhatsApp', 'Layla Mostafa', 'Rejected'::booking_status, null, null::date, null::numeric, 0::numeric, 'Too expensive')
) as v(name, phone_number, source, interest, city, area, nearest_branch, ad_id, communication_through, receptionist_name, booking_status, show_no_show, reservation_date, quotation_amount, amount_paid, moderator_notes)
where not exists (select 1 from public.patients);

insert into public.reservations (patient, doctor, clinic, date, time, status, type)
select * from (values
  ('Ahmed Hassan', 'Dr. John Smith', 'Densyc Main Clinic', (current_date + 2), '10:00 AM', 'confirmed'::reservation_status, 'Consultation'),
  ('Mona Ali', 'Dr. Sarah Wilson', 'Densyc Main Clinic', (current_date + 3), '02:30 PM', 'pending'::reservation_status, 'Follow-up')
) as v(patient, doctor, clinic, date, time, status, type)
where not exists (select 1 from public.reservations);

insert into public.campaigns (campaign_name, platform, result_type, status)
select 'Summer Implants Promo', 'Facebook', 'Leads', 'active'::entity_status
where not exists (select 1 from public.campaigns);

insert into public.campaign_daily_data (campaign_id, day, date, results, cpr, spend, impressions, clicks, ctr, position)
select c.id, 'Day 1', current_date, 12, 25.5, 306, 5400, 210, 3.9, 0
from public.campaigns c
where c.campaign_name = 'Summer Implants Promo'
  and not exists (select 1 from public.campaign_daily_data);

-- =========================================================
-- Notifications
-- =========================================================
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  message text not null,
  is_read boolean default false not null,
  type text default 'info', -- 'info', 'success', 'warning', 'error'
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists notifications_updated on public.notifications;
create trigger notifications_updated before update on public.notifications for each row execute function public.set_updated_at();

create index if not exists notifications_user_id_idx on public.notifications (user_id);
create index if not exists notifications_is_read_idx on public.notifications (is_read);

alter table public.notifications enable row level security;
drop policy if exists "Users can view own notifications" on public.notifications;
drop policy if exists "Users can update own notifications" on public.notifications;
create policy "Users can view own notifications" on public.notifications for select using (auth.uid() = user_id);
create policy "Users can update own notifications" on public.notifications for update using (auth.uid() = user_id);
create policy "Users can insert own notifications" on public.notifications for insert with check (auth.uid() = user_id);
