-- ============================================================
-- Migration 004: Create jadwal_piket table
-- Jadwal piket aktual per tanggal (hasil dari assign template)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.jadwal_piket (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tanggal     DATE NOT NULL,
  pegawai_id  UUID NOT NULL REFERENCES public.pegawai(id) ON DELETE CASCADE,
  template_id UUID REFERENCES public.template(id) ON DELETE SET NULL,
  -- nullable: bisa assign manual tanpa template
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index untuk query kalender (filter by bulan/tanggal)
CREATE INDEX idx_jadwal_piket_tanggal ON public.jadwal_piket(tanggal);
CREATE INDEX idx_jadwal_piket_pegawai_id ON public.jadwal_piket(pegawai_id);

-- Unique: satu pegawai hanya 1x piket per tanggal
CREATE UNIQUE INDEX idx_jadwal_piket_unique
  ON public.jadwal_piket(tanggal, pegawai_id);

-- Enable RLS
ALTER TABLE public.jadwal_piket ENABLE ROW LEVEL SECURITY;

CREATE POLICY "jadwal_piket_select" ON public.jadwal_piket
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "jadwal_piket_insert" ON public.jadwal_piket
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "jadwal_piket_update" ON public.jadwal_piket
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "jadwal_piket_delete" ON public.jadwal_piket
  FOR DELETE TO authenticated USING (true);
