-- ============================================================
-- SEED DATA — Piket Humas
-- Jalankan SETELAH semua migration berhasil
-- ============================================================

-- 0. Enable pgcrypto untuk hashing password
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. SECTION: AUTH USERS & IDENTITIES
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
    '00000003-0000-0000-0000-000000000003', -- yosep.bangun
    '00000008-0000-0000-0000-000000000008', -- nuraisyah
    '00000015-0000-0000-0000-000000000015'  -- msy.nourma
  ];
  emails TEXT[] := ARRAY[
    'humasbps3603@gmail.com',
    'arzudaqolbin@bps.go.id',
    'langit.biru@bps.go.id',
    'kaylaazka@bps.go.id',
    'mira.merta@bps.go.id',
    'nurmala.afriyana@bps.go.id',
    'hmaulana@bps.go.id',
    'yosep.bangun@bps.go.id',
    'nuraisyah@bps.go.id',
    'msy.nourma@bps.go.id'
  ];
  passwords TEXT[] := ARRAY[
    'humasbps3603',
    'arzudaqolbin',
    'langit.biru',
    'kaylaazka',
    'mira.merta',
    'nurmala.afriyana',
    'hmaulana',
    'yosep.bangun',
    'nuraisyah',
    'msy.nourma'
  ];
BEGIN
  FOR i IN 1..10 LOOP
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

INSERT INTO public.pegawai (id, name, username, email, phone, lid_wa, gender, role) VALUES
  ('11111111-1111-1111-1111-111111111111', 'humasbps3603',        'humasbps3603',     'humasbps3603@gmail.com',     NULL, NULL, 'P', 'admin'),
  ('22222222-2222-2222-2222-222222222222', 'Arzuda Qolbin',       'arzudaqolbin',     'arzudaqolbin@bps.go.id',     NULL, NULL, 'L', 'petugas'),
  ('33333333-3333-3333-3333-333333333333', 'Pelangi Langit Biru', 'langit.biru',      'langit.biru@bps.go.id',      NULL, NULL, 'P', 'petugas'),
  ('44444444-4444-4444-4444-444444444444', 'Kayla Azka',          'kaylaazka',        'kaylaazka@bps.go.id',        NULL, NULL, 'P', 'petugas'),
  ('55555555-5555-5555-5555-555555555555', 'Mira Merta',          'mira.merta',       'mira.merta@bps.go.id',       NULL, NULL, 'P', 'petugas'),
  ('66666666-6666-6666-6666-666666666666', 'Nurmala Afriyana',    'nurmala.afriyana', 'nurmala.afriyana@bps.go.id', NULL, NULL, 'P', 'petugas'),
  ('00000001-0000-0000-0000-000000000001', 'Husin Maulana',       'hmaulana',         'hmaulana@bps.go.id',         NULL, NULL, 'L', 'pimpinan'),
  ('00000003-0000-0000-0000-000000000003', 'Yosep Bangun',        'yosep.bangun',     'yosep.bangun@bps.go.id',     NULL, NULL, 'L', 'petugas'),
  ('00000008-0000-0000-0000-000000000008', 'Nuraisyah',           'nuraisyah',        'nuraisyah@bps.go.id',        NULL, NULL, 'P', 'petugas'),
  ('00000015-0000-0000-0000-000000000015', 'Msy Nourma',          'msy.nourma',       'msy.nourma@bps.go.id',       NULL, NULL, 'P', 'petugas')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- SECTION 3: KATEGORI LAYANAN
-- ============================================================
INSERT INTO public.kategori_layanan (id, kode, nama) VALUES
  ('c1111111-1111-1111-1111-111111111111', '1', 'Permintaan Data'),
  ('c2222222-2222-2222-2222-222222222222', '2', 'Konsultasi Statistik'),
  ('c3333333-3333-3333-3333-333333333333', '99', 'Pengaduan')
ON CONFLICT (nama) DO NOTHING;

-- ============================================================
-- SECTION 4: TEMPLATE PIKET (Kosong sementara)
-- ============================================================
-- Kita biarkan kosong dulu karena sisa user sedikit, 
-- UI Web App nanti yang akan dipakai untuk membuat template.
