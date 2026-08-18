-- 1. Hapus SEMUA tabel di skema public secara dinamis
DO $$ 
DECLARE
  r RECORD;
BEGIN
  -- Cari semua nama tabel di dalam skema 'public'
  FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') 
  LOOP
    -- Eksekusi DROP TABLE CASCADE untuk setiap tabel yang ditemukan
    EXECUTE 'DROP TABLE IF EXISTS public.' || quote_ident(r.tablename) || ' CASCADE';
  END LOOP;
END $$;

-- 2. Bersihkan histori migrasi CLI
DELETE FROM supabase_migrations.schema_migrations;
