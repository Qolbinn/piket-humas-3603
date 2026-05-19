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
    '66666666-6666-6666-6666-666666666666'  -- nurmala.afriyana
  ];
  emails TEXT[] := ARRAY[
    'humasbps3603@gmail.com',
    'arzudaqolbin@bps.go.id',
    'langit.biru@bps.go.id',
    'kaylaazka@bps.go.id',
    'mira.merta@bps.go.id',
    'nurmala.afriyana@bps.go.id'
  ];
  usernames TEXT[] := ARRAY[
    'humasbps3603',
    'arzudaqolbin',
    'langit.biru',
    'kaylaazka',
    'mira.merta',
    'nurmala.afriyana'
  ];
BEGIN
  FOR i IN 1..6 LOOP
    -- Insert into auth.users if not exists
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, 
      email_confirmed_at, recovery_sent_at, last_sign_in_at, 
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
      confirmation_token, email_change, email_change_token_new, recovery_token
    )
    SELECT 
      '00000000-0000-0000-0000-000000000000', user_ids[i], 'authenticated', 'authenticated', emails[i], 
      crypt(usernames[i], gen_salt('bf')), 
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
  ('11111111-1111-1111-1111-111111111111', 'humasbps3603',     'humasbps3603',     'humasbps3603@gmail.com',     NULL, 'P', 'admin'),
  ('22222222-2222-2222-2222-222222222222', 'arzudaqolbin',     'arzudaqolbin',     'arzudaqolbin@bps.go.id',     NULL, 'L', 'petugas'),
  ('33333333-3333-3333-3333-333333333333', 'langit.biru',      'langit.biru',      'langit.biru@bps.go.id',      NULL, 'P', 'petugas'),
  ('44444444-4444-4444-4444-444444444444', 'kaylaazka',        'kaylaazka',        'kaylaazka@bps.go.id',        NULL, 'P', 'petugas'),
  ('55555555-5555-5555-5555-555555555555', 'mira.merta',       'mira.merta',       'mira.merta@bps.go.id',       NULL, 'P', 'petugas'),
  ('66666666-6666-6666-6666-666666666666', 'nurmala.afriyana', 'nurmala.afriyana', 'nurmala.afriyana@bps.go.id', NULL, 'P', 'petugas')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- SECTION 3: TEMPLATE ALOKASI
-- ============================================================

INSERT INTO public.template (id, name) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Template Tim Alpha (Utama)'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Template Tim Beta (Cadangan)')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- SECTION 4: TEMPLATE DETAIL
-- day_of_week: 1=Senin, 2=Selasa, 3=Rabu, 4=Kamis, 5=Jumat
-- Max 3 pegawai per hari per template
-- ============================================================

-- Tim Alpha (Utama)
INSERT INTO public.template_detail (template_id, day_of_week, pegawai_id) VALUES
  -- Senin (arzudaqolbin, langit.biru)
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 1, '22222222-2222-2222-2222-222222222222'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 1, '33333333-3333-3333-3333-333333333333'),
  -- Selasa (kaylaazka, mira.merta)
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 2, '44444444-4444-4444-4444-444444444444'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 2, '55555555-5555-5555-5555-555555555555'),
  -- Rabu (nurmala.afriyana, arzudaqolbin)
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 3, '66666666-6666-6666-6666-666666666666'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 3, '22222222-2222-2222-2222-222222222222'),
  -- Kamis (langit.biru, kaylaazka)
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 4, '33333333-3333-3333-3333-333333333333'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 4, '44444444-4444-4444-4444-444444444444'),
  -- Jumat (mira.merta, nurmala.afriyana)
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 5, '55555555-5555-5555-5555-555555555555'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 5, '66666666-6666-6666-6666-666666666666')
ON CONFLICT DO NOTHING;

-- Tim Beta (Cadangan)
INSERT INTO public.template_detail (template_id, day_of_week, pegawai_id) VALUES
  -- Senin (kaylaazka, mira.merta)
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 1, '44444444-4444-4444-4444-444444444444'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 1, '55555555-5555-5555-5555-555555555555'),
  -- Selasa (nurmala.afriyana, arzudaqolbin)
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 2, '66666666-6666-6666-6666-666666666666'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 2, '22222222-2222-2222-2222-222222222222'),
  -- Rabu (langit.biru, kaylaazka)
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 3, '33333333-3333-3333-3333-333333333333'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 3, '44444444-4444-4444-4444-444444444444'),
  -- Kamis (mira.merta, nurmala.afriyana)
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 4, '55555555-5555-5555-5555-555555555555'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 4, '66666666-6666-6666-6666-666666666666'),
  -- Jumat (arzudaqolbin, langit.biru)
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 5, '22222222-2222-2222-2222-222222222222'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 5, '33333333-3333-3333-3333-333333333333')
ON CONFLICT DO NOTHING;

-- ============================================================
-- SECTION 6: ESKALASI
-- Sample data dengan berbagai status
-- ============================================================

-- INSERT INTO public.eskalasi (nomor_pelanggan, nama_pelanggan, keperluan, detail, pegawai_id, status, waktu_respons, created_at, handled_at) VALUES
--   (
--     '6281234567890',
--     'Ahmad Fauzi',
--     'Pengaduan Layanan',
--     'Saya ingin melaporkan bahwa data sensus yang dikirimkan ke alamat saya tidak sesuai dengan kondisi keluarga saya saat ini.',
--     '33333333-3333-3333-3333-333333333333',
--     'handled',
--     12,
--     now() - INTERVAL '3 hours',
--     now() - INTERVAL '2 hours 48 minutes'
--   ),
--   (
--     '6289876543210',
--     'Rina Marlina',
--     'Permintaan Informasi',
--     'Ingin mengetahui jadwal pelaksanaan survei pendapatan rumah tangga di wilayah saya.',
--     '22222222-2222-2222-2222-222222222222',
--     'closed',
--     8,
--     now() - INTERVAL '1 day',
--     now() - INTERVAL '23 hours 52 minutes'
--   ),
--   (
--     '6285551234567',
--     'Doni Setiawan',
--     'Administrasi',
--     'Memerlukan bantuan terkait pengisian kuesioner yang belum saya pahami formatnya.',
--     NULL,
--     'waiting',
--     NULL,
--     now() - INTERVAL '30 minutes',
--     NULL
--   ),
--   (
--     '6287771234567',
--     'Fitri Handayani',
--     'Pengaduan Layanan',
--     'Petugas yang datang ke rumah saya tidak memberikan tanda bukti kunjungan.',
--     NULL,
--     'waiting',
--     NULL,
--     now() - INTERVAL '15 minutes',
--     NULL
--   ),
--   (
--     '6282223456789',
--     'Hendra Kusuma',
--     'Permintaan Informasi',
--     'Ingin mendapatkan data statistik kependudukan Kabupaten Tangerang tahun 2024.',
--     '44444444-4444-4444-4444-444444444444',
--     'handled',
--     25,
--     now() - INTERVAL '5 hours',
--     now() - INTERVAL '4 hours 35 minutes'
--   )
-- ON CONFLICT DO NOTHING;

-- ============================================================
-- SECTION 7: RIWAYAT PELANGGAN
-- Sample 15 kontak masuk selama seminggu terakhir
-- ============================================================

-- INSERT INTO public.riwayat_pelanggan (nomor_hp, created_at) VALUES
--   ('6281234567890', now() - INTERVAL '0 hours'),
--   ('6289876543210', now() - INTERVAL '1 hour'),
--   ('6285551234567', now() - INTERVAL '2 hours'),
--   ('6287771234567', now() - INTERVAL '3 hours'),
--   ('6282223456789', now() - INTERVAL '4 hours'),
--   ('6281111222333', now() - INTERVAL '5 hours'),
--   ('6283334445556', now() - INTERVAL '1 day'),
--   ('6284445556667', now() - INTERVAL '1 day 2 hours'),
--   ('6281234567890', now() - INTERVAL '1 day 4 hours'), -- pelanggan yg sama, kontak ulang
--   ('6286667778889', now() - INTERVAL '2 days'),
--   ('6287778889990', now() - INTERVAL '2 days 1 hour'),
--   ('6288889990001', now() - INTERVAL '3 days'),
--   ('6289990001112', now() - INTERVAL '4 days'),
--   ('6281230001234', now() - INTERVAL '5 days'),
--   ('6282340001235', now() - INTERVAL '6 days')
-- ON CONFLICT DO NOTHING;
