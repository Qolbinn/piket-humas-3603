-- ============================================================
-- SEED DATA — Piket Humas
-- Jalankan SETELAH semua migration berhasil
-- ============================================================

-- DROP SCHEMA public CASCADE;
-- CREATE SCHEMA public;
-- DELETE FROM supabase_migrations.schema_migrations;

-- 0. Enable pgcrypto untuk hashing password
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. SECTION: AUTH USERS & IDENTITIES
-- Supabase Auth memerlukan data di schema auth agar bisa login.
-- Password di-set sama dengan username.

DO $$
DECLARE
  user_ids UUID[] := ARRAY[
    '11111111-1111-1111-1111-111111111111', -- humasbps3603
    '22222222-2222-2222-2222-222222222222', -- arzudaqolbin
    '33333333-3333-3333-3333-333333333333', -- langit.biru
    '44444444-4444-4444-4444-444444444444', -- kaylaazka
    '55555555-5555-5555-5555-555555555555', -- mira.merta
    '66666666-6666-6666-6666-666666666666', -- nurmala.afriyana
    '00000001-0000-0000-0000-000000000001', -- hmaulana
    '00000002-0000-0000-0000-000000000002', -- asolihin
    '00000003-0000-0000-0000-000000000003', -- yosep.bangun
    '00000004-0000-0000-0000-000000000004', -- rohmad
    '00000005-0000-0000-0000-000000000005', -- hendrop
    '00000006-0000-0000-0000-000000000006', -- muharani
    '00000007-0000-0000-0000-000000000007', -- ynurulita
    '00000008-0000-0000-0000-000000000008', -- nuraisyah
    '00000009-0000-0000-0000-000000000009', -- yenis
    '00000010-0000-0000-0000-000000000010', -- robiatul
    '00000011-0000-0000-0000-000000000011', -- bambang
    '00000012-0000-0000-0000-000000000012', -- estianarusmawati
    '00000013-0000-0000-0000-000000000013', -- elokdts
    '00000014-0000-0000-0000-000000000014', -- noti
    '00000015-0000-0000-0000-000000000015', -- msy.nourma
    '00000016-0000-0000-0000-000000000016', -- dewipuspita
    '00000017-0000-0000-0000-000000000017'  -- desnacita.harly
  ];
  emails TEXT[] := ARRAY[
    'humasbps3603@gmail.com',
    'arzudaqolbin@bps.go.id',
    'langit.biru@bps.go.id',
    'kaylaazka@bps.go.id',
    'mira.merta@bps.go.id',
    'nurmala.afriyana@bps.go.id',
    'hmaulana@bps.go.id',
    'asolihin@bps.go.id',
    'yosep.bangun@bps.go.id',
    'rohmad@bps.go.id',
    'hendrop@bps.go.id',
    'muharani@bps.go.id',
    'ynurulita@bps.go.id',
    'nuraisyah@bps.go.id',
    'yenis@bps.go.id',
    'robiatul@bps.go.id',
    'bambang@bps.go.id',
    'estianarusmawati@bps.go.id',
    'elokdts@bps.go.id',
    'noti@bps.go.id',
    'msy.nourma@bps.go.id',
    'dewipuspita@bps.go.id',
    'desnacita.harly@bps.go.id'
  ];
  passwords TEXT[] := ARRAY[
    'humasbps3603',
    'arzudaqolbin',
    'langit.biru',
    'kaylaazka',
    'mira.merta',
    'nurmala.afriyana',
    'hmaulana',
    'asolihin',
    'yosep.Bangun',
    'rohmad',
    'hendrop',
    'muharani',
    'ynurulita',
    'nuraisyah',
    'yenis',
    'robiatul',
    'bambang',
    'estianarusmawati',
    'elokdts',
    'noti',
    'msy.nourma',
    'dewipuspita',
    'desnacita.harly'
  ];
BEGIN
  FOR i IN 1..23 LOOP
    -- Insert into auth.users if not exists
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, 
      email_confirmed_at, recovery_sent_at, last_sign_in_at, 
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
      confirmation_token, email_change, email_change_token_new, recovery_token
    )
    SELECT 
      '00000000-0000-0000-0000-000000000000', user_ids[i], 'authenticated', 'authenticated', emails[i], 
      crypt(passwords[i], gen_salt('bf')), 
      current_timestamp, current_timestamp, current_timestamp, 
      '{"provider":"email","providers":["email"]}', '{}', 
      current_timestamp, current_timestamp, '', '', '', ''
    WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE id = user_ids[i]);

    -- Insert into auth.identities if not exists
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    )
    SELECT 
      user_ids[i], user_ids[i], user_ids[i]::text, format('{"sub":"%s","email":"%s"}', user_ids[i], emails[i])::jsonb, 'email', 
      current_timestamp, current_timestamp, current_timestamp
    WHERE NOT EXISTS (SELECT 1 FROM auth.identities WHERE id = user_ids[i]);
  END LOOP;
END $$;

-- ============================================================
-- SECTION 2: PEGAWAI
-- ============================================================

INSERT INTO public.pegawai (id, name, username, email, phone, gender, role) VALUES
  ('11111111-1111-1111-1111-111111111111', 'humasbps3603',             'humasbps3603',     'humasbps3603@gmail.com',     NULL, 'P', 'admin'),
  ('22222222-2222-2222-2222-222222222222', 'Arzuda Qolbin',             'arzudaqolbin',     'arzudaqolbin@bps.go.id',     NULL, 'L', 'petugas'),
  ('33333333-3333-3333-3333-333333333333', 'Pelangi Langit Biru',              'langit.biru',      'langit.biru@bps.go.id',      NULL, 'P', 'petugas'),
  ('44444444-4444-4444-4444-444444444444', 'Kayla Azka',                'kaylaazka',        'kaylaazka@bps.go.id',        NULL, 'P', 'petugas'),
  ('55555555-5555-5555-5555-555555555555', 'Mira Merta',               'mira.merta',       'mira.merta@bps.go.id',       NULL, 'P', 'petugas'),
  ('66666666-6666-6666-6666-666666666666', 'Nurmala Afriyana',         'nurmala.afriyana', 'nurmala.afriyana@bps.go.id', NULL, 'P', 'petugas'),
  ('00000001-0000-0000-0000-000000000001', 'Husin Maulana',            'hmaulana',         'hmaulana@bps.go.id',         NULL, 'L', 'petugas'),
  ('00000002-0000-0000-0000-000000000002', 'Achmad Solihin',           'asolihin',         'asolihin@bps.go.id',         NULL, 'L', 'petugas'),
  ('00000003-0000-0000-0000-000000000003', 'Yosep Bangun',             'yosep.bangun',     'yosep.bangun@bps.go.id',     NULL, 'L', 'petugas'),
  ('00000004-0000-0000-0000-000000000004', 'Rohmad Chamdani',          'rohmad',           'rohmad@bps.go.id',           NULL, 'L', 'petugas'),
  ('00000005-0000-0000-0000-000000000005', 'Hendro Prayitno',          'hendrop',          'hendrop@bps.go.id',          NULL, 'L', 'petugas'),
  ('00000006-0000-0000-0000-000000000006', 'Sari Muharani',            'muharani',         'muharani@bps.go.id',         NULL, 'P', 'petugas'),
  ('00000007-0000-0000-0000-000000000007', 'Yuyun Nurulita',           'ynurulita',        'ynurulita@bps.go.id',        NULL, 'P', 'petugas'),
  ('00000008-0000-0000-0000-000000000008', 'Nuraisyah',                'nuraisyah',        'nuraisyah@bps.go.id',        NULL, 'P', 'petugas'),
  ('00000009-0000-0000-0000-000000000009', 'Yeni Susniyawati',         'yenis',            'yenis@bps.go.id',            NULL, 'P', 'petugas'),
  ('00000010-0000-0000-0000-000000000010', 'Robiatul Adawiyah',        'robiatul',         'robiatul@bps.go.id',         NULL, 'P', 'petugas'),
  ('00000011-0000-0000-0000-000000000011', 'Bambang Susilo Handoyono', 'bambang',          'bambang@bps.go.id',          NULL, 'L', 'petugas'),
  ('00000012-0000-0000-0000-000000000012', 'Estiana Rusmawati',        'estianarusmawati', 'estianarusmawati@bps.go.id', NULL, 'P', 'petugas'),
  ('00000013-0000-0000-0000-000000000013', 'Elok Dewi TS',             'elokdts',          'elokdts@bps.go.id',          NULL, 'P', 'petugas'),
  ('00000014-0000-0000-0000-000000000014', 'Noti Lansaroni',           'noti',             'noti@bps.go.id',             NULL, 'P', 'petugas'),
  ('00000015-0000-0000-0000-000000000015', 'Msy Nourma',               'msy.nourma',       'msy.nourma@bps.go.id',       NULL, 'P', 'petugas'),
  ('00000016-0000-0000-0000-000000000016', 'Dewi Puspita Sari',        'dewipuspita',      'dewipuspita@bps.go.id',      NULL, 'P', 'petugas'),
  ('00000017-0000-0000-0000-000000000017', 'Desnacita Harly Putri',    'desnacita.harly',  'desnacita.harly@bps.go.id',  NULL, 'P', 'petugas')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- SECTION 3: TEMPLATE ALOKASI
-- ============================================================

INSERT INTO public.template (id, name) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Team Minggu 1 & 3'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Team Minggu 2 & 4')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- SECTION 4: TEMPLATE DETAIL
-- day_of_week: 1=Senin, 2=Selasa, 3=Rabu, 4=Kamis, 5=Jumat
-- Max 3 pegawai per hari per template
-- ============================================================

-- Team Minggu 1 & 3
INSERT INTO public.template_detail (template_id, day_of_week, pegawai_id) VALUES
  -- Senin (yosep, robiatul, rohmad chamdani)
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 1, '00000003-0000-0000-0000-000000000003'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 1, '00000010-0000-0000-0000-000000000010'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 1, '00000004-0000-0000-0000-000000000004'),
  -- Selasa (qolbin, estiana, bambang)
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 2, '22222222-2222-2222-2222-222222222222'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 2, '00000012-0000-0000-0000-000000000012'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 2, '00000011-0000-0000-0000-000000000011'),
  -- Rabu (kayla, elok, hendro)
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 3, '44444444-4444-4444-4444-444444444444'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 3, '00000013-0000-0000-0000-000000000013'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 3, '00000005-0000-0000-0000-000000000005'),
  -- Kamis (mira, dewi, msy nourma)
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 4, '55555555-5555-5555-5555-555555555555'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 4, '00000016-0000-0000-0000-000000000016'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 4, '00000015-0000-0000-0000-000000000015'),
  -- Jumat (nurmala, yenis, noti)
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 5, '66666666-6666-6666-6666-666666666666'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 5, '00000009-0000-0000-0000-000000000009'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 5, '00000014-0000-0000-0000-000000000014')
ON CONFLICT DO NOTHING;

-- Team Minggu 2 & 4
INSERT INTO public.template_detail (template_id, day_of_week, pegawai_id) VALUES
  -- Senin (yosep, robiatul, solihin)
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 1, '00000003-0000-0000-0000-000000000003'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 1, '00000010-0000-0000-0000-000000000010'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 1, '00000002-0000-0000-0000-000000000002'),
  -- Selasa (qolbin, estiana, nuraisyah)
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 2, '22222222-2222-2222-2222-222222222222'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 2, '00000012-0000-0000-0000-000000000012'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 2, '00000008-0000-0000-0000-000000000008'),
  -- Rabu (kayla, elok, sari)
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 3, '44444444-4444-4444-4444-444444444444'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 3, '00000013-0000-0000-0000-000000000013'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 3, '00000006-0000-0000-0000-000000000006'),
  -- Kamis (mira, dewi, desnacita)
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 4, '55555555-5555-5555-5555-555555555555'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 4, '00000016-0000-0000-0000-000000000016'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 4, '00000017-0000-0000-0000-000000000017'),
  -- Jumat (nurmala, yenis, yuyun)
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 5, '66666666-6666-6666-6666-666666666666'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 5, '00000009-0000-0000-0000-000000000009'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 5, '00000007-0000-0000-0000-000000000007')
ON CONFLICT DO NOTHING;
