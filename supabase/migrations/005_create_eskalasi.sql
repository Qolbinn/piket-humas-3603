-- ============================================================
-- Migration 005: Create eskalasi table
-- Request pelanggan untuk mengobrol dengan petugas
-- ============================================================

CREATE TABLE IF NOT EXISTS public.eskalasi (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nomor_pelanggan  TEXT NOT NULL,
  nama_pelanggan   TEXT NOT NULL,
  keperluan        TEXT NOT NULL,
  detail           TEXT,
  -- detail/longtext, nullable
  pegawai_id       UUID REFERENCES public.pegawai(id) ON DELETE SET NULL,
  -- nullable: belum ditangani siapapun
  status           TEXT NOT NULL DEFAULT 'waiting'
                   CHECK (status IN ('waiting', 'handled', 'closed')),
  waktu_respons    INTEGER,
  -- nullable, dalam satuan menit, logika pengisian menyusul
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  handled_at       TIMESTAMPTZ
  -- nullable: diisi saat status berubah ke 'handled'
);

-- Index untuk filtering status & sorting terbaru
CREATE INDEX idx_eskalasi_status ON public.eskalasi(status);
CREATE INDEX idx_eskalasi_created_at ON public.eskalasi(created_at DESC);
CREATE INDEX idx_eskalasi_pegawai_id ON public.eskalasi(pegawai_id);

-- Enable RLS
ALTER TABLE public.eskalasi ENABLE ROW LEVEL SECURITY;

-- Semua authenticated user bisa melihat eskalasi
CREATE POLICY "eskalasi_select" ON public.eskalasi
  FOR SELECT TO authenticated USING (true);

-- Bot (service_role) bisa insert; semua authenticated user bisa update status
CREATE POLICY "eskalasi_insert" ON public.eskalasi
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "eskalasi_update" ON public.eskalasi
  FOR UPDATE TO authenticated USING (true);

-- Enable Realtime untuk notifikasi push ke dashboard
ALTER PUBLICATION supabase_realtime ADD TABLE public.eskalasi;
