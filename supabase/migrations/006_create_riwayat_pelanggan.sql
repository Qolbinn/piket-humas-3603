-- ============================================================
-- Migration 006: Create riwayat_pelanggan table
-- Mencatat setiap pelanggan yang memulai chat via chatbot
-- Digunakan untuk statistik "Total Percakapan Hari Ini"
-- ============================================================

CREATE TABLE IF NOT EXISTS public.riwayat_pelanggan (
  id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nomor_hp   TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index untuk query statistik harian
CREATE INDEX idx_riwayat_pelanggan_created_at ON public.riwayat_pelanggan(created_at DESC);
CREATE INDEX idx_riwayat_pelanggan_nomor_hp ON public.riwayat_pelanggan(nomor_hp);

-- Enable RLS
ALTER TABLE public.riwayat_pelanggan ENABLE ROW LEVEL SECURITY;

-- Authenticated user (petugas/admin) bisa melihat semua riwayat
CREATE POLICY "riwayat_pelanggan_select" ON public.riwayat_pelanggan
  FOR SELECT TO authenticated USING (true);

-- Insert dilakukan oleh bot menggunakan service_role key (bypass RLS)
-- Tidak perlu policy insert untuk authenticated user
