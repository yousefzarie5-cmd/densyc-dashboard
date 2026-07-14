-- Run this script in your Supabase SQL Editor to wipe all template data.
-- This will empty the tables but keep the schema intact.
-- WARNING: This deletes ALL data in these tables.

TRUNCATE TABLE public.campaign_daily_data CASCADE;
TRUNCATE TABLE public.campaign_ad_ids CASCADE;
TRUNCATE TABLE public.campaigns CASCADE;
TRUNCATE TABLE public.reservations CASCADE;
TRUNCATE TABLE public.patients CASCADE;
TRUNCATE TABLE public.branches CASCADE;
TRUNCATE TABLE public.clinics CASCADE;

-- Note: We do not truncate profiles/auth.users here so you don't lose your login,
-- but you can delete specific mock users directly from the Authentication tab in Supabase if desired.
