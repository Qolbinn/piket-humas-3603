-- ============================================================
-- SEED DATA — Piket Humas
-- Jalankan SETELAH semua migration berhasil
-- CATATAN: Data pegawai memerlukan Supabase Auth user terlebih dahulu.
-- Untuk development, insert langsung ke tabel tanpa auth.users
-- dengan cara disable trigger atau insert manual via Supabase Dashboard.
-- ============================================================

-- ============================================================
-- SECTION 1: PEGAWAI
-- UUID sudah ditentukan agar seeder bisa di-referensikan oleh tabel lain
-- ============================================================

INSERT INTO public.pegawai (id, name, username, email, gender, role) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Budi Santoso',  'budisantoso',  'budi.santoso@bps.go.id',   'L', 'admin'),
  ('22222222-2222-2222-2222-222222222222', 'Siti Aminah',   'sitiaminah',   'siti.aminah@bps.go.id',    'P', 'petugas'),
  ('33333333-3333-3333-3333-333333333333', 'Andi Permana',  'andipermana',  'andi.permana@bps.go.id',   'L', 'petugas'),
  ('44444444-4444-4444-4444-444444444444', 'Rina Kartika',  'rinakartika',  'rina.kartika@bps.go.id',   'P', 'petugas'),
  ('55555555-5555-5555-5555-555555555555', 'Dewi Lestari',  'dewilestari',  'dewi.lestari@bps.go.id',   'P', 'petugas')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- SECTION 2: TEMPLATE ALOKASI
-- ============================================================

INSERT INTO public.template (id, name) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Template Tim Alpha (Utama)'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Template Tim Beta (Cadangan)')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- SECTION 3: TEMPLATE DETAIL
-- day_of_week: 1=Senin, 2=Selasa, 3=Rabu, 4=Kamis, 5=Jumat
-- Max 3 pegawai per hari per template
-- ============================================================

-- Tim Alpha
INSERT INTO public.template_detail (template_id, day_of_week, pegawai_id) VALUES
  -- Senin
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 1, '11111111-1111-1111-1111-111111111111'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 1, '44444444-4444-4444-4444-444444444444'),
  -- Selasa
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 2, '33333333-3333-3333-3333-333333333333'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 2, '55555555-5555-5555-5555-555555555555'),
  -- Rabu
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 3, '11111111-1111-1111-1111-111111111111'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 3, '22222222-2222-2222-2222-222222222222'),
  -- Kamis
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 4, '33333333-3333-3333-3333-333333333333'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 4, '44444444-4444-4444-4444-444444444444'),
  -- Jumat
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 5, '22222222-2222-2222-2222-222222222222'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 5, '55555555-5555-5555-5555-555555555555'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 5, '11111111-1111-1111-1111-111111111111')
ON CONFLICT DO NOTHING;

-- Tim Beta
INSERT INTO public.template_detail (template_id, day_of_week, pegawai_id) VALUES
  -- Senin
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 1, '33333333-3333-3333-3333-333333333333'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 1, '22222222-2222-2222-2222-222222222222'),
  -- Selasa
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 2, '11111111-1111-1111-1111-111111111111'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 2, '44444444-4444-4444-4444-444444444444'),
  -- Rabu
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 3, '55555555-5555-5555-5555-555555555555'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 3, '33333333-3333-3333-3333-333333333333'),
  -- Kamis
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 4, '11111111-1111-1111-1111-111111111111'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 4, '22222222-2222-2222-2222-222222222222'),
  -- Jumat
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 5, '44444444-4444-4444-4444-444444444444'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 5, '55555555-5555-5555-5555-555555555555')
ON CONFLICT DO NOTHING;

-- ============================================================
-- SECTION 4: JADWAL PIKET
-- Sample jadwal bulan berjalan (Mei 2026)
-- ============================================================

INSERT INTO public.jadwal_piket (tanggal, pegawai_id, template_id) VALUES
  -- Minggu 1
  ('2026-05-05', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
  ('2026-05-05', '44444444-4444-4444-4444-444444444444', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
  ('2026-05-06', '33333333-3333-3333-3333-333333333333', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
  ('2026-05-06', '55555555-5555-5555-5555-555555555555', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
  ('2026-05-07', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
  ('2026-05-07', '22222222-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
  ('2026-05-08', '33333333-3333-3333-3333-333333333333', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
  ('2026-05-08', '44444444-4444-4444-4444-444444444444', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
  ('2026-05-09', '22222222-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
  ('2026-05-09', '55555555-5555-5555-5555-555555555555', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
  ('2026-05-09', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
  -- Minggu 2
  ('2026-05-12', '33333333-3333-3333-3333-333333333333', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
  ('2026-05-12', '22222222-2222-2222-2222-222222222222', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
  ('2026-05-13', '11111111-1111-1111-1111-111111111111', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
  ('2026-05-13', '44444444-4444-4444-4444-444444444444', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
  ('2026-05-14', '55555555-5555-5555-5555-555555555555', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
  ('2026-05-14', '33333333-3333-3333-3333-333333333333', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
  ('2026-05-15', '11111111-1111-1111-1111-111111111111', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
  ('2026-05-15', '22222222-2222-2222-2222-222222222222', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
  ('2026-05-16', '44444444-4444-4444-4444-444444444444', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
  ('2026-05-16', '55555555-5555-5555-5555-555555555555', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb')
ON CONFLICT DO NOTHING;

-- ============================================================
-- SECTION 5: ESKALASI
-- Sample data dengan berbagai status
-- ============================================================

INSERT INTO public.eskalasi (nomor_pelanggan, nama_pelanggan, keperluan, detail, pegawai_id, status, waktu_respons, created_at, handled_at) VALUES
  (
    '6281234567890',
    'Ahmad Fauzi',
    'Pengaduan Layanan',
    'Saya ingin melaporkan bahwa data sensus yang dikirimkan ke alamat saya tidak sesuai dengan kondisi keluarga saya saat ini.',
    '33333333-3333-3333-3333-333333333333',
    'handled',
    12,
    now() - INTERVAL '3 hours',
    now() - INTERVAL '2 hours 48 minutes'
  ),
  (
    '6289876543210',
    'Rina Marlina',
    'Permintaan Informasi',
    'Ingin mengetahui jadwal pelaksanaan survei pendapatan rumah tangga di wilayah saya.',
    '22222222-2222-2222-2222-222222222222',
    'closed',
    8,
    now() - INTERVAL '1 day',
    now() - INTERVAL '23 hours 52 minutes'
  ),
  (
    '6285551234567',
    'Doni Setiawan',
    'Administrasi',
    'Memerlukan bantuan terkait pengisian kuesioner yang belum saya pahami formatnya.',
    NULL,
    'waiting',
    NULL,
    now() - INTERVAL '30 minutes',
    NULL
  ),
  (
    '6287771234567',
    'Fitri Handayani',
    'Pengaduan Layanan',
    'Petugas yang datang ke rumah saya tidak memberikan tanda bukti kunjungan.',
    NULL,
    'waiting',
    NULL,
    now() - INTERVAL '15 minutes',
    NULL
  ),
  (
    '6282223456789',
    'Hendra Kusuma',
    'Permintaan Informasi',
    'Ingin mendapatkan data statistik kependudukan Kabupaten Tangerang tahun 2024.',
    '44444444-4444-4444-4444-444444444444',
    'handled',
    25,
    now() - INTERVAL '5 hours',
    now() - INTERVAL '4 hours 35 minutes'
  )
ON CONFLICT DO NOTHING;

-- ============================================================
-- SECTION 6: RIWAYAT PELANGGAN
-- Sample 15 kontak masuk selama seminggu terakhir
-- ============================================================

INSERT INTO public.riwayat_pelanggan (nomor_hp, created_at) VALUES
  ('6281234567890', now() - INTERVAL '0 hours'),
  ('6289876543210', now() - INTERVAL '1 hour'),
  ('6285551234567', now() - INTERVAL '2 hours'),
  ('6287771234567', now() - INTERVAL '3 hours'),
  ('6282223456789', now() - INTERVAL '4 hours'),
  ('6281111222333', now() - INTERVAL '5 hours'),
  ('6283334445556', now() - INTERVAL '1 day'),
  ('6284445556667', now() - INTERVAL '1 day 2 hours'),
  ('6281234567890', now() - INTERVAL '1 day 4 hours'), -- pelanggan yg sama, kontak ulang
  ('6286667778889', now() - INTERVAL '2 days'),
  ('6287778889990', now() - INTERVAL '2 days 1 hour'),
  ('6288889990001', now() - INTERVAL '3 days'),
  ('6289990001112', now() - INTERVAL '4 days'),
  ('6281230001234', now() - INTERVAL '5 days'),
  ('6282340001235', now() - INTERVAL '6 days')
ON CONFLICT DO NOTHING;
