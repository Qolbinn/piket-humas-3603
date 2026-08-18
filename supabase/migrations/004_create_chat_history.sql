-- ============================================================
-- Migration 004: Create riwayat_chat_harian
-- ============================================================

CREATE TABLE IF NOT EXISTS public.riwayat_chat_harian (
  id               BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  lid_wa           TEXT NOT NULL,
  tanggal          DATE NOT NULL,
  waktu_first_chat TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (lid_wa, tanggal)
);

CREATE INDEX idx_riwayat_chat_harian_tanggal ON public.riwayat_chat_harian(tanggal DESC);
CREATE INDEX idx_riwayat_chat_harian_waktu ON public.riwayat_chat_harian(waktu_first_chat DESC);

ALTER TABLE public.riwayat_chat_harian ENABLE ROW LEVEL SECURITY;

CREATE POLICY "riwayat_chat_harian_select" ON public.riwayat_chat_harian 
  FOR SELECT TO authenticated USING (true);
