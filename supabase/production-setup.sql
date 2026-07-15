-- Densyc — PRODUCTION SETUP (one-paste).
-- Run in: Supabase Dashboard → project lqmunvstnlmohbpmsdro → SQL Editor → New query → Run.
-- Idempotent: safe to re-run. Creates schema + RLS + auth trigger, then the two login accounts.
-- Accounts:  owner@demo.com / Password123!  (mock-data view)   |   blank@demo.com / Password123!  (blank, real-use start)

-- ============ PART 1: SCHEMA ============
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
  user_id uuid default auth.uid() references auth.users(id) on delete cascade,
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
  user_id uuid default auth.uid() references auth.users(id) on delete cascade,
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
  user_id uuid default auth.uid() references auth.users(id) on delete cascade,
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
  user_id uuid default auth.uid() references auth.users(id) on delete cascade,
  campaign_name text not null,
  platform text,
  result_type text,
  status entity_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.campaign_ad_ids (
  id uuid primary key default gen_random_uuid(),
  user_id uuid default auth.uid() references auth.users(id) on delete cascade,
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  ad_id text,
  link text,
  daily_spend numeric(12,2),
  position int default 0
);

create table if not exists public.campaign_daily_data (
  id uuid primary key default gen_random_uuid(),
  user_id uuid default auth.uid() references auth.users(id) on delete cascade,
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
  user_id uuid default auth.uid() references auth.users(id) on delete cascade,
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
-- Add user_id column to existing tables (if they exist)
-- =========================================================
do $$
declare t text;
begin
  foreach t in array array['clinics','branches','patients','campaigns','campaign_ad_ids','campaign_daily_data','reservations']
  loop
    execute format('alter table public.%I add column if not exists user_id uuid default auth.uid() references auth.users(id) on delete cascade;', t);
  end loop;
end $$;

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
    execute format('create policy "%1$s_select" on public.%1$s for select to authenticated using (user_id = auth.uid());', t);
    execute format('drop policy if exists "%1$s_insert" on public.%1$s;', t);
    execute format('create policy "%1$s_insert" on public.%1$s for insert to authenticated with check (user_id = auth.uid());', t);
    execute format('drop policy if exists "%1$s_update" on public.%1$s;', t);
    execute format('create policy "%1$s_update" on public.%1$s for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());', t);
    execute format('drop policy if exists "%1$s_delete" on public.%1$s;', t);
    execute format('create policy "%1$s_delete" on public.%1$s for delete to authenticated using (user_id = auth.uid());', t);
  end loop;
end $$;

-- =========================================================
-- Seed data (starter rows)
-- =========================================================
-- Seed data has been removed for production readiness.
-- Use the application frontend to add your own real data.

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

-- ============ PART 2: LOGIN ACCOUNTS ============
-- Densyc — create the two login accounts.
-- Run this in: Supabase Dashboard → (your project) → SQL Editor → New query → Run
--
--   owner@demo.com / Password123!   → dashboard WITH mock data  (for demos / inviting people)
--   blank@demo.com / Password123!   → blank dashboard           (start real use)
--
-- Both are created already email-confirmed, so they can sign in immediately
-- (no confirmation email required). Safe to re-run: existing users are skipped.

do $$
declare
  rec record;
  v_id uuid;
begin
  for rec in
    select * from (values
      ('owner@demo.com', 'Demo Owner',    'Clinic Owner'),
      ('blank@demo.com', 'Blank Account', 'Clinic Owner')
    ) as t(email, fullname, role)
  loop
    if exists (select 1 from auth.users where email = rec.email) then
      continue;
    end if;

    v_id := gen_random_uuid();

    insert into auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) values (
      '00000000-0000-0000-0000-000000000000', v_id, 'authenticated', 'authenticated',
      rec.email, extensions.crypt('Password123!', extensions.gen_salt('bf')),
      now(), now(), now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('name', rec.fullname, 'role', rec.role),
      '', '', '', ''
    );

    insert into auth.identities (
      id, user_id, provider_id, identity_data, provider,
      last_sign_in_at, created_at, updated_at
    ) values (
      gen_random_uuid(), v_id, v_id::text,
      jsonb_build_object('sub', v_id::text, 'email', rec.email),
      'email', now(), now(), now()
    );

    insert into public.profiles (id, name, email, role, status)
    values (v_id, rec.fullname, rec.email, rec.role::user_role, 'active')
    on conflict (id) do update
      set name = excluded.name, email = excluded.email, role = excluded.role;

    if rec.email = 'owner@demo.com' then
      -- Clean old mock data to keep script idempotent
      delete from public.patients where user_id = v_id;
      delete from public.campaigns where user_id = v_id;
      delete from public.clinics where user_id = v_id;

      -- Add mock clinic
      insert into public.clinics (user_id, name, city) values (v_id, 'Demo Clinic', 'Cairo');

      -- Add mock patients
      insert into public.patients (user_id, date, name, phone_number, source, interest, city, nearest_branch, booking_status, amount_paid, quotation_amount, receptionist_name, show_no_show)
      values 
        (v_id, current_date, 'Ahmed Ali', '01012345678', 'Facebook', 'Dental Implants', 'Cairo', 'Main Branch', 'Booked', 5000, 10000, 'Sara Ahmed', 'Show'),
        (v_id, current_date - 1, 'Sara Hassan', '01123456789', 'Instagram', 'Teeth Whitening', 'Alexandria', 'Downtown Branch', 'Pending', 0, 1500, 'Mohamed Karim', '-'),
        (v_id, current_date - 2, 'Mohamed Omar', '01234567890', 'Google Ads', 'Braces', 'Giza', 'Uptown Branch', 'Booked', 2000, 15000, 'Nour Hassan', 'Show'),
        (v_id, current_date - 3, 'Nour El Din', '01512345678', 'TikTok', 'Root Canal', 'Luxor', 'West Side Branch', 'Rejected', 0, 3000, 'Layla Mostafa', '-'),
        (v_id, current_date - 4, 'Layla Mahmoud', '01098765432', 'Referral', 'Veneers', 'Aswan', 'Main Branch', 'Booked', 15000, 30000, 'Ahmed Ali', 'Show'),
        (v_id, current_date - 5, 'Kareem Mostafa', '01198765432', 'Facebook', 'Cleaning', 'Cairo', 'Downtown Branch', 'Pending', 0, 500, 'Sara Ahmed', '-'),
        (v_id, current_date - 6, 'Heba Tarek', '01298765432', 'Instagram', 'Wisdom Tooth', 'Alexandria', 'Uptown Branch', 'Booked', 1000, 2000, 'Mohamed Karim', 'No-show'),
        (v_id, current_date - 7, 'Youssef Nader', '01598765432', 'Google Ads', 'Crowns', 'Giza', 'West Side Branch', 'Pending', 0, 4000, 'Nour Hassan', '-'),
        (v_id, current_date - 8, 'Amina Samir', '01011122233', 'TikTok', 'Dental Implants', 'Cairo', 'Main Branch', 'Rejected', 0, 12000, 'Layla Mostafa', '-'),
        (v_id, current_date - 9, 'Omar Khaled', '01122233344', 'Referral', 'Teeth Whitening', 'Alexandria', 'Downtown Branch', 'Booked', 1500, 1500, 'Ahmed Ali', 'Show');
        
      -- Add mock campaigns
      insert into public.campaigns (user_id, campaign_name, platform, result_type, status)
      values
        (v_id, 'Summer Smile', 'Facebook', 'Leads', 'active'),
        (v_id, 'Implants Promo', 'Google Ads', 'Conversions', 'active'),
        (v_id, 'Whitening Special', 'Instagram', 'Messages', 'active');
    end if;

  end loop;
end $$;

-- Verify:
select email, email_confirmed_at is not null as confirmed, raw_user_meta_data->>'role' as role
from auth.users order by email;
