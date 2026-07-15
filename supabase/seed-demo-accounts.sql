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
      delete from public.branches where user_id = v_id;
      delete from public.clinics where user_id = v_id;

      -- Add mock clinic
      insert into public.clinics (user_id, name, city) values (v_id, 'Demo Clinic', 'Cairo');

      -- Add mock branches
      insert into public.branches (user_id, name, city) values
        (v_id, 'Main Branch', 'Cairo'),
        (v_id, 'Downtown Branch', 'Alexandria'),
        (v_id, 'Uptown Branch', 'Giza'),
        (v_id, 'West Side Branch', 'Luxor');

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
