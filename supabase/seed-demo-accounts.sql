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
  end loop;
end $$;

-- Verify:
select email, email_confirmed_at is not null as confirmed, raw_user_meta_data->>'role' as role
from auth.users order by email;
